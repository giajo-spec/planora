"use client";

import { Check, Home, ListRestart, Plus, RotateCcw, ShoppingBasket, Store, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button, IconButton } from "@/components/ui/button";
import { EmptyState, ProgressBar, Skeleton } from "@/components/ui/primitives";
import { useToast } from "@/components/ui/toast";
import { INGREDIENTS } from "@/lib/data/ingredients";
import { RECIPE_MAP } from "@/lib/data/recipes";
import { AISLE_LABELS, AISLE_ORDER } from "@/lib/domain/labels";
import type { Aisle, GroceryLine } from "@/lib/domain/types";
import { buildGroceryView, formatAmounts, type GroceryItemView } from "@/lib/grocery/grocery";
import { noPriceProvider } from "@/lib/grocery/price-provider";
import { useApp } from "@/lib/state/app-store";
import { cn } from "@/lib/utils/cn";

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function CheckButton({ checked, onClick, label }: { checked: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onClick}
      className="flex size-12 shrink-0 items-center justify-center rounded-full"
    >
      <span
        className={cn(
          "flex size-8 items-center justify-center rounded-xl border transition",
          checked ? "animate-check-pop border-ink bg-ink text-gold-light" : "border-ink-muted bg-surface",
        )}
      >
        {checked && <Check aria-hidden className="size-5" />}
      </span>
    </button>
  );
}

function GroceryRow({ item }: { item: GroceryItemView }) {
  const { toggleGroceryChecked, togglePantry, hideGroceryLine } = useApp();
  const { notify } = useToast();
  const { line, checked } = item;
  const ingredient = INGREDIENTS[line.ingredientId];
  const recipeNames = line.recipeIds.map((id) => RECIPE_MAP[id]?.name).filter(Boolean);

  return (
    <li className={cn("flex items-center gap-1 py-1.5 pr-1", checked && "opacity-60")}>
      <CheckButton checked={checked} onClick={() => toggleGroceryChecked(line)} label={`${capitalize(line.name)} — acheté`} />
      <div className="min-w-0 flex-1 py-1">
        <p className={cn("font-bold leading-snug", checked && "line-through decoration-2")}>{capitalize(line.name)}</p>
        <p className="text-sm font-semibold text-ink-soft">{formatAmounts(line, ingredient)}</p>
        <p className="truncate text-xs text-ink-muted" title={recipeNames.join(", ")}>
          {recipeNames.length === 1 ? recipeNames[0] : `${recipeNames.length} recettes`}
        </p>
        {item.changedSinceCheck && (
          <p className="mt-0.5 text-xs font-bold text-terra-deep">Quantité modifiée depuis l&apos;achat — vérifiez</p>
        )}
      </div>
      <IconButton
        label={`${capitalize(line.name)} : déjà à la maison`}
        tone="plain"
        onClick={() => {
          togglePantry(line.key);
          notify("Déplacé dans « Déjà à la maison »");
        }}
      >
        <Home aria-hidden className="size-5" />
      </IconButton>
      <IconButton
        label={`Supprimer ${line.name} de la liste`}
        tone="plain"
        onClick={() => {
          hideGroceryLine(line);
          notify("Article supprimé");
        }}
      >
        <Trash2 aria-hidden className="size-5" />
      </IconButton>
    </li>
  );
}

export function GroceryView() {
  const app = useApp();
  const { hydrated, plan, groceryLines, groceryState } = app;
  const { notify } = useToast();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [aisle, setAisle] = useState<Aisle>("autre");
  const view = useMemo(() => buildGroceryView(groceryLines, groceryState), [groceryLines, groceryState]);

  if (!hydrated) {
    return (
      <div className="page space-y-4" aria-busy="true">
        <Skeleton className="h-12 w-1/2" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  const empty = groceryLines.length === 0 && groceryState.manual.length === 0;
  const manualByAisle = AISLE_ORDER.map((a) => ({ aisle: a, items: groceryState.manual.filter((m) => m.aisle === a) })).filter((g) => g.items.length);

  return (
    <div className="page">
      <header className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{plan ? "Générée à partir de votre plan" : "Liste personnelle"}</p>
          <h1 className="text-display-lg">Épicerie</h1>
        </div>
        {!empty && (
          <div className="flex flex-wrap gap-2">
            {view.hiddenCount > 0 && (
              <Button variant="secondary" size="sm" onClick={() => { app.restoreHiddenGrocery(); notify("Articles supprimés restaurés"); }}>
                <RotateCcw aria-hidden className="size-4" /> Restaurer ({view.hiddenCount})
              </Button>
            )}
            {view.done > 0 && (
              <Button variant="secondary" size="sm" onClick={() => { app.clearGroceryChecked(); notify("Cases décochées"); }}>
                <ListRestart aria-hidden className="size-4" /> Tout décocher
              </Button>
            )}
          </div>
        )}
      </header>

      {!empty && (
        <div className="card mb-5 p-4">
          <div className="mb-2 flex items-baseline justify-between">
            <p className="font-bold">Progression</p>
            <p className="text-sm font-bold">
              <span className="font-display text-2xl font-semibold">{view.done}</span>
              <span className="text-ink-muted"> / {view.total} articles</span>
            </p>
          </div>
          <ProgressBar value={view.done} max={view.total} label="Articles achetés" />
          {view.total > 0 && view.done === view.total && <p className="mt-2 font-bold text-sage-deep">Tout est acheté. Bravo !</p>}
        </div>
      )}

      {/* Ajout manuel */}
      <form
        className="card mb-6 grid grid-cols-2 gap-2 p-4 sm:grid-cols-[1fr_8rem_12rem_auto]"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          app.addManualItem(name.trim(), quantity.trim(), aisle);
          setName("");
          setQuantity("");
          notify("Ajouté à la liste");
        }}
      >
        <label className="col-span-2 sm:col-span-1">
          <span className="sr-only">Article à ajouter</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ajouter un article (ex. : papier parchemin)" className="min-h-12 w-full rounded-2xl border border-line bg-paper px-4 font-semibold outline-none focus:border-ink" />
        </label>
        <label>
          <span className="sr-only">Quantité</span>
          <input value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Qté" className="min-h-12 w-full rounded-2xl border border-line bg-paper px-4 font-semibold outline-none focus:border-ink" />
        </label>
        <label>
          <span className="sr-only">Rayon</span>
          <select value={aisle} onChange={(e) => setAisle(e.target.value as Aisle)} className="min-h-12 w-full rounded-2xl border border-line bg-paper px-3 font-semibold outline-none focus:border-ink">
            {AISLE_ORDER.map((a) => (
              <option key={a} value={a}>
                {AISLE_LABELS[a]}
              </option>
            ))}
          </select>
        </label>
        <Button type="submit" className="col-span-2 sm:col-span-1" disabled={!name.trim()}>
          <Plus aria-hidden className="size-5" /> Ajouter
        </Button>
      </form>

      {empty ? (
        <EmptyState
          icon={<ShoppingBasket aria-hidden className="size-7" />}
          title="Votre liste est vide"
          action={
            <Link href={plan ? "/recettes" : "/questionnaire"} className="font-bold underline underline-offset-4">
              {plan ? "Ajouter une recette" : "Créer mon plan de repas"}
            </Link>
          }
        >
          Elle se remplit automatiquement à partir de votre plan de la semaine et des recettes que vous ajoutez.
        </EmptyState>
      ) : (
        <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[repeat(2,minmax(0,1fr))] lg:items-start">
          {view.toBuy.map(({ aisle: a, items }) => (
            <section key={a} aria-labelledby={`rayon-${a}`} className="card p-3 sm:p-4">
              <h2 id={`rayon-${a}`} className="mb-1 flex items-center justify-between px-2 text-lg font-semibold">
                {AISLE_LABELS[a]}
                <span className="rounded-full bg-paper-deep px-2.5 py-0.5 text-sm">
                  {items.filter((i) => i.checked).length}/{items.length}
                </span>
              </h2>
              <ul className="divide-y divide-line">
                {items.map((item) => (
                  <GroceryRow key={item.line.key} item={item} />
                ))}
              </ul>
            </section>
          ))}

          {manualByAisle.length > 0 && (
            <section aria-labelledby="ajouts" className="card p-3 sm:p-4">
              <h2 id="ajouts" className="mb-1 px-2 text-lg font-semibold">Mes ajouts</h2>
              <ul className="divide-y divide-line">
                {manualByAisle.flatMap(({ items }) =>
                  items.map((m) => (
                    <li key={m.id} className={cn("flex items-center gap-1 py-1.5", m.checked && "opacity-60")}>
                      <CheckButton checked={m.checked} onClick={() => app.toggleManualItem(m.id)} label={`${m.name} — acheté`} />
                      <div className="min-w-0 flex-1">
                        <p className={cn("font-bold", m.checked && "line-through decoration-2")}>{m.name}</p>
                        <p className="text-sm text-ink-muted">
                          {m.quantity ? `${m.quantity} · ` : ""}
                          {AISLE_LABELS[m.aisle]}
                        </p>
                      </div>
                      <IconButton label={`Supprimer ${m.name}`} tone="plain" onClick={() => app.removeManualItem(m.id)}>
                        <Trash2 aria-hidden className="size-5" />
                      </IconButton>
                    </li>
                  )),
                )}
              </ul>
            </section>
          )}

          {view.pantry.length > 0 && (
            <section aria-labelledby="maison" className="rounded-card border border-dashed border-line-strong p-3 sm:p-4">
              <h2 id="maison" className="mb-1 flex items-center gap-2 px-2 text-lg font-semibold">
                <Home aria-hidden className="size-5" /> Déjà à la maison
              </h2>
              <ul className="divide-y divide-line">
                {view.pantry.map((line: GroceryLine) => (
                  <li key={line.key} className="flex items-center gap-2 py-1.5 pl-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-bold">{capitalize(line.name)}</p>
                      <p className="text-sm text-ink-muted">{formatAmounts(line, INGREDIENTS[line.ingredientId])}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => app.togglePantry(line.key)}>
                      Remettre dans la liste
                    </Button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {groceryState.extras.length > 0 && (
            <section aria-labelledby="extras" className="card p-4">
              <h2 id="extras" className="mb-2 text-lg font-semibold">Recettes ajoutées hors plan</h2>
              <ul className="flex flex-wrap gap-2">
                {groceryState.extras.map((e) => (
                  <li key={e.recipeId} className="inline-flex items-center gap-1 rounded-full bg-paper-deep py-1 pl-4 pr-1 font-semibold">
                    <Link href={`/recettes/${e.recipeId}`} className="hover:underline">
                      {RECIPE_MAP[e.recipeId]?.name}
                    </Link>
                    <span className="text-sm text-ink-muted">· {String(e.servings).replace(".", ",")} port.</span>
                    <IconButton label={`Retirer ${RECIPE_MAP[e.recipeId]?.name} de la liste`} tone="plain" onClick={() => app.removeRecipeFromGrocery(e.recipeId)}>
                      <X aria-hidden className="size-4" />
                    </IconButton>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      {!noPriceProvider.available && (
        <p className="mt-8 flex items-start gap-2 text-sm text-ink-muted">
          <Store aria-hidden className="mt-0.5 size-4 shrink-0" />
          Les prix et la disponibilité dans les épiceries près de chez vous ne sont pas encore offerts. Aucun prix n&apos;est
          estimé ou inventé.
        </p>
      )}
    </div>
  );
}
