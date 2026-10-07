"use client";

import type { ReactNode } from "react";
import { CallPlayer, type CallLine } from "./CallPlayer";
import { ArrowRightIcon, CallIcon, PHONE_PATH, UsersIcon, VoiceMark } from "./ui";
import { DEMO_PHONE_TEL, SIGNUP_URL } from "@/lib/site";

const SCRIPTS: Record<string, CallLine[]> = {
  hvac: [
    ["Ringgy", "Thanks for calling Northside Heating and Air, this is Ringgy. How may I help you?"],
    ["Caller", "Hi, my AC stopped working this morning and the house is getting really hot."],
    ["Ringgy", "I’m sorry to hear that. I can get a technician out to you. What’s the address for the service?"],
    ["Caller", "It’s 4418 Oak Ridge Drive."],
    ["Ringgy", "Thanks. We do service Oak Ridge. Is the unit running at all, or is it completely off?"],
    ["Caller", "The fan runs, but it’s only blowing warm air."],
    ["Ringgy", "Got it. I have an opening today between 2 and 4 PM. Would that work for you?"],
    ["Caller", "Yes, that’s perfect."],
    ["Ringgy", "You’re booked for today, 2 to 4 PM. I’ll text you a confirmation now. Anything else I can help with?"],
  ],
  plumbing: [
    ["Ringgy", "Thanks for calling Clearline Plumbing, this is Ringgy. How may I help you?"],
    ["Caller", "Hi, I just went to take a shower before work and realized I have no hot water."],
    ["Caller", "I think my water heater stopped working."],
    ["Caller", "I bought it from you guys five years ago, so I’m hoping it’s still under warranty."],
    ["Ringgy", "I’m sorry about that. I can check on the warranty and get someone out. Can I get the name on the account?"],
    ["Caller", "Sure, it’s Maria Alvarez."],
    ["Ringgy", "Thanks, Maria. I see the installation from 2021, which is within the warranty period. I have a technician available tomorrow at 8 AM."],
    ["Caller", "Great, let’s do that."],
    ["Ringgy", "You’re all set for tomorrow at 8 AM. I’ll text you the details now."],
  ],
  electrical: [
    ["Ringgy", "Thanks for calling Brightwire Electric, this is Ringgy. How may I help you?"],
    ["Caller", "Hi, half the outlets in my kitchen stopped working and resetting the breaker didn’t help."],
    ["Ringgy", "I can help with that. Do you notice any burning smell or warm outlets?"],
    ["Caller", "No, nothing like that. They’re just dead."],
    ["Ringgy", "Okay, that’s good to hear. May I get your address to confirm we service your area?"],
    ["Caller", "212 Maple Court."],
    ["Ringgy", "We do cover Maple Court. I can have an electrician there Thursday morning between 9 and 11."],
    ["Caller", "Thursday works."],
    ["Ringgy", "You’re booked for Thursday, 9 to 11 AM. You’ll get a text confirmation shortly."],
  ],
};

const OPTIONS = [
  { value: "hvac", label: "HVAC" },
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface">
      <div className="pointer-events-none absolute -right-[140px] -top-10 h-[760px] w-[900px] rounded-[48%_52%_45%_55%] bg-[radial-gradient(ellipse_at_55%_45%,#E3EDFC_0%,#EAF1FD_45%,rgba(234,241,253,0)_72%)]" />
      <div className="relative mx-auto grid max-w-[1520px] grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] items-center gap-[clamp(36px,5vw,80px)] px-4 pb-[clamp(56px,7vw,96px)] pt-[clamp(56px,7vw,100px)] sm:px-7">
        <div data-reveal="">
          <div className="mb-[34px] inline-flex items-center gap-3 rounded-full bg-[#E3F4EA] py-3 pl-[18px] pr-[22px] text-[17px] font-medium text-[#146C3B]">
            <span className="relative flex h-[11px] w-[11px]">
              <span className="absolute inset-0 animate-halo rounded-full bg-[#34C27A]" />
              <span className="relative h-[11px] w-[11px] rounded-full bg-success" />
            </span>
            Answering calls right now
          </div>
          <h1 className="mb-[30px] text-[clamp(42px,5.4vw,78px)] font-bold leading-[1.1] tracking-[-.03em] text-ink [text-wrap:balance]">
            Your AI Receptionist for{" "}
            <span className="relative inline-block text-primary">
              Every Customer Call
              <svg viewBox="0 0 300 14" preserveAspectRatio="none" className="absolute -bottom-3 left-0 h-3.5 w-[55%]" aria-hidden>
                <path d="M3 9 C 80 3, 200 3, 297 9" fill="none" stroke="#A9C8F5" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="mb-10 max-w-[33em] text-[clamp(17px,1.6vw,22px)] leading-[1.65] text-body [text-wrap:pretty]">
            Ringgy answers your calls 24/7, talks to customers naturally, answers questions, qualifies leads, and books appointments — so you never
            miss another opportunity.
          </p>
          <div className="mb-[52px] flex flex-wrap gap-6">
            <a
              href={DEMO_PHONE_TEL}
              className="flex items-center gap-[22px] rounded-lg bg-brand py-3.5 pl-3.5 pr-8 text-xl font-medium text-white shadow-[0_14px_28px_-14px_rgba(21,87,176,.7)] transition-colors hover:bg-brand-dark"
            >
              <CallIcon size={48} />
              Make a Demo Call
            </a>
            <a
              href={SIGNUP_URL}
              className="flex min-h-[76px] min-w-[240px] items-center justify-center rounded-lg border-[1.5px] border-primary px-9 text-xl font-medium text-primary transition-colors hover:bg-tint-2 hover:text-brand"
            >
              Try for Free
            </a>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-5">
            <HeroPill iconBg="bg-tint" label={<>Answers<br />24/7</>}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="#1F6FEB" aria-hidden>
                <path d={PHONE_PATH} />
              </svg>
            </HeroPill>
            <HeroPill iconBg="bg-[#DDF4EA]" divider label={<>Books<br />appointments</>}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#12A36C" strokeWidth="2" aria-hidden>
                <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
                <path d="M3.5 10h17M8 3v4M16 3v4" strokeLinecap="round" />
                <g fill="#12A36C" stroke="none">
                  <circle cx="8.5" cy="13.5" r="1" />
                  <circle cx="12" cy="13.5" r="1" />
                  <circle cx="15.5" cy="13.5" r="1" />
                  <circle cx="8.5" cy="17" r="1" />
                  <circle cx="12" cy="17" r="1" />
                </g>
              </svg>
            </HeroPill>
            <HeroPill iconBg="bg-[#ECE6FC]" divider label={<>Human<br />handoff</>}>
              <UsersIcon className="text-[#7C5CE6]" />
            </HeroPill>
          </div>
        </div>

        <div data-reveal="" className="relative">
          <CallPlayer
            scripts={SCRIPTS}
            options={OPTIONS}
            footer={
              <>
                <div className="flex items-center gap-[22px]">
                  <span className="flex h-[62px] w-[62px] flex-none items-center justify-center rounded-full bg-tint-2">
                    <VoiceMark barWidth={3} />
                  </span>
                  <div className="text-base leading-[1.45] text-muted">
                    <div className="text-lg font-bold text-ink">This is a real call handled by Ringgy.</div>
                    Hear how it works with your business.
                  </div>
                </div>
                <a
                  href={DEMO_PHONE_TEL}
                  className="flex items-center gap-3.5 rounded-[10px] border-[1.5px] border-primary px-[34px] py-4 text-lg font-medium text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  Try the live demo
                  <ArrowRightIcon size={20} />
                </a>
              </>
            }
          />
        </div>
      </div>
    </section>
  );
}

function HeroPill({ iconBg, label, divider, children }: { iconBg: string; label: ReactNode; divider?: boolean; children: ReactNode }) {
  return (
    <div className={`flex items-center gap-[22px] ${divider ? "sm:border-l sm:border-line-2 sm:pl-8" : ""}`}>
      <span className={`flex h-16 w-16 flex-none items-center justify-center rounded-full ${iconBg}`}>{children}</span>
      <div className="text-[17px] leading-[1.45] text-text-2">{label}</div>
    </div>
  );
}
