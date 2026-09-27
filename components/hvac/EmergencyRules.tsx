import { Eyebrow, container, sectionPad } from "../ui";

const RULES = [
  { when: "No heat and indoor temp below 55°F", then: "Book priority slot, alert on-call tech", bg: "#FFF0D2", fg: "#9A5B00" },
  { when: "Caller reports gas smell or CO alarm", then: "Read your safety script, transfer to on-call line", bg: "#FDE4E5", fg: "#B42318" },
  { when: "Elderly, infant or medical need in home", then: "Flag as priority on the job ticket", bg: "#FFF0D2", fg: "#9A5B00" },
  { when: "Caller asks for a person", then: "Transfer to your team", bg: "#E3EDFC", fg: "#1557B0" },
];

export function EmergencyRules() {
  return (
    <section id="emergencies" className="bg-surface">
      <div className={`${container} ${sectionPad} grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-center gap-[clamp(40px,5vw,80px)]`}>
        <div data-reveal="">
          <Eyebrow>Emergencies</Eyebrow>
          <h2 className="mb-6 text-[clamp(34px,4.2vw,58px)] font-bold leading-[1.1] tracking-[-.025em] text-ink">
            Urgent Calls Follow <span className="text-primary">Your Rules</span>
          </h2>
          <p className="mb-5 max-w-[30em] text-[clamp(17px,1.4vw,20px)] leading-[1.7] text-body">
            A no-heat call from an 82-year-old in January isn’t the same as a tune-up request in April. You decide what counts as urgent and what
            Ringgy does about it.
          </p>
          <p className="m-0 max-w-[32em] text-base leading-[1.6] text-muted">
            Safety calls go to your on-call line with your own safety script. Ringgy never guesses at a diagnosis.
          </p>
        </div>
        <div data-reveal="" className="overflow-hidden rounded-[20px] border border-line bg-white shadow-[0_30px_60px_-40px_rgba(21,87,176,.35)]">
          <div className="flex items-center justify-between gap-3 border-b border-line bg-[#FAFBFD] px-7 py-5">
            <span className="text-[17px] font-bold">Escalation rules</span>
            <span className="text-[13.5px] text-faint">Example setup</span>
          </div>
          <div className="flex flex-col">
            {RULES.map((r) => (
              <div key={r.when} className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] items-center gap-x-6 gap-y-3 border-b border-[#EEF2F8] px-7 py-[22px]">
                <div className="flex items-center gap-3.5">
                  <span className="flex-none rounded-md bg-[#EEF2F8] px-[9px] py-1 text-xs font-bold tracking-[.08em] text-muted">IF</span>
                  <span className="text-[17px] font-medium text-ink">{r.when}</span>
                </div>
                <div className="flex items-center gap-3.5">
                  <span className="flex-none rounded-md px-[9px] py-1 text-xs font-bold tracking-[.08em]" style={{ background: r.bg, color: r.fg }}>
                    THEN
                  </span>
                  <span className="text-[16.5px] text-text-2">{r.then}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
