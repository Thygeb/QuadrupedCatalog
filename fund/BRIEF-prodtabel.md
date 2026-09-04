# BRIEF — spor/prodtabel (designplanens R7)

**Model:** opus. **Worktree:** `../udstilling-wt-prodtabel`. **Gren:** `spor/prodtabel`.
**Forgrenet fra:** `5e6eb6f`. **Din port:** **8123** — aldrig 8080.
**Forventet pris:** ~250k tokens. Overskrider du 400k, så meld det og stop.

**FØRSTE HANDLING: kald `spor`-skillen.** Den bærer grundmålingen, skrive-grænsen,
kontrollinjen, filejerskabet, selv-efterprøvningen, rapportformen og miljøfælderne.
Lykkes kaldet ikke fra din worktree, så læs `.claude/skills/spor/SKILL.md` fra disk
og **skriv i rapporten, at du gjorde det**.

**ANDEN HANDLING: kald `design`-skillen.** Den er navigationskortet til DESIGN.md.

---

## MODE og designfrys — læs dette først

**Fladens MODE er Operate.** Producentindekset er en indgang, man vælger i, ikke en
tekst man læser. DESIGN.md's Operate-kriterium gælder: tæthed slår luft, og det er
ikke en fejl, at betjeningen fylder.

**DESIGNFRYSEN L70 ER LØFTET FOR NETOP DETTE PUNKT.** JPK gav klarsignal
4. sep 2026 kl. ~07.45, ordret: *"laver du alle fixes beskrevet i designarbejde.??
start gerne spor."* Du bygger. Du skal ikke notere og lade ligge.

**Men frysen gælder stadig alt, du ikke er sendt efter.** Ser du et designfund uden
for `.prod-tabel*`, så **notér det i rapporten og ret det ikke.**

---

## Opgaven

`fund/PLAN-designarbejde.md` punkt **R7**: producentindekset skjuler to af tre
datakolonner ved 390 px.

**Hvad læseren betaler i dag** (planens browsermåling, 3. sep): ved 390 px har
`.prod-tabel-wrap` `clientWidth` **343** og `scrollWidth` **620** — **277 px er
skjult**. *"LAND"* er klippet midt i ordet, *"ANTAL"* er helt væk. Der er ingen
rulleaffordance, så intet fortæller læseren, at der er mere. Gælder også `/en/`.

**PLANENS EGNE FORBEHOLD, citeret ordret** (brief-skillens punkt 8b — et uciteret
forbehold er et forbehold, ingen har):

> *"Rækkefølgeafhængighed, der ikke er en spærring: R3 kan gøre R7 større, hvis JPK
> vælger at flytte rosterens oplysninger til indekset. Rettes R7 først, er arbejdet
> ikke spildt — kolonnerne skal være læsbare uanset."*

> *"Send R7 og R9 som ÉT spor. Begge er `generator.css` alene, begge er små, og to
> spor i samme fil er en flettekonflikt, der først opdages, når begge er færdige."*

**Til det sidste forbehold: R9 er LUKKET, målt af orkestratoren 4. sep 2026.**
`grep -c "font-size:[78]px" assets/generator.css` giver **0**, og genmålt med
mellemrum tilladt (`font-size: *[78]px`) også **0** — planens eget greb var blindt
for mellemrumsvarianten, så jeg målte begge. `.saml-fotofelt__ord`
(`generator.css:776`) er i dag visuelt skjult tekst (`clip-path: inset(50%)`), altså
planens udfald 2: *"det erstattes af tilstandsalfabetets stiplede firkant uden
tekst."* **Du er derfor alene i `generator.css`, og parringskravet er opfyldt ved,
at der ikke er noget at parre med.** Bekræft det som din anden kommando.

**JPK's beslutning, der gør dette punkt vigtigere end planens rang:** han har valgt,
at producentsidens roster-blok (*"Alle 25 producenter"*, konstant 1715 px) skal
skæres væk **efter** at du er i mål — netop fordi din rettelse fjerner mobilargumentet
for at beholde den. Ordret fra popupen: *"Ret R7 først, skær så blokken."*
**Dit arbejde er forudsætningen for R3.** Bliver kolonnerne ikke læsbare ved 390,
mister en mobillæser det eneste sted, navn + land + antal står sammen.

---

## Grundmåling — orkestratorens tal, målt 4. sep 2026 på `5e6eb6f`

Genmål dem som din første kommando efter skill-kaldene. **Afviger noget, er det et
fund, ikke ulydighed** (brief-skillens punkt 10).

| Kommando | Giver i dag |
|---|---|
| `grep -c "prod-tabel-wrap::after" assets/generator.css` | **0** |
| `grep -nE "width: *(20ch\|12ch)" assets/generator.css` | **2047, 2051, 2087** |

**PLANENS LINJENUMRE ER FORÆLDEDE.** Planen siger `generator.css:1131–1132`; målt i
dag står de to låste kolonnebredder på **2047** og **2051**, og der er en tredje
`width:12ch` på **2087**. Filen er vokset siden planen blev skrevet i går aftes.
**Genmål selv, og skriv de tal, du faktisk finder** — mine er en måling fra i
morges, ikke en garanti.

---

## Acceptkriterium — ét, og det er kørt mod main

Planen giver to lovlige udfald. **Vælg selv hvilket, og begrund valget i rapporten.**

**Udfald A — kolonnerne bliver læsbare:**
færdig, når et browsermål ved 390 px viser `scrollWidth − clientWidth` **= 0** på
`.prod-tabel-wrap`. *I dag: 277.*

**Udfald B — kolonnerne beholdes bevidst brede, og læseren får at vide, at der er
mere:** færdig, når `grep -c "prod-tabel-wrap::after" assets/generator.css` viser
**≥ 1** *(i dag: 0)* **og** affordancen er synlig på et skærmbillede ved 390 px, som
du har set med egne øjne og beskriver i rapporten.

**Udfald A er at foretrække, hvis det kan nås uden at klippe tekst.** En tabel, der
ikke behøver en rulleaffordance, er bedre end en, der har en. Kan du ikke nå A uden
at beskære et producentnavn, så tag B og skriv hvorfor.

**Kontroltal, der ikke må falde:** `/en/` skal opføre sig som `/da/` — mål begge.
Engelske kolonneoverskrifter er længere end de danske, så **en løsning, der virker på
dansk og ikke på engelsk, er ikke en løsning.**

---

## Filejerskab

**Du ejer:** `assets/generator.css`, og heri **kun** reglerne, der matcher
`.prod-tabel*`. Rører du en regel uden for det præfiks, skal den stå i rapporten med
begrundelse.

**Du må ikke røre:** `assets/system.css` · nogen skabelon i `tools/skabelon/` ·
`data/` · databasen · `STATUS.md` · `PLAN.md`.

**Målt filoverlap mod de fire andre kørende spor: nul.** `spor/tomstat` (min anden
opus-agent) ejer `assets/system.css` og rører ikke `generator.css`. `spor/cjkrest`,
`spor/f2deep` og `spor/f2magic` tilhører session `udstilling-47` og skriver
**kun i databasen** — målt med `git diff --name-only main..<gren>`, som giver **0**
CSS-filer for alle tre.

---

## DESIGN.md — de afsnit, du faktisk skal bruge

**Linjenumrene nedenfor er MÅLT af orkestratoren 4. sep 2026, ikke taget fra
`design`-skillens kort.** Kortet er forældet: det lover Layout på 372 og Komponenter
på 458, men de står på **715** og **801**. **Skriv i din rapport, at kortet var
forkert** — skillen beder selv om det, og fejlen skal rettes.

| Afsnit | Målt linje | Hvorfor du skal derhen |
|---|---|---|
| **Komponenter** | **801** | Start her. Du rører et eksisterende element |
| **Layout** | **715** | Gitteret og rytmen, tabellen skal leve i |
| **De fire datatilstande** | **934** | Indekset viser ANTAL — står der nogensinde 0 eller "ikke oplyst"? |

**Skriv aldrig designreglen af i din rapport.** Peg på linjen.

**Hård begrænsning 5 kan ramme dig:** viser ANTAL-kolonnen nogensinde en tom, en nul
eller en ikke-oplyst tilstand, skal de tre se **forskellige** ud. Mål det, før du
vælger kolonnebredde — en `12ch`-kolonne, der klipper `.v-ikke`s stiplede firkant,
bryder begrænsningen.

---

## Miljø

- **Din port er 8123.** Aldrig 8080 — `udstilling-57` har haft en server der.
- **Serveren skal startes med fuld sti**, ellers fejler den tavst med exit 127:
  `/c/Users/thyge/AppData/Local/Programs/Python/Python314/python.exe -m http.server 8123 --directory dist`
  Kør den fra **din worktrees rod**, aldrig `cd dist`.
- **Verificér serveren mod disken, før ét eneste tal bruges.** Vælg en streng, der
  kun findes i din udgave, og sammenlign `curl` mod `grep`. En fremmed servers svar
  ser præcis ud som dit eget.
- **Du må bygge og teste i din egen worktree.** Du må **ikke** røre main, og du må
  ikke køre noget i hovedrepoet.
- **DISKEN ER DEN HÅRDE GRÆNSE: 24 GB fri, målt 4. sep kl. ~07.50, og der kører fem
  spor.** Én suitekørsel er ~2,8 GB i `tests/.tmp-koersel`. **Ryd din egen, når du
  er færdig med den** — og kør ikke suiten flere gange end nødvendigt. Rammer du
  ENOSPC, er det miljøet og ikke dit arbejde: meld det, og kald `fejljagt`.
- `node` ligger i `/c/Program Files/nodejs/node.exe` og er **ikke** på PATH i Git Bash.
- **Har en fil lavet et `fetch()`, så kald aldrig `process.exit()` bagefter** — sæt
  `process.exitCode`. Ellers crasher node v24.13.0 med exit 127.

---

## Commit-rækkefølge

1. **Grundmålingen** som en commit for sig (rapportfil med de genmålte tal), før du
   ændrer én linje CSS. Dør sporet, ved den næste, hvad udgangspunktet var.
2. **Rettelsen** i `generator.css`.
3. **Rapporten** `fund/FUND-prodtabel.md`.

**Commit undervejs.** Et spor, der dør, skal efterlade sine commits.

---

## Rapporten

`fund/FUND-prodtabel.md`. Formen står i `spor`-skillen — højst 60 linjer plus de to
obligatoriske sektioner uden for loftet (*"Nye fælder og opdagelser"* og *"Punkter i
briefet, jeg ikke nåede"*).

**Rapportens første afsnit skal være en før-og-efter-tabel i konkrete UI-termer** —
hvad kolonnen hedder på skærmen, hvor mange px den flytter sig, hvad der var klippet
før og ikke er nu. JPK's regel 3. sep 2026: han skal kunne godkende uden at læse en
måleprotokol. Metoden kommer bagefter, ikke først.

**Konfidens er bundet til bevistype, ikke fornemmelse.** Høj kræver en genkørbar
kommando **plus** en kontrafaktisk linje.

**To ting, jeg vil vide, som ikke er acceptkriterier:**

1. **Hvad `12ch` og `20ch` faktisk måler til i px** ved 390 og ved 1440, i begge
   sprog. `ch`-enheden afhænger af skriften, og ingen har målt den her.
2. **Om der er en tredje kolonne i klemme**, jeg ikke har set. Jeg har målt LAND og
   ANTAL som de skjulte; planen siger det samme. Begge kan være ufuldstændige.
