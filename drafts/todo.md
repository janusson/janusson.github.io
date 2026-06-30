# TODO (Updated 2024-06-27)

Quick hit list of what's left from our sweep:

| # | Item | Action |
|---|---|---|
| 🔴 | 2 missing images in LC Column post | Find `Pasted image 20240628090539.png` and `...92745.png` (they were in your Obsidian vault — check `~/Documents/Obsidian/` or wherever you stored attachments) |
| 🟡 | `QAQC-in-Analytical-Chemistry.png` unused | Drop it into the QC/QA post — it's already in `assets/images/` |
| 🟡 | `Spectral-Similarity-Networking-1.png` unused | Add it to the molecular networking post or leave as is |
| 🟡 | `network_profile.jpg` unused | Probably a site-level image — could become a hero image for the homepage or stay unused |
| 🟢 | About page → Publications link | Add `[See all publications →](/publications/)` near the top of `about.markdown` |
| 🟢 | Homepage → project links | Your `index.markdown` says "Have a look at my recent posts" — could add a line linking to `/projects/` |

___

2026-06-28

The "Script & Spectra" Launch Plan
Configure the Main Navigation: We need to update your Jekyll _data/navigation.yml file so the top menu correctly points to your new /projects/ and /about/ pages.
Update Global Settings (_config.yml): We will do a quick check of your main configuration file to ensure the site title officially reads "Script & Spectra" across all browser tabs.
Link Your CV: We will take that pristine, finalized PDF resume of yours, place it in your site's assets folder, and hook up the download link at the bottom of your "About" page.
The CI/CD Deployment Check: Once everything is committed, we can push it to your repository, let GitHub Actions do its thing, and do a final visual check on the live site to make sure everything renders perfectly.
