"use client";

import { useState, type FormEvent } from "react";
import { Pencil, Phone, Plus, Power } from "lucide-react";
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
  MultiSelect,
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
import {
  api,
  errorMessage,
  type AddOnInput,
  type AddOnKind,
  type AdminAddOn,
  type AdminPlan,
  type AdminTenant,
  type BillingType,
  type PricingResponse,
  type WithStripeError,
} from "@/lib/backoffice/api";
import { centsToDollarInput, dollarInputToCents, formatCents, formatInt, formatPercent, formatRate, marginPercent } from "@/lib/backoffice/format";

const KIND_LABEL: Record<AddOnKind, string> = { MINUTE_PACK: "Minute pack", PHONE_NUMBER: "Phone number", SERVICE: "Service" };
const BILLING_LABEL: Record<BillingType, string> = { ONE_TIME: "One-time", RECURRING: "Monthly" };

type Flash = { tone: "success" | "warning" | "danger"; title: string; body?: string; addOnId?: string };

export function AddOnsView() {
  const addOns = useApi<AdminAddOn[]>("/admin/add-ons");
  const plans = useApi<AdminPlan[]>("/admin/plans");
  const tenants = useApi<AdminTenant[]>("/admin/tenants");
  const pricing = useApi<PricingResponse>("/admin/pricing");
  const [editing, setEditing] = useState<AdminAddOn | "new" | null>(null);
  const [flash, setFlash] = useState<Flash | null>(null);
  const [stripeErrors, setStripeErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const internalCpm = pricing.data?.current?.internalCentsPerMin ?? null;

  function afterWrite(result: WithStripeError<AdminAddOn>, verb: string) {
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
            addOnId: result.id,
          }
        : { tone: "success", title: `${verb} “${result.name}”${verb === "Synced" ? " to Stripe" : ""}.` },
    );
    addOns.reload();
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

  const sync = (a: AdminAddOn) =>
    run(`sync:${a.id}`, async () => afterWrite(await api<WithStripeError<AdminAddOn>>(`/admin/add-ons/${a.id}/sync-stripe`, { method: "POST" }), "Synced"));

  const toggleActive = (a: AdminAddOn) => {
    if (a.isActive && !window.confirm(`Deactivate “${a.name}”? Customers can no longer buy it; existing purchases are unaffected.`)) return;
    return run(`active:${a.id}`, async () =>
      afterWrite(
        await api<WithStripeError<AdminAddOn>>(`/admin/add-ons/${a.id}`, { method: "PATCH", body: { isActive: !a.isActive } }),
        a.isActive ? "Deactivated" : "Activated",
      ),
    );
  };

  const activePhone = addOns.data?.filter((a) => a.kind === "PHONE_NUMBER" && a.isActive) ?? [];

  return (
    <>
      <PageHeader
        title="Add-ons"
        description="Extras customers can buy on top of a plan: prepaid minute packs, extra phone numbers and services."
        actions={
          <Button variant="primary" icon={<Plus size={15} aria-hidden />} onClick={() => setEditing("new")}>
            New add-on
          </Button>
        }
      />

      <div className="mb-4 space-y-3">
        <Notice tone="info" title="The active “Phone number” add-on is the phone-number price">
          Its price is what customers pay per month for each number beyond their plan’s included numbers, and its internal cost is the
          assumed Telnyx monthly cost. It is not sold from the add-on list — customers buy numbers through the phone-number flow.
          {activePhone.length === 1 ? (
            <>
              {" "}Currently <strong>{formatCents(activePhone[0].priceCents)}/mo</strong> (cost {formatCents(activePhone[0].internalCostCents)}).
            </>
          ) : null}
        </Notice>
        {addOns.data && activePhone.length === 0 ? (
          <Notice tone="warning">No active Phone number add-on — additional numbers have no price. Create or activate one.</Notice>
        ) : null}
        {activePhone.length > 1 ? (
          <Notice tone="warning">More than one Phone number add-on is active. Keep exactly one active so the number price is unambiguous.</Notice>
        ) : null}
        {flash ? (
          <Notice
            tone={flash.tone}
            title={flash.title}
            onClose={() => setFlash(null)}
            action={
              flash.addOnId && addOns.data?.some((a) => a.id === flash.addOnId) ? (
                <Button size="sm" onClick={() => sync(addOns.data!.find((a) => a.id === flash.addOnId)!)} loading={busy === `sync:${flash.addOnId}`}>
                  Retry sync
                </Button>
              ) : null
            }
          >
            {flash.body}
          </Notice>
        ) : null}
      </div>

      <Card bodyClassName="">
        <DataState state={addOns} isEmpty={(d) => d.length === 0} empty={<Empty title="No add-ons yet">Create a minute pack or the phone-number add-on.</Empty>}>
          {(list) => (
            <Table minWidth={1150}>
              <thead>
                <tr>
                  <th className={th}>Add-on</th>
                  <th className={th}>Type</th>
                  <th className={thNum}>Price</th>
                  <th className={thNum}>Minutes</th>
                  <th className={thNum} title="Pack price divided by its minutes">Eff. $/min</th>
                  <th className={thNum}>Internal cost</th>
                  <th className={thNum}>Margin</th>
                  <th className={th}>Available to</th>
                  <th className={thNum}>Active buys</th>
                  <th className={th}>Stripe</th>
                  <th className={`${th} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...list]
                  .sort((a, b) => a.sortOrder - b.sortOrder)
                  .map((a) => {
                    const perMin = a.kind === "MINUTE_PACK" && a.minutes ? a.priceCents / a.minutes : null;
                    const packUsageCost = a.kind === "MINUTE_PACK" && a.minutes && internalCpm !== null ? Math.round(a.minutes * internalCpm) : null;
                    const packMargin = packUsageCost !== null ? a.priceCents - a.internalCostCents - packUsageCost : null;
                    const err = stripeErrors[a.id];
                    return (
                      <tr key={a.id} className={`${tr} ${a.isActive ? "" : "opacity-60"}`}>
                        <td className={td}>
                          <div className="flex items-center gap-1.5 font-bold text-ink">
                            {a.kind === "PHONE_NUMBER" ? <Phone size={13} className="text-brand" aria-hidden /> : null}
                            {a.name}
                          </div>
                          <div className="whitespace-nowrap font-mono text-[11.5px] text-faint">
                            {a.slug} · sort {a.sortOrder}
                          </div>
                        </td>
                        <td className={td}>
                          <div className="flex flex-wrap gap-1">
                            <Badge tone="info">{KIND_LABEL[a.kind]}</Badge>
                            <Badge>{BILLING_LABEL[a.billingType]}</Badge>
                          </div>
                        </td>
                        <td className={`${tdNum} font-medium`}>
                          {formatCents(a.priceCents)}
                          {a.billingType === "RECURRING" ? <span className="text-[11.5px] text-subtle">/mo</span> : null}
                        </td>
                        <td className={tdNum}>{a.minutes ? formatInt(a.minutes) : "—"}</td>
                        <td className={tdNum}>
                          {perMin !== null ? formatRate(perMin) : "—"}
                          {perMin !== null && internalCpm !== null ? (
                            <div className={`text-[11.5px] ${perMin < internalCpm ? "text-red-600" : "text-subtle"}`}>vs cost {formatRate(internalCpm)}</div>
                          ) : null}
                        </td>
                        <td className={tdNum}>{formatCents(a.internalCostCents)}</td>
                        <td className={`${tdNum} ${a.marginCents < 0 ? "text-red-600" : ""}`}>
                          {formatCents(a.marginCents)}
                          <div className="text-[11.5px] text-subtle">{formatPercent(marginPercent(a.marginCents, a.priceCents))}</div>
                          {packMargin !== null ? (
                            <div className={`text-[11.5px] ${packMargin < 0 ? "text-red-600" : "text-subtle"}`} title="Price minus internal cost minus the usage cost of all pack minutes at the current internal rate">
                              {formatCents(packMargin)} if all used
                            </div>
                          ) : null}
                        </td>
                        <td className={`${td} max-w-[220px] text-[12.5px]`}>
                          {a.allowedPlans.length === 0 && a.allowedTenants.length === 0 ? (
                            <span className="text-subtle">All customers</span>
                          ) : (
                            <div className="space-y-0.5">
                              {a.allowedPlans.length ? <div>Plans: {a.allowedPlans.map((p) => p.name).join(", ")}</div> : null}
                              {a.allowedTenants.length ? <div>Customers: {a.allowedTenants.map((t) => t.name).join(", ")}</div> : null}
                            </div>
                          )}
                        </td>
                        <td className={tdNum}>{formatInt(a.activePurchases ?? 0)}</td>
                        <td className={`${td} w-[150px] max-w-[150px]`}>
                          <div className="flex flex-col items-start gap-0.5">
                            {a.stripeSynced ? <Badge tone="success">Synced</Badge> : <Badge tone="warning">Not synced</Badge>}
                            <button type="button" className="text-[12px] font-medium text-brand hover:underline disabled:opacity-50" onClick={() => sync(a)} disabled={busy === `sync:${a.id}`}>
                              {busy === `sync:${a.id}` ? "Syncing…" : a.stripeSynced ? "Resync" : "Sync to Stripe"}
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
                            <Button size="sm" variant="ghost" icon={<Pencil size={13} aria-hidden />} onClick={() => setEditing(a)}>
                              Edit
                            </Button>
                            <IconButton label={a.isActive ? "Deactivate" : "Activate"} icon={<Power size={14} aria-hidden />} onClick={() => toggleActive(a)} loading={busy === `active:${a.id}`} className={a.isActive ? "" : "text-success"} />
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
        title={editing === "new" ? "New add-on" : editing ? `Edit ${editing.name}` : ""}
        subtitle={editing && editing !== "new" ? `Slug ${editing.slug} · ${KIND_LABEL[editing.kind]} · ${BILLING_LABEL[editing.billingType]} (kind & billing are fixed)` : "Kind and billing type can’t be changed after creation."}
        onClose={() => setEditing(null)}
      >
        {editing !== null ? (
          <AddOnForm
            key={editing === "new" ? "new" : editing.id}
            addOn={editing === "new" ? null : editing}
            plans={plans.data ?? []}
            plansLoading={plans.initialLoading}
            tenants={tenants.data ?? []}
            tenantsLoading={tenants.initialLoading}
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

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Kinds with a forced billing type. */
const FORCED_BILLING: Partial<Record<AddOnKind, BillingType>> = { MINUTE_PACK: "ONE_TIME", PHONE_NUMBER: "RECURRING" };

function AddOnForm({
  addOn,
  plans,
  plansLoading,
  tenants,
  tenantsLoading,
  internalCpm,
  onCancel,
  onSaved,
}: {
  addOn: AdminAddOn | null;
  plans: AdminPlan[];
  plansLoading: boolean;
  tenants: AdminTenant[];
  tenantsLoading: boolean;
  internalCpm: number | null;
  onCancel: () => void;
  onSaved: (result: WithStripeError<AdminAddOn>, created: boolean) => void;
}) {
  const creating = addOn === null;
  const [name, setName] = useState(addOn?.name ?? "");
  const [slug, setSlug] = useState(addOn?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState(addOn?.description ?? "");
  const [kind, setKind] = useState<AddOnKind>(addOn?.kind ?? "MINUTE_PACK");
  const [billingType, setBillingType] = useState<BillingType>(addOn?.billingType ?? "ONE_TIME");
  const [price, setPrice] = useState(addOn ? centsToDollarInput(addOn.priceCents) : "");
  const [minutes, setMinutes] = useState(addOn?.minutes ? String(addOn.minutes) : "");
  const [cost, setCost] = useState(centsToDollarInput(addOn?.internalCostCents ?? 0));
  const [isActive, setIsActive] = useState(addOn?.isActive ?? true);
  const [sortOrder, setSortOrder] = useState(String(addOn?.sortOrder ?? 0));
  const initiallyRestricted = !!addOn && (addOn.allowedPlans.length > 0 || addOn.allowedTenants.length > 0);
  const [restricted, setRestricted] = useState(initiallyRestricted);
  const [planIds, setPlanIds] = useState<string[]>(addOn?.allowedPlans.map((p) => p.id) ?? []);
  const [tenantIds, setTenantIds] = useState<string[]>(addOn?.allowedTenants.map((t) => t.id) ?? []);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempted, setAttempted] = useState(false);

  const effectiveBilling = FORCED_BILLING[kind] ?? billingType;
  const priceCents = dollarInputToCents(price);
  const costCents = dollarInputToCents(cost);
  const minutesN = /^\d+$/.test(minutes.trim()) ? Number(minutes.trim()) : null;
  const sortN = /^-?\d+$/.test(sortOrder.trim()) ? Number(sortOrder.trim()) : null;

  const errors = {
    name: name.trim() ? null : "Required",
    slug: creating && !SLUG_RE.test(slug) ? "Lowercase letters/numbers joined by dashes" : null,
    price: priceCents === null ? "Enter dollars, e.g. 35.00" : null,
    cost: costCents === null ? "Enter dollars, e.g. 1.00" : null,
    minutes: kind === "MINUTE_PACK" && (minutesN === null || minutesN < 1) ? "Minute packs need ≥ 1 minute" : null,
    sortOrder: sortN === null ? "Whole number" : null,
    availability: restricted && planIds.length === 0 && tenantIds.length === 0 ? "Pick at least one plan or customer, or make it available to all" : null,
  };
  const valid = Object.values(errors).every((e) => e === null);
  // Only surface validation once the operator tries to save (or when editing an existing record).
  const shown = attempted || !creating ? errors : ({} as Partial<typeof errors>);

  const margin = priceCents !== null && costCents !== null ? priceCents - costCents : null;
  const perMin = kind === "MINUTE_PACK" && priceCents !== null && minutesN ? priceCents / minutesN : null;
  const packUsageCost = kind === "MINUTE_PACK" && minutesN && internalCpm !== null ? Math.round(minutesN * internalCpm) : null;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setAttempted(true);
    if (!valid) return;
    const body: AddOnInput = {
      name: name.trim(),
      description: description.trim(),
      priceCents: priceCents!,
      internalCostCents: costCents!,
      isActive,
      sortOrder: sortN!,
      allowedPlanIds: restricted ? planIds : [],
      allowedTenantIds: restricted ? tenantIds : [],
    };
    if (kind === "MINUTE_PACK") body.minutes = minutesN!;
    if (creating) {
      body.slug = slug;
      body.kind = kind;
      body.billingType = effectiveBilling;
      if (!body.description) delete body.description;
    }
    setSubmitting(true);
    setError(null);
    try {
      const result = creating
        ? await api<WithStripeError<AdminAddOn>>("/admin/add-ons", { method: "POST", body })
        : await api<WithStripeError<AdminAddOn>>(`/admin/add-ons/${addOn.id}`, { method: "PATCH", body });
      onSaved(result, creating);
    } catch (err) {
      setError(errorMessage(err));
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <fieldset className="grid gap-3 sm:grid-cols-2">
        <Field label="Name" error={shown.name}>
          {(id) => (
            <input
              id={id}
              className={inputClass}
              maxLength={80}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (creating && !slugTouched) setSlug(slugify(e.target.value));
              }}
            />
          )}
        </Field>
        <Field label="Slug" hint={creating ? "Cannot be changed later." : "Immutable"} error={shown.slug}>
          {(id) => (
            <input
              id={id}
              className={`${inputClass} font-mono`}
              value={slug}
              disabled={!creating}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
            />
          )}
        </Field>
        <Field label="Description" className="sm:col-span-2" hint="Shown to customers.">
          {(id) => <textarea id={id} rows={2} maxLength={500} className={`${inputBase} w-full py-2`} value={description} onChange={(e) => setDescription(e.target.value)} />}
        </Field>
        <Field label="Kind" hint={creating ? undefined : "Fixed after creation"}>
          {(id) => (
            <select id={id} className={inputClass} value={kind} disabled={!creating} onChange={(e) => setKind(e.target.value as AddOnKind)}>
              <option value="MINUTE_PACK">Minute pack (prepaid minutes)</option>
              <option value="PHONE_NUMBER">Phone number (monthly price per extra number)</option>
              <option value="SERVICE">Service</option>
            </select>
          )}
        </Field>
        <Field
          label="Billing"
          hint={!creating ? "Fixed after creation" : FORCED_BILLING[kind] ? `${KIND_LABEL[kind]}s are always ${BILLING_LABEL[FORCED_BILLING[kind]!].toLowerCase()}` : undefined}
        >
          {(id) => (
            <select
              id={id}
              className={inputClass}
              value={effectiveBilling}
              disabled={!creating || !!FORCED_BILLING[kind]}
              onChange={(e) => setBillingType(e.target.value as BillingType)}
            >
              <option value="ONE_TIME">One-time</option>
              <option value="RECURRING">Recurring (monthly)</option>
            </select>
          )}
        </Field>
      </fieldset>

      {kind === "PHONE_NUMBER" ? (
        <Notice tone="info">
          While active, this add-on sets the phone-number price: customers pay its price monthly for each number beyond their plan’s
          included numbers. Its internal cost is the assumed Telnyx monthly cost per number.
        </Notice>
      ) : null}

      <fieldset className="grid gap-3 border-t border-line pt-4 sm:grid-cols-3">
        <Field label={effectiveBilling === "RECURRING" ? "Price / month" : "Price"} error={shown.price}>
          {(id) => <MoneyInput id={id} value={price} onChange={setPrice} invalid={!!shown.price} />}
        </Field>
        <Field label="Internal cost" error={shown.cost} hint={kind === "PHONE_NUMBER" ? "Telnyx cost per number / month" : "Direct cost per unit"}>
          {(id) => <MoneyInput id={id} value={cost} onChange={setCost} invalid={!!shown.cost} />}
        </Field>
        {kind === "MINUTE_PACK" ? (
          <Field label="Minutes" error={shown.minutes}>
            {(id) => <input id={id} inputMode="numeric" className={inputClass} value={minutes} onChange={(e) => setMinutes(e.target.value)} aria-invalid={!!shown.minutes || undefined} />}
          </Field>
        ) : (
          <div />
        )}
        <Field label="Sort order" error={shown.sortOrder}>
          {(id) => <input id={id} inputMode="numeric" className={inputClass} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} aria-invalid={!!shown.sortOrder || undefined} />}
        </Field>
        <div className="flex items-end pb-1.5 sm:col-span-2">
          <Checkbox checked={isActive} onChange={setIsActive} label="Active" hint="Inactive add-ons can’t be bought" />
        </div>
      </fieldset>

      <div className="rounded-md border border-amber-200 bg-amber-50/60 p-3">
        <div className="mb-2 text-[11.5px] font-bold uppercase tracking-[.08em] text-amber-900">Internal economics</div>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[13px] tabular-nums sm:grid-cols-4">
          <div>
            <dt className="text-[11.5px] text-subtle">Margin</dt>
            <dd className={`font-medium ${margin !== null && margin < 0 ? "text-red-600" : ""}`}>
              {formatCents(margin)} <span className="text-[11.5px] text-subtle">{margin !== null && priceCents ? formatPercent(marginPercent(margin, priceCents)) : ""}</span>
            </dd>
          </div>
          {kind === "MINUTE_PACK" ? (
            <>
              <div>
                <dt className="text-[11.5px] text-subtle">Effective price / min</dt>
                <dd className="font-medium">{perMin !== null ? formatRate(perMin, { suffix: true }) : "—"}</dd>
              </div>
              <div>
                <dt className="text-[11.5px] text-subtle">Usage cost if all used</dt>
                <dd className="font-medium">{packUsageCost !== null ? formatCents(packUsageCost) : "—"}</dd>
              </div>
              <div>
                <dt className="text-[11.5px] text-subtle">Margin if all used</dt>
                <dd className={`font-medium ${margin !== null && packUsageCost !== null && margin - packUsageCost < 0 ? "text-red-600" : ""}`}>
                  {margin !== null && packUsageCost !== null ? formatCents(margin - packUsageCost) : "—"}
                </dd>
              </div>
            </>
          ) : null}
        </dl>
        {kind === "MINUTE_PACK" && internalCpm !== null ? (
          <p className="mt-1.5 text-[11.5px] text-amber-900">Usage cost at the current internal rate of {formatRate(internalCpm, { suffix: true })}.</p>
        ) : null}
      </div>

      <fieldset className="space-y-3 border-t border-line pt-4">
        <div className="text-[12.5px] font-medium text-text-2">Availability</div>
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-5">
          <label className="flex items-center gap-2 text-[13.5px]">
            <input type="radio" className="accent-brand" checked={!restricted} onChange={() => setRestricted(false)} />
            All customers
          </label>
          <label className="flex items-center gap-2 text-[13.5px]">
            <input type="radio" className="accent-brand" checked={restricted} onChange={() => setRestricted(true)} />
            Only specific plans and/or customers
          </label>
        </div>
        {restricted ? (
          <>
            <p className="text-[12px] text-subtle">A customer can buy it if they’re on any selected plan <em>or</em> are selected individually.</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <div className="mb-1 text-[12.5px] font-medium text-text-2">Plans ({planIds.length})</div>
                <MultiSelect
                  options={plans.map((p) => ({ id: p.id, label: p.name, sub: p.isActive ? undefined : "inactive" }))}
                  selected={planIds}
                  onChange={setPlanIds}
                  loading={plansLoading}
                  placeholder="Search plans…"
                  emptyLabel="No plans"
                />
              </div>
              <div>
                <div className="mb-1 text-[12.5px] font-medium text-text-2">Customers ({tenantIds.length})</div>
                <MultiSelect
                  options={tenants.map((t) => ({ id: t.id, label: t.name, sub: t.email }))}
                  selected={tenantIds}
                  onChange={setTenantIds}
                  loading={tenantsLoading}
                  placeholder="Search customers…"
                  emptyLabel="No customers"
                />
              </div>
            </div>
            {shown.availability ? <p className="text-[12px] text-red-600">{shown.availability}</p> : null}
          </>
        ) : null}
      </fieldset>

      {attempted && !valid ? <Notice tone="danger">Fix the highlighted fields before saving.</Notice> : null}
      {error ? <Notice tone="danger">{error}</Notice> : null}

      <div className="flex justify-end gap-2 border-t border-line pt-4">
        <Button onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={submitting}>
          {creating ? "Create add-on" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
