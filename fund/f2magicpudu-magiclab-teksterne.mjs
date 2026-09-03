#!/usr/bin/env node
/**
 * fund/f2magicpudu-magiclab-teksterne.mjs — bygger opdaterings-JSON'en til
 * db/f2-skriv.mjs for MagicLab (spor/f2-magicpudu). Alle danske celler
 * oversat til engelsk, verificeret mod media/_kilder/raa-kina-deep-magic-
 * 2026-08-19/ (se rapportens efterprøvningsafsnit for citaterne der blev
 * kontrolleret). Ingen tal, ingen caveat_class rørt.
 */
import fs from 'node:fs';

const AARSAG = 'fase 2 (spor/f2-magicpudu): dansk prosa oversat til engelsk; ' +
  'påstande efterprøvet mod media/_kilder/raa-kina-deep-magic-2026-08-19/.';

const SUZHOU_NOTE = 'HOME CITY IS SUZHOU, NOT WUJIANG: the manufacturer’s global site states directly ' +
  '"Founded in 2024 and headquartered in Suzhou" and repeats "Founded in Suzhou, China". The string ' +
  '"Wujiang", which the record previously carried alongside Suzhou, appears 0 times across the company’s ' +
  'archived pages.';

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

/* ---------------------------------------------------------- 2219 magicdog-edu */
robotNotes(2219, [
  SUZHOU_NOTE,
  'TWO MANUFACTURER SITES THAT CONTRADICT EACH OTHER. magiclab.top and the new magiclabglobal.com are ' +
  'both live, both the manufacturer’s own, and they disagree on weight, obstacle height, degrees of ' +
  'freedom, runtime and speed. The source used here is magiclab.top; the global site’s diverging figures ' +
  'are recorded in the caveats. Which site counts as the primary source is not the collector’s call.',
  'EDU and PRO share 41 of 43 table rows. The only specification difference is SDK access: EDU has SDK ' +
  'access, PRO does not. Measured cell by cell: 43 data lines, 41 identical, 2 different (the name row ' +
  'and the SDK row).',
]);
appNote(2219, { note: 'The same paragraph ends: "PRO and EDU configurations are available".' });
feltCaveat(2219, 'weight', 'EXCLUDING BATTERY (Net Weight, Excluding Battery) — unique in this collection; ' +
  'every other model, including MagicLab’s own MagicDog-W and Y1, states weight including battery. ' +
  'Without that marking, payload divided by net weight is systematically wrong, and wrong in the ' +
  'flattering direction. The global site states 17 kg including battery for the same robot; the two ' +
  'figures are consistent if the battery weighs about 1.2 kg, but that is an inference and is not entered ' +
  'as data.');
feltCaveat(2219, 'height', 'Lying down 720 x 440 x 290 mm. The table has no fields for folded dimensions.');
feltCaveat(2219, 'degrees_of_freedom', 'The manufacturer states Degrees of Freedom (DOF) 13 and, separately, ' +
  'Aluminum Alloy Precision Joint Motor 12. The global site states the same figure as 12 + 1 (head DOF) ' +
  '— i.e. 12 in the legs plus the head.');
feltCaveat(2219, 'payload_walking', 'The manufacturer states approx. 5 kg (max. approx. 10 kg) using the ' +
  'character U+2248 and full-width parentheses. No distinction is made between walking and standing load.');
feltCaveat(2219, 'speed', 'Label Maximum Speed. The global site states the same figure as Movement Speed ' +
  '0-3.0m/s, i.e. a range rather than a maximum.');
feltCaveat(2219, 'obstacle_single', 'Label Maximum Obstacle Height. The global site states Max Obstacle Step ' +
  'Height Approx. 18cm (lab data) for the same robot — 20% higher, and with a lab-condition marking the ' +
  'older site does not carry.');
feltCaveat(2219, 'battery_wh', 'The manufacturer prints 29.6V 8200mAh 240.7W Fast Release. W is POWER, not ' +
  'energy. The error appears in both languages — it is not a translation slip but the manufacturer’s ' +
  'own. Even read charitably as 240.7 Wh it does not add up: 29.6 V x 8.2 Ah = 242.7 Wh. We do not ' +
  'correct it, and we do not calculate Wh from mAh and voltage.');
feltCaveat(2219, 'runtime', 'The global site instead states Approx. 2.5 hours of continuous movement.');
feltCaveat(2219, 'docking_station', 'Battery Charging Dock marked with a filled circle. The table uses ' +
  'filled circle = yes and open circle = no, with NO third state for not stated. A scraper that only ' +
  'looks for the filled circle records a ‘no’ as a missing value.');
feltCaveat(2219, 'lidar', '2D LiDAR — type without model, does not count under D4.');
feltCaveat(2219, 'ros2', 'The manufacturer’s own developer documentation for MagicDog HAS ROS2 (ROS2 API, ' +
  'ROS2 SDK guide, ros2_reference), and EDU is the variant with SDK access. The field is nonetheless left ' +
  'blank because D1 — whether the manufacturer’s developer documentation counts as a source — is ' +
  'open. If D1 is resolved, the field is filled in. The documentation is also Chinese-only, so a reader ' +
  'cannot read the source.');
feltCaveat(2219, 'sdk_languages', 'SDK Support is marked with a filled circle = YES on EDU and an open ' +
  'circle = no on PRO. That is the only specification difference between the two models, and the sign is ' +
  'counterintuitive: it is EDU that has the SDK. The field asks about the LANGUAGES, which the product ' +
  'page does not mention — hence not stated here, against PRO’s documented no. The developer ' +
  'documentation (D1 open) states C++ and Python.');
feltCaveat(2219, 'autonomy_level', 'All three marked yes. Qualitative, not a level on a scale.');

/* ---------------------------------------------------------- 2220 magicdog-pro */
robotNotes(2220, [
  SUZHOU_NOTE,
  'TWO MANUFACTURER SITES THAT CONTRADICT EACH OTHER. magiclab.top and the new magiclabglobal.com are ' +
  'both live, both the manufacturer’s own, and they disagree on weight, obstacle height, degrees of ' +
  'freedom, runtime and speed. The source used here is magiclab.top; the global site’s diverging figures ' +
  'are recorded in the caveats. Which site counts as the primary source is not the collector’s call.',
  'PRO and EDU share 41 of 43 table rows. The only specification difference is SDK access — and the sign ' +
  'is counterintuitive: EDU has the SDK, PRO does not.',
]);
appNote(2220, { note: 'The same paragraph ends: "PRO and EDU configurations are available", so the sentence ' +
  'covers both variants. magiclabglobal.com is the manufacturer’s new global site.' });
feltCaveat(2220, 'weight', 'EXCLUDING BATTERY (Net Weight, Excluding Battery) — unique in this collection; ' +
  'every other model, including MagicLab’s own MagicDog-W and Y1, states weight including battery. ' +
  'Without that marking, payload divided by net weight is systematically wrong, and wrong in the ' +
  'flattering direction. The global site states 17 kg including battery for the same robot; the two ' +
  'figures are consistent if the battery weighs about 1.2 kg, but that is an inference and is not entered ' +
  'as data.');
feltCaveat(2220, 'height', 'Lying down 720 x 440 x 290 mm. The table has no fields for folded dimensions.');
feltCaveat(2220, 'degrees_of_freedom', 'The manufacturer states Degrees of Freedom (DOF) 13 and, separately, ' +
  'Aluminum Alloy Precision Joint Motor 12. The global site states the same figure as 12 + 1 (head DOF) ' +
  '— i.e. 12 in the legs plus the head.');
feltCaveat(2220, 'payload_walking', 'The manufacturer states approx. 5 kg (max. approx. 10 kg) using the ' +
  'character U+2248 and full-width parentheses. No distinction is made between walking and standing load.');
feltCaveat(2220, 'speed', 'Label Maximum Speed. The global site states the same figure as Movement Speed ' +
  '0-3.0m/s, i.e. a range rather than a maximum.');
feltCaveat(2220, 'obstacle_single', 'Label Maximum Obstacle Height. The global site states Max Obstacle Step ' +
  'Height Approx. 18cm (lab data) for the same robot — 20% higher, and with a lab-condition marking the ' +
  'older site does not carry.');
feltCaveat(2220, 'battery_wh', 'The manufacturer prints 29.6V 8200mAh 240.7W Fast Release. W is POWER, not ' +
  'energy. The error appears in both languages — it is not a translation slip but the manufacturer’s ' +
  'own. Even read charitably as 240.7 Wh it does not add up: 29.6 V x 8.2 Ah = 242.7 Wh. We do not ' +
  'correct it, and we do not calculate Wh from mAh and voltage.');
feltCaveat(2220, 'runtime', 'The global site instead states Approx. 2.5 hours of continuous movement.');
feltCaveat(2220, 'docking_station', 'Battery Charging Dock marked with a filled circle. The table uses ' +
  'filled circle = yes and open circle = no, with NO third state for not stated. A scraper that only ' +
  'looks for the filled circle records a ‘no’ as a missing value.');
feltCaveat(2220, 'lidar', '2D LiDAR — type without model, does not count under D4.');
feltCaveat(2220, 'ros2', 'The manufacturer’s own developer documentation for MagicDog HAS ROS2 (ROS2 API, ' +
  'ROS2 SDK guide, ros2_reference). But this variant has SDK access marked as NO on the product page, and ' +
  'D1 — whether the manufacturer’s developer documentation counts as a source — is open. The field ' +
  'is therefore left blank. The documentation is also Chinese-only.');
feltCaveat(2220, 'sdk_languages', 'SDK Support is marked with an open circle = NO on PRO. The EDU variant ' +
  'has a filled circle = yes. That is the only specification difference between the two models, and the ' +
  'sign is counterintuitive.');
feltCaveat(2220, 'autonomy_level', 'All three marked yes. Qualitative, not a level on a scale.');

/* ---------------------------------------------------------- 2221 magicdog-w */
robotNotes(2221, [
  SUZHOU_NOTE,
  'TWO MANUFACTURER SITES THAT CONTRADICT EACH OTHER — and here the operators flip. magiclab.top states ' +
  'speed 0-3 m/s and slope <= 40 degrees; magiclabglobal.com states >= 3.0 m/s and >= 40 degrees for the ' +
  'same robot, the same language, the same day. One is a ceiling, the other a floor. The source used here ' +
  'is magiclab.top; the global site’s figures are recorded in the caveats.',
]);
appNote(2221, { note: 'The manufacturer’s Chinese and English product pages on magiclab.top call it only ' +
  '"MagicLab Quadruped Wheeled Robot" — a form, not an application.' });
feltCaveat(2221, 'weight', 'WITH battery (with battery) — unlike MagicDog, which the same manufacturer ' +
  'states without battery.');
feltCaveat(2221, 'height', 'Prone 720 x 500 x 290 mm. The table has no fields for folded dimensions.');
feltCaveat(2221, 'degrees_of_freedom', 'The manufacturer states 16+1 (Head Motor) — i.e. MOTOR COUNT, not ' +
  'the words degrees of freedom. 17 is the sum of the manufacturer’s own expression. Head rotation is ' +
  'stated as >= 100 degrees (EN uses the character U+2265, CN uses ASCII >=).');
feltCaveat(2221, 'payload_walking', 'The manufacturer states Maximum 10 kg without distinguishing ' +
  'walking/standing. The placement is an inference.');
feltCaveat(2221, 'speed', 'magiclabglobal.com instead states >= 3.0m/s for the same robot. 0-3 m/s (up to ' +
  '3) and >= 3 m/s (at least 3) are not a rounding of each other — they are opposite claims.');
feltCaveat(2221, 'slope', 'magiclabglobal.com states >= 40 degrees for the same robot, the same language, ' +
  'the same day. One is a ceiling, the other a floor. Both are the manufacturer’s own.');
feltCaveat(2221, 'obstacle_single', 'THREE LABELS, THREE MEANINGS, ONE FIGURE — and that is why the field ' +
  'is left blank. EN: Minimum obstacle clearance height < 60 cm. CN: minimum obstacle-AVOIDANCE distance ' +
  'height < 60 cm — i.e. sensing, not crossing. magiclabglobal.com: Climbs and Drops: Up to 60cm. Had the ' +
  'English label been taken at face value, 60 cm would have landed here, and MagicDog-W would beat the ' +
  'Lynx S10 on a discipline it is not documented for. Note also that the operator < makes the English ' +
  'label self-contradictory: a MINIMUM that is LESS THAN something.');
feltCaveat(2221, 'stair_step_continuous', 'See obstacle_single — the 60 cm cannot be placed in either of ' +
  'the two step fields.');
feltCaveat(2221, 'battery_wh', 'Only Capacity: 8200 mAh, Rated Voltage: 29.6 V. No Wh. We do not calculate ' +
  'it. Same battery as MagicDog, where the manufacturer prints an incorrect Wh-like value — these are the ' +
  'two ways of losing the field.');
feltCaveat(2221, 'runtime', 'Standby is stated as up to 8 hours (measured).');
feltCaveat(2221, 'lidar', 'Type without model — does not count under D4.');
feltCaveat(2221, 'compute', 'THE FIGURE 157 TOPS APPEARS ONLY IN CHINESE. The English page merely states ' +
  'Standard High-Performance Computing Accelerator Module without a figure. Same module as in Y1. The CN ' +
  'page requires the cookie i18n_redirected=zh — the URL alone does not reproduce the fetch.');
feltCaveat(2221, 'ros2', 'The manufacturer’s own developer documentation for MagicDog-W HAS ROS2 with the ' +
  'same structure as MagicDog’s. The field is not filled in because D1 is open. The documentation is ' +
  'Chinese-only.');

/* ---------------------------------------------------------- 2222 magicdog-y1 */
robotNotes(2222, [
  SUZHOU_NOTE,
  'ONLY MagicLab MODEL WHERE ALL THREE MANUFACTURER SOURCES (magiclab.top EN, magiclab.top CN and ' +
  'magiclabglobal.com) ARE MUTUALLY CONSISTENT. EN and CN agree on every single figure.',
  'DOCUMENTED OVERLAP WITH UNITREE B2, WITHOUT EXPLANATION. The sensor string is the same construction ' +
  'with the same count and the same caveat; the battery is stated in the same form with the same 45 Ah; ' +
  'the runtime interval 4-6 h is identical; and the load condition >4 h at 20 kg is identical down to the ' +
  'operator. But Y1’s speed is LOWER (6 m/s vs. B2’s > 6 m/s), the dimensions are mixed, and on the only ' +
  'comparable step field B2 states a figure and Y1 states none. We make no claim about the cause.',
]);
appNote(2222, {
  note: 'The two manufacturer domains say the same thing: magiclab.top states "MagicLab Industrial ' +
    'Quadruped Robot" (CN:).',
  note_wording: 'The two manufacturer domains say the same thing: magiclab.top states "MagicLab Industrial ' +
    'Quadruped Robot" (CN: "魔法原子工业四足机器人").',
});
feltCaveat(2222, 'weight', 'Including battery.');
feltCaveat(2222, 'payload_walking', 'The manufacturer’s label: Dynamic Payload (CN: movement load).');
feltCaveat(2222, 'payload_standing', 'The manufacturer’s label: Maximum Payload (CN: max. load). The page ' +
  'does not explicitly say standing; the placement follows the same interpretation as Unitree’s two load ' +
  'fields.');
feltCaveat(2222, 'speed', 'Without an operator. Unitree B2 states > 6 m/s for the same figure — Y1 is ' +
  'therefore NOT above B2 on this field.');
feltCaveat(2222, 'obstacle_single', 'The manufacturer’s label is Maximum Climbing Height (CN: max. ' +
  'climbing height). NEITHER EN NOR CN says whether it is a single step or a continuous staircase — here ' +
  'the Chinese page does not help, unlike Lite3. The placement in obstacle_single is an interpretation, ' +
  'chosen so the figure CANNOT contaminate the comparison that needs the continuous field.');
feltCaveat(2222, 'temperature_min', 'Stated in body text, not in the table.');
feltCaveat(2222, 'temperature_max', 'Stated in body text, not in the table.');
feltCaveat(2222, 'battery_wh', 'The manufacturer prints 45Ah (2400Wh), Voltage 54V. 45 x 54 = 2430 Wh, not ' +
  '2400 — a discrepancy of 30 Wh (1.2%). We reproduce the printed figure and note the discrepancy. Note: ' +
  'neither Y1’s nor Unitree B2’s Wh figure matches their own Ah x V.');
feltCaveat(2222, 'runtime', 'The manufacturer states 4-6h ( >4 h continuous walking with 20 kg load ). The ' +
  'figure is used here with the load condition. Worded identically to Unitree B2’s phrasing, down to the ' +
  'operator.');
feltCaveat(2222, 'lidar', '3D LiDAR x1 — type without model, does not count under D4.');
feltCaveat(2222, 'cameras', 'The manufacturer adds configurations may vary. The whole string (3D LiDAR x1 + ' +
  'Depth Cameras x2 + Optical Cameras x2 + caveat) is the same construction as Unitree B2’s.');
feltCaveat(2222, 'ros2', 'NEGATIVE RESULT, measured, not sensed: the Y1 guide’s navigation has 25 routes ' +
  '(C++ API 7 services, Python API 7 services, 5 examples, SLAM navigation, FAQ, etc.) and NONE of them is ' +
  'ROS2 — unlike MagicDog and MagicDog-W, which both have it. The status code is not proof: ' +
  '/docs/y1/ros2_sdk returns 200, but so does any path under /docs/<product>. The field is set to not ' +
  'stated rather than no, because the absence is our own count, not the manufacturer’s statement.');
feltCaveat(2222, 'sdk_languages', 'The developer documentation states C++ and Python. Not filled in, ' +
  'because D1 is open. The documentation is Chinese-only.');
feltCaveat(2222, 'power_output', 'Voltage stated, wattage not.');

fs.writeFileSync(new URL('./f2magicpudu-magiclab-skriv.json', import.meta.url), JSON.stringify(posts, null, 2));
console.log(`${posts.length} poster skrevet til fund/f2magicpudu-magiclab-skriv.json`);
