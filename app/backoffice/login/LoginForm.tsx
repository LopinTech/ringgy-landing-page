"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { Lock, ShieldAlert } from "lucide-react";
import { Button, Field, Notice, inputClass } from "@/components/backoffice/ui";
import { api, errorMessage, type AdminUser } from "@/lib/backoffice/api";

/** Only allow redirecting back inside the backoffice. */
function nextPath(): string {
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/backoffice") && !next.startsWith("/backoffice/login") ? next : "/backoffice";
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Already signed in? Skip the form.
  useEffect(() => {
    const controller = new AbortController();
    api<AdminUser>("/admin/auth/me", { quiet401: true, signal: controller.signal }).then(
      () => router.replace(nextPath()),
      () => {},
    );
    return () => controller.abort();
  }, [router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api<AdminUser>("/admin/auth/login", { method: "POST", body: { email: email.trim(), password }, quiet401: true });
      router.replace(nextPath());
    } catch (err) {
      setError(errorMessage(err));
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-[380px]">
        <div className="mb-6 flex items-center justify-center gap-2.5">
          <Image src="/assets/images/logo-mark.png" alt="" width={432} height={418} className="size-9 rounded-[9px]" />
          <div className="leading-tight">
            <div className="text-[18px] font-extrabold tracking-[-.01em] text-ink">Ringgy</div>
            <div className="text-[11px] font-bold uppercase tracking-[.12em] text-brand">Backoffice</div>
          </div>
        </div>
        <form onSubmit={onSubmit} className="rounded-lg border border-line-2 bg-white p-5 shadow-sm">
          <h1 className="mb-1 flex items-center gap-2 text-[17px] font-bold">
            <Lock size={16} className="text-brand" aria-hidden /> Operator sign in
          </h1>
          <p className="mb-4 text-[13px] text-muted">Staff accounts only. Customer logins won’t work here.</p>
          <div className="space-y-3">
            <Field label="Email">
              {(id) => (
                <input
                  id={id}
                  type="email"
                  autoComplete="username"
                  required
                  className={inputClass}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              )}
            </Field>
            <Field label="Password">
              {(id) => (
                <input
                  id={id}
                  type="password"
                  autoComplete="current-password"
                  required
                  className={inputClass}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              )}
            </Field>
            {error ? <Notice tone="danger">{error}</Notice> : null}
            <Button type="submit" variant="primary" className="w-full" loading={submitting}>
              Sign in
            </Button>
          </div>
        </form>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-[12px] text-subtle">
          <ShieldAlert size={13} aria-hidden /> Internal system — contains cost and margin data.
        </p>
      </div>
    </div>
  );
}
