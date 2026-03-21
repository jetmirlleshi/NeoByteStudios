"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// --- Types ---

export interface Chapter {
  id: string;
  projectId: string;
  title: string;
  number: number;
  summary: string | null;
  notes: string | null;
  contentJson: string;
  contentHtml: string;
  wordCount: number;
  status: string;
  pov: string | null;
  timelineDay: number | null;
  timelineMoment: string | null;
  order: number;
  version: number;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// --- Query Keys ---

export const chapterKeys = {
  all: ["chapters"] as const,
  lists: () => [...chapterKeys.all, "list"] as const,
  list: (projectId: string) => [...chapterKeys.lists(), projectId] as const,
  details: () => [...chapterKeys.all, "detail"] as const,
  detail: (id: string) => [...chapterKeys.details(), id] as const,
};

// --- Fetchers ---

async function fetchChapters(projectId: string): Promise<Chapter[]> {
  const res = await fetch(`/api/projects/${projectId}/chapters`);
  if (!res.ok) throw new Error("Failed to fetch chapters");
  return res.json();
}

async function fetchChapter(id: string): Promise<Chapter> {
  const res = await fetch(`/api/chapters/${id}`);
  if (!res.ok) throw new Error("Failed to fetch chapter");
  return res.json();
}

async function createChapter(data: {
  projectId: string;
  title: string;
  summary?: string;
  notes?: string;
}): Promise<Chapter> {
  const { projectId, ...body } = data;
  const res = await fetch(`/api/projects/${projectId}/chapters`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Failed to create chapter" }));
    throw new Error(err.error);
  }
  return res.json();
}

async function updateChapter(data: {
  id: string;
  title?: string;
  summary?: string | null;
  notes?: string | null;
  status?: string;
  pov?: string | null;
  timelineDay?: number | null;
  timelineMoment?: string | null;
}): Promise<Chapter> {
  const { id, ...body } = data;
  const res = await fetch(`/api/chapters/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Failed to update chapter" }));
    throw new Error(err.error);
  }
  return res.json();
}

async function deleteChapter(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`/api/chapters/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete chapter");
  return res.json();
}

async function updateChapterContent(data: {
  id: string;
  contentJson: string;
  contentHtml: string;
  wordCount: number;
  expectedVersion: number;
}): Promise<Chapter> {
  const { id, ...body } = data;
  const res = await fetch(`/api/chapters/${id}/content`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Failed to update chapter content" }));
    throw new Error(err.error);
  }
  return res.json();
}

async function reorderChapters(data: {
  projectId: string;
  orderedIds: string[];
}): Promise<{ success: boolean }> {
  const { projectId, orderedIds } = data;
  const res = await fetch(`/api/projects/${projectId}/chapters/reorder`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderedIds }),
  });
  if (!res.ok) throw new Error("Failed to reorder chapters");
  return res.json();
}

// --- Hooks ---

export function useChapters(projectId: string) {
  return useQuery({
    queryKey: chapterKeys.list(projectId),
    queryFn: () => fetchChapters(projectId),
    enabled: !!projectId,
  });
}

export function useChapter(id: string | null) {
  return useQuery({
    queryKey: chapterKeys.detail(id!),
    queryFn: () => fetchChapter(id!),
    enabled: !!id,
  });
}

export function useCreateChapter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createChapter,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: chapterKeys.list(variables.projectId) });
    },
  });
}

export function useUpdateChapter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateChapter,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: chapterKeys.list(data.projectId) });
      queryClient.invalidateQueries({ queryKey: chapterKeys.detail(data.id) });
    },
  });
}

export function useDeleteChapter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteChapter,
    onSuccess: () => {
      // Invalidate all chapter lists since we don't know the projectId from the delete response
      queryClient.invalidateQueries({ queryKey: chapterKeys.lists() });
    },
  });
}

export function useUpdateChapterContent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateChapterContent,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: chapterKeys.list(data.projectId) });
      queryClient.invalidateQueries({ queryKey: chapterKeys.detail(data.id) });
    },
  });
}

export function useReorderChapters() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reorderChapters,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: chapterKeys.list(variables.projectId) });
    },
  });
}
