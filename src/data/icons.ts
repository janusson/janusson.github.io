/**
 * Inline icon set — replaces the Font Awesome webfont, which shipped ~100 KB
 * of CSS and several font files to render 13 glyphs.
 *
 * Brand marks (GitHub, LinkedIn, ORCID) use the Simple Icons paths (CC0 1.0).
 * Everything else is a hand-drawn 24×24 stroke icon so the visual weight
 * matches the surrounding UI without extra licensing. Icons render at 1em and
 * inherit `currentColor`, so they size and colour with the text around them.
 */
export interface IconDefinition {
  /** Path data in the declaration's viewBox. */
  path: string;
  /** Filled marks need `fill`; line icons are stroked instead. */
  filled?: boolean;
  /** Defaults to 24×24; brand marks keep their native grid. */
  viewBox?: string;
}

const definitions = {
  github: {
    filled: true,
    path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  },
  linkedin: {
    filled: true,
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  orcid: {
    filled: true,
    path: "M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z",
  },
  envelope: {
    path: "M4 5.5h16A1.5 1.5 0 0 1 21.5 7v10a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 17V7A1.5 1.5 0 0 1 4 5.5Z M3 7l9 6 9-6",
  },
  "graduation-cap": {
    path: "M2.5 9.5 12 5l9.5 4.5L12 14 2.5 9.5Z M6.5 11.4v3.3c0 1.7 2.5 3 5.5 3s5.5-1.3 5.5-3v-3.3 M21.5 9.5v5",
  },
  flask: {
    path: "M9.5 3h5 M10.5 3v5.2L5.7 17.2A1.8 1.8 0 0 0 7.3 20h9.4a1.8 1.8 0 0 0 1.6-2.8L13.5 8.2V3 M7.7 13.5h8.6",
  },
  "diagram-project": {
    path: "M9.5 3.5h-5A1 1 0 0 0 3.5 4.5v2a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1Z M19.5 3.5h-5a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1Z M14.5 14.5h-5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1Z M7 7.5v2a2 2 0 0 0 2 2h3 M17 7.5v2a2 2 0 0 1-2 2h-3 M12 11.5v3",
  },
  gears: {
    path: "M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z M12 2.5v3 M12 18.5v3 M2.5 12h3 M18.5 12h3 M4.9 4.9l2.1 2.1 M17 17l2.1 2.1 M19.1 4.9 17 7 M7 17l-2.1 2.1",
  },
  robot: {
    path: "M6.5 8.5h11a2 2 0 0 1 2 2v5.5a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-5.5a2 2 0 0 1 2-2Z M12 8.5V6 M12 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2 M9.5 12.5h.01 M14.5 12.5h.01 M9.5 15.5h5",
  },
  "clipboard-check": {
    path: "M9 4.5H7.5A1.5 1.5 0 0 0 6 6v13a1.5 1.5 0 0 0 1.5 1.5h9A1.5 1.5 0 0 0 18 19V6a1.5 1.5 0 0 0-1.5-1.5H15 M9.5 3h5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5Z M9.5 13l2 2 3.5-4",
  },
  "chart-line": {
    path: "M4 20V4 M4 20h16 M7.5 15.5l3.5-4 3 2.5 4.5-6",
  },
} as const satisfies Record<string, IconDefinition>;

/** Canonical icon names, derived from the definitions above. */
export type IconName = keyof typeof definitions;

/**
 * Widened view of the same data: `definitions` keeps literal types so
 * `IconName` stays a closed union, while consumers index this map and read
 * optional properties without narrowing errors.
 */
export const icons: Record<IconName, IconDefinition> = definitions;
