"use client";

import { Calculator, Dumbbell, Flame, Moon, Sunrise, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import { RequireProfile } from "@/components/layout/require-profile";
import { TargetRing } from "@/components/recipe/nutrition";
import { RecipeCard } from "@/components/recipe/recipe-card";
import { Button } from "@/components/ui/button";
import { Chip, EstimateNote } from "@/components/ui/primitives";
import { ServingsStepper } from "@/components/ui/stepper";
import { useToast } from "@/components/ui/toast";
import { RECIPES } from "@/lib/data/recipes";
import type { MealPlan, NutritionTargets, Profile, RecipeTag } from "@/lib/domain/types";
import { defaultTargets, isHighProtein, nutritionPerServing, proteinRange, roundNutrition } from "@/lib/nutrition/nutrition";
import { defaultServings, hardConstraintsOf } from "@/lib/planner/planner";
import { dayNutritionPerPerson, todayIndex } from "@/lib/planner/plan-stats";
import { filterAllowedRecipes } from "@/lib/recipes/analysis";
import { type ActivityLevel, todayISO, useApp } from "@/lib/state/app-store";

const ACTIVITIES: Array<[ActivityLevel, string]> = [
  ["sedentaire", "Peu actif"],
  ["actif", "Actif"],
  ["endurance", "Course / endurance"],
  ["musculation", "Musculation"],
];

export function FitnessView() {
  return <RequireProfile>{({ profile, plan }) => <FitnessContent profile={profile} plan={plan} />}</RequireProfile>;
}

function TargetField({ label, unit, value, onChange }: { label: string; unit: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block rounded-2xl bg-paper px-4 py-3 focus-within:ring-2 focus-within:ring-ink">
      <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">{label}</span>
      <span className="mt-1 flex items-baseline gap-1">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={value}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
          className="w-full bg-transparent font-display text-2xl font-semibold tabular-nums outline-none"
        />
        <span className="font-bold text-ink-muted">{unit}</span>
      </span>
    </label>
  );
}

function FitnessContent({ profile, plan }: { profile: Profile; plan: MealPlan | null }) {
  const { fitness, setFitness, updateProfile, applyDefaultServings } = useApp();
  const { notify } = useToast();
  const [targets, setTargets] = useState<NutritionTargets>(profile.targets);
  const dirty = JSON.stringify(targets) !== JSON.stringify(profile.targets);

  const allowed = useMemo(() => filterAllowedRecipes(RECIPES, hardConstraintsOf(profile)), [profile]);
  const highProtein = useMemo(
    () => allowed.filter(isHighProtein).sort((a, b) => nutritionPerServing(b).protein - nutritionPerServing(a).protein),
    [allowed],
  );
  const byTag = (tag: RecipeTag) => allowed.filter((r) => r.tags.includes(tag));
  const range = fitness.weightKg ? proteinRange(fitness.weightKg, fitness.activity) : null;

  const day = plan ? plan.days[Math.max(0, todayIndex(plan, todayISO()))] : null;
  const n = day ? roundNutrition(dayNutritionPerPerson(day, profile.portionFactor)) : null;

  return (
    <div className="page space-y-8">
      <header className="overflow-hidden rounded-card bg-ink p-6 text-paper sm:p-8">
        <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-gold">
          <Dumbbell aria-hidden className="size-4" /> En forme
        </p>
        <h1 className="mt-2 max-w-2xl text-display-lg">Nourrir vos entraînements.</h1>
        <p className="mt-3 max-w-2xl text-lg text-paper/80">
          Objectifs de macros, portions adaptées et idées de repas avant et après l&apos;effort — pour la salle comme pour la course.
        </p>
        {n && (
          <div className="mt-6 flex flex-wrap gap-6 rounded-3xl bg-paper p-4 text-ink">
            <TargetRing value={n.kcal} target={profile.targets.kcal} label="Calories" unit="kcal" color="#B4643E" size={88} />
            <TargetRing value={n.protein} target={profile.targets.protein} label="Protéines" unit="g" color="#5C3A5A" size={88} />
            <TargetRing value={n.carbs} target={profile.targets.carbs} label="Glucides" unit="g" color="#48677F" size={88} />
            <TargetRing value={n.fat} target={profile.targets.fat} label="Lipides" unit="g" color="#D6A445" size={88} />
            <p className="self-center text-sm font-semibold text-ink-muted">Aujourd&apos;hui, d&apos;après votre plan*</p>
          </div>
        )}
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Objectifs personnalisables */}
        <section aria-labelledby="objectifs" className="card p-5">
          <h2 id="objectifs" className="flex items-center gap-2 text-xl font-semibold">
            <Flame aria-hidden className="size-5 text-terra" /> Mes objectifs quotidiens
          </h2>
          <form
            className="mt-4"
            onSubmit={(e) => {
              e.preventDefault();
              updateProfile({ targets });
              notify("Objectifs enregistrés");
            }}
          >
            <div className="grid grid-cols-2 gap-3">
              <TargetField label="Calories" unit="kcal" value={targets.kcal} onChange={(kcal) => setTargets((t) => ({ ...t, kcal }))} />
              <TargetField label="Protéines" unit="g" value={targets.protein} onChange={(protein) => setTargets((t) => ({ ...t, protein }))} />
              <TargetField label="Glucides" unit="g" value={targets.carbs} onChange={(carbs) => setTargets((t) => ({ ...t, carbs }))} />
              <TargetField label="Lipides" unit="g" value={targets.fat} onChange={(fat) => setTargets((t) => ({ ...t, fat }))} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="submit" disabled={!dirty}>
                Enregistrer
              </Button>
              <Button type="button" variant="ghost" onClick={() => setTargets(defaultTargets(profile.goal))}>
                Valeurs par défaut de mon objectif
              </Button>
            </div>
          </form>
        </section>

        {/* Calculateur de protéines + portions */}
        <section aria-labelledby="calcul" className="card space-y-5 p-5">
          <div>
            <h2 id="calcul" className="flex items-center gap-2 text-xl font-semibold">
              <Calculator aria-hidden className="size-5 text-plum" /> Besoin en protéines
            </h2>
            <div className="mt-4 flex flex-wrap items-end gap-3">
              <label className="block">
                <span className="text-sm font-bold">Poids</span>
                <span className="mt-1 flex min-h-12 items-center gap-1 rounded-2xl border border-line bg-paper px-4 focus-within:border-ink">
                  <input
                    type="number"
                    inputMode="decimal"
                    min={30}
                    max={250}
                    value={fitness.weightKg ?? ""}
                    onChange={(e) => setFitness({ weightKg: e.target.value ? Number(e.target.value) : null })}
                    placeholder="70"
                    className="w-20 bg-transparent font-display text-xl font-semibold outline-none"
                  />
                  <span className="font-bold text-ink-muted">kg</span>
                </span>
              </label>
            </div>
            <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Niveau d'activité">
              {ACTIVITIES.map(([value, label]) => (
                <Chip key={value} selected={fitness.activity === value} onClick={() => setFitness({ activity: value })}>
                  {label}
                </Chip>
              ))}
            </div>
            {range ? (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-plum-soft p-4">
                <p>
                  Repère général : <span className="font-display text-2xl font-semibold">{range[0]}–{range[1]} g</span> de protéines par jour.
                </p>
                <Button
                  variant="dark"
                  size="sm"
                  onClick={() => {
                    const protein = Math.round((range[0] + range[1]) / 2);
                    setTargets((t) => ({ ...t, protein }));
                    updateProfile({ targets: { ...targets, protein } });
                    notify(`Objectif de protéines : ${protein} g`);
                  }}
                >
                  Appliquer
                </Button>
              </div>
            ) : (
              <p className="mt-3 text-sm text-ink-muted">Entrez votre poids pour obtenir un repère (0,8 à 2,0 g/kg selon l&apos;activité).</p>
            )}
          </div>

          <div className="border-t border-line pt-5">
            <h3 className="text-lg font-semibold">Mes portions</h3>
            <p className="mt-1 text-sm text-ink-muted">
              Mangez-vous plus (ou moins) qu&apos;une portion standard ? Ce facteur s&apos;applique à votre part dans chaque repas.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <ServingsStepper value={profile.portionFactor} onChange={(v) => updateProfile({ portionFactor: Math.min(3, v) })} label="Mes portions" />
              {plan && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    applyDefaultServings();
                    notify(`Plan ajusté à ${String(defaultServings(profile)).replace(".", ",")} portions par repas`);
                  }}
                >
                  Appliquer au plan ({String(defaultServings(profile)).replace(".", ",")} port./repas)
                </Button>
              )}
            </div>
          </div>
        </section>
      </div>

      <EstimateNote />

      {/* Avant / après */}
      <section aria-labelledby="timing" className="grid gap-4 md:grid-cols-2">
        <h2 id="timing" className="sr-only">Avant et après l&apos;entraînement</h2>
        <div className="rounded-card bg-amber-soft p-5">
          <h3 className="flex items-center gap-2 text-xl font-semibold">
            <Sunrise aria-hidden className="size-5" /> Avant l&apos;entraînement
          </h3>
          <p className="mt-2 text-ink-soft">1 à 3 h avant : des glucides faciles à digérer, un peu de protéines, peu de gras et de fibres.</p>
          <ul className="mt-4 grid gap-3">
            {byTag("pre-entrainement").map((r) => (
              <li key={r.id}>
                <RecipeCard recipe={r} />
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-card bg-plum-soft p-5">
          <h3 className="flex items-center gap-2 text-xl font-semibold">
            <Moon aria-hidden className="size-5" /> Après l&apos;entraînement
          </h3>
          <p className="mt-2 text-ink-soft">Dans les heures qui suivent : protéines de qualité et glucides pour récupérer.</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {byTag("post-entrainement").slice(0, 4).map((r) => (
              <li key={r.id} className="flex">
                <RecipeCard recipe={r} className="w-full" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="proteines">
        <h2 id="proteines" className="flex items-center gap-2 text-2xl font-semibold">
          <Zap aria-hidden className="size-6 text-plum" /> Repas riches en protéines
        </h2>
        <p className="mt-1 text-ink-muted">Compatibles avec votre profil, du plus protéiné au moins protéiné.</p>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {highProtein.map((r) => (
            <li key={r.id} className="flex">
              <RecipeCard recipe={r} className="w-full" />
            </li>
          ))}
        </ul>
      </section>

      <p className="text-sm text-ink-muted">
        * Calculé pour 1 portion de chaque repas{profile.portionFactor !== 1 ? ` × ${String(profile.portionFactor).replace(".", ",")}` : ""}.
        Ces repères sont généraux et ne constituent pas un avis médical ou diététique.
      </p>
    </div>
  );
}
