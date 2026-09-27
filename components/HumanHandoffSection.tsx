import Image from "next/image";
import { container, sectionPad } from "./ui";

const HANDOFFS = [
  { when: "Customer asks for a human", then: "Transfer", img: "handoff-human", w: 1432, h: 563 },
  { when: "Complex situation", then: "Transfer", img: "handoff-complex", w: 1080, h: 848 },
  { when: "Customer is upset", then: "Transfer", img: "handoff-upset", w: 1062, h: 542 },
  { when: "Emergency or a situation outside configured rules", then: "Follow your configured escalation process", img: "handoff-emergency", w: 1559, h: 681 },
];

export function HumanHandoffSection() {
  return (
    <section className="border-y border-line bg-white">
      <div className={`${container} ${sectionPad}`}>
        <div data-reveal="" className="max-w-[34em]">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[.14em] text-brand">Human handoff</div>
          <h2 className="mb-[18px] text-[clamp(32px,4.4vw,52px)] font-medium leading-[1.05] tracking-[-.02em]">AI When It Can. Humans When They Should.</h2>
          <p className="m-0 text-[16.5px] leading-[1.65] text-[#3E4C5E]">
            Ringgy isn&apos;t designed to replace your team. It&apos;s designed to handle the calls your team doesn&apos;t have time to handle.
          </p>
        </div>
        <div className="mt-11 grid grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))] gap-4">
          {HANDOFFS.map((h) => (
            <div
              key={h.img}
              data-reveal=""
              className="flex flex-col rounded-[14px] border border-[#DDE7F6] bg-surface px-7 pb-[30px] pt-7 shadow-[0_12px_28px_-18px_rgba(15,37,64,.2)] transition-[box-shadow,border-color] hover:border-[#C9DAF2] hover:shadow-[0_18px_36px_-18px_rgba(21,87,176,.3)]"
            >
              <div className="mb-[26px] flex h-24 items-center">
                <Image
                  src={`/assets/${h.img}.png`}
                  alt=""
                  width={h.w}
                  height={h.h}
                  sizes="260px"
                  className="block h-auto max-h-24 w-auto max-w-full"
                />
              </div>
              <div className="mb-[22px] text-[21px] font-bold leading-[1.3] tracking-[-.01em] text-ink [text-wrap:pretty]">{h.when}</div>
              <div className="mt-auto flex items-start gap-3 text-base font-bold leading-[1.35] text-brand">
                <span className="font-normal">→</span>
                {h.then}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
