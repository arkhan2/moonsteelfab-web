import { Shell } from "@/components/Shell";
import { apiFetch } from "@/lib/api";
import type { Product } from "@/lib/products";
import { productImages, productSpecs } from "@/lib/products";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await apiFetch<{ product: Product }>(`/products/${slug}`, { cache: "no-store" });
  if (!res.ok) {
    return (
      <Shell>
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
          Could not load product: {res.error.message}
        </div>
        <div className="mt-6">
          <Link className="text-sky-300 hover:text-sky-200" href="/products">
            ← Back to products
          </Link>
        </div>
      </Shell>
    );
  }

  const p = res.data.product;
  const images = productImages(p);
  const specs = productSpecs(p);

  return (
    <Shell>
      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="text-sm text-slate-400">{p.category}</div>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{p.name}</h1>
          <p className="mt-3 max-w-3xl text-slate-300">{p.short_description}</p>
        </div>
        <Link className="text-sm text-sky-300 hover:text-sky-200" href="/products">
          ← Back
        </Link>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="prose prose-invert max-w-none prose-p:text-slate-200">
            <p className="whitespace-pre-wrap">{p.description}</p>
          </div>
        </div>

        <aside className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-lg font-semibold">Specs</div>
          <div className="mt-4 space-y-3 text-sm">
            {Object.keys(specs).length === 0 && (
              <div className="text-slate-300">No specs listed yet.</div>
            )}
            {Object.entries(specs).map(([k, v]) => (
              <div key={k} className="flex items-start justify-between gap-3">
                <div className="text-slate-400">{k}</div>
                <div className="text-slate-200 text-right break-words">
                  {typeof v === "string" ? v : JSON.stringify(v)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-lg font-semibold">Images</div>
          <div className="mt-3 space-y-2">
            {images.length === 0 && <div className="text-sm text-slate-300">No images yet.</div>}
            {images.slice(0, 4).map((src) => (
              <div key={src} className="truncate text-sm text-sky-300">
                {src}
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-sky-400 transition"
            >
              Request a quote
            </Link>
          </div>
        </aside>
      </div>
    </Shell>
  );
}

