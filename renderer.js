/**
 * renderer.js - CLOUD VERSION
 */
window.startApp = function() {
    console.log("StartApp wurde aufgerufen!");
    const root = document.getElementById('root');
    if (!root) {
        console.error("Root-Element nicht gefunden!");
        return;
    }

    // 1. HTML injizieren
    root.innerHTML = `
        <div class="d-flex" id="wrapper" style="height: 100vh;">
            <aside id="sidebar-wrapper" class="border-end border-secondary d-flex flex-column" style="width: 300px; background: #1a1a1a;">
                <div class="p-3 border-bottom border-secondary text-center">
                    <h4 class="fw-bold text-white mb-0">NN Werkbänke</h4>
                    <small class="text-success" style="font-size: 0.7rem;">● Cloud-Sync OK</small>
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
                        <i class="bi bi-cloud-check display-1"></i>
                        <h3 class="text-white">Cloud-Interface Aktiv</h3>
                    </div>
                </main>
            </div>
        </div>
    `;

    // 2. Suche sicher binden
    const sucheInput = document.getElementById('suche');
    if (sucheInput) {
        sucheInput.oninput = function(e) {
            console.log("Suche läuft...");
            // (Hier kommt später die Filter-Logik rein)
        };
    }

    // 3. Seitenleiste laden
    if (window.MASTER_DB) {
        console.log("Daten gefunden, baue Sidebar...");
        // Hier deine baueSeitenleiste() Funktion aufrufen
    }
};
