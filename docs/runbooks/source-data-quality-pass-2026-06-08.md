# Source / Data Quality Pass — 2026-06-08

## Status

This is the first public-safe source and data quality pass after reaching the v0 minimum seed target of 20 display records.

## Scope of this pass

Checked at display-manifest level:

- `data/records.json`
- `data/timeline.json`
- API list links
- detail page coverage
- public source URL presence
- required display fields
- public-safe wording

This pass does not claim full canonical entity / event / evidence backfill completion.

## Dataset summary

- Display records: 20
- Timeline events: 20
- Records with source URL: 20 / 20
- Records with `lastChecked`: 20 / 20
- Records with `stage`: 20 / 20
- Records with `deadlineStatus`: 20 / 20
- Records with `stillUsable`: 20 / 20
- Records with `actionRequired`: 20 / 20
- Records with `productionRisk`: 20 / 20

## Detail page coverage

A Heroku detail page was added in this pass to remove the known missing detail page for `heroku-free-product-plans`.

Known detail page limitations:

- Detail pages are intentionally basic.
- Several pages need fuller timeline sections.
- Some pages need stronger known-unknowns sections.
- Some records need canonical event/evidence JSON backfill.

## Records that should be rechecked before stronger public claims

The following records are useful seed entries but should be rechecked before stronger v0 wording or wider promotion:

- Slack files.upload API method
- Shopify REST Admin API
- PayPal NVP/SOAP APIs
- Meta Graph API older versions
- Twilio Authy API
- Google Container Registry
- Stripe Sources API

Reason:

- These records may involve partial availability, versioned timelines, or provider wording that needs careful verification.
- Current wording is intentionally conservative.

## Public-safe review

No private operating strategy, personal context, AI workflow notes, private financial pressure, account details, or internal monetization discussion should be present in public-facing project docs.

This follows the internal public/private separation policy used for ledger projects.

## Quality issues to fix in later PRs

- Generate display pages from canonical entity / event / evidence JSON instead of lightweight manifests.
- Add canonical records for all 20 seeds.
- Add stronger evidence metadata for each record.
- Add archived URLs where official historical pages may move.
- Add freshness / stale warning display.
- Add detail page consistency pass.
- Add SEO basics including `sitemap.xml`, `robots.txt`, and page metadata pass.

## Result

PR-017 does not declare the archive complete. It moves the project from “20 seed records added” to “20 seed records with first public-safe quality pass documented.”
