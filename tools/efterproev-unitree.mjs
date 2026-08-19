// Efterproevning: hvert paastaaet tal soeges tilbage i den GEMTE raa HTML-fil.
// Stripperen er en ren funktion af raafilen, saa et hit er bevis for, at
// straengen staar i den fil, vi gemte 2026-08-19.
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const DIR = 'C:/Praktik/websites/udstilling/media/_kilder/raa-kina-unitree-2026-08-19';
const STRIP = 'C:/Praktik/websites/udstilling-wt-kina-unitree/tools/strip-html.mjs';

function text(file) {
  return execFileSync(process.execPath, [STRIP, `${DIR}/${file}`], {
    encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
  }).replace(/\s+/g, ' ');
}

// [model, raafil, [[felt, forventet delstreng], ...]]
const CASES = [
['B2', 'unitree-b2-produktside-2026-08-19.html', [
  ['egenvaegt', '≈ 60kg Total weight (battery included)'],
  ['maal staaende', '≈ 1098mm×450mm×645mm'],
  ['maal foldet', '≈ 880mm×460mm×330mm'],
  ['nyttelast staaende', '≥ 120kg'],
  ['nyttelast gaaende', '> 40kg'],
  ['maks hastighed', '> 6m/s'],
  ['maks haeldning', '> 45°'],
  ['forhindring enkelt', 'stairs of 40cm in forward direction'],
  ['trappetrin kontinuerlig', 'Stairs of 20~25cm'],
  ['IP-klasse', 'IP67'],
  ['driftstemperatur', '-20℃ ~ 55℃'],
  ['batteri Wh', 'Battery capacity 45Ah(2250Wh)，voltage 58V'],
  ['driftstid uden last', 'Walking without load > 5h, and the mileage > 20km'],
  ['driftstid 20kg', 'Walking with 20kg load > 4h'],
  ['driftstid 3. tal', 'Battery life 4-6h'],
  ['hot-swap', 'battery supports quick change'],
  ['dockingstation', 'supports autonomous charging solutions(optional)'],
  ['LiDAR type', '3D LiDAR ×1'],
  ['kameraer', 'Depth camera ×2 + Optical camera ×2'],
  ['onboard compute', 'Intel Core i5 (Platform Function), Intel Core i7'],
  ['stroem ud', '12V×4 5V×1 24V×4 BAT×1'],
  ['dataporte', '1000M-Base-Ethernet×4 USB3.0×4'],
]],
['B2-W', 'unitree-b2-w-produktside-2026-08-19.html', [
  ['egenvaegt', '≈85kg Total weight'],
  ['maal staaende', '≈ 1098mm×550mm×758mm'],
  ['maal foldet', '≈ 950mm×550mm×450mm'],
  ['nyttelast staaende UDEN operator', 'Maximum Load(Standing) 120kg'],
  ['nyttelast gaaende', 'Load(Walking) > 40kg'],
  ['maks hastighed', '15km/h'],
  ['maks haeldning', 'Climbing Angle > 45°'],
  ['forhindring enkelt', 'stairs of 40cm in forward direction'],
  ['trappetrin kontinuerlig', 'Stairs of 20~25cm'],
  ['IP-klasse', 'IP67'],
  ['driftstemperatur', '-20℃ ~ 55℃'],
  ['batteri Wh', '＞2kwh，voltage 58V'],
  ['raekkevidde 40kg', 'Maximum endurance of 25km with 40kg load'],
  ['raekkevidde uden last', 'without load and the mileage ≈30km'],
  ['hjuldiameter', 'Wheel Diameter 225mm'],
  ['onboard compute', 'Intel Core i7 or Orin NX'],
]],
['A2', 'unitree-a2-produktside-2026-08-19.html', [
  ['maal staaende', '820mm x 440mm x 570mm'],
  ['maal foldet', '720mm x 550mm x 220mm'],
  ['egenvaegt m. batteri', 'Weight (with battery) About 42kg'],
  ['egenvaegt u. batteri', 'Weight (without battery) About 35kg'],
  ['frihedsgrader', 'Degrees of Freedom (Joint Motors) 12'],
  ['nyttelast staaende', 'Max Standing Load About 100kg'],
  ['nyttelast gaaende', 'Continuous Walking Load About 25kg'],
  ['maks hastighed', '0–3.7 m/s (Up to ~5 m/s)'],
  ['maks haeldning', 'Slope Walking Capability About 45°'],
  ['trappetrin kontinuerlig', 'Stair Climbing Capability Max Step Height: 30cm'],
  ['forhindring enkelt', 'Max Climb Height About 0.5～1m'],
  ['IP-klasse', 'IP56'],
  ['driftstemperatur', '-20℃～55℃'],
  ['batteri Wh enkelt', 'Single Battery 9000mAh（453.6Wh）'],
  ['batteri Wh dobbelt', 'Dual Batteries 18000mAh（907.2Wh）'],
  ['driftstid uden last', '>5hours continuous walking, approx. 20km'],
  ['driftstid 25kg', 'With 25kg Load： >3 hours continuous walking, approx. 12.5km'],
  ['hot-swap', 'Dual slots, dual batteries'],
  ['dataporte', 'RS485 x 2 CAN x 2 Gigabit Ethernet x 2'],
  ['stroem ud', 'Power Output：12V / 24V / BAT'],
  ['pris', 'Contact Sales'],
]],
['A2-W', 'unitree-a2-w-produktside-2026-08-19.html', [
  ['maal staaende', '900mm x 440mm x 625mm'],
  ['maal foldet', '930mm x 685mm x 210mm'],
  ['egenvaegt m. batteri', 'Weight (with battery) About 52kg'],
  ['frihedsgrader', 'Degrees of Freedom (Joint Motors) 16'],
  ['nyttelast staaende', 'Max Standing Load About 100kg'],
  ['nyttelast gaaende', 'Continuous Walking Load About 25kg'],
  ['maks hastighed', '0–3 m/s (Up to ~ 6 m/s)'],
  ['maks haeldning', 'Slope Walking Capability About 45'],
  ['trappetrin kontinuerlig', 'Stair Climbing Capability Max Step Height: 30cm'],
  ['forhindring enkelt', 'Max Climb Height About 0.5～1m'],
  ['IP-klasse', 'IP56'],
  ['driftstid uden last', '>3.5 hours continuous walking, approx. 35km'],
  ['driftstid 25kg', 'With 25kg Load： >1.5 hours continuous walking, approx. 15km'],
  ['daekstoerrelse', 'Diameter：190mm；Width：51mm'],
  ['batteri Wh', 'Single Battery 9000mAh（453.6Wh）'],
]],
['As2', 'unitree-as2-produktside-2026-08-19.html', [
  ['maal staaende', '720mm x 378mm x 457mm'],
  ['maal foldet', '776mm x 378mm x 233mm'],
  ['egenvaegt', 'Weight (with Battery) Approx. 20 kg'],
  ['frihedsgrader', 'Degrees of Freedom (Joint Motors) 12'],
  ['nyttelast staaende X', 'Max Standing Load Approx. 45kg Approx. 55kg Approx. 65kg'],
  ['nyttelast gaaende', 'Continuous Walking Load Approx. 10kg Approx. 13kg Approx. 15kg'],
  ['trappetrin kontinuerlig', 'Stair Climbing Capability 20cm 25cm 25cm 25cm'],
  ['forhindring enkelt (prosa)', 'climb 50cm vertical platforms and 40° slopes'],
  ['maks haeldning', 'Slope Walking Capability Approx. 30 ° Approx. 40'],
  ['maks hastighed', '0~3.7m/s (Up to ~5 m/s)'],
  ['IP-klasse', 'Protection Rating / IP54 IP54 IP54'],
  ['driftstemperatur AIR', '-20℃ ～ 50℃'],
  ['batteri Wh (prosa)', '648Wh (15,000mAh)'],
  ['batteri kapacitet', 'Standard (8000mAh) x1 Long Range (15000mAh) x1'],
  ['driftstid uden last AIR', '~2 hours continuous walking, approx. 10km'],
  ['driftstid m. last X', 'With 15kg loaded, >2.5 hours continuous walking, approx. 13km'],
  ['LiDAR model AIR', 'Ultra-Wide-Angle LiDAR Unitree L2'],
  ['dockingstation', 'Charging Dock / / / YES'],
  ['dataporte', 'Gigabit Ethernet x 1 SBUS x 1'],
  ['stroem ud kun BAT', 'Power Output：BAT'],
  ['garanti', 'Warranty 6 Months 12 Months'],
]],
['As2-W', 'unitree-as2-w-produktside-2026-08-19.html', [
  ['maal staaende', '721mm x 493mm x 521mm'],
  ['maal foldet', '768mm x 602mm x 211mm'],
  ['egenvaegt', 'Weight (with Battery) Approx. 25 kg'],
  ['frihedsgrader', 'Degrees of Freedom (Joint Motors) 16'],
  ['nyttelast staaende', 'Max Standing Load Approx. 150kg'],
  ['nyttelast gaaende', 'Continuous Walking Load Approx. 16kg'],
  ['trappetrin kontinuerlig', 'Stair Climbing Capability 30cm'],
  ['forhindring enkelt', 'Max Climb Height Approx. 0.4m ~ 0.8m'],
  ['maks haeldning', 'Slope Walking Capability Approx. 45'],
  ['maks hastighed', '0~3.7m/s (Max Approx. 6m/s)'],
  ['IP-klasse', 'Protection Rating IP54'],
  ['driftstemperatur', '-20℃ ～ 55℃'],
  ['batteri Wh (prosa)', '648 Wh (15,000 mAh)'],
  ['driftstid uden last (tabel)', '~3 hours continuous walking, approx. 30km'],
  ['driftstid m. 16kg (tabel)', 'With 16kg loaded, >2 hours continuous walking, approx. 25km'],
  ['MODSTRID kort: 16 km', 'Loaded > 2h (>16 km)'],
  ['MODSTRID kort: 33 km', 'Unloaded 3h+ (>33 km)'],
  ['MODSTRID prosa: 30 km', 'cruising range exceeds 30 km'],
  ['MODSTRID kort: 80 cm', 'Obstacle Capability: 80 cm steps'],
  ['daek umuligt', 'Diameter：178mm； Radius：50mm'],
]],
['Go2', 'unitree-go2-produktside-2026-08-19.html', [
  ['maal staaende', '70cm x 31cm x 40cm'],
  ['maal foldet', '76cm x 31cm x 20cm'],
  ['egenvaegt', 'Weight (with battery) About 15kg'],
  ['ledmotorer', 'Aluminum knee joint motor 12 set'],
  ['nyttelast uspecificeret', 'Payload ≈7kg （MAX ~ 10kg） ≈8kg'],
  ['maks hastighed', '0 ~ 3.7m/s （MAX ~ 5m/s）'],
  ['maks haeldning', 'Max Climb Angle 30° 40° 40° 40°'],
  ['trin uspecificeret', 'Max Climb Drop Height About 15cm About 16cm'],
  ['driftstid uden lastbetingelse', 'Battery life About 1-2h About 1-2h About 1-2h About 2-4h'],
  ['batteri kun mAh', 'Smart battery standard （8000mAh） standard （8000mAh）'],
  ['spaending', 'Voltage 28V~33.6V'],
  ['LiDAR model', '4D LiDAR L2'],
  ['onboard compute', '8-core High- performance CPU'],
  ['dockingstation', 'Charging Pile Compatibility'],
  ['PRIS AIR', '$1600'],
  ['PRIS PRO', '$2800'],
  ['PRIS X', '$4500'],
  ['pris-forbehold', 'Price（Tax and freight excluded）'],
]],
['Go2-W', 'unitree-go2-w-produktside-2026-08-19.html', [
  ['maal staaende', '70cm x 43cm x 50cm'],
  ['egenvaegt', 'Weight (with battery) About 18kg'],
  ['ledmotorer', 'Aluminum knee joint motor 16'],
  ['nyttelast uspecificeret', 'Payload ≈8kg（MAX ~ 12kg）'],
  ['maks hastighed', 'Speed 0~2.5m/s'],
  ['maks haeldning', 'Max Climb Angle 35°'],
  ['forhindring, operator <', 'Max Climb Drop Height ＜ 70cm'],
  ['driftstid uden lastbetingelse', 'Endurance 1.5-3h'],
  ['batteri kun mAh', 'Long endurance（15000mAh）'],
  ['spaending', 'Voltage 33.6V'],
  ['LiDAR uden model', 'Super-wide-angle 3D LIDAR'],
  ['onboard compute', 'Basic Computing Power 8-core High-performance CPU'],
  ['daek', '7 Inch Pneumatic Tire'],
]],
['Go1', 'unitree-go1-produktside-2026-08-19.html', [
  ['egenvaegt', 'Weight 12 kg'],
  ['maal foldet', '0.588 x 0.22 x 0.29'],
  ['ledmotorer', 'Silver alloy precision joint motor 12 piece'],
  ['nyttelast tabel', 'Load ≈4kg（limit ~ 10kg）'],
  ['nyttelast Edu', '≈6kg（limit ~ 10kg）'],
  ['MODSTRID topkort', 'Adaptive Load Capacity ≈ 3-5'],
  ['maks hastighed', 'Motion Speed 0 ~ 2.5m/s'],
  ['SDK Python', 'Python Programming Interface'],
  ['PRIS Air', '$2700'],
  ['PRIS Pro', '$3500'],
  ['LiDAR uden model', 'Radar'],
  ['batteri uden tal', 'Battery 1 piece'],
]],
['B1', 'unitree-b1-produktside-2026-08-19.html', [
  ['maal staaende', '1126*467*636mm'],
  ['maal foldet', '1202*467*297mm'],
  ['egenvaegt', 'Whole Machine (involve battery) About 50kg'],
  ['batterivaegt', 'Battery About 5kg'],
  ['nyttelast gaaende', 'Continuous walking load 20kg'],
  ['nyttelast staaende', 'Maximum standing load 80kg'],
  ['trappetrin kontinuerlig', 'Maximum Step Height to Climb Stairs 20cm'],
  ['batteri Wh', 'Rated Energy 932.4Wh'],
  ['batteri mAh', 'Rated Capacity 18000mAh'],
  ['batteri V', 'Rated Voltage 51.8V'],
  ['ladetid', 'Charge Time 1-2h'],
  ['driftstid staaende', 'Stand Endurance 5h'],
  ['driftstid gaaende uden last', 'Continuous walking and endurance without load 2h'],
  ['compute model', 'Intel i5-1135G7'],
  ['compute sekundaer', 'XavierNX *3'],
  ['kameramodel', 'Intel RealSense D430*5'],
  ['stroem ud', 'power:12V/24V'],
  ['dataporte', 'Gigabit Interface*7/RS485*4/USB*5/CAN*4'],
  ['temp KUN batteri', 'Working Temperature Battery -5℃ - 45℃'],
  ['IP68 kun i prosa', 'IP68 Waterproof, Industrial Level Heavy Loader'],
]],
['AlienGo', 'unitree-aliengo-produktside-2026-08-19.html', [
  ['egenvaegt UDEN batteri', 'Weight (without battery) 21.5kg ±1kg'],
  ['maal staaende', '0.65*0.31*0.6m'],
  ['maal foldet', '0.60*0.31*0.15m'],
  ['frihedsgrader', 'Degrees of Freedom (number of motors) 12'],
  ['nyttelast uspecificeret', 'Load 13kg'],
  ['maks hastighed', 'Maximum Walking Speed >1.5m/s'],
  ['haeldning, operator ≤', 'Climbing Angle ≤25°'],
  ['driftstid uden lastbetingelse', 'Endurance 2.5-4.6h'],
  ['batteri kun mAh', 'Battery Capacity 12600mAh'],
  ['kameraer', 'Depth Camera (2), Visual Odometer Camera (1)'],
  ['LiDAR uden model', 'Lidar: Single or Multi-line (optional)'],
  ['SDK-sprog', 'supports C/C++, ROS'],
  ['stroem ud', 'Output Power 5V、12V、19V、BAT(24V~30V)'],
  ['dataporte', 'EtherNetx2、USB3.0x2'],
]],
['A1', 'unitree-a1-produktside-2026-08-19.html', [
  ['nyttelast uspecificeret', '5 kg Effective Load'],
  ['driftstid uden lastbetingelse', '1-2.5 h Endurance'],
  ['maks hastighed', 'Maximum continuous running speed 3.3m/s (11.88km/h)'],
  ['ledmoment', 'Joint torque: 33.5NM. (MAX)'],
  ['dataporte', 'HDMI x 2, Ethernet port x 2 USB x 4'],
  ['stroem ud', '5V, 12V, 19V external output power supply'],
  ['kamera', 'Standard RealSense depth camera'],
  ['LiDAR uden model', 'Optional High-precision Lidar'],
]],
];

// Felter der SKAL vaere fravaerende — kontrol af "ikke oplyst"-paastande.
const NEGATIVE = [
  ['Go2', 'unitree-go2-produktside-2026-08-19.html', 'ingen IP-klasse', /\bIP[0-9]{2}\b/],
  ['Go2', 'unitree-go2-produktside-2026-08-19.html', 'ingen driftstemperatur', /Operating Temperature|-20℃/],
  ['Go2-W', 'unitree-go2-w-produktside-2026-08-19.html', 'ingen IP-klasse', /\bIP[0-9]{2}\b/],
  ['Go1', 'unitree-go1-produktside-2026-08-19.html', 'intet driftstidstal', /[0-9]\s*-?\s*[0-9]*\s*h(ours)?\b.*[Ee]ndurance|[Ee]ndurance.*[0-9]\s*h\b/],
  ['Go1', 'unitree-go1-produktside-2026-08-19.html', 'ingen IP-klasse', /\bIP[0-9]{2}\b/],
  ['A1',  'unitree-a1-produktside-2026-08-19.html', 'ingen egenvaegt', /Weight/i],
  ['B1',  'unitree-b1-produktside-2026-08-19.html', 'ingen maks hastighed', /m\/s|km\/h/],
  ['B1',  'unitree-b1-produktside-2026-08-19.html', 'ingen haeldning', /Climb(ing)? Angle|Slope/i],
  ['B2-W','unitree-b2-w-produktside-2026-08-19.html', 'ingen driftstid i timer', /\d\s*h(ours)?\b/],
  ['AlienGo','unitree-aliengo-produktside-2026-08-19.html', 'ingen IP-klasse', /\bIP[0-9]{2}\b/],
];

let felter = 0, fejl = 0;
const cache = new Map();
for (const [model, file, checks] of CASES) {
  if (!cache.has(file)) cache.set(file, text(file));
  const t = cache.get(file);
  for (const [felt, needle] of checks) {
    felter++;
    const n = needle.replace(/\s+/g, ' ');
    if (!t.includes(n)) { fejl++; console.log(`FEJL  ${model.padEnd(8)} ${felt.padEnd(30)} findes ikke: ${JSON.stringify(n)}`); }
  }
}
console.log(`\n--- negativkontrol (feltet SKAL mangle) ---`);
let negFelter = 0, negFejl = 0;
for (const [model, file, felt, re] of NEGATIVE) {
  if (!cache.has(file)) cache.set(file, text(file));
  negFelter++;
  const hits = cache.get(file).match(new RegExp(re, 'g'));
  if (hits) { negFejl++; console.log(`FEJL  ${model.padEnd(8)} ${felt.padEnd(28)} fandt alligevel: ${JSON.stringify(hits.slice(0,3))}`); }
  else console.log(`ok    ${model.padEnd(8)} ${felt}`);
}
console.log(`\nEfterproevet ${felter} felter over ${CASES.length} modeller, fandt ${fejl} fejl.`);
console.log(`Negativkontrol: ${negFelter} paastande om "ikke oplyst", ${negFejl} holdt ikke.`);
