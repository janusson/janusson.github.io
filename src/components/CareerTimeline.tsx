/**
 * CareerTimeline.tsx
 *
 * Vertical timeline of the intellectual trajectory: bench chemistry →
 * mass spectrometry infrastructure. Hydrated on the About page with
 * `client:load`.
 *
 * DATE AUDIT: the module audits the rendered page for conflicting Glasgow
 * postdoc date claims BEFORE React renders the timeline. The canonical
 * range is GLASGOW_POSTDOC (2017–2020); any date range on the page that
 * starts in 2017 but ends differently ("2017 – 2021", "2017–2019", …) is
 * flagged to the console with a locatable text snippet. This catches
 * content drift between pages (About, Publications) as the site
 * evolves — run `findGlasgowDateConflicts` on any text to reuse the scan.
 */

export interface CareerEntry {
  period: string;
  institution: string;
  role: string;
  /** One-line intellectual thread connecting this era to the next. */
  theme: string;
  /** Focus areas / skills acquired in this era. */
  skills: string[];
  /** Marks the final entry; renders the pulsing "Current" node. */
  current?: boolean;
}

export const GLASGOW_POSTDOC = { start: 2017, end: 2020 } as const;

export interface GlasgowDateConflict {
  /** The exact conflicting range as written on the page, e.g. "2017 – 2021". */
  claim: string;
  /** Snippet of surrounding page text so the source is locatable. */
  context: string;
}

/** Matches "2017–2020", "2017 – 2021", "2017-2019", … (en/em dash or hyphen). */
const DATE_RANGE_RE = /(20\d{2})\s*(?:–|—|-)\s*(20\d{2})/g;

export function findGlasgowDateConflicts(
  text: string,
  canonical: Readonly<{ start: number; end: number }> = GLASGOW_POSTDOC,
): GlasgowDateConflict[] {
  const conflicts: GlasgowDateConflict[] = [];
  const SNIPPET = 60;

  for (const match of text.matchAll(DATE_RANGE_RE)) {
    const start = Number(match[1]);
    const end = Number(match[2]);
    if (start !== canonical.start || end === canonical.end) continue;

    const index = match.index ?? 0;
    const before = text.slice(Math.max(0, index - SNIPPET), index);
    const after = text.slice(index + match[0].length, index + match[0].length + SNIPPET);
    conflicts.push({
      claim: match[0],
      context: `${before}⟦${match[0]}⟧${after}`.replace(/\s+/g, " ").trim(),
    });
  }

  return conflicts;
}

/** Scans the rendered page and logs any Glasgow postdoc date conflicts. */
export function auditGlasgowPostdocDates(): void {
  if (typeof document === "undefined") return; // SSR / node test environments

  const conflicts = findGlasgowDateConflicts(document.body.innerText);
  const canonical = `${GLASGOW_POSTDOC.start}–${GLASGOW_POSTDOC.end}`;

  if (conflicts.length === 0) {
    console.info(
      `[CareerTimeline] Date audit: no conflicting Glasgow postdoc dates on ${location.pathname} (canonical ${canonical}).`,
    );
    return;
  }

  console.warn(
    `[CareerTimeline] Date audit: ${conflicts.length} Glasgow postdoc date claim(s) conflict with canonical ${canonical} on ${location.pathname}:`,
  );
  for (const conflict of conflicts) {
    console.warn(`  ✗ "${conflict.claim}"  —  …${conflict.context}…`);
  }
}

// Run before the timeline renders: at hydration time the page's final text
// is already in the DOM, and React renders the tree after this executes.
auditGlasgowPostdocDates();

const ENTRIES: CareerEntry[] = [
  {
    period: "2012 – 2017",
    institution: "University of Victoria",
    role: "PhD Researcher",
    theme:
      "Electrospray physics and real-time reaction monitoring — mass spectrometry as a probe for chemistry in motion, watching transient catalytic intermediates as they form.",
    skills: ["ESI Physics", "Reaction Monitoring", "Organometallic Chemistry"],
  },
  {
    period: "2017 – 2020",
    institution: "University of Glasgow",
    role: "Postdoctoral Research Associate",
    theme:
      "Ion mobility and high-dimensional HRMS meet automated Python analytics — the point where the analysis first outgrew the instrument software.",
    skills: [
      "Ion Mobility (TWIMS)",
      "HRMS",
      "Inorganic Self-Assembly",
      "Automated Python Analytics",
    ],
  },
  {
    period: "2021 – 2022",
    institution: "Delic Labs",
    role: "Lead Chemist",
    theme:
      "Regulated lab operations formalize the bench: commissioning a federally authorized facility, ISO/IEC 17025 workflows, and computational screening at scale.",
    skills: ["Regulated Lab Operations", "LC-MS/MS", "QA/QC", "Computational Screening"],
  },
  {
    period: "2024 – 2026",
    institution: "TMC Manufacturing",
    role: "Principal Scientist, Analytical Development & Laboratory Operations",
    theme:
      "Industrial analytical engineering — trace-element ICP-MS, high-purity materials, and the analyst as capital decision-maker.",
    skills: [
      "Industrial ICP-MS",
      "High-Purity Materials",
      "Analytical Engineering",
      "Method Validation",
    ],
  },
  {
    period: "2026 – present",
    institution: "Open-Source Scientific Software",
    role: "Independent Software Developer",
    theme: "Mass spectrometry infrastructure (MassFlow and MSMCP) built for the long haul.",
    skills: ["MassFlow", "MSMCP", "Mass Spectrometry Infrastructure", "Open Source"],
    current: true,
  },
];

/**
 * NOTE ON `!` MODIFIERS: BaseLayout's hand-rolled base styles are
 * unlayered and outrank layered Tailwind utilities, so margin/padding
 * utilities (and colors on p/li) use `!` — same convention as
 * SelectedWork.astro and the homepage.
 */
export default function CareerTimeline() {
  return (
    <section className="relative mx-auto! max-w-3xl" aria-label="Career timeline">
      {/* Vertical rail — left on mobile, centered on desktop */}
      <div
        aria-hidden="true"
        className="absolute bottom-2 left-4 top-2 w-px bg-kanagawa-wave md:left-1/2 md:-translate-x-1/2"
      />

      <ol className="m-0! flex list-none flex-col gap-6! p-0!">
        {ENTRIES.map((entry, index) => {
          const onLeft = index % 2 === 0; // desktop alternation
          return (
            <li
              key={entry.institution}
              className="relative m-0! md:grid md:grid-cols-2 md:gap-x-14"
            >
              {/* Node on the rail */}
              <span
                aria-hidden="true"
                className={[
                  "absolute left-4 top-6 -translate-x-1/2 rounded-full md:left-1/2",
                  entry.current
                    ? "h-4 w-4 animate-pulse border-2 border-kanagawa-bg bg-kanagawa-gold"
                    : "h-3 w-3 border-2 border-kanagawa-bg bg-kanagawa-accent",
                ].join(" ")}
              />

              <div
                className={
                  onLeft ? "ml-12! md:col-start-1 md:ml-0!" : "ml-12! md:col-start-2 md:ml-0!"
                }
              >
                <div className="rounded-xl border border-kanagawa-wave bg-[var(--color-card-bg)] p-5! backdrop-blur-[6px] transition hover:-translate-y-0.5 hover:border-kanagawa-accent">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-kanagawa-accent">
                      {entry.period}
                    </span>
                    {entry.current && (
                      <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-widest text-kanagawa-gold">
                        Current
                      </span>
                    )}
                  </div>

                  <h3 className="mt-2! mb-0!">{entry.institution}</h3>
                  <div className="font-[family-name:var(--font-mono)] text-xs text-kanagawa-muted">
                    {entry.role}
                  </div>

                  <p className="mt-3! mb-0! text-sm leading-relaxed">{entry.theme}</p>

                  <div className="mt-3! flex flex-wrap gap-2">
                    {entry.skills.map((skill) => (
                      <span key={skill} className="chip">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
