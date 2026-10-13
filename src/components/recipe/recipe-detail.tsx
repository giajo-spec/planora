"use client";

import { ArrowLeft, ChefHat, Clock, Lightbulb, Repeat, ShieldAlert, ShoppingBasket, Timer, Utensils } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge, EstimateNote } from "@/components/ui/primitives";
import { ServingsStepper } from "@/components/ui/stepper";
import { useToast } from "@/components/ui/toast";
import { INGREDIENTS } from "@/lib/data/ingredients";
import { getRecipe } from "@/lib/data/recipes";
import { ALLERGEN_LABELS, DIFFICULTY_LABELS, EQUIPMENT_LABELS, MEAL_LABELS } from "@/lib/domain/labels";
import { nutritionForServings, nutritionPerServing, roundNutrition } from "@/lib/nutrition/nutrition";
import { formatIngredientLine, scaleFactor } from "@/lib/nutrition/portions";
import { hardConstraintsOf } from "@/lib/planner/planner";
import { containsIngredient, isRecipeAllowed, recipeAllergens } from "@/lib/recipes/analysis";
import { useApp } from "@/lib/state/app-store";
import { FirstTimeGuide } from "./first-time-guide";
import { MacroBar, NutritionGrid } from "./nutrition";
import { RecipeImage } from "./recipe-image";
import { RecipeBadges, formatMinutes } from "./recipe-meta";

export function RecipeDetail({ recipeId }: { recipeId: string }) {
  const recipe = getRecipe(recipeId)!;
  const params = useSearchParams();
  const router = useRouter();
  const { profile, groceryState, addRecipeToGrocery, removeRecipeFromGrocery } = useApp();
  const { notify } = useToast();
  const fromQuery = Number(params.get("portions"));
  const [chosen, setServings] = useState<number | null>(fromQuery > 0 ? fromQuery : null);
  // Sans choix explicite : taille du foyer (une fois le profil chargé), sinon portions de la recette.
  const servings = chosen ?? profile?.householdSize ?? recipe.servings;
  const [showGuide, setShowGuide] = useState(false);

  const factor = scaleFactor(recipe.servings, servings);
  const lines = recipe.ingredients.map((ri) => formatIngredientLine(ri, INGREDIENTS[ri.ingredientId], factor));
  const perServing = nutritionPerServing(recipe);
  const total = roundNutrition(nutritionForServings(recipe, servings));
  const allergens = recipeAllergens(recipe);
  const unsafe = profile ? !isRecipeAllowed(recipe, { ...hardConstraintsOf(profile), dislikedIngredients: [] }) : false;
  const conflicting = profile ? allergens.filter((a) => profile.allergens.includes(a)) : [];
  const disliked = profile ? containsIngredient(recipe, profile.dislikedIngredients) : false;
  const inGrocery = groceryState.extras.some((e) => e.recipeId === recipe.id);

  return (
    <article className="pb-32 lg:pb-16">
      {/* Héros */}
      <div className="relative">
        <RecipeImage recipe={recipe} variant="hero" priority sizes="100vw" className="aspect-[4/3] w-full sm:aspect-[21/9]" />
        <button
          type="button"
          onClick={() => (window.history.length > 1 ? router.back() : router.push("/recettes"))}
          className="absolute left-4 top-4 flex size-12 items-center justify-center rounded-full bg-surface shadow-card"
          aria-label="Retour"
        >
          <ArrowLeft aria-hidden className="size-5" />
        </button>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
        <div className="relative -mt-8 rounded-card bg-paper pt-6 sm:-mt-12 sm:px-2">
          <p className="eyebrow">
            {recipe.cuisine} · {recipe.mealTypes.map((m) => MEAL_LABELS[m]).join(", ")}
          </p>
          <h1 className="mt-2 text-display-lg">{recipe.name}</h1>
          <div className="mt-3">
            <RecipeBadges recipe={recipe} max={4} />
          </div>
          <p className="mt-4 max-w-3xl text-lg text-ink-soft">{recipe.description}</p>

          {unsafe && (
            <div role="alert" className="mt-5 flex gap-3 rounded-3xl border border-danger bg-danger-soft p-4 text-danger">
              <ShieldAlert aria-hidden className="size-6 shrink-0" />
              <p className="font-bold">
                Cette recette n&apos;est pas compatible avec votre profil
                {conflicting.length > 0 && <> : elle contient {conflicting.map((a) => ALLERGEN_LABELS[a].toLowerCase()).join(", ")}</>}. Elle
                ne vous sera jamais proposée dans votre plan.
              </p>
            </div>
          )}
          {!unsafe && disliked && (
            <p className="mt-5 rounded-3xl bg-amber-soft p-4 font-semibold">Cette recette contient un aliment que vous avez indiqué ne pas aimer.</p>
          )}

          {/* Faits rapides */}
          <dl className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(7.5rem,1fr))] gap-2 sm:max-w-xl">
            <div className="rounded-2xl bg-surface p-3">
              <dt className="flex items-center gap-1 text-xs font-bold uppercase text-ink-muted">
                <Clock aria-hidden className="size-3.5" /> Préparation
              </dt>
              <dd className="font-display text-lg font-semibold sm:text-xl">{formatMinutes(recipe.prepMinutes)}</dd>
            </div>
            <div className="rounded-2xl bg-surface p-3">
              <dt className="flex items-center gap-1 text-xs font-bold uppercase text-ink-muted">
                <Timer aria-hidden className="size-3.5" /> Cuisson
              </dt>
              <dd className="font-display text-lg font-semibold sm:text-xl">{recipe.cookMinutes ? formatMinutes(recipe.cookMinutes) : "Aucune"}</dd>
            </div>
            <div className="rounded-2xl bg-surface p-3">
              <dt className="text-xs font-bold uppercase text-ink-muted">Difficulté</dt>
              <dd className="font-display text-lg font-semibold sm:text-xl">{DIFFICULTY_LABELS[recipe.difficulty]}</dd>
            </div>
          </dl>

          <div className="mt-8 grid gap-8 lg:grid-cols-[22rem_1fr]">
            {/* Colonne ingrédients */}
            <aside className="space-y-5">
              <section aria-labelledby="ingredients" className="card p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 id="ingredients" className="text-2xl font-semibold">Ingrédients</h2>
                  <ServingsStepper value={servings} onChange={setServings} />
                </div>
                <ul className="mt-4 divide-y divide-line">
                  {lines.map((l) => (
                    <li key={l.ingredientId} className="flex gap-3 py-2.5">
                      <span className="min-w-[5.5rem] font-display font-semibold tabular-nums">{l.quantityText}</span>
                      <span className="leading-snug">
                        {l.name}
                        {l.note && <span className="text-ink-muted">, {l.note}</span>}
                        {l.optional && <span className="text-ink-muted"> (facultatif)</span>}
                      </span>
                    </li>
                  ))}
                </ul>
                {allergens.length > 0 && (
                  <p className="mt-3 text-sm">
                    <span className="font-bold">Contient : </span>
                    {allergens.map((a) => ALLERGEN_LABELS[a].toLowerCase()).join(", ")}.
                  </p>
                )}
                {recipe.equipment.length > 0 && (
                  <p className="mt-2 flex items-center gap-1.5 text-sm">
                    <Utensils aria-hidden className="size-4" />
                    <span className="font-bold">Équipement :</span> {recipe.equipment.map((e) => EQUIPMENT_LABELS[e].toLowerCase()).join(", ")}
                  </p>
                )}
                <div className="mt-5 grid gap-2">
                  <ButtonLink href={`/cuisine/${recipe.id}?portions=${servings}${params.get("repas") ? `&repas=${params.get("repas")}` : ""}`} size="lg">
                    <ChefHat aria-hidden className="size-5" /> Commencer la cuisine guidée
                  </ButtonLink>
                  {inGrocery ? (
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => {
                        removeRecipeFromGrocery(recipe.id);
                        notify("Retiré de la liste d'épicerie");
                      }}
                    >
                      Retirer de la liste d&apos;épicerie
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      size="lg"
                      disabled={unsafe}
                      onClick={() => {
                        addRecipeToGrocery(recipe.id, servings);
                        notify("Ajouté à la liste d'épicerie");
                      }}
                    >
                      <ShoppingBasket aria-hidden className="size-5" /> Ajouter à la liste d&apos;épicerie
                    </Button>
                  )}
                </div>
              </section>

              <section aria-labelledby="nutrition" className="card p-5">
                <h2 id="nutrition" className="text-xl font-semibold">Nutrition par portion</h2>
                <NutritionGrid nutrition={perServing} className="mt-3" />
                <MacroBar nutrition={perServing} className="mt-3" />
                <p className="mt-3 text-sm font-semibold">
                  Pour {String(servings).replace(".", ",")} portions : {total.kcal} kcal · {total.protein} g de protéines
                </p>
                <EstimateNote className="mt-3" />
              </section>
            </aside>

            {/* Colonne préparation */}
            <div className="space-y-8">
              <section aria-labelledby="preparation">
                <h2 id="preparation" className="text-2xl font-semibold">Préparation</h2>
                <ol className="mt-4 space-y-4">
                  {recipe.steps.map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink font-display text-lg font-semibold text-gold">
                        {i + 1}
                      </span>
                      <div className="pt-1.5">
                        <p className="text-lg leading-relaxed">
                          <span className="sr-only">Étape {i + 1} : </span>
                          {step.text}
                        </p>
                        {step.timers && step.timers.length > 0 && (
                          <p className="mt-1.5 flex flex-wrap gap-1.5">
                            {step.timers.map((t) => (
                              <Badge key={t.label} tone="amber">
                                <Timer aria-hidden className="size-3" /> {t.label} · {formatMinutes(Math.round(t.seconds / 60))}
                              </Badge>
                            ))}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              {recipe.tips.length > 0 && (
                <section aria-labelledby="conseils" className="rounded-card bg-gold-soft p-5">
                  <h2 id="conseils" className="flex items-center gap-2 text-xl font-semibold">
                    <Lightbulb aria-hidden className="size-5" /> Conseils du chef
                  </h2>
                  <ul className="mt-3 space-y-2">
                    {recipe.tips.map((t) => (
                      <li key={t} className="leading-snug">{t}</li>
                    ))}
                  </ul>
                </section>
              )}

              {recipe.substitutions.length > 0 && (
                <section aria-labelledby="substitutions">
                  <h2 id="substitutions" className="flex items-center gap-2 text-xl font-semibold">
                    <Repeat aria-hidden className="size-5" /> Substitutions possibles
                  </h2>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {recipe.substitutions.map((s) => (
                      <li key={s.from + s.to} className="rounded-3xl border border-line bg-surface p-4">
                        <p className="font-bold">
                          {s.from} <span aria-hidden>→</span>
                          <span className="sr-only"> remplacé par </span> {s.to}
                        </p>
                        {s.note && <p className="mt-1 text-sm text-ink-muted">{s.note}</p>}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-sm text-ink-muted">Une substitution peut ajouter un allergène : vérifiez toujours les étiquettes.</p>
                </section>
              )}

              <section aria-labelledby="premiere-fois">
                <Button variant="dark" size="lg" aria-expanded={showGuide} aria-controls="guide-premiere-fois" onClick={() => setShowGuide((v) => !v)}>
                  Je n&apos;ai jamais cuisiné ça
                </Button>
                <h2 id="premiere-fois" className="sr-only">Guide pour débutants</h2>
                {showGuide && (
                  <div id="guide-premiere-fois" className="mt-4 animate-slide-up">
                    <FirstTimeGuide guide={recipe.firstTime} />
                  </div>
                )}
              </section>

              <p className="text-sm">
                <Link href="/recettes" className="font-bold underline underline-offset-4">
                  ← Toutes les recettes
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
