/**
 * Shared OG image (1200×630) for every route, in the brand book: cream canvas, charcoal type,
 * coral accent, the gold edge band and the real wordmark. Fonts (Manrope, Inter) ship in assets/og
 * as .woff because Satori can't read woff2.
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const C = {
  cream: "#F9F5EF",
  charcoal: "#25282D",
  coral: "#FF705C",
  gold: "#EFBC6F",
  muted: "#5E6168",
  rust: "#B03A26",
  creamSubtle: "#AEB0B5",
};

type Font = { name: string; data: Buffer; weight: 400 | 600 | 700 | 800; style: "normal" };
let assetsPromise: Promise<{ fonts: Font[]; logo: string }> | null = null;
function assets() {
  assetsPromise ??= (async () => {
    const dir = join(process.cwd(), "assets/og");
    const [m800, m700, i400, i600, logo] = await Promise.all(
      ["manrope-latin-800-normal.woff", "manrope-latin-700-normal.woff", "inter-latin-400-normal.woff", "inter-latin-600-normal.woff", "dreamsvin-wordmark.png"].map((f) =>
        readFile(join(dir, f)),
      ),
    );
    return {
      fonts: [
        { name: "Manrope", data: m800, weight: 800 as const, style: "normal" as const },
        { name: "Manrope", data: m700, weight: 700 as const, style: "normal" as const },
        { name: "Inter", data: i400, weight: 400 as const, style: "normal" as const },
        { name: "Inter", data: i600, weight: 600 as const, style: "normal" as const },
      ],
      logo: `data:image/png;base64,${logo.toString("base64")}`,
    };
  })();
  return assetsPromise;
}

/**
 * lead: the headline. serif: an optional second line, set lighter in rust (kept as the param name
 * so existing routes need no change). tone "paper" is kept for Insights and maps to the same cream card;
 * tone "dark" renders charcoal.
 */
export async function ogImage({
  eyebrow,
  lead,
  serif = "",
  tone = "light",
}: {
  eyebrow: string;
  lead: string;
  serif?: string;
  tone?: "light" | "dark" | "paper";
}) {
  const { fonts, logo } = await assets();
  const dark = tone === "dark";
  const fg = dark ? C.cream : C.charcoal;
  const long = (lead + serif).length > 52;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: dark ? C.charcoal : C.cream, color: fg, fontFamily: "Inter" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 20, fontWeight: 600, letterSpacing: 3.5, textTransform: "uppercase", color: dark ? C.creamSubtle : C.muted }}>
            <div style={{ width: 40, height: 3, background: C.coral, borderRadius: 3 }} />
            {eyebrow}
          </div>
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 960 }}>
            <span style={{ fontFamily: "Manrope", fontWeight: 800, fontSize: long ? 72 : 92, lineHeight: 1, letterSpacing: long ? -3 : -4.5 }}>{lead}</span>
            {serif ? (
              <span style={{ fontFamily: "Manrope", fontWeight: 700, fontSize: long ? 40 : 52, lineHeight: 1.1, letterSpacing: -1.5, marginTop: 18, color: dark ? C.coral : C.rust }}>{serif}</span>
            ) : null}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} width={260} height={32} alt="" />
            <span style={{ fontSize: 22, fontWeight: 600, color: dark ? C.creamSubtle : C.muted }}>dreamsvin.com</span>
          </div>
        </div>
        <div style={{ width: 28, height: "100%", background: C.gold }} />
      </div>
    ),
    { ...ogSize, fonts },
  );
}
