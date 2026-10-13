"use client";

import { Minus, Plus } from "lucide-react";
import { formatAmount, nextServings } from "@/lib/nutrition/portions";
import { cn } from "@/lib/utils/cn";

/** Sélecteur de portions (pas de ½ sous 2, puis entiers). */
export function ServingsStepper({
  value,
  onChange,
  label = "Portions",
  size = "md",
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  size?: "md" | "lg";
  className?: string;
}) {
  const btn = cn(
    "inline-flex items-center justify-center rounded-full bg-ink text-paper transition active:scale-90 disabled:opacity-30",
    size === "lg" ? "size-12" : "size-11",
  );
  return (
    <div role="group" aria-label={label} className={cn("inline-flex items-center gap-1 rounded-full border-2 border-ink bg-surface p-1", className)}>
      <button type="button" className={btn} aria-label={`Retirer une portion (${label})`} disabled={value <= 0.5} onClick={() => onChange(nextServings(value, -1))}>
        <Minus aria-hidden className="size-5" />
      </button>
      <output aria-live="polite" className={cn("min-w-[4.5rem] text-center font-display font-extrabold tabular-nums", size === "lg" ? "text-2xl" : "text-lg")}>
        {formatAmount(value)}
        <span className="sr-only"> portions</span>
      </output>
      <button type="button" className={btn} aria-label={`Ajouter une portion (${label})`} disabled={value >= 24} onClick={() => onChange(nextServings(value, 1))}>
        <Plus aria-hidden className="size-5" />
      </button>
    </div>
  );
}
