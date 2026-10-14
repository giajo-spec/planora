import { INGREDIENTS } from "@/lib/data/ingredients";
import type { Difficulty, MealType, Recipe } from "@/lib/domain/types";
import { isHighProtein } from "@/lib/nutrition/nutrition";
import { isDietCompatible, totalMinutes } from "./analysis";
import { type CollectionKey, collectionByKey } from "./collections";

/** Filtres du catalogue (fonction pure, testée). */
export interface RecipeFilters {
  query: string;
  meal: MealType | null;
  maxMinutes: number | null;
  difficulty: Difficulty | null;
  diet: "vegetarien" | "vegetalien" | "pescetarien" | null;
  highProtein: boolean;
  cuisine: string | null;
  collection: CollectionKey | null;
}

export const EMPTY_FILTERS: RecipeFilters = {
  query: "",
  meal: null,
  maxMinutes: null,
  difficulty: null,
  diet: null,
  highProtein: false,
  cuisine: null,
  collection: null,
};

export function normalize(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/œ/g, "oe");
}

function searchableText(recipe: Recipe): string {
  const ingredients = recipe.ingredients.map((i) => INGREDIENTS[i.ingredientId]?.name ?? "").join(" ");
  return normalize(`${recipe.name} ${recipe.cuisine} ${recipe.description} ${ingredients}`);
}

export function applyRecipeFilters<T extends Recipe>(recipes: readonly T[], f: RecipeFilters): T[] {
  const terms = normalize(f.query).split(/\s+/).filter(Boolean);
  const collection = collectionByKey(f.collection);
  return recipes.filter((r) => {
    if (collection && !collection.test(r)) return false;
    if (f.meal && !r.mealTypes.includes(f.meal)) return false;
    if (f.maxMinutes != null && totalMinutes(r) > f.maxMinutes) return false;
    if (f.difficulty && r.difficulty !== f.difficulty) return false;
    if (f.diet && !isDietCompatible(r, f.diet)) return false;
    if (f.highProtein && !isHighProtein(r)) return false;
    if (f.cuisine && r.cuisine !== f.cuisine) return false;
    if (terms.length > 0) {
      const text = searchableText(r);
      if (!terms.every((t) => text.includes(t))) return false;
    }
    return true;
  });
}

export function activeFilterCount(f: RecipeFilters): number {
  return [f.meal, f.maxMinutes, f.difficulty, f.diet, f.highProtein || null, f.cuisine, f.collection].filter((v) => v != null).length;
}
