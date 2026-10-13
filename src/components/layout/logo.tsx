import Link from "next/link";
import { cn } from "@/lib/utils/cn";

/** Monogramme PLANORA : « P » sérif sur noir chaud, cerclé d'or. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={cn("size-9", className)}>
      <rect width="40" height="40" rx="11" fill="#16140F" />
      <circle cx="20" cy="20" r="13.5" fill="none" stroke="#C6A46C" strokeWidth="0.9" />
      <text x="20" y="26.2" textAnchor="middle" fontFamily="'Fraunces Variable', Georgia, serif" fontSize="18" fontStyle="italic" fill="#E2CC9F">
        P
      </text>
    </svg>
  );
}

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("inline-flex min-h-tap items-center gap-3 rounded-full", className)} aria-label="PLANORA — accueil">
      <LogoMark />
      <span className="font-display text-[1.35rem] font-normal leading-none tracking-[0.22em]">PLANORA</span>
    </Link>
  );
}
