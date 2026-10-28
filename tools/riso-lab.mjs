// Laboratoire risographie : génère des calques d'encre OPAQUES (encre sur papier blanc), à poser en
// mix-blend-mode: multiply. La surimpression est calculée exactement (transmittance de chaque encre multipliée),
// donc bleu + jaune = vert, comme sur une vraie riso à deux passes.
// Usage : node tools/riso-lab.mjs hero-bj | hero-ba | portrait
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const W = 2560, H = 1600, aspect = W / H;
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
const ss = (a, b, x) => smooth(clamp((x - a) / (b - a)));

function halftone(x, y, covAt, cell, angleDeg, seed, dot) {
  const a = (angleDeg * Math.PI) / 180;
  const ca = Math.cos(a), sa = Math.sin(a);
  const rx = x * ca + y * sa, ry = -x * sa + y * ca;
  const cx = (Math.floor(rx / cell) + 0.5) * cell;
  const cy = (Math.floor(ry / cell) + 0.5) * cell;
  const d = Math.hypot(rx - cx, ry - cy);
  const cov = covAt(cx * ca - cy * sa, cx * sa + cy * ca);
  const rough = 0.88 + 0.24 * vnoise(x / 2.6, y / 2.6, seed);
  const r = cell * dot * Math.sqrt(clamp(cov)) * rough;
  return clamp((r - d) / 0.9 + 0.5);
}

// Encre + papier : transmittance par canal ; ink = couleur de l'encre pleine (RGB 0-1)
function compose(inks) {
  let r = 1, g = 1, b = 1;
  for (const { a, ink } of inks) {
    r *= 1 - a * (1 - ink[0]);
    g *= 1 - a * (1 - ink[1]);
    b *= 1 - a * (1 - ink[2]);
  }
  return [r, g, b];
}

const field = (pts, u, v) => {
  let s = 0;
  for (const [x, y, sg, k] of pts) {
    const dx = (u - x) * aspect, dy = v - y;
    s += k * Math.exp(-(dx * dx + dy * dy) / (2 * sg * sg));
  }
  return s;
};
const calm = (u, v, rx = 0.42, ry = 0.43, a = 0.92, b = 1.6) => ss(a, b, Math.hypot((u - 0.5) / rx, (v - 0.5) / ry));

async function hero(name, { blue, second, cell = 34, dot = 0.66 }) {
  const BLUE = [[0.0, 0.95, 0.42, 1.25], [0.04, 0.08, 0.3, 0.7], [0.5, 1.08, 0.3, 0.55]];
  const SEC = [[1.0, 0.1, 0.42, 1.25], [0.97, 0.95, 0.36, 1.05], [0.3, -0.06, 0.28, 0.6]];
  const dens = (pts, gain) => (px, py) => {
    const u = clamp(px / (W - 1), 0, 1), v = clamp(py / (H - 1), 0, 1);
    return clamp(field(pts, u, v) * gain) * calm(u, v);
  };
  const buf = Buffer.alloc(W * H * 3);
  let o = 0;
  const shift = [12, -9];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const aB = halftone(x, y, dens(BLUE, 0.72), cell, 15, 1, dot) * (0.88 + 0.12 * vnoise(x / 200, y / 200, 5)) * (hash(x, y, 7) < 0.06 ? 0.3 : 1);
      const aS = halftone(x + shift[0], y + shift[1], (px, py) => dens(SEC, 0.7)(px - shift[0], py - shift[1]), cell, 75, 2, dot) * (0.88 + 0.12 * vnoise(x / 170, y / 170, 9)) * (hash(x, y, 11) < 0.06 ? 0.3 : 1);
      const [r, g, b] = compose([{ a: aB, ink: blue }, { a: aS, ink: second }]);
      buf[o++] = Math.round(clamp(r) * 255);
      buf[o++] = Math.round(clamp(g) * 255);
      buf[o++] = Math.round(clamp(b) * 255);
    }
  }
  mkdirSync('exports/lab', { recursive: true });
  await sharp(buf, { raw: { width: W, height: H, channels: 3 } }).webp({ quality: 90, effort: 5 }).toFile(`src/assets/mesh/${name}.webp`);
  console.log('hero', name);
}

// --- portrait en duotone riso (bleu + abricot) sur fond sombre, avec bords fondus ---
async function portrait() {
  const { data, info } = await sharp('src/assets/portrait-antoine.webp').resize(900, 1200, { fit: 'cover' }).greyscale().clahe({ width: 90, height: 120, maxSlope: 4 }).raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;
  const L = (x, y) => data[clamp(Math.round(y), 0, h - 1) * w + clamp(Math.round(x), 0, w - 1)] / 255;
  const cell = 7;
  const subj = (px, py) => {
    const u = px / w, v = py / h;
    const head = 1 - ss(0.78, 1.15, Math.hypot((u - 0.46) / 0.2, (v - 0.3) / 0.21));
    const body = 1 - ss(0.8, 1.15, Math.hypot((u - 0.5) / 0.52, (v - 0.82) / 0.4));
    return Math.max(head, body * (v > 0.4 ? 1 : 0));
  };
  const inkCool = [0.22, 0.62, 1.0];
  const inkWarm = [1.0, 0.72, 0.52];
  const out = Buffer.alloc(w * h * 4);
  let o = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const headZone = (px, py) => 1 - ss(0.7, 1.1, Math.hypot((px / w - 0.46) / 0.19, (py / h - 0.3) / 0.2));
      const covCool = (px, py) => ss(0.34, 0.97, L(px, py)) * (0.14 + 0.86 * subj(px, py)) * (1 - 0.6 * headZone(px, py));
      const covWarm = (px, py) => {
        const l = L(px, py);
        return clamp(ss(0.16, 0.46, l) * (1 - ss(0.68, 0.9, l))) * (0.05 + 0.95 * subj(px, py)); // peau, sujet seulement
      };
      const aC = halftone(x, y, covCool, cell, 45, 3, 0.7);
      const aW = halftone(x + 3, y - 2, covWarm, cell, 15, 4, 0.7);
      // mélange additif sur fond sombre
      const a = 1 - (1 - aC) * (1 - aW);
      const wC = aC / (aC + aW + 1e-6);
      let r = inkCool[0] * wC + inkWarm[0] * (1 - wC);
      let g = inkCool[1] * wC + inkWarm[1] * (1 - wC);
      let b = inkCool[2] * wC + inkWarm[2] * (1 - wC);
      // bords fondus (ellipse)
      const e = Math.hypot((x / w - 0.5) / 0.5, (y / h - 0.46) / 0.54);
      const edge = 1 - ss(0.7, 1.0, e);
      out[o++] = Math.round(clamp(r) * 255);
      out[o++] = Math.round(clamp(g) * 255);
      out[o++] = Math.round(clamp(b) * 255);
      out[o++] = Math.round(clamp(a * edge) * 255);
    }
  }
  await sharp(out, { raw: { width: w, height: h, channels: 4 } }).webp({ quality: 90, alphaQuality: 95 }).toFile('src/assets/portrait-riso.webp');
  console.log('portrait');
}

async function band(name, { blue, second, cell = 30, dot = 0.68 }) {
  const ramp = (v) => ss(0.84, 1.03, v);
  const bl = (px, py) => { const u = clamp(px / (W - 1), 0, 1), v = clamp(py / (H - 1), 0, 1); return clamp(ramp(v) * (1.15 - 1.0 * ss(0.15, 0.85, u))); };
  const sc = (px, py) => { const u = clamp(px / (W - 1), 0, 1), v = clamp(py / (H - 1), 0, 1); return clamp(ramp(v) * (0.15 + 1.0 * ss(0.15, 0.85, u))); };
  const shift = [12, -9];
  const buf = Buffer.alloc(W * H * 3);
  let o = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const aB = halftone(x, y, bl, cell, 15, 1, dot) * (0.9 + 0.1 * vnoise(x / 200, y / 200, 5)) * (hash(x, y, 7) < 0.05 ? 0.3 : 1);
      const aS = halftone(x + shift[0], y + shift[1], (px, py) => sc(px - shift[0], py - shift[1]), cell, 75, 2, dot) * (0.9 + 0.1 * vnoise(x / 170, y / 170, 9)) * (hash(x, y, 11) < 0.05 ? 0.3 : 1);
      const [r, g, b] = compose([{ a: aB, ink: blue }, { a: aS, ink: second }]);
      buf[o++] = Math.round(clamp(r) * 255); buf[o++] = Math.round(clamp(g) * 255); buf[o++] = Math.round(clamp(b) * 255);
    }
  }
  await sharp(buf, { raw: { width: W, height: H, channels: 3 } }).webp({ quality: 90, effort: 5 }).toFile(`src/assets/mesh/${name}.webp`);
  console.log('band', name);
}

const which = process.argv[2];
if (which === 'hero-band') await band('hero-riso-band', { blue: [0.1, 0.32, 0.78], second: [1.0, 0.82, 0.3] });
if (which === 'hero-bj') await hero('hero-riso-bj', { blue: [0.1, 0.32, 0.78], second: [1.0, 0.82, 0.3] });
if (which === 'hero-ba') await hero('hero-riso-ba', { blue: [0.1, 0.32, 0.78], second: [1.0, 0.62, 0.46] });
if (which === 'portrait') await portrait();
