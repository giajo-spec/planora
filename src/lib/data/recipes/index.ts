import type { Recipe } from "@/lib/domain/types";
import { generatedRecipes } from "../generator";
import { COLLATIONS } from "./collations";
import { DEJEUNERS } from "./dejeuners";
import { PLATS } from "./plats";

/** Recettes signatures, écrites à la main. */
export const SIGNATURE_RECIPES: readonly Recipe[] = [...DEJEUNERS, ...PLATS, ...COLLATIONS];

/**
 * Alterne les types de plats (bol, cari, burger, soupe…) pour que le catalogue
 * montre la variété dès la première page au lieu de 500 bols d'affilée.
 */
function interleaveByFamily(recipes: Recipe[]): Recipe[] {
  const groups = new Map<string, Recipe[]>();
  for (const r of recipes) {
    const key = r.family ?? r.id;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(r);
  }
  // Dans chaque famille, on alterne aussi les saveurs (deuxième segment de l'identifiant).
  const lists = [...groups.values()].map((list) => {
    const sub = new Map<string, Recipe[]>();
    for (const r of list) {
      const k = r.id.split("-")[1] ?? "";
      if (!sub.has(k)) sub.set(k, []);
      sub.get(k)!.push(r);
    }
    return roundRobin([...sub.values()]);
  });
  return roundRobin(lists);
}

function roundRobin<T>(lists: T[][]): T[] {
  const out: T[] = [];
  const max = Math.max(0, ...lists.map((l) => l.length));
  for (let i = 0; i < max; i++) for (const l of lists) if (i < l.length) out.push(l[i]);
  return out;
}

/** Catalogue complet : recettes signatures + recettes du moteur de composition. */
export const RECIPES: readonly Recipe[] = [...SIGNATURE_RECIPES, ...interleaveByFamily(generatedRecipes())];

export const RECIPE_MAP: Readonly<Record<string, Recipe>> = Object.fromEntries(
  RECIPES.map((recipe) => [recipe.id, recipe]),
);

export function getRecipe(id: string): Recipe | undefined {
  return RECIPE_MAP[id];
}
