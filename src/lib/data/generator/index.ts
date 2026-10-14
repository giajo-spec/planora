import type { Recipe, RecipeTag } from "@/lib/domain/types";
import { nutritionPerServing } from "@/lib/nutrition/nutrition";
import { generateAll } from "./formats";

/**
 * Moteur de composition PLANORA.
 *
 * Génère plus de 2 000 recettes ORIGINALES et cohérentes en combinant des
 * briques normalisées (protéines, féculents, légumes, saveurs du monde,
 * formats de plats). Chaque recette hérite des allergènes et de la nutrition
 * de ses ingrédients normalisés : le filtrage strict des allergies reste
 * garanti. Aucune recette ni photo n'est copiée d'un site tiers.
 *
 * Les identifiants sont déterministes : un plan sauvegardé retrouve toujours
 * ses recettes.
 */

const SPICY = /gochujang|piment-broye|jalapeno/;
const RAW_FISH = /sashimi/;

function withSmartTags(recipe: Recipe): Recipe {
  const tags = new Set<RecipeTag>(recipe.tags);
  const ids = recipe.ingredients.map((i) => i.ingredientId).join(" ");
  const total = recipe.prepMinutes + recipe.cookMinutes;
  const kidFriendly =
    !SPICY.test(ids) && !RAW_FISH.test(ids) && !ids.includes("crevettes") && recipe.difficulty === "facile" && total <= 45;
  if (kidFriendly && (tags.has("familial") || recipe.mealTypes.includes("collation") || recipe.mealTypes.includes("dejeuner"))) tags.add("enfants");
  if (total <= 25) tags.add("rapide");
  if (nutritionPerServing(recipe).protein >= 30) tags.add("post-entrainement");
  return { ...recipe, tags: [...tags] };
}

let cache: Recipe[] | null = null;

export function generatedRecipes(): Recipe[] {
  cache ??= generateAll().map(withSmartTags);
  return cache;
}
