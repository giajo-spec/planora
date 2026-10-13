import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={cn("size-9", className)}>
      <rect width="40" height="40" rx="12" fill="#14151A" />
      <circle cx="20" cy="21" r="11" fill="#C6F432" />
      <path d="M20 10c2.5-4 7-5 9-4-1 3-4 6-9 4Z" fill="#FF5B2E" />
      <circle cx="16" cy="22" r="2.4" fill="#14151A" />
      <circle cx="23.5" cy="19" r="1.6" fill="#14151A" />
    </svg>
  );
}

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("inline-flex min-h-tap items-center gap-2.5 rounded-full", className)} aria-label="Projet Nutrition — accueil">
      <LogoMark />
      <span className="font-display text-lg font-extrabold leading-none tracking-tight">
        Projet
        <br />
        Nutrition
      </span>
    </Link>
  );
}
