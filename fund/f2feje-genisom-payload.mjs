#!/usr/bin/env node
/**
 * fund/f2feje-genisom-payload.mjs — arbejdsfil ejet af spor/f2-feje.
 * Bygger opdateringsposterne for GENISOM AI's 9 robotter (applications.note_wording,
 * .quote, .quote_wording) og VERIFICERER MEKANISK, at hvert kinesisk fragment er en
 * bogstavelig delstreng af den navngivne råkildefil, FØR noget skrives ud.
 * Ingen håndindtastning af kinesiske tegn i selve payloaden uden en mod-kontrol.
 *
 * Brug:
 *   node fund/f2feje-genisom-payload.mjs             -> printer kontrolresultat + JSON
 *   node fund/f2feje-genisom-payload.mjs --skriv-fil  -> skriver JSON til
 *                                                        fund/f2feje-genisom-opdateringer.json
 */
import fs from 'node:fs';
import path from 'node:path';

const ROD = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');

const KILDE = {
  l1: 'media/_kilder/raa-f2-genisom-2026-09-02/genisomai-L1-2026-09-02.html',
  l1w: 'media/_kilder/raa-genisom-2026-08-24/genisomai-l1w-2026-08-24.html',
  l2: 'media/_kilder/raa-genisom-2026-08-24/genisomai-l2-2026-08-24.html',
  m1: 'media/_kilder/raa-genisom-2026-08-24/genisomai-m1-2026-08-24.html',
  sp1: 'media/_kilder/raa-genisom-2026-08-24/genisomai-sp1-2026-08-24.html',
};

const indhold = {};
for (const [k, rel] of Object.entries(KILDE)) {
  indhold[k] = fs.readFileSync(path.join(ROD, rel), 'utf8');
}

/**
 * NOTE_EN: applications.note (allerede engelsk, 0 dansk maalt i grundmaalingen)
 * for GENISOM's 9 robotter, indlaest DIREKTE fra grundmaalingens dump
 * (fund/f2feje-data/GENISOM-AI.json) i stedet for at blive genindtastet i
 * haanden — undgaar tegn-drift i buede anfoerselstegn/tankestreger.
 *
 * BRUG: note_wording (dansk, DENNE tur) er verificeret (robot for robot,
 * jf. RETTELSEN i "Nye faelder" i fund/FUND-f2feje.md) at vaere PARALLEL-
 * OVERSAT indhold af DENNE note — samme resonnement, to sprog, ikke en
 * kilde-ordret formulering. BRIEF-f2-feje.md afsnit 7 forbyder at
 * omstrukturere et saadant felt (fjerne resonnementet og reducere det til
 * en kort kilde-etikette, som foerste udgave af dette script gjorde) —
 * i stedet genbruges note's EGEN, allerede-etablerede engelske tekst som
 * note_wording's nye vaerdi: samme indhold, samme struktur, blot ikke
 * genoversat af mig (og dermed ikke en ny kilde til afvigelse fra note).
 */
const NOTE_EN = Object.fromEntries(
  JSON.parse(fs.readFileSync(path.join(ROD, 'fund/f2feje-data/GENISOM-AI.json'), 'utf8'))
    .map((r) => [r.robot_id, r.applications.note]),
);

/** Kaster, hvis fragmentet IKKE er en bogstavelig delstreng af kildefilen. */
function verificer(kildeNoegle, fragment, mærkat) {
  if (!indhold[kildeNoegle].includes(fragment)) {
    throw new Error(`VERIFIKATION FEJLEDE: "${mærkat}" (${JSON.stringify(fragment)}) findes IKKE ordret i ${KILDE[kildeNoegle]}`);
  }
  return fragment;
}

const HEADING = '下一个应用场景，它已提前就位';

// --- Robot 2205: genisom-gangben-l1 -------------------------------------
// "..." i quote_wording markerer en bevidst udeladelse (OPSKRIFT-fase2-cjk.md
// §"..." markerer") — de to led FØR og EFTER verificeres hver for sig, ikke
// hele strengen under ét (den findes ikke sammenhængende i kilden).
verificer('l1', '钢镚L1是智身科技自主研发的首款行业级小型四足机器人', '2205 quote_wording FØR "..."');
verificer('l1', '广泛应用于电力巡检、应急救援、安防巡逻、科研教育等场景。', '2205 quote_wording EFTER "..."');
verificer('l1', '电力巡检、应急救援、安防巡逻、科研教育', '2205 note_wording (kategori-liste)');

// --- Robot 2206: genisom-gangben-l1-w -----------------------------------
for (const zh of ['侦查搜救', '应急消防', '科研教育', '安防巡逻']) verificer('l1w', zh, `2206 quote_wording[${zh}]`);
verificer('l1w', HEADING, '2206 note_wording (overskrift)');

// --- Robot 2207/2208/2209: genisom-gangben-l2-familien -------------------
for (const zh of ['安防巡逻', '应急消防', '科研教育', '短途配送']) verificer('l2', zh, `l2-familie quote_wording[${zh}]`);
verificer('l2', HEADING, 'l2-familie note_wording (overskrift)');

// --- Robot 2210: genisom-qiuqiu-sp1 --------------------------------------
verificer('sp1', '智身铅球 SP1 是面向石油化工、能源场站等高危工业环境的防爆四足巡检机器人', '2210 quote_wording[0]');
verificer('sp1', '自主巡检 数据回传 人员零涉险', '2210 quote_wording[1]');
verificer('sp1', '高危工业环境', '2210 note_wording');

// --- Robot 2211/2212/2213: genisom-tongchui-m1-familien -------------------
for (const zh of ['森林消防', '石化消防', '电力巡检', '园区巡逻', '物流运输']) verificer('m1', zh, `m1-familie quote_wording[${zh}]`);
verificer('m1', HEADING, 'm1-familie note_wording (overskrift)');

console.log('ALLE kinesiske fragmenter verificeret ordret mod deres kildefil.');

// -------------------------------------------------------------------------
// Engelske glosser: genbrugt PRÆCIS fra den engelske "note"-prosa, der
// allerede ligger i databasen for hver robot (ikke nyopfundne oversættelser)
// — se fund/f2feje-data/GENISOM-AI.json for kildeteksten pr. robot.
// -------------------------------------------------------------------------

export const poster = [
  {
    tabel: 'applications', noegle: { robot_id: 2205 },
    saet: {
      note_wording: NOTE_EN[2205],
      quote: "Gangben L1 is GENISOM AI's own first industrial-grade small quadruped robot... widely used in power-grid inspection, emergency rescue, security patrol, research and education.",
      quote_wording: '钢镚L1是智身科技自主研发的首款行业级小型四足机器人...广泛应用于电力巡检、应急救援、安防巡逻、科研教育等场景。',
    },
    change_reason: 'fase 2 (spor/f2-feje): quote/quote_wording/note_wording var dansk (rest fra BRIEF-FAELLES.md\'s ni-kolonne-fejl, STATUS.md Å143). quote_wording sat til kildens kinesiske ordlyd ordret (meta description, genisomai-L1-2026-09-02.html), quote til den engelske oversaettelse allerede etableret i applications.note. note_wording ER note (samme resonnement, ikke en kilde-ordlyd) - se BRIEF-f2-feje.md afsnit 7, aabent spoergsmaal til JPK.',
  },
  {
    tabel: 'applications', noegle: { robot_id: 2206 },
    saet: {
      note_wording: NOTE_EN[2206],
      quote: ['Reconnaissance and search-and-rescue', 'Emergency firefighting', 'Research and education', 'Security patrol'],
      quote_wording: ['侦查搜救', '应急消防', '科研教育', '安防巡逻'],
    },
    change_reason: 'fase 2 (spor/f2-feje): samme rettelse som 2205 - quote/quote_wording/note_wording var dansk. Kilde: genisomai-l1w-2026-08-24.html, sektionen "下一个应用场景，它已提前就位". note_wording ER note (BRIEF-f2-feje.md afsnit 7).',
  },
  {
    tabel: 'applications', noegle: { robot_id: 2207 },
    saet: {
      note_wording: NOTE_EN[2207],
      quote: ['Security patrol', 'Research and education', 'Short-distance delivery'],
      quote_wording: ['安防巡逻', '科研教育', '短途配送'],
    },
    change_reason: 'fase 2 (spor/f2-feje): samme rettelse - quote/quote_wording/note_wording var dansk. Kategorivaerdien (3 led, uden 应急消防) ROERES IKKE - kun sproget. Kilde: genisomai-l2-2026-08-24.html. note_wording ER note (BRIEF-f2-feje.md afsnit 7).',
  },
  {
    tabel: 'applications', noegle: { robot_id: 2208 },
    saet: {
      note_wording: NOTE_EN[2208],
      quote: ['Security patrol', 'Emergency firefighting', 'Research and education', 'Short-distance delivery'],
      quote_wording: ['安防巡逻', '应急消防', '科研教育', '短途配送'],
    },
    change_reason: 'fase 2 (spor/f2-feje): samme rettelse - quote/quote_wording/note_wording var dansk. Kilde: genisomai-l2-2026-08-24.html (delt kilde for hele L2-familien). note_wording ER note (BRIEF-f2-feje.md afsnit 7).',
  },
  {
    tabel: 'applications', noegle: { robot_id: 2209 },
    saet: {
      note_wording: NOTE_EN[2209],
      quote: ['Security patrol', 'Emergency firefighting', 'Research and education', 'Short-distance delivery'],
      quote_wording: ['安防巡逻', '应急消防', '科研教育', '短途配送'],
    },
    change_reason: 'fase 2 (spor/f2-feje): samme rettelse - quote/quote_wording/note_wording var dansk. Kilde: genisomai-l2-2026-08-24.html (delt kilde for hele L2-familien). note_wording ER note (BRIEF-f2-feje.md afsnit 7).',
  },
  {
    tabel: 'applications', noegle: { robot_id: 2210 },
    saet: {
      note_wording: NOTE_EN[2210],
      quote: [
        'GENISOM Qiuqiu SP1 is an explosion-proof quadruped inspection robot for high-risk industrial environments such as petrochemicals and energy stations',
        'Autonomous inspection, data transmission, zero personnel risk',
      ],
      quote_wording: [
        '智身铅球 SP1 是面向石油化工、能源场站等高危工业环境的防爆四足巡检机器人',
        '自主巡检 数据回传 人员零涉险',
      ],
    },
    change_reason: 'fase 2 (spor/f2-feje): quote/quote_wording/note_wording var dansk. Kilde: genisomai-sp1-2026-08-24.html (meta description + markedsfoeringsoverskrift). note_wording ER note (BRIEF-f2-feje.md afsnit 7).',
  },
  {
    tabel: 'applications', noegle: { robot_id: 2211 },
    saet: {
      note_wording: NOTE_EN[2211],
      quote: ['Forest firefighting', 'Petrochemical firefighting', 'Power-grid inspection', 'Site patrol', 'Logistics transport'],
      quote_wording: ['森林消防', '石化消防', '电力巡检', '园区巡逻', '物流运输'],
    },
    change_reason: 'fase 2 (spor/f2-feje): quote/quote_wording/note_wording var dansk. Kilde: genisomai-m1-2026-08-24.html. note_wording ER note (BRIEF-f2-feje.md afsnit 7).',
  },
  {
    tabel: 'applications', noegle: { robot_id: 2212 },
    saet: {
      note_wording: NOTE_EN[2212],
      quote: ['Forest firefighting', 'Petrochemical firefighting', 'Power-grid inspection', 'Site patrol', 'Logistics transport'],
      quote_wording: ['森林消防', '石化消防', '电力巡检', '园区巡逻', '物流运输'],
    },
    change_reason: 'fase 2 (spor/f2-feje): quote/quote_wording/note_wording var dansk. Kilde: genisomai-m1-2026-08-24.html (delt for hele M1-familien). note_wording ER note (BRIEF-f2-feje.md afsnit 7).',
  },
  {
    tabel: 'applications', noegle: { robot_id: 2213 },
    saet: {
      note_wording: NOTE_EN[2213],
      quote: ['Forest firefighting', 'Petrochemical firefighting', 'Power-grid inspection', 'Site patrol', 'Logistics transport'],
      quote_wording: ['森林消防', '石化消防', '电力巡检', '园区巡逻', '物流运输'],
    },
    change_reason: 'fase 2 (spor/f2-feje): quote/quote_wording/note_wording var dansk. Kilde: genisomai-m1-2026-08-24.html (delt for hele M1-familien). note_wording ER note (BRIEF-f2-feje.md afsnit 7).',
  },
];

// Optaeller celletallet, jf. briefets facit (49 = 9 note_wording + 20 quote + 20 quote_wording).
let noteWordingN = 0, quoteN = 0, quoteWordingN = 0;
for (const p of poster) {
  noteWordingN += 1;
  quoteN += Array.isArray(p.saet.quote) ? p.saet.quote.length : 1;
  quoteWordingN += Array.isArray(p.saet.quote_wording) ? p.saet.quote_wording.length : 1;
}
console.log(`note_wording: ${noteWordingN} (forventer 9) · quote: ${quoteN} (forventer 20) · quote_wording: ${quoteWordingN} (forventer 20)`);

if (process.argv.includes('--skriv-fil')) {
  const ud = path.join(ROD, 'fund/f2feje-genisom-opdateringer.json');
  fs.writeFileSync(ud, JSON.stringify(poster, null, 2), 'utf8');
  console.log(`Skrevet: ${ud}`);
}
