import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { getAllByRole, getByRole, within } from "@testing-library/dom";
import { JSDOM } from "jsdom";
import { beforeEach, describe, expect, it } from "vitest";
import Sidebar from "../Sidebar.astro";

// The Astro container renders the .astro component to static HTML in the
// node environment, which is then parsed with jsdom so
// @testing-library/dom can query it by role — the same way a screen
// reader (or an end user) would.
describe("Sidebar component", () => {
  let dom: HTMLElement;

  beforeEach(async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Sidebar);
    dom = new JSDOM(html).window.document.body;
  });

  it("renders the sidebar landmark with the expected id and tabindex", () => {
    const aside = dom.querySelector("#sidebar");

    expect(aside).not.toBeNull();
    expect(aside?.tagName).toBe("ASIDE");
    expect(aside?.classList.contains("sidebar")).toBe(true);
    expect(aside?.getAttribute("tabindex")).toBe("-1");
  });

  it("exposes the primary navigation with its ARIA label", () => {
    const nav = getByRole(dom, "navigation", { name: "Main navigation" });

    expect(nav.tagName).toBe("NAV");
    expect(nav.classList.contains("sidebar-nav")).toBe(true);
  });

  it("renders all seven nav links with their expected labels and hrefs", () => {
    const nav = getByRole(dom, "navigation", { name: "Main navigation" });
    const links = getAllByRole(nav, "link");

    expect(links).toHaveLength(7);

    const expected = [
      ["Home", "/"],
      ["Posts", "/posts/"],
      ["Projects", "/projects/"],
      ["Publications", "/publications/"],
      ["About", "/about/"],
      ["CV", "/cv/"],
      ["Contact", "/contact/"],
    ] as const;

    expected.forEach(([label, href], index) => {
      expect(links[index].textContent).toBe(label);
      expect(links[index].getAttribute("href")).toBe(href);
    });
  });

  it("marks the current page's nav link as active", () => {
    // The container renders with a default request URL of
    // https://example.com/ → pathname "/" → Home is the active route.
    const home = getByRole(dom, "link", { name: "Home" });
    const posts = getByRole(dom, "link", { name: "Posts" });

    expect(home.classList.contains("sidebar-nav-link--active")).toBe(true);
    expect(posts.classList.contains("sidebar-nav-link--active")).toBe(false);
  });

  it("wires the mobile menu toggle with the correct ARIA attributes", () => {
    const toggle = getByRole(dom, "button", { name: "Toggle navigation menu" });

    expect(toggle.classList.contains("sidebar-menu-toggle")).toBe(true);
    expect(toggle.getAttribute("type")).toBe("button");
    expect(toggle.getAttribute("aria-expanded")).toBe("false");
    expect(toggle.getAttribute("aria-controls")).toBe("sidebar");
    // Hamburger glyph structure
    expect(toggle.querySelector(".hamburger-box .hamburger-inner")).not.toBeNull();
  });

  it("renders the identity link with an accessibly-named avatar", () => {
    const identity = getByRole(dom, "link", { name: /Dr\. Eric Janusson/ });

    expect(identity.classList.contains("sidebar-identity")).toBe(true);
    expect(identity.getAttribute("href")).toBe("/");

    const avatar = within(identity).getByRole("img", { name: "Dr. Eric Janusson" });
    expect(avatar.classList.contains("sidebar-avatar")).toBe(true);
    expect(avatar.getAttribute("src")).toBe("/assets/images/avatar.webp");
    expect(avatar.getAttribute("width")).toBe("100");
    expect(avatar.getAttribute("height")).toBe("100");
  });

  it("renders the bio tagline", () => {
    expect(dom.querySelector(".sidebar-bio")?.textContent).toBe(
      "Analytical Chemist & Scientific Software Developer",
    );
  });

  it("renders all three social links with labels, targets, and rel attributes", () => {
    const social = dom.querySelector<HTMLElement>(".sidebar-social");
    expect(social).not.toBeNull();

    const expected = [
      {
        name: "GitHub",
        href: "https://github.com/janusson",
        icon: "fa-brands fa-github",
      },
      {
        name: "Google Scholar",
        href: "https://scholar.google.com/citations?user=PaUrfcQAAAAJ&hl=en",
        icon: "fa-solid fa-graduation-cap",
      },
      {
        name: "ORCiD",
        href: "https://orcid.org/0000-0002-3207-7067",
        icon: "fa-brands fa-orcid",
      },
    ];

    expected.forEach(({ name, href, icon }) => {
      const link = within(social!).getByRole("link", { name });

      expect(link.getAttribute("href")).toBe(href);
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
      expect(link.getAttribute("aria-label")).toBe(name);
      expect(link.querySelector("i")?.className).toBe(icon);
    });
  });

  it("renders an aria-hidden backdrop for the mobile drawer", () => {
    const backdrop = dom.querySelector(".sidebar-backdrop");

    expect(backdrop).not.toBeNull();
    expect(backdrop?.getAttribute("aria-hidden")).toBe("true");
  });

  it("renders the copyright footer with the current year", () => {
    const footer = dom.querySelector(".sidebar-footer");

    expect(footer).not.toBeNull();
    expect(footer?.textContent).toBe(`© ${new Date().getFullYear()} Dr. Eric Janusson`);
  });
});
