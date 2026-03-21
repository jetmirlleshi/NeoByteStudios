"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// --- Types ---

export interface Faction {
  id: string;
  projectId: string;
  name: string;
  type: string | null;
  description: string | null;
  ideology: string | null;
  leadership: string | null;
  resources: string | null;
  headquarters: string | null;
  allies: string | null;
  enemies: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// --- Query Keys ---

export const factionKeys = {
  all: ["factions"] as const,
  lists: () => [...factionKeys.all, "list"] as const,
  list: (projectId: string) => [...factionKeys.lists(), projectId] as const,
  details: () => [...factionKeys.all, "detail"] as const,
  detail: (id: string) => [...factionKeys.details(), id] as const,
};

// --- Fetchers ---

async function fetchFactions(
  projectId: string
): Promise<{ items: Faction[] }> {
  const res = await fetch(`/api/projects/${projectId}/factions`);
  if (!res.ok) throw new Error("Failed to fetch factions");
  return res.json();
}

async function fetchFaction(id: string): Promise<{ faction: Faction }> {
  const res = await fetch(`/api/factions/${id}`);
  if (!res.ok) throw new Error("Failed to fetch faction");
  return res.json();
}

async function createFaction(data: {
  projectId: string;
  name: string;
  [key: string]: unknown;
}): Promise<{ faction: Faction }> {
  const { projectId, ...body } = data;
  const res = await fetch(`/api/projects/${projectId}/factions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ error: "Failed to create faction" }));
    throw new Error(err.error);
  }
  return res.json();
}

async function updateFaction(data: {
  id: string;
  [key: string]: unknown;
}): Promise<{ faction: Faction }> {
  const { id, ...body } = data;
  const res = await fetch(`/api/factions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ error: "Failed to update faction" }));
    throw new Error(err.error);
  }
  return res.json();
}

async function deleteFaction(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`/api/factions/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete faction");
  return res.json();
}

// --- Hooks ---

export function useFactions(projectId: string) {
  return useQuery({
    queryKey: factionKeys.list(projectId),
    queryFn: () => fetchFactions(projectId),
    enabled: !!projectId,
  });
}

export function useFaction(id: string | null) {
  return useQuery({
    queryKey: factionKeys.detail(id!),
    queryFn: () => fetchFaction(id!),
    enabled: !!id,
  });
}

export function useCreateFaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFaction,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: factionKeys.list(variables.projectId),
      });
    },
  });
}

export function useUpdateFaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateFaction,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: factionKeys.list(data.faction.projectId),
      });
      queryClient.invalidateQueries({
        queryKey: factionKeys.detail(data.faction.id),
      });
    },
  });
}

export function useDeleteFaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFaction,
    onSuccess: () => {
      // Invalidate all faction lists since we don't know the projectId from the delete response
      queryClient.invalidateQueries({ queryKey: factionKeys.lists() });
    },
  });
}
