const ITEMS = [
  "24/7 answering",
  "Appointment booking",
  "Call transcripts",
  "Human handoff",
  "Lead qualification",
  "Service-area rules",
  "SMS confirmations",
  "Your own number",
];

export function TrustStrip() {
  return (
    <div className="overflow-hidden border-y border-line-2 bg-[#EDF1F7]">
      <div className="flex w-max animate-drift">
        {[0, 1].map((set) => (
          <div key={set} className="flex flex-none gap-12 pr-12" aria-hidden={set === 1}>
            {ITEMS.map((item) => (
              <div key={item} className="whitespace-nowrap py-3.5 text-[13px] font-semibold tracking-[.04em] text-muted">
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
