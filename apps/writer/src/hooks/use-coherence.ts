"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCoherenceStore } from "@/stores/coherence-store";
import type { CoherenceAlert } from "@/stores/coherence-store";
import { runTier1Checks } from "@/lib/ai/coherence/tier1-local";
import type { CharacterInfo } from "@/lib/ai/coherence/tier1-local";

// ---------------------------------------------------------------------------
// Query Keys
// ---------------------------------------------------------------------------

export const coherenceKeys = {
  all: ["coherence"] as const,
  alerts: (projectId: string, chapterId?: string) =>
    [...coherenceKeys.all, "alerts", projectId, chapterId ?? "all"] as const,
};

// ---------------------------------------------------------------------------
// Tier 1 — Client-side regex checks (runs on text changes, 500ms debounce)
// ---------------------------------------------------------------------------

export function useCoherenceTier1(text: string, characters: CharacterInfo[]) {
  const { setTier1Alerts, tier1Alerts } = useCoherenceStore();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // If no text or characters, clear alerts immediately
    if (!text || characters.length === 0) {
      setTier1Alerts([]);
      return;
    }

    // Debounce the check by 500ms
    debounceRef.current = setTimeout(() => {
      const tier1Results = runTier1Checks({ text, characters });

      // Map Tier1Alert to CoherenceAlert format
      const mapped: CoherenceAlert[] = tier1Results.map((alert) => ({
        type: alert.type,
        severity: alert.severity,
        title: alert.title,
        description: alert.description,
        characterId: alert.characterId,
        textSnippet: alert.textSnippet,
        tier: 1 as const,
      }));

      setTier1Alerts(mapped);
    }, 500);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [text, characters, setTier1Alerts]);

  return { alerts: tier1Alerts };
}

// ---------------------------------------------------------------------------
// Tier 2/3 — Server-side checks (manual trigger)
// ---------------------------------------------------------------------------

export interface CoherenceCheckParams {
  projectId: string;
  chapterId: string;
  text?: string;
  tier: 2 | 3;
  contextBefore?: string;
  contextAfter?: string;
}

export function useCoherenceCheck() {
  const { setAlerts, setChecking } = useCoherenceStore();
  const [error, setError] = useState<Error | null>(null);

  const runCheck = useCallback(
    async (params: CoherenceCheckParams) => {
      setChecking(true);
      setError(null);

      try {
        const res = await fetch("/api/ai/coherence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "Errore nel controllo coerenza" }));
          throw new Error(err.error ?? "Errore nel controllo coerenza");
        }

        const data = await res.json();

        // Map server response to CoherenceAlert[]
        const alerts: CoherenceAlert[] = (data.alerts ?? []).map(
          (a: Record<string, unknown>) => ({
            id: a.id as string | undefined,
            type: a.type as string,
            severity: a.severity as CoherenceAlert["severity"],
            title: a.title as string,
            description: a.description as string,
            characterId: a.characterId as string | undefined,
            textSnippet: a.textSnippet as string | undefined,
            suggestion: a.suggestion as string | undefined,
            status: a.status as string | undefined,
            tier: params.tier,
          })
        );

        setAlerts(alerts);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Errore sconosciuto");
        setError(error);
        throw error;
      } finally {
        setChecking(false);
      }
    },
    [setAlerts, setChecking]
  );

  return { runCheck, isChecking: useCoherenceStore((s) => s.isChecking), error };
}

// ---------------------------------------------------------------------------
// Coherence Alerts — TanStack Query for persisted alerts
// ---------------------------------------------------------------------------

async function fetchCoherenceAlerts(
  projectId: string,
  chapterId?: string
): Promise<CoherenceAlert[]> {
  const params = new URLSearchParams({ projectId });
  if (chapterId) params.set("chapterId", chapterId);

  const res = await fetch(`/api/ai/coherence/alerts?${params.toString()}`);
  if (!res.ok) throw new Error("Errore nel caricamento alert coerenza");
  return res.json();
}

async function updateCoherenceAlert(data: {
  id: string;
  status: string;
}): Promise<CoherenceAlert> {
  const { id, ...body } = data;
  const res = await fetch(`/api/ai/coherence/alerts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Errore aggiornamento alert" }));
    throw new Error(err.error ?? "Errore aggiornamento alert");
  }
  return res.json();
}

export function useCoherenceAlerts(projectId: string, chapterId?: string) {
  const queryClient = useQueryClient();

  const { data: alerts, isLoading } = useQuery({
    queryKey: coherenceKeys.alerts(projectId, chapterId),
    queryFn: () => fetchCoherenceAlerts(projectId, chapterId),
    enabled: !!projectId,
  });

  const updateAlert = useMutation({
    mutationFn: updateCoherenceAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: coherenceKeys.alerts(projectId, chapterId),
      });
    },
  });

  return {
    alerts: alerts ?? [],
    updateAlert,
    isLoading,
  };
}
