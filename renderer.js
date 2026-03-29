/**
 * renderer.js - NN Werkbank Cloud-Interface
 */

// 1. Die Hauptfunktion, die alles startet
window.startApp = function() {
    console.log("App wird initialisiert...");
    const root = document.getElementById('root');
    if (!root) return;

    // HTML-Struktur in den Root-Container schreiben
    root.innerHTML = `
        <div class="d-flex" id="wrapper" style="height: 100vh;">
            <aside id="sidebar-wrapper" class="border-end border-secondary d-flex flex-column" style="width: 300px; min-width: 300px; background-color: #1a1a1a;">
                <div class="p-3 border-bottom border-secondary text-center">
                    <h4 class="fw-bold text-white mb-0">NN Werkbänke</h4>
                    <small class="text-success" style="font-size: 0.7rem;">● Cloud-Sync aktiv</small>
                </div>
                <div class="px-3 pt-3">
                    <div class="input-group input-group-sm">
                        <span class="input-group-text bg-dark border-secondary text-secondary"><i class="bi bi-search"></i></span>
                        <input type="text" id="suche" class="form-control bg-dark text-white border-secondary shadow-none" placeholder="Suchen..."/>
                    </div>
                </div>
                <nav id="sidebar-content" class="px-3 pt-2 flex-grow-1 overflow-auto"></nav>
            </aside>

            <div id="page-content-wrapper" class="flex-grow-1 d-flex flex-column" style="background-color: #121212;">
                <header class="navbar border-bottom border-secondary p-3">
                    <span id="header-title" class="navbar-brand mb-0 h1 fs-6 text-secondary text-uppercase" style="letter-spacing: 1px;">Datenbank / Übersicht</span>
                </header>
                <main class="container-fluid p-5 overflow-auto" id="main-content">
                    <div class="text-center mt-5 opacity-25">
                        <i class="bi bi-tools display-1"></i>
                        <h3 class="mt-3 text-white">Werkbank bereit</h3>
                        <p>Wähle links ein Item aus.</p>
                    </div>
                </main>
            </div>
        </div>
    `;

    // 2. Suche aktivieren (ERST JETZT, weil das Feld nun existiert!)
    const sucheInput = document.getElementById('suche');
    if (sucheInput) {
        sucheInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const sections = document.querySelectorAll('.tree-section');
            sections.forEach(section => {
                let hasMatch = false;
                section.querySelectorAll('li').forEach(li => {
                    const match = li.textContent.toLowerCase().includes(term);
                    li.style.display = match ? 'block' : 'none';
                    if (match) hasMatch = true;
                });
                section.style.display = hasMatch ? 'block' : 'none';
            });
        });
    }

    // 3. Daten in Sidebar laden
    baueSeitenleiste();
};

// Funktion zum Aufbau der Sidebar
function baueSeitenleiste() {
    const nav = document.getElementById('sidebar-content');
    if (!nav || !window.MASTER_DB) return;

    nav.innerHTML = '';
    const kategorien = [...new Set(window.MASTER_DB.map(i => i.cat))];

    kategorien.forEach(kat => {
        const catId = `cat-${kat.replace(/\s/g, '')}`;
        const items = window.MASTER_DB.filter(i => i.cat === kat);

        const div = document.createElement('div');
        div.className = 'tree-section mb-2';
        div.innerHTML = `
            <div class="fw-bold text-info small text-uppercase mb-1" style="cursor:pointer" data-bs-toggle="collapse" data-bs-target="#${catId}">
                <i class="bi bi-chevron-down me-1 opacity-50"></i>${kat}
            </div>
            <div class="collapse show" id="${catId}">
                <ul class="list-unstyled ps-2">
                    ${items.map(item => `
                        <li class="py-1">
                            <a href="#" class="text-white-50 text-decoration-none small d-block" onclick="zeigeDetails('${item.item}')">
                                <i class="bi bi-dot me-1"></i>${item.item}
                            </a>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
        nav.appendChild(div);
    });
}

// Funktion für die Detailansicht
window.zeigeDetails = function(name) {
    const item = window.MASTER_DB.find(i => i.item === name);
    const main = document.getElementById('main-content');
    if (!item || !main) return;

    document.getElementById('header-title').innerText = item.item;
    
    let rezeptHtml = item.herstellung 
        ? Object.entries(item.herstellung).map(([n, m]) => `<div class="d-flex justify-content-between border-bottom border-secondary py-2"><span>${n}</span><b>x${m}</b></div>`).join('')
        : '<p class="text-secondary">Kein Rezept hinterlegt.</p>';

    main.innerHTML = `
        <div class="fade-in">
            <h1 class="display-6 fw-bold text-white mb-4">${item.item}</h1>
            <div class="row">
                <div class="col-md-7">
                    <div class="card bg-dark border-secondary p-4 text-white">
                        <h6 class="text-info mb-3">REZEPT</h6>
                        ${rezeptHtml}
                    </div>
                </div>
            </div>
        </div>
    `;
};
