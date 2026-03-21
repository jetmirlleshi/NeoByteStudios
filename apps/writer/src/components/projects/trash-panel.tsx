"use client";

import { useState } from "react";
import {
  Trash2,
  X,
  RotateCcw,
  BookOpen,
  Users,
  MapPin,
  Package,
  Shield,
  Loader2,
} from "lucide-react";
import { useTrash, type TrashData } from "@/hooks/use-trash";
import { useRestoreItem } from "@/hooks/use-trash";

// --- Types ---

interface TrashPanelProps {
  projectId: string;
  open: boolean;
  onClose: () => void;
}

type EntityType = "chapter" | "character" | "location" | "item" | "faction";

// --- Helpers ---

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getTotalCount(data: TrashData | undefined): number {
  if (!data) return 0;
  return (
    data.chapters.length +
    data.characters.length +
    data.locations.length +
    data.items.length +
    data.factions.length
  );
}

// --- Section Components ---

interface TrashSectionProps<
  T extends { id: string; deletedAt: string },
> {
  title: string;
  icon: React.ReactNode;
  items: T[];
  entityType: EntityType;
  getLabel: (item: T) => string;
  getSubLabel?: (item: T) => string | null;
  onRestore: (entityType: EntityType, entityId: string) => void;
  restoringId: string | null;
}

function TrashSection<T extends { id: string; deletedAt: string }>({
  title,
  icon,
  items,
  entityType,
  getLabel,
  getSubLabel,
  onRestore,
  restoringId,
}: TrashSectionProps<T>) {
  if (items.length === 0) return null;

  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
        {icon}
        <span>
          {title} ({items.length})
        </span>
      </div>
      <ul className="space-y-1">
        {items.map((item) => {
          const subLabel = getSubLabel?.(item);
          const isRestoring = restoringId === item.id;

          return (
            <li
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  {getLabel(item)}
                </p>
                <div className="flex items-center gap-2">
                  {subLabel && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {subLabel}
                    </span>
                  )}
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {formatDate(item.deletedAt)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onRestore(entityType, item.id)}
                disabled={isRestoring}
                className="ml-2 flex shrink-0 items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100 disabled:opacity-50 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                title="Ripristina"
              >
                {isRestoring ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <RotateCcw className="h-3 w-3" />
                )}
                <span>Ripristina</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// --- Main Component ---

export function TrashPanel({ projectId, open, onClose }: TrashPanelProps) {
  const { data, isLoading } = useTrash(projectId);
  const restoreMutation = useRestoreItem();
  const [restoringId, setRestoringId] = useState<string | null>(null);

  function handleRestore(entityType: EntityType, entityId: string) {
    setRestoringId(entityId);
    restoreMutation.mutate(
      { projectId, entityType, entityId },
      {
        onSettled: () => setRestoringId(null),
      }
    );
  }

  const totalCount = getTotalCount(data);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l bg-gray-50 shadow-xl dark:border-gray-700 dark:bg-gray-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Cestino
            </h2>
            {totalCount > 0 && (
              <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                {totalCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          )}

          {!isLoading && totalCount === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Trash2 className="mb-3 h-12 w-12 text-gray-300 dark:text-gray-600" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Il cestino è vuoto
              </p>
              <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                Gli elementi eliminati appariranno qui
              </p>
            </div>
          )}

          {!isLoading && data && totalCount > 0 && (
            <>
              <TrashSection
                title="Capitoli"
                icon={<BookOpen className="h-3.5 w-3.5" />}
                items={data.chapters}
                entityType="chapter"
                getLabel={(ch) => ch.title}
                getSubLabel={(ch) => `Cap. ${ch.number}`}
                onRestore={handleRestore}
                restoringId={restoringId}
              />
              <TrashSection
                title="Personaggi"
                icon={<Users className="h-3.5 w-3.5" />}
                items={data.characters}
                entityType="character"
                getLabel={(ch) => ch.name}
                getSubLabel={(ch) => ch.role}
                onRestore={handleRestore}
                restoringId={restoringId}
              />
              <TrashSection
                title="Luoghi"
                icon={<MapPin className="h-3.5 w-3.5" />}
                items={data.locations}
                entityType="location"
                getLabel={(loc) => loc.name}
                getSubLabel={(loc) => loc.type}
                onRestore={handleRestore}
                restoringId={restoringId}
              />
              <TrashSection
                title="Oggetti"
                icon={<Package className="h-3.5 w-3.5" />}
                items={data.items}
                entityType="item"
                getLabel={(it) => it.name}
                getSubLabel={(it) => it.type}
                onRestore={handleRestore}
                restoringId={restoringId}
              />
              <TrashSection
                title="Fazioni"
                icon={<Shield className="h-3.5 w-3.5" />}
                items={data.factions}
                entityType="faction"
                getLabel={(f) => f.name}
                onRestore={handleRestore}
                restoringId={restoringId}
              />
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-4 py-3 dark:border-gray-700">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Gli elementi nel cestino possono essere ripristinati in qualsiasi
            momento.
          </p>
        </div>
      </div>
    </>
  );
}
