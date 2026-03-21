"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// --- Types ---

export interface WorldRule {
  id: string;
  projectId: string;
  rule: string;
  explanation: string | null;
  category: string | null;
  isStrict: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- Query Keys ---

export const worldRuleKeys = {
  all: ["world-rules"] as const,
  lists: () => [...worldRuleKeys.all, "list"] as const,
  list: (projectId: string) => [...worldRuleKeys.lists(), projectId] as const,
  details: () => [...worldRuleKeys.all, "detail"] as const,
  detail: (id: string) => [...worldRuleKeys.details(), id] as const,
};

// --- Fetchers ---

async function fetchWorldRules(
  projectId: string
): Promise<{ items: WorldRule[] }> {
  const res = await fetch(`/api/projects/${projectId}/world-rules`);
  if (!res.ok) throw new Error("Failed to fetch world rules");
  return res.json();
}

async function fetchWorldRule(id: string): Promise<{ rule: WorldRule }> {
  const res = await fetch(`/api/world-rules/${id}`);
  if (!res.ok) throw new Error("Failed to fetch world rule");
  return res.json();
}

async function createWorldRule(data: {
  projectId: string;
  rule: string;
  explanation?: string;
  category?: string;
  isStrict?: boolean;
  [key: string]: unknown;
}): Promise<{ rule: WorldRule }> {
  const { projectId, ...body } = data;
  const res = await fetch(`/api/projects/${projectId}/world-rules`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ error: "Failed to create world rule" }));
    throw new Error(err.error);
  }
  return res.json();
}

async function updateWorldRule(data: {
  id: string;
  [key: string]: unknown;
}): Promise<{ rule: WorldRule }> {
  const { id, ...body } = data;
  const res = await fetch(`/api/world-rules/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ error: "Failed to update world rule" }));
    throw new Error(err.error);
  }
  return res.json();
}

async function deleteWorldRule(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`/api/world-rules/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete world rule");
  return res.json();
}

// --- Hooks ---

export function useWorldRules(projectId: string) {
  return useQuery({
    queryKey: worldRuleKeys.list(projectId),
    queryFn: () => fetchWorldRules(projectId),
    enabled: !!projectId,
  });
}

export function useWorldRule(id: string | null) {
  return useQuery({
    queryKey: worldRuleKeys.detail(id!),
    queryFn: () => fetchWorldRule(id!),
    enabled: !!id,
  });
}

export function useCreateWorldRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createWorldRule,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: worldRuleKeys.list(variables.projectId),
      });
    },
  });
}

export function useUpdateWorldRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateWorldRule,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: worldRuleKeys.list(data.rule.projectId),
      });
      queryClient.invalidateQueries({
        queryKey: worldRuleKeys.detail(data.rule.id),
      });
    },
  });
}

export function useDeleteWorldRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteWorldRule,
    onSuccess: () => {
      // Invalidate all world rule lists since we don't know the projectId from the delete response
      queryClient.invalidateQueries({ queryKey: worldRuleKeys.lists() });
    },
  });
}
