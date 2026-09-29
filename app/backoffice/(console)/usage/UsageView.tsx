"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { BarList, Button, Card, DataState, Empty, PageHeader, Stat, Table, inputBase, td, tdNum, th, thNum, tr } from "@/components/backoffice/ui";
import { useApi } from "@/components/backoffice/useApi";
import type { ReportRow, UsageReport, UsageTenantRow } from "@/lib/backoffice/api";
import { formatCents, formatInt, formatMinutes, formatPercent, formatRate } from "@/lib/backoffice/format";
import { costRows, revenueRows } from "@/lib/backoffice/report";

// ---- local-date helpers (inputs are YYYY-MM-DD in the operator's timezone) ----------

const pad = (n: number) => String(n).padStart(2, "0");
const ymd = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseYmd = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

type Range = { from: string; to: string };
type Preset = "month" | "lastMonth" | "30d" | "90d";

function presetRange(p: Preset): Range {
  const today = new Date();
  switch (p) {
    case "month":
      return { from: ymd(new Date(today.getFullYear(), today.getMonth(), 1)), to: ymd(today) };
    case "lastMonth":
      return { from: ymd(new Date(today.getFullYear(), today.getMonth() - 1, 1)), to: ymd(new Date(today.getFullYear(), today.getMonth(), 0)) };
    case "30d":
      return { from: ymd(addDays(today, -29)), to: ymd(today) };
    case "90d":
      return { from: ymd(addDays(today, -89)), to: ymd(today) };
  }
}

const PRESETS: { id: Preset; label: string }[] = [
  { id: "month", label: "This month" },
  { id: "lastMonth", label: "Last month" },
  { id: "30d", label: "Last 30 days" },
  { id: "90d", label: "Last 90 days" },
];

/** `to` is inclusive in the UI and exclusive in the API (start of the next day). */
function toQuery(r: Range): string | null {
  if (!r.from || !r.to || r.from > r.to) return null;
  const from = parseYmd(r.from).toISOString();
  const to = addDays(parseYmd(r.to), 1).toISOString();
  return `/admin/usage?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
}

type SortKey = "cost" | "revenue" | "margin" | "minutes" | "name";
const SORTS: Record<SortKey, (a: UsageTenantRow, b: UsageTenantRow) => number> = {
  cost: (a, b) => b.cost.totalCents - a.cost.totalCents,
  revenue: (a, b) => b.revenue.totalCents - a.revenue.totalCents,
  margin: (a, b) => a.grossMarginCents - b.grossMarginCents,
  minutes: (a, b) => b.minutes - a.minutes,
  name: (a, b) => a.name.localeCompare(b.name),
};

const otherCost = (r: ReportRow) => r.cost.legacyCents + r.cost.phoneNumberCents + r.cost.addOnCents;

export function UsageView() {
  const [range, setRange] = useState<Range>(() => presetRange("30d"));
  const [preset, setPreset] = useState<Preset | null>("30d");
  const [sort, setSort] = useState<SortKey>("cost");
  const path = toQuery(range);
  const report = useApi<UsageReport>(path);

  const choose = (p: Preset) => {
    setPreset(p);
    setRange(presetRange(p));
  };

  return (
    <>
      <PageHeader
        title="Usage & costs"
        description="Minutes, internal cost and collected revenue per customer for a date range. Revenue is what Stripe actually collected from paid invoices."
        actions={
          <Button size="sm" onClick={report.reload} loading={report.loading} disabled={!path} icon={<RefreshCw size={13} aria-hidden />}>
            Refresh
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-end gap-3 rounded-lg border border-line-2 bg-white px-4 py-3">
        <div className="flex flex-wrap gap-1" role="group" aria-label="Date presets">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => choose(p.id)}
              className={`h-8 rounded-md px-3 text-[13px] font-medium ${preset === p.id ? "bg-brand text-white" : "border border-line-2 bg-white text-text-2 hover:bg-surface"}`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <label className="text-[12px] text-subtle">
          From
          <input
            type="date"
            className={`${inputBase} mt-0.5 h-8 w-40`}
            value={range.from}
            max={range.to}
            onChange={(e) => {
              setPreset(null);
              setRange((r) => ({ ...r, from: e.target.value }));
            }}
          />
        </label>
        <label className="text-[12px] text-subtle">
          To (inclusive)
          <input
            type="date"
            className={`${inputBase} mt-0.5 h-8 w-40`}
            value={range.to}
            min={range.from}
            onChange={(e) => {
              setPreset(null);
              setRange((r) => ({ ...r, to: e.target.value }));
            }}
          />
        </label>
        {!path ? <span className="pb-1.5 text-[12.5px] text-red-600">Pick a valid range (from ≤ to).</span> : null}
        {report.loading && report.data ? <span className="pb-1.5 text-[12.5px] text-subtle">Updating…</span> : null}
      </div>

      {path ? (
        <DataState state={report}>
          {(data) => {
            const t = data.totals;
            const rows = [...data.byTenant].sort(SORTS[sort]);
            return (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
                  <Stat label="Minutes" value={formatMinutes(t.minutes)} sub={`${formatInt(t.calls)} calls · ${formatMinutes(t.overageMinutes)} overage`} />
                  <Stat label="Internal cost" value={formatCents(t.cost.totalCents)} sub={t.minutes > 0 ? `${formatRate(t.cost.usageCents / t.minutes, { suffix: true })} usage` : undefined} />
                  <Stat label="Revenue" value={formatCents(t.revenue.totalCents)} />
                  <Stat label="Gross margin" value={formatCents(t.grossMarginCents)} tone={t.grossMarginCents < 0 ? "negative" : "positive"} />
                  <Stat label="Margin %" value={formatPercent(t.grossMarginPercent)} sub={t.grossMarginPercent === null ? "No revenue in range" : undefined} />
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <Card title="Cost breakdown">
                    <BarList rows={costRows(t)} format={(v) => formatCents(v)} barClassName="bg-amber-500" total={{ label: "Total internal cost", value: t.cost.totalCents }} />
                  </Card>
                  <Card title="Revenue breakdown">
                    <BarList rows={revenueRows(t)} format={(v) => formatCents(v)} barClassName="bg-emerald-500" total={{ label: "Total revenue", value: t.revenue.totalCents }} />
                  </Card>
                </div>

                <Card
                  title="By customer"
                  bodyClassName=""
                  actions={
                    <label className="flex items-center gap-2 text-[12.5px] text-subtle">
                      Sort
                      <select className={`${inputBase} h-8 w-44`} value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
                        <option value="cost">Internal cost (high → low)</option>
                        <option value="revenue">Revenue (high → low)</option>
                        <option value="margin">Margin (low → high)</option>
                        <option value="minutes">Minutes (high → low)</option>
                        <option value="name">Name (A → Z)</option>
                      </select>
                    </label>
                  }
                >
                  {rows.length === 0 ? (
                    <Empty title="No usage in this range" />
                  ) : (
                    <Table minWidth={1560}>
                      <thead>
                        <tr>
                          <th className={th}>Customer</th>
                          <th className={thNum}>Minutes</th>
                          <th className={thNum}>Calls</th>
                          <th className={thNum}>Overage min</th>
                          <th className={thNum}>Telnyx</th>
                          <th className={thNum}>AI</th>
                          <th className={thNum}>Infra</th>
                          <th className={thNum}>Other</th>
                          <th className={thNum} title="Legacy call cost + phone numbers + add-ons">Legacy / numbers / add-ons</th>
                          <th className={`${thNum} bg-amber-50`}>Total cost</th>
                          <th className={thNum}>Plan rev.</th>
                          <th className={thNum}>Overage rev.</th>
                          <th className={thNum}>Phone rev.</th>
                          <th className={thNum}>Add-on rev.</th>
                          <th className={`${thNum} bg-emerald-50`}>Total rev.</th>
                          <th className={thNum}>Margin</th>
                          <th className={thNum}>Margin %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((r) => (
                          <UsageRow key={r.tenantId} r={r} />
                        ))}
                      </tbody>
                      <tfoot>
                        <UsageRow r={{ ...t, tenantId: "total", name: "Total", email: "", plan: null, subscriptionStatus: null }} total />
                      </tfoot>
                    </Table>
                  )}
                </Card>
              </div>
            );
          }}
        </DataState>
      ) : null}
    </>
  );
}

function UsageRow({ r, total }: { r: UsageTenantRow; total?: boolean }) {
  const cell = total ? `${tdNum} border-t-2 border-line-2 bg-surface font-bold` : tdNum;
  return (
    <tr className={total ? "" : tr}>
      <td className={total ? `${td} border-t-2 border-line-2 bg-surface font-bold` : td}>
        {total ? (
          "Total"
        ) : (
          <>
            <div className="font-bold text-ink">{r.name}</div>
            <div className="text-[11.5px] text-subtle">
              {r.email}
              {r.plan ? ` · ${r.plan}` : ""}
            </div>
          </>
        )}
      </td>
      <td className={cell}>{formatMinutes(r.minutes)}</td>
      <td className={cell}>{formatInt(r.calls)}</td>
      <td className={cell}>{formatMinutes(r.overageMinutes)}</td>
      <td className={cell}>{formatCents(r.cost.telnyxCents)}</td>
      <td className={cell}>{formatCents(r.cost.aiCents)}</td>
      <td className={cell}>{formatCents(r.cost.infraCents)}</td>
      <td className={cell}>{formatCents(r.cost.otherCents)}</td>
      <td className={cell}>{formatCents(otherCost(r))}</td>
      <td className={`${cell} ${total ? "" : "bg-amber-50/50"} font-medium`}>{formatCents(r.cost.totalCents)}</td>
      <td className={cell}>{formatCents(r.revenue.planCents)}</td>
      <td className={cell}>{formatCents(r.revenue.overageCents)}</td>
      <td className={cell}>{formatCents(r.revenue.phoneNumberCents)}</td>
      <td className={cell}>{formatCents(r.revenue.addOnCents)}</td>
      <td className={`${cell} ${total ? "" : "bg-emerald-50/50"} font-medium`}>{formatCents(r.revenue.totalCents)}</td>
      <td className={`${cell} ${r.grossMarginCents < 0 ? "text-red-600" : ""}`}>{formatCents(r.grossMarginCents)}</td>
      <td className={cell}>{formatPercent(r.grossMarginPercent)}</td>
    </tr>
  );
}
