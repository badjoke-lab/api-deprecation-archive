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

## Static site shell

The repository currently includes a plain white-background static shell:

- `index.html`
- `styles.css`
- `app.js`
- `apis/index.html`
- `apis/api-list.js`
- `apis/[slug]/index.html` sample detail pages

The shell is intentionally simple and table-first. The API list page loads a lightweight `data/records.json` manifest for the initial sample records, and each sample record now has a basic detail page.

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

## Status

The repository has public-safe docs, schemas, validation infrastructure, sample records, a static site shell, a searchable API list page, and basic sample detail pages. Next work focuses on the deadlines page.
