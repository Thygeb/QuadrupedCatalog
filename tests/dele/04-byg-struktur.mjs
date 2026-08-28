/**
 * tests/dele/04-byg-struktur.mjs — Bygget: sidetal, hreflang, oversaettelse,
 * de fire tilstandes markoerer, operatorvisning, kilde+hentedato, robots.json's
 * naevner, og at kataloget staar fuldt renderet uden JavaScript.
 *
 * Bygger tests/eksempel-robotter (tre robotter) én gang og genbruger resultatet
 * (variablen `dist`) til alle proever i denne fil.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export default async function koer(ctx) {
  const {
    rod, tmp, node, ok, skema, operatorRegex, lasRobotter,
  } = ctx;

  console.log('\n4. Bygget');
  const dist = path.join(tmp, 'dist');
  const r = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'),
    `--data=${path.join(rod, 'tests', 'eksempel-robotter')}`, `--ud=${dist}`],
  { cwd: rod, encoding: 'utf8' });
  ok('build.mjs giver exit 0', r.status === 0, (r.stderr || '').trim());

  const sider = [];
  (function gaa(m) {
    for (const f of fs.readdirSync(m, { withFileTypes: true })) {
      const p = path.join(m, f.name);
      if (f.isDirectory()) gaa(p); else if (f.name.endsWith('.html')) sider.push(p);
    }
  })(dist);

  /* Sidetallet var haardkodet til 11, blev maalt til 17, saa 19 - hver gang
     forsidesporet aendrede build.mjs' sidestruktur, og et haandskrevet tal ville
     skride igen ved naeste aendring (samme laere som NAEVNER, STATUS.md L30).
     Formlen foelger den struktur, build.mjs selv skriver: én rodside (sprogvaelgeren
     paa /index.html) og, pr. sprog, forsiden, kataloget, SAMMENLIGNINGSSIDEN,
     én side pr. robot, og - naar producentskabelonen findes - producentindekset
     plus én side pr. UNIK producent. Robot- og producentantal laeses af
     proevedatasaettet selv (tests/eksempel-robotter), og sprogantallet af
     skema.SPROG, saa tallet foelger med, hvis dén data aendrer sig, i stedet for
     at kraeve en ny konstant her.
     VENDT (spor/lysbyg, retning LYS): leddet var "2" (forside + katalog) og er
     nu "3" - /sammenligning/ er en NY sidetype, tools/skabelon/sammenligning.mjs,
     bygget én gang pr. sprog uafhaengigt af robotantallet (klientside vaelger,
     se dens filhoved). Kravet er skaerpet, ikke sloejfet: formlen fanger stadig
     enhver fremtidig sidetype-aendring, praecis som foer. */
  const fixtureRobotter = lasRobotter(path.join(rod, 'tests', 'eksempel-robotter'));
  const fixtureProducenter = new Set(fixtureRobotter.map((rb) => rb.producent));
  // Samme gate som build.mjs L327 bruger for producenter/index.html - IKKE bare om
  // producent.mjs findes (build.mjs L309 kraever kun det for de ENKELTE producent-
  // sider), men om den ogsaa eksporterer renderIndeks(). De to gates er i dag ens i
  // udfald, men kun fordi producent.mjs faktisk har begge - proeven maaler den
  // rigtige betingelse i stedet for at antage det.
  const producentModul = await import(
    `file://${path.join(rod, 'tools', 'skabelon', 'producent.mjs').replace(/\\/g, '/')}`).catch(() => null);
  const harProducentindeks = typeof producentModul?.renderIndeks === 'function';
  const forventetSider = 1 + skema.SPROG.length * (3 + fixtureRobotter.length
    + (harProducentindeks ? 1 + fixtureProducenter.size : 0));
  ok(`${forventetSider} HTML-sider bygget, afledt af ${fixtureRobotter.length} robotter / `
    + `${fixtureProducenter.size} producenter / ${skema.SPROG.length} sprog + sammenligningssiden (fandt ${sider.length})`,
    sider.length === forventetSider);

  const katalogDa = fs.readFileSync(path.join(dist, 'da', 'robotter', 'index.html'), 'utf8');
  const katalogEn = fs.readFileSync(path.join(dist, 'en', 'robotter', 'index.html'), 'utf8');
  const spotDa = fs.readFileSync(path.join(dist, 'da', 'robotter', 'boston-dynamics-spot', 'index.html'), 'utf8');

  ok('hreflang da + en + x-default paa detaljesiden',
    /hreflang="da"/.test(spotDa) && /hreflang="en"/.test(spotDa) && /hreflang="x-default"/.test(spotDa));
  ok('katalogets to sprog er reelt oversat (ikke samme tekst)',
    katalogDa.includes('Alle robotter') && katalogEn.includes('All robots'));
  // Landenavne er tekst og skal komme fra sprogfilen, ikke fra robottens YAML.
  ok('landenavne er oversat paa /en/ (Schweiz -> Switzerland)',
    katalogEn.includes('>Switzerland<') && !katalogEn.includes('>Schweiz<'));
  ok('ingen data-en-attributter noget sted i dist/',
    !sider.some((f) => /data-en\s*=/.test(fs.readFileSync(f, 'utf8'))));
  ok('ingen henvisning til media/ i dist/',
    !sider.some((f) => /["'(\/]media\//.test(fs.readFileSync(f, 'utf8'))));
  ok('ingen koebsknap eller affiliate-link i dist/',
    !sider.some((f) => /(affiliate|utm_|buy[-_ ]now|koeb nu)/i.test(fs.readFileSync(f, 'utf8'))));

  // De fire tilstande skal SE forskellige ud. Klassenavnene her er "tilstand--X" og
  // "maerke--nul" - det var den gamle navngivning. Designsystemet blev lagt om
  // (DESIGN.md), og den navngivning findes i dag KUN i de to doede CSS-filer
  // (assets/stil.css, assets/sider.css), som intet byg nogensinde laeser.
  // tools/skabelon/side.mjs' faelles tilstand()/tal()-funktioner skriver v-ikke/
  // v-nej/v-billede/v-nul i dag (bruges af baade katalog.mjs og robot.mjs). Kravet
  // er uaendret - fire tilstande, hver sin markoer - kun navnene er rettet til dem,
  // koden faktisk skriver.
  const markoerer = ['v-ikke', 'v-nej', 'v-billede', 'v-nul'];
  ok('alle fire tilstande har hver sin markoer i katalogets forklaring',
    markoerer.every((m) => katalogDa.includes(m)),
    markoerer.filter((m) => !katalogDa.includes(m)).join(', '));
  // dist/stil.css findes ikke og har aldrig eksisteret i dette byg - build.mjs
  // kopierer system.css og generator.css (se dets <link>-tags i skal()), som ogsaa
  // er de to filer, browseren rent faktisk henter. At laese en fil ved navn
  // stil.css var den direkte aarsag til, at hele testpakken crashede paa en
  // uhaandteret ENOENT, i stedet for at fejle paa selve paastanden.
  const css = fs.readFileSync(path.join(dist, 'system.css'), 'utf8')
    + fs.readFileSync(path.join(dist, 'generator.css'), 'utf8');
  ok('CSS giver hver tilstand sin egen regel (ikke kun farve)',
    markoerer.every((m) => new RegExp(`\\.${m.replace(/-/g, '\\-')}\\s*[,{]`).test(css)),
    markoerer.filter((m) => !new RegExp(`\\.${m.replace(/-/g, '\\-')}\\s*[,{]`).test(css)).join(', '));

  // "> 40 kg", ikke "40 kg" (regel 4). Testen laeser hele udtrykket, saa den ogsaa
  // fanger, hvis operatoren skulle havne et andet sted end foran tallet.
  // Klassen hed "operator" og stod som synlig tekst mellem operator og tal;
  // den hedder "op" i dag, er aria-hidden (billedskrift), og en saerskilt
  // ".kunskaerm"-tekst ("mere end ") baerer betydningen for skaermlaesere, mens
  // tallet selv staar i <b class="num">. Rettet mod tools/skabelon/side.mjs' tal().
  ok('operatoren vises foran tallet: "> 40 kg"',
    operatorRegex('&gt;', '40', 'kg').test(
      fs.readFileSync(path.join(dist, 'da', 'robotter', 'unitree-b2', 'index.html'), 'utf8')));
  ok('advarslen staar ved siden af vaerdien paa detaljesiden',
    /class="advarsel advarsel--/.test(spotDa) && spotDa.indexOf('class="advarsel advarsel--') > spotDa.indexOf('43,3 in'));
  // Herkomsten (kilde+hentedato) staar ikke laengere gentaget ved hvert tal - den
  // staar ÉN gang pr. unik URL i en delt <ul class="kildeliste"> (class="dato"),
  // og hvert tal baerer kun en let overskrift-markoer (class="kildemaerke"), der
  // linker til den. Samme garanti (hvert tal kan foelges til kilde+dato), anden
  // form - se lavKilder() i tools/skabelon/side.mjs.
  ok('kilde og hentedato staar paa hvert tal',
    (spotDa.match(/class="kildemaerke/g) || []).length >= 5
    && (spotDa.match(/class="dato"/g) || []).length >= 1);
  // Vendt om med L30. Reglen var "vis begge naevnere"; den er nu "vis én", og det
  // beviser sig bedst der, hvor tallet FAKTISK naar en laeser. Maalt 21. aug 2026:
  // taethedsblokken i build.mjs' midlertidigRobotside er doed kode, fordi
  // tools/skabelon/robot.mjs har overtaget robotsiden og ikke tegner tallet. Eneste
  // levende vej ud er robots.json. Proeven staar derfor paa robots.json og faelder
  // desuden siden, hvis den nogensinde begynder at trykke en anden naevner.
  const json = JSON.parse(fs.readFileSync(path.join(dist, 'robots.json'), 'utf8'));
  ok('robots.json baerer praecis én naevner',
    Array.isArray(json.naevnere) && json.naevnere.length === 1,
    JSON.stringify(json.naevnere));
  ok('og hver robots taethed er opgjort paa netop den ene naevner',
    json.robotter.every((rb) => Object.keys(rb.taethed).length === 1
      && Number(Object.keys(rb.taethed)[0]) === json.naevnere[0]),
    JSON.stringify(json.robotter.map((rb) => rb.taethed)));
  ok('detaljesiden trykker ingen fremmed naevner (fx 5/29 eller 5/31)',
    !/\b\d+\/(?:29|31)\b/.test(spotDa));
  ok('robots.json har de tre robotter', json.robotter.length === 3);
  ok('robots.json er et lille indeks, ikke hele datasaettet',
    JSON.stringify(json).length < 8000, `${JSON.stringify(json).length} tegn`);

  /* Uden JavaScript: hele kataloget skal staa fuldt renderet, og FILTRENE skal
     virke uden JS - det er selve pointen i den nye "styr"-mekanik (CSS :has()
     paa afkrydsningsfelter, se tools/skabelon/katalog.mjs' kommentar L1-10).
     Kataloget stod som <table><tr data-slug=...>; det staar i dag som
     <article class="kort"> pr. robot - talt paa samme maade som andre steder
     i denne fil (taelKort() i build.mjs). Og filterFORMULAREN er ikke laengere
     skjult for JS (den var det, indtil "styr" blev CSS-baaret) - kun
     fritekstsoegningen er, fordi soegning ikke kan skrives i ren CSS
     (assets/katalog.js' egen kommentar: "Filtrene virker uden JavaScript"). */
  const kort = (katalogDa.match(/<article class="kort/g) || []).length;
  ok('kataloget staar fuldt renderet i HTML uden JS (3 kort)', kort === 3, `fandt ${kort}`);
  ok('filterformularen ("styr") findes og er IKKE skjult - CSS-filtrene skal virke uden JS',
    /<form class="styr" id="styr"/.test(katalogDa) && !/<form class="styr" id="styr"[^>]*hidden/.test(katalogDa));
  ok('kun fritekstsoegningen er skjult, indtil JS taender den (resten af filteret kan ikke det)',
    /<div class="sog" data-sog="katalog" hidden>/.test(katalogDa));
}
