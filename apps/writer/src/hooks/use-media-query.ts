"use client";

import { useEffect, useState } from "react";

/**
 * Hook che rileva se una media query corrisponde allo schermo attuale.
 * Restituisce `false` durante il rendering lato server (SSR) per evitare
 * mismatch di idratazione, poi si aggiorna lato client.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    // Imposta il valore iniziale lato client
    setMatches(mediaQuery.matches);

    // Listener per aggiornamenti in tempo reale
    function handleChange(event: MediaQueryListEvent) {
      setMatches(event.matches);
    }

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}

/**
 * Restituisce `true` se lo schermo e' mobile (larghezza < 768px).
 */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767px)");
}

/**
 * Restituisce `true` se lo schermo e' tablet (768px - 1023px).
 */
export function useIsTablet(): boolean {
  return useMediaQuery("(min-width: 768px) and (max-width: 1023px)");
}

/**
 * Restituisce `true` se lo schermo e' desktop (larghezza >= 1024px).
 */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}
