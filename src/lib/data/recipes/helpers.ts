import type { RecipeIngredient, Unit } from "@/lib/domain/types";

/** Raccourci d'écriture des ingrédients de recette. */
export function ing(
  ingredientId: string,
  amount: number,
  unit: Unit,
  extra: { note?: string; optional?: boolean } = {},
): RecipeIngredient {
  return { ingredientId, amount, unit, ...extra };
}

/** Repères de sécurité alimentaire (Santé Canada) réutilisés par les guides. */
export const SAFETY = {
  hands: "Lavez-vous les mains 20 secondes à l'eau savonneuse avant de cuisiner et après avoir touché de la viande, du poisson ou des œufs crus.",
  boards: "Utilisez une planche à découper distincte pour les aliments crus (viande, poisson) et pour les aliments prêts à manger.",
  fridge: "Réfrigérez les restes dans les 2 heures, dans des contenants hermétiques ; consommez-les dans les 3 à 4 jours.",
  reheat: "Réchauffez les restes jusqu'à ce qu'ils atteignent 74 °C à cœur.",
  thermometer: "Un thermomètre numérique à lecture instantanée est le seul moyen fiable de vérifier une cuisson : insérez-le au centre de la pièce la plus épaisse.",
  marinade: "Ne réutilisez jamais une marinade qui a touché de la viande crue sans l'avoir fait bouillir au moins 1 minute.",
  hotOil: "Gardez les manches de casseroles tournés vers l'intérieur et n'ajoutez jamais d'eau dans l'huile chaude.",
} as const;

export const DONENESS = {
  poultry: "Volaille (morceaux ou haché) : 74 °C à cœur. Le jus doit être clair et la chair ne doit plus être rosée.",
  beefStrips: "Bœuf en lanières (pièce entière) : 63 °C pour mi-saignant, 71 °C pour à point.",
  fish: "Poisson : 70 °C à cœur ; la chair devient opaque et se défait facilement à la fourchette.",
  shellfish: "Crevettes : 74 °C ; elles deviennent roses, opaques et forment un « C » (un « O » serré signifie trop cuites).",
  eggs: "Plats aux œufs : 71 °C. Pour les femmes enceintes, les jeunes enfants et les aînés, cuisez les œufs jusqu'à ce que le jaune soit ferme.",
  legumes: "Légumineuses : tendres sous la dent, elles s'écrasent facilement entre deux doigts.",
} as const;
