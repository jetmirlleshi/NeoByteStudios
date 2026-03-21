"use client";

import { Check, Loader2, Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCreateCheckout } from "@/hooks/use-billing";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface PlanCardProps {
  name: string;
  price: string;
  period: string;
  features: string[];
  current?: boolean;
  priceId?: string;
  popular?: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PlanCard({
  name,
  price,
  period,
  features,
  current = false,
  priceId,
  popular = false,
}: PlanCardProps) {
  const { mutate, isPending } = useCreateCheckout();

  const handleChoosePlan = () => {
    if (priceId) {
      mutate({ priceId });
    }
  };

  return (
    <Card
      className={`relative flex flex-col ${
        popular
          ? "border-blue-500 shadow-lg shadow-blue-500/10 dark:border-blue-400 dark:shadow-blue-400/10"
          : ""
      }`}
    >
      {/* Popular badge */}
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-blue-600 px-3 py-0.5 text-white hover:bg-blue-600 dark:bg-blue-500">
            <Star className="mr-1 h-3 w-3" />
            Più popolare
          </Badge>
        </div>
      )}

      <CardHeader className="text-center">
        <CardTitle className="text-lg">{name}</CardTitle>
        <CardDescription>
          <span className="text-3xl font-bold text-gray-900 dark:text-gray-50">
            {price}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            /{period}
          </span>
        </CardDescription>
        {current && (
          <Badge
            variant="outline"
            className="mx-auto mt-2 border-green-500 text-green-600 dark:border-green-400 dark:text-green-400"
          >
            <Check className="mr-1 h-3 w-3" />
            Piano attuale
          </Badge>
        )}
      </CardHeader>

      <CardContent className="flex-1">
        <ul className="space-y-2.5">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500 dark:text-green-400" />
              <span className="text-gray-700 dark:text-gray-300">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        {current ? (
          <Button variant="outline" className="w-full" disabled>
            Piano attuale
          </Button>
        ) : (
          <Button
            onClick={handleChoosePlan}
            disabled={isPending || !priceId}
            className={`w-full ${
              popular
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
              "Scegli piano"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
