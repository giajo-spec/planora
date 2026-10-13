import Link from "next/link";
import type { Recipe } from "@/lib/domain/types";
import { cn } from "@/lib/utils/cn";
import { RecipeImage } from "./recipe-image";
import { RecipeBadges, RecipeQuickFacts } from "./recipe-meta";

export function RecipeCard({ recipe, className, warning }: { recipe: Recipe; className?: string; warning?: string }) {
  return (
    <Link
      href={`/recettes/${recipe.id}`}
      className={cn(
        "group card flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:border-ink hover:shadow-pop-lg",
        className,
      )}
    >
      <RecipeImage recipe={recipe} className="aspect-[4/3] w-full" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <RecipeBadges recipe={recipe} max={2} />
        <h3 className="text-lg font-extrabold leading-tight group-hover:underline group-hover:decoration-lime group-hover:decoration-4 group-hover:underline-offset-4">
          {recipe.name}
        </h3>
        {warning && <p className="text-sm font-semibold text-tomato-deep">{warning}</p>}
        <div className="mt-auto">
          <RecipeQuickFacts recipe={recipe} />
        </div>
      </div>
    </Link>
  );
}
