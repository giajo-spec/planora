import type { Difficulty, Equipment, Illustration, MealType, Recipe, RecipeIngredient, RecipeTag, Substitution } from "@/lib/domain/types";
import { ing } from "../recipes/helpers";
import { type DraftStep, assemble, capitalize, frenchList, roundTo5, slug, timer } from "./builder";
import { moreFormats } from "./formats-more";
import {
  BASE_SAFETY,
  FLAVORS,
  MEAT_SAFETY,
  PROTEINS,
  type Cooking,
  type Flavor,
  type Protein,
  STARCHES,
  type Starch,
  VEGS,
  type Veg,
  proteinByKey,
} from "./components";

/* ------------------------------------------------------------------ */
/* Aides communes                                                      */
/* ------------------------------------------------------------------ */

const LEVEL: Difficulty[] = ["facile", "moyen", "avance"];
export const maxDifficulty = (...d: Difficulty[]) => LEVEL[Math.max(...d.map((x) => LEVEL.indexOf(x)))];

export function vegStep(veg: Veg, samePan: boolean): DraftStep {
  const text = samePan ? veg.cook.text : veg.cook.text.replace("Dans la même poêle", "Dans une grande poêle chaude").replace("dans la poêle chaude", "dans une poêle chaude");
  return { text, items: veg.items, minutes: veg.cook.minutes, timers: veg.cook.timers, tip: veg.cook.tip };
}

export function cookingStep(c: Cooking, items: RecipeIngredient[] = []): DraftStep {
  return { text: c.text, items: [...items, ...(c.items ?? [])], minutes: c.minutes, timers: c.timers, tip: c.tip, faq: c.faq };
}

export function guide(opts: {
  utensils: string[];
  prep: string[];
  techniques: string[];
  doneness: string[];
  meat: boolean;
}): Recipe["firstTime"] {
  return {
    utensils: opts.utensils,
    prep: opts.prep.filter(Boolean),
    techniques: opts.techniques,
    doneness: opts.doneness.filter(Boolean),
    safety: [...BASE_SAFETY, ...(opts.meat ? MEAT_SAFETY : [])],
  };
}

export function subs(...list: Array<Substitution | undefined>): Substitution[] {
  return list.filter((s): s is Substitution => Boolean(s));
}

export interface Meta {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  mealTypes: MealType[];
  servings?: number;
  prepMinutes: number;
  cookMinutes: number;
  difficulty: Difficulty;
  equipment?: Equipment[];
  tags?: RecipeTag[];
  tips: string[];
  substitutions: Substitution[];
  firstTime: Recipe["firstTime"];
  illustration: Illustration;
  /** Type de plat (bol, curry, burger…) : sert à varier le plan et le catalogue. */
  family?: string;
}

export function make(meta: Meta, steps: DraftStep[]): Recipe {
  return assemble(
    {
      ...meta,
      servings: meta.servings ?? 4,
      equipment: meta.equipment ?? [],
      tags: meta.tags ?? [],
      tips: meta.tips.filter(Boolean),
      family: meta.family ?? meta.id.split("-")[0],
      generated: true,
    },
    steps,
  );
}

/* ------------------------------------------------------------------ */
/* 1. Bols repas                                                       */
/* ------------------------------------------------------------------ */

const BOWL_PROTEINS = ["poulet", "dinde", "boeuf", "porc", "saumon", "morue", "crevettes", "tofu", "tempeh", "pois-chiches", "oeufs", "haricots-noirs", "lentilles"];

function bowl(flavor: Flavor, protein: Protein, starch: Starch, veg: Veg): Recipe {
  const cookP = protein.pan!;
  const samePan = Boolean(cookP.items?.some((i) => i.ingredientId.startsWith("huile")));
  const name = `Bol ${flavor.label} ${protein.with}, ${veg.label}, ${starch.label}`;
  const total = Math.max(starch.cook.minutes, cookP.minutes + veg.cook.minutes + 2);
  return make(
    {
      id: slug("bol", flavor.key, protein.key, starch.key, veg.key),
      name,
      description: `${flavor.pitch} ${capitalize(protein.the)} avec ${veg.label}, sur un lit de ${starch.label} : un bol complet et équilibré.`,
      cuisine: flavor.cuisine,
      mealTypes: ["diner", "souper"],
      prepMinutes: 15,
      cookMinutes: roundTo5(total),
      difficulty: protein.difficulty,
      tips: [flavor.tip, "Ce bol se prépare à l'avance : gardez la sauce à part jusqu'au moment de manger."],
      substitutions: subs(protein.substitution, starch.substitution, flavor.substitution),
      firstTime: guide({
        utensils: ["Grande poêle", "Casserole avec couvercle", "Petit bol et fouet", "4 bols de service", ...(protein.rawAnimal ? ["Thermomètre numérique"] : [])],
        prep: [protein.prep, "Préparez tous les légumes avant d'allumer le feu."],
        techniques: ["Saisir à feu moyen-vif sans surcharger la poêle.", "Cuisson du riz ou du quinoa à couvert : ne soulevez pas le couvercle."],
        doneness: [protein.doneness],
        meat: protein.rawAnimal,
      }),
      illustration: "bol",
    },
    [
      cookingStep(starch.cook, starch.items),
      { text: flavor.sauceText, items: flavor.sauce },
      cookingStep(cookP, protein.items),
      vegStep(veg, samePan),
      {
        text: `Répartissez le ${starch.label} dans 4 bols. Ajoutez ${protein.the} et les légumes, nappez de sauce et garnissez de ${flavor.garnishLabel}.`,
        items: flavor.garnish,
      },
    ],
  );
}

/* ------------------------------------------------------------------ */
/* 2. Sautés au wok                                                    */
/* ------------------------------------------------------------------ */

const WOK_PROTEINS = ["poulet", "boeuf", "porc", "crevettes", "tofu", "tempeh"];

function stirFry(flavor: Flavor, protein: Protein, starch: Starch, veg: Veg): Recipe {
  const cookP = protein.pan!;
  return make(
    {
      id: slug("saute", flavor.key, protein.key, starch.key, veg.key),
      name: `Sauté ${protein.of} ${flavor.label}, ${veg.label}, sur ${starch.label}`,
      description: `${flavor.pitch} Un sauté express au wok — ${protein.the.replace(/^(le|la|les) /, "")}, ${veg.label} — servi sur ${starch.label}.`,
      cuisine: flavor.cuisine,
      mealTypes: ["souper", "diner"],
      prepMinutes: 15,
      cookMinutes: roundTo5(Math.max(starch.cook.minutes, cookP.minutes + veg.cook.minutes + 3)),
      difficulty: maxDifficulty("moyen", protein.difficulty),
      tips: [flavor.tip, "Un wok surchargé fait bouillir les aliments : cuisez en plusieurs fournées."],
      substitutions: subs(protein.substitution, flavor.substitution),
      firstTime: guide({
        utensils: ["Wok ou très grande poêle", "Casserole avec couvercle", "Pince de cuisine", ...(protein.rawAnimal ? ["Thermomètre numérique"] : [])],
        prep: [protein.prep, "Alignez tous les ingrédients coupés et la sauce près du wok."],
        techniques: ["Sauter au wok : feu vif, mouvements rapides, petites quantités.", "Épaissir une sauce à la fécule : faire bouillir 1 minute."],
        doneness: [protein.doneness],
        meat: protein.rawAnimal,
      }),
      illustration: "assiette",
    },
    [
      cookingStep(starch.cook, starch.items),
      { text: flavor.sauceText, items: flavor.sauce },
      { ...cookingStep(cookP, protein.items), text: cookP.text.replace("une grande poêle", "le wok") + " Réservez dans une assiette." },
      vegStep(veg, true),
      {
        text: `Remettez ${protein.the} dans le wok, versez la sauce et faites bouillir 1 à 2 minutes, jusqu'à ce qu'elle épaississe et nappe. Servez sur le ${starch.label}, garni de ${flavor.garnishLabel}.`,
        items: flavor.garnish,
        minutes: 2,
      },
    ],
  );
}

/* ------------------------------------------------------------------ */
/* 3. Pâtes                                                            */
/* ------------------------------------------------------------------ */

interface PastaSauce {
  key: string;
  label: string;
  cuisine: string;
  items: RecipeIngredient[];
  text: string;
  finish: RecipeIngredient[];
  finishLabel: string;
  spicy: boolean;
  pitch: string;
}

const PASTA_SAUCES: PastaSauce[] = [
  {
    key: "tomate-basilic",
    label: "sauce tomate et basilic",
    cuisine: "Italienne",
    items: [ing("huile-olive", 2, "c-soupe"), ing("ail", 2, "unite", { note: "hachées" }), ing("passata", 700, "ml"), ing("origan", 1, "c-the"), ing("sel", 0.5, "c-the")],
    text: "Dans une casserole, chauffez l'huile d'olive à feu moyen et faites revenir l'ail 1 minute. Ajoutez le coulis de tomates, l'origan et le sel ; laissez mijoter 10 minutes.",
    finish: [ing("basilic", 15, "g"), ing("parmesan", 40, "g")],
    finishLabel: "basilic frais et parmesan",
    spicy: false,
    pitch: "Une sauce tomate mijotée, simple et parfaite.",
  },
  {
    key: "pesto",
    label: "au pesto",
    cuisine: "Italienne",
    items: [ing("pesto", 125, "ml"), ing("citron", 0.5, "unite", { note: "jus" })],
    text: "Dans un grand bol, mélangez le pesto, le jus de citron et 125 ml d'eau de cuisson des pâtes réservée.",
    finish: [ing("parmesan", 30, "g")],
    finishLabel: "parmesan",
    spicy: false,
    pitch: "Basilic, parmesan et citron : la fraîcheur de la Ligurie.",
  },
  {
    key: "rosee",
    label: "sauce rosée légère",
    cuisine: "Italienne",
    items: [ing("huile-olive", 1, "c-soupe"), ing("ail", 2, "unite", { note: "hachées" }), ing("passata", 500, "ml"), ing("yogourt-grec", 150, "g"), ing("sel", 0.5, "c-the")],
    text: "Dans une casserole, faites revenir l'ail dans l'huile 1 minute, ajoutez le coulis et le sel et laissez mijoter 8 minutes. Hors du feu, incorporez le yogourt grec.",
    finish: [ing("parmesan", 30, "g")],
    finishLabel: "parmesan",
    spicy: false,
    pitch: "Une rosée onctueuse allégée au yogourt grec, que les enfants adorent.",
  },
  {
    key: "citron-parmesan",
    label: "citron, ail et parmesan",
    cuisine: "Italienne",
    items: [ing("huile-olive", 3, "c-soupe"), ing("ail", 3, "unite", { note: "tranchées" }), ing("citron", 1, "unite", { note: "zeste et jus" })],
    text: "Dans une grande poêle, chauffez l'huile d'olive à feu doux et faites infuser l'ail 2 minutes sans le colorer. Ajoutez le zeste et le jus du citron.",
    finish: [ing("parmesan", 60, "g"), ing("persil", 10, "g", { note: "haché" })],
    finishLabel: "parmesan et persil",
    spicy: false,
    pitch: "Citron, ail doux et parmesan : un plat lumineux en 20 minutes.",
  },
  {
    key: "arrabbiata",
    label: "all'arrabbiata",
    cuisine: "Italienne",
    items: [ing("huile-olive", 2, "c-soupe"), ing("ail", 3, "unite", { note: "hachées" }), ing("piment-broye", 1, "c-the"), ing("passata", 700, "ml"), ing("sel", 0.5, "c-the")],
    text: "Dans une casserole, faites revenir l'ail et le piment dans l'huile 1 minute. Ajoutez le coulis et le sel et laissez mijoter 10 minutes.",
    finish: [ing("persil", 10, "g", { note: "haché" })],
    finishLabel: "persil",
    spicy: true,
    pitch: "La sauce « enragée » de Rome, bien relevée au piment.",
  },
  {
    key: "cremeuse",
    label: "sauce crémeuse au parmesan",
    cuisine: "Italienne",
    items: [ing("lait", 375, "ml"), ing("fecule-mais", 1, "c-soupe"), ing("ail", 2, "unite", { note: "râpées" }), ing("parmesan", 60, "g"), ing("sel", 0.5, "c-the")],
    text: "Dans une casserole, fouettez le lait froid avec la fécule et l'ail. Portez à frémissement en fouettant 3 minutes jusqu'à ce que la sauce épaississe, puis ajoutez le parmesan et le sel hors du feu.",
    finish: [ing("persil", 10, "g", { note: "haché" })],
    finishLabel: "persil",
    spicy: false,
    pitch: "Une sauce façon Alfredo, légère, sans crème.",
  },
];

const PASTA_PROTEINS = ["poulet", "dinde", "boeuf-hache", "crevettes", "thon", "pois-chiches", "lentilles", "aucune"];
const PASTA_VEGS = ["epinards-tomates", "brocoli-champignons", "courgette-poivron", "asperges-pois"];
const EXTRA_VEG: Record<string, Veg> = {
  "epinards-tomates": {
    key: "epinards-tomates",
    label: "épinards et tomates cerises",
    items: [ing("tomate-cerise", 250, "g", { note: "coupées en deux" }), ing("epinards", 150, "g")],
    cook: { text: "Dans une grande poêle chaude, faites sauter les tomates cerises 3 minutes, puis ajoutez les épinards jusqu'à ce qu'ils tombent.", minutes: 4, timers: [timer("Légumes", 4)] },
  },
  "brocoli-champignons": {
    key: "brocoli-champignons",
    label: "brocoli et champignons",
    items: [ing("brocoli", 300, "g", { note: "en petits fleurons" }), ing("champignons", 200, "g", { note: "tranchés" })],
    cook: { text: "Dans une grande poêle chaude, faites sauter les champignons et le brocoli avec 3 c. à soupe d'eau, à couvert, 5 minutes.", minutes: 5, timers: [timer("Légumes", 5)] },
  },
};
const vegOf = (key: string) => VEGS[key] ?? EXTRA_VEG[key];

const PASTAS: Record<string, { label: string; plural: string; item: RecipeIngredient; minutes: number }> = {
  penne: { label: "penne", plural: "Penne", item: ing("penne", 350, "g"), minutes: 11 },
  spaghetti: { label: "spaghetti", plural: "Spaghetti", item: ing("spaghetti", 350, "g"), minutes: 10 },
};

function pasta(pastaKey: string, sauce: PastaSauce, proteinKey: string, veg: Veg): Recipe {
  const p = PASTAS[pastaKey];
  const protein = proteinKey === "aucune" ? null : proteinByKey(proteinKey);
  const pCook = protein ? protein.pan ?? protein.ready! : null;
  const name = `${p.plural} ${sauce.label}${protein ? ` ${protein.with}` : ""}, ${veg.label}`;
  const steps: DraftStep[] = [
    {
      text: `Portez une grande casserole d'eau salée à ébullition et cuisez les ${p.label} ${p.minutes} minutes, jusqu'à ce qu'ils soient al dente. Réservez 125 ml d'eau de cuisson, puis égouttez.`,
      items: [p.item, ing("sel", 1, "c-soupe")],
      minutes: p.minutes,
      timers: [timer(capitalize(p.label), p.minutes)],
      tip: "L'eau de cuisson riche en amidon aide la sauce à bien enrober les pâtes.",
    },
    { text: sauce.text, items: sauce.items, minutes: sauce.key === "pesto" ? undefined : 10, timers: sauce.key === "pesto" ? undefined : [timer("Sauce", sauce.key === "cremeuse" ? 3 : 10)] },
  ];
  if (protein && pCook) steps.push(cookingStep(pCook, protein.items));
  steps.push(vegStep(veg, false));
  steps.push({
    text: `Mélangez les ${p.label} avec la sauce${protein ? `, ${protein.the}` : ""} et les légumes, en ajoutant un peu d'eau de cuisson si nécessaire. Servez avec ${sauce.finishLabel}.`,
    items: sauce.finish,
  });
  const total = p.minutes + 10;
  return make(
    {
      id: slug("pates", pastaKey, sauce.key, proteinKey, veg.key),
      name,
      description: `${sauce.pitch} ${capitalize(p.label)}${protein ? `, ${protein.the.replace(/^(le|la|les) /, "")}` : ""} et ${veg.label}.`,
      cuisine: sauce.cuisine,
      mealTypes: ["diner", "souper"],
      prepMinutes: 10,
      cookMinutes: roundTo5(total),
      difficulty: protein ? protein.difficulty : "facile",
      tags: ["familial"],
      tips: ["Goûtez une pâte une minute avant la fin du temps indiqué : elle doit résister légèrement sous la dent."],
      substitutions: subs({ from: capitalize(p.label), to: "Pâtes sans gluten", note: "Même temps de cuisson environ ; vérifiez l'emballage." }, protein?.substitution),
      firstTime: guide({
        utensils: ["Grande casserole", "Passoire", "Grande poêle", "Tasse à mesurer pour l'eau de cuisson", ...(protein?.rawAnimal ? ["Thermomètre numérique"] : [])],
        prep: [protein?.prep ?? "", "Lancez l'eau des pâtes en premier : c'est elle qui prend le plus de temps à bouillir."],
        techniques: ["Cuisson al dente.", "Lier une sauce avec l'eau de cuisson des pâtes."],
        doneness: [protein?.doneness ?? "Pâtes : tendres avec une légère résistance au centre."],
        meat: Boolean(protein?.rawAnimal),
      }),
      illustration: "pates",
    },
    steps,
  );
}

/* ------------------------------------------------------------------ */
/* 4. Tacos et wraps                                                   */
/* ------------------------------------------------------------------ */

interface WrapStyle {
  key: string;
  label: string;
  cuisine: string;
  seasoning: RecipeIngredient[];
  seasoningText: string;
  toppings: RecipeIngredient[];
  toppingText: string;
  spicy: boolean;
}

const WRAP_STYLES: WrapStyle[] = [
  {
    key: "mexicain",
    label: "à la mexicaine",
    cuisine: "Mexicaine",
    seasoning: [ing("assaisonnement-chili", 2, "c-the"), ing("cumin", 1, "c-the")],
    seasoningText: "Saupoudrez d'assaisonnement au chili et de cumin en fin de cuisson et mélangez 30 secondes.",
    toppings: [ing("salsa", 125, "ml"), ing("avocat", 1, "unite", { note: "en tranches" }), ing("laitue-romaine", 100, "g", { note: "émincée" }), ing("lime", 1, "unite", { note: "en quartiers" }), ing("coriandre", 10, "g")],
    toppingText: "salsa, avocat, laitue, coriandre et un quartier de lime",
    spicy: false,
  },
  {
    key: "coreen",
    label: "à la coréenne",
    cuisine: "Coréenne",
    seasoning: [ing("gochujang", 1, "c-soupe"), ing("sauce-soja", 1, "c-soupe"), ing("sirop-erable", 1, "c-soupe")],
    seasoningText: "Ajoutez le gochujang, la sauce soja et le sirop d'érable en fin de cuisson et mélangez 1 minute pour bien enrober.",
    toppings: [ing("chou-rouge", 150, "g", { note: "émincé" }), ing("concombre", 1, "unite", { note: "en bâtonnets" }), ing("yogourt-grec", 100, "g"), ing("graines-sesame", 1, "c-soupe")],
    toppingText: "chou rouge, concombre, yogourt et sésame",
    spicy: true,
  },
  {
    key: "grec",
    label: "à la grecque",
    cuisine: "Grecque",
    seasoning: [ing("origan", 1, "c-the"), ing("citron", 0.5, "unite", { note: "jus" })],
    seasoningText: "Ajoutez l'origan et le jus de citron en fin de cuisson et mélangez.",
    toppings: [ing("yogourt-grec", 150, "g"), ing("concombre", 0.5, "unite", { note: "râpé et essoré" }), ing("ail", 1, "unite", { note: "râpée" }), ing("tomate", 2, "unite", { note: "en dés" }), ing("oignon-rouge", 0.5, "unite", { note: "émincé" })],
    toppingText: "tzatziki maison (yogourt, concombre, ail), tomates et oignon rouge",
    spicy: false,
  },
  {
    key: "thai",
    label: "à la thaïe",
    cuisine: "Thaïlandaise",
    seasoning: [ing("sauce-soja", 1, "c-soupe"), ing("lime", 0.5, "unite", { note: "jus" })],
    seasoningText: "Ajoutez la sauce soja et le jus de lime en fin de cuisson et mélangez.",
    toppings: [ing("beurre-arachide", 3, "c-soupe"), ing("carotte", 2, "unite", { note: "râpées" }), ing("chou-rouge", 100, "g", { note: "émincé" }), ing("coriandre", 10, "g")],
    toppingText: "sauce à l'arachide (beurre d'arachide détendu à l'eau chaude), carottes, chou rouge et coriandre",
    spicy: false,
  },
  {
    key: "libanais",
    label: "à la libanaise",
    cuisine: "Libanaise",
    seasoning: [ing("cumin", 1, "c-the"), ing("paprika-fume", 1, "c-the"), ing("citron", 0.5, "unite", { note: "jus" })],
    seasoningText: "Ajoutez le cumin, le paprika et le jus de citron en fin de cuisson et mélangez.",
    toppings: [ing("tahini", 60, "ml"), ing("tomate", 2, "unite", { note: "en dés" }), ing("concombre", 0.5, "unite", { note: "en dés" }), ing("persil", 15, "g", { note: "haché" })],
    toppingText: "sauce tahini (allongée d'eau et de sel), tomates, concombre et persil",
    spicy: false,
  },
];

const WRAP_PROTEINS = ["poulet", "boeuf-hache", "dinde", "crevettes", "morue", "porc", "haricots-noirs", "tofu", "pois-chiches"];

function wrap(kind: "tacos" | "wraps", style: WrapStyle, protein: Protein): Recipe {
  const cookP = protein.pan!;
  const shell = kind === "tacos" ? ing("tortilla-mais", 12, "unite") : ing("tortilla-ble", 4, "unite");
  const title = kind === "tacos" ? "Tacos" : "Wraps";
  return make(
    {
      id: slug(kind, style.key, protein.key),
      name: `${title} ${protein.with} ${style.label}`,
      description: `${title} ${protein.with}, garnis de ${style.toppingText}. Tout le monde assemble les siens à table.`,
      cuisine: style.cuisine,
      mealTypes: ["diner", "souper"],
      prepMinutes: 15,
      cookMinutes: roundTo5(cookP.minutes + 5),
      difficulty: protein.difficulty,
      tags: ["familial"],
      tips: ["Laissez chacun garnir ses tacos à table : les enfants mangent plus volontiers ce qu'ils ont composé eux-mêmes."],
      substitutions: subs(
        protein.substitution,
        kind === "wraps" ? { from: "Tortillas de blé", to: "Tortillas de maïs", note: "Version sans gluten." } : undefined,
      ),
      firstTime: guide({
        utensils: ["Grande poêle", "Poêle sèche pour les tortillas", "Linge propre", "Petits bols pour les garnitures", ...(protein.rawAnimal ? ["Thermomètre numérique"] : [])],
        prep: [protein.prep, "Préparez toutes les garnitures dans de petits bols avant la cuisson."],
        techniques: ["Réchauffer des tortillas à sec : 30 secondes par côté."],
        doneness: [protein.doneness],
        meat: protein.rawAnimal,
      }),
      illustration: "wrap",
    },
    [
      { text: `Préparez les garnitures : ${style.toppingText}. Disposez-les dans de petits bols.`, items: style.toppings, minutes: 10 },
      cookingStep(cookP, protein.items),
      { text: style.seasoningText, items: style.seasoning, minutes: 1 },
      {
        text: `Réchauffez les tortillas 30 secondes de chaque côté dans une poêle sèche et gardez-les au chaud dans un linge. Servez avec la garniture et les accompagnements.`,
        items: [shell],
        minutes: 4,
      },
    ],
  );
}

/* ------------------------------------------------------------------ */
/* 5. Plaques au four                                                  */
/* ------------------------------------------------------------------ */

interface OvenFlavor {
  key: string;
  label: string;
  cuisine: string;
  items: RecipeIngredient[];
  text: string;
}

const OVEN_FLAVORS: OvenFlavor[] = [
  { key: "mediterraneen", label: "citron et origan", cuisine: "Méditerranéenne", items: [ing("huile-olive", 3, "c-soupe"), ing("citron", 1, "unite", { note: "jus" }), ing("origan", 2, "c-the"), ing("ail", 2, "unite", { note: "râpées" })], text: "Mélangez l'huile d'olive, le jus de citron, l'origan et l'ail." },
  { key: "erable-moutarde", label: "érable et moutarde", cuisine: "Québécoise", items: [ing("huile-olive", 2, "c-soupe"), ing("moutarde-dijon", 2, "c-soupe"), ing("sirop-erable", 2, "c-soupe")], text: "Mélangez l'huile d'olive, la moutarde de Dijon et le sirop d'érable." },
  { key: "mexicain", label: "chili et lime", cuisine: "Mexicaine", items: [ing("huile-olive", 3, "c-soupe"), ing("assaisonnement-chili", 1, "c-soupe"), ing("cumin", 1, "c-the"), ing("lime", 1, "unite", { note: "jus" })], text: "Mélangez l'huile d'olive, l'assaisonnement au chili, le cumin et le jus de lime." },
  { key: "indien", label: "cari doux", cuisine: "Indienne", items: [ing("huile-vegetale", 3, "c-soupe"), ing("curry-poudre", 1, "c-soupe"), ing("curcuma", 0.5, "c-the"), ing("gingembre", 10, "g", { note: "râpé" })], text: "Mélangez l'huile, la poudre de cari, le curcuma et le gingembre." },
  { key: "provence", label: "herbes de Provence", cuisine: "Française", items: [ing("huile-olive", 3, "c-soupe"), ing("herbes-provence", 1, "c-soupe"), ing("ail", 2, "unite", { note: "râpées" })], text: "Mélangez l'huile d'olive, les herbes de Provence et l'ail." },
];

const OVEN_VEGS: Array<{ key: string; label: string; items: RecipeIngredient[]; minutes: number }> = [
  { key: "pdt-haricots", label: "grelots et haricots verts", items: [ing("pomme-de-terre", 600, "g", { note: "coupées en deux" }), ing("haricots-verts", 300, "g")], minutes: 15 },
  { key: "patate-brocoli", label: "patates douces et brocoli", items: [ing("patate-douce", 2, "unite", { note: "en cubes" }), ing("brocoli", 300, "g", { note: "en fleurons" })], minutes: 15 },
  { key: "chou-fleur-carotte", label: "chou-fleur et carottes", items: [ing("chou-fleur", 500, "g", { note: "en fleurons" }), ing("carotte", 3, "unite", { note: "en bâtonnets" })], minutes: 15 },
  { key: "courgette-poivron", label: "courgettes et poivrons", items: [ing("courgette", 2, "unite", { note: "en rondelles épaisses" }), ing("poivron-rouge", 2, "unite", { note: "en lanières" }), ing("oignon-rouge", 1, "unite", { note: "en quartiers" })], minutes: 10 },
];

const OVEN_PROTEINS = ["poulet", "porc", "saumon", "morue", "crevettes", "tofu", "pois-chiches"];

function sheetPan(flavor: OvenFlavor, protein: Protein, veg: (typeof OVEN_VEGS)[number]): Recipe {
  const oven = protein.oven!;
  return make(
    {
      id: slug("plaque", flavor.key, protein.key, veg.key),
      name: `Plaque ${protein.of} ${flavor.label}, ${veg.label}`,
      description: `Une seule plaque, presque pas de vaisselle : ${protein.the.replace(/^(le|la|les) /, "")} avec ${veg.label}, rôtis au four, parfumés ${flavor.label === "cari doux" ? "au cari doux" : `aux saveurs ${flavor.label}`}.`,
      cuisine: flavor.cuisine,
      mealTypes: ["souper"],
      prepMinutes: 15,
      cookMinutes: roundTo5(veg.minutes + oven.minutes),
      difficulty: "facile",
      equipment: ["four"],
      tags: ["familial"],
      tips: ["Tapissez la plaque de papier parchemin : le nettoyage prend 30 secondes.", "Étalez bien les légumes en une seule couche pour qu'ils rôtissent au lieu de cuire à la vapeur."],
      substitutions: subs(protein.substitution),
      firstTime: guide({
        utensils: ["Grande plaque de cuisson", "Papier parchemin", "Grand bol", "Pinceau de cuisine", ...(protein.rawAnimal ? ["Thermomètre numérique"] : [])],
        prep: [protein.prep, "Coupez les légumes en morceaux de taille égale."],
        techniques: ["Rôtir à 220 °C : chaleur vive qui caramélise les légumes."],
        doneness: [protein.doneness, "Légumes : tendres à la pointe du couteau et dorés sur les bords."],
        meat: protein.rawAnimal,
      }),
      illustration: "plaque",
    },
    [
      { text: `Préchauffez le four à 220 °C et tapissez une grande plaque de papier parchemin. ${flavor.text}`, items: flavor.items, minutes: 10 },
      {
        text: `Dans un grand bol, enrobez les légumes de la moitié de l'assaisonnement et d'une pincée de sel. Étalez-les sur la plaque et rôtissez ${veg.minutes} minutes.`,
        items: [...veg.items, ing("sel", 1, "pincee")],
        minutes: veg.minutes,
        timers: [timer("Légumes au four", veg.minutes)],
      },
      { ...cookingStep(oven, protein.items) },
      { text: "Retirez du four, goûtez, rectifiez l'assaisonnement et servez directement sur la plaque." },
    ],
  );
}

/* ------------------------------------------------------------------ */
/* 6. Soupes-repas                                                     */
/* ------------------------------------------------------------------ */

interface SoupBase {
  key: string;
  label: string;
  cuisine: string;
  items: RecipeIngredient[];
  text: string;
  starch?: { item: RecipeIngredient; text: string; minutes: number };
  finish: RecipeIngredient[];
  finishText: string;
}

const SOUP_BASES: SoupBase[] = [
  {
    key: "tomate",
    label: "tomate et légumes",
    cuisine: "Italienne",
    items: [ing("huile-olive", 2, "c-soupe"), ing("oignon", 1, "unite", { note: "en dés" }), ing("ail", 2, "unite", { note: "hachées" }), ing("tomates-des", 796, "ml"), ing("bouillon-legumes", 1000, "ml"), ing("origan", 1, "c-the"), ing("sel", 0.5, "c-the")],
    text: "Dans une grande casserole, chauffez l'huile à feu moyen et faites revenir l'oignon et l'ail 5 minutes. Ajoutez les tomates, le bouillon, l'origan et le sel, puis portez à ébullition.",
    starch: { item: ing("pates-courtes", 100, "g"), text: "Ajoutez les petites pâtes et cuisez 9 minutes en remuant de temps en temps.", minutes: 9 },
    finish: [ing("basilic", 10, "g")],
    finishText: "basilic frais",
  },
  {
    key: "coco-cari",
    label: "coco et cari",
    cuisine: "Indienne",
    items: [ing("huile-vegetale", 1, "c-soupe"), ing("oignon", 1, "unite", { note: "en dés" }), ing("gingembre", 15, "g", { note: "râpé" }), ing("curry-poudre", 1, "c-soupe"), ing("lait-coco", 400, "ml"), ing("bouillon-legumes", 750, "ml"), ing("sel", 0.5, "c-the")],
    text: "Dans une grande casserole, faites revenir l'oignon et le gingembre dans l'huile 5 minutes. Ajoutez la poudre de cari 30 secondes, puis le lait de coco, le bouillon et le sel. Portez à frémissement.",
    finish: [ing("lime", 1, "unite", { note: "jus" }), ing("coriandre", 10, "g")],
    finishText: "jus de lime et coriandre",
  },
  {
    key: "gingembre-nouilles",
    label: "bouillon gingembre et nouilles",
    cuisine: "Japonaise",
    items: [ing("bouillon-legumes", 1500, "ml"), ing("sauce-soja", 3, "c-soupe"), ing("gingembre", 20, "g", { note: "tranché" }), ing("ail", 2, "unite", { note: "tranchées" })],
    text: "Dans une grande casserole, portez à ébullition le bouillon, la sauce soja, le gingembre et l'ail, puis laissez frémir 5 minutes.",
    starch: { item: ing("nouilles-riz", 150, "g"), text: "Faites tremper les nouilles de riz 8 minutes dans l'eau très chaude, égouttez-les et répartissez-les dans les bols.", minutes: 8 },
    finish: [ing("oignon-vert", 3, "unite", { note: "émincés" }), ing("huile-sesame", 1, "c-the")],
    finishText: "oignon vert et un filet d'huile de sésame",
  },
  {
    key: "mexicaine",
    label: "à la mexicaine",
    cuisine: "Mexicaine",
    items: [ing("huile-olive", 1, "c-soupe"), ing("oignon", 1, "unite", { note: "en dés" }), ing("cumin", 1, "c-the"), ing("assaisonnement-chili", 2, "c-the"), ing("tomates-des", 796, "ml"), ing("bouillon-legumes", 1000, "ml"), ing("mais", 200, "g"), ing("sel", 0.5, "c-the")],
    text: "Dans une grande casserole, faites revenir l'oignon dans l'huile 5 minutes. Ajoutez le cumin et l'assaisonnement au chili 30 secondes, puis les tomates, le bouillon, le maïs et le sel. Portez à ébullition.",
    finish: [ing("avocat", 1, "unite", { note: "en dés" }), ing("coriandre", 10, "g"), ing("lime", 1, "unite", { note: "en quartiers" })],
    finishText: "avocat, coriandre et lime",
  },
];

const SOUP_VEGS: Array<{ key: string; label: string; items: RecipeIngredient[] }> = [
  { key: "carotte-celeri-courgette", label: "carottes, céleri et courgette", items: [ing("carotte", 2, "unite", { note: "en dés" }), ing("celeri", 2, "unite", { note: "en dés" }), ing("courgette", 1, "unite", { note: "en dés" })] },
  { key: "epinards-champignons", label: "épinards et champignons", items: [ing("champignons", 200, "g", { note: "tranchés" }), ing("epinards", 150, "g")] },
  { key: "kale-patate", label: "kale et patate douce", items: [ing("patate-douce", 1, "unite", { note: "en petits cubes" }), ing("chou-kale", 120, "g", { note: "émincé" })] },
  { key: "brocoli-pois", label: "brocoli et petits pois", items: [ing("brocoli", 250, "g", { note: "en petits fleurons" }), ing("petits-pois", 150, "g")] },
];

const SOUP_PROTEINS = ["poulet", "crevettes", "tofu", "pois-chiches", "haricots-blancs", "lentilles", "haricots-noirs"];

function soup(base: SoupBase, protein: Protein, veg: (typeof SOUP_VEGS)[number]): Recipe {
  const c = protein.soup!;
  const steps: DraftStep[] = [
    { text: base.text, items: base.items, minutes: 8, timers: [timer("Base", 5)] },
    { text: `Ajoutez les légumes (${veg.label}) et laissez mijoter 10 minutes.`, items: veg.items, minutes: 10, timers: [timer("Légumes", 10)] },
    cookingStep(c, protein.items),
  ];
  if (base.starch) steps.push({ text: base.starch.text, items: [base.starch.item], minutes: base.starch.minutes, timers: [timer("Pâtes / nouilles", base.starch.minutes)] });
  steps.push({ text: `Goûtez et rectifiez l'assaisonnement. Servez bien chaud, garni de ${base.finishText}.`, items: base.finish });
  return make(
    {
      id: slug("soupe", base.key, protein.key, veg.key),
      name: `Soupe-repas ${base.label} ${protein.with}, ${veg.label}`,
      description: `Une grande soupe nourrissante, ${base.label}, avec ${protein.the.replace(/^(le|la|les) /, "")} ; légumes : ${veg.label}. Encore meilleure le lendemain.`,
      cuisine: base.cuisine,
      mealTypes: ["diner", "souper"],
      servings: 6,
      prepMinutes: 15,
      cookMinutes: roundTo5(20 + c.minutes + (base.starch?.minutes ?? 0)),
      difficulty: "facile",
      tags: ["familial", "prep-avance"],
      tips: ["Se congèle très bien jusqu'à 3 mois (sans les pâtes ni les nouilles).", "Refroidissez une grande quantité de soupe rapidement en la répartissant dans plusieurs petits contenants."],
      substitutions: subs(protein.substitution, { from: "Bouillon de légumes", to: "Bouillon de poulet" }),
      firstTime: guide({
        utensils: ["Grande casserole (5 L)", "Louche", "Couteau et planche", ...(protein.rawAnimal ? ["Thermomètre numérique"] : [])],
        prep: [protein.prep, "Coupez tous les légumes en dés de même taille."],
        techniques: ["Mijoter à feu moyen-doux : quelques bulles seulement à la surface."],
        doneness: [protein.doneness],
        meat: protein.rawAnimal,
      }),
      illustration: "soupe",
    },
    steps,
  );
}

/* ------------------------------------------------------------------ */
/* 7. Salades-repas                                                    */
/* ------------------------------------------------------------------ */

interface Dressing {
  key: string;
  label: string;
  cuisine: string;
  items: RecipeIngredient[];
  text: string;
}

const DRESSINGS: Dressing[] = [
  { key: "balsamique", label: "vinaigrette balsamique", cuisine: "Italienne", items: [ing("huile-olive", 3, "c-soupe"), ing("vinaigre-balsamique", 2, "c-soupe"), ing("sirop-erable", 1, "c-the"), ing("sel", 0.25, "c-the")], text: "Fouettez l'huile d'olive, le vinaigre balsamique, le sirop d'érable et le sel." },
  { key: "citron-dijon", label: "vinaigrette citron-Dijon", cuisine: "Française", items: [ing("huile-olive", 3, "c-soupe"), ing("citron", 1, "unite", { note: "jus" }), ing("moutarde-dijon", 1, "c-the"), ing("miel", 1, "c-the"), ing("sel", 0.25, "c-the")], text: "Fouettez l'huile d'olive, le jus de citron, la moutarde, le miel et le sel." },
  { key: "tahini", label: "sauce tahini", cuisine: "Libanaise", items: [ing("tahini", 60, "ml"), ing("citron", 1, "unite", { note: "jus" }), ing("ail", 1, "unite", { note: "râpée" }), ing("sel", 0.25, "c-the")], text: "Fouettez le tahini, le jus de citron, l'ail, le sel et 60 ml d'eau froide." },
  { key: "sesame", label: "vinaigrette sésame-gingembre", cuisine: "Japonaise", items: [ing("huile-sesame", 1, "c-soupe"), ing("huile-vegetale", 2, "c-soupe"), ing("sauce-soja", 2, "c-soupe"), ing("vinaigre-riz", 2, "c-soupe"), ing("gingembre", 10, "g", { note: "râpé" })], text: "Fouettez les huiles, la sauce soja, le vinaigre de riz et le gingembre." },
  { key: "cesar", label: "vinaigrette césar légère", cuisine: "Nord-américaine", items: [ing("yogourt-grec", 125, "g"), ing("parmesan", 30, "g"), ing("citron", 0.5, "unite", { note: "jus" }), ing("ail", 1, "unite", { note: "râpée" }), ing("moutarde-dijon", 1, "c-the")], text: "Mélangez le yogourt grec, le parmesan, le jus de citron, l'ail et la moutarde. Allongez d'un peu d'eau si nécessaire." },
];

const SALAD_BASES: Array<{ key: string; label: string; items: RecipeIngredient[]; text: string; cook?: { minutes: number; label: string } }> = [
  { key: "quinoa-roquette", label: "quinoa, roquette et crudités", items: [ing("quinoa", 150, "g"), ing("roquette", 100, "g"), ing("tomate-cerise", 250, "g", { note: "coupées en deux" }), ing("concombre", 1, "unite", { note: "en dés" })], text: "Cuisez le quinoa dans 300 ml d'eau salée, à couvert, 15 minutes ; laissez tiédir. Coupez les tomates et le concombre.", cook: { minutes: 15, label: "Quinoa" } },
  { key: "romaine-avocat", label: "romaine, avocat et maïs grillé", items: [ing("laitue-romaine", 300, "g", { note: "émincée" }), ing("avocat", 1, "unite", { note: "en dés" }), ing("mais", 200, "g"), ing("poivron-rouge", 1, "unite", { note: "en dés" })], text: "Faites griller le maïs 4 minutes dans une poêle sèche. Émincez la laitue, coupez le poivron et l'avocat en dés.", cook: { minutes: 4, label: "Maïs grillé" } },
  { key: "epinards-fraises", label: "épinards, fraises et concombre", items: [ing("epinards", 150, "g"), ing("fraises", 250, "g", { note: "tranchées" }), ing("concombre", 1, "unite", { note: "en demi-rondelles" })], text: "Lavez et essorez les épinards. Tranchez les fraises et le concombre." },
  { key: "nicoise", label: "grelots, haricots verts et tomates", items: [ing("pomme-de-terre", 400, "g", { note: "coupées en deux" }), ing("haricots-verts", 200, "g"), ing("tomate-cerise", 200, "g", { note: "coupées en deux" }), ing("olives-kalamata", 50, "g")], text: "Cuisez les grelots 12 minutes dans l'eau bouillante salée, en ajoutant les haricots verts les 4 dernières minutes. Égouttez et laissez tiédir. Coupez les tomates cerises.", cook: { minutes: 12, label: "Grelots et haricots" } },
  { key: "kale-patate", label: "kale, patate douce rôtie et pomme", items: [ing("patate-douce", 1, "unite", { note: "en cubes" }), ing("chou-kale", 150, "g", { note: "émincé" }), ing("pomme", 1, "unite", { note: "en dés" })], text: "Faites cuire les cubes de patate douce avec 80 ml d'eau, à couvert, 10 minutes, puis laissez tiédir. Massez le kale 1 minute avec les mains et coupez la pomme en dés.", cook: { minutes: 10, label: "Patate douce" } },
];

const SALAD_PROTEINS = ["poulet", "saumon", "crevettes", "oeufs", "thon", "pois-chiches", "tofu", "lentilles"];

function salad(dressing: Dressing, protein: Protein, base: (typeof SALAD_BASES)[number]): Recipe {
  const c = protein.pan ?? protein.ready!;
  return make(
    {
      id: slug("salade", dressing.key, protein.key, base.key),
      name: `Salade-repas ${protein.with}, ${base.label}, ${dressing.label}`,
      description: `Une salade qui tient au corps : ${base.label}, ${protein.the.replace(/^(le|la|les) /, "")} et une ${dressing.label} maison.`,
      cuisine: dressing.cuisine,
      mealTypes: ["diner"],
      prepMinutes: 15,
      cookMinutes: roundTo5(Math.max(base.cook?.minutes ?? 0, c.minutes)),
      difficulty: "facile",
      tags: ["prep-avance"],
      tips: ["Pour les lunchs, gardez la vinaigrette dans un petit pot à part.", "Ajoutez l'avocat et les fruits au dernier moment."],
      substitutions: subs(protein.substitution),
      firstTime: guide({
        utensils: ["Grand saladier", "Petit pot ou bol pour la vinaigrette", "Essoreuse à salade", ...(protein.rawAnimal ? ["Thermomètre numérique"] : [])],
        prep: [protein.prep, "Lavez et essorez bien les verdures : une vinaigrette n'adhère pas aux feuilles mouillées."],
        techniques: ["Émulsionner une vinaigrette au fouet ou dans un pot fermé que l'on secoue."],
        doneness: [protein.doneness],
        meat: protein.rawAnimal,
      }),
      illustration: "bol",
    },
    [
      { text: base.text, items: base.items, minutes: base.cook?.minutes ?? 8, timers: base.cook ? [timer(base.cook.label, base.cook.minutes)] : undefined },
      { text: `Préparez la ${dressing.label} : ${dressing.text.charAt(0).toLowerCase()}${dressing.text.slice(1)}`, items: dressing.items },
      cookingStep(c, protein.items),
      { text: `Dans un grand saladier, mélangez la base avec la moitié de la vinaigrette. Répartissez dans 4 assiettes, ajoutez ${protein.the} et arrosez du reste de vinaigrette.` },
    ],
  );
}

/* ------------------------------------------------------------------ */
/* 8. Œufs : frittatas, muffins, brouillés                             */
/* ------------------------------------------------------------------ */

const EGG_FILLINGS: Array<{ key: string; label: string; items: RecipeIngredient[]; kid: boolean }> = [
  { key: "epinards-feta", label: "épinards et feta", items: [ing("epinards", 120, "g"), ing("feta", 80, "g", { note: "émiettée" })], kid: true },
  { key: "champignons-cheddar", label: "champignons et cheddar", items: [ing("champignons", 200, "g", { note: "tranchés" }), ing("cheddar", 80, "g")], kid: true },
  { key: "poivron-oignon", label: "poivron et oignon", items: [ing("poivron-rouge", 1, "unite", { note: "en dés" }), ing("oignon", 0.5, "unite", { note: "haché" })], kid: true },
  { key: "tomate-mozzarella", label: "tomates, mozzarella et basilic", items: [ing("tomate-cerise", 200, "g", { note: "coupées en deux" }), ing("mozzarella", 80, "g"), ing("basilic", 10, "g")], kid: true },
  { key: "brocoli-cheddar", label: "brocoli et cheddar", items: [ing("brocoli", 200, "g", { note: "en petits fleurons" }), ing("cheddar", 80, "g")], kid: true },
  { key: "courgette-parmesan", label: "courgette et parmesan", items: [ing("courgette", 1, "unite", { note: "râpée" }), ing("parmesan", 40, "g")], kid: true },
  { key: "patate-oignon", label: "patate douce et oignon vert", items: [ing("patate-douce", 1, "unite", { note: "en petits dés" }), ing("oignon-vert", 3, "unite", { note: "émincés" })], kid: true },
  { key: "saumon-oignon-vert", label: "saumon et oignon vert", items: [ing("saumon", 200, "g", { note: "en petits cubes" }), ing("oignon-vert", 3, "unite", { note: "émincés" })], kid: false },
];

function eggs(style: "frittata" | "muffins" | "brouilles", filling: (typeof EGG_FILLINGS)[number]): Recipe {
  const eggsItem = ing("oeuf", style === "brouilles" ? 8 : 10, "unite");
  const milk = ing("lait", 60, "ml");
  const base = { cuisine: "Française", mealTypes: ["dejeuner", "diner"] as MealType[] };
  const fishInside = filling.key.startsWith("saumon");
  const firstTime = guide({
    utensils: style === "brouilles" ? ["Poêle antiadhésive", "Spatule en silicone", "Bol et fouet"] : style === "muffins" ? ["Moule à 12 muffins", "Papier ou huile pour le moule", "Bol et fouet"] : ["Poêle allant au four (25 cm)", "Bol et fouet", "Gants de cuisine"],
    prep: ["Coupez les garnitures en petits morceaux : elles cuisent en même temps que les œufs."],
    techniques: style === "brouilles" ? ["Brouiller à feu doux en ramenant les œufs vers le centre."] : ["Cuire des œufs au four jusqu'à ce que le centre soit pris."],
    doneness: ["Plats aux œufs : 71 °C ; le centre ne doit plus être liquide (une pointe de couteau en ressort propre)."],
    meat: fishInside,
  });
  if (style === "brouilles") {
    return make(
      {
        ...base,
        id: slug("oeufs-brouilles", filling.key),
        name: `Œufs brouillés crémeux, ${filling.label}`,
        description: `Des œufs brouillés à feu doux, onctueux, avec ${filling.label}. Prêts en 10 minutes.`,
        prepMinutes: 5,
        cookMinutes: 10,
        difficulty: "facile",
        tags: ["rapide", ...(filling.kid ? (["familial"] as RecipeTag[]) : [])],
        tips: ["Retirez la poêle du feu juste avant que les œufs soient pris : ils finissent de cuire dans l'assiette."],
        substitutions: [{ from: "Lait", to: "Boisson de soya", note: "Sans produits laitiers (retirez aussi le fromage)." }],
        firstTime,
        illustration: "assiette",
      },
      [
        { text: "Fouettez les œufs avec le lait et une pincée de sel.", items: [eggsItem, milk, ing("sel", 1, "pincee")] },
        { text: `Chauffez l'huile à feu moyen et faites revenir la garniture (${filling.label}) 3 minutes.`, items: [ing("huile-vegetale", 1, "c-soupe"), ...filling.items], minutes: 3, timers: [timer("Garniture", 3)] },
        { text: "Baissez le feu à doux, versez les œufs et remuez sans arrêt avec une spatule 4 à 5 minutes, jusqu'à ce qu'ils soient pris mais encore crémeux.", minutes: 5, timers: [timer("Œufs brouillés", 5)], faq: [{ question: "Mes œufs sont caoutchouteux.", answer: "Le feu était trop vif. Cuisez à feu doux et retirez la poêle un peu avant la fin." }] },
      ],
    );
  }
  const isMuffins = style === "muffins";
  return make(
    {
      ...base,
      id: slug(isMuffins ? "muffins-oeufs" : "frittata", filling.key),
      name: isMuffins ? `Muffins aux œufs, ${filling.label}` : `Frittata ${filling.label}`,
      description: isMuffins
        ? `Des petites bouchées d'œufs ${filling.label}, parfaites pour les boîtes à lunch et les petites mains.`
        : `Une frittata dorée à l'italienne, garnie de ${filling.label}, qui se partage comme une tarte.`,
      prepMinutes: 10,
      cookMinutes: isMuffins ? 25 : 20,
      difficulty: "facile",
      equipment: ["four"],
      tags: ["prep-avance", ...(filling.kid ? (["familial"] as RecipeTag[]) : [])],
      tips: ["Se conserve 4 jours au réfrigérateur ; réchauffez 30 secondes au micro-ondes."],
      substitutions: [{ from: "Fromage", to: "Levure nutritionnelle", note: "Sans produits laitiers." }],
      firstTime,
      illustration: isMuffins ? "tartine" : "assiette",
    },
    [
      { text: `Préchauffez le four à 190 °C${isMuffins ? " et huilez un moule à 12 muffins" : ""}.`, items: isMuffins ? [ing("huile-vegetale", 1, "c-soupe")] : [] },
      { text: "Fouettez les œufs avec le lait et une pincée de sel.", items: [eggsItem, milk, ing("sel", 1, "pincee")] },
      isMuffins
        ? { text: `Répartissez la garniture (${filling.label}) dans les moules, puis versez les œufs battus aux trois quarts.`, items: filling.items }
        : { text: `Dans une poêle allant au four, faites revenir la garniture (${filling.label}) 3 minutes dans l'huile, puis versez les œufs.`, items: [ing("huile-olive", 1, "c-soupe"), ...filling.items], minutes: 3 },
      {
        text: isMuffins ? "Cuisez au four 20 minutes, jusqu'à ce que les muffins soient gonflés et pris au centre. Laissez tiédir 5 minutes avant de démouler." : "Enfournez 15 minutes, jusqu'à ce que la frittata soit prise au centre et dorée. Laissez reposer 5 minutes avant de couper.",
        minutes: isMuffins ? 25 : 20,
        timers: [timer(isMuffins ? "Muffins aux œufs" : "Frittata", isMuffins ? 20 : 15), timer("Repos", 5)],
      },
    ],
  );
}

/* ------------------------------------------------------------------ */
/* 9. Gruaux, nuits d'avoine et poudings chia                          */
/* ------------------------------------------------------------------ */

const FRUITS: Array<{ key: string; label: string; items: RecipeIngredient[] }> = [
  { key: "petits-fruits", label: "petits fruits", items: [ing("petits-fruits", 200, "g")] },
  { key: "banane", label: "banane", items: [ing("banane", 2, "unite", { note: "tranchées" })] },
  { key: "pomme-cannelle", label: "pomme-cannelle", items: [ing("pomme", 1, "unite", { note: "râpée" }), ing("cannelle", 1, "c-the")] },
  { key: "mangue", label: "mangue", items: [ing("mangue", 1, "unite", { note: "en dés" })] },
  { key: "fraises", label: "fraises", items: [ing("fraises", 250, "g", { note: "tranchées" })] },
  { key: "bleuets", label: "bleuets", items: [ing("bleuets", 200, "g")] },
  { key: "ananas-mangue", label: "ananas-mangue", items: [ing("ananas", 150, "g"), ing("mangue", 0.5, "unite", { note: "en dés" })] },
];

const TOPPINGS: Array<{ key: string; label: string; items: RecipeIngredient[] }> = [
  { key: "beurre-arachide", label: "beurre d'arachide", items: [ing("beurre-arachide", 3, "c-soupe")] },
  { key: "amandes", label: "amandes grillées", items: [ing("amandes", 40, "g")] },
  { key: "cacao", label: "cacao-érable", items: [ing("cacao", 2, "c-soupe"), ing("sirop-erable", 2, "c-soupe")] },
  { key: "yogourt", label: "yogourt grec", items: [ing("yogourt-grec", 200, "g")] },
];

const LIQUIDS: Record<string, { label: string; ingredientId: string }> = {
  lait: { label: "lait", ingredientId: "lait" },
  soya: { label: "boisson de soya", ingredientId: "boisson-soya" },
};

function breakfastBowl(base: "gruau" | "nuit" | "chia", fruit: (typeof FRUITS)[number], top: (typeof TOPPINGS)[number], liquidKey: string): Recipe {
  const liquid = LIQUIDS[liquidKey];
  const names = { gruau: "Gruau chaud", nuit: "Gruau de nuit", chia: "Pouding de chia" };
  const steps: DraftStep[] =
    base === "gruau"
      ? [
          { text: `Dans une casserole, portez à frémissement les flocons d'avoine avec le ${liquid.label} et une pincée de sel. Cuisez 5 minutes en remuant, jusqu'à consistance crémeuse.`, items: [ing("flocons-avoine", 160, "g"), ing(liquid.ingredientId, 750, "ml"), ing("sel", 1, "pincee")], minutes: 6, timers: [timer("Gruau", 5)] },
          { text: `Répartissez dans 4 bols et garnissez de ${fruit.label} et de ${top.label}.`, items: [...fruit.items, ...top.items] },
        ]
      : base === "nuit"
        ? [
            { text: `Dans un grand pot, mélangez les flocons d'avoine, le ${liquid.label} et les graines de chia.`, items: [ing("flocons-avoine", 160, "g"), ing(liquid.ingredientId, 500, "ml"), ing("graines-chia", 2, "c-soupe")] },
            { text: "Couvrez et réfrigérez au moins 6 heures, idéalement toute la nuit.", minutes: 360 },
            { text: `Au matin, mélangez et garnissez de ${fruit.label} et de ${top.label}.`, items: [...fruit.items, ...top.items] },
          ]
        : [
            { text: `Fouettez les graines de chia avec le ${liquid.label} et le sirop d'érable. Attendez 5 minutes et fouettez de nouveau pour éviter les grumeaux.`, items: [ing("graines-chia", 80, "g"), ing(liquid.ingredientId, 500, "ml"), ing("sirop-erable", 1, "c-soupe")], minutes: 5, timers: [timer("Repos du chia", 5)] },
            { text: "Couvrez et réfrigérez au moins 4 heures, jusqu'à consistance de pouding.", minutes: 240 },
            { text: `Garnissez de ${fruit.label} et de ${top.label} au moment de servir.`, items: [...fruit.items, ...top.items] },
          ];
  return make(
    {
      id: slug(base === "gruau" ? "gruau" : base === "nuit" ? "gruau-nuit" : "chia", fruit.key, top.key, liquidKey),
      name: `${names[base]}, ${fruit.label} et ${top.label}${liquidKey === "soya" ? " (boisson de soya)" : ""}`,
      description: `${names[base]} garni de ${fruit.label} et de ${top.label}. Un déjeuner ${base === "gruau" ? "réconfortant" : "prêt d'avance"} qui donne de l'énergie pour la matinée.`,
      cuisine: base === "chia" ? "Nord-américaine" : "Québécoise",
      mealTypes: ["dejeuner"],
      prepMinutes: 5,
      cookMinutes: base === "gruau" ? 6 : 0,
      difficulty: "facile",
      tags: ["pre-entrainement", ...(base === "gruau" ? (["rapide"] as RecipeTag[]) : (["prep-avance"] as RecipeTag[])), "familial"],
      tips: [base === "gruau" ? "Ajoutez un peu de liquide en réchauffant les restes : le gruau épaissit en refroidissant." : "Préparez 4 pots individuels le dimanche : les déjeuners de la semaine sont réglés."],
      substitutions: subs(
        base !== "chia" ? { from: "Flocons d'avoine", to: "Flocons d'avoine certifiés sans gluten" } : undefined,
        top.key === "beurre-arachide" ? { from: "Beurre d'arachide", to: "Beurre de graines de tournesol", note: "Sans arachides." } : undefined,
      ),
      firstTime: guide({
        utensils: base === "gruau" ? ["Casserole", "Cuillère de bois", "4 bols"] : ["Pots avec couvercle", "Fouet"],
        prep: ["Mesurez les ingrédients secs à l'avance."],
        techniques: [base === "gruau" ? "Cuire à feu moyen-doux en remuant pour éviter que ça colle." : "Trempage à froid : les flocons et le chia gonflent sans cuisson."],
        doneness: ["Texture crémeuse, ni liquide ni compacte."],
        meat: false,
      }),
      illustration: "bol",
    },
    steps,
  );
}

/* ------------------------------------------------------------------ */
/* 10. Smoothies                                                       */
/* ------------------------------------------------------------------ */

const SMOOTHIE_FRUITS: Array<{ key: string; label: string; items: RecipeIngredient[] }> = [
  { key: "banane-petits-fruits", label: "banane et petits fruits", items: [ing("banane", 1, "unite"), ing("petits-fruits", 150, "g")] },
  { key: "mangue-ananas", label: "mangue et ananas", items: [ing("mangue", 0.5, "unite", { note: "en dés" }), ing("ananas", 150, "g")] },
  { key: "fraise-banane", label: "fraise et banane", items: [ing("fraises", 150, "g"), ing("banane", 1, "unite")] },
  { key: "bleuets-epinards", label: "bleuets et épinards", items: [ing("bleuets", 150, "g"), ing("epinards", 40, "g"), ing("banane", 1, "unite")] },
  { key: "banane-cacao", label: "banane et cacao", items: [ing("banane", 2, "unite"), ing("cacao", 1, "c-soupe")] },
  { key: "pomme-gingembre", label: "pomme, épinards et gingembre", items: [ing("pomme", 1, "unite", { note: "en morceaux" }), ing("epinards", 40, "g"), ing("gingembre", 5, "g")] },
];

const SMOOTHIE_PROTEINS: Array<{ key: string; label: string; items: RecipeIngredient[] }> = [
  { key: "yogourt", label: "au yogourt grec", items: [ing("yogourt-grec", 200, "g")] },
  { key: "arachide", label: "au beurre d'arachide", items: [ing("beurre-arachide", 2, "c-soupe"), ing("flocons-avoine", 30, "g")] },
  { key: "cottage", label: "au cottage", items: [ing("cottage", 200, "g")] },
  { key: "tofu", label: "au tofu", items: [ing("tofu-ferme", 150, "g")] },
  { key: "chia", label: "au chia", items: [ing("graines-chia", 2, "c-soupe")] },
];

function smoothie(fruit: (typeof SMOOTHIE_FRUITS)[number], protein: (typeof SMOOTHIE_PROTEINS)[number], liquidKey: string): Recipe {
  const liquid = LIQUIDS[liquidKey];
  return make(
    {
      id: slug("smoothie", fruit.key, protein.key, liquidKey),
      name: `Smoothie ${fruit.label} ${protein.label}${liquidKey === "soya" ? " (soya)" : ""}`,
      description: `Un smoothie ${fruit.label}, rendu plus rassasiant ${protein.label.replace(/^au /, "grâce au ")}. Prêt en 5 minutes.`,
      cuisine: "Nord-américaine",
      mealTypes: ["collation", "dejeuner"],
      servings: 2,
      prepMinutes: 5,
      cookMinutes: 0,
      difficulty: "facile",
      equipment: ["melangeur"],
      tags: ["rapide", "post-entrainement", "familial"],
      tips: ["Utilisez des fruits congelés : le smoothie sera froid et onctueux sans glaçons."],
      substitutions: [],
      firstTime: guide({ utensils: ["Mélangeur", "Tasse à mesurer"], prep: ["Coupez les fruits en morceaux."], techniques: ["Mixer en commençant à basse vitesse."], doneness: ["Texture lisse, sans morceaux."], meat: false }),
      illustration: "verre",
    },
    [
      { text: `Versez le ${liquid.label} dans le mélangeur, puis ajoutez les fruits et ${protein.label.replace(/^au /, "le ")}.`, items: [ing(liquid.ingredientId, 300, "ml"), ...fruit.items, ...protein.items] },
      { text: "Mixez 45 à 60 secondes à haute vitesse jusqu'à consistance lisse. Servez aussitôt.", minutes: 1, timers: [timer("Mixage", 1)] },
    ],
  );
}

/* ------------------------------------------------------------------ */
/* 11. Parfaits et collations                                          */
/* ------------------------------------------------------------------ */

const CRUNCH: Array<{ key: string; label: string; items: RecipeIngredient[] }> = [
  { key: "amandes", label: "amandes effilées", items: [ing("amandes", 30, "g")] },
  { key: "avoine-erable", label: "avoine grillée à l'érable", items: [ing("flocons-avoine", 40, "g"), ing("sirop-erable", 1, "c-soupe")] },
  { key: "chia-cacao", label: "chia-cacao", items: [ing("graines-chia", 1, "c-soupe"), ing("cacao", 1, "c-the")] },
  { key: "arachides", label: "arachides", items: [ing("arachides", 30, "g")] },
];

function parfait(baseKey: "yogourt" | "cottage", fruit: (typeof FRUITS)[number], crunch: (typeof CRUNCH)[number]): Recipe {
  const base = baseKey === "yogourt" ? ing("yogourt-grec", 400, "g") : ing("cottage", 400, "g");
  const label = baseKey === "yogourt" ? "yogourt grec" : "cottage";
  return make(
    {
      id: slug("parfait", baseKey, fruit.key, crunch.key),
      name: `Parfait ${label}, ${fruit.label} et ${crunch.label}`,
      description: `Des étages de ${label}, de ${fruit.label} et de ${crunch.label} : une collation protéinée et croquante.`,
      cuisine: "Nord-américaine",
      mealTypes: ["collation", "dejeuner"],
      servings: 2,
      prepMinutes: 5,
      cookMinutes: crunch.key === "avoine-erable" ? 4 : 0,
      difficulty: "facile",
      tags: ["rapide", "post-entrainement", "familial"],
      tips: ["Montez les parfaits dans des pots : ils voyagent bien dans la boîte à lunch."],
      substitutions: [],
      firstTime: guide({ utensils: ["2 verres ou pots", "Cuillère"], prep: ["Coupez les fruits."], techniques: ["Monter en couches."], doneness: ["Servez bien froid."], meat: false }),
      illustration: "verre",
    },
    [
      crunch.key === "avoine-erable"
        ? { text: "Faites griller les flocons d'avoine avec le sirop d'érable 3 à 4 minutes dans une poêle sèche, en remuant. Laissez refroidir.", items: crunch.items, minutes: 4, timers: [timer("Avoine grillée", 4)] }
        : { text: `Préparez le croquant : ${crunch.label}.`, items: crunch.items },
      { text: `Dans 2 verres, alternez des couches de ${label}, de ${fruit.label} et de croquant.`, items: [base, ...fruit.items] },
    ],
  );
}

/* ------------------------------------------------------------------ */
/* 12. Tartines                                                        */
/* ------------------------------------------------------------------ */

const TOASTS: Array<{ key: string; name: string; items: RecipeIngredient[]; text: string; cook?: number; kid: boolean }> = [
  { key: "avocat-oeuf", name: "Tartines avocat et œuf au plat", items: [ing("avocat", 2, "unite"), ing("lime", 0.5, "unite", { note: "jus" }), ing("oeuf", 4, "unite"), ing("huile-vegetale", 1, "c-soupe")], text: "Écrasez l'avocat avec le jus de lime et une pincée de sel. Cuisez les œufs au plat dans l'huile 3 à 4 minutes, jusqu'à ce que le blanc soit pris. Tartinez le pain d'avocat et déposez un œuf sur chaque tranche.", cook: 4, kid: true },
  { key: "arachide-banane", name: "Tartines beurre d'arachide, banane et cannelle", items: [ing("beurre-arachide", 4, "c-soupe"), ing("banane", 2, "unite", { note: "tranchées" }), ing("cannelle", 0.5, "c-the")], text: "Tartinez le pain grillé de beurre d'arachide, ajoutez les rondelles de banane et saupoudrez de cannelle.", kid: true },
  { key: "cottage-fraises", name: "Tartines cottage, fraises et miel", items: [ing("cottage", 200, "g"), ing("fraises", 200, "g", { note: "tranchées" }), ing("miel", 1, "c-soupe")], text: "Étalez le cottage sur le pain grillé, ajoutez les fraises et un filet de miel.", kid: true },
  { key: "pois-chiches", name: "Tartines de pois chiches écrasés au citron", items: [ing("pois-chiches", 300, "g", { note: "rincés" }), ing("citron", 0.5, "unite", { note: "jus" }), ing("huile-olive", 1, "c-soupe"), ing("persil", 10, "g")], text: "Écrasez les pois chiches à la fourchette avec le jus de citron, l'huile d'olive, le persil et une pincée de sel. Étalez sur le pain grillé.", kid: true },
  { key: "thon-citron", name: "Tartines de thon au citron et concombre", items: [ing("thon-conserve", 170, "g"), ing("yogourt-grec", 60, "g"), ing("citron", 0.5, "unite", { note: "jus" }), ing("concombre", 0.5, "unite", { note: "en fines tranches" })], text: "Mélangez le thon égoutté avec le yogourt et le jus de citron. Étalez sur le pain grillé et couvrez de tranches de concombre.", kid: true },
  { key: "tomate-feta", name: "Tartines tomate, feta et basilic", items: [ing("tomate", 2, "unite", { note: "tranchées" }), ing("feta", 80, "g"), ing("basilic", 10, "g"), ing("huile-olive", 1, "c-soupe")], text: "Disposez les tranches de tomate sur le pain grillé, émiettez la feta, ajoutez le basilic et un filet d'huile d'olive.", kid: true },
  { key: "oeufs-epinards", name: "Tartines aux œufs brouillés et épinards", items: [ing("oeuf", 6, "unite"), ing("epinards", 60, "g"), ing("huile-vegetale", 1, "c-soupe")], text: "Faites tomber les épinards dans l'huile 1 minute, ajoutez les œufs battus et brouillez-les à feu doux 4 minutes. Servez sur le pain grillé.", cook: 5, kid: true },
];

function toast(t: (typeof TOASTS)[number]): Recipe {
  return make(
    {
      id: slug("tartines", t.key),
      name: t.name,
      description: `${t.name} : un déjeuner ou une collation prête en quelques minutes.`,
      cuisine: "Nord-américaine",
      mealTypes: ["dejeuner", "collation"],
      prepMinutes: 5,
      cookMinutes: (t.cook ?? 0) + 3,
      difficulty: "facile",
      tags: ["rapide", "familial"],
      tips: ["Un pain de grains entiers rassasie plus longtemps."],
      substitutions: [{ from: "Pain de blé entier", to: "Pain sans gluten" }],
      firstTime: guide({ utensils: ["Grille-pain", "Couteau à tartiner"], prep: ["Faites griller le pain au dernier moment."], techniques: ["Tartiner sur pain chaud pour plus de saveur."], doneness: t.key.includes("oeuf") ? ["Œufs : blanc entièrement opaque ; 71 °C."] : ["Pain doré et croustillant."], meat: t.key.includes("oeuf") }),
      illustration: "tartine",
    },
    [
      { text: "Faites griller les tranches de pain.", items: [ing("pain-ble-entier", 4, "unite")], minutes: 3, timers: [timer("Pain grillé", 3)] },
      { text: t.text, items: t.items, minutes: t.cook, timers: t.cook ? [timer("Cuisson", t.cook)] : undefined },
    ],
  );
}

/* ------------------------------------------------------------------ */
/* 13. Spéciaux enfants                                                */
/* ------------------------------------------------------------------ */

function kidsRecipes(): Recipe[] {
  const out: Recipe[] = [];
  const kidGuide = (utensils: string[], meat: boolean, doneness: string) =>
    guide({ utensils, prep: ["Faites participer les enfants : laver, mélanger, garnir."], techniques: ["Gardez les enfants loin du four chaud et des couteaux tranchants."], doneness: [doneness], meat });

  // Pizzas tortillas
  const PIZZA: Array<{ key: string; label: string; items: RecipeIngredient[] }> = [
    { key: "poivron-champignons", label: "poivron et champignons", items: [ing("poivron-rouge", 1, "unite", { note: "en dés" }), ing("champignons", 120, "g", { note: "tranchés" })] },
    { key: "epinards-tomates", label: "épinards et tomates cerises", items: [ing("epinards", 60, "g"), ing("tomate-cerise", 150, "g", { note: "coupées en deux" })] },
    { key: "mais-poivron", label: "maïs et poivron", items: [ing("mais", 150, "g"), ing("poivron-rouge", 1, "unite", { note: "en dés" })] },
    { key: "ananas-dinde", label: "ananas et dinde", items: [ing("ananas", 150, "g"), ing("dinde-hachee", 200, "g")] },
  ];
  for (const p of PIZZA) {
    const turkey = p.key.includes("dinde");
    out.push(
      make(
        {
          id: slug("pizzas-tortillas", p.key),
          name: `Pizzas tortillas ${p.label}`,
          description: `Des pizzas croustillantes sur tortillas, garnies de ${p.label} : les enfants les composent eux-mêmes.`,
          cuisine: "Italienne",
          mealTypes: ["diner", "souper"],
          prepMinutes: 10,
          cookMinutes: turkey ? 20 : 10,
          difficulty: "facile",
          equipment: ["four"],
          tags: ["enfants", "familial", "rapide"],
          tips: ["Disposez les garnitures dans de petits bols : chaque enfant compose sa pizza."],
          substitutions: [{ from: "Tortillas de blé", to: "Tortillas de maïs", note: "Version sans gluten, plus petites." }],
          firstTime: kidGuide(["Plaque de cuisson", "Cuillère pour la sauce", "Roulette à pizza"], turkey, turkey ? "Dinde hachée : 74 °C, plus de trace rosée." : "Fromage fondu et bords dorés."),
          illustration: "tartine",
        },
        [
          { text: "Préchauffez le four à 220 °C. Déposez les tortillas sur 2 plaques.", items: [ing("tortilla-ble", 4, "unite")] },
          ...(turkey ? [{ text: "Faites dorer la dinde hachée 7 minutes dans une poêle en l'émiettant, jusqu'à 74 °C.", items: [p.items[1], ing("huile-vegetale", 1, "c-the")], minutes: 7, timers: [timer("Dinde", 7)] }] : []),
          { text: "Étalez le coulis de tomates sur les tortillas, puis ajoutez les garnitures et la mozzarella.", items: [ing("passata", 125, "ml"), ing("origan", 0.5, "c-the"), ...(turkey ? [p.items[0]] : p.items), ing("mozzarella", 200, "g")] },
          { text: "Cuisez 8 à 10 minutes, jusqu'à ce que le fromage soit fondu et les bords croustillants.", minutes: 10, timers: [timer("Pizzas", 9)] },
        ],
      ),
    );
  }

  // Croquettes au four
  const CROQ: Array<{ key: string; name: string; protein: RecipeIngredient; doneness: string; meat: boolean }> = [
    { key: "poulet", name: "Croquettes de poulet croustillantes au four", protein: ing("poitrine-poulet", 500, "g", { note: "en lanières" }), doneness: "Poulet : 74 °C à cœur.", meat: true },
    { key: "poisson", name: "Bâtonnets de poisson maison au four", protein: ing("morue", 500, "g", { note: "en bâtonnets" }), doneness: "Poisson : 70 °C, chair opaque qui se défait.", meat: true },
    { key: "tofu", name: "Croquettes de tofu dorées au four", protein: ing("tofu-ferme", 450, "g", { note: "en bâtonnets" }), doneness: "Tofu : chapelure bien dorée.", meat: false },
  ];
  const DIPS: Array<{ key: string; label: string; items: RecipeIngredient[] }> = [
    { key: "miel-moutarde", label: "trempette miel-moutarde", items: [ing("yogourt-grec", 125, "g"), ing("miel", 1, "c-soupe"), ing("moutarde-dijon", 1, "c-the")] },
    { key: "tomate", label: "sauce tomate", items: [ing("passata", 250, "ml"), ing("origan", 0.5, "c-the")] },
    { key: "yogourt-herbes", label: "trempette yogourt et herbes", items: [ing("yogourt-grec", 150, "g"), ing("persil", 10, "g"), ing("citron", 0.5, "unite", { note: "jus" })] },
  ];
  const CRUMB: Array<{ key: string; label: string; item: RecipeIngredient }> = [
    { key: "panko", label: "panko", item: ing("panko", 100, "g") },
    { key: "avoine", label: "flocons d'avoine", item: ing("flocons-avoine", 100, "g") },
  ];
  for (const c of CROQ)
    for (const d of DIPS)
      for (const cr of CRUMB)
        out.push(
          make(
            {
              id: slug("croquettes", c.key, cr.key, d.key),
              name: `${c.name} (${cr.label}), ${d.label}`,
              description: `${c.name}, panées ${cr.key === "panko" ? "au panko" : "aux flocons d'avoine"} et cuites au four plutôt que frites, avec une ${d.label}.`,
              cuisine: "Nord-américaine",
              mealTypes: ["diner", "souper"],
              prepMinutes: 20,
              cookMinutes: 20,
              difficulty: "facile",
              equipment: ["four"],
              tags: ["enfants", "familial"],
              tips: ["Une main pour l'œuf, une main pour la chapelure : vos doigts ne s'empâtent pas."],
              substitutions: [{ from: cr.label, to: "Chapelure sans gluten" }],
              firstTime: kidGuide(["Plaque et papier parchemin", "2 assiettes creuses", "Pince", ...(c.meat ? ["Thermomètre numérique"] : [])], c.meat, c.doneness),
              illustration: "assiette",
            },
            [
              { text: "Préchauffez le four à 220 °C et tapissez une plaque de papier parchemin huilé.", items: [ing("huile-vegetale", 1, "c-soupe")] },
              { text: `Battez l'œuf dans une assiette creuse. Dans une autre, mélangez le ${cr.label}, le paprika et le sel.`, items: [ing("oeuf", 1, "unite"), cr.item, ing("paprika-fume", 1, "c-the"), ing("sel", 0.5, "c-the")] },
              { text: "Trempez chaque morceau dans l'œuf, puis dans la chapelure, et déposez-le sur la plaque.", items: [c.protein] },
              { text: "Cuisez 18 à 20 minutes en retournant à mi-cuisson, jusqu'à ce que ce soit doré et cuit à cœur.", minutes: 20, timers: [timer("Croquettes — 1re face", 10), timer("Croquettes — 2e face", 10)] },
              { text: `Pendant la cuisson, préparez la ${d.label} en mélangeant les ingrédients.`, items: d.items },
            ],
          ),
        );

  // Quesadillas
  const QUESA: Array<{ key: string; label: string; items: RecipeIngredient[]; meat: boolean }> = [
    { key: "haricots-mais", label: "haricots noirs et maïs", items: [ing("haricots-noirs", 250, "g", { note: "rincés et écrasés" }), ing("mais", 150, "g")], meat: false },
    { key: "poulet-poivron", label: "poulet et poivron", items: [ing("poitrine-poulet", 300, "g", { note: "cuit et effiloché" }), ing("poivron-rouge", 1, "unite", { note: "en dés" })], meat: true },
    { key: "epinards-champignons", label: "épinards et champignons", items: [ing("epinards", 80, "g"), ing("champignons", 150, "g", { note: "tranchés" })], meat: false },
    { key: "patate-haricots", label: "patate douce et haricots noirs", items: [ing("patate-douce", 1, "unite", { note: "cuite et écrasée" }), ing("haricots-noirs", 200, "g", { note: "rincés" })], meat: false },
  ];
  for (const q of QUESA)
    out.push(
      make(
        {
          id: slug("quesadillas", q.key),
          name: `Quesadillas ${q.label}`,
          description: `Des quesadillas dorées et fondantes, ${q.label} et cheddar, coupées en pointes pour les petites mains.`,
          cuisine: "Mexicaine",
          mealTypes: ["diner", "souper", "collation"],
          prepMinutes: 10,
          cookMinutes: q.meat ? 25 : 12,
          difficulty: "facile",
          tags: ["enfants", "familial", "rapide"],
          tips: ["Servez avec de la salsa douce et des crudités."],
          substitutions: [{ from: "Tortillas de blé", to: "Tortillas de maïs", note: "Sans gluten." }],
          firstTime: kidGuide(["Grande poêle antiadhésive", "Spatule large"], q.meat, q.meat ? "Poulet : 74 °C avant d'être effiloché." : "Fromage fondu, tortilla dorée."),
          illustration: "wrap",
        },
        [
          ...(q.meat
            ? [{ text: "Faites pocher le poulet 15 minutes dans l'eau frémissante, jusqu'à 74 °C, puis effilochez-le à la fourchette.", items: [q.items[0]], minutes: 15, timers: [timer("Poulet poché", 15)] }]
            : []),
          { text: `Répartissez ${q.label} et le cheddar sur la moitié de chaque tortilla, puis repliez.`, items: [ing("tortilla-ble", 4, "unite"), ...(q.meat ? q.items.slice(1) : q.items), ing("cheddar", 150, "g")] },
          { text: "Dorez les quesadillas 2 à 3 minutes par côté dans une poêle à feu moyen, jusqu'à ce que le fromage soit fondu. Coupez en pointes.", minutes: 6, timers: [timer("Quesadillas", 6)] },
          { text: "Servez avec la salsa.", items: [ing("salsa", 125, "ml")] },
        ],
      ),
    );

  // Crêpes banane-avoine
  const PANCAKE_TOPS: Array<{ key: string; label: string; items: RecipeIngredient[] }> = [
    { key: "petits-fruits", label: "petits fruits", items: [ing("petits-fruits", 200, "g")] },
    { key: "arachide", label: "beurre d'arachide", items: [ing("beurre-arachide", 3, "c-soupe")] },
    { key: "yogourt-erable", label: "yogourt et érable", items: [ing("yogourt-grec", 200, "g"), ing("sirop-erable", 2, "c-soupe")] },
    { key: "fraises", label: "fraises", items: [ing("fraises", 250, "g")] },
  ];
  for (const t of PANCAKE_TOPS)
    out.push(
      make(
        {
          id: slug("crepes-banane-avoine", t.key),
          name: `Petites crêpes banane-avoine, ${t.label}`,
          description: `Des petites crêpes moelleuses sans farine ni sucre ajouté, à la banane et à l'avoine, garnies de ${t.label}.`,
          cuisine: "Québécoise",
          mealTypes: ["dejeuner"],
          prepMinutes: 10,
          cookMinutes: 15,
          difficulty: "facile",
          equipment: ["melangeur"],
          tags: ["enfants", "familial", "pre-entrainement"],
          tips: ["Plus la banane est mûre, plus les crêpes sont sucrées naturellement."],
          substitutions: [{ from: "Flocons d'avoine", to: "Flocons d'avoine certifiés sans gluten" }],
          firstTime: kidGuide(["Mélangeur", "Poêle antiadhésive", "Spatule"], true, "Crêpes : dorées et cuites au centre (plus de pâte liquide)."),
          illustration: "assiette",
        },
        [
          { text: "Mixez les bananes, les œufs, les flocons d'avoine, le lait et la cannelle jusqu'à obtenir une pâte lisse.", items: [ing("banane", 2, "unite"), ing("oeuf", 4, "unite"), ing("flocons-avoine", 100, "g"), ing("lait", 125, "ml"), ing("cannelle", 0.5, "c-the")] },
          { text: "Chauffez un peu d'huile à feu moyen-doux. Versez de petites louches de pâte et cuisez 2 minutes par côté.", items: [ing("huile-vegetale", 1, "c-soupe")], minutes: 15, timers: [timer("Crêpes — 1re face", 2), timer("Crêpes — 2e face", 2)] },
          { text: `Servez garni de ${t.label}.`, items: t.items },
        ],
      ),
    );

  // Brochettes de fruits
  const SKEWERS: Array<{ key: string; label: string; items: RecipeIngredient[] }> = [
    { key: "arc-en-ciel", label: "arc-en-ciel", items: [ing("fraises", 200, "g"), ing("mangue", 1, "unite"), ing("ananas", 200, "g"), ing("bleuets", 125, "g")] },
    { key: "tropicales", label: "tropicales", items: [ing("mangue", 1, "unite"), ing("ananas", 250, "g"), ing("banane", 2, "unite")] },
    { key: "rouges", label: "fruits rouges et banane", items: [ing("fraises", 250, "g"), ing("banane", 2, "unite"), ing("petits-fruits", 100, "g")] },
  ];
  for (const s of SKEWERS)
    out.push(
      make(
        {
          id: slug("brochettes-fruits", s.key),
          name: `Brochettes de fruits ${s.label}, trempette yogourt-érable`,
          description: `Des brochettes de fruits ${s.label} à tremper dans un yogourt à l'érable : la collation préférée des enfants.`,
          cuisine: "Québécoise",
          mealTypes: ["collation"],
          prepMinutes: 15,
          cookMinutes: 0,
          difficulty: "facile",
          tags: ["enfants", "familial", "rapide"],
          tips: ["Pour les tout-petits, utilisez des pailles réutilisables au lieu de pics pointus."],
          substitutions: [{ from: "Yogourt grec", to: "Yogourt de coco", note: "Sans produits laitiers." }],
          firstTime: kidGuide(["Pics à brochettes (bouts ronds pour les petits)", "Couteau", "Petit bol"], false, "Fruits bien lavés et frais."),
          illustration: "assiette",
        },
        [
          { text: "Lavez et coupez les fruits en bouchées, puis enfilez-les en alternant les couleurs.", items: s.items },
          { text: "Mélangez le yogourt et le sirop d'érable pour la trempette.", items: [ing("yogourt-grec", 200, "g"), ing("sirop-erable", 1, "c-soupe")] },
        ],
      ),
    );

  // Boulettes
  for (const meatKey of ["dinde", "boeuf-hache"])
    for (const side of ["spaghetti", "riz-basmati", "penne"]) {
      const meat = meatKey === "dinde" ? ing("dinde-hachee", 450, "g") : ing("boeuf-hache", 450, "g");
      const meatLabel = meatKey === "dinde" ? "de dinde" : "de bœuf";
      const sideLabel = side === "riz-basmati" ? "riz basmati" : side;
      const sideItem = side === "riz-basmati" ? ing("riz-basmati", 300, "g") : ing(side, 350, "g");
      out.push(
        make(
          {
            id: slug("boulettes", meatKey, side),
            name: `Mini-boulettes ${meatLabel} en sauce tomate, ${sideLabel}`,
            description: `Des mini-boulettes ${meatLabel} tendres, mijotées dans une sauce tomate douce et servies avec du ${sideLabel}.`,
            cuisine: "Italienne",
            mealTypes: ["souper", "diner"],
            prepMinutes: 20,
            cookMinutes: 25,
            difficulty: "facile",
            tags: ["enfants", "familial", "prep-avance"],
            tips: ["Les boulettes crues se congèlent sur une plaque, puis en sac : cuisez-les directement dans la sauce."],
            substitutions: [{ from: "Chapelure panko", to: "Flocons d'avoine certifiés sans gluten" }],
            firstTime: kidGuide(["Grand bol", "Grande poêle profonde avec couvercle", "Casserole", "Thermomètre numérique"], true, meatKey === "dinde" ? "Boulettes de dinde : 74 °C à cœur." : "Boulettes de bœuf : 71 °C à cœur."),
            illustration: side === "riz-basmati" ? "assiette" : "pates",
          },
          [
            { text: "Mélangez la viande hachée, l'œuf, la chapelure, le parmesan et le sel. Façonnez 30 petites boulettes avec les mains humides.", items: [meat, ing("oeuf", 1, "unite"), ing("panko", 40, "g"), ing("parmesan", 30, "g"), ing("sel", 0.5, "c-the")] },
            { text: "Dorez les boulettes 5 minutes dans l'huile, à feu moyen, en les roulant dans la poêle.", items: [ing("huile-vegetale", 1, "c-soupe")], minutes: 5, timers: [timer("Boulettes dorées", 5)] },
            { text: "Ajoutez le coulis de tomates et l'origan, couvrez et laissez mijoter 15 minutes, jusqu'à ce que les boulettes soient cuites à cœur.", items: [ing("passata", 700, "ml"), ing("origan", 1, "c-the")], minutes: 15, timers: [timer("Boulettes en sauce", 15)] },
            {
              text: side === "riz-basmati" ? "Pendant ce temps, cuisez le riz dans 600 ml d'eau salée, à couvert, 12 minutes, puis laissez reposer 5 minutes. Servez les boulettes sur le riz." : `Pendant ce temps, cuisez les ${sideLabel} dans l'eau bouillante salée environ 10 minutes. Servez avec les boulettes et la sauce.`,
              items: [sideItem],
              minutes: side === "riz-basmati" ? 17 : 10,
              timers: [timer(capitalize(sideLabel), side === "riz-basmati" ? 12 : 10)],
            },
          ],
        ),
      );
    }

  return out;
}

/* ------------------------------------------------------------------ */
/* 14. Collations                                                      */
/* ------------------------------------------------------------------ */

function snacks(): Recipe[] {
  const out: Recipe[] = [];
  const snackGuide = (utensils: string[], equipmentNote: string) =>
    guide({ utensils, prep: ["Mesurez tous les ingrédients avant de commencer."], techniques: [equipmentNote], doneness: ["Se conserve dans un contenant hermétique."], meat: false });

  for (const base of [
    { key: "arachide", label: "beurre d'arachide", item: ing("beurre-arachide", 120, "g") },
    { key: "tahini", label: "tahini", item: ing("tahini", 120, "g") },
  ])
    for (const flavor of [
      { key: "cacao", label: "cacao", items: [ing("cacao", 2, "c-soupe")] },
      { key: "cannelle-erable", label: "cannelle et érable", items: [ing("cannelle", 1, "c-the"), ing("sirop-erable", 1, "c-soupe")] },
      { key: "chia", label: "chia", items: [ing("graines-chia", 2, "c-soupe")] },
    ])
      out.push(
        make(
          {
            id: slug("boules-energie", base.key, flavor.key),
            name: `Boules d'énergie ${base.label}, ${flavor.label}`,
            description: `Dattes, avoine et ${base.label}, parfumées au ${flavor.label} : l'en-cas idéal avant l'entraînement.`,
            cuisine: "Moyen-orientale",
            mealTypes: ["collation"],
            servings: 8,
            prepMinutes: 15,
            cookMinutes: 0,
            difficulty: "facile",
            equipment: ["robot-culinaire"],
            tags: ["pre-entrainement", "prep-avance", "familial"],
            tips: ["Se conservent 1 semaine au réfrigérateur ou 3 mois au congélateur."],
            substitutions: [{ from: "Flocons d'avoine", to: "Flocons d'avoine certifiés sans gluten" }],
            firstTime: snackGuide(["Robot culinaire", "Plaque"], "Façonner avec les mains humides."),
            illustration: "pot",
          },
          [
            { text: "Mixez les flocons d'avoine 20 secondes dans le robot.", items: [ing("flocons-avoine", 100, "g")] },
            { text: `Ajoutez les dattes dénoyautées, le ${base.label} et les ingrédients de saveur. Mixez jusqu'à ce que la pâte forme une boule.`, items: [ing("dattes", 12, "unite"), base.item, ...flavor.items] },
            { text: "Façonnez 16 boules avec les mains humides et réfrigérez 20 minutes.", minutes: 20, timers: [timer("Raffermir", 20)] },
          ],
        ),
      );

  for (const spice of [
    { key: "paprika", label: "au paprika fumé", items: [ing("paprika-fume", 1, "c-the")] },
    { key: "cari", label: "au cari doux", items: [ing("curry-poudre", 1, "c-the")] },
    { key: "erable-cannelle", label: "à l'érable et à la cannelle", items: [ing("sirop-erable", 1, "c-soupe"), ing("cannelle", 1, "c-the")] },
    { key: "herbes", label: "aux herbes de Provence", items: [ing("herbes-provence", 1, "c-the")] },
  ])
    out.push(
      make(
        {
          id: slug("pois-chiches-croustillants", spice.key),
          name: `Pois chiches croustillants ${spice.label}`,
          description: `Des pois chiches rôtis jusqu'à ce qu'ils croquent, ${spice.label}. Une collation riche en fibres qui remplace les croustilles.`,
          cuisine: "Moyen-orientale",
          mealTypes: ["collation"],
          prepMinutes: 5,
          cookMinutes: 30,
          difficulty: "facile",
          equipment: ["four"],
          tags: ["prep-avance", "familial"],
          tips: ["Épongez-les très soigneusement : c'est le secret du croustillant."],
          substitutions: [],
          firstTime: snackGuide(["Plaque de cuisson", "Papier parchemin", "Linge propre"], "Rôtir à 200 °C en secouant la plaque."),
          illustration: "pot",
        },
        [
          { text: "Préchauffez le four à 200 °C. Rincez et épongez très bien les pois chiches.", items: [ing("pois-chiches", 500, "g")] },
          { text: "Mélangez-les avec l'huile, le sel et les assaisonnements, puis étalez-les sur une plaque.", items: [ing("huile-olive", 1, "c-soupe"), ing("sel", 0.5, "c-the"), ...spice.items] },
          { text: "Rôtissez 30 minutes en secouant la plaque à mi-cuisson, jusqu'à ce qu'ils soient dorés et croquants.", minutes: 30, timers: [timer("Pois chiches rôtis", 30)] },
        ],
      ),
    );

  for (const h of [
    { key: "classique", label: "classique", items: [] as RecipeIngredient[] },
    { key: "poivron", label: "au poivron rouge", items: [ing("poivron-rouge", 1, "unite", { note: "en morceaux" })] },
    { key: "herbes", label: "aux fines herbes", items: [ing("persil", 15, "g"), ing("coriandre", 10, "g")] },
  ])
    out.push(
      make(
        {
          id: slug("houmous", h.key),
          name: `Houmous ${h.label} et crudités`,
          description: `Un houmous ${h.label} ultra-lisse, servi avec des bâtonnets de carottes et de concombre.`,
          cuisine: "Libanaise",
          mealTypes: ["collation"],
          servings: 6,
          prepMinutes: 15,
          cookMinutes: 0,
          difficulty: "facile",
          equipment: ["robot-culinaire"],
          tags: ["prep-avance", "familial"],
          tips: ["Se conserve 5 jours au réfrigérateur."],
          substitutions: [{ from: "Tahini", to: "Huile d'olive supplémentaire", note: "Sans sésame." }],
          firstTime: snackGuide(["Robot culinaire", "Spatule"], "Émulsionner en ajoutant de l'eau glacée en filet."),
          illustration: "pot",
        },
        [
          { text: "Mixez le tahini et le jus de citron 1 minute.", items: [ing("tahini", 60, "ml"), ing("citron", 1, "unite", { note: "jus" })] },
          { text: "Ajoutez les pois chiches, l'ail, le sel et les ingrédients de saveur ; mixez 2 minutes en ajoutant 3 c. à soupe d'eau glacée.", items: [ing("pois-chiches", 350, "g"), ing("ail", 1, "unite"), ing("sel", 0.5, "c-the"), ...h.items], minutes: 3 },
          { text: "Servez avec les crudités en bâtonnets.", items: [ing("carotte", 3, "unite"), ing("concombre", 1, "unite")] },
        ],
      ),
    );

  return out;
}

/* ------------------------------------------------------------------ */
/* Génération complète                                                 */
/* ------------------------------------------------------------------ */

export function generateAll(): Recipe[] {
  const out: Recipe[] = [];

  for (const flavor of FLAVORS) {
    if (["gingembre-ail", "aigre-doux"].includes(flavor.key)) continue;
    for (const pk of BOWL_PROTEINS) {
      const protein = proteinByKey(pk);
      if (!protein.pan) continue;
      for (const sk of flavor.starches.slice(0, 2)) for (const vk of flavor.vegs.slice(0, 2)) out.push(bowl(flavor, protein, STARCHES[sk], VEGS[vk]));
    }
  }

  for (const flavor of FLAVORS.filter((f) => f.wok))
    for (const pk of WOK_PROTEINS)
      for (const sk of flavor.starches.filter((s) => s !== "quinoa").slice(0, 2))
        for (const vk of flavor.vegs.filter((v) => !VEGS[v].raw).slice(0, 2)) out.push(stirFry(flavor, proteinByKey(pk), STARCHES[sk], VEGS[vk]));

  for (const pk of Object.keys(PASTAS))
    for (const sauce of PASTA_SAUCES) for (const prot of PASTA_PROTEINS) for (const vk of PASTA_VEGS) out.push(pasta(pk, sauce, prot, vegOf(vk)));

  for (const kind of ["tacos", "wraps"] as const)
    for (const style of WRAP_STYLES) for (const pk of WRAP_PROTEINS) out.push(wrap(kind, style, proteinByKey(pk)));

  for (const flavor of OVEN_FLAVORS) for (const pk of OVEN_PROTEINS) for (const veg of OVEN_VEGS) out.push(sheetPan(flavor, proteinByKey(pk), veg));

  for (const base of SOUP_BASES)
    for (const pk of SOUP_PROTEINS) {
      if (pk === "haricots-noirs" && base.key !== "mexicaine") continue;
      for (const veg of SOUP_VEGS) out.push(soup(base, proteinByKey(pk), veg));
    }

  for (const dressing of DRESSINGS) for (const pk of SALAD_PROTEINS) for (const base of SALAD_BASES) out.push(salad(dressing, proteinByKey(pk), base));

  for (const style of ["frittata", "muffins", "brouilles"] as const) for (const f of EGG_FILLINGS) out.push(eggs(style, f));

  for (const base of ["gruau", "nuit", "chia"] as const)
    for (const fruit of FRUITS) for (const top of TOPPINGS) for (const lk of Object.keys(LIQUIDS)) out.push(breakfastBowl(base, fruit, top, lk));

  for (const fruit of SMOOTHIE_FRUITS) for (const prot of SMOOTHIE_PROTEINS) for (const lk of Object.keys(LIQUIDS)) out.push(smoothie(fruit, prot, lk));

  for (const baseKey of ["yogourt", "cottage"] as const) for (const fruit of FRUITS) for (const crunch of CRUNCH) out.push(parfait(baseKey, fruit, crunch));

  for (const t of TOASTS) out.push(toast(t));
  out.push(...kidsRecipes(), ...snacks(), ...moreFormats());

  return out;
}

export { PROTEINS, frenchList };
