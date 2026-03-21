"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  PenLine,
  Clock,
  TrendingUp,
  Plus,
  Loader2,
} from "lucide-react";
import { useProjects, useDeleteProject } from "@/hooks/use-projects";
import { ProjectCard } from "@/components/projects/project-card";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { toast } from "sonner";

interface DashboardContentProps {
  userName: string;
}

export function DashboardContent({ userName }: DashboardContentProps) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const { data, isLoading } = useProjects();
  const deleteProject = useDeleteProject();

  const projects = data?.items ?? [];

  // Aggregate stats
  const totalProjects = projects.length;
  const totalWords = projects.reduce((sum, p) => sum + p.totalWords, 0);

  const handleDelete = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo progetto?")) return;
    try {
      await deleteProject.mutateAsync(id);
      toast.success("Progetto eliminato");
    } catch {
      toast.error("Errore nell'eliminazione");
    }
  };

  const handleProjectClick = (id: string) => {
    router.push(`/dashboard/projects/${id}`);
  };

  return (
    <div className="p-6">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Benvenuto, {userName}
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
          iconBg="bg-blue-50 dark:bg-blue-950"
          label="Progetti"
          value={String(totalProjects)}
        />
        <StatCard
          icon={<PenLine className="h-5 w-5 text-green-600 dark:text-green-400" />}
          iconBg="bg-green-50 dark:bg-green-950"
          label="Parole oggi"
          value="0"
        />
        <StatCard
          icon={<Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
          iconBg="bg-purple-50 dark:bg-purple-950"
          label="Streak"
          value="0 gg"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />}
          iconBg="bg-orange-50 dark:bg-orange-950"
          label="Parole totali"
          value={totalWords.toLocaleString("it-IT")}
        />
      </div>

      {/* Projects section */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">I tuoi progetti</h2>
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            <Plus className="h-4 w-4" />
            Nuovo progetto
          </button>
        </div>

        {isLoading ? (
          <div className="mt-8 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : projects.length === 0 ? (
          <div className="mt-4 rounded-lg border p-12 text-center dark:border-gray-800">
            <BookOpen className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
            <h3 className="mt-4 font-medium">Nessun progetto ancora</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Crea il tuo primo romanzo per iniziare a scrivere.
            </p>
            <button
              onClick={() => setCreateOpen(true)}
              className="mt-4 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              Nuovo progetto
            </button>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
      </div>

      <CreateProjectDialog open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}

function StatCard({
  icon,
  iconBg,
  label,
  value,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border p-6 dark:border-gray-800">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}
