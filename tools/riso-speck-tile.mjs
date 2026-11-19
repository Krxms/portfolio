// Tuile de « manques d'encre » façon risographie : de très petits points clairs (le papier qui perce à travers l'encre) et
// quelques fibres, sur fond transparent. Posée en superposition sur les éléments de la frame de droite.
// Usage : node tools/riso-speck-tile.mjs   →   src/assets/riso/speck.png
import sharp from 'sharp';

const N = 256;
const hash = (x, y, s) => {
  let h = ((((x % N) + N) % N) * 374761393 + (((y % N) + N) % N) * 668265263 + s * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
const buf = Buffer.alloc(N * N * 4, 0);
const put = (x, y, a) => {
  const xx = ((x % N) + N) % N, yy = ((y % N) + N) % N;
  const o = (yy * N + xx) * 4;
  buf[o] = 255; buf[o + 1] = 246; buf[o + 2] = 232;
  buf[o + 3] = Math.max(buf[o + 3], Math.round(a * 255));
};
for (let y = 0; y < N; y++) {
  for (let x = 0; x < N; x++) {
    const r = hash(x, y, 3);
    // points fins (1 px) : environ 1 % de la surface, peu contrastés
    if (r < 0.013) put(x, y, 0.22 + 0.28 * hash(x, y, 4));
    // petites taches (2 px) : plus rares
    else if (r > 0.9992) {
      const a = 0.4 + 0.25 * hash(x, y, 5);
      put(x, y, a); put(x + 1, y, a * 0.7); put(x, y + 1, a * 0.7); put(x + 1, y + 1, a * 0.45);
    }
  }
}
// fibres : de courts traits clairs, dans des directions variées
for (let i = 0; i < 34; i++) {
  const x0 = Math.floor(hash(i, 1, 7) * N), y0 = Math.floor(hash(i, 2, 7) * N);
  const ang = hash(i, 3, 7) * Math.PI, len = 4 + Math.floor(hash(i, 4, 7) * 7);
  for (let k = 0; k < len; k++) put(Math.round(x0 + Math.cos(ang) * k), Math.round(y0 + Math.sin(ang) * k), 0.16);
}
await sharp(buf, { raw: { width: N, height: N, channels: 4 } }).png({ compressionLevel: 9 }).toFile('src/assets/riso/speck.png');
console.log('ok');
