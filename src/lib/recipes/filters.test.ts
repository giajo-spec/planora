import { describe, expect, it } from "vitest";
import { RECIPES } from "@/lib/data/recipes";
import { isHighProtein } from "@/lib/nutrition/nutrition";
import { EMPTY_FILTERS, activeFilterCount, applyRecipeFilters } from "./filters";
import { isDietCompatible, totalMinutes } from "./analysis";

describe("filtres du catalogue", () => {
  it("sans filtre, renvoie tout", () => {
    expect(applyRecipeFilters(RECIPES, EMPTY_FILTERS)).toHaveLength(RECIPES.length);
  });

  it("filtre par type de repas, temps et difficulté", () => {
    const result = applyRecipeFilters(RECIPES, { ...EMPTY_FILTERS, meal: "souper", maxMinutes: 30, difficulty: "moyen" });
    expect(result.length).toBeGreaterThan(0);
    for (const r of result) {
      expect(r.mealTypes).toContain("souper");
      expect(totalMinutes(r)).toBeLessThanOrEqual(30);
      expect(r.difficulty).toBe("moyen");
    }
  });

  it("filtre par régime et protéines", () => {
    const result = applyRecipeFilters(RECIPES, { ...EMPTY_FILTERS, diet: "vegetalien", highProtein: true });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((r) => isDietCompatible(r, "vegetalien") && isHighProtein(r))).toBe(true);
  });

  it("recherche sans tenir compte des accents ni de la casse", () => {
    expect(applyRecipeFilters(RECIPES, { ...EMPTY_FILTERS, query: "THAI" }).map((r) => r.id)).toContain("pad-thai-crevettes");
    const lentilles = applyRecipeFilters(RECIPES, { ...EMPTY_FILTERS, query: "lentilles coco" });
    expect(lentilles.map((r) => r.id)).toContain("dal-lentilles-corail");
    expect(lentilles.every((r) => /lentilles/i.test(JSON.stringify(r)) && /coco/i.test(JSON.stringify(r)))).toBe(true);
    // recherche par ingrédient
    expect(applyRecipeFilters(RECIPES, { ...EMPTY_FILTERS, query: "tahini" }).map((r) => r.id)).toEqual(
      expect.arrayContaining(["bol-falafels", "houmous-crudites"]),
    );
  });

  it("filtre par cuisine du monde", () => {
    const result = applyRecipeFilters(RECIPES, { ...EMPTY_FILTERS, cuisine: "Indienne" });
    expect(result.every((r) => r.cuisine === "Indienne")).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(2);
  });

  it("compte les filtres actifs", () => {
    expect(activeFilterCount(EMPTY_FILTERS)).toBe(0);
    expect(activeFilterCount({ ...EMPTY_FILTERS, highProtein: true, meal: "diner" })).toBe(2);
  });
});
