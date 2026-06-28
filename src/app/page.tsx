import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { HeroCard } from "@/components/hero-card";

const features = [
  { t: "Round-the-clock checks", d: "Every monitor is pinged on a schedule. We record status, status code, and response time on every single check.", p: "M12 7v5l3 2" },
  { t: "Instant incidents", d: "The moment an endpoint fails, PulseWatch opens an incident and timestamps the downtime, so you know exactly what happened and when.", p: "M12 9v4m0 4h.01" },
  { t: "Public status pages", d: "Share a clean, branded status page so your users always know whether the problem is you or them.", p: "M4 6h16M4 12h16M4 18h10" },
  { t: "Response-time history", d: "See latency trends with clear charts and catch slowdowns long before they turn into outages.", p: "M3 17l6-6 4 4 7-7" },
];

const steps = [
  { s: "01", t: "Add your URL", d: "Paste any website or API endpoint and pick how often to check it." },
  { s: "02", t: "We watch it 24/7", d: "PulseWatch runs scheduled checks from the cloud and stores every result." },
  { s: "03", t: "Alert and share", d: "Track incidents and uptime in your dashboard, then publish a status page." },
];

const chips = ["Cloud-scheduled checks", "Open source", "Self-hostable", "Public status pages", "Response-time charts"];

const uptime = Array.from({ length: 46 }, (_, i) => (i === 19 ? "down" : i === 33 || i === 34 ? "warn" : "up"));

function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12h4l2 6 4-14 2 8h6" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#04070d] text-slate-200 antialiased">
      {/* animated background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="aurora left-1/2 top-[-140px] h-[440px] w-[720px] -translate-x-1/2 bg-emerald-500/30" />
        <div className="aurora right-[-120px] top-[180px] h-[380px] w-[440px] bg-teal-500/20" style={{ animationDelay: "-6s" }} />
        <div className="aurora left-[-140px] top-[560px] h-[340px] w-[440px] bg-cyan-500/15" style={{ animationDelay: "-11s" }} />
        <div className="absolute inset-0 bg-grid" />
      </div>

      {/* header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#04070d]/70 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 ring-1 ring-emerald-500/30">
              <Logo className="h-5 w-5 text-emerald-400" />
            </span>
            <span className="text-lg font-semibold tracking-tight text-white">PulseWatch</span>
          </div>
          <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#how" className="transition hover:text-white">How it works</a>
            <a href="#status" className="transition hover:text-white">Status pages</a>
            <Link href="/login" className="transition hover:text-white">Sign in</Link>
          </div>
          <Link href="/signup" className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400">
            Start free
          </Link>
        </nav>
      </header>

      {/* hero */}
      <section className="relative">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-20 md:grid-cols-2 md:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 fade-in">
              <span className="ping-dot relative flex h-1.5 w-1.5"><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" /></span>
              Uptime monitoring, simplified
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl fade-in" style={{ animationDelay: "80ms" }}>
              Know the second<br /><span className="text-gradient">your site goes down.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400 fade-in" style={{ animationDelay: "160ms" }}>
              PulseWatch checks your websites and APIs around the clock, opens an incident the moment something breaks, and gives your users a status page they can trust.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 fade-in" style={{ animationDelay: "240ms" }}>
              <Link href="/signup" className="group relative rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400 hover:shadow-emerald-500/40">
                Start monitoring free
              </Link>
              <a href="#how" className="rounded-lg border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/10">
                See how it works
              </a>
            </div>
            <p className="mt-4 text-xs text-slate-500 fade-in" style={{ animationDelay: "320ms" }}>No credit card needed. Free tier included.</p>
          </div>
          <div className="fade-in" style={{ animationDelay: "200ms" }}>
            <HeroCard />
          </div>
        </div>

        {/* value chips */}
        <div className="mx-auto max-w-6xl px-6 pb-8">
          <Reveal className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            {chips.map((c) => (
              <span key={c} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-slate-400">{c}</span>
            ))}
          </Reveal>
        </div>
      </section>

      {/* features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <Reveal>
          <h2 className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">Everything you need to stay online</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">Built for developers who would rather hear it from a dashboard than from an angry user.</p>
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.t} delay={i * 90}>
              <div className="card-hover group h-full rounded-2xl border border-white/10 bg-slate-900/40 p-6 hover:border-emerald-500/40 hover:bg-slate-900/70 hover:shadow-2xl hover:shadow-emerald-500/10">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/25 to-teal-500/10 ring-1 ring-emerald-500/30 transition group-hover:ring-emerald-400/60">
                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={f.p} /></svg>
                </span>
                <h3 className="mt-5 font-semibold text-white">{f.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* how it works */}
      <section id="how" className="border-y border-white/5 bg-white/[0.015]">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <Reveal>
            <h2 className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">Live in under a minute</h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-slate-400">Three steps from a bare URL to a monitored, shareable status page.</p>
          </Reveal>
          <div className="relative mt-14 grid gap-8 md:grid-cols-3">
            <div className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent md:block" />
            {steps.map((st, i) => (
              <Reveal key={st.s} delay={i * 120}>
                <div className="relative rounded-2xl border border-white/10 bg-slate-950/60 p-6">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/30 bg-slate-950 font-mono text-sm font-semibold text-emerald-400">{st.s}</span>
                  <h3 className="mt-5 text-lg font-semibold text-white">{st.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{st.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* status page preview */}
      <section id="status" className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Public status pages</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">A status page your users can trust.</h2>
            <p className="mt-4 max-w-lg text-slate-400">Publish a clean, real-time status page on your own link. Every check, uptime percentage, and past incident, laid out so support tickets answer themselves.</p>
            <Link href="/signup" className="mt-7 inline-block rounded-lg border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-emerald-500/40 hover:bg-white/10">Publish your status page</Link>
          </Reveal>
          <Reveal delay={120}>
            <div className="glow-soft rounded-2xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/15"><span className="h-2 w-2 rounded-full bg-emerald-400" /></span>
                  <span className="font-medium text-white">Acme Inc</span>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-400">Operational</span>
              </div>
              {["API", "Web App", "CDN"].map((s, r) => (
                <div key={s} className="mt-5 first:mt-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{s}</span>
                    <span className="font-mono text-xs text-slate-500">{(99.9 - r * 0.07).toFixed(2)}%</span>
                  </div>
                  <div className="mt-2 flex items-end gap-[3px]">
                    {uptime.map((u, i) => (
                      <span
                        key={i}
                        className={`bar-grow h-7 flex-1 rounded-[2px] ${u === "down" && r === 1 ? "bg-red-500/70" : u === "warn" && r === 0 ? "bg-amber-400/70" : "bg-emerald-500/45"}`}
                        style={{ animationDelay: `${i * 12 + r * 80}ms` }}
                      />
                    ))}
                  </div>
                </div>
              ))}
              <p className="mt-5 font-mono text-[11px] text-slate-500">last 46 days</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <Reveal>
          <div className="glow-emerald relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-slate-900/40 to-slate-900/40 px-6 py-16 text-center">
            <div className="aurora left-1/2 top-0 h-[200px] w-[400px] -translate-x-1/2 bg-emerald-500/20" />
            <h2 className="relative text-3xl font-bold tracking-tight text-white sm:text-4xl">Ship with confidence.</h2>
            <p className="relative mx-auto mt-4 max-w-xl text-slate-300">Start monitoring your first endpoint in seconds. Know about downtime before your users do.</p>
            <Link href="/signup" className="relative mt-8 inline-block rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400 hover:shadow-emerald-500/50">
              Create your free account
            </Link>
          </div>
        </Reveal>
      </section>

      {/* footer */}
      <footer className="border-t border-white/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 sm:flex-row">
          <div className="flex items-center gap-2">
            <Logo className="h-4 w-4 text-emerald-400" />
            <span className="font-medium text-slate-300">PulseWatch</span>
            <span className="ml-2 text-sm text-slate-600">Uptime and status monitoring for developers.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <a href="#features" className="transition hover:text-white">Features</a>
            <a href="#status" className="transition hover:text-white">Status pages</a>
            <a href="https://github.com/gerboi68i/pulsewatch" className="transition hover:text-white">GitHub</a>
            <Link href="/login" className="transition hover:text-white">Sign in</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
