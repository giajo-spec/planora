"use client";

import { Check, ChefHat, Lock, LockOpen, MoreHorizontal, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { RecipeImage } from "@/components/recipe/recipe-image";
import { formatMinutes } from "@/components/recipe/recipe-meta";
import { IconButton } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { RECIPE_MAP } from "@/lib/data/recipes";
import { MEAL_LABELS } from "@/lib/domain/labels";
import type { PlannedMeal } from "@/lib/domain/types";
import { nutritionPerServing, roundNutrition } from "@/lib/nutrition/nutrition";
import { formatAmount } from "@/lib/nutrition/portions";
import { totalMinutes } from "@/lib/recipes/analysis";
import { useApp } from "@/lib/state/app-store";
import { cn } from "@/lib/utils/cn";
import { MealOptionsSheet, ReplaceSheet } from "./meal-sheets";

export function MealCard({
  meal,
  dayIndex,
  compact,
  draggable,
  onDragStartMeal,
  onDropOnMeal,
}: {
  meal: PlannedMeal;
  dayIndex: number;
  compact?: boolean;
  draggable?: boolean;
  onDragStartMeal?: (mealId: string) => void;
  onDropOnMeal?: (mealId: string) => void;
}) {
  const recipe = RECIPE_MAP[meal.recipeId];
  const { toggleLock } = useApp();
  const { notify } = useToast();
  const [replaceOpen, setReplaceOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  if (!recipe) return null;
  const n = roundNutrition(nutritionPerServing(recipe));

  return (
    <article
      draggable={draggable}
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", meal.id);
        e.dataTransfer.effectAllowed = "move";
        onDragStartMeal?.(meal.id);
      }}
      onDragOver={(e) => {
        if (!onDropOnMeal) return;
        e.preventDefault();
        e.stopPropagation();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        if (!onDropOnMeal) return;
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
        onDropOnMeal(meal.id);
      }}
      aria-label={`${MEAL_LABELS[meal.slot]} : ${recipe.name}`}
      className={cn(
        "group relative rounded-3xl border bg-surface p-3 transition",
        meal.locked ? "border-ink" : "border-transparent shadow-card",
        meal.done && "opacity-70",
        dragOver && "border-dashed border-plum bg-plum-soft",
        draggable && "cursor-grab active:cursor-grabbing",
      )}
    >
      <div className="flex gap-3">
        <Link href={`/recettes/${recipe.id}?portions=${meal.servings}`} className="shrink-0" tabIndex={-1} aria-hidden>
          <RecipeImage recipe={recipe} variant="thumb" className={cn("rounded-2xl", compact ? "size-16" : "size-20")} />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-wider text-ink-muted">
            {MEAL_LABELS[meal.slot]}
            {meal.locked && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-ink px-1.5 py-0.5 text-[0.6rem] text-gold">
                <Lock aria-hidden className="size-2.5" /> Gardé
              </span>
            )}
            {meal.done && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-sage-soft px-1.5 py-0.5 text-[0.6rem] text-sage-deep">
                <Check aria-hidden className="size-2.5" /> Préparé
              </span>
            )}
          </p>
          <Link href={`/recettes/${recipe.id}?portions=${meal.servings}`} className="mt-0.5 line-clamp-2 font-bold leading-snug hover:underline">
            {recipe.name}
          </Link>
          <p className="mt-1 text-xs font-semibold text-ink-muted">
            {formatMinutes(totalMinutes(recipe))} · {n.kcal} kcal · {n.protein} g prot. · {formatAmount(meal.servings)} port.
          </p>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-end gap-1.5">
        <IconButton
          label={meal.locked ? "Déverrouiller ce repas" : "Verrouiller ce repas (conservé lors d'une régénération)"}
          tone={meal.locked ? "dark" : "light"}
          aria-pressed={meal.locked}
          onClick={() => {
            toggleLock(meal.id);
            notify(meal.locked ? "Repas déverrouillé" : "Repas verrouillé");
          }}
        >
          {meal.locked ? <Lock aria-hidden className="size-[1.1rem] text-gold" /> : <LockOpen aria-hidden className="size-[1.1rem]" />}
        </IconButton>
        <IconButton label="Remplacer ce repas" disabled={meal.locked} onClick={() => setReplaceOpen(true)}>
          <RefreshCw aria-hidden className="size-[1.1rem]" />
        </IconButton>
        <Link
          href={`/cuisine/${recipe.id}?portions=${meal.servings}&repas=${meal.id}`}
          aria-label={`Cuisiner : ${recipe.name}`}
          title="Commencer la cuisine guidée"
          className="inline-flex size-11 items-center justify-center rounded-full border border-line bg-surface hover:border-ink"
        >
          <ChefHat aria-hidden className="size-[1.1rem]" />
        </Link>
        <IconButton label="Plus d'options (portions, déplacer…)" onClick={() => setOptionsOpen(true)}>
          <MoreHorizontal aria-hidden className="size-[1.1rem]" />
        </IconButton>
      </div>
      <ReplaceSheet open={replaceOpen} onClose={() => setReplaceOpen(false)} meal={meal} />
      <MealOptionsSheet open={optionsOpen} onClose={() => setOptionsOpen(false)} meal={meal} dayIndex={dayIndex} />
    </article>
  );
}
