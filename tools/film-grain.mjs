// Grain argentique : une tuile de bruit à transparence, posée en mode normal par-dessus la composition de la Hero.
// Ce qu'on sait d'un vrai grain de pellicule (voir https://en.wikipedia.org/wiki/Film_grain) : ce sont des cristaux d'argent (ou des nuages de
// colorant) minuscules ; l'œil ne voit pas des grains isolés mais des amas (« blobs »), donc un bruit corrélé dans l'espace, à deux échelles
// (le grain fin, et des amas un peu plus gros qui le modulent) ; les grains sont épars (beaucoup d'endroits sans grain visible, d'autres
// plus marqués), ce n'est pas un voile uniforme comme le bruit numérique ; l'ombre y est plus sensible que la lumière.
// Méthode : deux champs de bruit gaussien (fin et amas) filtrés en rebouclant sur les bords (la tuile se raccorde), additionnés ; seuls
// les écarts marqués deviennent des grains visibles (clairs ou sombres, les sombres plus discrets), le reste reste transparent.
// Pas de mode de fusion : la tuile est statique et ne coûte presque rien au défilement.
// Usage : node tools/film-grain.mjs   →   src/assets/riso/film-grain.webp
import sharp from 'sharp';

const N = 384;
const FINE = 0.42; // le grain fin, en pixels
const CLUMP = 1.05; // les amas, en pixels
const CLUMP_WEIGHT = 0.45;
const PEAK = 0.06; // opacité maximale d'un grain
const THRESHOLD = 0.28; // en dessous, pas de grain visible (le grain est épars)

let seed = 20260102;
const rand = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const gauss = () => (rand() + rand() + rand() + rand() - 2) * 1.73; // écart type proche de 1

// flou gaussien séparable, qui reboucle sur les bords (la tuile se raccorde)
const gaussianBlur = (src, sigma) => {
  const radius = Math.ceil(sigma * 3);
  const kernel = [];
  let sum = 0;
  for (let k = -radius; k <= radius; k++) {
    const w = Math.exp(-(k * k) / (2 * sigma * sigma));
    kernel.push(w);
    sum += w;
  }
  const pass = (from, horizontal) => {
    const to = new Float32Array(N * N);
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        let acc = 0;
        for (let k = -radius; k <= radius; k++) {
          const xx = horizontal ? (x + k + N) % N : x;
          const yy = horizontal ? y : (y + k + N) % N;
          acc += from[yy * N + xx] * kernel[k + radius];
        }
        to[y * N + x] = acc / sum;
      }
    }
    return to;
  };
  return pass(pass(src, true), false);
};

const white = () => {
  const f = new Float32Array(N * N);
  for (let i = 0; i < f.length; i++) f[i] = gauss();
  return f;
};
const normalize = (f) => {
  let m = 0;
  for (const v of f) m += v;
  m /= f.length;
  let varSum = 0;
  for (const v of f) varSum += (v - m) ** 2;
  const sd = Math.sqrt(varSum / f.length);
  return f.map((v) => (v - m) / sd);
};

// le grain fin, et les amas qui le modulent
const fine = normalize(gaussianBlur(white(), FINE));
const clumps = normalize(gaussianBlur(white(), CLUMP));
const field = normalize(fine.map((v, i) => v + clumps[i] * CLUMP_WEIGHT));

const out = Buffer.alloc(N * N * 4);
for (let i = 0; i < field.length; i++) {
  const d = field[i] / 2.6; // -1 à 1 environ
  const over = Math.abs(d) - THRESHOLD;
  // grain épars : rien sous le seuil, puis une montée douce
  const k = over <= 0 ? 0 : Math.min(1, over / (1 - THRESHOLD)) ** 1.4;
  const a = k * PEAK * (d > 0 ? 1 : 0.75); // l'ombre pèse un peu moins sur le papier clair
  const v = d > 0 ? 255 : 0;
  out[i * 4] = v;
  out[i * 4 + 1] = v;
  out[i * 4 + 2] = v;
  out[i * 4 + 3] = Math.round((Math.round((a / PEAK) * 12) / 12) * PEAK * 255);
}

await sharp(out, { raw: { width: N, height: N, channels: 4 } })
  .webp({ lossless: true, effort: 6 })
  .toFile('src/assets/riso/film-grain.webp');
console.log('ok');
