import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Context } from "hono";
import type { Env } from "./types";
import { cookieSerialize, parseCookie } from "./cookies";
import {
  cleanupExpiredSessions,
  createProduct,
  createSession,
  deleteProduct,
  deleteSession,
  ensureBootstrapAdmin,
  getProductById,
  getProductBySlug,
  getUserBySession,
  listProducts,
  login,
  updateProduct
} from "./db";
import { isNonEmpty, isSlug, parseJsonStringArray, safeJsonStringify } from "./validation";

const SESSION_COOKIE = "msf_session";

const app = new Hono<{ Bindings: Env }>();

app.use(
  "*",
  cors({
    origin: (origin) => {
      // Allow localhost for development
      if (!origin || origin.includes("localhost") || origin.includes("127.0.0.1")) return origin || true;
      // Allow specific remote origins
      if (origin === "http://localhost:3000" || origin === "http://192.168.100.7:3000") return origin;
      // Default allow for development
      return origin || true;
    },
    credentials: true,
    allowHeaders: ["Content-Type"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
  })
);

app.use("*", async (c, next) => {
  // best-effort session cleanup + admin bootstrap
  await ensureBootstrapAdmin(c.env);
  await cleanupExpiredSessions(c.env);
  await next();
});

function jsonOk(c: Context, data: unknown, status: number = 200) {
  return c.json({ ok: true, data }, status as any);
}
function jsonErr(c: Context, message: string, status: number = 400) {
  return c.json({ ok: false, error: { message } }, status as any);
}

async function requireAdmin(c: Context<{ Bindings: Env }>) {
  const cookies = parseCookie(c.req.header("Cookie"));
  const sid = cookies[SESSION_COOKIE];
  if (!sid) return null;
  return await getUserBySession(c.env, sid);
}

app.get("/health", (c) => jsonOk(c, { status: "ok" }));

// ---------- Auth ----------
app.post("/auth/login", async (c) => {
  const body = await c.req.json().catch(() => null) as null | { username?: string; password?: string };
  const username = body?.username ?? "";
  const password = body?.password ?? "";
  if (!isNonEmpty(username, 64) || !isNonEmpty(password, 256)) return jsonErr(c, "Invalid credentials", 400);

  const user = await login(c.env, username, password);
  if (!user) return jsonErr(c, "Invalid credentials", 401);

  const session = await createSession(c.env, user.id);
  c.header(
    "Set-Cookie",
    cookieSerialize(SESSION_COOKIE, session.id, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
      maxAgeSeconds: 60 * 60 * 24 * 14
    })
  );
  return jsonOk(c, { user: { id: user.id, username: user.username, role: user.role } });
});

app.post("/auth/logout", async (c) => {
  const cookies = parseCookie(c.req.header("Cookie"));
  const sid = cookies[SESSION_COOKIE];
  if (sid) await deleteSession(c.env, sid);
  c.header(
    "Set-Cookie",
    cookieSerialize(SESSION_COOKIE, "", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
      maxAgeSeconds: 0
    })
  );
  return jsonOk(c, { loggedOut: true });
});

app.get("/auth/me", async (c) => {
  const user = await requireAdmin(c);
  if (!user) return jsonErr(c, "Unauthorized", 401);
  return jsonOk(c, { user });
});

// ---------- Public Products ----------
app.get("/products", async (c) => {
  const products = await listProducts(c.env, { includeInactive: false });
  return jsonOk(c, { products });
});

app.get("/products/:slug", async (c) => {
  const slug = c.req.param("slug");
  const product = await getProductBySlug(c.env, slug, { includeInactive: false });
  if (!product) return jsonErr(c, "Not found", 404);
  return jsonOk(c, { product });
});

// ---------- Admin Products (CRUD) ----------
app.get("/admin/products", async (c) => {
  const user = await requireAdmin(c);
  if (!user) return jsonErr(c, "Unauthorized", 401);
  const products = await listProducts(c.env, { includeInactive: true });
  return jsonOk(c, { products });
});

app.post("/admin/products", async (c) => {
  const user = await requireAdmin(c);
  if (!user) return jsonErr(c, "Unauthorized", 401);

  const body = await c.req.json().catch(() => null) as any;
  if (!isNonEmpty(body?.name, 140)) return jsonErr(c, "Missing name");
  if (!isNonEmpty(body?.category, 80)) return jsonErr(c, "Missing category");
  if (!isNonEmpty(body?.short_description, 240)) return jsonErr(c, "Missing short_description");
  if (!isNonEmpty(body?.description, 20_000)) return jsonErr(c, "Missing description");
  if (!isNonEmpty(body?.slug, 80) || !isSlug(body.slug)) return jsonErr(c, "Invalid slug");

  const images = parseJsonStringArray(body?.images) ?? [];
  const specs = typeof body?.specs === "object" && body?.specs ? body.specs : {};

  const product = await createProduct(c.env, {
    id: undefined,
    slug: body.slug,
    name: body.name,
    category: body.category,
    short_description: body.short_description,
    description: body.description,
    specs_json: safeJsonStringify(specs),
    images_json: safeJsonStringify(images),
    is_active: body?.is_active === false ? 0 : 1,
    sort_order: Number.isFinite(body?.sort_order) ? Number(body.sort_order) : 0
  });

  return jsonOk(c, { product }, 201);
});

app.get("/admin/products/:id", async (c) => {
  const user = await requireAdmin(c);
  if (!user) return jsonErr(c, "Unauthorized", 401);
  const product = await getProductById(c.env, c.req.param("id"));
  if (!product) return jsonErr(c, "Not found", 404);
  return jsonOk(c, { product });
});

app.patch("/admin/products/:id", async (c) => {
  const user = await requireAdmin(c);
  if (!user) return jsonErr(c, "Unauthorized", 401);

  const id = c.req.param("id");
  const body = await c.req.json().catch(() => null) as any;
  const patch: any = {};

  if (body?.slug !== undefined) {
    if (!isNonEmpty(body.slug, 80) || !isSlug(body.slug)) return jsonErr(c, "Invalid slug");
    patch.slug = body.slug;
  }
  if (body?.name !== undefined) {
    if (!isNonEmpty(body.name, 140)) return jsonErr(c, "Invalid name");
    patch.name = body.name;
  }
  if (body?.category !== undefined) {
    if (!isNonEmpty(body.category, 80)) return jsonErr(c, "Invalid category");
    patch.category = body.category;
  }
  if (body?.short_description !== undefined) {
    if (!isNonEmpty(body.short_description, 240)) return jsonErr(c, "Invalid short_description");
    patch.short_description = body.short_description;
  }
  if (body?.description !== undefined) {
    if (!isNonEmpty(body.description, 20_000)) return jsonErr(c, "Invalid description");
    patch.description = body.description;
  }
  if (body?.is_active !== undefined) patch.is_active = body.is_active ? 1 : 0;
  if (body?.sort_order !== undefined) patch.sort_order = Number(body.sort_order) || 0;
  if (body?.images !== undefined) {
    const images = parseJsonStringArray(body.images);
    if (!images) return jsonErr(c, "Invalid images");
    patch.images_json = safeJsonStringify(images);
  }
  if (body?.specs !== undefined) {
    if (typeof body.specs !== "object" || !body.specs) return jsonErr(c, "Invalid specs");
    patch.specs_json = safeJsonStringify(body.specs);
  }

  const product = await updateProduct(c.env, id, patch);
  if (!product) return jsonErr(c, "Not found", 404);
  return jsonOk(c, { product });
});

app.delete("/admin/products/:id", async (c) => {
  const user = await requireAdmin(c);
  if (!user) return jsonErr(c, "Unauthorized", 401);
  await deleteProduct(c.env, c.req.param("id"));
  return jsonOk(c, { deleted: true });
});

export default app;

