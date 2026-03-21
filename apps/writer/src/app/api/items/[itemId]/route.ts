import { NextRequest, NextResponse } from "next/server";
import {
  db,
  nbwProjects,
  nbwItems,
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

type RouteContext = { params: Promise<{ itemId: string }> };

// Helper: get item with ownership verification through its project
async function getOwnedItem(itemId: string, userId: string) {
  const [item] = await db
    .select()
    .from(nbwItems)
    .where(
      and(
        eq(nbwItems.id, itemId),
        isNull(nbwItems.deletedAt)
      )
    );

  if (!item) return null;

  // Verify project ownership
  const [project] = await db
    .select()
    .from(nbwProjects)
    .where(
      and(
        eq(nbwProjects.id, item.projectId),
        eq(nbwProjects.userId, userId),
        isNull(nbwProjects.deletedAt)
      )
    );

  if (!project) return null;

  return item;
}

// GET /api/items/[itemId] — Get a single item
export async function GET(_request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { itemId } = await context.params;
  const item = await getOwnedItem(itemId, session.user.id);
  if (!item) return notFound("Item not found");

  return NextResponse.json({ item });
}

// PATCH /api/items/[itemId] — Update item fields
export async function PATCH(request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { itemId } = await context.params;
  const item = await getOwnedItem(itemId, session.user.id);
  if (!item) return notFound("Item not found");

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid JSON body");
  }

  // Allow updating any item field except id, projectId, createdAt
  const allowedFields = [
    "name",
    "type",
    "description",
    "appearance",
    "powers",
    "weaknesses",
    "origin",
    "history",
    "currentOwner",
    "ownerHistory",
    "importance",
    "imageUrl",
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
    .update(nbwItems)
    .set(updates)
    .where(eq(nbwItems.id, itemId))
    .returning();

  return NextResponse.json({ item: updated });
}

// DELETE /api/items/[itemId] — Soft-delete an item
export async function DELETE(_request: NextRequest, context: RouteContext) {
  const session = await getAuthSession();
  if (!session) return unauthorized();

  const { itemId } = await context.params;
  const item = await getOwnedItem(itemId, session.user.id);
  if (!item) return notFound("Item not found");

  await db
    .update(nbwItems)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(nbwItems.id, itemId));

  return NextResponse.json({ success: true });
}
