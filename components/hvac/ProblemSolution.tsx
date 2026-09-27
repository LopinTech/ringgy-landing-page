import { CheckIcon, container, sectionPad } from "../ui";

const PAIRS = [
  {
    problem: "Heat-wave call floods",
    problemBody: "The first 95° week sends call volume through the roof. Customers wait on hold, then hang up.",
    fix: "Every call picked up",
    fixBody: "Ringgy can answer several calls at once, so nobody waits on hold during a heat wave or cold snap.",
  },
  {
    problem: "Techs can’t answer from the job",
    problemBody: "Owner-operators are in attics and on roofs. The phone rings through to voicemail.",
    fix: "Booked while you work",
    fixBody: "Ringgy answers, books the appointment, and the job appears in your dashboard for dispatch.",
  },
  {
    problem: "After-hours no-heat and no-cool calls",
    problemBody: "Emergencies don’t wait for 8 AM. Night and weekend callers book whoever answers.",
    fix: "24/7 answering with triage",
    fixBody: "Ringgy sorts urgent from routine, books the next open slot, or follows your on-call escalation.",
  },
  {
    problem: "The same questions all day",
    problemBody: "Brands you service, tune-up pricing, financing, service areas. Your front desk repeats it all day.",
    fix: "Answers from your playbook",
    fixBody: "Ringgy answers using the services, prices, brands and policies you give it.",
  },
  {
    problem: "Techs arrive without the details",
    problemBody: "No system type, no age, no symptoms. The first 15 minutes on site are spent asking questions.",
    fix: "Full job details up front",
    fixBody: "Ringgy collects system type, age, symptoms, address and plan status before the appointment.",
  },
  {
    problem: "Tune-ups and plans slip through",
    problemBody: "Maintenance calls get pushed aside in peak season, and plan renewals never get booked.",
    fix: "Maintenance booked on autopilot",
    fixBody: "Ringgy books tune-ups into the slots you choose and explains your maintenance plan when callers ask.",
  },
];

export function ProblemSolution() {
  return (
    <section id="solutions" className="border-t border-line bg-white">
      <div className={`${container} ${sectionPad}`}>
        <div data-reveal="" className="mx-auto max-w-[46em] text-center">
          <div className="mb-[22px] inline-block rounded-full bg-tint px-[22px] py-[9px] text-[15px] font-bold uppercase tracking-[.1em] text-brand">How Ringgy helps</div>
          <h2 className="mb-5 text-[clamp(36px,4.6vw,62px)] font-bold leading-[1.1] tracking-[-.025em] text-ink [text-wrap:balance]">
            Every HVAC Headache, <span className="text-primary">Handled</span>
          </h2>
          <p className="mx-auto max-w-[34em] text-[clamp(17px,1.5vw,20px)] leading-[1.6] text-body">
            The problems your office deals with every season, and what Ringgy does about each one.
          </p>
        </div>
        <div className="mt-14 flex flex-col gap-[18px]">
          <div className="grid grid-cols-2 gap-[18px] px-2 text-sm font-bold uppercase tracking-[.12em] max-md:hidden">
            <span className="text-[#B42318]">The problem</span>
            <span className="pl-1 text-brand">With Ringgy</span>
          </div>
          {PAIRS.map((p) => (
            <div key={p.problem} data-reveal="" className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] items-stretch gap-[18px]">
              <div className="flex gap-5 rounded-[14px] border border-[#F7DCDD] bg-[#FFF7F7] px-7 py-6">
                <span className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full bg-[#FDE4E5] text-[15px] font-bold text-[#E5484D]" aria-label="Problem">
                  ✕
                </span>
                <div>
                  <div className="mb-1.5 text-xl font-bold text-ink">{p.problem}</div>
                  <div className="text-[16.5px] leading-[1.6] text-muted">{p.problemBody}</div>
                </div>
              </div>
              <div className="flex gap-5 rounded-[14px] border border-[#D6E4F8] bg-[#F4F8FE] px-7 py-6">
                <span className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full bg-primary text-white" aria-label="With Ringgy">
                  <CheckIcon size={16} strokeWidth={3.2} />
                </span>
                <div>
                  <div className="mb-1.5 text-xl font-bold text-ink">{p.fix}</div>
                  <div className="text-[16.5px] leading-[1.6] text-body">{p.fixBody}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
