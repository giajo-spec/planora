/**
 * Couche de stockage.
 *
 * L'interface est asynchrone pour pouvoir brancher plus tard un adaptateur
 * serveur (Supabase, API maison) sans modifier l'interface utilisateur :
 *
 *   const adapter: StorageAdapter = new SupabaseStorageAdapter(client, userId);
 *
 * L'adaptateur Supabase lirait/écrirait une table `user_state (user_id, key, value jsonb)`
 * protégée par RLS. Aucune clé secrète ne doit être utilisée côté client
 * (seulement la clé « anon » publique de Supabase).
 */
export interface StorageAdapter {
  load<T>(key: string): Promise<T | null>;
  save<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
}

interface Envelope<T> {
  version: number;
  savedAt: string;
  data: T;
}

export const STORAGE_VERSION = 1;

export const STORAGE_KEYS = {
  profile: "profile",
  plan: "plan",
  grocery: "grocery",
  questionnaireDraft: "questionnaire-draft",
  fitness: "fitness",
} as const;

/** Adaptateur navigateur (localStorage), avec préfixe et version de schéma. */
export class LocalStorageAdapter implements StorageAdapter {
  constructor(
    private readonly prefix = "planora:",
    /** Ancien préfixe (avant le renommage en PLANORA) : lu une fois puis migré. */
    private readonly legacyPrefix = "projet-nutrition:",
  ) {}

  private get storage(): Storage | null {
    try {
      return typeof window !== "undefined" ? window.localStorage : null;
    } catch {
      return null; // navigation privée stricte, stockage bloqué…
    }
  }

  async load<T>(key: string): Promise<T | null> {
    let raw = this.storage?.getItem(this.prefix + key);
    if (!raw) {
      raw = this.storage?.getItem(this.legacyPrefix + key);
      if (raw) {
        this.storage?.setItem(this.prefix + key, raw);
        this.storage?.removeItem(this.legacyPrefix + key);
      }
    }
    if (!raw) return null;
    try {
      const envelope = JSON.parse(raw) as Envelope<T>;
      if (envelope.version !== STORAGE_VERSION) return null;
      return envelope.data;
    } catch {
      return null;
    }
  }

  async save<T>(key: string, value: T): Promise<void> {
    const envelope: Envelope<T> = { version: STORAGE_VERSION, savedAt: new Date().toISOString(), data: value };
    try {
      this.storage?.setItem(this.prefix + key, JSON.stringify(envelope));
    } catch {
      // Quota dépassé ou stockage indisponible : l'application continue en mémoire.
    }
  }

  async remove(key: string): Promise<void> {
    this.storage?.removeItem(this.prefix + key);
  }
}

/** Adaptateur en mémoire (tests, rendu serveur). */
export class MemoryStorageAdapter implements StorageAdapter {
  private readonly data = new Map<string, string>();

  async load<T>(key: string): Promise<T | null> {
    const raw = this.data.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  }

  async save<T>(key: string, value: T): Promise<void> {
    this.data.set(key, JSON.stringify(value));
  }

  async remove(key: string): Promise<void> {
    this.data.delete(key);
  }
}
