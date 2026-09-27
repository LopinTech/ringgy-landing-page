import { container, sectionPad } from "../ui";
import { DEMO_PHONE_TEL } from "@/lib/site";

export function HvacCta() {
  return (
    <section id="cta" className="border-t border-line bg-surface">
      <div className={`${container} ${sectionPad}`}>
        <div
          data-reveal=""
          className="relative grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-center gap-8 overflow-hidden rounded-[28px] bg-brand p-[clamp(28px,6vw,80px)]"
        >
          <div className="pointer-events-none absolute -right-[120px] -top-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(143,195,250,.35),rgba(143,195,250,0)_70%)]" />
          <div className="relative">
            <h2 className="mb-[22px] text-[clamp(36px,4.8vw,66px)] font-bold leading-[1.06] tracking-[-.025em] text-white">Be Ready Before the Next Heat Wave</h2>
            <p className="mb-[34px] max-w-[30em] text-[clamp(17px,1.5vw,21px)] leading-[1.6] text-[#DCE9FB]">
              Let Ringgy answer every heating and cooling call, sort the emergencies, and book the jobs, 24/7.
            </p>
            <div className="flex flex-wrap gap-3.5">
              <a href="#cta" className="rounded-lg bg-white px-8 py-[18px] text-lg font-bold text-brand transition-colors hover:bg-tint-2 hover:text-brand-dark">
                Start With Ringgy
              </a>
              <a href={DEMO_PHONE_TEL} className="rounded-lg border-[1.5px] border-[#8FC3FA] px-8 py-[18px] text-lg font-medium text-white transition-colors hover:bg-brand-dark">
                Call Our HVAC Demo →
              </a>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="w-[min(100%,480px)]">
              <svg viewBox="-40 0 500 420" role="img" aria-label="Ringgy answering an HVAC call and booking the job" style={{ display: "block", width: "100%", height: "auto", overflow: "visible" }}>
                <defs>
                  <filter id="ctaShadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="12" stdDeviation="14" floodColor="#06203F" floodOpacity=".35" /></filter>
                  <filter id="ctaChip" x="-20%" y="-40%" width="140%" height="180%"><feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#06203F" floodOpacity=".25" /></filter>
                </defs>
                <circle cx="210" cy="210" r="150" fill="none" stroke="#8FC3FA" strokeWidth="2" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "hwRing 3.2s ease-out infinite" }} />
                <circle cx="210" cy="210" r="150" fill="none" stroke="#8FC3FA" strokeWidth="2" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "hwRing 3.2s ease-out 1.6s infinite" }} />
                <rect x="135" y="58" width="150" height="304" rx="28" fill="#0F2540" filter="url(#ctaShadow)" />
                <rect x="145" y="70" width="130" height="280" rx="20" fill="#FFFFFF" />
                <rect x="188" y="76" width="44" height="8" rx="4" fill="#0F2540" />
                <text x="210" y="108" textAnchor="middle" style={{ fontSize: "10px", fontWeight: "500", letterSpacing: ".12em", fill: "#8693A3" }}>INCOMING CALL</text>
                <circle cx="210" cy="150" r="30" fill="#E3EDFC" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "hwGlow 2.4s ease-in-out infinite" }} />
                <g transform="translate(187.2 127.2) scale(1.9)">
                  <path d="M4.2 12.5a7.8 7.8 0 0115.6 0" fill="none" stroke="#1F6FEB" strokeWidth="1.5" strokeLinecap="round" />
                  <rect x="2.6" y="11" width="3" height="5.2" rx="1.5" fill="#1F6FEB" /><rect x="18.4" y="11" width="3" height="5.2" rx="1.5" fill="#1F6FEB" />
                  <rect x="6.3" y="7.6" width="11.4" height="10" rx="4" fill="#8FC3FA" />
                  <circle cx="9.8" cy="12" r="1" fill="#0F2540" /><circle cx="14.2" cy="12" r="1" fill="#0F2540" />
                  <path d="M10.2 14.6q1.8 1.2 3.6 0" fill="none" stroke="#0F2540" strokeWidth=".9" strokeLinecap="round" />
                </g>
                <text x="210" y="204" textAnchor="middle" style={{ fontSize: "17px", fontWeight: "700", fill: "#0F2540" }}>Ringgy</text>
                <text x="210" y="223" textAnchor="middle" style={{ fontSize: "11.5px", fill: "#1F9D55", animation: "blink 1.6s infinite" }}>● Answering…</text>
                <rect x="158.0" y="248" width="4.6" height="14" rx="2.3" fill="#1F6FEB" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "ctaBar 0.80s ease-in-out 0.00s infinite" }} /><rect x="166.4" y="244" width="4.6" height="22" rx="2.3" fill="#1F6FEB" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "ctaBar 1.17s ease-in-out 0.53s infinite" }} /><rect x="174.8" y="240" width="4.6" height="30" rx="2.3" fill="#1F6FEB" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "ctaBar 1.04s ease-in-out 0.16s infinite" }} /><rect x="183.2" y="246" width="4.6" height="18" rx="2.3" fill="#1F6FEB" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "ctaBar 0.91s ease-in-out 0.69s infinite" }} /><rect x="191.6" y="238" width="4.6" height="34" rx="2.3" fill="#1F6FEB" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "ctaBar 1.28s ease-in-out 0.32s infinite" }} /><rect x="200.0" y="242" width="4.6" height="26" rx="2.3" fill="#1F6FEB" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "ctaBar 1.15s ease-in-out 0.85s infinite" }} /><rect x="208.4" y="236" width="4.6" height="38" rx="2.3" fill="#1F6FEB" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "ctaBar 1.02s ease-in-out 0.48s infinite" }} /><rect x="216.8" y="243" width="4.6" height="24" rx="2.3" fill="#1F6FEB" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "ctaBar 0.89s ease-in-out 0.11s infinite" }} /><rect x="225.2" y="239" width="4.6" height="32" rx="2.3" fill="#1F6FEB" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "ctaBar 1.26s ease-in-out 0.64s infinite" }} /><rect x="233.6" y="245" width="4.6" height="20" rx="2.3" fill="#1F6FEB" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "ctaBar 1.13s ease-in-out 0.27s infinite" }} /><rect x="242.0" y="241" width="4.6" height="28" rx="2.3" fill="#1F6FEB" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "ctaBar 1.00s ease-in-out 0.80s infinite" }} /><rect x="250.4" y="247" width="4.6" height="16" rx="2.3" fill="#1F6FEB" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "ctaBar 0.87s ease-in-out 0.43s infinite" }} /><rect x="258.8" y="249" width="4.6" height="12" rx="2.3" fill="#1F6FEB" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "ctaBar 1.24s ease-in-out 0.06s infinite" }} />
                <text x="210" y="293" textAnchor="middle" style={{ fontSize: "11px", fill: "#8693A3", fontVariantNumeric: "tabular-nums" }}>Northside Heating &amp; Air</text>
                <circle cx="210" cy="322" r="17" fill="#E5484D" />
                <path d="M203 322.5h14" stroke="#fff" strokeWidth="3" strokeLinecap="round" />

                <g style={{ transformBox: "fill-box", transformOrigin: "center", animation: "hwFloat 4.4s ease-in-out infinite" }}>
                  <rect x="-34" y="118" width="170" height="54" rx="14" fill="#FFFFFF" filter="url(#ctaChip)" />
                  <circle cx="-6" cy="145" r="15" fill="#FDE4E5" />
                  <path d="M-6 136v10" stroke="#E5484D" strokeWidth="2.4" strokeLinecap="round" /><circle cx="-6" cy="151" r="1.6" fill="#E5484D" />
                  <text x="16" y="141" style={{ fontSize: "13px", fontWeight: "700", fill: "#0F2540" }}>No cooling</text>
                  <text x="16" y="158" style={{ fontSize: "11.5px", fill: "#B42318" }}>Priority · infant home</text>
                </g>
                <g style={{ transformBox: "fill-box", transformOrigin: "center", animation: "hwFloat 4.4s ease-in-out 1.4s infinite" }}>
                  <rect x="288" y="258" width="164" height="58" rx="14" fill="#FFFFFF" filter="url(#ctaChip)" />
                  <circle cx="317" cy="287" r="15" fill="#DDF4EA" />
                  <path d="M310.5 287.5l4.5 4.5 8-8.5" fill="none" stroke="#12A36C" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="339" y="282" style={{ fontSize: "13px", fontWeight: "700", fill: "#0F2540" }}>Job booked</text>
                  <text x="339" y="300" style={{ fontSize: "11.5px", fill: "#58687B" }}>Today · 2–4 PM</text>
                </g>
                <g style={{ transformBox: "fill-box", transformOrigin: "center", animation: "hwFloat 4.4s ease-in-out 2.6s infinite" }}>
                  <rect x="296" y="92" width="92" height="36" rx="18" fill="#FFFFFF" filter="url(#ctaChip)" />
                  <text x="342" y="115" textAnchor="middle" style={{ fontSize: "14px", fontWeight: "700", fill: "#1557B0" }}>24/7</text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
