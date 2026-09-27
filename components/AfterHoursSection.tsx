import Image from "next/image";
import { container } from "./ui";

export function AfterHoursSection() {
  return (
    <section className={`${container} py-[clamp(72px,9vw,128px)]`}>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,310px),1fr))] items-center gap-[clamp(32px,5vw,72px)]">
        <div data-reveal="">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[.14em] text-brand">After hours</div>
          <h2 className="mb-5 text-[clamp(32px,4.4vw,56px)] font-medium leading-[1.05] tracking-[-.02em]">Your Business Doesn&apos;t Close When Your Office Does</h2>
          <p className="m-0 text-[17px] leading-[1.6] text-[#3E4C5E]">When your team is unavailable, Ringgy keeps answering.</p>
        </div>
        <div data-reveal="" className="rounded-md bg-ink p-[26px] text-center text-on-dark">
          <div className="text-[clamp(42px,6vw,64px)] leading-none tracking-[-.02em]">11:47 PM</div>
          <div className="mt-3 text-sm text-on-dark-muted">Customer calls. No receptionist.</div>
        </div>
      </div>
      <div data-reveal="" className="mt-[clamp(36px,5vw,56px)]">
        <Image
          src="/assets/after-hours-flow-v2.png"
          alt="Normally: customer calls and it goes to voicemail. With Ringgy: customer calls, Ringgy answers, books the appointment, and you get the job."
          width={1994}
          height={789}
          sizes="(max-width: 1520px) 100vw, 1464px"
          className="block h-auto w-full"
        />
      </div>
    </section>
  );
}
