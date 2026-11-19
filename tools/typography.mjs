// Typographie française appliquée à toutes les pages après la construction (intégration Astro, voir astro.config.mjs).
// Seuls les TEXTES visibles sont touchés (jamais le code, les attributs, le JSON-LD ni les scripts). Règles :
//   - apostrophe droite entre deux lettres  →  apostrophe typographique (l'adresse → l’adresse) ;
//   - « ... »  →  « … » ;
//   - espace insécable avant « : ; ! ? » et à l'intérieur des guillemets « » : le signe ne passe jamais seul à la ligne ;
//   - espace insécable entre un nombre et son unité (24 h, 5 %, 12 €), et dans les numéros groupés (06 09 11 18 38, SIREN).
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const NB = '\u00A0';
const SKIP = /^(script|style|svg|pre|code|textarea|noscript)$/i;

export function frenchTypography(text) {
  return text
    // l'apostrophe droite peut \u00eatre \u00e9crite telle quelle ou en entit\u00e9 HTML (&#39;), selon que le texte vient d'un attribut ou d'un composant
    .replace(/(\p{L})(?:'|&#39;|&#x27;)(\p{L})/gu, '$1\u2019$2')
    .replace(/\.\.\./g, '\u2026')
    .replace(/ ([:;!?»])/g, `${NB}$1`)
    .replace(/« /g, `«${NB}`)
    .replace(/(\d) (h|min|km|€|%|jours?|mois|ans?|Ko|Mo|Go)\b/g, `$1${NB}$2`)
    .replace(/\b(\d{2}) (\d{2}) (\d{2}) (\d{2}) (\d{2})\b/g, `$1${NB}$2${NB}$3${NB}$4${NB}$5`)
    .replace(/\b(\d{3}) (\d{3}) (\d{3})\b/g, `$1${NB}$2${NB}$3`);
}

export function transformHtml(html) {
  // Parcours à la main : le contenu des balises « brutes » (script, style, svg…) peut contenir des « < » ou des « > » qui tromperaient un découpage
  // par expression régulière. On saute directement à leur balise fermante.
  let out = '';
  let i = 0;
  const n = html.length;
  while (i < n) {
    const lt = html.indexOf('<', i);
    if (lt === -1) {
      out += frenchTypography(html.slice(i));
      break;
    }
    out += frenchTypography(html.slice(i, lt));
    if (html.startsWith('<!--', lt)) {
      const end = html.indexOf('-->', lt);
      const stop = end === -1 ? n : end + 3;
      out += html.slice(lt, stop);
      i = stop;
      continue;
    }
    const gt = html.indexOf('>', lt);
    if (gt === -1) {
      out += html.slice(lt);
      break;
    }
    const tag = html.slice(lt, gt + 1);
    out += tag;
    i = gt + 1;
    const m = tag.match(/^<([a-zA-Z0-9-]+)/);
    if (m && SKIP.test(m[1]) && !tag.endsWith('/>')) {
      const close = html.toLowerCase().indexOf(`</${m[1].toLowerCase()}`, i);
      const stop = close === -1 ? n : close;
      out += html.slice(i, stop);
      i = stop;
    }
  }
  return out;
}

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name.endsWith('.html')) yield p;
  }
}

export default function typography() {
  return {
    name: 'typographie-francaise',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        let n = 0;
        for await (const file of walk(fileURLToPath(dir))) {
          const html = await readFile(file, 'utf8');
          const next = transformHtml(html);
          if (next !== html) {
            await writeFile(file, next);
            n++;
          }
        }
        console.log(`[typographie] ${n} page(s) corrigée(s)`);
      },
    },
  };
}
