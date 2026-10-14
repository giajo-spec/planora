"use client";

import Image from "next/image";
import { useState } from "react";
import manifest from "@/lib/data/image-manifest.json";
import type { Recipe } from "@/lib/domain/types";
import { cn } from "@/lib/utils/cn";
import { FoodIllustration, illustrationBackground } from "./food-illustration";

const PHOTOS = manifest as Record<string, string>;

export function hasRecipePhoto(recipeId: string): boolean {
  return Boolean(PHOTOS[recipeId]);
}

/**
 * Photo de la recette (`public/images/recipes/<id>.jpg`) ou, à défaut,
 * illustration générée à partir de ses ingrédients — jamais d'image cassée.
 */
export function RecipeImage({
  recipe,
  className,
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority,
  variant = "card",
}: {
  recipe: Recipe;
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

  return (
    <div
      role="img"
      aria-label={`Illustration : ${recipe.name}`}
      className={cn("relative overflow-hidden", className)}
      style={{ backgroundColor: illustrationBackground(recipe) }}
    >
      <FoodIllustration recipe={recipe} fit={variant === "hero" ? "meet" : "slice"} className="absolute inset-0 h-full w-full" />
      {variant !== "thumb" && (
        <span
          className={cn(
            "absolute top-3 rounded-full bg-surface/85 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-ink-soft backdrop-blur-sm",
            variant === "hero" ? "right-4" : "left-3",
          )}
        >
          {recipe.cuisine}
        </span>
      )}
    </div>
  );
}
