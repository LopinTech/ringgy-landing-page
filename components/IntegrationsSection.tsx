import { Accent, ArrowRightIcon, ChatIcon, Eyebrow, UsersIcon, container, sectionPad } from "./ui";

const INTEGRATIONS = [
  {
    name: "Google Calendar",
    body: "Sync appointments automatically",
    bg: "#FFF7F6",
    border: "#F6E1DF",
    iconBg: "#EAF1FC",
    arrow: "#E5484D",
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="3" fill="#fff" stroke="#1F6FEB" strokeWidth="1.6" />
        <rect x="3" y="3" width="18" height="5" rx="2" fill="#1F6FEB" />
        <text x="12" y="17.8" textAnchor="middle" fontWeight="700" fontSize="8.5" fill="#1557B0">
          31
        </text>
      </svg>
    ),
  },
  {
    name: "SMS",
    body: "Send and receive text messages",
    bg: "#F4F8FE",
    border: "#DCE7F7",
    iconBg: "#E3EDFC",
    arrow: "#1F6FEB",
    icon: <ChatIcon size={34} className="text-primary" />,
  },
  {
    name: "CRM",
    body: "Keep customer data in sync",
    bg: "#F3FBF7",
    border: "#D5EEE2",
    iconBg: "#DDF4EA",
    arrow: "#12A36C",
    icon: <UsersIcon size={34} className="text-[#12A36C]" />,
  },
  {
    name: "Webhooks",
    body: "Connect with your favorite tools",
    bg: "#F8F5FE",
    border: "#E3DBF7",
    iconBg: "#ECE6FC",
    arrow: "#7C5CE6",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7C5CE6" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
        <circle cx="12" cy="6.5" r="3" />
        <circle cx="6" cy="17" r="3" />
        <circle cx="18" cy="17" r="3" />
        <path d="M10.5 9.2L7.5 14.4M9 17h6M13.5 9.2l3 5.2" />
      </svg>
    ),
  },
];

export function IntegrationsSection() {
  return (
    <section className="bg-white">
      <div className={`${container} ${sectionPad} grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-center gap-[clamp(40px,5vw,80px)]`}>
        <div data-reveal="">
          <Eyebrow className="mb-[22px] text-[14.5px] font-medium" lineClassName="w-12 bg-accent-soft">
            Integrations
          </Eyebrow>
          <h2 className="mb-[26px] text-[clamp(36px,4.4vw,60px)] font-bold leading-[1.1] tracking-[-.025em] text-ink">
            Works With Your
            <br />
            <Accent height={14}>Existing Workflow</Accent>
          </h2>
          <p className="m-0 max-w-[34em] text-[clamp(17px,1.5vw,20px)] leading-[1.6] text-body">
            Connect Ringgy with the tools you already use. Streamline your workflow and keep everything in sync.
          </p>
        </div>
        <div className="pt-[30px]">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-[18px]">
            {INTEGRATIONS.map((it) => (
              <div
                key={it.name}
                data-reveal=""
                className="grid grid-cols-[66px_minmax(0,1fr)_40px] items-center gap-[18px] rounded-[14px] border p-5 shadow-[0_10px_26px_-22px_rgba(15,37,64,.3)] transition-transform duration-[250ms] hover:-translate-y-0.5"
                style={{ background: `linear-gradient(135deg,#fff,${it.bg})`, borderColor: it.border }}
              >
                <div className="flex h-[66px] w-[66px] items-center justify-center rounded-[14px]" style={{ background: it.iconBg }}>
                  {it.icon}
                </div>
                <div>
                  <div className="mb-[5px] text-lg font-bold text-ink">{it.name}</div>
                  <div className="text-[15px] leading-[1.5] text-muted">{it.body}</div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: it.iconBg, color: it.arrow }}>
                  <ArrowRightIcon size={18} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
