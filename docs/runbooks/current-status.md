# Current Status

Last updated: 2026-06-07

## Current phase

PR-012: timeline page.

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

### PR-006

- `data/records.json` manifest added for the list page
- `/apis/` page added
- API list search and filters added

### PR-007

- Five sample API detail pages added
- API list rows now link to detail pages
- CSS updated for detail cards, timeline, and detail sections

### PR-008

- `/deadlines/` page added
- Deadline status grouping added
- Deadline cards added

### PR-009

- `/deprecated/` page added
- `/removed/` page added
- Shared lifecycle list renderer added

### PR-010

- `/replacements/` page added
- Replacement matrix script added

### PR-011

- `/providers/` page added
- Provider index script added
- Five provider detail pages added
- Home navigation updated for provider index

### PR-012

- `data/timeline.json` added
- `/timeline/` page added
- Timeline rendering script added
- Home navigation updated for timeline
- README updated for timeline

## Current sample entities

- Google PaLM API
- Firebase Dynamic Links
- Slack files.upload API method
- Shopify REST Admin API
- Kubernetes v1.22 Removed APIs

## Next planned PRs

- PR-013: seed records batch 1
- PR-014: seed records batch 2
- PR-015: seed records batch 3 / v0 dataset complete

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
