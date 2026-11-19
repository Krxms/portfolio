// Image de partage (Open Graph / réseaux / messageries) : 1200 × 630, rendue par Chrome sans interface à partir d'un
// gabarit HTML qui reprend les polices, le fond et le souligné dessiné à la main du site, puis convertie en JPEG.
// Usage : node tools/og.mjs   →   public/og-image.jpg
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const u = (p) => pathToFileURL(path.join(root, p)).href;
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';

// Maillage du hero + souligné d'Antoine + logo (extrait de Logo.astro) : tout vient du dépôt, rien n'est inventé
const logoSvg = (readFileSync(path.join(root, 'src/components/Logo.astro'), 'utf8').match(/<svg[\s\S]*?<\/svg>/) || [''])[0]
  .replace(/width="48" height="85"/, 'width="40" height="71"');
const underline = readFileSync(path.join(root, 'src/assets/marks/underline-arrow.svg'), 'utf8')
  .replace(/<svg\s/, '<svg preserveAspectRatio="none" ')
  .replace(/ width="[\d.]+"/, '').replace(/ height="[\d.]+"/, '')
  .replace(/fill="black"/g, 'fill="#e8764f"');

const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>
@font-face{font-family:'Be Vietnam Pro';font-weight:500;src:url('${u('public/fonts/be-vietnam-pro-500.woff2')}')}
@font-face{font-family:'Be Vietnam Pro';font-weight:600;src:url('${u('public/fonts/be-vietnam-pro-600.woff2')}')}
@font-face{font-family:'Bricolage Grotesque';font-weight:200 800;src:url('${u('public/fonts/bricolage-grotesque-200-800.woff2')}')}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;overflow:hidden;position:relative;color:#12202b;font-family:'Be Vietnam Pro',sans-serif;
  background:#f5f3ea url('${u('src/assets/mesh/hero.webp')}') center/cover no-repeat}
.brand{position:absolute;left:72px;top:54px;display:flex;align-items:center;gap:18px;font-weight:600;font-size:30px;letter-spacing:-.01em}
.brand svg{display:block;color:#202559}
.role{position:absolute;left:72px;top:176px;font-weight:500;font-size:31px;letter-spacing:-.005em}
h1{position:absolute;left:72px;top:226px;font-family:'Bricolage Grotesque',sans-serif;font-weight:700;font-size:112px;line-height:.98;letter-spacing:-.03em}
h1 span{display:block}
.l2{color:#14509a}
.word{position:relative;display:inline-block}
.word svg{position:absolute;left:-2%;top:88%;width:104%;height:.4em;overflow:visible}
.foot{position:absolute;left:72px;right:72px;bottom:50px;display:flex;justify-content:space-between;align-items:center;font-size:27px;font-weight:500;color:#3a4955}
.foot b{font-weight:600;color:#12202b}
</style></head><body>
<div class="brand">${logoSvg}<span>Antoine Bruneau</span></div>
<div class="role">Webdesigner &amp; designer UX/UI freelance · Yvelines</div>
<h1><span>Votre site,</span><span class="l2">avec du <em class="word" style="font-style:normal">caractère${underline}</em>.</span></h1>
<div class="foot"><span>Création de site · Refonte · Audit UX/UI</span><b>antoinebruneau.fr</b></div>
</body></html>`;

mkdirSync(path.join(root, 'tools/og'), { recursive: true });
const htmlFile = path.join(root, 'tools/og/_og.html');
const pngFile = path.join(root, 'tools/og/_og.png');
writeFileSync(htmlFile, html);

execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', '--window-size=1200,630', '--virtual-time-budget=4000', `--screenshot=${pngFile}`, pathToFileURL(htmlFile).href], { stdio: 'ignore', timeout: 60000 });

const info = await sharp(pngFile).resize(1200, 630).jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(root, 'public/og-image.jpg'));
console.log('og-image.jpg', info.width, info.height, Math.round(info.size / 1024) + ' Ko');
