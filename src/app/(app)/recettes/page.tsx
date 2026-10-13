import type { Metadata } from "next";
import { Suspense } from "react";
import { RecipeCatalog } from "@/components/recipe/recipe-catalog";

export const metadata: Metadata = { title: "Recettes" };

export default function RecipesPage() {
  return (
    <Suspense>
      <RecipeCatalog />
    </Suspense>
  );
}
