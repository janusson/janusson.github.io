import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { getAllByRole, getByRole } from "@testing-library/dom";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";
import FeaturedProjectCard from "../components/FeaturedProjectCard.astro";
import { projects } from "./projects";

describe("MSMCP project cross-links", () => {
  it("renders distinct website and source links in the project card", async () => {
    const entries = projects.filter((project) => project.slug === "msmcp");
    expect(entries).toHaveLength(1);

    const container = await AstroContainer.create();
    const html = await container.renderToString(FeaturedProjectCard, {
      props: { project: entries[0] },
    });
    const dom = new JSDOM(html).window.document.body;
    expect(getAllByRole(dom, "link")).toHaveLength(2);

    for (const [name, href] of [
      ["Website", "https://msmcp.dev"],
      ["Source", "https://github.com/janusson/MSMCP"],
    ]) {
      const link = getByRole(dom, "link", { name });
      expect(link.getAttribute("href")).toBe(href);
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    }
  });
});
