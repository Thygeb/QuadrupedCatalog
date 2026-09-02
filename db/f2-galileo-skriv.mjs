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
  GALILEO_PDF: 'raa-kand4-2026-08-25/galileo-wrc-product-manual-2025.pdf',
  MICRO_P1_EN: 'raa-kand1b-2026-08-24/micbotics-movenew-p1-en-2026-08-24.html',
  MICRO_P1_PDF: 'raa-kand1b-2026-08-24/micbotics-movenew-p1-datasheet-2026-08-24.pdf',
  MICRO_T1_EN: 'raa-kand1b-2026-08-24/micbotics-movenew-t1-en-2026-08-24.html',
  MICRO_T1_CN: 'raa-kand1b-2026-08-24/micbotics-movenew-t1-cn-2026-08-24.html',
  MICRO_T1_PDF: 'raa-kand1b-2026-08-24/micbotics-movenew-t1-datasheet-2026-08-24.pdf',
  XIAOMI_CD1_SPEC_JS: 'raa-anvendelse-2026-08-19/xiaomi-cyberdog1-specside-bundle-js-2026-08-21.js',
  XIAOMI_CD1_PROD_HTML: 'raa-anvendelse-2026-08-19/xiaomi-cyberdog1-produktside-cn-2026-08-21.html',
  XIAOMI_CD2_SPEC_JS: 'raa-kina-weilan-xiaomi-2026-08-19/xiaomi-cyberdog2-specside-bundle-js-2026-08-19.js',
  XIAOMI_CD2_PROD_HTML: 'raa-kina-weilan-xiaomi-2026-08-19/xiaomi-cyberdog2-produktside-2026-08-19.html',
};

// XIAOMI-NOTE: specifikationerne er Vue.js-renderet (e._v("...")-kald i en
// JS-bundle), IKKE statisk HTML. db/fase2-tjek.mjs --belaeg's "22 raekker
// uden traef" flaggede 3 af CyberDog 1's raekker (weight/height/
// payload_walking) som ubelagte - alle 3 er FALSKE ALARMER: tallet findes,
// bogstaveligt, i JS-bundlen, som --belaeg ikke soeger i (kun .html). Se
// rapportens "Nye fælder og opdagelser".

// MICRO_*_PDF-NOTE: begge micbotics-datablade er BILLED-PDF'er - pdftotext
// giver 0 tegn (ingen tekstlag overhovedet, ikke engang mojibake), og
// pdftoppm (sidebilleder til Read-vaerktoejet) er ikke installeret paa denne
// maskine. Fire felter (P1: autonomy_level, mounting_interface. T1: hot_swap,
// mounting_interface, power_output) er derfor IKKE efterproevet mod deres
// egen raakilde - kun mod byte-for-byte YAML==DB-match (ingen drift siden
// den oprindelige indsamling). LAV konfidens for netop disse fem citater -
// se rapporten.

// GALILEO_PDF-NOTE: pdftotext (poppler) udtraekker denne PDF's tabeller med
// TO uafhaengige svagheder, begge maalt af dette spor: (1) cifre/tegn i
// vaerdi-cellerne bliver til U+FFFD (skrifttype uden ToUnicode-mapping for
// tal), og (2) tabellens FLERE kolonner laeses ikke raekkevis - etiketter og
// vaerdier ender i to adskilte klumper i UFORUDSIGELIG indbyrdes raekkefoelge.
// Den automatiske fragmenterVerificerFragment()-kaede er derfor IKKE brugt
// paa Galileo-raekkerne - se GALILEO_VERIFICERET_MANUELT nedenfor i stedet:
// alle kinesiske etiketter er bekraeftet TIL STEDE i det udtrukne tekstlag
// (grep, listet i FUND-f2galileo.md), og alle 90 felter matcher BYTE FOR
// BYTE den oprindelige data/robots/galileo-*.yaml (cmp.mjs, samme rapport)
// - dvs. INGEN drift siden den oprindelige indsamling, som selv laeste den
// AABNEDE pdf (ikke tekstudtraek). Middel, ikke hoej, konfidens - se rapporten.
const GALILEO_VERIFICERET_MANUELT = true;

const kildeCache = new Map();
function laesKilde(rel) {
  if (kildeCache.has(rel)) return kildeCache.get(rel);
  const fuld = path.join(KILDE_MAPPE, rel);
  const indhold = fs.existsSync(fuld) ? fs.readFileSync(fuld, 'utf8') : null;
  kildeCache.set(rel, indhold);
  return indhold;
}

// HTML-entiteter der kan staa mellem to ord i raa-kilden, hvor vores egen
// gengivelse bruger et almindeligt mellemrum/tegn (browseren renderer dem
// ens, men de rå bytes er forskellige - fx "NMC&nbsp;battery" i kilden mod
// "NMC battery" i vores tekst).
function afkodEnkleEntiteter(s) {
  //  : JS-bundler (Xiaomi) bruger det LITERALE NBSP-tegn direkte i
  // strengen (ikke en HTML-entitet) som mellemrum mellem etiket og vaerdi.
  return s.replace(/&nbsp;/g, ' ').replace(/ /g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}
const kildeCacheAfkodet = new Map();
function laesKildeAfkodet(rel) {
  if (kildeCacheAfkodet.has(rel)) return kildeCacheAfkodet.get(rel);
  const raa = laesKilde(rel);
  const afkodet = raa === null ? null : afkodEnkleEntiteter(raa);
  kildeCacheAfkodet.set(rel, afkodet);
  return afkodet;
}
// Tag-strippet udgave (til fragmenter, som en enkelt <span> deler op i to).
const kildeCacheUdenTags = new Map();
function laesKildeUdenTags(rel) {
  if (kildeCacheUdenTags.has(rel)) return kildeCacheUdenTags.get(rel);
  const afkodet = laesKildeAfkodet(rel);
  const udenTags = afkodet === null ? null : afkodet.replace(/<[^>]*>/g, '');
  kildeCacheUdenTags.set(rel, udenTags);
  return udenTags;
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
function proevAlleFormer(fragment, kildeRel, test) {
  for (const indhold of [laesKilde(kildeRel), laesKildeAfkodet(kildeRel), laesKildeUdenTags(kildeRel)]) {
    if (indhold !== null && test(indhold)) return true;
  }
  return false;
}

function verificerFragment(fragment, kildeRel) {
  const indhold = laesKilde(kildeRel);
  if (indhold === null) return { ok: false, grund: `kildefil mangler: ${kildeRel}` };
  // Proev raat, saa HTML-entitet-afkodet (&nbsp; -> mellemrum osv.), saa
  // tag-strippet (en enkelt <span> kan dele et fragment i to) - i den
  // raekkefoelge, saa den svageste antagelse kun bruges naar noedvendigt.
  if (proevAlleFormer(fragment, kildeRel, (i) => i.includes(fragment))) return { ok: true };
  if (fragment.includes('...')) {
    const dele = fragment.split('...').map((d) => d.trim()).filter(Boolean);
    if (dele.length > 0 && dele.every((d) => proevAlleFormer(d, kildeRel, (i) => i.includes(d)))) return { ok: true, ellipse: true };
    return { ok: false, grund: `IKKE fundet (deltjek omkring "..." fejlede) i ${kildeRel}` };
  }
  // Foretraek split paa et kolon (": " ELLER kildens eget fuldbredde "：",
  // med eller uden mellemrum efter - Vue/JS-bundler bruger tit "：" direkte
  // klaebet til vaerdien, ingen mellemrum).
  for (const [koloni, skipLen] of [[fragment.indexOf(': '), 2], [fragment.indexOf('：'), 1], [fragment.indexOf(':'), 1]]) {
    if (koloni > 0) {
      const etiket = fragment.slice(0, koloni);
      const vaerdi = fragment.slice(koloni + skipLen);
      if (proevAlleFormer(etiket, kildeRel, (i) => i.includes(etiket)) && proevAlleFormer(vaerdi, kildeRel, (i) => i.includes(vaerdi))) {
        return { ok: true, split: 'colon' };
      }
    }
  }
  const i2 = fragment.indexOf(' ');
  if (i2 > 0) {
    const etiket = fragment.slice(0, i2);
    const vaerdi = fragment.slice(i2 + 1);
    if (proevAlleFormer(etiket, kildeRel, (i) => i.includes(etiket)) && proevAlleFormer(vaerdi, kildeRel, (i) => i.includes(vaerdi))) {
      return { ok: true, split: true };
    }
  }
  return { ok: false, grund: `IKKE fundet ordret (heller ikke split paa etiket+vaerdi, entitetsafkodning eller tag-strip) i ${kildeRel}` };
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

  // ========================================================= GALILEO C1 (2199) ===
  { robot_id: 2199, field_name: 'weight', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '重量: 15kg',
    caveat: 'In the body-specifications section of the table, manual page 7 (C1 Industrial Small table).' },
  { robot_id: 2199, field_name: 'length', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '站立尺寸（长×宽×高）单位mm: 660*320*470',
    caveat: 'Standing measurement, length x width x height, in mm.' },
  { robot_id: 2199, field_name: 'payload_walking', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '有效负载: 8kg',
    caveat: "Effective payload. Mapped to walking payload - '有效' (effective, during active use) is interpreted as corresponding to the walking/dynamic load, parallel to Yuejia's explicit '动态负载' (dynamic load). An interpretation, not the manufacturer's own word 'walking'." },
  { robot_id: 2199, field_name: 'payload_standing', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '最大负载: 15kg',
    caveat: 'Maximum payload. Mapped to standing payload - same interpretation principle as for the walking payload above.' },
  { robot_id: 2199, field_name: 'speed', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '运动速度: 0～3.7m/s',
    caveat: 'Movement speed.' },
  { robot_id: 2199, field_name: 'slope', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '可攀爬斜坡最大坡度: ±40°',
    caveat: "Maximum climbable slope angle. The plus/minus sign is the manufacturer's own notation." },
  { robot_id: 2199, field_name: 'stair_step_continuous', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '可攀爬高度: 20cm高连续台阶',
    caveat: 'Climb height: 20cm-high continuous stairs - see the top note on the terminology difference between C1 and C1-W.' },
  { robot_id: 2199, field_name: 'temperature_min', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '工作环境温度: -20℃~55℃（-40℃可定制）',
    caveat: '-40C is a paid/custom-order option, not the standard value. The standard value -20C is used here.' },
  { robot_id: 2199, field_name: 'battery_wh', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '电池容量: 15AH，720Wh',
    caveat: 'Manufacturer states both Ah and Wh directly (720Wh is NOT calculated by us). Nominal voltage (电池额定电压) is given separately as 48V.' },
  { robot_id: 2199, field_name: 'runtime', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '续航时间: 3.5h～6h | 续航里程: ＞10km',
    caveat: 'No load condition (kg) disclosed. A separate range figure is also given (>10km); the schema has no range field.' },
  { robot_id: 2199, field_name: 'hot_swap', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '配备模块化热插拔电池仓，支持数秒完成电池更换',
    caveat: "From the manual's shared feature page (page 6), NOT from C1's own table - see the top note. Modular hot-swap battery compartment, battery swap in a few seconds." },
  { robot_id: 2199, field_name: 'docking_station', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '自主充电功能: 支持 | 通过激光雷达导航实现自动对接充电桩',
    caveat: "Combines two sources: C1's own table (page 7) and the shared feature page (page 6) - see the top note. Autonomous-charging function: supported; via LiDAR navigation, automatic docking with the charging station." },
  { robot_id: 2199, field_name: 'lidar', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '激光雷达: 探测距离40m | 环境参数',
    caveat: "In the table's environmental-parameters section, page 7. Type/model not named." },
  { robot_id: 2199, field_name: 'compute', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: 'CPU: X86或国产ARM低功耗高性能CPU',
    caveat: 'X86 or domestic Chinese ARM, low power consumption, high performance - two alternative platforms, no TOPS figure disclosed.' },
  { robot_id: 2199, field_name: 'autonomy_level', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '其他',
    caveat: "Two rows from C1's own 'Other' section - a qualitative list, not a level on a scale." },
  { robot_id: 2199, field_name: 'power_output', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '外接电源接口: 5V; 12V; 24V；',
    caveat: 'External power-supply port. Only voltages disclosed, no wattage per port.' },
  { robot_id: 2199, field_name: 'data_ports', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '外接通讯接口: Ethernet; USB; RS485',
    caveat: 'External communication interface.' },

  // ======================================================= GALILEO C1-W (2200) ===
  { robot_id: 2200, field_name: 'weight', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '重量: 19kg',
    caveat: 'In the body-specifications section, manual page 7 (C1-W Industrial Small table).' },
  { robot_id: 2200, field_name: 'length', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '站立尺寸（长×宽×高）单位mm: 660*320*560',
    caveat: 'Standing measurement, length x width x height, in mm.' },
  { robot_id: 2200, field_name: 'height', kasse: 'B', kilde: KILDER.GALILEO_PDF,
    caveat_wording: null,
    caveat: 'Higher than the walking C1 (470mm), as expected once the wheel-legs are added.' },
  { robot_id: 2200, field_name: 'payload_walking', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '有效负载: 8kg',
    caveat: 'Effective payload - same interpretation as for C1. Identical figure to the walking C1.' },
  { robot_id: 2200, field_name: 'payload_standing', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '最大负载: 15kg',
    caveat: 'Maximum payload - identical figure to the walking C1.' },
  { robot_id: 2200, field_name: 'speed', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '运动速度: 0～2.5m/s',
    caveat: "LOWER than the walking C1's 3.7m/s. Note: for Yuejia the pattern is reversed (the wheeled variant is faster). The two manufacturers cannot be compared on this point without knowing their respective wheel designs." },
  { robot_id: 2200, field_name: 'slope', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '可攀爬斜坡最大坡度: ±40°',
    caveat: 'Maximum climbable slope angle - identical to the walking C1.' },
  { robot_id: 2200, field_name: 'obstacle_single', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '可攀爬高度: 正向高度差70cm高台',
    caveat: 'Climb height: forward height difference, 70cm platform - see the top note on the terminology difference between C1 and C1-W.' },
  { robot_id: 2200, field_name: 'temperature_min', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '工作环境温度: -20℃~55℃（-40℃可定制）',
    caveat: '-40C is a custom-order option - see C1\'s corresponding note.' },
  { robot_id: 2200, field_name: 'battery_wh', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '电池容量: 15AH，720Wh',
    caveat: 'Battery capacity - identical to the walking C1. Nominal battery voltage (电池额定电压) 48V.' },
  { robot_id: 2200, field_name: 'runtime', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '续航时间: 2.5h～5h | 续航里程: ＞15km',
    caveat: "Runtime - longer lower bound, shorter upper bound than the walking C1's 3.5-6h. A separate range figure is also given; the schema has no range field." },
  { robot_id: 2200, field_name: 'hot_swap', kasse: 'B', kilde: KILDER.GALILEO_PDF,
    caveat_wording: null,
    caveat: "From the shared feature page (page 6), same source as C1." },
  { robot_id: 2200, field_name: 'docking_station', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '自主充电功能: 支持',
    caveat: 'Autonomous-charging function: supported. Combined with the shared feature page\'s charging-dock description, same source as C1.' },

  // ========================================================= GALILEO E1 (2201) ===
  { robot_id: 2201, field_name: 'weight', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '重量: 44kg',
    caveat: 'Manual page 8 (E1 table).' },
  { robot_id: 2201, field_name: 'length', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '站立尺寸（长×宽×高）单位mm: 1000*420*710',
    caveat: 'Standing measurement, length x width x height, in mm.' },
  { robot_id: 2201, field_name: 'payload_walking', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '有效负载: 20kg',
    caveat: 'Effective payload - same interpretation as for C1.' },
  { robot_id: 2201, field_name: 'payload_standing', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '最大负载: 85kg',
    caveat: 'Maximum payload.' },
  { robot_id: 2201, field_name: 'speed', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '运动速度: 0～4m/s（极限4.95m/s）',
    caveat: 'The 4.95 m/s limit speed is a separate, higher ceiling value, not used as the primary value (same principle as GENISOM L2\'s).' },
  { robot_id: 2201, field_name: 'slope', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '可攀爬斜坡最大坡度: ±45°',
    caveat: 'Maximum climbable slope angle.' },
  { robot_id: 2201, field_name: 'stair_step_continuous', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '可攀爬高度: 30cm高连续台阶',
    caveat: 'Climb height: 30cm-high continuous stairs - see the top note on the allocation of the two value blocks.' },
  { robot_id: 2201, field_name: 'temperature_min', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '-20℃~55℃（-40℃可定制）',
    caveat: '-40C is a custom-order option.' },
  { robot_id: 2201, field_name: 'battery_wh', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '电池容量: 25Ah（1200Wh）',
    caveat: 'Battery capacity - 48V nominal voltage.' },
  { robot_id: 2201, field_name: 'runtime', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '续航时间: 2h～4h | 续航里程: ＞15km',
    caveat: 'No load condition. A separate range figure is also given.' },
  { robot_id: 2201, field_name: 'hot_swap', kasse: 'B', kilde: KILDER.GALILEO_PDF,
    caveat_wording: null,
    caveat: 'From the shared feature page (page 6), same source as C1.' },
  { robot_id: 2201, field_name: 'docking_station', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '自主充电功能: 支持',
    caveat: "Autonomous-charging function: supported. Combined with the shared feature page's charging-dock description." },
  { robot_id: 2201, field_name: 'power_output', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '外接电源接口: 5V；12V；48V',
    caveat: "See the top note: the figure occurred only ONCE in the extracted text layer for the E1/E1-W page, assigned to both models based on the C1/C1-W pair's precedent (identical figure on both variants there)." },
  { robot_id: 2201, field_name: 'data_ports', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '外接通讯接口: Ethernet; USB; TypeC（接口可按需拓展）',
    caveat: "TypeC replaces the C1/C1-W pair's RS485. '接口可按需拓展' (interfaces can be expanded as needed) is not a fourth port, just a note on flexibility." },

  // ======================================================= GALILEO E1-W (2202) ===
  { robot_id: 2202, field_name: 'weight', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '重量: 38kg',
    caveat: 'Manual page 8 (E1-W table).' },
  { robot_id: 2202, field_name: 'length', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '站立尺寸（长×宽×高）单位mm: 1000×420×600',
    caveat: 'Standing measurement, length x width x height, in mm.' },
  { robot_id: 2202, field_name: 'height', kasse: 'B', kilde: KILDER.GALILEO_PDF,
    caveat_wording: null,
    caveat: "LOWER than the walking E1's 710mm - opposite to C1-W, which was HIGHER than C1. The source has been double-checked and reproduced precisely; the difference between the C1/C1-W and E1/E1-W height relationships is not explained in the manual." },
  { robot_id: 2202, field_name: 'payload_walking', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '有效负载: 20kg',
    caveat: 'Effective payload - identical to the walking E1.' },
  { robot_id: 2202, field_name: 'payload_standing', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '最大负载: 85kg',
    caveat: 'Maximum payload - identical to the walking E1.' },
  { robot_id: 2202, field_name: 'speed', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '运动速度: 0-4m/s（极限4.95m/s）',
    caveat: 'Movement speed, 4.95 m/s limit - identical to the walking E1. The limit speed is not used as the primary value.' },
  { robot_id: 2202, field_name: 'slope', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '可攀爬斜坡最大坡度: ±45 °',
    caveat: 'Maximum climbable slope angle.' },
  { robot_id: 2202, field_name: 'obstacle_single', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '可攀爬高度: 正向高度差1m高台',
    caveat: "Manufacturer writes '1m'; converted to 100cm for consistency with the other obstacle_single values in the catalog (all in cm). See the top note." },
  { robot_id: 2202, field_name: 'temperature_min', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '-20℃~55℃（-40℃可定制）',
    caveat: '-40C is a custom-order option.' },
  { robot_id: 2202, field_name: 'battery_wh', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '电池容量: 25Ah（1200Wh）',
    caveat: 'Battery capacity - identical to the walking E1. 48V nominal voltage.' },
  { robot_id: 2202, field_name: 'runtime', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '续航时间: 1.5h～3h | 续航里程: ＞30km',
    caveat: "Runtime - shorter than the walking E1's 2-4h. A separate range figure is also given - twice E1's 15km, as expected for a wheel-driven variant." },
  { robot_id: 2202, field_name: 'hot_swap', kasse: 'B', kilde: KILDER.GALILEO_PDF,
    caveat_wording: null,
    caveat: 'From the shared feature page (page 6), same source as C1.' },
  { robot_id: 2202, field_name: 'docking_station', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '自主充电功能: 支持',
    caveat: "Autonomous-charging function: supported. Combined with the shared feature page's charging-dock description." },
  { robot_id: 2202, field_name: 'power_output', kasse: 'B', kilde: KILDER.GALILEO_PDF,
    caveat_wording: null,
    caveat: "See the top note: an analogy drawn from the C1/C1-W pair's identical figure, not an independently confirmed E1-W-specific reading." },
  { robot_id: 2202, field_name: 'data_ports', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '外接通讯接口: Ethernet; USB; TypeC（接口可按需拓展）',
    caveat: 'External communication interface: Ethernet; USB; TypeC; interfaces can be expanded as needed.' },

  // ========================================================= GALILEO S1 (2203) ===
  { robot_id: 2203, field_name: 'weight', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '重量: 60kg',
    caveat: 'Manual page 9 (S1 Industrial Large table).' },
  { robot_id: 2203, field_name: 'length', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '站立尺寸（长×宽×高）单位mm: 1100*450*700',
    caveat: 'Standing measurement, length x width x height, in mm.' },
  { robot_id: 2203, field_name: 'payload_walking', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '有效负载: 40kg',
    caveat: 'Effective payload - same interpretation as for C1.' },
  { robot_id: 2203, field_name: 'payload_standing', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '最大负载: 120kg',
    caveat: 'Maximum payload.' },
  { robot_id: 2203, field_name: 'speed', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '运动速度: 0-4m/s,（极限6m/s）',
    caveat: 'The 6 m/s limit speed is a separate, higher ceiling value, not used as the primary value.' },
  { robot_id: 2203, field_name: 'slope', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '可攀爬斜坡最大坡度: ±45°',
    caveat: 'Maximum climbable slope angle.' },
  { robot_id: 2203, field_name: 'obstacle_single', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '正向高度差40cm高台',
    caveat: 'Forward height difference, 40cm platform - part of the same table row as stair_step_continuous, see the top note. S1 is the only Galileo model with both climbing fields filled in.' },
  { robot_id: 2203, field_name: 'stair_step_continuous', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '25cm高连续台阶',
    caveat: '25cm-high continuous stairs - part of the same table row as obstacle_single, see the top note.' },
  { robot_id: 2203, field_name: 'temperature_min', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '-20℃~55℃（-40℃可定制）',
    caveat: '-40C is a custom-order option.' },
  { robot_id: 2203, field_name: 'battery_wh', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '电池容量: 40Ah（2880Wh）',
    caveat: "Battery capacity - 72V nominal voltage, higher than C1/E1's 48V." },
  { robot_id: 2203, field_name: 'runtime', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '续航时间: 5h（20kg负载）～7.5h | 续航里程: ＞20km',
    caveat: 'The lowest figure (5h) is explicitly marked at 20kg load (rule 8); the upper figure (7.5h) is presumably without/at lighter load, not separately marked. A separate range figure is also given.' },
  { robot_id: 2203, field_name: 'hot_swap', kasse: 'B', kilde: KILDER.GALILEO_PDF,
    caveat_wording: null,
    caveat: 'From the shared feature page (page 6), same source as C1.' },
  { robot_id: 2203, field_name: 'docking_station', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '自主充电功能: 支持',
    caveat: "Autonomous-charging function: supported. Combined with the shared feature page's charging-dock description." },
  { robot_id: 2203, field_name: 'power_output', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '外接电源接口: 5V; 12V; 24V；',
    caveat: "External power-supply port - identical to the C1/C1-W pair." },
  { robot_id: 2203, field_name: 'data_ports', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '外接通讯接口: Ethernet; USB; RS485',
    caveat: 'External communication interface - identical to the C1/C1-W pair.' },

  // ======================================================= GALILEO S1-W (2204) ===
  { robot_id: 2204, field_name: 'weight', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '重量: 85kg',
    caveat: 'Manual page 9 (S1-W Industrial Large table).' },
  { robot_id: 2204, field_name: 'length', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '站立尺寸（长×宽×高）单位mm: 1100*450*810',
    caveat: 'Standing measurement, length x width x height, in mm.' },
  { robot_id: 2204, field_name: 'height', kasse: 'B', kilde: KILDER.GALILEO_PDF,
    caveat_wording: null,
    caveat: "Higher than the walking S1's 700mm, as expected once the wheel-legs are added - same pattern as C1/C1-W." },
  { robot_id: 2204, field_name: 'payload_walking', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '有效负载: 40kg',
    caveat: 'Effective payload - identical to the walking S1.' },
  { robot_id: 2204, field_name: 'payload_standing', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '最大负载: 120kg',
    caveat: 'Maximum payload - identical to the walking S1.' },
  { robot_id: 2204, field_name: 'speed', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '运动速度: 0-4m/s,（极限6m/s）',
    caveat: 'Movement speed, 6 m/s limit - identical to the walking S1. The limit speed is not used as the primary value.' },
  { robot_id: 2204, field_name: 'slope', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '可攀爬斜坡最大坡度: ±45°',
    caveat: 'Maximum climbable slope angle.' },
  { robot_id: 2204, field_name: 'obstacle_single', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '正向高度差110cm高台',
    caveat: "Forward height difference, 110cm platform - see the top note. Substantially higher than S1's 40cm, as expected for a wheel-driven variant." },
  { robot_id: 2204, field_name: 'stair_step_continuous', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '25cm高连续台阶',
    caveat: '25cm-high continuous stairs - identical to the walking S1. See the top note.' },
  { robot_id: 2204, field_name: 'temperature_min', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '-20℃~55℃（-40℃可定制）',
    caveat: '-40C is a custom-order option.' },
  { robot_id: 2204, field_name: 'battery_wh', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '电池容量: 40Ah（2880Wh）',
    caveat: 'Battery capacity - identical to the walking S1. 72V nominal voltage.' },
  { robot_id: 2204, field_name: 'runtime', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '续航时间: 4h（20kg负载）～6h | 续航里程: ＞60km',
    caveat: "Lowest figure (4h) explicitly marked at 20kg load (rule 8), the upper figure (6h) presumably at lighter load. A separate range figure is also given - three times the walking S1's 20km." },
  { robot_id: 2204, field_name: 'hot_swap', kasse: 'B', kilde: KILDER.GALILEO_PDF,
    caveat_wording: null,
    caveat: 'From the shared feature page (page 6), same source as C1.' },
  { robot_id: 2204, field_name: 'docking_station', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '自主充电功能: 支持',
    caveat: "Autonomous-charging function: supported. Combined with the shared feature page's charging-dock description." },
  { robot_id: 2204, field_name: 'power_output', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '外接电源接口: 5V; 12V; 24V；',
    caveat: 'External power-supply port - identical to the walking S1.' },
  { robot_id: 2204, field_name: 'data_ports', kasse: 'A', kilde: KILDER.GALILEO_PDF,
    caveat_wording: '外接通讯接口: Ethernet; USB; RS485',
    caveat: 'External communication interface - identical to the walking S1.' },

  // ================================================== MICROROBOTECH P1 (2223) ===
  { robot_id: 2223, field_name: 'weight', kasse: 'A', kilde: KILDER.MICRO_P1_EN,
    caveat_wording: 'Total Weight: 77kg (Battery included)',
    caveat: "Explicit including battery, unlike T1's ambiguous label." },
  { robot_id: 2223, field_name: 'length', kasse: 'A', kilde: KILDER.MICRO_P1_EN,
    caveat_wording: 'Standing Dimensions: 900mm × 600mm × 650mm',
    caveat: 'Axes are not labeled. The order length x width x height is assumed, not confirmed.' },
  { robot_id: 2223, field_name: 'width', kasse: 'B', kilde: KILDER.MICRO_P1_EN,
    caveat_wording: null,
    caveat: 'UNCERTAIN ASSIGNMENT - see length.' },
  { robot_id: 2223, field_name: 'height', kasse: 'B', kilde: KILDER.MICRO_P1_EN,
    caveat_wording: null,
    caveat: 'UNCERTAIN ASSIGNMENT - see length. Folded measurement is 1150 x 800 x 200mm; the schema has no folded-measurement field.' },
  { robot_id: 2223, field_name: 'degrees_of_freedom', kasse: 'A', kilde: KILDER.MICRO_P1_EN,
    caveat_wording: 'High-Performance Motors: 16 units',
    caveat: 'Motor count, not explicitly DoF. Same interpretation as T1 and Go2.' },
  { robot_id: 2223, field_name: 'payload_walking', kasse: 'A', kilde: KILDER.MICRO_P1_EN,
    caveat_wording: 'Max Walking Load: 200 kg',
    caveat: "Label 'Max Walking Load'." },
  { robot_id: 2223, field_name: 'payload_standing', kasse: 'A', kilde: KILDER.MICRO_P1_EN,
    caveat_wording: 'Max Standing Load: 400 kg',
    caveat: "Label 'Max Standing Load'." },
  { robot_id: 2223, field_name: 'slope', kasse: 'A', kilde: KILDER.MICRO_P1_EN,
    caveat_wording: 'Slope Capability: >45°',
    caveat: "A different row, 'Step Negotiation', also shows 45° without '>' - possibly the same information repeated under two labels, possibly a manufacturer template error. Only the 'Slope Capability' row is used here, as it has the clearest label and operator." },
  { robot_id: 2223, field_name: 'obstacle_single', kasse: 'A', kilde: KILDER.MICRO_P1_EN,
    caveat_wording: 'Max Climbing Ability: 800 mm',
    caveat: "Unusually large figure for a single obstacle (twice as high as T1's 400mm-class obstacle) - not cross-checked against another field, and could be a manufacturer typo (e.g. confused with a ramp/load-related measurement). Recorded verbatim, not corrected." },
  { robot_id: 2223, field_name: 'stair_step_continuous', kasse: 'A', kilde: KILDER.MICRO_P1_EN,
    caveat_wording: 'Stair Climbing Capability: Max step height 25cm',
    caveat: "Label 'Stair Climbing Capability'." },
  { robot_id: 2223, field_name: 'ip_rating', kasse: 'A', kilde: KILDER.MICRO_P1_EN,
    caveat_wording: 'Wheel Protection Rating IP68',
    caveat: 'The source adds a wheel protection rating (IP68) - the wheels have a different, higher class than the whole machine. Only the whole-machine IP67 is used in the field.' },
  { robot_id: 2223, field_name: 'battery_wh', kasse: 'A', kilde: KILDER.MICRO_P1_EN,
    caveat_wording: 'Hot-swappable 3.2kWh NMC battery (Supply voltage: 72V)',
    caveat: 'Battery pack is described as hot-swappable NMC chemistry; nominal supply voltage 72V.' },
  { robot_id: 2223, field_name: 'runtime', kasse: 'A', kilde: KILDER.MICRO_P1_EN,
    caveat_wording: 'No-load continuous operating time: ≤12h | Full-load continuous operating time: ≤ 8h',
    caveat: "Two load conditions (no load / full load) with no concrete kg figure for 'full load' - cannot therefore be written as a specific load requirement, only as load condition not disclosed. 'Max Walking Load: 200kg' appears in the table, but the manufacturer does not explicitly connect it to the 'full load' row, so that connection is not made here." },
  { robot_id: 2223, field_name: 'hot_swap', kasse: 'A', kilde: KILDER.MICRO_P1_EN,
    caveat_wording: 'Hot-swappable',
    caveat: "The word 'Hot-swappable' appears directly in the battery row." },
  { robot_id: 2223, field_name: 'charging_time', kasse: 'A', kilde: KILDER.MICRO_P1_EN,
    caveat_wording: 'Charging Time: 1.5h',
    caveat: "Label 'Charging Time'." },
  { robot_id: 2223, field_name: 'lidar', kasse: 'A', kilde: KILDER.MICRO_P1_EN,
    caveat_wording: 'Automotive-grade LiDAR: 96-line LiDAR 1 (supports installation of up to 3 units)',
    caveat: "Line count disclosed - therefore counts under rule D4 (type WITH model/specification), unlike T1's." },
  { robot_id: 2223, field_name: 'cameras', kasse: 'A', kilde: KILDER.MICRO_P1_EN,
    caveat_wording: 'HD Depth Camera: Support for installation | Ultrasonic Radar: Support for installation',
    caveat: "Both rows say 'Support for installation', NOT that the equipment is standard-fitted. Recorded as the manufacturer's own wording, not converted to 'yes, camera fitted'." },
  { robot_id: 2223, field_name: 'compute', kasse: 'A', kilde: KILDER.MICRO_P1_EN,
    caveat_wording: 'Supports 2000 tops',
    caveat: "The word 'Supports' suggests maximum supported compute power via an optional module, not necessarily built-in as standard - unlike T1, where 'Jetson Orin NX Super+RK3588' is named as the actual core module." },
  { robot_id: 2223, field_name: 'autonomy_level', kasse: 'A', kilde: KILDER.MICRO_P1_PDF,
    caveat_wording: 'Equipped with a multi-sensor fusion perception system and a high-computing power platform, it forms a 360° omnidirectional environmental awareness network, fully covering functional modules such as environmental perception, monitoring, and knowledge reasoning.',
    caveat: "PDF datasheet ('MOVENEW P1 - Industrial Special-Purpose Wheeled Quadruped Robot'), page 3 ('Integrated Sensing & Control'). Qualitative description - no numeric autonomy level (SAE/ISO-like scale) disclosed." },
  { robot_id: 2223, field_name: 'mounting_interface', kasse: 'A', kilde: KILDER.MICRO_P1_PDF,
    caveat_wording: 'Expansion Rails',
    caveat: "PDF datasheet, page 4 ('P1 Technical Specifications'), 'Function Configuration' section: the 'Expansion Rails' row is marked with a dot (present), same pattern as T1's 'Top Mount Expansion'/'Undercarriage Expansion' - but without further specification of interface standard or load capacity." },

  // ================================================== MICROROBOTECH T1 (2224) ===
  { robot_id: 2224, field_name: 'weight', kasse: 'A', kilde: [KILDER.MICRO_T1_EN, KILDER.MICRO_T1_CN],
    caveat_wording: 'Total Battery Weight: 40~50kg | 整机电池重量',
    caveat: "Label 'Total Battery Weight' - literally 'whole-machine-battery-weight', a conflated label. Placed as own weight (with battery), because the row appears under 'Mechanical Parameters' next to the dimensions, not under 'Electrical Parameters'. Not a typo on our part - the manufacturer's own label is ambiguous." },
  { robot_id: 2224, field_name: 'length', kasse: 'A', kilde: KILDER.MICRO_T1_EN,
    caveat_wording: 'Standing Dimensions: 800mm × 600mm × 540mm',
    caveat: 'The manufacturer does not label the axes. The order length x width x height is assumed by convention, not confirmed by the source (same uncertainty as deep-robotics-x30).' },
  { robot_id: 2224, field_name: 'width', kasse: 'B', kilde: KILDER.MICRO_T1_EN,
    caveat_wording: null,
    caveat: 'UNCERTAIN ASSIGNMENT - see length. Axes are not labeled in the source.' },
  { robot_id: 2224, field_name: 'height', kasse: 'B', kilde: KILDER.MICRO_T1_EN,
    caveat_wording: null,
    caveat: 'UNCERTAIN ASSIGNMENT - see length. Folded measurement is 1025 x 750 x 150mm; the schema has no folded-measurement field.' },
  { robot_id: 2224, field_name: 'degrees_of_freedom', kasse: 'A', kilde: KILDER.MICRO_T1_EN,
    caveat_wording: 'High-Performance Motors: 16 units',
    caveat: "Manufacturer writes 'High-Performance Motors: 16 units', not 'Degrees of Freedom'. T1 is a wheel-leg hybrid, so the 16 motors presumably cover both leg joints and wheel hubs - not necessarily 16 pure degrees of freedom. Same interpretation as Go2's motor count." },
  { robot_id: 2224, field_name: 'payload_walking', kasse: 'A', kilde: KILDER.MICRO_T1_EN,
    caveat_wording: 'Continuous Walking Load: 50kg',
    caveat: "Label 'Continuous Walking Load'." },
  { robot_id: 2224, field_name: 'payload_standing', kasse: 'A', kilde: KILDER.MICRO_T1_EN,
    caveat_wording: 'Max Standing Load: 100kg',
    caveat: "Label 'Max Standing Load'." },
  { robot_id: 2224, field_name: 'speed', kasse: 'A', kilde: KILDER.MICRO_T1_EN,
    caveat_wording: 'Max Moving Speed: 18 km/h',
    caveat: "A ceiling, not a sustained operating speed. No operator added, since 'Max' here is a label (per the skill's distinction between label and operator)." },
  { robot_id: 2224, field_name: 'slope', kasse: 'A', kilde: KILDER.MICRO_T1_EN,
    caveat_wording: 'Slope Capability: ≤45°',
    caveat: "The source prints the character U+2264 before 45° under 'Slope Capability' - a ceiling, same pattern as X30's caveat about the same character from a different manufacturer." },
  { robot_id: 2224, field_name: 'obstacle_single', kasse: 'A', kilde: KILDER.MICRO_T1_EN,
    caveat_wording: 'Step Negotiation: Forward climbing up/down 40cm steps',
    caveat: "Label 'Step Negotiation'." },
  { robot_id: 2224, field_name: 'stair_step_continuous', kasse: 'A', kilde: KILDER.MICRO_T1_EN,
    caveat_wording: 'Stair Climbing Capability: Max step height 25cm',
    caveat: 'Separated from obstacle_single because the source itself uses two different labels and two different figures (25cm vs. 40cm) for the two concepts - unlike X30, where they stood as one combined field.' },
  { robot_id: 2224, field_name: 'battery_wh', kasse: 'A', kilde: KILDER.MICRO_T1_EN,
    caveat_wording: 'Battery Capacity: 3.5/4.5 kwh, Supply Voltage 72V',
    caveat: "Two battery-pack sizes to choose between, not a measured range. Recorded as min/max, because the schema has no 'two variants' format for a single figure." },
  { robot_id: 2224, field_name: 'runtime', kasse: 'A', kilde: KILDER.MICRO_T1_EN,
    caveat_wording: 'Max Endurance Time: ≤12h',
    caveat: 'No load condition disclosed - therefore cannot be compared directly to a runtime figure that IS load-marked.' },
  { robot_id: 2224, field_name: 'hot_swap', kasse: 'A', kilde: KILDER.MICRO_T1_PDF,
    caveat_wording: 'Equipped with high-density solid-state dual batteries and a modular quick-swap architecture, it supports hot-swappable battery replacement and provides external battery solutions.',
    caveat: "PDF datasheet ('MOVNEWT1 Product Datasheet', found via micbotics.com/support/), page 5. Not mentioned in the structured specification table on the product page (the source for the other fields) - only in the datasheet's prose section on battery architecture." },
  { robot_id: 2224, field_name: 'docking_station', kasse: 'A', kilde: [KILDER.MICRO_T1_EN, KILDER.MICRO_T1_CN],
    caveat_wording: 'Charging Station: Fast Charge | 充电桩 | 快充',
    caveat: "The row is called 'Charging Station: Fast Charge' (Chinese: label 充电桩, value 快充). Confirms a charging station exists, but does NOT confirm autonomous return-home/self-charging - unlike GENISOM L2's explicit claim (including autonomous recharge function). Interpreted as 'yes, a charging station exists', not as 'yes, with self-driving recharge'." },
  { robot_id: 2224, field_name: 'lidar', kasse: 'A', kilde: KILDER.MICRO_T1_EN,
    caveat_wording: 'Onboard LiDAR',
    caveat: "The source marks only 'Onboard LiDAR' with a filled circle (present), with no model or line count. Type without model - does not count under D4 when that setting is selected." },
  { robot_id: 2224, field_name: 'cameras', kasse: 'A', kilde: KILDER.MICRO_T1_EN,
    caveat_wording: 'HD Depth Camera | 360° Panoramic Vision | Ultrasonic Radar',
    caveat: 'Ultrasonic Radar is strictly speaking not a camera, but the schema has no separate radar field under sensing - listed here so the information is not lost.' },
  { robot_id: 2224, field_name: 'autonomy_level', kasse: 'A', kilde: KILDER.MICRO_T1_EN,
    caveat_wording: 'NeuroFuse Multi-Modal Perception System and CogniDecide AI Decision Engine, the product forms an intelligent system with high-performance environmental perception and real-time response capabilities. It fully covers functional modules including environmental perception, task planning, knowledge reasoning, and human-robot interaction.',
    caveat: "Qualitative description of the manufacturer's own system names, not a level on a scale." },
  { robot_id: 2224, field_name: 'mounting_interface', kasse: 'A', kilde: KILDER.MICRO_T1_PDF,
    caveat_wording: 'Top Mount Expansion | Undercarriage Expansion',
    caveat: "PDF datasheet, page 8 ('Parameter Information'), 'Functionality' section: the rows 'Top Mount Expansion' and 'Undercarriage Expansion' are both marked with a dot (present), with no further specification of interface standard, dimensions, or load capacity." },
  { robot_id: 2224, field_name: 'power_output', kasse: 'A', kilde: KILDER.MICRO_T1_PDF,
    caveat_wording: 'Featuring automotive-grade power output standards (supporting AC220V / 12V DC OUTLET dual-mode), it is compatible with multi-scenario devices via a quick interface matrix. | 12V DC OUTLET - 10A maximum, compliant with ISO 4165.',
    caveat: 'PDF datasheet, page 5, with footnotes on regional AC voltage tolerances (220V ±7% in China/Southeast Asia per GB/T 12325-2008; 120V/240V in North America; nominal 230V ±10% in EU, practically compatible with 220V). Wattage for the AC side is not explicitly disclosed (voltage only); the 12V side yields 120W at 10A, but the manufacturer does not itself state this calculated figure, so only the printed A/V values are reproduced.' },

  // ===================================================== XIAOMI CyberDog 1 (2249) ===
  { robot_id: 2249, field_name: 'weight', kasse: 'A', kilde: KILDER.XIAOMI_CD1_SPEC_JS,
    caveat_wording: '整机重量（含电池）：14kg',
    caveat: "Manufacturer's label: whole-machine weight, including battery." },
  { robot_id: 2249, field_name: 'height', kasse: 'A', kilde: KILDER.XIAOMI_CD1_SPEC_JS,
    caveat_wording: '长度：807mm | 宽度：406mm | 高度：206mm',
    caveat: 'The LYING-position (趴下) measurement is also disclosed: 807 x 406 x 206mm. This is a different state than folded and is not comparable to Unitree\'s folded measurement. The schema has no folded-measurement fields.' },
  { robot_id: 2249, field_name: 'degrees_of_freedom', kasse: 'A', kilde: KILDER.XIAOMI_CD1_SPEC_JS,
    caveat_wording: '自由度：整机12，单腿3',
    caveat: 'Manufacturer states 12 in total, 3 per leg.' },
  { robot_id: 2249, field_name: 'payload_walking', kasse: 'A', kilde: KILDER.XIAOMI_CD1_SPEC_JS,
    caveat_wording: '最大负载：3kg',
    caveat: "Manufacturer's label is maximum load, undivided, with no distinction between walking and standing. Placement in the walking field is an inference, exactly as for CyberDog 2." },
  { robot_id: 2249, field_name: 'speed', kasse: 'A', kilde: KILDER.XIAOMI_CD1_SPEC_JS,
    caveat_wording: 'MAX 3.2m/s | 实验室测得整机最大行走速度为3.2m/s，最大安全行走速度为1.6m/s',
    caveat: 'Manufacturer writes MAX 3.2m/s. The footnote on the same page: the lab-measured maximum walking speed is 3.2 m/s, while the maximum SAFE walking speed is 1.6 m/s. Two figures on the same page, half of each other. The printed headline figure is 3.2.' },
  { robot_id: 2249, field_name: 'temperature_min', kasse: 'A', kilde: KILDER.XIAOMI_CD1_SPEC_JS,
    caveat_wording: '温度：0℃~40℃',
    caveat: '0 degrees is a disclosed lower bound, not a missing figure. For outdoor Danish winter operation it is a disqualifier.' },
  { robot_id: 2249, field_name: 'battery_wh', kasse: 'A', kilde: KILDER.XIAOMI_CD1_SPEC_JS,
    caveat_wording: '标称容量：5.6Ah  120.9Wh | 标称电压：21.6V | 额定容量：5.2Ah  112.3Wh',
    caveat: "NOMINAL capacity: 5.6Ah / 120.9Wh at 21.6V. Cross-check: 5.6 x 21.6 = 120.96 - the manufacturer's figure works out. The manufacturer ALSO discloses a rated capacity of 5.2Ah / 112.3Wh. The two are 7.1% apart, and that is the manufacturer's own difference, not an error." },
  { robot_id: 2249, field_name: 'runtime', kasse: 'A', kilde: KILDER.XIAOMI_CD1_SPEC_JS,
    caveat_wording: '续航时间：约1小时* | *1小时是包括趴下、起立、静止姿态展示、常规地面稳定行走等基础行为综合测得',
    caveat: 'NO LOAD CONDITION, BUT A STATE CONDITION. Manufacturer\'s footnote: the one hour is measured as a composite of lying down, standing up, displaying static poses, and stable regular-ground walking. The schema has no room for that kind of condition.' },
  { robot_id: 2249, field_name: 'lidar', kasse: 'A', kilde: KILDER.XIAOMI_CD1_SPEC_JS,
    caveat_wording: '光流计',
    caveat: 'NO LIDAR MENTIONED. The manufacturer\'s sensor list has twelve items and none of them is a LiDAR: RealSense D450 depth camera, AI interaction camera, binocular ultra-wide-angle camera, TOF sensor, light sensor, ultrasonic sensor, IMU, GPS module, magnetometer, optical flow sensor (光流计), 6-mic ring array, and touch sensor. The field is not marked as "no", because the manufacturer does not declare the list exhaustive - but the absence is itself informative.' },
  { robot_id: 2249, field_name: 'ros2', kasse: 'A', kilde: KILDER.XIAOMI_CD1_SPEC_JS,
    caveat_wording: 'Ubuntu 18.04+ROS 2',
    caveat: 'Manufacturer writes Ubuntu 18.04+ROS 2. The ROS 2 version is not named.' },
  { robot_id: 2249, field_name: 'power_output', kasse: 'A', kilde: KILDER.XIAOMI_CD1_SPEC_JS,
    caveat_wording: 'AD100 | 输入参数：100-240V~ 50/60Hz 1.6A | 输出参数：20V⎓5A MAX | 外设扩展口',
    caveat: 'Manufacturer discloses the AD100 power supply: input 100-240V 50/60Hz 1.6A, output 20V 5A max. That is power IN to the robot, not power OUT to a payload. The Type-C port labeled peripheral expansion port has no disclosed wattage.' },
  { robot_id: 2249, field_name: 'data_ports', kasse: 'A', kilde: KILDER.XIAOMI_CD1_SPEC_JS,
    caveat_wording: 'Type-C×3(快充、下载、外设扩展口) | 802.11 a/b/n/g/ac | 蓝牙 4.2',
    caveat: "Manufacturer divides the three Type-C ports by function: fast-charge, download, and peripheral expansion port. Wireless: Wi-Fi IEEE 802.11 a/b/n/g/ac and Bluetooth 4.2 - an older Bluetooth than CyberDog 2's 5.0." },
  { robot_id: 2249, field_name: 'price', kasse: 'A', kilde: KILDER.XIAOMI_CD1_PROD_HTML,
    caveat_wording: '"product_id":"14815" | "price":"0","market_price":"0","is_enable":false',
    caveat: "The page's own product JSON says price 0, market_price 0 and is_enable false for product id 14815. A price of 0 for a product with is_enable false means NO PRICE SET, not costs zero. Exactly the same picture as CyberDog 2." },

  // ===================================================== XIAOMI CyberDog 2 (2250) ===
  { robot_id: 2250, field_name: 'weight', kasse: 'A', kilde: KILDER.XIAOMI_CD2_SPEC_JS,
    caveat_wording: '整机重量 (含电池)：8.9 ± 0.5kg',
    caveat: 'Manufacturer writes 8.9 +/- 0.5kg. The tolerance range is the manufacturer\'s own and must not be reduced to a bare 8.9 kg.' },
  { robot_id: 2250, field_name: 'height', kasse: 'A', kilde: KILDER.XIAOMI_CD2_SPEC_JS,
    caveat_wording: '长度：603mm | 宽度：339mm | 高度：300mm',
    caveat: "Manufacturer also discloses a LYING-position measurement: 603 x 339 x 300mm. This is a different state than folded and is not comparable to Unitree's folded measurement. The schema nonetheless has no folded-measurement fields." },
  { robot_id: 2250, field_name: 'degrees_of_freedom', kasse: 'A', kilde: KILDER.XIAOMI_CD2_SPEC_JS,
    caveat_wording: '整机12个自由度，单腿3个自由度',
    caveat: 'Manufacturer states 12 degrees of freedom in total, 3 per leg.' },
  { robot_id: 2250, field_name: 'payload_walking', kasse: 'A', kilde: KILDER.XIAOMI_CD2_SPEC_JS,
    caveat_wording: '最大负载：1kg',
    caveat: "Manufacturer's label is maximum load - undivided, no distinction between walking and standing. The placement is an inference." },
  { robot_id: 2250, field_name: 'speed', kasse: 'A', kilde: KILDER.XIAOMI_CD2_SPEC_JS,
    caveat_wording: '1.6m/s',
    caveat: "Manufacturer's label: maximum speed in the FORWARD direction." },
  { robot_id: 2250, field_name: 'temperature_min', kasse: 'A', kilde: KILDER.XIAOMI_CD2_SPEC_JS,
    caveat_wording: '0°C~40°C',
    caveat: '0 degrees is a disclosed lower bound, not a missing figure. For outdoor Danish winter operation it is a disqualifier.' },
  { robot_id: 2250, field_name: 'battery_wh', kasse: 'A', kilde: KILDER.XIAOMI_CD2_SPEC_JS,
    caveat_wording: '4500mAh 97.2Wh',
    caveat: '4500 mAh, nominal voltage 21.6V, charge limit 24.9V. Cross-check: 4.5Ah x 21.6V = 97.2Wh - the manufacturer\'s own figure works out precisely.' },
  { robot_id: 2250, field_name: 'runtime', kasse: 'A', kilde: KILDER.XIAOMI_CD2_SPEC_JS,
    caveat_wording: '约90分钟 | 90 分钟续航是包括趴下、站立、静止姿态展示、常规地面稳定行走等基础行为综合测得。',
    caveat: 'NO LOAD CONDITION, BUT A STATE CONDITION - and an unusually honest one. Manufacturer\'s footnote: the 90 minutes are measured as a composite of lying down, standing, displaying static poses, and stable regular-ground walking. That is more than any other manufacturer in the collection discloses, and the schema has no room for it.' },
  { robot_id: 2250, field_name: 'lidar', kasse: 'A', kilde: KILDER.XIAOMI_CD2_SPEC_JS,
    caveat_wording: 'YDLIDAR TG30',
    caveat: 'TYPE AND MODEL - one of few entries in the whole collection that names the LiDAR. The field counts regardless of which way D4 falls.' },
  { robot_id: 2250, field_name: 'ros2', kasse: 'A', kilde: KILDER.XIAOMI_CD2_SPEC_JS,
    caveat_wording: 'Ubuntu 18.04 + ROS2',
    caveat: 'Manufacturer writes Ubuntu 18.04 + ROS2. The ROS 2 version is not named.' },
  { robot_id: 2250, field_name: 'power_output', kasse: 'A', kilde: KILDER.XIAOMI_CD2_SPEC_JS,
    caveat_wording: 'MDY-13-EU | 输入参数:100-240V~50/60Hz 3.0A | 输出参数:20V 10.5A MAX',
    caveat: 'Manufacturer discloses the MDY-13-EU adapter: input 100-240V 50/60Hz 3.0A, output 20V 10.5A max. That is power IN to the robot, not power out to a payload.' },
  { robot_id: 2250, field_name: 'data_ports', kasse: 'A', kilde: KILDER.XIAOMI_CD2_SPEC_JS,
    caveat_wording: 'Wi-Fi：IEEE 802.11 a/b/g/n/ac | 蓝牙：5.0',
    caveat: 'Wireless: WiFi IEEE 802.11 a/b/g/n/ac and Bluetooth 5.0.' },
  { robot_id: 2250, field_name: 'price', kasse: 'A', kilde: KILDER.XIAOMI_CD2_PROD_HTML,
    caveat_wording: '"product_id":"19079" | "price":"0","market_price":"0","is_enable":false',
    caveat: 'The page\'s own product JSON says price 0, market_price 0 and is_enable false. The product is not purchasable on mi.com on the collection date. A price of 0 for a product with is_enable false means NO PRICE SET, not costs zero. Writing 0 into the field would be rule-10 error in its purest form.' },
  { robot_id: 2250, field_name: 'ce_disclosed', kasse: 'A', kilde: KILDER.XIAOMI_CD2_SPEC_JS,
    caveat_wording: 'GB 17625.1-2012 | GB 4943.1-2011 | GB/T 9254.1-2021 | GB31241-2014 | UN38.3',
    caveat: 'DOCUMENTED NO, not a gap. The manufacturer discloses its standards, and CE is not among them: GB 17625.1-2012, GB 4943.1-2011, GB/T 9254.1-2021, battery GB31241-2014 and UN38.3. Only Chinese GB standards. Whether a documented "no" COUNTS toward the specification density has not been decided - that is a question for JPK.' },
];

const APPLICATIONS = [
  // note = vores klassifikations-begrundelse (engelsk), note_wording ER I
  // KOLONNELISTEN IKKE (kun "note" er nævnt, ikke applications.note_wording
  // - se rapportens "Nye fælder og opdagelser"). note_wording røres derfor
  // IKKE, selvom den bærer samme dansk/kinesisk-blanding.
  { robot_id: 2189, kilde: KILDER.CVTE_PROD,
    note: "\"工业\" (industry) and \"电力\" (power/electricity) are both mapped to industrial, since this sentence does not itself use an inspection word (unlike the news article). \"救援\" (rescue) is mapped to defense and emergency response." },
  { robot_id: 2199, kilde: KILDER.GALILEO_PDF,
    note: "From the manual's page 4, BEFORE the model-specific technical parameter tables (pages 7-9). The text appears under the heading (the generic family name, the same name C1 itself carries) and does not name C1 specifically - it covers the whole C1/E1/S1 series as a product category. Our own translation: (security patrol) -> security and surveillance; (emergency response/anti-terror/explosive clearance) -> defense and emergency response; (security/intelligent inspection) -> inspection. The same quote is used independently on all six Galileo entries (C1/C1-W/E1/E1-W/S1/S1-W), NOT via inherited_from, because it is the family page that precedes the variant split - same principle as GENISOM Gangben L2-W's note about citing the shared source independently." },
  { robot_id: 2200, kilde: KILDER.GALILEO_PDF,
    note: "Identical quote and rationale as galileo-c1 - from the manual's shared page 4, before the variant split. Cited independently here, not via inherited_from, see galileo-c1's note." },
  { robot_id: 2201, kilde: KILDER.GALILEO_PDF,
    note: "Identical quote and rationale as galileo-c1 - from the manual's shared page 4, before the variant split. Cited independently here, not via inherited_from." },
  { robot_id: 2202, kilde: KILDER.GALILEO_PDF,
    note: "Identical quote and rationale as galileo-c1 - from the manual's shared page 4, before the variant split. Cited independently here, not via inherited_from." },
  { robot_id: 2203, kilde: KILDER.GALILEO_PDF,
    note: "Identical quote and rationale as galileo-c1 - from the manual's shared page 4, before the variant split. Cited independently here, not via inherited_from." },
  { robot_id: 2204, kilde: KILDER.GALILEO_PDF,
    note: "Identical quote and rationale as galileo-c1 - from the manual's shared page 4, before the variant split. Cited independently here, not via inherited_from." },
  { robot_id: 2223, kilde: KILDER.MICRO_P1_EN,
    note: "'industrial inspection' -> industrial + inspection; 'fire response' -> defense and emergency response; 'public safety missions' -> security and surveillance." },
  { robot_id: 2249, kilde: KILDER.XIAOMI_CD1_SPEC_JS,
    note: "READ THROUGH, NOTHING FOUND - also in the JS bundle, where the specifications live. The manufacturer's only label is the product type biomimetic quadruped robot and the model number 21051191C. That is what it IS, not who it is for. Same result as on CyberDog 2." },
  { robot_id: 2250, kilde: KILDER.XIAOMI_CD2_SPEC_JS,
    note: "READ THROUGH, NOTHING FOUND - also in the JS bundle, where the specifications live. The manufacturer's only label is the product type (biomimetic quadruped robot). That is what it IS, not who it is for." },
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
  { id: 2199, kilde: KILDER.GALILEO_PDF,
    notes: [
      "REAL PRODUCT, NOT JUST A RENDERING: the manual has full technical specification tables with figures and units for all six models, not just marketing text - the same standard as the rest of the catalog.",
      "HOT-SWAP FROM THE SHARED FEATURE PAGE (page 6), NOT FROM C1'S OWN TABLE: the manual's shared feature description (before the variant split) states a dual-mode energy-management system - autonomous charging + manual battery swap - with a modular hot-swap battery compartment, battery swap in a few seconds. This is NOT repeated in C1's own technical parameter table, which has only one autonomous-charging row and no hot-swap row - same caution principle as the applications field: cited independently from the family page, not from a model-specific table row.",
      "DOCKING STATION COMBINES TWO SOURCES: the model-specific table's autonomous-charging function (supported) AND the shared feature page's via-LiDAR-navigation, automatic docking with the charging station - the two confirm each other.",
    ],
    notes_wording: [
      '',
      "智能仿生四足机器人采用'自主充电+手动换电'双模能源管理系统...同时配备模块化热插拔电池仓，支持数秒完成电池更换 | 自主充电功能: 支持",
      '自主充电功能: 支持 | 通过激光雷达导航实现自动对接充电桩',
    ] },
  { id: 2200, kilde: KILDER.GALILEO_PDF,
    notes: [
      "RUNTIME WITHOUT A LOAD CONDITION: the runtime figure has no kg number.",
      "HOT-SWAP AND DOCKING STATION: same source and rationale as C1 - from the shared feature page (page 6) and the combination of table row + feature page, respectively.",
    ],
    notes_wording: ['续航时间: 2.5h～5h', ''] },
  { id: 2201, kilde: KILDER.GALILEO_PDF,
    notes: [
      "TABLE TERMINOLOGY FOR CLIMBING CAPABILITY: E1's table writes (30cm-high continuous stairs) -> stair_step_continuous. E1-W's corresponding row writes (forward height difference, 1m platform) -> obstacle_single on E1-W's own entry - same pattern as C1/C1-W.",
      "RUNTIME WITHOUT A LOAD CONDITION: the runtime figure has no kg number.",
      "HOT-SWAP AND DOCKING STATION: same source and rationale as C1.",
    ],
    notes_wording: ['30cm高连续台阶 | 正向高度差1m高台', '续航时间: 2h～4h', ''] },
  { id: 2202, kilde: KILDER.GALILEO_PDF,
    notes: [
      "TABLE TERMINOLOGY FOR CLIMBING CAPABILITY: -> obstacle_single (100cm), NOT stair_step_continuous - same pattern as C1-W.",
      "RUNTIME WITHOUT A LOAD CONDITION: the runtime figure has no kg number.",
      "HOT-SWAP AND DOCKING STATION: same source and rationale as C1.",
    ],
    notes_wording: ['可攀爬高度: 正向高度差1m高台', '续航时间: 1.5h～3h', ''] },
  { id: 2203, kilde: KILDER.GALILEO_PDF,
    notes: [
      "S1 IS THE ONLY GALILEO MODEL WITH BOTH CLIMBING FIELDS FILLED IN: the table writes - BOTH a continuous-stairs value AND a platform-height value in the same row, unlike C1/E1 (stair_step_continuous only) and C1-W/E1-W (obstacle_single only). Both fields are therefore filled in here: stair_step_continuous=25cm, obstacle_single=40cm.",
      "HOT-SWAP AND DOCKING STATION: same source and rationale as C1.",
    ],
    notes_wording: ['可攀爬高度: 25cm高连续台阶,正向高度差40cm高台', ''] },
  { id: 2204, kilde: KILDER.GALILEO_PDF,
    notes: [
      "HOT-SWAP AND DOCKING STATION: same source and rationale as C1.",
    ],
    notes_wording: [''] },
  { id: 2223, kilde: KILDER.MICRO_P1_EN,
    notes: [
      "The table's row order is confusing: 'Max Climbing Ability: 800 mm' appears right before 'Step Negotiation: 45°' and 'Slope Capability: >45°' - i.e. two rows with the same numeric value (45°) under two different labels, and a very large 800 mm value under a label ('Climbing Ability') one would normally expect to be an angle. Not silently corrected - see the caveats on obstacle_single and slope.",
    ],
    notes_wording: ['Max Climbing Ability: 800 mm | Step Negotiation: 45° | Slope Capability: >45°'] },
  // T1 (2224): notes_wording[2] RETTET - eksisterende DB-tekst havde "整机
  // 电机重量" (motor-vaegt); kilden (T1CN, bekraeftet 2x) skriver "整机电池
  // 重量" (batteri-vaegt). Samme slags enkelt-tegns-korruption som CJK-
  // opskriftens ・/• og 。/. fund - rettet her, IKKE flaget som L87-sletning,
  // fordi paastanden ER belagt, blot fejltransskriberet.
  { id: 2224, kilde: [KILDER.MICRO_T1_EN, KILDER.MICRO_T1_CN],
    notes: [
      "THE MANUFACTURER HAS CHANGED ITS NAME/DOMAIN. The domain used by the CEO's own materials and the press (microrobotech.com) redirects 301 to micbotics.com. The entire current site uses the brand name 'Micbot'/'MICBOT' (meta keywords, the page's title tags '...-MICBOT', navigation logo) - NOT 'MicroRoboTech'. The legal company name remains 杭州具微科技有限公司 (Hangzhou Juwei Technology), which 36Kr's project page translates as 'MicroRoboTech' (https://pitchhub.36kr.com/project/3401143382263687, retrieved 2026-08-24). The manufacturer field here retains the CEO's own naming 'MicroRoboTech', but the consumer-facing brand to look for going forward is 'Micbot'.",
      "The datasheet table is identical on the English (micbotics.com) and Chinese (micbotics.cn) sites - all 25+ rows cross-checked verbatim, 0 discrepancies. The English version is therefore used directly as the source without translation risk for the figures themselves.",
      "'Total Battery Weight: 40~50kg' / Chinese is an ambiguous label (conflates whole-machine weight with battery). Placed as own weight based on context (appears under 'Mechanical Parameters' together with the dimensions, not under 'Electrical Parameters'), but the wording is not unambiguous - see the caveat on the field.",
      "No price found on either language version - only 'Buy Now'/'Get Solutions' contact buttons, no printed figure.",
    ],
    notes_wording: [
      'Micbot | MICBOT | 杭州具微科技有限公司',
      '',
      'Total Battery Weight: 40~50kg | 整机电池重量 | 电池',
      '',
    ] },
  { id: 2249, kilde: [KILDER.XIAOMI_CD1_PROD_HTML, KILDER.XIAOMI_CD2_SPEC_JS],
    notes: [
      "SAME TRAP AS CYBERDOG 2, SAME SOLUTION. The specification page delivers an empty content element; the entire sheet lives as plain text in a JavaScript bundle, which the page itself tells the browser to fetch: https://cdn.cnbj1.fds.api.mi-img.com/mi.com-assets/shop/pro/js/product/cyberdog/specs.5406502c.js (retrieved 2026-08-21). Primary source: the manufacturer's own server, the manufacturer's own content.",
      "STATUS IS A CATALOG DECISION BASED ON MEASURED SIMILARITY, NOT A STATEMENT FROM THE MANUFACTURER. Six signals were compared between CyberDog 1 and CyberDog 2 on mi.com: HTTP status on the product page (200 vs 200), the 'buy now' button ('立即购买', 2 occurrences vs 2), the 'add to cart' button ('加入购物车', 0 occurrences vs 0), the 'sold out' marker ('已售罄', 0 vs 0), the price field in the page's product JSON (0 vs 0), and is_enable (false vs false). All six are identical. There is therefore NO measurable difference on the manufacturer's page between the model we carry as in-production and this one. The only argument for discontinued is that a successor with a higher generation number exists - and that is our own inference, not Xiaomi's word.",
      "NO LIDAR IN THE SENSOR LIST. The manufacturer lists twelve sensors, and a LiDAR is not among them. This is NOT recorded as 'no', because the list is not declared exhaustive. By comparison, CyberDog 2 names a YDLIDAR TG30. See the caveat on the lidar field.",
      "THE DEPTH CAMERA IS DIFFERENT FROM CYBERDOG 2'S: here Intel RealSense D450, there D430.",
    ],
    notes_wording: ['', '立即购买', '', ''] },
  { id: 2250, kilde: KILDER.XIAOMI_CD2_SPEC_JS,
    notes: [
      "THE SPECIFICATIONS ARE TEXT, NOT IMAGES - but they are not in the page's HTML. The parameter page's content element is empty on delivery (75 bytes, only a loading spinner); the entire specification sheet lives as plain text in the JavaScript bundle the page itself tells the browser to fetch: https://cdn.cnbj1.fds.api.mi-img.com/mi.com-assets/shop/pro/js/product/cyberdog2/specs.74df51bf.js (saved, 200, 109,869 bytes). Treated as the primary source: the manufacturer's own server, the manufacturer's own content, and the text a visitor is actually shown.",
    ],
    notes_wording: [''] },
];

const VALUE_TEXT = [
  { robot_id: 2189, field_name: 'cameras', kilde: KILDER.CVTE_NEWS,
    value_text: 'Dual-spectrum visible-light + infrared pan-tilt camera, model not disclosed' },
  // Galileo: lidar/compute/autonomy_level identiske paa tvaers af alle 6 (PDF-familiesiden).
  { robot_id: 2199, field_name: 'lidar', kilde: KILDER.GALILEO_PDF, value_text: 'LiDAR, detection range 40m - no model/type disclosed' },
  { robot_id: 2199, field_name: 'compute', kilde: KILDER.GALILEO_PDF, value_text: 'X86 or domestic Chinese ARM, low power consumption, high performance' },
  { robot_id: 2199, field_name: 'autonomy_level', kilde: KILDER.GALILEO_PDF, value_text: 'Autonomous charging, supported; voice interaction, optional' },
  { robot_id: 2199, field_name: 'power_output', kilde: KILDER.GALILEO_PDF, value_text: '5V; 12V; 24V (external power outlets, wattage not disclosed)' },
  { robot_id: 2200, field_name: 'lidar', kilde: KILDER.GALILEO_PDF, value_text: 'LiDAR, detection range 40m - no model/type disclosed' },
  { robot_id: 2200, field_name: 'compute', kilde: KILDER.GALILEO_PDF, value_text: 'X86 or domestic Chinese ARM, low power consumption, high performance' },
  { robot_id: 2200, field_name: 'autonomy_level', kilde: KILDER.GALILEO_PDF, value_text: 'Autonomous charging, supported; voice interaction, optional' },
  { robot_id: 2200, field_name: 'power_output', kilde: KILDER.GALILEO_PDF, value_text: '5V; 12V; 24V (external power outlets, wattage not disclosed)' },
  { robot_id: 2201, field_name: 'lidar', kilde: KILDER.GALILEO_PDF, value_text: 'LiDAR, detection range 40m - no model/type disclosed' },
  { robot_id: 2201, field_name: 'compute', kilde: KILDER.GALILEO_PDF, value_text: 'X86 or domestic Chinese ARM, low power consumption, high performance' },
  { robot_id: 2201, field_name: 'autonomy_level', kilde: KILDER.GALILEO_PDF, value_text: 'Autonomous charging, supported; voice interaction, optional' },
  { robot_id: 2201, field_name: 'power_output', kilde: KILDER.GALILEO_PDF, value_text: '5V; 12V; 48V (external power outlets, wattage not disclosed)' },
  { robot_id: 2202, field_name: 'lidar', kilde: KILDER.GALILEO_PDF, value_text: 'LiDAR, detection range 40m - no model/type disclosed' },
  { robot_id: 2202, field_name: 'compute', kilde: KILDER.GALILEO_PDF, value_text: 'X86 or domestic Chinese ARM, low power consumption, high performance' },
  { robot_id: 2202, field_name: 'autonomy_level', kilde: KILDER.GALILEO_PDF, value_text: 'Autonomous charging, supported; voice interaction, optional' },
  { robot_id: 2203, field_name: 'lidar', kilde: KILDER.GALILEO_PDF, value_text: 'LiDAR, detection range 40m - no model/type disclosed' },
  { robot_id: 2203, field_name: 'compute', kilde: KILDER.GALILEO_PDF, value_text: 'X86 or domestic Chinese ARM, low power consumption, high performance' },
  { robot_id: 2203, field_name: 'autonomy_level', kilde: KILDER.GALILEO_PDF, value_text: 'Autonomous charging, supported; voice interaction, optional' },
  { robot_id: 2203, field_name: 'power_output', kilde: KILDER.GALILEO_PDF, value_text: '5V; 12V; 24V (external power outlets, wattage not disclosed)' },
  { robot_id: 2204, field_name: 'lidar', kilde: KILDER.GALILEO_PDF, value_text: 'LiDAR, detection range 40m - no model/type disclosed' },
  { robot_id: 2204, field_name: 'compute', kilde: KILDER.GALILEO_PDF, value_text: 'X86 or domestic Chinese ARM, low power consumption, high performance' },
  { robot_id: 2204, field_name: 'autonomy_level', kilde: KILDER.GALILEO_PDF, value_text: 'Autonomous charging, supported; voice interaction, optional' },
  { robot_id: 2204, field_name: 'power_output', kilde: KILDER.GALILEO_PDF, value_text: '5V; 12V; 24V (external power outlets, wattage not disclosed)' },
  // Microrobotech: kun de vaerdier der FAKTISK er danske (cameras/compute/
  // autonomy_level er allerede rent engelsk paa flere af raekkerne - IKKE
  // oversat, for at undgaa at "oversaette" et allerede-korrekt engelsk svar).
  { robot_id: 2223, field_name: 'lidar', kilde: KILDER.MICRO_P1_EN, value_text: '96-line automotive-grade LiDAR (supports up to 3 units)' },
  { robot_id: 2223, field_name: 'compute', kilde: KILDER.MICRO_P1_EN, value_text: 'Supports up to 2000 TOPS' },
  { robot_id: 2223, field_name: 'autonomy_level', kilde: KILDER.MICRO_P1_PDF, value_text: 'Multi-sensor fusion perception system + high-computing power platform, forming a 360° omnidirectional situational-awareness network covering environmental perception, monitoring, and knowledge reasoning.' },
  { robot_id: 2223, field_name: 'mounting_interface', kilde: KILDER.MICRO_P1_PDF, value_text: "'Expansion Rails' marked as a standard feature in the datasheet's function table (page 4, 'Function Configuration'). No standardized mounting-interface name, dimensions, or quick-release mechanism disclosed." },
  { robot_id: 2224, field_name: 'lidar', kilde: KILDER.MICRO_T1_EN, value_text: 'Onboard LiDAR (model not disclosed)' },
  { robot_id: 2224, field_name: 'mounting_interface', kilde: KILDER.MICRO_T1_PDF, value_text: "Top-mounted expansion interface ('Top Mount Expansion') and undercarriage expansion interface ('Undercarriage Expansion'), both marked as a standard feature in the datasheet's function table. No standardized mounting-interface name, dimensions, or quick-release mechanism disclosed." },
  { robot_id: 2224, field_name: 'power_output', kilde: KILDER.MICRO_T1_PDF, value_text: "AC220V / 12V DC OUTLET (dual-mode, automotive-grade power-output standard, via 'quick interface matrix'). 12V DC OUTLET: 10A max (ISO 4165). AC side: 220V ±7% in China/Southeast Asia (GB/T 12325-2008); 120V/240V in North America; nominal 230V ±10% in EU (practically compatible with 220V)." },
  { robot_id: 2249, field_name: 'cameras', kilde: KILDER.XIAOMI_CD1_SPEC_JS, value_text: 'Intel RealSense D450 (depth) x1; AI interaction camera 13 MP x1; binocular ultra-wide-angle camera 2 MP' },
  { robot_id: 2249, field_name: 'compute', kilde: KILDER.XIAOMI_CD1_SPEC_JS, value_text: '6-core NVIDIA Carmel ARM v8.2 64-bit CPU; 384-core NVIDIA Volta GPU with 48 Tensor Cores; 8 GB 128-bit LPDDR4x; 16 GB eMMC 5.1; 128 GB SSD' },
  { robot_id: 2250, field_name: 'cameras', kilde: KILDER.XIAOMI_CD2_SPEC_JS, value_text: 'Intel RealSense D430 (depth); 13 MP (AI); 1 MP (RGB); fisheye FOV 146 degrees' },
  { robot_id: 2250, field_name: 'compute', kilde: KILDER.XIAOMI_CD2_SPEC_JS, value_text: '6-core NVIDIA Carmel ARM v8.2 64-bit; 384-core Volta GPU with 48 Tensor Cores; 8 GB LPDDR4x; 16 GB eMMC 5.1; 32 GB SD Class 10' },
];

// images.note — kun rækker med indhold.
const IMAGES = [
  { robot_id: 2199, kilde: KILDER.GALILEO_PDF,
    note: "Shared photo: the PDF manual's product gallery shows the same body variant (without the top sensor module) for both C1 and E1 - the manual does not distinguish between them in the image selection. S1 has a visible extra sensor module on its back and therefore gets its own photo (see galileo-s1.yaml)." },
  { robot_id: 2200, kilde: KILDER.GALILEO_PDF,
    note: "Shared photo: the PDF manual's product gallery shows the same wheel-legged body variant (without the top sensor module) for both C1-W and E1-W - the manual does not distinguish between them in the image selection. S1-W has the same extra sensor module as S1 and gets its own photo (see galileo-s1-w.yaml)." },
  { robot_id: 2201, kilde: KILDER.GALILEO_PDF,
    note: "Shared photo: the PDF manual's product gallery shows the same body variant (without the top sensor module) for both C1 and E1 - the manual does not distinguish between them in the image selection. S1 has a visible extra sensor module on its back and therefore gets its own photo (see galileo-s1.yaml)." },
  { robot_id: 2202, kilde: KILDER.GALILEO_PDF,
    note: "Shared photo: the PDF manual's product gallery shows the same wheel-legged body variant (without the top sensor module) for both C1-W and E1-W - the manual does not distinguish between them in the image selection. S1-W has the same extra sensor module as S1 and gets its own photo (see galileo-s1-w.yaml)." },
  { robot_id: 2203, kilde: KILDER.GALILEO_PDF,
    note: "S1 is the only walking variant with an extra cylindrical sensor module on its back in the PDF manual's product gallery - consistent with S1's own data (the only model with both climbing fields filled in and an explicitly load-conditioned runtime, see the fields' notes)." },
  { robot_id: 2204, kilde: KILDER.GALILEO_PDF,
    note: "S1-W is the only wheel-legged variant with the same extra sensor module as S1 in the PDF manual's product gallery - consistent with S1-W's own data (both climbing fields filled in and an explicitly load-conditioned runtime)." },
];

/* ------------------------------------------------------ kilde-verifikation */

function verificerAlt() {
  let fejl = 0;
  let tjekket = 0;
  let sprunget = 0;
  const UVERIFICERBARE = new Set([KILDER.GALILEO_PDF, KILDER.MICRO_P1_PDF, KILDER.MICRO_T1_PDF]);
  for (const r of FIELD_ENTRIES) {
    if (r.kasse === 'L87-SLET') continue;
    const kilder = Array.isArray(r.kilde) ? r.kilde : [r.kilde];
    if (kilder.some((k) => UVERIFICERBARE.has(k))) {
      // Se GALILEO_PDF-NOTE/MICRO_*_PDF-NOTE ovenfor: ingen paalidelig
      // automatisk verifikation mulig for disse kilder. Verificeret
      // manuelt/strukturelt i stedet (rapport).
      sprunget += fragmenter(r.caveat_wording).length;
      continue;
    }
    for (const frag of fragmenter(r.caveat_wording)) {
      tjekket++;
      const resultater = kilder.map((k) => verificerFragment(frag, k));
      if (!resultater.some((v) => v.ok)) {
        fejl++;
        console.error(`FEJL field_entries ${r.robot_id}/${r.field_name}: "${frag}" — fundet i ingen af kilderne (${kilder.join(', ')})`);
      }
    }
  }
  for (const rn of ROBOTS_NOTES) {
    const kilder = Array.isArray(rn.kilde) ? rn.kilde : [rn.kilde];
    if (kilder.includes(KILDER.GALILEO_PDF)) {
      sprunget += (rn.notes_wording || []).reduce((n, w) => n + fragmenter(w).length, 0);
      continue;
    }
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
  console.log(`Kildeverifikation: ${tjekket} fragmenter tjekket automatisk, ${sprunget} sprunget over (GALILEO_PDF, verificeret manuelt - se rapport), ${fejl} fejl.`);
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
  const robotterArg = args.find((a) => a.startsWith('--robotter='));
  const kunRobotter = robotterArg ? new Set(robotterArg.slice('--robotter='.length).split(',').map(Number)) : null;
  const filtrer = (liste, felt = 'robot_id') => kunRobotter ? liste.filter((x) => kunRobotter.has(x[felt])) : liste;

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

  for (const r of filtrer(FIELD_ENTRIES)) {
    const body = r.kasse === 'L87-SLET'
      ? { caveat: null, caveat_wording: null, caveat_class: null, collected_by: 'spor/f2-galileo', change_reason: r.change_reason || 'L87: paastand uden belaeg i raakilden, slettet' }
      : { caveat: r.caveat, caveat_wording: r.caveat_wording, collected_by: 'spor/f2-galileo', change_reason: `fase 2: ordret kildeordlyd renset for dansk (kasse ${r.kasse})` };
    const url = `${U}/rest/v1/field_entries?robot_id=eq.${r.robot_id}&field_name=eq.${r.field_name}`;
    const ok = await patchEen(url, body, H, `field_entries ${r.robot_id}/${r.field_name} [kasse ${r.kasse}]`, skriv, t);
    if (!ok) return;
  }

  for (const a of filtrer(APPLICATIONS)) {
    const body = { note: a.note, collected_by: 'spor/f2-galileo', change_reason: 'fase 2: applications.note oversat til engelsk' };
    const url = `${U}/rest/v1/applications?robot_id=eq.${a.robot_id}`;
    const ok = await patchEen(url, body, H, `applications ${a.robot_id}.note`, skriv, t);
    if (!ok) return;
  }

  for (const rn of filtrer(ROBOTS_NOTES, 'id')) {
    const body = { notes: rn.notes, notes_wording: rn.notes_wording, collected_by: 'spor/f2-galileo', change_reason: 'fase 2: robots.notes oversat, notes_wording renset for dansk' };
    const url = `${U}/rest/v1/robots?id=eq.${rn.id}`;
    const ok = await patchEen(url, body, H, `robots ${rn.id}.notes + notes_wording`, skriv, t);
    if (!ok) return;
  }

  for (const v of filtrer(VALUE_TEXT)) {
    const body = { value_text: v.value_text, collected_by: 'spor/f2-galileo', change_reason: 'fase 2/L87: value_text oversat til engelsk (betydning, ikke ordret)' };
    const url = `${U}/rest/v1/field_entries?robot_id=eq.${v.robot_id}&field_name=eq.${v.field_name}`;
    const ok = await patchEen(url, body, H, `field_entries ${v.robot_id}/${v.field_name}.value_text`, skriv, t);
    if (!ok) return;
  }

  for (const im of filtrer(IMAGES)) {
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
