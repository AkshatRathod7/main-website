import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** The "SV" from the DreamSVin wordmark on charcoal, with the coral rule. Same as icon.svg. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#25282D", fontSize: 92, fontWeight: 800, letterSpacing: -4 }}>
        <div style={{ display: "flex" }}>
          <span style={{ color: "#EFBC6F" }}>S</span>
          <span style={{ color: "#C8955A" }}>V</span>
        </div>
        <div style={{ width: 76, height: 7, borderRadius: 4, background: "#FF705C", marginTop: 4 }} />
      </div>
    ),
    size,
  );
}
