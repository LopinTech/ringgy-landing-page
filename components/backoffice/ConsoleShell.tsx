"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  BadgeDollarSign,
  ChartColumn,
  Layers,
  LayoutDashboard,
  LogOut,
  Menu,
  PackagePlus,
  Phone,
  RefreshCw,
  ShieldAlert,
  Users,
  X,
} from "lucide-react";
import { ApiError, UNAUTHORIZED_EVENT, api, type AdminUser } from "@/lib/backoffice/api";
import { useApi } from "./useApi";
import { ErrorState, Loading } from "./ui";

const NAV = [
  { href: "/backoffice", label: "Overview", icon: LayoutDashboard },
  { href: "/backoffice/pricing", label: "Pricing", icon: BadgeDollarSign },
  { href: "/backoffice/plans", label: "Plans", icon: Layers },
  { href: "/backoffice/add-ons", label: "Add-ons", icon: PackagePlus },
  { href: "/backoffice/phone-numbers", label: "Phone numbers", icon: Phone },
  { href: "/backoffice/customers", label: "Customers", icon: Users },
  { href: "/backoffice/usage", label: "Usage & costs", icon: ChartColumn },
  { href: "/backoffice/sync", label: "Sync", icon: RefreshCw },
];

const AdminContext = createContext<AdminUser | null>(null);
export const useAdmin = () => useContext(AdminContext);

export function ConsoleShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const me = useApi<AdminUser>("/admin/auth/me");
  const [navOpen, setNavOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Close the mobile nav on navigation (adjust state during render, not in an effect).
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setNavOpen(false);
  }

  // Any 401 from any page → back to login, remembering where we were.
  useEffect(() => {
    const toLogin = () => router.replace(`/backoffice/login?next=${encodeURIComponent(window.location.pathname)}`);
    window.addEventListener(UNAUTHORIZED_EVENT, toLogin);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, toLogin);
  }, [router]);

  async function signOut() {
    setSigningOut(true);
    try {
      await api("/admin/auth/logout", { method: "POST", quiet401: true });
    } catch {
      // Cookie may already be gone; either way go to login.
    }
    router.replace("/backoffice/login");
  }

  const unauthorized = me.error instanceof ApiError && me.error.status === 401;
  if (me.initialLoading || unauthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading label={unauthorized ? "Redirecting to sign in…" : "Checking session…"} />
      </div>
    );
  }
  if (!me.data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <ErrorState error={me.error ?? new Error("Could not load your session.")} onRetry={me.reload} />
      </div>
    );
  }

  const isActive = (href: string) => (href === "/backoffice" ? pathname === href : pathname.startsWith(href));

  const nav = (
    <nav className="flex flex-1 flex-col gap-0.5 px-2 py-3" aria-label="Backoffice">
      {NAV.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13.5px] font-medium transition-colors ${
            isActive(href) ? "bg-white/10 text-white" : "text-on-dark-muted hover:bg-white/5 hover:text-white"
          }`}
          aria-current={isActive(href) ? "page" : undefined}
        >
          <Icon size={16} aria-hidden />
          {label}
        </Link>
      ))}
    </nav>
  );

  const sidebar = (
    <div className="flex h-full flex-col bg-ink-deep text-on-dark">
      <div className="flex items-center gap-2.5 border-b border-on-dark-line px-4 py-3.5">
        <Image src="/assets/images/logo-mark.png" alt="" width={432} height={418} className="size-7 rounded-[7px]" />
        <div className="leading-tight">
          <div className="text-[15px] font-extrabold tracking-[-.01em] text-white">Ringgy</div>
          <div className="text-[11px] font-bold uppercase tracking-[.12em] text-on-dark-accent">Backoffice</div>
        </div>
      </div>
      {nav}
      <div className="border-t border-on-dark-line px-3 py-3">
        <div className="mb-2 flex items-center gap-1.5 rounded bg-amber-400/15 px-2 py-1.5 text-[11px] font-bold uppercase tracking-[.08em] text-amber-300">
          <ShieldAlert size={13} aria-hidden /> Internal only
        </div>
        <div className="truncate text-[12.5px] text-on-dark-muted" title={me.data.email}>
          {me.data.name || me.data.email}
        </div>
        <button
          type="button"
          onClick={signOut}
          disabled={signingOut}
          className="mt-2 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-on-dark-muted hover:bg-white/5 hover:text-white disabled:opacity-50"
        >
          <LogOut size={15} aria-hidden /> {signingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </div>
  );

  return (
    <AdminContext.Provider value={me.data}>
      <div className="min-h-screen bg-page lg:pl-[228px]">
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-[228px] lg:block">{sidebar}</aside>

        {navOpen ? (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button type="button" aria-label="Close menu" className="absolute inset-0 bg-ink-deep/50" onClick={() => setNavOpen(false)} />
            <div className="relative h-full w-[240px]">
              {sidebar}
              <button
                type="button"
                onClick={() => setNavOpen(false)}
                className="absolute right-2 top-3 rounded p-1 text-on-dark-muted hover:text-white"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        ) : null}

        <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-amber-200 bg-amber-50 px-4 py-1.5 text-[12px] text-amber-900 sm:px-6">
          <button
            type="button"
            className="-ml-1 rounded p-1 text-amber-900 lg:hidden"
            onClick={() => setNavOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
          <ShieldAlert size={14} className="shrink-0" aria-hidden />
          <span>
            <strong>Internal.</strong> This console shows internal costs and margins. Never share screenshots or figures with customers.
          </span>
        </div>

        <main className="mx-auto w-full max-w-[1480px] px-4 py-6 sm:px-6">{children}</main>
      </div>
    </AdminContext.Provider>
  );
}
