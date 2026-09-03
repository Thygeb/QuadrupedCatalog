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

## Din worktree mangler det, git ikke bærer

Gitignorerede ting følger ikke med en gren. Mangler de, får du fejl, der ligner
dine egne:

| Hvad | Symptom, hvis den mangler |
|---|---|
| `.env` | Ingen adgang til databasen |
| `assets/fotos/fabrikant/` (610 filer) | Validatorens R18 giver **54 fejl** |
| `media/_kilder/` (19 mapper, 164 MB) | Ingen råkilder at efterprøve citater mod |
| `dist/` | **13 røde tests**, alle af typen *"siden findes"* |

Efterprøv dem, før du måler: `ls -la .env` ·
`ls assets/fotos/fabrikant | wc -l` · `ls -d media/_kilder/*/ | wc -l` ·
`node tools/build.mjs` **før** grundmålingen.

Målt 2. sep 2026 i en frisk worktree: grundmålingen gav **1384/14** mod main's
**1478/1**, udelukkende fordi `dist/` ikke var bygget. Uden det tjek rapporterer
du en afvigelse, der ikke er din.

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

- **Kør ikke `tests/koer.mjs`, medmindre briefet beder om det.** To samtidige
  kørsler crasher — de deler `tests/.tmp-koersel`, med hvert sit HEAD.
- **Disken er en begrænsning.** `tests/.tmp-koersel` kan nå 2,5 GB pr. worktree.
  Rammer du ENOSPC, er det miljøet og ikke dit arbejde.
- **Databasen er delt.** Skriver dit spor i den, så bevis bagefter, at 0
  ændringer ligger uden for dine egne rækker.

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
