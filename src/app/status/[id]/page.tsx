import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function fmt(d: Date) {
  return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}
function dur(a: Date, b: Date) {
  const m = Math.max(1, Math.round((b.getTime() - a.getTime()) / 60000));
  if (m < 60) return m + "m";
  return Math.floor(m / 60) + "h " + (m % 60) + "m";
}

export default async function StatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id }, select: { id: true, name: true } });
  if (!user) notFound();

  const monitors = await prisma.monitor.findMany({
    where: { userId: id, isPublic: true },
    orderBy: { createdAt: "asc" },
    include: {
      checks: { orderBy: { checkedAt: "desc" }, take: 45 },
      incidents: { orderBy: { startedAt: "desc" }, take: 5 },
    },
  });

  const rows = monitors.map((m) => {
    const last = m.checks[0];
    const up = last ? last.up : undefined;
    const total = m.checks.length;
    const uptime = total ? (m.checks.filter((c) => c.up).length / total) * 100 : null;
    const bars = [...m.checks].reverse();
    return { m, up, uptime, bars, last };
  });

  const anyDown = rows.some((r) => r.up === false);
  const allUp = rows.length > 0 && rows.every((r) => r.up === true);
  const status = allUp
    ? { t: "All systems operational", tone: "emerald" }
    : anyDown
    ? { t: "Active incident in progress", tone: "red" }
    : rows.length === 0
    ? { t: "No public monitors yet", tone: "slate" }
    : { t: "Partial degradation", tone: "amber" };

  const toneMap: Record<string, { dot: string; text: string; ring: string; bg: string }> = {
    emerald: { dot: "bg-emerald-400", text: "text-emerald-300", ring: "ring-emerald-500/30", bg: "from-emerald-500/15" },
    amber: { dot: "bg-amber-400", text: "text-amber-300", ring: "ring-amber-500/30", bg: "from-amber-500/15" },
    red: { dot: "bg-red-400", text: "text-red-300", ring: "ring-red-500/30", bg: "from-red-500/15" },
    slate: { dot: "bg-slate-400", text: "text-slate-300", ring: "ring-slate-500/30", bg: "from-slate-500/10" },
  };
  const tone = toneMap[status.tone];

  const incidents = monitors
    .flatMap((m) => m.incidents.map((i) => ({ ...i, monitor: m.name })))
    .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
    .slice(0, 6);

  const brand = user.name && user.name.length > 0 ? user.name : "Service";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#04070d] text-slate-200">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className={`aurora left-1/2 top-[-160px] h-[380px] w-[680px] -translate-x-1/2 ${status.tone === "emerald" ? "bg-emerald-500/20" : status.tone === "red" ? "bg-red-500/20" : "bg-amber-500/20"}`} />
        <div className="absolute inset-0 bg-grid opacity-60" />
      </div>

      <div className="mx-auto max-w-3xl px-6 py-14">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 ring-1 ring-emerald-500/30">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h4l2 6 4-14 2 8h6" /></svg>
            </span>
            <span className="font-semibold tracking-tight text-white">{brand}</span>
          </div>
          <span className="text-xs text-slate-500">Status</span>
        </div>

        {/* overall banner */}
        <div className={`mt-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-gradient-to-r ${tone.bg} to-transparent px-5 py-5 ring-1 ring-inset ${tone.ring}`}>
          <span className="relative flex h-3 w-3">
            <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${tone.dot} opacity-60`} />
            <span className={`relative inline-flex h-3 w-3 rounded-full ${tone.dot}`} />
          </span>
          <h1 className={`text-xl font-semibold ${tone.text}`}>{status.t}</h1>
        </div>

        {/* monitors */}
        <div className="mt-8 space-y-4">
          {rows.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/30 p-12 text-center text-sm text-slate-500">
              This page has no public monitors yet.
            </div>
          ) : (
            rows.map(({ m, up, uptime, bars }) => {
              const label = up === undefined ? "Pending" : up ? "Operational" : "Down";
              const pill = up === undefined ? "bg-slate-500/15 text-slate-400" : up ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400";
              return (
                <div key={m.id} className="rounded-2xl border border-white/10 bg-slate-900/40 p-5">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-white">{m.name}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${pill}`}>{label}</span>
                  </div>
                  <div className="mt-4 flex items-end gap-[3px]">
                    {bars.map((c, i) => (
                      <span
                        key={i}
                        title={`${fmt(c.checkedAt)} - ${c.up ? (c.responseTimeMs ?? "") + " ms" : "down"}`}
                        className={`h-8 flex-1 rounded-[2px] ${c.up ? "bg-emerald-500/45" : "bg-red-500/70"}`}
                      />
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>{bars.length} recent checks</span>
                    <span className="font-mono">{uptime != null ? uptime.toFixed(2) + "% uptime" : "-"}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* incidents */}
        {incidents.length > 0 ? (
          <div className="mt-10">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-500">Recent incidents</h2>
            <ul className="mt-4 space-y-3">
              {incidents.map((inc) => (
                <li key={inc.id} className="rounded-xl border border-white/10 bg-slate-900/30 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">{inc.monitor}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${inc.resolvedAt ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
                      {inc.resolvedAt ? "Resolved" : "Ongoing"}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {inc.cause ?? "Downtime detected"} &middot; {fmt(inc.startedAt)}
                    {inc.resolvedAt ? ` \u00b7 lasted ${dur(inc.startedAt, inc.resolvedAt)}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <footer className="mt-12 flex items-center justify-center gap-1.5 text-xs text-slate-600">
          Powered by
          <Link href="/" className="flex items-center gap-1 font-medium text-slate-400 transition hover:text-emerald-400">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h4l2 6 4-14 2 8h6" /></svg>
            PulseWatch
          </Link>
        </footer>
      </div>
    </main>
  );
}
