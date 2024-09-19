---
layout: post
date: 2024-07-03
title: An Introduction to Molecular Networking
tags:
  - articles
  - science
  - chemistry
  - massspectrometry
  - molecularnetworking
  - spectralsimilarity
  - programming
description: An article introducing Molecular Networking and Spectral Similarity Networks
status: finished
published: 2024-07-07
notes: Spectral similarity networking (aka Molecular Networking, MN) is the organization and visualization of tandem MS data into clusters of compounds with similar fragmentation patterns.Structurally related compounds share similar features (number of peaks, peak height, mass shifts) in their fragmentation patterns. These features can be compared between all fragmentation patterns in a sample or database. Similar spectra are grouped through network analysis.Grouping fragmentation patterns together using molecular networking techniques assists in the discovery of unknown compounds, subgroup characterization, and thorough sample characterization.The network groups compounds (nodes of the network) according to the degree of spectral similarity as a network in a knowledge graph format, thus allowing visual exploration of identical/analogous molecules and accelerating the identification of subgroups or characteristics of a given group of molecules.  Chemical annotation via molecular networking arises from the combination of direct spectral correspondence between MS/MS spectra and compound libraries (MS/MS data).Closely related compounds are discovered through networking and mass shifts. A mass difference of 15 Da between nodes with a high degree of similarity may suggest a CH3 group for the same class of compound.
---
> ![[Spectral Similarity Networking 3 Large.png]]
> A molecular network with several "hubs" of structurally related compounds.

Molecular Networking (MN), also known as Spectral Similarity Networking, is a transformative approach to the analysis of tandem mass spectrometry (MS/MS) data. This innovative method organizes and visualizes complex MS data into clusters of compounds that share similar fragmentation patterns, which are indicative of their chemical structures.

At its core, MN leverages the principle that structurally related compounds will share common features in their fragmentation patterns, such as the number of peaks, peak heights, and specific mass shifts. By comparing these features among all fragmentation patterns present in a sample or database (or spectral library), MN facilitates the grouping of similar spectra through sophisticated network analysis.

The practical applications of molecular networking are vast and impactful. By grouping fragmentation patterns, MN aids in the discovery of previously unknown compounds, enabling researchers to characterize subgroups present in samples and conduct thorough sample characterizations. This is particularly valuable in fields such as pharmacology, environmental analysis, and biochemical research, where understanding the composition of samples is important.

## Molecular network visualization

One of the most compelling aspects of MN is the formation of a network that groups compounds according to their spectral similarity. This network is often represented in a knowledge graph format, providing a visual means to explore the relationships between identical or analogous molecules. Such visualization not only accelerates the identification of molecule subgroups but also enhances the understanding of the characteristics that define a particular group of compounds.

> ![[Spectral Similarity Networking 2.png]]
> Example of a small hub of related compounds in a molecular network.

In the network, nodes represent individual compounds, and edges connect similar compounds. By examining clusters of nodes, researchers can identify subgroups of structurally related molecules. For example, if two nodes share a high degree of spectral similarity, they likely belong to the same chemical class or family.

Visualizing the network allows us to explore the characteristics that define specific groups of compounds. Are they linked by common functional groups, mass shifts, or other features? Researchers can analyse the connectivity patterns in the network. Nodes with many connections (referred to as hubs) may represent essential compounds, while isolated nodes could be unique or rare molecules.

### Using Cytoscape to explore molecular networks

Cytoscape is a powerful open-source software tool widely used for visualizing and analysing networks, including molecular networks. It provides various layout algorithms to arrange nodes and edges in visually informative ways.

Researchers can choose from force-directed layouts, hierarchical layouts, circular layouts, and more. Users can customize node colours, sizes, and labels, making it easier to highlight specific compounds or groups. Cytoscape allows interactive exploration of the network. Researchers can zoom in, pan, and select nodes in their data to view detailed information. This kind of interaction yields information about connectivity patterns and compound relationships.

Data integration is another advantage. Researchers can directly import MN data into Cytoscape, streamlining analysis and visualization. MN results become dynamic visual representations which empowers researchers to uncover hidden connections and novel compounds.

## Chemical annotation and molecular networking

Chemical annotation via molecular networking arises from the combination of direct correspondence between experimentally derived MS/MS spectra to existing compound libraries, and manual annotation of unknown species for which there is little or no library information.

Compound libraries are repositories about known compounds and their characteristic fragmentation patterns. As new species are discovered, can be updated and customized as new species are discovered. Chemical annotation — a topic I will cover in a separate article — is achieved with software tools like NIST MS Search, AMDIS, and Python libraries like `matchms`. Programmatic alignment of tandem-MS spectra to known compounds allows for the rapid annotation of compounds, streamlining the process of identifying and characterizing chemical entities in a sample.

>![[NIST MS Search Name Search 35dimethylphenol.png]]
> NIST MS Search library entry for 3,5-dimethylphenol showing a characteristic MS/MS fragmentation pattern.

MN excels at identifying previously unknown compounds. When a spectral match occurs, researchers gain useful knowledge about the presence of related molecules. Researchers can then infer functional groups, structural motifs, and even biological activities among related compounds. In complex samples (such as environmental extracts or biological matrices), MN streamlines the process by narrowing down the list of relevant compounds.

An appealing feature of MN is the discovery of closely related compounds through the analysis of mass shifts between network nodes. For example, a mass difference of 15 Da between nodes that share high spectral similarity might simply indicate the presence of an additional methyl group (-CH3) in the same class of compounds for which there is no library match. These kinds of clues are invaluable for chemists and researchers working to elucidate complex mixtures.

### Community annotations and reproducibility

Molecular networking and chemical annotation thrives on collective efforts. Researchers can actively contribute annotations to public databases, enriching the accuracy and breadth of compound identifications. By sharing their results, researchers ensure reproducibility through collaborative research.

[Global Natural Products Social](https://gnps.ucsd.edu/ProteoSAFe/static/gnps-splash.jsp) (GNPS) is a widely recognized and popular MN community. GNPS serves as a web-based mass spectrometry ecosystem, aiming to be an open-access knowledge base for the organization, sharing, and analysis of raw, processed, or identified tandem mass spectrometry (MS/MS) data. Researchers using GNPS actively contribute annotations to public databases, improving the accuracy and coverage of compound identifications. Each annotation in this ecosystem contributes to a more thorough understanding of chemical diversity.

## Challenges and future directions of molecular networking

Molecular networking represents a significant leap forward in the field of mass spectrometry, offering a powerful tool for the scientific community. Its ability to uncover hidden layers of chemical data advances our understanding of complex samples. While the dynamic field of MN presents interesting opportunities, it also faces several obstacles moving forward.

First of all, molecular networking deals with vast and complex datasets. As the scale of experiments grows, managing, processing, and interpreting these data become increasingly challenging. Researchers must address issues related to data storage, computational resources, and efficient algorithms for spectral matching and network construction. Leveraging machine learning and artificial intelligence techniques can enhance spectral matching, compound annotation, and network analysis. Therefore, future directions will likely involve developing robust ML models for predicting fragmentation patterns to improve annotation accuracy.

While existing compound libraries are valuable, they are not exhaustive. Many natural products and novel compounds remain uncharacterized. Future directions involve expanding and curating standardized spectral libraries to include diverse chemical classes, rare molecules, and underrepresented species.

Lastly, MN is aimed at providing qualitative information by identifying compounds and their relationships. A focus on incorporating more quantitative aspects (concentration estimates) could enhance its utility beyond characterization.

As the technology and methodologies behind mass spectrometry and molecular networking continue to evolve, we can expect to see even more sophisticated applications. The future of chemical analysis via mass spectrometry is incredibly exciting, and molecular networking will undoubtedly play a role in shaping that future.

## References and further reading

1. [Reproducible molecular networking of untargeted mass spectrometry data using GNPS - Nature Protocols](https://www.nature.com/articles/s41596-020-0317-5?fromPaywallRec=false)
2. [Sharing and community curation of mass spectrometry data with Global Natural Products Social Molecular Networking - Nature Biotechnology](https://www.nature.com/articles/nbt.3597)
3. [GNPS Dashboard: collaborative exploration of mass spectrometry data in the web browser - Nature Methods](https://www.nature.com/articles/s41592-021-01339-5)
4. [SIRIUS 4: a rapid tool for turning tandem mass spectra into metabolite structure information - Nature Methods](https://www.nature.com/articles/s41592-019-0344-8)
5. [GNPS - Analyze, Connect, and Network with your Mass Spectrometry Data (ucsd.edu)](https://gnps.ucsd.edu/ProteoSAFe/static/gnps-splash.jsp)
6. [MS/MS-Based Molecular Networking: An Efficient Approach for Natural Products Dereplication (mdpi.com)](https://www.mdpi.com/1420-3049/28/1/157)
7. [Spec2Vec: Improved mass spectral similarity scoring through learning of structural relationships - PMC (nih.gov)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7909622/)
8. [Mass Spectral Similarity Networking and Gas-Phase Fragmentation Reactions in the Structural Analysis of Flavonoid Glycoconjugates - Analytical Chemistry (acs.org)](https://pubs.acs.org/doi/10.1021/acs.analchem.8b05479)
9. [Annotation of natural product compound families using molecular networking topology and structural similarity fingerprinting - Nature Communications](https://www.nature.com/articles/s41467-022-35734-z)
10. [Cytoscape: An Open Source Platform for Complex Network Analysis and Visualization](https://cytoscape.org/)
11. [Cytoscape 3.10.2 User Manual — Cytoscape User Manual 3.10.2 documentation](https://manual.cytoscape.org/en/3.10.2/index.html)
12. [Basic Data Visualization (cytoscape.org)](https://cytoscape.org/cytoscape-tutorials/protocols/basic-data-visualization/#/)
13. [MassIVE (Mass Spectrometry Interactive Virtual Environment)](https://massive.ucsd.edu/ProteoSAFe/static/massive.jsp)
14. [MetaboAnalyst](https://www.metaboanalyst.ca/)
15. [NIST MS Search (nist.gov)](https://chemdata.nist.gov/dokuwiki/doku.php?id=chemdata:ms-search)
