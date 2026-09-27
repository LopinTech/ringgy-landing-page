import type { Metadata } from "next";
import { GeneralLanding } from "@/components/landings/GeneralLanding";
import { HvacLanding } from "@/components/landings/HvacLanding";
import { LANDING_METADATA, getLandingPage } from "@/lib/landing";

export function generateMetadata(): Metadata {
  return LANDING_METADATA[getLandingPage()];
}

export default function Home() {
  return getLandingPage() === "hvac" ? <HvacLanding /> : <GeneralLanding />;
}
