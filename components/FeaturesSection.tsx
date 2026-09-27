import Image from "next/image";
import { Accent, ArrowRightIcon, CardWave, container, sectionPad } from "./ui";

type Feature = { img: string; title: string; body: string; color: string; bg: string; wave: string; badge?: string };

const FEATURES: Feature[] = [
  { img: "feat-phone", title: "24/7 Call Answering", body: "Never send a customer to voicemail just because your team is busy.", color: "#1F6FEB", bg: "#F4F8FE", wave: "#C9DCFA", badge: "24/7" },
  { img: "feat-chat", title: "Natural Conversations", body: "Ringgy talks with customers naturally instead of forcing them through complicated phone menus.", color: "#12A36C", bg: "#F3FBF7", wave: "#BFEBD6" },
  { img: "feat-cal", title: "Appointment Booking", body: "Check availability and schedule appointments automatically.", color: "#E5484D", bg: "#FFF6F6", wave: "#FACBCD" },
  { img: "feat-user", title: "Customer Qualification", body: "Collect the information your team needs before the appointment.", color: "#7C5CE6", bg: "#F8F6FE", wave: "#DCD1FA" },
  { img: "feat-book", title: "Business Knowledge", body: "Ringgy answers questions using your services, business information, hours, service areas and policies.", color: "#F2A516", bg: "#FFFAF0", wave: "#FBE0AE" },
  { img: "feat-swap", title: "Human Handoff", body: "When a customer needs a person, Ringgy can transfer the call to your team.", color: "#1F6FEB", bg: "#F4F8FE", wave: "#C9DCFA" },
];

function FeatureCard({ f }: { f: Feature }) {
  return (
    <div
      data-reveal=""
      className="relative flex min-h-[300px] flex-col overflow-hidden rounded-2xl border border-line px-[30px] pb-[30px] pt-7 shadow-[0_10px_30px_-24px_rgba(15,37,64,.3)] transition-[transform,box-shadow] duration-[250ms] hover:-translate-y-[3px] hover:shadow-[0_20px_40px_-24px_rgba(15,37,64,.35)]"
      style={{ background: `linear-gradient(135deg,#fff 0%,${f.bg} 100%)` }}
    >
      <CardWave fill={f.wave} />
      <div className="relative mb-[22px] h-[76px] w-[76px]">
        <Image
          src={`/assets/${f.img}.png`}
          alt=""
          width={76}
          height={76}
          className="block h-[76px] w-[76px] rounded-[18px]"
          style={{ boxShadow: `0 8px 18px -10px ${f.color}66` }}
        />
        {f.badge && (
          <span className="absolute -right-[26px] -top-2.5 rounded-[999px_999px_999px_4px] bg-brand px-2.5 py-[3px] text-[15px] font-bold text-white shadow-[0_4px_10px_-4px_rgba(21,87,176,.6)]">
            {f.badge}
          </span>
        )}
      </div>
      <div className="relative mb-3 text-2xl font-bold tracking-[-.015em] text-ink">{f.title}</div>
      <p className="relative mb-[26px] max-w-[22em] text-[17px] leading-[1.55] text-body [text-wrap:pretty]">{f.body}</p>
      <div
        className="relative mt-auto flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white"
        style={{ borderColor: `${f.color}99`, boxShadow: `0 4px 14px -6px ${f.color}80`, color: f.color }}
      >
        <ArrowRightIcon strokeWidth={2.6} />
      </div>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className={`${container} ${sectionPad}`}>
      <div data-reveal="" className="text-center">
        <div className="mb-[18px] flex items-center justify-center gap-[18px] text-[15px] font-bold uppercase tracking-[.16em] text-brand">
          <span className="h-[1.5px] w-[60px] bg-[#C9DCFA]" />
          Six core jobs
          <span className="h-[1.5px] w-[60px] bg-[#C9DCFA]" />
        </div>
        <h2 className="mb-[18px] text-[clamp(34px,4.6vw,62px)] font-bold leading-[1.1] tracking-[-.025em] text-ink [text-wrap:balance]">
          Everything Your <Accent bottom={-8} strokeWidth={3}>Receptionist</Accent> Handles
        </h2>
        <p className="mx-auto max-w-[40em] text-[clamp(16px,1.4vw,20px)] leading-[1.6] text-body">
          Ringgy takes care of the repetitive work so you can focus on running your business.
        </p>
      </div>
      <div className="mt-10 grid grid-cols-[repeat(auto-fit,minmax(min(100%,270px),1fr))] gap-7">
        {FEATURES.slice(0, 4).map((f) => (
          <FeatureCard key={f.title} f={f} />
        ))}
      </div>
      <div className="mt-7 grid grid-cols-[repeat(auto-fill,minmax(min(100%,380px),1fr))] gap-7">
        {FEATURES.slice(4).map((f) => (
          <FeatureCard key={f.title} f={f} />
        ))}
      </div>
    </section>
  );
}
