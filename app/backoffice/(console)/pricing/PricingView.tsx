"use client";

import { useState, type FormEvent } from "react";
import { Badge, Button, Card, DataState, Empty, Field, MoneyInput, Notice, PageHeader, Table, inputClass, td, tdNum, th, thNum, tr } from "@/components/backoffice/ui";
import { useApi } from "@/components/backoffice/useApi";
import { api, errorMessage, type PricingInput, type PricingResponse, type PricingView as Pricing } from "@/lib/backoffice/api";
import {
  addRates,
  dollarRateInputToCentsPerMin,
  formatDateTime,
  formatPercent,
  formatRate,
  rateToDollarInput,
} from "@/lib/backoffice/format";

const FIELDS = [
  { key: "telnyxCentsPerMin", label: "Telnyx", hint: "Carrier + voice AI platform cost per minute" },
  { key: "aiCentsPerMin", label: "AI", hint: "LLM / speech model cost per minute" },
  { key: "infraCentsPerMin", label: "Infrastructure", hint: "Hosting, storage, monitoring per minute" },
  { key: "otherCentsPerMin", label: "Other", hint: "Anything else allocated per minute" },
] as const;

type RateKey = (typeof FIELDS)[number]["key"] | "customerCentsPerMin";
type FormValues = Record<RateKey, string>;

function toForm(p: Pricing | null): FormValues {
  return {
    telnyxCentsPerMin: rateToDollarInput(p?.telnyxCentsPerMin ?? 0),
    aiCentsPerMin: rateToDollarInput(p?.aiCentsPerMin ?? 0),
    infraCentsPerMin: rateToDollarInput(p?.infraCentsPerMin ?? 0),
    otherCentsPerMin: rateToDollarInput(p?.otherCentsPerMin ?? 0),
    customerCentsPerMin: rateToDollarInput(p?.customerCentsPerMin ?? 0),
  };
}

export function PricingView() {
  const pricing = useApi<PricingResponse>("/admin/pricing");
  const [published, setPublished] = useState<Pricing | null>(null);

  return (
    <>
      <PageHeader
        title="Pricing"
        description="Internal cost per minute and the customer per-minute price. Publishing creates a new version effective immediately; earlier versions stay for history and for costing past calls."
      />
      {published ? (
        <div className="mb-4">
          <Notice tone="success" title="New pricing published" onClose={() => setPublished(null)}>
            Internal {formatRate(published.internalCentsPerMin, { suffix: true })}, customer {formatRate(published.customerCentsPerMin, { suffix: true })}, margin{" "}
            {formatRate(published.marginCentsPerMin, { suffix: true })} ({formatPercent(published.marginPercent)}). Effective {formatDateTime(published.effectiveFrom)}.
          </Notice>
        </div>
      ) : null}
      <DataState state={pricing}>
        {(data) => (
          <div className="space-y-4">
            <PricingEditor
              key={data.current?.id ?? "none"}
              current={data.current}
              onPublished={(p) => {
                setPublished(p);
                pricing.reload();
              }}
            />
            <Card title="Version history" bodyClassName="">
              {data.history.length === 0 ? (
                <Empty title="No pricing versions yet">Publish the first version above.</Empty>
              ) : (
                <Table minWidth={980}>
                  <thead>
                    <tr>
                      <th className={th}>Effective</th>
                      <th className={thNum}>Telnyx</th>
                      <th className={thNum}>AI</th>
                      <th className={thNum}>Infra</th>
                      <th className={thNum}>Other</th>
                      <th className={thNum}>Internal</th>
                      <th className={thNum}>Customer</th>
                      <th className={thNum}>Margin/min</th>
                      <th className={thNum}>Margin %</th>
                      <th className={th}>Note</th>
                      <th className={th}>By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.history.map((v) => {
                      const isCurrent = v.id === data.current?.id;
                      return (
                        <tr key={v.id} className={`${tr} ${isCurrent ? "bg-tint-2/60" : ""}`}>
                          <td className={`${td} whitespace-nowrap`}>
                            <div className="flex items-center gap-1.5">
                              {new Date(v.effectiveFrom).getFullYear() < 2000 ? "Since launch" : formatDateTime(v.effectiveFrom)}
                              {isCurrent ? <Badge tone="success">Current</Badge> : null}
                            </div>
                            <div className="text-[11.5px] text-faint">{v.effectiveTo ? `until ${formatDateTime(v.effectiveTo)}` : "open-ended"}</div>
                          </td>
                          <td className={tdNum}>{formatRate(v.telnyxCentsPerMin)}</td>
                          <td className={tdNum}>{formatRate(v.aiCentsPerMin)}</td>
                          <td className={tdNum}>{formatRate(v.infraCentsPerMin)}</td>
                          <td className={tdNum}>{formatRate(v.otherCentsPerMin)}</td>
                          <td className={`${tdNum} font-medium`}>{formatRate(v.internalCentsPerMin)}</td>
                          <td className={`${tdNum} font-medium`}>{formatRate(v.customerCentsPerMin)}</td>
                          <td className={`${tdNum} ${v.marginCentsPerMin < 0 ? "text-red-600" : ""}`}>{formatRate(v.marginCentsPerMin)}</td>
                          <td className={tdNum}>{formatPercent(v.marginPercent)}</td>
                          <td className={`${td} max-w-[260px] text-[12.5px]`}>{v.note || <span className="text-faint">—</span>}</td>
                          <td className={`${td} whitespace-nowrap text-[12.5px]`}>{v.createdBy || <span className="text-faint">system</span>}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              )}
            </Card>
          </div>
        )}
      </DataState>
    </>
  );
}

function PricingEditor({ current, onPublished }: { current: Pricing | null; onPublished: (p: Pricing) => void }) {
  const [values, setValues] = useState<FormValues>(() => toForm(current));
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsed = Object.fromEntries(Object.entries(values).map(([k, v]) => [k, dollarRateInputToCentsPerMin(v)])) as Record<RateKey, number | null>;
  const valid = Object.values(parsed).every((v) => v !== null);
  const internal = addRates(parsed.telnyxCentsPerMin ?? 0, parsed.aiCentsPerMin ?? 0, parsed.infraCentsPerMin ?? 0, parsed.otherCentsPerMin ?? 0);
  const customer = parsed.customerCentsPerMin ?? 0;
  const margin = addRates(customer, -internal);
  const marginPct = customer > 0 ? (margin / customer) * 100 : null;
  const dirty = JSON.stringify(values) !== JSON.stringify(toForm(current));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!valid) return;
    const body: PricingInput = {
      telnyxCentsPerMin: parsed.telnyxCentsPerMin!,
      aiCentsPerMin: parsed.aiCentsPerMin!,
      infraCentsPerMin: parsed.infraCentsPerMin!,
      otherCentsPerMin: parsed.otherCentsPerMin!,
      customerCentsPerMin: parsed.customerCentsPerMin!,
      ...(note.trim() ? { note: note.trim() } : {}),
    };
    const warn = margin < 0 ? "\n\nWARNING: the customer price is below internal cost (negative margin)." : "";
    if (!window.confirm(`Publish new pricing effective now?\n\nInternal ${formatRate(internal, { suffix: true })} · Customer ${formatRate(customer, { suffix: true })} · Margin ${formatRate(margin, { suffix: true })}${warn}`)) return;
    setSubmitting(true);
    setError(null);
    try {
      const p = await api<Pricing>("/admin/pricing", { method: "POST", body });
      onPublished(p);
    } catch (err) {
      setError(errorMessage(err));
      setSubmitting(false);
    }
  }

  const set = (k: RateKey) => (v: string) => setValues((prev) => ({ ...prev, [k]: v }));
  const rowCurrent = (k: RateKey) => (current ? formatRate(current[k]) : "—");

  return (
    <form onSubmit={onSubmit}>
      <Card
        title={current ? "Edit rates" : "Set initial rates"}
        description="Dollars per minute, up to 4 decimals (e.g. 0.0500 = 5¢/min)."
        bodyClassName="grid gap-6 p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]"
      >
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {FIELDS.map((f) => (
              <Field key={f.key} label={`${f.label} cost / min`} hint={f.hint} error={parsed[f.key] === null ? "Enter dollars with up to 4 decimals" : null}>
                {(id) => <MoneyInput id={id} value={values[f.key]} onChange={set(f.key)} invalid={parsed[f.key] === null} suffix="/min" />}
              </Field>
            ))}
          </div>
          <div className="grid gap-3 border-t border-line pt-4 sm:grid-cols-2">
            <Field
              label="Customer price / min"
              hint="Customer-facing per-minute price (public pricing). Plan overage rates are set per plan."
              error={parsed.customerCentsPerMin === null ? "Enter dollars with up to 4 decimals" : null}
            >
              {(id) => <MoneyInput id={id} value={values.customerCentsPerMin} onChange={set("customerCentsPerMin")} invalid={parsed.customerCentsPerMin === null} suffix="/min" />}
            </Field>
            <Field label="Note (optional)" hint="Why the change — shown in version history.">
              {(id) => <input id={id} className={inputClass} maxLength={500} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Telnyx rate increase Oct 2026" />}
            </Field>
          </div>
        </div>

        <div className="min-w-0">
          <div className="overflow-hidden rounded-md border border-line-2">
            <table className="w-full text-[13px]">
              <thead>
                <tr>
                  <th className={th}>Per minute</th>
                  <th className={thNum}>Current</th>
                  <th className={thNum}>New</th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {FIELDS.map((f) => (
                  <tr key={f.key}>
                    <td className={td}>{f.label}</td>
                    <td className={`${tdNum} text-subtle`}>{rowCurrent(f.key)}</td>
                    <td className={tdNum}>{formatRate(parsed[f.key])}</td>
                  </tr>
                ))}
                <tr className="bg-surface font-bold">
                  <td className={td}>Total internal</td>
                  <td className={`${tdNum} text-subtle`}>{current ? formatRate(current.internalCentsPerMin) : "—"}</td>
                  <td className={tdNum}>{formatRate(internal)}</td>
                </tr>
                <tr className="font-bold">
                  <td className={td}>Customer</td>
                  <td className={`${tdNum} text-subtle`}>{rowCurrent("customerCentsPerMin")}</td>
                  <td className={tdNum}>{formatRate(parsed.customerCentsPerMin)}</td>
                </tr>
                <tr className={`font-bold ${margin < 0 ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800"}`}>
                  <td className="px-3 py-2">Gross margin</td>
                  <td className="px-3 py-2 text-right opacity-70">
                    {current ? `${formatRate(current.marginCentsPerMin, { suffix: true })}` : "—"}
                    <div className="text-[11.5px] font-medium">{current ? formatPercent(current.marginPercent) : ""}</div>
                  </td>
                  <td className="px-3 py-2 text-right">
                    {valid ? formatRate(margin, { suffix: true }) : "—"}
                    <div className="text-[11.5px] font-medium">{valid ? formatPercent(marginPct) : ""}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {valid && margin < 0 ? (
            <div className="mt-3">
              <Notice tone="danger">Customer price is below internal cost — every minute loses money.</Notice>
            </div>
          ) : null}
          {error ? (
            <div className="mt-3">
              <Notice tone="danger">{error}</Notice>
            </div>
          ) : null}
          <div className="mt-3 flex items-center justify-end gap-2">
            <Button
              onClick={() => {
                setValues(toForm(current));
                setNote("");
              }}
              disabled={!dirty || submitting}
            >
              Reset
            </Button>
            <Button type="submit" variant="primary" loading={submitting} disabled={!valid || (!dirty && !!current)}>
              Publish new version
            </Button>
          </div>
        </div>
      </Card>
    </form>
  );
}
