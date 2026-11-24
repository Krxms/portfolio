// Pose la matière (béton et grain, en mélange « soft-light ») sur les SEULES formes de la scène du Cuistologue (accueil) : le fond bleu reste lisse.
// Entrée : src/assets/scenes/source/cuistologue-shapes-plain.webp (les formes nues, produites par tools/render-scenes.mjs)
// Sortie : src/assets/scenes/cuistologue-shapes.webp (mêmes dimensions, formes texturées, fond transparent)
// Usage : node tools/bake-sc-shapes.mjs
import sharp from 'sharp';

const SRC = 'src/assets/scenes/source/cuistologue-shapes-plain.webp';
const OUT = 'src/assets/scenes/cuistologue-shapes.webp';
const SCALE = 1.5; // l'image est rendue à 1,5 x (voir render-scenes.mjs) : les tuiles gardent leur taille d'origine (béton 256 px, grain 160 px)
const { width: W, height: H } = await sharp(SRC).metadata();

const layer = async (file, tile, opacity) => {
  const t = await sharp(file).resize(Math.round(tile * SCALE)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 3; i < t.data.length; i += 4) t.data[i] = Math.round(t.data[i] * opacity);
  const tileImg = await sharp(t.data, { raw: t.info }).png().toBuffer();
  const cols = Math.ceil(W / t.info.width);
  const rows = Math.ceil(H / t.info.height);
  const inputs = [];
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) inputs.push({ input: tileImg, left: x * t.info.width, top: y * t.info.height });
  return sharp({ create: { width: cols * t.info.width, height: rows * t.info.height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(inputs)
    .extract({ left: 0, top: 0, width: W, height: H })
    .png()
    .toBuffer();
};

const concrete = await layer('src/assets/riso/concrete-tile.webp', 256, 0.4);
const grain = await layer('src/assets/riso/grain-soft.webp', 160, 0.22);
const alpha = await sharp(SRC).ensureAlpha().extractChannel(3).toColourspace('b-w').png().toBuffer();
const mask = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
// le masque : les formes seules (canal alpha), pour que la matière ne déborde pas sur le fond transparent
const maskPng = await sharp(mask.data, { raw: mask.info }).png().toBuffer();

await sharp(SRC)
  .ensureAlpha()
  .composite([
    { input: concrete, blend: 'soft-light' },
    { input: grain, blend: 'soft-light' },
    { input: maskPng, blend: 'dest-in' },
  ])
  .webp({ quality: 86, alphaQuality: 90, effort: 6 })
  .toFile(OUT);
console.log('ok', W, H);
