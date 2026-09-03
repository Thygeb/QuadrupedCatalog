# FUND — spor/produkort

## ÆNDRINGEN, i UI-termer (CLAUDE.md 2b: dette først, målingen bagefter)

**Hvad JPK ser på Xiaomis producentside, i EU-afsnittet:**

| | Før | Efter |
|---|---|---|
| Antal linjer | **1** | **2** |
| Linje 1 | `0 af 2` · *"robotter i kataloget oplyser CE-mærkning fra producenten."* | `1 af 2` · **▪ NEJ** · *"Producenten oplyser, at der ikke er CE"* |
| Linje 2 | — | `1 af 2` · **⬚ ikke oplyst** · *"CE står ikke noget sted"* |
| Tilstandsmærke | intet | 9×9px **fyldt** firkant (nej) og **stiplet** firkant (ikke oplyst) |

**På de øvrige 24 producentsider:** ANYbotics går fra *"2 af 2 robotter i
kataloget oplyser…"* til `2 af 2` · **▪ JA** · *"CE oplyst af producenten"*.
De **23 tavse** producenter beholder **præcis én linje** — deres side bliver
ikke tungere. Ingen side har mistet sit EU-afsnit.

**Sådan formulerede jeg sætningen, og hvorfor:** jeg formulerede den **ikke**.
De tre nøgler `eu_ce_ja` / `eu_ce_nej` / `eu_ce_ikke_oplyst` lå
færdigoversatte i **begge** sprogfiler (linje 256-258) uden en eneste bruger i
koden. Ordlyden *"Producenten oplyser, at der ikke er CE"* — ikke *"har ikke
CE"* — er L25's besluttede regel, gengivet i `fund/PLAN-producent.md` 6.2.
**Nul i18n-filer er ændret.** Briefet forudsatte nye nøgler ved linje 46-47;
de var overflødige, og hele i18n-kollisionsrisikoen mod `spor/prisnote`
(l. 364) og `spor/sidefod` (l. 429) **bortfaldt** i stedet for at blive undgået.

---

## Valgt løsning og fravalgt alternativ

**Valgt:** én `.eu-fund-linje` pr. **forekommende** tilstand, med sidens egne
`.v-ja`/`.v-nej`/`.v-ikke` via den delte `H.tilstand()`. Ingen ny CSS-klasse,
ingen ny i18n-nøgle, ingen ny komponent — designfrysen L70 er ikke rørt.

**Fravalgt:** at skelne tilstandene med **prosa alene** (tre forskellige
sætninger uden mærker). Det ville have undgået F2's CSS-kollision, men efterladt
hård begrænsning 5 opfyldt af ord i stedet for af sidens tilstandsalfabet, og
`fund/PLAN-producent.md` P1 foreskriver udtrykkeligt *"den visuelle
tilstandsgrammatik, siden allerede har"*.

## Konfidens pr. punkt

| Punkt | Konfidens | Bevis |
|---|---|---|
| Faktafejlen er væk på alle 25 sider | **høj** | `grep -o "0 af 2" dist/da/producenter/xiaomi/index.html` 1 → **0**; `grep -c v-nej` 0 → **1**, begge sprog. *Kontrafaktisk: var arbejdet forkert, ville `v-nej` stå på 0 og "0 af 2" på 1 — præcis grundmålingen.* |
| Ingen side mistet | **høj** | `grep -l "eu-fund-tal" dist/{da,en}/producenter/*/` = **25 + 25**, uændret |
| Opgørelsen er rigtig | **høj** | Tværsum over alle 25 sider: ja **2** · nej **1** · ikke oplyst **74** · **SUM 77** = antal robotter. Reproducerer PLAN 4.4's tal ad en anden vej |
| Kontrafaktisk (data) | **høj** | `addverb` (2 modeller, begge tavse) viser *"2 af 2 · ikke oplyst"* og **intet nej**. `v-nej` findes på **1 af 25** sider |
| Testen kan fejle | **høj** | Revert-bevis kørt: med `producent.mjs` stashet tilbage fejler **7 af 8** påstande, exit 1. 76.7 er grøn i begge tilstande med vilje |
| Byg og validator uændrede | **høj** | `build` 216 sider · `validate` **77 fil(er) · 0 fejl · 1 advarsler** — identisk med grundmålingen |
| Test 09's 4c holder | **middel** | Suiten kunne **ikke** køres (se nedenfor). Jeg replikerede 4c's regex ordret: **BESTÅET** på første mappe (`addverb`, *"2 af 2"*) og 0 sider uden match |
| Analysens fem fund | **høj** | Hvert med DESIGN.md-linjenummer og en genkørbar kommando; F2 gentaget på to uafhængige apparater |
| Suitens samlede tal | **lav — ikke målt** | Se "Punkter, jeg ikke nåede" |

## Målinger som tal

```
grundmaaling (foer alt):  validate 77/0/1 · build 216 sider · 1111 tal med kilde, 0 uden
efter leverance A:        validate 77/0/1 · build 216 sider · 1111 tal med kilde, 0 uden
i18n-symmetri foer/efter: kun da [] · kun en []   (0 i18n-filer aendret)
git diff --shortstat == git diff -w --shortstat   (ingen formatter har koert)
test 76 isoleret:         8 bestaaet / 0 fejlet
test 76 mod GAMMEL kode:  1 bestaaet / 7 fejlet   (revert-bevis)
filer aendret vs merge-base: 4 (producent.mjs, 76-produkort.mjs, ANALYSE, BRIEF)
```

## Usikkerheder

- **Jeg kørte `tools/build.mjs` én gang, mens mine to underagenter læste
  `dist/`** — præcis den fælde, jeg selv havde forbudt dem. Bygget er
  deterministisk og outputtet efterprøvet bagefter (52 `eu-fund-linje`-elementer,
  213 sider, git rent), men *"lav risiko"* er et skøn, ikke en måling.
- **F2's rettelse er målt, men ikke anvendt.** Om den ER den rigtige rettelse er
  en designbeslutning, ikke min — `generator.css` ejes af `spor/testvend`.
- Om *"pressefotos"* i STATUS.md:375 er en snævrere kategori end *"billeder"* i
  CLAUDE.md's begrænsning 3, kan jeg ikke afgøre. Jeg har kun noteret modsigelsen.

## Nye fælder og opdagelser

1. **Den delte Playwright-browser er en fælde mellem forælder og underagenter.**
   `browser_navigate` meldte ANYbotics; `location.href` var stadig Xiaomi og
   senere producentindekset, fordi mine to underagenter navigerede i **samme**
   instans. Fejlen så ud som et ægte nul (*"intet v-ja fundet"*) og ville aldrig
   have udløst en fejljagt. **Læs altid `location.href` i SAMME `evaluate`-kald
   som målingen**, eller brug en isoleret instans.
2. **`detect.mjs`'s degradering er værre end CLAUDE.md's tal.** Målt mod en
   kontrolside med ~10 bevidste fejl fandt den **1** — kun den rene
   regex-regel. Den så contrast, skriftgulv, `alt`, overskriftsspring, tomme
   knapper og faste bredder passere.
3. **Briefets `grep -c ... | wc -l` måler antal FILER, ikke antal træffere.**
   Den gav 25 og var rigtig — men kun fordi alle 25 sider havde elementet. Med
   én side uden ville den stadig have sagt 25. `grep -l` er det rigtige.
4. **En færdigoversat, ubrugt i18n-nøgle er et fund værd at lede efter FØR man
   skriver en ny.** Tre nøgler lå klar; briefet, planen og jeg antog alle, at der
   skulle skrives nye. Det fjernede en hel kollisionsrisiko.
5. **DESIGN.md kan føre en levende komponent som slettet** (analysens F1). Det
   er en fejltype, ingen test fanger, fordi filen ikke er kode.

## Punkter i briefet, jeg ikke nåede

- **`node tests/koer.mjs` blev ALDRIG kørt — kommandoen blev nægtet af
  tilladelsessystemet.** Jeg forsøgte én gang og gik ikke uden om. Briefets
  forudsigelse (1691/8 fra Å150) er derfor **hverken be- eller afkræftet**, og
  jeg kan ikke udelukke, at test 76 kolliderer med suitens fælles kørsel.
  **Orkestratoren skal køre suiten før flet.** Det, jeg kunne måle uden den, står
  ovenfor: 76 isoleret 8/0, revert-bevis 7 fejl, og 09's 4c replikeret.
- **Kun 1440 px og 390 px er målt af mig selv**; 768 px lå hos Assessment B.
- Jeg har ikke efterprøvet, om `.eu-fund-linje`s gentagelse påvirker
  producentindekset — den flade bruger ikke komponenten.
