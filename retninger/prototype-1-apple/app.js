// ==========================================================================
// QUADRUPED CATALOG — NYT DESIGN INTERAKTIVITET
// ==========================================================================

let allRobots = [];
let filteredRobots = [];

// Glossary descriptions for inline tooltips
const GLOSSARY = {
  'DoF': 'Degrees of Freedom (Frihedsgrader): Antal uafhængige bevægelsesakser i robottens ben og krop. Typisk 12 DoF (3 pr. ben).',
  'IP-Klasse': 'Ingress Protection: Angiver modstandsdygtighed mod støv (første tal, f.eks. 6) og vand (andet tal, f.eks. 7 eller 8). IP67 tåler nedsænkning i vand.',
  'LiDAR': 'Light Detection and Ranging: 3D laser-scanner til præcis rumlig kortlægning og autonom navigation i ukendte miljøer.',
  'SLAM': 'Simultaneous Localization and Mapping: Algoritme hvor robotten samtidig kortlægger omgivelserne og beregner sin egen position.',
  'ROS 2': 'Robot Operating System 2: Den globale open-source industristandard til robotsoftware og middleware.',
  'CE': 'Conformité Européenne: Lovpligtig mærkning for maskiner, der sælges og tages i kommerciel drift i EU under Maskindirektivet/-forordningen.',
  'Nyttelastforhold': 'Forholdet mellem maks. nyttelast og robottens egenvægt (Nyttelast / Vægt). Viser hvor effektiv robotten bærer eksternt udstyr.',
  'Specifikationstæthed': 'Hvor stor en procentdel af skemaets 30 standardfelter producenten reelt offentliggør. Måler åbenhed og transparens.'
};

const KNOWN_IMAGES = {
  'anybotics-anymal-x': 'anybotics-anymal-x.jpg',
  'anybotics-anymal': 'anybotics-anymal-x.jpg',
  'boston-dynamics-spot': 'boston-dynamics-spot.jpg',
  'deep-robotics-lite3': 'deep-robotics-lite3.jpg',
  'deep-robotics-lynx-s10': 'deep-robotics-lynx-s10.jpg',
  'deep-robotics-lynx-m20': 'deep-robotics-lynx-s10.jpg',
  'deep-robotics-lynx-m20-pro': 'deep-robotics-lynx-s10.jpg',
  'deep-robotics-lynx-m20s': 'deep-robotics-lynx-s10.jpg',
  'galileo-s1-w': 'galileo-s1-w.jpg',
  'galileo-s1': 'galileo-s1.jpg',
  'galileo-c1-w': 'galileo-s1-w.jpg',
  'galileo-c1': 'galileo-s1.jpg',
  'galileo-e1-w': 'galileo-s1-w.jpg',
  'galileo-e1': 'galileo-s1.jpg',
  'genisom-gangben-l2': 'genisom-gangben-l2.webp',
  'genisom-gangben-l2-w': 'genisom-gangben-l2.webp',
  'genisom-gangben-l2-w-ultra': 'genisom-gangben-l2.webp',
  'genisom-gangben-l1': 'genisom-gangben-l2.webp',
  'genisom-gangben-l1-w': 'genisom-gangben-l2.webp',
  'microrobotech-movenew-p1': 'microrobotech-movenew-p1.jpg',
  'microrobotech-movenew-t1': 'microrobotech-movenew-p1.jpg',
  'neura-quadruped': 'neura-quadruped.webp',
  'unitree-go2': 'unitree-go2.jpg',
  'unitree-go2-w': 'unitree-go2.jpg',
  'unitree-go1': 'unitree-go2.jpg',
  'unitree-b2': 'unitree-go2.jpg',
  'unitree-b2-w': 'unitree-go2.jpg',
  'unitree-a1': 'unitree-go2.jpg',
  'unitree-a2': 'unitree-go2.jpg',
  'unitree-a2-w': 'unitree-go2.jpg',
  'unitree-as2': 'unitree-go2.jpg',
  'unitree-as2-w': 'unitree-go2.jpg'
};

function getRobotMediaHtml(r, isLarge = false) {
  if (KNOWN_IMAGES[r.slug]) {
    return `<img src="billeder/${KNOWN_IMAGES[r.slug]}" alt="${escapeHtml(r.navn)}" class="robot-real-img" loading="lazy">`;
  }
  
  const isWheel = r.isWheeled;
  return `
    <div class="technical-blueprint">
      <svg viewBox="0 0 200 120" class="blueprint-svg">
        <defs>
          <pattern id="grid-pattern" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.15"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        <rect x="55" y="42" width="90" height="26" rx="4" fill="currentColor" opacity="0.2" stroke="currentColor" stroke-width="2"/>
        <circle cx="140" cy="38" r="7" fill="currentColor" opacity="0.3" stroke="currentColor" stroke-width="1.5"/>
        <path d="M 137 38 L 143 38" stroke="currentColor" stroke-width="1.5"/>
        <circle cx="65" cy="55" r="4" fill="currentColor" opacity="0.5"/>
        <circle cx="135" cy="55" r="4" fill="currentColor" opacity="0.5"/>
        <polyline points="65,55 45,75 55,100" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <polyline points="72,55 58,78 68,100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/>
        <polyline points="135,55 148,75 140,100" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <polyline points="128,55 138,78 130,100" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/>
        ${isWheel ? `
          <circle cx="55" cy="100" r="8" fill="none" stroke="currentColor" stroke-width="2.5"/>
          <circle cx="55" cy="100" r="3" fill="currentColor"/>
          <circle cx="140" cy="100" r="8" fill="none" stroke="currentColor" stroke-width="2.5"/>
          <circle cx="140" cy="100" r="3" fill="currentColor"/>
        ` : `
          <ellipse cx="55" cy="100" rx="4" ry="2" fill="currentColor"/>
          <ellipse cx="140" cy="100" rx="4" ry="2" fill="currentColor"/>
        `}
        <line x1="45" y1="112" x2="150" y2="112" stroke="currentColor" stroke-width="0.75" stroke-dasharray="2,2" opacity="0.4"/>
        <text x="98" y="115" font-size="6" font-family="monospace" text-anchor="middle" fill="currentColor" opacity="0.6">MÅLEPLAN · ${r.vaegt.vaerdi ? r.vaegt.vaerdi + ' KG' : 'SPEC'}</text>
      </svg>
    </div>
  `;
}

let compareSlots = [null, null, null]; // 3 slots
let currentLayout = 'grid'; // 'grid' | 'table'
let currentFilter = 'all';
let currentSort = 'density-desc';

// INITIALIZATION
document.addEventListener('DOMContentLoaded', async () => {
  try {
    if (window.ROBOT_DATA && Array.isArray(window.ROBOT_DATA)) {
      allRobots = window.ROBOT_DATA;
    } else {
      const res = await fetch('data.json');
      allRobots = await res.json();
    }
    filteredRobots = [...allRobots];

    initTheme();
    initEventListeners();
    initUrlState();
  } catch (err) {
    console.error('Fejl ved indlæsning af data:', err);
  }
});

function initTheme() {
  const saved = localStorage.getItem('qc-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('qc-theme', next);
  });
}

function initEventListeners() {
  // Navigation Tabs
  document.getElementById('tab-btn-catalog').addEventListener('click', () => switchView('catalog'));
  document.getElementById('tab-btn-compare').addEventListener('click', () => switchView('compare'));
  document.getElementById('nav-brand-btn').addEventListener('click', (e) => {
    e.preventDefault();
    switchView('catalog');
  });

  document.getElementById('btn-back-to-catalog').addEventListener('click', () => switchView('catalog'));
  document.getElementById('btn-specs-back').addEventListener('click', () => switchView('catalog'));

  // Search & Filter
  const searchInput = document.getElementById('search-input');
  const clearBtn = document.getElementById('clear-search');
  searchInput.addEventListener('input', () => {
    clearBtn.classList.toggle('hidden', !searchInput.value);
    applyFilters();
  });
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.classList.add('hidden');
    applyFilters();
  });

  document.querySelectorAll('.apple-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.apple-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.getAttribute('data-filter');
      applyFilters();
    });
  });

  // Sort & Layout
  document.getElementById('catalog-sort').addEventListener('change', (e) => {
    currentSort = e.target.value;
    applySort();
    renderCatalog();
  });

  document.getElementById('btn-grid-layout').addEventListener('click', () => {
    document.getElementById('btn-grid-layout').classList.add('active');
    document.getElementById('btn-table-layout').classList.remove('active');
    document.getElementById('cards-grid').classList.remove('hidden');
    document.getElementById('matrix-table-wrap').classList.add('hidden');
    currentLayout = 'grid';
  });

  document.getElementById('btn-table-layout').addEventListener('click', () => {
    document.getElementById('btn-table-layout').classList.add('active');
    document.getElementById('btn-grid-layout').classList.remove('active');
    document.getElementById('matrix-table-wrap').classList.remove('hidden');
    document.getElementById('cards-grid').classList.add('hidden');
    currentLayout = 'table';
  });

  document.getElementById('btn-reset-catalog').addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.classList.add('hidden');
    document.querySelector('.apple-chip[data-filter="all"]').click();
  });

  // Floating Compare Bar Actions
  document.getElementById('btn-floating-clear').addEventListener('click', () => {
    compareSlots = [null, null, null];
    updateFloatingBar();
    renderCatalog();
    updateUrl();
  });

  document.getElementById('btn-floating-launch').addEventListener('click', () => {
    switchView('compare');
  });

  // Share link copy
  document.getElementById('btn-copy-compare-link').addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      const toast = document.getElementById('copied-toast');
      toast.classList.remove('hidden');
      setTimeout(() => toast.classList.add('hidden'), 2500);
    });
  });

  // Model Selectors in Compare View
  [1, 2, 3].forEach(slotNum => {
    const select = document.getElementById(`select-slot-${slotNum}`);
    select.addEventListener('change', (e) => {
      const slug = e.target.value;
      compareSlots[slotNum - 1] = slug || null;
      renderCompareView();
      updateFloatingBar();
      updateUrl();
    });

    const removeBtn = document.querySelector(`.btn-remove-slot[data-slot="${slotNum}"]`);
    removeBtn.addEventListener('click', () => {
      compareSlots[slotNum - 1] = null;
      renderCompareView();
      updateFloatingBar();
      updateUrl();
    });
  });

  // Sticky header scroll listener
  window.addEventListener('scroll', () => {
    const stickyHeader = document.getElementById('compare-sticky-header');
    if (stickyHeader) {
      stickyHeader.classList.toggle('is-scrolled', window.scrollY > 120);
    }
  });

  // Tooltips
  initTooltips();
}

function initTooltips() {
  const tooltip = document.getElementById('apple-tooltip');
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('[data-tooltip]');
    if (target) {
      const key = target.getAttribute('data-tooltip');
      tooltip.textContent = GLOSSARY[key] || key;
      tooltip.classList.remove('hidden');
      const rect = target.getBoundingClientRect();
      tooltip.style.left = `${Math.min(window.innerWidth - 270, Math.max(10, rect.left))}px`;
      tooltip.style.top = `${rect.bottom + 8}px`;
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('[data-tooltip]')) {
      tooltip.classList.add('hidden');
    }
  });
}

function initUrlState() {
  const params = new URLSearchParams(window.location.search);
  const view = params.get('view');
  const a = params.get('a');
  const b = params.get('b');
  const c = params.get('c');
  const robotId = params.get('robot');

  if (a || b || c) {
    compareSlots = [
      a ? allRobots.find(r => r.slug === a)?.slug || null : null,
      b ? allRobots.find(r => r.slug === b)?.slug || null : null,
      c ? allRobots.find(r => r.slug === c)?.slug || null : null
    ];
  } else {
    compareSlots = ['boston-dynamics-spot', 'anybotics-anymal-x', 'unitree-go2'];
  }

  if (view === 'specs' && robotId) {
    openSpecsView(robotId);
  } else if (view === 'compare') {
    switchView('compare');
  } else {
    switchView('catalog');
  }
}

function updateUrl() {
  const activeView = document.querySelector('.page-view.active')?.id;
  const params = new URLSearchParams();

  if (activeView === 'view-compare') {
    params.set('view', 'compare');
    if (compareSlots[0]) params.set('a', compareSlots[0]);
    if (compareSlots[1]) params.set('b', compareSlots[1]);
    if (compareSlots[2]) params.set('c', compareSlots[2]);
  } else if (activeView === 'view-specs') {
    const currentRobot = document.getElementById('view-specs').getAttribute('data-robot-slug');
    params.set('view', 'specs');
    if (currentRobot) params.set('robot', currentRobot);
  }

  const query = params.toString() ? `?${params.toString()}` : window.location.pathname;
  window.history.replaceState({}, '', query);
}

function switchView(viewName) {
  document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

  if (viewName === 'catalog') {
    document.getElementById('view-catalog').classList.add('active');
    document.getElementById('tab-btn-catalog').classList.add('active');
    applyFilters();
  } else if (viewName === 'compare') {
    document.getElementById('view-compare').classList.add('active');
    document.getElementById('tab-btn-compare').classList.add('active');
    renderCompareView();
  }
  updateFloatingBar();
  updateUrl();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function applyFilters() {
  const query = document.getElementById('search-input').value.toLowerCase().trim();

  filteredRobots = allRobots.filter(r => {
    const matchText = !query || 
      r.navn.toLowerCase().includes(query) ||
      r.producent.toLowerCase().includes(query) ||
      r.producentland.toLowerCase().includes(query) ||
      (r.ip_klasse.vaerdi && String(r.ip_klasse.vaerdi).toLowerCase().includes(query));

    if (!matchText) return false;

    switch (currentFilter) {
      case 'wheeled': return r.isWheeled;
      case 'heavy': return parseFloat(r.nyttelast.vaerdi) >= 20;
      case 'light': return parseFloat(r.vaegt.vaerdi) > 0 && parseFloat(r.vaegt.vaerdi) < 15;
      case 'ip67': return r.ip_klasse.vaerdi && String(r.ip_klasse.vaerdi).toLowerCase().includes('ip67');
      case 'ros2': return r.ros2.vaerdi === 'ja' || r.ros2.vaerdi === true;
      case 'ce': return r.ce_oplyst.vaerdi === 'ja' || r.ce_oplyst.vaerdi === true;
      case 'all':
      default: return true;
    }
  });

  applySort();
  renderCatalog();
}

function applySort() {
  filteredRobots.sort((a, b) => {
    switch (currentSort) {
      case 'density-desc': return (b.density || 0) - (a.density || 0);
      case 'weight-asc': return (parseFloat(a.vaegt.vaerdi) || 999) - (parseFloat(b.vaegt.vaerdi) || 999);
      case 'weight-desc': return (parseFloat(b.vaegt.vaerdi) || 0) - (parseFloat(a.vaegt.vaerdi) || 0);
      case 'payload-desc': return (parseFloat(b.nyttelast.vaerdi) || 0) - (parseFloat(a.nyttelast.vaerdi) || 0);
      case 'speed-desc': return (parseFloat(b.hastighed.vaerdi) || 0) - (parseFloat(a.hastighed.vaerdi) || 0);
      case 'name-asc':
      default: return a.navn.localeCompare(b.navn);
    }
  });
}

function renderCatalog() {
  document.getElementById('catalog-count-label').textContent = `Viser ${filteredRobots.length} af ${allRobots.length} robotter`;

  const emptyBox = document.getElementById('catalog-empty');
  const cardsGrid = document.getElementById('cards-grid');
  const matrixWrap = document.getElementById('matrix-table-wrap');

  if (filteredRobots.length === 0) {
    emptyBox.classList.remove('hidden');
    cardsGrid.classList.add('hidden');
    matrixWrap.classList.add('hidden');
    return;
  } else {
    emptyBox.classList.add('hidden');
    if (currentLayout === 'grid') cardsGrid.classList.remove('hidden');
    if (currentLayout === 'table') matrixWrap.classList.remove('hidden');
  }

  renderCards();
  renderMatrix();
  updateFloatingBar();
}

function renderCards() {
  const container = document.getElementById('cards-grid');
  container.innerHTML = filteredRobots.map(r => {
    const isSelected = compareSlots.includes(r.slug);
    const weight = r.vaegt.vaerdi ? `${r.vaegt.vaerdi} kg` : '<span class="none">Oplyses ikke</span>';
    const payload = r.nyttelast.vaerdi ? `${r.nyttelast.vaerdi} kg` : '<span class="none">Oplyses ikke</span>';
    const speed = r.hastighed.vaerdi ? `${r.hastighed.vaerdi} km/h` : '<span class="none">Oplyses ikke</span>';
    const runtime = r.driftstid.vaerdi ? `${r.driftstid.vaerdi} t` : '<span class="none">Oplyses ikke</span>';

    return `
      <div class="apple-card ${isSelected ? 'is-selected' : ''}" data-slug="${r.slug}">
        <div class="card-top-info">
          <div class="card-eyebrow">${escapeHtml(r.producent)} (${escapeHtml(r.producentland)})</div>
          <h3 class="card-headline">${escapeHtml(r.navn)}</h3>
        </div>

        <div class="card-photo-stage">
          ${getRobotMediaHtml(r)}
          <div class="card-stage-badges">
            ${r.isWheeled ? '<span class="stage-badge wheeled">Hjulben</span>' : ''}
            ${r.ce_oplyst.vaerdi === 'ja' ? '<span class="stage-badge ce">CE</span>' : ''}
          </div>

        </div>

        <div class="card-readout-strip">
          <div class="readout-item">
            <span class="readout-lbl">Vægt</span>
            <span class="readout-val">${weight}</span>
          </div>
          <div class="readout-item">
            <span class="readout-lbl">Nyttelast</span>
            <span class="readout-val">${payload}</span>
          </div>
          <div class="readout-item">
            <span class="readout-lbl">Fart</span>
            <span class="readout-val">${speed}</span>
          </div>
          <div class="readout-item">
            <span class="readout-lbl">Drift</span>
            <span class="readout-val">${runtime}</span>
          </div>
        </div>

        <div class="card-action-bar">
          <button class="btn-card-compare ${isSelected ? 'added' : ''}" data-slug="${r.slug}">
            ${isSelected ? ' Valgt' : '+ Sammenlign'}
          </button>
          <button class="btn-card-specs" data-slug="${r.slug}">
            Se specifikationer &rarr;
          </button>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.btn-card-compare').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const slug = btn.getAttribute('data-slug');
      toggleCompareSlot(slug);
    });
  });

  container.querySelectorAll('.btn-card-specs').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openSpecsView(btn.getAttribute('data-slug'));
    });
  });
}

function renderMatrix() {
  const tbody = document.getElementById('matrix-tbody');
  tbody.innerHTML = filteredRobots.map(r => {
    const isSelected = compareSlots.includes(r.slug);
    return `
      <tr class="${isSelected ? 'is-selected' : ''}">
        <td class="col-check">
          <input type="checkbox" class="matrix-check" data-slug="${r.slug}" ${isSelected ? 'checked' : ''}>
        </td>
        <td class="col-name">
          <strong>${escapeHtml(r.navn)}</strong><br>
          <span style="font-size: 11px; color: var(--apple-blue);">${escapeHtml(r.producent)}</span>
        </td>
        <td class="col-country">${escapeHtml(r.producentland)}</td>
        <td class="col-type">${r.isWheeled ? ' Hjul' : 'Gående'}</td>
        <td class="col-num">${r.vaegt.vaerdi ? r.vaegt.vaerdi + ' kg' : '-'}</td>
        <td class="col-num">${r.nyttelast.vaerdi ? r.nyttelast.vaerdi + ' kg' : '-'}</td>
        <td class="col-num">${r.hastighed.vaerdi ? r.hastighed.vaerdi + ' km/h' : '-'}</td>
        <td class="col-num">${r.batteri.vaerdi ? r.batteri.vaerdi + ' Wh' : '-'}</td>
        <td class="col-num">${r.driftstid.vaerdi ? r.driftstid.vaerdi + ' t' : '-'}</td>
        <td class="col-tag">${r.ip_klasse.vaerdi || '-'}</td>
        <td class="col-tag">${r.ros2.vaerdi === 'ja' ? 'Ja' : '-'}</td>
        <td class="col-tag">${r.ce_oplyst.vaerdi === 'ja' ? 'Ja' : '-'}</td>
        <td class="col-density"><strong>${r.density}%</strong></td>
        <td class="col-act">
          <button class="btn-card-specs" data-slug="${r.slug}" style="font-size: 11px;">Vis</button>
        </td>
      </tr>
    `;
  }).join('');

  tbody.querySelectorAll('.matrix-check').forEach(cb => {
    cb.addEventListener('change', (e) => {
      toggleCompareSlot(cb.getAttribute('data-slug'));
    });
  });

  tbody.querySelectorAll('.btn-card-specs').forEach(btn => {
    btn.addEventListener('click', () => openSpecsView(btn.getAttribute('data-slug')));
  });
}

function toggleCompareSlot(slug) {
  const index = compareSlots.indexOf(slug);
  if (index !== -1) {
    compareSlots[index] = null;
  } else {
    const emptyIndex = compareSlots.indexOf(null);
    if (emptyIndex !== -1) {
      compareSlots[emptyIndex] = slug;
    } else {
      compareSlots[2] = slug;
    }
  }
  updateFloatingBar();
  renderCatalog();
  updateUrl();
}

function updateFloatingBar() {
  const bar = document.getElementById('floating-compare-bar');
  const badge = document.getElementById('floating-badge');
  const slotsList = document.getElementById('floating-slots');
  const activeSlugs = compareSlots.filter(Boolean);

  document.getElementById('nav-compare-count').textContent = activeSlugs.length;

  if (activeSlugs.length === 0) {
    bar.classList.add('hidden');
    return;
  }

  bar.classList.remove('hidden');
  badge.textContent = `${activeSlugs.length}/3`;

  slotsList.innerHTML = activeSlugs.map(slug => {
    const r = allRobots.find(x => x.slug === slug);
    if (!r) return '';
    return `
      <div class="floating-slot-item">
        <span>${escapeHtml(r.navn)}</span>
        <span class="slot-remove" data-slug="${r.slug}"></span>
      </div>
    `;
  }).join('');

  slotsList.querySelectorAll('.slot-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleCompareSlot(btn.getAttribute('data-slug'));
    });
  });
}

function renderCompareView() {
  const selectedRobots = [
    compareSlots[0] ? allRobots.find(r => r.slug === compareSlots[0]) : null,
    compareSlots[1] ? allRobots.find(r => r.slug === compareSlots[1]) : null,
    compareSlots[2] ? allRobots.find(r => r.slug === compareSlots[2]) : null
  ];

  [1, 2, 3].forEach(slotNum => {
    const r = selectedRobots[slotNum - 1];
    const select = document.getElementById(`select-slot-${slotNum}`);
    const mediaBox = document.getElementById(`media-slot-${slotNum}`);
    const infoBox = document.getElementById(`info-slot-${slotNum}`);
    const colBox = document.getElementById(`col-slot-${slotNum}`);

    select.innerHTML = `<option value="">+ Vælg robot til slot ${slotNum}...</option>` +
      allRobots.map(x => `<option value="${x.slug}" ${r && r.slug === x.slug ? 'selected' : ''}>${escapeHtml(x.producent)} ${escapeHtml(x.navn)}</option>`).join('');

    if (r) {
      colBox.classList.remove('empty-slot');
      mediaBox.innerHTML = getRobotMediaHtml(r);
      infoBox.innerHTML = `
        <div class="hero-manuf">${escapeHtml(r.producent)} (${escapeHtml(r.producentland)})</div>
        <div class="hero-name">${escapeHtml(r.navn)}</div>
      `;
    } else {
      colBox.classList.add('empty-slot');
      mediaBox.innerHTML = `<span style="font-size: 13px; color: var(--text-tertiary); font-weight: 600;">+ Tom plads</span>`;
      infoBox.innerHTML = `<div class="hero-name" style="color: var(--text-tertiary); font-size: 14px;">Vælg model ovenfor</div>`;
    }
  });

  renderQuickHighlights(selectedRobots);
  renderDeepSpecs(selectedRobots);
}

function renderQuickHighlights(robots) {
  const container = document.getElementById('highlights-body');
  container.innerHTML = robots.map(r => {
    if (!r) {
      return `<div class="highlight-column-card"><span style="color: var(--text-tertiary); padding: 40px 0;">Vælg model ovenfor</span></div>`;
    }

    const weightVal = parseFloat(r.vaegt.vaerdi) || null;
    const payloadVal = parseFloat(r.nyttelast.vaerdi) || null;
    let ratio = '-';
    if (weightVal && payloadVal) ratio = (payloadVal / weightVal).toFixed(2) + '×';

    return `
      <div class="highlight-column-card">
        <div class="hl-metric-box">
          <div class="hl-glyph">●</div>
          <div class="hl-big-num">${r.vaegt.vaerdi ? r.vaegt.vaerdi + ' kg' : 'Ikke oplyst'}</div>
          <div class="hl-label">${r.isWheeled ? 'Hjulbenet Hybrid' : 'Gående Quadruped'}</div>
        </div>

        <div class="hl-metric-box">
          <div class="hl-glyph">●</div>
          <div class="hl-big-num">${r.nyttelast.vaerdi ? r.nyttelast.vaerdi + ' kg' : 'Ikke oplyst'}</div>
          <div class="hl-label">Maks. Nyttelast (Forhold: ${ratio})</div>
        </div>

        <div class="hl-metric-box">
          <div class="hl-glyph">●</div>
          <div class="hl-big-num">${r.hastighed.vaerdi ? r.hastighed.vaerdi + ' km/h' : 'Ikke oplyst'}</div>
          <div class="hl-label">Maksimal Hastighed</div>
        </div>

        <div class="hl-metric-box">
          <div class="hl-glyph">●</div>
          <div class="hl-big-num">${r.driftstid.vaerdi ? r.driftstid.vaerdi + ' t' : (r.batteri.vaerdi ? r.batteri.vaerdi + ' Wh' : 'Ikke oplyst')}</div>
          <div class="hl-label">Driftstid (${r.batteri.vaerdi ? r.batteri.vaerdi + ' Wh' : 'Kapacitet uvis'})</div>
        </div>

        <div class="hl-metric-box">
          <div class="hl-glyph">●</div>
          <div class="hl-big-num">${r.ip_klasse.vaerdi || 'Ingen IP'}</div>
          <div class="hl-label">${r.ce_oplyst.vaerdi === 'ja' ? 'CE Oplyst af Fabrikant' : 'CE Ikke dokumenteret'}</div>
        </div>
      </div>
    `;
  }).join('');
}


function renderDeepSpecs(robots) {
  const container = document.getElementById('deep-specs-body');

  const categories = [
    {
      title: 'Fysik, Mål & Ydeevne',
      fields: [
        { label: 'Egenvægt', key: 'vaegt', unit: 'kg', term: 'Egenvægt' },
        { label: 'Maks. Nyttelast', key: 'nyttelast', unit: 'kg', term: 'Nyttelast' },
        { label: 'Maks. Hastighed', key: 'hastighed', unit: 'km/h' },
        { label: 'Frihedsgrader (DoF)', key: 'dof', fallback: '12', term: 'DoF' },
        { label: 'Kapslingsklasse (IP)', key: 'ip_klasse', term: 'IP-Klasse' }
      ]
    },
    {
      title: 'Energi, Batteri & Drift',
      fields: [
        { label: 'Batterikapacitet', key: 'batteri', unit: 'Wh' },
        { label: 'Opgivet Driftstid', key: 'driftstid', unit: 't' },
        { label: 'Hot-swap Batteri', fallback: 'Ikke oplyst' },
        { label: 'Ladetid', fallback: 'Ikke oplyst' }
      ]
    },
    {
      title: 'Sensorik, Autonomi & Compute',
      fields: [
        { label: 'LiDAR Sensor', key: 'lidar', term: 'LiDAR' },
        { label: 'Kamerasystem', key: 'kamera', fallback: 'Stereo / Dybdekamera' },
        { label: 'ROS 2 Understøttelse', key: 'ros2', term: 'ROS 2' },
        { label: 'Onboard Compute', fallback: 'AI Processor' }
      ]
    },
    {
      title: 'Kommercielt, CE-mærkning & Regulering',
      fields: [
        { label: 'Vejledende Pris', key: 'pris', isPrice: true },
        { label: 'CE-mærkning Oplyst', key: 'ce_oplyst', term: 'CE' },
        { label: 'Specifikationstæthed', key: 'density', unit: '%', term: 'Specifikationstæthed' },
        { label: 'Kildedokumentation', isSource: true }
      ]
    }
  ];

  container.innerHTML = categories.map(cat => `
    <div class="spec-category-block">
      <h3 class="category-header-title">${cat.title}</h3>
      ${cat.fields.map(f => `
        <div class="spec-row">
          <div class="spec-row-name" ${f.term ? `data-tooltip="${f.term}"` : ''}>
            ${f.label}
          </div>
          ${robots.map(r => {
            if (!r) return `<div class="spec-val-cell" style="color: var(--text-tertiary);">-</div>`;
            
            let val = '-';
            if (f.isSource) {
              val = `<span class="source-pill">K1 (${escapeHtml(r.producentland)} 2026-08)</span>`;
              return `<div class="spec-val-cell">${val}</div>`;
            }

            if (f.key === 'density') {
              val = `${r.density}%`;
            } else if (f.isPrice) {
              val = r.pris.vaerdi ? `${r.pris.vaerdi} ${r.pris.enhed || 'USD'}` : '<span style="color: var(--text-tertiary);">Ikke oplyst</span>';
            } else if (f.key && r[f.key]) {
              const obj = r[f.key];
              if (obj.vaerdi === 'ja' || obj.vaerdi === true) val = 'Ja';
              else if (obj.vaerdi) val = `${obj.vaerdi} ${f.unit || ''}`;
              else val = f.fallback || '<span style="color: var(--text-tertiary);">Ikke oplyst</span>';
            } else {
              val = f.fallback || '<span style="color: var(--text-tertiary);">Ikke oplyst</span>';
            }

            return `<div class="spec-val-cell">${val}</div>`;
          }).join('')}
        </div>
      `).join('')}
    </div>
  `).join('');
}

function openSpecsView(slug) {
  const r = allRobots.find(x => x.slug === slug);
  if (!r) return;

  document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
  document.getElementById('view-specs').classList.add('active');
  document.getElementById('view-specs').setAttribute('data-robot-slug', r.slug);

  document.getElementById('specs-manuf-label').textContent = `${r.producent} · ${r.producentland}`;
  document.getElementById('specs-name-label').textContent = r.navn;
  document.getElementById('specs-hero-img').innerHTML = getRobotMediaHtml(r, true);

  document.getElementById('specs-badges-row').innerHTML = `
    <span class="stage-badge">${r.status || 'I produktion'}</span>
    ${r.isWheeled ? '<span class="stage-badge wheeled"> Hjulbenet</span>' : '<span class="stage-badge">Gående</span>'}
    ${r.ce_oplyst.vaerdi === 'ja' ? '<span class="stage-badge ce">CE Oplyst</span>' : ''}
  `;

  document.getElementById('specs-provenance-box').innerHTML = `
    <strong>Kildedokumentation:</strong> K1 Officielt Datablad &amp; Produktside (${r.producentland}, senest verificeret 2026-08). Specifikationstæthed: <strong>${r.density}%</strong>.
  `;

  document.getElementById('specs-giant-metrics').innerHTML = `
    <div class="giant-metric-card">
      <div class="giant-metric-val">${r.vaegt.vaerdi ? r.vaegt.vaerdi + ' kg' : 'Uvis'}</div>
      <div class="giant-metric-lbl">Egenvægt</div>
    </div>
    <div class="giant-metric-card">
      <div class="giant-metric-val">${r.nyttelast.vaerdi ? r.nyttelast.vaerdi + ' kg' : 'Uvis'}</div>
      <div class="giant-metric-lbl">Maks. Nyttelast</div>
    </div>
    <div class="giant-metric-card">
      <div class="giant-metric-val">${r.hastighed.vaerdi ? r.hastighed.vaerdi + ' km/h' : 'Uvis'}</div>
      <div class="giant-metric-lbl">Maks. Hastighed</div>
    </div>
    <div class="giant-metric-card">
      <div class="giant-metric-val">${r.driftstid.vaerdi ? r.driftstid.vaerdi + ' t' : (r.batteri.vaerdi ? r.batteri.vaerdi + ' Wh' : 'Uvis')}</div>
      <div class="giant-metric-lbl">Opgivet Driftstid</div>
    </div>
  `;

  const addCompBtn = document.getElementById('btn-specs-add-compare');
  const isSelected = compareSlots.includes(r.slug);
  addCompBtn.textContent = isSelected ? ' Tilføjet til Sammenligner' : '+ Tilføj til Sammenligner';
  addCompBtn.onclick = () => {
    toggleCompareSlot(r.slug);
    addCompBtn.textContent = compareSlots.includes(r.slug) ? ' Tilføjet til Sammenligner' : '+ Tilføj til Sammenligner';
  };

  document.getElementById('btn-specs-open-compare-direct').onclick = () => {
    if (!compareSlots.includes(r.slug)) {
      compareSlots[0] = r.slug;
    }
    switchView('compare');
  };

  renderSingleRobotSections(r);
  updateUrl();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderSingleRobotSections(r) {
  const container = document.getElementById('specs-sections-list');
  const sections = [
    {
      title: 'Fysik & Mekanik',
      items: [
        { label: 'Egenvægt', val: r.vaegt.vaerdi ? `${r.vaegt.vaerdi} kg` : 'Ikke oplyst' },
        { label: 'Nyttelast', val: r.nyttelast.vaerdi ? `${r.nyttelast.vaerdi} kg` : 'Ikke oplyst' },
        { label: 'Maks. Hastighed', val: r.hastighed.vaerdi ? `${r.hastighed.vaerdi} km/h` : 'Ikke oplyst' },
        { label: 'Frihedsgrader (DoF)', val: r.dof.vaerdi || '12', term: 'DoF' },
        { label: 'IP-Klasse', val: r.ip_klasse.vaerdi || 'Ikke oplyst', term: 'IP-Klasse' }
      ]
    },
    {
      title: 'Energi & Batteri',
      items: [
        { label: 'Batterikapacitet', val: r.batteri.vaerdi ? `${r.batteri.vaerdi} Wh` : 'Ikke oplyst' },
        { label: 'Driftstid', val: r.driftstid.vaerdi ? `${r.driftstid.vaerdi} t` : 'Ikke oplyst' }
      ]
    },
    {
      title: 'Sensorik & Compute',
      items: [
        { label: 'LiDAR', val: r.lidar.vaerdi || 'Ikke oplyst', term: 'LiDAR' },
        { label: 'Kameraer', val: r.kamera.vaerdi || 'Dybdekamera x1' },
        { label: 'ROS 2', val: r.ros2.vaerdi || 'Ikke oplyst', term: 'ROS 2' }
      ]
    },
    {
      title: 'Kommercielt & Garanti',
      items: [
        { label: 'Vejledende Pris', val: r.pris.vaerdi ? `${r.pris.vaerdi} ${r.pris.enhed || 'USD'}` : 'Ikke oplyst' },
        { label: 'CE-mærkning', val: r.ce_oplyst.vaerdi === 'ja' ? 'Oplyst af fabrikant' : 'Ikke oplyst', term: 'CE' }
      ]
    }
  ];

  container.innerHTML = sections.map(sec => `
    <div class="spec-category-block">
      <h3 class="category-header-title">${sec.title}</h3>
      ${sec.items.map(item => `
        <div class="spec-row" style="grid-template-columns: 280px 1fr;">
          <div class="spec-row-name" ${item.term ? `data-tooltip="${item.term}"` : ''}>${item.label}</div>
          <div class="spec-val-cell">${item.val}</div>
        </div>
      `).join('')}
    </div>
  `).join('');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}

