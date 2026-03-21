"use client";

import { BookOpen, ChevronDown } from "lucide-react";
import { useProjects } from "@/hooks/use-projects";
import { useProjectStore } from "@/stores/project-store";
import { useEffect } from "react";

interface ProjectSelectorProps {
  children: (projectId: string) => React.ReactNode;
}

/**
 * Wrapper component for worldbuilding pages.
 * Ensures a project is selected before rendering children.
 * Reads from Zustand store, auto-selects first project if none set.
 */
export function ProjectSelector({ children }: ProjectSelectorProps) {
  const { data, isLoading } = useProjects();
  const currentProjectId = useProjectStore((s) => s.currentProjectId);
  const setCurrentProject = useProjectStore((s) => s.setCurrentProject);

  const projects = data?.items ?? [];

  // Auto-select first project if none is selected
  useEffect(() => {
    if (!currentProjectId && projects.length > 0) {
      setCurrentProject(projects[0].id);
    }
  }, [currentProjectId, projects, setCurrentProject]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900 dark:border-gray-600 dark:border-t-white" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
        <BookOpen className="h-12 w-12 text-gray-300 dark:text-gray-600" />
        <div>
          <h3 className="font-medium">Nessun progetto</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Crea un progetto dalla Dashboard per iniziare il worldbuilding.
          </p>
        </div>
      </div>
    );
  }

  const selectedId = currentProjectId ?? projects[0]?.id;
  if (!selectedId) return null;

  return (
    <div>
      {/* Project picker dropdown */}
      <div className="mb-6 flex items-center gap-3">
        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Progetto:
        </label>
        <div className="relative">
          <select
            value={selectedId}
            onChange={(e) => setCurrentProject(e.target.value)}
            className="appearance-none rounded-lg border bg-white py-1.5 pl-3 pr-8 text-sm font-medium dark:border-gray-700 dark:bg-gray-800"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {children(selectedId)}
    </div>
  );
}
