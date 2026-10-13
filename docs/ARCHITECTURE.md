# Architecture

## Principes

1. **Logique métier pure** (`src/lib/**`) : aucune dépendance React ni navigateur. Réutilisable
   côté serveur (API, IA) ou dans une future application React Native.
2. **Interfaces aux frontières** : `MealPlanner`, `CookingAssistant`, `PriceProvider`,
   `StorageAdapter`. Chaque intégration future = une nouvelle implémentation, sans toucher à l'UI.
3. **Données dérivées, jamais dupliquées** : la liste d'épicerie est recalculée à partir du plan ;
   seul l'état utilisateur (coches, garde-manger, suppressions, ajouts) est stocké, indexé par
   identifiant d'ingrédient. C'est ce qui permet de remplacer un repas ou de changer les portions
   sans perdre les cases cochées.
4. **Sécurité allergies non négociable** : `isRecipeAllowed` (lib/recipes/analysis.ts) est la
   seule porte d'entrée. Le planificateur ne relâche jamais les contraintes strictes (allergies,
   régime, restrictions, aliments détestés) ; seules les préférences souples (temps, équipement,
   niveau) le sont. Un repas verrouillé qui devient dangereux après l'ajout d'une allergie est
   remplacé à la régénération. Couvert par `src/lib/recipes/allergens.test.ts`.

## Flux de données

```
questionnaire ──► Profile ──► MealPlanner.generatePlan ──► MealPlan
                                   ▲                          │
                 replace / lock / move / servings (pures)     │
                                                              ▼
              RECIPES + INGREDIENTS ──► buildGroceryLines ──► GroceryView ◄── GroceryState (coches…)
```

`src/lib/state/app-store.tsx` orchestre ces fonctions et persiste `profile`, `plan`, `grocery`
et `fitness` via le `StorageAdapter`.

## Points d'intégration futurs

| Fonction | Où la brancher | Notes |
| --- | --- | --- |
| Comptes utilisateurs | Supabase Auth ; fournir l'utilisateur via un contexte | La clé « anon » publique seulement côté client |
| Sauvegarde serveur | `SupabaseStorageAdapter implements StorageAdapter`, injecté dans `<AppProvider storage={…}>` | Table `user_state(user_id, key, value jsonb)` + RLS |
| IA de planification | `RemoteMealPlanner implements MealPlanner` appelant une route serveur | Revalider le résultat avec `planViolations()` avant de l'afficher |
| IA de cuisine | `src/app/api/assistant/route.ts` (actuellement 501, documentée) + `RemoteCookingAssistant` | Clé dans les variables d'environnement serveur, repli sur `StaticCookingAssistant` |
| Abonnements | Route serveur Stripe Checkout + webhook ; champ `plan` sur l'utilisateur | Aucune clé Stripe secrète côté client |
| Prix d'épicerie | `PriceProvider` (lib/grocery/price-provider.ts) via route serveur | Ne jamais afficher un prix sans source datée |
| Recommandations selon l'historique | Journaliser `done` des `PlannedMeal` côté serveur ; ajouter un terme au score de `scoreRecipe` | |
| PWA / hors ligne | `src/app/manifest.ts` existe ; ajouter un service worker | |
| React Native | Réutiliser `src/lib/**` tel quel ; remplacer `LocalStorageAdapter` par AsyncStorage | |

## Données

- `src/lib/data/ingredients.ts` : ingrédient normalisé = allergènes, catégorie animale (pour les
  régimes), restrictions enfreintes, rayon, nutrition pour 100 g, densité (volume → masse),
  poids unitaire et pas d'arrondi (½ citron, 1 œuf).
- `src/lib/data/recipes/` : 22 recettes ; chaque étape référence les ingrédients qu'elle utilise
  (avec une fraction si l'ingrédient est réparti), ce qui alimente l'affichage « Pour cette étape »
  de la cuisine guidée. Un test vérifie que chaque ingrédient est utilisé et jamais plus qu'en totalité.
