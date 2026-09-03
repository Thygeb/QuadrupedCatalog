#!/usr/bin/env node
/**
 * db/f2-unitree-skriv.mjs — spor/f2-unitree's skriveredskab (ejet af dette
 * spor alene). Renser caveat/caveat_wording (field_entries), note
 * (applications, images) og notes/notes_wording (robots) for de 13
 * Unitree-robotter (robot_id 2231-2243), plus de 2 danske value_text-felter
 * på Go1 (2240).
 *
 * VIGTIGT FUND (se FUND-f2unitree.md): briefets praemis "kilden er
 * kinesisk" holdt IKKE for Unitree. Alle 16 raa-HTML-filer i
 * media/_kilder/raa-kina-unitree-2026-08-19/ er ENGELSKE (en-US,
 * unitree.com "United States / English") - 0 CJK-tegn maalt paa tvaers af
 * alle 16 filer. Metoden brugt her er derfor OPSKRIFT-fase2.md's
 * (udtraekning fra engelsk broedtekst), ikke OPSKRIFT-fase2-cjk.md's
 * karaktertegns-metode - MED ÉN UNDTAGELSE: applications.note for flere
 * robotter refererer til den KINESISKE navigation (som DOGKUMENTERET i den
 * eksisterende quote_wording-kolonne, der IKKE roeres her). Den kinesiske
 * forside manglede som raakilde og blev hentet frisk 2026-09-02
 * (media/_kilder/raa-f2-unitree-2026-09-02/) for at efterproeve DE claims.
 *
 * Regel (BRIEF-FAELLES.md, L87): caveat_wording baerer KUN kildens
 * ord/tal, ordret. Vores egen prosa (caveat, note, notes) maa staa, men
 * kun naar hver paastand i den kan efterproeves i en raakildefil.
 *
 * FØR nogen PATCH køres, tjekker --verificer (og hver --toerloeb/--skriv-
 * kørsel automatisk) hvert caveat_wording-fragment som en BOGSTAVELIG
 * delstreng af den relevante raa kildefil (fragmenter adskilt med " | ",
 * som i f2-pilot; en etiket+vaerdi-split proeves som fallback, som i
 * f2-cjk, for felter hvor label og tal sidder i to DOM-celler).
 *
 * Brug:
 *   node db/f2-unitree-skriv.mjs --verificer   Kun kildetjek, ingen DB.
 *   node db/f2-unitree-skriv.mjs --toerloeb    Standard: viser hvad der VILLE ske.
 *   node db/f2-unitree-skriv.mjs --skriv       Skriver rent faktisk, 1 PATCH pr. post.
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

const D = 'raa-kina-unitree-2026-08-19/';
const A1 = D + 'unitree-a1-produktside-2026-08-19.html';
const A2 = D + 'unitree-a2-produktside-2026-08-19.html';
const A2_SHOP = D + 'unitree-a2-shopside-2026-08-19.html';
const A2W = D + 'unitree-a2-w-produktside-2026-08-19.html';
const ALIENGO = D + 'unitree-aliengo-produktside-2026-08-19.html';
const AS2 = D + 'unitree-as2-produktside-2026-08-19.html';
const AS2W = D + 'unitree-as2-w-produktside-2026-08-19.html';
const B1 = D + 'unitree-b1-produktside-2026-08-19.html';
const B2 = D + 'unitree-b2-produktside-2026-08-19.html';
const B2_SHOP = D + 'unitree-b2-shopside-2026-08-19.html';
const B2W = D + 'unitree-b2-w-produktside-2026-08-19.html';
const GO1 = D + 'unitree-go1-produktside-2026-08-19.html';
const GO2 = D + 'unitree-go2-produktside-2026-08-19.html';
const GO2W = D + 'unitree-go2-w-produktside-2026-08-19.html';
const NAV_EN = D + 'unitree-forside-nav-2026-08-19.html';
const CN_HOME = 'raa-f2-unitree-2026-09-02/unitree-cn-forside-2026-09-02.html';
// Genbrugt fra spor/anvendelse (allerede i worktree, IKKE hentet af os):
const ABOUT_EN = 'raa-anvendelse-2026-08-19/unitree-about-en-2026-08-21.html';
const LAIKAGO_404 = 'raa-anvendelse-2026-08-19/unitree-laikago-produktside-en-2026-08-21-FEJL-404.html';
const NAV_EN_21 = 'raa-anvendelse-2026-08-19/unitree-forside-nav-en-2026-08-21.html';

// Samme HTML->tekst-udtraekning som brugt til selve efterproevningen
// (OPSKRIFT-fase2.md's punkt om at strippe HTML FOER man greper): fjerner
// script/style, saetter linjeskift ved blok-graenser, stripper tags,
// afkoder entiteter, collapser mellemrum PR. LINJE (linjeskift bevares —
// etiket og vaerdi i to DOM-celler forbliver to linjer, ikke ét fragment).
function htmlTilTekst(html) {
  let t = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ');
  t = t.replace(/<(br|\/p|\/div|\/li|\/tr|\/h[1-6]|\/td|\/th)\s*\/?>/gi, '\n').replace(/<[^>]+>/g, ' ');
  t = t.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
       .replace(/&#39;/g, "'").replace(/&quot;/g, '"')
       .replace(/&#(\d+);/g, (m, d) => String.fromCodePoint(parseInt(d, 10)));
  return t.split('\n').map((l) => l.replace(/[ \t]+/g, ' ').trim()).filter((l) => l.length > 0).join('\n');
}

const kildeCache = new Map();
const tekstCache = new Map();
function laesKilde(rel) {
  if (kildeCache.has(rel)) return kildeCache.get(rel);
  const fuld = path.join(KILDE_MAPPE, rel);
  const indhold = fs.existsSync(fuld) ? fs.readFileSync(fuld, 'utf8') : null;
  kildeCache.set(rel, indhold);
  return indhold;
}
function laesKildeSomTekst(rel) {
  if (tekstCache.has(rel)) return tekstCache.get(rel);
  const raa = laesKilde(rel);
  const tekst = raa === null ? null : htmlTilTekst(raa);
  tekstCache.set(rel, tekst);
  return tekst;
}

/** Et fragment skal findes ordret enten i den RAA HTML (dækker citater der
 *  er bogstaveligt sammenhaengende i kilden) eller i den udtrukne TEKST
 *  (dækker "label \n vaerdi"-formen, hvor to DOM-celler er blevet til to
 *  linjer — fragmentet skrives da som "label" og "vaerdi" hver for sig,
 *  adskilt af " | " i caveat_wording, IKKE sammensat til én streng). */
function verificerFragment(fragment, kildeRel) {
  const raa = laesKilde(kildeRel);
  if (raa === null) return { ok: false, grund: `kildefil mangler: ${kildeRel}` };
  if (raa.includes(fragment)) return { ok: true };
  const tekst = laesKildeSomTekst(kildeRel);
  if (tekst.includes(fragment)) return { ok: true, udtrukket: true };
  // Sidste udvej: fragmentet er "etiket vaerdi" adskilt af ÉT linjeskift
  // i den udtrukne tekst (dvs. de to dele staar lige efter hinanden som
  // to linjer) - check det ene linjeskift-tilfaelde eksplicit.
  const enkeltLinjeskift = tekst.replace(/\n/g, ' ');
  if (enkeltLinjeskift.includes(fragment)) return { ok: true, linjeskift: true };
  return { ok: false, grund: `IKKE fundet ordret i raa HTML eller udtrukket tekst: ${kildeRel}` };
}

function fragmenter(wording) {
  if (!wording) return [];
  return wording.split(' | ').map((s) => s.trim()).filter(Boolean);
}

/* ------------------------------------------------------------------ data */
// kasse: 'A' = kildeordlyd fandtes, udskilt fra dansk prosa · 'B' = vores
// egen analyse/negativkontrol, intet citat (caveat_wording forbliver null)
// · 'RETTET' = som 'A', men en delpaastand i den oprindelige danske caveat
// blev fundet IKKE at kunne efterproeves og er rettet (ikke hele trioen
// slettet - se FUND-f2unitree.md for begrundelsen pr. raekke).

const REASON_A = 'fase 2: engelsk kildeordlyd udskilt i caveat_wording, caveat oversat';
const REASON_B = 'fase 2: engelsk prosa (egen analyse/negativkontrol, intet citat i kilden)';
const REASON_RETTET = 'fase 2: engelsk oversaettelse; en delpaastand korrigeret efter kildeefterproevning (L87) - se FUND-f2unitree.md';

const FIELD_ENTRIES = [
  // ------------------------------------------------------- 2231 unitree-a1
  { robot_id: 2231, field_name: 'weight', kasse: 'B', kilde: A1, reason: REASON_B,
    caveat: "Negative check: the word 'Weight' does not appear anywhere on the page as its own term (only inside 'lightweight').",
    caveat_wording: null },
  { robot_id: 2231, field_name: 'payload_walking', kasse: 'A', kilde: A1, reason: REASON_A,
    caveat: "The manufacturer's spec card labels this 'Effective Load' without distinguishing walking or standing load; the field placement is our inference.",
    caveat_wording: '5 kg | Effective Load' },
  { robot_id: 2231, field_name: 'speed', kasse: 'A', kilde: A1, reason: REASON_A,
    caveat: "Manufacturer's own cross-check: 3.3 m/s equals 11.88 km/h, and the printed conversion is correct.",
    caveat_wording: 'Maximum continuous running speed 3.3m/s (11.88km/h).' },
  { robot_id: 2231, field_name: 'ip_rating', kasse: 'A', kilde: A1, reason: REASON_A,
    caveat: 'The page states the foot end is waterproof and dustproof, without giving an IP class.',
    caveat_wording: 'The foot end is waterproof and dustproof, and it is easy to replace.' },
  { robot_id: 2231, field_name: 'runtime', kasse: 'A', kilde: A1, reason: REASON_A,
    caveat: 'Given without a load condition.',
    caveat_wording: '1-2.5 h | Endurance' },
  { robot_id: 2231, field_name: 'lidar', kasse: 'A', kilde: A1, reason: REASON_A,
    caveat: 'Optional, no model given.',
    caveat_wording: 'Optional High-precision Lidar' },
  { robot_id: 2231, field_name: 'compute', kasse: 'A', kilde: A1, reason: REASON_A,
    caveat: 'No model given.',
    caveat_wording: 'Standard high-performance on-board dual master control (perception master and motion master).' },
  { robot_id: 2231, field_name: 'sdk_languages', kasse: 'A', kilde: A1, reason: REASON_A,
    caveat: 'No language given.',
    caveat_wording: 'Secondary Development（Up level, bottom level real-time API）' },
  { robot_id: 2231, field_name: 'power_output', kasse: 'A', kilde: A1, reason: REASON_A,
    caveat: 'Voltage given, wattage not. 24 V is input power and does not belong in this field.',
    caveat_wording: '24V external power input interface, 5V, 12V, 19V external output power supply, easy to connect to external expansion devices' },

  // ------------------------------------------------------- 2232 unitree-a2
  { robot_id: 2232, field_name: 'weight', kasse: 'A', kilde: A2, reason: REASON_A,
    caveat: 'Includes battery. The manufacturer also states about 35 kg without the battery, so the battery weighs roughly 7 kg. A2 is one of the few models that states both figures.',
    caveat_wording: 'Weight (with battery) About 42kg | Weight (without battery) About 35kg' },
  { robot_id: 2232, field_name: 'height', kasse: 'A', kilde: A2, reason: REASON_A,
    caveat: 'Folded 720 x 550 x 220 mm. The schema has no field for folded dimensions.',
    caveat_wording: '720mm x 550mm x 220mm' },
  { robot_id: 2232, field_name: 'payload_walking', kasse: 'A', kilde: A2, reason: REASON_A,
    caveat: 'The manufacturer adds an ideal figure of about 35 kg.',
    caveat_wording: 'Continuous Walking Load About 25kg (Ideally, it can reach approximately 35 kg.)' },
  { robot_id: 2232, field_name: 'speed', kasse: 'A', kilde: A2, reason: REASON_A,
    caveat: 'Operating range 0-3.7 m/s; the manufacturer additionally states up to about 5 m/s as a speed spike.',
    caveat_wording: 'Speed 0–3.7 m/s (Up to ~5 m/s)' },
  { robot_id: 2232, field_name: 'obstacle_single', kasse: 'A', kilde: A2, reason: REASON_A,
    caveat: "The manufacturer's label is Max Climb Height, given as a range of about 0.5-1 m.",
    caveat_wording: 'Max Climb Height About 0.5～1m' },
  { robot_id: 2232, field_name: 'stair_step_continuous', kasse: 'A', kilde: A2, reason: REASON_A,
    caveat: 'Label: Stair Climbing Capability, Max Step Height.',
    caveat_wording: 'Stair Climbing Capability Max Step Height: 30cm' },
  { robot_id: 2232, field_name: 'battery_wh', kasse: 'A', kilde: A2, reason: REASON_A,
    caveat: "Both of the manufacturer's own calculations check out exactly (9000 mAh x 50.4 V = 453.6 Wh; 18000 mAh x 50.4 V = 907.2 Wh).",
    caveat_wording: 'Supply Voltage 50.4V | Single Battery 9000mAh（453.6Wh） | Dual Batteries 18000mAh（907.2Wh）' },
  { robot_id: 2232, field_name: 'runtime', kasse: 'A', kilde: A2, reason: REASON_A,
    caveat: 'The manufacturer also states >5 h with no load (about 20 km). The figure used here carries the load condition (about 12.5 km).',
    caveat_wording: 'No Load： | >5hours continuous walking, approx. 20km | With 25kg Load： | >3 hours continuous walking, approx. 12.5km' },
  { robot_id: 2232, field_name: 'hot_swap', kasse: 'A', kilde: A2, reason: REASON_A,
    caveat: 'Marketed as hot-swap.',
    caveat_wording: 'Dual slots, dual batteries | 「Hot-Swappable Dual Batteries · Unlimited Runtime」: Seamless Battery Swap, Uninterrupted Mission' },
  { robot_id: 2232, field_name: 'lidar', kasse: 'A', kilde: A2, reason: REASON_A,
    caveat: "A2: LiDAR x1. A2-PRO: LiDAR x2. Type without model — does not count as filled under D4's provisional rule.",
    caveat_wording: 'LiDAR × 1 + HD Camera × 1 | LiDAR × 2 + HD Camera × 1' },
  { robot_id: 2232, field_name: 'sdk_languages', kasse: 'A', kilde: A2, reason: REASON_A,
    caveat: 'The page states Secondary Development: Supported, but does not name any language.',
    caveat_wording: 'Secondary Development Supported' },
  { robot_id: 2232, field_name: 'power_output', kasse: 'A', kilde: A2, reason: REASON_A,
    caveat: 'Voltage given, wattage not.',
    caveat_wording: 'Power Output：12V / 24V / BAT' },
  { robot_id: 2232, field_name: 'price', kasse: 'RETTET', kilde: A2_SHOP, reason: REASON_RETTET,
    caveat: "The manufacturer states Contact Sales. The shop page shows a placeholder of $100,000 USD for A2 — the same amount as B2 — next to a note asking buyers to contact the sales team directly; it is not a real price. (Checked: the exact phrase 'Contact us for the real price' does appear elsewhere on this same shop page, but attached to a different, unrelated product — Unitree H1 — not to A2's own price listing, so it is not carried here.)",
    caveat_wording: '$100,000.00 USD | Please contact our sales team (sales_global@unitree.cc) to purchase Unitree A2.' },

  // ---------------------------------------------------- 2233 unitree-a2-w
  { robot_id: 2233, field_name: 'weight', kasse: 'A', kilde: A2W, reason: REASON_A,
    caveat: 'Includes battery. Without the battery, about 45 kg.',
    caveat_wording: 'Weight (with battery) About 52kg | Weight (without battery) About 45kg' },
  { robot_id: 2233, field_name: 'height', kasse: 'A', kilde: A2W, reason: REASON_A,
    caveat: 'Folded 930 x 685 x 210 mm — longer than standing. The schema has no field for folded dimensions.',
    caveat_wording: '930mm x 685mm x 210mm' },
  { robot_id: 2233, field_name: 'speed', kasse: 'A', kilde: A2W, reason: REASON_A,
    caveat: "Operating range 0-3 m/s; spike up to about 6 m/s. A2-W is faster at its spike than A2 (about 6 vs about 5) but slower in ordinary operation (0-3 vs 0-3.7).",
    caveat_wording: 'Speed 0–3 m/s (Up to ~ 6 m/s)' },
  { robot_id: 2233, field_name: 'obstacle_single', kasse: 'A', kilde: A2W, reason: REASON_A,
    caveat: 'Label: Max Climb Height.',
    caveat_wording: 'Max Climb Height About 0.5～1m' },
  { robot_id: 2233, field_name: 'battery_wh', kasse: 'A', kilde: A2W, reason: REASON_A,
    caveat: 'Single battery 453.6 Wh (9000 mAh, 50.4 V); dual battery 907.2 Wh. Same battery as A2.',
    caveat_wording: 'Single Battery 9000mAh（453.6Wh） | Dual Batteries 18000mAh（907.2Wh）' },
  { robot_id: 2233, field_name: 'runtime', kasse: 'A', kilde: A2W, reason: REASON_A,
    caveat: "Also >3.5 h with no load (about 35 km). Under the same load and the same battery, A2-W's runtime is under half of A2's (>1.5 h vs >3 h), but its range is longer (about 15 km vs about 12.5 km).",
    caveat_wording: 'No Load： | >3.5 hours continuous walking, approx. 35km | With 25kg Load： | >1.5 hours continuous walking, approx. 15km' },
  { robot_id: 2233, field_name: 'hot_swap', kasse: 'A', kilde: A2W, reason: REASON_A,
    caveat: 'Dual slots, dual batteries.',
    caveat_wording: 'Dual slots, dual batteries' },
  { robot_id: 2233, field_name: 'lidar', kasse: 'A', kilde: A2W, reason: REASON_A,
    caveat: 'LiDAR x1 (x2 on PRO) — type without model, does not count under D4.',
    caveat_wording: 'LiDAR × 1 + HD Camera × 1 | LiDAR × 2 + HD Camera × 1' },

  // ------------------------------------------------- 2234 unitree-aliengo
  { robot_id: 2234, field_name: 'weight', kasse: 'RETTET', kilde: ALIENGO, reason: REASON_RETTET,
    caveat: "The manufacturer states 'Weight (without battery) 21.5kg ±1kg' — the figure is WITHOUT the battery. Checked against all 12 other Unitree models in this catalog: 9 (A2, A2-W, AS2, AS2-W, B1, B2, B2-W, Go2, Go2-W) explicitly label their weight as including the battery; A1 and Laikago do not state a weight at all; only Go1's unlabeled '12 kg' figure does not say either way. So, with that one exception, AlienGo's is the only stated Unitree weight that explicitly excludes the battery. Placed next to Go2's 15 kg and As2's 20 kg — both explicitly with-battery figures — this compares a robot without its battery to two robots with theirs. Tolerance is ±1 kg.",
    caveat_wording: 'Weight (without battery) | 21.5kg ±1kg' },
  { robot_id: 2234, field_name: 'height', kasse: 'A', kilde: ALIENGO, reason: REASON_A,
    caveat: 'Folded 0.60 x 0.31 x 0.15 m. The schema has no field for folded dimensions.',
    caveat_wording: 'Length*Width*Height（fold）' },
  { robot_id: 2234, field_name: 'degrees_of_freedom', kasse: 'A', kilde: ALIENGO, reason: REASON_A,
    caveat: 'Explicit heading: Degrees of Freedom (number of motors).',
    caveat_wording: 'Degrees of Freedom (number of motors)' },
  { robot_id: 2234, field_name: 'payload_walking', kasse: 'A', kilde: ALIENGO, reason: REASON_A,
    caveat: "The manufacturer states only 'Load', without indicating walking or standing. The placement is our inference.",
    caveat_wording: 'Load | 13kg' },
  { robot_id: 2234, field_name: 'slope', kasse: 'A', kilde: ALIENGO, reason: REASON_A,
    caveat: 'The manufacturer states Climbing Angle <=25 (U+2264). That is an UPPER LIMIT, not a capability. Every other Unitree model states its slope as >45° or about 45° — a capability. Placing 25 next to 45 in the same column makes AlienGo look like a worse robot; it is a different kind of statement.',
    caveat_wording: 'Climbing Angle | ≤25°' },
  { robot_id: 2234, field_name: 'obstacle_single', kasse: 'A', kilde: ALIENGO, reason: REASON_A,
    caveat: 'The page states Up and down steps, slopes, stairs, without a figure.',
    caveat_wording: 'Up and down steps, slopes, stairs' },
  { robot_id: 2234, field_name: 'ip_rating', kasse: 'A', kilde: ALIENGO, reason: REASON_A,
    caveat: 'The page states Integrated Advanced Level of Protection, without a class.',
    caveat_wording: 'Integrated Advanced Level of Protection' },
  { robot_id: 2234, field_name: 'battery_wh', kasse: 'A', kilde: ALIENGO, reason: REASON_A,
    caveat: 'Only 12600 mAh — neither voltage nor Wh. Cannot be converted, and is not.',
    caveat_wording: 'Battery Capacity | 12600mAh' },
  { robot_id: 2234, field_name: 'runtime', kasse: 'A', kilde: ALIENGO, reason: REASON_A,
    caveat: 'Given without a load condition.',
    caveat_wording: '2.5-4.6h' },
  { robot_id: 2234, field_name: 'lidar', kasse: 'A', kilde: ALIENGO, reason: REASON_A,
    caveat: 'Single or multi-line, optional — no model given.',
    caveat_wording: 'Lidar: Single or Multi-line (optional)' },
  { robot_id: 2234, field_name: 'compute', kasse: 'A', kilde: ALIENGO, reason: REASON_A,
    caveat: 'The page states onboard PC, no model given.',
    caveat_wording: 'The developer version comes with an onboard PC and opens the corresponding interfaces.' },
  { robot_id: 2234, field_name: 'ros2', kasse: 'A', kilde: ALIENGO, reason: REASON_A,
    caveat: "The page states 'supports C/C++, ROS' and 'Environment Sensing: Ubuntu-ROS'. The field is named ROS 2, and no version is given. Counting it would be inventing a version number.",
    caveat_wording: 'supports C/C++, ROS, etc. | Environment Sensing：Ubuntu-ROS' },
  { robot_id: 2234, field_name: 'power_output', kasse: 'A', kilde: ALIENGO, reason: REASON_A,
    caveat: 'Voltage given, wattage not.',
    caveat_wording: 'Output Power | 5V、12V、19V、BAT(24V~30V)' },

  // ----------------------------------------------------- 2235 unitree-as2
  { robot_id: 2235, field_name: 'height', kasse: 'A', kilde: AS2, reason: REASON_A,
    caveat: 'Folded 776 x 378 x 233 mm. The schema has no field for folded dimensions.',
    caveat_wording: 'Size (Lying Prone) 776mm x 378mm x 233mm' },
  { robot_id: 2235, field_name: 'payload_walking', kasse: 'A', kilde: AS2, reason: REASON_A,
    caveat: 'The AIR variant value. The span across the four variants is 10-15 kg.',
    caveat_wording: 'Continuous Walking Load Approx. 10kg' },
  { robot_id: 2235, field_name: 'payload_standing', kasse: 'A', kilde: AS2, reason: REASON_A,
    caveat: 'The AIR variant value. The span is 45-65 kg.',
    caveat_wording: 'Max Standing Load Approx. 45kg' },
  { robot_id: 2235, field_name: 'speed', kasse: 'A', kilde: AS2, reason: REASON_A,
    caveat: 'The AIR variant value.',
    caveat_wording: 'Speed 0~3.0m/s' },
  { robot_id: 2235, field_name: 'slope', kasse: 'A', kilde: AS2, reason: REASON_A,
    caveat: 'The AIR variant value.',
    caveat_wording: 'Slope Walking Capability Approx. 30 °' },
  { robot_id: 2235, field_name: 'obstacle_single', kasse: 'A', kilde: AS2, reason: REASON_A,
    caveat: 'Stated ONLY in the body text (with the ability to climb 50cm vertical platforms and 40 slopes), not in the parameter table — unlike A2, A2-W and As2-W, which all have a Max Climb Height row. If it is decided that only table values count, this field falls out.',
    caveat_wording: 'with the ability to climb 50cm vertical platforms and 40° slopes' },
  { robot_id: 2235, field_name: 'stair_step_continuous', kasse: 'A', kilde: AS2, reason: REASON_A,
    caveat: 'The AIR variant value.',
    caveat_wording: 'Stair Climbing Capability 20cm' },
  { robot_id: 2235, field_name: 'ip_rating', kasse: 'A', kilde: AS2, reason: REASON_A,
    caveat: 'The AIR column has an explicit / where the other columns have a value. Read as NO, not as not-stated (rule 10). The value here is the AIR variant.',
    caveat_wording: 'Protection Rating /' },
  { robot_id: 2235, field_name: 'temperature_max', kasse: 'A', kilde: AS2, reason: REASON_A,
    caveat: 'The AIR/PRO variant value.',
    caveat_wording: 'Operating Temperature -20℃ ～ 50℃' },
  { robot_id: 2235, field_name: 'battery_wh', kasse: 'A', kilde: AS2, reason: REASON_A,
    caveat: 'The value applies to PRO/X/EDU. AIR states only 8000 mAh with no voltage — Wh cannot be derived and is not.',
    caveat_wording: 'Powered by a 648Wh (15,000mAh) high-capacity battery.' },
  { robot_id: 2235, field_name: 'runtime', kasse: 'A', kilde: AS2, reason: REASON_A,
    caveat: "The AIR variant's loaded figure.",
    caveat_wording: 'Battery Life(Loaded) With 10kg loaded, >1.5 hours continuous walking, approx. 7km' },
  { robot_id: 2235, field_name: 'charging_time', kasse: 'A', kilde: AS2, reason: REASON_A,
    caveat: 'Only the charger is stated (50.4 V 4 A / 7.4 A), not a charging time.',
    caveat_wording: 'Charger Standard (50.4V 4A) | Fast Charging (50.4V 7.4A)' },
  { robot_id: 2235, field_name: 'docking_station', kasse: 'A', kilde: AS2, reason: REASON_A,
    caveat: 'Only EDU has a charging dock. The value here is AIR/PRO/X.',
    caveat_wording: 'Charging Dock /' },
  { robot_id: 2235, field_name: 'lidar', kasse: 'A', kilde: AS2, reason: REASON_A,
    caveat: "Only the AIR column names a model. The other three state a class, not a model, and do not count under D4.",
    caveat_wording: 'Ultra-Wide-Angle LiDAR Unitree L2' },
  { robot_id: 2235, field_name: 'sdk_languages', kasse: 'A', kilde: AS2, reason: REASON_A,
    caveat: 'Secondary Development: Not Supported for AIR/PRO, Supported for X/EDU — but no language is given.',
    caveat_wording: 'Secondary Development Not Supported' },
  { robot_id: 2235, field_name: 'power_output', kasse: 'A', kilde: AS2, reason: REASON_A,
    caveat: 'Only BAT is mentioned, no voltage.',
    caveat_wording: 'Power Output：BAT' },
  { robot_id: 2235, field_name: 'price', kasse: 'A', kilde: AS2, reason: REASON_A,
    caveat: 'Contact Sales on all four variants.',
    caveat_wording: 'Contact Sales' },

  // --------------------------------------------------- 2236 unitree-as2-w
  { robot_id: 2236, field_name: 'weight', kasse: 'A', kilde: AS2W, reason: REASON_A,
    caveat: 'Includes battery.',
    caveat_wording: 'Weight (with Battery) | Approx. 25 kg' },
  { robot_id: 2236, field_name: 'height', kasse: 'A', kilde: AS2W, reason: REASON_A,
    caveat: 'Folded 768 x 602 x 211 mm. The schema has no field for folded dimensions.',
    caveat_wording: '768mm x 602mm x 211mm' },
  { robot_id: 2236, field_name: 'payload_standing', kasse: 'RETTET', kilde: AS2W, reason: REASON_RETTET,
    caveat: 'Highest standing payload in the whole Unitree lineup — on a comparatively light robot (about 25 kg with battery).',
    caveat_wording: 'Max Standing Load Approx. 150kg' },
  { robot_id: 2236, field_name: 'speed', kasse: 'A', kilde: AS2W, reason: REASON_A,
    caveat: 'Spike up to about 6 m/s.',
    caveat_wording: 'Speed 0~3.7m/s (Max Approx. 6m/s)' },
  { robot_id: 2236, field_name: 'obstacle_single', kasse: 'A', kilde: AS2W, reason: REASON_A,
    caveat: 'The parameter table gives Max Climb Height as a range, 0.4~0.8 m. The page\'s key-figures card presents the upper end alone as 80 cm steps, and the body text states obstacles up to 80 cm high. The range is kept.',
    caveat_wording: 'Max Climb Height Approx. 0.4m ~ 0.8m | climbing obstacles up to 80 cm high | Obstacle Capability: 80 cm steps' },
  { robot_id: 2236, field_name: 'battery_wh', kasse: 'A', kilde: AS2W, reason: REASON_A,
    caveat: '15000 mAh. Wh is stated only in the body text, not in the table.',
    caveat_wording: 'Battery Capacity Long Range (15000mAh) x1 | a 648 Wh (15,000 mAh) battery' },
  { robot_id: 2236, field_name: 'runtime', kasse: 'A', kilde: AS2W, reason: REASON_A,
    caveat: "Table: >2 h at 16 kg, about 25 km; about 3 h with no load, about 30 km. The key-figures card on the same page states >16 km loaded against the table's about 25 km — a 56% difference, same page, same day. The table's figure is used.",
    caveat_wording: 'Battery Life(Loaded) With 16kg loaded, >2 hours continuous walking, approx. 25km | Loaded > 2h (>16 km)' },
  { robot_id: 2236, field_name: 'docking_station', kasse: 'A', kilde: AS2W, reason: REASON_A,
    caveat: 'The X variant value.',
    caveat_wording: 'Charging Dock /' },
  { robot_id: 2236, field_name: 'lidar', kasse: 'A', kilde: AS2W, reason: REASON_A,
    caveat: '64~128-line industrial LiDAR — type without model, does not count under D4.',
    caveat_wording: 'Ultra-Wide-Angle LiDAR Industrial-grade 64~128-line LiDAR' },
  { robot_id: 2236, field_name: 'power_output', kasse: 'A', kilde: AS2W, reason: REASON_A,
    caveat: 'Only BAT, no voltage.',
    caveat_wording: 'Power Output：BAT' },

  // ------------------------------------------------------ 2237 unitree-b1
  { robot_id: 2237, field_name: 'weight', kasse: 'A', kilde: B1, reason: REASON_A,
    caveat: 'Includes battery; the battery is separately stated at about 5 kg.',
    caveat_wording: 'Whole Machine (involve battery) About 50kg | Battery About 5kg' },
  { robot_id: 2237, field_name: 'height', kasse: 'A', kilde: B1, reason: REASON_A,
    caveat: 'Folded 1202 x 467 x 297 mm — LONGER than standing. Plausible for extended legs, but notable. The schema has no field for folded dimensions.',
    caveat_wording: 'Length*Width*Height(fold) | 1202*467*297mm' },
  { robot_id: 2237, field_name: 'payload_walking', kasse: 'A', kilde: B1, reason: REASON_A,
    caveat: 'No operator. The page adds in prose: it is recommended to keep the weight within 20 kg.',
    caveat_wording: 'Continuous walking load 20kg | In the process of carrying the load, it is recommended to control the weight within 20kg.' },
  { robot_id: 2237, field_name: 'payload_standing', kasse: 'A', kilde: B1, reason: REASON_A,
    caveat: 'No operator.',
    caveat_wording: 'Maximum standing load 80kg' },
  { robot_id: 2237, field_name: 'speed', kasse: 'B', kilde: B1, reason: REASON_B,
    caveat: 'The only Unitree industrial model with no speed figure at all.',
    caveat_wording: null },
  { robot_id: 2237, field_name: 'ip_rating', kasse: 'A', kilde: B1, reason: REASON_A,
    caveat: "IP68 appears ONLY in the heading text (IP68 Waterproof, Industrial Level Heavy Loader), not in the parameter table, which has no IP row at all. B1 is therefore the only Unitree model with a stated IP68, on the weakest source footing.",
    caveat_wording: 'IP68 Waterproof, Industrial Level Heavy Loader' },
  { robot_id: 2237, field_name: 'temperature_min', kasse: 'A', kilde: B1, reason: REASON_A,
    caveat: "The table's Working Temperature has the sub-row Battery: -5 C - 45 C. That is the BATTERY's range, not the robot's; there is no row for the robot itself. Placed next to B2's -20~55 C, B1 would look worse in cold — and that does not follow from the source.",
    caveat_wording: 'Working Temperature | Battery | -5℃ - 45℃' },
  { robot_id: 2237, field_name: 'temperature_max', kasse: 'A', kilde: B1, reason: REASON_A,
    caveat: 'See temperature_min — only the battery range is stated.',
    caveat_wording: 'Working Temperature | Battery | -5℃ - 45℃' },
  { robot_id: 2237, field_name: 'battery_wh', kasse: 'A', kilde: B1, reason: REASON_A,
    caveat: "18000 mAh, 51.8 V, charge-limit voltage 58.8 V. The manufacturer's own arithmetic checks out exactly: 18 x 51.8 = 932.4.",
    caveat_wording: 'Rated Capacity | 18000mAh | Rated Voltage | 51.8V | Rated Energy | 932.4Wh | Charge Limit Voltage | 58.8V' },
  { robot_id: 2237, field_name: 'runtime', kasse: 'A', kilde: B1, reason: REASON_A,
    caveat: 'The manufacturer states two conditions: 5 h standing and 2 h walking, both with no load. The walking figure is used here. No load condition beyond that.',
    caveat_wording: 'Stand Endurance | 5h | Continuous walking and endurance without load | 2h' },
  { robot_id: 2237, field_name: 'charging_time', kasse: 'A', kilde: B1, reason: REASON_A,
    caveat: 'The only one of the twelve Unitree models with a stated charging time.',
    caveat_wording: 'Charge Time 1-2h' },
  { robot_id: 2237, field_name: 'cameras', kasse: 'A', kilde: B1, reason: REASON_A,
    caveat: 'Model given — rare in this material.',
    caveat_wording: 'Sensing Sensor Intel RealSense D430*5' },
  { robot_id: 2237, field_name: 'power_output', kasse: 'A', kilde: B1, reason: REASON_A,
    caveat: 'Voltage given, wattage not.',
    caveat_wording: 'Standard Output power:12V/24V' },

  // ------------------------------------------------------ 2238 unitree-b2
  { robot_id: 2238, field_name: 'weight', kasse: 'A', kilde: B2, reason: REASON_A,
    caveat: "Total weight (battery included) — the figure is WITH the battery. AlienGo's weight is without the battery; the two figures are not comparable without that context.",
    caveat_wording: '≈ 60kg Total weight (battery included)' },
  { robot_id: 2238, field_name: 'height', kasse: 'A', kilde: B2, reason: REASON_A,
    caveat: 'Folded (Lying Prone) is stated as about 880 x 460 x 330 mm. The schema has no field for folded dimensions.',
    caveat_wording: '≈ 880mm×460mm×330mm' },
  { robot_id: 2238, field_name: 'payload_standing', kasse: 'A', kilde: B2, reason: REASON_A,
    caveat: 'The manufacturer writes the character U+2265. Two different operators on the same page: > on walking load, >= on standing. B2-W states the same 120 kg with no operator at all.',
    caveat_wording: 'Standing load ≥120kg' },
  { robot_id: 2238, field_name: 'speed', kasse: 'A', kilde: B2, reason: REASON_A,
    caveat: "The manufacturer's footnote [1]: realized in special configurations, in practice there is a speed limit for security purposes. The operationally relevant speed is not stated on the page.",
    caveat_wording: 'Running Speed > 6m/s [1] | [1] realized in special configurations, in practice there is a speed limit for security purposes' },
  { robot_id: 2238, field_name: 'obstacle_single', kasse: 'A', kilde: B2, reason: REASON_A,
    caveat: 'The page states both Obstacle crossing: Max 40cm and Climb up and down stairs of 40cm in forward direction.',
    caveat_wording: 'Obstacle crossing: Max 40cm | Climb up and down stairs of 40cm in forward direction' },
  { robot_id: 2238, field_name: 'stair_step_continuous', kasse: 'A', kilde: B2, reason: REASON_A,
    caveat: 'Range kept. 20~25 cm is not 22.5 cm.',
    caveat_wording: 'Stairs of 20~25cm' },
  { robot_id: 2238, field_name: 'battery_wh', kasse: 'A', kilde: B2, reason: REASON_A,
    caveat: "The manufacturer's own arithmetic does not check out: the same sentence states Battery capacity 45Ah(2250Wh), voltage 58V. 45 x 58 = 2610 Wh. The printed figure is 13.8% below the calculated one (16.0% with 2250 as the denominator). We do not correct it — 2250 Wh is the manufacturer's figure.",
    caveat_wording: 'Battery capacity 45Ah(2250Wh)，voltage 58V' },
  { robot_id: 2238, field_name: 'runtime', kasse: 'A', kilde: B2, reason: REASON_A,
    caveat: 'Three runtime figures on the same page: >5 h with no load (>20 km), >4 h at 20 kg (>15 km), and Battery life 4-6h with no load stated. The only one with a load condition is used here.',
    caveat_wording: 'Battery life 4-6h | continuous walking with 20kg load can last for greater than 4 hours with over 15km mileage. | unloaded continuous walking endurance greater than 5 hours with more than 20km mileage' },
  { robot_id: 2238, field_name: 'hot_swap', kasse: 'A', kilde: B2, reason: REASON_A,
    caveat: 'The manufacturer states battery supports quick change.',
    caveat_wording: 'B2 battery supports quick change and also supports autonomous charging solutions(optional)，suitable for a wide range of solutions.' },
  { robot_id: 2238, field_name: 'docking_station', kasse: 'A', kilde: B2, reason: REASON_A,
    caveat: 'Optional: supports autonomous charging solutions (optional).',
    caveat_wording: 'also supports autonomous charging solutions(optional)' },
  { robot_id: 2238, field_name: 'lidar', kasse: 'A', kilde: B2, reason: REASON_A,
    caveat: "The page states 3D LiDAR x1 — type without model. Under D4's provisional rule, type without model does not count as filled. If D4 flips, the field is filled.",
    caveat_wording: '3D LiDAR ×1' },
  { robot_id: 2238, field_name: 'cameras', kasse: 'A', kilde: B2, reason: REASON_A,
    caveat: 'The manufacturer adds: varies with different configurations.',
    caveat_wording: 'Depth camera ×2 + Optical camera ×2 (Varies with different configurations)' },
  { robot_id: 2238, field_name: 'power_output', kasse: 'A', kilde: B2, reason: REASON_A,
    caveat: "Voltage given, wattage not. The field is only half stated and cannot be compared with Spot's 35-58.8 V / 150 W per port.",
    caveat_wording: '12V×4 5V×1 24V×4 BAT×1' },
  { robot_id: 2238, field_name: 'price', kasse: 'A', kilde: B2_SHOP, reason: REASON_A,
    caveat: "shop.unitree.com shows price:10000000 (= $100,000 USD) — exactly the same amount as A2 — right next to the text Contact us for the real price, on B2's own listing. It is a placeholder and is not carried as a price.",
    caveat_wording: 'Unitree B2 $100,000.00 USD Ready to ship Contact us for the real price' },

  // -------------------------------------------------- 2239 unitree-b2-w
  { robot_id: 2239, field_name: 'weight', kasse: 'A', kilde: B2W, reason: REASON_A,
    caveat: 'Includes battery.',
    caveat_wording: '≈85kg Total weight (battery included)' },
  { robot_id: 2239, field_name: 'height', kasse: 'A', kilde: B2W, reason: REASON_A,
    caveat: 'Folded about 950 x 550 x 450 mm. The schema has no field for folded dimensions.',
    caveat_wording: '≈ 950mm×550mm×450mm' },
  { robot_id: 2239, field_name: 'payload_standing', kasse: 'A', kilde: B2W, reason: REASON_A,
    caveat: 'NO operator. B2 states >= 120 kg for the same figure. The difference is kept deliberately — normalizing it would either invent or remove a manufacturer distinction.',
    caveat_wording: 'Maximum Load(Standing) 120kg' },
  { robot_id: 2239, field_name: 'speed', kasse: 'A', kilde: B2W, reason: REASON_A,
    caveat: "The only Unitree model stated in km/h instead of m/s. The manufacturer's footnote [1] applies here too.",
    caveat_wording: 'Maximum Speed 15km/h [1] | [1]、[2]: realized in special configurations, in practice there is a speed limit for security purposes' },
  { robot_id: 2239, field_name: 'battery_wh', kasse: 'A', kilde: B2W, reason: REASON_A,
    caveat: 'The manufacturer states >2 kWh at 58 V — the operator sits on the capacity itself. Converted to Wh without altering the figure.',
    caveat_wording: '＞2kwh，voltage 58V' },
  { robot_id: 2239, field_name: 'runtime', kasse: 'B', kilde: B2W, reason: REASON_B,
    caveat: 'No hours figure on the page. Only distance: 25 km at 40 kg load, and about 30 km with no load. Negative check: hours/h does not occur anywhere in a numeric context. The word endurance here carries a distance, not a time.',
    caveat_wording: null },

  // -------------------------------------------------- 2240 unitree-go1
  { robot_id: 2240, field_name: 'height', kasse: 'B', kilde: GO1, reason: REASON_B,
    caveat: 'Standing dimensions are not stated. Only the folded measurement 0.588 x 0.22 x 0.29 m is printed, and the schema has no field for folded dimensions.',
    caveat_wording: null },
  { robot_id: 2240, field_name: 'degrees_of_freedom', kasse: 'A', kilde: GO1, reason: REASON_A,
    caveat: "The page states Silver alloy precision joint motor 12 piece, not Degrees of Freedom. Same borderline case as Go2.",
    caveat_wording: 'Silver alloy | precision joint motor | 12 piece' },
  { robot_id: 2240, field_name: 'payload_walking', kasse: 'A', kilde: GO1, reason: REASON_A,
    caveat: "The manufacturer states only Load, without distinguishing walking or standing. The placement is our inference. The value is Air/Pro.",
    caveat_wording: 'Load ≈4kg（limit ~ 10kg）' },
  { robot_id: 2240, field_name: 'speed', kasse: 'A', kilde: GO1, reason: REASON_A,
    caveat: 'The Air variant value.',
    caveat_wording: 'Motion Speed 0 ~ 2.5m/s' },
  { robot_id: 2240, field_name: 'battery_wh', kasse: 'B', kilde: GO1, reason: REASON_B,
    caveat: 'The page states only Battery: 1 piece — neither mAh, V, nor Wh.',
    caveat_wording: null },
  { robot_id: 2240, field_name: 'runtime', kasse: 'B', kilde: GO1, reason: REASON_B,
    caveat: 'No figure on the page. Long Endurance appears as a heading with no value.',
    caveat_wording: null },
  { robot_id: 2240, field_name: 'lidar', kasse: 'A', kilde: GO1, reason: REASON_A,
    caveat: 'Radar: 2D or 3D, optional — type without model.',
    caveat_wording: 'Radar ○ | 2D or 3D optional' },
  { robot_id: 2240, field_name: 'cameras', kasse: 'A', kilde: GO1, reason: REASON_A,
    caveat: 'The Air variant value.',
    caveat_wording: '1 set of fisheye binocular depth sensing angle | Super-sensing System 1 pair',
    value_text: '1 pair fisheye binocular depth camera' },
  { robot_id: 2240, field_name: 'compute', kasse: 'A', kilde: GO1, reason: REASON_A,
    caveat: 'The Air variant value.',
    caveat_wording: 'Sensing Calculation | 1*（4*1.43GHz | 128Core0.5T）',
    value_text: '1x (4 x 1.43 GHz, 128 cores, 0.5 T)' },
  { robot_id: 2240, field_name: 'sdk_languages', kasse: 'A', kilde: GO1, reason: REASON_A,
    caveat: 'Only Edu: Python Programming Interface. The value applies to Edu.',
    caveat_wording: 'Python Programming | Interface' },
  { robot_id: 2240, field_name: 'price', kasse: 'A', kilde: GO1, reason: REASON_A,
    caveat: "The Air variant value. Prices are on the manufacturer's own product page, not the shop page's placeholder.",
    caveat_wording: 'Price（Tax and freight excluded） $2700' },

  // -------------------------------------------------- 2241 unitree-go2
  { robot_id: 2241, field_name: 'weight', kasse: 'A', kilde: GO2, reason: REASON_A,
    caveat: 'Includes battery.',
    caveat_wording: 'Weight (with battery) About 15kg' },
  { robot_id: 2241, field_name: 'height', kasse: 'A', kilde: GO2, reason: REASON_A,
    caveat: 'Folded 76 x 31 x 20 cm. The schema has no field for folded dimensions.',
    caveat_wording: 'Dimension of crouching 76cm x 31cm x 20cm' },
  { robot_id: 2241, field_name: 'degrees_of_freedom', kasse: 'A', kilde: GO2, reason: REASON_A,
    caveat: "The page does not state Degrees of Freedom, but Aluminum knee joint motor 12 set. Counted because AlienGo's own page uses the heading Degrees of Freedom (number of motors) and so equates the two. Read more strictly, the field is not stated.",
    caveat_wording: 'Aluminum knee joint motor | 12 set' },
  { robot_id: 2241, field_name: 'payload_walking', kasse: 'A', kilde: GO2, reason: REASON_A,
    caveat: 'The manufacturer states only Payload, and does not say whether it is walking or standing load. Placing it under walking load is a conservative inference from the order of magnitude, NOT a direct reading. The value is the AIR variant.',
    caveat_wording: 'Payload ≈7kg' },
  { robot_id: 2241, field_name: 'speed', kasse: 'A', kilde: GO2, reason: REASON_A,
    caveat: 'The AIR variant value.',
    caveat_wording: 'Speed 0 ~ 2.5m/s' },
  { robot_id: 2241, field_name: 'slope', kasse: 'A', kilde: GO2, reason: REASON_A,
    caveat: 'The AIR variant value.',
    caveat_wording: 'Max Climb Angle 30°' },
  { robot_id: 2241, field_name: 'obstacle_single', kasse: 'A', kilde: GO2, reason: REASON_A,
    caveat: 'The manufacturer states ONE step field without saying whether it is a single obstacle or a continuous stair. The placement here is a choice. The value is the AIR variant.',
    caveat_wording: 'Max Climb Drop Height About 15cm' },
  { robot_id: 2241, field_name: 'ip_rating', kasse: 'B', kilde: GO2, reason: REASON_B,
    caveat: 'No IP class anywhere on the page. (The one occurrence of the word "Waterproof" on this page refers to a different product, B1-16, in the sidebar navigation — not to Go2 itself.) All four Unitree consumer models (Go2, Go2-W, Go1, A1) lack both an IP class and an operating temperature; the industrial models have both.',
    caveat_wording: null },
  { robot_id: 2241, field_name: 'battery_wh', kasse: 'A', kilde: GO2, reason: REASON_A,
    caveat: "8000 mAh, 28~33.6 V (EDU: 15000 mAh). Wh is not printed, and we do not calculate Wh from mAh and voltage — B2 is the proof that the manufacturer's own printed Wh figure is not always the product of the two.",
    caveat_wording: 'Voltage 28V~33.6V | standard | （8000mAh） | long endurance | （15000mAh）' },
  { robot_id: 2241, field_name: 'runtime', kasse: 'A', kilde: GO2, reason: REASON_A,
    caveat: "Given without a load condition. The figure therefore cannot sit in the same column as B2's and A2's runtimes. The value is AIR/PRO/X.",
    caveat_wording: 'Battery life About 1-2h' },
  { robot_id: 2241, field_name: 'docking_station', kasse: 'A', kilde: GO2, reason: REASON_A,
    caveat: 'The value is AIR/PRO.',
    caveat_wording: 'Charging Pile Compatibility ○' },
  { robot_id: 2241, field_name: 'lidar', kasse: 'A', kilde: GO2, reason: REASON_A,
    caveat: 'One of only two Unitree pages that names a LiDAR model. Go2-W appears, by all indications, to carry the same unit, but does not name it.',
    caveat_wording: 'Super Recognition System 4D LiDAR L2' },
  { robot_id: 2241, field_name: 'compute', kasse: 'RETTET', kilde: GO2, reason: REASON_RETTET,
    caveat: 'The value applies to PRO/X/EDU (all three name the same 8-core CPU; only AIR has none).',
    caveat_wording: 'Basic Computing Power ○ | 8-core High-performance CPU' },
  { robot_id: 2241, field_name: 'price', kasse: 'A', kilde: GO2, reason: REASON_A,
    caveat: "The manufacturer's own product page prints real prices — one of only two Unitree models that do. The manufacturer states Price (Tax and freight excluded): for a Danish buyer, the figure is not the final price. The value is the AIR variant.",
    caveat_wording: 'Price（Tax and freight excluded） $1600' },

  // ------------------------------------------------ 2242 unitree-go2-w
  { robot_id: 2242, field_name: 'degrees_of_freedom', kasse: 'A', kilde: GO2W, reason: REASON_A,
    caveat: 'The page states 16 joint motors, not Degrees of Freedom. Same borderline case as Go2.',
    caveat_wording: 'Aluminum knee joint motor | 16' },
  { robot_id: 2242, field_name: 'payload_walking', kasse: 'A', kilde: GO2W, reason: REASON_A,
    caveat: 'The manufacturer states only Payload (max about 12 kg), without distinguishing walking or standing. The placement is an inference, not a direct reading.',
    caveat_wording: 'Payload ≈8kg（MAX ~ 12kg）' },
  { robot_id: 2242, field_name: 'obstacle_single', kasse: 'A', kilde: GO2W, reason: REASON_A,
    caveat: 'The manufacturer states Max Climb Drop Height < 70cm (full-width character). The operator is an UPPER LIMIT, not a capability: < 70 does not mean over 70, or 70. Without the operator, Go2-W would look 75% better than B2\'s 40 cm.',
    caveat_wording: 'Max Climb Drop Height ＜ 70cm' },
  { robot_id: 2242, field_name: 'battery_wh', kasse: 'A', kilde: GO2W, reason: REASON_A,
    caveat: '15000 mAh, 33.6 V. Wh is not printed and is not derived.',
    caveat_wording: 'Voltage 33.6V | Long endurance（15000mAh）' },
  { robot_id: 2242, field_name: 'runtime', kasse: 'A', kilde: GO2W, reason: REASON_A,
    caveat: "Given without a load condition — not comparable with B2's and A2's runtimes.",
    caveat_wording: 'Endurance 1.5-3h' },
  { robot_id: 2242, field_name: 'lidar', kasse: 'A', kilde: GO2W, reason: REASON_A,
    caveat: "Super-wide-angle 3D LIDAR — type without model, even though Go2's own page names L2 for what appears, by all indications, to be the same unit.",
    caveat_wording: 'Super-wide-angle 3D LIDAR' },
];

const APPLICATIONS = [
  { robot_id: 2231,
    note: "The manufacturer's own product navigation, the group A1 belongs to. The English and Chinese navigation name the group differently: EN 'Consumer/Education', CN '消费级 / 科研' (consumer-grade / scientific research). Both are the manufacturer's own wording." },
  { robot_id: 2232,
    note: "The manufacturer's own product navigation, the group A2 belongs to." },
  { robot_id: 2233,
    note: "A2-W does not appear in the manufacturer's English product navigation menu, where A2 is listed under 'Robot - Industry' — though the Chinese-language navigation does list A2-W alongside A2 under the same '行业级' (industry-level) group. The category here is therefore the product page's own sentence, not the navigation's grouping. The same page also calls the robot an 'Industrial-grade mobile platform' — that is a build quality, not a use case, and is not counted." },
  { robot_id: 2234,
    note: "The manufacturer's own product navigation, the group AlienGo belongs to." },
  { robot_id: 2235,
    note: "The manufacturer's own product navigation, the group As2 belongs to. CONTRADICTION: As2 is listed under Consumer/Education in the navigation, but the As2 product page's own title is 'Unitree As2 Compact Size Industrial Capability'. The manufacturer says both." },
  { robot_id: 2236,
    note: "L22: the manufacturer's own word 'security', in the same sentence, is mapped here to security and surveillance. The quote is from As2-W's own product page; As2-W does not appear in the English product navigation menu (though the Chinese-language navigation does pair it with As2 under the same group), so nothing is inherited here." },
  { robot_id: 2237,
    note: "The manufacturer's own product navigation, the group B1 belongs to." },
  { robot_id: 2238,
    note: "The manufacturer's own product navigation, the group B2 belongs to." },
  { robot_id: 2239,
    note: "INHERITED (L23). B2-W does not appear in the English product navigation menu (though the Chinese-language navigation does pair it with B2 under the same group), and its own page https://www.unitree.com/b2-w, read 2026-08-19, does not state any application — only 'Go Further with Higher Efficiency' and 'Brand New Intelligent Species'. The quote is B2's; the link B2-W = B2 in wheeled form is our own inference, not the manufacturer's." },
  { robot_id: 2240,
    note: "The manufacturer's own product navigation, the group Go1 belongs to." },
  { robot_id: 2241,
    note: "The manufacturer's own product navigation, the group Go2 belongs to." },
  { robot_id: 2242,
    note: "INHERITED (L23). Go2-W does not appear in the English product navigation menu (though the Chinese-language navigation does pair it with Go2 under the same group), and its own page https://www.unitree.com/go2-w, read 2026-08-19, states only 'Driving All Terrain' and 'Go2 New Model Transformative Newborn'. The quote is Go2's; the link Go2-W = Go2 in wheeled form is our own inference, not the manufacturer's." },
  { robot_id: 2243,
    note: "THE MANUFACTURER HAS NO PAGE ABOUT THIS MODEL. Without a product page there is no positioning to quote, and Unitree's two navigation groups (Robot - Consumer/Education and Robot - Industry) do not mention Laikago. Same situation as Ghost Robotics Spirit 40." },
];

const IMAGES = [
  { robot_id: 2243,
    note: "Unitree's own Laikago page currently returns 404 (see the notes above). The image was retrieved 24 Aug 2026 via a Wayback Machine snapshot of the page from 21 June 2021 — the only available copy of the manufacturer's own material. billede_url in MANIFEST.tsv points to web.archive.org, not directly to unitree.com." },
];

// -------------------------------------------------------------- robots.notes
const ROBOTS_NOTES = {
  2232: ['The product page is a two-column variant table. All figures are the same between the two variants except IP class and LiDAR count; the differences are recorded on those individual fields.'],
  2233: ["Wheeled-leg version of A2. Everything that does not differ is word-for-word identical to A2's page."],
  2235: ['Four-column variant table. The columns are different machines — see the variant notes on the individual fields.'],
  2236: [
    'Wheeled-leg version of As2. The two variants differ only in charging dock and expansion dock.',
    "The page contradicts itself in four places about range and obstacle height. The parameter table is used as the value; the key-figures card's numbers are carried as a caveat.",
  ],
  2239: ['Wheeled-leg version of B2.'],
  2243: [
    "THE MODEL HAS BEEN REMOVED FROM THE MANUFACTURER'S SITE. Measured 2026-08-21: https://www.unitree.com/laikago returns HTTP 404 (saved, 4,605 bytes), and so do /LaikaGo and /cn/laikago. The manufacturer's homepage was fetched the same day and searched: 0 occurrences of the string 'laikago', and the navigation's product links (A1, A2, As2, aliengo, b1, b2, g1, go1, go2, h1, H2, R1, L2, z1, the Dex series and others) do not include the model. The DISCONTINUED status is a catalog decision based on these two measurements, not a statement from Unitree — they have not themselves said the model is discontinued.",
    "THE MANUFACTURER CONFIRMS THE MODEL EXISTED. Unitree's About page, 2017 timeline entry: 'In September 2017, the reconstructed quadruped robot Laikago came out (taken from the space dog Laika).' First-release year 2017 comes from this. A separate timeline — the product-history list on Unitree's own Go1 page, not the About page — mentions 'Laikago Pro' under its 2019 entry, in a combined delivery-figure statement with Aliengo ('the delivery amount of the quadruped robot (Laikago Pro + Aliengo) ... reached to 1 million sets'). So at least two variants exist, but neither has its own product page.",
    'ZERO FIELDS COLLECTED, AND THAT IS DELIBERATE. Specifications for Laikago exist in third-party databases and at resellers. They have not been used, because they cannot be dated against the manufacturer and would give the entry a false freshness. Same decision as for Spirit 40.',
  ],
};
// Kildereference pr. robot_id, til --verificer (samme raekkefoelge som notes).
const ROBOTS_NOTES_KILDER = {
  2232: [A2],
  2233: [A2W],
  2235: [AS2],
  2236: [AS2W, AS2W],
  2239: [B2W],
  2243: [LAIKAGO_404, ABOUT_EN, null], // 3. element: egen beslutning, intet enkeltcitat at slaa op
};

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
  for (const [robotId, notes] of Object.entries(ROBOTS_NOTES)) {
    const kilder = ROBOTS_NOTES_KILDER[robotId] || [];
    notes.forEach((_, i) => {
      const kilde = kilder[i];
      if (!kilde) return; // egen beslutning, intet enkeltcitat
      tjekket++;
      // Notes er engelsk PROSA, ikke et rent citat - vi tjekker kun at
      // kildefilen findes og er laesbar (selve paastandene er efterproevet
      // manuelt, se FUND-f2unitree.md).
      if (laesKilde(kilde) === null) {
        fejl++;
        console.error(`FEJL robots.notes ${robotId}[${i}]: kildefil mangler: ${kilde}`);
      }
    });
  }
  console.log(`Kildeverifikation: ${tjekket} caveat_wording-fragmenter+notes-kildetjek, ${fejl} fejl.`);
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

  async function patchEen(url, body, label) {
    planlagte++;
    console.log(label);
    if (!skriv) return true;
    const svar = await fetch(url, { method: 'PATCH', headers: H, body: JSON.stringify(body) });
    const json = await svar.json();
    if (!svar.ok || !Array.isArray(json) || json.length !== 1) {
      console.error(`  AFBRUDT: ${label} — status ${svar.status}, ${json?.length ?? '?'} rækker`, json);
      process.exitCode = 1;
      return false;
    }
    udfoerte++;
    console.log('  OK, 1 række opdateret.');
    return true;
  }

  for (const r of FIELD_ENTRIES) {
    const body = {
      caveat: r.caveat,
      caveat_wording: r.caveat_wording,
      collected_by: 'spor/f2-unitree',
      change_reason: r.reason,
    };
    if ('value_text' in r) body.value_text = r.value_text;
    const url = `${U}/rest/v1/field_entries?robot_id=eq.${r.robot_id}&field_name=eq.${r.field_name}`;
    const ok2 = await patchEen(url, body, `field_entries ${r.robot_id}/${r.field_name} [kasse ${r.kasse}]${'value_text' in r ? ' +value_text' : ''}`);
    if (!ok2) return;
  }

  for (const a of APPLICATIONS) {
    const body = {
      note: a.note,
      collected_by: 'spor/f2-unitree',
      change_reason: 'fase 2: applications.note oversat til engelsk',
    };
    const url = `${U}/rest/v1/applications?robot_id=eq.${a.robot_id}`;
    const ok2 = await patchEen(url, body, `applications ${a.robot_id}.note`);
    if (!ok2) return;
  }

  for (const im of IMAGES) {
    const body = {
      note: im.note,
      collected_by: 'spor/f2-unitree',
      change_reason: 'fase 2: images.note oversat til engelsk',
    };
    const url = `${U}/rest/v1/images?robot_id=eq.${im.robot_id}`;
    const ok2 = await patchEen(url, body, `images ${im.robot_id}.note`);
    if (!ok2) return;
  }

  for (const [robotId, notes] of Object.entries(ROBOTS_NOTES)) {
    const body = {
      notes,
      collected_by: 'spor/f2-unitree',
      change_reason: 'fase 2: robots.notes oversat til engelsk',
    };
    const url = `${U}/rest/v1/robots?id=eq.${robotId}`;
    const ok2 = await patchEen(url, body, `robots ${robotId}.notes (${notes.length} elementer)`);
    if (!ok2) return;
  }

  console.log(`\n${skriv ? 'Skrevet' : 'Ville skrive'}: ${planlagte} opdateringer${skriv ? ` (${udfoerte} bekræftet)` : ''}.`);
  if (!skriv) {
    console.log('Dette var et TØRLØB. Kør med --skriv for at skrive rent faktisk.');
  }
}

export { FIELD_ENTRIES, APPLICATIONS, IMAGES, ROBOTS_NOTES };

const koertDirekte = process.argv[1] && import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`;
if (koertDirekte) {
  main().catch((err) => {
    console.error('f2-unitree-skriv: fejl —', err.message, err.stack);
    process.exitCode = 1;
    return;
  });
}
