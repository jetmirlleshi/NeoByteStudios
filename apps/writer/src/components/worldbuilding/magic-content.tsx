"use client";

import { useState, useEffect } from "react";
import { Loader2, Sparkles, Save } from "lucide-react";
import { useMagicSystem, useUpsertMagicSystem } from "@/hooks/use-magic-system";
import { toast } from "sonner";

interface MagicContentProps {
  projectId: string;
}

export function MagicContent({ projectId }: MagicContentProps) {
  const { data, isLoading } = useMagicSystem(projectId);
  const upsertMagicSystem = useUpsertMagicSystem();

  const magicSystem = data?.magicSystem ?? null;

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [source, setSource] = useState("");
  const [costs, setCosts] = useState("");
  const [limitations, setLimitations] = useState("");
  const [practitioners, setPractitioners] = useState("");
  const [history, setHistory] = useState("");

  // Populate form fields when data loads
  useEffect(() => {
    if (magicSystem) {
      setName(magicSystem.name ?? "");
      setDescription(magicSystem.description ?? "");
      setSource(magicSystem.source ?? "");
      setCosts(magicSystem.costs ?? "");
      setLimitations(magicSystem.limitations ?? "");
      setPractitioners(magicSystem.practitioners ?? "");
      setHistory(magicSystem.history ?? "");
      setShowForm(true);
    }
  }, [magicSystem]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Il nome e obbligatorio");
      return;
    }

    try {
      await upsertMagicSystem.mutateAsync({
        projectId,
        name: name.trim(),
        description: description.trim() || null,
        source: source.trim() || null,
        costs: costs.trim() || null,
        limitations: limitations.trim() || null,
        practitioners: practitioners.trim() || null,
        history: history.trim() || null,
      });
      toast.success("Sistema magico salvato");
    } catch {
      toast.error("Errore nel salvataggio del sistema magico");
    }
  };

  const handleCreate = () => {
    setName("");
    setDescription("");
    setSource("");
    setCosts("");
    setLimitations("");
    setPractitioners("");
    setHistory("");
    setShowForm(true);
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Sistema Magico</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Definisci il sistema di magia del tuo mondo.
        </p>
      </div>

      {!showForm && !magicSystem ? (
        /* Empty state */
        <div className="rounded-lg border p-12 text-center dark:border-gray-800">
          <Sparkles className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
          <h3 className="mt-4 font-medium">Nessun sistema magico</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Non hai ancora definito un sistema magico per questo progetto.
          </p>
          <button
            onClick={handleCreate}
            className="mt-4 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            Crea sistema magico
          </button>
        </div>
      ) : (
        /* Editable form */
        <div className="space-y-5">
          {/* Nome */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Nome <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Es. Tessitura Arcana"
              className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-white/20"
            />
          </div>

          {/* Descrizione */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Descrizione
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrivi il tuo sistema magico..."
              rows={4}
              className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-white/20"
            />
          </div>

          {/* Fonte del potere */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Fonte del potere
            </label>
            <textarea
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Da dove proviene il potere magico?"
              rows={3}
              className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-white/20"
            />
          </div>

          {/* Costo della magia */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Costo della magia
            </label>
            <textarea
              value={costs}
              onChange={(e) => setCosts(e.target.value)}
              placeholder="Qual e il costo dell'utilizzo della magia?"
              rows={3}
              className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-white/20"
            />
          </div>

          {/* Limitazioni */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Limitazioni
            </label>
            <textarea
              value={limitations}
              onChange={(e) => setLimitations(e.target.value)}
              placeholder="Quali sono i limiti della magia?"
              rows={3}
              className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-white/20"
            />
          </div>

          {/* Praticanti */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Praticanti
            </label>
            <textarea
              value={practitioners}
              onChange={(e) => setPractitioners(e.target.value)}
              placeholder="Chi puo usare la magia? Come si diventa praticanti?"
              rows={3}
              className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-white/20"
            />
          </div>

          {/* Storia */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">Storia</label>
            <textarea
              value={history}
              onChange={(e) => setHistory(e.target.value)}
              placeholder="La storia e l'evoluzione della magia nel tuo mondo..."
              rows={3}
              className="w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/20 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-white/20"
            />
          </div>

          {/* Save button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleSave}
              disabled={upsertMagicSystem.isPending}
              className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              {upsertMagicSystem.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Salva modifiche
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
