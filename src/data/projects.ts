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

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  /** Mini case study — "Systems Deployed" */
  problem: string;
  approach: string;
  tech: string[];
  /** Compact inline metadata chips (Stack / Domain / License) */
  meta: { label: string; value: string }[];
  links: ProjectLink[];
  featured: boolean;
}

export const projects: Project[] = [
  {
    slug: "massflow",
    name: "MassFlow",
    tagline: "Local MS/MS library search and candidate annotation.",
    description:
      "A config-driven Python toolkit for searching MS/MS spectra against local libraries. It ranks candidate annotations using spectral similarity and produces CSV results and provenance reports. Candidates are not confirmed identifications; networking and visualization are planned, not implemented.",
    problem:
      "Spectral annotation workflows can be difficult to reproduce across tools and datasets.",
    approach:
      "Use configuration files, similarity scoring, and reusable SQLite libraries to make local searches and their provenance easier to inspect.",
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
    tagline: "Mass spectrometry data tools for MCP-compatible clients.",
    description:
      "A Python Model Context Protocol server exposing tools for loading spectra, quality control, chemistry, similarity, and library search. Core input formats include mzML and MGF; vendor files require conversion. The project does not control instruments, and search significance and FDR are not validated.",
    problem:
      "AI-assisted workflows often lack convenient, structured access to mass spectrometry data and analysis tools.",
    approach:
      "Expose local computations through MCP tools over stdio, with structured responses and server-side data references.",
    tech: ["Python", "MCP", "AI Integration", "MS Data Access"],
    meta: [
      { label: "Stack", value: "Python · MCP" },
      { label: "Domain", value: "AI × Mass Spectrometry" },
      { label: "License", value: "MIT" },
    ],
    links: [{ label: "GitHub", href: "https://github.com/janusson/MSMCP", external: true }],
    featured: true,
  },

  {
    slug: "pysharpe",
    name: "PySharpe",
    tagline: "Price data to portfolio optimizations, backtests, and DCA analyses.",
    description:
      "A Python web application for portfolio optimization, historical backtesting, and dollar-cost-averaging analysis, with dashboards and CSV downloads. Backtests do not establish future investment performance.",
    problem: "Comparing portfolio strategies across separate notebooks can be cumbersome.",
    approach:
      "Bring optimization, backtesting, and DCA analysis into an interactive Python application.",
    tech: ["Python", "Optimization", "Backtesting", "Dashboards"],
    meta: [
      { label: "Stack", value: "Python" },
      { label: "Domain", value: "Quantitative Finance" },
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
      "LC-MS/MS, GC-MS, TWIMS, Orbitrap, QTOF, and ICP-MS — from method development to data interpretation.",
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
