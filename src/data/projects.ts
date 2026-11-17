import type { IconName } from "./icons";

/**
 * Shared content for the portfolio: featured projects, case studies,
 * "What I Work On" domains, and primary contact links.
 *
 * Single source of truth for portfolio content — project entries,
 * "What I Work On" domains, and contact links — so copy and links stay
 * consistent site-wide.
 */

export interface ProjectLink {
  label: string;
  href: string;
  external?: boolean;
}

export type ProjectVisibility = "public" | "proprietary";

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  /** Distinguish open-source repositories from private/proprietary systems. */
  visibility: ProjectVisibility;
  /** Mini case study — "Systems Deployed" */
  problem: string;
  approach: string;
  tech: string[];
  /** Compact inline metadata chips (Stack / Domain / License) */
  meta: { label: string; value: string }[];
  links: ProjectLink[];
  featured: boolean;
  /**
   * The single most convincing result, rendered in the card's display slot.
   * Never a language, framework, or licence — those belong in `meta`.
   */
  metric: { value: string; label: string };
}

export const projects: Project[] = [
  {
    slug: "massflow",
    name: "MassFlow",
    visibility: "public",
    tagline: "Local MS/MS library search and candidate annotation.",
    description:
      "A config-driven Python toolkit for searching MS/MS spectra (mzML, mzXML, MGF) against local MSP and SQLite libraries. It ranks candidate annotations using classical spectral similarity and exports CSV and mzTab-M results with per-file provenance sidecars. Candidates are not confirmed identifications; molecular networking and GraphML export are planned, not implemented, and an experimental terminal viewer can plot spectra.",
    problem:
      "Spectral annotation workflows can be difficult to reproduce across tools and datasets.",
    approach:
      "Use configuration files, similarity scoring, and reusable SQLite libraries to make local searches and their provenance easier to inspect.",
    metric: { value: "Provenance", label: "per-file sidecar for every run" },
    tech: ["Python", "matchms", "pyteomics", "MS/MS"],
    meta: [
      { label: "Stack", value: "Python · matchms · pyteomics" },
      { label: "Domain", value: "MS/MS Annotation" },
      { label: "License", value: "MIT" },
    ],
    links: [
      { label: "Documentation", href: "https://ericjanusson.ca/MassFlow/", external: true },
      { label: "GitHub", href: "https://github.com/janusson/MassFlow", external: true },
    ],
    featured: true,
  },
  {
    slug: "msmcp",
    name: "MSMCP",
    visibility: "public",
    tagline: "Mass spectrometry data tools for MCP-compatible clients.",
    description:
      'A Model Context Protocol server (v1.0.0) exposing exact-mass validation, adduct and isotope chemistry, QC, spectral similarity, and library search over stdio (mzML/MGF/imzML; vendor files need conversion; no instrument control). Server-side data references keep large peak arrays out of model context windows. Search significance was withdrawn rather than reported: no p-values, no q-values, no false-discovery-rate claim at any library size, and provenance records significance_status="uncalibrated".',
    problem:
      "AI-assisted workflows often lack structured, auditable access to mass spectrometry data without flooding context windows.",
    approach:
      "Expose local computations through MCP tools over stdio using server-side data references and per-result provenance.",
    metric: { value: "Withdrawn", label: "significance and FDR claims" },
    tech: ["Python", "MCP", "AI Integration", "MS Data Access"],
    meta: [
      { label: "Stack", value: "Python · MCP" },
      { label: "Domain", value: "AI × Mass Spectrometry" },
      { label: "License", value: "MIT" },
    ],
    links: [
      { label: "Documentation", href: "https://msmcp.dev/", external: true },
      { label: "GitHub", href: "https://github.com/janusson/MSMCP", external: true },
    ],
    featured: true,
  },
  {
    slug: "masspilot",
    name: "MassPilot",
    visibility: "proprietary",
    tagline: "Proprietary LC-HRMS annotation review tooling.",
    description:
      "A private, proprietary software tool for structured review of LC-HRMS compound annotations and analytical evidence. Source code, architecture, and internal workflows are not publicly distributed; outputs support human technical review rather than automated compound identification.",
    problem:
      "Annotation tables often summarize conclusions without surfacing the underlying chemical and spectral consistency checks needed for technical review.",
    approach:
      "Independent analytical consistency review within a private workflow, without asserting statistical identification significance.",
    metric: { value: "Private", label: "proprietary LC-HRMS review tool" },
    tech: ["Python", "LC-HRMS", "QA Review"],
    meta: [
      { label: "Domain", value: "LC-HRMS Evidence Review" },
      { label: "License", value: "Proprietary" },
    ],
    links: [],
    featured: true,
  },
  {
    slug: "pysharpe",
    name: "PySharpe",
    visibility: "public",
    tagline: "Portfolio optimization, backtesting, and Canadian tax-aware DCA analysis.",
    description:
      "A Python CLI and Streamlit application for portfolio optimization, historical backtesting, and dollar-cost-averaging simulation calibrated to Canadian registered accounts, withholding taxes, and currency friction, with interactive dashboards and CSV exports. Backtests do not predict or establish future investment performance.",
    problem: "Comparing portfolio strategies across separate notebooks can be cumbersome.",
    approach:
      "Bring optimization, historical backtesting, and DCA simulation into a reproducible Python workflow.",
    metric: { value: "Backtests", label: "strategy comparison" },
    tech: ["Python", "Optimization", "Backtesting", "Streamlit"],
    meta: [
      { label: "Stack", value: "Python · Streamlit" },
      { label: "Domain", value: "Quantitative Finance" },
      { label: "License", value: "MIT" },
    ],
    links: [{ label: "GitHub", href: "https://github.com/janusson/PySharpe", external: true }],
    featured: false,
  },
];

export const featuredProjects = projects.filter((project) => project.featured);

export interface Domain {
  icon: IconName;
  title: string;
  blurb: string;
}

/** "What I Work On" — compact domains. */
export const domains: Domain[] = [
  {
    icon: "flask",
    title: "Mass Spectrometry & Separations",
    blurb:
      "Five mass-analyser classes in practice — quadrupole, QqQ, QTOF, ion trap, magnetic sector and Orbitrap — with the sources, separations and method validation around them. LC-MS/MS, GC-MS, TWIMS and ICP-MS from development through to interpretation.",
  },
  {
    icon: "diagram-project",
    title: "Spectral Search & Annotation",
    blurb: "Spectral similarity, local libraries, and candidate annotation for MS/MS data.",
  },
  {
    icon: "gears",
    title: "Data Pipelines & Automation",
    blurb:
      "Config-first, version-controlled pipelines for high-throughput annotation and automated databasing.",
  },
  {
    icon: "robot",
    title: "AI × MS Data",
    blurb:
      "MCP tools that connect compatible AI clients to mass spectrometry data and computations.",
  },
  {
    icon: "clipboard-check",
    title: "Reproducible & Regulated Science",
    blurb:
      "ISO/IEC 17025-aligned methods and tooling built to hold up in regulated laboratory environments.",
  },
  {
    icon: "chart-line",
    title: "Interactive Visualization",
    blurb: "Human-readable views of analytical data, from result plots to dashboards.",
  },
];

export interface ContactLink {
  label: string;
  value: string;
  href: string;
  icon: IconName;
}

/** Primary contact channels — kept deliberately short. */
export const contactLinks: ContactLink[] = [
  {
    label: "Email",
    value: "eric@ericjanusson.ca",
    href: "mailto:eric@ericjanusson.ca",
    icon: "envelope",
  },
  {
    label: "GitHub",
    value: "github.com/janusson",
    href: "https://github.com/janusson",
    icon: "github",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/eric-janusson",
    href: "https://www.linkedin.com/in/eric-janusson",
    icon: "linkedin",
  },
  {
    label: "ORCID",
    value: "0000-0002-3207-7067",
    href: "https://orcid.org/0000-0002-3207-7067",
    icon: "orcid",
  },
];
