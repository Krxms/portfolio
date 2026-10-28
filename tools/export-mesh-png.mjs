// Génère les fonds « mesh gradient » du site : un champ de couleur continu, calculé pixel par pixel
// (mélange gaussien de points de couleur dans l'espace linéaire, avec une légère déformation du domaine
// pour casser toute trace de cercles concentriques), puis dithering pour éviter les bandes.
// Usage : node tools/gen-mesh.mjs   →   src/assets/mesh/*.webp
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const OUT = new URL('../exports/', import.meta.url);
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
  const file = new URL(`${name}.png`, OUT);
  await sharp(buf, { raw: { width: w, height: h, channels: 3 } }).png().toFile(file.pathname.replace(/^\/([A-Za-z]:)/, '$1'));
  console.log('mesh', name, `${w}x${h}`);
}

await make({
  name: 'manifeste-degrade-2560x1600',
  w: 2560,
  h: 1600,
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
