# v0 Release Readiness

Last updated: 2026-06-08

## Status

API Deprecation Archive has reached the v0 minimum display dataset target of 20 seed records.

This document is a public-safe release readiness checklist. It summarizes what is present, what should be checked before calling the site v0, and what remains for later quality passes.

## Current public pages

- `/`
- `/apis/`
- `/apis/[slug]/`
- `/deadlines/`
- `/deprecated/`
- `/removed/`
- `/replacements/`
- `/providers/`
- `/providers/[slug]/`
- `/timeline/`
- `docs/methodology.md`
- `docs/source-policy.md`
- `docs/status-definitions.md`
- `docs/report-corrections.md`
- `docs/disclaimer.md`

## Current dataset

- 20 display seed records
- 20 timeline events
- official or developer source URL for each display record
- last checked date for each display record
- production risk value for each display record
- action required value for each display record
- replacement value where applicable

## Release checklist

### Data display

- [ ] `/apis/` loads all 20 records
- [ ] Search works on provider, API name, category, replacement, and risk text
- [ ] Category filter works
- [ ] Stage filter works
- [ ] Production risk filter works
- [ ] Official source links open in a new tab
- [ ] Detail-page links work for records with detail pages
- [ ] Records without detail pages do not break critical browsing paths

### Lifecycle pages

- [ ] `/deadlines/` loads grouped deadline sections
- [ ] `/deprecated/` loads deprecated / partially usable records
- [ ] `/removed/` loads removed / no longer usable records
- [ ] `/replacements/` loads replacement rows
- [ ] `/providers/` loads provider groups
- [ ] `/timeline/` loads 20 events in chronological order

### Content quality

- [ ] Each seed record has a public source URL
- [ ] Each seed record has `lastChecked`
- [ ] Each seed record has `stage`
- [ ] Each seed record has `deadlineStatus`
- [ ] Each seed record has `stillUsable`
- [ ] Each seed record has `actionRequired`
- [ ] Each seed record has `productionRisk`
- [ ] Conservative records are rechecked before final public v0 wording

### Public-safe review

- [ ] Public docs contain no private operating strategy
- [ ] Public docs contain no personal context
- [ ] Public docs contain no private financial or monetization pressure
- [ ] Public docs contain no AI workflow or assistant handoff text
- [ ] PR bodies remain neutral and public-safe

### Static deployment

- [ ] Cloudflare Pages deploys from `main`
- [ ] Root page loads on `pages.dev`
- [ ] Nested pages load directly when opened by URL
- [ ] Relative links work from nested pages
- [ ] Mobile layout is readable enough for v0

## Known limitations before v0 label

- Display manifests are lightweight and not yet generated from the canonical entity / event / evidence JSON files.
- Some older records should be rechecked for exact current status before stronger public wording.
- Some provider pages may not yet include all providers from the 20-record display dataset.
- Detail pages are basic and should be made more consistent in a later pass.
- SEO files such as `sitemap.xml` and `robots.txt` are not yet added.
- Canonical data backfill for the later seed records remains incomplete.

## v0 readiness decision

The project can be treated as structurally v0-ready when:

- the 20-record pages load correctly,
- the public pages have no broken critical navigation,
- public-safe review passes,
- and the source/data quality pass confirms no obvious false or unsafe claims.

## Next recommended PRs

- PR-017: source/data quality pass
- PR-018: SEO basics
- PR-019: detail page consistency pass
- PR-020: canonical data backfill for seed records
