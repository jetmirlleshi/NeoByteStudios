"use client";

import { useState } from "react";
import { ProjectSelector } from "@/components/dashboard/project-selector";
import {
  useFactions,
  useCreateFaction,
  useDeleteFaction,
} from "@/hooks/use-factions";
import type { Faction } from "@/hooks/use-factions";
import { Loader2, Plus, Shield, Trash2, X } from "lucide-react";
import { toast } from "sonner";

// --- Inner content component ---

function FactionsInner({ projectId }: { projectId: string }) {
  const { data, isLoading } = useFactions(projectId);
  const createMutation = useCreateFaction();
  const deleteMutation = useDeleteFaction();

  const [showDialog, setShowDialog] = useState(false);
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState("");
  const [formDescription, setFormDescription] = useState("");

  const items = data?.items ?? [];

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!formName.trim()) return;

    try {
      await createMutation.mutateAsync({
        projectId,
        name: formName.trim(),
        type: formType.trim() || undefined,
        description: formDescription.trim() || undefined,
      });
      toast.success("Fazione creata con successo");
      setShowDialog(false);
      setFormName("");
      setFormType("");
      setFormDescription("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Errore nella creazione"
      );
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Eliminare la fazione "${name}"?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Fazione eliminata");
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
        <h1 className="text-2xl font-bold">Fazioni</h1>
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
          <Shield className="h-12 w-12 text-gray-300 dark:text-gray-600" />
          <div>
            <h3 className="font-medium">Nessuna fazione ancora</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Crea fazioni per definire i gruppi di potere nel tuo mondo.
            </p>
          </div>
        </div>
      )}

      {/* Cards grid */}
      {items.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((faction: Faction) => (
            <div
              key={faction.id}
              className="group relative rounded-lg border p-4 dark:border-gray-800"
            >
              {/* Delete button */}
              <button
                onClick={() => handleDelete(faction.id, faction.name)}
                className="absolute right-3 top-3 rounded p-1 text-gray-400 opacity-0 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              {/* Name */}
              <h3 className="pr-8 font-semibold">{faction.name}</h3>

              {/* Info row */}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {faction.type && (
                  <span className="inline-block rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300">
                    {faction.type}
                  </span>
                )}
              </div>

              {/* Leadership snippet */}
              {faction.leadership && (
                <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Leadership:
                  </span>{" "}
                  {faction.leadership}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-lg border bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Nuova Fazione</h2>
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
                  placeholder="Nome della fazione"
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
                  placeholder="es. Gilda, Ordine, Clan..."
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
                  placeholder="Descrivi la fazione..."
                />
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

export function FactionsContent() {
  return (
    <ProjectSelector>
      {(projectId) => <FactionsInner projectId={projectId} />}
    </ProjectSelector>
  );
}
