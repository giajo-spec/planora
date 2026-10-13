# PLANORA

Application web de planification alimentaire : questionnaire de profil, plan de 7 jours,
catalogue de recettes internationales, liste d'épicerie intelligente, cuisine guidée pas à pas
et section « En forme ». Conçue **téléphone d'abord**, en français (Québec), unités métriques.

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

## Photos des recettes

Déposez des fichiers nommés selon l'identifiant de la recette dans `public/images/recipes/`
(ex. `poulet-tikka.jpg`). Le manifeste est régénéré automatiquement par `npm run dev`
et `npm run build` (ou manuellement avec `npm run images`). Sans photo, un visuel de remplacement
est affiché — jamais d'image cassée. Liste des identifiants : `src/lib/data/recipes/*.ts`.

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
