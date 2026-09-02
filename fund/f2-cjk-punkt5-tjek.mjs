#!/usr/bin/env node
/**
 * fund/f2-cjk-punkt5-tjek.mjs — spor/f2-cjk's efterprøvning af BRIEF-f2-cjk.md
 * punkt 5(a) og 5(b):
 *   (a) alle field_entries/applications/robots-kolonner UNDTAGEN tekst-
 *       feltrene (caveat, caveat_wording, note, notes, notes_wording,
 *       collected_by, change_reason) skal være UÆNDREDE mod
 *       fund/snapshot-foer-f2-cjk.json (hentet FØR sporets første skriv).
 *   (b) change_log-rækker for 2186/2258 EFTER skrivningen, med den
 *       nødvendige nøgle-forskel: robots-tabellens row_key bruger "id",
 *       de fire andre tabeller bruger "robot_id" (log_change() i
 *       db/skema.sql) — begge tjekkes.
 *
 * Kør: node fund/f2-cjk-punkt5-tjek.mjs
 */
import fs from 'node:fs';
function laesDotEnv(fil) {
  for (const linje of fs.readFileSync(fil, 'utf8').split(/\r?\n/)) {
    const t = linje.trim();
    if (!t || t.startsWith('#')) continue;
    const m = t.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!m) continue;
    process.env[m[1]] = m[2].trim();
  }
}
laesDotEnv('.env');
const U = process.env.SUPABASE_URL;
const K = process.env.SUPABASE_SERVICE_ROLE_KEY;
const H = { apikey: K, Authorization: `Bearer ${K}` };

const foer = JSON.parse(fs.readFileSync('fund/snapshot-foer-f2-cjk.json', 'utf8'));

const feEfter = await fetch(`${U}/rest/v1/field_entries?robot_id=in.(2186,2258)&select=*&order=robot_id,field_name`, { headers: H }).then(r => r.json());
const apEfter = await fetch(`${U}/rest/v1/applications?robot_id=in.(2186,2258)&select=*`, { headers: H }).then(r => r.json());
const roEfter = await fetch(`${U}/rest/v1/robots?id=in.(2186,2258)&select=*`, { headers: H }).then(r => r.json());

const UNDTAGET_FE = new Set(['caveat', 'caveat_wording', 'collected_by', 'change_reason']);
const UNDTAGET_AP = new Set(['note', 'collected_by', 'change_reason']);
const UNDTAGET_RO = new Set(['notes', 'notes_wording', 'collected_by', 'change_reason']);

let uventedeDiffs = 0;

function sammenlignRaekker(foerListe, efterListe, noegle, undtaget, label) {
  const foerMap = new Map(foerListe.map(r => [noegle(r), r]));
  const efterMap = new Map(efterListe.map(r => [noegle(r), r]));
  for (const [k, foerR] of foerMap) {
    const efterR = efterMap.get(k);
    if (!efterR) { console.log(`MANGLER EFTER: ${label} ${k}`); uventedeDiffs++; continue; }
    for (const kol of Object.keys(foerR)) {
      if (undtaget.has(kol)) continue;
      const a = JSON.stringify(foerR[kol]);
      const b = JSON.stringify(efterR[kol]);
      if (a !== b) {
        console.log(`UVENTET DIFF ${label} ${k}.${kol}: FOER=${a} EFTER=${b}`);
        uventedeDiffs++;
      }
    }
  }
}

sammenlignRaekker(foer.fe, feEfter, r => `${r.robot_id}/${r.field_name}`, UNDTAGET_FE, 'field_entries');
sammenlignRaekker(foer.ap, apEfter, r => r.robot_id, UNDTAGET_AP, 'applications');
sammenlignRaekker(foer.ro, roEfter, r => r.id, UNDTAGET_RO, 'robots');

console.log(`\nPunkt 5(a): ${uventedeDiffs} UVENTEDE diffs (uden for caveat/caveat_wording/note/notes/notes_wording/collected_by/change_reason).`);

// 5(b) change_log — VIGTIGT: robots-tabellens row_key bruger noeglen "id",
// ikke "robot_id" (log_change()-triggeren, db/skema.sql), saa den skal
// tjekkes SEPARAT fra de fire andre tabeller.
const clRobotId = await fetch(`${U}/rest/v1/change_log?or=(row_key-%3E%3Erobot_id.eq.2186,row_key-%3E%3Erobot_id.eq.2258)&select=id,table_name,row_key,operation,changed_by`, { headers: H }).then(r => r.json());
const clId = await fetch(`${U}/rest/v1/change_log?table_name=eq.robots&or=(row_key-%3E%3Eid.eq.2186,row_key-%3E%3Eid.eq.2258)&select=id,table_name,row_key,operation,changed_by`, { headers: H }).then(r => r.json());
const cl = [...clRobotId, ...clId];
console.log(`\nPunkt 5(b): change_log raekker for 2186/2258 EFTER skrivning: ${Array.isArray(cl) ? cl.length : cl}`);
if (Array.isArray(cl)) {
  const perTabel = {};
  for (const r of cl) perTabel[r.table_name] = (perTabel[r.table_name] || 0) + 1;
  console.log('  fordelt paa tabel:', perTabel);
  const forkert = cl.filter(r => r.changed_by !== 'spor/f2-cjk');
  console.log(`  raekker hvor changed_by IKKE er 'spor/f2-cjk': ${forkert.length}`);
}
