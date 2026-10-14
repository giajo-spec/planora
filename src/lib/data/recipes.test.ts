import { describe, expect, it } from "vitest";
import { RECIPES } from "@/lib/data/recipes";
import { isDietCompatible } from "@/lib/recipes/analysis";

describe("cohérence des recettes", () => {
  it("contient environ 20 recettes aux identifiants uniques", () => {
    expect(RECIPES.length).toBeGreaterThanOrEqual(2000);
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

  it("chaque ingrédient de chaque recette est utilisé dans les étapes, jamais plus qu'en totalité", () => {
    for (const recipe of RECIPES) {
      const used = new Map<number, number>();
      for (const step of recipe.steps) {
        for (const use of step.uses ?? []) {
          expect(use.index, `index invalide dans ${recipe.id}`).toBeLessThan(recipe.ingredients.length);
          used.set(use.index, (used.get(use.index) ?? 0) + (use.part ?? 1));
        }
      }
      recipe.ingredients.forEach((ing, index) => {
        expect(used.has(index), `${recipe.id} : ${ing.ingredientId} n'est utilisé dans aucune étape`).toBe(true);
        expect(used.get(index)!, `${recipe.id} : ${ing.ingredientId} utilisé plus d'une fois`).toBeLessThanOrEqual(1.02);
      });
    }
  });

  it("compte plus de 2 000 recettes, dont des collections enfants, protéinées et végétaliennes", () => {
    expect(RECIPES.length).toBeGreaterThanOrEqual(2000);
    expect(RECIPES.filter((r) => r.tags.includes("enfants")).length).toBeGreaterThanOrEqual(300);
    expect(RECIPES.filter((r) => isDietCompatible(r, "vegetalien")).length).toBeGreaterThanOrEqual(150);
  });

  it("n'affiche jamais deux lignes pour le même ingrédient mesuré à la cuillère", () => {
    for (const r of RECIPES) {
      const spoon = r.ingredients.filter((i) => ["c-soupe", "c-the", "pincee"].includes(i.unit)).map((i) => i.ingredientId);
      expect(new Set(spoon).size, r.id).toBe(spoon.length);
    }
  });

  it("chaque recette a des étapes, un temps et des portions valides", () => {
    for (const r of RECIPES) {
      expect(r.steps.length, r.id).toBeGreaterThanOrEqual(2);
      expect(r.servings, r.id).toBeGreaterThan(0);
      expect(r.prepMinutes + r.cookMinutes, r.id).toBeGreaterThan(0);
      expect(r.name.length, r.id).toBeGreaterThan(8);
    }
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
