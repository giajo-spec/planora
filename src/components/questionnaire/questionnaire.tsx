"use client";

import {
  Activity, Apple, ArrowLeft, ArrowRight, Bean, Blend, Carrot, Check, ChefHat, Clock, Coffee, CookingPot, Drumstick, Dumbbell,
  Egg, Fish, Flame, Hourglass, Milk, Minus, Nut, Plus, Salad, Scale, Shell, ShieldAlert, Smile, Soup, Sprout, Target, Timer,
  User, Users, UtensilsCrossed, Wheat, Wind, Zap, type LucideIcon,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { LogoMark } from "@/components/layout/logo";
import { RecipeImage } from "@/components/recipe/recipe-image";
import { ingredientColor } from "@/lib/data/ingredient-colors";
import { PLAN_OFFERS, formatPrice, presetFor } from "@/lib/subscriptions";
import { Button } from "@/components/ui/button";
import { Chip, ProgressBar } from "@/components/ui/primitives";
import { INGREDIENTS } from "@/lib/data/ingredients";
import { RECIPES } from "@/lib/data/recipes";
import {
  ALLERGEN_LABELS,
  DIET_DESCRIPTIONS,
  DIET_LABELS,
  EQUIPMENT_LABELS,
  FOCUS_LABELS,
  GOAL_DESCRIPTIONS,
  GOAL_LABELS,
  LEVEL_DESCRIPTIONS,
  LEVEL_LABELS,
  MEAL_LABELS,
  RESTRICTION_LABELS,
} from "@/lib/domain/labels";
import type {
  Allergen,
  CookingLevel,
  Diet,
  Equipment,
  Goal,
  MealType,
  NutritionFocus,
  Profile,
  Restriction,
  SubscriptionPlan,
  TimeBudget,
} from "@/lib/domain/types";
import { defaultTargets } from "@/lib/nutrition/nutrition";
import { eligibleRecipes } from "@/lib/planner/planner";
import { createEmptyProfile } from "@/lib/profile/defaults";
import { useApp } from "@/lib/state/app-store";
import { STORAGE_KEYS } from "@/lib/storage/storage";
import { cn } from "@/lib/utils/cn";

/** Ingrédients proposés pour « j'aime / je n'aime pas ». */
const TASTE_INGREDIENTS = [
  "poitrine-poulet", "boeuf-surlonge", "saumon", "crevettes", "tofu-ferme", "oeuf", "lentilles-corail", "pois-chiches",
  "haricots-noirs", "champignons", "brocoli", "epinards", "avocat", "poivron-rouge", "courgette", "chou-rouge", "bok-choy",
  "coriandre", "feta", "yogourt-grec", "lait-coco", "quinoa", "edamame", "olives-kalamata", "gingembre", "jalapeno",
  "abricots-secs", "tahini",
];

const TIME_OPTIONS: Array<{ value: TimeBudget; label: string; hint: string; icon: LucideIcon }> = [
  { value: 15, label: "15 min", hint: "Express", icon: Zap },
  { value: 30, label: "30 min", hint: "Rapide", icon: Timer },
  { value: 45, label: "45 min", hint: "Confortable", icon: Clock },
  { value: 60, label: "1 h", hint: "J'ai le temps", icon: Hourglass },
  { value: 90, label: "1 h 30 +", hint: "J'adore cuisiner", icon: CookingPot },
];

const DIET_ICONS: Record<Diet, LucideIcon> = { omnivore: Drumstick, flexitarien: Salad, pescetarien: Fish, vegetarien: Carrot, vegetalien: Sprout };
const LEVEL_ICONS: Record<CookingLevel, LucideIcon> = { debutant: Smile, intermediaire: ChefHat, avance: Flame };
const GOAL_ICONS: Record<Goal, LucideIcon> = { equilibre: Scale, "perte-gras": Activity, "prise-muscle": Dumbbell, maintien: Target };
const MEAL_ICONS: Record<MealType, LucideIcon> = { dejeuner: Coffee, diner: Salad, souper: Soup, collation: Apple };
const PLAN_ICONS: Record<SubscriptionPlan, LucideIcon> = { personnalise: User, famille: Users, "en-forme": Dumbbell };
const ALLERGEN_ICONS: Partial<Record<Allergen, LucideIcon>> = { arachides: Nut, noix: Nut, lait: Milk, oeufs: Egg, poisson: Fish, "fruits-de-mer": Shell, soja: Bean, gluten: Wheat };
const EQUIPMENT_ICONS: Record<Equipment, LucideIcon> = { four: Flame, mijoteuse: CookingPot, "friteuse-air": Wind, melangeur: Blend, "robot-culinaire": UtensilsCrossed, autocuiseur: Timer };

const STEPS = [
  "formule",
  "foyer",
  "regime",
  "allergies",
  "aime",
  "deteste",
  "niveau",
  "temps",
  "equipement",
  "repas",
  "objectif",
  "nutrition",
] as const;
type StepId = (typeof STEPS)[number];

interface Draft {
  step: number;
  profile: Profile;
}

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Carte de choix unique (rôle radio). */
function OptionCard({
  selected,
  onSelect,
  title,
  description,
  icon: Icon,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  description?: string;
  icon?: LucideIcon;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "flex min-h-16 w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition active:scale-[0.99]",
        selected ? "border-gold bg-gold-soft shadow-gold" : "border-line bg-surface hover:border-ink",
      )}
    >
      {Icon && (
        <span className={cn("flex size-12 shrink-0 items-center justify-center rounded-full border transition", selected ? "border-ink bg-ink text-gold-light" : "border-gold/60 text-gold-deep")}>
          <Icon aria-hidden className="size-5" />
        </span>
      )}
      <span className="flex-1">
        <span className="block text-lg font-semibold">{title}</span>
        {description && <span className="block text-sm text-ink-soft">{description}</span>}
      </span>
      <span className={cn("flex size-6 shrink-0 items-center justify-center rounded-full border", selected ? "border-ink bg-ink" : "border-ink-muted")}>
        {selected && <Check aria-hidden className="size-4 text-gold-light" />}
      </span>
    </button>
  );
}

function Counter({ value, onChange, min, max, label }: { value: number; onChange: (v: number) => void; min: number; max: number; label: string }) {
  return (
    <div className="flex items-center gap-4" role="group" aria-label={label}>
      <button type="button" aria-label={`Diminuer : ${label}`} disabled={value <= min} onClick={() => onChange(value - 1)} className="flex size-14 items-center justify-center rounded-full bg-ink text-paper transition active:scale-90 disabled:opacity-30">
        <Minus aria-hidden className="size-6" />
      </button>
      <output aria-live="polite" className="min-w-16 text-center font-display text-5xl font-semibold tabular-nums">
        {value}
      </output>
      <button type="button" aria-label={`Augmenter : ${label}`} disabled={value >= max} onClick={() => onChange(value + 1)} className="flex size-14 items-center justify-center rounded-full bg-ink text-paper transition active:scale-90 disabled:opacity-30">
        <Plus aria-hidden className="size-6" />
      </button>
    </div>
  );
}

function NumberField({ label, unit, value, onChange }: { label: string; unit: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block rounded-2xl border border-line bg-surface px-4 py-3 focus-within:border-ink">
      <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">{label}</span>
      <span className="mt-1 flex items-baseline gap-1">
        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={Number.isFinite(value) ? value : ""}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
          className="w-full bg-transparent font-display text-2xl font-semibold tabular-nums outline-none"
        />
        <span className="font-bold text-ink-muted">{unit}</span>
      </span>
    </label>
  );
}

export function Questionnaire() {
  const { hydrated, profile: existing, storage, saveProfile } = useApp();
  const router = useRouter();
  const params = useSearchParams();
  const forfait = PLAN_OFFERS.find((o) => o.key === params.get("forfait"))?.key;
  const [draft, setDraft] = useState<Draft | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Reprise du brouillon (réponses conservées), sinon profil existant ou vierge.
  useEffect(() => {
    if (!hydrated || draft) return;
    void storage.load<Draft>(STORAGE_KEYS.questionnaireDraft).then((saved) => {
      const base = existing && !existing.isDemo ? existing : createEmptyProfile();
      const start: Draft = saved ? { step: Math.min(saved.step, STEPS.length - 1), profile: { ...base, ...saved.profile } } : { step: 0, profile: base };
      // Formule choisie depuis la page des formules : réglages recommandés appliqués.
      if (forfait) start.profile = presetFor(forfait, start.profile);
      setDraft(start);
    });
  }, [hydrated, draft, existing, storage, forfait]);

  useEffect(() => {
    if (draft) void storage.save(STORAGE_KEYS.questionnaireDraft, draft);
  }, [draft, storage]);

  const step = draft?.step ?? 0;
  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  const compatible = useMemo(() => {
    if (!draft) return [];
    const ctx = { profile: draft.profile, recipes: RECIPES };
    const seen = new Map<string, (typeof RECIPES)[number]>();
    for (const slot of ["dejeuner", "diner", "souper", "collation"] as MealType[]) for (const r of eligibleRecipes(slot, ctx)) seen.set(r.id, r);
    return [...seen.values()];
  }, [draft]);
  const compatibleCount = compatible.length;
  // Aperçu : recettes compatibles variées (une sur ~N), qui changent avec les réponses.
  const preview = useMemo(() => {
    if (compatible.length === 0) return [];
    const stride = Math.max(1, Math.floor(compatible.length / 6));
    return [0, 1, 2, 3].map((i) => compatible[(i * stride * 7 + 3) % compatible.length]).filter((r, i, all) => all.indexOf(r) === i);
  }, [compatible]);

  if (!draft) {
    return <div className="min-h-dvh bg-paper" aria-busy="true" />;
  }

  const p = draft.profile;
  const id: StepId = STEPS[step];
  const set = (patch: Partial<Profile>) => setDraft((d) => (d ? { ...d, profile: { ...d.profile, ...patch } } : d));
  const go = (delta: number) => setDraft((d) => (d ? { ...d, step: Math.min(STEPS.length - 1, Math.max(0, d.step + delta)) } : d));
  const isLast = step === STEPS.length - 1;

  const canContinue =
    (id !== "repas" || p.meals.length > 0) && (id !== "foyer" || p.householdSize >= 1);

  const finish = async () => {
    saveProfile({ ...p, isDemo: false, name: p.name.trim() });
    await storage.remove(STORAGE_KEYS.questionnaireDraft);
    router.push("/accueil?bienvenue=1");
  };

  const titles: Record<StepId, { title: string; subtitle: string }> = {
    formule: { title: "Choisissez votre formule", subtitle: "Elle oriente vos recettes, vos portions et vos priorités. Vous pourrez en changer à tout moment." },
    foyer: { title: "Faisons connaissance", subtitle: "Pour combien de personnes cuisinez-vous habituellement ?" },
    regime: { title: "Votre façon de manger", subtitle: "Choisissez le régime qui vous décrit le mieux." },
    allergies: { title: "Allergies et restrictions", subtitle: "Ces règles sont strictes : aucune recette contenant ces aliments ne vous sera proposée." },
    aime: { title: "Ce que vous aimez", subtitle: "On mettra ces aliments plus souvent au menu." },
    deteste: { title: "Ce que vous évitez", subtitle: "Ces aliments seront retirés de vos suggestions." },
    niveau: { title: "Votre niveau en cuisine", subtitle: "Pour choisir des recettes à votre mesure." },
    temps: { title: "Votre temps par repas", subtitle: "Préparation et cuisson comprises, un soir de semaine." },
    equipement: { title: "Votre équipement", subtitle: "Cuisinière, poêles et casseroles sont considérées comme acquises." },
    repas: { title: "Repas à planifier", subtitle: "Quels repas voulez-vous voir dans votre plan ?" },
    objectif: { title: "Votre objectif", subtitle: "Il oriente le choix des recettes et vos cibles nutritionnelles." },
    nutrition: { title: "Préférences nutritionnelles", subtitle: "Ajustez vos cibles quotidiennes, par personne. Vous pourrez les modifier plus tard." },
  };

  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <header className="sticky top-0 z-10 border-b border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          {step > 0 ? (
            <button type="button" onClick={() => go(-1)} className="flex size-11 items-center justify-center rounded-full border border-line bg-surface hover:border-ink" aria-label="Étape précédente">
              <ArrowLeft aria-hidden className="size-5" />
            </button>
          ) : (
            <button type="button" onClick={() => router.push("/")} className="flex size-11 items-center justify-center rounded-full" aria-label="Retour à l'accueil">
              <LogoMark />
            </button>
          )}
          <div className="flex-1">
            <p className="mb-1.5 text-xs font-bold text-ink-muted">
              Étape {step + 1} sur {STEPS.length}
            </p>
            <ProgressBar value={step + 1} max={STEPS.length} label="Progression du questionnaire" />
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-12 px-4 pb-40 pt-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div key={id} className="mx-auto w-full max-w-2xl animate-slide-up">
          <h1 ref={headingRef} tabIndex={-1} className="text-display-lg outline-none">
            {titles[id].title}
          </h1>
          <p className="mt-3 text-lg text-ink-soft">{titles[id].subtitle}</p>

          <div className="mt-8">
            {id === "formule" && (
              <div role="radiogroup" aria-label="Formule" className="space-y-3">
                {PLAN_OFFERS.map((o) => {
                  const Icon = PLAN_ICONS[o.key];
                  const selected = p.subscription === o.key;
                  return (
                    <button
                      key={o.key}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setDraft((d) => (d ? { ...d, profile: presetFor(o.key, d.profile) } : d))}
                      className={cn(
                        "flex w-full items-center gap-4 rounded-3xl border p-5 text-left transition active:scale-[0.99]",
                        selected ? "border-ink bg-ink text-paper shadow-pop-lg" : "border-line bg-surface hover:border-gold",
                      )}
                    >
                      <span className={cn("flex size-14 shrink-0 items-center justify-center rounded-full border", selected ? "border-gold text-gold-light" : "border-gold/60 text-gold-deep")}>
                        <Icon aria-hidden className="size-6" />
                      </span>
                      <span className="flex-1">
                        <span className="flex items-baseline justify-between gap-2">
                          <span className="font-display text-2xl">{o.name}</span>
                          <span className={cn("text-sm", selected ? "text-gold-light" : "text-gold-deep")}>{formatPrice(o.monthly)} / mois</span>
                        </span>
                        <span className={cn("block text-sm", selected ? "text-paper/75" : "text-ink-soft")}>{o.audience}</span>
                        <span className={cn("mt-1 block font-display italic", selected ? "text-gold-light" : "text-ink-muted")}>{o.tagline}</span>
                      </span>
                    </button>
                  );
                })}
                <p className="pt-2 text-center text-sm text-ink-muted">Aucun paiement demandé dans ce prototype.</p>
              </div>
            )}

            {id === "foyer" && (
              <div className="space-y-8">
                <label className="block">
                  <span className="font-bold">Votre prénom (facultatif)</span>
                  <input
                    type="text"
                    value={p.name}
                    autoComplete="given-name"
                    maxLength={40}
                    onChange={(e) => set({ name: e.target.value })}
                    placeholder="Ex. : Camille"
                    className="mt-2 block min-h-14 w-full rounded-2xl border border-line bg-surface px-4 text-lg font-semibold outline-none focus:border-ink"
                  />
                </label>
                <div>
                  <p className="mb-3 font-bold">Nombre de personnes à nourrir</p>
                  <Counter value={p.householdSize} onChange={(v) => set({ householdSize: v, childrenCount: Math.min(p.childrenCount ?? 0, v - 1) })} min={1} max={10} label="Nombre de personnes" />
                </div>
                {p.householdSize > 1 && (
                  <div>
                    <p className="mb-1 font-bold">Dont enfants</p>
                    <p className="mb-3 text-sm text-ink-muted">Nous mettrons en avant des recettes douces, simples et amusantes.</p>
                    <Counter value={p.childrenCount ?? 0} onChange={(v) => set({ childrenCount: v })} min={0} max={p.householdSize - 1} label="Nombre d'enfants" />
                  </div>
                )}
              </div>
            )}

            {id === "regime" && (
              <div role="radiogroup" aria-label="Régime alimentaire" className="space-y-3">
                {(Object.keys(DIET_LABELS) as Diet[]).map((diet) => (
                  <OptionCard key={diet} icon={DIET_ICONS[diet]} selected={p.diet === diet} onSelect={() => set({ diet })} title={DIET_LABELS[diet]} description={DIET_DESCRIPTIONS[diet]} />
                ))}
              </div>
            )}

            {id === "allergies" && (
              <div className="space-y-8">
                <fieldset>
                  <legend className="mb-3 font-bold">Allergies et intolérances</legend>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(ALLERGEN_LABELS) as Allergen[]).map((a) => (
                      <Chip key={a} selected={p.allergens.includes(a)} onClick={() => set({ allergens: toggle(p.allergens, a) })}>
                        {p.allergens.includes(a) ? <ShieldAlert aria-hidden className="size-4 text-gold-light" /> : (() => { const I = ALLERGEN_ICONS[a]; return I ? <I aria-hidden className="size-4 text-gold-deep" /> : null; })()}
                        {ALLERGEN_LABELS[a]}
                      </Chip>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="mb-3 font-bold">Autres restrictions</legend>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(RESTRICTION_LABELS) as Restriction[]).map((r) => (
                      <Chip key={r} selected={p.restrictions.includes(r)} onClick={() => set({ restrictions: toggle(p.restrictions, r) })}>
                        {RESTRICTION_LABELS[r]}
                      </Chip>
                    ))}
                  </div>
                </fieldset>
                <p className="rounded-2xl bg-amber-soft p-4 text-sm text-ink">
                  Les allergènes sont déduits de nos fiches d&apos;ingrédients. Vérifiez toujours l&apos;étiquette des produits que
                  vous achetez : les recettes peuvent varier selon les marques.
                </p>
              </div>
            )}

            {(id === "aime" || id === "deteste") && (
              <div className="flex flex-wrap gap-2">
                {TASTE_INGREDIENTS.filter((ingId) => (id === "aime" ? !p.dislikedIngredients.includes(ingId) : !p.likedIngredients.includes(ingId))).map((ingId) => {
                  const key = id === "aime" ? "likedIngredients" : "dislikedIngredients";
                  const list = p[key];
                  return (
                    <Chip key={ingId} selected={list.includes(ingId)} onClick={() => set({ [key]: toggle(list, ingId) })}>
                      <span aria-hidden className="size-3 rounded-full ring-1 ring-ink/10" style={{ backgroundColor: ingredientColor(ingId, INGREDIENTS[ingId].aisle) }} />
                      {capitalize(INGREDIENTS[ingId].plural && INGREDIENTS[ingId].countStep ? INGREDIENTS[ingId].plural! : INGREDIENTS[ingId].name)}
                    </Chip>
                  );
                })}
              </div>
            )}

            {id === "niveau" && (
              <div role="radiogroup" aria-label="Niveau en cuisine" className="space-y-3">
                {(Object.keys(LEVEL_LABELS) as CookingLevel[]).map((lvl) => (
                  <OptionCard key={lvl} icon={LEVEL_ICONS[lvl]} selected={p.cookingLevel === lvl} onSelect={() => set({ cookingLevel: lvl })} title={LEVEL_LABELS[lvl]} description={LEVEL_DESCRIPTIONS[lvl]} />
                ))}
              </div>
            )}

            {id === "temps" && (
              <div role="radiogroup" aria-label="Temps disponible par repas" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {TIME_OPTIONS.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    role="radio"
                    aria-checked={p.timeBudget === t.value}
                    onClick={() => set({ timeBudget: t.value })}
                    className={cn(
                      "flex min-h-24 flex-col items-start justify-between rounded-2xl border p-4 text-left transition active:scale-[0.98]",
                      p.timeBudget === t.value ? "border-gold bg-gold-soft shadow-gold" : "border-line bg-surface hover:border-ink",
                    )}
                  >
                    <t.icon aria-hidden className={cn("size-5", p.timeBudget === t.value ? "text-gold-deep" : "text-ink-muted")} />
                    <span className="font-display text-2xl">{t.label}</span>
                    <span className="text-sm font-semibold text-ink-soft">{t.hint}</span>
                  </button>
                ))}
              </div>
            )}

            {id === "equipement" && (
              <div className="flex flex-wrap gap-2">
                {(Object.keys(EQUIPMENT_LABELS) as Equipment[]).map((e) => (
                  <Chip key={e} selected={p.equipment.includes(e)} onClick={() => set({ equipment: toggle(p.equipment, e) })}>
                    {(() => { const I = EQUIPMENT_ICONS[e]; return <I aria-hidden className={cn("size-4", p.equipment.includes(e) ? "text-gold-light" : "text-gold-deep")} />; })()}
                    {EQUIPMENT_LABELS[e]}
                  </Chip>
                ))}
              </div>
            )}

            {id === "repas" && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  {(["dejeuner", "diner", "souper", "collation"] as MealType[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      aria-pressed={p.meals.includes(m)}
                      onClick={() => set({ meals: toggle(p.meals, m) })}
                      className={cn(
                        "flex min-h-20 items-center justify-between rounded-2xl border px-4 text-left text-lg font-semibold transition active:scale-[0.98]",
                        p.meals.includes(m) ? "border-gold bg-gold-soft shadow-gold" : "border-line bg-surface hover:border-ink",
                      )}
                    >
                      <span className="flex items-center gap-3">
                        {(() => { const I = MEAL_ICONS[m]; return <I aria-hidden className="size-5 text-gold-deep" />; })()}
                        {m === "collation" ? "Collations" : MEAL_LABELS[m]}
                      </span>
                      <span className={cn("flex size-6 items-center justify-center rounded-md border border-ink", p.meals.includes(m) && "bg-ink")}>
                        {p.meals.includes(m) && <Check aria-hidden className="size-4 text-gold" />}
                      </span>
                    </button>
                  ))}
                </div>
                {p.meals.includes("collation") && (
                  <div>
                    <p className="mb-3 font-bold">Collations par jour</p>
                    <Counter value={p.snacksPerDay} onChange={(v) => set({ snacksPerDay: v })} min={1} max={3} label="Collations par jour" />
                  </div>
                )}
                {p.meals.length === 0 && <p className="font-semibold text-terra-deep">Choisissez au moins un repas.</p>}
              </div>
            )}

            {id === "objectif" && (
              <div role="radiogroup" aria-label="Objectif" className="space-y-3">
                {(Object.keys(GOAL_LABELS) as Goal[]).map((g) => (
                  <OptionCard
                    key={g}
                    icon={GOAL_ICONS[g]}
                    selected={p.goal === g}
                    onSelect={() => set({ goal: g, targets: defaultTargets(g), portionFactor: g === "prise-muscle" ? 1.5 : 1 })}
                    title={GOAL_LABELS[g]}
                    description={GOAL_DESCRIPTIONS[g]}
                  />
                ))}
              </div>
            )}

            {id === "nutrition" && (
              <div className="space-y-8">
                <fieldset>
                  <legend className="mb-3 font-bold">Vos priorités</legend>
                  <div className="flex flex-wrap gap-2">
                    {(Object.keys(FOCUS_LABELS) as NutritionFocus[]).map((f) => (
                      <Chip key={f} selected={p.nutritionFocus.includes(f)} onClick={() => set({ nutritionFocus: toggle(p.nutritionFocus, f) })}>
                        {FOCUS_LABELS[f]}
                      </Chip>
                    ))}
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="mb-3 font-bold">Cibles quotidiennes (par personne)</legend>
                  <div className="grid grid-cols-2 gap-3">
                    <NumberField label="Calories" unit="kcal" value={p.targets.kcal} onChange={(v) => set({ targets: { ...p.targets, kcal: v } })} />
                    <NumberField label="Protéines" unit="g" value={p.targets.protein} onChange={(v) => set({ targets: { ...p.targets, protein: v } })} />
                    <NumberField label="Glucides" unit="g" value={p.targets.carbs} onChange={(v) => set({ targets: { ...p.targets, carbs: v } })} />
                    <NumberField label="Lipides" unit="g" value={p.targets.fat} onChange={(v) => set({ targets: { ...p.targets, fat: v } })} />
                  </div>
                  <p className="mt-3 text-sm text-ink-muted">
                    Valeurs de départ génériques selon votre objectif — pas une recommandation médicale. Consultez un·e
                    nutritionniste pour des cibles adaptées à votre situation.
                  </p>
                </fieldset>
              </div>
            )}
          </div>
        </div>
        <aside aria-label="Aperçu de vos recettes" className="hidden lg:block">
          <div className="sticky top-28 rounded-[2rem] bg-ink p-6 text-paper">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-gold-light">Aperçu en direct</p>
            <p className="mt-2 font-display text-4xl" aria-live="polite">
              {compatibleCount.toLocaleString("fr-CA")}
            </p>
            <p className="text-sm text-paper/70">recettes compatibles avec vos réponses</p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              {preview.map((r) => (
                <figure key={r.id} className="overflow-hidden rounded-2xl bg-paper">
                  <RecipeImage recipe={r} variant="thumb" className="aspect-square w-full" />
                  <figcaption className="px-2 py-1.5 text-[0.7rem] leading-tight text-ink">
                    <span className="line-clamp-2">{r.name}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </aside>
      </main>

      <footer className="fixed inset-x-0 bottom-0 border-t border-line bg-surface/95 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4">
          <p className="hidden flex-1 text-sm font-semibold text-ink-muted sm:block" aria-live="polite">
            <span className="font-display text-lg font-semibold text-ink">{compatibleCount}</span> recettes compatibles
          </p>
          {isLast ? (
            <Button size="lg" className="flex-1 sm:flex-none" onClick={finish}>
              Créer mon plan <ArrowRight aria-hidden className="size-5" />
            </Button>
          ) : (
            <Button size="lg" className="flex-1 sm:flex-none" disabled={!canContinue} onClick={() => go(1)}>
              Continuer <ArrowRight aria-hidden className="size-5" />
            </Button>
          )}
        </div>
        <p className="mt-1 text-center text-xs font-semibold text-ink-muted sm:hidden" aria-hidden>
          {compatibleCount} recettes compatibles
        </p>
      </footer>
    </div>
  );
}
