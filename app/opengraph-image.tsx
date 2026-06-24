import { ImageResponse } from "next/og";

export const alt = "Tom Laroc — Design-led AI Strategy & Creative Direction";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(60% 80% at 30% 20%, #2a1a55 0%, #07070b 60%)",
          padding: "72px",
          color: "#f4f1ea",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: 2,
            }}
          >
            TOM LAROC
          </div>
          <div style={{ fontSize: 18, color: "#8b6cff", letterSpacing: 4 }}>
            HI-FI-AI
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>
            AI that never
          </div>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, color: "#8b6cff" }}>
            looks like AI.
          </div>
        </div>

        <div style={{ fontSize: 26, color: "#a9adba" }}>
          Design-led AI strategy &amp; creative direction · South Beach, Miami
        </div>
      </div>
    ),
    { ...size }
  );
}
