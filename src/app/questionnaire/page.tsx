import type { Metadata } from "next";
import { Questionnaire } from "@/components/questionnaire/questionnaire";

export const metadata: Metadata = { title: "Mon profil alimentaire" };

export default function QuestionnairePage() {
  return <Questionnaire />;
}
