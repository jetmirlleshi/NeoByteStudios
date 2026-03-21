// ---------------------------------------------------------------------------
// GET & PATCH /api/ai/coherence/alerts - Manage coherence alerts
// ---------------------------------------------------------------------------

import { NextRequest, NextResponse } from "next/server";
import {
  db,
  nbwProjects,
  nbwCoherenceAlerts,
  eq,
  and,
  isNull,
  desc,
} from "@neobytestudios/db";
import type { NbwCoherenceAlert } from "@neobytestudios/db";
import {
  getAuthSession,
  unauthorized,
  badRequest,
  notFound,
} from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

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

// --- GET handler ---

/**
 * GET /api/ai/coherence/alerts?projectId=xxx&status=OPEN&chapterId=xxx
 *
 * Fetches coherence alerts for a project.
 * - projectId (required): the project to fetch alerts for
 * - status (optional): filter by alert status (OPEN, IGNORED, RESOLVED)
 * - chapterId (optional): filter by chapter
 */
export async function GET(request: NextRequest) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  const status = searchParams.get("status");
  const chapterId = searchParams.get("chapterId");

  if (!projectId) {
    return badRequest("projectId query parameter is required");
  }

  // Verify project ownership
  const project = await getOwnedProject(projectId, session.user.id);
  if (!project) return notFound("Project not found");

  // Build conditions
  const conditions = [eq(nbwCoherenceAlerts.projectId, projectId)];

  if (status) {
    const validStatuses = ["OPEN", "IGNORED", "RESOLVED"];
    if (!validStatuses.includes(status.toUpperCase())) {
      return badRequest("status must be OPEN, IGNORED, or RESOLVED");
    }
    conditions.push(
      eq(
        nbwCoherenceAlerts.status,
        status.toUpperCase() as NbwCoherenceAlert["status"]
      )
    );
  }

  if (chapterId) {
    conditions.push(eq(nbwCoherenceAlerts.chapterId, chapterId));
  }

  const alerts = await db
    .select()
    .from(nbwCoherenceAlerts)
    .where(and(...conditions))
    .orderBy(desc(nbwCoherenceAlerts.createdAt));

  return NextResponse.json({ alerts });
}

// --- PATCH handler ---

/**
 * PATCH /api/ai/coherence/alerts
 * Body: { alertId, status: "IGNORED" | "RESOLVED", resolution?: string }
 *
 * Updates an alert's status. Sets resolvedAt when status is RESOLVED.
 */
export async function PATCH(request: NextRequest) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  let body: { alertId: string; status: string; resolution?: string };
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  if (!body.alertId || typeof body.alertId !== "string") {
    return badRequest("alertId is required");
  }

  const validStatuses = ["IGNORED", "RESOLVED"];
  if (!body.status || !validStatuses.includes(body.status.toUpperCase())) {
    return badRequest("status must be IGNORED or RESOLVED");
  }

  // Fetch the alert first
  const [existingAlert] = await db
    .select()
    .from(nbwCoherenceAlerts)
    .where(eq(nbwCoherenceAlerts.id, body.alertId));

  if (!existingAlert) {
    return notFound("Alert not found");
  }

  // Verify project ownership through the alert's project
  const project = await getOwnedProject(
    existingAlert.projectId,
    session.user.id
  );
  if (!project) return notFound("Alert not found");

  // Build update values
  const newStatus = body.status.toUpperCase() as "IGNORED" | "RESOLVED";
  const updateValues: Record<string, unknown> = {
    status: newStatus,
    updatedAt: new Date(),
  };

  if (newStatus === "RESOLVED") {
    updateValues.resolvedAt = new Date();
    if (body.resolution && typeof body.resolution === "string") {
      updateValues.resolution = body.resolution;
    }
  }

  const [updatedAlert] = await db
    .update(nbwCoherenceAlerts)
    .set(updateValues)
    .where(eq(nbwCoherenceAlerts.id, body.alertId))
    .returning();

  return NextResponse.json({ alert: updatedAlert });
}
