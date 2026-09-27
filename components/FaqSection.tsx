"use client";

import { useState } from "react";
import { container, sectionPad } from "./ui";

const FAQS = [
  ["Does Ringgy sound like a real receptionist?", "Ringgy speaks in natural conversation rather than reading menu options. Callers ask questions the way they normally would and Ringgy responds in kind."],
  ["Can Ringgy book appointments?", "Yes. Ringgy checks your availability and books the appointment directly, following the working hours, slot lengths and rules you configure."],
  ["Can I train Ringgy with my business information?", "You add your services, hours, service areas, pricing notes and policies. Ringgy answers from that information."],
  ["Can Ringgy transfer calls to my team?", "Yes. You decide when a call should go to a person — on request, for complex situations, or for anything outside the rules you set."],
  ["Does Ringgy work after business hours?", "Ringgy answers 24/7, including nights, weekends and holidays, and books appointments into your next available slots."],
  ["Can I see my calls and customers?", "Every call, transcript, customer record and appointment appears in the Ringgy dashboard."],
  ["Can I use my existing business phone number?", "Yes. You can forward your current number to Ringgy and keep the number your customers already know."],
  ["What happens if Ringgy doesn’t know the answer?", "Ringgy says it will get the answer and follows your escalation process — taking a message or transferring to your team."],
  ["Can I change what Ringgy says to customers?", "You control the greeting, the phrasing, what Ringgy should never say, and when it should hand off."],
  ["How much does Ringgy cost?", "Early access pricing is set with each business during onboarding. Talk to us and we will scope it to your call volume."],
];

export function FaqSection() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className={`${container} ${sectionPad} grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-start gap-[clamp(32px,5vw,72px)]`}>
      <div data-reveal="" className="md:sticky md:top-24">
        <div className="mb-4 text-xs font-semibold uppercase tracking-[.14em] text-brand">FAQ</div>
        <h2 className="m-0 text-[clamp(30px,4vw,48px)] font-medium leading-[1.06] tracking-[-.02em]">Questions Owners Ask</h2>
      </div>
      <div data-reveal="" className="border-t border-line-2">
        {FAQS.map(([q, a], i) => {
          const isOpen = open === i;
          return (
            <div key={q} className="border-b border-line-2">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_24px] items-center gap-4 border-0 bg-transparent py-5 text-left text-[17px] font-semibold tracking-[-.01em] text-ink hover:text-brand"
              >
                {q}
                <span className="text-center text-[22px] font-normal text-faint" aria-hidden>
                  {isOpen ? "–" : "+"}
                </span>
              </button>
              {isOpen && <p className="m-0 max-w-[40em] animate-[rise_.35s_ease_both] pb-[22px] text-[15.5px] leading-[1.65] text-body">{a}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
