"use client";

import { useMutation } from "@tanstack/react-query";

// --- Types ---

export interface ManuscriptExportOptions {
  projectId: string;
  format: "docx" | "markdown" | "text";
  options?: {
    includeChapterNumbers?: boolean;
    includeTitle?: boolean;
    pageBreakBetweenChapters?: boolean;
  };
}

export interface BibleExportOptions {
  projectId: string;
  format: "json" | "markdown";
  sections?: string[];
}

// --- Helpers ---

async function downloadBlob(
  response: Response,
  fallbackFilename: string
): Promise<void> {
  const blob = await response.blob();
  const disposition = response.headers.get("Content-Disposition");
  const filename =
    disposition?.match(/filename="?([^"]+)"?/)?.[1] ?? fallbackFilename;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// --- Fetchers ---

async function exportManuscript(data: ManuscriptExportOptions): Promise<void> {
  const { projectId, ...body } = data;
  const res = await fetch(`/api/projects/${projectId}/export/manuscript`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ error: "Failed to export manuscript" }));
    throw new Error(err.error);
  }
  await downloadBlob(res, `manuscript.${data.format === "text" ? "txt" : data.format}`);
}

async function exportBible(data: BibleExportOptions): Promise<void> {
  const { projectId, ...body } = data;
  const res = await fetch(`/api/projects/${projectId}/export/bible`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ error: "Failed to export bible" }));
    throw new Error(err.error);
  }
  await downloadBlob(res, `story-bible.${data.format === "json" ? "json" : "md"}`);
}

async function exportGDPR(): Promise<void> {
  const res = await fetch("/api/user/export", {
    method: "POST",
  });
  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ error: "Failed to export user data" }));
    throw new Error(err.error);
  }
  await downloadBlob(res, "user-data-export.json");
}

// --- Hooks ---

export function useManuscriptExport() {
  return useMutation({
    mutationFn: exportManuscript,
  });
}

export function useBibleExport() {
  return useMutation({
    mutationFn: exportBible,
  });
}

export function useGDPRExport() {
  return useMutation({
    mutationFn: exportGDPR,
  });
}
