import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://antoinebruneau.fr',
  integrations: [
    sitemap({
      // Pages noindex (voir BaseLayout) : exclues pour ne pas contredire la balise robots.
      filter: (page) => !/\/(cgv|confidentialite|cookies)\/?$/.test(page),
    }),
  ],
});
