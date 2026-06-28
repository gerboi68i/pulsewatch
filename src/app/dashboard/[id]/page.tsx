import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { checkNow, setMonitorPublic } from "@/lib/monitor-actions";
import { ResponseChart } from "@/components/chart";

export const dynamic = "force-dynamic";

function intervalLabel(s: number) {
  if (s % 3600 === 0) return s / 3600 + " h";
  if (s % 60 === 0) return s / 60 + " min";
  return s + " s";
}
function fmt(d: Date) {
  return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
function dur(a: Date, b: Date) {
  const m = Math.max(1, Math.round((b.getTime() - a.getTime()) / 60000));
  if (m < 60) return m + "m";
  return Math.floor(m / 60) + "h " + (m % 60) + "m";
}

export default async function MonitorDetail({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const { id } = await params;

  const m = await prisma.monitor.findFirst({
    where: { id, userId: user.id },
    include: {
      checks: { orderBy: { checkedAt: "desc" }, take: 100 },
      incidents: { orderBy: { startedAt: "desc" }, take: 10 },
    },
  });
  if (!m) notFound();

  const checks = m.checks;
  const chrono = [...checks].reverse();
  const last = checks[0];
  const up = last ? last.up : undefined;
  const total = checks.length;
  const uptime = total ? (checks.filter((c) => c.up).length / total) * 100 : null;
  const lat = checks.map((c) => c.responseTimeMs).filter((x): x is number => typeof x === "number");
  const avg = lat.length ? Math.round(lat.reduce((a, b) => a + b, 0) / lat.length) : null;
  const fastest = lat.length ? Math.min(...lat) : null;
  const slowest = lat.length ? Math.max(...lat) : null;

  const label = up === undefined ? "Pending" : up ? "Up" : "Down";
  const dot = up === undefined ? "bg-slate-500" : up ? "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]";
  const pill = up === undefined ? "bg-slate-500/15 text-slate-400" : up ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400";

  const stats = [
    { label: "Status", value: label },
    { label: "Uptime", value: uptime != null ? uptime.toFixed(2) + "%" : "-" },
    { label: "Avg response", value: avg != null ? avg + " ms" : "-" },
    { label: "Range", value: fastest != null ? `${fastest} - ${slowest} ms` : "-" },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#04070d] text-slate-200">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="aurora left-1/2 top-[-160px] h-[360px] w-[680px] -translate-x-1/2 bg-emerald-500/15" />
        <div className="absolute inset-0 bg-grid opacity-60" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#04070d]/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            Back to dashboard
          </Link>
          <span className="hidden text-sm text-slate-500 sm:inline">{user.email}</span>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className={"mt-1.5 h-3 w-3 shrink-0 rounded-full " + dot} />
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold tracking-tight text-white">{m.name}</h1>
              <a href={m.url} target="_blank" rel="noreferrer" className="break-all text-sm text-slate-500 transition hover:text-emerald-400">{m.url}</a>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className={"rounded-full px-3 py-1 text-xs font-medium " + pill}>{label}</span>
            <form action={setMonitorPublic}>
              <input type="hidden" name="id" value={m.id} />
              <input type="hidden" name="public" value={m.isPublic ? "0" : "1"} />
              <button className={"rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm transition hover:bg-white/10 " + (m.isPublic ? "text-emerald-400" : "text-slate-300")}>{m.isPublic ? "Public" : "Private"}</button>
            </form>
            <form action={checkNow}>
              <input type="hidden" name="id" value={m.id} />
              <button className="rounded-lg bg-emerald-500 px-3.5 py-1.5 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400">Check now</button>
            </form>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/10 bg-slate-900/40 px-5 py-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">{s.label}</p>
              <p className="mt-1 text-xl font-semibold text-white">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/40 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white">Response time</h2>
            <span className="text-xs text-slate-500">last {chrono.length} checks &middot; every {intervalLabel(m.intervalSeconds)}</span>
          </div>
          <div className="mt-4">
            <ResponseChart data={chrono} />
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
            <h2 className="font-semibold text-white">Recent checks</h2>
            <table className="mt-4 w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="pb-2 font-medium">Time</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 text-right font-medium">Code</th>
                  <th className="pb-2 text-right font-medium">Response</th>
                </tr>
              </thead>
              <tbody>
                {checks.slice(0, 12).map((c) => (
                  <tr key={c.id} className="border-t border-white/5">
                    <td className="py-2 text-slate-400">{fmt(c.checkedAt)}</td>
                    <td className="py-2"><span className={c.up ? "text-emerald-400" : "text-red-400"}>{c.up ? "Up" : "Down"}</span></td>
                    <td className="py-2 text-right font-mono text-slate-500">{c.statusCode ?? "-"}</td>
                    <td className="py-2 text-right font-mono text-slate-400">{c.responseTimeMs != null ? c.responseTimeMs + " ms" : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6">
            <h2 className="font-semibold text-white">Incident history</h2>
            {m.incidents.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">No incidents recorded. Nice and stable.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {m.incidents.map((inc) => (
                  <li key={inc.id} className="rounded-xl border border-white/10 bg-slate-950/40 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white">{inc.cause ?? "Downtime detected"}</span>
                      <span className={"rounded-full px-2 py-0.5 text-xs font-medium " + (inc.resolvedAt ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400")}>{inc.resolvedAt ? "Resolved" : "Ongoing"}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{fmt(inc.startedAt)}{inc.resolvedAt ? ` \u00b7 lasted ${dur(inc.startedAt, inc.resolvedAt)}` : ""}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
