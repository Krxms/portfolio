// Version « risographie » du dégradé de la section manifeste.
// Principe d'une vraie riso : peu d'encres (ici 2 : un bleu klein et un vert-bleu), chacune imprimée en demi-teinte
// (points dont la taille suit la densité), avec une trame orientée différemment par encre, un léger défaut de
// repérage entre les passes, des variations de densité (encre inégale), des manques ponctuels et du grain de papier.
// Usage : node tools/riso.mjs   →   exports/manifeste-risograph-*.png
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const OUT = new URL('../exports/', import.meta.url);
mkdirSync(OUT, { recursive: true });
const W = 2560;
const H = 1600;

// --- bruit déterministe ---
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

// --- champs de densité : les mêmes nappes que le dégradé du site, regroupées par encre ---
const aspect = W / H;
const field = (pts, u, v) => {
  let s = 0;
  for (const [x, y, sg, k] of pts) {
    const dx = (u - x) * aspect, dy = v - y;
    s += k * Math.exp(-(dx * dx + dy * dy) / (2 * sg * sg));
  }
  return s;
};
const BLUE = [
  [0.12, 0.2, 0.46, 1.2],
  [0.5, 0.68, 0.5, 1.0],
  [0.95, 0.2, 0.3, 0.35],
];
const TEAL = [
  [0.84, 0.16, 0.44, 0.85],
  [0.9, 0.92, 0.38, 0.7],
  [0.06, 0.94, 0.4, 0.8],
];

// --- demi-teinte : points sur une trame tournée ---
function halftone(x, y, covAt, cell, angleDeg, seed, dot = 0.5) {
  const a = (angleDeg * Math.PI) / 180;
  const ca = Math.cos(a), sa = Math.sin(a);
  const rx = x * ca + y * sa;
  const ry = -x * sa + y * ca;
  const cx = (Math.floor(rx / cell) + 0.5) * cell;
  const cy = (Math.floor(ry / cell) + 0.5) * cell;
  const d = Math.hypot(rx - cx, ry - cy);
  // centre de la cellule, ramené aux coordonnées de l'image : c'est là qu'on lit la densité
  const cov = covAt(cx * ca - cy * sa, cx * sa + cy * ca);
  // bord irrégulier : l'encre n'est jamais parfaitement ronde
  const rough = 0.88 + 0.24 * vnoise(x / 2.6, y / 2.6, seed);
  const r = cell * dot * Math.sqrt(clamp(cov)) * rough;
  return clamp((r - d) / 0.9 + 0.5);
}

function render(name, { paper, inkBlue, inkTeal, mode, gainB, gainT, cell = 13, shift = [5, -4], starve = 0.025, levels = 0, dot = 0.74 }) {
  const buf = Buffer.alloc(W * H * 3);
  let o = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const dens = (pts, gain) => (px, py) => {
        const u = clamp(px / (W - 1), 0, 1), v = clamp(py / (H - 1), 0, 1);
        // déformation douce, comme pour le mesh
        const uu = u + 0.04 * Math.sin(6.283 * 1.3 * v + 0.6) + 0.02 * Math.sin(6.283 * (2.7 * u + 0.5 * v) + 1.1);
        const vv = v + 0.04 * Math.sin(6.283 * 1.1 * u + 2.1) + 0.02 * Math.sin(6.283 * (2.3 * v - 0.4 * u) + 0.3);
        let c = clamp(field(pts, uu, vv) * gain);
        if (levels) c = Math.round(c * levels) / levels;
        return c;
      };
      // défaut de repérage : la passe verte est décalée de quelques pixels
      const mB = halftone(x, y, dens(BLUE, gainB), cell, 15, 1, dot);
      const mT = halftone(x + shift[0], y + shift[1], (px, py) => dens(TEAL, gainT)(px - shift[0], py - shift[1]), cell, 75, 2, dot);

      // densité d'encre inégale (taches douces) + manques ponctuels
      const densB = (0.88 + 0.12 * (0.65 * vnoise(x / 220, y / 220, 5) + 0.35 * vnoise(x / 60, y / 60, 6))) * (hash(x, y, 7) < starve ? 0.3 : 1);
      const densT = (0.88 + 0.12 * (0.65 * vnoise(x / 180, y / 180, 9) + 0.35 * vnoise(x / 50, y / 50, 10))) * (hash(x, y, 11) < starve ? 0.3 : 1);
      const aB = mB * densB;
      const aT = mT * densT;

      let r, g, b;
      if (mode === 'screen') {
        // papier sombre : les encres éclaircissent (mélange additif léger)
        r = 1 - (1 - paper[0]) * (1 - inkBlue[0] * aB) * (1 - inkTeal[0] * aT);
        g = 1 - (1 - paper[1]) * (1 - inkBlue[1] * aB) * (1 - inkTeal[1] * aT);
        b = 1 - (1 - paper[2]) * (1 - inkBlue[2] * aB) * (1 - inkTeal[2] * aT);
      } else {
        // papier clair : encres soustractives (surimpression), comme une vraie riso
        r = paper[0] * (1 - aB * (1 - inkBlue[0])) * (1 - aT * (1 - inkTeal[0]));
        g = paper[1] * (1 - aB * (1 - inkBlue[1])) * (1 - aT * (1 - inkTeal[1]));
        b = paper[2] * (1 - aB * (1 - inkBlue[2])) * (1 - aT * (1 - inkTeal[2]));
      }
      // grain de papier + fibres
      const grain = 1 + (hash(x, y, 13) - 0.5) * 0.1 + (vnoise(x / 1.5, y / 9, 17) - 0.5) * 0.05;
      buf[o++] = Math.round(clamp(r * grain) * 255);
      buf[o++] = Math.round(clamp(g * grain) * 255);
      buf[o++] = Math.round(clamp(b * grain) * 255);
    }
  }
  return sharp(buf, { raw: { width: W, height: H, channels: 3 } })
    .png()
    .toFile(new URL(`${name}.png`, OUT).pathname.replace(/^\/([A-Za-z]:)/, '$1'))
    .then(() => console.log('riso', name));
}

// Papier sombre (même ambiance que la section du site)
// Papier sombre (même ambiance que la section du site) : encres denses mais peu lumineuses
await render('manifeste-risograph-sombre-2560x1600', {
  mode: 'screen',
  paper: [0.016, 0.065, 0.09],
  inkBlue: [0.02, 0.16, 0.6],
  inkTeal: [0.01, 0.38, 0.34],
  gainB: 0.58,
  gainT: 0.52,
});

// Papier crème, riso « classique » (encres bleue et verte en surimpression)
await render('manifeste-risograph-creme-2560x1600', {
  mode: 'multiply',
  paper: [0.96, 0.94, 0.88],
  inkBlue: [0.0, 0.28, 0.78],
  inkTeal: [0.1, 0.72, 0.62],
  gainB: 0.6,
  gainT: 0.55,
});

// Version MARQUÉE : trame grosse (visible même réduite à la taille d'un écran), repérage décalé, encre inégale.
await render('manifeste-risograph-sombre-MARQUE-2560x1600', {
  mode: 'screen',
  paper: [0.012, 0.045, 0.065],
  inkBlue: [0.05, 0.3, 0.9],
  inkTeal: [0.03, 0.6, 0.52],
  gainB: 0.62,
  gainT: 0.55,
  cell: 56,
  dot: 0.62,
  shift: [20, -16],
  starve: 0.1,
  levels: 0,
});

// Version FINE : trame deux fois plus serrée (≈ 28 px à l'écran une fois la section affichée en « cover »)
await render('manifeste-risograph-sombre-FINE-2560x1600', {
  mode: 'screen',
  paper: [0.012, 0.045, 0.065],
  inkBlue: [0.05, 0.28, 0.86],
  inkTeal: [0.03, 0.56, 0.5],
  gainB: 0.64,
  gainT: 0.56,
  cell: 24,
  dot: 0.64,
  shift: [9, -7],
  starve: 0.07,
  levels: 0,
});
