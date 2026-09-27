"use client";

import { useState } from "react";
import { Eyebrow, container, sectionPad } from "../ui";

const FAQS = [
  [
    "Can Ringgy tell an emergency from a routine call?",
    "Yes. You define what counts as urgent, such as no heat below a set temperature, a household with elderly people or infants, or a gas smell. Ringgy asks the right questions and follows the rule you set for each case.",
  ],
  [
    "Will Ringgy know which brands and systems we service?",
    "You list the brands, system types and services you cover. Ringgy answers from that list and tells callers politely when something is outside what you do.",
  ],
  ["Can Ringgy book tune-ups and explain our maintenance plan?", "Yes. Ringgy books tune-ups into the time slots you choose and explains your plan using the details you provide."],
  ["What happens during a heat wave when calls spike?", "Ringgy keeps answering when your office line is busy, so callers don’t hit voicemail or a long hold."],
  ["Will Ringgy quote repair prices?", "Only the prices you give it, like your diagnostic fee or tune-up price. It won’t guess at repair costs."],
  ["Can I keep my current business number?", "Yes. Forward your existing number to Ringgy, or only forward calls when your team is busy or after hours."],
];

export function HvacFaq() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="bg-white">
      <div className={`${container} ${sectionPad} grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-start gap-[clamp(32px,5vw,80px)]`}>
        <div data-reveal="">
          <Eyebrow>FAQ</Eyebrow>
          <h2 className="m-0 text-[clamp(34px,4.2vw,56px)] font-bold leading-[1.1] tracking-[-.025em] text-ink">Questions HVAC Owners Ask</h2>
        </div>
        <div data-reveal="" className="border-t border-line">
          {FAQS.map(([q, a], i) => {
            const isOpen = open === i;
            return (
              <div key={q} className="border-b border-line">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_36px] items-center gap-4 border-0 bg-transparent py-6 text-left text-[19px] font-medium text-ink hover:text-brand"
                >
                  {q}
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-tint-2 text-xl text-brand" aria-hidden>
                    {isOpen ? "–" : "+"}
                  </span>
                </button>
                {isOpen && <p className="m-0 animate-[rise_.35s_ease_both] pb-[26px] pr-[52px] text-[17px] leading-[1.7] text-body max-sm:pr-0">{a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
