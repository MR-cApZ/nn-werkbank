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
    if (!item || !view) return;

    // Header Breadcrumb aktualisieren
    const headerTitle = document.getElementById('header-breadcrumb');
    if(headerTitle) headerTitle.innerText = item.cat.toUpperCase();

    // 1. Herstellung-Liste (Links)
    let herstellungHtml = "";
    if (item.herstellung && Object.keys(item.herstellung).length > 0) {
        herstellungHtml = Object.entries(item.herstellung).map(([name, menge]) => `
            <div class="d-flex justify-content-between py-2 border-bottom border-secondary border-opacity-25">
                <span class="text-white"><i class="bi bi-box-seam me-2 opacity-50"></i>${name}</span>
                <span class="fw-bold text-white">x${menge}</span>
            </div>
        `).join('');
    } else {
        herstellungHtml = `<div class="p-3 text-white-50 fst-italic border border-secondary border-dashed rounded text-center">Basis-Material (Kein Rezept verfügbar)</div>`;
    }

    // 2. Blueprint Label Logik (Rot/Grün)
    const bpLabel = item.blueprint === true 
        ? '<span class="text-success fw-bold"><i class="bi bi-check-circle-fill me-1"></i>JA</span>' 
        : '<span class="text-danger fw-bold"><i class="bi bi-x-circle me-1"></i>NEIN</span>';

    // 3. Rewards Formatierung
    let rewardsHtml = "";
    if (item.rewards && Object.keys(item.rewards).length > 0) {
        rewardsHtml = Object.entries(item.rewards).map(([name, menge]) => `
            <div class="p-2 mb-2 rounded border border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
                <span class="text-white small">${name}</span>
                <span class="badge bg-primary bg-opacity-25 text-primary border border-primary border-opacity-25">${menge}x</span>
            </div>
        `).join('');
    } else {
        rewardsHtml = '<span class="text-white-50 small">Keine Belohnungen</span>';
    }

    // Das gesamte Layout zusammenbauen
    view.innerHTML = `
        <div class="fade-in">
            <div class="mb-1">
                <span class="text-accent fw-bold text-uppercase small" style="letter-spacing: 2px;">${item.cat}</span>
            </div>
            <h1 class="display-5 fw-bold text-white mb-5">${item.item}</h1>

            <div class="row g-4">
                <div class="col-md-7">
                    <div class="card detail-card p-4 h-100">
                        <h6 class="text-accent text-uppercase mb-4 fw-bold" style="letter-spacing: 1px;">
                            <i class="bi bi-hammer me-2"></i>Herstellung
                        </h6>
                        <div class="material-list">
                            ${herstellungHtml}
                        </div>
                    </div>
                </div>
                
                <div class="col-md-5">
                    <div class="card detail-card p-4 h-100">
                        <h6 class="text-accent text-uppercase mb-4 fw-bold" style="letter-spacing: 1px;">
                            <i class="bi bi-info-circle me-2"></i>Informationen
                        </h6>
                        
                        <div class="mb-3 d-flex justify-content-between align-items-center py-2 border-bottom border-secondary border-opacity-25">
                            <span class="text-white-50">Blueprint benötigt:</span>
                            <span>${bpLabel}</span>
                        </div>

                        <div class="mb-3 d-flex justify-content-between align-items-center py-2 border-bottom border-secondary border-opacity-25">
                            <span class="text-white-50">Herstellungszeit:</span>
                            <span class="text-white fw-bold">${item.herstellzeit || 0} Sek.</span>
                        </div>

                        <div class="mb-4 d-flex justify-content-between align-items-center py-2 border-bottom border-secondary border-opacity-25">
                            <span class="text-white-50">XP Belohnung:</span>
                            <span class="text-white fw-bold">${item.xp || 0} XP</span>
                        </div>
                        
                        <div class="mt-2">
                            <div class="small text-white-50 text-uppercase fw-bold mb-3" style="font-size: 0.65rem; letter-spacing: 1px;">Ergebnis / Rewards:</div>
                            <div class="reward-list">
                                ${rewardsHtml}
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
