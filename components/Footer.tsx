import { Logo } from "./Logo";
import { DEMO_PHONE_DISPLAY, DEMO_PHONE_TEL } from "@/lib/site";

type FooterProps = {
  tagline?: string;
  /** Small label after the wordmark, e.g. "for HVAC". */
  badge?: string;
  showPricingLink?: boolean;
};

export function Footer({ tagline = "AI receptionist for home-service businesses", badge, showPricingLink = true }: FooterProps) {
  return (
    <footer className="bg-ink-deep px-4 py-8 text-[#7E93AD] sm:px-7">
      <div className="mx-auto flex max-w-[1520px] flex-wrap items-center justify-between gap-4 text-[13.5px]">
        <div className="flex items-center gap-3">
          <Logo tone="dark" size={28} />
          {badge && <span className="text-[13px] font-medium text-on-dark-accent">{badge}</span>}
        </div>
        <div>{tagline}</div>
        <div className="flex gap-5">
          <a href="#faq" className="hover:text-on-dark">FAQ</a>
          {showPricingLink && <a href="#pricing" className="hover:text-on-dark">Pricing</a>}
          <a href={DEMO_PHONE_TEL} className="hover:text-on-dark">{DEMO_PHONE_DISPLAY}</a>
        </div>
      </div>
    </footer>
  );
}
