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
  /** Mini case study — "Selected Projects" */
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
    tagline: "Vendor-agnostic MS/MS annotation, spectral libraries, and molecular networking.",
    description:
      "A config-first Python toolkit for local tandem mass spectrometry (MS/MS) annotation — custom spectral similarity scoring, version-controlled spectral libraries, and interactive molecular networks.",
    problem:
      "MS/MS annotation workflows are scattered across vendor-locked tools and one-off scripts, so spectral library construction and molecular networking are hard to reproduce or hand off.",
    approach:
      "A config-first, version-controlled Python toolkit that turns raw fragmentation data into annotated libraries, using custom spectral similarity scoring and interactive network visualization.",
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
    tagline: "Mass spectrometry data, integrated directly into AI workflows.",
    description:
      "A Model Context Protocol (MCP) server that exposes raw and processed MS datasets as queryable tools and resources for AI assistants and agents.",
    problem:
      "AI assistants can't touch raw or processed MS datasets directly — scientists fall back to manual copying, pasting, and summarizing between tools.",
    approach:
      "A Model Context Protocol server that wraps mass spectrometry datasets as queryable tools and resources, so AI workflows can query and analyze the data directly.",
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
    tagline: "Quantitative portfolio optimization in a scientific Python ecosystem.",
    description:
      "A Python web app for portfolio optimization, asset-allocation backtesting, and dollar-cost-averaging (DCA) analysis.",
    problem:
      "Portfolio experiments usually live in throwaway notebooks, so optimization, backtesting, and DCA analysis are hard to reuse, compare, or share.",
    approach:
      "A web application built in a scientific Python ecosystem that packages optimization, backtesting, and DCA analysis behind dashboards and experimentation workflows.",
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
    label: "Email",
    value: "ericjanusson@outlook.com",
    href: "mailto:ericjanusson@outlook.com",
    icon: "fa-solid fa-envelope",
  },
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
