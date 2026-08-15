# API Deprecation Archive — AI-era Execution Schedule

Status: roadmap addendum

## Order
1. Continue existing v0.1/approved work; do not reset the project.
2. Audit representative APIs for missing migration-window, shutdown, replacement and last-verification history.
3. Extend schema/status representation only where required by reviewed lifecycle facts.
4. Ship deterministic per-API JSON and validation.
5. Strengthen structured filters/search, including deprecation/effective dates and migration-window/replacement dimensions where supported.
6. Add Compare for migration timeline and replacement facts.
7. Add Stats for migration windows, deprecation reasons, replacement availability, provider patterns and coverage/quality.
8. Run reviewed lifecycle follow-up batches.
9. Evaluate natural-language-to-filter translation only after deterministic search is stable.

## Gate
Spec -> implementation PR -> validation/CI green -> merge -> production verification where applicable -> docs/status sync.

## Mandatory continuation rule
Future work must read the v0.1 spec, relevant schema/methodology/source documents, `ai-era-registry-spec.md`, and this schedule before selecting work.