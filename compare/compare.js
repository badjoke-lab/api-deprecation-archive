const params = new URLSearchParams(window.location.search);
const els = {
  a: document.querySelector('#record-a'),
  b: document.querySelector('#record-b'),
  headingA: document.querySelector('#heading-a'),
  headingB: document.querySelector('#heading-b'),
  body: document.querySelector('#compare-body'),
  note: document.querySelector('#compare-note')
};

const state = {
  index: null,
  dossiers: new Map(),
  selectedA: params.get('a') || '',
  selectedB: params.get('b') || ''
};

function escapeHtml(value) {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}
function text(value) { return value === null || value === undefined || value === '' ? 'Unknown' : String(value).replaceAll('_', ' '); }
function dateToMs(value) { if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null; const parsed = Date.parse(`${value}T00:00:00Z`); return Number.isNaN(parsed) ? null : parsed; }
function migrationWindow(entity) { const start = entity.deprecated_at || entity.announced_at || null; const end = entity.migration_deadline_at || entity.removal_effective_at || entity.sunset_at || null; const startMs = dateToMs(start); const endMs = dateToMs(end); if (startMs === null || endMs === null || endMs < startMs) return { start, end, days: null }; return { start, end, days: Math.round((endMs - startMs) / 86400000) }; }
function evidenceSummary(dossier) { const primary = dossier.evidence.filter((item) => item.is_primary === true); const high = dossier.evidence.filter((item) => item.reliability === 'high'); return `${dossier.evidence.length} total · ${primary.length} primary · ${high.length} high reliability`; }
function eventSummary(dossier) { if (!dossier.events.length) return 'No dated canonical lifecycle event'; return dossier.events.map((event) => `${event.date} · ${text(event.type)} · ${event.title}`).join(' | '); }
function unknownSummary(entity) { if (!Array.isArray(entity.known_unknowns) || !entity.known_unknowns.length) return 'None recorded'; return entity.known_unknowns.join(' | '); }
function sourceLink(dossier) { const source = dossier.evidence.find((item) => item.is_primary === true) || dossier.evidence[0]; if (!source?.url) return 'Unknown'; return `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.publisher || 'Primary evidence')}</a>`; }
function machineLink(dossier) { const url = dossier.urls?.machine; return url ? `<a href="${escapeHtml(url)}">Machine dossier</a>` : 'Unknown'; }
function row(label, valueA, valueB, raw = false) { const a = raw ? valueA : escapeHtml(text(valueA)); const b = raw ? valueB : escapeHtml(text(valueB)); return `<tr><th scope="row">${escapeHtml(label)}</th><td>${a}</td><td>${b}</td></tr>`; }

function compareRows(a, b) {
  const ea = a.entity; const eb = b.entity; const wa = migrationWindow(ea); const wb = migrationWindow(eb);
  return [
    row('Provider', ea.provider, eb.provider), row('Record unit', ea.record_unit, eb.record_unit), row('Status', ea.status, eb.status), row('Lifecycle stage', ea.deprecation_stage, eb.deprecation_stage), row('Still usable', ea.still_usable, eb.still_usable), row('Required action', ea.action_required, eb.action_required), row('Production risk', ea.production_risk, eb.production_risk), row('Confidence', ea.confidence, eb.confidence), row('Freshness', ea.freshness_status, eb.freshness_status), row('Announced', ea.announced_at, eb.announced_at), row('Deprecated', ea.deprecated_at, eb.deprecated_at), row('Sunset', ea.sunset_at, eb.sunset_at), row('Removal effective', ea.removal_effective_at, eb.removal_effective_at), row('Migration deadline', ea.migration_deadline_at, eb.migration_deadline_at), row('Replacement', ea.replacement, eb.replacement), row('Replacement type', ea.replacement_type, eb.replacement_type), row('Migration window start', wa.start, wb.start), row('Migration window end', wa.end, wb.end), row('Migration window length', wa.days === null ? 'Unknown' : `${wa.days} days`, wb.days === null ? 'Unknown' : `${wb.days} days`), row('Lifecycle events', eventSummary(a), eventSummary(b)), row('Evidence coverage', evidenceSummary(a), evidenceSummary(b)), row('Known unknowns', unknownSummary(ea), unknownSummary(eb)), row('Last checked', ea.last_checked_at, eb.last_checked_at), row('Primary evidence', sourceLink(a), sourceLink(b), true), row('Machine data', machineLink(a), machineLink(b), true)
  ].join('');
}

function syncUrl() { const url = new URL(window.location.href); if (state.selectedA) url.searchParams.set('a', state.selectedA); else url.searchParams.delete('a'); if (state.selectedB) url.searchParams.set('b', state.selectedB); else url.searchParams.delete('b'); window.history.replaceState({}, '', url); }
async function loadDossier(slug) { if (state.dossiers.has(slug)) return state.dossiers.get(slug); const item = state.index.records.find((record) => record.slug === slug); if (!item) throw new Error(`Unknown canonical slug: ${slug}`); const response = await fetch(item.machine_url, { cache: 'no-store' }); if (!response.ok) throw new Error(`${slug}: dossier HTTP ${response.status}`); const dossier = await response.json(); if (dossier.canonical_only !== true) throw new Error(`${slug}: dossier is not canonical-only`); if (dossier.data_revision !== state.index.data_revision) throw new Error(`${slug}: data revision mismatch`); if (dossier.entity?.slug !== slug) throw new Error(`${slug}: dossier identity mismatch`); state.dossiers.set(slug, dossier); return dossier; }
async function render() { syncUrl(); if (!state.selectedA || !state.selectedB) { els.headingA.textContent = state.selectedA || 'Record A'; els.headingB.textContent = state.selectedB || 'Record B'; els.body.innerHTML = '<tr><td colspan="3">Choose two canonical records to compare.</td></tr>'; return; } if (state.selectedA === state.selectedB) { els.body.innerHTML = '<tr><td colspan="3">Choose two different canonical records.</td></tr>'; return; } try { const [a, b] = await Promise.all([loadDossier(state.selectedA), loadDossier(state.selectedB)]); els.headingA.textContent = a.entity.canonical_name; els.headingB.textContent = b.entity.canonical_name; els.body.innerHTML = compareRows(a, b); } catch (error) { els.body.innerHTML = `<tr><td colspan="3">Unable to compare records: ${escapeHtml(error.message)}</td></tr>`; } }
function fillSelect(select) { for (const record of state.index.records) { const option = document.createElement('option'); option.value = record.slug; option.textContent = `${record.canonical_name} — ${record.provider}`; select.appendChild(option); } }
async function init() { try { const response = await fetch('/data/machine/index.json', { cache: 'no-store' }); if (!response.ok) throw new Error(`machine index HTTP ${response.status}`); state.index = await response.json(); if (state.index.canonical_only !== true) throw new Error('machine index is not canonical-only'); if (!Array.isArray(state.index.records) || state.index.record_count !== state.index.records.length) throw new Error('machine index count mismatch'); fillSelect(els.a); fillSelect(els.b); els.a.value = state.index.records.some((record) => record.slug === state.selectedA) ? state.selectedA : ''; els.b.value = state.index.records.some((record) => record.slug === state.selectedB) ? state.selectedB : ''; state.selectedA = els.a.value; state.selectedB = els.b.value; els.a.addEventListener('change', (event) => { state.selectedA = event.target.value; render(); }); els.b.addEventListener('change', (event) => { state.selectedB = event.target.value; render(); }); els.note.textContent = `${state.index.record_count} canonical records · revision ${state.index.data_revision.slice(0, 12)}…`; await render(); } catch (error) { els.note.textContent = 'Canonical machine layer unavailable'; els.body.innerHTML = `<tr><td colspan="3">Unable to load Compare: ${escapeHtml(error.message)}</td></tr>`; } }
init();
