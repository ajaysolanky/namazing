import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Namazing — AI Baby Name Consultation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f5efe6 0%, #fceef0 40%, #e8dfd4 70%, #d7e3d4 100%)",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              color: "#1f2933",
              letterSpacing: "-2px",
            }}
          >
            Namazing
          </div>
        </div>

        {/* Terracotta accent line */}
        <div
          style={{
            width: 120,
            height: 4,
            borderRadius: 2,
            background: "#c4704b",
            marginBottom: 24,
          }}
        />

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            color: "#1f2933",
            opacity: 0.7,
            fontStyle: "italic",
          }}
        >
          Find the perfect name for your little one
        </div>

        {/* Subtle bottom descriptor */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 20,
            color: "#1f2933",
            opacity: 0.4,
            fontFamily: "sans-serif",
            letterSpacing: "2px",
            textTransform: "uppercase" as const,
          }}
        >
          AI-Powered Baby Name Consultation
        </div>
      </div>
    ),
    { ...size },
  );
}
