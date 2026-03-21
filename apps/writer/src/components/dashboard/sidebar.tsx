"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

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

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`relative flex flex-col border-r bg-gray-50/50 transition-all duration-200 dark:bg-gray-900/50 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border bg-white shadow-sm dark:bg-gray-800"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>

      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {mainNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-gray-100 font-medium text-gray-900 dark:bg-gray-800 dark:text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                  }`}
                  title={item.label}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>

        {!collapsed && (
          <div className="mt-6 mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Worldbuilding
          </div>
        )}
        {collapsed && <div className="my-4 border-t" />}

        <ul className="space-y-1">
          {worldbuildingNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-gray-100 font-medium text-gray-900 dark:bg-gray-800 dark:text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                  }`}
                  title={item.label}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
