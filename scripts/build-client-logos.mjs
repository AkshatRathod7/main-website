// Turns client logo files into one-colour marks for the logo wall.
// usage: node scripts/build-client-logos.mjs <source dir> slug:file [slug:file ...]
// Each output is public/clients/<slug>.png: charcoal (#25282D) on transparent, trimmed, 160px tall.
// The shape comes from the logo's own transparency, or, for logos on a solid background, from how far each
// pixel is from the corner colour. Re-run whenever a client sends a better file.
import sharp from "sharp";
import path from "node:path";

const [, , dir, ...pairs] = process.argv;
const INK = [0x25, 0x28, 0x2d];

for (const pair of pairs) {
  const [slug, file] = pair.split(":");
  const src = path.join(dir, file);
  const { data, info } = await sharp(src, { density: 300 })
    .resize({ height: 600, withoutEnlargement: false })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const n = info.width * info.height;
  let clear = 0;
  for (let i = 0; i < n; i++) if (data[i * 4 + 3] < 128) clear++;
  const useAlpha = clear / n > 0.05;
  const bg = [data[0], data[1], data[2]];
  const out = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) {
    const a = data[i * 4 + 3];
    let alpha;
    if (useAlpha) alpha = a;
    else {
      const d = Math.hypot(data[i * 4] - bg[0], data[i * 4 + 1] - bg[1], data[i * 4 + 2] - bg[2]);
      alpha = Math.max(0, Math.min(255, (d - 24) * 3));
    }
    out[i * 4] = INK[0];
    out[i * 4 + 1] = INK[1];
    out[i * 4 + 2] = INK[2];
    out[i * 4 + 3] = alpha;
  }
  await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ threshold: 1 })
    .resize({ height: 160 })
    .png({ compressionLevel: 9 })
    .toFile(`public/clients/${slug}.png`);
  const m = await sharp(`public/clients/${slug}.png`).metadata();
  console.log(slug, useAlpha ? "alpha" : "bg-key", `${m.width}x${m.height}`);
}
