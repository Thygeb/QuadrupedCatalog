---
name: brief
description: Rygraden i ethvert agentbrief for quadruped-kataloget. Brug den HVER gang et spor skal sendes ud — også små rettelsesspor og genstarter. Besluttet af JPK 26. aug 2026 efter at fire defekter slap gennem 13 håndskrevne briefs på én dag. grillmig dømmer om briefet SKAL sendes (hensigten); denne skill bygger selve kroppen, så konstruktionsfejlene ikke gentages. Send aldrig et brief uden at have kørt dens tjekliste.
---

# Brief — kroppen, ikke hensigten

13 briefs blev skrevet i hånden 26. aug 2026. Fire defekter slap igennem, og
hver af dem kostede en runde eller var ren nåde: et acceptkriterium der altid
gav 0 (to gange), et selvmodsigende filejerskab, en manglende designskill, en
forældet grundmåling. `grillmig` fangede dem ikke, for den dømmer hensigten —
ingen skill dækkede konstruktionen. Det gør denne.

**Rækkefølgen, ændret 28. aug 2026 af JPK:** denne tjekliste kaldes nu **direkte**.
`grillmig` er taget ud af det obligatoriske workflow, fordi den holdt designprocessen
tilbage og skar for mange idéer — se CLAUDE.md's skilltabel. Den må stadig kaldes
bevidst på et brief, men aldrig på en designretning, og aldrig automatisk.

**Det ene spørgsmål fra grillmig, der SKAL overleve her, fordi intet andet bærer det:**
*er der en tidligere beslutning imod?* Slå efter i STATUS.md's **Lukket**-tabel og i
*"Kom ikke igen med disse"* — og **afkort aldrig den søgning med `head`.** Lukket-tabellen
ligger nederst i filen, så `head` rammer systematisk den halvdel, spørgsmålet handler om.
Det er Å55: sessionens dyreste fejl blev begået med grillmig kørende, fordi søgningen
efter tidligere beslutninger stoppede 100 linjer før svaret.

## Tjeklisten — elleve punkter, alle målbare

### 1. Grundmålingen står i briefet, med orkestratorens egne tal

Sporets FØRSTE kommando er at genmåle den. Uden den kan agenten ikke svare på
*"var det mig, der ødelagde det?"* — og tallene skal være FRISKE: et
s1-spor fik 232 tests med som grundmåling, mens main havde 275, fordi briefet
var skrevet før fire flet. Mål umiddelbart før afsendelse, ikke ved planlægning.

### 2. Hvert acceptkriterium er KØRT mod main, før det sendes

Det skal give det "forkerte" svar nu — ellers måler det ingenting (O2).
`split('h-udvalg')[1]` printede 0 uanset arbejdet, to briefs i træk. Og
kriteriets script er selv et gæt: `Object.values(j)[0]` var ikke robotarrayet.
**Kør kommandoen, sæt dens nuværende output ind i briefet som "giver i dag X".**

**Og et kriterium, der TÆLLER, skal køres mod et kendt svar — ikke kun mod main.**
Tilføjet 4. sep 2026. Mit `grep -rhoE "(padding|margin)…: *[0-9.]+px" | sort -u |
wc -l` gav **78** og blev sendt som sporets vigtigste acceptkriterium. Det var tre
fejl i én: whitespace-følsomt (19 dubletter), det tog kun shorthandens **første**
værdi, og det **talte kommentarer med**. Reelt: 19 forskellige tal, 13 i kode.

Punkt 2 fanger det ikke, fordi et forkert greb giver et **fuldstændig plausibelt**
tal mod main — der er intet at undre sig over. **Kør tællingen mod en fil, hvor du
selv kender facit** (fx en med to kendte forekomster og én i en kommentar), før
tallet bliver et krav. Sporet fangede den her; det er sporets fortjeneste, ikke
briefets værn.

### 3. Filejerskabet er komplet og modsigelsesfrit

- Alle filer, opgaven skal røre, ER på ejerlisten. Tjek: bor funktionen, der
  skal ændres, i en fil på listen? ("ret `ekstremer()`" + "rør ikke `side.mjs`"
  — hvor funktionen bor — var et ægte brief her.)
- Ingen fil ejes af to samtidige spor. Nye tests går i egen fil efter
  `tests/LAESMIG.md`s kontrakt, aldrig i en delt.

### 4. Tal er mærket: krav, gæt eller forudsigelse

Et udledt tal skrives som regel ("samme sidetal plus 2 pr. ny robot"), aldrig
som konstant ("213 sider"). Kan det ikke udledes, mærkes det **forudsigelse**:
agenten skal måle og skrive det faktiske tal, ikke ramme dit. Mit "177 sider"
blev til 175; agenten gjorde det rigtige. Nævner og dato på ethvert citeret tal.

### 5.–8. Metoden peger på `spor`-skillen — skriv den ikke af

**Punkt 5, 6, 7 og 8 var indtil 3. sep 2026 fire regelblokke, der blev kopieret
ind i hvert eneste brief.** Målt samme dag: 20 af 21 briefs i `fund/` bar de
samme otte blokke, og `BRIEF-f2-vaern.md` brugte 47 af sine 205 linjer på dem.
Det er præcis den håndkopiering, punkt 5 selv advarede imod. De ligger nu i
`.claude/skills/spor/`, som **sporet kalder som sin første handling**.

Briefet skal derfor kun bære **én linje** i stedet:

> *Kald `spor`-skillen som din første handling — den bærer grundmålingen,
> skrive-grænsen, kontrollinjen, filejerskabet, selv-efterprøvningen,
> rapportformen og miljøfælderne. Lykkes kaldet ikke fra din worktree, så læs
> `.claude/skills/spor/SKILL.md` fra disk og skriv i rapporten, at du gjorde
> det.*

**Det, briefet stadig selv skal bære**, fordi det er opgavespecifikt:

- **5.** Navngiv de *øvrige* skills, sporet skal kalde eller vurdere —
  `robotdata` for en robotpost, `supabase` for skemaarbejde, `fejljagt` når
  noget opfører sig uventet. Plugin-skills fra en worktree svinger: giv
  diskstien med som reserve.

  **Rører sporet noget visuelt — en flade, CSS, en farve, en skriftgrad, en
  komponent, en datatilstand — så skal briefet pege på `design`-skillen OG på
  de 2-4 konkrete afsnit i `DESIGN.md`, sporet faktisk skal bruge, med
  linjenummer.** Ikke hele filen: den er 834 linjer, og et spor, der læser de
  40 relevante, sparer 95 %. **Skriv aldrig designreglen af i briefet** — det
  er kopi nummer to af designsystemet, og punkt 5's egen begrundelse gælder
  her med fuld kraft. Briefet skal desuden navngive **fladens MODE**
  (Operate eller Read) og sige udtrykkeligt, om designfrysen gælder for netop
  denne opgave, eller om den er undtaget — og hvorfor. Et spor, der selv skal
  gætte det, gætter forkert i den dyre retning.
- **6.** Rapportens **filnavn** (`fund/FUND-<spor>.md`) og eventuelle ekstra
  sektioner ud over skillens to obligatoriske.
- **7.** De miljøting, der er særlige for netop dette spor: hvilken port det
  har fået, hvad der er kopieret ind i worktreen, om det må køre
  `tests/koer.mjs`. Det generelle står i
  `.claude/skills/spor/references/miljoefaelder.md`.
- **8.** Hvilke punkter der skal committes hver for sig, i hvilken rækkefølge.
  Skillen bærer *hvorfor* det er en skrive-grænse og ikke en commit-grænse.

### 8b. Kommer punktet fra en plan: CITÉR PLANENS EGEN ADVARSEL

Tilføjet 3. sep 2026, og det er dagens dyreste fejl, fordi reglen var skrevet af
os selv **samme dag**.

`fund/PLAN-designarbejde.md` skrev ved sit punkt R9, ordret:

> *"Send R7 og R9 som ÉT spor. Begge er `generator.css` alene, begge er små, og
> to spor i samme fil er en flettekonflikt, der først opdages, når begge er
> færdige."*

R9 blev sendt alene. **Tre CSS-grene kolliderede i `generator.css` samme aften**,
præcis som forudsagt, og to af dem måtte løses i hånden.

**Advarslen stod i planen, ikke i briefet.** Den, der sendte sporet, læste
punktets *opgave* og ikke punktets *forbehold* — og en plan er ikke obligatorisk
læsning for den, der handler på ét af dens punkter.

**Reglen:** stammer et brief fra et punkt i en plan, så **læs hele punktet og
skriv dets forbehold ind i briefet ordret**. Har punktet en linje om
rækkefølge, om parring med et andet punkt, eller om en fil, et andet spor ejer,
så er den linje en del af opgaven. Er der ingen forbehold, så skriv **"planens
punkt X bærer ingen forbehold"** — så kan næste læser se forskel på et fravalg
og en forglemmelse.

Samme form som punkt 10: et citat er et tal, og et uciteret forbehold er et
forbehold, ingen har.

### 9. Pladsholder-scanning til sidst

Læs briefet igennem for: "TODO", "stram op", "gør det pænere", "fix X" uden
eksempel, et punkt uden acceptkriterium, et acceptkriterium uden "giver i dag
X". Finder du ét, er briefet ikke færdigt. Reglen for rettelses-briefs er den
samme, skærpet: fil:linje, citat af det nuværende, det ønskede resultat
konkret, ét kriterium pr. punkt, én linje hvorfor.

### 10. Briefets fakta er påstande — og at måle dem er sporets leverance

Skriv det ind i briefet: **afviger noget, agenten måler, fra noget, briefet
påstår, skal afvigelsen rapporteres — det er en del af leverancen, ikke
ulydighed.** Session 26.-27. aug: to agenter rettede orkestratorens fakta
(et forkert struktur-antaget script, et forkert feltantal), begge på eget
initiativ, begge korrekte. Det var sessionens billigste kvalitetskontrol —
orkestratoren kontrolleres ellers af ingen.

Samme regel for citater, dine egne inklusive: **et citat er et tal.** Citeret
med linjenummer og slået op = høj konfidens; citeret efter hukommelse = lav,
og skal mærkes. To løse citater slap igennem på én session (ARBEJDSGANG.md V3),
og begge lød dokumenterede, netop fordi de bar en henvisning.

**En test kan være det SIDSTE sted, en beslutning findes.** Tilføjet 3. sep
2026. Otte tests gik røde efter et flet, og jeg kaldte dem *"forventede"* og
bad et spor vende dem. Den anden session slog efter først og fandt, at to af
dem hed `35.11: CE-facetten er vaek (L55 punkt 3)` og `35.12:
certificeringspladsen er reserveret og aerlig (L55 punkt 1)` — beslutningen
stod i **testens navn**, og intet andet sted i repoet.

CLAUDE.md siger *"ret assertions, slet dem ikke"*. Det her er den skærpede
form: **her ER assertionen arkivet.** Havde sporet vendt dem, var en gældende
beslutning forsvundet uden spor — og vendingen ville have set korrekt ud.

**Læs testens NAVN, før du beder om at få den vendt.** Bærer det et L-nummer,
en dato eller en beslutningshenvisning, så skriv ophævelsen i STATUS **først**,
og lad den nye assertion citere den. Prisen i dag var Å149/L89; prisen uden
reglen var en beslutning, ingen kunne finde igen.

**Denne tjekliste gælder også rettelsesbeskeder til et kørende spor.** En
rettelsesbesked er et brief — fil:linje, citat af det nuværende (opslået, ikke
husket), ønsket resultat, kørt acceptkriterium. Sessionens fejl 6 var en
rettelsesbesked sendt uden om alle værn.

### 11. Prisen står i briefet, og budgettet er målt, før det sendes

Et spor koster tokens af JPK's grænse, og den blev først målt ved **8 %**
2. sep 2026 — et spor måtte stoppes midt i producent 5 af 6. Målt samme dag fra
sporenes `<usage>`: **~38k tokens pr. robot** i fase 2's udrulning, **~310k pr.
robot** i pilotrunden (opskriften kostede 8×, én gang). Et spor, der skriver en
opskrift, koster altså ikke det samme som et, der følger den.

Skriv sporets forventede pris i briefets hoved, og **spørg JPK om restbudgettet,
før en fan-out sendes** — ikke efter. Fire spor à 450k er 1,8M; er der 2M
tilbage, er det ikke fire spor, det er tre.

## Efter afsendelse

Skriv sporet i STATUS.md's kørende-spor-post (worktree, gren, ejerskab,
grundmåling), så en læser, der ikke var med, kan finde det. Det var det, der
reddede `spor/retning`-obduktionen: posten fandtes, arbejdet gjorde ikke.
