#!/usr/bin/env node
/**
 * fund/f2magicpudu-pudu-teksterne.mjs — bygger opdaterings-JSON'en til
 * db/f2-skriv.mjs for Pudu Robotics (spor/f2-magicpudu). Alle danske celler
 * oversat til engelsk, verificeret mod media/_kilder/raa-kand1a-2026-08-24/
 * (pudu-d5-storeside/officielside/prnewswire). Ingen tal, ingen caveat_class
 * rørt. value_text (lidar/cameras/autonomy_level) er UDEN FOR hvidlisten og
 * røres ikke, selvom den stadig er dansk — det er en anden arbejdsbunke
 * (OPSKRIFT-fase2.md §6.4).
 */
import fs from 'node:fs';

const AARSAG = 'fase 2 (spor/f2-magicpudu): dansk prosa oversat til engelsk; ' +
  'påstande efterprøvet mod media/_kilder/raa-kand1a-2026-08-24/.';

const posts = [];
function feltCaveat(robot_id, field_name, caveat) {
  posts.push({ tabel: 'field_entries', noegle: { robot_id, field_name }, saet: { caveat }, change_reason: AARSAG });
}
function robotNotes(id, notes) {
  posts.push({ tabel: 'robots', noegle: { id }, saet: { notes }, change_reason: AARSAG });
}
function appNote(robot_id, saet) {
  posts.push({ tabel: 'applications', noegle: { robot_id }, saet, change_reason: AARSAG });
}

/* ---------------------------------------------------------- 2226 pudu-d5 */
robotNotes(2226, [
  'IMPORTANT DISCREPANCY FOUND BY FIELD-BY-FIELD VERIFICATION: the general marketing copy (identical ' +
  'wording on the official page and the webstore) states "Easily handles 25 cm steps, 30° climbs, and 45° ' +
  'descents" — but the variant-specific comparison table on the webstore states something different for ' +
  'D5 alone: "D5: 25° ascent, 45° descent" and "Maximum Step Height D5: 30 cm". The marketing copy’s ' +
  '30°/25cm are actually D5-W’s table values (30° ascent, 25 cm step), not D5’s. The slope and ' +
  'stair_step_continuous fields below use the table, NOT the marketing copy — see the caveat on each field.',
  'Footnote 5 on the official product page: "PUDU D5 Series is shipped with dual high-precision 96-line ' +
  'LiDAR as the standard configuration. For specialized applications requiring enhanced perception, a ' +
  'dual 192-line LiDAR upgrade is available upon request." The highlighted marketing copy ("Dual ' +
  '192-line* spherical LiDARs") therefore describes a paid upgrade, not the standard configuration.',
]);
appNote(2226, { note: 'The same sentence appears verbatim on both the official product page and the ' +
  'webstore (store.pudurobotics.com/products/pudu-d5).' });
feltCaveat(2226, 'weight', 'The manufacturer’s label is "Weight (with Battery)" — including battery.');
feltCaveat(2226, 'length', 'UNCERTAIN ASSIGNMENT. The manufacturer prints "Standing Dimensions: 900 x 543 x ' +
  '572 mm (35.4 x 21.4 x 22.5 in)" without labelling the axes individually. The first figure is assumed ' +
  'here to be length, following the pattern from Deep Robotics X30. Not confirmed from the source.');
feltCaveat(2226, 'width', 'UNCERTAIN ASSIGNMENT — see length. Second figure in the unlabelled triple ' +
  'assumed to be width.');
feltCaveat(2226, 'height', 'UNCERTAIN ASSIGNMENT — see length. Third figure in the unlabelled triple ' +
  'assumed to be height.');
feltCaveat(2226, 'payload_walking', 'The manufacturer’s label is "Continuous Walking Payload: 20-30 kg ' +
  '(44-66 lbs)" — range preserved. PR Newswire’s headline "30kg Payload" uses only the upper end of the ' +
  'range.');
feltCaveat(2226, 'speed', 'From general marketing copy "Cruises at up to 5 m/s", applying to the D5 series ' +
  'broadly. The comparison table has no separate speed row per variant.');
feltCaveat(2226, 'slope', 'From the variant-specific comparison table: "D5: 25 ascent, 45 descent". Only ' +
  'ascent is used here; descent is 45 degrees for both variants, and the schema has no separate descent ' +
  'field. See the top note about the discrepancy with the general marketing copy (30 degrees), which is ' +
  'D5-W’s figure.');
feltCaveat(2226, 'obstacle_single', 'The manufacturer’s label is "Climbing Capability: Up to 80 cm", ' +
  'identical for D5 and D5-W. Assigned to obstacle_single (rule 7) because the manufacturer itself ' +
  'distinguishes this from the lower "Maximum Step Height" field (see stair_step_continuous) — but ' +
  'neither label itself uses the words "single" or "continuous", so the assignment is our interpretation.');
feltCaveat(2226, 'stair_step_continuous', 'The manufacturer’s label is "Maximum Step Height: D5: 30 cm ' +
  '(11.8 in)", lower than "Climbing Capability" (80 cm, see obstacle_single). The general marketing copy ' +
  'instead states 25 cm — that is D5-W’s table value, not D5’s. See the top note.');
feltCaveat(2226, 'temperature_max', 'Separate manufacturer field "Cold-Start Capability: Below -10°C" — a ' +
  'stricter limit for startup than for operation. The schema has no cold-start field; noted here because ' +
  '-10°C could otherwise be confused with temperature_min (-20°C).');
feltCaveat(2226, 'runtime', 'The press release states "stable 30-kilogram payloads with over two hours of ' +
  'continuous runtime at full load" — the only figure with an explicit load condition (rule 8), therefore ' +
  'used in preference to the webstore’s table value "Operating Time: 2 - 2.5 hours" (no load condition, ' +
  'same source as the fields above).');
feltCaveat(2226, 'docking_station', '"Charging Station" listed as an accessory under "Modular Expansion". ' +
  'Footnote 3: "Accessories such as the inspection kit and charging dock are optional and sold ' +
  'separately." — sold separately, not included in the base price.');
feltCaveat(2226, 'lidar', 'Footnote 5: "PUDU D5 Series is shipped with dual high-precision 96-line LiDAR ' +
  'as the standard configuration. For specialized applications requiring enhanced perception, a dual ' +
  '192-line LiDAR upgrade is available upon request." The highlighted marketing copy mentions only the ' +
  '192-line figure and omits this caveat.');
feltCaveat(2226, 'cameras', 'The PR text: "Four 120° fisheye cameras". The webstore’s comparison table ' +
  'states more briefly "Dual 3D LiDAR + Four Fisheye Cameras" for the same field, without an angle figure.');
feltCaveat(2226, 'autonomy_level', 'Qualitative, translated from: "the D5 handles complete autonomous ' +
  'workflows including departure, patrol, obstacle handling, and return-to-charge", in the context of ' +
  '"supporting continuous, unsupervised operation even in dynamic environments". No numeric autonomy ' +
  'level (e.g. an SAE-like scale) stated.');
feltCaveat(2226, 'price', 'From the webstore’s Shopify product data (variant "D5": price 8000000, i.e. USD ' +
  '80,000 in cent units). D5-W costs USD 85,000 according to the same source (variant "D5-W": price ' +
  '8500000).');

/* ---------------------------------------------------------- 2227 pudu-d5-w */
appNote(2227, { note: 'Same product page and same sentence as pudu-d5.yaml — D5 and D5-W are two variant ' +
  'choices on ONE Shopify product page (handle "pudu-d5"), not two separate pages. See notes below.' });
feltCaveat(2227, 'weight', 'The manufacturer’s label is "Weight (with Battery)" — including battery. 1 kg ' +
  'heavier than D5 (61 kg).');
feltCaveat(2227, 'length', 'UNCERTAIN ASSIGNMENT, same caveat as D5. The manufacturer prints the same ' +
  'triple "900 x 543 x 572 mm" for D5-W as for D5 — standing dimensions are identical across the two ' +
  'variants according to the table.');
feltCaveat(2227, 'width', 'UNCERTAIN ASSIGNMENT — see length.');
feltCaveat(2227, 'height', 'UNCERTAIN ASSIGNMENT — see length.');
feltCaveat(2227, 'payload_walking', 'The manufacturer’s label "Continuous Walking Payload: 20-30 kg" — ' +
  'identical figure for D5 and D5-W in the table.');
feltCaveat(2227, 'speed', 'From general marketing copy "Cruises at up to 5 m/s" for the D5 series broadly. ' +
  'The press release ties the same figure specifically to "wheel-leg hybrid locomotion" (D5-W). The ' +
  'comparison table has no separate speed row per variant.');
feltCaveat(2227, 'slope', 'From the variant-specific comparison table: "D5-W: 30 ascent, 45 descent". Only ' +
  'ascent is used here; descent is 45 degrees, no field for it in the schema. This figure agrees (unlike ' +
  'D5’s) with the general marketing copy’s "30° climbs".');
feltCaveat(2227, 'obstacle_single', 'The manufacturer’s label "Climbing Capability: Up to 80 cm", identical ' +
  'for D5 and D5-W. Same assignment caveat between this field and the continuous staircase field as for D5.');
feltCaveat(2227, 'stair_step_continuous', 'The manufacturer’s label "Maximum Step Height: D5-W: 25 cm (9.84 ' +
  'in)" — LOWER than D5’s 30 cm, even though D5-W has wheels. This figure agrees with the general ' +
  'marketing copy’s "25 cm steps".');
feltCaveat(2227, 'temperature_max', 'Separate manufacturer field "Cold-Start Capability: Below -10°C" — ' +
  'same caveat as for D5.');
feltCaveat(2227, 'runtime', 'The webstore’s table: "Operating Time D5-W: 2 - 3 hours", NO load condition ' +
  '(rule 8). The press release’s load-conditioned "over two hours at full load (30 kg)" is not explicitly ' +
  'tied to D5-W alone and is therefore used only for D5, not here.');
feltCaveat(2227, 'docking_station', '"Charging Station" listed as an accessory, same page as D5. Footnote ' +
  '3: sold separately, not included in the base price.');
feltCaveat(2227, 'lidar', 'Footnote 5, same as for D5 — applies to the D5 series, no separate statement for ' +
  'D5-W.');
feltCaveat(2227, 'autonomy_level', 'Qualitative, applies to the D5 series broadly, not D5-W-specific — same ' +
  'source as for D5.');
feltCaveat(2227, 'price', 'From the webstore’s Shopify product data (variant "D5-W": price 8500000, i.e. ' +
  'USD 85,000 in cent units). USD 5,000 more expensive than D5.');

fs.writeFileSync(new URL('./f2magicpudu-pudu-skriv.json', import.meta.url), JSON.stringify(posts, null, 2));
console.log(`${posts.length} poster skrevet til fund/f2magicpudu-pudu-skriv.json`);
