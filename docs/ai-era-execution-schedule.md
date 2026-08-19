# API Deprecation Archive — AI-era Execution Schedule

Status: Ledger Series Phase 8 active — Stage 3
Last synchronized: 2026-08-20

## Fixed Phase 8 order

1. Current-main gap audit — **COMPLETE**
2. Canonical backfill and schema gate — **COMPLETE WITH EXPLICIT PRIMARY-EVIDENCE GAP**
3. Per-API machine-readable JSON — **CURRENT**
4. Structured migration filters — pending
5. Migration-history Compare — pending
6. Migration and quality Stats — pending
7. Reviewed lifecycle follow-up and production verification — pending
8. Closeout — pending

## Stage 2 accepted result

At accepted main `2bdbe2fd1ad125d013ffec5329bc802ba57b66f2`:

- 20 public display rows
- 19 schema-validated canonical entities
- 17 canonical lifecycle events
- 19 canonical evidence records
- 0 schema expansions required
- 1 display-only pending row: `meta-graph-api-older-versions`

The Meta row is not a failed count target to fill. It is intentionally excluded from canonical output until a concrete version or bounded version family is supported by version-specific first-party lifecycle evidence.

The superseded aggregate backfill PR #22 is closed unmerged and is historical reference only.

## Stage 3 implementation order

1. Load accepted canonical entity/event/evidence files only.
2. Generate deterministic per-API lifecycle dossiers.
3. Generate a deterministic machine index and manifest.
4. Expose stable public machine paths without depending on `data/records.json`.
5. Validate dossier completeness, reference integrity, canonical-only provenance, and exact generated file set.
6. Make CI fail when tracked machine output drifts from canonical inputs.
7. Merge only after validation is green.
8. Verify the public output before Stage 3 is accepted complete.

## Later work preserved from the AI-era plan

After Stage 3:

- strengthen filters/search for deprecation/effective dates, migration windows, replacements, provider, lifecycle state, and evidence quality where supported;
- add Compare focused on migration timeline and replacement facts, not vendor ranking;
- add Stats for migration-window distributions, lifecycle reasons, replacement availability, provider patterns, and coverage/quality;
- run reviewed lifecycle follow-up batches;
- evaluate natural-language-to-filter translation only after deterministic search is stable.

## Gate

Spec -> reviewed implementation PR -> validation/CI green -> merge -> production verification where applicable -> docs/status sync.

## Mandatory continuation rule

Future work must read the v0.1 spec, relevant schema/methodology/source documents, `ai-era-registry-spec.md`, this schedule, the current Phase 8 authority, and the current status runbook before selecting the next task.
