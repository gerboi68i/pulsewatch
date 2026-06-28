import { ImageResponse } from "next/og";

export const alt = "PulseWatch - Uptime and status monitoring for developers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          backgroundImage:
            "radial-gradient(circle at 22% 12%, rgba(16,185,129,0.25), transparent 55%)",
          color: "#e8eef7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "22px" }}>
          <div
            style={{
              display: "flex",
              width: "76px",
              height: "76px",
              borderRadius: "20px",
              backgroundColor: "rgba(16,185,129,0.15)",
              border: "2px solid rgba(16,185,129,0.4)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12h4l2 6 4-14 2 8h6" />
            </svg>
          </div>
          <div style={{ display: "flex", fontSize: "46px", fontWeight: 700 }}>PulseWatch</div>
        </div>

        <div style={{ display: "flex", fontSize: "72px", fontWeight: 800, lineHeight: 1.05, marginTop: "52px", maxWidth: "920px" }}>
          Know the second your site goes down.
        </div>

        <div style={{ display: "flex", fontSize: "30px", color: "#8a97a8", marginTop: "30px" }}>
          Open-source uptime and status monitoring for developers.
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginTop: "46px" }}>
          <div style={{ display: "flex", width: "16px", height: "16px", borderRadius: "9999px", backgroundColor: "#34d399" }} />
          <div style={{ display: "flex", fontSize: "26px", color: "#34d399", fontWeight: 600 }}>All systems operational</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
