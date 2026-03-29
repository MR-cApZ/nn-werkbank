/**
 * renderer.js - Finales Design & Logik Restore (Color Match Update)
 */

window.startAppCloud = function() {
    const root = document.getElementById('root');
    if (!root) return;

    root.innerHTML = `
        <div id="wrapper" class="d-flex" style="height: 100vh; overflow: hidden;">
            <aside id="sidebar-wrapper" class="border-end border-secondary d-flex flex-column">
                <div class="p-4 border-bottom border-secondary text-center">
                    <h2 class="fw-bold text-white mb-0" style="letter-spacing: 1px;">NN Werkbänke</h2>
                    <small style="color: #28a745; font-size: 0.7rem;">● Cloud-Sync aktiv</small>
                </div>
                
                <div class="p-3">
                    <div class="input-group search-container">
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
                        <p>Wähle links ein Element aus der Liste.</p>
                    </div>
                </main>
            </div>
        </div>
    `;

    const sucheInput = document.getElementById('suche');
    if (sucheInput) {
        sucheInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const sections = document.querySelectorAll('.tree-section');
            sections.forEach(section => {
                const items = section.querySelectorAll('li');
                let hasVisibleItems = false;
                items.forEach(li => {
                    const text = li.textContent.toLowerCase();
                    const visible = text.includes(term);
                    li.style.display = visible ? 'block' : 'none';
                    if (visible) hasVisibleItems = true;
                });
                section.style.display = hasVisibleItems ? 'block' : 'none';
            });
        });
    }

    if (window.MASTER_DB) baueSeitenleiste();
};

function baueSeitenleiste() {
    const container = document.getElementById('sidebar-content');
    if (!container) return;
    container.innerHTML = '';

    const kategorien = [...new Set(window.MASTER_DB.map(item => item.cat))];

    kategorien.forEach(kat => {
        const catId = `cat-${kat.replace(/\s/g, '')}`;
        const itemsInCat = window.MASTER_DB.filter(i => i.cat === kat);

        const section = document.createElement('div');
        section.className = 'tree-section mb-2';
        section.innerHTML = `
            <div class="tree-category-title px-2" data-bs-toggle="collapse" data-bs-target="#${catId}">
                <span>${kat}</span>
                <i class="bi bi-chevron-down small opacity-50"></i>
            </div>
            <div class="collapse show" id="${catId}">
                <ul class="tree-list">
                    ${itemsInCat.map(item => `
                        <li><a href="javascript:void(0)" onclick="zeigeDetailsCloud('${item.item.replace(/'/g, "\\'")}')">${item.item}</a></li>
                    `).join('')}
                </ul>
            </div>
        `;
        container.appendChild(section);
    });
}

window.zeigeDetailsCloud = function(itemName) {
    const item = window.MASTER_DB.find(i => i.item === itemName);
    const view = document.getElementById('item-details-view');
    if (!item || !view) return;

    const titleHeader = document.getElementById('header-title');
    if(titleHeader) titleHeader.innerText = item.cat + " / " + item.item;

    let herstellungHtml = "";
    if (item.herstellung) {
        herstellungHtml = Object.entries(item.herstellung).map(([name, menge]) => `
            <div class="d-flex justify-content-between border-bottom border-secondary py-2">
                <span><i class="bi bi-box-seam me-2 opacity-50"></i>${name}</span>
                <span class="fw-bold" style="color: var(--accent);">x${menge}</span>
            </div>
        `).join('');
    } else {
        herstellungHtml = `<p class="fst-italic p-3 rounded text-muted" style="background-color: rgba(0,0,0,0.2);">${item.desc || "Basis-Material (Kein Rezept verfügbar)"}</p>`;
    }

    function formatListe(obj) {
        if (!obj || Object.keys(obj).length === 0) return '<span class="text-muted small">Keine Belohnungen</span>';
        return Object.entries(obj)
            .map(([name, menge]) => `<span class="reward-tag">${menge}x ${name}</span>`)
            .join(' ');
    }

    const bpLabel = item.blueprint === true 
        ? '<span style="color: #28a745;" class="fw-bold"><i class="bi bi-check-circle-fill me-1"></i>JA</span>' 
        : '<span style="color: #dc3545;" class="fw-bold"><i class="bi bi-x-circle me-1"></i>NEIN</span>';

    view.innerHTML = `
        <div class="fade-in">
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb mb-1">
                <li class="breadcrumb-item small text-uppercase fw-bold" style="letter-spacing: 1px; color: var(--accent);">${item.cat}</li>
              </ol>
            </nav>
            <h1 class="display-5 fw-bold mb-4 text-white">${item.item}</h1>

            <div class="row g-4">
                <div class="col-md-7">
                    <div class="card detail-card p-4 h-100 shadow-sm">
                        <h5 class="mb-4 text-light border-bottom border-secondary pb-3">
                            <i class="bi bi-hammer me-2" style="color: var(--accent);"></i>HERSTELLUNG
                        </h5>
                        <div class="material-list">
                            ${herstellungHtml}
                        </div>
                    </div>
                </div>
                
                <div class="col-md-5">
                    <div class="card detail-card p-4 h-100 shadow-sm">
                        <h5 class="mb-4 text-light border-bottom border-secondary pb-3">
                            <i class="bi bi-bar-chart me-2" style="color: var(--accent);"></i>INFORMATIONEN
                        </h5>
                        
                        <div class="mb-3 d-flex justify-content-between align-items-center">
                            <span class="text-muted">Herstellungszeit:</span>
                            <span class="text-white fw-bold"><i class="bi bi-clock me-1 opacity-50"></i>${item.herstellzeit || 0}s</span>
                        </div>
                        <div class="mb-3 d-flex justify-content-between align-items-center">
                            <span class="text-muted">Blueprint benötigt:</span>
                            <span>${bpLabel}</span>
                        </div>
                        <div class="mb-4 d-flex justify-content-between align-items-center">
                            <span class="text-muted">XP Belohnung:</span>
                            <span class="badge fw-bold" style="font-size: 0.9rem; background-color: var(--accent); color: white;">${item.xp || 0} XP</span>
                        </div>
                        
                        <div class="mt-auto border-top border-secondary pt-3">
                            <div class="small mb-3 text-uppercase text-muted fw-bold" style="font-size: 0.7rem; letter-spacing: 0.5px;">Ergebnis / Rewards:</div>
                            <div class="d-flex flex-wrap gap-2">
                                ${formatListe(item.rewards)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};
