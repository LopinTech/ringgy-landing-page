"use client";

import { DEMO_PHONE_TEL } from "@/lib/site";
import { useRef, type ReactNode } from "react";
import { CallPlayer, type CallPlayerHandle } from "../CallPlayer";
import { ArrowRightIcon } from "../ui";
import { HVAC_DEMO_CALL } from "./hvacDemoCall";

const SCRIPTS = { demo: HVAC_DEMO_CALL };

export function HvacHero() {
   const player = useRef<CallPlayerHandle>(null);

   return (
      <section className="relative overflow-hidden bg-surface">
         <div className="pointer-events-none absolute -right-[140px] -top-10 h-[760px] w-[900px] rounded-full bg-[radial-gradient(ellipse_at_55%_45%,#E3EDFC_0%,#EAF1FD_45%,rgba(234,241,253,0)_72%)]" />
         <div className="relative mx-auto grid max-w-[1520px] grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] items-center gap-[clamp(36px,5vw,80px)] px-4 pb-[clamp(56px,7vw,96px)] pt-[clamp(56px,7vw,100px)] sm:px-7">
            <div data-reveal="">
               <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-tint py-3 pl-[18px] pr-[22px] text-base font-medium text-brand">
                  <span className="relative flex h-[11px] w-[11px]">
                     <span className="absolute inset-0 animate-halo rounded-full bg-sky" />
                     <span className="relative h-[11px] w-[11px] rounded-full bg-primary" />
                  </span>
                  Built for heating &amp; cooling companies
               </div>
               <h1 className="mb-[30px] text-[clamp(42px,5.2vw,76px)] font-bold leading-[1.1] tracking-[-.03em] text-ink [text-wrap:balance]">
                  The AI Receptionist for{" "}
                  <span className="relative inline-block text-primary">
                     HVAC Companies
                     <svg
                        viewBox="0 0 300 14"
                        preserveAspectRatio="none"
                        className="absolute -bottom-3 left-0 h-3.5 w-full"
                        aria-hidden>
                        <path
                           d="M3 9 C 80 3, 200 3, 297 9"
                           fill="none"
                           stroke="#A9C8F5"
                           strokeWidth="4"
                           strokeLinecap="round"
                        />
                     </svg>
                  </span>
               </h1>
               <p className="mb-10 max-w-[33em] text-[clamp(17px,1.6vw,22px)] leading-[1.65] text-body [text-wrap:pretty]">
                  When the phones won’t stop ringing, Ringgy answers 24/7. It
                  handles customer questions, captures job details, triages
                  urgent calls, and books appointments while your team stays
                  focused on the work.
               </p>
               <div className="mb-[52px] flex flex-wrap gap-5">
                  <button
                     type="button"
                     onClick={() => player.current?.play()}
                     className="flex cursor-pointer items-center gap-5 rounded-lg border-0 bg-brand py-3.5 pl-3.5 pr-[30px] text-[19px] font-medium text-white shadow-[0_14px_28px_-14px_rgba(21,87,176,.7)] transition-colors hover:bg-brand-dark">
                     <span className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-white">
                        <svg
                           width="18"
                           height="18"
                           viewBox="0 0 24 24"
                           fill="#1557B0"
                           aria-hidden>
                           <path d="M7 4.5v15l12.5-7.5z" />
                        </svg>
                     </span>
                     Hear an HVAC Call
                  </button>
                  <a
                     href="#cta"
                     className="flex min-h-[74px] min-w-[220px] items-center justify-center rounded-lg border-[1.5px] border-primary px-[34px] text-[19px] font-medium text-primary transition-colors hover:bg-tint-2 hover:text-brand">
                     Try Ringgy Free
                  </a>
               </div>
               <div className="flex flex-wrap gap-x-8 gap-y-5">
                  <Pill
                     bg="#FDE4E5"
                     label={
                        <>
                           Heat-wave
                           <br />
                           ready
                        </>
                     }>
                     <svg
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#E5484D"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        aria-hidden>
                        <path d="M12 3v11" />
                        <circle cx="12" cy="17.5" r="3.5" />
                        <path d="M9 5.5a3 3 0 016 0V14" />
                     </svg>
                  </Pill>
                  <Pill
                     bg="#FFF0D2"
                     divider
                     label={
                        <>
                           Emergency
                           <br />
                           triage
                        </>
                     }>
                     <svg
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="#F2A516"
                        aria-hidden>
                        <path d="M12 2.5L1.8 20.5h20.4z" />
                        <rect
                           x="11"
                           y="9"
                           width="2"
                           height="6"
                           rx="1"
                           fill="#fff"
                        />
                        <circle cx="12" cy="17.3" r="1.2" fill="#fff" />
                     </svg>
                  </Pill>
                  <Pill
                     bg="#DDF4EA"
                     divider
                     label={
                        <>
                           Books
                           <br />
                           tune-ups
                        </>
                     }>
                     <svg
                        width="26"
                        height="26"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#12A36C"
                        strokeWidth="2"
                        aria-hidden>
                        <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
                        <path
                           d="M3.5 10h17M8 3v4M16 3v4"
                           strokeLinecap="round"
                        />
                        <path
                           d="M8.5 15l2.5 2.5 4.5-4.5"
                           strokeLinecap="round"
                           strokeLinejoin="round"
                        />
                     </svg>
                  </Pill>
               </div>
            </div>

            <div data-reveal="" className="relative">
               <CallPlayer
                  ref={player}
                  scripts={SCRIPTS}
                  avatar="initials"
                  footer={
                     <>
                        <div className="text-[15.5px] leading-[1.45] text-muted">
                           <div className="text-[17px] font-bold text-ink">
                              Sample HVAC call
                           </div>
                           Press play to hear Ringgy book a no-cooling call.
                        </div>
                        <a
                           href={DEMO_PHONE_TEL}
                           className="flex items-center gap-3 rounded-[10px] border-[1.5px] border-primary px-[30px] py-[15px] text-[17px] font-medium text-primary transition-colors hover:bg-primary hover:text-white">
                           Call the live demo
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

function Pill({
   bg,
   label,
   divider,
   children,
}: {
   bg: string;
   label: ReactNode;
   divider?: boolean;
   children: ReactNode;
}) {
   return (
      <div
         className={`flex items-center gap-[18px] ${divider ? "sm:border-l sm:border-line-2 sm:pl-7" : ""}`}>
         <span
            className="flex h-[60px] w-[60px] flex-none items-center justify-center rounded-full"
            style={{ background: bg }}>
            {children}
         </span>
         <div className="text-[16.5px] leading-[1.45] text-text-2">{label}</div>
      </div>
   );
}
