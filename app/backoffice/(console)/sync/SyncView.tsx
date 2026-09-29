"use client";

import { useState } from "react";
import { Play, RefreshCw } from "lucide-react";
import { Button, Card, DataState, Empty, Notice, PageHeader } from "@/components/backoffice/ui";
import { useApi } from "@/components/backoffice/useApi";
import { api, errorMessage, type SyncReport } from "@/lib/backoffice/api";
import { formatDateTime, formatInt } from "@/lib/backoffice/format";

const METRICS: { key: keyof SyncReport; label: string; hint: string }[] = [
  { key: "numbersChecked", label: "Numbers checked", hint: "Phone numbers compared against Telnyx" },
  { key: "numbersChanged", label: "Numbers changed", hint: "Status or details updated from Telnyx" },
  { key: "assistantsResynced", label: "Assistants resynced", hint: "AI assistants pushed to Telnyx again" },
  { key: "sipChecked", label: "SIP checked", hint: "SIP connections verified" },
  { key: "callsAllocated", label: "Calls allocated", hint: "Calls costed and allocated to plan / pack / overage" },
  { key: "overageReported", label: "Overage reported", hint: "Overage usage records sent to Stripe" },
  { key: "numbersBilled", label: "Numbers billed", hint: "Extra phone numbers attached to subscriptions" },
  { key: "subscriptionsSynced", label: "Subscriptions synced", hint: "Subscriptions refreshed from Stripe" },
];

export function SyncView() {
  const last = useApi<SyncReport | null>("/admin/sync");
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runNow() {
    setRunning(true);
    setError(null);
    try {
      const report = await api<SyncReport>("/admin/sync/run", { method: "POST" });
      last.mutate(() => report);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setRunning(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Background sync"
        description="Reconciles phone numbers, assistants and SIP with Telnyx, allocates call minutes, and reports overage / number billing to Stripe. It runs on a schedule; you can also run it now."
        actions={
          <>
            <Button size="sm" onClick={last.reload} loading={last.loading && !running} icon={<RefreshCw size={13} aria-hidden />}>
              Refresh
            </Button>
            <Button variant="primary" onClick={runNow} loading={running} icon={<Play size={14} aria-hidden />}>
              {running ? "Running…" : "Run sync now"}
            </Button>
          </>
        }
      />
      {error ? (
        <div className="mb-4">
          <Notice tone="danger" title="Sync failed" onClose={() => setError(null)}>
            {error}
          </Notice>
        </div>
      ) : null}
      <DataState
        state={last}
        isEmpty={(d) => d === null}
        empty={
          <Card>
            <Empty title="No sync has run since the server started">The last report is kept in memory on the API server. Run a sync now to see a report.</Empty>
          </Card>
        }
      >
        {(report) => {
          if (!report) return null;
          const ms = new Date(report.finishedAt).getTime() - new Date(report.startedAt).getTime();
          return (
            <div className="space-y-4">
              <Card
                title="Last run"
                description={`Started ${formatDateTime(report.startedAt)} · finished ${formatDateTime(report.finishedAt)} · ${Number.isFinite(ms) ? `${(ms / 1000).toFixed(1)}s` : "—"}`}
                actions={
                  report.errors.length ? (
                    <span className="text-[12.5px] font-bold text-red-600">{report.errors.length} error(s)</span>
                  ) : (
                    <span className="text-[12.5px] font-bold text-success">No errors</span>
                  )
                }
              >
                <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {METRICS.map((m) => (
                    <div key={m.key} className="rounded-md border border-line px-3 py-2">
                      <dt className="text-[11.5px] font-bold uppercase tracking-[.06em] text-subtle">{m.label}</dt>
                      <dd className="text-[22px] font-bold tabular-nums text-ink">{formatInt(report[m.key] as number)}</dd>
                      <dd className="text-[11.5px] text-faint">{m.hint}</dd>
                    </div>
                  ))}
                </dl>
              </Card>
              {report.errors.length ? (
                <Card title={`Errors (${report.errors.length})`}>
                  <ul className="space-y-1.5">
                    {report.errors.map((e, i) => (
                      <li key={i} className="rounded border border-red-100 bg-red-50 px-3 py-2 font-mono text-[12px] text-red-800">
                        {e}
                      </li>
                    ))}
                  </ul>
                </Card>
              ) : null}
            </div>
          );
        }}
      </DataState>
    </>
  );
}
