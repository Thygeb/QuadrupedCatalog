# BRIEF — spor/tomstat (designplanens R8)

**Model:** opus. **Worktree:** `../udstilling-wt-tomstat`. **Gren:** `spor/tomstat`.
**Forgrenet fra:** `5e6eb6f`. **Din port:** **8124** — aldrig 8080.
**Forventet pris:** ~300k tokens. Overskrider du 450k, så meld det og stop.

**FØRSTE HANDLING: kald `spor`-skillen.** Den bærer grundmålingen, skrive-grænsen,
kontrollinjen, filejerskabet, selv-efterprøvningen, rapportformen og miljøfælderne.
Lykkes kaldet ikke fra din worktree, så læs `.claude/skills/spor/SKILL.md` fra disk
og **skriv i rapporten, at du gjorde det**.

**ANDEN HANDLING: kald `design`-skillen.**

---

## MODE og designfrys

**MODE: begge.** Tilstandsalfabetet er systemets kerne og står på alle flader — både
Operate (kataloget, sammenligningen) og Read (robotsiden, producentsiden). **En
løsning, der kun er prøvet på én af dem, er ikke prøvet.**

**DESIGNFRYSEN L70 ER LØFTET FOR NETOP DETTE PUNKT**, JPK 4. sep 2026 kl. ~07.45:
*"laver du alle fixes beskrevet i designarbejde.?? start gerne spor."* Du bygger.

**Frysen gælder alt andet.** Fund uden for `.v-ikke` og tokendefinitionerne noteres,
rettes ikke.

---

## Opgaven, og hvorfor den er hård

`fund/PLAN-designarbejde.md` punkt **R8**: tilstanden *"ikke oplyst"* er usynlig på
`--bund`-flader.

**Hvad læseren betaler i dag:** chippens fyld er `--tom`, som peger på
`--p-eloxgraa`; fladen bagved er `--bund`, som peger på **den samme primitiv**
(`system.css:134` og `:127`) — **1,00 : 1**. Hele tilstanden bæres af en 0,8 px
stiplet `--hegn`-kant på **2,14 : 1**, under WCAG 1.4.11's krav på 3,0. På `--panel`
virker fyldet; på producentsiden og i katalogets flader gør det ikke.

**Det rører hård begrænsning 5**, ordret fra CLAUDE.md: *"'Ikke oplyst', 'nej' og '0'
er tre forskellige tilstande og skal se forskellige ud. Det er der, katalogsider
lyver."*

---

## JPK'S BESLUTNING — og den måling, der ændrer, hvordan den skal udføres

**JPK valgte 4. sep 2026 i en popup:** *"Giv `--tom` sin egen primitiv."*
Valgmulighedens tekst lød: *"Mindste indgreb, der løser kontrasten. Åbner DESIGN.md's
konflikt 3 (fem tokennavne på samme hex), som så skal afgøres bagefter."*

**DEN TEKST VAR MIN, OG DEN VAR UPRÆCIS. Orkestratorens egen måling, taget efter
popupen, viser at valget ikke er farbart, hvis det udføres ordret:**

| Fyld `--tom` | mod `--bund` | men teksten `--blaek3` (#5F686F) PÅ fyldet |
|---|---|---|
| #7B8287 | **3,26** ✓ | **1,46** ✗ (tekst kræver 4,5) |
| #747A7F | 3,63 ✓ | **1,31** ✗ |
| #6C7276 | 4,07 ✓ | **1,17** ✗ |

**Gøres fyldet mørkt nok til at nå 3,0, bliver ordet i chippen ulæseligt.**
Tilstanden ville blive synlig som firkant og forsvinde som ord. Det er ikke, hvad JPK
bad om — han bad om, at *"ikke oplyst"* kan **ses**.

**JPK's INTENTION er farbar; hans ORDLYD er ikke.** Intentionen er: løs kontrasten
med en ny primitiv frem for at omskrive tilstandsalfabetet. **Planens eget
acceptkriterium peger på den farbare vej** — det stiller kravet til **kanten**, ikke
til fyldet:

> *"færdig, når en beregning af WCAG-kontrasten for `.v-ikke`s bærende KANT mod
> `--bund` viser ≥ 3,00, med læseretningen skrevet ud (hvad på hvad).
> I dag: 2,14 : 1 for kanten og 1,00 : 1 for fyldet."*

**Den vej, jeg beder dig bygge — og som du skal efterprøve, ikke stole på:**

| Del | Fra | Til | Måling |
|---|---|---|---|
| **Fyld** `--tom` | `var(--p-eloxgraa)` #E8EBED | **egen primitiv**, let tonet, fx #DDE1E4 | 1,10 mod `--bund` · tekst forbliver **4,32** ✓ |
| **Kant** i `.v-ikke` | `var(--hegn)` #9AA3A9 | **egen primitiv**, fx #7B8287 | **3,26** mod `--bund` ✓ |

**Dette opfylder alle fire krav på én gang, og det er derfor jeg beder om det:**

1. JPK's ord: `--tom` **får** sin egen primitiv ✓
2. Planens acceptkriterium: kanten når **≥ 3,0** ✓
3. Den tidligere beslutning (nedenfor): de fem navne **skilles ad**, ikke sammen ✓
4. Hård begrænsning 5: *"ikke oplyst"* bliver synligt forskellig fra bunden ✓

**Mine hexværdier er FORUDSIGELSER, ikke krav.** Mål selv, vælg dine egne, og skriv
de tal, du faktisk finder. Rammer du en bedre kombination, så tag den og begrund det.
**Finder du, at min vej er forkert, er det en leverance — ikke ulydighed**
(brief-skillens punkt 10).

---

## TIDLIGERE BESLUTNING — den støtter dig, og den er et værn

Slået op i STATUS.md uden `head` (brief-skillens krav; Lukket-tabellen ligger
nederst, så `head` rammer systematisk forbi). **Linje 143, ordret:**

> *"Opgavens vigtigste værn, som en efterfølger IKKE må miste: de fem navne på
> `#E8EBED` må ALDRIG lægges sammen. `--tom` er fyldet bag "ikke oplyst" og bærer
> hård begrænsning 5 — sammenlægning er pixelidentisk i dag og svejser reglen til
> sidens bundfarve for altid."*

**Din opgave er det modsatte af det, der blev advaret imod, og derfor lovlig:** du
**skiller** `--tom` ud af de fem, du lægger ikke sammen. Skriv det i rapporten, så
næste læser kan se, at værnet blev slået op og ikke brudt.

**De fem navne på `#E8EBED`, målt af mig 4. sep:** `--bund` · `--panel-ro` ·
`--tom` · `--accent-ro` · `--paafod`. Efter dit spor skal `--tom` være ude af listen,
og **de fire andre skal stå uændrede.**

**PALETTELÅSEN, og hvorfor du ikke bryder den:** TYPESKILT er låst, og planen skriver
selv, at *"vælg en anden grå"* ikke er en farbar vej. **JPK har overtrumfet det med
åbne øjne** — låsens tekst stod ordret i den popup, han svarede på. Men låsen betyder
stadig noget for **hvordan**: din nye primitiv skal ligge på **støvgrå-aksen**
(`--p-stoevgraa` #9AA3A9), ikke være en ny kulør. **Opfind ikke en farve; forlæng en
akse, der findes.**

---

## Grundmåling — målt 4. sep 2026 på `5e6eb6f`. Genmål som første kommando

| Kommando | Giver i dag |
|---|---|
| `node fund/maal-farvetokens.mjs` | **26 farvetokens**, `#E8EBED` har **6** navne |
| `grep -c "var(--tom)" assets/system.css assets/generator.css` | **6** og **1** |
| `grep -c "var(--hegn)" assets/system.css assets/generator.css` | **31** og **11** |
| `grep -n "^\.v-ikke" assets/system.css` | **694** (reglen), **697** (`.mrk`) |

**`--hegn` bruges 42 steder, `--tom` kun 7.** Det er hele grunden til, at kanten i
`.v-ikke` skal have sin egen primitiv frem for at `--hegn` ændres: **at ændre `--hegn`
ville røre 42 steder, du ikke er sendt efter.** Rør den ikke.

---

## Acceptkriterier — fire, alle kørt mod main

1. **Kanten når kravet.** Færdig, når en WCAG-beregning af `.v-ikke`s bærende kant
   mod `--bund` viser **≥ 3,00**, med **læseretningen skrevet ud** (*hvad på hvad*).
   *I dag: 2,14.* Et kontrasttal uden læseretning er ikke et tal — den fælde kostede
   projektet `--accent` målt som baggrund og brugt som forgrund.
2. **Teksten forbliver læsbar.** Færdig, når `.v-ikke`s tekstfarve mod dens **eget
   fyld** viser **≥ 4,50**. *I dag: 4,74 (teksten står reelt på `--bund`).*
   **Dette kriterium er det, der fanger den forkerte løsning** — uden det ville et
   mørkt fyld se ud som en bestået rettelse.
3. **De fire andre navne rører sig ikke.** Færdig, når
   `node fund/maal-farvetokens.mjs` viser `#E8EBED` med **præcis ét navn færre**
   (`--tom` ude; `--bund`, `--panel-ro`, `--accent-ro`, `--paafod` tilbage).
   *I dag: 6 navne.* Brug målerens `--skriv` **før** og `--sammenlign` **efter**.
   **Kravet i BRIEF-primitiv.md var "0 ændrede farver"; for dig er det "præcis de
   ændringer, du kan navngive" — skriv dem alle op.**
4. **De tre tilstande ser forskellige ud.** Færdig, når du på ét skærmbillede ved
   1440 og ét ved 390 kan pege på `.v-ikke`, `.v-nej` og `.v-nul` **på en
   `--bund`-flade** og beskrive, hvordan de adskiller sig. *I dag: `.v-ikke` er
   ikke til at skelne fra fladen.* **Se dem med øjne — det er hård begrænsning 5,
   og den kan ikke måles med grep alene.**

**Kontroltal, der ikke må falde:** `node tools/build.mjs` i **din egen worktree** skal
bygge samme antal sider som før dit spor. Mål før og efter; skriv begge tal.
**Skriv ikke et hårdkodet forventet sidetal — mål det.**

---

## Filejerskab

**Du ejer:** `assets/system.css`, og heri **kun** `:root`-tokendefinitionerne og
reglerne `.v-ikke` / `.v-ikke .mrk`.

**Du må ikke røre:** `assets/generator.css` (`spor/prodtabel` ejer den lige nu) ·
nogen skabelon · `data/` · databasen · `STATUS.md` · `PLAN.md` · `DESIGN.md`.

**DESIGN.md skal opdateres af dit arbejde, men IKKE af dig.** Skriv i stedet et
afsnit i rapporten, *"Det, DESIGN.md skal have tilføjet"*, med den præcise tekst.
Orkestratoren skriver den ind. Grunden: DESIGN.md er systemet, og to spor, der
redigerer systemet samtidig, giver en flettekonflikt i den ene fil, hvor en
konflikt er dyrest.

**Målt filoverlap mod de fire andre kørende spor: nul.** `spor/prodtabel` ejer
`generator.css`. `spor/cjkrest`, `spor/f2deep`, `spor/f2magic` (session
`udstilling-47`) skriver **kun i databasen** — målt med
`git diff --name-only main..<gren>` = **0** CSS-filer for alle tre.

---

## DESIGN.md — de afsnit, du skal bruge

**Linjenumrene er MÅLT af orkestratoren 4. sep 2026.** `design`-skillens kort er
**forældet**: det lover datatilstandene på 583 og Konflikter på 674, men de står på
**934** og **1169**. **Skriv i rapporten, at kortet var forkert** — skillen beder
selv om det.

| Afsnit | Målt linje | Hvorfor |
|---|---|---|
| **De fire datatilstande** | **934** | Din opgaves kerne. `.v-tal` `.v-nul` `.v-nej` `.v-ja` `.v-ikke` `.v-billede` med nøjagtige grader og mærker |
| **Farver** | **344** | Hvornår en farve må bruges |
| **Konflikter** | **1169** | **Konflikt 3, 6 og 9 hører til din opgave** — se nedenfor |

**Planen siger, at R8 hænger sammen med tre af DESIGN.md's konflikter, og at de
bør afgøres i ét træk:** konflikt **3** (fem tokennavne på samme hex), **6**
(`--hegn` som betydningsbærende kant) og **9** (halvdelen af tilstandsfamilien
sat i px, halvdelen i em).

**Du skal ikke AFGØRE dem — du skal MÅLE, hvad dit arbejde gør ved dem**, og skrive
det i et afsnit *"Hvad mit spor gør ved konflikt 3, 6 og 9"*. Konflikt 3 lukker du
delvist (ét navn ud af fem). Konflikt 6 rører du direkte, fordi kanten holder op med
at være `--hegn`. Konflikt 9 rører du formentlig ikke — men mål det.

---

## Miljø

- **Din port er 8124.** Aldrig 8080.
- **Serveren skal startes med fuld sti**, ellers fejler den tavst med exit 127:
  `/c/Users/thyge/AppData/Local/Programs/Python/Python314/python.exe -m http.server 8124 --directory dist`
  Kør den fra **din worktrees rod**, aldrig `cd dist`.
- **Verificér serveren mod disken, før ét eneste tal bruges.**
- **Du må bygge og teste i din egen worktree. Du må ikke røre main.**
- **DISKEN ER DEN HÅRDE GRÆNSE: 24 GB fri, målt 4. sep kl. ~07.50, fem spor kører.**
  Én suitekørsel er ~2,8 GB. **Ryd din `tests/.tmp-koersel`, når du er færdig.**
  Rammer du ENOSPC, er det miljøet, ikke dit arbejde — meld det og kald `fejljagt`.
- `node` ligger i `/c/Program Files/nodejs/node.exe`, **ikke** på PATH i Git Bash.
- **Efter et `fetch()`: aldrig `process.exit()`** — sæt `process.exitCode`.

---

## Commit-rækkefølge

1. **Grundmålingen** som egen commit, før du ændrer én linje.
2. **Primitiverne** (`:root`) som egen commit — så en revert kan ramme dem alene.
3. **`.v-ikke`-reglerne** som egen commit.
4. **Rapporten** `fund/FUND-tomstat.md`.

**Commit undervejs.** Et spor, der dør, skal efterlade sine commits.

---

## Rapporten

`fund/FUND-tomstat.md`. Formen står i `spor`-skillen — højst 60 linjer plus de to
obligatoriske sektioner uden for loftet.

**Første afsnit skal være en før-og-efter-tabel i konkrete UI-termer:** hvad en
læser ser på skærmen før og efter, hvilke hexværdier der skiftede, hvilke
kontrasttal der flyttede sig og i hvilken læseretning. JPK's regel 3. sep 2026 —
han skal kunne godkende uden at læse en måleprotokol.

**Ekstra sektioner, ud over skillens to obligatoriske:**

- *"Det, DESIGN.md skal have tilføjet"* — præcis tekst, som orkestratoren skriver ind.
- *"Hvad mit spor gør ved konflikt 3, 6 og 9"*.

**Konfidens er bundet til bevistype.** Høj kræver en genkørbar kommando **plus** en
kontrafaktisk linje.

**Tre ting, jeg vil vide, som ikke er acceptkriterier:**

1. **Er `.v-ikke` den eneste tilstand, der forsvinder på `--bund`?** Jeg har målt
   `.v-ikke`. `.v-nul` og `.v-billede` har jeg **ikke** målt. Hvis en af dem har
   samme fejl, er det et fund, der er lige så meget værd som rettelsen.
2. **Hvor mange af de 216 byggede sider viser `.v-ikke` på en `--bund`-flade?** Jeg
   ved, at producentsiden og katalogets flader gør. Jeg har ikke talt dem.
3. **Om `--tom` overhovedet bruges de 7 steder, jeg målte** — eller om nogle af dem
   er døde regler. `fil:linje` beviser, at kode findes, ikke at nogen kalder den.
