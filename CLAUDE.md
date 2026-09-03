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
med 1.111 kildebelagte tal, 216 byggede sider på to sprog (målt 3. sep 2026 —
her stod 1.110 og 213, og de tal er præcis den fælde, denne fils egen regel om
hårdkodede tal advarer imod nedenfor), en Supabase-database som
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

**Skills kommer fra to steder.** `ls ~/.claude/skills/` viser **kun de lokale**;
plugin-skills ligger et andet sted og er flere. **Projektets
`.claude/settings.json` lægger TIL brugerens, den erstatter den ikke.** Vil du
vide, hvad der faktisk kan kaldes, så mål det:

```
node -e "console.log(Object.keys(JSON.parse(require('fs').readFileSync('C:/Users/thyge/.claude/plugins/installed_plugins.json','utf8')).plugins))"
```

**Et plugin i marketplace-mappen er ikke installeret** — kun det, der står i
`enabledPlugins`, kan kaldes. Tabellen nedenfor er læst fra disken og viser det,
der faktisk virker; `critique` står som ude af drift, fordi dens afhængigheder
ikke findes. Historikken bag den oprydning er i Å148.

### L70: impeccables flows ER metoden for designarbejde

**Besluttet af JPK 1. sep 2026, ordret: *"fremover anvender vi impeccables plugin
og flows."*** Gælder alt designarbejde fra nu af.

Begrundelsen, købt for tre kritikrunder: **en fejlliste kan kun bringe siden
tilbage til sit eget tilsigtede udseende — den kan aldrig hæve loftet.**

**Konsekvensen i praksis:** står du med mere end én rettelse på samme flade, så
kør `impeccable shape` på fladen i stedet for at sende rettelserne enkeltvis.
En enkeltstående, isoleret fejl må stadig rettes direkte — SELECTED-baren, der
viste en standardtilstand som et brugervalg, var en sådan.

**DESIGNFRYS, skærpet af JPK 1. sep 2026: *"vi skal have en overordnet
designplan, inden vi retter noget design."*** Fund noteres, de rettes ikke.
Frysen gælder, indtil den overordnede plan findes.

Fælden, frysen lukker, er at et designfund kan **ligne** en almindelig fejl.
Eksemplet: afmærkningsgul som tekstfarve giver **1,38:1** mod WCAG's 4,5. Det
ser ud som en fejl, der bare skal rettes — men paletten er låst af TYPESKILT,
så rettelsen må være en systemregel om, hvor `--accent` må bruges som forgrund.
Den regel hører i planen, ikke i et hastespor.

Rodårsagen kan gentage sig for ethvert token: palettens kommentar sagde `9,19`,
og det tal var rigtigt for gunmetal **på** gult. Tokenet blev målt som
**baggrund** og bruges som **forgrund**. **Et kontrasttal uden en læseretning
er ikke et tal.**

**Undtaget frysen:** rene funktionsfejl (en knap, der ikke virker), brudte
hårde begrænsninger, og fejl hvor rettelsen ikke rører en systembeslutning.
Er du i tvivl, om noget er en designrettelse: det er det.

**Navngiv fladens MODE, hver gang.** Det er skillens egen ramme, og projektet
brugte den ikke før nu: katalogsiden er **Operate** (den besøgende løser en
opgave), robotsiden og Om os er **Read** (den besøgende skal forstå noget). To
succeskriterier — og de blev behandlet ens i alt arbejde før 1. sep.

**Skillen respekterer selv vores låse**, så den kan bruges uden værn mod den:
*"The brief wins. Honor pinned aesthetics, eras, materials, fonts, and
palettes."* TYPESKILT står uændret som gældende retning.

**Tabellen nedenfor er læst fra `SKILL.md` på disken, ikke fra hukommelsen** —
den har været forkert før, og det kostede en `Unknown skill` og et spor uden
skill.

| Skill | Hvornår |
|---|---|
| `impeccable` | **Den vigtigste, og den mest oversete.** Én skill med 20+ underkommandoer. Se rækkerne nedenfor |
| `impeccable layout` | Afstande, rytme og visuelt hierarki. Det, en "for meget polstring"-klage i virkeligheden beder om |
| `impeccable typeset` | Typografisk hierarki. Målt 1. sep: **55 forskellige skriftstørrelser** i stilarkene, 18 trin alene i spændet 9–20 px |
| `impeccable distill` | Skær ind til essensen, fjern kompleksitet |
| `impeccable new-work` | Når en flade skal have en **retning**, ikke en rettelse. Bygger konkurrerende visuelle verdener, man kan se ved siden af hinanden |
| `impeccable shape` | Planlæg UX/UI, før der skrives kode |
| `impeccable critique` | Design-vurdering med heuristisk scoring: **virker designet**, ikke er det fejlfrit |
| `impeccable audit` | Teknisk kvalitet: tilgængelighed, ydelse, responsivitet |
| `impeccable layout` · `typeset` · `colorize` · `bolder` · `quieter` | Målrettede løft af ét lag ad gangen |
| `impeccable polish` · `harden` · `adapt` · `clarify` | Sidste kvalitetspas, produktionsklarhed, skærmstørrelser, UX-tekst |
| `impeccable live` | Vælg elementer i browseren og få genereret alternativer |
| `ui-ux-critique` | **Fejljagt** på en bygget side: hierarki, tilgængelighed, mobil, AI-prosa. Bemærk forskellen til `impeccable critique` — se advarslen nedenfor |
| `frontend-design` | **Anthropics officielle skill til visuelt design af ny eller omformet UI.** Slået til 26. aug 2026. Bærer to ting, `impeccable` ikke fremhæver lige så skarpt: kalibreringen mod de tre AI-standardudseender, og to-trins-processen hvor designplanen kritiseres for at være generisk, **før** der skrives kode. Brug den ved enhver ny flade |
| `taste-skill:*` | **13 underskills mod "generisk AI-frontend".** Installeret 21. aug 2026, aktiv. **Læs grænsen nedenfor, før nogen af dem kaldes** — tre af dens afsnit bryder projektets hårde begrænsninger, hvis de følges bogstaveligt |
| `critique` | **Ude af drift.** Kræver også `teach-impeccable`, som ikke findes. Brug `impeccable critique` |

**Målt 27. aug 2026: 15 plugins installeret, alle 15 aktive her, 39 mapper på
disken.** De 24, der kun ligger der, kan **ikke** kaldes. Genmål med:

```
node -e "const fs=require('fs');
const inst=new Set(Object.keys(JSON.parse(fs.readFileSync('C:/Users/thyge/.claude/plugins/installed_plugins.json','utf8')).plugins).map(k=>k.split('@')[0]));
const rod='C:/Users/thyge/.claude/plugins/marketplaces/claude-plugins-official/plugins';
const d=fs.readdirSync(rod).filter(f=>fs.statSync(rod+'/'+f).isDirectory());
console.log('paa disk',d.length,'installeret',d.filter(p=>inst.has(p)).length);
console.log('ikke installeret:',d.filter(p=>!inst.has(p)).join(', '));"
```

**Er en skill ikke slået til, kan dens `SKILL.md` stadig læses fra disk** — skriv
da i rapporten, at det blev gjort. Fire spor blev engang sendt uden
`frontend-design`, fordi den lå på disken men ikke i `enabledPlugins`.

### En skill udefra bærer sit eget projekts antagelser

**Læs en ny skills faktiske tekst for konflikter med de hårde begrænsninger,
før den skrives ind i tabellen** — ikke kun dens beskrivelse. `taste-skill` er
eksemplet: fire af dens afsnit anbefaler at digte tal, firmanavne og billeder,
og den afgrænser selv datatabeller væk. Den bruges derfor ikke her. Se Å148.

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

## To sessioner i samme repo — protokollen

Sat 2. sep 2026 efter en dag med to orkestratorsessioner, 17 flet og 0
kollisioner efter at reglerne var aftalt. Indtil da fandtes de kun i STATUS.md
(Å124, Å131) og i beskeder — en komprimeret session kendte dem ikke.

**Grundvilkåret, målt:** worktrees deler ét arbejdstræ og ét ref-lager
(`git rev-parse --git-common-dir` er ens fra alle). Konsekvenserne:

1. **`git add <fil>` tager den andens ucommitterede linjer med.** Kør
   `git diff <fil>` før `git add`, og giv en STATUS-række sit nummer og dens
   commit i samme tur. **Et nummer reserveres ved at pushe rækken, ikke ved at
   melde det** — to sessioner tog begge det rigtige forbehold og kolliderede
   alligevel på Å138, fordi vinduet mellem måling og commit er reelt.

   **Og reglen gælder PR. FIL, ikke pr. kommando.** Tilføjet 3. sep 2026,
   samme dag som punktet blev skrevet, fordi det blev brudt i selve den commit,
   der indførte det: `41836eb` lagde fem filer til i ét `git add`, diffen blev
   målt på **én** af dem, og syv linjer, den anden session havde skrevet i
   `CLAUDE.md`, red med uden attribution. Indholdet var rigtigt, så intet
   gik tabt — og derfor var der heller intet at opdage. **Et delvist udført
   tjek ligner et udført tjek.** Mål diffen på hver fil, du lægger til, og
   **spørg, før du committer en fil, den anden session har rørt for nylig.**
2. **To samtidige `tests/koer.mjs` crasher** (delt `tests/.tmp-koersel`, hver sit
   HEAD). Meld via `SendMessage`, før du kører på main; vent på *"main er din"*;
   meld *"færdig"*. Se `flet`-skillens punkt 4.
3. **"Main er i takt med origin" er en fælles tilstand.** Den kan skifte mellem
   to af dine egne kommandoer. Mål main umiddelbart før hvert flet.
4. **Meld filejerskab, når et spor sendes:** hvilke filer, hvilke testnumre.
   Overlap måles, ikke antages. Meld, hvis et spor begynder at skrive i
   databasen — den er også delt.
5. **Tag aldrig den andens tal for gode varer.** Efterprøv med egen måling, og
   sig til, når den afviger. Det er sådan, 10 forkerte forudsigelser blev fundet
   på én dag, uden at én nåede en beslutning.
6. **Meld KOMMANDOEN, ikke hensigten — og meld både når du tager main og når du
   slipper den.** To halvdele, begge betalt 3. sep 2026 inden for ti minutter.

   **Den ene:** *"jeg tager main"* har ingen udløbstid, og en **baggrundskørsel
   er usynlig for den anden session.** Peer flyttede `tests/koer.mjs` til
   baggrunden, da den timede ud i forgrunden, og gik derefter i tomgang.
   **Tomgangssignalet er en harness-besked om, at en tur sluttede — det er ikke
   en frigivelse af main**, og det blev læst som en.

   **Den anden:** jeg meldte *"jeg efterprøver dine tre tal"* uden at skrive
   hvilke kommandoer. Havde der stået *"jeg kører validate, build og
   koer.mjs"*, kunne peer have stoppet bygget med det samme. **En hensigt kan
   ikke modsiges; en kommando kan.**

   Prisen blev betalt to gange i samme minut. Min `koer.mjs` døde på punkt 2's
   ENOTEMPTY mod den delte `tests/.tmp-koersel` — den billige halvdel, fordi den
   larmede. **Den dyre var mit `build.mjs`, som skrev i `dist/`, mens peers
   testkørsel læste derfra;** 13 tests spørger, om en side ER bygget. Kørslen gav
   grønt med præcis det forventede tal, og peer kasserede den alligevel og kørte
   om: *"et tal fra et forstyrret apparat er ikke et tal, uanset at det ser
   rigtigt ud."* Genkørslen gav samme 1658/0, så bygget skjulte intet — **men det
   er nu målt frem for skønnet, og det var hele pointen.**

   **Læg mærke til, hvilken vej risikoen gik** (peers formulering): et byg midt i
   en læsning giver typisk RØDE tests, ikke en falsk grøn, så sandsynligheden for
   skjult skade var lav. Men *lav* var et skøn, ikke en måling — samme skelnen,
   som punkt 5 stiller til den andens tal.

   Formen, der lukker begge halvdele:

   ```
   "Jeg tager main. KOMMANDOEN: node tests/koer.mjs, i baggrunden. Intet andet."
   ... senere ...
   "Færdig med main. Suiten grøn, 1658/0. Pushet som <hash>. Main er din."
   ```

   **Og *"jeg rører ikke main"* dækker ARBEJDSTRÆET, ikke kun git-kommandoer.**
   Tilføjet samme dag, foreslået af den session, der næsten betalte for det: jeg
   meldte ærligt, at jeg ikke kørte git mod main, og det passede — men jeg havde
   redigeret en fil i det delte træ og ladet den ligge ucommitteret, mens peer
   flettede. **Kun det, at peer ikke brugte `git add -A`, holdt min halvfærdige
   omskrivning ude af deres flet.** En ucommitteret redigering er lige så farlig
   for den, der committer, som en git-kommando er for den, der måler. Rører du
   en fil i det delte træ, så commit den, før du slipper main.

Find den anden session med `ListAgents`; svar på dens adresse fra `from=`.

## Modelfordeling — hvem tænker, og hvem bygger

Fast regel, sat af JPK 24. aug 2026. Gælder alt arbejde i dette projekt.

**Orkestratoren kører Opus eller Fable og implementerer aldrig selv.** Den analyserer,
planlægger, griller og fletter. Selve bygningen sendes ud som subagenter — og modellen
**skrives ALTID eksplicit i `Agent`-kaldet**, aldrig arvet:

- **`model: "sonnet"`** til rugbrødsarbejde: data, tests, mekaniske rettelser,
  omstruktureringer med et målbart facit.
- **`model: "opus"` til designspor** — besluttet af JPK 27. aug 2026 (L45), en ændring
  af den oprindelige regel. Begrundelsen: rykket pr. rotation på designarbejdet var for
  lille; Sonnet leverede det mindste sikre inden for briefets værn. Et designspor er ét,
  hvor leverancen dømmes med øjne (typografi, layout, en ny flade) — ikke ét, der
  tilfældigvis rører CSS.

Glemmes `model`-parameteren, arver subagenten sessionens aktuelle model. Det er ikke en
teoretisk risiko: 24. aug 2026 blev to spor (kortdesign og fotos) startet fra en
Fable-session uden parameteren, kørte rugbrødsarbejde på den dyre model og døde begge af
et session-limit midt i arbejdet. Begge måtte genstartes fra bunden. **Det værn, der
gør Opus-designspor forsvarlige i dag, er commit undervejs-kravet** (brief-skillens
punkt 8): et spor, der dør, efterlader nu sine commits — målt 27. aug, hvor et stallet
spor blev genoptaget uden tab, fordi 3 commits og en arbejdsfil lå der.

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

### 1.–2. Rapportform og konfidensskala: se `spor`-skillen

**Begge stod her i fuld længde indtil 3. sep 2026 og står nu i
`.claude/skills/spor/SKILL.md`**, som sporet kalder som sin første handling.
Reglen om ikke at skrive skills af i hånden gælder også denne fil.

Det, orkestratoren skal kunne uden at slå op: rapporten er **højst 60 linjer**
plus to obligatoriske sektioner uden for loftet (*"Nye fælder og opdagelser"*
og *"Punkter i briefet, jeg ikke nåede"*). Konfidens er bundet til **bevistype,
ikke fornemmelse** — **høj** kræver en genkørbar kommando **plus** en
kontrafaktisk linje, ellers er den middel. Uden det krav inflaterer alt til høj.

### 2b. Det, JPK læser i samtalen, er ÆNDRINGEN — ikke målemetoden

**Fast regel, sat af JPK 3. sep 2026, ordret: *"I selve briefs og rapporter når
de bliver skrevet ud i samtalen: gør MERE KLART OG TYDELIGT hvilke ændringer
der foretages. Altså UI, f.eks. justering af FELT, tilføjelse af given
parametre… lige nu er det svært at følge med."***

Skriver orkestratoren et brief eller en rapport ud i samtalen, skal **det
første, JPK møder, være en før-og-efter-oversigt i konkrete UI-termer** — hvad
et felt hedder på skærmen, hvor mange px noget flytter sig, hvor mange valg en
facet får, hvilket tal der står i et hjørne. Helst som tabel.

Begrundelsen: rapporterne havde metoden i orden — konfidensniveauer,
kontrollinjer, grep-fælder, kommandoen foran hvert tal — men alt det besvarer
*"hvor sikre er vi?"*. JPK skal kunne godkende eller afvise **uden at læse en
måleprotokol**, og det kræver svar på *"hvad ser jeg på skærmen bagefter?"*

**Metoden afskaffes ikke, den flyttes ned.** Kommandoen foran hvert tal er
stadig ufravigelig i **fletbeskeden** (`flet`-skillens punkt 3) og i
`fund/`-rapporten; det er rækkefølgen i samtalen, reglen ændrer. Ændringen
først, kort og konkret — måling, konfidens og forbehold bagefter.

Samme mønster som L-reglen om popups: dommen og prisen før menukortet, ikke
efter.

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
data/manufacturers/   TOM (målt 3. sep 2026, 0 filer). Producentdata bor i
                      databasen; mappen er en rest og kan slettes
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

Ud over de globale skills i tabellen ovenfor har projektet tolv egne i `.claude/skills/`
(otte indtil 2. sep 2026; `retro`, `spor`, `overlevering` og `design` kom til 3. sep):

| Skill | Hvornår |
|---|---|
| `design` | **HVER gang noget visuelt skal bygges, bedømmes eller planlægges** — en flade, en CSS-rettelse, en farve, en skriftgrad, en komponent, en datatilstand — og hver gang et brief til et designspor skrives. Den er et **navigationskort til [DESIGN.md](DESIGN.md)**, ikke et resumé: den siger, hvilket af filens 32 afsnit der svarer på hvilket spørgsmål, så et spor læser 40 linjer i stedet for 834. Bærer desuden de fire regler, der gælder ved alt designarbejde: designfrysen (L70), palettelåsen, MODE-navngivningen og de fire datatilstande. **Bygget 3. sep 2026 på JPK's ord** *"DESIGN.md beskriver hvordan websiden skal være designet, for at sikre konsistens og standardisering"* — og som svar på hans spørgsmål, om DESIGN.md skulle destilleres for at spare tokens. **Svaret var nej, og målingen står i skillen:** DESIGN.md er 42 KB ≈ 12,5k tokens mod STATUS.md's 416 KB ≈ 126k, så den er ~3 % af et opus-spors budget og ikke der, tokenerne går. Et destillat ville desuden være kopi nummer to af designsystemet — samme fælde som *"tre håndskrevne kopier divergerer ved den fjerde"*, ét lag længere ude |
| `robotdata` | Hver gang en robotpost tilføjes, opdateres eller efterprøves. Bærer 33-feltsskemaet (målt mod `FELTNAVNE.length` 3. sep 2026 — her stod 29, skillen sagde 30), de ti hårde regler og selv-tjekket med tælling |
| `spor` | **Sporets egen skill — kaldes af SUBAGENTEN som første handling, ikke af orkestratoren.** Bærer metoden, der før blev kopieret ind i hvert brief: grundmåling, kontrollinje, skrive-grænse, filejerskab, selv-efterprøvning med tælling, rapportform og konfidensskala, plus `references/miljoefaelder.md`. Bygget 3. sep 2026, da SKILLEVAL målte, at 20 af 21 briefs i `fund/` bar de samme otte regelblokke |
| `overlevering` | Når en session skal lukkes og en frisk startes: sessionsvagten siger til, JPK spørger om han skal starte forfra, eller det bliver tredje komprimering på samme opgave. **Reglen er PEG, kopiér ikke** — en overlevering, der kopierer tilstanden ind, er en komprimering med et andet navn og betales i den nye session på hvert kald. Bygget 3. sep 2026 på målingen: 98,5 % af input er cache-læsninger, 237k kontekst pr. kald, 58 kald pr. besked, og cachen lever én time |
| `parallelt` | Hver gang arbejde deles på flere agenter. Bærer worktree-opsætningen, det opgavespecifikke i prompten og diskprisen pr. spor. Metoden peger på `spor`, flettet på `flet` |
| `grillmig` | **UDE AF DET OBLIGATORISKE WORKFLOW pr. 28. aug 2026, JPK's beslutning.** Må stadig kaldes bevidst på et **agentbrief** med et målbart facit — aldrig automatisk, og **aldrig på en designretning**, hvor den skærer for mange idéer. **Det, der SKAL overleve uden den:** slå altid efter i STATUS.md's **Lukket**-tabel og i *"Kom ikke igen med disse"*, før noget bygges — og afkort aldrig den søgning med `head`. Begrundelsen i Å148, modbeviset i Å55 |
| `brief` | **Bygger briefets krop** (kaldes nu direkte, uden et grillmig-trin før): kørte acceptkriterier, komplet filejerskab, mærkede tal, rapportform, miljøfælder, pladsholder-scanning. Bygget 27. aug 2026 af ARBEJDSGANG.md O3's fire defekter |
| `fejljagt` | HVER gang noget opfører sig uventet — rød test, måletal der ikke passer, kriterium der giver 0 uanset input. Efterprøv måleapparatet før tallet; mekanismesætning før rettelse; revert-bevis efter. Bygget 27. aug 2026 af ugens tre målefejl |
| `flet` | HVER gang et spor flettes, en worktree fjernes eller en gren lukkes. Bærer de to regler, der manglede: tests på det FLETTEDE resultat, og `--force` kræver en måling først. Bygget 27. aug 2026 efter superpowers-analysen (`fund/FUND-superpowers.md`) |
| `supabase` | Alt arbejde mod Supabase-projektet (L34): MCP, fejlfinding, HTTP-/RLS-overraskelser. Officiel Supabase-skill, installeret 25. aug 2026 |
| `supabase-postgres-best-practices` | **Før** enhver ændring i db/skema.sql, RLS-politikker, indeks eller migreringer — også en-kolonnes-ændringer. Officiel Supabase-skill |

**Skriv aldrig reglerne af i hånden ind i en agentprompt.** Peg på skillen. Tre håndskrevne
kopier af samme regel divergerer ved den fjerde, og så arbejder agent fire efter en regel,
ingen har besluttet at ændre.

**Skills registreres ved sessionsstart.** Er en skill oprettet eller ændret i den kørende
session, giver den `Unknown skill`. Læs da `SKILL.md` fra disk og følg den derfra — og
**skriv i rapporten at du gjorde det**, så et stille fallback ikke forveksles med at
skillen kørte.

**Målt 26. aug 2026: kaldet til en bruger- eller plugin-skill fra en worktree lykkes
nogle gange og fejler andre gange — og vi ved ikke hvorfor.** Tre datapunkter samme dag:
orkestratoren kaldte `impeccable` fra hovedrepoet — **virkede**. `spor/instrument` kaldte
den fra sin worktree — **fejlede**, og faldt korrekt tilbage til disken.
`spor/indgang` kaldte den fra *sin* worktree — **virkede**.

*(Første udgave af denne regel sagde "en agent i en worktree kan ikke kalde skills". Det
var generaliseret fra ét datapunkt og blev modbevist en time senere af det næste spor.
Det er præcis fejl O5 i `ARBEJDSGANG.md`, begået i selve reglen om at måle.)*

Projektets egne otte skills ligger i `.claude/skills/`, er versionerede og følger derfor
altid med worktreen. Bruger- og plugin-skills gør ikke.

**Konsekvens for ethvert brief til et worktree-spor: giv diskstien med fra starten som
en udtrykkelig reserve** — *"kald skillen; lykkes det ikke, så læs denne fil"*. Det
koster ingenting, når kaldet virker, og sparer en omvej, når det ikke gør. Stierne:

```
C:/Users/thyge/.claude/skills/impeccable/SKILL.md
C:/Users/thyge/.claude/plugins/marketplaces/claude-plugins-official/plugins/frontend-design/skills/frontend-design/SKILL.md
```

Kravet om at **skrive i rapporten, at den blev læst fra disk**, gælder uændret.

### En skill kan være installeret og alligevel være helt forkert her

**Passer en skill åbenlyst ikke til projektet, så mål det med én kommando og
skriv målingen — før den afvises eller følges.** Målt 3. sep 2026: `/android-
skills:android-retrofit` blev affyret mod denne afhængighedsfri Node-generator.
Skillen er ægte og installeret (1 af de 15), så kaldet lykkedes, og dens
indhold — Kotlin, Hilt, OkHttp-interceptorer — så autoritativt ud.

Kontrollen tog ét kald: **0** `.kt`/`.java`/`.gradle`-filer, **0**
`AndroidManifest.xml`, **0** forekomster af retrofit/okhttp, mod kontroltallet
**21** filer i `tools/` med ordet "robot". Ufarligt, fordi målingen kom før
handlingen — men et Android-brief sendt videre til en Sonnet ville have kostet
et helt spor, og agenten ville have haft en installeret skill som belæg.

Det er den generelle form: **"en skill er tilgængelig" er ikke det samme som
"en skill hører til her"** — samme skelnen som mellem et plugin på disken og et
plugin i `enabledPlugins`, bare et lag længere ude.

## Enhver måling, der bærer en konklusion, skal have en kontrol

**Sat 1. sep 2026 efter en dag med ni fletbeskeder, der hver især måtte
optegne en fejl, orkestratoren selv havde lavet.** Alle ni havde samme form:
en konklusion draget på et `grep`, en sti eller en kommando, som ingen havde
efterprøvet.

**Reglen er én linje: skriv, hvad tallet skal være, hvis alt er som forventet
— FØR du læser det.**

```
echo -n "kort--seneste (forventer 9): "; grep -o 'kort--seneste' <fil> | wc -l
```

Koster ingenting. Fangede samme dag en forkert sti (`dist/da/katalog/` findes
ikke — siden ligger i `dist/da/robotter/`) og et forkert mønster
(`<td class="prod-navne">[^<]` gav 0 mod 25, fordi cellen begynder med `<a`).
Uden kontrollen ser begge ud som gyldige nul-resultater.

**Hvorfor `fejljagt` ikke dækker det:** den skill udløses, når noget ser
forkert ud. Men **et forkert grep giver typisk et fuldstændig plausibelt tal** —
0, eller 99, eller 504. Der er intet at undre sig over, så fejljagt fyrer
aldrig. Kontrollen er det eneste, der gør fejlen synlig i samme øjeblik.

**Fire konkrete fælder, alle målt samme dag:**

| Målingen | Hvad den i virkeligheden målte |
|---|---|
| `grep -c` på en **diff** | Hele filen, ikke ændringen. Uden `^[-+]` gav den 99 kontekstlinjer |
| Råt `grep -o '{'` i CSS | Også klammer i **kommentarer** — 504 mod motorens 493 |
| `grep -o 'padding:'` | Kun **shorthand**. Longhand vendte konklusionen på hovedet |
| `git -C` + `2>/dev/null` | Ingenting. Git fejlede på MSYS-stien, og fejlen var sendt i skraldespanden |

**Og det gælder mine egne noter lige så hårdt som mine kommandoer.** Denne
fils påstand om, at D15 og L40 var gældende, var forældet i to dage og nåede
syv briefs, fordi ingen kontrollerede den mod STATUS.md. **Et citat er et tal**
— se `brief`-skillens punkt 10.

## Værktøjer på denne maskine

Målt 19. aug 2026. Git Bash har **ingen** af dem på PATH:

```
node    /c/Program Files/nodejs/node.exe          (v24.13.0)
python  /c/Users/thyge/AppData/Local/Programs/Python/Python314/python.exe
jq      findes ikke — brug node til at læse JSON
npm     ligger samme sted som node, men er heller ikke på PATH i Git Bash.
        Kør den som  PATH="/c/Program Files/nodejs:$PATH" npm ...
```

**Node-fælde på denne maskine, målt 2. sep 2026 med kontrolgruppe: et ægte
`fetch()` efterfulgt af `process.exit()` crasher `node.exe` v24.13.0.** Libuv-
assertionen `!(handle->flags & UV_HANDLE_CLOSING)` (`src\win\async.c:76`), exit
**127** — også når kaldet lykkedes og svaret er læst. Fundet af `spor/f2-maal`,
reproduceret af orkestratoren:

```
ægte fetch + process.exit(0)       exit 127, assertion
ægte fetch + process.exitCode = 0  exit 0
ægte fetch, ingen eksplicit exit   exit 0
```

**Reglen, som kan følges uden at tænke:** har en fil lavet et netværkskald, så
kald aldrig `process.exit()` bagefter — sæt `process.exitCode` og lad løkken
tømme sig. `process.exit()` **før** det første `fetch` (argumentfejl, manglende
`.env`) er ufarligt.

**Men 127 har TO årsager, og kun den ene står ovenfor. Læs fejlteksten, ikke
kun koden.** Målt 2. sep 2026: en stikprøve gav exit **127** og lignede
libuv-assertionen præcis — det var bash' eget `node: command not found`, fordi
node ikke er på PATH i Git Bash (se værktøjsafsnittet). Den dokumenterede
årsag er her det **oplagte og forkerte** svar, netop fordi den er dokumenteret.
Libuv-varianten skriver `Assertion failed` og en sti i `src\win\async.c`;
bash-varianten skriver `command not found`. De ligner ikke hinanden i teksten
— kun i tallet.

Årsagen er timingen, ikke netværkskaldet: `process.exit()` river event-løkken
ned, mens en handle stadig lukker. Symptomet kan derfor komme efter **enhver**
async-kilde med åbne handles. Reglen er en bevidst over-approksimation.

**Browsermåling — `C:\Praktik\websites\maalevaerktoej\`** (sat op 26. aug 2026).
Playwright ligger **bevidst uden for repoet**, så løftet om en afhængighedsfri
generator står urørt. Intet derfra indgår nogensinde i et byg.

```
node C:/Praktik/websites/maalevaerktoej/maal.mjs <url> [bredde]        # tal
node C:/Praktik/websites/maalevaerktoej/flade-skud.mjs <url> <bredde> <udfil.png> [--kunFold]
```

`flade-skud.mjs` giver et **skærmbillede**, som kan læses med Read-værktøjet. Det
er vejen til at *se* en flade, ikke kun måle den — brugt af orkestratoren
28. aug 2026 til at se katalogsiden med egne øjne midt i en kritik.

**Den styrbare browser VIRKER** via projektets egen MCP-server i `.mcp.json`,
som starter `node.exe` direkte på måleværktøjets `@playwright/mcp/cli.js`.
Klik, hover, tastatur og script-injektion er `mcp__playwright__*`-værktøjer.
MCP-servere registreres ved sessionsstart: mangler værktøjerne, er sessionen
startet før rettelsen — genstart i stedet for at rapportere fallback.

**Pluginnets egen server (`plugin:playwright:playwright`) fejler STADIG med
`CONNECTION_CLOSED` ved hver sessionsstart — det er forventet støj, jag den
ikke.** Rodårsagen er målt: pluginnet starter `npx`, og `npx` uden endelse er
et bash-script, som Windows' CreateProcess ikke kan udføre. Pluginfilen kan
ikke rettes varigt (overskrives ved opdatering); projektserveren er
erstatningen.

**Fire løsninger er prøvet og modbevist — prøv dem ikke igen:** `npx` på PATH,
hente pakken først, `npx.cmd` (**EINVAL** under Node 24 uden `shell:true`), og
`cmd /c npx`. Derfor den valgte form: fulde stier, nul PATH-afhængigheder.

**Impeccables detektor (`detect.mjs`) kører STILLE DEGRADERET her, og den
degraderede kørsel er en falsk blank attest.** Fire parser-moduler mangler på
disken, og detektoren fejler da ikke — den *dæmpes*: **exit 0, tom liste, én
linje på stderr**. Målt mod en kontrolside med bevidst slop fandt den **2 af
13** fund og **nul** CSS-afhængige regler, kontrastmåling inklusive.
Løsningen er at installere de fire pakker i scratchpad og omdirigere dem med en
`module.registerHooks`-resolve-hook, så skill-mappen aldrig røres. **Valider
altid motoren mod et kendt svar, før dens tal bruges.** To forbehold: tallene
gælder **én** viewport, og den tæller noder, ikke årsager. Detaljerne i Å148.

Den skriver JSON med kortantal, højdespring inden for en række, spildt lodret
plads, beskårne billeder, vandret overløb og sidehøjde — tal, der kan citeres
direkte i et fund uden mellemregning. Serveren skal køre:
`python -m http.server 8080 --directory dist` **fra projektroden**, aldrig
`cd dist` (så låser serveren mappen, og næste byg fejler med EPERM).

**To fælder ved serveren, begge målt 26. aug 2026, og de forstærker hinanden.**

**1. `python` er ikke på PATH i en baggrundsskal.** Startes serveren med
`(python -m http.server ... &)`, fejler den **tavst** med exit 127 — men
kommandoen ser ud til at lykkes, fordi `&` skjuler exitkoden. Brug altid
fuld sti:

```
/c/Users/thyge/AppData/Local/Programs/Python/Python314/python.exe -m http.server <port> --directory dist
```

**2. Port 8080 er delt mellem alle samtidige spor**, og en fremmed servers svar
ser præcis ud som dit eget. Tre forældreløse processer er målt på 8080 samtidig.
Derfor to ting, hver gang der måles i browseren:

- **Egen port pr. worktree.** 8123, 8124, 8125 … aldrig 8080 fra et spor.
- **Verificér serveren mod disken, før ét eneste tal bruges.** Vælg en
  streng, der kun findes i din egen udgave, og sammenlign:

  ```
  curl -s http://localhost:<port>/system.css | grep -c "<din streng>"
  grep -c "<din streng>" assets/system.css
  ```

  Giver de to forskellige tal, måler du en anden agents byg. **En server er et
  måleapparat og skal valideres mod et kendt svar som ethvert andet.**

### Disken er en begrænsning, ikke en selvfølge — målt 1. sep 2026

Et spor døde midt i arbejdet, fordi C: var **100 % fuld**. Årsagen var ikke
projektet, men dets affald: `tests/.tmp-koersel` var vokset til **2,6 GB**
(611 billeder pr. kopi, én kopi pr. testkørsel), `db/.tmp` til **171 MB**, og
to forældreløse målebyg (`dist-c/`, `dist-check/`) fyldte **102 MB**. Alle fire
er gitignorerede og genskabes.

**Konsekvenser, der gælder hver gang flere spor kører:**

- **Antallet af samtidige spor er også begrænset af diskplads**, ikke kun af
  delte filer. Hvert spor kan nå 2,5 GB i testartefakter.
- **Ryd `tests/.tmp-koersel` mellem runder.** Målt samme dag: at rydde
  hovedrepoets 2,5 GB gav *mindre* fri plads bagefter, fordi de kørende spor
  skrev hurtigere, end der blev ryddet. Ryd før du starter, ikke bagefter.
- Rammer ENOSPC et spor, er det **miljøet og ikke arbejdet** — se `fejljagt`.

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
