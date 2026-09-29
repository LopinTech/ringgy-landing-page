"use client";

import { useState } from "react";
import { RefreshCw, Search } from "lucide-react";
import { Bar, Button, Card, DataState, Empty, PageHeader, StatusBadge, Table, inputBase, td, tdNum, th, thNum, tr } from "@/components/backoffice/ui";
import { useApi } from "@/components/backoffice/useApi";
import type { AdminTenant } from "@/lib/backoffice/api";
import { formatDate, formatInt, formatMinutes } from "@/lib/backoffice/format";

export function CustomersView() {
  const tenants = useApi<AdminTenant[]>("/admin/tenants");
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const filtered = (tenants.data ?? []).filter(
    (t) => !q || `${t.name} ${t.email} ${t.plan?.name ?? ""} ${t.primaryNumber ?? ""} ${t.stripeCustomerId ?? ""}`.toLowerCase().includes(q),
  );

  return (
    <>
      <PageHeader
        title="Customers"
        description="All tenants with their plan, current-period usage and provisioning state."
        actions={
          <Button size="sm" onClick={tenants.reload} loading={tenants.loading} icon={<RefreshCw size={13} aria-hidden />}>
            Refresh
          </Button>
        }
      />
      <Card
        bodyClassName=""
        title={tenants.data ? `${formatInt(tenants.data.length)} customers` : "Customers"}
        actions={
          <div className="relative">
            <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-faint" aria-hidden />
            <input className={`${inputBase} h-8 w-64 pl-8`} placeholder="Name, email, plan, number…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search customers" />
          </div>
        }
      >
        <DataState state={tenants} isEmpty={(d) => d.length === 0} empty={<Empty title="No customers yet" />}>
          {() =>
            filtered.length === 0 ? (
              <Empty title="No customers match your search" />
            ) : (
              <Table minWidth={1320}>
                <thead>
                  <tr>
                    <th className={th}>Customer</th>
                    <th className={th}>Status</th>
                    <th className={th}>Plan</th>
                    <th className={th}>Period usage</th>
                    <th className={thNum}>Overage</th>
                    <th className={thNum}>Numbers</th>
                    <th className={th}>SIP</th>
                    <th className={th}>Provisioning</th>
                    <th className={th}>Assistant</th>
                    <th className={th}>Stripe customer</th>
                    <th className={th}>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => {
                    const p = t.period;
                    const pct = p && p.includedMinutes > 0 ? (p.usedMinutes / p.includedMinutes) * 100 : null;
                    return (
                      <tr key={t.id} className={tr}>
                        <td className={td}>
                          <div className="font-bold text-ink">{t.name}</div>
                          <div className="text-[12px] text-subtle">{t.email}</div>
                        </td>
                        <td className={td}>
                          <StatusBadge status={t.status} />
                        </td>
                        <td className={`${td} whitespace-nowrap`}>
                          {t.plan ? <div className="font-medium">{t.plan.name}</div> : <span className="text-faint">No plan</span>}
                          {t.subscriptionStatus ? (
                            <div className="mt-0.5 flex items-center gap-1">
                              <StatusBadge status={t.subscriptionStatus} />
                            </div>
                          ) : null}
                          {t.currentPeriodEnd ? <div className="text-[11.5px] text-faint">renews {formatDate(t.currentPeriodEnd)}</div> : null}
                        </td>
                        <td className={`${td} w-[190px]`}>
                          {p ? (
                            <>
                              <div className="mb-1 flex justify-between gap-2 text-[12.5px] tabular-nums">
                                <span>
                                  {formatMinutes(p.usedMinutes)} / {formatInt(p.includedMinutes)} min
                                </span>
                                <span className="text-subtle">{pct !== null ? `${Math.round(pct)}%` : ""}</span>
                              </div>
                              <Bar value={p.usedMinutes} max={p.includedMinutes} className={pct !== null && pct >= 100 ? "bg-red-500" : pct !== null && pct >= 90 ? "bg-amber-500" : "bg-primary"} />
                              <div className="mt-0.5 text-[11px] text-faint">
                                {formatDate(p.start)} – {formatDate(p.end)}
                              </div>
                            </>
                          ) : (
                            <span className="text-faint">—</span>
                          )}
                        </td>
                        <td className={`${tdNum} ${p && p.overageMinutes > 0 ? "font-medium text-amber-700" : ""}`}>{p ? `${formatMinutes(p.overageMinutes)} min` : "—"}</td>
                        <td className={tdNum}>
                          {formatInt(t.phoneNumbers)}
                          {t.primaryNumber ? <div className="font-mono text-[11.5px] text-subtle">{t.primaryNumber}</div> : null}
                        </td>
                        <td className={td}>
                          <StatusBadge status={t.sip} />
                        </td>
                        <td className={td}>
                          <StatusBadge status={t.provisioningStatus} />
                        </td>
                        <td className={td}>
                          <StatusBadge status={t.assistantSyncStatus} />
                        </td>
                        <td className={`${td} font-mono text-[12px]`}>{t.stripeCustomerId ?? <span className="font-sans text-faint">—</span>}</td>
                        <td className={`${td} whitespace-nowrap`}>{formatDate(t.createdAt)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )
          }
        </DataState>
      </Card>
    </>
  );
}
