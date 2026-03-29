window.startAppCloud = function() {
    const root = document.getElementById('root');
    if (!root) return;

    root.innerHTML = `
        <div id="wrapper" class="d-flex">
            <aside id="sidebar-wrapper">
                <div class="p-4 border-bottom border-secondary text-center">
                    <h2 class="fw-bold text-white mb-0" style="letter-spacing: 1px;">NN Werkbänke</h2>
                    <small class="text-success" style="font-size: 0.7rem;">● Cloud-Sync OK</small>
                </div>
                <div class="p-3">
                    <div class="input-group">
                        <span class="input-group-text bg-dark border-secondary text-muted"><i class="bi bi-search"></i></span>
                        <input type="text" id="suche" class="form-control" placeholder="Suchen...">
                    </div>
                </div>
                <nav id="sidebar-content" class="flex-grow-1 overflow-auto py-2"></nav>
            </aside>

            <div id="page-content-wrapper" class="flex-grow-1 d-flex flex-column">
                <header class="navbar border-bottom border-secondary p-3">
                    <span id="header-title" class="text-muted small fw-bold">ÜBERSICHT</span>
                </header>
                <main id="item-details-view" class="container-fluid p-5 overflow-auto">
                    <div class="text-center mt-5 opacity-25 fade-in">
                        <i class="bi bi-cloud-check display-1 text-white"></i>
                        <h3 class="text-white mt-3">System bereit</h3>
                    </div>
                </main>
            </div>
        </div>
    `;

    document.getElementById('suche').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('.tree-list li').forEach(li => {
            li.style.display = li.textContent.toLowerCase().includes(term) ? 'block' : 'none';
        });
    });

    if (window.MASTER_DB) baueSeitenleiste();
};

function baueSeitenleiste() {
    const container = document.getElementById('sidebar-content');
    const kategorien = [...new Set(window.MASTER_DB.map(item => item.cat))];

    container.innerHTML = kategorien.map(kat => `
        <div class="tree-section mb-3">
            <div class="tree-category-title">${kat}</div>
            <ul class="tree-list">
                ${window.MASTER_DB.filter(i => i.cat === kat).map(item => `
                    <li><a href="javascript:void(0)" onclick="zeigeDetailsCloud('${item.item.replace(/'/g, "\\'")}')">${item.item}</a></li>
                `).join('')}
            </ul>
        </div>
    `).join('');
}

window.zeigeDetailsCloud = function(itemName) {
    const item = window.MASTER_DB.find(i => i.item === itemName);
    const view = document.getElementById('item-details-view');
    if (!item) return;

    document.getElementById('header-title').innerText = item.cat.toUpperCase();

    const herstellungHtml = item.herstellung ? Object.entries(item.herstellung).map(([name, menge]) => `
        <div class="material-item d-flex justify-content-between align-items-center">
            <span><i class="bi bi-box-seam me-2 opacity-50"></i>${name}</span>
            <span class="fw-bold text-info">x${menge}</span>
        </div>
    `).join('') : '<p class="text-muted py-3">Kein Rezept erforderlich.</p>';

    view.innerHTML = `
        <div class="fade-in">
            <div class="text-info fw-bold small mb-1" style="letter-spacing: 1px;">${item.cat.toUpperCase()}</div>
            <h1 class="display-4 fw-bold text-white mb-5">${item.item}</h1>

            <div class="row g-4">
                <div class="col-md-7">
                    <div class="card detail-card p-4">
                        <h5 class="mb-4 text-muted small fw-bold text-uppercase"><i class="bi bi-hammer me-2"></i>Herstellung</h5>
                        <div class="material-list">${herstellungHtml}</div>
                    </div>
                </div>
                <div class="col-md-5">
                    <div class="card detail-card p-4">
                        <h5 class="mb-4 text-muted small fw-bold text-uppercase"><i class="bi bi-info-circle me-2"></i>Informationen</h5>
                        <div class="d-flex justify-content-between mb-3">
                            <span class="text-muted">Herstellungszeit:</span>
                            <span class="fw-bold">${item.herstellzeit || 0}s</span>
                        </div>
                        <div class="d-flex justify-content-between mb-3">
                            <span class="text-muted">Blueprint benötigt:</span>
                            <span class="${item.blueprint ? 'text-success' : 'text-danger'} fw-bold">
                                ${item.blueprint ? 'JA' : 'NEIN'}
                            </span>
                        </div>
                        <div class="d-flex justify-content-between mb-4">
                            <span class="text-muted">XP Belohnung:</span>
                            <span class="text-info fw-bold">${item.xp || 0} XP</span>
                        </div>
                        <div class="border-top border-secondary pt-3">
                            <div class="text-muted small fw-bold mb-2 text-uppercase">Ergebnis / Rewards:</div>
                            ${Object.entries(item.rewards || {}).map(([name, m]) => `<div class="reward-tag">${m}x ${name}</div>`).join('') || '-'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};
