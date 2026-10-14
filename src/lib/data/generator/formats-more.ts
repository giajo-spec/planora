import type { MealType, Recipe, RecipeIngredient } from "@/lib/domain/types";
import { ing } from "../recipes/helpers";
import { type DraftStep, capitalize, roundTo5, slug, timer } from "./builder";
import { type Protein, proteinByKey } from "./components";
import { cookingStep, guide, make, maxDifficulty, subs } from "./formats";

/**
 * Formats supplémentaires pour varier les menus : caris, chilis, burgers,
 * gratins, riz frits, brochettes, mijotés et papillotes.
 * Mêmes principes : ingrédients normalisés, étapes avec minuteries,
 * températures sécuritaires, guide pour débutants.
 */

const SOUPER: MealType[] = ["souper", "diner"];
const strip = (p: Protein) => p.the.replace(/^(le|la|les) /, "");
const plainWith = (p: Protein) => p.with.replace(" grillés", "").replace(" croustillant", "");

/* ------------------------------------------------------------------ */
/* Caris mijotés                                                       */
/* ------------------------------------------------------------------ */

const CURRY_BASES: Array<{ key: string; title: string; cuisine: string; items: RecipeIngredient[]; text: string; finish: RecipeIngredient[]; finishLabel: string }> = [
  {
    key: "coco-doux",
    title: "Cari coco doux",
    cuisine: "Indienne",
    items: [ing("huile-vegetale", 2, "c-soupe"), ing("oignon", 1, "unite", { note: "haché" }), ing("ail", 3, "unite", { note: "hachées" }), ing("gingembre", 15, "g", { note: "râpé" }), ing("curry-poudre", 1, "c-soupe"), ing("curcuma", 0.5, "c-the"), ing("lait-coco", 400, "ml"), ing("tomates-des", 398, "ml"), ing("sel", 1, "c-the")],
    text: "Dans une grande casserole, faites revenir l'oignon dans l'huile 5 minutes. Ajoutez l'ail, le gingembre, la poudre de cari et le curcuma 1 minute, puis le lait de coco, les tomates et le sel. Laissez mijoter 8 minutes.",
    finish: [ing("coriandre", 10, "g"), ing("lime", 0.5, "unite", { note: "jus" })],
    finishLabel: "coriandre et jus de lime",
  },
  {
    key: "tikka",
    title: "Tikka masala",
    cuisine: "Indienne",
    items: [ing("huile-vegetale", 2, "c-soupe"), ing("oignon", 1, "unite", { note: "haché" }), ing("ail", 3, "unite", { note: "hachées" }), ing("gingembre", 15, "g", { note: "râpé" }), ing("garam-masala", 2, "c-the"), ing("cumin", 1, "c-the"), ing("paprika-fume", 1, "c-the"), ing("tomates-broyees", 796, "ml"), ing("sel", 1, "c-the")],
    text: "Dans une grande casserole, faites revenir l'oignon dans l'huile 5 minutes. Ajoutez l'ail, le gingembre et les épices 1 minute, puis les tomates et le sel. Laissez mijoter 8 minutes.",
    finish: [ing("yogourt-grec", 150, "g"), ing("coriandre", 10, "g")],
    finishLabel: "yogourt grec (hors du feu) et coriandre",
  },
  {
    key: "thai",
    title: "Cari thaï au lait de coco",
    cuisine: "Thaïlandaise",
    items: [ing("huile-vegetale", 1, "c-soupe"), ing("ail", 2, "unite", { note: "hachées" }), ing("gingembre", 20, "g", { note: "râpé" }), ing("curry-poudre", 1, "c-soupe"), ing("lait-coco", 400, "ml"), ing("bouillon-legumes", 250, "ml"), ing("sauce-soja", 1, "c-soupe"), ing("sirop-erable", 1, "c-the")],
    text: "Dans une grande casserole, faites revenir l'ail, le gingembre et la poudre de cari dans l'huile 1 minute. Ajoutez le lait de coco, le bouillon, la sauce soja et le sirop d'érable. Portez à frémissement.",
    finish: [ing("lime", 1, "unite", { note: "jus" }), ing("basilic", 10, "g")],
    finishLabel: "jus de lime et basilic",
  },
  {
    key: "epinards",
    title: "Masala aux épinards",
    cuisine: "Indienne",
    items: [ing("huile-vegetale", 2, "c-soupe"), ing("oignon", 1, "unite", { note: "haché" }), ing("ail", 3, "unite", { note: "hachées" }), ing("gingembre", 15, "g", { note: "râpé" }), ing("garam-masala", 2, "c-the"), ing("cumin", 1, "c-the"), ing("tomates-des", 398, "ml"), ing("epinards", 200, "g"), ing("sel", 1, "c-the")],
    text: "Dans une grande casserole, faites revenir l'oignon dans l'huile 5 minutes. Ajoutez l'ail, le gingembre et les épices 1 minute, puis les tomates, les épinards et le sel. Laissez mijoter 6 minutes et mixez grossièrement si vous aimez une sauce lisse.",
    finish: [ing("yogourt-grec", 100, "g"), ing("citron", 0.5, "unite", { note: "jus" })],
    finishLabel: "yogourt grec et jus de citron",
  },
];

const CURRY_VEGS: Array<{ key: string; label: string; items: RecipeIngredient[] }> = [
  { key: "chou-fleur-pois", label: "chou-fleur et petits pois", items: [ing("chou-fleur", 300, "g", { note: "en petits fleurons" }), ing("petits-pois", 150, "g")] },
  { key: "patate-douce", label: "patate douce", items: [ing("patate-douce", 1, "unite", { note: "en cubes de 2 cm" })] },
  { key: "courgette-poivron", label: "courgette et poivron", items: [ing("courgette", 1, "unite", { note: "en dés" }), ing("poivron-rouge", 1, "unite", { note: "en dés" })] },
];

function curry(base: (typeof CURRY_BASES)[number], protein: Protein, veg: (typeof CURRY_VEGS)[number]): Recipe {
  const c = protein.soup!;
  return make(
    {
      id: slug("cari", base.key, protein.key, veg.key),
      family: "cari",
      name: `${base.title} ${plainWith(protein)}, ${veg.label}`,
      description: `Un cari mijoté et parfumé, ${strip(protein)} et ${veg.label}, servi sur du riz basmati. Encore meilleur le lendemain.`,
      cuisine: base.cuisine,
      mealTypes: SOUPER,
      prepMinutes: 15,
      cookMinutes: roundTo5(14 + 10 + c.minutes),
      difficulty: "facile",
      tags: ["familial", "prep-avance"],
      tips: ["Les caris se congèlent très bien jusqu'à 3 mois.", "Ajoutez une pincée de flocons de piment pour les adultes, au moment de servir."],
      substitutions: subs(protein.substitution, { from: "Lait de coco", to: "Lait de coco allégé", note: "Moins de lipides, sauce un peu moins onctueuse." }),
      firstTime: guide({
        utensils: ["Grande casserole ou cocotte", "Casserole avec couvercle pour le riz", "Cuillère de bois", ...(protein.rawAnimal ? ["Thermomètre numérique"] : [])],
        prep: [protein.prep, "Hachez l'oignon, l'ail et râpez le gingembre avant d'allumer le feu."],
        techniques: ["Faire revenir les épices 1 minute dans l'huile pour libérer leurs arômes.", "Mijoter à feu moyen-doux."],
        doneness: [protein.doneness],
        meat: protein.rawAnimal,
      }),
      illustration: "cocotte",
    },
    [
      { text: "Rincez le riz basmati et cuisez-le dans 600 ml d'eau salée, à couvert et à feu doux, 12 minutes. Laissez reposer 5 minutes.", items: [ing("riz-basmati", 300, "g")], minutes: 17, timers: [timer("Riz basmati", 12), timer("Repos du riz", 5)] },
      { text: base.text, items: base.items, minutes: 14, timers: [timer("Base du cari", 8)] },
      { text: `Ajoutez les légumes (${veg.label}) et laissez mijoter 10 minutes, à couvert.`, items: veg.items, minutes: 10, timers: [timer("Légumes", 10)] },
      cookingStep(c, protein.items),
      { text: `Hors du feu, ajoutez ${base.finishLabel}. Goûtez, rectifiez le sel et servez sur le riz.`, items: base.finish },
    ],
  );
}

/* ------------------------------------------------------------------ */
/* Chilis                                                              */
/* ------------------------------------------------------------------ */

const CHILI_STYLES: Array<{ key: string; label: string; items: RecipeIngredient[] }> = [
  { key: "classique", label: "classique", items: [ing("poivron-rouge", 2, "unite", { note: "en dés" })] },
  { key: "patate-douce", label: "à la patate douce", items: [ing("patate-douce", 2, "unite", { note: "en cubes de 1,5 cm" })] },
  { key: "mais-courgette", label: "au maïs et à la courgette", items: [ing("mais", 200, "g"), ing("courgette", 1, "unite", { note: "en dés" })] },
];

const CHILI_TOPS: Array<{ key: string; label: string; items: RecipeIngredient[] }> = [
  { key: "cheddar", label: "cheddar et yogourt", items: [ing("cheddar", 80, "g"), ing("yogourt-grec", 100, "g")] },
  { key: "avocat", label: "avocat, coriandre et lime", items: [ing("avocat", 1, "unite", { note: "en dés" }), ing("coriandre", 10, "g"), ing("lime", 1, "unite", { note: "en quartiers" })] },
];

const CHILI_PROTEINS = ["boeuf-hache", "dinde", "lentilles", "haricots-blancs"];

function chili(style: (typeof CHILI_STYLES)[number], protein: Protein, top: (typeof CHILI_TOPS)[number]): Recipe {
  const meat = Boolean(protein.pan && protein.rawAnimal);
  const steps: DraftStep[] = [];
  if (meat) steps.push({ ...cookingStep(protein.pan!, protein.items), text: protein.pan!.text.replace("une grande poêle", "une grande casserole") });
  steps.push({
    text: `${meat ? "Dans la même casserole" : "Dans une grande casserole, chauffez l'huile à feu moyen et"} faites revenir l'oignon et l'ail 5 minutes. Ajoutez l'assaisonnement au chili, le cumin et le paprika 1 minute.`,
    items: [...(meat ? [] : [ing("huile-vegetale", 1, "c-soupe")]), ing("oignon", 1, "unite", { note: "haché" }), ing("ail", 3, "unite", { note: "hachées" }), ing("assaisonnement-chili", 1, "c-soupe"), ing("cumin", 2, "c-the"), ing("paprika-fume", 1, "c-the")],
    minutes: 6,
  });
  steps.push({
    text: `Ajoutez les tomates, les haricots noirs, les légumes (${style.label.replace(/^(à la |au |aux )/, "")})${meat ? "" : ` et ${protein.the}`} avec 250 ml d'eau et le sel. Laissez mijoter 25 minutes à feu doux, en remuant de temps en temps.`,
    items: [ing("tomates-broyees", 796, "ml"), ing("haricots-noirs", 400, "g", { note: "rincés" }), ...style.items, ...(meat ? [] : protein.items), ing("sel", 1, "c-the")],
    minutes: 25,
    timers: [timer("Chili", 25)],
    tip: "Un chili gagne en goût en mijotant : 10 minutes de plus ne lui font que du bien.",
  });
  steps.push({ text: `Servez bien chaud, garni de ${top.label}.`, items: top.items });
  return make(
    {
      id: slug("chili", style.key, protein.key, top.key),
      family: "chili",
      name: `Chili ${style.label} ${plainWith(protein)}, ${top.label}`,
      description: `Un chili ${style.label} généreux ${plainWith(protein)} et aux haricots noirs, garni de ${top.label}. Le réconfort d'un soir d'hiver.`,
      cuisine: "Mexicaine",
      mealTypes: SOUPER,
      prepMinutes: 15,
      cookMinutes: roundTo5((meat ? 8 : 0) + 31),
      difficulty: "facile",
      tags: ["familial", "prep-avance"],
      tips: ["À la mijoteuse : après l'étape des épices, transférez tout et cuisez 6 h à basse intensité.", "Se congèle en portions jusqu'à 3 mois."],
      substitutions: subs(protein.substitution, { from: "Haricots noirs", to: "Haricots rouges" }),
      firstTime: guide({
        utensils: ["Grande casserole à fond épais", "Cuillère de bois", "Louche", ...(protein.rawAnimal ? ["Thermomètre numérique"] : [])],
        prep: [protein.prep, "Rincez les haricots en conserve pour retirer l'excès de sel."],
        techniques: ["Faire revenir les épices sèches dans le gras pour développer leur saveur.", "Mijoter à couvert partiellement."],
        doneness: [protein.doneness],
        meat: protein.rawAnimal,
      }),
      illustration: "cocotte",
    },
    steps,
  );
}

/* ------------------------------------------------------------------ */
/* Burgers maison                                                      */
/* ------------------------------------------------------------------ */

const BURGER_PATTIES: Array<{ key: string; label: string; items: RecipeIngredient[]; text: string; minutes: number; doneness: string; meat: boolean }> = [
  { key: "boeuf", label: "de bœuf", items: [ing("boeuf-hache", 500, "g"), ing("sel", 0.5, "c-the")], text: "Façonnez 4 galettes de bœuf haché de 2 cm d'épaisseur, en creusant légèrement le centre avec le pouce. Salez. Cuisez-les 4 à 5 minutes par côté dans l'huile chaude, jusqu'à 71 °C à cœur.", minutes: 10, doneness: "Bœuf haché : 71 °C à cœur, sans trace rosée.", meat: true },
  { key: "dinde", label: "de dinde", items: [ing("dinde-hachee", 500, "g"), ing("panko", 30, "g"), ing("sel", 0.5, "c-the")], text: "Mélangez la dinde, la chapelure et le sel, puis façonnez 4 galettes. Cuisez-les 5 à 6 minutes par côté dans l'huile chaude, jusqu'à 74 °C à cœur.", minutes: 12, doneness: "Dinde hachée : 74 °C à cœur.", meat: true },
  { key: "poulet", label: "au poulet grillé", items: [ing("poitrine-poulet", 500, "g", { note: "en 4 escalopes" }), ing("paprika-fume", 1, "c-the"), ing("sel", 0.5, "c-the")], text: "Assaisonnez les escalopes de poulet de paprika et de sel. Cuisez-les 5 minutes par côté dans l'huile chaude, jusqu'à 74 °C à cœur.", minutes: 10, doneness: "Poulet : 74 °C à cœur.", meat: true },
  { key: "saumon", label: "au saumon", items: [ing("saumon", 450, "g", { note: "sans peau, haché au couteau" }), ing("panko", 40, "g"), ing("oeuf", 1, "unite"), ing("citron", 0.5, "unite", { note: "zeste" }), ing("sel", 0.5, "c-the")], text: "Mélangez le saumon haché, la chapelure, l'œuf, le zeste de citron et le sel. Façonnez 4 galettes et cuisez-les 4 minutes par côté dans l'huile chaude, jusqu'à 70 °C.", minutes: 8, doneness: "Saumon : 70 °C, chair opaque.", meat: true },
  { key: "pois-chiches", label: "végé aux pois chiches", items: [ing("pois-chiches", 500, "g", { note: "rincés et écrasés" }), ing("panko", 50, "g"), ing("oeuf", 1, "unite"), ing("cumin", 1, "c-the"), ing("sel", 0.5, "c-the")], text: "Écrasez les pois chiches à la fourchette, puis mélangez avec la chapelure, l'œuf, le cumin et le sel. Façonnez 4 galettes et dorez-les 4 minutes par côté dans l'huile chaude.", minutes: 8, doneness: "Galettes dorées et chaudes au centre.", meat: false },
];

const BURGER_STYLES: Array<{ key: string; label: string; cuisine: string; items: RecipeIngredient[]; text: string }> = [
  { key: "classique", label: "classique", cuisine: "Nord-américaine", items: [ing("laitue-romaine", 60, "g"), ing("tomate", 1, "unite", { note: "tranchée" }), ing("oignon-rouge", 0.5, "unite", { note: "en rondelles" }), ing("cheddar", 60, "g"), ing("moutarde-dijon", 4, "c-the")], text: "laitue, tomate, oignon rouge, cheddar et moutarde" },
  { key: "grec", label: "à la grecque", cuisine: "Grecque", items: [ing("yogourt-grec", 100, "g"), ing("concombre", 0.5, "unite", { note: "râpé et essoré" }), ing("ail", 1, "unite", { note: "râpée" }), ing("feta", 60, "g"), ing("tomate", 1, "unite", { note: "tranchée" })], text: "tzatziki maison (yogourt, concombre, ail), feta et tomate" },
  { key: "mexicain", label: "à la mexicaine", cuisine: "Mexicaine", items: [ing("avocat", 1, "unite", { note: "écrasé" }), ing("salsa", 80, "ml"), ing("laitue-romaine", 60, "g"), ing("lime", 0.5, "unite", { note: "jus" })], text: "avocat écrasé à la lime, salsa et laitue" },
  { key: "asiatique", label: "à l'asiatique", cuisine: "Japonaise", items: [ing("chou-rouge", 80, "g", { note: "émincé" }), ing("yogourt-grec", 80, "g"), ing("sauce-soja", 1, "c-soupe"), ing("sirop-erable", 1, "c-the"), ing("concombre", 0.5, "unite", { note: "en fines tranches" })], text: "chou rouge, concombre et sauce soja-érable crémeuse" },
];

const BURGER_SIDES: Array<{ key: string; label: string; items: RecipeIngredient[]; text: string; minutes: number; oven: boolean }> = [
  { key: "frites-patate", label: "frites de patate douce au four", items: [ing("patate-douce", 2, "unite", { note: "en bâtonnets" }), ing("huile-olive", 1, "c-soupe"), ing("paprika-fume", 1, "c-the")], text: "Préchauffez le four à 220 °C. Mélangez les bâtonnets de patate douce avec l'huile, le paprika et une pincée de sel, étalez-les sur une plaque et cuisez 25 minutes en les retournant à mi-cuisson.", minutes: 25, oven: true },
  { key: "salade", label: "salade de roquette", items: [ing("roquette", 100, "g"), ing("huile-olive", 1, "c-soupe"), ing("citron", 0.5, "unite", { note: "jus" })], text: "Mélangez la roquette avec l'huile d'olive, le jus de citron et une pincée de sel.", minutes: 3, oven: false },
];

function burger(patty: (typeof BURGER_PATTIES)[number], style: (typeof BURGER_STYLES)[number], side: (typeof BURGER_SIDES)[number]): Recipe {
  return make(
    {
      id: slug("burger", patty.key, style.key, side.key),
      family: "burger",
      name: `Burger ${patty.label} ${style.label}, ${side.label}`,
      description: `Un burger maison ${patty.label}, garni de ${style.text}, avec ${side.label}. Bien meilleur qu'au resto, et vous savez ce qu'il y a dedans.`,
      cuisine: style.cuisine,
      mealTypes: SOUPER,
      prepMinutes: 20,
      cookMinutes: roundTo5(Math.max(side.minutes, patty.minutes + 2)),
      difficulty: patty.key === "saumon" ? "moyen" : "facile",
      equipment: side.oven ? ["four"] : [],
      tags: ["familial"],
      tips: ["Creusez légèrement le centre des galettes : elles restent plates en cuisant.", "Faites griller les pains côté mie 1 minute dans la poêle chaude."],
      substitutions: [{ from: "Pain à hamburger", to: "Pain sans gluten ou feuilles de laitue", note: "Version sans gluten." }],
      firstTime: guide({
        utensils: ["Grande poêle", "Spatule large", "Grand bol", ...(side.oven ? ["Plaque de cuisson"] : []), ...(patty.meat ? ["Thermomètre numérique"] : [])],
        prep: ["Préparez toutes les garnitures avant de cuire les galettes.", "Façonnez les galettes avec les mains légèrement humides."],
        techniques: ["Ne pressez jamais les galettes avec la spatule : elles perdraient leur jus."],
        doneness: [patty.doneness],
        meat: patty.meat,
      }),
      illustration: "burger",
    },
    [
      { text: side.text, items: side.items, minutes: side.minutes, timers: [timer(capitalize(side.label), side.minutes)] },
      { text: `Préparez la garniture : ${style.text}.`, items: style.items, minutes: 8 },
      { text: patty.text, items: [...patty.items, ing("huile-vegetale", 1, "c-soupe")], minutes: patty.minutes, timers: [timer("Galettes — côté 1", Math.round(patty.minutes / 2)), timer("Galettes — côté 2", Math.round(patty.minutes / 2))] },
      { text: "Faites griller les pains 1 minute dans la poêle, puis montez les burgers avec la garniture. Servez avec l'accompagnement.", items: [ing("pain-burger", 4, "unite")], minutes: 2 },
    ],
  );
}

/* ------------------------------------------------------------------ */
/* Gratins de pâtes                                                    */
/* ------------------------------------------------------------------ */

const GRATIN_SAUCES: Array<{ key: string; label: string; items: RecipeIngredient[]; text: string; cheese: RecipeIngredient }> = [
  { key: "tomate-mozza", label: "tomate et mozzarella", items: [ing("passata", 700, "ml"), ing("origan", 1, "c-the"), ing("ail", 2, "unite", { note: "râpées" }), ing("sel", 0.5, "c-the")], text: "Mélangez le coulis de tomates, l'origan, l'ail et le sel.", cheese: ing("mozzarella", 150, "g") },
  { key: "cheddar", label: "crémeux au cheddar", items: [ing("lait", 500, "ml"), ing("fecule-mais", 1.5, "c-soupe"), ing("sel", 0.5, "c-the")], text: "Dans une casserole, fouettez le lait froid avec la fécule et le sel, puis portez à frémissement en fouettant 3 minutes jusqu'à ce que la sauce épaississe.", cheese: ing("cheddar", 150, "g") },
  { key: "rosee", label: "rosé", items: [ing("passata", 500, "ml"), ing("yogourt-grec", 150, "g"), ing("ail", 2, "unite", { note: "râpées" }), ing("sel", 0.5, "c-the")], text: "Mélangez le coulis de tomates, le yogourt grec, l'ail et le sel.", cheese: ing("mozzarella", 120, "g") },
];

const GRATIN_PROTEINS = ["poulet", "dinde", "boeuf-hache", "lentilles", "thon", "aucune"];
const GRATIN_VEGS: Array<{ key: string; label: string; items: RecipeIngredient[] }> = [
  { key: "brocoli", label: "brocoli", items: [ing("brocoli", 300, "g", { note: "en petits fleurons" })] },
  { key: "epinards-champignons", label: "épinards et champignons", items: [ing("epinards", 120, "g"), ing("champignons", 200, "g", { note: "tranchés" })] },
];

function gratin(sauce: (typeof GRATIN_SAUCES)[number], proteinKey: string, veg: (typeof GRATIN_VEGS)[number]): Recipe {
  const protein = proteinKey === "aucune" ? null : proteinByKey(proteinKey);
  const pc = protein ? protein.pan ?? protein.ready! : null;
  const steps: DraftStep[] = [
    { text: "Préchauffez le four à 200 °C. Cuisez les penne 2 minutes de moins que le temps indiqué sur l'emballage, en ajoutant les légumes la dernière minute. Égouttez.", items: [ing("penne", 350, "g"), ing("sel", 1, "c-soupe"), ...veg.items], minutes: 9, timers: [timer("Pâtes", 8)] },
    { text: sauce.text, items: sauce.items, minutes: sauce.key === "cheddar" ? 4 : 2, timers: sauce.key === "cheddar" ? [timer("Sauce", 3)] : undefined },
  ];
  if (protein && pc) steps.push(cookingStep(pc, protein.items));
  steps.push({
    text: `Dans un plat allant au four, mélangez les pâtes, les légumes, la sauce${protein ? ` et ${protein.the}` : ""}. Couvrez de fromage et enfournez 20 minutes, jusqu'à ce que le dessus soit doré et bouillonnant.`,
    items: [sauce.cheese],
    minutes: 20,
    timers: [timer("Gratin au four", 20)],
  });
  return make(
    {
      id: slug("gratin", sauce.key, proteinKey, veg.key),
      family: "gratin",
      name: `Gratin de penne ${sauce.label}${protein ? ` ${plainWith(protein)}` : ""}, ${veg.label}`,
      description: `Un gratin de pâtes doré et fondant, ${sauce.label}, avec ${veg.label}${protein ? ` et ${strip(protein)}` : ""}. Le plat qui met tout le monde d'accord.`,
      cuisine: "Italienne",
      mealTypes: SOUPER,
      prepMinutes: 15,
      cookMinutes: 35,
      difficulty: "facile",
      equipment: ["four"],
      tags: ["familial", "prep-avance"],
      tips: ["Se prépare la veille : couvrez et réfrigérez, puis ajoutez 10 minutes de cuisson."],
      substitutions: subs({ from: "Penne", to: "Pâtes sans gluten", note: "Version sans gluten." }, protein?.substitution),
      firstTime: guide({
        utensils: ["Grande casserole", "Passoire", "Plat de cuisson (23 × 33 cm)", ...(protein?.rawAnimal ? ["Thermomètre numérique"] : [])],
        prep: [protein?.prep ?? "", "Râpez le fromage si vous l'achetez en bloc."],
        techniques: ["Précuire les pâtes : elles finissent de cuire au four dans la sauce."],
        doneness: [protein?.doneness ?? "Dessus doré, sauce qui bouillonne sur les bords."],
        meat: Boolean(protein?.rawAnimal),
      }),
      illustration: "gratin",
    },
    steps,
  );
}

/* ------------------------------------------------------------------ */
/* Riz frits                                                           */
/* ------------------------------------------------------------------ */

const FRIED_RICE: Array<{ key: string; label: string; cuisine: string; items: RecipeIngredient[]; finish: RecipeIngredient[]; finishLabel: string }> = [
  { key: "cantonais", label: "cantonais", cuisine: "Chinoise", items: [ing("petits-pois", 150, "g"), ing("carotte", 2, "unite", { note: "en petits dés" })], finish: [ing("oignon-vert", 3, "unite", { note: "émincés" })], finishLabel: "oignon vert" },
  { key: "ananas", label: "à l'ananas", cuisine: "Thaïlandaise", items: [ing("ananas", 200, "g"), ing("poivron-rouge", 1, "unite", { note: "en dés" })], finish: [ing("coriandre", 10, "g"), ing("lime", 1, "unite", { note: "en quartiers" })], finishLabel: "coriandre et lime" },
  { key: "nasi-goreng", label: "nasi goreng", cuisine: "Indonésienne", items: [ing("chou-rouge", 150, "g", { note: "émincé" }), ing("piment-broye", 0.5, "c-the"), ing("sirop-erable", 1, "c-soupe")], finish: [ing("concombre", 1, "unite", { note: "en bâtonnets" }), ing("oignon-vert", 2, "unite", { note: "émincés" })], finishLabel: "concombre et oignon vert" },
];

const FRIED_PROTEINS = ["poulet", "crevettes", "porc", "tofu", "boeuf", "aucune"];

function friedRice(style: (typeof FRIED_RICE)[number], proteinKey: string): Recipe {
  const protein = proteinKey === "aucune" ? null : proteinByKey(proteinKey);
  const steps: DraftStep[] = [
    { text: "Idéalement la veille : cuisez le riz jasmin dans 450 ml d'eau, à couvert, 12 minutes, puis étalez-le sur une plaque et réfrigérez-le. Un riz froid et sec ne colle pas.", items: [ing("riz-jasmin", 300, "g")], minutes: 17, timers: [timer("Riz jasmin", 12)] },
  ];
  if (protein) steps.push({ ...cookingStep(protein.pan!, protein.items), text: protein.pan!.text.replace("une grande poêle", "un wok") + " Réservez." });
  steps.push(
    { text: "Dans le wok, brouillez les œufs battus 1 minute dans un peu d'huile, puis réservez-les.", items: [ing("oeuf", 3, "unite"), ing("huile-vegetale", 1, "c-soupe")], minutes: 2 },
    { text: `Chauffez le reste de l'huile à feu vif, sautez l'ail et les légumes 3 minutes, puis ajoutez le riz froid et la sauce soja. Sautez 4 minutes en séparant les grains.`, items: [ing("huile-vegetale", 2, "c-soupe"), ing("ail", 2, "unite", { note: "hachées" }), ...style.items, ing("sauce-soja", 3, "c-soupe")], minutes: 7, timers: [timer("Riz sauté", 4)] },
    { text: `Remettez les œufs${protein ? ` et ${protein.the}` : ""} dans le wok, mélangez 1 minute et servez avec ${style.finishLabel}.`, items: style.finish },
  );
  return make(
    {
      id: slug("riz-frit", style.key, proteinKey),
      family: "riz-frit",
      name: `Riz frit ${style.label} ${protein ? plainWith(protein) : "aux œufs"}`,
      description: `Le riz frit ${style.label} maison, ${protein ? strip(protein) + ", " : ""}œufs et légumes croquants : la meilleure façon d'utiliser un reste de riz.`,
      cuisine: style.cuisine,
      mealTypes: SOUPER,
      prepMinutes: 15,
      cookMinutes: roundTo5(10 + (protein?.pan?.minutes ?? 0)),
      difficulty: maxDifficulty("facile", protein?.difficulty ?? "facile"),
      tags: ["rapide", "familial"],
      tips: ["Le secret : du riz cuit la veille, bien froid et sec.", "Un wok très chaud donne le petit goût grillé des restaurants."],
      substitutions: subs({ from: "Sauce soja", to: "Tamari sans gluten", note: "Version sans gluten." }, protein?.substitution),
      firstTime: guide({
        utensils: ["Wok ou grande poêle", "Spatule", "Plaque pour refroidir le riz", ...(protein?.rawAnimal ? ["Thermomètre numérique"] : [])],
        prep: ["Cuisez et refroidissez le riz à l'avance.", "Coupez tous les légumes en petits dés de même taille."],
        techniques: ["Sauter à feu vif en remuant sans arrêt."],
        doneness: [protein?.doneness ?? "Œufs bien pris (71 °C)."],
        meat: true,
      }),
      illustration: "bol",
    },
    steps,
  );
}

/* ------------------------------------------------------------------ */
/* Brochettes au four                                                  */
/* ------------------------------------------------------------------ */

const SKEWER_MARINADES: Array<{ key: string; label: string; cuisine: string; items: RecipeIngredient[]; text: string }> = [
  { key: "souvlaki", label: "façon souvlaki", cuisine: "Grecque", items: [ing("huile-olive", 3, "c-soupe"), ing("citron", 1, "unite", { note: "jus" }), ing("origan", 2, "c-the"), ing("ail", 2, "unite", { note: "râpées" }), ing("sel", 1, "c-the")], text: "Mélangez l'huile d'olive, le jus de citron, l'origan, l'ail et le sel." },
  { key: "yakitori", label: "façon yakitori", cuisine: "Japonaise", items: [ing("sauce-soja", 4, "c-soupe"), ing("sirop-erable", 2, "c-soupe"), ing("gingembre", 10, "g", { note: "râpé" }), ing("ail", 1, "unite", { note: "râpée" }), ing("huile-vegetale", 1, "c-soupe")], text: "Mélangez la sauce soja, le sirop d'érable, le gingembre, l'ail et l'huile." },
  { key: "tandoori", label: "tandoori", cuisine: "Indienne", items: [ing("yogourt-grec", 150, "g"), ing("garam-masala", 2, "c-the"), ing("paprika-fume", 1, "c-the"), ing("curcuma", 0.5, "c-the"), ing("citron", 0.5, "unite", { note: "jus" }), ing("sel", 1, "c-the")], text: "Mélangez le yogourt, le garam masala, le paprika, le curcuma, le jus de citron et le sel." },
  { key: "chimichurri", label: "au chimichurri", cuisine: "Argentine", items: [ing("persil", 25, "g", { note: "haché finement" }), ing("huile-olive", 4, "c-soupe"), ing("citron", 1, "unite", { note: "jus" }), ing("ail", 2, "unite", { note: "hachées" }), ing("origan", 1, "c-the"), ing("sel", 1, "c-the")], text: "Mélangez le persil, l'huile d'olive, le jus de citron, l'ail, l'origan et le sel : c'est le chimichurri." },
];

const SKEWER_TIMES: Record<string, number> = { poulet: 15, porc: 15, boeuf: 10, crevettes: 8, saumon: 10, tofu: 15 };
const SKEWER_SIDES: Array<{ key: string; label: string; items: RecipeIngredient[]; text: string; minutes: number }> = [
  { key: "riz", label: "riz basmati", items: [ing("riz-basmati", 300, "g")], text: "Rincez le riz basmati et cuisez-le dans 600 ml d'eau salée, à couvert, 12 minutes. Laissez reposer 5 minutes.", minutes: 17 },
  { key: "salade-grecque", label: "salade de tomates et concombre", items: [ing("tomate", 3, "unite", { note: "en quartiers" }), ing("concombre", 1, "unite", { note: "en dés" }), ing("feta", 80, "g"), ing("huile-olive", 1, "c-soupe")], text: "Mélangez les tomates, le concombre, la feta émiettée et l'huile d'olive. Salez légèrement.", minutes: 8 },
];

function skewers(marinade: (typeof SKEWER_MARINADES)[number], proteinKey: string, side: (typeof SKEWER_SIDES)[number]): Recipe {
  const protein = proteinByKey(proteinKey);
  const minutes = SKEWER_TIMES[proteinKey];
  const pieces = protein.items.filter((i) => i.ingredientId !== "fecule-mais" && i.ingredientId !== "paprika-fume");
  return make(
    {
      id: slug("brochettes", marinade.key, proteinKey, side.key),
      family: "brochettes",
      name: `Brochettes ${protein.of} ${marinade.label}, ${side.label}`,
      description: `Des brochettes ${protein.of} marinées ${marinade.label}, avec poivron, courgette et oignon rouge, grillées au four. Servies avec ${side.label}.`,
      cuisine: marinade.cuisine,
      mealTypes: SOUPER,
      prepMinutes: 25,
      cookMinutes: roundTo5(Math.max(side.minutes, minutes + 5)),
      difficulty: "facile",
      equipment: ["four"],
      tags: ["familial"],
      tips: ["Trempez les brochettes en bois 30 minutes dans l'eau : elles ne brûleront pas.", "Au BBQ l'été : même temps de cuisson, à feu moyen-vif, en les retournant souvent."],
      substitutions: subs(protein.substitution),
      firstTime: guide({
        utensils: ["8 brochettes (bois trempé ou métal)", "Plaque de cuisson et papier parchemin", "Grand bol", ...(protein.rawAnimal ? ["Thermomètre numérique"] : [])],
        prep: [protein.prep, "Coupez la protéine et les légumes en cubes de 3 cm, de taille égale."],
        techniques: ["Mariner au réfrigérateur au moins 15 minutes.", "Alterner protéine et légumes sur les brochettes."],
        doneness: [protein.doneness],
        meat: protein.rawAnimal,
      }),
      illustration: "brochettes",
    },
    [
      { text: `${marinade.text} Coupez la protéine en cubes de 3 cm, enrobez-la de marinade et réfrigérez au moins 15 minutes.`, items: [...marinade.items, ...pieces], minutes: 15, timers: [timer("Marinade", 15)], faq: [{ question: "Puis-je réutiliser la marinade ?", answer: "Pas telle quelle : une marinade qui a touché de la viande ou du poisson cru doit bouillir au moins 1 minute avant d'être servie en sauce." }] },
      { text: side.text, items: side.items, minutes: side.minutes, timers: side.key === "riz" ? [timer("Riz basmati", 12)] : undefined },
      { text: "Préchauffez le four à 230 °C (position gril). Enfilez la protéine en alternant avec le poivron, la courgette et l'oignon rouge coupés en morceaux.", items: [ing("poivron-rouge", 2, "unite"), ing("courgette", 1, "unite"), ing("oignon-rouge", 1, "unite")], minutes: 10 },
      { text: `Déposez les brochettes sur une plaque tapissée de papier parchemin et cuisez ${minutes} minutes en les retournant à mi-cuisson. Vérifiez la cuisson au thermomètre.`, minutes, timers: [timer("Brochettes — 1re face", Math.ceil(minutes / 2)), timer("Brochettes — 2e face", Math.floor(minutes / 2))] },
    ],
  );
}

/* ------------------------------------------------------------------ */
/* Mijotés                                                             */
/* ------------------------------------------------------------------ */

const STEW_STYLES: Array<{ key: string; label: string; cuisine: string; items: RecipeIngredient[]; finish: RecipeIngredient[] }> = [
  { key: "quebecois", label: "à la québécoise", cuisine: "Québécoise", items: [ing("pomme-de-terre", 500, "g", { note: "en morceaux" }), ing("carotte", 3, "unite", { note: "en tronçons" }), ing("celeri", 2, "unite", { note: "en tronçons" }), ing("pate-tomate", 2, "c-soupe"), ing("herbes-provence", 1, "c-the")], finish: [ing("persil", 10, "g")] },
  { key: "provencal", label: "à la provençale", cuisine: "Française", items: [ing("tomates-des", 796, "ml"), ing("courgette", 1, "unite", { note: "en dés" }), ing("olives-kalamata", 60, "g"), ing("herbes-provence", 2, "c-the")], finish: [ing("basilic", 10, "g")] },
  { key: "marocain", label: "à la marocaine", cuisine: "Marocaine", items: [ing("carotte", 3, "unite", { note: "en rondelles" }), ing("abricots-secs", 80, "g"), ing("cumin", 1, "c-the"), ing("cannelle", 0.5, "c-the"), ing("curcuma", 0.5, "c-the")], finish: [ing("coriandre", 10, "g"), ing("citron", 0.5, "unite", { note: "jus" })] },
];

const STEW_PROTEINS: Array<{ key: string; label: string; items: RecipeIngredient[]; brown: boolean; minutes: number; doneness: string; meat: boolean }> = [
  { key: "poulet", label: "de poulet", items: [ing("cuisse-poulet", 700, "g", { note: "en gros morceaux" })], brown: true, minutes: 30, doneness: "Poulet : 74 °C, la viande se défait à la fourchette.", meat: true },
  { key: "boeuf", label: "de bœuf", items: [ing("boeuf-surlonge", 700, "g", { note: "en cubes de 3 cm" })], brown: true, minutes: 75, doneness: "Bœuf : tendre à la fourchette après le mijotage (bien au-delà de 71 °C).", meat: true },
  { key: "lentilles", label: "de lentilles", items: [ing("lentilles-conserve", 540, "g", { note: "rincées" })], brown: false, minutes: 20, doneness: "Légumineuses tendres et sauce nappante.", meat: false },
  { key: "pois-chiches", label: "de pois chiches", items: [ing("pois-chiches", 540, "g", { note: "rincés" })], brown: false, minutes: 20, doneness: "Légumineuses tendres et sauce nappante.", meat: false },
];

function stew(style: (typeof STEW_STYLES)[number], p: (typeof STEW_PROTEINS)[number]): Recipe {
  const steps: DraftStep[] = [];
  if (p.brown) steps.push({ text: "Salez la viande. Dans une cocotte, chauffez l'huile à feu moyen-vif et dorez-la en 2 fournées, 3 minutes par côté. Réservez.", items: [...p.items, ing("huile-vegetale", 2, "c-soupe"), ing("sel", 1, "c-the")], minutes: 12, timers: [timer("Fournée 1", 6), timer("Fournée 2", 6)] });
  steps.push({ text: `${p.brown ? "Dans la même cocotte" : "Dans une cocotte, chauffez l'huile et"} faites revenir l'oignon et l'ail 5 minutes.`, items: [...(p.brown ? [] : [ing("huile-vegetale", 2, "c-soupe"), ing("sel", 1, "c-the")]), ing("oignon", 1, "unite", { note: "émincé" }), ing("ail", 3, "unite", { note: "hachées" })], minutes: 5 });
  steps.push({
    text: `Ajoutez les légumes et les assaisonnements, ${p.brown ? "remettez la viande" : `ajoutez ${p.label.replace("de ", "les ")}`}, puis versez le bouillon. Couvrez et laissez mijoter ${p.minutes} minutes à feu doux.`,
    items: [...style.items, ...(p.brown ? [] : p.items), ing(p.meat ? "bouillon-poulet" : "bouillon-legumes", 500, "ml")],
    minutes: p.minutes,
    timers: [timer("Mijotage", p.minutes)],
    tip: "Le mijoté est prêt quand la sauce a réduit et que les légumes sont fondants.",
  });
  steps.push({ text: "Goûtez, rectifiez l'assaisonnement et servez bien chaud, garni d'herbes fraîches.", items: style.finish });
  return make(
    {
      id: slug("mijote", style.key, p.key),
      family: "mijote",
      name: `Mijoté ${p.label} ${style.label}`,
      description: `Un mijoté ${p.label} ${style.label}, cuit lentement jusqu'à ce que tout soit fondant. Encore meilleur réchauffé le lendemain.`,
      cuisine: style.cuisine,
      mealTypes: ["souper"],
      prepMinutes: 20,
      cookMinutes: roundTo5((p.brown ? 12 : 0) + 5 + p.minutes),
      difficulty: "facile",
      tags: ["familial", "prep-avance"],
      tips: ["À la mijoteuse : après l'étape de l'oignon, transférez tout et cuisez 6 à 8 h à basse intensité.", "Se congèle très bien jusqu'à 3 mois."],
      substitutions: [{ from: "Bouillon", to: "Bouillon maison ou eau + 1 c. à thé de sel" }],
      firstTime: guide({
        utensils: ["Cocotte en fonte ou grande casserole à fond épais avec couvercle", "Pince", ...(p.meat ? ["Thermomètre numérique"] : [])],
        prep: ["Coupez les légumes en gros morceaux : ils doivent tenir à la cuisson."],
        techniques: ["Dorer la viande avant de mijoter pour développer le goût.", "Mijoter à couvert, à petits frémissements."],
        doneness: [p.doneness],
        meat: p.meat,
      }),
      illustration: "cocotte",
    },
    steps,
  );
}

/* ------------------------------------------------------------------ */
/* Papillotes                                                          */
/* ------------------------------------------------------------------ */

const PAPILLOTE_FISH: Array<{ key: string; label: string; item: RecipeIngredient; minutes: number; doneness: string }> = [
  { key: "saumon", label: "de saumon", item: ing("saumon", 600, "g", { note: "4 pavés" }), minutes: 15, doneness: "Saumon : 70 °C, chair opaque qui se défait à la fourchette." },
  { key: "morue", label: "de morue", item: ing("morue", 600, "g", { note: "4 morceaux" }), minutes: 14, doneness: "Morue : 70 °C, chair blanche opaque en flocons." },
  { key: "crevettes", label: "de crevettes", item: ing("crevettes", 450, "g"), minutes: 12, doneness: "Crevettes : roses et opaques, 74 °C." },
];

const PAPILLOTE_AROMAS: Array<{ key: string; label: string; cuisine: string; items: RecipeIngredient[] }> = [
  { key: "citron-herbes", label: "citron et fines herbes", cuisine: "Française", items: [ing("citron", 1, "unite", { note: "en fines rondelles" }), ing("persil", 10, "g"), ing("huile-olive", 2, "c-soupe"), ing("sel", 0.5, "c-the")] },
  { key: "gingembre-soja", label: "gingembre et soja", cuisine: "Japonaise", items: [ing("gingembre", 15, "g", { note: "en julienne" }), ing("sauce-soja", 2, "c-soupe"), ing("huile-sesame", 1, "c-soupe"), ing("oignon-vert", 2, "unite", { note: "émincés" })] },
  { key: "tomate-olives", label: "tomates et olives", cuisine: "Méditerranéenne", items: [ing("tomate-cerise", 250, "g", { note: "coupées en deux" }), ing("olives-kalamata", 50, "g"), ing("origan", 1, "c-the"), ing("huile-olive", 2, "c-soupe"), ing("sel", 0.5, "c-the")] },
];

const PAPILLOTE_VEGS: Array<{ key: string; label: string; items: RecipeIngredient[] }> = [
  { key: "courgette", label: "courgette", items: [ing("courgette", 2, "unite", { note: "en fines rondelles" })] },
  { key: "asperges", label: "asperges", items: [ing("asperges", 300, "g", { note: "parées" })] },
  { key: "haricots-verts", label: "haricots verts", items: [ing("haricots-verts", 300, "g", { note: "parés" })] },
];

function papillote(fish: (typeof PAPILLOTE_FISH)[number], aroma: (typeof PAPILLOTE_AROMAS)[number], veg: (typeof PAPILLOTE_VEGS)[number]): Recipe {
  return make(
    {
      id: slug("papillote", fish.key, aroma.key, veg.key),
      family: "papillote",
      name: `Papillotes ${fish.label}, ${aroma.label}, ${veg.label}`,
      description: `Des papillotes ${fish.label} cuites à la vapeur dans leur propre jus, parfumées ${aroma.label === "gingembre et soja" ? "au gingembre et au soja" : `aux saveurs ${aroma.label}`}, avec ${veg.label}. Léger, rapide et sans vaisselle.`,
      cuisine: aroma.cuisine,
      mealTypes: SOUPER,
      prepMinutes: 15,
      cookMinutes: fish.minutes,
      difficulty: "facile",
      equipment: ["four"],
      tags: ["rapide"],
      tips: ["Ouvrez les papillotes à table : le nuage de vapeur parfumée fait toujours son effet.", "Ouvrez-les côté opposé à vous pour éviter la vapeur brûlante."],
      substitutions: [{ from: fish.label.replace("de ", ""), to: "Tofu ferme en tranches", note: "Version végétalienne, 20 minutes de cuisson." }],
      firstTime: guide({
        utensils: ["Papier parchemin", "Plaque de cuisson", "Ciseaux", "Thermomètre numérique"],
        prep: ["Découpez 4 grands carrés de papier parchemin (35 cm).", "Épongez le poisson."],
        techniques: ["Fermer une papillote : rabattre le papier et plier les bords en petits plis serrés."],
        doneness: [fish.doneness],
        meat: true,
      }),
      illustration: "papillote",
    },
    [
      { text: "Préchauffez le four à 200 °C. Répartissez les légumes au centre de 4 carrés de papier parchemin.", items: veg.items, minutes: 10 },
      { text: `Déposez le poisson sur les légumes, puis ajoutez les aromates (${aroma.label}).`, items: [fish.item, ...aroma.items] },
      { text: `Refermez chaque papillote hermétiquement en pliant les bords. Enfournez ${fish.minutes} minutes.`, minutes: fish.minutes, timers: [timer("Papillotes au four", fish.minutes)], faq: [{ question: "Comment vérifier la cuisson sans ouvrir ?", answer: "Ouvrez délicatement une seule papillote et piquez le thermomètre au centre du poisson ; refermez-la si elle doit cuire encore 2 à 3 minutes." }] },
    ],
  );
}

/* ------------------------------------------------------------------ */

export function moreFormats(): Recipe[] {
  const out: Recipe[] = [];
  for (const base of CURRY_BASES) for (const pk of ["poulet", "crevettes", "tofu", "pois-chiches", "lentilles", "haricots-blancs"]) for (const veg of CURRY_VEGS) out.push(curry(base, proteinByKey(pk), veg));
  for (const style of CHILI_STYLES) for (const pk of CHILI_PROTEINS) for (const top of CHILI_TOPS) out.push(chili(style, proteinByKey(pk), top));
  for (const patty of BURGER_PATTIES) for (const style of BURGER_STYLES) for (const side of BURGER_SIDES) out.push(burger(patty, style, side));
  for (const sauce of GRATIN_SAUCES) for (const pk of GRATIN_PROTEINS) for (const veg of GRATIN_VEGS) out.push(gratin(sauce, pk, veg));
  for (const style of FRIED_RICE) for (const pk of FRIED_PROTEINS) out.push(friedRice(style, pk));
  for (const m of SKEWER_MARINADES) for (const pk of Object.keys(SKEWER_TIMES)) for (const side of SKEWER_SIDES) out.push(skewers(m, pk, side));
  for (const style of STEW_STYLES) for (const p of STEW_PROTEINS) out.push(stew(style, p));
  for (const fish of PAPILLOTE_FISH) for (const aroma of PAPILLOTE_AROMAS) for (const veg of PAPILLOTE_VEGS) out.push(papillote(fish, aroma, veg));
  return out;
}
