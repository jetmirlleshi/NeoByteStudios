"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// --- Types ---

export interface TimelineEvent {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  date: string | null;
  era: string | null;
  order: number;
  type: string;
  createdAt: string;
  updatedAt: string;
}

// --- Query Keys ---

export const timelineEventKeys = {
  all: ["timeline-events"] as const,
  lists: () => [...timelineEventKeys.all, "list"] as const,
  list: (projectId: string) =>
    [...timelineEventKeys.lists(), projectId] as const,
  details: () => [...timelineEventKeys.all, "detail"] as const,
  detail: (id: string) => [...timelineEventKeys.details(), id] as const,
};

// --- Fetchers ---

async function fetchTimelineEvents(
  projectId: string
): Promise<{ items: TimelineEvent[] }> {
  const res = await fetch(`/api/projects/${projectId}/timeline`);
  if (!res.ok) throw new Error("Failed to fetch timeline events");
  return res.json();
}

async function fetchTimelineEvent(
  id: string
): Promise<{ event: TimelineEvent }> {
  const res = await fetch(`/api/timeline/${id}`);
  if (!res.ok) throw new Error("Failed to fetch timeline event");
  return res.json();
}

async function createTimelineEvent(data: {
  projectId: string;
  title: string;
  order: number;
  description?: string;
  date?: string;
  era?: string;
  type?: string;
  [key: string]: unknown;
}): Promise<{ event: TimelineEvent }> {
  const { projectId, ...body } = data;
  const res = await fetch(`/api/projects/${projectId}/timeline`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ error: "Failed to create timeline event" }));
    throw new Error(err.error);
  }
  return res.json();
}

async function updateTimelineEvent(data: {
  id: string;
  [key: string]: unknown;
}): Promise<{ event: TimelineEvent }> {
  const { id, ...body } = data;
  const res = await fetch(`/api/timeline/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ error: "Failed to update timeline event" }));
    throw new Error(err.error);
  }
  return res.json();
}

async function deleteTimelineEvent(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`/api/timeline/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete timeline event");
  return res.json();
}

// --- Hooks ---

export function useTimelineEvents(projectId: string) {
  return useQuery({
    queryKey: timelineEventKeys.list(projectId),
    queryFn: () => fetchTimelineEvents(projectId),
    enabled: !!projectId,
  });
}

export function useTimelineEvent(id: string | null) {
  return useQuery({
    queryKey: timelineEventKeys.detail(id!),
    queryFn: () => fetchTimelineEvent(id!),
    enabled: !!id,
  });
}

export function useCreateTimelineEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTimelineEvent,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: timelineEventKeys.list(variables.projectId),
      });
    },
  });
}

export function useUpdateTimelineEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTimelineEvent,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: timelineEventKeys.list(data.event.projectId),
      });
      queryClient.invalidateQueries({
        queryKey: timelineEventKeys.detail(data.event.id),
      });
    },
  });
}

export function useDeleteTimelineEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTimelineEvent,
    onSuccess: () => {
      // Invalidate all timeline event lists since we don't know the projectId from the delete response
      queryClient.invalidateQueries({ queryKey: timelineEventKeys.lists() });
    },
  });
}
