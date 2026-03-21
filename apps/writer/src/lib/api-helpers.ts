import { auth } from "@/lib/auth/server";
import { NextResponse } from "next/server";

export async function getAuthSession() {
  const { data: session } = await auth.getSession();
  return session;
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export function notFound(message = "Not found") {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function conflict(message: string) {
  return NextResponse.json({ error: message }, { status: 409 });
}

// Tier project limits (FREE until billing is implemented)
const PROJECT_LIMITS: Record<string, number> = {
  FREE: 2,
  WRITER: 10,
  PROFESSIONAL: Infinity,
};

export function getProjectLimit(tier: string = "FREE"): number {
  return PROJECT_LIMITS[tier] ?? PROJECT_LIMITS.FREE;
}
