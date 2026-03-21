import { NextRequest, NextResponse } from "next/server";
import {
  db,
  eq,
  nbwNewsletterSubscribers,
} from "@neobytestudios/db";

export const dynamic = "force-dynamic";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/newsletter/subscribe — Subscribe to newsletter (public)
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

  // Check if subscriber already exists
  const [existing] = await db
    .select()
    .from(nbwNewsletterSubscribers)
    .where(eq(nbwNewsletterSubscribers.email, email))
    .limit(1);

  if (existing) {
    // Already subscribed and active
    if (!existing.unsubscribedAt) {
      return NextResponse.json(
        { message: "Sei già iscritto alla newsletter" },
        { status: 200 }
      );
    }

    // Was unsubscribed — reactivate
    const [updated] = await db
      .update(nbwNewsletterSubscribers)
      .set({
        unsubscribedAt: null,
        updatedAt: new Date(),
      })
      .where(eq(nbwNewsletterSubscribers.id, existing.id))
      .returning();

    return NextResponse.json(
      { message: "Iscrizione riattivata con successo", subscriber: updated },
      { status: 200 }
    );
  }

  // New subscriber
  const [subscriber] = await db
    .insert(nbwNewsletterSubscribers)
    .values({ email })
    .returning();

  return NextResponse.json(
    { message: "Iscrizione confermata!", subscriber },
    { status: 201 }
  );
}
