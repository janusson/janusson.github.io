/**
 * Shared content for the portfolio: featured projects, case studies,
 * "What I Work On" domains, and primary contact links.
 *
 * Single source of truth used by the homepage, the Projects page,
 * and the Contact page, so copy and links stay consistent site-wide.
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
    tagline: "MS/MS spectra to annotated libraries and molecular networks.",
    description:
      "A config-driven Python toolkit for local MS/MS annotation. Input: raw MS/MS fragmentation spectra. Operation: spectral similarity scoring, spectral library construction, and molecular networking. Output: annotated, version-controlled spectral libraries and interactive molecular networks.",
    problem:
      "MS/MS annotation is performed with vendor-locked tools and one-off scripts; spectral library construction and molecular networking are not reproducible or transferable.",
    approach:
      "A config-driven Python toolkit. Input: raw MS/MS fragmentation spectra. Operation: spectral similarity scoring, spectral library construction, and molecular networking. Output: annotated, version-controlled libraries and interactive molecular networks.",
    tech: ["Python", "matchms", "pyteomics", "Molecular Networking", "Visualization"],
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
    tagline: "MS datasets to queryable tools and resources for AI agents.",
    description:
      "A Model Context Protocol (MCP) server. Input: raw and processed MS datasets. Operation: exposure as MCP tools and resources. Output: programmatically queryable access for AI assistants and agents.",
    problem:
      "AI assistants have no direct access to raw or processed MS datasets; analysis requires manual transfer between tools.",
    approach:
      "A Model Context Protocol (MCP) server. Input: mass spectrometry datasets. Operation: exposure as queryable tools and resources. Output: direct programmatic access for AI workflows.",
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
      "A Python web application. Input: historical price data. Operation: portfolio optimization, asset-allocation backtesting, and dollar-cost-averaging (DCA) analysis. Output: dashboards and experiment records.",
    problem:
      "Portfolio optimization, backtesting, and DCA analysis are performed in ad-hoc notebooks; results are not reusable, comparable, or shareable.",
    approach:
      "A Python web application. Input: historical price data. Operation: portfolio optimization, backtesting, and DCA analysis. Output: dashboards and experiment records.",
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
  icon: string;
  title: string;
  blurb: string;
}

/** "What I Work On" — compact domains. */
export const domains: Domain[] = [
  {
    icon: "fa-solid fa-flask",
    title: "Mass Spectrometry & Separations",
    blurb:
      "LC-MS/MS, GC-MS, TWIMS, Orbitrap, QTOF, and ICP-MS — from method development to data interpretation.",
  },
  {
    icon: "fa-solid fa-diagram-project",
    title: "Spectral Similarity & Networking",
    blurb:
      "Custom similarity scoring, local spectral libraries, and molecular networking for MS/MS data.",
  },
  {
    icon: "fa-solid fa-gears",
    title: "Data Pipelines & Automation",
    blurb:
      "Config-first, version-controlled pipelines for high-throughput annotation and automated databasing.",
  },
  {
    icon: "fa-solid fa-robot",
    title: "AI × Instruments",
    blurb:
      "MCP servers that give AI agents direct, queryable access to mass spectrometry datasets.",
  },
  {
    icon: "fa-solid fa-clipboard-check",
    title: "Reproducible & Regulated Science",
    blurb:
      "ISO/IEC 17025-aligned methods and tooling built to hold up in regulated laboratory environments.",
  },
  {
    icon: "fa-solid fa-chart-line",
    title: "Interactive Visualization",
    blurb: "Human-readable views of spectral data — networks, dashboards, and result plots.",
  },
];

export interface ContactLink {
  label: string;
  value: string;
  href: string;
  icon: string;
}

/** Primary contact channels — kept deliberately short. */
export const contactLinks: ContactLink[] = [
  {
    label: "GitHub",
    value: "github.com/janusson",
    href: "https://github.com/janusson",
    icon: "fa-brands fa-github",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/eric-janusson",
    href: "https://www.linkedin.com/in/eric-janusson",
    icon: "fa-brands fa-linkedin",
  },
  {
    label: "ORCID",
    value: "0000-0002-3207-7067",
    href: "https://orcid.org/0000-0002-3207-7067",
    icon: "fa-brands fa-orcid",
  },
];
