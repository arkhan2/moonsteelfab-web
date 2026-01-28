import Link from "next/link";
import type { ReactNode } from "react";

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm text-slate-200 hover:text-white transition"
    >
      {children}
    </Link>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-sky-400 to-steel-600 shadow-[0_0_0_1px_rgba(255,255,255,0.1)]" />
            <div className="leading-tight">
              <div className="font-semibold">Moon Steel Fabricators</div>
              <div className="text-xs text-slate-400">
                Industrial Steel • Fabrication • Install
              </div>
            </div>
          </Link>
          <nav className="flex items-center gap-6">
            <NavLink href="/products">Products</NavLink>
            <NavLink href="/services">Services</NavLink>
            <NavLink href="/projects">Projects</NavLink>
            <NavLink href="/contact">Contact</NavLink>
            <NavLink href="/admin">Admin</NavLink>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
      <footer className="border-t border-white/10 bg-slate-950/70">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-400 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} Moon Steel Fabricators. All rights reserved.</div>
          <div className="flex gap-4">
            <a className="hover:text-slate-200" href="tel:+1-000-000-0000">
              (000) 000-0000
            </a>
            <a className="hover:text-slate-200" href="mailto:quotes@moonsteelfab.com">
              quotes@moonsteelfab.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

