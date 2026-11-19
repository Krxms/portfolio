# Portfolio — Antoine Bruneau

Site vitrine d'Antoine Bruneau, webdesigner et designer UX/UI freelance (Yvelines). Il présente trois offres (création, refonte, audit d'interfaces), un projet réalisé et la manière de travailler. Le site est statique, construit avec [Astro](https://astro.build), et déployé sur Cloudflare (fichiers statiques et un Worker pour le formulaire de contact).

## Démarrer

```bash
npm install      # une seule fois
npm run dev      # serveur local sur http://localhost:4321
npm run build    # génère le site statique dans dist/
npm run preview  # sert dist/ en local
npm run deploy   # build puis déploiement Cloudflare (wrangler)
```

Le déploiement publie le site en production : à ne lancer qu'après validation.

## Structure

```
src/
├── pages/          Une page par route (index, création, refonte, audit, à propos, contact, projet, pages légales).
│                   Le CSS propre à une page vit à côté (creation-site-web.css, contact.css…).
├── components/     Un composant par section, avec son CSS (Hero, ExplodedProcess, ServiceCards, ProjectTeaser, Faq…).
├── layouts/        BaseLayout : <head>, SEO et données structurées, en-tête, pied de page, scripts globaux.
├── scripts/        scenes.js (animations liées au défilement), site.js (Lenis, survols), contactForm.js (formulaire).
├── styles/         tokens.css (variables), global.css, matiere.css, cta.css, glass.css, scenes.css, motion.css, fonts.css.
├── data/           reviews.ts : les avis clients (le bloc n'apparaît que si la liste n'est pas vide).
└── assets/         Images, textures (riso/, mesh/) et tracés SVG faits main (marks/).
public/             Polices, favicons, image de partage, robots.txt, llms.txt, _headers (en-têtes Cloudflare).
worker/index.js     Worker Cloudflare : sert dist/ et traite l'envoi du formulaire (/api/contact, via Resend).
tools/              Scripts qui génèrent les textures et images du site (voir plus bas).
design-system/      tokens.json : copie des variables du fichier Figma de la charte.
```

## Conventions

- **Tokens** : couleurs, rayons, espacements et polices sont des variables CSS définies dans `src/styles/tokens.css`. Elles reprennent la charte Figma (`design-system/tokens.json`) ; on écrit un rôle (`--signal`, `--ink`), jamais une teinte brute.
- **CSS** : un fichier par composant, importé par ce composant. Les règles partagées (boutons, matière, verre) sont dans `src/styles/` ; leurs sélecteurs sont préfixés par `html` quand ils doivent passer devant ceux des composants.
- **Animations** : tout ce qui bouge au défilement passe par `transform`, `opacity` ou les propriétés `translate`/`scale`, rendues par la carte graphique. Chaque animation est coupée avec `prefers-reduced-motion`.
- **Textes** : en français, avec les mots du métier (webdesigner, UX/UI, création de site) dans les titres et méta-descriptions. Les questions de la FAQ de l'accueil sont reprises telles quelles dans les données structurées (`FAQPage`).
- **Mise en forme des textes** : tous les titres, sous-titres et paragraphes des pages et des composants acceptent, dans leur chaîne de caractères, `\n` (retour à la ligne), `*italique*`, `**gras**` et le HTML (`<em>`, `<br>`, `<span class="…">`…). Exemple : `title="Parlons de ce que\nvous voulez *construire*."`. Le rendu passe par `src/components/R.astro` et `src/lib/fmt.ts`. Restent en texte brut, sans mise en forme : `<title>`, meta description, `alt`, `aria-label` et le JSON-LD (via `plain()`, qui retire les marques). Les textes écrits directement dans le balisage d'un composant (Hero, manifeste, bloc « Qui suis-je ») s'écrivent en HTML ordinaire. Ne pas utiliser `*` pour autre chose que l'italique.
- **Textes provisoires** : repérés par un commentaire `TODO` dans le code (page À propos, projets en cours).

## Outils de génération

Les scripts de `tools/` produisent des fichiers déjà versionnés ; on ne les relance que pour les modifier. Ils utilisent `sharp` (installé avec Astro).

| Script | Produit |
| --- | --- |
| `gen-mesh.mjs` | Dégradés de fond (`src/assets/mesh/`) : hero, tuiles sombres |
| `concrete-tile.mjs` | Tuile de béton raccordable (`src/assets/riso/concrete-tile.webp`), tirée de la photo de béton du site |
| `stoneware-tile.mjs` | Textures grès et mouchetures (`src/assets/riso/stoneware.webp`, `flecks.webp`) |
| `film-grain.mjs` | Grain argentique de la Hero (`film-grain.webp`) |
| `riso-speck-tile.mjs` | Manques d'encre (`speck.png`) |
| `portrait-cine.mjs` | Portrait étalonné (`portrait-cine.webp`) |
| `prep-cuistologue-print.cjs` | Visuels print du projet Le Cuistologue, données personnelles floutées |
| `og.mjs` | Image de partage (`public/og-image.jpg`) |
| `favicons.mjs` | Favicons à partir de `public/favicon.svg` |
| `audit-contrast.cjs` | Audit de contraste sur fonds réels (usage ponctuel) |

## Production

- Domaine : `antoinebruneau.fr` (voir `astro.config.mjs`).
- Formulaire de contact : le Worker envoie le message avec l'API Resend. Il lit les variables `EMAIL_FROM` et `EMAIL_TO` (dans `wrangler.jsonc`) et le secret `RESEND_API_KEY` (à poser avec `wrangler secret put RESEND_API_KEY`).
- Anti-spam du formulaire (aucune action demandée au visiteur) : champ piège invisible, jeton signé et horodaté demandé à `/api/form-token` (accepté entre 3 s et 2 h après le chargement), même origine obligatoire, 5 envois par IP et par 10 minutes (par instance du Worker), pas plus de deux liens dans le message. Facultatif et recommandé : secret `FORM_SECRET` (`wrangler secret put FORM_SECRET`, sinon la clé Resend sert à signer), une règle de limitation de débit Cloudflare sur `/api/*` (tableau de bord : Sécurité, Règles de limitation de débit), et Cloudflare Turnstile en mode invisible : créer le widget, poser le secret `TURNSTILE_SECRET` sur le Worker et la clé publique `PUBLIC_TURNSTILE_SITEKEY` au moment de la construction (`PUBLIC_TURNSTILE_SITEKEY=... npm run build`) ; la politique CSP autorise alors automatiquement `challenges.cloudflare.com`.
- Sécurité : `public/_headers` pose les en-têtes communs (HSTS, COOP, CORP, Permissions-Policy…) ; `tools/security-headers.mjs` ajoute à `dist/_headers` une Content-Security-Policy par page, avec l'empreinte sha256 de chacun de ses scripts en ligne (pas de `unsafe-inline` pour les scripts). `/.well-known/security.txt` expire le 2027-11-05 : à renouveler.
- Typographie : `tools/typography.mjs` applique après la construction l'apostrophe typographique, les points de suspension et les espaces insécables (avant `: ; ! ?`, dans les guillemets, entre un nombre et son unité) aux textes de toutes les pages.
- Textures : les petites textures des fonds bleus (grains fins, mouchetures, boutons, fonds des sections sombres) sont intégrées au CSS en base 64 (`src/styles/textures.css`, généré par `node tools/inline-textures.mjs` : à relancer si l'un de ces fichiers change) : les fonds bleus sont texturés dès la première image, comme le papier de la page. Les textures lourdes (grès, grain de pellicule) sont préchargées ; celles des formes (béton) le sont avec une priorité basse. Rien n'est caché en attendant.
- Les pages CGV, confidentialité et cookies sont en `noindex` et exclues du sitemap.
- Erreurs et redirections : `src/pages/erreurs/[code].astro` génère une page par code (400, 403, 404, 405, 410, 429, 500, 503) et `src/pages/404.astro` la page 404 de Cloudflare ; le Worker (`worker/index.js`) les sert avec le bon statut HTTP, sans cache ni indexation. Il répond aussi 405 aux méthodes non permises, 500 en cas d'exception, et 503 (avec `Retry-After`) si la variable `MAINTENANCE` vaut `1` sur le Worker. `public/_redirects` liste les redirections 301 (anciennes adresses, variantes, fautes de frappe).
- Chargement : les pages liées sont préchargées au survol, au focus ou au toucher d'un lien (`prefetch` dans `astro.config.mjs`) ; un filet orange et bleu en haut de l'écran signale le chargement d'une page et chaque clic sur un lien interne (`#nav-progress`, BaseLayout.astro et global.css).
