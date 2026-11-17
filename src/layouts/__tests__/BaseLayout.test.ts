import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";
import BaseLayout from "../BaseLayout.astro";

async function renderLayout(
  pathname = "/",
  props: { title?: string; description?: string; math?: boolean } = {},
) {
  const container = await AstroContainer.create();
  const html = await container.renderToString(BaseLayout, {
    props: {
      title: props.title ?? "Test Page",
      description: props.description,
      math: props.math,
    },
    slots: { default: "<p>Hello measurement systems.</p>" },
    request: new Request(`https://ericjanusson.ca${pathname}`),
  });
  return { html, doc: new JSDOM(html).window.document };
}

describe("BaseLayout", () => {
  it("emits apex canonical URL, strict referrer policy, skip target, and Person JSON-LD", async () => {
    const { html, doc } = await renderLayout("/projects");

    const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute("href");
    expect(canonical).toBe("https://ericjanusson.ca/projects/");

    const referrer = doc.querySelector('meta[name="referrer"]')?.getAttribute("content");
    expect(referrer).toBe("strict-origin-when-cross-origin");

    expect(doc.querySelector('a.skip-link[href="#main-content"]')).not.toBeNull();
    expect(doc.querySelector("main#main-content")).not.toBeNull();

    const ldScript = doc.querySelector('script[type="application/ld+json"]')?.textContent ?? "";
    const schema = JSON.parse(ldScript) as Record<string, unknown>;
    expect(schema["@type"]).toBe("Person");
    expect(schema.url).toBe("https://ericjanusson.ca");
    expect((schema.homeLocation as { name: string }).name).toBe("British Columbia, Canada");
    expect(html).not.toContain('securityLevel: "loose"');
  });

  it("loads KaTeX stylesheet only when math is requested", async () => {
    const withoutMath = await renderLayout("/about/", { math: false });
    const withMath = await renderLayout("/blog/test/", { math: true });

    const cssLinks = (doc: Document) =>
      [...doc.querySelectorAll('link[rel="stylesheet"]')].map(
        (el) => el.getAttribute("href") ?? "",
      );

    const baseLinks = cssLinks(withoutMath.doc);
    const mathLinks = cssLinks(withMath.doc);

    expect(mathLinks).toHaveLength(baseLinks.length + 1);
  });
});
