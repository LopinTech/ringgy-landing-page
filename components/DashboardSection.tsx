import Image from "next/image";
import { container, sectionPad } from "./ui";

const NAV = ["Calls", "Customers", "Appointments", "Transcripts", "AI Settings", "Availability"];
const KPIS = [
  { label: "Calls today", value: "38" },
  { label: "Answered", value: "100%" },
  { label: "Appointments", value: "11" },
  { label: "After hours", value: "9" },
];
const CALLS = [
  { name: "Maria Alvarez", detail: "AC not cooling · 2:14 PM · 1:42", status: "Booked", color: "#1557B0" },
  { name: "Unknown caller", detail: "Service area question · 1:58 PM", status: "Answered", color: "#66768A" },
  { name: "Dale Whitcomb", detail: "Furnace tune-up · 12:31 PM", status: "Booked", color: "#1557B0" },
  { name: "Priya Raman", detail: "Asked for a person · 11:04 AM", status: "Transferred", color: "#9A6B2F" },
  { name: "Tom Nguyen", detail: "Emergency leak · 3:22 AM", status: "Escalated", color: "#B4522F" },
];
// Deterministic pseudo-random timing so the waveform bars move out of phase.
const BARS = Array.from({ length: 22 }, (_, i) => ({
  delay: `${(((i * 37) % 110) / 100).toFixed(2)}s`,
  duration: `${(0.85 + ((i * 53) % 70) / 100).toFixed(2)}s`,
}));

export function DashboardSection() {
  return (
    <section className="bg-ink text-on-dark">
      <div className={`${container} ${sectionPad}`}>
        <div data-reveal="" className="max-w-[32em]">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[.14em] text-on-dark-accent">Dashboard</div>
          <h2 className="mb-[18px] text-[clamp(32px,4.4vw,56px)] font-medium leading-[1.05] tracking-[-.02em] text-page">Everything in One Place</h2>
          <p className="m-0 text-[16.5px] leading-[1.65] text-on-dark-muted">See every conversation, customer and appointment from one simple dashboard.</p>
        </div>
        <div data-reveal="" className="mt-12 overflow-hidden rounded-lg bg-[#F7F9FC] text-ink shadow-[0_40px_80px_-40px_rgba(0,0,0,.6)]">
          <div className="flex flex-wrap">
            <div className="flex max-w-[220px] flex-[1_1_180px] flex-col gap-1 border-r border-[#CFD9E6] bg-[#E9EEF6] px-4 py-5 max-sm:max-w-none max-sm:border-b max-sm:border-r-0">
              <div className="mb-5 flex items-center gap-2 text-[17px] font-extrabold tracking-[-.02em]">
                <Image src="/assets/images/logo-mark.png" alt="" width={48} height={46} className="h-6 w-6 rounded-md" />
                Ringgy <span className="-ml-1 text-primary">AI</span>
              </div>
              {NAV.map((n) => (
                <div key={n} className="rounded px-[11px] py-[9px] text-[13.5px] font-semibold text-body hover:bg-[#DCE4EF]">
                  {n}
                </div>
              ))}
            </div>
            <div className="min-w-0 flex-[1_1_420px] p-[22px]">
              <div className="mb-5 flex flex-wrap gap-3">
                {KPIS.map((k) => (
                  <div key={k.label} className="min-w-[130px] flex-1 rounded-md border border-line-2 bg-white px-4 py-3.5">
                    <div className="mb-2 text-[11px] uppercase tracking-[.1em] text-faint">{k.label}</div>
                    <div className="text-[27px] leading-none">{k.value}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-3">
                <div className="overflow-hidden rounded-md border border-line-2 bg-white">
                  <div className="border-b border-[#E9EEF6] px-4 py-3 text-[12.5px] font-bold uppercase tracking-[.06em] text-subtle">Recent calls</div>
                  {CALLS.map((c) => (
                    <div key={c.name} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2.5 border-b border-[#EEF2F8] px-4 py-3">
                      <div>
                        <div className="text-sm font-semibold">{c.name}</div>
                        <div className="text-[12.5px] text-[#79889B]">{c.detail}</div>
                      </div>
                      <div className="text-[11.5px] font-bold uppercase tracking-[.06em]" style={{ color: c.color }}>
                        {c.status}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-md bg-ink p-4 text-on-dark">
                  <div className="mb-3.5 text-[11.5px] uppercase tracking-[.12em] text-[#7E93AD]">Live transcript</div>
                  <div className="mb-4 flex h-[34px] items-end gap-0.5">
                    {BARS.map((b, i) => (
                      <div
                        key={i}
                        className="h-full flex-1 origin-bottom animate-wave rounded-[1px] bg-sky"
                        style={{ animationDelay: b.delay, animationDuration: b.duration }}
                      />
                    ))}
                  </div>
                  <div className="text-[13px] leading-[1.6] text-on-dark-muted">“…I can get a technician out Tuesday between 2 and 4. Does that work for you?”</div>
                  <div className="mt-4 border-t border-on-dark-line pt-3.5 text-xs text-on-dark-accent">AI activity · Checking availability</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
