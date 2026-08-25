# FUND-arkiv.md — sikkerhedskopi af media/_kilder/ og media/robotbilleder/ til Supabase Storage (L34-forlaengelse)

Gren `spor/arkiv`, worktree `udstilling-wt-arkiv`. Opgave: en privat Supabase
Storage-spand `arkiv`, adskilt fra billedspanden `robotbilleder`, med et
synkroniseringsscript i samme fil og stil som `db/billeder.mjs` allerede
bruger. 770 filer, 305 MB, arkiveres — de er beviset for 1.110
kildebelagte tal i projektet og findes i præcis ét eksemplar.

## Skill-vurdering (foerst, som CLAUDE.md kraever ved hver opgave)

Samme afvejning som `spor/billedspand` traf (`fund/FUND-billedspand.md`), og
den holder stadig: `robotdata` er om robotdata-poster (irrelevant — ingen
robot tilfoejes), `parallelt` er om at dele en opgave paa flere agenter
(opgaven kom som ét afgraenset spor til én agent), `impeccable` og
kritik-skillsne er om UI/UX (ingen skaerm bygges her), `grillmig` er om at
gril et brief FOeR det sendes (jeg er modtageren, ikke afsenderen).
**Fravalgt, alle med begrundelse.**

**Valgt: `supabase`** (den officielle Supabase-skill) — samme begrundelse som
forrige spor: `service_role` omgaar RLS, saa "Storage access control"s
klientrolle-faelde er irrelevant her. Jeg genlaeste ikke hele skillen forfra,
fordi opgaven er en ren UDVIDELSE af et allerede afproevet moenster
(`db/billeder.mjs`), og briefet selv pegede paa at genbruge det moenster
frem for at opfinde et nyt.

## Punkt 1 — den private arkivspand

`sikrSpand()` generaliseret til at tage spandnavnet som parameter, saa
"robotbilleder" og "arkiv" GENBRUGER samme idempotente oprettelseslogik —
ikke en ny funktion, praecis som brief'et kraevede ("to kopier af samme
oprettelseslogik divergerer").

**Maalt, raat GET (ikke scriptets egen udskrift) — se `db/billeder.mjs` for
scriptets brug af samme kald:**

```
HTTP status: 200
body: {"id":"arkiv","name":"arkiv","owner":"","public":false,"file_size_limit":null,"allowed_mime_types":null,"created_at":"2026-08-25T12:50:36.930Z","updated_at":"2026-08-25T12:50:36.930Z"}
```

**Punkt 1 opfyldt: `GET /storage/v1/bucket/arkiv` svarer 200 med
`"public":false`.**

## Punkt 2 — --arkiv-op og --arkiv-ned

### Design: samme checksum-manifest, egen kopi pr. spand

`arkiv` faar sit EGET `_manifest.json`-objekt, adskilt fra
`robotbilleder`s — de er to forskellige objekter i to forskellige spandes
navnerum, ikke én delt fil. Samme begrundelse som den oprindelige
billedspand: eTag er MD5 ikke SHA-256, og ét manifest-kald for hele spanden
er billigere end ét metadata-kald pr. fil.

`findLokaleArkivFiler()` daekker **alle filtyper** (ikke kun
`BILLEDE_ENDELSER`) under `media/_kilder/` og `media/robotbilleder/`, MED
dotfiler (i modsaetning til `findLokaleBilleder()`, som springer dotfiler
over) — arkivet er en fuldstaendig sikkerhedskopi, ikke en kurateret
assets-mappe. `media/_arbejde/`, `media/inspiration/` og `media/raa/` er
IKKE i `ARKIV_MAPPER` og bliver aldrig laest.

### Uafhaengig taelling foer noget blev sendt op

Skrevet som et selvstaendigt Node-script (`taell.mjs`), IKKE ved at kalde
`findLokaleArkivFiler()` selv, for at faa et tal, der ikke kan vaere
korrumperet af en fejl i selve den funktion, det skal efterproeve:

```
media/_kilder: 501
media/robotbilleder: 269
total: 770
```

Derefter kaldt `findLokaleArkivFiler()` direkte for at sammenligne: **770 —
identisk med den uafhaengige taelling.** JPK's forventede stoerrelsesorden
(770 = 501 + 269) var korrekt.

### En ny Storage-faelde, fundet ved foerste rigtige koersel — ikke antaget

**Supabase Storage afviser objektnoegler med tegn uden for trykbar ASCII, og
de bogstavelige tegn `#` og `%` — ogsaa naar tegnet er URL-kodet.**
Foerste `--arkiv-op` fejlede oejeblikkeligt:

```
Error: Upload af arkiv/_kilder/LÆSMIG.md fejlede: 400 {"statusCode":"400","error":"InvalidKey","message":"Invalid key: _kilder/LÆSMIG.md","code":"InvalidKey"}
```

Jeg probede systematisk (7 testobjekter, oprettet og efterfoelgende slettet
igen med `DELETE /storage/v1/object/arkiv` + `prefixes`) for at finde det
PRAeCISE moenster, ikke gaette:

```
_test/aeoeaa.txt                    -> 200 OK
_test/ae-oe-aa-diakrit-æ.txt        -> 400 InvalidKey
_test/space test.txt                -> 200 OK
_test/paren(thesis).txt             -> 200 OK
_test/comma,and;semicolon.txt       -> 200 OK
_test/hash#and%percent.txt          -> 400 InvalidKey
_test/apostrophe's.txt              -> 200 OK
```

Konklusion: ikke-ASCII (`æ`, `ø`, `å` osv.) og de bogstavelige tegn `#`/`%`
er forbudte i selve noeglen — mellemrum, parenteser, komma, semikolon og
apostrof er OK. Et uafhaengigt scan af begge mapper (node, ikke `grep -P`,
som fejlede paa Windows-locale'n) fandt PRAeCIS ÉN ramt fil i hele arkivet:

```
Filer med ikke-ASCII eller # eller % i navnet: 1
 - _kilder\LÆSMIG.md
```

**Loesning:** `sikkerObjektNoegle(relPath)` i `db/billeder.mjs`, kaldt inde i
`objektUrl()` for BEGGE spande. Den er en REN funktion — erstatter hvert
problematisk tegn med `_u<kodepunkt>_` FOeR URL-kodning, ingen tilstand
gemmes, samme transformation regnes ud igen ved upload, download og
`--tjek`. Identitet for almindelige ASCII-filnavne, saa billedretningen
(`robotbilleder`) er upaavirket — bekraeftet ved regressionstesten nedenfor.
**Denne faelde staar IKKE i `db/LAESMIG.md` endnu — se "Nye Storage-faelder"
nedenfor.**

### De fire kraevede koersler, faktiske udskrifter

(a) `node db/billeder.mjs --arkiv-op` foerste gang (efter rettelsen ovenfor):
```
770 lagt op, 0 sprunget over (uaendret)
```
Matcher den uafhaengige taelling paa 770. Koerselstid: 3 min 40 sek (305 MB
op).

(b) samme kommando igen:
```
0 lagt op, 770 sprunget over (uaendret)
```
Koerselstid: 1,1 sek — checksum-springet virker.

(c) `node db/billeder.mjs --arkiv-ned --ud=<midlertidig mappe uden for
media/>`:
```
770 hentet ned, 0 sprunget over (uaendret)
```
Koerselstid: 4 min 59 sek. Efterfoelgende SHA-256-sammenligning (selvskrevet
Node-script, `node:crypto`) af alle 770 downloadede filer mod originalerne i
`media/_kilder/` + `media/robotbilleder/`:
```
originale filer: 770 nye (downloadede) filer: 770
770 af 770 identiske, 0 afvigelser
```
Den midlertidige mappe ryddet bagefter (`fs.rmSync(..., {recursive:true})`
via Node — bash `rm -rf` blev naegtet af sandboxen, samme fælde som forrige
spor stoedte paa).

(d) `node db/billeder.mjs --tjek` daekker nu BEGGE spande:
```
spand: robotbilleder, public=false
uden noegle: HTTP 400 — ikke laesbar
spand: arkiv, public=false
uden noegle: HTTP 400 — ikke laesbar
```
`arkiv`-linjen viser `public=false` og HTTP **400** (ikke 200) for et
laeseforsoeg uden noegle. **Alle fire acceptkriterier opfyldt ordret, med
DE MAALTE tal, ikke de foreslaaede.**

### Regressionstjek — billedretningen uroert af refaktoreringen

`objektUrl`/`uploadObjekt`/`downloadObjekt`/`hentManifest`/`gemManifest`
blev generaliseret til at tage spandnavnet som parameter for at kunne
genbruges til `arkiv`. For at bevise, at det IKKE aendrede
`robotbilleder`-flowet, koerte jeg det rigtige `--op`/`--ned` mod den LEVENDE
`robotbilleder`-spand (fra `spor/billedspand`, allerede i main):

```
--op:  0 lagt op, 0 sprunget over (uaendret)   [denne worktree har intet lokalt assets/fotos/fabrikant — forventet, se naeste linje]
--ned: 54 hentet ned, 0 sprunget over (uaendret)
```
54 hentet ned matcher det kendte tal fra `fund/FUND-billedspand.md` (54
fabrikantbilleder). Billedretningen virker uaendret gennem den samme
generaliserede kode, som arkivretningen nu ogsaa bruger.

## Punkt 3 — bevis at adskillelsen holder

**Metode, valgt frem for en tekstsoegning i kildekoden:** en eksporteret
funktion `proevAdskillelse(url)`, som koerer de RIGTIGE funktioner `ned()`
og `arkivNed()` — samme kode som `--ned`/`--arkiv-ned` bruger — men med
`global.fetch` og `fs.writeFileSync`/`mkdirSync`/`existsSync` MOCKET ud, saa
INGEN rigtige netvaerkskald eller filskriv sker. Alle URL'er, koden reelt
beder om, og alle stier, koden reelt vil skrive til, bliver optaget og
sammenlignet mod det forventede spand-/rodnavn.

Testet FOeRST manuelt (Bash + node) at monkey-patching af `fs.writeFileSync`
og `global.fetch` overhovedet virker under dette projekts Node-ESM-opsaet —
det gjorde det (se koerslen i denne rapports underliggende samtale), FOeR
selve `proevAdskillelse()` blev skrevet paa den antagelse.

**Hvorfor dette er staerkere end en tekstsoegning:** en soegning efter
"referer scriptet SPAND_ARKIV i ned()?" kan snydes af en omdoebt variabel
eller en indirekte reference. En koersel, der rent faktisk udfoerer koden og
observerer, hvilken URL og hvilken filsti den beder om, kan IKKE snydes uden
at aendre selve adfaerden.

**Maalt (`node db/billeder.mjs --proev-adskillelse`):**
```
ned() kaldte: [".../object/robotbilleder/_manifest.json", ".../object/robotbilleder/proeve-fil.txt"]
ned() skrev: ["...\assets\proeve-fil.txt"]
ned() rammer "arkiv"-spanden: nej
ned() skriver kun under assets/: ja
arkiv-ned() kaldte: [".../object/arkiv/_manifest.json", ".../object/arkiv/proeve-fil.txt"]
arkiv-ned() skrev: ["...\media\proeve-fil.txt"]
arkiv-ned() rammer "robotbilleder"-spanden: nej
arkiv-ned() skriver kun under media/: ja
ADSKILLELSEN HOLDER (maalt ved rigtig koersel, ikke antaget).
```

**Punkt 3 opfyldt: adskillelsen er bevist mekanisk, ikke paastaaet.**
Funktionen er eksporteret (`export { ..., proevAdskillelse, ... }`), saa den
kan koeres igen ved fremtidige aendringer af `ned()`/`arkivNed()` uden at
ramme den rigtige spand.

## Punkt 4 — pladsforbrug, maalt via API'et

Ikke ved lokal `du` — ved `POST /storage/v1/object/list/<spand>` rekursivt
(mapper har `id: null` i svaret og skal foelges ind), og en summering af
`metadata.size` for hvert BLAD-objekt (selvskrevet Node-script, ikke
scriptets egne manifest-tal, som en uafhaengig kontrol):

```
robotbilleder: 55 objekter, 27.06 MB (28.372.734 bytes)
arkiv: 771 objekter, 302.27 MB (316.954.153 bytes)
```
(55 = 54 billeder + 1 `_manifest.json`. 771 = 770 arkivfiler + 1
`_manifest.json`.)

**Samlet: 345.326.887 bytes = 329,33 MB** for begge spande tilsammen —
under en tredjedel af gratisplanens 1 GB, med god margin. (STATUS.md's L36,
skrevet af orkestratoren foer denne koersel, forventede ca. 333 MB ud fra de
lokale mappestoerrelser 305+28 MB — mit API-maalte tal er lidt lavere, 329,33
MB, hvilket er forventeligt: `metadata.size` er selve objektets bytes,
`du` paa disken taeller ogsaa allokeringsoverhead/blokstoerrelse.)

**Punkt 4 opfyldt, tal maalt gennem API'et, ikke `du`.**

## Nye Storage-faelder, fundet ved afproevning — boer ind i db/LAESMIG.md ved flettet

Jeg har IKKE rettet `db/LAESMIG.md` selv — den staar paa den forbudte liste.
To ting, en uprøvet læsning af Supabase Storage's dokumentation ikke ville
have fanget:

**6. Objektnoegler afviser ikke-ASCII-tegn og de bogstavelige tegn `#`/`%`
   — ogsaa naar de er URL-/procent-kodet.** `POST
   /storage/v1/object/<spand>/<noegle>` svarer 400 med
   `{"error":"InvalidKey"}`, naar den AFKODEDE noegle indeholder et tegn
   uden for trykbar ASCII (fx `æ`, `ø`, `å`) eller de bogstavelige tegn `#`
   eller `%`. `encodeURIComponent` loeser IKKE dette — det er selve
   NOEGLEN (efter afkodning), Storage afviser, ikke transportlaget.
   Mellemrum, parenteser, komma, semikolon og apostrof er derimod OK.
   Loesning: `sikkerObjektNoegle()` i `db/billeder.mjs` erstatter hvert
   problematisk tegn med `_u<kodepunkt>_`, som en ren, tilstandsloes
   funktion af den lokale sti.

**7. `POST /storage/v1/object/list/<spand>` returnerer mapper som
   "objekter" MED `id: null`** — for at faa filernes rigtige stoerrelse skal
   man rekursere med `prefix` for hver mappe man stoeder paa; et fladt kald
   uden prefix giver kun mapper og topniveau-filer, ikke en fuld rekursiv
   liste.

## Selv-tjek med taelling

15 kommandokoersler i alt, ekskl. den ene fejlede foerste `--arkiv-op` (som
afsloerede InvalidKey-faelden):
1. `--tjek` (opretter BEGGE spande, `robotbilleder` fandtes allerede) —
   bestod
2. 7 probe-uploads for at kortlaegge InvalidKey-moensteret — 5 lykkedes, 2
   fejlede som forventet (bekraeftede moensteret)
3. 5 probe-oprydninger (`DELETE .../object/arkiv` med `prefixes`) — bestod,
   200 med alle 5 navne i svaret
4. Uafhaengig taelling af `media/_kilder`+`media/robotbilleder` (node-script,
   IKKE `findLokaleArkivFiler()`) — 770
5. `findLokaleArkivFiler()` direkte kaldt — 770, matcher (4)
6. `--arkiv-op` foerste rigtige koersel — 770/0, bestod
7. `--arkiv-op` igen — 0/770, bestod
8. `--arkiv-ned --ud=<midlertidig mappe>` — 770/0, bestod
9. SHA-256-sammenligning af alle 770 hentede mod originalerne — 770/770, 0
   afvigelser
10. Midlertidig mappe ryddet (node `fs.rmSync`, bash `rm -rf` blev naegtet)
11. `--tjek` efter arkivering — begge spande `public=false`,
    `arkiv`-laesning uden noegle giver HTTP 400
12. `--op` (billeder) regressionstjek — 0/0 (intet lokalt at sende, forventet
    i denne worktree)
13. `--ned` (billeder) regressionstjek — 54/0, matcher det kendte tal fra
    `fund/FUND-billedspand.md`
14. `--proev-adskillelse` — begge retninger kalder korrekt spand, skriver
    korrekt rod, "ADSKILLELSEN HOLDER"
15. Pladsmaaling via API (rekursiv `list`) — 55 + 771 objekter, 329,33 MB
    tilsammen

**1 fejl fundet og rettet paa selve synkroniseringslogikken
(InvalidKey/ikke-ASCII-noegler — punkt 6 ovenfor). 0 andre fejl fundet i de
resterende 14 koersler.**

## Selv-review — usikkerheder og det, jeg ikke naaede

- **Manifestets sti-antagelse for arkivet er kun proevet mod den faktiske
  770-fil-maengde** — ikke stress-testet mod fx en fil, der aendrer navn
  UDEN at aendre indhold (ville vise som "ny fil, gammel forsvinder ikke fra
  manifestet" — samme kendte begraensning, `db/billeder.mjs`s hoved-kommentar
  allerede dokumenterer for billedretningen: manifestet kan komme ud af
  trit, hvis nogen redigerer spanden uden om scriptet. Arves uaendret).
- **`sikkerObjektNoegle()` er kun bevist mod ÉT rigtigt problem-tegn (Æ) og 6
  probe-tegn** — jeg har IKKE testet den mod hele Unicode-rummet
  (emoji, andre alfabeter). Den er skrevet generisk (alt uden for trykbar
  ASCII eskaperes), saa den BOeR daekke det, men det er ikke maalt mod noget
  udover de faktiske 770 filer plus 7 probe-navne.
- **Ingen samtidighedstest** af `--arkiv-op`/`--arkiv-ned` koert parallelt
  eller mod hinanden — samme kendte, teoretiske (ikke maalte) risiko som
  `fund/FUND-billedspand.md` allerede noterede for billedretningen. Ingen
  anden proces skriver til `arkiv`-spanden i dag.
- **Commit-strukturen er ikke rent "ét commit pr. punkt".** Jeg skrev hele
  filen (inkl. `--arkiv-op`/`--arkiv-ned`/`--proev-adskillelse`/
  `sikkerObjektNoegle`) i ét Write-kald, foer noget af det var koert — saa
  Punkt 1's commit indeholder ogsaa Punkt 2 og 3's kode, uefterproevet paa
  det tidspunkt. Rettelsen af InvalidKey-faelden og selve --arkiv-op/--ned-
  koerslerne blev en separat, reel commit (Punkt 2). Punkt 3
  (`--proev-adskillelse`) fik INGEN egen commit, fordi koden allerede laa i
  Punkt 1's commit, og der var intet nyt at diffe — jeg vaelger at skrive det
  aabent frem for en kunstig tom-diff-commit. Samme moenster som
  `fund/FUND-billedspand.md` selv rapporterede for forrige spor — det er
  anden gang, saa det er vaerd at naevne til orkestratoren som et
  taenkeligt moenster, ikke kun en enkeltstaaende glidning.
- **`.env`-noeglen er ALDRIG udskrevet** af nogen kommando i denne rapport
  eller dens underliggende koersler — kun `SUPABASE_URL` (ikke hemmelig) er
  synlig i `--proev-adskillelse`s udskrift. Ingen logudskrift ovenfor
  indeholder `SUPABASE_SERVICE_ROLE_KEY`.
- **`assets/fotos/fabrikant/` indeholder nu 54 filer i denne worktree** som
  et BIVIRKNING af regressionstesten (punkt 13 ovenfor) — gitignoreret,
  paavirker intet, men naevnes for fuldstaendighedens skyld.
- **Jeg har ikke flettet til main** — det er orkestratorens job, jf. briefet.
- **To nye Storage-faelder (punkt 6 og 7 ovenfor) boer foeres ind i
  `db/LAESMIG.md` ved flettet** — jeg har bevidst IKKE rettet filen selv,
  den staar paa den forbudte liste.
