import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";
import FeaturedProjectCard from "../FeaturedProjectCard.astro";
import { projects } from "../../data/projects";

describe("FeaturedProjectCard", () => {
  it("renders public projects with anchor id, Open Source badge, and secure external links", async () => {
    const publicProject = projects.find((p) => p.visibility === "public");
    expect(publicProject).toBeDefined();

    const container = await AstroContainer.create();
    const html = await container.renderToString(FeaturedProjectCard, {
      props: { project: publicProject! },
    });
    const doc = new JSDOM(html).window.document;
    const article = doc.querySelector("article");

    expect(article?.getAttribute("id")).toBe(publicProject!.slug);
    expect(doc.querySelector(".visibility-badge")?.textContent?.trim()).toBe("Open Source");
    expect(doc.querySelector(".featured-private-note")).toBeNull();

    for (const anchor of doc.querySelectorAll("a[target='_blank']")) {
      expect(anchor.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });

  it("renders proprietary projects without outbound links or internal details", async () => {
    const proprietaryProject = projects.find((p) => p.visibility === "proprietary");
    expect(proprietaryProject).toBeDefined();

    const container = await AstroContainer.create();
    const html = await container.renderToString(FeaturedProjectCard, {
      props: { project: proprietaryProject! },
    });
    const doc = new JSDOM(html).window.document;
    const article = doc.querySelector("article");

    expect(article?.getAttribute("id")).toBe(proprietaryProject!.slug);
    expect(doc.querySelector(".visibility-badge")?.textContent?.trim()).toBe(
      "Private · Proprietary",
    );
    expect(doc.querySelectorAll("a")).toHaveLength(0);
    expect(doc.querySelector(".featured-private-note")?.textContent).toContain(
      "Private repository",
    );
  });
});
