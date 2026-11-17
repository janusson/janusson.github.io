import { describe, expect, it, vi } from "vitest";
import {
  createPagefindLoader,
  PAGEFIND_ENTRY,
  renderPagefindResult,
  sanitizeExcerpt,
  sanitizeResultUrl,
  type PagefindImporter,
  type PagefindModule,
} from "../pagefind";

// Pagefind emits its search API as an ES module. These tests pin the two
// behaviours that the classic-script loader got wrong: the entry point must be
// imported as a module, and a failed import must surface as `null` (falling
// back to the "production builds only" message) rather than hang or throw.

function fakePagefind(): PagefindModule {
  return {
    search: vi.fn(async () => ({ results: [] })),
  };
}

describe("createPagefindLoader", () => {
  it("dynamically imports the generated ES module entry point", async () => {
    const pagefind = fakePagefind();
    const importModule = vi.fn(async () => pagefind);
    const load = createPagefindLoader(importModule);

    await expect(load()).resolves.toBe(pagefind);
    expect(PAGEFIND_ENTRY).toBe("/pagefind/pagefind.js");
    expect(importModule).toHaveBeenCalledTimes(1);
    expect(importModule).toHaveBeenCalledWith(PAGEFIND_ENTRY);
  });

  it("shares one import between concurrent callers", async () => {
    const pagefind = fakePagefind();
    const importModule = vi.fn(async () => pagefind);
    const load = createPagefindLoader(importModule);

    const [first, second] = await Promise.all([load(), load()]);

    expect(first).toBe(pagefind);
    expect(second).toBe(pagefind);
    expect(importModule).toHaveBeenCalledTimes(1);
  });

  it("does not re-import once the module has loaded", async () => {
    const pagefind = fakePagefind();
    const importModule = vi.fn(async () => pagefind);
    const load = createPagefindLoader(importModule);

    await load();
    await load();
    await load();

    expect(importModule).toHaveBeenCalledTimes(1);
  });

  it("resolves null when the generated bundle is missing", async () => {
    const importModule = vi.fn(async () => {
      throw new Error("Failed to fetch dynamically imported module: /pagefind/pagefind.js");
    });
    const load = createPagefindLoader(importModule);

    await expect(load()).resolves.toBeNull();
  });

  it("resolves null when the importer throws synchronously", async () => {
    const importModule: PagefindImporter = () => {
      throw new Error("not a function");
    };
    const load = createPagefindLoader(importModule);

    await expect(load()).resolves.toBeNull();
  });

  it("retries after a failed import instead of latching search off", async () => {
    const pagefind = fakePagefind();
    const importModule = vi
      .fn<PagefindImporter>()
      .mockRejectedValueOnce(new Error("no production build yet"))
      .mockResolvedValueOnce(pagefind);
    const load = createPagefindLoader(importModule);

    await expect(load()).resolves.toBeNull();
    await expect(load()).resolves.toBe(pagefind);
    expect(importModule).toHaveBeenCalledTimes(2);
  });

  it("rejects a module namespace without a search function", async () => {
    const importModule = vi.fn(async () => ({ default: {} }));
    const load = createPagefindLoader(importModule);

    await expect(load()).resolves.toBeNull();
  });

  it("accepts the API when it is wrapped in a default export", async () => {
    const pagefind = fakePagefind();
    const importModule = vi.fn(async () => ({ default: pagefind }));
    const load = createPagefindLoader(importModule);

    await expect(load()).resolves.toBe(pagefind);
  });
});

describe("Pagefind result rendering & sanitization", () => {
  it("preserves <mark> highlights while escaping untrusted markup in excerpts", () => {
    const out = sanitizeExcerpt('Found <mark>LOD</mark> & <img src=x onerror="alert(1)">');

    expect(out).toBe("Found <mark>LOD</mark> &amp; &lt;img src=x onerror=&quot;alert(1)&quot;&gt;");
  });

  it("allows relative paths and http(s) URLs while rejecting javascript: URLs", () => {
    expect(sanitizeResultUrl("/blog/lod/")).toBe("/blog/lod/");
    expect(sanitizeResultUrl("https://ericjanusson.ca/posts/")).toBe(
      "https://ericjanusson.ca/posts/",
    );
    expect(sanitizeResultUrl("javascript:alert(1)")).toBe("#");
    expect(sanitizeResultUrl("//evil.example/steal")).toBe("#");
  });

  it("escapes title, date, and tag metadata when rendering search hits", () => {
    const html = renderPagefindResult({
      url: "/blog/test/",
      excerpt: "Sample <mark>match</mark>",
      meta: {
        title: '<script>alert("x")</script>',
        date: "2026-11-16",
        tags: 'MS/MS, <b onclick="x">tag</b>',
      },
    });

    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
    expect(html).toContain("<mark>match</mark>");
    expect(html).toContain("&lt;b onclick=&quot;x&quot;&gt;tag&lt;/b&gt;");
  });
});
