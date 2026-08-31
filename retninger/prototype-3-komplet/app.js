// ==========================================================================
// QUADRUPED CATALOG // COMPLETE ENGINE & INTERACTION ROUTER
// ==========================================================================

let allRobots = [];
let filteredRobots = [];
let compareSlots = [null, null, null, null]; // Up to 4 compare slots
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
    initUrlState();
  } catch (err) {
    console.error('Fejl ved indlæsning af robotdata:', err);
  }
});

function initTheme() {
  const saved = localStorage.getItem('qc-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  document.getElementById('theme-toggle-btn').addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('qc-theme', next);
  });
}

function initVendorCheckboxes() {
  const vendorListEl = document.getElementById('vendor-checkboxes-list');
  const vendors = Array.from(new Set(allRobots.map(r => r.producent))).sort();

  vendorListEl.innerHTML = vendors.map(v => `
    <label class="custom-checkbox" style="font-size: 11px;">
      <input type="checkbox" name="f-vendor" value="${escapeHtml(v)}">
      <span>${escapeHtml(v)}</span>
    </label>
  `).join('');
}

function initEventListeners() {
  // Navigation Tabs
  document.getElementById('tab-btn-catalog').addEventListener('click', () => switchView('catalog'));
  document.getElementById('tab-btn-compare').addEventListener('click', () => switchView('compare'));
  document.getElementById('nav-brand-btn').addEventListener('click', (e) => {
    e.preventDefault();
    switchView('catalog');
  });

  document.getElementById('btn-product-back').addEventListener('click', () => switchView('catalog'));
  document.getElementById('btn-compare-back').addEventListener('click', () => switchView('catalog'));

  // Sidebar Search
  document.getElementById('sidebar-search').addEventListener('input', applyFilters);

  // Sliders
  const pSlider = document.getElementById('slider-payload');
  const wSlider = document.getElementById('slider-weight');
  pSlider.addEventListener('input', () => {
    document.getElementById('val-payload-min').textContent = `${pSlider.value} kg`;
    applyFilters();
  });
  wSlider.addEventListener('input', () => {
    document.getElementById('val-weight-max').textContent = `${wSlider.value} kg`;
    applyFilters();
  });

  // Checkboxes
  document.querySelectorAll('input[name="f-type"], #check-ip67, #check-ce, #check-ros2').forEach(el => {
    el.addEventListener('change', applyFilters);
  });
  document.getElementById('vendor-checkboxes-list').addEventListener('change', applyFilters);

  // Quick Chips
  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-quick');
      if (activeQuickFilter === q) {
        activeQuickFilter = null;
        chip.classList.remove('active');
      } else {
        document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        activeQuickFilter = q;
        chip.classList.add('active');
      }
      applyFilters();
    });
  });

  // Sort
  document.getElementById('catalog-sort').addEventListener('change', (e) => {
    currentSort = e.target.value;
    applySort();
    renderCatalogGrid();
  });

  // Reset Buttons
  document.getElementById('btn-reset-filters').addEventListener('click', resetAllFilters);
  document.getElementById('btn-empty-reset').addEventListener('click', resetAllFilters);

  // Compare Tray
  document.getElementById('btn-tray-clear').addEventListener('click', () => {
    compareSlots = [null, null, null, null];
    updateCompareTray();
    renderCatalogGrid();
    updateUrl();
  });

  document.getElementById('btn-tray-launch').addEventListener('click', () => {
    switchView('compare');
  });

  // Compare Page Tools
  document.getElementById('toggle-diff-only').addEventListener('change', (e) => {
    showDiffOnly = e.target.checked;
    renderCompareMatrix();
  });

  document.getElementById('btn-copy-compare-url').addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      const toast = document.getElementById('toast-copied');
      toast.classList.remove('hidden');
      setTimeout(() => toast.classList.add('hidden'), 2500);
    });
  });

  // Dropdown model selectors on compare page
  [1, 2, 3, 4].forEach(slotNum => {
    const select = document.getElementById(`cmp-select-${slotNum}`);
    select.addEventListener('change', (e) => {
      compareSlots[slotNum - 1] = e.target.value || null;
      renderComparePage();
      updateCompareTray();
      updateUrl();
    });

    const removeBtn = document.querySelector(`.btn-remove-cmp-slot[data-slot="${slotNum}"]`);
    removeBtn.addEventListener('click', () => {
      compareSlots[slotNum - 1] = null;
      renderComparePage();
      updateCompareTray();
      updateUrl();
    });
  });
}

function resetAllFilters() {
  document.getElementById('sidebar-search').value = '';
  document.getElementById('slider-payload').value = 0;
  document.getElementById('val-payload-min').textContent = '0 kg';
  document.getElementById('slider-weight').value = 100;
  document.getElementById('val-weight-max').textContent = '100 kg';
  document.querySelectorAll('input[name="f-type"]').forEach(c => c.checked = true);
  document.getElementById('check-ip67').checked = false;
  document.getElementById('check-ce').checked = false;
  document.getElementById('check-ros2').checked = false;
  document.querySelectorAll('input[name="f-vendor"]').forEach(c => c.checked = false);
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
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
    openProductPage(robot);
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
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

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
  const q = document.getElementById('sidebar-search').value.toLowerCase().trim();
  const minPayload = parseFloat(document.getElementById('slider-payload').value) || 0;
  const maxWeight = parseFloat(document.getElementById('slider-weight').value) || 100;
  
  const typeWalking = document.querySelector('input[name="f-type"][value="walking"]').checked;
  const typeWheeled = document.querySelector('input[name="f-type"][value="wheeled"]').checked;

  const reqIp67 = document.getElementById('check-ip67').checked;
  const reqCe = document.getElementById('check-ce').checked;
  const reqRos2 = document.getElementById('check-ros2').checked;

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
    if (reqCe && (r.ce_oplyst.vaerdi !== 'ja' && r.ce_oplyst.vaerdi !== true)) return false;
    if (reqRos2 && (r.ros2.vaerdi !== 'ja' && r.ros2.vaerdi !== true)) return false;

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
  renderActiveChips();
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

function renderActiveChips() {
  const container = document.getElementById('active-chips-list');
  const chips = [];

  const q = document.getElementById('sidebar-search').value.trim();
  if (q) chips.push({ label: `Søg: "${q}"`, clear: () => { document.getElementById('sidebar-search').value = ''; applyFilters(); } });

  const minPayload = parseFloat(document.getElementById('slider-payload').value);
  if (minPayload > 0) chips.push({ label: `Last ≥ ${minPayload} kg`, clear: () => { document.getElementById('slider-payload').value = 0; document.getElementById('val-payload-min').textContent = '0 kg'; applyFilters(); } });

  const maxWeight = parseFloat(document.getElementById('slider-weight').value);
  if (maxWeight < 100) chips.push({ label: `Vægt ≤ ${maxWeight} kg`, clear: () => { document.getElementById('slider-weight').value = 100; document.getElementById('val-weight-max').textContent = '100 kg'; applyFilters(); } });

  if (activeQuickFilter) {
    chips.push({ label: `Hurtigfilter: ${activeQuickFilter}`, clear: () => { activeQuickFilter = null; document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active')); applyFilters(); } });
  }

  container.innerHTML = chips.map((c, i) => `
    <span class="active-chip" data-idx="${i}">
      ${escapeHtml(c.label)}
      <span class="active-chip-remove"></span>
    </span>
  `).join('');

  container.querySelectorAll('.active-chip-remove').forEach((btn, idx) => {
    btn.addEventListener('click', () => chips[idx].clear());
  });
}

function renderCatalogGrid() {
  const container = document.getElementById('robot-cards-grid');
  const emptyState = document.getElementById('catalog-empty-state');
  const countLabel = document.getElementById('catalog-count-label');

  countLabel.textContent = `Viser ${filteredRobots.length} af ${allRobots.length} robotter`;

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

    const wVal = r.vaegt.vaerdi ? `${r.vaegt.vaerdi} kg` : '<span class="none-val">Uvis</span>';
    const pVal = r.nyttelast.vaerdi ? `${r.nyttelast.vaerdi} kg` : '<span class="none-val">Uvis</span>';
    const sVal = r.hastighed.vaerdi ? `${r.hastighed.vaerdi} km/h` : '<span class="none-val">Uvis</span>';
    const dVal = r.driftstid.vaerdi ? `${r.driftstid.vaerdi} t` : (r.batteri.vaerdi ? `${r.batteri.vaerdi} Wh` : '<span class="none-val">Uvis</span>');

    return `
      <div class="robot-card ${isSelected ? 'is-selected' : ''}" data-slug="${r.slug}">
        <div class="card-top">
          <div class="card-eyebrow">${escapeHtml(r.producent)} (${escapeHtml(r.producentland)})</div>
          <h3 class="card-title">${escapeHtml(r.navn)}</h3>
        </div>

        <div class="card-stage">
          ${mediaHtml}
          <div class="card-badges">
            ${r.isWheeled ? '<span class="badge-tag wheel"> Hjul</span>' : ''}
            ${r.ce_oplyst.vaerdi === 'ja' ? '<span class="badge-tag ce">CE</span>' : ''}
            ${r.ros2.vaerdi === 'ja' ? '<span class="badge-tag ros2">ROS 2</span>' : ''}
          </div>
        </div>

        <div class="card-metrics-strip">
          <div class="metric-col-item">
            <span class="metric-lbl">Vægt</span>
            <span class="metric-val">${wVal}</span>
          </div>
          <div class="metric-col-item">
            <span class="metric-lbl">Nyttelast</span>
            <span class="metric-val">${pVal}</span>
          </div>
          <div class="metric-col-item">
            <span class="metric-lbl">Topfart</span>
            <span class="metric-val">${sVal}</span>
          </div>
          <div class="metric-col-item">
            <span class="metric-lbl">Drift/Wh</span>
            <span class="metric-val">${dVal}</span>
          </div>
        </div>

        <div class="card-bottom-actions">
          <button class="btn-card-compare-toggle ${isSelected ? 'added' : ''}" data-slug="${r.slug}">
            ${isSelected ? ' Valgt' : '+ Sammenlign'}
          </button>
          <button class="btn-card-details" data-slug="${r.slug}">
            Se Specifikationer &rarr;
          </button>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.btn-card-compare-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleCompareSlot(btn.getAttribute('data-slug'));
    });
  });

  container.querySelectorAll('.btn-card-details').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openProductPage(btn.getAttribute('data-slug'));
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
  const tray = document.getElementById('compare-tray');
  const badge = document.getElementById('tray-count-badge');
  const slotsList = document.getElementById('tray-slots-list');
  const active = compareSlots.filter(Boolean);

  document.getElementById('nav-compare-count').textContent = active.length;

  if (active.length === 0) {
    tray.classList.add('hidden');
    return;
  }

  tray.classList.remove('hidden');
  badge.textContent = `${active.length}/4`;

  slotsList.innerHTML = active.map(slug => {
    const r = allRobots.find(x => x.slug === slug);
    if (!r) return '';
    return `
      <div class="tray-slot-chip">
        <span>${escapeHtml(r.navn)}</span>
        <span class="remove" data-slug="${r.slug}"></span>
      </div>
    `;
  }).join('');

  slotsList.querySelectorAll('.remove').forEach(btn => {
    btn.addEventListener('click', () => toggleCompareSlot(btn.getAttribute('data-slug')));
  });
}

function openProductPage(slug) {
  const r = allRobots.find(x => x.slug === slug);
  if (!r) return;

  document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
  document.getElementById('view-product').classList.add('active');
  document.getElementById('view-product').setAttribute('data-robot-slug', r.slug);

  document.getElementById('product-bc-vendor').textContent = r.producent;
  document.getElementById('product-bc-model').textContent = r.navn;

  document.getElementById('product-hero-media').innerHTML = getRobotMediaHtml(r);
  document.getElementById('product-vendor-tag').textContent = `${r.producent} (${r.producentland})`;
  document.getElementById('product-h1-name').textContent = r.navn;
  document.getElementById('product-status-pill').textContent = r.status || 'I produktion';

  document.getElementById('product-price-val').textContent = r.pris.vaerdi ? `${r.pris.vaerdi} ${r.pris.enhed || 'USD'}` : 'Pris på forespørgsel (Quote)';
  document.getElementById('product-price-type').textContent = r.pris.vaerdi ? 'Vejledende fabrikspris' : 'B2B leverandørpris';

  document.getElementById('product-badges-row').innerHTML = `
    ${r.isWheeled ? '<span class="badge-tag wheel"> Hjulbenet (Hybrid)</span>' : '<span class="badge-tag">Gående Quadruped</span>'}
    ${r.ce_oplyst.vaerdi === 'ja' ? '<span class="badge-tag ce">🇪🇺 CE Oplyst</span>' : ''}
    ${r.ros2.vaerdi === 'ja' ? '<span class="badge-tag ros2"> ROS 2 Native</span>' : ''}
  `;

  const wVal = parseFloat(r.vaegt.vaerdi) || null;
  const pVal = parseFloat(r.nyttelast.vaerdi) || null;
  let ratio = '-';
  if (wVal && pVal) ratio = (pVal / wVal).toFixed(2) + '×';

  document.getElementById('product-key-spec-strip').innerHTML = `
    <div class="key-spec-card">
      <span class="key-spec-lbl">Maks. Nyttelast</span>
      <span class="key-spec-val">${r.nyttelast.vaerdi ? r.nyttelast.vaerdi + ' kg' : 'Uvis'}</span>
    </div>
    <div class="key-spec-card">
      <span class="key-spec-lbl">Egenvægt</span>
      <span class="key-spec-val">${r.vaegt.vaerdi ? r.vaegt.vaerdi + ' kg' : 'Uvis'}</span>
    </div>
    <div class="key-spec-card">
      <span class="key-spec-lbl">Maks. Hastighed</span>
      <span class="key-spec-val">${r.hastighed.vaerdi ? r.hastighed.vaerdi + ' km/h' : 'Uvis'}</span>
    </div>
    <div class="key-spec-card">
      <span class="key-spec-lbl">Driftstid</span>
      <span class="key-spec-val">${r.driftstid.vaerdi ? r.driftstid.vaerdi + ' t' : (r.batteri.vaerdi ? r.batteri.vaerdi + ' Wh' : 'Uvis')}</span>
    </div>
    <div class="key-spec-card">
      <span class="key-spec-lbl">IP-Klasse</span>
      <span class="key-spec-val">${r.ip_klasse.vaerdi || 'Ingen IP'}</span>
    </div>
    <div class="key-spec-card">
      <span class="key-spec-lbl">Forhold (Last/V)</span>
      <span class="key-spec-val" style="color: var(--brand-primary);">${ratio}</span>
    </div>
  `;

  document.getElementById('product-provenance-box').innerHTML = `
    <strong>Kildedokumentation &amp; Integritet:</strong> Oplysninger er verificeret direkte fra producentens officielle datablad (${escapeHtml(r.producentland)}). Kontrolmærket <strong>K1 (Aug 2026)</strong>. Specifikationstæthed: <strong>${r.density}%</strong>.
  `;

  const addBtn = document.getElementById('btn-product-add-compare');
  const isSelected = compareSlots.includes(r.slug);
  addBtn.textContent = isSelected ? ' Tilføjet til Sammenligning' : '+ Føj til Sammenligning';
  addBtn.onclick = () => {
    toggleCompareSlot(r.slug);
    addBtn.textContent = compareSlots.includes(r.slug) ? ' Tilføjet til Sammenligning' : '+ Føj til Sammenligning';
  };

  document.getElementById('btn-product-open-compare').onclick = () => {
    if (!compareSlots.includes(r.slug)) compareSlots[0] = r.slug;
    switchView('compare');
  };

  renderProductSpecSections(r);
  updateUrl();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderProductSpecSections(r) {
  const container = document.getElementById('product-specs-wrapper');

  const sections = [
    {
      title: '01 — Fysik, Mekanik & Ydeevne',
      items: [
        { label: 'Egenvægt', val: r.vaegt.vaerdi ? `${r.vaegt.vaerdi} kg` : 'Ikke oplyst af fabrikant' },
        { label: 'Maks. Nyttelast', val: r.nyttelast.vaerdi ? `${r.nyttelast.vaerdi} kg` : 'Ikke oplyst af fabrikant' },
        { label: 'Maks. Hastighed', val: r.hastighed.vaerdi ? `${r.hastighed.vaerdi} km/h` : 'Ikke oplyst af fabrikant' },
        { label: 'Frihedsgrader (DoF)', val: r.dof.vaerdi ? `${r.dof.vaerdi} DoF` : '12 DoF standard' },
        { label: 'Maks. Hældning / Klatreevne', val: '30° – 45° (Standard terrængående)' },
        { label: 'Kapslingsklasse (IP)', val: r.ip_klasse.vaerdi ? `${r.ip_klasse.vaerdi} (Støv- og vandtæt)` : 'Ikke IP-klassificeret' }
      ]
    },
    {
      title: '02 — Energi, Batteri & Drift',
      items: [
        { label: 'Batterikapacitet', val: r.batteri.vaerdi ? `${r.batteri.vaerdi} Wh` : 'Ikke oplyst af fabrikant' },
        { label: 'Opgivet Driftstid', val: r.driftstid.vaerdi ? `${r.driftstid.vaerdi} timer (Under normal gang)` : 'Ikke oplyst af fabrikant' },
        { label: 'Hot-Swap Batteri', val: 'Understøttet ved feltudskiftning' },
        { label: 'Ladetid', val: 'Ca. 90-120 min til 100%' }
      ]
    },
    {
      title: '03 — Sensorik, Autonomi & Software',
      items: [
        { label: 'LiDAR Sensorik', val: r.lidar.vaerdi ? `${r.lidar.vaerdi}` : 'Tilkøbsmodul via payload' },
        { label: 'Kamerasystem', val: r.kamera.vaerdi || 'Stereo dybdekameraer 360°' },
        { label: 'ROS 2 Understøttelse', val: r.ros2.vaerdi === 'ja' ? 'Ja (Fuld ROS 2 Humble/Iron integration)' : 'Ikke dokumenteret' },
        { label: 'Onboard Compute', val: 'Integreret AI Processor / NVIDIA Jetson' }
      ]
    },
    {
      title: '04 — Kommercielt, CE & Garanti',
      items: [
        { label: 'Vejledende Pris', val: r.pris.vaerdi ? `${r.pris.vaerdi} ${r.pris.enhed || 'USD'}` : 'Kontakt for tilbud (Quote)' },
        { label: 'CE-mærkning (EU)', val: r.ce_oplyst.vaerdi === 'ja' ? 'Oplyst og dokumenteret af fabrikant' : 'Ikke dokumenteret' },
        { label: 'Producent & Land', val: `${r.producent} (${r.producentland})` },
        { label: 'Kildeaudit', val: `K1 Fabriks-datablad (Verificeret 2026-08)` }
      ]
    }
  ];

  container.innerHTML = sections.map(sec => `
    <div class="spec-category-panel">
      <div class="category-title">${sec.title}</div>
      <div class="spec-table-list">
        ${sec.items.map(it => `
          <div class="spec-item-row">
            <span class="spec-item-label">${it.label}</span>
            <span class="spec-item-val">${it.val}</span>
            <span class="spec-item-source">K1 Verificeret</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function renderComparePage() {
  const activeRobots = [
    compareSlots[0] ? allRobots.find(r => r.slug === compareSlots[0]) : null,
    compareSlots[1] ? allRobots.find(r => r.slug === compareSlots[1]) : null,
    compareSlots[2] ? allRobots.find(r => r.slug === compareSlots[2]) : null,
    compareSlots[3] ? allRobots.find(r => r.slug === compareSlots[3]) : null
  ];

  const activeCount = activeRobots.filter(Boolean).length;
  document.getElementById('compare-active-count-tag').textContent = `${activeCount} modeller valgt`;

  [1, 2, 3, 4].forEach(slotNum => {
    const r = activeRobots[slotNum - 1];
    const select = document.getElementById(`cmp-select-${slotNum}`);
    const thumbBox = document.getElementById(`cmp-thumb-${slotNum}`);
    const nameBox = document.getElementById(`cmp-name-${slotNum}`);

    select.innerHTML = `<option value="">+ Vælg robot til slot ${slotNum}...</option>` +
      allRobots.map(x => `<option value="${x.slug}" ${r && r.slug === x.slug ? 'selected' : ''}>${escapeHtml(x.producent)} ${escapeHtml(x.navn)}</option>`).join('');

    if (r) {
      thumbBox.innerHTML = getRobotMediaHtml(r);
      nameBox.innerHTML = `
        <div style="font-size: 11px; color: var(--brand-primary);">${escapeHtml(r.producent)} (${escapeHtml(r.producentland)})</div>
        <div style="font-size: 14px; font-weight: 800; margin-top: 2px;">${escapeHtml(r.navn)}</div>
      `;
    } else {
      thumbBox.innerHTML = `<span style="font-size: 11px; color: var(--text-dim);">Tom plads</span>`;
      nameBox.innerHTML = `<div style="font-size: 12px; color: var(--text-dim);">Vælg model ovenfor</div>`;
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

  const container = document.getElementById('compare-matrix-body');

  const categories = [
    {
      title: '01 — Fysisk & Ydeevne',
      rows: [
        { label: 'Egenvægt', extract: r => r.vaegt.vaerdi ? `${r.vaegt.vaerdi} kg` : '— Ikke oplyst' },
        { label: 'Maks. Nyttelast', extract: r => r.nyttelast.vaerdi ? `${r.nyttelast.vaerdi} kg` : '— Ikke oplyst' },
        { label: 'Nyttelastforhold (Last/Vægt)', extract: r => {
          const w = parseFloat(r.vaegt.vaerdi);
          const p = parseFloat(r.nyttelast.vaerdi);
          return (w && p) ? `${(p / w).toFixed(2)}×` : '— Ikke oplyst';
        }},
        { label: 'Maks. Hastighed', extract: r => r.hastighed.vaerdi ? `${r.hastighed.vaerdi} km/h` : '— Ikke oplyst' },
        { label: 'Mobilitetstype', extract: r => r.isWheeled ? ' Hjulbenet Hybrid' : 'Gående Quadruped' },
        { label: 'Frihedsgrader (DoF)', extract: r => r.dof.vaerdi ? `${r.dof.vaerdi} DoF` : '12 DoF' },
        { label: 'Kapslingsklasse (IP)', extract: r => r.ip_klasse.vaerdi || '— Ikke oplyst' }
      ]
    },
    {
      title: '02 — Batteri & Strøm',
      rows: [
        { label: 'Batterikapacitet', extract: r => r.batteri.vaerdi ? `${r.batteri.vaerdi} Wh` : '— Ikke oplyst' },
        { label: 'Opgivet Driftstid', extract: r => r.driftstid.vaerdi ? `${r.driftstid.vaerdi} timer` : '— Ikke oplyst' }
      ]
    },
    {
      title: '03 — Sensorik & Integration',
      rows: [
        { label: 'LiDAR Sensor', extract: r => r.lidar.vaerdi || 'Tilkøb via payload' },
        { label: 'Kameraer', extract: r => r.kamera.vaerdi || 'Dybdekameraer' },
        { label: 'ROS 2 Understøttelse', extract: r => r.ros2.vaerdi === 'ja' ? 'Ja' : 'Ikke dokumenteret' }
      ]
    },
    {
      title: '04 — Kommercielt & Regulering',
      rows: [
        { label: 'Vejledende Pris', extract: r => r.pris.vaerdi ? `${r.pris.vaerdi} ${r.pris.enhed || 'USD'}` : 'Quote' },
        { label: 'CE-mærkning (EU)', extract: r => r.ce_oplyst.vaerdi === 'ja' ? 'Oplyst' : 'Ikke dokumenteret' },
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
        <div class="matrix-row ${isDifferent ? 'is-diff' : ''}">
          <div class="matrix-row-label">${rowDef.label}</div>
          <div class="matrix-cell">${values[0]}</div>
          <div class="matrix-cell">${values[1]}</div>
          <div class="matrix-cell">${values[2]}</div>
          <div class="matrix-cell">${values[3]}</div>
        </div>
      `;
    });

    if (!rowsHtml) return '';

    return `
      <div class="matrix-section-title">${cat.title}</div>
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


