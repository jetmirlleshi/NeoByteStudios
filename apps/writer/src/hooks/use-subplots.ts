"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// --- Types ---

export interface Subplot {
  id: string;
  projectId: string;
  name: string;
  description: string | null;
  type: string | null;
  status: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

// --- Query Keys ---

export const subplotKeys = {
  all: ["subplots"] as const,
  lists: () => [...subplotKeys.all, "list"] as const,
  list: (projectId: string) => [...subplotKeys.lists(), projectId] as const,
  details: () => [...subplotKeys.all, "detail"] as const,
  detail: (id: string) => [...subplotKeys.details(), id] as const,
};

// --- Fetchers ---

async function fetchSubplots(
  projectId: string
): Promise<{ items: Subplot[] }> {
  const res = await fetch(`/api/projects/${projectId}/subplots`);
  if (!res.ok) throw new Error("Failed to fetch subplots");
  return res.json();
}

async function fetchSubplot(id: string): Promise<{ subplot: Subplot }> {
  const res = await fetch(`/api/subplots/${id}`);
  if (!res.ok) throw new Error("Failed to fetch subplot");
  return res.json();
}

async function createSubplot(data: {
  projectId: string;
  name: string;
  description?: string;
  type?: string;
  status?: string;
  progress?: number;
  [key: string]: unknown;
}): Promise<{ subplot: Subplot }> {
  const { projectId, ...body } = data;
  const res = await fetch(`/api/projects/${projectId}/subplots`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ error: "Failed to create subplot" }));
    throw new Error(err.error);
  }
  return res.json();
}

async function updateSubplot(data: {
  id: string;
  [key: string]: unknown;
}): Promise<{ subplot: Subplot }> {
  const { id, ...body } = data;
  const res = await fetch(`/api/subplots/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ error: "Failed to update subplot" }));
    throw new Error(err.error);
  }
  return res.json();
}

async function deleteSubplot(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`/api/subplots/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete subplot");
  return res.json();
}

// --- Hooks ---

export function useSubplots(projectId: string) {
  return useQuery({
    queryKey: subplotKeys.list(projectId),
    queryFn: () => fetchSubplots(projectId),
    enabled: !!projectId,
  });
}

export function useSubplot(id: string | null) {
  return useQuery({
    queryKey: subplotKeys.detail(id!),
    queryFn: () => fetchSubplot(id!),
    enabled: !!id,
  });
}

export function useCreateSubplot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSubplot,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: subplotKeys.list(variables.projectId),
      });
    },
  });
}

export function useUpdateSubplot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSubplot,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: subplotKeys.list(data.subplot.projectId),
      });
      queryClient.invalidateQueries({
        queryKey: subplotKeys.detail(data.subplot.id),
      });
    },
  });
}

export function useDeleteSubplot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSubplot,
    onSuccess: () => {
      // Invalidate all subplot lists since we don't know the projectId from the delete response
      queryClient.invalidateQueries({ queryKey: subplotKeys.lists() });
    },
  });
}
