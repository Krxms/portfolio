// Aplatit le FOND des illustrations des pages de service (Création, Refonte, Audit) en une image WebP par page.
// Le fond était fait de trois couches empilées : un SVG de dégradés (le bleu et ses lueurs), l'image des formes (disque, arche, quart de disque), puis deux
// calques CSS en mélange « soft-light » (le béton et le grain, .cs-stage::before et ::after dans creation-site-web.css). Ici, la page est rendue dans Chrome sans
// les maquettes de devant, et le résultat est enregistré : une seule image opaque, sans mélange à l'exécution. Les quatre plans de maquettes restent des
// images séparées (ils gardent leur parallaxe).
//
// Sortie : src/assets/scenes/<scène>-back.webp (cadre complet, résolution 1,5 x)
// Prérequis : la page servie sur http://localhost:4399/ (npx astro build && npx astro preview --port 4399), Chrome installé.
// Usage : node tools/bake-scene-back.mjs
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import sharp from 'sharp';

const SCALE = 1.5;
const PAGES = { creation: '/creation-site-web/', refonte: '/refonte-site-web/', audit: '/audit-ux-ui/' };
const port = 9390;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, '--window-size=1440,1400', '--hide-scrollbars', '--no-first-run', `--user-data-dir=${tmpdir()}/bake-scene-back`, 'about:blank'], { stdio: 'ignore' });
let list;
for (let i = 0; i < 40; i++) { try { list = await (await fetch(`http://localhost:${port}/json`)).json(); if (list.length) break; } catch {} await sleep(250); }
const ws = new WebSocket(list.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pending = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const evalJs = async (expression) => (await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result.result.value;
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1400, deviceScaleFactor: SCALE, mobile: false });

for (const [scene, path] of Object.entries(PAGES)) {
  await send('Page.navigate', { url: `http://localhost:4399${path}` });
  await sleep(4500);
  await evalJs(`(async()=>{
    window.__lenis&&window.__lenis.destroy();
    const s=document.createElement('style');
    s.textContent='.cs-art--front,.site-header{display:none!important}.cs-stage,.cs-stage *{animation:none!important;transition:none!important}.cs-art-img{translate:none!important}';
    document.head.appendChild(s);
    const st=document.querySelector('.cs-stage');
    scrollTo({top:st.getBoundingClientRect().top+scrollY-200,behavior:'instant'});
    await new Promise(r=>setTimeout(r,2500));
  })()`);
  const r = JSON.parse(await evalJs(`JSON.stringify((()=>{const b=document.querySelector('.cs-stage').getBoundingClientRect();return [b.left+scrollX,b.top+scrollY,b.width,b.height]})())`));
  const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: r[0], y: r[1], width: r[2], height: r[3], scale: 1 } });
  const out = `src/assets/scenes/${scene}-back.webp`;
  await sharp(Buffer.from(shot.result.data, 'base64')).webp({ quality: 84, effort: 6 }).toFile(out);
  const m = await sharp(out).metadata();
  console.log(scene, `${m.width}x${m.height}`, `cadre ${r[2].toFixed(0)}x${r[3].toFixed(0)}`);
}
chrome.kill();
process.exit(0);
