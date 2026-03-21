import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface OnboardingStatus {
  completed: boolean;
  steps: {
    hasProject: boolean;
    hasChapter: boolean;
    hasCharacter: boolean;
    hasUsedAI: boolean;
    hasExported: boolean;
  };
}

export function useOnboardingStatus() {
  return useQuery<OnboardingStatus>({
    queryKey: ["onboarding-status"],
    queryFn: async () => {
      const res = await fetch("/api/user/onboarding");
      if (!res.ok) {
        throw new Error("Errore nel caricamento dello stato onboarding");
      }
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minuti
  });
}

export function useCompleteOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        throw new Error("Errore nel completamento dell'onboarding");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.setQueryData<OnboardingStatus>(
        ["onboarding-status"],
        (old) => {
          if (!old) return old;
          return { ...old, completed: true };
        }
      );
      queryClient.invalidateQueries({ queryKey: ["onboarding-status"] });
    },
  });
}

export type { OnboardingStatus };
