import type { Metadata } from "next";

/**
 * Which landing page is served at `/`, chosen by the LANDING_PAGE env var.
 *
 *   LANDING_PAGE=general  (default) home-services page
 *   LANDING_PAGE=hvac     HVAC-specific page
 *
 * The root page is statically prerendered, so the value is read at build
 * time: change it, then rebuild (or restart `next dev`).
 */
export const LANDING_PAGES = ["general", "hvac"] as const;
export type LandingPageKey = (typeof LANDING_PAGES)[number];

export function getLandingPage(): LandingPageKey {
  const raw = process.env.LANDING_PAGE?.trim().toLowerCase();
  if (!raw) return "general";
  if ((LANDING_PAGES as readonly string[]).includes(raw)) return raw as LandingPageKey;
  throw new Error(`Invalid LANDING_PAGE="${process.env.LANDING_PAGE}". Expected one of: ${LANDING_PAGES.join(", ")}.`);
}

export const LANDING_METADATA: Record<LandingPageKey, Metadata> = {
  general: {
    title: "Ringgy — 24/7 AI Receptionist for Home Service Businesses",
    description:
      "Ringgy answers your calls 24/7, talks to customers naturally, answers questions, qualifies leads, and books appointments — so you never miss another opportunity.",
    openGraph: {
      title: "Ringgy — Your AI Receptionist for Every Customer Call",
      description: "Answers calls 24/7, talks naturally, qualifies leads, and books appointments for home service contractors.",
      images: ["/assets/how-ringgy-works.png"],
    },
  },
  hvac: {
    title: "Ringgy for HVAC — AI Receptionist for Heating & Cooling Companies",
    description:
      "Ringgy answers every heating and cooling call 24/7, sorts emergencies from routine work, and books jobs into your schedule while your techs stay on the job.",
    keywords: ["HVAC answering service", "HVAC AI receptionist", "HVAC call answering", "heating and cooling answering service", "HVAC after-hours calls"],
    openGraph: {
      title: "Ringgy for HVAC — Be Ready Before the Next Heat Wave",
      description: "24/7 AI call answering, emergency triage and tune-up booking for HVAC companies.",
      images: ["/assets/ind-hvac.png"],
    },
  },
};
