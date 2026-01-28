import { Shell } from "@/components/Shell";

export default function ServicesPage() {
  return (
    <Shell>
      <h1 className="text-3xl font-semibold tracking-tight">Services</h1>
      <p className="mt-3 max-w-3xl text-slate-300">
        Industrial fabrication services tailored to structural and custom steel work.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {[
          {
            title: "Structural Steel",
            body: "Beams, columns, connections, embeds, base plates, and assemblies with clear labels and fit-up."
          },
          {
            title: "Stairs & Rails",
            body: "Stairs, platforms, guardrails, ladders, and handrails built to jobsite constraints."
          },
          {
            title: "Custom Fabrication",
            body: "Skids, frames, brackets, and production runs with repeatable QC."
          },
          {
            title: "Documentation",
            body: "Deliverables, packing lists, and inspection support aligned to project requirements."
          }
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

