// Fabrique les deux tuiles de grain fin du site à partir du bruit SVG qu'elles remplaçaient (feTurbulence, 160 px, raccordable) :
//   src/assets/riso/grain.webp      : grain plein (opacité 1)
//   src/assets/riso/grain-soft.webp : grain doux (opacité 0,4)
// Pourquoi : un grain en SVG est calculé par le navigateur au premier affichage (filtre feTurbulence) : il arrivait donc APRÈS le reste, sur les
// panneaux bleus. En fichier WebP, il se précharge et se décode comme les autres textures (voir BaseLayout.astro).
// Usage : node tools/grain-tile.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const out = (n) => fileURLToPath(new URL(`../src/assets/riso/${n}`, import.meta.url));
const svg = (opacity) => Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#n)" opacity="${opacity}"/></svg>`,
);
for (const [name, op] of [['grain.webp', 1], ['grain-soft.webp', 0.4]]) {
  await sharp(svg(op), { density: 72 }).webp({ quality: 82, alphaQuality: 82, effort: 5 }).toFile(out(name));
  const m = await sharp(out(name)).stats();
  console.log(name, m.channels.map((c) => Math.round(c.mean)).join('/'), `alpha mean ${Math.round(m.channels[3]?.mean ?? 0)}`);
}
