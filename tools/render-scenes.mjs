// Aplatit les scènes des pages de service (src/assets/scenes/source/*-back.svg et *-front.svg, exportées de Figma) en images WebP.
// Les filtres SVG (ombres floues, masques) et les trois dessins empilés coûtaient cher au défilement : chaque plan devient une image à fond
// transparent, et la parallaxe (animation CSS liée au défilement, creation-site-web.css) glisse ces images au lieu de groupes SVG filtrés.
//
// Sortie, par scène (creation, refonte, audit) :
//   <scène>-bg.svg          le fond seul (dégradé et reflets, sans les formes) : trois tracés, gardé en SVG en ligne
//   <scène>-shapes.webp     les formes du fond (disque, arche, quart de disque), qui dépassent du cadre
//   <scène>-site.webp, -card.webp, -phone.webp, -side.webp   les quatre plans de maquettes (ombres comprises)
// Les images sont rendues avec une marge de PAD unités autour du cadre (1297 x 571) pour que formes et ombres qui dépassent ne soient pas coupées.
//
// Le Cuistologue (accueil) : cuistologue-bg.svg et cuistologue-shapes.webp, depuis source/cuistologue-fond.svg.
// Usage : node tools/render-scenes.mjs   (Chrome ou Edge installé ; sharp vient avec Astro)
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';

const SCALE = 1.5;
const SRC = resolve('src/assets/scenes/source');
const OUT = resolve('src/assets/scenes');
const chrome = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
].find(existsSync);
if (!chrome) throw new Error('Chrome ou Edge introuvable');

const tmp = join(tmpdir(), 'render-scenes');
mkdirSync(tmp, { recursive: true });

const render = (svg, hide, name, { W, H, PAD }) => {
  const wide = W + PAD * 2;
  const tall = H + PAD * 2;
  const framed = svg
    .replace(/viewBox="[^"]*"/, `viewBox="${-PAD} ${-PAD} ${wide} ${tall}"`)
    .replace('<svg ', `<svg width="${wide}" height="${tall}" `);
  const html = `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:transparent}svg{display:block;overflow:visible}${hide}</style>${framed}`;
  const page = join(tmp, name + '.html');
  const png = join(tmp, name + '.png');
  writeFileSync(page, html);
  execFileSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--default-background-color=00000000',
    `--force-device-scale-factor=${SCALE}`,
    `--window-size=${wide},${tall}`,
    `--screenshot=${png}`,
    pathToFileURL(page).href,
  ], { stdio: 'ignore' });
  return png;
};

const toWebp = async (png, dest, { W, H, PAD }) => {
  const w = Math.round((W + PAD * 2) * SCALE);
  const h = Math.round((H + PAD * 2) * SCALE);
  await sharp(png).extract({ left: 0, top: 0, width: w, height: h }).webp({ quality: 84, alphaQuality: 90, effort: 6 }).toFile(dest);
};

const SERVICE = { W: 1297, H: 571, PAD: 140 };
for (const scene of ['creation', 'refonte', 'audit']) {
  const back = readFileSync(join(SRC, `${scene}-back.svg`), 'utf8');
  const front = readFileSync(join(SRC, `${scene}-front.svg`), 'utf8');

  // fond seul : le groupe des formes retiré
  const bg = back.replace(/<g class="cs-art-shapes">[\s\S]*<\/g>(?=<\/svg>)/, '');
  if (bg === back) throw new Error(`${scene} : groupe des formes introuvable`);
  writeFileSync(join(OUT, `${scene}-bg.svg`), bg);

  await toWebp(render(back, 'svg>path{display:none}', `${scene}-shapes`, SERVICE), join(OUT, `${scene}-shapes.webp`), SERVICE);
  for (const plane of ['site', 'card', 'phone', 'side']) {
    await toWebp(render(front, `svg>g:not(.sc-l--${plane}){display:none}`, `${scene}-${plane}`, SERVICE), join(OUT, `${scene}-${plane}.webp`), SERVICE);
  }
  console.log(scene, 'ok');
}

// Le Cuistologue (accueil) : le fond marine reste en SVG (trois dégradés), les formes (quart de disque, disque, arche) deviennent une image.
{
  const TEASER = { W: 1000, H: 460, PAD: 120 };
  const fond = readFileSync(join(SRC, 'cuistologue-fond.svg'), 'utf8');
  const bg = fond.replace(/<g class="sc-art-shapes">[\s\S]*<\/g>\s*(?=<defs>)/, '');
  if (bg === fond) throw new Error('cuistologue : groupe des formes introuvable');
  writeFileSync(join(OUT, 'cuistologue-bg.svg'), bg);
  await toWebp(render(fond, 'svg>g.sc-art-bg{display:none}', 'cuistologue-shapes', TEASER), join(OUT, 'cuistologue-shapes.webp'), TEASER);
  console.log('cuistologue ok');
}
rmSync(tmp, { recursive: true, force: true });
