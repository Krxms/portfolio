// Fabrique public/favicon.svg : le nouveau logo (gélule bleue, A et B), SANS les deux cercles (corail et jaune) du logo complet, sur un carré crème arrondi.
// Le logo du site est une image matricielle (src/assets/logo-mark.webp) : ici il est redessiné en vecteur, avec les mesures relevées sur cette image
// (gélule 88 x 170, trait de 7, lettres de 42 de haut) et les lettres A et B de Be Vietnam Pro 700 (public/fonts), dont les contours sont convertis en tracés
// (aucune police n'est chargée par le favicon). Ensuite : node tools/favicons.mjs (favicon.ico, favicon-48x48.png, apple-touch-icon.png).
// Usage : node tools/favicon-svg.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { create } from 'fontkitten';

const BLUE = '#19287c'; // le bleu du logo (relevé sur logo-mark.webp : 25, 40, 124)
const CREAM = '#f5f0e6';
const font = create(readFileSync(new URL('../public/fonts/be-vietnam-pro-700.woff2', import.meta.url)));
const glyph = (ch) => font.glyphForCodePoint(ch.codePointAt(0));

// mesures du logo (pixels de logo-mark.webp) : gélule x 37..124, y 16..185 ; trait 7 ; A centré en x 80,5 ; B centré en x 82 ; lettres de 42 de haut, A posé en y 94, B en y 151
const PILL = { x: 37, y: 16, w: 88, h: 170, stroke: 7 };
const K = 76 / PILL.h; // le logo tient en 76 sur 100 (12 de marge en haut et en bas)
const cx = 50;
const X = (x) => cx + (x - (PILL.x + PILL.w / 2)) * K;
const Y = (y) => 12 + (y - PILL.y) * K;

const letter = (ch, centerX, baselineY) => {
  const g = glyph(ch);
  const s = (42 * K) / g.bbox.maxY; // hauteur de capitale 740 -> 42 unités de logo
  const mid = (g.bbox.minX + g.bbox.maxX) / 2;
  return `<path transform="translate(${(X(centerX) - mid * s).toFixed(2)} ${Y(baselineY).toFixed(2)}) scale(${s.toFixed(5)} ${(-s).toFixed(5)})" d="${g.path.toSVG()}"/>`;
};

const sw = PILL.stroke * K;
const svg =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="${CREAM}"/>` +
  `<rect x="${(X(PILL.x) + sw / 2).toFixed(2)}" y="${(Y(PILL.y) + sw / 2).toFixed(2)}" width="${((PILL.w) * K - sw).toFixed(2)}" height="${((PILL.h) * K - sw).toFixed(2)}" rx="${(((PILL.w) * K - sw) / 2).toFixed(2)}" fill="none" stroke="${BLUE}" stroke-width="${sw.toFixed(2)}"/>` +
  `<g fill="${BLUE}">${letter('A', 80.5, 94)}${letter('B', 82, 151)}</g></svg>`;
writeFileSync(new URL('../public/favicon.svg', import.meta.url), svg);
console.log('favicon.svg écrit,', svg.length, 'octets');
