"use client";

import { Sparkles, Zap, Check, X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBillingStore } from "@/stores/billing-store";
import { useCreateCheckout } from "@/hooks/use-billing";

// ---------------------------------------------------------------------------
// Plan comparison data
// ---------------------------------------------------------------------------

interface PlanTier {
  id: string;
  name: string;
  price: string;
  priceId: string | null;
  features: string[];
  highlighted: boolean;
}

const PLANS: PlanTier[] = [
  {
    id: "writer",
    name: "Scrittore",
    price: "9,99",
    priceId: process.env.NEXT_PUBLIC_STRIPE_WRITER_PRICE_ID ?? null,
    features: [
      "Fino a 10 progetti",
      "50 generazioni IA al giorno",
      "Esportazione DOCX e Markdown",
      "Analisi del testo base",
      "Calendario di scrittura",
    ],
    highlighted: false,
  },
  {
    id: "professional",
    name: "Professionista",
    price: "19,99",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ?? null,
    features: [
      "Progetti illimitati",
      "200 generazioni IA al giorno",
      "Tutti i formati di esportazione",
      "Analisi avanzata del testo",
      "Controllo coerenza IA",
      "Supporto prioritario",
    ],
    highlighted: true,
  },
];

// ---------------------------------------------------------------------------
// Feature name mapping (for display)
// ---------------------------------------------------------------------------

const FEATURE_NAMES: Record<string, string> = {
  "ai-generate": "Generazione IA",
  "ai-suggestions": "Suggerimenti IA",
  "ai-coherence": "Controllo coerenza",
  export: "Esportazione",
  "export-docx": "Esportazione DOCX",
  "export-bible": "Esportazione bibbia",
  analytics: "Analisi avanzata",
  "text-analysis": "Analisi del testo",
  projects: "Progetti aggiuntivi",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function UpgradeOverlay() {
  const { upgradeDialogOpen, upgradeFeature, closeUpgradeDialog } =
    useBillingStore();
  const { mutate, isPending } = useCreateCheckout();

  const featureLabel =
    upgradeFeature && FEATURE_NAMES[upgradeFeature]
      ? FEATURE_NAMES[upgradeFeature]
      : upgradeFeature ?? "questa funzionalità";

  const handleUpgrade = (priceId: string | null) => {
    if (priceId) {
      mutate({ priceId });
    }
  };

  return (
    <Dialog open={upgradeDialogOpen} onOpenChange={closeUpgradeDialog}>
      <DialogContent className="max-w-lg sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-amber-500" />
            Aggiorna il tuo piano
          </DialogTitle>
          <DialogDescription>
            Per utilizzare{" "}
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {featureLabel}
            </span>{" "}
            è necessario un piano a pagamento. Scegli il piano più adatto alle
            tue esigenze.
          </DialogDescription>
        </DialogHeader>

        {/* Plan comparison */}
        <div className="grid gap-4 py-4 sm:grid-cols-2">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-xl border p-5 ${
                plan.highlighted
                  ? "border-blue-500 bg-blue-50/50 dark:border-blue-400 dark:bg-blue-950/20"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-2.5 right-4 bg-blue-600 text-white hover:bg-blue-600">
                  Consigliato
                </Badge>
              )}

              <div className="mb-4">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <div className="mt-1">
                  <span className="text-2xl font-bold">{plan.price}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    /mese
                  </span>
                </div>
              </div>

              <ul className="flex-1 space-y-2">
                {plan.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500 dark:text-green-400" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleUpgrade(plan.priceId)}
                disabled={isPending || !plan.priceId}
                className={`mt-4 w-full ${
                  plan.highlighted
                    ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    : ""
                }`}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Reindirizzamento...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Scegli {plan.name}
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>

        <DialogFooter className="flex-col items-center gap-2 sm:flex-col">
          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            Puoi annullare in qualsiasi momento. Nessun vincolo.
          </p>
          <Button
            variant="ghost"
            onClick={closeUpgradeDialog}
            className="text-sm"
          >
            <X className="mr-1 h-3.5 w-3.5" />
            Non ora
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
