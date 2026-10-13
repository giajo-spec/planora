import { describe, expect, it } from "vitest";
import { getIngredient } from "@/lib/data/ingredients";
import { getRecipe } from "@/lib/data/recipes";
import {
  formatAmount,
  formatIngredientLine,
  formatQuantity,
  nextServings,
  roundQuantity,
  scaleFactor,
  scaleQuantity,
} from "./portions";

describe("calcul des portions", () => {
  it("calcule le facteur d'échelle", () => {
    expect(scaleFactor(4, 2)).toBe(0.5);
    expect(scaleFactor(4, 6)).toBe(1.5);
    expect(() => scaleFactor(0, 2)).toThrow();
  });

  it("met les quantités à l'échelle", () => {
    expect(scaleQuantity({ amount: 300, unit: "g" }, 1.5)).toEqual({ amount: 450, unit: "g" });
  });

  it("n'affiche jamais une fraction d'œuf", () => {
    const oeuf = getIngredient("oeuf");
    // 6 œufs pour 4 portions → 1 portion = 1,5 œuf → arrondi à 2 (pas de demi-œuf)
    const q = roundQuantity(scaleQuantity({ amount: 6, unit: "unite" }, 1 / 4), oeuf);
    expect(Number.isInteger(q.amount)).toBe(true);
    expect(q.amount).toBeGreaterThanOrEqual(1);
    // 1 œuf pour 3 portions → au moins 1 œuf
    expect(roundQuantity({ amount: 1 / 3, unit: "unite" }, oeuf).amount).toBe(1);
  });

  it("accepte les demi-unités pour les ingrédients qui s'y prêtent", () => {
    const citron = getIngredient("citron");
    expect(roundQuantity({ amount: 0.25, unit: "unite" }, citron)).toEqual({ amount: 0.5, unit: "unite" });
    expect(roundQuantity({ amount: 1.4, unit: "unite" }, citron)).toEqual({ amount: 1.5, unit: "unite" });
  });

  it("arrondit les masses et volumes à des paliers lisibles", () => {
    expect(roundQuantity({ amount: 333.33, unit: "g" })).toEqual({ amount: 330, unit: "g" });
    expect(roundQuantity({ amount: 47.2, unit: "ml" })).toEqual({ amount: 45, unit: "ml" });
    expect(roundQuantity({ amount: 7.4, unit: "g" })).toEqual({ amount: 7, unit: "g" });
    expect(roundQuantity({ amount: 1194, unit: "ml" })).toEqual({ amount: 1.2, unit: "l" });
  });

  it("convertit les cuillères vers l'unité la plus claire", () => {
    expect(roundQuantity({ amount: 3, unit: "c-the" })).toEqual({ amount: 1, unit: "c-soupe" });
    expect(roundQuantity({ amount: 0.5, unit: "c-soupe" })).toEqual({ amount: 1.5, unit: "c-the" });
    expect(roundQuantity({ amount: 6, unit: "c-soupe" })).toEqual({ amount: 90, unit: "ml" });
    expect(roundQuantity({ amount: 0.66, unit: "c-the" })).toEqual({ amount: 0.75, unit: "c-the" });
  });

  it("formate à la québécoise avec fractions", () => {
    expect(formatAmount(0.5)).toBe("½");
    expect(formatAmount(1.5)).toBe("1 ½");
    expect(formatAmount(0.25)).toBe("¼");
    expect(formatAmount(1.25, false)).toBe("1,25");
    expect(formatQuantity({ amount: 2, unit: "c-soupe" })).toBe("2 c. à soupe");
    expect(formatQuantity({ amount: 1.2, unit: "kg" })).toBe("1,2 kg");
  });

  it("produit des lignes d'ingrédients accordées", () => {
    const recipe = getRecipe("shakshuka")!;
    const oeufLine = recipe.ingredients.find((i) => i.ingredientId === "oeuf")!;
    const line = formatIngredientLine(oeufLine, getIngredient("oeuf"), 8 / 4);
    expect(line.quantityText).toBe("12");
    expect(line.name).toBe("œufs");
    const single = formatIngredientLine(oeufLine, getIngredient("oeuf"), 1 / 6);
    expect(single.name).toBe("œuf");
  });

  it("propose des pas de portions sensés", () => {
    expect(nextServings(1, -1)).toBe(0.5);
    expect(nextServings(0.5, -1)).toBe(0.5);
    expect(nextServings(1.5, 1)).toBe(2);
    expect(nextServings(2, 1)).toBe(3);
    expect(nextServings(2, -1)).toBe(1.5);
    expect(nextServings(3.5, 1)).toBe(4);
    expect(nextServings(3.5, -1)).toBe(3);
  });
});
