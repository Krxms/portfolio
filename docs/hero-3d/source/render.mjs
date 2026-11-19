// node render.mjs <vue> <sortie.png> [w] [h]
import puppeteer from 'puppeteer-core';
import http from 'node:http';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { extname, join } from 'node:path';

const [view = 'desktop', out = 'out.png', w, h] = process.argv.slice(2);
const root = process.cwd();
const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript' };
const srv = http.createServer((req, res) => {
  const p = join(root, decodeURIComponent(req.url.split('?')[0]).replace(/^\/$/, '/scene.html'));
  if (!existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[extname(p)] || 'application/octet-stream' });
  res.end(readFileSync(p));
}).listen(8765);

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'],
});
const page = await browser.newPage();
page.on('console', (m) => console.log('[page]', m.text()));
page.on('pageerror', (e) => console.log('[err]', e.message));
await page.setViewport({ width: 800, height: 600 });
const q = `?view=${view}` + (w ? `&w=${w}&h=${h}` : '');
await page.goto(`http://localhost:8765/${q}`, { waitUntil: 'load' });
await page.waitForFunction('window.__done === true', { timeout: 280000 });
const data = await page.evaluate('window.__png');
writeFileSync(out, Buffer.from(data.split(',')[1], 'base64'));
console.log('ok', out);
await browser.close();
srv.close();
