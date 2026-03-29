/**
 * renderer.js - NN Werkbank (Full UI Restore)
 */
window.startAppCloud = function() {
    console.log("UI Restore wird ausgeführt...");
    const root = document.getElementById('root');
    if (!root) return;

    // 1. Dein originales Grundgerüst
    root.innerHTML = `
        <div id="wrapper" class="d-flex" style="height: 100vh; overflow: hidden;">
            <aside id="sidebar-wrapper" class="border-end border-secondary d-flex flex-column">
                <div class="p-4 border-bottom border-secondary text-center">
                    <h2 class="fw-bold text-white mb-0" style="letter-spacing: 1px;">NN Werkbänke</h2>
                    <small class="text-success" style="font-size: 0.7rem;">● Cloud-Sync aktiv</small>
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
                
                <main id="main-content" class="container-fluid p-5 overflow-auto">
                    <div id="placeholder-view" class="text-center mt-5 opacity-25 fade-in">
                        <i class="bi bi-tools display-1 text-white"></i>
                        <h3 class="text-white mt-3">Werkbank bereit</h3>
                        <p>Wähle links ein Element aus.</p>
                    </div>
                </main>
            </div>
        </div>
    `;

    // 2. Suche reaktivieren
    const sucheInput = document.getElementById('suche');
    if (sucheInput) {
        sucheInput.oninput = function(e) {
            const term = e.target.value.toLowerCase();
            document.querySelectorAll('.tree-section').forEach(sec => {
                let match = false;
                sec.querySelectorAll('li').forEach(li => {
                    const found = li.textContent.toLowerCase().includes(term);
                    li.style.display = found ? 'block' : 'none';
                    if(found) match = true;
                });
                sec.style.display = match ? 'block' : 'none';
            });
        };
    }

    // 3. Baum-Struktur (Tree-View) befüllen
    if (window.MASTER_DB) {
        baueBaumStruktur();
    }
};

function baueBaumStruktur() {
    const nav = document.getElementById('sidebar-content');
    if (!nav) return;

    const kategorien = [...new Set(window.MASTER_DB.map(i => i.cat))];
    let html = "";

    kategorien.forEach(kat => {
        const catId = "cat-" + kat.replace(/\s/g, '');
        const items = window.MASTER_DB.filter(i => i.cat === kat);

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
                                <a href="javascript:void(0)" onclick="zeigeDetailsCloud('${item.item.replace(/'/g, "\\'")}')">
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

window.zeigeDetailsCloud = function(name) {
    const item = window.MASTER_DB.find(i => i.item === name);
    const main = document.getElementById('main-content');
    if (!item || !main) return;

    document.getElementById('header-title').innerText = item.cat + " / " + item.item;

    let rezHtml = "";
    if (item.herstellung) {
        rezHtml = Object.entries(item.herstellung).map(([m, q]) => `
            <div class="d-flex justify-content-between border-bottom border-secondary py-2">
                <span class="text-secondary"><i class="bi bi-dot me-1"></i>${m}</span>
                <span class="text-info fw-bold">x${q}</span>
            </div>
        `).join('');
    }

    main.innerHTML = `
        <div class="fade-in">
            <h2 class="fw-bold text-white mb-4">${item.item}</h2>
            <div class="row">
                <div class="col-md-7">
                    <div class="detail-card p-4">
                        <h6 class="text-info text-uppercase mb-3 small fw-bold" style="letter-spacing:1px">Rezeptur</h6>
                        ${rezHtml || '<p class="text-muted small">Kein Rezept erforderlich.</p>'}
                    </div>
                </div>
            </div>
        </div>
    `;
};
