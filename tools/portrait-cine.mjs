// Portrait « cinéma » : étalonnage et grain argentique, sans toucher à la lisibilité du visage.
// Ce n'est PAS un agrandissement magique : la photo source (1500×2000) est réduite en 960×1280 (net pour un
// affichage retina jusqu'à ~480 px de large), puis : contraste local doux, netteté, courbe en S, léger split-toning
// (ombres vers le bleu-vert, hautes lumières légèrement chaudes), grain de film pondéré par la luminance
// (plus présent dans les tons moyens), vignettage discret.
// Usage : node tools/portrait-cine.mjs <photo source>   →   src/assets/portrait-cine.webp
import sharp from 'sharp';

const SRC = process.argv[2];
if (!SRC) throw new Error('Indiquez la photo source : node tools/portrait-cine.mjs <fichier>');
const W = 960, H = 1280;

const hash = (x, y, s = 0) => {
  let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ss = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
// bruit corrélé sur ~2 px (grain organique, pas du bruit numérique)
const vnoise = (x, y, s) => {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s);
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
};

const base = await sharp(SRC)
  .resize(W, H, { fit: 'cover', kernel: 'lanczos3' })
  .clahe({ width: 96, height: 128, maxSlope: 2 }) // contraste local doux, sans durcir la peau
  .sharpen({ sigma: 1.1, m1: 0.7, m2: 1.6 })
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { data } = base;
const out = Buffer.alloc(W * H * 3);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 3;
    let r = data[i] / 255, g = data[i + 1] / 255, b = data[i + 2] / 255;
    const l0 = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    // courbe en S douce : plus de profondeur sans écraser les ombres du visage
    const s = (v) => clamp(v + 0.16 * (v - 0.5) * (1 - Math.abs(2 * v - 1)) * 1.4 - 0.012);
    r = s(r); g = s(g); b = s(b);

    // split-toning : ombres vers le bleu-vert, hautes lumières légèrement chaudes
    const sh = Math.pow(1 - l0, 2), hi = Math.pow(l0, 2);
    r += -0.018 * sh + 0.016 * hi;
    g += 0.006 * sh + 0.006 * hi;
    b += 0.03 * sh - 0.014 * hi;

    // saturation très légèrement réduite (rendu pellicule)
    const l1 = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    r = l1 + (r - l1) * 0.94; g = l1 + (g - l1) * 0.94; b = l1 + (b - l1) * 0.94;

    // grain de film : fin + corrélé, plus fort dans les tons moyens, léger écart de chroma
    const mid = 0.3 + 0.7 * 4 * l1 * (1 - l1);
    const fine = hash(x, y, 3) - 0.5;
    const coarse = vnoise(x / 1.8, y / 1.8, 5) - 0.5;
    const grain = (0.55 * fine + 0.45 * coarse) * 0.17 * mid;
    r += grain + (hash(x, y, 7) - 0.5) * 0.012;
    g += grain + (hash(x, y, 8) - 0.5) * 0.012;
    b += grain + (hash(x, y, 9) - 0.5) * 0.012;

    // vignettage discret, centré légèrement au-dessus du milieu (sur le visage)
    const d = Math.hypot((x / W - 0.5) / 0.62, (y / H - 0.42) / 0.7);
    const vig = 1 - 0.16 * ss(0.55, 1.15, d);
    out[i] = Math.round(clamp(r * vig) * 255);
    out[i + 1] = Math.round(clamp(g * vig) * 255);
    out[i + 2] = Math.round(clamp(b * vig) * 255);
  }
}

const info = await sharp(out, { raw: { width: W, height: H, channels: 3 } })
  .webp({ quality: 80, effort: 5 })
  .toFile(new URL('../src/assets/portrait-cine.webp', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
console.log('portrait-cine', info.width, info.height, Math.round(info.size / 1024) + ' Ko');
