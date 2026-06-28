export function Sparkline({
  data,
  maxMs,
  id,
  width = 150,
  height = 38,
}: {
  data: { up: boolean; responseTimeMs: number | null }[];
  maxMs: number;
  id: string;
  width?: number;
  height?: number;
}) {
  if (data.length < 2) return <div style={{ width, height }} />;
  const step = width / (data.length - 1);
  const y = (ms: number | null) => height - 3 - ((ms ?? 0) / Math.max(1, maxMs)) * (height - 8);
  const pts = data.map((c, i) => [i * step, y(c.responseTimeMs)] as const);
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${width.toFixed(1)},${height} L0,${height} Z`;
  const downIdx = data.map((c, i) => (c.up ? -1 : i)).filter((i) => i >= 0);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#spark-${id})`} />
      <path d={line} fill="none" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {downIdx.map((i) => (
        <circle key={i} cx={(i * step).toFixed(1)} cy={height - 3} r="2.2" fill="#f87171" />
      ))}
    </svg>
  );
}
