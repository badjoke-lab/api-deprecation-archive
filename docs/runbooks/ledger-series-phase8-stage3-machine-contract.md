# Ledger Series Phase 8 — Stage 3 Machine-Data Contract

Date: 2026-08-20
Status: implementation contract

## Purpose

Stage 3 publishes a deterministic machine-readable layer for accepted canonical API lifecycle records without promoting the lightweight public display manifest into canonical authority.

## Canonical inputs

Only these directories are inputs:

- `data/entities`
- `data/events`
- `data/evidence`

`data/records.json` and `data/timeline.json` are public display surfaces. They are not canonical inputs to machine generation.

## Record inclusion rule

A per-API machine dossier exists if and only if a schema-validated canonical entity file exists under `data/entities`.

Consequences:

- the accepted Stage 2 count is 19 dossiers;
- the display-only `meta-graph-api-older-versions` placeholder is excluded automatically;
- no count-target padding or synthetic twentieth record is allowed;
- if a future reviewed Meta version-specific entity is added canonically, it will enter the machine layer through the same generator path.

## Determinism

`scripts/generate-machine-data.mjs`:

1. loads JSON files from the canonical directories;
2. orders source files deterministically;
3. joins events and evidence by `entity_id`;
4. sorts lifecycle events by date then ID and evidence by ID;
5. serializes object keys deterministically;
6. calculates one SHA-256 `data_revision` from the normalized canonical source payload;
7. does not include wall-clock generation time;
8. emits the same bytes for the same canonical source facts.

## Public outputs

- `/version.json`
- `/data/machine/manifest.json`
- `/data/machine/index.json`
- `/data/machine/records/{slug}.json`
- `/llms.txt`
- `/ai.txt`

Each dossier contains:

- the exact canonical entity object;
- canonical events linked to that entity;
- canonical evidence linked to that entity;
- direct lifecycle signals derived only from explicit canonical fields;
- source-file provenance;
- stable human and machine paths.

## Allowed derived signals

The generator may expose only direct projections of canonical facts, such as:

- event types present;
- whether `removal_effective_at` is populated;
- whether `migration_deadline_at` is populated;
- whether the canonical entity has a replacement value;
- count of evidence records explicitly marked primary.

These signals do not establish new lifecycle facts.

The generator must not infer:

- a removal date from a passed deadline;
- a completion date from a shutdown-start date;
- a universal shutdown from a scope-limited change;
- a replacement from generic related records;
- a version-specific Meta lifecycle from the broad display placeholder.

## Drift gate

`npm run validate:machine` regenerates the complete deterministic machine layer in the CI checkout, then `scripts/validate-machine-tracked.mjs` inspects Git status for tracked changes and untracked generated files.

CI must fail if:

- an expected machine file is missing;
- a tracked machine file differs from canonical inputs;
- a newly generated dossier is not committed;
- an extra stale dossier remains after canonical removal or renaming;
- version / manifest / index / llms / ai output differs from the deterministic generator;
- an event/evidence record references an entity outside the accepted canonical set.

Canonical data validation runs before the machine regeneration and tracked-output check.

## Bootstrap boundary

A temporary Stage 3 bootstrap workflow was used only to create the initial tracked machine output. It has been removed and must not be merged or restored.

Normal repository CI now validates canonical data, regenerates the machine layer in an ephemeral checkout, and fails if the resulting tracked state differs from the reviewed repository output.

## HTTP verification boundary

Cloudflare Pages can serve an HTML fallback with HTTP 200 for an unknown static path. Therefore absence of a noncanonical dossier is verified by both:

- exclusion from the canonical machine index; and
- confirming that the unknown dossier path does not return a canonical JSON lifecycle dossier.

A Pages HTML fallback is not treated as a leaked canonical record.
