import type { Env, Product } from "./types";
import { hashPassword, randomId, sha256Hex, verifyPassword } from "./crypto";

export async function ensureBootstrapAdmin(env: Env) {
  const username = "admin";
  const existing = await env.DB.prepare("SELECT id FROM users WHERE username = ?")
    .bind(username)
    .first<{ id: string }>();
  if (existing?.id) return;

  const pw = env.ADMIN_BOOTSTRAP_PASSWORD;
  if (!pw) {
    // No bootstrap password set; do not create an admin automatically.
    return;
  }

  const now = Date.now();
  const userId = randomId(16);
  const passwordHash = await hashPassword(pw);
  await env.DB.prepare(
    "INSERT INTO users (id, username, password_hash, role, created_at) VALUES (?, ?, ?, 'admin', ?)"
  )
    .bind(userId, username, passwordHash, now)
    .run();
}

export async function createSession(env: Env, userId: string) {
  const now = Date.now();
  const ttlMs = 1000 * 60 * 60 * 24 * 14; // 14 days
  const id = randomId(16);
  await env.DB.prepare("INSERT INTO sessions (id, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)")
    .bind(id, userId, now, now + ttlMs)
    .run();
  return { id, expiresAt: now + ttlMs };
}

export async function deleteSession(env: Env, sessionId: string) {
  await env.DB.prepare("DELETE FROM sessions WHERE id = ?").bind(sessionId).run();
}

export async function cleanupExpiredSessions(env: Env) {
  await env.DB.prepare("DELETE FROM sessions WHERE expires_at < ?").bind(Date.now()).run();
}

export async function getUserBySession(env: Env, sessionId: string) {
  const now = Date.now();
  const row = await env.DB.prepare(
    `SELECT u.id, u.username, u.role
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.id = ? AND s.expires_at >= ?`
  )
    .bind(sessionId, now)
    .first<{ id: string; username: string; role: "admin" }>();
  return row ?? null;
}

export async function login(env: Env, username: string, password: string) {
  const row = await env.DB.prepare("SELECT id, password_hash, role FROM users WHERE username = ?")
    .bind(username)
    .first<{ id: string; password_hash: string; role: "admin" }>();
  if (!row) return null;
  const ok = await verifyPassword(password, row.password_hash);
  if (!ok) return null;
  return { id: row.id, username, role: row.role };
}

export async function listProducts(env: Env, opts: { includeInactive: boolean }) {
  const q = opts.includeInactive
    ? "SELECT * FROM products ORDER BY sort_order ASC, updated_at DESC"
    : "SELECT * FROM products WHERE is_active = 1 ORDER BY sort_order ASC, updated_at DESC";
  const res = await env.DB.prepare(q).all<Product>();
  return res.results ?? [];
}

export async function getProductBySlug(env: Env, slug: string, opts: { includeInactive: boolean }) {
  const q = opts.includeInactive
    ? "SELECT * FROM products WHERE slug = ?"
    : "SELECT * FROM products WHERE slug = ? AND is_active = 1";
  const row = await env.DB.prepare(q).bind(slug).first<Product>();
  return row ?? null;
}

export async function getProductById(env: Env, id: string) {
  const row = await env.DB.prepare("SELECT * FROM products WHERE id = ?").bind(id).first<Product>();
  return row ?? null;
}

export async function createProduct(
  env: Env,
  input: Omit<Product, "id" | "created_at" | "updated_at"> & { id?: string }
) {
  const now = Date.now();
  const id = input.id ?? randomId(16);
  await env.DB.prepare(
    `INSERT INTO products (
      id, slug, name, category, short_description, description,
      specs_json, images_json, is_active, sort_order, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      id,
      input.slug,
      input.name,
      input.category,
      input.short_description,
      input.description,
      input.specs_json,
      input.images_json,
      input.is_active,
      input.sort_order,
      now,
      now
    )
    .run();
  return await getProductById(env, id);
}

export async function updateProduct(
  env: Env,
  id: string,
  input: Partial<Omit<Product, "id" | "created_at" | "updated_at">>
) {
  const now = Date.now();
  const existing = await getProductById(env, id);
  if (!existing) return null;

  const next: Product = {
    ...existing,
    ...input,
    updated_at: now
  };

  await env.DB.prepare(
    `UPDATE products SET
      slug = ?, name = ?, category = ?, short_description = ?, description = ?,
      specs_json = ?, images_json = ?, is_active = ?, sort_order = ?, updated_at = ?
     WHERE id = ?`
  )
    .bind(
      next.slug,
      next.name,
      next.category,
      next.short_description,
      next.description,
      next.specs_json,
      next.images_json,
      next.is_active,
      next.sort_order,
      next.updated_at,
      id
    )
    .run();

  return await getProductById(env, id);
}

export async function deleteProduct(env: Env, id: string) {
  await env.DB.prepare("DELETE FROM products WHERE id = ?").bind(id).run();
}

export async function apiKeyFromSecret(env: Env) {
  // Optional: derive a stable key from SESSION_SECRET for internal automation later.
  if (!env.SESSION_SECRET) return null;
  return await sha256Hex(env.SESSION_SECRET);
}

