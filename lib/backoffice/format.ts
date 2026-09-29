/**
 * Money + number formatting for the backoffice.
 *
 * The API speaks two units:
 *  - integer cents (prices, costs, revenue): 4900 = $49.00
 *  - "CentsPerMin" decimals (per-minute rates): 5 = $0.05/min, 0.35 = $0.0035/min
 *
 * Operators type dollars, so every form converts through the helpers below.
 */

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const usdWhole = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const usdRate = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
});
const int = new Intl.NumberFormat("en-US");
const oneDecimal = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

export const DASH = "—";

/** 4900 → "$49.00". null/undefined → "—". */
export function formatCents(cents: number | null | undefined, opts: { whole?: boolean } = {}): string {
  if (cents === null || cents === undefined || !Number.isFinite(cents)) return DASH;
  return (opts.whole ? usdWhole : usd).format(cents / 100);
}

/** Like formatCents but with an explicit sign for margins/deltas: "+$1.00" / "−$1.00". */
export function formatSignedCents(cents: number | null | undefined): string {
  if (cents === null || cents === undefined || !Number.isFinite(cents)) return DASH;
  const body = usd.format(Math.abs(cents) / 100);
  if (cents === 0) return body;
  return cents > 0 ? `+${body}` : `−${body}`;
}

/** Cents-per-minute → "$0.0500" (4 decimals). Pass `suffix` to append "/min". */
export function formatRate(centsPerMin: number | null | undefined, opts: { suffix?: boolean } = {}): string {
  if (centsPerMin === null || centsPerMin === undefined || !Number.isFinite(centsPerMin)) return DASH;
  const text = usdRate.format(centsPerMin / 100);
  return opts.suffix ? `${text}/min` : text;
}

/** 40 → "40.0%". null → "—". */
export function formatPercent(pct: number | null | undefined, digits = 1): string {
  if (pct === null || pct === undefined || !Number.isFinite(pct)) return DASH;
  return `${pct.toFixed(digits)}%`;
}

export function formatInt(n: number | null | undefined): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return DASH;
  return int.format(n);
}

/** Minutes can be fractional (4.5). */
export function formatMinutes(n: number | null | undefined): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return DASH;
  return oneDecimal.format(n);
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return DASH;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return DASH;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return DASH;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return DASH;
  return d.toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

/** Margin as a percent of price; null when there is no price. */
export function marginPercent(marginCents: number, priceCents: number): number | null {
  if (!priceCents) return null;
  return (marginCents / priceCents) * 100;
}

// ---- form conversions -----------------------------------------------------

const DOLLARS_2 = /^\d+(\.\d{0,2})?$/;
const DOLLARS_4 = /^\d+(\.\d{0,4})?$/;

/** 4900 → "49.00" for an input value. */
export function centsToDollarInput(cents: number | null | undefined): string {
  if (cents === null || cents === undefined) return "";
  return (cents / 100).toFixed(2);
}

/** "49" / "49.5" / "$49.00" → 4900; null when blank or invalid. */
export function dollarInputToCents(value: string): number | null {
  const v = value.trim().replace(/^\$/, "").replace(/,/g, "");
  if (!DOLLARS_2.test(v)) return null;
  return Math.round(Number(v) * 100);
}

/** 5 (cents/min) → "0.0500" for an input value. */
export function rateToDollarInput(centsPerMin: number | null | undefined): string {
  if (centsPerMin === null || centsPerMin === undefined) return "";
  return (centsPerMin / 100).toFixed(4);
}

/**
 * "$0.0500" → 5 (cents/min); "0.0035" → 0.35. Up to 4 dollar decimals.
 * Rounded so float noise (0.0035 * 100 = 0.35000000000000003) never reaches the
 * API, which rejects more than 4 decimal places.
 */
export function dollarRateInputToCentsPerMin(value: string): number | null {
  const v = value.trim().replace(/^\$/, "");
  if (!DOLLARS_4.test(v)) return null;
  return Math.round(Number(v) * 1_000_000) / 10_000;
}

/** Sum cents-per-minute rates without float noise. */
export function addRates(...rates: number[]): number {
  return Math.round(rates.reduce((a, b) => a + b, 0) * 10_000) / 10_000;
}
