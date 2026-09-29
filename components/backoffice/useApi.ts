"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError, api } from "@/lib/backoffice/api";

type Settled<T> = { key: string; data?: T; error?: ApiError | Error };

/**
 * Minimal GET hook: fetches `path` on mount / when it changes, `reload()` refetches.
 * Keeps the previous data while refetching (so tables don't flash empty).
 * `loading` is derived (no setState inside the effect body).
 */
export function useApi<T>(path: string | null) {
  const [nonce, setNonce] = useState(0);
  const [settled, setSettled] = useState<Settled<T> | null>(null);
  const key = path ? `${path}#${nonce}` : null;

  useEffect(() => {
    if (!path || !key) return;
    const controller = new AbortController();
    api<T>(path, { signal: controller.signal }).then(
      (data) => setSettled({ key, data }),
      (error: unknown) => {
        if (controller.signal.aborted) return;
        setSettled((prev) => ({ key, data: prev?.data, error: error instanceof Error ? error : new Error(String(error)) }));
      },
    );
    return () => controller.abort();
  }, [path, key]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  /** Replace the cached data locally (after a mutation that returned the fresh object). */
  const mutate = useCallback(
    (update: (prev: T | undefined) => T) => setSettled((prev) => ({ key: prev?.key ?? "", data: update(prev?.data) })),
    [],
  );

  const loading = key !== null && settled?.key !== key;
  return {
    data: settled?.data,
    error: loading ? undefined : settled?.error,
    loading,
    /** First load — nothing to show yet. */
    initialLoading: loading && settled?.data === undefined,
    reload,
    mutate,
  };
}
