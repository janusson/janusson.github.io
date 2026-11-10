import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

/**
 * Publication frontmatter is copied from the DOI record, never paraphrased
 * (see the publications collection note in `src/content.config.ts`).
 *
 * `astro check` validates the schema but cannot see the record, so titles that
 * drifted from the source citation pass every other check. The entries below
 * were paraphrased once; pin them to the record so it cannot happen silently
 * again.
 */

const publicationsDir = fileURLToPath(new URL("../../content/publications/", import.meta.url));

function frontmatter(name: string): string {
  const text = readFileSync(join(publicationsDir, name), "utf8");
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!match) throw new Error(`no frontmatter found in ${name}`);
  return match[1];
}

function field(source: string, key: string): string | undefined {
  const match = new RegExp(`^${key}:\\s*(.+)$`, "m").exec(source);
  return match?.[1].trim().replace(/^["']|["']$/g, "");
}

describe("publication record copy", () => {
  it("keeps the ChemRxiv psilocybin title verbatim", () => {
    const entry = frontmatter("2021-psilocybin-rp-hplc.mdx");

    // https://doi.org/10.26434/chemrxiv-2021-70mm1
    expect(field(entry, "url")).toBe("https://doi.org/10.26434/chemrxiv-2021-70mm1");
    expect(field(entry, "title")).toBe(
      "Rapid quantification of Psilocybin with reversed-phase HPLC and single-wavelength detection",
    );
  });
});
