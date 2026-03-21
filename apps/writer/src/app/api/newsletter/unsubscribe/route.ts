import { NextRequest, NextResponse } from "next/server";
import {
  db,
  eq,
  nbwNewsletterSubscribers,
} from "@neobytestudios/db";

export const dynamic = "force-dynamic";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/newsletter/unsubscribe — Unsubscribe from newsletter (public)
export async function POST(request: NextRequest) {
  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Corpo della richiesta non valido" },
      { status: 400 }
    );
  }

  const email = body.email?.trim().toLowerCase();

  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json(
      { error: "Indirizzo email non valido" },
      { status: 400 }
    );
  }

  // Find subscriber
  const [existing] = await db
    .select()
    .from(nbwNewsletterSubscribers)
    .where(eq(nbwNewsletterSubscribers.email, email))
    .limit(1);

  if (!existing) {
    return NextResponse.json(
      { message: "Email non trovata nella nostra lista" },
      { status: 404 }
    );
  }

  if (existing.unsubscribedAt) {
    return NextResponse.json(
      { message: "L'iscrizione è già stata annullata" },
      { status: 200 }
    );
  }

  // Mark as unsubscribed
  const [updated] = await db
    .update(nbwNewsletterSubscribers)
    .set({
      unsubscribedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(nbwNewsletterSubscribers.id, existing.id))
    .returning();

  return NextResponse.json(
    { message: "Iscrizione annullata con successo", subscriber: updated },
    { status: 200 }
  );
}
