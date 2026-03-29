/**
 * renderer.js - FINALE CLOUD VERSION
 */
window.startApp = function() {
    console.log("StartApp wurde aufgerufen!");
    const root = document.getElementById('root');
    if (!root) return;

    // 1. Das Design bauen
    root.innerHTML = `
        <div class="d-flex" id="wrapper" style="height: 100vh;">
            <aside id="sidebar-wrapper" class="border-end border-secondary d-flex flex-column" style="width: 300px; background: #1a1a1a;">
                <div class="p-3 border-bottom border-secondary text-center">
                    <h4 class="fw-bold text-white mb-0">NN Werkbänke</h4>
                    <small class="text-success" style="font-size: 0.7rem;">● Online</small>
                </div>
                <div class="px-3 pt-3">
                    <div class="input-group input-group-sm">
                        <span class="input-group-text bg-dark border-secondary text-secondary"><i class="bi bi-search"></i></span>
                        <input type="text" id="suche" class="form-control bg-dark text-white border-secondary shadow-none" placeholder="Suchen..."/>
                    </div>
                </div>
                <nav id="sidebar-content" class="px-3 pt-2 flex-grow-1 overflow-auto"></nav>
            </aside>
            <div id="page-content-wrapper" class="flex-grow-1 d-flex flex-column" style="background: #121212;">
                <header class="navbar border-bottom border-secondary p-3">
                    <span id="header-title" class="navbar-brand mb-0 h1 fs-6 text-secondary text-uppercase">Datenbank / Übersicht</span>
                </header>
                <main class="container-fluid p-5 overflow-auto" id="main-content">
                    <div id="item-details-view" class="text-center mt-5 opacity-25">
                        <i class="bi bi-tools display-1 text-white"></i>
                        <h3 class="text-white mt-3">Werkbank bereit</h3>
                        <p class="text-secondary">Wähle links ein Item aus der Liste.</p>
                    </div>
                </main>
            </div>
        </div>
    `;

    // 2. Suche aktivieren
    const sucheInput = document.getElementById('suche');
    if (sucheInput) {
        sucheInput.oninput = function(e) {
            const term = e.target.value.toLowerCase();
            document.querySelectorAll('.tree-section').forEach(section => {
                let hasMatch = false;
                section.querySelectorAll('li').forEach(li => {
                    const text = li.textContent.toLowerCase();
                    const match = text.includes(term);
                    li.style.display = match ? 'block' : 'none';
                    if (match) hasMatch = true;
                });
                section.style.display = hasMatch ? 'block' : 'none';
            });
        };
    }

    // 3. Sidebar mit den echten Daten füllen
    if (window.MASTER_DB && window.MASTER_DB.length > 0) {
        console.log("Baue Sidebar mit " + window.MASTER_DB.length + " Items...");
        baueSidebarInhalt();
    } else {
        console.error("MASTER_DB ist leer oder nicht definiert!");
    }
};

function baueSidebarInhalt() {
    const nav = document.getElementById('sidebar-content');
    if (!nav) return;

    // Kategorien sammeln
    const kategorien = [...new Set(window.MASTER_DB.map(i => i.cat))];
    
    nav.innerHTML = kategorien.map(kat => {
        const catId = "cat-" + kat.replace(/\s/g, '');
        const items = window.MASTER_DB.filter(i => i.cat === kat);

        return `
            <div class="tree-section mb-2">
                <div class="small fw-bold text-info text-uppercase mb-1" style="cursor:pointer" data-bs-toggle="collapse" data-bs-target="#${catId}">
                    <i class="bi bi-chevron-down me-1 opacity-50"></i>${kat}
                </div>
                <div class="collapse show" id="${catId}">
                    <ul class="list-unstyled ps-2 mt-1">
                        ${items.map(item => `
                            <li class="py-1">
                                <a href="#" class="text-white-50 text-decoration-none small d-block" onclick="zeigeDetails('${item.item}')">
                                    <i class="bi bi-dot me-1"></i>${item.item}
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
    }).join('');
}

window.zeigeDetails = function(name) {
    const item = window.MASTER_DB.find(i => i.item === name);
    const main = document.getElementById('main-content');
    if (!item || !main) return;

    document.getElementById('header-title').innerText = item.cat + " / " + item.item;

    let rezept = "<ul>";
    if (item.herstellung) {
        for (const [mat, menge] of Object.entries(item.herstellung)) {
            rezept += `<li class="text-white-50">${mat}: <b class="text-info">x${menge}</b></li>`;
        }
    }
    rezept += "</ul>";

    main.innerHTML = `
        <div class="fade-in">
            <h1 class="display-5 fw-bold text-white mb-4">${item.item}</h1>
            <div class="card bg-dark border-secondary p-4 shadow-lg">
                <h5 class="text-info border-bottom border-secondary pb-2 mb-3">REZEPT</h5>
                ${rezept}
            </div>
        </div>
    `;
};
