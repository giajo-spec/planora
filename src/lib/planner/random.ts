/** Générateur pseudo-aléatoire déterministe (mulberry32) : même graine → même plan. */
export function createRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Identifiant court, déterministe si un RNG est fourni. */
export function makeId(rng: () => number = Math.random): string {
  return Math.floor(rng() * 0xffffffff).toString(36).padStart(7, "0");
}
