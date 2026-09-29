"use client";

import { useState, type FormEvent } from "react";
import { Check, Pencil, RefreshCw, Search, X } from "lucide-react";
import { Button, Card, DataState, Empty, MoneyInput, Notice, PageHeader, Stat, StatusBadge, Table, inputBase, td, tdNum, th, thNum, tr } from "@/components/backoffice/ui";
import { useApi } from "@/components/backoffice/useApi";
import { api, errorMessage, type AdminPhoneNumber } from "@/lib/backoffice/api";
import { centsToDollarInput, dollarInputToCents, formatCents, formatDate, formatDateTime, formatInt } from "@/lib/backoffice/format";

export function PhoneNumbersView() {
  const numbers = useApi<AdminPhoneNumber[]>("/admin/phone-numbers");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [flash, setFlash] = useState<{ tone: "success" | "danger"; text: string } | null>(null);

  const list = numbers.data ?? [];
  const statuses = Array.from(new Set(list.map((n) => n.status))).sort();
  const q = query.trim().toLowerCase();
  const filtered = list.filter(
    (n) =>
      (status === "ALL" || n.status === status) &&
      (!q || `${n.phoneNumber} ${n.tenant?.name ?? ""} ${n.locality ?? ""} ${n.region ?? ""}`.toLowerCase().includes(q)),
  );
  const live = list.filter((n) => n.status !== "RELEASED");
  const telnyxTotal = live.reduce((a, n) => a + (n.telnyxMonthlyCents ?? 0), 0);
  const customerTotal = live.reduce((a, n) => a + n.customerMonthlyCents, 0);
  const missingCost = live.filter((n) => n.telnyxMonthlyCents === null).length;

  return (
    <>
      <PageHeader
        title="Phone numbers"
        description="Every number on the master Telnyx account. Telnyx monthly cost is editable; margin = customer price − Telnyx cost."
        actions={
          <Button size="sm" onClick={numbers.reload} loading={numbers.loading} icon={<RefreshCw size={13} aria-hidden />}>
            Refresh
          </Button>
        }
      />
      {numbers.data ? (
        <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="Numbers (not released)" value={formatInt(live.length)} sub={`${formatInt(list.length)} total incl. released`} />
          <Stat label="Telnyx cost / mo" value={formatCents(telnyxTotal)} sub={missingCost ? `${missingCost} number(s) missing a cost` : "All costs set"} />
          <Stat label="Customer price / mo" value={formatCents(customerTotal)} />
          <Stat label="Number margin / mo" value={formatCents(customerTotal - telnyxTotal)} tone={customerTotal - telnyxTotal < 0 ? "negative" : "default"} />
        </div>
      ) : null}
      {flash ? (
        <div className="mb-4">
          <Notice tone={flash.tone} onClose={() => setFlash(null)}>
            {flash.text}
          </Notice>
        </div>
      ) : null}
      <Card
        bodyClassName=""
        title="All numbers"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-faint" aria-hidden />
              <input className={`${inputBase} h-8 w-56 pl-8`} placeholder="Number, customer, city…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search numbers" />
            </div>
            <select className={`${inputBase} h-8 w-36`} value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
              <option value="ALL">All statuses</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        }
      >
        <DataState state={numbers} isEmpty={(d) => d.length === 0} empty={<Empty title="No phone numbers yet">Numbers appear here when customers buy or adopt one.</Empty>}>
          {() =>
            filtered.length === 0 ? (
              <Empty title="No numbers match these filters" />
            ) : (
              <Table minWidth={1320}>
                <thead>
                  <tr>
                    <th className={th}>Number</th>
                    <th className={th}>Customer</th>
                    <th className={th}>Source</th>
                    <th className={th}>Status</th>
                    <th className={th}>Billing</th>
                    <th className={thNum}>Telnyx / mo</th>
                    <th className={thNum}>Customer / mo</th>
                    <th className={thNum}>Margin</th>
                    <th className={th}>Purchased</th>
                    <th className={th}>Released</th>
                    <th className={th}>Last synced</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((n) => (
                    <tr key={n.id} className={`${tr} ${n.status === "RELEASED" ? "opacity-60" : ""}`}>
                      <td className={`${td} whitespace-nowrap`}>
                        <div className="font-mono font-medium text-ink">{n.phoneNumber}</div>
                        <div className="text-[11.5px] text-faint">{[n.locality, n.region].filter(Boolean).join(", ") || "—"}</div>
                      </td>
                      <td className={td}>{n.tenant?.name ?? <span className="text-faint">Unassigned</span>}</td>
                      <td className={td}>
                        <StatusBadge status={n.source} />
                      </td>
                      <td className={`${td} max-w-[220px]`}>
                        <StatusBadge status={n.status} />
                        {n.statusDetail ? (
                          <div className="mt-0.5 truncate text-[11.5px] text-subtle" title={n.statusDetail}>
                            {n.statusDetail}
                          </div>
                        ) : null}
                      </td>
                      <td className={td}>
                        <StatusBadge status={n.billingStatus} />
                      </td>
                      <td className={tdNum}>
                        <CostCell
                          number={n}
                          onSaved={(cents) => {
                            setFlash({ tone: "success", text: `Telnyx cost for ${n.phoneNumber} set to ${formatCents(cents)}/mo.` });
                            numbers.reload();
                          }}
                        />
                      </td>
                      <td className={tdNum}>{formatCents(n.customerMonthlyCents)}</td>
                      <td className={`${tdNum} ${n.marginCents !== null && n.marginCents < 0 ? "text-red-600" : ""}`}>{formatCents(n.marginCents)}</td>
                      <td className={`${td} whitespace-nowrap`}>{formatDate(n.purchasedAt)}</td>
                      <td className={`${td} whitespace-nowrap`}>{formatDate(n.releasedAt)}</td>
                      <td className={`${td} whitespace-nowrap text-[12.5px]`}>{n.lastSyncedAt ? formatDateTime(n.lastSyncedAt) : <span className="text-faint">never</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )
          }
        </DataState>
      </Card>
    </>
  );
}

function CostCell({ number, onSaved }: { number: AdminPhoneNumber; onSaved: (cents: number) => void }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cents = dollarInputToCents(value);

  async function save(e: FormEvent) {
    e.preventDefault();
    if (cents === null) return;
    setSaving(true);
    setError(null);
    try {
      await api(`/admin/phone-numbers/${number.id}`, { method: "PATCH", body: { telnyxMonthlyCents: cents } });
      setEditing(false);
      onSaved(cents);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  if (!editing) {
    return (
      <button
        type="button"
        className="group inline-flex items-center gap-1.5 rounded px-1 py-0.5 hover:bg-tint-2"
        onClick={() => {
          setValue(centsToDollarInput(number.telnyxMonthlyCents ?? null));
          setError(null);
          setEditing(true);
        }}
        title="Edit Telnyx monthly cost"
      >
        {number.telnyxMonthlyCents === null ? <span className="text-amber-700">Set cost</span> : formatCents(number.telnyxMonthlyCents)}
        <Pencil size={12} className="text-faint group-hover:text-brand" aria-hidden />
      </button>
    );
  }
  return (
    <form onSubmit={save} className="inline-flex flex-col items-end gap-1">
      <div className="flex items-center gap-1">
        <MoneyInput value={value} onChange={setValue} invalid={cents === null} className="w-24" />
        <button type="submit" disabled={cents === null || saving} className="rounded p-1.5 text-success hover:bg-emerald-50 disabled:opacity-40" aria-label="Save">
          <Check size={14} />
        </button>
        <button type="button" onClick={() => setEditing(false)} className="rounded p-1.5 text-subtle hover:bg-surface" aria-label="Cancel">
          <X size={14} />
        </button>
      </div>
      {error ? <span className="max-w-[200px] text-[11.5px] text-red-600">{error}</span> : null}
    </form>
  );
}
