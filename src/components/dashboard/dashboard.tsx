"use client";

import { ArrowRight, BookOpen, CalendarPlus, Check, ChefHat, Crown, Dumbbell, PartyPopper, ShoppingBasket, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CollectionRail } from "@/components/recipe/recipe-catalog";
import { planOffer } from "@/lib/subscriptions";
import { Suspense } from "react";
import { RequireProfile } from "@/components/layout/require-profile";
import { TargetRing } from "@/components/recipe/nutrition";
import { RecipeImage } from "@/components/recipe/recipe-image";
import { formatMinutes } from "@/components/recipe/recipe-meta";
import { Button, ButtonLink } from "@/components/ui/button";
import { EstimateNote, ProgressBar } from "@/components/ui/primitives";
import { useToast } from "@/components/ui/toast";
import { RECIPE_MAP } from "@/lib/data/recipes";
import { GOAL_LABELS, MEAL_LABELS } from "@/lib/domain/labels";
import type { MealPlan, Profile } from "@/lib/domain/types";
import { roundNutrition } from "@/lib/nutrition/nutrition";
import { formatAmount } from "@/lib/nutrition/portions";
import {
  dayNutritionPerPerson,
  dayOfMonth,
  isPlanExpired,
  nextMeal,
  planProgress,
  todayIndex,
  weekdayLabel,
  weekdayShort,
} from "@/lib/planner/plan-stats";
import { totalMinutes } from "@/lib/recipes/analysis";
import { todayISO, useApp } from "@/lib/state/app-store";
import { cn } from "@/lib/utils/cn";

export function Dashboard() {
  return (
    <RequireProfile>
      {({ profile, plan }) => (
        <Suspense>
          <DashboardContent profile={profile} plan={plan} />
        </Suspense>
      )}
    </RequireProfile>
  );
}

const longDate = new Intl.DateTimeFormat("fr-CA", { weekday: "long", day: "numeric", month: "long" });

function DashboardContent({ profile, plan }: { profile: Profile; plan: MealPlan | null }) {
  const { createPlan, toggleDone, groceryLines, groceryState } = useApp();
  const { notify } = useToast();
  const router = useRouter();
  const params = useSearchParams();
  const today = todayISO();
  const welcome = params.get("bienvenue") === "1";

  const remaining = groceryLines.filter((l) => !groceryState.checked[l.key] && !groceryState.pantry[l.key]).length;

  if (!plan) {
    return (
      <div className="page">
        <h1 className="text-display-lg">Bonjour{profile.name ? `, ${profile.name}` : ""}.</h1>
        <Button size="lg" className="mt-6" onClick={() => createPlan()}>
          <CalendarPlus aria-hidden className="size-5" /> Générer ma semaine
        </Button>
      </div>
    );
  }

  const tIndex = todayIndex(plan, today);
  const expired = isPlanExpired(plan, today);
  const todayDay = tIndex >= 0 ? plan.days[tIndex] : plan.days[0];
  const next = nextMeal(plan, today);
  const nextRecipe = next ? RECIPE_MAP[next.meal.recipeId] : null;
  const progress = planProgress(plan);
  const n = roundNutrition(dayNutritionPerPerson(todayDay, profile.portionFactor));

  return (
    <div className="page space-y-6">
      {/* En-tête */}
      <header className="animate-slide-up">
        <p className="eyebrow capitalize">{longDate.format(new Date())}</p>
        <h1 className="mt-1 text-display-lg">
          Bonjour{profile.name ? `, ${profile.name}` : ""}<span className="text-terra">.</span>
        </h1>
        <p className="mt-2 text-lg text-ink-soft">
          Objectif : <span className="font-bold text-ink">{GOAL_LABELS[profile.goal].toLowerCase()}</span> · {profile.householdSize}{" "}
          {profile.householdSize > 1 ? "personnes" : "personne"}
          {(profile.childrenCount ?? 0) > 0 && <> dont {profile.childrenCount} enfant{(profile.childrenCount ?? 0) > 1 ? "s" : ""}</>}
        </p>
        <Link
          href="/abonnements"
          className="mt-3 inline-flex min-h-tap items-center gap-2 rounded-full border border-gold/70 bg-gold-soft px-4 text-sm font-semibold text-gold-deep transition hover:bg-gold hover:text-ink"
        >
          <Crown aria-hidden className="size-4" />
          {planOffer(profile.subscription) ? `Formule ${planOffer(profile.subscription)!.name}` : "Choisir une formule"}
        </Link>
      </header>

      {profile.isDemo && (
        <div className="flex flex-col gap-3 rounded-card border border-gold bg-gold-soft p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold">
            <Sparkles aria-hidden className="mr-1 inline size-5" /> Vous explorez un profil de démonstration (famille de 4).
          </p>
          <ButtonLink href="/questionnaire" variant="dark" size="sm">
            Créer mon profil
          </ButtonLink>
        </div>
      )}
      {welcome && !profile.isDemo && (
        <div className="flex items-center gap-3 rounded-card border border-gold bg-gold-soft p-4 font-semibold">
          <PartyPopper aria-hidden className="size-6 shrink-0" /> Votre plan de 7 jours est prêt. Bon appétit !
        </div>
      )}
      {expired && (
        <div className="flex flex-col gap-3 rounded-card bg-plum p-4 text-paper sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold">Votre semaine de repas est terminée. On en prépare une nouvelle ?</p>
          <Button size="sm" onClick={() => { createPlan(); notify("Nouvelle semaine générée"); }}>
            Nouvelle semaine
          </Button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Prochain repas */}
        <section aria-labelledby="prochain" className="overflow-hidden rounded-card bg-ink text-paper">
          {next && nextRecipe ? (
            <div className="grid sm:grid-cols-[1fr_1.1fr]">
              <RecipeImage recipe={nextRecipe} className="aspect-[4/3] sm:aspect-auto sm:min-h-full" priority />
              <div className="flex flex-col gap-4 p-5">
                <div>
                  <p id="prochain" className="text-xs font-bold uppercase tracking-[0.14em] text-gold">
                    Prochain repas à préparer
                  </p>
                  <p className="mt-1 text-sm font-semibold text-paper/80">
                    {MEAL_LABELS[next.meal.slot]} · {plan.days[next.dayIndex].date === today ? "aujourd'hui" : weekdayLabel(plan.days[next.dayIndex].date)}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold leading-tight">{nextRecipe.name}</h2>
                  <p className="mt-2 text-sm font-semibold text-paper/80">
                    {formatMinutes(totalMinutes(nextRecipe))} · {formatAmount(next.meal.servings)} portions
                  </p>
                </div>
                <div className="mt-auto flex flex-col gap-2">
                  <ButtonLink href={`/cuisine/${nextRecipe.id}?portions=${next.meal.servings}&repas=${next.meal.id}`} size="lg" variant="gold">
                    <ChefHat aria-hidden className="size-5" /> Cuisine guidée
                  </ButtonLink>
                  <div className="flex gap-2">
                    <ButtonLink href={`/recettes/${nextRecipe.id}?portions=${next.meal.servings}`} variant="ghost" className="flex-1 text-paper hover:bg-paper/10">
                      Voir la recette
                    </ButtonLink>
                    <Button
                      variant="ghost"
                      className="flex-1 text-paper hover:bg-paper/10"
                      onClick={() => {
                        toggleDone(next.meal.id);
                        notify("Bravo, repas préparé !");
                      }}
                    >
                      <Check aria-hidden className="size-5" /> Préparé
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <p id="prochain" className="text-xs font-bold uppercase tracking-[0.14em] text-gold">Prochain repas</p>
              <h2 className="mt-2 text-2xl font-semibold">Tous les repas sont préparés. Chapeau !</h2>
            </div>
          )}
        </section>

        {/* Objectifs du jour */}
        <section aria-labelledby="objectifs" className="card p-5">
          <div className="flex items-baseline justify-between">
            <h2 id="objectifs" className="text-xl font-semibold">
              Objectifs {tIndex >= 0 ? "du jour" : "— jour 1"}
            </h2>
            <Link href="/en-forme" className="inline-flex min-h-tap items-center text-sm font-bold underline-offset-4 hover:underline">
              Ajuster
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-2 justify-items-center gap-4 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <TargetRing value={n.kcal} target={profile.targets.kcal} label="Calories" unit="kcal" color="#B4643E" />
            <TargetRing value={n.protein} target={profile.targets.protein} label="Protéines" unit="g" color="#5C3A5A" />
            <TargetRing value={n.carbs} target={profile.targets.carbs} label="Glucides" unit="g" color="#48677F" />
            <TargetRing value={n.fat} target={profile.targets.fat} label="Lipides" unit="g" color="#D6A445" />
          </div>
          <EstimateNote className="mt-4" />
        </section>
      </div>

      {/* Repas du jour */}
      <section aria-labelledby="repas-jour">
        <div className="mb-3 flex items-end justify-between">
          <h2 id="repas-jour" className="text-2xl font-semibold">
            {tIndex >= 0 ? "Au menu aujourd'hui" : `Au menu ${weekdayLabel(todayDay.date).toLowerCase()}`}
          </h2>
          <Link href={`/plan?jour=${Math.max(0, tIndex)}`} className="inline-flex min-h-tap items-center gap-1 text-sm font-bold hover:underline">
            Modifier <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {todayDay.meals.map((meal) => {
            const r = RECIPE_MAP[meal.recipeId];
            if (!r) return null;
            return (
              <li key={meal.id} className={cn("card flex items-center gap-3 p-3", meal.done && "bg-sage-soft")}>
                <Link href={`/recettes/${r.id}?portions=${meal.servings}`} className="flex min-w-0 flex-1 items-center gap-3">
                  <RecipeImage recipe={r} variant="thumb" className="size-16 shrink-0 rounded-2xl" />
                  <span className="min-w-0">
                    <span className="block text-[0.7rem] font-semibold uppercase tracking-wider text-ink-muted">{MEAL_LABELS[meal.slot]}</span>
                    <span className={cn("line-clamp-2 font-bold leading-snug", meal.done && "line-through decoration-2")}>{r.name}</span>
                  </span>
                </Link>
                <button
                  type="button"
                  aria-pressed={meal.done}
                  aria-label={meal.done ? `Marquer ${r.name} comme non préparé` : `Marquer ${r.name} comme préparé`}
                  onClick={() => toggleDone(meal.id)}
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-full border transition",
                    meal.done ? "animate-check-pop border-sage-deep bg-sage text-ink" : "border-line-strong hover:border-ink",
                  )}
                >
                  {meal.done && <Check aria-hidden className="size-5" />}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Collections */}
      <section aria-labelledby="explorer">
        <div className="mb-3 flex items-end justify-between">
          <h2 id="explorer" className="text-2xl font-semibold">Explorer les collections</h2>
          <Link href="/recettes" className="inline-flex min-h-tap items-center gap-1 text-sm font-bold hover:underline">
            Toutes les recettes <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
        <CollectionRail active={null} onSelect={(key) => router.push(key ? `/recettes?collection=${key}` : "/recettes")} />
      </section>

      {/* Semaine + avancement */}
      <section aria-labelledby="semaine" className="card p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="semaine" className="text-2xl font-semibold">Votre semaine</h2>
          <p className="text-sm font-bold">
            <span className="font-display text-2xl font-semibold">{progress.done}</span>
            <span className="text-ink-muted"> / {progress.total} repas préparés</span>
          </p>
        </div>
        <ProgressBar className="mt-3" value={progress.done} max={progress.total} label="Avancement de la préparation des repas" />
        <ol className="mt-5 grid grid-cols-7 gap-1.5 sm:gap-3">
          {plan.days.map((d, i) => {
            const done = d.meals.filter((m) => m.done).length;
            const isToday = d.date === today;
            return (
              <li key={d.date}>
                <Link
                  href={`/plan?jour=${i}`}
                  aria-label={`${weekdayLabel(d.date)} : ${d.meals.length} repas, ${done} préparés`}
                  className={cn(
                    "flex min-h-24 flex-col items-center justify-between rounded-2xl border px-1 py-2 transition hover:border-ink",
                    isToday ? "border-ink bg-ink text-paper [&_span]:text-gold-light" : "border-line bg-paper",
                  )}
                >
                  <span className="text-[0.7rem] font-bold capitalize text-ink-soft">{weekdayShort(d.date)}</span>
                  <span className="font-display text-xl font-semibold">{dayOfMonth(d.date)}</span>
                  <span className="flex flex-wrap justify-center gap-0.5" aria-hidden>
                    {d.meals.map((m) => (
                      <span key={m.id} className={cn("size-1.5 rounded-full", m.done ? "bg-sage-deep" : "bg-ink/25")} />
                    ))}
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Accès rapides */}
      <nav aria-label="Accès rapides" className="grid gap-3 sm:grid-cols-3">
        <Link href="/epicerie" className="group flex min-h-28 flex-col justify-between rounded-card border border-gold bg-gold-soft p-5 transition hover:-translate-y-0.5">
          <ShoppingBasket aria-hidden className="size-7" />
          <span>
            <span className="block text-xl font-semibold">Liste d&apos;épicerie</span>
            <span className="text-sm font-semibold">{remaining} article{remaining > 1 ? "s" : ""} à acheter</span>
          </span>
        </Link>
        <Link href="/recettes" className="group flex min-h-28 flex-col justify-between rounded-card bg-ink p-5 text-paper transition hover:-translate-y-0.5">
          <BookOpen aria-hidden className="size-7 text-gold-light" />
          <span>
            <span className="block text-xl font-semibold">Recettes</span>
            <span className="text-sm font-semibold">Explorer le catalogue</span>
          </span>
        </Link>
        <Link href="/en-forme" className="group flex min-h-28 flex-col justify-between rounded-card bg-plum p-5 text-paper transition hover:-translate-y-0.5">
          <Dumbbell aria-hidden className="size-7" />
          <span>
            <span className="block text-xl font-semibold">En forme</span>
            <span className="text-sm font-semibold text-paper/85">Protéines, macros et entraînement</span>
          </span>
        </Link>
      </nav>
    </div>
  );
}
