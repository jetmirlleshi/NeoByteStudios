"use client";

import { useCallback, useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Settings,
  FilePlus,
  FileText,
  Sun,
  Moon,
  Monitor,
  Search,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { setTheme } = useTheme();

  // Toggle the command palette with Cmd+K / Ctrl+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const runCommand = useCallback(
    (command: () => void) => {
      setOpen(false);
      command();
    },
    []
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="overflow-hidden p-0 sm:max-w-[520px]"
        showCloseButton={false}
      >
        <Command
          className="[&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium"
          loop
        >
          <div className="flex items-center gap-2 border-b px-3">
            <Search className="size-4 shrink-0 opacity-50" />
            <Command.Input
              placeholder="Cerca comandi..."
              className="placeholder:text-muted-foreground flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-1">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              Nessun risultato trovato.
            </Command.Empty>

            {/* Navigazione */}
            <Command.Group heading="Navigazione">
              <Command.Item
                value="dashboard"
                onSelect={() =>
                  runCommand(() => router.push("/dashboard"))
                }
                className="relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
              >
                <LayoutDashboard className="size-4" />
                <span>Dashboard</span>
              </Command.Item>
              <Command.Item
                value="progetti"
                onSelect={() =>
                  runCommand(() => router.push("/dashboard/projects"))
                }
                className="relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
              >
                <BookOpen className="size-4" />
                <span>Progetti</span>
              </Command.Item>
              <Command.Item
                value="statistiche analytics"
                onSelect={() =>
                  runCommand(() => router.push("/dashboard/analytics"))
                }
                className="relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
              >
                <BarChart3 className="size-4" />
                <span>Statistiche</span>
              </Command.Item>
              <Command.Item
                value="impostazioni settings"
                onSelect={() =>
                  runCommand(() => router.push("/dashboard/settings"))
                }
                className="relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
              >
                <Settings className="size-4" />
                <span>Impostazioni</span>
              </Command.Item>
            </Command.Group>

            {/* Azioni rapide */}
            <Command.Group heading="Azioni rapide">
              <Command.Item
                value="nuovo progetto crea"
                onSelect={() =>
                  runCommand(() => router.push("/dashboard/projects?new=true"))
                }
                className="relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
              >
                <FilePlus className="size-4" />
                <span>Nuovo progetto</span>
              </Command.Item>
              <Command.Item
                value="nuovo capitolo crea scrivi"
                onSelect={() =>
                  runCommand(() => router.push("/dashboard/projects?action=new-chapter"))
                }
                className="relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
              >
                <FileText className="size-4" />
                <span>Nuovo capitolo</span>
              </Command.Item>
            </Command.Group>

            {/* Tema */}
            <Command.Group heading="Tema">
              <Command.Item
                value="tema chiaro light"
                onSelect={() => runCommand(() => setTheme("light"))}
                className="relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
              >
                <Sun className="size-4" />
                <span>Tema chiaro</span>
              </Command.Item>
              <Command.Item
                value="tema scuro dark"
                onSelect={() => runCommand(() => setTheme("dark"))}
                className="relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
              >
                <Moon className="size-4" />
                <span>Tema scuro</span>
              </Command.Item>
              <Command.Item
                value="tema sistema system auto"
                onSelect={() => runCommand(() => setTheme("system"))}
                className="relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
              >
                <Monitor className="size-4" />
                <span>Tema sistema</span>
              </Command.Item>
            </Command.Group>
          </Command.List>

          {/* Footer con shortcut hint */}
          <div className="flex items-center justify-between border-t px-3 py-2">
            <span className="text-xs text-muted-foreground">
              Usa le frecce per navigare
            </span>
            <div className="flex items-center gap-1">
              <kbd className="pointer-events-none flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">Esc</span>
              </kbd>
              <span className="text-xs text-muted-foreground">per chiudere</span>
            </div>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
