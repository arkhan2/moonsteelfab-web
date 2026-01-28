"use client";

import { Shell } from "@/components/Shell";
import { apiFetch } from "@/lib/api";
import type { Product } from "@/lib/products";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type ProductInput = {
  slug: string;
  name: string;
  category: string;
  short_description: string;
  description: string;
  specs: Record<string, unknown>;
  images: string[];
  is_active: boolean;
  sort_order: number;
};

const emptyDraft: ProductInput = {
  slug: "",
  name: "",
  category: "General",
  short_description: "",
  description: "",
  specs: {},
  images: [],
  is_active: true,
  sort_order: 0
};

export default function AdminProductsPage() {
  const router = useRouter();
  const [me, setMe] = useState<{ id: string; username: string; role: string } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<ProductInput>(emptyDraft);

  const sorted = useMemo(
    () =>
      [...products].sort((a, b) => {
        if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
        return b.updated_at - a.updated_at;
      }),
    [products]
  );

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const meRes = await apiFetch<{ user: { id: string; username: string; role: string } }>("/auth/me");
      if (!meRes.ok) {
        router.push("/admin/login");
        return;
      }
      setMe(meRes.data.user);

      const listRes = await apiFetch<{ products: Product[] }>("/admin/products");
      if (!listRes.ok) {
        setError(listRes.error.message);
        return;
      }
      setProducts(listRes.data.products);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function create() {
    setError(null);
    const res = await apiFetch<{ product: Product }>("/admin/products", {
      method: "POST",
      body: JSON.stringify(draft)
    });
    if (!res.ok) {
      setError(res.error.message);
      return;
    }
    setDraft(emptyDraft);
    await load();
  }

  async function toggleActive(p: Product) {
    const res = await apiFetch<{ product: Product }>(`/admin/products/${p.id}`, {
      method: "PATCH",
      body: JSON.stringify({ is_active: p.is_active ? 0 : 1 })
    });
    if (!res.ok) {
      setError(res.error.message);
      return;
    }
    await load();
  }

  async function remove(p: Product) {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    const res = await apiFetch<{ deleted: boolean }>(`/admin/products/${p.id}`, { method: "DELETE" });
    if (!res.ok) {
      setError(res.error.message);
      return;
    }
    await load();
  }

  async function logout() {
    await apiFetch<{ loggedOut: boolean }>("/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <Shell>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Products (Admin)</h1>
          <p className="mt-2 text-slate-300">
            Signed in as <span className="text-slate-100">{me?.username ?? "…"}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/products"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition"
          >
            View public
          </Link>
          <button
            onClick={logout}
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
          {error}
        </div>
      )}

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-lg font-semibold">Create product</div>
          <div className="mt-4 space-y-3">
            {[
              { k: "slug", label: "Slug (kebab-case)" },
              { k: "name", label: "Name" },
              { k: "category", label: "Category" },
              { k: "short_description", label: "Short description" }
            ].map((f) => (
              <label key={f.k} className="block">
                <div className="text-sm text-slate-300">{f.label}</div>
                <input
                  value={(draft as any)[f.k]}
                  onChange={(e) => setDraft((d) => ({ ...d, [f.k]: e.target.value }))}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
                />
              </label>
            ))}
            <label className="block">
              <div className="text-sm text-slate-300">Description</div>
              <textarea
                value={draft.description}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                rows={6}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
              />
            </label>

            <div className="flex items-center justify-between gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={draft.is_active}
                  onChange={(e) => setDraft((d) => ({ ...d, is_active: e.target.checked }))}
                />
                Active
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                Sort
                <input
                  type="number"
                  value={draft.sort_order}
                  onChange={(e) => setDraft((d) => ({ ...d, sort_order: Number(e.target.value) || 0 }))}
                  className="w-24 rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
                />
              </label>
            </div>

            <button
              onClick={create}
              className="inline-flex w-full items-center justify-center rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-sky-400 transition"
            >
              Create
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-lg font-semibold">All products</div>
          {loading ? (
            <div className="mt-4 text-sm text-slate-300">Loading…</div>
          ) : (
            <div className="mt-4 space-y-3">
              {sorted.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border border-white/10 bg-slate-950/40 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm text-slate-400">{p.category}</div>
                      <div className="text-base font-semibold">{p.name}</div>
                      <div className="mt-1 text-xs text-slate-400">
                        <span className="text-slate-500">slug:</span> {p.slug} •{" "}
                        <span className="text-slate-500">sort:</span> {p.sort_order} •{" "}
                        <span className={p.is_active ? "text-emerald-300" : "text-amber-300"}>
                          {p.is_active ? "active" : "inactive"}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleActive(p)}
                        className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold hover:bg-white/10 transition"
                      >
                        {p.is_active ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        onClick={() => remove(p)}
                        className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-200 hover:bg-rose-500/15 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {sorted.length === 0 && (
                <div className="text-sm text-slate-300">No products yet.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}

