window.startApp = function() {
    const root = document.getElementById('app-root');
    
    // SCHRITT 1: Das Design definieren (Hier kannst du ALLES ändern!)
    root.innerHTML = `
        <div class="d-flex" id="wrapper" style="height: 100vh;">
            <aside id="sidebar" class="border-end border-secondary d-flex flex-column" style="width: 280px; background: #151515;">
                <div class="p-3 border-bottom border-secondary text-center">
                    <h5 class="fw-bold mb-0">NN WERKBANK</h5>
                    <small class="text-info" style="font-size: 0.6rem;">v2.0 Cloud-Build</small>
                </div>
                <div class="p-3">
                    <input type="text" id="suche" class="form-control form-control-sm bg-dark text-white border-secondary" placeholder="Suchen...">
                </div>
                <nav id="sidebar-nav" class="flex-grow-1 overflow-auto px-3"></nav>
            </aside>
            <main class="flex-grow-1 d-flex flex-column" style="background: #101010;">
                <header class="p-3 border-bottom border-secondary text-secondary small">DATENBANK / ÜBERSICHT</header>
                <div id="content-area" class="p-5 overflow-auto">
                    <div class="text-center opacity-25 mt-5"><i class="bi bi-cpu display-1"></i><h3>System bereit</h3></div>
                </div>
            </main>
        </div>
    `;

    // SCHRITT 2: Die Funktionen aktivieren (Jetzt, wo das HTML da ist!)
    initLogic();
};

function initLogic() {
    const searchInput = document.getElementById('suche');
    if (searchInput) {
        searchInput.oninput = (e) => {
            const term = e.target.value.toLowerCase();
            // Hier deine Such-Logik...
            console.log("Suche nach:", term);
        };
    }
    
    // Sidebar befüllen
    renderSidebar();
}

function renderSidebar() {
    const nav = document.getElementById('sidebar-nav');
    if (!window.MASTER_DB) return;
    
    // Dein Loop für die Kategorien...
    nav.innerHTML = "Lade Kategorien..."; 
    // (Hier baust du deine Kategorien-Logik ein)
}

// Global verfügbar machen für onclick im HTML
window.zeigeDetails = function(id) {
    // Deine Detail-Logik
};
