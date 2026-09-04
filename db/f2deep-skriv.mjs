#!/usr/bin/env node
/**
 * db/f2deep-skriv.mjs — spor/f2deep's skriveredskab (ejet af dette spor
 * alene). Udfylder field_entries.caveat_wording for DEEP Robotics' 77
 * rækker, der har caveat men mangler caveat_wording (BRIEF-f2deep.md).
 *
 * Mønster laant fra db/f2-cjk-skriv.mjs: FØR nogen PATCH køres, tjekker
 * --verificer (og hver --toerloeb/--skriv-kørsel automatisk) hvert
 * wording-fragment som en BOGSTAVELIG delstreng af den/de arkiverede
 * kildefil(er), der hører til robottens produktside — CN og EN er samme
 * side på to sprog, så begge tælles som "producentens egne materialer for
 * denne URL" og et fragment godkendes, hvis det findes i MINDST ÉN af dem.
 *
 * Kun KASSE A-rækker (jf. BRIEF-f2deep.md §4) skrives. Kasse B (ingenting
 * at citere) og kasse C (uafgjort) rører IKKE databasen — braefets egen
 * regel: et tomt caveat_wording er et gyldigt facit, og NOT NULL droppes.
 *
 * Brug:
 *   node db/f2deep-skriv.mjs --verificer     Kun kildetjek, ingen netværk mod DB.
 *   node db/f2deep-skriv.mjs --toerloeb      Standard: viser hvad der VILLE ske.
 *   node db/f2deep-skriv.mjs --skriv         Skriver rent faktisk, én PATCH pr. post.
 *   node db/f2deep-skriv.mjs --skriv --kun=<robot_id>   Skriv kun én robots rækker.
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const ROD = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const KILDE_MAPPE = path.join(ROD, 'media/_kilder/raa-kina-deep-magic-2026-08-19');

function laesDotEnv(fil) {
  if (!fs.existsSync(fil)) return;
  for (const linje of fs.readFileSync(fil, 'utf8').split(/\r?\n/)) {
    const t = linje.trim();
    if (!t || t.startsWith('#')) continue;
    const m = t.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!m) continue;
    const [, noegle, raaVaerdi] = m;
    if (process.env[noegle] !== undefined) continue;
    let vaerdi = raaVaerdi.trim();
    if ((vaerdi.startsWith('"') && vaerdi.endsWith('"')) || (vaerdi.startsWith("'") && vaerdi.endsWith("'"))) {
      vaerdi = vaerdi.slice(1, -1);
    }
    process.env[noegle] = vaerdi;
  }
}

/* ------------------------------------------------------------ kildefiler */

const LITE3 = ['deeprobotics-lite3-specside-en-2026-08-19.html', 'deeprobotics-lite3-specside-cn-2026-08-19.html'];
const LYNX = ['deeprobotics-lynx-m20-specside-en-2026-08-19.html', 'deeprobotics-lynx-m20-specside-cn-2026-08-19.html'];
const LYNXS10 = ['deeprobotics-lynx-s10-specside-en-2026-08-19.html', 'deeprobotics-lynx-s10-specside-cn-2026-08-19.html'];
const MINI = ['deeprobotics-mini-specside-en-2026-08-19.html', 'deeprobotics-mini-specside-cn-2026-08-19.html'];
const X20 = ['deeprobotics-x20-specside-en-2026-08-19.html', 'deeprobotics-x20-specside-cn-2026-08-19.html'];
const X30 = ['deeprobotics-x30-specside-en-2026-08-19.html', 'deeprobotics-x30-specside-cn-2026-08-19.html'];

const kildeCache = new Map();
function laesKilde(rel) {
  if (kildeCache.has(rel)) return kildeCache.get(rel);
  const fuld = path.join(KILDE_MAPPE, rel);
  const indhold = fs.existsSync(fuld) ? fs.readFileSync(fuld, 'utf8') : null;
  kildeCache.set(rel, indhold);
  return indhold;
}

/** Splitter et wording-felt i sine kildefragmenter: segmenter i "..." skal
 *  findes ORDRET i kilden hver for sig. Tekst uden for anførselstegn
 *  (bruges ikke her — alle rækker bruger citationsformen) tjekkes samlet. */
function fragmenter(wording) {
  const dele = [];
  const re = /"([^"]*)"/g;
  let sidst = 0;
  let m;
  let harCitater = false;
  while ((m = re.exec(wording))) {
    harCitater = true;
    const foer = wording.slice(sidst, m.index).trim();
    if (foer) dele.push(foer);
    dele.push(m[1]);
    sidst = re.lastIndex;
  }
  const rest = wording.slice(sidst).trim();
  if (rest) dele.push(rest);
  if (!harCitater && dele.length === 0 && wording.trim()) dele.push(wording.trim());
  return dele;
}

/** Et fragment godkendes, hvis det findes i MINDST ÉN af robottens to
 *  kildefiler (CN+EN er samme side, to sprog — se filhoved). */
function verificerFragment(fragment, kildeRelListe) {
  const forsoegt = [];
  for (const rel of kildeRelListe) {
    const indhold = laesKilde(rel);
    if (indhold === null) { forsoegt.push(`${rel} (mangler)`); continue; }
    if (indhold.includes(fragment)) return { ok: true, fil: rel };
    forsoegt.push(rel);
  }
  return { ok: false, grund: `IKKE fundet ordret i nogen af: ${forsoegt.join(', ')}` };
}

/* ------------------------------------------------------------------ data */
// Kun KASSE A-rækker — kasse B og C skrives ikke (se fund/f2deep-arbejde.json
// for den fulde liste med B's søgninger og C's begrundelser).

const FIELD_ENTRIES = [
  // ------------------------------------------------------- 2190 lite3 (6 A)
  { robot_id: 2190, field_name: 'weight', kilde: LITE3,
    caveat_wording: 'Weight (Incl. Battery)' },
  { robot_id: 2190, field_name: 'payload_walking', kilde: LITE3,
    caveat_wording: '"持续行走负载" "Walking Load"' },
  { robot_id: 2190, field_name: 'stair_step_continuous', kilde: LITE3,
    caveat_wording: '"连续楼梯高度" "Stair"' },
  { robot_id: 2190, field_name: 'autonomy_level', kilde: LITE3,
    caveat_wording: '"Perception Functions" "Front/Rear Obstacle Stop，Visual Following"' },
  { robot_id: 2190, field_name: 'power_output', kilde: LITE3,
    caveat_wording: 'External Power Input (24V/12V/5V)' },
  { robot_id: 2190, field_name: 'data_ports', kilde: LITE3,
    caveat_wording: '"无" "/"' },

  // --------------------------------------------------- 2191 lynx-m20 (11 A)
  { robot_id: 2191, field_name: 'payload_walking', kilde: LYNX,
    caveat_wording: 'Payload Capacity' },
  { robot_id: 2191, field_name: 'payload_standing', kilde: LYNX,
    caveat_wording: 'Max. Load Capacity' },
  { robot_id: 2191, field_name: 'speed', kilde: LYNX,
    caveat_wording: '"Lab-Tested Max. Speed" "Operating Max. Speed" "[1] Lab-tested extreme speed; safety-limited to 3m/s in user mode."' },
  { robot_id: 2191, field_name: 'slope', kilde: LYNX,
    caveat_wording: '[2] Lab-tested slope angle; actual performance varies by surface material.' },
  { robot_id: 2191, field_name: 'obstacle_single', kilde: LYNX,
    caveat_wording: 'Max. Single-Step Height' },
  { robot_id: 2191, field_name: 'stair_step_continuous', kilde: LYNX,
    caveat_wording: 'Max. Continuous Stair Height' },
  { robot_id: 2191, field_name: 'runtime', kilde: LYNX,
    caveat_wording: '"Unloaded Endurance/Range" "3h/15km" "Loaded Endurance/Range (15kg)" "2.5h/12km"' },
  { robot_id: 2191, field_name: 'hot_swap', kilde: LYNX,
    caveat_wording: 'hot-swappable batteries' },
  { robot_id: 2191, field_name: 'docking_station', kilde: LYNX,
    caveat_wording: '自主充电(选配)' },
  { robot_id: 2191, field_name: 'autonomy_level', kilde: LYNX,
    caveat_wording: '"Omnidirectional obstacle avoidance" "Point cloud surround view" "[3][4] Feature enabled via future OTA update."' },
  { robot_id: 2191, field_name: 'power_output', kilde: LYNX,
    caveat_wording: '72V power input' },
  // lidar, compute = kasse B, ikke skrevet.

  // ----------------------------------------------- 2192 lynx-m20-pro (11 A)
  { robot_id: 2192, field_name: 'payload_walking', kilde: LYNX,
    caveat_wording: 'Payload Capacity' },
  { robot_id: 2192, field_name: 'payload_standing', kilde: LYNX,
    caveat_wording: 'Max. Load Capacity' },
  { robot_id: 2192, field_name: 'speed', kilde: LYNX,
    caveat_wording: '"Lab-Tested Max. Speed" "Operating Max. Speed" "[1] Lab-tested extreme speed; safety-limited to 3m/s in user mode."' },
  { robot_id: 2192, field_name: 'slope', kilde: LYNX,
    caveat_wording: '[2] Lab-tested slope angle; actual performance varies by surface material.' },
  { robot_id: 2192, field_name: 'obstacle_single', kilde: LYNX,
    caveat_wording: 'Max. Single-Step Height' },
  { robot_id: 2192, field_name: 'stair_step_continuous', kilde: LYNX,
    caveat_wording: 'Max. Continuous Stair Height' },
  { robot_id: 2192, field_name: 'runtime', kilde: LYNX,
    caveat_wording: '"Unloaded Endurance/Range" "3h/15km" "Loaded Endurance/Range (15kg)" "2.5h/12km"' },
  { robot_id: 2192, field_name: 'hot_swap', kilde: LYNX,
    caveat_wording: 'hot-swappable batteries' },
  { robot_id: 2192, field_name: 'docking_station', kilde: LYNX,
    caveat_wording: '自主充电(选配)' },
  { robot_id: 2192, field_name: 'autonomy_level', kilde: LYNX,
    caveat_wording: '"Omnidirectional obstacle avoidance" "Point cloud surround view" "[3][4] Feature enabled via future OTA update."' },
  { robot_id: 2192, field_name: 'power_output', kilde: LYNX,
    caveat_wording: '72V power input' },
  // lidar, compute = kasse B, ikke skrevet.

  // -------------------------------------------------- 2193 lynx-m20s (10 A)
  { robot_id: 2193, field_name: 'payload_walking', kilde: LYNX,
    caveat_wording: 'Effective Payload (standard terrain)' },
  { robot_id: 2193, field_name: 'payload_standing', kilde: LYNX,
    caveat_wording: 'Maximum Payload Capacity' },
  { robot_id: 2193, field_name: 'speed', kilde: LYNX,
    caveat_wording: '"Max. Tested Speed" "9m/s" "Max. Operating Speed"' },
  { robot_id: 2193, field_name: 'slope', kilde: LYNX,
    caveat_wording: '[2] Lab-tested slope angle; actual performance varies by surface material.' },
  { robot_id: 2193, field_name: 'obstacle_single', kilde: LYNX,
    caveat_wording: 'Max. Single-Step Obstacle Height' },
  { robot_id: 2193, field_name: 'stair_step_continuous', kilde: LYNX,
    caveat_wording: 'Max. Continuous Stair Height' },
  { robot_id: 2193, field_name: 'runtime', kilde: LYNX,
    caveat_wording: '"Operating Time (no payload)" "3.5–5 hours" "Range (no payload)" "16–20 km" "Operating Time (with payload)" "2.5–3.5 hours" "Range (with payload)" "12–15 km"' },
  { robot_id: 2193, field_name: 'hot_swap', kilde: LYNX,
    caveat_wording: 'Hot-Swappable Dual Battery System' },
  { robot_id: 2193, field_name: 'docking_station', kilde: LYNX,
    caveat_wording: '"Autonomous Charging" "(Optional)"' },
  { robot_id: 2193, field_name: 'autonomy_level', kilde: LYNX,
    caveat_wording: '"SLAM Mapping & Localization" "Autonomous Navigation" "Omnidirectional Obstacle Avoidance"' },
  // lidar = kasse B, ikke skrevet.

  // -------------------------------------------------- 2194 lynx-s10 (4 A)
  { robot_id: 2194, field_name: 'weight', kilde: LYNXS10,
    caveat_wording: '"weighs ≤20 kg (including battery)" "整机含电池自重≦20kg"' },
  { robot_id: 2194, field_name: 'speed', kilde: LYNXS10,
    caveat_wording: '"flat-ground top speed" "平地极限速度"' },
  { robot_id: 2194, field_name: 'obstacle_single', kilde: LYNXS10,
    caveat_wording: 'clear obstacles up to 50 cm high' },
  { robot_id: 2194, field_name: 'autonomy_level', kilde: LYNXS10,
    caveat_wording: 'autonomous path planning and intelligent obstacle avoidance' },

  // -------------------------------------------------------- 2195 mini (7 A)
  { robot_id: 2195, field_name: 'payload_walking', kilde: MINI,
    caveat_wording: 'Max.load' },
  { robot_id: 2195, field_name: 'speed', kilde: MINI,
    caveat_wording: '"Max.speed & slope" "3.3m/s；30°"' },
  { robot_id: 2195, field_name: 'slope', kilde: MINI,
    caveat_wording: '"Max.speed & slope" "3.3m/s；30°"' },
  { robot_id: 2195, field_name: 'battery_wh', kilde: MINI,
    caveat_wording: '"电池容量" "620Wh" "Battery capacity" "10kg"' },
  { robot_id: 2195, field_name: 'runtime', kilde: MINI,
    caveat_wording: '40min（存疑待核实）' },
  { robot_id: 2195, field_name: 'compute', kilde: MINI,
    caveat_wording: '"Perception processor" "Intel Core i7" "CPU" "NIVIDIA Jetson Xavier NX"' },
  { robot_id: 2195, field_name: 'data_ports', kilde: MINI,
    caveat_wording: '"Comm interface" "WIFI / USB / BLUETOOTH"' },

  // --------------------------------------------------------- 2196 x20 (5 A)
  { robot_id: 2196, field_name: 'payload_walking', kilde: X20,
    caveat_wording: '"持续作业负载" "Endurance"' },
  { robot_id: 2196, field_name: 'speed', kilde: X20,
    caveat_wording: '"Max.Speed" "≥4M/S"' },
  { robot_id: 2196, field_name: 'slope', kilde: X20,
    caveat_wording: '"Slope" "≥30°"' },
  { robot_id: 2196, field_name: 'stair_step_continuous', kilde: X20,
    caveat_wording: 'Step/Obstacle’s H' },
  { robot_id: 2196, field_name: 'data_ports', kilde: X20,
    caveat_wording: '"外置接口" "无" "Interface" "/"' },
  // runtime = kasse B, ikke skrevet.

  // --------------------------------------------------------- 2197 x30 (6 A)
  { robot_id: 2197, field_name: 'weight', kilde: X30,
    caveat_wording: '(battery included)' },
  { robot_id: 2197, field_name: 'width', kilde: X30,
    caveat_wording: '1000*695*470(mm)' },
  { robot_id: 2197, field_name: 'height', kilde: X30,
    caveat_wording: '1000*695*470(mm)' },
  { robot_id: 2197, field_name: 'slope', kilde: X30,
    caveat_wording: '"Slope" "≤45°"' },
  { robot_id: 2197, field_name: 'stair_step_continuous', kilde: X30,
    caveat_wording: '"Step/Obstacle’s H" "台阶/障碍物高度"' },
  { robot_id: 2197, field_name: 'power_output', kilde: X30,
    caveat_wording: 'Output power supply (72V BAT)' },
  // runtime = kasse B, ikke skrevet.

  // ----------------------------------------------------- 2198 x30-pro (6 A)
  { robot_id: 2198, field_name: 'weight', kilde: X30,
    caveat_wording: '(battery included)' },
  { robot_id: 2198, field_name: 'width', kilde: X30,
    caveat_wording: '1000*715*470(mm)' },
  { robot_id: 2198, field_name: 'height', kilde: X30,
    caveat_wording: '1000*715*470(mm)' },
  { robot_id: 2198, field_name: 'slope', kilde: X30,
    caveat_wording: '"Slope" "≤45°"' },
  { robot_id: 2198, field_name: 'stair_step_continuous', kilde: X30,
    caveat_wording: 'Step/Obstacle’s H' },
  { robot_id: 2198, field_name: 'power_output', kilde: X30,
    caveat_wording: 'Output power supply (5V 12V 24V)' },
  // runtime = kasse B, ikke skrevet.
];

/* ------------------------------------------------------ kilde-verifikation */

function verificerAlt(kunRobotId) {
  let fejl = 0;
  let tjekket = 0;
  const raekker = kunRobotId ? FIELD_ENTRIES.filter((r) => r.robot_id === kunRobotId) : FIELD_ENTRIES;
  for (const r of raekker) {
    for (const frag of fragmenter(r.caveat_wording)) {
      tjekket++;
      const v = verificerFragment(frag, r.kilde);
      if (!v.ok) {
        fejl++;
        console.error(`FEJL ${r.robot_id}/${r.field_name}: "${frag}" — ${v.grund}`);
      }
    }
  }
  console.log(`Kildeverifikation: ${tjekket} fragmenter tjekket (${raekker.length} rækker), ${fejl} fejl.`);
  return fejl === 0;
}

/* --------------------------------------------------------------- main */

async function main() {
  const args = process.argv.slice(2);
  const kunVerificer = args.includes('--verificer');
  const skriv = args.includes('--skriv');
  const kunArg = args.find((a) => a.startsWith('--kun='));
  const kunRobotId = kunArg ? Number(kunArg.split('=')[1]) : null;

  console.log('--- Kildeverifikation (kildens tegn, bogstaveligt i raa-HTML) ---');
  const ok = verificerAlt(kunRobotId);
  if (!ok) {
    console.error('Kildeverifikation fejlede — INGEN skrivning forsøgt.');
    process.exitCode = 1;
    return;
  }
  if (kunVerificer) {
    console.log('--verificer: stopper her, ingen database rørt.');
    return;
  }

  laesDotEnv(path.join(ROD, '.env'));
  const U = process.env.SUPABASE_URL;
  const K = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!U || !K) {
    console.error('Kræver SUPABASE_URL og SUPABASE_SERVICE_ROLE_KEY i .env.');
    process.exitCode = 1;
    return;
  }
  const H = {
    apikey: K,
    Authorization: `Bearer ${K}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  };

  console.log(`\n--- ${skriv ? 'SKRIVER' : 'TØRLØB'} ---\n`);

  const raekker = kunRobotId ? FIELD_ENTRIES.filter((r) => r.robot_id === kunRobotId) : FIELD_ENTRIES;
  let planlagte = 0;
  let udfoerte = 0;

  for (const r of raekker) {
    planlagte++;
    const body = {
      caveat_wording: r.caveat_wording,
      collected_by: 'spor/f2deep',
      change_reason: 'fase 2: producentens kildeordlyd tilføjet i caveat_wording (kasse A)',
    };
    const url = `${U}/rest/v1/field_entries?robot_id=eq.${r.robot_id}&field_name=eq.${r.field_name}`;
    console.log(`field_entries ${r.robot_id}/${r.field_name}`);
    if (!skriv) continue;
    const svar = await fetch(url, { method: 'PATCH', headers: H, body: JSON.stringify(body) });
    const json = await svar.json();
    if (!svar.ok || !Array.isArray(json) || json.length !== 1) {
      console.error(`  AFBRUDT: ${r.robot_id}/${r.field_name} — status ${svar.status}, ${json.length ?? '?'} rækker`, json);
      process.exitCode = 1;
      return;
    }
    udfoerte++;
    console.log('  OK, 1 række opdateret.');
  }

  console.log(`\n${skriv ? 'Skrevet' : 'Ville skrive'}: ${planlagte} opdateringer${skriv ? ` (${udfoerte} bekræftet)` : ''}.`);
  if (!skriv) {
    console.log('Dette var et TØRLØB. Kør med --skriv for at skrive rent faktisk.');
  }
}

export { FIELD_ENTRIES };

const koertDirekte = process.argv[1] && import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`;
if (koertDirekte) {
  main().catch((err) => {
    console.error('f2deep-skriv: fejl —', err.message, err.stack);
    process.exitCode = 1;
    return;
  });
}
