import sharp from 'sharp';
// ہر تصویر خودکار WebP بنتی ہے اور maxBytes (150KB) سے چھوٹی ہونے تک سکڑتی رہتی ہے
export async function toWebp(input, { maxBytes = 150 * 1024, width = 1200 } = {}) {
  let q = 82, w = width, out;
  for (let i = 0; i < 12; i++) {
    out = await sharp(input).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: q }).toBuffer();
    if (out.length <= maxBytes) break;
    if (q > 45) q -= 8; else w = Math.round(w * 0.85);
  }
  return out;
}
