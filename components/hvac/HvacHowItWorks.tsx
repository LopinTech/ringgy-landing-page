"use client";

import { useEffect, useRef } from "react";
import { container, sectionPad } from "../ui";

/** Seconds for one full pass of the dots along all four routes. */
const CYCLE = 7.5;

export function HvacHowItWorks() {
  const svgRef = useRef<SVGSVGElement>(null);

  // Move each [data-dot] along its [data-route] path, staggered, on a loop.
  // Runs only while the diagram is on screen, and not at all for reduced motion.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const dots = Array.from(svg.querySelectorAll<SVGCircleElement>("[data-dot]")).flatMap((d) => {
      const p = svg.querySelector<SVGPathElement>(`[data-route="${d.dataset.dot}"]`);
      return p ? [{ d, p, len: p.getTotalLength(), start: Number(d.dataset.start), dur: Number(d.dataset.dur) }] : [];
    });
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = ((now - t0) / 1000) % CYCLE;
      for (const o of dots) {
        const k = (t - o.start) / o.dur;
        if (k < 0 || k > 1) {
          o.d.setAttribute("opacity", "0");
          continue;
        }
        const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; // ease-in-out
        const pt = o.p.getPointAtLength(e * o.len);
        o.d.setAttribute("cx", String(pt.x));
        o.d.setAttribute("cy", String(pt.y));
        o.d.setAttribute("opacity", String(Math.min(1, k * 8, (1 - k) * 8)));
      }
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting) raf = requestAnimationFrame(tick);
    });
    io.observe(svg);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="how" className="border-t border-line bg-white">
      <div className={`${container} ${sectionPad}`}>
        <div data-reveal="" className="mx-auto max-w-[46em] text-center">
          <div className="mb-4 text-[15px] font-bold uppercase tracking-[.14em] text-brand">How it works</div>
          <h2 className="mb-[18px] text-[clamp(36px,4.4vw,62px)] font-bold leading-[1.1] tracking-[-.025em] text-ink">How Ringgy Works</h2>
          <p className="mx-auto max-w-[34em] text-[clamp(17px,1.4vw,20px)] leading-[1.6] text-body">
            Every call is answered, the caller is identified, and the job is booked or handed to your team.
          </p>
        </div>
        <div
          data-reveal=""
          className="mt-12 overflow-hidden rounded-3xl border max-md:overflow-x-auto max-md:overscroll-x-contain border-[#DCEBF6] bg-[radial-gradient(ellipse_at_50%_45%,#F3FAFE_0%,#E6F3FB_55%,#DCEEF8_100%)] max-md:-mx-2"
        >
          {/* Below md the diagram keeps a legible width and scrolls sideways inside the card. */}
          <svg ref={svgRef} className="max-md:min-w-[820px]" viewBox="0 0 1440 640" role="img" aria-label="Incoming call, Ringgy identifies the caller, understands the request, then books the appointment or hands off to your team" style={{ display: "block", width: "100%", height: "auto" }}>
            <defs>
              <filter id="hwShadow" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#1F6FEB" floodOpacity=".14" /></filter>
              <filter id="hwCard" x="-20%" y="-40%" width="140%" height="180%"><feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#0F2540" floodOpacity=".1" /></filter>
              <radialGradient id="hwGlowGrad"><stop offset="0%" stopColor="#6FD3F5" stopOpacity=".55" /><stop offset="60%" stopColor="#8FDCF7" stopOpacity=".25" /><stop offset="100%" stopColor="#BFE8FA" stopOpacity="0" /></radialGradient>
              <linearGradient id="hwFace" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#A9D4FB" /><stop offset="100%" stopColor="#6FB2F5" /></linearGradient>
            </defs>
            <path d="M0 470 C 200 440, 300 520, 520 500" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="4 8" opacity=".7" />
            <path d="M1130 505 C 1190 520, 1250 500, 1275 462" fill="none" stroke="#A9C9E2" strokeWidth="1.8" strokeDasharray="4 6" />
            <path d="M447 248 L 425 286" fill="none" stroke="#A9C9E2" strokeWidth="1.8" strokeDasharray="4 5" />
            <path d="M1103 183 L 1145 183" fill="none" stroke="#1F9BEF" strokeWidth="2.2" />

            <path id="hwP1" data-route="hwP1" d="M215 270 C 290 270, 300 332, 372 332" fill="none" stroke="#1F9BEF" strokeWidth="2.2" strokeLinecap="round" opacity=".55" /><path d="M215 270 C 290 270, 300 332, 372 332" fill="none" stroke="#1F9BEF" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="6 8" style={{ animation: "hwFlow 1.2s linear infinite" }} /><path id="hwP2" data-route="hwP2" d="M470 332 C 560 342, 590 318, 665 322" fill="none" stroke="#1F9BEF" strokeWidth="2.2" strokeLinecap="round" opacity=".55" /><path d="M470 332 C 560 342, 590 318, 665 322" fill="none" stroke="#1F9BEF" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="6 8" style={{ animation: "hwFlow 1.2s linear infinite" }} /><path id="hwP3" data-route="hwP3" d="M789 316 C 900 302, 915 183, 997 183" fill="none" stroke="#1F9BEF" strokeWidth="2.2" strokeLinecap="round" opacity=".55" /><path d="M789 316 C 900 302, 915 183, 997 183" fill="none" stroke="#1F9BEF" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="6 8" style={{ animation: "hwFlow 1.2s linear infinite" }} /><path id="hwP4" data-route="hwP4" d="M782 366 C 900 372, 915 476, 1024 476" fill="none" stroke="#6E8299" strokeWidth="2.2" strokeLinecap="round" opacity=".55" /><path d="M782 366 C 900 372, 915 476, 1024 476" fill="none" stroke="#6E8299" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="6 8" style={{ animation: "hwFlow 1.2s linear infinite" }} />
            <circle cx="372" cy="332" r="6" fill="#1F9BEF" stroke="#fff" strokeWidth="2.5" />
            <circle cx="997" cy="183" r="6" fill="#1F9BEF" stroke="#fff" strokeWidth="2.5" />
            <circle cx="1024" cy="476" r="6" fill="#6E8299" stroke="#fff" strokeWidth="2.5" />

            <circle cx="165" cy="270" r="100" fill="#FFFFFF" opacity=".25" />
            <circle cx="165" cy="270" r="66" fill="none" stroke="#9CCBF2" strokeWidth="2" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "hwRing 3s ease-out 0s infinite" }} /><circle cx="165" cy="270" r="66" fill="none" stroke="#9CCBF2" strokeWidth="2" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "hwRing 3s ease-out 1.5s infinite" }} />

          <circle cx="165" cy="270" r="80" fill="#FFFFFF" opacity=".35" />
          <circle cx="165" cy="270" r="65" fill="#EAF5FC" stroke="#D2E8F7" strokeWidth="1.5" />
          <circle cx="165" cy="270" r="50" fill="#FFFFFF" filter="url(#hwShadow)" />
            <g transform="translate(142.2 247.2) scale(1.9)" fill="none" stroke="#1F6FEB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6.6 10.8a15.2 15.2 0 006.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 013 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z" /><path d="M15 2.8a6.5 6.5 0 016.2 6.2" /><path d="M15 6.3a3 3 0 012.7 2.7" /></g>
            <text x="165" y="370" textAnchor="middle" style={{ fontSize: "22px", fontWeight: "700", fill: "#0F2540" }}>Incoming Call</text><text x="165" y="398" textAnchor="middle" style={{ fontSize: "17.5px", fill: "#58687B" }}>Customer calls your business</text>


          <circle cx="425" cy="332" r="62" fill="#FFFFFF" opacity=".35" />
          <circle cx="425" cy="332" r="59" fill="#EAF5FC" stroke="#D2E8F7" strokeWidth="1.5" />
          <circle cx="425" cy="332" r="45" fill="#FFFFFF" filter="url(#hwShadow)" />
            <g transform="translate(404.6 311.6) scale(1.7)" fill="none" stroke="#1F6FEB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3.8" /><path d="M4.8 20.5c0-4 3.2-6.8 7.2-6.8s7.2 2.8 7.2 6.8" /></g>
            <text x="425" y="416" textAnchor="middle" style={{ fontSize: "22px", fontWeight: "700", fill: "#0F2540" }}>Identify Caller</text><text x="425" y="444" textAnchor="middle" style={{ fontSize: "17.5px", fill: "#58687B" }}>Ringgy recognizes</text><text x="425" y="468" textAnchor="middle" style={{ fontSize: "17.5px", fill: "#58687B" }}>the customer</text>

            <circle cx="727" cy="328" r="120" fill="url(#hwGlowGrad)" style={{ animation: "hwGlow 3s ease-in-out infinite" }} />
            <circle cx="727" cy="328" r="82" fill="none" stroke="#9CCBF2" strokeWidth="2" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "hwRing 3s ease-out 0.4s infinite" }} /><circle cx="727" cy="328" r="82" fill="none" stroke="#9CCBF2" strokeWidth="2" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "hwRing 3s ease-out 1.9s infinite" }} />
            <circle cx="727" cy="328" r="95" fill="#FFFFFF" opacity=".35" />
            <circle cx="727" cy="328" r="78" fill="#C8EEF8" stroke="#A6E1F4" strokeWidth="2" />
            <circle cx="727" cy="328" r="62" fill="#FFFFFF" filter="url(#hwShadow)" />
            <g transform="translate(694.6 295.6) scale(2.7)">
            <path d="M4.2 12.5a7.8 7.8 0 0115.6 0" fill="none" stroke="#1F6FEB" strokeWidth="1.4" strokeLinecap="round" />
            <rect x="2.6" y="11" width="3" height="5.2" rx="1.5" fill="#1F6FEB" />
            <rect x="18.4" y="11" width="3" height="5.2" rx="1.5" fill="#1F6FEB" />
            <rect x="6.3" y="7.6" width="11.4" height="10" rx="4" fill="url(#hwFace)" />
            <circle cx="9.8" cy="12" r="1" fill="#0F2540" /><circle cx="14.2" cy="12" r="1" fill="#0F2540" />
            <path d="M10.2 14.6q1.8 1.2 3.6 0" fill="none" stroke="#0F2540" strokeWidth=".9" strokeLinecap="round" />
            <path d="M19.9 16.2c0 2.6-1.8 4-4.6 4.2" fill="none" stroke="#1F6FEB" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="14.6" cy="20.4" r="1.1" fill="#1F6FEB" />
          </g>
            <text x="727" y="462" textAnchor="middle" style={{ fontSize: "32px", fontWeight: "700", fill: "#0F2540" }}>Ringgy</text><text x="727" y="496" textAnchor="middle" style={{ fontSize: "19px", fill: "#58687B" }}>Understands the request</text><text x="727" y="520" textAnchor="middle" style={{ fontSize: "19px", fill: "#58687B" }}>and gathers the details</text>

            <circle cx="1053" cy="183" r="58" fill="none" stroke="#9CCBF2" strokeWidth="2" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "hwRing 3s ease-out 0.8s infinite" }} />

          <circle cx="1053" cy="183" r="70" fill="#FFFFFF" opacity=".35" />
          <circle cx="1053" cy="183" r="62" fill="#EAF5FC" stroke="#D2E8F7" strokeWidth="1.5" />
          <circle cx="1053" cy="183" r="48" fill="#FFFFFF" filter="url(#hwShadow)" />
            <g transform="translate(1030.2 160.2) scale(1.9)" fill="none" stroke="#1F6FEB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="5" width="16" height="15" rx="2.5" /><path d="M3.5 9.5h16M8 3v4M15 3v4" /><g fill="#1F6FEB" stroke="none"><circle cx="7.5" cy="12.5" r=".9" /><circle cx="11.5" cy="12.5" r=".9" /><circle cx="15.5" cy="12.5" r=".9" /><circle cx="7.5" cy="16" r=".9" /><circle cx="11.5" cy="16" r=".9" /></g><circle cx="18.5" cy="18.5" r="4" fill="#fff" /><circle cx="18.5" cy="18.5" r="3.4" fill="#1F6FEB" stroke="none" /><path d="M16.9 18.6l1.1 1.1 2.1-2.2" stroke="#fff" strokeWidth="1.2" /></g>
            <text x="1053" y="272" textAnchor="middle" style={{ fontSize: "22px", fontWeight: "700", fill: "#0F2540" }}>Book Appointment</text><text x="1053" y="300" textAnchor="middle" style={{ fontSize: "17.5px", fill: "#58687B" }}>Checks availability</text><text x="1053" y="324" textAnchor="middle" style={{ fontSize: "17.5px", fill: "#58687B" }}>and confirms</text>


          <circle cx="1080" cy="476" r="70" fill="#FFFFFF" opacity=".35" />
          <circle cx="1080" cy="476" r="62" fill="#EAF5FC" stroke="#D2E8F7" strokeWidth="1.5" />
          <circle cx="1080" cy="476" r="48" fill="#FFFFFF" filter="url(#hwShadow)" />
            <g transform="translate(1057.2 453.2) scale(1.9)" fill="none" stroke="#4A5A6C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="9" r="3.8" /><path d="M4.8 21c0-4 3.2-6.6 7.2-6.6s7.2 2.6 7.2 6.6" /><path d="M7.3 9a4.7 4.7 0 019.4 0" /><rect x="6.3" y="8.3" width="1.8" height="3" rx=".9" fill="#4A5A6C" /><rect x="15.9" y="8.3" width="1.8" height="3" rx=".9" fill="#4A5A6C" /></g>
            <text x="1080" y="565" textAnchor="middle" style={{ fontSize: "22px", fontWeight: "700", fill: "#0F2540" }}>Human Handoff</text><text x="1080" y="593" textAnchor="middle" style={{ fontSize: "17.5px", fill: "#58687B" }}>Transfers to your team</text><text x="1080" y="617" textAnchor="middle" style={{ fontSize: "17.5px", fill: "#58687B" }}>when needed</text>

            <g style={{ transformBox: "fill-box", transformOrigin: "center", animation: "hwFloat 4.5s ease-in-out infinite" }}>
              <rect x="360" y="172" width="250" height="70" rx="12" fill="#FFFFFF" filter="url(#hwCard)" />
              <circle cx="396" cy="207" r="18" fill="#DCEBFB" />
              <g transform="translate(384.6 195.6) scale(0.95)" fill="none" stroke="#1F6FEB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="3.8" /><path d="M4.8 20.5c0-4 3.2-6.8 7.2-6.8s7.2 2.8 7.2 6.8" /></g>
              <text x="424" y="201" style={{ fontSize: "17px", fontWeight: "700", fill: "#0F2540" }}>New customer</text>
              <text x="424" y="224" style={{ fontSize: "14px", fill: "#66768A" }}>+1 (555) 248-7392</text>
              <rect x="556" y="188" width="38" height="20" rx="10" fill="#D6E6FB" />
              <text x="575" y="202" textAnchor="middle" style={{ fontSize: "11.5px", fontWeight: "700", fill: "#1557B0" }}>New</text>
            </g>

            <g style={{ transformBox: "fill-box", transformOrigin: "center", animation: "hwFloat 4.5s ease-in-out 1.2s infinite" }}>
              <rect x="1145" y="140" width="268" height="84" rx="14" fill="#FFFFFF" filter="url(#hwCard)" />
              <circle cx="1188" cy="182" r="24" fill="#EAF2FD" />
              <g transform="translate(1173.6 167.6) scale(1.2)" fill="none" stroke="#1F6FEB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="5" width="16" height="15" rx="2.5" /><path d="M3.5 9.5h16M8 3v4M15 3v4" /><g fill="#1F6FEB" stroke="none"><circle cx="7.5" cy="12.5" r=".9" /><circle cx="11.5" cy="12.5" r=".9" /><circle cx="15.5" cy="12.5" r=".9" /><circle cx="7.5" cy="16" r=".9" /><circle cx="11.5" cy="16" r=".9" /></g><circle cx="18.5" cy="18.5" r="4" fill="#fff" /><circle cx="18.5" cy="18.5" r="3.4" fill="#1F6FEB" stroke="none" /><path d="M16.9 18.6l1.1 1.1 2.1-2.2" stroke="#fff" strokeWidth="1.2" /></g>
              <text x="1224" y="175" style={{ fontSize: "18px", fontWeight: "700", fill: "#0F2540" }}>Appointment Booked</text>
              <text x="1224" y="201" style={{ fontSize: "15px", fill: "#58687B" }}>Oct 2, 2026 · 2:00 PM</text>
            </g>

            <g style={{ transformBox: "fill-box", transformOrigin: "center", animation: "hwFloat 4.5s ease-in-out 2.4s infinite" }}>
              <rect x="1170" y="422" width="200" height="40" rx="20" fill="#FFFFFF" filter="url(#hwCard)" />
              <g transform="translate(1184 430) scale(1)" fill="#4A5A6C"><circle cx="8.5" cy="8" r="3.2" /><circle cx="16" cy="8.5" r="2.7" /><path d="M2.5 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5z" /><path d="M15.5 19c0-2-.6-3.6-1.7-4.8.6-.2 1.3-.3 2.2-.3 3 0 5.5 2 5.5 5.1z" /></g>
              <text x="1216" y="447" style={{ fontSize: "14.5px", fill: "#3E4C5E" }}>Connected to your team</text>
            </g>

            <circle data-dot="hwP1" data-start="0" data-dur="1.3" r="7" fill="#1F9BEF" stroke="#fff" strokeWidth="3" opacity="0" />
            <circle data-dot="hwP2" data-start="1.3" data-dur="1.3" r="7" fill="#1F9BEF" stroke="#fff" strokeWidth="3" opacity="0" />
            <circle data-dot="hwP3" data-start="3.1" data-dur="1.5" r="7" fill="#1F9BEF" stroke="#fff" strokeWidth="3" opacity="0" />
            <circle data-dot="hwP4" data-start="4.9" data-dur="1.5" r="7" fill="#6E8299" stroke="#fff" strokeWidth="3" opacity="0" />
          </svg>
        </div>
      </div>
    </section>
  );
}
