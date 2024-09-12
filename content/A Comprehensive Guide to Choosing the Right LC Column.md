---
Date: 2024-06-29
title: A Comprehensive Guide to Choosing the Right LC Column
tags:
  - articles
  - chromatography
  - analyticalchemistry
  - analyticalmethod
  - chemistry
  - chemicalanalysis
  - UPLC
  - LC
  - HPLC
  - column
  - chemistryresearch
  - liquidchromatography
  - LCcolumns
  - labtools
  - science
  - scienceguide
  - chemistrytips
description: A description of the article.
status: finished
published: 2024-06-30
notes:
---
# A Comprehensive Guide to Choosing the Right LC Column

![[Choosing an LC Column Flowchart.canvas|Choosing an LC Column Flowchart]]

[[Choosing an LC Column Flowchart.canvas|Choosing an LC Column Flowchart]]

![[Choosing an LC Column Flowchart 3.png]]
> Flowchart for Choosing an LC Column (Adapted from https://www.agilent.com/cs/library/selectionguide/Public/5991-0165EN.pdf)

Liquid chromatography (LC) is an essential technique in analytical chemistry, widely used for separating mixtures of compounds in the process of identifying, quantifying, and purifying the individual components of a mixture. The heart of this technique lies in the LC column, a sophisticated piece of equipment where the actual separation occurs.

Selecting the right LC column is important for achieving optimal separation and accurate results. However, the vast array of choice available can make choosing the "right" column for your application seem daunting. This guide aims to demystify the process and provide a detailed overview of the factors to consider when choosing an LC column for your analytical needs.

Choosing the right LC column involves a thorough understanding of the types of columns available, the stationary phase that best suits your analytes, the appropriate chromatographic mode, and the log P values of your compounds. By considering these factors, you can ensure that your LC analysis is both efficient and effective, leading to reliable and reproducible results.  

**While this may seem overwhelming at first glance, don’t worry!** This guide is designed to break down these concepts into manageable steps. We’ll walk through each factor in detail, providing clear explanations and practical tips along the way. This guide will also point you towards valuable resources for further reading with practical tips.

Remember, the right column not only improves your separation but also improves the overall robustness of your analytical methods.

## Assessing Your Analytical Requirements

The first step in column selection is a thorough assessment of your analytical needs. This involves understanding the nature of your samples and target compounds. Are you dealing with polar or non-polar compounds? What is the expected pH range of your samples? These initial considerations will influence the type of column you choose, as different columns have varying affinities and tolerances for different chemical properties.

![[Pasted image 20240628090539.png]]
> Selection of stationary phase by compound class with primary and secondary column choices.
> Source: https://www.europeanpharmaceuticalreview.com/wp-content/uploads/40190-HPLC_guide_ipdf_MRK_SP_WEB__1_.pdf

The polarity and pH range of the analytes in your sample are important considerations in column selection due to their impact on the interaction between your analytes and the stationary phase of the column. Polarity is a measure of how evenly electrons are shared in a molecule — polar compounds have a high affinity for polar stationary phases and will therefore spend more time interacting with the column, leading to longer retention times. Conversely, non-polar compounds interact less with polar stationary phases, resulting in shorter retention times.

The pH range of your samples can affect the ionization state of your analytes, which in turn influences their interaction with the stationary phase. For instance, at a certain pH, some compounds might be ionized and others might be neutral. This can significantly affect the separation efficiency, as ionized and neutral species may have different affinities for the stationary phase. Therefore, understanding the pH range of your samples can help you select a column that will provide optimal separation for your specific analytes.

## Leveraging log P Values for Column Selection

The log P value, also known as the water-octanol logarithmic partition coefficient, is an indication of a compound’s hydrophobicity or polarity. Knowledge of your analytes (approximate) log P values serve as a valuable guide in the selection of an appropriate column and chromatographic mode:

- **High log P Values (hydrophobic)**: High log P values suggest a high degree of hydrophobicity. In such cases, reversed-phase columns like C18, which have non-polar stationary phases, are typically suitable. These columns retain hydrophobic compounds longer, allowing for better separation.
- **Low or negative log P Values (hydrophilic)**: Indicates a higher degree of polarity. For such compounds, HILIC (Hydrophobic Interaction Liquid  Chromatography) or normal-phase columns, which have polar stationary phases, might be more suitable. These columns separate polar compounds because of their affinity for the polar stationary phase.

![[Pasted image 20240628092745.png]]
> Selection of chromatographic mode and stationary phase using log P values.
> Source: https://www.europeanpharmaceuticalreview.com/wp-content/uploads/40190-HPLC_guide_ipdf_MRK_SP_WEB__1_.pdf

## Understanding Chromatographic Modes

Different chromatographic modes offer various mechanisms of separation, each suited to specific types of analytes:

- **Reversed-Phase (RP) Chromatography**: The most common mode, where the stationary phase is more non-polar than the mobile phase, and separation is based on hydrophobic interactions. An octadecyl silica (C18) column is a great starting point because of its ability to efficiently separate many types of organic compounds.

- **Normal-Phase (NP) Chromatography**: In direct contrast to RP chromatography, the stationary phase in NP chromatography is polar. The separation is based on polar interactions between the stationary phase and the analytes. This mode is particularly useful for separating compounds that have polar functional groups.

- **Hydrophobic Interaction Chromatography (HILIC)**: HILIC is a variant of normal-phase chromatography that is particularly effective for the separation of polar and hydrophilic compounds. In HILIC, a polar stationary phase and a relatively non-polar mobile phase are used. The analytes are separated based on their affinity for water.

- **Ion-Exchange Chromatography**: This mode is used for separating charged analytes based on their interaction with oppositely charged groups on the stationary phase. It is particularly useful for the separation of ions and polar molecules.

The choice of chromatographic mode depends on the chemical nature of the analytes and the type of separation required. Keep these modes at the front of your mind so you can select a column that will provide the most effective separation.

## Stationary Phase Selection

Once you have an idea of an appropriate mode of separation, the next step is selecting a stationary phase. The stationary phase in an LC column is the core of the separation process. It interacts directly with the analytes and influences how they separate from each other. Multiple stationary phases are available within one type of separation mode. For example, C8 and C18 are reversed-phase stationary phases whereas Cyano and Amino stationary phases are common in HILIC mode. When choosing a stationary phase, consider the following properties of your analytes:

- **Hydrophobicity**: Compounds that are more hydrophobic tend to interact strongly with hydrophobic stationary phases. For such compounds, a C18 column, which has a highly hydrophobic stationary phase, may be a good choice.

- **Polarity**: Polar analytes often interact better with polar stationary phases. For these analytes, Hydrophilic Interaction Liquid Chromatography (HILIC) columns, which have a polar stationary phase, might be more suitable.

- **Molecular Weight**: The size of the molecules in your sample can also influence the choice of stationary phase. Larger molecules may require columns with larger pore sizes to facilitate better interaction and separation.

In addition to these considerations, there are other types of stationary phase base materials that can be used for specific applications. These include Carbon particles (Fully porous graphitic carbon or PGC), Zirconia, and Alumina particle stationary phases. These materials are particularly suitable for applications that require extreme pH and temperature stability.

## Applications of Specific Stationary Phases

The various types of LC columns are designed for specific separation requirements. Here's a closer look at some of the most common types and their applications:

- **C18 Columns**: Often the first choice for reversed-phase chromatography, C18 columns offer excellent retention for non-polar compounds. They are widely used in pharmaceutical industries for drug analysis, food industries for detecting additives, and environmental analysis for identifying pollutants.

- **C8 Columns**: These columns are similar to C18 but feature shorter alkyl chains. This results in less retention, making them useful for separating moderately polar compounds. They are often used when C18 columns provide too much retention.

- **Phenyl Columns**: These columns offer unique selectivity for aromatic compounds due to the π-π interactions. They are particularly useful in the separation of structurally similar aromatic compounds and are often employed in pharmaceutical and environmental analyses.

- **HILIC (Hydrophilic Interaction Liquid Chromatography) Columns**: These columns are ideal for polar compounds that do not retain well on reversed-phase columns. For this reason, they are an excellent complement to a standard C18 column. They are commonly used in the analysis of polar metabolites, sugars, and polar pharmaceuticals.

Each column type has its typical applications, ranging from pharmaceuticals to environmental analysis, and the choice largely depends on the nature of the analytes.

## Expanding Your Arsenal: Size Exclusion, Biphenyl, HIC, Chiral, and Affinity Columns

The diversity of column types extends beyond the common C18 and C8 RP columns to enable successful separation of complex mixtures. While size exclusion and biphenyl columns cater to specific separation needs, chiral, hydrophobic interaction (HIC), and affinity columns further expand your toolkit, offering unique selectivity and separation mechanisms for a variety of analytical challenges.

### Size Exclusion: When Size Matters

Size exclusion chromatography (SEC), also known as gel filtration, separates analytes based on molecular size rather than chemical interactions. This gentle method of separation avoids binding molecules to the resin and preserves the integrity of delicate analytes. SEC is ideal for separating proteins, peptides, and other macromolecules. As well, SEC can be used for desalting and buffer exchange.

SEC employs a porous matrix within the column. Smaller molecules enter and exit the beads, delaying their elution, while larger molecules, excluded from the pores, elute first. This size-based separation is frequently used for analysing protein aggregates, which can impact the efficacy and safety of therapeutic proteins.

### Biphenyl Columns: Enhanced Selectivity for Aromatic Compounds

Biphenyl columns offer unique selectivity for aromatic and moderately polar analytes, providing an alternative to traditional C18 columns when resolving complex mixtures. The biphenyl stationary phase promotes π-π interactions, which can be particularly beneficial for separating isomeric compounds, controlled substances, and steroids.

These columns are known for their ability to improve peak resolution and reduce run times, making them a valuable tool for high-throughput laboratories. The biphenyl chemistry provides an orthogonal selectivity to C18, which can be advantageous in method development and when troubleshooting difficult separations.

### Hydrophobic Interaction Columns (HIC): Probing Hydrophobicity

HIC columns separate biomolecules such as proteins based on variations in surface hydrophobicity. They employ a hydrophobic stationary phase and a high-salt mobile phase to promote the reversible adsorption of proteins. By gradually decreasing the salt concentration, proteins elute in order of increasing hydrophobicity. HIC is particularly useful for separating or purifying proteins under non-denaturing conditions, preserving their biological activity and structure.

### Chiral Columns: Mirror Image Selectivity

Chiral columns are a unique type of column used for the separation of enantiomers. The mechanism of separation on chiral columns is based on the formation of transient diastereomeric complexes between the analytes and the stationary phase. The chiral recognition process depends on various interactions such as hydrogen bonding, π-π interaction, dipole stacking, inclusion complexation, steric, hydrophobic and electrostatic interaction, among others.

Chiral columns are widely used in pharmaceutical industries, where the separation of enantiomers is often required due to differences in biological activity. They are also used in environmental analysis, food analysis, and other fields where chiral compounds are present.

### Affinity Columns: Exploiting Specific Interactions

Affinity columns utilize the specific binding interactions between a ligand immobilized on the stationary phase and the target molecule in the sample. The high selectivity of this method is commonly used for the purification of antibodies, recombinant proteins, and other biologically active molecules. Because this can achieve high levels of purification in one step, it is an invaluable tool in both research and industrial applications.

Incorporating these specialized columns into your toolkit paves the way for a customized solution to separation challenges. Particularly in research, having more options available is incredibly beneficial.

## Technical Details: Column Materials and Dimensions

Now that you have a good idea of the types of columns available, it's important to consider some final technical details before making a purchase. This includes the material that the column is made of, the dimensions of the column, as well as particle and pore size. Each of these details are important since they play a significant role in the column's performance and suitability for your application.

### Column Materials

LC columns are made with various compositions of stationary phase within the column. Each material has its own set of characteristics:

- **Fully Porous Silica Particles (FPP):** These are traditional LC column packing materials where both the surface and interior of the particles are porous. They are available in a variety of bonded phases, such as C18 and C8, which refer to the type of chemical groups attached to the silica surface, and in different particle sizes to suit various separation needs.

- **Fused-Core (Superficially Porous Silica Particles, SPP):** Also known as core-shell particles, these have a solid core and a porous outer layer. They offer the advantage of faster mass transfer compared to fully porous particles, leading to higher efficiency and faster analysis times. These columns are ideal for use in UPLC systems.

- **Monolithic Silica:** These columns contain a single piece of porous material, rather than individual particles. These columns are characterized by their low backpressure and high flow rates, which can be advantageous in high-throughput settings.

- **Type A Silica:** Known for its excellent matrix tolerance and extended lifetime, Type A silica is a reliable choice for many chromatographers.

### Column Dimensions

The dimensions of an LC column – specifically, its length, internal diameter (ID), pore and particle size – significantly influence the separation efficiency, resolution, and analysis time.

- **Column Length:** The length of the column plays a majour role in determining the resolution of your separation. Longer columns provide higher resolution due to increased interaction between the analytes and the stationary phase. However, this comes at the cost of longer analysis times and higher backpressure. Conversely, shorter columns offer faster analysis times but may compromise resolution.

- **Internal Diameter (ID):** The ID of the column can impact the sensitivity and speed of the analysis. Smaller ID columns are often used for methods that require high sensitivity, as they provide better detection limits. However, they also require smaller sample volumes and may not be suitable for all types of analyses.

- **Particle Size:** The size of the particles in the stationary phase can greatly affect both the efficiency and the backpressure of the column. Smaller particles provide higher efficiency and resolution due to increased surface area for interactions, but generate more backpressure. Larger particles reduce backpressure but may compromise efficiency and resolution.
	- **Smaller particles (around 2 μm):** Small particles provide higher efficiency but may require UPLC systems capable of handling higher backpressure.
	- **Larger particles (5 μm or larger):** These are more robust and suitable for routine analyses where extreme efficiency and resolution is not required.

- **Pore Size:** The pore size refers to the average size of the pores in the stationary phase of the column. This determines whether a molecule can diffuse into and out of the packing material which affects the selectivity of the column for certain analytes. In general, the pore size should be at least 10 times larger than the molecular diameter of your analytes.
	- **Smaller pores (e.g., <130 Å):** These are ideal for small molecules, as they provide a greater surface area for interaction.
	- **Larger pores (e.g., >150 Å):** These accommodate larger analytes and can be key for the separation of biomolecules.

## Conclusion

Choosing the right LC column is a nuanced process that requires a thorough understanding of your analytical requirements and the characteristics of the available columns. This decision isn't just about selecting a column, but about tailoring your choice to the specific needs of your samples, throughput, and the separation required.

From the nature of your sample to the specific separation requirements, every detail matters in chromatography. The particle and pore size, column length and diameter, and the type of stationary phase - each of these factors are determining for the efficiency, accuracy, and reliability of your results.

By carefully considering these elements, you can navigate the vast array of LC columns available and select the one that is most suited to your needs. In doing so, you ensure that your LC analysis is not just good, but optimal, leading to results that are not just accurate, but reliable and reproducible.

Remember that choosing an LC column will involve some trial-and-error. Start with the workhorse RP-C18 column and be sure to check literature sources for similar separations or give your vendor a call and ask for some options.

## References and Resources

For further reading and more detailed information, the following resources and references used in creating this article might be helpful:

1. Agilent HPLC Column Selection Guide - Solutions for Small Molecule Separations: This guide contains solutions for choosing a column for various techniques like HPLC/UPLC, preparative HPLC, flash chromatography, and more. Link: https://www.agilent.com/cs/library/selectionguide/Public/5991-0165EN.pdf
2. Merck HPLC and UHPLC Column Selection Guide: This comprehensive resource details the column selection process by stationary phase, analyte compound class, log P values, and much more. Link: https://www.europeanpharmaceuticalreview.com/wp-content/uploads/40190-HPLC_guide_ipdf_MRK_SP_WEB__1_.pdf
3. Millipore Sigma HPLC Column Selection Guide for Small Molecule Separation: This one-pager provides good detail on the separation modes and stationary phases to use depending on your analyte for LCMS and HPLC applications. Link: https://www.sigmaaldrich.com/deepweb/assets/sigmaaldrich/product/documents/131/895/hplc-column-wallchart-ps5909en-ms.pdf
4. Agilent HPLC & LC Column Selector Tool: This tool from Agilent provides solutions for choosing a column by USP designation or agency methods from the EPA and ASTM. Link: https://www.agilent.com/search/gn/lc-column-selector?utm_source=bing&utm_medium=cpc&utm_campaign=B_PS_NBr_LC%20Columns_AFO_E_P&utm_term=lc%20column%20selector&utm_content=LC%20Columns_General_LC%20Columns_Columns%20Selector_P
6.  Thermo Fisher Scientific - LC Column Guide: This guide will take you directly to the right product for you, so that you can start developing your method right away. Link: https://www.thermofisher.com/order/lc-column-guide/#!/
7. Agilent - The LC Handbook - Guide to LC Columns and Method Development: This handbook provides practical advice, tutorials, and peer-reviewed research on liquid chromatography (HPLC), gas chromatography (GC), mass spectrometry (MS) and related techniques. Link: https://www.agilent.com/cs/library/primers/Public/LC-Handbook-Complete-2.pdf