const groups = [
  ['upcoming', 'Upcoming'],
  ['passed_unverified', 'Deadline passed, not re-verified'],
  ['passed_removed', 'Deadline passed and removed'],
  ['extended', 'Extended'],
  ['unknown', 'Deadline unknown'],
  ['no_deadline', 'No deadline']
];

const groupEl = document.querySelector('#deadline-groups');
const countEl = document.querySelector('#deadline-count');

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function text(value) {
  return String(value || '').replace(/_/g, ' ');
}

function renderRecord(record) {
  return `
    <article class="deadline-card">
      <div>
        <h3><a href="../apis/${escapeHtml(record.slug)}/">${escapeHtml(record.name)}</a></h3>
        <p class="muted">${escapeHtml(record.provider)} · ${escapeHtml(record.category)}</p>
      </div>
      <dl>
        <dt>Status</dt><dd>${escapeHtml(text(record.stage))}</dd>
        <dt>Still usable</dt><dd>${escapeHtml(text(record.stillUsable))}</dd>
        <dt>Action</dt><dd>${escapeHtml(text(record.actionRequired))}</dd>
        <dt>Replacement</dt><dd>${escapeHtml(record.replacement || 'Unknown')}</dd>
        <dt>Risk</dt><dd>${escapeHtml(text(record.productionRisk))}</dd>
        <dt>Last checked</dt><dd>${escapeHtml(record.lastChecked)}</dd>
      </dl>
      <p><a href="${escapeHtml(record.evidenceUrl)}" target="_blank" rel="noopener noreferrer">Official source</a></p>
    </article>
  `;
}

function render(records) {
  countEl.textContent = `${records.length} records`;
  groupEl.innerHTML = groups.map(([key, label]) => {
    const items = records.filter((record) => record.deadlineStatus === key);
    return `
      <section class="deadline-section">
        <div class="deadline-heading">
          <h2>${escapeHtml(label)}</h2>
          <span class="badge">${items.length}</span>
        </div>
        ${items.length ? items.map(renderRecord).join('') : '<p class="muted">No records in this group.</p>'}
      </section>
    `;
  }).join('');
}

async function init() {
  try {
    const response = await fetch('../data/records.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const records = await response.json();
    render(records);
  } catch (error) {
    countEl.textContent = 'Unable to load records';
    groupEl.innerHTML = `<p class="detail-content">Unable to load records: ${escapeHtml(error.message)}</p>`;
  }
}

init();
