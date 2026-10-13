"use client";

import { useRouter } from "next/navigation";
import { Button, type ButtonStyleProps } from "@/components/ui/button";
import { useApp } from "@/lib/state/app-store";

/**
 * « Découvrir l'application » : ouvre le tableau de bord avec un profil de
 * démonstration — sans jamais écraser un profil existant.
 */
export function DemoButton({ children, ...style }: ButtonStyleProps & { children: React.ReactNode }) {
  const { hydrated, profile, startDemo } = useApp();
  const router = useRouter();
  return (
    <Button
      {...style}
      disabled={!hydrated}
      onClick={() => {
        if (!profile) startDemo();
        router.push("/accueil");
      }}
    >
      {children}
    </Button>
  );
}

export function ResumeLink() {
  const { hydrated, profile } = useApp();
  const router = useRouter();
  if (!hydrated || !profile) return null;
  return (
    <Button variant="dark" size="sm" onClick={() => router.push("/accueil")}>
      Ouvrir mon plan
    </Button>
  );
}
