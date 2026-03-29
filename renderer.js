window.startAppCloud = function() {
    const root = document.getElementById('root');
    if (!root) return;

    root.innerHTML = `
        <div id="wrapper">
            <aside id="sidebar-wrapper">
                <div class="p-4 border-bottom border-secondary">
                    <h5 class="fw-bold mb-0 text-white">NN Werkbänke</h5>
                    <small class="text-success" style="font-size: 10px;">● Cloud-Sync aktiv</small>
                </div>
                <div class="p-3">
                    <input type="text" id="suche" class="form-control form-control-sm bg-dark border-secondary text-white shadow-none" placeholder="Suchen...">
                </div>
                <nav id="sidebar-content"></nav>
            </aside>

            <div id="page-content-wrapper" style="flex-grow: 1; overflow-y: auto;">
                <header class="p-3 border-bottom border-secondary sticky-top bg-dark bg-opacity-75" style="backdrop-filter: blur(10px);">
                    <small id="header-breadcrumb" class="text-muted fw-bold text-uppercase"></small>
                </header>
                <main id="item-details-view" class="p-5"></main>
            </div>
        </div>
    `;

    if (window.MASTER_DB) baueSeitenleiste();
    setupSuche();
};

function baueSeitenleiste() {
    const container = document.getElementById('sidebar-content');
    container.innerHTML = '';

    const kategorien = [...new Set(window.MASTER_DB.map(item => item.cat))];

    kategorien.forEach((kat, index) => {
        // Erzeuge eine saubere ID für Bootstrap Collapse
        const catId = `collapse-cat-${index}`;
        const itemsInCat = window.MASTER_DB.filter(i => i.cat === kat);

        const section = document.createElement('div');
        section.className = 'tree-section mb-1';
        section.innerHTML = `
            <div class="tree-category-title" data-bs-toggle="collapse" data-bs-target="#${catId}" aria-expanded="true">
                <span>${kat}</span>
                <i class="bi bi-chevron-down small transition-icon"></i>
            </div>
            <div class="collapse show" id="${catId}">
                <ul class="tree-list">
                    ${itemsInCat.map(item => `
                        <li><a href="javascript:void(0)" onclick="zeigeDetails('${item.item.replace(/'/g, "\\'")}')">${item.item}</a></li>
                    `).join('')}
                </ul>
            </div>
        `;
        container.appendChild(section);
    });
}

window.zeigeDetails = function(itemName) {
    const item = window.MASTER_DB.find(i => i.item === itemName);
    const view = document.getElementById('item-details-view');
    if (!item) return;

    document.getElementById('header-breadcrumb').innerText = item.cat;

    const herstellungHtml = item.herstellung ? Object.entries(item.herstellung).map(([name, menge]) => `
        <div class="d-flex justify-content-between py-2 border-bottom border-secondary border-opacity-25">
            <span class="text-white"><i class="bi bi-box-seam me-2"></i>${name}</span>
            <span class="fw-bold text-white">x${menge}</span>
        </div>
    `).join('') : '<p class="text-muted">Basis-Material</p>';

    view.innerHTML = `
        <div class="fade-in">
            <h1 class="display-4 fw-bold text-white mb-5">${item.item}</h1>
            <div class="row g-4">
                <div class="col-md-7">
                    <div class="card detail-card p-4 h-100">
                        <h6 class="text-accent text-uppercase mb-4">Herstellung</h6>
                        ${herstellungHtml}
                    </div>
                </div>
                <div class="col-md-5">
                    <div class="card detail-card p-4 h-100">
                        <h6 class="text-accent text-uppercase mb-4">Informationen</h6>
                        <div class="mb-3 d-flex justify-content-between">
                            <span class="text-white">Zeit:</span>
                            <span class="text-white">${item.herstellzeit || 0}s</span>
                        </div>
                        <div class="mb-3 d-flex justify-content-between">
                            <span class="text-white">XP:</span>
                            <span class="text-white fw-bold">${item.xp || 0}</span>
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
        document.querySelectorAll('.tree-section').forEach(section => {
            const items = section.querySelectorAll('li');
            let hasVisible = false;
            items.forEach(li => {
                const isMatch = li.textContent.toLowerCase().includes(term);
                li.style.display = isMatch ? 'block' : 'none';
                if (isMatch) hasVisible = true;
            });
            section.style.display = hasVisible ? 'block' : 'none';
        });
    });
}
