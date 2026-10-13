import { NextResponse } from "next/server";

/**
 * Emplacement réservé : future implémentation IA de l'assistant de cuisine.
 *
 * Aujourd'hui, l'interface utilise `StaticCookingAssistant`
 * (src/lib/ai/cooking-assistant.ts), qui répond uniquement avec des réponses
 * prérédigées. Pour brancher un modèle de langage :
 *
 * 1. Lire la clé côté serveur uniquement : `process.env.AI_API_KEY`
 *    (définie dans les variables d'environnement de l'hébergeur, JAMAIS
 *    préfixée par NEXT_PUBLIC_ et jamais envoyée au navigateur).
 * 2. Valider la requête : { recipeId: string, stepIndex: number, question: string }.
 * 3. Construire le contexte à partir des données de la recette (étape,
 *    quantités, allergènes du profil) et imposer des garde-fous : ne jamais
 *    contredire les températures de cuisson sécuritaires, ne jamais suggérer
 *    un ingrédient allergène, ne jamais prétendre fournir une vidéo.
 * 4. Retourner { answer: string, source: "ia" }.
 * 5. Côté client, créer `RemoteCookingAssistant implements CookingAssistant`
 *    qui appelle cette route, avec repli sur `StaticCookingAssistant`.
 *
 * Prévoir aussi : limitation de débit, authentification (abonnés Premium),
 * journalisation sans données personnelles.
 */
export async function POST() {
  return NextResponse.json(
    {
      error: "not_implemented",
      message: "L'assistant IA n'est pas encore disponible. Les réponses prérédigées sont servies côté client.",
    },
    { status: 501 },
  );
}
