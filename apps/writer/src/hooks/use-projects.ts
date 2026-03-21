"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

// --- Types ---

export interface ProjectWithStats {
  id: string;
  userId: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  genre: string | null;
  coverImage: string | null;
  status: string;
  worldName: string | null;
  worldDescription: string | null;
  worldTone: string | null;
  worldThemes: string[] | null;
  writingStyle: Record<string, unknown>;
  targetWordCount: number;
  targetChapters: number;
  deadline: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  totalWords: number;
  chapterCount: number;
  characterCount?: number;
  locationCount?: number;
}

interface ProjectListResponse {
  items: ProjectWithStats[];
  nextCursor: string | null;
}

interface ProjectDetailResponse {
  project: ProjectWithStats;
}

interface ProjectFilters {
  search?: string;
  status?: string;
  genre?: string;
  sortBy?: string;
  limit?: number;
}

// --- Query Keys ---

export const projectKeys = {
  all: ["projects"] as const,
  lists: () => [...projectKeys.all, "list"] as const,
  list: (filters: ProjectFilters) => [...projectKeys.lists(), filters] as const,
  details: () => [...projectKeys.all, "detail"] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
};

// --- Fetchers ---

async function fetchProjects(filters: ProjectFilters = {}): Promise<ProjectListResponse> {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.status) params.set("status", filters.status);
  if (filters.genre) params.set("genre", filters.genre);
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.limit) params.set("limit", String(filters.limit));

  const res = await fetch(`/api/projects?${params}`);
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}

async function fetchProject(id: string): Promise<ProjectDetailResponse> {
  const res = await fetch(`/api/projects/${id}`);
  if (!res.ok) throw new Error("Failed to fetch project");
  return res.json();
}

async function createProject(data: {
  title: string;
  genre?: string;
  description?: string;
}): Promise<{ project: ProjectWithStats }> {
  const res = await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Failed to create project" }));
    throw new Error(err.error);
  }
  return res.json();
}

async function updateProject(
  id: string,
  data: Partial<ProjectWithStats>
): Promise<{ project: ProjectWithStats }> {
  const res = await fetch(`/api/projects/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update project");
  return res.json();
}

async function deleteProject(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete project");
  return res.json();
}

// --- Hooks ---

export function useProjects(filters: ProjectFilters = {}) {
  return useQuery({
    queryKey: projectKeys.list(filters),
    queryFn: () => fetchProjects(filters),
  });
}

export function useProject(id: string | null) {
  return useQuery({
    queryKey: projectKeys.detail(id!),
    queryFn: () => fetchProject(id!),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<ProjectWithStats>) =>
      updateProject(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}
