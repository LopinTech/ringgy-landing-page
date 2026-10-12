"use client";

import { useState, type FormEvent } from "react";
import { ArrowDown, ArrowUp, Pencil, Phone, Plus, Settings, Trash2 } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  DataState,
  Drawer,
  Empty,
  Field,
  MoneyInput,
  Notice,
  PageHeader,
  Table,
  inputBase,
  inputClass,
  td,
  th,
  tr,
} from "@/components/backoffice/ui";
import { useApi } from "@/components/backoffice/useApi";
import {
  api,
  errorMessage,
  type AddOnInput,
  type AdminAddOn,
  type AdminPlan,
  type PlanInput,
  type PricingResponse,
  type TrialPolicy,
  type TrialPolicyInput,
  type TrialPolicyResponse,
  type WithStripeError,
} from "@/lib/backoffice/api";
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

/** A stable, purely cosmetic color per plan card / table column. */
const PALETTE = ["#2F6BFF", "#0E7C66", "#6B4BFF", "#E0562F", "#9A6B2F"];
const TRIAL_COLOR = "#9AA2B4";

function intOrNull(s: string, min: number, max = Number.MAX_SAFE_INTEGER): number | null {
  const t = s.trim();
  if (!/^-?\d+$/.test(t)) return null;
  const n = Number(t);
  return n >= min && n <= max ? n : null;
}

// ---- free trial policy helpers (ported from the old standalone Trial page) ------

type TrialNumberKey =
  | "durationDays"
  | "includedMinutes"
  | "maxPhoneNumbers"
  | "endingSoonDays"
  | "graceDays"
  | "readOnlyDays"
  | "numberRetentionDays"
  | "numberReleaseNoticeDays";
type TrialBoolKey = "enabled" | "oneTrialPerBusinessPhone" | "stopAtMinuteLimit" | "releaseNumbers";
type TrialFormValues = Record<TrialNumberKey, string> & Record<TrialBoolKey, boolean>;

/** Bounds match the API's validation (TrialPolicyDto). */
const TRIAL_LIMITS: Record<TrialNumberKey, { min: number; max: number }> = {
  durationDays: { min: 1, max: 90 },
  includedMinutes: { min: 0, max: 100000 },
  maxPhoneNumbers: { min: 0, max: 10 },
  endingSoonDays: { min: 0, max: 30 },
  graceDays: { min: 0, max: 60 },
  readOnlyDays: { min: 0, max: 365 },
  numberRetentionDays: { min: 0, max: 365 },
  numberReleaseNoticeDays: { min: 0, max: 60 },
};

function trialToForm(p: TrialPolicy): TrialFormValues {
  return {
    enabled: p.enabled,
    oneTrialPerBusinessPhone: p.oneTrialPerBusinessPhone,
    stopAtMinuteLimit: p.stopAtMinuteLimit,
    releaseNumbers: p.releaseNumbers,
    durationDays: String(p.durationDays),
    includedMinutes: String(p.includedMinutes),
    maxPhoneNumbers: String(p.maxPhoneNumbers),
    endingSoonDays: String(p.endingSoonDays),
    graceDays: String(p.graceDays),
    readOnlyDays: String(p.readOnlyDays),
    numberRetentionDays: String(p.numberRetentionDays),
    numberReleaseNoticeDays: String(p.numberReleaseNoticeDays),
  };
}

function trialParseWhole(value: string, key: TrialNumberKey): number | null {
  if (!/^\d+$/.test(value.trim())) return null;
  const n = Number(value.trim());
  const { min, max } = TRIAL_LIMITS[key];
  return n >= min && n <= max ? n : null;
}

function trialParsed(form: TrialFormValues): Record<TrialNumberKey, number | null> {
  return Object.fromEntries(
    (Object.keys(TRIAL_LIMITS) as TrialNumberKey[]).map((k) => [k, trialParseWhole(form[k], k)]),
  ) as Record<TrialNumberKey, number | null>;
}

function trialIsValid(form: TrialFormValues): boolean {
  return Object.values(trialParsed(form)).every((v) => v !== null);
}

// ---- main view ---------------------------------------------------------------------

type Flash = { tone: "success" | "warning" | "danger"; title: string; body?: string };

/** Fields the inline grid / cards edit directly (staged until "Publish changes"). */
type PlanDraft = {
  price?: string;
  includedMinutes?: string;
  includedPhoneNumbers?: string;
  overage?: string;
  overageEnabled?: boolean;
  usageWarningPercent?: string;
  isPublic?: boolean;
  highlight?: boolean;
};

type GroupKey = "usage" | "overage" | "signup";
const GROUPS: { key: GroupKey; label: string }[] = [
  { key: "usage", label: "Usage limits" },
  { key: "overage", label: "Overage" },
  { key: "signup", label: "Signup" },
];

export function PlansView() {
  const plans = useApi<AdminPlan[]>("/admin/plans");
  const addOns = useApi<AdminAddOn[]>("/admin/add-ons");
  const trialPolicy = useApi<TrialPolicyResponse>("/admin/trial-policy");
  const pricing = useApi<PricingResponse>("/admin/pricing");
  const internalCpm = pricing.data?.current?.internalCentsPerMin ?? null;

  const [flash, setFlash] = useState<Flash | null>(null);
  const [editingPlan, setEditingPlan] = useState<AdminPlan | "new" | null>(null);

  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState<"All" | GroupKey>("All");

  const [planDrafts, setPlanDrafts] = useState<Record<string, PlanDraft>>({});
  const [phoneDraft, setPhoneDraft] = useState<{ price?: string; cost?: string }>({});

  const [trialSidebarOpen, setTrialSidebarOpen] = useState(false);
  const [trialSidebarValues, setTrialSidebarValues] = useState<TrialFormValues | null>(null);
  const [trialDraft, setTrialDraft] = useState<TrialFormValues | null>(null);

  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  const list = plans.data ?? [];
  const sortedPlans = [...list].sort((a, b) => a.sortOrder - b.sortOrder);

  // ---- plan draft helpers -----------------------------------------------------
  const draftFor = (id: string): PlanDraft => planDrafts[id] ?? {};
  const priceVal = (p: AdminPlan) => draftFor(p.id).price ?? centsToDollarInput(p.priceCents);
  const overageVal = (p: AdminPlan) => draftFor(p.id).overage ?? rateToDollarInput(p.overageCentsPerMin);
  const strVal = (p: AdminPlan, key: "includedMinutes" | "includedPhoneNumbers" | "usageWarningPercent") =>
    draftFor(p.id)[key] ?? String(p[key]);
  const boolVal = (p: AdminPlan, key: "overageEnabled" | "isPublic" | "highlight") => {
    const d = draftFor(p.id)[key];
    return d !== undefined ? d : p[key];
  };

  const setField = <K extends keyof PlanDraft>(id: string, key: K, value: PlanDraft[K]) =>
    setPlanDrafts((prev) => ({ ...prev, [id]: { ...prev[id], [key]: value } }));

  /** Highlight is exclusive: turning it on for one plan turns it off for the rest. */
  const setHighlight = (id: string, value: boolean) =>
    setPlanDrafts((prev) => {
      const next = { ...prev };
      for (const p of list) next[p.id] = { ...next[p.id], highlight: p.id === id ? value : false };
      return next;
    });

  function planDirty(p: AdminPlan): boolean {
    return (
      priceVal(p) !== centsToDollarInput(p.priceCents) ||
      strVal(p, "includedMinutes") !== String(p.includedMinutes) ||
      strVal(p, "includedPhoneNumbers") !== String(p.includedPhoneNumbers) ||
      overageVal(p) !== rateToDollarInput(p.overageCentsPerMin) ||
      boolVal(p, "overageEnabled") !== p.overageEnabled ||
      strVal(p, "usageWarningPercent") !== String(p.usageWarningPercent) ||
      boolVal(p, "isPublic") !== p.isPublic ||
      boolVal(p, "highlight") !== p.highlight
    );
  }

  function planFieldErrors(p: AdminPlan) {
    return {
      price: dollarInputToCents(priceVal(p)) === null,
      includedMinutes: intOrNull(strVal(p, "includedMinutes"), 0) === null,
      includedPhoneNumbers: intOrNull(strVal(p, "includedPhoneNumbers"), 0, 100) === null,
      overage: dollarRateInputToCentsPerMin(overageVal(p)) === null,
      usageWarningPercent: intOrNull(strVal(p, "usageWarningPercent"), 1, 100) === null,
    };
  }
  const planHasErrors = (p: AdminPlan) => Object.values(planFieldErrors(p)).some(Boolean);

  /** The plan merged with any staged grid edits — used to seed the full edit drawer. */
  function effectivePlan(p: AdminPlan): AdminPlan {
    return {
      ...p,
      priceCents: dollarInputToCents(priceVal(p)) ?? p.priceCents,
      includedMinutes: intOrNull(strVal(p, "includedMinutes"), 0) ?? p.includedMinutes,
      includedPhoneNumbers: intOrNull(strVal(p, "includedPhoneNumbers"), 0, 100) ?? p.includedPhoneNumbers,
      overageCentsPerMin: dollarRateInputToCentsPerMin(overageVal(p)) ?? p.overageCentsPerMin,
      overageEnabled: boolVal(p, "overageEnabled"),
      usageWarningPercent: intOrNull(strVal(p, "usageWarningPercent"), 1, 100) ?? p.usageWarningPercent,
      isPublic: boolVal(p, "isPublic"),
      highlight: boolVal(p, "highlight"),
    };
  }

  function buildPlanBody(p: AdminPlan): PlanInput {
    const e = effectivePlan(p);
    return {
      name: e.name,
      description: e.description ?? undefined,
      priceCents: e.priceCents,
      includedMinutes: e.includedMinutes,
      includedPhoneNumbers: e.includedPhoneNumbers,
      overageCentsPerMin: e.overageCentsPerMin,
      overageEnabled: e.overageEnabled,
      usageWarningPercent: e.usageWarningPercent,
      features: e.features,
      isActive: e.isActive,
      isPublic: e.isPublic,
      highlight: e.highlight,
      sortOrder: e.sortOrder,
    };
  }

  // ---- phone-number price (the active PHONE_NUMBER add-on) --------------------
  const phoneAddOns = (addOns.data ?? []).filter((a) => a.kind === "PHONE_NUMBER");
  const activePhoneAddOns = phoneAddOns.filter((a) => a.isActive);
  const phoneAddOn = activePhoneAddOns[0] ?? phoneAddOns[0] ?? null;

  const phonePriceVal = () => phoneDraft.price ?? (phoneAddOn ? centsToDollarInput(phoneAddOn.priceCents) : "");
  const phoneCostVal = () => phoneDraft.cost ?? (phoneAddOn ? centsToDollarInput(phoneAddOn.internalCostCents) : "0.00");
  const phoneDirty = phoneAddOn
    ? phoneDraft.price !== undefined && phoneDraft.price !== centsToDollarInput(phoneAddOn.priceCents)
      ? true
      : phoneDraft.cost !== undefined && phoneDraft.cost !== centsToDollarInput(phoneAddOn.internalCostCents)
    : phoneDraft.price !== undefined && phoneDraft.price.trim() !== "";
  const phoneInvalid =
    phoneDirty && (dollarInputToCents(phonePriceVal()) === null || dollarInputToCents(phoneCostVal()) === null);

  // ---- trial draft --------------------------------------------------------------
  const trialCurrent = trialPolicy.data?.current ?? null;
  const trialIsDirty = trialDraft !== null && trialCurrent !== null && JSON.stringify(trialDraft) !== JSON.stringify(trialToForm(trialCurrent));
  const trialEffective = trialDraft ?? (trialCurrent ? trialToForm(trialCurrent) : null);

  function openTrialSidebar() {
    if (!trialCurrent) return;
    setTrialSidebarValues(trialDraft ?? trialToForm(trialCurrent));
    setTrialSidebarOpen(true);
  }
  function applyTrialSidebar() {
    if (trialSidebarValues) setTrialDraft(trialSidebarValues);
    setTrialSidebarOpen(false);
  }

  // ---- dirty / publish ------------------------------------------------------------
  const dirtyPlans = list.filter(planDirty);
  const anyInvalid = dirtyPlans.some(planHasErrors) || phoneInvalid || (trialIsDirty && !trialIsValid(trialDraft!));
  const touchedCount = dirtyPlans.length + (phoneDirty ? 1 : 0) + (trialIsDirty ? 1 : 0);
  const affectedSubs = dirtyPlans.reduce((n, p) => n + p.subscribers, 0);

  function discard() {
    setPlanDrafts({});
    setPhoneDraft({});
    setTrialDraft(null);
  }

  async function publish() {
    if (touchedCount === 0 || anyInvalid || publishing) return;
    const parts: string[] = [];
    if (dirtyPlans.length) parts.push(`${dirtyPlans.length} plan${dirtyPlans.length === 1 ? "" : "s"}`);
    if (phoneDirty) parts.push("the phone-number price");
    if (trialIsDirty) parts.push("the free-trial policy");
    if (!window.confirm(`Publish changes to ${parts.join(", ")}?\n\nThis updates what customers and new signups see immediately.`)) return;

    const jobs: { label: string; run: () => Promise<void> }[] = dirtyPlans.map((plan) => ({
      label: plan.name,
      run: async () => {
        const result = await api<WithStripeError<AdminPlan>>(`/admin/plans/${plan.id}`, {
          method: "PATCH",
          body: buildPlanBody(plan),
        });
        plans.mutate((prev) => (prev ?? []).map((p) => (p.id === result.id ? result : p)));
        setPlanDrafts((prev) => {
          const next = { ...prev };
          delete next[plan.id];
          return next;
        });
        if (result.stripeError) {
          setFlash({ tone: "warning", title: `Saved "${plan.name}" — not pushed to Stripe`, body: result.stripeError });
        }
      },
    }));

    if (phoneDirty) {
      jobs.push({
        label: "Phone number price",
        run: async () => {
          const body = {
            priceCents: dollarInputToCents(phonePriceVal())!,
            internalCostCents: dollarInputToCents(phoneCostVal()) ?? 0,
            isActive: true,
          };
          const result = phoneAddOn
            ? await api<WithStripeError<AdminAddOn>>(`/admin/add-ons/${phoneAddOn.id}`, { method: "PATCH", body })
            : await api<WithStripeError<AdminAddOn>>("/admin/add-ons", {
                method: "POST",
                body: {
                  slug: "phone-number",
                  name: "Extra phone number",
                  description: "Monthly price per phone number beyond each plan's included numbers.",
                  kind: "PHONE_NUMBER",
                  billingType: "RECURRING",
                  allowedPlanIds: [],
                  allowedTenantIds: [],
                  sortOrder: 0,
                  ...body,
                } satisfies AddOnInput,
              });
          addOns.mutate((prev) => {
            const curr = prev ?? [];
            return phoneAddOn ? curr.map((a) => (a.id === result.id ? result : a)) : [...curr, result];
          });
          setPhoneDraft({});
        },
      });
    }

    if (trialIsDirty && trialDraft) {
      jobs.push({
        label: "Free trial policy",
        run: async () => {
          const parsed = trialParsed(trialDraft);
          const body: TrialPolicyInput = {
            enabled: trialDraft.enabled,
            oneTrialPerBusinessPhone: trialDraft.oneTrialPerBusinessPhone,
            stopAtMinuteLimit: trialDraft.stopAtMinuteLimit,
            releaseNumbers: trialDraft.releaseNumbers,
            durationDays: parsed.durationDays!,
            includedMinutes: parsed.includedMinutes!,
            maxPhoneNumbers: parsed.maxPhoneNumbers!,
            endingSoonDays: parsed.endingSoonDays!,
            graceDays: parsed.graceDays!,
            readOnlyDays: parsed.readOnlyDays!,
            numberRetentionDays: parsed.numberRetentionDays!,
            numberReleaseNoticeDays: parsed.numberReleaseNoticeDays!,
          };
          const result = await api<TrialPolicy>("/admin/trial-policy", { method: "POST", body });
          trialPolicy.mutate((prev) => ({ current: result, history: prev?.history ?? [] }));
          setTrialDraft(null);
        },
      });
    }

    setPublishing(true);
    setPublishError(null);
    const settled = await Promise.allSettled(jobs.map((j) => j.run()));
    setPublishing(false);
    const failed = settled
      .map((s, i) => (s.status === "rejected" ? `${jobs[i].label}: ${errorMessage(s.reason)}` : null))
      .filter((x): x is string => x !== null);
    if (failed.length) setPublishError(failed.join(" · "));
  }

  // ---- row visibility (search + group filter) ---------------------------------
  const q = query.trim().toLowerCase();
  const visible = (group: GroupKey, label: string) => {
    if (activeGroup !== "All" && activeGroup !== group) return false;
    return !q || label.toLowerCase().includes(q);
  };
  const groupHasRows = (group: GroupKey) =>
    group === "usage"
      ? visible("usage", "Included minutes") || visible("usage", "Included phone numbers")
      : group === "overage"
        ? visible("overage", "Enable overage") || visible("overage", "Overage price") || visible("overage", "Usage warning at")
        : visible("signup", "Offered on signup") || visible("signup", "Highlight");

  function afterFormSaved(result: WithStripeError<AdminPlan>, verb: string) {
    setEditingPlan(null);
    plans.mutate((prev) => {
      const curr = prev ?? [];
      return curr.some((p) => p.id === result.id) ? curr.map((p) => (p.id === result.id ? result : p)) : [...curr, result];
    });
    setPlanDrafts((prev) => {
      const next = { ...prev };
      delete next[result.id];
      return next;
    });
    setFlash(
      result.stripeError
        ? { tone: "warning", title: `${verb} "${result.name}" — not pushed to Stripe`, body: result.stripeError }
        : { tone: "success", title: `${verb} "${result.name}"${verb === "Synced" ? " to Stripe" : ""}.` },
    );
  }

  return (
    <>
      <PageHeader
        title="Plans & permissions"
        description="Manage plan pricing, usage limits, and the free-trial policy new signups get."
        actions={
          <Button variant="primary" icon={<Plus size={15} aria-hidden />} onClick={() => setEditingPlan("new")}>
            New plan
          </Button>
        }
      />

      <div className="relative mb-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search settings"
          className={`${inputBase} h-10 w-full max-w-xs pl-3`}
        />
      </div>

      {flash ? (
        <div className="mb-4">
          <Notice tone={flash.tone} title={flash.title} onClose={() => setFlash(null)}>
            {flash.body}
          </Notice>
        </div>
      ) : null}

      <DataState state={plans} isEmpty={(d) => d.length === 0} empty={<Empty title="No plans yet">Create the first plan to offer it on signup.</Empty>}>
        {() => (
          <div className="space-y-4 pb-20">
            {/* ---- plan cards ---- */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3.5">
              <Card bodyClassName="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="block size-2.5 rounded-[3px]" style={{ background: TRIAL_COLOR }} />
                  <span className="flex-1 text-[15px] font-extrabold">Free Trial</span>
                  <button
                    type="button"
                    title="Trial settings"
                    aria-label="Trial settings"
                    onClick={openTrialSidebar}
                    disabled={!trialCurrent}
                    className="flex size-8 flex-none items-center justify-center rounded-[9px] border border-line-2 bg-white text-text-2 hover:border-brand hover:text-brand disabled:opacity-50"
                  >
                    <Settings size={16} aria-hidden />
                  </button>
                </div>
                <div className="text-[15px] font-bold text-faint">Not billed</div>
                <div className="text-[12.5px] text-subtle">
                  {trialEffective
                    ? trialEffective.enabled
                      ? `${trialEffective.durationDays}-day trial · ${trialEffective.includedMinutes} min included`
                      : "Trials are off for new signups"
                    : "Loading…"}
                </div>
              </Card>

              {sortedPlans.map((p, i) => {
                  const color = PALETTE[i % PALETTE.length];
                  const highlighted = boolVal(p, "highlight");
                  const hidden = !boolVal(p, "isPublic");
                  return (
                    <Card key={p.id} bodyClassName="p-4 space-y-3" className={planDirty(p) ? "border-amber-300" : ""}>
                      <div className="flex items-center gap-2">
                        <span className="block size-2.5 rounded-[3px]" style={{ background: color }} />
                        <span className="flex flex-1 flex-wrap items-center gap-1.5 text-[15px] font-extrabold">
                          {p.name}
                          {highlighted ? <Badge tone="info">Most popular</Badge> : null}
                          {hidden ? <Badge>Hidden</Badge> : null}
                        </span>
                        <span className="rounded-full bg-surface px-2 py-0.5 text-[11.5px] font-bold text-subtle">{p.subscribers} accounts</span>
                        <button
                          type="button"
                          title="Edit plan"
                          aria-label={`Edit ${p.name}`}
                          onClick={() => setEditingPlan(p)}
                          className="flex size-8 flex-none items-center justify-center rounded-[9px] border border-line-2 bg-white text-text-2 hover:border-brand hover:text-brand"
                        >
                          <Pencil size={14} aria-hidden />
                        </button>
                      </div>
                      <MoneyInput value={priceVal(p)} onChange={(v) => setField(p.id, "price", v)} suffix="/mo" invalid={planFieldErrors(p).price} />
                      <div className="text-[12.5px] text-subtle">
                        {formatInt(p.includedMinutes)} min · {p.includedPhoneNumbers} number{p.includedPhoneNumbers === 1 ? "" : "s"}/mo
                      </div>
                    </Card>
                  );
                })}
            </div>

            {/* ---- phone number price ---- */}
            <Card title="Extra phone number price" description="What every account pays per number beyond their plan's included numbers.">
              <div className="space-y-3 p-4 pt-0">
                {addOns.data === undefined ? (
                  <p className="text-[13px] text-subtle">Loading…</p>
                ) : (
                  <>
                    {activePhoneAddOns.length === 0 ? (
                      <Notice tone="warning">No active phone-number price set — additional numbers have no price until you set one.</Notice>
                    ) : null}
                    {activePhoneAddOns.length > 1 ? (
                      <Notice tone="warning">More than one active phone-number price exists. Keep exactly one active so the price is unambiguous.</Notice>
                    ) : null}
                    <div className="grid gap-3 sm:grid-cols-3">
                      <Field label="Price / month" error={phoneDirty && dollarInputToCents(phonePriceVal()) === null ? "Enter dollars, e.g. 10.00" : null}>
                        {(id) => (
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-brand" aria-hidden />
                            <MoneyInput id={id} value={phonePriceVal()} onChange={(v) => setPhoneDraft((prev) => ({ ...prev, price: v }))} />
                          </div>
                        )}
                      </Field>
                      <Field label="Internal cost" hint="Telnyx cost per number / month" error={phoneDirty && dollarInputToCents(phoneCostVal()) === null ? "Enter dollars" : null}>
                        {(id) => <MoneyInput id={id} value={phoneCostVal()} onChange={(v) => setPhoneDraft((prev) => ({ ...prev, cost: v }))} />}
                      </Field>
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* ---- group filter pills ---- */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveGroup("All")}
                className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold ${activeGroup === "All" ? "bg-brand text-white" : "border border-line-2 bg-white text-text-2"}`}
              >
                All
              </button>
              {GROUPS.map((g) => (
                <button
                  key={g.key}
                  type="button"
                  onClick={() => setActiveGroup(g.key)}
                  className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold ${activeGroup === g.key ? "bg-brand text-white" : "border border-line-2 bg-white text-text-2"}`}
                >
                  {g.label}
                </button>
              ))}
            </div>

            {/* ---- settings grid ---- */}
            <Card bodyClassName="">
              <Table minWidth={320 + list.length * 170}>
                <thead>
                  <tr>
                    <th className={th}>Setting</th>
                    {sortedPlans.map((p) => (
                      <th key={p.id} className={`${th} text-center`}>
                        {p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {groupHasRows("usage") ? (
                    <tr>
                      <td colSpan={1 + list.length} className="bg-surface px-3 py-2 text-[12.5px] font-extrabold text-text-2">
                        Usage limits
                      </td>
                    </tr>
                  ) : null}
                  {visible("usage", "Included minutes") ? (
                    <tr className={tr}>
                      <td className={td}>
                        <div className="font-bold text-text-2">Included minutes</div>
                        <div className="text-[12px] text-subtle">Included per month before overage.</div>
                      </td>
                      {sortedPlans.map((p) => (
                        <td key={p.id} className={`${td} text-center`}>
                          <input
                            inputMode="numeric"
                            className={`${inputClass} mx-auto max-w-[110px] text-right`}
                            value={strVal(p, "includedMinutes")}
                            aria-invalid={planFieldErrors(p).includedMinutes || undefined}
                            aria-label={`Included minutes for ${p.name}`}
                            onChange={(e) => setField(p.id, "includedMinutes", e.target.value)}
                          />
                        </td>
                      ))}
                    </tr>
                  ) : null}
                  {visible("usage", "Included phone numbers") ? (
                    <tr className={tr}>
                      <td className={td}>
                        <div className="font-bold text-text-2">Included phone numbers</div>
                        <div className="text-[12px] text-subtle">Forwarding numbers per account.</div>
                      </td>
                      {sortedPlans.map((p) => (
                        <td key={p.id} className={`${td} text-center`}>
                          <input
                            inputMode="numeric"
                            className={`${inputClass} mx-auto max-w-[110px] text-right`}
                            value={strVal(p, "includedPhoneNumbers")}
                            aria-invalid={planFieldErrors(p).includedPhoneNumbers || undefined}
                            aria-label={`Included phone numbers for ${p.name}`}
                            onChange={(e) => setField(p.id, "includedPhoneNumbers", e.target.value)}
                          />
                        </td>
                      ))}
                    </tr>
                  ) : null}

                  {groupHasRows("overage") ? (
                    <tr>
                      <td colSpan={1 + list.length} className="bg-surface px-3 py-2 text-[12.5px] font-extrabold text-text-2">
                        Overage
                      </td>
                    </tr>
                  ) : null}
                  {visible("overage", "Enable overage") ? (
                    <tr className={tr}>
                      <td className={td}>
                        <div className="font-bold text-text-2">Enable overage</div>
                        <div className="text-[12px] text-subtle">Keep answering calls after included minutes run out.</div>
                      </td>
                      {sortedPlans.map((p) => (
                        <td key={p.id} className={`${td} text-center`}>
                          <input
                            type="checkbox"
                            className="size-4 accent-brand"
                            checked={boolVal(p, "overageEnabled")}
                            aria-label={`Enable overage for ${p.name}`}
                            onChange={(e) => setField(p.id, "overageEnabled", e.target.checked)}
                          />
                        </td>
                      ))}
                    </tr>
                  ) : null}
                  {visible("overage", "Overage price") ? (
                    <tr className={tr}>
                      <td className={td}>
                        <div className="font-bold text-text-2">Overage price</div>
                        <div className="text-[12px] text-subtle">Charged per minute over the included amount.</div>
                      </td>
                      {sortedPlans.map((p) => (
                        <td key={p.id} className={`${td} text-center`}>
                          <MoneyInput
                            className="mx-auto max-w-[130px]"
                            value={overageVal(p)}
                            onChange={(v) => setField(p.id, "overage", v)}
                            suffix="/min"
                            disabled={!boolVal(p, "overageEnabled")}
                            invalid={planFieldErrors(p).overage}
                          />
                        </td>
                      ))}
                    </tr>
                  ) : null}
                  {visible("overage", "Usage warning at") ? (
                    <tr className={tr}>
                      <td className={td}>
                        <div className="font-bold text-text-2">Usage warning at</div>
                        <div className="text-[12px] text-subtle">Notify the account when they reach this share of included minutes.</div>
                      </td>
                      {sortedPlans.map((p) => (
                        <td key={p.id} className={`${td} text-center`}>
                          <div className="relative mx-auto max-w-[90px]">
                            <input
                              inputMode="numeric"
                              className={`${inputClass} pr-6 text-right`}
                              value={strVal(p, "usageWarningPercent")}
                              aria-invalid={planFieldErrors(p).usageWarningPercent || undefined}
                              aria-label={`Usage warning percent for ${p.name}`}
                              onChange={(e) => setField(p.id, "usageWarningPercent", e.target.value)}
                            />
                            <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-[12px] text-subtle">%</span>
                          </div>
                        </td>
                      ))}
                    </tr>
                  ) : null}

                  {groupHasRows("signup") ? (
                    <tr>
                      <td colSpan={1 + list.length} className="bg-surface px-3 py-2 text-[12.5px] font-extrabold text-text-2">
                        Signup
                      </td>
                    </tr>
                  ) : null}
                  {visible("signup", "Offered on signup") ? (
                    <tr className={tr}>
                      <td className={td}>
                        <div className="font-bold text-text-2">Offered on signup</div>
                        <div className="text-[12px] text-subtle">Plan appears on the pricing step of signup.</div>
                      </td>
                      {sortedPlans.map((p) => (
                        <td key={p.id} className={`${td} text-center`}>
                          <input
                            type="checkbox"
                            className="size-4 accent-brand"
                            checked={boolVal(p, "isPublic")}
                            aria-label={`Offered on signup for ${p.name}`}
                            onChange={(e) => setField(p.id, "isPublic", e.target.checked)}
                          />
                        </td>
                      ))}
                    </tr>
                  ) : null}
                  {visible("signup", "Highlight") ? (
                    <tr className={tr}>
                      <td className={td}>
                        <div className="font-bold text-text-2">Highlight</div>
                        <div className="text-[12px] text-subtle">Marks the plan as “Most popular”. Only one plan at a time.</div>
                      </td>
                      {sortedPlans.map((p) => (
                        <td key={p.id} className={`${td} text-center`}>
                          <input
                            type="checkbox"
                            className="size-4 accent-brand"
                            checked={boolVal(p, "highlight")}
                            aria-label={`Highlight ${p.name}`}
                            onChange={(e) => setHighlight(p.id, e.target.checked)}
                          />
                        </td>
                      ))}
                    </tr>
                  ) : null}
                </tbody>
              </Table>
            </Card>
          </div>
        )}
      </DataState>

      <Drawer
        open={editingPlan !== null}
        title={editingPlan === "new" ? "New plan" : editingPlan ? `Edit ${editingPlan.name}` : ""}
        subtitle={
          editingPlan && editingPlan !== "new"
            ? `Slug ${editingPlan.slug} (immutable) · ${editingPlan.subscribers} subscriber(s)`
            : "Monthly plan. Saved in Ringgy first, then pushed to Stripe."
        }
        onClose={() => setEditingPlan(null)}
      >
        {editingPlan !== null ? (
          <PlanForm
            key={editingPlan === "new" ? "new" : editingPlan.id}
            plan={editingPlan === "new" ? null : effectivePlan(editingPlan)}
            internalCpm={internalCpm}
            onCancel={() => setEditingPlan(null)}
            onSaved={(result, created) => afterFormSaved(result, created ? "Created" : "Saved")}
          />
        ) : null}
      </Drawer>

      <Drawer
        open={trialSidebarOpen}
        title="Trial settings"
        subtitle="Free minutes and phone numbers are set in the plan table."
        onClose={() => setTrialSidebarOpen(false)}
        footer={
          <>
            <Button onClick={() => setTrialSidebarOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={applyTrialSidebar} disabled={!trialSidebarValues || !trialIsValid(trialSidebarValues)}>
              Apply
            </Button>
          </>
        }
      >
        {trialSidebarValues ? <TrialSidebarFields values={trialSidebarValues} onChange={setTrialSidebarValues} /> : null}
      </Drawer>

      {touchedCount > 0 ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-4 py-3 shadow-[0_-8px_24px_-12px_rgba(14,21,38,.25)] backdrop-blur sm:px-6 lg:left-[228px]">
          <div className="mx-auto flex max-w-[1480px] flex-wrap items-center gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-[13.5px] font-bold text-ink">
                <span className="block size-2 flex-none rounded-full bg-amber-400" />
                {touchedCount} unsaved change{touchedCount === 1 ? "" : "s"}
              </div>
              {dirtyPlans.length ? (
                <div className="pl-4 text-[12px] text-subtle">
                  Affects {dirtyPlans.map((p) => p.name).join(", ")} · {formatInt(affectedSubs)} active accounts
                </div>
              ) : null}
              {publishError ? <div className="pl-4 text-[12px] text-red-600">{publishError}</div> : null}
            </div>
            <Button onClick={discard} disabled={publishing}>
              Discard
            </Button>
            <Button variant="primary" onClick={publish} loading={publishing} disabled={anyInvalid}>
              Publish changes
            </Button>
          </div>
        </div>
      ) : null}
    </>
  );
}

// ---- trial sidebar fields (ported from the old TrialEditor) ------------------------

function TrialSidebarFields({ values, onChange }: { values: TrialFormValues; onChange: (v: TrialFormValues) => void }) {
  const parsed = trialParsed(values);
  const setNum = (k: TrialNumberKey) => (v: string) => onChange({ ...values, [k]: v });
  const setBool = (k: TrialBoolKey) => (v: boolean) => onChange({ ...values, [k]: v });

  const numberField = (k: TrialNumberKey, label: string, hint: string, suffix: string, disabled?: boolean) => (
    <Field label={label} hint={hint} error={parsed[k] === null ? `Whole number, ${TRIAL_LIMITS[k].min}–${TRIAL_LIMITS[k].max}` : null}>
      {(id) => (
        <div className={`relative ${disabled ? "opacity-50" : ""}`}>
          <input
            id={id}
            inputMode="numeric"
            className={`${inputClass} pr-16`}
            value={values[k]}
            disabled={disabled}
            aria-invalid={parsed[k] === null || undefined}
            onChange={(e) => setNum(k)(e.target.value)}
          />
          <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-[12.5px] text-subtle">{suffix}</span>
        </div>
      )}
    </Field>
  );

  return (
    <div className="space-y-4">
      <Card title="Eligibility & activation" description="The trial starts automatically when a new customer finishes the signup wizard." bodyClassName="space-y-3 p-4">
        <Checkbox
          checked={values.enabled}
          onChange={setBool("enabled")}
          label="Offer a free trial to new signups"
          hint="Off: signup asks for a paid plan and sends the customer to Stripe Checkout, as before."
        />
        <Checkbox
          checked={values.oneTrialPerBusinessPhone}
          onChange={setBool("oneTrialPerBusinessPhone")}
          label="One trial per business phone number"
          hint="A business number that already had a trial on another account does not get a second one."
        />
      </Card>

      <Card title="Duration & usage limits" bodyClassName="grid gap-3 p-4 sm:grid-cols-2">
        {numberField("durationDays", "Trial length", "Days from signup.", "days")}
        {numberField("includedMinutes", "Free minutes", "AI call answering included.", "min")}
        {numberField("maxPhoneNumbers", "Phone numbers", "Ringgy numbers a trial can get.", "max")}
        <div className="sm:col-span-2">
          <Checkbox
            checked={values.stopAtMinuteLimit}
            onChange={setBool("stopAtMinuteLimit")}
            label="Stop answering when the free minutes run out"
            hint="Off: calls keep being answered (unbilled) until the trial ends. Trial minutes are never charged either way."
          />
        </div>
      </Card>

      <Card title="When the trial ends without an upgrade" description="Nobody is ever charged automatically." bodyClassName="grid gap-3 p-4 sm:grid-cols-2">
        {numberField("endingSoonDays", "“Ending soon” notice", "Days before the end the dashboard warns.", "days")}
        {numberField("graceDays", "Grace period", "Calls are still answered after the trial.", "days")}
        {numberField("readOnlyDays", "Read-only access", "Dashboard viewable after calls stop.", "days")}
      </Card>

      <Card title="Phone number retention" bodyClassName="grid gap-3 p-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Checkbox
            checked={values.releaseNumbers}
            onChange={setBool("releaseNumbers")}
            label="Release trial numbers if the customer does not subscribe"
            hint="Released numbers are deleted from Telnyx and detached from the customer. Off: numbers are kept until released by hand."
          />
        </div>
        {numberField("numberRetentionDays", "Release after", "Days after live answering stops.", "days", !values.releaseNumbers)}
        {numberField("numberReleaseNoticeDays", "Warn before release", "Days ahead the customer is warned.", "days", !values.releaseNumbers)}
      </Card>
    </div>
  );
}

// ---- plan form (name / slug / description / marketing features / create / Stripe sync) --
// Ported from the old PlansView.tsx; the inline grid above now owns price, limits,
// overage, usage warning, signup visibility and highlight — this drawer handles
// everything else, exactly as it did before the pages were merged.

type FormState = {
  name: string;
  slug: string;
  description: string;
  features: string[];
  sortOrder: string;
};

function initial(plan: AdminPlan | null): FormState {
  return {
    name: plan?.name ?? "",
    slug: plan?.slug ?? "",
    description: plan?.description ?? "",
    features: plan?.features ?? [],
    sortOrder: String(plan?.sortOrder ?? 0),
  };
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempted, setAttempted] = useState(false);
  const creating = plan === null;

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setF((prev) => ({ ...prev, [k]: v }));

  const sortOrder = intOrNull(f.sortOrder, Number.MIN_SAFE_INTEGER);
  const features = f.features.map((x) => x.trim()).filter(Boolean);

  const errors = {
    name: f.name.trim() ? null : "Required",
    slug: creating && !SLUG_RE.test(f.slug) ? "Lowercase letters/numbers joined by dashes" : null,
    sortOrder: sortOrder === null ? "Whole number" : null,
    features: features.length > 30 ? "At most 30 features" : null,
  };
  const valid = Object.values(errors).every((e) => e === null);
  const shown = attempted || !creating ? errors : ({} as Partial<typeof errors>);

  const priceCents = plan?.priceCents ?? 0;
  const includedMinutes = plan?.includedMinutes ?? 0;
  const overageCpm = plan?.overageCentsPerMin ?? 0;
  const econ =
    internalCpm !== null
      ? {
          includedCost: Math.round(includedMinutes * internalCpm),
          marginFull: priceCents - Math.round(includedMinutes * internalCpm),
          perIncludedMin: includedMinutes > 0 ? priceCents / includedMinutes : null,
          overageMargin: addRates(overageCpm, -internalCpm),
        }
      : null;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setAttempted(true);
    if (!valid) return;
    const body: PlanInput =
      plan === null
        ? {
            name: f.name.trim(),
            description: f.description.trim() || undefined,
            priceCents: 0,
            includedMinutes: 0,
            includedPhoneNumbers: 1,
            overageCentsPerMin: 0,
            overageEnabled: true,
            usageWarningPercent: 90,
            features,
            isActive: true,
            isPublic: true,
            highlight: false,
            sortOrder: sortOrder!,
            slug: f.slug,
          }
        : {
            name: f.name.trim(),
            description: f.description.trim() || undefined,
            priceCents: plan.priceCents,
            includedMinutes: plan.includedMinutes,
            includedPhoneNumbers: plan.includedPhoneNumbers,
            overageCentsPerMin: plan.overageCentsPerMin,
            overageEnabled: plan.overageEnabled,
            usageWarningPercent: plan.usageWarningPercent,
            features,
            isActive: plan.isActive,
            isPublic: plan.isPublic,
            highlight: plan.highlight,
            sortOrder: sortOrder!,
          };
    setSubmitting(true);
    setError(null);
    try {
      const result =
        plan === null
          ? await api<WithStripeError<AdminPlan>>("/admin/plans", { method: "POST", body })
          : await api<WithStripeError<AdminPlan>>(`/admin/plans/${plan.id}`, { method: "PATCH", body });
      onSaved(result, creating);
    } catch (err) {
      setError(errorMessage(err));
      setSubmitting(false);
    }
  }

  async function onSync() {
    if (!plan) return;
    setSyncing(true);
    setError(null);
    try {
      onSaved(await api<WithStripeError<AdminPlan>>(`/admin/plans/${plan.id}/sync-stripe`, { method: "POST" }), false);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSyncing(false);
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
      {!creating && plan ? (
        <div className="flex items-center justify-between gap-2 rounded-md border border-line-2 bg-surface px-3 py-2">
          <div className="flex items-center gap-2">
            {plan.stripeSynced ? <Badge tone="success">Synced</Badge> : <Badge tone="warning">Not synced</Badge>}
            <span className="text-[12.5px] text-subtle">Stripe product & price</span>
          </div>
          <Button size="sm" onClick={onSync} loading={syncing}>
            {plan.stripeSynced ? "Resync" : "Sync to Stripe"}
          </Button>
        </div>
      ) : null}

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
        <Field label="Sort order" error={shown.sortOrder} hint="Lower shows first">
          {(id) => <input id={id} inputMode="numeric" className={inputClass} value={f.sortOrder} onChange={(e) => set("sortOrder", e.target.value)} aria-invalid={!!shown.sortOrder || undefined} />}
        </Field>
      </fieldset>

      {!creating && econ ? (
        <div className="rounded-md border border-amber-200 bg-amber-50/60 p-3">
          <div className="mb-2 text-[11.5px] font-bold uppercase tracking-[.08em] text-amber-900">
            Internal economics {internalCpm !== null ? `@ ${formatRate(internalCpm, { suffix: true })}` : ""}
          </div>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[13px] tabular-nums sm:grid-cols-4">
            <div>
              <dt className="text-[11.5px] text-subtle">Included minutes cost</dt>
              <dd className="font-medium">{formatCents(econ.includedCost)}</dd>
            </div>
            <div>
              <dt className="text-[11.5px] text-subtle">Margin at full use</dt>
              <dd className={`font-medium ${econ.marginFull < 0 ? "text-red-600" : ""}`}>
                {formatCents(econ.marginFull)} <span className="text-[11.5px] text-subtle">{formatPercent(marginPercent(econ.marginFull, priceCents))}</span>
              </dd>
            </div>
            <div>
              <dt className="text-[11.5px] text-subtle">Price per included min</dt>
              <dd className="font-medium">{econ.perIncludedMin !== null ? formatRate(econ.perIncludedMin) : "—"}</dd>
            </div>
            <div>
              <dt className="text-[11.5px] text-subtle">Overage margin / min</dt>
              <dd className={`font-medium ${econ.overageMargin < 0 ? "text-red-600" : ""}`}>{formatRate(econ.overageMargin)}</dd>
            </div>
          </dl>
        </div>
      ) : null}

      <fieldset className="border-t border-line pt-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-[12.5px] font-medium text-text-2">Marketing features (shown on pricing / signup)</div>
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
