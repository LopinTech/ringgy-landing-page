import Image from "next/image";
import { Accent, Eyebrow, container, sectionPad } from "./ui";

const QUOTE_PATH = "M0 40V24C0 11 6 3 18 0l2 5c-6 2-9 6-9.5 12H20v23zM28 40V24c0-13 6-21 18-24l2 5c-6 2-9 6-9.5 12H48v23z";

export function TestimonialsSection() {
  return (
    <section className="bg-surface">
      <div className={`${container} ${sectionPad} flex flex-wrap items-center gap-[clamp(40px,5vw,72px)]`}>
        <div data-reveal="" className="min-w-0 flex-[1_1_340px]">
          <Eyebrow className="mb-[22px] text-[14.5px] font-medium" lineClassName="w-12 bg-accent-soft">
            Trusted by home-service businesses
          </Eyebrow>
          <h2 className="m-0 text-[clamp(36px,4.4vw,60px)] font-bold leading-[1.1] tracking-[-.025em] text-ink">
            Built With Home-Service
            <br />
            <Accent height={14}>Businesses</Accent>
          </h2>
        </div>
        <div data-reveal="" className="min-w-0 flex-[1.9_1_600px] pt-[30px] max-md:basis-full">
          <div className="relative mt-3.5">
            <div className="relative overflow-hidden rounded-[22px] border border-line bg-white px-[clamp(26px,3.4vw,52px)] pb-[clamp(30px,3.4vw,48px)] pt-[clamp(30px,3.4vw,52px)] shadow-[0_30px_60px_-36px_rgba(21,87,176,.35)]">
              <svg viewBox="0 0 400 240" preserveAspectRatio="none" className="pointer-events-none absolute bottom-0 right-0 h-[58%] w-[48%]" aria-hidden>
                <path d="M0 240 C 120 235, 140 120, 260 110 S 400 60, 400 60 V240 Z" fill="#E4EDFB" opacity=".7" />
                <path d="M120 240 C 220 238, 260 150, 330 140 S 400 120, 400 120 V240 Z" fill="#D9E6FA" opacity=".6" />
              </svg>
              <div className="relative grid grid-cols-[auto_minmax(0,1fr)] gap-[clamp(20px,3vw,44px)] pr-[clamp(0px,6vw,80px)] max-sm:grid-cols-1">
                <div className="pt-1.5">
                  <svg width="72" height="57.6" viewBox="0 0 50 40" fill="#A9C8F5" className="max-sm:h-10 max-sm:w-12" aria-hidden>
                    <path d={QUOTE_PATH} />
                  </svg>
                </div>
                <div>
                  <blockquote className="m-0 mb-[26px] text-[clamp(22px,2.3vw,32px)] leading-[1.45] tracking-[-.01em] text-ink [text-wrap:pretty]">
                    “Ringgy handled our after-hours calls and helped us <span className="font-bold text-brand">capture jobs we previously would have missed</span>.”
                  </blockquote>
                  <div className="flex gap-1.5" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} width="30" height="30" viewBox="0 0 24 24" fill="#FBBF24" aria-hidden>
                        <path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <div className="relative mt-[22px] flex items-center gap-7 max-sm:gap-4">
                <Image
                  src="/assets/review-avatar.png"
                  alt="James Carter"
                  width={200}
                  height={200}
                  className="h-[100px] w-[100px] flex-none rounded-full border-[5px] border-[#D6E6FB] object-cover max-sm:h-16 max-sm:w-16"
                />
                <div>
                  <div className="text-[23px] font-bold text-ink">James Carter</div>
                  <div className="mt-1.5 text-lg text-subtle">Owner, Carter Plumbing</div>
                </div>
              </div>
            </div>
            <div className="absolute -right-2.5 -top-10 flex h-[84px] w-[84px] items-center justify-center rounded-full border border-line bg-[#F4F8FE] shadow-[0_12px_24px_-14px_rgba(21,87,176,.4)] max-sm:hidden">
              <svg width="38" height="30.4" viewBox="0 0 50 40" fill="#1F6FEB" aria-hidden>
                <path d={QUOTE_PATH} />
              </svg>
            </div>
            <svg width="40" height="40" viewBox="0 0 40 40" className="absolute -right-10 -top-[58px] max-md:hidden" fill="none" stroke="#1F6FEB" strokeWidth="3.5" strokeLinecap="round" aria-hidden>
              <path d="M10 4L6 18M34 12L20 22" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
