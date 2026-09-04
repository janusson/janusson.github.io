import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { getAllByRole, getByRole, within } from "@testing-library/dom";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";
import Sidebar from "../Sidebar.astro";

// The Astro container renders the .astro component to static HTML in the
// node environment, which is then parsed with jsdom so
// @testing-library/dom can query it by role — the same way a screen
// reader (or an end user) would.

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Posts", href: "/posts/" },
  { label: "Projects", href: "/projects/" },
  { label: "Publications", href: "/publications/" },
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" },
] as const;

const SOCIAL_LINKS = [
  { name: "GitHub", href: "https://github.com/janusson", icon: "fa-brands fa-github" },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/eric-janusson",
    icon: "fa-brands fa-linkedin",
  },
  {
    name: "Google Scholar",
    href: "https://scholar.google.com/citations?user=PaUrfcQAAAAJ&hl=en",
    icon: "fa-solid fa-graduation-cap",
  },
  { name: "ORCID", href: "https://orcid.org/0000-0002-3207-7067", icon: "fa-brands fa-orcid" },
] as const;

/**
 * Renders the sidebar for a specific URL pathname. Sidebar.astro derives the
 * "current page" from `Astro.url?.pathname`, so the request URL is passed
 * explicitly instead of relying on the container's default request — this
 * keeps the active-link behavior deterministic and easy to exercise.
 */
async function renderSidebar(pathname = "/"): Promise<HTMLElement> {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Sidebar, {
    request: new Request(`https://example.com${pathname}`),
  });
  return new JSDOM(html).window.document.body;
}

/** Like querySelector, but fails with a descriptive error when nothing matches. */
function getBySelector(root: HTMLElement, selector: string): HTMLElement {
  const element = root.querySelector(selector);
  if (!element) {
    throw new Error(`Expected an element matching "${selector}"`);
  }
  return element as HTMLElement;
}

function getPrimaryNav(dom: HTMLElement): HTMLElement {
  return getByRole(dom, "navigation", { name: "Main navigation" });
}

function getNavLinks(dom: HTMLElement): HTMLElement[] {
  return getAllByRole(getPrimaryNav(dom), "link");
}

/** Labels of the nav links currently marked as active, in DOM order. */
function getActiveNavLabels(dom: HTMLElement): Array<string | undefined> {
  return getNavLinks(dom)
    .filter((link) => link.classList.contains("sidebar-nav-link--active"))
    .map((link) => link.textContent?.trim());
}

describe("Sidebar component", () => {
  it("renders the sidebar landmark with the expected id and tabindex", async () => {
    const dom = await renderSidebar();
    const aside = getBySelector(dom, "#sidebar");

    expect(aside.tagName).toBe("ASIDE");
    expect(aside.classList.contains("sidebar")).toBe(true);
    expect(aside.getAttribute("tabindex")).toBe("-1");
  });

  it("exposes the primary navigation with its ARIA label", async () => {
    const dom = await renderSidebar();
    const nav = getPrimaryNav(dom);

    expect(nav.tagName).toBe("NAV");
    expect(nav.classList.contains("sidebar-nav")).toBe(true);
  });

  it("renders one nav link per route, in order, with the expected labels and hrefs", async () => {
    const dom = await renderSidebar();
    const links = getNavLinks(dom);

    expect(links).toHaveLength(NAV_LINKS.length);

    NAV_LINKS.forEach(({ label, href }, index) => {
      expect(links[index].textContent?.trim()).toBe(label);
      expect(links[index].getAttribute("href")).toBe(href);
      expect(links[index].classList.contains("sidebar-nav-link")).toBe(true);
    });
  });

  describe("current-page highlighting", () => {
    const cases = NAV_LINKS.map(({ label, href }) => [label, href] as const);

    it.each(cases)("highlights exactly “%s” when the pathname is “%s”", async (label, href) => {
      const dom = await renderSidebar(href);

      expect(getActiveNavLabels(dom)).toEqual([label]);
    });

    it("highlights nothing for pathnames that match no route", async () => {
      // Sidebar.astro compares the pathname with strict equality, so section
      // sub-pages (e.g. /posts/…/…) intentionally get no highlight.
      const dom = await renderSidebar("/posts/2024-01-01-not-a-route/");

      expect(getActiveNavLabels(dom)).toEqual([]);
    });
  });

  it("wires the mobile menu toggle with the correct ARIA attributes", async () => {
    const dom = await renderSidebar();
    const toggle = getByRole(dom, "button", { name: "Toggle navigation menu" });

    expect(toggle.classList.contains("sidebar-menu-toggle")).toBe(true);
    expect(toggle.getAttribute("type")).toBe("button");
    expect(toggle.getAttribute("aria-expanded")).toBe("false");

    // aria-controls must point at the actual drawer landmark, not a dangling id.
    const controls = toggle.getAttribute("aria-controls");
    const drawer = controls ? dom.ownerDocument.getElementById(controls) : null;

    expect(drawer).not.toBeNull();
    expect(drawer).toBe(getBySelector(dom, "#sidebar"));

    // Hamburger glyph structure
    expect(toggle.querySelector(".hamburger-box .hamburger-inner")).not.toBeNull();
  });

  it("omits the bio tagline, identity block, and copyright footer", async () => {
    const dom = await renderSidebar();

    for (const selector of [".sidebar-bio", ".sidebar-identity", ".sidebar-footer"]) {
      expect(dom.querySelector(selector)).toBeNull();
    }
  });

  it("renders the expected social links with labels, icons, targets, and rel", async () => {
    const dom = await renderSidebar();
    const social = getBySelector(dom, ".sidebar-social");
    const links = within(social).getAllByRole("link");

    expect(links).toHaveLength(SOCIAL_LINKS.length);

    SOCIAL_LINKS.forEach(({ name, href, icon }) => {
      const link = within(social).getByRole("link", { name });

      expect(link.getAttribute("href")).toBe(href);
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
      expect(link.getAttribute("aria-label")).toBe(name);
      expect(link.querySelector("i")?.className).toBe(icon);
    });
  });

  it("renders an aria-hidden backdrop for the mobile drawer", async () => {
    const dom = await renderSidebar();
    const backdrop = getBySelector(dom, ".sidebar-backdrop");

    expect(backdrop.getAttribute("aria-hidden")).toBe("true");
  });
});
