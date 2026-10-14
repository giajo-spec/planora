import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { RecipeDetail } from "@/components/recipe/recipe-detail";
import { SIGNATURE_RECIPES, getRecipe } from "@/lib/data/recipes";

/** Seules les recettes signatures sont pré-rendues ; les 2 000 recettes composées le sont à la demande. */
export function generateStaticParams() {
  return SIGNATURE_RECIPES.map((r) => ({ id: r.id }));
}

export const dynamicParams = true;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const recipe = getRecipe(id);
  return recipe ? { title: recipe.name, description: recipe.description } : {};
}

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recipe = getRecipe(id);
  if (!recipe) notFound();
  return (
    <Suspense>
      <RecipeDetail recipeId={recipe.id} />
    </Suspense>
  );
}
