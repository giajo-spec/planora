"use client";

import Image from "next/image";
import { useState } from "react";
import manifest from "@/lib/data/image-manifest.json";
import type { Recipe } from "@/lib/domain/types";
import { cn } from "@/lib/utils/cn";

const PHOTOS = manifest as Record<string, string>;

/** Tons du visuel de remplacement, par cuisine : fonds feutrés, typographie profonde. */
const CUISINE_STYLE: Record<string, { bg: string; fg: string }> = {
  Indienne: { bg: "bg-amber-soft", fg: "text-amber-deep" },
  "Moyen-orientale": { bg: "bg-terra-soft", fg: "text-terra-deep" },
  Méditerranéenne: { bg: "bg-slate-soft", fg: "text-slate-deep" },
  Suisse: { bg: "bg-paper-deep", fg: "text-ink-soft" },
  Mexicaine: { bg: "bg-sage-soft", fg: "text-sage-deep" },
  Marocaine: { bg: "bg-terra-soft", fg: "text-terra-deep" },
  Grecque: { bg: "bg-slate-soft", fg: "text-slate-deep" },
  Libanaise: { bg: "bg-sage-soft", fg: "text-sage-deep" },
  Italienne: { bg: "bg-terra-soft", fg: "text-terra-deep" },
  Hawaïenne: { bg: "bg-plum", fg: "text-gold-light" },
  Japonaise: { bg: "bg-ink", fg: "text-gold-light" },
  Chinoise: { bg: "bg-gold-soft", fg: "text-gold-deep" },
  Thaïlandaise: { bg: "bg-sage", fg: "text-paper" },
  Coréenne: { bg: "bg-plum-soft", fg: "text-plum-deep" },
  "Nord-américaine": { bg: "bg-gold-soft", fg: "text-gold-deep" },
};

const DEFAULT_STYLE = { bg: "bg-gold-soft", fg: "text-gold-deep" };

export function hasRecipePhoto(recipeId: string): boolean {
  return Boolean(PHOTOS[recipeId]);
}

/**
 * Photo de la recette (`public/images/recipes/<id>.jpg`) ou visuel de
 * remplacement typographique — jamais d'image cassée.
 */
export function RecipeImage({
  recipe,
  className,
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority,
  variant = "card",
}: {
  recipe: Pick<Recipe, "id" | "name" | "cuisine">;
  className?: string;
  sizes?: string;
  priority?: boolean;
  variant?: "card" | "hero" | "thumb";
}) {
  const [failed, setFailed] = useState(false);
  const src = PHOTOS[recipe.id];

  if (src && !failed) {
    return (
      <div className={cn("relative overflow-hidden bg-paper-deep", className)}>
        <Image src={src} alt={recipe.name} fill sizes={sizes} priority={priority} className="object-cover" onError={() => setFailed(true)} />
      </div>
    );
  }

  const style = CUISINE_STYLE[recipe.cuisine] ?? DEFAULT_STYLE;
  const word = recipe.name.split(/[\s,]+/)[0];
  return (
    <div role="img" aria-label={`Visuel : ${recipe.name}`} className={cn("relative overflow-hidden", style.bg, style.fg, className)}>
      {/* Assiette stylisée : double filet doré */}
      <div aria-hidden className="absolute -right-[14%] top-1/2 aspect-square h-[125%] -translate-y-1/2 rounded-full border border-gold/60" />
      <div aria-hidden className="absolute -right-[2%] top-1/2 aspect-square h-[92%] -translate-y-1/2 rounded-full border border-gold/35" />
      <div aria-hidden className="absolute right-[16%] top-1/2 aspect-square w-[5%] min-w-1.5 -translate-y-1/2 rounded-full bg-gold" />
      {variant !== "thumb" && (
        <span className="absolute right-4 top-4 text-[0.62rem] font-semibold uppercase tracking-[0.28em] opacity-80">{recipe.cuisine}</span>
      )}
      <span
        aria-hidden
        className={cn(
          "absolute font-display italic leading-none tracking-tight",
          variant === "hero"
            ? "bottom-[22%] left-5 text-[clamp(3.5rem,13vw,8rem)] sm:bottom-[18%] sm:left-10"
            : variant === "thumb"
              ? "bottom-1.5 left-2 text-2xl"
              : "bottom-3 left-4 text-[clamp(2.4rem,8vw,3.5rem)]",
        )}
      >
        {variant === "thumb" ? word.charAt(0) : word}
      </span>
    </div>
  );
}
