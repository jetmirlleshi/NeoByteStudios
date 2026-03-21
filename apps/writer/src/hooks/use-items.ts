"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// --- Types ---

export interface Item {
  id: string;
  projectId: string;
  name: string;
  type: string | null;
  description: string | null;
  appearance: string | null;
  powers: string | null;
  weaknesses: string | null;
  origin: string | null;
  history: string | null;
  currentOwner: string | null;
  ownerHistory: unknown[];
  importance: "MCGUFFIN" | "MAJOR" | "MODERATE" | "MINOR";
  imageUrl: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ItemFilters {
  importance?: string;
}

// --- Query Keys ---

export const itemKeys = {
  all: ["items"] as const,
  lists: () => [...itemKeys.all, "list"] as const,
  list: (projectId: string, filters?: ItemFilters) =>
    [...itemKeys.lists(), projectId, filters] as const,
  details: () => [...itemKeys.all, "detail"] as const,
  detail: (id: string) => [...itemKeys.details(), id] as const,
};

// --- Fetchers ---

async function fetchItems(
  projectId: string,
  filters: ItemFilters = {}
): Promise<{ items: Item[] }> {
  const params = new URLSearchParams();
  if (filters.importance) params.set("importance", filters.importance);

  const qs = params.toString();
  const url = `/api/projects/${projectId}/items${qs ? `?${qs}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch items");
  return res.json();
}

async function fetchItem(id: string): Promise<{ item: Item }> {
  const res = await fetch(`/api/items/${id}`);
  if (!res.ok) throw new Error("Failed to fetch item");
  return res.json();
}

async function createItem(data: {
  projectId: string;
  name: string;
  importance?: string;
  [key: string]: unknown;
}): Promise<{ item: Item }> {
  const { projectId, ...body } = data;
  const res = await fetch(`/api/projects/${projectId}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ error: "Failed to create item" }));
    throw new Error(err.error);
  }
  return res.json();
}

async function updateItem(data: {
  id: string;
  [key: string]: unknown;
}): Promise<{ item: Item }> {
  const { id, ...body } = data;
  const res = await fetch(`/api/items/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ error: "Failed to update item" }));
    throw new Error(err.error);
  }
  return res.json();
}

async function deleteItem(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`/api/items/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete item");
  return res.json();
}

// --- Hooks ---

export function useItems(projectId: string, filters: ItemFilters = {}) {
  return useQuery({
    queryKey: itemKeys.list(projectId, filters),
    queryFn: () => fetchItems(projectId, filters),
    enabled: !!projectId,
  });
}

export function useItem(id: string | null) {
  return useQuery({
    queryKey: itemKeys.detail(id!),
    queryFn: () => fetchItem(id!),
    enabled: !!id,
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createItem,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: itemKeys.list(variables.projectId),
      });
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateItem,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: itemKeys.list(data.item.projectId),
      });
      queryClient.invalidateQueries({
        queryKey: itemKeys.detail(data.item.id),
      });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      // Invalidate all item lists since we don't know the projectId from the delete response
      queryClient.invalidateQueries({ queryKey: itemKeys.lists() });
    },
  });
}
