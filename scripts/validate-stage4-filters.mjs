import { readFileSync } from 'node:fs';

const html = readFileSync('apis/index.html', 'utf8');
const script = readFileSync('apis/api-list.js', 'utf8');
const errors = [];

function requireText(source, marker, label) {
  if (!source.includes(marker)) errors.push(`${label}: missing ${marker}`);
}

for (const id of [
  'search',
  'provider',
  'category',
  'status',
  'stage',
  'deadline',
  'usable',
  'action',
  'replacement',
  'risk',
  'freshness',
  'confidence',
  'event',
  'window',
  'boundary-from',
  'boundary-to',
  'clear-filters'
]) requireText(html, `id="${id}"`, 'filter UI');

for (const marker of [
  "fetch('/data/machine/index.json'",
  'indexRecord.machine_url',
  'dossier.canonical_only !== true',
  'dossier.data_revision !== state.dataRevision',
  'migration_deadline_at || entity.removal_effective_at || entity.sunset_at',
  'record.migrationWindowBucket',
  'record.eventTypes.includes',
  'record.productionRisk',
  'record.freshnessStatus',
  'record.replacementType',
  'record.deadlineStatus',
  'No canonical records match the current filters',
  'Display-only review placeholders are excluded'
]) requireText(script + html, marker, 'filter contract');

if (script.includes("fetch('../data/records.json')") || script.includes('data/records.json')) {
  errors.push('filter contract: display manifest must not be a Stage 4 data source');
}

if (script.includes('meta-graph-api-older-versions')) {
  errors.push('filter contract: Meta placeholder must not be hard-coded into canonical results');
}

if (errors.length) {
  console.error(`Stage 4 filter contract failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Stage 4 filter contract passed');
