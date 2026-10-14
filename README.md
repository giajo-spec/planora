# PLANORA

Application web de planification alimentaire : 3 formules (Personnalisé, Famille, En forme),
questionnaire de profil, plan de 7 jours, **plus de 2 000 recettes** illustrées, liste d'épicerie
intelligente, cuisine guidée pas à pas et section « En forme ». Conçue **téléphone d'abord**,
en français (Québec), unités métriques.

Stack : Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 3 · Vitest.

## Démarrer

Prérequis : Node.js 20 ou plus récent (testé avec Node 22) et npm.

```bash
npm install          # installe les dépendances
npm run dev          # http://localhost:3000 (mode développement)
```

Version de production :

```bash
npm run build        # compile et pré-rend les pages
npm run start        # http://localhost:3000
```

## Version HTML autonome (un seul fichier)

```bash
npm run build:html   # produit dist/planora.html (~600 Ko)
```

Toute l'application (HTML, CSS, JavaScript, polices) dans un seul fichier, à ouvrir par double-clic
dans un navigateur, sans serveur ni connexion. Mêmes composants que la version Next.js ; la
navigation passe par l'adresse (`#/plan`, `#/recettes/poulet-tikka`…) et les données sont
sauvegardées dans le navigateur. Les photos de recettes, si présentes, doivent se trouver dans
`images/recipes/` à côté du fichier.

Sur téléphone, un fichier HTML reçu en pièce jointe s'ouvre souvent dans un aperçu qui n'exécute pas
JavaScript (écran vide). Pour tester sur mobile, utilisez un lien web : `dist/planora-web.html` est la
même application, sans les balises `<html>`/`<head>`/`<body>`, prête à être publiée chez un hébergeur
qui les ajoute (ou servez `dist/planora.html` avec `npx serve dist`).

## Vérifier

```bash
npm test             # tests unitaires (Vitest)
npm run lint         # ESLint (règles Next.js + TypeScript)
npm run typecheck    # vérification TypeScript
```

## Parcours à essayer

1. Page d'accueil `/` → **Commencer gratuitement** → questionnaire en 11 étapes
   (les réponses sont conservées si vous rechargez la page ou revenez en arrière).
2. Tableau de bord `/accueil` : repas du jour, prochain repas, objectifs, avancement.
3. Plan `/plan` : remplacer, verrouiller, portions, déplacer entre jours, ajouter une collation,
   régénérer (les repas verrouillés sont conservés). Sur ordinateur : glisser-déposer.
4. Fiche recette `/recettes/[id]` : portions ajustables (quantités et nutrition recalculées).
5. Cuisine guidée `/cuisine/[id]` : une étape à la fois, minuteries multiples, FAQ, mode débutant.
6. Épicerie `/epicerie` : cocher, ajouter/supprimer, « déjà à la maison ».

**Découvrir l'application** charge un profil de démonstration (famille de 4) sans écraser un profil existant.

## Recettes : signatures + moteur de composition

- **22 recettes signatures** écrites à la main (`src/lib/data/recipes/`).
- **Environ 1 990 recettes composées** par le moteur `src/lib/data/generator/` : bols, sautés au wok, pâtes,
  tacos et wraps, plaques au four, soupes-repas, salades-repas, frittatas et muffins aux œufs, gruaux,
  poudings de chia, smoothies, parfaits, tartines, collations et **spéciaux enfants** (pizzas tortillas,
  croquettes au four, quesadillas, mini-boulettes, crêpes banane-avoine, brochettes de fruits).
- Chaque recette composée combine des briques normalisées (protéine, féculent, légumes, saveur du monde) :
  elle hérite des allergènes et de la nutrition de ses ingrédients, ses étapes ont leurs minuteries et
  son guide « Je n'ai jamais cuisiné ça ». Les identifiants sont stables (un plan sauvegardé retrouve
  ses recettes).
- Aucune recette ni photo n'est copiée d'un site tiers (droits d'auteur, et impossibilité de garantir
  les allergènes d'un texte libre).
- Collections : Signatures, Pour les enfants, En famille, Riches en protéines, Express, Végétarien,
  Végétalien, À préparer d'avance, Avant et Après l'entraînement.

## Formules d'abonnement

`src/lib/subscriptions.ts` : **Personnalisé** (9,99 $), **Famille** (14,99 $), **En forme** (12,99 $),
tarifs indicatifs. Le paiement n'est pas activé : choisir une formule applique ses réglages recommandés
et change réellement les priorités du planificateur (recettes enfants, protéines, aliments aimés).

## Photos des recettes

Déposez des fichiers nommés selon l'identifiant de la recette dans `public/images/recipes/`
(ex. `poulet-tikka.jpg`). Le manifeste est régénéré automatiquement par `npm run dev`
et `npm run build` (ou manuellement avec `npm run images`). Sans photo, un visuel de remplacement
est affichée : une **illustration vectorielle générée** à partir des vrais ingrédients de la recette
(bol, assiette, pâtes, soupe, verre, wraps, plaque, tartines). Jamais d'image cassée. Liste des identifiants : `src/lib/data/recipes/*.ts`.

## Organisation du code

```
src/
  app/                    Pages (App Router) et route API réservée à l'IA
  components/             Interface (ui/, layout/, recipe/, plan/, cooking/, grocery/…)
  lib/
    domain/               Types et libellés français
    data/                 Ingrédients normalisés (allergènes, rayon, nutrition/100 g) et recettes
    nutrition/            Unités, portions, arrondis, nutrition (fonctions pures)
    recipes/              Allergènes, régimes, filtres du catalogue
    planner/              Générateur de plan (interface MealPlanner) et statistiques
    grocery/              Liste d'épicerie + interface PriceProvider (sans implémentation)
    ai/                   Interface CookingAssistant + implémentation statique
    storage/              StorageAdapter (localStorage aujourd'hui, Supabase demain)
    state/                Orchestration React (contexte) et persistance
```

Détails et points d'intégration futurs : [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Avertissements

- Les valeurs nutritionnelles sont des **estimations de démonstration**, non validées par une
  source officielle (p. ex. Fichier canadien sur les éléments nutritifs). Elles sont signalées
  comme telles dans l'interface.
- Les allergènes sont déduits des fiches d'ingrédients ; l'utilisateur doit toujours vérifier les
  étiquettes des produits achetés.
- Aucune authentification, aucun paiement, aucun prix d'épicerie n'est simulé.
