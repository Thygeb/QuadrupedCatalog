# Projekt: Oversigt over firbenede robotter (quadrupeds)

Selvstændigt projekt. **Ikke** en del af KeyResearch-konceptsiden.

Mappestrukturen, besluttet 19. aug 2026, er **udført** — begge flytninger er sket,
og de gamle stier `c:\Praktik\guide` og `c:\Praktik\website` findes ikke længere
(målt 25. aug 2026):

```
c:\Praktik\websites\salg\          KeyResearch' salgsside
c:\Praktik\websites\udstilling\    dette projekt
```

De to deler tone, målescripts og fontstrategi — intet andet.
De har hver sit git-repo, hver sin CLAUDE.md og hver sin beslutningshistorik.

**Denne fil er reglerne. [PRODUCT.md](PRODUCT.md) er produktsandheden. [PLAN.md](PLAN.md) er
byggeplanen. [DATAFLOW.md](DATAFLOW.md) er vejen et tal går** — fra producentens side til
den byggede side, med sekvensdiagrammer for de to veje ind i data og for billedvejen.

Status 25. aug 2026: **bygget og i drift.** Her stod tidligere *"planlægning. Der er ikke
skrevet kode endnu"* — det holdt op med at passe for en uge siden og vildledte enhver ny
agent, der læste linjen. Der findes i dag en afhængighedsfri Node-generator, 77 robotposter
med 1.110 kildebelagte tal, 213 byggede sider på to sprog, en Supabase-database som
redaktionslag (L34/L35) og to private Storage-spande (L36). **Lanceringen er ikke længere
spærret:** JPK ophævede billedspærringen S1 den 26. aug 2026 (L37). Her stod tidligere, at
siden ikke måtte publiceres med fabrikantbilleder — den betingelse gælder ikke mere.

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
**Målt 26. aug 2026: der findes præcis tre globale skills på maskinen** —
`impeccable`, `ui-ux-critique` og `critique`. Tabellen her nævnte tidligere også
`new-project`, `dataviz`, `code-review` og `simplify`; **ingen af dem findes**,
og en agent, der fulgte tabellen, fik `Unknown skill` og gik videre uden skill.
`critique` er *installeret* men **kan ikke køre**: dens første linje kræver
`frontend-design` og `teach-impeccable`, som heller ikke findes. Tabellen er
derfor skrevet om til det, der faktisk kan kaldes:

| Skill | Hvornår |
|---|---|
| `impeccable` | **Den vigtigste, og den mest oversete.** Én skill med 20+ underkommandoer. Se rækkerne nedenfor |
| `impeccable new-work` | Når en flade skal have en **retning**, ikke en rettelse. Bygger konkurrerende visuelle verdener, man kan se ved siden af hinanden |
| `impeccable shape` | Planlæg UX/UI, før der skrives kode |
| `impeccable critique` | Design-vurdering med heuristisk scoring: **virker designet**, ikke er det fejlfrit |
| `impeccable audit` | Teknisk kvalitet: tilgængelighed, ydelse, responsivitet |
| `impeccable layout` · `typeset` · `colorize` · `bolder` · `quieter` | Målrettede løft af ét lag ad gangen |
| `impeccable polish` · `harden` · `adapt` · `clarify` | Sidste kvalitetspas, produktionsklarhed, skærmstørrelser, UX-tekst |
| `impeccable live` | Vælg elementer i browseren og få genereret alternativer |
| `ui-ux-critique` | **Fejljagt** på en bygget side: hierarki, tilgængelighed, mobil, AI-prosa. Bemærk forskellen til `impeccable critique` — se advarslen nedenfor |
| `frontend-design` | **Anthropics officielle skill til visuelt design af ny eller omformet UI.** Slået til 26. aug 2026. Bærer to ting, `impeccable` ikke fremhæver lige så skarpt: kalibreringen mod de tre AI-standardudseender, og to-trins-processen hvor designplanen kritiseres for at være generisk, **før** der skrives kode. Brug den ved enhver ny flade |
| `critique` | **Ude af drift.** Kræver også `teach-impeccable`, som ikke findes. Brug `impeccable critique` |

**Fælde, der kostede fire agentbeskeder 26. aug 2026:** `frontend-design` lå hele
tiden på disken i `~/.claude/plugins/marketplaces/claude-plugins-official/`, men var
**ikke slået til** i `enabledPlugins`. Den dukkede derfor ikke op i skill-listen, og
fire spor blev sendt uden den. **Et plugin, der ligger i marketplace-mappen, er ikke
installeret** — kun det, der står i `.claude/settings.json`s `enabledPlugins`, kan
kaldes. Er en skill ikke slået til, kan dens `SKILL.md` stadig læses fra disk; skriv
da i rapporten at det blev gjort.

**Advarslen, der kostede tre runder:** `ui-ux-critique` svarer på *"er den her
side udført rigtigt?"*. `impeccable critique` svarer på *"er det her det rigtige
design?"*. KRITIK-1, KRITIK-2 og KRITIK-3 er alle tre af den første slags — og
det er derfor, udseendet ikke flyttede sig, selvom hver runde fandt ægte fejl.
**En fejlliste kan kun bringe siden tilbage til sit eget tilsigtede udseende.
Den kan aldrig hæve loftet.** Skal loftet hæves, er det `new-work` eller
`bolder`, ikke endnu en fejljagt.

**Til kodegennemgang** bruges CLI-kommandoen `/code-review` — den er ikke en
skill og kan ikke kaldes med `Skill`-værktøjet.

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
3. **Fabrikanternes billeder må bruges — også på en publiceret side.** Spærringen mod
   publicering er **ophævet af JPK 26. aug 2026** (L37). Reglen har haft tre trin:
   oprindeligt forbudt helt; 19. aug tilladt lokalt; 26. aug tilladt uden begrænsning.
   Rejs den ikke igen, og bed ikke om tilladelser — det er besluttet, ikke glemt.
   Ingen agent skal fremover føre S1 som en åben spærring eller blokere en lancering på den.
4. **Ingen AI-genererede billeder af robotter eller mennesker.**
5. **"Ikke oplyst", "nej" og "0" er tre forskellige tilstande** og skal se forskellige ud.
   Det er der, katalogsider lyver.
6. **Ingen redaktionel 1-5-score uden offentliggjort metode med acceptkriterier.** Se
   afvist-listen i `salg`-projektets STATUS.md: "en konklusion skrevet om til tal".

## Dokumentregler

- **Genbrug aldrig et dokumentnavn. Nummerér videre.**
- Nye fund føres ind i STATUS.md, når den findes. Kritikdokumenter er arkiv.
- **Agentrapporter (`FUND-*.md`) hører hjemme i `fund/`**, ikke i projektroden. Peg på dem
  med stien `fund/FUND-x.md`, ikke det bare filnavn — flere ligger der nu.

## Arbejde med filen

- `node` ligger i `/c/Program Files/nodejs/node.exe` — Git Bash har den **ikke** på PATH.
- **PowerShell 5.1:** dobbelte anførselstegn ødelægger argumentoverførsel til native kommandoer.
  Skriv commit-beskeder til en fil og brug `git commit -F <fil>`.
- Skriv filer med UTF-8 **uden** BOM. `Set-Content -Encoding utf8` ødelægger tankestreger.
- **Efterprøv altid indhold, som skallen har skrevet — ikke kun `sed`.** Reglen har hidtil
  kun dækket `sed -i`, der fejler tavst. Den gælder alt: 25. aug 2026 blev en STATUS.md-post
  skrevet gennem en `node -e`-streng, hvor bash udførte backtickene som kommandosubstitution
  og strøg **alle** filnavne ud af teksten — commit og push gik igennem uden en fejl. Bærer
  indholdet backticks, `$`, `%` eller anførselstegn, så brug Write/Edit-værktøjet, som fejler
  synligt. Gør du det alligevel i skallen: `grep` efter et af de tegn bagefter, før du
  committer.

---

## Arbejdsform — parallelle agenter

Fast regel, sat af JPK 19. aug 2026. Gælder alt arbejde i dette projekt.

1. **Kør agenter parallelt**, når opgaven kan deles. Én agent ad gangen er undtagelsen,
   ikke normen.

   **Fast regel, sat af JPK 21. aug 2026 — gælder hver eneste opgave:**
   **Undersøg ALTID, om flere agenter kan sættes i gang parallelt.** Ikke kun når opgaven
   åbenlyst kan deles — hver gang. Find de spor, der er reelt uafhængige, og skriv dem frem.

   **Spørg derefter i en pop-up** (`AskUserQuestion`), om de skal startes. Ikke i brødtekst,
   hvor svaret drukner — i en pop-up med ét spor pr. valgmulighed, så JPK kan vælge til og fra.

   Findes der ingen uafhængige spor, så skriv **hvorfor** — fx at to spor ville skrive i
   samme fil, eller at det ene venter på det andets resultat. *"Kan ikke deles"* er et
   gyldigt svar, men det skal begrundes, ellers kan næste læser ikke se forskel på et
   fravalg og en forglemmelse.
2. **Egen git-worktree til hver agent.** `git worktree add ../udstilling-wt-<navn> -b spor/<navn>`
   fra `c:\Praktik\websites\udstilling`. **Ikke** Agent-værktøjets `isolation: "worktree"` — den
   forgrener fra sessionens arbejdsmappe, som kan være et andet repo. Husk: `.env` og
   `assets/fotos/fabrikant/` er gitignoreret og skal kopieres ind, hvis sporet skal
   bruge dem — to spor er allerede snublet over det.
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

## Modelfordeling — hvem tænker, og hvem bygger

Fast regel, sat af JPK 24. aug 2026. Gælder alt arbejde i dette projekt.

**Orkestratoren kører Opus eller Fable og implementerer aldrig selv.** Den analyserer,
planlægger, griller og fletter. Selve bygningen sendes ud som subagenter med
`model: "sonnet"` **skrevet eksplicit i `Agent`-kaldet**.

Glemmes `model`-parameteren, arver subagenten sessionens aktuelle model. Det er ikke en
teoretisk risiko: 24. aug 2026 blev to spor (kortdesign og fotos) startet fra en
Fable-session uden parameteren, kørte rugbrødsarbejde på den dyre model og døde begge af
et session-limit midt i arbejdet. Begge måtte genstartes fra bunden.

**Grænsen, så reglen ikke lammer sessionen.** Orkestratoren må:

- **læse** kode og data — man kan ikke planlægge det, man ikke har set
- **måle og efterprøve** en agents resultat: `validate.mjs`, `build.mjs`, `tests/koer.mjs`,
  `tools/linktjek.mjs`, Playwright-målinger
- **flette** grene, rydde worktrees, køre den lokale server
- skrive **proces**dokumenter: STATUS.md, CLAUDE.md, hukommelse

Den må **ikke** producere selve leverancen: kildekode, skabeloner, CSS eller robotdata.
Er en rettelse så lille, at et subagent-kald føles overdrevet, er den stadig
implementering — send den, eller saml den med næste spor.

**Den anden vej gælder lige så hårdt, indskærpet af JPK 25. aug 2026: reviews og
analyser er ALDRIG Sonnets.** En subagents selv-review er en ærlighedsrapport (usikkerheder,
udeladelser, tællinger) — ikke reviewet. Dommen fældes af orkestratoren (Fable/Opus), som
selv kører målingerne, læser diffen og ser leverancen med egne øjne, før der flettes.
Send aldrig et "review-spor" eller "analyse-spor" til en Sonnet-agent.

**Reviewets form, indskærpet af JPK 25. aug 2026: Sonnet er junior-udvikleren — præcision
i forklaringen er det, der forhindrer fejl og ekstra runder.** Når orkestratoren sender
rettelser eller et nyt brief til en Sonnet-agent, gælder:

1. **Peg præcist:** fil og linje (`fil:linje`), og citér det, der står der nu.
2. **Sig det ønskede resultat konkret** — hvad der skal stå, eller hvilket tal en kørsel
   skal vise bagefter. Aldrig "stram op", "gør det pænere" eller "fix X" uden et eksempel.
3. **Ét entydigt acceptkriterium pr. punkt:** "færdig, når \<kommando\> viser \<tal\>."
   Samme krav som grillmig stiller til indvendinger — uden acceptkriterium er en rettelse
   en stemning.
4. **Nummerér uafhængige punkter** i den rækkefølge, de skal udføres; bland aldrig to
   rettelser i én sætning.
5. **Én linje HVORFOR pr. punkt**, så reglen læres — men HVAD skal kunne stå alene.

En rettelse, junioren skal gætte sig til, koster en ekstra runde og en ny fejl. Det er
reviewerens ansvar, at det ikke sker — ikke juniorens.

---

## Den faste arbejdsgang — rollerne og konfidensniveauet

Fast regel, sat af JPK 25. aug 2026. Gælder **hver eneste opgave** fra nu af, uden undtagelse.

**Rollefordelingen er låst:**

| Hvem | Gør hvad |
|---|---|
| **Orkestratoren** (Opus/Fable) | Orkestrerer, reviewer, analyserer. Skriver aldrig selv leverancen |
| **Subagenter** (`model: "sonnet"`, skrevet eksplicit) | Alt rugbrødsarbejdet: kode, data, skabeloner, CSS, indsamling |

Orkestratorens fire faste skridt om hver opgave: **send sporet ud → læs rapporten → efterprøv
selv → flet og ryd op.** Ingen af dem kan springes over, og ingen af dem kan uddelegeres.

### 1. Rapporten skal være kort

Målt 25. aug 2026 på seks rapporter fra samme dag: **226 linjer i gennemsnit**, længste 337.
Det er en afhandling, ikke en rapport, og den bliver skimmet i stedet for læst — hvilket er
det modsatte af formålet.

**Højst 60 linjer.** Rapporten skal indeholde fire ting og ikke mere:

1. **Hvilken løsning blev valgt** — og hvilken blev fravalgt, i én linje hver.
2. **Konfidensniveau pr. punkt** (se skalaen nedenfor).
3. **Usikkerheder mødt undervejs** — det agenten ikke kunne afgøre.
4. **Målingerne** som tal, ikke som prosa: "validate 77/0", "tests 212/2", ikke "alt kører".

Alt andet — den fulde udredning, alle kørsler, alle overvejelser — hører i commit-beskederne,
hvor det står ved siden af den diff, det handler om.

**To sektioner ligger UDEN FOR de 60 linjer, og de er obligatoriske:**

- **"Nye fælder og opdagelser."** Loftet må ikke koste det, rapporterne er værd. Målt
  25. aug 2026: de lange rapporter bar netop opdagelserne — `InvalidKey` på ikke-ASCII
  objektnøgler, mappeposter med `id: null`, og den bevidste regex-duplikering, der blev til
  Å12. Under et hårdt loft dropper en agent det overraskende og beholder tjeklisten, for
  tjeklisten er det, den blev bedt om. Er der intet at skrive, skal der stå, at der intet er.
- **"Punkter i briefet, jeg ikke nåede."** Én linje pr. punkt, tom hvis ingen. Ærlighed skal
  være strukturel, ikke noget der gemmer sig i prosaen under selv-reviewet.

### 2. Konfidensniveauet skal have en metode, ikke en fornemmelse

Hård begrænsning 6 forbyder en redaktionel score uden offentliggjort metode. **Den regel
gælder også agenternes egne tal om sig selv.** Konfidens bindes derfor til bevistype, ikke til
hvor sikker agenten føler sig:

| Niveau | Betyder præcist |
|---|---|
| **Høj** | Målt med en kommando, tallet står i rapporten, og **orkestratoren kan genkøre den og få samme tal** |
| **Middel** | Efterprøvet indirekte — enhedstest, strukturkontrol, delvis stikprøve — men ikke målt i den endelige form, brugeren møder |
| **Lav** | Ikke efterprøvet: antaget, udledt, eller blokeret af noget agenten ikke kunne komme udenom |

**Høj uden en genkørbar kommando nedskrives automatisk til lav.** Det er den eneste måde at
forhindre, at niveauet inflaterer til "høj" på alting.

**Og høj kræver to ting, ikke ét: kommandoen plus én linje om, hvad tallet ville have været,
hvis arbejdet var forkert.** Genkørbarhed beviser reproducerbarhed, ikke relevans. Målt
25. aug 2026: et spors worktree manglede de gitignorerede fabrikantbilleder, så
`validate.mjs` gav **54 fejl** — kommandoen kørte, tallet var reproducerbart, og det målte
agentens *miljø* frem for dens arbejde. Kan agenten ikke skrive den kontrafaktiske linje, er
niveauet middel.

### 3. Orkestratoren efterprøver *efter* konfidens

Reviewet er ikke en gennemlæsning. Det er en måling, og konfidensniveauet bestemmer, hvor den
lægges:

- **Lav konfidens efterprøves først og hårdest.** Det er dér, fejlene bor.
- **Middel** efterprøves i den endelige form — kør det, brugeren ville møde.
- **Høj** stikprøves ved at genkøre agentens egen kommando. Giver den et andet tal, er hele
  rapporten mistænkt, ikke kun det punkt.

Efterprøvningen skrives ind i fletbeskeden med tal, så næste læser kan se, hvad der blev målt
af orkestratoren selv, og hvad der kun står i agentens rapport. **Er noget ikke efterprøvet,
skal det stå.**

**Efterprøvningen har tre udfald — ikke ét.** En arbejdsgang, der ender på "flet", trækker mod
at flette; det er formfejlen, dette punkt lukker:

1. **Flet.** Målingerne holder.
2. **Flet efter rettelse.** Send de præcise punkter tilbage til samme agent (fil, linje, citat,
   acceptkriterium) og efterprøv igen.
3. **Afvis.** Løsningens *retning* er forkert, ikke bare dens udførelse. Commit da agentens
   arbejde på grenen som **mellemtilstand** med en besked, der siger hvad der er rigtigt ved
   den, og hvad der ikke er — og send en efterfølger, der får den commit som læsestof.
   **Worktreen ryddes ikke ved afvis.**

Det tredje udfald skete 25. aug 2026: prosa-sporets analyse var rigtig, men dens løsning
(YAML-kommentarer) ville være slettet tavst ved næste regenerering fra databasen. Havde
arbejdsgangen kun haft udfald 1, var den fejl flettet ind.

### 4. Orkestratoren fletter og rydder op

`git merge --no-ff` med en fletbesked, der bærer efterprøvningens tal — derefter
`git worktree remove`, og `additionalDirectories` i `.claude/settings.json` nulstilles.
En efterladt worktree bliver til en gren, ingen tør slette, fordi ingen længere ved, om der lå
noget i den.

**Et spor er ikke færdigt, før worktreen er væk.**

**En worktree, der bevidst sættes på pause, skal skrives ind i STATUS.md** — med gren, sti og
hvad der ligger i den. Ellers bliver den til en mappe, ingen tør slette, fordi ingen længere
ved, om der var noget værd at redde. Målt 25. aug 2026: `spor/retning-atlas` og
`spor/retning-moerk` har ligget siden designrunden og er nævnt **nul** gange i STATUS.md.

---

## Hvornår der IKKE sendes et spor

*"Subagenter laver alt rugbrødsarbejdet"* betyder **ændringer**, ikke opslag. Følgende er
orkestratorens eget arbejde, og et spor til dem er spildt tid og en ekstra runde:

- **Målinger og opslag** — "hvor mange robotter mangler IP-klasse?" er én forespørgsel.
- **Reviews, kritik og analyser.** Aldrig en Sonnets, jf. reglen ovenfor.
- **Procesdokumenter** — STATUS.md, CLAUDE.md, skills, hukommelse, kritikdokumenter.
- **Flet, oprydning og servere.**

## Briefet — to regler, der kostede en runde hver

**1. Første kommando i ethvert spor er en grundmåling, og den skal stå i rapporten.**
Uden den kan agenten ikke svare på "var det mig, der ødelagde det?". Målt 25. aug 2026: to
spor mødte 54 valideringsfejl, som stammede fra manglende gitignorerede billeder — det ene
spor havde taget grundmålingen først og kunne bevise, at fejlene var der i forvejen; det
andet brugte en runde på at finde ud af det.

**2. Et tal i et brief er enten et krav eller et gæt — og det skal fremgå hvilket.**
Skriv aldrig et hårdkodet forventet tal som acceptkriterium, når det kan udledes. `"213 sider"`
bliver forkert, så snart kataloget vokser; `"samme sidetal som før dit spor, plus 2 pr. nyt
sprog"` bliver ikke. Bærer briefet alligevel et forventet tal, skal det mærkes som
**forudsigelse** — agenten skal måle og skrive det faktiske, ikke ramme mit gæt. Målt samme
dag: mit `"177 sider"` blev til 175, og mit `"stort set alle 77"` blev til 33 af 77. Begge
agenter gjorde det rigtige og skrev det målte tal; en mindre samvittighedsfuld agent ville
have rettet mod tallet. Det er D7/L30-fælden i ny forklædning: et håndskrevet tal ved siden
af et udledt.

---

## Mappestruktur

```
data/robots/          én YAML pr. robot — én robot = én commit, git-diffbar.
                      Kan siden L35 også regenereres fra Supabase med
                      `db/eksporter.mjs --fra-db` (JPK's Studio-vej) — men
                      validate/build/tests kører altid paa YAML'en, aldrig
                      direkte paa databasen
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
fund/                 agentrapporter: hvad blev undersøgt, efterprøvet, bygget. Arkiv —
                      besluttet politik står i STATUS.md, ikke her
```

**`dist/` bygges kun fra `assets/`.** `media/` indgår aldrig i bygget — det er den
strukturelle håndhævelse af, at fabrikanternes materiale ikke kan slippe ud ved et uheld.

`media/_kilder/` er gitignoreret bortset fra sin LÆSMIG.md: materialet er bevis for hvad
en producentside sagde den dag, vi hentede et tal, men det er fabrikantens ophavsret og
skal ikke distribueres med repoet.

---

## Projektskills — brug dem frem for at gentage reglerne

Ud over de globale skills i tabellen ovenfor har projektet tre egne i `.claude/skills/`:

| Skill | Hvornår |
|---|---|
| `robotdata` | Hver gang en robotpost tilføjes, opdateres eller efterprøves. Bærer 29-feltsskemaet, de ti hårde regler og selv-tjekket med tælling |
| `parallelt` | Hver gang arbejde deles på flere agenter. Bærer worktree-opsætningen, prompt-tjeklisten og de to fælder |
| `grillmig` | **Før** et agentbrief sendes, og før en åben beslutning låses. Bærer de fem briefspørgsmål, de fire beslutningsspørgsmål og retten til at sige stop. Ikke en designkritik — den dømmer hensigten, ikke resultatet |
| `supabase` | Alt arbejde mod Supabase-projektet (L34): MCP, fejlfinding, HTTP-/RLS-overraskelser. Officiel Supabase-skill, installeret 25. aug 2026 |
| `supabase-postgres-best-practices` | **Før** enhver ændring i db/skema.sql, RLS-politikker, indeks eller migreringer — også en-kolonnes-ændringer. Officiel Supabase-skill |

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
npm     ligger samme sted som node, men er heller ikke på PATH i Git Bash.
        Kør den som  PATH="/c/Program Files/nodejs:$PATH" npm ...
```

**Browsermåling — `C:\Praktik\websites\maalevaerktoej\`** (sat op 26. aug 2026).
Playwright ligger **bevidst uden for repoet**, så løftet om en afhængighedsfri
generator står urørt. Intet derfra indgår nogensinde i et byg.

```
node C:/Praktik/websites/maalevaerktoej/maal.mjs <url> [bredde]
```

Den skriver JSON med kortantal, højdespring inden for en række, spildt lodret
plads, beskårne billeder, vandret overløb og sidehøjde — tal, der kan citeres
direkte i et fund uden mellemregning. Serveren skal køre:
`python -m http.server 8080 --directory dist` **fra projektroden**, aldrig
`cd dist` (så låser serveren mappen, og næste byg fejler med EPERM).

**Fælden, værktøjet selv faldt i første gang det blev brugt:** det målte
beskæring mod `<img>`-elementets egen kasse og gav **0** — mens filmålingen gav
**16**. `<img>` fylder ikke nødvendigvis sit `<picture>`, så billedets kasse
følger dets naturlige forhold; beskæringen sker, fordi *rammen* klipper. Rettet
til at måle mod `.billedled`. **Lærdommen er større end fejlen: et nyt
måleapparat skal valideres mod et kendt svar, før dets tal bruges i et fund.**

Tre fælder, der kostede kald samme dag ([ARBEJDSGANG.md](ARBEJDSGANG.md)):

- **`head` i Bash tæller ikke som en læsning for Edit-værktøjet.** Kun Read-værktøjet gør.
- **`sed -i`, der ikke matcher, gør intet — tavst og med exit 0.** Efterprøv altid med et
  `grep` bagefter, eller brug Edit-værktøjet, som fejler synligt.
- **Lange markdown-filer knækker i bash-heredocs.** Brug Write-værktøjet.
- **node og Git Bash er ikke enige om, hvor `/tmp` ligger.** Brug en sti i projektet.
- **`split()` på et sektions-id rammer det tomme mellemstykke.** Skabelonerne skriver hvert
  sektions-id **to gange** — én gang i `aria-labelledby` og én gang i `id` — så
  `html.split('h-udvalg')[1]` giver strengen *mellem de to forekomster*, ikke sektionen.
  Den fejl ramte to acceptkriterier 26. aug 2026 og fik begge til at printe 0, uanset om
  arbejdet var rigtigt. Brug `indexOf` på klassenavnet og skær frem til næste sektion.
