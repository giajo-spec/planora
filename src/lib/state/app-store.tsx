"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { RECIPES, RECIPE_MAP } from "@/lib/data/recipes";
import type {
  Aisle,
  GroceryLine,
  GroceryState,
  MealPlan,
  MealType,
  Profile,
} from "@/lib/domain/types";
import * as grocery from "@/lib/grocery/grocery";
import * as plans from "@/lib/planner/planner";
import { ruleBasedPlanner, type MealPlanner } from "@/lib/planner/planner";
import { makeId } from "@/lib/planner/random";
import { createDemoProfile } from "@/lib/profile/defaults";
import { LocalStorageAdapter, STORAGE_KEYS, type StorageAdapter } from "@/lib/storage/storage";

/**
 * État global de l'application.
 *
 * - Les règles métier vivent dans `src/lib/**` (fonctions pures) ;
 *   ce fichier ne fait qu'orchestrer et persister.
 * - Le stockage passe par un `StorageAdapter` (localStorage aujourd'hui,
 *   Supabase demain) : aucun composant n'accède directement à localStorage.
 * - Le moteur de planification est injecté (`MealPlanner`) : un moteur IA
 *   côté serveur pourra le remplacer.
 */

export type ActivityLevel = "sedentaire" | "actif" | "musculation" | "endurance";

export interface FitnessState {
  weightKg: number | null;
  activity: ActivityLevel;
}

const DEFAULT_FITNESS: FitnessState = { weightKg: null, activity: "actif" };

export function todayISO(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function newSeed(): number {
  return Math.floor(Math.random() * 1_000_000_000);
}

interface AppContextValue {
  hydrated: boolean;
  /** Adaptateur de stockage (brouillons, préférences d'interface). */
  storage: StorageAdapter;
  profile: Profile | null;
  plan: MealPlan | null;
  groceryState: GroceryState;
  groceryLines: GroceryLine[];
  fitness: FitnessState;

  saveProfile(profile: Profile): void;
  updateProfile(patch: Partial<Profile>): void;
  startDemo(): void;
  resetAll(): Promise<void>;

  createPlan(): void;
  regeneratePlan(): void;
  replaceMeal(mealId: string, recipeId?: string): void;
  setMealServings(mealId: string, servings: number): void;
  /** Applique les portions par défaut du profil à tous les repas non verrouillés. */
  applyDefaultServings(): void;
  toggleLock(mealId: string): void;
  toggleDone(mealId: string): void;
  removeMeal(mealId: string): void;
  addMeal(dayIndex: number, slot: MealType, recipeId?: string): void;
  moveMeal(mealId: string, toDayIndex: number): void;
  swapMeals(idA: string, idB: string): void;

  toggleGroceryChecked(line: GroceryLine): void;
  togglePantry(key: string): void;
  hideGroceryLine(line: GroceryLine): void;
  restoreHiddenGrocery(): void;
  clearGroceryChecked(): void;
  addManualItem(name: string, quantity: string, aisle: Aisle): void;
  toggleManualItem(id: string): void;
  removeManualItem(id: string): void;
  addRecipeToGrocery(recipeId: string, servings: number): void;
  removeRecipeFromGrocery(recipeId: string): void;

  setFitness(patch: Partial<FitnessState>): void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({
  children,
  storage: injectedStorage,
  planner = ruleBasedPlanner,
}: {
  children: React.ReactNode;
  storage?: StorageAdapter;
  planner?: MealPlanner;
}) {
  const storage = useMemo(() => injectedStorage ?? new LocalStorageAdapter(), [injectedStorage]);
  const [hydrated, setHydrated] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [groceryState, setGroceryState] = useState<GroceryState>(grocery.EMPTY_GROCERY_STATE);
  const [fitness, setFitnessState] = useState<FitnessState>(DEFAULT_FITNESS);
  const profileRef = useRef(profile);
  profileRef.current = profile;

  /* --- Chargement initial --- */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [p, pl, g, f] = await Promise.all([
        storage.load<Profile>(STORAGE_KEYS.profile),
        storage.load<MealPlan>(STORAGE_KEYS.plan),
        storage.load<GroceryState>(STORAGE_KEYS.grocery),
        storage.load<FitnessState>(STORAGE_KEYS.fitness),
      ]);
      if (cancelled) return;
      setProfile(p);
      // Garde-fou : on ne garde que les repas dont la recette existe encore.
      setPlan(pl ? { ...pl, days: pl.days.map((d) => ({ ...d, meals: d.meals.filter((m) => RECIPE_MAP[m.recipeId]) })) } : null);
      setGroceryState(g ? { ...grocery.EMPTY_GROCERY_STATE, ...g } : grocery.EMPTY_GROCERY_STATE);
      setFitnessState(f ?? DEFAULT_FITNESS);
      setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [storage]);

  /* --- Persistance --- */
  useEffect(() => {
    if (!hydrated) return;
    if (profile) void storage.save(STORAGE_KEYS.profile, profile);
    else void storage.remove(STORAGE_KEYS.profile);
  }, [hydrated, profile, storage]);
  useEffect(() => {
    if (!hydrated) return;
    if (plan) void storage.save(STORAGE_KEYS.plan, plan);
    else void storage.remove(STORAGE_KEYS.plan);
  }, [hydrated, plan, storage]);
  useEffect(() => {
    if (hydrated) void storage.save(STORAGE_KEYS.grocery, groceryState);
  }, [hydrated, groceryState, storage]);
  useEffect(() => {
    if (hydrated) void storage.save(STORAGE_KEYS.fitness, fitness);
  }, [hydrated, fitness, storage]);

  /* --- Planification --- */
  const ctxFor = useCallback((p: Profile) => ({ profile: p, recipes: RECIPES }), []);

  const buildPlan = useCallback(
    (p: Profile) => planner.generatePlan(ctxFor(p), { startDate: todayISO(), seed: newSeed(), createdAt: new Date().toISOString() }),
    [ctxFor, planner],
  );

  const saveProfile = useCallback(
    (next: Profile) => {
      setProfile(next);
      setPlan((current) => (current ? planner.regeneratePlan(current, ctxFor(next), newSeed()) : buildPlan(next)));
    },
    [buildPlan, ctxFor, planner],
  );

  const updateProfile = useCallback((patch: Partial<Profile>) => {
    setProfile((current) => (current ? { ...current, ...patch } : current));
  }, []);

  const startDemo = useCallback(() => {
    const demo = createDemoProfile();
    setProfile(demo);
    setPlan(buildPlan(demo));
    setGroceryState(grocery.EMPTY_GROCERY_STATE);
  }, [buildPlan]);

  const resetAll = useCallback(async () => {
    await Promise.all(Object.values(STORAGE_KEYS).map((k) => storage.remove(k)));
    setProfile(null);
    setPlan(null);
    setGroceryState(grocery.EMPTY_GROCERY_STATE);
    setFitnessState(DEFAULT_FITNESS);
  }, [storage]);

  const withPlan = useCallback(
    (fn: (plan: MealPlan, profile: Profile) => MealPlan) => {
      const p = profileRef.current;
      if (!p) return;
      setPlan((current) => (current ? fn(current, p) : current));
    },
    [],
  );

  const value: AppContextValue = useMemo(() => {
    const groceryLines = grocery.buildGroceryLines(grocery.usagesFromPlan(plan, groceryState.extras), RECIPE_MAP);
    return {
      hydrated,
      storage,
      profile,
      plan,
      groceryState,
      groceryLines,
      fitness,
      saveProfile,
      updateProfile,
      startDemo,
      resetAll,

      createPlan: () => {
        if (profileRef.current) setPlan(buildPlan(profileRef.current));
      },
      regeneratePlan: () => withPlan((pl, p) => planner.regeneratePlan(pl, ctxFor(p), newSeed())),
      replaceMeal: (mealId, recipeId) =>
        withPlan((pl, p) => planner.replaceMeal(pl, mealId, ctxFor(p), { recipeId, seed: newSeed() })),
      setMealServings: (mealId, servings) => withPlan((pl) => plans.setServings(pl, mealId, servings)),
      applyDefaultServings: () =>
        withPlan((pl, p) => {
          const servings = plans.defaultServings(p);
          return { ...pl, days: pl.days.map((d) => ({ ...d, meals: d.meals.map((m) => (m.locked ? m : { ...m, servings })) })) };
        }),
      toggleLock: (mealId) => withPlan((pl) => plans.toggleLock(pl, mealId)),
      toggleDone: (mealId) => withPlan((pl) => plans.toggleDone(pl, mealId)),
      removeMeal: (mealId) => withPlan((pl) => plans.removeMeal(pl, mealId)),
      addMeal: (dayIndex, slot, recipeId) =>
        withPlan((pl, p) => planner.addMeal(pl, dayIndex, slot, ctxFor(p), { recipeId, seed: newSeed() })),
      moveMeal: (mealId, toDayIndex) => withPlan((pl) => plans.moveMeal(pl, mealId, toDayIndex)),
      swapMeals: (a, b) => withPlan((pl) => plans.swapMeals(pl, a, b)),

      toggleGroceryChecked: (line) => setGroceryState((s) => grocery.toggleChecked(s, line)),
      togglePantry: (key) => setGroceryState((s) => grocery.togglePantry(s, key)),
      hideGroceryLine: (line) => setGroceryState((s) => grocery.hideLine(s, line)),
      restoreHiddenGrocery: () => setGroceryState((s) => grocery.restoreHidden(s)),
      clearGroceryChecked: () => setGroceryState((s) => grocery.clearChecked(s)),
      addManualItem: (name, quantity, aisle) =>
        setGroceryState((s) => ({ ...s, manual: [...s.manual, { id: makeId(), name, quantity, aisle, checked: false }] })),
      toggleManualItem: (id) =>
        setGroceryState((s) => ({ ...s, manual: s.manual.map((m) => (m.id === id ? { ...m, checked: !m.checked } : m)) })),
      removeManualItem: (id) => setGroceryState((s) => ({ ...s, manual: s.manual.filter((m) => m.id !== id) })),
      addRecipeToGrocery: (recipeId, servings) => setGroceryState((s) => grocery.addExtraRecipe(s, recipeId, servings)),
      removeRecipeFromGrocery: (recipeId) => setGroceryState((s) => grocery.removeExtraRecipe(s, recipeId)),

      setFitness: (patch) => setFitnessState((f) => ({ ...f, ...patch })),
    };
  }, [hydrated, storage, profile, plan, groceryState, fitness, saveProfile, updateProfile, startDemo, resetAll, buildPlan, withPlan, planner, ctxFor]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp doit être utilisé dans <AppProvider>.");
  return ctx;
}
