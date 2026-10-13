import { describe, expect, it } from "vitest";
import { RECIPES, getRecipe } from "@/lib/data/recipes";
import type { Recipe } from "@/lib/domain/types";
import {
  isHighProtein,
  macroSplit,
  nutritionForServings,
  nutritionPerServing,
  recipeTotalNutrition,
  roundNutrition,
} from "./nutrition";

describe("calcul nutritionnel", () => {
  it("additionne les ingrédients selon leur masse", () => {
    const recipe: Recipe = {
      ...getRecipe("bol-yogourt-grec")!,
      id: "test-nutrition",
      servings: 1,
      ingredients: [
        { ingredientId: "yogourt-grec", amount: 200, unit: "g" },
        { ingredientId: "oeuf", amount: 2, unit: "unite" },
      ],
    };
    const total = recipeTotalNutrition(recipe);
    // yogourt 200 g : 118 kcal, 20,6 g prot. ; 2 œufs (100 g) : 143 kcal, 12,6 g prot.
    expect(total.kcal).toBeCloseTo(118 + 143);
    expect(total.protein).toBeCloseTo(20.6 + 12.6);
  });

  it("recalcule la nutrition proportionnellement aux portions", () => {
    const recipe = getRecipe("poulet-tikka")!;
    const one = nutritionPerServing(recipe);
    const six = nutritionForServings(recipe, 6);
    expect(six.kcal).toBeCloseTo(one.kcal * 6);
    expect(six.protein).toBeCloseTo(one.protein * 6);
  });

  it("arrondit pour l'affichage", () => {
    expect(roundNutrition({ kcal: 512.4, protein: 31.6, carbs: 40.2, fat: 18.5, fiber: 4.4 })).toEqual({
      kcal: 510,
      protein: 32,
      carbs: 40,
      fat: 19,
      fiber: 4,
    });
  });

  it("calcule la répartition des macros", () => {
    const split = macroSplit({ kcal: 0, protein: 25, carbs: 25, fat: 0, fiber: 0 });
    expect(split.protein).toBeCloseTo(0.5);
    expect(split.fat).toBe(0);
  });

  it("donne des valeurs plausibles pour chaque recette", () => {
    for (const recipe of RECIPES) {
      const n = nutritionPerServing(recipe);
      const max = recipe.mealTypes.includes("collation") && recipe.mealTypes.length === 1 ? 450 : 1000;
      expect(n.kcal, recipe.id).toBeGreaterThan(80);
      expect(n.kcal, recipe.id).toBeLessThan(max);
    }
  });

  it("repère plusieurs recettes riches en protéines", () => {
    const rich = RECIPES.filter(isHighProtein);
    expect(rich.length).toBeGreaterThanOrEqual(6);
    expect(rich.map((r) => r.id)).toContain("poulet-tikka");
  });
});
