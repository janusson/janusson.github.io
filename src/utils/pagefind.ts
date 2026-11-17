/**
 * Pagefind runtime loader.
 *
 * `pagefind --site dist` writes its search API as an ES module, so it has to be
 * loaded with a dynamic `import()`. Adding `/pagefind/pagefind.js` as a classic
 * `<script>` never executes it and leaves `window.Pagefind` undefined — the
 * silent failure this module replaces.
 *
 * The loader lives here rather than inline in `src/pages/posts.astro` so that
 * its caching, retry and failure behaviour can be unit-tested without a browser.
 */

/** Entry point emitted by `pagefind --site dist`. */
export const PAGEFIND_ENTRY = "/pagefind/pagefind.js";

export interface PagefindResultData {
  url: string;
  excerpt: string;
  meta: Record<string, string>;
}

/** A single search hit, resolved lazily by Pagefind. */
export interface PagefindResult {
  data(): Promise<PagefindResultData>;
}

export interface PagefindSearchResponse {
  results: PagefindResult[];
}

export interface PagefindModule {
  search(query: string): Promise<PagefindSearchResponse>;
}

/** Imports a module specifier; injectable so tests never touch the network. */
export type PagefindImporter = (specifier: string) => Promise<unknown>;

export type PagefindLoader = () => Promise<PagefindModule | null>;

function isPagefindModule(value: unknown): value is PagefindModule {
  return typeof (value as PagefindModule | null | undefined)?.search === "function";
}

/**
 * Memoising loader.
 *
 * A successful import is cached, so every keystroke and the idle preload share
 * one module instance. A failure resolves `null` without being cached, so a
 * page served before a production build exists recovers on the next search
 * instead of staying broken for the life of the page.
 */
export function createPagefindLoader(
  importModule: PagefindImporter = defaultImporter,
): PagefindLoader {
  let pending: Promise<PagefindModule | null> | null = null;
  let cached: PagefindModule | null = null;

  return () => {
    if (cached) return Promise.resolve(cached);

    if (!pending) {
      pending = Promise.resolve()
        // Wrapping the call defers it to a microtask, so a synchronous throw
        // from the importer is caught like a rejected import.
        .then(() => importModule(PAGEFIND_ENTRY))
        .then((namespace) => {
          // A dynamic import yields a module namespace; tolerate the API being
          // wrapped in `default` as well, so either shape is accepted.
          const candidate = (namespace as { default?: unknown } | null)?.default ?? namespace;
          return isPagefindModule(candidate) ? candidate : null;
        })
        .catch(() => null)
        .then((module) => {
          if (module) cached = module;
          pending = null;
          return module;
        });
    }

    return pending;
  };
}

async function defaultImporter(specifier: string): Promise<unknown> {
  // `@vite-ignore` stops Vite trying to resolve a runtime-only file at build time.
  return import(/* @vite-ignore */ specifier);
}

/** Escape HTML special characters before interpolating strings into HTML. */
export function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]!,
  );
}

/** Allow only same-origin paths or http(s) URLs; reject javascript:/data: schemes. */
export function sanitizeResultUrl(url: string): string {
  const trimmed = url.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return escapeHtml(trimmed);
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return escapeHtml(parsed.toString());
    }
  } catch {
    // fall through
  }
  return "#";
}

/**
 * Escape HTML in a Pagefind excerpt while preserving Pagefind's own
 * `<mark>…</mark>` highlight wrappers.
 */
export function sanitizeExcerpt(excerpt: string): string {
  const MARK_OPEN = "\u0000MARK_OPEN\u0000";
  const MARK_CLOSE = "\u0000MARK_CLOSE\u0000";
  return escapeHtml(excerpt.replace(/<mark>/gi, MARK_OPEN).replace(/<\/mark>/gi, MARK_CLOSE))
    .replaceAll(MARK_OPEN, "<mark>")
    .replaceAll(MARK_CLOSE, "</mark>");
}

/** Render one Pagefind search hit safely into HTML. */
export function renderPagefindResult(data: PagefindResultData): string {
  const safeUrl = sanitizeResultUrl(data.url);
  const title = escapeHtml(data.meta?.title ?? data.url);
  const date = escapeHtml(data.meta?.date ?? "");
  const tagsRaw = data.meta?.tags ?? "";
  const tags = tagsRaw ? tagsRaw.split(/,\s*/).filter(Boolean).map(escapeHtml) : [];
  const excerpt = sanitizeExcerpt(data.excerpt ?? "");

  return `
    <div class="search-result">
      <h3><a href="${safeUrl}">${title}</a></h3>
      ${date ? `<div class="search-result-meta">${date}</div>` : ""}
      <div class="search-result-excerpt">${excerpt}</div>
      ${tags.length > 0 ? `<div class="search-result-tags">${tags.map((t) => `<span class="post-tag">${t}</span>`).join("")}</div>` : ""}
    </div>
  `;
}
