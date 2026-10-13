import { INGREDIENTS } from "@/lib/data/ingredients";
import type { Allergen, AnimalCategory, Diet, Equipment, Recipe, Restriction } from "@/lib/domain/types";

/** Analyse d'une recette à partir de ses ingrédients (fonctions pures). */

export function recipeAllergens(recipe: Recipe): Allergen[] {
  const set = new Set<Allergen>();
  for (const line of recipe.ingredients) {
    const ingredient = INGREDIENTS[line.ingredientId];
    // Un ingrédient inconnu est traité comme dangereux par prudence.
    if (!ingredient) throw new Error(`Ingrédient inconnu dans ${recipe.id} : ${line.ingredientId}`);
    ingredient.allergens.forEach((a) => set.add(a));
  }
  return [...set];
}

export function recipeAnimals(recipe: Recipe): AnimalCategory[] {
  const set = new Set<AnimalCategory>();
  for (const line of recipe.ingredients) {
    const animal = INGREDIENTS[line.ingredientId]?.animal;
    if (animal) set.add(animal);
  }
  return [...set];
}

const FORBIDDEN_BY_DIET: Record<Diet, AnimalCategory[]> = {
  omnivore: [],
  flexitarien: [],
  pescetarien: ["viande"],
  vegetarien: ["viande", "poisson"],
  vegetalien: ["viande", "poisson", "oeuf", "laitier", "miel"],
};

export function isDietCompatible(recipe: Recipe, diet: Diet): boolean {
  const forbidden = FORBIDDEN_BY_DIET[diet];
  return !recipeAnimals(recipe).some((a) => forbidden.includes(a));
}

/** Régimes les plus stricts compatibles, pour les badges. */
export function recipeDietBadge(recipe: Recipe): "vegetalien" | "vegetarien" | "pescetarien" | null {
  if (isDietCompatible(recipe, "vegetalien")) return "vegetalien";
  if (isDietCompatible(recipe, "vegetarien")) return "vegetarien";
  if (isDietCompatible(recipe, "pescetarien")) return "pescetarien";
  return null;
}

export function violatesRestrictions(recipe: Recipe, restrictions: Restriction[]): boolean {
  if (restrictions.length === 0) return false;
  return recipe.ingredients.some((line) =>
    (INGREDIENTS[line.ingredientId]?.violates ?? []).some((r) => restrictions.includes(r)),
  );
}

export function containsAllergen(recipe: Recipe, allergens: Allergen[]): boolean {
  if (allergens.length === 0) return false;
  return recipeAllergens(recipe).some((a) => allergens.includes(a));
}

export function containsIngredient(recipe: Recipe, ingredientIds: string[]): boolean {
  if (ingredientIds.length === 0) return false;
  return recipe.ingredients.some((line) => ingredientIds.includes(line.ingredientId));
}

export function missingEquipment(recipe: Recipe, available: Equipment[]): Equipment[] {
  return recipe.equipment.filter((e) => !available.includes(e));
}

export function totalMinutes(recipe: Recipe): number {
  return recipe.prepMinutes + recipe.cookMinutes;
}

export interface HardConstraints {
  allergens: Allergen[];
  diet: Diet;
  restrictions: Restriction[];
  dislikedIngredients: string[];
}

/**
 * Contraintes STRICTES : allergies, régime, restrictions et aliments détestés.
 * Une recette qui échoue ici ne doit JAMAIS être proposée.
 */
export function isRecipeAllowed(recipe: Recipe, c: HardConstraints): boolean {
  return (
    !containsAllergen(recipe, c.allergens) &&
    isDietCompatible(recipe, c.diet) &&
    !violatesRestrictions(recipe, c.restrictions) &&
    !containsIngredient(recipe, c.dislikedIngredients)
  );
}

/** Filtre de sécurité à appliquer sur toute liste de recettes montrée à l'utilisateur. */
export function filterAllowedRecipes<T extends Recipe>(recipes: readonly T[], c: HardConstraints): T[] {
  return recipes.filter((r) => isRecipeAllowed(r, c));
}
