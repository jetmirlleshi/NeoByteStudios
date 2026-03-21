import { NextRequest, NextResponse } from "next/server";
import {
  db,
  nbwProjects,
  nbwWorldRules,
  eq,
  and,
  isNull,
} from "@neobytestudios/db";
import {
  getAuthSession,
  unauthorized,
  notFound,
  badRequest,
} from "@/lib/api-helpers";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ ruleId: string }> };

// Helper: get world rule with ownership verification through its project
async function getOwnedRule(ruleId: string, userId: string) {
  const [rule] = await db
    .select()
    .from(nbwWorldRules)
    .where(eq(nbwWorldRules.id, ruleId));

  if (!rule) return null;

  // Verify project ownership
  const [project] = await db
    .select()
    .from(nbwProjects)
    .where(
      and(
        eq(nbwProjects.id, rule.projectId),
        eq(nbwProjects.userId, userId),
        isNull(nbwProjects.deletedAt)
      )
    );

  if (!project) return null;

  return rule;
}

// GET /api/world-rules/[ruleId] — Get a single world rule
export async function GET(_request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { ruleId } = await context.params;
  const rule = await getOwnedRule(ruleId, session.user.id);
  if (!rule) return notFound("World rule not found");

  return NextResponse.json({ rule });
}

// PATCH /api/world-rules/[ruleId] — Update world rule fields
export async function PATCH(request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { ruleId } = await context.params;
  const rule = await getOwnedRule(ruleId, session.user.id);
  if (!rule) return notFound("World rule not found");

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  const allowedFields = [
    "rule",
    "explanation",
    "category",
    "isStrict",
  ] as const;

  const updates: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (field in body) {
      updates[field] = body[field];
    }
  }

  if (Object.keys(updates).length === 0) {
    return badRequest("No valid fields to update");
  }

  updates.updatedAt = new Date();

  const [updated] = await db
    .update(nbwWorldRules)
    .set(updates)
    .where(eq(nbwWorldRules.id, ruleId))
    .returning();

  return NextResponse.json({ rule: updated });
}

// DELETE /api/world-rules/[ruleId] — Hard delete a world rule
export async function DELETE(_request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { ruleId } = await context.params;
  const rule = await getOwnedRule(ruleId, session.user.id);
  if (!rule) return notFound("World rule not found");

  await db.delete(nbwWorldRules).where(eq(nbwWorldRules.id, ruleId));

  return NextResponse.json({ success: true });
}
