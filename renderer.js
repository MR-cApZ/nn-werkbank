/**
 * Baue die Tree-View Seitenleiste
 */
function baueSeitenleiste() {
    const container = document.getElementById('sidebar-content');
    container.innerHTML = '';

    // Einzigartige Kategorien holen
    const kategorien = [...new Set(window.MASTER_DB.map(item => item.cat))];

    kategorien.forEach(kat => {
        const catId = `cat-${kat.replace(/\s/g, '')}`;
        const itemsInCat = window.MASTER_DB.filter(i => i.cat === kat);

        const section = document.createElement('div');
        section.className = 'tree-section mb-2';
        section.innerHTML = `
            <div class="tree-category-title" data-bs-toggle="collapse" data-bs-target="#${catId}">
                <span>${kat}</span>
                <i class="bi bi-chevron-down small opacity-50"></i>
            </div>
            <div class="collapse show" id="${catId}">
                <ul class="tree-list">
                    ${itemsInCat.map(item => `
                        <li><a href="#" onclick="zeigeDetails('${item.item}')">${item.item}</a></li>
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

    // Herstellung-Liste bauen
    let herstellungHtml = "";
    if (item.herstellung) {
        herstellungHtml = Object.entries(item.herstellung).map(([name, menge]) => `
            <div class="d-flex justify-content-between border-bottom border-secondary py-2">
                <span><i class="bi bi-box-seam me-2 opacity-50"></i>${name}</span>
                <span class="fw-bold ">x${menge}</span>
            </div>
        `).join('');
    } else {
        herstellungHtml = `<p class="fst-italic p-3 bg-dark rounded">${item.desc || "Basis-Material (Kein Rezept verfügbar)"}</p>`;
    }

    // Helfer für Belohnungen/Listen
    function formatListe(obj) {
        if (!obj) return '<span class="">Keine</span>';
        return Object.entries(obj)
            .map(([name, menge]) => `<span class="reward-tag">${menge}x ${name}</span>`)
            .join(' ');
    }

    // Blueprint Check für schönere Anzeige
    const bpLabel = item.blueprint === true 
        ? '<span class="text-success"><i class="bi bi-check-circle-fill me-1"></i>Ja</span>' 
        : '<span class="text-danger"><i class="bi bi-x-circle me-1"></i>Nein</span>';

    view.innerHTML = `
        <div class="fade-in">
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb mb-1">
                <li class="breadcrumb-item small text-uppercase text-info fw-bold" style="letter-spacing: 1px;">${item.cat}</li>
              </ol>
            </nav>
            <h1 class="display-5 fw-bold mb-4 text-white">${item.item}</h1>

            <div class="row g-4">
                <div class="col-md-7">
                    <div class="card detail-card p-4 h-100">
                        <h5 class="mb-4 text-light border-bottom border-secondary pb-2">
                            <i class="bi bi-hammer me-2 text-primary"></i>HERSTELLUNG
                        </h5>
                        <div class="text-white-50">
                            ${herstellungHtml}
                        </div>
                    </div>
                </div>
                
                <div class="col-md-5">
                    <div class="card detail-card p-4 h-100">
                        <h5 class="mb-4 text-light border-bottom border-secondary pb-2">
                            <i class="bi bi-bar-chart me-2 text-primary"></i>Informationen
                        </h5>
                        
                        <div class="mb-3 d-flex justify-content-between text-white">
                            <span class="">Zeit:</span>
                            <span class="fw-bold">${item.herstellzeit || 0}s</span>
                        </div>
                        <div class="mb-3 d-flex justify-content-between text-white">
                            <span class="">Blueprint:</span>
                            <span class="">${bpLabel}</span>
                        </div>
                        <div class="mb-3 d-flex justify-content-between text-white">
                            <span class="">XP benötigt:</span>
                            <span class="text-info fw-bold">${item.xp || 0}</span>
                        </div>
                        
                        <div class="mt-4">
                            <div class="small mb-2 text-uppercase">Belohnungen:</div>
                            <div class="d-flex flex-wrap gap-2 text-white">
                                ${formatListe(item.rewards)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;y
}

/**
 * Suche & Filter Logik
 */
document.getElementById('suche').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const sections = document.querySelectorAll('.tree-section');
    
    sections.forEach(section => {
        const items = section.querySelectorAll('li');
        let hasVisibleItems = false;

        items.forEach(li => {
            const text = li.textContent.toLowerCase();
            const visible = text.includes(term);
            li.style.display = visible ? 'block' : 'none';
            if (visible) hasVisibleItems = true;
        });

        // Verstecke die ganze Kategorie, wenn kein Item passt
        section.style.display = hasVisibleItems ? 'block' : 'none';
    });
});

// Start
document.addEventListener('DOMContentLoaded', () => {
    baueSeitenleiste();
});
