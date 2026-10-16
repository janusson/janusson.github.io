---
layout: ../layouts/BaseLayout.astro
title: Contact
description: Contact information and consulting inquiry paths for Eric Janusson — analytical chemistry, mass spectrometry, and scientific software.
---

# Contact

I welcome consulting engagements, research collaborations, and inquiries regarding custom mass spectrometry software development or laboratory data automation.

<div class="contact-grid">
  <a class="contact-card" href="https://github.com/janusson" target="_blank" rel="noopener noreferrer">
    <i class="fa-brands fa-github" aria-hidden="true"></i>
    <span class="contact-card-label">GitHub</span>
    <span class="contact-card-value">github.com/janusson</span>
  </a>
  <a class="contact-card" href="https://www.linkedin.com/in/eric-janusson" target="_blank" rel="noopener noreferrer">
    <i class="fa-brands fa-linkedin" aria-hidden="true"></i>
    <span class="contact-card-label">LinkedIn</span>
    <span class="contact-card-value">linkedin.com/in/eric-janusson</span>
  </a>
  <a class="contact-card" href="https://orcid.org/0000-0002-3207-7067" target="_blank" rel="noopener noreferrer">
    <i class="fa-brands fa-orcid" aria-hidden="true"></i>
    <span class="contact-card-label">ORCID</span>
    <span class="contact-card-value">0000-0002-3207-7067</span>
  </a>
</div>

## Consulting & Collaboration Areas

- **Mass Spectrometry Workflows**: Custom MS/MS annotation pipelines, spectral library building, and spectral similarity networking.
- **Scientific Tooling & AI**: MCP server development for mass spectrometry datasets and automated laboratory data interfaces.
- **Regulated Methods**: Advisory and implementation aligned with ISO/IEC 17025 standards.

<style>
  .contact-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 0.9rem;
    margin: 1.5em 0;
  }

  .contact-card {
    display: flex;
    flex-direction: column;
    gap: 0.35em;
    padding: 1.1em 1.2em;
    background: var(--color-card-bg);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    color: var(--color-text);
    text-decoration: none;
    transition:
      transform 0.2s ease,
      border-color 0.2s ease,
      color 0.2s ease;
  }

  .contact-card:hover {
    transform: translateY(-3px);
    border-color: var(--color-accent);
    color: var(--color-link-hover);
    text-decoration: none;
    text-shadow: none;
  }

  .contact-card i {
    color: var(--color-heading);
    font-size: 1.1rem;
  }

  .contact-card-label {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-accent);
  }

  .contact-card-value {
    font-family: var(--font-mono);
    font-size: 0.85rem;
    opacity: 0.9;
  }
</style>
