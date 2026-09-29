"use client";

import { useState, type FormEvent } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Power, Star, Trash2 } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  DataState,
  Drawer,
  IconButton,
  Empty,
  Field,
  MoneyInput,
  Notice,
  PageHeader,
  Table,
  inputBase,
  inputClass,
  td,
  tdNum,
  th,
  thNum,
  tr,
} from "@/components/backoffice/ui";
import { useApi } from "@/components/backoffice/useApi";
import { api, errorMessage, type AdminPlan, type PlanInput, type PricingResponse, type WithStripeError } from "@/lib/backoffice/api";
import {
  addRates,
  centsToDollarInput,
  dollarInputToCents,
  dollarRateInputToCentsPerMin,
  formatCents,
  formatInt,
  formatPercent,
  formatRate,
  marginPercent,
  rateToDollarInput,
} from "@/lib/backoffice/format";

type Flash = { tone: "success" | "warning" | "danger"; title: string; body?: string; planId?: string };

export function PlansView() {
  const plans = useApi<AdminPlan[]>("/admin/plans");
  const pricing = useApi<PricingResponse>("/admin/pricing");
  const [editing, setEditing] = useState<AdminPlan | "new" | null>(null);
  const [flash, setFlash] = useState<Flash | null>(null);
  /** Last Stripe error per plan (from the most recent save/sync this session). */
  const [stripeErrors, setStripeErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);

  const internalCpm = pricing.data?.current?.internalCentsPerMin ?? null;

  function afterWrite(result: WithStripeError<AdminPlan>, verb: string) {
    setStripeErrors((prev) => {
      const next = { ...prev };
      if (result.stripeError) next[result.id] = result.stripeError;
      else delete next[result.id];
      return next;
    });
    setFlash(
      result.stripeError
        ? {
            tone: "warning",
            title: `${verb} “${result.name}” in Ringgy — not pushed to Stripe`,
            body: `${result.stripeError}. The change is live in Ringgy; use “Sync to Stripe” to retry once Stripe is available.`,
            planId: result.id,
          }
        : { tone: "success", title: `${verb} “${result.name}”${verb === "Synced" ? " to Stripe" : ""}.` },
    );
    plans.reload();
  }

  async function run(id: string, fn: () => Promise<void>) {
    setBusy(id);
    try {
      await fn();
    } catch (err) {
      setFlash({ tone: "danger", title: "Action failed", body: errorMessage(err) });
    } finally {
      setBusy(null);
    }
  }

  const sync = (p: AdminPlan) =>
    run(`sync:${p.id}`, async () => {
      afterWrite(await api<WithStripeError<AdminPlan>>(`/admin/plans/${p.id}/sync-stripe`, { method: "POST" }), "Synced");
    });

  const toggleActive = (p: AdminPlan) => {
    if (p.isActive && !window.confirm(`Deactivate “${p.name}”?\n\nIt can no longer be chosen. ${p.subscribers} existing subscriber(s) keep their plan.`)) return;
    return run(`active:${p.id}`, async () => {
      afterWrite(
        await api<WithStripeError<AdminPlan>>(`/admin/plans/${p.id}`, { method: "PATCH", body: { isActive: !p.isActive } }),
        p.isActive ? "Deactivated" : "Activated",
      );
    });
  };

  return (
    <>
      <PageHeader
        title="Plans"
        description="Monthly subscription plans. Economics use the current internal rate card; plans are never deleted — deactivate instead."
        actions={
          <Button variant="primary" icon={<Plus size={15} aria-hidden />} onClick={() => setEditing("new")}>
            New plan
          </Button>
        }
      />
      {flash ? (
        <div className="mb-4">
          <Notice
            tone={flash.tone}
            title={flash.title}
            onClose={() => setFlash(null)}
            action={
              flash.planId && plans.data?.find((p) => p.id === flash.planId) ? (
                <Button size="sm" onClick={() => sync(plans.data!.find((p) => p.id === flash.planId)!)} loading={busy === `sync:${flash.planId}`}>
                  Retry sync
                </Button>
              ) : null
            }
          >
            {flash.body}
          </Notice>
        </div>
      ) : null}

      <Card bodyClassName="">
        <DataState state={plans} isEmpty={(d) => d.length === 0} empty={<Empty title="No plans yet">Create the first plan to offer it on signup.</Empty>}>
          {(list) => (
            <Table minWidth={1040}>
              <thead>
                <tr>
                  <th className={th}>Plan</th>
                  <th className={thNum}>Price / mo</th>
                  <th className={thNum}>Included</th>
                  <th className={thNum}>Overage</th>
                  <th className={thNum}>Subs</th>
                  <th className={thNum} title="Cost of the included minutes at the current internal rate">Incl. min cost</th>
                  <th className={thNum} title="Price minus the cost of all included minutes">Margin @ full use</th>
                  <th className={thNum} title="Overage price minus internal cost per minute">Overage margin</th>
                  <th className={th}>Status</th>
                  <th className={th}>Stripe</th>
                  <th className={`${th} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...list]
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((p) => {
                    const e = p.economics;
                    const err = stripeErrors[p.id];
                    return (
                      <tr key={p.id} className={`${tr} ${p.isActive ? "" : "opacity-60"}`}>
                        <td className={td}>
                          <div className="flex items-center gap-1.5 font-bold text-ink">
                            {p.name}
                            {p.highlight ? <Star size={13} className="fill-amber-400 text-amber-500" aria-label="Highlighted" /> : null}
                          </div>
                          <div className="whitespace-nowrap font-mono text-[11.5px] text-faint">{p.slug} · sort {p.sortOrder}</div>
                        </td>
                        <td className={`${tdNum} font-medium`}>{formatCents(p.priceCents)}</td>
                        <td className={tdNum}>
                          {formatInt(p.includedMinutes)} min
                          <div className="text-[11.5px] text-subtle">
                            {p.includedPhoneNumbers} number{p.includedPhoneNumbers === 1 ? "" : "s"} · warn {p.usageWarningPercent}%
                          </div>
                        </td>
                        <td className={tdNum}>{p.overageEnabled ? formatRate(p.overageCentsPerMin, { suffix: true }) : <Badge>Off</Badge>}</td>
                        <td className={tdNum}>{formatInt(p.subscribers)}</td>
                        <td className={tdNum}>
                          {e ? formatCents(e.includedMinutesCostCents) : "—"}
                          {e ? <div className="text-[11.5px] text-subtle">@ {formatRate(e.internalCentsPerMin, { suffix: true })}</div> : null}
                        </td>
                        <td className={`${tdNum} ${e && e.marginAtFullUseCents < 0 ? "text-red-600" : ""}`}>
                          {e ? formatCents(e.marginAtFullUseCents) : "—"}
                          {e ? <div className="text-[11.5px] text-subtle">{formatPercent(marginPercent(e.marginAtFullUseCents, p.priceCents))}</div> : null}
                        </td>
                        <td className={`${tdNum} ${e && e.overageMarginCentsPerMin < 0 ? "text-red-600" : ""}`}>
                          {e && p.overageEnabled ? formatRate(e.overageMarginCentsPerMin, { suffix: true }) : "—"}
                        </td>
                        <td className={td}>
                          <div className="flex flex-wrap gap-1">
                            {p.isActive ? <Badge tone="success">Active</Badge> : <Badge>Inactive</Badge>}
                            {p.isPublic ? <Badge tone="info">Public</Badge> : <Badge title="Hidden from signup and plan changes">Hidden</Badge>}
                          </div>
                        </td>
                        <td className={`${td} w-[150px] max-w-[150px]`}>
                          <div className="flex flex-col items-start gap-0.5">
                            {p.stripeSynced ? <Badge tone="success">Synced</Badge> : <Badge tone="warning">Not synced</Badge>}
                            <button type="button" className="text-[12px] font-medium text-brand hover:underline disabled:opacity-50" onClick={() => sync(p)} disabled={busy === `sync:${p.id}`}>
                              {busy === `sync:${p.id}` ? "Syncing…" : p.stripeSynced ? "Resync" : "Sync to Stripe"}
                            </button>
                          </div>
                          {err ? (
                            <div className="mt-1 truncate text-[11.5px] text-amber-800" title={err}>
                              {err}
                            </div>
                          ) : null}
                        </td>
                        <td className={`${td} text-right`}>
                          <div className="flex items-center justify-end gap-0.5">
                            <Button size="sm" variant="ghost" icon={<Pencil size={13} aria-hidden />} onClick={() => setEditing(p)}>
                              Edit
                            </Button>
                            <IconButton label={p.isActive ? "Deactivate" : "Activate"} icon={<Power size={14} aria-hidden />} onClick={() => toggleActive(p)} loading={busy === `active:${p.id}`} className={p.isActive ? "" : "text-success"} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </Table>
          )}
        </DataState>
      </Card>

      <Drawer
        open={editing !== null}
        title={editing === "new" ? "New plan" : editing ? `Edit ${editing.name}` : ""}
        subtitle={editing && editing !== "new" ? `Slug ${editing.slug} (immutable) · ${editing.subscribers} subscriber(s)` : "Monthly plan. Saved in Ringgy first, then pushed to Stripe."}
        onClose={() => setEditing(null)}
      >
        {editing !== null ? (
          <PlanForm
            key={editing === "new" ? "new" : editing.id}
            plan={editing === "new" ? null : editing}
            internalCpm={internalCpm}
            onCancel={() => setEditing(null)}
            onSaved={(result, created) => {
              setEditing(null);
              afterWrite(result, created ? "Created" : "Saved");
            }}
          />
        ) : null}
      </Drawer>
    </>
  );
}

// ---- form ------------------------------------------------------------------------

type FormState = {
  name: string;
  slug: string;
  description: string;
  price: string;
  includedMinutes: string;
  includedPhoneNumbers: string;
  overage: string;
  overageEnabled: boolean;
  usageWarningPercent: string;
  features: string[];
  isActive: boolean;
  isPublic: boolean;
  highlight: boolean;
  sortOrder: string;
};

function initial(plan: AdminPlan | null): FormState {
  return {
    name: plan?.name ?? "",
    slug: plan?.slug ?? "",
    description: plan?.description ?? "",
    price: plan ? centsToDollarInput(plan.priceCents) : "",
    includedMinutes: plan ? String(plan.includedMinutes) : "",
    includedPhoneNumbers: String(plan?.includedPhoneNumbers ?? 1),
    overage: plan ? rateToDollarInput(plan.overageCentsPerMin) : "",
    overageEnabled: plan?.overageEnabled ?? true,
    usageWarningPercent: String(plan?.usageWarningPercent ?? 90),
    features: plan?.features ?? [],
    isActive: plan?.isActive ?? true,
    isPublic: plan?.isPublic ?? true,
    highlight: plan?.highlight ?? false,
    sortOrder: String(plan?.sortOrder ?? 0),
  };
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function intOrNull(s: string, min: number, max = Number.MAX_SAFE_INTEGER): number | null {
  const t = s.trim();
  if (!/^-?\d+$/.test(t)) return null;
  const n = Number(t);
  return n >= min && n <= max ? n : null;
}

function PlanForm({
  plan,
  internalCpm,
  onCancel,
  onSaved,
}: {
  plan: AdminPlan | null;
  internalCpm: number | null;
  onCancel: () => void;
  onSaved: (result: WithStripeError<AdminPlan>, created: boolean) => void;
}) {
  const [f, setF] = useState<FormState>(() => initial(plan));
  const [slugTouched, setSlugTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempted, setAttempted] = useState(false);
  const creating = plan === null;

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setF((prev) => ({ ...prev, [k]: v }));

  const priceCents = dollarInputToCents(f.price);
  const includedMinutes = intOrNull(f.includedMinutes, 0);
  const includedPhoneNumbers = intOrNull(f.includedPhoneNumbers, 0, 100);
  const overageCpm = dollarRateInputToCentsPerMin(f.overage);
  const warn = intOrNull(f.usageWarningPercent, 1, 100);
  const sortOrder = intOrNull(f.sortOrder, Number.MIN_SAFE_INTEGER);
  const features = f.features.map((x) => x.trim()).filter(Boolean);

  const errors = {
    name: f.name.trim() ? null : "Required",
    slug: creating && !SLUG_RE.test(f.slug) ? "Lowercase letters/numbers joined by dashes" : null,
    price: priceCents === null ? "Enter dollars, e.g. 49.00" : null,
    includedMinutes: includedMinutes === null ? "Whole number ≥ 0" : null,
    includedPhoneNumbers: includedPhoneNumbers === null ? "Whole number 0–100" : null,
    overage: overageCpm === null ? "Dollars per minute, up to 4 decimals" : null,
    warn: warn === null ? "1–100" : null,
    sortOrder: sortOrder === null ? "Whole number" : null,
    features: features.length > 30 ? "At most 30 features" : null,
  };
  const valid = Object.values(errors).every((e) => e === null);
  // Only surface validation once the operator tries to save (or when editing an existing record).
  const shown = attempted || !creating ? errors : ({} as Partial<typeof errors>);

  // Live economics at the current internal rate.
  const econ =
    internalCpm !== null && priceCents !== null && includedMinutes !== null
      ? {
          includedCost: Math.round(includedMinutes * internalCpm),
          marginFull: priceCents - Math.round(includedMinutes * internalCpm),
          perIncludedMin: includedMinutes > 0 ? priceCents / includedMinutes : null,
          overageMargin: overageCpm !== null ? addRates(overageCpm, -internalCpm) : null,
        }
      : null;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setAttempted(true);
    if (!valid) return;
    const body: PlanInput = {
      name: f.name.trim(),
      description: f.description.trim(),
      priceCents: priceCents!,
      includedMinutes: includedMinutes!,
      includedPhoneNumbers: includedPhoneNumbers!,
      overageCentsPerMin: overageCpm!,
      overageEnabled: f.overageEnabled,
      usageWarningPercent: warn!,
      features,
      isActive: f.isActive,
      isPublic: f.isPublic,
      highlight: f.highlight,
      sortOrder: sortOrder!,
    };
    if (creating) {
      body.slug = f.slug;
      if (!body.description) delete body.description;
    }
    setSubmitting(true);
    setError(null);
    try {
      const result = creating
        ? await api<WithStripeError<AdminPlan>>("/admin/plans", { method: "POST", body })
        : await api<WithStripeError<AdminPlan>>(`/admin/plans/${plan.id}`, { method: "PATCH", body });
      onSaved(result, creating);
    } catch (err) {
      setError(errorMessage(err));
      setSubmitting(false);
    }
  }

  const moveFeature = (i: number, dir: -1 | 1) =>
    setF((prev) => {
      const list = [...prev.features];
      const j = i + dir;
      if (j < 0 || j >= list.length) return prev;
      [list[i], list[j]] = [list[j], list[i]];
      return { ...prev, features: list };
    });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <fieldset className="grid gap-3 sm:grid-cols-2">
        <Field label="Name" error={shown.name}>
          {(id) => (
            <input
              id={id}
              className={inputClass}
              maxLength={80}
              value={f.name}
              onChange={(e) => {
                const name = e.target.value;
                setF((prev) => ({ ...prev, name, slug: creating && !slugTouched ? slugify(name) : prev.slug }));
              }}
            />
          )}
        </Field>
        <Field label="Slug" hint={creating ? "Used in URLs and Stripe metadata. Cannot be changed later." : "Immutable"} error={shown.slug}>
          {(id) => (
            <input
              id={id}
              className={`${inputClass} font-mono`}
              value={f.slug}
              disabled={!creating}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", e.target.value);
              }}
            />
          )}
        </Field>
        <Field label="Description" className="sm:col-span-2">
          {(id) => <textarea id={id} rows={2} maxLength={500} className={`${inputBase} w-full py-2`} value={f.description} onChange={(e) => set("description", e.target.value)} />}
        </Field>
      </fieldset>

      <fieldset className="grid gap-3 border-t border-line pt-4 sm:grid-cols-3">
        <Field label="Monthly price" error={shown.price}>
          {(id) => <MoneyInput id={id} value={f.price} onChange={(v) => set("price", v)} invalid={!!shown.price} suffix="/mo" placeholder="49.00" />}
        </Field>
        <Field label="Included minutes" error={shown.includedMinutes}>
          {(id) => <input id={id} inputMode="numeric" className={inputClass} value={f.includedMinutes} onChange={(e) => set("includedMinutes", e.target.value)} aria-invalid={!!shown.includedMinutes || undefined} />}
        </Field>
        <Field label="Included phone numbers" error={shown.includedPhoneNumbers}>
          {(id) => <input id={id} inputMode="numeric" className={inputClass} value={f.includedPhoneNumbers} onChange={(e) => set("includedPhoneNumbers", e.target.value)} aria-invalid={!!shown.includedPhoneNumbers || undefined} />}
        </Field>
        <Field label="Overage price" error={shown.overage} hint="Per minute beyond included + prepaid packs">
          {(id) => <MoneyInput id={id} value={f.overage} onChange={(v) => set("overage", v)} invalid={!!shown.overage} suffix="/min" placeholder="0.1200" />}
        </Field>
        <Field label="Usage warning at" error={shown.warn} hint="% of included minutes">
          {(id) => (
            <div className="relative">
              <input id={id} inputMode="numeric" className={`${inputClass} pr-8`} value={f.usageWarningPercent} onChange={(e) => set("usageWarningPercent", e.target.value)} aria-invalid={!!shown.warn || undefined} />
              <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-[12.5px] text-subtle">%</span>
            </div>
          )}
        </Field>
        <Field label="Sort order" error={shown.sortOrder} hint="Lower shows first">
          {(id) => <input id={id} inputMode="numeric" className={inputClass} value={f.sortOrder} onChange={(e) => set("sortOrder", e.target.value)} aria-invalid={!!shown.sortOrder || undefined} />}
        </Field>
        <div className="sm:col-span-3">
          <Checkbox
            checked={f.overageEnabled}
            onChange={(v) => set("overageEnabled", v)}
            label="Overage billing enabled"
            hint="Calls are never cut off; with overage off, minutes past the allowance are not billed."
          />
        </div>
      </fieldset>

      <div className="rounded-md border border-amber-200 bg-amber-50/60 p-3">
        <div className="mb-2 text-[11.5px] font-bold uppercase tracking-[.08em] text-amber-900">
          Internal economics {internalCpm !== null ? `@ ${formatRate(internalCpm, { suffix: true })}` : ""}
        </div>
        {internalCpm === null ? (
          <p className="text-[12.5px] text-amber-900">No pricing version published yet — set internal rates on the Pricing page.</p>
        ) : econ ? (
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[13px] tabular-nums sm:grid-cols-4">
            <div>
              <dt className="text-[11.5px] text-subtle">Included minutes cost</dt>
              <dd className="font-medium">{formatCents(econ.includedCost)}</dd>
            </div>
            <div>
              <dt className="text-[11.5px] text-subtle">Margin at full use</dt>
              <dd className={`font-medium ${econ.marginFull < 0 ? "text-red-600" : ""}`}>
                {formatCents(econ.marginFull)} <span className="text-[11.5px] text-subtle">{formatPercent(marginPercent(econ.marginFull, priceCents ?? 0))}</span>
              </dd>
            </div>
            <div>
              <dt className="text-[11.5px] text-subtle">Price per included min</dt>
              <dd className="font-medium">{econ.perIncludedMin !== null ? formatRate(econ.perIncludedMin) : "—"}</dd>
            </div>
            <div>
              <dt className="text-[11.5px] text-subtle">Overage margin / min</dt>
              <dd className={`font-medium ${econ.overageMargin !== null && econ.overageMargin < 0 ? "text-red-600" : ""}`}>
                {econ.overageMargin !== null ? formatRate(econ.overageMargin) : "—"}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="text-[12.5px] text-subtle">Enter price and included minutes to see margins.</p>
        )}
      </div>

      <fieldset className="border-t border-line pt-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-[12.5px] font-medium text-text-2">Features (shown on pricing / signup)</div>
          <Button size="sm" icon={<Plus size={13} aria-hidden />} onClick={() => set("features", [...f.features, ""])} disabled={f.features.length >= 30}>
            Add feature
          </Button>
        </div>
        {f.features.length === 0 ? (
          <p className="text-[12.5px] text-subtle">No features listed.</p>
        ) : (
          <ul className="space-y-1.5">
            {f.features.map((feat, i) => (
              <li key={i} className="flex items-center gap-1.5">
                <input
                  aria-label={`Feature ${i + 1}`}
                  className={inputClass}
                  value={feat}
                  onChange={(e) => set("features", f.features.map((x, j) => (j === i ? e.target.value : x)))}
                />
                <button type="button" className="rounded p-1.5 text-subtle hover:bg-surface disabled:opacity-30" onClick={() => moveFeature(i, -1)} disabled={i === 0} aria-label="Move up">
                  <ArrowUp size={14} />
                </button>
                <button type="button" className="rounded p-1.5 text-subtle hover:bg-surface disabled:opacity-30" onClick={() => moveFeature(i, 1)} disabled={i === f.features.length - 1} aria-label="Move down">
                  <ArrowDown size={14} />
                </button>
                <button type="button" className="rounded p-1.5 text-red-600 hover:bg-red-50" onClick={() => set("features", f.features.filter((_, j) => j !== i))} aria-label="Remove">
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
        {shown.features ? <p className="mt-1 text-[12px] text-red-600">{shown.features}</p> : null}
      </fieldset>

      <fieldset className="grid gap-2.5 border-t border-line pt-4 sm:grid-cols-3">
        <Checkbox checked={f.isActive} onChange={(v) => set("isActive", v)} label="Active" hint="Inactive plans can’t be chosen" />
        <Checkbox checked={f.isPublic} onChange={(v) => set("isPublic", v)} label="Offered on signup" hint="Public on signup & plan change" />
        <Checkbox checked={f.highlight} onChange={(v) => set("highlight", v)} label="Highlight" hint="“Most popular” styling" />
      </fieldset>

      {attempted && !valid ? <Notice tone="danger">Fix the highlighted fields before saving.</Notice> : null}
      {error ? <Notice tone="danger">{error}</Notice> : null}

      <div className="flex justify-end gap-2 border-t border-line pt-4">
        <Button onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={submitting}>
          {creating ? "Create plan" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
