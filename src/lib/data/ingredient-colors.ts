import type { Aisle } from "@/lib/domain/types";

/** Couleurs appétissantes (et accordées à la palette PLANORA) pour les illustrations générées. */
export const INGREDIENT_COLORS: Record<string, string> = {
  "riz-basmati": "#F3EBDD", "riz-jasmin": "#F4EDE0", "riz-sushi": "#F5EFE3", "riz-arborio": "#F1E7D2", "riz-brun": "#CDA978",
  quinoa: "#E6D3A8", couscous: "#E8CF8E", "nouilles-riz": "#F1E6CC", "pates-courtes": "#E9C77B", penne: "#E9C77B", spaghetti: "#EBCB80",
  "pain-ble-entier": "#C08A4E", "tortilla-ble": "#E8CFA0", "tortilla-mais": "#E3B85F", "flocons-avoine": "#E3CFA2", panko: "#DDB26E",
  "poitrine-poulet": "#DDAE72", "cuisse-poulet": "#C98A55", "dinde-hachee": "#B9825A", "boeuf-surlonge": "#8C4A36", "boeuf-hache": "#7A4330",
  "porc-filet": "#D69C72", saumon: "#EE8A62", "saumon-sashimi": "#F2876B", morue: "#F1EADC", crevettes: "#F2A07B", "thon-conserve": "#D7B59A",
  "tofu-ferme": "#E9CD94", tempeh: "#C8A46A", "pois-chiches": "#E3B964", "haricots-noirs": "#3A2E35", "haricots-blancs": "#EFE6D2",
  "lentilles-conserve": "#8A6B45", "lentilles-corail": "#E58A4E", "pois-chiches-secs": "#D9AE5A", oeuf: "#F2B53C", edamame: "#7DAA4E",
  brocoli: "#5E8C4A", carotte: "#E8853A", "bok-choy": "#8DB86B", champignons: "#B79B7E", "pois-mange-tout": "#7FB45A", "poivron-rouge": "#D4473A",
  "chou-rouge": "#7B3F6E", concombre: "#9CC48A", "tomate-cerise": "#D9483B", tomate: "#D9483B", "oignon-rouge": "#A8507A", courgette: "#7FA35B",
  mais: "#F2C94C", "laitue-romaine": "#8FBF6A", avocat: "#A7C26A", epinards: "#3F6E3A", "chou-fleur": "#EFE8D6", "patate-douce": "#E58A3A",
  "petits-pois": "#7DB04B", "chou-kale": "#4E7A45", pomme: "#E4C978", "haricots-verts": "#6C9A4B", asperges: "#7E9E55", roquette: "#6E9450",
  "pomme-de-terre": "#E2C27D", celeri: "#B6CC8A", oignon: "#EADBC0", "feves-germees": "#F1ECD6", fraises: "#D9434E", bleuets: "#4B5A9A",
  "petits-fruits": "#7A2F4F", banane: "#F2D66B", mangue: "#F2A93B", ananas: "#F3CF55", dattes: "#6E3B24", "abricots-secs": "#E8913A",
  "sauce-soja": "#4A2C1E", gochujang: "#B23A2A", "beurre-arachide": "#B9814B", tahini: "#D9BE8C", "yogourt-grec": "#FBF8F1", feta: "#FAF6EC",
  parmesan: "#EED9A0", cheddar: "#F0A93B", mozzarella: "#F8F3E6", cottage: "#FAF6EE", pesto: "#6B8E3A", passata: "#C8412F",
  "tomates-broyees": "#C8412F", "tomates-des": "#CC4A35", "lait-coco": "#F6F0E4", lait: "#FBF9F4", "boisson-soya": "#F4EEDF",
  "graines-sesame": "#EBDDB8", arachides: "#C99A5B", amandes: "#E3C796", coriandre: "#4F8A3C", persil: "#4F8A3C", basilic: "#3F7A34",
  menthe: "#5C9A4A", "oignon-vert": "#6FA34E", lime: "#A9C94E", citron: "#F3DB5A", cacao: "#5A3825", "sirop-erable": "#B5651D",
  miel: "#E0A526", "olives-kalamata": "#4E3B4C", "graines-chia": "#3C3A38", salsa: "#C9452F", "bouillon-legumes": "#D9A55A",
  "bouillon-poulet": "#E0B060", "curry-poudre": "#D99A2B", curcuma: "#E2A21F", "garam-masala": "#9A5A2A",
};

const AISLE_FALLBACK: Record<Aisle, string> = {
  "fruits-legumes": "#7FA35B",
  viandes: "#C98A55",
  poissons: "#EE8A62",
  "produits-laitiers": "#F6F0E4",
  boulangerie: "#D9AE6A",
  "epicerie-seche": "#E3CFA2",
  conserves: "#C8412F",
  epices: "#B5651D",
  international: "#8A5A3A",
  surgeles: "#9CC48A",
  autre: "#C6A46C",
};

export function ingredientColor(id: string, aisle: Aisle): string {
  return INGREDIENT_COLORS[id] ?? AISLE_FALLBACK[aisle];
}
