"use client";

import { useState } from "react";
import { ProjectSelector } from "@/components/dashboard/project-selector";
import {
  useLocations,
  useCreateLocation,
  useDeleteLocation,
} from "@/hooks/use-locations";
import type { Location } from "@/hooks/use-locations";
import { Loader2, Plus, MapPin, Trash2, X } from "lucide-react";
import { toast } from "sonner";

// --- Inner content component ---

function LocationsInner({ projectId }: { projectId: string }) {
  const { data, isLoading } = useLocations(projectId);
  const createMutation = useCreateLocation();
  const deleteMutation = useDeleteLocation();

  const [showDialog, setShowDialog] = useState(false);
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState("");
  const [formRegion, setFormRegion] = useState("");
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
        region: formRegion.trim() || undefined,
        description: formDescription.trim() || undefined,
      });
      toast.success("Luogo creato con successo");
      setShowDialog(false);
      setFormName("");
      setFormType("");
      setFormRegion("");
      setFormDescription("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Errore nella creazione"
      );
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Eliminare il luogo "${name}"?`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Luogo eliminato");
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
        <h1 className="text-2xl font-bold">Luoghi</h1>
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
          <MapPin className="h-12 w-12 text-gray-300 dark:text-gray-600" />
          <div>
            <h3 className="font-medium">Nessun luogo ancora</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Aggiungi luoghi per definire la geografia del tuo mondo.
            </p>
          </div>
        </div>
      )}

      {/* Cards grid */}
      {items.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((loc: Location) => (
            <div
              key={loc.id}
              className="group relative rounded-lg border p-4 dark:border-gray-800"
            >
              {/* Delete button */}
              <button
                onClick={() => handleDelete(loc.id, loc.name)}
                className="absolute right-3 top-3 rounded p-1 text-gray-400 opacity-0 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              {/* Name */}
              <h3 className="pr-8 font-semibold">{loc.name}</h3>

              {/* Info row */}
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {loc.type && (
                  <span className="inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                    {loc.type}
                  </span>
                )}
                {loc.region && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {loc.region}
                  </span>
                )}
              </div>

              {/* Mood */}
              {loc.mood && (
                <p className="mt-2 line-clamp-2 text-sm italic text-gray-500 dark:text-gray-400">
                  {loc.mood}
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
              <h2 className="text-lg font-semibold">Nuovo Luogo</h2>
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
                  placeholder="Nome del luogo"
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
                  placeholder="es. Citta, Foresta, Dungeon..."
                />
              </div>

              {/* Region */}
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Regione
                </label>
                <input
                  type="text"
                  value={formRegion}
                  onChange={(e) => setFormRegion(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                  placeholder="Regione o area geografica"
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
                  placeholder="Descrivi il luogo..."
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

export function LocationsContent() {
  return (
    <ProjectSelector>
      {(projectId) => <LocationsInner projectId={projectId} />}
    </ProjectSelector>
  );
}
