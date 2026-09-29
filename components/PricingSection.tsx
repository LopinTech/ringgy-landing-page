import type { ReactNode } from "react";
import {
   ArrowRightIcon,
   BarsChartIcon,
   CheckIcon,
   PHONE_PATH,
   container,
   sectionPad,
} from "./ui";
import { withLivePlans } from "@/lib/live-plans";

export type Plan = {
   name: string;
   tagline: string;
   price: string;
   period?: string;
   features: string[];
   cta: string;
   accent: string;
   tint: string;
   featured?: boolean;
   icon: ReactNode;
};

export const PLANS: Plan[] = [
   {
      name: "Starter",
      tagline: "For single-truck and small teams",
      price: "$49",
      period: "/month",
      features: [
         "AI call answering (24/7)",
         "Call handling & routing",
         "Customer capture & CRM",
         "Appointment booking",
         "Business knowledge base",
         "Basic dashboard & analytics",
      ],
      cta: "Get Started",
      accent: "#1F6FEB",
      tint: "#E3EDFC",
      icon: (
         <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#1F6FEB"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            aria-hidden>
            <path d="M14 4c3-1.5 5.5-1.5 6-1 .5.5.5 3-1 6l-6 6-5-5z" />
            <circle cx="15.5" cy="8.5" r="1.6" />
            <path d="M8 10l-3.5.5L3 13l4 1M14 16l-.5 3.5L11 21l-1-4M6.5 17.5L4 20" />
         </svg>
      ),
   },
   {
      name: "Growth",
      tagline: "For busy multi-crew operations",
      price: "$149",
      period: "/month",
      features: [
         "Everything in Starter",
         "More call minutes",
         "SMS confirmations & reminders",
         "Advanced AI settings",
         "Human handoff to your team",
         "Priority support",
      ],
      cta: "Get Started",
      accent: "#1F6FEB",
      tint: "#DCE8FB",
      featured: true,
      icon: <BarsChartIcon className="text-primary" />,
   },
   {
      name: "Custom",
      tagline: "For larger businesses & multi-locations",
      price: "Let’s talk",
      features: [
         "Everything in Growth",
         "Multiple locations",
         "Custom call flows & escalation rules",
         "Integrations (CRM, SMS, Calendar, etc.)",
         "Dedicated onboarding assistance",
         "Priority & dedicated support",
      ],
      cta: "Contact Sales",
      accent: "#7C5CE6",
      tint: "#ECE6FC",
      icon: (
         <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#7C5CE6"
            strokeWidth="2"
            strokeLinejoin="round"
            aria-hidden>
            <rect x="4" y="3" width="11" height="18" rx="1" />
            <path d="M15 9h5v12h-5" />
            <path
               d="M7.5 7h1M11 7h1M7.5 11h1M11 11h1M7.5 15h1M11 15h1M9 21v-3h1.5v3"
               strokeLinecap="round"
            />
         </svg>
      ),
   },
];

const INCLUDED = [
   { top: "24/7", bottom: "AI answering", icon: <path d={PHONE_PATH} /> },
   {
      top: "Appointment",
      bottom: "booking",
      icon: (
         <>
            <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
            <path d="M3.5 10h17M8 3v4M16 3v4" />
         </>
      ),
   },
   {
      top: "Business",
      bottom: "knowledge",
      icon: (
         <path d="M2.5 6c3-1 6-.7 9.5 1.3V20c-3.5-2-6.5-2.3-9.5-1.3zM21.5 6c-3-1-6-.7-9.5 1.3V20c3.5-2 6.5-2.3 9.5-1.3z" />
      ),
   },
   {
      top: "Human",
      bottom: "handoff",
      icon: (
         <>
            <circle cx="10" cy="8" r="3.5" />
            <path d="M3.5 20c0-3.6 2.9-6 6.5-6 1.5 0 2.8.4 3.9 1.1M17 14v6M14 17h6" />
         </>
      ),
   },
];

function PlanCard({ plan }: { plan: Plan }) {
   const f = plan.featured;
   return (
      <div
         data-reveal=""
         className={`relative flex flex-col rounded-[18px] px-[clamp(22px,2.4vw,38px)] ${
            f ?
               "z-[1] border-[1.5px] border-[#9CC0F2] bg-[linear-gradient(180deg,#F3F7FE,#FFFFFF)] pb-[38px] pt-[34px] shadow-[0_30px_60px_-30px_rgba(21,87,176,.4)] lg:-my-2"
            :  "border border-line bg-white pb-[34px] pt-[30px] shadow-[0_14px_34px_-28px_rgba(15,37,64,.3)]"
         }`}>
         {f && (
            <div className="absolute right-7 top-[22px] flex items-center gap-2 rounded-full bg-primary px-4 py-[7px] text-[13px] font-medium uppercase tracking-[.06em] text-white">
               <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="#fff"
                  aria-hidden>
                  <path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z" />
               </svg>
               Most popular
            </div>
         )}
         <div
            className="mb-5 flex h-[62px] w-[62px] items-center justify-center rounded-[14px]"
            style={{ background: plan.tint }}>
            {plan.icon}
         </div>
         <div className="mb-1 text-[26px] font-bold text-ink">{plan.name}</div>
         <div className="mb-[22px] text-[17px] text-muted">{plan.tagline}</div>
         <div className="flex min-h-[58px] items-baseline gap-3">
            <span
               className={`${plan.period ? "text-[46px]" : "text-[40px]"} font-bold leading-[1.1] tracking-[-.02em] text-ink`}>
               {plan.price}
            </span>
            {plan.period && (
               <span className="text-xl text-subtle">{plan.period}</span>
            )}
         </div>
         <div className="mb-6 mt-[22px] h-px bg-line" />
         <ul className="m-0 mb-[30px] flex list-none flex-col gap-[13px] p-0">
            {plan.features.map((feat) => (
               <li
                  key={feat}
                  className="flex items-center gap-4 text-[17px] text-text-2">
                  <span
                     className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full"
                     style={{ background: plan.tint, color: plan.accent }}>
                     <CheckIcon />
                  </span>
                  {feat}
               </li>
            ))}
         </ul>
         <a
            href="#cta"
            className={`mt-auto flex items-center justify-center gap-2.5 rounded-lg text-[17px] font-medium transition-colors ${
               f ?
                  "bg-primary py-[17px] text-white shadow-[0_12px_24px_-12px_rgba(31,111,235,.7)] hover:bg-brand"
               : plan.accent === "#7C5CE6" ?
                  "border-[1.5px] border-[#7C5CE6] py-[15px] text-[#7C5CE6] hover:bg-[#F5F1FE]"
               :  "border-[1.5px] border-primary py-[15px] text-primary hover:bg-tint-2"
            }`}>
            {plan.cta}
            <ArrowRightIcon size={18} />
         </a>
      </div>
   );
}

const DEFAULT_SUBTITLE =
   "Start small and scale as your business grows. Get all the essential features with transparent pricing and no long-term commitments.";

export async function PricingSection({
   plans = PLANS,
   subtitle = DEFAULT_SUBTITLE,
}: {
   plans?: Plan[];
   subtitle?: string;
}) {
   const livePlans = await withLivePlans(plans);
   return (
      <section
         id="pricing"
         className="relative overflow-hidden border-y border-line bg-surface">
         <div className="pointer-events-none absolute -left-[220px] top-[180px] h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,#E6EFFC,rgba(230,239,252,0)_70%)]" />
         <div className="pointer-events-none absolute -right-[220px] top-[120px] h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,#E6EFFC,rgba(230,239,252,0)_70%)]" />
         <div className={`${container} ${sectionPad} relative`}>
            <div data-reveal="" className="mx-auto max-w-[44em] text-center">
               <div className="mb-[22px] inline-block rounded-full bg-tint px-[22px] py-[9px] text-[15px] font-bold uppercase tracking-[.1em] text-brand">
                  Pricing
               </div>
               <h2 className="mb-[22px] text-[clamp(36px,4.6vw,62px)] font-bold leading-[1.1] tracking-[-.025em] text-ink [text-wrap:balance]">
                  Simple Pricing. No{" "}
                  <span className="text-primary">Complicated Contracts.</span>
               </h2>
               <p className="mx-auto max-w-[34em] text-[clamp(17px,1.5vw,20px)] leading-[1.6] text-body">
                  {subtitle}
               </p>
            </div>
            <div className="mt-[52px] grid grid-cols-[repeat(auto-fit,minmax(min(100%,255px),1fr))] items-stretch gap-5">
               {livePlans.map((p) => (
                  <PlanCard key={p.name} plan={p} />
               ))}
            </div>
            <div
               data-reveal=""
               className="mt-[26px] flex flex-wrap items-center gap-x-10 gap-y-[22px] rounded-[18px] border border-line bg-white px-[clamp(22px,2.4vw,38px)] py-6 shadow-[0_14px_34px_-28px_rgba(15,37,64,.3)]">
               <div className="flex-[0_1_auto] md:border-r md:border-line md:pr-9">
                  <div className="mb-1.5 text-[13px] font-medium uppercase tracking-[.08em] text-muted">
                     Every plan includes
                  </div>
                  <div className="text-2xl font-bold text-ink">
                     The core Ringgy experience
                  </div>
               </div>
               <div className="grid min-w-0 flex-[1_1_520px] grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-x-5 gap-y-[18px]">
                  {INCLUDED.map((it) => (
                     <IncludedItem key={it.top} top={it.top} bottom={it.bottom}>
                        <svg
                           width="22"
                           height="22"
                           viewBox="0 0 24 24"
                           fill="none"
                           stroke="currentColor"
                           strokeWidth="2"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           aria-hidden>
                           {it.icon}
                        </svg>
                     </IncludedItem>
                  ))}
                  <IncludedItem top="Call history" bottom="& analytics">
                     <BarsChartIcon size={22} />
                  </IncludedItem>
               </div>
            </div>
         </div>
      </section>
   );
}

function IncludedItem({
   top,
   bottom,
   children,
}: {
   top: string;
   bottom: string;
   children: ReactNode;
}) {
   return (
      <div className="flex items-center gap-4">
         <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-tint-2 text-primary">
            {children}
         </span>
         <div className="text-[14.5px] leading-[1.35]">
            <div className="font-medium text-ink">{top}</div>
            <div className="text-subtle">{bottom}</div>
         </div>
      </div>
   );
}
