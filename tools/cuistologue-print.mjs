// Prépare les visuels print du Cuistologue à partir des exports Figma (fichier « Le Cuistologue », page « Print »), sans aucun flou :
// les coordonnées sont publiques et les droits sont détenus (accord du client).
//   - affiches A3 (3 cas d'usage) : exports « AFFICHES A3 - EXPORT PDF » ;
//   - cartes de visite : un groupe recto + verso par couleur, découpé en deux faces ;
//   - flyer : recto et verso côte à côte, découpé en deux faces.
// Usage : node tools/cuistologue-print.mjs <dossier des exports PNG>
import sharp from 'sharp';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const src = process.argv[2];
if (!src) throw new Error('Indiquer le dossier des exports : node tools/cuistologue-print.mjs <dossier>');
const out = (n) => fileURLToPath(new URL(`../src/assets/projets/cuistologue/${n}.webp`, import.meta.url));
const webp = (img, name, w) => img.resize({ width: w }).webp({ quality: 84, effort: 5 }).toFile(out(name));

for (const [file, name] of [['p-grands-parents', 'affiche-grands-parents'], ['p-parents', 'affiche-parents'], ['p-teletravail', 'affiche-teletravail']]) {
  await webp(sharp(join(src, `${file}.png`)), name, 1100);
}

// cartes : 749 × 1287 px = recto (haut, 749 × 494) + écart + verso (bas, 749 × 494)
for (const [file, color] of [['c-a', 'rose'], ['c-b', 'orange'], ['c-c', 'vert']]) {
  const p = join(src, `${file}.png`);
  const { width, height } = await sharp(p).metadata();
  const h = Math.round(width / 1.517);
  await webp(sharp(p).extract({ left: 0, top: 0, width, height: h }), `carte-${color}-recto`, 900);
  await webp(sharp(p).extract({ left: 0, top: height - h, width, height: h }), `carte-${color}-verso`, 900);
}

// flyer : 1913 × 1208 px = recto (856) + écart + verso (857)
const f = join(src, 'flyer.png');
const fm = await sharp(f).metadata();
await webp(sharp(f).extract({ left: 0, top: 0, width: 856, height: fm.height }), 'flyer-recto', 856);
await webp(sharp(f).extract({ left: fm.width - 857, top: 0, width: 857, height: fm.height }), 'flyer-verso', 857);
console.log('ok');
