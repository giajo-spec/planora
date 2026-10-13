"use client";

import { BookOpen, CalendarDays, Dumbbell, Home, ShoppingBasket, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/state/app-store";
import { cn } from "@/lib/utils/cn";
import { Logo } from "./logo";

const NAV = [
  { href: "/accueil", label: "Accueil", icon: Home },
  { href: "/plan", label: "Plan", icon: CalendarDays },
  { href: "/recettes", label: "Recettes", icon: BookOpen },
  { href: "/epicerie", label: "Épicerie", icon: ShoppingBasket },
  { href: "/profil", label: "Profil", icon: UserRound },
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { groceryLines, groceryState, profile } = useApp();
  const remaining = groceryLines.filter((l) => !groceryState.checked[l.key] && !groceryState.pantry[l.key]).length;

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[17rem_1fr]">
      <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-ink focus:px-4 focus:py-3 focus:text-paper">
        Aller au contenu
      </a>

      {/* Barre latérale (ordinateur) */}
      <aside className="sticky top-0 hidden h-dvh flex-col border-r border-line bg-surface px-5 py-6 lg:flex">
        <Logo href="/accueil" />
        <nav aria-label="Navigation principale" className="mt-10 flex flex-col gap-1">
          {[...NAV.slice(0, 4), { href: "/en-forme", label: "En forme", icon: Dumbbell }, NAV[4]].map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-12 items-center gap-3 rounded-2xl px-4 font-bold transition",
                  active ? "bg-ink text-paper" : "text-ink-soft hover:bg-paper",
                )}
              >
                <Icon aria-hidden className={cn("size-5", active && "text-gold")} />
                {label}
                {href === "/epicerie" && remaining > 0 && (
                  <span className="ml-auto rounded-full bg-gold px-2 py-0.5 text-xs font-semibold text-ink">{remaining}</span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto rounded-3xl bg-paper p-4 text-sm">
          <p className="font-bold">{profile?.isDemo ? "Mode démonstration" : profile ? `Bonjour ${profile.name || "!"}` : "Bienvenue !"}</p>
          <p className="mt-1 text-ink-muted">Vos données restent dans ce navigateur.</p>
        </div>
      </aside>

      <main id="contenu" className="min-w-0">
        {children}
      </main>

      {/* Barre de navigation fixe (mobile) */}
      <nav
        aria-label="Navigation principale"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface/95 pb-safe-b shadow-nav backdrop-blur lg:hidden"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-5">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className="relative flex min-h-16 flex-col items-center justify-center gap-1 text-[0.72rem] font-bold"
                >
                  <span
                    className={cn(
                      "flex h-8 w-14 items-center justify-center rounded-full transition-colors",
                      active ? "bg-ink text-gold" : "text-ink-muted",
                    )}
                  >
                    <Icon aria-hidden className="size-[1.35rem]" />
                  </span>
                  <span className={active ? "text-ink" : "text-ink-muted"}>{label}</span>
                  {href === "/epicerie" && remaining > 0 && (
                    <span className="absolute right-[18%] top-1.5 min-w-5 rounded-full border border-surface bg-gold px-1 text-center text-[0.65rem] font-semibold leading-4 text-ink">
                      {remaining > 99 ? "99+" : remaining}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
