// Génère les fonds « mesh gradient » du site : un champ de couleur continu, calculé pixel par pixel
// (mélange gaussien de points de couleur dans l'espace linéaire, avec une légère déformation du domaine
// pour casser toute trace de cercles concentriques), puis dithering pour éviter les bandes.
// Usage : node tools/gen-mesh.mjs   →   src/assets/mesh/*.webp
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const OUT = new URL('../src/assets/mesh/', import.meta.url);
mkdirSync(OUT, { recursive: true });

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const toLin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toSrgb = (c) => (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055);
const lin = (h) => hex(h).map(toLin);

// PRNG déterministe : mêmes fichiers à chaque exécution
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

async function make({ name, w, h, base, baseWeight = 0.12, points, warp = [0.055, 0.03], seed = 1, quality = 92 }) {
  const rand = rng(seed);
  const ph = Array.from({ length: 6 }, () => rand() * Math.PI * 2);
  const baseLin = lin(base);
  const pts = points.map(([x, y, sigma, strength, color]) => ({ x, y, s2: 2 * sigma * sigma, k: strength, c: lin(color) }));
  const aspect = w / h;
  const buf = Buffer.alloc(w * h * 3);
  const [a, b] = warp;
  let o = 0;
  for (let j = 0; j < h; j++) {
    const v = j / (h - 1);
    for (let i = 0; i < w; i++) {
      const u = i / (w - 1);
      const uu = u + a * Math.sin(6.283 * (1.3 * v) + ph[0]) + b * Math.sin(6.283 * (2.7 * u + 0.5 * v) + ph[1]);
      const vv = v + a * Math.sin(6.283 * (1.1 * u) + ph[2]) + b * Math.sin(6.283 * (2.3 * v - 0.4 * u) + ph[3]);
      let r = baseLin[0] * baseWeight;
      let g = baseLin[1] * baseWeight;
      let bl = baseLin[2] * baseWeight;
      let sum = baseWeight;
      for (const p of pts) {
        const dx = (uu - p.x) * aspect;
        const dy = vv - p.y;
        const wgt = p.k * Math.exp(-(dx * dx + dy * dy) / p.s2);
        r += p.c[0] * wgt;
        g += p.c[1] * wgt;
        bl += p.c[2] * wgt;
        sum += wgt;
      }
      const n = (rand() - 0.5) * 1.6;
      buf[o++] = Math.max(0, Math.min(255, Math.round(toSrgb(r / sum) * 255 + n)));
      buf[o++] = Math.max(0, Math.min(255, Math.round(toSrgb(g / sum) * 255 + n)));
      buf[o++] = Math.max(0, Math.min(255, Math.round(toSrgb(bl / sum) * 255 + n)));
    }
  }
  const file = new URL(`${name}.webp`, OUT);
  await sharp(buf, { raw: { width: w, height: h, channels: 3 } }).webp({ quality, effort: 5 }).toFile(file.pathname.replace(/^\/([A-Za-z]:)/, '$1'));
  console.log('mesh', name, `${w}x${h}`);
}

// Hero : un mesh clair, bleu klein tiré vers le vert, sur crème. Assez lumineux pour porter du texte sombre.
await make({
  name: 'hero',
  w: 1600,
  h: 1000,
  base: '#f5f3ea',
  baseWeight: 0.2,
  warp: [0.05, 0.028],
  seed: 5,
  points: [
    [0.06, 0.1, 0.34, 1.0, '#8fb2ee'],
    [0.5, 0.0, 0.3, 0.7, '#a9dcd2'],
    [0.96, 0.12, 0.34, 1.0, '#86d3bd'],
    [0.28, 0.5, 0.3, 0.55, '#c8e6ea'],
    [0.7, 0.55, 0.3, 0.7, '#a6dfc9'],
    [0.04, 0.9, 0.34, 0.85, '#7fa6e6'],
    [0.5, 1.0, 0.36, 0.8, '#bfe7d8'],
    [0.97, 0.95, 0.3, 0.7, '#ffd9bd'],
  ],
});

// Tuiles sombres : un dégradé très fluide (sigma larges, déformation faible), bleu klein vers le vert.
// Quelques cœurs lumineux plus petits donnent au verre dépoli posé par-dessus quelque chose à adoucir.
await make({
  name: 'dark-a',
  w: 1280,
  h: 800,
  base: '#04121a',
  baseWeight: 0.3,
  warp: [0.035, 0.018],
  seed: 21,
  points: [
    [0.12, 0.2, 0.46, 1.2, '#0a38b4'],
    [0.84, 0.16, 0.44, 0.85, '#0c7a6c'],
    [0.5, 0.68, 0.5, 1.0, '#082a86'],
    [0.9, 0.92, 0.38, 0.7, '#0e8f7e'],
    [0.06, 0.94, 0.4, 0.8, '#06424e'],
  ],
});

await make({
  name: 'dark-b',
  w: 1280,
  h: 800,
  base: '#04141b',
  baseWeight: 0.3,
  warp: [0.035, 0.018],
  seed: 33,
  points: [
    [0.88, 0.2, 0.46, 1.1, '#0b3cb8'],
    [0.14, 0.82, 0.46, 0.9, '#0c7a6c'],
    [0.5, 0.45, 0.42, 0.75, '#072c8a'],
    [0.05, 0.18, 0.36, 0.7, '#06424e'],
    [0.95, 0.9, 0.36, 0.65, '#0e8f7e'],
  ],
});

// Zone sombre commune (« Qui suis-je » + appel final) : un seul dégradé continu sur les deux tuiles, sans couture.
await make({
  name: 'dark-shared',
  w: 800,
  h: 1500,
  base: '#04141b',
  baseWeight: 0.3,
  warp: [0.03, 0.015],
  seed: 77,
  points: [
    [0.9, 0.1, 0.2, 1.1, '#0b3cb8'],
    [0.12, 0.04, 0.17, 0.7, '#06424e'],
    [0.08, 0.36, 0.2, 0.95, '#0c7a6c'],
    [0.5, 0.56, 0.2, 0.9, '#082a86'],
    [0.92, 0.78, 0.2, 0.85, '#0e8f7e'],
    [0.1, 0.94, 0.18, 0.8, '#06424e'],
    [0.7, 0.98, 0.16, 0.6, '#0a38b4'],
  ],
});

// Cartes de services : trois ambiances claires, assez douces pour porter du texte sombre
const card = { w: 700, h: 860, baseWeight: 0.1, warp: [0.07, 0.035], quality: 92 };
await make({
  ...card,
  name: 'card-warm',
  base: '#fff0e1',
  seed: 41,
  points: [
    [0.1, 0.08, 0.34, 1.0, '#ffb98e'],
    [0.95, 0.3, 0.3, 0.9, '#f7b6a4'],
    [0.5, 0.95, 0.34, 0.9, '#ffd2a8'],
    [0.9, 0.95, 0.22, 0.6, '#f3e0b8'],
  ],
});
await make({
  ...card,
  name: 'card-blue',
  base: '#e9f0fb',
  seed: 52,
  points: [
    [0.9, 0.06, 0.34, 1.0, '#8fb2ee'],
    [0.05, 0.5, 0.3, 0.9, '#9fcbea'],
    [0.6, 0.98, 0.34, 0.9, '#a9dcd2'],
    [0.2, 0.05, 0.2, 0.6, '#c6d6f7'],
  ],
});
await make({
  ...card,
  name: 'card-mint',
  base: '#eef6ec',
  seed: 63,
  points: [
    [0.08, 0.12, 0.34, 1.0, '#9fdcc2'],
    [0.95, 0.5, 0.3, 0.9, '#b3dfe6'],
    [0.45, 0.98, 0.34, 0.9, '#d6ecb4'],
    [0.9, 0.05, 0.2, 0.6, '#f3e3c4'],
  ],
});
