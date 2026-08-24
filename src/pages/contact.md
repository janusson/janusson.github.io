---
layout: ../layouts/BaseLayout.astro
title: Contact
description: Get in touch with Eric Janusson — email, GitHub, LinkedIn, or ORCID.
---

# Contact

I welcome consulting, speaking engagements, research collaborations, and questions about my
open-source tools. The simplest ways to reach me:

<div class="contact-grid">
  <a class="contact-card" href="mailto:ericjanusson@outlook.com">
    <i class="fa-solid fa-envelope" aria-hidden="true"></i>
    <span class="contact-card-label">Email</span>
    <span class="contact-card-value">ericjanusson@outlook.com</span>
  </a>
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

<p class="contact-note">
  Prefer a document? <a href="/cv/">View my CV (PDF)</a>.
</p>

<style>
  .contact-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
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

  .contact-note {
    margin-top: 1.5em;
    color: var(--color-sidebar-muted);
    font-size: 0.9rem;
  }
</style>
