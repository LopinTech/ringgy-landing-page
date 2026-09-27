"use client";

import { useState, type ReactNode } from "react";
import { DotGrid, PHONE_PATH, UsersIcon } from "./ui";

// Slider positions map piecewise-linearly onto these ticks (each segment = 25% of the track).
const CALL_TICKS = [0, 50, 100, 200, 500];
const VALUE_TICKS = [50, 200, 500, 1000, 5000];

function toPos(v: number, t: number[]) {
  v = Math.max(t[0], Math.min(t[4], v));
  for (let i = 0; i < 4; i++) if (v <= t[i + 1]) return i * 25 + ((v - t[i]) / (t[i + 1] - t[i])) * 25;
  return 100;
}

function fromPos(p: number, t: number[], step: number) {
  const i = Math.min(3, Math.floor(p / 25));
  const v = t[i] + ((p - i * 25) / 25) * (t[i + 1] - t[i]);
  return Math.round(v / step) * step;
}

const money = (n: number) => "$" + n.toLocaleString("en-US");
const digits = (s: string) => Number(s.replace(/[^0-9]/g, "")) || 0;

export function RoiCalculator() {
  const [calls, setCalls] = useState(30);
  const [value, setValue] = useState(400);

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_20%_0%,#1A3F86_0%,rgba(26,63,134,0)_55%),linear-gradient(160deg,#0D2355_0%,#0A1B45_55%,#0E2A66_100%)] text-on-dark">
      <div className="pointer-events-none absolute -right-[180px] -top-[220px] h-[620px] w-[620px] rounded-full bg-[radial-gradient(circle,rgba(77,155,245,.22),rgba(77,155,245,0)_70%)]" />
      <div className="pointer-events-none absolute -bottom-[260px] -left-[200px] h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle,rgba(31,111,235,.25),rgba(31,111,235,0)_70%)]" />
      <DotGrid cols={6} rows={5} gap={24} r={2} fill="#4D9BF5" className="left-[44%] top-[12%] opacity-35" />
      <div className="relative mx-auto grid max-w-[1520px] grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-center gap-[clamp(36px,5vw,72px)] px-4 py-[clamp(72px,9vw,120px)] sm:px-7">
        <div data-reveal="">
          <div className="mb-6 flex items-center gap-3.5 text-[15px] font-medium uppercase tracking-[.16em] text-[#5EA2FF]">
            Business impact
            <span className="h-[1.5px] w-[26px] bg-[#5EA2FF]" />
          </div>
          <h2 className="mb-[30px] text-[clamp(40px,5vw,72px)] font-bold leading-[1.08] tracking-[-.025em] text-white">
            How Many Calls
            <br />
            Are You{" "}
            <span className="relative inline-block text-sky">
              Missing?
              <svg viewBox="0 0 300 14" preserveAspectRatio="none" className="absolute -bottom-2.5 left-0 h-3.5 w-full" aria-hidden>
                <path d="M3 9 C 80 3, 200 3, 297 8" fill="none" stroke="#4D9BF5" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </span>
          </h2>
          <p className="mb-[34px] max-w-[28em] text-[clamp(17px,1.6vw,22px)] leading-[1.6] text-[#D6E2F2]">
            Even recovering a small number of missed opportunities can make an AI receptionist worth the investment.
          </p>
          <div className="flex flex-col gap-4">
            <Benefit bg="#16865A" label="More booked jobs">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <rect x="4" y="13" width="3" height="7" rx=".8" />
                <rect x="9.5" y="10" width="3" height="10" rx=".8" />
                <rect x="15" y="12" width="3" height="8" rx=".8" />
                <path d="M4 9l5-4 4 3 6-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Benefit>
            <Benefit bg="#1557B0" label="Higher revenue">
              <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
                <circle cx="12" cy="12" r="9" fill="#fff" />
                <path d="M12 7v5.5l3.5 2" fill="none" stroke="#1557B0" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </Benefit>
            <Benefit bg="#6A3FD0" label="Happier customers">
              <UsersIcon size={26} />
            </Benefit>
          </div>
        </div>

        <div data-reveal="" className="flex flex-col gap-10 rounded-[20px] bg-white p-[clamp(24px,3vw,40px)] text-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,.55)]">
          <SliderRow
            iconBg="#EAF0FA"
            icon={
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1F6FEB" strokeWidth="1.8" strokeLinejoin="round" aria-hidden>
                <path d={PHONE_PATH} />
              </svg>
            }
            title="Missed calls / month"
            hint="How many calls do you currently miss each month?"
            display={String(calls)}
            onType={(s) => setCalls(Math.min(9999, digits(s)))}
            pos={toPos(calls, CALL_TICKS)}
            onSlide={(p) => setCalls(fromPos(p, CALL_TICKS, 1))}
            ticks={["0", "50", "100", "200", "500"]}
          />
          <SliderRow
            iconBg="#E2F5EC"
            icon={
              <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden>
                <circle cx="12" cy="12" r="10" fill="#12A36C" />
                <text x="12" y="16.6" textAnchor="middle" fontWeight="700" fontSize="13" fill="#fff">
                  $
                </text>
              </svg>
            }
            title="Average job value"
            hint="What’s the average value of a booked job?"
            display={money(value)}
            onType={(s) => setValue(Math.min(999999, digits(s)))}
            pos={toPos(value, VALUE_TICKS)}
            onSlide={(p) => setValue(fromPos(p, VALUE_TICKS, value >= 1000 ? 50 : 10))}
            ticks={["$50", "$200", "$500", "$1,000", "$5,000"]}
          />
          <div className="border-t border-[#E3E9F2] pt-[30px]">
            <div className="flex items-center gap-[clamp(16px,2.4vw,30px)] rounded-[14px] bg-[#EAF2FD] px-[clamp(18px,2.4vw,32px)] py-[30px]">
              <div className="flex h-[86px] w-[86px] flex-none items-center justify-center rounded-[14px] bg-[#D6E6FB] max-sm:h-16 max-sm:w-16">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1F6FEB" strokeWidth="2" aria-hidden>
                  <rect x="4" y="13" width="3.5" height="7" rx="1" />
                  <rect x="10.2" y="9" width="3.5" height="11" rx="1" />
                  <rect x="16.5" y="4" width="3.5" height="16" rx="1" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="mb-2 text-[14.5px] font-medium uppercase tracking-[.14em] text-[#3E4C5E]">Potential missed opportunities</div>
                <div className="break-words text-[clamp(36px,4.5vw,60px)] font-bold leading-[1.05] tracking-[-.02em] text-brand tabular-nums" aria-live="polite">
                  {money(calls * value)}
                </div>
                <div className="mt-2 text-[17px] text-body">per month, at your current volume</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Benefit({ bg, label, children }: { bg: string; label: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-[22px] text-xl text-on-dark">
      <span className="flex h-[58px] w-[58px] flex-none items-center justify-center rounded-full text-white" style={{ background: bg }}>
        {children}
      </span>
      {label}
    </div>
  );
}

function SliderRow(props: {
  iconBg: string;
  icon: ReactNode;
  title: string;
  hint: string;
  display: string;
  onType: (s: string) => void;
  pos: number;
  onSlide: (p: number) => void;
  ticks: string[];
}) {
  const pct = `${props.pos}%`;
  return (
    <div className="grid grid-cols-[76px_minmax(0,1fr)] items-start gap-[26px] max-sm:grid-cols-1 max-sm:gap-4">
      <div className="flex h-[76px] w-[76px] items-center justify-center rounded-[14px] max-sm:hidden" style={{ background: props.iconBg }}>
        {props.icon}
      </div>
      <div>
        <div className="mb-[22px] flex items-start justify-between gap-4">
          <div>
            <div className="mb-1.5 text-[19px] font-bold text-ink">{props.title}</div>
            <div className="text-[15.5px] text-muted">{props.hint}</div>
          </div>
          <input
            type="text"
            inputMode="numeric"
            aria-label={props.title}
            value={props.display}
            onChange={(e) => props.onType(e.target.value)}
            className="h-[62px] w-[130px] flex-none rounded-[10px] border-0 bg-[#EEF2F8] text-center text-[26px] font-medium text-ink outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div className="relative h-7">
          <div className="absolute inset-x-0 top-[11px] h-1.5 rounded-[3px] bg-[#E3E9F2]" />
          <div className="absolute left-0 top-[11px] h-1.5 rounded-[3px] bg-primary" style={{ width: pct }} />
          {[25, 50, 75].map((t) => (
            <div key={t} className="absolute top-[17px] h-2 w-px bg-[#CBD5E3]" style={{ left: `${t}%` }} />
          ))}
          <div
            className="pointer-events-none absolute top-px -ml-[13px] h-[26px] w-[26px] rounded-full border-[6px] border-primary bg-white shadow-[0_4px_10px_-2px_rgba(31,111,235,.5)]"
            style={{ left: pct }}
          />
          <input
            type="range"
            min={0}
            max={100}
            step={0.5}
            value={props.pos}
            onChange={(e) => props.onSlide(Number(e.target.value))}
            aria-label={props.title}
            className="absolute inset-0 m-0 h-full w-full cursor-pointer opacity-0"
          />
        </div>
        <div className="mt-2.5 flex justify-between text-[15px] text-muted">
          {props.ticks.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
