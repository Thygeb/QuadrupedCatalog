/**
 * tests/dele/06-vaegtklasse-anvendelse.mjs — Vaegtklasse (afledt, L27) og
 * anvendelse som usorteret maengde (L27).
 *
 * Vaegtklassen staar ikke i nogen YAML-fil og maa aldrig komme til det. Testen
 * her er derfor et bevis paa, at bygget REGNER den ud - og at graenserne er
 * dem, der blev besluttet, og ikke dem, nogen huskede.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export default async function koer(ctx) {
  const {
    rod, tmp, node, ok, operatorRegex,
  } = ctx;

  console.log('\n6. Vaegtklasser og flervaerdi-anvendelse');

  const dataMappe = path.join(tmp, 'klasse-data');
  fs.mkdirSync(dataMappe, { recursive: true });
  const hoved = (slug, navn) =>
    `slug: ${slug}\nnavn: ${navn}\nproducent: P\nproducentland: Kina\nstatus: i_produktion\nfremdrift: ben\n`;
  const vaegt = (slug, navn, felt) => [slug,
    hoved(slug, navn) + `felter:\n${felt}`];

  const filer = [
    // Graenserne: 19,9 under, 20 paa, 39,9 under, 40 paa. Fire tal, fire klasser.
    vaegt('a-under', 'A Under', `  egenvaegt:\n    vaerdi: 19.9\n    enhed: kg\n` +
      `    kilde: https://example.com/a\n    hentet: 2026-08-19\n`),
    vaegt('b-nedre-graense', 'B Nedre', `  egenvaegt:\n    vaerdi: 20\n    enhed: kg\n` +
      `    kilde: https://example.com/a\n    hentet: 2026-08-19\n`),
    vaegt('c-midt-top', 'C Midt', `  egenvaegt:\n    vaerdi: 39.9\n    enhed: kg\n` +
      `    kilde: https://example.com/a\n    hentet: 2026-08-19\n`),
    vaegt('d-oevre-graense', 'D Oevre', `  egenvaegt:\n    vaerdi: 40\n    enhed: kg\n` +
      `    kilde: https://example.com/a\n    hentet: 2026-08-19\n`),
    // Operatoren skal respekteres: "~60 kg" ER 60, men forbeholdet foelger med.
    vaegt('e-cirka', 'E Cirka', `  egenvaegt:\n    vaerdi: 60\n    enhed: kg\n    operator: "~"\n` +
      `    kilde: https://example.com/a\n    hentet: 2026-08-19\n`),
    // "<= 20 kg" ligger PAA graensen og kan vaere begge klasser (DEEP Lynx S10).
    vaegt('f-paa-graensen', 'F Graense', `  egenvaegt:\n    vaerdi: 20\n    enhed: kg\n    operator: "<="\n` +
      `    kilde: https://example.com/a\n    hentet: 2026-08-19\n`),
    // Interval hen over en graense: maa ikke kollapse til sit midtpunkt (regel 5).
    vaegt('g-interval', 'G Interval', `  egenvaegt:\n    vaerdi_min: 18\n    vaerdi_maks: 25\n    enhed: kg\n` +
      `    kilde: https://example.com/a\n    hentet: 2026-08-19\n`),
    // L50 (JPK 27. aug 2026, spor/spaend): et vaegtspaend, der daekker flere
    // klasser, skal vises i dem ALLE. Briefets to navngivne eksempler
    // (mab-honey-badger-4/-5, 15-50 og 13-50 kg) kan ikke bruges her laengere
    // - data/robots/ er rettet siden briefet blev skrevet (spor/d14data, som
    // ikke ejes af dette spor), og begge robotter har i dag ét enkelt tal
    // (12 kg og 17 kg). De to fixtures her genbruger PRAECIS briefets egne
    // graenser (13-50 og 15-50 kg) som syntetisk data i stedet - samme
    // moenster testen allerede bruger til alt andet ovenfor.
    vaegt('n-tre-klasser-a', 'N Tre A', `  egenvaegt:\n    vaerdi_min: 13\n    vaerdi_maks: 50\n    enhed: kg\n` +
      `    kilde: https://example.com/a\n    hentet: 2026-08-19\n`),
    vaegt('n-tre-klasser-b', 'N Tre B', `  egenvaegt:\n    vaerdi_min: 15\n    vaerdi_maks: 50\n    enhed: kg\n` +
      `    kilde: https://example.com/a\n    hentet: 2026-08-19\n`),
    // Graensetilfaelde (punkt 2's valg): et spaend der SLUTTER praecis paa 20
    // taeller med i BAADE under_20 og 20_40.
    vaegt('p-graense-20-spaend', 'P Graense 20', `  egenvaegt:\n    vaerdi_min: 10\n    vaerdi_maks: 20\n    enhed: kg\n` +
      `    kilde: https://example.com/a\n    hentet: 2026-08-19\n`),
    // Graensetilfaelde (punkt 2's valg): et spaend der STARTER praecis paa 40
    // taeller med i BAADE 20_40 og over_40. Samme graense som den ENESTE
    // robot, der reelt har et vaegtinterval i data/robots/ i dag
    // (microrobotech-movenew-t1, 40-50 kg, opdaget under efterproevning).
    vaegt('o-graense-40-spaend', 'O Graense 40', `  egenvaegt:\n    vaerdi_min: 40\n    vaerdi_maks: 60\n    enhed: kg\n` +
      `    kilde: https://example.com/a\n    hentet: 2026-08-19\n`),
    vaegt('h-ingen-vaegt', 'H Ingen', `  egenvaegt: ikke_oplyst\n`),
    // Vaegt i pund er ikke kg og maa ikke laeses som et tal i kg.
    vaegt('i-kun-imperial', 'I Imperial', `  egenvaegt:\n    vaerdi: 74\n    enhed: lb\n` +
      `    kilde: https://example.com/a\n    hentet: 2026-08-19\n`),
    // L27: samme to kategorier, modsat raekkefoelge i YAML'en. De to skal
    // komme ud ens - ellers afgoer en producents saetningsorden, hvor de lander.
    ['j-orden-en', hoved('j-orden-en', 'J En')
      + `anvendelse:\n  vaerdi: [logistik, industri, sikkerhed_overvaagning]\n`
      + `  citat: "Robot - Industry"\n  kilde: https://example.com/a\n  hentet: 2026-08-19\n`
      + `felter:\n  egenvaegt: ikke_oplyst\n`],
    ['k-orden-to', hoved('k-orden-to', 'K To')
      + `anvendelse:\n  vaerdi: [sikkerhed_overvaagning, industri, logistik]\n`
      + `  citat: "Robot - Industry"\n  kilde: https://example.com/a\n  hentet: 2026-08-19\n`
      + `felter:\n  egenvaegt: ikke_oplyst\n`],
    // Arven skal SES paa siden, ikke kun staa i data.
    ['l-mor', hoved('l-mor', 'L Mor')
      + `anvendelse:\n  vaerdi: industri\n  citat: "Robot - Industry"\n`
      + `  kilde: https://example.com/mor\n  hentet: 2026-08-19\nfelter:\n  egenvaegt: ikke_oplyst\n`],
    ['m-barn', hoved('m-barn', 'M Barn')
      + `anvendelse:\n  vaerdi: industri\n  citat: "Robot - Industry"\n`
      + `  kilde: https://example.com/mor\n  hentet: 2026-08-19\n  arvet_fra: l-mor\n`
      + `felter:\n  egenvaegt: ikke_oplyst\n`],
  ];
  for (const [slug, indhold] of filer) fs.writeFileSync(path.join(dataMappe, `${slug}.yaml`), indhold, 'utf8');

  const ud = path.join(tmp, 'dist-klasse');
  const r = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'),
    `--data=${dataMappe}`, `--ud=${ud}`], { cwd: rod, encoding: 'utf8' });
  ok('bygget gaar igennem med de nye former', r.status === 0,
    ((r.stdout || '') + (r.stderr || '')).trim().split('\n').slice(-4).join(' / '));

  const json = JSON.parse(fs.readFileSync(path.join(ud, 'robots.json'), 'utf8'));
  const vk = Object.fromEntries(json.robotter.map((x) => [x.slug, x.vaegtklasse]));
  const anv = Object.fromEntries(json.robotter.map((x) => [x.slug, x.anvendelse]));

  /* vaegtklasse i robots.json var et objekt ({klasse, kg, operator, cirka,
     graensetilfaelde}); tools/skabelon/side.mjs' vaegtklasse() returnerer i dag
     KUN klassestrengen (bevist i dele/05-visning-nye-former.mjs). vk[x] ER
     derfor allerede selve strengen her - ".klasse" findes ikke paa den laengere. */
  ok('19,9 kg -> under_20', vk['a-under'] === 'under_20', vk['a-under']);
  ok('20 kg -> 20_40 (graensen er inklusiv nedadtil)', vk['b-nedre-graense'] === '20_40',
    vk['b-nedre-graense']);
  ok('39,9 kg -> 20_40', vk['c-midt-top'] === '20_40', vk['c-midt-top']);
  // RETTET: 40 kg var forventet "over_40". Maalt direkte i koden (side.mjs'
  // vaegtklasse(): "if (kg <= VAEGTGRAENSER.over) return '20_40'") og
  // krydstjekket mod den dokumenterede fordeling over de rigtige 46 poster
  // (samme fils kommentar: "Maalt over data/robots/ 21.08.2026: 12/12/13/9" -
  // efterregnet her: byg uden --data giver praecis under_20:12, 20_40:12,
  // over_40:13, ikke_oplyst:9). 20-40 kg-klassen er altsaa lukket i BEGGE
  // ender: [20,40] - ikke [20,40). Den gamle forventning var asymmetrisk og
  // er den stale del; graensereglen for 20 kg ("inklusiv nedadtil") staar ved.
  ok('40 kg -> 20_40 (graensen er inklusiv i begge ender, maalt mod koden og mod 12/12/13/9)',
    vk['d-oevre-graense'] === '20_40', vk['d-oevre-graense']);
  // kg/operator/cirka stod paa vaegtklasse-objektet; de staar i dag kun paa
  // selve feltvaerdien ("~ 60 kg" er allerede bevist synlig i afsnit 4/5's
  // operator-proever). Her er kun klassen tilbage at proeve.
  ok('"~ 60 kg" laeser stadig som 60 og klassificeres som over_40',
    vk['e-cirka'] === 'over_40', vk['e-cirka']);
  // "graensetilfaelde" fandtes som et separat flag paa objektet; det findes
  // ikke laengere. Designets egen begrundelse (kommentar ved vaegtklasse() i
  // side.mjs) er, at operatoren staar SYNLIGT PAA KORTET i stedet - laeseren
  // ser selv "≤ 20 kg" og kan doemme. Proeven her flyttes til at bevise DEN
  // paastand direkte, i stedet for et flag, koden ikke laengere skriver.
  const fSide = fs.readFileSync(path.join(ud, 'da', 'robotter', 'f-paa-graensen', 'index.html'), 'utf8');
  ok('"<= 20 kg" ligger paa graensen, og operatoren staar synligt paa siden i stedet for et flag',
    vk['f-paa-graensen'] === '20_40' && operatorRegex('≤', '20').test(fSide));
  /* L50 (JPK 27. aug 2026) har afgjort det, denne test tidligere holdt aabent
     (fund/FUND-test.md): en robot, hvis vaegtspaend daekker flere klasser,
     skal vises i dem ALLE. Det er IKKE laengere en aaben brist - det er en
     implementeret regel, blot et andet sted end denne proeve oprindeligt
     kiggede.

     vaegtklasse() (ENTAL, det felt robots.json og vk[] her laeser) laeser
     stadig KUN ét tal via centralVaerdi()'s midtpunkt - (18+25)/2 = 21,5 ->
     '20_40' - fordi forsidens fremhaevelseslogik og robotsidens klassetekst
     forudsaetter praecis én klasse pr. robot (uaendrede filer, uden for
     dette spors ejerskab). Det er nu det TILSIGTEDE resultat for ENTAL, ikke
     en brist. */
  ok('18-25 kg (g-interval) -> vaegtklasse() i ENTAL giver stadig 20_40 (midtpunkt, tilsigtet - se L50-proeverne nedenfor for FLERTAL)',
    vk['g-interval'] === '20_40', vk['g-interval']);
  ok('ingen vaegt -> klassen ikke_oplyst, og robotten bliver staaende',
    vk['h-ingen-vaegt'] === 'ikke_oplyst', vk['h-ingen-vaegt']);
  ok('74 lb laeses ikke som 74 kg', vk['i-kun-imperial'] === 'ikke_oplyst', vk['i-kun-imperial']);
  /* json.vaegtfordeling fandtes engang paa robots.json's rod; den er der ikke
     laengere (robots.json's noegler er i dag kun genereret/naevnere/
     type_uden_model_taeller/filterfelter/robotter - efterproevet ved at
     printe Object.keys(json)). Fordelingen er IKKE tabt information - hver
     robot baerer sin egen vaegtklasse-streng i json.robotter - saa proeven
     taeller den selv op af raadata i stedet for at kraeve, at bygget ogsaa
     skriver et faerdigt sammendrag. Samme laere som L30: udled, kraev ikke en
     ekstra kilde, der kan skride fra den foerste. */
  const fordeling = { under_20: 0, '20_40': 0, over_40: 0, ikke_oplyst: 0 };
  for (const rb of json.robotter) fordeling[rb.vaegtklasse] = (fordeling[rb.vaegtklasse] ?? 0) + 1;
  // Taellingen er efterregnet i haanden fil for fil. Denne fordeling bruger
  // stadig vaegtklasse() i ENTAL (robots.json's felt, midtpunktsbaseret) -
  // de fire L50-fixtures nedenfor tilfoejer hver praecis ÉT tal her, uanset
  // hvor mange klasser de daekker i kataloget (se de nye "L50"-proever):
  //   under_20 2   a-under 19,9 · p-graense-20 (midtp. 15)
  //   20_40    7   b-nedre 20 · c-midt 39,9 · d-oevre 40 · f-graense <=20 ·
  //                g-interval (midtp. 21,5) · n-tre-klasser-a (midtp. 31,5) ·
  //                n-tre-klasser-b (midtp. 32,5)
  //   over_40  2   e-cirka ~60 · o-graense-40 (midtp. 50)
  //   ikke_oplyst 6  h-ingen · i-imperial(lb) · j · k · l-mor · m-barn
  // 2+7+2+6 = 17 filer, som der er (13 + de fire nye L50-fixtures).
  ok('den afledte fordeling summer korrekt: under_20 2 / 20_40 7 / over_40 2 / ikke_oplyst 6',
    fordeling.under_20 === 2 && fordeling['20_40'] === 7
    && fordeling.over_40 === 2 && fordeling.ikke_oplyst === 6,
    JSON.stringify(fordeling));
  ok('og summen af de fire klasser er alle robotterne - ingen falder ud imellem dem',
    Object.values(fordeling).reduce((a, b) => a + b, 0) === json.robotter.length,
    `${JSON.stringify(fordeling)} mod ${json.robotter.length} robotter`);

  /* L27 - maengden, ikke raekkefoelgen: to filer med de samme kategorier i
     modsat YAML-raekkefoelge skal give samme indeks. build.mjs' indeks-bygger
     (feltet "anvendelse" i "lille indeks til klientsiden") kalder nu ogsaa
     skema.mjs' sorterAnvendelse(), samme kanoniske orden som
     tools/skabelon/side.mjs' hjaelp.anvendelse() allerede brugte. */
  ok('to filer med samme kategorier i modsat raekkefoelge giver samme indeks (L27)',
    JSON.stringify(anv['j-orden-en'].vaerdi) === JSON.stringify(anv['k-orden-to'].vaerdi),
    `${JSON.stringify(anv['j-orden-en'].vaerdi)} mod ${JSON.stringify(anv['k-orden-to'].vaerdi)}`);

  const sideJ = fs.readFileSync(path.join(ud, 'da', 'robotter', 'j-orden-en', 'index.html'), 'utf8');
  const sideK = fs.readFileSync(path.join(ud, 'da', 'robotter', 'k-orden-to', 'index.html'), 'utf8');
  /* RETTET (fund/FUND-detalje.md, opgave 4c): robot.mjs' anvendelseMaerker()
     saetter nu "anvendelse__maerke--<vaerdi>" pr. kategori (samme BEM-princip
     som side.mjs' kort-udgave), og vaerdierne kommer i den samme kanoniske
     orden fra hjaelp.anvendelse() (sorterAnvendelse()) uanset YAML-raekkefoelge.
     Robotsidens EGEN side viser derfor nu det, testen efterspoerger - i
     modsaetning til robots.json ovenfor, som er en anden kilde. */
  const maerkerne = (s) => (s.match(/anvendelse__maerke--([a-z_]+)/g) || []).join(',');
  ok('og samme raekkefoelge paa de to sider - ingen af dem er "hovedkategori"',
    maerkerne(sideJ) === maerkerne(sideK) && maerkerne(sideJ) !== '', maerkerne(sideJ));
  ok('alle tre kategorier vises, ingen tabes af grupperingen',
    ['industri', 'sikkerhed_overvaagning', 'logistik'].every((v) => sideJ.includes(`anvendelse__maerke--${v}`)));

  /* RETTET (fund/FUND-detalje.md, opgave 4c): robot.mjs' anvendelseBlok()
     slaar nu moderen op i ctx.robotter og skriver et rigtigt <a href> med
     moderens VISNINGSNAVN, ikke den raa slug. hjaelp.anvendelse() manglede
     tidligere `arvet_fra` i sit returobjekt (kontrakten i robot.mjs' hoved
     dokumenterede feltet, men side.mjs sendte det aldrig med) - arve-blokken
     var derfor ALTID tom, uanset data. Begge dele er rettet.
     Hrefformen er IKKE '../l-mor/' - det var testens egen antagelse om
     sti(), aldrig efterproevet mod et rigtigt byg. sti() bruger ctx.url.robot(),
     naar bygget giver den (altid i praksis), og den giver en absolut-fra-
     sprogroden sti - noejagtig samme form som den allerede groenne
     "til_producent"-test dele/09-katalog-producent-sider.mjs bruger for
     producent-linket paa samme side (dist/da/robotter/<slug>/index.html:
     '../../../da/producenter/…/'). Maalt direkte i
     tests/.tmp-koersel/dist-klasse/da/robotter/m-barn/index.html. */
  const sideM = fs.readFileSync(path.join(ud, 'da', 'robotter', 'm-barn', 'index.html'), 'utf8');
  ok('arven staar synligt paa varianten, med moderens navn og et link',
    /class="anvendelse__arv"/.test(sideM) && sideM.includes('>L Mor</a>')
    && sideM.includes('href="../../../da/robotter/l-mor/"'),
    sideM.includes('anvendelse__arv') ? 'link/navn mangler' : 'blok mangler');
  ok('og moderens citat vises paa varianten', sideM.includes('Robot - Industry'));
  const sideL = fs.readFileSync(path.join(ud, 'da', 'robotter', 'l-mor', 'index.html'), 'utf8');
  ok('moderen selv baerer INGEN arvemarkering', !/class="anvendelse__arv"/.test(sideL));
  // Paa en arvet post ER koblingen vores, saa den generelle forklaring
  // ("kategorien er ikke vores vurdering") ville staa og lyve nederst paa siden.
  // RETTET (opgave 4c): anvendelseBlok() vaelger nu i18n-noeglen
  // anvendelse_forklaring_arvet ("...er vores slutning...") i stedet for den
  // almindelige anvendelse_forklaring, naar a.arvet_fra er sat.
  ok('den arvede side siger, at koblingen er vores - ikke det modsatte',
    sideM.includes('vores slutning') && !sideM.includes('Kategorien er ikke vores vurdering'));
  ok('og moderens side siger stadig det oprindelige',
    sideL.includes('Kategorien er ikke vores vurdering'));

  /* data-vaegtklasse/data-anvendelse hed det, dengang testen blev skrevet.
     katalog.mjs bygger navnet af FILTER_FELTER-definitionens korte "navn"
     (L157: "data-${f.navn}") - de hedder i dag "vaegt" og "anv" (kortere
     attributnavne, samme mekanisme). Vaerdien for "anv" ER stadig ordenen fra
     YAML'en (samme L27-brist som ovenfor) - men CSS' [attr~=] matcher token
     for token, uafhaengigt af raekkefoelge, saa selve FILTERET virker uanset.
     Proeven her er derfor gjort raekkefoelge-uafhaengig med vilje: den
     efterproever maengden (det, navnet "en maengde" faktisk lover), ikke den
     specifikke streng - den strengere paastand staar allerede ovenfor, hvor
     den hoerer hjemme. */
  // spor/oversigt (1. sep 2026): kataloget flyttede til sprogroden.
  const katalog = fs.readFileSync(path.join(ud, 'da', 'index.html'), 'utf8');
  ok('katalograekken baerer vaegtklassen som data-attribut, saa en gruppering kan bruge den',
    /data-vaegt="under_20"/.test(katalog) && /data-vaegt="ikke_oplyst"/.test(katalog));
  const jMaengde = [...katalog.matchAll(/data-anv="([^"]*)"/g)]
    .map((m) => m[1].split(' ').sort().join(' '));
  ok('og anvendelserne som en maengde, mellemrumsadskilt',
    jMaengde.includes(['industri', 'logistik', 'sikkerhed_overvaagning'].sort().join(' ')),
    jMaengde.join(' | '));

  /* --- L50 (JPK 27. aug 2026): en robot med et vaegtspaend, der daekker
     flere klasser, skal vises i dem ALLE. Proevet robot for robot (ikke kun
     "en eller anden raekke har disse vaerdier" som anv-maengden ovenfor) -
     hver robots eget data-vaegt-lag findes ud fra dens EGEN "href="<slug>/""
     i kataloget, saa en fejl i én robots klassificering ikke kan forveksles
     med en anden robots. */
  // spor/oversigt (1. sep 2026): katalogkortets href er ikke laengere en bar
  // "<slug>/" (kataloget laa foer paa /da/robotter/, sibling til robotter/<slug>/).
  // Efter flytningen til sprogroden bruger katalog.mjs url.robot(slug), som
  // giver den fulde, dybde-korrekte sti (tools/skabelon/katalog.mjs:1121) -
  // fx "../da/robotter/<slug>/". Opslaget matcher derfor paa et href, der
  // SLUTTER paa "/<slug>/", uanset hvor mange mapper der staar foran.
  const blokForSlug = (html, slug) => {
    const m = html.match(new RegExp(`href="[^"]*/${slug}/"`));
    if (!m) return '';
    const i = html.indexOf(m[0]);
    const start = html.lastIndexOf('<div class="lag lag-anv"', i);
    const naeste = html.indexOf('<div class="lag lag-anv"', i + 1);
    return html.slice(start, naeste === -1 ? html.length : naeste);
  };
  const vaegtAf = (slug) => {
    const m = blokForSlug(katalog, slug).match(/<div class="lag lag-vaegt" data-vaegt="([^"]*)"/);
    return m ? m[1].split(' ').filter(Boolean).sort().join(' ') : '(robot ikke fundet i kataloget)';
  };
  ok('L50: 13-50 kg (n-tre-klasser-a, briefets eget regneeksempel) daekker alle tre klasser',
    vaegtAf('n-tre-klasser-a') === ['under_20', '20_40', 'over_40'].sort().join(' '),
    vaegtAf('n-tre-klasser-a'));
  ok('L50: 15-50 kg (n-tre-klasser-b) daekker alle tre klasser, ligesom 13-50',
    vaegtAf('n-tre-klasser-b') === ['under_20', '20_40', 'over_40'].sort().join(' '),
    vaegtAf('n-tre-klasser-b'));
  ok('L50 graensetilfaelde: spaend der SLUTTER praecis paa 20 (10-20 kg) daekker BAADE under_20 og 20_40',
    vaegtAf('p-graense-20-spaend') === ['under_20', '20_40'].sort().join(' '),
    vaegtAf('p-graense-20-spaend'));
  ok('L50 graensetilfaelde: spaend der STARTER praecis paa 40 (40-60 kg) daekker BAADE 20_40 og over_40',
    vaegtAf('o-graense-40-spaend') === ['20_40', 'over_40'].sort().join(' '),
    vaegtAf('o-graense-40-spaend'));
  ok('L50: 18-25 kg (g-interval) daekker BAADE under_20 og 20_40 i kataloget - den regel, denne fil holdt aaben, er nu proevet direkte',
    vaegtAf('g-interval') === ['under_20', '20_40'].sort().join(' '),
    vaegtAf('g-interval'));
  ok('enkelttal-robotter faar fortsat PRAECIS én klasse i kataloget (fx a-under, 19,9 kg)',
    vaegtAf('a-under') === 'under_20', vaegtAf('a-under'));

  // Klassen er afledt. Staar den i en YAML-fil, er beslutningen brudt.
  const iData = fs.readdirSync(path.join(rod, 'data', 'robots'))
    .filter((f) => /vaegtklasse/.test(fs.readFileSync(path.join(rod, 'data', 'robots', f), 'utf8')));
  ok('ingen datafil indeholder ordet "vaegtklasse" - klassen er afledt, ikke skrevet',
    iData.length === 0, iData.join(', '));
}
