# Miljøfælder på denne maskine

**Læs den her, før du kører din første kommando.** Hver post har kostet mindst
én runde i dette projekt. De er alle billige at undgå og dyre at opdage, fordi
de fleste af dem **fejler tavst** — kommandoen ser ud til at lykkes.

Er du orkestrator og skriver et brief: **peg på denne fil, kopiér den ikke.**

---

## Værktøjer og stier

`node` er `/c/Program Files/nodejs/node.exe`. **Git Bash har den ikke på PATH**,
og et bart `node` giver `command not found` med **exit 127**.

`python` er
`/c/Users/thyge/AppData/Local/Programs/Python/Python314/python.exe`.
Heller ikke på PATH. Startes den i baggrunden med `&`, skjuler `&` exitkoden, og
en fejlet start ligner en kørende server.

`jq` findes ikke. Brug node til at læse JSON. `bc` findes heller ikke —
brug `awk '{s+=$1} END{print s}'`.

**Skriv Windows-stier som `C:/Users/...`, ikke `/c/Users/...`, når stien gives
til et Windows-program.** `git -C /c/Praktik/...` fejler med
`fatal: cannot change to`, og node svarer `Cannot find module 'C:\c\Users\...'`.
Begge er målt her.

**`/tmp` ligger ikke samme sted for node og for Git Bash.** Brug en sti i
projektet eller i scratchpad'en.

## Exit 127 har to årsager, og kun læseteksten skiller dem

1. **`node: command not found`** — node var ikke på PATH. Se ovenfor.
2. **Libuv-assertionen:** et ægte `fetch()` efterfulgt af `process.exit()`
   crasher node v24.13.0 med `!(handle->flags & UV_HANDLE_CLOSING)` i
   `src\win\async.c:76` — **også når kaldet lykkedes og svaret er læst.**

**Reglen, som kan følges uden at tænke: har en fil lavet et netværkskald, så
kald aldrig `process.exit()` bagefter.** Sæt `process.exitCode` og lad
event-løkken tømme sig. `process.exit()` *før* det første `fetch` er ufarligt.

Mekanismen er timing, ikke netværk: `process.exit()` river løkken ned, mens en
handle stadig lukker. Samme symptom kan derfor komme efter enhver async-kilde
med åbne handles. Reglen er en bevidst over-approksimation.

**Fælden i selve målingen:** den første reproduktion her brugte `example.com`,
som ikke kan nås fra denne skal. Kaldet fejlede, begge varianter gav exit 1, og
det lignede en afkræftelse. Kun en kontrolkørsel **uden** `fetch`, som gav 0,
afslørede at apparatet var i stykker.

## Kommandoer, der fejler tavst

- **`sed -i`, der ikke matcher, gør intet — tavst, med exit 0.** Brug
  Edit-værktøjet, som fejler synligt, eller `grep` efter resultatet bagefter.
- **`head` i Bash tæller ikke som en læsning for Edit-værktøjet.** Kun
  Read-værktøjet gør.
- **Lange markdown-filer knækker i bash-heredocs.** Brug Write-værktøjet.
- **Efterprøv alt indhold, skallen har skrevet.** Bærer teksten backticks, `$`,
  `%` eller anførselstegn, udfører bash dem: en `node -e`-streng fik engang
  bash til at køre backtickene som kommandosubstitution og strøg alle filnavne
  ud af teksten. Commit og push gik igennem uden en fejl.
- **Send aldrig en kommando til `/dev/null`, hvis dens exitkode eller fejltekst
  er en del af målingen.** Fire worktrees blev engang målt med
  `git -C ... 2>/dev/null` og gav alle "0 commits, intet ucommitteret". Git
  havde aldrig kørt. To spors arbejde var ét skridt fra at blive slettet.

## Filer og tegn

- **UTF-8 uden BOM.** PowerShells `Set-Content -Encoding utf8` ødelægger
  tankestreger.
- **Commit-beskeder med backticks, `$` eller anførselstegn skrives til en fil**
  og committes med `git commit -F <fil>`. PowerShell 5.1's dobbelte
  anførselstegn ødelægger argumentoverførsel til native kommandoer.
- **`core.autocrlf=true` checker filer ud med CRLF, mens node skriver LF.** En
  test, der sammenligner bytes med en committet fil, er derfor kun grøn i den
  worktree, der skrev filen. Normalisér `\r\n` → `\n` på begge sider.
- **`node.exe` læser en MSYS-sti som en Windows-sti — og melder succes.**
  Giver du `/c/Praktik/…` som udfil til et node-script, skriver det i
  `C:\c\Praktik\…`, skriver *"skrevet <sti>"* og giver **exit 0**. Målt 3. sep
  2026: seks skærmbilleder landede der, og mappen jeg havde oprettet var tom.
  **Kvitteringen var sand og alligevel vildledende.** Brug `C:/…` i ethvert
  argument, der når node. Samme familie som `sed -i`, der ikke matcher.
- **`grep -P` virker ikke på denne maskine** — *"grep: -P supports only unibyte
  and UTF-8 locales"* — og et `-P`-mønster i en pipeline giver derfor **falske
  mismatch**, ikke en fejl du bemærker. Brug `awk -F'\t'` eller node.
- **`grep "[æøåÆØÅ]"` i bash matcher HVER ikke-ASCII-byte her, ikke dansk.**
  Målt 3. sep 2026 af `udstilling-fb`: grep gav **45** filer, en UTF-8-korrekt
  node-måling gav **9**. Kontrolgruppen, der afslørede det: **40** filer bærer
  kinesiske tegn og **66** bærer ikke-ASCII uden æøå — alle blev talt som
  "dansk". **Mål dansk med node, aldrig med bash-grep.**

## Din worktree mangler det, git ikke bærer

Gitignorerede ting følger ikke med en gren. Mangler de, får du fejl, der ligner
dine egne:

| Hvad | Symptom, hvis den mangler |
|---|---|
| `.env` | Ingen adgang til databasen |
| `assets/fotos/fabrikant/` (610 filer) | Validatorens R18 giver **76 fejl** — og så en kæde, se nedenfor |
| `media/_kilder/` (19 mapper, 164 MB) | Ingen råkilder at efterprøve citater mod |
| `dist/` | **13 røde tests**, alle af typen *"siden findes"* |

Efterprøv dem, før du måler: `ls -la .env` ·
`ls assets/fotos/fabrikant | wc -l` · `ls -d media/_kilder/*/ | wc -l` ·
`node tools/build.mjs` **før** grundmålingen.

Målt 2. sep 2026 i en frisk worktree: grundmålingen gav **1384/14** mod main's
**1478/1**, udelukkende fordi `dist/` ikke var bygget. Uden det tjek rapporterer
du en afvigelse, der ikke er din.

### Rækkefølgen `validate → build → koer.mjs` er ikke valgfri

**Målt to gange uafhængigt 3. sep 2026 — af orkestratoren og af `spor/prodtest`,
som ikke kendte hinandens målinger.** De manglende fotos udløser en **kæde**, og
kun det første led ligner sin årsag:

```
assets/fotos/fabrikant/ mangler
  -> node tools/validate.mjs   76 FEJL ("R18: filen findes ikke: ...png")
  -> node tools/build.mjs      STOPPER. "dist/ er ikke skrevet."
  -> node tests/koer.mjs       16 FEJL af typen
                               "24.3: der ER bygget sider at maale paa"
                               "24.5 da/index.html: filen findes"
                               "35 da: katalogsiden er bygget"
```

**De 16 ligner seksten ægte testfejl. Det er én manglende mappe.** Ingen af dem
nævner billeder, og et spor, der kun kører suiten, ser aldrig årsagen.

```
cp -r ../udstilling/assets/fotos/fabrikant/. assets/fotos/fabrikant/
```

**Kør derefter validate, så build, så suiten — i den rækkefølge.** Springer du
bygget over, måler du et `dist/`, der enten mangler eller er fra et andet commit.

**Skriv aldrig nøglen fra `.env` i en fil, en commit eller din rapport.**

## Server og porte

**Brug din egen port** — 8123, 8124, 8125 … **aldrig 8080.** Den er delt mellem
alle samtidige spor, og en fremmed servers svar ser præcis ud som dit eget.
Tre forældreløse processer på 8080 er målt samtidig.

Start altid fra projektroden, aldrig med `cd dist` — så låser serveren mappen,
og næste byg fejler med EPERM:

```
/c/Users/thyge/AppData/Local/Programs/Python/Python314/python.exe -m http.server <port> --directory dist
```

**Verificér serveren mod disken, før ét eneste tal bruges.** Vælg en streng, der
kun findes i din egen udgave:

```
curl -s http://localhost:<port>/system.css | grep -c "<din streng>"
grep -c "<din streng>" assets/system.css
```

Giver de to forskellige tal, måler du en anden agents byg. **En server er et
måleapparat, og et nyt måleapparat valideres mod et kendt svar.**

**Luk serveren, før du rapporterer**, og skriv i rapporten, at du gjorde det.

## Delte ressourcer mellem samtidige spor

- **`tests/.tmp-koersel` er IKKE delt mellem worktrees. Det er DISKEN, der er
  delt.** Rettet 3. sep 2026, efter at **to sessioner planlagde deres rækkefølge
  på den forkerte antagelse**. Målt samme dag — tre separate mapper à 3,0 GB:
  `./tests/.tmp-koersel` · `../udstilling-wt-cert2/tests/...` ·
  `../udstilling-wt-foto2/tests/...`. ENOTEMPTY-crashet rammer to samtidige
  kørsler i **samme træ**, ikke to worktrees.
- **Kør alligevel `tests/koer.mjs` så få gange som muligt.** Én kørsel er
  **~2,8 GB**, og tre samtidige spor er 8,4 GB. **Disken ramte 0,0 GB af 236
  den 3. sep 2026** og stoppede tre sessioner samtidig: en testkørsel døde på en
  write-syscall, et `sed` på *"No space left on device"*. Årsagen var 16,5 GB i
  seks `.tmp-koersel`.
- **Du må IKKE rydde den selv.** `Bash(rm -rf:*)` står i
  `.claude/settings.json` linje 25's deny-liste. Rammer du ENOSPC, er det
  miljøet og ikke dit arbejde: **meld det og stop.** Gå ikke uden om afvisningen
  ved at slette en anden sti — handlingen er den samme, og *"det er min egen
  mappe"* er præcis det argument, der gør en omvej til noget, der lyder rimeligt.
  `git worktree remove` er i orden, fordi det er **en anden kommando med en
  anden virkning** (den kræver committet arbejde og efterlader grenen), ikke
  fordi den tilfældigvis frigør samme plads.
- **Databasen er delt.** Skriver dit spor i den, så bevis bagefter, at 0
  ændringer ligger uden for dine egne rækker.

## Kør ALDRIG en formatter

Tilføjet 3. sep 2026. Et spor efterlod **2.777 omformaterede linjer** i
`generator.css` og **644** i en skabelon — enkelte anførselstegn lavet om til
dobbelte, import-lister brudt op i én linje pr. navn — oven i **152 linjers**
ægte arbejde. Sporet opdagede det ikke selv; orkestratoren så det i diffen.

**Ingen formatter, ingen linter med `--fix`, intet værktøj der omskriver en hel
fil.** Rør kun de linjer, opgaven kræver. Et flet, hvor 2.700 af 2.850 linjer er
støj, kan ikke reviewes — og reviewet er det, der fanger fejl i dit arbejde,
før JPK ser dem.

**Er skaden sket, så bevis hvad der er ægte frem for at gætte:** normalisér
begge filstrømme (fjern whitespace, ensret anførselstegn, fjern efterstillede
kommaer) og diff de normaliserede udgaver mod hinanden. Sporet gjorde netop det
og kunne vise, at hver eneste tilbageværende forskel var parenteser om ternærer,
manglende nul foran decimaler og hex-versalisering — **nul semantisk ændring**.
Uden det bevis måtte orkestratoren have kasseret 24 linjer, der lignede ægte
arbejde.

**Kontrol, der fanger det på ét sekund:** `git diff --shortstat` og
`git diff -w --shortstat` skal give **samme tal**. Afviger de, har noget
omformateret.

## Måleapparater generelt

To fælder, der begge giver plausible tal og derfor aldrig udløser en fejljagt:

- **`grep -c` på en diff tæller hele filen**, ikke ændringen. Uden `^[-+]` gav
  den 99 kontekstlinjer.
- **Råt `grep -o '{'` i CSS tæller også klammer i kommentarer** — 504 mod
  motorens 493.

Og et mønster, der ser tomt ud, kan være forkert frem for sandt:
`grep -o 'kort--seneste'` over en ordgrænse rammer også `chip-fod`, fordi `\b`
matcher hen over bindestregen. **Skriv den forventede værdi, før du læser
resultatet** — det er hovedreglen i `SKILL.md` punkt 2.
