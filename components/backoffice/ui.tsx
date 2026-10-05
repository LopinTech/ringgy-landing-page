"use client";

import { useEffect, useId, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Info, Loader2, RefreshCw, X, XCircle } from "lucide-react";

// ---- layout ------------------------------------------------------------------

export function PageHeader({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-[22px] font-bold tracking-[-.01em] text-ink">{title}</h1>
        {description ? <p className="mt-1 max-w-3xl text-[13.5px] text-muted">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}

export function Card({
  title,
  description,
  actions,
  children,
  className = "",
  bodyClassName = "p-4",
}: {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={`min-w-0 rounded-lg border border-line-2 bg-white ${className}`}>
      {title || actions ? (
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2.5">
          <div className="min-w-0">
            {title ? <h2 className="text-[13px] font-bold uppercase tracking-[.06em] text-text-2">{title}</h2> : null}
            {description ? <p className="mt-0.5 text-[12.5px] text-subtle">{description}</p> : null}
          </div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </header>
      ) : null}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

export function Stat({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: "default" | "positive" | "negative";
}) {
  const color = tone === "positive" ? "text-success" : tone === "negative" ? "text-red-600" : "text-ink";
  return (
    <div className="min-w-0 rounded-lg border border-line-2 bg-white px-4 py-3">
      <div className="text-[11.5px] font-bold uppercase tracking-[.08em] text-subtle">{label}</div>
      <div className={`mt-1 truncate text-[24px] font-bold tabular-nums tracking-[-.01em] ${color}`}>{value}</div>
      {sub ? <div className="mt-0.5 text-[12.5px] text-muted">{sub}</div> : null}
    </div>
  );
}

// ---- badges ------------------------------------------------------------------

export type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "brand";

const toneClass: Record<Tone, string> = {
  neutral: "bg-slate-100 text-slate-700 ring-slate-200",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  warning: "bg-amber-50 text-amber-800 ring-amber-200",
  danger: "bg-red-50 text-red-700 ring-red-200",
  info: "bg-tint-2 text-brand ring-accent-soft",
  brand: "bg-brand text-white ring-brand",
};

export function Badge({ tone = "neutral", children, title }: { tone?: Tone; children: ReactNode; title?: string }) {
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded px-1.5 py-[1px] text-[11px] font-bold uppercase tracking-[.04em] ring-1 ring-inset ${toneClass[tone]}`}
    >
      {children}
    </span>
  );
}

const STATUS_TONES: Record<string, Tone> = {
  ACTIVE: "success",
  SYNCED: "success",
  PROVISIONED: "success",
  TRIALING: "info",
  INCLUDED: "info",
  BILLED: "success",
  PENDING: "warning",
  ONBOARDING: "warning",
  INCOMPLETE: "warning",
  PAST_DUE: "warning",
  UNBILLED: "warning",
  NEVER_SYNCED: "neutral",
  NOT_BILLED: "neutral",
  PAUSED: "neutral",
  DISABLED: "neutral",
  RELEASED: "neutral",
  CANCELED: "neutral",
  FAILED: "danger",
  UNPAID: "danger",
  INCOMPLETE_EXPIRED: "danger",
  SUSPENDED: "danger",
  // Free trial
  GRACE: "warning",
  EXPIRED: "neutral",
  CONVERTED: "success",
  TRIAL: "info",
};

export function StatusBadge({ status, title }: { status: string | null | undefined; title?: string }) {
  if (!status) return <span className="text-faint">—</span>;
  return (
    <Badge tone={STATUS_TONES[status] ?? "neutral"} title={title}>
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

// ---- buttons & form controls ---------------------------------------------------

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
  loading?: boolean;
  icon?: ReactNode;
};

export function Button({ variant = "secondary", size = "md", loading, icon, children, className = "", disabled, ...rest }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50";
  const sizes = size === "sm" ? "h-7 px-2.5 text-[12.5px]" : "h-9 px-3.5 text-[13.5px]";
  const variants = {
    primary: "bg-brand text-white hover:bg-brand-dark",
    secondary: "border border-line-2 bg-white text-text-2 hover:bg-surface",
    ghost: "text-text-2 hover:bg-tint-2",
    danger: "border border-red-200 bg-white text-red-700 hover:bg-red-50",
  }[variant];
  return (
    <button type="button" className={`${base} ${sizes} ${variants} ${className}`} disabled={disabled || loading} {...rest}>
      {loading ? <Loader2 size={14} className="animate-spin" aria-hidden /> : icon}
      {children}
    </button>
  );
}

/** Input styles without width/height (for inline filters and textareas that set their own). */
export const inputBase =
  "rounded-md border border-line-2 bg-white px-2.5 text-[13.5px] text-ink tabular-nums placeholder:text-faint focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-surface disabled:text-subtle aria-[invalid=true]:border-red-400";
export const inputClass = `${inputBase} h-9 w-full`;

export function Field({
  label,
  hint,
  error,
  children,
  className = "",
}: {
  label: string;
  hint?: ReactNode;
  error?: string | null;
  children: (id: string) => ReactNode;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={`min-w-0 ${className}`}>
      <label htmlFor={id} className="mb-1 block text-[12.5px] font-medium text-text-2">
        {label}
      </label>
      {children(id)}
      {error ? (
        <p className="mt-1 text-[12px] text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-[12px] text-subtle">{hint}</p>
      ) : null}
    </div>
  );
}

/** A "$" prefixed text input for money/rates (text, not number, so "0.0500" keeps its zeros). */
export function MoneyInput({
  id,
  value,
  onChange,
  invalid,
  suffix,
  placeholder,
  disabled,
  className = "",
}: {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
  suffix?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <span className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-[13.5px] text-subtle">$</span>
      <input
        id={id}
        inputMode="decimal"
        autoComplete="off"
        className={`${inputClass} pl-6 ${suffix ? "pr-12" : ""}`}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        onChange={(e) => onChange(e.target.value)}
      />
      {suffix ? (
        <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-[12.5px] text-subtle">{suffix}</span>
      ) : null}
    </div>
  );
}

export function Checkbox({
  checked,
  onChange,
  label,
  hint,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: ReactNode;
  hint?: ReactNode;
  disabled?: boolean;
}) {
  return (
    <label className={`flex items-start gap-2 text-[13.5px] ${disabled ? "opacity-60" : "cursor-pointer"}`}>
      <input
        type="checkbox"
        className="mt-[3px] size-4 accent-brand"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>
        <span className="font-medium text-text-2">{label}</span>
        {hint ? <span className="block text-[12px] text-subtle">{hint}</span> : null}
      </span>
    </label>
  );
}

// ---- states --------------------------------------------------------------------

export function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-10 text-[13.5px] text-subtle" role="status">
      <Loader2 size={16} className="animate-spin" aria-hidden />
      {label}
    </div>
  );
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="px-4 py-10 text-center">
      <div className="text-[14px] font-medium text-text-2">{title}</div>
      {children ? <div className="mx-auto mt-1 max-w-md text-[13px] text-subtle">{children}</div> : null}
    </div>
  );
}

export function ErrorState({ error, onRetry }: { error: Error; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
      <XCircle size={22} className="text-red-500" aria-hidden />
      <div className="max-w-md text-[13.5px] text-text-2">{error.message}</div>
      {onRetry ? (
        <Button size="sm" onClick={onRetry} icon={<RefreshCw size={13} aria-hidden />}>
          Retry
        </Button>
      ) : null}
    </div>
  );
}

/** Renders loading / error / empty around a data-dependent body. */
export function DataState<T>({
  state,
  isEmpty,
  empty,
  children,
}: {
  state: { data?: T; error?: Error; initialLoading: boolean; reload: () => void };
  isEmpty?: (data: T) => boolean;
  empty?: ReactNode;
  children: (data: T) => ReactNode;
}) {
  if (state.initialLoading) return <Loading />;
  if (state.error && state.data === undefined) return <ErrorState error={state.error} onRetry={state.reload} />;
  if (state.data === undefined) return <Loading />;
  if (isEmpty?.(state.data)) return <>{empty ?? <Empty title="Nothing here yet" />}</>;
  return (
    <>
      {state.error ? (
        <div className="px-4 pt-3">
          <Notice tone="danger">Refresh failed: {state.error.message}</Notice>
        </div>
      ) : null}
      {children(state.data)}
    </>
  );
}

export function Notice({
  tone = "info",
  title,
  children,
  onClose,
  action,
}: {
  tone?: "info" | "success" | "warning" | "danger";
  title?: ReactNode;
  children?: ReactNode;
  onClose?: () => void;
  action?: ReactNode;
}) {
  const styles = {
    info: "border-accent-soft bg-tint-2 text-ink",
    success: "border-emerald-200 bg-emerald-50 text-emerald-900",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
    danger: "border-red-200 bg-red-50 text-red-900",
  }[tone];
  const Icon = { info: Info, success: CheckCircle2, warning: AlertTriangle, danger: XCircle }[tone];
  return (
    <div className={`flex items-start gap-2.5 rounded-md border px-3 py-2.5 text-[13px] ${styles}`} role={tone === "danger" ? "alert" : "status"}>
      <Icon size={16} className="mt-[1px] shrink-0" aria-hidden />
      <div className="min-w-0 flex-1">
        {title ? <div className="font-bold">{title}</div> : null}
        {children ? <div className={title ? "mt-0.5" : ""}>{children}</div> : null}
      </div>
      {action}
      {onClose ? (
        <button type="button" onClick={onClose} className="shrink-0 rounded p-0.5 opacity-60 hover:opacity-100" aria-label="Dismiss">
          <X size={14} />
        </button>
      ) : null}
    </div>
  );
}

// ---- tables --------------------------------------------------------------------

export function Table({ children, minWidth = 720 }: { children: ReactNode; minWidth?: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-[13px]" style={{ minWidth }}>
        {children}
      </table>
    </div>
  );
}

export const th =
  "sticky top-0 border-b border-line-2 bg-surface px-3 py-2 text-left text-[11px] font-bold uppercase tracking-[.06em] text-subtle";
export const thNum = `${th} text-right`;
export const td = "border-b border-line px-3 py-2 align-top text-text-2";
export const tdNum = `${td} text-right tabular-nums whitespace-nowrap`;
export const tr = "hover:bg-surface/70";

/** Colour a margin/cents value red when negative. */
export function Money({ cents, children }: { cents: number | null | undefined; children: ReactNode }) {
  const cls = cents === null || cents === undefined ? "text-faint" : cents < 0 ? "text-red-600" : "";
  return <span className={cls}>{children}</span>;
}

// ---- bars ------------------------------------------------------------------------

export function Bar({ value, max, className = "bg-primary" }: { value: number; max: number; className?: string }) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-line">
      <div className={`h-full rounded-full ${className}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

/** A labelled list of horizontal bars (label · value · bar). */
export function BarList({
  rows,
  format,
  barClassName = "bg-primary",
  total,
}: {
  rows: { label: ReactNode; value: number; hint?: ReactNode; className?: string }[];
  format: (v: number) => ReactNode;
  barClassName?: string;
  total?: { label: ReactNode; value: number };
}) {
  const max = Math.max(0, ...rows.map((r) => r.value));
  return (
    <div className="space-y-2.5">
      {rows.map((r, i) => (
        <div key={i}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-[13px]">
            <span className="min-w-0 truncate text-text-2">
              {r.label}
              {r.hint ? <span className="ml-1.5 text-[11.5px] text-faint">{r.hint}</span> : null}
            </span>
            <span className="font-medium tabular-nums text-ink">{format(r.value)}</span>
          </div>
          <Bar value={r.value} max={max} className={r.className ?? barClassName} />
        </div>
      ))}
      {total ? (
        <div className="flex items-baseline justify-between border-t border-line pt-2 text-[13.5px] font-bold">
          <span>{total.label}</span>
          <span className="tabular-nums">{format(total.value)}</span>
        </div>
      ) : null}
    </div>
  );
}

// ---- drawer ----------------------------------------------------------------------

export function Drawer({
  open,
  title,
  subtitle,
  onClose,
  children,
  footer,
}: {
  open: boolean;
  title: ReactNode;
  subtitle?: ReactNode;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <button type="button" aria-label="Close" className="absolute inset-0 bg-ink-deep/40" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-[640px] flex-col bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-3.5">
          <div className="min-w-0">
            <h2 className="text-[17px] font-bold text-ink">{title}</h2>
            {subtitle ? <p className="mt-0.5 text-[12.5px] text-subtle">{subtitle}</p> : null}
          </div>
          <button type="button" onClick={onClose} className="rounded p-1 text-subtle hover:bg-surface" aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer ? <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line bg-surface px-5 py-3">{footer}</div> : null}
      </div>
    </div>
  );
}

// ---- multi-select ------------------------------------------------------------------

/** Searchable checkbox list with selected chips. */
export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Search…",
  emptyLabel = "No options",
  loading,
}: {
  options: { id: string; label: string; sub?: string }[];
  selected: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
  emptyLabel?: string;
  loading?: boolean;
}) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const filtered = q ? options.filter((o) => `${o.label} ${o.sub ?? ""}`.toLowerCase().includes(q)) : options;
  const byId = new Map(options.map((o) => [o.id, o]));
  const toggle = (id: string) => onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);

  return (
    <div className="rounded-md border border-line-2">
      {selected.length > 0 ? (
        <div className="flex flex-wrap gap-1 border-b border-line p-2">
          {selected.map((id) => (
            <span key={id} className="inline-flex items-center gap-1 rounded bg-tint-2 px-1.5 py-0.5 text-[12px] text-brand">
              {byId.get(id)?.label ?? id}
              <button type="button" onClick={() => toggle(id)} aria-label="Remove" className="opacity-70 hover:opacity-100">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      ) : null}
      <div className="p-2">
        <input className={`${inputBase} h-8 w-full`} placeholder={placeholder} value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>
      <div className="max-h-48 overflow-y-auto border-t border-line">
        {loading ? (
          <Loading />
        ) : filtered.length === 0 ? (
          <div className="px-3 py-3 text-[12.5px] text-subtle">{emptyLabel}</div>
        ) : (
          filtered.map((o) => (
            <label key={o.id} className="flex cursor-pointer items-center gap-2 px-3 py-1.5 text-[13px] hover:bg-surface">
              <input type="checkbox" className="size-4 accent-brand" checked={selected.includes(o.id)} onChange={() => toggle(o.id)} />
              <span className="min-w-0 truncate">
                {o.label}
                {o.sub ? <span className="ml-1.5 text-[11.5px] text-faint">{o.sub}</span> : null}
              </span>
            </label>
          ))
        )}
      </div>
    </div>
  );
}

/** Compact square icon button with a tooltip (for dense table action columns). */
export function IconButton({ label, icon, loading, className = "", ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; icon: ReactNode; loading?: boolean }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={loading || rest.disabled}
      className={`inline-flex size-7 items-center justify-center rounded-md text-text-2 hover:bg-tint-2 hover:text-brand disabled:opacity-50 ${className}`}
      {...rest}
    >
      {loading ? <Loader2 size={14} className="animate-spin" aria-hidden /> : icon}
    </button>
  );
}
