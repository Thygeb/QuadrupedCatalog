// D14: efterproev klassifikationen mod dist/robots.json (alle 562 forbehold paa
// talfelter skal vaere klassificeret praecis én gang, ingen ekstra, ingen manglende),
// og skriv derefter fund/FUND-d14-klassifikation.md.
import fs from 'node:fs';
import { KLASSIFIKATION_D14 } from './_d14-klassifikation-data.mjs';

const j = JSON.parse(fs.readFileSync('dist/robots.json', 'utf8'));

// Byg det faktiske saet af (slug, felt, tekst) fra det byggede katalog.
const faktiske = new Map(); // key "slug|felt" -> tekst
for (const r of j.robotter) {
  for (const [felt, p] of Object.entries(r.alle_felter || {})) {
    if (p && typeof p === 'object' && p.tilstand === 'tal' && p.forbehold) {
      faktiske.set(`${r.slug}|${felt}`, p.forbehold);
    }
  }
}

// Efterproev 1:1-korrespondance.
const klassNoegler = new Set();
const fejl = [];
for (const [slug, felt, klasse, begrundelse] of KLASSIFIKATION_D14) {
  const noegle = `${slug}|${felt}`;
  if (klassNoegler.has(noegle)) fejl.push(`DUBLET: ${noegle}`);
  klassNoegler.add(noegle);
  if (!faktiske.has(noegle)) fejl.push(`FINDES IKKE I KATALOGET: ${noegle}`);
  if (klasse !== 'G' && klasse !== 'U') fejl.push(`UGYLDIG KLASSE "${klasse}" for ${noegle}`);
  if (!begrundelse || !begrundelse.trim()) fejl.push(`TOM BEGRUNDELSE for ${noegle}`);
}
for (const noegle of faktiske.keys()) {
  if (!klassNoegler.has(noegle)) fejl.push(`UKLASSIFICERET: ${noegle}`);
}

console.log('Faktiske forbehold paa talfelter:', faktiske.size);
console.log('Klassificerede poster:', KLASSIFIKATION_D14.length);
console.log('Fejl fundet:', fejl.length);
if (fejl.length) {
  console.log(fejl.slice(0, 50).join('\n'));
  process.exit(1);
}

// Tael pr. klasse.
const gTal = KLASSIFIKATION_D14.filter(([, , k]) => k === 'G').length;
const uTal = KLASSIFIKATION_D14.filter(([, , k]) => k === 'U').length;

const header = `# FUND-d14-klassifikation.md — gyldighed/uddybning for 562 forbehold paa talfelter

Bygget under spor/noter (27. aug 2026), punkt D14 i briefet. Grundlaget er
\`fund/FUND-forbehold.md\` afsnit 2's seks familier plus D14's egne tre
(modstridende kilder, faktor 10-fejl, proevemaskine-tal). **Alle ${KLASSIFIKATION_D14.length}
forbehold er laest enkeltvis og doemt — ikke fundet med en regex.** Regexernes
99 fra FUND-forbehold.md var en startbunke, ikke et facit; den forkert
klassificerede fjerdedel (11 af 40 i stikproeven) er grunden til, at dette
dokument findes.

**Klassifikationen aendrer INGEN YAML-filer og ingen skabeloner.** Den er
beslutningsgrundlag for JPK's naeste skridt (stjernens to niveauer: gyldighed
faar et synligt maerke, uddybning bliver i \`title\`/tooltip uden maerke).

**Vigtigt om hvilken tekst der er doemt:** punkt Å25b i samme spor omskrev 48 af
disse 562 tekster for at fjerne internt sprog (filnavne, interne feltnavne,
regelnumre), mens meningen blev bevaret. Klassifikationen herunder er dømt paa
den OMSKREVNE tekst — den, en besoegende faktisk ser paa den byggede side —
ikke paa den oprindelige, interne formulering.

**Metodenote ud over ren tekstlaesning:** familie 3 ("ikke sammenligneligt med
naboerne") er for feltet \`driftstid\` krydstjekket STRUKTURELT mod \`ved_last\`
(er en lastbetingelse sat, eller staar den \`ikke_oplyst\`?) i stedet for kun at
lede efter ordene "ingen lastbetingelse" i selve teksten. Begrundelsen: den
reelle sammenlignelighedstrussel er et fakta om DATAEN (mangler feltet en
lastbetingelse, kan det ikke staa i samme kolonne som naboernes), ikke et
spoergsmaal om hvorvidt den enkelte tekst nævner det. 52 af 65 driftstid-poster
mangler \`ved_last\`; alle 52 er klassificeret gyldighed af den grund, uanset
ordlyd. De resterende 13 (som HAR en lastbetingelse) er dømt paa deres egen
tekst, som resten af kataloget.

**Totaler:**

| Klasse | Antal | Andel |
|---|---|---|
| **Gyldighed** (synligt maerke) | ${gTal} | ${(100 * gTal / KLASSIFIKATION_D14.length).toFixed(1)}% |
| **Uddybning** (ingen maerke, kun uddybende tekst) | ${uTal} | ${(100 * uTal / KLASSIFIKATION_D14.length).toFixed(1)}% |

**Fordelt paa familie (gyldighed-posterne, én post kan raemme flere familier —
taellingen her er min egen groft opdelte hovedbegrundelse pr. post, ikke en
udtoemmende krydstabel):**

${byggFamilietabel(KLASSIFIKATION_D14)}

---

| Robot | Felt | Klasse | Begrundelse |
|---|---|---|---|
${KLASSIFIKATION_D14.map(([slug, felt, klasse, begr]) =>
  `| ${slug} | ${felt} | ${klasse === 'G' ? 'gyldighed' : 'uddybning'} | ${begr.replace(/\|/g, '\\|')} |`
).join('\n')}
`;

function byggFamilietabel(rows) {
  const familier = {
    'familie 1 (interval-oevre-ende)': 0,
    'familie 2 (producenten dementerer/proevemaskine-tal)': 0,
    'familie 3 (ikke sammenligneligt)': 0,
    'familie 4 (gaelder serien/en variant)': 0,
    'familie 5 (sammenlagt/umaerket/tolket kolonne)': 0,
    'familie 6 (gaaende/staaende er vores)': 0,
    'modstridende kilder / faktor 10-fejl': 0,
    'andet (svag kilde, prisusikkerhed, tilvalg m.m.)': 0,
  };
  for (const [, , klasse, begr] of rows) {
    if (klasse !== 'G') continue;
    const b = begr.toLowerCase();
    if (b.includes('familie 1') || b.includes('oevre')) familier['familie 1 (interval-oevre-ende)']++;
    else if (b.includes('familie 2') || b.includes('proevemaskine') || b.includes('dementer')) familier['familie 2 (producenten dementerer/proevemaskine-tal)']++;
    else if (b.includes('familie 3') || b.includes('sammenlignel')) familier['familie 3 (ikke sammenligneligt)']++;
    else if (b.includes('familie 4') || b.includes('variant') || b.includes('serien')) familier['familie 4 (gaelder serien/en variant)']++;
    else if (b.includes('familie 5') || b.includes('tolkning') || b.includes('umaerket') || b.includes('sammenlagt')) familier['familie 5 (sammenlagt/umaerket/tolket kolonne)']++;
    else if (b.includes('familie 6') || b.includes('gaaende/staaende')) familier['familie 6 (gaaende/staaende er vores)']++;
    else if (b.includes('modstrid') || b.includes('faktor')) familier['modstridende kilder / faktor 10-fejl']++;
    else familier['andet (svag kilde, prisusikkerhed, tilvalg m.m.)']++;
  }
  return '| Familie | Antal |\n|---|---|\n' +
    Object.entries(familier).map(([k, v]) => `| ${k} | ${v} |`).join('\n');
}

fs.mkdirSync('fund', { recursive: true });
fs.writeFileSync('fund/FUND-d14-klassifikation.md', header, 'utf8');
console.log('\nSkrev fund/FUND-d14-klassifikation.md');
console.log('Gyldighed:', gTal, 'Uddybning:', uTal, 'I alt:', KLASSIFIKATION_D14.length);
