import type { Profile, SubscriptionPlan } from "@/lib/domain/types";
import { defaultTargets } from "@/lib/nutrition/nutrition";

/**
 * Formules PLANORA.
 *
 * Aucun paiement n'est activé dans ce prototype : choisir une formule
 * personnalise réellement l'application (priorités du planificateur, réglages
 * par défaut). Le paiement se branchera plus tard sur Stripe Checkout, côté
 * serveur (voir docs/ARCHITECTURE.md). Les prix sont des tarifs indicatifs.
 */

export interface PlanOffer {
  key: SubscriptionPlan;
  name: string;
  tagline: string;
  audience: string;
  /** Prix mensuel indicatif en dollars canadiens. */
  monthly: number;
  features: string[];
  /** Fonctions annoncées mais pas encore offertes (affichées comme telles). */
  soon: string[];
  highlight?: boolean;
}

export const PLAN_OFFERS: PlanOffer[] = [
  {
    key: "personnalise",
    name: "Personnalisé",
    tagline: "Votre menu, cousu main.",
    audience: "Pour vous, seul·e ou à deux",
    monthly: 9.99,
    features: [
      "Plan de 7 jours selon vos goûts, votre temps et votre équipement",
      "Vos aliments préférés mis en avant plus souvent",
      "Plus de 2 000 recettes filtrées selon vos allergies",
      "Liste d'épicerie automatique par rayon",
      "Cuisine guidée avec minuteries",
    ],
    soon: ["Recommandations selon votre historique"],
  },
  {
    key: "famille",
    name: "Famille",
    tagline: "Tout le monde à table, sans négocier.",
    audience: "Jusqu'à 10 personnes, enfants compris",
    monthly: 14.99,
    features: [
      "Tout ce qu'offre la formule Personnalisé",
      "Recettes « enfants » priorisées : douces, simples et amusantes",
      "Portions calculées pour toute la famille",
      "Plats à préparer d'avance pour les lunchs",
      "Collation quotidienne prévue au plan",
    ],
    soon: ["Un profil d'allergies par membre de la famille"],
    highlight: true,
  },
  {
    key: "en-forme",
    name: "En forme",
    tagline: "Nourrir l'entraînement, pas le compromis.",
    audience: "Gym, course, sports d'endurance",
    monthly: 12.99,
    features: [
      "Tout ce qu'offre la formule Personnalisé",
      "Recettes riches en protéines priorisées",
      "Objectifs de calories et de macros personnalisables",
      "Calculateur de protéines selon votre poids et votre sport",
      "Portions sportives (× 1,5) et idées avant/après l'entraînement",
    ],
    soon: ["Synchronisation avec les applications d'entraînement"],
  },
];

export const planOffer = (key: SubscriptionPlan | undefined) => PLAN_OFFERS.find((p) => p.key === key);

export function formatPrice(amount: number): string {
  return amount.toLocaleString("fr-CA", { style: "currency", currency: "CAD" });
}

/** Prix annuel indicatif : 2 mois offerts. */
export const yearlyPrice = (offer: PlanOffer) => Math.round(offer.monthly * 10 * 100) / 100;

/** Réglages recommandés appliqués au profil quand on choisit une formule. */
export function presetFor(plan: SubscriptionPlan, profile: Profile): Profile {
  switch (plan) {
    case "famille":
      return {
        ...profile,
        subscription: plan,
        householdSize: Math.max(profile.householdSize, 3),
        childrenCount: Math.max(profile.childrenCount ?? 0, 1),
        meals: profile.meals.includes("collation") ? profile.meals : [...profile.meals, "collation"],
      };
    case "en-forme":
      return {
        ...profile,
        subscription: plan,
        goal: profile.goal === "equilibre" ? "prise-muscle" : profile.goal,
        targets: profile.goal === "equilibre" ? defaultTargets("prise-muscle") : profile.targets,
        nutritionFocus: profile.nutritionFocus.includes("proteines") ? profile.nutritionFocus : [...profile.nutritionFocus, "proteines"],
        portionFactor: Math.max(profile.portionFactor, 1.5),
      };
    case "personnalise":
    default:
      return { ...profile, subscription: plan };
  }
}
