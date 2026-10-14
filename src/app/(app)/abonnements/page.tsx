import type { Metadata } from "next";
import { PricingView } from "@/components/pricing/pricing-view";

export const metadata: Metadata = { title: "Formules" };

export default function PricingPage() {
  return <PricingView />;
}
