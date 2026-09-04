# janusson.github.io

## Table of Contents

- [About](#about)
- [Site Structure](#site-structure)
- [Content & Frontmatter](#content--frontmatter)
- [Development](#development)
- [License](#license)
- [Contact](#contact)

## About the Site

This website is a platform for my technical portfolio.

### Topics

- **Mass Spectrometry**
- **Analytics**
- **Method Development**
- **Chemistry**

## Site Structure

Key routes and their sources:

| Path               | Source                           | Purpose                                                  |
| ------------------ | -------------------------------- | -------------------------------------------------------- |
| `/`                | `src/pages/index.astro`          | Homepage: Selected Work showcase + career timeline       |
| `/about/`          | `src/pages/about.mdx`            | Career narrative with interactive timeline               |
| `/posts/`          | `src/pages/posts.astro`          | Blog index with tag filter and Pagefind full-text search |
| `/blog/[...slug]/` | `src/pages/blog/[...slug].astro` | Individual blog posts                                    |
| `/publications/`   | `src/pages/publications.astro`   | Publications grouped by research theme                   |
| `/projects/`       | `src/pages/projects.astro`       | Project index                                            |
| `/cv/`             | `src/pages/cv.astro`             | Direct CV download (no verification gate)                |
| `/contact/`        | `src/pages/contact.md`           | Contact info                                             |

## Content & Frontmatter

Content lives in `src/content/` as three Astro content collections (schemas defined in `src/content.config.ts`):

| Collection     | Directory                   | Description                                                                                                  |
| -------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `blog`         | `src/content/blog/`         | Long-form technical posts                                                                                    |
| `caseStudies`  | `src/content/case-studies/` | Engineering case studies ("Selected Work"); every entry follows the five-section skeleton in `CaseStudy.mdx` |
| `publications` | `src/content/publications/` | Bibliography entries grouped by research theme                                                               |

### Frontmatter

Pages rendered with `BaseLayout` support the following fields for SEO and social sharing:

| Field         | Required | Description                                                                                                                                                                                                   |
| ------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`       | Yes      | Page title, rendered in `<title>` and as the `og:title` / `twitter:title` value.                                                                                                                              |
| `description` | No       | Meta description and `og:description`. Falls back to a site-wide default.                                                                                                                                     |
| `image`       | No       | Social share image for `og:image` / `twitter:image`. Must be a path relative to the site root (e.g. `/assets/images/my-hero.png`). Falls back to `/assets/images/Spectral-Similarity-Networking-3-Large.png`. |

> **Note:** MDX/Markdown pages forward their frontmatter to `BaseLayout` automatically. Blog post pages (`src/pages/blog/[...slug].astro`) currently forward only `title` and `description`, so a per-post `image` is not yet supported there.

Blog posts (`src/content/blog/*.md(x)`) additionally support:

| Field         | Required | Description                                                         |
| ------------- | -------- | ------------------------------------------------------------------- |
| `date`        | Yes      | Publication date (ISO `YYYY-MM-DD`)                                 |
| `tags`        | No       | Array of tag strings (used for the `/posts/` tag filter and search) |
| `lastUpdated` | No       | Date of the last substantive update (ISO `YYYY-MM-DD`)              |

Case studies support `title`, `date`, `timeframe`, `summary`, `featured`, `template`, `status` (`draft` / `finished`), `technologies`, `instruments`, `repositories`, and `tags`. Publications support `title`, `theme` (`fundamentals` | `reaction-monitoring` | `inorganic-pom` | `applied`), `journal`, `year`, `url`, `featured`, `description`, and `tags`. See `src/content.config.ts` for the full schemas.

## Development

Requires Node.js 24+. All Makefile targets resolve local binaries from `node_modules` (no `npx` network lookups) and depend on an install stamp, so a missing or stale `node_modules` produces a clear install step instead of "command not found" failures.

| Command                       | What it does                                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------------------- |
| `make deps`                   | Install/refresh dependencies (runs only when package files change)                                |
| `make dev`                    | Run the Astro dev server                                                                          |
| `make preview`                | Serve the production build locally                                                                |
| `make check`                  | Fast CI checks: lint (`astro check`) + format (`prettier --check`) + unit tests (`vitest run`)    |
| `make test` / `make test-cov` | Unit tests, optionally with a coverage report                                                     |
| `make build`                  | Production build (Astro + Pagefind search index)                                                  |
| `make audit-facts`            | Cross-check biographical facts across the About page, CV, and career timeline (`audit-facts.mjs`) |
| `make responsive-check`       | Mobile layout audit via headless Chromium (see `scripts/responsive-check.sh` for prerequisites)   |
| `make update-deps`            | Bump dependency versions with npm-check-updates, then reinstall                                   |

The GitHub Actions workflow (`.github/workflows/astro.yml`) runs `make check`, builds the site, and deploys it to GitHub Pages on every push to `main`.

## License

All content in this repository is © Dr. Eric Janusson. Unauthorized use, reproduction, or distribution of the content is prohibited without prior written permission.

## Contact

You can reach me directly at [ericjanusson@outlook.com](mailto:ericjanusson@outlook.com), or via [GitHub](https://github.com/janusson), [LinkedIn](https://www.linkedin.com/in/eric-janusson), or [ORCID](https://orcid.org/0000-0002-3207-7067). See the [Contact page](/contact/) for the full list.
