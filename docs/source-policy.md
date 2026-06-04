# Source Policy

API Deprecation Archive prioritizes official and high-reliability public sources.

## Preferred sources

Preferred evidence includes:

- official documentation
- official changelog
- official blog post
- official release notes
- official migration guide
- official GitHub repository or issue
- official forum announcement
- standards document
- archived official page

## Secondary sources

Secondary sources may be used cautiously when they help explain context or preserve information that is no longer easy to find in official documentation.

Examples:

- trusted technical news
- well-sourced industry reports
- research reports
- archive captures

## Source status

Allowed `source_status` values:

- `official`
- `secondary_confirmed`
- `archived_only`
- `unclear`

v0 should prefer `official` and `archived_only` sources. `unclear` should not be used for initial seed records.

## Evidence reliability

Allowed reliability values:

- `high`
- `medium`
- `low`

High reliability includes official docs, official changelogs, official migration guides, official release notes, standards documents, and archived official pages.

Medium reliability includes trusted technical news, well-sourced industry reports, and secondary sources confirming official material.

Low reliability includes forum posts, social posts, unsourced summaries, and unclear sources. Low-reliability sources should not be the only support for v0 seed records.

## Archive links

When official docs move, disappear, or are historically important, archived URLs should be stored separately from current official URLs.

## Safety limits

Do not include exploit instructions, API key bypass guidance, authentication circumvention details, or unsafe operational instructions.
