// Tuile de papier imprimé (grain demi-teinte, poussières) tirée d'un scan, pour la risographie.
// On enlève les variations lentes (vignette, taches d'éclairage) pour ne garder que le détail fin, on rend la tuile
// raccordable sur ses bords (décalage d'une demi-tuile fondu avec l'original), puis on sépare le détail en deux encres :
// les points clairs (blanc bleuté) et les points sombres (bleu nuit), chacun avec sa transparence. Posée en superposition
// normale, elle marche sur n'importe quel fond, et son intensité se règle avec l'opacité de la couche.
// Usage : node tools/riso-paper-tile.mjs   →   src/assets/riso/paper-halftone.webp
import sharp from 'sharp';

const SRC = 'tools/source/paper-halftone.jpg';
const N = 512;
const crop = { left: 420, top: 200, width: N, height: N };

const { data: base } = await sharp(SRC).greyscale().extract(crop).raw().toBuffer({ resolveWithObject: true });
const { data: low } = await sharp(SRC).greyscale().extract(crop).blur(24).raw().toBuffer({ resolveWithObject: true });

const detail = new Float32Array(N * N);
for (let i = 0; i < N * N; i++) detail[i] = base[i] - low[i];

// raccord : on fond le détail avec lui-même décalé d'une demi-tuile, la pondération valant 1 au centre et 0 sur les bords
const tri = (v) => {
  const t = Math.abs(v / N - 0.5) * 2; // 0 au centre, 1 au bord
  return Math.cos((t * Math.PI) / 2) ** 2;
};
const seamless = new Float32Array(N * N);
for (let y = 0; y < N; y++) {
  for (let x = 0; x < N; x++) {
    const w = tri(x) * tri(y);
    const a = detail[y * N + x];
    const b = detail[((y + N / 2) % N) * N + ((x + N / 2) % N)];
    // la fusion de deux détails indépendants réduit leur contraste : on le rétablit
    seamless[y * N + x] = (a * w + b * (1 - w)) / Math.sqrt(w * w + (1 - w) * (1 - w));
  }
}

let sum = 0;
for (let i = 0; i < N * N; i++) sum += seamless[i];
const mean = sum / (N * N);
let sq = 0;
for (let i = 0; i < N * N; i++) sq += (seamless[i] - mean) ** 2;
const std = Math.sqrt(sq / (N * N));

const out = Buffer.alloc(N * N * 4);
for (let i = 0; i < N * N; i++) {
  const v = (seamless[i] - mean) / std; // écart réduit
  // courbe douce : le grain fin reste très léger, seuls les écarts forts (poussières, points marqués) ressortent ; l'encre sombre est plus discrète que la claire
  const k = Math.min(1, Math.abs(v) / 3.2);
  const alpha = Math.round(255 * Math.pow(k, 1.35) * (v > 0 ? 1 : 0.7));
  if (v > 0) {
    out[i * 4] = 205; out[i * 4 + 1] = 222; out[i * 4 + 2] = 255;
  } else {
    out[i * 4] = 6; out[i * 4 + 1] = 10; out[i * 4 + 2] = 48;
  }
  out[i * 4 + 3] = alpha;
}
await sharp(out, { raw: { width: N, height: N, channels: 4 } }).webp({ quality: 80, alphaQuality: 70 }).toFile('src/assets/riso/paper-halftone.webp');
console.log('ok');
