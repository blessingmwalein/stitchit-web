/* One-off script to generate PWA icon set from the existing brand logo. Run with:
 *   node scripts/generate-pwa-icons.js
 * Not part of the build — icons are committed as static files.
 * (apple-icon.png at 180x180 already exists and is left untouched.)
 */
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const SOURCE = path.join(ROOT, "public", "STICHIT-01.png");
const OUT_DIR = path.join(ROOT, "public", "icons");
const BG = "#faf9f7"; // matches --background in app/globals.css

async function main() {
  const meta = await sharp(SOURCE).metadata();
  console.log(`source: ${SOURCE} (${meta.width}x${meta.height}, alpha=${meta.hasAlpha})`);

  await sharp(SOURCE).resize(192, 192, { fit: "contain", background: BG }).flatten({ background: BG }).png().toFile(path.join(OUT_DIR, "icon-192.png"));
  await sharp(SOURCE).resize(512, 512, { fit: "contain", background: BG }).flatten({ background: BG }).png().toFile(path.join(OUT_DIR, "icon-512.png"));

  const maskableSize = 512;
  const safeZone = Math.round(maskableSize * 0.7);
  const logoBuf = await sharp(SOURCE).resize(safeZone, safeZone, { fit: "contain", background: BG }).toBuffer();
  await sharp({
    create: { width: maskableSize, height: maskableSize, channels: 4, background: BG },
  })
    .composite([{ input: logoBuf, gravity: "center" }])
    .flatten({ background: BG })
    .png()
    .toFile(path.join(OUT_DIR, "icon-maskable-512.png"));

  console.log("Generated: icons/icon-192.png, icons/icon-512.png, icons/icon-maskable-512.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
