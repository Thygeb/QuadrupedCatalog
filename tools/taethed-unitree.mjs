// Tæthedsberegning. Nævneren er omstridt (STATUS.md D7), saa begge opgives.
// 31-listen = DATAMODEL.md efter F1/F2. 29-listen = samme maaling, hvor
// nyttelast_gaaende+staaende kollapser til ét felt og forhindring_enkelt+
// trappetrin_kontinuerlig kollapser til ét felt. Det er den ENESTE forskel.

const F31 = [
  'egenvaegt','maal_staaende','maal_foldet','frihedsgrader',
  'nyttelast_gaaende','nyttelast_staaende','maks_hastighed','maks_haeldning',
  'forhindring_enkelt','trappetrin_kontinuerlig','ip_klasse','driftstemperatur',
  'batteri_wh','driftstid','hot_swap','ladetid','dockingstation',
  'lidar_type_og_model','kameraer','onboard_compute','ros2','sdk_sprog','autonominiveau',
  'monteringsinterface','stroem_ud','dataporte',
  'pris','tilgaengelig_eu','ce_oplyst','servicepunkt_eu','leveringstid',
];

// udfyldte felter pr. model
const M = {
 'B2':      ['egenvaegt','maal_staaende','maal_foldet','nyttelast_gaaende','nyttelast_staaende','maks_hastighed','maks_haeldning','forhindring_enkelt','trappetrin_kontinuerlig','ip_klasse','driftstemperatur','batteri_wh','driftstid','hot_swap','dockingstation','kameraer','onboard_compute','stroem_ud','dataporte'],
 'B2-W':    ['egenvaegt','maal_staaende','maal_foldet','nyttelast_gaaende','nyttelast_staaende','maks_hastighed','maks_haeldning','forhindring_enkelt','trappetrin_kontinuerlig','ip_klasse','driftstemperatur','batteri_wh','onboard_compute'],
 'A2':      ['egenvaegt','maal_staaende','maal_foldet','frihedsgrader','nyttelast_gaaende','nyttelast_staaende','maks_hastighed','maks_haeldning','forhindring_enkelt','trappetrin_kontinuerlig','ip_klasse','driftstemperatur','batteri_wh','driftstid','hot_swap','kameraer','onboard_compute','stroem_ud','dataporte'],
 'A2-W':    ['egenvaegt','maal_staaende','maal_foldet','frihedsgrader','nyttelast_gaaende','nyttelast_staaende','maks_hastighed','maks_haeldning','forhindring_enkelt','trappetrin_kontinuerlig','ip_klasse','driftstemperatur','batteri_wh','driftstid','hot_swap','kameraer','onboard_compute','stroem_ud','dataporte'],
 'As2':     ['egenvaegt','maal_staaende','maal_foldet','frihedsgrader','nyttelast_gaaende','nyttelast_staaende','maks_hastighed','maks_haeldning','forhindring_enkelt','trappetrin_kontinuerlig','ip_klasse','driftstemperatur','batteri_wh','driftstid','dockingstation','lidar_type_og_model','kameraer','onboard_compute','dataporte'],
 'As2-W':   ['egenvaegt','maal_staaende','maal_foldet','frihedsgrader','nyttelast_gaaende','nyttelast_staaende','maks_hastighed','maks_haeldning','forhindring_enkelt','trappetrin_kontinuerlig','ip_klasse','driftstemperatur','batteri_wh','driftstid','dockingstation','kameraer','onboard_compute','dataporte'],
 'Go2':     ['egenvaegt','maal_staaende','maal_foldet','frihedsgrader','nyttelast_gaaende','maks_hastighed','maks_haeldning','forhindring_enkelt','driftstid','dockingstation','lidar_type_og_model','kameraer','onboard_compute','pris'],
 'Go2-W':   ['egenvaegt','maal_staaende','frihedsgrader','nyttelast_gaaende','maks_hastighed','maks_haeldning','forhindring_enkelt','driftstid','kameraer','onboard_compute'],
 'Go1':     ['egenvaegt','maal_foldet','frihedsgrader','nyttelast_gaaende','maks_hastighed','kameraer','onboard_compute','sdk_sprog','pris'],
 'B1':      ['egenvaegt','maal_staaende','maal_foldet','nyttelast_gaaende','nyttelast_staaende','trappetrin_kontinuerlig','ip_klasse','batteri_wh','driftstid','ladetid','kameraer','onboard_compute','stroem_ud','dataporte'],
 'AlienGo': ['egenvaegt','maal_staaende','maal_foldet','frihedsgrader','nyttelast_gaaende','maks_hastighed','maks_haeldning','driftstid','kameraer','sdk_sprog','stroem_ud','dataporte'],
 'A1':      ['nyttelast_gaaende','driftstid','maks_hastighed','kameraer','stroem_ud','dataporte'],
};

const pct = (a, b) => Math.round((a / b) * 100);
console.log('model\tn31\tpct31\tn29\tpct29\tkollaps');
let s31 = 0, s29 = 0;
for (const [m, felter] of Object.entries(M)) {
  for (const f of felter) if (!F31.includes(f)) throw new Error(`${m}: ukendt felt ${f}`);
  if (new Set(felter).size !== felter.length) throw new Error(`${m}: dublet`);
  const n31 = felter.length;
  const kNyt = felter.includes('nyttelast_gaaende') && felter.includes('nyttelast_staaende') ? 1 : 0;
  const kTrin = felter.includes('forhindring_enkelt') && felter.includes('trappetrin_kontinuerlig') ? 1 : 0;
  const n29 = n31 - kNyt - kTrin;
  s31 += n31; s29 += n29;
  console.log(`${m}\t${n31}/31\t${pct(n31,31)} %\t${n29}/29\t${pct(n29,29)} %\t${kNyt + kTrin}`);
}
const n = Object.keys(M).length;
console.log(`\nGennemsnit 31-listen: ${(s31/n).toFixed(1)}/31 = ${pct(s31/n,31)} %`);
console.log(`Gennemsnit 29-listen: ${(s29/n).toFixed(1)}/29 = ${pct(s29/n,29)} %`);

// Feltdaekning paa tvaers: hvilke felter har nul daekning hos alle 12?
console.log('\nfelt\tudfyldt hos N af 12');
for (const f of F31) {
  const c = Object.values(M).filter(v => v.includes(f)).length;
  console.log(`${f}\t${c}`);
}
