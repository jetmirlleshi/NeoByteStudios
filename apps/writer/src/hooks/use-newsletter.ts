"use client";

import { useMutation } from "@tanstack/react-query";

// --- Types ---

interface NewsletterResponse {
  message: string;
  subscriber?: {
    id: string;
    email: string;
    createdAt: string;
    unsubscribedAt: string | null;
  };
}

// --- Fetchers ---

async function subscribeNewsletter(email: string): Promise<NewsletterResponse> {
  const res = await fetch("/api/newsletter/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Errore nell'iscrizione");
  return data;
}

async function unsubscribeNewsletter(
  email: string
): Promise<NewsletterResponse> {
  const res = await fetch("/api/newsletter/unsubscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Errore nella disiscrizione");
  return data;
}

// --- Hooks ---

export function useSubscribeNewsletter() {
  return useMutation({
    mutationFn: subscribeNewsletter,
  });
}

export function useUnsubscribeNewsletter() {
  return useMutation({
    mutationFn: unsubscribeNewsletter,
  });
}
