import { readFileSync } from 'node:fs';

const html = readFileSync('stats/index.html', 'utf8');
const script = readFileSync('stats/stats.js', 'utf8');
const home = readFileSync('index.html', 'utf8');
const sitemap = readFileSync('sitemap.xml', 'utf8');
const errors = [];
const requireText = (source, marker, label) => { if (!source.includes(marker)) errors.push(`${label}: missing ${marker}`); };

for (const id of ['stat-records','stat-events','stat-evidence','migration-window-body','status-stats','replacement-stats','event-stats','provider-body','confidence-stats','freshness-stats','date-stats','stats-note']) requireText(html, `id="${id}"`, 'Stats UI');
for (const marker of ["fetch('/data/machine/index.json'",'index.canonical_only !== true','meta-graph-api-older-versions','record.event_count','record.evidence_count','record.primary_evidence_count','record.deprecated_at || record.announced_at','record.migration_deadline_at || record.removal_effective_at || record.sunset_at','Provider counts are coverage counts, not rankings','does not manufacture a “reason” distribution']) requireText(script + html, marker, 'Stats contract');
requireText(home, 'href="stats/"', 'home Stats navigation');
requireText(sitemap, '/stats/</loc>', 'sitemap Stats route');
if (script.includes('data/records.json')) errors.push('Stats contract: display manifest must not be a data source');
for (const forbidden of ['winner','best provider','provider score']) if (script.toLowerCase().includes(forbidden)) errors.push(`Stats contract: ranking language found: ${forbidden}`);
if (errors.length) { console.error(`Stage 6 Stats contract failed with ${errors.length} error(s):`); for (const error of errors) console.error(`- ${error}`); process.exit(1); }
console.log('Stage 6 Stats contract passed');
