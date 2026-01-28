import Link from "next/link";
import { Shell } from "@/components/Shell";

export default function AdminIndexPage() {
  return (
    <Shell>
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Admin</h1>
          <p className="mt-2 text-slate-300">Manage products and site content.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/login"
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 transition"
          >
            Login
          </Link>
          <Link
            href="/admin/products"
            className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400 transition"
          >
            Products
          </Link>
        </div>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-lg font-semibold">Secure admin panel</div>
          <div className="mt-2 text-sm text-slate-300">
            Login creates an HttpOnly session cookie stored in D1.
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-lg font-semibold">Product system</div>
          <div className="mt-2 text-sm text-slate-300">
            Create, update, publish/unpublish, and reorder products.
          </div>
        </div>
      </div>
    </Shell>
  );
}

