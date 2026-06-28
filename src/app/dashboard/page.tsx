import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { logout } from "@/lib/actions";
import { prisma } from "@/lib/db";
import { createMonitor, deleteMonitor, checkNow, checkAll, setMonitorPublic } from "@/lib/monitor-actions";
import { Reveal } from "@/components/reveal";
import { Sparkline } from "@/components/sparkline";

function intervalLabel(s: number) {
  if (s % 3600 === 0) return s / 3600 + " h";
  if (s % 60 === 0) return s / 60 + " min";
  return s + " s";
}

const statIcons: Record<string, string> = {
  Monitors: "M4 6h16M4 12h16M4 18h10",
  "Up now": "M5 13l4 4L19 7",
  "Overall uptime": "M3 17l6-6 4 4 7-7",
  "Avg response": "M13 2L3 14h7v8l8-12h-7z",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const monitors = await prisma.monitor.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { checks: { orderBy: { checkedAt: "desc" }, take: 50 } },
  });

  const rows = monitors.map((m) => {
    const checks = m.checks;
    const last = checks[0];
    const up = last ? last.up : undefined;
    const total = checks.length;
    const upCount = checks.filter((c) => c.up).length;
    const uptime = total > 0 ? (upCount / total) * 100 : null;
    const spark = checks.slice(0, 24).reverse();
    const maxMs = Math.max(1, ...spark.map((c) => c.responseTimeMs ?? 0));
    return { m, last, up, uptime, spark, maxMs };
  });

  const upNow = rows.filter((r) => r.up).length;
  const overall = rows.length ? rows.reduce((s, r) => s + (r.uptime ?? 100), 0) / rows.length : null;
  const latencies = rows.map((r) => r.last?.responseTimeMs).filter((x): x is number => typeof x === "number");
  const avgMs = latencies.length ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : null;

  const stats = [
    { label: "Monitors", value: String(monitors.length) },
    { label: "Up now", value: upNow + " / " + monitors.length },
    { label: "Overall uptime", value: overall != null ? overall.toFixed(1) + "%" : "-" },
    { label: "Avg response", value: avgMs != null ? avgMs + " ms" : "-" },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#04070d] text-slate-200">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="aurora left-1/2 top-[-160px] h-[360px] w-[680px] -translate-x-1/2 bg-emerald-500/15" />
        <div className="absolute inset-0 bg-grid opacity-60" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#04070d]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5 text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 ring-1 ring-emerald-500/30">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h4l2 6 4-14 2 8h6" /></svg>
            </span>
            <span className="font-semibold tracking-tight">PulseWatch</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-400 sm:inline">{user.email}</span>
            <form action={logout}>
              <button type="submit" className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-300 transition hover:border-white/20 hover:bg-white/10">Sign out</button>
            </form>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">Monitors</h1>
            <p className="mt-1 text-sm text-slate-400">Track uptime and response time for your sites and APIs.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/status/${user.id}`} target="_blank" className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-slate-200 transition hover:border-emerald-500/40 hover:bg-white/10">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>
              Status page
            </Link>
            {monitors.length > 0 ? (
              <form action={checkAll}>
                <button type="submit" className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-slate-200 transition hover:border-emerald-500/40 hover:bg-white/10">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" /></svg>
                  Check all now
                </button>
              </form>
            ) : null}
          </div>
        </div>

        {monitors.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 80}>
                <div className="card-hover rounded-2xl border border-white/10 bg-slate-900/40 p-5 hover:border-emerald-500/30">
                  <div className="flex items-center gap-2 text-slate-500">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-400/80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={statIcons[s.label]} /></svg>
                    <p className="text-xs uppercase tracking-wide">{s.label}</p>
                  </div>
                  <p className="mt-2 text-2xl font-semibold text-white">{s.value}</p>
                </div>
              </Reveal>
            ))}
          </div>
        ) : null}

        <form action={createMonitor} className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/40 p-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="url" className="block text-xs text-slate-400">URL</label>
            <input id="url" name="url" required placeholder="https://example.com" className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />
          </div>
          <div className="sm:w-44">
            <label htmlFor="name" className="block text-xs text-slate-400">Name (optional)</label>
            <input id="name" name="name" placeholder="My API" className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" />
          </div>
          <div className="sm:w-32">
            <label htmlFor="interval" className="block text-xs text-slate-400">Check every</label>
            <select id="interval" name="interval" defaultValue="300" className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20">
              <option value="60">1 min</option>
              <option value="300">5 min</option>
              <option value="600">10 min</option>
            </select>
          </div>
          <button type="submit" className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400">Add monitor</button>
        </form>

        {monitors.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-white/10 bg-slate-900/30 p-14 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/25">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h4l2 6 4-14 2 8h6" /></svg>
            </span>
            <p className="mt-4 text-slate-200">No monitors yet.</p>
            <p className="mt-1 text-sm text-slate-500">Add your first endpoint above to start tracking uptime.</p>
          </div>
        ) : (
          <ul className="mt-8 space-y-3">
            {rows.map(({ m, last, up, uptime, spark, maxMs }, i) => {
              const label = up === undefined ? "Pending" : up ? "Up" : "Down";
              const dot = up === undefined ? "bg-slate-500" : up ? "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]";
              const pill = up === undefined ? "bg-slate-500/15 text-slate-400" : up ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400";
              return (
                <Reveal key={m.id} delay={i * 60}>
                  <li className="card-hover flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/40 px-5 py-4 hover:border-white/20">
                    <Link href={`/dashboard/${m.id}`} className="group/row flex min-w-0 items-center gap-3">
                      <span className={"h-2.5 w-2.5 shrink-0 rounded-full " + dot} />
                      <div className="min-w-0">
                        <p className="font-medium text-white transition group-hover/row:text-emerald-400">{m.name}</p>
                        <p className="truncate text-xs text-slate-500">{m.url}</p>
                      </div>
                    </Link>
                    <div className="flex items-center gap-5 text-sm">
                      {spark.length > 1 ? (
                        <span className="hidden lg:block"><Sparkline data={spark} maxMs={maxMs} id={m.id} /></span>
                      ) : null}
                      <span className={"rounded-full px-2.5 py-0.5 text-xs font-medium " + pill}>{label}</span>
                      <span className="hidden w-12 text-right text-slate-300 sm:inline">{uptime != null ? uptime.toFixed(1) + "%" : "-"}</span>
                      {last && last.responseTimeMs != null ? <span className="hidden w-16 text-right font-mono text-xs text-slate-500 md:inline">{last.responseTimeMs} ms</span> : <span className="hidden w-16 md:inline" />}
                      <span className="hidden text-xs text-slate-600 lg:inline">every {intervalLabel(m.intervalSeconds)}</span>
                      <form action={setMonitorPublic}>
                        <input type="hidden" name="id" value={m.id} />
                        <input type="hidden" name="public" value={m.isPublic ? "0" : "1"} />
                        <button type="submit" title="Toggle on your public status page" className={"text-xs transition " + (m.isPublic ? "text-emerald-400 hover:text-emerald-300" : "text-slate-500 hover:text-slate-300")}>{m.isPublic ? "Public" : "Private"}</button>
                      </form>
                      <form action={checkNow}>
                        <input type="hidden" name="id" value={m.id} />
                        <button type="submit" className="text-xs font-medium text-emerald-400 transition hover:text-emerald-300">Check now</button>
                      </form>
                      <form action={deleteMonitor}>
                        <input type="hidden" name="id" value={m.id} />
                        <button type="submit" className="text-xs text-slate-500 transition hover:text-red-400">Delete</button>
                      </form>
                    </div>
                  </li>
                </Reveal>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
