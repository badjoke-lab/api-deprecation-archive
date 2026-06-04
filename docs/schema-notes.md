# Schema Notes

This repository defines JSON Schema files before adding the initial dataset.

## Scope of PR-002

PR-002 defines record shape and enum values only.

It does not add provider records, API records, event records, or evidence records.

## Validation roadmap

Schema files check:

- required fields
- enum values
- ID formats
- URL shape
- date string shape
- basic object structure

PR-003 will add a validation script for checks that JSON Schema alone does not cover, including:

- duplicate IDs and slugs across files
- entity / event / evidence cross-references
- deadline and status consistency
- stale freshness checks
- removed status and still-usable conflicts
- evidence requirements for events

## ID prefixes

Use these prefixes:

- `apidep_entity_000001`
- `apidep_event_000001`
- `apidep_evidence_000001`
- `apidep_provider_000001`

## File placement

Expected data placement for later PRs:

```text
data/entities/*.json
data/events/*.json
data/evidence/*.json
data/providers/*.json
```

## Public-safe rule

Schemas and docs should only describe public project structure, methodology, validation, and data rules.
