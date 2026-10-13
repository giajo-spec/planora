import type { GroceryLine } from "@/lib/domain/types";

/**
 * Point d'intégration FUTUR pour les prix et disponibilités des commerces locaux.
 *
 * Aucune implémentation réelle n'est fournie : l'application n'invente ni prix
 * ni connexion aux épiceries. Une implémentation future (API d'un détaillant,
 * circulaires, données ouvertes) vivra CÔTÉ SERVEUR, par exemple dans
 * `src/app/api/prices/route.ts`, avec les clés dans les variables
 * d'environnement du serveur — jamais dans le code client.
 */
export interface Store {
  id: string;
  name: string;
  postalCode?: string;
}

export interface PriceQuote {
  ingredientId: string;
  storeId: string;
  /** Prix en cents CAD pour le format proposé. */
  priceCents: number;
  packageDescription: string;
  inStock: boolean;
  /** Date de la donnée (ISO) — un prix sans source datée ne doit pas être affiché. */
  observedAt: string;
}

export interface PriceProvider {
  readonly available: boolean;
  listStores(postalCode: string): Promise<Store[]>;
  getQuotes(lines: GroceryLine[], storeId: string): Promise<PriceQuote[]>;
}

/** Implémentation par défaut : aucun fournisseur branché. */
export const noPriceProvider: PriceProvider = {
  available: false,
  async listStores() {
    return [];
  },
  async getQuotes() {
    return [];
  },
};
