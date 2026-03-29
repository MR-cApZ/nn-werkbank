/**
 * renderer.js - Cloud Version (Nutzt dein lokales CSS)
 */
window.startApp = function() {
    console.log("StartApp wird mit deinem CSS-Design ausgeführt...");
    const root = document.getElementById('root');
    if (!root) return;

    // 1. Das Design nach deinem CSS-Muster bauen
    root.innerHTML = `
        <div id="wrapper" class="d-flex">
            <aside id="sidebar-wrapper" class="border-end">
                <div class="p-3 border-bottom border-secondary text-center">
                    <h5 class="fw-bold text-white mb-0" style="letter-spacing: 1px;">NN WERKBANK</h5>
                    <small class="text-info" style="font-size: 0.65rem; text-transform: uppercase;">Cloud Synchronized</small>
                </div>
                
                <div class="p-3">
                    <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-search"></i></span>
                        <input type="text" id="suche" class="form-control" placeholder="Item suchen...">
                    </div>
                </div>

                <nav id="sidebar-content" class="flex-grow-1 overflow-auto px-2"></nav>
            </aside>

            <div id="page-content-wrapper" class="flex-grow-1 d-flex flex-column">
                <header class="navbar border-bottom p-3">
                    <span id="header-title" class="text-muted small fw-bold text-uppercase">Datenbank / Übersicht</span>
                </header>
                
                <main id="main-content" class="container-fluid p-5 overflow-auto">
                    <div class="text-center mt-5 fade-in opacity-25">
                        <i class="bi bi-box-seam display-1 text-white"></i>
                        <h3 class="text-white mt-3">System bereit</h3>
                        <p>Wähle ein Item aus der Liste links aus.</p>
                    </div>
                </main>
            </div>
        </div>
    `;

    // 2. Suche (deine Filter-Logik)
    const sucheInput = document.getElementById('suche');
    if (sucheInput) {
        sucheInput.oninput = function(e) {
            const term = e.target.value.toLowerCase();
            document.querySelectorAll('.tree-section').forEach(section => {
                let hasMatch = false;
                section.querySelectorAll('li').forEach(li => {
                    const match = li.textContent.toLowerCase().includes(term);
                    li.style.display = match ? 'block' : 'none';
                    if (match) hasMatch = true;
                });
                section.style.display = hasMatch ? 'block' : 'none';
            });
        };
    }

    // 3. Sidebar befüllen
    if (window.MASTER_DB) {
        baueSidebarInhalt();
    }
};

function baueSidebarInhalt() {
    const nav = document.getElementById('sidebar-content');
    if (!nav) return;

    const kategorien = [...new Set(window.MASTER_DB.map(i => i.cat))];
    
    let html = "";
    kategorien.forEach(kat => {
        const catId = "cat-" + kat.replace(/\s/g, '');
        const items = window.MASTER_DB.filter(i => i.cat === kat);

        // Hier nutzen wir DEINE CSS-Klassen: tree-category-title und tree-list
        html += `
            <div class="tree-section mb-2">
                <div class="tree-category-title px-2" data-bs-toggle="collapse" data-bs-target="#${catId}">
                    <span>${kat}</span>
                    <i class="bi bi-chevron-down opacity-50 small"></i>
                </div>
                <div class="collapse show" id="${catId}">
                    <ul class="tree-list">
                        ${items.map(item => `
                            <li>
                                <a href="javascript:void(0)" onclick="zeigeDetails('${item.item.replace(/'/g, "\\'")}')">
                                    ${item.item}
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
    });
    
    nav.innerHTML = html;
}

window.zeigeDetails = function(name) {
    const item = window.MASTER_DB.find(i => i.item === name);
    const main = document.getElementById('main-content');
    if (!item || !main) return;

    document.getElementById('header-title').innerText = item.cat + " / " + item.item;

    let rezeptHtml = "";
    if (item.herstellung) {
        rezeptHtml = Object.entries(item.herstellung).map(([mat, menge]) => `
            <div class="d-flex justify-content-between border-bottom border-secondary py-2">
                <span class="text-secondary"><i class="bi bi-dot me-1"></i>${mat}</span>
                <span class="text-info fw-bold">x${menge}</span>
            </div>
        `).join('');
    }

    main.innerHTML = `
        <div class="fade-in">
            <h2 class="fw-bold text-white mb-4">${item.item}</h2>
            <div class="row g-4">
                <div class="col-md-7">
                    <div class="detail-card p-4">
                        <h6 class="text-uppercase text-info mb-3 small fw-bold" style="letter-spacing:1px">Rezeptur</h6>
                        ${rezeptHtml || '<p class="text-muted small">Kein Rezept erforderlich.</p>'}
                    </div>
                </div>
                <div class="col-md-5">
                    <div class="detail-card p-4">
                        <h6 class="text-uppercase text-info mb-3 small fw-bold" style="letter-spacing:1px">Informationen</h6>
                        <div class="d-flex justify-content-between mb-2">
                            <span class="text-muted small">Herstellungszeit:</span>
                            <span class="text-white small">${item.herstellzeit || 0} Sek.</span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <span class="text-muted small">Erfahrung:</span>
                            <span class="text-white small">${item.xp || 0} XP</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};
