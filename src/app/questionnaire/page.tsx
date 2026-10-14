import type { Metadata } from "next";
import { Suspense } from "react";
import { Questionnaire } from "@/components/questionnaire/questionnaire";

export const metadata: Metadata = { title: "Mon profil alimentaire" };

export default function QuestionnairePage() {
  return (
    <Suspense>
      <Questionnaire />
    </Suspense>
  );
}
