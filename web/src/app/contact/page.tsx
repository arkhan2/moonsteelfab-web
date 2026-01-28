import { Shell } from "@/components/Shell";

export default function ContactPage() {
  return (
    <Shell>
      <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
      <p className="mt-3 max-w-3xl text-slate-300">
        Tell us about your project. We’ll respond with lead time, clarifying questions, and a quote path.
      </p>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-lg font-semibold">Request a quote</div>
          <div className="mt-3 text-sm text-slate-300">
            For now, this form is informational (email/CRM integration can be added next).
          </div>

          <form className="mt-6 space-y-4">
            {[
              { label: "Name", type: "text", placeholder: "Your name" },
              { label: "Company", type: "text", placeholder: "Company" },
              { label: "Email", type: "email", placeholder: "you@company.com" },
              { label: "Phone", type: "tel", placeholder: "(000) 000-0000" }
            ].map((f) => (
              <label key={f.label} className="block">
                <div className="text-sm text-slate-300">{f.label}</div>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
                />
              </label>
            ))}
            <label className="block">
              <div className="text-sm text-slate-300">Project details</div>
              <textarea
                placeholder="Material, dimensions, drawings, deadline, delivery address…"
                rows={6}
                className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/60"
              />
            </label>

            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-sky-400 transition"
            >
              Submit (placeholder)
            </button>
          </form>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-lg font-semibold">Direct</div>
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <div>
              <span className="text-slate-400">Email:</span> quotes@moonsteelfab.com
            </div>
            <div>
              <span className="text-slate-400">Phone:</span> (000) 000-0000
            </div>
            <div>
              <span className="text-slate-400">Hours:</span> Mon–Fri, 7am–4pm
            </div>
          </div>
          <div className="mt-8 text-sm text-slate-300">
            Add your shop address and service area here.
          </div>
        </div>
      </div>
    </Shell>
  );
}

