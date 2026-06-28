import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#04070d] px-6 text-slate-200">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="aurora left-1/2 top-[-120px] h-[400px] w-[600px] -translate-x-1/2 bg-emerald-500/20" />
        <div className="absolute inset-0 bg-grid opacity-60" />
      </div>
      <div className="fade-in text-center">
        <Link href="/" className="mb-8 inline-flex items-center gap-2.5 text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 ring-1 ring-emerald-500/30">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h4l2 6 4-14 2 8h6" /></svg>
          </span>
          <span className="text-lg font-semibold tracking-tight">PulseWatch</span>
        </Link>
        <p className="text-7xl font-bold text-gradient">404</p>
        <h1 className="mt-4 text-xl font-semibold text-white">This page is offline.</h1>
        <p className="mx-auto mt-2 max-w-sm text-slate-400">The page you are looking for does not exist or has moved.</p>
        <Link href="/" className="mt-8 inline-block rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400">
          Back to home
        </Link>
      </div>
    </main>
  );
}
