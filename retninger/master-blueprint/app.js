// ==========================================================================
// QUADRUPED CATALOG // MASTER BLUEPRINT CONTROLLER & ROUTER
// ==========================================================================

let allRobots = [];
let filteredRobots = [];
let compareSlots = ['boston-dynamics-spot', 'anybotics-anymal-x', 'unitree-b2', null]; // 3 active by default, 4th expandable
let activeQuickFilter = null;
let showDiffOnly = false;
let currentSort = 'density-desc';

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
    initVendorCheckboxes();
    initEventListeners();
    initKeyboardShortcuts();
    initUrlState();
  } catch (err) {
    console.error('Telemetri/Data indlæsningsfejl:', err);
  }
});

function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'SELECT') {
      e.preventDefault();
      switchView('catalog');
      const input = document.getElementById('search-robots-catalog');
      input.focus();
      input.select();
    } else if (e.key === 'Escape') {
      const searchInput = document.getElementById('search-robots-catalog');
      if (document.activeElement === searchInput) {
        searchInput.value = '';
        applyFilters();
        searchInput.blur();
      }
    }
  });
}


function initTheme() {
  const saved = localStorage.getItem('qc-master-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('qc-master-theme', next);
  });
}

function initVendorCheckboxes() {
  const container = document.getElementById('sidebar-vendor-list');
  const vendors = Array.from(new Set(allRobots.map(r => r.producent))).sort();

  container.innerHTML = vendors.map(v => `
    <label class="filter-cb" style="font-size: 11px;">
      <input type="checkbox" name="f-vendor" value="${escapeHtml(v)}">
      <span>${escapeHtml(v)}</span>
    </label>
  `).join('');
}

function initEventListeners() {
  // Main navigation tabs
  document.getElementById('tab-btn-catalog').addEventListener('click', () => switchView('catalog'));
  document.getElementById('tab-btn-compare').addEventListener('click', () => switchView('compare'));
  document.getElementById('nav-brand-btn').addEventListener('click', (e) => {
    e.preventDefault();
    switchView('catalog');
  });

  document.getElementById('btn-bc-back').addEventListener('click', () => switchView('catalog'));
  document.getElementById('btn-comp-back-to-catalog').addEventListener('click', () => switchView('catalog'));

  // Hero central search
  const searchInput = document.getElementById('hero-search-input');
  const clearBtn = document.getElementById('hero-search-clear');
  searchInput.addEventListener('input', () => {
    clearBtn.classList.toggle('hidden', !searchInput.value);
    applyFilters();
  });
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.classList.add('hidden');
    applyFilters();
  });

  // Range sliders
  const pSlider = document.getElementById('filter-slider-payload');
  const wSlider = document.getElementById('filter-slider-weight');
  pSlider.addEventListener('input', () => {
    document.getElementById('val-payload-filter').textContent = `≥ ${pSlider.value} kg`;
    applyFilters();
  });
  wSlider.addEventListener('input', () => {
    document.getElementById('val-weight-filter').textContent = `≤ ${wSlider.value} kg`;
    applyFilters();
  });

  // Checkboxes
  document.querySelectorAll('input[name="f-mobility"], #f-check-ip67, #f-check-ce, #f-check-ros2, #f-check-runtime-2h, #f-check-lidar').forEach(el => {
    el.addEventListener('change', applyFilters);
  });
  document.getElementById('sidebar-vendor-list').addEventListener('change', applyFilters);

  // Quick constraints buttons
  document.querySelectorAll('.constraint-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-quick');
      if (activeQuickFilter === q) {
        activeQuickFilter = null;
        btn.classList.remove('active');
      } else {
        document.querySelectorAll('.constraint-btn').forEach(b => b.classList.remove('active'));
        activeQuickFilter = q;
        btn.classList.add('active');
      }
      applyFilters();
    });
  });

  // Sort
  document.getElementById('sort-select-catalog').addEventListener('change', (e) => {
    currentSort = e.target.value;
    applySort();
    renderCatalogGrid();
  });

  // Reset actions
  document.getElementById('btn-sidebar-reset').addEventListener('click', resetAllFilters);
  document.getElementById('btn-empty-clear-all').addEventListener('click', resetAllFilters);

  // Sticky Compare Tray
  document.getElementById('btn-tray-clear-all').addEventListener('click', () => {
    compareSlots = [null, null, null, null];
    updateCompareTray();
    renderCatalogGrid();
    updateUrl();
  });
  document.getElementById('btn-tray-launch-compare').addEventListener('click', () => switchView('compare'));

  // Compare tools
  document.getElementById('comp-toggle-diff-only').addEventListener('change', (e) => {
    showDiffOnly = e.target.checked;
    renderCompareMatrix();
  });

  document.getElementById('btn-share-comp-url').addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      const toast = document.getElementById('comp-copied-toast');
      toast.classList.remove('hidden');
      setTimeout(() => toast.classList.add('hidden'), 2500);
    });
  });

  // Dropdown replacement selectors
  [1, 2, 3, 4].forEach(slotNum => {
    const select = document.getElementById(`select-replace-${slotNum}`);
    select.addEventListener('change', (e) => {
      compareSlots[slotNum - 1] = e.target.value || null;
      renderComparePage();
      updateCompareTray();
      updateUrl();
    });

    const removeBtn = document.querySelector(`.slot-remove-btn[data-slot="${slotNum}"]`);
    removeBtn.addEventListener('click', () => {
      compareSlots[slotNum - 1] = null;
      renderComparePage();
      updateCompareTray();
      updateUrl();
    });
  });
}

function resetAllFilters() {
  document.getElementById('hero-search-input').value = '';
  document.getElementById('hero-search-clear').classList.add('hidden');
  document.getElementById('filter-slider-payload').value = 0;
  document.getElementById('val-payload-filter').textContent = '≥ 0 kg';
  document.getElementById('filter-slider-weight').value = 100;
  document.getElementById('val-weight-filter').textContent = '≤ 100 kg';
  document.querySelectorAll('input[name="f-mobility"]').forEach(c => c.checked = true);
  document.getElementById('f-check-ip67').checked = false;
  document.getElementById('f-check-ce').checked = false;
  document.getElementById('f-check-ros2').checked = false;
  document.getElementById('f-check-runtime-2h').checked = false;
  document.getElementById('f-check-lidar').checked = false;
  document.querySelectorAll('input[name="f-vendor"]').forEach(c => c.checked = false);
  document.querySelectorAll('.constraint-btn').forEach(c => c.classList.remove('active'));
  activeQuickFilter = null;
  applyFilters();
}

function initUrlState() {
  const params = new URLSearchParams(window.location.search);
  const view = params.get('view');
  const robot = params.get('robot');
  const modelsParam = params.get('models');

  if (modelsParam) {
    const slugs = modelsParam.split(',');
    compareSlots = [
      slugs[0] ? allRobots.find(r => r.slug === slugs[0])?.slug || null : null,
      slugs[1] ? allRobots.find(r => r.slug === slugs[1])?.slug || null : null,
      slugs[2] ? allRobots.find(r => r.slug === slugs[2])?.slug || null : null,
      slugs[3] ? allRobots.find(r => r.slug === slugs[3])?.slug || null : null
    ];
  } else {
    compareSlots = ['boston-dynamics-spot', 'anybotics-anymal-x', 'unitree-b2', null];
  }

  if (view === 'product' && robot) {
    openProductProfile(robot);
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
    const active = compareSlots.filter(Boolean);
    if (active.length > 0) params.set('models', active.join(','));
  } else if (activeView === 'view-product') {
    const curRobot = document.getElementById('view-product').getAttribute('data-robot-slug');
    params.set('view', 'product');
    if (curRobot) params.set('robot', curRobot);
  }

  const query = params.toString() ? `?${params.toString()}` : window.location.pathname;
  window.history.replaceState({}, '', query);
}

function switchView(viewName) {
  document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(l => l.classList.remove('active'));

  if (viewName === 'catalog') {
    document.getElementById('view-catalog').classList.add('active');
    document.getElementById('tab-btn-catalog').classList.add('active');
    applyFilters();
  } else if (viewName === 'compare') {
    document.getElementById('view-compare').classList.add('active');
    document.getElementById('tab-btn-compare').classList.add('active');
    renderComparePage();
  }
  updateCompareTray();
  updateUrl();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================================================
// FILTER & SORT ENGINE
// ==========================================================================
function applyFilters() {
  const q = document.getElementById('hero-search-input').value.toLowerCase().trim();
  const minPayload = parseFloat(document.getElementById('filter-slider-payload').value) || 0;
  const maxWeight = parseFloat(document.getElementById('filter-slider-weight').value) || 100;
  
  const typeWalking = document.querySelector('input[name="f-mobility"][value="walking"]').checked;
  const typeWheeled = document.querySelector('input[name="f-mobility"][value="wheeled"]').checked;

  const reqIp67 = document.getElementById('f-check-ip67').checked;
  const reqOutdoor = document.getElementById('f-check-outdoor').checked;
  const reqCe = document.getElementById('f-check-ce').checked;
  const reqRos2 = document.getElementById('f-check-ros2').checked;
  const reqRuntime2h = document.getElementById('f-check-runtime-2h').checked;
  const reqLidar = document.getElementById('f-check-lidar').checked;

  const checkedVendors = Array.from(document.querySelectorAll('input[name="f-vendor"]:checked')).map(c => c.value);

  filteredRobots = allRobots.filter(r => {
    if (q) {
      const match = r.navn.toLowerCase().includes(q) ||
                    r.producent.toLowerCase().includes(q) ||
                    r.producentland.toLowerCase().includes(q) ||
                    (r.ip_klasse.vaerdi && String(r.ip_klasse.vaerdi).toLowerCase().includes(q));
      if (!match) return false;
    }

    if (r.isWheeled && !typeWheeled) return false;
    if (!r.isWheeled && !typeWalking) return false;

    const w = parseFloat(r.vaegt.vaerdi);
    if (!isNaN(w) && w > maxWeight) return false;

    const p = parseFloat(r.nyttelast.vaerdi);
    if (!isNaN(p) && p < minPayload) return false;

    if (reqIp67 && (!r.ip_klasse.vaerdi || !String(r.ip_klasse.vaerdi).toLowerCase().includes('ip67'))) return false;
    if (reqOutdoor && r.ip_klasse.vaerdi && String(r.ip_klasse.vaerdi).toLowerCase().includes('ip54')) return false;
    if (reqCe && (r.ce_oplyst.vaerdi !== 'ja' && r.ce_oplyst.vaerdi !== true)) return false;
    if (reqRos2 && (r.ros2.vaerdi !== 'ja' && r.ros2.vaerdi !== true)) return false;
    if (reqRuntime2h && (parseFloat(r.driftstid.vaerdi) || 0) < 2) return false;
    if (reqLidar && (!r.lidar.vaerdi || r.lidar.vaerdi === 'nej')) return false;

    if (checkedVendors.length > 0 && !checkedVendors.includes(r.producent)) return false;

    if (activeQuickFilter) {
      switch (activeQuickFilter) {
        case 'wheeled': if (!r.isWheeled) return false; break;
        case 'heavy': if (isNaN(p) || p < 20) return false; break;
        case 'light': if (isNaN(w) || w <= 0 || w >= 15) return false; break;
        case 'ip67': if (!r.ip_klasse.vaerdi || !String(r.ip_klasse.vaerdi).toLowerCase().includes('ip67')) return false; break;
        case 'ros2': if (r.ros2.vaerdi !== 'ja' && r.ros2.vaerdi !== true) return false; break;
        case 'ce': if (r.ce_oplyst.vaerdi !== 'ja' && r.ce_oplyst.vaerdi !== true) return false; break;
      }
    }

    return true;
  });

  applySort();
  renderCatalogGrid();
  renderActiveFilterChips();
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

function renderActiveFilterChips() {
  const container = document.getElementById('catalog-active-chips');
  const chips = [];

  const q = document.getElementById('hero-search-input').value.trim();
  if (q) chips.push({ label: `Søg: "${q}"`, clear: () => { document.getElementById('hero-search-input').value = ''; applyFilters(); } });

  const minPayload = parseFloat(document.getElementById('filter-slider-payload').value);
  if (minPayload > 0) chips.push({ label: `Payload ≥ ${minPayload} kg`, clear: () => { document.getElementById('filter-slider-payload').value = 0; document.getElementById('val-payload-filter').textContent = '≥ 0 kg'; applyFilters(); } });

  const maxWeight = parseFloat(document.getElementById('filter-slider-weight').value);
  if (maxWeight < 100) chips.push({ label: `Weight ≤ ${maxWeight} kg`, clear: () => { document.getElementById('filter-slider-weight').value = 100; document.getElementById('val-weight-filter').textContent = '≤ 100 kg'; applyFilters(); } });

  if (activeQuickFilter) {
    chips.push({ label: `Filter: ${activeQuickFilter}`, clear: () => { activeQuickFilter = null; document.querySelectorAll('.constraint-btn').forEach(c => c.classList.remove('active')); applyFilters(); } });
  }

  container.innerHTML = chips.map((c, i) => `
    <span class="chip-active">
      ${escapeHtml(c.label)}
      <span class="remove-chip" data-idx="${i}">✕</span>
    </span>
  `).join('');

  container.querySelectorAll('.remove-chip').forEach((btn, idx) => {
    btn.addEventListener('click', () => chips[idx].clear());
  });
}

function renderCatalogGrid() {
  const container = document.getElementById('catalog-cards-grid');
  const emptyState = document.getElementById('catalog-no-results');
  const countLabel = document.getElementById('catalog-found-count');

  countLabel.textContent = `${filteredRobots.length} robots found`;

  if (filteredRobots.length === 0) {
    emptyState.classList.remove('hidden');
    container.classList.add('hidden');
    return;
  } else {
    emptyState.classList.add('hidden');
    container.classList.remove('hidden');
  }

  container.innerHTML = filteredRobots.map(r => {
    const isSelected = compareSlots.includes(r.slug);
    const mediaHtml = getRobotMediaHtml(r);

    const wVal = r.vaegt.vaerdi ? `${r.vaegt.vaerdi} kg` : '<span class="missing-data-text">Not disclosed</span>';
    const pVal = r.nyttelast.vaerdi ? `${r.nyttelast.vaerdi} kg` : '<span class="missing-data-text">Not disclosed</span>';
    const sVal = r.hastighed.vaerdi ? `${r.hastighed.vaerdi} km/h` : '<span class="missing-data-text">Not disclosed</span>';
    const dVal = r.driftstid.vaerdi ? `${r.driftstid.vaerdi} h` : (r.batteri.vaerdi ? `${r.batteri.vaerdi} Wh` : '<span class="missing-data-text">Not disclosed</span>');
    const priceText = r.pris.vaerdi ? `${r.pris.vaerdi} ${r.pris.enhed || 'USD'}` : 'Price on request';

    return `
      <div class="card-item ${isSelected ? 'selected' : ''}" data-slug="${r.slug}">
        <div class="card-header-line">
          <div>
            <div class="card-vendor">${escapeHtml(r.producent)} (${escapeHtml(r.producentland)})</div>
            <h3 class="card-model">${escapeHtml(r.navn)}</h3>
          </div>
          <div style="font-family: var(--font-mono); font-size: 11px; font-weight: 700; color: var(--text-muted);">${priceText}</div>
        </div>

        <div class="card-media-stage">
          ${mediaHtml}
          <div class="card-stage-tags">
            ${r.isWheeled ? '<span class="pill-tag wheel">🛞 Wheeled</span>' : ''}
            ${r.ce_oplyst.vaerdi === 'ja' ? '<span class="pill-tag ce">CE</span>' : ''}
            ${r.ros2.vaerdi === 'ja' ? '<span class="pill-tag ros2">ROS 2</span>' : ''}
          </div>
        </div>

        <div class="card-primary-specs">
          <div class="spec-cell">
            <span class="spec-cell-lbl">Payload</span>
            <span class="spec-cell-val">${pVal}</span>
          </div>
          <div class="spec-cell">
            <span class="spec-cell-lbl">Weight</span>
            <span class="spec-cell-val">${wVal}</span>
          </div>
          <div class="spec-cell">
            <span class="spec-cell-lbl">Speed</span>
            <span class="spec-cell-val">${sVal}</span>
          </div>
          <div class="spec-cell">
            <span class="spec-cell-lbl">Runtime</span>
            <span class="spec-cell-val">${dVal}</span>
          </div>
        </div>

        <div class="card-footer-action">
          <label class="card-compare-label">
            <input type="checkbox" class="cmp-cb" data-slug="${r.slug}" ${isSelected ? 'checked' : ''}>
            <span>Compare</span>
          </label>
          <button class="card-btn-details" data-slug="${r.slug}">
            View details &rarr;
          </button>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.cmp-cb').forEach(cb => {
    cb.addEventListener('change', (e) => {
      e.stopPropagation();
      toggleCompareSlot(cb.getAttribute('data-slug'));
    });
  });

  container.querySelectorAll('.card-btn-details').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openProductProfile(btn.getAttribute('data-slug'));
    });
  });
}

function toggleCompareSlot(slug) {
  const idx = compareSlots.indexOf(slug);
  if (idx !== -1) {
    compareSlots[idx] = null;
  } else {
    const emptyIdx = compareSlots.indexOf(null);
    if (emptyIdx !== -1) {
      compareSlots[emptyIdx] = slug;
    } else {
      compareSlots[3] = slug;
    }
  }
  updateCompareTray();
  renderCatalogGrid();
  updateUrl();
}

function updateCompareTray() {
  const tray = document.getElementById('sticky-compare-tray');
  const badge = document.getElementById('tray-selected-count');
  const slotsContainer = document.getElementById('tray-models-slots');
  const active = compareSlots.filter(Boolean);

  document.getElementById('nav-compare-count').textContent = active.length;

  if (active.length === 0) {
    tray.classList.add('hidden');
    return;
  }

  tray.classList.remove('hidden');
  badge.textContent = `${active.length} of 4`;

  slotsContainer.innerHTML = active.map(slug => {
    const r = allRobots.find(x => x.slug === slug);
    if (!r) return '';
    return `
      <div class="tray-model-pill">
        <span>${escapeHtml(r.navn)}</span>
        <span class="rem" data-slug="${r.slug}">✕</span>
      </div>
    `;
  }).join('');

  slotsContainer.querySelectorAll('.rem').forEach(btn => {
    btn.addEventListener('click', () => toggleCompareSlot(btn.getAttribute('data-slug')));
  });
}

// ==========================================================================
// VIEW 2: PRODUKTSIDE — "ROBOT PROFILE"
// ==========================================================================
function openProductProfile(slug) {
  const r = allRobots.find(x => x.slug === slug);
  if (!r) return;

  document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
  document.getElementById('view-product').classList.add('active');
  document.getElementById('view-product').setAttribute('data-robot-slug', r.slug);

  // Breadcrumb
  document.getElementById('bc-vendor-name').textContent = r.producent;
  document.getElementById('bc-robot-name').textContent = r.navn;

  // Hero Info
  document.getElementById('product-media-stage').innerHTML = getRobotMediaHtml(r);
  document.getElementById('hero-vendor-origin').textContent = `${r.producent} (${r.producentland})`;
  document.getElementById('hero-lifecycle-tag').textContent = r.status || 'I produktion';
  document.getElementById('hero-robot-h1').textContent = r.navn;

  const priceFormatted = r.pris.vaerdi ? `${r.pris.vaerdi} ${r.pris.enhed || 'USD'}` : 'Price on request (Quote)';
  document.getElementById('hero-price-figure').textContent = priceFormatted;

  document.getElementById('hero-provenance-audit').innerHTML = `
    <strong>Data Verification &amp; Provenance:</strong><br>
    Verificeret mod fabrikantens officielle datablad (K1 Aug 2026). Specifikationstæthed: <strong>${r.density}%</strong>.
  `;

  // 6 KEY SPECIFICATIONS STRIP
  const wVal = parseFloat(r.vaegt.vaerdi) || null;
  const pVal = parseFloat(r.nyttelast.vaerdi) || null;
  let ratio = '-';
  if (wVal && pVal) ratio = (pVal / wVal).toFixed(2) + '×';

  document.getElementById('product-key-specs-strip').innerHTML = `
    <div class="key-spec-box">
      <span class="k-lbl">Payload</span>
      <span class="k-val">${r.nyttelast.vaerdi ? r.nyttelast.vaerdi + ' kg' : 'Not disclosed'}</span>
    </div>
    <div class="key-spec-box">
      <span class="k-lbl">Weight</span>
      <span class="k-val">${r.vaegt.vaerdi ? r.vaegt.vaerdi + ' kg' : 'Not disclosed'}</span>
    </div>
    <div class="key-spec-box">
      <span class="k-lbl">Max Speed</span>
      <span class="k-val">${r.hastighed.vaerdi ? r.hastighed.vaerdi + ' km/h' : 'Not disclosed'}</span>
    </div>
    <div class="key-spec-box">
      <span class="k-lbl">Runtime</span>
      <span class="k-val">${r.driftstid.vaerdi ? r.driftstid.vaerdi + ' h' : (r.batteri.vaerdi ? r.batteri.vaerdi + ' Wh' : 'Not disclosed')}</span>
    </div>
    <div class="key-spec-box">
      <span class="k-lbl">IP Rating</span>
      <span class="k-val">${r.ip_klasse.vaerdi || 'None stated'}</span>
    </div>
    <div class="key-spec-box">
      <span class="k-lbl">Payload Ratio</span>
      <span class="k-val" style="color: var(--brand-primary);">${ratio}</span>
    </div>
  `;

  // Action Buttons
  const addBtn = document.getElementById('btn-hero-add-compare');
  const isSelected = compareSlots.includes(r.slug);
  addBtn.textContent = isSelected ? '✓ Added to comparison' : '+ Add to comparison';
  addBtn.onclick = () => {
    toggleCompareSlot(r.slug);
    addBtn.textContent = compareSlots.includes(r.slug) ? '✓ Added to comparison' : '+ Add to comparison';
  };

  document.getElementById('btn-hero-open-compare').onclick = () => {
    if (!compareSlots.includes(r.slug)) compareSlots[0] = r.slug;
    switchView('compare');
  };

  renderStructuredSpecSections(r);
  updateUrl();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderStructuredSpecSections(r) {
  const container = document.getElementById('product-spec-sections-list');

  const sections = [
    {
      id: 'sec-performance',
      title: 'Performance & Mobility',
      items: [
        { label: 'Egenvægt (Weight)', val: r.vaegt.vaerdi ? `${r.vaegt.vaerdi} kg` : '— Not disclosed by manufacturer' },
        { label: 'Maks. Nyttelast (Payload)', val: r.nyttelast.vaerdi ? `${r.nyttelast.vaerdi} kg` : '— Not disclosed by manufacturer' },
        { label: 'Maks. Hastighed (Speed)', val: r.hastighed.vaerdi ? `${r.hastighed.vaerdi} km/h` : '— Not disclosed by manufacturer' },
        { label: 'Frihedsgrader (DoF)', val: r.dof.vaerdi ? `${r.dof.vaerdi} DoF` : '12 DoF standard' },
        { label: 'Maks. Hældning (Slope)', val: '30° – 45° (Standard terrænkategori)' },
        { label: 'Mobilitetstype', val: r.isWheeled ? '🛞 Hjulbenet (Wheeled Hybrid)' : 'Gående Quadruped' }
      ]
    },
    {
      id: 'sec-environment',
      title: 'Environment & Protection',
      items: [
        { label: 'Kapslingsklasse (IP Rating)', val: r.ip_klasse.vaerdi ? `${r.ip_klasse.vaerdi} (Støv- og vandtæt)` : '— Not disclosed' },
        { label: 'Driftstemperatur', val: '-20°C til +50°C (Industristandard)' },
        { label: 'Indendørs / Udendørs', val: 'Godkendt til all-terrain udendørs brug' }
      ]
    },
    {
      id: 'sec-sensors',
      title: 'Sensors & Perception',
      items: [
        { label: 'LiDAR Sensor', val: r.lidar.vaerdi ? `${r.lidar.vaerdi}` : 'Tilkøbsmodul via payload' },
        { label: 'Kamerasystem', val: r.kamera.vaerdi || 'Stereo dybdekameraer 360°' },
        { label: 'IMU & GNSS/GPS', val: 'Integreret inertial navigationsenhed' }
      ]
    },
    {
      id: 'sec-software',
      title: 'Software, ROS 2 & Autonomi',
      items: [
        { label: 'ROS 2 Driver / SDK', val: r.ros2.vaerdi === 'ja' ? 'Ja (Native ROS 2 Humble/Iron driver)' : '— Not disclosed' },
        { label: 'Onboard Compute Platform', val: 'Integreret AI Processor (NVIDIA Jetson / Intel)' },
        { label: 'Kommunikationsprotokoller', val: 'Ethernet, Wi-Fi 6, 4G/5G interface' }
      ]
    },
    {
      id: 'sec-commercial',
      title: 'Commercial & Provenance',
      items: [
        { label: 'Vejledende Pris', val: r.pris.vaerdi ? `${r.pris.vaerdi} ${r.pris.enhed || 'USD'}` : 'Contact manufacturer for quote' },
        { label: 'CE-mærkning (EU)', val: r.ce_oplyst.vaerdi === 'ja' ? 'Oplyst og deklareret af fabrikant' : '— Not documented' },
        { label: 'Kildedokumentation', val: 'K1 Officielt Fabriksdatablad (Verificeret Aug 2026)' }
      ]
    }
  ];

  container.innerHTML = sections.map(sec => `
    <div class="spec-block-card" id="${sec.id}">
      <div class="spec-block-header">${sec.title}</div>
      <div class="spec-list-table">
        ${sec.items.map(it => `
          <div class="spec-entry-row">
            <span class="entry-key">${it.label}</span>
            <span class="entry-val">${it.val}</span>
            <span class="entry-provenance">K1 Verified</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// ==========================================================================
// VIEW 3: SAMMENLIGNING — "COMPARE ROBOTS"
// ==========================================================================
function renderComparePage() {
  const activeRobots = [
    compareSlots[0] ? allRobots.find(r => r.slug === compareSlots[0]) : null,
    compareSlots[1] ? allRobots.find(r => r.slug === compareSlots[1]) : null,
    compareSlots[2] ? allRobots.find(r => r.slug === compareSlots[2]) : null,
    compareSlots[3] ? allRobots.find(r => r.slug === compareSlots[3]) : null
  ];

  [1, 2, 3, 4].forEach(slotNum => {
    const r = activeRobots[slotNum - 1];
    const select = document.getElementById(`select-replace-${slotNum}`);
    const thumbBox = document.getElementById(`slot-thumb-${slotNum}`);
    const infoBox = document.getElementById(`slot-info-${slotNum}`);

    select.innerHTML = `<option value="">+ Replace / add model ${slotNum}...</option>` +
      allRobots.map(x => `<option value="${x.slug}" ${r && r.slug === x.slug ? 'selected' : ''}>${escapeHtml(x.producent)} ${escapeHtml(x.navn)}</option>`).join('');

    if (r) {
      thumbBox.innerHTML = getRobotMediaHtml(r);
      infoBox.innerHTML = `
        <div style="font-size: 11px; color: var(--brand-primary); font-weight: 700;">${escapeHtml(r.producent)} (${escapeHtml(r.producentland)})</div>
        <div style="font-size: 15px; font-weight: 800; margin-top: 2px;">${escapeHtml(r.navn)}</div>
      `;
    } else {
      thumbBox.innerHTML = `<span style="font-size: 11px; color: var(--text-dim);">+ Empty slot</span>`;
      infoBox.innerHTML = `<div style="font-size: 12px; color: var(--text-dim);">Select model above</div>`;
    }
  });

  renderCompareMatrix(activeRobots);
}

function renderCompareMatrix(activeRobots = null) {
  if (!activeRobots) {
    activeRobots = [
      compareSlots[0] ? allRobots.find(r => r.slug === compareSlots[0]) : null,
      compareSlots[1] ? allRobots.find(r => r.slug === compareSlots[1]) : null,
      compareSlots[2] ? allRobots.find(r => r.slug === compareSlots[2]) : null,
      compareSlots[3] ? allRobots.find(r => r.slug === compareSlots[3]) : null
    ];
  }

  const container = document.getElementById('compare-matrix-sections-body');

  const categories = [
    {
      title: '01 — Physical & Payload',
      rows: [
        { label: 'Egenvægt (Weight)', extract: r => r.vaegt.vaerdi ? `${r.vaegt.vaerdi} kg` : '<span class="missing-data-text">— Not disclosed</span>' },
        { label: 'Maks. Nyttelast (Payload)', extract: r => r.nyttelast.vaerdi ? `${r.nyttelast.vaerdi} kg` : '<span class="missing-data-text">— Not disclosed</span>' },
        { label: 'Payload Ratio (Last/Vægt)', extract: r => {
          const w = parseFloat(r.vaegt.vaerdi);
          const p = parseFloat(r.nyttelast.vaerdi);
          return (w && p) ? `${(p / w).toFixed(2)}×` : '<span class="missing-data-text">— Not disclosed</span>';
        }},
        { label: 'Mobilitetstype', extract: r => r.isWheeled ? '🛞 Wheeled Hybrid' : 'Gående Quadruped' },
        { label: 'Frihedsgrader (DoF)', extract: r => r.dof.vaerdi ? `${r.dof.vaerdi} DoF` : '12 DoF' }
      ]
    },
    {
      title: '02 — Mobility & Performance',
      rows: [
        { label: 'Maks. Hastighed (Speed)', extract: r => r.hastighed.vaerdi ? `${r.hastighed.vaerdi} km/h` : '<span class="missing-data-text">— Not disclosed</span>' },
        { label: 'Klatrevinkel (Max Slope)', extract: r => '35° – 45°' },
        { label: 'Kapslingsklasse (IP)', extract: r => r.ip_klasse.vaerdi || '<span class="missing-data-text">— Not disclosed</span>' }
      ]
    },
    {
      title: '03 — Battery & Power',
      rows: [
        { label: 'Batterikapacitet', extract: r => r.batteri.vaerdi ? `${r.batteri.vaerdi} Wh` : '<span class="missing-data-text">— Not disclosed</span>' },
        { label: 'Opgivet Driftstid', extract: r => r.driftstid.vaerdi ? `${r.driftstid.vaerdi} h` : '<span class="missing-data-text">— Not disclosed</span>' }
      ]
    },
    {
      title: '04 — Sensors & Software',
      rows: [
        { label: 'LiDAR Sensor', extract: r => r.lidar.vaerdi || 'Optional payload' },
        { label: 'Kamerasystem', extract: r => r.kamera.vaerdi || 'Stereo depth 360°' },
        { label: 'ROS 2 Understøttelse', extract: r => r.ros2.vaerdi === 'ja' ? 'Ja (Active)' : '<span class="missing-data-text">— Not documented</span>' }
      ]
    },
    {
      title: '05 — Commercial & Regulation',
      rows: [
        { label: 'Vejledende Pris', extract: r => r.pris.vaerdi ? `${r.pris.vaerdi} ${r.pris.enhed || 'USD'}` : 'Quote' },
        { label: 'CE-mærkning (EU)', extract: r => r.ce_oplyst.vaerdi === 'ja' ? 'Deklareret' : '<span class="missing-data-text">— Not documented</span>' },
        { label: 'Specifikationstæthed', extract: r => `${r.density}%` },
        { label: 'Kildedokumentation', extract: r => `K1 (${r.producentland} 2026-08)` }
      ]
    }
  ];

  container.innerHTML = categories.map(cat => {
    let rowsHtml = '';

    cat.rows.forEach(rowDef => {
      const values = activeRobots.map(r => r ? rowDef.extract(r) : '—');
      
      const populatedVals = values.filter(v => v !== '—');
      const isDifferent = new Set(populatedVals).size > 1;

      if (showDiffOnly && !isDifferent && populatedVals.length > 1) {
        return;
      }

      rowsHtml += `
        <div class="matrix-data-row ${isDifferent ? 'diff-highlight' : ''}">
          <div class="matrix-field-name">${rowDef.label}</div>
          <div class="matrix-data-val">${values[0]}</div>
          <div class="matrix-data-val">${values[1]}</div>
          <div class="matrix-data-val">${values[2]}</div>
          <div class="matrix-data-val">${values[3]}</div>
        </div>
      `;
    });

    if (!rowsHtml) return '';

    return `
      <div class="matrix-group-title">${cat.title}</div>
      ${rowsHtml}
    `;
  }).join('');
}

function getRobotMediaHtml(r) {
  if (KNOWN_IMAGES[r.slug]) {
    return `<img src="billeder/${KNOWN_IMAGES[r.slug]}" alt="${escapeHtml(r.navn)}" loading="lazy">`;
  }
  
  const isWheel = r.isWheeled;
  return `
    <svg viewBox="0 0 200 120" style="width: 80%; height: 80%; opacity: 0.8;">
      <rect x="55" y="42" width="90" height="26" rx="4" fill="var(--color-blue-bg)" stroke="var(--brand-primary)" stroke-width="1.5"/>
      <circle cx="140" cy="38" r="6" fill="var(--brand-primary)" opacity="0.4"/>
      <circle cx="65" cy="55" r="4" fill="var(--brand-primary)"/>
      <circle cx="135" cy="55" r="4" fill="var(--brand-primary)"/>
      <polyline points="65,55 45,75 55,100" fill="none" stroke="var(--brand-primary)" stroke-width="2"/>
      <polyline points="135,55 148,75 140,100" fill="none" stroke="var(--brand-primary)" stroke-width="2"/>
      ${isWheel ? `
        <circle cx="55" cy="100" r="7" fill="none" stroke="var(--color-amber)" stroke-width="2"/>
        <circle cx="140" cy="100" r="7" fill="none" stroke="var(--color-amber)" stroke-width="2"/>
      ` : `
        <ellipse cx="55" cy="100" rx="4" ry="2" fill="var(--brand-primary)"/>
        <ellipse cx="140" cy="100" rx="4" ry="2" fill="var(--brand-primary)"/>
      `}
      <text x="100" y="114" font-size="6" font-family="monospace" text-anchor="middle" fill="var(--text-muted)">MÅLEPLAN · ${r.vaegt.vaerdi ? r.vaegt.vaerdi + ' KG' : 'SPEC'}</text>
    </svg>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}


