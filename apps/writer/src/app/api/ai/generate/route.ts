// ---------------------------------------------------------------------------
// POST /api/ai/generate — SSE streaming text generation
// ---------------------------------------------------------------------------

import { NextRequest } from "next/server";
import {
  getAuthSession,
  unauthorized,
  badRequest,
} from "@/lib/api-helpers";
import { getAnthropicClient, MODEL_HAIKU } from "@/lib/ai/llm";
import {
  checkAiRateLimit,
  AI_LIMITS,
  rateLimitHeaders,
} from "@/lib/ai/rate-limit";
import { buildGenerationContext } from "@/lib/ai/context-builder";
import type { GenerationType } from "@/lib/ai/prompts";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const VALID_TYPES = new Set<GenerationType>([
  "continue",
  "dialogue",
  "description",
  "action",
  "transition",
  "flashback",
]);

interface GenerateBody {
  projectId?: string;
  chapterId?: string;
  type?: string;
  recentText?: string;
  instruction?: string;
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  // --- Auth ---
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const userId = session.user.id;

  // --- Rate limit ---
  const rateLimit = await checkAiRateLimit(userId, "FREE");
  const limit = AI_LIMITS.FREE!;

  if (!rateLimit.allowed) {
    return new Response(
      JSON.stringify({
        error: "Rate limit exceeded. Try again tomorrow.",
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          ...rateLimitHeaders(rateLimit.remaining, limit, rateLimit.resetAt),
        },
      }
    );
  }

  // --- Parse body ---
  let body: GenerateBody;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const { projectId, chapterId, type, recentText, instruction } = body;

  if (!projectId?.trim()) return badRequest("projectId is required");
  if (!chapterId?.trim()) return badRequest("chapterId is required");
  if (!type || !VALID_TYPES.has(type as GenerationType)) {
    return badRequest(
      `type must be one of: ${Array.from(VALID_TYPES).join(", ")}`
    );
  }
  if (!recentText?.trim()) return badRequest("recentText is required");

  // --- Build context ---
  let context: Awaited<ReturnType<typeof buildGenerationContext>>;
  try {
    context = await buildGenerationContext({
      projectId,
      chapterId,
      generationType: type as GenerationType,
      recentText,
      userInstruction: instruction,
    });
  } catch (error) {
    console.error("[AI Generate] Context build failed:", error);
    return badRequest(
      error instanceof Error ? error.message : "Failed to build context"
    );
  }

  // --- Stream response via SSE ---
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const client = getAnthropicClient();

        const anthropicStream = client.messages.stream({
          model: MODEL_HAIKU,
          max_tokens: 2_048,
          system: context.systemPrompt,
          messages: context.messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          temperature: 0.7,
        });

        // Forward text chunks as SSE events
        anthropicStream.on("text", (text) => {
          const event = `data: ${JSON.stringify({ text })}\n\n`;
          controller.enqueue(encoder.encode(event));
        });

        // Wait for the final message to get token usage
        const finalMessage = await anthropicStream.finalMessage();
        const totalTokens =
          (finalMessage.usage?.input_tokens ?? 0) +
          (finalMessage.usage?.output_tokens ?? 0);

        // Send completion event
        const doneEvent = `data: ${JSON.stringify({ done: true, totalTokens })}\n\n`;
        controller.enqueue(encoder.encode(doneEvent));
      } catch (error) {
        console.error("[AI Generate] Stream error:", error);

        const errorMessage =
          error instanceof Error ? error.message : "Generation failed";
        const errorEvent = `data: ${JSON.stringify({ error: errorMessage })}\n\n`;
        controller.enqueue(encoder.encode(errorEvent));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      ...rateLimitHeaders(rateLimit.remaining, limit, rateLimit.resetAt),
    },
  });
}
