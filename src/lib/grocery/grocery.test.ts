import { describe, expect, it } from "vitest";
import { getIngredient } from "@/lib/data/ingredients";
import { RECIPE_MAP, getRecipe } from "@/lib/data/recipes";
import type { MealPlan } from "@/lib/domain/types";
import { generatePlan, replaceMeal, setServings } from "@/lib/planner/planner";
import { createDemoProfile } from "@/lib/profile/defaults";
import { RECIPES } from "@/lib/data/recipes";
import {
  EMPTY_GROCERY_STATE,
  addExtraRecipe,
  buildGroceryLines,
  buildGroceryView,
  hideLine,
  mergeQuantities,
  toggleChecked,
  togglePantry,
  usagesFromPlan,
} from "./grocery";

describe("fusion des quantités", () => {
  it("additionne les quantités de même unité", () => {
    expect(mergeQuantities([{ amount: 200, unit: "g" }, { amount: 150, unit: "g" }], getIngredient("riz-basmati"))).toEqual([
      { amount: 350, unit: "g" },
    ]);
  });

  it("convertit les unités compatibles (kg + g, c. à soupe + ml)", () => {
    expect(mergeQuantities([{ amount: 1, unit: "kg" }, { amount: 250, unit: "g" }], getIngredient("riz-basmati"))).toEqual([
      { amount: 1.25, unit: "kg" },
    ]);
    // 2 c. à soupe (30 ml) + 1 c. à thé (5 ml) + 100 ml = 135 ml
    expect(
      mergeQuantities(
        [{ amount: 2, unit: "c-soupe" }, { amount: 1, unit: "c-the" }, { amount: 100, unit: "ml" }],
        getIngredient("huile-olive"),
      ),
    ).toEqual([{ amount: 140, unit: "ml" }]);
  });

  it("convertit les unités vers la dimension majoritaire grâce au poids unitaire", () => {
    // 2 oignons + 1 oignon + 150 g (= 1 oignon) → 4 oignons
    expect(
      mergeQuantities(
        [{ amount: 2, unit: "unite" }, { amount: 1, unit: "unite" }, { amount: 150, unit: "g" }],
        getIngredient("oignon"),
      ),
    ).toEqual([{ amount: 4, unit: "unite" }]);
  });

  it("garde séparées les quantités inconvertibles", () => {
    const result = mergeQuantities([{ amount: 300, unit: "g" }, { amount: 1, unit: "unite" }], getIngredient("brocoli"));
    expect(result).toHaveLength(2);
  });

  it("arrondit les unités vers le haut pour l'achat", () => {
    expect(mergeQuantities([{ amount: 0.5, unit: "unite" }, { amount: 0.5, unit: "unite" }, { amount: 0.25, unit: "unite" }], getIngredient("avocat"))).toEqual([
      { amount: 2, unit: "unite" },
    ]);
  });
});

describe("liste d'épicerie", () => {
  it("regroupe les ingrédients de plusieurs recettes", () => {
    const lines = buildGroceryLines(
      [
        { recipeId: "poulet-tikka", servings: 4 },
        { recipeId: "dal-lentilles-corail", servings: 4 },
      ],
      RECIPE_MAP,
    );
    const riz = lines.find((l) => l.ingredientId === "riz-basmati")!;
    expect(riz.amounts).toEqual([{ amount: 600, unit: "g" }]);
    expect(riz.recipeIds.sort()).toEqual(["dal-lentilles-corail", "poulet-tikka"]);
    // une seule ligne par ingrédient
    expect(new Set(lines.map((l) => l.key)).size).toBe(lines.length);
  });

  it("tient compte des portions", () => {
    const lines = buildGroceryLines([{ recipeId: "shakshuka", servings: 8 }], RECIPE_MAP);
    expect(lines.find((l) => l.ingredientId === "oeuf")!.amounts).toEqual([{ amount: 12, unit: "unite" }]);
  });

  it("est triée par rayon", () => {
    const lines = buildGroceryLines([{ recipeId: "poulet-tikka", servings: 4 }], RECIPE_MAP);
    expect(lines[0].aisle).toBe("fruits-legumes");
  });

  it("conserve les cases cochées et signale les quantités modifiées", () => {
    const profile = createDemoProfile("2026-01-01");
    const ctx = { profile, recipes: RECIPES };
    let plan: MealPlan = generatePlan(ctx, { startDate: "2026-01-05", seed: 7 });
    let lines = buildGroceryLines(usagesFromPlan(plan), RECIPE_MAP);
    let state = EMPTY_GROCERY_STATE;
    const target = lines.find((l) => l.ingredientId === "ail") ?? lines[0];
    state = toggleChecked(state, target);
    state = { ...state, manual: [{ id: "m1", name: "Papier essuie-tout", quantity: "1", aisle: "autre", checked: true }] };

    // Changement de portions d'un repas qui contient l'ingrédient coché
    const meal = plan.days.flatMap((d) => d.meals).find((m) => getRecipe(m.recipeId)!.ingredients.some((i) => i.ingredientId === target.ingredientId))!;
    plan = setServings(plan, meal.id, meal.servings + 6);
    lines = buildGroceryLines(usagesFromPlan(plan), RECIPE_MAP);
    let view = buildGroceryView(lines, state);
    const item = view.toBuy.flatMap((a) => a.items).find((i) => i.line.key === target.key)!;
    expect(item.checked).toBe(true);
    expect(item.changedSinceCheck).toBe(true);
    expect(state.manual).toHaveLength(1);

    // Remplacement d'un autre repas : la case reste cochée
    const other = plan.days[3].meals[0];
    plan = replaceMeal(plan, other.id, ctx);
    lines = buildGroceryLines(usagesFromPlan(plan), RECIPE_MAP);
    view = buildGroceryView(lines, state);
    expect(view.toBuy.flatMap((a) => a.items).find((i) => i.line.key === target.key)?.checked).toBe(true);
  });

  it("gère le garde-manger, les suppressions et les recettes ajoutées", () => {
    let state = addExtraRecipe(EMPTY_GROCERY_STATE, "houmous-crudites", 6);
    let lines = buildGroceryLines(usagesFromPlan(null, state.extras), RECIPE_MAP);
    expect(lines.some((l) => l.ingredientId === "tahini")).toBe(true);

    state = togglePantry(state, "sel");
    const tahini = lines.find((l) => l.ingredientId === "tahini")!;
    state = hideLine(state, tahini);
    let view = buildGroceryView(lines, state);
    expect(view.pantry.map((l) => l.key)).toContain("sel");
    expect(view.hiddenCount).toBe(1);
    expect(view.toBuy.flatMap((a) => a.items).some((i) => i.line.key === "tahini")).toBe(false);

    // Si la quantité change, l'article supprimé réapparaît (pour ne rien oublier)
    state = addExtraRecipe(state, "houmous-crudites", 6);
    lines = buildGroceryLines(usagesFromPlan(null, state.extras), RECIPE_MAP);
    view = buildGroceryView(lines, state);
    expect(view.toBuy.flatMap((a) => a.items).some((i) => i.line.key === "tahini")).toBe(true);
  });
});
