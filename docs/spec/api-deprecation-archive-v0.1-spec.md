# API Deprecation Archive v0.1 Specification

Status: draft  
Project type: evidence-based developer lifecycle registry  
Primary model: entity / event / evidence  
Version: 0.1  
Last updated: 2026-06-04

---

## 1. Overview

**API Deprecation Archive** is an evidence-based registry for developer-facing API lifecycle changes.

It records deprecations, removals, sunsets, migration deadlines, replacement paths, and breaking developer-platform changes for APIs, SDKs, CLIs, webhooks, authentication methods, and related developer features.

The purpose is to help developers answer:

```text
Is this API / SDK / CLI / webhook / auth method still usable?
When does it stop working?
What replaces it?
What action is required?
What official source confirms this?
```

The site is not a replacement for official provider documentation. It is a cross-provider index that points users to official notices, migration guides, changelogs, and archived sources.

---

## 2. Core Positioning

API Deprecation Archive is an evidence-based developer migration and deprecation registry.

It is not:

```text
a general software EOL tracker
an API directory
a full API reference
a changelog mirror
a breaking-news site
a vulnerability or exploit database
a replacement for provider documentation
```

The site focuses on developer-facing changes that may require action, migration, verification, or code updates.

---

## 3. Scope

### 3.1 Included

The archive covers lifecycle changes affecting:

```text
REST API
GraphQL API
AI model API
cloud API
payment API
commerce API
social platform API
developer platform API
SDK
CLI
webhook
OAuth / authentication method
API version
API endpoint group
developer platform feature
rate limit or free-tier changes that break existing usage
pricing changes that materially affect existing API usage
```

### 3.2 v0 Priority Categories

v0 focuses on high-impact changes in:

```text
AI API
Cloud / hosting API
Social / platform API
Payment / commerce API
Developer tool API
```

### 3.3 Excluded from v0

v0 does not attempt to cover:

```text
general software EOL
operating system support lifecycles
database / language / framework EOL unless API-specific
browser API deprecations at full scale
mobile OS API changes at full scale
individual library functions unless widely impactful
every minor endpoint change from every provider
unofficial rumors without reliable evidence
security exploit instructions
API key bypass or authentication circumvention details
provider changelogs copied in full
```

---

## 4. Inclusion Rules

A record may be added when the change creates a real developer-facing migration or production risk.

Include records when one or more of the following are true:

```text
API / SDK / CLI / webhook / auth method is deprecated
removal date, sunset date, or migration deadline exists
old API version will stop working
SDK or CLI update is required for continued operation
authentication method or scope change can break existing integrations
webhook payload changes incompatibly
rate limit / free-tier / pricing change materially affects existing API use
official replacement or migration guide exists
old documentation was removed or moved and affects migration research
```

Do not add records for:

```text
simple new feature announcements
minor documentation edits
small bug fixes
routine SDK patch releases
unclear changelog items with no developer action
provider changelog mirroring
unofficial rumors only
security exploit details
API key bypass or authentication workaround instructions
```

Guiding rule:

```text
Include only changes that require developers to verify, migrate, replace, update, or stop using an existing integration.
```

---

## 5. Core Data Model

The archive uses three core record types:

```text
entity
event
evidence
```

- `entity`: API, API group, API version, SDK, CLI, webhook, authentication method, or developer feature being tracked.
- `event`: lifecycle change affecting the entity.
- `evidence`: public source supporting the entity or event claim.

---

## 6. Entity Granularity

The entity unit is:

```text
provider-level API feature group / API version / SDK / CLI / webhook / auth method / developer feature
```

Good entity examples:

```text
OpenAI Assistants API
Twitter/X API v1.1
Firebase Dynamic Links
Shopify REST Admin API
Google Ads API v15
Stripe API version 2020-08-27
Heroku Free Dynos
Kubernetes v1.22 Removed APIs
Slack Legacy Tokens
```

Avoid broad provider-level entities such as:

```text
OpenAI API
Google API
Stripe API
GitHub API
Amazon API
```

Avoid individual endpoint records unless the endpoint is historically or operationally significant.
Endpoint-level detail should usually be stored inside `affected_surface`, `affected_endpoints`, or event fields.

---

## 7. Record Unit

Each entity must include `record_unit`.

Allowed values:

```text
api_group
api_version
sdk
cli
webhook
auth_method
developer_feature
model_api
pricing_or_limit_change
docs_change
```

---

## 8. Entity Schema

```json
{
  "id": "apidep_entity_000001",
  "slug": "openai-assistants-api",
  "canonical_name": "OpenAI Assistants API",
  "aliases": [],
  "provider": "OpenAI",
  "category": "ai_api",
  "record_unit": "api_group",
  "status": "deprecated",
  "deprecation_stage": "sunsetting",
  "deadline_status": "upcoming",
  "still_usable": "yes",
  "still_usable_note": "Official documentation says the API remains available until the stated sunset date.",
  "action_required": "migrate",
  "impact_level": "high",
  "production_risk": "high",
  "freshness_status": "fresh",
  "summary": "",
  "current_state": "",
  "affected_surface": ["api_version"],
  "affected_users": ["developers", "api_integrators"],
  "official_url": null,
  "docs_url": null,
  "migration_url": null,
  "replacement": null,
  "replacement_type": "official",
  "replacement_url": null,
  "source_status": "official",
  "confidence": "high",
  "announced_at": null,
  "deprecated_at": null,
  "sunset_at": null,
  "last_supported_at": null,
  "removal_effective_at": null,
  "migration_deadline_at": null,
  "first_seen_at": null,
  "last_checked_at": "YYYY-MM-DD",
  "next_check_recommended_at": "YYYY-MM-DD",
  "known_unknowns": [],
  "related_records": [],
  "notes": ""
}
```

---

## 9. Status Fields

### 9.1 status

```text
active
limited
deprecated
sunsetting
removed
replaced
unknown
```

### 9.2 deprecation_stage

```text
active
announced
deprecated
sunsetting
removed
replaced
unknown
```

### 9.3 deadline_status

```text
no_deadline
upcoming
passed_unverified
passed_removed
extended
unknown
```

Rules:

```text
deadline is in the future → upcoming
deadline is in the past and removal has not been re-verified → passed_unverified
removal is confirmed → passed_removed
official deadline was extended → extended
no deadline exists → no_deadline
deadline is unclear → unknown
```

### 9.4 still_usable

Required values:

```text
yes
no
partial
unknown
```

### 9.5 action_required

```text
none
monitor
migrate
update_sdk
replace_endpoint
rotate_auth
remove_usage
unknown
```

### 9.6 impact_level and production_risk

Allowed values:

```text
low
medium
high
critical
unknown
```

Difference:

```text
impact_level = size or importance of the public change
production_risk = operational danger for developers who keep using the old surface
```

### 9.7 freshness_status

```text
fresh
watch
stale
unknown
```

Freshness rules:

```text
fresh: last_checked_at is within 60 days
watch: last_checked_at is 61–90 days old
stale: last_checked_at is 91+ days old
unknown: last_checked_at is missing or cannot be evaluated
```

For deprecated, sunsetting, or upcoming-deadline records:

```text
more than 60 days old → watch
more than 90 days old → stale
```

### 9.8 replacement_type

```text
official
recommended
partial
community
none
unknown
```

v0 should mainly use:

```text
official
partial
none
unknown
```

### 9.9 source_status

```text
official
secondary_confirmed
archived_only
unclear
```

v0 policy:

```text
official = preferred
archived_only = acceptable if it is an archived official source
secondary_confirmed = use cautiously
unclear = do not include in v0 seed records
```

---

## 10. Date Fields

Dates should not be collapsed into one field.

```json
{
  "announced_at": null,
  "deprecated_at": null,
  "sunset_at": null,
  "last_supported_at": null,
  "removal_effective_at": null,
  "migration_deadline_at": null,
  "last_checked_at": "YYYY-MM-DD",
  "next_check_recommended_at": "YYYY-MM-DD"
}
```

Field meanings:

| Field | Meaning |
|---|---|
| `announced_at` | Date the change was officially announced |
| `deprecated_at` | Date the API became deprecated |
| `sunset_at` | Planned sunset date |
| `last_supported_at` | Final support date |
| `removal_effective_at` | Date the old surface was actually removed or disabled |
| `migration_deadline_at` | Date by which users should migrate |
| `last_checked_at` | Last date the record was reviewed |
| `next_check_recommended_at` | Suggested next review date |

Detail pages should simplify date display:

```text
Announced
Deprecated
Deadline
Removed
Last checked
```

---

## 11. Event Schema

```json
{
  "id": "apidep_event_000001",
  "entity_id": "apidep_entity_000001",
  "type": "api_deprecated",
  "date": "YYYY-MM-DD",
  "title": "",
  "summary": "",
  "affected_versions": [],
  "affected_endpoints": [],
  "affected_sdks": [],
  "affected_surface": ["api_version"],
  "deadline": null,
  "removal_date": null,
  "replacement": null,
  "replacement_type": "official",
  "replacement_url": null,
  "migration_path": null,
  "action_required": "migrate",
  "user_impact": "",
  "impact_level": "high",
  "production_risk": "high",
  "evidence_ids": [],
  "confidence": "high",
  "notes": ""
}
```

Allowed event types:

```text
api_deprecated
api_removed
version_sunset
sdk_deprecated
sdk_removed
cli_deprecated
cli_removed
webhook_changed
webhook_removed
auth_method_deprecated
auth_method_removed
scope_changed
rate_limit_changed
free_tier_removed
pricing_changed
breaking_change
migration_deadline
replacement_announced
docs_removed_or_moved
deadline_extended
removal_confirmed
unknown_status
other
```

---

## 12. Evidence Schema

```json
{
  "id": "apidep_evidence_000001",
  "entity_id": "apidep_entity_000001",
  "event_id": "apidep_event_000001",
  "type": "official_docs",
  "url": "",
  "title": "",
  "publisher": "",
  "published_at": null,
  "archived_url": null,
  "quote_or_summary": "",
  "reliability": "high",
  "claim_scope": "deprecation",
  "last_checked_at": "YYYY-MM-DD",
  "is_primary": true,
  "is_official_domain": true,
  "notes": ""
}
```

Allowed evidence types:

```text
official_docs
official_changelog
official_blog
official_release_notes
official_migration_guide
official_github
official_forum
official_social
archive_capture
standards_document
trusted_news
research_report
secondary_source
other
```

Allowed reliability values:

```text
high
medium
low
```

v0 should prefer high-reliability evidence.

Allowed `claim_scope` values:

```text
entity
deprecation
removal
deadline
replacement
migration
still_usable
production_risk
pricing
rate_limit
auth
webhook
docs
status
other
```

---

## 13. Related Records

The archive may link to related records in other ledger projects.

```json
{
  "related_records": [
    {
      "project": "ai-tools-history-archive",
      "record_id": "",
      "relationship": "same_event_different_scope"
    }
  ]
}
```

Boundary:

```text
AI Tools History Archive:
records AI services, models, features, products, and lifecycle history.

API Deprecation Archive:
records developer-facing API / SDK / endpoint / model API changes that require migration or verification.
```

---

## 14. Main Pages

v0 should include:

```text
/
/apis/
/apis/[slug]/
/deadlines/
/deprecated/
/removed/
/replacements/
/providers/
/providers/[slug]/
/timeline/
/methodology/
/report/
/about/
```

Future SEO pages may include:

```text
/api-deprecation/
/api-sunset/
/sdk-deprecation/
/cli-deprecation/
/webhook-breaking-changes/
/oauth-deprecation/
/ai-api-deprecations/
/payment-api-deprecations/
/social-api-deprecations/
/cloud-api-deprecations/
```

---

## 15. Page Behavior

### Home

The home page should show:

```text
total tracked records
upcoming deadlines
deprecated but still usable records
removed records
recently updated records
high production risk records
search box
links to main pages
```

### API List

Required columns:

```text
API / Feature
Provider
Affected surface
Stage
Still usable
Deadline
Action required
Replacement
Production risk
Last checked
Evidence
```

Filters:

```text
provider
category
record_unit
deprecation_stage
deadline_status
still_usable
action_required
affected_surface
production_risk
replacement_type
source_status
freshness_status
removed / not removed
has migration guide
has replacement
```

### Upcoming Deadlines

Sections:

```text
Next 30 days
Next 60 days
Next 90 days
Later
Deadline unknown
Deadline passed but not re-verified
Deadline passed and removed
Extended
```

Display text for passed but unverified deadlines:

```text
Deadline passed, but removal status has not been re-verified.
```

### Detail Page

Each detail page must follow this order:

```text
1. Header
2. Current State
3. Action Required
4. Deadline / Removal
5. Replacement / Migration Path
6. Affected Surface
7. Timeline
8. Evidence
9. Known Unknowns
10. Last Checked / Disclaimer
```

---

## 16. Methodology Page Requirements

The methodology page must explain:

```text
what counts as API deprecation
what counts as API removal
what counts as replacement
what counts as still usable
how status is assigned
how deadline_status is assigned
how production_risk is assigned
how freshness_status is assigned
how source_status is assigned
how evidence reliability is judged
what is excluded
how uncertainty is shown
how corrections are handled
```

It should clearly state:

```text
The archive is informational and may be incomplete.
Official provider documentation remains the source of truth.
```

---

## 17. Report / Correction Page

Report types:

```text
missing API deprecation
wrong deadline
wrong removal status
wrong still usable status
new migration guide
new replacement URL
broken evidence link
record correction
provider correction
```

Report form fields:

```text
Provider
API / SDK / CLI / feature name
What changed?
Official source URL
Deadline or removal date if known
Replacement URL if known
Is it already removed?
Reporter note
Reporter contact optional
```

---

## 18. UI / Design Direction

Design should be:

```text
white background
black / gray text
compact tables
status badges
deadline badges
action badges
production risk badges
evidence links
minimal animation
developer documentation feel
```

Avoid:

```text
trading dashboard style
neon terminal UI
hype wording
large marketing cards
sensational labels
blog-heavy layout
```

Mobile:

```text
search first
collapsible filters
compact stacked rows
deadline and action required visible without opening detail
no table-only horizontal overflow as the sole mobile experience
```

---

## 19. Validation Rules

The validation script must check at least:

```text
missing id
missing slug
duplicate slug
missing canonical_name
missing provider
invalid record_unit
invalid status
invalid deprecation_stage
invalid deadline_status
invalid still_usable
invalid action_required
invalid production_risk
invalid freshness_status
invalid replacement_type
invalid source_status
missing last_checked_at
bad URL format
deadline_status=upcoming but no future deadline date
deadline_status=passed_removed but no removal_effective_at
still_usable=no but no removal_effective_at or clear note
removed status but still_usable=yes
removed status but removal_effective_at missing
deadline in past but deadline_status still upcoming
stale freshness_status inconsistent with last_checked_at
event without evidence
evidence references missing entity
evidence references missing event
```

---

## 20. v0 Seed Record Policy

v0 should start with approximately 20 high-quality records.

A seed record should have:

```text
official source
clear developer impact
deprecated date, deadline, or removal date
replacement or migration guide when available
search relevance
last_checked_at
still_usable value
production_risk value
source_status
```

Target v0 distribution:

```text
AI API: 4 records
Cloud / hosting API: 4 records
Social / platform API: 4 records
Payment / commerce API: 4 records
Developer tool API: 4 records
```

Do not add records only to increase count.

---

## 21. v0 Completion Criteria

v0 is complete when:

```text
20 seed records exist
each seed record has official or archived official evidence where possible
all records have last_checked_at
all records have record_unit
all records have deprecation_stage
all records have deadline_status
all records have still_usable
all records have action_required
all records have production_risk
all records have freshness_status
upcoming deadlines page works
deprecated but still usable page works
removed APIs page works
replacement matrix works
provider pages work
detail pages show current state, action, deadline, replacement, timeline, evidence, and known unknowns
methodology page explains all status rules
report / correction path exists
validation script passes
site builds statically
mobile layout is readable
```

---

## 22. Technical Architecture

v0 should be static-first.

Recommended options:

```text
static HTML / CSS / JS
Astro
Next.js static export
```

Data should initially be stored as JSON.

Suggested structure:

```text
data/
  entities/
  events/
  evidence/
  providers/
  stats.json

scripts/
  validate-data.js
  build-search-index.js

docs/
  methodology.md
  data-schema.md
  source-policy.md
  status-definitions.md
  report-corrections.md
```

No database is required for v0.

---

## 23. Public Repository Policy

Public files should contain only:

```text
project description
scope
methodology
data schema
public records
public evidence
validation logic
build instructions
report / correction instructions
disclaimer
```

Public files should not contain:

```text
private operating notes
personal context
financial urgency
internal strategy
AI assistant workflow
private account information
unpublished payment-provider concerns
unsafe technical instructions
```

---

## 24. Disclaimer

The archive should include this short disclaimer on methodology and detail pages:

```text
API Deprecation Archive summarizes public-source information about developer-facing API lifecycle changes. Records may be incomplete or outdated. Always verify with the official provider documentation before making production changes.
```

---

## 25. Future Expansion

### v0.5

```text
50–80 records
stats page
source coverage display
stale record warnings
improved provider pages
public changelog
```

### v1

```text
120–200 records
RSS or JSON feed
deadline watchlist
GitHub issue templates
record history
more SEO landing pages
```

### Later

```text
public archive API
browser extension
old tutorial checker
repository dependency hinting
automated official changelog monitoring
OpenAPI deprecation extraction
```

These later features should not block v0.

---

## 26. Final v0.1 Decisions

The v0.1 specification fixes the following decisions:

```text
Entity granularity:
API feature group / API version / SDK / CLI / developer feature level.

Inclusion rule:
Only changes that create migration, removal, verification, or production risk for existing integrations.

Primary value:
still usable status, deadline, action required, replacement, production risk, official evidence, and last checked freshness.

Required display fields:
Still usable
Deadline
Action required
Replacement
Production risk
Last checked
Evidence

Initial seed:
20 high-confidence records across five categories.

Freshness:
freshness_status and stale display are required from v0.

Cross-archive overlap:
Allowed when scope differs. Use related_records to connect records across archive projects.
```
