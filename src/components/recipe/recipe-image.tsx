"use client";

import Image from "next/image";
import { useState } from "react";
import manifest from "@/lib/data/image-manifest.json";
import type { Recipe } from "@/lib/domain/types";
import { cn } from "@/lib/utils/cn";

const PHOTOS = manifest as Record<string, string>;

/** Couleurs du visuel de remplacement, par cuisine (cohérentes avec les jetons). */
const CUISINE_STYLE: Record<string, { bg: string; fg: string; dot: string }> = {
  Indienne: { bg: "bg-sun", fg: "text-ink", dot: "bg-tomato" },
  "Moyen-orientale": { bg: "bg-tomato", fg: "text-ink", dot: "bg-sun" },
  Méditerranéenne: { bg: "bg-sky", fg: "text-ink", dot: "bg-paper" },
  Suisse: { bg: "bg-paper-deep", fg: "text-ink", dot: "bg-tomato" },
  Mexicaine: { bg: "bg-mint", fg: "text-ink", dot: "bg-tomato" },
  Marocaine: { bg: "bg-tomato-soft", fg: "text-ink", dot: "bg-tomato" },
  Grecque: { bg: "bg-sky-soft", fg: "text-ink", dot: "bg-sky" },
  Libanaise: { bg: "bg-lime", fg: "text-ink", dot: "bg-mint-deep" },
  Italienne: { bg: "bg-tomato", fg: "text-ink", dot: "bg-lime" },
  Hawaïenne: { bg: "bg-violet", fg: "text-paper", dot: "bg-lime" },
  Japonaise: { bg: "bg-ink", fg: "text-paper", dot: "bg-tomato" },
  Chinoise: { bg: "bg-sun-soft", fg: "text-ink", dot: "bg-tomato" },
  Thaïlandaise: { bg: "bg-lime-soft", fg: "text-ink", dot: "bg-violet" },
  Coréenne: { bg: "bg-violet-soft", fg: "text-ink", dot: "bg-tomato" },
  "Nord-américaine": { bg: "bg-sun", fg: "text-ink", dot: "bg-violet" },
};

const DEFAULT_STYLE = { bg: "bg-lime", fg: "text-ink", dot: "bg-ink" };

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
      {/* Assiette stylisée */}
      <div aria-hidden className="absolute -right-[12%] -top-[18%] aspect-square w-[70%] rounded-full border-[10px] border-current opacity-15" />
      <div aria-hidden className={cn("absolute right-[14%] top-[16%] size-[14%] rounded-full", style.dot)} />
      <div aria-hidden className="absolute right-[30%] top-[38%] size-[6%] rounded-full bg-current opacity-25" />
      {variant !== "thumb" && (
        <span className="absolute left-4 top-4 text-[0.7rem] font-bold uppercase tracking-[0.16em] opacity-80">
          {recipe.cuisine}
        </span>
      )}
      <span
        aria-hidden
        className={cn(
          "absolute -bottom-[0.12em] left-3 font-display font-extrabold leading-none tracking-tighter",
          variant === "hero" ? "text-[clamp(4rem,16vw,9rem)]" : variant === "thumb" ? "text-3xl" : "text-[clamp(2.6rem,9vw,4rem)]",
        )}
      >
        {variant === "thumb" ? word.slice(0, 2) : word}
      </span>
    </div>
  );
}
