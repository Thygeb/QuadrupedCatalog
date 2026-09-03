#!/usr/bin/env node
// Bygger fund/_opdater-f2weilan-youbaote.json PROGRAMMATISK ud fra
// fund/_yobotics-en-tekst.txt (linje for linje, samme tekst Read-vaerktoejet
// viste) — for at undgaa haandafskrivning af kinesiske tegn.
import fs from 'node:fs';

const linjer = fs.readFileSync('fund/_yobotics-en-tekst.txt', 'utf8').split('\n');
// linjer[0] er linje 1 i Read-visningen (0-indekseret array, 1-indekseret kildefil)
const L = (n) => {
  const raa = linjer[n - 1];
  if (raa === undefined) throw new Error(`Linje ${n} findes ikke`);
  return raa.replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
};
const par = (labelLinje, vaerdiLinje) => `${L(labelLinje)}：${L(vaerdiLinje)}`;

const KILDE = 'media/_kilder/raa-kina-weilan-xiaomi-2026-08-19/yobotics-katalog-firbenede-2026-08-19.html';
const poster = [];
const tilfoej = (robot_id, field_name, wording, sektion) => {
  poster.push({
    tabel: 'field_entries',
    noegle: { robot_id, field_name },
    saet: { caveat_wording: wording },
    change_reason: `spor/f2weilan: kildeordlyd paa kinesisk fra ${sektion}, ${KILDE}`,
  });
};

// ---- yobotics-e-dog (2251) — kinesisk loebende tekst, punkt 1-10 ----
tilfoej(2251, 'length', L(259), 'e-Dog-beskrivelsen, punkt 7');
tilfoej(2251, 'width', L(259), 'e-Dog-beskrivelsen, punkt 7');
tilfoej(2251, 'height', L(259), 'e-Dog-beskrivelsen, punkt 7');
tilfoej(2251, 'weight', L(260), 'e-Dog-beskrivelsen, punkt 8');
tilfoej(2251, 'degrees_of_freedom', L(262), 'e-Dog-beskrivelsen, punkt 10');
tilfoej(2251, 'payload_standing', L(254), 'e-Dog-beskrivelsen, punkt 2');
tilfoej(2251, 'payload_walking', L(254), 'e-Dog-beskrivelsen, punkt 2');
tilfoej(2251, 'speed', L(254), 'e-Dog-beskrivelsen, punkt 2');
tilfoej(2251, 'stair_step_continuous', L(254), 'e-Dog-beskrivelsen, punkt 2');
tilfoej(2251, 'runtime', L(256), 'e-Dog-beskrivelsen, punkt 4');

// ---- yobotics-y10 (2252) — tabellen under fanen "Y10" (linje 145-193) ----
tilfoej(2252, 'weight', par(158, 159), 'fanen Y10, taeller-raekke 3 (重量)');
tilfoej(2252, 'payload_walking', par(173, 174), 'fanen Y10, taeller-raekke 8 (持续行走负载)');
tilfoej(2252, 'speed', par(176, 177), 'fanen Y10, taeller-raekke 9 (奔跑速度)');

// ---- yobotics-y20 (2253) — tabellen under fanen "Y20" (linje 195-249) ----
tilfoej(2253, 'payload_walking', par(220, 221), 'fanen Y20, taeller-raekke 7 (行走负载)');
tilfoej(2253, 'stair_step_continuous', par(235, 236), 'fanen Y20, taeller-raekke 12 (攀爬台阶高度)');
tilfoej(2253, 'temperature_min', par(241, 242), 'fanen Y20, taeller-raekke 14 (工作环境温度)');
tilfoej(2253, 'height', par(205, 206), 'fanen Y20, taeller-raekke 2 (折叠尺寸)');
tilfoej(2253, 'payload_standing', par(217, 218), 'fanen Y20, taeller-raekke 6 (站立负载)');
tilfoej(2253, 'speed', par(223, 224), 'fanen Y20, taeller-raekke 8 (奔跑速度)');
tilfoej(2253, 'slope', par(238, 239), 'fanen Y20, taeller-raekke 13 (攀爬斜坡角度)');
tilfoej(2253, 'battery_wh', par(211, 212), 'fanen Y20, taeller-raekke 4 (电池容量)');
tilfoej(2253, 'runtime', par(214, 215), 'fanen Y20, taeller-raekke 5 (续航)');
tilfoej(2253, 'charging_time', par(247, 248), 'fanen Y20, taeller-raekke 16 (选配)');
tilfoej(2253, 'docking_station', par(247, 248), 'fanen Y20, taeller-raekke 16 (选配)');

fs.writeFileSync('fund/_opdater-f2weilan-youbaote.json', JSON.stringify(poster, null, 2) + '\n', 'utf8');
console.log(`${poster.length} poster skrevet til fund/_opdater-f2weilan-youbaote.json`);
for (const p of poster) console.log(`  ${p.noegle.robot_id} ${p.noegle.field_name}: ${JSON.stringify(p.saet.caveat_wording)}`);
process.exitCode = 0;
