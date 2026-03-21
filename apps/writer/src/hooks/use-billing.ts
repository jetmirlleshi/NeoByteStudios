"use client";

import { useQuery, useMutation } from "@tanstack/react-query";

// --- Types ---

export interface BillingStatus {
  tier: "FREE" | "WRITER" | "PROFESSIONAL";
  aiGenerationsToday: number;
  aiGenerationsLimit: number;
  aiGenerationsRemaining: number;
  projectsUsed: number;
  projectsLimit: number;
  exportEnabled: boolean;
  coherenceTiers: number[];
  trialEndsAt: string | null;
}

interface CheckoutResponse {
  url: string;
}

interface PortalResponse {
  url: string;
}

// --- Query Keys ---

export const billingKeys = {
  all: ["billing"] as const,
  status: () => [...billingKeys.all, "status"] as const,
};

// --- Fetchers ---

async function fetchBillingStatus(): Promise<BillingStatus> {
  const res = await fetch("/api/billing/status");
  if (!res.ok) throw new Error("Failed to fetch billing status");
  return res.json();
}

async function createCheckout(data: {
  priceId: string;
}): Promise<CheckoutResponse> {
  const res = await fetch("/api/billing/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ error: "Failed to create checkout session" }));
    throw new Error(err.error);
  }
  return res.json();
}

async function createPortal(): Promise<PortalResponse> {
  const res = await fetch("/api/billing/portal", {
    method: "POST",
  });
  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ error: "Failed to create portal session" }));
    throw new Error(err.error);
  }
  return res.json();
}

// --- Hooks ---

export function useBillingStatus() {
  return useQuery({
    queryKey: billingKeys.status(),
    queryFn: fetchBillingStatus,
    refetchInterval: 60 * 1000,
  });
}

export function useCreateCheckout() {
  return useMutation({
    mutationFn: createCheckout,
    onSuccess: (data) => {
      window.location.href = data.url;
    },
  });
}

export function useCreatePortal() {
  return useMutation({
    mutationFn: createPortal,
    onSuccess: (data) => {
      window.location.href = data.url;
    },
  });
}
