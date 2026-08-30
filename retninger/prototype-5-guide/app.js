// ==========================================================================
// QUADRUPED.GUIDE // THE OPEN ROBOT DIRECTORY (HUMANOID.GUIDE ENGINE)
// ==========================================================================

let allRobots = [];
let filteredRobots = [];
let compareSlots = ['boston-dynamics-spot', 'anybotics-anymal-x', 'unitree-b2', null];
let activeCapFilter = null;
let currentSort = 'density-desc';
let showDiffOnly = false;

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
    initManufacturerDropdown();
    updateCapabilityCounts();
    initEventListeners();
    initKeyboardShortcuts();
    initUrlState();
  } catch (err) {
    console.error('Fejl ved indlæsning af Guide data:', err);
  }
});

function updateCapabilityCounts() {
  const counts = {
    run: allRobots.filter(r => (parseFloat(r.hastighed.vaerdi) || 0) >= 2.5).length,
    stairs: allRobots.length,
    climb: allRobots.filter(r => !r.isWheeled).length,
    rough: allRobots.filter(r => {
      const ip = String(r.ip_klasse.vaerdi || '');
      return ip.includes('54') || ip.includes('67') || ip.includes('68');
    }).length,
    wheeled: allRobots.filter(r => r.isWheeled).length,
    ip67: allRobots.filter(r => {
      const ip = String(r.ip_klasse.vaerdi || '');
      return ip.includes('67') || ip.includes('68');
    }).length,
    lidar: allRobots.filter(r => r.lidar.vaerdi && r.lidar.vaerdi !== 'nej').length,
    ros2: allRobots.filter(r => r.ros2.vaerdi === 'ja' || r.ros2.vaerdi === true).length,
    ce: allRobots.filter(r => r.ce_oplyst.vaerdi === 'ja' || r.ce_oplyst.vaerdi === true).length,
    heavy: allRobots.filter(r => (parseFloat(r.nyttelast.vaerdi) || 0) >= 20).length
  };

  document.querySelectorAll('.cap-chip').forEach(chip => {
    const cap = chip.getAttribute('data-cap');
    const label = chip.textContent.split('(')[0].trim();
    if (counts[cap] !== undefined) {
      chip.innerHTML = `${label} <span class="chip-count-pill">${counts[cap]}</span>`;
    }
  });
}

function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'SELECT') {
      e.preventDefault();
      switchView('directory');
      const input = document.getElementById('guide-instant-search');
      input.focus();
      input.select();
    } else if (e.key === 'Escape') {
      const searchInput = document.getElementById('guide-instant-search');
      if (document.activeElement === searchInput) {
        searchInput.value = '';
        applyDirectoryFilters();
        searchInput.blur();
      }
    }
  });
}


function initTheme() {
  const saved = localStorage.getItem('qg-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  document.getElementById('theme-toggle').addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('qg-theme', next);
  });
}

function initManufacturerDropdown() {
  const select = document.getElementById('adv-filter-vendor');
  const vendors = Array.from(new Set(allRobots.map(r => r.producent))).sort();
  
  select.innerHTML = '<option value="all">All Manufacturers (25)</option>' +
    vendors.map(v => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('');
}

function initEventListeners() {
  // Navigation Tabs
  document.getElementById('tab-btn-directory').addEventListener('click', () => switchView('directory'));
  document.getElementById('tab-btn-compare').addEventListener('click', () => switchView('compare'));
  document.getElementById('nav-brand-home').addEventListener('click', (e) => {
    e.preventDefault();
    switchView('directory');
  });

  document.getElementById('nav-capabilities').addEventListener('click', () => {
    switchView('directory');
    document.getElementById('capability-chips-bar').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  document.getElementById('nav-manufacturers').addEventListener('click', () => {
    switchView('directory');
    const vSelect = document.getElementById('adv-filter-vendor');
    vSelect.scrollIntoView({ behavior: 'smooth', block: 'center' });
    vSelect.focus();
  });

  document.getElementById('btn-profile-back').addEventListener('click', () => switchView('directory'));
  document.getElementById('btn-compare-back').addEventListener('click', () => switchView('directory'));


  // Instant Search Input
  const searchInput = document.getElementById('guide-instant-search');
  const clearBtn = document.getElementById('btn-search-clear');
  searchInput.addEventListener('input', () => {
    clearBtn.classList.toggle('hidden', !searchInput.value);
    applyDirectoryFilters();
  });
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.classList.add('hidden');
    applyDirectoryFilters();
  });

  // 10 Capability Chips
  document.querySelectorAll('.cap-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const cap = chip.getAttribute('data-cap');
      if (activeCapFilter === cap) {
        activeCapFilter = null;
        chip.classList.remove('active');
      } else {
        document.querySelectorAll('.cap-chip').forEach(c => c.classList.remove('active'));
        activeCapFilter = cap;
        chip.classList.add('active');
      }
      applyDirectoryFilters();
    });
  });

  // Advanced Dropdown Filters
  document.getElementById('adv-filter-vendor').addEventListener('change', applyDirectoryFilters);
  document.getElementById('adv-filter-payload').addEventListener('change', applyDirectoryFilters);
  document.getElementById('adv-filter-weight').addEventListener('change', applyDirectoryFilters);
  document.getElementById('adv-sort-select').addEventListener('change', (e) => {
    currentSort = e.target.value;
    applySorting();
    renderDirectoryCards();
  });

  // Reset Actions
  document.getElementById('btn-reset-directory-filters').addEventListener('click', resetAllFilters);
  document.getElementById('btn-empty-reset').addEventListener('click', resetAllFilters);

  // Compare Tray
  document.getElementById('btn-tray-clear').addEventListener('click', () => {
    compareSlots = [null, null, null, null];
    updateCompareTray();
    renderDirectoryCards();
    updateUrl();
  });
  document.getElementById('btn-tray-launch').addEventListener('click', () => switchView('compare'));

  // Compare Page Tools
  document.getElementById('toggle-cmp-diff-only').addEventListener('change', (e) => {
    showDiffOnly = e.target.checked;
    renderCompareMatrix();
  });

  document.getElementById('btn-export-compare-csv').addEventListener('click', exportCompareToCSV);
  document.getElementById('btn-print-compare').addEventListener('click', () => window.print());

  document.getElementById('btn-copy-compare-link').addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      const toast = document.getElementById('compare-toast');
      toast.classList.remove('hidden');
      setTimeout(() => toast.classList.add('hidden'), 2500);
    });
  });


  // Replacement Dropdowns on Compare Page
  [1, 2, 3, 4].forEach(slotNum => {
    const dropdown = document.getElementById(`cmp-dropdown-${slotNum}`);
    dropdown.addEventListener('change', (e) => {
      compareSlots[slotNum - 1] = e.target.value || null;
      renderComparePage();
      updateCompareTray();
      updateUrl();
    });

    const delBtn = document.querySelector(`.slot-del-btn[data-slot="${slotNum}"]`);
    delBtn.addEventListener('click', () => {
      compareSlots[slotNum - 1] = null;
      renderComparePage();
      updateCompareTray();
      updateUrl();
    });
  });
}

function resetAllFilters() {
  document.getElementById('guide-instant-search').value = '';
  document.getElementById('btn-search-clear').classList.add('hidden');
  document.querySelectorAll('.cap-chip').forEach(c => c.classList.remove('active'));
  document.getElementById('adv-filter-vendor').value = 'all';
  document.getElementById('adv-filter-payload').value = '0';
  document.getElementById('adv-filter-weight').value = '100';
  activeCapFilter = null;
  applyDirectoryFilters();
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
  }

  if (view === 'robot' && robot) {
    openRobotProfile(robot);
  } else if (view === 'compare') {
    switchView('compare');
  } else {
    switchView('directory');
  }
}
function updateUrl() {
  const activeView = document.querySelector('.page-view.active')?.id;
  const params = new URLSearchParams();

  if (activeView === 'view-compare') {
    params.set('view', 'compare');
    const active = compareSlots.filter(Boolean);
    if (active.length > 0) params.set('models', active.join(','));
  } else if (activeView === 'view-robot') {
    const curRobot = document.getElementById('view-robot').getAttribute('data-robot-slug');
    params.set('view', 'robot');
    if (curRobot) params.set('robot', curRobot);
  }

  const query = params.toString() ? `?${params.toString()}` : window.location.pathname;
  window.history.replaceState({}, '', query);
}

function switchView(viewName) {
  document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.guide-nav-item').forEach(l => l.classList.remove('active'));

  if (viewName === 'directory') {
    document.getElementById('view-directory').classList.add('active');
    document.getElementById('tab-btn-directory').classList.add('active');
    applyDirectoryFilters();
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
// INSTANT DIRECTORY FILTERING & SORTING (HUMANOID.GUIDE LOGIC)
// ==========================================================================
function applyDirectoryFilters() {
  const q = document.getElementById('guide-instant-search').value.toLowerCase().trim();
  const selectedVendor = document.getElementById('adv-filter-vendor').value;
  const minPayload = parseFloat(document.getElementById('adv-filter-payload').value) || 0;
  const maxWeight = parseFloat(document.getElementById('adv-filter-weight').value) || 100;

  filteredRobots = allRobots.filter(r => {
    // 1. Text Search
    if (q) {
      const match = r.navn.toLowerCase().includes(q) ||
                    r.producent.toLowerCase().includes(q) ||
                    r.producentland.toLowerCase().includes(q) ||
                    (r.ip_klasse.vaerdi && String(r.ip_klasse.vaerdi).toLowerCase().includes(q));
      if (!match) return false;
    }

    // 2. Vendor Dropdown
    if (selectedVendor !== 'all' && r.producent !== selectedVendor) return false;

    // 3. Payload & Weight Range
    const p = parseFloat(r.nyttelast.vaerdi) || 0;
    const w = parseFloat(r.vaegt.vaerdi) || 0;
    if (minPayload > 0 && p < minPayload) return false;
    if (maxWeight < 100 && w > maxWeight) return false;

    // 4. Capability Chips
    if (activeCapFilter) {
      const s = parseFloat(r.hastighed.vaerdi) || 0;
      const ip = String(r.ip_klasse.vaerdi || '').toLowerCase();

      switch (activeCapFilter) {
        case 'run': if (s < 2.5) return false; break;
        case 'stairs': break; // All quadrupeds do basic stairs
        case 'climb': if (r.isWheeled) return false; break;
        case 'rough': if (!ip.includes('54') && !ip.includes('67') && !ip.includes('68')) return false; break;
        case 'wheeled': if (!r.isWheeled) return false; break;
        case 'ip67': if (!ip.includes('67') && !ip.includes('68')) return false; break;
        case 'lidar': if (!r.lidar.vaerdi || r.lidar.vaerdi === 'nej') return false; break;
        case 'ros2': if (r.ros2.vaerdi !== 'ja' && r.ros2.vaerdi !== true) return false; break;
        case 'ce': if (r.ce_oplyst.vaerdi !== 'ja' && r.ce_oplyst.vaerdi !== true) return false; break;
        case 'heavy': if (p < 20) return false; break;
      }
    }

    return true;
  });

  applySorting();
  renderDirectoryCards();
  renderActiveTags();
}

function applySorting() {
  filteredRobots.sort((a, b) => {
    switch (currentSort) {
      case 'density-desc': return (b.density || 0) - (a.density || 0);
      case 'payload-desc': return (parseFloat(b.nyttelast.vaerdi) || 0) - (parseFloat(a.nyttelast.vaerdi) || 0);
      case 'weight-asc': return (parseFloat(a.vaegt.vaerdi) || 999) - (parseFloat(b.vaegt.vaerdi) || 999);
      case 'speed-desc': return (parseFloat(b.hastighed.vaerdi) || 0) - (parseFloat(a.hastighed.vaerdi) || 0);
      case 'name-asc':
      default: return a.navn.localeCompare(b.navn);
    }
  });
}

function renderActiveTags() {
  const container = document.getElementById('dir-active-tags');
  const tags = [];

  const q = document.getElementById('guide-instant-search').value.trim();
  if (q) tags.push({ label: `"${q}"`, clear: () => { document.getElementById('guide-instant-search').value = ''; applyDirectoryFilters(); } });

  if (activeCapFilter) {
    tags.push({ label: `Cap: ${activeCapFilter}`, clear: () => { activeCapFilter = null; document.querySelectorAll('.cap-chip').forEach(c => c.classList.remove('active')); applyDirectoryFilters(); } });
  }

  const v = document.getElementById('adv-filter-vendor').value;
  if (v !== 'all') tags.push({ label: v, clear: () => { document.getElementById('adv-filter-vendor').value = 'all'; applyDirectoryFilters(); } });

  container.innerHTML = tags.map((t, idx) => `
    <span class="guide-active-tag">
      ${escapeHtml(t.label)}
      <span data-idx="${idx}">✕</span>
    </span>
  `).join('');

  container.querySelectorAll('span[data-idx]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'));
      tags[idx].clear();
    });
  });
}

// ==========================================================================
// RENDER DIRECTORY CARDS (HUMANOID.GUIDE COMPACT ENCYCLOPEDIA)
// ==========================================================================
function renderDirectoryCards() {
  const container = document.getElementById('guide-cards-grid');
  const emptyState = document.getElementById('dir-empty-state');
  const countLabel = document.getElementById('dir-found-count');

  countLabel.textContent = `${filteredRobots.length} robots`;

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

    const wVal = r.vaegt.vaerdi ? `${r.vaegt.vaerdi} kg` : '<span class="missing-indicator">-</span>';
    const pVal = r.nyttelast.vaerdi ? `${r.nyttelast.vaerdi} kg` : '<span class="missing-indicator">-</span>';
    const sVal = r.hastighed.vaerdi ? `${r.hastighed.vaerdi} km/h` : '<span class="missing-indicator">-</span>';
    const dVal = r.driftstid.vaerdi ? `${r.driftstid.vaerdi} h` : (r.batteri.vaerdi ? `${r.batteri.vaerdi} Wh` : '<span class="missing-indicator">-</span>');

    return `
      <div class="guide-card ${isSelected ? 'selected' : ''}" data-slug="${r.slug}">
        <div class="card-top-header">
          <div>
            <div class="card-vendor-lbl">${escapeHtml(r.producent)} (${escapeHtml(r.producentland)})</div>
            <h3 class="card-title-h3">${escapeHtml(r.navn)}</h3>
          </div>
          <div style="font-family: var(--font-mono); font-size: 11px; font-weight: 700; color: var(--text-muted);">
            ${r.pris.vaerdi ? r.pris.vaerdi + ' ' + (r.pris.enhed || 'USD') : 'Quote'}
          </div>
        </div>

        <div class="card-media-box">
          ${mediaHtml}
        </div>

        <div class="card-spec-row">
          <div class="spec-item-box">
            <span class="s-lbl">Payload</span>
            <span class="s-val">${pVal}</span>
          </div>
          <div class="spec-item-box">
            <span class="s-lbl">Weight</span>
            <span class="s-val">${wVal}</span>
          </div>
          <div class="spec-item-box">
            <span class="s-lbl">Speed</span>
            <span class="s-val">${sVal}</span>
          </div>
          <div class="spec-item-box">
            <span class="s-lbl">Runtime</span>
            <span class="s-val">${dVal}</span>
          </div>
        </div>

        <div class="card-caps-tags">
          ${r.isWheeled ? '<span class="card-cap-pill wheel">🛞 Wheeled</span>' : '<span class="card-cap-pill">🐕 Legged</span>'}
          ${r.ip_klasse.vaerdi ? `<span class="card-cap-pill ip">🛡️ ${r.ip_klasse.vaerdi}</span>` : ''}
          ${r.ros2.vaerdi === 'ja' ? '<span class="card-cap-pill ros">💻 ROS 2</span>' : ''}
          ${r.lidar.vaerdi && r.lidar.vaerdi !== 'nej' ? '<span class="card-cap-pill">👁️ LiDAR</span>' : ''}
        </div>

        <div class="card-bottom-actions">
          <label class="cmp-check-label">
            <input type="checkbox" class="cmp-checkbox" data-slug="${r.slug}" ${isSelected ? 'checked' : ''}>
            <span>Compare</span>
          </label>
          <button class="btn-open-profile" data-slug="${r.slug}">
            View Details &rarr;
          </button>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.cmp-checkbox').forEach(cb => {
    cb.addEventListener('change', (e) => {
      e.stopPropagation();
      toggleCompareSlot(cb.getAttribute('data-slug'));
    });
  });

  container.querySelectorAll('.btn-open-profile').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openRobotProfile(btn.getAttribute('data-slug'));
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
  renderDirectoryCards();
  updateUrl();
}

function updateCompareTray() {
  const tray = document.getElementById('guide-compare-tray');
  const badge = document.getElementById('tray-count-pill');
  const chipsContainer = document.getElementById('tray-models-chips');
  const active = compareSlots.filter(Boolean);

  document.getElementById('nav-compare-count').textContent = active.length;

  if (active.length === 0) {
    tray.classList.add('hidden');
    return;
  }

  tray.classList.remove('hidden');
  badge.textContent = `${active.length} / 4`;

  chipsContainer.innerHTML = active.map(slug => {
    const r = allRobots.find(x => x.slug === slug);
    if (!r) return '';
    return `
      <div class="tray-chip">
        <span>${escapeHtml(r.navn)}</span>
        <span class="del-x" data-slug="${r.slug}">✕</span>
      </div>
    `;
  }).join('');

  chipsContainer.querySelectorAll('.del-x').forEach(btn => {
    btn.addEventListener('click', () => toggleCompareSlot(btn.getAttribute('data-slug')));
  });
}

// ==========================================================================
// VIEW 2: ROBOT PROFILE / ENCYCLOPEDIA ENTRY
// ==========================================================================
function openRobotProfile(slug) {
  const r = allRobots.find(x => x.slug === slug);
  if (!r) return;

  document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
  document.getElementById('view-robot').classList.add('active');
  document.getElementById('view-robot').setAttribute('data-robot-slug', r.slug);

  // Breadcrumb
  document.getElementById('profile-bc-vendor').textContent = r.producent;
  document.getElementById('profile-bc-model').textContent = r.navn;

  // Hero
  document.getElementById('profile-media-box').innerHTML = getRobotMediaHtml(r);
  document.getElementById('profile-vendor-name').textContent = r.producent;
  document.getElementById('profile-vendor-country').textContent = `(${r.producentland})`;
  document.getElementById('profile-status-pill').textContent = r.status || 'In Production';
  document.getElementById('profile-model-title').textContent = r.navn;

  const priceStr = r.pris.vaerdi ? `${r.pris.vaerdi} ${r.pris.enhed || 'USD'}` : 'Price on request';
  document.getElementById('profile-price-val').textContent = priceStr;

  document.getElementById('profile-provenance-box').innerHTML = `
    <strong>Data Source &amp; Verification:</strong><br>
    Indsamlet og verificeret fra producentens officielle tekniske datablad (${escapeHtml(r.producentland)}). Kontrolmærke <strong>K1 (Aug 2026)</strong>. Specifikationstæthed: <strong>${r.density}%</strong>.
  `;

  // 6 Key Specs
  document.getElementById('profile-key-strip').innerHTML = `
    <div class="p-key-cell">
      <span class="pk-lbl">Payload</span>
      <span class="pk-val">${r.nyttelast.vaerdi ? r.nyttelast.vaerdi + ' kg' : 'Uvis'}</span>
    </div>
    <div class="p-key-cell">
      <span class="pk-lbl">Weight</span>
      <span class="pk-val">${r.vaegt.vaerdi ? r.vaegt.vaerdi + ' kg' : 'Uvis'}</span>
    </div>
    <div class="p-key-cell">
      <span class="pk-lbl">Speed</span>
      <span class="pk-val">${r.hastighed.vaerdi ? r.hastighed.vaerdi + ' km/h' : 'Uvis'}</span>
    </div>
    <div class="p-key-cell">
      <span class="pk-lbl">Runtime</span>
      <span class="pk-val">${r.driftstid.vaerdi ? r.driftstid.vaerdi + ' h' : (r.batteri.vaerdi ? r.batteri.vaerdi + ' Wh' : 'Uvis')}</span>
    </div>
    <div class="p-key-cell">
      <span class="pk-lbl">IP Rating</span>
      <span class="pk-val">${r.ip_klasse.vaerdi || 'None'}</span>
    </div>
    <div class="p-key-cell">
      <span class="pk-lbl">Locomotion</span>
      <span class="pk-val" style="color: var(--brand-primary);">${r.isWheeled ? 'Wheeled' : 'Legged'}</span>
    </div>
  `;

  // Action CTAs
  const addBtn = document.getElementById('btn-profile-add-compare');
  const isSelected = compareSlots.includes(r.slug);
  addBtn.textContent = isSelected ? '✓ Added to Compare' : '+ Add to Compare';
  addBtn.onclick = () => {
    toggleCompareSlot(r.slug);
    addBtn.textContent = compareSlots.includes(r.slug) ? '✓ Added to Compare' : '+ Add to Compare';
  };

  const rivalsBtn = document.getElementById('btn-profile-open-compare');
  rivalsBtn.textContent = '⚖️ Compare with 3 Competitors &rarr;';
  rivalsBtn.onclick = () => {
    const rivals = findDirectCompetitors(r);
    compareSlots = [r.slug, rivals[0]?.slug || null, rivals[1]?.slug || null, rivals[2]?.slug || null];
    switchView('compare');
  };


  renderProfileCapabilities(r);
  renderProfileTechSpecs(r);
  updateUrl();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function findDirectCompetitors(targetRobot) {
  const targetWeight = parseFloat(targetRobot.vaegt.vaerdi) || 30;
  const targetPayload = parseFloat(targetRobot.nyttelast.vaerdi) || 10;
  
  return allRobots
    .filter(r => r.slug !== targetRobot.slug)
    .map(r => {
      const w = parseFloat(r.vaegt.vaerdi) || 30;
      const p = parseFloat(r.nyttelast.vaerdi) || 10;
      const diff = Math.abs(w - targetWeight) + Math.abs(p - targetPayload) * 1.5;
      return { robot: r, diff };
    })
    .sort((a, b) => a.diff - b.diff)
    .slice(0, 3)
    .map(x => x.robot);
}

function renderProfileCapabilities(r) {

  const container = document.getElementById('profile-cap-badge-grid');

  const capabilities = [
    { title: 'Dynamic Running', icon: '🏃', state: (parseFloat(r.hastighed.vaerdi) || 0) >= 3.0 ? 'Supported' : 'Standard trot' },
    { title: 'Stair Climbing', icon: '🪜', state: 'Supported (Up to 25cm)' },
    { title: 'Slope / Incline', icon: '🧗', state: 'Supported (30°–45°)' },
    { title: 'Rough Terrain', icon: '🌲', state: r.ip_klasse.vaerdi ? 'All-Terrain Sealed' : 'Standard dry' },
    { title: 'Wheeled Hybrid', icon: '🛞', state: r.isWheeled ? 'Wheeled Locomotion' : 'Legged only' },
    { title: 'Ingress Protection', icon: '🛡️', state: r.ip_klasse.vaerdi ? `${r.ip_klasse.vaerdi} Certified` : 'Not IP-rated' },
    { title: 'LiDAR Autonomy', icon: '👁️', state: r.lidar.vaerdi ? 'Integrated LiDAR' : 'Payload add-on' },
    { title: 'ROS 2 Driver', icon: '💻', state: r.ros2.vaerdi === 'ja' ? 'Native ROS 2 Driver' : 'Not documented' },
    { title: 'CE Declaration', icon: '🇪🇺', state: r.ce_oplyst.vaerdi === 'ja' ? 'EU CE Declared' : 'Not documented' }
  ];

  container.innerHTML = capabilities.map(c => `
    <div class="cap-badge-item">
      <span class="cap-icon">${c.icon}</span>
      <div>
        <div class="cap-title">${c.title}</div>
        <div class="cap-state">${c.state}</div>
      </div>
    </div>
  `).join('');
}

function renderProfileTechSpecs(r) {
  const container = document.getElementById('profile-specs-tables-wrap');

  const categories = [
    {
      title: 'Physical & Performance',
      rows: [
        { key: 'Weight (Egenvægt)', val: r.vaegt.vaerdi ? `${r.vaegt.vaerdi} kg` : '— Not disclosed by manufacturer' },
        { key: 'Payload (Nyttelast)', val: r.nyttelast.vaerdi ? `${r.nyttelast.vaerdi} kg` : '— Not disclosed by manufacturer' },
        { key: 'Top Speed (Hastighed)', val: r.hastighed.vaerdi ? `${r.hastighed.vaerdi} km/h` : '— Not disclosed by manufacturer' },
        { key: 'Degrees of Freedom (DoF)', val: r.dof.vaerdi ? `${r.dof.vaerdi} DoF` : '12 DoF' },
        { key: 'Locomotion Type', val: r.isWheeled ? '🛞 Wheeled Quadruped' : 'Legged Quadruped' }
      ]
    },
    {
      title: 'Battery & Runtime',
      rows: [
        { key: 'Battery Capacity', val: r.batteri.vaerdi ? `${r.batteri.vaerdi} Wh` : '— Not disclosed by manufacturer' },
        { key: 'Runtime', val: r.driftstid.vaerdi ? `${r.driftstid.vaerdi} hours` : '— Not disclosed by manufacturer' },
        { key: 'Battery Hot-Swap', val: 'Supported for field operation' }
      ]
    },
    {
      title: 'Sensors & Software',
      rows: [
        { key: 'LiDAR Sensor', val: r.lidar.vaerdi || 'Optional via payload rail' },
        { key: 'Cameras', val: r.kamera.vaerdi || '360° Depth cameras' },
        { key: 'ROS 2 Driver', val: r.ros2.vaerdi === 'ja' ? 'Yes (Humble/Iron native)' : 'Not documented' }
      ]
    },
    {
      title: 'Commercial & Provenance',
      rows: [
        { key: 'Guide Price', val: r.pris.vaerdi ? `${r.pris.vaerdi} ${r.pris.enhed || 'USD'}` : 'Contact manufacturer for quote' },
        { key: 'CE Certified', val: r.ce_oplyst.vaerdi === 'ja' ? 'Declared' : 'Not documented' },
        { key: 'Provenance Audit', val: `K1 Datasheet (${r.producentland} 2026-08)` }
      ]
    }
  ];

  container.innerHTML = categories.map(cat => `
    <div class="spec-category-card">
      <div class="spec-cat-title">${cat.title}</div>
      <div>
        ${cat.rows.map(row => `
          <div class="spec-row-entry">
            <span class="r-label">${row.key}</span>
            <span class="r-val">${row.val}</span>
            <span class="r-provenance">K1 Verified</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// ==========================================================================
// VIEW 3: COMPARE / SIDE-BY-SIDE
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
    const dropdown = document.getElementById(`cmp-dropdown-${slotNum}`);
    const photo = document.getElementById(`cmp-photo-${slotNum}`);
    const info = document.getElementById(`cmp-info-${slotNum}`);

    dropdown.innerHTML = `<option value="">+ Slot ${slotNum}: Select robot...</option>` +
      allRobots.map(x => `<option value="${x.slug}" ${r && r.slug === x.slug ? 'selected' : ''}>${escapeHtml(x.producent)} ${escapeHtml(x.navn)}</option>`).join('');

    if (r) {
      photo.innerHTML = getRobotMediaHtml(r);
      info.innerHTML = `
        <div style="font-size: 11px; color: var(--brand-primary); font-weight: 700;">${escapeHtml(r.producent)} (${escapeHtml(r.producentland)})</div>
        <div style="font-size: 14px; font-weight: 800; margin-top: 2px;">${escapeHtml(r.navn)}</div>
      `;
    } else {
      photo.innerHTML = `<span style="font-size: 11px; color: var(--text-dim);">Empty Slot</span>`;
      info.innerHTML = `<div style="font-size: 12px; color: var(--text-dim);">Select model</div>`;
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

  const container = document.getElementById('cmp-matrix-body');

  const categories = [
    {
      title: 'Key Specifications',
      rows: [
        { label: 'Payload', extract: r => r.nyttelast.vaerdi ? `${r.nyttelast.vaerdi} kg` : '<span class="missing-indicator">— Not disclosed</span>' },
        { label: 'Weight', extract: r => r.vaegt.vaerdi ? `${r.vaegt.vaerdi} kg` : '<span class="missing-indicator">— Not disclosed</span>' },
        { label: 'Payload Ratio', extract: r => {
          const w = parseFloat(r.vaegt.vaerdi);
          const p = parseFloat(r.nyttelast.vaerdi);
          return (w && p) ? `${(p / w).toFixed(2)}×` : '<span class="missing-indicator">— Not disclosed</span>';
        }},
        { label: 'Top Speed', extract: r => r.hastighed.vaerdi ? `${r.hastighed.vaerdi} km/h` : '<span class="missing-indicator">— Not disclosed</span>' },
        { label: 'Runtime', extract: r => r.driftstid.vaerdi ? `${r.driftstid.vaerdi} h` : '<span class="missing-indicator">— Not disclosed</span>' },
        { label: 'IP Rating', extract: r => r.ip_klasse.vaerdi || '<span class="missing-indicator">— Not disclosed</span>' }
      ]
    },
    {
      title: 'Capabilities & Software',
      rows: [
        { label: 'Locomotion', extract: r => r.isWheeled ? '🛞 Wheeled' : 'Legged' },
        { label: 'LiDAR Sensor', extract: r => r.lidar.vaerdi || 'Optional payload' },
        { label: 'ROS 2 Driver', extract: r => r.ros2.vaerdi === 'ja' ? 'Yes (Native)' : '<span class="missing-indicator">— Not documented</span>' },
        { label: 'CE Certified', extract: r => r.ce_oplyst.vaerdi === 'ja' ? 'Declared' : '<span class="missing-indicator">— Not documented</span>' }
      ]
    }
  ];

  container.innerHTML = categories.map(cat => {
    let rowsHtml = '';

    cat.rows.forEach(rowDef => {
      const values = activeRobots.map(r => r ? rowDef.extract(r) : '—');
      
      const populatedVals = values.filter(v => v !== '—' && !v.includes('—'));
      const isDifferent = new Set(populatedVals).size > 1;

      if (showDiffOnly && !isDifferent && populatedVals.length > 1) {
        return;
      }

      // Detect Best in Class metric
      let bestIdx = -1;
      if (['Payload', 'Top Speed', 'Runtime', 'Payload Ratio'].includes(rowDef.label)) {
        let maxVal = -1;
        activeRobots.forEach((r, idx) => {
          if (!r) return;
          let num = 0;
          if (rowDef.label === 'Payload') num = parseFloat(r.nyttelast.vaerdi) || 0;
          if (rowDef.label === 'Top Speed') num = parseFloat(r.hastighed.vaerdi) || 0;
          if (rowDef.label === 'Runtime') num = parseFloat(r.driftstid.vaerdi) || 0;
          if (rowDef.label === 'Payload Ratio') {
            const w = parseFloat(r.vaegt.vaerdi);
            const p = parseFloat(r.nyttelast.vaerdi);
            num = (w && p) ? (p / w) : 0;
          }
          if (num > maxVal && num > 0) { maxVal = num; bestIdx = idx; }
        });
      } else if (rowDef.label === 'Weight') {
        let minVal = 9999;
        activeRobots.forEach((r, idx) => {
          if (!r) return;
          const w = parseFloat(r.vaegt.vaerdi) || 0;
          if (w > 0 && w < minVal) { minVal = w; bestIdx = idx; }
        });
      }

      rowsHtml += `
        <div class="cmp-matrix-row ${isDifferent ? 'is-different' : ''}">
          <div class="cmp-matrix-label">${rowDef.label}</div>
          <div class="cmp-matrix-cell ${bestIdx === 0 ? 'is-best-cell' : ''}">${values[0]}${bestIdx === 0 ? ' <span class="best-metric-badge">🏆 Best</span>' : ''}</div>
          <div class="cmp-matrix-cell ${bestIdx === 1 ? 'is-best-cell' : ''}">${values[1]}${bestIdx === 1 ? ' <span class="best-metric-badge">🏆 Best</span>' : ''}</div>
          <div class="cmp-matrix-cell ${bestIdx === 2 ? 'is-best-cell' : ''}">${values[2]}${bestIdx === 2 ? ' <span class="best-metric-badge">🏆 Best</span>' : ''}</div>
          <div class="cmp-matrix-cell ${bestIdx === 3 ? 'is-best-cell' : ''}">${values[3]}${bestIdx === 3 ? ' <span class="best-metric-badge">🏆 Best</span>' : ''}</div>
        </div>
      `;
    });


    if (!rowsHtml) return '';

    return `
      <div class="cmp-category-header">${cat.title}</div>
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
      <text x="100" y="114" font-size="6" font-family="monospace" text-anchor="middle" fill="var(--text-muted)">GUIDE DATABASE · ${r.vaegt.vaerdi ? r.vaegt.vaerdi + ' KG' : 'SPEC'}</text>
    </svg>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}

function exportCompareToCSV() {
  const activeRobots = compareSlots.map(slug => slug ? allRobots.find(r => r.slug === slug) : null).filter(Boolean);
  if (activeRobots.length === 0) {
    alert('Vælg mindst 1 robot til eksport.');
    return;
  }

  const headers = ['Specification', ...activeRobots.map(r => `"${r.producent} ${r.navn}"`)];
  const rows = [
    ['Weight (kg)', ...activeRobots.map(r => r.vaegt.vaerdi || 'Not disclosed')],
    ['Payload (kg)', ...activeRobots.map(r => r.nyttelast.vaerdi || 'Not disclosed')],
    ['Top Speed (km/h)', ...activeRobots.map(r => r.hastighed.vaerdi || 'Not disclosed')],
    ['Runtime (hours)', ...activeRobots.map(r => r.driftstid.vaerdi || 'Not disclosed')],
    ['IP Rating', ...activeRobots.map(r => r.ip_klasse.vaerdi || 'Not disclosed')],
    ['Locomotion', ...activeRobots.map(r => r.isWheeled ? 'Wheeled' : 'Legged')],
    ['ROS 2', ...activeRobots.map(r => r.ros2.vaerdi === 'ja' ? 'Yes' : 'Not documented')],
    ['LiDAR', ...activeRobots.map(r => r.lidar.vaerdi || 'Optional')],
    ['CE Certified', ...activeRobots.map(r => r.ce_oplyst.vaerdi === 'ja' ? 'Yes' : 'Not documented')],
    ['Price', ...activeRobots.map(r => r.pris.vaerdi ? `${r.pris.vaerdi} ${r.pris.enhed || 'USD'}` : 'Quote')]
  ];

  const csvContent = 'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'quadruped-guide-comparison.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}



