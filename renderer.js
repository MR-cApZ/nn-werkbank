window.startAppCloud = function() {
    const root = document.getElementById('root');
    if (!root) return;

    root.innerHTML = `
        <div id="wrapper" class="d-flex" style="height: 100vh;">
            <aside id="sidebar-wrapper" class="border-end border-secondary d-flex flex-column" style="width: 280px; background: var(--sidebar-bg);">
                <div class="p-4 border-bottom border-secondary text-center">
                    <h2 class="fw-bold text-white mb-0">NN Werkbänke</h2>
                    <small class="text-success" style="font-size: 0.7rem;">● Cloud-Sync aktiv</small>
                </div>
                <div class="p-3">
                    <input type="text" id="suche" class="form-control bg-dark border-secondary text-white" placeholder="Suchen...">
                </div>
                <nav id="sidebar-content" class="flex-grow-1 overflow-auto px-3"></nav>
            </aside>

            <div id="page-content-wrapper" class="flex-grow-1 d-flex flex-column">
                <header class="navbar border-bottom border-secondary p-3">
                    <span id="header-title" class="text-muted small fw-bold">ÜBERSICHT</span>
                </header>
                <main id="item-details-view" class="container-fluid p-5 overflow-auto"></main>
            </div>
        </div>
    `;

    if (window.MASTER_DB) baueSeitenleiste();
    
    // Suchfunktion
    document.getElementById('suche').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('.tree-list li').forEach(li => {
            li.style.display = li.textContent.toLowerCase().includes(term) ? 'block' : 'none';
        });
    });
};

function baueSeitenleiste() {
    const container = document.getElementById('sidebar-content');
    const kategorien = [...new Set(window.MASTER_DB.map(item => item.cat))];

    container.innerHTML = kategorien.map(kat => `
        <div class="tree-section">
            <div class="tree-category-title">${kat} <i class="bi bi-chevron-down small"></i></div>
            <ul class="tree-list">
                ${window.MASTER_DB.filter(i => i.cat === kat).map(item => `
                    <li><a href="#" onclick="zeigeDetailsCloud('${item.item.replace(/'/g, "\\'")}')">${item.item}</a></li>
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

    // Herstellung Liste mit Icons
    const herstellungHtml = item.herstellung ? Object.entries(item.herstellung).map(([name, menge]) => `
        <div class="d-flex justify-content-between align-items-center border-bottom border-secondary py-2">
            <span><i class="bi bi-box-seam me-2 opacity-50"></i>${name}</span>
            <span class="fw-bold">x${menge}</span>
        </div>
    `).join('') : '<p class="text-muted">Basis-Material</p>';

    // Belohnungen
    const rewardsHtml = item.rewards ? Object.entries(item.rewards).map(([name, menge]) => `
        <div class="reward-tag">${menge}x ${name}</div>
    `).join('') : '-';

    view.innerHTML = `
        <div class="fade-in">
            <div class="small text-info fw-bold mb-1">${item.cat.toUpperCase()}</div>
            <h1 class="display-4 fw-bold text-white mb-4">${item.item}</h1>
            
            <div class="row g-4">
                <div class="col-md-7">
                    <div class="card detail-card p-4 shadow-sm">
                        <h5 class="text-muted mb-4 text-uppercase small" style="letter-spacing:1px;"><i class="bi bi-hammer me-2"></i>Herstellung</h5>
                        ${herstellungHtml}
                    </div>
                </div>
                <div class="col-md-5">
                    <div class="card detail-card p-4 shadow-sm">
                        <h5 class="text-muted mb-4 text-uppercase small" style="letter-spacing:1px;"><i class="bi bi-bar-chart me-2"></i>Informationen</h5>
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted">Herstellungszeit:</span>
                            <span>${item.herstellzeit || 0}s</span>
                        </div>
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted">Blueprint benötigt:</span>
                            <span class="${item.blueprint ? 'text-success' : 'text-danger'} fw-bold">
                                ${item.blueprint ? '<i class="bi bi-check-circle"></i> JA' : '<i class="bi bi-x-circle"></i> NEIN'}
                            </span>
                        </div>
                        <div class="d-flex justify-content-between mb-4">
                            <span class="text-muted">XP Belohnung:</span>
                            <span class="text-info fw-bold">${item.xp || 0}</span>
                        </div>
                        <div class="border-top border-secondary pt-3">
                            <div class="text-muted small text-uppercase mb-2">Ergebnis / Rewards:</div>
                            ${rewardsHtml}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};
