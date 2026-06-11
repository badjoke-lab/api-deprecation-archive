const listEl = document.querySelector('#provider-list');
const countEl = document.querySelector('#provider-count');

const providerPages = new Set([
  'google-ai',
  'firebase',
  'slack',
  'shopify',
  'kubernetes'
]);

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function providerSlug(provider) {
  return String(provider || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function groupByProvider(records) {
  const groups = new Map();
  for (const record of records) {
    if (!groups.has(record.provider)) groups.set(record.provider, []);
    groups.get(record.provider).push(record);
  }
  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
}

function providerHeading(provider) {
  const slug = providerSlug(provider);
  const name = escapeHtml(provider);
  return providerPages.has(slug) ? `<a href="${slug}/">${name}</a>` : name;
}

function render(records) {
  const groups = groupByProvider(records);
  countEl.textContent = `${groups.length} providers`;
  listEl.innerHTML = groups.map(([provider, items]) => {
    const removed = items.filter((record) => record.stage === 'removed').length;
    const highRisk = items.filter((record) => record.productionRisk === 'high' || record.productionRisk === 'critical').length;
    return `
      <article class="deadline-card">
        <div>
          <h3>${providerHeading(provider)}</h3>
          <p class="muted">${items.length} tracked record${items.length === 1 ? '' : 's'} · ${removed} removed · ${highRisk} high or critical risk</p>
        </div>
        <p>${items.map((record) => `<a class="badge" href="../apis/${escapeHtml(record.slug)}/">${escapeHtml(record.name)}</a>`).join(' ')}</p>
      </article>
    `;
  }).join('');
}

async function init() {
  try {
    const response = await fetch('../data/records.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    render(await response.json());
  } catch (error) {
    countEl.textContent = 'Unable to load providers';
    listEl.innerHTML = `<p class="detail-content">Unable to load providers: ${escapeHtml(error.message)}</p>`;
  }
}

init();
