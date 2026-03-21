"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Sparkles,
  Globe,
  BarChart3,
  PenTool,
  Rocket,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useOnboardingStatus,
  useCompleteOnboarding,
} from "@/hooks/use-onboarding";

const TOTAL_STEPS = 4;

const GENRES = [
  { value: "fantasy", label: "Fantasy" },
  { value: "sci-fi", label: "Fantascienza" },
  { value: "thriller", label: "Thriller" },
  { value: "romance", label: "Romantico" },
  { value: "horror", label: "Horror" },
  { value: "mystery", label: "Giallo" },
  { value: "literary", label: "Narrativa letteraria" },
  { value: "historical", label: "Storico" },
  { value: "adventure", label: "Avventura" },
  { value: "dystopian", label: "Distopico" },
  { value: "other", label: "Altro" },
];

const FEATURES = [
  {
    icon: PenTool,
    title: "Editor avanzato",
    description: "Scrivi con un editor pensato per la narrativa, con scene, note e separatori.",
  },
  {
    icon: Globe,
    title: "Worldbuilding",
    description:
      "Crea personaggi, luoghi, fazioni e sistemi magici per il tuo universo narrativo.",
  },
  {
    icon: Sparkles,
    title: "Assistente AI",
    description:
      "Genera testo, ottieni suggerimenti e verifica la coerenza narrativa con l'AI.",
  },
  {
    icon: BarChart3,
    title: "Statistiche",
    description:
      "Monitora i tuoi progressi, le parole scritte e le sessioni di scrittura.",
  },
];

export function OnboardingWizard() {
  const [step, setStep] = useState(0);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectGenre, setProjectGenre] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const router = useRouter();
  const { data: status, isLoading } = useOnboardingStatus();
  const completeOnboarding = useCompleteOnboarding();

  // Don't show the wizard if onboarding is already completed or still loading
  if (isLoading || status?.completed) {
    return null;
  }

  const canGoNext = () => {
    if (step === 1) {
      // Step 2 requires at least a title
      return projectTitle.trim().length > 0;
    }
    return true;
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleCreateProject = async () => {
    if (!projectTitle.trim()) return;

    setIsCreating(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: projectTitle.trim(),
          genre: projectGenre || undefined,
        }),
      });

      if (res.ok) {
        handleNext();
      }
    } catch {
      // Ignora l'errore e procedi comunque
      handleNext();
    } finally {
      setIsCreating(false);
    }
  };

  const handleSkip = async () => {
    await completeOnboarding.mutateAsync();
  };

  const handleFinish = async () => {
    await completeOnboarding.mutateAsync();
    router.push("/dashboard");
  };

  return (
    <Dialog open={!status?.completed} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-[520px]"
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step
                  ? "w-8 bg-primary"
                  : i < step
                    ? "w-4 bg-primary/40"
                    : "w-4 bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Benvenuto */}
        {step === 0 && (
          <>
            <DialogHeader className="items-center pt-4">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <BookOpen className="size-7 text-primary" />
              </div>
              <DialogTitle className="text-xl">
                Benvenuto su NeoByteWriter
              </DialogTitle>
              <DialogDescription className="text-center">
                Il tuo strumento completo per scrivere romanzi, costruire mondi
                narrativi e gestire la tua creativita con l&apos;aiuto
                dell&apos;intelligenza artificiale.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 px-1 py-2">
              <div className="flex items-start gap-3 rounded-lg border p-3">
                <PenTool className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-medium">Scrivi senza limiti</p>
                  <p className="text-xs text-muted-foreground">
                    Editor dedicato alla narrativa con capitoli, scene e note
                    dell&apos;autore.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border p-3">
                <Globe className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-medium">Costruisci il tuo mondo</p>
                  <p className="text-xs text-muted-foreground">
                    Personaggi, luoghi, fazioni, timeline e molto altro a portata
                    di clic.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border p-3">
                <Sparkles className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-medium">AI al tuo fianco</p>
                  <p className="text-xs text-muted-foreground">
                    Genera testo, verifica la coerenza e ottieni suggerimenti
                    intelligenti.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Step 2: Il tuo primo progetto */}
        {step === 1 && (
          <>
            <DialogHeader className="items-center pt-4">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <BookOpen className="size-7 text-primary" />
              </div>
              <DialogTitle className="text-xl">
                Il tuo primo progetto
              </DialogTitle>
              <DialogDescription className="text-center">
                Ogni grande storia inizia con un primo passo. Dai un nome al tuo
                progetto e scegli il genere.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 px-1 py-2">
              <div className="space-y-2">
                <Label htmlFor="project-title">
                  Titolo del progetto
                </Label>
                <Input
                  id="project-title"
                  placeholder="Es. La saga delle terre dimenticate"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-genre">
                  Genere (opzionale)
                </Label>
                <Select value={projectGenre} onValueChange={setProjectGenre}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Scegli un genere" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENRES.map((genre) => (
                      <SelectItem key={genre.value} value={genre.value}>
                        {genre.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}

        {/* Step 3: Esplora le funzionalita */}
        {step === 2 && (
          <>
            <DialogHeader className="items-center pt-4">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="size-7 text-primary" />
              </div>
              <DialogTitle className="text-xl">
                Esplora le funzionalita
              </DialogTitle>
              <DialogDescription className="text-center">
                Ecco gli strumenti principali che hai a disposizione per dare
                vita alle tue storie.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 px-1 py-2">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <feature.icon className="size-5 text-primary" />
                  </div>
                  <p className="text-sm font-medium">{feature.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Step 4: Tutto pronto */}
        {step === 3 && (
          <>
            <DialogHeader className="items-center pt-4">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Rocket className="size-7 text-primary" />
              </div>
              <DialogTitle className="text-xl">Tutto pronto!</DialogTitle>
              <DialogDescription className="text-center">
                Hai tutto quello che ti serve per iniziare. Buona scrittura!
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 px-1 py-2">
              <div className="rounded-lg border bg-muted/50 p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Puoi sempre trovare aiuto nella sezione{" "}
                  <span className="font-medium text-foreground">
                    Impostazioni
                  </span>{" "}
                  e usare la command palette con{" "}
                  <kbd className="inline-flex h-5 items-center rounded border bg-background px-1.5 font-mono text-[10px] font-medium">
                    Ctrl+K
                  </kbd>{" "}
                  per navigare velocemente.
                </p>
              </div>
              <div className="rounded-lg border bg-primary/5 p-4 text-center">
                <p className="text-sm font-medium text-primary">
                  Troverai una checklist nella dashboard per guidarti nei
                  prossimi passi.
                </p>
              </div>
            </div>
          </>
        )}

        {/* Footer buttons */}
        <DialogFooter className="flex-row items-center justify-between gap-2 sm:justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            disabled={completeOnboarding.isPending}
          >
            Salta
          </Button>

          <div className="flex items-center gap-2">
            {step > 0 && (
              <Button variant="outline" size="sm" onClick={handlePrev}>
                <ChevronLeft className="size-4" />
                Indietro
              </Button>
            )}

            {step === 1 ? (
              <Button
                size="sm"
                onClick={handleCreateProject}
                disabled={!canGoNext() || isCreating}
              >
                {isCreating ? "Creazione..." : "Crea e continua"}
                <ChevronRight className="size-4" />
              </Button>
            ) : step === TOTAL_STEPS - 1 ? (
              <Button
                size="sm"
                onClick={handleFinish}
                disabled={completeOnboarding.isPending}
              >
                {completeOnboarding.isPending
                  ? "Completamento..."
                  : "Vai alla dashboard"}
                <Rocket className="size-4" />
              </Button>
            ) : (
              <Button size="sm" onClick={handleNext} disabled={!canGoNext()}>
                Avanti
                <ChevronRight className="size-4" />
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
