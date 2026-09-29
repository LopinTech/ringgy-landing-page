"use client";

import Link from "next/link";
import { BarList, Card, DataState, Empty, PageHeader, Stat, StatusBadge, Button } from "@/components/backoffice/ui";
import { useApi } from "@/components/backoffice/useApi";
import type { Overview, PricingResponse } from "@/lib/backoffice/api";
import { costRows, revenueRows } from "@/lib/backoffice/report";
import { formatCents, formatInt, formatMinutes, formatPercent, formatRate } from "@/lib/backoffice/format";
import { RefreshCw } from "lucide-react";

export function OverviewView() {
  const overview = useApi<Overview>("/admin/overview");
  const pricing = useApi<PricingResponse>("/admin/pricing");

  return (
    <>
      <PageHeader
        title="Overview"
        description="Recurring revenue, subscriptions and month-to-date unit economics across all customers."
        actions={
          <Button size="sm" onClick={overview.reload} loading={overview.loading} icon={<RefreshCw size={13} aria-hidden />}>
            Refresh
          </Button>
        }
      />
      <DataState state={overview}>
        {(o) => {
          const mtd = o.monthToDate;
          const margin = mtd.grossMarginCents;
          const phoneEntries = Object.entries(o.phoneNumbers);
          const phoneTotal = phoneEntries.reduce((a, [, n]) => a + n, 0);
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <Stat
                  label="MRR"
                  value={formatCents(o.mrrCents.total)}
                  sub={`Plans ${formatCents(o.mrrCents.plans, { whole: true })} · Numbers ${formatCents(o.mrrCents.phoneNumbers, { whole: true })} · Add-ons ${formatCents(o.mrrCents.addOns, { whole: true })}`}
                />
                <Stat label="Live subscriptions" value={formatInt(o.liveSubscriptions)} sub="Active, trialing or past due" />
                <Stat label="Customers" value={formatInt(o.tenants)} sub={<Link className="text-brand hover:underline" href="/backoffice/customers">View all →</Link>} />
                <Stat label="Minutes this month" value={formatMinutes(mtd.minutes)} sub={`${formatInt(mtd.calls)} calls · ${formatMinutes(mtd.overageMinutes)} overage min`} />
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <Card title="Month to date · revenue" description="Collected from paid Stripe invoices">
                  <BarList rows={revenueRows(mtd)} format={(v) => formatCents(v)} barClassName="bg-emerald-500" total={{ label: "Total revenue", value: mtd.revenue.totalCents }} />
                </Card>
                <Card title="Month to date · internal cost">
                  <BarList rows={costRows(mtd)} format={(v) => formatCents(v)} barClassName="bg-amber-500" total={{ label: "Total cost", value: mtd.cost.totalCents }} />
                </Card>
                <Card title="Month to date · gross margin">
                  <div className={`text-[30px] font-bold tabular-nums ${margin < 0 ? "text-red-600" : "text-success"}`}>{formatCents(margin)}</div>
                  <div className="text-[13px] text-muted">
                    {mtd.grossMarginPercent === null ? "Margin % n/a (no revenue yet)" : `${formatPercent(mtd.grossMarginPercent)} of revenue`}
                  </div>
                  <dl className="mt-4 space-y-1.5 border-t border-line pt-3 text-[13px]">
                    <div className="flex justify-between"><dt className="text-muted">Revenue</dt><dd className="tabular-nums">{formatCents(mtd.revenue.totalCents)}</dd></div>
                    <div className="flex justify-between"><dt className="text-muted">Internal cost</dt><dd className="tabular-nums">−{formatCents(mtd.cost.totalCents)}</dd></div>
                    <div className="flex justify-between"><dt className="text-muted">Usage cost / min</dt><dd className="tabular-nums">{mtd.minutes > 0 ? formatRate(mtd.cost.usageCents / mtd.minutes, { suffix: true }) : "—"}</dd></div>
                    <div className="flex justify-between">
                      <dt className="text-muted">Current rate card</dt>
                      <dd className="tabular-nums">
                        {pricing.data?.current ? (
                          <Link href="/backoffice/pricing" className="text-brand hover:underline">
                            {formatRate(pricing.data.current.internalCentsPerMin)} → {formatRate(pricing.data.current.customerCentsPerMin, { suffix: true })}
                          </Link>
                        ) : pricing.loading ? "…" : "—"}
                      </dd>
                    </div>
                  </dl>
                </Card>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <Card title="Plan mix" description="Live subscriptions by plan">
                  {o.planMix.length === 0 ? (
                    <Empty title="No live subscriptions yet">Customers appear here once they check out a plan.</Empty>
                  ) : (
                    <BarList
                      rows={o.planMix.map((p) => ({ label: p.name, value: p.count, hint: formatPercent(o.liveSubscriptions ? (p.count / o.liveSubscriptions) * 100 : null, 0) }))}
                      format={(v) => formatInt(v)}
                    />
                  )}
                </Card>
                <Card title="Phone numbers by status" actions={<Link className="text-[12.5px] text-brand hover:underline" href="/backoffice/phone-numbers">All numbers →</Link>}>
                  {phoneEntries.length === 0 ? (
                    <Empty title="No phone numbers yet" />
                  ) : (
                    <BarList
                      rows={phoneEntries.map(([status, count]) => ({ label: <StatusBadge status={status} />, value: count }))}
                      format={(v) => formatInt(v)}
                      barClassName="bg-sky"
                      total={{ label: "Total", value: phoneTotal }}
                    />
                  )}
                </Card>
              </div>
            </div>
          );
        }}
      </DataState>
    </>
  );
}
