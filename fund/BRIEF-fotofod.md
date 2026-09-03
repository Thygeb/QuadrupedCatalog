# BRIEF — fotokreditten flyttes ind i sin egen kolonne

**Gren:** `spor/fotofod` · **Worktree:** `C:/Praktik/websites/udstilling-wt-fotofod`
**Model:** sonnet · **Port, hvis du maaler i browser:** 8153 (aldrig 8080)
**Forventet pris:** ~120k tokens. Bliver det markant dyrere, saa meld det og fortsaet.

**Kald `spor`-skillen som din FOERSTE handling** — den baerer grundmaalingen,
kontrollinjen, skrive-graensen, filejerskabet, selv-efterproevningen, rapportformen
og miljoefaelderne. Lykkes kaldet ikke fra din worktree, saa laes
`.claude/skills/spor/SKILL.md` fra disk og **skriv i rapporten, at du gjorde det**.

**Kald derefter `design`-skillen.** Du flytter et element paa en bygget flade, saa
den gaelder. Den er kortet til `DESIGN.md`. **Fladens MODE er Operate** —
sammenligningssiden er et sted, hvor den besoegende loeser en opgave.

**Designfrysen L70 er UDTRYKKELIGT LOEFTET FOR NETOP DENNE OPGAVE af JPK
3. sep 2026**, som er frysens egen ophavsmand. Hans ord: *"Fodnoter til foto skal
vaere i deres respektive kollonner."* **Loeftet gaelder KUN fotokreditten.** Ser du
noget andet, du gerne vil rette paa fladen, saa NOTÉR det i rapporten og lad det
staa. Det er stadig frosset.

---

## AENDRINGEN, i UI-termer — det er dette, JPK skal kunne se

**I dag** staar fotokreditten som **én sammenhaengende saetning** under hele
tabellens bredde, hvor laeseren selv skal koble producentnavn til kolonne:

```
| CCC stated | not stated | not stated | not stated |
+--------------------------------------------------+
 Manufacturer's own photo. Galileo (Tianjin) (Retrieved 2026-08-26) ·
 WEILAN (Retrieved 2026-08-19) · Unitree Robotics (Retrieved 2026-08-19)
```

**Efter dit spor** staar hver kredit under sin egen robot, i samme spalte som
robottens foto og navn:

```
| CCC stated | not stated      | not stated      | not stated      |
+------------+-----------------+-----------------+-----------------+
|            | Galileo         | WEILAN          | Unitree Robotics|
|            | (Tianjin)       | (Retrieved      | (Retrieved      |
|            | (Retrieved      |  2026-08-19)    |  2026-08-19)    |
|            |  2026-08-26)    |                 |                 |
```

Den faelles indledning — *"Manufacturer's own photo."* / *"Fotos paa kortene er
producenternes egne."* — hoerer stadig kun ét sted; **du bestemmer hvor**, men skriv
dit valg og din begrundelse. Den maa ikke gentages i hver kolonne.

---

## Den tidligere beslutning, du OPHAEVER — citér den, slet den ikke

`assets/sammenligning.js:422-426` baerer i dag denne begrundelse:

```
  /* Fotokreditten. Staar UDEN FOR <table> (et <p> efter den), fordi den
     handler om siden, ikke om en raekke eller en spalte - og fordi en
     tekstblok inde i en tabel ville staa i en celle, den ikke hoerer til.
     Kun de faktisk viste fotos krediteres, med producentnavn og hentedato,
     saa linjen er sand for netop den trio, laeseren har valgt. */
```

**Foerste halvdel er modsagt af JPK:** kreditten handler netop om en spalte, for
hvert foto tilhoerer praecis én robot. **Anden halvdel besvares af `<tfoot>`**, som
er det element, der findes til indhold pr. kolonne under en tabel — ikke en
tekstblok i en tilfaeldig celle.

**Sidste saetning gaelder UAENDRET og er et krav:** kun de faktisk viste fotos
krediteres, med producentnavn og hentedato, saa linjen er sand for netop den trio,
laeseren har valgt. **En robot uden fabrikantfoto faar en tom celle, ikke en
opfundet kredit.**

**Skriv den nye begrundelse ind i kommentaren** — hvad der gaelder nu, og at JPK
aendrede den 3. sep 2026. En slettet begrundelse efterlader ingen forklaring paa,
hvorfor koden ser ud, som den goer.

---

## GRUNDMAALING — din foerste kommando, foer du aendrer noget

Orkestratoren maalte dette paa `main` 996a7bf umiddelbart foer afsendelse:

```
node tools/validate.mjs     77 fil(er) · 0 fejl · 1 advarsler
node tools/build.mjs        216 sider
node tests/koer.mjs         1744 bestaaet / 0 fejlet
grep -c saml-fotoophav assets/sammenligning.js      1
grep -c tfoot assets/sammenligning.js               0
grep -c saml-fotoophav assets/generator.css         1
```

**Genmaal dem og skriv dine tal.** Afviger noget, er det et fund — meld det og
arbejd videre. **Rettelsen mod mine tal er forkert.**

`assets/fotos/fabrikant/` er kopieret ind (**610 filer**, maalt). Mangler de, giver
`validate` 54 fejl, som IKKE er dine.

---

## Filejerskab — din graense

**Du ejer og maa aendre:**

```
assets/sammenligning.js            (punkt 1)
assets/generator.css               (punkt 2 — kun .saml-fotoophav-reglen og det, der afloeser den)
tests/dele/79-fotofod.mjs          (punkt 3 — NY fil, opret den)
fund/BRIEF-fotofod.md              (denne fil)
fund/FUND-fotofod.md               (din rapport)
```

**Du maa IKKE roere:** `assets/system.css`, `tools/skabelon/sammenligning.mjs`,
`tools/skabelon/side.mjs`, `tools/skabelon/katalog.mjs`, `data/i18n/*`, nogen
eksisterende testfil, eller hovedrepoet `c:/Praktik/websites/udstilling`.

**To spor koerer samtidig:** `spor/certfacet` ejer `side.mjs`, `katalog.mjs`, begge
i18n-filer og tests 77-78. `spor/designplan` ejer `DESIGN.md`. **Nul overlap med
dig** — men det er derfor, du ikke maa roere i18n eller `system.css`.

**Har du brug for en ny i18n-noegle: STOP og meld det.** Filerne er ejet af et andet
spor. Genbrug en eksisterende — `billede_uden_tilladelse` (*"Manufacturer's own
photo."*) findes i `en.json:281`, og `DATA.tekst.hentet` og `DATA.tekst.foto_ophav`
er allerede i brug i funktionen.

---

## Punkt 1 — kreditten bygges pr. kolonne i en `<tfoot>`

**Filen:** `assets/sammenligning.js:427-437`. Det staar der nu:

```js
  function fotoophavHTML(robotter) {
    var dele = [];
    for (var i = 0; i < robotter.length; i++) {
      var f = robotter[i].foto;
      if (!f || f.ophav !== 'fabrikant') continue;
      dele.push(robotter[i].producent + (f.hentet ? ' (' + DATA.tekst.hentet + ' ' + f.hentet + ')' : ''));
    }
    if (!dele.length) return '';
    return '<p class="saml-fotoophav">' + esc(DATA.tekst.foto_ophav) + ' '
      + esc(dele.join(' · ')) + '</p>';
  }
```

**Oensket resultat:** en `<tfoot>` i tabellen med **én raekke**, hvor
- **foerste celle er tom** og svarer til etiketspalten. Tabellen har en
  etiketkolonne: `sammenligning.js:562` bygger `<th scope="row"
  role="rowheader" class="saml-raekke__navn">`, og hjoernecellen ved `:372` er
  bevidst et `<td class="specimen-hoved__hjoerne">` og IKKE et `<th>` — **foelg det
  moenster**, saa foden ikke indfoerer en overskrift uden kolonne.
- **derefter én celle pr. robot**, i **samme raekkefoelge** som `<thead>`s
  `<th scope="col" class="specimen">` (`:314`).

**Struktur, du skal foelge:** `<thead>` bygges ved `:370` som
`'<thead class="specimen-hoved" role="rowgroup">'`. Byg `<tfoot>` med tilsvarende
`role="rowgroup"` og `role="row"`/`role="cell"` paa samme maade — **baelte og
seler-moenstret er sidens egen konvention**, ikke noget du opfinder.

**Antallet af spalter er allerede beregnet i filen:** variablen `spalter` bruges ved
`:571`. Genbrug den frem for at taelle om.

**KRAV, arvet fra den gamle kommentar:** kun robotter, hvis foto har
`ophav === 'fabrikant'`, krediteres. En robot uden faar en **tom celle**. Er ingen af
de viste robotter fabrikantfotograferet, skal hele `<tfoot>` udeblive — ikke staa som
en tom raekke.

**Acceptkriterium 1** (kildemaaling, som kan koeres uden browser):
```
grep -c "tfoot" assets/sammenligning.js          # i dag 0, skal give >= 2 (aabne + lukke)
grep -c "saml-fotoophav" assets/sammenligning.js # i dag 1
```
Skriv det faktiske tal for begge.

**Acceptkriterium 1b — det, der beviser, at det VIRKER, og det kraever browseren:**
start din egen server paa **8153** og maal med Playwright, at antallet af celler i
`tfoot tr` er **1 + antallet af viste robotter**, og at hver celles tekst staar under
den rigtige robot. **Verificér serveren mod disken foerst** — vaelg en streng, der kun
findes i din udgave, og sammenlign `curl` mod filen. En server er et maaleapparat.

**HVORFOR:** en kredit, der spaender alle kolonner, tvinger laeseren til selv at
koble producentnavn til robot. Hun har lige valgt tre robotter for at slippe for
netop den slags arbejde.

---

## Punkt 2 — CSS'en, og den skal vaere saa lille som muligt

`assets/generator.css` har **1** regel for `.saml-fotoophav`. Afgoer, om den skal
blive, aendres eller afloeses, og skriv begrundelsen.

**Frysen er kun loeftet for fotokreditten.** Roer ingen anden regel. Faar du brug for
at aendre noget uden for foden — kolonnebredder, tabellens layout, en farve — saa
**STOP og meld det**; saa er opgaven stoerre, end JPK har givet lov til.

**Brug DESIGN.md's ottetalsskala** (`--r1`…`--r9` = 4/8/12/16/24/32/48/64/96) til
ethvert nyt rum. `design`-skillen siger, hvor i filen det staar. **Et rum, der ikke
er et trin paa skalaen, er en fejl** — det er praecis den fejl, `ANALYSE-produkort.md`
hul H4 fandt et andet sted paa sitet.

**Acceptkriterium 2:** skriv antallet af CSS-linjer, du tilfoejede og fjernede, og
bekraeft med `git diff --stat`, at du ikke roerte `assets/system.css`.

---

## Punkt 3 — ny testfil `tests/dele/79-fotofod.mjs`

Den registrerer sig selv: `tests/koer.mjs:59-62` finder alt, der matcher
`^\d\d-.*\.mjs$`. Foelg kontrakten i `tests/LAESMIG.md`.

**FAELDE, du skal loese foerst, og den er hele grunden til, at dette punkt er svaert:**
matricen bygges **klientside** af `sammenligning.js`. Det byggede HTML i
`dist/da/sammenligning/index.html` indeholder **0** forekomster af `<table>` —
orkestratoren maalte det og drog foerst den forkerte konklusion, at siden manglede
tabelsemantik. **Den har den; den bygges bare i browseren.**

En test, der `grep`'er i `dist/`, kan altsaa **ikke** se dit arbejde. Vaelg selv
formen og **skriv din begrundelse**: enten en kildetest mod `assets/sammenligning.js`
(billig, men beviser kun at koden findes), eller en DOM-test. Se, hvad de
eksisterende tests for denne flade goer, foer du vaelger.

Mindst disse paastande, hver med **revert-bevis** (samme moenster skal AFVISE den
gamle tilstand — se `tests/dele/76-produkort.mjs` for formen):

1. Foden har én celle pr. vist robot plus én tom etiketcelle.
2. En robot uden fabrikantfoto giver en **tom** celle — ikke en opfundet kredit.
3. Er ingen af de viste fotos fabrikantens, udebliver `<tfoot>` helt.

**Acceptkriterium 3:** `node tests/koer.mjs` groent, og antallet er **1744 + dine nye
paastande**. Skriv det faktiske tal — ikke et gaet.

---

## Raekkefoelge og commits — dette er en SKRIVE-graense

**Skriv KUN punkt 1's kode, maal den, commit — og foerst derefter punkt 2.** Ikke
"skriv alt og commit i portioner": to agenter i traek gjorde det sidste 25. aug trods
eksplicit instruks, og saa bar punkt 1's commit ogsaa punkt 3's uefterproevede kode.

Raekkefoelgen er 1 → 2 → 3.

---

## Luk det, du startede

**Din server paa 8153 skal vaere doed, foer du rapporterer**, og skriv i rapporten,
at du lukkede den. Fem forfoedreloese servere fra doede spor koerte samtidig 1. sep og
laaste worktree-mapper, saa de ikke kunne slettes.

---

## Rapporten

`fund/FUND-fotofod.md`, hoejst 60 linjer plus skillens to obligatoriske sektioner.
**Foerst en foer-og-efter i UI-termer** — hvad JPK ser under matricen bagefter.
Derefter maalingerne.

**Skriv udtrykkeligt:** hvor du placerede den faelles indledning og hvorfor, hvilken
testform du valgte og hvorfor, og hvad du saa paa fladen, som du IKKE rettede fordi
frysen stadig gaelder for det.

**Briefets fakta er paastande.** Afviger noget, du maaler, saa rapportér afvigelsen —
det er leverance, ikke ulydighed. Orkestratoren kontrolleres ellers af ingen.
