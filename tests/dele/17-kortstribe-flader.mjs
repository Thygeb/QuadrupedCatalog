/**
 * tests/dele/17-kortstribe-flader.mjs — Aa28-vagten, omskrevet af spor/kort
 * 31. aug 2026.
 *
 * FORMAALET ER UAENDRET: katalogsiden (/robotter/), forsiden (/) og
 * producentsiderne (/producenter/<slug>/) maa ikke skride fra hinanden.
 * Det skete ved Aa28 (producentkortets KORT_FELTER manglede 'hastighed',
 * mens katalog/forsidens STRIBE havde fire felter), og det skete igen
 * 31. aug, da katalogsporet gav sit kort TYPESKILT-grammatikken uden at de
 * to andre flader fulgte med: samme robot, to udseender, afhaengigt af
 * hvilken side man moedte den paa. Begge gange blev det fundet ved at bygge
 * og kigge - ingen test daekkede det.
 *
 * HVAD DER BLEV MAALT FOER: de kompakte stribers feltorden, sammenlignet via
 * ikonets href (#i-vaegt ...), fordi etiket-TEKSTEN bevidst var forskellig
 * mellem fladerne (stribe_*-noeglerne mod felt_*-noeglerne) og en
 * tekstsammenligning derfor ville give permanent falsk roedt.
 *
 * HVORFOR DET IKKE KAN MAALES LAENGERE: ingen af de tre flader har en kompakt
 * stribe. Alle tre viser nu TYPESKILT-kortet - billede, producent,
 * produktnavn og et statusstempel, naar status ikke er "i produktion".
 * Vagten er derfor vendt til at sammenligne KORTETS GRAMMATIK i stedet for
 * stribens felter. Det er ikke en svaekkelse: den gamle udgave kunne kun se
 * uenighed inde i striben, mens den nye ser uenighed i hele kortet - og den
 * daekker nu ALLE TRE flader, hvor den gamle havde maattet lade kataloget
 * falde ud (det havde ingen stribe at sammenligne).
 *
 * Etiket-fælden fra den gamle udgave gaelder stadig og er grunden til, at
 * intet herunder sammenligner synlig tekst paa tvaers af flader: fladerne
 * skriver producentnavn og produktnavn ud fra de samme data, men sproget og
 * stien er forskellig. Sammenligningen sker derfor paa STRUKTUR (hvilke
 * klasser kortet baerer) og paa IDENTITET (robottens slug fra linket).
 *
 * Bygger sit eget dist i sin egen undermappe af ctx.tmp, jf. tests/LAESMIG.md.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

/** Robottens slug ud af et kortlink. Fladerne har hver sin dybde:
 *  katalog "unitree-go2/", forside "robotter/unitree-go2/",
 *  producent "../../robotter/unitree-go2/". Sidste ikke-tomme led er slug'en. */
function slugAf(href) {
  const led = href.split('/').filter((s) => s && s !== '..' && s !== '.');
  return led.length ? led[led.length - 1] : null;
}

/** Alle TYPESKILT-kort paa én side. Ét objekt pr. <article class="kort...">. */
function traekKort(html) {
  const ud = [];
  let fra = 0;
  for (;;) {
    const s = html.indexOf('<article class="kort', fra);
    if (s < 0) break;
    const e = html.indexOf('</article>', s);
    const blok = html.slice(s, e < 0 ? html.length : e);
    fra = (e < 0 ? html.length : e) + 10;

    const aabning = blok.slice(0, blok.indexOf('>') + 1);
    const link = blok.match(/<h3 class="kort__navn"><a href="([^"]*)"/);
    ud.push({
      // Ordret `<article class="kort">` er resultatgitterets kort. Varianter
      // (fx katalogets kort--seneste) har deres egen aabning og taelles for sig.
      ordret: aabning === '<article class="kort">',
      aabning,
      slug: link ? slugAf(link[1]) : null,
      harTekstblok: /<div class="kort__tekst">/.test(blok),
      harProd: /<p class="kort__prod">/.test(blok),
      harNavn: /<h3 class="kort__navn"><a href=/.test(blok),
      harStempel: /<span class="kort__mrk">/.test(blok),
      // BILLEDLEDDET, ikke <img>. Kortet har tre billedtilstande, og kun de to
      // foerste er et fotografi: rigtigt foto, fri plade - og MAALEPLADEN, som
      // tegnes for en robot uden brugbar optagelse (i dag xiaomi-cyberdog-1,
      // 76 af 77 filer har et billede). Maalepladen er ikke et hul, den er en
      // egen tilstand med laengde x hoejde og en .kunskaerm-forklaring, saa et
      // krav om <img> ville have doemt den korrekte tilstand som en fejl.
      // Det, vagten skal sikre, er at pladsen ALDRIG er tom.
      harBillede: /class="billedled/.test(blok),
      harFoto: /<picture|<img /.test(blok),
      // Det, der IKKE maa vaere tilbage fra det gamle kort.
      harStribe: /<ul class="stribe/.test(blok),
      harGammelKrop: /class="kort-krop"|class="kort-ophav"|class="kort-navn"|class="kort-invit"/.test(blok),
    });
  }
  return ud;
}

export default async function koer(ctx) {
  const { rod, tmp, node, ok } = ctx;

  console.log('\n17. Aa28-vagten: TYPESKILT-kortet er den SAMME komponent paa alle tre flader');

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
    const katalogHtml = laes(`${sprog}/robotter/index.html`);
    ok(`${sprog}/robotter/: katalogsiden blev bygget`, katalogHtml !== null);
    const forsideHtml = laes(`${sprog}/index.html`);
    ok(`${sprog}/: forsiden blev bygget`, forsideHtml !== null);

    const producentRod = path.join(udMappe, sprog, 'producenter');
    let producentKort = [];
    let producentSider = 0;
    if (fs.existsSync(producentRod)) {
      for (const m of fs.readdirSync(producentRod, { withFileTypes: true })) {
        if (!m.isDirectory()) continue;
        const f = path.join(producentRod, m.name, 'index.html');
        if (!fs.existsSync(f)) continue;
        producentSider++;
        producentKort = producentKort.concat(traekKort(fs.readFileSync(f, 'utf8')));
      }
    }

    const katalogKort = katalogHtml ? traekKort(katalogHtml) : [];
    const forsideKort = forsideHtml ? traekKort(forsideHtml) : [];

    const flader = [
      ['katalog', katalogKort],
      ['forside', forsideKort],
      ['producent', producentKort],
    ];

    ok(`${sprog}/producenter/: der blev fundet producentsider med kort (${producentSider} sider, ${producentKort.length} kort)`,
      producentSider > 0 && producentKort.length > 0);

    /* --- paastand 1: alle tre flader HAR kort. Uden det led ville hver eneste
       paastand nedenfor vaere sand om en tom liste. */
    for (const [navn, kort] of flader) {
      ok(`${sprog}/${navn}: der er kort at maale paa (${kort.length})`, kort.length > 0);
    }

    /* --- paastand 2: TYPESKILT-grammatikken, ens paa alle tre flader.
       Billede + producent + produktnavn i en .kort__tekst-blok. */
    for (const [navn, kort] of flader) {
      const mangler = kort.filter((k) => !(k.harTekstblok && k.harProd && k.harNavn && k.harBillede));
      const udenFoto = kort.filter((k) => !k.harFoto).length;
      ok(`${sprog}/${navn}: alle ${kort.length} kort har billedled + .kort__prod + .kort__navn i .kort__tekst (${udenFoto} paa maaleplade)`,
        kort.length > 0 && mangler.length === 0,
        mangler.length ? `${mangler.length} kort afveg, foerste: ${mangler[0].slug ?? mangler[0].aabning}` : '');
    }

    /* --- paastand 3: intet af det gamle kort er tilbage nogen steder.
       Det er den direkte vagt mod, at en flade falder tilbage - og mod at en
       NY flade bygges paa den gamle kopi. */
    for (const [navn, kort] of flader) {
      const gamle = kort.filter((k) => k.harStribe || k.harGammelKrop);
      ok(`${sprog}/${navn}: intet kort baerer den gamle stribe eller kort-krop/-ophav/-navn/-invit`,
        gamle.length === 0,
        gamle.length ? `${gamle.length} kort baerer gammel markup` : '');
    }

    /* --- paastand 4: statusstemplet foelger den SAMME regel paa alle flader.
       Det er den skarpeste drift-vagt, vi kan stille i dag: stemplet er den
       eneste forskel, kortet baerer, saa hvis to flader er uenige om, HVILKE
       robotter der stemples, er de skredet fra hinanden.

       Sammenligningen sker pr. slug, ikke pr. position: fladerne viser ikke
       de samme robotter (forsiden viser seks, kataloget alle 77), saa kun
       faellesmaengden kan sammenlignes. */
    const stempletPrFlade = new Map();
    for (const [navn, kort] of flader) {
      const m = new Map();
      for (const k of kort) if (k.slug) m.set(k.slug, k.harStempel);
      stempletPrFlade.set(navn, m);
    }
    const katalogStempel = stempletPrFlade.get('katalog');
    for (const navn of ['forside', 'producent']) {
      const m = stempletPrFlade.get(navn);
      const faelles = [...m.keys()].filter((s) => katalogStempel.has(s));
      const uenige = faelles.filter((s) => m.get(s) !== katalogStempel.get(s));
      ok(`${sprog}: ${navn} og katalog er enige om statusstemplet paa alle ${faelles.length} faelles robotter`,
        faelles.length > 0 && uenige.length === 0,
        uenige.length ? `uenige om: ${uenige.slice(0, 3).join(', ')}` : '');
    }

    /* --- paastand 5: stemplet er ikke bare konsistent, det SIDDER der ogsaa.
       Uden den her ville paastand 4 vaere sand, hvis ingen flade stemplede
       noget som helst. */
    const stemplede = katalogKort.filter((k) => k.harStempel).length;
    ok(`${sprog}/katalog: nogle kort baerer et statusstempel (${stemplede} af ${katalogKort.length})`,
      stemplede > 0 && stemplede < katalogKort.length,
      'stemplet laegges kun paa, naar status ikke er "i produktion" - 0 eller alle ville betyde, at reglen ikke virker');
  }

  fs.rmSync(udMappe, { recursive: true, force: true });
}
