import type { Faq, Recipe, RecipeIngredient, RecipeStep, StepTimer, Unit } from "@/lib/domain/types";

/** Étape en cours de composition : on liste les ingrédients utilisés, l'assembleur calcule les parts. */
export interface DraftStep {
  text: string;
  items?: RecipeIngredient[];
  minutes?: number;
  timers?: StepTimer[];
  tip?: string;
  faq?: Faq[];
}

export type RecipeMeta = Omit<Recipe, "ingredients" | "steps">;

const SPOON_IN_TSP: Partial<Record<Unit, number>> = { "c-soupe": 3, "c-the": 1, pincee: 0.06 };
const group = (unit: Unit) => (unit in SPOON_IN_TSP ? "cuillere" : unit);
const key = (i: { ingredientId: string; unit: Unit }) => `${i.ingredientId}|${group(i.unit)}`;

/**
 * Harmonise les unités d'un même ingrédient : si une recette utilise du sel
 * « 1 pincée » et « ½ c. à thé », tout est converti en c. à thé.
 */
function harmonize(items: RecipeIngredient[]): RecipeIngredient[] {
  const units = new Map<string, Set<Unit>>();
  for (const i of items) {
    const k = key(i);
    if (!units.has(k)) units.set(k, new Set());
    units.get(k)!.add(i.unit);
  }
  return items.map((i) => {
    const set = units.get(key(i))!;
    if (set.size <= 1 || !(i.unit in SPOON_IN_TSP)) return i;
    return { ...i, amount: i.amount * SPOON_IN_TSP[i.unit]!, unit: "c-the" as Unit };
  });
}

/**
 * Assemble une recette : fusionne les ingrédients répétés (ail dans la sauce
 * ET dans la marinade…) en une seule ligne, puis indique pour chaque étape
 * l'index et la part utilisée — exactement comme les recettes écrites à la main.
 */
export function assemble(meta: RecipeMeta, rawDrafts: DraftStep[]): Recipe {
  const all = harmonize(rawDrafts.flatMap((d) => d.items ?? []));
  let cursor = 0;
  const drafts = rawDrafts.map((d) => {
    const n = d.items?.length ?? 0;
    const items = all.slice(cursor, cursor + n);
    cursor += n;
    return { ...d, items };
  });
  const totals = new Map<string, { line: RecipeIngredient; total: number }>();
  for (const step of drafts) {
    for (const item of step.items ?? []) {
      const k = key(item);
      const entry = totals.get(k);
      if (entry) entry.total += item.amount;
      else totals.set(k, { line: item, total: item.amount });
    }
  }
  const order = [...totals.keys()];
  const ingredients: RecipeIngredient[] = order.map((k) => {
    const { line, total } = totals.get(k)!;
    return { ...line, amount: Number(total.toFixed(3)) };
  });

  const steps: RecipeStep[] = drafts.map((d) => {
    const used = new Map<string, number>();
    for (const item of d.items ?? []) used.set(key(item), (used.get(key(item)) ?? 0) + item.amount);
    const uses = [...used.entries()].map(([k, amount]) => {
      const index = order.indexOf(k);
      const part = amount / totals.get(k)!.total;
      return part >= 0.999 ? { index } : { index, part: Number(part.toFixed(3)) };
    });
    const step: RecipeStep = { text: d.text };
    if (d.minutes) step.minutes = d.minutes;
    if (d.timers?.length) step.timers = d.timers;
    if (uses.length) step.uses = uses;
    if (d.tip) step.tip = d.tip;
    if (d.faq?.length) step.faq = d.faq;
    return step;
  });

  return { ...meta, ingredients, steps };
}

/** « a, b et c » */
export function frenchList(items: string[]): string {
  const list = items.filter(Boolean);
  if (list.length <= 1) return list[0] ?? "";
  return `${list.slice(0, -1).join(", ")} et ${list[list.length - 1]}`;
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function roundTo5(minutes: number): number {
  return Math.max(5, Math.round(minutes / 5) * 5);
}

export const timer = (label: string, minutes: number): StepTimer => ({ label, seconds: Math.round(minutes * 60) });

/** Identifiant stable et lisible (sert aussi d'URL et de nom de photo). */
export function slug(...parts: string[]): string {
  return parts
    .filter(Boolean)
    .join("-")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/œ/g, "oe")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
