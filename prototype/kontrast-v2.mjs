// Maaler WCAG 2.1-kontrastforhold for V2-prototypens farvepar.
// Paletten er bundet af CEO'ens retning 19.08.2026: naesten-sort paa varm raahvid,
// ÉN koelig accent, daempet markering til "ikke oplyst", moerk sidefod. IKKE roed.
//
// Koeres med:  "/c/Program Files/nodejs/node.exe" prototype/kontrast-v2.mjs
// Ingen afhaengigheder. Tallene i rapporten skal komme HERFRA, ikke fra et skoen.
//
//   TEKST   krav 4.5:1  (WCAG 1.4.3 AA, normal tekst)
//   STOR    krav 3.0:1  (WCAG 1.4.3 AA, >=24px, eller >=19px fed)
//   GRAFIK  krav 3.0:1  (WCAG 1.4.11: linjer og former der BAERER betydning, samt fokusring)
//   DEKOR   intet krav  (rent dekorative flader; taget med, saa de ikke gemmes vaek)

const hex = (h) => {
  const s = h.replace('#', '');
  const f = s.length === 3 ? s.split('').map((c) => c + c).join('') : s;
  return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16));
};
const lum = (h) => {
  const [r, g, b] = hex(h).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

export const P = {
  papir:    '#F6F3EC',   // sidens bund: varm raahvid
  kort:     '#FFFFFF',   // kortets bund: rolig hvid, saa fotografiet baerer farven
  blaek:    '#16181A',   // naesten-sort
  blaek2:   '#474D50',
  blaek3:   '#5A6467',
  accent:   '#12556E',   // den ENE koelige accent: links, filtre, valgt tilstand
  daemp:    '#E7E1D5',   // daempet markering: feltet bag "ikke oplyst"
  fod:      '#1B1E20',   // moerk sidefod og det paalagte baand paa fotografiet
  paafod:   '#E9E6DF',
  paafod2:  '#A9B0B2',
  hegn:     '#6D7477',   // haarlinje der baerer betydning (linjal, felthegn)
  hegnL:    '#B9B2A4',   // haarlinje uden betydning (ren dekoration)
  kant:     '#DCD6C8',   // kortets kant, ren dekoration
};

const par = [
  ['TEKST',  'blaek / papir',       P.blaek,   P.papir,  'broedtekst'],
  ['TEKST',  'blaek / kort',        P.blaek,   P.kort,   'robotnavn og tal paa kortet'],
  ['TEKST',  'blaek2 / papir',      P.blaek2,  P.papir,  'sekundaer tekst'],
  ['TEKST',  'blaek2 / kort',       P.blaek2,  P.kort,   'feltetiketter og enheder'],
  ['TEKST',  'blaek3 / papir',      P.blaek3,  P.papir,  'meta'],
  ['TEKST',  'blaek3 / kort',       P.blaek3,  P.kort,   'meta paa kortet'],
  ['TEKST',  'blaek3 / daemp',      P.blaek3,  P.daemp,  'tilstanden "ikke oplyst"'],
  ['TEKST',  'blaek / daemp',       P.blaek,   P.daemp,  'tekst i daempet felt'],
  ['TEKST',  'accent / papir',      P.accent,  P.papir,  'links og filtre'],
  ['TEKST',  'accent / kort',       P.accent,  P.kort,   'links paa kortet'],
  ['TEKST',  'papir / accent',      P.papir,   P.accent, 'tekst i valgt filterknap'],
  ['TEKST',  'papir / blaek',       P.papir,   P.blaek,  'tekst i doerknappen'],
  ['TEKST',  'paafod / fod',        P.paafod,  P.fod,    'tekst i sidefoden og i det paalagte baand'],
  ['TEKST',  'paafod2 / fod',       P.paafod2, P.fod,    'sekundaer tekst i sidefoden'],
  ['TEKST',  'kort / fod',          P.kort,    P.fod,    'robotnavn paa det paalagte baand'],

  ['GRAFIK', 'hegn / papir',        P.hegn,    P.papir,  'vaegtlinjalen og dens ticks'],
  ['GRAFIK', 'hegn / kort',         P.hegn,    P.kort,   'maalestokkens ramme'],
  ['GRAFIK', 'hegn / daemp',        P.hegn,    P.daemp,  'stiplet kant om "ikke oplyst"'],
  ['GRAFIK', 'blaek / kort',        P.blaek,   P.kort,   'maalestokkens fyldte del'],
  ['GRAFIK', 'blaek / papir',       P.blaek,   P.papir,  'kortkant og afsnitslinje'],
  ['GRAFIK', 'accent / papir',      P.accent,  P.papir,  'fokusring paa papir'],
  ['GRAFIK', 'accent / kort',       P.accent,  P.kort,   'fokusring paa kort'],
  ['GRAFIK', 'paafod / fod',        P.paafod,  P.fod,    'fokusring paa moerkt baand'],
  ['GRAFIK', 'fod / kort',          P.fod,     P.kort,   'det paalagte baands kant'],

  ['DEKOR',  'kort / papir',        P.kort,    P.papir,  'kortfladen mod siden'],
  ['DEKOR',  'daemp / kort',        P.daemp,   P.kort,   'daempet flade mod kort'],
  ['DEKOR',  'hegnL / papir',       P.hegnL,   P.papir,  'ren dekorativ haarlinje'],
  ['DEKOR',  'kant / papir',        P.kant,    P.papir,  'kortets kant'],
  ['DEKOR',  'kant / kort',         P.kant,    P.kort,   'kortets kant indefra'],
];

const KRAV = { TEKST: 4.5, STOR: 3, GRAFIK: 3, DEKOR: 0 };
const w = (s, n) => String(s).padEnd(n);
let underAA = 0, underGrafik = 0, dekor = 0;
const raekker = par.map(([klasse, navn, fg, bg, brug]) => {
  const r = ratio(fg, bg), krav = KRAV[klasse], ok = r >= krav;
  if (klasse === 'TEKST' && !ok) underAA++;
  if (klasse === 'GRAFIK' && !ok) underGrafik++;
  if (klasse === 'DEKOR') dekor++;
  return { klasse, navn, fg, bg, brug, r, krav, ok };
});
console.log(w('KLASSE', 8) + w('PAR', 22) + w('FG', 10) + w('BG', 10) + w('RATIO', 8) + w('KRAV', 6) + w('STATUS', 8) + 'BRUG');
console.log('-'.repeat(116));
for (const x of raekker) {
  console.log(w(x.klasse, 8) + w(x.navn, 22) + w(x.fg, 10) + w(x.bg, 10) + w(x.r.toFixed(2), 8) +
    w(x.krav ? x.krav.toFixed(1) : '--', 6) + w(x.klasse === 'DEKOR' ? 'DEKOR' : (x.ok ? 'OK' : 'FEJL'), 8) + x.brug);
}
console.log('-'.repeat(116));
const tekst = raekker.filter((x) => x.klasse === 'TEKST').length;
const grafik = raekker.filter((x) => x.klasse === 'GRAFIK').length;
console.log(`Maalt ${raekker.length} kontrastforhold.`);
console.log(`  ${tekst} tekstpar   krav 4.5:1 -> ${underAA} under AA.`);
console.log(`  ${grafik} grafikpar  krav 3.0:1 -> ${underGrafik} under 3:1.`);
console.log(`  ${dekor} dekorative par uden krav. Laveste: ` +
  Math.min(...raekker.filter((x) => x.klasse === 'DEKOR').map((x) => x.r)).toFixed(2));
console.log(`SUM: ${underAA + underGrafik} af ${tekst + grafik} kravbelagte par under kravet.`);
