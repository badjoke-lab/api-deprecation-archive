# API Deprecation Archive

API Deprecation Archive is an evidence-based registry for developer-facing API lifecycle changes.

It tracks API, SDK, CLI, webhook, authentication, and developer-platform deprecations, removals, sunsets, migration deadlines, replacement paths, and related breaking changes.

The project helps developers answer:

- Is this API / SDK / CLI / webhook / auth method still usable?
- When does it stop working?
- What replaces it?
- What action is required?
- What official source confirms this?

This project is not a replacement for official provider documentation. It is a cross-provider index that points users to official notices, migration guides, changelogs, and archived sources.

## Release state

The site is currently a v0 public preview.

The display dataset contains 20 seed records, which reaches the minimum v0 seed target. The archive is usable as an index, but users should always verify official provider documentation before production migration work.

Release readiness docs:

- [v0 release readiness](docs/runbooks/v0-release-readiness.md)
- [Source / data quality pass](docs/runbooks/source-data-quality-pass-2026-06-08.md)
- [Release status page](release/)

## Static site shell

The repository currently includes a plain white-background static shell:

- `index.html`
- `styles.css`
- `app.js`
- `apis/index.html`
- `apis/api-list.js`
- `apis/[slug]/index.html` sample detail pages
- `deadlines/index.html`
- `deadlines/deadlines.js`
- `deprecated/index.html`
- `removed/index.html`
- `replacements/index.html`
- `replacements/replacements.js`
- `providers/index.html`
- `providers/providers.js`
- `providers/[slug]/index.html` sample provider pages
- `timeline/index.html`
- `timeline/timeline.js`
- `release/index.html`
- `shared/lifecycle-list.js`

The shell is intentionally simple and table-first. The API list page loads a lightweight `data/records.json` manifest for the seed records. Records have basic detail pages where available, and registry pages group records by deadline, lifecycle state, replacement path, provider, and timeline.

## Current dataset

The display dataset currently contains 20 seed records.

Batch 1 added:

- AWS SDK for JavaScript v2
- GitHub password authentication for Git operations
- Heroku free product plans
- Google URL Shortener goo.gl links
- Azure AD Graph API

Batch 2 added:

- Google Cloud IoT Core
- Dropbox API v1
- PayPal NVP/SOAP APIs
- Meta Graph API older versions
- Twilio Authy API

Batch 3 added:

- FCM legacy HTTP and XMPP APIs
- Apple APNs binary provider API
- Exchange Online Basic authentication
- Google Container Registry
- Stripe Sources API

## Scope

Initial v0 scope focuses on high-impact developer-facing lifecycle changes in:

- AI APIs
- Cloud / hosting APIs
- Social / platform APIs
- Payment / commerce APIs
- Developer tool APIs

Out of scope for v0:

- general software EOL tracking
- full API reference documentation
- provider changelog mirroring
- vulnerability or exploit instructions
- API key bypass or authentication workaround content

## Data model

The archive uses an `entity / event / evidence` model:

- `entity`: API feature group, API version, SDK, CLI, webhook, auth method, or developer feature
- `event`: deprecation, removal, sunset, migration deadline, replacement announcement, or other lifecycle change
- `evidence`: public source supporting the record or event claim

## Key record fields

Records are designed to make migration decisions easier:

- still usable
- deadline status
- action required
- replacement
- production risk
- last checked
- official evidence

## Documentation

- [v0.1 specification](docs/spec/api-deprecation-archive-v0.1-spec.md)
- [Methodology](docs/methodology.md)
- [Source policy](docs/source-policy.md)
- [Status definitions](docs/status-definitions.md)
- [Report corrections](docs/report-corrections.md)
- [Disclaimer](docs/disclaimer.md)
- [Current status](docs/runbooks/current-status.md)
- [v0 release readiness](docs/runbooks/v0-release-readiness.md)
- [Source / data quality pass](docs/runbooks/source-data-quality-pass-2026-06-08.md)

## Status

The repository has public-safe docs, schemas, validation infrastructure, 20 display seed records, a static site shell, a searchable API list page, sample detail pages, deadlines, deprecated / removed pages, a replacement matrix, provider pages, a timeline, a release status page, and an initial source/data quality pass. Next work focuses on SEO basics and canonical data backfill.
