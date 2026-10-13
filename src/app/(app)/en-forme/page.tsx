import type { Metadata } from "next";
import { FitnessView } from "@/components/fitness/fitness-view";

export const metadata: Metadata = { title: "En forme" };

export default function FitnessPage() {
  return <FitnessView />;
}
