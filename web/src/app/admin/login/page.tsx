"use client";

import { Shell } from "@/components/Shell";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await apiFetch<{ user: { id: string; username: string; role: string } }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) {
        setError(res.error.message);
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Shell>
      <div className="mx-auto max-w-lg rounded-2xl border border-white/10 bg-white/5 p-6">
        <h1 className="text-2xl font-semibold tracking-tight">Admin login</h1>
        <p className="mt-2 text-sm text-slate-300">Sign in to manage products.</p>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block">
            <div className="text-sm text-slate-300">Username</div>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
            />
          </label>
          <label className="block">
            <div className="text-sm text-slate-300">Password</div>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
            />
          </label>
          <button
            disabled={loading}
            className="inline-flex w-full items-center justify-center rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-sky-400 disabled:opacity-60 transition"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </Shell>
  );
}

