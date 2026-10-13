import { describe, expect, it } from "vitest";
import { getIngredient } from "@/lib/data/ingredients";
import { convertBase, dimensionOf, toBase, toGrams } from "./units";

describe("conversion d'unités", () => {
  it("identifie les dimensions", () => {
    expect(dimensionOf("kg")).toBe("mass");
    expect(dimensionOf("c-soupe")).toBe("volume");
    expect(dimensionOf("unite")).toBe("count");
  });

  it("convertit vers l'unité de base", () => {
    expect(toBase({ amount: 1.5, unit: "kg" })).toEqual({ amount: 1500, dimension: "mass" });
    expect(toBase({ amount: 2, unit: "c-soupe" })).toEqual({ amount: 30, dimension: "volume" });
    expect(toBase({ amount: 3, unit: "c-the" })).toEqual({ amount: 15, dimension: "volume" });
    expect(toBase({ amount: 1, unit: "l" })).toEqual({ amount: 1000, dimension: "volume" });
  });

  it("convertit en grammes avec densité et poids unitaire", () => {
    const huile = getIngredient("huile-olive");
    expect(toGrams({ amount: 1, unit: "c-soupe" }, huile)).toBeCloseTo(13.8);
    expect(toGrams({ amount: 2, unit: "unite" }, getIngredient("oeuf"))).toBe(100);
    expect(toGrams({ amount: 100, unit: "ml" }, getIngredient("bouillon-legumes"))).toBe(100);
    expect(toGrams({ amount: 1, unit: "unite" }, getIngredient("brocoli"))).toBeNull();
  });

  it("convertit entre dimensions quand l'ingrédient le permet", () => {
    const oignon = getIngredient("oignon");
    expect(convertBase(300, "mass", "count", oignon)).toBe(2);
    expect(convertBase(2, "count", "mass", oignon)).toBe(300);
    expect(convertBase(100, "mass", "count", getIngredient("brocoli"))).toBeNull();
  });
});
