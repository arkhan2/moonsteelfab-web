export function parseCookie(header: string | null | undefined) {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (!k) continue;
    out[k] = decodeURIComponent(v);
  }
  return out;
}

export function cookieSerialize(
  name: string,
  value: string,
  opts: {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "Lax" | "Strict" | "None";
    path?: string;
    maxAgeSeconds?: number;
  } = {}
) {
  const parts = [`${name}=${encodeURIComponent(value)}`];
  parts.push(`Path=${opts.path ?? "/"}`);
  if (opts.httpOnly ?? true) parts.push("HttpOnly");
  if (opts.secure ?? true) parts.push("Secure");
  parts.push(`SameSite=${opts.sameSite ?? "Lax"}`);
  if (typeof opts.maxAgeSeconds === "number") parts.push(`Max-Age=${Math.floor(opts.maxAgeSeconds)}`);
  return parts.join("; ");
}

