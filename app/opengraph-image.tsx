import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name}: property management in ${siteConfig.areasPhrase}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#12263f", color: "#fff", padding: 80 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
          <div style={{ width: 44, height: 96, background: "#e2b35a" }} />
          <div style={{ width: 56, height: 132, background: "#f7f6f1" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05 }}>Property management that fights for your asset.</div>
          <div style={{ marginTop: 28, fontSize: 34, color: "#b7c2d0" }}>
            {`${siteConfig.name} · ${siteConfig.areasPhrase.replace(/, | and /g, " · ")}`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
