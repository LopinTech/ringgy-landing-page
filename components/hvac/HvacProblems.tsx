import type { ReactNode } from "react";
import { PHONE_PATH, container, sectionPad } from "../ui";

// Animated icons; keyframes (ic*) live in app/globals.css.
const box = { transformBox: "fill-box", transformOrigin: "center" } as const;

const PROBLEMS: { num: string; title: string; body: string; bg: string; icon: ReactNode }[] = [
  {
    num: "01",
    title: "Missed Calls",
    body: "You’re busy on a job. The phone rings. The customer calls someone else.",
    bg: "#FDE4E5",
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" className="overflow-visible" aria-hidden>
        <g style={{ ...box, animation: "icShake 2.6s ease-in-out infinite" }}>
          <path fill="#E5484D" d={PHONE_PATH} />
        </g>
        <g style={{ ...box, animation: "icPop 2.6s ease-in-out infinite" }}>
          <circle cx="18" cy="5.5" r="4.6" fill="#E5484D" />
          <path d="M16.2 3.7l3.6 3.6M19.8 3.7l-3.6 3.6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      </svg>
    ),
  },
  {
    num: "02",
    title: "After-Hours Calls",
    body: "Customers often call in the evenings, at night, and on weekends.",
    bg: "#E3EDFC",
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#1F6FEB" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <line x1="12" y1="12" x2="12" y2="6.2" style={{ transformOrigin: "12px 12px", animation: "icSpin 3s linear infinite" }} />
        <line x1="12" y1="12" x2="15.6" y2="13.8" style={{ transformOrigin: "12px 12px", animation: "icSpin 36s linear infinite" }} />
        <circle cx="12" cy="12" r="1.3" fill="#1F6FEB" stroke="none" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Overloaded Staff",
    body: "Your team shouldn’t spend the day answering the same questions and scheduling appointments.",
    bg: "#FFF0D2",
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="#F2A516" aria-hidden>
        <g style={{ animation: "icBob 1.6s ease-in-out infinite" }}>
          <circle cx="8.5" cy="8" r="3.2" />
          <path d="M2.5 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5z" />
        </g>
        <g style={{ animation: "icBob 1.6s ease-in-out .8s infinite" }}>
          <circle cx="16" cy="8.5" r="2.7" />
          <path d="M15.5 19c0-2-.6-3.6-1.7-4.8.6-.2 1.3-.3 2.2-.3 3 0 5.5 2 5.5 5.1z" />
        </g>
      </svg>
    ),
  },
  {
    num: "04",
    title: "Slow Response",
    body: "Customers expect an immediate response. Delays lead to lost business.",
    bg: "#EFE6FD",
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" className="overflow-visible" aria-hidden>
        <g style={{ ...box, animation: "icSpark 2.2s ease-out infinite" }} stroke="#A78BFA" strokeWidth="1.6" strokeLinecap="round">
          <path d="M3 5l2 1.5M21 5l-2 1.5M2.5 15h2.2M21.5 15h-2.2" />
        </g>
        <path fill="#7C3AED" d="M13.5 2L5 13.5h6L9.5 22 19 10h-6z" style={{ ...box, animation: "icFlash 2.2s ease-in-out infinite" }} />
      </svg>
    ),
  },
];

export function HvacProblems() {
  return (
    <section id="problems" className="border-t border-line bg-surface">
      <div className={`${container} ${sectionPad}`}>
        <div data-reveal="" className="flex flex-wrap items-start justify-between gap-x-16 gap-y-6">
          <div>
            <div className="mb-4 text-[15px] font-bold uppercase tracking-[.14em] text-brand">The problem</div>
            <h2 className="m-0 text-[clamp(36px,4.4vw,62px)] font-bold leading-[1.1] tracking-[-.025em] text-ink">
              Every Missed Call
              <br />
              Could Be a Missed Job
            </h2>
          </div>
          <p className="mt-7 max-w-[30em] text-[clamp(17px,1.4vw,20px)] leading-[1.6] text-body">
            When calls go unanswered, potential customers move on to your competitors. Here are the most common challenges HVAC businesses face.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,185px),1fr))] gap-[clamp(14px,1.6vw,24px)]">
          {PROBLEMS.map((p) => (
            <div
              key={p.num}
              data-reveal=""
              className="rounded-[14px] border border-line bg-white px-[clamp(18px,2.2vw,32px)] pb-[clamp(24px,2.2vw,32px)] pt-[clamp(20px,2vw,26px)] shadow-[0_14px_34px_-28px_rgba(15,37,64,.3)] transition-[transform,box-shadow] duration-[250ms] hover:-translate-y-[3px] hover:shadow-[0_20px_40px_-26px_rgba(15,37,64,.35)]"
            >
              <div className="mb-6 flex items-start justify-between">
                <div className="flex h-[clamp(54px,5vw,72px)] w-[clamp(54px,5vw,72px)] items-center justify-center rounded-xl" style={{ background: p.bg }}>
                  {p.icon}
                </div>
                <div className="pt-1.5 text-[clamp(28px,2.8vw,40px)] font-normal leading-none text-[#C9D6EA]">{p.num}</div>
              </div>
              <div className="mb-2.5 text-[clamp(18px,1.7vw,24px)] font-bold tracking-[-.01em] text-ink">{p.title}</div>
              <p className="m-0 text-[clamp(15px,1.25vw,18px)] leading-[1.6] text-muted [text-wrap:pretty]">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
