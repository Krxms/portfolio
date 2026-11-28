// Date de dernière modification d'une page, d'après l'historique git de son fichier source (src/pages/…).
// Sert au <lastmod> du sitemap et au « dateModified » du JSON-LD : un signal de fraîcheur pour les moteurs et les assistants IA.
// Hors dépôt git (ou fichier jamais commité), la fonction renvoie undefined et rien n'est publié : on n'invente pas de date.
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const cache = new Map();

/** Chemin d'URL (« / », « /contact/ », « /projets/le-cuistologue/ ») vers le fichier source de la page. */
function sourceOf(pathname) {
  const slug = pathname.replace(/^\/+|\/+$/g, '');
  const candidates = slug ? [`src/pages/${slug}.astro`, `src/pages/${slug}/index.astro`] : ['src/pages/index.astro'];
  return candidates.find((f) => existsSync(new URL(`../${f}`, import.meta.url)));
}

/** Date ISO 8601 du dernier commit qui a touché la page, ou undefined. */
export function lastModified(pathname) {
  if (cache.has(pathname)) return cache.get(pathname);
  let date;
  const file = sourceOf(pathname);
  if (file) {
    try {
      date = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() || undefined;
    } catch {
      date = undefined;
    }
  }
  cache.set(pathname, date);
  return date;
}
