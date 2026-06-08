# v0 Release Readiness

Last updated: 2026-06-08

## Status

API Deprecation Archive has reached the minimum v0 seed target.

Current public-facing dataset:

- 20 display seed records
- API list page
- API detail pages for most records
- Deadlines page
- Deprecated page
- Removed page
- Replacement matrix
- Provider index and provider pages
- Timeline page
- Methodology / source policy / status definitions / disclaimer

## Release state

This is a v0 public preview, not a complete API lifecycle database.

The site is suitable for public viewing as an early archive if the following caveats remain visible:

- Records summarize public-source information.
- Users must verify provider documentation before production changes.
- Some records are conservative lifecycle summaries.
- Some provider-specific details should be rechecked before broader promotion.
- Canonical entity/event/evidence JSON backfill is still pending for later work.

## Minimum checks before promotion

Manual browser checks:

- Home page loads
- `/apis/` loads and shows 20 records
- Search works on `/apis/`
- Category, stage, and risk filters work
- `/deadlines/` loads
- `/deprecated/` loads
- `/removed/` loads
- `/replacements/` loads
- `/providers/` loads
- `/timeline/` loads and shows 20 events
- Detail pages for new PR-015 records load
- Official source links open in a new tab
- Mobile width does not break the navigation or tables

Data checks:

- Record names are not duplicated
- Slugs are not duplicated
- Every `evidenceUrl` points to a provider, official, or developer source
- `stage`, `deadlineStatus`, and `stillUsable` labels are internally consistent
- Removed records should not be marked fully usable
- Deprecated records should have replacement or known-unknown wording

## Known gaps after v0

- Heroku detail page is deferred
- Canonical provider/entity/event/evidence JSON does not yet cover all 20 display records
- Provider detail pages may not list all newly added providers until a later generated-data pass
- Timeline dates for broad legacy/deprecated records may need stricter event-date normalization
- SEO basics are still pending
- Source quality pass is still pending

## Next PRs

- PR-017: source / data quality pass
- PR-018: SEO basics
- PR-019: canonical JSON backfill for all 20 records
