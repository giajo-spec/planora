import type { Recipe } from "@/lib/domain/types";
import { isHighProtein } from "@/lib/nutrition/nutrition";
import { isDietCompatible, totalMinutes } from "./analysis";

/** Collections éditoriales du catalogue (fonctions pures). */
export type CollectionKey =
  | "enfants"
  | "famille"
  | "proteines"
  | "express"
  | "vegetarien"
  | "vegetalien"
  | "prep-avance"
  | "avant-entrainement"
  | "apres-entrainement"
  | "signatures";

export interface Collection {
  key: CollectionKey;
  title: string;
  subtitle: string;
  /** Recette d'illustration de la carte. */
  coverId: string;
  test: (r: Recipe) => boolean;
}

export const COLLECTIONS: Collection[] = [
  { key: "signatures", title: "Signatures du chef", subtitle: "Nos recettes écrites à la main", coverId: "poulet-tikka", test: (r) => !r.generated },
  { key: "enfants", title: "Pour les enfants", subtitle: "Doux, simples et amusants", coverId: "pizzas-tortillas-mais-poivron", test: (r) => r.tags.includes("enfants") },
  { key: "famille", title: "En famille", subtitle: "Des plats qui plaisent à tous", coverId: "plaque-erable-moutarde-poulet-patate-brocoli", test: (r) => r.tags.includes("familial") },
  { key: "proteines", title: "Riches en protéines", subtitle: "Pour la salle et la récupération", coverId: "bol-teriyaki-saumon-riz-jasmin-brocoli-carotte", test: isHighProtein },
  { key: "express", title: "Express 25 min", subtitle: "Les soirs pressés", coverId: "pates-penne-tomate-basilic-poulet-epinards-tomates", test: (r) => totalMinutes(r) <= 25 },
  { key: "vegetarien", title: "Végétarien", subtitle: "Ni viande ni poisson", coverId: "bol-libanais-pois-chiches-quinoa-chou-concombre-tomate", test: (r) => isDietCompatible(r, "vegetarien") },
  { key: "vegetalien", title: "Végétalien", subtitle: "100 % végétal", coverId: "soupe-coco-cari-lentilles-kale-patate", test: (r) => isDietCompatible(r, "vegetalien") },
  { key: "prep-avance", title: "À préparer d'avance", subtitle: "Lunchs et batch cooking", coverId: "gruau-nuit-petits-fruits-amandes-lait", test: (r) => r.tags.includes("prep-avance") },
  { key: "avant-entrainement", title: "Avant l'entraînement", subtitle: "De l'énergie qui se digère bien", coverId: "boules-energie-arachide-cacao", test: (r) => r.tags.includes("pre-entrainement") },
  { key: "apres-entrainement", title: "Après l'entraînement", subtitle: "Protéines et récupération", coverId: "smoothie-banane-petits-fruits-yogourt-lait", test: (r) => r.tags.includes("post-entrainement") },
];

export const collectionByKey = (key: string | null | undefined): Collection | undefined => COLLECTIONS.find((c) => c.key === key);
