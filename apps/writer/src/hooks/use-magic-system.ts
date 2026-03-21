"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// --- Types ---

export interface MagicSystem {
  id: string;
  projectId: string;
  name: string;
  description: string | null;
  source: string | null;
  rules: Record<string, unknown> | null;
  costs: string | null;
  limitations: string | null;
  practitioners: string | null;
  history: string | null;
  createdAt: string;
  updatedAt: string;
}

// --- Query Keys ---

export const magicSystemKeys = {
  all: ["magicSystems"] as const,
  details: () => [...magicSystemKeys.all, "detail"] as const,
  detail: (projectId: string) =>
    [...magicSystemKeys.details(), projectId] as const,
};

// --- Fetchers ---

async function fetchMagicSystem(
  projectId: string
): Promise<{ magicSystem: MagicSystem }> {
  const res = await fetch(`/api/projects/${projectId}/magic-system`);
  if (!res.ok) {
    if (res.status === 404) return { magicSystem: null as unknown as MagicSystem };
    throw new Error("Failed to fetch magic system");
  }
  return res.json();
}

async function upsertMagicSystem(data: {
  projectId: string;
  name: string;
  [key: string]: unknown;
}): Promise<{ magicSystem: MagicSystem }> {
  const { projectId, ...body } = data;
  const res = await fetch(`/api/projects/${projectId}/magic-system`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ error: "Failed to save magic system" }));
    throw new Error(err.error);
  }
  return res.json();
}

// --- Hooks ---

export function useMagicSystem(projectId: string) {
  return useQuery({
    queryKey: magicSystemKeys.detail(projectId),
    queryFn: () => fetchMagicSystem(projectId),
    enabled: !!projectId,
  });
}

export function useUpsertMagicSystem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upsertMagicSystem,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: magicSystemKeys.detail(variables.projectId),
      });
    },
  });
}
