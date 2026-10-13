import { describe, expect, it } from "vitest";
import { RECIPES } from "@/lib/data/recipes";
import { isDietCompatible } from "@/lib/recipes/analysis";

describe("cohérence des recettes", () => {
  it("contient environ 20 recettes aux identifiants uniques", () => {
    expect(RECIPES.length).toBeGreaterThanOrEqual(18);
    expect(new Set(RECIPES.map((r) => r.id)).size).toBe(RECIPES.length);
  });

  it("couvre déjeuners, dîners, soupers et collations", () => {
    for (const slot of ["dejeuner", "diner", "souper", "collation"] as const) {
      expect(RECIPES.filter((r) => r.mealTypes.includes(slot)).length, slot).toBeGreaterThanOrEqual(4);
    }
  });

  it("est majoritairement internationale", () => {
    expect(new Set(RECIPES.map((r) => r.cuisine)).size).toBeGreaterThanOrEqual(8);
  });

  it.each(RECIPES.map((r) => [r.id, r] as const))("%s : chaque ingrédient est utilisé dans les étapes", (_id, recipe) => {
    const used = new Map<number, number>();
    for (const step of recipe.steps) {
      for (const use of step.uses ?? []) {
        expect(use.index, `index invalide dans ${recipe.id}`).toBeLessThan(recipe.ingredients.length);
        used.set(use.index, (used.get(use.index) ?? 0) + (use.part ?? 1));
      }
    }
    recipe.ingredients.forEach((ing, index) => {
      expect(used.has(index), `${recipe.id} : ${ing.ingredientId} n'est utilisé dans aucune étape`).toBe(true);
      // la somme des parts ne doit pas dépasser l'ingrédient entier (tolérance d'arrondi)
      expect(used.get(index)!, `${recipe.id} : ${ing.ingredientId} utilisé plus d'une fois`).toBeLessThanOrEqual(1.02);
    });
  });

  it("prévoit des guides « première fois » complets", () => {
    for (const r of RECIPES) {
      expect(r.firstTime.utensils.length, r.id).toBeGreaterThan(0);
      expect(r.firstTime.safety.length, r.id).toBeGreaterThan(0);
      expect(r.firstTime.doneness.length, r.id).toBeGreaterThan(0);
    }
  });

  it("inclut des options végétaliennes", () => {
    expect(RECIPES.filter((r) => isDietCompatible(r, "vegetalien")).length).toBeGreaterThanOrEqual(5);
  });
});
