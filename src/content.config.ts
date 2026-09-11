import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projets = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projets' }),
  schema: z.object({
    title: z.string(),
    sector: z.string(),
    tags: z.array(z.string()),
    summary: z.string(),
    variant: z.number().min(1).max(4),
    order: z.number(),
    brief: z.string(),
    approach: z.string(),
    outcome: z.string(),
  }),
});

export const collections = { projets };
