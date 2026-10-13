"use client";

import { CalendarPlus, Lock, Plus, RefreshCw, TriangleAlert } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { RequireProfile } from "@/components/layout/require-profile";
import { Button } from "@/components/ui/button";
import { EmptyState, EstimateNote } from "@/components/ui/primitives";
import { Sheet } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/toast";
import { MEAL_LABELS, MEAL_ORDER } from "@/lib/domain/labels";
import type { MealPlan, MealType, Profile } from "@/lib/domain/types";
import { findMeal } from "@/lib/planner/planner";
import { dateLabel, dayOfMonth, isPlanExpired, missingSlots, todayIndex, weekdayLabel, weekdayShort } from "@/lib/planner/plan-stats";
import { todayISO, useApp } from "@/lib/state/app-store";
import { cn } from "@/lib/utils/cn";
import { DaySummary } from "./day-summary";
import { MealCard } from "./meal-card";
import { AddMealSheet } from "./meal-sheets";

export function PlanView() {
  return (
    <RequireProfile>
      {({ profile, plan }) => (
        <Suspense>
          <PlanContent profile={profile} plan={plan} />
        </Suspense>
      )}
    </RequireProfile>
  );
}

function PlanContent({ profile, plan }: { profile: Profile; plan: MealPlan | null }) {
  const { createPlan, regeneratePlan, moveMeal, swapMeals } = useApp();
  const { notify } = useToast();
  const params = useSearchParams();
  const today = todayISO();
  const initialDay = Number(params.get("jour") ?? (plan ? Math.max(0, todayIndex(plan, today)) : 0));
  const [selected, setSelected] = useState(Number.isFinite(initialDay) ? initialDay : 0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [addFor, setAddFor] = useState<{ dayIndex: number; slot: MealType } | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);

  if (!plan) {
    return (
      <div className="page">
        <EmptyState
          icon={<CalendarPlus aria-hidden className="size-7" />}
          title="Aucun plan pour l'instant"
          action={
            <Button size="lg" onClick={() => createPlan()}>
              Générer ma semaine
            </Button>
          }
        >
          Générez 7 jours de repas adaptés à votre profil.
        </EmptyState>
      </div>
    );
  }

  const dayIndex = Math.min(selected, plan.days.length - 1);
  const day = plan.days[dayIndex];
  const lockedCount = plan.days.flatMap((d) => d.meals).filter((m) => m.locked).length;
  const expired = isPlanExpired(plan, today);
  const columns: MealType[] = MEAL_ORDER.filter((slot) => profile.meals.includes(slot) || plan.days.some((d) => d.meals.some((m) => m.slot === slot)));

  const handleDropOnMeal = (targetId: string) => {
    if (dragging && dragging !== targetId) {
      swapMeals(dragging, targetId);
      notify("Repas échangés");
    }
    setDragging(null);
  };
  const handleDropOnCell = (toDay: number) => {
    if (dragging) {
      const found = findMeal(plan, dragging);
      if (found && found.dayIndex !== toDay) {
        moveMeal(dragging, toDay);
        notify(`Déplacé à ${weekdayLabel(plan.days[toDay].date).toLowerCase()}`);
      }
    }
    setDragging(null);
  };

  return (
    <div className="page">
      <header className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">
            Du {dateLabel(plan.days[0].date)} au {dateLabel(plan.days[plan.days.length - 1].date)}
          </p>
          <h1 className="text-display-lg">Plan de la semaine</h1>
        </div>
        <div className="flex gap-2">
          {expired && (
            <Button onClick={() => { createPlan(); setSelected(0); notify("Nouvelle semaine générée"); }}>
              <CalendarPlus aria-hidden className="size-5" /> Nouvelle semaine
            </Button>
          )}
          <Button variant={expired ? "secondary" : "primary"} onClick={() => setConfirmOpen(true)}>
            <RefreshCw aria-hidden className="size-5" /> Régénérer
          </Button>
        </div>
      </header>

      <p className="mb-5 text-sm text-ink-muted">
        Astuce : verrouillez <Lock aria-label="cadenas" className="inline size-4 align-text-bottom" /> les repas à conserver avant de régénérer.
        <span className="hidden lg:inline"> Glissez-déposez un repas pour le déplacer ou l&apos;échanger.</span>
      </p>

      {/* Mobile : sélecteur de jour + liste */}
      <div className="lg:hidden">
        <div role="tablist" aria-label="Jours de la semaine" className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
          {plan.days.map((d, i) => {
            const isToday = d.date === today;
            const active = i === dayIndex;
            return (
              <button
                key={d.date}
                role="tab"
                aria-selected={active}
                aria-controls="jour-panneau"
                onClick={() => setSelected(i)}
                className={cn(
                  "flex min-h-[4.5rem] min-w-[3.6rem] shrink-0 flex-col items-center justify-center rounded-2xl border-2 transition",
                  active ? "border-ink bg-ink text-paper" : "border-line bg-surface",
                )}
              >
                <span className={cn("text-xs font-bold capitalize", active ? "text-lime" : "text-ink-muted")}>{weekdayShort(d.date)}</span>
                <span className="font-display text-xl font-extrabold">{dayOfMonth(d.date)}</span>
                {isToday && <span className={cn("mt-0.5 size-1.5 rounded-full", active ? "bg-lime" : "bg-tomato")} aria-label="aujourd'hui" />}
              </button>
            );
          })}
        </div>

        <section id="jour-panneau" role="tabpanel" aria-label={weekdayLabel(day.date)} className="mt-4 space-y-3">
          <h2 className="text-2xl font-extrabold">
            {weekdayLabel(day.date)} {day.date === today && <span className="ml-1 rounded-full bg-tomato px-2 py-0.5 align-middle text-xs font-bold">Aujourd&apos;hui</span>}
          </h2>
          {day.meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} dayIndex={dayIndex} />
          ))}
          <MissingNotice slots={missingSlots(day, profile)} />
          <Button variant="secondary" block onClick={() => setAddFor({ dayIndex, slot: "collation" })}>
            <Plus aria-hidden className="size-5" /> Ajouter une collation
          </Button>
          <DaySummary day={day} profile={profile} />
        </section>
      </div>

      {/* Ordinateur : grille jours × repas, glisser-déposer */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-2">
            <caption className="sr-only">Repas de la semaine par jour et par type de repas</caption>
            <thead>
              <tr>
                <th scope="col" className="w-28" />
                {columns.map((slot) => (
                  <th key={slot} scope="col" className="text-left text-xs font-extrabold uppercase tracking-wider text-ink-muted">
                    {slot === "collation" ? "Collations" : MEAL_LABELS[slot]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {plan.days.map((d, i) => (
                <tr key={d.date}>
                  <th scope="row" className="align-top">
                    <div className={cn("rounded-2xl p-3 text-left", d.date === today ? "bg-ink text-paper" : "bg-surface")}>
                      <p className={cn("text-xs font-bold capitalize", d.date === today ? "text-lime" : "text-ink-muted")}>{weekdayShort(d.date)}</p>
                      <p className="font-display text-2xl font-extrabold">{dayOfMonth(d.date)}</p>
                      <button
                        type="button"
                        onClick={() => setAddFor({ dayIndex: i, slot: "collation" })}
                        className={cn("mt-1 inline-flex min-h-tap items-center gap-1 text-xs font-bold underline-offset-2 hover:underline", d.date === today ? "text-paper" : "text-ink")}
                        aria-label={`Ajouter une collation : ${weekdayLabel(d.date)}`}
                      >
                        <Plus aria-hidden className="size-3.5" /> Collation
                      </button>
                    </div>
                  </th>
                  {columns.map((slot) => {
                    const meals = d.meals.filter((m) => m.slot === slot);
                    return (
                      <td
                        key={slot}
                        className={cn("min-w-[13rem] rounded-3xl align-top", dragging && "bg-ink/[0.04] outline-dashed outline-2 outline-line-strong")}
                        onDragOver={(e) => dragging && e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          handleDropOnCell(i);
                        }}
                      >
                        <div className="space-y-2">
                          {meals.map((meal) => (
                            <MealCard
                              key={meal.id}
                              meal={meal}
                              dayIndex={i}
                              compact
                              draggable
                              onDragStartMeal={setDragging}
                              onDropOnMeal={handleDropOnMeal}
                            />
                          ))}
                          {meals.length === 0 && (
                            <button
                              type="button"
                              onClick={() => setAddFor({ dayIndex: i, slot })}
                              className="flex min-h-24 w-full items-center justify-center gap-1 rounded-3xl border-2 border-dashed border-line-strong text-sm font-bold text-ink-muted hover:border-ink hover:text-ink"
                            >
                              <Plus aria-hidden className="size-4" /> Ajouter
                            </button>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          <div>
            <label htmlFor="jour-resume" className="mb-2 block text-sm font-bold">Résumé nutritionnel du jour</label>
            <select
              id="jour-resume"
              value={dayIndex}
              onChange={(e) => setSelected(Number(e.target.value))}
              className="mb-3 min-h-tap rounded-full border-2 border-ink bg-surface px-4 font-bold"
            >
              {plan.days.map((d, i) => (
                <option key={d.date} value={i}>
                  {weekdayLabel(d.date)} {dateLabel(d.date)}
                </option>
              ))}
            </select>
            <DaySummary day={day} profile={profile} />
          </div>
        </div>
      </div>

      <EstimateNote className="mt-6" />

      <Sheet
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Régénérer la semaine ?"
        description={
          lockedCount > 0
            ? `${lockedCount} repas verrouillé${lockedCount > 1 ? "s" : ""} ser${lockedCount > 1 ? "ont" : "a"} conservé${lockedCount > 1 ? "s" : ""}. Tous les autres seront remplacés.`
            : "Aucun repas n'est verrouillé : tous les repas seront remplacés."
        }
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => setConfirmOpen(false)}>
              Annuler
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                regeneratePlan();
                setConfirmOpen(false);
                notify("Nouveau menu généré");
              }}
            >
              Régénérer
            </Button>
          </div>
        }
      >
        <p className="text-ink-soft">Vos allergies et préférences sont toujours respectées. Les cases cochées de votre liste d&apos;épicerie sont conservées.</p>
      </Sheet>

      {addFor && <AddMealSheet open onClose={() => setAddFor(null)} dayIndex={addFor.dayIndex} slot={addFor.slot} />}
    </div>
  );
}

function MissingNotice({ slots }: { slots: string[] }) {
  if (slots.length === 0) return null;
  return (
    <p className="flex items-start gap-2 rounded-2xl bg-sun-soft p-3 text-sm font-semibold">
      <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
      Aucune recette compatible avec votre profil pour : {slots.map((s) => MEAL_LABELS[s as MealType].toLowerCase()).join(", ")}.
    </p>
  );
}
