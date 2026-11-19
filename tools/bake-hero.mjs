// Aplatit la composition de la Hero de l'accueil (ordinateur, à partir de 901 px) en UNE image WebP à fond transparent.
// La composition est une affiche à l'échelle de la largeur (toutes ses positions sont en vw) : arches, volume de béton, disque, fenêtre, anneau,
// quart de disque. Une dizaine d'éléments avec fusions de béton, ombres internes et clip-path deviennent une image décodée une fois et déplacée
// par le GPU. Le papier, la grille, le voile de lisibilité et le grain argentique restent en CSS (ils sont dessous et dessus).
//
// Sortie : src/assets/hero-composition.webp et src/assets/hero-composition.json (position et largeur en vw, à reporter dans HeroAtelier.css).
// Prérequis : la page servie sur http://localhost:4399/ (npx astro build && npx astro preview --port 4399), Chrome installé.
// Usage : node tools/bake-hero.mjs
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { writeFileSync } from 'node:fs';
import sharp from 'sharp';

const VW = 1440;
const VH = 1000; // la zone de la Hero plafonne à 980 px : on prend toute sa hauteur
const SCALE = 2;
const port = 9350;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--window-size=${VW},${VH}`, '--hide-scrollbars', '--no-first-run', `--user-data-dir=${tmpdir()}/bake-hero`, 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40; i++) { try { list = await (await fetch(`http://localhost:${port}/json`)).json(); if (list.length) break; } catch {} await sleep(250); }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const evalJs = async (expression) => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result.result.value;

await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: VW, height: VH, deviceScaleFactor: SCALE, mobile: false });
await send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });
await send('Page.navigate', { url: 'http://localhost:4399/' });
await sleep(4500);
await evalJs(`(async()=>{
  document.documentElement.classList.remove('has-loader');
  const s=document.createElement('style');
  s.textContent='html,body{background:transparent!important}.site-header,.hero-zone .hero,.hero-zone ~ *,.at-paper,.at-grid,.at-lift,.at-film,.at-dot{display:none!important}.hero-zone::before,.hero-zone::after,.amb::before,.amb::after,.amb-atelier::before,.amb-atelier::after,.curtain::before,.curtain::after,.pblur,.veil{display:none!important}.hero-zone,.curtain,main,.hero-zone--atelier{background:none!important}';
  document.head.appendChild(s);
  window.scrollTo(0,0);
  await new Promise(r=>setTimeout(r,1500));
})()`);
const r = JSON.parse(await evalJs(`JSON.stringify((()=>{const a=document.querySelector('.amb-atelier').getBoundingClientRect();const z=document.querySelector('.hero-zone').getBoundingClientRect();return {amb:[a.left,a.top,a.width,a.height],zone:[z.left,z.top,z.width,z.height],atY:getComputedStyle(document.querySelector('.amb-atelier')).getPropertyValue('--at-y')}})())`));
const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: r.amb[0], y: r.amb[1], width: r.amb[2], height: r.amb[3], scale: 1 }, captureBeyondViewport: false });
chrome.kill();
const png = Buffer.from(shot.result.data, 'base64');
const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
let x0 = info.width, y0 = info.height, x1 = 0, y1 = 0;
for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) if (data[(y * info.width + x) * 4 + 3] > 2) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
const w = x1 - x0 + 1; const h = y1 - y0 + 1;
await sharp(png).extract({ left: x0, top: y0, width: w, height: h }).webp({ quality: 86, alphaQuality: 92, effort: 6 }).toFile('src/assets/hero-composition.webp');
// position en vw, relative à .amb-atelier (à 1440 px, --at-y vaut 0 : voir HeroAtelier.css)
const f = (v) => +(v / SCALE / VW * 100).toFixed(4);
const meta = { left: f(x0), top: f(y0), width: f(w), aspect: +(w / h).toFixed(5), atY: r.atY, pxW: w, pxH: h };
writeFileSync('src/assets/hero-composition.json', JSON.stringify(meta, null, 2));
console.log(JSON.stringify(meta), JSON.stringify(r.amb));
process.exit(0);
