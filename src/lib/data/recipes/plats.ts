import type { Recipe } from "@/lib/domain/types";
import { DONENESS, SAFETY, ing } from "./helpers";

export const PLATS: Recipe[] = [
  /* ---------------------------------------------------------------- */
  {
    id: "poulet-tikka",
    name: "Poulet tikka masala, riz basmati",
    description: "Hauts de cuisse marinés au yogourt et aux épices, saisis puis mijotés dans une sauce tomate et lait de coco. Le grand classique indien, version maison et plus légère.",
    cuisine: "Indienne",
    mealTypes: ["diner", "souper"],
    servings: 4,
    prepMinutes: 20,
    cookMinutes: 35,
    difficulty: "moyen",
    equipment: [],
    tags: ["familial", "post-entrainement"],
    ingredients: [
      ing("cuisse-poulet", 600, "g", { note: "en cubes de 3 cm" }), // 0
      ing("yogourt-grec", 150, "g"), // 1
      ing("citron", 0.5, "unite", { note: "jus" }), // 2
      ing("ail", 3, "unite", { note: "râpées" }), // 3
      ing("gingembre", 15, "g", { note: "râpé" }), // 4
      ing("garam-masala", 2, "c-the"), // 5
      ing("cumin", 1, "c-the"), // 6
      ing("paprika-fume", 1, "c-the"), // 7
      ing("curcuma", 0.5, "c-the"), // 8
      ing("sel", 1, "c-the"), // 9
      ing("huile-vegetale", 2, "c-soupe"), // 10
      ing("oignon", 1, "unite", { note: "haché" }), // 11
      ing("tomates-broyees", 398, "ml"), // 12
      ing("lait-coco", 200, "ml"), // 13
      ing("riz-basmati", 300, "g"), // 14
      ing("coriandre", 10, "g"), // 15
    ],
    steps: [
      {
        text: "Dans un bol, mélangez le yogourt, le jus de citron, l'ail, le gingembre, la moitié du garam masala, le cumin, le paprika, le curcuma et la moitié du sel. Ajoutez le poulet, enrobez bien et réfrigérez au moins 30 minutes.",
        minutes: 30,
        timers: [{ label: "Marinade", seconds: 30 * 60 }],
        uses: [{ index: 1 }, { index: 2 }, { index: 3 }, { index: 4 }, { index: 5, part: 0.5 }, { index: 6 }, { index: 7 }, { index: 8 }, { index: 9, part: 0.5 }, { index: 0 }],
        tip: "Vous pouvez faire mariner le poulet le matin : plus il marine (jusqu'à 24 h), plus il est tendre.",
        faq: [{ question: "Puis-je laisser mariner à température ambiante ?", answer: "Non. Une marinade avec de la volaille crue doit toujours rester au réfrigérateur." }],
      },
      {
        text: "Rincez le riz jusqu'à ce que l'eau soit presque claire. Mettez-le dans une casserole avec 600 ml d'eau et une pincée de sel, portez à ébullition, couvrez et cuisez à feu doux 12 minutes. Laissez reposer 5 minutes à couvert.",
        minutes: 17,
        timers: [{ label: "Riz basmati", seconds: 12 * 60 }, { label: "Repos du riz", seconds: 5 * 60 }],
        uses: [{ index: 14 }],
        tip: "Ne soulevez pas le couvercle pendant la cuisson : la vapeur fait tout le travail.",
      },
      {
        text: "Chauffez la moitié de l'huile dans une grande poêle à feu moyen-vif. Saisissez le poulet en 2 fois, 3 minutes par côté, jusqu'à ce qu'il soit bien doré. Réservez dans une assiette propre.",
        minutes: 8,
        timers: [{ label: "Poulet — 1re fournée", seconds: 6 * 60 }],
        uses: [{ index: 10, part: 0.5 }],
        tip: "Ne surchargez pas la poêle : le poulet doit grésiller, pas bouillir dans son jus.",
      },
      {
        text: "Dans la même poêle, chauffez le reste de l'huile et faites revenir l'oignon 5 minutes. Ajoutez le reste du garam masala et du sel, puis les tomates et le lait de coco. Laissez mijoter 5 minutes.",
        minutes: 10,
        timers: [{ label: "Sauce masala", seconds: 5 * 60 }],
        uses: [{ index: 10, part: 0.5 }, { index: 11 }, { index: 5, part: 0.5 }, { index: 9, part: 0.5 }, { index: 12 }, { index: 13 }],
      },
      {
        text: "Remettez le poulet dans la sauce et laissez mijoter 10 minutes, jusqu'à ce qu'il atteigne 74 °C à cœur.",
        minutes: 10,
        timers: [{ label: "Mijotage du poulet", seconds: 10 * 60 }],
        tip: "Coupez le plus gros morceau : la chair doit être blanche, sans trace rosée, et le jus clair.",
        faq: [
          { question: "La sauce est trop épaisse.", answer: "Ajoutez de l'eau, 2 c. à soupe à la fois, jusqu'à la texture désirée." },
          { question: "C'est trop épicé pour les enfants.", answer: "Ajoutez 2 à 3 c. à soupe de yogourt nature dans leur assiette : le gras du yogourt adoucit le piquant." },
        ],
      },
      {
        text: "Parsemez de coriandre et servez sur le riz basmati.",
        uses: [{ index: 15 }],
      },
    ],
    tips: ["Les hauts de cuisse restent plus juteux que la poitrine ; avec de la poitrine, réduisez le mijotage à 7 minutes.", "Encore meilleur le lendemain : idéal pour les lunchs."],
    substitutions: [
      { from: "Poulet", to: "Pois chiches (2 boîtes) et chou-fleur", note: "Version végétarienne : sautez la marinade, ajoutez-les à la sauce." },
      { from: "Lait de coco", to: "Crème 15 %", note: "Plus proche de la version de restaurant." },
      { from: "Yogourt grec", to: "Yogourt de coco", note: "Version sans produits laitiers." },
    ],
    firstTime: {
      utensils: ["Grande poêle profonde ou sauteuse", "Casserole avec couvercle", "Grand bol pour la marinade", "Pince de cuisine", "Thermomètre numérique"],
      prep: ["Coupez le poulet en cubes de 3 cm sur une planche réservée à la viande crue.", "Râpez l'ail et le gingembre sur une râpe fine.", "Hachez l'oignon finement."],
      techniques: ["Saisir : cuire à feu vif sans bouger les morceaux pour les dorer.", "Mijoter : petits bouillons à feu moyen-doux."],
      doneness: [DONENESS.poultry],
      safety: [SAFETY.hands, SAFETY.boards, SAFETY.marinade, SAFETY.thermometer, SAFETY.fridge],
    },
  },
  /* ---------------------------------------------------------------- */
  {
    id: "dal-lentilles-corail",
    name: "Dal de lentilles corail au lait de coco",
    description: "Lentilles corail fondantes, tomates, épices douces et lait de coco, relevées de lime. Un plat végétalien réconfortant, économique et riche en protéines végétales.",
    cuisine: "Indienne",
    mealTypes: ["diner", "souper"],
    servings: 4,
    prepMinutes: 10,
    cookMinutes: 25,
    difficulty: "facile",
    equipment: [],
    tags: ["familial", "prep-avance"],
    ingredients: [
      ing("huile-vegetale", 2, "c-soupe"), // 0
      ing("oignon", 1, "unite", { note: "haché" }), // 1
      ing("ail", 3, "unite", { note: "hachées" }), // 2
      ing("gingembre", 15, "g", { note: "râpé" }), // 3
      ing("curcuma", 1, "c-the"), // 4
      ing("cumin", 1, "c-the"), // 5
      ing("garam-masala", 1, "c-the"), // 6
      ing("lentilles-corail", 300, "g", { note: "rincées" }), // 7
      ing("tomates-des", 398, "ml"), // 8
      ing("bouillon-legumes", 750, "ml"), // 9
      ing("lait-coco", 200, "ml"), // 10
      ing("epinards", 100, "g"), // 11
      ing("lime", 0.5, "unite"), // 12
      ing("riz-basmati", 300, "g"), // 13
      ing("coriandre", 10, "g"), // 14
    ],
    steps: [
      {
        text: "Lancez le riz : rincez-le, puis cuisez-le dans 600 ml d'eau, à couvert et à feu doux, 12 minutes. Laissez reposer 5 minutes.",
        minutes: 17,
        timers: [{ label: "Riz basmati", seconds: 12 * 60 }],
        uses: [{ index: 13 }],
      },
      {
        text: "Dans une grande casserole, chauffez l'huile à feu moyen. Faites revenir l'oignon 5 minutes, puis ajoutez l'ail, le gingembre, le curcuma, le cumin et le garam masala. Remuez 1 minute.",
        minutes: 6,
        timers: [{ label: "Oignon et épices", seconds: 6 * 60 }],
        uses: [{ index: 0 }, { index: 1 }, { index: 2 }, { index: 3 }, { index: 4 }, { index: 5 }, { index: 6 }],
      },
      {
        text: "Ajoutez les lentilles rincées, les tomates et le bouillon. Portez à ébullition, puis laissez mijoter à feu doux 18 minutes en remuant de temps en temps.",
        minutes: 18,
        timers: [{ label: "Lentilles", seconds: 18 * 60 }],
        uses: [{ index: 7 }, { index: 8 }, { index: 9 }],
        tip: "Les lentilles corail se défont en cuisant : c'est normal, c'est ce qui donne la texture crémeuse.",
        faq: [
          { question: "Il faut tremper les lentilles ?", answer: "Non. Les lentilles corail cuisent rapidement sans trempage ; rincez-les seulement pour retirer l'amidon en surface." },
          { question: "Ça colle au fond.", answer: "Baissez le feu, ajoutez 125 ml d'eau et remuez en raclant le fond." },
        ],
      },
      {
        text: "Incorporez le lait de coco et les épinards ; cuisez 2 minutes. Ajoutez le jus de lime et goûtez pour rectifier le sel.",
        minutes: 2,
        uses: [{ index: 10 }, { index: 11 }, { index: 12 }],
      },
      {
        text: "Servez sur le riz et garnissez de coriandre.",
        uses: [{ index: 14 }],
      },
    ],
    tips: ["Le dal épaissit en refroidissant : ajoutez un peu d'eau en le réchauffant.", "Se congèle très bien jusqu'à 3 mois."],
    substitutions: [
      { from: "Lentilles corail", to: "Lentilles jaunes (moong dal)", note: "Cuisson 5 minutes plus longue." },
      { from: "Riz basmati", to: "Pain naan", note: "Attention : contient du gluten." },
    ],
    firstTime: {
      utensils: ["Grande casserole à fond épais", "Casserole avec couvercle pour le riz", "Passoire fine", "Cuillère de bois"],
      prep: ["Rincez les lentilles dans une passoire fine jusqu'à ce que l'eau soit presque claire.", "Hachez l'oignon et l'ail, râpez le gingembre."],
      techniques: ["Mijoter à feu doux : quelques bulles à la surface seulement.", "Rectifier l'assaisonnement : goûter à la fin et ajuster sel et acidité."],
      doneness: [DONENESS.legumes, "Le dal a la texture d'une purée épaisse."],
      safety: [SAFETY.fridge, SAFETY.reheat],
    },
  },
  /* ---------------------------------------------------------------- */
  {
    id: "tajine-poulet",
    name: "Tajine de poulet aux abricots et pois chiches",
    description: "Poulet mijoté aux épices marocaines, carottes, abricots séchés et pois chiches, servi sur couscous. Sucré-salé, parfumé et parfait pour les soupers d'automne.",
    cuisine: "Marocaine",
    mealTypes: ["souper"],
    servings: 4,
    prepMinutes: 15,
    cookMinutes: 40,
    difficulty: "moyen",
    equipment: [],
    tags: ["familial", "prep-avance"],
    ingredients: [
      ing("huile-olive", 2, "c-soupe"), // 0
      ing("cuisse-poulet", 600, "g", { note: "en gros morceaux" }), // 1
      ing("oignon", 1, "unite", { note: "émincé" }), // 2
      ing("ail", 3, "unite", { note: "hachées" }), // 3
      ing("cumin", 1, "c-the"), // 4
      ing("cannelle", 0.5, "c-the"), // 5
      ing("curcuma", 0.5, "c-the"), // 6
      ing("paprika-fume", 1, "c-the"), // 7
      ing("carotte", 3, "unite", { note: "en rondelles épaisses" }), // 8
      ing("bouillon-poulet", 500, "ml"), // 9
      ing("pois-chiches", 350, "g", { note: "rincés" }), // 10
      ing("abricots-secs", 80, "g", { note: "coupés en deux" }), // 11
      ing("citron", 0.5, "unite"), // 12
      ing("couscous", 250, "g"), // 13
      ing("coriandre", 10, "g"), // 14
      ing("sel", 1, "c-the"), // 15
    ],
    steps: [
      {
        text: "Salez le poulet. Chauffez l'huile dans une cocotte à feu moyen-vif et dorez le poulet 3 minutes par côté. Réservez.",
        minutes: 7,
        timers: [{ label: "Dorer le poulet", seconds: 6 * 60 }],
        uses: [{ index: 15, part: 0.5 }, { index: 0 }, { index: 1 }],
      },
      {
        text: "Baissez à feu moyen. Faites revenir l'oignon 5 minutes, puis ajoutez l'ail, le cumin, la cannelle, le curcuma et le paprika. Remuez 1 minute.",
        minutes: 6,
        timers: [{ label: "Oignon et épices", seconds: 6 * 60 }],
        uses: [{ index: 2 }, { index: 3 }, { index: 4 }, { index: 5 }, { index: 6 }, { index: 7 }],
      },
      {
        text: "Ajoutez les carottes, le bouillon, le reste du sel et le poulet. Couvrez et laissez mijoter 20 minutes à feu doux.",
        minutes: 20,
        timers: [{ label: "Mijotage", seconds: 20 * 60 }],
        uses: [{ index: 8 }, { index: 9 }, { index: 15, part: 0.5 }],
        tip: "Avec une mijoteuse : transférez tout à cette étape et cuisez 4 h à intensité élevée ou 6 h à basse.",
      },
      {
        text: "Ajoutez les pois chiches et les abricots, puis poursuivez la cuisson 10 minutes à découvert. Le poulet doit atteindre 74 °C.",
        minutes: 10,
        timers: [{ label: "Pois chiches et abricots", seconds: 10 * 60 }],
        uses: [{ index: 10 }, { index: 11 }],
      },
      {
        text: "Pendant ce temps, versez 300 ml d'eau bouillante sur le couscous dans un bol, couvrez et laissez gonfler 5 minutes. Égrainez à la fourchette.",
        minutes: 5,
        timers: [{ label: "Couscous", seconds: 5 * 60 }],
        uses: [{ index: 13 }],
        faq: [{ question: "Mon couscous est pâteux.", answer: "Trop d'eau ou pas assez égrainé. Respectez l'équivalent du volume de couscous en eau et égrainez avec une fourchette, pas une cuillère." }],
      },
      {
        text: "Arrosez le tajine de jus de citron, parsemez de coriandre et servez sur le couscous.",
        uses: [{ index: 12 }, { index: 14 }],
      },
    ],
    tips: ["Les saveurs se développent pendant la nuit : un excellent plat à préparer la veille."],
    substitutions: [
      { from: "Couscous", to: "Quinoa", note: "Version sans gluten." },
      { from: "Abricots séchés", to: "Dattes hachées", note: "Sans sulfites." },
      { from: "Bouillon de poulet", to: "Bouillon de légumes" },
    ],
    firstTime: {
      utensils: ["Cocotte en fonte ou grande casserole à fond épais avec couvercle", "Bol résistant à la chaleur", "Pince de cuisine", "Thermomètre numérique"],
      prep: ["Pelez et coupez les carottes en rondelles de 1 cm.", "Coupez le poulet sur une planche réservée à la viande crue.", "Rincez les pois chiches."],
      techniques: ["Dorer : colorer la viande à feu vif avant le mijotage pour plus de saveur.", "Égrainer : séparer les grains de couscous à la fourchette."],
      doneness: [DONENESS.poultry, "Les carottes sont tendres sous la pointe d'un couteau."],
      safety: [SAFETY.hands, SAFETY.boards, SAFETY.thermometer, SAFETY.fridge],
    },
  },
  /* ---------------------------------------------------------------- */
  {
    id: "bol-burrito-poulet",
    name: "Bol burrito au poulet chipotle",
    description: "Poulet épicé, riz à la lime, haricots noirs, maïs, tomates, avocat et yogourt façon crème sure. Tout ce qu'on aime d'un burrito, en version bol plus légère.",
    cuisine: "Mexicaine",
    mealTypes: ["diner", "souper"],
    servings: 4,
    prepMinutes: 15,
    cookMinutes: 20,
    difficulty: "facile",
    equipment: [],
    tags: ["familial", "post-entrainement", "prep-avance"],
    ingredients: [
      ing("poitrine-poulet", 500, "g"), // 0
      ing("assaisonnement-chili", 1, "c-soupe"), // 1
      ing("cumin", 1, "c-the"), // 2
      ing("paprika-fume", 1, "c-the"), // 3
      ing("sel", 0.75, "c-the"), // 4
      ing("huile-vegetale", 1, "c-soupe"), // 5
      ing("riz-basmati", 250, "g"), // 6
      ing("lime", 1, "unite"), // 7
      ing("haricots-noirs", 350, "g", { note: "rincés" }), // 8
      ing("mais", 200, "g"), // 9
      ing("tomate-cerise", 200, "g", { note: "coupées en deux" }), // 10
      ing("avocat", 1, "unite", { note: "en dés" }), // 11
      ing("laitue-romaine", 150, "g", { note: "émincée" }), // 12
      ing("yogourt-grec", 100, "g"), // 13
      ing("coriandre", 10, "g"), // 14
    ],
    steps: [
      {
        text: "Cuisez le riz dans 500 ml d'eau salée, à couvert et à feu doux, 12 minutes. Laissez reposer 5 minutes puis ajoutez le zeste et le jus d'une demi-lime.",
        minutes: 17,
        timers: [{ label: "Riz", seconds: 12 * 60 }],
        uses: [{ index: 6 }, { index: 7, part: 0.5 }],
      },
      {
        text: "Coupez les poitrines en deux sur l'épaisseur. Frottez-les avec l'assaisonnement au chili, le cumin, le paprika et le sel.",
        uses: [{ index: 0 }, { index: 1 }, { index: 2 }, { index: 3 }, { index: 4 }],
        tip: "Des escalopes d'épaisseur égale cuisent uniformément et restent juteuses.",
      },
      {
        text: "Chauffez l'huile dans une poêle à feu moyen-vif et cuisez le poulet 4 à 5 minutes par côté, jusqu'à 74 °C à cœur. Laissez reposer 5 minutes, puis tranchez.",
        minutes: 15,
        timers: [{ label: "Poulet — côté 1", seconds: 5 * 60 }, { label: "Poulet — côté 2", seconds: 5 * 60 }, { label: "Repos", seconds: 5 * 60 }],
        uses: [{ index: 5 }],
        faq: [{ question: "Pourquoi laisser reposer la viande ?", answer: "Le repos permet aux jus de se redistribuer : la viande reste juteuse au lieu de rendre son jus sur la planche." }],
      },
      {
        text: "Réchauffez les haricots noirs et le maïs 3 minutes à la poêle ou au micro-ondes.",
        minutes: 3,
        uses: [{ index: 8 }, { index: 9 }],
      },
      {
        text: "Assemblez les bols : riz, laitue, haricots, maïs, poulet, tomates, avocat, une cuillerée de yogourt, la coriandre et un quartier de lime.",
        uses: [{ index: 12 }, { index: 10 }, { index: 11 }, { index: 13 }, { index: 14 }, { index: 7, part: 0.5 }],
      },
    ],
    tips: ["Pour les lunchs, gardez l'avocat et la laitue à part et ajoutez-les au moment de manger."],
    substitutions: [
      { from: "Poulet", to: "Tofu extra-ferme en cubes", note: "Version végétarienne : même assaisonnement." },
      { from: "Yogourt grec", to: "Salsa verde", note: "Sans produits laitiers." },
    ],
    firstTime: {
      utensils: ["Grande poêle", "Casserole avec couvercle", "Pince de cuisine", "Thermomètre numérique"],
      prep: ["Trancher le poulet en deux sur l'épaisseur : posez la main à plat dessus et coupez parallèlement à la planche.", "Rincez les haricots et le maïs."],
      techniques: ["Frotter aux épices (rub) : couvrir la viande d'un mélange d'épices sèches avant cuisson.", "Trancher contre le grain pour une viande plus tendre."],
      doneness: [DONENESS.poultry],
      safety: [SAFETY.hands, SAFETY.boards, SAFETY.thermometer, SAFETY.fridge],
    },
  },
  /* ---------------------------------------------------------------- */
  {
    id: "souvlaki-poulet",
    name: "Souvlaki de poulet, salade grecque et tzatziki",
    description: "Poulet mariné au citron et à l'origan, salade grecque croquante et tzatziki maison. Frais, très protéiné et prêt en 35 minutes.",
    cuisine: "Grecque",
    mealTypes: ["diner", "souper"],
    servings: 4,
    prepMinutes: 25,
    cookMinutes: 12,
    difficulty: "facile",
    equipment: [],
    tags: ["post-entrainement"],
    ingredients: [
      ing("poitrine-poulet", 600, "g", { note: "en cubes de 3 cm" }), // 0
      ing("huile-olive", 4, "c-soupe"), // 1
      ing("citron", 1, "unite"), // 2
      ing("ail", 3, "unite", { note: "hachées" }), // 3
      ing("origan", 2, "c-the"), // 4
      ing("sel", 1, "c-the"), // 5
      ing("yogourt-grec", 200, "g"), // 6
      ing("concombre", 1, "unite"), // 7
      ing("menthe", 5, "g", { note: "hachée" }), // 8
      ing("tomate", 3, "unite", { note: "en quartiers" }), // 9
      ing("oignon-rouge", 0.5, "unite", { note: "en fines lamelles" }), // 10
      ing("feta", 100, "g", { note: "en cubes" }), // 11
      ing("olives-kalamata", 60, "g"), // 12
    ],
    steps: [
      {
        text: "Mélangez la moitié de l'huile, le jus d'un demi-citron, 2 gousses d'ail, l'origan et la moitié du sel. Enrobez le poulet et réfrigérez 15 minutes.",
        minutes: 15,
        timers: [{ label: "Marinade", seconds: 15 * 60 }],
        uses: [{ index: 1, part: 0.5 }, { index: 2, part: 0.5 }, { index: 3, part: 0.67 }, { index: 4 }, { index: 5, part: 0.5 }, { index: 0 }],
      },
      {
        text: "Tzatziki : râpez un tiers du concombre, pressez-le dans un linge pour retirer l'eau. Mélangez-le au yogourt, à la dernière gousse d'ail, à la menthe et à une pincée de sel.",
        uses: [{ index: 7, part: 0.33 }, { index: 6 }, { index: 3, part: 0.33 }, { index: 8 }],
        tip: "Bien essorer le concombre évite un tzatziki liquide.",
      },
      {
        text: "Salade : coupez le reste du concombre en demi-rondelles. Mélangez avec les tomates, l'oignon rouge, la feta, les olives, le reste de l'huile, du jus de citron et du sel.",
        uses: [{ index: 7, part: 0.67 }, { index: 9 }, { index: 10 }, { index: 11 }, { index: 12 }, { index: 1, part: 0.5 }, { index: 2, part: 0.5 }, { index: 5, part: 0.5 }],
      },
      {
        text: "Chauffez une poêle-gril ou une grande poêle à feu moyen-vif. Cuisez le poulet 10 à 12 minutes en le retournant, jusqu'à 74 °C à cœur.",
        minutes: 12,
        timers: [{ label: "Poulet", seconds: 11 * 60 }],
        faq: [
          { question: "Je veux faire des brochettes.", answer: "Enfilez le poulet sur des brochettes (trempées 30 min dans l'eau si elles sont en bois) et grillez-les 10 à 12 min sur le BBQ à feu moyen-vif." },
          { question: "Le poulet colle à la poêle.", answer: "Attendez qu'il se détache seul (environ 2 min) avant de le retourner : une fois saisi, il décolle facilement." },
        ],
      },
      {
        text: "Servez le poulet avec la salade grecque et le tzatziki.",
      },
    ],
    tips: ["Ajoutez des pitas chauds pour une version sandwich (contient du gluten)."],
    substitutions: [
      { from: "Feta", to: "Pois chiches grillés", note: "Sans produits laitiers (remplacez aussi le tzatziki par du houmous)." },
      { from: "Poitrine de poulet", to: "Tofu extra-ferme", note: "Version végétarienne." },
    ],
    firstTime: {
      utensils: ["Poêle-gril ou grande poêle", "Râpe", "Linge propre pour essorer", "Saladier", "Thermomètre numérique"],
      prep: ["Coupez le poulet en cubes réguliers sur une planche réservée à la viande crue.", "Émincez l'oignon rouge très finement ; trempez-le 5 min dans l'eau froide pour l'adoucir."],
      techniques: ["Essorer : presser le concombre râpé dans un linge pour retirer l'eau.", "Saisir à feu moyen-vif pour dorer sans dessécher."],
      doneness: [DONENESS.poultry],
      safety: [SAFETY.hands, SAFETY.boards, SAFETY.marinade, SAFETY.thermometer],
    },
  },
  /* ---------------------------------------------------------------- */
  {
    id: "bol-falafels",
    name: "Bol de falafels au four, sauce tahini",
    description: "Falafels croustillants cuits au four, quinoa, crudités et sauce tahini citronnée. Un bol libanais végétalien, coloré et rassasiant.",
    cuisine: "Libanaise",
    mealTypes: ["diner", "souper"],
    servings: 4,
    prepMinutes: 25,
    cookMinutes: 25,
    difficulty: "moyen",
    equipment: ["robot-culinaire", "four"],
    tags: ["prep-avance"],
    ingredients: [
      ing("pois-chiches-secs", 250, "g", { note: "trempés 12 h" }), // 0
      ing("oignon", 0.5, "unite"), // 1
      ing("ail", 3, "unite"), // 2
      ing("persil", 30, "g"), // 3
      ing("coriandre", 30, "g"), // 4
      ing("cumin", 2, "c-the"), // 5
      ing("coriandre-moulue", 1, "c-the"), // 6
      ing("bicarbonate", 0.5, "c-the"), // 7
      ing("sel", 1, "c-the"), // 8
      ing("huile-olive", 3, "c-soupe"), // 9
      ing("quinoa", 200, "g", { note: "rincé" }), // 10
      ing("concombre", 1, "unite", { note: "en dés" }), // 11
      ing("tomate-cerise", 200, "g"), // 12
      ing("chou-rouge", 150, "g", { note: "émincé finement" }), // 13
      ing("tahini", 60, "ml"), // 14
      ing("citron", 1, "unite", { note: "jus" }), // 15
    ],
    steps: [
      {
        text: "La veille : couvrez les pois chiches secs de 3 fois leur volume d'eau froide et laissez tremper 12 heures. Égouttez-les et épongez-les bien.",
        minutes: 720,
        uses: [{ index: 0 }],
        tip: "N'utilisez pas de pois chiches en conserve : trop humides, les falafels se défont.",
        faq: [{ question: "J'ai oublié de faire tremper les pois chiches.", answer: "Couvrez-les d'eau bouillante et laissez reposer 1 h 30 : c'est moins parfait, mais ça dépanne." }],
      },
      {
        text: "Préchauffez le four à 200 °C. Dans le robot, hachez les pois chiches, l'oignon, 2 gousses d'ail, le persil, la coriandre, les épices, le bicarbonate et le sel par impulsions, jusqu'à obtenir une texture de couscous.",
        uses: [{ index: 1 }, { index: 2, part: 0.67 }, { index: 3 }, { index: 4 }, { index: 5 }, { index: 6 }, { index: 7 }, { index: 8 }],
        tip: "N'en faites pas une purée : une texture granuleuse donne des falafels légers et croustillants.",
      },
      {
        text: "Formez 20 boulettes légèrement aplaties. Déposez-les sur une plaque tapissée de papier parchemin, badigeonnez d'huile et cuisez 25 minutes en les retournant à mi-cuisson.",
        minutes: 25,
        timers: [{ label: "Falafels — 1re face", seconds: 12 * 60 }, { label: "Falafels — 2e face", seconds: 13 * 60 }],
        uses: [{ index: 9 }],
        faq: [
          { question: "Mes falafels s'effritent.", answer: "Le mélange est trop sec ou pas assez haché : remettez-le 3 à 4 impulsions dans le robot et pressez fermement les boulettes." },
          { question: "Puis-je utiliser la friteuse à air ?", answer: "Oui : 15 minutes à 190 °C, en secouant le panier à mi-cuisson, après les avoir badigeonnés d'huile." },
        ],
      },
      {
        text: "Pendant la cuisson, mettez le quinoa dans 400 ml d'eau salée, portez à ébullition, couvrez et cuisez 15 minutes à feu doux. Égrainez.",
        minutes: 15,
        timers: [{ label: "Quinoa", seconds: 15 * 60 }],
        uses: [{ index: 10 }],
      },
      {
        text: "Sauce : fouettez le tahini, le jus de citron, la dernière gousse d'ail râpée et 60 à 80 ml d'eau froide jusqu'à consistance nappante. Salez.",
        uses: [{ index: 14 }, { index: 15 }, { index: 2, part: 0.33 }],
        tip: "Le tahini fige d'abord quand on ajoute le citron : continuez à fouetter en ajoutant l'eau, il redeviendra lisse.",
      },
      {
        text: "Assemblez les bols : quinoa, concombre, tomates, chou rouge, 5 falafels et un filet de sauce tahini.",
        uses: [{ index: 11 }, { index: 12 }, { index: 13 }],
      },
    ],
    tips: ["Les falafels crus se congèlent sur une plaque puis en sac : cuisez-les directement congelés, 5 minutes de plus."],
    substitutions: [
      { from: "Quinoa", to: "Boulgour", note: "Contient du gluten." },
      { from: "Sauce tahini", to: "Tzatziki ou yogourt citronné", note: "Sans sésame (contient du lait)." },
    ],
    firstTime: {
      utensils: ["Robot culinaire", "Plaque de cuisson et papier parchemin", "Pinceau de cuisine", "Casserole avec couvercle", "Fouet"],
      prep: ["Faites tremper les pois chiches la veille.", "Lavez et séchez bien les herbes : l'humidité rend les falafels friables.", "Rincez le quinoa pour retirer son amertume."],
      techniques: ["Hacher par impulsions : appuyer brièvement plusieurs fois pour contrôler la texture.", "Égrainer : séparer les grains à la fourchette."],
      doneness: ["Falafels : bien dorés des deux côtés, croustillants à l'extérieur, cuits et chauds au centre.", "Quinoa : le germe blanc forme une petite spirale visible autour de chaque grain."],
      safety: ["Les pois chiches secs ne se mangent jamais crus : ils doivent être entièrement cuits.", SAFETY.fridge],
    },
  },
  /* ---------------------------------------------------------------- */
  {
    id: "minestrone",
    name: "Minestrone aux haricots blancs",
    description: "La soupe-repas italienne par excellence : légumes, haricots blancs, petites pâtes et basilic. Végétalienne, économique et encore meilleure le lendemain.",
    cuisine: "Italienne",
    mealTypes: ["diner", "souper"],
    servings: 6,
    prepMinutes: 15,
    cookMinutes: 30,
    difficulty: "facile",
    equipment: [],
    tags: ["familial", "prep-avance"],
    ingredients: [
      ing("huile-olive", 2, "c-soupe"), // 0
      ing("oignon", 1, "unite", { note: "en dés" }), // 1
      ing("carotte", 2, "unite", { note: "en dés" }), // 2
      ing("celeri", 2, "unite", { note: "en dés" }), // 3
      ing("ail", 2, "unite", { note: "hachées" }), // 4
      ing("courgette", 1, "unite", { note: "en dés" }), // 5
      ing("origan", 1, "c-the"), // 6
      ing("tomates-des", 796, "ml"), // 7
      ing("bouillon-legumes", 1500, "ml"), // 8
      ing("haricots-blancs", 350, "g", { note: "rincés" }), // 9
      ing("pates-courtes", 120, "g"), // 10
      ing("epinards", 100, "g"), // 11
      ing("basilic", 10, "g"), // 12
      ing("sel", 1, "c-the"), // 13
    ],
    steps: [
      {
        text: "Chauffez l'huile dans une grande casserole à feu moyen. Faites revenir l'oignon, la carotte et le céleri 8 minutes.",
        minutes: 8,
        timers: [{ label: "Soffritto", seconds: 8 * 60 }],
        uses: [{ index: 0 }, { index: 1 }, { index: 2 }, { index: 3 }],
        tip: "Ce trio oignon-carotte-céleri s'appelle le soffritto : c'est la base de goût de la soupe.",
      },
      {
        text: "Ajoutez l'ail, la courgette et l'origan ; cuisez 2 minutes.",
        minutes: 2,
        uses: [{ index: 4 }, { index: 5 }, { index: 6 }],
      },
      {
        text: "Ajoutez les tomates, le bouillon et le sel. Portez à ébullition, puis laissez mijoter 10 minutes.",
        minutes: 12,
        timers: [{ label: "Mijotage", seconds: 10 * 60 }],
        uses: [{ index: 7 }, { index: 8 }, { index: 13 }],
      },
      {
        text: "Ajoutez les haricots et les pâtes. Cuisez le temps indiqué sur l'emballage des pâtes (environ 9 minutes), en remuant de temps en temps.",
        minutes: 9,
        timers: [{ label: "Pâtes", seconds: 9 * 60 }],
        uses: [{ index: 9 }, { index: 10 }],
        faq: [{ question: "Les pâtes absorbent tout le bouillon le lendemain.", answer: "Si vous prévoyez des restes, cuisez les pâtes à part et ajoutez-les dans chaque bol." }],
      },
      {
        text: "Incorporez les épinards hors du feu. Servez garni de basilic déchiré.",
        uses: [{ index: 11 }, { index: 12 }],
      },
    ],
    tips: ["Un morceau de croûte de parmesan ajouté au mijotage donne beaucoup de profondeur (non végétalien)."],
    substitutions: [
      { from: "Petites pâtes", to: "Riz ou pâtes sans gluten", note: "Version sans gluten." },
      { from: "Courgette", to: "Haricots verts ou chou kale" },
    ],
    firstTime: {
      utensils: ["Grande casserole (5 L)", "Couteau de chef et planche", "Louche"],
      prep: ["Coupez tous les légumes en dés de même taille (1 cm) pour une cuisson uniforme.", "Rincez les haricots."],
      techniques: ["Couper en dés (brunoise grossière).", "Mijoter à feu moyen-doux."],
      doneness: ["Les carottes sont tendres et les pâtes sont al dente (tendres avec une légère résistance au centre)."],
      safety: [SAFETY.fridge, SAFETY.reheat, "Pour refroidir rapidement une grande quantité de soupe, répartissez-la dans plusieurs petits contenants."],
    },
  },
  /* ---------------------------------------------------------------- */
  {
    id: "risotto-champignons",
    name: "Risotto aux champignons et petits pois",
    description: "Riz arborio crémeux, champignons dorés, petits pois et parmesan. Le confort italien, avec une technique simple à maîtriser grâce à la cuisine guidée.",
    cuisine: "Italienne",
    mealTypes: ["souper"],
    servings: 4,
    prepMinutes: 10,
    cookMinutes: 30,
    difficulty: "moyen",
    equipment: [],
    tags: [],
    ingredients: [
      ing("bouillon-legumes", 1200, "ml"), // 0
      ing("huile-olive", 2, "c-soupe"), // 1
      ing("champignons", 400, "g", { note: "tranchés" }), // 2
      ing("oignon", 1, "unite", { note: "haché finement" }), // 3
      ing("ail", 2, "unite", { note: "hachées" }), // 4
      ing("riz-arborio", 300, "g"), // 5
      ing("vin-blanc", 125, "ml", { optional: true }), // 6
      ing("petits-pois", 150, "g"), // 7
      ing("beurre", 30, "g"), // 8
      ing("parmesan", 60, "g"), // 9
      ing("persil", 10, "g"), // 10
    ],
    steps: [
      {
        text: "Faites chauffer le bouillon dans une casserole et gardez-le frémissant à feu doux.",
        uses: [{ index: 0 }],
        tip: "Un bouillon chaud ne refroidit pas le riz : la cuisson reste régulière.",
      },
      {
        text: "Dans une grande poêle profonde, chauffez la moitié de l'huile à feu moyen-vif. Dorez les champignons 6 minutes sans trop remuer. Réservez.",
        minutes: 6,
        timers: [{ label: "Champignons", seconds: 6 * 60 }],
        uses: [{ index: 1, part: 0.5 }, { index: 2 }],
      },
      {
        text: "Baissez à feu moyen. Ajoutez le reste de l'huile, l'oignon et l'ail ; cuisez 4 minutes. Ajoutez le riz et remuez 2 minutes jusqu'à ce que les grains deviennent nacrés.",
        minutes: 6,
        timers: [{ label: "Nacrer le riz", seconds: 2 * 60 }],
        uses: [{ index: 1, part: 0.5 }, { index: 3 }, { index: 4 }, { index: 5 }],
      },
      {
        text: "Versez le vin (facultatif) et remuez jusqu'à évaporation. Ajoutez le bouillon une louche à la fois, en remuant souvent et en attendant qu'il soit presque absorbé avant la louche suivante, pendant 18 minutes.",
        minutes: 18,
        timers: [{ label: "Cuisson du risotto", seconds: 18 * 60 }],
        uses: [{ index: 6 }],
        faq: [
          { question: "Je n'ai pas de vin.", answer: "Remplacez-le par une louche de bouillon et 1 c. à thé de jus de citron pour l'acidité." },
          { question: "Je n'ai plus de bouillon et le riz est encore croquant.", answer: "Continuez avec de l'eau chaude, une demi-louche à la fois." },
        ],
      },
      {
        text: "Ajoutez les petits pois et les champignons ; cuisez 2 minutes. Hors du feu, incorporez le beurre et le parmesan, couvrez 2 minutes, puis servez avec le persil.",
        minutes: 4,
        timers: [{ label: "Repos (mantecatura)", seconds: 2 * 60 }],
        uses: [{ index: 7 }, { index: 8 }, { index: 9 }, { index: 10 }],
        tip: "Le risotto doit former une « vague » quand on secoue l'assiette : ni compact, ni liquide.",
      },
    ],
    tips: ["Servez immédiatement : le risotto épaissit en refroidissant.", "Les restes font d'excellentes galettes poêlées (arancini aplatis)."],
    substitutions: [
      { from: "Beurre et parmesan", to: "Huile d'olive et levure nutritionnelle", note: "Version végétalienne." },
      { from: "Vin blanc", to: "Bouillon + jus de citron", note: "Sans alcool ni sulfites ajoutés." },
    ],
    firstTime: {
      utensils: ["Grande poêle profonde ou sauteuse", "Casserole pour le bouillon", "Louche", "Cuillère de bois"],
      prep: ["Nettoyez les champignons avec un papier humide (ne les faites pas tremper).", "Hachez l'oignon très finement pour qu'il fonde dans le riz."],
      techniques: ["Nacrer : enrober le riz de gras jusqu'à ce que les grains deviennent translucides sur les bords.", "Mantecatura : incorporer beurre et fromage hors du feu pour un fini crémeux."],
      doneness: ["Le riz est tendre avec un très léger cœur ferme (al dente) et la texture est fluide et crémeuse."],
      safety: [SAFETY.hotOil, SAFETY.fridge, "Le riz cuit doit être refroidi et réfrigéré rapidement (moins de 2 h) pour éviter la prolifération bactérienne."],
    },
  },
  /* ---------------------------------------------------------------- */
  {
    id: "poke-saumon",
    name: "Poké bol au saumon, edamames et avocat",
    description: "Saumon qualité sashimi mariné soja-sésame, riz vinaigré, edamames, avocat et crudités. Frais, coloré, riche en protéines et en oméga-3.",
    cuisine: "Hawaïenne",
    mealTypes: ["diner", "souper"],
    servings: 4,
    prepMinutes: 25,
    cookMinutes: 15,
    difficulty: "moyen",
    equipment: [],
    tags: ["post-entrainement"],
    ingredients: [
      ing("riz-sushi", 300, "g"), // 0
      ing("vinaigre-riz", 3, "c-soupe"), // 1
      ing("saumon-sashimi", 400, "g", { note: "en cubes de 2 cm" }), // 2
      ing("sauce-soja", 3, "c-soupe"), // 3
      ing("huile-sesame", 1, "c-soupe"), // 4
      ing("gingembre", 10, "g", { note: "râpé" }), // 5
      ing("edamame", 150, "g"), // 6
      ing("concombre", 1, "unite", { note: "en dés" }), // 7
      ing("avocat", 1, "unite", { note: "en tranches" }), // 8
      ing("carotte", 1, "unite", { note: "en julienne" }), // 9
      ing("oignon-vert", 2, "unite", { note: "émincés" }), // 10
      ing("graines-sesame", 1, "c-soupe"), // 11
      ing("lime", 0.5, "unite"), // 12
    ],
    steps: [
      {
        text: "Rincez le riz 3 fois. Cuisez-le dans 360 ml d'eau, à couvert et à feu doux, 12 minutes, puis laissez reposer 10 minutes. Incorporez le vinaigre de riz et laissez tiédir.",
        minutes: 22,
        timers: [{ label: "Riz à sushi", seconds: 12 * 60 }, { label: "Repos du riz", seconds: 10 * 60 }],
        uses: [{ index: 0 }, { index: 1 }],
      },
      {
        text: "Cuisez les edamames 4 minutes dans l'eau bouillante, puis refroidissez-les sous l'eau froide.",
        minutes: 4,
        timers: [{ label: "Edamames", seconds: 4 * 60 }],
        uses: [{ index: 6 }],
      },
      {
        text: "Mélangez la sauce soja, l'huile de sésame et le gingembre. Ajoutez le saumon bien froid et réfrigérez 10 minutes.",
        minutes: 10,
        timers: [{ label: "Marinade du saumon", seconds: 10 * 60 }],
        uses: [{ index: 3 }, { index: 4 }, { index: 5 }, { index: 2 }],
        tip: "Gardez le saumon au réfrigérateur jusqu'à la dernière minute et coupez-le avec un couteau bien aiguisé.",
        faq: [
          { question: "Est-ce sécuritaire de manger du saumon cru ?", answer: "Seulement avec du poisson vendu « qualité sashimi », préalablement congelé pour détruire les parasites, et gardé très froid. Les femmes enceintes, les jeunes enfants, les aînés et les personnes immunodéprimées devraient choisir la version cuite." },
          { question: "Je préfère le saumon cuit.", answer: "Saisissez les cubes 1 à 2 minutes par côté dans une poêle chaude, jusqu'à 70 °C à cœur, puis marinez-les." },
        ],
      },
      {
        text: "Répartissez le riz dans 4 bols. Disposez par sections le saumon, les edamames, le concombre, l'avocat et la carotte. Garnissez d'oignon vert, de graines de sésame et d'un filet de lime.",
        uses: [{ index: 7 }, { index: 8 }, { index: 9 }, { index: 10 }, { index: 11 }, { index: 12 }],
      },
    ],
    tips: ["Le riz doit être tiède, pas chaud, au moment d'assembler : sinon il « cuit » le poisson cru."],
    substitutions: [
      { from: "Saumon cru", to: "Tofu ferme mariné", note: "Version végétalienne." },
      { from: "Sauce soja", to: "Tamari sans gluten", note: "Version sans gluten." },
    ],
    firstTime: {
      utensils: ["Casserole avec couvercle", "Couteau bien aiguisé", "Planche réservée au poisson cru", "Passoire fine"],
      prep: ["Achetez le saumon le jour même et gardez-le au froid.", "Taillez la carotte en julienne (fins bâtonnets) ou râpez-la."],
      techniques: ["Rincer le riz pour retirer l'amidon de surface et éviter qu'il soit collant.", "Couper le poisson en cubes nets, en un seul mouvement de lame."],
      doneness: ["Riz : tendre et légèrement collant.", DONENESS.fish + " (si vous optez pour la version cuite)."],
      safety: [SAFETY.hands, SAFETY.boards, "Le poisson cru doit rester à 4 °C ou moins et être consommé le jour même.", "Personnes à risque (grossesse, enfants, aînés, immunodéprimés) : choisissez la version cuite."],
    },
  },
  /* ---------------------------------------------------------------- */
  {
    id: "saumon-teriyaki",
    name: "Saumon teriyaki à l'érable, bok choy",
    description: "Filets de saumon laqués d'une sauce teriyaki maison à l'érable, bok choy sautés et riz jasmin. Un souper de semaine japonais prêt en 30 minutes.",
    cuisine: "Japonaise",
    mealTypes: ["souper", "diner"],
    servings: 4,
    prepMinutes: 10,
    cookMinutes: 20,
    difficulty: "facile",
    equipment: ["four"],
    tags: ["post-entrainement", "familial"],
    ingredients: [
      ing("riz-jasmin", 300, "g"), // 0
      ing("sauce-soja", 60, "ml"), // 1
      ing("sirop-erable", 2, "c-soupe"), // 2
      ing("vinaigre-riz", 1, "c-soupe"), // 3
      ing("gingembre", 10, "g", { note: "râpé" }), // 4
      ing("ail", 2, "unite", { note: "râpées" }), // 5
      ing("fecule-mais", 1, "c-the"), // 6
      ing("saumon", 600, "g", { note: "4 filets" }), // 7
      ing("huile-vegetale", 1, "c-soupe"), // 8
      ing("bok-choy", 400, "g", { note: "coupés en deux" }), // 9
      ing("graines-sesame", 1, "c-the"), // 10
    ],
    steps: [
      {
        text: "Préchauffez le four à 200 °C. Lancez le riz : 450 ml d'eau, à couvert et à feu doux, 12 minutes, puis 5 minutes de repos.",
        minutes: 17,
        timers: [{ label: "Riz jasmin", seconds: 12 * 60 }],
        uses: [{ index: 0 }],
      },
      {
        text: "Dans une petite casserole, mélangez la sauce soja, le sirop d'érable, le vinaigre, le gingembre, l'ail et la fécule délayée dans 60 ml d'eau. Portez à ébullition 1 minute, jusqu'à ce que la sauce nappe la cuillère.",
        minutes: 3,
        uses: [{ index: 1 }, { index: 2 }, { index: 3 }, { index: 4 }, { index: 5 }, { index: 6 }],
        faq: [{ question: "Ma sauce a des grumeaux.", answer: "Délayez toujours la fécule dans un liquide froid avant de l'ajouter. Pour sauver la sauce, passez-la au tamis." }],
      },
      {
        text: "Déposez le saumon sur une plaque tapissée de papier parchemin. Badigeonnez-le avec la moitié de la sauce et enfournez 12 minutes.",
        minutes: 12,
        timers: [{ label: "Saumon au four", seconds: 12 * 60 }],
        uses: [{ index: 7 }],
        tip: "Comptez environ 10 minutes par 2,5 cm d'épaisseur de filet.",
      },
      {
        text: "Pendant ce temps, chauffez l'huile dans une poêle à feu vif et sautez les bok choy 4 minutes, côté coupé en premier. Ajoutez 1 c. à soupe d'eau, couvrez 1 minute.",
        minutes: 5,
        timers: [{ label: "Bok choy", seconds: 5 * 60 }],
        uses: [{ index: 8 }, { index: 9 }],
      },
      {
        text: "Vérifiez que le saumon atteint 70 °C et se défait à la fourchette. Servez sur le riz avec les bok choy, nappez du reste de sauce et parsemez de sésame.",
        uses: [{ index: 10 }],
      },
    ],
    tips: ["Doublez la sauce teriyaki : elle se garde 1 semaine au réfrigérateur."],
    substitutions: [
      { from: "Sauce soja", to: "Tamari sans gluten", note: "Version sans gluten." },
      { from: "Saumon", to: "Tofu extra-ferme en tranches", note: "Version végétalienne, 20 min au four." },
      { from: "Bok choy", to: "Brocoli" },
    ],
    firstTime: {
      utensils: ["Plaque de cuisson et papier parchemin", "Petite casserole", "Poêle", "Pinceau de cuisine", "Thermomètre numérique"],
      prep: ["Épongez les filets de saumon avec du papier absorbant.", "Lavez soigneusement les bok choy : du sable se cache souvent à la base des feuilles."],
      techniques: ["Laquer : badigeonner une sauce sucrée qui caramélise au four.", "Sauter à feu vif : cuisson rapide qui garde le croquant."],
      doneness: [DONENESS.fish],
      safety: [SAFETY.hands, SAFETY.boards, SAFETY.thermometer, "Ne réutilisez pas le pinceau qui a touché le poisson cru pour napper le plat cuit."],
    },
  },
  /* ---------------------------------------------------------------- */
  {
    id: "boeuf-brocoli",
    name: "Sauté de bœuf au brocoli et gingembre",
    description: "Lanières de bœuf tendres, brocoli croquant et sauce soja-gingembre brillante, servis sur riz jasmin. Plus rapide (et plus frais) qu'une commande au resto.",
    cuisine: "Chinoise",
    mealTypes: ["souper", "diner"],
    servings: 4,
    prepMinutes: 15,
    cookMinutes: 15,
    difficulty: "moyen",
    equipment: [],
    tags: ["post-entrainement", "rapide"],
    ingredients: [
      ing("boeuf-surlonge", 500, "g", { note: "en fines lanières" }), // 0
      ing("fecule-mais", 1, "c-soupe"), // 1
      ing("sauce-soja", 4, "c-soupe"), // 2
      ing("cassonade", 1, "c-soupe"), // 3
      ing("ail", 3, "unite", { note: "hachées" }), // 4
      ing("gingembre", 15, "g", { note: "râpé" }), // 5
      ing("brocoli", 500, "g", { note: "en fleurons" }), // 6
      ing("huile-vegetale", 2, "c-soupe"), // 7
      ing("riz-jasmin", 300, "g"), // 8
      ing("oignon-vert", 2, "unite", { note: "émincés" }), // 9
      ing("graines-sesame", 1, "c-the"), // 10
    ],
    steps: [
      {
        text: "Lancez le riz : 450 ml d'eau, à couvert et à feu doux, 12 minutes, puis 5 minutes de repos.",
        minutes: 17,
        timers: [{ label: "Riz jasmin", seconds: 12 * 60 }],
        uses: [{ index: 8 }],
      },
      {
        text: "Mélangez le bœuf avec la fécule et 1 c. à soupe de sauce soja. Dans un bol, préparez la sauce : le reste de la sauce soja, la cassonade et 125 ml d'eau.",
        uses: [{ index: 0 }, { index: 1 }, { index: 2 }, { index: 3 }],
        tip: "Coupez le bœuf contre le grain (perpendiculairement aux fibres) : il sera beaucoup plus tendre. 15 minutes au congélateur facilitent la coupe.",
      },
      {
        text: "Chauffez la moitié de l'huile dans un wok ou une grande poêle à feu vif. Saisissez le bœuf en 2 fois, 1 à 2 minutes par fournée. Réservez.",
        minutes: 4,
        timers: [{ label: "Bœuf — fournée 1", seconds: 2 * 60 }, { label: "Bœuf — fournée 2", seconds: 2 * 60 }],
        uses: [{ index: 7, part: 0.5 }],
        faq: [{ question: "Mon bœuf rend de l'eau au lieu de dorer.", answer: "La poêle n'est pas assez chaude ou trop chargée. Attendez que l'huile ondule et cuisez en plus petites fournées." }],
      },
      {
        text: "Ajoutez le reste de l'huile, l'ail et le gingembre (30 secondes), puis le brocoli et 60 ml d'eau. Couvrez et cuisez 3 minutes.",
        minutes: 4,
        timers: [{ label: "Brocoli", seconds: 3 * 60 }],
        uses: [{ index: 7, part: 0.5 }, { index: 4 }, { index: 5 }, { index: 6 }],
      },
      {
        text: "Remettez le bœuf, versez la sauce et faites bouillir 1 à 2 minutes jusqu'à ce qu'elle épaississe et nappe la viande. Servez sur le riz avec l'oignon vert et le sésame.",
        minutes: 2,
        uses: [{ index: 9 }, { index: 10 }],
      },
    ],
    tips: ["Préparez tous les ingrédients avant d'allumer le feu : un sauté va très vite."],
    substitutions: [
      { from: "Bœuf", to: "Tofu extra-ferme pressé", note: "Version végétalienne." },
      { from: "Sauce soja", to: "Tamari sans gluten", note: "Version sans gluten." },
      { from: "Riz jasmin", to: "Nouilles de riz" },
    ],
    firstTime: {
      utensils: ["Wok ou grande poêle", "Casserole avec couvercle", "Couteau de chef bien aiguisé", "Thermomètre numérique"],
      prep: ["Coupez le bœuf en lanières de 5 mm, contre le grain.", "Coupez le brocoli en petits fleurons de même taille ; pelez et tranchez la tige, elle est délicieuse."],
      techniques: ["Sauter au wok : feu vif, mouvements rapides, petites quantités.", "Velouter la viande : l'enrober de fécule pour la garder tendre."],
      doneness: [DONENESS.beefStrips, "Brocoli : vert vif, tendre mais encore croquant."],
      safety: [SAFETY.hands, SAFETY.boards, SAFETY.hotOil],
    },
  },
  /* ---------------------------------------------------------------- */
  {
    id: "pad-thai-crevettes",
    name: "Pad thaï aux crevettes",
    description: "Nouilles de riz sautées, crevettes, œuf, fèves germées et arachides, dans une sauce tamarin sucrée-acidulée. L'iconique plat de rue thaïlandais à la maison.",
    cuisine: "Thaïlandaise",
    mealTypes: ["souper", "diner"],
    servings: 4,
    prepMinutes: 20,
    cookMinutes: 15,
    difficulty: "moyen",
    equipment: [],
    tags: [],
    ingredients: [
      ing("nouilles-riz", 250, "g"), // 0
      ing("pate-tamarin", 3, "c-soupe"), // 1
      ing("sauce-poisson", 3, "c-soupe"), // 2
      ing("cassonade", 2, "c-soupe"), // 3
      ing("huile-vegetale", 3, "c-soupe"), // 4
      ing("ail", 3, "unite", { note: "hachées" }), // 5
      ing("crevettes", 400, "g"), // 6
      ing("oeuf", 2, "unite", { note: "battus" }), // 7
      ing("feves-germees", 150, "g"), // 8
      ing("oignon-vert", 4, "unite", { note: "en tronçons" }), // 9
      ing("arachides", 50, "g", { note: "concassées" }), // 10
      ing("lime", 1, "unite", { note: "en quartiers" }), // 11
      ing("piment-broye", 0.5, "c-the"), // 12
    ],
    steps: [
      {
        text: "Faites tremper les nouilles dans de l'eau très chaude du robinet 8 minutes, jusqu'à ce qu'elles soient souples mais encore fermes. Égouttez.",
        minutes: 8,
        timers: [{ label: "Trempage des nouilles", seconds: 8 * 60 }],
        uses: [{ index: 0 }],
        tip: "Les nouilles finissent de cuire dans la poêle : retirez-les quand elles plient mais restent un peu blanches au centre.",
      },
      {
        text: "Mélangez la pâte de tamarin, la sauce de poisson et la cassonade jusqu'à dissolution du sucre.",
        uses: [{ index: 1 }, { index: 2 }, { index: 3 }],
      },
      {
        text: "Chauffez 2 c. à soupe d'huile dans un wok à feu vif. Sautez l'ail 15 secondes, puis les crevettes 2 minutes jusqu'à ce qu'elles soient roses. Poussez-les sur le côté, versez les œufs et brouillez-les 1 minute.",
        minutes: 4,
        timers: [{ label: "Crevettes", seconds: 2 * 60 }],
        uses: [{ index: 4, part: 0.67 }, { index: 5 }, { index: 6 }, { index: 7 }],
        faq: [{ question: "Mes crevettes sont surgelées.", answer: "Décongelez-les sous l'eau froide dans une passoire (5 à 10 min), puis épongez-les bien avant de les cuire." }],
      },
      {
        text: "Ajoutez le reste de l'huile, les nouilles et la sauce. Sautez 2 à 3 minutes en soulevant avec une pince, jusqu'à ce que les nouilles soient tendres et la sauce absorbée.",
        minutes: 3,
        timers: [{ label: "Nouilles", seconds: 3 * 60 }],
        uses: [{ index: 4, part: 0.33 }],
        faq: [{ question: "Les nouilles collent en un bloc.", answer: "Ajoutez 2 à 3 c. à soupe d'eau et séparez-les avec la pince ; elles étaient peut-être trop trempées." }],
      },
      {
        text: "Ajoutez les fèves germées et l'oignon vert ; mélangez 30 secondes. Servez garni d'arachides, de flocons de piment et de quartiers de lime.",
        uses: [{ index: 8 }, { index: 9 }, { index: 10 }, { index: 12 }, { index: 11 }],
      },
    ],
    tips: ["Si votre wok est petit, cuisez en 2 portions : un wok surchargé donne des nouilles pâteuses."],
    substitutions: [
      { from: "Crevettes", to: "Tofu ferme en cubes", note: "Végétarien (remplacez aussi la sauce de poisson par de la sauce soja)." },
      { from: "Arachides", to: "Graines de tournesol grillées", note: "Sans arachides." },
      { from: "Pâte de tamarin", to: "2 c. à soupe de jus de lime + 1 c. à soupe de cassonade" },
    ],
    firstTime: {
      utensils: ["Wok ou très grande poêle", "Grand bol pour tremper les nouilles", "Pince de cuisine", "Passoire"],
      prep: ["Préparez et alignez TOUS les ingrédients avant de commencer : la cuisson prend moins de 10 minutes.", "Concassez les arachides dans un sac avec le fond d'une casserole."],
      techniques: ["Sauter au wok : feu vif, mouvements constants.", "Brouiller les œufs dans un coin du wok avant de les mélanger."],
      doneness: [DONENESS.shellfish, DONENESS.eggs],
      safety: [SAFETY.hands, SAFETY.boards, SAFETY.hotOil, "Ce plat contient des arachides, des crustacés, du poisson et des œufs : prévenez vos invités."],
    },
  },
  /* ---------------------------------------------------------------- */
  {
    id: "bibimbap-tofu",
    name: "Bibimbap au tofu croustillant",
    description: "Le bol coréen emblématique : riz, légumes sautés, tofu doré, œuf au plat et sauce gochujang. Un repas végétarien complet, à mélanger à table.",
    cuisine: "Coréenne",
    mealTypes: ["souper", "diner"],
    servings: 4,
    prepMinutes: 25,
    cookMinutes: 25,
    difficulty: "moyen",
    equipment: [],
    tags: ["post-entrainement"],
    ingredients: [
      ing("riz-sushi", 300, "g"), // 0
      ing("tofu-ferme", 350, "g", { note: "en cubes" }), // 1
      ing("fecule-mais", 1, "c-soupe"), // 2
      ing("huile-vegetale", 3, "c-soupe"), // 3
      ing("sauce-soja", 3, "c-soupe"), // 4
      ing("huile-sesame", 2, "c-soupe"), // 5
      ing("ail", 2, "unite", { note: "hachées" }), // 6
      ing("epinards", 200, "g"), // 7
      ing("carotte", 2, "unite", { note: "en julienne" }), // 8
      ing("champignons", 200, "g", { note: "tranchés" }), // 9
      ing("courgette", 1, "unite", { note: "en julienne" }), // 10
      ing("oeuf", 4, "unite"), // 11
      ing("gochujang", 3, "c-soupe"), // 12
      ing("sirop-erable", 1, "c-soupe"), // 13
      ing("vinaigre-riz", 1, "c-soupe"), // 14
      ing("graines-sesame", 1, "c-soupe"), // 15
    ],
    steps: [
      {
        text: "Rincez le riz et cuisez-le dans 360 ml d'eau, à couvert et à feu doux, 12 minutes, puis 10 minutes de repos.",
        minutes: 22,
        timers: [{ label: "Riz", seconds: 12 * 60 }, { label: "Repos du riz", seconds: 10 * 60 }],
        uses: [{ index: 0 }],
      },
      {
        text: "Épongez le tofu, enrobez-le de fécule. Dorez-le 8 minutes dans 2 c. à soupe d'huile à feu moyen-vif, en le retournant. Arrosez d'1 c. à soupe de sauce soja et réservez.",
        minutes: 8,
        timers: [{ label: "Tofu croustillant", seconds: 8 * 60 }],
        uses: [{ index: 1 }, { index: 2 }, { index: 3, part: 0.67 }, { index: 4, part: 0.33 }],
      },
      {
        text: "Dans la même poêle, faites sauter séparément, 2 à 3 minutes chacun, les carottes, la courgette et les champignons, avec un filet d'huile de sésame. Ajoutez enfin les épinards avec l'ail jusqu'à ce qu'ils tombent. Assaisonnez chaque légume avec un peu de sauce soja.",
        minutes: 10,
        timers: [{ label: "Légumes", seconds: 10 * 60 }],
        uses: [{ index: 8 }, { index: 10 }, { index: 9 }, { index: 7 }, { index: 6 }, { index: 5, part: 0.5 }, { index: 4, part: 0.67 }],
        tip: "Cuire les légumes séparément garde leurs couleurs et textures distinctes, c'est la signature du bibimbap.",
      },
      {
        text: "Sauce : mélangez le gochujang, le reste de l'huile de sésame, le sirop d'érable, le vinaigre de riz et 1 c. à soupe d'eau.",
        uses: [{ index: 12 }, { index: 5, part: 0.5 }, { index: 13 }, { index: 14 }],
        faq: [{ question: "Le gochujang est-il très piquant ?", answer: "Moyennement. Pour les enfants, réduisez-le à 1 c. à soupe et ajoutez du sirop d'érable." }],
      },
      {
        text: "Cuisez les œufs au plat dans le reste de l'huile de canola, 3 à 4 minutes. Assemblez : riz, légumes en sections, tofu, œuf au centre, sauce et sésame. Mélangez à table.",
        minutes: 4,
        timers: [{ label: "Œufs au plat", seconds: 4 * 60 }],
        uses: [{ index: 3, part: 0.33 }, { index: 11 }, { index: 15 }],
      },
    ],
    tips: ["Les légumes sautés se préparent la veille : il suffit ensuite de cuire le riz et les œufs."],
    substitutions: [
      { from: "Œufs", to: "Avocat", note: "Version végétalienne." },
      { from: "Sauce soja et gochujang", to: "Tamari et gochujang sans gluten", note: "Vérifiez l'étiquette." },
    ],
    firstTime: {
      utensils: ["Grande poêle antiadhésive", "Casserole avec couvercle", "Plusieurs petits bols pour les légumes", "Spatule"],
      prep: ["Pressez le tofu entre deux linges sous une poêle lourde 10 minutes.", "Taillez carottes et courgette en julienne (fins bâtonnets)."],
      techniques: ["Julienne : trancher finement, puis recouper les tranches en bâtonnets.", "Enrober de fécule pour un tofu croustillant."],
      doneness: [DONENESS.eggs, "Tofu : doré et croustillant sur toutes les faces."],
      safety: [SAFETY.hands, SAFETY.hotOil, SAFETY.fridge],
    },
  },
];
