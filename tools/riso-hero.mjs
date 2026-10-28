// Calque risographie pour la hero : une couche TRANSPARENTE de points d'encre (bleu + vert-bleu), dense dans les
// coins et sur les bords, qui s'efface complètement autour du bloc de texte central. Posée en multiply sur le
// mesh de la hero, elle donne le rendu d'une impression riso sans jamais gêner la lecture, donc sans voile.
// Usage : node tools/riso-hero.mjs   →   src/assets/mesh/hero-riso.webp (RGBA)
import sharp from 'sharp';

const W = 2560;
const H = 1600;
const aspect = W / H;

const hash = (x, y, s = 0) => {
  let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
const smooth = (t) => t * t * (3 - 2 * t);
const vnoise = (x, y, s = 0) => {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = smooth(x - xi), yf = smooth(y - yi);
  const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s);
  return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
};
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smoothstep = (a, b, x) => smooth(clamp((x - a) / (b - a)));

// Nappes d'encre : bleu en bas à gauche et en haut à droite, vert-bleu en haut à gauche et en bas à droite
const BLUE = [
  [0.0, 1.0, 0.34, 1.2],
  [1.0, 0.0, 0.3, 1.0],
  [0.5, 1.06, 0.3, 0.7],
];
const TEAL = [
  [0.02, 0.02, 0.3, 1.0],
  [1.0, 1.0, 0.34, 1.2],
  [0.52, -0.06, 0.28, 0.6],
];
const field = (pts, u, v) => {
  let s = 0;
  for (const [x, y, sg, k] of pts) {
    const dx = (u - x) * aspect, dy = v - y;
    s += k * Math.exp(-(dx * dx + dy * dy) / (2 * sg * sg));
  }
  return s;
};

// Zone calme : une ellipse autour du bloc de texte, dans laquelle l'encre tombe à zéro (transition douce)
function calm(u, v) {
  const dx = (u - 0.5) / 0.42;
  const dy = (v - 0.5) / 0.43;
  const d = Math.hypot(dx, dy);
  return smoothstep(0.92, 1.6, d);
}

function halftone(x, y, covAt, cell, angleDeg, seed, dot) {
  const a = (angleDeg * Math.PI) / 180;
  const ca = Math.cos(a), sa = Math.sin(a);
  const rx = x * ca + y * sa;
  const ry = -x * sa + y * ca;
  const cx = (Math.floor(rx / cell) + 0.5) * cell;
  const cy = (Math.floor(ry / cell) + 0.5) * cell;
  const d = Math.hypot(rx - cx, ry - cy);
  const cov = covAt(cx * ca - cy * sa, cx * sa + cy * ca);
  const rough = 0.88 + 0.24 * vnoise(x / 2.6, y / 2.6, seed);
  const r = cell * dot * Math.sqrt(clamp(cov)) * rough;
  return clamp((r - d) / 0.9 + 0.5);
}

const cell = 34;
const dot = 0.66;
const shift = [12, -9];
const inkBlue = [0.06, 0.3, 0.8];
const inkTeal = [0.08, 0.64, 0.56];

const dens = (pts, gain) => (px, py) => {
  const u = clamp(px / (W - 1), 0, 1), v = clamp(py / (H - 1), 0, 1);
  return clamp(field(pts, u, v) * gain) * calm(u, v);
};

const buf = Buffer.alloc(W * H * 4);
let o = 0;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const mB = halftone(x, y, dens(BLUE, 0.7), cell, 15, 1, dot);
    const mT = halftone(x + shift[0], y + shift[1], (px, py) => dens(TEAL, 0.64)(px - shift[0], py - shift[1]), cell, 75, 2, dot);
    // encre inégale + petits manques
    const aB = mB * (0.86 + 0.14 * vnoise(x / 200, y / 200, 5)) * (hash(x, y, 7) < 0.07 ? 0.3 : 1);
    const aT = mT * (0.86 + 0.14 * vnoise(x / 170, y / 170, 9)) * (hash(x, y, 11) < 0.07 ? 0.3 : 1);
    const alpha = 1 - (1 - aB) * (1 - aT);
    let r = 0, g = 0, b = 0;
    if (alpha > 0.001) {
      const wB = aB / (aB + aT + 1e-6);
      r = inkBlue[0] * wB + inkTeal[0] * (1 - wB);
      g = inkBlue[1] * wB + inkTeal[1] * (1 - wB);
      b = inkBlue[2] * wB + inkTeal[2] * (1 - wB);
      // là où les deux encres se recouvrent, la couleur fonce (surimpression)
      const both = aB * aT;
      r *= 1 - 0.35 * both; g *= 1 - 0.3 * both; b *= 1 - 0.2 * both;
    }
    buf[o++] = Math.round(clamp(r) * 255);
    buf[o++] = Math.round(clamp(g) * 255);
    buf[o++] = Math.round(clamp(b) * 255);
    buf[o++] = Math.round(clamp(alpha * 0.92) * 255);
  }
}
const info = await sharp(buf, { raw: { width: W, height: H, channels: 4 } })
  .webp({ quality: 88, alphaQuality: 92, effort: 5 })
  .toFile(new URL('../src/assets/mesh/hero-riso.webp', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
console.log('hero-riso', info.size);
