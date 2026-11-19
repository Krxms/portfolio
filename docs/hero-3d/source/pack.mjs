import { createRequire } from 'node:module';
const require = createRequire('C:/Users/Dieu/Desktop/Travaux/portfolio-antoine-bruneau/package.json');
const sharp = require('sharp');
const out = 'C:/Users/Dieu/Desktop/Travaux/portfolio-antoine-bruneau/docs/hero-3d/assets';
await sharp('hi-d.png').resize(1800, 1350).webp({ quality: 82, alphaQuality: 90 }).toFile(`${out}/hero-atelier-bureau.webp`);
await sharp('hi-m.png').resize(1000, 1000).webp({ quality: 82, alphaQuality: 90 }).toFile(`${out}/hero-atelier-mobile.webp`);
await sharp('hi-d.png').resize(900, 675).webp({ quality: 80, alphaQuality: 90 }).toFile(`${out}/hero-atelier-bureau-900.webp`);
const fs = require('node:fs');
for (const f of fs.readdirSync(out)) console.log(f, Math.round(fs.statSync(`${out}/${f}`).size / 1024) + ' Ko');
