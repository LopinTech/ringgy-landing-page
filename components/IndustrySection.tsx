import Image from "next/image";
import { container } from "./ui";

const TOP = [
  { img: "ind-plumbing", name: "Plumbing", body: "Handle leaks, repairs and new installations." },
  { img: "ind-electrical", name: "Electrical", body: "Capture urgent calls and schedule service faster." },
  { img: "ind-garage", name: "Garage Door", body: "Get more appointments for repairs and installations." },
];
const BOTTOM = [
  { img: "ind-pest", name: "Pest Control", body: "Respond to urgent pest issues 24/7." },
  { img: "ind-roofing", name: "Roofing", body: "Never miss a lead for inspections and repairs." },
  { img: "ind-landscaping", name: "Landscaping", body: "Turn calls into booked lawn and landscape jobs." },
  { img: "ind-general", name: "General Home Services", body: "From handyman work to seasonal services, we’ve got you covered." },
];

function IndustryCard({ img, name, body, compact }: { img: string; name: string; body: string; compact?: boolean }) {
  return (
    <div
      data-reveal=""
      className={`flex flex-col rounded-[14px] border border-line bg-white shadow-[0_10px_30px_-22px_rgba(21,87,176,.35)] transition-[transform,box-shadow,border-color] duration-[250ms] hover:-translate-y-[3px] hover:border-[#C9DAF2] hover:shadow-[0_18px_36px_-20px_rgba(21,87,176,.4)] ${
        compact ? "px-[22px] pb-[26px] pt-6" : "px-7 pb-[30px] pt-[26px]"
      }`}
    >
      <div className="mb-[18px] flex h-24 w-24 items-center justify-center rounded-full bg-tint-2">
        <Image src={`/assets/${img}.png`} alt="" width={168} height={img === "ind-general" ? 168 : 112} className="block h-auto w-[84px]" />
      </div>
      <div className="mb-2.5 text-[21px] font-bold leading-[1.25] tracking-[-.01em] text-ink">{name}</div>
      <div className="text-[15px] leading-[1.55] text-body [text-wrap:pretty]">{body}</div>
    </div>
  );
}

export function IndustrySection() {
  return (
    <section className="border-y border-line bg-surface">
      <div className={`${container} py-[clamp(64px,8vw,104px)]`}>
        <div data-reveal="" className="mx-auto max-w-[44em] text-center">
          <div className="mb-[22px] inline-block rounded-full bg-tint px-[18px] py-2 text-[13px] font-medium uppercase tracking-[.1em] text-brand">
            Home services
          </div>
          <h2 className="mb-5 text-[clamp(32px,4.4vw,54px)] font-bold leading-[1.12] tracking-[-.02em] text-ink [text-wrap:balance]">
            Built for the Businesses That Never Stop <span className="text-primary">Ringing</span>
          </h2>
          <p className="mx-auto max-w-[32em] text-[clamp(16px,1.4vw,19px)] leading-[1.6] text-body">
            Ringgy understands the calls, questions, and scheduling needs of your home service business.
          </p>
        </div>
        <div className="mt-[52px] flex flex-wrap gap-[18px]">
          <div
            data-reveal=""
            className="flex flex-[1_1_300px] flex-col overflow-hidden rounded-2xl border-[1.5px] border-[#B9D0F3] bg-[linear-gradient(180deg,#F3F7FE,#EAF1FC)] px-7 pb-7 pt-8 shadow-[0_18px_40px_-26px_rgba(21,87,176,.45)]"
          >
            <div className="mb-[26px] flex h-[170px] w-[220px] items-center justify-center rounded-full bg-[#E1EBFA]">
              <Image src="/assets/ind-hvac.png" alt="" width={500} height={333} className="ml-10 block h-auto w-[250px] max-w-none" />
            </div>
            <div className="mb-3.5 text-[30px] font-bold tracking-[-.01em] text-ink">HVAC</div>
            <div className="mb-7 max-w-[16em] text-[17px] leading-[1.6] text-body">Keep your HVAC business connected with every customer call.</div>
            <div className="mt-auto flex flex-wrap justify-around gap-3 rounded-[10px] bg-[#E1EBFA] px-[18px] py-4 text-[15px] text-text-2">
              {["Answer", "Qualify", "Book"].map((t) => (
                <span key={t} className="flex items-center gap-2">
                  <span className="flex h-[17px] w-[17px] items-center justify-center rounded-full bg-primary text-[10px] text-white">✓</span>
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="flex min-w-0 flex-[2.8_1_740px] flex-col gap-[18px] max-lg:basis-full">
            <div className="grid flex-1 grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-[18px]">
              {TOP.map((i) => (
                <IndustryCard key={i.name} {...i} />
              ))}
            </div>
            <div className="grid flex-1 grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-[18px]">
              {BOTTOM.map((i) => (
                <IndustryCard key={i.name} {...i} compact />
              ))}
            </div>
          </div>
        </div>
        <div data-reveal="" className="mt-12 flex items-center justify-center gap-7">
          <span className="h-[1.5px] w-16 flex-none bg-[#C9DAF2]" />
          <span className="text-center text-[clamp(18px,2vw,23px)] font-medium text-brand">One receptionist. Every customer call.</span>
          <span className="h-[1.5px] w-16 flex-none bg-[#C9DAF2]" />
        </div>
      </div>
    </section>
  );
}
