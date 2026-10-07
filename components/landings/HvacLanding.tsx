import { Navbar } from "@/components/Navbar";
import { PricingSection, PLANS, type Plan } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { HvacHero } from "@/components/hvac/HvacHero";
import { HvacProblems } from "@/components/hvac/HvacProblems";
import { HvacHowItWorks } from "@/components/hvac/HvacHowItWorks";
import { ProblemSolution } from "@/components/hvac/ProblemSolution";
import { EmergencyRules } from "@/components/hvac/EmergencyRules";
import { HvacRoi } from "@/components/hvac/HvacRoi";
import { HvacFaq } from "@/components/hvac/HvacFaq";
import { HvacCta } from "@/components/hvac/HvacCta";
import { ContactSection } from "@/components/ContactSection";

const NAV_LINKS = [
  { href: "#problems", label: "Problem" },
  { href: "#how", label: "How it works" },
  { href: "#solutions", label: "Solutions" },
  { href: "#emergencies", label: "Emergencies" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

/** Same plans as the general page, with HVAC-specific taglines and features. */
const HVAC_PLANS: Plan[] = PLANS.map((plan) => {
  switch (plan.name) {
    case "Starter":
      return { ...plan, tagline: "For owner-operators and 1–3 truck shops" };
    case "Growth":
      return {
        ...plan,
        tagline: "For multi-crew shops that get slammed in peak season",
        features: plan.features.map((f) => (f === "Human handoff to your team" ? "Emergency triage & on-call escalation" : f)),
      };
    default:
      return plan;
  }
});

export function HvacLanding() {
  return (
    <div className="overflow-x-clip">
      <Navbar links={NAV_LINKS} badge="FOR HVAC" />
      <main>
        <HvacHero />
        <HvacProblems />
        <HvacHowItWorks />
        <ProblemSolution />
        <EmergencyRules />
        <HvacRoi />
        <PricingSection
          plans={HVAC_PLANS}
          subtitle="Plans for owner-operators through multi-crew HVAC shops. Start before peak season, with no long-term commitments."
        />
        <HvacFaq />
        <HvacCta />
        <ContactSection />
      </main>
      <Footer badge="for HVAC" tagline="AI receptionist for heating & cooling companies" showPricingLink={false} />
      <ScrollReveal />
    </div>
  );
}
