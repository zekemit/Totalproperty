import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getContent } from "@/lib/cms/content";

export const alt = "Total Property Management";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const { site } = await getContent();
  const mark = await readFile(path.join(process.cwd(), "public", "photos", "tpm-mark-og.png"));
  const src = `data:image/png;base64,${mark.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", gap: 64, background: "#101927", color: "#ece6da", padding: "0 88px" }}>
        <img src={src} width={300} height={409} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 28, color: "#ddb56a", letterSpacing: 1 }}>{`${site.place} · ${site.areasPhraseAmp}`}</div>
          <div style={{ marginTop: 16, fontSize: 92, lineHeight: 1.02 }}>{site.name}</div>
          <div style={{ marginTop: 28, fontSize: 36, color: "#c9bea6" }}>{site.tagline}</div>
        </div>
      </div>
    ),
    size,
  );
}
