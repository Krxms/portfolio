// llms-full.txt : le texte de toutes les pages indexables du site, en Markdown, écrit dans dist/ après la construction (intégration Astro).
// /llms.txt (public/) résume le site en quelques lignes ; ce fichier-ci donne le contenu complet, pour qu'un assistant IA puisse répondre et citer
// sans avoir à interpréter le HTML, les animations ni les décors. Il est tiré des pages construites (après la typographie) : il dit exactement
// ce que disent les pages, rien de plus. Seul le contenu de <main> est repris ; les éléments masqués (aria-hidden, hidden), les scripts, les
// styles, les SVG, les boutons et les champs de formulaire sont laissés de côté. Les pages en noindex et les pages d'erreur sont exclues.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = 'https://antoinebruneau.fr';
// Ordre de lecture : l'accueil, les offres, la preuve (projet), la personne, le contact ; le reste (pages légales) suit par ordre alphabétique.
const ORDER = ['/', '/creation-site-web/', '/refonte-site-web/', '/interfaces-logiciels/', '/audit-ux-ui/', '/projets/le-cuistologue/', '/a-propos/', '/contact/'];
const SKIP = new Set(['script', 'style', 'svg', 'noscript', 'template', 'button', 'select', 'textarea', 'input', 'label', 'form', 'video', 'audio', 'iframe', 'canvas', 'picture', 'img']);
const RAW = new Set(['script', 'style']);
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const INLINE = new Set(['span', 'small', 'strong', 'b', 'em', 'i', 'mark', 'time', 'abbr']);
const BLOCK = new Set(['p', 'div', 'section', 'article', 'header', 'footer', 'aside', 'nav', 'ul', 'ol', 'dl', 'dt', 'dd', 'figure', 'figcaption', 'blockquote', 'details', 'table', 'tr', 'main']);

const decode = (s) =>
  s
    .replace(/&nbsp;|&#160;|&#xa0;/gi, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

const attr = (attrs, name) => {
  const m = attrs.match(new RegExp(`\\s${name}(?:="([^"]*)"|='([^']*)'|(?=[\\s/>]|$))`, 'i'));
  return m ? (m[1] ?? m[2] ?? '') : null;
};

/** Convertit le HTML de <main> en Markdown simple : titres, paragraphes, listes, questions de FAQ, liens. */
export function htmlToMarkdown(html) {
  const lines = [];
  let buf = '';
  let prefix = '';
  let skip = null; // { tag, depth } : élément ignoré en cours, avec le nombre de balises de même nom ouvertes dedans
  let link = null; // lien en cours : { href, start }
  const flush = () => {
    // Frontière entre deux éléments en ligne (span, strong…) : le HTML les colle visuellement par la mise en page (« Téléphone » au-dessus
    // de « 06 09… »), le texte brut les collerait (« Téléphone06 »). Une espace est ajoutée quand un mot repart sur une majuscule ou un chiffre.
    const text = buf
      .replace(/(\S)\u0001+(?=[\p{Lu}\d])/gu, '$1 ')
      .replace(/\u0001/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (text) lines.push(prefix + text);
    buf = '';
    prefix = '';
  };
  const re = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g;
  let last = 0;
  let m;
  while ((m = re.exec(html))) {
    if (!skip) buf += decode(html.slice(last, m.index));
    last = re.lastIndex;
    if (!m[2]) continue; // commentaire
    const closing = m[1] === '/';
    const tag = m[2].toLowerCase();
    const attrs = m[3] || '';
    const selfClosing = VOID.has(tag) || /\/\s*$/.test(attrs);

    if (!closing && RAW.has(tag)) {
      const end = html.indexOf(`</${tag}`, last);
      last = re.lastIndex = end === -1 ? html.length : html.indexOf('>', end) + 1;
      continue;
    }
    if (skip) {
      if (tag === skip.tag && !selfClosing) {
        skip.depth += closing ? -1 : 1;
        if (skip.depth === 0) skip = null;
      }
      continue;
    }
    if (!closing && !selfClosing && (SKIP.has(tag) || attr(attrs, 'aria-hidden') === 'true' || attr(attrs, 'hidden') !== null)) {
      skip = { tag, depth: 1 };
      continue;
    }
    if (!closing && SKIP.has(tag)) continue; // élément vide ignoré (img, input…)

    if (tag === 'br') {
      buf += ' ';
    } else if (INLINE.has(tag)) {
      buf += '\u0001';
    } else if (/^h[1-6]$/.test(tag)) {
      flush();
      if (!closing) prefix = '#'.repeat(+tag[1]) + ' ';
    } else if (tag === 'li') {
      flush();
      if (!closing) prefix = '- ';
    } else if (tag === 'summary') {
      flush();
      if (!closing) prefix = '### ';
    } else if (tag === 'a') {
      if (!closing) {
        const href = attr(attrs, 'href');
        link = href && !href.startsWith('#') && !href.startsWith('javascript:') ? { href: new URL(href, SITE).href, start: buf.length } : null;
      } else if (link) {
        const text = buf.slice(link.start).replace(/\s+/g, ' ').replace(/^[\s\u0001]+|[\s\u0001]+$/g, '');
        if (text) buf = `${buf.slice(0, link.start)} [${text}](${link.href}) `;
        link = null;
      }
    } else if (BLOCK.has(tag)) {
      flush();
    }
  }
  if (!skip) buf += decode(html.slice(last));
  flush();
  // une seule ligne vide entre les blocs, et pas deux fois de suite la même ligne (texte doublé pour une version mobile, par exemple)
  return lines.filter((l, i) => l !== lines[i - 1]).join('\n\n');
}

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name !== '_astro') yield* walk(p);
    } else if (e.name.endsWith('.html')) yield p;
  }
}

export default function llmsFull() {
  return {
    name: 'llms-full',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const pages = [];
        for await (const file of walk(root)) {
          const rel = relative(root, file).split(sep).join('/');
          const url = '/' + rel.replace(/(^|\/)index\.html$/, '$1').replace(/\.html$/, '/');
          if (/^\/(404|erreurs)(\/|$)/.test(url)) continue;
          const html = await readFile(file, 'utf8');
          if (/<meta name="robots" content="[^"]*noindex/.test(html)) continue;
          const main = html.match(/<main\b[^>]*>([\s\S]*)<\/main>/);
          if (!main) continue;
          const title = decode((html.match(/<title>([^<]*)<\/title>/) || [])[1] || url);
          const description = decode((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '');
          pages.push({ url, title, description, body: htmlToMarkdown(main[1]) });
        }
        const rank = (u) => (ORDER.includes(u) ? ORDER.indexOf(u) : ORDER.length);
        pages.sort((a, b) => rank(a.url) - rank(b.url) || a.url.localeCompare(b.url));

        const out = [
          '# Antoine Bruneau, concepteur numérique indépendant : contenu complet du site',
          '',
          `> Texte intégral des pages publiques de ${SITE}, en Markdown, généré à chaque construction du site. Résumé et faits clés : ${SITE}/llms.txt`,
          '',
          ...pages.flatMap((p) => ['---', '', `Page : ${p.title}`, `URL : ${SITE}${p.url}`, ...(p.description ? [`Description : ${p.description}`] : []), '', p.body, '']),
        ].join('\n');
        await writeFile(join(root, 'llms-full.txt'), out, 'utf8');
        logger.info(`llms-full.txt écrit (${pages.length} pages, ${Math.round(out.length / 1024)} Ko)`);
      },
    },
  };
}
