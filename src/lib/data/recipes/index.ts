import type { Recipe } from "@/lib/domain/types";
import { generatedRecipes } from "../generator";
import { COLLATIONS } from "./collations";
import { DEJEUNERS } from "./dejeuners";
import { PLATS } from "./plats";

/** Recettes signatures, écrites à la main. */
export const SIGNATURE_RECIPES: readonly Recipe[] = [...DEJEUNERS, ...PLATS, ...COLLATIONS];

/** Catalogue complet : recettes signatures + recettes du moteur de composition. */
export const RECIPES: readonly Recipe[] = [...SIGNATURE_RECIPES, ...generatedRecipes()];

export const RECIPE_MAP: Readonly<Record<string, Recipe>> = Object.fromEntries(
  RECIPES.map((recipe) => [recipe.id, recipe]),
);

export function getRecipe(id: string): Recipe | undefined {
  return RECIPE_MAP[id];
}
