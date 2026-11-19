// En-têtes de sécurité par page, générés après la construction (intégration Astro, voir astro.config.mjs).
// Content-Security-Policy : les scripts en ligne de chaque page (le contrôle de chargement des textures, les petits scripts de composants) sont
// autorisés par leur EMPREINTE (sha256), pas par « unsafe-inline » : un script injecté dans une page ne s'exécuterait pas. Les empreintes sont
// recalculées à chaque construction, et écrites route par route dans dist/_headers (les règles communes sont dans public/_headers).
// Les styles gardent « unsafe-inline » : les composants posent des variables CSS en attribut style.
import { createHash } from 'node:crypto';
import { readdir, readFile, appendFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name.endsWith('.html')) yield p;
  }
}

export function inlineScriptHashes(html) {
  const hashes = new Set();
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    const [, attrs, body] = m;
    if (/\bsrc\s*=/.test(attrs) || /type\s*=\s*["']application\/ld\+json["']/.test(attrs) || !body.trim()) continue;
    hashes.add(`'sha256-${createHash('sha256').update(body).digest('base64')}'`);
  }
  return [...hashes];
}

export function buildCsp(hashes, { turnstile = false } = {}) {
  const cf = turnstile ? ' https://challenges.cloudflare.com' : '';
  return [
    "default-src 'self'",
    `script-src 'self' ${hashes.join(' ')}${cf}`.replace(/\s+/g, ' ').trim(),
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    `connect-src 'self'${cf}`,
    turnstile ? "frame-src https://challenges.cloudflare.com" : "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    'upgrade-insecure-requests',
  ].join('; ');
}

export default function securityHeaders() {
  return {
    name: 'en-tetes-de-securite',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const root = fileURLToPath(dir);
        const turnstile = Boolean(process.env.PUBLIC_TURNSTILE_SITEKEY);
        let rules = '\n# --- Content-Security-Policy par page (généré par tools/security-headers.mjs : ne pas modifier à la main) ---\n';
        let n = 0;
        for await (const file of walk(root)) {
          const route = '/' + relative(root, file).split(sep).slice(0, -1).join('/');
          const rel = relative(root, file).split(sep).join('/');
          // une page « index.html » répond à /dossier/ ; un autre fichier (404.html) répond à son propre nom
          const path = rel.endsWith('index.html') ? (route === '/' ? '/' : `${route}/`) : `/${rel}`;
          const csp = buildCsp(inlineScriptHashes(await readFile(file, 'utf8')), { turnstile });
          rules += `${path}\n  Content-Security-Policy: ${csp}\n`;
          n++;
        }
        await appendFile(join(root, '_headers'), rules);
        console.log(`[sécurité] CSP écrite pour ${n} page(s)`);
      },
    },
  };
}
