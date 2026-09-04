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
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

/** EU-sektionens raa HTML paa en bygget producentside. */
function euSektion(dist, sprog, slug) {
  const fil = path.join(dist, sprog, "producenter", slug, "index.html");
  if (!fs.existsSync(fil)) return null;
  const h = fs.readFileSync(fil, "utf8");
  const i = h.indexOf('id="eu-h"');
  if (i < 0) return null;
  const j = h.indexOf("</section>", i);
  return h.slice(i, j < 0 ? undefined : j);
}

/** Tegner sektionen tilstanden `klasse` (v-ja / v-nej / v-ikke)? */
function viserTilstand(sektion, klasse) {
  return typeof sektion === "string" && sektion.includes(`v ${klasse}`);
}

/** Antal "{n} af {m}"-tal-led, dvs. antal tilstandslinjer. */
function antalLinjer(sektion) {
  return typeof sektion === "string"
    ? (sektion.match(/<b class="eu-fund-tal">/g) || []).length
    : 0;
}

export default async function koer(ctx) {
  const { rod, tmp, node, ok } = ctx;

  // --- fixturen: fire robotter, tre producenter, tre CE-tilstande ----------
  const fixture = path.join(tmp, "fixture-produkort");
  fs.rmSync(fixture, { recursive: true, force: true });
  fs.mkdirSync(fixture, { recursive: true });

  const fraData = ["xiaomi-cyberdog-1.yaml", "xiaomi-cyberdog-2.yaml"];
  for (const f of fraData) {
    fs.copyFileSync(path.join(rod, "data", "robots", f), path.join(fixture, f));
  }
  for (const f of ["boston-dynamics-spot.yaml", "anybotics-anymal.yaml"]) {
    fs.copyFileSync(
      path.join(rod, "tests", "eksempel-robotter", f),
      path.join(fixture, f),
    );
  }

  const dist = path.join(tmp, "dist-produkort");
  const b = spawnSync(
    node,
    [path.join(rod, "tools", "build.mjs"), `--data=${fixture}`, `--ud=${dist}`],
    { cwd: rod, encoding: "utf8" },
  );
  // Haard fejl, ikke en taellet paastand — samme valg som dele/09: et fejlet
  // byg er ikke et testresultat, det er et miljoenedbrud.
  if (b.status !== 0) {
    throw new Error(
      `produkort-fixture: byg fejlede (exit ${b.status}) - ${(b.stderr || "").trim()}`,
    );
  }

  console.log(
    "\n76. Producentsidens EU-sektion er fjernet jf. JPKs beslutning",
  );

  // --- 76.1-76.2: EU-sektionen er vaek paa BEGGE sprog ----------------------
  for (const sprog of ["da", "en"]) {
    const s = euSektion(dist, sprog, "xiaomi");
    ok(
      `76.${sprog === "da" ? 1 : 2}: Xiaomis producentside (${sprog}) har ingen EU-sektion`,
      s === null,
      s === null ? "EU-sektion er fjernet" : "fandt uventet EU-sektion",
    );
  }

  // --- 76.3: ingen eu-fund-linje eller eu-fund-tal --------------------------
  {
    const html = fs.readFileSync(
      path.join(dist, "da", "producenter", "xiaomi", "index.html"),
      "utf8",
    );
    ok(
      "76.3: Xiaomi viser ingen eu-fund-linje eller eu-fund-tal",
      !html.includes("eu-fund-linje") && !html.includes("eu-fund-tal"),
    );
  }

  // --- 76.4: ingen producentside baerer id="eu-h" ---------------------------
  {
    let harEu = 0;
    for (const sprog of ["da", "en"]) {
      const rodMappe = path.join(dist, sprog, "producenter");
      for (const d of fs
        .readdirSync(rodMappe, { withFileTypes: true })
        .filter((f) => f.isDirectory())) {
        if (euSektion(dist, sprog, d.name) !== null) harEu++;
      }
    }
    ok(
      "76.4: ingen producentside bærer en EU-sektion",
      harEu === 0,
      `fandt ${harEu} producentsider med EU-sektion`,
    );
  }

  // --- 76.5: Boston Dynamics har ingen EU-sektion -------------------------
  {
    const s = euSektion(dist, "da", "boston-dynamics");
    ok(
      "76.5: Boston Dynamics har ingen EU-sektion",
      s === null,
      s === null ? "ingen EU-sektion" : "fandt EU-sektion",
    );
  }

  // --- 76.6: ANYbotics har ingen EU-sektion -------------------------------
  {
    const s = euSektion(dist, "da", "anybotics");
    ok(
      "76.6: ANYbotics har ingen EU-sektion",
      s === null,
      s === null ? "ingen EU-sektion" : "fandt EU-sektion",
    );
  }

  // --- 76.7: REVERT-BEVIS --------------------------------------------------
  {
    const syntetiskMedEu =
      '<section class="sektion" aria-labelledby="eu-h"><h2 id="eu-h">EU</h2></section>';
    ok(
      '76.7 (revert-bevis): syntetisk streng med id="eu-h" fanges af tjekket',
      syntetiskMedEu.includes('id="eu-h"'),
    );
  }

  // --- 76.8: Producentsiden baerer kun typeskilt og modelafsnit ------------
  {
    const daHtml = fs.readFileSync(
      path.join(dist, "da", "producenter", "xiaomi", "index.html"),
      "utf8",
    );
    ok(
      "76.8: producentsiden bærer producent-top og modelafsnit uden mellemliggende EU-sektion",
      daHtml.includes('class="producent-top"') &&
        daHtml.includes('id="modeller-h"') &&
        !daHtml.includes('id="eu-h"'),
    );
  }

  fs.rmSync(fixture, { recursive: true, force: true });
  fs.rmSync(dist, { recursive: true, force: true });
}
