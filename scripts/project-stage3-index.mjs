import { readFileSync, writeFileSync } from 'node:fs';

const path = 'data/machine/index.json';
const index = JSON.parse(readFileSync(path, 'utf8'));

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, stableValue(value[key])])
    );
  }
  return value;
}

const records = index.records.map((record) => ({
  id: record.id,
  slug: record.slug,
  canonical_name: record.canonical_name,
  provider: record.provider,
  category: record.category,
  record_unit: record.record_unit,
  status: record.status,
  deprecation_stage: record.deprecation_stage,
  deadline_status: record.deadline_status,
  still_usable: record.still_usable,
  action_required: record.action_required,
  replacement: record.replacement ?? null,
  replacement_type: record.replacement_type,
  confidence: record.confidence,
  last_checked_at: record.last_checked_at,
  human_url: record.human_url,
  machine_url: record.machine_url
}));

const projected = {
  schema_version: index.schema_version,
  project_id: index.project_id,
  canonical_only: index.canonical_only,
  data_revision: index.data_revision,
  record_count: records.length,
  records
};

writeFileSync(path, `${JSON.stringify(stableValue(projected), null, 2)}\n`);
console.log(`Projected Stage 3 machine index: ${records.length} canonical records`);
