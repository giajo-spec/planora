"use client";

import { Cloud, CreditCard, Dumbbell, LogIn, Pencil, ShieldAlert, Sparkles, Store, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RequireProfile } from "@/components/layout/require-profile";
import { Button, ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/primitives";
import { Sheet } from "@/components/ui/sheet";
import { INGREDIENTS } from "@/lib/data/ingredients";
import {
  ALLERGEN_LABELS,
  DIET_LABELS,
  EQUIPMENT_LABELS,
  FOCUS_LABELS,
  GOAL_LABELS,
  LEVEL_LABELS,
  MEAL_LABELS,
  RESTRICTION_LABELS,
} from "@/lib/domain/labels";
import type { Profile } from "@/lib/domain/types";
import { formatMinutes } from "@/components/recipe/recipe-meta";
import { useApp } from "@/lib/state/app-store";
import { planOffer } from "@/lib/subscriptions";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[12rem_1fr]">
      <dt className="text-sm font-bold text-ink-muted">{label}</dt>
      <dd className="font-semibold">{children}</dd>
    </div>
  );
}

function ingredientNames(ids: string[]) {
  return ids.length ? ids.map((id) => INGREDIENTS[id]?.name ?? id).join(", ") : "—";
}

export function ProfileView() {
  return <RequireProfile>{({ profile }) => <ProfileContent profile={profile} />}</RequireProfile>;
}

const FUTURE = [
  { icon: LogIn, title: "Compte utilisateur", text: "Connexion par courriel (Supabase Auth). Remplacera le stockage local via un autre StorageAdapter." },
  { icon: Cloud, title: "Sauvegarde et synchronisation", text: "Vos données sur tous vos appareils (table user_state protégée par RLS)." },
  { icon: Sparkles, title: "Personnalisation par IA", text: "Planification et réponses de cuisine générées côté serveur, avec historique de vos repas." },
  { icon: CreditCard, title: "Paiement des formules", text: "Paiement sécurisé par Stripe Checkout, géré côté serveur ; les formules sont déjà utilisables." },
  { icon: Store, title: "Prix des épiceries", text: "Prix et disponibilités de commerces locaux, via un PriceProvider serveur." },
];

function ProfileContent({ profile }: { profile: Profile }) {
  const { resetAll } = useApp();
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);

  return (
    <div className="page space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{profile.isDemo ? "Profil de démonstration" : "Votre profil alimentaire"}</p>
          <h1 className="text-display-lg">{profile.name || "Mon profil"}</h1>
        </div>
        <ButtonLink href="/questionnaire" variant="dark">
          <Pencil aria-hidden className="size-4" /> {profile.isDemo ? "Créer mon profil" : "Modifier mes réponses"}
        </ButtonLink>
      </header>

      <section aria-labelledby="formule" className="flex flex-col gap-4 rounded-card bg-ink p-6 text-paper sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p id="formule" className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-gold-light">Ma formule</p>
          <p className="mt-1 font-display text-3xl">{planOffer(profile.subscription)?.name ?? "Aucune formule choisie"}</p>
          <p className="mt-1 text-sm text-paper/70">{planOffer(profile.subscription)?.audience ?? "Personnalisé, Famille ou En forme : chaque formule adapte vos menus."}</p>
        </div>
        <ButtonLink href="/abonnements" variant="gold">
          {profile.subscription ? "Changer de formule" : "Choisir ma formule"}
        </ButtonLink>
      </section>

      <section aria-labelledby="contraintes" className="rounded-card border border-ink bg-surface p-5">
        <h2 id="contraintes" className="flex items-center gap-2 text-xl font-semibold">
          <ShieldAlert aria-hidden className="size-5 text-terra-deep" /> Contraintes strictes
        </h2>
        <p className="mt-1 text-sm text-ink-muted">Jamais enfreintes : ni dans le plan, ni dans les remplacements, ni dans les suggestions.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge tone="dark">{DIET_LABELS[profile.diet]}</Badge>
          {profile.allergens.map((a) => (
            <Badge key={a} tone="danger">Allergie : {ALLERGEN_LABELS[a]}</Badge>
          ))}
          {profile.restrictions.map((r) => (
            <Badge key={r} tone="amber">{RESTRICTION_LABELS[r]}</Badge>
          ))}
          {profile.allergens.length === 0 && profile.restrictions.length === 0 && <span className="text-sm font-semibold">Aucune allergie déclarée.</span>}
        </div>
      </section>

      <section aria-labelledby="details" className="card p-5">
        <h2 id="details" className="text-xl font-semibold">Préférences</h2>
        <dl className="mt-2 divide-y divide-line">
          <Row label="Foyer">
            {profile.householdSize} personne{profile.householdSize > 1 ? "s" : ""}
            {(profile.childrenCount ?? 0) > 0 && `, dont ${profile.childrenCount} enfant${(profile.childrenCount ?? 0) > 1 ? "s" : ""}`}
          </Row>
          <Row label="Aime">{ingredientNames(profile.likedIngredients)}</Row>
          <Row label="Évite">{ingredientNames(profile.dislikedIngredients)}</Row>
          <Row label="Niveau en cuisine">{LEVEL_LABELS[profile.cookingLevel]}</Row>
          <Row label="Temps par repas">{formatMinutes(profile.timeBudget)}</Row>
          <Row label="Équipement">{profile.equipment.length ? profile.equipment.map((e) => EQUIPMENT_LABELS[e]).join(", ") : "Équipement de base"}</Row>
          <Row label="Repas planifiés">
            {profile.meals.map((m) => (m === "collation" ? `${profile.snacksPerDay} collation${profile.snacksPerDay > 1 ? "s" : ""}` : MEAL_LABELS[m])).join(", ")}
          </Row>
          <Row label="Objectif">{GOAL_LABELS[profile.goal]}</Row>
          <Row label="Priorités">{profile.nutritionFocus.length ? profile.nutritionFocus.map((f) => FOCUS_LABELS[f]).join(", ") : "—"}</Row>
          <Row label="Cibles quotidiennes">
            {profile.targets.kcal} kcal · {profile.targets.protein} g protéines · {profile.targets.carbs} g glucides · {profile.targets.fat} g lipides{" "}
            <Link href="/en-forme" className="ml-1 inline-flex min-h-tap items-center gap-1 font-bold underline underline-offset-4">
              <Dumbbell aria-hidden className="size-4" /> Ajuster
            </Link>
          </Row>
        </dl>
      </section>

      <section aria-labelledby="donnees" className="card p-5">
        <h2 id="donnees" className="text-xl font-semibold">Vos données</h2>
        <p className="mt-2 text-ink-soft">
          Profil, menu, verrous, portions et liste d&apos;épicerie sont enregistrés uniquement dans ce navigateur. Aucun compte,
          aucun envoi à un serveur.
        </p>
        <Button variant="ghost" className="mt-3 text-danger" onClick={() => setConfirm(true)}>
          <Trash2 aria-hidden className="size-5" /> Effacer toutes mes données
        </Button>
      </section>

      <section aria-labelledby="bientot">
        <h2 id="bientot" className="text-xl font-semibold">Bientôt dans PLANORA</h2>
        <p className="mt-1 text-sm text-ink-muted">Ces fonctions ne sont pas encore offertes — rien n&apos;est simulé.</p>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {FUTURE.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-3 rounded-3xl bg-paper-deep p-4">
              <Icon aria-hidden className="mt-0.5 size-5 shrink-0" />
              <span>
                <span className="block font-bold">{title}</span>
                <span className="text-sm text-ink-soft">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <Sheet
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Effacer toutes vos données ?"
        description="Profil, plan, verrous et liste d'épicerie seront supprimés de ce navigateur. Cette action est irréversible."
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1" onClick={() => setConfirm(false)}>
              Annuler
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={async () => {
                await resetAll();
                setConfirm(false);
                router.push("/");
              }}
            >
              Tout effacer
            </Button>
          </div>
        }
      >
        <p className="text-ink-soft">Vous pourrez recommencer le questionnaire à tout moment.</p>
      </Sheet>
    </div>
  );
}
