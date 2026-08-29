#!/usr/bin/env node
/**
 * audit-facts.mjs — factual-consistency audit for janusson.github.io.
 *
 * Scans every content file under src/ (MDX/MD pages, content collections,
 * structured data in .astro/.tsx) and cross-checks biographical facts:
 *
 *   1. Employment windows — the same employer claimed with different
 *      dates across files (e.g. Glasgow postdoc 2017–2020 vs 2017–2021).
 *   2. Job titles — the same employer with different titles.
 *   3. Publication years — frontmatter `year` sanity, plus URL-year vs
 *      frontmatter-year mismatches in the publications collection.
 *
 * The authoritative trajectory is derived from CareerTimeline.tsx (the
 * newest structured source); every other file is compared against it.
 * Heuristic, not exhaustive: windows are matched from the `**Role |
 * Employer (YYYY – YYYY)**` bullet pattern, prose "Employer (YYYY–YYYY)"
 * mentions, and the structured entry objects in CareerTimeline.tsx and
 * index.astro.
 *
 * Usage:
 *   node audit-facts.mjs           # human-readable report (exit 1 on discrepancies)
 *   node audit-facts.mjs --json    # machine-readable JSON report
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = fileURLToPath(new URL("./src", import.meta.url));
const CANONICAL_SOURCE = "CareerTimeline.tsx";
const CONTENT_EXTENSIONS = new Set([".md", ".mdx", ".astro", ".ts", ".tsx"]);

const findings = { discrepancies: [], variances: [], infos: [] };
const employment = []; // { employer, role, start, end, file, line }
const roleOnly = []; // { role, start, end, file } — no employer captured

const flag = (bucket, level, title, lines) =>
  findings[bucket].push({ level, title, lines });

/* ── file collection ─────────────────────────────────────────────── */

function walk(dir, out = [], exts = CONTENT_EXTENSIONS) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      // Test fixtures aren't site facts — the audit scans content only.
      if (entry === "__tests__") continue;
      walk(full, out, exts);
    } else if (exts.has(extname(full))) out.push(full);
  }
  return out;
}

const scanned = walk(SRC);

/* ── frontmatter helpers ─────────────────────────────────────────── */

function frontmatter(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  return m ? m[1] : "";
}

function yamlValue(fm, key) {
  const m = new RegExp(`^${key}:\\s*(.+)$`, "m").exec(fm);
  if (!m) return undefined;
  return m[1].trim().replace(/^["']|["']$/g, "");
}

/* ── window parsing ──────────────────────────────────────────────── */

/** "2012 – 2017" → { start: 2012, end: 2017 }; "2026 – present" → { start: 2026, end: "present" }. */
function parseWindow(raw) {
  const m = /^\s*(\d{4})\s*[–—-]\s*(\d{4}|present|now)\s*$/i.exec(raw);
  if (!m) return null;
  const end = /^\d{4}$/.test(m[2]) ? Number(m[2]) : m[2].toLowerCase();
  return { start: Number(m[1]), end, raw: raw.replace(/\s+/g, " ") };
}

const windowKey = (w) => (w ? `${w.start}-${w.end}` : null);

/** Extracts employment records from a file's text using known patterns. */
function extractEmployment(text, file) {
  const rel = relative(SRC, file);

  // Structured entries — CareerTimeline.tsx: period/institution/role
  const tlRe = /period:\s*"([^"]+)",\s*\r?\n\s*institution:\s*"([^"]+)",\s*\r?\n\s*role:\s*"([^"]+)"/g;
  for (const m of text.matchAll(tlRe)) {
    const w = parseWindow(m[1]);
    if (w) employment.push({ employer: m[2].trim(), role: m[3].trim(), ...w, file: rel, line: "structured entry" });
  }

  // Structured entries — index.astro SelectedWork: slug/organization/role/timeline
  const swRe = /slug:\s*"([^"]+)",\s*\r?\n\s*organization:\s*"([^"]+)",\s*\r?\n\s*role:\s*"([^"]+)",\s*\r?\n\s*timeline:\s*"([^"]+)"/g;
  for (const m of text.matchAll(swRe)) {
    const w = parseWindow(m[4]);
    employment.push({
      employer: m[2].trim(),
      role: m[3].trim(),
      ...(w ?? { start: null, end: null }),
      file: rel,
      line: `SelectedWork entry "${m[1]}"`,
    });
  }

  // Bullets: `**Role | Employer (YYYY – YYYY):**` (About page)
  const bulletRe = /\*\*([^*|]+?)\s*\|\s*([^*|]+?)\s*\((\d{4})\s*[–—-]\s*(\d{4}|present|now)\)\s*:?\*\*/gi;
  for (const m of text.matchAll(bulletRe)) {
    employment.push({
      employer: m[2].trim(),
      role: m[1].trim(),
      start: Number(m[3]),
      end: /^\d{4}$/.test(m[4]) ? Number(m[4]) : m[4].toLowerCase(),
      file: rel,
      line: "experience bullet",
    });
  }

  // Role-only bullets: `**Role (YYYY – YYYY):**` (no employer named)
  const roleRe = /\*\*([^*]+?)\s*\((\d{4})\s*[–—-]\s*(\d{4}|present|now)\)\s*:?\*\*/gi;
  for (const m of text.matchAll(roleRe)) {
    roleOnly.push({
      role: m[1].trim(),
      start: Number(m[2]),
      end: /^\d{4}$/.test(m[3]) ? Number(m[3]) : m[3].toLowerCase(),
      file: rel,
    });
  }

  // Prose mentions: "University of Glasgow (2017 – 2021)" in case studies, etc.
  // Run on bold-stripped text so **Role | Employer (…)** bullets aren't double-counted.
  const proseRe =
    /(University of Victoria|University of Glasgow|Delic Labs|TMC Manufacturing)\s*\((\d{4})\s*[–—-]\s*(\d{4}|present|now)\)/gi;
  for (const m of text.replace(/\*\*[^*]*\*\*/g, " ").matchAll(proseRe)) {
    employment.push({
      employer: m[1],
      role: null,
      start: Number(m[2]),
      end: /^\d{4}$/.test(m[3]) ? Number(m[3]) : m[3].toLowerCase(),
      file: rel,
      line: "prose mention",
    });
  }
}

// Extract employment records from every scanned file.
for (const file of scanned) {
  extractEmployment(readFileSync(file, "utf8"), file);
}

/* ── canonical trajectory (CareerTimeline.tsx) ───────────────────── */

const canonical = new Map(); // employer → { window, role, file }
for (const rec of employment.filter((r) => r.file.endsWith(CANONICAL_SOURCE))) {
  canonical.set(rec.employer, { window: { start: rec.start, end: rec.end }, role: rec.role });
}

/* ── cross-file comparison ───────────────────────────────────────── */

const seen = new Set();
for (const rec of employment.filter((r) => !r.file.endsWith(CANONICAL_SOURCE))) {
  const canon = canonical.get(rec.employer);
  if (!canon) continue; // project entries (MassFlow, MSMCP) or unknown — not audited

  const key = `${rec.employer}|${rec.start}-${rec.end}|${rec.file}`;
  if (seen.has(key)) continue;
  seen.add(key);

  if (rec.start !== null && windowKey({ start: rec.start, end: rec.end }) !== windowKey(canon.window)) {
    flag(
      "discrepancies",
      "DISCREPANCY",
      `employment window — ${rec.employer}`,
      [
        `  canonical (${CANONICAL_SOURCE}):  ${canon.window.start} – ${canon.window.end}`,
        `  ${rec.file}:                     ${rec.start} – ${rec.end}  (${rec.line})`,
      ],
    );
  }

  if (rec.role) {
    const a = rec.role.toLowerCase();
    const b = canon.role.toLowerCase();
    if (a !== b) {
      const subsumed = a.includes(b) || b.includes(a);
      flag(
        subsumed ? "variances" : "discrepancies",
        subsumed ? "VARIANCE" : "DISCREPANCY",
        `job title — ${rec.employer}`,
        [
          `  canonical (${CANONICAL_SOURCE}):  "${canon.role}"`,
          `  ${rec.file}:                     "${rec.role}"  (${rec.line})`,
        ],
      );
    }
  }
}

// Role-only records (no employer captured): match canonical by role.
for (const rec of roleOnly) {
  const canon = [...canonical.values()].find(
    (c) => c.role.toLowerCase() === rec.role.toLowerCase(),
  );
  if (!canon) continue;
  if (windowKey({ start: rec.start, end: rec.end }) !== windowKey(canon.window)) {
    flag(
      "discrepancies",
      "DISCREPANCY",
      `employment window — ${rec.role}`,
      [
        `  canonical (${CANONICAL_SOURCE}):  ${canon.window.start} – ${canon.window.end}`,
        `  ${rec.file}:                     ${rec.start} – ${rec.end}  (${rec.line})`,
      ],
    );
  }
}

/* ── publication years ───────────────────────────────────────────── */

const PUB_DIR = join("content", "publications");
for (const file of scanned) {
  if (!file.includes(PUB_DIR) || !/\.mdx?$/.test(file)) continue;
  const text = readFileSync(file, "utf8");
  const fm = frontmatter(text);
  const year = Number(yamlValue(fm, "year"));
  const url = yamlValue(fm, "url") ?? "";
  const rel = relative(SRC, file);

  if (!Number.isInteger(year) || year < 1990 || year > 2035) {
    flag("discrepancies", "DISCREPANCY", `publication year out of range — ${rel}`, [
      `  year: ${yamlValue(fm, "year") ?? "(missing)"}`,
    ]);
    continue;
  }
  const urlYear = /\/(20\d{2})\//.exec(url)?.[1] ?? /chemrxiv-(20\d{2})/.exec(url)?.[1];
  if (urlYear && Number(urlYear) !== year) {
    flag("variances", "VARIANCE", `publication URL year vs frontmatter year — ${rel}`, [
      `  url:  ${url}`,
      `  year: ${year} (url implies ${urlYear})`,
    ]);
  }
}

/* ── CV PDF note ─────────────────────────────────────────────────── */

const PUBLIC = fileURLToPath(new URL("./public", import.meta.url));
const pdfs = walk(PUBLIC, [], new Set([".pdf"]));
for (const pdf of pdfs) {
  flag("infos", "INFO", "CV PDF is binary — content not parsed", [
    `  ${relative(fileURLToPath(new URL(".", import.meta.url)), pdf)}`,
    `  (facts inside the PDF are outside this audit's scope)`,
  ]);
}

/* ── report ──────────────────────────────────────────────────────── */

const report = {
  scannedFiles: scanned.length,
  employmentRecords: employment.length,
  discrepancies: findings.discrepancies,
  variances: findings.variances,
  infos: findings.infos,
};

if (process.argv.includes("--json")) {
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
} else {
  const line = "─".repeat(64);
  process.stdout.write(`FACT AUDIT — janusson.github.io\n${line}\n`);
  process.stdout.write(`Scanned ${scanned.length} files · ${employment.length} employment records\n\n`);

  const sections = [
    ["DISCREPANCIES", findings.discrepancies],
    ["VARIANCES", findings.variances],
    ["INFO", findings.infos],
  ];
  for (const [label, items] of sections) {
    if (items.length === 0) continue;
    process.stdout.write(`${label}\n${line}\n`);
    for (const item of items) {
      process.stdout.write(`\n${item.level}  ${item.title}\n`);
      item.lines.forEach((l) => process.stdout.write(`${l}\n`));
    }
    process.stdout.write("\n");
  }

  const d = findings.discrepancies.length;
  const v = findings.variances.length;
  const i = findings.infos.length;
  process.stdout.write(`${line}\nSUMMARY: ${d} discrepancy(ies) · ${v} variance(s) · ${i} info\n`);
  if (d > 0) process.stdout.write(`Exit code 1 — reconcile dates/titles before publishing.\n`);
  else process.stdout.write(`Exit code 0 — no factual discrepancies found.\n`);
}

process.exit(findings.discrepancies.length > 0 ? 1 : 0);
