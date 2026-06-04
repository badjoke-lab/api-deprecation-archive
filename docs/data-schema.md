# Data Schema

API Deprecation Archive uses four JSON record types in v0:

- entity
- event
- evidence
- provider

The core public model is `entity / event / evidence`.

## Entity

An entity is the API surface or developer feature being tracked.

Normal entity units include:

- API feature group
- API version
- SDK
- CLI
- webhook
- authentication method
- model API
- developer feature
- pricing or limit change
- docs change

Entity IDs use this format:

```text
apidep_entity_000001
```

Entity records must include fields that support migration decisions:

- `record_unit`
- `deprecation_stage`
- `deadline_status`
- `still_usable`
- `action_required`
- `production_risk`
- `freshness_status`
- `replacement_type`
- `source_status`
- `last_checked_at`

## Event

An event is a lifecycle change affecting an entity.

Event IDs use this format:

```text
apidep_event_000001
```

Events include:

- deprecation
- removal
- version sunset
- SDK or CLI deprecation
- webhook change
- auth method removal
- pricing or rate-limit change
- migration deadline
- replacement announcement
- docs removal or movement

## Evidence

Evidence is a public source that supports an entity or event claim.

Evidence IDs use this format:

```text
apidep_evidence_000001
```

Evidence should identify:

- source type
- URL
- title
- publisher
- published date when available
- archived URL when useful
- reliability
- claim scope
- last checked date
- whether the source is primary
- whether the source is an official domain

## Provider

A provider is a company, organization, or platform that owns or maintains tracked API surfaces.

Provider IDs use this format:

```text
apidep_provider_000001
```

Provider records support provider index pages and provider-specific timelines.

## Schema files

JSON Schemas are stored in:

```text
schemas/entity.schema.json
schemas/event.schema.json
schemas/evidence.schema.json
schemas/provider.schema.json
```

## Cross-reference rules

- Events must reference an existing entity.
- Evidence must reference an existing entity.
- Evidence may reference an event.
- Entity `provider_id` should reference a provider when available.
- Related records should use a structured `project / record_id / relationship` object.

## Validation scope

The schema files validate record shape and enum values.

PR-003 will add validation logic for cross-file consistency, date/status consistency, stale-record checks, and required evidence relationships.
