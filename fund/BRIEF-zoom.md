# BRIEF — `spor/zoom`: hover-zoomen beskærer produktfotos, og L78 forbyder det

**Model: sonnet.** Facittet er målbart: 0 % beskæring af fotografier bagefter.
**Worktree:** `C:/Praktik/websites/udstilling-wt-zoom`, gren `spor/zoom`, fra `ac84dfe`.

## Første handling

**Kald `spor`-skillen.** Den bærer grundmålingen, skrive-grænsen, kontrollinjen,
filejerskabet, selv-efterprøvningen, rapportformen og miljøfælderne. Lykkes kaldet ikke fra
din worktree, så læs `.claude/skills/spor/SKILL.md` fra disk og **skriv i rapporten, at du
gjorde det**.

**Sporet er undtaget designfrysen L70**, fordi det retter et brud på en hård regel. Men det
*rører* design, så du foreslår mekanismen frem for at vælge den frit — se nedenfor.

## Konflikten, og den er ægte — to rigtige beslutninger, der modsiger hinanden

**L78, besluttet af JPK 2. sep 2026, ordret:** *"et produktfoto beskæres ALDRIG.
`object-fit:contain` og `aspect-ratio:4/3` overalt."* Ingen forbehold.

**Hover-zoomen, bygget 26. aug 2026** (`9e01625`, `spor/indgang` punkt 3),
`system.css:1365-1370`:

```
@media (prefers-reduced-motion:no-preference){
  .billedled img{transition:transform var(--tid) var(--slyng)}
  .kort:hover .billedled img,.kort:focus-within .billedled img{transform:scale(1.024)}
  .kort:hover .billedled--plade img,.kort:focus-within .billedled--plade img{transform:scale(1.04)}
}
```

Kommentaren ved `:1372` forsvarer den: *"Fotografiets `scale(1.024)` ovenfor er 2,4 % —
maalt usynligt, ikke et signal."* **Den måling gjaldt SYNLIGHED, ikke beskæring**, og den er
en uge ældre end L78. Zoomen er altså ikke en forglemmelse — den er en velbegrundet
beslutning, som en nyere regel har overhalet.

**Målt af `spor/katalogplan` 3. sep:** billedet har **0 % breddeslæk** og 8,96 % højdeslæk
under `object-fit:contain`. En `scale()` beskærer derfor **vandret** med det samme.
**Efterprøv det tal selv** — det er briefets vigtigste påstand, og hele sporet hviler på det.

**Tre ting, der afgrænser opgaven:**

1. **Zoomen gælder kun `prefers-reduced-motion:no-preference`.** Brugere med reduceret
   bevægelse ser den ikke i forvejen.
2. **Der er TO zooms.** `1.024` på fotografier og `1.04` på `.billedled--plade`.
   **Målepladerne er VORES EGNE tegninger** (`assets/silhuetter/`), ikke produktfotos.
   **L78 dækker dem ikke.** Rør dem kun, hvis din mekanisme kræver det — og skriv hvorfor.
3. **Beskæringen sker i rammen, ikke i filen.** Det er tredje gang i dette projekt, at
   nogen måler mod `<img>`-elementets kasse og får 0. **Mål mod `.billedled`.**

## Opgaven — mål to mekanismer, byg den bedste, rapportér begge

Målet er **0 % beskæring af fotografier**, mens **hvert kort stadig svarer på hover og
fokus**. Bevægelsen er designets, og den skal ikke bare slettes.

**Mål mindst disse to, og skriv tallene for begge:**

- **A. Flyt bevægelsen ud af billedet.** Zoom rammen, kortet eller skyggen i stedet for
  `<img>`. Beskæring pr. definition 0. Pris: kortets kasse bevæger sig, hvilket kan give
  "hop" i gitteret — kommentaren ved `:1378` siger udtrykkeligt, at signalet aldrig må
  ændre kortets højde. **Mål, om det sker.**
- **B. Zoom kun inden for slækket.** Højden har 8,96 % slæk, bredden 0. En `scale()` kan
  ikke bruge det uden at beskære vandret, men en `translateY` eller en `object-position`-
  ændring kan flytte inden for slækket. Mål, om det overhovedet er synligt.

**Vælg den med mindst systempåvirkning, byg den, og skriv hvorfor den anden blev fravalgt.**
Er begge dårlige, så byg ingen af dem og rapportér det — et spor, der siger "begge koster
mere, end de giver", er et gyldigt resultat.

## Ejerskab

**Du ejer:** `assets/system.css` · `fund/BRIEF-zoom.md` · `fund/FUND-zoom.md` · en ny
testfil, hvis du skriver en.

**Du rører ikke:** `assets/generator.css` (kan blive rørt af systemdeltaet) · `db/**` ·
`data/robots/**` · `media/_kilder/**` · `PLAN.md` · `DATAFLOW.md` · `tools/**` ·
`fund/PLAN-*.md` · `tests/dele/63, 64, 68, 69, 71` (den anden sessions).
**`tests/dele/57-doed-css.mjs` må du læse, ikke ændre.**

**Nyt testnummer: 72.** Skriv en test, hvis din løsning kan regressere — filen skal hedde
`tests/dele/72-<kort-navn>.mjs` og følge kontrakten i `tests/LAESMIG.md`. Er der intet
meningsfuldt at teste, så skriv det i rapporten frem for at skrive en tom test.

## Acceptkriterier — kørt mod main af mig 3. sep, med "giver i dag X"

1. `grep -c 'scale(1.024)' assets/system.css` → **giver i dag 1**. Efter dit spor: **0**,
   medmindre du vælger en løsning, der beholder tallet — så skal rapporten sige hvorfor.
2. **Beskæring målt mod `.billedled`, ikke mod `<img>`:** fotografier skal give **0 %**
   vandret beskæring ved hover. Mål før og efter, og skriv begge tal.
3. **Hvert kort svarer stadig på hover og fokus.** Mål det — en løsning, der fjerner
   svaret, opfylder ikke opgaven.
4. `"/c/Program Files/nodejs/node.exe" tools/build.mjs` → **samme sidetal som din
   grundmåling** (ikke et hårdkodet tal).
5. `"/c/Program Files/nodejs/node.exe" tests/koer.mjs` → **1658 bestået / 0 fejlet** plus
   dine egne nye. Det er en **forudsigelse** — mål og skriv det faktiske.
6. `git diff --name-only main...spor/zoom` → kun dine ejede filer.

**Grundmåling, mine tal 3. sep:** validate **77/0/1** · build **216 sider, 1111/0** · tests
**1658/0**. Afviger dine, så stop og rapportér — det er miljøet, ikke dit arbejde.

## Miljø

- **node:** `/c/Program Files/nodejs/node.exe`. Bar `node` giver **exit 127**, som ligner
  libuv-fælden fra CLAUDE.md, men er bash' `command not found`. **Læs fejlteksten.**
- **Din serverport er 8143.** Aldrig 8080. Verificér serveren mod disken, før ét tal bruges.
  **Luk den, når du er færdig, og skriv i rapporten, at du gjorde det.**
- **Serveren må ikke køre, når du bygger** — den låser `dist/`, EPERM.
- **DEN STYRBARE BROWSER ER FÆLLES PÅ TVÆRS AF SAMTIDIGE SPOR — også den aktuelle fane.**
  Målt 3. sep af to spor uafhængigt: et spor blev flyttet til en fremmed port, til en anden
  side og til sidst til **reddit.com**, og bredden sprang 1440 → 1536 → 2048. **Egen port
  beskytter ikke.** Skriv en URL- og bredde-vagt som **første linje i hver eneste måling**,
  og forkast tallet, hvis den fejler. En ny fane hjælper ikke.
- `.env` og `assets/fotos/fabrikant/` (**610 filer**) er kopieret ind af mig.
- **Et grep på en klasse tæller kommentarer og bindestreger med.** Mål selektorer, og kør
  altid en positiv kontrol.
- UTF-8 uden BOM · `git commit -F <fil>` ved backticks · `sed -i` fejler tavst, brug Edit.
- **Commit undervejs.**

## Rapporten — `fund/FUND-zoom.md`, højst 60 linjer

Valgt/fravalgt mekanisme med tal for **begge** · konfidens pr. punkt (høj kræver genkørbar
kommando **plus** én linje om, hvad tallet ville have været, hvis arbejdet var forkert) ·
usikkerheder · målinger som tal. **Uden for de 60, obligatorisk:** "Nye fælder og
opdagelser" og "Punkter i briefet, jeg ikke nåede".

**Briefets fakta er påstande.** Afviger din måling fra min, så rapportér afvigelsen — det er
en del af leverancen, ikke ulydighed. Syv af mine fakta blev rettet af spor i går og i dag;
hver gang var det rigtigt.
