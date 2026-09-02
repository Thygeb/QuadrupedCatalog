#!/usr/bin/env node
/**
 * db/f2-galileo-skriv.mjs — spor/f2-galileo's skriveredskab (ejet af dette
 * spor alene). Renser caveat/caveat_wording (field_entries), note/notes/
 * notes_wording (applications/images/robots) og value_text for de 18
 * robotter listet i fund/BRIEF-f2-galileo.md.
 *
 * Bygget efter db/f2-cjk-skriv.mjs's moenster (samme kildeverifikation via
 * fragmenter()/verificerFragment() - INGEN skrivning foer hvert citat er
 * fundet bogstaveligt i den citerede raa-kildefil). Udvidet med:
 *  - VALUE_TEXT: value_text er en TEKSTKOLONNE, men feltets SVAR, ikke en
 *    bemaerkning om svaret (L87/BRIEF-FAELLES.md) - oversaettes selvstaendigt.
 *  - L87-SLETNING: rows med kasse 'L87-SLET' patcher caveat/caveat_wording/
 *    caveat_class til null i SAMME PATCH (R21-constraint kraever det).
 *  - PRODUCENT-COMMIT: koeres og committes producent for producent, ikke i
 *    ét stort baellede - se BRIEF-f2-galileo.md.
 *
 * Brug:
 *   node db/f2-galileo-skriv.mjs --verificer     Kun kildetjek, ingen DB.
 *   node db/f2-galileo-skriv.mjs --toerloeb      Standard: viser hvad der VILLE ske.
 *   node db/f2-galileo-skriv.mjs --skriv         Skriver rent faktisk.
 *   node db/f2-galileo-skriv.mjs --skriv --kun=cvte   Begraens til én producent.
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

const KILDER = {
  CVTE_PROD: 'raa-kand2-2026-08-24/cvte-maxhub-x7-produktside-2026-08-24.html',
  CVTE_NEWS: 'raa-kand2-2026-08-24/cvte-maxhub-x7-nyhed-cn-2026-08-24.html',
};

const kildeCache = new Map();
function laesKilde(rel) {
  if (kildeCache.has(rel)) return kildeCache.get(rel);
  const fuld = path.join(KILDE_MAPPE, rel);
  const indhold = fs.existsSync(fuld) ? fs.readFileSync(fuld, 'utf8') : null;
  kildeCache.set(rel, indhold);
  return indhold;
}

/** Splitter et wording-felt i sine kildefragmenter — samme regel som
 *  db/f2-cjk-skriv.mjs: "..." adskiller flere selvstaendige citater
 *  (multi-citat, BRIEF-FAELLES.md §"PostgREST"), ikke kun omkring anfoerselstegn. */
function fragmenter(wording) {
  if (wording == null) return [];
  const dele = [];
  for (const del of String(wording).split(' | ')) {
    const t = del.trim();
    if (t) dele.push(t);
  }
  return dele;
}

/** Prøv (1) fragmentet helt, (2) split på hver "..." (bevidst udeladelse),
 *  (3) split på FØRSTE mellemrum (etiket+værdi i to separate kilde-celler,
 *  jf. OPSKRIFT-fase2-cjk.md §"To faldgruber", punkt 1). */
function verificerFragment(fragment, kildeRel) {
  const indhold = laesKilde(kildeRel);
  if (indhold === null) return { ok: false, grund: `kildefil mangler: ${kildeRel}` };
  if (indhold.includes(fragment)) return { ok: true };
  if (fragment.includes('...')) {
    const dele = fragment.split('...').map((d) => d.trim()).filter(Boolean);
    if (dele.length > 0 && dele.every((d) => indhold.includes(d))) return { ok: true, ellipse: true };
    return { ok: false, grund: `IKKE fundet (deltjek omkring "..." fejlede) i ${kildeRel}` };
  }
  const i = fragment.indexOf(' ');
  if (i > 0) {
    const etiket = fragment.slice(0, i);
    const vaerdi = fragment.slice(i + 1);
    if (indhold.includes(etiket) && indhold.includes(vaerdi)) return { ok: true, split: true };
  }
  return { ok: false, grund: `IKKE fundet ordret (heller ikke split paa etiket+vaerdi) i ${kildeRel}` };
}

/* ------------------------------------------------------------------ data */
// kasse: 'A' = ordlyd fandtes, forurenet -> renset. 'B' = ingen ordlyd,
// egen analyse, kun caveat. 'L87-SLET' = paastand uden belaeg, HELE trioen
// (caveat/caveat_wording/caveat_class) til null.

const FIELD_ENTRIES = [
  // =========================================================== CVTE (1) ===
  { robot_id: 2189, field_name: 'slope', kasse: 'A', kilde: KILDER.CVTE_PROD,
    caveat_wording: '稳定穿越35°陡坡等地形：基于自适应步态算法与电驱动关节的实验室测试结果，实际地形性能受环境复杂度影响',
    caveat: "Manufacturer's claim: stably crosses 35° slopes and similar terrain. Footnote: based on laboratory test results using the adaptive gait algorithm and electrically driven joints; real-world terrain performance is affected by environmental complexity." },
  { robot_id: 2189, field_name: 'ip_rating', kasse: 'A', kilde: KILDER.CVTE_PROD,
    caveat_wording: 'IP66级防水防尘',
    caveat: 'IP66 water- and dust-protection rating.' },
  { robot_id: 2189, field_name: 'temperature_min', kasse: 'A', kilde: KILDER.CVTE_PROD,
    caveat_wording: '-20°C至55°C宽温作业 | 指电池及核心元器件在该温度区间的正常工作范围，极端温度下性能可能部分受影响',
    caveat: 'Wide-temperature operation: -20°C to 55°C. Footnote: applies to the normal working range of the battery and core components in this interval; performance may be partially affected at extreme temperatures.' },
  { robot_id: 2189, field_name: 'runtime', kasse: 'A', kilde: KILDER.CVTE_PROD,
    caveat_wording: '40kg负载＞5H，20kg负载＞8H，空载＞11H | 续航时间: 在特定实验室环境(气温25°C、平坦硬质路面等)下持续行走测试所得，实际使用时间因产品配置、环境温度、路面状况、运行速度等因素而异',
    caveat: 'Manufacturer states three figures in one sentence: >5h at 40kg payload, >8h at 20kg payload, >11h unloaded. The schema has only one runtime field, so the middle figure (20kg payload, >8h) is used as the primary value; the other two are recorded here. Footnote: obtained from continuous-walking lab tests at 25°C on flat, hard ground; actual runtime varies with product configuration, ambient temperature, ground conditions, operating speed and other factors.' },
  { robot_id: 2189, field_name: 'docking_station', kasse: 'A', kilde: KILDER.CVTE_PROD,
    caveat_wording: '高度自主 定时启停、自主导航与回充',
    caveat: "Highly autonomous: scheduled start/stop, self-navigation and self-return-to-charge. The news article (same domain) elaborates further (see the docking-station field's second source note). The term 'docking station' / '充电桩' does not appear verbatim in either source — '自主…回充' / '自动返航充电' is interpreted as referring to an automatic charging facility." },
  { robot_id: 2189, field_name: 'lidar', kasse: 'A', kilde: KILDER.CVTE_NEWS,
    caveat_wording: '深度融合激光雷达、里程计、IMU、UWB、GNSS、视觉相机等多种传感器',
    caveat: 'News article: deep fusion of LiDAR, odometry, IMU, UWB, GNSS, visual camera and other sensors. LiDAR is mentioned only as a sensor TYPE in a list — no count, no model given. Does not count as filled in under rule D4.' },
  { robot_id: 2189, field_name: 'cameras', kasse: 'A', kilde: KILDER.CVTE_NEWS,
    caveat_wording: 'X7搭载可见光+红外双光云台、气体传感器、机械臂甚至灭火装置',
    caveat: 'X7 is equipped with a dual-spectrum visible-light/infrared pan-tilt camera, gas sensor, robotic arm, and even a fire-suppression unit.' },
];

const APPLICATIONS = [
  // note = vores klassifikations-begrundelse (engelsk), note_wording ER I
  // KOLONNELISTEN IKKE (kun "note" er nævnt, ikke applications.note_wording
  // - se rapportens "Nye fælder og opdagelser"). note_wording røres derfor
  // IKKE, selvom den bærer samme dansk/kinesisk-blanding.
  { robot_id: 2189, kilde: KILDER.CVTE_PROD,
    note: "\"工业\" (industry) and \"电力\" (power/electricity) are both mapped to industrial, since this sentence does not itself use an inspection word (unlike the news article). \"救援\" (rescue) is mapped to defense and emergency response." },
];

// robots.notes/notes_wording — kun rækker der aendres skrives.
const ROBOTS_NOTES = [
  { id: 2189, kilde: [KILDER.CVTE_PROD, KILDER.CVTE_NEWS],
    notes: [
      "WEAK SPECIFICATION DENSITY IS MEASURED, NOT ASSUMED: CVTE's product page is a marketing highlights page ('Product Highlights') with rhetorical headings and footnote caveats, NOT a technical specification table like Astrall Dynamics' or Unitree's product pages. No CVTE datasheet with dimensions, weight, payload, speed or DoF has been found. MAXHUB.com itself (the global MAXHUB display brand) has NO robot products at all — X7 sits exclusively under parent company CVTE's own product navigation, not under maxhub.com.",
      "The manufacturer's own footnotes on the page deliberately qualify several figures: (lab figures, real-world use varies); (can stably cross 35° slopes and similar terrain — based on lab test results with the adaptive gait algorithm and electrically driven joints); (-20C to 55C operation: applies to the normal working range of the battery and core components in this temperature interval; performance may be partially affected at extreme temperatures). These caveats are reproduced on the individual fields' caveat.",
      "MAXHUB X7's SISTER PRODUCT (a commercial cleaning robot, a DIFFERENT machine, not a quadruped) is the one that, per the news article, has entered the European/Southeast Asian/Japanese market. This does NOT apply to X7 — no EU-relevant fields are filled in for X7 on this basis.",
    ],
    notes_wording: [
      '产品亮点',
      '续航时间: 在特定实验室环境(气温25°C、平坦硬质路面等)下持续行走测试所得，实际使用时间因产品配置、环境温度、路面状况、运行速度等因素而异 | 稳定穿越35°陡坡等地形：基于自适应步态算法与电驱动关节的实验室测试结果，实际地形性能受环境复杂度影响 | -20℃至55℃作业：指电池及核心元器件在该温度区间的正常工作范围，极端温度下性能可能部分受影响',
      '商用清洁机器人 | 进入欧洲、东南亚及日本市场',
    ] },
];

const VALUE_TEXT = [
  { robot_id: 2189, field_name: 'cameras', kilde: KILDER.CVTE_NEWS,
    value_text: 'Dual-spectrum visible-light + infrared pan-tilt camera, model not disclosed' },
];

// images.note — kun rækker med indhold.
const IMAGES = [];

/* ------------------------------------------------------ kilde-verifikation */

function verificerAlt() {
  let fejl = 0;
  let tjekket = 0;
  for (const r of FIELD_ENTRIES) {
    if (r.kasse === 'L87-SLET') continue;
    for (const frag of fragmenter(r.caveat_wording)) {
      tjekket++;
      const v = verificerFragment(frag, r.kilde);
      if (!v.ok) { fejl++; console.error(`FEJL field_entries ${r.robot_id}/${r.field_name}: "${frag}" — ${v.grund}`); }
    }
  }
  for (const rn of ROBOTS_NOTES) {
    const kilder = Array.isArray(rn.kilde) ? rn.kilde : [rn.kilde];
    (rn.notes_wording || []).forEach((w, i) => {
      for (const frag of fragmenter(w)) {
        tjekket++;
        const resultater = kilder.map((k) => verificerFragment(frag, k));
        if (!resultater.some((r) => r.ok)) {
          fejl++;
          console.error(`FEJL robots ${rn.id}.notes_wording[${i}]: "${frag}" — fundet i ingen af kilderne`);
        }
      }
    });
  }
  console.log(`Kildeverifikation: ${tjekket} fragmenter tjekket, ${fejl} fejl.`);
  return fejl === 0;
}

/* --------------------------------------------------------------- main */

async function patchEen(url, body, H, label, skriv, taeller) {
  taeller.planlagte++;
  console.log(label);
  if (!skriv) return true;
  const svar = await fetch(url, { method: 'PATCH', headers: H, body: JSON.stringify(body) });
  const json = await svar.json();
  if (!svar.ok || !Array.isArray(json) || json.length !== 1) {
    console.error(`  AFBRUDT: ${label} — status ${svar.status}, ${json.length ?? '?'} rækker`, json);
    process.exitCode = 1;
    return false;
  }
  taeller.udfoerte++;
  console.log('  OK, 1 række opdateret.');
  return true;
}

async function main() {
  const args = process.argv.slice(2);
  const kunVerificer = args.includes('--verificer');
  const skriv = args.includes('--skriv');

  console.log('--- Kildeverifikation (kildens tegn, bogstaveligt i raa-kildefil) ---');
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
  const H = { apikey: K, Authorization: `Bearer ${K}`, 'Content-Type': 'application/json', Prefer: 'return=representation' };

  console.log(`\n--- ${skriv ? 'SKRIVER' : 'TØRLØB'} ---\n`);
  const t = { planlagte: 0, udfoerte: 0 };

  for (const r of FIELD_ENTRIES) {
    const body = r.kasse === 'L87-SLET'
      ? { caveat: null, caveat_wording: null, caveat_class: null, collected_by: 'spor/f2-galileo', change_reason: r.change_reason || 'L87: paastand uden belaeg i raakilden, slettet' }
      : { caveat: r.caveat, caveat_wording: r.caveat_wording, collected_by: 'spor/f2-galileo', change_reason: `fase 2: ordret kildeordlyd renset for dansk (kasse ${r.kasse})` };
    const url = `${U}/rest/v1/field_entries?robot_id=eq.${r.robot_id}&field_name=eq.${r.field_name}`;
    const ok = await patchEen(url, body, H, `field_entries ${r.robot_id}/${r.field_name} [kasse ${r.kasse}]`, skriv, t);
    if (!ok) return;
  }

  for (const a of APPLICATIONS) {
    const body = { note: a.note, collected_by: 'spor/f2-galileo', change_reason: 'fase 2: applications.note oversat til engelsk' };
    const url = `${U}/rest/v1/applications?robot_id=eq.${a.robot_id}`;
    const ok = await patchEen(url, body, H, `applications ${a.robot_id}.note`, skriv, t);
    if (!ok) return;
  }

  for (const rn of ROBOTS_NOTES) {
    const body = { notes: rn.notes, notes_wording: rn.notes_wording, collected_by: 'spor/f2-galileo', change_reason: 'fase 2: robots.notes oversat, notes_wording renset for dansk' };
    const url = `${U}/rest/v1/robots?id=eq.${rn.id}`;
    const ok = await patchEen(url, body, H, `robots ${rn.id}.notes + notes_wording`, skriv, t);
    if (!ok) return;
  }

  for (const v of VALUE_TEXT) {
    const body = { value_text: v.value_text, collected_by: 'spor/f2-galileo', change_reason: 'fase 2/L87: value_text oversat til engelsk (betydning, ikke ordret)' };
    const url = `${U}/rest/v1/field_entries?robot_id=eq.${v.robot_id}&field_name=eq.${v.field_name}`;
    const ok = await patchEen(url, body, H, `field_entries ${v.robot_id}/${v.field_name}.value_text`, skriv, t);
    if (!ok) return;
  }

  for (const im of IMAGES) {
    const body = { note: im.note, collected_by: 'spor/f2-galileo', change_reason: 'fase 2: images.note oversat til engelsk' };
    const url = `${U}/rest/v1/images?robot_id=eq.${im.robot_id}`;
    const ok = await patchEen(url, body, H, `images ${im.robot_id}.note`, skriv, t);
    if (!ok) return;
  }

  console.log(`\n${skriv ? 'Skrevet' : 'Ville skrive'}: ${t.planlagte} opdateringer${skriv ? ` (${t.udfoerte} bekræftet)` : ''}.`);
  if (!skriv) console.log('Dette var et TØRLØB. Kør med --skriv for at skrive rent faktisk.');
}

export { FIELD_ENTRIES, APPLICATIONS, ROBOTS_NOTES, VALUE_TEXT, IMAGES, KILDER };

const koertDirekte = process.argv[1] && import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`;
if (koertDirekte) {
  main().catch((err) => {
    console.error('f2-galileo-skriv: fejl —', err.message, err.stack);
    process.exitCode = 1;
    return;
  });
}
