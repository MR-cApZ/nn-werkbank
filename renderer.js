window.startAppCloud = function() {
    const root = document.getElementById('root');
    if (!root) return;

    root.innerHTML = `
        <div id="wrapper" class="d-flex" style="height: 100vh;">
            <aside id="sidebar-wrapper" class="d-flex flex-column">
                <div class="p-4 border-bottom border-secondary">
                    <h4 class="fw-bold mb-0">NN Werkbänke</h4>
                    <span class="text-success small">● Cloud-Sync OK</span>
                </div>
                <div class="p-3">
                    <input type="text" id="suche" class="form-control shadow-none" placeholder="Suchen...">
                </div>
                <nav id="sidebar-content" class="flex-grow-1 overflow-auto px-2 pb-4"></nav>
            </aside>

            <main id="page-content-wrapper" class="flex-grow-1 d-flex flex-column">
                <header class="p-3 border-bottom border-secondary">
                    <small id="header-breadcrumb" class="text-secondary fw-bold text-uppercase"></small>
                </header>
                <div id="item-details-view" class="container-fluid p-5 overflow-auto">
                    <div class="text-center opacity-25 mt-5">
                        <i class="bi bi-cpu display-1"></i>
                        <p class="mt-3">Wähle ein Element aus der Liste</p>
                    </div>
                </div>
            </main>
        </div>
    `;

    if (window.MASTER_DB) baueSeitenleiste();
};

function baueSeitenleiste() {
    const container = document.getElementById('sidebar-content');
    const kategorien = [...new Set(window.MASTER_DB.map(item => item.cat))];

    container.innerHTML = kategorien.map(kat => `
        <div class="tree-category-title">${kat}</div>
        <ul class="tree-list">
            ${window.MASTER_DB.filter(i => i.cat === kat).map(item => `
                <li><a href="#" onclick="zeigeDetailsCloud('${item.item.replace(/'/g, "\\'")}')">${item.item}</a></li>
            `).join('')}
        </ul>
    `).join('');
}

window.zeigeDetailsCloud = function(itemName) {
    const item = window.MASTER_DB.find(i => i.item === itemName);
    if (!item) return;

    document.getElementById('header-breadcrumb').innerText = item.cat;
    const view = document.getElementById('item-details-view');

    const herstellungHtml = item.herstellung ? Object.entries(item.herstellung).map(([name, menge]) => `
        <div class="material-row">
            <span><i class="bi bi-box-seam me-2 opacity-50"></i>${name}</span>
            <span class="fw-bold">x${menge}</span>
        </div>
    `).join('') : '<p class="text-secondary">Basis-Material</p>';

    view.innerHTML = `
        <div class="animate-fade">
            <h1 class="display-4 fw-bold mb-4">${item.item}</h1>
            <div class="row g-4">
                <div class="col-md-7">
                    <div class="card detail-card p-4">
                        <h6 class="text-secondary text-uppercase mb-4">Herstellung</h6>
                        ${herstellungHtml}
                    </div>
                </div>
                <div class="col-md-5">
                    <div class="card detail-card p-4">
                        <h6 class="text-secondary text-uppercase mb-4">Infos</h6>
                        <div class="d-flex justify-content-between mb-3">
                            <span class="text-secondary">Zeit:</span>
                            <span>${item.herstellzeit || 0}s</span>
                        </div>
                        <div class="d-flex justify-content-between mb-3">
                            <span class="text-secondary">XP:</span>
                            <span class="text-accent fw-bold">${item.xp || 0}</span>
                        </div>
                        <div class="border-top border-secondary pt-3 mt-3">
                            <small class="text-secondary d-block mb-2">ERGEBNIS:</small>
                            ${Object.entries(item.rewards || {}).map(([name, m]) => `<div>${m}x ${name}</div>`).join('') || '-'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};
