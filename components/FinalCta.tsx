import { DEMO_PHONE_TEL, SIGNUP_URL } from "@/lib/site";

export function FinalCta() {
  return (
    <section id="cta" className="bg-ink text-on-dark">
      <div className="mx-auto max-w-[1520px] px-4 py-[clamp(80px,10vw,140px)] text-center sm:px-7">
        <div data-reveal="">
          <h2 className="mx-auto mb-[22px] max-w-[18em] text-[clamp(36px,5.4vw,72px)] font-medium leading-[1.02] tracking-[-.025em] text-page">
            Never Miss Another Customer Call
          </h2>
          <p className="mx-auto mb-9 max-w-[34em] text-[clamp(16px,1.4vw,19px)] leading-[1.6] text-on-dark-muted">
            Let Ringgy answer your calls, help your customers and book your next job — 24/7.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={SIGNUP_URL} className="rounded bg-sky px-[30px] py-4 text-base font-bold text-ink-deep transition-colors hover:bg-[#7FB6F8]">
              Start for Free
            </a>
            <a href={DEMO_PHONE_TEL} className="rounded border border-[#2C4A72] px-[30px] py-4 text-base font-semibold text-on-dark transition-colors hover:bg-[#12263F]">
              Call Our Demo →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
