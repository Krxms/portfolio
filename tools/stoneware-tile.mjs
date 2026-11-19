// Tuiles « grès » : une céramique émaillée, mouchetée, avec un très léger relief.
//  stoneware.webp : pour les sections claires.
//    1. un relief doux : un bruit continu (plusieurs échelles) éclairé en biais (reflet clair d'un côté, ombre chaude de l'autre) ;
//    2. des mouchetures de fer (brun rouille, brun sombre, gris-bleu, corail), fines : même finesse que le grain des sections bleues.
// Les tuiles sont raccordables sur leurs quatre bords. L'intensité se règle avec l'opacité de la couche qui les porte.
//  flecks.webp : mouchetures claires (crème, bleu pâle, pêche) pour les aplats de couleur, les boutons.
// Usage : node tools/stoneware-tile.mjs   →   src/assets/riso/stoneware.webp, src/assets/riso/flecks.webp
import sharp from 'sharp';

const N = 512;
const hash = (x, y, s) => {
  let h = ((((x % N) + N) % N) * 374761393 + (((y % N) + N) % N) * 668265263 + s * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
const makeRand = (seed) => {
  let a = seed | 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// bruit de valeur continu et raccordable : `cells` cellules sur la largeur de la tuile
const valueNoise = (cells, seed) => {
  const g = new Float32Array(cells * cells);
  for (let i = 0; i < g.length; i++) g[i] = hash(i % cells, Math.floor(i / cells), seed);
  const f = new Float32Array(N * N);
  const s = N / cells;
  const sm = (t) => t * t * (3 - 2 * t);
  for (let y = 0; y < N; y++) {
    const gy = y / s, y0 = Math.floor(gy), ty = sm(gy - y0);
    for (let x = 0; x < N; x++) {
      const gx = x / s, x0 = Math.floor(gx), tx = sm(gx - x0);
      const a = g[(y0 % cells) * cells + (x0 % cells)];
      const b = g[(y0 % cells) * cells + ((x0 + 1) % cells)];
      const c = g[((y0 + 1) % cells) * cells + (x0 % cells)];
      const d = g[((y0 + 1) % cells) * cells + ((x0 + 1) % cells)];
      f[y * N + x] = (a + (b - a) * tx) * (1 - ty) + (c + (d - c) * tx) * ty;
    }
  }
  return f;
};

const smoothstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// calque en pixels prémultipliés (flottants)
const makeLayer = () => {
  const R = new Float32Array(N * N), G = new Float32Array(N * N), B = new Float32Array(N * N), A = new Float32Array(N * N);
  const over = (i, r, g, b, a) => {
    const k = 1 - a;
    R[i] = r * a + R[i] * k;
    G[i] = g * a + G[i] * k;
    B[i] = b * a + B[i] * k;
    A[i] = a + A[i] * k;
  };
  const specks = ({ count, inks, seed, rScale, alpha: [a0, a1], rMax }) => {
    const rand = makeRand(seed);
    const pick = () => {
      let u = rand();
      for (const [w, c] of inks) { if (u < w) return c; u -= w; }
      return inks[0][1];
    };
    for (let k = 0; k < count; k++) {
      const cx = rand() * N, cy = rand() * N;
      // rayon : surtout très petit, quelques gros
      const r = Math.min(rMax, (0.5 + -Math.log(1 - rand() * 0.98) * 0.32) * rScale);
      const base = a0 + rand() * (a1 - a0);
      const [cr, cg, cb] = pick();
      const m = Math.ceil(r + 1.5);
      for (let dy = -m; dy <= m; dy++) {
        for (let dx = -m; dx <= m; dx++) {
          const px = Math.round(cx) + dx, py = Math.round(cy) + dy;
          const d = Math.hypot(px - cx, py - cy);
          const a = base * (1 - smoothstep(r - 0.55, r + 0.65, d));
          if (a <= 0.004) continue;
          over((((py % N) + N) % N) * N + (((px % N) + N) % N), cr, cg, cb, a);
        }
      }
    }
  };
  const save = async (file) => {
    const out = Buffer.alloc(N * N * 4);
    for (let i = 0; i < N * N; i++) {
      const a = A[i];
      out[i * 4] = a > 0 ? Math.min(255, Math.round(R[i] / a)) : 0;
      out[i * 4 + 1] = a > 0 ? Math.min(255, Math.round(G[i] / a)) : 0;
      out[i * 4 + 2] = a > 0 ? Math.min(255, Math.round(B[i] / a)) : 0;
      out[i * 4 + 3] = Math.min(255, Math.round(a * 255));
    }
    await sharp(out, { raw: { width: N, height: N, channels: 4 } }).webp({ quality: 85, alphaQuality: 85 }).toFile(file);
  };
  return { over, specks, save };
};

// ---------- sections claires ----------
{
  const L = makeLayer();
  const n1 = valueNoise(32, 11), n2 = valueNoise(64, 12), n3 = valueNoise(128, 13);
  const h = new Float32Array(N * N);
  for (let i = 0; i < h.length; i++) h[i] = n1[i] * 0.5 + n2[i] * 0.32 + n3[i] * 0.18;
  const at = (x, y) => h[(((y % N) + N) % N) * N + (((x % N) + N) % N)];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const e = (at(x - 1, y - 1) - at(x + 1, y + 1)) * 2.4; // éclairé depuis le haut à gauche
      if (e > 0) L.over(y * N + x, 255, 252, 244, Math.min(0.07, e * 0.07));
      else L.over(y * N + x, 96, 78, 66, Math.min(0.035, -e * 0.035));
    }
  }
  L.specks({
    count: 1500,
    seed: 0x9e3779b9,
    rScale: 0.5,
    rMax: 1.15,
    alpha: [0.25, 0.62],
    inks: [
      [0.58, [150, 92, 66]], // rouille
      [0.2, [98, 66, 54]], // brun sombre
      [0.14, [74, 88, 132]], // gris-bleu
      [0.08, [206, 112, 86]], // corail
    ],
  });
  await L.save('src/assets/riso/stoneware.webp');
}

// ---------- aplats de couleur (boutons) : des mouchetures claires, bien visibles sur un bleu profond ----------
{
  const L = makeLayer();
  L.specks({
    count: 650,
    seed: 0x51ed270b,
    rScale: 0.9,
    rMax: 1.8,
    alpha: [0.3, 0.75],
    inks: [
      [0.55, [255, 238, 200]], // crème
      [0.3, [170, 200, 255]], // bleu pâle
      [0.15, [255, 190, 150]], // pêche
    ],
  });
  await L.save('src/assets/riso/flecks.webp');
}
console.log('ok');
