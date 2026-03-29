/**
 * renderer.js - NN Werkbank Cloud
 */

// Wir kapseln alles in eine Funktion, damit nichts "einfach so" losläuft
window.startApp = function() {
    console.log("Cloud-Interface wird gestartet...");
    const root = document.getElementById('root');
    if (!root) return;

    // 1. Grundgerüst bauen
    root.innerHTML = `
        <div class="d-flex" id="wrapper" style="height: 100vh;">
            <aside id="sidebar-wrapper" class="border-end border-secondary d-flex flex-column" style="width: 300px; background: #1a1a1a;">
                <div class="p-3 border-bottom border-secondary text-center">
                    <h4 class="fw-bold text-white mb-0">NN Werkbänke</h4>
                    <small class="text-success" style="font-size: 0.7rem;">● Live-Updates aktiv</small>
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
                    <span id="header-title" class="navbar-brand mb-0 h1 fs-6 text-secondary text-uppercase">Übersicht</span>
                </header>
                <main class="container-fluid p-5 overflow-auto" id="main-content">
                    <div class="text-center mt-5 opacity-25">
                        <i class="bi bi-tools display-1"></i>
                        <h3 class="text-white">Bereit für Updates</h3>
                    </div>
                </main>
            </div>
        </div>
    `;

    // 2. Suche erst aktivieren, wenn das Feld SICHER da ist
    setTimeout(() => {
        const sucheInput = document.getElementById('suche');
        if (sucheInput) {
            sucheInput.addEventListener('input', (e) => {
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
            });
        }
    }, 100);

    // 3. Sidebar mit Daten füllen
    if (typeof window.baueSeitenleiste === 'function') {
        window.baueSeitenleiste();
    }
};

window.baueSeitenleiste = function() {
    const nav = document.getElementById('sidebar-content');
    if (!nav || !window.MASTER_DB) return;

    const kats = [...new Set(window.MASTER_DB.map(i => i.cat))];
    nav.innerHTML = kats.map(kat => `
        <div class="tree-section mb-2">
            <div class="small fw-bold text-info text-uppercase mb-1" style="cursor:pointer" data-bs-toggle="collapse" data-bs-target="#${kat.replace(/\s/g, '')}">${kat}</div>
            <div class="collapse show" id="${kat.replace(/\s/g, '')}">
                <ul class="list-unstyled ps-2">
                    ${window.MASTER_DB.filter(i => i.cat === kat).map(item => `
                        <li><a href="#" class="text-white-50 text-decoration-none small d-block py-1" onclick="zeigeDetails('${item.item}')">${item.item}</a></li>
                    `).join('')}
                </ul>
            </div>
        </div>
    `).join('');
};

window.zeigeDetails = function(name) {
    const item = window.MASTER_DB.find(i => i.item === name);
    const main = document.getElementById('main-content');
    if (!item || !main) return;
    document.getElementById('header-title').innerText = item.item;
    main.innerHTML = `<h1 class="text-white">${item.item}</h1><div class="card bg-dark border-secondary p-3 mt-3 text-white"><pre>${JSON.stringify(item.herstellung, null, 2)}</pre></div>`;
};
