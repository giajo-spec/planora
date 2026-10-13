import { describe, expect, it } from "vitest";
import { getRecipe } from "@/lib/data/recipes";
import { StaticCookingAssistant, tokenize } from "./cooking-assistant";

const assistant = new StaticCookingAssistant();

describe("assistant de cuisine statique", () => {
  it("normalise les questions", () => {
    expect(tokenize("Comment savoir si les œufs sont cuits ?")).toEqual(["savoir", "oeuf", "sont", "cuit"]);
  });

  it("propose les questions de l'étape et des questions générales", () => {
    const recipe = getRecipe("poulet-tikka")!;
    const questions = assistant.suggestedQuestions(recipe, 4);
    expect(questions.length).toBeGreaterThan(0);
  });

  it("répond avec une réponse prérédigée", async () => {
    const recipe = getRecipe("shakshuka")!;
    const answer = await assistant.ask(recipe, 3, "comment savoir si les oeufs sont cuits");
    expect(answer.source).toBe("etape");
    expect(answer.answer).toMatch(/opaque/);
  });

  it("répond à une question générale de sécurité", async () => {
    const recipe = getRecipe("bol-burrito-poulet")!;
    const answer = await assistant.ask(recipe, 0, "À quelle température le poulet est cuit ?");
    expect(answer.answer).toMatch(/74 °C/);
  });

  it("avoue ne pas savoir plutôt que d'inventer", async () => {
    const recipe = getRecipe("shakshuka")!;
    const answer = await assistant.ask(recipe, 0, "Quel vin servir avec un dessert au chocolat ?");
    expect(answer.source).toBe("aucune");
  });
});
