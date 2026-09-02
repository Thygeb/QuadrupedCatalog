#!/usr/bin/env node
/**
 * fund/f2-cjk-utf8tjek.mjs — spor/f2-cjk's UTF-8-rundtur-efterprøvning
 * (BRIEF-f2-cjk.md punkt 4, krav 5): "Send CJK som UTF-8 og efterprøv det
 * bagefter. Hent rækken tilbage og sammenlign tegn for tegn med det, du
 * sendte."
 *
 * Genbruger NØJAGTIG samme data som db/f2-cjk-skriv.mjs (importeret, ikke
 * kopieret) — to afskrifter af "hvad jeg sendte" kan skride fra hinanden,
 * én kan ikke. Kør: node fund/f2-cjk-utf8tjek.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

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

const skrivModulUrl = 'file:///' + path.resolve('db/f2-cjk-skriv.mjs').replace(/\\/g, '/');
const { FIELD_ENTRIES, APPLICATIONS, ROBOTS_2258_NOTES, ROBOTS_2258_NOTES_WORDING } = await import(skrivModulUrl);

let tjekket = 0;
let fejl = 0;

function sammenlign(mærke, sendt, hentet) {
  tjekket++;
  if (sendt === hentet) return;
  fejl++;
  console.log(`MISMATCH ${mærke}`);
  console.log(`  sendt : ${JSON.stringify(sendt)}`);
  console.log(`  hentet: ${JSON.stringify(hentet)}`);
  // Tegn-for-tegn diff for de foerste 3 uoverensstemmelser.
  const min = Math.min(sendt?.length ?? 0, hentet?.length ?? 0);
  for (let i = 0; i < min; i++) {
    if (sendt[i] !== hentet[i]) {
      console.log(`  foerste forskel ved position ${i}: sendt=${JSON.stringify(sendt[i])} (U+${sendt.codePointAt(i).toString(16)}) hentet=${JSON.stringify(hentet[i])} (U+${hentet.codePointAt(i).toString(16)})`);
      break;
    }
  }
}

const fe = await fetch(`${U}/rest/v1/field_entries?robot_id=in.(2186,2258)&select=robot_id,field_name,caveat,caveat_wording`, { headers: H }).then(r => r.json());
const feMap = new Map(fe.map(r => [`${r.robot_id}/${r.field_name}`, r]));
for (const planlagt of FIELD_ENTRIES) {
  const hentet = feMap.get(`${planlagt.robot_id}/${planlagt.field_name}`);
  sammenlign(`field_entries ${planlagt.robot_id}/${planlagt.field_name}.caveat`, planlagt.caveat, hentet?.caveat);
  sammenlign(`field_entries ${planlagt.robot_id}/${planlagt.field_name}.caveat_wording`, planlagt.caveat_wording, hentet?.caveat_wording);
}

const ap = await fetch(`${U}/rest/v1/applications?robot_id=in.(2186,2258)&select=robot_id,note`, { headers: H }).then(r => r.json());
const apMap = new Map(ap.map(r => [r.robot_id, r]));
for (const planlagt of APPLICATIONS) {
  sammenlign(`applications ${planlagt.robot_id}.note`, planlagt.note, apMap.get(planlagt.robot_id)?.note);
}

const ro = await fetch(`${U}/rest/v1/robots?id=eq.2258&select=id,notes,notes_wording`, { headers: H }).then(r => r.json());
ROBOTS_2258_NOTES.forEach((n, i) => sammenlign(`robots 2258.notes[${i}]`, n, ro[0].notes[i]));
ROBOTS_2258_NOTES_WORDING.forEach((n, i) => sammenlign(`robots 2258.notes_wording[${i}]`, n, ro[0].notes_wording[i]));

console.log(`\nUTF-8 rundtur-efterproevning: ${tjekket} strenge sammenlignet tegn-for-tegn (JSON string equality), ${fejl} mismatch.`);
