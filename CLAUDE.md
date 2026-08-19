# Projekt: Oversigt over firbenede robotter (quadrupeds)

Selvstændigt projekt. **Ikke** en del af KeyResearch-konceptsiden.

Mappestrukturen er besluttet 19. aug 2026, men **ikke udført endnu** — se Å4 i
[STATUS.md](STATUS.md) for hvorfor rækkefølgen betyder noget:

```
c:\Praktik\websites\salg\          KeyResearch' salgsside   (i dag: c:\Praktik\website)
c:\Praktik\websites\udstilling\    dette projekt            (i dag: c:\Praktik\guide)
```

De to deler tone, målescripts og fontstrategi — intet andet.
De har hver sit git-repo, hver sin CLAUDE.md og hver sin beslutningshistorik.

**Denne fil er reglerne. [PRODUCT.md](PRODUCT.md) er produktsandheden. [PLAN.md](PLAN.md) er
byggeplanen.** Status: planlægning. Der er ikke skrevet kode endnu, og der skrives ikke kode,
før CEO'en siger til.

---

## Første handling ved enhver ny opgave: vurdér skills

**Hver gang der kommer en instruks — også en lille — starter du med at vurdere, hvilken skill
der er relevant, og skriver det.** Ikke som formalitet: en skill der findes og ikke bruges, er
værre end ingen skill, fordi den næste antager at den blev brugt.

Skriv altid to ting: **hvilken du valgte, og hvilke du gik forbi med begrundelse.** Passer
ingen, så skriv det — "ingen skill passer her" er også et svar, og det er et bedre svar end
tavshed.

Faldgruben er ikke uvidenhed. Det er at bruge **den skill man husker** frem for den der passer.
Kør `ls C:/Users/thyge/.claude/skills/` og se den fulde liste i systemets skill-oversigt, før
du vælger.

Relevante for det her projekt:

| Skill | Hvornår |
|---|---|
| `impeccable` (`shape`, `new-work`, `harden`, `adapt`) | Al design- og IA-planlægning. Kører nu |
| `new-project` | Når vi scaffolder: git, .gitignore, /run. Ikke før vi koder |
| `ui-ux-critique` | Kritikrunder på en bygget side. AI-prosa-scanneren hører til her |
| `critique` | Designeffektivitet, når der er noget at vurdere |
| `dataviz` | Sammenligningsgrafik, specifikationstæthed, filtervisualisering |
| `code-review` / `simplify` | På generatoren, når den findes |

## Sprog

Siden er **dansk og engelsk ved lancering**, bygget til flere. Skriv til CEO'en på dansk.

Arkitekturregel, der ikke må brydes: **sprogneutrale tal ét sted, oversat tekst i én fil pr.
sprog, URL pr. sprog, `hreflang` imellem dem.** `data-en`-attributløsningen fra `salg`-projektet
må ikke genbruges her — den er en kontakt med to stillinger og kan ikke få en tredje.

## Hårde begrænsninger

Arvet fra KeyResearch, og de gælder her med fuld kraft:

1. **Ingen forhandleraftale med nogen fabrikant.** Siden må aldrig kunne læses som salgskanal.
   Ingen købsknap, ingen affiliate-links, ingen prisforespørgselsformular i en katalogpost.
2. **Opfind aldrig tal, cases, certificeringer eller kapaciteter.** Håndhæves mekanisk:
   bygget skal fejle, hvis et talfelt mangler enhed eller kilde.
3. **Fabrikanternes billeder må bruges — men kun så længe siden er lokal.** Ophævet af JPK
   19. aug 2026. Den oprindelige regel forbød dem helt, både juridisk og fordi et pressefoto
   er det stærkeste signal om et forhandlerforhold, der ikke findes.
   **Spærring, der ikke må glemmes:** siden må ikke publiceres, mens den viser fabrikantbilleder
   uden skriftlig tilladelse. Enten indhentes tilladelserne, eller billederne udskiftes med
   egne fotos og silhuetter før lancering. Nabosiden har allerede oplevet, at en pladsholder
   overlevede til lancering — se `media/_kilder/LÆSMIG.md`.
4. **Ingen AI-genererede billeder af robotter eller mennesker.**
5. **"Ikke oplyst", "nej" og "0" er tre forskellige tilstande** og skal se forskellige ud.
   Det er der, katalogsider lyver.
6. **Ingen redaktionel 1-5-score uden offentliggjort metode med acceptkriterier.** Se
   afvist-listen i `salg`-projektets STATUS.md: "en konklusion skrevet om til tal".

## Dokumentregler

- **Genbrug aldrig et dokumentnavn. Nummerér videre.**
- Nye fund føres ind i STATUS.md, når den findes. Kritikdokumenter er arkiv.

## Arbejde med filen

- `node` ligger i `/c/Program Files/nodejs/node.exe` — Git Bash har den **ikke** på PATH.
- **PowerShell 5.1:** dobbelte anførselstegn ødelægger argumentoverførsel til native kommandoer.
  Skriv commit-beskeder til en fil og brug `git commit -F <fil>`.
- Skriv filer med UTF-8 **uden** BOM. `Set-Content -Encoding utf8` ødelægger tankestreger.

---

## Arbejdsform — parallelle agenter

Fast regel, sat af JPK 19. aug 2026. Gælder alt arbejde i dette projekt.

1. **Kør agenter parallelt**, når opgaven kan deles. Én agent ad gangen er undtagelsen,
   ikke normen.
2. **Egen git-worktree til hver agent.** `git worktree add ../guide-wt-<navn> -b <gren>`
   fra `c:\Praktik\guide`. **Ikke** Agent-værktøjets `isolation: "worktree"` — den
   forgrener fra sessionens arbejdsmappe, som kan være et andet repo.
3. **Hver agent indlæser passende skill, hver gang en ny opgave starter.** Skriv hvilken
   der blev valgt, og hvilke der blev gået forbi med begrundelse. "Ingen skill passer
   her" er et gyldigt svar — men det skal skrives, ellers kan næste læser ikke se
   forskel på et fravalg og en forglemmelse.
4. **Hver agent efterprøver sit eget arbejde.** Ikke "ser rigtigt ud": åbn kilden igen,
   gå felt for felt, og skriv hvor mange der blev efterprøvet og hvor mange fejl der
   blev fundet. Nul fundne fejl uden en tælling er ikke en efterprøvning.
5. **Hver agent laver sit eget review** af sit resultat, før det leveres, og skriver hvad
   den er usikker på. Et review, der kun indeholder det der lykkedes, kan ikke bruges til
   at beslutte noget.
6. **Agenter arbejder kun i deres egen worktree.** `c:\Praktik\website` er et andet
   projekt og må aldrig røres.

Grene flettes til `main`, når arbejdet er efterprøvet — ikke før.

---

## Mappestruktur

```
data/robots/          én YAML pr. robot — én robot = én commit, git-diffbar
data/manufacturers/   én YAML pr. producent
data/i18n/            da.json, en.json — UI-strenge og feltnavne
assets/silhuetter/    måltro SVG i fælles målestok. Se mappens LÆSMIG.md
assets/fotos/         fotografier vi selv har taget. Tom indtil videre
assets/ikoner/        UI-ikoner, SVG
assets/fonts/         lokale variable woff2
media/_kilder/        fabrikantmateriale. KUN reference. Gitignoreret. ALDRIG publicering
media/raa/            eget råmateriale før beskæring
tools/                build.mjs, validate.mjs, målescripts
dist/                 byggeoutput. Gitignoreret
```

**`dist/` bygges kun fra `assets/`.** `media/` indgår aldrig i bygget — det er den
strukturelle håndhævelse af, at fabrikanternes materiale ikke kan slippe ud ved et uheld.

`media/_kilder/` er gitignoreret bortset fra sin LÆSMIG.md: materialet er bevis for hvad
en producentside sagde den dag, vi hentede et tal, men det er fabrikantens ophavsret og
skal ikke distribueres med repoet.

---

## Projektskills — brug dem frem for at gentage reglerne

Ud over de globale skills i tabellen ovenfor har projektet to egne i `.claude/skills/`:

| Skill | Hvornår |
|---|---|
| `robotdata` | Hver gang en robotpost tilføjes, opdateres eller efterprøves. Bærer 29-feltsskemaet, de ti hårde regler og selv-tjekket med tælling |
| `parallelt` | Hver gang arbejde deles på flere agenter. Bærer worktree-opsætningen, prompt-tjeklisten og de to fælder |

**Skriv aldrig reglerne af i hånden ind i en agentprompt.** Peg på skillen. Tre håndskrevne
kopier af samme regel divergerer ved den fjerde, og så arbejder agent fire efter en regel,
ingen har besluttet at ændre.

**Skills registreres ved sessionsstart.** Er en skill oprettet eller ændret i den kørende
session, giver den `Unknown skill`. Læs da `SKILL.md` fra disk og følg den derfra — og
**skriv i rapporten at du gjorde det**, så et stille fallback ikke forveksles med at
skillen kørte.

## Værktøjer på denne maskine

Målt 19. aug 2026. Git Bash har **ingen** af dem på PATH:

```
node    /c/Program Files/nodejs/node.exe          (v24.13.0)
python  /c/Users/thyge/AppData/Local/Programs/Python/Python314/python.exe
jq      findes ikke — brug node til at læse JSON
```

Tre fælder, der kostede kald samme dag ([ARBEJDSGANG.md](ARBEJDSGANG.md)):

- **`head` i Bash tæller ikke som en læsning for Edit-værktøjet.** Kun Read-værktøjet gør.
- **`sed -i`, der ikke matcher, gør intet — tavst og med exit 0.** Efterprøv altid med et
  `grep` bagefter, eller brug Edit-værktøjet, som fejler synligt.
- **Lange markdown-filer knækker i bash-heredocs.** Brug Write-værktøjet.
- **node og Git Bash er ikke enige om, hvor `/tmp` ligger.** Brug en sti i projektet.
