/**
 * prototype/kontrast-system.mjs
 *
 * Maaler WCAG 2.1-kontrastforhold for assets/system.css' palet.
 * Tallene i prototype/system.html skal komme HERFRA, ikke fra et skoen.
 *
 * Koeres med:
 *   "/c/Program Files/nodejs/node.exe" prototype/kontrast-system.mjs
 *   "/c/Program Files/nodejs/node.exe" prototype/kontrast-system.mjs --html
 *
 * --html udskriver raekkerne som HTML-tabelrum, saa system.html kan holdes
 * i takt med maalingen uden at nogen skriver et tal af i haanden.
 *
 * Krav:
 *   TEKST   4,5 : 1   WCAG 1.4.3 AA, normal tekst
 *   STOR    3,0 : 1   WCAG 1.4.3 AA, >= 24 px, eller >= 18,66 px fed
 *   GRAFIK  3,0 : 1   WCAG 1.4.11, linjer og former der BAERER betydning
 *   DEKOR   -         rent dekorative flader. Taget med, saa de ikke gemmes vaek.
 *
 * Ingen afhaengigheder.
 */

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
const forhold = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

export const P = {
  bund:     '#F2F3F5',
  panel:    '#FFFFFF',
  panelRo:  '#F7F8FA',
  tom:      '#EDEFF2',
  blaek:    '#14161A',
  blaek2:   '#4A515C',
  blaek3:   '#5A626E',
  accent:   '#0D5C86',
  accentRo: '#E7F0F6',
  linje:    '#E3E5E9',
  hegn:     '#7C8695',
  fod:      '#14161A',
  paafod:   '#E6E9EE',
  paafod2:  '#B9C0CA',
  hvid:     '#FFFFFF',
  kortkant: '#CFD4DB',
};

/** [hvad, forgrund, baggrund, krav] — krav 0 betyder rent dekorativt. */
export const PAR = [
  // --- TEKST paa sidens bund
  ['Broedtekst paa sidens bund',            P.blaek,   P.bund,    4.5],
  ['Sekundaer tekst paa sidens bund',       P.blaek2,  P.bund,    4.5],
  ['Etiket og smaatryk paa sidens bund',    P.blaek3,  P.bund,    4.5],
  ['Link paa sidens bund',                  P.accent,  P.bund,    4.5],
  // --- TEKST paa hvidt panel
  ['Broedtekst paa hvidt panel',            P.blaek,   P.panel,   4.5],
  ['Sekundaer tekst paa hvidt panel',       P.blaek2,  P.panel,   4.5],
  ['Etiket og smaatryk paa hvidt panel',    P.blaek3,  P.panel,   4.5],
  ['Link paa hvidt panel',                  P.accent,  P.panel,   4.5],
  // --- TEKST paa de roligere flader
  ['Sekundaer tekst paa roligt indfelt',    P.blaek2,  P.panelRo, 4.5],
  ['Maerkets tekst paa roligt indfelt',     P.blaek2,  P.panelRo, 4.5],
  ['"ikke oplyst" paa daempet felt',        P.blaek3,  P.tom,     4.5],
  ['Grund i den tomme billedplade',         P.blaek2,  P.tom,     4.5],
  ['Overskrift i den tomme billedplade',    P.blaek,   P.tom,     4.5],
  ['Valgt filter: hvid paa accent',         P.hvid,    P.accent,  4.5],
  ['Accenttekst paa accentens rolige flade',P.accent,  P.accentRo,4.5],
  ['Videre-knap: hvid paa blaek',           P.hvid,    P.blaek,   4.5],
  // --- TEKST paa den moerke flade
  ['Billednotens broedtekst',               P.paafod,  P.fod,     4.5],
  ['Billednotens maerke',                   P.paafod,  P.fod,     4.5],
  ['Sidefodens broedtekst',                 P.paafod2, P.fod,     4.5],
  ['Sidefodens haarde linje',               P.hvid,    P.fod,     4.5],
  // --- STOR TEKST (nogletalsstribens figurer, 29 px fed; kortnavnet 22 px fed)
  ['Stribens figur paa hvidt panel',        P.blaek,   P.panel,   3.0],
  ['Stribens enhed paa hvidt panel',        P.blaek2,  P.panel,   3.0],
  ['Kortets navn paa hvidt panel',          P.blaek,   P.panel,   3.0],
  ['Hero paa sidens bund',                  P.blaek,   P.bund,    3.0],
  // --- GRAFIK der baerer betydning
  ['Stiplet hegn om et hul, mod panel',     P.hegn,    P.panel,   3.0],
  ['Stiplet hegn om et hul, mod hullet',    P.hegn,    P.tom,     3.0],
  ['Stiplet hegn, mod sidens bund',         P.hegn,    P.bund,    3.0],
  ['Ikon i en OPLYST celle',                P.accent,  P.panel,   3.0],
  ['Ikon i et HUL',                         P.hegn,    P.panel,   3.0],
  ['Udfyldt firkant ved NEJ',               P.blaek,   P.panel,   3.0],
  ['Soegefeltets kant',                     P.hegn,    P.panel,   3.0],
  ['Soegefeltets kant, mod sidens bund',    P.hegn,    P.bund,    3.0],
  ['Fokusring mod sidens bund',             P.accent,  P.bund,    3.0],
  ['Fokusring mod hvidt panel',             P.accent,  P.panel,   3.0],
  ['Fokusring paa den moerke flade',        P.paafod,  P.fod,     3.0],
  ['Statusmaerke, udgaaet: hegn mod tom',   P.hegn,    P.tom,     3.0],
  ['Kildemaerke, primaer, mod panel',       P.accent,  P.panel,   4.5],
  ['Kildemaerke, sekundaer, mod panel',     P.blaek3,  P.panel,   4.5],
  ['Kildemaerkets stiplede hegn',           P.hegn,    P.panel,   3.0],
  ['Kildelistens tekst mod panel',          P.blaek3,  P.panel,   4.5],
  ['Billedmaerke paa fotografiet',          P.blaek3,  P.panel,   4.5],
  ['Billedmaerkets stiplede hegn',          P.hegn,    P.panel,   3.0],
  ['Tom plades skravering mod tom plade',   P.hegn,    P.tom,     3.0],
  // --- DEKOR: intet krav, men vist saa det ikke gemmes vaek
  ['Haarfin skillelinje mod hvid',          P.linje,   P.panel,   0],
  ['Haarfin skillelinje mod sidens bund',   P.linje,   P.bund,    0],
  ['Kortets kant ved hover',                P.kortkant,P.panel,   0],
  ['Hvidt panel mod sidens bund',           P.panel,   P.bund,    0],
  ['Daempet felt mod hvidt panel',          P.tom,     P.panel,   0],
];

const maal = PAR.map(([hvad, fg, bg, krav]) => {
  const v = forhold(fg, bg);
  return { hvad, fg, bg, krav, v, ok: krav === 0 ? null : v >= krav };
});

const komma = (n) => n.toFixed(2).replace('.', ',');

const direkte = !!process.argv[1] && /kontrast-system\.mjs$/.test(process.argv[1]);

if (!direkte) {
  // importeret af tjek-system.mjs: eksportér tallene, skriv ingen rapport.
} else if (process.argv.includes('--html')) {
  for (const m of maal) {
    const d = m.krav === 0 ? 'dekor' : (m.ok ? 'ok' : 'fald');
    const k = m.krav === 0 ? 'intet krav' : komma(m.krav) + ':1';
    console.log(
      `<tr class="m-${d}"><th scope="row">${m.hvad}</th>` +
      `<td><span class="proeve" style="background:${m.bg};color:${m.fg}">Aa</span> ` +
      `<code>${m.fg}</code> paa <code>${m.bg}</code></td>` +
      `<td class="figur">${komma(m.v)}:1</td><td class="figur">${k}</td>` +
      `<td>${m.krav === 0 ? '—' : (m.ok ? 'bestaaet' : 'FALDER')}</td></tr>`
    );
  }
} else {
  const bred = Math.max(...maal.map((m) => m.hvad.length));
  for (const m of maal) {
    const k = m.krav === 0 ? '  dekor  ' : komma(m.krav) + ':1  ';
    const d = m.krav === 0 ? '' : (m.ok ? 'ok' : '<<< FALDER');
    console.log(`${m.hvad.padEnd(bred)}  ${komma(m.v).padStart(6)}:1   krav ${k} ${d}`);
  }
  const medKrav = maal.filter((m) => m.krav > 0);
  const faldne = medKrav.filter((m) => !m.ok);
  const tekst = medKrav.filter((m) => m.krav === 4.5);
  const grafik = medKrav.filter((m) => m.krav === 3.0);
  console.log('');
  console.log(`MAALT ${maal.length} par i alt.`);
  console.log(`  ${medKrav.length} med krav: ${tekst.length} tekstpar (4,5:1) + ${grafik.length} store/grafiske par (3,0:1).`);
  console.log(`  ${maal.length - medKrav.length} rent dekorative par uden krav.`);
  console.log(`  ${faldne.length} under kravet.`);
  if (faldne.length) for (const m of faldne) console.log(`    FALDER: ${m.hvad} — ${komma(m.v)}:1`);
  console.log('');
  console.log('Kontrolmaaling af det forslag, der IKKE blev brugt:');
  console.log(`  #6B7280 paa sidens bund #F2F3F5 = ${komma(forhold('#6B7280', P.bund))}:1  (krav 4,5 — falder)`);
  console.log(`  #6B7280 paa hvidt panel #FFFFFF = ${komma(forhold('#6B7280', P.panel))}:1  (krav 4,5 — bestaar)`);
  console.log(`  ${P.blaek3} er valgt i stedet: ${komma(forhold(P.blaek3, P.bund))}:1 og ${komma(forhold(P.blaek3, P.panel))}:1`);
}
