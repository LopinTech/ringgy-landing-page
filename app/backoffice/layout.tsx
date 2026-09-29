import type { Metadata } from "next";

// The backoffice is an internal operator console: never indexed, never linked from the marketing site.
export const metadata: Metadata = {
  title: { default: "Ringgy Backoffice", template: "%s · Ringgy Backoffice" },
  description: "Internal Ringgy operator console.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function BackofficeLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-page text-ink">{children}</div>;
}
