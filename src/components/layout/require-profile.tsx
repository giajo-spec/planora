"use client";

import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import type { MealPlan, Profile } from "@/lib/domain/types";
import { useApp } from "@/lib/state/app-store";
import { Button, ButtonLink } from "@/components/ui/button";
import { EmptyState, Skeleton } from "@/components/ui/primitives";

/** Affiche le contenu seulement quand un profil existe (sinon invite à le créer). */
export function RequireProfile({
  children,
}: {
  children: (data: { profile: Profile; plan: MealPlan | null }) => React.ReactNode;
}) {
  const { hydrated, profile, plan, startDemo } = useApp();
  const router = useRouter();

  if (!hydrated) {
    return (
      <div className="page space-y-4" aria-busy="true" aria-label="Chargement">
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-40" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="page">
        <EmptyState
          icon={<Sparkles aria-hidden className="size-7" />}
          title="Créons votre premier plan"
          action={
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/questionnaire" size="lg">
                Répondre au questionnaire
              </ButtonLink>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => {
                  startDemo();
                  router.refresh();
                }}
              >
                Essayer la démo
              </Button>
            </div>
          }
        >
          Quelques questions sur votre foyer, vos goûts et vos allergies, et votre semaine de repas est prête.
        </EmptyState>
      </div>
    );
  }

  return <>{children({ profile, plan })}</>;
}
