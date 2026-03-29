/**
 * renderer.js - Restore & Design Fix
 */

window.startAppCloud = function() {
    const root = document.getElementById('root');
    if (!root) return;

    root.innerHTML = `
        <div id="wrapper" class="d-flex">
            <aside id="sidebar-wrapper">
                <div class="p-4 border-bottom border-secondary text-center">
                    <h2 class="fw-bold text-white mb-0">NN Werkbänke</h2>
                    <small class="text-success" style="font-size: 0.7rem;">● Cloud-Sync aktiv</small>
                </div>
                <div class="p-3">
                    <div class="input-group">
                        <span class="input-group-text bg-dark border-secondary text-muted"><i class="bi bi-search"></i></span>
                        <input type="text" id="suche" class="form-control" placeholder="Suchen...">
                    </div>
                </div>
                <nav id="sidebar-content" class="flex-grow-1 overflow-auto px-3 py-2"></nav>
            </aside>

            <div id="page-content-wrapper" class="flex-grow-1 d-flex flex-column">
                <header class="navbar border-bottom border-secondary p-3">
                    <span id="header-title" class="text-muted small fw-bold text-uppercase">ÜBERSICHT</span>
                </header>
                <main id="item-details-view" class="container-fluid p-5 overflow-auto">
                    <div class="text-center mt-5 opacity-25 fade-in">
                        <i class="bi bi-tools display-1 text-white"></i>
                        <h3 class="text-white mt-3">Werkbank bereit</h3>
                    </div>
                </main>
            </div>
        </div>
    `;

    // Suche Filter
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

    document.getElementById('header-title').innerText = item.cat;

    const herstellungHtml = item.herstellung ? Object.entries(item.herstellung).map(([name, menge]) => `
        <div class="material-item">
            <span><i class="bi bi-box-seam me-2 opacity-50"></i>${name}</span>
            <span class="fw-bold text-white">x${menge}</span>
        </div>
    `).join('') : '<p class="text-muted p-3">Basis-Material (Kein Rezept)</p>';

    const rewardsHtml = item.rewards ? Object.entries(item.rewards).map(([name, menge]) => `
        <span class="reward-tag">${menge}x ${name}</span>
    `).join('') : '<span class="text-muted">-</span>';

    view.innerHTML = `
        <div class="fade-in">
            <div class="text-info fw-bold small text-uppercase mb-1">${item.cat}</div>
            <h1 class="display-5 fw-bold text-white mb-4">${item.item}</h1>

            <div class="row g-4">
                <div class="col-md-7">
                    <div class="card detail-card p-4">
                        <h5 class="mb-4 text-muted small fw-bold"><i class="bi bi-hammer me-2"></i>HERSTELLUNG</h5>
                        <div class="material-list">${herstellungHtml}</div>
                    </div>
                </div>
                <div class="col-md-5">
                    <div class="card detail-card p-4">
                        <h5 class="mb-4 text-muted small fw-bold"><i class="bi bi-info-circle me-2"></i>INFORMATIONEN</h5>
                        <div class="mb-3 d-flex justify-content-between">
                            <span class="text-muted">Herstellungszeit:</span>
                            <span class="text-white">${item.herstellzeit || 0}s</span>
                        </div>
                        <div class="mb-3 d-flex justify-content-between">
                            <span class="text-muted">Blueprint benötigt:</span>
                            <span class="${item.blueprint ? 'text-success' : 'text-danger'} fw-bold">
                                ${item.blueprint ? '<i class="bi bi-check-circle-fill"></i> JA' : '<i class="bi bi-x-circle"></i> NEIN'}
                            </span>
                        </div>
                        <div class="mb-4 d-flex justify-content-between">
                            <span class="text-muted">XP Belohnung:</span>
                            <span class="text-info fw-bold">${item.xp || 0}</span>
                        </div>
                        <div class="mt-4 border-top border-secondary pt-3">
                            <div class="text-muted small fw-bold mb-2">ERGEBNIS / REWARDS:</div>
                            <div class="reward-container">${rewardsHtml}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};
