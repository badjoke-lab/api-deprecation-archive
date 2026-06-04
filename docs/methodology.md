# Methodology

API Deprecation Archive is an evidence-based registry for developer-facing API lifecycle changes.

The archive is informational and may be incomplete. Official provider documentation remains the source of truth.

## What counts as API deprecation

A record may be added when a developer-facing API surface is deprecated, scheduled for removal, removed, replaced, or changed in a way that may require migration or verification.

Covered surfaces include:

- API feature groups
- API versions
- SDKs
- CLIs
- webhooks
- authentication methods
- OAuth scopes
- model APIs
- developer-platform features
- pricing, rate-limit, or free-tier changes that materially affect existing API usage

## Inclusion rule

Include only changes that require developers to verify, migrate, replace, update, or stop using an existing integration.

## Exclusion rule

Do not include routine changelog items, simple new feature announcements, minor documentation edits, small bug fixes, routine SDK patch releases, unofficial rumors, exploit instructions, API key bypass guidance, or provider changelogs copied in full.

## Counting unit

The normal record unit is a provider-level API feature group, API version, SDK, CLI, webhook, authentication method, or developer feature.

Avoid records that are too broad, such as a provider's entire API platform. Avoid records that are too narrow, such as a single minor endpoint or parameter change, unless the endpoint is historically or operationally significant.

## Data model

The archive uses three core record types:

- `entity`: the API surface or developer feature being tracked
- `event`: a lifecycle change affecting the entity
- `evidence`: public source supporting a claim

## Current-state questions

Each detail page should make these questions easy to answer:

- Is it still usable?
- Is there a confirmed deadline?
- Has it already been removed?
- What action is required?
- What replaces it?
- What official source confirms this?

## Uncertainty

If official documentation does not clearly confirm a value, records should use `unknown`, `partial`, or a known-unknown note rather than guessing.

## Production use warning

Records are public-source summaries. Always verify with official provider documentation before making production changes.
