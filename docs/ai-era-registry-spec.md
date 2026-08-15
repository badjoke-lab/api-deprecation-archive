# API Deprecation Archive — AI-era Registry Specification

Status: planned / mandatory future-work reference

## Goal
The archive must be a verifiable migration-history registry, not merely a list of deprecation notices that an AI can summarize.

## Required work
- Preserve existing schema, status definitions, methodology and source policy.
- Track lifecycle where supported: launch/current use -> deprecation announcement -> migration window -> breaking restrictions -> shutdown -> replacement/successor/current outcome.
- Make announcement/effective dates, migration window, replacement, source scope, confidence and last verification explicit; unknown remains unknown.
- Provide deterministic per-API machine-readable JSON from canonical data.
- Strengthen structured filters for provider, API type, status, deprecation reason, dates, migration-window length, replacement availability and evidence quality.
- Add Compare focused on migration burden/timeline and lifecycle facts, not vendor ranking.
- Add Stats for migration-window distributions, deprecation reasons, replacement availability, provider patterns and registry quality/coverage.
- Automated discovery may stage notices but may not publish unreviewed canonical facts.

## Non-goals
No AI-generated canonical dates/replacements, subjective API ranking, prompt buttons or chatbot-first product.

## Mandatory reference
Future schema, methodology, source, validation, UI and implementation work must consult this file together with the v0.1 specification. Stricter existing rules prevail.