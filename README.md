# Dr. Eric Janusson

## Table of Contents

- [About](#about)
- [Topics](#topics)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## About the Site

This website built with Astro is a platform for my technical portfolio, articles, and tutorials.

### Topics

- **Mass Spectrometry**
- **Analytics**
- **Method Development**
- **Chemistry**

## How to Use

- Browse the [home page](https://www.ericjanusson.ca) to find contact info, articles, and other resources.

### Frontmatter

Pages and blog posts can specify the following frontmatter fields for SEO and social sharing:

| Field         | Required | Description                                                                                                                                                                                                   |
| ------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`       | Yes      | Page title (appended with `                                                                                                                                                                                   | Dr. Eric Janusson`in`<title>`) |
| `description` | No       | Meta description and `og:description`. Falls back to a site-wide default.                                                                                                                                     |
| `image`       | No       | Social share image for `og:image` / `twitter:image`. Must be a path relative to the site root (e.g. `/assets/images/my-hero.png`). Falls back to `/assets/images/Spectral-Similarity-Networking-3-Large.png`. |

> **Note:** To use a custom `image` on a blog post, the frontmatter field must also be forwarded through `src/pages/blog/[...slug].astro` to `BaseLayout`.

## License

All content in this repository is © Dr. Eric Janusson. Unauthorized use, reproduction, or distribution of the content is prohibited without prior written permission.

## Contact

You can reach me using the contact form on the [Contact page](/contact/). Please use the form and I will respond as soon as possible.
