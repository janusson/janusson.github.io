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
      "MassFlow searches MS/MS spectra in mzML, mzXML, or MGF files against local MSP or SQLite libraries. It ranks candidate annotations by spectral similarity and writes CSV results with a provenance file for each input. The supported export is CSV. The experimental mzTab-shaped output lacks mzTab-M conformance. Treat library matches as candidates that need further evidence.",
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
      'MSMCP gives Model Context Protocol clients tools for exact-mass, adduct, isotope, and quality checks, as well as spectrum comparison and library search. It reads mzML, MGF, and imzML files. Convert vendor files first. Clients can refer to spectra by ID while Python runs the calculations on the underlying data. Library search reports similarity rankings with significance_status="uncalibrated".',
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
    tagline: "Review the evidence behind LC-HRMS annotations.",
    description:
      "I am developing MassPilot for scientists reviewing LC-HRMS compound annotations. It helps reviewers inspect the evidence for a proposed assignment and document what needs a closer look.",
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
    tagline: "Compare portfolio strategies under Canadian account and tax assumptions.",
    description:
      "PySharpe is a Python command-line tool and Streamlit app for portfolio optimization, backtesting, and dollar-cost averaging. You can model Canadian account types, withholding taxes, and currency conversion costs, then inspect the results or export them to CSV.",
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
      "My hands-on experience includes LC-MS/MS, GC-MS, ICP-MS, and travelling-wave ion mobility (TWIMS). I have worked with quadrupole, QqQ, QTOF, ion trap, magnetic sector, and Orbitrap instruments.",
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
