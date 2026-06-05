# Validation

Validation is handled by `scripts/validate-data.mjs`.

Run:

```bash
npm run validate
```

The script uses Node.js standard library only. It does not require external dependencies.

## Current validation coverage

The script checks:

- duplicate entity IDs and slugs
- duplicate event IDs
- duplicate evidence IDs
- duplicate provider IDs and slugs
- required fields
- enum values
- ID formats
- date format
- URL format
- entity / event / evidence references
- provider references
- removed status and still-usable conflicts
- upcoming deadline consistency
- passed-removed deadline consistency
- event evidence references
- stale freshness warnings

## Data directories

Expected data directories:

```text
data/entities/
data/events/
data/evidence/
data/providers/
```

The validator passes with empty directories. Sample records will be added in PR-004.

## Warning vs error

Errors fail validation.

Warnings report likely quality issues, such as stale `last_checked_at` values that do not match `freshness_status`.

## PR-003 scope

PR-003 adds validation infrastructure only. It does not add real API deprecation records.
