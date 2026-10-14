/**
 * Types du domaine — partagés par les données, la logique métier et l'interface.
 * Aucune dépendance React ici : ces types doivent pouvoir être réutilisés côté
 * serveur (future API, Supabase) ou dans une application React Native.
 */

/* ------------------------------------------------------------------ */
/* Allergènes, régimes, équipements                                    */
/* ------------------------------------------------------------------ */

/** Allergènes prioritaires reconnus par Santé Canada (+ gluten). */
export type Allergen =
  | "arachides"
  | "noix"
  | "lait"
  | "oeufs"
  | "poisson"
  | "fruits-de-mer"
  | "soja"
  | "gluten"
  | "sesame"
  | "moutarde"
  | "sulfites";

export type Diet =
  | "omnivore"
  | "flexitarien"
  | "pescetarien"
  | "vegetarien"
  | "vegetalien";

/** Restrictions non allergènes (choix personnels, culturels…). */
export type Restriction = "sans-porc" | "sans-alcool";

/** Catégorie animale d'un ingrédient — sert à déduire la compatibilité des régimes. */
export type AnimalCategory = "viande" | "poisson" | "oeuf" | "laitier" | "miel";

export type Equipment =
  | "four"
  | "mijoteuse"
  | "friteuse-air"
  | "melangeur"
  | "robot-culinaire"
  | "autocuiseur";

export type Aisle =
  | "fruits-legumes"
  | "viandes"
  | "poissons"
  | "produits-laitiers"
  | "boulangerie"
  | "epicerie-seche"
  | "conserves"
  | "epices"
  | "international"
  | "surgeles"
  | "autre";

/* ------------------------------------------------------------------ */
/* Ingrédients                                                         */
/* ------------------------------------------------------------------ */

/** Valeurs nutritives pour 100 g (estimations de démonstration). */
export interface NutritionPer100g {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export interface Ingredient {
  id: string;
  name: string;
  /** Pluriel utilisé pour les unités dénombrables (« 2 oignons »). */
  plural?: string;
  aisle: Aisle;
  allergens: Allergen[];
  animal?: AnimalCategory;
  /** Restrictions que cet ingrédient enfreint (contient du porc, de l'alcool…). */
  violates?: Restriction[];
  nutrition: NutritionPer100g;
  /** Masse moyenne d'une unité (œuf ≈ 50 g). Requis pour l'unité « unite ». */
  gramsPerUnit?: number;
  /** Densité en g/ml. Requis pour convertir un volume en masse. Défaut : 1. */
  density?: number;
  /** Plus petit incrément sensé pour une unité dénombrable (1 œuf, ½ citron). */
  countStep?: number;
}

/* ------------------------------------------------------------------ */
/* Recettes                                                            */
/* ------------------------------------------------------------------ */

export type Unit = "g" | "kg" | "ml" | "l" | "unite" | "c-soupe" | "c-the" | "pincee";

export interface Quantity {
  amount: number;
  unit: Unit;
}

export interface RecipeIngredient extends Quantity {
  ingredientId: string;
  /** Précision affichée : « en dés », « rincés »… */
  note?: string;
  optional?: boolean;
}

export type MealType = "dejeuner" | "diner" | "souper" | "collation";
export type Difficulty = "facile" | "moyen" | "avance";

export type RecipeTag =
  | "riche-proteines"
  | "pre-entrainement"
  | "post-entrainement"
  | "rapide"
  | "prep-avance"
  | "familial"
  | "enfants";

/** Style de l'illustration générée quand aucune photo n'est disponible. */
export type Illustration =
  | "bol"
  | "assiette"
  | "pates"
  | "soupe"
  | "verre"
  | "wrap"
  | "plaque"
  | "tartine"
  | "pot"
  | "cocotte"
  | "burger"
  | "brochettes"
  | "papillote"
  | "gratin";

export interface StepTimer {
  label: string;
  seconds: number;
}

export interface Faq {
  question: string;
  answer: string;
}

/** Utilisation d'un ingrédient (par index) dans une étape ; `part` = fraction utilisée. */
export interface StepIngredientUse {
  index: number;
  part?: number;
}

export interface RecipeStep {
  text: string;
  /** Temps indicatif de l'étape, en minutes. */
  minutes?: number;
  timers?: StepTimer[];
  uses?: StepIngredientUse[];
  /** Conseil destiné aux débutants. */
  tip?: string;
  faq?: Faq[];
}

export interface Substitution {
  from: string;
  to: string;
  note?: string;
}

export interface FirstTimeGuide {
  utensils: string[];
  prep: string[];
  techniques: string[];
  /** Comment reconnaître une cuisson adéquate (températures internes…). */
  doneness: string[];
  safety: string[];
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  mealTypes: MealType[];
  /** Nombre de portions de référence des quantités. */
  servings: number;
  prepMinutes: number;
  cookMinutes: number;
  difficulty: Difficulty;
  equipment: Equipment[];
  tags: RecipeTag[];
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  tips: string[];
  substitutions: Substitution[];
  firstTime: FirstTimeGuide;
  illustration?: Illustration;
  /** Type de plat (bol, curry, burger…) : sert à varier le plan et le catalogue. */
  family?: string;
  /** Recette composée par le moteur de génération (src/lib/data/generator). */
  generated?: boolean;
}

/* ------------------------------------------------------------------ */
/* Nutrition calculée                                                  */
/* ------------------------------------------------------------------ */

export interface Nutrition {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

/* ------------------------------------------------------------------ */
/* Profil                                                              */
/* ------------------------------------------------------------------ */

export type Goal = "equilibre" | "perte-gras" | "prise-muscle" | "maintien";
export type CookingLevel = "debutant" | "intermediaire" | "avance";
/** Temps maximal souhaité par repas, en minutes. */
export type TimeBudget = 15 | 30 | 45 | 60 | 90;
export type NutritionFocus = "proteines" | "calories" | "glucides" | "lipides";
/** Formules d'abonnement PLANORA. */
export type SubscriptionPlan = "personnalise" | "famille" | "en-forme";

export interface NutritionTargets {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Profile {
  name: string;
  householdSize: number;
  diet: Diet;
  likedIngredients: string[];
  dislikedIngredients: string[];
  allergens: Allergen[];
  restrictions: Restriction[];
  cookingLevel: CookingLevel;
  timeBudget: TimeBudget;
  equipment: Equipment[];
  meals: MealType[];
  /** Nombre de collations par jour lorsque « collation » est planifiée. */
  snacksPerDay: number;
  goal: Goal;
  nutritionFocus: NutritionFocus[];
  /** Cibles quotidiennes par personne. */
  targets: NutritionTargets;
  /** Facteur de portion de l'utilisateur principal (sportif : 1,5). */
  portionFactor: number;
  /** Formule choisie (aucun paiement n'est activé dans ce prototype). */
  subscription?: SubscriptionPlan;
  /** Nombre d'enfants dans le foyer (favorise les recettes « enfants »). */
  childrenCount?: number;
  /** Profil généré par « Découvrir l'application ». */
  isDemo?: boolean;
  createdAt: string;
}

/* ------------------------------------------------------------------ */
/* Plan de repas                                                       */
/* ------------------------------------------------------------------ */

export interface PlannedMeal {
  id: string;
  recipeId: string;
  slot: MealType;
  servings: number;
  locked: boolean;
  /** Repas préparé (suivi de l'avancement). */
  done: boolean;
}

export interface PlanDay {
  /** Date ISO (AAAA-MM-JJ). */
  date: string;
  meals: PlannedMeal[];
}

export interface MealPlan {
  id: string;
  createdAt: string;
  days: PlanDay[];
  /** Graine utilisée par le générateur (reproductibilité). */
  seed: number;
}

/* ------------------------------------------------------------------ */
/* Liste d'épicerie                                                    */
/* ------------------------------------------------------------------ */

export interface GroceryAmount {
  amount: number;
  unit: Unit;
}

export interface GroceryLine {
  /** Clé stable = id de l'ingrédient (les cases cochées survivent aux régénérations). */
  key: string;
  ingredientId: string;
  name: string;
  aisle: Aisle;
  amounts: GroceryAmount[];
  recipeIds: string[];
}

export interface ManualGroceryItem {
  id: string;
  name: string;
  quantity: string;
  aisle: Aisle;
  checked: boolean;
}

export interface ExtraRecipe {
  recipeId: string;
  servings: number;
}

export interface GroceryState {
  /** Clé → signature des quantités au moment où l'article a été coché. */
  checked: Record<string, string>;
  /** Ingrédients déjà disponibles à la maison. */
  pantry: Record<string, boolean>;
  /** Clé → signature des quantités au moment de la suppression (réapparaît si elles changent). */
  hidden: Record<string, string>;
  manual: ManualGroceryItem[];
  extras: ExtraRecipe[];
}
