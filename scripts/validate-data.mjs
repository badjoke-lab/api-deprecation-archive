import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();

const DATA_DIRS = {
  entities: 'data/entities',
  events: 'data/events',
  evidence: 'data/evidence',
  providers: 'data/providers'
};

const ENUMS = {
  category: new Set(['ai_api', 'cloud_hosting_api', 'social_platform_api', 'payment_commerce_api', 'developer_tool_api', 'other']),
  record_unit: new Set(['api_group', 'api_version', 'sdk', 'cli', 'webhook', 'auth_method', 'developer_feature', 'model_api', 'pricing_or_limit_change', 'docs_change']),
  status: new Set(['active', 'limited', 'deprecated', 'sunsetting', 'removed', 'replaced', 'unknown']),
  deprecation_stage: new Set(['active', 'announced', 'deprecated', 'sunsetting', 'removed', 'replaced', 'unknown']),
  deadline_status: new Set(['no_deadline', 'upcoming', 'passed_unverified', 'passed_removed', 'extended', 'unknown']),
  still_usable: new Set(['yes', 'no', 'partial', 'unknown']),
  action_required: new Set(['none', 'monitor', 'migrate', 'update_sdk', 'replace_endpoint', 'rotate_auth', 'remove_usage', 'unknown']),
  risk: new Set(['low', 'medium', 'high', 'critical', 'unknown']),
  freshness_status: new Set(['fresh', 'watch', 'stale', 'unknown']),
  replacement_type: new Set(['official', 'recommended', 'partial', 'community', 'none', 'unknown']),
  source_status: new Set(['official', 'secondary_confirmed', 'archived_only', 'unclear']),
  affected_surface: new Set(['api_version', 'endpoint', 'sdk', 'cli', 'webhook', 'auth', 'model', 'pricing', 'rate_limit', 'docs']),
  event_type: new Set(['api_deprecated', 'api_removed', 'version_sunset', 'sdk_deprecated', 'sdk_removed', 'cli_deprecated', 'cli_removed', 'webhook_changed', 'webhook_removed', 'auth_method_deprecated', 'auth_method_removed', 'scope_changed', 'rate_limit_changed', 'free_tier_removed', 'pricing_changed', 'breaking_change', 'migration_deadline', 'replacement_announced', 'docs_removed_or_moved', 'deadline_extended', 'removal_confirmed', 'unknown_status', 'other']),
  evidence_type: new Set(['official_docs', 'official_changelog', 'official_blog', 'official_release_notes', 'official_migration_guide', 'official_github', 'official_forum', 'official_social', 'archive_capture', 'standards_document', 'trusted_news', 'research_report', 'secondary_source', 'other']),
  reliability: new Set(['high', 'medium', 'low']),
  claim_scope: new Set(['entity', 'deprecation', 'removal', 'deadline', 'replacement', 'migration', 'still_usable', 'production_risk', 'pricing', 'rate_limit', 'auth', 'webhook', 'docs', 'status', 'other'])
};

const ID_PATTERNS = {
  entity: /^apidep_entity_\d{6}$/,
  event: /^apidep_event_\d{6}$/,
  evidence: /^apidep_evidence_\d{6}$/,
  provider: /^apidep_provider_\d{6}$/
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const errors = [];
const warnings = [];

function error(path, message) {
  errors.push(`${path}: ${message}`);
}

function warn(path, message) {
  warnings.push(`${path}: ${message}`);
}

function isDate(value) {
  return typeof value === 'string' && DATE_RE.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

function isUri(value) {
  if (value === null || value === undefined || value === '') return true;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function readJsonFiles(dir) {
  const fullDir = join(ROOT, dir);
  if (!existsSync(fullDir)) return [];
  return readdirSync(fullDir)
    .filter((name) => name.endsWith('.json'))
    .sort()
    .map((name) => {
      const path = join(dir, name);
      try {
        return { path, data: JSON.parse(readFileSync(join(ROOT, path), 'utf8')) };
      } catch (err) {
        error(path, `invalid JSON: ${err.message}`);
        return { path, data: null };
      }
    });
}

function requireField(record, path, field) {
  if (!(field in record)) {
    error(path, `missing required field: ${field}`);
    return false;
  }
  return true;
}

function requireString(record, path, field) {
  if (!requireField(record, path, field)) return;
  if (typeof record[field] !== 'string' || record[field].length === 0) {
    error(path, `${field} must be a non-empty string`);
  }
}

function requireEnum(record, path, field, allowed) {
  if (!requireField(record, path, field)) return;
  if (!allowed.has(record[field])) {
    error(path, `${field} has invalid value: ${record[field]}`);
  }
}

function requireDate(record, path, field) {
  if (!requireField(record, path, field)) return;
  if (!isDate(record[field])) {
    error(path, `${field} must be YYYY-MM-DD`);
  }
}

function optionalDate(record, path, field) {
  if (!(field in record) || record[field] === null) return;
  if (!isDate(record[field])) {
    error(path, `${field} must be null or YYYY-MM-DD`);
  }
}

function optionalUri(record, path, field) {
  if (!(field in record)) return;
  if (!isUri(record[field])) {
    error(path, `${field} must be null or http(s) URL`);
  }
}

function requireArray(record, path, field) {
  if (!requireField(record, path, field)) return;
  if (!Array.isArray(record[field])) {
    error(path, `${field} must be an array`);
  }
}

function checkArrayEnums(record, path, field, allowed) {
  if (!Array.isArray(record[field])) return;
  for (const value of record[field]) {
    if (!allowed.has(value)) {
      error(path, `${field} has invalid value: ${value}`);
    }
  }
}

function checkDuplicate(records, field, label) {
  const seen = new Map();
  for (const { path, data } of records) {
    if (!data || !data[field]) continue;
    if (seen.has(data[field])) {
      error(path, `duplicate ${label}: ${data[field]} also used in ${seen.get(data[field])}`);
    } else {
      seen.set(data[field], path);
    }
  }
}

function daysSince(dateString) {
  const date = new Date(`${dateString}T00:00:00Z`);
  const now = new Date();
  return Math.floor((now - date) / 86400000);
}

function validateEntity({ path, data }) {
  if (!data) return;
  requireString(data, path, 'id');
  if (data.id && !ID_PATTERNS.entity.test(data.id)) error(path, 'id must match apidep_entity_000001');
  requireString(data, path, 'slug');
  if (data.slug && !SLUG_RE.test(data.slug)) error(path, 'slug must be lowercase kebab-case');
  requireString(data, path, 'canonical_name');
  requireArray(data, path, 'aliases');
  requireString(data, path, 'provider');
  if (data.provider_id !== undefined && data.provider_id !== null && !ID_PATTERNS.provider.test(data.provider_id)) error(path, 'provider_id must match apidep_provider_000001');
  requireEnum(data, path, 'category', ENUMS.category);
  requireEnum(data, path, 'record_unit', ENUMS.record_unit);
  requireEnum(data, path, 'status', ENUMS.status);
  requireEnum(data, path, 'deprecation_stage', ENUMS.deprecation_stage);
  requireEnum(data, path, 'deadline_status', ENUMS.deadline_status);
  requireEnum(data, path, 'still_usable', ENUMS.still_usable);
  requireEnum(data, path, 'action_required', ENUMS.action_required);
  requireEnum(data, path, 'impact_level', ENUMS.risk);
  requireEnum(data, path, 'production_risk', ENUMS.risk);
  requireEnum(data, path, 'freshness_status', ENUMS.freshness_status);
  requireString(data, path, 'summary');
  requireString(data, path, 'current_state');
  requireArray(data, path, 'affected_surface');
  checkArrayEnums(data, path, 'affected_surface', ENUMS.affected_surface);
  requireArray(data, path, 'affected_users');
  optionalUri(data, path, 'official_url');
  optionalUri(data, path, 'docs_url');
  optionalUri(data, path, 'migration_url');
  requireEnum(data, path, 'replacement_type', ENUMS.replacement_type);
  optionalUri(data, path, 'replacement_url');
  requireEnum(data, path, 'source_status', ENUMS.source_status);
  requireEnum(data, path, 'confidence', ENUMS.reliability);
  ['announced_at', 'deprecated_at', 'sunset_at', 'last_supported_at', 'removal_effective_at', 'migration_deadline_at', 'first_seen_at', 'next_check_recommended_at'].forEach((field) => optionalDate(data, path, field));
  requireDate(data, path, 'last_checked_at');
  requireArray(data, path, 'known_unknowns');
  requireArray(data, path, 'related_records');

  if (data.status === 'removed' && data.still_usable === 'yes') {
    error(path, 'removed records cannot have still_usable=yes');
  }
  if (data.status === 'removed' && !data.removal_effective_at) {
    error(path, 'removed records must include removal_effective_at');
  }
  if (data.still_usable === 'no' && !data.removal_effective_at && !data.still_usable_note) {
    error(path, 'still_usable=no requires removal_effective_at or still_usable_note');
  }
  if (data.deadline_status === 'upcoming') {
    const deadline = data.migration_deadline_at || data.sunset_at || data.removal_effective_at;
    if (!deadline) error(path, 'deadline_status=upcoming requires migration_deadline_at, sunset_at, or removal_effective_at');
    if (deadline && new Date(`${deadline}T00:00:00Z`) <= new Date()) error(path, 'deadline_status=upcoming uses a past or current deadline');
  }
  if (data.deadline_status === 'passed_removed' && !data.removal_effective_at) {
    error(path, 'deadline_status=passed_removed requires removal_effective_at');
  }
  if (isDate(data.last_checked_at)) {
    const age = daysSince(data.last_checked_at);
    if (age > 90 && data.freshness_status !== 'stale') warn(path, 'last_checked_at is 91+ days old; freshness_status should usually be stale');
    if (age >= 61 && age <= 90 && data.freshness_status === 'fresh') warn(path, 'last_checked_at is 61-90 days old; freshness_status should usually be watch');
  }
}

function validateEvent({ path, data }, entityIds, evidenceIds) {
  if (!data) return;
  requireString(data, path, 'id');
  if (data.id && !ID_PATTERNS.event.test(data.id)) error(path, 'id must match apidep_event_000001');
  requireString(data, path, 'entity_id');
  if (data.entity_id && !entityIds.has(data.entity_id)) error(path, `entity_id references missing entity: ${data.entity_id}`);
  requireEnum(data, path, 'type', ENUMS.event_type);
  requireDate(data, path, 'date');
  requireString(data, path, 'title');
  requireString(data, path, 'summary');
  requireArray(data, path, 'affected_versions');
  requireArray(data, path, 'affected_endpoints');
  requireArray(data, path, 'affected_sdks');
  requireArray(data, path, 'affected_surface');
  checkArrayEnums(data, path, 'affected_surface', ENUMS.affected_surface);
  optionalDate(data, path, 'deadline');
  optionalDate(data, path, 'removal_date');
  optionalUri(data, path, 'replacement_url');
  if (data.replacement_type !== undefined && data.replacement_type !== null && !ENUMS.replacement_type.has(data.replacement_type)) error(path, `replacement_type has invalid value: ${data.replacement_type}`);
  requireEnum(data, path, 'action_required', ENUMS.action_required);
  requireString(data, path, 'user_impact');
  requireEnum(data, path, 'impact_level', ENUMS.risk);
  requireEnum(data, path, 'production_risk', ENUMS.risk);
  requireArray(data, path, 'evidence_ids');
  if (Array.isArray(data.evidence_ids)) {
    if (data.evidence_ids.length === 0) error(path, 'event must include at least one evidence_id');
    for (const id of data.evidence_ids) {
      if (!evidenceIds.has(id)) error(path, `evidence_ids references missing evidence: ${id}`);
    }
  }
  requireEnum(data, path, 'confidence', ENUMS.reliability);
  if (isDate(data.deadline) && isDate(data.date) && new Date(data.deadline) < new Date(data.date)) error(path, 'deadline cannot be before event date');
  if (isDate(data.removal_date) && isDate(data.date) && new Date(data.removal_date) < new Date(data.date)) error(path, 'removal_date cannot be before event date');
}

function validateEvidence({ path, data }, entityIds, eventIds) {
  if (!data) return;
  requireString(data, path, 'id');
  if (data.id && !ID_PATTERNS.evidence.test(data.id)) error(path, 'id must match apidep_evidence_000001');
  requireString(data, path, 'entity_id');
  if (data.entity_id && !entityIds.has(data.entity_id)) error(path, `entity_id references missing entity: ${data.entity_id}`);
  if ('event_id' in data && data.event_id !== null && !eventIds.has(data.event_id)) error(path, `event_id references missing event: ${data.event_id}`);
  requireEnum(data, path, 'type', ENUMS.evidence_type);
  requireString(data, path, 'url');
  optionalUri(data, path, 'url');
  requireString(data, path, 'title');
  requireString(data, path, 'publisher');
  optionalDate(data, path, 'published_at');
  optionalUri(data, path, 'archived_url');
  requireString(data, path, 'quote_or_summary');
  requireEnum(data, path, 'reliability', ENUMS.reliability);
  requireEnum(data, path, 'claim_scope', ENUMS.claim_scope);
  requireDate(data, path, 'last_checked_at');
  if (typeof data.is_primary !== 'boolean') error(path, 'is_primary must be boolean');
  if (typeof data.is_official_domain !== 'boolean') error(path, 'is_official_domain must be boolean');
}

function validateProvider({ path, data }) {
  if (!data) return;
  requireString(data, path, 'id');
  if (data.id && !ID_PATTERNS.provider.test(data.id)) error(path, 'id must match apidep_provider_000001');
  requireString(data, path, 'slug');
  if (data.slug && !SLUG_RE.test(data.slug)) error(path, 'slug must be lowercase kebab-case');
  requireString(data, path, 'name');
  requireArray(data, path, 'aliases');
  requireArray(data, path, 'categories');
  checkArrayEnums(data, path, 'categories', ENUMS.category);
  optionalUri(data, path, 'official_url');
  optionalUri(data, path, 'developer_url');
  optionalUri(data, path, 'docs_url');
  optionalUri(data, path, 'changelog_url');
  requireString(data, path, 'summary');
  requireDate(data, path, 'last_checked_at');
}

const entities = readJsonFiles(DATA_DIRS.entities);
const events = readJsonFiles(DATA_DIRS.events);
const evidence = readJsonFiles(DATA_DIRS.evidence);
const providers = readJsonFiles(DATA_DIRS.providers);

checkDuplicate(entities, 'id', 'entity id');
checkDuplicate(entities, 'slug', 'entity slug');
checkDuplicate(events, 'id', 'event id');
checkDuplicate(evidence, 'id', 'evidence id');
checkDuplicate(providers, 'id', 'provider id');
checkDuplicate(providers, 'slug', 'provider slug');

const entityIds = new Set(entities.map((r) => r.data?.id).filter(Boolean));
const eventIds = new Set(events.map((r) => r.data?.id).filter(Boolean));
const evidenceIds = new Set(evidence.map((r) => r.data?.id).filter(Boolean));

for (const record of entities) validateEntity(record);
for (const record of providers) validateProvider(record);
for (const record of evidence) validateEvidence(record, entityIds, eventIds);
for (const record of events) validateEvent(record, entityIds, evidenceIds);

if (warnings.length) {
  console.warn('Validation warnings:');
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (errors.length) {
  console.error('Validation failed:');
  for (const err of errors) console.error(`- ${err}`);
  process.exit(1);
}

console.log(`Validation passed: ${entities.length} entities, ${events.length} events, ${evidence.length} evidence items, ${providers.length} providers.`);
