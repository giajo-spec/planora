import { Clock, Flame, Leaf, Dumbbell, Fish } from "lucide-react";
import { DIFFICULTY_LABELS } from "@/lib/domain/labels";
import type { Recipe } from "@/lib/domain/types";
import { isHighProtein, nutritionPerServing, roundNutrition } from "@/lib/nutrition/nutrition";
import { recipeDietBadge, totalMinutes } from "@/lib/recipes/analysis";
import { Badge } from "@/components/ui/primitives";

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${String(m).padStart(2, "0")}` : `${h} h`;
}

export function RecipeBadges({ recipe, max = 3 }: { recipe: Recipe; max?: number }) {
  const badges: React.ReactNode[] = [];
  const diet = recipeDietBadge(recipe);
  if (isHighProtein(recipe))
    badges.push(
      <Badge key="hp" tone="plum">
        <Dumbbell aria-hidden className="size-3" /> Riche en protéines
      </Badge>,
    );
  if (diet === "vegetalien")
    badges.push(
      <Badge key="vg" tone="sage">
        <Leaf aria-hidden className="size-3" /> Végétalien
      </Badge>,
    );
  else if (diet === "vegetarien")
    badges.push(
      <Badge key="vt" tone="sage">
        <Leaf aria-hidden className="size-3" /> Végétarien
      </Badge>,
    );
  else if (diet === "pescetarien")
    badges.push(
      <Badge key="pc" tone="slate">
        <Fish aria-hidden className="size-3" /> Pescétarien
      </Badge>,
    );
  if (recipe.tags.includes("rapide")) badges.push(<Badge key="rp" tone="amber">Express</Badge>);
  return <div className="flex flex-wrap gap-1.5">{badges.slice(0, max)}</div>;
}

export function RecipeQuickFacts({ recipe, servings }: { recipe: Recipe; servings?: number }) {
  const n = roundNutrition(nutritionPerServing(recipe));
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold text-ink-muted">
      <span className="inline-flex items-center gap-1">
        <Clock aria-hidden className="size-4" />
        {formatMinutes(totalMinutes(recipe))}
      </span>
      <span className="inline-flex items-center gap-1">
        <Flame aria-hidden className="size-4" />
        {n.kcal} kcal<span className="sr-only"> par portion (estimation)</span>
      </span>
      <span>{n.protein} g prot.</span>
      <span>{DIFFICULTY_LABELS[recipe.difficulty]}</span>
      {servings != null && <span>{servings} port.</span>}
    </p>
  );
}
