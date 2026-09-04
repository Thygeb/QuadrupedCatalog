#!/usr/bin/env node
/**
 * db/hent.mjs — Supabase (over REST)  ->  det samme objektarray, som
 * data/robots/-vejen giver build.mjs og validate.mjs i dag (spor/fase3,
 * BRIEF-fase3.md punkt 1).
 *
 * Nul afhaengigheder. REN GENBRUG, ikke en ny oversaettelse: db/eksporter.mjs's
 * fraDb() henter allerede den DANSKE kanoniske form af alle 77 robotter over
 * PostgREST, og byggRobotDoc()/skrivRobotYaml() (samme fil) skriver den
 * allerede om til PRAECIS den YAML-tekst, en fil i data/robots/ ville have
 * indeholdt. db/tjek.mjs beviser allerede (dybtLig, 77/77 malt paa en
 * tidligere commit), at den tekst — parset igen med tools/yaml.mjs's
 * parseYaml — er DYBT LIG originalen efter normaliserRobot(). hentRobotter()
 * genbruger PRAECIS den provede vej i stedet for at opfinde en ny mapping
 * direkte fra PostgREST-raekker til det normaliserede skema.
 *
 * FORM: hvert element i det returnerede array er en RAA parseYaml()-doc —
 * IKKE normaliseret endnu. Det er PRAECIS det, `filer.map(f =>
 * parseYaml(readFileSync(f,'utf8'), f))` giver i dag for en data/robots/-fil.
 * Kaldere (build.mjs, validate.mjs) koerer selv normaliserRobot() (og
 * build.mjs desuden normaliserVisningsEnheder()) paa hvert element bagefter,
 * ligesom de altid har gjort for filbaserede docs — ingen ny normaliserings-
 * vej opfindes her, og normaliserRobot()'s PAA STEDET-mutation rammer derfor
 * aldrig et delt objekt paa tvaers af to kald (se cache-kommentaren nedenfor).
 *
 *   node -e "import('./db/hent.mjs').then(m=>m.hentRobotter()).then(r=>console.log(r.length))"
 *
 * Kraever SUPABASE_URL og SUPABASE_SERVICE_ROLE_KEY i .env (samme krav som
 * `db/eksporter.mjs --fra-db`, se db/LAESMIG.md). LAeS-KUN: fraDb() er et GET
 * mod PostgREST. Ingen skriv, ingen DDL (L94, STATUS.md).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fraDb, byggRobotDoc, skrivRobotYaml } from './eksporter.mjs';

const ROD = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { parseYaml } = await import(`file://${path.join(ROD, 'tools/yaml.mjs')}`);

/**
 * Proces-krydsende cache af fraDb()'s RAA svar - men KUN naar
 * QUAD_DBCACHE_FIL er sat, og den variabel maa KUN saettes af
 * tests/koer.mjs (fund/BRIEF-dbcache.md punkt 1).
 *
 * HVORFOR bag en variabel, ikke som standard: fase 3's foerste halvdel
 * (Å178) blev flettet paa en negativ kontrol - `SUPABASE_URL=<ugyldig>`
 * skal give exit 1, 0 sider, "fetch failed" for et almindeligt
 * `node tools/build.mjs`-kald. En cache, der er varm som standard, ville
 * lade den kontrol bygge 216 sider paa en ugyldig URL, og fase 3's eneste
 * bevis for at databasen faktisk laeses, ville vaere vaek. Derfor: er
 * QUAD_DBCACHE_FIL IKKE sat, opfoerer denne fil sig praecis som foer denne
 * aendring - hentRobotter() laver et AEGTE fetch() hver gang raaCache er
 * tom i DENNE proces, og en fejl (ugyldig URL, manglende .env) kastes
 * uaendret. Variablen aendrer ingenting ved selve produktionsvejen.
 */
const CACHE_FIL = process.env.QUAD_DBCACHE_FIL || null;

/**
 * Cache af fraDb()'s RAA svar (de danske kanoniske robot-objekter, foer
 * byggRobotDoc/skrivRobotYaml/parseYaml) — IKKE af de faerdige docs.
 * Grunden til forskellen: normaliserRobot() (kaldt af build.mjs og
 * validate.mjs, hver for sig, paa HVERT sit kald af hentRobotter() inden for
 * samme proces — build.mjs kalder baade selv og indirekte via validerMain())
 * normaliserer "PAA STEDET" (skema.mjs's egen kommentar) og MUTERER doc'en.
 * Havde cachen delt selve doc-objekterne, ville validate.mjs's normalisering
 * ramme de SAMME objekter, build.mjs saa laeste bagefter, og
 * normaliserRobot() ville koere to gange paa samme doc — uprovet
 * idempotens, ikke noget der skal antages stille. Ved i stedet kun at cache
 * raaRobotter (fra REST-kaldet) og koere byggRobotDoc/skrivRobotYaml/
 * parseYaml PAA NY for hvert hentRobotter()-kald, faar hver kalder sine EGNE,
 * uroerte doc-objekter — til prisen af noget CPU (ingen netvaerk), som er
 * det, "Ét kald, cachet" i BRIEF-fase3.md punkt 5 faktisk sigter paa: at
 * suiten ikke laver 76 REST-kald, ikke at doc-objekter deles.
 */
let raaCache = null;

export async function hentRobotter() {
  if (!raaCache) {
    // Proces-krydsende laesning: kun naar CACHE_FIL er sat (tests/koer.mjs)
    // OG filen allerede findes fra et tidligere kald i SAMME suitekoersel.
    // Uden CACHE_FIL foelger denne gren aldrig - se kommentaren ved
    // CACHE_FIL's deklaration.
    if (CACHE_FIL && fs.existsSync(CACHE_FIL)) {
      raaCache = JSON.parse(fs.readFileSync(CACHE_FIL, 'utf8'));
    } else {
      const raa = await fraDb();
      if (!raa) {
        throw new Error('hentRobotter: fraDb() gav intet — mangler SUPABASE_URL/' +
          'SUPABASE_SERVICE_ROLE_KEY i .env? Se db/LAESMIG.md.');
      }
      raaCache = raa;
      if (CACHE_FIL) {
        fs.mkdirSync(path.dirname(CACHE_FIL), { recursive: true });
        fs.writeFileSync(CACHE_FIL, JSON.stringify(raaCache));
      }
    }
  }
  return raaCache.map((r) => {
    const tekst = skrivRobotYaml(byggRobotDoc(r));
    // Det syntetiske "filnavn" er ikke en sti paa disk — det er PRAECIS den
    // streng, en rigtig fil ville have haft ("<slug>.yaml"), saa
    // validate.mjs's R14 (slug skal matche filnavnet, via path.basename)
    // aldrig kan afvige mellem DB-vejen og fil-vejen.
    return parseYaml(tekst, `${r.slug}.yaml`);
  });
}
