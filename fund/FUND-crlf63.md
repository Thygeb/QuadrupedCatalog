# FUND-crlf63 — (c) i 63-ordbog-og-skema.mjs normaliseret for CRLF

**1. Valgt/fravalgt.** Valgt: normalisér begge sider (`.replace(/\r\n/g, '\n')`)
foer `===`, assertionen bevaret. Fravalgt: `.gitattributes` med `eol=lf` — den
aendrer checkout-adfaerd for ALLE filer i repoet, som en anden session kan
arbejde i lige nu; briefet forbyder ogsaa at roere `.gitattributes`.

**2. Konfidens pr. punkt.**
- A1 (0 fejlet fra (c), bestaaet = grundmaaling+1): **HOEJ**. Kommando:
  `node tests/koer.mjs 2>&1 | tail -6`. Var rettelsen forkert (fx normaliseret
  kun én side), ville (c) staa blandt "Fejlede" igen, og bestaaet-tallet ville
  falde 1 tilbage til grundmaalingens 1384.
- A2 (db/migrering-engelsk.sql uroert): **HOEJ**. Kommando: CR-taelling +
  `git status --short`. Var filen roert, ville CR-tallet afvige fra 376, eller
  filen staa som aendret i git status.
- A3 (kontrafaktisk bevis): **HOEJ**. Kommandoerne er gengivet i maalingerne
  nedenfor og genkoerbare præcis som skrevet. Uden rettelsen ville (c) IKKE
  vaere blandt de fejlede test her (den ville allerede vaere roed foer
  aendringen, saa "bliver roed ved skade" ville ikke vaere et bevis for
  noget nyt) — men da grundmaalingen (foer min rettelse) allerede havde (c)
  roed, er selve bekraeftelsen at (c) er groen FOER kontrafaktet og roed
  UNDER det, som begge er maalt.
- A4 (ét commit): **HOEJ**. `git rev-list --count main..spor/crlf63`.

**3. Usikkerheder.** Grundmaalingen afveg fra briefets forudsigelse (se
punkt 4) — afvigelsen skyldes at `dist/` ikke findes i denne friske worktree
(build.mjs er aldrig koert her), IKKE min rettelse. De 13 resterende fejl
efter min rettelse er alle af typen "filen findes"/"siden er bygget" og
uden forbindelse til (c) eller CRLF. Jeg har ikke bygget `dist/` for at
efterproeve det, da briefet ikke bad om det, og et byg ikke var noedvendigt
for at bevise A1-A3.

**4. Maalingerne (tal).**
- Grundmaaling: **1384 bestaaet, 14 fejlet** (afviger fra forudsigelsens
  "1478/1" — forskellen er 13 foreksisterende `dist/`-relaterede fejl, se
  punkt 3). (c) var blandt de 14.
- CR-tal db/migrering-engelsk.sql foer rettelsen: **376**.
- A1 efter rettelsen: `node tests/koer.mjs` → **1385 bestaaet, 13 fejlet**,
  (c) ikke blandt de fejlede (grundmaaling+1 bestaaet, -1 fejlet).
- A2: CR-tal **376** (uaendret), `git status --short` → kun
  `tests/dele/63-ordbog-og-skema.mjs`.
- A3 kontrafaktisk (linje tilfoejet i db/migrering-engelsk.sql): **1384
  bestaaet, 14 fejlet**, (c) blandt de fejlede. Efter `git checkout --
  db/migrering-engelsk.sql`: CR-tal **376**, `git status --short` viser
  `db/`-filen ren, og `node tests/koer.mjs` → **1385 bestaaet, 13 fejlet**
  igen, (c) groen.
- A4: `git rev-list --count main..spor/crlf63` → **1** (kun rettelsescommit
  paa dette tidspunkt; rapportcommit kommer separat som brief kraever).

## Nye faelder og opdagelser

Grundmaalingens forudsigelse (1478 bestaaet, 1 fejlet) holdt ikke, fordi
denne friske worktree aldrig har koert `build.mjs` — 13 tests, der
forudsaetter en bygget `dist/`, fejler derfor uafhaengigt af CRLF-fejlen.
Det er ikke en ny mekanisme (samme kendte "byg foer maal"-fælde som
projektet allerede kender), men det er vaerd at notere, fordi det aendrer
grundmaalingens tal markant i forhold til briefets gaet.

## Punkter i briefet, jeg ikke naaede

Ingen.
