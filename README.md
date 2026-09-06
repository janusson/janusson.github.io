# janusson.github.io

## Table of Contents

- [About](#about)
- [Site Structure](#site-structure)
- [License](#license)
- [Contact](#contact)

## About

This website is a platform for my technical portfolio.

## Site Structure

Key routes and their sources:

| Path               | Source                           | Purpose                                                                  |
| ------------------ | -------------------------------- | ------------------------------------------------------------------------ |
| `/`                | `src/pages/index.astro`          | Homepage: thesis-first hero over an animated spectral-network background |
| `/about/`          | `src/pages/about.mdx`            | About page (currently a bare heading — narrative removed September 2026) |
| `/posts/`          | `src/pages/posts.astro`          | Blog index with tag filter and Pagefind full-text search                 |
| `/blog/[...slug]/` | `src/pages/blog/[...slug].astro` | Individual blog posts                                                    |
| `/publications/`   | `src/pages/publications.astro`   | Publications grouped by research theme                                   |
| `/projects/`       | `src/pages/projects.astro`       | Project index — MassFlow, MSMCP, and PySharpe cards                      |
| `/contact/`        | `src/pages/contact.md`           | Contact info                                                             |

> **September 2026 cleanup:** the career timeline (`CareerTimeline.tsx`),
> case-study entries, blog posts, and the CV page were removed. Routes
> above remain live; the `blog` collection and `case-studies` collection
> are currently empty and reserved for future content.

## License

All content in this repository is © Eric Janusson. Unauthorized use, reproduction, or distribution of the content is prohibited.

## Contact

You can reach me directly at [GitHub](https://github.com/janusson).
