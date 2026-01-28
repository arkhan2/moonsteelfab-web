import { Shell } from "@/components/Shell";

export default function ProjectsPage() {
  return (
    <Shell>
      <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
      <p className="mt-3 max-w-3xl text-slate-300">
        A snapshot of typical project categories. Replace these placeholders with your real portfolio.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          { title: "Industrial Platforms", body: "Access platforms, catwalks, and maintenance structures." },
          { title: "Facility Steel", body: "Mezzanines, structural supports, and retrofits." },
          { title: "Custom Assemblies", body: "Production-ready frames, skids, and fixtures." }
        ].map((x) => (
          <div key={x.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-lg font-semibold">{x.title}</div>
            <div className="mt-2 text-sm text-slate-300">{x.body}</div>
          </div>
        ))}
      </div>
    </Shell>
  );
}

