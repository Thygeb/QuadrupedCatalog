/**
 * tests/dele/17-kortstribe-flader.mjs — spor/legende, punkt 3.
 *
 * Vagt mod, at katalogsiden (/robotter/), forsiden (/) og producentsiderne
 * (/producenter/<slug>/) skrider fra hinanden igen, saadan som de gjorde ved
 * Aa28: producentkortets KORT_FELTER (tools/skabelon/producent.mjs) manglede
 * 'hastighed', mens katalog/forsidens STRIBE (tools/skabelon/side.mjs) havde
 * fire felter. Fejlen blev kun fundet ved at bygge og kigge - ingen anden test
 * daekkede den. Denne del paastaar det samme om alle tre flader, paa begge
 * sprog, i stedet for at antage det.
 *
 * Bygger sit eget dist i sin egen undermappe af ctx.tmp (dist-legende-vagt),
 * jf. tests/LAESMIG.md.
 *
 * VIGTIG PRAECISERING af "sammenlign etiketterne i orden" (briefets ordlyd):
 * etiket-TEKSTEN er bevidst forskellig mellem katalog/forside og
 * producentkortet. Katalog/forside bruger i18n-noeglerne 'stribe_<felt>'
 * ("Vaegt", "Nyttelast", "Fart", "Driftstid" - korte kortlabels), mens
 * producentkortet bruger 'felt_<felt>' ("Egenvaegt", "Nyttelast, gaaende",
 * "Maks. hastighed", "Driftstid" - de lange feltnavne). Det er en tidligere
 * gennemgaaet og godkendt forskel i ORDLYD (se fund/FUND-i18n.md, punkt 3:
 * "stribe_egenvaegt beholdt som Weight ... felt_egenvaegt kalder ... Weight"),
 * ikke en fejl i FELT eller RAEKKEFOELGE. En bogstavelig tekstsammenligning
 * paa tvaers af de to noeglesaet ville derfor give et FALSK roedt resultat
 * hver eneste gang, uden at feltrækkefølgen faktisk var forkert - stik imod
 * briefets eget krav om, at ingen tredje post maa staa paa Fejlede-linjen.
 *
 * Denne test sammenligner derfor FELTIDENTITETEN saadan som den utvetydigt
 * staar i selve den byggede HTML: ikonets href (<use href="#i-vaegt">...>) -
 * den samme streng, som baade STRIBE og KORT_FELTER bruger som deres andet
 * array-element. To kort med samme ikon-raekkefoelge viser praecis de samme
 * fire felter i praecis den samme raekkefoelge, uanset hvilken etiket-tekst
 * der staar ved siden af. Etiket-teksten laeses stadig ud og bruges - til at
 * bekraefte at hver celle rent faktisk HAR en etiket (ikke en tom stribe--intet-
 * prosaboks), og til at logge, hvad der faktisk blev fundet.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

/** Traekker samtlige kompakte striber (.stribe--kompakt) ud af én HTML-side.
 *  Én post pr. fundet <ul class="stribe stribe--kompakt ...">...</ul>. */
function traekStriber(html) {
  const resultater = [];
  let fra = 0;
  for (;;) {
    const s = html.indexOf('<ul class="stribe stribe--kompakt', fra);
    if (s < 0) break;
    const slut = html.indexOf('</ul>', s);
    const blok = html.slice(s, slut < 0 ? html.length : slut);
    fra = (slut < 0 ? html.length : slut) + 5;

    const lier = [...blok.matchAll(/<li( class="hul")?>([\s\S]*?)<\/li>/g)]
      .map((m) => ({ hul: !!m[1], indhold: m[2] }));
    const ikoner = [...blok.matchAll(/<use href="#([^"]+)"/g)].map((m) => m[1]);
    const etiketter = [...blok.matchAll(/<span class="etiket">([^<]*)<\/span>/g)].map((m) => m[1]);

    resultater.push({
      antalLi: lier.length,
      lier,
      ikoner,
      etiketter,
      harStribeIntet: /stribe--intet/.test(blok),
    });
  }
  return resultater;
}

export default async function koer(ctx) {
  const { rod, tmp, node, ok } = ctx;

  console.log('\n17. spor/legende: kompakt-stribens kontrakt er den samme paa alle tre flader (Aa28-vagt)');

  const udMappe = path.join(tmp, 'dist-legende-vagt');
  fs.rmSync(udMappe, { recursive: true, force: true });
  const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'), `--ud=${udMappe}`],
    { cwd: rod, encoding: 'utf8' });
  ok('build.mjs giver exit 0 (frisk byg til midlertidig mappe, hele det rigtige datasaet)',
    b.status === 0, (b.stdout || b.stderr || '').trim().split('\n').slice(-3).join(' / '));
  if (b.status !== 0) return;

  function laes(rel) {
    const sti = path.join(udMappe, rel);
    return fs.existsSync(sti) ? fs.readFileSync(sti, 'utf8') : null;
  }

  for (const sprog of ['da', 'en']) {
    /* ------------------------------------------------------------ katalog */
    const katalogHtml = laes(`${sprog}/robotter/index.html`);
    ok(`${sprog}/robotter/: katalogsiden blev bygget`, katalogHtml !== null);
    const katalogStriber = katalogHtml ? traekStriber(katalogHtml) : [];

    /* ------------------------------------------------------------ forside */
    const forsideHtml = laes(`${sprog}/index.html`);
    ok(`${sprog}/: forsiden blev bygget`, forsideHtml !== null);
    const forsideStriber = forsideHtml ? traekStriber(forsideHtml) : [];

    /* --------------------------------------------------------- producenter */
    const producentRod = path.join(udMappe, sprog, 'producenter');
    let producentStriber = [];
    if (fs.existsSync(producentRod)) {
      for (const m of fs.readdirSync(producentRod, { withFileTypes: true })) {
        if (!m.isDirectory()) continue;
        const f = path.join(producentRod, m.name, 'index.html');
        if (!fs.existsSync(f)) continue;
        producentStriber = producentStriber.concat(traekStriber(fs.readFileSync(f, 'utf8')));
      }
    }
    ok(`${sprog}/producenter/: mindst én producentside med kompakte striber fundet`,
      producentStriber.length > 0, `fandt ${producentStriber.length} striber`);

    /* KATALOGET ER UDE AF FLADELISTEN pr. 31. aug 2026 (spor/katalog, L56
       punkt 7): katalogkortet viser billede + producent + produktnavn og har
       ingen stribe, saa der er ingen striber at holde op mod de to andre
       flader. Sammenligningen mellem forside og producentsider - som er hele
       pointen med denne fil - staar uaendret.

       Vagten nedenfor er ikke pynt: den er det, der faar filen til at FEJLE,
       hvis striben sniger sig tilbage paa katalogkortet uden en beslutning. */
    ok(`${sprog}/robotter/: katalogkortet har ingen kompakt stribe (L56 punkt 7)`,
      katalogStriber.length === 0,
      `fandt ${katalogStriber.length} striber paa katalogsiden`);

    const flader = [
      ['forside', forsideStriber],
      ['producent', producentStriber],
    ];

    /* ------------------------------------------- paastand 1: fire <li>, ALDRIG
       stribe--intet paa et kompakt kort (den prosagren hoerer kun til robot-
       sidens fulde, ikke-kompakte stribe - se 16-instrumentkort.mjs). */
    for (const [navn, striber] of flader) {
      const forkerte = striber.filter((s) => s.antalLi !== 4);
      const fordeling = striber.reduce((acc, s) => {
        acc[s.antalLi] = (acc[s.antalLi] || 0) + 1;
        return acc;
      }, {});
      ok(`${sprog}/${navn}: alle ${striber.length} kompakte striber har praecis 4 <li> (0 undtagelser)`,
        striber.length > 0 && forkerte.length === 0,
        `fordeling: ${JSON.stringify(fordeling)}`);

      ok(`${sprog}/${navn}: ingen "stribe--intet" paa et kompakt kort`,
        !striber.some((s) => s.harStribeIntet));
    }

    /* ------------------------------------------- paastand 2: samme feltorden
       paa alle tre flader - sammenlignet via ikon-href (feltidentiteten), se
       forklaringen i filens hoved-kommentar. */
    const ikkeTomme = flader.filter(([, striber]) => striber.length > 0);
    if (ikkeTomme.length > 0) {
      const [refNavn, refStriber] = ikkeTomme[0];
      const refOrden = JSON.stringify(refStriber[0].ikoner);
      const refUenige = refStriber.filter((s) => JSON.stringify(s.ikoner) !== refOrden);
      ok(`${sprog}/${refNavn}: alle ${refStriber.length} kort er internt enige om feltordenen (${refStriber[0].ikoner.join(' -> ')})`,
        refUenige.length === 0, `${refUenige.length} kort afveg internt`);

      for (const [navn, striber] of ikkeTomme.slice(1)) {
        const uenige = striber.filter((s) => JSON.stringify(s.ikoner) !== refOrden);
        ok(`${sprog}: ${navn}s feltorden matcher ${refNavn}s (${refStriber[0].ikoner.join(' -> ')})`,
          uenige.length === 0,
          uenige.length ? `${uenige.length} kort afveg, foerste: ${JSON.stringify(uenige[0].ikoner)}` : '');
      }
    }

    /* ------------------------------------------- paastand 3: tomme celler er
       den stiplede "ikke oplyst"-tilstand (v-ikke), ikke en tom celle og ikke
       et bogstaveligt 0 (haard begraensning 5). */
    const alleHulLier = flader.flatMap(([navn, striber]) => striber
      .flatMap((s) => s.lier.filter((l) => l.hul).map((l) => ({ navn, l }))));
    ok(`${sprog}: mindst én "hul"-celle fundet paa tvaers af fladerne (bekraefter at paastanden nedenfor proever noget reelt)`,
      alleHulLier.length > 0, `fandt ${alleHulLier.length}`);

    const forkerteHuller = alleHulLier.filter(({ l }) => {
      const harVIkke = /class="v v-ikke"/.test(l.indhold);
      const erBogstaveligtNul = /<b class="num">\s*0\s*<\/b>/.test(l.indhold);
      const erTom = l.indhold.replace(/<[^>]+>/g, '').trim() === '';
      return !harVIkke || erBogstaveligtNul || erTom;
    });
    ok(`${sprog}: samtlige ${alleHulLier.length} "hul"-celler viser den stiplede v-ikke-tilstand (ikke tom, ikke et bogstaveligt 0)`,
      forkerteHuller.length === 0, `${forkerteHuller.length} celler afveg`);
  }

  fs.rmSync(udMappe, { recursive: true, force: true });
}
