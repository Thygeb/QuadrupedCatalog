---
name: flet
description: Orkestratorens flet- og oprydningsprotokol for quadruped-kataloget. Brug den HVER gang et spor skal flettes til main, en worktree skal fjernes, eller en gren skal lukkes — også når flettet "bare er en lille ting". Bærer de to regler, projektet manglede indtil 27. aug 2026: tests skal bestå på det FLETTEDE resultat, og --force på en worktree kræver en måling først. Kun orkestratoren fletter; et spor fletter aldrig sig selv.
---

# Flet — fra godkendt rapport til lukket spor

Flettet er sidste sted, en fejl kan komme ind, og første sted, arbejde kan
forsvinde. Begge dele er sket her. Protokollen er én liste, i rækkefølge.

## Før flettet

### 1. Efterprøvningen er sket — efter konfidens, ikke efter rapport

Ingen flet uden at orkestratoren selv har målt (CLAUDE.md's tre udfald:
flet / flet efter rettelse / afvis). **Høj** stikprøves ved at genkøre agentens
egen kommando; **middel** efterprøves i den endelige form; **lav** efterprøves
først og hårdest. Denne skill begynder, hvor dommen er "flet".

**ET SPOR, ORKESTRATOREN IKKE HAR BRIEFET, HAR KONFIDENS LAV PR. DEFINITION.**
Tilføjet 3. sep 2026, betalt tre gange samme aften. Konfidensskalaen antager, at
rapporten kommer fra et spor, vi har givet acceptkriterier og en grundmåling.
Et spor sendt fra et andet værktøj har ingen af delene, og dets rapport er
derfor en **påstand uden apparat** — uanset hvor selvsikker den lyder.

Målt: tre rapporter meldte hver *"100 % grøn, 1.744 bestået, 0 fejlet"*.

| Rapportens påstand | Målt af orkestratoren |
|---|---|
| `spor/producent`: 1744/0 | **1734/10** — den havde omformateret hele `generator.css` og gjort ti assertions blinde |
| `spor/robotpolering`: *"Før: `min-height: 30px`"* | Der var **ingen 30px**. Den gamle linje var 26px |
| `spor/skriftgulv`: 1744/0 | Holdt — men først efter måling |

**Ingen af de tre bar en grundmåling**, og ingen af dem havde en sektion om,
hvad sporet ikke nåede. **Kør derfor altid suiten selv, før et fremmed spor
flettes** — også når rapporten siger, at den allerede er grøn.

**KONTROLLEN, DER AFGØR DET FOR ÉT `ls`:** koster ingen tillid og ingen tid.

```
ls -d <worktree>/tests/.tmp-koersel
```

`tests/koer.mjs:41-42` kører `rmSync` efterfulgt af `mkdirSync` på **modulniveau**,
altså ved kørslens START og ikke ved dens slutning. Mappen findes derfor efter
**enhver gennemført kørsel**. Findes den ikke, blev suiten aldrig kørt der.

Målt 4. sep 2026: `spor/prodflade` rapporterede *"node tests/koer.mjs: 1.815
bestået, 6 fejlet"* som en kørt måling, og mappen fandtes ikke. Kontrollen blev
efterprøvet på **fire** worktrees, hvor sandheden var kendt i forvejen, og gav
rigtigt svar 4/4 — *"en kontrol, der kun er afprøvet på den sag, den skulle
afgøre, er ikke afprøvet."*

**Og læg mærke til skellet, den afdækker: tallet 1815/6 var RIGTIGT for grenens
base og alligevel UBELAGT.** *"Forkert"* og *"udækket"* kræver to forskellige
svar — en rettelse og en genkørsel. **En efterprøver, der kun leder efter
forkerte tal, finder aldrig det andet.**

### 2. Gitignorerede filer kopieres IND FØR flettet

`assets/fotos/fabrikant/` og `.env` følger ikke med en gren. Har sporet
tilføjet billeder, ligger de kun i worktreen — og fjernes worktreen først, er
de VÆK. Målt pris: MANIFEST-tabet 24. aug og billedvejen 26. aug (yuejia-yj30
skulle håndkopieres, ellers fejlede validate for alle).

```
cp <worktree>/assets/fotos/fabrikant/<nye filer> assets/fotos/fabrikant/
```

Sporets rapport skal bære listen over nye gitignorerede filer; mangler den, så
spørg sporet, før der flettes.

**Og det gælder ikke kun NYE filer. Det gælder REGENEREREDE.** Tilføjet
2. sep 2026 efter et fund fra den anden session. `db/kanonisk.json` og
`db/seed.sql` er gitignorerede artefakter, som spor regenererer undervejs.
Mains udgaver havde da været bagud **siden `spor/cert`** og manglede
`ccc_oplyst`, `fcc_oplyst` og `ul_oplyst`; den friske udgave fandtes kun i en
worktree, der var på vej til at blive fjernet.

Punkt 2's oprindelige formulering fanger det ikke, fordi den spørger
*"har sporet tilføjet filer?"* — og svaret er nej. Filen fandtes i forvejen.
Spørg derfor også:

```
diff <(git -C <worktree> log -1 --format=%H) <(git log -1 --format=%H)  # ikke nok
ls -la db/kanonisk.json db/seed.sql <worktree>/db/kanonisk.json …       # sammenlign dato og stoerrelse
```

**Er worktreens udgave nyere, så efterprøv den for sporets egne prøvedata,
FØR den kopieres ind** — den anden session målte 0 forekomster af de nøgler,
sporet arbejdede med, og gemte mains gamle udgave som sikkerhedskopi først.
Det er MANIFEST-tabet i ny forklædning: gitignoreret arbejde, der kun findes
ét sted og forsvinder med worktreen, hvis ingen måler før fjernelsen.

## Selve flettet

### 2b. Konflikter: `--ours` er GRENEN, når main flettes IND i den

Tilføjet 3. sep 2026, hvor tre spor havde rørt samme fil og alle tre kolliderede.

**Retningen afgør, hvad `--ours` betyder, og det er modsat af, hvad man husker:**

| Kommando | `--ours` er | `--theirs` er |
|---|---|---|
| `git merge <gren>` **på main** | main | grenen |
| `git merge main` **i worktreen** | **grenen** | **main** |

Målt: jeg kørte `git checkout --ours` i en worktree under et flet af main **ind
i** grenen, fik grenens gamle udgave tilbage og lagde dens regler oveni mains —
**så filen havde dem to gange**. Fanget på en kontroltælling: **3 forventet,
6 målt**. Uden den var dubletten gået i main.

**Formen, der lukker det:** vælg siden med den STRUKTUR, du vil beholde
(oftest main), og genanvend den anden sides SEMANTIK i hånden. Skriv derefter
en kontrollinje pr. genanvendt ændring, og **mål på resultatet, ikke på grenen**.

**Rækkefølgen mellem flere grene i samme fil er ikke ligegyldig.** Lander en
omformatering først, skal de små ændringer skrives om i den nye form — billigt.
Lander de små først, skal omformateringen genskabes i en konfliktløsning — dyrt.
**Tag den store strukturændring ind FØRST.**

**Og pas på instrumentet:** `git merge-tree main <gren>` måler hver gren mod
**main alene**, ikke gren-mod-gren. Den gav **0 konflikter for alle fire**
grene — et rent svar på et spørgsmål, jeg ikke havde stillet. Konflikterne
opstod i samme sekund, den første landede. **Genmål efter hvert flet.**

### 3. `git merge --no-ff` med en fletbesked, der bærer TALLENE

Fletbeskeden er efterprøvningens journal: hvad orkestratoren selv målte (med
før/efter-tal), hvad der kun står i agentens rapport, og hvad der bevidst blev
accepteret uden måling. Næste læser skal kunne se forskel. Bærer beskeden
backticks, `$` eller anførselstegn: skriv den til en fil, `git commit -F`.

**Hver efterprøvning i beskeden skal bære KOMMANDOEN, ikke kun konklusionen.**
Tilføjet 3. sep 2026, betalt af Å121: orkestratoren skrev i en fletbesked, at
kildemærket sad på omregnede katalogpriser. Det gjorde det ikke. Påstanden
stod uden den kommando, der havde produceret den, så ingen — heller ikke
skribenten dagen efter — kunne genkøre den, og den blev først trukket tilbage
i Å130 efter tre uafhængige målinger.

En fletbesked læses som **journal**, ikke som en mening. Derfor arves en fejl i
den tavst. Formen er den samme som konfidensskalaens *høj*: tallet plus den
kommando, der giver tallet igen.

### 4. Tests på det FLETTEDE resultat — ikke kun på grenen

**Reglen, der manglede indtil 27. aug 2026** (fundet ved læsning af
superpowers' `finishing-a-development-branch`; vores egen praksis, men aldrig
skrevet): et flet kan knække det, ingen af de to grene knækkede — to grene, der
hver især består, kan tilsammen fjerne en fil, den anden bruger, eller stable
to testblokke forkert (det brød `tests/koer.mjs` én gang 26. aug).

**Punkt 4 gælder også den, der EFTERPRØVER et flet — ikke kun den, der
fletter.** Tilføjet 3. sep 2026, betalt af to sessioner samtidig. Jeg flettede
`spor/robot3` med kun `validate` og `build`, begge grønne, og meldte
udtrykkeligt, at jeg ikke ville køre suiten. Den anden session efterprøvede
flettet og skrev også *"ingen tests/koer.mjs"*. Ingen af os løj, og begge
overså det samme.

**Validate og build grønne er ikke en efterprøvning.** De fanger ikke en klasse,
der lige er blevet død, en assertion, der lige er blevet forældet, eller et
testtal, der har flyttet sig. `.stribe--fem` døde, fordi sporet gav
nøgletalsstriben et sjette felt; test 57.1 gik fra 14 til 15 kendte døde klasser
i samme minut. **Det blev først set to spor senere**, hvor otte tests var røde
og årsagerne blandet sammen. Prisen var et helt ekstra spor for at rydde op.

**Først: meld til den anden session, hvis der er én.** To sessioner deler ét
arbejdstræ og ét ref-lager (STATUS Å124, Å131). To samtidige `koer.mjs` crasher
med et Node-stakspor, ikke en rød test — og *"main er i takt"* er en fælles
tilstand, ingen kan konstatere alene. Skriv via `SendMessage`: hvad du fletter,
hvilke filer, din forudsigelse for de tre tal — og vent på *"main er din"*.
Meld *"færdig"* bagefter. 17 flet på én dag, 0 kollisioner, med den regel.

Efter HVERT flet, på main:

```
node tools/validate.mjs   → 77 filer / 0 fejl (advarselstal noteres)
node tests/koer.mjs       → samme beståtal som grenen, samme kendte røde
node tools/build.mjs      → sidetal noteres
```

Fejler noget her, er flettet ikke færdigt — ret frem, aldrig `reset` af main.

## Oprydningen

### 5. `--force` på en worktree kræver en måling først

**Reglen, der manglede indtil 27. aug 2026.** `git worktree remove --force`
sletter ucommittet arbejde uden et spor i git. Rækkefølgen er:

1. `git -C <worktree> status --short` — **skriv resultatet.**
2. Tomt → almindelig `git worktree remove` (uden force).
3. Ikke tomt → **stop.** Vis JPK hvad der ligger, og lad valget være hans:

**`status` og `remove --force` må ALDRIG stå i samme kommando.** Tilføjet
4. sep 2026, betalt af den, der skriver reglerne. Punktet ovenfor siger
*"kør status først"*, og det krav kan opfyldes i én kommandolinje — hvor
outputtet først læses, når worktreen allerede er væk. Målt: `spor/skriftskala`s
worktree bar ` M DESIGN.md`, ` M fund/FUND-skriftskala.md` og
` M tests/dele/16-instrumentkort.mjs`, da den blev fjernet med `--force` i samme
kald som målingen. Grenen var fuldt flettet og suiten grøn, og hver ` M` den dag
var CRLF-støj — **men det kan ikke bevises, fordi beviset blev fjernet i samme
åndedrag som målingen.**

En regel om rækkefølge, der kan opfyldes i én kommando, er ingen regel.
**To separate kald, altid.** Læs resultatet af det første, før du skriver det
andet.
   commit det, flyt det, eller slet det. Force uden den fremvisning er
   forbudt — også når du "er ret sikker på", det bare er byggerester.

Undtagelsen er målt tomhed: `status` ren OG `git rev-list main..<gren>` = 0.
Så er force blot en omvej om en fil-lås, og det er i orden.

### 6. Gren, settings og STATUS

- **`git worktree list` som SIDSTE handling i ethvert flet — og læs den.**
  Tilføjet 4. sep 2026, fordi punkt 6 blev brudt af den, der skrev det.
  `spor/prodpolish` blev flettet, og worktreen blev stående. Prisen var ikke
  teoretisk: dens `tests/.tmp-koersel` bandt **3,1 GB**, mens den anden session
  stod på **5,5 GB fri disk** og var ved at afvige bevidst fra denne skills egen
  rækkefølge for at skaffe plads. Da den blev fundet, bar worktreen desuden **74
  ucommitterede linjer**, lagt der EFTER flettet.
  **Rodårsagen er ikke glemsomhed — det er, at fletbeskeden føles som slutningen.**
  Den er det ikke: punkt 6 er. Kør kommandoen, og se, at din worktree er væk,
  før du går videre til næste opgave.
- `git branch -d` (aldrig `-D`, medmindre grenen er bevist forfader til main —
  mål det med `git merge-base --is-ancestor`).
- `additionalDirectories` i `.claude/settings.json` renses for worktreen.
- Nye selvstændige testfiler fra sporet foldes ind i `tests/dele/` efter
  kontrakten i `tests/LAESMIG.md` — en test uden for kørslen er ingen test.
- **Pauses en worktree i stedet for at lukkes:** skriv den i STATUS.md med
  gren, sti og indhold, MÅLT (`status --short` + commits foran main) — ikke
  efter hukommelse. Å16-lærdommen: "der lå lidt" viste sig at være ingenting.

**Tager du et Å-, L- eller testnummer: PUSH rækken, FØR du melder nummeret
videre.** Tilføjet 3. sep 2026 efter en kollision, der blev fanget i luften.
To sessioner arbejdede i samme ref-lager; peer skrev *"jeg tager næste ledige
efter 137"* i samme minut, som denne session pushede Å138. **Begge havde målt
korrekt** — peer havde endda målt på rækkestart frem for på strengen, netop for
at undgå fejlen — men målingen var sand, da den blev taget, og falsk, da
beskeden nåede frem.

Vinduet mellem *at måle et nummer* og *at committe det* er reelt, og ingen
måling kan lukke det. **Filen er facit, ikke beskeden.** Rækkefølgen er derfor:
skriv rækken → commit → push → meld. Melder du først, har du reserveret et
nummer i en samtale, og samtaler har ingen låse.

**Sporets server skal være død, før worktreen fjernes — og det skal måles.**
Reglen kom til 1. sep 2026, hvor **fem forældreløse `python -m http.server`
fra døde spor** blev fundet kørende samtidig. To af dem holdt hver sin
worktree-mappe låst, så `git worktree remove` og `rmdir` begge svarede
`Permission denied` / `Device or resource busy`, og mapperne blev stående som
tomme husker, ingen turde røre. To andre optog porte, som nye spor havde fået
tildelt — så to porte havde to processer hver, og hvilken der svarede, var
ikke til at vide.

```
/c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe -NoProfile -Command \
  "Get-CimInstance Win32_Process -Filter \"Name='python.exe'\" | ForEach-Object { \
   '{0}  {1:HH:mm}  {2}' -f \$_.ProcessId, \$_.CreationDate, \$_.CommandLine }"
```

Starttidspunktet er det, der afgør sagen: er processen ældre end det spor, du
er ved at lukke, hører den til et dødt spor og skal lukkes. **Luk aldrig en
server, mens et andet spor kan være midt i en måling mod den** — vent til
dets flet, eller spørg.

`powershell` er ikke på PATH i Git Bash; brug den fulde sti ovenfor. Og
`Stop-Process` efterfulgt af et `Get-Process`-tjek i SAMME kommando lyver:
processen når ikke at dø, og du får "STADIG I LIVE" om en proces, der er
lukket. Mål i stedet ved at liste processerne igen bagefter.

### 7. Lukningen skal ramme ALLE steder, sagen findes

Å25/Å26-fejlformen: en sag lukkes dér, hvor fundets ordlyd pegede, og
overlever de andre steder (banneret blev fjernet, legenden blev stående;
kortene blev renset, robotsiden ikke). Sidste skridt før "færdig": spørg
*"hvor ELLERS findes det her?"* — og kør én søgning på tværs af `dist/`, der
beviser svaret.

**Et spor er ikke færdigt, før worktreen er væk og punkt 4's tre tal står i
fletbeskeden eller i terminalens output.**
