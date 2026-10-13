import type { Recipe } from "@/lib/domain/types";
import { DONENESS, SAFETY, ing } from "./helpers";

export const DEJEUNERS: Recipe[] = [
  {
    id: "shakshuka",
    name: "Shakshuka aux poivrons et à la feta",
    description: "Œufs pochés dans une sauce tomate épicée au cumin et au paprika fumé. Un déjeuner du Maghreb et du Moyen-Orient qui se partage directement dans la poêle.",
    cuisine: "Moyen-orientale",
    mealTypes: ["dejeuner", "diner"],
    servings: 4,
    prepMinutes: 10,
    cookMinutes: 25,
    difficulty: "facile",
    equipment: [],
    tags: ["familial"],
    ingredients: [
      ing("huile-olive", 2, "c-soupe"), // 0
      ing("oignon", 1, "unite", { note: "émincé" }), // 1
      ing("poivron-rouge", 1, "unite", { note: "en lanières" }), // 2
      ing("ail", 3, "unite", { note: "hachées" }), // 3
      ing("cumin", 1, "c-the"), // 4
      ing("paprika-fume", 1, "c-the"), // 5
      ing("tomates-broyees", 796, "ml"), // 6
      ing("sel", 0.5, "c-the"), // 7
      ing("oeuf", 6, "unite"), // 8
      ing("feta", 60, "g", { note: "émiettée" }), // 9
      ing("persil", 10, "g", { note: "haché" }), // 10
    ],
    steps: [
      {
        text: "Chauffez l'huile dans une grande poêle à feu moyen. Ajoutez l'oignon et le poivron et faites-les revenir jusqu'à ce qu'ils soient tendres.",
        minutes: 7,
        timers: [{ label: "Oignon et poivron", seconds: 7 * 60 }],
        uses: [{ index: 0 }, { index: 1 }, { index: 2 }],
        tip: "Les légumes sont prêts quand l'oignon devient translucide et que le poivron plie facilement.",
        faq: [{ question: "Mes légumes brunissent trop vite, que faire ?", answer: "Baissez le feu à moyen-doux et remuez plus souvent. Un peu de coloration donne du goût, mais ils ne doivent pas noircir." }],
      },
      {
        text: "Ajoutez l'ail, le cumin et le paprika fumé. Remuez 1 minute, juste assez pour libérer les arômes.",
        minutes: 1,
        timers: [{ label: "Épices", seconds: 60 }],
        uses: [{ index: 3 }, { index: 4 }, { index: 5 }],
        tip: "Les épices brûlent vite : restez près de la poêle et remuez sans arrêt.",
      },
      {
        text: "Versez les tomates broyées et le sel. Laissez mijoter à découvert jusqu'à ce que la sauce épaississe.",
        minutes: 10,
        timers: [{ label: "Sauce tomate", seconds: 10 * 60 }],
        uses: [{ index: 6 }, { index: 7 }],
        tip: "La sauce est prête quand une cuillère tirée au fond laisse un sillon qui se referme lentement.",
        faq: [{ question: "Ma sauce est trop acide.", answer: "Ajoutez une pincée de sucre ou laissez mijoter 3 minutes de plus : la cuisson adoucit l'acidité." }],
      },
      {
        text: "Creusez 6 puits dans la sauce avec une cuillère et cassez un œuf dans chacun. Couvrez et laissez cuire à feu doux jusqu'à ce que les blancs soient pris.",
        minutes: 7,
        timers: [{ label: "Œufs (jaunes coulants)", seconds: 6 * 60 }, { label: "Œufs (jaunes fermes)", seconds: 10 * 60 }],
        uses: [{ index: 8 }],
        tip: "Cassez chaque œuf dans un petit bol avant de le verser : c'est plus facile et vous évitez les morceaux de coquille.",
        faq: [
          { question: "Comment savoir si les œufs sont cuits ?", answer: "Le blanc doit être entièrement opaque, sans partie translucide. Pour un jaune ferme (recommandé pour les femmes enceintes, jeunes enfants et aînés), comptez 3 à 4 minutes de plus." },
          { question: "Je n'ai pas de couvercle.", answer: "Utilisez une plaque à pâtisserie ou un grand plat retourné ; le couvercle sert à cuire le dessus des œufs à la vapeur." },
        ],
      },
      {
        text: "Parsemez de feta et de persil. Servez immédiatement, directement dans la poêle.",
        uses: [{ index: 9 }, { index: 10 }],
        tip: "Posez la poêle chaude sur une planche ou un sous-plat, jamais directement sur la table.",
      },
    ],
    tips: [
      "Accompagnez de pain pita grillé ou de pain au levain pour saucer.",
      "La sauce (étapes 1 à 3) se prépare la veille et se réchauffe avant d'y cuire les œufs.",
    ],
    substitutions: [
      { from: "Feta", to: "Avocat en dés", note: "Version sans produits laitiers." },
      { from: "Poivron rouge", to: "Courgette ou épinards", note: "Ajoutez les épinards à la toute fin." },
    ],
    firstTime: {
      utensils: ["Grande poêle (26–30 cm) avec couvercle", "Planche à découper et couteau de chef", "Cuillère de bois", "Petit bol pour casser les œufs"],
      prep: ["Émincez l'oignon en fines demi-lunes.", "Retirez le cœur et les graines du poivron, puis taillez-le en lanières.", "Hachez finement l'ail.", "Mesurez les épices à l'avance : l'étape 2 va très vite."],
      techniques: ["Faire revenir : cuire à feu moyen en remuant, pour attendrir sans brûler.", "Mijoter : petits bouillons à la surface, à feu moyen-doux."],
      doneness: [DONENESS.eggs],
      safety: [SAFETY.hands, "Lavez-vous les mains après avoir manipulé les œufs crus.", SAFETY.hotOil],
    },
  },
  {
    id: "bol-yogourt-grec",
    name: "Bol de yogourt grec, petits fruits et amandes",
    description: "Yogourt grec onctueux, petits fruits, chia et amandes grillées. Prêt en 5 minutes, riche en protéines, parfait avant le travail ou après l'entraînement.",
    cuisine: "Méditerranéenne",
    mealTypes: ["dejeuner", "collation"],
    servings: 2,
    prepMinutes: 5,
    cookMinutes: 0,
    difficulty: "facile",
    equipment: [],
    tags: ["rapide", "post-entrainement"],
    ingredients: [
      ing("yogourt-grec", 400, "g"), // 0
      ing("petits-fruits", 200, "g", { note: "frais ou décongelés" }), // 1
      ing("graines-chia", 2, "c-soupe"), // 2
      ing("amandes", 30, "g"), // 3
      ing("miel", 2, "c-soupe"), // 4
    ],
    steps: [
      {
        text: "Faites dorer les amandes 2 à 3 minutes dans une poêle sèche à feu moyen, en remuant.",
        minutes: 3,
        timers: [{ label: "Amandes grillées", seconds: 3 * 60 }],
        uses: [{ index: 3 }],
        tip: "Retirez-les dès qu'elles sentent bon et deviennent dorées : quelques secondes de trop et elles brûlent.",
      },
      {
        text: "Répartissez le yogourt dans deux bols et parsemez de graines de chia.",
        uses: [{ index: 0 }, { index: 2 }],
      },
      {
        text: "Garnissez de petits fruits et d'amandes, puis arrosez de miel.",
        uses: [{ index: 1 }, { index: 4 }],
        faq: [{ question: "Mes petits fruits congelés sont encore durs.", answer: "Passez-les 30 à 45 secondes au micro-ondes ou laissez-les décongeler au réfrigérateur pendant la nuit." }],
      },
    ],
    tips: ["Préparez les amandes grillées en grande quantité : elles se conservent 2 semaines dans un pot hermétique."],
    substitutions: [
      { from: "Amandes", to: "Graines de citrouille", note: "Version sans noix." },
      { from: "Miel", to: "Sirop d'érable", note: "Version végétalienne si combiné à un yogourt végétal." },
      { from: "Yogourt grec", to: "Yogourt de soya nature", note: "Moins de protéines." },
    ],
    firstTime: {
      utensils: ["Petite poêle", "Deux bols", "Cuillères à mesurer"],
      prep: ["Si vos fruits sont congelés, sortez-les la veille au réfrigérateur."],
      techniques: ["Griller à sec : sans matière grasse, à feu moyen, en remuant constamment."],
      doneness: ["Amandes : dorées et parfumées, sans taches brunes foncées."],
      safety: ["Le miel ne doit jamais être donné aux bébés de moins d'un an.", SAFETY.fridge],
    },
  },
  {
    id: "bircher-muesli",
    name: "Bircher muesli aux pommes et à l'érable",
    description: "Le classique suisse préparé la veille : flocons d'avoine trempés dans le lait et le yogourt, pomme râpée et touche d'érable. Le déjeuner idéal des matins pressés.",
    cuisine: "Suisse",
    mealTypes: ["dejeuner"],
    servings: 4,
    prepMinutes: 10,
    cookMinutes: 0,
    difficulty: "facile",
    equipment: [],
    tags: ["prep-avance", "pre-entrainement"],
    ingredients: [
      ing("flocons-avoine", 160, "g"), // 0
      ing("lait", 300, "ml"), // 1
      ing("yogourt-grec", 200, "g"), // 2
      ing("pomme", 1, "unite", { note: "râpée avec la pelure" }), // 3
      ing("graines-chia", 2, "c-soupe"), // 4
      ing("sirop-erable", 2, "c-soupe"), // 5
      ing("cannelle", 0.5, "c-the"), // 6
      ing("petits-fruits", 150, "g"), // 7
    ],
    steps: [
      {
        text: "Dans un grand bol, mélangez les flocons d'avoine, le lait, le yogourt, les graines de chia, le sirop d'érable et la cannelle.",
        uses: [{ index: 0 }, { index: 1 }, { index: 2 }, { index: 4 }, { index: 5 }, { index: 6 }],
      },
      {
        text: "Râpez la pomme directement dans le bol et mélangez aussitôt pour éviter qu'elle brunisse.",
        uses: [{ index: 3 }],
        tip: "Utilisez le côté à gros trous de la râpe et tenez la pomme par le haut pour protéger vos doigts.",
      },
      {
        text: "Couvrez et réfrigérez au moins 4 heures, idéalement toute la nuit.",
        minutes: 240,
        faq: [{ question: "Puis-je le manger tout de suite ?", answer: "Après 30 minutes c'est mangeable, mais la texture crémeuse vient avec un trempage d'au moins 4 heures." }],
      },
      {
        text: "Au moment de servir, mélangez, ajoutez un peu de lait si c'est trop épais et garnissez de petits fruits.",
        uses: [{ index: 7 }],
      },
    ],
    tips: ["Se conserve 3 jours au réfrigérateur : préparez-en pour la semaine dans des pots individuels."],
    substitutions: [
      { from: "Flocons d'avoine", to: "Flocons d'avoine certifiés sans gluten", note: "Pour les personnes cœliaques." },
      { from: "Lait et yogourt", to: "Boisson de soya et yogourt de soya", note: "Version végétalienne." },
    ],
    firstTime: {
      utensils: ["Grand bol avec couvercle ou pellicule", "Râpe", "Tasses et cuillères à mesurer"],
      prep: ["Lavez la pomme ; inutile de la peler."],
      techniques: ["Trempage à froid : l'avoine absorbe le liquide et s'attendrit sans cuisson."],
      doneness: ["Les flocons sont tendres et la texture est crémeuse, sans liquide en surface."],
      safety: [SAFETY.fridge, "Gardez le bircher au réfrigérateur ; ne le laissez pas plus de 2 heures à température ambiante."],
    },
  },
  {
    id: "huevos-rancheros",
    name: "Huevos rancheros aux haricots noirs",
    description: "Tortillas de maïs dorées, haricots noirs, sauce tomate au jalapeño et œufs au plat. Un déjeuner mexicain coloré, rassasiant et riche en fibres.",
    cuisine: "Mexicaine",
    mealTypes: ["dejeuner", "diner"],
    servings: 4,
    prepMinutes: 10,
    cookMinutes: 20,
    difficulty: "facile",
    equipment: [],
    tags: ["familial"],
    ingredients: [
      ing("huile-vegetale", 2, "c-soupe"), // 0
      ing("oignon", 0.5, "unite", { note: "haché" }), // 1
      ing("ail", 2, "unite", { note: "hachées" }), // 2
      ing("jalapeno", 1, "unite", { note: "épépiné et haché" }), // 3
      ing("cumin", 0.5, "c-the"), // 4
      ing("tomates-des", 398, "ml"), // 5
      ing("haricots-noirs", 350, "g", { note: "rincés" }), // 6
      ing("tortilla-mais", 8, "unite"), // 7
      ing("oeuf", 4, "unite"), // 8
      ing("feta", 60, "g", { note: "émiettée" }), // 9
      ing("avocat", 1, "unite", { note: "en tranches" }), // 10
      ing("coriandre", 10, "g"), // 11
      ing("lime", 0.5, "unite", { note: "en quartiers" }), // 12
    ],
    steps: [
      {
        text: "Dans une casserole, chauffez la moitié de l'huile à feu moyen. Faites revenir l'oignon, l'ail et le jalapeño 4 minutes.",
        minutes: 4,
        timers: [{ label: "Base de sauce", seconds: 4 * 60 }],
        uses: [{ index: 0, part: 0.5 }, { index: 1 }, { index: 2 }, { index: 3 }],
        tip: "Portez des gants ou lavez-vous bien les mains après avoir coupé le jalapeño, et ne vous touchez pas les yeux.",
      },
      {
        text: "Ajoutez le cumin, les tomates et les haricots noirs. Laissez mijoter 8 minutes en écrasant légèrement quelques haricots.",
        minutes: 8,
        timers: [{ label: "Sauce aux haricots", seconds: 8 * 60 }],
        uses: [{ index: 4 }, { index: 5 }, { index: 6 }],
      },
      {
        text: "Pendant ce temps, réchauffez les tortillas 30 secondes de chaque côté dans une poêle sèche. Gardez-les au chaud sous un linge.",
        minutes: 4,
        uses: [{ index: 7 }],
        faq: [{ question: "Mes tortillas se cassent.", answer: "Elles sont trop sèches ou froides : réchauffez-les un peu plus longtemps, ou passez-les sous un filet d'eau avant la poêle." }],
      },
      {
        text: "Dans la même poêle, chauffez le reste de l'huile et faites cuire les œufs au plat jusqu'à ce que les blancs soient pris.",
        minutes: 4,
        timers: [{ label: "Œufs au plat", seconds: 4 * 60 }],
        uses: [{ index: 0, part: 0.5 }, { index: 8 }],
        tip: "Couvrez la poêle 1 minute pour cuire le dessus des blancs sans retourner les œufs.",
      },
      {
        text: "Dressez 2 tortillas par assiette, nappez de sauce aux haricots, déposez un œuf, puis garnissez de feta, d'avocat, de coriandre et d'un quartier de lime.",
        uses: [{ index: 9 }, { index: 10 }, { index: 11 }, { index: 12 }],
      },
    ],
    tips: ["Doublez la sauce aux haricots : elle se congèle 3 mois et fait d'excellents burritos."],
    substitutions: [
      { from: "Feta", to: "Queso fresco ou cheddar", note: "Plus authentique avec le queso fresco." },
      { from: "Œufs", to: "Tofu brouillé", note: "Version végétalienne (retirez aussi la feta)." },
    ],
    firstTime: {
      utensils: ["Casserole moyenne", "Grande poêle antiadhésive avec couvercle", "Spatule", "Linge propre"],
      prep: ["Rincez et égouttez les haricots dans une passoire.", "Coupez le jalapeño en deux, retirez les graines et les membranes blanches (le piquant), puis hachez.", "Coupez l'avocat juste avant de servir pour éviter qu'il brunisse."],
      techniques: ["Œuf au plat : feu moyen-doux, sans retourner ; couvrir pour cuire le dessus."],
      doneness: [DONENESS.eggs],
      safety: [SAFETY.hands, "Les capsaïcines du piment irritent les yeux : lavez-vous les mains au savon."],
    },
  },
  {
    id: "tofu-brouille-epice",
    name: "Tofu brouillé à l'indienne (bhurji)",
    description: "Inspiré de l'anda bhurji indien : tofu émietté, tomates, gingembre, curcuma et garam masala. Un déjeuner végétalien riche en protéines, prêt en 20 minutes.",
    cuisine: "Indienne",
    mealTypes: ["dejeuner", "diner"],
    servings: 4,
    prepMinutes: 8,
    cookMinutes: 12,
    difficulty: "facile",
    equipment: [],
    tags: ["rapide", "post-entrainement"],
    ingredients: [
      ing("tofu-ferme", 450, "g", { note: "égoutté" }), // 0
      ing("huile-vegetale", 1, "c-soupe"), // 1
      ing("oignon", 1, "unite", { note: "haché finement" }), // 2
      ing("ail", 2, "unite", { note: "hachées" }), // 3
      ing("gingembre", 10, "g", { note: "râpé" }), // 4
      ing("tomate", 2, "unite", { note: "en dés" }), // 5
      ing("curcuma", 0.5, "c-the"), // 6
      ing("cumin", 0.5, "c-the"), // 7
      ing("garam-masala", 0.5, "c-the"), // 8
      ing("sel", 0.5, "c-the"), // 9
      ing("epinards", 100, "g"), // 10
      ing("coriandre", 10, "g", { note: "hachée" }), // 11
      ing("lime", 0.5, "unite"), // 12
    ],
    steps: [
      {
        text: "Épongez le tofu avec un linge propre, puis émiettez-le avec vos doigts en morceaux de la taille d'œufs brouillés.",
        uses: [{ index: 0 }],
        tip: "Plus le tofu est sec, plus il dore et absorbe les épices.",
      },
      {
        text: "Chauffez l'huile dans une grande poêle à feu moyen. Faites revenir l'oignon jusqu'à ce qu'il soit doré.",
        minutes: 5,
        timers: [{ label: "Oignon", seconds: 5 * 60 }],
        uses: [{ index: 1 }, { index: 2 }],
      },
      {
        text: "Ajoutez l'ail, le gingembre, le curcuma et le cumin ; remuez 30 secondes. Ajoutez les tomates et cuisez 3 minutes, jusqu'à ce qu'elles ramollissent.",
        minutes: 4,
        timers: [{ label: "Tomates", seconds: 3 * 60 }],
        uses: [{ index: 3 }, { index: 4 }, { index: 6 }, { index: 7 }, { index: 5 }],
        faq: [{ question: "Le curcuma tache-t-il ?", answer: "Oui, beaucoup. Utilisez une spatule en silicone et rincez la planche rapidement." }],
      },
      {
        text: "Ajoutez le tofu, le garam masala et le sel. Cuisez 4 minutes en remuant. Incorporez les épinards jusqu'à ce qu'ils tombent.",
        minutes: 5,
        timers: [{ label: "Tofu et épinards", seconds: 5 * 60 }],
        uses: [{ index: 8 }, { index: 9 }, { index: 10 }],
      },
      {
        text: "Arrosez de jus de lime, parsemez de coriandre et servez chaud.",
        uses: [{ index: 11 }, { index: 12 }],
      },
    ],
    tips: ["Servez avec des tortillas de maïs chaudes ou du pain naan.", "Une pincée de sel noir (kala namak) donne un goût d'œuf surprenant."],
    substitutions: [
      { from: "Tofu", to: "6 œufs battus", note: "Version anda bhurji traditionnelle (végétarienne)." },
      { from: "Épinards", to: "Petits pois surgelés" },
    ],
    firstTime: {
      utensils: ["Grande poêle antiadhésive", "Spatule", "Râpe fine pour le gingembre", "Linge propre"],
      prep: ["Pelez le gingembre avec le bord d'une cuillère, puis râpez-le finement.", "Coupez les tomates en petits dés."],
      techniques: ["Émietter : briser le tofu à la main en morceaux irréguliers.", "Faire revenir les épices : 30 secondes dans l'huile chaude pour libérer leurs arômes."],
      doneness: ["Le tofu est chaud au centre et légèrement doré par endroits.", "Les épinards sont tombés mais encore vert vif."],
      safety: [SAFETY.fridge, SAFETY.reheat],
    },
  },
];
