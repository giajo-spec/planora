import { RECIPE_MAP } from "@/lib/data/recipes";
import type { MealPlan, Nutrition, PlanDay, PlannedMeal, Profile } from "@/lib/domain/types";
import { ZERO_NUTRITION, addNutrition, nutritionPerServing, scaleNutrition } from "@/lib/nutrition/nutrition";
import { totalMinutes } from "@/lib/recipes/analysis";
import { slotsForProfile } from "./planner";

/** Statistiques dérivées d'un plan (fonctions pures). */

/** Nutrition « pour vous » sur une journée : 1 portion × facteur personnel. */
export function dayNutritionPerPerson(day: PlanDay, portionFactor = 1): Nutrition {
  return day.meals.reduce((acc, meal) => {
    const recipe = RECIPE_MAP[meal.recipeId];
    return recipe ? addNutrition(acc, scaleNutrition(nutritionPerServing(recipe), portionFactor)) : acc;
  }, ZERO_NUTRITION);
}

export function dayMinutes(day: PlanDay): number {
  return day.meals.reduce((acc, m) => acc + (RECIPE_MAP[m.recipeId] ? totalMinutes(RECIPE_MAP[m.recipeId]) : 0), 0);
}

export function todayIndex(plan: MealPlan, today: string): number {
  return plan.days.findIndex((d) => d.date === today);
}

export function planProgress(plan: MealPlan): { done: number; total: number } {
  const meals = plan.days.flatMap((d) => d.meals);
  return { done: meals.filter((m) => m.done).length, total: meals.length };
}

/** Prochain repas non préparé à partir d'aujourd'hui. */
export function nextMeal(plan: MealPlan, today: string): { dayIndex: number; meal: PlannedMeal } | null {
  const start = Math.max(0, plan.days.findIndex((d) => d.date >= today));
  if (plan.days.every((d) => d.date < today)) return null;
  for (let i = start; i < plan.days.length; i++) {
    const meal = plan.days[i].meals.find((m) => !m.done);
    if (meal) return { dayIndex: i, meal };
  }
  return null;
}

/** Créneaux prévus au profil mais sans recette compatible. */
export function missingSlots(day: PlanDay, profile: Profile): string[] {
  const expected = slotsForProfile(profile);
  const present = [...day.meals.map((m) => m.slot)];
  const missing: string[] = [];
  for (const slot of expected) {
    const i = present.indexOf(slot);
    if (i >= 0) present.splice(i, 1);
    else missing.push(slot);
  }
  return missing;
}

export function isPlanExpired(plan: MealPlan, today: string): boolean {
  return plan.days.length > 0 && plan.days[plan.days.length - 1].date < today;
}

const dayFormatter = new Intl.DateTimeFormat("fr-CA", { weekday: "long", timeZone: "UTC" });
const shortFormatter = new Intl.DateTimeFormat("fr-CA", { weekday: "short", timeZone: "UTC" });
const dateFormatter = new Intl.DateTimeFormat("fr-CA", { day: "numeric", month: "short", timeZone: "UTC" });

function toDate(iso: string) {
  return new Date(`${iso}T12:00:00Z`);
}

export function weekdayLabel(iso: string): string {
  const s = dayFormatter.format(toDate(iso));
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function weekdayShort(iso: string): string {
  return shortFormatter.format(toDate(iso)).replace(".", "");
}

export function dayOfMonth(iso: string): number {
  return Number(iso.slice(8, 10));
}

export function dateLabel(iso: string): string {
  return dateFormatter.format(toDate(iso));
}
