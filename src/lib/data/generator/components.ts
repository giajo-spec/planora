import type { Difficulty, Faq, RecipeIngredient, StepTimer, Substitution } from "@/lib/domain/types";
import { DONENESS, SAFETY, ing } from "../recipes/helpers";
import { timer } from "./builder";

/**
 * Briques du moteur de composition. Toutes les quantités sont pour 4 portions.
 * Chaque brique décrit ses ingrédients normalisés (donc ses allergènes) et
 * sa méthode de cuisson : le moteur ne fait que les assembler.
 */

export interface Cooking {
  text: string;
  items?: RecipeIngredient[];
  minutes: number;
  timers?: StepTimer[];
  tip?: string;
  faq?: Faq[];
}

export interface Protein {
  key: string;
  /** « au poulet » */
  with: string;
  /** « de poulet » */
  of: string;
  /** « le poulet » (dans les phrases d'assemblage) */
  the: string;
  items: RecipeIngredient[];
  pan?: Cooking;
  oven?: Cooking;
  soup?: Cooking;
  /** Utilisable sans cuisson (thon, lentilles en conserve). */
  ready?: Cooking;
  doneness: string;
  prep: string;
  difficulty: Difficulty;
  rawAnimal: boolean;
  kid: boolean;
  substitution?: Substitution;
}

const oil = (amount = 1) => ing("huile-vegetale", amount, "c-soupe");

export const PROTEINS: Protein[] = [
  {
    key: "poulet",
    with: "au poulet",
    of: "de poulet",
    the: "le poulet",
    items: [ing("poitrine-poulet", 500, "g")],
    pan: {
      text: "Épongez le poulet et coupez-le en lanières. Chauffez l'huile dans une grande poêle à feu moyen-vif et saisissez-le 6 à 7 minutes en le retournant, jusqu'à 74 °C à cœur. Salez légèrement.",
      items: [oil(), ing("sel", 0.5, "c-the")],
      minutes: 8,
      timers: [timer("Poulet", 7)],
      tip: "Ne déplacez pas les lanières pendant la première minute : elles dorent mieux et collent moins.",
      faq: [{ question: "Comment savoir si le poulet est cuit sans thermomètre ?", answer: "Coupez le morceau le plus épais : la chair doit être blanche, sans trace rosée, et le jus clair. Le thermomètre (74 °C) reste la méthode la plus sûre." }],
    },
    oven: {
      text: "Ajoutez les poitrines de poulet sur la plaque, badigeonnez-les du reste de l'assaisonnement et poursuivez la cuisson 20 minutes, jusqu'à 74 °C à cœur. Laissez reposer 5 minutes avant de trancher.",
      items: [ing("sel", 0.5, "c-the")],
      minutes: 25,
      timers: [timer("Poulet au four", 20), timer("Repos", 5)],
    },
    soup: {
      text: "Ajoutez le poulet coupé en cubes de 2 cm et laissez mijoter 12 minutes, jusqu'à ce qu'il atteigne 74 °C.",
      minutes: 12,
      timers: [timer("Poulet", 12)],
    },
    doneness: DONENESS.poultry,
    prep: "Coupez le poulet sur une planche réservée à la viande crue.",
    difficulty: "facile",
    rawAnimal: true,
    kid: true,
    substitution: { from: "Poulet", to: "Tofu extra-ferme", note: "Version végétalienne, même cuisson." },
  },
  {
    key: "dinde",
    with: "à la dinde",
    of: "de dinde",
    the: "la dinde",
    items: [ing("dinde-hachee", 450, "g")],
    pan: {
      text: "Chauffez l'huile dans une grande poêle à feu moyen-vif. Faites dorer la dinde hachée 7 à 8 minutes en l'émiettant à la cuillère, jusqu'à ce qu'elle ne soit plus rosée (74 °C). Salez.",
      items: [oil(), ing("sel", 0.5, "c-the")],
      minutes: 8,
      timers: [timer("Dinde hachée", 8)],
    },
    doneness: DONENESS.poultry,
    prep: "Gardez la viande hachée au réfrigérateur jusqu'au moment de cuire.",
    difficulty: "facile",
    rawAnimal: true,
    kid: true,
    substitution: { from: "Dinde hachée", to: "Lentilles cuites", note: "Version végétarienne." },
  },
  {
    key: "boeuf",
    with: "au bœuf",
    of: "de bœuf",
    the: "le bœuf",
    items: [ing("boeuf-surlonge", 450, "g")],
    pan: {
      text: "Coupez le bœuf en fines lanières, contre le grain. Chauffez l'huile à feu vif et saisissez-le en 2 fournées, 1 à 2 minutes par fournée (63 °C pour mi-saignant, 71 °C pour à point). Réservez.",
      items: [oil(), ing("sel", 0.5, "c-the")],
      minutes: 5,
      timers: [timer("Bœuf — fournée 1", 2), timer("Bœuf — fournée 2", 2)],
      tip: "15 minutes au congélateur rendent la viande beaucoup plus facile à trancher finement.",
      faq: [{ question: "Mon bœuf rend de l'eau au lieu de dorer.", answer: "La poêle n'est pas assez chaude ou trop pleine : attendez que l'huile ondule et cuisez en petites fournées." }],
    },
    doneness: DONENESS.beefStrips,
    prep: "Tranchez le bœuf perpendiculairement aux fibres pour qu'il reste tendre.",
    difficulty: "moyen",
    rawAnimal: true,
    kid: true,
    substitution: { from: "Bœuf", to: "Tofu extra-ferme pressé", note: "Version végétalienne." },
  },
  {
    key: "boeuf-hache",
    with: "au bœuf haché",
    of: "de bœuf haché",
    the: "le bœuf",
    items: [ing("boeuf-hache", 450, "g")],
    pan: {
      text: "Chauffez l'huile dans une grande poêle à feu moyen-vif. Faites dorer le bœuf haché 7 à 8 minutes en l'émiettant, jusqu'à ce qu'il ne soit plus rosé (71 °C). Salez et égouttez l'excès de gras.",
      items: [oil(), ing("sel", 0.5, "c-the")],
      minutes: 8,
      timers: [timer("Bœuf haché", 8)],
    },
    doneness: "Bœuf haché : toujours 71 °C à cœur, sans trace rosée.",
    prep: "Gardez la viande hachée au réfrigérateur jusqu'au moment de cuire.",
    difficulty: "facile",
    rawAnimal: true,
    kid: true,
    substitution: { from: "Bœuf haché", to: "Lentilles cuites", note: "Version végétarienne, plus riche en fibres." },
  },
  {
    key: "porc",
    with: "au porc",
    of: "de porc",
    the: "le porc",
    items: [ing("porc-filet", 500, "g")],
    pan: {
      text: "Tranchez le filet de porc en médaillons de 1,5 cm. Chauffez l'huile à feu moyen-vif et saisissez-les 3 minutes par côté, jusqu'à 71 °C à cœur. Salez.",
      items: [oil(), ing("sel", 0.5, "c-the")],
      minutes: 7,
      timers: [timer("Porc — côté 1", 3), timer("Porc — côté 2", 3)],
    },
    oven: {
      text: "Posez le filet de porc entier sur la plaque, badigeonnez-le du reste de l'assaisonnement et rôtissez 20 minutes, jusqu'à 71 °C à cœur. Laissez reposer 5 minutes, puis tranchez.",
      items: [ing("sel", 0.5, "c-the")],
      minutes: 25,
      timers: [timer("Porc au four", 20), timer("Repos", 5)],
    },
    doneness: "Porc : 71 °C à cœur ; un centre très légèrement rosé est normal à cette température.",
    prep: "Retirez la fine membrane argentée du filet avec la pointe d'un couteau.",
    difficulty: "moyen",
    rawAnimal: true,
    kid: true,
    substitution: { from: "Porc", to: "Poitrine de poulet", note: "Cuire jusqu'à 74 °C." },
  },
  {
    key: "saumon",
    with: "au saumon",
    of: "de saumon",
    the: "le saumon",
    items: [ing("saumon", 500, "g")],
    pan: {
      text: "Épongez le saumon et coupez-le en 4 pavés. Chauffez l'huile à feu moyen-vif et cuisez-le côté peau 4 minutes, puis 3 minutes de l'autre côté, jusqu'à 70 °C. Salez.",
      items: [oil(), ing("sel", 0.5, "c-the")],
      minutes: 8,
      timers: [timer("Saumon — côté peau", 4), timer("Saumon — 2e côté", 3)],
      faq: [{ question: "Comment savoir si le saumon est cuit ?", answer: "La chair devient opaque et se détache en flocons à la fourchette ; 70 °C au thermomètre." }],
    },
    oven: {
      text: "Ajoutez les pavés de saumon sur la plaque, badigeonnez-les du reste de l'assaisonnement et cuisez 12 minutes, jusqu'à 70 °C.",
      items: [ing("sel", 0.5, "c-the")],
      minutes: 12,
      timers: [timer("Saumon au four", 12)],
    },
    doneness: DONENESS.fish,
    prep: "Passez les doigts sur le filet pour repérer et retirer les arêtes.",
    difficulty: "moyen",
    rawAnimal: true,
    kid: true,
    substitution: { from: "Saumon", to: "Truite ou morue", note: "Ajustez le temps selon l'épaisseur." },
  },
  {
    key: "morue",
    with: "à la morue",
    of: "de morue",
    the: "la morue",
    items: [ing("morue", 500, "g")],
    pan: {
      text: "Épongez la morue et coupez-la en 4 morceaux. Chauffez l'huile à feu moyen et cuisez-la 3 à 4 minutes par côté, délicatement, jusqu'à ce qu'elle soit opaque (70 °C). Salez.",
      items: [oil(), ing("sel", 0.5, "c-the")],
      minutes: 8,
      timers: [timer("Morue — côté 1", 4), timer("Morue — côté 2", 3)],
      tip: "Retournez le poisson une seule fois, avec une spatule large : il est fragile.",
    },
    oven: {
      text: "Ajoutez les morceaux de morue sur la plaque, badigeonnez-les du reste de l'assaisonnement et cuisez 12 minutes, jusqu'à 70 °C.",
      items: [ing("sel", 0.5, "c-the")],
      minutes: 12,
      timers: [timer("Morue au four", 12)],
    },
    doneness: DONENESS.fish,
    prep: "Épongez bien le poisson avec du papier absorbant.",
    difficulty: "moyen",
    rawAnimal: true,
    kid: true,
  },
  {
    key: "crevettes",
    with: "aux crevettes",
    of: "de crevettes",
    the: "les crevettes",
    items: [ing("crevettes", 400, "g")],
    pan: {
      text: "Épongez les crevettes. Chauffez l'huile à feu vif et sautez-les 2 à 3 minutes, jusqu'à ce qu'elles soient roses et opaques. Salez.",
      items: [oil(), ing("sel", 0.25, "c-the")],
      minutes: 3,
      timers: [timer("Crevettes", 3)],
      faq: [{ question: "Mes crevettes sont surgelées.", answer: "Décongelez-les dans une passoire sous l'eau froide 5 à 10 minutes, puis épongez-les bien." }],
    },
    oven: {
      text: "Ajoutez les crevettes sur la plaque, mélangez-les avec le reste de l'assaisonnement et cuisez 8 minutes, jusqu'à ce qu'elles soient roses et opaques.",
      items: [ing("sel", 0.25, "c-the")],
      minutes: 8,
      timers: [timer("Crevettes au four", 8)],
    },
    soup: {
      text: "Ajoutez les crevettes les 3 dernières minutes de cuisson, jusqu'à ce qu'elles soient roses et opaques.",
      minutes: 3,
      timers: [timer("Crevettes", 3)],
    },
    doneness: DONENESS.shellfish,
    prep: "Décongelez les crevettes sous l'eau froide si nécessaire.",
    difficulty: "facile",
    rawAnimal: true,
    kid: false,
  },
  {
    key: "tofu",
    with: "au tofu croustillant",
    of: "de tofu",
    the: "le tofu",
    items: [ing("tofu-ferme", 450, "g"), ing("fecule-mais", 1, "c-soupe")],
    pan: {
      text: "Épongez le tofu, coupez-le en cubes et enrobez-le de fécule. Chauffez l'huile à feu moyen-vif et dorez-le 8 minutes en le retournant, jusqu'à ce qu'il soit croustillant. Salez.",
      items: [oil(2), ing("sel", 0.5, "c-the")],
      minutes: 8,
      timers: [timer("Tofu croustillant", 8)],
      tip: "Plus le tofu est sec, plus il devient croustillant : pressez-le 10 minutes entre deux linges.",
    },
    oven: {
      text: "Enrobez les cubes de tofu de fécule et du reste de l'assaisonnement, ajoutez-les sur la plaque et cuisez 20 minutes en les retournant à mi-cuisson.",
      items: [ing("sel", 0.5, "c-the")],
      minutes: 20,
      timers: [timer("Tofu au four", 20)],
    },
    soup: {
      text: "Ajoutez le tofu coupé en petits cubes et laissez mijoter 5 minutes.",
      minutes: 5,
      timers: [timer("Tofu", 5)],
    },
    doneness: "Tofu : doré sur toutes les faces et chaud au centre.",
    prep: "Pressez le tofu entre deux linges sous une poêle lourde pendant 10 minutes.",
    difficulty: "facile",
    rawAnimal: false,
    kid: true,
  },
  {
    key: "pois-chiches",
    with: "aux pois chiches grillés",
    of: "de pois chiches",
    the: "les pois chiches",
    items: [ing("pois-chiches", 500, "g", { note: "rincés et épongés" }), ing("paprika-fume", 1, "c-the")],
    pan: {
      text: "Chauffez l'huile à feu moyen-vif et faites griller les pois chiches avec le paprika 8 minutes, en remuant, jusqu'à ce qu'ils soient dorés. Salez.",
      items: [oil(), ing("sel", 0.5, "c-the")],
      minutes: 8,
      timers: [timer("Pois chiches grillés", 8)],
    },
    oven: {
      text: "Mélangez les pois chiches avec le paprika et le reste de l'assaisonnement, ajoutez-les sur la plaque et rôtissez 20 minutes, jusqu'à ce qu'ils soient croustillants.",
      items: [ing("sel", 0.5, "c-the")],
      minutes: 20,
      timers: [timer("Pois chiches au four", 20)],
    },
    soup: {
      text: "Ajoutez les pois chiches et le paprika, puis laissez mijoter 10 minutes.",
      minutes: 10,
      timers: [timer("Pois chiches", 10)],
    },
    doneness: DONENESS.legumes,
    prep: "Rincez les pois chiches et épongez-les bien pour qu'ils grillent au lieu de bouillir.",
    difficulty: "facile",
    rawAnimal: false,
    kid: true,
  },
  {
    key: "oeufs",
    with: "aux œufs mollets",
    of: "d'œufs",
    the: "les œufs",
    items: [ing("oeuf", 8, "unite")],
    pan: {
      text: "Plongez délicatement les œufs dans l'eau bouillante et cuisez-les 7 minutes. Refroidissez-les dans l'eau glacée, écalez-les et coupez-les en deux.",
      minutes: 9,
      timers: [timer("Œufs mollets", 7)],
      tip: "Une cuisson de 7 minutes donne un jaune fondant ; 10 minutes pour un jaune ferme (recommandé pour les personnes à risque).",
    },
    doneness: DONENESS.eggs,
    prep: "Sortez les œufs du réfrigérateur 10 minutes avant pour éviter qu'ils se fendent.",
    difficulty: "facile",
    rawAnimal: true,
    kid: true,
  },
  {
    key: "haricots-noirs",
    with: "aux haricots noirs",
    of: "de haricots noirs",
    the: "les haricots",
    items: [ing("haricots-noirs", 500, "g", { note: "rincés" }), ing("cumin", 1, "c-the")],
    pan: {
      text: "Réchauffez les haricots noirs avec le cumin et 3 c. à soupe d'eau 5 minutes à feu moyen, en écrasant légèrement quelques haricots. Salez.",
      items: [ing("sel", 0.25, "c-the")],
      minutes: 5,
      timers: [timer("Haricots noirs", 5)],
    },
    soup: {
      text: "Ajoutez les haricots noirs et le cumin, puis laissez mijoter 10 minutes.",
      minutes: 10,
      timers: [timer("Haricots", 10)],
    },
    doneness: DONENESS.legumes,
    prep: "Rincez les haricots en conserve pour retirer l'excès de sel.",
    difficulty: "facile",
    rawAnimal: false,
    kid: true,
  },
  {
    key: "lentilles",
    with: "aux lentilles",
    of: "de lentilles",
    the: "les lentilles",
    items: [ing("lentilles-conserve", 500, "g", { note: "rincées" })],
    pan: {
      text: "Réchauffez les lentilles 4 minutes à feu moyen avec 2 c. à soupe d'eau. Salez et poivrez.",
      items: [ing("sel", 0.25, "c-the")],
      minutes: 4,
      timers: [timer("Lentilles", 4)],
    },
    soup: {
      text: "Ajoutez les lentilles et laissez mijoter 8 minutes.",
      minutes: 8,
      timers: [timer("Lentilles", 8)],
    },
    doneness: DONENESS.legumes,
    prep: "Rincez les lentilles en conserve dans une passoire.",
    difficulty: "facile",
    rawAnimal: false,
    kid: true,
  },
  {
    key: "haricots-blancs",
    with: "aux haricots blancs",
    of: "de haricots blancs",
    the: "les haricots",
    items: [ing("haricots-blancs", 500, "g", { note: "rincés" })],
    soup: {
      text: "Ajoutez les haricots blancs et laissez mijoter 10 minutes.",
      minutes: 10,
      timers: [timer("Haricots blancs", 10)],
    },
    doneness: DONENESS.legumes,
    prep: "Rincez les haricots en conserve.",
    difficulty: "facile",
    rawAnimal: false,
    kid: true,
  },
  {
    key: "thon",
    with: "au thon",
    of: "de thon",
    the: "le thon",
    items: [ing("thon-conserve", 340, "g")],
    ready: { text: "Égouttez le thon et émiettez-le à la fourchette.", minutes: 2 },
    doneness: "Thon en conserve : déjà cuit, prêt à manger.",
    prep: "Choisissez du thon pâle, plus faible en mercure que le thon blanc.",
    difficulty: "facile",
    rawAnimal: false,
    kid: true,
  },
  {
    key: "tempeh",
    with: "au tempeh",
    of: "de tempeh",
    the: "le tempeh",
    items: [ing("tempeh", 300, "g")],
    pan: {
      text: "Coupez le tempeh en fines tranches. Chauffez l'huile à feu moyen et dorez-le 3 minutes par côté.",
      items: [oil(2), ing("sel", 0.25, "c-the")],
      minutes: 6,
      timers: [timer("Tempeh", 6)],
      tip: "Le tempeh absorbe très bien les sauces : ajoutez-la dès la fin de la cuisson.",
    },
    doneness: "Tempeh : bien doré des deux côtés.",
    prep: "Coupez le tempeh en tranches de 5 mm.",
    difficulty: "facile",
    rawAnimal: false,
    kid: false,
  },
];

export const proteinByKey = (key: string): Protein => {
  const p = PROTEINS.find((x) => x.key === key);
  if (!p) throw new Error(`Protéine inconnue : ${key}`);
  return p;
};

/* ------------------------------------------------------------------ */
/* Féculents                                                           */
/* ------------------------------------------------------------------ */

export interface Starch {
  key: string;
  label: string;
  items: RecipeIngredient[];
  cook: Cooking;
  substitution?: Substitution;
}

export const STARCHES: Record<string, Starch> = {
  "riz-basmati": {
    key: "riz-basmati",
    label: "riz basmati",
    items: [ing("riz-basmati", 300, "g")],
    cook: { text: "Rincez le riz basmati, puis cuisez-le dans 600 ml d'eau salée, à couvert et à feu doux, 12 minutes. Laissez reposer 5 minutes hors du feu.", minutes: 17, timers: [timer("Riz basmati", 12), timer("Repos du riz", 5)] },
  },
  "riz-jasmin": {
    key: "riz-jasmin",
    label: "riz jasmin",
    items: [ing("riz-jasmin", 300, "g")],
    cook: { text: "Rincez le riz jasmin, puis cuisez-le dans 450 ml d'eau, à couvert et à feu doux, 12 minutes. Laissez reposer 5 minutes.", minutes: 17, timers: [timer("Riz jasmin", 12), timer("Repos du riz", 5)] },
  },
  "riz-brun": {
    key: "riz-brun",
    label: "riz brun",
    items: [ing("riz-brun", 300, "g")],
    cook: { text: "Rincez le riz brun, puis cuisez-le dans 750 ml d'eau salée, à couvert et à feu doux, 40 minutes. Laissez reposer 10 minutes.", minutes: 50, timers: [timer("Riz brun", 40), timer("Repos du riz", 10)], tip: "Le riz brun se cuit à l'avance : il se garde 4 jours au réfrigérateur." },
  },
  quinoa: {
    key: "quinoa",
    label: "quinoa",
    items: [ing("quinoa", 250, "g")],
    cook: { text: "Rincez le quinoa, puis cuisez-le dans 500 ml d'eau salée, à couvert et à feu doux, 15 minutes. Égrainez à la fourchette.", minutes: 15, timers: [timer("Quinoa", 15)], tip: "Le quinoa est prêt quand un petit germe blanc en spirale apparaît autour de chaque grain." },
  },
  couscous: {
    key: "couscous",
    label: "couscous",
    items: [ing("couscous", 250, "g")],
    cook: { text: "Versez 300 ml d'eau bouillante salée sur le couscous, couvrez et laissez gonfler 5 minutes. Égrainez à la fourchette.", minutes: 5, timers: [timer("Couscous", 5)] },
    substitution: { from: "Couscous", to: "Quinoa", note: "Version sans gluten." },
  },
  "nouilles-riz": {
    key: "nouilles-riz",
    label: "nouilles de riz",
    items: [ing("nouilles-riz", 250, "g")],
    cook: { text: "Faites tremper les nouilles de riz 8 minutes dans de l'eau très chaude, puis égouttez-les et rincez-les à l'eau froide.", minutes: 8, timers: [timer("Nouilles de riz", 8)] },
  },
};

/* ------------------------------------------------------------------ */
/* Légumes                                                             */
/* ------------------------------------------------------------------ */

export interface Veg {
  key: string;
  label: string;
  items: RecipeIngredient[];
  cook: Cooking;
  /** Légumes servis crus (pas de cuisson). */
  raw?: boolean;
}

export const VEGS: Record<string, Veg> = {
  "brocoli-carotte": {
    key: "brocoli-carotte",
    label: "brocoli et carottes",
    items: [ing("brocoli", 400, "g", { note: "en fleurons" }), ing("carotte", 2, "unite", { note: "en rondelles" })],
    cook: { text: "Dans la même poêle, faites sauter le brocoli et les carottes avec 3 c. à soupe d'eau, à couvert, 5 minutes : ils doivent rester croquants.", minutes: 5, timers: [timer("Brocoli et carottes", 5)] },
  },
  "bokchoy-champignons": {
    key: "bokchoy-champignons",
    label: "bok choy et champignons",
    items: [ing("bok-choy", 400, "g", { note: "coupés en deux" }), ing("champignons", 200, "g", { note: "tranchés" })],
    cook: { text: "Dans la même poêle, faites sauter les champignons 3 minutes, puis les bok choy 2 minutes, côté coupé vers le bas.", minutes: 5, timers: [timer("Légumes", 5)] },
  },
  "mangetout-poivron": {
    key: "mangetout-poivron",
    label: "pois mange-tout et poivron",
    items: [ing("pois-mange-tout", 250, "g"), ing("poivron-rouge", 1, "unite", { note: "en lanières" }), ing("carotte", 1, "unite", { note: "en julienne" })],
    cook: { text: "Dans la même poêle, faites sauter les pois mange-tout, le poivron et la carotte 3 minutes à feu vif.", minutes: 3, timers: [timer("Légumes sautés", 3)] },
  },
  "crudites-chou-rouge": {
    key: "crudites-chou-rouge",
    label: "chou rouge et crudités",
    items: [ing("chou-rouge", 200, "g", { note: "émincé finement" }), ing("poivron-rouge", 1, "unite", { note: "en lanières" }), ing("carotte", 2, "unite", { note: "râpées" })],
    cook: { text: "Émincez finement le chou rouge, taillez le poivron en lanières et râpez les carottes.", minutes: 8 },
    raw: true,
  },
  "concombre-tomate": {
    key: "concombre-tomate",
    label: "concombre et tomates cerises",
    items: [ing("concombre", 1, "unite", { note: "en dés" }), ing("tomate-cerise", 250, "g", { note: "coupées en deux" }), ing("oignon-rouge", 0.5, "unite", { note: "émincé" })],
    cook: { text: "Coupez le concombre en dés, les tomates cerises en deux et émincez finement l'oignon rouge.", minutes: 6 },
    raw: true,
  },
  "courgette-poivron": {
    key: "courgette-poivron",
    label: "courgette et poivron",
    items: [ing("courgette", 2, "unite", { note: "en demi-rondelles" }), ing("poivron-rouge", 1, "unite", { note: "en dés" })],
    cook: { text: "Dans la même poêle, faites sauter la courgette et le poivron 6 minutes, jusqu'à ce qu'ils soient tendres et légèrement dorés.", minutes: 6, timers: [timer("Courgette et poivron", 6)] },
  },
  "mais-poivron": {
    key: "mais-poivron",
    label: "maïs grillé et poivron",
    items: [ing("mais", 250, "g"), ing("poivron-rouge", 1, "unite", { note: "en dés" }), ing("tomate-cerise", 200, "g", { note: "coupées en deux" })],
    cook: { text: "Dans la même poêle, faites griller le maïs et le poivron 5 minutes à feu vif. Ajoutez les tomates cerises hors du feu.", minutes: 5, timers: [timer("Maïs grillé", 5)] },
  },
  "laitue-mais-avocat": {
    key: "laitue-mais-avocat",
    label: "laitue, maïs et avocat",
    items: [ing("mais", 200, "g"), ing("laitue-romaine", 150, "g", { note: "émincée" }), ing("avocat", 1, "unite", { note: "en dés" })],
    cook: { text: "Faites griller le maïs 4 minutes dans la poêle chaude. Émincez la laitue et coupez l'avocat en dés au dernier moment.", minutes: 4, timers: [timer("Maïs grillé", 4)] },
  },
  "epinards-carotte-concombre": {
    key: "epinards-carotte-concombre",
    label: "épinards, carottes et concombre",
    items: [ing("epinards", 200, "g"), ing("carotte", 2, "unite", { note: "en julienne" }), ing("concombre", 1, "unite", { note: "en bâtonnets" })],
    cook: { text: "Faites tomber les épinards 2 minutes dans la poêle chaude avec 1 c. à soupe d'eau. Taillez les carottes et le concombre en bâtonnets.", minutes: 4, timers: [timer("Épinards", 2)] },
  },
  "champignons-courgette": {
    key: "champignons-courgette",
    label: "champignons et courgette",
    items: [ing("champignons", 250, "g", { note: "tranchés" }), ing("courgette", 1, "unite", { note: "en julienne" }), ing("carotte", 1, "unite", { note: "en julienne" })],
    cook: { text: "Dans la même poêle, faites sauter les champignons 4 minutes, puis la courgette et la carotte 2 minutes.", minutes: 6, timers: [timer("Légumes sautés", 6)] },
  },
  "chou-fleur-epinards": {
    key: "chou-fleur-epinards",
    label: "chou-fleur et épinards",
    items: [ing("chou-fleur", 400, "g", { note: "en petits fleurons" }), ing("epinards", 100, "g")],
    cook: { text: "Dans la même poêle, faites sauter le chou-fleur avec 60 ml d'eau, à couvert, 8 minutes. Ajoutez les épinards et laissez-les tomber.", minutes: 9, timers: [timer("Chou-fleur", 8)] },
  },
  "patate-pois": {
    key: "patate-pois",
    label: "patate douce et petits pois",
    items: [ing("patate-douce", 1, "unite", { note: "en cubes de 1,5 cm" }), ing("petits-pois", 150, "g")],
    cook: { text: "Dans la même poêle, faites cuire la patate douce avec 80 ml d'eau, à couvert, 10 minutes. Ajoutez les petits pois 2 minutes.", minutes: 12, timers: [timer("Patate douce", 10), timer("Petits pois", 2)] },
  },
  "chou-concombre-tomate": {
    key: "chou-concombre-tomate",
    label: "chou rouge, concombre et tomates",
    items: [ing("chou-rouge", 150, "g", { note: "émincé" }), ing("concombre", 1, "unite", { note: "en dés" }), ing("tomate-cerise", 200, "g", { note: "coupées en deux" })],
    cook: { text: "Émincez le chou rouge, coupez le concombre en dés et les tomates cerises en deux.", minutes: 6 },
    raw: true,
  },
  "kale-patate": {
    key: "kale-patate",
    label: "chou kale et patate douce",
    items: [ing("patate-douce", 1, "unite", { note: "en cubes" }), ing("chou-kale", 150, "g", { note: "équeuté" })],
    cook: { text: "Dans la même poêle, faites cuire la patate douce avec 80 ml d'eau, à couvert, 10 minutes. Ajoutez le kale et laissez-le tomber 1 minute.", minutes: 11, timers: [timer("Patate douce", 10)] },
  },
  "haricots-verts-patate": {
    key: "haricots-verts-patate",
    label: "haricots verts et patate douce",
    items: [ing("patate-douce", 1, "unite", { note: "en cubes" }), ing("haricots-verts", 250, "g", { note: "parés" })],
    cook: { text: "Dans la même poêle, faites cuire la patate douce avec 80 ml d'eau, à couvert, 8 minutes. Ajoutez les haricots verts et poursuivez 4 minutes.", minutes: 12, timers: [timer("Patate douce", 8), timer("Haricots verts", 4)] },
  },
  "kale-pomme": {
    key: "kale-pomme",
    label: "chou kale et pomme",
    items: [ing("chou-kale", 150, "g", { note: "équeuté et émincé" }), ing("pomme", 1, "unite", { note: "en fines tranches" })],
    cook: { text: "Émincez finement le kale et massez-le 1 minute avec les mains pour l'attendrir. Tranchez la pomme finement.", minutes: 5 },
    raw: true,
  },
  "asperges-pois": {
    key: "asperges-pois",
    label: "asperges et petits pois",
    items: [ing("asperges", 300, "g", { note: "en tronçons" }), ing("petits-pois", 150, "g")],
    cook: { text: "Dans la même poêle, faites sauter les asperges 4 minutes, puis les petits pois 2 minutes.", minutes: 6, timers: [timer("Asperges", 4), timer("Petits pois", 2)] },
  },
};

/* ------------------------------------------------------------------ */
/* Saveurs du monde                                                    */
/* ------------------------------------------------------------------ */

export interface Flavor {
  key: string;
  /** « teriyaki à l'érable » — suit le nom du plat. */
  label: string;
  cuisine: string;
  sauce: RecipeIngredient[];
  sauceText: string;
  garnish: RecipeIngredient[];
  garnishLabel: string;
  spicy: boolean;
  starches: string[];
  vegs: string[];
  /** Pour les sautés au wok (sauce qui épaissit). */
  wok: boolean;
  tip: string;
  substitution?: Substitution;
  /** Courte phrase pour la description. */
  pitch: string;
}

export const FLAVORS: Flavor[] = [
  {
    key: "teriyaki",
    label: "teriyaki à l'érable",
    cuisine: "Japonaise",
    sauce: [ing("sauce-soja", 60, "ml"), ing("sirop-erable", 2, "c-soupe"), ing("vinaigre-riz", 1, "c-soupe"), ing("gingembre", 10, "g", { note: "râpé" }), ing("ail", 2, "unite", { note: "râpées" }), ing("fecule-mais", 1, "c-the")],
    sauceText: "Préparez la sauce : dans un petit bol, fouettez la sauce soja, le sirop d'érable, le vinaigre de riz, le gingembre, l'ail, la fécule et 60 ml d'eau froide.",
    garnish: [ing("graines-sesame", 1, "c-soupe"), ing("oignon-vert", 2, "unite", { note: "émincés" })],
    garnishLabel: "graines de sésame et oignon vert",
    spicy: false,
    starches: ["riz-jasmin", "riz-brun", "quinoa"],
    vegs: ["brocoli-carotte", "bokchoy-champignons", "mangetout-poivron"],
    wok: true,
    tip: "Doublez la sauce teriyaki : elle se garde une semaine au réfrigérateur.",
    substitution: { from: "Sauce soja", to: "Tamari sans gluten", note: "Version sans gluten." },
    pitch: "Une sauce teriyaki maison, laquée à l'érable du Québec.",
  },
  {
    key: "thai-arachide",
    label: "thaï à l'arachide",
    cuisine: "Thaïlandaise",
    sauce: [ing("beurre-arachide", 4, "c-soupe"), ing("sauce-soja", 2, "c-soupe"), ing("lime", 1, "unite", { note: "jus" }), ing("sirop-erable", 1, "c-soupe"), ing("gingembre", 10, "g", { note: "râpé" })],
    sauceText: "Préparez la sauce : fouettez le beurre d'arachide, la sauce soja, le jus de lime, le sirop d'érable, le gingembre et 4 c. à soupe d'eau chaude jusqu'à consistance nappante.",
    garnish: [ing("arachides", 30, "g", { note: "concassées" }), ing("coriandre", 10, "g")],
    garnishLabel: "arachides concassées et coriandre",
    spicy: false,
    starches: ["nouilles-riz", "riz-jasmin"],
    vegs: ["crudites-chou-rouge", "mangetout-poivron"],
    wok: true,
    tip: "Ajoutez une pincée de flocons de piment pour les adultes, au moment de servir.",
    substitution: { from: "Beurre d'arachide", to: "Beurre de graines de tournesol", note: "Sans arachides (retirez aussi les arachides concassées)." },
    pitch: "Une sauce onctueuse à l'arachide, à la lime et au gingembre.",
  },
  {
    key: "mediterraneen",
    label: "méditerranéen citron-origan",
    cuisine: "Grecque",
    sauce: [ing("huile-olive", 3, "c-soupe"), ing("citron", 1, "unite", { note: "jus et zeste" }), ing("origan", 2, "c-the"), ing("ail", 1, "unite", { note: "râpée" })],
    sauceText: "Préparez la vinaigrette : fouettez l'huile d'olive, le zeste et le jus du citron, l'origan et l'ail. Salez et poivrez.",
    garnish: [ing("feta", 80, "g", { note: "émiettée" }), ing("persil", 10, "g", { note: "haché" })],
    garnishLabel: "feta et persil",
    spicy: false,
    starches: ["quinoa", "couscous", "riz-brun"],
    vegs: ["concombre-tomate", "courgette-poivron"],
    wok: false,
    tip: "Préparez la vinaigrette en double : elle relève aussi les salades de la semaine.",
    substitution: { from: "Feta", to: "Olives Kalamata", note: "Version sans produits laitiers." },
    pitch: "Citron, origan et feta : le soleil de la Grèce.",
  },
  {
    key: "mexicain",
    label: "mexicain à la lime",
    cuisine: "Mexicaine",
    sauce: [ing("assaisonnement-chili", 1, "c-soupe"), ing("cumin", 1, "c-the"), ing("paprika-fume", 1, "c-the"), ing("lime", 1, "unite", { note: "jus" }), ing("huile-olive", 2, "c-soupe")],
    sauceText: "Préparez l'assaisonnement : mélangez l'assaisonnement au chili, le cumin, le paprika fumé, le jus de lime et l'huile d'olive.",
    garnish: [ing("yogourt-grec", 100, "g"), ing("coriandre", 10, "g")],
    garnishLabel: "yogourt grec et coriandre",
    spicy: false,
    starches: ["riz-basmati", "riz-brun", "quinoa"],
    vegs: ["mais-poivron", "laitue-mais-avocat"],
    wok: false,
    tip: "Le yogourt grec remplace la crème sure : même onctuosité, deux fois plus de protéines.",
    substitution: { from: "Yogourt grec", to: "Salsa verde", note: "Sans produits laitiers." },
    pitch: "Chili, cumin et lime, comme dans un burrito… en version bol.",
  },
  {
    key: "coreen",
    label: "coréen au gochujang",
    cuisine: "Coréenne",
    sauce: [ing("gochujang", 2, "c-soupe"), ing("sauce-soja", 2, "c-soupe"), ing("huile-sesame", 1, "c-soupe"), ing("sirop-erable", 1, "c-soupe"), ing("ail", 2, "unite", { note: "râpées" }), ing("fecule-mais", 1, "c-the")],
    sauceText: "Préparez la sauce : fouettez le gochujang, la sauce soja, l'huile de sésame, le sirop d'érable, l'ail, la fécule et 60 ml d'eau.",
    garnish: [ing("graines-sesame", 1, "c-soupe"), ing("oignon-vert", 2, "unite", { note: "émincés" })],
    garnishLabel: "sésame et oignon vert",
    spicy: true,
    starches: ["riz-jasmin", "riz-brun"],
    vegs: ["epinards-carotte-concombre", "champignons-courgette"],
    wok: true,
    tip: "Pour une version douce, réduisez le gochujang de moitié et ajoutez un peu de sirop d'érable.",
    pitch: "Le piquant sucré du gochujang, façon bibimbap.",
  },
  {
    key: "indien",
    label: "à l'indienne",
    cuisine: "Indienne",
    sauce: [ing("yogourt-grec", 150, "g"), ing("garam-masala", 2, "c-the"), ing("curcuma", 0.5, "c-the"), ing("cumin", 1, "c-the"), ing("citron", 0.5, "unite", { note: "jus" }), ing("gingembre", 10, "g", { note: "râpé" })],
    sauceText: "Préparez la sauce : mélangez le yogourt, le garam masala, le curcuma, le cumin, le jus de citron et le gingembre. Salez.",
    garnish: [ing("coriandre", 10, "g")],
    garnishLabel: "coriandre fraîche",
    spicy: false,
    starches: ["riz-basmati", "quinoa"],
    vegs: ["chou-fleur-epinards", "patate-pois"],
    wok: false,
    tip: "Le curcuma tache : utilisez un bol en verre ou en inox.",
    substitution: { from: "Yogourt grec", to: "Lait de coco", note: "Version sans produits laitiers." },
    pitch: "Garam masala, curcuma et yogourt : un bol parfumé et doux.",
  },
  {
    key: "libanais",
    label: "libanais au tahini",
    cuisine: "Libanaise",
    sauce: [ing("tahini", 60, "ml"), ing("citron", 1, "unite", { note: "jus" }), ing("ail", 1, "unite", { note: "râpée" }), ing("cumin", 0.5, "c-the")],
    sauceText: "Préparez la sauce : fouettez le tahini, le jus de citron, l'ail, le cumin et 60 à 80 ml d'eau froide jusqu'à consistance nappante. Salez.",
    garnish: [ing("persil", 15, "g", { note: "haché" })],
    garnishLabel: "persil frais",
    spicy: false,
    starches: ["quinoa", "couscous"],
    vegs: ["chou-concombre-tomate", "kale-patate"],
    wok: false,
    tip: "Le tahini fige au contact du citron : continuez à fouetter en ajoutant l'eau, il redeviendra lisse.",
    substitution: { from: "Tahini", to: "Yogourt grec citronné", note: "Sans sésame (contient du lait)." },
    pitch: "Une sauce tahini citronnée, comme dans les meilleures cantines de Beyrouth.",
  },
  {
    key: "erable-moutarde",
    label: "érable et moutarde",
    cuisine: "Québécoise",
    sauce: [ing("moutarde-dijon", 2, "c-soupe"), ing("sirop-erable", 2, "c-soupe"), ing("huile-olive", 2, "c-soupe"), ing("citron", 0.5, "unite", { note: "jus" })],
    sauceText: "Préparez la sauce : fouettez la moutarde de Dijon, le sirop d'érable, l'huile d'olive et le jus de citron. Salez et poivrez.",
    garnish: [ing("persil", 10, "g", { note: "haché" })],
    garnishLabel: "persil frais",
    spicy: false,
    starches: ["riz-brun", "quinoa"],
    vegs: ["haricots-verts-patate", "kale-pomme"],
    wok: false,
    tip: "Choisissez un sirop d'érable foncé : son goût plus prononcé ressort mieux dans la sauce.",
    pitch: "Le duo québécois érable-Dijon, sucré-relevé.",
  },
  {
    key: "gingembre-ail",
    label: "gingembre et ail",
    cuisine: "Chinoise",
    sauce: [ing("sauce-soja", 4, "c-soupe"), ing("cassonade", 1, "c-soupe"), ing("gingembre", 15, "g", { note: "râpé" }), ing("ail", 3, "unite", { note: "hachées" }), ing("fecule-mais", 1, "c-the")],
    sauceText: "Préparez la sauce : mélangez la sauce soja, la cassonade, le gingembre, l'ail, la fécule et 125 ml d'eau.",
    garnish: [ing("oignon-vert", 3, "unite", { note: "émincés" })],
    garnishLabel: "oignon vert",
    spicy: false,
    starches: ["riz-jasmin", "nouilles-riz"],
    vegs: ["brocoli-carotte", "mangetout-poivron", "bokchoy-champignons"],
    wok: true,
    tip: "Préparez tous les ingrédients avant d'allumer le feu : un sauté va très vite.",
    substitution: { from: "Sauce soja", to: "Tamari sans gluten", note: "Version sans gluten." },
    pitch: "Le classique des woks cantonais, brillant et parfumé.",
  },
  {
    key: "aigre-doux",
    label: "aigre-doux à l'ananas",
    cuisine: "Chinoise",
    sauce: [ing("ananas", 200, "g"), ing("vinaigre-riz", 3, "c-soupe"), ing("sirop-erable", 3, "c-soupe"), ing("sauce-soja", 2, "c-soupe"), ing("pate-tomate", 1, "c-soupe"), ing("fecule-mais", 2, "c-the")],
    sauceText: "Préparez la sauce : mélangez le vinaigre de riz, le sirop d'érable, la sauce soja, la pâte de tomate, la fécule et 125 ml d'eau. Gardez l'ananas à côté.",
    garnish: [ing("oignon-vert", 2, "unite", { note: "émincés" })],
    garnishLabel: "oignon vert",
    spicy: false,
    starches: ["riz-jasmin", "riz-brun"],
    vegs: ["mangetout-poivron", "courgette-poivron"],
    wok: true,
    tip: "L'ananas frais ou en conserve fonctionne ; égouttez-le bien s'il est en conserve.",
    pitch: "Un aigre-doux maison, sans sirop de maïs, avec de vrais morceaux d'ananas.",
  },
];

export const BASE_SAFETY = [SAFETY.hands, SAFETY.fridge];
export const MEAT_SAFETY = [SAFETY.boards, SAFETY.thermometer];
