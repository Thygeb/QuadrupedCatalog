#!/usr/bin/env node
/**
 * db/f2-cjk-skriv.mjs — spor/f2-cjk's skriveredskab (ejet af dette spor
 * alene). Renser caveat/caveat_wording for robot_id 2186 og 2258 i
 * field_entries, note for applications, og notes/notes_wording for robots.
 *
 * Reglen (BRIEF-f2-cjk.md punkt 3): caveat_wording/notes_wording bærer
 * KUN kildens tegn — ingen oversættelse, ingen dansk parentes, ingen
 * omsluttende anførselstegn ud over dem, der markerer flere adskilte
 * kildefragmenter. Al dansk (oversættelse + kommentar) flytter til den
 * engelske "caveat"/"note"-prosa.
 *
 * FØR nogen PATCH køres, tjekker --verificer (og hver --toerloeb/--skriv-
 * kørsel automatisk) hvert wording-fragment som en BOGSTAVELIG delstreng
 * af den relevante rå kildefil i media/_kilder/ — så en forvansket
 * kopiering af en tidligere agents CJK-tekst ikke glider igennem. To
 * korruptioner blev fundet og rettet på netop denne måde, se rapporten:
 * "・" (U+30FB) var blevet til "•" (U+2022) i robots.notes_wording[1], og
 * "。" (U+3002) var blevet til "." (U+2E) i robots.notes_wording[2].
 *
 * Brug:
 *   node db/f2-cjk-skriv.mjs --verificer     Kun kildetjek, ingen netværk mod DB.
 *   node db/f2-cjk-skriv.mjs --toerloeb      Standard: viser hvad der VILLE ske.
 *   node db/f2-cjk-skriv.mjs --skriv         Skriver rent faktisk, én PATCH pr. post.
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

const ASTRALL = 'raa-kand2-2026-08-24/astralldynamics-hypertron-t01-produktside-2026-08-24.html';
const YUFAN_SHOP = 'raa-kand2-2026-08-24/yufan-uniubi-shop-cyvet-2026-08-24.html';
const YUFAN_FORSIDE = 'raa-kand2-2026-08-24/yufan-uniubi-forside-2026-08-24.html';
const ROS2_README = 'raa-pdf-2026-08-24/github-uniubi_ros2-README.md';
const ROBOTS_JSON = 'raa-pdf-2026-08-24/github-uniubi_robot_description-robots.json';

const kildeCache = new Map();
function laesKilde(rel) {
  if (kildeCache.has(rel)) return kildeCache.get(rel);
  const fuld = path.join(KILDE_MAPPE, rel);
  const indhold = fs.existsSync(fuld) ? fs.readFileSync(fuld, 'utf8') : null;
  kildeCache.set(rel, indhold);
  return indhold;
}

/** Splitter et wording-felt i sine kildefragmenter: segmenter i "..." er
 *  citater der skal findes ORDRET i kilden; tekst uden for anførselstegn
 *  (kun brugt til "label værdi"-formen) skal OGSÅ findes ordret. */
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

/** Kildens HTML-tabeller lægger typisk etiket og værdi i TO adskilte
 *  <td>-celler — konkateneret med ét mellemrum (samme konvention den
 *  oprindelige dataindsamler brugte), ikke bogstaveligt sammenhængende
 *  tekst i kilden. Et fragment kan desuden bære "..." som en BEVIDST
 *  udeladelsesmarkør (citations-konvention, samme som resten af
 *  datasættet allerede bruger) — det tegn findes naturligvis ikke i
 *  kilden, så delene FØR og EFTER hver "..." tjekkes hver for sig.
 *  Prøv derfor: (1) hele fragmentet, (2) split på "...", (3) split på
 *  første mellemrum (etiket+værdi) — første der lykkes vinder. */
function verificerFragment(fragment, kildeRel) {
  const indhold = laesKilde(kildeRel);
  if (indhold === null) return { ok: false, grund: `kildefil mangler: ${kildeRel}` };
  if (indhold.includes(fragment)) return { ok: true };

  if (fragment.includes('...')) {
    const dele = fragment.split('...').map((d) => d.trim()).filter(Boolean);
    if (dele.length > 0 && dele.every((d) => indhold.includes(d))) {
      return { ok: true, ellipse: true };
    }
    return { ok: false, grund: `IKKE fundet (deltjek omkring "..." fejlede) i ${kildeRel}` };
  }

  const i = fragment.indexOf(' ');
  if (i > 0) {
    const etiket = fragment.slice(0, i);
    const vaerdi = fragment.slice(i + 1);
    if (indhold.includes(etiket) && indhold.includes(vaerdi)) {
      return { ok: true, split: true };
    }
  }
  return { ok: false, grund: `IKKE fundet ordret (heller ikke split paa etiket+vaerdi) i ${kildeRel}` };
}

/* ------------------------------------------------------------------ data */
// KASSE: 'A' = ordlyd fandtes, forurenet · 'C' = ordlyd konstrueret fra kilden
// (fandtes ikke foer) · 'D' = urort, ingen skrivning for denne raekke.

const FIELD_ENTRIES = [
  // ---------------------------------------------------------- 2186 -----
  { robot_id: 2186, field_name: 'weight', kasse: 'A', kilde: ASTRALL,
    caveat_wording: '重量 82kg（含电池）',
    caveat: "Manufacturer's figure includes the battery." },
  { robot_id: 2186, field_name: 'length', kasse: 'A', kilde: ASTRALL,
    caveat_wording: '站立尺寸 1110mm*610mm*745mm',
    caveat: 'Standing measurement.' },
  { robot_id: 2186, field_name: 'height', kasse: 'C', kilde: ASTRALL,
    caveat_wording: '俯卧尺寸 1130mm*755mm*320mm',
    caveat: 'The prone (lying-down) measurement 1130x755x320mm is also disclosed — see notes.' },
  { robot_id: 2186, field_name: 'payload_walking', kasse: 'A', kilde: ASTRALL,
    caveat_wording: '工作负载 ≤80kg',
    caveat: 'Operating load.' },
  { robot_id: 2186, field_name: 'payload_standing', kasse: 'A', kilde: ASTRALL,
    caveat_wording: '最大站立负载 200kg',
    caveat: 'Maximum standing load.' },
  { robot_id: 2186, field_name: 'speed', kasse: 'A', kilde: ASTRALL,
    caveat_wording: '"最高速度 7 m/s（1）" "（1）该数据来自实验环境下，实际应用中有所限速"',
    caveat: "Per the manufacturer's own footnote, the figure is from a laboratory test environment; real-world use may be speed-limited." },
  { robot_id: 2186, field_name: 'slope', kasse: 'A', kilde: ASTRALL,
    caveat_wording: '最大越障角度',
    caveat: "The manufacturer's label is 'maximum obstacle-crossing/traversal angle', not simply an incline rating — noted here because slope is the closest schema field." },
  { robot_id: 2186, field_name: 'obstacle_single', kasse: 'A', kilde: ASTRALL,
    caveat_wording: '最大越障攀爬高度 90cm',
    caveat: 'Maximum single-obstacle climb height.' },
  { robot_id: 2186, field_name: 'stair_step_continuous', kasse: 'A', kilde: ASTRALL,
    caveat_wording: '连续爬梯高度 20~25 cm',
    caveat: 'Continuous stair-climbing height.' },
  // ip_rating (2186) er KASSE D — bevidst UDELADT fra denne liste, skal ikke skrives.
  { robot_id: 2186, field_name: 'temperature_max', kasse: 'A', kilde: ASTRALL,
    caveat_wording: '工作温度 -20℃~55℃',
    caveat: 'Operating temperature. Storage temperature -20~60°C is stated separately — see notes.' },
  { robot_id: 2186, field_name: 'runtime', kasse: 'A', kilde: ASTRALL,
    caveat_wording: '续航时间 4~8小时 (有负载/空载)',
    caveat: "Loaded/unloaded. The manufacturer's page does not explicitly tie the 4 hours to a specific kg figure; we do not assume it is the 80kg from the operating-load field, so the load condition is stated as not disclosed rather than inventing the link." },
  { robot_id: 2186, field_name: 'docking_station', kasse: 'A', kilde: ASTRALL,
    caveat_wording: '"消防应急" "全自主 高精度自主导航、全自主充电"',
    caveat: "Under the fire/emergency-response use-case tab: fully autonomous — high-precision autonomous navigation, fully autonomous charging. The word 'docking' / '充电桩' (charging station/pile) does not appear verbatim; '全自主充电' (fully autonomous charging) is interpreted here as a charging/docking function. Appears in the product page's use-case section, not in the parameters table itself." },
  { robot_id: 2186, field_name: 'lidar', kasse: 'A', kilde: ASTRALL,
    caveat_wording: '"激光雷达" "数量 / 检测距离" "2 台 /  30m ± 10%" "扫描线数 / 点云密度" "192线 / 1,720,000pts/s（双回波模式），860,000pts/s（单回波模式）" "视角 / 帧率" "360°*90° / 10 Hz"',
    caveat: 'LiDAR count/detection range: 2 units / 30m ±10%; scan lines/point density: 192 lines / 1,720,000 pts/s dual-echo, 860,000 pts/s single-echo; field of view/frame rate: 360°x90° / 10 Hz.' },
  { robot_id: 2186, field_name: 'cameras', kasse: 'A', kilde: ASTRALL,
    caveat_wording: '"深度相机" "数量 / 尺寸" "1 个 / 90*25*25 mm" "分辨率 / 帧率" "1280*800 / 30 fps" "工作范围" "0.01-20m"',
    caveat: 'Depth camera count/dimensions: 1 unit / 90x25x25mm; resolution/frame rate: 1280x800 / 30fps; working range: 0.01-20m.' },
  { robot_id: 2186, field_name: 'power_output', kasse: 'A', kilde: ASTRALL,
    caveat_wording: '"供电接口 1" "12V，≤20A，≤ 240W" "供电接口 2" "20V-48V，≤10A，≤480W"',
    caveat: 'Power output port 1: 12V, <=20A, <=240W; power output port 2: 20V-48V, <=10A, <=480W.' },
  { robot_id: 2186, field_name: 'data_ports', kasse: 'A', kilde: ASTRALL,
    caveat_wording: '外部通讯 RS485*2, CAN*2, 以太网口*2',
    caveat: 'External communication: RS485x2, CANx2, Ethernetx2.' },

  // ---------------------------------------------------------- 2258 -----
  { robot_id: 2258, field_name: 'weight', kasse: 'A', kilde: YUFAN_SHOP,
    caveat_wording: '整机质量(含电池) 约15Kg',
    caveat: 'Includes battery. The same page also gives a standing measurement of 672x355x432mm, with 20kg payload disclosed separately — the weight therefore covers the robot itself, not robot plus full payload.' },
  { robot_id: 2258, field_name: 'length', kasse: 'A', kilde: YUFAN_SHOP,
    caveat_wording: '"站立尺寸（长×宽×高）" "672mm x 355mm x 432mm"',
    caveat: 'Standing measurement (length x width x height).' },
  { robot_id: 2258, field_name: 'height', kasse: 'A', kilde: YUFAN_SHOP,
    caveat_wording: '"趴地尺寸（长×宽×高）" "718mm x 410mm x 178mm"',
    caveat: 'A lying/resting-position measurement is also disclosed, but the schema has no field for folded/resting measurements (L30). Noted here rather than inventing a field.' },
  { robot_id: 2258, field_name: 'degrees_of_freedom', kasse: 'A', kilde: YUFAN_SHOP,
    caveat_wording: '全身12个自研伺服关节，单关节额定扭矩 18Nm，峰值扭矩 60Nm',
    caveat: 'From the FAQ: 12 self-developed servo joints across the whole body, single-joint rated torque 18Nm, peak torque 60Nm. The parameters table independently confirms 3 joint-motion segments (body/thigh/shank) x 4 legs = 12, so 12 joints is interpreted as 12 degrees of freedom.' },
  { robot_id: 2258, field_name: 'payload_walking', kasse: 'A', kilde: YUFAN_SHOP,
    caveat_wording: '最大载荷 约20kg',
    caveat: "The manufacturer does not distinguish walking from standing payload anywhere on the page. Placed under walking because all product references (e.g. runtime '15kg带负载匀速行走' / 15kg loaded, constant-speed walking) concern carrying while moving, not static standing load. Standing payload is therefore not disclosed, not 0." },
  { robot_id: 2258, field_name: 'speed', kasse: 'A', kilde: YUFAN_SHOP,
    caveat_wording: '运动速度 0～3m/s',
    caveat: 'Movement speed.' },
  { robot_id: 2258, field_name: 'stair_step_continuous', kasse: 'A', kilde: YUFAN_SHOP,
    caveat_wording: '连续攀爬楼梯高度 17cm',
    caveat: 'Continuous stair-climbing height.' },
  { robot_id: 2258, field_name: 'ip_rating', kasse: 'A', kilde: YUFAN_SHOP,
    caveat_wording: '"灵猫・Cyvet 户外雨天能不能使用？防水等级多少？" "仅支持室内、干燥户外，防水工业定制版支持 IP54 级防泼溅，小雨环境短时作业。"',
    caveat: "DOES NOT APPLY TO THE STANDARD MODEL — only to a purchasable/customized variant. From the FAQ (found on a renewed review of the purchase page 2026-08-25, not present in the original 2026-08-24 capture): the standard model is suitable only for indoor and dry outdoor use, with no IP rating disclosed for it; a separate, waterproof 'industrial-customized version' withstands IP54-level splash resistance in light rain, briefly. Filled in here with IP54 (instead of not disclosed) because a concrete, published figure exists — but the reader should know it is conditional on a different configuration than the rest of the entry describes." },
  { robot_id: 2258, field_name: 'temperature_max', kasse: 'A', kilde: YUFAN_SHOP,
    caveat_wording: '"工作温度 -10～50°C" "低温 / 高温工业场景可定制散热、耐寒模组"',
    caveat: "The FAQ adds: low/high-temperature industrial scenarios can be customized with heat-dissipation/cold-resistant modules — the base model's limit is -10 to 50." },
  { robot_id: 2258, field_name: 'battery_wh', kasse: 'A', kilde: YUFAN_SHOP,
    caveat_wording: '"432Wh" "标配（10000mAh, 432Wh）"',
    caveat: "Printed directly as '432Wh' and confirmed in the FAQ as standard: 10000mAh, 432Wh — NOT calculated by us from mAh and voltage." },
  { robot_id: 2258, field_name: 'runtime', kasse: 'A', kilde: YUFAN_SHOP,
    caveat_wording: '"15kg 带负载匀速行走续航约3.5小时" "续航时间" "最大5.5h" "空载匀速行走续航约5.5小时"',
    caveat: "The spec table's headline figure ('runtime: max 5.5h') is UNLOADED (FAQ: unloaded constant-speed walking runtime approx. 5.5 hours) — that figure is stated here, not in the value field, because rule 8 requires a load condition, and the 5.5h figure is specifically unloaded." },
  { robot_id: 2258, field_name: 'hot_swap', kasse: 'A', kilde: YUFAN_SHOP,
    caveat_wording: '电池支持快拆更换，备用电池可实现不中断轮换作业',
    caveat: 'From the FAQ: the battery supports quick-release swapping; a spare battery enables uninterrupted rotation.' },
  { robot_id: 2258, field_name: 'lidar', kasse: 'A', kilde: YUFAN_SHOP,
    caveat_wording: '激光雷达 可选配',
    caveat: "LiDAR - optional add-on. Neither type nor model disclosed, only that it exists as an option. Does not count as filled in under D4's current rule." },
  { robot_id: 2258, field_name: 'cameras', kasse: 'A', kilde: YUFAN_SHOP,
    caveat_wording: '"视觉传感器 双目高清动态相机" "标准配置：双目高清可见光相机、IMU 惯性单元、内置麦克风扬声器、GPS 定位模组、4G 通信模块；可选配激光雷达、360°UWB 定位。"',
    caveat: 'Spec table: visual sensor - stereo HD dynamic camera. The FAQ elaborates: standard configuration is a stereo HD visible-light camera, IMU inertial unit, built-in microphone/speaker, GPS positioning module, 4G communication module; optional add-ons are LiDAR and 360-degree UWB positioning.' },
  { robot_id: 2258, field_name: 'compute', kasse: 'A', kilde: YUFAN_SHOP,
    caveat_wording: '"端侧算力" "Orin Nano 8GB 最高 67 TOPS AI 算力" "Orin NX 8GB 最高 117 TOPS AI 算力" "Orin NX 16GB 最高 157 TOPS AI 算力"',
    caveat: 'All three are marked 可选配 (optional) on the front page.' },
  { robot_id: 2258, field_name: 'ros2', kasse: 'C', kilde: ROS2_README,
    caveat_wording: '"ROS 2 integration for Uniubi robots" "Prerequisites" "ROS 2 Humble is installed and sourced."',
    caveat: "The manufacturer's (Yufan/Uniubi, GitHub org uniubi-ai) own ROS 2 integration package. The README does not mention the model name 'cyvet' directly, but uniubi-ai's ONLY current robot model is 'cyvet' (confirmed independently in the same organization's uniubi_robot_description repo, which has exactly one robot folder: robots/cyvet/). The repository is a fully documented, working integration — not a TODO-marked plan — with a complete motion-bridge architecture and real topics (/cmd_vel, /odom, /joint_states, /imu/data, /battery_state). Unlike GENISOM L2's roamerx repo (rejected there due to an explicit 'TODO' on the hardware coupling), there is no equivalent caveat in the source itself here." },
  { robot_id: 2258, field_name: 'sdk_languages', kasse: 'A', kilde: YUFAN_SHOP,
    caveat_wording: '官方已提供C++、Python标准SDK，支持高级、低级控制接口，开放模型，具备完整二开能力',
    caveat: 'From the FAQ. GitHub: https://github.com/uniubi-ai (mentioned in the same answer, not independently verified in this track).' },
  { robot_id: 2258, field_name: 'price', kasse: 'A', kilde: YUFAN_SHOP,
    caveat_wording: '"售价（含税）" "¥15,999" "部分功能及性能数据仍在持续开发和优化中... 涉及最终价格...以正式订单确认信息为准"',
    caveat: 'Includes tax. The same page states that some features and performance figures are still under development, and the final amount is determined by the official order confirmation — the price is a current list price, not guaranteed final.' },
];

const APPLICATIONS = [
  { robot_id: 2186,
    note: "Mapping of the eight menu items to the seven allowed values: electric power/energy, construction/utility tunnels, mining/rail and water supply are all industrial infrastructure sectors -> industrial. fire/emergency response -> defense and emergency response. industrial-park/factory-area patrol (the page itself says whole-area surveillance) and police/security -> security and surveillance. petrochemical -> industrial. None of the eight map to logistics, inspection, research and development, or consumer and education." },
  { robot_id: 2258,
    note: 'Industrial scenarios is mapped to industrial. Home security/patrol is mapped to security and surveillance. Parent-child science education is mapped to consumer and education. Maker/researcher/geek/gamer is a target-audience description, not an industry sector, and is not mapped to any category.' },
];

// ---------------------------------------------------------------- robots
// notes/notes_wording for 2258 (2186 har ingen notes-array i dag).
const ROBOTS_2258_NOTES = [
  "HOME CITY IS NOT DISCLOSED BY THE MANUFACTURER ITSELF: eight saved pages from the manufacturer's own domain (homepage, product page, motor page, purchase page, two embodied-AI pages, two download/GitHub pages) do not name a city directly - only a Zhejiang-province registration (the ICP code begins with the province's own prefix, not a city code). The city often attributed to the company (next note) appears only in an external encyclopedia entry that is not saved here and therefore cannot be verified as the manufacturer's own source.",
  "The product name appears verbatim as “灵猫・Cyvet” on the purchase page (shop/buy?product=air) - “Cyvet” is therefore part of the official product name, not just a press translation. The company's English legal name in the copyright line is “Universal Ubiquitous AI Co., Ltd.”, the brand mark on the site is “UNIUBI AI”, and the domain is uniubi.com (redirected from the older uni-ubi.com). The Chinese name 宇泛智能 is the same company per an external encyclopedia entry (baike.baidu.com) - not independently verified against the manufacturer's own domain, and kept here only as an external cross-reference, not as a producer-verified fact.",
  "IMPORTANT CAVEAT FROM THE MANUFACTURER ITSELF: the purchase page's footer disclaimer states verbatim: the parameters on this page are compiled from testing of the current engineering pre-production sample and planned versions; some features and performance figures are still under development; actual mass-production configuration, performance and delivery content are determined by the order confirmation and the actual shipped version. Hence status: announced, not in_production - the specifications are themselves marked as pre-production-sample figures, not a final product.",
];

const ROBOTS_2258_NOTES_WORDING = [
  '', // Ingen selvstaendigt citerbar producent-ordlyd - kun et enkelt
      // ICP-praefiks-tegn ("浙"), som ikke er en producent-formulering
      // i sig selv. Se rapportens begrundelse.
  '"灵猫・Cyvet" "Universal Ubiquitous AI Co., Ltd." "UNIUBI AI" "宇泛智能"',
  '"本页参数基于当前工程样机测试结果与版本规划整理，部分功能及性能数据仍在持续开发和优化中。" "实际量产配置、性能表现及交付内容以订单确认信息和实际发货版本为准。"',
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
        console.error(`FEJL ${r.robot_id}/${r.field_name}: "${frag}" — ${v.grund}`);
      }
    }
  }
  // Notes_wording-fragmenter (kun de to ikke-tomme)
  const notesKilder = [null, YUFAN_SHOP, YUFAN_SHOP]; // [0] er tom, ingen kildetjek
  ROBOTS_2258_NOTES_WORDING.forEach((w, i) => {
    if (!w) return;
    for (const frag of fragmenter(w)) {
      // "Universal Ubiquitous AI Co., Ltd." / "UNIUBI AI" / "宇泛智能" kan
      // ligge paa forsiden i stedet for shop-siden - tjek begge.
      tjekket++;
      const vShop = verificerFragment(frag, YUFAN_SHOP);
      const vForside = verificerFragment(frag, YUFAN_FORSIDE);
      if (!vShop.ok && !vForside.ok) {
        fejl++;
        console.error(`FEJL robots.notes_wording[${i}]: "${frag}" — hverken i shop- eller forside-kilden`);
      }
    }
  });
  console.log(`Kildeverifikation: ${tjekket} fragmenter tjekket, ${fejl} fejl.`);
  return fejl === 0;
}

/* --------------------------------------------------------------- main */

async function main() {
  const args = process.argv.slice(2);
  const kunVerificer = args.includes('--verificer');
  const skriv = args.includes('--skriv');

  console.log('--- Kildeverifikation (kildens tegn, bogstaveligt i raa-HTML) ---');
  const ok = verificerAlt();
  if (!ok) {
    console.error('Kildeverifikation fejlede — INGEN skrivning forsøgt.');
    process.exit(1);
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
    process.exit(1);
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
      caveat: r.caveat,
      caveat_wording: r.caveat_wording,
      collected_by: 'spor/f2-cjk',
      change_reason: 'fase 2: ordret kildeordlyd renset for dansk glose (kasse ' + r.kasse + ')',
    };
    const url = `${U}/rest/v1/field_entries?robot_id=eq.${r.robot_id}&field_name=eq.${r.field_name}`;
    console.log(`field_entries ${r.robot_id}/${r.field_name} [kasse ${r.kasse}]`);
    if (!skriv) continue;
    const svar = await fetch(url, { method: 'PATCH', headers: H, body: JSON.stringify(body) });
    const json = await svar.json();
    if (!svar.ok || !Array.isArray(json) || json.length !== 1) {
      console.error(`  AFBRUDT: ${r.robot_id}/${r.field_name} — status ${svar.status}, ${json.length ?? '?'} rækker`, json);
      process.exit(1);
    }
    udfoerte++;
    console.log('  OK, 1 række opdateret.');
  }

  for (const a of APPLICATIONS) {
    planlagte++;
    const body = {
      note: a.note,
      collected_by: 'spor/f2-cjk',
      change_reason: 'fase 2: applications.note oversat til engelsk',
    };
    const url = `${U}/rest/v1/applications?robot_id=eq.${a.robot_id}`;
    console.log(`applications ${a.robot_id}.note`);
    if (!skriv) continue;
    const svar = await fetch(url, { method: 'PATCH', headers: H, body: JSON.stringify(body) });
    const json = await svar.json();
    if (!svar.ok || !Array.isArray(json) || json.length !== 1) {
      console.error(`  AFBRUDT: applications ${a.robot_id} — status ${svar.status}, ${json.length ?? '?'} rækker`, json);
      process.exit(1);
    }
    udfoerte++;
    console.log('  OK, 1 række opdateret.');
  }

  // robots.notes/notes_wording — kun 2258 (2186 har ingen notes i dag).
  {
    planlagte++;
    const body = {
      notes: ROBOTS_2258_NOTES,
      notes_wording: ROBOTS_2258_NOTES_WORDING,
      collected_by: 'spor/f2-cjk',
      change_reason: 'fase 2: robots.notes oversat, notes_wording renset for dansk',
    };
    const url = `${U}/rest/v1/robots?id=eq.2258`;
    console.log('robots 2258.notes + notes_wording');
    if (skriv) {
      const svar = await fetch(url, { method: 'PATCH', headers: H, body: JSON.stringify(body) });
      const json = await svar.json();
      if (!svar.ok || !Array.isArray(json) || json.length !== 1) {
        console.error(`  AFBRUDT: robots 2258 — status ${svar.status}, ${json.length ?? '?'} rækker`, json);
        process.exit(1);
      }
      udfoerte++;
      console.log('  OK, 1 række opdateret.');
    }
  }

  console.log(`\n${skriv ? 'Skrevet' : 'Ville skrive'}: ${planlagte} opdateringer${skriv ? ` (${udfoerte} bekræftet)` : ''}.`);
  if (!skriv) {
    console.log('Dette var et TØRLØB. Kør med --skriv for at skrive rent faktisk.');
  }
}

// Eksporteret så fund/f2-cjk-utf8tjek.mjs kan genbruge NØJAGTIG samme data
// til efterprøvningen — to kopier af "hvad jeg sendte" kan skride fra
// hinanden, én kan ikke.
export { FIELD_ENTRIES, APPLICATIONS, ROBOTS_2258_NOTES, ROBOTS_2258_NOTES_WORDING };

// Kør kun main() når filen eksekveres direkte (node db/f2-cjk-skriv.mjs),
// ikke når den importeres for sin data.
const koertDirekte = process.argv[1] && import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`;
if (koertDirekte) {
  main().catch((err) => {
    console.error('f2-cjk-skriv: fejl —', err.message, err.stack);
    process.exit(1);
  });
}
