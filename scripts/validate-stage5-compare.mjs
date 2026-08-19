import { readFileSync } from 'node:fs';

const html = readFileSync('compare/index.html', 'utf8');
const script = readFileSync('compare/compare.js', 'utf8');
const home = readFileSync('index.html', 'utf8');
const errors = [];

function requireText(source, marker, label) {
  if (!source.includes(marker)) errors.push(`${label}: missing ${marker}`);
}

for (const marker of [
  'id="record-a"',
  'id="record-b"',
  'id="compare-body"',
  'Compare migration history, not vendors.',
  'not a vendor ranking'
]) requireText(html, marker, 'Compare UI');

for (const marker of [
  "fetch('/data/machine/index.json'",
  'item.machine_url',
  'dossier.canonical_only !== true',
  'dossier.data_revision !== state.index.data_revision',
  'migration_deadline_at || entity.removal_effective_at || entity.sunset_at',
  "row('Known unknowns'",
  "row('Primary evidence'",
  "row('Machine data'",
  "url.searchParams.set('a'",
  "url.searchParams.set('b'"
]) requireText(script, marker, 'Compare contract');

requireText(home, 'href="compare/"', 'home Compare navigation');

if (script.includes('data/records.json')) errors.push('Compare contract: display manifest must not be a data source');
if (script.includes('meta-graph-api-older-versions')) errors.push('Compare contract: noncanonical Meta placeholder must not be hard-coded');
for (const forbidden of ['score', 'winner', 'best provider', 'recommended vendor']) {
  if (script.toLowerCase().includes(forbidden)) errors.push(`Compare contract: ranking language found: ${forbidden}`);
}

if (errors.length) {
  console.error(`Stage 5 Compare contract failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Stage 5 Compare contract passed');
