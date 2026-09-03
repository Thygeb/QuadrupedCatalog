#!/usr/bin/env node
// fund/f2han-verificer.mjs — spor/f2han: efterproever change_log mod
// briefets acceptkriterier 3 og 4. LAeS-KUN, skriver aldrig.
import { laesForbindelse, hentRobotter } from '../db/fase2-tjek.mjs';

const { url, headers } = laesForbindelse();
const svar = await fetch(
  `${url}/rest/v1/change_log?changed_by=eq.spor%2Ff2han&table_name=eq.field_entries&select=id,row_key,operation,changed_by,reason,old_row`,
  { headers },
);
if (!svar.ok) throw new Error(`GET change_log fejlede: ${svar.status} ${await svar.text()}`);
const raekker = await svar.json();

console.log(`change_log raekker med changed_by='spor/f2han': ${raekker.length} (forventer <=43)`);

// Kolonner der IKKE er tekstkolonner i field_entries (talbaerende/andet) —
// listet fra db/skema.sql's field_entries-definition, til at bevise at
// INGEN af dem er blandt de KUN to felter, vi rørte.
const robotter = await hentRobotter();
const robotIdSet = new Set(robotter.map((r) => r.id));

// Hent de NUVAeRENDE raekker for de beroerte noegler, og sammenlign old_row's
// talkolonner mod nuvaerende (skal vaere ens, da vi kun sendte caveat/caveat_wording).
const talkolonner = ['value_number', 'minimum', 'maximum', 'value_bool', 'imperial_value'];
let talAendret = 0;
const producentSet = new Set();
const beroerteRobotIds = [...new Set(raekker.map((r) => r.row_key.robot_id))];
const feResp = await fetch(
  `${url}/rest/v1/field_entries?robot_id=in.(${beroerteRobotIds.join(',')})&select=robot_id,field_name,${talkolonner.join(',')}`,
  { headers },
);
const feNu = await feResp.json();
console.log(`field_entries hentet for beroerte robotter: ${feNu.length} (forventer >= ${raekker.length})`);
const feMap = new Map(feNu.map((f) => [`${f.robot_id}:${f.field_name}`, f]));

for (const r of raekker) {
  const noegle = `${r.row_key.robot_id}:${r.row_key.field_name}`;
  const nu = feMap.get(noegle);
  const gammel = r.old_row;
  for (const k of talkolonner) {
    if (JSON.stringify(nu?.[k]) !== JSON.stringify(gammel?.[k])) {
      console.log(`  TALAeNDRING: ${noegle} kolonne ${k}: ${JSON.stringify(gammel?.[k])} -> ${JSON.stringify(nu?.[k])}`);
      talAendret++;
    }
  }
  const rob = robotter.find((x) => x.id === r.row_key.robot_id);
  if (rob) producentSet.add(rob.manufacturer);
}

console.log(`Raekker med aendret talkolonne: ${talAendret} (forventer 0)`);
console.log(`Producenter beroert: ${JSON.stringify([...producentSet].sort())}`);
console.log(`Robot-id'er beroert: ${JSON.stringify([...new Set(raekker.map((r) => r.row_key.robot_id))].sort((a, b) => a - b))}`);

const forventedeProducenter = ['Astrall Dynamics', 'CVTE', 'Galileo (Tianjin)', 'GENISOM AI', 'MicroRoboTech', 'Xiaomi', 'Yuejia Lingdong', 'Yufan Intelligent'];
const uventede = [...producentSet].filter((p) => !forventedeProducenter.includes(p));
console.log(`Uventede producenter (forventer tom liste): ${JSON.stringify(uventede)}`);

process.exitCode = 0;
