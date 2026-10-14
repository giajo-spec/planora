import { MEAL_ORDER } from "@/lib/domain/labels";
import type { MealPlan, MealType, PlanDay, PlannedMeal, Profile, Recipe } from "@/lib/domain/types";
import { nutritionPerServing } from "@/lib/nutrition/nutrition";
import {
  type HardConstraints,
  isRecipeAllowed,
  missingEquipment,
  totalMinutes,
} from "@/lib/recipes/analysis";
import { createRng, makeId } from "./random";

/**
 * Planificateur de repas — fonctions PURES, sans dépendance à l'interface.
 *
 * L'interface `MealPlanner` permet de remplacer ce moteur à base de règles par
 * un moteur IA (côté serveur) sans toucher aux composants : il suffit de fournir
 * une autre implémentation (voir `docs/ARCHITECTURE.md`).
 *
 * Règle d'or : les contraintes strictes (allergies, régime, restrictions,
 * aliments détestés) ne sont JAMAIS relâchées. Seules les préférences
 * « souples » (temps, équipement, niveau) peuvent l'être, à défaut d'options.
 */

export interface PlannerContext {
  profile: Profile;
  recipes: readonly Recipe[];
}

export interface MealPlanner {
  generatePlan(ctx: PlannerContext, options: { startDate: string; seed: number; createdAt?: string }): MealPlan;
  /** Régénère tout le plan en conservant les repas verrouillés. */
  regeneratePlan(plan: MealPlan, ctx: PlannerContext, seed: number): MealPlan;
  /** Remplace un seul repas (jamais un repas verrouillé). */
  replaceMeal(plan: MealPlan, mealId: string, ctx: PlannerContext, options?: { recipeId?: string; seed?: number }): MealPlan;
  suggestReplacements(plan: MealPlan, mealId: string, ctx: PlannerContext, limit?: number): Recipe[];
  addMeal(plan: MealPlan, dayIndex: number, slot: MealType, ctx: PlannerContext, options?: { recipeId?: string; seed?: number }): MealPlan;
}

export const PLAN_LENGTH = 7;

/* ------------------------------------------------------------------ */
/* Aides                                                               */
/* ------------------------------------------------------------------ */

export function hardConstraintsOf(profile: Profile): HardConstraints {
  return {
    allergens: profile.allergens,
    diet: profile.diet,
    restrictions: profile.restrictions,
    dislikedIngredients: profile.dislikedIngredients,
  };
}

/** Portions par défaut : le foyer, ajusté du facteur de l'utilisateur principal. */
export function defaultServings(profile: Profile): number {
  const servings = profile.householdSize - 1 + profile.portionFactor;
  return Math.max(1, Math.round(servings * 2) / 2);
}

/** Créneaux d'une journée, dans l'ordre chronologique. */
export function slotsForProfile(profile: Profile): MealType[] {
  const slots: MealType[] = [];
  for (const slot of MEAL_ORDER) {
    if (!profile.meals.includes(slot)) continue;
    if (slot === "collation") {
      for (let i = 0; i < Math.max(1, profile.snacksPerDay); i++) slots.push("collation");
    } else slots.push(slot);
  }
  return slots;
}

export function addDays(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + days));
  return date.toISOString().slice(0, 10);
}

function sortMeals(meals: PlannedMeal[]): PlannedMeal[] {
  return meals
    .map((meal, index) => ({ meal, index }))
    .sort((a, b) => MEAL_ORDER.indexOf(a.meal.slot) - MEAL_ORDER.indexOf(b.meal.slot) || a.index - b.index)
    .map(({ meal }) => meal);
}

export function findMeal(plan: MealPlan, mealId: string): { dayIndex: number; meal: PlannedMeal } | null {
  for (let dayIndex = 0; dayIndex < plan.days.length; dayIndex++) {
    const meal = plan.days[dayIndex].meals.find((m) => m.id === mealId);
    if (meal) return { dayIndex, meal };
  }
  return null;
}

function mapMeal(plan: MealPlan, mealId: string, fn: (meal: PlannedMeal) => PlannedMeal): MealPlan {
  return {
    ...plan,
    days: plan.days.map((day) => ({
      ...day,
      meals: day.meals.map((meal) => (meal.id === mealId ? fn(meal) : meal)),
    })),
  };
}

/* ------------------------------------------------------------------ */
/* Sélection et score                                                  */
/* ------------------------------------------------------------------ */

/** Recettes admissibles pour un créneau : contraintes strictes uniquement. */
export function eligibleRecipes(slot: MealType, ctx: PlannerContext): Recipe[] {
  const constraints = hardConstraintsOf(ctx.profile);
  return ctx.recipes.filter((r) => r.mealTypes.includes(slot) && isRecipeAllowed(r, constraints));
}

interface Usage {
  /** Recette → nombre d'apparitions dans la semaine. */
  week: Map<string, number>;
  /** Recettes déjà présentes le même jour. */
  day: Set<string>;
  /** Recette du même créneau la veille. */
  previous?: string;
}

function usageFor(days: PlanDay[], dayIndex: number, slot: MealType, ignoreMealId?: string): Usage {
  const week = new Map<string, number>();
  days.forEach((day) =>
    day.meals.forEach((m) => {
      if (m.id !== ignoreMealId) week.set(m.recipeId, (week.get(m.recipeId) ?? 0) + 1);
    }),
  );
  const day = new Set((days[dayIndex]?.meals ?? []).filter((m) => m.id !== ignoreMealId).map((m) => m.recipeId));
  const previous = days[dayIndex - 1]?.meals.find((m) => m.slot === slot)?.recipeId;
  return { week, day, previous };
}

export function scoreRecipe(recipe: Recipe, slot: MealType, profile: Profile, usage: Usage): number {
  let score = 0;
  const minutes = totalMinutes(recipe);
  const budget = slot === "collation" ? Math.min(profile.timeBudget, 20) : profile.timeBudget;
  score += minutes <= budget ? 3 : -((minutes - budget) / 10);

  if (profile.cookingLevel === "debutant") score += recipe.difficulty === "facile" ? 2 : recipe.difficulty === "moyen" ? -1 : -5;
  if (profile.cookingLevel === "avance" && recipe.difficulty !== "facile") score += 1;

  const n = nutritionPerServing(recipe);
  if (profile.goal === "prise-muscle") score += n.protein / 8 + n.kcal / 400;
  if (profile.goal === "perte-gras") score += n.protein / 10 - n.kcal / 250;
  if (profile.nutritionFocus.includes("proteines")) score += n.protein / 10;
  if (profile.nutritionFocus.includes("calories")) score -= n.kcal / 300;
  if (profile.nutritionFocus.includes("glucides")) score -= n.carbs / 30;
  if (profile.nutritionFocus.includes("lipides")) score -= n.fat / 12;

  const liked = recipe.ingredients.filter((l) => profile.likedIngredients.includes(l.ingredientId)).length;
  score += liked * (profile.subscription === "personnalise" ? 2.5 : 1.5);

  // Effets des formules d'abonnement.
  const kids = (profile.childrenCount ?? 0) > 0 || profile.subscription === "famille";
  if (kids) score += recipe.tags.includes("enfants") ? 3 : recipe.tags.includes("familial") ? 1 : -1;
  if (profile.subscription === "famille" && recipe.tags.includes("prep-avance")) score += 0.5;
  if (profile.subscription === "en-forme") {
    score += n.protein / 8;
    if (recipe.tags.includes("post-entrainement")) score += 2;
  }

  score -= (usage.week.get(recipe.id) ?? 0) * 6;
  if (usage.previous === recipe.id) score -= 4;
  return score;
}

/** Classe les candidats d'un créneau ; l'équipement manquant n'est toléré qu'à défaut. */
function rankCandidates(
  slot: MealType,
  ctx: PlannerContext,
  usage: Usage,
  rng: () => number,
  exclude: string[] = [],
): Recipe[] {
  // Jamais deux fois la même recette dans une journée : mieux vaut un créneau vide.
  const eligible = eligibleRecipes(slot, ctx).filter((r) => !exclude.includes(r.id) && !usage.day.has(r.id));
  const equipped = eligible.filter((r) => missingEquipment(r, ctx.profile.equipment).length === 0);
  const pool = equipped.length > 0 ? equipped : eligible;
  return pool
    .map((recipe) => ({ recipe, score: scoreRecipe(recipe, slot, ctx.profile, usage) + rng() * 2.5 }))
    .sort((a, b) => b.score - a.score)
    .map(({ recipe }) => recipe);
}

function newMeal(recipe: Recipe, slot: MealType, profile: Profile, rng: () => number): PlannedMeal {
  return { id: makeId(rng), recipeId: recipe.id, slot, servings: defaultServings(profile), locked: false, done: false };
}

/* ------------------------------------------------------------------ */
/* Opérations sur le plan                                              */
/* ------------------------------------------------------------------ */

function fillDays(
  skeleton: Array<{ date: string; locked: PlannedMeal[] }>,
  ctx: PlannerContext,
  rng: () => number,
): PlanDay[] {
  const slots = slotsForProfile(ctx.profile);
  const days: PlanDay[] = skeleton.map((d) => ({ date: d.date, meals: [...d.locked] }));
  days.forEach((day, dayIndex) => {
    const remainingLocked = day.meals.map((m) => m.slot);
    for (const slot of slots) {
      const lockedIndex = remainingLocked.indexOf(slot);
      if (lockedIndex >= 0) {
        remainingLocked.splice(lockedIndex, 1);
        continue;
      }
      const [best] = rankCandidates(slot, ctx, usageFor(days, dayIndex, slot), rng);
      if (best) day.meals.push(newMeal(best, slot, ctx.profile, rng));
    }
    day.meals = sortMeals(day.meals);
  });
  return days;
}

export function generatePlan(
  ctx: PlannerContext,
  options: { startDate: string; seed: number; createdAt?: string },
): MealPlan {
  const rng = createRng(options.seed);
  const skeleton = Array.from({ length: PLAN_LENGTH }, (_, i) => ({ date: addDays(options.startDate, i), locked: [] }));
  return {
    id: makeId(rng),
    createdAt: options.createdAt ?? options.startDate,
    seed: options.seed,
    days: fillDays(skeleton, ctx, rng),
  };
}

export function regeneratePlan(plan: MealPlan, ctx: PlannerContext, seed: number): MealPlan {
  const rng = createRng(seed);
  const constraints = hardConstraintsOf(ctx.profile);
  const recipeById = new Map(ctx.recipes.map((r) => [r.id, r]));
  const skeleton = plan.days.map((day) => ({
    date: day.date,
    // Un repas verrouillé est conservé… sauf s'il enfreint désormais une contrainte stricte (allergie ajoutée).
    locked: day.meals.filter((m) => {
      const recipe = recipeById.get(m.recipeId);
      return m.locked && recipe != null && isRecipeAllowed(recipe, constraints);
    }),
  }));
  return { ...plan, seed, days: fillDays(skeleton, ctx, rng) };
}

export function suggestReplacements(plan: MealPlan, mealId: string, ctx: PlannerContext, limit = 6): Recipe[] {
  const found = findMeal(plan, mealId);
  if (!found) return [];
  const usage = usageFor(plan.days, found.dayIndex, found.meal.slot, mealId);
  return rankCandidates(found.meal.slot, ctx, usage, () => 0.5, [found.meal.recipeId]).slice(0, limit);
}

export function replaceMeal(
  plan: MealPlan,
  mealId: string,
  ctx: PlannerContext,
  options: { recipeId?: string; seed?: number } = {},
): MealPlan {
  const found = findMeal(plan, mealId);
  if (!found || found.meal.locked) return plan;
  const { meal, dayIndex } = found;

  let recipe: Recipe | undefined;
  if (options.recipeId) {
    recipe = eligibleRecipes(meal.slot, ctx).find((r) => r.id === options.recipeId);
    if (!recipe) throw new Error("Cette recette ne respecte pas le profil (allergies, régime ou créneau).");
  } else {
    const rng = createRng(options.seed ?? plan.seed + 1);
    const usage = usageFor(plan.days, dayIndex, meal.slot, mealId);
    recipe = rankCandidates(meal.slot, ctx, usage, rng, [meal.recipeId])[0];
  }
  if (!recipe) return plan;
  const chosen = recipe;
  return mapMeal(plan, mealId, (m) => ({ ...m, recipeId: chosen.id, done: false }));
}

export function addMeal(
  plan: MealPlan,
  dayIndex: number,
  slot: MealType,
  ctx: PlannerContext,
  options: { recipeId?: string; seed?: number } = {},
): MealPlan {
  if (!plan.days[dayIndex]) return plan;
  const rng = createRng(options.seed ?? plan.seed + dayIndex + 101);
  let recipe: Recipe | undefined;
  if (options.recipeId) {
    recipe = eligibleRecipes(slot, ctx).find((r) => r.id === options.recipeId);
    if (!recipe) throw new Error("Cette recette ne respecte pas le profil (allergies, régime ou créneau).");
  } else {
    recipe = rankCandidates(slot, ctx, usageFor(plan.days, dayIndex, slot), rng)[0];
  }
  if (!recipe) return plan;
  const meal = newMeal(recipe, slot, ctx.profile, rng);
  return {
    ...plan,
    days: plan.days.map((day, i) => (i === dayIndex ? { ...day, meals: sortMeals([...day.meals, meal]) } : day)),
  };
}

export function removeMeal(plan: MealPlan, mealId: string): MealPlan {
  return { ...plan, days: plan.days.map((day) => ({ ...day, meals: day.meals.filter((m) => m.id !== mealId) })) };
}

export function setServings(plan: MealPlan, mealId: string, servings: number): MealPlan {
  const value = Math.min(24, Math.max(0.5, Math.round(servings * 2) / 2));
  return mapMeal(plan, mealId, (m) => ({ ...m, servings: value }));
}

export function toggleLock(plan: MealPlan, mealId: string): MealPlan {
  return mapMeal(plan, mealId, (m) => ({ ...m, locked: !m.locked }));
}

export function toggleDone(plan: MealPlan, mealId: string): MealPlan {
  return mapMeal(plan, mealId, (m) => ({ ...m, done: !m.done }));
}

/** Échange deux repas (de n'importe quels jours). */
export function swapMeals(plan: MealPlan, idA: string, idB: string): MealPlan {
  const a = findMeal(plan, idA);
  const b = findMeal(plan, idB);
  if (!a || !b || idA === idB) return plan;
  return {
    ...plan,
    days: plan.days.map((day, dayIndex) => {
      if (dayIndex !== a.dayIndex && dayIndex !== b.dayIndex) return day;
      const meals = day.meals.map((m) => {
        if (m.id === idA) return { ...b.meal, slot: a.meal.slot };
        if (m.id === idB) return { ...a.meal, slot: b.meal.slot };
        return m;
      });
      return { ...day, meals: sortMeals(meals) };
    }),
  };
}

/**
 * Déplace un repas vers un autre jour. S'il existe déjà un repas du même créneau
 * (hors collation) dans le jour cible, les deux repas sont échangés.
 */
export function moveMeal(plan: MealPlan, mealId: string, toDayIndex: number): MealPlan {
  const found = findMeal(plan, mealId);
  if (!found || !plan.days[toDayIndex] || found.dayIndex === toDayIndex) return plan;
  if (found.meal.slot !== "collation") {
    const target = plan.days[toDayIndex].meals.find((m) => m.slot === found.meal.slot);
    if (target) return swapMeals(plan, mealId, target.id);
  }
  return {
    ...plan,
    days: plan.days.map((day, i) => {
      if (i === found.dayIndex) return { ...day, meals: day.meals.filter((m) => m.id !== mealId) };
      if (i === toDayIndex) return { ...day, meals: sortMeals([...day.meals, found.meal]) };
      return day;
    }),
  };
}

/** Le plan contient-il une recette interdite par le profil ? (garde-fou) */
export function planViolations(plan: MealPlan, ctx: PlannerContext): PlannedMeal[] {
  const constraints = hardConstraintsOf(ctx.profile);
  const recipeById = new Map(ctx.recipes.map((r) => [r.id, r]));
  return plan.days.flatMap((d) =>
    d.meals.filter((m) => {
      const recipe = recipeById.get(m.recipeId);
      return !recipe || !isRecipeAllowed(recipe, constraints);
    }),
  );
}

/** Implémentation par règles — remplaçable par un moteur IA côté serveur. */
export const ruleBasedPlanner: MealPlanner = {
  generatePlan,
  regeneratePlan,
  replaceMeal,
  suggestReplacements,
  addMeal,
};
