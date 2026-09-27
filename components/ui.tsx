import type { CSSProperties, ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

export function ArrowRightIcon({ size = 22, strokeWidth = 2.4, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export const PHONE_PATH =
  "M6.6 10.8a15.2 15.2 0 006.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 013 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z";

export function PhoneIcon({ size = 26, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d={PHONE_PATH} />
    </svg>
  );
}

export function UsersIcon({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <circle cx="8.5" cy="8" r="3.2" />
      <circle cx="16" cy="8.5" r="2.7" />
      <path d="M2.5 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5z" />
      <path d="M15.5 19c0-2-.6-3.6-1.7-4.8.6-.2 1.3-.3 2.2-.3 3 0 5.5 2 5.5 5.1z" />
    </svg>
  );
}

export function PersonIcon({ size = 26, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <circle cx="12" cy="8" r="4.2" />
      <path d="M3.5 21c0-4.4 3.8-7.5 8.5-7.5s8.5 3.1 8.5 7.5z" />
    </svg>
  );
}

export function ChatIcon({ size = 28, dotColor = "#fff", ...props }: IconProps & { dotColor?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 3C6.5 3 2.5 6.6 2.5 11c0 2.2 1 4.2 2.7 5.6L4.5 21l4.4-2.3c1 .3 2 .4 3.1.4 5.5 0 9.5-3.6 9.5-8S17.5 3 12 3z" />
      <circle cx="8" cy="11" r="1.3" fill={dotColor} />
      <circle cx="12" cy="11" r="1.3" fill={dotColor} />
      <circle cx="16" cy="11" r="1.3" fill={dotColor} />
    </svg>
  );
}

export function BotIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <circle cx="12" cy="3.5" r="1.5" />
      <rect x="11.2" y="4.5" width="1.6" height="3" />
      <rect x="3.5" y="7" width="17" height="12" rx="5" />
      <rect x="1.5" y="11" width="2.5" height="4" rx="1" />
      <rect x="20" y="11" width="2.5" height="4" rx="1" />
      <circle cx="9" cy="12.5" r="1.5" fill="#fff" />
      <circle cx="15" cy="12.5" r="1.5" fill="#fff" />
      <path d="M9.5 15.5h5" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function CheckIcon({ size = 12, strokeWidth = 3.4, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

export function BarsChartIcon({ size = 28, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <rect x="4" y="13" width="4" height="7" rx="1" />
      <rect x="10" y="9" width="4" height="11" rx="1" />
      <rect x="16" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

/** Six static bars used as a "voice" glyph. */
export function VoiceMark({ height = 24, barWidth = 2.5, className = "bg-primary" }: { height?: number; barWidth?: number; className?: string }) {
  return (
    <span className="inline-flex items-center gap-[2.5px]" style={{ height }} aria-hidden>
      {[35, 70, 100, 55, 85, 40].map((h, i) => (
        <span key={i} className={`rounded-[2px] ${className}`} style={{ width: barWidth, height: `${h}%` }} />
      ))}
    </span>
  );
}

/** Brand-blue word with a hand-drawn underline swoosh. */
export function Accent({
  children,
  underlineWidth = "100%",
  bottom = -10,
  height = 12,
  stroke = "#A9C8F5",
  strokeWidth = 3.5,
  className = "text-primary",
}: {
  children: ReactNode;
  underlineWidth?: string;
  bottom?: number;
  height?: number;
  stroke?: string;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <span className={`relative inline-block ${className}`}>
      {children}
      <svg viewBox="0 0 300 14" preserveAspectRatio="none" className="pointer-events-none absolute left-0" style={{ bottom, width: underlineWidth, height }} aria-hidden>
        <path d="M3 9 C 80 3, 200 3, 297 8" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
      </svg>
    </span>
  );
}

/** Uppercase section label followed by a short rule. */
export function Eyebrow({
  children,
  className = "mb-6 text-[15px] font-bold",
  lineClassName = "w-11 bg-accent-soft",
}: {
  children: ReactNode;
  className?: string;
  lineClassName?: string;
}) {
  return (
    <div className={`flex items-center gap-4 uppercase tracking-[.14em] text-brand ${className}`}>
      {children}
      <span className={`h-[1.5px] ${lineClassName}`} />
    </div>
  );
}

/** Soft mountain-wave decoration used in the bottom-right corner of cards. */
export function CardWave({ fill, height = "48%" }: { fill: string; height?: string }) {
  return (
    <svg viewBox="0 0 200 120" preserveAspectRatio="none" className="pointer-events-none absolute bottom-0 right-0 w-[62%]" style={{ height }} aria-hidden>
      <path d="M0 120 C 70 115, 90 60, 140 40 S 200 10, 200 10 V120 Z" fill={fill} opacity=".45" />
      <path d="M40 120 C 100 118, 120 80, 160 62 S 200 45, 200 45 V120 Z" fill={fill} opacity=".55" />
    </svg>
  );
}

export function DotGrid({ cols, rows, gap, r, fill, className = "", style }: { cols: number; rows: number; gap: number; r: number; fill: string; className?: string; style?: CSSProperties }) {
  const w = (cols - 1) * gap + r * 4;
  const h = (rows - 1) * gap + r * 4;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className={`pointer-events-none absolute ${className}`} style={style} aria-hidden>
      {Array.from({ length: rows }).flatMap((_, y) =>
        Array.from({ length: cols }).map((_, x) => <circle key={`${x}-${y}`} cx={r * 2 + x * gap} cy={r * 2 + y * gap} r={r} fill={fill} />),
      )}
    </svg>
  );
}

export const container = "mx-auto max-w-[1520px] px-4 sm:px-7";
export const sectionPad = "py-[clamp(72px,9vw,120px)]";
