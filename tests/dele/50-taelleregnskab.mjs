/**
 * tests/dele/50-taelleregnskab.mjs — ét tal må kun betyde én ting (spor/tal,
 * 1. sep 2026).
 *
 * Sitet bar fire tællinger af "hvor meget er oplyst", og to af dem stod under
 * NØJAGTIG samme i18n-nøgle (`stempel_felter`) uden at betyde det samme:
 * katalogsiden viste 842 (antal oplyste FELTVÆRDIER), sammenligningssiden
 * viste 30 (NAEVNER — skemaets FELTANTAL, en helt anden størrelse). Samme
 * etiket, to størrelsesordener. Det er hård begrænsning 2's område: et tal
 * på siden skal have en kilde og betyde det, etiketten siger.
 *
 * Roden, målt med tools/skabelon/katalog.mjs's egen `laesFelt()` kopieret ind
 * i en engangs-udregning (spor/tal, punkt 1): funktionen kender kun tre
 * svarformer — boolesk (ja/nej) og tal — og falder igennem til 'ikke_oplyst'
 * for ethvert felt af art 'tekst'/'liste'/'ip' med reelt indhold (lidar,
 * kameraer, compute, autonominiveau, monteringsinterface, stroem_ud,
 * sdk_sprog, dataporte, ip_klasse). Det er DERFOR katalogsidens 842 er 274
 * for lavt mod om-os' 1.116 — differencen falder PRÆCIS på de ni tekst/liste/
 * ip-felter. Om-os' tal er det rigtige; katalogsidens `laesFelt()` er ikke
 * denne dels ejerskab (tools/skabelon/katalog.mjs), og rettes derfor ikke
 * her — men den samlede etiket-fejlmærkning er, og det er den, delen
 * beviser er væk og forbliver væk.
 *
 * Fire ting bevises:
 *   1. Om-os' regnskab balancerer på det RIGTIGE datasæt: oplyst + ikke
 *      oplyst = felter x robotter, og kildeopgørelsen summer til oplyst.
 *      MODBEVIS: en bevidst ødelagt kopi af samme regnestykke, kørt på
 *      syntetiske robotter der netop rammer den gren (et felt der slet ikke
 *      står i YAML'en), viser at assertionens FORM faktisk kan falde.
 *   2. Sammenligningssiden bruger IKKE LÆNGERE `stempel_felter` til noget
 *      som helst (spor/tal, punkt 2) — pladen bærer kun Udgave.
 *   3. STRUKTUREL VAGT, fremadrettet: uanset hvor mange sider i det byggede
 *      output der bruger `stempel_felter`-etiketten, skal de alle vise
 *      SAMME tal. I dag er der kun én bruger tilbage (katalogsiden), så
 *      mængden af DISTINKTE tal er ≤ 1 pr. sprog — men vagten er skrevet
 *      generisk, så en fremtidig side, der igen genbruger etiketten forkert,
 *      fanges her, uden at denne del selv skal opdateres.
 *   4. Samme vagt, specifikt mod netop DEN bug-klasse der skete: NAEVNER
 *      (skemaets rå feltantal, i dag 30) må ALDRIG stå under
 *      `stempel_felter`-etiketten på en side, der viser mere end én robot —
 *      for så er det pr. definition ikke en optælling af oplyste
 *      feltværdier.
 *
 * Punkt 3 og 4 har begge et modbevis: en syntetisk ekstra (side, værdi) sat
 * ind i den indsamlede liste i hukommelsen (ingen fil røres), som beviser at
 * vagten rent faktisk kan fange en gentagelse af fejlen.
 *
 * Bygger sit eget dist under ctx.tmp, som del 38/42 gør det.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

/** Finder alle `<dl class="stempler">...</dl>`-blokke i en HTML-streng og
 *  returnerer deres [etiket, vaerdi]-par. Samme markup begge steder, der i
 *  dag tegner en plade (katalog.mjs og sammenligning.mjs) — se filhovedet. */
function stemplerIHtml(html) {
  const par = [];
  const re = /<dl class="stempler">([\s\S]*?)<\/dl>/g;
  let m;
  while ((m = re.exec(html))) {
    const indre = m[1];
    const reRaekke = /<dt>([^<]*)<\/dt><dd>([^<]*)<\/dd>/g;
    let r2;
    while ((r2 = reRaekke.exec(indre))) par.push([r2[1], r2[2]]);
  }
  return par;
}

/** "1.116" / "1,116" -> 1116. Tal uden gruppetegn (fx en dato) giver NaN og
 *  sorteres fra af kalderen. */
function talAf(streng) {
  const cifre = streng.replace(/[.,](?=\d{3}\b)/g, '');
  return /^\d+$/.test(cifre) ? Number(cifre) : NaN;
}

export default async function koer(ctx) {
  const {
    rod, tmp, node, ok, lasRobotter, skema,
  } = ctx;

  console.log('\n50. Taelleregnskabet: ét tal maa kun betyde én ting (spor/tal)');

  const omOs = await import(`file://${path.join(rod, 'tools/skabelon/om-os.mjs').replace(/\\/g, '/')}`);

  /* --- 1. Om-os' regnskab balancerer paa det RIGTIGE datasaet ------------ */
  console.log('  1. Om-os\' regnskab balancerer');
  const g = omOs.regnskab(lasRobotter(path.join(rod, 'data', 'robots')));
  ok('50.1.a: oplyst + ikke oplyst = felter x robotter',
    g.oplyst + g.io === g.muligt,
    `${g.oplyst} + ${g.io} = ${g.oplyst + g.io}, men ${g.felter} x ${g.robotter} = ${g.muligt}`);
  ok('50.1.b: medKilde + udenKilde + tilstandssvar = oplyst',
    g.medKilde + g.udenKilde + g.restSvar === g.oplyst,
    `${g.medKilde} + ${g.udenKilde} + ${g.restSvar} = ${g.medKilde + g.udenKilde + g.restSvar}, `
    + `men oplyst = ${g.oplyst}`);
  ok('50.1.c: naevneren regnskab() bruger ER skemaets FELTNAVNE.length (ikke skrevet i haanden)',
    g.felter === skema.FELTNAVNE.length, `${g.felter} != ${skema.FELTNAVNE.length}`);

  // MODBEVIS: syntetiske robotter, konstrueret til praecis at ramme den
  // gren regnskab() skal daekke (et felt der slet ikke staar i doc'et — ikke
  // bare "ikke_oplyst" som streng). En bevidst OEDELAGT kopi af samme
  // regnestykke, der glemmer at taelle den gren med, skal FALDE paa
  // praecis den assertion, 50.1.a er.
  {
    const alleIkkeOplyst = Object.fromEntries(
      skema.FELTNAVNE.map((n) => [n, { vaerdi: 'ikke_oplyst' }]),
    );
    const syntetisk = [
      { slug: 'test-alle-tilstede', producent: 'X', felter: alleIkkeOplyst },
      { slug: 'test-alle-mangler', producent: 'Y', felter: {} }, // ingen af de 30 noegler staar i doc'et
    ];

    function regnskabOedelagt(robotter) {
      let oplyst = 0; let io = 0;
      for (const r of robotter) {
        for (const n of skema.FELTNAVNE) {
          const p = r.felter?.[n];
          if (p === undefined) continue; // FEJLEN: skulle have vaeret io++, som om-os.mjs goer
          const raa = typeof p === 'string' ? p : p.vaerdi;
          if (skema.tilstandAf(raa) === 'ikke_oplyst') { io++; continue; }
          oplyst++;
        }
      }
      return { oplyst, io, muligt: robotter.length * skema.FELTNAVNE.length };
    }

    const rigtig = omOs.regnskab(syntetisk);
    const oedelagt = regnskabOedelagt(syntetisk);

    ok('50.1/modbevis-forudsaetning: de syntetiske robotter rammer begge grene '
      + '(én med alle 30 noegler tilstede som "ikke_oplyst", én med 0 noegler i doc\'et)',
      rigtig.muligt === 60 && Object.keys(syntetisk[1].felter).length === 0);
    ok('50.1/modbevis.a: DEN RIGTIGE regnskab() balancerer paa de syntetiske robotter',
      rigtig.oplyst + rigtig.io === rigtig.muligt,
      `${rigtig.oplyst} + ${rigtig.io} != ${rigtig.muligt}`);
    ok('50.1/modbevis.b: den OEDELAGTE kopi falder paa SAMME assertion — '
      + 'beviser at 50.1.a rent faktisk kan opdage denne fejlklasse',
      oedelagt.oplyst + oedelagt.io !== oedelagt.muligt,
      `oedelagt gav ${oedelagt.oplyst} + ${oedelagt.io} = ${oedelagt.oplyst + oedelagt.io}, `
      + `som IKKE er en fejl — modbeviset virker ikke`);
  }

  /* --- byg dist til punkt 2-4 --------------------------------------------- */
  const dist = path.join(tmp, 'dist-taelleregnskab');
  const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${dist}`],
    { cwd: rod, encoding: 'utf8' });
  ok('50.0: byg af hele kataloget giver exit 0', b.status === 0, (b.stderr || '').trim());

  const i18n = {
    da: JSON.parse(fs.readFileSync(path.join(rod, 'data', 'i18n', 'da.json'), 'utf8')),
    en: JSON.parse(fs.readFileSync(path.join(rod, 'data', 'i18n', 'en.json'), 'utf8')),
  };

  /* --- 2. sammenligningssiden bruger ikke laengere stempel_felter --------- */
  console.log('  2. Sammenligningssiden baerer ikke laengere en "Felter"-plade');
  for (const sprog of ['da', 'en']) {
    const fil = path.join(dist, sprog, 'sammenligning', 'index.html');
    ok(`50.2.${sprog}: dist/${sprog}/sammenligning/index.html findes`, fs.existsSync(fil));
    if (!fs.existsSync(fil)) continue;
    const html = fs.readFileSync(fil, 'utf8');
    const par = stemplerIHtml(html);
    const etiket = i18n[sprog].stempel_felter;
    ok(`50.2.${sprog}: ingen raekke paa sammenligningssiden baerer etiketten "${etiket}"`,
      !par.some(([n]) => n === etiket), par.map(([n, v]) => `${n}=${v}`).join(', '));
    ok(`50.2.${sprog}: pladen viser praecis Udgave, og intet andet`,
      par.length === 1 && par[0][0] === i18n[sprog].stempel_udgave,
      par.map(([n, v]) => `${n}=${v}`).join(', '));
  }

  /* --- 3-4. strukturel vagt paa tvaers af HELE det byggede site ----------- */
  console.log('  3. Samme etiket betyder samme tal, overalt i det byggede site');
  const alleHtml = [];
  (function gaa(m) {
    for (const f of fs.readdirSync(m, { withFileTypes: true })) {
      const p = path.join(m, f.name);
      if (f.isDirectory()) gaa(p); else if (f.name.endsWith('.html')) alleHtml.push(p);
    }
  })(dist);

  for (const sprog of ['da', 'en']) {
    const etiket = i18n[sprog].stempel_felter;
    const sideMappe = path.join(dist, sprog);
    const fundet = []; // {side, vaerdiStreng, vaerdiTal}
    for (const fil of alleHtml) {
      if (!fil.startsWith(sideMappe + path.sep) && fil !== sideMappe) continue;
      const html = fs.readFileSync(fil, 'utf8');
      for (const [n, v] of stemplerIHtml(html)) {
        if (n === etiket) fundet.push({ side: path.relative(dist, fil), vaerdiStreng: v, vaerdiTal: talAf(v) });
      }
    }

    console.log(`     ${sprog}: "${etiket}" bruges ${fundet.length} sted(er) — `
      + fundet.map((f) => `${f.side}=${f.vaerdiStreng}`).join(', '));

    /* --- 3. alle brug af etiketten viser SAMME tal ------------------------ */
    const distinkte = new Set(fundet.map((f) => f.vaerdiStreng));
    ok(`50.3.${sprog}: "${etiket}" viser samme tal paa alle sider, der bruger den `
      + `(${distinkte.size} distinkt(e) vaerdi(er) fundet)`,
      distinkte.size <= 1, [...distinkte].join(' vs. '));

    /* --- 4. NAEVNER (skemaets raa feltantal) staar aldrig under etiketten,
       naar mere end én robot vises — det var netop sammenligningssidens bug */
    const naevnerLaek = fundet.filter((f) => f.vaerdiTal === skema.FELTNAVNE.length);
    ok(`50.4.${sprog}: ingen brug af "${etiket}" viser den raa naevner (${skema.FELTNAVNE.length}) — `
      + 'det er skemaets FELTANTAL, ikke en optaelling af oplyste feltvaerdier',
      naevnerLaek.length === 0, naevnerLaek.map((f) => f.side).join(', '));

    /* --- MODBEVIS for 50.3 og 50.4: en syntetisk ekstra forekomst, sat ind
       i den indsamlede liste i hukommelsen. Ingen fil roeres. ---------------- */
    const medFejlGenindfoert = [...fundet, {
      side: '(syntetisk/modbevis)', vaerdiStreng: String(skema.FELTNAVNE.length), vaerdiTal: skema.FELTNAVNE.length,
    }];
    const distinkteMedFejl = new Set(medFejlGenindfoert.map((f) => f.vaerdiStreng));
    ok(`50.3/modbevis.${sprog}: en syntetisk ekstra vaerdi under samme etiket FAAR 50.3-formen til at falde`,
      distinkteMedFejl.size > 1 || fundet.length === 0,
      distinkteMedFejl.size <= 1 ? 'modbeviset virker ikke — vagten saa ikke forskellen' : `${distinkteMedFejl.size} distinkte`);
    const naevnerLaekMedFejl = medFejlGenindfoert.filter((f) => f.vaerdiTal === skema.FELTNAVNE.length);
    ok(`50.4/modbevis.${sprog}: den syntetiske vaerdi (= naevneren) bliver FANGET af 50.4-formen`,
      naevnerLaekMedFejl.length >= 1);
  }
}
