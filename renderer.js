window.startAppCloud = function() {
    const root = document.getElementById('root');
    if (!root) return;

    root.innerHTML = `
        <div id="wrapper" class="d-flex" style="height: 100vh;">
            <aside id="sidebar-wrapper" class="border-end border-dark d-flex flex-column">
                <div class="p-4 border-bottom border-dark text-center bg-sidebar-header">
                    <h2 class="fw-bold text-white mb-0" style="letter-spacing: -1px;">NN Werkbänke</h2>
                    <small class="text-success" style="font-size: 0.7rem;">
                        <i class="bi bi-cloud-check-fill me-1"></i>Cloud-Sync aktiv
                    </small>
                </div>
                <div class="p-3 bg-sidebar-dark">
                    <div class="input-group">
                        <span class="input-group-text bg-dark border-secondary text-muted"><i class="bi bi-search"></i></span>
                        <input type="text" id="suche" class="form-control bg-dark border-secondary text-white" placeholder="Suchen...">
                    </div>
                </div>
                <nav id="sidebar-content" class="flex-grow-1 overflow-auto px-3 bg-sidebar-dark"></nav>
            </aside>

            <div id="page-content-wrapper" class="flex-grow-1 d-flex flex-column bg-main">
                <header class="navbar border-bottom border-dark p-3 bg-main shadow-sm">
                    <span id="header-title" class="text-secondary small fw-bold tracking-widest">ÜBERSICHT</span>
                </header>
                <main id="item-details-view" class="container-fluid p-5 overflow-auto"></main>
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
        <div class="tree-section mb-3">
            <div class="tree-category-title text-info">${kat}</div>
            <ul class="tree-list list-unstyled ps-2">
                ${window.MASTER_DB.filter(i => i.cat === kat).map(item => `
                    <li class="mb-1">
                        <a href="#" class="sidebar-link d-block p-1" onclick="zeigeDetailsCloud('${item.item.replace(/'/g, "\\'")}')">
                            <i class="bi bi-chevron-right small opacity-50 me-1"></i>${item.item}
                        </a>
                    </li>
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
        <div class="d-flex justify-content-between align-items-center border-bottom border-dark py-2">
            <span class="text-light-emphasis"><i class="bi bi-box-seam me-2 text-info"></i>${name}</span>
            <span class="badge bg-dark border border-secondary text-white px-3">x${menge}</span>
        </div>
    `).join('') : '<p class="text-muted italic">Basis-Material (keine Herstellung nötig)</p>';

    const rewardsHtml = item.rewards ? Object.entries(item.rewards).map(([name, menge]) => `
        <div class="reward-tag bg-dark border border-secondary rounded p-2 mb-2 d-inline-block me-2">
            <span class="text-success fw-bold">${menge}x</span> <span class="text-light">${name}</span>
        </div>
    `).join('') : '<span class="text-muted">-</span>';

    view.innerHTML = `
        <div class="fade-in">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb mb-1">
                    <li class="breadcrumb-item text-info small fw-bold text-uppercase">${item.cat}</li>
                </ol>
            </nav>
            <h1 class="display-5 fw-bold text-white mb-4">${item.item}</h1>
            
            <div class="row g-4">
                <div class="col-md-7">
                    <div class="card detail-card h-100 p-4 shadow">
                        <h5 class="text-info mb-4 text-uppercase small fw-bold"><i class="bi bi-hammer me-2"></i>Herstellungsplan</h5>
                        <div class="recipe-container">
                            ${herstellungHtml}
                        </div>
                    </div>
                </div>
                <div class="col-md-5">
                    <div class="card detail-card h-100 p-4 shadow">
                        <h5 class="text-info mb-4 text-uppercase small fw-bold"><i class="bi bi-info-circle me-2"></i>Spezifikationen</h5>
                        <div class="d-flex justify-content-between mb-3 pb-2 border-bottom border-dark">
                            <span class="text-secondary">Dauer:</span>
                            <span class="text-white"><i class="bi bi-clock me-1 text-muted"></i>${item.herstellzeit || 0}s</span>
                        </div>
                        <div class="d-flex justify-content-between mb-3 pb-2 border-bottom border-dark">
                            <span class="text-secondary">Bauplan nötig:</span>
                            <span class="${item.blueprint ? 'text-success' : 'text-danger'} fw-bold">
                                ${item.blueprint ? '<i class="bi bi-check-all"></i> JA' : '<i class="bi bi-slash-circle"></i> NEIN'}
                            </span>
                        </div>
                        <div class="d-flex justify-content-between mb-4 pb-2 border-bottom border-dark">
                            <span class="text-secondary">Erfahrung:</span>
                            <span class="text-warning fw-bold">+${item.xp || 0} XP</span>
                        </div>
                        <div class="mt-4">
                            <div class="text-secondary small text-uppercase fw-bold mb-3">Ertrag:</div>
                            ${rewardsHtml}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
};
