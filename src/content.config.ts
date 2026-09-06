import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

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
 * Case studies — reserved for long-form "Selected Work" pieces.
 *
 * Entries were removed in the September 2026 content cleanup along with
 * the CaseStudy.mdx skeleton; the collection and schema are retained so
 * long-form pieces (lab engagements currently summarized on the
 * homepage/projects pages) can return without a schema migration.
 */
const caseStudies = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/case-studies" }),
  schema: z.object({
    title: z.string(),
    /** Initial publication date (ISO YYYY-MM-DD). */
    date: z.date(),
    /** Human-readable project window, e.g. "2017 – present". */
    timeframe: z.string(),
    /** One-sentence card excerpt for the homepage Selected Work grid. */
    summary: z.string(),
    /** Surface on the homepage? */
    featured: z.boolean().default(false),
    /** Template entries (e.g. the former CaseStudy.mdx skeleton) — excluded from listings. */
    template: z.boolean().default(false),
    /** Document state. */
    status: z.enum(["draft", "finished"]).default("draft"),
    /** Core technologies / stack. */
    technologies: z.array(z.string()).default([]),
    /** Instrumentation used. */
    instruments: z.array(z.string()).default([]),
    /** Repository / documentation links. */
    repositories: z
      .array(
        z.object({
          label: z.string(),
          href: z.string(),
          external: z.boolean().default(true),
        }),
      )
      .default([]),
    tags: z.array(z.string()).default([]),
  }),
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
    /** Grouping key — four research themes on the Publications page. */
    theme: z.enum(["fundamentals", "reaction-monitoring", "inorganic-pom", "applied"]),
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

export const collections = { blog, caseStudies, publications };
