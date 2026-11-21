export const PUBLICATION_THEMES = [
  {
    key: "fundamentals",
    title: "Mass Spectrometry Fundamentals",
    blurb: "Electrospray response, solvent effects, and ion-source geometry.",
  },
  {
    key: "reaction-monitoring",
    title: "Real-Time Reaction Monitoring",
    blurb: "Mass spectrometry studies of palladium catalyst activation and catalytic amination.",
  },
  {
    key: "inorganic-pom",
    title: "Inorganic / Polyoxometalate Chemistry",
    blurb: "Polyoxometalate synthesis, inorganic structures, and organometallic speciation.",
  },
  {
    key: "applied",
    title: "Applied Analytical Chemistry",
    blurb: "Methods for selective detection, quantitation, and sample preparation.",
  },
] as const;

export type PublicationTheme = (typeof PUBLICATION_THEMES)[number]["key"];

export const PUBLICATION_THEME_KEYS: [PublicationTheme, ...PublicationTheme[]] = [
  "fundamentals",
  "reaction-monitoring",
  "inorganic-pom",
  "applied",
];
