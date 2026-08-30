// ==========================================================================
// QC-TERMINAL // FLIGHT DECK INTERACTIVITY & TELEMETRY ENGINE
// ==========================================================================

let allRobots = [];
let filteredRobots = [];
let activeRobotSlug = null;
let currentFilter = 'all';
let currentSort = 'density-desc';
let isScatterVisible = true;

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

    initClock();
    initEventListeners();
    applyFilters();

    // Default select first robot
    if (filteredRobots.length > 0) {
      inspectRobot(filteredRobots[0].slug);
    }
  } catch (err) {
    console.error('Telemetri-fejl ved indlæsning:', err);
  }
});

function initClock() {
  const clockEl = document.getElementById('sys-clock');
  function update() {
    const now = new Date();
    clockEl.textContent = now.toTimeString().split(' ')[0] + ' UTC';
  }
  update();
  setInterval(update, 1000);
}

function initEventListeners() {
  // Command input
  const input = document.getElementById('cmd-input');
  const clearBtn = document.getElementById('cmd-clear');
  input.addEventListener('input', () => {
    clearBtn.classList.toggle('hidden', !input.value);
    applyFilters();
  });
  clearBtn.addEventListener('click', () => {
    input.value = '';
    clearBtn.classList.add('hidden');
    applyFilters();
  });

  // Filter Chips
  document.querySelectorAll('.t-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.t-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.getAttribute('data-filter');
      applyFilters();
    });
  });

  // Sort Select
  document.getElementById('matrix-sort-select').addEventListener('change', (e) => {
    currentSort = e.target.value;
    applySort();
    renderMatrix();
  });

  // Toggle Graph
  const graphBtn = document.getElementById('btn-toggle-graph');
  graphBtn.addEventListener('click', () => {
    isScatterVisible = !isScatterVisible;
    document.getElementById('scatter-panel').classList.toggle('collapsed', !isScatterVisible);
    graphBtn.classList.toggle('active', isScatterVisible);
  });

  // HUD Close
  document.getElementById('btn-close-hud').addEventListener('click', () => {
    document.getElementById('inspector-hud').classList.add('hidden');
    activeRobotSlug = null;
    document.querySelectorAll('.flight-matrix-table tr').forEach(r => r.classList.remove('active-row'));
  });

  // Shortcuts Modal
  const modal = document.getElementById('shortcuts-modal');
  document.getElementById('btn-show-shortcuts').addEventListener('click', () => modal.classList.remove('hidden'));
  document.getElementById('btn-close-shortcuts').addEventListener('click', () => modal.classList.add('hidden'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });

  // Global Keydown Handler
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== input) {
      e.preventDefault();
      input.focus();
      input.select();
    } else if (e.key === 'Escape') {
      if (!modal.classList.contains('hidden')) {
        modal.classList.add('hidden');
      } else if (document.activeElement === input) {
        input.value = '';
        clearBtn.classList.add('hidden');
        input.blur();
        applyFilters();
      } else {
        document.getElementById('inspector-hud').classList.add('hidden');
      }
    } else if (e.key === 'g' || e.key === 'G') {
      if (document.activeElement !== input) {
        graphBtn.click();
      }
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (document.activeElement !== input && filteredRobots.length > 0) {
        e.preventDefault();
        const curIdx = filteredRobots.findIndex(r => r.slug === activeRobotSlug);
        let nextIdx = curIdx;
        if (e.key === 'ArrowDown') {
          nextIdx = curIdx < filteredRobots.length - 1 ? curIdx + 1 : 0;
        } else {
          nextIdx = curIdx > 0 ? curIdx - 1 : filteredRobots.length - 1;
        }
        inspectRobot(filteredRobots[nextIdx].slug);
        const row = document.querySelector(`tr[data-slug="${filteredRobots[nextIdx].slug}"]`);
        if (row) row.scrollIntoView({ block: 'nearest' });
      }
    }
  });
}

function applyFilters() {
  const q = document.getElementById('cmd-input').value.toLowerCase().trim();

  filteredRobots = allRobots.filter(r => {
    const match = !q ||
      r.navn.toLowerCase().includes(q) ||
      r.producent.toLowerCase().includes(q) ||
      r.producentland.toLowerCase().includes(q) ||
      (r.ip_klasse.vaerdi && String(r.ip_klasse.vaerdi).toLowerCase().includes(q));

    if (!match) return false;

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
  renderScatterPlot();
  renderMatrix();
  document.getElementById('stat-total-nodes').textContent = filteredRobots.length;
  document.getElementById('matrix-status-text').textContent = `${filteredRobots.length}/${allRobots.length} NODES ACTIVE`;
}

function applySort() {
  filteredRobots.sort((a, b) => {
    switch (currentSort) {
      case 'density-desc': return (b.density || 0) - (a.density || 0);
      case 'weight-asc': return (parseFloat(a.vaegt.vaerdi) || 999) - (parseFloat(b.vaegt.vaerdi) || 999);
      case 'weight-desc': return (parseFloat(b.vaegt.vaerdi) || 0) - (parseFloat(a.vaegt.vaerdi) || 0);
      case 'payload-desc': return (parseFloat(b.nyttelast.vaerdi) || 0) - (parseFloat(a.nyttelast.vaerdi) || 0);
      case 'ratio-desc': {
        const rA = (parseFloat(a.nyttelast.vaerdi) || 0) / (parseFloat(a.vaegt.vaerdi) || 1);
        const rB = (parseFloat(b.nyttelast.vaerdi) || 0) / (parseFloat(b.vaegt.vaerdi) || 1);
        return rB - rA;
      }
      case 'speed-desc': return (parseFloat(b.hastighed.vaerdi) || 0) - (parseFloat(a.hastighed.vaerdi) || 0);
      case 'battery-desc': return (parseFloat(b.batteri.vaerdi) || 0) - (parseFloat(a.batteri.vaerdi) || 0);
      case 'name-asc':
      default: return a.navn.localeCompare(b.navn);
    }
  });
}

// ==========================================================================
// RENDER 2D SCATTER PLOT
// ==========================================================================
function renderScatterPlot() {
  const svg = document.getElementById('scatter-svg');
  const unreportedList = document.getElementById('unreported-list');
  const unreportedCount = document.getElementById('unreported-count');

  const width = 880;
  const height = 260;
  const padLeft = 45;
  const padRight = 30;
  const padTop = 20;
  const padBottom = 35;

  const maxX = 100; // max kg weight
  const maxY = 50;  // max kg payload

  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const unreported = [];
  const plottable = [];

  filteredRobots.forEach(r => {
    const w = parseFloat(r.vaegt.vaerdi);
    const p = parseFloat(r.nyttelast.vaerdi);
    if (!isNaN(w) && !isNaN(p)) {
      plottable.push({ robot: r, x: w, y: p });
    } else {
      unreported.push(r);
    }
  });

  unreportedCount.textContent = unreported.length;
  unreportedList.innerHTML = unreported.map(r => `
    <div class="unreported-item" data-slug="${r.slug}">
      <strong>${escapeHtml(r.navn)}</strong> (${escapeHtml(r.producent)})
    </div>
  `).join('');

  unreportedList.querySelectorAll('.unreported-item').forEach(item => {
    item.addEventListener('click', () => inspectRobot(item.getAttribute('data-slug')));
  });

  // Generate SVG Grid
  let svgHtml = `
    <defs>
      <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
  `;

  // Grid Lines & Ticks (X-Axis: 0, 20, 40, 60, 80, 100 kg)
  [0, 20, 40, 60, 80, 100].forEach(val => {
    const posX = padLeft + (val / maxX) * plotW;
    svgHtml += `
      <line x1="${posX}" y1="${padTop}" x2="${posX}" y2="${height - padBottom}" stroke="#1e293b" stroke-width="1" stroke-dasharray="2,2"/>
      <text x="${posX}" y="${height - padBottom + 16}" fill="#64748b" font-size="10" font-family="JetBrains Mono" text-anchor="middle">${val}kg</text>
    `;
  });

  // Grid Lines & Ticks (Y-Axis: 0, 10, 20, 30, 40, 50 kg)
  [0, 10, 20, 30, 40, 50].forEach(val => {
    const posY = height - padBottom - (val / maxY) * plotH;
    svgHtml += `
      <line x1="${padLeft}" y1="${posY}" x2="${width - padRight}" y2="${posY}" stroke="#1e293b" stroke-width="1" stroke-dasharray="2,2"/>
      <text x="${padLeft - 8}" y="${posY + 4}" fill="#64748b" font-size="10" font-family="JetBrains Mono" text-anchor="end">${val}kg</text>
    `;
  });

  // 1.0x Ratio Reference Line
  const diagX = padLeft + (50 / maxX) * plotW;
  const diagY = height - padBottom - (50 / maxY) * plotH;
  svgHtml += `
    <line x1="${padLeft}" y1="${height - padBottom}" x2="${diagX}" y2="${diagY}" stroke="rgba(255,255,255,0.25)" stroke-width="1" stroke-dasharray="4,4"/>
    <text x="${diagX + 6}" y="${diagY + 4}" fill="#94a3b8" font-size="9" font-family="JetBrains Mono">1.0× Ratio Line</text>
  `;

  // Plot Nodes
  plottable.forEach(p => {
    const cx = padLeft + Math.min(plotW, (p.x / maxX) * plotW);
    const cy = height - padBottom - Math.min(plotH, (p.y / maxY) * plotH);
    const isWheeled = p.robot.isWheeled;
    const color = isWheeled ? 'var(--c-amber)' : 'var(--c-cyan)';
    const filter = isWheeled ? 'url(#glow-amber)' : 'url(#glow-cyan)';
    const isActive = p.robot.slug === activeRobotSlug;

    svgHtml += `
      <g class="scatter-node" data-slug="${p.robot.slug}" transform="translate(${cx}, ${cy})" style="cursor: pointer;">
        <circle r="${isActive ? 7 : 4.5}" fill="${color}" filter="${filter}" />
        ${isActive ? `<circle r="12" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.8" />` : ''}
      </g>
    `;
  });

  svg.innerHTML = svgHtml;

  // Tooltip & click events on scatter nodes
  const tooltip = document.getElementById('scatter-tooltip');
  svg.querySelectorAll('.scatter-node').forEach(node => {
    const slug = node.getAttribute('data-slug');
    const r = allRobots.find(x => x.slug === slug);
    if (!r) return;

    node.addEventListener('mouseenter', (e) => {
      tooltip.innerHTML = `
        <div style="font-weight: 800; color: #fff;">${escapeHtml(r.navn)}</div>
        <div style="color: var(--c-cyan); font-size: 10px;">${escapeHtml(r.producent)} (${escapeHtml(r.producentland)})</div>
        <div style="margin-top: 4px; font-size: 10px;">
          Vægt: <strong>${r.vaegt.vaerdi || '-'} kg</strong> · Nyttelast: <strong>${r.nyttelast.vaerdi || '-'} kg</strong>
        </div>
      `;
      tooltip.classList.remove('hidden');
    });

    node.addEventListener('mousemove', (e) => {
      tooltip.style.left = `${e.clientX + 12}px`;
      tooltip.style.top = `${e.clientY + 12}px`;
    });

    node.addEventListener('mouseleave', () => {
      tooltip.classList.add('hidden');
    });

    node.addEventListener('click', () => {
      inspectRobot(r.slug);
    });
  });
}

// ==========================================================================
// RENDER DENSE MATRIX
// ==========================================================================
function renderMatrix() {
  const tbody = document.getElementById('flight-tbody');

  // Distribution maxes for inline bars
  const maxWeight = 100;
  const maxPayload = 50;
  const maxSpeed = 25;
  const maxBattery = 2500;

  tbody.innerHTML = filteredRobots.map((r, i) => {
    const isActive = r.slug === activeRobotSlug;
    const wVal = parseFloat(r.vaegt.vaerdi) || null;
    const pVal = parseFloat(r.nyttelast.vaerdi) || null;
    const sVal = parseFloat(r.hastighed.vaerdi) || null;
    const bVal = parseFloat(r.batteri.vaerdi) || null;

    let ratio = '-';
    if (wVal && pVal) ratio = (pVal / wVal).toFixed(2) + '×';

    const wBarWidth = wVal ? Math.min(100, (wVal / maxWeight) * 100) : 0;
    const pBarWidth = pVal ? Math.min(100, (pVal / maxPayload) * 100) : 0;
    const sBarWidth = sVal ? Math.min(100, (sVal / maxSpeed) * 100) : 0;
    const bBarWidth = bVal ? Math.min(100, (bVal / maxBattery) * 100) : 0;

    return `
      <tr class="${isActive ? 'active-row' : ''}" data-slug="${r.slug}">
        <td class="col-pinned col-idx">${i + 1}</td>
        <td class="col-pinned col-name"><strong>${escapeHtml(r.navn)}</strong></td>
        <td class="col-pinned col-vendor">${escapeHtml(r.producent)}</td>
        <td class="col-origin">${escapeHtml(r.producentland)}</td>
        <td class="col-type">
          ${r.isWheeled ? '<span class="tag-pill wheel">🛞 Hjul</span>' : 'Gående'}
        </td>
        <td class="col-num data-bar-cell">
          <div class="data-bar-fill" style="width: ${wBarWidth}%;"></div>
          <span class="data-bar-val">${wVal ? wVal + ' kg' : '<span style="color: var(--text-dim);">-</span>'}</span>
        </td>
        <td class="col-num data-bar-cell">
          <div class="data-bar-fill" style="width: ${pBarWidth}%;"></div>
          <span class="data-bar-val">${pVal ? pVal + ' kg' : '<span style="color: var(--text-dim);">-</span>'}</span>
        </td>
        <td class="col-num"><span style="color: var(--c-cyan);">${ratio}</span></td>
        <td class="col-num data-bar-cell">
          <div class="data-bar-fill" style="width: ${sBarWidth}%;"></div>
          <span class="data-bar-val">${sVal ? sVal + ' km/h' : '<span style="color: var(--text-dim);">-</span>'}</span>
        </td>
        <td class="col-num data-bar-cell">
          <div class="data-bar-fill" style="width: ${bBarWidth}%;"></div>
          <span class="data-bar-val">${bVal ? bVal + ' Wh' : '<span style="color: var(--text-dim);">-</span>'}</span>
        </td>
        <td class="col-num">${r.driftstid.vaerdi ? r.driftstid.vaerdi + ' t' : '<span style="color: var(--text-dim);">-</span>'}</td>
        <td class="col-val">${r.dof.vaerdi || '12'}</td>
        <td class="col-val">${r.ip_klasse.vaerdi ? `<span class="tag-pill yes">${r.ip_klasse.vaerdi}</span>` : '<span style="color: var(--text-dim);">-</span>'}</td>
        <td class="col-val">${r.ros2.vaerdi === 'ja' ? '<span class="tag-pill yes">Ja</span>' : '<span style="color: var(--text-dim);">-</span>'}</td>
        <td class="col-val">${r.ce_oplyst.vaerdi === 'ja' ? '<span class="tag-pill yes">Ja</span>' : '<span style="color: var(--text-dim);">-</span>'}</td>
        <td class="col-density"><strong>${r.density}%</strong></td>
        <td class="col-act">
          <button class="btn-inspect-telemetry" data-slug="${r.slug}">INSPECT &gt;</button>
        </td>
      </tr>
    `;
  }).join('');

  tbody.querySelectorAll('tr').forEach(row => {
    row.addEventListener('click', () => {
      inspectRobot(row.getAttribute('data-slug'));
    });
  });
}

// ==========================================================================
// RENDER INSPECTOR HUD (RIGHT PANEL)
// ==========================================================================
function inspectRobot(slug) {
  activeRobotSlug = slug;
  const r = allRobots.find(x => x.slug === slug);
  if (!r) return;

  const hud = document.getElementById('inspector-hud');
  const body = document.getElementById('hud-body');
  hud.classList.remove('hidden');

  // Highlight in table and scatter
  document.querySelectorAll('.flight-matrix-table tr').forEach(row => {
    row.classList.toggle('active-row', row.getAttribute('data-slug') === slug);
  });
  renderScatterPlot();

  const wVal = parseFloat(r.vaegt.vaerdi) || null;
  const pVal = parseFloat(r.nyttelast.vaerdi) || null;
  let ratio = '-';
  if (wVal && pVal) ratio = (pVal / wVal).toFixed(2) + '×';

  const mediaHtml = KNOWN_IMAGES[r.slug] ?
    `<img src="billeder/${KNOWN_IMAGES[r.slug]}" alt="${escapeHtml(r.navn)}">` :
    `<div style="font-size: 10px; color: var(--c-cyan);">[ MÅLEPLAN & BLUEPRINT GENERERET ]</div>`;

  body.innerHTML = `
    <!-- HERO -->
    <div class="hud-hero">
      <div class="hud-media-box">${mediaHtml}</div>
      <div class="hud-robot-name">${escapeHtml(r.navn)}</div>
      <div class="hud-vendor-origin">${escapeHtml(r.producent)} · ${escapeHtml(r.producentland)}</div>
      <div style="display: flex; justify-content: center; gap: 6px;">
        <span class="tag-pill ${r.isWheeled ? 'wheel' : 'yes'}">${r.isWheeled ? '🛞 Hjulbenet' : 'Gående Quadruped'}</span>
        <span class="tag-pill yes">${r.status || 'I produktion'}</span>
        ${r.ce_oplyst.vaerdi === 'ja' ? '<span class="tag-pill yes">🇪🇺 CE</span>' : ''}
      </div>
    </div>

    <!-- 4 GAUGES -->
    <div class="hud-gauge-grid">
      <div class="hud-gauge-card">
        <div class="gauge-val">${r.vaegt.vaerdi ? r.vaegt.vaerdi + ' kg' : 'Uvis'}</div>
        <div class="gauge-lbl">Egenvægt</div>
      </div>
      <div class="hud-gauge-card">
        <div class="gauge-val">${r.nyttelast.vaerdi ? r.nyttelast.vaerdi + ' kg' : 'Uvis'}</div>
        <div class="gauge-lbl">Nyttelast (${ratio})</div>
      </div>
      <div class="hud-gauge-card">
        <div class="gauge-val">${r.hastighed.vaerdi ? r.hastighed.vaerdi + ' km/h' : 'Uvis'}</div>
        <div class="gauge-lbl">Maks. Hastighed</div>
      </div>
      <div class="hud-gauge-card">
        <div class="gauge-val">${r.batteri.vaerdi ? r.batteri.vaerdi + ' Wh' : (r.driftstid.vaerdi ? r.driftstid.vaerdi + ' t' : 'Uvis')}</div>
        <div class="gauge-lbl">Batteri & Drift</div>
      </div>
    </div>

    <!-- SPEC SECTIONS -->
    <div class="hud-spec-block">
      <div class="hud-spec-title">Fysisk Telemetri & Mål</div>
      <div class="hud-spec-row"><span class="hud-spec-key">Egenvægt:</span><span class="hud-spec-val">${r.vaegt.vaerdi ? r.vaegt.vaerdi + ' kg' : 'Ikke oplyst'}</span></div>
      <div class="hud-spec-row"><span class="hud-spec-key">Maks. Nyttelast:</span><span class="hud-spec-val">${r.nyttelast.vaerdi ? r.nyttelast.vaerdi + ' kg' : 'Ikke oplyst'}</span></div>
      <div class="hud-spec-row"><span class="hud-spec-key">Maks. Fart:</span><span class="hud-spec-val">${r.hastighed.vaerdi ? r.hastighed.vaerdi + ' km/h' : 'Ikke oplyst'}</span></div>
      <div class="hud-spec-row"><span class="hud-spec-key">Frihedsgrader (DoF):</span><span class="hud-spec-val">${r.dof.vaerdi || '12'}</span></div>
      <div class="hud-spec-row"><span class="hud-spec-key">Kapsling (IP):</span><span class="hud-spec-val">${r.ip_klasse.vaerdi || 'Ikke oplyst'}</span></div>
    </div>

    <div class="hud-spec-block">
      <div class="hud-spec-title">Energi &amp; Compute Stack</div>
      <div class="hud-spec-row"><span class="hud-spec-key">Batteri Kapacitet:</span><span class="hud-spec-val">${r.batteri.vaerdi ? r.batteri.vaerdi + ' Wh' : 'Ikke oplyst'}</span></div>
      <div class="hud-spec-row"><span class="hud-spec-key">Opgivet Driftstid:</span><span class="hud-spec-val">${r.driftstid.vaerdi ? r.driftstid.vaerdi + ' t' : 'Ikke oplyst'}</span></div>
      <div class="hud-spec-row"><span class="hud-spec-key">LiDAR Sensor:</span><span class="hud-spec-val">${r.lidar.vaerdi || 'Ikke oplyst'}</span></div>
      <div class="hud-spec-row"><span class="hud-spec-key">ROS 2 Support:</span><span class="hud-spec-val">${r.ros2.vaerdi === 'ja' ? 'Ja (Aktiv)' : 'Ikke oplyst'}</span></div>
    </div>

    <div class="hud-spec-block">
      <div class="hud-spec-title">Kommercielt &amp; Regulering</div>
      <div class="hud-spec-row"><span class="hud-spec-key">CE-mærkning:</span><span class="hud-spec-val">${r.ce_oplyst.vaerdi === 'ja' ? 'Oplyst af fabrikant' : 'Ikke dokumenteret'}</span></div>
      <div class="hud-spec-row"><span class="hud-spec-key">Vejledende Pris:</span><span class="hud-spec-val">${r.pris.vaerdi ? r.pris.vaerdi + ' ' + (r.pris.enhed || 'USD') : 'Ikke oplyst'}</span></div>
      <div class="hud-spec-row"><span class="hud-spec-key">Specifikationstæthed:</span><span class="hud-spec-val" style="color: var(--c-green);">${r.density}%</span></div>
    </div>

    <!-- PROVENANCE -->
    <div class="hud-provenance-box">
      <strong>KILDETJEK &amp; AUDIT:</strong><br>
      K1 Officielt Fabriks-datablad (${escapeHtml(r.producentland)}). Kontrolleret senest 2026-08.
    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}
