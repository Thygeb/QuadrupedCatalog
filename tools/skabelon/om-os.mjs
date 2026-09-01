/**
 * tools/skabelon/om-os.mjs — /om/, udgiveren og metoden.
 *
 * NY SIDETYPE (spor/omos, L61, besluttet af JPK 31. aug 2026). Kontrakten
 * staar i side.mjs; denne fil skriver kun indholdet af <main>.
 *
 * ============================ HVAD SIDEN MAA SIGE ==========================
 *
 * L61 er bindende og snaever: Om-siden baerer KUN UDGIVERROLLEN. Hvem der
 * udgiver kataloget, hvorfor det findes, og hvordan tallene indsamles og
 * kildebelaegges.
 *
 * KeyResearch naevnes med navn, by og kontakt — men UDEN beskrivelse af
 * ydelser, UDEN ydelsesliste og UDEN link til salgssiden. Det er ikke
 * beskedenhed: KeyResearch er i virkeligheden en AI-konsulentvirksomhed, og
 * en Om-side, der beskriver konsulentforretningen paa et robotkatalog, goer
 * reelt kataloget til indgangen til den. Haard begraensning 1 siger, at siden
 * ALDRIG maa kunne laeses som en salgskanal. Skriv derfor aldrig en ydelse,
 * en case, en kunde eller et "kontakt os for et tilbud" ind her.
 *
 * MANGLENDE OPLYSNINGER UDELADES HELT. CVR, stiftelsesaar og team staar
 * ingen steder og maa IKKE markeres som "ikke oplyst". Det er den ene flade
 * paa sitet, hvor haard begraensning 5's tilstands-visning ikke gaelder: en
 * Om-side er prosa, ikke en datapost. Et stiplet "ikke oplyst" ud for CVR
 * ville vaere et hul, vi selv har gravet, i en tekst der ikke er et skema.
 *
 * CVR 10049385 MAA ALDRIG STAA HER. Det er INCUBA a/s' nummer — science-
 * parken, altsaa udlejeren, ikke KeyResearch. En researcher fandt det og var
 * ved at skrive det ind. Havde det staaet der, havde vi begaaet haard
 * begraensning 2 mod os selv, paa den ene side der handler om vores egen
 * troevaerdighed. Tilfoej ALDRIG et CVR-nummer her uden at have det fra
 * KeyResearch selv.
 *
 * ============================== TALLENE ====================================
 *
 * INTET TAL PAA DENNE SIDE ER SKREVET I HAANDEN. Hvert eneste regnes af
 * regnskab() nedenfor ud af det datasaet, bygget alligevel har i haenderne,
 * og saettes ind i i18n-strengen med hjaelp.saetInd(). Skrev vi "77 robotter"
 * som tekst i en noegle, ville siden vaere forkert den dag robot 78 lander,
 * og ingen ville opdage det — D7/L30, som allerede har kostet projektet to
 * runder. i18n-filernes egen header siger det samme: "Tal staar aldrig her".
 *
 * regnskab() baerer desuden en PAASTAND, bygget ikke overlever: de oplyste
 * plus de ikke oplyste skal give praecis felter x robotter. Gaar regnestykket
 * ikke op, er der en femte tilstand i data, som siden ikke fortaeller om, og
 * saa er hele regnskabsafsnittet en loegn. Derfor stopper bygget i stedet.
 *
 * ============================== FORMEN =====================================
 *
 * Retningen er TYPESKILT (L54/L57, retninger/nyverden/MANIFEST.md): faerre
 * streger, strammere gitter, haardere typografi. Paletten og skrifterne er
 * laast af D15 og varieres ikke her.
 *
 * MANIFESTET parrer to tryksager: "pladen og manualen er de to tryksager, en
 * industrimaskine faktisk kommer med" — Saira er pladen, Literata manualen.
 * Paa alle andre sider FOERER pladen, og Literata er henvist til noter og
 * billedtekster paa 11-14 px. Om-siden er sitets eneste prosaside, og den
 * vender parret om: manualen foerer i laesestoerrelse, og pladen braekker ind
 * som stansede tal i marginen. Det er derfor siden har en anden rytme end
 * katalogfladerne uden at have en anden identitet. Literata saettes stadig
 * ALDRIG som display — alle overskrifter er Saira, praecis som manifestet
 * kraever.
 *
 * DE NUMMEREREDE TRIN (01-04) er ikke pynt. Raekkefoelgen baerer betydning:
 * validatoren koerer EFTER indskrivningen, og bygget EFTER validatoren. Det
 * er DATAFLOW.md's egen sekvens, og et trin, der bytter plads, ville vaere en
 * anden metode. Var det en liste uden orden, skulle nummereringen vaere vaek.
 *
 * TEGNFORKLARINGEN ER GENBRUGT, IKKE TEGNET IGEN (hjaelp.tegnforklaring()).
 * De fire tilstande paa Om-siden skal vaere de SAMME marker, kataloget selv
 * saetter — ikke en tegning af dem. En kopi ville divergere ved foerste
 * aendring, og saa ville metodesiden beskrive en metode, sitet ikke laengere
 * foelger.
 */

import { esc } from './side.mjs';
import { FELTER, FELTNAVNE, tilstandAf, jaNejAf } from '../skema.mjs';

const attr = esc;

/**
 * KeyResearchs kontaktoplysninger. De FIRE nedenfor er de eneste, L61
 * tillader, og de er researchet 31. aug 2026. Opfind intet derudover —
 * heller ikke postnummer, etage, stiftelsesaar eller CVR (se filhovedet).
 *
 * De staar HER og ikke i i18n-filerne, fordi de er sprogneutrale kendsgerninger
 * paa linje med tallene: en adresse er ikke en oversaettelse. To kopier i to
 * sprogfiler ville kunne divergere, og saa ville den danske og den engelske
 * side oplyse hvert sit telefonnummer, uden at nogen test kunne se forskel.
 */
const UDGIVER = {
  navn: 'KeyResearch',
  adresse: 'Incuba, Åbogade 15, Aarhus',
  telefon: '+45 22231116',
  post: 'jpk@keyresearch.dk',
};

/** `+45 22231116` -> `+4522231116`. tel: taaler ikke mellemrum paa alle klienter. */
const telHref = (s) => `tel:${String(s).replace(/[^\d+]/g, '')}`;

/**
 * Sidens regnskab, udledt af kataloget selv.
 *
 * Opdelingen foelger samme laesning af en feltpost, som resten af bygget
 * bruger: en streng eller en `vaerdi`, der er en TILSTAND, er et hul eller et
 * svar; alt andet er en vaerdi. `taelKilder()` i build.mjs taeller de samme
 * kilder til byggets logudskrift, men springer tilstandene over og kan derfor
 * ikke svare paa "hvor mange felter er der i alt" — derfor denne, og derfor
 * paastanden nedenfor, som binder de to tal sammen.
 *
 * @param {Array} robotter  bygget's normaliserede robotter
 */
export function regnskab(robotter) {
  const felter = FELTNAVNE.length;
  let oplyst = 0; let io = 0;
  let medKilde = 0; let udenKilde = 0; let restSvar = 0;
  let primaer = 0; let sekundaer = 0;
  let nul = 0; let nej = 0;

  for (const r of robotter) {
    for (const n of FELTNAVNE) {
      const p = r.felter?.[n];
      const raa = p === undefined ? undefined : (typeof p === 'string' ? p : p.vaerdi);

      // Et felt, der slet ikke staar i filen, er praecis lige saa "ikke
      // oplyst" som et felt, der staar med ordet. Begge taelles med, ellers
      // ville regnestykket kunne gaa op paa et forkert grundlag.
      if (p === undefined || tilstandAf(raa) === 'ikke_oplyst') { io++; continue; }
      oplyst++;

      // Samme tredeling som taelKilder() i build.mjs, saa de to tal ALDRIG kan
      // vise hver sit: en TILSTAND (nej, kun_billede) er et svar uden et tal
      // at kilde og springes over; alt andet er en vaerdi, der enten baerer en
      // kilde eller ikke goer. udenKilde er det tal, hele siden hviler paa —
      // det skal vaere 0, og det er TAELT, ikke paastaaet.
      if (tilstandAf(raa) !== null) {
        restSvar++;
      } else if (typeof p === 'object' && p.kilde) {
        medKilde++;
        if (p.kildetype === 'sekundaer') sekundaer++; else primaer++;
      } else {
        udenKilde++;
      }

      // "nej" har to skrivemaader i data: tilstanden `nej` paa et vilkaarligt
      // felt, og et jaNej-felt med vaerdien falsk. Begge er DET SAMME SVAR og
      // skal taelles ét sted, ellers viser siden et for lavt tal.
      const erNej = FELTER[n].art === 'jaNej' ? jaNejAf(raa) === false : tilstandAf(raa) === 'nej';
      if (erNej) nej++;

      // Et MAALT nul, kun paa talfelter. jaNej-felter har ogsaa Number(false)
      // === 0, og at taelle dem med ville goere "0" til en tilstand, der
      // opstod af en typekonvertering frem for af en maaling.
      if (FELTER[n].art === 'tal' && Number(raa) === 0) nul++;
    }
  }

  return {
    robotter: robotter.length,
    producenter: new Set(robotter.map((r) => r.producent)).size,
    lande: new Set(robotter.map((r) => r.producentland).filter(Boolean)).size,
    felter,
    muligt: robotter.length * felter,
    oplyst,
    io,
    medKilde,
    udenKilde,
    restSvar,
    primaer,
    sekundaer,
    nul,
    nej,
  };
}

/** Tusindtalsgruppering efter sprogets egen skik. 1110 -> "1.110" / "1,110". */
const grupper = (n, sprog) => new Intl.NumberFormat(sprog === 'da' ? 'da-DK' : 'en-GB').format(n);

export function render(ctx) {
  const { i18n, hjaelp, sprog, robotter } = ctx;
  const { T, t, tf } = i18n;
  const { saetInd, tegnforklaring } = hjaelp;

  const r = regnskab(robotter);

  // BYGGET MAA IKKE OVERLEVE ET REGNSKAB, DER IKKE GAAR OP. Staar der en
  // femte tilstand i data, som hverken er "oplyst" eller "ikke oplyst", saa
  // lyver afsnittet "og de gaar op" — og det er praecis den slags stille
  // usandhed, hele siden lover at undgaa.
  if (r.oplyst + r.io !== r.muligt) {
    throw new Error(`BYGFEJL: Om-sidens regnskab gaar ikke op — ${r.oplyst} oplyst + ${r.io} `
      + `ikke oplyst = ${r.oplyst + r.io}, men ${r.felter} felter x ${r.robotter} robotter = ${r.muligt}.`);
  }
  // Anden halvdel af samme paastand: de oplyste skal fordele sig restloest paa
  // de tre, afsnittet naevner. Ellers staar der et kildetal paa siden, som
  // ikke daekker alt det, siden lige har kaldt "oplyst".
  if (r.medKilde + r.udenKilde + r.restSvar !== r.oplyst) {
    throw new Error(`BYGFEJL: Om-sidens kildeopgoerelse gaar ikke op — ${r.medKilde} med kilde + `
      + `${r.udenKilde} uden + ${r.restSvar} tilstandssvar = ${r.medKilde + r.udenKilde + r.restSvar}, `
      + `men ${r.oplyst} felter er oplyst.`);
  }

  const n = (x) => `<b class="figur">${esc(grupper(x, sprog))}</b>`;
  const tal = (x) => esc(grupper(x, sprog));

  /* --- hero ------------------------------------------------------------- */
  const hero = `<section class="om-hero">
<div class="rum">
<span class="etiket">${esc(t('om_etiket'))}</span>
<h1 class="t-hero om-hero__ord">${esc(t('om_titel'))}</h1>
<p class="om-lede">${esc(saetInd(t('om_lede'), {
    n: tal(r.robotter), p: tal(r.producenter), l: tal(r.lande),
  }))}</p>
</div>
</section>`;

  /* --- 1. regnskabet ------------------------------------------------------
     Sidens signatur. Tre tal, der SKAL give hinanden, sat som en stanset
     plade: det er den ene figur paa siden, hvor pladen faar lov at foere. */
  const regnskabSektion = `<section class="sektion om-sektion" aria-labelledby="om-h-regnskab">
<div class="rum om-lob">
<div class="om-ord">
<div class="sektion-hoved"><h2 class="t-h2" id="om-h-regnskab">${esc(t('om_regnskab_titel'))}</h2></div>
<p class="om-broed">${esc(saetInd(t('om_regnskab_broed'), {
    felter: tal(r.felter), n: tal(r.robotter), muligt: tal(r.muligt),
  }))}</p>
<p class="om-broed">${esc(saetInd(t('om_regnskab_kilder'), {
    k: tal(r.medKilde), o: tal(r.oplyst), a: tal(r.primaer),
    b: tal(r.sekundaer), r: tal(r.restSvar),
  }))}</p>
<p class="om-broed om-broed--slut">${esc(t('om_regnskab_note'))}</p>
</div>
<div class="om-mark">
<dl class="om-regnskab stans">
<div class="om-regnskab__raekke">
<dt>${esc(t('om_regnskab_oplyst'))}</dt><dd>${n(r.oplyst)}</dd>
</div>
<div class="om-regnskab__raekke">
<dt>${esc(t('om_regnskab_io'))}</dt><dd>${n(r.io)}</dd>
</div>
<div class="om-regnskab__raekke om-regnskab__raekke--sum">
<dt>${esc(t('om_regnskab_ialt'))}
<span class="etiket om-regnskab__ligning">${esc(saetInd(t('om_regnskab_ligning'), {
    felter: tal(r.felter), n: tal(r.robotter),
  }))}</span></dt><dd>${n(r.muligt)}</dd>
</div>
</dl>
</div>
</div>
</section>`;

  /* --- 2. metoden ---------------------------------------------------------
     Fire trin i den raekkefoelge, de faktisk sker i (DATAFLOW.md). <ol>, ikke
     <ul>: ordenen er data, ikke layout, og en skaermlaeser skal hoere den. */
  const trin = [1, 2, 3, 4].map((i) => `<li class="om-trin">
<span class="om-trin__nr figur" aria-hidden="true">${esc(String(i).padStart(2, '0'))}</span>
<div class="om-trin__ord">
<h3 class="t-h3 om-trin__titel">${esc(t(`om_metode_${i}_titel`))}</h3>
<p class="om-broed">${esc(saetInd(t(`om_metode_${i}_broed`), {
    felter: tal(r.felter), u: tal(r.udenKilde),
  }))}</p>
</div>
</li>`).join('\n');

  const metodeSektion = `<section class="sektion om-sektion" aria-labelledby="om-h-metode">
<div class="rum">
<div class="sektion-hoved"><h2 class="t-h2" id="om-h-metode">${esc(t('om_metode_titel'))}</h2></div>
<ol class="om-trinliste">
${trin}
</ol>
</div>
</section>`;

  /* --- 3. de fire tilstande ----------------------------------------------
     Prosaen forklarer HVORFOR; tegnforklaringen VISER dem, med kataloget
     egne marker. Genbrug, ikke gentegning — se filhovedet. */
  const tilstandeSektion = `<section class="sektion om-sektion" aria-labelledby="om-h-tilstande">
<div class="rum">
<div class="sektion-hoved"><h2 class="t-h2" id="om-h-tilstande">${esc(t('om_tilstande_titel'))}</h2></div>
<p class="om-broed om-broed--bred">${esc(saetInd(t('om_tilstande_broed'), {
    nul: tal(r.nul), nej: tal(r.nej),
  }))}</p>
<p class="om-broed om-broed--bred om-broed--slut">${esc(t('om_tilstande_noegle'))}</p>
</div>
<div class="rum om-tegn">
${tegnforklaring()}
</div>
</section>`;

  /* --- 4. hvad siden ikke goer -------------------------------------------
     FOERSTE linje er T.ingen_forhandler, ORDRET og fra den bestaaende noegle.
     PRODUCT.md linje 95-96 og 119-120 kraever, at netop den linje staar paa
     Om-siden. Den staar ogsaa i sidefoden paa hver eneste side; det er ikke
     en dublet ved et uheld, men den samme sandhed to steder, og her er den
     afsnittets paastand frem for en fodnote. Én noegle, saa de to aldrig kan
     komme til at sige forskellige ting. */
  const ikkeSektion = `<section class="sektion om-sektion" aria-labelledby="om-h-ikke">
<div class="rum">
<div class="sektion-hoved"><h2 class="t-h2" id="om-h-ikke">${esc(t('om_ikke_titel'))}</h2></div>
<p class="om-haard stans">${esc(T.ingen_forhandler)}</p>
<ul class="om-ikke">
<li class="om-broed">${esc(t('om_ikke_koeb'))}</li>
<li class="om-broed">${esc(t('om_ikke_score'))}</li>
<li class="om-broed">${esc(t('om_ikke_spor'))}</li>
</ul>
</div>
</section>`;

  /* --- 5. udgiveren -------------------------------------------------------
     Navn, by og kontakt. INTET om ydelser, ingen ydelsesliste, intet link til
     salgssiden — L61. Kontakten staar under overskriften "ret en oplysning",
     ikke som en henvendelsesknap: det er den eneste ramme, en kontakt kan
     have paa et katalog, der ikke maa kunne laeses som salgskanal. */
  const udgiverSektion = `<section class="sektion om-sektion om-udgiver" aria-labelledby="om-h-udgiver">
<div class="rum om-lob">
<div class="om-ord">
<div class="sektion-hoved"><h2 class="t-h2" id="om-h-udgiver">${esc(t('om_udgiver_titel'))}</h2></div>
<p class="om-broed">${esc(t('om_udgiver_broed'))}</p>
<p class="om-broed">${esc(t('om_udgiver_ret'))}</p>
</div>
<div class="om-mark">
<dl class="om-kort stans">
<div class="om-kort__raekke">
<dt class="etiket">${esc(t('om_udgiver_adresse'))}</dt>
<dd><span class="om-kort__navn">${esc(UDGIVER.navn)}</span>${esc(UDGIVER.adresse)}</dd>
</div>
<div class="om-kort__raekke">
<dt class="etiket">${esc(t('om_udgiver_telefon'))}</dt>
<dd><a href="${attr(telHref(UDGIVER.telefon))}">${esc(UDGIVER.telefon)}</a></dd>
</div>
<div class="om-kort__raekke">
<dt class="etiket">${esc(t('om_udgiver_post'))}</dt>
<dd><a href="${attr(`mailto:${UDGIVER.post}`)}">${esc(UDGIVER.post)}</a></dd>
</div>
</dl>
</div>
</div>
</section>`;

  return `${hero}
${regnskabSektion}
${metodeSektion}
${tilstandeSektion}
${ikkeSektion}
${udgiverSektion}`;
}
