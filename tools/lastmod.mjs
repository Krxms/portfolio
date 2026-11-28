// Date de dernière modification d'une page, d'après l'historique git de son fichier source (src/pages/…).
// Sert au <lastmod> du sitemap et au « dateModified » du JSON-LD : un signal de fraîcheur pour les moteurs et les assistants IA.
// Hors dépôt git (ou fichier jamais commité), la fonction renvoie undefined et rien n'est publié : on n'invente pas de date.
//
// Le dossier du projet est le répertoire de travail de la construction (process.cwd()) et non l'emplacement de ce fichier : une fois
// rassemblé par Vite pour le rendu des pages, ce module ne vit plus dans tools/, et un chemin relatif à import.meta.url ne trouvait plus src/pages/.
//
// Construction sur Cloudflare : le dépôt y est cloné sans son historique (clone superficiel), et toutes les pages auraient la date du dernier
// commit. L'historique est donc complété une fois (git fetch --unshallow) ; si c'est impossible, aucune date n'est publiée plutôt qu'une date fausse.
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const cache = new Map();
let history; // true : historique complet disponible ; false : pas de git ou historique tronqué

const git = (args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();

function hasHistory() {
  if (history !== undefined) return history;
  try {
    if (git(['rev-parse', '--is-shallow-repository']) === 'true') git(['fetch', '--unshallow', '--quiet']);
    history = git(['rev-parse', '--is-shallow-repository']) === 'false';
  } catch {
    history = false;
  }
  return history;
}

/** Chemin d'URL (« / », « /contact/ », « /projets/le-cuistologue/ ») vers le fichier source de la page. */
function sourceOf(pathname) {
  const slug = pathname.replace(/^\/+|\/+$/g, '');
  const candidates = slug ? [`src/pages/${slug}.astro`, `src/pages/${slug}/index.astro`] : ['src/pages/index.astro'];
  return candidates.find((f) => existsSync(join(root, f)));
}

/** Date ISO 8601 du dernier commit qui a touché la page, ou undefined. */
export function lastModified(pathname) {
  if (cache.has(pathname)) return cache.get(pathname);
  let date;
  const file = sourceOf(pathname);
  if (file && hasHistory()) {
    try {
      date = git(['log', '-1', '--format=%cI', '--', file]) || undefined;
    } catch {
      date = undefined;
    }
  }
  cache.set(pathname, date);
  return date;
}
