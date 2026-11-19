// Pré-mélange le grain des sections bleues : au lieu de laisser le navigateur calculer un mélange « soft-light » sur toute la hauteur de
// la zone sombre (une grande surface composée avec un mode de fusion), on le calcule ici, une fois, pour un fond marine moyen (B), et on
// l'enregistre en image à transparence : un voile blanc là où le grain éclaircit, noir là où il assombrit, posé en fusion normale.
// Même relief à l'œil, sans mode de fusion à l'exécution.
//   node tools/grain-flat.mjs   → src/assets/riso/grain-flat.webp (160 x 160, à répéter comme grain-soft.webp)
import sharp from 'sharp';

const B = 0.14; // luminosité moyenne du fond marine sous le grain (0 à 1)
const D = ((16 * B - 12) * B + 4) * B; // courbe « soft-light » (W3C) pour un fond sombre
const { data, info } = await sharp('src/assets/riso/grain-soft.webp').greyscale().raw().toBuffer({ resolveWithObject: true });
const out = Buffer.alloc(info.width * info.height * 4);
for (let i = 0; i < data.length; i++) {
  const g = data[i] / 255;
  let rgb;
  let a;
  if (g > 0.5) {
    rgb = 255;
    a = ((2 * g - 1) * (D - B)) / (1 - B); // éclaircit : out = B + a(1 - B)
  } else {
    rgb = 0;
    a = (1 - 2 * g) * (1 - B); // assombrit : out = B(1 - a)
  }
  out[i * 4] = out[i * 4 + 1] = out[i * 4 + 2] = rgb;
  out[i * 4 + 3] = Math.round(Math.min(1, a * 0.85) * 255); // 0,85 : réglé à l’œil sur le rendu soft-light d’origine
}
await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).webp({ lossless: true }).toFile('src/assets/riso/grain-flat.webp');
console.log('grain-flat.webp écrit');
