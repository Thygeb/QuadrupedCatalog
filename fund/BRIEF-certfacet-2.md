# BRIEF — certfacet, punkt 4 og 5, og de seks assertions der skal VENDES

**Model: sonnet.** **Worktree:** `C:\Praktik\websites\udstilling-wt-cert2`,
gren `spor/certfacet` med `main` flettet ind (ingen konflikter).

**Din første handling: kald `spor`-skillen.** Lykkes kaldet ikke fra worktreen,
så læs `.claude/skills/spor/SKILL.md` fra disk og **skriv i rapporten, at du
gjorde det**. Kald `fejljagt`, hvis noget opfører sig uventet.

**Sporet døde på en session-grænse i eftermiddags. Fem commits ligger i grenen
og er dit eget arbejde** — punkt 1, 2 og 3 er færdige.

---

## Punkt 0 — GRUNDMÅLING, din første kommando efter skill-kaldet

```
node tools/validate.mjs
node tools/build.mjs
node tests/koer.mjs
```

**Rækkefølgen er ikke valgfri.** Testene læser fra `dist/`, så et manglende byg
giver ~16 testfejl med tekster som *"der ER bygget sider at måle på"* — det ser
ud som seksten ægte fejl og er én manglende mappe. **Fabrikantbillederne er
allerede kopieret ind** (610 filer i `assets/fotos/fabrikant/`); rør dem ikke.

**Orkestratorens tal, en PÅSTAND:** validate **77/0/1**, build **216 sider**,
og suiten skulle give **6 røde**: `35.12.{da,en}.{ja,nej,uoplyst}`.
**Måler du et andet antal røde, så STOP og meld** frem for at rette videre.

**DISKEN ER PRESSET: ~7 GB fri, og én suitekørsel bruger ~2,8 GB.** Kør
`tests/koer.mjs` **så få gange som muligt** — grundmålingen, og én gang til
sidst. Bruger du den til mellemtjek, så brug i stedet `node tools/build.mjs`
plus `grep` i `dist/`.

---

## Punkt 1 — de seks røde assertions VENDES. Dette er sporets vigtigste punkt

**Fil: `tests/dele/35-typeskilt-katalog.mjs`, linje ~153-172.** De seks
asserterer på den gamle facet med tre CE-tilstande:

```js
ok(`35.12.${sprog}.ja: CE "ja" er en almindelig raekke (grundform, intet modifier)`,
  /<div class="rk"><input class="rk__felt f-ce" type="checkbox" id="f-ce-ja"/.test(html));
```

`id="f-ce-ja"`, `id="f-ce-nej"` og `id="f-ce-ikke_oplyst"` findes ikke mere.
**Målt af orkestratoren i `dist/da/index.html` på DENNE gren**, id'erne er nu:

```
id="f-ce-ce"   id="f-ce-fcc"   id="f-ce-ul"   id="f-ce-ccc"
```

### Hvorfor de ikke må slettes

**Kommentaren over dem, linje ~152-160, er arkivet for en beslutning.** Den
citerer L89 og **hård begrænsning 5** ordret: *"et filter må aldrig straffe
ærlig tavshed"*, og forklarer, at de tre tilstande skal have **tre forskellige
dom-signaturer**, så de kan SES som forskellige og ikke kun tælles.

**L90 (JPK 3. sep 2026) ophæver FORMEN, ikke begrundelsen.** Certificeringerne
samles nu i én gruppe med fire mærker. **Konsekvensen, JPK bad udtrykkeligt om
at få skrevet ned:** *"nej"* og *"ikke oplyst"* **kollapser inde i filtret** —
det er prisen ved formen — **og derfor skal de to tilstande stadig ses
forskellige ud på robotsiden og producentsiden.**

### Hvad de seks skal bevise i stedet — tre ting, ikke to

**a) At gruppen findes med sine fire mærker.** Ét ok pr. sprog:
alle fire id'er ovenfor findes, og de ligger i `data-facetgruppe="ce"`.

**b) At hård begrænsning 5 stadig holder DÉR, hvor den nu gælder.** Ét ok pr.
sprog: robotsiderne viser stadig tre forskellige tilstande.
**Målt af orkestratoren på denne gren:** `v-nej` findes på **9** robotsider,
`v-ikke` på **77**. Skriv assertionen mod `dist/<sprog>/robotter/`, ikke mod
katalogsiden. **Tallene 9 og 77 er FORUDSIGELSER — mål dem selv og brug dine.**

**c) Et revert-bevis pr. sprog**, i samme form som det, der allerede står i
filen: fjern det bærende mønster og vis, at vagten falder rød. Uden det kan en
grøn test ikke skelnes fra en test, der altid består.

**Kommentaren over blokken skal omskrives**, så den siger: L89's form er
ophævet af L90, begrundelsen er den samme, og tilstandsforskellen er flyttet
fra katalogsiden til robotsiden. **Citér L90 med dato og JPK's ord.**
En efterfølger skal kunne læse den og se, at intet blev opgivet.

**Acceptkriterium 1:** `node tests/koer.mjs` viser **0 fejlede**, og
`grep -c "35.12" tests/dele/35-typeskilt-katalog.mjs` giver **mindst 6**
(giver i dag 6). **Færre end 6 betyder, at du har slettet frem for at vende.**

---

## Punkt 2 — `tests/dele/77-certfacet.mjs`, ny fil

En selvstændig vagt for L90's facet, efter kontrakten i `tests/LAESMIG.md`.
**Nummer 77 er ledigt** — målt af orkestratoren: main topper på 76, 79 er
`spor/fotofod`s, 80 er den anden sessions. **77 og 78 er dine.**

Den skal mindst bevise: gruppen `ce` har **præcis fire** valg · hver af de fire
kan vælges og filtrerer på, om mærket er **oplyst** · **UL og CCC står der,
selvom de i dag matcher 0 robotter** — JPK's værn nummer 1, ordret: *et
filtervalg, der forsvinder ved nul, siger "vi har ikke spurgt", når sandheden
er "vi har spurgt alle 77, og ingen oplyser det"*. Skriv den begrundelse ind
som kommentar.

**Acceptkriterium 2:** filen findes, indgår i kørslen, og suitens samlede antal
stiger med præcis dine nye assertions.

---

## Punkt 3 — døde i18n-nøgler og `tests/dele/78-doed-i18n.mjs`

Punkt 2 i det gamle brief indførte nye nøgler; de gamle CE-tilstandsnøgler kan
være døde nu. **Find dem ved at måle**, ikke ved at huske: for hver nøgle i
`data/i18n/da.json`, tæl forekomster i `tools/` og `assets/`. **Rapportér
listen FØR du sletter noget**, og slet kun nøgler med 0 forekomster.

Test 78 skal fange det generelt: **ingen nøgle i `da.json` må være ubrugt**, og
`da.json` og `en.json` skal have **samme nøglesæt**.

**Acceptkriterium 3:** `node tests/koer.mjs` giver 0 fejlede, og test 78 falder
rød, hvis du midlertidigt tilføjer en testnøgle, ingen bruger. **Vis det
revert-bevis i rapporten.**

---

## Filejerskab

**Du ejer:** `tests/dele/35-typeskilt-katalog.mjs`, `tests/dele/77-*.mjs` (ny),
`tests/dele/78-*.mjs` (ny), `data/i18n/{da,en}.json`, `fund/FUND-certfacet.md`.

**Du må IKKE røre:** `tools/skabelon/*` (punkt 1-3 er færdige — ændrer du dem,
ændrer du en leverance, JPK allerede har set), `assets/`, `data/robots/`,
`DESIGN.md`, `STATUS.md`, `CLAUDE.md`, og **ingen anden fil i `tests/dele/`.**

**Samtidige spor:** `spor/prodtest` ejer `tests/dele/{12,14,30,31,74}`,
`spor/fotofod` ejer `tests/dele/79` og `assets/`, den anden session ejer
`fund/f2*`, `db/` og `tests/dele/80`. **Nul overlap med dig, målt.**

---

## Miljø

- **Egen port, hvis nødvendig: 8204.** Aldrig 8080.
- **`node.exe` læser `/c/...` som `C:\c\...`** og melder succes. Brug `C:/...`.
- **`grep -P` virker ikke her** (*"supports only unibyte and UTF-8 locales"*).
  Brug `awk` eller node.
- **Kør ikke `rm -rf` på `tests/.tmp-koersel`** — den er på projektets
  deny-liste. Er disken fuld, så MELD det; ryd ikke uden om.

---

## Commits og rapport

**Commit efter hvert punkt**, i rækkefølgen 1 → 2 → 3. Tre spor er døet midt i
arbejdet på tre dage; dit eget er ét af dem.

Rapporten er `fund/FUND-certfacet.md` (ikke genbrug af et navn — det gamle
brief hedder `BRIEF-certfacet.md`). Højst 60 linjer plus skillens to
obligatoriske sektioner.

**Først en tabel over de seks vendte assertions: hvad de krævede før, hvad de
kræver nu.** Derefter målingerne. **Skriv udtrykkeligt, hvis du er i tvivl om,
at en vending beviser lige så meget som før** — en assertion, der er blevet
svagere, uden at nogen opdagede det, er værre end en rød test.

**Én ting mere, orkestratoren ikke kunne afgøre:** Å154 påstår, at katalogsiden
har **10** facetgrupper. Jeg måler **9** `data-facetgruppe`-værdier i
`dist/da/index.html`. **Mål det selv og skriv det rigtige tal i rapporten** —
det er enten min fejl eller en manglende gruppe, og forskellen betyder noget.
