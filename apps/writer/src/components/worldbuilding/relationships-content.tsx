"use client";

import { useState } from "react";
import {
  Loader2,
  Plus,
  Trash2,
  ArrowRight,
  Users,
  X,
} from "lucide-react";
import {
  useRelationships,
  useCreateRelationship,
  useDeleteRelationship,
} from "@/hooks/use-relationships";
import { useCharacters } from "@/hooks/use-characters";
import { toast } from "sonner";

interface RelationshipsContentProps {
  projectId: string;
}

const RELATIONSHIP_TYPES = [
  "FAMILY",
  "ROMANTIC",
  "FRIENDSHIP",
  "RIVALRY",
  "ENEMY",
  "MENTOR_STUDENT",
  "EMPLOYER_EMPLOYEE",
  "ALLY",
  "NEUTRAL",
] as const;

const TYPE_LABELS: Record<string, string> = {
  FAMILY: "Famiglia",
  ROMANTIC: "Romantica",
  FRIENDSHIP: "Amicizia",
  RIVALRY: "Rivalita",
  ENEMY: "Nemico",
  MENTOR_STUDENT: "Mentore/Allievo",
  EMPLOYER_EMPLOYEE: "Capo/Dipendente",
  ALLY: "Alleato",
  NEUTRAL: "Neutrale",
};

const TYPE_COLORS: Record<string, string> = {
  FAMILY: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  ROMANTIC: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
  FRIENDSHIP:
    "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  RIVALRY:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  ENEMY: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  MENTOR_STUDENT:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  EMPLOYER_EMPLOYEE:
    "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  ALLY: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  NEUTRAL: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

export function RelationshipsContent({ projectId }: RelationshipsContentProps) {
  const { data: relData, isLoading: relLoading } = useRelationships(projectId);
  const { data: charData, isLoading: charLoading } = useCharacters(projectId);
  const createRelationship = useCreateRelationship();
  const deleteRelationship = useDeleteRelationship();

  const relationships = relData?.relationships ?? [];
  const characters = charData?.items ?? [];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [fromCharacterId, setFromCharacterId] = useState("");
  const [toCharacterId, setToCharacterId] = useState("");
  const [type, setType] = useState<string>("");
  const [description, setDescription] = useState("");
  const [currentState, setCurrentState] = useState("");

  const isLoading = relLoading || charLoading;

  const getCharacterName = (id: string): string => {
    const character = characters.find((c) => c.id === id);
    return character?.name ?? "Sconosciuto";
  };

  const resetForm = () => {
    setFromCharacterId("");
    setToCharacterId("");
    setType("");
    setDescription("");
    setCurrentState("");
  };

  const handleCreate = async () => {
    if (!fromCharacterId || !toCharacterId || !type) {
      toast.error("Compila tutti i campi obbligatori");
      return;
    }

    if (fromCharacterId === toCharacterId) {
      toast.error("Seleziona due personaggi diversi");
      return;
    }

    try {
      await createRelationship.mutateAsync({
        projectId,
        fromCharacterId,
        toCharacterId,
        type,
        description: description.trim() || undefined,
        currentState: currentState.trim() || undefined,
      });
      toast.success("Relazione creata");
      resetForm();
      setDialogOpen(false);
    } catch {
      toast.error("Errore nella creazione della relazione");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questa relazione?")) return;

    try {
      await deleteRelationship.mutateAsync(id);
      toast.success("Relazione eliminata");
    } catch {
      toast.error("Errore nell'eliminazione della relazione");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Relazioni tra Personaggi</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Gestisci le relazioni tra i personaggi del tuo mondo.
          </p>
        </div>
        <button
          onClick={() => setDialogOpen(true)}
          disabled={characters.length < 2}
          className="flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          <Plus className="h-4 w-4" />
          Aggiungi relazione
        </button>
      </div>

      {characters.length < 2 && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400">
          Servono almeno 2 personaggi per creare una relazione. Vai alla sezione
          Personaggi per aggiungerne.
        </div>
      )}

      {/* Relationships list */}
      {relationships.length === 0 ? (
        <div className="rounded-lg border p-12 text-center dark:border-gray-800">
          <Users className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
          <h3 className="mt-4 font-medium">Nessuna relazione</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Non hai ancora definito relazioni tra i personaggi.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {relationships.map((rel) => (
            <div
              key={rel.id}
              className="flex items-center gap-4 rounded-lg border p-4 dark:border-gray-800"
            >
              {/* Character A -> Character B */}
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <span className="truncate font-medium">
                  {getCharacterName(rel.fromCharacterId)}
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-gray-400" />
                <span className="truncate font-medium">
                  {getCharacterName(rel.toCharacterId)}
                </span>
              </div>

              {/* Type badge */}
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${TYPE_COLORS[rel.type] ?? TYPE_COLORS.NEUTRAL}`}
              >
                {TYPE_LABELS[rel.type] ?? rel.type}
              </span>

              {/* Description */}
              {rel.description && (
                <p className="hidden min-w-0 flex-1 truncate text-sm text-gray-500 dark:text-gray-400 md:block">
                  {rel.description}
                </p>
              )}

              {/* Delete button */}
              <button
                onClick={() => handleDelete(rel.id)}
                disabled={deleteRelationship.isPending}
                className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create dialog (modal overlay) */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-xl border bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Nuova relazione</h2>
              <button
                onClick={() => {
                  resetForm();
                  setDialogOpen(false);
                }}
                className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Da (from character) */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Da <span className="text-red-500">*</span>
                </label>
                <select
                  value={fromCharacterId}
                  onChange={(e) => setFromCharacterId(e.target.value)}
                  className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-white/20"
                >
                  <option value="">Seleziona personaggio...</option>
                  {characters.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* A (to character) */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  A <span className="text-red-500">*</span>
                </label>
                <select
                  value={toCharacterId}
                  onChange={(e) => setToCharacterId(e.target.value)}
                  className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-white/20"
                >
                  <option value="">Seleziona personaggio...</option>
                  {characters.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tipo */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Tipo <span className="text-red-500">*</span>
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-white/20"
                >
                  <option value="">Seleziona tipo...</option>
                  {RELATIONSHIP_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {TYPE_LABELS[t]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Descrizione */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Descrizione
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descrivi la relazione tra i due personaggi..."
                  rows={3}
                  className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-white/20"
                />
              </div>

              {/* Stato attuale */}
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Stato attuale
                </label>
                <input
                  type="text"
                  value={currentState}
                  onChange={(e) => setCurrentState(e.target.value)}
                  placeholder="Es. Alleati stretti, In conflitto..."
                  className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-white/20"
                />
              </div>
            </div>

            {/* Dialog actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  resetForm();
                  setDialogOpen(false);
                }}
                className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                Annulla
              </button>
              <button
                onClick={handleCreate}
                disabled={createRelationship.isPending}
                className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                {createRelationship.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                Crea relazione
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
