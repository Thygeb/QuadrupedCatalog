#!/usr/bin/env node
/**
 * db/f2rest-skriv.mjs — spor/f2rest's skriveredskab (ejet af dette spor
 * alene). Udfylder field_entries.caveat_wording for de KASSE A-raekker af
 * de 40 (49 efter orkestratorens rettelse om Galileo) raekker, briefet
 * (fund/BRIEF-f2rest.md) gav dette spor: 13 producenter, engelsk forbehold
 * uden kildeordlyd.
 *
 * VIGTIGT (L93, 4. sep 2026): et TOMT caveat_wording er et GYLDIGT
 * slutresultat. Denne fil bærer KUN Kasse A — raekker hvor producentens
 * egne ord blev fundet ordret i den arkiverede kildefil, der svarer til
 * raekkens EGEN source-URL. Kasse B (dokumenteret tomt) og Kasse C
 * (uafgjort) staar IKKE her, kun i fund/FUND-f2rest.md's tabeller — de
 * roerer aldrig databasen.
 *
 * FØR nogen PATCH koeres, tjekker --verificer (og hver --toerloeb/--skriv-
 * koersel automatisk) hvert wording-fragment som en BOGSTAVELIG delstreng
 * af den relevante raa kildefil i media/_kilder/.
 *
 * Fragment-konventioner (arvet fra tidligere fase-2-spor):
 *   - "citat"-fragmenter: adskilte producent-fraser, hver i sine egne
 *     anfoerselstegn, hver tjekket enkeltvis.
 *   - "etiket | vaerdi"-form (NEURA-moenster): et rørt fragment "A | B"
 *     tjekkes ved at "A" og "B" begge findes i kilden hver for sig.
 *   - raent-tekst-fragment uden anfoerselstegn: hele strengen skal findes
 *     ordret (evt. via etiket+vaerdi-split paa foerste mellemrum, samme
 *     fallback som f2-cjk-skriv.mjs).
 *
 * Brug:
 *   node db/f2rest-skriv.mjs --verificer     Kun kildetjek, ingen netvaerk mod DB.
 *   node db/f2rest-skriv.mjs --toerloeb      Standard: viser hvad der VILLE ske.
 *   node db/f2rest-skriv.mjs --skriv         Skriver rent faktisk, én PATCH pr. raekke.
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const ROD = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const KILDE_MAPPE = path.join(ROD, 'media/_kilder');

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
// "MANIFEST" = mappen har MANIFEST.tsv der beviser filnavn<->URL.
// "INGEN MANIFEST" = mappen mangler MANIFEST.tsv (briefets punkt 4) -
// filnavn<->URL er kun sandsynligt ud fra navnet, ikke maskinbevist.

const GENISOM_M1 = 'raa-genisom-2026-08-24/genisomai-m1-2026-08-24.html'; // INGEN MANIFEST
const UNITREE_B2W = 'raa-kina-unitree-2026-08-19/unitree-b2-w-produktside-2026-08-19.html'; // MANIFEST
const UNITREE_GO1 = 'raa-kina-unitree-2026-08-19/unitree-go1-produktside-2026-08-19.html'; // MANIFEST
const MICBOTICS_P1 = 'raa-kand1b-2026-08-24/micbotics-movenew-p1-en-2026-08-24.html'; // MANIFEST
const MICBOTICS_T1 = 'raa-kand1b-2026-08-24/micbotics-movenew-t1-en-2026-08-24.html'; // MANIFEST
const RAINBOW_RBQ10 = 'raa-vest-2026-08-19/rbq10.html'; // MANIFEST
const MAB5 = 'raa-vest-2026-08-19/mab5.txt'; // MANIFEST
const YUEJIA_YJ30 = 'raa-kand4-2026-08-25/yuejialingdong-yj-56-2026-08-25.html'; // INGEN MANIFEST
const YUEJIA_YJ30W = 'raa-kand4-2026-08-25/yuejialingdong-yj-59-2026-08-25.html'; // INGEN MANIFEST
const ANYBOTICS_ANYMAL = 'raa-vest-2026-08-19/1101b7e2.html'; // MANIFEST
const GHOST_V60 = 'raa-vest-2026-08-19/v60.txt'; // MANIFEST
const RIVR_PRODUCT = 'raa-vest-2026-08-19/rivrp.txt'; // MANIFEST
const NEURA_RESERVATION = 'raa-kand6-2026-08-25/neura-quadruped-reservation-2026-08-25-text.txt'; // INGEN MANIFEST
const ADDVERB_TRAKR = 'raa-f2-pilot-2026-09-02/addverb-ai-trakr-2026-09-02-text.txt'; // MANIFEST

const kildeCache = new Map();
function laesKilde(rel) {
  if (kildeCache.has(rel)) return kildeCache.get(rel);
  const fuld = path.join(KILDE_MAPPE, rel);
  const indhold = fs.existsSync(fuld) ? fs.readFileSync(fuld, 'utf8') : null;
  kildeCache.set(rel, indhold);
  return indhold;
}

/** Splitter et wording-felt i kontrollerbare fragmenter. */
function fragmenter(wording) {
  if (wording.includes('"')) {
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
    if (harCitater) return dele.map((d) => ({ tekst: d, form: 'citat' }));
  }
  if (wording.includes(' | ')) {
    return wording.split(' | ').map((d) => ({ tekst: d.trim(), form: 'pipe-del' })).filter((d) => d.tekst);
  }
  return [{ tekst: wording, form: 'raa' }];
}

function verificerFragment(frag, kildeRel) {
  const indhold = laesKilde(kildeRel);
  if (indhold === null) return { ok: false, grund: `kildefil mangler: ${kildeRel}` };
  const { tekst, form } = frag;
  if (indhold.includes(tekst)) return { ok: true };
  if (form === 'raa') {
    const i = tekst.indexOf(' ');
    if (i > 0) {
      const etiket = tekst.slice(0, i);
      const vaerdi = tekst.slice(i + 1);
      if (indhold.includes(etiket) && indhold.includes(vaerdi)) return { ok: true, split: true };
    }
  }
  return { ok: false, grund: `IKKE fundet ordret i ${kildeRel}` };
}

/* ------------------------------------------------------------------ data */
// KUN Kasse A. 19 raekker, 11 producenter (Yuejia+MicroRoboTech+GENISOM
// har flere; RIVR/NEURA/Addverb/Rainbow/MAB har 1 hver af deres respektive
// producent-total, resten af deres raekker er Kasse B og staar ikke her).

const FIELD_ENTRIES = [
  // ---------------------------------------------------------- GENISOM AI (2/11)
  { robot_id: 2212, field_name: 'temperature_max', kilde: GENISOM_M1,
    caveat_wording: '"-20℃ ~ 55℃ 工作温度，可选配 -40℃ ~ 80℃ 宽温电池版本"' },
  { robot_id: 2213, field_name: 'temperature_max', kilde: GENISOM_M1,
    caveat_wording: '"-20℃ ~ 55℃ 工作温度，可选配 -40℃ ~ 80℃ 宽温电池版本"' },

  // ---------------------------------------------------------- Unitree Robotics (4/7)
  { robot_id: 2239, field_name: 'runtime', kilde: UNITREE_B2W,
    // NB: kilden bruger et NBSP (U+00A0) mellem "mileage" og "≈30km" - splittet i to
    // fragmenter (i stedet for et tredje forsoeg paa at ramme det usynlige tegn).

    caveat_wording: "\"25km with 40kg load [2]\" \"Maximum endurance without load and the mileage\" \"≈30km\"" },
  { robot_id: 2240, field_name: 'height', kilde: UNITREE_GO1,
    caveat_wording: '"0.588 x 0.22 x 0.29" "m"' },
  { robot_id: 2240, field_name: 'battery_wh', kilde: UNITREE_GO1,
    caveat_wording: '"Battery" "1 piece"' },
  { robot_id: 2240, field_name: 'runtime', kilde: UNITREE_GO1,
    caveat_wording: '"Long" "Endurance"' },

  // ---------------------------------------------------------- MicroRoboTech (4/4)
  { robot_id: 2223, field_name: 'width', kilde: MICBOTICS_P1,
    caveat_wording: '"Standing Dimensions" "900mm × 600mm × 650mm"' },
  { robot_id: 2223, field_name: 'height', kilde: MICBOTICS_P1,
    caveat_wording: '"Standing Dimensions" "900mm × 600mm × 650mm"' },
  { robot_id: 2224, field_name: 'width', kilde: MICBOTICS_T1,
    caveat_wording: '"Standing Dimensions" "800mm × 600mm × 540mm"' },
  { robot_id: 2224, field_name: 'height', kilde: MICBOTICS_T1,
    caveat_wording: '"Standing Dimensions" "800mm × 600mm × 540mm"' },

  // ---------------------------------------------------------- Rainbow Robotics (1/3)
  { robot_id: 2228, field_name: 'power_output', kilde: RAINBOW_RBQ10,
    caveat_wording: '"External Interfaces" "54 V, 12 V, CAN (1 ch), Gigabit LAN ×3"' },

  // ---------------------------------------------------------- MAB Robotics (1/3)
  { robot_id: 2218, field_name: 'temperature_min', kilde: MAB5,
    caveat_wording: '"Operating temperature" "0-45°C"' },

  // ---------------------------------------------------------- Yuejia Lingdong (2/2)
  { robot_id: 2254, field_name: 'height', kilde: YUEJIA_YJ30,
    caveat_wording: '682×354×462m' },
  { robot_id: 2257, field_name: 'autonomy_level', kilde: YUEJIA_YJ30W,
    caveat_wording: '"WIFI" "4G/5G" "图传" "语音识别" "跟随" "导航" "灵活通信与扩展 ：" "兼容WiF6、蓝牙5.2等无线通信方式，支持4G模块选配，适配多种工业级通信协议，预留二次开发接口，满足不同场景的功能扩展需求" "智能化数据分析 ：" "支持实时全屏测温、自定义区域(点/线/面)温度监测，结合温度突升趋势分析与AI人形周界识别，实现"隐患识别-数据反馈-报警联动"闭环"' },

  // ---------------------------------------------------------- ANYbotics (1/2)
  { robot_id: 2184, field_name: 'compute', kilde: ANYBOTICS_ANYMAL,
    caveat_wording: '"2× Intel i7 Core" "8th gen. Intel 6-core processors"' },

  // ---------------------------------------------------------- Ghost Robotics (1/2)
  { robot_id: 2215, field_name: 'autonomy_level', kilde: GHOST_V60,
    caveat_wording: '"Autonomy Modes" "Perception Aided Mobility" "Record-Playback" "Mission Control"' },

  // ---------------------------------------------------------- RIVR (1/1)
  { robot_id: 2230, field_name: 'runtime', kilde: RIVR_PRODUCT,
    caveat_wording: 'over 30 km of range' },

  // ---------------------------------------------------------- NEURA Robotics (1/1)
  { robot_id: 2225, field_name: 'sdk_languages', kilde: NEURA_RESERVATION,
    caveat_wording: 'Interfaces | Wi-Fi 6, Gigabit Ethernet, ROS 2, C++, Python SDK, NEURA Sync' },

  // ---------------------------------------------------------- Addverb (1/1)
  { robot_id: 2183, field_name: 'autonomy_level', kilde: ADDVERB_TRAKR,
    caveat_wording: '"Fully Autonomous Missions" "Dynamic Locomotion" "INTELLIGENT DETECTION & AVOIDANCE" "OPTIONAL FEATURES & MODULES"' },
];

/* ------------------------------------------------------ kilde-verifikation */

function verificerAlt() {
  let fejl = 0;
  let tjekket = 0;
  for (const r of FIELD_ENTRIES) {
    for (const frag of fragmenter(r.caveat_wording)) {
      tjekket++;
      const v = verificerFragment(frag, r.kilde);
      if (!v.ok) {
        fejl++;
        console.error(`FEJL ${r.robot_id}/${r.field_name}: "${frag.tekst}" — ${v.grund}`);
      }
    }
  }
  console.log(`Kildeverifikation: ${tjekket} fragmenter tjekket i ${FIELD_ENTRIES.length} raekker, ${fejl} fejl.`);
  return fejl === 0;
}

/* --------------------------------------------------------------- main */

async function main() {
  const args = process.argv.slice(2);
  const kunVerificer = args.includes('--verificer');
  const skriv = args.includes('--skriv');

  console.log('--- Kildeverifikation (Kasse A: bogstavelig delstreng af raekkens EGEN kilde) ---');
  const ok = verificerAlt();
  if (!ok) {
    console.error('Kildeverifikation fejlede — INGEN skrivning forsøgt (kriterium 2: fejler én, skrives INGEN).');
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
    planlagte++;
    const body = {
      caveat_wording: r.caveat_wording,
      collected_by: 'spor/f2rest',
      change_reason: 'fase 2: engelsk forbehold uden kildeordlyd - producentens egen ordlyd udfyldt i caveat_wording (kasse A)',
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
    console.error('f2rest-skriv: fejl —', err.message, err.stack);
    process.exitCode = 1;
    return;
  });
}
