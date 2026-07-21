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

export const collections = { blog };
