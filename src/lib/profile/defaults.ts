import type { Profile } from "@/lib/domain/types";
import { defaultTargets } from "@/lib/nutrition/nutrition";

/** Profil de départ du questionnaire. */
export function createEmptyProfile(now = new Date().toISOString()): Profile {
  return {
    name: "",
    householdSize: 2,
    diet: "omnivore",
    likedIngredients: [],
    dislikedIngredients: [],
    allergens: [],
    restrictions: [],
    cookingLevel: "intermediaire",
    timeBudget: 45,
    equipment: ["four"],
    meals: ["dejeuner", "diner", "souper"],
    snacksPerDay: 1,
    goal: "equilibre",
    nutritionFocus: [],
    targets: defaultTargets("equilibre"),
    portionFactor: 1,
    createdAt: now,
  };
}

/** Profil utilisé par « Découvrir l'application » : une famille de 4. */
export function createDemoProfile(now = new Date().toISOString()): Profile {
  return {
    ...createEmptyProfile(now),
    name: "Camille",
    householdSize: 4,
    meals: ["dejeuner", "diner", "souper", "collation"],
    equipment: ["four", "robot-culinaire", "melangeur"],
    likedIngredients: ["poitrine-poulet", "saumon", "avocat"],
    isDemo: true,
  };
}
