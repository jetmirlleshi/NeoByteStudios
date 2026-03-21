"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// --- Types ---

export interface Location {
  id: string;
  projectId: string;
  name: string;
  type: string | null;
  region: string | null;
  controlledBy: string | null;
  population: string | null;
  description: string | null;
  mood: string | null;
  sounds: string | null;
  smells: string | null;
  temperature: string | null;
  connections: unknown[];
  specialRules: string | null;
  imageUrl: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface LocationFilters {
  type?: string;
}

// --- Query Keys ---

export const locationKeys = {
  all: ["locations"] as const,
  lists: () => [...locationKeys.all, "list"] as const,
  list: (projectId: string, filters?: LocationFilters) =>
    [...locationKeys.lists(), projectId, filters] as const,
  details: () => [...locationKeys.all, "detail"] as const,
  detail: (id: string) => [...locationKeys.details(), id] as const,
};

// --- Fetchers ---

async function fetchLocations(
  projectId: string,
  filters: LocationFilters = {}
): Promise<{ items: Location[] }> {
  const params = new URLSearchParams();
  if (filters.type) params.set("type", filters.type);

  const qs = params.toString();
  const url = `/api/projects/${projectId}/locations${qs ? `?${qs}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch locations");
  return res.json();
}

async function fetchLocation(id: string): Promise<{ location: Location }> {
  const res = await fetch(`/api/locations/${id}`);
  if (!res.ok) throw new Error("Failed to fetch location");
  return res.json();
}

async function createLocation(data: {
  projectId: string;
  name: string;
  type?: string;
  [key: string]: unknown;
}): Promise<{ location: Location }> {
  const { projectId, ...body } = data;
  const res = await fetch(`/api/projects/${projectId}/locations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ error: "Failed to create location" }));
    throw new Error(err.error);
  }
  return res.json();
}

async function updateLocation(data: {
  id: string;
  [key: string]: unknown;
}): Promise<{ location: Location }> {
  const { id, ...body } = data;
  const res = await fetch(`/api/locations/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ error: "Failed to update location" }));
    throw new Error(err.error);
  }
  return res.json();
}

async function deleteLocation(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`/api/locations/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete location");
  return res.json();
}

// --- Hooks ---

export function useLocations(projectId: string, filters: LocationFilters = {}) {
  return useQuery({
    queryKey: locationKeys.list(projectId, filters),
    queryFn: () => fetchLocations(projectId, filters),
    enabled: !!projectId,
  });
}

export function useLocation(id: string | null) {
  return useQuery({
    queryKey: locationKeys.detail(id!),
    queryFn: () => fetchLocation(id!),
    enabled: !!id,
  });
}

export function useCreateLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLocation,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: locationKeys.list(variables.projectId),
      });
    },
  });
}

export function useUpdateLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateLocation,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: locationKeys.list(data.location.projectId),
      });
      queryClient.invalidateQueries({
        queryKey: locationKeys.detail(data.location.id),
      });
    },
  });
}

export function useDeleteLocation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLocation,
    onSuccess: () => {
      // Invalidate all location lists since we don't know the projectId from the delete response
      queryClient.invalidateQueries({ queryKey: locationKeys.lists() });
    },
  });
}
