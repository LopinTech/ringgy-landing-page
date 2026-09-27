"use client";

import { useState, type CSSProperties } from "react";
import { container, sectionPad } from "../ui";

const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

export function HvacRoi() {
  const [calls, setCalls] = useState(40);
  const [ticket, setTicket] = useState(450);
  const [rate, setRate] = useState(60);

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(160deg,#0D2355_0%,#0A1B45_55%,#0E2A66_100%)] text-on-dark">
      <div className="pointer-events-none absolute -bottom-[260px] -left-[200px] h-[640px] w-[640px] rounded-full bg-[radial-gradient(circle,rgba(31,111,235,.25),rgba(31,111,235,0)_70%)]" />
      <div className={`${container} ${sectionPad} relative grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-center gap-[clamp(36px,5vw,72px)]`}>
        <div data-reveal="">
          <div className="mb-6 flex items-center gap-3.5 text-[15px] font-medium uppercase tracking-[.16em] text-[#5EA2FF]">
            The cost of a missed call
            <span className="h-[1.5px] w-[26px] bg-[#5EA2FF]" />
          </div>
          <h2 className="mb-[26px] text-[clamp(36px,4.6vw,64px)] font-bold leading-[1.08] tracking-[-.025em] text-white">What Is Voicemail Costing Your Shop?</h2>
          <p className="m-0 max-w-[28em] text-[clamp(17px,1.5vw,21px)] leading-[1.6] text-[#D6E2F2]">
            Most HVAC customers call the next company when nobody answers. Put in your own numbers to see what that adds up to each month.
          </p>
        </div>
        <div data-reveal="" className="flex flex-col gap-[34px] rounded-[20px] bg-white p-[clamp(24px,3vw,40px)] text-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,.55)]">
          <Slider label="Missed calls / month" display={String(calls)} value={calls} min={5} max={300} step={5} onChange={setCalls} />
          <Slider label="Average ticket" display={money(ticket)} value={ticket} min={100} max={3000} step={25} onChange={setTicket} />
          <Slider label="Callers who would have booked" display={`${rate}%`} value={rate} min={10} max={100} step={5} onChange={setRate} />
          <div className="rounded-[14px] bg-[#EAF2FD] px-[clamp(18px,2.4vw,30px)] py-[26px]">
            <div className="mb-2 text-sm font-medium uppercase tracking-[.14em] text-[#3E4C5E]">Revenue walking to competitors</div>
            <div className="text-[clamp(40px,4.5vw,58px)] font-bold leading-[1.05] tracking-[-.02em] text-brand tabular-nums" aria-live="polite">
              {money((calls * ticket * rate) / 100)}
            </div>
            <div className="mt-2 text-base text-body">per month, before any replacement or install jobs</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Slider(props: { label: string; display: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  const pct = ((props.value - props.min) / (props.max - props.min)) * 100;
  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <span className="text-lg font-bold">{props.label}</span>
        <span className="text-[30px] font-bold text-brand tabular-nums">{props.display}</span>
      </div>
      <input
        type="range"
        className="range-slider"
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        aria-label={props.label}
        onChange={(e) => props.onChange(Number(e.target.value))}
        style={{ "--fill": `${pct}%` } as CSSProperties}
      />
    </div>
  );
}
