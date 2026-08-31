/**
 * tests/dele/37-topbar.mjs — spor/topbar, 31. aug 2026.
 *
 * Daekket (`.daek`) erstattede baandet (`.baand`) og bygger comp'ens form
 * (retninger/nyverden/katalog.html) med den nuvaerende menus indhold.
 *
 * Topbaren staar paa ALLE byggede sider. Det er derfor den ene komponent,
 * hvor en fejl ikke rammer én flade, men hele siden - og hvor en vagt, der
 * kun ser paa forsiden, ikke er en vagt. Hver proeve her gaar derfor gennem
 * HVER bygget side, ikke gennem én stikproeve.
 *
 * De syv ting, denne del beviser, og hvad hver af dem koster, hvis den
 * falder:
 *
 *   1. Komponenten er skiftet HELT. Ét daek, nul baand, paa hver side.
 *      Falder den: de to komponenter lever side om side, og 31.9-31.12
 *      maaler et baand, ingen side bruger.
 *   2. Skip-linket er stadig FOERSTE element i <body>, og SPRITE staar lige
 *      efter. Falder den: tastaturbrugeren lander i navigationen i stedet
 *      for at kunne springe den over, og ikonerne tegnes ikke.
 *   3. Ordmaerket foerer til sprogets forside.
 *   4. Hoejst ét aria-current="page" i daekket. Falder den: skaermlaeseren
 *      melder to aktive sider.
 *   5. Sprogskifteren peger paa den TILSVARENDE side i det andet sprog, og
 *      den side FINDES. Falder den: sprogskiftet smider brugeren paa 404 -
 *      og det er praecis den fejl, en relativ sti laver, naar dybden aendres.
 *   6. HVER navigationslaenke peger paa en side, der findes. Det er L58's
 *      vagt: Nyheder, Services og Om os er BESLUTTEDE, men ikke byggede, og
 *      den dag nogen laegger dem i nav-arrayet uden en side, skal det fejle
 *      her - ikke hos en bruger.
 *   7. Navigationens aria-label er ikke katalogets. Det gamle baand satte
 *      aria-label til T.nav_katalog, saa hele sidens navigation blev
 *      annonceret som "Katalog".
 *
 * Plus én vagt paa en AABEN BESLUTNING, ikke paa kode: stemplet
 * "midlertidigt navn". Navn og domaene er ikke valgt (PRODUCT.md, Brand
 * Commitments). Vagt 37.9 findes for at stemplet ikke kan forsvinde tavst -
 * den skal slettes SAMMEN med beslutningen, ikke foer den.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

export default async function koer(ctx) {
  const {
    rod, tmp, node, ok, skema,
  } = ctx;

  console.log('\n37. Daekket oeverst (spor/topbar)');

  const sys = fs.readFileSync(path.join(rod, 'assets', 'system.css'), 'utf8');
  const da = JSON.parse(fs.readFileSync(path.join(rod, 'data', 'i18n', 'da.json'), 'utf8'));
  const en = JSON.parse(fs.readFileSync(path.join(rod, 'data', 'i18n', 'en.json'), 'utf8'));

  // Egen dist, som del 04 goer det: proeven maa ikke afhaenge af, at nogen har
  // koert tools/build.mjs i forvejen, og maa ikke roere den rigtige dist/.
  const dist = path.join(tmp, 'dist-topbar');
  const r = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'),
    `--data=${path.join(rod, 'tests', 'eksempel-robotter')}`, `--ud=${dist}`],
  { cwd: rod, encoding: 'utf8' });
  ok('37.0: build.mjs giver exit 0', r.status === 0, (r.stderr || '').trim());

  const sider = [];
  (function gaa(m) {
    for (const f of fs.readdirSync(m, { withFileTypes: true })) {
      const p = path.join(m, f.name);
      if (f.isDirectory()) gaa(p); else if (f.name.endsWith('.html')) sider.push(p);
    }
  })(dist);
  // Rodsiden (/index.html, sprogvaelgeren) har ikke skallen - den er en ren
  // omdirigering. Daekket findes paa alle ANDRE sider.
  const medSkal = sider.filter((f) => path.relative(dist, f).includes(path.sep));
  ok('37.0b: der er sider at maale paa', medSkal.length > 0,
    `fandt ${medSkal.length} sider under et sprogpraefiks`);

  const laes = (f) => fs.readFileSync(f, 'utf8');
  const navn = (f) => path.relative(dist, f).replace(/\\/g, '/');

  /* --- 1. Komponenten er skiftet HELT ----------------------------------- */
  {
    const udenDaek = medSkal.filter((f) => !/<header class="daek">/.test(laes(f)));
    ok(`37.1: alle ${medSkal.length} sider har <header class="daek">`,
      udenDaek.length === 0, `mangler paa: ${udenDaek.slice(0, 3).map(navn).join(', ')}`);
    const medBaand = sider.filter((f) => /class="baand"/.test(laes(f)));
    ok('37.2: ingen side har det gamle <header class="baand">',
      medBaand.length === 0, `staar endnu paa: ${medBaand.slice(0, 3).map(navn).join(', ')}`);
  }

  /* --- 2. Skip-linket foerst, SPRITE lige efter ------------------------- */
  {
    // Raekkefoelgen er selve kravet, ikke bare tilstedevaerelsen: et skip-link
    // EFTER navigationen springer ingenting over.
    const brud = medSkal.filter((f) => {
      const h = laes(f);
      const kropp = h.indexOf('<body>');
      const spring = h.indexOf('<a class="spring"', kropp);
      const sprite = h.indexOf('<svg width="0" height="0"', kropp);
      const daek = h.indexOf('<header class="daek">', kropp);
      return !(kropp >= 0 && spring > kropp && sprite > spring && daek > sprite);
    });
    ok('37.3: skip-link, derefter SPRITE, derefter daekket - paa hver side',
      brud.length === 0, `raekkefoelgen brudt paa: ${brud.slice(0, 3).map(navn).join(', ')}`);
  }

  /* --- 3.-7. Daekkets indre, side for side ------------------------------ */
  {
    const findes = (fra, href) => {
      // href er relativ til sidens egen mappe og ender paa "/" (en mappe med
      // index.html) - samme opslag, en browser ville lave.
      const maal = path.resolve(path.dirname(fra), href.replace(/\/$/, ''));
      return fs.existsSync(path.join(maal, 'index.html')) || fs.existsSync(maal);
    };
    const daekAf = (h) => h.slice(h.indexOf('<header class="daek">'),
      h.indexOf('</header>'));

    const fejl3 = []; const fejl4 = []; const fejl5 = []; const fejl6 = []; const fejl7 = [];
    for (const f of medSkal) {
      const rel = navn(f);
      const sprog = rel.split('/')[0];
      const sti = rel.split('/').slice(1, -1).join('/');
      const d = daekAf(laes(f));

      // 3. Ordmaerket foerer til sprogets forside.
      const ordmaerke = d.match(/<a class="daek__navn" href="([^"]+)"/);
      if (!ordmaerke || !findes(f, ordmaerke[1])
        || path.resolve(path.dirname(f), ordmaerke[1]) !== path.join(dist, sprog)) {
        fejl3.push(`${rel} -> ${ordmaerke ? ordmaerke[1] : 'intet ordmaerke'}`);
      }

      // 4. Hoejst ét aria-current="page".
      const aktive = (d.match(/aria-current="page"/g) || []).length;
      if (aktive > 1) fejl4.push(`${rel}: ${aktive}`);

      // 5. Sprogskifteren: det aktuelle sprog er et <span> uden href, det
      //    andet er et <a>, der peger paa SAMME sti under det andet sprog -
      //    og den side findes.
      const nu = d.match(new RegExp(`<span class="daek__sprogkode" aria-current="true" lang="${sprog}">`));
      if (!nu) fejl5.push(`${rel}: aktuelt sprog er ikke et <span> med aria-current`);
      for (const andet of skema.SPROG.filter((s) => s !== sprog)) {
        const m = d.match(new RegExp(`<a class="daek__sprogkode" href="([^"]+)" hreflang="${andet}"`));
        if (!m) { fejl5.push(`${rel}: intet link til ${andet}`); continue; }
        const forventet = path.join(dist, andet, sti);
        if (path.resolve(path.dirname(f), m[1]) !== forventet) {
          fejl5.push(`${rel}: ${andet} peger paa ${m[1]}, ikke paa ${andet}/${sti}`);
        } else if (!findes(f, m[1])) {
          fejl5.push(`${rel}: ${andet}/${sti} findes ikke i dist`);
        }
      }

      // 6. Hver navigationslaenke peger paa en side, der findes. L58's vagt.
      for (const m of d.matchAll(/<li><a href="([^"]+)"/g)) {
        if (!findes(f, m[1])) fejl6.push(`${rel} -> ${m[1]}`);
      }

      // 7. Navigationens aria-label er ikke katalogets.
      const etiket = d.match(/<nav class="daek__nav" aria-label="([^"]*)"/);
      const katalogNavn = sprog === 'da' ? da.nav_katalog : en.nav_katalog;
      if (!etiket || etiket[1] === katalogNavn || etiket[1] === '') {
        fejl7.push(`${rel}: ${etiket ? etiket[1] : 'ingen aria-label'}`);
      }
    }
    ok('37.4: ordmaerket foerer til sprogets forside paa hver side',
      fejl3.length === 0, fejl3.slice(0, 3).join(' | '));
    ok('37.5: hoejst ét aria-current="page" i daekket',
      fejl4.length === 0, fejl4.slice(0, 3).join(' | '));
    ok('37.6: sprogskifteren peger paa den tilsvarende side, og den findes',
      fejl5.length === 0, fejl5.slice(0, 3).join(' | '));
    ok('37.7: hver navigationslaenke peger paa en side, der findes (L58)',
      fejl6.length === 0, fejl6.slice(0, 3).join(' | '));
    ok('37.8: navigationens aria-label er ikke katalogets',
      fejl7.length === 0, fejl7.slice(0, 3).join(' | '));
  }

  /* --- 8. Den aabne beslutning ----------------------------------------- */
  {
    // Navn og domaene er ikke valgt (PRODUCT.md, Brand Commitments). Stemplet
    // ER den aabne beslutning gjort synlig. SLET DENNE VAGT SAMMEN MED
    // BESLUTNINGEN, ikke foer den: forsvinder stemplet uden at nogen har
    // valgt et navn, er beslutningen ikke truffet - den er bare skjult.
    const uden = medSkal.filter((f) => !/<span class="daek__stempel[^"]*">[^<]+<\/span>/.test(laes(f)));
    ok('37.9: "midlertidigt navn"-stemplet staar paa hver side (aaben beslutning)',
      uden.length === 0, `mangler paa: ${uden.slice(0, 3).map(navn).join(', ')}`);
    // Formen er systemets egen stansede kant, ikke en ny ramme opfundet til
    // lejligheden - og ikke den stiplede, som betyder "ikke oplyst".
    ok('37.9b: stemplet baerer .stans (systemets indfaeldede kant), ikke en stiplet ramme',
      medSkal.every((f) => /class="daek__stempel stans"/.test(laes(f)))
        && !/\.daek__stempel\{[^}]*dashed/.test(sys),
      'stiplet er "ikke oplyst"-tilstandens sprog og maa ikke betyde to ting');
  }

  /* --- 9. Kilden: de to nye noegler og daekkets skrift ------------------ */
  {
    for (const n of ['nav_etiket', 'sprog_etiket']) {
      ok(`37.10.${n}: noeglen findes i BEGGE sprogfiler`,
        n in da && n in en, `da:${n in da} en:${n in en}`);
    }
    // Comp'ens daek er sat i Saira ("Pladen"). Sidens body-skrift er stadig
    // --sans; uden denne erklaering staar topbaren i en anden skrift end den
    // comp, den er bygget efter - og det er den ENE forskel, der ikke kan
    // ses paa et diff, men springer i oejnene paa et skud.
    ok('37.11: daekket er sat i --mono (Saira, "Pladen")',
      /\.daek\{[^}]*font-family:var\(--mono\)/.test(sys),
      'ellers staar topbaren i en anden skrift end comp\'en');
    // Maalet: daekket deler .rum med resten af siden, saa ordmaerket flugter
    // med indholdet under det. Comp'ens egne 1320/24 ville sende dem fra
    // hinanden paa hver eneste side.
    ok('37.12: daekkets raekke baerer ogsaa .rum, saa maalet er sidens eget',
      /<div class="daek__ramme rum">/.test(laes(medSkal[0])),
      'uden .rum flugter ordmaerket ikke med overskriften under det');
  }
}
