import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { RecipeDetail } from "@/components/recipe/recipe-detail";
import { RECIPES, getRecipe } from "@/lib/data/recipes";

export function generateStaticParams() {
  return RECIPES.map((r) => ({ id: r.id }));
}

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
