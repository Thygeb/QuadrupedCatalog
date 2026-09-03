#!/usr/bin/env node
/**
 * fund/f2feje-fire-payload.mjs — arbejdsfil ejet af spor/f2-feje.
 * Bygger opdateringsposterne for de fire sidste producenter (Astrall Dynamics,
 * CVTE, Yufan Intelligent, Xiaomi) — 11 celler. Samme metode som
 * f2feje-genisom-payload.mjs: kinesiske fragmenter verificeres MEKANISK mod
 * raakildefilen, note_wording overstruktureres IKKE (BRIEF-f2-feje.md afsnit 7)
 * — Danish reasoning-prosa oversaettes AS-IS, samme indhold/struktur, til
 * engelsk (for Astrall/CVTE/Yufan/Xiaomi genbruges IKKE note's tekst 1:1, da
 * note_wording her har SIN EGEN struktur forskellig fra note — se
 * begrundelse pr. robot nedenfor).
 *
 * Brug:
 *   node fund/f2feje-fire-payload.mjs             -> printer kontrol + tal
 *   node fund/f2feje-fire-payload.mjs --skriv-fil  -> skriver JSON
 */
import fs from 'node:fs';
import path from 'node:path';

const ROD = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');

const KILDE = {
  astrall: 'media/_kilder/raa-kand2-2026-08-24/astralldynamics-forside-2026-08-24.html',
  cvte: 'media/_kilder/raa-kand2-2026-08-24/cvte-maxhub-x7-produktside-2026-08-24.html',
  yufan: 'media/_kilder/raa-kand2-2026-08-24/yufan-uniubi-shop-cyvet-2026-08-24.html',
  xiaomi1a: 'media/_kilder/raa-anvendelse-2026-08-19/xiaomi-cyberdog1-produktside-cn-2026-08-21.html',
  xiaomi1b: 'media/_kilder/raa-anvendelse-2026-08-19/xiaomi-cyberdog1-specside-bundle-js-2026-08-21.js',
  xiaomi2: 'media/_kilder/raa-kina-weilan-xiaomi-2026-08-19/xiaomi-cyberdog2-produktside-2026-08-19.html',
};
const indhold = {};
for (const [k, rel] of Object.entries(KILDE)) indhold[k] = fs.readFileSync(path.join(ROD, rel), 'utf8');

function verificer(kildeNoegle, fragment, mærkat) {
  if (!indhold[kildeNoegle].includes(fragment)) {
    throw new Error(`VERIFIKATION FEJLEDE: "${mærkat}" (${JSON.stringify(fragment)}) findes IKKE ordret i ${KILDE[kildeNoegle]}`);
  }
  return fragment;
}

// --- Astrall Dynamics (robot_id 2186) ------------------------------------
const ASTRALL_MENU_ZH = ['电力能源', '消防应急', '园区厂区', '建筑管廊', '矿井轨道', '石油化工', '警务安防', '水利水务'];
for (const zh of ASTRALL_MENU_ZH) verificer('astrall', zh, `astrall menu[${zh}]`);
verificer('astrall', '行业应用', 'astrall overskrift 行业应用');

// --- CVTE (robot_id 2189) -------------------------------------------------
verificer('cvte', '适用于工业、电力、救援等场景', 'cvte quote_wording');

// --- Yufan Intelligent (robot_id 2258) ------------------------------------
const YUFAN_ZH = '灵猫是一个开放的具身智能载具和技术平台，具备多场景适应能力，不但可以用在工业场景解决多领域问题，更是可玩性极高的创客、科研爱好者、极客、玩家的实践载体。作为普通用户，也具备完整陪伴和安全防护功能，支持家用场景智能化交互功能，包括：语音对话、跟随行走、全屋巡逻、远程画面查看，适合科技爱好者、家庭安防、亲子科教等。';
verificer('yufan', YUFAN_ZH, 'yufan quote_wording (fuld paragraf)');

// --- Xiaomi (robot_id 2249, 2250) — kun note_wording, ingen quote ----------
verificer('xiaomi1a', '仿生四足机器人', '2249 note_wording (produkttype)');
verificer('xiaomi1b', '21051191C', '2249 note_wording (modelnummer, JS-bundle)');
verificer('xiaomi2', '仿生四足机器人', '2250 note_wording (produkttype)');

console.log('ALLE kinesiske/tal-fragmenter (fire producenter) verificeret ordret mod deres kildefil.');

export const poster = [
  {
    tabel: 'applications', noegle: { robot_id: 2186 },
    saet: {
      note_wording: 'Mapping of the eight menu items to the seven allowed values: 电力能源 (electric power/energy), 建筑管廊 (construction/utility tunnels), 矿井轨道 (mining/rail) and 水利水务 (water supply) are all industrial infrastructure sectors -> industrial. 消防应急 (fire/emergency response) -> defense and emergency response. 园区厂区 (industrial-park/factory-area patrol - the page itself says "360-degree all-round monitoring", whole-area surveillance) and 警务安防 (police/security) -> security and surveillance. 石油化工 (petrochemical) -> industrial. None of the eight map to logistics, inspection, research and development, or consumer and education.',
      quote: 'The menu items on the homepage and product page.',
      quote_wording: `${ASTRALL_MENU_ZH.join('、')} (menu items under "行业应用" on the homepage and product page)`,
    },
    change_reason: 'fase 2 (spor/f2-feje): note_wording/quote/quote_wording var dansk. quote_wording renset til kildens rene menupunkter (verificeret mod astralldynamics-forside-2026-08-24.html), quote oversat. note_wording er egen resonnement-tekst, oversat AS-IS (BRIEF-f2-feje.md afsnit 7, ingen omstrukturering).',
  },
  {
    tabel: 'applications', noegle: { robot_id: 2189 },
    saet: {
      note_wording: '"工业" (industry) and "电力" (power/electricity) are both mapped to industrial, since the sentence here does not itself use an inspection word (unlike the news article, see notes). "救援" (rescue) is mapped to defense and emergency response.',
      quote: 'Suited for industry, power, rescue and similar scenarios.',
      quote_wording: '适用于工业、电力、救援等场景',
    },
    change_reason: 'fase 2 (spor/f2-feje): note_wording/quote/quote_wording var dansk. quote_wording renset til kildens raa saetning (verificeret mod cvte-maxhub-x7-produktside-2026-08-24.html), quote oversat. note_wording oversat AS-IS (BRIEF-f2-feje.md afsnit 7).',
  },
  {
    tabel: 'applications', noegle: { robot_id: 2258 },
    saet: {
      note_wording: 'Industrial scenarios is mapped to industrial. Home security/patrol is mapped to security and surveillance. Parent-child science education is mapped to consumer and education. Maker/researcher/geek/gamer is a target-audience description, not an industry sector, and is not mapped to any category.',
      quote: "Lingmao is an open embodied-intelligence vehicle and technology platform with adaptability across many scenarios. It can be used in industrial scenarios to solve problems across multiple fields, but is also a highly playful hands-on tool for makers, research enthusiasts, geeks and gamers. As an everyday user device, it also offers full companionship and safety-monitoring functions, and supports smart home interaction features including voice dialogue, follow-walking, whole-home patrol and remote video viewing - suited for tech enthusiasts, home security, and parent-child science education, among others.",
      quote_wording: YUFAN_ZH,
    },
    change_reason: 'fase 2 (spor/f2-feje): note_wording/quote/quote_wording var dansk. quote_wording renset til kildens rene paragraf (verificeret ordret mod yufan-uniubi-shop-cyvet-2026-08-24.html), quote oversat til engelsk. note_wording oversat AS-IS - note (EN) er allerede en identisk mapping-analyse for denne robot, saa note_wording foelger samme mapping-liste paa engelsk (BRIEF-f2-feje.md afsnit 7).',
  },
  {
    tabel: 'applications', noegle: { robot_id: 2249 },
    saet: {
      note_wording: 'READ THROUGH, NOTHING FOUND - also in the JS bundle, where the specifications live. The manufacturer\'s only label is the product type biomimetic quadruped robot (仿生四足机器人) and the model number 21051191C. That is what it IS, not who it is for. Same result as on CyberDog 2.',
    },
    change_reason: 'fase 2 (spor/f2-feje): note_wording var dansk (quote/quote_wording er begge null - is_not_stated). Oversat AS-IS fra dansk, samme indhold/struktur som note (BRIEF-f2-feje.md afsnit 7).',
  },
  {
    tabel: 'applications', noegle: { robot_id: 2250 },
    saet: {
      note_wording: 'READ THROUGH, NOTHING FOUND - also in the JS bundle, where the specifications live. The manufacturer\'s only label is the product type "仿生四足机器人" (biomimetic quadruped robot). That is what it IS, not who it is for.',
    },
    change_reason: 'fase 2 (spor/f2-feje): note_wording var dansk (quote/quote_wording er begge null - is_not_stated). Oversat AS-IS fra dansk, samme indhold/struktur som note (BRIEF-f2-feje.md afsnit 7).',
  },
];

let noteWordingN = 0, quoteN = 0, quoteWordingN = 0;
for (const p of poster) {
  if (p.saet.note_wording !== undefined) noteWordingN += 1;
  if (p.saet.quote !== undefined) quoteN += Array.isArray(p.saet.quote) ? p.saet.quote.length : 1;
  if (p.saet.quote_wording !== undefined) quoteWordingN += Array.isArray(p.saet.quote_wording) ? p.saet.quote_wording.length : 1;
}
console.log(`note_wording: ${noteWordingN} (forventer 5) · quote: ${quoteN} (forventer 3) · quote_wording: ${quoteWordingN} (forventer 3)`);
console.log('(Astrall 1+1+1=3, CVTE 1+1+1=3, Yufan 1+1+1=3, Xiaomi 2 note_wording -> total 11 celler, jf. briefets tabel.)');

if (process.argv.includes('--skriv-fil')) {
  const ud = path.join(ROD, 'fund/f2feje-fire-opdateringer.json');
  fs.writeFileSync(ud, JSON.stringify(poster, null, 2), 'utf8');
  console.log(`Skrevet: ${ud}`);
}
