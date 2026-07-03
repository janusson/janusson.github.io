---
layout: ../layouts/BaseLayout.astro
title: About Me
description: Computational analytical chemist and scientific software developer bridging complex instrumentation and scalable data pipelines.
---

[Download CV (PDF)](/assets/files/CV-Dr-Eric-Janusson-2026.pdf){: .btn .btn--primary .btn--large}

## From the Bench to the Terminal

I am a **Computational Analytical Chemist** specializing in mass spectrometry and custom data architecture. After spending over a decade working directly with complex instrumentation—from fundamental ion-source physics to regulated industrial validation—I recognized a persistent bottleneck: proprietary, vendor-locked software that throttles discovery. Today, I build reproducible, open-source Python pipelines designed to decouple high-dimensional spectral analysis from instrument constraints.

My background is rooted in both academic rigor and industrial execution, allowing me to speak the language of both the laboratory and the engineering team.

## Research Trajectory

```mermaid
graph TD
    %% Styling Classes
    classDef academic fill:#f0f4f8,stroke:#0369a1,stroke-width:2px,color:#0f172a;
    classDef industry fill:#fdf4ff,stroke:#a21caf,stroke-width:2px,color:#0f172a;
    classDef software fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#0f172a;

    %% Nodes
    A["<b>University of Victoria (2012-2017)</b><br/>ESI Ionisation Physics & Reaction Monitoring"]:::academic
    B["<b>University of Glasgow (2017-2020)</b><br/>POM Self-Assembly, Ion Mobility & HRMS"]:::academic
    C["<b>Delic Labs (2021-2022)</b><br/>LC-MS Metabolomics & Facility Commissioning"]:::industry
    D["<b>TMC Manufacturing (2024-2026)</b><br/>Rare Earth ICP-MS & Industrial Validation"]:::industry
    E["<b>MassFlow Toolkit</b><br/>Open-Source Spectral Annotation"]:::software
    F["<b>Independent Consulting (2026-Present)</b><br/>Data Pipelines & Scientific Computing"]:::software

    %% Core Timeline Flow
    A --&gt;|Hyphenated Analytics| B
    B --&gt;|Automated Python Analytics| C
    C --&gt;|ISO/QA Architecture| D
    D --&gt;|Multidimensional Data| F

    %% Thematic Intersections
    B -.-&gt;|Conformational Control Data| E
    C -.-&gt;|Molecular Networking| E
    E ==&gt; F
```

## Professional & Academic Journey

*   **Independent Scientific Consultant & Software Developer (2026 – Present):** Providing specialized technical advisement and building custom data-engineering pipelines for analytical environments.
*   **TMC Manufacturing (2024 – 2026):** Served as Acting Technical Lead for industrial-scale rare-earth stable isotope production. I managed high-purity ICP-MS operations and directed major capital procurement for a newly commissioned facility.
*   **Delic Labs (2021 – 2022):** Commissioned a federally authorized (Health Canada Section 56) analytical facility from the ground up. I developed validated LC-MS/MS methodologies, including a rapid quantification method for psilocybin, and engineered Python processing pipelines for untargeted metabolomics.
*   **University of Glasgow / Cronin Group (2017 – 2020):** As a Postdoctoral Scholar, I utilized ion mobility (TWIMS) and Orbitrap HRMS to exert conformational control over self-assembling polyoxometalate nanomaterials. This involved architecting automated Python analytics to process orthogonal, high-dimensional datasets.
*   **University of Victoria (2012 – 2017):** Earned my PhD in Analytical Chemistry, mapping the fundamentals of electrospray ionization (ESI) and real-time reaction monitoring for organometallic catalysis.

## Core Competencies

*   **Mass Spectrometry Landscape:** Deep operational expertise across ESI-MS, ICP-MS, QTOF, Orbitrap, TWIMS, and Triple-Quadrupole (QqQ) platforms.
*   **Scientific Computing:** Extensive use of Python (pandas, polars, matchms, pyteomics) for large-scale multidimensional dataset management, statistical modeling, and automated databasing.
*   **Regulatory & Quality Frameworks:** Design and implementation of ISO/IEC 17025 QA/QC architecture and experience maintaining Health Canada Section 56 controlled-substance licensing.

## Software Architecture & Open-Source

*   **[MassFlow](https://github.com/janusson/massflow):** A config-first toolkit for the reproducible identification of unknown analytes in MS/MS spectral data, local spectral-library construction, and molecular networking.
*   **[PySharpe](https://github.com/janusson/pysharpe):** A modular library for quantitative finance, focusing on portfolio optimization, risk-adjusted performance metrics, and uncertainty analysis.
