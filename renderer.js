window.startAppCloud = function() {
    const root = document.getElementById('root');
    if (!root) return;

    root.innerHTML = `
        <div id="wrapper" class="d-flex">
            <aside id="sidebar-wrapper" class="d-flex flex-column">
                <div class="sidebar-header">
                    <h2 class="h5 fw-bold mb-0">NN WERK BÄNKE</h2>
                    <div class="status-indicator">
                        <span class="dot"></span> Cloud-Sync aktiv
                    </div>
                </div>
                <div class="p-3">
                    <input type="text" id="suche" class="form-control" placeholder="Suchen...">
                </div>
                <nav id="sidebar-content" class="flex-grow-1 overflow-auto px-2"></nav>
            </aside>

            <div id="page-content-wrapper" class="flex-grow-1 d-flex flex-column">
                <header class="main-header shadow-sm">
                    <span id="header-title" class="category-badge">ÜBERSICHT</span>
                </header>
                <main id="item-details-view" class="p-5 overflow-auto"></main>
            </div>
        </div>
    `;

    if (window.MASTER_DB) baueSeitenleiste();
    
    document.getElementById('suche').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('.tree-list li').forEach(li => {
            li.style.display = li.textContent.toLowerCase().includes(term) ? 'block' : 'none';
        });
    });
};

function baueSeitenleiste() {
    const container = document.getElementById('sidebar-content');
    const kategorien = [...new Set(window.MASTER_DB.map(item => item.cat))];

    container.innerHTML = kategorien.map(kat => `
        <div class="tree-section">
            <div class="tree-category-title">${kat}</div>
            <ul class="tree-list">
                ${window.MASTER_DB.filter(i => i.cat === kat).map(item => `
                    <li><a href="#" onclick="zeigeDetailsCloud('${item.item.replace(/'/g, "\\'")}')">${item.item}</a></li>
                `).join('')}
            </ul>
        </div>
    `).join('');
}

window.zeigeDetailsCloud = function(itemName) {
    const item = window.MASTER_DB.find(i => i.item === itemName);
    const view = document.getElementById('item-details-view');
    if (!item) return;

    document.getElementById('header-title').innerText = item.cat.toUpperCase();

    const herstellungHtml = item.herstellung ? Object.entries(item.herstellung).map(([name, menge]) => `
        <div class="recipe-item">
            <span class="res-name">${name}</span>
            <span class="res-amount">x${menge}</span>
        </div>
    `).join('') : '<p class="text-muted small">Basis-Material</p>';

    const rewardsHtml = item.rewards ? Object.entries(item.rewards).map(([name, menge]) => `
        <div class="reward-pill">${menge}x ${name}</div>
    `).join('') : '-';

    view.innerHTML = `
        <div class="fade-in">
            <h1 class="item-title">${item.item}</h1>
            
            <div class="row g-4">
                <div class="col-md-7">
                    <div class="content-card shadow">
                        <h6 class="card-label">HERSTELLUNGS-REZEPT</h6>
                        <div class="recipe-list">${herstellungHtml}</div>
                    </div>
                </div>
                <div class="col-md-5">
                    <div class="content-card shadow">
                        <h6 class="card-label">SPEZIFIKATIONEN</h6>
                        <div class="stat-row"><span>Zeit:</span><b>${item.herstellzeit || 0}s</b></div>
                        <div class="stat-row"><span>Blueprint:</span><b class="${item.blueprint ? 'text-success' : 'text-danger'}">${item.blueprint ? 'JA' : 'NEIN'}</b></div>
                        <div class="stat-row border-0"><span>XP:</span><b class="text-warning">${item.xp || 0}</b></div>
                        
                        <div class="mt-4">
                            <h6 class="card-label">ERGEBNIS</h6>
                            <div class="d-flex flex-wrap gap-2">${rewardsHtml}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};
