"use client";

import { useEffect, useState } from "react";

const monitors = [
  { n: "api.acme.com", ms: 142, up: "99.98%" },
  { n: "acme.com", ms: 88, up: "100%" },
  { n: "dashboard.acme.com", ms: 210, up: "99.91%" },
];

const points = [44, 52, 41, 60, 47, 70, 54, 63, 50, 78, 58, 72, 55, 84, 61, 76];

export function HeroCard() {
  const [secs, setSecs] = useState(2);
  useEffect(() => {
    const t = setInterval(() => setSecs((s) => (s >= 12 ? 1 : s + 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const W = 340;
  const H = 96;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const nx = (i: number) => (i / (points.length - 1)) * W;
  const ny = (v: number) => H - 8 - ((v - min) / (max - min || 1)) * (H - 20);
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${nx(i).toFixed(1)},${ny(p).toFixed(1)}`).join(" ");
  const area = `${line} L${W},${H} L0,${H} Z`;
  const lastX = nx(points.length - 1);
  const lastY = ny(points[points.length - 1]);

  return (
    <div className="relative animate-float">
      <div className="absolute -inset-3 rounded-[28px] bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent blur-2xl" />
      <div className="glow-soft relative rounded-2xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="ping-dot relative flex h-2.5 w-2.5">
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            <span className="font-medium text-white">All systems operational</span>
          </div>
          <span className="font-mono text-xs text-slate-500">updated {secs}s ago</span>
        </div>

        <ul className="mt-4 space-y-2.5">
          {monitors.map((m, i) => (
            <li
              key={m.n}
              className="fade-in flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2.5 ring-1 ring-inset ring-white/5"
              style={{ animationDelay: `${300 + i * 130}ms` }}
            >
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <span className="text-sm text-slate-200">{m.n}</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="font-mono text-slate-500">{m.ms} ms</span>
                <span className="font-medium text-emerald-400">{m.up}</span>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4 rounded-lg bg-white/[0.02] p-3 ring-1 ring-inset ring-white/5">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-24 w-full overflow-visible" preserveAspectRatio="none">
            <defs>
              <linearGradient id="hcArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="hcLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#2dd4bf" />
              </linearGradient>
            </defs>
            <path d={area} fill="url(#hcArea)" className="fade-in" style={{ animationDelay: "700ms" }} />
            <path
              d={line}
              fill="none"
              stroke="url(#hcLine)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              className="draw-line"
            />
            <circle cx={lastX} cy={lastY} r="3.5" fill="#34d399" className="fade-in" style={{ animationDelay: "1900ms" }} />
            <circle cx={lastX} cy={lastY} r="3.5" fill="none" stroke="#34d399" strokeWidth="2" className="fade-in" style={{ animationDelay: "1900ms" }}>
              <animate attributeName="r" from="3.5" to="11" dur="1.8s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.7" to="0" dur="1.8s" repeatCount="indefinite" />
            </circle>
          </svg>
          <p className="mt-1 font-mono text-[11px] text-slate-500">response time, last 16 checks</p>
        </div>
      </div>
    </div>
  );
}
