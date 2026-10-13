import type { Recipe } from "@/lib/domain/types";
import { SAFETY, ing } from "./helpers";

export const COLLATIONS: Recipe[] = [
  {
    id: "houmous-crudites",
    name: "Houmous maison et crudités",
    description: "Houmous ultra-lisse au tahini et au citron, servi avec carottes, concombre et poivron. La collation libanaise parfaite à préparer pour toute la semaine.",
    cuisine: "Libanaise",
    mealTypes: ["collation"],
    servings: 6,
    prepMinutes: 15,
    cookMinutes: 0,
    difficulty: "facile",
    equipment: ["robot-culinaire"],
    tags: ["prep-avance", "familial"],
    ingredients: [
      ing("pois-chiches", 350, "g", { note: "rincés" }), // 0
      ing("tahini", 60, "ml"), // 1
      ing("citron", 1, "unite", { note: "jus" }), // 2
      ing("ail", 1, "unite"), // 3
      ing("huile-olive", 2, "c-soupe"), // 4
      ing("cumin", 0.5, "c-the"), // 5
      ing("sel", 0.5, "c-the"), // 6
      ing("carotte", 3, "unite", { note: "en bâtonnets" }), // 7
      ing("concombre", 1, "unite", { note: "en bâtonnets" }), // 8
      ing("poivron-rouge", 1, "unite", { note: "en lanières" }), // 9
    ],
    steps: [
      {
        text: "Dans le robot, mélangez le tahini et le jus de citron 1 minute, jusqu'à ce que le mélange blanchisse et épaississe.",
        minutes: 1,
        uses: [{ index: 1 }, { index: 2 }],
        tip: "Fouetter d'abord le tahini et le citron, c'est le secret d'un houmous aérien.",
      },
      {
        text: "Ajoutez l'ail, le cumin, le sel et les pois chiches. Mixez 2 minutes en raclant les parois. Avec le moteur en marche, ajoutez 3 à 4 c. à soupe d'eau glacée jusqu'à texture très lisse.",
        minutes: 3,
        timers: [{ label: "Mixage", seconds: 2 * 60 }],
        uses: [{ index: 3 }, { index: 5 }, { index: 6 }, { index: 0 }],
        faq: [{ question: "Mon houmous est granuleux.", answer: "Mixez plus longtemps (jusqu'à 4 min) et ajoutez un peu d'eau glacée. Retirer la peau des pois chiches donne aussi un résultat plus lisse." }],
      },
      {
        text: "Versez dans un bol, creusez un sillon avec le dos d'une cuillère et arrosez d'huile d'olive. Servez avec les crudités.",
        uses: [{ index: 4 }, { index: 7 }, { index: 8 }, { index: 9 }],
      },
    ],
    tips: ["Se conserve 5 jours au réfrigérateur dans un contenant hermétique."],
    substitutions: [
      { from: "Tahini", to: "Huile d'olive supplémentaire et yogourt grec", note: "Version sans sésame (contient du lait)." },
      { from: "Crudités", to: "Craquelins de riz" },
    ],
    firstTime: {
      utensils: ["Robot culinaire", "Spatule en silicone", "Passoire"],
      prep: ["Rincez et égouttez les pois chiches.", "Pressez le citron en retirant les pépins."],
      techniques: ["Émulsionner : mixer en ajoutant un liquide petit à petit pour une texture crémeuse."],
      doneness: ["Le houmous est lisse, crémeux et tient sur une cuillère."],
      safety: [SAFETY.fridge, "Utilisez une cuillère propre pour servir afin de prolonger la conservation."],
    },
  },
  {
    id: "edamames-ail-piment",
    name: "Edamames sautés ail et piment",
    description: "Edamames poêlés avec ail, piment et une touche de sauce soja. Une collation japonaise prête en 10 minutes avec 12 g de protéines végétales par portion.",
    cuisine: "Japonaise",
    mealTypes: ["collation"],
    servings: 4,
    prepMinutes: 3,
    cookMinutes: 7,
    difficulty: "facile",
    equipment: [],
    tags: ["rapide", "post-entrainement"],
    ingredients: [
      ing("edamame", 400, "g"), // 0
      ing("huile-sesame", 1, "c-soupe"), // 1
      ing("ail", 2, "unite", { note: "hachées" }), // 2
      ing("piment-broye", 0.5, "c-the"), // 3
      ing("sauce-soja", 1, "c-soupe"), // 4
    ],
    steps: [
      {
        text: "Cuisez les edamames 4 minutes dans l'eau bouillante salée. Égouttez et épongez-les.",
        minutes: 4,
        timers: [{ label: "Edamames", seconds: 4 * 60 }],
        uses: [{ index: 0 }],
      },
      {
        text: "Chauffez l'huile de sésame dans une poêle à feu moyen. Ajoutez l'ail et le piment 30 secondes, puis les edamames et la sauce soja. Sautez 2 minutes.",
        minutes: 3,
        timers: [{ label: "Sauté", seconds: 2 * 60 }],
        uses: [{ index: 1 }, { index: 2 }, { index: 3 }, { index: 4 }],
        tip: "L'huile de sésame grillé brûle facilement : gardez un feu moyen.",
      },
    ],
    tips: ["Délicieux chauds ou froids, dans la boîte à lunch."],
    substitutions: [{ from: "Sauce soja", to: "Tamari sans gluten", note: "Version sans gluten." }],
    firstTime: {
      utensils: ["Casserole", "Poêle", "Passoire"],
      prep: ["Hachez l'ail finement."],
      techniques: ["Blanchir : cuire brièvement à l'eau bouillante."],
      doneness: ["Les edamames sont tendres mais gardent un léger croquant, et d'un vert éclatant."],
      safety: [SAFETY.hotOil],
    },
  },
  {
    id: "boules-energie-dattes",
    name: "Boules d'énergie dattes, cacao et arachide",
    description: "Dattes, flocons d'avoine, beurre d'arachide et cacao, sans cuisson. L'en-cas idéal 30 à 60 minutes avant l'entraînement ou la course.",
    cuisine: "Moyen-orientale",
    mealTypes: ["collation"],
    servings: 8,
    prepMinutes: 15,
    cookMinutes: 0,
    difficulty: "facile",
    equipment: ["robot-culinaire"],
    tags: ["pre-entrainement", "prep-avance"],
    ingredients: [
      ing("dattes", 12, "unite", { note: "dénoyautées" }), // 0
      ing("flocons-avoine", 100, "g"), // 1
      ing("beurre-arachide", 120, "g"), // 2
      ing("cacao", 2, "c-soupe"), // 3
      ing("graines-chia", 1, "c-soupe"), // 4
      ing("sel", 1, "pincee"), // 5
    ],
    steps: [
      {
        text: "Si les dattes sont fermes, faites-les tremper 10 minutes dans l'eau chaude, puis égouttez-les.",
        minutes: 10,
        timers: [{ label: "Trempage des dattes", seconds: 10 * 60 }],
        uses: [{ index: 0 }],
      },
      {
        text: "Dans le robot, mixez les flocons d'avoine 20 secondes. Ajoutez les dattes, le beurre d'arachide, le cacao, le chia et le sel. Mixez jusqu'à ce que la pâte forme une boule.",
        minutes: 2,
        uses: [{ index: 1 }, { index: 2 }, { index: 3 }, { index: 4 }, { index: 5 }],
        faq: [{ question: "La pâte est trop sèche.", answer: "Ajoutez 1 c. à soupe d'eau ou de beurre d'arachide et mixez à nouveau." }],
      },
      {
        text: "Avec les mains légèrement humides, façonnez 16 boules de la taille d'une noix de Grenoble. Réfrigérez 20 minutes pour les raffermir.",
        minutes: 20,
        timers: [{ label: "Raffermir au froid", seconds: 20 * 60 }],
      },
    ],
    tips: ["Se conservent 1 semaine au réfrigérateur ou 3 mois au congélateur."],
    substitutions: [
      { from: "Beurre d'arachide", to: "Beurre de graines de tournesol", note: "Sans arachides, idéal pour les boîtes à lunch scolaires." },
      { from: "Flocons d'avoine", to: "Flocons d'avoine certifiés sans gluten" },
    ],
    firstTime: {
      utensils: ["Robot culinaire", "Plaque ou assiette", "Bol d'eau pour humidifier les mains"],
      prep: ["Dénoyautez les dattes en les ouvrant sur la longueur."],
      techniques: ["Façonner : rouler la pâte entre les paumes humides."],
      doneness: ["Les boules se tiennent sans s'effriter après réfrigération."],
      safety: ["Contient des arachides : étiquetez le contenant si vous partagez."],
    },
  },
  {
    id: "smoothie-proteine-banane",
    name: "Smoothie protéiné banane et arachide",
    description: "Banane, yogourt grec, lait, beurre d'arachide et avoine : un smoothie de récupération onctueux avec près de 25 g de protéines, sans poudre protéinée.",
    cuisine: "Nord-américaine",
    mealTypes: ["collation", "dejeuner"],
    servings: 2,
    prepMinutes: 5,
    cookMinutes: 0,
    difficulty: "facile",
    equipment: ["melangeur"],
    tags: ["rapide", "post-entrainement"],
    ingredients: [
      ing("banane", 2, "unite", { note: "idéalement congelées" }), // 0
      ing("yogourt-grec", 200, "g"), // 1
      ing("lait", 300, "ml"), // 2
      ing("beurre-arachide", 2, "c-soupe"), // 3
      ing("flocons-avoine", 30, "g"), // 4
      ing("cannelle", 1, "pincee"), // 5
    ],
    steps: [
      {
        text: "Versez le lait dans le mélangeur, puis ajoutez le yogourt, le beurre d'arachide, les flocons d'avoine, la cannelle et les bananes.",
        uses: [{ index: 2 }, { index: 1 }, { index: 3 }, { index: 4 }, { index: 5 }, { index: 0 }],
        tip: "Mettre le liquide en premier aide les lames à tourner.",
      },
      {
        text: "Mixez 45 à 60 secondes à haute vitesse jusqu'à consistance lisse. Servez aussitôt.",
        minutes: 1,
        timers: [{ label: "Mixage", seconds: 50 }],
        faq: [{ question: "Mon smoothie est trop épais.", answer: "Ajoutez du lait, 60 ml à la fois, et mixez à nouveau." }],
      },
    ],
    tips: ["Congelez les bananes trop mûres en morceaux : elles rendent le smoothie froid et crémeux sans glaçons."],
    substitutions: [
      { from: "Lait et yogourt", to: "Boisson de soya et yogourt de soya", note: "Version végétalienne, toujours riche en protéines." },
      { from: "Beurre d'arachide", to: "Beurre d'amande", note: "Contient des noix." },
    ],
    firstTime: {
      utensils: ["Mélangeur", "Tasse à mesurer"],
      prep: ["Pelez et coupez les bananes en morceaux avant de les congeler."],
      techniques: ["Mixer en commençant à basse vitesse, puis augmenter."],
      doneness: ["Texture lisse, sans morceaux d'avoine visibles."],
      safety: ["Débranchez le mélangeur avant d'y mettre les doigts ou une spatule."],
    },
  },
];
