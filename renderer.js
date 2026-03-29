/**
 * renderer.js - FINAL STABLE VERSION
 */
window.startApp = function() {
    console.log("StartApp läuft...");
    const root = document.getElementById('root');
    if (!root) return;

    // 1. Das Design (Wir nutzen feste IDs für die Sidebar)
    root.innerHTML = `
        <div id="wrapper" class="d-flex" style="height: 100vh;">
            <aside id="sidebar-wrapper" class="border-end">
                <div class="p-4 border-bottom border-secondary text-center">
                    <h2 class="fw-bold text-white mb-0">NN Werkbänke</h2>
                    <small class="text-success" style="font-size: 0.7rem;">● Cloud-Sync OK</small>
                </div>
                
                <div class="p-3">
                    <div class="input-group">
                        <span class="input-group-text bg-dark border-secondary text-muted"><i class="bi bi-search"></i></span>
                        <input type="text" id="suche" class="form-control bg-dark text-white border-secondary" placeholder="Suche...">
                    </div>
                </div>

                <nav id="sidebar-content" class="flex-grow-1 overflow-auto px-3 py-2"></nav>
            </aside>

            <div id="page-content-wrapper" class="flex-grow-1 d-flex flex-column">
                <header class="navbar border-bottom p-3">
                    <span id="header-title" class="text-muted small fw-bold">ÜBERSICHT</span>
                </header>
                
                <main id="main-content" class="container-fluid p-5 overflow-auto">
                    <div id="placeholder-view" class="text-center mt-5 opacity-25">
                        <i class="bi bi-cloud-check display-1 text-white"></i>
                        <h3 class="text-white mt-3">Cloud-Interface Aktiv</h3>
                    </div>
                </main>
            </div>
        </div>
    `;

    // 2. Suche
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

    // 3. DATEN DIREKT EINSPEISEN
    const nav = document.getElementById('sidebar-content');
    if (nav && window.MASTER_DB && window.MASTER_DB.length > 0) {
        console.log("Daten werden jetzt gerendert...");
        
        const kategorien = [...new Set(window.MASTER_DB.map(i => i.cat))];
        let sidebarHtml = "";

        kategorien.forEach(kat => {
            const catId = "cat-" + kat.replace(/\s/g, '');
            const items = window.MASTER_DB.filter(i => i.cat === kat);

            sidebarHtml += `
                <div class="tree-section mb-3">
                    <div class="tree-category-title mb-1" style="cursor:pointer; color: #fff; font-weight:bold; font-size:0.9rem;">
                        ${kat}
                    </div>
                    <ul class="tree-list" style="list-style:none; padding-left: 15px; border-left: 1px solid #333;">
                        ${items.map(item => `
                            <li class="py-1">
                                <a href="javascript:void(0)" 
                                   style="color: #888; text-decoration: none; font-size: 0.85rem;"
                                   onclick="zeigeDetails('${item.item.replace(/'/g, "\\'")}')">
                                    ${item.item}
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        });
        nav.innerHTML = sidebarHtml;
    } else {
        console.error("Sidebar-Element oder Daten fehlen!");
        if(nav) nav.innerHTML = '<p class="text-danger">Keine Daten geladen.</p>';
    }
};

window.zeigeDetails = function(name) {
    const item = window.MASTER_DB.find(i => i.item === name);
    const main = document.getElementById('main-content');
    if (!item || !main) return;

    document.getElementById('header-title').innerText = item.cat + " / " + item.item;

    let rez = "";
    if (item.herstellung) {
        rez = Object.entries(item.herstellung).map(([m, q]) => `
            <div class="d-flex justify-content-between border-bottom border-secondary py-2">
                <span class="text-muted">${m}</span>
                <span class="text-info fw-bold">x${q}</span>
            </div>
        `).join('');
    }

    main.innerHTML = `
        <div class="fade-in">
            <h1 class="text-white mb-4 fw-bold">${item.item}</h1>
            <div class="row">
                <div class="col-md-6">
                    <div class="detail-card p-4" style="background:#242424; border-radius:12px; border:1px solid #2a2a2a;">
                        <h6 class="text-info text-uppercase mb-3 small">Materialien</h6>
                        ${rez || '<p class="text-muted">Kein Rezept.</p>'}
                    </div>
                </div>
            </div>
        </div>
    `;
};
