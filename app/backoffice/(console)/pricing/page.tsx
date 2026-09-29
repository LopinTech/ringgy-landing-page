import type { Metadata } from "next";
import { PricingView } from "./PricingView";

export const metadata: Metadata = { title: "Pricing" };

export default function PricingPage() {
  return <PricingView />;
}
