/**
 * tests/dele/76-produkort.mjs — producentsidens CE-opgoerelse viser TRE
 * tilstande, ikke to (spor/produkort, 3. sep 2026).
 *
 * FEJLEN, DER VOGTES IMOD: producent.mjs' euSaetning() trykte kun t.ja og
 * t.i_alt fra ceOpgoerelse(). t.nej og t.ukendt blev regnet og smidt vaek, saa
 * Xiaomis producentside stod med "0 af 2" — og CyberDog 2's DOKUMENTEREDE nej
 * (ce_oplyst.vaerdi: false, med kilde, hentedato og en advarsel der ordret
 * siger "DOKUMENTERET NEJ, ikke et hul") blev umuligt at skelne fra de
 * modeller, producenten intet siger om. Det er haard begraensning 5:
 * "'Ikke oplyst', 'nej' og '0' er tre forskellige tilstande og skal se
 * forskellige ud. Det er der, katalogsider lyver."
 *
 * Fejlen stod paa 25 producentsider og var fladens eneste opgoerelse af CE —
 * der er intet "ét klik vaek" (fund/PLAN-producent.md, afsnit 4.3).
 *
 * FIXTUREN ER RIGTIGE DATA, ikke opdigtede: de to xiaomi-filer kopieres fra
 * data/robots/, saa testen faktisk daekker den producent, fejlen blev fundet
 * paa. Havde fixturen vaeret syntetisk, kunne den vise et nej, uden at Xiaomis
 * egen side gjorde det. Boston Dynamics (kun "ikke oplyst") og ANYbotics
 * (kun "ja") er kontrolgrupperne — én i hver retning.
 *
 * Bygger sin egen dist i tmp, jf. tests/LAESMIG.md: ingen del maa antage, at
 * en anden del har bygget noget foerst.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

/** EU-sektionens raa HTML paa en bygget producentside. */
function euSektion(dist, sprog, slug) {
  const fil = path.join(dist, sprog, 'producenter', slug, 'index.html');
  if (!fs.existsSync(fil)) return null;
  const h = fs.readFileSync(fil, 'utf8');
  const i = h.indexOf('id="eu-h"');
  if (i < 0) return null;
  const j = h.indexOf('</section>', i);
  return h.slice(i, j < 0 ? undefined : j);
}

/** Tegner sektionen tilstanden `klasse` (v-ja / v-nej / v-ikke)? */
function viserTilstand(sektion, klasse) {
  return typeof sektion === 'string' && sektion.includes(`v ${klasse}`);
}

/** Antal "{n} af {m}"-tal-led, dvs. antal tilstandslinjer. */
function antalLinjer(sektion) {
  return typeof sektion === 'string'
    ? (sektion.match(/<b class="eu-fund-tal">/g) || []).length
    : 0;
}

export default async function koer(ctx) {
  const { rod, tmp, node, ok } = ctx;

  // --- fixturen: fire robotter, tre producenter, tre CE-tilstande ----------
  const fixture = path.join(tmp, 'fixture-produkort');
  fs.rmSync(fixture, { recursive: true, force: true });
  fs.mkdirSync(fixture, { recursive: true });

  const fraData = ['xiaomi-cyberdog-1.yaml', 'xiaomi-cyberdog-2.yaml'];
  for (const f of fraData) {
    fs.copyFileSync(path.join(rod, 'data', 'robots', f), path.join(fixture, f));
  }
  for (const f of ['boston-dynamics-spot.yaml', 'anybotics-anymal.yaml']) {
    fs.copyFileSync(path.join(rod, 'tests', 'eksempel-robotter', f), path.join(fixture, f));
  }

  const dist = path.join(tmp, 'dist-produkort');
  const b = spawnSync(node, [path.join(rod, 'tools', 'build.mjs'),
    `--data=${fixture}`, `--ud=${dist}`], { cwd: rod, encoding: 'utf8' });
  // Haard fejl, ikke en taellet paastand — samme valg som dele/09: et fejlet
  // byg er ikke et testresultat, det er et miljoenedbrud.
  if (b.status !== 0) {
    throw new Error(`produkort-fixture: byg fejlede (exit ${b.status}) - ${(b.stderr || '').trim()}`);
  }

  console.log('\n76. Producentsidens CE-opgoerelse: tre tilstande, ikke to');

  // --- 76.1-76.2: det dokumenterede nej er synligt, paa BEGGE sprog -------
  // Kernen. Xiaomi har praecis én model med vaerdi:false og én, der intet
  // siger; foer rettelsen stod der "0 af 2" og INTET v-nej paa nogen af dem.
  for (const sprog of ['da', 'en']) {
    const s = euSektion(dist, sprog, 'xiaomi');
    ok(`76.${sprog === 'da' ? 1 : 2}: Xiaomis CE-opgoerelse (${sprog}) tegner det dokumenterede nej som sin egen tilstand`,
      viserTilstand(s, 'v-nej'),
      s === null ? 'ingen EU-sektion bygget' : `v-nej=${viserTilstand(s, 'v-nej')} · linjer=${antalLinjer(s)}`);
  }

  // --- 76.3: og de to tilstande staar som TO linjer, ikke ét sammenlagt tal
  {
    const s = euSektion(dist, 'da', 'xiaomi');
    ok('76.3: Xiaomi viser to adskilte tilstandslinjer (nej og ikke oplyst), ikke ét kollapset tal',
      antalLinjer(s) === 2 && viserTilstand(s, 'v-nej') && viserTilstand(s, 'v-ikke'),
      `linjer=${antalLinjer(s)} · v-nej=${viserTilstand(s, 'v-nej')} · v-ikke=${viserTilstand(s, 'v-ikke')}`);
  }

  // --- 76.4: "0 af N" maa ikke kunne staa der ------------------------------
  // Reglen fra fund/PLAN-producent.md P1: en tilstand vises, NAAR den
  // forekommer. Et nul er derfor aldrig en linje - hverken som hul eller som
  // tom rubrik (begraensning 5 med omvendt fortegn).
  {
    let nuller = 0;
    for (const sprog of ['da', 'en']) {
      const rodMappe = path.join(dist, sprog, 'producenter');
      for (const d of fs.readdirSync(rodMappe, { withFileTypes: true }).filter((f) => f.isDirectory())) {
        const s = euSektion(dist, sprog, d.name) || '';
        nuller += (s.match(/<b class="eu-fund-tal">0 (af|of) /g) || []).length;
      }
    }
    ok('76.4: ingen producentside tegner en tilstand med 0 forekomster',
      nuller === 0, `fandt ${nuller} "0 af/of N"-led`);
  }

  // --- 76.5: KONTRAFAKTISK i data-retningen -------------------------------
  // En producent, hvor ALT er "ikke oplyst", maa ALDRIG paastaa et nej.
  // Uden denne ville en rettelse, der bare altid tegnede et nej, staa gron.
  {
    const s = euSektion(dist, 'da', 'boston-dynamics');
    ok('76.5: en producent med udelukkende "ikke oplyst" paastaar IKKE et nej',
      s !== null && viserTilstand(s, 'v-ikke') && !viserTilstand(s, 'v-nej'),
      s === null ? 'ingen EU-sektion' : `v-ikke=${viserTilstand(s, 'v-ikke')} · v-nej=${viserTilstand(s, 'v-nej')} · linjer=${antalLinjer(s)}`);
  }

  // --- 76.6: og "ja" er stadig "ja" ---------------------------------------
  {
    const s = euSektion(dist, 'da', 'anybotics');
    ok('76.6: en producent med udelukkende oplyst CE tegner ja-tilstanden',
      s !== null && viserTilstand(s, 'v-ja') && !viserTilstand(s, 'v-nej'),
      s === null ? 'ingen EU-sektion' : `v-ja=${viserTilstand(s, 'v-ja')} · linjer=${antalLinjer(s)}`);
  }

  // --- 76.7: REVERT-BEVIS --------------------------------------------------
  // Beviser, at 76.1's tjek kan FEJLE. Uden den kunne viserTilstand() vaere
  // knaekket og returnere sandt for hvad som helst - og hele filen ville staa
  // gron, uanset hvad producent.mjs gjorde. Strengen er den GAMLE udgaves
  // faktiske output, ordret fra dist foer rettelsen.
  {
    const gammel = '<p class="eu-fund-linje"><b class="eu-fund-tal">0 af 2</b>'
      + '<span>robotter i kataloget oplyser CE-mærkning fra producenten.</span></p>';
    ok('76.7 (revert-bevis): samme tjek AFVISER den gamle, kollapsede udgave',
      !viserTilstand(gammel, 'v-nej') && !viserTilstand(gammel, 'v-ikke')
      && (gammel.match(/<b class="eu-fund-tal">0 af /g) || []).length === 1,
      'den gamle "0 af 2"-linje fanges af 76.1 og 76.4');
  }

  // --- 76.8: opgoerelsen summer til modelantallet -------------------------
  // Vaernet mod en rettelse, der viser tre tilstande, men taeller forkert:
  // ja + nej + ikke oplyst skal vaere praecis producentens antal modeller.
  {
    const s = euSektion(dist, 'da', 'xiaomi') || '';
    let sum = 0; let iAlt = null;
    for (const m of s.matchAll(/<b class="eu-fund-tal">(\d+) af (\d+)<\/b>/g)) {
      sum += Number(m[1]); iAlt = Number(m[2]);
    }
    ok('76.8: Xiaomis tilstande summer til producentens modelantal',
      iAlt !== null && sum === iAlt, `sum=${sum} · i_alt=${iAlt}`);
  }

  fs.rmSync(fixture, { recursive: true, force: true });
  fs.rmSync(dist, { recursive: true, force: true });
}
