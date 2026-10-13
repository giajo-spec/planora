import type { Faq, Recipe } from "@/lib/domain/types";

/**
 * Assistant de cuisine guidée.
 *
 * `StaticCookingAssistant` répond uniquement à partir de réponses PRÉRÉDIGÉES
 * (par étape, par recette et générales). Une future implémentation IA appellera
 * la route serveur `/api/assistant` (voir `src/app/api/assistant/route.ts`) :
 * la clé d'API restera côté serveur, jamais dans le navigateur.
 */

export interface AssistantAnswer {
  answer: string;
  /** D'où vient la réponse : étape, recette, guide général ou aucune. */
  source: "etape" | "recette" | "general" | "aucune";
  matchedQuestion?: string;
}

export interface CookingAssistant {
  /** Questions fréquentes à proposer pour une étape. */
  suggestedQuestions(recipe: Recipe, stepIndex: number): Faq[];
  ask(recipe: Recipe, stepIndex: number, question: string): Promise<AssistantAnswer>;
}

interface GeneralFaq extends Faq {
  /** Mots qui, présents dans l'étape, rendent la question pertinente. */
  triggers: string[];
}

/** Réponses générales prérédigées (techniques de base et sécurité). */
export const GENERAL_FAQ: GeneralFaq[] = [
  {
    triggers: ["ail"],
    question: "Comment hacher l'ail rapidement ?",
    answer: "Écrasez la gousse avec le plat de la lame pour retirer la pelure, coupez le bout dur, puis tranchez finement et hachez en basculant le couteau. Une râpe fine fonctionne aussi très bien.",
  },
  {
    triggers: ["oignon"],
    question: "Comment couper un oignon sans pleurer ?",
    answer: "Utilisez un couteau bien aiguisé (il écrase moins les cellules), gardez la racine intacte jusqu'à la fin et réfrigérez l'oignon 15 minutes avant de le couper.",
  },
  {
    triggers: ["riz"],
    question: "Mon riz est collant ou pâteux, pourquoi ?",
    answer: "Rincez le riz avant la cuisson, respectez la quantité d'eau, ne soulevez pas le couvercle et laissez-le reposer 5 à 10 minutes hors du feu avant de l'égrainer à la fourchette.",
  },
  {
    triggers: ["poulet", "volaille"],
    question: "À quelle température le poulet est-il cuit ?",
    answer: "74 °C au centre de la pièce la plus épaisse, mesuré avec un thermomètre. Sans thermomètre : la chair est blanche, sans trace rosée, et le jus est clair.",
  },
  {
    triggers: ["saumon", "poisson"],
    question: "Comment savoir si le poisson est cuit ?",
    answer: "Le poisson est cuit à 70 °C : la chair devient opaque et se détache facilement en flocons à la fourchette.",
  },
  {
    triggers: ["bœuf", "boeuf"],
    question: "Quelle température pour le bœuf ?",
    answer: "Pour une pièce entière ou des lanières : 63 °C (mi-saignant) à 71 °C (à point). Le bœuf haché doit toujours atteindre 71 °C.",
  },
  {
    triggers: ["crevettes"],
    question: "Comment savoir si les crevettes sont cuites ?",
    answer: "Elles deviennent roses et opaques et forment un « C ». Un « O » bien serré signifie qu'elles sont trop cuites. Température sécuritaire : 74 °C.",
  },
  {
    triggers: ["œuf", "œufs"],
    question: "Comment éviter les morceaux de coquille ?",
    answer: "Cassez l'œuf sur une surface plane (comptoir) plutôt que sur un rebord, et dans un petit bol d'abord. Pour retirer un éclat, utilisez une demi-coquille comme cuillère.",
  },
  {
    triggers: ["mijoter", "mijotage", "frémissant"],
    question: "Que veut dire « mijoter » ?",
    answer: "Cuire à feu moyen-doux pour que seules quelques petites bulles éclatent à la surface. Si ça bout fort, baissez le feu.",
  },
  {
    triggers: ["saisir", "saisissez", "dorer", "dorez"],
    question: "Pourquoi ma viande ne dore pas ?",
    answer: "La poêle n'est pas assez chaude, la viande est humide ou la poêle est trop pleine. Épongez la viande, attendez que l'huile ondule et cuisez en plusieurs fournées.",
  },
  {
    triggers: ["four", "préchauffez", "enfournez"],
    question: "Combien de temps pour préchauffer le four ?",
    answer: "Comptez 10 à 15 minutes. La plupart des fours émettent un signal ou éteignent un voyant lorsqu'ils ont atteint la température.",
  },
  {
    triggers: ["huile", "poêle", "wok"],
    question: "Comment savoir si l'huile est assez chaude ?",
    answer: "Elle devient plus fluide et ondule à la surface. Un petit morceau d'oignon doit grésiller immédiatement. Si elle fume, retirez la poêle du feu quelques secondes.",
  },
  {
    triggers: ["épices", "cumin", "curcuma", "garam"],
    question: "Que faire si j'ai brûlé les épices ?",
    answer: "Des épices brûlées donnent de l'amertume à tout le plat. Mieux vaut essuyer la poêle et recommencer cette étape : on ne perd qu'une minute.",
  },
  {
    triggers: ["sel", "goûtez", "rectifier"],
    question: "J'ai mis trop de sel, comment rattraper ?",
    answer: "Ajoutez un peu de liquide non salé (eau, bouillon sans sel, tomates), un filet d'acidité (citron, vinaigre) ou augmentez la quantité des autres ingrédients.",
  },
];

const STOP_WORDS = new Set([
  "le", "la", "les", "de", "des", "du", "un", "une", "et", "ou", "je", "j", "mon", "ma", "mes", "est", "ce", "que", "qui",
  "quoi", "comment", "pourquoi", "faire", "a", "à", "en", "pour", "pas", "il", "elle", "on", "y", "trop", "plus", "si", "d",
  "l", "s", "c", "n", "qu", "au", "aux", "dans", "avec", "sur",
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/œ/g, "oe")
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t))
    .map((t) => (t.length > 4 && t.endsWith("s") ? t.slice(0, -1) : t));
}

function similarity(question: string, candidate: string): number {
  const q = new Set(tokenize(question));
  const c = new Set(tokenize(candidate));
  if (q.size === 0 || c.size === 0) return 0;
  let common = 0;
  q.forEach((t) => {
    if (c.has(t)) common++;
  });
  return common / Math.min(q.size, c.size);
}

function generalFaqFor(text: string): GeneralFaq[] {
  const lower = text.toLowerCase();
  return GENERAL_FAQ.filter((f) => f.triggers.some((t) => lower.includes(t)));
}

export class StaticCookingAssistant implements CookingAssistant {
  suggestedQuestions(recipe: Recipe, stepIndex: number): Faq[] {
    const step = recipe.steps[stepIndex];
    if (!step) return [];
    const own = step.faq ?? [];
    const general = generalFaqFor(step.text).slice(0, Math.max(0, 3 - own.length));
    return [...own, ...general.map(({ question, answer }) => ({ question, answer }))];
  }

  async ask(recipe: Recipe, stepIndex: number, question: string): Promise<AssistantAnswer> {
    const step = recipe.steps[stepIndex];
    const pools: Array<{ source: AssistantAnswer["source"]; items: Faq[] }> = [
      { source: "etape", items: step?.faq ?? [] },
      { source: "recette", items: recipe.steps.flatMap((s, i) => (i === stepIndex ? [] : s.faq ?? [])) },
      { source: "general", items: GENERAL_FAQ },
    ];
    let best: { score: number; faq: Faq; source: AssistantAnswer["source"] } | null = null;
    for (const pool of pools) {
      for (const faq of pool.items) {
        // Petite prime pour les réponses propres à l'étape en cours.
        const score = similarity(question, faq.question) + (pool.source === "etape" ? 0.05 : 0);
        if (!best || score > best.score) best = { score, faq, source: pool.source };
      }
    }
    if (best && best.score >= 0.5) {
      return { answer: best.faq.answer, source: best.source, matchedQuestion: best.faq.question };
    }
    return {
      answer:
        "Je n'ai pas encore de réponse prérédigée à cette question. Consultez le conseil de l'étape et le guide « Je n'ai jamais cuisiné ça ». En cas de doute sur la cuisson d'une viande ou d'un poisson, fiez-vous à un thermomètre.",
      source: "aucune",
    };
  }
}

export const cookingAssistant: CookingAssistant = new StaticCookingAssistant();
