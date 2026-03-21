"use client";

import * as React from "react";
import { Mail, CheckCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSubscribeNewsletter } from "@/hooks/use-newsletter";

export function NewsletterForm() {
  const [email, setEmail] = React.useState("");
  const subscribe = useSubscribeNewsletter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    subscribe.mutate(trimmed);
  }

  // Show success state
  if (subscribe.isSuccess) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border p-6 text-center">
        <CheckCircle className="size-8 text-green-600" />
        <p className="text-sm font-medium">Iscrizione confermata!</p>
        <p className="text-muted-foreground text-xs">
          Riceverai i nostri aggiornamenti nella tua casella di posta.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border p-6">
      <div className="flex items-center gap-2">
        <Mail className="text-muted-foreground size-5" />
        <h3 className="text-base font-semibold">Iscriviti alla newsletter</h3>
      </div>
      <p className="text-muted-foreground text-sm">
        Ricevi aggiornamenti e consigli di scrittura
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder="la-tua@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={subscribe.isPending}
          className="flex-1"
        />
        <Button type="submit" disabled={subscribe.isPending} size="default">
          {subscribe.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Iscriviti"
          )}
        </Button>
      </form>

      {subscribe.isError && (
        <p className="text-destructive text-xs">
          {subscribe.error.message}
        </p>
      )}
    </div>
  );
}
