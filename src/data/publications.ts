export const PUBLICATION_THEMES = [
  {
    key: "fundamentals",
    title: "Mass Spectrometry Fundamentals",
    blurb:
      "How ions are born at the surface of charged droplets: surface activity, spray geometry, and the physics of ion generation.",
  },
  {
    key: "reaction-monitoring",
    title: "Real-Time Reaction Monitoring",
    blurb:
      "Watching bonds form: real-time mass spectrometry of catalytic intermediates — from Pd2(dba)3 activation to Buchwald–Hartwig amination.",
  },
  {
    key: "inorganic-pom",
    title: "Inorganic / Polyoxometalate Chemistry",
    blurb:
      "Isomer-selective cluster chemistry and organometallic speciation, including studies of polyoxometalate synthesis.",
  },
  {
    key: "applied",
    title: "Applied Analytical Chemistry",
    blurb:
      "Methods for real matrices: quantification of psilocybin, phenol-selective analysis of jet fuel, and selective thiol detection.",
  },
] as const;

export type PublicationTheme = (typeof PUBLICATION_THEMES)[number]["key"];

export const PUBLICATION_THEME_KEYS: [PublicationTheme, ...PublicationTheme[]] = [
  "fundamentals",
  "reaction-monitoring",
  "inorganic-pom",
  "applied",
];
