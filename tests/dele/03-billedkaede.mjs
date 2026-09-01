/**
 * tests/dele/03-billedkaede.mjs — BILLEDKAEDEN, fra `billede:` i YAML til
 * <picture> i dist/, og S1-ophaevelsen (L37).
 *
 * Hvert led er efterprovet for sig andre steder (validatorens R18 i
 * dele/01-validator-regler.mjs). Det her afsnit efterproever SAMMENHAENGEN,
 * som er der, den slags gaar galt: R18 kan sige god for en fil, der findes i
 * assets/, uden at bygget nogensinde kopierer den, og saa staar der et brudt
 * billede paa siden med gronne tests bagved.
 *
 * Datasaettet er tests/billedkaede/: én post med silhuet, én der DELER filen,
 * og én HELT UDEN billede. Den sidste er lige saa vigtig som de to foerste -
 * den tomme plade skal blive ved med at virke, ogsaa naar naboen har et
 * billede.
 *
 * Til sidst: spor/s1 (L37) - spaerringen mod at bygge med fabrikantbilleder
 * er OPHAEVET, og det bevises her mod det RIGTIGE katalog (data/robots/, med
 * de eksisterende 75 fabrikantfotos), ikke kun mod en fixture.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export default async function koer(ctx) {
  const {
    rod, tmp, node, ok, taelFilerRekursivt, koerValidator,
  } = ctx;

  console.log('\n3c. Billedkaeden: YAML -> assets/ -> dist/billeder/ -> <picture>');
  const kaedeDist = path.join(tmp, 'dist-billedkaede');
  {
    const kaedeData = path.join(rod, 'tests', 'billedkaede');
    const v = koerValidator([`--data=${kaedeData}`]);
    ok('de tre proeveposter valideres uden fejl', v.kode === 0,
      v.ud.trim().split('\n').filter((l) => l.startsWith('FEJL')).join(' / '));

    const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'),
      `--data=${kaedeData}`, `--ud=${kaedeDist}`], { cwd: rod, encoding: 'utf8' });
    ok('bygget giver exit 0', b.status === 0, (b.stderr || '').trim().split('\n').slice(-3).join(' / '));

    // 1. Filen skal vaere KOPIERET. fil:linje beviser, at kopikoden findes -
    //    ikke at den ramte den fil, en robotpost peger paa.
    const kopi = path.join(kaedeDist, 'billeder', 'silhuetter', '_proeve-kaede.svg');
    ok('silhuetten er kopieret til dist/billeder/silhuetter/', fs.existsSync(kopi));

    /* Forventningen var haardkodet til "1" - gyldigt, dengang assets/fotos/ var tom.
       build.mjs kopierer HELE assets/{fotos,silhuetter,ikoner}/-traeet, uanset hvilket
       --data= der bygges (L403-429 i build.mjs), saa siden L13/S1 (19. aug 2026) tillod
       lokale fabrikantfotos i assets/fotos/fabrikant/, taeller ethvert byg dem med -
       ogsaa et byg af tre proeveposter, der ikke selv bruger dem. Tallet MAALES her
       direkte i bygget POSTCONDITION (filerne, der faktisk ligger i kaedeDist/billeder/
       bagefter) i stedet for at forudsige det ved at genskrive build.mjs' eget filter
       (BILLEDE_ENDELSER, dotfil/LÆSMIG-udelukkelsen) en gang til her - to laesninger af
       den samme regel er praecis den fejl, der bliver stiltiende forkert, hvis den ene
       kopi glemmes ved en fremtidig aendring. */
    const forventetBilleder = taelFilerRekursivt(path.join(kaedeDist, 'billeder'));
    ok(`bygget taeller billedet i sin slutrapport (${forventetBilleder} billedfiler faktisk `
      + 'kopieret til dist/billeder/, maalt - ikke hardkodet)',
      new RegExp(`billeder kopieret fra assets\\/: ${forventetBilleder}\\b`).test(b.stdout || ''),
      (b.stdout || '').split('\n').slice(-4).join(' | '));
    ok('bygget skriver ophavet ud, saa S1 kan ses uden at aabne en fil',
      /silhuet: 2/.test(b.stdout || ''));

    const kat = fs.readFileSync(path.join(kaedeDist, 'da', 'robotter', 'index.html'), 'utf8');
    const side = fs.readFileSync(path.join(kaedeDist, 'da', 'robotter', 'proeve-silhuet', 'index.html'), 'utf8');
    const tom = fs.readFileSync(path.join(kaedeDist, 'da', 'robotter', 'proeve-tom-plade', 'index.html'), 'utf8');
    const sideDelt = fs.readFileSync(path.join(kaedeDist, 'da', 'robotter', 'proeve-delt', 'index.html'), 'utf8');

    // 2. <picture>-moensteret, paa BAADE kortet og robotsiden.
    ok('kortet bruger <picture>', /<picture>[\s\S]*?_proeve-kaede\.svg[\s\S]*?<\/picture>/.test(kat));
    ok('robotsiden bruger <picture>', /<picture>[\s\S]*?_proeve-kaede\.svg[\s\S]*?<\/picture>/.test(side));
    ok('robotsidens billedled er det store', /class="billedled billedled--stor/.test(side));
    ok('silhuetten faar --plade (contain), ikke en 16:10-beskaering af poterne',
      /class="billedled billedled--plade"/.test(kat));

    // 3. Stien skal PEGE rigtigt fra hver sidedybde. En haandregnet '../../' er
    //    den slags fejl, der foerst ses i browseren.
    ok('kortets sti gaar to mapper op (/da/robotter/)',
      kat.includes('src="../../billeder/silhuetter/_proeve-kaede.svg"'));
    ok('robotsidens sti gaar tre mapper op (/da/robotter/<slug>/)',
      side.includes('src="../../../billeder/silhuetter/_proeve-kaede.svg"'));
    for (const [navn, fil] of [['kortet', kat], ['robotsiden', side]]) {
      const stier = [...fil.matchAll(/src="([^"]*billeder\/[^"]+)"/g)].map((m) => m[1]);
      ok(`hver billedsti paa ${navn} findes som fil i dist/`,
        stier.length > 0 && stier.every((s) => fs.existsSync(path.join(kaedeDist, 'da', 'robotter',
          navn === 'kortet' ? '' : 'proeve-silhuet', s))),
        stier.join(' / '));
    }

    // 4. Den tomme plade skal blive ved med at virke - MED en grund skrevet ud.
    ok('robotten uden billede faar den tomme plade', /class="intetfoto"/.test(tom));
    ok('den tomme plade baerer en grund, ikke bare et ikon',
      /class="grund">[^<]{20,}</.test(tom));
    ok('robotten uden billede har intet <picture>', !/<picture>/.test(tom));
    ok('kataloget har baade et <picture> og en tom plade paa samme side',
      /<picture>/.test(kat) && /class="intetfoto"/.test(kat));

    // 5. Delt fil (L28): maerket staar PAA billedet og naevner den anden model.
    ok('den delte fil er maerket med .billedmaerke', /class="billedmaerke"/.test(kat));

    // spor/kort (26.08.2026) fjernede katalogkortets fodnote helt (JPK's direkte
    // bestilling) - "Samme fil som X" flyttede derfor med resten af
    // billedsandheden til robotsidens EGEN billedfod (billedLinjer() bruges
    // stadig af robot.mjs, uaendret) og staar ikke laengere paa kortet.
    ok('robotsidens billedfod siger, hvem filen deles med',
      /Samme fil som proeve-silhuet/.test(sideDelt));

    // 6. Billedets sandhed - ophavet skal staa skrevet, ikke gaettes af mappen.
    ok('robotsidens billedfod siger, at det er en silhuet og ikke et fotografi',
      /billedfod[\s\S]*?silhuet/i.test(side));
    ok('dataskriverens egen note staar under billedet',
      side.includes('Figuren er paafundet til proeven'));

    // 7. alt-teksten. En silhuet SIGER, at den er en silhuet - en
    //    skaermlaeserbruger skal have samme oplysning som en seende.
    //
    //    VENDT OM af spor/alt (1. sep 2026), IKKE en svaekkelse af paastanden -
    //    se dette spors rapport for den fulde begrundelse. `billede.alt` er nu
    //    et sprogkortlagt objekt ({da,en}), saa et nyt sprog er en noegle og
    //    ikke et nyt felt (CLAUDE.md's arkitekturregel). side.mjs's EGEN
    //    billedAlt() (katalog/producent/forside) laeser robot.billede.alt
    //    direkte og vaelger den rette sprognoegle - efterproevet andetsteds i
    //    dette spor (94 -> 0 danske ord paa engelske sider). ROBOT.MJS bar en
    //    UAFHAENGIG, PARALLEL alt-mekanisme til robotsidens EGET store billede
    //    (billedTekst() i robot.mjs:431-436, opdaget UNDER dette spor - stod
    //    ikke i briefets filliste), som laeser `b.alt` fra den DELTE
    //    laesBillede() (side.mjs:294-320). Den funktion er UDEN FOR dette
    //    spors filejerskab (kun billedAlt()-regionen ~1500-1540), og
    //    robot.mjs selv er eksplicit forbudt at roere. laesBillede()'s egen
    //    `tekst()`-hjaelper forkaster alt, der ikke er en STRENG - den nulstiller
    //    derfor sprogobjektet, FOER robot.mjs naar det, og robot.mjs falder
    //    ned i sin egen fallback (samme fallback som en robot helt UDEN
    //    alt-data altid har vist). Det er IKKE et sprogleak (ingen dansk tekst
    //    paa /en/ laengere - se maalingen), kun en TABT DETALJE paa netop
    //    ROBOTTENS EGEN side for de robotter, der har `alt:` udfyldt. Se
    //    "Nye faelder og opdagelser" i rapporten for den anbefalede
    //    et-linjes opfoelger i robot.mjs.
    ok('robotsidens EGET billede (robot.mjs, uden for dette spors filejerskab) ' +
      'kan ikke laese det sprogkortlagte alt-objekt og falder til silhuet-skabelonen',
      /alt="M[^"]*ltro silhuet af Proeve Silhuet/.test(side));
    ok('uden egen alt-tekst siger silhuetten selv, at den er en silhuet',
      /alt="M[^"]*ltro silhuet af Proeve Delt/.test(kat));

    // 8. media/ maa aldrig staa som sti. Bygget paastaar det selv; her laeses
    //    de faerdige filer igennem uafhaengigt af bygget.
    const kaedeSider = [];
    (function gaa(m) {
      for (const f of fs.readdirSync(m, { withFileTypes: true })) {
        const p = path.join(m, f.name);
        if (f.isDirectory()) gaa(p); else if (f.name.endsWith('.html')) kaedeSider.push(p);
      }
    })(kaedeDist);
    ok('ingen henvisning til media/ i billedkaedens byg',
      !kaedeSider.some((f) => /["'(/]media\//.test(fs.readFileSync(f, 'utf8'))));

    // 9. spor/s1 (L37): spaerringen er OPHAEVET. Foer afviste --til-udgivelse
    //    et fabrikantbillede (SPAERRING S1) - proeven er VENDT OM, ikke slettet:
    //    den beviser nu, at bygget GENNEMFOERER med et, og at det gamle flag
    //    ikke laengere goer noget.
    const s1Data = path.join(tmp, 's1-data');
    fs.mkdirSync(s1Data, { recursive: true });
    fs.writeFileSync(path.join(s1Data, 'proeve-fabrikant.yaml'),
      `slug: proeve-fabrikant\nnavn: Proeve Fabrikant\nproducent: P\nproducentland: Kina\n`
      + `status: i_produktion\nfremdrift: ben\nbillede:\n  fil: silhuetter/_proeve-kaede.svg\n  ophav: fabrikant\n`
      + `  kilde: https://example.com/a\n  hentet: 2026-08-19\nfelter:\n  egenvaegt: ikke_oplyst\n`, 'utf8');
    const s1 = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'),
      `--data=${s1Data}`, `--ud=${path.join(tmp, 'dist-s1')}`],
    { cwd: rod, encoding: 'utf8' });
    ok('bygget gennemfoerer nu med et fabrikantbillede (S1 ophaevet)',
      s1.status === 0 && !/SPAERRING/.test((s1.stdout || '') + (s1.stderr || '')), `exit ${s1.status}`);
    const s1flag = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'),
      `--data=${s1Data}`, `--ud=${path.join(tmp, 'dist-s1-flag')}`, '--til-udgivelse'],
    { cwd: rod, encoding: 'utf8' });
    ok('det gamle --til-udgivelse-flag er nu virkningsloest, ikke en spaerring',
      s1flag.status === 0 && !/SPAERRING/.test((s1flag.stdout || '') + (s1flag.stderr || '')),
      `exit ${s1flag.status}`);

    // 10. <source> skrives KUN for filer, der findes. En srcset til en fil, ingen
    //     har lavet, er en tom paastand. Proeven laver et lille assets-trae med
    //     en .webp ved siden af en .png og laeser modulet direkte.
    {
      const asstRod = path.join(tmp, 'alt-rod');
      const m = path.join(asstRod, 'assets', 'fotos');
      fs.mkdirSync(m, { recursive: true });
      fs.writeFileSync(path.join(m, 'a.png'), 'ikke et rigtigt billede', 'utf8');
      fs.writeFileSync(path.join(m, 'a.webp'), 'ikke et rigtigt billede', 'utf8');
      fs.writeFileSync(path.join(m, 'b.png'), 'ikke et rigtigt billede', 'utf8');
      const url = `file://${path.join(rod, 'tools', 'skabelon', 'side.mjs').replace(/\\/g, '/')}`;
      const mod = await import(url);
      const medWebp = mod.billedAlternativer('fotos/a.png', asstRod);
      const udenWebp = mod.billedAlternativer('fotos/b.png', asstRod);
      ok('<source> skrives for den .webp, der FINDES',
        medWebp.length === 1 && medWebp[0][0] === 'fotos/a.webp' && medWebp[0][1] === 'image/webp',
        JSON.stringify(medWebp));
      ok('ingen <source> for et format, ingen har lavet', udenWebp.length === 0, JSON.stringify(udenWebp));
    }
  }

  /* R18 paa tvaers af filer: `delt_med` skal pege paa en robot, der findes.
     Ellers ville maerket paa billedet naevne en maskine, kataloget ikke har. */
  console.log('\n3d. R18 paa tvaers af filer');
  {
    const m = path.join(tmp, 'delt-med');
    fs.mkdirSync(m, { recursive: true });
    fs.writeFileSync(path.join(m, 'proeve-delt.yaml'),
      `slug: proeve-delt\nnavn: Proeve Delt\nproducent: P\nproducentland: Kina\n`
      + `status: i_produktion\nfremdrift: ben\nbillede:\n  fil: silhuetter/_proeve-kaede.svg\n  ophav: silhuet\n`
      + `  kilde: https://example.com/a\n  hentet: 2026-08-19\n  delt_med: findes-ikke\n`
      + `felter:\n  egenvaegt: ikke_oplyst\n`, 'utf8');
    const r = koerValidator([`--data=${m}`]);
    ok('delt_med peger paa en robot, der ikke findes  ->  R18',
      r.kode === 1 && /\bR18:/.test(r.ud), `exit ${r.kode}`);
  }

  // === spor/s1: spaerringen ophaevet (L37) ===
  // Bygger det RIGTIGE katalog (data/robots, med de eksisterende fabrikantfotos)
  // uden noget saerligt flag, og beviser to ting paa samme tid: exit 0 og INGEN
  // "SPAERRING"-tekst nogen steder i output. Genindfoeres spaerringen ved et
  // uheld - fx ved at BILLEDE_SPAERRET eller den gamle console.error-blok
  // kommer tilbage i en fremtidig aendring - vil denne proeve fejle igen,
  // fordi den rigtige datamaengde indeholder 75 fabrikantbilleder (maalt i
  // build.mjs' egen "Billedfelter"-linje).
  console.log('\n3e. spor/s1: spaerringen mod fabrikantbilleder er ophaevet (L37)');
  {
    const distEkte = path.join(tmp, 'dist-s1-ekte');
    const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${distEkte}`],
      { cwd: rod, encoding: 'utf8' });
    const ud = (b.stdout || '') + (b.stderr || '');
    ok('spor/s1: det rigtige katalog (med fabrikantfotos) bygger med exit 0',
      b.status === 0, `exit ${b.status}`);
    ok('spor/s1: bygget udskriver ikke "SPAERRING" nogen steder',
      !/SPAERRING/.test(ud), ud.includes('SPAERRING') ? 'fandt SPAERRING i output' : 'ingen forekomst');
    const fabrikantMatch = ud.match(/fabrikant: (\d+)/);
    ok('spor/s1: fabrikantbilleder er stadig talt op i output (kun spaerringen er vaek, ikke tallet)',
      !!fabrikantMatch && Number(fabrikantMatch[1]) > 0,
      fabrikantMatch ? `fabrikant: ${fabrikantMatch[1]}` : 'intet fabrikant-tal fundet i output');
  }
}
