export function ResponseChart({
  data,
  height = 240,
}: {
  data: { responseTimeMs: number | null; up: boolean }[];
  height?: number;
}) {
  if (data.length < 2) {
    return (
      <div
        className="flex items-center justify-center rounded-xl border border-dashed border-white/10 bg-slate-950/40 text-sm text-slate-600"
        style={{ height }}
      >
        Not enough data yet. Run a few checks to see the response-time trend.
      </div>
    );
  }
  const W = 920;
  const H = height;
  const padL = 46;
  const padR = 10;
  const padY = 18;
  const max = Math.max(1, ...data.map((d) => d.responseTimeMs ?? 0));
  const plotW = W - padL - padR;
  const nx = (i: number) => padL + (i / (data.length - 1)) * plotW;
  const ny = (v: number) => H - padY - (v / max) * (H - padY * 2);
  const line = data
    .map((d, i) => `${i === 0 ? "M" : "L"}${nx(i).toFixed(1)},${ny(d.responseTimeMs ?? 0).toFixed(1)}`)
    .join(" ");
  const area = `${line} L${(W - padR).toFixed(1)},${H - padY} L${padL},${H - padY} Z`;
  const grid = [0, 0.25, 0.5, 0.75, 1];
  const lastX = nx(data.length - 1);
  const lastY = ny(data[data.length - 1].responseTimeMs ?? 0);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Response time over recent checks">
      <defs>
        <linearGradient id="rc-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
      </defs>
      {grid.map((g) => {
        const y = padY + g * (H - padY * 2);
        return (
          <g key={g}>
            <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="rgba(255,255,255,0.06)" />
            <text x={padL - 10} y={y + 4} textAnchor="end" fontSize="12" fill="#64748b" fontFamily="ui-monospace, monospace">
              {Math.round(max * (1 - g))}
            </text>
          </g>
        );
      })}
      {data.map((d, i) =>
        !d.up ? <line key={i} x1={nx(i)} y1={padY} x2={nx(i)} y2={H - padY} stroke="rgba(248,113,113,0.45)" strokeWidth="2" /> : null
      )}
      <path d={area} fill="url(#rc-area)" />
      <path d={line} fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r="4" fill="#34d399" />
    </svg>
  );
}
