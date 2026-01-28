import { env } from "./env";

export type ApiOk<T> = { ok: true; data: T };
export type ApiErr = { ok: false; error: { message: string } };
export type ApiResponse<T> = ApiOk<T> | ApiErr;

export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<ApiResponse<T>> {
  const url = `${env.apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    credentials: "include"
  });
  const json = (await res.json().catch(() => null)) as ApiResponse<T> | null;
  if (json && typeof json === "object" && "ok" in json) return json as ApiResponse<T>;
  return { ok: false, error: { message: `Unexpected response (${res.status})` } };
}

