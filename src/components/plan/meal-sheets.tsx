"use client";

import { ArrowRightLeft, Check, Shuffle, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { RecipeImage } from "@/components/recipe/recipe-image";
import { RecipeQuickFacts } from "@/components/recipe/recipe-meta";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { ServingsStepper } from "@/components/ui/stepper";
import { useToast } from "@/components/ui/toast";
import { RECIPES, RECIPE_MAP } from "@/lib/data/recipes";
import { MEAL_LABELS } from "@/lib/domain/labels";
import type { MealType, PlannedMeal, Recipe } from "@/lib/domain/types";
import { eligibleRecipes, suggestReplacements } from "@/lib/planner/planner";
import { weekdayLabel } from "@/lib/planner/plan-stats";
import { useApp } from "@/lib/state/app-store";
import { cn } from "@/lib/utils/cn";

function RecipeChoice({ recipe, onChoose }: { recipe: Recipe; onChoose: () => void }) {
  return (
    <li>
      <button
        type="button"
        onClick={onChoose}
        className="flex w-full items-center gap-3 rounded-2xl border border-line bg-surface p-2 text-left transition hover:border-ink active:scale-[0.99]"
      >
        <RecipeImage recipe={recipe} variant="thumb" className="size-16 shrink-0 rounded-xl" />
        <span className="min-w-0">
          <span className="block font-bold leading-snug">{recipe.name}</span>
          <RecipeQuickFacts recipe={recipe} />
        </span>
      </button>
    </li>
  );
}

/** Remplacer un repas : suggestions compatibles (allergies respectées) ou tirage automatique. */
export function ReplaceSheet({ open, onClose, meal }: { open: boolean; onClose: () => void; meal: PlannedMeal }) {
  const { plan, profile, replaceMeal } = useApp();
  const { notify } = useToast();
  const suggestions = useMemo(
    () => (open && plan && profile ? suggestReplacements(plan, meal.id, { profile, recipes: RECIPES }, 8) : []),
    [open, plan, profile, meal.id],
  );
  const current = RECIPE_MAP[meal.recipeId];

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={`Remplacer le ${MEAL_LABELS[meal.slot].toLowerCase()}`}
      description={current ? `Actuellement : ${current.name}. Les autres repas ne changent pas.` : undefined}
      footer={
        <Button
          block
          size="lg"
          disabled={suggestions.length === 0}
          onClick={() => {
            replaceMeal(meal.id);
            notify("Repas remplacé");
            onClose();
          }}
        >
          <Shuffle aria-hidden className="size-5" /> Choisir pour moi
        </Button>
      }
    >
      {suggestions.length === 0 ? (
        <p className="text-ink-muted">Aucune autre recette compatible avec votre profil pour ce repas.</p>
      ) : (
        <ul className="space-y-2">
          {suggestions.map((r) => (
            <RecipeChoice
              key={r.id}
              recipe={r}
              onChoose={() => {
                replaceMeal(meal.id, r.id);
                notify("Repas remplacé");
                onClose();
              }}
            />
          ))}
        </ul>
      )}
    </Sheet>
  );
}

/** Options d'un repas : portions, déplacement, préparé, suppression. */
export function MealOptionsSheet({
  open,
  onClose,
  meal,
  dayIndex,
}: {
  open: boolean;
  onClose: () => void;
  meal: PlannedMeal;
  dayIndex: number;
}) {
  const { plan, setMealServings, moveMeal, toggleDone, removeMeal } = useApp();
  const { notify } = useToast();
  const recipe = RECIPE_MAP[meal.recipeId];
  if (!plan || !recipe) return null;

  return (
    <Sheet open={open} onClose={onClose} title={recipe.name} description={`${MEAL_LABELS[meal.slot]} · ${weekdayLabel(plan.days[dayIndex].date)}`}>
      <div className="space-y-6">
        <section>
          <h3 className="mb-2 font-bold">Portions pour ce repas</h3>
          <ServingsStepper value={meal.servings} onChange={(v) => setMealServings(meal.id, v)} label="Portions du repas" />
          <p className="mt-2 text-sm text-ink-muted">La liste d&apos;épicerie se met à jour automatiquement.</p>
        </section>

        <section>
          <h3 className="mb-2 flex items-center gap-2 font-bold">
            <ArrowRightLeft aria-hidden className="size-4" /> Déplacer vers…
          </h3>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
            {plan.days.map((d, i) => (
              <button
                key={d.date}
                type="button"
                disabled={i === dayIndex}
                aria-label={`Déplacer vers ${weekdayLabel(d.date)}`}
                onClick={() => {
                  moveMeal(meal.id, i);
                  notify(`Déplacé à ${weekdayLabel(d.date).toLowerCase()}`);
                  onClose();
                }}
                className={cn(
                  "min-h-12 rounded-2xl border text-sm font-bold capitalize transition",
                  i === dayIndex ? "border-ink bg-ink text-paper" : "border-line bg-surface hover:border-ink",
                )}
              >
                {weekdayLabel(d.date).slice(0, 3)}
              </button>
            ))}
          </div>
          {meal.slot !== "collation" && (
            <p className="mt-2 text-sm text-ink-muted">S&apos;il y a déjà un {MEAL_LABELS[meal.slot].toLowerCase()} ce jour-là, les deux repas sont échangés.</p>
          )}
        </section>

        <div className="grid gap-2 sm:grid-cols-2">
          <Button
            variant={meal.done ? "secondary" : "dark"}
            onClick={() => {
              toggleDone(meal.id);
              notify(meal.done ? "Marqué à préparer" : "Bravo, repas préparé !");
            }}
          >
            <Check aria-hidden className="size-5" /> {meal.done ? "Marquer non préparé" : "Marquer comme préparé"}
          </Button>
          <Link
            href={`/recettes/${recipe.id}?portions=${meal.servings}`}
            className="inline-flex min-h-tap items-center justify-center rounded-full border border-ink px-5 font-bold hover:bg-paper"
          >
            Voir la recette
          </Link>
          <Button
            variant="ghost"
            className="text-danger sm:col-span-2"
            onClick={() => {
              removeMeal(meal.id);
              notify("Repas retiré du plan");
              onClose();
            }}
          >
            <Trash2 aria-hidden className="size-5" /> Retirer ce repas du plan
          </Button>
        </div>
      </div>
    </Sheet>
  );
}

/** Ajouter un repas (collation par défaut) à une journée. */
export function AddMealSheet({
  open,
  onClose,
  dayIndex,
  slot = "collation",
}: {
  open: boolean;
  onClose: () => void;
  dayIndex: number;
  slot?: MealType;
}) {
  const { plan, profile, addMeal } = useApp();
  const { notify } = useToast();
  const options = useMemo(() => (open && profile ? eligibleRecipes(slot, { profile, recipes: RECIPES }) : []), [open, profile, slot]);
  if (!plan) return null;
  const label = slot === "collation" ? "une collation" : `un ${MEAL_LABELS[slot].toLowerCase()}`;

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={`Ajouter ${label}`}
      description={plan.days[dayIndex] ? weekdayLabel(plan.days[dayIndex].date) : undefined}
      footer={
        <Button
          block
          size="lg"
          disabled={options.length === 0}
          onClick={() => {
            addMeal(dayIndex, slot);
            notify("Ajouté au plan");
            onClose();
          }}
        >
          <Shuffle aria-hidden className="size-5" /> Choisir pour moi
        </Button>
      }
    >
      {options.length === 0 ? (
        <p className="text-ink-muted">Aucune recette compatible avec votre profil pour ce repas.</p>
      ) : (
        <ul className="space-y-2">
          {options.map((r) => (
            <RecipeChoice
              key={r.id}
              recipe={r}
              onChoose={() => {
                addMeal(dayIndex, slot, r.id);
                notify("Ajouté au plan");
                onClose();
              }}
            />
          ))}
        </ul>
      )}
    </Sheet>
  );
}
