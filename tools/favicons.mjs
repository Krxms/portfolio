// Icônes à partir de public/favicon.svg : favicon.ico (48 px, PNG intégré), favicon-48x48.png et apple-touch-icon.png (180 px).
// Google demande un favicon dont la taille est un multiple de 48 px : le .ico et le PNG 48 px répondent à cette règle.
// Usage : node tools/favicons.mjs
import sharp from 'sharp';
import { writeFileSync, readFileSync } from 'node:fs';

const svg = readFileSync(new URL('../public/favicon.svg', import.meta.url));
const png = (size) => sharp(svg, { density: 384 }).resize(size, size).png().toBuffer();

const p48 = await png(48);
writeFileSync(new URL('../public/favicon-48x48.png', import.meta.url), p48);
writeFileSync(new URL('../public/apple-touch-icon.png', import.meta.url), await png(180));

// ICO minimal : en-tête + une entrée + données PNG
const head = Buffer.alloc(22);
head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(1, 4);
head.writeUInt8(48, 6); head.writeUInt8(48, 7); head.writeUInt8(0, 8); head.writeUInt8(0, 9);
head.writeUInt16LE(1, 10); head.writeUInt16LE(32, 12); head.writeUInt32LE(p48.length, 14); head.writeUInt32LE(22, 18);
writeFileSync(new URL('../public/favicon.ico', import.meta.url), Buffer.concat([head, p48]));
console.log('favicons :', p48.length, 'octets (48 px)');
