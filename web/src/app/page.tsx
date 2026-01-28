import Link from "next/link";
import { Shell } from "@/components/Shell";

export default function HomePage() {
  return (
    <Shell>
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-steel-900 via-slate-950 to-slate-950 p-8 md:p-12">
        <div className="absolute inset-0 opacity-40 [background:radial-gradient(900px_circle_at_20%_20%,rgba(56,189,248,0.25),transparent_55%),radial-gradient(800px_circle_at_80%_40%,rgba(99,102,241,0.20),transparent_60%)]" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Taking bids • Fast turnaround • Quality welds
          </div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">
            Steel fabrication built for the jobsite.
          </h1>
          <p className="mt-4 max-w-2xl text-slate-300">
            Moon Steel Fabricators delivers industrial fabrication, structural steel, and custom assemblies—engineered
            to spec, documented, and delivered on schedule.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-sky-400 transition"
            >
              Request a quote
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              Browse products
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Structural Fabrication",
            body: "Beams, columns, stairs, rails, and assemblies with consistent fit-up."
          },
          { title: "Welding & QA", body: "Process control, documentation, and inspection-ready work." },
          { title: "Field Install Support", body: "Hardware, labeling, and deliverables that reduce on-site friction." }
        ].map((c) => (
          <div
            key={c.title}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <div className="text-lg font-semibold">{c.title}</div>
            <div className="mt-2 text-sm text-slate-300">{c.body}</div>
          </div>
        ))}
      </section>
    </Shell>
  );
}

