"use client";

import { BookOpen, MoreVertical, Trash2, Edit3 } from "lucide-react";
import { useState } from "react";
import type { ProjectWithStats } from "@/hooks/use-projects";

const STATUS_LABELS: Record<string, string> = {
  PLANNING: "Pianificazione",
  DRAFTING: "Stesura",
  REVISING: "Revisione",
  EDITING: "Editing",
  COMPLETE: "Completato",
  ARCHIVED: "Archiviato",
};

const STATUS_COLORS: Record<string, string> = {
  PLANNING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  DRAFTING: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  REVISING: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  EDITING: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  COMPLETE: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  ARCHIVED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

interface ProjectCardProps {
  project: ProjectWithStats;
  onDelete: (id: string) => void;
  onClick: (id: string) => void;
}

export function ProjectCard({ project, onDelete, onClick }: ProjectCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const progress =
    project.targetWordCount > 0
      ? Math.min(
          Math.round((project.totalWords / project.targetWordCount) * 100),
          100
        )
      : 0;

  return (
    <div
      className="group relative rounded-lg border p-5 transition-colors hover:border-gray-400 dark:border-gray-800 dark:hover:border-gray-600 cursor-pointer"
      onClick={() => onClick(project.id)}
    >
      {/* Menu button */}
      <div className="absolute right-3 top-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          className="rounded p-1 opacity-0 transition-opacity hover:bg-gray-100 group-hover:opacity-100 dark:hover:bg-gray-800"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(false);
              }}
            />
            <div className="absolute right-0 top-8 z-20 w-36 rounded-lg border bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClick(project.id);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Edit3 className="h-3.5 w-3.5" />
                Modifica
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(project.id);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Elimina
              </button>
            </div>
          </>
        )}
      </div>

      {/* Title and genre */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950">
          <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-semibold">{project.title}</h3>
          {project.genre && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {project.genre}
            </p>
          )}
        </div>
      </div>

      {/* Status badge */}
      <div className="mt-3">
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[project.status] ?? STATUS_COLORS.PLANNING}`}
        >
          {STATUS_LABELS[project.status] ?? project.status}
        </span>
      </div>

      {/* Stats */}
      <div className="mt-4 flex gap-4 text-sm text-gray-500 dark:text-gray-400">
        <span>{project.totalWords.toLocaleString("it-IT")} parole</span>
        <span>{project.chapterCount} capitoli</span>
      </div>

      {/* Progress bar */}
      {project.targetWordCount > 0 && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Progresso</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
            <div
              className="h-1.5 rounded-full bg-blue-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
