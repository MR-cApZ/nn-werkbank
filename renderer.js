/**
 * Baue die Tree-View Seitenleiste
 */
function baueSeitenleiste() {
    const container = document.getElementById('sidebar-content');
    if (!container) return;
    container.innerHTML = '';

    const kategorien = [...new Set(window.MASTER_DB.map(item => item.cat))];

    kategorien.forEach(kat => {
        const catId = `cat-${kat.replace(/\s/g, '')}`;
        const itemsInCat = window.MASTER_DB.filter(i => i.cat === kat);

        const section = document.createElement('div');
        section.className = 'tree-section mb-2';
        section.innerHTML = `
            <div class="tree-category-title d-flex justify-content-between align-items-center" data-bs-toggle="collapse" data-bs-target="#${catId}">
                <span>${kat}</span>
                <i class="bi bi-chevron-down opacity-50" style="font-size: 0.7rem;"></i>
            </div>
            <div class="collapse show" id="${catId}">
                <ul class="tree-list mt-1">
                    ${itemsInCat.map(item => `
                        <li><a href="javascript:void(0)" onclick="zeigeDetails('${item.item.replace(/'/g, "\\'")}')">${item.item}</a></li>
                    `).join('')}
                </ul>
            </div>
        `;
        container.appendChild(section);
    });
}

/**
 * Zeige Item-Details rechts an
 */
function zeigeDetails(itemName) {
    const item = window.MASTER_DB.find(i => i.item === itemName);
    const view = document.getElementById('item-details-view');
    if (!item || !view) return;

    // Herstellung-Liste bauen
    let herstellungHtml = "";
    if (item.herstellung) {
        herstellungHtml = Object.entries(item.herstellung).map(([name, menge]) => `
            <div class="material-item d-flex justify-content-between align-items-center">
                <span class="text-white"><i class="bi bi-box-seam me-2 opacity-50"></i>${name}</span>
                <span class="fw-bold text-accent">x${menge}</span>
            </div>
        `).join('');
    } else {
        herstellungHtml = `<div class="p-3 text-secondary fst-italic border border-secondary border-dashed rounded text-center">Basis-Material (Kein Rezept verfügbar)</div>`;
    }

    const bpLabel = item.blueprint === true 
        ? '<span style="color: var(--success)"><i class="bi bi-check-circle-fill me-1"></i>JA</span>' 
        : '<span style="color: var(--danger)"><i class="bi bi-x-circle me-1"></i>NEIN</span>';

    view.innerHTML = `
        <div class="fade-in">
            <div class="mb-1">
                <span class="badge bg-dark text-accent border border-secondary text-uppercase" style="letter-spacing: 1px; font-size: 0.7rem;">${item.cat}</span>
            </div>
            <h1 class="display-5 fw-bold mb-4 text-white">${item.item}</h1>

            <div class="row g-4">
                <div class="col-md-7">
                    <div class="card detail-card p-4 h-100">
                        <h6 class="mb-4 text-secondary text-uppercase fw-bold" style="letter-spacing: 1px;">
                            <i class="bi bi-hammer me-2 text-accent"></i>HERSTELLUNG
                        </h6>
                        <div class="material-list">
                            ${herstellungHtml}
                        </div>
                    </div>
                </div>
                
                <div class="col-md-5">
                    <div class="card detail-card p-4 h-100">
                        <h6 class="mb-4 text-secondary text-uppercase fw-bold" style="letter-spacing: 1px;">
                            <i class="bi bi-info-circle me-2 text-accent"></i>Informationen
                        </h6>
                        
                        <div class="mb-3 d-flex justify-content-between align-items-center py-1 border-bottom border-secondary border-opacity-25">
                            <span class="text-secondary">Herstellungszeit:</span>
                            <span class="text-white fw-bold">${item.herstellzeit || 0}s</span>
                        </div>
                        <div class="mb-3 d-flex justify-content-between align-items-center py-1 border-bottom border-secondary border-opacity-25">
                            <span class="text-secondary">Blueprint benötigt:</span>
                            <span class="fw-bold">${bpLabel}</span>
                        </div>
                        <div class="mb-3 d-flex justify-content-between align-items-center py-1 border-bottom border-secondary border-opacity-25">
                            <span class="text-secondary">XP Bonus:</span>
                            <span class="text-accent fw-bold">${item.xp || 0} XP</span>
                        </div>
                        
                        <div class="mt-4 pt-2">
                            <div class="small text-secondary text-uppercase fw-bold mb-3" style="font-size: 0.65rem;">Ergebnis / Belohnungen:</div>
                            <div class="d-flex flex-wrap gap-2">
                                ${Object.entries(item.rewards || {}).map(([name, menge]) => `<span class="reward-tag">${menge}x ${name}</span>`).join('') || '<span class="text-muted">Keine</span>'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Suche & Start-Logik bleibt gleich wie in deinem Post...
