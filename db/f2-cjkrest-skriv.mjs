#!/usr/bin/env node
/**
 * db/f2-cjkrest-skriv.mjs — spor/cjkrest's skriveredskab (ejet af dette
 * spor alene). Renser de sidste 19 kinesisk-tegn-bærende rækker i
 * applications.note (14) og robots.notes (5 elementer, 5 robotter) for
 * CJK-tegn, jf. tests/dele/42-cjk-ordlyd.mjs.
 *
 * Tre slags rækker (BRIEF-cjkrest.md punkt 4-6):
 *   'fjernelse' (15) — hvert CJK-løb i den brugervendte tekst står allerede
 *      i søsterfeltet <felt>_wording. Wording røres ikke.
 *   'flytning'  (3)  — søsterfeltet er NULL/tomt/mangler netop dette løb.
 *      Belægget er slået op i media/_kilder/ og flyttes dertil FØR det
 *      fjernes fra den brugervendte tekst.
 *   'fund'      (1)  — xiaomi-cyberdog-1: to af tre CJK-termer i noten er
 *      IKKE producentens ord (0 forekomster i alle Xiaomis egne arkiverede
 *      filer — det er indsamlerens egne søgetermer). De to må ALDRIG ind i
 *      notes_wording[1], som forbliver uændret ("立即购买" alene).
 *
 * FØR nogen PATCH køres, tjekker --verificer (og hver --toerloeb/--skriv-
 * kørsel automatisk) A) at INGEN af de nye note/notes-tekster indeholder
 * CJK-tegn ([一-鿿]) og B) at hvert wording-fragment, der SKRIVES af en
 * 'flytning', er en BOGSTAVELIG delstreng (indexOf >= 0) af den navngivne
 * kildefil i media/_kilder/.
 *
 * Brug:
 *   node db/f2-cjkrest-skriv.mjs --verificer     Kun kildetjek, ingen netværk mod DB.
 *   node db/f2-cjkrest-skriv.mjs --toerloeb      Standard: viser hvad der VILLE ske.
 *   node db/f2-cjkrest-skriv.mjs --skriv         Skriver rent faktisk, én PATCH pr. post.
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const ROD = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const KILDE_MAPPE = path.join(ROD, 'media/_kilder');
const CJK = /[一-鿿]/; // svarer til SQL-mønsteret '[一-鿿]'

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

const UNITREE_CN_1 = 'raa-f2-unitree-2026-09-02/unitree-cn-forside-2026-09-02.html';
const UNITREE_CN_2 = 'raa-felt-eu-2026-08-19/unitree-forside-cn-2026-08-19.html';
const YJ30_MAX = 'raa-kand4-2026-08-25/yuejialingdong-yj-57-2026-08-25.html'; // title "YJ30Max-越甲..."

const kildeCache = new Map();
function laesKilde(rel) {
  if (kildeCache.has(rel)) return kildeCache.get(rel);
  const fuld = path.join(KILDE_MAPPE, rel);
  const indhold = fs.existsSync(fuld) ? fs.readFileSync(fuld, 'utf8') : null;
  kildeCache.set(rel, indhold);
  return indhold;
}

/* -------------------------------------------------------------------------
 * APPLICATIONS.NOTE — 14 rækker: 12 fjernelser + 2 flytninger
 * ---------------------------------------------------------------------- */

const APPLICATIONS = [
  // ------------------------------------------------------- fjernelser (12)
  { robot_id: 2189, slug: 'cvte-maxhub-x7', kasse: 'fjernelse',
    note: 'Industry and power/electricity are both mapped to industrial, since this sentence does not itself use an inspection word (unlike the news article). Rescue is mapped to defense and emergency response.' },

  { robot_id: 2205, slug: 'genisom-gangben-l1', kasse: 'fjernelse',
    note: 'Own translation: "Gangben L1 is GENISOM AI’s own first industrial-grade small quadruped robot ... widely used in power-grid inspection, emergency rescue, security patrol, research and education." The manufacturer’s own labels map as follows: power-grid inspection -> inspection; emergency rescue -> defense and emergency response; security patrol -> security and surveillance; research and education -> research and development (the education part of that label has no precise match in the value set beyond consumer and education, which is not used here, since the context is professional research, not a consumer product).' },

  { robot_id: 2206, slug: 'genisom-gangben-l1-w', kasse: 'fjernelse',
    note: 'From the section headed "next application scenario, already in place" on L1-W’s own product page — four separate quotes, not inherited from L1. Own translation: reconnaissance/search-and-rescue -> defense and emergency response; emergency firefighting -> defense and emergency response (same category as reconnaissance/search-and-rescue, two quotes); research and education -> research and development; security patrol -> security and surveillance.' },

  { robot_id: 2207, slug: 'genisom-gangben-l2', kasse: 'fjernelse',
    note: 'From the section headed "next application scenario, already in place". The manufacturer’s own scenario labels map as follows: security patrol -> security and surveillance; research and education -> research and development; short-distance delivery -> logistics.' },

  { robot_id: 2208, slug: 'genisom-gangben-l2-w', kasse: 'fjernelse',
    note: 'From the section headed "next application scenario, already in place" on L2’s product page. The text appears ONCE on the page, BEFORE the variant tabs (L2/L2-W/L2-W Ultra), in the structured spec table — it covers the whole Gangben L2 family as a whole, not just the base version. Quoted independently from the same URL, NOT via inherited_from: it is the same primary source for all three variants, not an inference about another robot (inherited_from would presuppose that L2-W’s OWN page was silent and borrowed L2’s quote — it is not: the text sits on the very page L2-W also lives on). Own translation: security patrol -> security and surveillance; emergency firefighting -> defense and emergency response; research and education -> research and development; short-distance delivery -> logistics. NOTE: this quote has FOUR items (including emergency firefighting), while genisom-gangben-l2.yaml’s existing quote has only three (missing emergency firefighting) — an independent re-reading of the same raw HTML for this entry. The existing L2 entry is NOT corrected, per the task’s instruction not to touch the two existing entries.' },

  { robot_id: 2209, slug: 'genisom-gangben-l2-w-ultra', kasse: 'fjernelse',
    note: 'Same section and same reasoning as genisom-gangben-l2-w.yaml: the text headed "next application scenario, already in place" appears ONCE on the L2 page for the whole Gangben L2 family, before the variant tabs. Quoted independently from the same URL, not via inherited_from. Own translation: security patrol -> security and surveillance; emergency firefighting -> defense and emergency response; research and education -> research and development; short-distance delivery -> logistics.' },

  { robot_id: 2210, slug: 'genisom-qiuqiu-sp1', kasse: 'fjernelse',
    note: 'Own translation: "GENISOM Qiuqiu SP1 is an explosion-proof quadruped inspection robot for high-risk industrial environments such as petrochemicals and energy stations" (meta description) and "Autonomous inspection, data transmission, zero personnel risk" (marketing headline — autonomous inspection). The page’s OWN "next application scenario, already in place" section lists FOUR FACILITY TYPES, not activity categories: refinery plant area, chemical storage tank area, gas/LNG station, oil/gas pipeline — none of them is a verbatim activity category in the schema’s allowed set, so they are NOT used as quote/value here. Instead, industrial/inspection is derived from the meta description’s high-risk industrial environment and explosion-proof ... inspection robot phrasing, plus the body text’s explicit autonomous inspection wording.' },

  { robot_id: 2211, slug: 'genisom-tongchui-m1', kasse: 'fjernelse',
    note: 'From the section headed "next application scenario, already in place" on M1’s own product page. Own translation: forest firefighting -> defense and emergency response; petrochemical firefighting -> defense and emergency response (same category, two quotes); power-grid inspection -> inspection; site patrol -> security and surveillance; logistics transport -> logistics.' },

  { robot_id: 2212, slug: 'genisom-tongchui-m1-pro', kasse: 'fjernelse',
    note: 'From the section headed "next application scenario, already in place" on M1’s own product page. The text appears ONCE on the page, shared by all three tabs (M1/M1 Pro/M1 Ultra) in the structured spec table — it covers the whole Tongchui M1 family as a whole. Quoted independently from the same URL, NOT via inherited_from: it is the same primary source for all three variants, not an inference borrowed from another robot’s page (same principle as GENISOM Gangben L2-W/L2-W Ultra in this catalogue — inherited_from would presuppose that M1 Pro’s OWN page was silent and borrowed M1’s quote, which it is not: the text sits on the very page M1 Pro also lives on). Own translation — identical to genisom-tongchui-m1.yaml’s: forest firefighting -> defense and emergency response; petrochemical firefighting -> defense and emergency response; power-grid inspection -> inspection; site patrol -> security and surveillance; logistics transport -> logistics.' },

  { robot_id: 2213, slug: 'genisom-tongchui-m1-ultra', kasse: 'fjernelse',
    note: 'Same source section as genisom-tongchui-m1-pro.yaml and the base version (the "next application scenario, already in place" section) — the same primary source for all three variants, NOT inherited_from. See genisom-tongchui-m1-pro.yaml for the full reasoning for why inherited_from is not used here.' },

  { robot_id: 2222, slug: 'magiclab-magicdog-y1', kasse: 'fjernelse',
    note: 'The two manufacturer domains say the same thing: magiclab.top states "MagicLab Industrial Quadruped Robot"; the Chinese-language page states the equivalent designation in Chinese.' },

  { robot_id: 2256, slug: 'yuejia-yj30-max-w', kasse: 'fjernelse',
    note: 'Identical product description to the YJ30 W (same paragraph, same pattern - this is the large version). Our own translation: see the YJ30 W’s note for the full rationale. Warehousing is, for the same reason, NOT counted as a separate logistics category.' },

  // -------------------------------------------------------- flytninger (2)
  // note_wording var NULL for begge. Belægget "消费级 / 科研" / "行业级" er
  // slaaet op i Unitrees egne arkiverede filer (indexOf-verificeret nedenfor).
  { robot_id: 2231, slug: 'unitree-a1', kasse: 'flytning', kilde: UNITREE_CN_1,
    note_wording: '消费级 / 科研',
    note: 'The manufacturer’s own product navigation, the group A1 belongs to. The English and Chinese navigation name the group differently: EN ‘Consumer/Education’, CN "consumer-grade / scientific research" (the manufacturer’s own Chinese-language wording). Both are the manufacturer’s own wording.' },

  { robot_id: 2233, slug: 'unitree-a2-w', kasse: 'flytning', kilde: UNITREE_CN_1,
    note_wording: '行业级',
    note: 'A2-W does not appear in the manufacturer’s English product navigation menu, where A2 is listed under ‘Robot - Industry’ — though the Chinese-language navigation does list A2-W alongside A2 under the same "industry-level" group (the manufacturer’s own Chinese-language label). The category here is therefore the product page’s own sentence, not the navigation’s grouping. The same page also calls the robot an ‘Industrial-grade mobile platform’ — that is a build quality, not a use case, and is not counted.' },
];

/* -------------------------------------------------------------------------
 * ROBOTS.NOTES / NOTES_WORDING — 5 robotter, kun det navngivne element
 * ændres; resten af arrayet skrives uændret tilbage (jsonb er ikke
 * delvist opdaterbart via PATCH). change_reason er fælles pr. robot.
 * ---------------------------------------------------------------------- */

const ROBOTS = [
  // -------------------------------------------------- fjernelse: element 0
  { robot_id: 2209, slug: 'genisom-gangben-l2-w-ultra', kasse: 'fjernelse', notesAendret: [0],
    notes: [
      'NO STANDALONE URL: same caveat as L2-W — exists solely as a tab switch on L2’s own page (https://www.genisomai.com/product-robot/L2, techParamsData.datas[2]; the internal classname carries the manufacturer’s own Chinese-language label for "L2-W Ultra", id 1250).',
      'THE MARKETING CARD’S FIGURES (70cm obstacle height, 756Wh battery) ARE DELIBERATELY NOT USED HERE: same caveat as L2-W — the hero marketing card’s figures appear once for the whole page and are not repeated in L2-W Ultra’s own data block, hence not attributed to this variant specifically.',
      'L2-W ULTRA HAS ITS OWN LIDAR SPECIFICATION, WHICH L2/L2-W DO NOT HAVE: the sensor section for this variant specifically names an industrial-grade 96-line LiDAR, 2 units — the only GENISOM entry in this track with a concrete LiDAR line count.',
    ] },

  // -------------------------------------------------- fjernelse: element 0
  { robot_id: 2224, slug: 'microrobotech-movenew-t1', kasse: 'fjernelse', notesAendret: [0],
    notes: [
      "THE MANUFACTURER HAS CHANGED ITS NAME/DOMAIN. The domain used by the CEO's own materials and the press (microrobotech.com) redirects 301 to micbotics.com. The entire current site uses the brand name 'Micbot'/'MICBOT' (meta keywords, the page's title tags '...-MICBOT', navigation logo) - NOT 'MicroRoboTech'. The legal company name remains Hangzhou Juwei Technology (its Chinese-language registered name), which 36Kr's project page translates as 'MicroRoboTech' (https://pitchhub.36kr.com/project/3401143382263687, retrieved 2026-08-24). The manufacturer field here retains the CEO's own naming 'MicroRoboTech', but the consumer-facing brand to look for going forward is 'Micbot'.",
      "The datasheet table is identical on the English (micbotics.com) and Chinese (micbotics.cn) sites - all 25+ rows cross-checked verbatim, 0 discrepancies. The English version is therefore used directly as the source without translation risk for the figures themselves.",
      "'Total Battery Weight: 40~50kg' / Chinese is an ambiguous label (conflates whole-machine weight with battery). Placed as own weight based on context (appears under 'Mechanical Parameters' together with the dimensions, not under 'Electrical Parameters'), but the wording is not unambiguous - see the caveat on the field.",
      "No price found on either language version - only 'Buy Now'/'Get Solutions' contact buttons, no printed figure.",
    ] },

  // -------------------------------------------------- fjernelse: element 1
  { robot_id: 2258, slug: 'yufan-lingmao-cyvet', kasse: 'fjernelse', notesAendret: [1],
    notes: [
      "HOME CITY IS NOT DISCLOSED BY THE MANUFACTURER ITSELF: eight saved pages from the manufacturer's own domain (homepage, product page, motor page, purchase page, two embodied-AI pages, two download/GitHub pages) do not name a city directly - only a Zhejiang-province registration (the ICP code begins with the province's own prefix, not a city code). The city often attributed to the company (next note) appears only in an external encyclopedia entry that is not saved here and therefore cannot be verified as the manufacturer's own source.",
      'The product name appears verbatim in a Chinese-and-English combined form on the purchase page (shop/buy?product=air) - "Cyvet" is therefore part of the official product name, not just a press translation, and a Chinese-language name precedes it there. The company’s English legal name in the copyright line is "Universal Ubiquitous AI Co., Ltd.", the brand mark on the site is "UNIUBI AI", and the domain is uniubi.com (redirected from the older uni-ubi.com). The company’s Chinese-language name is the same company per an external encyclopedia entry (baike.baidu.com) - not independently verified against the manufacturer’s own domain, and kept here only as an external cross-reference, not as a producer-verified fact.',
      "IMPORTANT CAVEAT FROM THE MANUFACTURER ITSELF: the purchase page's footer disclaimer states verbatim: the parameters on this page are compiled from testing of the current engineering pre-production sample and planned versions; some features and performance figures are still under development; actual mass-production configuration, performance and delivery content are determined by the order confirmation and the actual shipped version. Hence status: announced, not in_production - the specifications are themselves marked as pre-production-sample figures, not a final product.",
    ] },

  // ---------------------------------------------- flytning: element 0 og 1
  // notes_wording[0] "爬坡角度" er UÆNDRET (allerede der). notes_wording[1]
  // gaar fra "" til "基础参数" — belæg i YJ30 Max's EGEN fil (indexOf
  // verificeret nedenfor). Samtidig reparerer vi notes[0]s ledetekst
  // (punkt 4a/5c): den mangler i dag et ord foran "(climb angle)", fordi
  // et tidligere pas fjernede 爬坡角度 uden at lukke saetningen.
  { robot_id: 2255, slug: 'yuejia-yj30-max', kasse: 'flytning', kilde: YJ30_MAX, notesAendret: [0, 1],
    notes: [
      'SAME MERGED-COLUMN PATTERN AS THE YJ30 FOR SLOPE: here the column’s Chinese-language label translates to "climb angle", without the \'/DOF\' addition - DOF is therefore not mentioned anywhere on the YJ30Max’s page at all, not just omitted from a merged column. degrees_of_freedom is not disclosed.',
      'LIDAR NOT FILLED IN: same situation as the YJ30 - no lidar row in the table headed "basic parameters" (the manufacturer’s own Chinese-language heading).',
    ],
    notesWording: ['爬坡角度', '基础参数'],
    wordingFragmentTilVerifikation: '基础参数' /* kun det NYE fragment */ },

  // -------------------------------------------------------- fund: element 1
  // notes_wording[1] forbliver "立即购买" UÆNDRET (sendes IKKE i PATCH).
  // 加入购物车 og 已售罄 er IKKE Xiaomis ord (0 forekomster i alle Xiaomis
  // egne arkiverede filer, se FUND-cjkrest.md) og maa derfor ikke flyttes
  // til wording — de omskrives kun i den engelske prosa.
  { robot_id: 2249, slug: 'xiaomi-cyberdog-1', kasse: 'fund', notesAendret: [1],
    notes: [
      "SAME TRAP AS CYBERDOG 2, SAME SOLUTION. The specification page delivers an empty content element; the entire sheet lives as plain text in a JavaScript bundle, which the page itself tells the browser to fetch: https://cdn.cnbj1.fds.api.mi-img.com/mi.com-assets/shop/pro/js/product/cyberdog/specs.5406502c.js (retrieved 2026-08-21). Primary source: the manufacturer's own server, the manufacturer's own content.",
      'STATUS IS A CATALOG DECISION BASED ON MEASURED SIMILARITY, NOT A STATEMENT FROM THE MANUFACTURER. Six signals were compared between CyberDog 1 and CyberDog 2 on mi.com: HTTP status on the product page (200 vs 200), the manufacturer’s "buy now" button (2 occurrences vs 2), the add-to-cart button (0 occurrences vs 0 — our own search term, not found on either page), the sold-out marker (0 vs 0 — likewise our own search term, not found on either page), the price field in the page’s product JSON (0 vs 0), and is_enable (false vs false). All six are identical. There is therefore NO measurable difference on the manufacturer’s page between the model we carry as in-production and this one. The only argument for discontinued is that a successor with a higher generation number exists - and that is our own inference, not Xiaomi’s word.',
      "NO LIDAR IN THE SENSOR LIST. The manufacturer lists twelve sensors, and a LiDAR is not among them. This is NOT recorded as 'no', because the list is not declared exhaustive. By comparison, CyberDog 2 names a YDLIDAR TG30. See the caveat on the lidar field.",
      "THE DEPTH CAMERA IS DIFFERENT FROM CYBERDOG 2'S: here Intel RealSense D450, there D430.",
    ] },
];

/* ------------------------------------------------------ kilde-verifikation */

function verificerAlt() {
  let fejl = 0;
  let tjekketCjk = 0;
  let tjekketKilde = 0;

  // A) INGEN CJK-tegn i noget nyt note/notes-felt.
  for (const a of APPLICATIONS) {
    tjekketCjk++;
    if (CJK.test(a.note)) {
      fejl++;
      console.error(`FEJL applications ${a.slug}: note indeholder stadig CJK-tegn`);
    }
  }
  for (const r of ROBOTS) {
    for (const i of r.notesAendret) {
      tjekketCjk++;
      if (CJK.test(r.notes[i])) {
        fejl++;
        console.error(`FEJL robots ${r.slug} notes[${i}]: indeholder stadig CJK-tegn`);
      }
    }
  }

  // B) Hvert NYT wording-fragment (kun flytningerne) er en bogstavelig
  //    delstreng af den navngivne kildefil.
  for (const a of APPLICATIONS) {
    if (a.kasse !== 'flytning') continue;
    tjekketKilde++;
    const indhold = laesKilde(a.kilde);
    if (indhold === null) {
      fejl++;
      console.error(`FEJL applications ${a.slug}: kildefil mangler: ${a.kilde}`);
      continue;
    }
    const i = indhold.indexOf(a.note_wording);
    console.log(`  ${a.slug}.note_wording "${a.note_wording}" i ${a.kilde}: indexOf=${i}`);
    if (i < 0) {
      fejl++;
      console.error(`FEJL applications ${a.slug}: note_wording IKKE fundet ordret i ${a.kilde}`);
    }
  }
  for (const r of ROBOTS) {
    if (r.kasse !== 'flytning') continue;
    tjekketKilde++;
    const indhold = laesKilde(r.kilde);
    if (indhold === null) {
      fejl++;
      console.error(`FEJL robots ${r.slug}: kildefil mangler: ${r.kilde}`);
      continue;
    }
    const i = indhold.indexOf(r.wordingFragmentTilVerifikation);
    console.log(`  ${r.slug}.notes_wording nyt fragment "${r.wordingFragmentTilVerifikation}" i ${r.kilde}: indexOf=${i}`);
    if (i < 0) {
      fejl++;
      console.error(`FEJL robots ${r.slug}: nyt notes_wording-fragment IKKE fundet ordret i ${r.kilde}`);
    }
  }

  console.log(`Verifikation: ${tjekketCjk} note/notes-felter CJK-tjekket, ${tjekketKilde} flytnings-fragmenter kildetjekket, ${fejl} fejl.`);
  return fejl === 0;
}

/* --------------------------------------------------------------- main */

async function main() {
  const args = process.argv.slice(2);
  const kunVerificer = args.includes('--verificer');
  const skriv = args.includes('--skriv');

  console.log('--- Verifikation (ingen CJK i nye tekster; flytningers wording er bogstavelig i kilden) ---');
  const ok = verificerAlt();
  if (!ok) {
    console.error('Verifikation fejlede — INGEN skrivning forsøgt.');
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

  for (const a of APPLICATIONS) {
    planlagte++;
    const body = {
      note: a.note,
      collected_by: 'spor/cjkrest',
      change_reason: `cjkrest: applications.note renset for CJK (kasse ${a.kasse})`,
    };
    if (a.kasse === 'flytning') {
      body.note_wording = a.note_wording;
      body.change_reason += ' — note_wording udfyldt fra producentens egen arkiverede fil';
    }
    const url = `${U}/rest/v1/applications?robot_id=eq.${a.robot_id}`;
    console.log(`applications ${a.slug} (${a.robot_id}) [${a.kasse}]`);
    if (!skriv) continue;
    const svar = await fetch(url, { method: 'PATCH', headers: H, body: JSON.stringify(body) });
    const json = await svar.json();
    if (!svar.ok || !Array.isArray(json) || json.length !== 1) {
      console.error(`  AFBRUDT: applications ${a.slug} — status ${svar.status}, ${json.length ?? '?'} rækker`, json);
      process.exitCode = 1;
      return;
    }
    udfoerte++;
    console.log('  OK, 1 række opdateret.');
  }

  for (const r of ROBOTS) {
    planlagte++;
    const body = {
      notes: r.notes,
      collected_by: 'spor/cjkrest',
      change_reason: `cjkrest: robots.notes[${r.notesAendret.join(',')}] renset for CJK (kasse ${r.kasse})`,
    };
    if (r.notesWording) {
      body.notes_wording = r.notesWording;
      body.change_reason += ' — notes_wording[1] udfyldt fra producentens egen arkiverede fil';
    }
    const url = `${U}/rest/v1/robots?id=eq.${r.robot_id}`;
    console.log(`robots ${r.slug} (${r.robot_id}) notes[${r.notesAendret.join(',')}] [${r.kasse}]`);
    if (!skriv) continue;
    const svar = await fetch(url, { method: 'PATCH', headers: H, body: JSON.stringify(body) });
    const json = await svar.json();
    if (!svar.ok || !Array.isArray(json) || json.length !== 1) {
      console.error(`  AFBRUDT: robots ${r.slug} — status ${svar.status}, ${json.length ?? '?'} rækker`, json);
      process.exitCode = 1;
      return;
    }
    udfoerte++;
    console.log('  OK, 1 række opdateret.');
  }

  console.log(`\n${skriv ? 'Skrevet' : 'Ville skrive'}: ${planlagte} opdateringer${skriv ? ` (${udfoerte} bekræftet)` : ''}.`);
  if (!skriv) {
    console.log('Dette var et TØRLØB. Kør med --skriv for at skrive rent faktisk.');
  }
}

export { APPLICATIONS, ROBOTS };

const koertDirekte = process.argv[1] && import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`;
if (koertDirekte) {
  main().catch((err) => {
    console.error('f2-cjkrest-skriv: fejl —', err.message, err.stack);
    process.exitCode = 1;
    return;
  });
}
