// Responsive QA harness for the built site and a running Chromium CDP server.
// See responsive-check.sh; PORT and CDP_PORT default to 4321 and 9226.
import { readdir } from "node:fs/promises";
import { chromium } from "playwright-core";

const site = `http://127.0.0.1:${process.env.PORT || 4321}`;
const cdp = `http://127.0.0.1:${process.env.CDP_PORT || 9226}`;
// Exercise both sides of the site's 640px and 768px breakpoints.
const widths = [320, 390, 640, 641, 767, 768, 769, 1280];
const pages = ["/", "/about/", "/contact/", "/posts/", "/projects/", "/publications/"];

// Include every generated blog route, including nested slugs, when posts exist.
async function blogRoutes(dir, prefix = "/blog/") {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
  const routes = [];
  for (const entry of entries) {
    if (entry.isDirectory())
      routes.push(...(await blogRoutes(`${dir}/${entry.name}`, `${prefix}${entry.name}/`)));
    else if (entry.name === "index.html") routes.push(prefix);
    else if (entry.name.endsWith(".html")) routes.push(`${prefix}${entry.name.slice(0, -5)}`);
  }
  return routes.sort();
}
pages.push(...(await blogRoutes("dist/blog")));

let failures = 0;
function check(label, ok, detail = "") {
  if (!ok) failures++;
  console.log(`  ${ok ? "✓" : "✗ FAIL"}  ${label}${detail ? ` — ${detail}` : ""}`);
}

const browser = await chromium.connectOverCDP(cdp);
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  for (const width of widths) {
    await page.setViewportSize({ width, height: 844 });
    console.log(`\n═══ viewport ${width}px ═══`);
    for (const path of pages) {
      console.log(`\n  ${path}`);
      const response = await page.goto(site + path, { waitUntil: "load" });
      if (!response?.ok()) {
        check("page loads", false, `HTTP ${response?.status() ?? "no response"}`);
        continue;
      }
      check("page loads", true, `HTTP ${response.status()}`);
      await page.evaluate(() => document.fonts.ready);
      const metrics = await page.evaluate(() => {
        const doc = document.documentElement;
        const overflowers = [...document.querySelectorAll("body *")]
          .map((el) => ({ el, rect: el.getBoundingClientRect() }))
          .filter(({ rect }) => rect.right > innerWidth + 1)
          .slice(0, 8)
          .map(
            ({ el, rect }) =>
              `${el.tagName}.${String(el.className).split(" ").slice(0, 3).join(".")} →${Math.round(rect.right)}`,
          );
        const grid = document.querySelector(".grid.gap-5.md\\:grid-cols-2");
        const tabs = document.querySelector('[aria-label="Research themes"] ul');
        const pubsGrid = document.querySelector('[aria-label="Research themes"]')?.parentElement;
        return {
          innerWidth,
          scrollWidth: doc.scrollWidth,
          overflowers,
          gridCols: grid ? getComputedStyle(grid).gridTemplateColumns.split(" ").length : null,
          tabsDirection: tabs ? getComputedStyle(tabs).flexDirection : null,
          tabsOverflow: tabs ? getComputedStyle(tabs).overflowX : null,
          pubsGridCols:
            pubsGrid && getComputedStyle(pubsGrid).display === "grid"
              ? getComputedStyle(pubsGrid).gridTemplateColumns.split(" ").length
              : 1,
        };
      });
      check(
        "no horizontal overflow",
        metrics.scrollWidth <= metrics.innerWidth + 1,
        `scrollWidth ${metrics.scrollWidth} / ${metrics.innerWidth}`,
      );
      if (metrics.scrollWidth > metrics.innerWidth + 1)
        metrics.overflowers.forEach((item) => console.log(`    overflows: ${item}`));
      if (path === "/") {
        check(
          "SelectedWork grid columns",
          metrics.gridCols === (width < 768 ? 1 : 2),
          `${metrics.gridCols} col(s)`,
        );
      }
      if (path === "/publications/") {
        check(
          "theme tabs direction",
          metrics.tabsDirection === (width < 768 ? "row" : "column"),
          String(metrics.tabsDirection),
        );
        if (width < 768)
          check(
            "theme tabs scroll horizontally",
            metrics.tabsOverflow === "auto" || metrics.tabsOverflow === "scroll",
            String(metrics.tabsOverflow),
          );
        check(
          "publications grid columns",
          metrics.pubsGridCols === (width < 768 ? 1 : 2),
          `${metrics.pubsGridCols} col(s)`,
        );
      }
    }
  }
  await context.close();
} finally {
  await browser.close();
}
console.log(
  `\n${"=".repeat(44)}\nRESULT: ${failures === 0 ? "ALL PASS ✓" : `${failures} FAILURE(S) ✗`}`,
);
process.exitCode = failures ? 1 : 0;
