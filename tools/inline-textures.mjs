// Intègre les petites textures du site au CSS (src/styles/textures.css), en base 64 : elles sont là dès que le CSS est lu, sans requête d'image.
// Les fonds bleus (panneaux, sections sombres, boutons) s'affichent donc texturés d'emblée, comme le papier de la page.
// Les deux fonds des sections sombres (mesh/dark-a, dark-b) n'y sont plus : ils sont sous le premier écran, et alourdissaient de 17 Ko le CSS
// qui bloque le premier affichage. Ils sont chargés comme des fichiers (voir Tile.css).
// À relancer si l'un de ces fichiers change :  node tools/inline-textures.mjs
import { readFile, writeFile } from 'node:fs/promises';

const textures = [
  ['--grain-soft', 'src/assets/riso/grain-soft.webp', 'image/webp'],
  ['--speck', 'src/assets/riso/speck.png', 'image/png'],
  ['--flecks', 'src/assets/riso/flecks.webp', 'image/webp'],
];

let css = '/* Généré par tools/inline-textures.mjs : ne pas modifier à la main. */\n:root {\n';
let total = 0;
for (const [name, file, type] of textures) {
  const b64 = (await readFile(file)).toString('base64');
  total += b64.length;
  css += `  ${name}: url('data:${type};base64,${b64}');\n`;
}
css += '}\n';
// écrans denses (téléphones, Retina) : les mêmes tuiles à double résolution (fichiers @2x, chargés seulement là) ; les variables gardent leur nom
css += '@media (min-resolution: 1.5dppx) {\n  :root {\n';
for (const [name, file] of textures) css += `    ${name}: url('${file.replace(/(\.[a-z]+)$/, '@2x$1').replace('src/assets', '../assets')}');\n`;
css += '  }\n}\n';
await writeFile('src/styles/textures.css', css);
console.log(`src/styles/textures.css : ${textures.length} textures, ${(total / 1024).toFixed(1)} Ko`);
