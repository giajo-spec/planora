import { INGREDIENTS } from "@/lib/data/ingredients";
import { AISLE_ORDER } from "@/lib/domain/labels";
import type {
  ExtraRecipe,
  GroceryAmount,
  GroceryLine,
  GroceryState,
  Ingredient,
  MealPlan,
  Recipe,
} from "@/lib/domain/types";
import { formatQuantity, roundQuantity } from "@/lib/nutrition/portions";
import { type Dimension, BASE_UNIT, convertBase, toBase } from "@/lib/nutrition/units";

/**
 * Génération de la liste d'épicerie (fonctions pures).
 *
 * La liste est DÉRIVÉE du plan et des recettes ajoutées : elle n'est jamais
 * stockée telle quelle. Seul l'état utilisateur (cases cochées, garde-manger,
 * suppressions, ajouts manuels) est persistant, indexé par id d'ingrédient —
 * il survit donc aux remplacements de repas et aux changements de portions.
 */

export const EMPTY_GROCERY_STATE: GroceryState = { checked: {}, pantry: {}, hidden: {}, manual: [], extras: [] };

interface Usage {
  recipeId: string;
  servings: number;
}

export function usagesFromPlan(plan: MealPlan | null, extras: ExtraRecipe[] = []): Usage[] {
  const fromPlan = plan ? plan.days.flatMap((d) => d.meals.map((m) => ({ recipeId: m.recipeId, servings: m.servings }))) : [];
  return [...fromPlan, ...extras];
}

/**
 * Fusionne des quantités d'un même ingrédient. La dimension la plus fréquente
 * est retenue ; les autres y sont converties si possible (densité, poids
 * unitaire), sinon conservées à part.
 */
export function mergeQuantities(
  quantities: Array<{ amount: number; unit: GroceryAmount["unit"] }>,
  ingredient: Ingredient,
): GroceryAmount[] {
  const totals = new Map<Dimension, number>();
  const counts = new Map<Dimension, number>();
  for (const q of quantities) {
    const base = toBase(q);
    totals.set(base.dimension, (totals.get(base.dimension) ?? 0) + base.amount);
    counts.set(base.dimension, (counts.get(base.dimension) ?? 0) + 1);
  }
  if (totals.size === 0) return [];

  const order = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([d]) => d);
  const primary = order[0];
  const merged = new Map<Dimension, number>([[primary, totals.get(primary)!]]);
  for (const dimension of order.slice(1)) {
    const converted = convertBase(totals.get(dimension)!, dimension, primary, ingredient);
    if (converted != null) merged.set(primary, merged.get(primary)! + converted);
    else merged.set(dimension, totals.get(dimension)!);
  }

  return [...merged.entries()].map(([dimension, amount]) => roundForShopping(amount, dimension, ingredient));
}

/** Arrondi orienté achat : on arrondit les unités vers le haut (on n'achète pas ½ avocat). */
export function roundForShopping(amount: number, dimension: Dimension, ingredient: Ingredient): GroceryAmount {
  if (dimension === "count") return { amount: Math.max(1, Math.ceil(amount - 1e-6)), unit: "unite" };
  if (dimension === "volume") {
    if (amount < 15) return roundQuantity({ amount: amount / 5, unit: "c-the" }, ingredient);
    if (amount < 75) return roundQuantity({ amount: amount / 15, unit: "c-soupe" }, ingredient);
  }
  return roundQuantity({ amount, unit: BASE_UNIT[dimension] }, ingredient);
}

export function buildGroceryLines(
  usages: Usage[],
  recipes: Readonly<Record<string, Recipe>>,
  ingredients: Readonly<Record<string, Ingredient>> = INGREDIENTS,
): GroceryLine[] {
  const acc = new Map<string, { quantities: Array<{ amount: number; unit: GroceryAmount["unit"] }>; recipeIds: Set<string> }>();

  for (const usage of usages) {
    const recipe = recipes[usage.recipeId];
    if (!recipe) continue;
    const factor = usage.servings / recipe.servings;
    for (const line of recipe.ingredients) {
      const entry = acc.get(line.ingredientId) ?? { quantities: [], recipeIds: new Set<string>() };
      entry.quantities.push({ amount: line.amount * factor, unit: line.unit });
      entry.recipeIds.add(recipe.id);
      acc.set(line.ingredientId, entry);
    }
  }

  const lines: GroceryLine[] = [];
  for (const [ingredientId, entry] of acc) {
    const ingredient = ingredients[ingredientId];
    if (!ingredient) continue;
    lines.push({
      key: ingredientId,
      ingredientId,
      name: ingredient.name,
      aisle: ingredient.aisle,
      amounts: mergeQuantities(entry.quantities, ingredient),
      recipeIds: [...entry.recipeIds],
    });
  }
  return lines.sort(
    (a, b) => AISLE_ORDER.indexOf(a.aisle) - AISLE_ORDER.indexOf(b.aisle) || a.name.localeCompare(b.name, "fr-CA"),
  );
}

/** Signature des quantités : permet de détecter qu'une ligne a changé. */
export function lineSignature(line: GroceryLine): string {
  return line.amounts.map((a) => `${a.amount}${a.unit}`).join("+");
}

export function formatAmounts(line: GroceryLine, ingredient?: Ingredient): string {
  return line.amounts
    .map((a) => {
      const text = formatQuantity(a);
      if (a.unit !== "unite") return text;
      const name = a.amount >= 2 && ingredient?.plural ? ingredient.plural : ingredient?.name;
      return name ? `${text} × ${name}` : text;
    })
    .join(" + ");
}

export interface GroceryItemView {
  line: GroceryLine;
  checked: boolean;
  /** Coché, mais la quantité a changé depuis (repas remplacé, portions modifiées). */
  changedSinceCheck: boolean;
}

export interface GroceryView {
  toBuy: Array<{ aisle: GroceryLine["aisle"]; items: GroceryItemView[] }>;
  pantry: GroceryLine[];
  hiddenCount: number;
  total: number;
  done: number;
}

/** Combine la liste dérivée et l'état utilisateur. */
export function buildGroceryView(lines: GroceryLine[], state: GroceryState): GroceryView {
  const byAisle = new Map<GroceryLine["aisle"], GroceryItemView[]>();
  const pantry: GroceryLine[] = [];
  let hiddenCount = 0;
  let done = 0;
  let total = 0;

  for (const line of lines) {
    const signature = lineSignature(line);
    if (state.hidden[line.key] === signature) {
      hiddenCount++;
      continue;
    }
    if (state.pantry[line.key]) {
      pantry.push(line);
      continue;
    }
    const checkedSignature = state.checked[line.key];
    const item: GroceryItemView = {
      line,
      checked: checkedSignature != null,
      changedSinceCheck: checkedSignature != null && checkedSignature !== signature,
    };
    total++;
    if (item.checked) done++;
    const list = byAisle.get(line.aisle) ?? [];
    list.push(item);
    byAisle.set(line.aisle, list);
  }

  for (const manual of state.manual) {
    total++;
    if (manual.checked) done++;
  }

  const toBuy = AISLE_ORDER.filter((aisle) => byAisle.has(aisle)).map((aisle) => ({ aisle, items: byAisle.get(aisle)! }));
  return { toBuy, pantry, hiddenCount, total, done };
}

/* --- Transitions d'état (pures) --- */

export function toggleChecked(state: GroceryState, line: GroceryLine): GroceryState {
  const checked = { ...state.checked };
  if (checked[line.key] != null) delete checked[line.key];
  else checked[line.key] = lineSignature(line);
  return { ...state, checked };
}

export function togglePantry(state: GroceryState, key: string): GroceryState {
  const pantry = { ...state.pantry };
  if (pantry[key]) delete pantry[key];
  else pantry[key] = true;
  return { ...state, pantry };
}

export function hideLine(state: GroceryState, line: GroceryLine): GroceryState {
  return { ...state, hidden: { ...state.hidden, [line.key]: lineSignature(line) } };
}

export function restoreHidden(state: GroceryState): GroceryState {
  return { ...state, hidden: {} };
}

export function clearChecked(state: GroceryState): GroceryState {
  return { ...state, checked: {}, manual: state.manual.map((m) => ({ ...m, checked: false })) };
}

export function addExtraRecipe(state: GroceryState, recipeId: string, servings: number): GroceryState {
  const existing = state.extras.find((e) => e.recipeId === recipeId);
  const extras = existing
    ? state.extras.map((e) => (e.recipeId === recipeId ? { ...e, servings: e.servings + servings } : e))
    : [...state.extras, { recipeId, servings }];
  return { ...state, extras };
}

export function removeExtraRecipe(state: GroceryState, recipeId: string): GroceryState {
  return { ...state, extras: state.extras.filter((e) => e.recipeId !== recipeId) };
}
