"use client";

import { Search, ShieldCheck, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Chip, EmptyState, EstimateNote } from "@/components/ui/primitives";
import { Sheet } from "@/components/ui/sheet";
import { RECIPES } from "@/lib/data/recipes";
import { DIFFICULTY_LABELS, MEAL_LABELS } from "@/lib/domain/labels";
import type { Difficulty, MealType } from "@/lib/domain/types";
import { hardConstraintsOf } from "@/lib/planner/planner";
import { filterAllowedRecipes } from "@/lib/recipes/analysis";
import { EMPTY_FILTERS, activeFilterCount, applyRecipeFilters, type RecipeFilters } from "@/lib/recipes/filters";
import { useApp } from "@/lib/state/app-store";
import { RecipeCard } from "./recipe-card";

const CUISINES = [...new Set(RECIPES.map((r) => r.cuisine))].sort((a, b) => a.localeCompare(b, "fr-CA"));
const MEALS: MealType[] = ["dejeuner", "diner", "souper", "collation"];
const TIMES = [15, 30, 45];
const DIETS = [
  ["vegetarien", "Végétarien"],
  ["vegetalien", "Végétalien"],
  ["pescetarien", "Pescétarien"],
] as const;

function FilterPanel({ filters, set }: { filters: RecipeFilters; set: (patch: Partial<RecipeFilters>) => void }) {
  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="mb-2 font-bold">Temps total</legend>
        <div className="flex flex-wrap gap-2">
          {TIMES.map((t) => (
            <Chip key={t} selected={filters.maxMinutes === t} onClick={() => set({ maxMinutes: filters.maxMinutes === t ? null : t })}>
              ≤ {t} min
            </Chip>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-2 font-bold">Difficulté</legend>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map((d) => (
            <Chip key={d} selected={filters.difficulty === d} onClick={() => set({ difficulty: filters.difficulty === d ? null : d })}>
              {DIFFICULTY_LABELS[d]}
            </Chip>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-2 font-bold">Régime</legend>
        <div className="flex flex-wrap gap-2">
          {DIETS.map(([value, label]) => (
            <Chip key={value} selected={filters.diet === value} onClick={() => set({ diet: filters.diet === value ? null : value })}>
              {label}
            </Chip>
          ))}
          <Chip selected={filters.highProtein} onClick={() => set({ highProtein: !filters.highProtein })}>
            Riche en protéines
          </Chip>
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-2 font-bold">Cuisine du monde</legend>
        <div className="flex flex-wrap gap-2">
          {CUISINES.map((c) => (
            <Chip key={c} selected={filters.cuisine === c} onClick={() => set({ cuisine: filters.cuisine === c ? null : c })}>
              {c}
            </Chip>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

export function RecipeCatalog() {
  const { profile } = useApp();
  const [filters, setFilters] = useState<RecipeFilters>(EMPTY_FILTERS);
  const [sheetOpen, setSheetOpen] = useState(false);
  const set = (patch: Partial<RecipeFilters>) => setFilters((f) => ({ ...f, ...patch }));

  // Sécurité : les recettes incompatibles (allergies, régime, restrictions) ne sont jamais montrées.
  const allowed = useMemo(
    () => (profile ? filterAllowedRecipes(RECIPES, { ...hardConstraintsOf(profile), dislikedIngredients: [] }) : [...RECIPES]),
    [profile],
  );
  const results = useMemo(() => applyRecipeFilters(allowed, filters), [allowed, filters]);
  const hiddenBySafety = RECIPES.length - allowed.length;
  const count = activeFilterCount(filters);

  return (
    <div className="page">
      <header className="mb-5">
        <p className="eyebrow">{RECIPES.length} recettes · {CUISINES.length} cuisines</p>
        <h1 className="text-display-lg">Recettes</h1>
      </header>

      <div className="sticky top-0 z-20 -mx-4 bg-paper/95 px-4 pb-3 pt-2 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <div className="flex gap-2">
          <label className="relative flex-1">
            <span className="sr-only">Rechercher une recette, une cuisine ou un ingrédient</span>
            <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-ink-muted" />
            <input
              type="search"
              value={filters.query}
              onChange={(e) => set({ query: e.target.value })}
              placeholder="Poulet, thaï, lentilles…"
              className="min-h-12 w-full rounded-full border border-line bg-surface pl-12 pr-4 font-semibold outline-none focus:border-ink"
            />
          </label>
          <Button variant="secondary" className="lg:hidden" onClick={() => setSheetOpen(true)} aria-label={`Filtres${count ? ` (${count} actifs)` : ""}`}>
            <SlidersHorizontal aria-hidden className="size-5" />
            {count > 0 && <span className="rounded-full bg-ink px-2 text-xs text-paper">{count}</span>}
          </Button>
        </div>
        <div className="scrollbar-none -mx-4 mt-3 flex gap-2 overflow-x-auto px-4" role="group" aria-label="Type de repas">
          <Chip selected={filters.meal === null} onClick={() => set({ meal: null })}>
            Tous
          </Chip>
          {MEALS.map((m) => (
            <Chip key={m} selected={filters.meal === m} onClick={() => set({ meal: filters.meal === m ? null : m })}>
              {m === "collation" ? "Collations" : `${MEAL_LABELS[m]}s`}
            </Chip>
          ))}
        </div>
      </div>

      <div className="mt-4 lg:grid lg:grid-cols-[16rem_1fr] lg:gap-8">
        <aside className="hidden lg:block" aria-label="Filtres">
          <div className="sticky top-36">
            <FilterPanel filters={filters} set={set} />
            {count > 0 && (
              <Button variant="ghost" className="mt-4" onClick={() => setFilters({ ...EMPTY_FILTERS, query: filters.query })}>
                <X aria-hidden className="size-4" /> Effacer les filtres
              </Button>
            )}
          </div>
        </aside>

        <div>
          <p className="mb-3 text-sm font-semibold text-ink-muted" aria-live="polite">
            {results.length} recette{results.length > 1 ? "s" : ""}
            {hiddenBySafety > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 text-sage-deep">
                <ShieldCheck aria-hidden className="size-4" /> {hiddenBySafety} masquée{hiddenBySafety > 1 ? "s" : ""} selon vos allergies et votre régime
              </span>
            )}
          </p>
          {results.length === 0 ? (
            <EmptyState
              title="Aucune recette ne correspond"
              action={
                <Button variant="secondary" onClick={() => setFilters(EMPTY_FILTERS)}>
                  Réinitialiser la recherche
                </Button>
              }
            >
              Essayez d&apos;élargir vos filtres.
            </EmptyState>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((r) => (
                <li key={r.id} className="flex">
                  <RecipeCard recipe={r} className="w-full" />
                </li>
              ))}
            </ul>
          )}
          <EstimateNote className="mt-6" />
        </div>
      </div>

      <Sheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Filtres"
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => setFilters({ ...EMPTY_FILTERS, query: filters.query, meal: filters.meal })}>
              Effacer
            </Button>
            <Button className="flex-1" onClick={() => setSheetOpen(false)}>
              Voir {results.length} recette{results.length > 1 ? "s" : ""}
            </Button>
          </div>
        }
      >
        <FilterPanel filters={filters} set={set} />
      </Sheet>
    </div>
  );
}
