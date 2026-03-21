"use client";

import * as React from "react";
import { MessageSquarePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSendFeedback } from "@/hooks/use-feedback";

const FEEDBACK_TYPES = [
  { value: "BUG", label: "Bug" },
  { value: "SUGGESTION", label: "Suggerimento" },
  { value: "OTHER", label: "Altro" },
] as const;

type FeedbackType = (typeof FEEDBACK_TYPES)[number]["value"];

interface FeedbackDialogProps {
  trigger?: React.ReactNode;
}

export function FeedbackDialog({ trigger }: FeedbackDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [type, setType] = React.useState<FeedbackType>("SUGGESTION");
  const [message, setMessage] = React.useState("");

  const sendFeedback = useSendFeedback();

  function resetForm() {
    setType("SUGGESTION");
    setMessage("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = message.trim();
    if (!trimmed) {
      toast.error("Inserisci un messaggio");
      return;
    }
    if (trimmed.length < 10) {
      toast.error("Il messaggio deve essere di almeno 10 caratteri");
      return;
    }

    sendFeedback.mutate(
      { type, message: trimmed },
      {
        onSuccess: () => {
          toast.success("Feedback inviato con successo!");
          resetForm();
          setOpen(false);
        },
        onError: (error) => {
          toast.error(error.message || "Errore nell'invio del feedback");
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm">
            <MessageSquarePlus className="size-4" />
            Feedback
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Invia Feedback</DialogTitle>
            <DialogDescription>
              Aiutaci a migliorare NeoByteWriter. Ogni suggerimento conta!
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            {/* Type selector */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="feedback-type">Tipo</Label>
              <Select
                value={type}
                onValueChange={(v) => setType(v as FeedbackType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleziona tipo" />
                </SelectTrigger>
                <SelectContent>
                  {FEEDBACK_TYPES.map((ft) => (
                    <SelectItem key={ft.value} value={ft.value}>
                      {ft.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Message textarea */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="feedback-message">Messaggio</Label>
              <textarea
                id="feedback-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Descrivi il bug, la funzionalità richiesta o il tuo feedback..."
                rows={5}
                maxLength={5000}
                disabled={sendFeedback.isPending}
                className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 w-full resize-none rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
              />
              <p className="text-muted-foreground text-xs text-right">
                {message.length}/5000
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={sendFeedback.isPending}
            >
              Annulla
            </Button>
            <Button type="submit" disabled={sendFeedback.isPending}>
              {sendFeedback.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Invio...
                </>
              ) : (
                "Invia Feedback"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
