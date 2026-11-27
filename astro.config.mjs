import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import typography from './tools/typography.mjs';
import securityHeaders from './tools/security-headers.mjs';

export default defineConfig({
  site: 'https://antoinebruneau.fr',
  // Les pages liées sont préchargées au survol, au focus ou au toucher d'un lien : le clic suivant est presque instantané.
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  // Serveur de développement seulement : autorise les adresses publiques de ngrok (sinon Vite refuse l'en-tête Host d'un domaine inconnu).
  // CSS minifié par esbuild et non par lightningcss : ce dernier fusionne « animation-timeline » dans le raccourci « animation » (animation: linear both mf-rise view()),
  // que Safari et les Chrome un peu anciens rejettent en bloc : les animations liées au défilement (apparitions, scènes) n'y démarraient jamais et restaient invisibles.
  vite: { build: { cssMinify: 'esbuild' }, server: { allowedHosts: ['.ngrok-free.app', '.ngrok-free.dev', '.ngrok.app', '.ngrok.dev', '.ngrok.io'] } },
  integrations: [
    // typographie française (apostrophes, espaces insécables) appliquée aux textes de toutes les pages après la construction
    typography(),
    // Content-Security-Policy par page (empreintes des scripts en ligne), écrite dans dist/_headers
    securityHeaders(),
    sitemap({
      // Pages noindex (voir BaseLayout) : exclues pour ne pas contredire la balise robots.
      filter: (page) => !/\/(cgv|confidentialite|cookies)\/?$/.test(page) && !/\/(404|erreurs)(\/|$)/.test(page),
    }),
  ],
});
