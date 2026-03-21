"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  X,
  BookOpen,
  FileText,
  Users,
  Sparkles,
  Download,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useOnboardingStatus } from "@/hooks/use-onboarding";

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: React.ElementType;
  stateKey: keyof NonNullable<
    ReturnType<typeof useOnboardingStatus>["data"]
  >["steps"];
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: "project",
    label: "Crea il tuo primo progetto",
    description: "Inizia dando un nome alla tua storia e scegliendo un genere.",
    href: "/dashboard/projects",
    icon: BookOpen,
    stateKey: "hasProject",
  },
  {
    id: "chapter",
    label: "Scrivi il primo capitolo",
    description: "Apri il tuo progetto e aggiungi il primo capitolo.",
    href: "/dashboard/projects",
    icon: FileText,
    stateKey: "hasChapter",
  },
  {
    id: "character",
    label: "Aggiungi un personaggio",
    description: "Crea un personaggio con nome, ruolo e backstory.",
    href: "/dashboard/characters",
    icon: Users,
    stateKey: "hasCharacter",
  },
  {
    id: "ai",
    label: "Prova l'assistente AI",
    description:
      "Usa l'AI per generare testo o ottenere suggerimenti nell'editor.",
    href: "/dashboard/projects",
    icon: Sparkles,
    stateKey: "hasUsedAI",
  },
  {
    id: "export",
    label: "Esporta il manoscritto",
    description: "Scarica il tuo lavoro in formato DOCX o PDF.",
    href: "/dashboard/projects",
    icon: Download,
    stateKey: "hasExported",
  },
];

export function OnboardingChecklist() {
  const [collapsed, setCollapsed] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { data: status, isLoading } = useOnboardingStatus();

  // Don't render if loading, dismissed, or all steps complete
  if (isLoading || dismissed || !status) {
    return null;
  }

  // Don't show checklist for users who haven't gone through onboarding wizard
  // (they would see the wizard instead)
  if (!status.completed) {
    return null;
  }

  const completedCount = CHECKLIST_ITEMS.filter(
    (item) => status.steps[item.stateKey]
  ).length;

  const totalCount = CHECKLIST_ITEMS.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  // All tasks done - don't show checklist
  if (completedCount === totalCount) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 z-40 w-80 shadow-lg">
      <CardHeader className="flex-row items-center justify-between space-y-0 gap-2 pb-3">
        <div className="flex-1 space-y-1">
          <CardTitle className="text-sm font-semibold">
            Primi passi
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {completedCount} di {totalCount} completati
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Espandi checklist" : "Comprimi checklist"}
          >
            {collapsed ? (
              <ChevronUp className="size-3.5" />
            ) : (
              <ChevronDown className="size-3.5" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setDismissed(true)}
            aria-label="Chiudi checklist"
          >
            <X className="size-3.5" />
          </Button>
        </div>
      </CardHeader>

      {!collapsed && (
        <CardContent className="space-y-3 pt-0">
          <Progress value={progressPercent} className="h-1.5" />

          <ul className="space-y-1">
            {CHECKLIST_ITEMS.map((item) => {
              const isCompleted = status.steps[item.stateKey];
              const Icon = item.icon;

              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`group flex items-start gap-3 rounded-lg p-2 text-sm transition-colors hover:bg-accent ${
                      isCompleted ? "opacity-60" : ""
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="size-4 text-primary" />
                      ) : (
                        <Circle className="size-4 text-muted-foreground group-hover:text-primary" />
                      )}
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <p
                        className={`text-sm leading-tight ${
                          isCompleted
                            ? "line-through text-muted-foreground"
                            : "font-medium"
                        }`}
                      >
                        {item.label}
                      </p>
                      {!isCompleted && (
                        <p className="text-xs text-muted-foreground leading-snug">
                          {item.description}
                        </p>
                      )}
                    </div>
                    {!isCompleted && (
                      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </CardContent>
      )}
    </Card>
  );
}
