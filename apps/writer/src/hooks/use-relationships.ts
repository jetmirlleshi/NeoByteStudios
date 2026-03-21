"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// --- Types ---

export interface Relationship {
  id: string;
  fromCharacterId: string;
  toCharacterId: string;
  type: string;
  description: string | null;
  startState: string | null;
  currentState: string | null;
  endState: string | null;
  createdAt: string;
  updatedAt: string;
}

// --- Query Keys ---

export const relationshipKeys = {
  all: ["relationships"] as const,
  list: (projectId: string) => [...relationshipKeys.all, projectId] as const,
};

// --- Fetchers ---

async function fetchRelationships(
  projectId: string
): Promise<{ relationships: Relationship[] }> {
  const res = await fetch(`/api/projects/${projectId}/relationships`);
  if (!res.ok) throw new Error("Failed to fetch relationships");
  return res.json();
}

async function createRelationship(data: {
  projectId: string;
  fromCharacterId: string;
  toCharacterId: string;
  type?: string;
  description?: string;
  startState?: string;
  currentState?: string;
  endState?: string;
}): Promise<{ relationship: Relationship }> {
  const { projectId, ...body } = data;
  const res = await fetch(`/api/projects/${projectId}/relationships`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ error: "Failed to create relationship" }));
    throw new Error(err.error);
  }
  return res.json();
}

async function updateRelationship(data: {
  id: string;
  type?: string;
  description?: string | null;
  startState?: string | null;
  currentState?: string | null;
  endState?: string | null;
}): Promise<{ relationship: Relationship }> {
  const { id, ...body } = data;
  const res = await fetch(`/api/relationships/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ error: "Failed to update relationship" }));
    throw new Error(err.error);
  }
  return res.json();
}

async function deleteRelationship(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`/api/relationships/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete relationship");
  return res.json();
}

// --- Hooks ---

export function useRelationships(projectId: string) {
  return useQuery({
    queryKey: relationshipKeys.list(projectId),
    queryFn: () => fetchRelationships(projectId),
    enabled: !!projectId,
  });
}

export function useCreateRelationship() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRelationship,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: relationshipKeys.list(variables.projectId),
      });
    },
  });
}

export function useUpdateRelationship() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRelationship,
    onSuccess: () => {
      // Invalidate all relationship lists since we don't have projectId in the update response
      queryClient.invalidateQueries({ queryKey: relationshipKeys.all });
    },
  });
}

export function useDeleteRelationship() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRelationship,
    onSuccess: () => {
      // Invalidate all relationship lists since we don't have projectId from the delete response
      queryClient.invalidateQueries({ queryKey: relationshipKeys.all });
    },
  });
}
