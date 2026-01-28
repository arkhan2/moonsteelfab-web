export function isSlug(s: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s) && s.length >= 2 && s.length <= 80;
}

export function isNonEmpty(s: unknown, max = 5000): s is string {
  return typeof s === "string" && s.trim().length > 0 && s.length <= max;
}

export function parseJsonStringArray(value: unknown) {
  if (Array.isArray(value) && value.every((x) => typeof x === "string")) return value;
  return null;
}

export function safeJsonStringify(value: unknown) {
  try {
    return JSON.stringify(value ?? null);
  } catch {
    return "null";
  }
}

