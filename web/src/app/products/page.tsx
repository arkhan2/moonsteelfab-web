import Link from "next/link";
import { Shell } from "@/components/Shell";
import { apiFetch } from "@/lib/api";
import type { Product } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const res = await apiFetch<{ products: Product[] }>("/products", { cache: "no-store" });
  const products = res.ok ? res.data.products : [];

  return (
    <Shell>
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
          <p className="mt-2 text-slate-300">
            Standard product lines and configurable assemblies.
          </p>
        </div>
      </div>

      {!res.ok && (
        <div className="mt-6 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
          Could not load products: {res.error.message}
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.slug}`}
            className="group rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition"
          >
            <div className="text-xs text-slate-400">{p.category}</div>
            <div className="mt-1 text-lg font-semibold">{p.name}</div>
            <div className="mt-2 text-sm text-slate-300 line-clamp-3">{p.short_description}</div>
            <div className="mt-4 text-sm font-semibold text-sky-300 group-hover:text-sky-200">
              View details →
            </div>
          </Link>
        ))}
        {products.length === 0 && res.ok && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300 sm:col-span-2 lg:col-span-3">
            No active products yet. Add your first product in the admin panel.
          </div>
        )}
      </div>
    </Shell>
  );
}

