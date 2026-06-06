# Current Status

Last updated: 2026-06-06

## Current phase

PR-010: replacement matrix.

## Completed so far

### PR-001

- Repository initialized
- Public README drafted
- v0.1 specification added
- Methodology draft added
- Source policy draft added
- Status definitions draft added
- Report corrections guide added
- Disclaimer added
- Current status runbook added

### PR-002

- Entity JSON Schema drafted
- Event JSON Schema drafted
- Evidence JSON Schema drafted
- Provider JSON Schema drafted
- Data schema guide added
- Domain enum guide added
- Schema notes added

### PR-003

- `package.json` scripts added
- `scripts/validate-data.mjs` added
- Data directory placeholders added
- Validation guide added

### PR-004

- Five sample entities added
- Five matching lifecycle events added
- Five official evidence records added
- Provider records added for the sample set

### PR-005

- White-background static shell added
- `index.html` added
- `styles.css` added
- `app.js` added
- README updated for static shell

### PR-006

- `data/records.json` manifest added for the list page
- `/apis/` page added
- API list search and filters added
- Home page links updated to point to the API list
- CSS updated for filters and result count

### PR-007

- Five sample API detail pages added
- API list rows now link to detail pages
- CSS updated for detail cards, timeline, and detail sections
- README updated for detail pages

### PR-008

- `/deadlines/` page added
- Deadline status grouping added
- Deadline cards added
- Home and API list navigation updated
- CSS updated for deadline groups

### PR-009

- `/deprecated/` page added
- `/removed/` page added
- Shared lifecycle list renderer added
- Home and API list navigation updated
- README updated for deprecated / removed pages

### PR-010

- `/replacements/` page added
- Replacement matrix script added
- Home and API list navigation updated
- README updated for replacement matrix

## Current sample entities

- Google PaLM API
- Firebase Dynamic Links
- Slack files.upload API method
- Shopify REST Admin API
- Kubernetes v1.22 Removed APIs

## Next planned PRs

- PR-011: provider index and provider pages
- PR-012: timeline page
- PR-013: seed records batch 1

## v0 target

v0 should include:

- 20 high-confidence seed records
- API list page
- API detail pages
- Upcoming deadlines page
- Deprecated but still usable page
- Removed APIs page
- Replacement matrix
- Provider pages
- Timeline page
- Methodology and report paths
- Static build
- readable mobile layout

## Public-safe note

This repository should contain public project documentation, public methodology, public data schemas, public records, evidence links, validation logic, and correction instructions only.
