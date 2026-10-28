// Calque risographie des pages de service : points d'encre (bleu + vert-bleu) denses sur le bord droit, qui s'effacent
// complètement vers la gauche, là où se trouve le texte. Couche TRANSPARENTE posée en multiply sur le mesh.
// Usage : node tools/riso-hero-right.mjs          →   src/assets/mesh/hero-riso-right.webp  (bord droit, ordinateur)
//         node tools/riso-hero-right.mjs bottom   →   src/assets/mesh/hero-riso-bottom.webp (bord bas, mobile et tablette)
import sharp from 'sharp';

const BOTTOM = process.argv[2] === 'bottom';
const W = BOTTOM ? 1600 : 2560;
const H = BOTTOM ? 2560 : 1600;
const aspect = 1.6;

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
  [1.0, 0.95, 0.34, 1.2],
  [0.78, 0.55, 0.26, 0.7],
  [1.0, 0.1, 0.24, 0.6],
];
const TEAL = [
  [0.9, 0.05, 0.32, 1.2],
  [1.0, 0.62, 0.28, 0.9],
  [0.72, 1.0, 0.24, 0.6],
];
const field = (pts, u, v) => {
  let s = 0;
  for (const [x, y, sg, k] of pts) {
    const dx = (u - x) * aspect, dy = v - y;
    s += k * Math.exp(-(dx * dx + dy * dy) / (2 * sg * sg));
  }
  return s;
};

// Zone calme : tout le côté gauche (texte), l’encre ne monte qu’à partir de 40 % de la largeur
function calm(u, v) {
  // 0 jusqu’à 56 % de la largeur, puis montée progressive ; léger retrait en haut pour ne pas charger l'en-tête
  const ramp = BOTTOM ? smoothstep(0.8, 1.06, u) : smoothstep(0.56, 1.04, u);
  return ramp * (0.7 + 0.3 * smoothstep(0.0, 0.3, v));
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

const cell = BOTTOM ? 60 : 34;
const dot = 0.66;
const shift = [12, -9];
const inkBlue = [0.06, 0.3, 0.8];
const inkTeal = [0.08, 0.64, 0.56];

const dens = (pts, gain) => (px, py) => {
  const pu = clamp(px / (W - 1), 0, 1), pv = clamp(py / (H - 1), 0, 1);
  const u = BOTTOM ? pv : pu, v = BOTTOM ? 1 - pu : pv;
  return clamp(field(pts, u, v) * gain) * calm(u, v);
};

const buf = Buffer.alloc(W * H * 4);
let o = 0;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const mB = halftone(x, y, dens(BLUE, 0.62), cell, 15, 1, dot);
    const mT = halftone(x + shift[0], y + shift[1], (px, py) => dens(TEAL, 0.58)(px - shift[0], py - shift[1]), cell, 75, 2, dot);
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
  .webp({ quality: 78, alphaQuality: 80, effort: 5 })
  .toFile(new URL(BOTTOM ? '../src/assets/mesh/hero-riso-bottom.webp' : '../src/assets/mesh/hero-riso-right.webp', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
console.log('hero-riso-right', info.size);
