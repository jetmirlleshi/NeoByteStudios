// ---------------------------------------------------------------------------
// POST /api/ai/coherence - Run coherence check (Tier 2 or Tier 3)
// ---------------------------------------------------------------------------

import { NextRequest, NextResponse } from "next/server";
import {
  db,
  nbwProjects,
  nbwCoherenceAlerts,
  eq,
  and,
  isNull,
} from "@neobytestudios/db";
import type { NewNbwCoherenceAlert } from "@neobytestudios/db";
import {
  getAuthSession,
  unauthorized,
  badRequest,
  notFound,
} from "@/lib/api-helpers";
import { runTier2Check } from "@/lib/ai/coherence/tier2-haiku";
import { runTier3Analysis } from "@/lib/ai/coherence/tier3-sonnet";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// --- Request body type ---

interface CoherenceRequestBody {
  projectId: string;
  chapterId: string;
  text?: string;
  tier: 2 | 3;
  contextBefore?: string;
  contextAfter?: string;
}

// --- Helpers ---

async function getOwnedProject(projectId: string, userId: string) {
  const [project] = await db
    .select()
    .from(nbwProjects)
    .where(
      and(
        eq(nbwProjects.id, projectId),
        eq(nbwProjects.userId, userId),
        isNull(nbwProjects.deletedAt)
      )
    );
  return project ?? null;
}

// --- POST handler ---

export async function POST(request: NextRequest) {
  // Auth check
  const session = await getAuthSession();
  if (!session) return unauthorized();

  // Parse body
  let body: CoherenceRequestBody;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  // Validate required fields
  if (!body.projectId || typeof body.projectId !== "string") {
    return badRequest("projectId is required");
  }
  if (!body.chapterId || typeof body.chapterId !== "string") {
    return badRequest("chapterId is required");
  }
  if (body.tier !== 2 && body.tier !== 3) {
    return badRequest("tier must be 2 or 3");
  }

  // For Tier 2, text is required
  if (body.tier === 2 && (!body.text || typeof body.text !== "string")) {
    return badRequest("text is required for Tier 2 checks");
  }

  // Validate project ownership
  const project = await getOwnedProject(body.projectId, session.user.id);
  if (!project) return notFound("Project not found");

  try {
    if (body.tier === 2) {
      // --- Tier 2: Haiku lightweight check ---
      const alerts = await runTier2Check({
        projectId: body.projectId,
        chapterId: body.chapterId,
        text: body.text!,
        contextBefore: body.contextBefore,
        contextAfter: body.contextAfter,
      });

      return NextResponse.json({ alerts });
    }

    // --- Tier 3: Sonnet deep analysis ---
    const alerts = await runTier3Analysis({
      projectId: body.projectId,
      chapterId: body.chapterId,
    });

    // Persist Tier 3 alerts to database
    if (alerts.length > 0) {
      const alertRecords: NewNbwCoherenceAlert[] = alerts.map((alert) => ({
        projectId: body.projectId,
        type: alert.type,
        severity: alert.severity,
        title: alert.title,
        description: alert.description,
        chapterId: body.chapterId,
        characterId: alert.characterId ?? null,
        textSnippet: alert.textSnippet || null,
        suggestion: alert.suggestion || null,
        status: "OPEN" as const,
      }));

      await db.insert(nbwCoherenceAlerts).values(alertRecords);
    }

    return NextResponse.json({ alerts });
  } catch (error) {
    console.error("[AI Coherence] Error running coherence check:", error);

    const message =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { error: `Coherence check failed: ${message}` },
      { status: 500 }
    );
  }
}
