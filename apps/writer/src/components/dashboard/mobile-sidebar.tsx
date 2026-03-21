"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BookOpen,
  LayoutDashboard,
  Users,
  MapPin,
  Swords,
  Wand2,
  ScrollText,
  Clock,
  GitFork,
  Package,
  Shield,
  BarChart3,
  Settings,
  Menu,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-media-query";

const mainNav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Progetti", icon: BookOpen },
  { href: "/dashboard/analytics", label: "Statistiche", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Impostazioni", icon: Settings },
];

const worldbuildingNav = [
  { href: "/dashboard/characters", label: "Personaggi", icon: Users },
  { href: "/dashboard/locations", label: "Luoghi", icon: MapPin },
  { href: "/dashboard/factions", label: "Fazioni", icon: Shield },
  { href: "/dashboard/items", label: "Oggetti", icon: Package },
  { href: "/dashboard/magic", label: "Magia", icon: Wand2 },
  { href: "/dashboard/rules", label: "Regole", icon: ScrollText },
  { href: "/dashboard/timeline", label: "Timeline", icon: Clock },
  { href: "/dashboard/subplots", label: "Sottotrame", icon: GitFork },
  { href: "/dashboard/relationships", label: "Relazioni", icon: Swords },
];

/**
 * Sidebar mobile che si apre come Sheet laterale.
 * Visibile solo su schermi con larghezza < 768px.
 * Si chiude automaticamente quando l'utente naviga verso una pagina.
 */
export function MobileSidebar() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  // Non renderizzare nulla se non siamo su mobile
  if (!isMobile) {
    return null;
  }

  function handleNavigation() {
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white md:hidden"
          aria-label="Apri menu di navigazione"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle className="text-left text-lg">
            NeoByteWriter
          </SheetTitle>
        </SheetHeader>

        <nav className="flex-1 overflow-y-auto p-3">
          {/* Navigazione principale */}
          <ul className="space-y-1">
            {mainNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={handleNavigation}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? "bg-gray-100 font-medium text-gray-900 dark:bg-gray-800 dark:text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                    }`}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Sezione Worldbuilding */}
          <div className="mt-6 mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Worldbuilding
          </div>

          <ul className="space-y-1">
            {worldbuildingNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={handleNavigation}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? "bg-gray-100 font-medium text-gray-900 dark:bg-gray-800 dark:text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                    }`}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
