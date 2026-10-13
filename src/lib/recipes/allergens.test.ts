import { describe, expect, it } from "vitest";
import { INGREDIENTS } from "@/lib/data/ingredients";
import { RECIPES } from "@/lib/data/recipes";
import type { Allergen, Profile } from "@/lib/domain/types";
import { ALLERGEN_LABELS } from "@/lib/domain/labels";
import {
  addMeal,
  generatePlan,
  planViolations,
  regeneratePlan,
  replaceMeal,
  suggestReplacements,
} from "@/lib/planner/planner";
import { createDemoProfile } from "@/lib/profile/defaults";
import { containsAllergen, filterAllowedRecipes, isDietCompatible, recipeAllergens } from "./analysis";

const ALL_ALLERGENS = Object.keys(ALLERGEN_LABELS) as Allergen[];

function profileWith(partial: Partial<Profile>): Profile {
  return { ...createDemoProfile("2026-01-01"), ...partial };
}

function recipeIdsOfPlan(plan: ReturnType<typeof generatePlan>): string[] {
  return plan.days.flatMap((d) => d.meals.map((m) => m.recipeId));
}

describe("données : allergènes déclarés", () => {
  it("chaque ingrédient de chaque recette existe et déclare ses allergènes", () => {
    for (const recipe of RECIPES) {
      for (const line of recipe.ingredients) {
        const ingredient = INGREDIENTS[line.ingredientId];
        expect(ingredient, `${recipe.id} → ${line.ingredientId}`).toBeDefined();
        expect(Array.isArray(ingredient.allergens)).toBe(true);
      }
    }
  });

  it("détecte les allergènes évidents", () => {
    const byId = Object.fromEntries(RECIPES.map((r) => [r.id, r]));
    expect(recipeAllergens(byId["pad-thai-crevettes"])).toEqual(
      expect.arrayContaining(["arachides", "fruits-de-mer", "poisson", "oeufs"]),
    );
    expect(recipeAllergens(byId["bol-falafels"])).toContain("sesame");
    expect(recipeAllergens(byId["poke-saumon"])).toEqual(expect.arrayContaining(["poisson", "soja", "gluten", "sesame"]));
    expect(recipeAllergens(byId["dal-lentilles-corail"])).toEqual([]);
  });
});

describe("filtrage STRICT des allergènes", () => {
  it.each(ALL_ALLERGENS)("aucune recette contenant « %s » n'est proposée", (allergen) => {
    const profile = profileWith({ allergens: [allergen] });
    const ctx = { profile, recipes: RECIPES };

    expect(filterAllowedRecipes(RECIPES, { ...profile, dislikedIngredients: [] }).some((r) => containsAllergen(r, [allergen]))).toBe(false);

    for (const seed of [1, 2, 3, 42, 999]) {
      let plan = generatePlan(ctx, { startDate: "2026-01-05", seed });
      expect(planViolations(plan, ctx)).toEqual([]);

      // Remplacement de chaque repas
      for (const meal of plan.days.flatMap((d) => d.meals)) {
        plan = replaceMeal(plan, meal.id, ctx, { seed: seed + 1 });
        for (const s of suggestReplacements(plan, meal.id, ctx, 50)) {
          expect(containsAllergen(s, [allergen]), `${s.id} suggéré malgré ${allergen}`).toBe(false);
        }
      }
      plan = addMeal(plan, 0, "collation", ctx);
      plan = regeneratePlan(plan, ctx, seed + 7);
      for (const id of recipeIdsOfPlan(plan)) {
        const recipe = RECIPES.find((r) => r.id === id)!;
        expect(containsAllergen(recipe, [allergen]), `${id} contient ${allergen}`).toBe(false);
      }
    }
  });

  it("respecte plusieurs allergies combinées", () => {
    const allergens: Allergen[] = ["gluten", "lait", "oeufs", "arachides", "sesame", "soja"];
    const ctx = { profile: profileWith({ allergens }), recipes: RECIPES };
    const plan = generatePlan(ctx, { startDate: "2026-01-05", seed: 11 });
    for (const id of recipeIdsOfPlan(plan)) {
      expect(containsAllergen(RECIPES.find((r) => r.id === id)!, allergens)).toBe(false);
    }
  });

  it("refuse explicitement une recette allergène choisie manuellement", () => {
    const ctx = { profile: profileWith({ allergens: ["arachides"] }), recipes: RECIPES };
    const plan = generatePlan(ctx, { startDate: "2026-01-05", seed: 3 });
    const souper = plan.days[0].meals.find((m) => m.slot === "souper")!;
    expect(() => replaceMeal(plan, souper.id, ctx, { recipeId: "pad-thai-crevettes" })).toThrow();
    expect(() => addMeal(plan, 0, "collation", ctx, { recipeId: "boules-energie-dattes" })).toThrow();
  });

  it("retire un repas verrouillé devenu dangereux après l'ajout d'une allergie", () => {
    const ctx = { profile: profileWith({}), recipes: RECIPES };
    let plan = generatePlan(ctx, { startDate: "2026-01-05", seed: 5 });
    const meal = plan.days[0].meals[0];
    plan = { ...plan, days: plan.days.map((d, i) => (i === 0 ? { ...d, meals: d.meals.map((m) => (m.id === meal.id ? { ...m, locked: true } : m)) } : d)) };
    const recipe = RECIPES.find((r) => r.id === meal.recipeId)!;
    const allergen = recipeAllergens(recipe)[0];
    if (!allergen) return; // recette sans allergène : rien à vérifier pour cette graine
    const strict = { profile: profileWith({ allergens: [allergen] }), recipes: RECIPES };
    const regenerated = regeneratePlan(plan, strict, 6);
    expect(planViolations(regenerated, strict)).toEqual([]);
  });
});

describe("régimes", () => {
  it("un plan végétalien ne contient aucun produit animal", () => {
    const ctx = { profile: profileWith({ diet: "vegetalien" }), recipes: RECIPES };
    const plan = generatePlan(ctx, { startDate: "2026-01-05", seed: 8 });
    for (const id of recipeIdsOfPlan(plan)) {
      expect(isDietCompatible(RECIPES.find((r) => r.id === id)!, "vegetalien")).toBe(true);
    }
  });

  it("propose plusieurs options végétariennes", () => {
    expect(RECIPES.filter((r) => isDietCompatible(r, "vegetarien")).length).toBeGreaterThanOrEqual(8);
  });

  it("exclut les aliments détestés", () => {
    const ctx = { profile: profileWith({ dislikedIngredients: ["avocat", "champignons"] }), recipes: RECIPES };
    const plan = generatePlan(ctx, { startDate: "2026-01-05", seed: 9 });
    for (const id of recipeIdsOfPlan(plan)) {
      const ingredients = RECIPES.find((r) => r.id === id)!.ingredients.map((i) => i.ingredientId);
      expect(ingredients).not.toContain("avocat");
      expect(ingredients).not.toContain("champignons");
    }
  });
});
