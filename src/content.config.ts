import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z
    .object({
      title: z.string(),
      date: z.date(),
      tags: z.array(z.string()).default([]),
      description: z.string().optional(),
      lastUpdated: z.date().optional(),
    })
    .passthrough(),
});

export const collections = { blog };
