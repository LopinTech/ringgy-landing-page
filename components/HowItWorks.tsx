import Image from "next/image";
import { container } from "./ui";

const STEPS = [
  { num: "01", title: "Customer Calls", body: "Customer calls your business number." },
  { num: "02", title: "Ringgy Answers", body: "Ringgy has a natural conversation and understands what the customer needs." },
  { num: "03", title: "Ringgy Helps", body: "It can answer questions, collect customer information, qualify the request and check availability." },
  { num: "04", title: "Book the Appointment", body: "Ringgy books the appointment based on your availability and business rules." },
  { num: "05", title: "You Get the Job", body: "Your team sees the customer and appointment in the Ringgy dashboard." },
];

export function HowItWorks() {
  return (
    <section id="how" className="bg-ink text-on-dark">
      <div className={`${container} pt-[clamp(72px,9vw,120px)]`}>
        <div data-reveal="" className="overflow-hidden rounded-xl bg-[#DCEFF7] shadow-[0_40px_80px_-40px_rgba(0,0,0,.6)]">
          <Image
            src="/assets/how-ringgy-works.png"
            alt="Incoming call, Ringgy identifies the caller, understands the request, then books the appointment or hands off to your team"
            width={1774}
            height={887}
            sizes="(max-width: 1520px) 100vw, 1464px"
            className="block h-auto w-full"
          />
        </div>
      </div>
      <div className={`${container} grid grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-start gap-[clamp(32px,5vw,80px)] py-[clamp(72px,9vw,128px)]`}>
        <div data-reveal="" className="md:sticky md:top-24">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[.14em] text-on-dark-accent">How Ringgy works</div>
          <h2 className="mb-5 text-[clamp(32px,4.4vw,56px)] font-medium leading-[1.05] tracking-[-.02em] text-page">From Phone Call to Booked Job</h2>
          <p className="m-0 max-w-[28em] text-base leading-[1.65] text-on-dark-muted">
            Five steps, no phone menus, no callbacks. The customer hangs up with an appointment.
          </p>
        </div>
        <div className="flex flex-col">
          {STEPS.map((s) => (
            <div key={s.num} data-reveal="" className="grid grid-cols-[76px_minmax(0,1fr)] gap-5 border-t border-on-dark-line py-[26px]">
              <div className="text-[30px] leading-none text-sky">{s.num}</div>
              <div>
                <div className="mb-2 text-xl font-bold tracking-[-.01em] text-page">{s.title}</div>
                <p className="m-0 max-w-[34em] text-[15.5px] leading-[1.65] text-on-dark-muted">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
