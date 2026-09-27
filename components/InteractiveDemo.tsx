"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { Accent, ChatIcon, PHONE_PATH, PersonIcon, VoiceMark, container } from "./ui";
import { DEMO_PHONE_DISPLAY, DEMO_PHONE_TEL } from "@/lib/site";

const CONVO = [
  { who: "Customer", text: "Hi, my AC stopped working. Do you guys service this area?" },
  { who: "Ringgy", text: "Yes, we do. I can help you schedule an AC service appointment. May I get your address?" },
  { who: "Customer", text: "4418 Oak Ridge Drive. How soon can someone come out?" },
  { who: "Ringgy", text: "I have Tuesday between 2 and 4 PM. I’ll book that and send you a confirmation by text." },
];
const STEP_MS = 1400;

export function InteractiveDemo() {
  const [step, setStep] = useState(0);
  const convoRef = useRef<HTMLDivElement>(null);

  // Play the sample conversation once, the first time it scrolls into view.
  useEffect(() => {
    const el = convoRef.current;
    if (!el) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        for (let i = 1; i <= CONVO.length + 1; i++) timers.push(setTimeout(() => setStep(i), i * STEP_MS));
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  const typing = step > 0 && step <= CONVO.length;
  const done = step > CONVO.length;

  return (
    <section id="demo" className="relative overflow-hidden bg-[#F4F7FC]">
      <Image
        src="/assets/demo-bg.png"
        alt=""
        width={1536}
        height={1024}
        sizes="80vw"
        className="pointer-events-none absolute left-[18%] top-1/2 h-auto w-[min(1100px,80vw)] -translate-y-[44%] opacity-70"
      />
      <div className={`${container} relative grid grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] items-center gap-[clamp(36px,5vw,72px)] py-[clamp(72px,9vw,120px)]`}>
        <div data-reveal="">
          <div className="mb-[22px] flex items-center gap-2.5 text-sm font-bold uppercase tracking-[.14em] text-brand">
            Talk to Ringgy <VoiceMark height={20} />
          </div>
          <h2 className="mb-[26px] text-[clamp(38px,5vw,68px)] font-bold leading-[1.08] tracking-[-.025em] text-ink">
            Don’t Take Our Word for It. <Accent bottom={-8} strokeWidth={3}>Call Ringgy.</Accent>
          </h2>
          <p className="mb-[26px] max-w-[30em] text-lg leading-[1.6] text-body">
            Experience how Ringgy handles a real customer conversation. See how easy it is to get service appointments, answer questions, and more.
          </p>
          <div className="mb-8 flex flex-col gap-3">
            {["Real AI conversation", "Instant appointment booking", "24/7 customer support"].map((t) => (
              <div key={t} className="flex items-center gap-3 text-[17px] text-text-2">
                <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-success text-[11px] text-white">✓</span>
                {t}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-end gap-x-12 gap-y-7">
            <div>
              <a
                href={DEMO_PHONE_TEL}
                className="inline-flex items-center gap-3.5 rounded-lg bg-brand px-8 py-5 text-[19px] font-medium text-white shadow-[0_14px_28px_-14px_rgba(21,87,176,.7)] transition-colors hover:bg-brand-dark"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d={PHONE_PATH} />
                </svg>
                Call Ringgy Now<span className="text-xl">›</span>
              </a>
              <div className="mt-3.5 text-[15px] text-muted">Demo line: {DEMO_PHONE_DISPLAY}</div>
            </div>
            <div className="flex items-start gap-1.5">
              <FlowStep label="Customer">
                <PersonIcon />
              </FlowStep>
              <span className="mt-5 text-lg text-[#7FA8E8]">→</span>
              <FlowStep label="Ringgy">
                <ChatIcon dotColor="#E3EDFC" />
              </FlowStep>
              <span className="mt-5 text-lg text-[#7FA8E8]">→</span>
              <FlowStep label="Appointment Booked">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <rect x="3" y="5" width="18" height="16" rx="3" />
                  <rect x="7" y="2.5" width="2.2" height="5" rx="1" />
                  <rect x="14.8" y="2.5" width="2.2" height="5" rx="1" />
                  <path d="M8 14l2.8 2.8L16.5 11" fill="none" stroke="#E3EDFC" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </FlowStep>
            </div>
          </div>
        </div>

        <div
          data-reveal=""
          ref={convoRef}
          className="flex min-h-[560px] flex-col gap-[22px] rounded-[20px] border border-line bg-white px-[clamp(18px,2.4vw,32px)] pb-8 pt-7 shadow-[0_30px_60px_-30px_rgba(21,87,176,.3)]"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5 text-sm font-medium uppercase tracking-[.12em] text-muted">
            <span className="flex items-center gap-3.5">
              <VoiceMark />
              Sample conversation
            </span>
            <span className="flex items-center gap-2">
              <span className="h-[9px] w-[9px] animate-blink rounded-full bg-success" />
              Inbound call · 0:14
            </span>
          </div>
          {CONVO.slice(0, step).map((c, i) =>
            c.who === "Ringgy" ? (
              <div key={i} className="max-w-[84%] animate-rise-fast self-end">
                <div className="mb-2 text-right text-[15px] font-medium text-muted">Ringgy</div>
                <div className="rounded-xl bg-[#E6EFFC] px-5 py-3.5 text-[17px] leading-[1.6] text-ink">{c.text}</div>
              </div>
            ) : (
              <div key={i} className="flex max-w-[90%] animate-rise-fast items-start gap-[clamp(12px,2vw,22px)]">
                <div className="flex h-[66px] w-[66px] flex-none items-center justify-center rounded-full bg-[#E6EFFC] text-[#3B82E8] max-sm:h-12 max-sm:w-12">
                  <PersonIcon />
                </div>
                <div>
                  <div className="mb-2 text-[15px] font-medium text-muted">Customer</div>
                  <div className="rounded-xl bg-[#F1F4F9] px-5 py-3.5 text-[17px] leading-[1.6] text-ink">{c.text}</div>
                </div>
              </div>
            ),
          )}
          {typing && (
            <div className="flex gap-[5px] px-0.5 py-1.5" aria-label="Typing">
              {[0, 0.15, 0.3].map((d) => (
                <span key={d} className="h-[7px] w-[7px] animate-dotpulse rounded-full bg-primary" style={{ animationDelay: `${d}s` }} />
              ))}
            </div>
          )}
          {done && (
            <div className="mt-auto flex animate-rise-fast items-center gap-[22px] rounded-xl border border-[#BFE3CC] bg-[#EAF7EF] px-5 py-[18px]">
              <div className="relative flex h-[66px] w-[66px] flex-none items-center justify-center rounded-full bg-white text-[30px]">
                📅
                <span className="absolute bottom-1 right-1 flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-white bg-success text-[11px] text-white">
                  ✓
                </span>
              </div>
              <div>
                <div className="text-xl font-bold text-[#146C3B]">Appointment booked — Tue, 2:00 PM</div>
                <div className="mt-1 text-base text-[#4F6B5B]">AC service · 4418 Oak Ridge Dr · Confirmed by SMS</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function FlowStep({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex w-[110px] flex-col items-center gap-2.5 text-center max-sm:w-[84px]">
      <div className="flex h-[62px] w-[62px] items-center justify-center rounded-full bg-tint text-brand">{children}</div>
      <div className="text-[15px] font-bold leading-[1.25] text-ink">{label}</div>
    </div>
  );
}
