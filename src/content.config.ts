import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/lessons' }),
  schema: z.object({
    title: z.string(),
    code: z.string().regex(/^\d\.\d$/),
    level: z.number().int().min(0).max(4),
    summary: z.string(),
    duration: z.string(),
    objectives: z.array(z.string()).min(2),
    status: z.enum(['khung', 'hoan-thien']).default('hoan-thien'),
  }),
});

export const collections = { lessons };
