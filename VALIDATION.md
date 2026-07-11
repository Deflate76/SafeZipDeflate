# Validation report

Validation date: 2026-07-11

## Static structure

- `index.html`, `ko.html`, `en.html`, `404.html`, `.nojekyll` present
- all internal section anchors resolve
- no duplicate HTML IDs
- all local CSS, JavaScript, image, README, license, security and download links resolve
- nine ordered content chapters:
  1. Overview
  2. Why It Matters
  3. Core Concepts
  4. DBA Anatomy
  5. Data Flow
  6. C# Proof of Concept
  7. Detection & Mitigation
  8. FAQ
  9. Sources

## Browser behavior

Tested with headless Chromium at widths 1440, 1121, 1120, 1024, 768, 640, 390 and 320 pixels.

- no horizontal overflow at any tested width
- root font size is 17px on desktop/tablet and 16.5px on small screens
- the smallest visible textual label measured 12.92px on desktop and 12.54px at 390/320px widths
- dark-theme secondary and faint text colors were raised in contrast (`#c2cfe1` and `#94a6bf`)
- no header navigation overlap; the compact mobile header remains within the viewport down to 320 pixels
- integrated hero switches to one column below 1060 pixels
- dark theme is selected for a first-time visitor
- Korean and English switching works
- optional light-theme toggle works
- mobile navigation opens and closes correctly
- DBA calculator initializes and updates without JavaScript errors
- no console or page errors during the tested interactions

## JavaScript and workflow

- `node --check assets/app.js`: passed
- GitHub Pages workflow YAML: parsed successfully
- workflow uses the current release majors included at validation time:
  - `actions/checkout@v7`
  - `actions/configure-pages@v6`
  - `actions/upload-pages-artifact@v5`
  - `actions/deploy-pages@v5`
- hidden static files are included so `.nojekyll` is packaged

## PoC downloads

All three embedded ZIP files passed archive integrity checks:

- `DbaMessageInserter-Adaptive-CSharp.zip`
- `DbaMessageRestorer-Adaptive-CSharp.zip`
- `ControlledDeflateZip-DBA-Adaptive-CSharp.zip`

Their SHA-256 values are recorded in `downloads/SHA256SUMS.txt`.

## Content handling

The opening three chapters follow the information architecture requested from `safe.zipdeflate.com`, while the bilingual prose in this integrated edition was independently rewritten. The original site, RFC 1951, the ZIP specification, zlib documentation and the cited paper are listed in the Sources chapter.
