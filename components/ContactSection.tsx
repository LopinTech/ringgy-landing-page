"use client";

import { useState, type FormEvent, type InputHTMLAttributes } from "react";
import { CheckIcon, Eyebrow, container, sectionPad } from "./ui";
import { CONTACT_API_URL } from "@/lib/site";

type Status = { kind: "idle" | "sending" | "sent" } | { kind: "error"; message: string };

const field =
  "w-full rounded-lg border-[1.5px] border-line-2 bg-white px-4 py-3.5 text-base text-ink outline-none transition-colors placeholder:text-faint focus:border-primary";

/**
 * Sales enquiries, posted to the API's POST /contact, which saves each one
 * and emails it to the team. The "Contact Us" button on the Custom plan
 * scrolls here.
 */
export function ContactSection() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus({ kind: "sending" });
    try {
      const res = await fetch(CONTACT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { message?: string | string[] } | null;
        const message = Array.isArray(body?.message) ? body.message[0] : body?.message;
        throw new Error(message || "Something went wrong. Please try again.");
      }
      form.reset();
      setStatus({ kind: "sent" });
    } catch (err) {
      const message = err instanceof TypeError ? "We couldn’t reach our server. Please try again." : (err as Error).message;
      setStatus({ kind: "error", message: message.charAt(0).toUpperCase() + message.slice(1) });
    }
  }

  return (
    <section id="contact" className="scroll-mt-20 border-t border-line bg-white">
      <div className={`${container} ${sectionPad} grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-start gap-[clamp(36px,5vw,80px)]`}>
        <div data-reveal="" className="md:sticky md:top-28">
          <Eyebrow>Contact</Eyebrow>
          <h2 className="mb-5 text-[clamp(32px,4.4vw,56px)] font-bold leading-[1.06] tracking-[-.025em] text-ink">Talk to Our Team</h2>
          <p className="max-w-[30em] text-[clamp(16px,1.4vw,19px)] leading-[1.65] text-body">
            Running several locations, need custom call flows, or have a question before you start? Tell us a little about your business and we’ll
            get back to you.
          </p>
        </div>

        <div data-reveal="" className="rounded-[22px] border border-line bg-surface p-[clamp(20px,3vw,40px)]">
          {status.kind === "sent" ? (
            <div role="status" className="flex flex-col items-center py-10 text-center">
              <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#DDF4EA] text-success">
                <CheckIcon size={22} />
              </span>
              <div className="mb-2 text-xl font-bold text-ink">Thanks — we got your message</div>
              <p className="mb-6 max-w-[26em] text-base leading-[1.6] text-body">Someone from our team will reply to the email you gave us.</p>
              <button type="button" onClick={() => setStatus({ kind: "idle" })} className="cursor-pointer text-base font-medium text-primary hover:text-brand">
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Name" name="name" autoComplete="name" required maxLength={120} />
              <Field label="Work email" name="email" type="email" autoComplete="email" required maxLength={254} />
              <Field label="Phone" name="phone" type="tel" autoComplete="tel" maxLength={40} optional />
              <Field label="Company" name="company" autoComplete="organization" maxLength={160} optional />
              <label className="flex flex-col gap-2 sm:col-span-2">
                <span className="text-[15px] font-medium text-text-2">How can we help?</span>
                <textarea name="message" required maxLength={5000} rows={5} className={`${field} resize-y`} />
              </label>
              {/* Honeypot: off-screen and skipped by keyboard and screen readers, so only bots fill it in. */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-px w-px opacity-0" />
              <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
                <button
                  type="submit"
                  disabled={status.kind === "sending"}
                  className="cursor-pointer rounded-lg bg-brand px-8 py-4 text-[17px] font-medium text-white shadow-[0_14px_28px_-14px_rgba(21,87,176,.7)] transition-colors hover:bg-brand-dark disabled:cursor-wait disabled:opacity-70"
                >
                  {status.kind === "sending" ? "Sending…" : "Send Message"}
                </button>
                {status.kind === "error" && (
                  <p role="alert" className="m-0 text-[15px] text-[#B42318]">
                    {status.message}
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({ label, optional, ...input }: InputHTMLAttributes<HTMLInputElement> & { label: string; optional?: boolean }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[15px] font-medium text-text-2">
        {label}
        {optional && <span className="font-normal text-faint"> (optional)</span>}
      </span>
      <input type="text" {...input} className={field} />
    </label>
  );
}
