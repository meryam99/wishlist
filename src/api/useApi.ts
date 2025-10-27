import { useCallback, useState } from "react";
import type { Wish } from "../types/wish";

const BASE_URL = "http://localhost:4000";

export function useApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const request = useCallback(async <T,>(path: string, init?: RequestInit): Promise<T> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}${path}`, {
        ...init,
        headers: {
          ...(init?.body ? { "Content-Type": "application/json" } : {}),
          Accept: "application/json",
          ...(init?.headers || {}),
        },
        cache: "no-store",
      });

      if (!res.ok) {
        let msg = `${res.status} ${res.statusText}`;
        try {
          const j = await res.json();
          if (j?.message) msg = j.message;
        } catch {
           // ignore body parsing errors
        }
        throw new Error(msg);
      }

      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        return (await res.json()) as T;
      }
      try { return (await res.json()) as T; } catch { /* no body */ }
      return undefined as T;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getWishes = useCallback(
    async (opts?: { signal?: AbortSignal }): Promise<Wish[]> => {
      return (await request<Wish[]>("/wishes", { signal: opts?.signal })) || [];
    },
    [request]
  );

  const createWish = useCallback(
    (data: Omit<Wish, "id" | "createdAt">) =>
      request<Wish>("/wishes", {
        method: "POST",
        body: JSON.stringify({ ...data, createdAt: new Date().toISOString() }),
      }),
    [request]
  );

  const updateWish = useCallback(
    (id: number, data: Partial<Omit<Wish, "id" | "createdAt">>) =>
      request<Wish>(`/wishes/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    [request]
  );

  const deleteWish = useCallback(
    (id: number) => request<void>(`/wishes/${id}`, { method: "DELETE" }),
    [request]
  );

  return { isLoading, error, request, getWishes, createWish, updateWish, deleteWish };
}