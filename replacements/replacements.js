const bodyEl = document.querySelector('#replacement-body');
const countEl = document.querySelector('#replacement-count');

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

function render(records) {
  const items = records.filter((record) => record.replacement && record.replacement !== 'Unknown');
  countEl.textContent = `${items.length} records`;
  if (!items.length) {
    bodyEl.innerHTML = '<tr><td colspan="8">No replacement records found.</td></tr>';
    return;
  }
  bodyEl.innerHTML = items.map((record) => `
    <tr>
      <td><strong>${escapeHtml(record.name)}</strong><br /><span class="muted">${escapeHtml(record.category)}</span></td>
      <td>${escapeHtml(record.provider)}</td>
      <td><span class="badge">${escapeHtml(text(record.stage))}</span></td>
      <td>${escapeHtml(record.replacement)}</td>
      <td>${escapeHtml(text(record.actionRequired))}</td>
      <td><span class="badge">${escapeHtml(text(record.productionRisk))}</span></td>
      <td><a href="../apis/${escapeHtml(record.slug)}/">View record</a></td>
      <td><a href="${escapeHtml(record.evidenceUrl)}" target="_blank" rel="noopener noreferrer">Official source</a></td>
    </tr>
  `).join('');
}

async function init() {
  try {
    const response = await fetch('../data/records.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    render(await response.json());
  } catch (error) {
    countEl.textContent = 'Unable to load records';
    bodyEl.innerHTML = `<tr><td colspan="8">Unable to load records: ${escapeHtml(error.message)}</td></tr>`;
  }
}

init();
