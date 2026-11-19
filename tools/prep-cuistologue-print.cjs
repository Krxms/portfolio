// Prépare les visuels print du Cuistologue pour la page projet : découpe des cartes et du flyer
// dans les exports reçus, puis floute les données personnelles du client (téléphone, email,
// QR code, mentions légales) avant publication.
// Usage : node tools/prep-cuistologue-print.cjs <dossier des exports 29.png et 30.png>
const sharp = require('sharp');
const path = require('path');

const src = process.argv[2];
if (!src) throw new Error('Indiquez le dossier contenant 29.png (cartes) et 30.png (flyer).');
const OUT = path.join(__dirname, '..', 'src', 'assets', 'projets', 'cuistologue') + path.sep;

async function crop(file, region) {
  return sharp(path.join(src, file)).extract(region).png().toBuffer();
}

// Floute des rectangles [x, y, largeur, hauteur] d'une image
async function blur(buf, rects, sigma) {
  const layers = [];
  for (const [left, top, width, height] of rects) {
    const piece = await sharp(buf).extract({ left, top, width, height }).blur(sigma).png().toBuffer();
    layers.push({ input: piece, left, top });
  }
  return sharp(buf).composite(layers).png().toBuffer();
}

const save = (buf, name, q = 86) => sharp(buf).webp({ quality: q }).toFile(OUT + name + '.webp');

(async () => {
  const cols = [['rose', 0], ['orange', 699], ['vert', 1398]];
  for (const [n, x] of cols) {
    const visuel = await crop('29.png', { left: x, top: 0, width: 499, height: 329 });
    await save(visuel, `carte-${n}-recto`);
    const coord = await crop('29.png', { left: x, top: 529, width: 499, height: 329 });
    const masked = await blur(coord, [[16, 196, 262, 104], [358, 178, 114, 116]], 7);
    await save(masked, `carte-${n}-verso`);
  }

  const recto = await crop('30.png', { left: 0, top: 0, width: 856, height: 1208 });
  await save(await blur(recto, [[318, 1058, 280, 78], [624, 1000, 170, 170]], 9), 'flyer-recto', 88);

  const verso = await crop('30.png', { left: 1056, top: 0, width: 857, height: 1208 });
  await save(await blur(verso, [[212, 986, 430, 42], [40, 1044, 790, 60]], 8), 'flyer-verso', 88);
  console.log('print ok');
})();
