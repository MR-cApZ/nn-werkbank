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

                <div class="p-2 border-bottom border-secondary border-opacity-10">
                    <div class="nav-item p-2">
                        <a href="javascript:void(0)" onclick="location.reload()" class="text-decoration-none d-block">
                            <span class="text-white-50 small fw-bold text-uppercase"><i class="bi bi-house-door me-2"></i>Home</span>
                        </a>
                    </div>
                    <div class="nav-item p-2">
                        <a href="javascript:void(0)" onclick="zeigeKarte()" class="text-decoration-none d-block">
                            <span class="text-white-50 small fw-bold text-uppercase"><i class="bi bi-map me-2"></i>Karte</span>
                        </a>
                    </div>
                    <div class="nav-item p-2">
                        <a href="javascript:void(0)" onclick="zeigeRechner()" class="text-decoration-none d-block">
                            <span class="text-white-50 small fw-bold text-uppercase"><i class="bi bi-calculator me-2"></i>Rechner</span>
                        </a>
                    </div>
                </div>
                
                <div class="p-3">
                    <input type="text" id="suche" class="form-control form-control-sm bg-dark border-secondary text-white shadow-none" placeholder="Suchen...">
                </div>
                <nav id="sidebar-content" class="overflow-auto" style="max-height: calc(100vh - 250px);"></nav>
            </aside>

            <div id="page-content-wrapper" style="flex-grow: 1; overflow: hidden; display: flex; flex-direction: column;">
                <header class="p-3 border-bottom border-secondary bg-dark bg-opacity-75" style="backdrop-filter: blur(10px);">
                    <small id="header-breadcrumb" class="text-muted fw-bold text-uppercase">Übersicht</small>
                </header>
                <main id="item-details-view" class="p-5" style="flex-grow: 1; overflow-y: auto;"></main>
            </div>
        </div>
    `;

    if (window.MASTER_DB) baueSeitenleiste();
    setupSuche();
};

// --- FUNKTION: SEITENLEISTE BAUEN (Mit ucat Support & Sortierung) ---
function baueSeitenleiste() {
    const container = document.getElementById('sidebar-content');
    if (!container) return;
    container.innerHTML = '';

    // Festgelegte Sortierung der Hauptkategorien (Komponenten = Waffenteile)
    const order = ["Komponenten", "Waffen", "Aufsätze", "Rohmaterialien"];
    
    order.forEach((katName, index) => {
        const itemsInKat = window.MASTER_DB.filter(i => i.cat === katName);
        if (itemsInKat.length === 0) return;

        const catId = `collapse-cat-${index}`;
        const section = document.createElement('div');
        section.className = 'tree-section mb-2';

        // Unterkategorien innerhalb der Kategorie finden
        const ucats = [...new Set(itemsInKat.map(i => i.ucat).filter(u => u))];

        let contentHtml = "";

        if (ucats.length > 0) {
            // Wenn Unterkategorien existieren (z.B. Pistolen, Sturmgewehre)
            ucats.forEach((u, uIdx) => {
                const subItems = itemsInKat.filter(i => i.ucat === u);
                const uId = `sub-${index}-${uIdx}`;
                contentHtml += `
                    <div class="ms-2 mb-1">
                        <div class="text-white-50 small fw-bold text-uppercase px-2 py-1" style="font-size: 10px; opacity: 0.6;">${u}</div>
                        <ul class="tree-list">
                            ${subItems.map(item => `
                                <li><a href="javascript:void(0)" onclick="zeigeDetails('${item.item.replace(/'/g, "\\'")}')">${item.item}</a></li>
                            `).join('')}
                        </ul>
                    </div>
                `;
            });
        } else {
            // Einfache Liste (z.B. für Rohmaterialien oder Komponenten)
            contentHtml = `
                <ul class="tree-list">
                    ${itemsInKat.map(item => `
                        <li><a href="javascript:void(0)" onclick="zeigeDetails('${item.item.replace(/'/g, "\\'")}')">${item.item}</a></li>
                    `).join('')}
                </ul>
            `;
        }

        section.innerHTML = `
            <div class="tree-category-title px-3 py-2 d-flex justify-content-between align-items-center" 
                 data-bs-toggle="collapse" data-bs-target="#${catId}" style="cursor:pointer; background: rgba(255,255,255,0.03);">
                <span class="fw-bold small text-white">${katName === 'Komponenten' ? 'WAFFENTEILE' : katName.toUpperCase()}</span>
                <i class="bi bi-chevron-down small opacity-50"></i>
            </div>
            <div class="collapse show" id="${catId}">
                <div class="py-2">${contentHtml}</div>
            </div>
        `;
        container.appendChild(section);
    });
}

// --- FUNKTION: DETAILS ANZEIGEN ---
window.zeigeDetails = function(itemName) {
    const item = window.MASTER_DB.find(i => i.item === itemName);
    const view = document.getElementById('item-details-view');
    if (!item || !view) return;

    const headerTitle = document.getElementById('header-breadcrumb');
    if(headerTitle) headerTitle.innerText = item.cat.toUpperCase() + (item.ucat ? ` / ${item.ucat.toUpperCase()}` : "");

    // Herstellung HTML
    let herstellungHtml = "";
    if (item.herstellung && Object.keys(item.herstellung).length > 0) {
        herstellungHtml = Object.entries(item.herstellung).map(([name, menge]) => `
            <div class="d-flex justify-content-between py-2 border-bottom border-secondary border-opacity-25">
                <span class="text-white"><i class="bi bi-box-seam me-2 opacity-50"></i>${name}</span>
                <span class="fw-bold text-white">x${menge}</span>
            </div>
        `).join('');
    } else {
        herstellungHtml = `<div class="p-4 text-white-50 fst-italic border border-secondary border-dashed rounded text-center opacity-50">Basis-Material<br><small>(Kein Rezept)</small></div>`;
    }

    // Blueprint Check (unterstützt jetzt Strings wie "Karabiner" oder Booleans)
    const hasBP = item.blueprint && item.blueprint !== "-";
    const bpLabel = hasBP
        ? `<span class="text-success fw-bold"><i class="bi bi-check-circle-fill me-1"></i>${item.blueprint === true ? 'JA' : item.blueprint}</span>` 
        : '<span class="text-danger fw-bold"><i class="bi bi-x-circle me-1"></i>NEIN</span>';

    // Rewards HTML
    let rewardsHtml = "";
    if (item.rewards && Object.keys(item.rewards).length > 0) {
        rewardsHtml = Object.entries(item.rewards).map(([name, menge]) => `
            <div class="p-2 mb-2 rounded border border-secondary border-opacity-25 d-flex justify-content-between align-items-center bg-dark bg-opacity-25">
                <span class="text-white small">${name}</span>
                <span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25">${menge}x</span>
            </div>
        `).join('');
    } else {
        rewardsHtml = '<span class="text-white-50 small">Keine Belohnung</span>';
    }

    view.innerHTML = `
        <div class="fade-in">
            <div class="mb-1">
                <span class="text-accent fw-bold text-uppercase small" style="letter-spacing: 2px;">${item.ucat || item.cat}</span>
            </div>
            <h1 class="display-5 fw-bold text-white mb-5">${item.item}</h1>

            <div class="row g-4">
                <div class="col-md-7">
                    <div class="card detail-card p-4 h-100 shadow-lg border-secondary border-opacity-25" style="background: rgba(255,255,255,0.02);">
                        <h6 class="text-accent text-uppercase mb-4 fw-bold" style="letter-spacing: 1px;">
                            <i class="bi bi-hammer me-2"></i>Herstellung
                        </h6>
                        <div class="material-list">
                            ${herstellungHtml}
                        </div>
                    </div>
                </div>
                
                <div class="col-md-5">
                    <div class="card detail-card p-4 h-100 shadow-lg border-secondary border-opacity-25" style="background: rgba(255,255,255,0.02);">
                        <h6 class="text-accent text-uppercase mb-4 fw-bold" style="letter-spacing: 1px;">
                            <i class="bi bi-info-circle me-2"></i>Informationen
                        </h6>

                        <div class="mb-3 d-flex justify-content-between align-items-center py-2 border-bottom border-secondary border-opacity-25">
                            <span class="text-white-50">Herstellungszeit:</span>
                            <span class="text-white fw-bold">${item.herstellzeit || 0} Sek.</span>
                        </div>

                        <div class="mb-3 d-flex justify-content-between align-items-center py-2 border-bottom border-secondary border-opacity-25">
                            <span class="text-white-50">Blueprint:</span>
                            <span>${bpLabel}</span>
                        </div>

                        <div class="mb-4 d-flex justify-content-between align-items-center py-2 border-bottom border-secondary border-opacity-25">
                            <span class="text-white-50">XP Level:</span>
                            <span class="text-white fw-bold small">${item.xp || "Start"}</span>
                        </div>
                        
                        <div class="mt-4">
                            <div class="small text-white-50 text-uppercase fw-bold mb-3" style="font-size: 0.65rem; letter-spacing: 1px; opacity: 0.5;">Output / Rewards</div>
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

// --- KARTE & RECHNER (Platzhalter) ---
window.zeigeKarte = function() {
    const view = document.getElementById('item-details-view');
    document.getElementById('header-breadcrumb').innerText = "WELTKARTE";
    view.innerHTML = `<div class="fade-in p-5 text-center"><h1 class="text-white">Weltkarte</h1><p class="text-white-50">Modul wird geladen...</p></div>`;
};

window.zeigeRechner = function() {
    const view = document.getElementById('item-details-view');
    document.getElementById('header-breadcrumb').innerText = "RECHNER";
    view.innerHTML = `<div class="fade-in p-5 text-center"><h1 class="text-white">Material-Rechner</h1><p class="text-white-50">Coming Soon...</p></div>`;
};

function setupSuche() {
    const searchInput = document.getElementById('suche');
    if (!searchInput) return;
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('.tree-section').forEach(section => {
            const listItems = section.querySelectorAll('li');
            let hasVisible = false;
            listItems.forEach(li => {
                const match = li.textContent.toLowerCase().includes(term);
                li.style.display = match ? 'block' : 'none';
                if (match) hasVisible = true;
            });
            section.style.display = hasVisible ? 'block' : 'none';
        });
    });
}
