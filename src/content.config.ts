import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import { PUBLICATION_THEME_KEYS } from "./data/publications";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z
    .object({
      title: z.string(),
      date: z.date(),
      tags: z.array(z.string()).default([]),
      description: z.string().optional(),
      lastUpdated: z.date().optional(),
    })
    .loose(),
});

/**
 * Publications — bibliography grouped by research theme.
 *
 * Each entry is a short MDX file; the Publications page queries the
 * collection and groups entries by the `theme` field. URLs and years are
 * preserved verbatim from the original bibliography — never edited here.
 */
const publications = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/publications" }),
  schema: z.object({
    title: z.string(),
    /** Grouping key — shared with the Publications page display groups. */
    theme: z.enum(PUBLICATION_THEME_KEYS),
    journal: z.string(),
    /** Publication year — kept exactly as in the original bibliography. */
    year: z.number().int().min(1990).max(2030),
    /** Original link, preserved verbatim. */
    url: z.string().optional(),
    featured: z.boolean().default(false),
    /** One-to-two sentence summary rendered under the citation. */
    description: z.string(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog, publications };
