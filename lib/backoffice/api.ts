/**
 * Browser-side client for the backoffice API (NestJS, /admin/*).
 * The admin session is the httpOnly `rg_admin_session` cookie, so every call
 * goes out with credentials: 'include'.
 *
 * Calls go to this app's own origin and are proxied to the API by the
 * rewrite in next.config.ts, which keeps the session cookie first-party
 * (see there for why a direct cross-site call loses it on reload).
 */

export const API_URL = "/backoffice/api";

/** Fired on window whenever an authed call comes back 401; the console shell redirects to login. */
export const UNAUTHORIZED_EVENT = "rg-admin-unauthorized";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  /** Don't broadcast a 401 (login page / session probe). */
  quiet401?: boolean;
  signal?: AbortSignal;
};

function messageFrom(json: unknown, fallback: string): string {
  if (json && typeof json === "object" && "message" in json) {
    const m = (json as { message: unknown }).message;
    if (Array.isArray(m)) return m.join("; ");
    if (typeof m === "string" && m) return m;
  }
  return fallback;
}

export async function api<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: opts.method ?? "GET",
      credentials: "include",
      headers: opts.body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
      cache: "no-store",
      signal: opts.signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    throw new ApiError(0, "Can't reach the Ringgy API. Is the backend running?");
  }

  // Nest serialises a `null` return as an empty 200 body.
  const text = await res.text();
  let json: unknown = null;
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }
  }

  if (!res.ok) {
    if (res.status === 401 && !opts.quiet401 && typeof window !== "undefined") {
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }
    const fallback =
      res.status === 401
        ? "Your session has expired. Please sign in again."
        : res.status === 503
          ? "Billing is not configured on the server."
          : `Request failed (${res.status})`;
    throw new ApiError(res.status, messageFrom(json, fallback));
  }
  return json as T;
}

export function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return "Something went wrong";
}

// ---- types (mirror of the backend's /admin contract) -----------------------

export type AdminUser = { id: string; email: string; name: string | null };

export type CostBreakdown = {
  telnyxCents: number;
  aiCents: number;
  infraCents: number;
  otherCents: number;
  legacyCents: number;
  usageCents: number;
  phoneNumberCents: number;
  addOnCents: number;
  totalCents: number;
};

export type RevenueBreakdown = {
  planCents: number;
  overageCents: number;
  phoneNumberCents: number;
  addOnCents: number;
  otherCents: number;
  totalCents: number;
};

export type ReportRow = {
  calls: number;
  seconds: number;
  minutes: number;
  overageMinutes: number;
  cost: CostBreakdown;
  revenue: RevenueBreakdown;
  grossMarginCents: number;
  grossMarginPercent: number | null;
};

export type Overview = {
  tenants: number;
  liveSubscriptions: number;
  planMix: { planId: string; name: string; count: number }[];
  mrrCents: { plans: number; phoneNumbers: number; addOns: number; total: number };
  phoneNumbers: Record<string, number>;
  monthToDate: ReportRow;
};

export type PricingView = {
  id: string;
  telnyxCentsPerMin: number;
  aiCentsPerMin: number;
  infraCentsPerMin: number;
  otherCentsPerMin: number;
  internalCentsPerMin: number;
  customerCentsPerMin: number;
  marginCentsPerMin: number;
  marginPercent: number | null;
  note: string | null;
  effectiveFrom: string;
  effectiveTo: string | null;
  createdBy: string | null;
};

export type PricingResponse = { current: PricingView | null; history: PricingView[] };

export type PricingInput = {
  telnyxCentsPerMin: number;
  aiCentsPerMin: number;
  infraCentsPerMin: number;
  otherCentsPerMin: number;
  customerCentsPerMin: number;
  note?: string;
};

export type PlanEconomics = {
  internalCentsPerMin: number;
  includedMinutesCostCents: number;
  marginAtFullUseCents: number;
  effectiveCentsPerIncludedMin: number;
  overageMarginCentsPerMin: number;
};

export type AdminPlan = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  priceCents: number;
  includedMinutes: number;
  includedPhoneNumbers: number;
  overageCentsPerMin: number;
  overageEnabled: boolean;
  usageWarningPercent: number;
  features: string[];
  isActive: boolean;
  isPublic: boolean;
  highlight: boolean;
  sortOrder: number;
  stripeProductId: string | null;
  stripePriceId: string | null;
  stripeOveragePriceId: string | null;
  createdAt: string;
  updatedAt: string;
  subscribers: number;
  stripeSynced: boolean;
  economics: PlanEconomics | null;
};

export type PlanInput = {
  slug?: string;
  name: string;
  description?: string;
  priceCents: number;
  includedMinutes: number;
  includedPhoneNumbers: number;
  overageCentsPerMin: number;
  overageEnabled: boolean;
  usageWarningPercent: number;
  features: string[];
  isActive: boolean;
  isPublic: boolean;
  highlight: boolean;
  sortOrder: number;
};

export type WithStripeError<T> = T & { stripeError?: string | null };

export type AddOnKind = "MINUTE_PACK" | "PHONE_NUMBER" | "SERVICE";
export type BillingType = "ONE_TIME" | "RECURRING";

export type AdminAddOn = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  kind: AddOnKind;
  billingType: BillingType;
  priceCents: number;
  minutes: number | null;
  internalCostCents: number;
  isActive: boolean;
  sortOrder: number;
  stripeProductId: string | null;
  stripePriceId: string | null;
  createdAt: string;
  updatedAt: string;
  stripeSynced: boolean;
  marginCents: number;
  allowedPlans: { id: string; name: string }[];
  allowedTenants: { id: string; name: string }[];
  activePurchases?: number;
};

export type AddOnInput = {
  slug?: string;
  kind?: AddOnKind;
  billingType?: BillingType;
  name: string;
  description?: string;
  priceCents: number;
  minutes?: number;
  internalCostCents: number;
  isActive: boolean;
  sortOrder: number;
  allowedPlanIds: string[];
  allowedTenantIds: string[];
};

export type AdminPhoneNumber = {
  id: string;
  phoneNumber: string;
  tenant: { id: string; name: string } | null;
  source: string;
  status: string;
  statusDetail: string | null;
  billingStatus: string;
  telnyxMonthlyCents: number | null;
  customerMonthlyCents: number;
  marginCents: number | null;
  locality: string | null;
  region: string | null;
  telnyxPhoneNumberId: string | null;
  purchasedAt: string | null;
  releasedAt: string | null;
  lastSyncedAt: string | null;
};

export type AdminTenant = {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
  stripeCustomerId: string | null;
  plan: { id: string; name: string } | null;
  subscriptionStatus: string | null;
  currentPeriodEnd: string | null;
  provisioningStatus: string | null;
  assistantSyncStatus: string | null;
  primaryNumber: string | null;
  phoneNumbers: number;
  sip: string | null;
  period: null | { start: string; end: string; usedMinutes: number; includedMinutes: number; overageMinutes: number };
  /** Whether live AI answering is switched on at Telnyx (off after a trial ends). */
  answering: null | { enabled: boolean; inSync: boolean; error: string | null };
  trial: AdminTrial | null;
  trialReleaseError: string | null;
};

export type TrialStatus = "ACTIVE" | "GRACE" | "SUSPENDED" | "EXPIRED" | "CONVERTED";

export type AdminTrial = {
  status: TrialStatus;
  startedAt: string;
  endsAt: string;
  graceEndsAt: string;
  readOnlyEndsAt: string;
  numberReleaseAt: string | null;
  numbersReleasedAt: string | null;
  convertedAt: string | null;
  daysLeft: number;
  includedMinutes: number;
  usedMinutes: number;
  minutesExhausted: boolean;
  maxPhoneNumbers: number;
};

export type TrialPolicyInput = {
  enabled: boolean;
  oneTrialPerBusinessPhone: boolean;
  durationDays: number;
  includedMinutes: number;
  maxPhoneNumbers: number;
  stopAtMinuteLimit: boolean;
  endingSoonDays: number;
  graceDays: number;
  readOnlyDays: number;
  releaseNumbers: boolean;
  numberRetentionDays: number;
  numberReleaseNoticeDays: number;
  note?: string;
};

export type TrialPolicy = TrialPolicyInput & {
  id: string;
  note: string | null;
  effectiveFrom: string;
  effectiveTo: string | null;
  createdBy: string | null;
};

export type TrialPolicyResponse = { current: TrialPolicy; history: TrialPolicy[] };

export type UsageTenantRow = ReportRow & {
  tenantId: string;
  name: string;
  email: string;
  plan: string | null;
  subscriptionStatus: string | null;
};

export type UsageReport = { from: string; to: string; totals: ReportRow; byTenant: UsageTenantRow[] };

export type SyncReport = {
  startedAt: string;
  finishedAt: string;
  numbersChecked: number;
  numbersChanged: number;
  assistantsResynced: number;
  sipChecked: number;
  callsAllocated: number;
  overageReported: number;
  numbersBilled: number;
  subscriptionsSynced: number;
  errors: string[];
};

/** A landing-page contact form message (GET /admin/contact-requests). */
export type ContactRequest = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
  ip: string | null;
  createdAt: string;
  /** Null when the email to sales was not sent (not configured, or Resend failed). */
  emailedAt: string | null;
};
