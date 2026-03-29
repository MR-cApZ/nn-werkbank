/**
 * renderer.js - FINAL FIX
 */
window.startApp = function() {
    console.log("StartApp wird ausgeführt...");
    const root = document.getElementById('root');
    if (!root) return;

    root.innerHTML = `
        <div class="d-flex" id="wrapper" style="height: 100vh; overflow: hidden;">
            <aside id="sidebar-wrapper" class="border-end border-secondary d-flex flex-column" style="width: 300px; background: #1a1a1a; min-width: 300px;">
                <div class="p-3 border-bottom border-secondary text-center">
                    <h4 class="fw-bold text-white mb-0">NN Werkbänke</h4>
                    <small class="text-success" style="font-size: 0.7rem;">● Verbindung steht</small>
                </div>
                <div class="px-3 pt-3">
                    <div class="input-group input-group-sm">
                        <span class="input-group-text bg-dark border-secondary text-secondary"><i class="bi bi-search"></i></span>
                        <input type="text" id="suche" class="form-control bg-dark text-white border-secondary shadow-none" placeholder="Suchen..."/>
                    </div>
                </div>
                <nav id="sidebar-content" class="px-3 pt-2 flex-grow-1 overflow-auto" style="max-height: calc(100vh - 120px);"></nav>
            </aside>
            <div id="page-content-wrapper" class="flex-grow-1 d-flex flex-column" style="background: #121212;">
                <header class="navbar border-bottom border-secondary p-3">
                    <span id="header-title" class="navbar-brand mb-0 h1 fs-6 text-secondary text-uppercase">Datenbank / Übersicht</span>
                </header>
                <main class="container-fluid p-5 overflow-auto" id="main-content">
                    <div id="item-details-view" class="text-center mt-5 opacity-25">
                        <i class="bi bi-tools display-1 text-white"></i>
                        <h3 class="text-white mt-3">Werkbank bereit</h3>
                        <p class="text-secondary">Wähle links ein Item aus.</p>
                    </div>
                </main>
            </div>
        </div>
    `;

    // Suche
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

    // Sidebar laden
    if (window.MASTER_DB && window.MASTER_DB.length > 0) {
        console.log("Baue Sidebar mit " + window.MASTER_DB.length + " Items...");
        baueSidebarInhalt();
    }
};

function baueSidebarInhalt() {
    const nav = document.getElementById('sidebar-content');
    if (!nav) return;

    const kategorien = [...new Set(window.MASTER_DB.map(i => i.cat))];
    
    // Wir bauen das HTML als String
    let html = "";
    kategorien.forEach(kat => {
        const items = window.MASTER_DB.filter(i => i.cat === kat);
        html += `
            <div class="tree-section mb-3">
                <div class="small fw-bold text-info text-uppercase mb-2" style="letter-spacing: 1px;">
                    ${kat}
                </div>
                <ul class="list-unstyled ps-1">
                    ${items.map(item => `
                        <li class="mb-1">
                            <a href="javascript:void(0)" 
                               style="color: rgba(255,255,255,0.6); text-decoration: none; font-size: 0.85rem; display: block;"
                               onmouseover="this.style.color='#0dcaf0'" 
                               onmouseout="this.style.color='rgba(255,255,255,0.6)'"
                               onclick="zeigeDetails('${item.item.replace(/'/g, "\\'")}')">
                                <i class="bi bi-chevron-right me-1" style="font-size: 0.6rem; opacity: 0.5;"></i>${item.item}
                            </a>
                        </li>
                    `).join('')}
                </ul>
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

    let rezept = "";
    if (item.herstellung) {
        rezept = Object.entries(item.herstellung).map(([mat, menge]) => `
            <div class="d-flex justify-content-between border-bottom border-secondary py-2">
                <span class="text-white-50">${mat}</span>
                <span class="text-info fw-bold">x${menge}</span>
            </div>
        `).join('');
    }

    main.innerHTML = `
        <div class="fade-in">
            <h1 class="display-6 fw-bold text-white mb-4">${item.item}</h1>
            <div class="row">
                <div class="col-md-6">
                    <div class="card bg-dark border-secondary p-4 shadow-lg">
                        <h6 class="text-secondary text-uppercase mb-3 small fw-bold">Materialien</h6>
                        ${rezept || '<p class="text-muted">Kein Rezept vorhanden.</p>'}
                    </div>
                </div>
            </div>
        </div>
    `;
};
