// Fabrique une tuile de béton RACCORDABLE à partir de la photo de béton du site (src/assets/riso/concrete-zoom.webp).
// La photo n'est pas continue d'un bord à l'autre : posée en mosaïque, on verrait des coutures. On la décale d'une demi-largeur, puis on mêle
// la photo d'origine (au centre, où elle est continue) et la photo décalée (sur les bords, où ce sont ses parties centrales qui se touchent).
// Les poids sont choisis pour garder le contraste du grain (somme des carrés = 1).
// Usage : node tools/concrete-tile.mjs   →   src/assets/riso/concrete-tile.webp (512 × 512, niveaux de gris)
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const SRC = fileURLToPath(new URL('../src/assets/riso/concrete-zoom.webp', import.meta.url));
const OUT = fileURLToPath(new URL('../src/assets/riso/concrete-tile.webp', import.meta.url));
const N = 512;

const { data } = await sharp(SRC).resize(N, N).greyscale().raw().toBuffer({ resolveWithObject: true });
const channels = data.length / (N * N);
const grey = (i) => data[i * channels];

const out = Buffer.alloc(N * N * 3);
const half = N / 2;
let mean = 0;
for (let i = 0; i < N * N; i++) mean += grey(i);
mean /= N * N;

for (let y = 0; y < N; y++) {
  for (let x = 0; x < N; x++) {
    const a = grey(y * N + x);
    const b = grey(((y + half) % N) * N + ((x + half) % N));
    // 0 sur les bords, 1 au centre
    const m = Math.sin((Math.PI * x) / N) * Math.sin((Math.PI * y) / N);
    const wa = m;
    const wb = 1 - m;
    const norm = Math.sqrt(wa * wa + wb * wb);
    const v = mean + ((a - mean) * wa + (b - mean) * wb) / norm;
    const c = Math.max(0, Math.min(255, Math.round(v)));
    const o = (y * N + x) * 3;
    out[o] = out[o + 1] = out[o + 2] = c;
  }
}

await sharp(out, { raw: { width: N, height: N, channels: 3 } }).webp({ quality: 88, effort: 5 }).toFile(OUT);
console.log('béton raccordable', `${N}x${N}`);
