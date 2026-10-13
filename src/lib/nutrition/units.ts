import type { Ingredient, Quantity, Unit } from "@/lib/domain/types";

/**
 * Conversion d'unités (fonctions pures).
 *
 * Trois dimensions : masse (g), volume (ml) et dénombrable (unité).
 * Les conversions entre dimensions passent par l'ingrédient :
 *   volume ↔ masse grâce à `density` (g/ml, défaut 1),
 *   unité ↔ masse grâce à `gramsPerUnit`.
 */

export type Dimension = "mass" | "volume" | "count";

const MASS_FACTORS: Partial<Record<Unit, number>> = { g: 1, kg: 1000 };
/** Mesures canadiennes : 1 c. à soupe = 15 ml, 1 c. à thé = 5 ml, 1 pincée ≈ 0,3 ml. */
const VOLUME_FACTORS: Partial<Record<Unit, number>> = { ml: 1, l: 1000, "c-soupe": 15, "c-the": 5, pincee: 0.3 };

export function dimensionOf(unit: Unit): Dimension {
  if (unit in MASS_FACTORS) return "mass";
  if (unit in VOLUME_FACTORS) return "volume";
  return "count";
}

/** Convertit vers l'unité de base de sa dimension (g, ml ou unité). */
export function toBase(quantity: Quantity): { amount: number; dimension: Dimension } {
  const dimension = dimensionOf(quantity.unit);
  if (dimension === "mass") return { amount: quantity.amount * MASS_FACTORS[quantity.unit]!, dimension };
  if (dimension === "volume") return { amount: quantity.amount * VOLUME_FACTORS[quantity.unit]!, dimension };
  return { amount: quantity.amount, dimension };
}

/** Masse estimée en grammes ; `null` si la conversion est impossible. */
export function toGrams(quantity: Quantity, ingredient: Ingredient): number | null {
  const base = toBase(quantity);
  if (base.dimension === "mass") return base.amount;
  if (base.dimension === "volume") return base.amount * (ingredient.density ?? 1);
  return ingredient.gramsPerUnit != null ? base.amount * ingredient.gramsPerUnit : null;
}

/**
 * Convertit une quantité (dans l'unité de base de `from`) vers la dimension `to`.
 * Retourne `null` si l'ingrédient ne fournit pas l'information nécessaire.
 */
export function convertBase(
  amount: number,
  from: Dimension,
  to: Dimension,
  ingredient: Ingredient,
): number | null {
  if (from === to) return amount;
  const density = ingredient.density ?? 1;
  let grams: number | null;
  if (from === "mass") grams = amount;
  else if (from === "volume") grams = amount * density;
  else grams = ingredient.gramsPerUnit != null ? amount * ingredient.gramsPerUnit : null;
  if (grams == null) return null;
  if (to === "mass") return grams;
  if (to === "volume") return grams / density;
  return ingredient.gramsPerUnit ? grams / ingredient.gramsPerUnit : null;
}

export const BASE_UNIT: Record<Dimension, Unit> = { mass: "g", volume: "ml", count: "unite" };
