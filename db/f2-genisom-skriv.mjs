#!/usr/bin/env node
/**
 * db/f2-genisom-skriv.mjs — spor/f2-genisom's skriveredskab (ejet af dette
 * spor alene). Renser caveat/caveat_wording for de 9 GENISOM-robotter
 * (2205-2213) i field_entries, note for applications, note for images, og
 * notes/notes_wording for robots. Retter desuden 14 danske value_text-felter
 * (oversat KUN i betydning, jf. L87/BRIEF-FAELLES.md).
 *
 * KILDEFUND, VIGTIGT FOR VERIFIKATIONEN (se fund/FUND-f2genisom.md):
 * - media/_kilder/raa-genisom-2026-08-24/ manglede en dedikeret side for
 *   "钢镚 L1" (robot 2205) - kun "钢镚 L1 Maker" (en ANDEN, navngivet
 *   separat vare) var arkiveret. Frisk hentet i dag, se
 *   media/_kilder/raa-f2-genisom-2026-09-02/genisomai-L1-2026-09-02.html
 *   (+ .headers, + udtrukket techparams.json) - matcher databasens
 *   eksisterende L1-tal PRÆCIST, inkl. det tal ("最大载荷 ≈ 8 kg（极限
 *   ~10 kg）"), der ikke matchede NOGEN arkiveret fil.
 * - L2-siden og M1-siden bærer techParamsData for ALLE deres varianter i
 *   ÉN fil (datas[0..2], "classname" = "钢镚 L2"/"钢镚 L2-W"/"钢镚 L2-W
 *   Ultra" hhv. "铜锤 M1"/"铜锤 M1 Pro"/"铜锤 M1 Ultra") - løser alle
 *   L2-W/L2-W Ultra/M1 Pro/M1 Ultra-citater uden nye hentninger.
 * - To GitHub-READMEs blev hentet friskt (roamerx og L1-SDK), se samme
 *   mappe, for at bekræfte "ROS2 Humble Hawksbill"/"Hardware
 *   Deployment"/"TODO" (2207/ros2) og "基于 C++20 开发" (2205/sdk_languages).
 * - Konsekvent tegn-korruption fundet i EKSISTERENDE db-tekst: ASCII "x"
 *   (U+0078) i stedet for kildens fuldbredde multiplikationstegn "×"
 *   (U+00D7) i flere maal-felter; ASCII ">" i stedet for fuldbredde "＞"
 *   (U+FF1E) i 2206/speed; manglende mellemrum foran "个"/"cm" i flere
 *   felter. Rettet her til kildens EGNE tegn - se fund/FUND-f2genisom.md
 *   for den fulde liste.
 * - caveat_wording = KUN kildens tegn (CJK-baerende citater), joinet med
 *   mellemrum naar der er flere. Al dansk prosa (oversaettelse +
 *   kommentar, tidligere klistret ind i caveat_wording) er flyttet til
 *   `caveat` og oversat til engelsk.
 *
 * Brug:
 *   node db/f2-genisom-skriv.mjs --toerloeb      Standard: viser hvad der VILLE ske.
 *   node db/f2-genisom-skriv.mjs --skriv         Skriver rent faktisk, én PATCH pr. post.
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const ROD = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

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

const COLLECTED_BY = 'spor/f2-genisom';
const REASON = 'fase 2: ordret kildeordlyd renset for dansk (CJK-kilde), jf. L87';

// FIELD_ENTRIES/APPLICATIONS/IMAGES/ROBOTS er defineret nedenfor i denne
// samme fil (jf. filejerskabslisten i BRIEF-f2-genisom.md, som kun navngiver
// db/f2-genisom-skriv.mjs — ingen separat datafil).
// KASSE: 'A' = ordlyd fandtes, forurenet af dansk (langt de fleste) ·
// 'B' = ingen citerbar ordlyd, men caveat-prosaen er egen, verificerbar
// metodekommentar (typisk autonomy_level/sdk_languages/temperature_max).

const FIELD_ENTRIES = [
  // ======================================================= 2205 (Gangben L1)
  // Kilde for hele robotten (paa naer sdk_languages): frisk hentet i dag,
  // media/_kilder/raa-f2-genisom-2026-09-02/genisomai-L1-2026-09-02.html
  // (techparams udtrukket til genisomai-L1-2026-09-02-techparams.json).
  { robot_id: 2205, field_name: 'weight', kasse: 'A',
    caveat_wording: '"整机重量（含电池）: 15 kg"',
    caveat: 'Explicit (includes battery). CORRECTED ON SELF-CHECK: this row has no "约" (approx.) mark before the weight, unlike the measurements just above it in the same table, which ARE marked. An earlier draft of this entry incorrectly set operator "~" on the weight, assuming the whole section shared the same approx. marking — corrected after re-reading the raw JSON.' },
  { robot_id: 2205, field_name: 'length', kasse: 'A',
    caveat_wording: '"站立尺寸（长 × 宽 × 高）约 630 × 360 × 415 mm"',
    caveat: 'The axes ARE labelled explicitly by the manufacturer (长=length, 宽=width, 高=height), unlike MicroRoboTech’s two entries.' },
  { robot_id: 2205, field_name: 'height', kasse: 'A',
    caveat_wording: '"趴地尺寸"',
    caveat: 'The prone (lying-down) measurement is approx. 670×425×145mm; the schema has no field for that state.' },
  { robot_id: 2205, field_name: 'degrees_of_freedom', kasse: 'A',
    caveat_wording: '"关节电机数量: 12 个"',
    caveat: 'Number of joint motors, not explicitly "degrees of freedom" (自由度). Same interpretation as the Unitree Go2 in this collection.' },
  { robot_id: 2205, field_name: 'payload_walking', kasse: 'A',
    caveat_wording: '"最大载荷 ≈ 8 kg（极限 ~10 kg）"',
    caveat: 'Maximum load — a limit of up to approx. 10kg is also disclosed separately.' },
  { robot_id: 2205, field_name: 'speed', kasse: 'A',
    caveat_wording: '"最大速度: 3.7 m/s" "极限速度: 5 m/s"',
    caveat: 'A separate limit speed of 5 m/s is also disclosed — not used as the main value, because "最大速度" (max speed) is the label that corresponds to "normal maximum speed" elsewhere in this collection.' },
  { robot_id: 2205, field_name: 'slope', kasse: 'A',
    caveat_wording: '"最大爬坡角度: 标准环境 30°，极限可达 40°"',
    caveat: 'Standard environment 30°, limit up to 40°. The standard value is used; the 40° limit is noted here, not entered as the field’s value.' },
  { robot_id: 2205, field_name: 'stair_step_continuous', kasse: 'A',
    caveat_wording: '"连续攀爬楼梯高度"',
    caveat: 'Label: continuous stair-climbing height.' },
  { robot_id: 2205, field_name: 'battery_wh', kasse: 'A',
    caveat_wording: '"电池" "标称容量 5 Ah，额定容量 4.6 Ah，电压 43.2 V"',
    caveat: 'The accessories list discloses: nominal capacity 5Ah, rated capacity 4.6Ah, voltage 43.2V. Wh is NOT printed directly, and we do not calculate Wh from Ah × V (rule 9 — the MagicLab entry is proof that a manufacturer’s own calculated Wh figure does not always match Ah × V).' },
  { robot_id: 2205, field_name: 'runtime', kasse: 'A',
    caveat_wording: '"续航时间: 1-2 h" "续航里程: 6 km"',
    caveat: 'Runtime, no load condition disclosed. A range of 6km is also disclosed; the schema has no range field.' },
  { robot_id: 2205, field_name: 'charging_time', kasse: 'A',
    caveat_wording: '"充电时长: 1 h"',
    caveat: 'Charging time.' },
  { robot_id: 2205, field_name: 'docking_station', kasse: 'A',
    caveat_wording: '"充电座: 标配"',
    caveat: 'Accessories list: charging dock, standard equipment. Confirms a physical charging dock ships as standard, but does NOT confirm autonomous return-to-dock/self-recharging — that term does not appear on L1’s page (unlike L2’s explicit "自主回充功能").' },
  { robot_id: 2205, field_name: 'compute', kasse: 'A',
    caveat_wording: '"基础算力: 8 核高性能 CPU" "工作最大功率: 3500W"',
    caveat: 'Base compute: 8-core high-performance CPU. A maximum operating power of 3500W is also disclosed in the same section; the schema has no power field.',
    change_reason: 'fase 2: ordret kildeordlyd renset for dansk (CJK-kilde), jf. L87. En saetning om et RealSense/Livox/Orin-sensorsaet henviste til "top-noten" (robots.notes), som ikke findes for denne robot (notes: null) - "Orin" findes kun i L1-W EDU-sektionen af en ANDEN robots side (2026-08-24-text.txt), ikke i L1s egen kilde. Droppet under L87 som ubelagt.' },
  { robot_id: 2205, field_name: 'sdk_languages', kasse: 'A',
    caveat_wording: '"genisom_L1_sdk" "Official SDK for the Genisom AI L1 Series, providing long-term support and maintenance for stable development, integration, and deployment." "基于 C++20 开发"',
    caveat: 'Source is the manufacturer’s own GitHub organisation (zsibot = GENISOM AI), the repo "genisom_L1_sdk", explicitly named the official L1 SDK. README: built with/on C++20. Not the product page itself, hence source type: secondary under the new rule.',
    change_reason: 'fase 2: ordret kildeordlyd renset for dansk (CJK-kilde), jf. L87. "C++20"-paastanden var ikke bekraeftet i det oprindelige snapshot (kun org-listen, ikke selve READMEen); frisk hentet i dag - media/_kilder/raa-f2-genisom-2026-09-02/genisom_L1_sdk-README-2026-09-02.html - bekraefter "基于 C++20 开发" ordret.' },
  { robot_id: 2205, field_name: 'autonomy_level', kasse: 'B',
    caveat_wording: null,
    caveat: 'Qualitative list from the manufacturer’s feature section, not a rating on a scale.',
    value_text: 'AI reinforcement-learning motion control (standard); target recognition and tracking; OTA updates; supports further development' },
  // FUND: denne raekke havde caveat=null (INGEN caveat overhovedet) og
  // laa derfor UDEN FOR det per-robot-dump, jeg klassificerede fra - fundet
  // ved en separat forespoergsel efter value_text UDEN caveat. "Bredvinkel-
  // kamera" er dansk og usynlig for dansk-detektoren (ingen aeoeaa, ikke i
  // ordlisten) - samme fælde OPSKRIFT-fase2-cjk.md advarer om.
  { robot_id: 2205, field_name: 'cameras', kasse: 'B',
    caveat_wording: null,
    caveat: null,
    value_text: 'Wide-angle camera, 8 MP, DFOV 122° / HFOV 111° / VFOV 70°' },

  // =================================================== 2206 (Gangben L1-W)
  // Kilde: media/_kilder/raa-genisom-2026-08-24/genisomai-l1w-2026-08-24.html
  // (+ techparams.json).
  { robot_id: 2206, field_name: 'weight', kasse: 'A',
    caveat_wording: '"整机重量（含电池）: 22 kg"',
    caveat: 'Explicit (includes battery). The row has no "约" (approx.) mark.' },
  { robot_id: 2206, field_name: 'length', kasse: 'A',
    caveat_wording: '"站立尺寸（长x宽x高）约 630 × 430 × 485 mm"',
    caveat: 'Standing measurement, length×width×height, approx.' },
  { robot_id: 2206, field_name: 'height', kasse: 'A',
    caveat_wording: '"趴地尺寸"',
    caveat: 'The prone (lying-down) measurement is approx. 690×540×165mm; the schema has no field for that state.' },
  { robot_id: 2206, field_name: 'degrees_of_freedom', kasse: 'A',
    caveat_wording: '"关节电机数量: 12 个" "高性能轮毂电机: 4 个"',
    caveat: 'Number of joint motors. There are also 4 hub-drive wheel motors, not counted in this DoF figure — the schema has no separate wheel-motor field.' },
  { robot_id: 2206, field_name: 'payload_walking', kasse: 'A',
    caveat_wording: '"最大载荷 ≈ 10 kg（极限 ~12 kg）"',
    caveat: 'Maximum load — a limit of up to approx. 12kg is also disclosed separately.' },
  { robot_id: 2206, field_name: 'speed', kasse: 'A',
    caveat_wording: '"最大速度: 3.7 m/s" "极限速度" "＞5.5m/s 极限奔跑速度"',
    caveat: 'A separate limit speed of 5.5 m/s is also disclosed (the marketing card reads "＞5.5m/s limit running speed") — not used as the main value, same principle as L1/L2.' },
  { robot_id: 2206, field_name: 'slope', kasse: 'A',
    caveat_wording: '"最大爬坡角度: 标准环境 30°，极限可达 40°"',
    caveat: 'Standard environment 30°, limit up to 40°. The standard value is used, same principle as L1.' },
  { robot_id: 2206, field_name: 'obstacle_single', kasse: 'A',
    caveat_wording: '"65cm 最大越障高度"',
    caveat: '65cm maximum obstacle height, from the page’s marketing card — kept separate from stair_step_continuous, which carries a different, lower figure in the structured spec table. Same two-field pattern as L2/Deep Robotics X30/B2.' },
  { robot_id: 2206, field_name: 'stair_step_continuous', kasse: 'A',
    caveat_wording: '"连续攀爬楼梯高度"',
    caveat: 'Label: continuous stair-climbing height, in the structured spec table.' },
  { robot_id: 2206, field_name: 'battery_wh', kasse: 'A',
    caveat_wording: '"电池" "标称容量 5 Ah，额定容量 4.6 Ah，电压 43.2 V"',
    caveat: 'The accessories list discloses: nominal capacity 5Ah, rated capacity 4.6Ah, voltage 43.2V — the same figures as L1. Wh is NOT printed directly, and we do not calculate Wh from Ah × V (rule 9).' },
  { robot_id: 2206, field_name: 'runtime', kasse: 'A',
    caveat_wording: '"续航时间: 1-2h" "续航里程: 9km"',
    caveat: 'No load condition disclosed — same figures as L1. A range is also disclosed (higher than L1’s 6km figure, not lower — L1-W’s 9km is the higher one; the schema has no range field).' },
  { robot_id: 2206, field_name: 'charging_time', kasse: 'A',
    caveat_wording: '"充电时长: 1h"',
    caveat: 'Charging time.' },
  { robot_id: 2206, field_name: 'docking_station', kasse: 'A',
    caveat_wording: '"充电座: 标配"',
    caveat: 'Accessories list: charging dock, standard equipment. Confirms a physical charging dock ships as standard, but does NOT confirm autonomous return-to-dock/self-recharging.' },
  { robot_id: 2206, field_name: 'cameras', kasse: 'B',
    caveat_wording: null,
    caveat: 'Same camera spec as L1 — only the IMU and the wide-angle camera appear in the structured sensor section, no lidar row.',
    value_text: 'Wide-angle camera, 8 MP, DFOV 122° / HFOV 111° / VFOV 70°' },
  { robot_id: 2206, field_name: 'compute', kasse: 'A',
    caveat_wording: '"基础算力: 8 核高性能 CPU" "工作最大功率: 3500W"',
    caveat: 'Base compute: 8-core high-performance CPU. A maximum operating power of 3500W is also disclosed in the same section; the schema has no power field.' },
  { robot_id: 2206, field_name: 'autonomy_level', kasse: 'B',
    caveat_wording: null,
    caveat: 'Qualitative list from the manufacturer’s feature section, not a rating on a scale.',
    value_text: 'AI reinforcement-learning motion control (standard); target recognition and tracking; basic motions (stand/lie down/damping/pitch body/high-low body/horizontal turn); special motions (jump forward/jump up/two-leg stand/backflip/wave, etc.); supports further development; OTA updates; real-time image transmission' },
  { robot_id: 2206, field_name: 'data_ports', kasse: 'A',
    caveat_wording: '"开放 Ethernet、USB 3.0/2.0、24V/12V 电源等 7 大标准硬件接口"',
    caveat: 'The manufacturer claims 7 interface types in total, but "等" ("etc.") makes the list non-exhaustive — only these three categories are named explicitly.' },

  // ====================================================== 2207 (Gangben L2)
  // Kilde: media/_kilder/raa-genisom-2026-08-24/genisomai-l2-2026-08-24.html
  // (+ techparams.json, datas[0] classname "钢镚 L2" · id 63) og l2-text.txt.
  { robot_id: 2207, field_name: 'weight', kasse: 'A',
    caveat_wording: '"整机重量（含电池）: 21 kg"',
    caveat: 'Explicit (includes battery). The row has NO "约" (approx.) mark, unlike the measurements just above it in the same table (same pattern as Gangben L1, corrected there on self-check — checked here from the start after that same error).' },
  { robot_id: 2207, field_name: 'length', kasse: 'A',
    caveat_wording: '"站立尺寸（长 × 宽 × 高）约 720 × 390 × 480 mm"',
    caveat: 'Standing measurement, length×width×height, approx. — the axes are labelled explicitly by the manufacturer.' },
  { robot_id: 2207, field_name: 'height', kasse: 'A',
    caveat_wording: '"趴地尺寸"',
    caveat: 'The prone (lying-down) measurement is approx. 780×460×190mm; the schema has no field for that state.' },
  { robot_id: 2207, field_name: 'degrees_of_freedom', kasse: 'A',
    caveat_wording: '"关节电机数量: 12 个"',
    caveat: 'Number of joint motors, not explicitly "degrees of freedom". Same interpretation as L1 and the Unitree Go2.' },
  { robot_id: 2207, field_name: 'payload_walking', kasse: 'A',
    caveat_wording: '"最大载荷 ≈ 16 kg"',
    caveat: 'Maximum load.' },
  { robot_id: 2207, field_name: 'payload_standing', kasse: 'A',
    caveat_wording: '"极限静态 150kg" "最大静态载荷可达150kg"',
    caveat: 'In the spec table, confirmed by the same figure in the marketing text — two places on the same page, in agreement.' },
  { robot_id: 2207, field_name: 'speed', kasse: 'A',
    caveat_wording: '"最大速度: 3.2 m/s" "极限速度"',
    caveat: 'A separate limit speed of 5 m/s is also disclosed — not used as the main value, same principle as L1.' },
  { robot_id: 2207, field_name: 'slope', kasse: 'A',
    caveat_wording: '"最大爬坡角度: 40°"',
    caveat: 'Maximum climbable slope angle, confirmed by the homepage capability card.' },
  { robot_id: 2207, field_name: 'obstacle_single', kasse: 'A',
    caveat_wording: '"70cm 垂直越障高度"',
    caveat: 'Label: 70cm vertical obstacle-crossing height, from the page’s capability card — kept separate from stair_step_continuous, which carries a different, lower figure in the structured spec table. Same two-field pattern as Deep Robotics X30/B2.' },
  { robot_id: 2207, field_name: 'stair_step_continuous', kasse: 'A',
    caveat_wording: '"连续攀爬楼梯高度"',
    caveat: 'Label: continuous stair-climbing height, in the structured spec table — lower than the single-obstacle figure (70cm), as expected for two different measurements.' },
  { robot_id: 2207, field_name: 'battery_wh', kasse: 'A',
    caveat_wording: '"756Wh 大容量电池"',
    caveat: '756Wh high-capacity battery, from the page’s capability card. See the top note on the separate "15000mAh" figure in the accessories list — not used to calculate Wh, only noted as found without contradiction.' },
  { robot_id: 2207, field_name: 'runtime', kasse: 'A',
    caveat_wording: '"续航时间: 5.5H（空载） 3.5H（满载）" "续航里程: 20KM（空载） 12KM（满载）"',
    caveat: '5.5h unloaded / 3.5h full load. Qualitative load condition (unloaded/full), no kg figure for "full load" — hence the load condition is stated as not disclosed rather than a guessed mass figure. A range is also disclosed; the schema has no range field.' },
  { robot_id: 2207, field_name: 'charging_time', kasse: 'A',
    caveat_wording: '"充电时长: 1.5 h"',
    caveat: 'Charging time.' },
  { robot_id: 2207, field_name: 'docking_station', kasse: 'A',
    caveat_wording: '"充电座: 标配" "充电桩（包含自主回充功能）: 选配"',
    caveat: 'The accessories list has TWO rows: a charging dock, standard equipment (same as L1 has) AND, separately, a charging station including autonomous return-to-charge, OPTIONAL. So L2 has both a standard charging dock AND a paid upgrade to autonomous return-to-dock — docking_station: yes covers at minimum the former; the autonomous-recharge function specifically is only confirmed as optional, not standard.' },
  { robot_id: 2207, field_name: 'compute', kasse: 'A',
    caveat_wording: '"基础算力: 8 核高性能 CPU" "高达 86 TOPS 算力平台"',
    caveat: 'From the structured spec table, combined with the homepage capability card’s "up to 86 TOPS compute platform" — both from genisomai.com, not cross-confirmed against each other beyond being on the same domain.' },
  { robot_id: 2207, field_name: 'ros2', kasse: 'A',
    caveat_wording: '"新一代 RoamerX 智能导航系统" "genisom_roamerx_open" "ROS2 Humble Hawksbill" "Hardware Deployment" "TODO"',
    caveat: 'INVESTIGATED AND DELIBERATELY NOT SET TO YES, AFTER A SELF-CHECK CAUGHT INSUFFICIENT EVIDENCE. L2’s own product page names a "next-generation RoamerX intelligent navigation system" as a feature, and the manufacturer’s GitHub repo "genisom_roamerx_open" explicitly requires "ROS2 Humble Hawksbill". An earlier draft of this entry set ros2: yes on that link. On re-reading the repo’s OWN README, however, its "Hardware Deployment" section reads only "TODO" — the manufacturer itself states that the link between this open-source repo and a physical, shipping product is NOT documented yet. A name match ("RoamerX") plus a repo that itself says "TODO" for hardware rollout is a guess, not a measurement — rule 1. Corrected to not disclosed.',
    change_reason: 'fase 2: ordret kildeordlyd renset for dansk (CJK-kilde), jf. L87. "ROS2 Humble Hawksbill"/"Hardware Deployment"/"TODO" var ikke bekraeftet i det oprindelige snapshot (kun org-listen); frisk hentet i dag - media/_kilder/raa-f2-genisom-2026-09-02/genisom_roamerx_open-README-2026-09-02.html - bekraefter alle tre ordret.' },
  { robot_id: 2207, field_name: 'autonomy_level', kasse: 'B',
    caveat_wording: null,
    caveat: 'Qualitative list from the manufacturer’s feature section, not a rating on a scale.',
    value_text: 'AI reinforcement-learning motion control (standard); UWB; autonomous following; intelligent obstacle avoidance; OTA updates; supports further development' },
  { robot_id: 2207, field_name: 'data_ports', kasse: 'A',
    caveat_wording: '"功能拓展接口: 5个航插：2个USB3.0,1个M12 17PIN,1个M12 18PIN,1个4G卡槽"',
    caveat: '5 aviation connectors in total: 2× USB3.0 + 1× M12 17PIN + 1× M12 18PIN + 1× 4G card slot = 5 — all five are named in the source, none unspecified.' },
  { robot_id: 2207, field_name: 'price', kasse: 'A',
    caveat_wording: '"¥39999 起"',
    caveat: '"起" means "from"/"starting at": the base-configuration price; options (e.g. the optional charging station above) are added on top.' },
  // FUND: samme moenster som 2205/cameras ovenfor - caveat=null, laa uden
  // for det klassificerede dump. "Stereokamera" er dansk, usynlig for
  // detektoren.
  { robot_id: 2207, field_name: 'cameras', kasse: 'B',
    caveat_wording: null,
    caveat: null,
    value_text: 'Stereo camera, 2× 2.07 MP' },

  // ================================================== 2208 (Gangben L2-W)
  // Kilde: samme L2-side som 2207, techparams.json datas[1] classname
  // "钢镚 L2-W" · id 1249 (INGEN separat URL - fane-skift paa L2's side).
  { robot_id: 2208, field_name: 'weight', kasse: 'A',
    caveat_wording: '"整机重量（含电池）: 27 kg"',
    caveat: 'In L2-W’s own data block — no "约" (approx.) mark.' },
  { robot_id: 2208, field_name: 'length', kasse: 'A',
    caveat_wording: '"站立尺寸（长 × 宽 × 高）约 760 × 450 × 500 mm"',
    caveat: 'Standing measurement, length×width×height, approx.' },
  { robot_id: 2208, field_name: 'height', kasse: 'A',
    caveat_wording: '"趴地尺寸"',
    caveat: 'The prone (lying-down) measurement is approx. 780×550×190mm; the schema has no field for that state.' },
  { robot_id: 2208, field_name: 'degrees_of_freedom', kasse: 'A',
    caveat_wording: '"关节电机数量: 12 个"',
    caveat: 'Number of joint motors, not explicitly "degrees of freedom". Same interpretation as L1/L2/M1.' },
  { robot_id: 2208, field_name: 'payload_walking', kasse: 'A',
    caveat_wording: '"最大载荷 ≈ 16 kg （极限静态 150kg）"',
    caveat: 'Maximum load, static limit 150kg, in L2-W’s own data block — same figures as the base version L2.' },
  { robot_id: 2208, field_name: 'payload_standing', kasse: 'A',
    caveat_wording: '"极限静态 150kg" "最大载荷"',
    caveat: 'Static limit 150kg, inside the "max load" row of L2-W’s own data block. Unlike the base version L2, this is NOT cross-confirmed by a separate marketing-text line for L2-W specifically — only this one occurrence.' },
  { robot_id: 2208, field_name: 'speed', kasse: 'A',
    caveat_wording: '"最大速度: 3.7 m/s" "极限速度"',
    caveat: 'In L2-W’s own data block — higher than the base version’s 3.2 m/s, as expected for a wheeled variant. A separate limit speed of 5 m/s is also disclosed — not used as the main value.' },
  { robot_id: 2208, field_name: 'stair_step_continuous', kasse: 'A',
    caveat_wording: '"连续攀爬楼梯高度"',
    caveat: 'Label: continuous stair-climbing height, in L2-W’s own data block — higher than the base version’s 22cm.' },
  { robot_id: 2208, field_name: 'runtime', kasse: 'A',
    caveat_wording: '"续航时间: 5.5H（空载） 3.5H（满载）" "续航里程: 20KM（空载） 12KM（满载）"',
    caveat: 'In L2-W’s own data block — identical to the base version. Qualitative load condition (unloaded/full), no kg figure — hence the load condition is stated as not disclosed. A range is also disclosed; the schema has no range field.' },
  { robot_id: 2208, field_name: 'docking_station', kasse: 'A',
    caveat_wording: '"充电座: 标配" "充电桩（包含自主回充功能）: 选配"',
    caveat: 'The accessories list in L2-W’s own data block has TWO rows: standard equipment AND, separately, optional, including autonomous return-to-charge. Same two-tier pattern as the base version L2.' },
  { robot_id: 2208, field_name: 'cameras', kasse: 'B',
    caveat_wording: null,
    caveat: 'Identical to the base version — only the IMU and stereo camera appear in L2-W’s sensor section, no lidar row.',
    value_text: 'Stereo camera, 2× 2.07 MP' },
  { robot_id: 2208, field_name: 'compute', kasse: 'A',
    caveat_wording: '"基础算力: 8 核高性能 CPU" "高达 86 TOPS"',
    caveat: 'In L2-W’s own data block. The page’s hero marketing card separately mentions "up to 86 TOPS" for the L2 family in general — NOT repeated in L2-W’s own data block, and therefore not included here (see the top note).' },
  { robot_id: 2208, field_name: 'autonomy_level', kasse: 'A',
    caveat_wording: '"托马斯"',
    caveat: 'Qualitative list from L2-W’s own feature list. Adds "Thomas flair" (托马斯) to the special-motions list compared with the base version’s list.',
    value_text: 'AI reinforcement-learning motion control (standard); UWB (supported); autonomous following (supported); intelligent obstacle avoidance (supported); supports further development; OTA updates; special motions (handstand/two-leg stand/Thomas flair/backflip); basic motions (stand/lie down/crawl forward/jump forward/jump up/lock position)' },
  { robot_id: 2208, field_name: 'data_ports', kasse: 'A',
    caveat_wording: '"功能拓展接口: 5个航插：2个USB3.0,1个M12 17PIN,1个M12 18PIN,1个4G卡槽"',
    caveat: 'Expansion interfaces: 5 aviation connectors in total: 2× USB3.0, 1× M12 17PIN, 1× M12 18PIN, 1× 4G card slot, in L2-W’s own data block — identical to the base version L2.' },

  // ============================================ 2209 (Gangben L2-W Ultra)
  // Kilde: samme L2-side som 2207/2208, techparams.json datas[2] classname
  // "钢镚 L2-W Ultra" · id 1250 (INGEN separat URL).
  { robot_id: 2209, field_name: 'weight', kasse: 'A',
    caveat_wording: '"整机重量（含电池）: 27 kg"',
    caveat: 'In L2-W Ultra’s own data block — same figure as L2-W, no "约" (approx.) mark.' },
  { robot_id: 2209, field_name: 'length', kasse: 'A',
    caveat_wording: '"站立尺寸（长 × 宽 × 高）约 760 × 450 × 500 mm"',
    caveat: 'Standing measurement, length×width×height, approx. — identical to L2-W.' },
  { robot_id: 2209, field_name: 'height', kasse: 'A',
    caveat_wording: '"趴地尺寸"',
    caveat: 'The prone (lying-down) measurement is approx. 780×550×190mm; the schema has no field for that state.' },
  { robot_id: 2209, field_name: 'degrees_of_freedom', kasse: 'A',
    caveat_wording: '"关节电机数量: 12 个"',
    caveat: 'Number of joint motors, not explicitly "degrees of freedom".' },
  { robot_id: 2209, field_name: 'payload_walking', kasse: 'A',
    caveat_wording: '"最大载荷 ≈ 16 kg （极限静态 150kg）"',
    caveat: 'Maximum load, static limit 150kg — same figures as L2/L2-W.' },
  { robot_id: 2209, field_name: 'payload_standing', kasse: 'A',
    caveat_wording: '"极限静态 150kg" "最大载荷"',
    caveat: 'Static limit 150kg, inside the "max load" row of this variant’s own data block. Not cross-confirmed by a separate marketing-text line for this variant specifically.' },
  { robot_id: 2209, field_name: 'speed', kasse: 'A',
    caveat_wording: '"最大速度: 3.7 m/s" "极限速度"',
    caveat: 'Maximum speed — same figure as L2-W, higher than the base version’s 3.2 m/s. A separate limit speed of 5 m/s is also disclosed — not used as the main value.' },
  { robot_id: 2209, field_name: 'stair_step_continuous', kasse: 'A',
    caveat_wording: '"连续攀爬楼梯高度"',
    caveat: 'Label: continuous stair-climbing height — same figure as L2-W, higher than the base version’s 22cm.' },
  { robot_id: 2209, field_name: 'runtime', kasse: 'A',
    caveat_wording: '"续航时间: 4.5H（空载） 3H（满载）" "续航里程: 16KM（空载） 10KM（满载）"',
    caveat: 'LOWER than L2/L2-W’s 5.5h/3.5h, as expected when the expanded sensor set (dual LiDAR, RTK) draws more power. Qualitative load condition, no kg figure — hence the load condition is stated as not disclosed. A range is also disclosed; the schema has no range field.' },
  { robot_id: 2209, field_name: 'docking_station', kasse: 'A',
    caveat_wording: '"充电座: 标配" "充电桩（包含自主回充功能）: 选配"',
    caveat: 'The accessories list has TWO rows: standard equipment AND, separately, optional. Same two-tier pattern as L2/L2-W.' },
  { robot_id: 2209, field_name: 'lidar', kasse: 'A',
    caveat_wording: '"3D激光雷达: 工业级96线激光雷达*2" "RTK定位模块: 支持"',
    caveat: 'The only GENISOM entry in this track with a concrete LiDAR line count. An RTK positioning module is also disclosed in the same sensor section; the schema has no dedicated RTK field, so it is repeated under autonomy_level below.',
    value_text: '2× industrial-grade 96-line 3D LiDAR' },
  { robot_id: 2209, field_name: 'cameras', kasse: 'A',
    caveat_wording: '"相机类型: 前向双目+周视鱼眼阵列" "相机像索: 207万*2"',
    caveat: 'The pixel count (2.07 MP × 2) sits only next to "前向双目" (the forward stereo camera) in the raw string — the fisheye array’s own pixel count is NOT separately disclosed, so 2.07 MP should be read as covering the stereo camera, not necessarily the whole array.',
    value_text: 'Forward stereo camera + surround-view fisheye array, 2× 2.07 MP' },
  { robot_id: 2209, field_name: 'compute', kasse: 'A',
    caveat_wording: '"基础算力: 8核高性能CPU+ 6核高性能CPU（80TOPS）"',
    caveat: 'Two CPUs, the lowest TOPS figure (80) of the three GENISOM models that disclose TOPS (L2 86, M1 100, this one 80) — likely because the extra sensor load (dual LiDAR, RTK) shares the compute budget.',
    value_text: '8-core CPU + 6-core CPU, 80 TOPS' },
  { robot_id: 2209, field_name: 'autonomy_level', kasse: 'B',
    caveat_wording: null,
    caveat: 'Qualitative list from this variant’s own feature list — richer than L2/L2-W’s, adding autonomous navigation as standard (not optional), target tracking, RTK, and laser+vision-fusion obstacle avoidance.',
    value_text: 'AI reinforcement-learning motion control (standard); UWB (supported); autonomous following (supported, GLUE omnidirectional autonomous following); intelligent obstacle avoidance (laser+vision fusion avoidance); target tracking (supported); supports further development; OTA updates; autonomous navigation (supported); real-time image transmission (supported); RTK positioning module (supported); special motions (handstand/two-leg stand/Thomas flair/backflip); basic motions (stand/lie down/crawl forward/jump forward/jump up/climb onto platform/lock position)' },
  { robot_id: 2209, field_name: 'data_ports', kasse: 'A',
    caveat_wording: '"功能拓展接口: 5个航插：2个USB3.0,1个M12 17PIN,1个M12 18PIN,1个5G卡槽"',
    caveat: 'Expansion interfaces: 5 aviation connectors in total: 2× USB3.0, 1× M12 17PIN, 1× M12 18PIN, 1× 5G card slot — NOTE: 5G card slot, not 4G as on L2/L2-W. Re-read and confirmed different from the other two variants.' },

  // ================================================ 2210 (Qiuqiu SP1)
  // Kilde: media/_kilder/raa-genisom-2026-08-24/genisomai-sp1-2026-08-24.html
  // (+ techparams.json, text.txt).
  { robot_id: 2210, field_name: 'weight', kasse: 'A',
    caveat_wording: '"本体重量: ≤100 kg"',
    caveat: 'Own/unloaded weight.' },
  { robot_id: 2210, field_name: 'length', kasse: 'A',
    caveat_wording: '"外形尺寸（长 × 宽 × 高）: 1190 × 640 × 925 mm"',
    caveat: 'Outer dimensions, length×width×height — no "约" (approx.) mark, no operator set.' },
  { robot_id: 2210, field_name: 'payload_walking', kasse: 'A',
    caveat_wording: '"最大载荷: 50 kg" "50 kg 持续行走负载"',
    caveat: 'Maximum load, in the structured table, confirmed by the marketing text: 50kg sustained walking load.' },
  { robot_id: 2210, field_name: 'slope', kasse: 'A',
    caveat_wording: '"最大爬坡角度: 35°" "稳定爬坡 最大爬坡角度 35°"',
    caveat: 'Maximum climbable slope angle, confirmed by the marketing text: stable slope-climbing, maximum climbable slope angle 35°.' },
  { robot_id: 2210, field_name: 'stair_step_continuous', kasse: 'A',
    caveat_wording: '"攀爬能力: 23 cm连续台阶"',
    caveat: '23cm continuous stair-climbing. No separate single-obstacle figure was found on the page — hence obstacle_single is stated as not disclosed rather than reusing this figure.' },
  { robot_id: 2210, field_name: 'runtime', kasse: 'A',
    caveat_wording: '"续航时间: ≥4 h" "满载" "4 h 满载续航 持续作业" "50 kg 持续行走负载"',
    caveat: 'In the structured table. The marketing card ties the same figure to "full load", but NO kg figure sits directly on this row. A separate "50kg sustained walking load" figure is found elsewhere on the page, but is not explicitly tied to this endurance figure — hence the load condition is stated as not disclosed, the same caution as L2/M1’s runtime fields.' },
  { robot_id: 2210, field_name: 'autonomy_level', kasse: 'B',
    caveat_wording: null,
    caveat: 'Qualitative list from the manufacturer’s feature section, not a rating on a scale.',
    value_text: 'AI reinforcement-learning motion control (supported); autonomous navigation (supported); intelligent obstacle avoidance (supported); supports further development; SLAM/IMU/AI decision fusion (fusion of SLAM, IMU and AI decision-making, autonomous planning, real-time avoidance, on-site real-time data transmission)' },

  // =================================================== 2211 (Tongchui M1)
  // Kilde: media/_kilder/raa-genisom-2026-08-24/genisomai-m1-2026-08-24.html
  // (+ techparams.json, datas[0] classname "铜锤 M1" · id 217, text.txt).
  { robot_id: 2211, field_name: 'weight', kasse: 'A',
    caveat_wording: '"整机重量（含电池）: 41 kg" "约 30kg 整机重量（同级别最轻量），约 30kg 持续作业负载，在四足机器人行业内首次实现近 1:1 负载自重比"',
    caveat: 'In the structured spec table — no "约" (approx.) mark. CONTRADICTED by the page’s own marketing card: approx. 30kg own weight (the lightest in its class), approx. 30kg sustained working load, achieving a near-1:1 load-to-weight ratio, industry-first for quadrupeds. The two figures (41kg vs. 30kg) are the SAME robot’s own weight on the SAME page and are in conflict. Rule 9: not silently corrected. The structured table is used as the field value because it is the more specific source (same principle as the rest of the GENISOM entries), but the inconsistency is not explained away.' },
  { robot_id: 2211, field_name: 'length', kasse: 'A',
    caveat_wording: '"站立尺寸（长 × 宽 × 高）: 930 × 480 × 585 mm"',
    caveat: 'NO "约" (approx.) mark on this row, unlike L1/L2’s corresponding measurements. No operator set, per rule 4 (never invent a caveat the manufacturer did not write).' },
  { robot_id: 2211, field_name: 'height', kasse: 'A',
    caveat_wording: '"趴地尺寸"',
    caveat: 'The prone (lying-down) measurement is 930×630×200mm; the schema has no field for that state.' },
  { robot_id: 2211, field_name: 'degrees_of_freedom', kasse: 'A',
    caveat_wording: '"关节电机数量: 12 个" "16个自由度"',
    caveat: 'Number of joint motors, in the structured table. See the top note on the meta description’s conflicting claim of 16 degrees of freedom, which is NOT used here.' },
  { robot_id: 2211, field_name: 'payload_walking', kasse: 'A',
    caveat_wording: '"最大载荷: 30 kg"',
    caveat: 'Maximum load. The marketing card uses the same 30kg figure to claim a 1:1 load-to-weight ratio based on a 30kg-own-weight claim, which contradicts the structured table’s 41kg — see the caveat on weight.' },
  { robot_id: 2211, field_name: 'speed', kasse: 'A',
    caveat_wording: '"最大速度: 6 m/s" "极限速度"',
    caveat: 'A separate limit speed of 8 m/s is also disclosed — not used as the main value, same principle as L1/L2/L1-W.' },
  { robot_id: 2211, field_name: 'slope', kasse: 'A',
    caveat_wording: '"最大爬坡角度: 45°" "45° 极限爬坡角度"',
    caveat: 'Maximum climbable slope angle, confirmed by the marketing card’s "45° limit slope angle" — no separate standard/limit split here, unlike L1/L1-W.' },
  { robot_id: 2211, field_name: 'obstacle_single', kasse: 'A',
    caveat_wording: '"80cm 垂直越障高度"',
    caveat: '80cm vertical obstacle-crossing height, from the page’s marketing card — kept separate from stair_step_continuous, which carries a different, lower figure in the structured spec table. Same two-field pattern as L2/L1-W.' },
  { robot_id: 2211, field_name: 'stair_step_continuous', kasse: 'A',
    caveat_wording: '"连续攀爬楼梯高度" "25cm 持续攀爬台阶"',
    caveat: 'Label: continuous stair-climbing height, in the structured spec table, confirmed by the marketing card.' },
  { robot_id: 2211, field_name: 'temperature_min', kasse: 'A',
    caveat_wording: '"-20℃ ~ 55℃ 工作温度，可选配 -40℃ ~ 80℃ 宽温电池版本"',
    caveat: 'The base specification (-20 to 55°C) is used; the wider -40 to 80°C is only an optional battery version, not standard.' },
  { robot_id: 2211, field_name: 'temperature_max', kasse: 'A',
    caveat_wording: '"宽温电池版本"',
    caveat: 'Same caveat as temperature_min: -40 to 80°C is an optional wide-temperature battery version, not the base configuration.' },
  { robot_id: 2211, field_name: 'battery_wh', kasse: 'A',
    caveat_wording: '"电池" "54 V，9.35 Ah × 2；双电池，热插拔"',
    caveat: 'The accessories list discloses: 54V, 2× 9.35Ah, dual battery, hot-swap. Wh is NOT printed directly, and we do not calculate Wh from Ah × V (rule 9).' },
  { robot_id: 2211, field_name: 'runtime', kasse: 'A',
    caveat_wording: '"续航时间: 空载 5 h；满载 3.5 h" "最大载荷: 30 kg" "续航里程: 空载 29 km；满载 18 km"',
    caveat: '5h unloaded / 3.5h full load. Qualitative load condition (unloaded/full), no kg figure tied directly to this row — hence the load condition is stated as not disclosed, even though a separate maximum-load figure of 30kg sits elsewhere on the page. A range is also disclosed; the schema has no range field.' },
  { robot_id: 2211, field_name: 'hot_swap', kasse: 'A',
    caveat_wording: '"双电池 热插拔" "电池: 54 V，9.35 Ah × 2；双电池，热插拔"',
    caveat: 'Confirmed in two places on the same page: the marketing card (dual battery, hot-swap) and the accessories list (battery: 54V, 9.35Ah × 2; dual battery, hot-swap).' },
  { robot_id: 2211, field_name: 'charging_time', kasse: 'A',
    caveat_wording: '"充电时长: ＜ 2 h"',
    caveat: 'Charging time.' },
  { robot_id: 2211, field_name: 'docking_station', kasse: 'A',
    caveat_wording: '"充电座: 标配" "可选配智能充电桩，支持低电量自主返回充电"',
    caveat: 'Accessories list: charging dock, standard equipment. The marketing text separately mentions an optional smart charging station supporting autonomous return-to-charge on low battery — optional only, not standard. Same two-tier pattern as L1/L2’s docking_station.' },
  { robot_id: 2211, field_name: 'lidar', kasse: 'A',
    caveat_wording: '"3D激光雷达: 支持" "96线激光雷达"',
    caveat: 'In the structured sensor section — confirms presence, but neither line count, model nor manufacturer is disclosed (unlike L2-W Ultra, which names its LiDAR).',
    value_text: '3D LiDAR (type and model not disclosed)' },
  { robot_id: 2211, field_name: 'cameras', kasse: 'A',
    caveat_wording: '"相机类型: 广角相机 x 2, DFOV 122°，HFOV 111°，VFOV 70°" "相机像索: 800万 x 2" "深度相机" "RTK定位模块"',
    caveat: 'The sensor section also mentions a depth camera and an RTK positioning module without further specification — the schema has no dedicated field for either.',
    value_text: '2× wide-angle camera, 8 MP each, DFOV 122° / HFOV 111° / VFOV 70°' },
  { robot_id: 2211, field_name: 'compute', kasse: 'A',
    caveat_wording: '"基础算力: 8 核高性能 CPU （100TOPS）"',
    caveat: 'Base compute: 8-core high-performance CPU, 100 TOPS.' },
  { robot_id: 2211, field_name: 'sdk_languages', kasse: 'A',
    caveat_wording: '"genisom_robot_sdk" "Programming Language: C++" "genisom_L1_sdk" "Official SDK for the Genisom AI L1 Series, providing long-term support and maintenance for stable development, integration, and deployment." "铜锤"',
    caveat: 'INVESTIGATED, BUT NOT SET. GENISOM AI’s GitHub organisation (zsibot) has a repo "genisom_robot_sdk" (README: Programming Language: C++, Ubuntu 22.04/CMake/GCC/Boost), but the repo has NO GitHub description tying it to a specific product name (unlike "genisom_L1_sdk", whose description explicitly names the Genisom AI L1 Series). Neither "M1" nor "铜锤" (Tongchui) appears in the extracted README text. Using the repo for M1 would be the same kind of name-coincidence-without-evidence that was caught and rejected on L2’s ros2 field in the previous round — hence stated as not disclosed rather than a guess.' },
  { robot_id: 2211, field_name: 'autonomy_level', kasse: 'A',
    caveat_wording: '"选配"',
    caveat: 'Qualitative list from the manufacturer’s feature section, not a rating on a scale. Autonomous navigation is stated explicitly as OPTIONAL ("选配"), not standard.',
    value_text: 'AI reinforcement-learning motion control (standard); basic motions (march/glide/crawl positions, etc.; straight-line movement forward/back/left/right; rotation in place; knee-joint posture change; supports gravel/asphalt/grass/sand/forest floor/building-rubble terrain, etc.); special motions (climb high wall/cross obstacle plate/pass through narrow wall/wiggle, etc.); real-time image transmission; OTA updates; supports further development; autonomous navigation (optional: Zhihang Pro edition, mapping/positioning/navigation/avoidance); intelligent obstacle avoidance' },
  { robot_id: 2211, field_name: 'data_ports', kasse: 'A',
    caveat_wording: '"功能拓展接口: 千兆网口 ×2、USB 3.0 ×2、RS232 ×1、RS485 ×1、SBUS ×2、PPS ×1" "15 大标准硬件接口全开放"',
    caveat: 'From the structured spec table (2+2+1+1+2+1 = 9 named ports in total). The marketing text separately claims 15 standard interfaces in total — a higher, unspecified figure, NOT used as the field value. The 9 named ports are used because they are the only itemised source; the 15 figure is noted as an unresolved discrepancy, not silently corrected.' },

  // =============================================== 2212 (Tongchui M1 Pro)
  // Kilde: samme M1-side, techparams.json datas[1] classname "铜锤 M1 Pro" ·
  // id 226 (INGEN separat URL - fane-skift paa M1's side).
  { robot_id: 2212, field_name: 'weight', kasse: 'A',
    caveat_wording: '"整机重量（含电池）: 41 kg" "约 30kg"',
    caveat: 'In M1 Pro’s own spec table (id 497) — identical to the base version, NO "约" (approx.) mark. CONTRADICTED by the page’s site-wide marketing card ("约 30kg") — see the top note. Rule 9: not silently corrected.' },
  { robot_id: 2212, field_name: 'height', kasse: 'A',
    caveat_wording: '"站立尺寸（长 × 宽 × 高）: 930 × 480 × 595 mm" "趴地尺寸"',
    caveat: '10mm higher than the base version’s 585mm. The prone (lying-down) measurement is 930×630×210mm; the schema has no field for that state.' },
  { robot_id: 2212, field_name: 'degrees_of_freedom', kasse: 'A',
    caveat_wording: '"关节电机数量: 12 个"',
    caveat: 'Number of joint motors, in M1 Pro’s own data block — identical to the base version.' },
  { robot_id: 2212, field_name: 'payload_walking', kasse: 'A',
    caveat_wording: '"最大载荷: 30 kg"',
    caveat: 'Maximum load, in M1 Pro’s own data block — identical to the base version.' },
  { robot_id: 2212, field_name: 'speed', kasse: 'A',
    caveat_wording: '"最大速度: 6 m/s" "极限速度"',
    caveat: 'Identical to the base version. A separate limit speed of 8 m/s is also disclosed, not used as the main value (same principle as the base version).' },
  { robot_id: 2212, field_name: 'slope', kasse: 'A',
    caveat_wording: '"最大爬坡角度: 45°"',
    caveat: 'Maximum climbable slope angle, in M1 Pro’s own data block — identical to the base version.' },
  { robot_id: 2212, field_name: 'obstacle_single', kasse: 'A',
    caveat_wording: '"80cm 垂直越障高度"',
    caveat: 'From the page’s SITE-WIDE marketing card, NOT from M1 Pro’s own JSON block (which has no separate field for this value). Same source and caveat as the base version’s corresponding field — see the top note.' },
  { robot_id: 2212, field_name: 'stair_step_continuous', kasse: 'A',
    caveat_wording: '"连续攀爬楼梯高度: 25 cm"',
    caveat: 'In M1 Pro’s OWN data block (id 498) — identical to the base version, but this time directly from the tab itself, not a site-wide value.' },
  { robot_id: 2212, field_name: 'temperature_min', kasse: 'A',
    caveat_wording: '"-20℃ ~ 55℃ 工作温度，可选配 -40℃ ~ 80℃ 宽温电池版本"',
    caveat: 'Base specification used; the wider -40 to 80°C is an optional battery version, not standard (identical caveat to the base version).' },
  { robot_id: 2212, field_name: 'temperature_max', kasse: 'B',
    caveat_wording: null,
    caveat: 'Same caveat as temperature_min.' },
  { robot_id: 2212, field_name: 'battery_wh', kasse: 'A',
    caveat_wording: '"电池: 54 V，9.35 Ah × 2；双电池，热插拔"',
    caveat: 'The accessories list discloses this — identical to the base version. Wh is not printed directly and is not calculated from V × Ah (rule 9).' },
  { robot_id: 2212, field_name: 'runtime', kasse: 'A',
    caveat_wording: '"续航时间: 空载 5 h；满载 3.5 h" "续航里程: 空载 29 km；满载 18 km"',
    caveat: 'In M1 Pro’s own data block — identical to the base version. Qualitative load condition (unloaded/full), no kg figure tied directly — hence the load condition is stated as not disclosed. A range is also disclosed; the schema has no range field.' },
  { robot_id: 2212, field_name: 'hot_swap', kasse: 'A',
    caveat_wording: '"电池: 54 V，9.35 Ah × 2；双电池，热插拔"',
    caveat: 'Battery: 54V, 9.35Ah × 2; dual battery, hot-swap, in M1 Pro’s own accessories list — identical to the base version.' },
  { robot_id: 2212, field_name: 'charging_time', kasse: 'A',
    caveat_wording: '"充电时长: ＜ 2 h"',
    caveat: 'Charging time, in M1 Pro’s own data block — identical to the base version.' },
  { robot_id: 2212, field_name: 'docking_station', kasse: 'A',
    caveat_wording: '"充电座: 标配" "充电桩: 选配"',
    caveat: 'Accessories list: standard equipment. A separate optional charging station is also disclosed — same two-tier pattern as the base version.' },
  { robot_id: 2212, field_name: 'lidar', kasse: 'A',
    caveat_wording: '"3D激光雷达: 支持"',
    caveat: '3D LiDAR: supported, in M1 Pro’s own sensor section — identical to the base version, neither line count, model nor manufacturer disclosed.',
    value_text: '3D LiDAR (type and model not disclosed)' },
  { robot_id: 2212, field_name: 'cameras', kasse: 'A',
    caveat_wording: '"相机类型: 广角相机 x 2, DFOV 122°，HFOV 111°，VFOV 70°" "相机像索: 800万 x 2" "超声波传感器: 支持"',
    caveat: 'In M1 Pro’s own sensor section — identical to the base version (note: same camera layout as the base M1, NOT M1 Ultra’s fisheye array). M1 Pro’s sensor section additionally adds an ultrasonic sensor, beyond the base version’s IMU/3D LiDAR/depth camera/RTK — no schema field for the ultrasonic sensor, noted here.',
    value_text: '2× wide-angle camera, 8 MP each, DFOV 122° / HFOV 111° / VFOV 70°' },
  { robot_id: 2212, field_name: 'compute', kasse: 'A',
    caveat_wording: '"基础算力: 8 核高性能 CPU （100TOPS）"',
    caveat: 'In M1 Pro’s own data block — identical to the base version (note: DIFFERS from M1 Ultra’s 6-core/128 TOPS).' },
  { robot_id: 2212, field_name: 'sdk_languages', kasse: 'B',
    caveat_wording: null,
    caveat: 'NOT RE-EXAMINED IN THIS SESSION — see the top note. Carried over from the base version’s conclusion (same manufacturer GitHub, no product name in the README), NOT a fresh measurement for M1 Pro specifically.' },
  { robot_id: 2212, field_name: 'autonomy_level', kasse: 'A',
    caveat_wording: '"目标追踪" "语音对讲" "录音广播" "自主导航" "选配"',
    caveat: 'From M1 Pro’s own feature list (id 501). Four points beyond the base version: target tracking, voice intercom, audio recording/broadcast, plus that "autonomous navigation" appears here WITHOUT the "optional" prefix — see the top note.',
    value_text: 'AI reinforcement-learning motion control (standard); basic motions (march/glide/crawl positions, etc.; straight-line movement forward/back/left/right; rotation in place; knee-joint posture change; supports gravel/asphalt/grass/sand/forest floor/building-rubble terrain, etc.); special motions (climb high wall/cross obstacle plate/pass through narrow wall/wiggle, etc.); real-time image transmission; OTA updates; supports further development; target tracking (UWB following; laser-vision following); autonomous navigation (Zhihang Pro edition: mapping/positioning/navigation/avoidance — standard, NOT marked optional for this variant); intelligent obstacle avoidance; voice intercom (supported); audio recording/broadcast (supported)' },
  { robot_id: 2212, field_name: 'data_ports', kasse: 'A',
    caveat_wording: '"功能拓展接口: 千兆网口 ×2、USB 3.0 ×2、RS232 ×1、RS485 ×1、SBUS ×2、PPS ×1" "15 大标准硬件接口全开放"',
    caveat: 'In M1 Pro’s own data block — identical to the base version (9 named ports). The page’s site-wide marketing text separately claims 15 standard interfaces — a higher, unspecified figure, NOT used as the field value (same unresolved discrepancy as the base version).' },

  // ============================================= 2213 (Tongchui M1 Ultra)
  // Kilde: samme M1-side, techparams.json datas[2] classname
  // "铜锤 M1 Ultra" · id 227 (INGEN separat URL).
  { robot_id: 2213, field_name: 'weight', kasse: 'A',
    caveat_wording: '"整机重量（含电池）: 41 kg" "约 30kg"',
    caveat: 'In M1 Ultra’s own spec table (id 504) — identical to the base version and M1 Pro. CONTRADICTED by the page’s site-wide marketing card, same self-contradiction as M1 Pro. Not silently corrected.' },
  { robot_id: 2213, field_name: 'height', kasse: 'A',
    caveat_wording: '"站立尺寸（长 × 宽 × 高）: 930 × 480 × 595 mm" "趴地尺寸"',
    caveat: 'Identical to M1 Pro, 10mm higher than the base version’s 585mm. The prone (lying-down) measurement is 930×630×210mm; the schema has no field for that state.' },
  { robot_id: 2213, field_name: 'degrees_of_freedom', kasse: 'A',
    caveat_wording: '"关节电机数量: 12 个"',
    caveat: 'Number of joint motors, in M1 Ultra’s own data block — identical to the base version and M1 Pro.' },
  { robot_id: 2213, field_name: 'payload_walking', kasse: 'A',
    caveat_wording: '"最大载荷: 30 kg"',
    caveat: 'Maximum load, in M1 Ultra’s own data block — identical to the base version and M1 Pro.' },
  { robot_id: 2213, field_name: 'speed', kasse: 'A',
    caveat_wording: '"最大速度: 6 m/s" "极限速度"',
    caveat: 'Identical to the base version and M1 Pro. A separate limit speed of 8 m/s is also disclosed, not used as the main value.' },
  { robot_id: 2213, field_name: 'slope', kasse: 'A',
    caveat_wording: '"最大爬坡角度: 45°"',
    caveat: 'Maximum climbable slope angle, in M1 Ultra’s own data block — identical to the base version and M1 Pro.' },
  { robot_id: 2213, field_name: 'obstacle_single', kasse: 'A',
    caveat_wording: '"80cm 垂直越障高度"',
    caveat: '80cm vertical obstacle-crossing height, from the page’s SITE-WIDE marketing card, NOT from M1 Ultra’s own JSON block. Same source and caveat as the base version/M1 Pro.' },
  { robot_id: 2213, field_name: 'stair_step_continuous', kasse: 'A',
    caveat_wording: '"连续攀爬楼梯高度: 25 cm"',
    caveat: 'In M1 Ultra’s OWN data block (id 505) — identical to the base version and M1 Pro, directly from the tab itself.' },
  { robot_id: 2213, field_name: 'temperature_min', kasse: 'A',
    caveat_wording: '"-20℃ ~ 55℃ 工作温度，可选配 -40℃ ~ 80℃ 宽温电池版本"',
    caveat: 'Operating temperature -20 to 55°C, optional: -40 to 80°C wide-temperature battery version — the base specification is used; the wider range is an optional battery version, not standard.' },
  { robot_id: 2213, field_name: 'temperature_max', kasse: 'B',
    caveat_wording: null,
    caveat: 'Same caveat as temperature_min.' },
  { robot_id: 2213, field_name: 'battery_wh', kasse: 'A',
    caveat_wording: '"电池: 54 V，9.35 Ah × 2；双电池，热插拔"',
    caveat: 'The accessories list discloses this — identical to the base version and M1 Pro. Wh is not printed directly and is not calculated from V × Ah (rule 9).' },
  { robot_id: 2213, field_name: 'runtime', kasse: 'A',
    caveat_wording: '"续航时间: 空载 5 h；满载 3.5 h" "续航里程: 空载 29 km；满载 18 km"',
    caveat: 'Runtime: unloaded 5h, full load 3.5h, in M1 Ultra’s own data block — identical to the base version and M1 Pro. Qualitative load condition, no kg figure tied directly — hence the load condition is stated as not disclosed. A range (unloaded 29km, full load 18km) is also disclosed; the schema has no range field.' },
  { robot_id: 2213, field_name: 'hot_swap', kasse: 'A',
    caveat_wording: '"电池: 54 V，9.35 Ah × 2；双电池，热插拔"',
    caveat: 'Battery: 54V, 9.35Ah × 2; dual battery, hot-swap, in M1 Ultra’s own accessories list — identical to the base version and M1 Pro.' },
  { robot_id: 2213, field_name: 'charging_time', kasse: 'A',
    caveat_wording: '"充电时长: ＜ 2 h"',
    caveat: 'Charging time, in M1 Ultra’s own data block — identical to the base version and M1 Pro.' },
  { robot_id: 2213, field_name: 'docking_station', kasse: 'A',
    caveat_wording: '"充电座: 标配" "充电桩: 选配"',
    caveat: 'Accessories list: standard equipment. A separate optional charging station is also disclosed — same two-tier pattern as the base version and M1 Pro.' },
  { robot_id: 2213, field_name: 'lidar', kasse: 'A',
    caveat_wording: '"3D激光雷达: 支持"',
    caveat: '3D LiDAR: supported, in M1 Ultra’s own sensor section — identical to the base version and M1 Pro, neither line count, model nor manufacturer disclosed.',
    value_text: '3D LiDAR (type and model not disclosed)' },
  { robot_id: 2213, field_name: 'cameras', kasse: 'A',
    caveat_wording: '"相机类型: 鱼眼相机 x 4 + 前向双目相机 x 2 环视成像" "相机像索: 鱼眼300万，双目200万" "广角相机 x 2" "800万 x 2" "超声波传感器: 支持"',
    caveat: 'In M1 Ultra’s own sensor section — a COMPLETELY DIFFERENT layout from the base version’s/M1 Pro’s (2× wide-angle camera, 8MP each). See the top note. The sensor section also has an ultrasonic sensor, same as M1 Pro, beyond IMU/3D LiDAR/depth camera/RTK — no schema field for the ultrasonic sensor.',
    value_text: '4× fisheye camera + 2× forward-facing stereo camera for surround-view imaging; fisheye 3 MP, stereo 2 MP' },
  { robot_id: 2213, field_name: 'compute', kasse: 'A',
    caveat_wording: '"基础算力: 6核高性能CPU（128TOPS）" "8 核高性能 CPU （100TOPS）"',
    caveat: 'In M1 Ultra’s own data block — DIFFERS from the base version’s/M1 Pro’s (fewer cores, higher TOPS). See the top note.',
    value_text: '6-core CPU, 128 TOPS' },
  { robot_id: 2213, field_name: 'sdk_languages', kasse: 'B',
    caveat_wording: null,
    caveat: 'NOT RE-EXAMINED IN THIS SESSION — see the top note. Carried over from the base version’s conclusion, NOT a fresh measurement for M1 Ultra specifically.' },
  { robot_id: 2213, field_name: 'autonomy_level', kasse: 'A',
    caveat_wording: '"自主导航" "选配：智航Pro版" "智航Pro版"',
    caveat: 'From M1 Ultra’s own feature list (id 508), 11 points in total. NOTE: NO explicit "autonomous navigation" row in this list, unlike the base version (optional) and M1 Pro (standard) — see the top note. Not assumed to be added.',
    value_text: 'AI reinforcement-learning motion control (standard); basic motions (march/glide/crawl positions, etc.; straight-line movement forward/back/left/right; rotation in place; knee-joint posture change; supports gravel/asphalt/grass/sand/forest floor/building-rubble terrain, etc.); special motions (climb high wall/cross obstacle plate/pass through narrow wall/wiggle, etc.); real-time image transmission; OTA updates; supports further development; target tracking (UWB following; laser-vision following); 720° 3D surround-view perception system (supported); intelligent obstacle avoidance; voice intercom (supported); audio recording/broadcast (supported)' },
  { robot_id: 2213, field_name: 'data_ports', kasse: 'A',
    caveat_wording: '"功能拓展接口: 千兆网口 ×2、USB 3.0 ×2、RS232 ×1、RS485 ×1、SBUS ×2、PPS ×1" "15 大标准硬件接口全开放"',
    caveat: 'In M1 Ultra’s own data block — identical to the base version and M1 Pro (9 named ports). The page’s site-wide marketing text separately claims 15 standard interfaces — NOT used as the field value.' },
];

// applications.note only — note_wording/quote/quote_wording er UDEN FOR
// kolonnelisten i BRIEF-FAELLES.md og roeres ikke (se rapportens fund).
const APPLICATIONS = [
  { robot_id: 2205,
    note: 'Own translation: "Gangben L1 is GENISOM AI’s own first industrial-grade small quadruped robot ... widely used in power-grid inspection, emergency rescue, security patrol, research and education." 电力巡检 (power-grid inspection) -> inspection; 应急救援 (emergency rescue) -> defense and emergency response; 安防巡逻 (security patrol) -> security and surveillance; 科研教育 (research and education) -> research and development (the education part of 科研教育 has no precise match in the value set beyond consumer and education, which is not used here, since the context is professional research, not a consumer product).' },
  { robot_id: 2206,
    note: 'From the section "下一个应用场景，它已提前就位" (next application scenario, already in place) on L1-W’s own product page — four separate quotes, not inherited from L1. Own translation: 侦查搜救 (reconnaissance/search-and-rescue) -> defense and emergency response; 应急消防 (emergency firefighting) -> defense and emergency response (same category as 侦查搜救, two quotes); 科研教育 -> research and development; 安防巡逻 -> security and surveillance.' },
  { robot_id: 2207,
    note: 'From the section "下一个应用场景，它已提前就位" (next application scenario, already in place). 安防巡逻 -> security and surveillance; 科研教育 -> research and development; 短途配送 (short-distance delivery) -> logistics.' },
  { robot_id: 2208,
    note: 'From the section "下一个应用场景，它已提前就位" on L2’s product page. The text appears ONCE on the page, BEFORE the variant tabs (L2/L2-W/L2-W Ultra), in the structured spec table — it covers the whole Gangben L2 family as a whole, not just the base version. Quoted independently from the same URL, NOT via inherited_from: it is the same primary source for all three variants, not an inference about another robot (inherited_from would presuppose that L2-W’s OWN page was silent and borrowed L2’s quote — it is not: the text sits on the very page L2-W also lives on). Own translation: 安防巡逻 -> security and surveillance; 应急消防 (emergency firefighting) -> defense and emergency response; 科研教育 -> research and development; 短途配送 (short-distance delivery) -> logistics. NOTE: this quote has FOUR items (incl. 应急消防), while genisom-gangben-l2.yaml’s existing quote has only three (missing 应急消防) — an independent re-reading of the same raw HTML for this entry. The existing L2 entry is NOT corrected, per the task’s instruction not to touch the two existing entries.' },
  { robot_id: 2209,
    note: 'Same section and same reasoning as genisom-gangben-l2-w.yaml: the text "下一个应用场景，它已提前就位" (next application scenario, already in place) appears ONCE on the L2 page for the whole Gangben L2 family, before the variant tabs. Quoted independently from the same URL, not via inherited_from. Own translation: 安防巡逻 -> security and surveillance; 应急消防 -> defense and emergency response; 科研教育 -> research and development; 短途配送 -> logistics.' },
  { robot_id: 2210,
    note: 'Own translation: "GENISOM Qiuqiu SP1 is an explosion-proof quadruped inspection robot for high-risk industrial environments such as petrochemicals and energy stations" (meta description) and "Autonomous inspection, data transmission, zero personnel risk" (marketing headline, 自主巡检 = autonomous inspection). The page’s OWN "next application scenario" section ("下一个应用场景，它已提前就位") lists FOUR FACILITY TYPES, not activity categories: 炼化装置区 (refinery plant area), 化工储罐区 (chemical storage tank area), 燃气/LNG场站 (gas/LNG station), 油气管线 (oil/gas pipeline) — none of them is a verbatim activity category in the schema’s allowed set, so they are NOT used as quote/value here. Instead, industrial/inspection is derived from the meta description’s 高危工业环境 (high-risk industrial environment) and 防爆...巡检机器人 (explosion-proof ... inspection robot), plus the body text’s explicit 自主巡检 (autonomous inspection).' },
  { robot_id: 2211,
    note: 'From the section "下一个应用场景，它已提前就位" (next application scenario, already in place) on M1’s own product page. Own translation: 森林消防 (forest firefighting) -> defense and emergency response; 石化消防 (petrochemical firefighting) -> defense and emergency response (same category, two quotes); 电力巡检 (power-grid inspection) -> inspection; 园区巡逻 (site patrol) -> security and surveillance; 物流运输 (logistics transport) -> logistics.' },
  { robot_id: 2212,
    note: 'From the section "下一个应用场景，它已提前就位" (next application scenario, already in place) on M1’s own product page. The text appears ONCE on the page, shared by all three tabs (M1/M1 Pro/M1 Ultra) in the structured spec table — it covers the whole Tongchui M1 family as a whole. Quoted independently from the same URL, NOT via inherited_from: it is the same primary source for all three variants, not an inference borrowed from another robot’s page (same principle as GENISOM Gangben L2-W/L2-W Ultra in this catalogue — inherited_from would presuppose that M1 Pro’s OWN page was silent and borrowed M1’s quote, which it is not: the text sits on the very page M1 Pro also lives on). Own translation — identical to genisom-tongchui-m1.yaml’s: 森林消防 (forest firefighting) -> defense and emergency response; 石化消防 (petrochemical firefighting) -> defense and emergency response; 电力巡检 (power-grid inspection) -> inspection; 园区巡逻 (site patrol) -> security and surveillance; 物流运输 (logistics transport) -> logistics.' },
  { robot_id: 2213,
    note: 'Same source section as genisom-tongchui-m1-pro.yaml and the base version ("下一个应用场景，它已提前就位") — the same primary source for all three variants, NOT inherited_from. See genisom-tongchui-m1-pro.yaml for the full reasoning for why inherited_from is not used here.' },
];

const IMAGES = [
  { robot_id: 2208,
    note: 'Shared photo with genisom-gangben-l2.yaml (the base version): L2-W exists only as a tab switch on L2’s own page and has no standalone product page, so the manufacturer likewise has no separate product photo for this variant specifically — same image URL as the existing L2 entry.' },
  { robot_id: 2209,
    note: 'Shared photo with genisom-gangben-l2.yaml and genisom-gangben-l2-w.yaml: L2-W Ultra exists only as a tab switch on L2’s own page and has no standalone product page or its own product photo, even though it physically carries an extra LiDAR sensor package (see the notes in the fields). Same image URL as the other two L2 entries.' },
  { robot_id: 2211,
    note: 'Shared photo: M1’s product page shows the same model across the M1/M1 Pro/M1 Ultra tabs (only one card thumbnail image found for the whole family) — Pro and Ultra get the same photo (see genisom-tongchui-m1-pro.yaml and genisom-tongchui-m1-ultra.yaml).' },
  { robot_id: 2212,
    note: 'Shared photo with genisom-tongchui-m1.yaml (the base version) and genisom-tongchui-m1-ultra.yaml: M1 Pro exists only as a tab switch on M1’s own page, and the page shows the same product photo for the whole family.' },
  { robot_id: 2213,
    note: 'Shared photo with genisom-tongchui-m1.yaml and genisom-tongchui-m1-pro.yaml: M1 Ultra exists only as a tab switch on M1’s own page, even though it physically carries a different camera layout (720-degree surround view) than the other two — the manufacturer’s page nonetheless shows the same product photo for the whole family.' },
];

const ROBOTS = [
  { id: 2206,
    notes: [
      'NOT A DUPLICATE OF L1/L2: L1-W has its own product page, its own name, its own dimensions (630×430×485mm vs. L1’s 630×360×415mm) and a fourth wheel-motor group that L1 does not have. Clearly a standalone variant, not L1 under another name.',
    ],
    notes_wording: null },
  { id: 2207,
    notes: [
      'SENSOR DISCREPANCY, NOT SILENTLY RESOLVED: L2’s marketing text (same page) states that it supports automatic mapping and route planning, combined with LiDAR and GNSS for centimetre-level positioning — which implies LiDAR. But the STRUCTURED spec table (the same page’s window.techParamsData) lists ONLY IMU and a stereo camera under "sensors" for the base model L2 — NO lidar row. A lidar row exists ONLY under the L2-W Ultra variant in the same JSON. The lidar field is therefore set to not disclosed for the base model, not inferred from the marketing text — the two sources on the same page contradict each other, and this is not silently corrected.',
    ],
    notes_wording: [
      'SENSOR DISCREPANCY, NOT SILENTLY RESOLVED: L2’s marketing text (same page) states "支持自动建图与路径规划，结合激光雷达与GNSS实现厘米级定位" (supports automatic mapping and route planning, combined with LiDAR and GNSS for centimetre-level positioning) — which implies LiDAR. But the STRUCTURED spec table (the same page’s window.techParamsData) lists ONLY IMU and "双目相机" (stereo camera) under "传感器" (sensors) for the base model L2 — NO lidar row. A lidar row ("3D激光雷达: 工业级96线激光雷达*2") exists ONLY under the L2-W Ultra variant in the same JSON. The lidar field is therefore set to not disclosed for the base model, not inferred from the marketing text — the two sources on the same page contradict each other, and this is not silently corrected.',
    ] },
  { id: 2208,
    notes: [
      'THE MARKETING CARD’S FIGURES (70cm obstacle height, 756Wh battery, 86 TOPS) ARE DELIBERATELY NOT USED HERE: L2’s prominent hero marketing card appears ONCE for the whole page, before the tabs, and is not repeated in L2-W’s own JSON block. It matches L2’s (the base version’s) own figures exactly — but without an explicit repeat in L2-W’s own data block, it cannot be safely attributed to this variant specifically. obstacle_single, battery_wh and compute’s TOPS figure are therefore stated as not disclosed / without a TOPS figure here, unlike the existing L2 entry, which uses them for the base version.',
    ],
    notes_wording: [
      'THE MARKETING CARD’S FIGURES (70cm obstacle height, 756Wh battery, 86 TOPS) ARE DELIBERATELY NOT USED HERE: L2’s prominent hero marketing card ("70cm 垂直越障高度", "756Wh 大容量电池", "高达 86 TOPS 算力平台") appears ONCE for the whole page, before the tabs, and is not repeated in L2-W’s own JSON block. It matches L2’s (the base version’s) own figures exactly — but without an explicit repeat in L2-W’s own data block, it cannot be safely attributed to this variant specifically. obstacle_single, battery_wh and compute’s TOPS figure are therefore stated as not disclosed / without a TOPS figure here, unlike the existing L2 entry, which uses them for the base version.',
    ] },
  { id: 2209,
    notes: [
      'NO STANDALONE URL: same caveat as L2-W — exists solely as a tab switch on L2’s own page (https://www.genisomai.com/product-robot/L2, techParamsData.datas[2], classname "钢镚 L2-W Ultra", id 1250).',
      'THE MARKETING CARD’S FIGURES (70cm obstacle height, 756Wh battery) ARE DELIBERATELY NOT USED HERE: same caveat as L2-W — the hero marketing card’s figures appear once for the whole page and are not repeated in L2-W Ultra’s own data block, hence not attributed to this variant specifically.',
      'L2-W ULTRA HAS ITS OWN LIDAR SPECIFICATION, WHICH L2/L2-W DO NOT HAVE: the sensor section for this variant specifically names an industrial-grade 96-line LiDAR, 2 units — the only GENISOM entry in this track with a concrete LiDAR line count.',
    ],
    notes_wording: [
      'NO STANDALONE URL: same caveat as L2-W — exists solely as a tab switch on L2’s own page (https://www.genisomai.com/product-robot/L2, techParamsData.datas[2], classname "钢镚 L2-W Ultra", id 1250).',
      '',
      'L2-W ULTRA HAS ITS OWN LIDAR SPECIFICATION, WHICH L2/L2-W DO NOT HAVE: the sensor section for this variant specifically names "3D激光雷达: 工业级96线激光雷达*2" (industrial-grade 96-line LiDAR, 2 units) — the only GENISOM entry in this track with a concrete LiDAR line count.',
    ] },
  { id: 2211,
    notes: [
      'THE META DESCRIPTION CONTRADICTS THE STRUCTURED SPEC TABLE, NOT SILENTLY RESOLVED: the meta description claims 16 degrees of freedom, but the structured table (same page) explicitly states 12 joint motors — same pattern as L1/L2 (joint-motor count, not explicitly "degrees of freedom"). 12 is used as the field value because it appears in the structured table; the meta description’s figure of 16 is NOT used, and the discrepancy is noted here rather than silently corrected.',
      'WEIGHT DISCREPANCY ON THE SAME PAGE, NOT SILENTLY RESOLVED: see the caveat on weight below — the marketing text claims a "near-1:1 load-to-weight ratio" based on a "~30kg" weight, while the structured table says 41kg.',
      'COMPETITION AND MARATHON CLAIMS, QUOTED BUT NOT VERIFIED BEYOND THE MANUFACTURER’S OWN PAGE: the 2026 Beijing Yizhuang Robot Warrior Challenge — M1 was the only team to complete the autonomous-navigation discipline, and won first place in autonomous navigation, most awards, highest total score, and fastest in the quadruped category. Also: the first time globally an autonomously following robot completed a marathon alongside a human — M1 served as the world’s first autonomously following "sweep hare" (pacer) on a half marathon. Neither claim belongs in the 30 schema fields — noted here as a manufacturer quote, not as a verified third-party fact.',
    ],
    notes_wording: [
      'META DESCRIPTION "16个自由度" CONTRADICTS THE STRUCTURED SPEC TABLE, NOT SILENTLY RESOLVED: the meta description claims 16 degrees of freedom, but the structured table (same page) explicitly states "关节电机数量: 12 个" — same pattern as L1/L2 (joint-motor count, not explicitly degrees of freedom). 12 is used as the field value because it appears in the structured table; the meta description’s figure of 16 is NOT used, and the discrepancy is noted here rather than silently corrected.',
      '',
      'COMPETITION AND MARATHON CLAIMS, QUOTED BUT NOT VERIFIED BEYOND THE MANUFACTURER’S OWN PAGE: "2026北京亦庄机器人勇士挑战赛，铜锤M1 自主导航项目全场唯一完赛，并斩获四足机器人大类自主导航第一、奖项数第一、总分第一、速度第一" (the 2026 Beijing Yizhuang Robot Warrior Challenge — M1 was the only team to complete the autonomous-navigation discipline, and won first place in autonomous navigation, most awards, highest total score, and fastest in the quadruped category). Also: "全球首次由自主跟随机器人陪人类完成马拉松赛事...铜锤M1作为全球首个自主跟随的机器人"关门兔"完成半马陪跑任务" (the first time globally an autonomously following robot completed a marathon alongside a human — M1 served as the world’s first autonomously following "关门兔" (literally: closing-door rabbit, i.e. sweep hare/pacer) on a half marathon). Neither claim belongs in the 30 schema fields — noted here as a manufacturer quote, not as a verified third-party fact.',
    ] },
  { id: 2212,
    notes: [
      'AUTONOMOUS NAVIGATION IS STANDARD, NOT OPTIONAL, ON M1 PRO: the base version’s feature list states "autonomous navigation: OPTIONAL". M1 Pro’s own feature list for the SAME item states it plainly — WITHOUT the "optional" prefix. Read as a real difference, not an omission: M1 Pro ships with autonomous navigation as a standard feature.',
    ],
    notes_wording: [
      'AUTONOMOUS NAVIGATION IS STANDARD, NOT OPTIONAL, ON M1 PRO: the base version’s feature list states "自主导航: 选配：智航Pro版" (autonomous navigation: OPTIONAL: Zhihang Pro edition). M1 Pro’s own feature list for the SAME item states "自主导航: 智航Pro版" — WITHOUT the "选配" (optional) prefix. Read as a real difference, not an omission: M1 Pro ships with autonomous navigation as a standard feature.',
    ] },
  { id: 2213,
    notes: [
      'SAME PHYSICAL DIMENSIONS AS M1 PRO, NOT THE BASE VERSION: standing measurement 930×480×595mm and prone measurement 930×630×210mm — identical to M1 Pro, 10mm higher than the base version’s 585/200mm. Weight 41kg is identical across all three variants.',
      'CAMERA LAYOUT IS COMPLETELY DIFFERENT FROM THE BASE VERSION AND M1 PRO, NOT MERELY AN ADDITION: M1 Ultra’s sensor section states 4× fisheye camera + 2× forward-facing stereo camera for surround-view imaging, and fisheye 3MP, stereo 2MP — replacing (not supplementing) the base version’s/M1 Pro’s 2× wide-angle camera, 8MP each. The page’s body text confirms: four-way fisheye, forward-facing stereo camera — Tongchui M1 Ultra supports 720° panoramic perception, further improving depth perception and complex-environment recognition. M1 Ultra’s own feature list additionally adds the explicit item "720° 3D surround-view perception system, supported" — NOT present on either the base version or M1 Pro.',
      '"AUTONOMOUS NAVIGATION" IS ENTIRELY MISSING FROM M1 ULTRA’S OWN FEATURE LIST — A GENUINE OMISSION, NOT AN ASSUMPTION. The base version lists it as optional, M1 Pro lists it as standard (without/with the prefix), but M1 Ultra’s own feature list (id 508, 11 items in total: AI motion control, basic motions, special motions, real-time image transmission, OTA updates, further development, target tracking, 720° 3D surround-view, obstacle avoidance, voice intercom, audio recording/broadcast) CONTAINS NO such row at all. This is documented as found in the source, not assumed to be an omission or an error on our part — it could equally be a real product difference (e.g. M1 Ultra’s sensor package replaces the named "Zhihang Pro" navigation feature with something else) as an editorial oversight on the manufacturer’s own page. The autonomy_level field below reproduces only what the list actually contains.',
    ],
    notes_wording: [
      '',
      'CAMERA LAYOUT IS COMPLETELY DIFFERENT FROM THE BASE VERSION AND M1 PRO, NOT MERELY AN ADDITION: M1 Ultra’s sensor section states "相机类型: 鱼眼相机 x 4 + 前向双目相机 x 2 环视成像" (4× fisheye camera + 2× forward-facing stereo camera for surround-view imaging) and "相机像索: 鱼眼300万，双目200万" (fisheye 3MP, stereo 2MP) — replacing (not supplementing) the base version’s/M1 Pro’s "广角相机 x 2" "800万 x 2" (2× wide-angle camera, 8MP each). The page’s body text confirms: "四路鱼眼、前向双目相机 / 铜锤M1 Ultra 支持720° 全景感知，进一步提升深度感知与复杂环境识别能力。" (four-way fisheye, forward-facing stereo camera — Tongchui M1 Ultra supports 720° panoramic perception, further improving depth perception and complex-environment recognition). M1 Ultra’s own feature list additionally adds the explicit item "720° 3D 环视感知系统: 支持" (720° 3D surround-view perception system, supported) — NOT present on either the base version or M1 Pro.',
      '"自主导航" (AUTONOMOUS NAVIGATION) IS ENTIRELY MISSING FROM M1 ULTRA’S OWN FEATURE LIST — A GENUINE OMISSION, NOT AN ASSUMPTION. The base version lists it as optional ("选配：智航Pro版"), M1 Pro lists it as standard ("智航Pro版", without "选配"), but M1 Ultra’s own feature list (id 508, 11 items in total: AI强化学习运控, 基础动作, 特技动作, 实时图像传输, OTA升级, 二次开发, 目标追踪, 720°3D环视感知系统, 智能避障, 语音对讲, 录音广播) CONTAINS NO "自主导航" row at all. This is documented as found in the source, not assumed to be an omission or an error on our part — it could equally be a real product difference (e.g. M1 Ultra’s sensor package replaces the named "智航Pro" navigation feature with something else) as an editorial oversight on the manufacturer’s own page. The autonomy_level field below reproduces only what the list actually contains.',
    ] },
];

async function main() {
  const args = process.argv.slice(2);
  const skriv = args.includes('--skriv');

  laesDotEnv(path.join(ROD, '.env'));
  const U = process.env.SUPABASE_URL;
  const K = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!U || !K) {
    console.error('Kræver SUPABASE_URL og SUPABASE_SERVICE_ROLE_KEY i .env.');
    process.exitCode = 1;
    return;
  }
  const H = { apikey: K, Authorization: `Bearer ${K}` };
  const HW = { ...H, 'Content-Type': 'application/json', Prefer: 'return=representation' };

  console.log(`\n--- ${skriv ? 'SKRIVER' : 'TØRLØB'} ---\n`);

  async function patchEen(url, body, label) {
    console.log(label);
    if (!skriv) return true;
    const svar = await fetch(url, { method: 'PATCH', headers: HW, body: JSON.stringify(body) });
    const json = await svar.json();
    if (!svar.ok || !Array.isArray(json) || json.length !== 1) {
      console.error(`  AFBRUDT: ${label} — status ${svar.status}, ${json?.length ?? '?'} rækker`, json);
      process.exitCode = 1;
      return false;
    }
    console.log('  OK, 1 række opdateret.');
    return true;
  }

  let planlagte = 0;
  let udfoerte = 0;

  for (const r of FIELD_ENTRIES) {
    planlagte++;
    const body = {
      caveat: r.caveat,
      caveat_wording: r.caveat_wording,
      collected_by: COLLECTED_BY,
      change_reason: r.change_reason || REASON,
    };
    if ('value_text' in r) body.value_text = r.value_text;
    const url = `${U}/rest/v1/field_entries?robot_id=eq.${r.robot_id}&field_name=eq.${r.field_name}`;
    const ok = await patchEen(url, body, `field_entries ${r.robot_id}/${r.field_name} [kasse ${r.kasse}]`);
    if (ok) udfoerte++; else return;
  }

  for (const a of APPLICATIONS) {
    planlagte++;
    const body = { note: a.note, collected_by: COLLECTED_BY, change_reason: 'fase 2: applications.note oversat til engelsk, jf. L87' };
    const url = `${U}/rest/v1/applications?robot_id=eq.${a.robot_id}`;
    const ok = await patchEen(url, body, `applications ${a.robot_id}.note`);
    if (ok) udfoerte++; else return;
  }

  for (const im of IMAGES) {
    planlagte++;
    const body = { note: im.note, collected_by: COLLECTED_BY, change_reason: 'fase 2: images.note oversat til engelsk, jf. L87' };
    const url = `${U}/rest/v1/images?robot_id=eq.${im.robot_id}`;
    const ok = await patchEen(url, body, `images ${im.robot_id}.note`);
    if (ok) udfoerte++; else return;
  }

  for (const rb of ROBOTS) {
    planlagte++;
    const body = { notes: rb.notes, notes_wording: rb.notes_wording, collected_by: COLLECTED_BY, change_reason: 'fase 2: robots.notes oversat, notes_wording renset for dansk, jf. L87' };
    const url = `${U}/rest/v1/robots?id=eq.${rb.id}`;
    const ok = await patchEen(url, body, `robots ${rb.id}.notes + notes_wording`);
    if (ok) udfoerte++; else return;
  }

  console.log(`\n${skriv ? 'Skrevet' : 'Ville skrive'}: ${planlagte} opdateringer${skriv ? ` (${udfoerte} bekræftet)` : ''}.`);
  if (!skriv) console.log('Dette var et TØRLØB. Kør med --skriv for at skrive rent faktisk.');
}

const koertDirekte = process.argv[1] && import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`;
if (koertDirekte) {
  main().catch((err) => {
    console.error('f2-genisom-skriv: fejl —', err.message, err.stack);
    process.exitCode = 1;
  });
}

export { FIELD_ENTRIES, APPLICATIONS, IMAGES, ROBOTS };
