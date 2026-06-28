import { ImageResponse } from "next/og";
import { prisma } from "@/lib/db";

export const alt = "Status page";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function StatusOg({ params }: { params: Promise<{ id: string }> }) {
  let brand = "Service";
  let statusText = "Status page";
  let allUp = true;
  let count = 0;
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({ where: { id }, select: { name: true } });
    if (user?.name) brand = user.name;
    const monitors = await prisma.monitor.findMany({
      where: { userId: id, isPublic: true },
      include: { checks: { orderBy: { checkedAt: "desc" }, take: 1 } },
    });
    count = monitors.length;
    const ups = monitors.map((m) => m.checks[0]?.up);
    allUp = ups.length > 0 && ups.every((u) => u === true);
    statusText = ups.length === 0 ? "Status page" : allUp ? "All systems operational" : "Active incident in progress";
  } catch {
    // fall back to defaults
  }
  const color = allUp ? "#34d399" : "#f87171";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "90px",
          backgroundColor: "#04070d",
          backgroundImage: `radial-gradient(circle at 22% 12%, ${allUp ? "rgba(16,185,129,0.25)" : "rgba(248,113,113,0.22)"}, transparent 55%)`,
          color: "#e8eef7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              width: "68px",
              height: "68px",
              borderRadius: "18px",
              backgroundColor: "rgba(16,185,129,0.15)",
              border: "2px solid rgba(16,185,129,0.4)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12h4l2 6 4-14 2 8h6" />
            </svg>
          </div>
          <div style={{ display: "flex", fontSize: "36px", color: "#8a97a8" }}>PulseWatch status</div>
        </div>

        <div style={{ display: "flex", fontSize: "76px", fontWeight: 800, marginTop: "44px" }}>{brand}</div>

        <div style={{ display: "flex", alignItems: "center", gap: "18px", marginTop: "36px" }}>
          <div style={{ display: "flex", width: "22px", height: "22px", borderRadius: "9999px", backgroundColor: color }} />
          <div style={{ display: "flex", fontSize: "40px", fontWeight: 600, color }}>{statusText}</div>
        </div>

        {count > 0 ? (
          <div style={{ display: "flex", fontSize: "26px", color: "#64748b", marginTop: "28px" }}>{count} monitored {count === 1 ? "service" : "services"}</div>
        ) : (
          <div style={{ display: "flex" }} />
        )}
      </div>
    ),
    { ...size }
  );
}
