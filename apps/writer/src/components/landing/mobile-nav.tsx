"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Chiudi menu" : "Apri menu"}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </Button>

      {open && (
        <div className="absolute left-0 top-16 w-full border-b bg-white p-4 shadow-lg dark:bg-gray-950">
          <nav className="flex flex-col gap-4">
            <a
              href="#funzionalita"
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Funzionalit&agrave;
            </a>
            <a
              href="#prezzi"
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Prezzi
            </a>
            <a
              href="#faq"
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              FAQ
            </a>
            <div className="mt-2 flex flex-col gap-2 border-t pt-4">
              <Button variant="outline" asChild className="w-full">
                <Link href="/auth/sign-in">Accedi</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/auth/sign-up">
                  Inizia gratis
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
