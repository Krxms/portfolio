// Aplatit le disque orange et l'arche bleue qui dépassent derrière le panneau de contact (appel final) en deux images WebP à fond transparent.
// Chacune était un élément avec dégradés, ombres internes et externes, et une couche de béton en mix-blend-mode: soft-light. Elles sont
// rendues à la taille de référence (--orb = 240 px, la taille d'un grand écran) avec une marge pour l'ombre, puis reposées à la même place,
// à l'échelle de --orb (voir FinalCta.css).
// Sortie : src/assets/cta-orb.webp, src/assets/cta-arch.webp, src/assets/cta-shapes.json (marges en fraction de --orb)
// Prérequis : la page servie sur http://localhost:4399/ (npx astro build && npx astro preview --port 4399), Chrome installé.
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { writeFileSync } from 'node:fs';
import sharp from 'sharp';

const SCALE = 2;
const port = 9380;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', `--remote-debugging-port=${port}`, '--window-size=1440,1400', '--hide-scrollbars', '--no-first-run', `--user-data-dir=${tmpdir()}/bake-cta-shapes`, 'about:blank'], { stdio: 'ignore' });
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
await send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } });
await send('Page.navigate', { url: 'http://localhost:4399/' });
await sleep(4500);
await evalJs(`(async()=>{
  window.__lenis&&window.__lenis.destroy();
  const s=document.createElement('style');
  s.textContent='html,body,.tile,.dark-zone,.cta-final,.curtain,main{background:none!important}.dark-zone::before,.dark-zone::after,.tile::before,.tile::after,.site-header,.cta-panel,footer,.site-footer,.sticky-cta{display:none!important}body{overflow:visible!important}.cta-orb,.cta-shape{animation:none!important;transition:none!important;opacity:1!important;transform:none!important}';
  document.head.appendChild(s);
  const st=document.querySelector('.cta-stage');
  scrollTo({top:st.getBoundingClientRect().top+scrollY-400,behavior:'instant'});
  await new Promise(r=>setTimeout(r,2500));
})()`);
const rects = JSON.parse(await evalJs(`JSON.stringify(['.cta-orb','.cta-shape'].map(s=>{const r=document.querySelector(s).getBoundingClientRect();return [r.left+scrollX,r.top+scrollY,r.width,r.height]}))`));
const orbSize = rects[0][2];
const MARGIN = { orb: 0.3, arch: 0.1 }; // fraction de --orb : l'ombre portée du disque descend d'environ 0,2 --orb
const meta = {};
for (const [name, r] of [['orb', rects[0]], ['arch', rects[1]]]) {
  const m = MARGIN[name] * orbSize;
  const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: r[0] - m, y: r[1] - m, width: r[2] + 2 * m, height: r[3] + 2 * m, scale: 1 } });
  await sharp(Buffer.from(shot.result.data, 'base64')).webp({ quality: 88, alphaQuality: 95, effort: 6 }).toFile(`src/assets/cta-${name}.webp`);
  meta[name] = { margin: MARGIN[name], w: +(r[2] / orbSize).toFixed(4), h: +(r[3] / orbSize).toFixed(4) };
}
chrome.kill();
writeFileSync('src/assets/cta-shapes.json', JSON.stringify({ orbSize, ...meta }, null, 2));
console.log(JSON.stringify({ orbSize, ...meta }));
process.exit(0);
