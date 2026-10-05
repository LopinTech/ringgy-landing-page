"use client";

import { useState } from "react";
import { RefreshCw, Search } from "lucide-react";
import { Badge, Bar, Button, Card, DataState, Drawer, Empty, Field, Notice, PageHeader, StatusBadge, Table, inputBase, inputClass, td, tdNum, th, thNum, tr } from "@/components/backoffice/ui";
import { useApi } from "@/components/backoffice/useApi";
import { api, errorMessage, type AdminTenant } from "@/lib/backoffice/api";
import { formatDate, formatDateTime, formatInt, formatMinutes } from "@/lib/backoffice/format";

type LifecycleEvent = { id: string; type: string; occurredAt: string; notifiedAt: string | null; data: Record<string, unknown> | null };

export function CustomersView() {
  const tenants = useApi<AdminTenant[]>("/admin/tenants");
  const [query, setQuery] = useState("");
  const [trialFor, setTrialFor] = useState<AdminTenant | null>(null);
  const q = query.trim().toLowerCase();
  const filtered = (tenants.data ?? []).filter(
    (t) => !q || `${t.name} ${t.email} ${t.plan?.name ?? ""} ${t.primaryNumber ?? ""} ${t.stripeCustomerId ?? ""}`.toLowerCase().includes(q),
  );

  return (
    <>
      <PageHeader
        title="Customers"
        description="All tenants with their plan or free trial, current-period usage and provisioning state."
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
                    <th className={th}>Free trial</th>
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
                          {t.answering && !t.answering.enabled ? (
                            <div className="mt-1">
                              <Badge tone="danger" title="Live AI answering is switched off at Telnyx">
                                Answering off
                              </Badge>
                            </div>
                          ) : null}
                          {t.answering && !t.answering.inSync ? (
                            <div className="mt-1">
                              <Badge tone="warning" title={t.answering.error ?? "Waiting for the background sync to push it to Telnyx"}>
                                Switch pending
                              </Badge>
                            </div>
                          ) : null}
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
                        <td className={`${td} whitespace-nowrap`}>
                          {t.trial ? (
                            <>
                              <StatusBadge status={t.trial.status} />
                              <div className="mt-0.5 text-[11.5px] text-subtle">
                                {t.trial.status === "ACTIVE"
                                  ? `${t.trial.daysLeft}d left · ends ${formatDate(t.trial.endsAt)}`
                                  : t.trial.status === "CONVERTED"
                                    ? `upgraded ${formatDate(t.trial.convertedAt)}`
                                    : `ended ${formatDate(t.trial.endsAt)}`}
                              </div>
                              <div className={`text-[11.5px] tabular-nums ${t.trial.minutesExhausted ? "text-red-600" : "text-faint"}`}>
                                {t.trial.usedMinutes} / {t.trial.includedMinutes} min
                              </div>
                              {t.trialReleaseError ? (
                                <div className="text-[11.5px] text-red-600" title={t.trialReleaseError}>
                                  number release failing
                                </div>
                              ) : null}
                            </>
                          ) : (
                            <span className="text-faint">—</span>
                          )}
                          {t.trial?.status !== "CONVERTED" && !(t.subscriptionStatus && ["ACTIVE", "TRIALING", "PAST_DUE"].includes(t.subscriptionStatus)) ? (
                            <div className="mt-1">
                              <Button size="sm" onClick={() => setTrialFor(t)}>
                                {t.trial ? "Extend" : "Grant trial"}
                              </Button>
                            </div>
                          ) : null}
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
      {trialFor ? (
        <TrialDrawer
          tenant={trialFor}
          onClose={() => setTrialFor(null)}
          onSaved={() => {
            setTrialFor(null);
            tenants.reload();
          }}
        />
      ) : null}
    </>
  );
}

/** Support action: more days and/or minutes, with the tenant's lifecycle log. */
function TrialDrawer({ tenant, onClose, onSaved }: { tenant: AdminTenant; onClose: () => void; onSaved: () => void }) {
  const events = useApi<LifecycleEvent[]>(`/admin/tenants/${tenant.id}/lifecycle-events`);
  const [days, setDays] = useState("7");
  const [minutes, setMinutes] = useState("0");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const daysN = /^\d+$/.test(days) ? Number(days) : null;
  const minutesN = /^\d+$/.test(minutes) ? Number(minutes) : null;
  const valid = daysN !== null && minutesN !== null && daysN <= 90 && minutesN <= 10000 && daysN + minutesN > 0;

  async function save() {
    setSaving(true);
    setError(null);
    try {
      await api(`/admin/tenants/${tenant.id}/trial/extend`, { method: "POST", body: { days: daysN, addMinutes: minutesN } });
      onSaved();
    } catch (err) {
      setError(errorMessage(err));
      setSaving(false);
    }
  }

  return (
    <Drawer
      open
      title={tenant.trial ? `Extend ${tenant.name}'s trial` : `Grant ${tenant.name} a trial`}
      subtitle={
        tenant.trial
          ? `Currently ${tenant.trial.status.toLowerCase()} · ends ${formatDate(tenant.trial.endsAt)} · ${tenant.trial.usedMinutes}/${tenant.trial.includedMinutes} min`
          : "Starts a trial on the current policy, then adds the days and minutes below."
      }
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => void save()} loading={saving} disabled={!valid}>
            {tenant.trial ? "Extend trial" : "Grant trial"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-[13px] text-subtle">
          Days are added from today, or from the current end date if that is later. The grace, read-only and number-release dates move with it. A suspended customer starts answering calls again straight away; a number that was already released is bought back if it is still available.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Add days" hint="0–90" error={daysN === null || daysN > 90 ? "Whole number, 0–90" : null}>
            {(id) => <input id={id} inputMode="numeric" className={inputClass} value={days} onChange={(e) => setDays(e.target.value)} />}
          </Field>
          <Field label="Add minutes" hint="0–10,000" error={minutesN === null || minutesN > 10000 ? "Whole number, 0–10,000" : null}>
            {(id) => <input id={id} inputMode="numeric" className={inputClass} value={minutes} onChange={(e) => setMinutes(e.target.value)} />}
          </Field>
        </div>
        {error ? <Notice tone="danger">{error}</Notice> : null}
        <div>
          <h3 className="mb-2 text-[13px] font-semibold text-text-2">Lifecycle events</h3>
          <p className="mb-2 text-[12px] text-subtle">Recorded for the lifecycle emails planned for later; nothing is sent yet.</p>
          <DataState state={events} isEmpty={(d) => d.length === 0} empty={<Empty title="No events yet" />}>
            {(list) => (
              <ul className="space-y-1.5 text-[12.5px]">
                {list.map((e) => (
                  <li key={e.id} className="flex justify-between gap-3 border-b border-line pb-1.5">
                    <span className="font-medium">{e.type.replace(/_/g, " ").toLowerCase()}</span>
                    <span className="whitespace-nowrap text-subtle">{formatDateTime(e.occurredAt)}</span>
                  </li>
                ))}
              </ul>
            )}
          </DataState>
        </div>
      </div>
    </Drawer>
  );
}
