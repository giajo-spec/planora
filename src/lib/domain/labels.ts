import type {
  Aisle,
  Allergen,
  CookingLevel,
  Diet,
  Difficulty,
  Equipment,
  Goal,
  MealType,
  NutritionFocus,
  Restriction,
  Unit,
} from "./types";

/** Libellés français (Québec) de l'interface. */

export const MEAL_LABELS: Record<MealType, string> = {
  dejeuner: "Déjeuner",
  diner: "Dîner",
  souper: "Souper",
  collation: "Collation",
};

export const MEAL_ORDER: MealType[] = ["dejeuner", "diner", "collation", "souper"];

export const ALLERGEN_LABELS: Record<Allergen, string> = {
  arachides: "Arachides",
  noix: "Noix (fruits à coque)",
  lait: "Lait et produits laitiers",
  oeufs: "Œufs",
  poisson: "Poisson",
  "fruits-de-mer": "Crustacés et mollusques",
  soja: "Soya",
  gluten: "Blé et gluten",
  sesame: "Sésame",
  moutarde: "Moutarde",
  sulfites: "Sulfites",
};

export const DIET_LABELS: Record<Diet, string> = {
  omnivore: "Omnivore",
  flexitarien: "Flexitarien",
  pescetarien: "Pescétarien",
  vegetarien: "Végétarien",
  vegetalien: "Végétalien",
};

export const DIET_DESCRIPTIONS: Record<Diet, string> = {
  omnivore: "Je mange de tout.",
  flexitarien: "Surtout végétal, un peu de viande.",
  pescetarien: "Poisson et fruits de mer, pas de viande.",
  vegetarien: "Ni viande ni poisson.",
  vegetalien: "Aucun produit d'origine animale.",
};

export const RESTRICTION_LABELS: Record<Restriction, string> = {
  "sans-porc": "Sans porc",
  "sans-alcool": "Sans alcool (même en cuisson)",
};

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  four: "Four",
  mijoteuse: "Mijoteuse",
  "friteuse-air": "Friteuse à air",
  melangeur: "Mélangeur",
  "robot-culinaire": "Robot culinaire",
  autocuiseur: "Autocuiseur (Instant Pot)",
};

export const AISLE_LABELS: Record<Aisle, string> = {
  "fruits-legumes": "Fruits et légumes",
  viandes: "Viandes et volailles",
  poissons: "Poissons et fruits de mer",
  "produits-laitiers": "Produits laitiers et réfrigérés",
  boulangerie: "Boulangerie",
  "epicerie-seche": "Épicerie sèche",
  conserves: "Conserves et bouillons",
  epices: "Épices et assaisonnements",
  international: "Produits internationaux",
  surgeles: "Surgelés",
  autre: "Autres",
};

export const AISLE_ORDER: Aisle[] = [
  "fruits-legumes",
  "viandes",
  "poissons",
  "produits-laitiers",
  "boulangerie",
  "surgeles",
  "epicerie-seche",
  "conserves",
  "international",
  "epices",
  "autre",
];

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  facile: "Facile",
  moyen: "Intermédiaire",
  avance: "Avancé",
};

export const LEVEL_LABELS: Record<CookingLevel, string> = {
  debutant: "Débutant",
  intermediaire: "À l'aise",
  avance: "Passionné",
};

export const LEVEL_DESCRIPTIONS: Record<CookingLevel, string> = {
  debutant: "Je suis les recettes pas à pas.",
  intermediaire: "Je maîtrise les bases.",
  avance: "J'aime les défis en cuisine.",
};

export const GOAL_LABELS: Record<Goal, string> = {
  equilibre: "Manger équilibré",
  "perte-gras": "Perdre du gras",
  "prise-muscle": "Prendre du muscle",
  maintien: "Maintenir mon poids",
};

export const GOAL_DESCRIPTIONS: Record<Goal, string> = {
  equilibre: "Variété, légumes et plaisir au quotidien.",
  "perte-gras": "Repas rassasiants, plus de protéines, moins de calories.",
  "prise-muscle": "Plus de protéines et d'énergie pour progresser.",
  maintien: "Garder le cap avec des repas réguliers.",
};

export const FOCUS_LABELS: Record<NutritionFocus, string> = {
  proteines: "Plus de protéines",
  calories: "Surveiller les calories",
  glucides: "Moins de glucides",
  lipides: "Moins de lipides",
};

export const UNIT_LABELS: Record<Unit, { one: string; many: string }> = {
  g: { one: "g", many: "g" },
  kg: { one: "kg", many: "kg" },
  ml: { one: "ml", many: "ml" },
  l: { one: "L", many: "L" },
  unite: { one: "", many: "" },
  "c-soupe": { one: "c. à soupe", many: "c. à soupe" },
  "c-the": { one: "c. à thé", many: "c. à thé" },
  pincee: { one: "pincée", many: "pincées" },
};
