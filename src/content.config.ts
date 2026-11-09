import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    // short subtitle shown under the title, e.g. "Agentic integration layer for Laravel"
    tagline: z.string().max(60).optional(),
    summary: z.string().max(200),
    // short headline result shown first in Selected work, e.g. "100K+ users"
    impact: z.string().max(28).optional(),
    // startup = my own company, collaboration = team/client/open-source work, personal = solo side project
    kind: z.enum(['startup', 'collaboration', 'personal']),
    visibility: z.enum(['public', 'private']),
    role: z.string().optional(),
    org: z.string().optional(),
    period: z.coerce.string(),
    stack: z.array(z.string()).default([]),
    badge: z.string().optional(),
    // up to 4 parts or wins shown as a strip on the Work card, e.g. web + mobile, or merged PRs
    highlights: z
      .array(z.object({ name: z.string(), detail: z.string().optional() }))
      .max(4)
      .default([]),
    links: z
      .object({
        repo: z.url().optional(),
        live: z.url().optional(),
        store: z.url().optional(),
      })
      .default({}),
    featured: z.boolean().default(false),
    order: z.number().default(100),
    draft: z.boolean().default(false),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(200),
    published: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, posts };
