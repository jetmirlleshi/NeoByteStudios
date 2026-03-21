"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Loader2,
  BookOpen,
  Filter,
} from "lucide-react";
import { useProjects, useDeleteProject } from "@/hooks/use-projects";
import { ProjectCard } from "@/components/projects/project-card";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { toast } from "sonner";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Tutti gli stati" },
  { value: "PLANNING", label: "Pianificazione" },
  { value: "DRAFTING", label: "Stesura" },
  { value: "REVISING", label: "Revisione" },
  { value: "EDITING", label: "Editing" },
  { value: "COMPLETE", label: "Completato" },
  { value: "ARCHIVED", label: "Archiviato" },
];

export function ProjectsPageContent() {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { data, isLoading } = useProjects({
    search: search || undefined,
    status: statusFilter || undefined,
  });
  const deleteProject = useDeleteProject();

  const projects = data?.items ?? [];

  const handleDelete = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo progetto?")) return;
    try {
      await deleteProject.mutateAsync(id);
      toast.success("Progetto eliminato");
    } catch {
      toast.error("Errore nell'eliminazione del progetto");
    }
  };

  const handleProjectClick = (id: string) => {
    router.push(`/dashboard/projects/${id}`);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Progetti</h1>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          <Plus className="h-4 w-4" />
          Nuovo progetto
        </button>
      </div>

      {/* Search and filters */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cerca progetti..."
            className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900"
          />
        </div>

        {/* Status filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none rounded-lg border py-2 pl-9 pr-8 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="mt-12 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : projects.length === 0 ? (
        <div className="mt-8 rounded-lg border p-12 text-center dark:border-gray-800">
          <BookOpen className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
          <h3 className="mt-4 font-medium">
            {search || statusFilter
              ? "Nessun progetto trovato"
              : "Nessun progetto ancora"}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {search || statusFilter
              ? "Prova a modificare i filtri di ricerca."
              : "Crea il tuo primo romanzo per iniziare a scrivere."}
          </p>
          {!search && !statusFilter && (
            <button
              onClick={() => setCreateOpen(true)}
              className="mt-4 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              Nuovo progetto
            </button>
          )}
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={handleDelete}
              onClick={handleProjectClick}
            />
          ))}
        </div>
      )}

      <CreateProjectDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />
    </div>
  );
}
