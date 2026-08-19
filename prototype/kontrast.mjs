// Maaler WCAG 2.1 kontrastforhold for prototypens farvepar.
// Koeres med:  "/c/Program Files/nodejs/node.exe" prototype/kontrast.mjs
// Ingen afhaengigheder. Tallene i rapporten skal komme herfra, ikke fra et skoen.
//
// Tre klasser, tre krav:
//   TEKST     krav 4.5:1  (WCAG 1.4.3 AA, normal tekst)
//   STOR      krav 3.0:1  (WCAG 1.4.3 AA, >=24px eller >=19px fed)
//   GRAFIK    krav 3.0:1  (WCAG 1.4.11, grafiske objekter noedvendige for forstaaelsen,
//                          samt fokusring og formularkantlinjer)
//   DEKOR     intet krav  (WCAG 1.4.11 undtager rent dekorative flader). Tages med for
//                          aabenhedens skyld -- de tal maa ikke gemmes vaek.

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

// --- Retning A: Maaleblad (lyst) ---
const A = {
  ground: '#F7F5F0',
  panel: '#FFFFFF',
  advarselsflade: '#FBF3DE',
  ink: '#15181C',
  ink2: '#41474F',
  ink3: '#5C646E',
  ruleStruktur: '#847F73',
  ruleDekor: '#D8D3C8',
  link: '#0E3FA8',
  advarsel: '#7A3D00',
  konflikt: '#8C1414',
  billede: '#0B4F57',
};

// --- Retning B: Instrument (moerkt) ---
const B = {
  ground: '#0B0E12',
  panel: '#141A21',
  panel2: '#1B222B',
  ink: '#EEF2F6',
  ink2: '#AEB9C5',
  ink3: '#8994A1',
  ruleStruktur: '#606D7C',
  ruleDekor: '#2A323C',
  signal: '#F5A623',
  link: '#6CC7DC',
  advarsel: '#FFB454',
  konflikt: '#FF8A80',
  billede: '#7FD4C1',
};

const par = [
  // ---------- Retning A ----------
  ['A', 'TEKST', 'ink / ground', A.ink, A.ground, 'brodtekst'],
  ['A', 'TEKST', 'ink / panel', A.ink, A.panel, 'tal i tabel'],
  ['A', 'TEKST', 'ink2 / ground', A.ink2, A.ground, 'sekundaer tekst'],
  ['A', 'TEKST', 'ink2 / panel', A.ink2, A.panel, 'tilstand "nej"'],
  ['A', 'TEKST', 'ink3 / ground', A.ink3, A.ground, 'etiketter, meta'],
  ['A', 'TEKST', 'ink3 / panel', A.ink3, A.panel, 'tilstand "ikke oplyst"'],
  ['A', 'TEKST', 'link / ground', A.link, A.ground, 'links'],
  ['A', 'TEKST', 'link / panel', A.link, A.panel, 'links i tabel'],
  ['A', 'TEKST', 'advarsel / ground', A.advarsel, A.ground, 'advarselstekst'],
  ['A', 'TEKST', 'advarsel / panel', A.advarsel, A.panel, 'advarselstekst'],
  ['A', 'TEKST', 'advarsel / advarselsflade', A.advarsel, A.advarselsflade, 'advarselsboks'],
  ['A', 'TEKST', 'ink / advarselsflade', A.ink, A.advarselsflade, 'advarselsboks'],
  ['A', 'TEKST', 'konflikt / ground', A.konflikt, A.ground, 'kildekonflikt'],
  ['A', 'TEKST', 'konflikt / panel', A.konflikt, A.panel, 'kildekonflikt'],
  ['A', 'TEKST', 'billede / ground', A.billede, A.ground, 'tilstand "kun som billede"'],
  ['A', 'TEKST', 'billede / panel', A.billede, A.panel, 'tilstand "kun som billede"'],
  ['A', 'GRAFIK', 'ruleStruktur / ground', A.ruleStruktur, A.ground, 'kolonnelinjer, felthegn'],
  ['A', 'GRAFIK', 'ruleStruktur / panel', A.ruleStruktur, A.panel, 'maalerens omrids + skravering'],
  ['A', 'GRAFIK', 'ink / panel', A.ink, A.panel, 'maalerens fyldte segment'],
  ['A', 'GRAFIK', 'link / ground', A.link, A.ground, 'fokusring'],
  ['A', 'GRAFIK', 'link / panel', A.link, A.panel, 'afkrydsningsfelt, valgt'],
  ['A', 'DEKOR', 'ruleDekor / ground', A.ruleDekor, A.ground, 'lette skillelinjer'],
  ['A', 'DEKOR', 'panel / ground', A.panel, A.ground, 'fladeskel (ogsaa markeret med linje)'],

  ['A', 'TEKST', 'ink / haevet citat', A.ink, '#EFEDE7', 'ordret citat i bevisblok'],
  ['A', 'TEKST', 'ink3 / raekke-hover', A.ink3, '#FAF9F6', 'tilstandstekst paa hoveret raekke'],
  ['A', 'TEKST', 'ink2 / raekke-hover', A.ink2, '#FAF9F6', 'tekst paa hoveret raekke'],
  ['A', 'TEKST', 'ink / understregning', A.ink, '#D8D3C8', 'fremhaevet ord i overskrift'],
  ['A', 'TEKST', 'chiptal / valgt chip', '#BFC4CB', A.ink, 'antal i valgt filterchip'],
  ['A', 'TEKST', 'panel / ink', A.panel, A.ink, 'knaptekst og prototypebaand'],
  ['B', 'TEKST', 'konflikt / ground', B.konflikt, B.ground, 'nul-gruppe i feltkortet'],
  ['B', 'TEKST', 'advarsel / ground', B.advarsel, B.ground, 'advarselstekst paa bund'],
  ['B', 'TEKST', 'billede / ground', B.billede, B.ground, 'tilstand kun som billede'],
  ['B', 'TEKST', 'ground / signal', B.ground, B.signal, 'tekst paa signalflade'],
  // Parret ruleStruktur/signal (2,61:1) FANDTES og faldt igennem: rammen om maaleren
  // stoedte op ad det gule fyld. Ingen enkelt rammefarve kan klare 3:1 mod baade panel
  // og signal, saa rammen tegnes nu som inset-skygge under fyldet. Parret optraeder
  // ikke laengere paa skaermen. De to kanter der er tilbage, staar herunder.
  ['B', 'GRAFIK', 'signal / ground', B.signal, B.ground, 'fyldets kant mod baggrund'],
  ['B', 'GRAFIK', 'ruleStruktur / panel (tom del)', B.ruleStruktur, B.panel, 'rammen om den tomme del'],

  // ---------- Retning B ----------
  ['B', 'TEKST', 'ink / ground', B.ink, B.ground, 'brodtekst'],
  ['B', 'TEKST', 'ink / panel', B.ink, B.panel, 'tal i panel'],
  ['B', 'TEKST', 'ink / panel2', B.ink, B.panel2, 'tal i raekke'],
  ['B', 'TEKST', 'ink2 / ground', B.ink2, B.ground, 'sekundaer tekst'],
  ['B', 'TEKST', 'ink2 / panel', B.ink2, B.panel, 'tilstand "nej"'],
  ['B', 'TEKST', 'ink3 / ground', B.ink3, B.ground, 'etiketter, meta'],
  ['B', 'TEKST', 'ink3 / panel', B.ink3, B.panel, 'tilstand "ikke oplyst"'],
  ['B', 'TEKST', 'ink3 / panel2', B.ink3, B.panel2, 'tilstand "ikke oplyst"'],
  ['B', 'TEKST', 'signal / ground', B.signal, B.ground, 'noegletal'],
  ['B', 'TEKST', 'signal / panel', B.signal, B.panel, 'noegletal'],
  ['B', 'TEKST', 'link / ground', B.link, B.ground, 'links'],
  ['B', 'TEKST', 'link / panel', B.link, B.panel, 'links'],
  ['B', 'TEKST', 'advarsel / panel', B.advarsel, B.panel, 'advarselstekst'],
  ['B', 'TEKST', 'konflikt / panel', B.konflikt, B.panel, 'kildekonflikt'],
  ['B', 'TEKST', 'billede / panel', B.billede, B.panel, 'tilstand "kun som billede"'],
  ['B', 'TEKST', 'billede / panel2', B.billede, B.panel2, 'tilstand "kun som billede"'],
  ['B', 'GRAFIK', 'ruleStruktur / panel', B.ruleStruktur, B.panel, 'maalerens tomme segment (omrids)'],
  ['B', 'GRAFIK', 'ruleStruktur / panel2', B.ruleStruktur, B.panel2, 'kolonnelinjer'],
  ['B', 'GRAFIK', 'ruleStruktur / ground', B.ruleStruktur, B.ground, 'felthegn'],
  ['B', 'GRAFIK', 'signal / panel', B.signal, B.panel, 'maalerens fyldte segment'],
  ['B', 'GRAFIK', 'signal / panel2', B.signal, B.panel2, 'maalerens fyldte segment'],
  ['B', 'GRAFIK', 'link / ground', B.link, B.ground, 'fokusring'],
  ['B', 'GRAFIK', 'link / panel', B.link, B.panel, 'afkrydsningsfelt, valgt'],
  ['B', 'DEKOR', 'ruleDekor / panel', B.ruleDekor, B.panel, 'lette skillelinjer'],
  ['B', 'DEKOR', 'panel / ground', B.panel, B.ground, 'fladeskel (ogsaa markeret med linje)'],
];

const KRAV = { TEKST: 4.5, STOR: 3, GRAFIK: 3, DEKOR: 0 };

let underAA = 0, underGrafik = 0, dekor = 0;
const raekker = par.map(([ret, klasse, navn, fg, bg, brug]) => {
  const r = ratio(fg, bg);
  const krav = KRAV[klasse];
  const ok = r >= krav;
  if (klasse === 'TEKST' && !ok) underAA++;
  if (klasse === 'GRAFIK' && !ok) underGrafik++;
  if (klasse === 'DEKOR') dekor++;
  return { ret, klasse, navn, fg, bg, brug, r, krav, ok };
});

const w = (s, n) => String(s).padEnd(n);
console.log(w('RET', 4) + w('KLASSE', 8) + w('PAR', 28) + w('FG', 10) + w('BG', 10) + w('RATIO', 8) + w('KRAV', 6) + w('STATUS', 8) + 'BRUG');
console.log('-'.repeat(126));
for (const x of raekker) {
  console.log(
    w(x.ret, 4) + w(x.klasse, 8) + w(x.navn, 28) + w(x.fg, 10) + w(x.bg, 10) +
    w(x.r.toFixed(2), 8) + w(x.krav ? x.krav.toFixed(1) : '--', 6) +
    w(x.klasse === 'DEKOR' ? 'DEKOR' : (x.ok ? 'OK' : 'FEJL'), 8) + x.brug
  );
}
console.log('-'.repeat(126));
const tekst = raekker.filter((x) => x.klasse === 'TEKST').length;
const grafik = raekker.filter((x) => x.klasse === 'GRAFIK').length;
console.log(`Maalt ${raekker.length} kontrastforhold.`);
console.log(`  ${tekst} tekstpar   krav 4.5:1 -> ${underAA} under AA.`);
console.log(`  ${grafik} grafikpar  krav 3.0:1 -> ${underGrafik} under 3:1.`);
console.log(`  ${dekor} dekorative par uden krav (WCAG 1.4.11 undtager dem). Laveste: ` +
  raekker.filter((x) => x.klasse === 'DEKOR').map((x) => x.r.toFixed(2)).sort()[0]);
console.log(`SUM: ${underAA + underGrafik} af ${tekst + grafik} kravbelagte par under AA.`);
