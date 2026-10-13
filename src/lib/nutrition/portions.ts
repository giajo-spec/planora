import { UNIT_LABELS } from "@/lib/domain/labels";
import type { Ingredient, Quantity, RecipeIngredient } from "@/lib/domain/types";

/**
 * Calcul des portions et arrondis « intelligents » (fonctions pures).
 * Objectif : des quantités qu'un humain peut mesurer — jamais « 0,333 œuf ».
 */

/** Facteur d'échelle entre les portions de référence et les portions voulues. */
export function scaleFactor(baseServings: number, targetServings: number): number {
  if (baseServings <= 0) throw new Error("Le nombre de portions de référence doit être positif.");
  return Math.max(0, targetServings) / baseServings;
}

export function scaleQuantity(quantity: Quantity, factor: number): Quantity {
  return { amount: quantity.amount * factor, unit: quantity.unit };
}

function roundTo(value: number, step: number): number {
  return Number((Math.round(value / step) * step).toFixed(4));
}

function roundMetric(value: number): number {
  if (value <= 0) return 0;
  if (value < 10) return Math.max(1, Math.round(value));
  if (value < 100) return roundTo(value, 5);
  if (value < 500) return roundTo(value, 10);
  return roundTo(value, 25);
}

/**
 * Arrondit une quantité pour l'affichage et choisit l'unité la plus lisible.
 * - unités dénombrables : au pas de l'ingrédient (1 œuf, ½ citron), minimum un pas ;
 * - cuillères : au ¼, conversion c. à thé → c. à soupe → ml quand c'est plus clair ;
 * - g / ml : paliers 1 / 5 / 10 / 25, puis kg / L au-delà de 1000.
 */
export function roundQuantity(quantity: Quantity, ingredient?: Ingredient): Quantity {
  const { amount, unit } = quantity;
  if (amount <= 0) return { amount: 0, unit };

  switch (unit) {
    case "unite": {
      const step = ingredient?.countStep ?? 1;
      return { amount: Math.max(step, roundTo(amount, step)), unit };
    }
    case "pincee":
      return { amount: Math.max(1, Math.round(amount)), unit };
    case "c-the": {
      if (amount >= 3) return roundQuantity({ amount: amount / 3, unit: "c-soupe" }, ingredient);
      if (amount < 0.2) return { amount: Math.max(1, Math.round(amount / 0.06)), unit: "pincee" };
      return { amount: Math.max(0.25, roundTo(amount, 0.25)), unit };
    }
    case "c-soupe": {
      if (amount > 4) return roundQuantity({ amount: amount * 15, unit: "ml" }, ingredient);
      if (amount < 0.9) return roundQuantity({ amount: amount * 3, unit: "c-the" }, ingredient);
      return { amount: Math.max(0.25, roundTo(amount, 0.25)), unit };
    }
    case "g":
    case "ml": {
      const rounded = roundMetric(amount);
      if (rounded >= 1000) return { amount: roundTo(rounded / 1000, 0.05), unit: unit === "g" ? "kg" : "l" };
      return { amount: rounded, unit };
    }
    case "kg":
    case "l": {
      if (amount < 1) return roundQuantity({ amount: amount * 1000, unit: unit === "kg" ? "g" : "ml" }, ingredient);
      return { amount: roundTo(amount, 0.05), unit };
    }
  }
}

const FRACTIONS: Array<[number, string]> = [
  [0.25, "¼"],
  [1 / 3, "⅓"],
  [0.5, "½"],
  [2 / 3, "⅔"],
  [0.75, "¾"],
];

/** Formate un nombre à la québécoise (virgule décimale, fractions usuelles). */
export function formatAmount(amount: number, allowFractions = true): string {
  if (allowFractions) {
    const whole = Math.floor(amount + 1e-9);
    const rest = amount - whole;
    if (rest < 0.02) return String(whole);
    if (rest > 0.98) return String(whole + 1);
    const match = FRACTIONS.find(([value]) => Math.abs(rest - value) < 0.02);
    if (match) return whole > 0 ? `${whole} ${match[1]}` : match[1];
  }
  const decimals = amount < 10 ? 2 : 1;
  return Number(amount.toFixed(decimals)).toLocaleString("fr-CA", { maximumFractionDigits: decimals });
}

/** Formate une quantité déjà arrondie : « 2 c. à soupe », « 1,2 kg », « ½ ». */
export function formatQuantity(quantity: Quantity): string {
  const { amount, unit } = quantity;
  const fractional = unit === "unite" || unit === "c-soupe" || unit === "c-the" || unit === "pincee";
  const value = formatAmount(amount, fractional);
  const label = amount >= 2 ? UNIT_LABELS[unit].many : UNIT_LABELS[unit].one;
  return label ? `${value} ${label}` : value;
}

/** Nom accordé selon la quantité (« 2 oignons », « ½ citron »). */
export function ingredientName(ingredient: Ingredient, quantity: Quantity): string {
  if (quantity.unit === "unite" && quantity.amount >= 2 && ingredient.plural) return ingredient.plural;
  return ingredient.name;
}

export interface IngredientLine {
  ingredientId: string;
  quantity: Quantity;
  quantityText: string;
  name: string;
  note?: string;
  optional?: boolean;
}

/** Ligne d'ingrédient prête à afficher pour un facteur d'échelle donné. */
export function formatIngredientLine(
  recipeIngredient: RecipeIngredient,
  ingredient: Ingredient,
  factor: number,
): IngredientLine {
  const quantity = roundQuantity(scaleQuantity(recipeIngredient, factor), ingredient);
  return {
    ingredientId: recipeIngredient.ingredientId,
    quantity,
    quantityText: formatQuantity(quantity),
    name: ingredientName(ingredient, quantity),
    note: recipeIngredient.note,
    optional: recipeIngredient.optional,
  };
}

/** Portions proposées par les sélecteurs : pas de 0,5 sous 2, puis entiers. */
export function nextServings(current: number, direction: 1 | -1): number {
  let next: number;
  if (current < 2 || (current === 2 && direction === -1)) next = current + 0.5 * direction;
  // Au-delà de 2, on revient à des entiers (3,5 → 4 ou 3).
  else next = direction > 0 ? Math.floor(current) + 1 : Math.ceil(current) - 1;
  return Math.min(24, Math.max(0.5, Math.round(next * 2) / 2));
}
