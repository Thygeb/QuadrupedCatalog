#!/usr/bin/env node
/**
 * tools/alder.mjs — kvartalstjekket: hvilke robotposter er aeldst?
 *
 * Nul afhaengigheder ud over projektets egen tools/yaml.mjs (parseYaml) — samme
 * regel som validate.mjs og build.mjs: én YAML-laeser, ikke en fjerde skrevet i
 * haanden. normaliserRobot() fra skema.mjs er IKKE brugt her: den normaliserer
 * enheder og ja/nej-vaerdier, som "hentet"-datoer aldrig involverer, saa import
 * af skema.mjs ville kun vaere en unoedvendig kobling.
 *
 * Hver kildebelagt vaerdi i en robotpost baerer sin egen "hentet: YYYY-MM-DD"
 * (regel 2, R7). Producenter aendrer deres sider, saa tallene aeldes — men i dag
 * kan ingen svare paa "hvilke poster er aeldst?" uden at laese alle filer i
 * haanden. Dette script goer det til en liste.
 *
 * Tre steder en robotpost kan baere "hentet":
 *   1. felter.<feltnavn>.hentet   — hvert enkelt talfelt, tekstfelt, jaNej-felt ...
 *   2. anvendelse.hentet          — producentens egen kategori (topnoegle)
 *   3. billede.hentet             — billedets kilde (topnoegle)
 * Scriptet samler alle tre, for alle 77 robotter.
 *
 *   node tools/alder.mjs                    aldersliste, aeldste foerst
 *   node tools/alder.mjs --graense=<dage>   TIL EFTERPROEVNING-graense. Standard 90
 *   node tools/alder.mjs --top=<n>          begraens liste 1 til de n aeldste
 *
 * En robot HELT UDEN daterede kilder (alle felter "ikke_oplyst", intet billede,
 * ingen anvendelse) er ikke "frisk" — den er UMAALT. De to tilstande maa ikke
 * kollapse (samme princip som ikke_oplyst vs. nej i CLAUDE.md begraensning 5),
 * saa den staar oeverst i liste 1 med "INGEN DATEREDE KILDER" i stedet for en
 * dato, og indgaar IKKE i TIL EFTERPROEVNING-sektionen, som er bygget paa en
 * NYESTE-dato ingen af de robotter har.
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { parseYaml } from './yaml.mjs';

const ROD = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATO_RE = /^\d{4}-\d{2}-\d{2}$/;

/* ============================================================================
 * Rene funktioner — ingen filsystem, ingen "i dag". Testbare med konstruerede
 * datoer og kendte svar (tests/koer.mjs afsnit 9).
 * ========================================================================== */

/** ISO-dato ("YYYY-MM-DD") -> millisekunder siden epoke, i UTC. Datoer
 *  sammenlignes som kalenderdage, ikke som tidsstempler med tidszone. */
export function tilTid(dato) {
  const [aar, maaned, dag] = dato.split('-').map(Number);
  return Date.UTC(aar, maaned - 1, dag);
}

/** Millisekunder -> ISO-dato. Modstykket til tilTid(). */
export function tilDato(tid) {
  return new Date(tid).toISOString().slice(0, 10);
}

/**
 * Medianen af en SORTERET liste ISO-datoer. Ulige antal: midterste dato.
 * Lige antal: dagen midt imellem de to midterste, afrundet til naermeste hele
 * dag (Math.round) — der findes ingen "halv dag" i en kalender, saa et
 * deterministisk valg er noedvendigt, og runding til naermeste er det mindst
 * overraskende. Se tests/koer.mjs afsnit 9 for et konkret eksempel.
 */
export function medianDato(sorterede) {
  const n = sorterede.length;
  if (n === 0) return null;
  if (n % 2 === 1) return sorterede[(n - 1) / 2];
  const a = tilTid(sorterede[n / 2 - 1]);
  const b = tilTid(sorterede[n / 2]);
  const midt = Math.round((a + b) / 2 / 86400000) * 86400000;
  return tilDato(midt);
}

/** Antal hele dage fra `dato` til `iDag` (positivt, naar dato ligger foer iDag). */
export function dageSiden(dato, iDag) {
  return Math.round((tilTid(iDag) - tilTid(dato)) / 86400000);
}

/**
 * Kernefunktionen. Givet listen af "hentet"-datoer for ÉN robot, returnerer
 * aeldste/nyeste/median/antal — eller null, hvis robotten ingen daterede
 * kilder har. null er IKKE "0 kilder med en dato" skrevet som et tal; det er
 * den tredje tilstand, "umaalt", og skal behandles saerskilt af den kaldende
 * kode (se filens dokumentation ovenfor).
 */
export function robotAlder(datoer) {
  if (!datoer || !datoer.length) return null;
  const sorteret = [...datoer].sort();
  return {
    aeldste: sorteret[0],
    nyeste: sorteret[sorteret.length - 1],
    median: medianDato(sorteret),
    antal: sorteret.length,
  };
}

/**
 * TIL EFTERPROEVNING — er robottens NYESTE kilde aeldre end graensen? Kun
 * definitionen for en robot MED datering: en robot uden nogen dato (alder ===
 * null) har ingen "nyeste" at maale fra og skal ikke afgoeres her (se
 * filens dokumentation).
 */
export function tilEfterproevning(alder, iDag, graenseDage) {
  if (!alder) return false;
  return dageSiden(alder.nyeste, iDag) > graenseDage;
}

/* ============================================================================
 * Indsamling fra ét parset dokument — ren funktion, ingen filsystem.
 * ========================================================================== */

/** Er `v` en feltpost (kort) med en gyldig "hentet"-dato? En bar tilstand
 *  ("ikke_oplyst" som streng) og en tilstand uden hentet er begge fravaer, ikke
 *  en dato — DATO_RE afgoer det ene tjek, der betyder noget her. */
function harHentet(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v) && DATO_RE.test(v.hentet);
}

/**
 * Samler samtlige "hentet"-datoer i ÉT robotdokument: felter, anvendelse,
 * billede. Ren funktion af det parsede dokument — kan testes uden filsystem.
 */
export function datoerIRobot(doc) {
  const ud = [];
  if (doc && typeof doc.felter === 'object' && doc.felter !== null && !Array.isArray(doc.felter)) {
    for (const post of Object.values(doc.felter)) {
      if (harHentet(post)) ud.push(post.hentet);
    }
  }
  if (harHentet(doc?.anvendelse)) ud.push(doc.anvendelse.hentet);
  if (harHentet(doc?.billede)) ud.push(doc.billede.hentet);
  return ud;
}

/* ============================================================================
 * Filsystem + udskrift
 * ========================================================================== */

function findFiler(mappe) {
  if (!fs.existsSync(mappe)) return [];
  return fs.readdirSync(mappe)
    .filter((f) => /\.ya?ml$/.test(f))
    .map((f) => path.join(mappe, f))
    .sort();
}

export function laesFlag(argv) {
  const flag = {};
  for (const a of argv) {
    if (!a.startsWith('--')) continue;
    const i = a.indexOf('=');
    if (i === -1) flag[a.slice(2)] = true;
    else flag[a.slice(2, i)] = a.slice(i + 1);
  }
  return flag;
}

export function main(argv) {
  const flag = laesFlag(argv);
  const graenseDage = flag['graense'] !== undefined ? Number(flag['graense']) : 90;
  const topRaa = flag['top'] !== undefined ? Number(flag['top']) : Infinity;
  const top = Number.isFinite(topRaa) && topRaa > 0 ? topRaa : Infinity;
  const iDag = new Date().toISOString().slice(0, 10);

  const dataMappe = path.join(ROD, 'data', 'robots');
  const filer = findFiler(dataMappe);
  if (!filer.length) {
    console.error(`Ingen YAML-filer i ${dataMappe}.`);
    return 1;
  }

  const robotter = [];
  for (const fil of filer) {
    const slugFraFil = path.basename(fil).replace(/\.ya?ml$/, '');
    let doc;
    try {
      doc = parseYaml(fs.readFileSync(fil, 'utf8'), fil);
    } catch (e) {
      console.error(`Kan ikke laese ${fil}: ${e.message}`);
      continue;
    }
    const datoer = datoerIRobot(doc);
    robotter.push({
      slug: (doc && typeof doc.slug === 'string' && doc.slug) || slugFraFil,
      datoer,
      alder: robotAlder(datoer),
    });
  }

  // Robotter UDEN daterede kilder staar oeverst, i slug-orden — de er ikke
  // "aeldst", de er umaalte, og skal ikke kunne sortere sig ind imellem
  // resten ved at faa en sentinel-dato (se filens dokumentation).
  const uden = robotter.filter((r) => !r.alder).sort((a, b) => a.slug.localeCompare(b.slug));
  const med = robotter.filter((r) => r.alder)
    .sort((a, b) => a.alder.aeldste.localeCompare(b.alder.aeldste) || a.slug.localeCompare(b.slug));

  let liste = [...uden, ...med];
  if (Number.isFinite(top)) liste = liste.slice(0, top);

  console.log(`Datakildernes alder pr. robot, aeldste foerst — i dag: ${iDag}\n`);
  for (const r of liste) {
    if (!r.alder) {
      console.log(`${r.slug}  INGEN DATEREDE KILDER`);
    } else {
      console.log(`${r.slug}  aeldste ${r.alder.aeldste}  nyeste ${r.alder.nyeste}  ` +
        `median ${r.alder.median}  (${r.alder.antal} daterede kilder)`);
    }
  }

  const alleDatoer = robotter.flatMap((r) => r.datoer);
  console.log('');
  if (alleDatoer.length) {
    const sorteret = [...alleDatoer].sort();
    const aeldsteDato = sorteret[0];
    const nyesteDato = sorteret[sorteret.length - 1];
    const aeldsteRobot = med.find((r) => r.alder.aeldste === aeldsteDato);
    console.log(`${robotter.length} robotter · ${alleDatoer.length} daterede kilder i alt · ` +
      `aeldste i kataloget: ${aeldsteDato} (${aeldsteRobot ? aeldsteRobot.slug : '?'}) · nyeste: ${nyesteDato}`);
  } else {
    console.log(`${robotter.length} robotter · 0 daterede kilder i alt.`);
  }

  const gamle = med.filter((r) => tilEfterproevning(r.alder, iDag, graenseDage));
  console.log(`\nTIL EFTERPROEVNING (aeldre end ${graenseDage} dage):`);
  if (!gamle.length) {
    console.log(`Ingen — alle robotter er efterset inden for ${graenseDage} dage.`);
  } else {
    for (const r of gamle) {
      console.log(`${r.slug}  nyeste ${r.alder.nyeste}  (${dageSiden(r.alder.nyeste, iDag)} dage siden)`);
    }
  }

  return 0;
}

const erHoved = process.argv[1] && path.resolve(process.argv[1]).endsWith('alder.mjs');
if (erHoved) process.exit(main(process.argv.slice(2)));
