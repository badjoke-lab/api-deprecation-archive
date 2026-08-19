import { readFileSync } from 'node:fs';

const origin = (process.env.API_DEP_ORIGIN ?? 'https://api-deprecation-archive.pages.dev').replace(/\/$/, '');
const attempts = Number(process.env.API_DEP_VERIFY_ATTEMPTS ?? '20');
const intervalMs = Number(process.env.API_DEP_VERIFY_INTERVAL_MS ?? '15000');
const expected = JSON.parse(readFileSync('version.json', 'utf8'));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function text(path) {
  const separator = path.includes('?') ? '&' : '?';
  const response = await fetch(`${origin}${path}${separator}verify=${expected.data_revision.slice(0,16)}`, { headers: { 'cache-control': 'no-cache' }, redirect: 'follow' });
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
  return response.text();
}

function requireIncludes(source, marker, label) {
  if (!source.includes(marker)) throw new Error(`${label}: missing ${JSON.stringify(marker)}`);
}
function requireExcludes(source, marker, label) {
  if (source.includes(marker)) throw new Error(`${label}: forbidden ${JSON.stringify(marker)}`);
}

async function verifyOnce() {
  const apiHtml = await text('/apis/');
  for (const marker of ['Provider', 'Lifecycle stage', 'Migration window', 'Boundary from', 'Boundary to', 'Clear filters', 'Canonical records']) {
    requireIncludes(apiHtml, marker, '/apis/');
  }
  const apiJs = await text('/apis/api-list.js');
  requireIncludes(apiJs, "fetch('/data/machine/index.json'", 'API list machine source');
  requireIncludes(apiJs, 'dossier.data_revision !== state.dataRevision', 'API list revision gate');
  requireExcludes(apiJs, 'data/records.json', 'API list display-manifest fallback');

  const compareHtml = await text('/compare/');
  for (const marker of ['Compare migration history, not vendors.', 'Record A', 'Record B', 'Lifecycle facts']) requireIncludes(compareHtml, marker, '/compare/');
  const compareJs = await text('/compare/compare.js');
  requireIncludes(compareJs, "fetch('/data/machine/index.json'", 'Compare machine source');
  requireIncludes(compareJs, 'dossier.data_revision !== state.index.data_revision', 'Compare revision gate');
  requireExcludes(compareJs, 'data/records.json', 'Compare display-manifest fallback');

  const statsHtml = await text('/stats/');
  for (const marker of ['Canonical Stats', 'Recorded migration-window coverage', 'Status and replacement coverage', 'Evidence, freshness, and date coverage']) requireIncludes(statsHtml, marker, '/stats/');
  const statsJs = await text('/stats/stats.js');
  requireIncludes(statsJs, "fetch('/data/machine/index.json'", 'Stats machine source');
  requireIncludes(statsJs, "meta-graph-api-older-versions", 'Stats Meta fail-close guard');
  requireExcludes(statsJs, 'data/records.json', 'Stats display-manifest fallback');

  const sitemap = await text('/sitemap.xml');
  for (const marker of ['/compare/</loc>', '/stats/</loc>', '/apis/slack-files-upload/</loc>', '/apis/shopify-rest-admin-api/</loc>']) requireIncludes(sitemap, marker, 'sitemap');

  const slack = await text('/apis/slack-files-upload/');
  for (const marker of ['Removed', '2025-11-12', '2026-08-20', 'files.getUploadURLExternal']) requireIncludes(slack, marker, 'Slack human page');

  const shopify = await text('/apis/shopify-rest-admin-api/');
  for (const marker of ['Universal removal deadline', 'Not recorded', '2026-08-20', 'GraphQL Admin API']) requireIncludes(shopify, marker, 'Shopify human page');

  return true;
}

let lastError;
for (let attempt = 1; attempt <= attempts; attempt += 1) {
  try {
    await verifyOnce();
    console.log('Phase 8 Stage 7 cross-surface production verification PASS');
    console.log(`origin=${origin}`);
    console.log(`data_revision=${expected.data_revision}`);
    console.log(`counts=${expected.record_counts.entities} entities / ${expected.record_counts.events} events / ${expected.record_counts.evidence} evidence`);
    process.exit(0);
  } catch (error) {
    lastError = error;
    console.error(`Attempt ${attempt}/${attempts} failed: ${error.message}`);
    if (attempt < attempts) await sleep(intervalMs);
  }
}
throw lastError;
