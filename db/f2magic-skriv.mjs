#!/usr/bin/env node
/**
 * db/f2magic-skriv.mjs — spor/f2magic's skriveredskab (ejet af dette spor
 * alene). Udfylder field_entries.caveat_wording for MagicLab (robot_id
 * 2219 magicdog-edu, 2220 magicdog-pro, 2221 magicdog-w, 2222 magicdog-y1)
 * — KUN for rækker hvor producentens egen ordlyd rent faktisk findes i den
 * arkiverede kildefil, der svarer til rækkens EGEN `field_entries.source`.
 *
 * JPK besluttede 4. sep 2026: et TOMT caveat_wording er et gyldigt
 * slutresultat. Denne fil skriver derfor KUN Kasse A-rækker (se
 * fund/FUND-f2magic.md for A/B/C-fordelingen). Kasse B/C-rækker røres
 * IKKE — de bliver stående som de er, og er dokumenteret i rapporten med
 * den søgning, der viser 0 træffere.
 *
 * Hver ordlyd er skrevet som en eller flere "..."-citerede fragmenter.
 * --verificer tjekker HVERT fragment som en BOGSTAVELIG, sammenhængende
 * delstreng af den relevante rå kildefil — ingen fuzzy split, ingen
 * sammenkædning på tværs af HTML-celler. To fragmenter (W's CN-etiket for
 * obstacle_single, og W's CN compute-etiketter) bærer kinesiske tegn, der
 * er hentet PROGRAMMATISK fra selve den arkiverede CN-fil (aldrig
 * håndskrevet) — se udtraekLabelForVaerdi() nedenfor.
 *
 * Brug:
 *   node db/f2magic-skriv.mjs --verificer     Kun kildetjek, ingen netværk mod DB.
 *   node db/f2magic-skriv.mjs --toerloeb      Standard: viser hvad der VILLE ske.
 *   node db/f2magic-skriv.mjs --skriv         Skriver rent faktisk, én PATCH pr. post.
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

const SPEC_DOG_EN = 'magiclab-magicdog-specside-en-2026-08-19.html';        // edu+pro, EN
const GUIDE_DOG_CN = 'magiclab-magicdog-udviklerguide-cn-2026-08-19.html';  // edu+pro, support.magiclab.top
const SPEC_W_EN = 'magiclab-magicdog-w-specside-en-2026-08-19.html';
const SPEC_W_CN = 'magiclab-magicdog-w-specside-cn-2026-08-19.html';
const GUIDE_W_CN = 'magiclab-magicdog-w-udviklerguide-cn-2026-08-19.html';
const SPEC_Y1_EN = 'magiclab-magicdog-y1-specside-en-2026-08-19.html';
const GUIDE_Y1_CN = 'magiclab-magicdog-y1-udviklerguide-cn-2026-08-19.html';

const kildeCache = new Map();
function laesKilde(rel) {
  if (kildeCache.has(rel)) return kildeCache.get(rel);
  const fuld = path.join(KILDE_MAPPE, rel);
  const indhold = fs.existsSync(fuld) ? fs.readFileSync(fuld, 'utf8') : null;
  kildeCache.set(rel, indhold);
  return indhold;
}

/** Parser en HTML-tabel til rækker af celletekst (<tr>...<td>...</td>...</tr>). */
function taelRaekker(html) {
  const rowRe = /<tr[^>]*>(.*?)<\/tr>/gs;
  let m; const out = [];
  while ((m = rowRe.exec(html))) {
    const row = m[1];
    const cellRe = /<td[^>]*>(.*?)<\/td>/gs;
    let c; const cells = [];
    while ((c = cellRe.exec(row))) {
      let v = c[1].replace(/<!--\[?-?-?>?/g, '').replace(/<!--\]?-?-?>?/g, '').trim();
      cells.push(v);
    }
    if (cells.length) out.push(cells);
  }
  return out;
}

/** Finder rækkens FØRSTE celle (etiketten) for den række, hvis en af de
 *  ØVRIGE celler indeholder `vaerdiAnker` ordret. Bruges til at hente en
 *  kinesisk etiket PROGRAMMATISK fra kildefilen — aldrig håndskrevet. */
function udtraekLabelForVaerdi(html, vaerdiAnker) {
  const raekker = taelRaekker(html);
  for (const celler of raekker) {
    const vi = celler.findIndex((c, i) => i > 0 && c.includes(vaerdiAnker));
    // Etiketten er cellen LIGE FØR værdicellen — ikke nødvendigvis celler[0]:
    // en rækkes første celle er en kategori-overskrift (fx "电气参数"), når
    // rækken er den FØRSTE i en ny sektion (3 celler i alt i stedet for 2).
    if (vi > 0) return { label: celler[vi - 1], vaerdi: celler[vi] };
  }
  return null;
}

// W's CN specside: hent "最st obstacle-avoidance"-etiketten og det fulde
// "157 TOPS"-par, PROGRAMMATISK, fra selve den arkiverede fil.
const W_CN_HTML = laesKilde(SPEC_W_CN);
if (!W_CN_HTML) throw new Error(`Kildefil mangler: ${SPEC_W_CN}`);
const W_CN_OBSTACLE = udtraekLabelForVaerdi(W_CN_HTML, '60 cm');
const W_CN_COMPUTE_157 = udtraekLabelForVaerdi(W_CN_HTML, '157 TOPS');
const W_CN_COMPUTE_6TOPS = udtraekLabelForVaerdi(W_CN_HTML, '6TOPS');
if (!W_CN_OBSTACLE || !W_CN_COMPUTE_157 || !W_CN_COMPUTE_6TOPS) {
  throw new Error('Programmatisk udtræk af W-CN-etiketter fejlede — se udtraekLabelForVaerdi().');
}

// Cirklerne — udtrukket som Unicode-kodepunkter, ALDRIG som indtastet tegn.
const CIRKEL_FYLDT = String.fromCodePoint(0x25cf); // ●
const CIRKEL_AABEN = String.fromCodePoint(0x25cb); // ○

/** Splitter et wording-felt i sine "..."-citerede fragmenter. Al tekst
 *  SKAL ligge i citater her — ingen fri tekst udenfor, og ingen fuzzy
 *  split-fallback (i modsætning til f2-cjk-skriv.mjs): hvert fragment
 *  skal være en bogstavelig, sammenhængende delstreng af kildefilen. */
function fragmenter(wording) {
  const dele = [];
  const re = /"([^"]*)"/g;
  let m;
  while ((m = re.exec(wording))) dele.push(m[1]);
  return dele;
}

function verificerFragment(fragment, kildeRel) {
  const indhold = laesKilde(kildeRel);
  if (indhold === null) return { ok: false, grund: `kildefil mangler: ${kildeRel}` };
  if (indhold.includes(fragment)) return { ok: true };
  return { ok: false, grund: `IKKE fundet ordret (bogstavelig delstreng) i ${kildeRel}` };
}

/* ------------------------------------------------------------------ data */
// Kun KASSE A-rækker star her (51 af 53). Kasse B (2) og C (0) er IKKE
// med — de skrives ikke, og er dokumenteret i fund/FUND-f2magic.md.

const FIELD_ENTRIES = [
  // ---------------------------------------------------- 2219 magicdog-edu (13)
  { robot_id: 2219, field_name: 'weight', kilde: SPEC_DOG_EN,
    caveat_wording: '"Net Weight (Excluding Battery)" "15.8kg"' },
  { robot_id: 2219, field_name: 'height', kilde: SPEC_DOG_EN,
    caveat_wording: '"Dimensions (Lying Down: L x W x H)" "720*440*290mm"' },
  { robot_id: 2219, field_name: 'degrees_of_freedom', kilde: SPEC_DOG_EN,
    caveat_wording: '"Degrees of Freedom (DOF)" "13" "Aluminum Alloy Precision Joint Motor" "12"' },
  { robot_id: 2219, field_name: 'payload_walking', kilde: SPEC_DOG_EN,
    caveat_wording: '"Payload" "≈5kg （Max. ≈10kg）"' },
  { robot_id: 2219, field_name: 'speed', kilde: SPEC_DOG_EN,
    caveat_wording: '"Maximum Speed" "3.0m/s"' },
  { robot_id: 2219, field_name: 'obstacle_single', kilde: SPEC_DOG_EN,
    caveat_wording: '"Maximum Obstacle Height" "15cm"' },
  { robot_id: 2219, field_name: 'battery_wh', kilde: SPEC_DOG_EN,
    caveat_wording: '"Battery" "29.6V 8200mAh 240.7W Fast Release"' },
  { robot_id: 2219, field_name: 'runtime', kilde: SPEC_DOG_EN,
    caveat_wording: '"Battery Life" "1.5-3.0h"' },
  { robot_id: 2219, field_name: 'docking_station', kilde: SPEC_DOG_EN,
    caveat_wording: `"Battery Charging Dock" "${CIRKEL_FYLDT}"` },
  { robot_id: 2219, field_name: 'lidar', kilde: SPEC_DOG_EN,
    caveat_wording: '"Sensors" "2D LiDAR"' },
  { robot_id: 2219, field_name: 'ros2', kilde: GUIDE_DOG_CN,
    caveat_wording: '"ROS2 API"' },
  { robot_id: 2219, field_name: 'sdk_languages', kilde: SPEC_DOG_EN,
    caveat_wording: `"SDK Support[2]" "${CIRKEL_FYLDT}"` },
  { robot_id: 2219, field_name: 'autonomy_level', kilde: SPEC_DOG_EN,
    caveat_wording: '"Smart Obstacle Avoidance" "Patrol Mode" "Smart Following"' },

  // ---------------------------------------------------- 2220 magicdog-pro (13)
  { robot_id: 2220, field_name: 'weight', kilde: SPEC_DOG_EN,
    caveat_wording: '"Net Weight (Excluding Battery)" "15.8kg"' },
  { robot_id: 2220, field_name: 'height', kilde: SPEC_DOG_EN,
    caveat_wording: '"Dimensions (Lying Down: L x W x H)" "720*440*290mm"' },
  { robot_id: 2220, field_name: 'degrees_of_freedom', kilde: SPEC_DOG_EN,
    caveat_wording: '"Degrees of Freedom (DOF)" "13" "Aluminum Alloy Precision Joint Motor" "12"' },
  { robot_id: 2220, field_name: 'payload_walking', kilde: SPEC_DOG_EN,
    caveat_wording: '"Payload" "≈5kg （Max. ≈10kg）"' },
  { robot_id: 2220, field_name: 'speed', kilde: SPEC_DOG_EN,
    caveat_wording: '"Maximum Speed" "3.0m/s"' },
  { robot_id: 2220, field_name: 'obstacle_single', kilde: SPEC_DOG_EN,
    caveat_wording: '"Maximum Obstacle Height" "15cm"' },
  { robot_id: 2220, field_name: 'battery_wh', kilde: SPEC_DOG_EN,
    caveat_wording: '"Battery" "29.6V 8200mAh 240.7W Fast Release"' },
  { robot_id: 2220, field_name: 'runtime', kilde: SPEC_DOG_EN,
    caveat_wording: '"Battery Life" "1.5-3.0h"' },
  { robot_id: 2220, field_name: 'docking_station', kilde: SPEC_DOG_EN,
    caveat_wording: `"Battery Charging Dock" "${CIRKEL_FYLDT}"` },
  { robot_id: 2220, field_name: 'lidar', kilde: SPEC_DOG_EN,
    caveat_wording: '"Sensors" "2D LiDAR"' },
  { robot_id: 2220, field_name: 'ros2', kilde: GUIDE_DOG_CN,
    caveat_wording: '"ROS2 API"' },
  { robot_id: 2220, field_name: 'sdk_languages', kilde: SPEC_DOG_EN,
    caveat_wording: `"SDK Support[2]" "${CIRKEL_AABEN}"` },
  { robot_id: 2220, field_name: 'autonomy_level', kilde: SPEC_DOG_EN,
    caveat_wording: '"Smart Obstacle Avoidance" "Patrol Mode" "Smart Following"' },

  // ---------------------------------------------------- 2221 magicdog-w (12 af 13 — stair_step_continuous er Kasse B)
  { robot_id: 2221, field_name: 'weight', kilde: SPEC_W_EN,
    caveat_wording: '"Total Weight" "22.5 kg (with battery)"' },
  { robot_id: 2221, field_name: 'height', kilde: SPEC_W_EN,
    caveat_wording: '"Prone Dimensions" "720*500*290mm"' },
  { robot_id: 2221, field_name: 'degrees_of_freedom', kilde: SPEC_W_EN,
    caveat_wording: '"Motor Number" "16+1 (Head Motor)" "Head Rotation Angle" "≥ 100°"' },
  { robot_id: 2221, field_name: 'payload_walking', kilde: SPEC_W_EN,
    caveat_wording: '"Payload" "Maximum 10 kg"' },
  { robot_id: 2221, field_name: 'speed', kilde: SPEC_W_EN,
    caveat_wording: '"Motion Speed" "0-3 m/s"' },
  { robot_id: 2221, field_name: 'slope', kilde: SPEC_W_EN,
    caveat_wording: '"Maximum slope angle" "≤ 40°"' },
  // obstacle_single: TO kilder med vilje (BRIEF punkt 3) — EN-etiketten fra
  // rækkens EGEN source (SPEC_W_EN) OG den kinesiske etiket som krydskontrol,
  // udtrukket PROGRAMMATISK fra SPEC_W_CN (ikke håndskrevet).
  { robot_id: 2221, field_name: 'obstacle_single', kilde: SPEC_W_EN,
    kildeEkstra: SPEC_W_CN,
    caveat_wording: `"Minimum obstacle clearance height" "＜ 60 cm" "${W_CN_OBSTACLE.label}" "${W_CN_OBSTACLE.vaerdi}"` },
  { robot_id: 2221, field_name: 'battery_wh', kilde: SPEC_W_EN,
    caveat_wording: '"Battery" "Capacity: 8200 mAh, Rated Voltage: 29.6 V"' },
  { robot_id: 2221, field_name: 'runtime', kilde: SPEC_W_EN,
    caveat_wording: '"Battery Life" "2-4 h" "Standby Time" "Up to 8 hours (tested)"' },
  { robot_id: 2221, field_name: 'lidar', kilde: SPEC_W_EN,
    caveat_wording: '"Sensors" "2D LiDAR"' },
  // compute: kilden ER CN-siden (magiclab.top/dog-w, ingen /en/) — begge
  // etiketter udtrukket PROGRAMMATISK fra SPEC_W_CN.
  { robot_id: 2221, field_name: 'compute', kilde: SPEC_W_CN,
    caveat_wording: `"${W_CN_COMPUTE_6TOPS.label}" "${W_CN_COMPUTE_6TOPS.vaerdi}" "${W_CN_COMPUTE_157.label}" "${W_CN_COMPUTE_157.vaerdi}"` },
  { robot_id: 2221, field_name: 'ros2', kilde: GUIDE_W_CN,
    caveat_wording: '"ROS2 API"' },

  // ---------------------------------------------------- 2222 magicdog-y1 (13 af 14 — ros2 er Kasse B)
  { robot_id: 2222, field_name: 'weight', kilde: SPEC_Y1_EN,
    caveat_wording: '"Total Weight (with Battery)" "70Kg (with Battery)"' },
  { robot_id: 2222, field_name: 'payload_walking', kilde: SPEC_Y1_EN,
    caveat_wording: '"Dynamic Payload" "45kg"' },
  { robot_id: 2222, field_name: 'payload_standing', kilde: SPEC_Y1_EN,
    caveat_wording: '"Maximum Payload" "150kg"' },
  { robot_id: 2222, field_name: 'speed', kilde: SPEC_Y1_EN,
    caveat_wording: '"Maximum Speed" "6m/s"' },
  { robot_id: 2222, field_name: 'obstacle_single', kilde: SPEC_Y1_EN,
    caveat_wording: '"Maximum Climbing Height" "≥60cm"' },
  { robot_id: 2222, field_name: 'temperature_min', kilde: SPEC_Y1_EN,
    caveat_wording: '"stable operation from -20℃ to 55℃"' },
  { robot_id: 2222, field_name: 'temperature_max', kilde: SPEC_Y1_EN,
    caveat_wording: '"stable operation from -20℃ to 55℃"' },
  { robot_id: 2222, field_name: 'battery_wh', kilde: SPEC_Y1_EN,
    caveat_wording: '"Battery Capacity" "45Ah (2400Wh), Voltage 54V"' },
  { robot_id: 2222, field_name: 'runtime', kilde: SPEC_Y1_EN,
    caveat_wording: '"Operating Time" "4–6h ( &gt;4 h continuous walking with 20 kg load )"' },
  { robot_id: 2222, field_name: 'lidar', kilde: SPEC_Y1_EN,
    caveat_wording: '"Perception Sensors" "3D LiDAR ×1"' },
  { robot_id: 2222, field_name: 'cameras', kilde: SPEC_Y1_EN,
    caveat_wording: '"Perception Sensors" "Depth Cameras ×2 + Optical Cameras ×2 (configurations may vary)"' },
  { robot_id: 2222, field_name: 'sdk_languages', kilde: GUIDE_Y1_CN,
    caveat_wording: '"C++ API" "Python API"' },
  { robot_id: 2222, field_name: 'power_output', kilde: SPEC_Y1_EN,
    caveat_wording: '"User Expansion Interfaces" "(24V+485 output)*4 power supply + power bus, USB3.0*4, (12V output+EthNet)*3 power supply + network; EthCat x 1"' },
];

/* ------------------------------------------------------ kilde-verifikation */

function verificerAlt() {
  let fejl = 0;
  let tjekket = 0;
  for (const r of FIELD_ENTRIES) {
    for (const frag of fragmenter(r.caveat_wording)) {
      tjekket++;
      const v1 = verificerFragment(frag, r.kilde);
      // kildeEkstra (kun obstacle_single/2221, se BRIEF punkt 3): et
      // fragment er OK hvis det findes i ENTEN rækkens egen kilde ELLER
      // den udtrykkeligt tilladte krydskontrolfil — aldrig i en tredje.
      const v2 = !v1.ok && r.kildeEkstra ? verificerFragment(frag, r.kildeEkstra) : null;
      if (!v1.ok && !(v2 && v2.ok)) {
        fejl++;
        console.error(`FEJL ${r.robot_id}/${r.field_name}: "${frag}" — ${v1.grund}${v2 ? ` / ${v2.grund}` : ''}`);
      }
    }
  }
  console.log(`Kildeverifikation: ${tjekket} fragmenter tjekket, ${fejl} fejl, ${FIELD_ENTRIES.length} raekker.`);
  return fejl === 0;
}

/* --------------------------------------------------------------- main */

async function main() {
  const args = process.argv.slice(2);
  const kunVerificer = args.includes('--verificer');
  const skriv = args.includes('--skriv');
  const kunArg = args.find((a) => a.startsWith('--kun='));
  const kunRobotId = kunArg ? Number(kunArg.slice('--kun='.length)) : null;

  console.log('--- Kildeverifikation (kildens tegn, bogstaveligt i raa-HTML) ---');
  const ok = verificerAlt();
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

  let planlagte = 0;
  let udfoerte = 0;

  for (const r of FIELD_ENTRIES) {
    if (kunRobotId !== null && r.robot_id !== kunRobotId) continue;
    planlagte++;
    const body = {
      caveat_wording: r.caveat_wording,
      collected_by: 'spor/f2magic',
      change_reason: 'fase 2: producentens ordrette kildeordlyd tilfojet i caveat_wording (kasse A)',
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
    console.error('f2magic-skriv: fejl —', err.message, err.stack);
    process.exitCode = 1;
    return;
  });
}
