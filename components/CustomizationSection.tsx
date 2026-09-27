import { Accent, CardWave, DotGrid, container, sectionPad } from "./ui";

const CARDS = [
  {
    title: "Business Information",
    items: ["Business hours", "Service areas", "Phone numbers"],
    color: "#1557B0",
    iconBg: "#E3EDFC",
    bg: "#F2F7FE",
    border: "#DCE7F7",
    wave: "#C9DCFA",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M3 9l1.6-5h14.8L21 9c0 1.4-1.1 2.5-2.5 2.5S16 10.4 16 9c0 1.4-1.1 2.5-2.5 2.5h-3C9.1 11.5 8 10.4 8 9c0 1.4-1.1 2.5-2.5 2.5S3 10.4 3 9z" />
        <path d="M4.5 12.8V20h5.5v-5h4v5h5.5v-7.2c-1.2.4-2.6.1-3.5-.7-.7.6-1.6.9-2.5.9h-3c-.9 0-1.8-.3-2.5-.9-.9.8-2.3 1.1-3.5.7z" />
      </svg>
    ),
  },
  {
    title: "Services",
    items: ["AC repair", "Installation", "Maintenance", "Emergency service"],
    color: "#12A36C",
    iconBg: "#DDF4EA",
    bg: "#F3FBF7",
    border: "#D5EEE2",
    wave: "#BFEBD6",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden>
        <path d="M5 19L15 9" />
        <path d="M14.5 4.5a4 4 0 005 5l-2 .5-3-3z" fill="currentColor" />
        <path d="M5 5l14 14" />
        <path d="M3.5 6.5l3-3 2 2-3 3z" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "AI Instructions",
    items: ["What Ringgy should say", "What it should never say", "When to transfer to a human"],
    color: "#F2A516",
    iconBg: "#FFF0D2",
    bg: "#FFFAF0",
    border: "#F5E8CC",
    wave: "#FBE0AE",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <circle cx="12" cy="3.5" r="1.6" />
        <rect x="11.2" y="4.5" width="1.6" height="3" />
        <rect x="3.5" y="7" width="17" height="12" rx="5" />
        <rect x="1.5" y="11" width="2.5" height="4" rx="1" />
        <rect x="20" y="11" width="2.5" height="4" rx="1" />
        <rect x="7" y="10.5" width="10" height="5" rx="2.5" fill="#FFF4DD" />
        <circle cx="9.5" cy="13" r="1.1" />
        <circle cx="14.5" cy="13" r="1.1" />
      </svg>
    ),
  },
  {
    title: "Availability",
    items: ["Appointment duration", "Working hours", "Available slots"],
    color: "#7C5CE6",
    iconBg: "#ECE6FC",
    bg: "#F8F5FE",
    border: "#DCD2F5",
    wave: "#DCD1FA",
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <rect x="3" y="5" width="18" height="16" rx="3" />
        <rect x="7" y="2.5" width="2.2" height="5" rx="1" />
        <rect x="14.8" y="2.5" width="2.2" height="5" rx="1" />
        <rect x="5.5" y="10" width="13" height="8.5" rx="1.5" fill="#EFE9FD" />
        <circle cx="8.5" cy="12.6" r="1" />
        <circle cx="12" cy="12.6" r="1" />
        <circle cx="15.5" cy="12.6" r="1" />
        <circle cx="8.5" cy="15.8" r="1" />
        <circle cx="12" cy="15.8" r="1" />
        <circle cx="15.5" cy="15.8" r="1" />
      </svg>
    ),
  },
];

export function CustomizationSection() {
  return (
    <section className="relative overflow-hidden bg-surface">
      <div className="pointer-events-none absolute -bottom-40 -left-[120px] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_60%_40%,#E1ECFC,rgba(225,236,252,0)_70%)]" />
      <div className="pointer-events-none absolute left-[34%] top-[48%] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,#E7F0FD,rgba(231,240,253,0)_70%)]" />
      <div className={`${container} ${sectionPad} relative grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-center gap-[clamp(36px,5vw,64px)]`}>
        <div data-reveal="" className="relative flex min-h-[320px] flex-col justify-center self-stretch">
          <div className="mb-[22px] flex items-center gap-[18px] text-[15px] font-bold uppercase tracking-[.16em] text-brand">
            Customization
            <span className="h-[1.5px] w-14 bg-[#C9DCFA]" />
          </div>
          <h2 className="mb-7 text-[clamp(38px,5vw,68px)] font-bold leading-[1.08] tracking-[-.025em] text-ink">
            Ringgy Knows Your
            <br />
            <Accent height={14} strokeWidth={4}>Business</Accent>
          </h2>
          <p className="m-0 max-w-[26em] text-[clamp(17px,1.5vw,21px)] leading-[1.65] text-body">
            Give Ringgy your business information and rules. It handles conversations according to the way your business works.
          </p>
          <DotGrid cols={7} rows={5} gap={29} r={2.6} fill="#9CC0F2" className="bottom-[10%] right-[8%] max-md:hidden" />
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-7">
          {CARDS.map((c) => (
            <div
              key={c.title}
              data-reveal=""
              className="relative min-h-[300px] overflow-hidden rounded-2xl border px-8 pb-[30px] pt-[26px] shadow-[0_10px_30px_-24px_rgba(15,37,64,.3)] transition-[transform,box-shadow] duration-[250ms] hover:-translate-y-[3px] hover:shadow-[0_20px_40px_-24px_rgba(15,37,64,.35)]"
              style={{ background: `linear-gradient(135deg,#fff 0%,${c.bg} 100%)`, borderColor: c.border }}
            >
              <CardWave fill={c.wave} height="55%" />
              <div className="relative mb-5 flex h-[76px] w-[76px] items-center justify-center rounded-2xl" style={{ background: c.iconBg, color: c.color }}>
                {c.icon}
              </div>
              <div className="relative mb-4 text-2xl font-bold tracking-[-.015em] text-ink">{c.title}</div>
              <div className="relative flex flex-col gap-2.5">
                {c.items.map((item) => (
                  <div key={item} className="flex items-center gap-3.5 text-[17px] text-text-2">
                    <span className="h-2 w-2 flex-none rounded-full" style={{ background: c.color }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
