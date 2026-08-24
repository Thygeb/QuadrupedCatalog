# Genopretning af media/robotbilleder/MANIFEST.tsv

24. aug 2026. Genoprettet fra `media/_arbejde/hentelog.json` (downloadlog, 19. aug) og de
endelige filer på disk. Filen er gitignoreret — denne rapport ligger i scratchmappen, ikke i
repoet, og orkestratoren lægger den ind i `fund/` selv.

## Skill-vurdering (obligatorisk)

Gennemgik projektets skilltabel og de globale skills før arbejdet startede. Ingen passede:
`robotdata` bærer 33-feltsskemaet for robot**poster** i `data/robots/` — helt anden fil, anden
struktur, rørt ikke. `parallelt` handler om at sætte flere agenter i gang parallelt fra
hovedagenten — jeg var allerede den udpegede agent på et enkelt spor, og selve matchingen er
sekventielt afhængig (skal hashe alle filer først), så det kan ikke deles yderligere. `grillmig`
grillar et brief *før* det sendes eller en beslutning *før* den låses — briefet var allerede
sendt, og der var ingen ny beslutning at låse. Design-/kritik-skills (`impeccable`, `critique`,
`ui-ux-critique`) og `new-project` handler om UI og scaffolding, ikke databaseret genopretning.
Konklusion: ingen skill passer på denne opgave — det bekræfter CEO'ens eget bud i briefet.

## Hvad der skete, kort

Ved fletningen 24. aug blev `MANIFEST.tsv` overskrevet med en 5-linjers fil (header + 4
rækker for `raion-robotics-raibo2`, `unitree-laikago`, `deep-robotics-lite3`,
`deep-robotics-x20`). De 4 rækker er bevaret uændrede. De resterende 219 − 4 = **215 filer**
på disk manglede en række.

**Vigtig rettelse undervejs:** `deep-robotics-lite3` og `deep-robotics-x20` har hver 6 filer i
deres mapper — kun 1 pr. mappe er den bevarede 24-aug-række (en nyere `-1.jpg`, hentet 24. aug
kl. 11:49/11:50). De øvrige 5 filer pr. mappe (fra 19. aug, `.png`) skulle stadig genskabes via
loggen. Mit første udkast af scriptet ekskluderede fejlagtigt *hele* de to mapper i stedet for
kun den ene bevarede fil — fanget under selv-tjek, rettet før den endelige kørsel (se
"Fejl fundet og rettet undervejs" nedenfor).

## Kilder og fremgangsmåde

1. `media/_arbejde/hentelog.json`: 430 poster, 43 unikke slugs. Status: 200 (417), 404 (9),
   000/fejlet (4). 427 poster har `bytes > 0`.
2. `media/_arbejde/raa-billeder/<slug>/*.bin`: alle 427 filer, som loggen refererer til med et
   reelt download, findes stadig på disk. De 3 resterende logposter (alle `mab-honey-badger-4/5`,
   status 000) har intet `.bin`, som forventet — curl-kommandoen fejlede dengang.
3. `media/robotbilleder/<slug>/`: 45 mapper, 219 filer i alt (inkl. de 4 bevarede).
   `raion-robotics-raibo2` og `unitree-laikago` findes slet ikke i loggen — de er 24-aug-tilføj-
   elser uden for det oprindelige 19-aug-fetch, og deres 1 fil hver er allerede fuldt dækket af
   den bevarede række.
4. Matching: sha256 på alle 427 `.bin`-filer → kort mod sha256 på alle 215 filer, der skulle
   genskabes. Ved kollision (flere logposter med samme hash) foretrækkes en logpost med samme
   slug, som ikke allerede er brugt. Sekundært: bytes-match inden for samme slug blandt ubrugte
   logposter.
5. `pixelmaal` genberegnet fra selve filens header (egen lille parser i scriptet: JPG
   SOF-markører, PNG IHDR-chunk, WEBP VP8/VP8L/VP8X). AVIF er ikke understøttet (kræver fuld
   ISOBMFF/HEIF-boks-parsing) — 4 filer har tom `pixelmaal` som følge heraf, jf. instruksen
   "kan et mål ikke læses, skriv tom streng".

Scripts ligger i denne scratchmappe: `genopret.js` (hovedscript, hash+match+skriv),
`check-bin.js`, `deep-check.js`, `bytes-global-check.js` (undersøgelser undervejs),
`verificer-c.js` og `selvtjek-stikprove.js` (efterprøvning).

## Matchprocent

**215 filer skulle genskabes. 189 matchet via sha256 (87,9 %). 0 matchet via bytes
(bytes-fallback fandt intet ekstra — se nedenfor hvorfor). 26 umatchede (12,1 %).**

Bytes-sekundærmatchning gav reelt intet: jeg tjekkede desuden *globalt* (på tværs af alle
slugs, ikke kun inden for samme slug) om de 26 umatchede filers exacte bytes-tal findes
*nogen steder* i loggens 430 poster — **nul træf**. De 26 filers sha256 findes heller ikke i
nogen af de 427 `.bin`-filer, uafhængigt af hvilken logpost der peger på dem (dobbelttjekket
med en selvstændig gennemgang af hele `raa-billeder`-træet). Konklusion: disse 26 filers
proveniens (URL, side, status, rang) findes ikke i `hentelog.json` — punktum, ikke en svaghed i
matchmetoden.

**Mønster i de 26 umatchede** (til orientering, ikke skrevet ind som fakta i TSV'en): de
klumper sig i to producentfamilier med byte-for-byte identiske billeder på tværs af
søskende-slugs — DeepRobotics (`lite3`, `lynx-m20`, `lynx-m20-pro`, `lynx-m20s`, `lynx-s10`,
`mini`, `x20`, `x30`) og Yobotics (`e-dog`, `y10`, `y20`). Det tyder på, at disse billeder blev
kopieret manuelt mellem søskende-modeller under den oprindelige udvælgelse, uden separat
fetch pr. slug — men det er en tolkning af mønsteret, ikke en kilde, og indgår derfor **ikke**
i de skrevne felter.

## De fire efterprøvninger

**(a) Antal rækker vs. antal filer.** `tail -n +2 MANIFEST.tsv | wc -l` → **219**.
`find media/robotbilleder -mindepth 2 -type f | wc -l` → **219**. Match.

**(b) De 4 bevarede rækker er uændrede.** Kopi af filen taget *før* første skrivning
(`MANIFEST-FOER.tsv` i denne mappe). `diff` mellem de 4 oprindelige datarækker og de 4 sidste
rækker i den nye fil: **tomt output = byte-identiske**.

**(c) Ingen fil uden række, ingen række uden fil.** Selvstændigt kontrolscript
(`verificer-c.js`, uafhængigt af hovedscriptets egen bogføring): 219 rækker, 219 filer på disk,
**0 filer uden række, 0 rækker uden fil, 0 duplikerede slug+filnavn-nøgler**. Bifund: 3 slugs
(`deep-robotics-lynx-m20`, `deep-robotics-lynx-m20-pro`, `yobotics-y20`) har flere rækker med
samme `rang`-værdi — det er loggens eget `rang_gaet`, arvet uændret, ikke en fejl i matchingen.

**(d) Stikprøve på 3 URL'er (dokumentation, ikke krav om 200):**
- `boston-dynamics-spot-4.jpg` → `bostondynamics.com/.../spot-thermal-camera-...jpg` → **HTTP 200**
- `rivr-one-4.jpg` → `cdn.prod.website-files.com/.../RIVR_Specs_Card_...jpg` → **HTTP 200**
- `weilan-alphadog-e400l-5.png` → `weilan.com/en/images/section/ad_c100.png` → **HTTP 200**

Alle 3 svarede 200 5 dage efter den oprindelige hentning. Ingen konklusion draget af det —
kunne lige så godt have været 404, sider ændrer sig.

## Selvstændigt stikprøve-tjek af selve matchingen (ikke kun optælling)

Ud over de 4 krævede efterprøvninger kørte jeg en uafhængig verifikation af 5 tilfældigt
spredte matchede rækker (`selvtjek-stikprove.js`): for hver række slås logposten op på ny via
slug+URL, dens `.bin`-fils sha256 genberegnes fra bunden, og det tjekkes at den er lig rækkens
`sha256`, OG at rækkens `sha256` er lig den faktiske fils sha256 på disk lige nu.
**Resultat: 5 af 5 OK, 0 fejl.**

## Hvad der er tabt for altid

`indhold_gaet` (menneskeligt/heuristisk skøn: "produktbillede", "detalje", "i brug",
"usikkert") findes intet sted i `hentelog.json`. **Skrevet som tom streng for alle 215
genskabte rækker.** De 4 bevarede 24-aug-rækker beholder deres oprindelige "produktbillede" —
de er ikke rørt. Loggens `score`/`kilde`-felter (fx `score: 12, kilde: "img@src"`) er brugt som
spor under selve matchingen og nævnt her i rapporten, men er **ikke** skrevet ind i
`indhold_gaet`, som instrueret — de måler noget andet (en heuristisk placeringsscore under
crawl, ikke et indholdsskøn af det færdige billede).

## Hvad der er andengenerations

`hentet_utc` for alle 215 genskabte rækker er filens `mtime`, ikke et målt hentetidspunkt.
Loggen bærer intet tidsstempel. Dette var allerede tilfældet i den oprindelige (nu tabte)
manifest-generation — mtime var dokumenteret som en **øvre grænse**, ikke en måling, og det
gælder stadig: filens mtime kan være senere end det faktiske downloadtidspunkt (fx hvis filen
blev rørt igen under omdøbning/udvælgelse 19. aug). Denne genopretning er derfor
**andengenerations-mtime**: en ny måling af den samme upræcise kilde, ikke en forbedring af
præcisionen.

## Selv-tjek med tælling

- Filer på disk optalt to gange, med to forskellige metoder (`find | wc -l` i bash, og en
  selvstændig `fs.readdirSync`-gennemgang i `verificer-c.js`): begge gav **219**.
- Bevarede rækkers filnavne læst direkte fra den *nuværende* MANIFEST.tsv (ikke hardkodet i
  scriptet) via `loadPreservedRows()`, så en fremtidig ændring i hvilke 4 rækker der er
  "bevarede" ikke kræver en kodeændring.
- 427 af 430 logposter har en eksisterende `.bin`-fil; de 3 manglende er alle status 000
  (fejlet download) — talt og krydstjekket mod `entry.bytes === 0` og `entry.fejl`-feltet.
- 189 sha256-matches + 0 bytes-matches + 26 umatchede = 215 — tjekket at de tre tal summer til
  det forventede antal filer, der skulle genskabes.
- 5 uafhængige stikprøve-verifikationer af selve match-logikken (ikke kun antal): 5/5 OK.

## Selv-review — hvad jeg er usikker på

**Fejl fundet og rettet undervejs (skrives åbent, ikke skjult):**
1. Første udkast ekskluderede *hele* `deep-robotics-lite3`- og `deep-robotics-x20`-mapperne fra
   rekonstruktionen (troede fejlagtigt at "bevaret slug" betød "bevar alle filer i den slug").
   Fanget da optællingen ikke gik op (205 forventet mod 219 filer på disk). Rettet til at
   udelukke præcis de 4 bevarede slug+filnavn-kombinationer, ikke slugs som helhed.
2. Under samme rettelse indsneg der sig en enkelt null-byte i scriptets kildekode (en mellemrums-
   tegn i en template-literal blev til `\u0000` — årsagen er ukendt, muligvis en encoding-fejl i
   redigeringsværktøjet). Det gjorde at nøgle-sammenligningen ("er denne fil en af de 4
   bevarede?") aldrig ramte. Fanget fordi `grep` rapporterede filen som "binary" — usædvanligt
   for en `.js`-fil, hvilket fik mig til at undersøge nærmere i stedet for at ignorere det.
   Rettet ved at genskrive scriptet med en sikker separator (`|||`) i stedet for mellemrum, og
   bekræftet 0 null-bytes bagefter.

**Reelle usikkerheder, ikke fejl:**
- De 26 umatchede rækker har tom `billede_url`/`side_url`/`http_status`/`rang`. Det er en
  bevidst beslutning — ingen af de to matchmetoder (sha256, bytes) gav noget resultat, hverken
  inden for samme slug eller globalt på tværs af alle 430 logposter, så jeg har ikke gættet mig
  til en proveniens. En læser af TSV'en skal vide, at "tomt" her betyder "ingen kilde fundet",
  ikke "0" eller "ikke undersøgt".
- Bytes-fallback endte reelt aldrig med at blive brugt (0 matches). Det er ikke en fejl i
  koden — det afspejler at ingen af de resterende sager havde et unikt bytes-match, hverken
  inden for slug eller globalt. Metoden var korrekt implementeret, men gav ingen gevinst på
  netop dette datasæt.
- AVIF-pixelmål (4 filer) er ikke implementeret — kun tom streng, som instruksen tillader ved
  ulæselige mål. En fuld AVIF/HEIF-boks-parser var muligt at bygge, men vurderet som
  overengineering for 4 filer, når reglen eksplicit tillader tom streng.
- Sortering er efter `slug`, dernæst numerisk `rang` (tomme rang-værdier sorteres sidst inden
  for slug'en), dernæst `filnavn` som sidste tiebreaker. Ikke eksplicit specificeret i
  opgaveteksten hvordan tomme rang-værdier skal sorteres — dette er mit eget, dokumenterede
  valg.
- Jeg har **ikke** rørt `media/_arbejde/hentelog.json`, `.bin`-filerne eller nogen fil i
  `media/robotbilleder/<slug>/` — kun læst dem. Eneste skrevne fil i repoet er
  `media/robotbilleder/MANIFEST.tsv` (gitignoreret), plus alt i denne scratchmappe.

## Filer

- Genskabt: `c:\Praktik\websites\udstilling\media\robotbilleder\MANIFEST.tsv` (219 datarækker,
  UTF-8 uden BOM, tab-separeret)
- Backup af filen før genopretning: `MANIFEST-FOER.tsv` (denne mappe)
- Hovedscript: `genopret.js`
- Mellemresultat med fuld detalje pr. række (inkl. `_matchType`, `_logKilde`):
  `match-resultat.json`
- Undersøgelses- og verifikationsscripts: `check-bin.js`, `deep-check.js`,
  `bytes-global-check.js`, `verificer-c.js`, `selvtjek-stikprove.js`, `debug-keys.js`
