import type { Recipe } from "@/lib/domain/types";
import { COLLATIONS } from "./collations";
import { DEJEUNERS } from "./dejeuners";
import { PLATS } from "./plats";

/** Catalogue de démonstration (≈ 20 recettes internationales). */
export const RECIPES: readonly Recipe[] = [...DEJEUNERS, ...PLATS, ...COLLATIONS];

export const RECIPE_MAP: Readonly<Record<string, Recipe>> = Object.fromEntries(
  RECIPES.map((recipe) => [recipe.id, recipe]),
);

export function getRecipe(id: string): Recipe | undefined {
  return RECIPE_MAP[id];
}
