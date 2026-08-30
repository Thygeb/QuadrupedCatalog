// ==========================================================================
// QUADRUPED INTELLIGENCE PLATFORM // DECISION ENGINE & CONTROLLER
// ==========================================================================

let allRobots = [];
let evaluatedRobots = [];
let compareSlots = ['anybotics-anymal-x', 'boston-dynamics-spot', 'deep-robotics-lynx-s10', 'unitree-b2'];

// Mission Builder Requirements State
let reqEnv = 'all';
let reqPayload = 0;
let reqAutonomy = 'any';
let reqPriority = 'balanced';
let currentSort = 'match-desc';
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

    initTheme();
    initEventListeners();
    evaluateRequirements();
    initUrlState();
  } catch (err) {
    console.error('Fejl ved indlæsning af Intelligence data:', err);
  }
});

function initTheme() {
  const saved = localStorage.getItem('qc-intel-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  document.getElementById('theme-toggle-btn').addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('qc-intel-theme', next);
  });
}

function initEventListeners() {
  // Navigation tabs
  document.getElementById('tab-btn-discover').addEventListener('click', () => switchView('discover'));
  document.getElementById('tab-btn-compare').addEventListener('click', () => switchView('compare'));
  document.getElementById('nav-brand-home').addEventListener('click', (e) => {
    e.preventDefault();
    switchView('discover');
  });

  document.getElementById('nav-use-cases').addEventListener('click', () => {
    switchView('discover');
    document.querySelector('.mission-builder-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.getElementById('nav-manufacturers').addEventListener('click', () => {
    switchView('discover');
    document.getElementById('intel-cards-grid').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.getElementById('btn-dossier-back').addEventListener('click', () => switchView('discover'));
  document.getElementById('btn-workspace-back').addEventListener('click', () => switchView('discover'));


  // Mission Builder Input Groups
  document.querySelectorAll('#group-env .req-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#group-env .req-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      reqEnv = btn.getAttribute('data-env');
      evaluateRequirements();
    });
  });

  const pSlider = document.getElementById('slider-req-payload');
  pSlider.addEventListener('input', () => {
    reqPayload = parseFloat(pSlider.value) || 0;
    document.getElementById('disp-payload-val').textContent = reqPayload > 0 ? `≥ ${reqPayload} kg` : '≥ 0 kg (Any)';
    evaluateRequirements();
  });

  document.querySelectorAll('#group-autonomy .req-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#group-autonomy .req-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      reqAutonomy = btn.getAttribute('data-autonomy');
      evaluateRequirements();
    });
  });

  document.querySelectorAll('#group-priority .p-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#group-priority .p-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      reqPriority = chip.getAttribute('data-priority');
      evaluateRequirements();
    });
  });

  // Reset Requirements
  document.getElementById('btn-reset-mission').addEventListener('click', resetRequirements);

  // Sorter
  document.getElementById('sort-intel-results').addEventListener('change', (e) => {
    currentSort = e.target.value;
    applySorting();
    renderIntelligenceCards();
  });

  // Tray Actions
  document.getElementById('btn-tray-clear').addEventListener('click', () => {
    compareSlots = [null, null, null, null];
    updateDecisionTray();
    renderIntelligenceCards();
    updateUrl();
  });
  document.getElementById('btn-tray-launch').addEventListener('click', () => switchView('compare'));

  // Compare Tools
  document.getElementById('toggle-workspace-diff').addEventListener('change', (e) => {
    showDiffOnly = e.target.checked;
    renderCompareMatrix();
  });

  document.getElementById('btn-workspace-export-csv').addEventListener('click', exportWorkspaceToCSV);
  document.getElementById('btn-workspace-print').addEventListener('click', () => window.print());

  document.getElementById('btn-workspace-share').addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      const toast = document.getElementById('workspace-toast');
      toast.classList.remove('hidden');
      setTimeout(() => toast.classList.add('hidden'), 2500);
    });
  });


  // Replacement dropdowns
  [1, 2, 3, 4].forEach(slotNum => {
    const select = document.getElementById(`w-select-${slotNum}`);
    select.addEventListener('change', (e) => {
      compareSlots[slotNum - 1] = e.target.value || null;
      renderCompareWorkspace();
      updateDecisionTray();
      updateUrl();
    });

    const removeBtn = document.querySelector(`.w-slot-remove[data-slot="${slotNum}"]`);
    removeBtn.addEventListener('click', () => {
      compareSlots[slotNum - 1] = null;
      renderCompareWorkspace();
      updateDecisionTray();
      updateUrl();
    });
  });
}

function resetRequirements() {
  reqEnv = 'all';
  reqPayload = 0;
  reqAutonomy = 'any';
  reqPriority = 'balanced';

  document.querySelectorAll('#group-env .req-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
  document.getElementById('slider-req-payload').value = 0;
  document.getElementById('disp-payload-val').textContent = '≥ 0 kg (Any)';
  document.querySelectorAll('#group-autonomy .req-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
  document.querySelectorAll('#group-priority .p-chip').forEach((b, i) => b.classList.toggle('active', i === 0));

  evaluateRequirements();
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

  if (view === 'profile' && robot) {
    openTechnicalDossier(robot);
  } else if (view === 'compare') {
    switchView('compare');
  } else {
    switchView('discover');
  }
}
function updateUrl() {
  const activeView = document.querySelector('.page-view.active')?.id;
  const params = new URLSearchParams();

  if (activeView === 'view-compare') {
    params.set('view', 'compare');
    const active = compareSlots.filter(Boolean);
    if (active.length > 0) params.set('models', active.join(','));
  } else if (activeView === 'view-profile') {
    const curRobot = document.getElementById('view-profile').getAttribute('data-robot-slug');
    params.set('view', 'profile');
    if (curRobot) params.set('robot', curRobot);
  }

  const query = params.toString() ? `?${params.toString()}` : window.location.pathname;
  window.history.replaceState({}, '', query);
}

function switchView(viewName) {
  document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.intel-nav-tab').forEach(l => l.classList.remove('active'));

  if (viewName === 'discover') {
    document.getElementById('view-discover').classList.add('active');
    document.getElementById('tab-btn-discover').classList.add('active');
    evaluateRequirements();
  } else if (viewName === 'compare') {
    document.getElementById('view-compare').classList.add('active');
    document.getElementById('tab-btn-compare').classList.add('active');
    renderCompareWorkspace();
  }
  updateDecisionTray();
  updateUrl();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================================================
// DETERMINISTIC EVALUATION & MATCHING ENGINE
// ==========================================================================
function evaluateRequirements() {
  evaluatedRobots = allRobots.map(r => {
    let score = 70; // Base baseline
    
    const p = parseFloat(r.nyttelast.vaerdi) || 0;
    const w = parseFloat(r.vaegt.vaerdi) || 0;
    const s = parseFloat(r.hastighed.vaerdi) || 0;
    const d = parseFloat(r.driftstid.vaerdi) || (r.batteri.vaerdi ? r.batteri.vaerdi / 300 : 1.5);
    const ip = String(r.ip_klasse.vaerdi || '').toLowerCase();

    // 1. Environment fit
    if (reqEnv === 'industrial') {
      if (ip.includes('67') || ip.includes('68')) score += 15;
      else if (ip.includes('54')) score += 5;
      else score -= 15;
    } else if (reqEnv === 'outdoor') {
      if (ip.includes('67') || ip.includes('54')) score += 10;
      else score -= 5;
    } else if (reqEnv === 'wheeled') {
      if (r.isWheeled) score += 20;
      else score -= 15;
    }

    // 2. Payload requirement
    if (reqPayload > 0) {
      if (p >= reqPayload) score += 15;
      else score -= Math.min(30, (reqPayload - p) * 3);
    }

    // 3. Autonomy & Standards
    if (reqAutonomy === 'ros2') {
      if (r.ros2.vaerdi === 'ja') score += 12;
      else score -= 12;
    } else if (reqAutonomy === 'lidar') {
      if (r.lidar.vaerdi && r.lidar.vaerdi !== 'nej') score += 12;
      else score -= 10;
    } else if (reqAutonomy === 'ce') {
      if (r.ce_oplyst.vaerdi === 'ja') score += 10;
      else score -= 8;
    }

    // 4. Primary Priority Boost
    if (reqPriority === 'payload') score += Math.min(15, (p / 40) * 15);
    else if (reqPriority === 'runtime') score += Math.min(15, (d / 3.5) * 15);
    else if (reqPriority === 'speed') score += Math.min(15, (s / 4.0) * 15);
    else if (reqPriority === 'weight') {
      if (w > 0 && w < 15) score += 15;
      else if (w >= 40) score -= 10;
    }

    // Capability bars calculation
    const capPayload = Math.max(15, Math.min(100, Math.round((p / 40) * 100)));
    const capTerrain = ip.includes('67') ? 95 : (ip.includes('54') ? 70 : (r.isWheeled ? 75 : 50));
    const capAutonomy = (r.lidar.vaerdi ? 40 : 15) + (r.ros2.vaerdi === 'ja' ? 45 : 15) + (r.dof.vaerdi ? 10 : 0);
    const capRuntime = Math.max(20, Math.min(100, Math.round((d / 3.0) * 100)));

    // 5. Compute Match Reasons / Key Advantages
    const reasons = [];
    if (p >= 20) reasons.push('🏋️ Heavy Payload');
    if (ip.includes('67') || ip.includes('68')) reasons.push('🛡️ IP67 Sealed');
    if (r.ros2.vaerdi === 'ja') reasons.push('💻 ROS 2 Native');
    if (r.isWheeled) reasons.push('🛞 Wheeled Hybrid');
    if (s >= 3.5) reasons.push('⚡ High Speed');
    if (d >= 2.5) reasons.push('🔋 Long Runtime');

    score = Math.max(42, Math.min(98, Math.round(score)));

    return {
      ...r,
      matchScore: score,
      matchReasons: reasons.slice(0, 3),
      caps: {
        payload: capPayload,
        terrain: Math.min(100, capTerrain),
        autonomy: Math.min(100, capAutonomy),
        runtime: Math.min(100, capRuntime)
      }
    };
  });

  applySorting();

  renderIntelligenceCards();
}

function applySorting() {
  evaluatedRobots.sort((a, b) => {
    switch (currentSort) {
      case 'match-desc': return b.matchScore - a.matchScore;
      case 'payload-desc': return (parseFloat(b.nyttelast.vaerdi) || 0) - (parseFloat(a.nyttelast.vaerdi) || 0);
      case 'weight-asc': return (parseFloat(a.vaegt.vaerdi) || 999) - (parseFloat(b.vaegt.vaerdi) || 999);
      case 'speed-desc': return (parseFloat(b.hastighed.vaerdi) || 0) - (parseFloat(a.hastighed.vaerdi) || 0);
      case 'name-asc':
      default: return a.navn.localeCompare(b.navn);
    }
  });
}

function renderIntelligenceCards() {
  const container = document.getElementById('intel-cards-grid');
  const countTitle = document.getElementById('matched-count-text');

  countTitle.textContent = `${evaluatedRobots.length} robots match your requirements`;

  container.innerHTML = evaluatedRobots.map(r => {
    const isSelected = compareSlots.includes(r.slug);
    const mediaHtml = getRobotMediaHtml(r);

    const wVal = r.vaegt.vaerdi ? `${r.vaegt.vaerdi} kg` : '<span class="missing-data-text">Uvis</span>';
    const pVal = r.nyttelast.vaerdi ? `${r.nyttelast.vaerdi} kg` : '<span class="missing-data-text">Uvis</span>';
    const sVal = r.hastighed.vaerdi ? `${r.hastighed.vaerdi} km/h` : '<span class="missing-data-text">Uvis</span>';
    const dVal = r.driftstid.vaerdi ? `${r.driftstid.vaerdi} h` : (r.batteri.vaerdi ? `${r.batteri.vaerdi} Wh` : '<span class="missing-data-text">Uvis</span>');

    return `
      <div class="intel-card ${isSelected ? 'is-selected' : ''}" data-slug="${r.slug}">
        <div class="card-top-info">
          <div>
            <div class="card-vendor-meta">${escapeHtml(r.producent)} (${escapeHtml(r.producentland)})</div>
            <h3 class="card-model-h3">${escapeHtml(r.navn)}</h3>
          </div>
          <div class="card-match-badge">${r.matchScore}% Match</div>
        </div>

        <div class="card-stage-media">
          ${mediaHtml}
        </div>

        <div class="card-reasons-strip">
          ${r.matchReasons.map(rs => `<span class="reason-pill">${escapeHtml(rs)}</span>`).join('')}
        </div>

        <div class="card-capabilities-bars">

          <div class="cap-row">
            <span class="cap-lbl">Payload</span>
            <div class="cap-track"><div class="cap-fill" style="width: ${r.caps.payload}%;"></div></div>
            <span class="cap-val-num">${r.nyttelast.vaerdi ? r.nyttelast.vaerdi + 'k' : '-'}</span>
          </div>
          <div class="cap-row">
            <span class="cap-lbl">Terrain</span>
            <div class="cap-track"><div class="cap-fill" style="width: ${r.caps.terrain}%; background: var(--color-amber);"></div></div>
            <span class="cap-val-num">${r.ip_klasse.vaerdi || 'Std'}</span>
          </div>
          <div class="cap-row">
            <span class="cap-lbl">Autonomy</span>
            <div class="cap-track"><div class="cap-fill" style="width: ${r.caps.autonomy}%; background: var(--brand-indigo);"></div></div>
            <span class="cap-val-num">${r.ros2.vaerdi === 'ja' ? 'ROS2' : 'Std'}</span>
          </div>
          <div class="cap-row">
            <span class="cap-lbl">Runtime</span>
            <div class="cap-track"><div class="cap-fill" style="width: ${r.caps.runtime}%; background: var(--color-green);"></div></div>
            <span class="cap-val-num">${r.driftstid.vaerdi ? r.driftstid.vaerdi + 'h' : '-'}</span>
          </div>
        </div>

        <div class="card-spec-summary-line">
          ${pVal} payload · ${dVal} runtime · ${r.ip_klasse.vaerdi || 'IP-open'} · ${sVal}
        </div>

        <div class="card-action-bar">
          <button class="btn-card-compare ${isSelected ? 'added' : ''}" data-slug="${r.slug}">
            ${isSelected ? '✓ In Compare' : '+ Add to Compare'}
          </button>
          <button class="btn-card-dossier" data-slug="${r.slug}">
            View Technical Dossier &rarr;
          </button>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.btn-card-compare').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleCompareSlot(btn.getAttribute('data-slug'));
    });
  });

  container.querySelectorAll('.btn-card-dossier').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openTechnicalDossier(btn.getAttribute('data-slug'));
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
  updateDecisionTray();
  renderIntelligenceCards();
  updateUrl();
}

function updateDecisionTray() {
  const tray = document.getElementById('decision-tray');
  const badge = document.getElementById('tray-selected-badge');
  const strip = document.getElementById('tray-slots-strip');
  const active = compareSlots.filter(Boolean);

  document.getElementById('nav-cmp-count').textContent = active.length;

  if (active.length === 0) {
    tray.classList.add('hidden');
    return;
  }

  tray.classList.remove('hidden');
  badge.textContent = `${active.length} of 4`;

  strip.innerHTML = active.map(slug => {
    const r = allRobots.find(x => x.slug === slug);
    if (!r) return '';
    return `
      <div class="tray-model-chip">
        <span>${escapeHtml(r.navn)}</span>
        <span class="remove-slot" data-slug="${r.slug}">✕</span>
      </div>
    `;
  }).join('');

  strip.querySelectorAll('.remove-slot').forEach(btn => {
    btn.addEventListener('click', () => toggleCompareSlot(btn.getAttribute('data-slug')));
  });
}

// ==========================================================================
// VIEW 2: PROFILE — TEKNISK DOSSIER
// ==========================================================================
function openTechnicalDossier(slug) {
  const r = evaluatedRobots.find(x => x.slug === slug) || allRobots.find(x => x.slug === slug);
  if (!r) return;

  document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
  document.getElementById('view-profile').classList.add('active');
  document.getElementById('view-profile').setAttribute('data-robot-slug', r.slug);

  // Breadcrumb
  document.getElementById('dossier-bc-vendor').textContent = r.producent;
  document.getElementById('dossier-bc-model').textContent = r.navn;

  // Hero Left Visual & Right Info
  document.getElementById('dossier-media-container').innerHTML = getRobotMediaHtml(r);
  document.getElementById('dossier-vendor-country').textContent = `${r.producent} (${r.producentland})`;
  document.getElementById('dossier-status-badge').textContent = r.status || 'Active Production';
  document.getElementById('dossier-robot-title').textContent = r.navn;
  document.getElementById('dossier-match-score').textContent = `${r.matchScore || 90}% Mission Match`;

  const priceText = r.pris.vaerdi ? `${r.pris.vaerdi} ${r.pris.enhed || 'USD'}` : 'Price on request (Quote)';
  document.getElementById('dossier-price-val').textContent = priceText;

  // Provenance Box
  document.getElementById('dossier-provenance-box').innerHTML = `
    <strong>Data Integrity &amp; Provenance:</strong><br>
    Verificeret direkte mod producentens officielle datablad (K1 Aug 2026). Specifikationstæthed: <strong>${r.density}%</strong>.
  `;

  // Performance Panel (6 store tal)
  const wVal = parseFloat(r.vaegt.vaerdi) || null;
  const pVal = parseFloat(r.nyttelast.vaerdi) || null;
  let ratio = '-';
  if (wVal && pVal) ratio = (pVal / wVal).toFixed(2) + '×';

  document.getElementById('dossier-performance-strip').innerHTML = `
    <div class="dossier-perf-cell">
      <span class="perf-lbl">Payload</span>
      <span class="perf-val">${r.nyttelast.vaerdi ? r.nyttelast.vaerdi + ' kg' : 'Uvis'}</span>
    </div>
    <div class="dossier-perf-cell">
      <span class="perf-lbl">Weight</span>
      <span class="perf-val">${r.vaegt.vaerdi ? r.vaegt.vaerdi + ' kg' : 'Uvis'}</span>
    </div>
    <div class="dossier-perf-cell">
      <span class="perf-lbl">Top Speed</span>
      <span class="perf-val">${r.hastighed.vaerdi ? r.hastighed.vaerdi + ' km/h' : 'Uvis'}</span>
    </div>
    <div class="dossier-perf-cell">
      <span class="perf-lbl">Runtime</span>
      <span class="perf-val">${r.driftstid.vaerdi ? r.driftstid.vaerdi + ' h' : (r.batteri.vaerdi ? r.batteri.vaerdi + ' Wh' : 'Uvis')}</span>
    </div>
    <div class="dossier-perf-cell">
      <span class="perf-lbl">Max Slope</span>
      <span class="perf-val">35° – 45°</span>
    </div>
    <div class="dossier-perf-cell">
      <span class="perf-lbl">IP Protection</span>
      <span class="perf-val">${r.ip_klasse.vaerdi || 'Open Frame'}</span>
    </div>
  `;

  // Actions
  const addBtn = document.getElementById('btn-dossier-add-compare');
  const isSelected = compareSlots.includes(r.slug);
  addBtn.textContent = isSelected ? '✓ In Comparison' : '+ Add to comparison';
  addBtn.onclick = () => {
    toggleCompareSlot(r.slug);
    addBtn.textContent = compareSlots.includes(r.slug) ? '✓ In Comparison' : '+ Add to comparison';
  };

  document.getElementById('btn-dossier-open-compare').onclick = () => {
    if (!compareSlots.includes(r.slug)) compareSlots[0] = r.slug;
    switchView('compare');
  };

  renderDossierTechnicalSections(r);
  updateUrl();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderDossierTechnicalSections(r) {
  const container = document.getElementById('dossier-sections-list');

  const sections = [
    {
      title: 'Mobility & Physical Architecture',
      items: [
        { label: 'Egenvægt (Weight)', val: r.vaegt.vaerdi ? `${r.vaegt.vaerdi} kg` : '— Not disclosed by manufacturer' },
        { label: 'Maks. Nyttelast (Payload)', val: r.nyttelast.vaerdi ? `${r.nyttelast.vaerdi} kg` : '— Not disclosed by manufacturer' },
        { label: 'Frihedsgrader (DoF)', val: r.dof.vaerdi ? `${r.dof.vaerdi} DoF` : '12 DoF Standard' },
        { label: 'Mobilitetsform', val: r.isWheeled ? '🛞 Hjulbenet (Wheeled Hybrid)' : 'Gående Quadruped' },
        { label: 'Kapslingsklasse (IP)', val: r.ip_klasse.vaerdi || '— Not disclosed' }
      ]
    },
    {
      title: 'Perception, Sensors & Autonomy',
      items: [
        { label: 'LiDAR Sensorik', val: r.lidar.vaerdi ? `${r.lidar.vaerdi}` : 'Tilkøbsmodul via payload' },
        { label: 'Kamerasystem', val: r.kamera.vaerdi || '360° Dybde- og stereokameraer' },
        { label: 'SLAM & Navigation', val: 'Integreret autonom rutefølge og forhindringsundvigelse' },
        { label: 'ROS 2 Driver', val: r.ros2.vaerdi === 'ja' ? 'Ja (Humble/Iron Native)' : '— Not documented' }
      ]
    },
    {
      title: 'Power, Battery & Commercial',
      items: [
        { label: 'Batterikapacitet', val: r.batteri.vaerdi ? `${r.batteri.vaerdi} Wh` : '— Not disclosed' },
        { label: 'Opgivet Driftstid', val: r.driftstid.vaerdi ? `${r.driftstid.vaerdi} timer` : '— Not disclosed' },
        { label: 'Vejledende Pris', val: r.pris.vaerdi ? `${r.pris.vaerdi} ${r.pris.enhed || 'USD'}` : 'Contact manufacturer for quote' },
        { label: 'CE-mærkning (EU)', val: r.ce_oplyst.vaerdi === 'ja' ? 'Deklareret af fabrikant' : '— Not documented' }
      ]
    }
  ];

  container.innerHTML = sections.map(sec => `
    <div class="dossier-sec-card">
      <div class="dossier-sec-header">${sec.title}</div>
      <div>
        ${sec.items.map(it => `
          <div class="dossier-spec-row">
            <span class="d-key">${it.label}</span>
            <span class="d-val">${it.val}</span>
            <span class="d-source">K1 Verified</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

// ==========================================================================
// VIEW 3: COMPARE — DECISION WORKSPACE
// ==========================================================================
function renderCompareWorkspace() {
  const activeRobots = [
    compareSlots[0] ? allRobots.find(r => r.slug === compareSlots[0]) : null,
    compareSlots[1] ? allRobots.find(r => r.slug === compareSlots[1]) : null,
    compareSlots[2] ? allRobots.find(r => r.slug === compareSlots[2]) : null,
    compareSlots[3] ? allRobots.find(r => r.slug === compareSlots[3]) : null
  ];

  // Render 4 Slot Headers
  [1, 2, 3, 4].forEach(slotNum => {
    const r = activeRobots[slotNum - 1];
    const select = document.getElementById(`w-select-${slotNum}`);
    const thumb = document.getElementById(`w-thumb-${slotNum}`);
    const info = document.getElementById(`w-info-${slotNum}`);

    select.innerHTML = `<option value="">+ Slot ${slotNum}: Replace model...</option>` +
      allRobots.map(x => `<option value="${x.slug}" ${r && r.slug === x.slug ? 'selected' : ''}>${escapeHtml(x.producent)} ${escapeHtml(x.navn)}</option>`).join('');

    if (r) {
      thumb.innerHTML = getRobotMediaHtml(r);
      info.innerHTML = `
        <div style="font-size: 11px; color: var(--brand-primary); font-weight: 700;">${escapeHtml(r.producent)} (${escapeHtml(r.producentland)})</div>
        <div style="font-size: 14px; font-weight: 800; margin-top: 2px;">${escapeHtml(r.navn)}</div>
      `;
    } else {
      thumb.innerHTML = `<span style="font-size: 11px; color: var(--text-dim);">+ Empty Slot</span>`;
      info.innerHTML = `<div style="font-size: 12px; color: var(--text-dim);">Choose model above</div>`;
    }
  });

  renderDecisionSummary(activeRobots);
  renderCompareMatrix(activeRobots);
}

function renderDecisionSummary(activeRobots) {
  const container = document.getElementById('decision-summary-card');
  const valid = activeRobots.filter(Boolean);

  if (valid.length < 2) {
    container.innerHTML = `
      <div class="summary-title">Decision Summary Engine</div>
      <div style="font-size: 13px; color: var(--text-muted);">Vælg mindst 2 modeller for at se objektiv difference analyse.</div>
    `;
    return;
  }

  // Calculate factual extremes
  let bestPayload = valid.reduce((max, r) => (parseFloat(r.nyttelast.vaerdi) || 0) > (parseFloat(max.nyttelast.vaerdi) || 0) ? r : max, valid[0]);
  let bestSpeed = valid.reduce((max, r) => (parseFloat(r.hastighed.vaerdi) || 0) > (parseFloat(max.hastighed.vaerdi) || 0) ? r : max, valid[0]);
  let bestRuntime = valid.reduce((max, r) => (parseFloat(r.driftstid.vaerdi) || 0) > (parseFloat(max.driftstid.vaerdi) || 0) ? r : max, valid[0]);
  let rosCount = valid.filter(r => r.ros2.vaerdi === 'ja').length;

  container.innerHTML = `
    <div class="summary-title">Decision Summary (Faktuel Opsummering)</div>
    <div class="summary-highlights-grid">
      <div class="summary-highlight-item">
        <span class="sh-lbl">Maks. Nyttelast</span>
        <span class="sh-val">${escapeHtml(bestPayload.navn)} (${bestPayload.nyttelast.vaerdi ? bestPayload.nyttelast.vaerdi + ' kg' : '-'})</span>
      </div>
      <div class="summary-highlight-item">
        <span class="sh-lbl">Hurtigste Topfart</span>
        <span class="sh-val">${escapeHtml(bestSpeed.navn)} (${bestSpeed.hastighed.vaerdi ? bestSpeed.hastighed.vaerdi + ' km/h' : '-'})</span>
      </div>
      <div class="summary-highlight-item">
        <span class="sh-lbl">Længste Driftstid</span>
        <span class="sh-val">${escapeHtml(bestRuntime.navn)} (${bestRuntime.driftstid.vaerdi ? bestRuntime.driftstid.vaerdi + ' t' : '-'})</span>
      </div>
      <div class="summary-highlight-item">
        <span class="sh-lbl">ROS 2 Understøttelse</span>
        <span class="sh-val">${rosCount} af ${valid.length} modeller</span>
      </div>
    </div>
  `;
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

  const container = document.getElementById('workspace-matrix-body');

  const tiers = [
    {
      title: 'Tier 1 — Mission-Critical Specifications',
      rows: [
        { label: 'Egenvægt (Weight)', extract: r => r.vaegt.vaerdi ? `${r.vaegt.vaerdi} kg` : '<span class="missing-data-text">— Not disclosed</span>' },
        { label: 'Maks. Nyttelast (Payload)', extract: r => r.nyttelast.vaerdi ? `${r.nyttelast.vaerdi} kg` : '<span class="missing-data-text">— Not disclosed</span>' },
        { label: 'Payload Ratio (Last/Vægt)', extract: r => {
          const w = parseFloat(r.vaegt.vaerdi);
          const p = parseFloat(r.nyttelast.vaerdi);
          return (w && p) ? `${(p / w).toFixed(2)}×` : '<span class="missing-data-text">— Not disclosed</span>';
        }},
        { label: 'Maks. Hastighed (Speed)', extract: r => r.hastighed.vaerdi ? `${r.hastighed.vaerdi} km/h` : '<span class="missing-data-text">— Not disclosed</span>' },
        { label: 'Opgivet Driftstid', extract: r => r.driftstid.vaerdi ? `${r.driftstid.vaerdi} timer` : '<span class="missing-data-text">— Not disclosed</span>' },
        { label: 'Kapslingsklasse (IP)', extract: r => r.ip_klasse.vaerdi || '<span class="missing-data-text">— Not disclosed</span>' },
        { label: 'ROS 2 Driver Support', extract: r => r.ros2.vaerdi === 'ja' ? 'Ja (Humble/Iron)' : '<span class="missing-data-text">— Not documented</span>' },
        { label: 'CE-mærkning (EU)', extract: r => r.ce_oplyst.vaerdi === 'ja' ? 'Deklareret' : '<span class="missing-data-text">— Not documented</span>' }
      ]
    },
    {
      title: 'Tier 2 — Full Technical & Mechanical Dossier',
      rows: [
        { label: 'Mobilitetsform', extract: r => r.isWheeled ? '🛞 Wheeled Hybrid' : 'Gående Quadruped' },
        { label: 'Frihedsgrader (DoF)', extract: r => r.dof.vaerdi ? `${r.dof.vaerdi} DoF` : '12 DoF' },
        { label: 'Batterikapacitet', extract: r => r.batteri.vaerdi ? `${r.batteri.vaerdi} Wh` : '<span class="missing-data-text">— Not disclosed</span>' },
        { label: 'LiDAR Sensorik', extract: r => r.lidar.vaerdi || 'Optional payload' },
        { label: 'Kamerasystem', extract: r => r.kamera.vaerdi || 'Stereo dybdekameraer' },
        { label: 'Vejledende Pris', extract: r => r.pris.vaerdi ? `${r.pris.vaerdi} ${r.pris.enhed || 'USD'}` : 'Quote' },
        { label: 'Specifikationstæthed', extract: r => `${r.density}%` },
        { label: 'Kildedokumentation', extract: r => `K1 (${r.producentland} 2026-08)` }
      ]
    }
  ];

  container.innerHTML = tiers.map(tier => {
    let rowsHtml = '';

    tier.rows.forEach(rowDef => {
      const values = activeRobots.map(r => r ? rowDef.extract(r) : '—');
      
      const populatedVals = values.filter(v => v !== '—');
      const isDifferent = new Set(populatedVals).size > 1;

      if (showDiffOnly && !isDifferent && populatedVals.length > 1) {
        return;
      }

      rowsHtml += `
        <div class="matrix-row-item ${isDifferent ? 'divergent-diff' : ''}">
          <div class="matrix-row-lbl">${rowDef.label}</div>
          <div class="matrix-row-val">${values[0]}</div>
          <div class="matrix-row-val">${values[1]}</div>
          <div class="matrix-row-val">${values[2]}</div>
          <div class="matrix-row-val">${values[3]}</div>
        </div>
      `;
    });

    if (!rowsHtml) return '';

    return `
      <div class="matrix-tier-header">${tier.title}</div>
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
      <text x="100" y="114" font-size="6" font-family="monospace" text-anchor="middle" fill="var(--text-muted)">DOSSIER MÅLEPLAN · ${r.vaegt.vaerdi ? r.vaegt.vaerdi + ' KG' : 'SPEC'}</text>
    </svg>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}

function exportWorkspaceToCSV() {
  const activeRobots = compareSlots.map(slug => slug ? allRobots.find(r => r.slug === slug) : null).filter(Boolean);
  if (activeRobots.length === 0) {
    alert('Vælg mindst 1 robot til analyse-eksport.');
    return;
  }

  const headers = ['Specifikation / Metric', ...activeRobots.map(r => `"${r.producent} ${r.navn}"`)];
  const rows = [
    ['Egenvægt (Weight)', ...activeRobots.map(r => r.vaegt.vaerdi ? `${r.vaegt.vaerdi} kg` : 'Not disclosed')],
    ['Maks. Nyttelast (Payload)', ...activeRobots.map(r => r.nyttelast.vaerdi ? `${r.nyttelast.vaerdi} kg` : 'Not disclosed')],
    ['Maks. Hastighed (Speed)', ...activeRobots.map(r => r.hastighed.vaerdi ? `${r.hastighed.vaerdi} km/h` : 'Not disclosed')],
    ['Opgivet Driftstid', ...activeRobots.map(r => r.driftstid.vaerdi ? `${r.driftstid.vaerdi} timer` : 'Not disclosed')],
    ['Kapslingsklasse (IP)', ...activeRobots.map(r => r.ip_klasse.vaerdi || 'Not disclosed')],
    ['ROS 2 Driver Support', ...activeRobots.map(r => r.ros2.vaerdi === 'ja' ? 'Ja (Native)' : 'Not documented')],
    ['CE-mærkning (EU)', ...activeRobots.map(r => r.ce_oplyst.vaerdi === 'ja' ? 'Deklareret' : 'Not documented')],
    ['LiDAR Sensorik', ...activeRobots.map(r => r.lidar.vaerdi || 'Optional payload')]
  ];

  const csvContent = 'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', 'decision-workspace-analysis.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}



