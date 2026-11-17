// Post-build static verification for built HTML, links, canonicals, security attributes, and image metadata.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { JSDOM } from "jsdom";

const DIST_DIR = "dist";
const PUBLIC_IMAGES_DIR = "public/assets/images";
const SITE_ORIGIN = "https://ericjanusson.ca";
const EXPECTED_HOST = "ericjanusson.ca";

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else files.push(full);
  }
  return files;
}

function normalizeRoute(relPath) {
  const withSlash = "/" + relPath.replace(/\\/g, "/");
  if (withSlash === "/index.html") return "/";
  if (withSlash.endsWith("/index.html")) return withSlash.slice(0, -10);
  return withSlash;
}

function checkImageMetadata(filePath, failures) {
  const buf = readFileSync(filePath);
  const lower = filePath.toLowerCase();

  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
    if (buf[0] !== 0xff || buf[1] !== 0xd8) {
      failures.push(`${filePath}: invalid JPEG SOI header`);
      return;
    }
    let offset = 2;
    while (offset + 4 <= buf.length) {
      if (buf[offset] !== 0xff) break;
      const marker = buf[offset + 1];
      if (marker === 0xda || marker === 0xd9) break; // SOS or EOI
      const segLen = buf.readUInt16BE(offset + 2);
      const payload = buf.subarray(offset + 4, offset + 2 + segLen);
      if (marker === 0xe1) {
        const header = payload.subarray(0, 32).toString("latin1");
        if (header.startsWith("Exif\0\0") || header.includes("ns.adobe.com/xap")) {
          failures.push(`${filePath}: contains APP1 EXIF/XMP metadata`);
        }
      } else if (marker === 0xed) {
        failures.push(`${filePath}: contains APP13 IPTC metadata`);
      } else if (marker === 0xfe) {
        failures.push(`${filePath}: contains JPEG COM comment`);
      }
      offset += 2 + segLen;
    }
  } else if (lower.endsWith(".png")) {
    const sig = "89504e470d0a1a0a";
    if (buf.subarray(0, 8).toString("hex") !== sig) {
      failures.push(`${filePath}: invalid PNG signature`);
      return;
    }
    let offset = 8;
    while (offset + 12 <= buf.length) {
      const length = buf.readUInt32BE(offset);
      const type = buf.subarray(offset + 4, offset + 8).toString("ascii");
      if (type === "eXIf" || type === "tEXt" || type === "zTXt" || type === "iTXt") {
        failures.push(`${filePath}: contains PNG ${type} metadata chunk`);
      }
      offset += 12 + length;
    }
  }
}

function verifyDist() {
  if (!existsSync(DIST_DIR)) {
    console.error(`ERROR: ${DIST_DIR}/ does not exist. Run \`npm run build\` first.`);
    process.exit(1);
  }

  const failures = [];

  // 1. CNAME & robots.txt
  const cnamePath = join(DIST_DIR, "CNAME");
  if (!existsSync(cnamePath) || readFileSync(cnamePath, "utf8").trim() !== EXPECTED_HOST) {
    failures.push(`dist/CNAME must equal "${EXPECTED_HOST}"`);
  }

  const robotsPath = join(DIST_DIR, "robots.txt");
  const robots = existsSync(robotsPath) ? readFileSync(robotsPath, "utf8") : "";
  if (!robots.includes(`Sitemap: ${SITE_ORIGIN}/sitemap-index.xml`)) {
    failures.push(`dist/robots.txt missing Sitemap: ${SITE_ORIGIN}/sitemap-index.xml`);
  }

  // 2. Build route index from generated HTML
  const allFiles = walk(DIST_DIR);
  const htmlFiles = allFiles.filter((file) => file.endsWith(".html"));
  if (htmlFiles.length === 0) failures.push("No HTML files built under dist/");

  const routes = new Map();
  for (const file of htmlFiles) {
    const route = normalizeRoute(relative(DIST_DIR, file));
    const html = readFileSync(file, "utf8");
    const doc = new JSDOM(html).window.document;
    const ids = new Set(
      [...doc.querySelectorAll("[id]")].map((el) => el.getAttribute("id")).filter(Boolean),
    );
    routes.set(route, { file, html, doc, ids });
  }

  // 3. Sitemap entries must all resolve to built routes on apex origin
  const sitemapPath = join(DIST_DIR, "sitemap-0.xml");
  if (!existsSync(sitemapPath)) {
    failures.push("dist/sitemap-0.xml missing");
  } else {
    const sitemap = readFileSync(sitemapPath, "utf8");
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    if (locs.length === 0) failures.push("dist/sitemap-0.xml has no <loc> entries");
    for (const loc of locs) {
      if (!loc.startsWith(`${SITE_ORIGIN}/`)) {
        failures.push(`Sitemap entry uses non-apex origin: ${loc}`);
        continue;
      }
      const route = loc.slice(SITE_ORIGIN.length) || "/";
      if (!routes.has(route)) {
        failures.push(`Sitemap route not found in dist/: ${route}`);
      }
    }
  }

  // 4. Per-page HTML hygiene, links, canonicals, security attributes
  for (const [route, { html, doc }] of routes) {
    const canonicalHref = doc.querySelector('link[rel="canonical"]')?.getAttribute("href");
    if (!canonicalHref || !canonicalHref.startsWith(`${SITE_ORIGIN}/`)) {
      failures.push(`${route}: invalid or missing canonical URL (${canonicalHref ?? "none"})`);
    }

    const referrerPolicy = doc.querySelector('meta[name="referrer"]')?.getAttribute("content");
    if (referrerPolicy !== "strict-origin-when-cross-origin") {
      failures.push(`${route}: missing strict-origin-when-cross-origin referrer policy`);
    }

    // Check internal href links and anchors (skipping inline <script> text literals)
    for (const el of doc.querySelectorAll("[href]")) {
      const tagName = el.tagName.toLowerCase();
      const href = el.getAttribute("href") ?? "";
      if (!href) continue;

      if (/^(javascript|vbscript):/i.test(href.trim())) {
        failures.push(`${route}: unsafe script URL in href="${href}"`);
        continue;
      }

      if (tagName === "a" && (el.getAttribute("target") ?? "").toLowerCase() === "_blank") {
        const relTokens = new Set((el.getAttribute("rel") ?? "").toLowerCase().split(/\s+/));
        if (!relTokens.has("noopener") || !relTokens.has("noreferrer")) {
          failures.push(
            `${route}: external target="_blank" link missing noopener noreferrer (${href})`,
          );
        }
      }

      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("data:")
      ) {
        const relTokens = new Set((el.getAttribute("rel") ?? "").toLowerCase().split(/\s+/));
        if (
          tagName === "link" &&
          (relTokens.has("stylesheet") || relTokens.has("preload")) &&
          !href.startsWith(SITE_ORIGIN)
        ) {
          failures.push(`${route}: external stylesheet/preload URL disallowed (${href})`);
        }
        continue;
      }

      const [rawPath, hash] = href.split("#");
      let targetRoute = rawPath || route;
      if (
        targetRoute !== "/" &&
        !targetRoute.endsWith(".html") &&
        !targetRoute.endsWith("/") &&
        !/\.[a-z0-9]+$/i.test(targetRoute)
      ) {
        targetRoute += "/";
      }

      if (/\.(css|js|svg|png|jpg|jpeg|webp|woff2|xml|txt|ico)$/i.test(targetRoute)) {
        const assetPath = join(DIST_DIR, targetRoute.replace(/^\//, ""));
        if (!existsSync(assetPath)) {
          failures.push(`${route}: broken static asset href="${href}"`);
        }
        continue;
      }

      const target = routes.get(targetRoute);
      if (!target) {
        failures.push(`${route}: broken internal route href="${href}"`);
      } else if (hash && !target.ids.has(hash)) {
        failures.push(`${route}: broken fragment anchor href="${href}"`);
      }
    }

    // Disallow external CDN script sources
    for (const script of doc.querySelectorAll("script[src]")) {
      const src = script.getAttribute("src") ?? "";
      if (/^https?:\/\//i.test(src) && !src.startsWith(SITE_ORIGIN)) {
        failures.push(`${route}: external script src disallowed (${src})`);
      }
    }

    // Guard against leaked local paths
    if (/\/Users\/[a-z0-9_-]+/i.test(html)) {
      failures.push(`${route}: local filesystem path leaked into built HTML`);
    }
  }

  // 5. Public images EXIF/XMP/IPTC hygiene
  if (existsSync(PUBLIC_IMAGES_DIR)) {
    for (const imageFile of walk(PUBLIC_IMAGES_DIR)) {
      if (/\.(jpe?g|png)$/i.test(imageFile)) {
        checkImageMetadata(imageFile, failures);
      }
    }
  }

  if (failures.length > 0) {
    console.error(`SITE VERIFICATION FAILED (${failures.length} issue(s)):`);
    for (const issue of failures) console.error(`  - ${issue}`);
    process.exit(1);
  }

  console.log(
    `SITE VERIFICATION PASSED: ${routes.size} HTML routes, links, canonicals, CSP/link hygiene, and public image metadata verified.`,
  );
}

verifyDist();
