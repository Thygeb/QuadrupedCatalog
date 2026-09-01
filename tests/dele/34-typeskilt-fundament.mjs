/**
 * tests/dele/34-typeskilt-fundament.mjs — spor/fundament, 31. aug 2026.
 *
 * Runde 1 af tre i TYPESKILT-redesignet (L54/L57, fund/BRIEF-fundament.md).
 * Denne del beviser de SYV leverancepunkter mekanisk, saa en senere
 * redigering (runde 2, som ARVER dette fundament) faelder en roed test i
 * stedet for at rulle en detalje tilbage tavst:
 *
 *   1. De 10 selvhostede woff2-filer og @font-face-reglerne, der peger paa dem.
 *   2. build.mjs kopierer dem til dist/fonts (behavioral, egen tmp-dist).
 *   3. Paletten: token-NAVNENE er bevaret, --skygge/--skygge-loeft er "none".
 *   4. --mono peger paa Saira, tabulartal staar paa body.
 *   5. .stans-primitiven (2px radius, indfaeldet kant, hvid lyskant).
 *   6. De fire tre-tilstandsmaerker i SPRITE (i-ja/i-nej/i-nul/i-ioplyst).
 *   7. nav_forside er "Oversigt"/"Overview", og nav-arrayets STRUKTUR er
 *      uroert (vagt mod at det midlertidige maalepunkt fra 3.7 lever videre).
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export default async function koer(ctx) {
  const { rod, tmp, node, ok } = ctx;

  console.log('\n34. TYPESKILT-fundamentet (spor/fundament)');

  const sys = fs.readFileSync(path.join(rod, 'assets', 'system.css'), 'utf8');
  const sideMjs = fs.readFileSync(path.join(rod, 'tools', 'skabelon', 'side.mjs'), 'utf8');
  const da = JSON.parse(fs.readFileSync(path.join(rod, 'data', 'i18n', 'da.json'), 'utf8'));
  const en = JSON.parse(fs.readFileSync(path.join(rod, 'data', 'i18n', 'en.json'), 'utf8'));

  console.log('  1. Skrifterne: 10 woff2-filer, @font-face peger paa dem');
  {
    const fontMappe = path.join(rod, 'assets', 'fonts');
    const woff2 = fs.existsSync(fontMappe)
      ? fs.readdirSync(fontMappe).filter((f) => f.endsWith('.woff2')) : [];
    ok('34.1: assets/fonts/ har praecis 10 woff2-filer', woff2.length === 10,
      `fandt ${woff2.length}: ${woff2.join(', ')}`);

    const faceBlokke = sys.match(/@font-face\{[^}]*\}/g) || [];
    ok('34.2: system.css har praecis 10 @font-face-regler', faceBlokke.length === 10,
      `fandt ${faceBlokke.length}`);
    ok('34.3: alle 10 bruger font-display:swap',
      faceBlokke.length > 0 && faceBlokke.every((b) => /font-display:swap/.test(b)),
      faceBlokke.filter((b) => !/font-display:swap/.test(b)).join(' | '));

    const saira = faceBlokke.filter((b) => /SairaSemiCondensed/.test(b));
    const literata = faceBlokke.filter((b) => /'Literata'|"Literata"/.test(b));
    ok('34.4: 8 SairaSemiCondensed-regler (4 vaegte x latin/latin-ext)', saira.length === 8,
      `fandt ${saira.length}`);
    ok('34.5: 2 Literata-regler (latin/latin-ext)', literata.length === 2,
      `fandt ${literata.length}`);

    // Den gamle selvhostings-attrap er vaek: intet @font-face erklaerer
    // laengere "Manrope lokal" eller "JetBrains Mono lokal" som familie.
    // --sans MAA gerne stadig NAEVNE "Manrope lokal" som fallback (uaendret,
    // uden for dette spors filejerskab) - det er en anden paastand.
    const gamleFamilier = faceBlokke.filter((b) => /Manrope lokal|JetBrains Mono lokal/.test(b));
    ok('34.6: ingen @font-face erklaerer laengere "Manrope lokal" eller "JetBrains Mono lokal"',
      gamleFamilier.length === 0, gamleFamilier.join(' | '));
  }

  console.log('  2. build.mjs kopierer skrifterne til dist/fonts (behavioral, egen tmp-dist)');
  {
    const dist = path.join(tmp, 'dist-typeskilt-fundament');
    const r = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'),
      `--data=${path.join(rod, 'tests', 'eksempel-robotter')}`, `--ud=${dist}`],
    { cwd: rod, encoding: 'utf8' });
    ok('34.7: build.mjs giver exit 0 paa proevedatasaettet', r.status === 0, (r.stderr || '').trim());

    const distFonts = path.join(dist, 'fonts');
    const kopierede = fs.existsSync(distFonts)
      ? fs.readdirSync(distFonts).filter((f) => f.endsWith('.woff2')) : [];
    ok('34.8: dist/fonts har praecis 10 woff2-filer efter et byg', kopierede.length === 10,
      `fandt ${kopierede.length}`);

    // Binaer integritet: skrivFil() laeser UTF-8 og ville OEDELAEGGE en
    // binaer woff2-fil. Fontene kopieres derfor IKKE via kopilisten
    // (build.mjs ca. linje 428-433) men via en separat fs.copyFileSync-loekke
    // (ca. linje 438-446) - proeven beviser, at den vej rent faktisk holder
    // filerne byte-identiske, ikke kun at et tal matcher.
    if (kopierede.includes('saira-400-latin.woff2')) {
      const kilde = fs.readFileSync(path.join(rod, 'assets', 'fonts', 'saira-400-latin.woff2'));
      const kopi = fs.readFileSync(path.join(distFonts, 'saira-400-latin.woff2'));
      ok('34.9: saira-400-latin.woff2 er byte-identisk i dist (kopiFileSync, ikke tekst-skrivFil)',
        kilde.equals(kopi), `kilde ${kilde.length} bytes, kopi ${kopi.length} bytes`);
    } else {
      ok('34.9: saira-400-latin.woff2 er byte-identisk i dist (kopiFileSync, ikke tekst-skrivFil)',
        false, 'filen blev slet ikke kopieret - se 34.8');
    }
  }

  console.log('  3. Paletten: token-navnene er bevaret, --skygge er "none"');
  {
    const ROD_TOKENS = ['--bund', '--panel', '--panel-ro', '--tom', '--blaek', '--blaek2',
      '--blaek3', '--accent', '--accent-ro', '--linje', '--hegn', '--fod', '--paafod', '--paafod2'];
    const manglende = ROD_TOKENS.filter((t) => !new RegExp(`\\${t}:`).test(sys));
    ok('34.10: alle 14 oprindelige farve-tokens findes stadig ved navn',
      manglende.length === 0, `mangler: ${manglende.join(', ')}`);

    ok('34.11: to nye tokens er tilfoejet: --stans og --stoev-blaek',
      /--stans:#FFFFFF/i.test(sys) && /--stoev-blaek:#5F686F/i.test(sys),
      'forventede --stans:#FFFFFF og --stoev-blaek:#5F686F i :root');

    ok('34.12: --skygge og --skygge-loeft er begge "none" (MANIFEST: ingen slagskygge)',
      /--skygge:none;/.test(sys) && /--skygge-loeft:none;/.test(sys),
      'tokenerne skal blive staaende, men pege paa none - ikke slettes');

    ok('34.13: --accent er afmaerkningsgul (#F2C400)', /--accent:#F2C400;/i.test(sys));
    ok('34.14: --blaek er gunmetal (#22262A)', /--blaek:#22262A;/i.test(sys));
    ok('34.15: --bund er eloxgraa (#E8EBED)', /--bund:#E8EBED;/i.test(sys));
  }

  console.log('  4. --mono peger paa Saira, tabulartal staar paa body');
  {
    ok('34.16: --mono starter med "SairaSemiCondensed" (ikke en fastbredde-stak)',
      /--mono:"SairaSemiCondensed"/.test(sys));
    ok('34.17: ingen "monospace" eller "JetBrains" tilbage i system.css',
      !/monospace|JetBrains/.test(sys));
    ok('34.18: body faar font-variant-numeric:tabular-nums (daekker alle --mono-brugssteder)',
      /body\{[^}]*font-variant-numeric:tabular-nums/.test(sys)
        || /font-variant-numeric:tabular-nums;\s*\n\}/.test(sys.match(/body\{[\s\S]*?\n\}/)?.[0] || ''),
      'forventede egenskaben inden i body{...}-reglen');
  }

  console.log('  5. .stans-primitiven: 2px radius, indfaeldet kant, hvid lyskant');
  {
    const stansRegel = (sys.match(/\.stans\{[^}]*\}/) || [''])[0];
    ok('34.19: .stans findes som selvstaendig regel', stansRegel !== '',
      'primitiven skal vaere en genbrugelig klasse, ikke kun en compen');
    ok('34.20: .stans bruger 2px radius', /border-radius:2px/.test(stansRegel), stansRegel);
    ok('34.21: .stans\' indfaeldede kant bruger --linje (rille) og --stans (lyskant)',
      /inset 0 0 0 1px var\(--linje\)/.test(stansRegel) && /inset 0 1px 0 var\(--stans\)/.test(stansRegel),
      stansRegel);
  }

  console.log('  6. De fire tre-tilstandsmaerker i SPRITE');
  {
    for (const id of ['i-ja', 'i-nej', 'i-nul', 'i-ioplyst']) {
      ok(`34.22.${id}: symbolet findes i SPRITE`, sideMjs.includes(`id="${id}"`));
    }
    const iJa = (sideMjs.match(/<symbol id="i-ja"[^]*?<\/symbol>/) || [''])[0];
    ok('34.23: i-ja er fyldt (fill="currentColor" paa selve elementet)',
      /fill="currentColor"/.test(iJa), iJa);
    const iNul = (sideMjs.match(/<symbol id="i-nul"[^]*?<\/symbol>/) || [''])[0];
    ok('34.24: i-nul har en fyldt prik (circle med fill="currentColor")',
      /<circle[^>]*fill="currentColor"/.test(iNul), iNul);
    const iOplyst = (sideMjs.match(/<symbol id="i-ioplyst"[^]*?<\/symbol>/) || [''])[0];
    ok('34.25: i-ioplyst er stiplet (stroke-dasharray) og har INGEN fill-attribut (arver fill:none)',
      /stroke-dasharray/.test(iOplyst) && !/fill=/.test(iOplyst), iOplyst);
  }

  console.log('  7. nav_forside er "Oversigt"/"Overview", nav-strukturen er uroert');
  {
    ok('34.26: da.json nav_forside er "Oversigt"', da.nav_forside === 'Oversigt', da.nav_forside);
    ok('34.27: en.json nav_forside er "Overview"', en.nav_forside === 'Overview', en.nav_forside);

    // Vagt mod 3.7's MIDLERTIDIGE maalepunkter (Nyheder/Services/Om os):
    // de blev indsat lokalt for at maale navigationshoejden og skal vaere
    // fjernet igen foer commit. Falder denne, er reverten ikke fuldstaendig.
    //
    // INDSNAEVRET 31. aug 2026 (spor/topbar) fra HELE filen til NAV-ARRAYET.
    // Vagten laeste ogsaa kommentarer, og L58 - beslutningen om at de tre
    // punkter laegges TIL de bestaaende, naar deres sider findes - skal kunne
    // NAVNGIVE dem dér, hvor nav-arrayet staar. En beslutning, der ikke maa
    // skrives ned ved siden af den kode, den styrer, bliver skrevet ned et
    // sted, ingen laeser.
    //
    // FOERSTE FORSOEG VAR AT STRIPPE KOMMENTARER, OG DET VAR FORKERT. Maalt:
    // `s.replace(/\/\*[\s\S]*?\*\//g,'')` fjernede 41.272 af side.mjs' 78.112
    // tegn - over halvdelen, nav-arrayet inklusive. Filen har 82 `/*` og 81
    // `*/`, altsaa en ubalanceret aabner inde i en streng eller et
    // regex-literal, og den forskyder hver eneste parring efter sig. Vagten
    // ville have staaet GROEN paa et indsat `nav.push(['nyheder/','Nyheder'])`
    // - en stille afvaebning af sig selv. En regex er ikke en parser.
    //
    // Den her form har ingen parsing at tage fejl af: arrayliteralen fra
    // `const nav = [` til dens `];`, plus enhver linje i filen med et
    // `nav.push(`. Bredden over KODE er dermed stoerre end foer, ikke mindre.
    //
    // Den ADFAERDSMAESSIGE vagt mod den samme fare - en navigationslaenke til
    // en side, der ikke er bygget - er 37.7, som slaar hver enkelt laenke op
    // i dist. Den fanger ogsaa det tilfaelde, denne vagt aldrig kunne se:
    // et fjerde punkt med et helt andet navn.
    // spor/oversigt (1. sep 2026, PUNKT 1): nav-arrayets FOERSTE punkt er
    // ikke laengere ['', T.nav_forside] - forsiden er slettet, og kataloget
    // (['', T.nav_katalog]) staar nu foerst, paa href ''. Ankeret for "blev
    // arrayet overhovedet fundet" flytter derfor fra nav_forside til
    // nav_katalog - selve arrayet, og dermed 34.28's dybere paastand
    // nedenfor, er UAENDRET af dette spor.
    const start = sideMjs.indexOf('const nav = [');
    const arrayLit = start < 0 ? '' : sideMjs.slice(start, sideMjs.indexOf('];', start) + 2);
    const pushLinjer = sideMjs.split('\n').filter((l) => /\bnav\.push\(/.test(l)).join('\n');
    const navKode = `${arrayLit}\n${pushLinjer}`;
    ok('34.28b: nav-arrayet blev overhovedet fundet i side.mjs',
      start >= 0 && arrayLit.includes('nav_katalog') && pushLinjer.includes('nav.push('),
      'uden arrayet maaler 34.28 en tom streng og staar groen uanset hvad');
    ok('34.28: nav-arrayet i side.mjs baerer STADIG kun de tre faste punkter '
      + '+ det betingede producent-punkt (3.7s midlertidige maalepunkter er fjernet)',
      !/Nyheder|Services|Om os/.test(navKode),
      `fandt spor af 3.7s midlertidige maalepunkter i nav-koden: ${navKode}`);
  }
}
