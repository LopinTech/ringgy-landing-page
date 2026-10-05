"use client";

import { useState, type FormEvent } from "react";
import { Badge, Button, Card, Checkbox, DataState, Field, Notice, PageHeader, Table, inputClass, td, tdNum, th, thNum, tr } from "@/components/backoffice/ui";
import { useApi } from "@/components/backoffice/useApi";
import { api, errorMessage, type TrialPolicy, type TrialPolicyInput, type TrialPolicyResponse } from "@/lib/backoffice/api";
import { formatDateTime } from "@/lib/backoffice/format";

type NumberKey =
  | "durationDays"
  | "includedMinutes"
  | "maxPhoneNumbers"
  | "endingSoonDays"
  | "graceDays"
  | "readOnlyDays"
  | "numberRetentionDays"
  | "numberReleaseNoticeDays";
type BoolKey = "enabled" | "oneTrialPerBusinessPhone" | "stopAtMinuteLimit" | "releaseNumbers";

type FormValues = Record<NumberKey, string> & Record<BoolKey, boolean>;

/** Bounds match the API's validation. */
const LIMITS: Record<NumberKey, { min: number; max: number }> = {
  durationDays: { min: 1, max: 90 },
  includedMinutes: { min: 0, max: 100000 },
  maxPhoneNumbers: { min: 0, max: 10 },
  endingSoonDays: { min: 0, max: 30 },
  graceDays: { min: 0, max: 60 },
  readOnlyDays: { min: 0, max: 365 },
  numberRetentionDays: { min: 0, max: 365 },
  numberReleaseNoticeDays: { min: 0, max: 60 },
};

function toForm(p: TrialPolicy): FormValues {
  return {
    enabled: p.enabled,
    oneTrialPerBusinessPhone: p.oneTrialPerBusinessPhone,
    stopAtMinuteLimit: p.stopAtMinuteLimit,
    releaseNumbers: p.releaseNumbers,
    durationDays: String(p.durationDays),
    includedMinutes: String(p.includedMinutes),
    maxPhoneNumbers: String(p.maxPhoneNumbers),
    endingSoonDays: String(p.endingSoonDays),
    graceDays: String(p.graceDays),
    readOnlyDays: String(p.readOnlyDays),
    numberRetentionDays: String(p.numberRetentionDays),
    numberReleaseNoticeDays: String(p.numberReleaseNoticeDays),
  };
}

function parseWhole(value: string, key: NumberKey): number | null {
  if (!/^\d+$/.test(value.trim())) return null;
  const n = Number(value.trim());
  const { min, max } = LIMITS[key];
  return n >= min && n <= max ? n : null;
}

const days = (n: number) => `${n} day${n === 1 ? "" : "s"}`;

export function TrialView() {
  const policy = useApi<TrialPolicyResponse>("/admin/trial-policy");
  const [published, setPublished] = useState<TrialPolicy | null>(null);

  return (
    <>
      <PageHeader
        title="Free trial"
        description="What every new signup gets — no credit card, no automatic charge at the end. Publishing creates a new version for trials started from now on; running trials keep the terms they started with."
      />
      {published ? (
        <div className="mb-4">
          <Notice tone="success" title="Trial policy published" onClose={() => setPublished(null)}>
            {published.enabled
              ? `New signups get ${days(published.durationDays)} and ${published.includedMinutes} minutes, from ${formatDateTime(published.effectiveFrom)}.`
              : `Trials are off for signups from ${formatDateTime(published.effectiveFrom)}; new accounts choose a paid plan at signup.`}
          </Notice>
        </div>
      ) : null}
      <DataState state={policy}>
        {(data) => (
          <div className="space-y-4">
            <TrialEditor
              key={data.current.id}
              current={data.current}
              onPublished={(p) => {
                setPublished(p);
                policy.reload();
              }}
            />
            <Card title="Version history" bodyClassName="">
              <Table minWidth={900}>
                <thead>
                  <tr>
                    <th className={th}>Effective</th>
                    <th className={th}>Offered</th>
                    <th className={thNum}>Days</th>
                    <th className={thNum}>Minutes</th>
                    <th className={thNum}>Numbers</th>
                    <th className={thNum}>Grace</th>
                    <th className={thNum}>Read-only</th>
                    <th className={th}>Number release</th>
                    <th className={th}>Note</th>
                    <th className={th}>By</th>
                  </tr>
                </thead>
                <tbody>
                  {data.history.map((v) => (
                    <tr key={v.id} className={`${tr} ${v.id === data.current.id ? "bg-tint-2/60" : ""}`}>
                      <td className={`${td} whitespace-nowrap`}>
                        <div className="flex items-center gap-1.5">
                          {formatDateTime(v.effectiveFrom)}
                          {v.id === data.current.id ? <Badge tone="success">Current</Badge> : null}
                        </div>
                        <div className="text-[11.5px] text-faint">{v.effectiveTo ? `until ${formatDateTime(v.effectiveTo)}` : "open-ended"}</div>
                      </td>
                      <td className={td}>{v.enabled ? <Badge tone="success">On</Badge> : <Badge>Off</Badge>}</td>
                      <td className={tdNum}>{v.durationDays}</td>
                      <td className={tdNum}>
                        {v.includedMinutes}
                        {v.stopAtMinuteLimit ? <div className="text-[11.5px] text-faint">hard limit</div> : null}
                      </td>
                      <td className={tdNum}>{v.maxPhoneNumbers}</td>
                      <td className={tdNum}>{days(v.graceDays)}</td>
                      <td className={tdNum}>{days(v.readOnlyDays)}</td>
                      <td className={`${td} whitespace-nowrap text-[12.5px]`}>
                        {v.releaseNumbers ? `${days(v.numberRetentionDays)} after calls stop` : "Kept"}
                      </td>
                      <td className={`${td} max-w-[240px] text-[12.5px]`}>{v.note || <span className="text-faint">—</span>}</td>
                      <td className={`${td} whitespace-nowrap text-[12.5px]`}>{v.createdBy || <span className="text-faint">system</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </div>
        )}
      </DataState>
    </>
  );
}

function TrialEditor({ current, onPublished }: { current: TrialPolicy; onPublished: (p: TrialPolicy) => void }) {
  const [values, setValues] = useState<FormValues>(() => toForm(current));
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsed = Object.fromEntries(
    (Object.keys(LIMITS) as NumberKey[]).map((k) => [k, parseWhole(values[k], k)]),
  ) as Record<NumberKey, number | null>;
  const valid = Object.values(parsed).every((v) => v !== null);
  const dirty = JSON.stringify(values) !== JSON.stringify(toForm(current)) || note.trim() !== "";

  const setNum = (k: NumberKey) => (v: string) => setValues((prev) => ({ ...prev, [k]: v }));
  const setBool = (k: BoolKey) => (v: boolean) => setValues((prev) => ({ ...prev, [k]: v }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!valid) return;
    const body: TrialPolicyInput = {
      enabled: values.enabled,
      oneTrialPerBusinessPhone: values.oneTrialPerBusinessPhone,
      stopAtMinuteLimit: values.stopAtMinuteLimit,
      releaseNumbers: values.releaseNumbers,
      durationDays: parsed.durationDays!,
      includedMinutes: parsed.includedMinutes!,
      maxPhoneNumbers: parsed.maxPhoneNumbers!,
      endingSoonDays: parsed.endingSoonDays!,
      graceDays: parsed.graceDays!,
      readOnlyDays: parsed.readOnlyDays!,
      numberRetentionDays: parsed.numberRetentionDays!,
      numberReleaseNoticeDays: parsed.numberReleaseNoticeDays!,
      ...(note.trim() ? { note: note.trim() } : {}),
    };
    const summary = body.enabled
      ? `New signups get ${days(body.durationDays)} with ${body.includedMinutes} minutes and ${body.maxPhoneNumbers} number(s).`
      : "Trials will be OFF: new signups must choose a paid plan at signup.";
    if (!window.confirm(`Publish this trial policy?\n\n${summary}\n\nRunning trials keep their current terms.`)) return;
    setSubmitting(true);
    setError(null);
    try {
      onPublished(await api<TrialPolicy>("/admin/trial-policy", { method: "POST", body }));
    } catch (err) {
      setError(errorMessage(err));
      setSubmitting(false);
    }
  }

  const numberField = (k: NumberKey, label: string, hint: string, suffix: string) => (
    <Field label={label} hint={hint} error={parsed[k] === null ? `Whole number, ${LIMITS[k].min}–${LIMITS[k].max}` : null}>
      {(id) => (
        <div className="relative">
          <input
            id={id}
            inputMode="numeric"
            className={`${inputClass} pr-16`}
            value={values[k]}
            aria-invalid={parsed[k] === null || undefined}
            onChange={(e) => setNum(k)(e.target.value)}
          />
          <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-[12.5px] text-subtle">{suffix}</span>
        </div>
      )}
    </Field>
  );

  return (
    <form onSubmit={onSubmit}>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
        <div className="space-y-4">
          <Card title="Eligibility & activation" description="The trial starts automatically when a new customer finishes the signup wizard." bodyClassName="space-y-3 p-4">
            <Checkbox
              checked={values.enabled}
              onChange={setBool("enabled")}
              label="Offer a free trial to new signups"
              hint="Off: signup asks for a paid plan and sends the customer to Stripe Checkout, as before."
            />
            <Checkbox
              checked={values.oneTrialPerBusinessPhone}
              onChange={setBool("oneTrialPerBusinessPhone")}
              label="One trial per business phone number"
              hint="A business number that already had a trial on another account does not get a second one."
            />
          </Card>

          <Card title="Duration & usage limits" bodyClassName="grid gap-3 p-4 sm:grid-cols-3">
            {numberField("durationDays", "Trial length", "Days from signup.", "days")}
            {numberField("includedMinutes", "Free minutes", "AI call answering included.", "min")}
            {numberField("maxPhoneNumbers", "Phone numbers", "Ringgy numbers a trial can get.", "max")}
            <div className="sm:col-span-3">
              <Checkbox
                checked={values.stopAtMinuteLimit}
                onChange={setBool("stopAtMinuteLimit")}
                label="Stop answering when the free minutes run out"
                hint="Off: calls keep being answered (unbilled) until the trial ends. Trial minutes are never charged either way."
              />
            </div>
          </Card>

          <Card title="When the trial ends without an upgrade" description="Nobody is ever charged automatically." bodyClassName="grid gap-3 p-4 sm:grid-cols-3">
            {numberField("endingSoonDays", "“Ending soon” notice", "Days before the end the dashboard warns.", "days")}
            {numberField("graceDays", "Grace period", "Calls are still answered after the trial.", "days")}
            {numberField("readOnlyDays", "Read-only access", "Dashboard viewable after calls stop.", "days")}
          </Card>

          <Card title="Phone number retention" bodyClassName="grid gap-3 p-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Checkbox
                checked={values.releaseNumbers}
                onChange={setBool("releaseNumbers")}
                label="Release trial numbers if the customer does not subscribe"
                hint="Released numbers are deleted from Telnyx and detached from the customer. Off: numbers are kept until released by hand."
              />
            </div>
            {numberField("numberRetentionDays", "Release after", "Days after live answering stops.", "days")}
            {numberField("numberReleaseNoticeDays", "Warn before release", "Days ahead the customer is warned.", "days")}
          </Card>

          <Card title="Publish" bodyClassName="space-y-3 p-4">
            <Field label="Note (optional)" hint="Why the change — shown in version history.">
              {(id) => <input id={id} className={inputClass} maxLength={500} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Longer trial for the October campaign" />}
            </Field>
            {error ? <Notice tone="danger">{error}</Notice> : null}
            <div className="flex items-center justify-end gap-2">
              <Button
                onClick={() => {
                  setValues(toForm(current));
                  setNote("");
                }}
                disabled={!dirty || submitting}
              >
                Reset
              </Button>
              <Button type="submit" variant="primary" loading={submitting} disabled={!valid || !dirty}>
                Publish new version
              </Button>
            </div>
          </Card>
        </div>

        <Timeline values={values} parsed={parsed} valid={valid} />
      </div>
    </form>
  );
}

/** What a customer who signs up today and never upgrades experiences. */
function Timeline({ values, parsed, valid }: { values: FormValues; parsed: Record<NumberKey, number | null>; valid: boolean }) {
  if (!values.enabled) {
    return (
      <Card title="Customer timeline">
        <p className="text-[13px] text-subtle">Trials are off. New signups choose a paid plan and pay on Stripe Checkout before their receptionist goes live.</p>
      </Card>
    );
  }
  if (!valid) {
    return (
      <Card title="Customer timeline">
        <p className="text-[13px] text-subtle">Fix the highlighted fields to see the timeline.</p>
      </Card>
    );
  }
  const d = parsed as Record<NumberKey, number>;
  const callsStop = d.durationDays + d.graceDays;
  const closes = callsStop + d.readOnlyDays;
  const release = callsStop + d.numberRetentionDays;
  type Step = { day: number; title: string; body: string; tone?: "warn" | "stop" };
  const steps: Step[] = [
    { day: 0, title: "Signs up", body: `Trial starts — no card. ${d.includedMinutes} minutes, up to ${d.maxPhoneNumbers} number(s).` },
    { day: Math.max(0, d.durationDays - d.endingSoonDays), title: "“Trial ending soon”", body: "Dashboard turns amber.", tone: "warn" as const },
    { day: d.durationDays, title: "Trial ends", body: d.graceDays > 0 ? `Grace period: calls still answered for ${days(d.graceDays)}.` : "No grace period.", tone: "warn" as const },
    { day: callsStop, title: "Live answering stops", body: "Dashboard becomes read-only. Call history and configuration kept.", tone: "stop" as const },
    ...(values.releaseNumbers
      ? [
          { day: Math.max(callsStop, release - d.numberReleaseNoticeDays), title: "Number release warning", body: `Shown ${days(d.numberReleaseNoticeDays)} ahead.`, tone: "warn" as const },
          { day: release, title: "Trial number released", body: "Deleted from Telnyx; an upgrade later re-buys it if still free.", tone: "stop" as const },
        ]
      : []),
    { day: closes, title: "Read-only access ends", body: "Only “choose a plan” is offered. Data is kept.", tone: "stop" as const },
  ].sort((a, b) => a.day - b.day);

  return (
    <Card title="Customer timeline" description="Someone who signs up today and never upgrades. Upgrading at any point reactivates everything at once.">
      <ol className="space-y-3">
        {steps.map((s, i) => (
          <li key={`${s.title}-${i}`} className="flex gap-3">
            <span
              className={`mt-0.5 inline-flex h-6 min-w-14 flex-none items-center whitespace-nowrap justify-center rounded-full px-2 text-[11.5px] font-semibold tabular-nums ${
                s.tone === "stop" ? "bg-red-50 text-red-700" : s.tone === "warn" ? "bg-amber-50 text-amber-800" : "bg-emerald-50 text-emerald-800"
              }`}
            >
              Day {s.day}
            </span>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-text-2">{s.title}</div>
              <div className="text-[12.5px] text-subtle">{s.body}</div>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}
