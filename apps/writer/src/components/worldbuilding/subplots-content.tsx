"use client";

import { useState } from "react";
import { ProjectSelector } from "@/components/dashboard/project-selector";
import {
  useSubplots,
  useCreateSubplot,
  useDeleteSubplot,
} from "@/hooks/use-subplots";
import type { Subplot } from "@/hooks/use-subplots";
import { Loader2, Plus, GitBranch, Trash2, X } from "lucide-react";
import { toast } from "sonner";

// --- Badge helpers ---

const statusBadgeColors: Record<string, string> = {
  PLANNED: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  ON_HOLD: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  RESOLVED: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
};

const statusLabels: Record<string, string> = {
  PLANNED: "Pianificata",
  ACTIVE: "Attiva",
  ON_HOLD: "In Pausa",
  RESOLVED: "Risolta",
};

// --- Inner content component ---

function SubplotsInner({ projectId }: { projectId: string }) {
  const { data, isLoading } = useSubplots(projectId);
  const createMutation = useCreateSubplot();
  const deleteMutation = useDeleteSubplot();

  const [showDialog, setShowDialog] = useState(false);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formType, setFormType] = useState("");
  const [formStatus, setFormStatus] = useState("PLANNED");

  const items = data?.items ?? [];

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!formName.trim()) return;

    try {
      await createMutation.mutateAsync({
        projectId,
        name: formName.trim(),
        description: formDescription.trim() || undefined,
        type: formType.trim() || undefined,
        status: formStatus,
      });
      toast.success("Sottotrama creata con successo");
      setShowDialog(false);
      setFormName("");
      setFormDescription("");
      setFormType("");
      setFormStatus("PLANNED");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Errore nella creazione"
      );
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Eliminare la sottotrama "${name}"?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Sottotrama eliminata");
    } catch {
      toast.error("Errore nell'eliminazione");
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sottotrame</h1>
        <button
          onClick={() => setShowDialog(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Aggiungi
        </button>
      </div>

      {/* Empty state */}
      {items.length === 0 && (
        <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
          <GitBranch className="h-12 w-12 text-gray-300 dark:text-gray-600" />
          <div>
            <h3 className="font-medium">Nessuna sottotrama ancora</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Aggiungi sottotrame per arricchire la narrativa del tuo progetto.
            </p>
          </div>
        </div>
      )}

      {/* Cards grid */}
      {items.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((subplot: Subplot) => (
            <div
              key={subplot.id}
              className="group relative rounded-lg border p-4 dark:border-gray-800"
            >
              {/* Delete button */}
              <button
                onClick={() => handleDelete(subplot.id, subplot.name)}
                className="absolute right-3 top-3 rounded p-1 text-gray-400 opacity-0 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              {/* Name */}
              <h3 className="pr-8 font-semibold">{subplot.name}</h3>

              {/* Info row */}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusBadgeColors[subplot.status] ?? statusBadgeColors.PLANNED}`}
                >
                  {statusLabels[subplot.status] ?? subplot.status}
                </span>
                {subplot.type && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {subplot.type}
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div className="mt-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Progresso
                  </span>
                  <span className="text-xs font-medium">
                    {subplot.progress}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all"
                    style={{ width: `${Math.min(Math.max(subplot.progress, 0), 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-lg border bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Nuova Sottotrama</h2>
              <button
                onClick={() => setShowDialog(false)}
                className="rounded p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              {/* Name */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Nome <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                  placeholder="Nome della sottotrama"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Descrizione
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                  placeholder="Descrivi la sottotrama..."
                />
              </div>

              {/* Type */}
              <div>
                <label className="mb-1 block text-sm font-medium">Tipo</label>
                <input
                  type="text"
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                  placeholder="es. Romantica, Mistero, Politica..."
                />
              </div>

              {/* Status */}
              <div>
                <label className="mb-1 block text-sm font-medium">Stato</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDialog(false)}
                  className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {createMutation.isPending && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  Crea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Exported wrapper ---

export function SubplotsContent() {
  return (
    <ProjectSelector>
      {(projectId) => <SubplotsInner projectId={projectId} />}
    </ProjectSelector>
  );
}
