---
layout: ../layouts/BaseLayout.astro
title: Contact
description: Get in touch with Dr. Eric Janusson.
---

I welcome inquiries regarding consulting, speaking engagements, research collaborations, or questions about my open-source tools.

Please use the form below and I will respond as promptly as possible.

<form action="https://formspree.io/f/xkolzzpa" method="POST" class="contact-form">
  <p>
    <label for="name">Name</label>
    <input type="text" name="name" id="name" required>
  </p>
  <p>
    <label for="email">Email</label>
    <input type="email" name="_replyto" id="email" required>
  </p>
  <p>
    <label for="subject">Subject</label>
    <input type="text" name="subject" id="subject">
  </p>
  <p>
    <label for="message">Message</label>
    <textarea name="message" id="message" rows="6" required></textarea>
  </p>
  <p>
    <button type="submit" class="btn btn--primary">Send Message</button>
  </p>
</form>

<style>
  .contact-form label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.3em;
    font-size: 0.9rem;
  }

  .contact-form input,
  .contact-form textarea {
    width: 100%;
    padding: 0.6em 0.8em;
    border: 1px solid var(--color-border);
    border-radius: 6px;
    font-family: inherit;
    font-size: 0.95rem;
    margin-bottom: 0.25em;
  }

  .contact-form input:focus,
  .contact-form textarea:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px rgba(137, 180, 250, 0.2);
  }

  .contact-form button {
    cursor: pointer;
    border: none;
    font-family: inherit;
  }
</style>
