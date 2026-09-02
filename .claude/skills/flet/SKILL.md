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

### 3. `git merge --no-ff` med en fletbesked, der bærer TALLENE

Fletbeskeden er efterprøvningens journal: hvad orkestratoren selv målte (med
før/efter-tal), hvad der kun står i agentens rapport, og hvad der bevidst blev
accepteret uden måling. Næste læser skal kunne se forskel. Bærer beskeden
backticks, `$` eller anførselstegn: skriv den til en fil, `git commit -F`.

### 4. Tests på det FLETTEDE resultat — ikke kun på grenen

**Reglen, der manglede indtil 27. aug 2026** (fundet ved læsning af
superpowers' `finishing-a-development-branch`; vores egen praksis, men aldrig
skrevet): et flet kan knække det, ingen af de to grene knækkede — to grene, der
hver især består, kan tilsammen fjerne en fil, den anden bruger, eller stable
to testblokke forkert (det brød `tests/koer.mjs` én gang 26. aug).

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
   commit det, flyt det, eller slet det. Force uden den fremvisning er
   forbudt — også når du "er ret sikker på", det bare er byggerester.

Undtagelsen er målt tomhed: `status` ren OG `git rev-list main..<gren>` = 0.
Så er force blot en omvej om en fil-lås, og det er i orden.

### 6. Gren, settings og STATUS

- `git branch -d` (aldrig `-D`, medmindre grenen er bevist forfader til main —
  mål det med `git merge-base --is-ancestor`).
- `additionalDirectories` i `.claude/settings.json` renses for worktreen.
- Nye selvstændige testfiler fra sporet foldes ind i `tests/dele/` efter
  kontrakten i `tests/LAESMIG.md` — en test uden for kørslen er ingen test.
- **Pauses en worktree i stedet for at lukkes:** skriv den i STATUS.md med
  gren, sti og indhold, MÅLT (`status --short` + commits foran main) — ikke
  efter hukommelse. Å16-lærdommen: "der lå lidt" viste sig at være ingenting.

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
