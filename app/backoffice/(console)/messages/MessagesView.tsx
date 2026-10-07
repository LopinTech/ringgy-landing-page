"use client";

import { useState } from "react";
import { Mail, Phone, RefreshCw, Search } from "lucide-react";
import { Badge, Button, Card, DataState, Drawer, Empty, PageHeader, Table, inputBase, td, th, tr } from "@/components/backoffice/ui";
import { useApi } from "@/components/backoffice/useApi";
import type { ContactRequest } from "@/lib/backoffice/api";
import { DASH, formatDateTime, formatInt } from "@/lib/backoffice/format";

export function MessagesView() {
  const messages = useApi<ContactRequest[]>("/admin/contact-requests");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<ContactRequest | null>(null);
  const q = query.trim().toLowerCase();
  const filtered = (messages.data ?? []).filter(
    (m) => !q || `${m.name} ${m.email} ${m.company ?? ""} ${m.phone ?? ""} ${m.message}`.toLowerCase().includes(q),
  );

  return (
    <>
      <PageHeader
        title="Messages"
        description="Sent from the contact form on the landing page. Each one is also emailed to the sales inbox when email is configured on the API."
        actions={
          <Button size="sm" onClick={messages.reload} loading={messages.loading} icon={<RefreshCw size={13} aria-hidden />}>
            Refresh
          </Button>
        }
      />
      <Card
        bodyClassName=""
        title={messages.data ? `${formatInt(messages.data.length)} ${messages.data.length === 1 ? "message" : "messages"}` : "Messages"}
        description={messages.data?.length === 500 ? "Showing the 500 most recent." : undefined}
        actions={
          <div className="relative">
            <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-faint" aria-hidden />
            <input
              className={`${inputBase} h-8 w-64 pl-8`}
              placeholder="Name, email, company, text…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search messages"
            />
          </div>
        }
      >
        <DataState
          state={messages}
          isEmpty={(d) => d.length === 0}
          empty={<Empty title="No messages yet">Messages appear here when someone sends the contact form on the landing page.</Empty>}
        >
          {() =>
            filtered.length === 0 ? (
              <Empty title="No messages match your search" />
            ) : (
              <Table minWidth={980}>
                <thead>
                  <tr>
                    <th className={th}>Received</th>
                    <th className={th}>From</th>
                    <th className={th}>Company</th>
                    <th className={th}>Message</th>
                    <th className={th}>Email to sales</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m) => (
                    <tr key={m.id} className={`${tr} cursor-pointer`} onClick={() => setOpen(m)}>
                      <td className={`${td} whitespace-nowrap`}>{formatDateTime(m.createdAt)}</td>
                      <td className={td}>
                        <button type="button" className="text-left font-bold text-ink hover:text-brand" onClick={() => setOpen(m)}>
                          {m.name}
                        </button>
                        <div className="text-[12px] text-subtle">{m.email}</div>
                      </td>
                      <td className={td}>{m.company ?? <span className="text-faint">{DASH}</span>}</td>
                      <td className={`${td} max-w-[460px]`}>
                        <p className="line-clamp-2 whitespace-pre-line">{m.message}</p>
                      </td>
                      <td className={`${td} whitespace-nowrap`}>
                        <EmailedBadge message={m} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )
          }
        </DataState>
      </Card>

      <Drawer
        open={open !== null}
        onClose={() => setOpen(null)}
        title={open?.name}
        subtitle={open ? `Received ${formatDateTime(open.createdAt)}` : undefined}
        footer={
          open ? (
            <>
              {open.phone ? (
                <a href={`tel:${open.phone}`} className="inline-flex h-9 items-center gap-1.5 rounded-md border border-line-2 bg-white px-3.5 text-[13.5px] font-medium text-text-2 hover:bg-surface">
                  <Phone size={14} aria-hidden /> Call
                </a>
              ) : null}
              <a
                href={`mailto:${open.email}?subject=${encodeURIComponent("Re: your message to Ringgy")}`}
                className="inline-flex h-9 items-center gap-1.5 rounded-md bg-brand px-3.5 text-[13.5px] font-medium text-white hover:bg-brand-dark"
              >
                <Mail size={14} aria-hidden /> Reply by email
              </a>
            </>
          ) : null
        }
      >
        {open ? (
          <div className="space-y-4">
            <dl className="grid grid-cols-[110px_1fr] gap-x-3 gap-y-2 text-[13.5px]">
              <dt className="text-subtle">Email</dt>
              <dd className="break-all text-ink">{open.email}</dd>
              <dt className="text-subtle">Phone</dt>
              <dd className="text-ink">{open.phone ?? DASH}</dd>
              <dt className="text-subtle">Company</dt>
              <dd className="text-ink">{open.company ?? DASH}</dd>
              <dt className="text-subtle">Email to sales</dt>
              <dd>
                <EmailedBadge message={open} />
              </dd>
              <dt className="text-subtle">IP address</dt>
              <dd className="font-mono text-[12.5px] text-text-2">{open.ip ?? DASH}</dd>
            </dl>
            <div className="whitespace-pre-wrap break-words rounded-md border border-line bg-surface px-4 py-3 text-[14px] leading-[1.6] text-text-2">{open.message}</div>
          </div>
        ) : null}
      </Drawer>
    </>
  );
}

function EmailedBadge({ message }: { message: ContactRequest }) {
  return message.emailedAt ? (
    <Badge tone="success" title={`Sent ${formatDateTime(message.emailedAt)}`}>
      Emailed
    </Badge>
  ) : (
    <Badge tone="warning" title="Not emailed: email isn't configured on the API, or the send failed (see the API log)">
      Not emailed
    </Badge>
  );
}
