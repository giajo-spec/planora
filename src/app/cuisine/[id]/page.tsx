import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CookingMode } from "@/components/cooking/cooking-mode";
import { RECIPES, getRecipe } from "@/lib/data/recipes";

export function generateStaticParams() {
  return RECIPES.map((r) => ({ id: r.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const recipe = getRecipe(id);
  return recipe ? { title: `Cuisine guidée — ${recipe.name}` } : {};
}

export default async function CookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getRecipe(id)) notFound();
  return (
    <Suspense>
      <CookingMode recipeId={id} />
    </Suspense>
  );
}
