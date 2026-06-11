# Current Status

Last updated: 2026-06-10

## Current phase

PR-018: SEO basics.

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

### PR-013

- Display dataset expanded from 5 to 10 records
- `data/timeline.json` expanded to 10 events
- Added detail pages for AWS SDK for JavaScript v2
- Added detail pages for GitHub password authentication for Git operations
- Added detail pages for Google URL Shortener goo.gl links
- Added detail pages for Azure AD Graph API
- README updated for seed batch 1

### PR-014

- Display dataset expanded from 10 to 15 records
- `data/timeline.json` expanded to 15 events
- Added detail pages for Google Cloud IoT Core
- Added detail pages for Dropbox API v1
- Added detail pages for PayPal NVP/SOAP APIs
- Added detail pages for Meta Graph API older versions
- Added detail pages for Twilio Authy API
- README updated for seed batch 2

### PR-015

- Display dataset expanded from 15 to 20 records
- `data/timeline.json` expanded to 20 events
- Added detail pages for FCM legacy HTTP and XMPP APIs
- Added detail pages for Apple APNs binary provider API
- Added detail pages for Exchange Online Basic authentication
- Added detail pages for Google Container Registry
- Added detail pages for Stripe Sources API
- README updated for v0 seed completion

### PR-016

- v0 release readiness runbook added
- `/release/` page added
- Home page updated for v0 public preview status
- README updated for release readiness

### PR-017

- Heroku free product plans detail page added
- First source/data quality pass runbook added
- README linked to the source/data quality pass
- Current status updated for the quality pass

### PR-018

- `robots.txt` added
- `sitemap.xml` added with core pages and 20 API detail pages
- Canonical metadata added to core public pages
- Open Graph / Twitter summary metadata added to core public pages
- Home page `WebSite` JSON-LD added
- API list now supports `/apis/?q=...` query search URLs
- Provider index no longer links to missing provider detail pages
- README updated for SEO basics

## Current sample entities

- Google PaLM API
- Firebase Dynamic Links
- Slack files.upload API method
- Shopify REST Admin API
- Kubernetes v1.22 Removed APIs
- AWS SDK for JavaScript v2
- GitHub password authentication for Git operations
- Heroku free product plans
- Google URL Shortener goo.gl links
- Azure AD Graph API
- Google Cloud IoT Core
- Dropbox API v1
- PayPal NVP/SOAP APIs
- Meta Graph API older versions
- Twilio Authy API
- FCM legacy HTTP and XMPP APIs
- Apple APNs binary provider API
- Exchange Online Basic authentication
- Google Container Registry
- Stripe Sources API

## Next planned PRs

- PR-019: canonical JSON backfill for all 20 records
- PR-020: detail page consistency pass
- PR-021: provider page coverage pass

## v0 target

v0 minimum target is reached:

- 20 seed records
- API list page
- API detail pages
- Deadlines page
- Deprecated but still usable page
- Removed APIs page
- Replacement matrix
- Provider pages
- Timeline page
- Methodology and report paths
- Static site shell
- Readable mobile layout baseline

## Public-safe note

This repository should contain public project documentation, public methodology, public data schemas, public records, evidence links, validation logic, and correction instructions only.
