# FUND-i18ntest.md — spor/i18ntest, 2. sep 2026

Skill-vurdering: ingen af projektets otte skills passer på selve opgaven
(mekanisk genskabelse af testdaekning, hverken data- eller designarbejde).
Fravalgt med begrundelse: `robotdata` (ingen robotpost aendres), `brief`
(jeg udfoerer et brief, skriver ikke ét), `flet`/`parallelt` (intet flet,
ét spor), `supabase`* (punkt 4-5 er netop udeladt). Da grundmålingen afveg
fra forudsigelsen (se fælder), fulgte jeg `fejljagt`s princip — måleapparat
foer tal, mekanismesaetning foer rettelse, revert-bevis efter — men kaldte
ikke selve Skill-vaerktoejet, fordi rodaarsagen (manglende `dist/`) blev
fundet paa faa minutter ved direkte undersoegelse.

## 1. Loesning
Genskabt punkt 1-3 af den slettede `tests/dele/60-i18nfelt.mjs` som ny fil
`tests/dele/64-i18nfelt.mjs`. Fravalgt: at genskabe hele den gamle fil inkl.
punkt 4-5 — punkt 4 testede `db/skema.sql`/`db/migrering-i18n.sql`s tre
i18n-kolonner, som ikke findes i det (nu engelske) skema, og punkt 5 testede
`db/migrer.mjs`, som er slettet; begge maalt fravaerende paa denne gren.

## 2. Konfidens pr. punkt
A1 HOEJ: `node tests/koer.mjs` foer/efter, tal i rapporten. Modbevis: var et
af de 14 runtime-kald ikke reelt udfoert, ville "bestaaet" ikke stige med
praecis 14 fra grundmaalingens 1478 til 1492.
A2 HOEJ: `grep -n -E "db/|migrer|rundtur|eksporter|supabase|fetch" tests/dele/64-i18nfelt.mjs`.
A3 HOEJ: tre isolerede sabotager, hver koert til roedt, revert, groent facit — alle fem tal i rapporten.
A4 HOEJ: `git status --short` og `git diff --stat -- data/robots/ tools/ db/`.
A5 HOEJ: citaterne er kopieret direkte fra `tests/LAESMIG.md` linje 47 og 53-54.

## 3. Usikkerheder
Ingen uafklarede. Den ene reelle usikkerhed (grundmaalingens afvigelse fra
forudsigelsen) blev opklaret og er dokumenteret under fælder.

## 4. Maalingerne
- Grundmaaling FOER `dist/` var bygget: 1384 bestaaet, 14 fejlet (afveg fra forudsigelsen).
- Efter `node tools/build.mjs` (216 sider, 0 fejl, 1 advarsel): 1478 bestaaet, 1 fejlet — matcher forudsigelsen.
- N = `grep -c "ok(" tests/dele/64-i18nfelt.mjs` = 10 (statiske forekomster).
- N faktisk (runtime, talt i loggen) = 14 — loekken over 5 R22-tilfaelde har ét "ok(" i kilden, 5 runtime-kald.
- Efter tilfoejelse af 64: 1492 bestaaet (1478+14), 1 fejlet (uaendret: kun 63(c)).
- A2: linje 24, 25, 27 — alle tre i topkommentaren, ingen andre.
- A3 roedt bevis 1 (ukendt noegle `advarsel_i18n_x`): 1491 bestaaet, 2 fejlet (64.1 roed).
- A3 roedt bevis 2 (gyldig-form: `note_i18n` fik `da` som noegle): 1491 bestaaet, 2 fejlet (64.2-gyldig roed).
- A3 roedt bevis 3 (patch-streng aendret saa den ikke matcher): 1489 bestaaet, 4 fejlet (grundlag + 2 kaskadefoelger roede).
- A3 groent facit efter reversion: 1492 bestaaet, 1 fejlet.
- `git status --short` efter commit 1: kun `tests/dele/64-i18nfelt.mjs`.
- `git diff --stat -- data/robots/ tools/ db/`: tomt.

---

## Nye fælder og opdagelser

1. **Grundmaalingens forudsigelse (1478/1) forudsatte et allerede bygget
   `dist/`, som IKKE findes i en frisk worktree** — `dist/` er gitignoreret
   (`.gitignore:2`) og tests 24/27/35 laeser `path.join(rod, 'dist')`
   DIREKTE (det virkelige, gitignorerede byg), ikke et `ctx.tmp`-underbygget
   dist. Foerste koersel gav derfor 1384/14, ikke 1478/1 — 13 af de 14 var
   "der ER bygget sider at maale paa"-vagter (24.3/24.5x4/24.7x2/24.12x2/
   27.4x2/35x2), den 14. var det kendte 63(c). Loest med `node
   tools/build.mjs` (uden argumenter, bygger til `dist/`), hvorefter
   grundmaalingen matchede forudsigelsen praecist. Dette er samme moenster
   som CLAUDE.md's egen "54 valideringsfejl fra manglende gitignorerede
   billeder" — men for et gitignoreret BYG i stedet for gitignorerede
   billeder. Vaerd at skrive ind i briefskabelonen for enhver frisk worktree,
   der roerer dele 24/27/35 eller senere.
2. **Briefets egen forudsigelse for N ("grep -c 'ok(' ") undertaeller
   systematisk, naar en del bruger en loekke over flere fixtures.** Punkt
   2's fem bevidst oedelagte R22-tilfaelde deler ÉT "ok("-kald i kildekoden,
   men koerer 5 gange — grep gav 10, det faktiske facit var 14. Samme
   pattern som CLAUDE.md's "Fire konkrete faelder"-tabel (et forkert
   maaleapparat giver et plausibelt, men forkert tal); vaerd at naevne
   i `brief`-skillen, saa fremtidige acceptkriterier med "grep -c 'ok('" enten
   praeciseres til at gange med loekkens laengde, eller erstattes af det
   faktiske koersel-facit.
3. `tests/.tmp-gammel-60.mjs` og de to log-filer, jeg selv skrev direkte i
   `tests/` (`.tmp-koersel-log.txt`/`.tmp-koersel-log2.txt`), var IKKE
   daekket af `.gitignore`s `tests/.tmp-*/`-moenster, fordi det kun
   matcher MAPPER (traeliende skraastreg), ikke loese filer med samme
   praefiks. Alle tre slettet manuelt foer commit 1 — `git status --short`
   efter commit bekraefter, at ingen af dem naaede git.

## Punkter i briefet, jeg ikke naaede

Ingen.
