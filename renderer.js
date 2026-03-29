window.startAppCloud = function() {
    const root = document.getElementById('root');
    if (!root) return;

    root.innerHTML = `
        <div id="wrapper">
            <aside id="sidebar-wrapper">
                <div class="p-4 border-bottom border-secondary">
                    <h5 class="fw-bold mb-0 text-white">NN Werkbänke</h5>
                    <div class="d-flex align-items-center mt-1">
                        <span class="text-success me-2" style="font-size: 8px;">●</span>
                        <small class="text-muted" style="font-size: 10px;">Cloud-Interface aktiv</small>
                    </div>
                </div>
                
                <div class="px-3 py-3">
                    <input type="text" id="suche" class="form-control form-control-sm bg-dark border-secondary text-white shadow-none" placeholder="Suchen...">
                </div>

                <nav id="sidebar-content"></nav>
            </aside>

            <div id="page-content-wrapper">
                <header class="p-3 border-bottom border-secondary sticky-top bg-dark bg-opacity-75" style="backdrop-filter: blur(10px);">
                    <small id="header-breadcrumb" class="text-muted fw-bold text-uppercase" style="letter-spacing: 1px;"></small>
                </header>

                <main id="item-details-view" class="p-5">
                    <div class="text-center mt-5 opacity-25">
                        <i class="bi bi-layers display-1"></i>
                        <p class="mt-3">Wähle ein Item aus der Sidebar</p>
                    </div>
                </main>
            </div>
        </div>
    `;

    if (window.MASTER_DB) baueSeitenleiste();
    setupSuche();
};

function baueSeitenleiste() {
    const container = document.getElementById('sidebar-content');
    const kategorien = [...new Set(window.MASTER_DB.map(item => item.cat))];

    container.innerHTML = kategorien.map(kat => `
        <div class="tree-section mb-3">
            <div class="tree-category-title px-2">${kat}</div>
            <ul class="tree-list">
                ${window.MASTER_DB.filter(i => i.cat === kat).map(item => `
                    <li><a href="javascript:void(0)" onclick="zeigeDetails('${item.item.replace(/'/g, "\\'")}')">${item.item}</a></li>
                `).join('')}
            </ul>
        </div>
    `).join('');
}

window.zeigeDetails = function(itemName) {
    const item = window.MASTER_DB.find(i => i.item === itemName);
    if (!item) return;

    document.getElementById('header-breadcrumb').innerText = item.cat;
    const view = document.getElementById('item-details-view');

    const herstellungHtml = item.herstellung ? Object.entries(item.herstellung).map(([name, menge]) => `
        <div class="d-flex justify-content-between py-2 border-bottom border-secondary border-opacity-25">
            <span class="text-muted"><i class="bi bi-box-seam me-2"></i>${name}</span>
            <span class="fw-bold text-white">x${menge}</span>
        </div>
    `).join('') : '<p class="text-muted">Keine Materialien benötigt.</p>';

    view.innerHTML = `
        <div class="fade-in">
            <h1 class="display-4 fw-bold text-white mb-5">${item.item}</h1>
            
            <div class="row g-4">
                <div class="col-md-7">
                    <div class="card detail-card p-4">
                        <h6 class="text-accent text-uppercase mb-4">Herstellung</h6>
                        ${herstellungHtml}
                    </div>
                </div>
                <div class="col-md-5">
                    <div class="card detail-card p-4">
                        <h6 class="text-accent text-uppercase mb-4">Infos</h6>
                        <div class="d-flex justify-content-between mb-3">
                            <span class="text-muted">Herstellungszeit:</span>
                            <span class="text-white">${item.herstellzeit || 0}s</span>
                        </div>
                        <div class="d-flex justify-content-between mb-3">
                            <span class="text-muted">XP:</span>
                            <span class="text-white fw-bold">${item.xp || 0}</span>
                        </div>
                        <div class="mt-4 pt-3 border-top border-secondary">
                            <small class="text-muted d-block mb-2">REWARDS:</small>
                            <div class="d-flex flex-wrap gap-2">
                                ${Object.entries(item.rewards || {}).map(([n, m]) => `<span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25">${m}x ${n}</span>`).join('') || '-'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};

function setupSuche() {
    document.getElementById('suche').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('.tree-list li').forEach(li => {
            li.style.display = li.textContent.toLowerCase().includes(term) ? 'block' : 'none';
        });
    });
}
