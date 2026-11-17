import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";
import SelectedWork, { type CaseStudy } from "../SelectedWork.astro";

const sampleStudies: CaseStudy[] = [
  {
    slug: "public-tool",
    organization: "MassFlow",
    role: "Author & Maintainer",
    timeline: "Open Source",
    badge: "Open Source · MIT",
    title: "Local MS/MS library search",
    summary: "Reproducible spectral similarity workflow.",
    metric: { value: "Provenance", label: "per-file sidecar" },
    evidence: ["Deterministic scoring", "CSV export"],
    tags: ["Python", "MS/MS"],
    href: "https://github.com/janusson/MassFlow",
    external: true,
    linkLabel: "View on GitHub",
  },
  {
    slug: "private-tool",
    organization: "MassPilot",
    role: "Author",
    timeline: "Proprietary",
    badge: "Private · Proprietary",
    title: "Proprietary LC-HRMS review tooling",
    summary: "Private workflow without public internals.",
    metric: { value: "Private", label: "proprietary review tool" },
    evidence: ["Human technical review"],
    tags: ["Python", "LC-HRMS"],
    href: "/projects/#masspilot",
    external: false,
    linkLabel: "Scope & details",
  },
];

describe("SelectedWork", () => {
  it("renders case study cards with badges, metrics, and wrapping guards", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(SelectedWork, {
      props: { caseStudies: sampleStudies },
    });
    const doc = new JSDOM(html).window.document;
    const articles = [...doc.querySelectorAll("article")];

    expect(articles).toHaveLength(2);
    expect(articles[0].className).toContain("min-w-0");
    expect(articles[0].className).toContain("[overflow-wrap:anywhere]");
    expect(articles[0].textContent).toContain("Open Source · MIT");
    expect(articles[1].textContent).toContain("Private · Proprietary");
  });

  it("sets noopener noreferrer on external links and preserves internal anchors", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(SelectedWork, {
      props: { caseStudies: sampleStudies },
    });
    const doc = new JSDOM(html).window.document;
    const links = [...doc.querySelectorAll("a")];

    expect(links).toHaveLength(2);

    const ext = links[0];
    expect(ext.getAttribute("href")).toBe("https://github.com/janusson/MassFlow");
    expect(ext.getAttribute("target")).toBe("_blank");
    expect(ext.getAttribute("rel")).toBe("noopener noreferrer");

    const internal = links[1];
    expect(internal.getAttribute("href")).toBe("/projects/#masspilot");
    expect(internal.getAttribute("target")).toBeNull();
    expect(internal.getAttribute("rel")).toBeNull();
  });
});
