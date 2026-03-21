import Anthropic from "@anthropic-ai/sdk";
import type { MessageCreateParamsNonStreaming } from "@anthropic-ai/sdk/resources/messages";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const MODEL_SONNET = "claude-sonnet-4-5-20250514" as const;
export const MODEL_HAIKU = "claude-haiku-4-5-20241022" as const;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ClaudeModel = typeof MODEL_SONNET | typeof MODEL_HAIKU;

export interface GenerateParams {
  /** Which Claude model to use */
  model?: ClaudeModel;
  /** System prompt (instructions for the model) */
  system?: string;
  /** Conversation messages */
  messages: Anthropic.MessageParam[];
  /** Maximum tokens to generate */
  maxTokens?: number;
  /** Sampling temperature (0-1) */
  temperature?: number;
  /** Stop sequences */
  stopSequences?: string[];
}

export interface StreamParams extends GenerateParams {
  /** Callback fired for every text chunk received */
  onText?: (text: string) => void;
}

// ---------------------------------------------------------------------------
// Singleton client
// ---------------------------------------------------------------------------

let _client: Anthropic | null = null;

/**
 * Returns a lazily-initialised Anthropic client singleton.
 * Throws a descriptive error if the API key is missing.
 */
export function getAnthropicClient(): Anthropic {
  if (!_client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error(
        "[AI] Missing ANTHROPIC_API_KEY environment variable. " +
          "Set it in your .env file to use Claude."
      );
    }
    _client = new Anthropic({ apiKey });
  }
  return _client;
}

// ---------------------------------------------------------------------------
// Retry helper
// ---------------------------------------------------------------------------

const MAX_RETRIES = 3;
const BACKOFF_MS = [1_000, 2_000, 4_000];

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      lastError = error;

      // Don't retry on client errors (4xx) except 429 (rate limit) and 529 (overloaded)
      if (error instanceof Anthropic.APIError) {
        const status = error.status;
        if (status !== undefined && status >= 400 && status < 500 && status !== 429) {
          throw error;
        }
      }

      // Last attempt — don't sleep, just throw
      if (attempt === MAX_RETRIES - 1) break;

      await sleep(BACKOFF_MS[attempt]!);
    }
  }

  throw lastError;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Generate a complete (non-streaming) response from Claude.
 * Automatically retries up to 3 times with exponential backoff (1s/2s/4s).
 */
export async function generateWithClaude(
  params: GenerateParams
): Promise<Anthropic.Message> {
  const client = getAnthropicClient();

  const body: MessageCreateParamsNonStreaming = {
    model: params.model ?? MODEL_SONNET,
    max_tokens: params.maxTokens ?? 4_096,
    messages: params.messages,
    ...(params.system ? { system: params.system } : {}),
    ...(params.temperature !== undefined
      ? { temperature: params.temperature }
      : {}),
    ...(params.stopSequences?.length
      ? { stop_sequences: params.stopSequences }
      : {}),
  };

  return withRetry(() => client.messages.create(body));
}

/**
 * Stream a response from Claude. Returns the complete accumulated message.
 * Use the `onText` callback to receive text chunks as they arrive.
 * Automatically retries up to 3 times with exponential backoff (1s/2s/4s).
 */
export async function streamWithClaude(
  params: StreamParams
): Promise<Anthropic.Message> {
  const client = getAnthropicClient();

  const body = {
    model: params.model ?? MODEL_SONNET,
    max_tokens: params.maxTokens ?? 4_096,
    messages: params.messages,
    stream: true as const,
    ...(params.system ? { system: params.system } : {}),
    ...(params.temperature !== undefined
      ? { temperature: params.temperature }
      : {}),
    ...(params.stopSequences?.length
      ? { stop_sequences: params.stopSequences }
      : {}),
  };

  return withRetry(async () => {
    const stream = client.messages.stream(body);

    if (params.onText) {
      stream.on("text", params.onText);
    }

    return stream.finalMessage();
  });
}
