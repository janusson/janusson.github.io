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


## License

All content in this repository is © Eric Janusson. Unauthorized use, reproduction, or distribution of the content is prohibited.

## Contact

You can reach me directly at [GitHub](https://github.com/janusson).
