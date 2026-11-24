// Aplatit chaque forme de la Hero (accueil) et des en-têtes de page de service en SON PROPRE WebP à fond transparent : une image par élément, jamais de groupe.
// Chaque forme garde son élément HTML et sa position / sa taille en CSS (HeroAtelier.css, PageHero.css) : l'image se place dans la boîte de l'élément, en
// pourcentages (voir src/components/HeroAmbient.astro et PageHero.astro), donc déplacer ou redimensionner une forme se fait toujours dans le CSS, comme avant.
// Les formes d'origine (dégradés, ombres, béton, clip-path) restent dans le CSS : la classe html.hero-live les remet en service (c'est ce rendu que ce script
// enregistre), et elles servent encore sur téléphone. Pour modifier une forme : changer son CSS, puis relancer ce script.
//
// Sortie : src/assets/layers/<jeu>/<nom>.webp + src/assets/layers/<jeu>.json (décalage et taille de l'image en % de la boîte de l'élément)
// Prérequis : le site servi sur http://localhost:4399/ (npx astro build && npx astro preview --port 4399), Chrome installé.
// Usage : node tools/bake-layers.mjs
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { mkdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const SCALE = 2;
const VW = 1440;
const VH = 1500;
const SETS = {
  hero: {
    url: '/',
    zone: '.hero-zone--atelier',
    elements: [
      ['arch-pale', '.at-arch-pale'],
      ['arch-mint', '.at-arch-mint'],
      ['arch', '.at-arch'],
      ['orb', '.at-orb'],
      ['window', '.at-window'],
    ],
  },
  page: {
    url: '/interfaces-logiciels/',
    zone: '.hero-zone--page',
    elements: [
      ['dash', '.ph-dash'],
      ['pill', '.ph-pill'],
      ['disc', '.ph-disc'],
      ['quarter', '.ph-quarter'],
    ],
  },
};

const port = 9395;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, `--window-size=${VW},${VH}`, '--hide-scrollbars', '--no-first-run', `--user-data-dir=${tmpdir()}/bake-layers`, 'about:blank'], { stdio: 'ignore' });
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

for (const [setName, set] of Object.entries(SETS)) {
  mkdirSync(`src/assets/layers/${setName}`, { recursive: true });
  await send('Page.navigate', { url: `http://localhost:4399${set.url}` });
  await sleep(4500);
  await evalJs(`(async()=>{
    const d=document.documentElement;d.classList.remove('has-loader');d.classList.add('hero-live');
    window.__lenis&&window.__lenis.destroy();
    const s=document.createElement('style');
    s.id='bake-style';
    s.textContent='html,body,main,.curtain,.hero-zone,.amb,.amb-atelier{background:transparent!important}.site-header,.hero-zone .hero,.hero-zone .ph-grid,.hero-zone ~ *,.at-comp,.at-bake,.at-film,.at-lift{visibility:hidden!important}${set.zone} *{animation:none!important;transition:none!important}.bake-only{rotate:none!important}${set.zone} .amb-atelier > *:not(.bake-only){visibility:hidden!important}${set.zone} .amb-atelier .bake-only,${set.zone} .amb-atelier .bake-only *{visibility:visible!important}';
    document.head.appendChild(s);
    scrollTo(0,0);
    await new Promise(r=>setTimeout(r,1500));
  })()`);
  const meta = {};
  for (const [name, sel] of set.elements) {
    const info = JSON.parse(await evalJs(`JSON.stringify((()=>{
      document.querySelectorAll('.bake-only').forEach(e=>e.classList.remove('bake-only'));
      const el=document.querySelector('${set.zone} ${sel}');
      if(!el) return {missing:true};
      if(getComputedStyle(el).display==='none') return {hidden:true};
      el.classList.add('bake-only');
      const prev=el.style.getPropertyValue('transform');
      el.style.setProperty('transform','none','important');
      const r=el.getBoundingClientRect();
      el.style.removeProperty('transform');
      if(prev) el.style.setProperty('transform',prev);
      return {x:r.left+scrollX,y:r.top+scrollY,w:r.width,h:r.height};
    })())`));
    if (info.missing || info.hidden) { console.log(setName, name, info.missing ? 'introuvable' : 'masqué : ignoré'); continue; }
    await sleep(300);
    const m = Math.max(info.w, info.h) * 0.4 + 60;
    const cx = Math.max(0, info.x - m);
    const cy = Math.max(0, info.y - m);
    const cw = Math.min(info.x + info.w + m, VW) - cx;
    const ch = info.y + info.h + m - cy;
    const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: cx, y: cy, width: cw, height: ch, scale: 1 }, captureBeyondViewport: true });
    const png = Buffer.from(shot.result.data, 'base64');
    const { data, info: pi } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    let x0 = pi.width, y0 = pi.height, x1 = -1, y1 = -1;
    for (let y = 0; y < pi.height; y++) for (let x = 0; x < pi.width; x++) if (data[(y * pi.width + x) * 4 + 3] > 2) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (x1 < 0) { console.log(setName, name, 'vide'); continue; }
    const w = x1 - x0 + 1; const h = y1 - y0 + 1;
    await sharp(png).extract({ left: x0, top: y0, width: w, height: h }).webp({ quality: 82, alphaQuality: 86, effort: 6 }).toFile(`src/assets/layers/${setName}/${name}.webp`);
    const pct = (v, base) => +((v / base) * 100).toFixed(4);
    const anchored = name.startsWith('arch');
    meta[name] = anchored ? {
      left: pct(cx + x0 / SCALE - info.x, info.w),
      width: pct(w / SCALE, info.w),
      ty: +((y0 - (info.y - cy) * SCALE) / h * 100).toFixed(4),
      px: [w, h],
    } : {
      left: pct(cx + x0 / SCALE - info.x, info.w),
      top: pct(cy + y0 / SCALE - info.y, info.h),
      width: pct(w / SCALE, info.w),
      height: pct(h / SCALE, info.h),
      px: [w, h],
    };
    console.log(setName, name, `${w}x${h}`, JSON.stringify(meta[name]));
  }
  writeFileSync(`src/assets/layers/${setName}.json`, JSON.stringify(meta, null, 2));
}
chrome.kill();
process.exit(0);
