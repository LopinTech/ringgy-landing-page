import type { ReactNode } from "react";
import { Logo } from "./Logo";
import { LINKEDIN_URL, TWITTER_URL } from "@/lib/site";

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
        <div className="flex items-center gap-5">
          {showPricingLink && <a href="#pricing" className="hover:text-on-dark">Pricing</a>}
          {LINKEDIN_URL && (
            <SocialLink href={LINKEDIN_URL} label="Ringgy on LinkedIn">
              <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
            </SocialLink>
          )}
          {TWITTER_URL && (
            <SocialLink href={TWITTER_URL} label="Ringgy on X (Twitter)">
              <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.63 7.58H.48l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93zm-1.29 19.5h2.04L6.48 3.24H4.3l13.31 17.41z" />
            </SocialLink>
          )}
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="transition-colors hover:text-on-dark">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        {children}
      </svg>
    </a>
  );
}
