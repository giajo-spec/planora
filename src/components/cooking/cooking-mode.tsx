"use client";

import {
  ArrowLeft,
  ArrowRight,
  BellRing,
  Check,
  ChevronDown,
  Clock,
  GraduationCap,
  Lightbulb,
  MessageCircleQuestion,
  Pause,
  Play,
  Sun,
  Timer,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FirstTimeGuide } from "@/components/recipe/first-time-guide";
import { formatMinutes } from "@/components/recipe/recipe-meta";
import { Button, IconButton } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/primitives";
import { Sheet } from "@/components/ui/sheet";
import { ServingsStepper } from "@/components/ui/stepper";
import { cookingAssistant, type AssistantAnswer } from "@/lib/ai/cooking-assistant";
import { INGREDIENTS } from "@/lib/data/ingredients";
import { getRecipe } from "@/lib/data/recipes";
import type { Recipe } from "@/lib/domain/types";
import { formatIngredientLine, scaleFactor } from "@/lib/nutrition/portions";
import { findMeal } from "@/lib/planner/planner";
import { formatClock, remainingOf, useTimers } from "@/lib/hooks/use-timers";
import { useWakeLock } from "@/lib/hooks/use-wake-lock";
import { useApp } from "@/lib/state/app-store";
import { cn } from "@/lib/utils/cn";

/** Ligne d'ingrédient pour une étape, en tenant compte de la part utilisée. */
function stepIngredients(recipe: Recipe, stepIndex: number, factor: number) {
  return (recipe.steps[stepIndex]?.uses ?? []).map((use) => {
    const ri = recipe.ingredients[use.index];
    const line = formatIngredientLine(ri, INGREDIENTS[ri.ingredientId], factor * (use.part ?? 1));
    return { ...line, partial: use.part != null && use.part < 1 };
  });
}

export function CookingMode({ recipeId }: { recipeId: string }) {
  const recipe = getRecipe(recipeId)!;
  const params = useSearchParams();
  const router = useRouter();
  const { plan, toggleDone } = useApp();
  const mealId = params.get("repas");
  const fromQuery = Number(params.get("portions"));
  const [servings, setServings] = useState(fromQuery > 0 ? fromQuery : recipe.servings);
  // -1 = mise en place, steps.length = terminé
  const [step, setStep] = useState(-1);
  const [checkedPrep, setCheckedPrep] = useState<Record<number, boolean>>({});
  const [guideOpen, setGuideOpen] = useState(false);
  const [timersOpen, setTimersOpen] = useState(false);
  const { timers, now, start, pause, resume, addTime, remove } = useTimers();
  const wakeLock = useWakeLock(true);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const factor = scaleFactor(recipe.servings, servings);
  const total = recipe.steps.length;
  const isPrep = step === -1;
  const isDone = step >= total;
  const current = !isPrep && !isDone ? recipe.steps[step] : null;
  const ringing = timers.filter((t) => t.finished && !t.acknowledged);
  const plannedMeal = plan && mealId ? findMeal(plan, mealId)?.meal : undefined;

  const go = useCallback((delta: number) => setStep((s) => Math.min(total, Math.max(-1, s + delta))), [total]);

  useEffect(() => {
    headingRef.current?.focus();
    window.scrollTo({ top: 0 });
  }, [step]);

  // Navigation au clavier : flèches gauche/droite.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("input, textarea, dialog")) return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const allPrep = recipe.ingredients.map((ri) => formatIngredientLine(ri, INGREDIENTS[ri.ingredientId], factor));

  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      {/* Barre supérieure */}
      <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-2">
          <Link
            href={`/recettes/${recipe.id}?portions=${servings}`}
            aria-label="Quitter la cuisine guidée"
            className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line bg-surface hover:border-ink"
          >
            <X aria-hidden className="size-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">{recipe.name}</p>
            <ProgressBar className="mt-1 h-2" value={Math.max(0, Math.min(step + 1, total))} max={total} label="Progression de la recette" />
          </div>
          <Button variant="secondary" size="sm" onClick={() => setGuideOpen(true)} className="shrink-0">
            <GraduationCap aria-hidden className="size-4" />
            <span className="hidden sm:inline">Je n&apos;ai jamais cuisiné ça</span>
            <span className="sm:hidden">Débutant</span>
          </Button>
        </div>
      </header>

      {/* Minuteries actives */}
      {timers.length > 0 && (
        <div className={cn("sticky top-[3.75rem] z-20 border-b border-line", ringing.length ? "bg-terra text-paper" : "bg-ink text-paper")}>
          <div className="mx-auto max-w-3xl px-4 py-2">
            <button
              type="button"
              aria-expanded={timersOpen}
              onClick={() => setTimersOpen((v) => !v)}
              className="flex min-h-tap w-full items-center gap-2 text-left font-bold"
            >
              {ringing.length ? <BellRing aria-hidden className="size-5 animate-wiggle" /> : <Timer aria-hidden className="size-5 text-gold" />}
              <span className="flex-1 truncate" aria-live="polite">
                {ringing.length
                  ? `Terminé : ${ringing.map((t) => t.label).join(", ")}`
                  : timers
                      .slice(0, 2)
                      .map((t) => `${t.label} ${formatClock(remainingOf(t, now))}`)
                      .join(" · ")}
                {timers.length > 2 && !ringing.length && ` · +${timers.length - 2}`}
              </span>
              <ChevronDown aria-hidden className={cn("size-5 transition", timersOpen && "rotate-180")} />
            </button>
            {(timersOpen || ringing.length > 0) && (
              <ul className="mt-1 space-y-2 pb-2">
                {timers.map((t) => {
                  const remaining = remainingOf(t, now);
                  const paused = t.endsAt == null && !t.finished;
                  return (
                    <li
                      key={t.id}
                      className={cn(
                        "flex items-center gap-2 rounded-2xl bg-surface p-2 pl-4 text-ink",
                        t.finished && !t.acknowledged && "animate-ring-alert",
                      )}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold">{t.label}</span>
                        <span className="font-display text-2xl font-semibold tabular-nums">{t.finished ? "Terminé !" : formatClock(remaining)}</span>
                      </span>
                      {!t.finished && (
                        <IconButton label={paused ? `Reprendre ${t.label}` : `Mettre en pause ${t.label}`} onClick={() => (paused ? resume(t.id) : pause(t.id))}>
                          {paused ? <Play aria-hidden className="size-5" /> : <Pause aria-hidden className="size-5" />}
                        </IconButton>
                      )}
                      <IconButton label={`Ajouter 1 minute à ${t.label}`} onClick={() => addTime(t.id, 60)}>
                        <span className="text-xs font-semibold">+1</span>
                      </IconButton>
                      <IconButton label={t.finished ? `Arrêter l'alarme ${t.label}` : `Supprimer ${t.label}`} tone={t.finished ? "dark" : "light"} onClick={() => remove(t.id)}>
                        {t.finished ? <Check aria-hidden className="size-5" /> : <X aria-hidden className="size-5" />}
                      </IconButton>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-44 pt-6">
        {isPrep && (
          <section aria-labelledby="mise-en-place" className="animate-slide-up">
            <p className="eyebrow">Avant de commencer</p>
            <h1 id="mise-en-place" ref={headingRef} tabIndex={-1} className="mt-1 text-display-lg outline-none">
              Mise en place
            </h1>
            <p className="mt-3 text-lg text-ink-soft">
              Sortez et mesurez tout avant d&apos;allumer le feu. Cochez au fur et à mesure.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <ServingsStepper value={servings} onChange={setServings} size="lg" />
              <p className="flex items-center gap-1.5 font-semibold text-ink-muted">
                <Clock aria-hidden className="size-4" /> {formatMinutes(recipe.prepMinutes + recipe.cookMinutes)} au total
              </p>
            </div>
            <ul className="mt-6 space-y-2">
              {allPrep.map((l, i) => (
                <li key={l.ingredientId}>
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={!!checkedPrep[i]}
                    onClick={() => setCheckedPrep((c) => ({ ...c, [i]: !c[i] }))}
                    className={cn(
                      "flex min-h-16 w-full items-center gap-4 rounded-2xl border px-4 py-3 text-left text-lg transition",
                      checkedPrep[i] ? "border-sage-deep bg-sage-soft" : "border-line bg-surface hover:border-ink",
                    )}
                  >
                    <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg border", checkedPrep[i] ? "animate-check-pop border-sage-deep bg-sage" : "border-ink")}>
                      {checkedPrep[i] && <Check aria-hidden className="size-5" />}
                    </span>
                    <span className={cn(checkedPrep[i] && "line-through decoration-2 opacity-70")}>
                      <span className="font-display font-semibold">{l.quantityText}</span> {l.name}
                      {l.note && <span className="text-ink-muted">, {l.note}</span>}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-6 flex items-center gap-2 text-sm text-ink-muted">
              <Sun aria-hidden className="size-4" />
              {wakeLock ? "L'écran restera allumé pendant la cuisine." : "Astuce : gardez l'écran allumé dans les réglages si votre appareil se met en veille."}
            </p>
          </section>
        )}

        {current && (
          <section key={step} aria-labelledby="etape-titre" className="animate-slide-up">
            <p className="eyebrow">
              Étape {step + 1} sur {total}
              {current.minutes != null && (
                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-soft px-2 py-0.5 normal-case tracking-normal text-amber-deep">
                  <Clock aria-hidden className="size-3" /> environ {formatMinutes(current.minutes)}
                </span>
              )}
            </p>
            <h1 id="etape-titre" ref={headingRef} tabIndex={-1} className="sr-only outline-none">
              Étape {step + 1}
            </h1>
            <p className="mt-3 text-cook-step outline-none">{current.text}</p>

            {stepIngredients(recipe, step, factor).length > 0 && (
              <div className="mt-6">
                <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-ink-muted">Pour cette étape</h2>
                <ul className="flex flex-wrap gap-2">
                  {stepIngredients(recipe, step, factor).map((l) => (
                    <li key={l.ingredientId} className="rounded-2xl border border-ink bg-surface px-3 py-2 text-lg">
                      <span className="font-display font-semibold">{l.quantityText}</span> {l.name}
                      {l.partial && <span className="text-sm text-ink-muted"> (une partie)</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {current.timers && current.timers.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {current.timers.map((t) => (
                  <Button key={t.label} variant="gold" size="lg" onClick={() => start(t.label, t.seconds)}>
                    <Timer aria-hidden className="size-5" /> {t.label} · {formatClock(t.seconds * 1000)}
                  </Button>
                ))}
              </div>
            )}

            {current.tip && (
              <aside className="mt-6 flex gap-3 rounded-3xl bg-gold-soft p-4">
                <Lightbulb aria-hidden className="mt-0.5 size-6 shrink-0" />
                <p className="text-lg leading-snug">
                  <span className="font-semibold">Conseil débutant : </span>
                  {current.tip}
                </p>
              </aside>
            )}

            <StepQuestions recipe={recipe} stepIndex={step} />
          </section>
        )}

        {isDone && (
          <section aria-labelledby="fini" className="animate-pop-in py-6 text-center">
            <div className="mx-auto flex size-24 items-center justify-center rounded-full border border-gold bg-ink text-gold-light shadow-pop-lg">
              <Check aria-hidden className="size-12" />
            </div>
            <h1 id="fini" ref={headingRef} tabIndex={-1} className="mt-6 text-display-lg outline-none">
              Bon appétit !
            </h1>
            <p className="mt-3 text-lg text-ink-soft">{recipe.name} est prêt. Vous pouvez être fier·ère de vous.</p>
            <div className="mx-auto mt-8 flex max-w-sm flex-col gap-3">
              {plannedMeal && (
                <Button
                  size="lg"
                  onClick={() => {
                    if (!plannedMeal.done) toggleDone(plannedMeal.id);
                    router.push("/accueil");
                  }}
                >
                  <Check aria-hidden className="size-5" /> {plannedMeal.done ? "Retour au tableau de bord" : "Marquer comme préparé"}
                </Button>
              )}
              <Button variant={plannedMeal ? "secondary" : "primary"} size="lg" onClick={() => router.push(plannedMeal ? "/plan" : "/accueil")}>
                {plannedMeal ? "Voir mon plan" : "Retour au tableau de bord"}
              </Button>
            </div>
            <p className="mx-auto mt-6 max-w-md text-sm text-ink-muted">
              Réfrigérez les restes dans les 2 heures et réchauffez-les à 74 °C.
            </p>
          </section>
        )}
      </main>

      {/* Navigation entre étapes : gros boutons, utilisables les mains occupées */}
      {!isDone && (
        <nav aria-label="Navigation des étapes" className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur">
          <div className="mx-auto flex max-w-3xl gap-3 px-4">
            <Button variant="secondary" size="xl" className="min-w-0 flex-1 px-3" disabled={isPrep} onClick={() => go(-1)}>
              <ArrowLeft aria-hidden className="size-6" />
              <span className="hidden sm:inline">Étape précédente</span>
              <span className="sm:hidden max-[360px]:sr-only">Précédente</span>
            </Button>
            <Button size="xl" className="min-w-0 flex-[1.4] px-3" onClick={() => go(1)}>
              {isPrep ? "C'est parti" : step === total - 1 ? "Terminer" : (
                <>
                  <span className="hidden sm:inline">Étape suivante</span>
                  <span className="sm:hidden">Suivante</span>
                </>
              )}
              <ArrowRight aria-hidden className="size-6" />
            </Button>
          </div>
        </nav>
      )}

      <Sheet open={guideOpen} onClose={() => setGuideOpen(false)} title="Je n'ai jamais cuisiné ça" description="Tout ce qu'il faut savoir avant de vous lancer.">
        <FirstTimeGuide guide={recipe.firstTime} />
      </Sheet>
    </div>
  );
}

/** Questions fréquentes de l'étape + question libre (réponses prérédigées). */
function StepQuestions({ recipe, stepIndex }: { recipe: Recipe; stepIndex: number }) {
  const suggestions = useMemo(() => cookingAssistant.suggestedQuestions(recipe, stepIndex), [recipe, stepIndex]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<AssistantAnswer | null>(null);

  return (
    <section aria-labelledby="faq" className="mt-8">
      <h2 id="faq" className="flex items-center gap-2 text-xl font-semibold">
        <MessageCircleQuestion aria-hidden className="size-5" /> Questions fréquentes
      </h2>
      {suggestions.length > 0 && (
        <ul className="mt-3 space-y-2">
          {suggestions.map((faq, i) => (
            <li key={faq.question} className="overflow-hidden rounded-2xl border border-line bg-surface">
              <button
                type="button"
                aria-expanded={openIndex === i}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex min-h-14 w-full items-center justify-between gap-3 px-4 text-left font-bold"
              >
                {faq.question}
                <ChevronDown aria-hidden className={cn("size-5 shrink-0 transition", openIndex === i && "rotate-180")} />
              </button>
              {openIndex === i && <p className="animate-slide-up px-4 pb-4 text-lg leading-snug">{faq.answer}</p>}
            </li>
          ))}
        </ul>
      )}
      <form
        className="mt-4 flex gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!question.trim()) return;
          setAnswer(await cookingAssistant.ask(recipe, stepIndex, question));
        }}
      >
        <label className="flex-1">
          <span className="sr-only">Poser une autre question</span>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Une autre question ? Ex. : comment savoir si c'est cuit"
            className="min-h-12 w-full rounded-full border border-line bg-surface px-4 font-semibold outline-none focus:border-ink"
          />
        </label>
        <Button type="submit" variant="dark" aria-label="Chercher une réponse">
          <ArrowRight aria-hidden className="size-5 sm:hidden" />
          <span className="hidden sm:inline">Demander</span>
        </Button>
      </form>
      {answer && (
        <div aria-live="polite" className={cn("mt-3 rounded-2xl p-4", answer.source === "aucune" ? "bg-paper-deep" : "bg-plum-soft")}>
          {answer.matchedQuestion && <p className="text-sm font-bold text-plum-deep">{answer.matchedQuestion}</p>}
          <p className="mt-1 text-lg leading-snug">{answer.answer}</p>
          <p className="mt-2 text-xs text-ink-muted">Réponse prérédigée — l&apos;assistant ne génère pas de texte.</p>
        </div>
      )}
    </section>
  );
}
