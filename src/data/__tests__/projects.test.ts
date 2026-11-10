import { describe, expect, it } from "vitest";
import { contactLinks, domains, featuredProjects, projects } from "../projects";
import { icons, type IconDefinition } from "../icons";

describe("projects data", () => {
  it("uses unique, URL-safe slugs", () => {
    const slugs = projects.map((project) => project.slug);

    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it("provides non-empty required copy for every project", () => {
    for (const project of projects) {
      for (const field of ["name", "tagline", "description", "problem", "approach"] as const) {
        expect(project[field].trim(), `${project.slug}.${field}`).not.toBe("");
      }
      expect(project.tech.length, `${project.slug}.tech`).toBeGreaterThan(0);
      expect(project.meta.length, `${project.slug}.meta`).toBeGreaterThan(0);
    }
  });

  it("only uses absolute https links", () => {
    for (const project of projects) {
      for (const link of project.links) {
        expect(link.href, `${project.slug} → ${link.label}`).toMatch(/^https:\/\//);
      }
    }
  });

  it("derives featured projects from the full project list", () => {
    expect(featuredProjects).toEqual(projects.filter((project) => project.featured));
    expect(featuredProjects.length).toBeGreaterThan(0);
  });
});

describe("domains and contact links", () => {
  it("every domain references a registered icon", () => {
    for (const domain of domains) {
      expect(icons, domain.title).toHaveProperty(domain.icon);
    }
  });

  it("every contact link points at an absolute URL with a registered icon", () => {
    for (const link of contactLinks) {
      expect(link.href, link.label).toMatch(/^(https:\/\/|mailto:)/);
      expect(icons, link.label).toHaveProperty(link.icon);
    }
  });
});

describe("icon registry", () => {
  const entries = Object.entries(icons) as Array<[string, IconDefinition]>;

  it("gives every icon a non-trivial SVG path", () => {
    expect(entries.length).toBeGreaterThan(0);
    for (const [name, icon] of entries) {
      expect(icon.path.trim().length, name).toBeGreaterThan(20);
    }
  });

  it("uses a square viewBox whenever one is overridden", () => {
    for (const [name, icon] of entries) {
      if (!icon.viewBox) continue;

      const parts = icon.viewBox.split(/\s+/).map(Number);
      expect(parts, name).toHaveLength(4);
      expect(parts[2], name).toBe(parts[3]);
    }
  });
});
