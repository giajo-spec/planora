import { describe, expect, it } from "vitest";
import { RECIPES } from "@/lib/data/recipes";
import { nutritionPerServing } from "@/lib/nutrition/nutrition";
import { createDemoProfile } from "@/lib/profile/defaults";
import {
  addDays,
  addMeal,
  defaultServings,
  findMeal,
  generatePlan,
  moveMeal,
  regeneratePlan,
  removeMeal,
  replaceMeal,
  setServings,
  slotsForProfile,
  suggestReplacements,
  swapMeals,
  toggleLock,
} from "./planner";

const profile = createDemoProfile("2026-01-01");
const ctx = { profile, recipes: RECIPES };
const base = generatePlan(ctx, { startDate: "2026-01-05", seed: 1234 });

describe("génération du plan", () => {
  it("couvre 7 jours et tous les créneaux du profil", () => {
    expect(base.days).toHaveLength(7);
    expect(base.days[0].date).toBe("2026-01-05");
    expect(base.days[6].date).toBe("2026-01-11");
    for (const day of base.days) {
      expect(day.meals.map((m) => m.slot)).toEqual(slotsForProfile(profile));
    }
  });

  it("est déterministe pour une même graine", () => {
    const again = generatePlan(ctx, { startDate: "2026-01-05", seed: 1234 });
    expect(again).toEqual(base);
  });

  it("ne répète pas la même recette dans une journée", () => {
    for (const day of base.days) {
      const ids = day.meals.map((m) => m.recipeId);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("varie les recettes dans la semaine", () => {
    const ids = new Set(base.days.flatMap((d) => d.meals.map((m) => m.recipeId)));
    expect(ids.size).toBeGreaterThanOrEqual(12);
  });

  it("varie les types de plats (pas que des bols et des sautés)", () => {
    for (const seed of [1, 2, 3]) {
      const plan = generatePlan(ctx, { startDate: "2026-01-05", seed });
      const families = plan.days.flatMap((d) => d.meals.map((m) => RECIPES.find((r) => r.id === m.recipeId)!)).map((r) => r.family ?? r.id);
      const counts = new Map<string, number>();
      families.forEach((f) => counts.set(f, (counts.get(f) ?? 0) + 1));
      expect(counts.size, `graine ${seed}`).toBeGreaterThanOrEqual(12);
      expect(Math.max(...counts.values()) / families.length, `graine ${seed}`).toBeLessThanOrEqual(0.2);
      // jamais deux fois le même type de plat dans une journée (hors collations)
      for (const day of plan.days) {
        const mains = day.meals.filter((m) => m.slot !== "collation").map((m) => RECIPES.find((r) => r.id === m.recipeId)!.family);
        expect(new Set(mains).size, `graine ${seed}`).toBe(mains.length);
      }
    }
  });

  it("utilise la taille du foyer comme portions", () => {
    expect(defaultServings(profile)).toBe(4);
    expect(defaultServings({ ...profile, householdSize: 1, portionFactor: 1.5 })).toBe(1.5);
    expect(base.days[0].meals[0].servings).toBe(4);
  });

  it("calcule les dates sans dérive de fuseau horaire", () => {
    expect(addDays("2026-03-07", 2)).toBe("2026-03-09");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
  });
});

describe("remplacement et verrous", () => {
  it("remplace un seul repas sans toucher aux autres", () => {
    const target = base.days[2].meals[1];
    const next = replaceMeal(base, target.id, ctx, { seed: 1 });
    const replaced = findMeal(next, target.id)!.meal;
    expect(replaced.recipeId).not.toBe(target.recipeId);
    expect(replaced.slot).toBe(target.slot);
    expect(replaced.servings).toBe(target.servings);
    const others = (p: typeof base) => p.days.flatMap((d) => d.meals).filter((m) => m.id !== target.id);
    expect(others(next)).toEqual(others(base));
  });

  it("ne remplace jamais un repas verrouillé", () => {
    const target = base.days[1].meals[0];
    const locked = toggleLock(base, target.id);
    expect(replaceMeal(locked, target.id, ctx)).toBe(locked);
  });

  it("conserve les repas verrouillés lors d'une régénération", () => {
    let plan = base;
    const lockedIds = [base.days[0].meals[0].id, base.days[3].meals[2].id, base.days[6].meals[1].id];
    for (const id of lockedIds) plan = toggleLock(plan, id);
    const regenerated = regeneratePlan(plan, ctx, 98765);
    for (const id of lockedIds) {
      const before = findMeal(plan, id)!;
      const after = findMeal(regenerated, id)!;
      expect(after.dayIndex).toBe(before.dayIndex);
      expect(after.meal).toEqual(before.meal);
    }
    const unlockedChanged = regenerated.days.flatMap((d) => d.meals).filter((m) => !lockedIds.includes(m.id));
    expect(unlockedChanged.length).toBeGreaterThan(0);
    // les repas non verrouillés sont nouveaux
    expect(unlockedChanged.every((m) => findMeal(plan, m.id) == null)).toBe(true);
  });

  it("suggère des remplacements différents du repas actuel", () => {
    const target = base.days[0].meals.find((m) => m.slot === "souper")!;
    const suggestions = suggestReplacements(base, target.id, ctx);
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions.map((s) => s.id)).not.toContain(target.recipeId);
    expect(suggestions.every((s) => s.mealTypes.includes("souper"))).toBe(true);
  });

  it("accepte un remplacement choisi par l'utilisateur", () => {
    const target = base.days[0].meals.find((m) => m.slot === "souper")!;
    const next = replaceMeal(base, target.id, ctx, { recipeId: "dal-lentilles-corail" });
    expect(findMeal(next, target.id)!.meal.recipeId).toBe("dal-lentilles-corail");
  });
});

describe("édition du plan", () => {
  it("modifie les portions d'un seul repas", () => {
    const target = base.days[0].meals[0];
    const next = setServings(base, target.id, 2.3);
    expect(findMeal(next, target.id)!.meal.servings).toBe(2.5);
    expect(findMeal(setServings(base, target.id, 0), target.id)!.meal.servings).toBe(0.5);
  });

  it("ajoute et retire une collation", () => {
    const next = addMeal(base, 2, "collation", ctx);
    expect(next.days[2].meals.filter((m) => m.slot === "collation")).toHaveLength(2);
    const added = next.days[2].meals.find((m) => m.slot === "collation" && !base.days[2].meals.some((b) => b.id === m.id))!;
    expect(removeMeal(next, added.id).days[2].meals).toHaveLength(base.days[2].meals.length);
  });

  it("déplace un repas vers un autre jour en échangeant le même créneau", () => {
    const souper0 = base.days[0].meals.find((m) => m.slot === "souper")!;
    const souper4 = base.days[4].meals.find((m) => m.slot === "souper")!;
    const next = moveMeal(base, souper0.id, 4);
    expect(findMeal(next, souper0.id)!.dayIndex).toBe(4);
    expect(findMeal(next, souper4.id)!.dayIndex).toBe(0);
    expect(next.days[0].meals).toHaveLength(base.days[0].meals.length);
  });

  it("déplace une collation sans échange", () => {
    const snack = base.days[0].meals.find((m) => m.slot === "collation")!;
    const next = moveMeal(base, snack.id, 1);
    expect(next.days[0].meals).toHaveLength(base.days[0].meals.length - 1);
    expect(next.days[1].meals).toHaveLength(base.days[1].meals.length + 1);
  });

  it("échange deux repas de créneaux différents", () => {
    const a = base.days[0].meals.find((m) => m.slot === "diner")!;
    const b = base.days[1].meals.find((m) => m.slot === "souper")!;
    const next = swapMeals(base, a.id, b.id);
    expect(findMeal(next, b.id)!.dayIndex).toBe(0);
    expect(findMeal(next, b.id)!.meal.slot).toBe("diner");
  });
});

describe("formules d'abonnement", () => {
  const recipeOf = (id: string) => RECIPES.find((r) => r.id === id)!;
  const share = (plan: ReturnType<typeof generatePlan>, test: (id: string) => boolean) => {
    const ids = plan.days.flatMap((d) => d.meals.map((m) => m.recipeId));
    return ids.filter(test).length / ids.length;
  };

  it("la formule Famille priorise les recettes pour enfants", () => {
    const base = generatePlan({ profile: { ...profile, subscription: "personnalise", childrenCount: 0 }, recipes: RECIPES }, { startDate: "2026-01-05", seed: 3 });
    const family = generatePlan({ profile: { ...profile, subscription: "famille", childrenCount: 2 }, recipes: RECIPES }, { startDate: "2026-01-05", seed: 3 });
    const kids = (id: string) => recipeOf(id).tags.includes("enfants");
    expect(share(family, kids)).toBeGreaterThan(share(base, kids));
    expect(share(family, kids)).toBeGreaterThan(0.6);
  });

  it("la formule En forme augmente les protéines du plan", () => {
    const protein = (plan: ReturnType<typeof generatePlan>) =>
      plan.days.flatMap((d) => d.meals).reduce((acc, m) => acc + nutritionPerServing(recipeOf(m.recipeId)).protein, 0);
    const base = generatePlan({ profile: { ...profile, subscription: "personnalise" }, recipes: RECIPES }, { startDate: "2026-01-05", seed: 4 });
    const fit = generatePlan({ profile: { ...profile, subscription: "en-forme" }, recipes: RECIPES }, { startDate: "2026-01-05", seed: 4 });
    expect(protein(fit)).toBeGreaterThan(protein(base));
  });
});

