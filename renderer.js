window.startAppCloud = function() {
    console.log("--- CLOUD RENDERER V3 START ---");
    const root = document.getElementById('root');
    if (!root) return;

    root.innerHTML = `
        <div id="wrapper" class="d-flex" style="height: 100vh;">
            <aside id="sidebar-wrapper" class="border-end" style="width: 300px; background: #121212; display: flex; flex-direction: column;">
                <div class="p-4 border-bottom border-secondary text-center">
                    <h2 class="fw-bold text-white mb-0">NN Werkbänke</h2>
                    <small class="text-success">● Cloud-Version Aktiv</small>
                </div>
                <div class="p-3">
                    <input type="text" id="suche" class="form-control bg-dark text-white border-secondary" placeholder="Suche...">
                </div>
                <nav id="sidebar-content" class="flex-grow-1 overflow-auto px-3 py-2" style="color: white !important;"></nav>
            </aside>
            <div id="page-content-wrapper" class="flex-grow-1 d-flex flex-column" style="background: #1a1a1a;">
                <header class="navbar border-bottom p-3">
                    <span id="header-title" class="text-muted small fw-bold">ÜBERSICHT</span>
                </header>
                <main id="main-content" class="container-fluid p-5 overflow-auto"></main>
            </div>
        </div>
    `;

    const nav = document.getElementById('sidebar-content');
    if (nav && window.MASTER_DB) {
        console.log("Generiere Liste für " + window.MASTER_DB.length + " Items");
        
        const kategorien = [...new Set(window.MASTER_DB.map(i => i.cat))];
        let html = "";

        kategorien.forEach(kat => {
            const items = window.MASTER_DB.filter(i => i.cat === kat);
            html += `
                <div class="mb-3">
                    <div style="color: #1164e2; font-weight: bold; text-transform: uppercase; font-size: 0.8rem; margin-bottom: 5px;">${kat}</div>
                    <ul style="list-style: none; padding-left: 10px; border-left: 1px solid #333;">
                        ${items.map(item => `
                            <li style="margin-bottom: 5px;">
                                <a href="javascript:void(0)" 
                                   style="color: #e0e0e0; text-decoration: none; font-size: 0.85rem;" 
                                   onclick="zeigeDetailsCloud('${item.item.replace(/'/g, "\\'")}')">
                                    ${item.item}
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        });
        nav.innerHTML = html;
    }
};

window.zeigeDetailsCloud = function(name) {
    const item = window.MASTER_DB.find(i => i.item === name);
    const main = document.getElementById('main-content');
    if (!item || !main) return;

    document.getElementById('header-title').innerText = item.item;
    main.innerHTML = `<h1 class="text-white">${item.item}</h1><p class="text-info">${item.cat}</p><div class="card bg-dark p-3 text-white-50 border-secondary"><pre>${JSON.stringify(item.herstellung, null, 2)}</pre></div>`;
};
