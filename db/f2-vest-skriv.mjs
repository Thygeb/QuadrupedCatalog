#!/usr/bin/env node
/**
 * db/f2-vest-skriv.mjs — spor/f2-vests skriveredskab (ejet af dette spor
 * alene). Oversætter/udskiller caveat + caveat_wording for de 13 vestlige
 * robotter i field_entries, renser value_text for dansk, oversætter
 * applications.note, images.note og robots.notes til engelsk.
 *
 * Kilde: fund/OPSKRIFT-fase2.md (kasse A/B/C) + L87 (fund/BRIEF-FAELLES.md).
 * Alle 127 caveats var kasse A (citat lå allerede i den danske prosa) —
 * ingen kasse D / L87-sletning fundet i field_entries. To robots.notes-
 * påstande (RIVR "Swiss-Mile"/ETH Zürich; Boston Dynamics "majoritetsejet
 * af Hyundai") kunne IKKE efterprøves mod nogen kilde og er derfor hverken
 * slettet eller oversat — de står i ROBOTS[].notes stadig på dansk, med en
 * UVERIFICERET-markering i kildekommentaren ved siden af.
 *
 * FØR nogen PATCH køres, tjekker --verificer (og hver --toerloeb/--skriv-
 * kørsel automatisk) hvert wording-fragment som en BOGSTAVELIG delstreng
 * af den relevante rå kildefil i media/_kilder/.
 *
 * Brug:
 *   node db/f2-vest-skriv.mjs --verificer     Kun kildetjek, ingen netværk mod DB.
 *   node db/f2-vest-skriv.mjs --toerloeb      Standard: viser hvad der VILLE ske.
 *   node db/f2-vest-skriv.mjs --skriv         Skriver rent faktisk, én PATCH pr. post.
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const ROD = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const KILDE_MAPPE = path.join(ROD, 'media/_kilder');
const COLLECTED_BY = 'spor/f2-vest';

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

const VEST = 'raa-vest-2026-08-19/';
const KAND3 = 'raa-kand3-2026-08-24/';
const ANV = 'raa-anvendelse-2026-08-19/';
const NEURA = 'raa-f2-vest-2026-09-02/';

const K = {
  anymal: VEST + 'anymal.txt',
  anymalx: VEST + 'anymalx.txt',
  bhairav: KAND3 + 'bhairav-shvana-robot.txt',
  spot: VEST + 'spot.txt',
  bd_spec: VEST + 'bd_spec.txt',
  ghost_home: VEST + 'ghost_home.txt',
  ghost_v60: VEST + 'v60.txt',
  ghost_spec: VEST + 'ghost_spec.txt',
  keybotic_tech: KAND3 + 'keybotic-technology.txt',
  keybotic_home: KAND3 + 'keybotic-home.txt',
  mab4: VEST + 'mab.txt',
  mab5: VEST + 'mab5.txt',
  neura_html: NEURA + 'neura-quadruped-produktside-2026-09-02.txt',
  neura_pdf: NEURA + 'neura-quadruped-datablad-2026-09-02.txt',
  rbq10: VEST + 'rbq10.txt',
  rbq_llms: VEST + 'rbq_llms.txt',
  railab: ANV + 'railab.txt',
  raibo2: ANV + 'raibo2-en.txt',
  rivrp: VEST + 'rivrp.txt',
};

// pdf.js (kopieret fra raa-vest-2026-08-19/pdf.js) joiner bogstaver med "~"
// som kerning-markoer (se dens egen MANIFEST-raekke). KUN filer udtrukket
// MED pdf.js skal have dem strippet foer et tekstsoegning - x.js-udtraek af
// HTML har aldrig haft dem, og et globalt strip ville fjerne AEGTE tilde-
// tegn (fx Bhairavs "~2-5 m/sec") fra de filer. Faelde fundet og rettet
// under --verificer, se rapporten.
const PDF_UDTRAEK = new Set([K.bd_spec, K.ghost_spec, K.neura_pdf]);

// pdf.js's egen dokumenterede fælde: den taber fi/fl-ligaturer. Genskab dem
// FØR sammenligning (samme regel som brugt konsekvent under research —
// "Certied"→"Certified" osv.), ellers fejler et ægte citat med et forkert
// ord, kildens PDF aldrig selv skrev. "en-US" er en ANDEN artefakt, fundet
// under dette spors research: PDF'ens sprogmærker (marked-content tags)
// lækker ind midt i ord/sætninger uden konsekvent mellemrum omkring sig.
// pdf.js' dokumenterede fi/fl-ligatur-fælde er IKKE en tabt bogstavsekvens
// (den ser sådan ud i terminalen, men er det ikke) — måletallet: den taber
// selve GLYFFEN og sætter styretegnet U+001F i stedet, fx "Certi\x1Fed". Set
// visuelt ligner det "Certied", men er det ikke; \x1F skal erstattes med
// "fi" (pdf.js' egen note nævner kun fi/fl-eksempler).
const LIGATUR_FIKS = [
  [/\x1f/g, 'fi'],
  [/en-US/g, ''],
  [/sub-merged/g, 'submerged'], // orddelingsbindestreg blottet af en-US-strip (ghost_spec.txt)
];

// Kendte HTML-udtraeksartefakter, fundet under research: siden bruger CSS-
// baseret orddeling (hyphens:auto), og x.js' regex-strip efterlader en synlig
// bindestreg + mellemrum midt i et ord. Ét kendt tilfaelde, rettet stedligt
// frem for et generelt orddelings-fix.
const HTML_ARTEFAKT_FIKS = {
  [K.ghost_v60]: [[/Percep- tion/g, 'Perception']],
};

// x.js (HTML-udtraekket, se raa-vest-2026-08-19/x.js) afkoder kun TI navngivne
// entiteter (nbsp, amp, gt, lt, #8211, #8212, quot, #039/#39, deg, times) -
// IKKE numeriske entiteter som "&#215;" (×) eller "&#8217;" (') fra andre
// kilder (fx Keybotics WordPress-side). Afkod dem her, ellers fejler et
// citat, der matcher visuelt men ikke i den gemte tekst.
const ENTITET_FIKS = [
  [/&#215;/g, '×'], [/&#8217;/g, '’'], [/&#8216;/g, '‘'],
  [/&#8220;/g, '“'], [/&#8221;/g, '”'], [/&#038;/g, '&'],
];

const kildeCache = new Map();
function laesKilde(rel) {
  if (kildeCache.has(rel)) return kildeCache.get(rel);
  const fuld = path.join(KILDE_MAPPE, rel);
  let indhold = fs.existsSync(fuld) ? fs.readFileSync(fuld, 'utf8') : null;
  if (indhold !== null) {
    for (const [re, erstat] of ENTITET_FIKS) indhold = indhold.replace(re, erstat);
  }
  if (indhold !== null && PDF_UDTRAEK.has(rel)) {
    indhold = indhold.replace(/~/g, '');
    for (const [re, erstat] of LIGATUR_FIKS) indhold = indhold.replace(re, erstat);
  }
  if (indhold !== null && HTML_ARTEFAKT_FIKS[rel]) {
    for (const [re, erstat] of HTML_ARTEFAKT_FIKS[rel]) indhold = indhold.replace(re, erstat);
  }
  kildeCache.set(rel, indhold);
  return indhold;
}

/** Splitter et wording-felt i sine kildefragmenter, adskilt med " | ". */
function fragmenter(wording) {
  if (!wording) return [];
  return wording.split(' | ').map((s) => s.trim()).filter(Boolean);
}

/** Matcher fragmentet mod kilden med ETHVERT hvidrum (mellemrum, linjeskift)
 *  gjort ligegyldigt: kildens tabeller lægger ofte etiket og værdi i to
 *  adskilte DOM-elementer (label\nvaerdi, eller "a  b" med dobbelt mellemrum
 *  fra pdf.js' tilde-samlinger) — se OPSKRIFT-fase2.md §6.2. Alt andet end
 *  hvidrum skal matche ordret. */
// Hvidrum (mellemrum, linjeskift, ELLER slet ingen adskillelse — se
// "ObjectAvoidance"-fælden, hvor to ord er klistret sammen af PDF-udtraekket)
// er uden betydning for om et citat findes — kun de ANDRE tegn skal matche
// ordret. Strippes derfor helt fra begge sider foer sammenligning; det er
// forsvarligt her, fordi det er SELVE ORDENE, der skal efterproeves mod
// kilden, ikke kildens tilfaeldige DOM-formatering (som vi alligevel ikke
// skriver videre til databasen).
// rbq_llms.txt er producentens RAA markdown/HTML-hybrid (aldrig koert
// gennem x.js) og baerer bogstavelige <strong>-tags og **fed**-stjerner midt
// i saetninger. De baerer ingen paastand i sig selv - fjern dem sammen med
// hvidrum foer sammenligning, af samme grund som hvidrum fjernes.
const stripHvidrum = (s) => s.replace(/<[^>]*>/g, '').replace(/\*\*/g, '').replace(/\s+/g, '');

function verificerFragment(fragment, kildeRel) {
  const indhold = laesKilde(kildeRel);
  if (indhold === null) return { ok: false, grund: `kildefil mangler: ${kildeRel}` };
  if (indhold.includes(fragment)) return { ok: true };
  // "..." markerer en BEVIDST udeladelse (citationskonvention) - hver del
  // FØR/EFTER skal findes hver for sig, ikke hele strengen under ét.
  const dele = fragment.includes('...')
    ? fragment.split('...').map((d) => d.trim()).filter(Boolean)
    : [fragment];
  const indholdStrippet = stripHvidrum(indhold);
  const alleFundet = dele.every((d) => indholdStrippet.includes(stripHvidrum(d)));
  if (alleFundet) return { ok: true, normaliseret: true };
  return { ok: false, grund: `IKKE fundet ordret (heller ikke med hvidrum fjernet) i ${kildeRel}` };
}

/* ------------------------------------------------------------------ data */
// FIELD_ENTRIES: caveat (engelsk prosa) + caveat_wording (kildens ord,
// evt. flere fragmenter adskilt af " | ") + valgfri value_text (kun når den
// aendres). kilde peger paa K{} ovenfor. wordingKilder bruges naar et
// felts fragmenter kommer fra FLERE filer (fx produktside + datablad).

const FIELD_ENTRIES = [
  // ---------------------------------------------------- 2184 ANYbotics ANYmal
  { robot_id: 2184, field_name: 'payload_walking', kilde: K.anymal,
    caveat_wording: 'an additional 10 kg payload',
    caveat: "The manufacturer states 'an additional 10 kg payload' (see caveat_wording) and does not distinguish between walking and standing payload. Placing this value under walking payload is our interpretation, not a direct reading. The word 'additional' is the manufacturer's own." },
  { robot_id: 2184, field_name: 'speed', kilde: K.anymal,
    caveat_wording: 'Normal walking speed',
    caveat: "The label is 'Normal walking speed', NOT maximum (see caveat_wording). This figure is therefore not comparable to other entries' maximum figures. The metric/imperial cross-check agrees." },
  { robot_id: 2184, field_name: 'runtime', kilde: K.anymal,
    caveat_wording: 'Walking range (90 - 120 min) per charge',
    caveat: "The same page also states 'Walking range (90 - 120 min) per charge' (see caveat_wording) - two figures on the same page. The same graphic states a range of 2 km (1.24 mi), which the schema has no field for." },
  { robot_id: 2184, field_name: 'charging_time', kilde: K.anymal,
    caveat_wording: '100 min for 70% quick charge | for full charge',
    caveat: 'The manufacturer states two charging times (100 min for a 70% quick charge, and a separate figure for a full charge; see caveat_wording, split across the page markup). The full charge is used here; the quick charge cannot be compared to other entries\' full-charge times.' },
  { robot_id: 2184, field_name: 'docking_station', kilde: K.anymal,
    caveat_wording: "Automatic docking | Expand ANYmal’s inspection reach by setting up multiple docking stations along the routes.",
    caveat: 'Multiple docking stations can be set up along the route (see caveat_wording).' },
  { robot_id: 2184, field_name: 'lidar', kilde: K.anymal,
    caveat_wording: '360° environment scanning for localization and reality capture.',
    caveat: 'The page states a 360° Lidar (see caveat_wording) - type without model.' },
  { robot_id: 2184, field_name: 'cameras', kilde: K.anymal,
    caveat_wording: 'Strong light of maximal 3790Im supports visual inspections in the dark.',
    caveat: "The manufacturer writes '3790Im' with a capital I (see caveat_wording) - almost certainly 3790 lm (lumen). The page's -40 to 550°C range is the thermal camera's MEASUREMENT range, NOT the robot's operating temperature - easy to conflate when extracting mechanically.",
    value_text: '6 depth cameras + 2 optical tele-operation cameras; 20x optical zoom camera; thermal camera; ultrasonic microphone 0-384 kHz; spotlight max. 3790 lm; pan-tilt unit +/- 90° vertical, +/- 165° horizontal' },
  { robot_id: 2184, field_name: 'compute', kilde: K.anymal,
    caveat_wording: null,
    caveat: "The manufacturer's own two phrasings for the same unit.",
    value_text: '2x Intel Core i7; 8th gen. Intel 6-core processors' },
  { robot_id: 2184, field_name: 'autonomy_level', kilde: K.anymal,
    caveat_wording: null,
    caveat: 'Qualitative, not a level on a scale.',
    value_text: 'Autonomous inspection missions; AI-based mobility and autonomy; automatic docking at low battery status' },
  { robot_id: 2184, field_name: 'ce_disclosed', kilde: K.anymal,
    caveat_wording: 'FCC, CE and Anatel compliant',
    caveat: "The manufacturer states 'FCC, CE and Anatel compliant' (see caveat_wording). This field means DISCLOSED - not that we have seen a certificate of conformity." },
  { robot_id: 2184, field_name: 'fcc_disclosed', kilde: K.anymal,
    caveat_wording: 'FCC, CE and Anatel compliant',
    caveat: "The manufacturer states 'FCC, CE and Anatel compliant' (see caveat_wording). This field means DISCLOSED - not that we have seen a certificate." },

  // ------------------------------------------------- 2185 ANYbotics ANYmal X
  { robot_id: 2185, field_name: 'ip_rating', kilde: K.anymalx,
    caveat_wording: 'IP67 : Water and dust ingress protection',
    caveat: "The manufacturer states 'IP67 : Water and dust ingress protection' (see caveat_wording).",
    value_text: 'IP67' },
  { robot_id: 2185, field_name: 'lidar', kilde: K.anymalx,
    caveat_wording: 'Lidar Scanner | 360° environment scanning for localization and precise navigation.',
    caveat: "The manufacturer states a Lidar Scanner with 360° environment scanning (see caveat_wording) - type without model." },
  { robot_id: 2185, field_name: 'cameras', kilde: K.anymalx,
    caveat_wording: 'Precise temperature readings in the range of -10° to +400°C',
    caveat: "The signs are the manufacturer's own (see caveat_wording). The thermal camera's -10° to +400°C is its MEASUREMENT RANGE, not the robot's operating temperature.",
    value_text: '20x optical zoom camera; thermal camera, -10° to +400°C; microphone; pan-tilt unit +/- 90° vertical, +/- 165° horizontal' },
  { robot_id: 2185, field_name: 'autonomy_level', kilde: K.anymalx,
    caveat_wording: 'enable fully autonomous data gathering and integration into existing operation systems | Gas detection warnings increase safety during in-zone robot control.',
    caveat: 'Qualitative (see caveat_wording).',
    value_text: 'fully autonomous data gathering; in-zone robot control' },
  { robot_id: 2185, field_name: 'ce_disclosed', kilde: K.anymalx,
    caveat_wording: 'FCC and CE compliant | Complies with CE directives for industrial deployment',
    caveat: "The manufacturer states 'FCC and CE compliant' and 'Complies with CE directives for industrial deployment' (see caveat_wording). This field means DISCLOSED - not that we have seen a certificate of conformity. See the note on ATEX/IECEx, which the schema has no room for." },

  // -------------------------------------------- 2187 Bhairav Robotics Shvana
  { robot_id: 2187, field_name: 'weight', kilde: K.bhairav,
    caveat_wording: 'Weight: 25 kg (minus payload)',
    caveat: 'See the top-level note: explicitly WITHOUT payload (see caveat_wording).' },
  { robot_id: 2187, field_name: 'payload_walking', kilde: K.bhairav,
    caveat_wording: 'Payload: 10 kg',
    caveat: 'See the top-level note on placement as walking, not standing (see caveat_wording).' },
  { robot_id: 2187, field_name: 'speed', kilde: K.bhairav,
    caveat_wording: 'Speed: ~2-5 m/sec',
    caveat: "The manufacturer's own tilde qualifier is kept as the operator on the whole range (see caveat_wording)." },
  { robot_id: 2187, field_name: 'runtime', kilde: K.bhairav,
    caveat_wording: 'Endurance: ~120 mins',
    caveat: "No load condition is attached to this figure (see caveat_wording). The separate 'Payload: 10 kg' stands as its own bullet in the same list, NOT explicitly tied to the runtime figure - so we do not assume a connection (rule 8)." },

  // ---------------------------------------------- 2188 Boston Dynamics Spot
  { robot_id: 2188, field_name: 'weight', kilde: K.bd_spec,
    caveat_wording: 'Net Mass/Weight (Spot with battery) = 32.7 kg (72.1 lbs)',
    caveat: "The manufacturer's own datasheet states 32.7 kg (72.1 lbs) - https://bostondynamics.com/wp-content/uploads/2020/10/spot-specifications.pdf (see caveat_wording). Both figures are internally consistent metric/imperial; neither can be dismissed. The difference is 1.1 kg." },
  { robot_id: 2188, field_name: 'length', kilde: K.spot, wordingKilder: [K.spot, K.bd_spec],
    caveat_wording: 'Length 110mm (43.3 in) | Length = 1100 mm (43.3 in)',
    caveat: 'The product page states 110mm (43.3 in) - a factor of 10 off from its own imperial figure. The datasheet states 1100 mm (43.3 in) (see caveat_wording). We do not correct the product page; we use the datasheet and note the discrepancy.' },
  { robot_id: 2188, field_name: 'height', kilde: K.bd_spec,
    caveat_wording: 'Height (Sitting) = 191 mm | Default Height (Walking) = 610 mm | Max Height (Walking) = 700 mm | Min Height (Walking) = 520 mm',
    caveat: 'Four heights are given: sitting 191 mm, default walking 610 mm, max 700 mm, min 520 mm (see caveat_wording). The default walking figure is used here.' },
  { robot_id: 2188, field_name: 'payload_walking', kilde: K.spot, wordingKilder: [K.spot, K.bd_spec],
    caveat_wording: 'PAYLOAD MOUNTING | Max Weight 14 kg (30.9 lbs) | up to 14 kg (30 lbs)',
    caveat: "The manufacturer states 'PAYLOAD MOUNTING / Max Weight' and does NOT distinguish walking from standing payload (see caveat_wording). Placement under walking payload is our interpretation, not a direct reading. The datasheet's body text states the same figure as 'up to 14 kg (30 lbs)' - 30 vs 30.9 lbs in the same document." },
  { robot_id: 2188, field_name: 'slope', kilde: K.bd_spec,
    caveat_wording: 'Max Slope = ±30°',
    caveat: "The plus/minus sign is the manufacturer's own notation (see caveat_wording)." },
  { robot_id: 2188, field_name: 'obstacle_single', kilde: K.bd_spec,
    caveat_wording: 'Max Step Height = 300 mm (11.8 in)',
    caveat: "The manufacturer states 'Max Step Height' (see caveat_wording) without saying whether it is a single obstacle or continuous stair-climbing. Placement here is conservative. DATAMODEL.md F2 compared the figure with Unitree's continuous 20-25 cm; that comparison rests on an interpretation the source does not support." },
  { robot_id: 2188, field_name: 'temperature_min', kilde: K.bd_spec,
    caveat_wording: 'Robot must be powered on at a minimum temperature of 0° C.',
    caveat: 'The datasheet adds: "Robot must be powered on at a minimum temperature of 0° C." (see caveat_wording).' },
  { robot_id: 2188, field_name: 'battery_wh', kilde: K.bd_spec,
    caveat_wording: 'Mass/Weight = 5.2 kg (11.5 lbs)',
    caveat: 'The battery itself weighs 5.2 kg (11.5 lbs) (see caveat_wording).' },
  { robot_id: 2188, field_name: 'runtime', kilde: K.bd_spec,
    caveat_wording: 'Runtime may vary depending on payloads and environmental factors | Standby Time = 180 mins',
    caveat: "The manufacturer's footnote: \"Runtime may vary depending on payloads and environmental factors.\" (see caveat_wording). Standby is disclosed as 180 min." },
  { robot_id: 2188, field_name: 'charging_time', kilde: K.bd_spec,
    caveat_wording: '25°C 50 min 2 hrs | 35°C 2.5 hrs 3.5 hrs',
    caveat: "The datasheet's own charger table says something different: at 25°C, 50 min to 80% and 2 hrs to 100%; at 35°C, 2.5 hrs / 3.5 hrs (see caveat_wording). The 60 min figure is not conditioned on the product page." },
  { robot_id: 2188, field_name: 'docking_station', kilde: K.bd_spec,
    caveat_wording: 'Length = 1140 mm (44.9 in) | Width = 414 mm (16.3 in) | Height = 403 mm (15.9 in) | Mass/Weight = 22.9 kg (50.5 lbs) | Input = 90-277 VAC Output = 58V at 12A | Operating Temp. = 0°C to 35°C | Gigabit Ethernet passthrough to robot | cTUVus Certified to UL 1564 and CSA C22.2 No. 107.2',
    caveat: "Spot Dock, fully specified (see caveat_wording): 1140 x 414 x 403 mm, 22.9 kg, input 90-277 VAC, output 58 V at 12 A, 0-35°C, cTUVus certified to UL 1564 and CSA C22.2 No. 107.2. The dock's Gigabit Ethernet passthrough belongs here, not in the robot's own data ports." },
  { robot_id: 2188, field_name: 'cameras', kilde: K.bd_spec, wordingKilder: [K.bd_spec, K.spot],
    caveat_wording: 'built-in stereo cameras | Horizontal Field of View 360° Range 4 m (13 ft) Lighting > 2 Lux',
    caveat: "The string 'built-in stereo cameras' appears ONLY in the datasheet (marketing prose, not the specification table; see caveat_wording); 'Horizontal Field of View 360°' is on the product page. Terrain sensing: 360°, range 4 m, lighting > 2 lux.",
    value_text: 'stereo cameras (count and model not disclosed); horizontal field of view 360°' },
  { robot_id: 2188, field_name: 'sdk_languages', kilde: K.bd_spec,
    caveat_wording: 'Flexible API and Python SDK',
    caveat: "The manufacturer states 'Flexible API and Python SDK' (see caveat_wording, datasheet only)." },
  { robot_id: 2188, field_name: 'autonomy_level', kilde: K.bd_spec,
    caveat_wording: 'Object Avoidance | Stair & Complex Terrain Navigation | Manual & Autonomous Operation',
    caveat: 'Qualitative, not a level on a scale. The three quoted strings (see caveat_wording) appear ONLY in the datasheet; the product page supports the substance in other words.',
    value_text: 'Manual & Autonomous Operation; Object Avoidance; Stair & Complex Terrain Navigation; autonomous missions started from dock' },
  { robot_id: 2188, field_name: 'mounting_interface', kilde: K.bd_spec,
    caveat_wording: 'Mounting Area = 850 mm (L) x 240 mm (W) x 270 mm (H)',
    caveat: 'Mounting area 850 mm (L) x 240 mm (W) x 270 mm (H) (see caveat_wording).' },
  { robot_id: 2188, field_name: 'data_ports', kilde: K.spot, wordingKilder: [K.spot, K.bd_spec],
    caveat_wording: 'WIFI 2.4GHz / 5GHz b/g/n Ethernet | Gigabit Ethernet passthrough to robot',
    caveat: "The string 'Gigabit' does not appear on the product page, and in the datasheet it is in the Spot Dock section as passthrough to the robot, not about the robot itself. The robot's own CONNECTIVITY is WiFi + Ethernet without a speed figure (see caveat_wording)." },
  { robot_id: 2188, field_name: 'ce_disclosed', kilde: K.bd_spec,
    caveat_wording: 'Safety and Compliance, United States | ISO 12100 | IEC 60204-1 | ISO 13850 | FCC Part 15B | FCC Part 68 | IEC 60825-1',
    caveat: "The datasheet's section is verbatim titled 'Safety and Compliance, United States' and names ISO 12100, IEC 60204-1, ISO 13850, FCC Part 15B, FCC Part 68, IEC 60825-1 (see caveat_wording). No CE, no EU declaration. The field is not disclosed - NOT no: the datasheet refers to an Information for Use document we have not opened." },
  { robot_id: 2188, field_name: 'fcc_disclosed', kilde: K.bd_spec,
    caveat_wording: 'Safety and Compliance, United States | EMC: FCC Part 15B | Radio equipment: Incorporates a FCC Part 68 Certified radio system',
    caveat: "The datasheet's 'Safety and Compliance, United States' section (page 2) states 'EMC: FCC Part 15B' and 'Radio equipment: Incorporates a FCC Part 68 Certified radio system' (see caveat_wording), in the same section as the robot's Emergency Stop (ISO 13850) and laser class (IEC 60825-1) - the section describes the robot itself, not only Spot Dock. This field means DISCLOSED - not that we have seen a certificate." },

  // ------------------------------------------ 2215 Ghost Robotics Vision 60
  { robot_id: 2215, field_name: 'weight', kilde: K.ghost_spec,
    caveat_wording: 'Tare: 51kg (112 lbs)',
    caveat: "The manufacturer's label is 'Tare' - i.e. EMPTY weight (see caveat_wording). Cross-check: 51 kg = 112.4 lb, consistent." },
  { robot_id: 2215, field_name: 'width', kilde: K.ghost_v60,
    caveat_wording: 'Overall width: 570mm (22.5in) | Body width: 250mm (10in)',
    caveat: 'The body width alone is disclosed separately as 250 mm (10 in) (see caveat_wording).' },
  { robot_id: 2215, field_name: 'height', kilde: K.ghost_v60,
    caveat_wording: 'Overall height (standing): 685mm (27in) | Height to bottom of body / “Ride height”: 419mm (16.5in)',
    caveat: "Standing height. Ride height is disclosed separately as 419 mm (16.5 in) (see caveat_wording)." },
  { robot_id: 2215, field_name: 'degrees_of_freedom', kilde: K.ghost_v60,
    caveat_wording: '3 Degrees of Freedom per leg, 12-Motor back-drivable drive-train | capable of inverted operation',
    caveat: "The manufacturer states it verbatim: '3 Degrees of Freedom per leg, 12-Motor back-drivable drive-train' (see caveat_wording). The robot is also capable of inverted operation." },
  { robot_id: 2215, field_name: 'payload_walking', kilde: K.ghost_v60,
    caveat_wording: 'Payload Capacity 10 kg (22 lbs) payload weight. User-selectable payload compensation mode.',
    caveat: 'The manufacturer states payload weight (see caveat_wording) without distinguishing walking/standing. Placement is an inference. A user-selectable payload compensation mode exists.' },
  { robot_id: 2215, field_name: 'speed', kilde: K.ghost_v60, wordingKilder: [K.ghost_v60, K.ghost_spec],
    caveat_wording: 'Speed: up to 2.5 meters/second (5.6 miles/hour) | 2.4m/s (4.9 mph; working towards 3.0m/s 6.7 mph) sprint',
    caveat: "TWO ERRORS IN ONE FIELD, both on the manufacturer's own page (see caveat_wording). (1) The bullet list at the top of the product page states 'up to 2.5 meters/second (5.6 miles/hour)'; the specification table further down the SAME page states 2.4 m/s as sprint. (2) The pair 2.4m/s (4.9 mph) does not check out: 2.4 m/s = 5.37 mph, and 4.9 mph = 2.19 m/s. All other pairs on the line are correct (0.9 = 2.01; 1.2 = 2.68; 3.0 = 6.71). Only the sprint pair is wrong, and the error appears on both the product page and the datasheet. Standard walk is 0.9 m/s (2 mph), fast-walk 1.2 m/s." },
  { robot_id: 2215, field_name: 'slope', kilde: K.ghost_spec,
    caveat_wording: 'climbs stairs and steep hills',
    caveat: "The manufacturer states the robot 'climbs stairs and steep hills' (marketing datasheet text, see caveat_wording), without giving a slope-angle figure." },
  { robot_id: 2215, field_name: 'obstacle_single', kilde: K.ghost_v60,
    caveat_wording: 'Footstep planning over curbs and grated surfaces.',
    caveat: 'Footstep planning over curbs and grated surfaces (see caveat_wording) - no figure given.' },
  { robot_id: 2215, field_name: 'stair_step_continuous', kilde: K.ghost_v60,
    caveat_wording: 'Perception aided stair climbing with steering assistance.',
    caveat: 'Perception aided stair climbing with steering assistance (see caveat_wording) - no figure given.' },
  { robot_id: 2215, field_name: 'ip_rating', kilde: K.ghost_spec,
    caveat_wording: 'submerged in up to 1 meter of water for up to 30 minutes',
    caveat: 'The datasheet elaborates: submerged in up to 1 meter of water for up to 30 minutes (see caveat_wording).',
    value_text: 'IP67' },
  { robot_id: 2215, field_name: 'temperature_min', kilde: K.ghost_spec,
    caveat_wording: 'Cold start not possible below -20ºC. | Charging rate decreases above 40º C, no charging below 0º C.',
    caveat: "The manufacturer's own caveat stands next to the figure (see caveat_wording). The LOWER operating figure is therefore not a cold-start figure." },
  { robot_id: 2215, field_name: 'battery_wh', kilde: K.ghost_spec,
    caveat_wording: null,
    caveat: "No Wh anywhere - neither on the product page nor in the datasheet. The calculated field 'Wh per hour of runtime' cannot be computed for this robot." },
  { robot_id: 2215, field_name: 'runtime', kilde: K.ghost_v60,
    caveat_wording: '3.15 hours of continuous walking at 0.9 m/s | 21 hours of standby time | 3+ hours',
    caveat: '3.15 hours of continuous walking at 0.9 m/s (see caveat_wording). No load condition, but a SPEED CONDITION - the only one in the collection. The schema has no room for it. The manufacturer also discloses 21 hours of standby and 10 km range (terrain and payload dependent); the bullet list states the same figure as "3+ hours".' },
  { robot_id: 2215, field_name: 'hot_swap', kilde: K.ghost_spec,
    caveat_wording: 'Quick-swap sub-assemblies within minutes (legs, battery, front & rear sensor heads)',
    caveat: "The manufacturer states 'Quick-swap sub-assemblies within minutes (legs, battery, front & rear sensor heads)' (see caveat_wording). 'Within minutes' is not hot-swap during operation. Recorded as PARTIAL, not as yes." },
  { robot_id: 2215, field_name: 'charging_time', kilde: K.ghost_spec,
    caveat_wording: 'Standard battery charge time approx. 3 hours.',
    caveat: 'Standard battery charge time approx. 3 hours (see caveat_wording).' },
  { robot_id: 2215, field_name: 'docking_station', kilde: K.ghost_spec,
    caveat_wording: 'Wireless Charge Kit | Wireless charging station for persistent 24x7 operation',
    caveat: 'The string appears verbatim on the datasheet (see caveat_wording). The source is therefore the datasheet.' },
  { robot_id: 2215, field_name: 'lidar', kilde: K.ghost_v60,
    caveat_wording: '3D lidar-based SLAM',
    caveat: "The 'Integrated Sensors' section contains no LiDAR. LiDAR exists as a PAYLOAD (Security Payload), and Mission Control describes '3D lidar-based SLAM' (see caveat_wording). The base robot does not have it - it is a no on the base specification, not a gap." },
  { robot_id: 2215, field_name: 'cameras', kilde: K.ghost_v60,
    caveat_wording: 'Integrated Sensors | 5 x RGB (1080p resolution), 4 x D435 depth sensors, dual antenna RTK GPS',
    caveat: 'One of few entries in the whole collection with a named camera model (D435) (see caveat_wording).',
    value_text: '5x RGB (1080p resolution); 4x D435 depth sensors; dual antenna RTK GPS' },
  { robot_id: 2215, field_name: 'ros2', kilde: K.ghost_spec,
    caveat_wording: 'C/C++, ROS, ROS2, MAVLink Compatible, Zeno, ATAK, JSON Mission',
    caveat: "The string also appears in the product page's DOM (see caveat_wording)." },
  { robot_id: 2215, field_name: 'sdk_languages', kilde: K.ghost_v60,
    caveat_wording: 'Low-level | High-Level | Mission Control | Bullet Physics-based, Windows, Linux, Mac',
    caveat: 'API levels: Low-level, High-Level, Mission Control. Simulator: Bullet Physics-based, Windows, Linux, Mac (see caveat_wording). This also appears on the product page, not only in the datasheet.' },
  { robot_id: 2215, field_name: 'autonomy_level', kilde: K.ghost_v60,
    caveat_wording: null,
    caveat: 'Three named levels - the most useful autonomy description in the entire collection.',
    value_text: 'Perception Aided Mobility; Record-Playback; Mission Control; collision avoidance front and rear' },
  { robot_id: 2215, field_name: 'power_output', kilde: K.ghost_v60,
    caveat_wording: 'power:12V regulated & unregulated 32-42V',
    caveat: "Reproduced verbatim WITHOUT a space after the colon, as the manufacturer writes it (see caveat_wording). Voltage disclosed, WATTAGE NOT. Spot discloses 35-58.8 V and 150 W per port. The two fields look alike in a table and are not." },
  { robot_id: 2215, field_name: 'data_ports', kilde: K.ghost_v60,
    caveat_wording: 'Integrated 2.4, 5.8 GHz Wi-Fi & 4G/LTE; GigE switch supports any external radio including 5G, SDRs & SAT',
    caveat: 'Radio: 2.4 and 5.8 GHz WiFi as well as 4G/LTE; GigE switch (see caveat_wording).' },
  { robot_id: 2215, field_name: 'ce_disclosed', kilde: K.ghost_v60,
    caveat_wording: 'Export Control | HC | US ECCN: EAR-99 | 8479.50.00.00 Industrial Robots (No ITAR restrictions)',
    caveat: "The field on the datasheet is called 'Export Control | HC' and answers 'US ECCN: EAR-99 | 8479.50.00.00 Industrial Robots (No ITAR restrictions)' (see caveat_wording). The manufacturer answers a US export question, not a European market-access question. No CE mentioned." },

  // ---------------------------------------------------- 2216 Keybotic Keyper
  { robot_id: 2216, field_name: 'weight', kilde: K.keybotic_tech,
    caveat_wording: 'Weight: 43kgs',
    caveat: "'Weight: 43kgs' in the page's Specifications section (see caveat_wording). No indication of with/without battery." },
  { robot_id: 2216, field_name: 'length', kilde: K.keybotic_tech,
    caveat_wording: 'Length: 60cm',
    caveat: "'Length: 60cm' (see caveat_wording). See the top-level note that the width (95cm) is greater than the length - unusual, not corrected." },
  { robot_id: 2216, field_name: 'width', kilde: K.keybotic_tech,
    caveat_wording: 'Width: 95cm',
    caveat: "'Width: 95cm' - greater than the stated length (60cm) (see caveat_wording). Reproduced verbatim from the manufacturer, uncorrected. See the top-level note." },
  { robot_id: 2216, field_name: 'height', kilde: K.keybotic_tech,
    caveat_wording: 'Height: 60cm (min 35 max 75)',
    caveat: "'Height: 60cm (min 35 max 75)' (see caveat_wording) - the manufacturer states both a standard height of 60cm AND a range of 35-75cm (the height is adjustable, presumably via the legs' standing height). The schema allows only ONE of 'value' and 'min'/'max' (rule 4) - the range is chosen because it carries the most information; the 60cm standard figure is preserved here in the quote instead of being lost." },
  { robot_id: 2216, field_name: 'runtime', kilde: K.keybotic_tech,
    caveat_wording: '90/120 min battery run time',
    caveat: "'90/120 min battery run time' (see caveat_wording) - the two figures are not labeled with which load they apply to (see top-level note). The load condition is therefore not disclosed, not a guessed kg figure." },
  { robot_id: 2216, field_name: 'charging_time', kilde: K.keybotic_tech,
    caveat_wording: 'min for full charge',
    caveat: "'60 min for full charge' (see caveat_wording, split across the page markup)." },
  { robot_id: 2216, field_name: 'lidar', kilde: K.keybotic_tech,
    caveat_wording: 'Lidar model: 32 channels | Horizontal field of view: 360º | Vertical field of view: 90º | Range: 35m | Precision: Up to 1cm | Laser Product Class: Class 1 eye-safe per IEC/EN 60825-1: 2014 | Laser Wavelength: 865 nm',
    caveat: "'Lidar model: 32 channels' - the manufacturer itself names the model as the channel count, with no separate brand/model number disclosed. The remaining figures (see caveat_wording) are all in the same Specifications section.",
    value_text: '3D LiDAR, 32 channels, 360° horizontal / 90° vertical field of view, range 35 m, precision up to 1 cm, Class 1 eye-safe laser (IEC/EN 60825-1:2014), wavelength 865 nm' },
  { robot_id: 2216, field_name: 'cameras', kilde: K.keybotic_tech,
    caveat_wording: 'With 5 cameras -on the front (top and bottom), on the left, right, and back- Keyper has a depth range of 10m | RGB Image: 640×320 @ 15FPS | Depth Image: 640×320 @ 15FPS | Depth field of view: 86º horizontal | Inspection Head | Weighting only 4kg | Zoom Camera | Thermal Camera | Ultrasonic Microphone | Spotlight | Speakers',
    caveat: 'See caveat_wording. A separate "Inspection Head" module (4 kg) carries the zoom/thermal camera, microphone, spotlight and speakers.',
    value_text: '5 cameras (front top+bottom, left, right, rear), depth range 10 m, RGB image 640×320@15FPS, depth image 640×320@15FPS, 86° horizontal depth field of view. Separate "Inspection Head" module (4 kg): zoom camera, thermal camera, ultrasonic microphone, spotlight, speakers' },
  { robot_id: 2216, field_name: 'compute', kilde: K.keybotic_tech,
    caveat_wording: 'CPU Model: Intel 1260P | CPU Cores: 4P + 8E | CPU Threads: 16 | Memory: 16GB RAM (up to 64GB) | Storage: 1TB M2 drive',
    caveat: "Under the heading 'Computing' (see caveat_wording).",
    value_text: 'Intel Core 1260P CPU (4P+8E cores, 16 threads), 16 GB RAM (up to 64GB), 1TB M.2 drive' },
  { robot_id: 2216, field_name: 'autonomy_level', kilde: K.keybotic_home, wordingKilder: [K.keybotic_home, K.keybotic_tech],
    caveat_wording: 'Reacts to environmental changes and decides on actions and best routes | Coordinates and distributes missions with other Keypers | Yes, Keyper can operate without a GPS | Keyper will still operate without an internet connection, continuing its mission normally',
    caveat: "Composed from several sections of the same site: 'Decision Making and Task Planning' (homepage) and the FAQ (technology page) (see caveat_wording). No explicit named autonomy-level scale.",
    value_text: 'Fully autonomous navigation and 3D mapping without GPS or internet ("can operate without a GPS even in unknown territories, as it maps constantly the environment in 3D to geolocalize itself"); continues its mission without an internet connection but cannot send real-time alerts offline; reacts to environmental changes and decides its own route and action; can coordinate tasks with other Keyper robots; can also be teleoperated via real-time imagery' },
  { robot_id: 2216, field_name: 'price', kilde: K.keybotic_tech,
    caveat_wording: 'How much does it cost to hire a Keyper? With our Robot as a Service (RaaS) employment model, you can hire your own Keyper and start automating your inspections with no initial investment -the final costs will be adjusted based on each customer’s specific needs with different software applications. Of course, purchase options are also available.',
    caveat: 'See caveat_wording. No list price disclosed - see top-level note.' },

  // ------------------------------------------------- 2217 MAB Honey Badger 4
  { robot_id: 2217, field_name: 'height', kilde: K.mab4,
    caveat_wording: 'Physical dimensions | 60 x 40 x 15-50 cm',
    caveat: 'The height is a range, lying to fully extended (see caveat_wording). Kept as a range.' },
  { robot_id: 2217, field_name: 'payload_walking', kilde: K.mab4,
    caveat_wording: 'up to 4 kg',
    caveat: "The manufacturer states 'up to 4 kg' (see caveat_wording). No distinction is made between walking and standing payload." },
  { robot_id: 2217, field_name: 'ip_rating', kilde: K.mab4,
    caveat_wording: 'up to IP67 | IP67-rated construction',
    caveat: "The manufacturer states 'up to IP67' in the specification table (see caveat_wording). The operator is the manufacturer's own and is kept - 'up to IP67' is not the same as IP67. BUT THE PAGE CONTRADICTS ITSELF: the body text states the stronger 'IP67-rated construction' twice, without qualification. 'IP67' appears 6 times in the file, of which only 1 is 'up to IP67'. The cautious table value is used." },
  { robot_id: 2217, field_name: 'runtime', kilde: K.mab4,
    caveat_wording: 'up to 2 hours',
    caveat: "'up to 2 hours' (see caveat_wording). No load condition." },
  { robot_id: 2217, field_name: 'ce_disclosed', kilde: K.mab4,
    caveat_wording: null,
    caveat: 'Negative-controlled with word boundary: 0 hits for CE in 1.55 MB of HTML, and 0 for conformity, declaration, certif, EN ISO, RoHS, ATEX, UKCA and FCC.' },

  // ------------------------------------------------- 2218 MAB Honey Badger 5
  { robot_id: 2218, field_name: 'height', kilde: K.mab5,
    caveat_wording: 'Physical dimensions | 50 x 30 x 13-50 cm',
    caveat: 'THE HEIGHT IS A RANGE - 13-50 cm, i.e. lying to fully extended (see caveat_wording). Kept as a range; a single figure would be invented.' },
  { robot_id: 2218, field_name: 'payload_walking', kilde: K.mab5,
    caveat_wording: 'up to 5 kg',
    caveat: "The manufacturer states 'up to 5 kg' (see caveat_wording). The operator is kept. No distinction between walking and standing payload." },
  { robot_id: 2218, field_name: 'temperature_min', kilde: K.mab5,
    caveat_wording: null,
    caveat: '0°C is a DISCLOSED LOWER BOUND, not a missing figure. Together with the Weilan AlphaDog C500 (0-35°C), it is the narrowest operating temperature range in this collection; for outdoor Danish winter operation it is a disqualifier.' },
  { robot_id: 2218, field_name: 'runtime', kilde: K.mab5,
    caveat_wording: 'up to 2 hours',
    caveat: "The manufacturer states 'up to 2 hours' (see caveat_wording). The operator is kept. No load condition." },
  { robot_id: 2218, field_name: 'compute', kilde: K.mab5,
    caveat_wording: 'two onboard computers',
    caveat: "The page states 'two onboard computers' (see caveat_wording) without a model." },
  { robot_id: 2218, field_name: 'ros2', kilde: K.mab5,
    caveat_wording: 'open architecture',
    caveat: "The page states 'open architecture' (see caveat_wording) without a ROS version." },
  { robot_id: 2218, field_name: 'data_ports', kilde: K.mab5,
    caveat_wording: 'Communication | 5G Wi-Fi or Optic Fibre | Control device | PC/Remote controller',
    caveat: "The page states 'Communication: 5G Wi-Fi or Optic Fibre' and 'Control device: PC/Remote controller' (see caveat_wording). That is connectivity and operation, not a port list." },
  { robot_id: 2218, field_name: 'ce_disclosed', kilde: K.mab5,
    caveat_wording: null,
    caveat: "Negative-controlled with word boundary: 0 hits for CE in 1.48 MB of HTML. A positive control on the ANYbotics page with the same term gave 1 hit ('FCC, CE and Anatel compliant'), so the search method works. See the note on why a 'no' here does not mean the same as a 'no' from a US manufacturer." },

  // --------------------------------------------------- 2225 NEURA Quadruped
  { robot_id: 2225, field_name: 'weight', kilde: K.neura_pdf,
    caveat_wording: 'Weight | 60 kg | 132 lbs',
    caveat: "'Weight: 60 kg / 132 lbs' in the datasheet's specification block (see caveat_wording). No indication of with/without battery." },
  { robot_id: 2225, field_name: 'height', kilde: K.neura_pdf,
    caveat_wording: 'Height | 620 mm | 24.4 in',
    caveat: "'Height: 620 mm / 24.4 in' (see caveat_wording)." },
  { robot_id: 2225, field_name: 'payload_walking', kilde: K.neura_pdf,
    caveat_wording: 'Payload | 22 kg | 48.5 lbs',
    caveat: "'Payload: 22 kg / 48.5 lbs' (see caveat_wording) - the datasheet does not distinguish between walking and standing payload. Placing this value under walking payload is our interpretation, not a direct reading (same principle as Boston Dynamics Spot and others)." },
  { robot_id: 2225, field_name: 'speed', kilde: K.neura_pdf,
    caveat_wording: 'Speed | 12 km/h | 7.5 mph',
    caveat: "'Speed: 12 km/h / 7.5 mph' (see caveat_wording)." },
  { robot_id: 2225, field_name: 'stair_step_continuous', kilde: K.neura_pdf,
    caveat_wording: 'Step Height | 15 cm | 5.9 in',
    caveat: "'Step Height: 15 cm / 5.9 in' (see caveat_wording) - the datasheet does not itself distinguish single obstacle from continuous stairs. Classified as continuous stair-climbing based on the wording ('step height', singular) and the order of magnitude (15 cm is on par with other robots' continuous stair figures in this catalog, e.g. Unitree B2's 20-25 cm, not their single-obstacle figures of 40-80 cm) - our interpretation, not a manufacturer label." },
  { robot_id: 2225, field_name: 'runtime', kilde: K.neura_pdf,
    caveat_wording: 'Battery Life (h) | 6',
    caveat: "'Battery Life (h): 6' (see caveat_wording) - no load condition disclosed, even though a separate 22 kg payload figure appears in the same document (rule 8: we do not guess at the connection)." },
  { robot_id: 2225, field_name: 'cameras', kilde: K.neura_pdf, wordingKilder: [K.neura_pdf, K.neura_html],
    caveat_wording: 'Environment Vision | 360° | multi-sensor fusion...360° environment vision',
    caveat: "The datasheet's feature block 'Environment Vision / 360°' (see caveat_wording), confirmed by the main page's 'multi-sensor fusion...360° environment vision'. Neither camera count, resolution nor sensor type (camera vs. LiDAR vs. other) is specified - the lidar field is therefore not disclosed rather than assuming the 360° coverage comes from LiDAR.",
    value_text: '360° environment vision via multi-sensor fusion ("Environment Vision 360°") - camera count, resolution and model not disclosed' },
  { robot_id: 2225, field_name: 'ros2', kilde: K.neura_html, wordingKilder: [K.neura_html, K.neura_pdf],
    caveat_wording: 'Interfaces | Wi-Fi 6, Gigabit Ethernet, ROS 2, C++, Python SDK, NEURA Sync | Wi-Fi 6, Gigabit Ethernet, ROS2, C++, & Python SDK, NeuraSync',
    caveat: "'Interfaces: Wi-Fi 6, Gigabit Ethernet, ROS 2, C++, Python SDK, NEURA Sync' in the reservation page's 'At A Glance' table (see caveat_wording), confirmed verbatim in the datasheet's Interfaces field." },
  { robot_id: 2225, field_name: 'sdk_languages', kilde: K.neura_html,
    caveat_wording: null,
    caveat: "From the same Interfaces row as the ros2 field. 'NEURA Sync' is a proprietary platform, not a programming language, and is therefore not included in the sdk_languages list." },
  { robot_id: 2225, field_name: 'autonomy_level', kilde: K.neura_html, wordingKilder: [K.neura_html, K.neura_pdf],
    caveat_wording: 'Additional interfaces | Digital twin access, teleoperation, ready for Neura Gym training',
    caveat: "Composed from the datasheet's feature blocks and the reservation page's 'Additional interfaces: Digital twin access, teleoperation, ready for Neura Gym training' (see caveat_wording). No named autonomy-level scale.",
    value_text: 'Fully Autonomous ("Fully Autonomous"); intelligent algorithm for mapping, localization and navigation ("Intelligent Algorithm for Mapping, Localization, and Navigation"); path planning and obstacle avoidance ("Path Planning and Obstacle Avoidance"); multimodal cognitive interaction ("Multimodal Cognitive Interaction"); digital twin access, teleoperation, ready for training in NEURA Gym' },
  { robot_id: 2225, field_name: 'price', kilde: K.neura_html,
    caveat_wording: 'Estimated price/unit | 50,000 € (excluding taxes and shipping) | Reservation fee | 100€ per unit | fully refundable and will be applied toward your final purchase price',
    caveat: "'Estimated price/unit: 50,000 € (excluding taxes and shipping)' (see caveat_wording). A separate 'Reservation fee: 100€ per unit' is a deposit credited toward the final price ('fully refundable and will be applied toward your final purchase price') - not included in the €50,000. An estimated/indicative price, not a binding sale price - the manufacturer's own word is 'Estimated'." },

  // ---------------------------------------------- 2228 Rainbow Robotics RBQ-10
  { robot_id: 2228, field_name: 'weight', kilde: K.rbq_llms,
    caveat_wording: 'Weight (with battery)',
    caveat: "The manual specifies: 'Weight (with battery)' (see caveat_wording)." },
  { robot_id: 2228, field_name: 'degrees_of_freedom', kilde: K.rbq_llms,
    caveat_wording: 'LegJointInfo | Joint position and velocity (12 joints) | Claim ownership of all 12 joints',
    caveat: "DERIVED, NOT DISCLOSED AS A SPECIFICATION. The string '12 joints' appears only in the SDK sections (see caveat_wording) - an API description. A search for 'degrees of freedom' gives 0 hits in the entire manual. The 3-per-leg split follows from the hardware table's three joint types. The figure is very likely correct, but the manufacturer does not disclose it as a specification. Joint specification: rated torque 40/40/50 Nm, max. 104/104/140 Nm, max. angular velocity 14.4/14.4/11.15 rad/s." },
  { robot_id: 2228, field_name: 'payload_walking', kilde: K.rbq10, wordingKilder: [K.rbq10, K.rbq_llms],
    caveat_wording: 'Max Payload | Total mass of everything mounted on top of the robot',
    caveat: "The manufacturer states 'Max Payload' without distinguishing walking/standing (see caveat_wording). The manual specifies: 'Total mass of everything mounted on top of the robot.' Placement is an inference." },
  { robot_id: 2228, field_name: 'speed', kilde: K.rbq10,
    caveat_wording: '9 km/h (up to 14 km/h in running mode) | Walking 6 km/h, running 14 km/h',
    caveat: "The specification table states '9 km/h (up to 14 km/h in running mode)' (see caveat_wording). The summary AT THE TOP OF THE SAME PAGE states 'Walking 6 km/h, running 14 km/h'. 6 vs 9 km/h for walking. The specification table is used as the value; the summary is carried as a contradiction. Neither can be dismissed by us." },
  { robot_id: 2228, field_name: 'slope', kilde: K.rbq10,
    caveat_wording: 'Longitudinal slope: 45% Lateral slope: 20%',
    caveat: "DISCLOSED IN PERCENT, NOT IN DEGREES. 45% = 24.2 degrees. Must not be silently converted - Spot's ±30 degrees and RBQ-10's 45% are not the same unit. Lateral (side) slope is disclosed separately as 20% (see caveat_wording)." },
  { robot_id: 2228, field_name: 'stair_step_continuous', kilde: K.rbq10,
    caveat_wording: 'Stairs and steps: up to 25 cm | step height 20 cm',
    caveat: "The manufacturer states 'Stairs and steps: up to 25 cm' (see caveat_wording). The summary on the same page states 'step height 20 cm'. 20 vs 25 cm. The specification table is used; the summary is carried as a contradiction." },
  { robot_id: 2228, field_name: 'battery_wh', kilde: K.rbq_llms,
    caveat_wording: 'Battery Weight | 6.2kg (3.1kg x2) | Battery Capacity | 18Ah (9Ah x2) / 907Wh | Nominal Voltage | 50.4V',
    caveat: "18 Ah (9 Ah x2), nominal voltage 50.4 V, battery weight 6.2 kg (3.1 kg x2). The manufacturer's own table also states 907 Wh directly (see caveat_wording) - cross-check: 18 x 50.4 = 907.2 Wh, consistent with the manufacturer's own figure." },
  { robot_id: 2228, field_name: 'runtime', kilde: K.rbq10,
    caveat_wording: '2 hours (up to 4 hours)',
    caveat: "The manufacturer states '2 hours (up to 4 hours)' (see caveat_wording). No load condition." },
  { robot_id: 2228, field_name: 'hot_swap', kilde: K.rbq10,
    caveat_wording: 'Swappable / Separate charging / Automatic charging support',
    caveat: "'Swappable / Separate charging / Automatic charging support' (see caveat_wording). Two batteries in the base configuration." },
  { robot_id: 2228, field_name: 'charging_time', kilde: K.rbq_llms,
    caveat_wording: '1h (20 to 80%)',
    caveat: "'1h (20 to 80%)' (see caveat_wording) - the charging condition is stated IN the figure itself - the only manufacturer in the collection that does so. The figure is therefore NOT a full charge and cannot be compared directly to Spot's 60 min or ANYmal's 3 h." },
  { robot_id: 2228, field_name: 'docking_station', kilde: K.rbq10,
    caveat_wording: 'Wireless Charging Station',
    caveat: "'Wireless Charging Station' (optional) (see caveat_wording), automatic charging, ArUco-marker docking within 5 m." },
  { robot_id: 2228, field_name: 'lidar', kilde: K.rbq10,
    caveat_wording: '3D LiDAR (optional)',
    caveat: "'3D LiDAR (optional)' (see caveat_wording) - type without model, and OPTIONAL, not base configuration." },
  { robot_id: 2228, field_name: 'cameras', kilde: K.rbq10, wordingKilder: [K.rbq10, K.rbq_llms],
    caveat_wording: '4K PTZ camera | Resolution | Up to 1920x1080 (1/2.8" 2 MP CMOS) | Optical Zoom | 32x',
    caveat: "CONFLICT about the PTZ option: the product page states '4K PTZ camera', the manual states a camera with 2 MP CMOS resolution and 32x optical zoom (see caveat_wording). 4K is approx. 8.3 MP, so the two cannot both be correct. Optional, not base - but it can end up in a table column if we are not careful.",
    value_text: 'IMU; (RGB + depth) x2; depth x4; optional PTZ camera and thermal camera' },
  { robot_id: 2228, field_name: 'compute', kilde: K.rbq10,
    caveat_wording: null,
    caveat: 'Not in the specification table.' },
  { robot_id: 2228, field_name: 'ros2', kilde: K.rbq10, wordingKilder: [K.rbq10, K.rbq_llms],
    caveat_wording: 'ROS 2, DDS integration | RBQ SDK — ROS2 Overview | Connect the RBQ robot to ROS 2 Humble in 4 steps.',
    caveat: "The product page states 'ROS 2, DDS integration'. The manual's ROS2 SDK documentation is titled 'RBQ SDK — ROS2 Overview' and its quick-start guide states 'Connect the RBQ robot to ROS 2 Humble in 4 steps.' (see caveat_wording). THE VERSION IS NAMED - unique in the entire collection." },
  { robot_id: 2228, field_name: 'sdk_languages', kilde: K.rbq_llms,
    caveat_wording: 'RBQ SDK — C/C++ Overview | RBQ SDK — ROS2 Overview | LV0 | LV1',
    caveat: "The manual's section headings are 'RBQ SDK — C/C++ Overview' and 'RBQ SDK — ROS2 Overview' (see caveat_wording). API levels LV0 (joint level) and LV1 (gait and posture)." },
  { robot_id: 2228, field_name: 'mounting_interface', kilde: K.rbq_llms,
    caveat_wording: 'Exceeding the 15 kg payload limit or mounting mass far from the body center can destabilize walking',
    caveat: 'With an explicit manufacturer warning: exceeding the 15 kg payload limit or mounting mass far from the body center can destabilize walking (see caveat_wording).' },
  { robot_id: 2228, field_name: 'power_output', kilde: K.rbq10,
    caveat_wording: null,
    caveat: 'Voltage disclosed, wattage not - the same half-empty field as Ghost Vision 60.' },
  { robot_id: 2228, field_name: 'data_ports', kilde: K.rbq10,
    caveat_wording: 'Wi-Fi / LTE (optional)',
    caveat: 'Radio: WiFi / LTE (optional) (see caveat_wording).' },
  { robot_id: 2228, field_name: 'ce_disclosed', kilde: K.rbq10,
    caveat_wording: null,
    caveat: 'NOT FULLY VERIFIED: CE has not been negative-controlled as thoroughly as for other entries in the catalog.' },

  // -------------------------------------------- 2229 Raion Robotics RAIBO2
  { robot_id: 2229, field_name: 'weight', kilde: K.railab,
    caveat_wording: 'It weighs 42 kg and can reach speeds of up to 6 m/s, ensuring reliable performance with up to 8 hours of continuous operation.',
    caveat: "SECONDARY SOURCE. The figure appears at KAIST RaiLab, the laboratory that developed the robot - not at Raion Robotics, which sells it (see caveat_wording). The manufacturer's own page discloses no weight for the robot (only 1.8 kg for a single motor module)." },
  { robot_id: 2229, field_name: 'speed', kilde: K.railab,
    caveat_wording: 'can reach speeds of up to 6 m/s',
    caveat: "SECONDARY SOURCE, and the operator is the source's own: 'can reach speeds of up to 6 m/s' (see caveat_wording). Up to is a ceiling, not an operating speed." },
  { robot_id: 2229, field_name: 'runtime', kilde: K.railab,
    caveat_wording: 'up to 8 hours of continuous operation',
    caveat: "SECONDARY SOURCE, no load condition. The source states 'up to 8 hours of continuous operation' without saying at what load or behavior (see caveat_wording). The figure is therefore not comparable to Unitree B2's 4 hours at 20 kg." },
  { robot_id: 2229, field_name: 'lidar', kilde: K.raibo2,
    caveat_wording: 'Camera and LiDAR based autonomous navigation for diverse operational environments',
    caveat: "The manufacturer states 'Camera and LiDAR based autonomous navigation for diverse operational environments' (see caveat_wording) - type without model and without count." },
  { robot_id: 2229, field_name: 'cameras', kilde: K.raibo2,
    caveat_wording: 'Camera and LiDAR based autonomous navigation for diverse operational environments',
    caveat: 'The same sentence mentions Camera without model and without count (see caveat_wording).' },
  { robot_id: 2229, field_name: 'mounting_interface', kilde: K.raibo2,
    caveat_wording: 'Modular payload space supports perception, communication, and mission equipment',
    caveat: "The manufacturer states 'Modular payload space supports perception, communication, and mission equipment' (see caveat_wording). No dimensions, no bolt pattern, no interface named - it is a characteristic, not a specification." },

  // ---------------------------------------------------------- 2230 RIVR ONE
  { robot_id: 2230, field_name: 'payload_walking', kilde: K.rivrp,
    caveat_wording: 'over 30 kg of parcels, groceries, and food',
    caveat: "The manufacturer states 'over 30 kg of parcels, groceries, and food' (see caveat_wording). The operator is kept. No distinction between walking and standing payload." },
  { robot_id: 2230, field_name: 'speed', kilde: K.rivrp,
    caveat_wording: 'up to 14 km/h (8.7 mph)',
    caveat: "The manufacturer states 'up to 14 km/h (8.7 mph)' (see caveat_wording). Cross-check: 14 km/h = 8.699 mph, consistent. The source is the product page alone." },
  { robot_id: 2230, field_name: 'runtime', kilde: K.rivrp,
    caveat_wording: null,
    caveat: 'The manufacturer discloses range (over 30 km), not time. We do not compute a runtime backwards from range and speed.' },
  { robot_id: 2230, field_name: 'charging_time', kilde: K.rivrp,
    caveat_wording: 'recharges in just 2–3 hours',
    caveat: "'recharges in just 2-3 hours' (see caveat_wording). Range preserved. The dash in the source is an en dash (U+2013)." },
];

/* ------------------------------------------------------- kun value_text */
// Rækker hvor caveat er NULL i dag og forbliver det - kun value_text renset.

const VALUE_TEXT_ONLY = [
  { robot_id: 2187, field_name: 'autonomy_level',
    value_text: 'Reinforcement-learning-based control with onboard computational power that lets Shvana quickly adapt to new surroundings ("Thanks to the reinforcement learning algorithms and onboard computational power, Shvana can quickly adapt to new surroundings"). No explicit named autonomy-level scale or SLAM detail disclosed.' },
  { robot_id: 2188, field_name: 'power_output',
    value_text: 'Unregulated DC 35-58.8V, 150W per port' },
  { robot_id: 2215, field_name: 'compute',
    value_text: 'NVIDIA® Xavier, 32GB RAM w/ 16-channel GMSL2, 2TB NVMe SSD' },
  { robot_id: 2215, field_name: 'mounting_interface',
    value_text: 'T-slots, M5 tapped holes or 1913 MIL-STD rails, w/ optional body panels' },
  { robot_id: 2228, field_name: 'autonomy_level',
    value_text: 'Patrol along predefined routes; obstacle avoidance; autonomous docking and charging based on battery status; simulation before hardware deployment' },
];

const APPLICATIONS = [
  { robot_id: 2184, note: "The first quote is the page's own title." },
  { robot_id: 2185, note: "The first quote is the page's own title. The page specifies the industry: 'Automate inspections in Oil & Gas and Chemical operations to increase safety,'." },
  { robot_id: 2187, note: "'Defence & Homeland Security' with armament/munitions wording ('munitions', 'EW payloads') -> defense and emergency response (NOT security and surveillance - L22 introduced that category precisely to separate civilian patrol/surveillance from military platforms, and Shvana is explicitly \"Bharat's first ARMED quadruped\" for armed forces). 'Industrial Environments' with 'Hazardous/Corrosive environment inspection', 'Routine field checks - detecting leaks' etc. -> industrial + inspection." },
  { robot_id: 2188, note: "The manufacturer's own product navigation, the text under the 'Spot' item. The page's solutions menu splits into 'Inspection' and 'Safety & Response'." },
  { robot_id: 2214, note: "THE MANUFACTURER HAS NO PAGE ABOUT THE MODEL. The saved file has <title>Not Found</title> and the text 'Page Not Found'. Without a page there is nothing to cite, and Ghost Robotics' general defense positioning belongs to Vision 60, not to a model the manufacturer no longer mentions." },
  { robot_id: 2215, note: "The manufacturer's main navigation has two items: 'Defense' and 'Commercial'. 'Commercial' is not an application in the allowed set, and the homepage specifies it as 'From the battlefield to the oil field'." },
  { robot_id: 2216, note: "'Autonomous Robot Dogs for Industrial Inspections' and 'autonomous industrial inspector' -> industrial + inspection (the entire product's purpose is industrial inspection). 'Surveillance' (its own item on the manufacturer's industry list, same wording on the homepage and /technology/) -> security and surveillance. 'Research' (same list) -> research and development. The first four sectors (Chemicals, Oil & Gas, Energy & Utilities, Mining & Minerals) are already covered by industrial/inspection and have no categories of their own in the schema." },
  { robot_id: 2217, note: "COMPANY-LEVEL, NOT MODEL-LEVEL. The quotes are two items in the manufacturer's 'Industries' menu, which appears sitewide: Industrial inspection, Mining, Public safety, Utilities, Civil engineering, Academia & Research. Honey Badger is the manufacturer's only robot, but the manufacturer has not itself applied the label at the model level. Mining, Public safety, Utilities and Civil engineering have no categories in the allowed set." },
  { robot_id: 2218, note: "COMPANY-LEVEL, NOT MODEL-LEVEL - see the note on the Honey Badger 4.0. The model page's own heading 'Designed with Precision for Industrial-grade Standards' is a build-quality claim, not an application, and does not count." },
  { robot_id: 2225, note: "The first quote is from the 'At A Glance' table's 'Use cases' row; the second is from the FAQ section 'What are the primary use cases for NEURA Quadruped?'. Our own interpretation: Inspection -> inspection; surveillance -> security and surveillance; transport/payload transport -> logistics; research (in complex environments) -> research and development; industrial and service applications -> industrial." },
  { robot_id: 2228, note: "'Research Platform' is a label on the product itself, alongside 'Outdoor Walking' and 'AI Gait'. L22: 'patrol' and 'surveillance' are mapped to security and surveillance; the third quote is the product page's own module description. The manufacturer's industry list for the whole company also mentions Defense & Security and Logistics, but it is not written about RBQ-10 specifically and is not used." },
  { robot_id: 2229, note: "L22: 'patrol' is mapped to security and surveillance. WEAKEST of the six: the manufacturer writes neither 'security' nor 'surveillance' about RAIBO2 - only 'patrol', and only once. The university laboratory behind the robot, KAIST RaiLab, writes something different: 'a practical and cost-effective solution for industrial applications' - but RaiLab is not the manufacturer, and their words are not used here." },
  { robot_id: 2230, note: "The manufacturer's navigation splits into Parcel Delivery, Grocery Delivery and 'Instant food and convenience store delivery' - three forms of the same thing." },
];

const IMAGES = [
  { robot_id: 2229, note: "Retrieved directly from the manufacturer's product page 24 Aug 2026, not from the existing image archive, which had no folder for this robot." },
];

// robots.notes — HELE arrayet skrives igen. Elementer markeret UVERIFICERET
// er IKKE oversat (L87: kan ikke efterproeves mod nogen kilde) - de staar
// stadig paa dansk med vilje. Se rapportens L87-liste.

const ROBOTS = [
  { robot_id: 2184, notes: [
    'ANYbotics AG, Hagenholzstrasse 83a, 8050 Zürich. Also an office in San Francisco. Switzerland is not in the EU.',
    'A complete datasheet exists, but only behind a form (https://www.anybotics.com/anymal-specifications-sheet/). Not retrieved.',
  ] },
  { robot_id: 2185, notes: [
    'THE MANUFACTURER DISCLOSES NO FIGURES. The specifications section on the product page consists of ONE sentence: 2026 ANYmal X specifications coming soon.',
  ] },
  { robot_id: 2187, notes: [
    "STATUS ASSESSMENT, NOT UNAMBIGUOUS FROM THE MANUFACTURER ITSELF: the Shvana page presents the robot with a concrete 'Features' spec sheet (the same structure as a product for sale), but nowhere uses words like 'available now', 'in production', 'order' or similar - the only call to action is 'For more details, email info@bhairavrobotics.com'. No customer case, no delivered unit mentioned (unlike Keybotic Keyper's case study). Status is therefore set to: announced, not in_production.",
    "COMPUTE DELIBERATELY NOT SET TO A VALUE: 'Thanks to... onboard computational power, Shvana can quickly adapt' mentions 'onboard computational power' without any chip name, core count or TOPS figure. The text carries no measurable information beyond the presence of an onboard computer - not disclosed is therefore more honest than reproducing a content-free sentence as a 'field'.",
    'NO DIMENSIONS, IP RATING, TEMPERATURE, BATTERY Wh, CHARGING TIME, DOCKING STATION, HOT-SWAP, ROS2, SDK LANGUAGE, SLOPE, OBSTACLE HEIGHT OR PRICE FOUND ANYWHERE ON THE MANUFACTURER\'S SITE (shvana-robot/, homepage, careers, contact page partially inaccessible). All these fields are set to not disclosed without further note, since there was nothing to cite - neither a figure, qualitative text, nor a contradiction.',
  ] },
  { robot_id: 2188, notes: [
    'HOME CITY IS NOT DISCLOSED: the string "Waltham", often attributed to the manufacturer, appears 0 times in the manufacturer\'s own product page and datasheet. Neither of the two sources discloses an address or city.',
    // UVERIFICERET (L87): "Majoritetsejet af Hyundai Motor Group" kunne ikke
    // efterprøves mod nogen kilde - kun en samarbejdsoverskrift blev fundet
    // (bd-about-2026-09-02.html), ingen eksplicit ejerskabserklæring. Efterladt
    // på dansk med vilje, se rapportens L87-liste. Værdien selv ("Hyundai",
    // "Sydkorea") røres ikke.
    'Majoritetsejet af Hyundai Motor Group (Sydkorea). Noteret fordi producentland bliver tvetydigt.',
    'TWO MANUFACTURER SOURCES: product page (K1) and the manufacturer\'s own datasheet (K2, marked Updated: 05/22/2024). They disagree on length and weight.',
  ] },
  { robot_id: 2214, notes: [
    'THE MANUFACTURER NO LONGER MENTIONS THE MODEL. https://www.ghostrobotics.io/spirit-40 returns HTTP 404, and the navigation on the manufacturer\'s homepage contains exactly ONE product link: /vision-60. Measured 2026-08-19, re-confirmed live 2026-09-02.',
    'NO FIELDS COLLECTED. Specifications exist at resellers and in third-party databases; they were deliberately not retrieved, because they cannot be dated against the manufacturer and would give the entry a false freshness.',
    'Status discontinued is a catalog decision made on the 404 response and the navigation, not a statement from the manufacturer. The manufacturer has not itself said the model is discontinued.',
  ] },
  { robot_id: 2215, notes: [
    "HOME CITY NOT DISCLOSED: the string 'Philadelphia', often attributed to the manufacturer, appears 0 times in the manufacturer's homepage, product page and datasheet. The footer only has 'Get In Touch', and the datasheet has an email and domain, no address.",
    'The datasheet (SPECSHEET V3.3, 2024) downloads directly from the product page, but is hosted on the manufacturer\'s Webflow CDN, not on their own domain. The URL can die.',
  ] },
  { robot_id: 2216, notes: [
    "PRICE: ROBOT-AS-A-SERVICE, NO FIXED PRICE. FAQ: 'How much does it cost to hire a Keyper? With our Robot as a Service (RaaS) employment model, you can hire your own Keyper and start automating your inspections with no initial investment -the final costs will be adjusted based on each customer’s specific needs with different software applications. Of course, purchase options are also available.' There is no list figure to enter - the field is not disclosed, not 0 or no, because the manufacturer actively sells/leases the robot, just without a published price list.",
    "THE INSPECTION HEAD IS A SUB-MODULE, NOT THE WHOLE ROBOT'S DEGREES OF FREEDOM: 'Pan range: -150º/150º' and 'Tilt range: -55º/45º' appear under the heading 'Inspection Head' (a separate 4kg head module with zoom/thermal camera, ultrasonic microphone, projector and speakers) and describe ONLY this module's pan/tilt movement - not the robot's total degrees of freedom/joints. Degrees of freedom is therefore not disclosed, not 2.",
  ] },
  { robot_id: 2217, notes: [
    "THE MANUFACTURER ITSELF DECLARES THE MODEL DISCONTINUED, verbatim (including the manufacturer's own typo): 'With the launch of the new version, sales of the Honey Badger 4.0 have officialy come to an end.' And: 'Don't worry, we'll support your existing HB4.0 robot during the warranty period.'",
    'The generational change goes the wrong way on two fields: the 5.0 is heavier (17 vs 12 kg) and has a lower ingress-protection class (IP66 vs up to IP67), while payload increases (5 vs 4 kg) and operating temperature widens (0-45 vs 0-40°C).',
  ] },
  { robot_id: 2218, notes: [
    'EU MANUFACTURER - the only one in the entire collection. MAB Robotics Sp. z o.o., ul. Za Cytadelą 108, Poznań. VAT PL7822870297.',
    "THE EU-COLUMN'S MODEL CASE. The only EU manufacturer in the collection discloses NOTHING about CE - and more broadly: zero hits for CE, conformity, declaration, certif, EN ISO, RoHS, ATEX, UKCA and FCC in 1.48 MB of HTML, negatively AND positively controlled. Not because the machine lacks CE (a Polish machine sold in the EU must have it), but because CE is so self-evident for an EU manufacturer that no one writes it. 'CE disclosed = no' therefore does not mean the same thing for a Polish and a US manufacturer. The column must show disclosed / not disclosed, never has CE / does not have CE.",
    'Successor to the Honey Badger 4.0. The generational change goes the wrong way on two fields: the 5.0 is heavier (17 vs 12 kg) and has a lower ingress-protection class (IP66 vs up to IP67) than the 4.0.',
  ] },
  { robot_id: 2228, notes: [
    "THE HOME CITY IS SEJONG-SI, NOT DAEJEON, which the company is sometimes attributed to: the string 'Daejeon' appears 0 times in six saved manufacturer files. The manufacturer's own footer states (30141) 8, Jipyeongjungang 3-ro, Jipyeon-dong, Sejong-si, Republic of Korea, tel. +82-44-860-9600. Postal code 30141 and area code 044 are both Sejong. The company originated from KAIST in Daejeon, but that is not what the source says.",
    'RAINBOW ROBOTICS PUBLISHES THE ENTIRE USER MANUAL PUBLICLY as a static page - including battery data, joint torques, IMU specifications and mounting interface. No form, no login. That is why this entry is the densest Western/Asian entry in the collection, and it gives the catalog a usable test: does the manufacturer publish its user manual openly, yes/no.',
  ] },
  { robot_id: 2229, notes: [
    'THE QUESTION WAS WHETHER IT IS A PRODUCT AT ALL. THE ANSWER IS YES. RAIBO2 was developed at KAIST RaiLab (Prof. Jemin Hwangbo) and commercialized by the spin-off company Raion Robotics Inc. (라이온로보틱스), Daejeon, with an office in Seoul. The product page https://raionrobotics.com/en/product/Raibo2 responded HTTP 200 on 2026-08-21 and has a sales section: "For product purchases, demo requests, quotations, PoC projects, and business partnerships, contact our sales team." The entry was therefore created - but under Raion Robotics, not under KAIST.',
    "THE MANUFACTURER PUBLISHES NO SPECIFICATION TABLE FOR THE ROBOT. The product page has exactly one table, and it belongs to the ACTUATOR: Peak Torque 100 Nm, Rated Voltage 48 V, Max Speed 195.8 rpm, Rated Current 14.1 A, Weight 1.8 kg. THE TRAP IS 'Weight 1.8 kg' - that is a single motor module, not the robot. None of the five figures are entered as robot data.",
    'COMPARE WITH WEILAN E300: two entries with almost no fields filled in, for two completely different reasons. Weilan HAS disclosed and has taken it down. Raion Robotics has never disclosed anything about the robot, only about its motor. A catalog view that shows both as 0% loses that difference.',
    "THE MARATHON IS MARKETING, NOT A SPECIFICATION. The manufacturer states 'RAIBO2 demonstrates long-duration mobility through a public marathon course.' The distance and time are not stated on the manufacturer's page and have not been retrieved from the press.",
  ] },
  { robot_id: 2230, notes: [
    // UVERIFICERET (L87): "Tidligere Swiss-Mile... udspring fra ETH Zuerich"
    // kunne ikke efterprøves mod nogen kilde (0 træf i alle fire rivr.ai-filer,
    // inklusive et frisk hentet stories-opslag, se rivr-stories-2026-09-02.html
    // i MANIFEST). Efterladt på dansk med vilje, se rapportens L87-liste.
    'Tidligere Swiss-Mile. RIVR Technologies AG, udspring fra ETH Zuerich. Hjul-ben-hybrid.',
    'The robot does not appear to be sold as a product, but as a delivery service - the product page is written for logistics buyers, not engineers. Only 3 of 31 fields are disclosed: no weight, no dimensions, no IP rating, no battery size, no degrees of freedom. Negative-searched across three pages for IP rating, kg, mm/cm, Wh and DoF - the only hit is the 30 kg above.',
  ] },
];

/* ------------------------------------------------------ kilde-verifikation */

function verificerAlt() {
  let fejl = 0;
  let tjekket = 0;
  for (const r of FIELD_ENTRIES) {
    if (!r.caveat_wording) continue;
    const kilder = r.wordingKilder || [r.kilde];
    for (const frag of fragmenter(r.caveat_wording)) {
      tjekket++;
      const resultater = kilder.map((k) => verificerFragment(frag, k));
      if (!resultater.some((v) => v.ok)) {
        fejl++;
        console.error(`FEJL ${r.robot_id}/${r.field_name}: "${frag}" — ikke fundet i ${kilder.join(', ')}`);
      }
    }
  }
  console.log(`Kildeverifikation: ${tjekket} fragmenter tjekket, ${fejl} fejl.`);
  return fejl === 0;
}

/* --------------------------------------------------------------- main */

async function main() {
  const args = process.argv.slice(2);
  const kunVerificer = args.includes('--verificer');
  const skriv = args.includes('--skriv');

  console.log('--- Kildeverifikation (kildens ord, bogstaveligt i raa-teksten) ---');
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
  const K2 = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!U || !K2) {
    console.error('Kræver SUPABASE_URL og SUPABASE_SERVICE_ROLE_KEY i .env.');
    process.exitCode = 1;
    return;
  }
  const H = {
    apikey: K2,
    Authorization: `Bearer ${K2}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  };

  console.log(`\n--- ${skriv ? 'SKRIVER' : 'TØRLØB'} ---\n`);

  let planlagte = 0;
  let udfoerte = 0;
  const fejl = [];

  async function patchEen(tabel, filterQ, body, beskrivelse) {
    planlagte++;
    console.log(`${tabel} ${beskrivelse}`);
    if (!skriv) return;
    const url = `${U}/rest/v1/${tabel}?${filterQ}`;
    const svar = await fetch(url, { method: 'PATCH', headers: H, body: JSON.stringify(body) });
    const txt = await svar.text();
    let json;
    try { json = JSON.parse(txt); } catch { json = null; }
    if (!svar.ok || !Array.isArray(json) || json.length !== 1) {
      const m = `AFBRUDT: ${tabel} ${beskrivelse} — status ${svar.status}, ${Array.isArray(json) ? json.length : 'ikke-array'} rækker: ${txt.slice(0, 300)}`;
      console.error(' ', m);
      fejl.push(m);
      process.exitCode = 1;
      return;
    }
    udfoerte++;
    console.log('  OK, 1 række opdateret.');
  }

  for (const r of FIELD_ENTRIES) {
    const body = { collected_by: COLLECTED_BY, change_reason: 'fase 2: engelsk broedtekst, ordret kildeordlyd udskilt i caveat_wording (kasse A)' };
    if (r.caveat !== undefined) body.caveat = r.caveat;
    if (r.caveat_wording !== undefined) body.caveat_wording = r.caveat_wording;
    if (r.value_text !== undefined) body.value_text = r.value_text;
    await patchEen('field_entries', `robot_id=eq.${r.robot_id}&field_name=eq.${r.field_name}`, body, `${r.robot_id}/${r.field_name}`);
    if (fejl.length && skriv) return afslut();
  }

  for (const r of VALUE_TEXT_ONLY) {
    const body = { value_text: r.value_text, collected_by: COLLECTED_BY, change_reason: 'fase 2: value_text oversat til engelsk (caveat uaendret, var allerede null)' };
    await patchEen('field_entries', `robot_id=eq.${r.robot_id}&field_name=eq.${r.field_name}`, body, `${r.robot_id}/${r.field_name} (kun value_text)`);
    if (fejl.length && skriv) return afslut();
  }

  for (const a of APPLICATIONS) {
    const body = { note: a.note, collected_by: COLLECTED_BY, change_reason: 'fase 2: applications.note oversat til engelsk' };
    await patchEen('applications', `robot_id=eq.${a.robot_id}`, body, `${a.robot_id}.note`);
    if (fejl.length && skriv) return afslut();
  }

  for (const im of IMAGES) {
    const body = { note: im.note, collected_by: COLLECTED_BY, change_reason: 'fase 2: images.note oversat til engelsk' };
    await patchEen('images', `robot_id=eq.${im.robot_id}`, body, `${im.robot_id}.note`);
    if (fejl.length && skriv) return afslut();
  }

  for (const r of ROBOTS) {
    const body = { notes: r.notes, collected_by: COLLECTED_BY, change_reason: 'fase 2: robots.notes oversat til engelsk (uverificerbare elementer, jf. L87, efterladt paa dansk)' };
    await patchEen('robots', `id=eq.${r.robot_id}`, body, `${r.robot_id}.notes`);
    if (fejl.length && skriv) return afslut();
  }

  return afslut();

  function afslut() {
    console.log(`\n${skriv ? 'Skrevet' : 'Ville skrive'}: ${planlagte} opdateringer${skriv ? ` (${udfoerte} bekræftet)` : ''}.`);
    if (!skriv) {
      console.log('Dette var et TØRLØB. Kør med --skriv for at skrive rent faktisk.');
    }
    if (fejl.length) {
      console.log(`\n${fejl.length} FEJL:`);
      for (const f of fejl) console.log(' -', f);
      process.exitCode = 1;
    }
  }
}

export { FIELD_ENTRIES, VALUE_TEXT_ONLY, APPLICATIONS, IMAGES, ROBOTS };

const koertDirekte = process.argv[1] && import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`;
if (koertDirekte) {
  main().catch((err) => {
    console.error('f2-vest-skriv: fejl —', err.message, err.stack);
    process.exitCode = 1;
  });
}
