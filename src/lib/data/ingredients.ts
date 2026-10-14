import type { Ingredient } from "@/lib/domain/types";

/**
 * Catalogue normalisé des ingrédients.
 *
 * ⚠️ Valeurs nutritives : ESTIMATIONS DE DÉMONSTRATION arrondies, inspirées de
 * tables publiques. Elles doivent être validées (p. ex. Fichier canadien sur les
 * éléments nutritifs — FCÉN) avant tout usage réel.
 *
 * Les allergènes sont déclarés au niveau de l'ingrédient : c'est la source de
 * vérité utilisée par le filtrage strict des recettes.
 */
const list: Ingredient[] = [
  /* --- Fruits et légumes --- */
  { id: "oignon", name: "oignon", plural: "oignons", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7 }, gramsPerUnit: 150, countStep: 0.5 },
  { id: "oignon-rouge", name: "oignon rouge", plural: "oignons rouges", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7 }, gramsPerUnit: 150, countStep: 0.5 },
  { id: "oignon-vert", name: "oignon vert", plural: "oignons verts", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 32, protein: 1.8, carbs: 7.3, fat: 0.2, fiber: 2.6 }, gramsPerUnit: 15, countStep: 1 },
  { id: "ail", name: "gousse d'ail", plural: "gousses d'ail", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 149, protein: 6.4, carbs: 33, fat: 0.5, fiber: 2.1 }, gramsPerUnit: 5, countStep: 1 },
  { id: "gingembre", name: "gingembre frais", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 80, protein: 1.8, carbs: 18, fat: 0.8, fiber: 2 } },
  { id: "poivron-rouge", name: "poivron rouge", plural: "poivrons rouges", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 31, protein: 1, carbs: 6, fat: 0.3, fiber: 2.1 }, gramsPerUnit: 150, countStep: 0.5 },
  { id: "tomate", name: "tomate", plural: "tomates", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2 }, gramsPerUnit: 120, countStep: 0.5 },
  { id: "tomate-cerise", name: "tomates cerises", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2 } },
  { id: "concombre", name: "concombre", plural: "concombres", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 15, protein: 0.7, carbs: 3.6, fat: 0.1, fiber: 0.5 }, gramsPerUnit: 300, countStep: 0.5 },
  { id: "carotte", name: "carotte", plural: "carottes", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 41, protein: 0.9, carbs: 9.6, fat: 0.2, fiber: 2.8 }, gramsPerUnit: 70, countStep: 1 },
  { id: "celeri", name: "branche de céleri", plural: "branches de céleri", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 16, protein: 0.7, carbs: 3, fat: 0.2, fiber: 1.6 }, gramsPerUnit: 40, countStep: 1 },
  { id: "courgette", name: "courgette", plural: "courgettes", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 17, protein: 1.2, carbs: 3.1, fat: 0.3, fiber: 1 }, gramsPerUnit: 200, countStep: 0.5 },
  { id: "brocoli", name: "brocoli", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 34, protein: 2.8, carbs: 6.6, fat: 0.4, fiber: 2.6 } },
  { id: "bok-choy", name: "bok choy miniatures", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 13, protein: 1.5, carbs: 2.2, fat: 0.2, fiber: 1 } },
  { id: "epinards", name: "bébés épinards", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2 } },
  { id: "champignons", name: "champignons de Paris", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 22, protein: 3.1, carbs: 3.3, fat: 0.3, fiber: 1 } },
  { id: "laitue-romaine", name: "laitue romaine", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 17, protein: 1.2, carbs: 3.3, fat: 0.3, fiber: 2.1 } },
  { id: "chou-rouge", name: "chou rouge", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 31, protein: 1.4, carbs: 7.4, fat: 0.2, fiber: 2.1 } },
  { id: "feves-germees", name: "fèves germées", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 30, protein: 3, carbs: 6, fat: 0.2, fiber: 1.8 } },
  { id: "avocat", name: "avocat", plural: "avocats", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 160, protein: 2, carbs: 8.5, fat: 14.7, fiber: 6.7 }, gramsPerUnit: 150, countStep: 0.5 },
  { id: "lime", name: "lime", plural: "limes", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 30, protein: 0.7, carbs: 10.5, fat: 0.2, fiber: 2.8 }, gramsPerUnit: 65, countStep: 0.5 },
  { id: "citron", name: "citron", plural: "citrons", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 29, protein: 1.1, carbs: 9.3, fat: 0.3, fiber: 2.8 }, gramsPerUnit: 100, countStep: 0.5 },
  { id: "coriandre", name: "coriandre fraîche", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 23, protein: 2.1, carbs: 3.7, fat: 0.5, fiber: 2.8 } },
  { id: "persil", name: "persil frais", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 36, protein: 3, carbs: 6.3, fat: 0.8, fiber: 3.3 } },
  { id: "menthe", name: "menthe fraîche", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 70, protein: 3.8, carbs: 15, fat: 0.9, fiber: 8 } },
  { id: "basilic", name: "basilic frais", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 23, protein: 3.2, carbs: 2.7, fat: 0.6, fiber: 1.6 } },
  { id: "banane", name: "banane", plural: "bananes", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 89, protein: 1.1, carbs: 22.8, fat: 0.3, fiber: 2.6 }, gramsPerUnit: 120, countStep: 0.5 },
  { id: "pomme", name: "pomme", plural: "pommes", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4 }, gramsPerUnit: 180, countStep: 0.5 },
  { id: "jalapeno", name: "piment jalapeño", plural: "piments jalapeños", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 29, protein: 0.9, carbs: 6.5, fat: 0.4, fiber: 2.8 }, gramsPerUnit: 15, countStep: 0.5 },

  /* --- Surgelés --- */
  { id: "petits-fruits", name: "petits fruits mélangés", aisle: "surgeles", allergens: [], nutrition: { kcal: 50, protein: 0.7, carbs: 12, fat: 0.3, fiber: 2.4 } },
  { id: "edamame", name: "edamames écossés", aisle: "surgeles", allergens: ["soja"], nutrition: { kcal: 121, protein: 11.9, carbs: 8.9, fat: 5.2, fiber: 5.2 } },
  { id: "mais", name: "maïs en grains", aisle: "surgeles", allergens: [], nutrition: { kcal: 86, protein: 3.3, carbs: 19, fat: 1.4, fiber: 2 } },
  { id: "petits-pois", name: "petits pois", aisle: "surgeles", allergens: [], nutrition: { kcal: 81, protein: 5.4, carbs: 14, fat: 0.4, fiber: 5.1 } },

  /* --- Viandes --- */
  { id: "poitrine-poulet", name: "poitrine de poulet désossée", aisle: "viandes", allergens: [], animal: "viande", nutrition: { kcal: 120, protein: 22.5, carbs: 0, fat: 2.6, fiber: 0 } },
  { id: "cuisse-poulet", name: "hauts de cuisse de poulet désossés", aisle: "viandes", allergens: [], animal: "viande", nutrition: { kcal: 121, protein: 19.7, carbs: 0, fat: 4.5, fiber: 0 } },
  { id: "boeuf-surlonge", name: "surlonge de bœuf", aisle: "viandes", allergens: [], animal: "viande", nutrition: { kcal: 160, protein: 21.5, carbs: 0, fat: 8, fiber: 0 } },

  /* --- Poissons et fruits de mer --- */
  { id: "saumon", name: "filet de saumon", aisle: "poissons", allergens: ["poisson"], animal: "poisson", nutrition: { kcal: 208, protein: 20, carbs: 0, fat: 13, fiber: 0 } },
  { id: "saumon-sashimi", name: "saumon qualité sashimi", aisle: "poissons", allergens: ["poisson"], animal: "poisson", nutrition: { kcal: 208, protein: 20, carbs: 0, fat: 13, fiber: 0 } },
  { id: "crevettes", name: "crevettes crues décortiquées", aisle: "poissons", allergens: ["fruits-de-mer"], animal: "poisson", nutrition: { kcal: 85, protein: 20, carbs: 0, fat: 0.5, fiber: 0 } },

  /* --- Produits laitiers et réfrigérés --- */
  { id: "oeuf", name: "œuf", plural: "œufs", aisle: "produits-laitiers", allergens: ["oeufs"], animal: "oeuf", nutrition: { kcal: 143, protein: 12.6, carbs: 0.7, fat: 9.5, fiber: 0 }, gramsPerUnit: 50, countStep: 1 },
  { id: "yogourt-grec", name: "yogourt grec nature 0 %", aisle: "produits-laitiers", allergens: ["lait"], animal: "laitier", nutrition: { kcal: 59, protein: 10.3, carbs: 3.6, fat: 0.4, fiber: 0 }, density: 1.05 },
  { id: "lait", name: "lait 2 %", aisle: "produits-laitiers", allergens: ["lait"], animal: "laitier", nutrition: { kcal: 50, protein: 3.4, carbs: 4.8, fat: 2, fiber: 0 }, density: 1.03 },
  { id: "feta", name: "feta", aisle: "produits-laitiers", allergens: ["lait"], animal: "laitier", nutrition: { kcal: 264, protein: 14, carbs: 4, fat: 21, fiber: 0 } },
  { id: "parmesan", name: "parmesan râpé", aisle: "produits-laitiers", allergens: ["lait"], animal: "laitier", nutrition: { kcal: 392, protein: 36, carbs: 3.2, fat: 26, fiber: 0 } },
  { id: "beurre", name: "beurre non salé", aisle: "produits-laitiers", allergens: ["lait"], animal: "laitier", nutrition: { kcal: 717, protein: 0.9, carbs: 0.1, fat: 81, fiber: 0 }, density: 0.91 },
  { id: "tofu-ferme", name: "tofu extra-ferme", aisle: "produits-laitiers", allergens: ["soja"], nutrition: { kcal: 144, protein: 15.5, carbs: 3, fat: 8.5, fiber: 2 } },

  /* --- Boulangerie --- */
  { id: "tortilla-mais", name: "tortilla de maïs (15 cm)", plural: "tortillas de maïs (15 cm)", aisle: "boulangerie", allergens: [], nutrition: { kcal: 218, protein: 5.7, carbs: 44.6, fat: 2.9, fiber: 6.3 }, gramsPerUnit: 25, countStep: 1 },

  /* --- Épicerie sèche --- */
  { id: "riz-basmati", name: "riz basmati", aisle: "epicerie-seche", allergens: [], nutrition: { kcal: 360, protein: 7.5, carbs: 79, fat: 1, fiber: 1.3 } },
  { id: "riz-jasmin", name: "riz jasmin", aisle: "epicerie-seche", allergens: [], nutrition: { kcal: 365, protein: 7, carbs: 80, fat: 0.6, fiber: 1.3 } },
  { id: "riz-sushi", name: "riz à sushi", aisle: "epicerie-seche", allergens: [], nutrition: { kcal: 358, protein: 6.5, carbs: 79, fat: 0.5, fiber: 1 } },
  { id: "riz-arborio", name: "riz arborio", aisle: "epicerie-seche", allergens: [], nutrition: { kcal: 350, protein: 7, carbs: 79, fat: 0.6, fiber: 2 } },
  { id: "quinoa", name: "quinoa", aisle: "epicerie-seche", allergens: [], nutrition: { kcal: 368, protein: 14, carbs: 64, fat: 6, fiber: 7 } },
  { id: "couscous", name: "couscous de blé", aisle: "epicerie-seche", allergens: ["gluten"], nutrition: { kcal: 376, protein: 12.8, carbs: 77, fat: 0.6, fiber: 5 } },
  // L'avoine est souvent contaminée par le blé : traitée comme contenant du gluten par prudence.
  { id: "flocons-avoine", name: "flocons d'avoine", aisle: "epicerie-seche", allergens: ["gluten"], nutrition: { kcal: 379, protein: 13, carbs: 68, fat: 6.5, fiber: 10 } },
  { id: "pates-courtes", name: "petites pâtes (ditalini)", aisle: "epicerie-seche", allergens: ["gluten"], nutrition: { kcal: 371, protein: 13, carbs: 75, fat: 1.5, fiber: 3.2 } },
  { id: "nouilles-riz", name: "nouilles de riz plates", aisle: "international", allergens: [], nutrition: { kcal: 364, protein: 6, carbs: 80, fat: 0.6, fiber: 1.6 } },
  { id: "lentilles-corail", name: "lentilles corail", aisle: "epicerie-seche", allergens: [], nutrition: { kcal: 358, protein: 24, carbs: 60, fat: 2.2, fiber: 11 } },
  { id: "pois-chiches-secs", name: "pois chiches secs", aisle: "epicerie-seche", allergens: [], nutrition: { kcal: 378, protein: 20.5, carbs: 63, fat: 6, fiber: 12 } },
  { id: "dattes", name: "datte Medjool", plural: "dattes Medjool", aisle: "epicerie-seche", allergens: [], nutrition: { kcal: 277, protein: 1.8, carbs: 75, fat: 0.2, fiber: 6.7 }, gramsPerUnit: 24, countStep: 1 },
  { id: "abricots-secs", name: "abricots séchés", aisle: "epicerie-seche", allergens: ["sulfites"], nutrition: { kcal: 241, protein: 3.4, carbs: 63, fat: 0.5, fiber: 7.3 } },
  { id: "amandes", name: "amandes effilées", aisle: "epicerie-seche", allergens: ["noix"], nutrition: { kcal: 579, protein: 21, carbs: 22, fat: 50, fiber: 12.5 } },
  { id: "arachides", name: "arachides rôties non salées", aisle: "epicerie-seche", allergens: ["arachides"], nutrition: { kcal: 585, protein: 24, carbs: 21, fat: 50, fiber: 8 } },
  { id: "beurre-arachide", name: "beurre d'arachide naturel", aisle: "epicerie-seche", allergens: ["arachides"], nutrition: { kcal: 588, protein: 25, carbs: 20, fat: 50, fiber: 6 }, density: 1.05 },
  { id: "tahini", name: "tahini (beurre de sésame)", aisle: "international", allergens: ["sesame"], nutrition: { kcal: 595, protein: 17, carbs: 21, fat: 54, fiber: 9 }, density: 1.05 },
  { id: "graines-sesame", name: "graines de sésame", aisle: "epicerie-seche", allergens: ["sesame"], nutrition: { kcal: 573, protein: 17.7, carbs: 23, fat: 50, fiber: 11.8 }, density: 0.6 },
  { id: "graines-chia", name: "graines de chia", aisle: "epicerie-seche", allergens: [], nutrition: { kcal: 486, protein: 16.5, carbs: 42, fat: 31, fiber: 34 }, density: 0.65 },
  { id: "cacao", name: "cacao non sucré", aisle: "epicerie-seche", allergens: [], nutrition: { kcal: 228, protein: 19.6, carbs: 58, fat: 13.7, fiber: 37 }, density: 0.4 },
  { id: "fecule-mais", name: "fécule de maïs", aisle: "epicerie-seche", allergens: [], nutrition: { kcal: 381, protein: 0.3, carbs: 91, fat: 0.1, fiber: 0.9 }, density: 0.55 },
  { id: "cassonade", name: "cassonade", aisle: "epicerie-seche", allergens: [], nutrition: { kcal: 380, protein: 0, carbs: 98, fat: 0, fiber: 0 }, density: 0.9 },
  { id: "miel", name: "miel", aisle: "epicerie-seche", allergens: [], animal: "miel", nutrition: { kcal: 304, protein: 0.3, carbs: 82, fat: 0, fiber: 0.2 }, density: 1.42 },
  { id: "sirop-erable", name: "sirop d'érable", aisle: "epicerie-seche", allergens: [], nutrition: { kcal: 260, protein: 0, carbs: 67, fat: 0.1, fiber: 0 }, density: 1.32 },
  { id: "huile-olive", name: "huile d'olive", aisle: "epicerie-seche", allergens: [], nutrition: { kcal: 884, protein: 0, carbs: 0, fat: 100, fiber: 0 }, density: 0.92 },
  { id: "huile-vegetale", name: "huile de canola", aisle: "epicerie-seche", allergens: [], nutrition: { kcal: 884, protein: 0, carbs: 0, fat: 100, fiber: 0 }, density: 0.92 },
  { id: "vinaigre-riz", name: "vinaigre de riz", aisle: "international", allergens: [], nutrition: { kcal: 18, protein: 0, carbs: 0.5, fat: 0, fiber: 0 } },
  { id: "vin-blanc", name: "vin blanc sec", aisle: "autre", allergens: ["sulfites"], violates: ["sans-alcool"], nutrition: { kcal: 82, protein: 0.1, carbs: 2.6, fat: 0, fiber: 0 }, density: 0.99 },
  { id: "bicarbonate", name: "bicarbonate de soude", aisle: "epicerie-seche", allergens: [], nutrition: { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }, density: 1.1 },

  /* --- Conserves --- */
  { id: "tomates-broyees", name: "tomates broyées en conserve", aisle: "conserves", allergens: [], nutrition: { kcal: 32, protein: 1.6, carbs: 7, fat: 0.3, fiber: 1.9 }, density: 1.05 },
  { id: "tomates-des", name: "tomates en dés en conserve", aisle: "conserves", allergens: [], nutrition: { kcal: 21, protein: 1, carbs: 4, fat: 0.2, fiber: 1 }, density: 1.05 },
  { id: "pate-tomate", name: "pâte de tomate", aisle: "conserves", allergens: [], nutrition: { kcal: 82, protein: 4.3, carbs: 19, fat: 0.5, fiber: 4.1 }, density: 1.1 },
  { id: "lait-coco", name: "lait de coco en conserve", aisle: "conserves", allergens: [], nutrition: { kcal: 197, protein: 2, carbs: 2.8, fat: 21, fiber: 0 }, density: 1 },
  { id: "pois-chiches", name: "pois chiches en conserve, égouttés", aisle: "conserves", allergens: [], nutrition: { kcal: 139, protein: 7, carbs: 22.5, fat: 2.6, fiber: 6 } },
  { id: "haricots-noirs", name: "haricots noirs en conserve, égouttés", aisle: "conserves", allergens: [], nutrition: { kcal: 110, protein: 7, carbs: 20, fat: 0.4, fiber: 7 } },
  { id: "haricots-blancs", name: "haricots blancs en conserve, égouttés", aisle: "conserves", allergens: [], nutrition: { kcal: 114, protein: 7.5, carbs: 20, fat: 0.5, fiber: 5 } },
  { id: "olives-kalamata", name: "olives Kalamata dénoyautées", aisle: "conserves", allergens: [], nutrition: { kcal: 230, protein: 1.6, carbs: 6, fat: 22, fiber: 3.3 } },
  { id: "bouillon-legumes", name: "bouillon de légumes réduit en sodium", aisle: "conserves", allergens: [], nutrition: { kcal: 5, protein: 0.3, carbs: 0.8, fat: 0.1, fiber: 0 }, density: 1 },
  { id: "bouillon-poulet", name: "bouillon de poulet réduit en sodium", aisle: "conserves", allergens: [], animal: "viande", nutrition: { kcal: 6, protein: 0.6, carbs: 0.4, fat: 0.2, fiber: 0 }, density: 1 },

  /* --- Produits internationaux --- */
  { id: "sauce-soja", name: "sauce soja réduite en sodium", aisle: "international", allergens: ["soja", "gluten"], nutrition: { kcal: 53, protein: 8, carbs: 4.9, fat: 0.6, fiber: 0.8 }, density: 1.15 },
  { id: "sauce-poisson", name: "sauce de poisson", aisle: "international", allergens: ["poisson"], animal: "poisson", nutrition: { kcal: 35, protein: 5, carbs: 3.6, fat: 0, fiber: 0 }, density: 1.2 },
  { id: "huile-sesame", name: "huile de sésame grillé", aisle: "international", allergens: ["sesame"], nutrition: { kcal: 884, protein: 0, carbs: 0, fat: 100, fiber: 0 }, density: 0.92 },
  { id: "pate-tamarin", name: "pâte de tamarin", aisle: "international", allergens: [], nutrition: { kcal: 239, protein: 2.8, carbs: 62, fat: 0.6, fiber: 5 }, density: 1.2 },
  { id: "gochujang", name: "gochujang (pâte de piment coréenne)", aisle: "international", allergens: ["soja", "gluten"], nutrition: { kcal: 200, protein: 4, carbs: 42, fat: 1.5, fiber: 2 }, density: 1.2 },

  /* --- Épices et assaisonnements --- */
  { id: "sel", name: "sel", aisle: "epices", allergens: [], nutrition: { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 }, density: 1.2 },
  { id: "poivre", name: "poivre noir moulu", aisle: "epices", allergens: [], nutrition: { kcal: 251, protein: 10, carbs: 64, fat: 3, fiber: 25 }, density: 0.5 },
  { id: "cumin", name: "cumin moulu", aisle: "epices", allergens: [], nutrition: { kcal: 375, protein: 18, carbs: 44, fat: 22, fiber: 10.5 }, density: 0.5 },
  { id: "coriandre-moulue", name: "coriandre moulue", aisle: "epices", allergens: [], nutrition: { kcal: 298, protein: 12, carbs: 55, fat: 18, fiber: 42 }, density: 0.4 },
  { id: "curcuma", name: "curcuma moulu", aisle: "epices", allergens: [], nutrition: { kcal: 312, protein: 9.7, carbs: 67, fat: 3.3, fiber: 22.7 }, density: 0.6 },
  { id: "paprika-fume", name: "paprika fumé", aisle: "epices", allergens: [], nutrition: { kcal: 282, protein: 14, carbs: 54, fat: 13, fiber: 35 }, density: 0.45 },
  { id: "garam-masala", name: "garam masala", aisle: "epices", allergens: [], nutrition: { kcal: 380, protein: 14, carbs: 50, fat: 15, fiber: 20 }, density: 0.45 },
  { id: "assaisonnement-chili", name: "assaisonnement au chili", aisle: "epices", allergens: [], nutrition: { kcal: 282, protein: 13, carbs: 50, fat: 14, fiber: 35 }, density: 0.45 },
  { id: "piment-broye", name: "flocons de piment broyé", aisle: "epices", allergens: [], nutrition: { kcal: 318, protein: 12, carbs: 57, fat: 17, fiber: 27 }, density: 0.35 },
  { id: "origan", name: "origan séché", aisle: "epices", allergens: [], nutrition: { kcal: 265, protein: 9, carbs: 69, fat: 4.3, fiber: 42.5 }, density: 0.2 },
  { id: "cannelle", name: "cannelle moulue", aisle: "epices", allergens: [], nutrition: { kcal: 247, protein: 4, carbs: 81, fat: 1.2, fiber: 53 }, density: 0.55 },

  /* --- Ajouts pour le moteur de composition --- */
  { id: "dinde-hachee", name: "dinde hachée maigre", aisle: "viandes", allergens: [], animal: "viande", nutrition: { kcal: 150, protein: 19.7, carbs: 0, fat: 7.7, fiber: 0 } },
  { id: "boeuf-hache", name: "bœuf haché maigre", aisle: "viandes", allergens: [], animal: "viande", nutrition: { kcal: 176, protein: 20, carbs: 0, fat: 10, fiber: 0 } },
  { id: "porc-filet", name: "filet de porc", aisle: "viandes", allergens: [], animal: "viande", violates: ["sans-porc"], nutrition: { kcal: 143, protein: 21, carbs: 0, fat: 6, fiber: 0 } },
  { id: "morue", name: "filet de morue", aisle: "poissons", allergens: ["poisson"], animal: "poisson", nutrition: { kcal: 82, protein: 18, carbs: 0, fat: 0.7, fiber: 0 } },
  { id: "thon-conserve", name: "thon pâle en conserve, égoutté", aisle: "conserves", allergens: ["poisson"], animal: "poisson", nutrition: { kcal: 116, protein: 25.5, carbs: 0, fat: 0.8, fiber: 0 } },
  { id: "tempeh", name: "tempeh", aisle: "produits-laitiers", allergens: ["soja"], nutrition: { kcal: 192, protein: 20, carbs: 7.6, fat: 11, fiber: 5 } },
  { id: "lentilles-conserve", name: "lentilles en conserve, égouttées", aisle: "conserves", allergens: [], nutrition: { kcal: 116, protein: 9, carbs: 20, fat: 0.4, fiber: 8 } },
  { id: "cheddar", name: "cheddar râpé", aisle: "produits-laitiers", allergens: ["lait"], animal: "laitier", nutrition: { kcal: 403, protein: 25, carbs: 1.3, fat: 33, fiber: 0 } },
  { id: "mozzarella", name: "mozzarella partiellement écrémée râpée", aisle: "produits-laitiers", allergens: ["lait"], animal: "laitier", nutrition: { kcal: 280, protein: 28, carbs: 3, fat: 17, fiber: 0 } },
  { id: "cottage", name: "fromage cottage 2 %", aisle: "produits-laitiers", allergens: ["lait"], animal: "laitier", nutrition: { kcal: 90, protein: 11, carbs: 3.4, fat: 2.3, fiber: 0 } },
  { id: "boisson-soya", name: "boisson de soya non sucrée", aisle: "produits-laitiers", allergens: ["soja"], nutrition: { kcal: 33, protein: 2.9, carbs: 1.2, fat: 1.8, fiber: 0.5 }, density: 1.03 },
  { id: "riz-brun", name: "riz brun", aisle: "epicerie-seche", allergens: [], nutrition: { kcal: 362, protein: 7.5, carbs: 76, fat: 2.7, fiber: 3.4 } },
  { id: "penne", name: "penne", aisle: "epicerie-seche", allergens: ["gluten"], nutrition: { kcal: 371, protein: 13, carbs: 75, fat: 1.5, fiber: 3.2 } },
  { id: "spaghetti", name: "spaghetti", aisle: "epicerie-seche", allergens: ["gluten"], nutrition: { kcal: 371, protein: 13, carbs: 75, fat: 1.5, fiber: 3.2 } },
  { id: "tortilla-ble", name: "grande tortilla de blé (25 cm)", plural: "grandes tortillas de blé (25 cm)", aisle: "boulangerie", allergens: ["gluten"], nutrition: { kcal: 300, protein: 8, carbs: 50, fat: 7, fiber: 3 }, gramsPerUnit: 60, countStep: 1 },
  { id: "pain-ble-entier", name: "tranche de pain de blé entier", plural: "tranches de pain de blé entier", aisle: "boulangerie", allergens: ["gluten"], nutrition: { kcal: 250, protein: 12, carbs: 41, fat: 3.5, fiber: 7 }, gramsPerUnit: 40, countStep: 1 },
  { id: "panko", name: "chapelure panko", aisle: "epicerie-seche", allergens: ["gluten"], nutrition: { kcal: 395, protein: 12, carbs: 75, fat: 4, fiber: 3 }, density: 0.25 },
  { id: "pomme-de-terre", name: "pommes de terre grelots", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 77, protein: 2, carbs: 17, fat: 0.1, fiber: 2.2 } },
  { id: "patate-douce", name: "patate douce", plural: "patates douces", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3 }, gramsPerUnit: 300, countStep: 0.5 },
  { id: "chou-fleur", name: "chou-fleur", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 25, protein: 1.9, carbs: 5, fat: 0.3, fiber: 2 } },
  { id: "haricots-verts", name: "haricots verts", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 31, protein: 1.8, carbs: 7, fat: 0.2, fiber: 2.7 } },
  { id: "pois-mange-tout", name: "pois mange-tout", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 42, protein: 2.8, carbs: 7.5, fat: 0.2, fiber: 2.6 } },
  { id: "chou-kale", name: "chou kale", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 49, protein: 4.3, carbs: 9, fat: 0.9, fiber: 3.6 } },
  { id: "roquette", name: "roquette", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 25, protein: 2.6, carbs: 3.7, fat: 0.7, fiber: 1.6 } },
  { id: "asperges", name: "asperges", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 20, protein: 2.2, carbs: 3.9, fat: 0.1, fiber: 2.1 } },
  { id: "mangue", name: "mangue", plural: "mangues", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 60, protein: 0.8, carbs: 15, fat: 0.4, fiber: 1.6 }, gramsPerUnit: 200, countStep: 0.5 },
  { id: "fraises", name: "fraises", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 32, protein: 0.7, carbs: 7.7, fat: 0.3, fiber: 2 } },
  { id: "bleuets", name: "bleuets", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 57, protein: 0.7, carbs: 14.5, fat: 0.3, fiber: 2.4 } },
  { id: "ananas", name: "ananas en morceaux", aisle: "fruits-legumes", allergens: [], nutrition: { kcal: 50, protein: 0.5, carbs: 13, fat: 0.1, fiber: 1.4 } },
  { id: "moutarde-dijon", name: "moutarde de Dijon", aisle: "epices", allergens: ["moutarde"], nutrition: { kcal: 66, protein: 4, carbs: 5, fat: 4, fiber: 3 }, density: 1.05 },
  { id: "pesto", name: "pesto au basilic", aisle: "international", allergens: ["lait", "noix"], animal: "laitier", nutrition: { kcal: 450, protein: 5, carbs: 6, fat: 45, fiber: 1 }, density: 1.05 },
  { id: "passata", name: "coulis de tomates (passata)", aisle: "conserves", allergens: [], nutrition: { kcal: 30, protein: 1.4, carbs: 6, fat: 0.2, fiber: 1.5 }, density: 1.03 },
  { id: "salsa", name: "salsa douce", aisle: "international", allergens: [], nutrition: { kcal: 36, protein: 1.5, carbs: 7, fat: 0.2, fiber: 1.9 }, density: 1.05 },
  { id: "vinaigre-balsamique", name: "vinaigre balsamique", aisle: "epicerie-seche", allergens: ["sulfites"], nutrition: { kcal: 88, protein: 0.5, carbs: 17, fat: 0, fiber: 0 }, density: 1.06 },
  { id: "curry-poudre", name: "poudre de cari douce", aisle: "epices", allergens: [], nutrition: { kcal: 325, protein: 14, carbs: 58, fat: 14, fiber: 53 }, density: 0.45 },
  { id: "herbes-provence", name: "herbes de Provence", aisle: "epices", allergens: [], nutrition: { kcal: 260, protein: 9, carbs: 60, fat: 6, fiber: 37 }, density: 0.2 },
  { id: "pain-burger", name: "pain à hamburger de blé", plural: "pains à hamburger de blé", aisle: "boulangerie", allergens: ["gluten"], nutrition: { kcal: 270, protein: 9, carbs: 49, fat: 4, fiber: 2.5 }, gramsPerUnit: 60, countStep: 1 },
];

export const INGREDIENTS: Record<string, Ingredient> = Object.fromEntries(
  list.map((ingredient) => [ingredient.id, ingredient]),
);

export const INGREDIENT_LIST: readonly Ingredient[] = list;

export function getIngredient(id: string): Ingredient {
  const ingredient = INGREDIENTS[id];
  if (!ingredient) throw new Error(`Ingrédient inconnu : ${id}`);
  return ingredient;
}
