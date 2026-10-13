import { INGREDIENTS } from "@/lib/data/ingredients";
import type { Goal, Ingredient, Nutrition, NutritionTargets, Recipe } from "@/lib/domain/types";
import { toGrams } from "./units";

/**
 * Calcul nutritionnel (fonctions pures).
 * Toutes les valeurs sont des ESTIMATIONS DE DÉMONSTRATION.
 */

export const ZERO_NUTRITION: Nutrition = { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };

export function addNutrition(a: Nutrition, b: Nutrition): Nutrition {
  return {
    kcal: a.kcal + b.kcal,
    protein: a.protein + b.protein,
    carbs: a.carbs + b.carbs,
    fat: a.fat + b.fat,
    fiber: a.fiber + b.fiber,
  };
}

export function scaleNutrition(n: Nutrition, factor: number): Nutrition {
  return {
    kcal: n.kcal * factor,
    protein: n.protein * factor,
    carbs: n.carbs * factor,
    fat: n.fat * factor,
    fiber: n.fiber * factor,
  };
}

/** Arrondi d'affichage : kcal à 5 près, macros au gramme. */
export function roundNutrition(n: Nutrition): Nutrition {
  return {
    kcal: Math.round(n.kcal / 5) * 5,
    protein: Math.round(n.protein),
    carbs: Math.round(n.carbs),
    fat: Math.round(n.fat),
    fiber: Math.round(n.fiber),
  };
}

export function ingredientNutrition(grams: number, ingredient: Ingredient): Nutrition {
  return scaleNutrition(ingredient.nutrition, grams / 100);
}

const cache = new Map<string, Nutrition>();

/** Nutrition totale de la recette telle qu'écrite (non arrondie). */
export function recipeTotalNutrition(
  recipe: Recipe,
  ingredients: Record<string, Ingredient> = INGREDIENTS,
): Nutrition {
  let total = ZERO_NUTRITION;
  for (const line of recipe.ingredients) {
    const ingredient = ingredients[line.ingredientId];
    if (!ingredient) continue;
    const grams = toGrams(line, ingredient);
    if (grams == null) continue;
    total = addNutrition(total, ingredientNutrition(grams, ingredient));
  }
  return total;
}

/** Nutrition par portion (non arrondie, mise en cache). */
export function nutritionPerServing(recipe: Recipe): Nutrition {
  const cached = cache.get(recipe.id);
  if (cached) return cached;
  const result = scaleNutrition(recipeTotalNutrition(recipe), 1 / recipe.servings);
  cache.set(recipe.id, result);
  return result;
}

/** Nutrition pour un nombre de portions donné (non arrondie). */
export function nutritionForServings(recipe: Recipe, servings: number): Nutrition {
  return scaleNutrition(nutritionPerServing(recipe), servings);
}

/** Part des calories provenant de chaque macronutriment (4/4/9 kcal par g). */
export function macroSplit(n: Nutrition): { protein: number; carbs: number; fat: number } {
  const p = n.protein * 4;
  const c = n.carbs * 4;
  const f = n.fat * 9;
  const sum = p + c + f || 1;
  return { protein: p / sum, carbs: c / sum, fat: f / sum };
}

/** Riche en protéines : ≥ 20 g par portion, ou ≥ 25 % des calories (collations). */
export function isHighProtein(recipe: Recipe): boolean {
  const n = nutritionPerServing(recipe);
  return n.protein >= 20 || (n.protein >= 10 && macroSplit(n).protein >= 0.25);
}

/**
 * Cibles quotidiennes par défaut (adulte moyen, à personnaliser).
 * Ce ne sont pas des recommandations médicales.
 */
export function defaultTargets(goal: Goal): NutritionTargets {
  switch (goal) {
    case "perte-gras":
      return { kcal: 1800, protein: 130, carbs: 170, fat: 60 };
    case "prise-muscle":
      return { kcal: 2700, protein: 150, carbs: 330, fat: 85 };
    case "maintien":
      return { kcal: 2200, protein: 100, carbs: 270, fat: 75 };
    case "equilibre":
    default:
      return { kcal: 2100, protein: 95, carbs: 260, fat: 70 };
  }
}

/**
 * Fourchette de protéines suggérée selon le poids et l'activité (g/jour).
 * Repères généraux : 0,8 g/kg (sédentaire) à 1,6–2,0 g/kg (musculation).
 */
export function proteinRange(weightKg: number, activity: "sedentaire" | "actif" | "musculation" | "endurance"): [number, number] {
  const ranges = { sedentaire: [0.8, 1.0], actif: [1.0, 1.4], endurance: [1.2, 1.6], musculation: [1.6, 2.0] } as const;
  const [low, high] = ranges[activity];
  return [Math.round(weightKg * low), Math.round(weightKg * high)];
}
