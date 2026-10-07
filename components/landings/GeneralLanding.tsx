import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustStrip } from "@/components/TrustStrip";
import { ProblemSection } from "@/components/ProblemSection";
import { HowItWorks } from "@/components/HowItWorks";
import { FeaturesSection } from "@/components/FeaturesSection";
import { IndustrySection } from "@/components/IndustrySection";
import { InteractiveDemo } from "@/components/InteractiveDemo";
import { DashboardSection } from "@/components/DashboardSection";
import { CustomizationSection } from "@/components/CustomizationSection";
import { HumanHandoffSection } from "@/components/HumanHandoffSection";
import { AfterHoursSection } from "@/components/AfterHoursSection";
import { RoiCalculator } from "@/components/RoiCalculator";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { IntegrationsSection } from "@/components/IntegrationsSection";
import { PricingSection } from "@/components/PricingSection";
import { FaqSection } from "@/components/FaqSection";
import { FinalCta } from "@/components/FinalCta";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";

export function GeneralLanding() {
  return (
    <div className="overflow-x-clip">
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <ProblemSection />
        <HowItWorks />
        <FeaturesSection />
        <IndustrySection />
        <InteractiveDemo />
        <DashboardSection />
        <CustomizationSection />
        <HumanHandoffSection />
        <AfterHoursSection />
        <RoiCalculator />
        <TestimonialsSection />
        <IntegrationsSection />
        <PricingSection />
        <FaqSection />
        <FinalCta />
        <ContactSection />
      </main>
      <Footer />
      <ScrollReveal />
    </div>
  );
}
