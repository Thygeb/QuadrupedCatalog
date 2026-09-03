# BRIEF — certificeringsfiltret: ÉN gruppe med fire maerker

**Gren:** `spor/certfacet` · **Worktree:** `C:/Praktik/websites/udstilling-wt-certfacet`
**Model:** sonnet · **Port, hvis du maaler i browser:** 8151 (aldrig 8080)
**Forventet pris:** ~200k tokens. Bliver det markant dyrere, saa meld det og fortsaet.

**Kald `spor`-skillen som din FOERSTE handling** — den baerer grundmaalingen,
skrive-graensen, kontrollinjen, filejerskabet, selv-efterproevningen, rapportformen
og miljoefaelderne. Lykkes kaldet ikke fra din worktree, saa laes
`.claude/skills/spor/SKILL.md` fra disk og **skriv i rapporten, at du gjorde det**.

**Oevrige skills:** `robotdata` (du laeser 77 robotposter — den baerer 33-feltsskemaet
og de ti haarde regler). `fejljagt`, hvis et tal opfoerer sig uventet.
**`design` er FRAVALGT** med denne begrundelse: du tilfoejer valg til en facetgruppe,
der allerede findes, med klasser der allerede findes, og du roerer ingen CSS.
**Bliver du i tvivl — eller faar du brug for en ny klasse — saa kald den og STOP**;
saa er det designfrysen L70, ikke dit spor.

---

## JPK'S BESLUTNING, og den er aendret siden AA149 — laes denne foerst

**JPK, 3. sep 2026, ordret: *"VI ENIGE OM AT Certificeringer SAMLES UNDER ET
FILTERGRUPPE"*.**

AA149/L89 sagde **fire selvstaendige facetter**. Det er **OPHAEVET**. Byg ÉN gruppe.

**Formen, bekraeftet af JPK samme dag:**

| | I dag | Efter dit spor |
|---|---|---|
| Filtergrupper paa katalogsiden | **9** | **10** |
| Gruppens navn | *Certificering* (findes, med 3 CE-valg) | *Certificering* — samme gruppe |
| Valg i gruppen | 3 (CE ja/nej/ikke oplyst) | **4: CE · FCC · UL · CCC** |
| Hvad et valg goer | filtrerer paa CE-tilstand | viser kun robotter, hvor **maerket er oplyst** |
| Tal ved hvert valg | — | CE **2** · FCC **2** · UL **0** · CCC **0** |

---

## De to ting, JPK udtrykkeligt har bedt om som VAERN

**1. UL og CCC viser 0, og de SKAL staa der alligevel.**
Et filtervalg, der forsvinder naar tallet er nul, lyver: det siger *"vi har ikke
spurgt"*, naar sandheden er *"vi har spurgt alle 77, og ingen oplyser det"*. Det er
haard begraensning 5 — **"ikke oplyst", "nej" og "0" er tre forskellige tilstande** —
i ny forklaedning. Skjul dem ikke, og lad dem ikke falde ud af et `.filter()`.

**2. "Nej" og "ikke oplyst" kollapser INDE i filtret — det er prisen ved formen.**
JPK har valgt den bevidst. Men derfor skal de to tilstande **stadig se forskellige ud
paa robotsiden og paa producentsiden**, og **du skal efterproeve det eksplicit** i
punkt 4, saa vi ikke taber skelnen begge steder paa én gang.

---

## GRUNDMAALING — din foerste kommando, foer du aendrer noget

Orkestratoren maalte dette paa `main` 996a7bf umiddelbart foer afsendelse:

```
node tools/validate.mjs     77 fil(er) · 0 fejl · 1 advarsler
node tools/build.mjs        216 sider
node tests/koer.mjs         1744 bestaaet / 0 fejlet
```

**Genmaal alle tre og skriv dine tal.** Afviger noget, er det et fund — meld det og
arbejd videre. **Rettelsen mod mine tal er forkert.**

`assets/fotos/fabrikant/` er kopieret ind i din worktree (**610 filer**, maalt).
Mangler de, giver `validate` 54 fejl, som IKKE er dine.

---

## Filejerskab — din graense

**Du ejer og maa aendre:**

```
tools/skabelon/side.mjs            (punkt 1)
tools/skabelon/katalog.mjs         (punkt 2) — MEN IKKE linje 1439-1474, se nedenfor
data/i18n/da.json                  (punkt 3 og 5)
data/i18n/en.json                  (punkt 3 og 5)
tests/dele/77-certfacet.mjs        (punkt 4 — NY fil, opret den)
tests/dele/78-doed-i18n.mjs        (punkt 5 — NY fil, opret den)
fund/BRIEF-certfacet.md            (denne fil)
fund/FUND-certfacet.md             (din rapport)
```

**Du maa IKKE roere:** `assets/system.css`, `assets/generator.css`,
`assets/katalog.js`, `DESIGN.md`, `data/robots/*.yaml`, nogen eksisterende testfil,
eller hovedrepoet `c:/Praktik/websites/udstilling`.

**`katalog.mjs:1439-1474` er klaebebarens strengbaerer** og tilhoerer et spor, der
sendes efter dig. Filen er din, men **det omraade er det ikke.** Roer det ikke.

**Samtidigt spor:** `spor/designplan` (opus) ejer **kun `DESIGN.md`**. Nul overlap.

---

## Punkt 1 — generalisér `ceTilstand()` til at kunne tage et hvilket som helst certfelt

**Filen:** `tools/skabelon/side.mjs:1634`. Det staar der nu:

```js
  /** ja / nej / ikke_oplyst for CE - bruges af filtrene. */
  function ceTilstand(robot) {
    const ce = robot.felter?.ce_oplyst;
    if (ce === undefined) return 'ikke_oplyst';
    if (typeof ce === 'string') return tilstandAf(ce) ?? 'ikke_oplyst';
    const t0 = tilstandAf(ce.vaerdi);
    if (t0) return t0 === 'nej' ? 'nej' : 'ikke_oplyst';
    return ce.vaerdi === true ? 'ja' : 'nej';
  }
```

**Oensket resultat:** `certTilstand(robot, felt)`, hvor `felt` er `'ce_oplyst'`,
`'fcc_oplyst'`, `'ul_oplyst'` eller `'ccc_oplyst'`, og som ellers opfoerer sig
**praecis** som i dag. Behold `ceTilstand` som en tynd indpakning
(`certTilstand(robot,'ce_oplyst')`), saa intet eksisterende kald aendrer adfaerd.
Den er eksporteret ved `side.mjs:1941` — eksportér ogsaa den nye.

**FAELDEN, og orkestratoren faldt selv i den, saa tag den alvorligt:** felterne findes
i **to former** i YAML'en. Blokform er `ce_oplyst:` med `vaerdi:`/`kilde:` under sig;
inline er en vaerdi paa samme linje.

| Felt | Blokform | Inline | I alt |
|---|---|---|---|
| `ce_oplyst` | **10** | 67 | 77 |
| `fcc_oplyst` | **2** | 75 | 77 |
| `ul_oplyst` | 0 | 77 | 77 |
| `ccc_oplyst` | 0 | 77 | 77 |

Et hurtigt regex, der kun laeser inline-form, giver **0 CE-godkendte robotter** i
stedet for 2 — og 0 ser fuldstaendig plausibelt ud. **Den nuvaerende funktion
haandterer begge former; det er hele grunden til, at den ser ud som den goer.**

**STATUS.md AA153 siger 7 blokform-robotter. Det tal er FORKERT** — orkestratoren har
genmaalt med sumkontrol (blok + inline = 77 for alle fire felter). **Maal det selv**
og skriv dit tal. Er du uenig, er det et fund.

**Tilstandene, orkestratoren maalte** (blokform haandteret, sumkontrol bestaaet — og
CE-raekken reproducerer AA149's 2/1/74 ad en uafhaengig vej):

| Felt | oplyst | nej | ikke oplyst | SUM |
|---|---|---|---|---|
| `ce_oplyst` | 2 | 1 | 74 | 77 |
| `fcc_oplyst` | 2 | 0 | 75 | 77 |
| `ul_oplyst` | 0 | 0 | 77 | 77 |
| `ccc_oplyst` | 0 | 0 | 77 | 77 |

Det er **forudsigelser**, ikke krav. Maal selv og skriv de faktiske tal.

**Acceptkriterium 1:** `node tests/koer.mjs` giver **mindst 1744 bestaaet / 0 fejlet**
efter punkt 1 alene. Giver i dag: 1744/0. *Kontrafaktisk: braekker du blokformen,
falder mindst én af de eksisterende CE-tests.*

**HVORFOR:** ét filter over fire felter kan ikke bygges paa en funktion, der kun kender ét.

---

## Punkt 2 — udvid den ENE certificeringsgruppe fra tre valg til fire maerker

**Filen:** `tools/skabelon/katalog.mjs:507-512`. Det staar der nu:

```js
      navn: 'ce',
      etiket: t('filter_certificering'),
      mrk: t('filter_certificering_mrk'),
      vaerdier: (r) => [hjaelp.ceTilstand(r)],
      tekst: (v) => t('eu_ce_' + v),
      orden: ['ja', 'nej', 'ikke_oplyst'],
```

**Oensket resultat: SAMME ene gruppe**, men dens vaerdier er nu de fire maerker i
stedet for de tre CE-tilstande. En robot hoerer under `ce`, hvis
`certTilstand(r,'ce_oplyst') === 'ja'`, under `fcc` hvis `fcc_oplyst` er `'ja'`, osv.
En robot kan hoere under flere maerker samtidig, eller ingen.

`orden` skal vaere `['ce','fcc','ul','ccc']` — **fast raekkefoelge, ogsaa naar tallet
er 0.** Det er vaern 1 ovenfor.

**INGEN NY CSS-KLASSE ER NOEDVENDIG.** `katalog.mjs:1129` siger udtrykkeligt om denne
facetfamilie: *"INGEN NY CSS-KLASSE NOEDVENDIG: `.facet--s3` og `.facet--s6` findes
begge allerede"*. **Slaa linjen op og bekraeft den, foer du skriver.** Gruppen gaar fra
3 til 4 valg, saa det er `.facet--s6`-familien, ikke en ny.

**Acceptkriterium 2** — brug `data-facetgruppe="`, IKKE `role="group"`, som giver 0
uanset alt (orkestratoren proevede; det var en forkert maaling, ikke et forkert svar):

```
node -e "const fs=require('fs');const h=fs.readFileSync('dist/da/index.html','utf8');
console.log((h.match(/<details/g)||[]).length+'/'+(h.match(/<details[^>]*data-facetgruppe=\"/g)||[]).length);"
```

**Giver i dag: `10/9`. Skal give `10/9` OGSAA bagefter** — du tilfoejer ingen ny
gruppe, du aendrer indholdet af én. Samme tal for `dist/en/index.html`.

**Acceptkriterium 2b — det, der beviser, at arbejdet virkede:** antallet af valg i
certificeringsgruppen gaar fra **3 til 4**, og deres tekster er CE, FCC, UL, CCC.
Skriv den kommando, du maalte det med, og dens tal foer og efter.

**HVORFOR:** fire certificeringer er ét spoergsmaal — *"hvad er den godkendt til?"* —
ikke fire.

---

## Punkt 3 — i18n-noegler til de tre nye maerker

**Filerne:** `data/i18n/da.json` OG `data/i18n/en.json`. **Begge, i samme commit.**

`filter_certificering` og `filter_certificering_mrk` findes og bliver staaende som
gruppens navn. De **fire maerkers** tekster skal findes i begge filer.

**FCC, UL og CCC er egennavne og oversaettes ikke.** Er du usikker paa en formulering,
saa skriv det i rapporten frem for at gaette. **L25's regel gaelder:** skriv
*"oplyst / ikke oplyst"*, **ALDRIG** *"har / har ikke"*.

**Acceptkriterium 3:**
```
grep -c "filter_fcc\|filter_ul\|filter_ccc" data/i18n/da.json   # i dag 0, skal give >= 3
grep -c "filter_fcc\|filter_ul\|filter_ccc" data/i18n/en.json   # i dag 0, samme tal som da
```
`tests/dele/35:221` vogter, at de to sprogfiler er symmetriske — den skal blive groen.

---

## Punkt 4 — ny testfil `tests/dele/77-certfacet.mjs`

Den registrerer sig selv: `tests/koer.mjs:59-62` finder alt, der matcher
`^\d\d-.*\.mjs$`. Foelg kontrakten i `tests/LAESMIG.md`.

Mindst disse paastande, hver med **revert-bevis** (samme moenster skal AFVISE den
gamle tilstand — se `tests/dele/76-produkort.mjs` for formen):

1. Certificeringsgruppen har **fire** valg, begge sprog, i raekkefoelgen CE, FCC, UL, CCC.
2. **UL og CCC staar der, selv om deres tal er 0.** Vaern 1.
3. `certTilstand` giver samme svar som den gamle `ceTilstand` for alle 77 robotter.
4. **Blokform-robotterne klassificeres rigtigt** — vaelg mindst én af de 10 og pin den.
5. **VAERN 2, og den er vigtig:** *"nej"* og *"ikke oplyst"* ser stadig forskellige ud
   paa robotsiden OG paa producentsiden. Klasserne `.v-nej` og `.v-ikke` findes begge
   i `system.css` (maalt: alle fire tilstandsklasser findes). Filtret kollapser de to;
   **siderne maa ikke.**

**Acceptkriterium 4:** `node tests/koer.mjs` groent, og antallet er **1744 + dine nye
paastande**. Skriv det faktiske tal — ikke et gaet.

---

## Punkt 5 — de doede i18n-noegler, og en test der fanger dem fremover

**Maalt paa main:** **9** af 11 `forside_*`-noegler har nul brug i `tools/`. De er
opkaldt efter en forside, der blev slettet 1. sep (L72); `tools/skabelon/forside.mjs`
findes ikke.

**FAELDE, du skal loese foerst:** min maaling brugte `grep` paa `tools/`, og **grep
skelner ikke mellem kode og kommentar**. `producent.mjs:195-196` NAEVNER
`forside_eu_paastand` i en kommentar, saa min maaling kalder den "i brug", selv om
ingen kode laeser den. **Maal brug i KODE, ikke i tekst**, og skriv hvor mange der
reelt er doede — det kan vaere 9 eller 10.

**Slet de doede noegler fra BEGGE sprogfiler.** `forside_eu_tal` er **i brug** af
`producent.mjs` — den skal blive.

**Byg derefter `tests/dele/78-doed-i18n.mjs`,** som fejler, hvis en i18n-noegle ikke
bruges nogen steder i `tools/`. **`tests/dele/14-afslutning-oprydning.mjs:25` har en
HAARDKODET liste med fire tilladte doede noegler** — laes den, og byg din test, saa de
to ikke modsiger hinanden. **Du ejer ikke fil 14.** Modsiger de hinanden, saa meld det
frem for at aendre 14.

**Acceptkriterium 5:** din nye test fejler mod den nuvaerende tilstand (revert-bevis)
og er groen efter sletningen. Skriv begge tal.

**HVORFOR:** systemet har en test mod doed CSS (`tests/dele/57`) og en beslutning om,
at *"en variant uden brugssted er doed CSS"* — den tanke er aldrig skrevet for
sprogfilerne.

---

## Raekkefoelge og commits — dette er en SKRIVE-graense

**Skriv KUN punkt 1's kode, maal den, commit — og foerst derefter punkt 2.** Ikke
"skriv alt og commit i portioner": to agenter i traek gjorde det sidste 25. aug trods
eksplicit instruks, og saa bar punkt 1's commit ogsaa punkt 3's uefterproevede kode.

Raekkefoelgen er 1 → 2 → 3 → 4 → 5. Punkt 3 foer punkt 4, saa testen har noget at teste.

**Grunden er doed-sikring:** tre spor er doet midt i arbejdet i dette projekt paa tre
dage. Et spor, der doer med commits, kan genoptages.

---

## Rapporten

`fund/FUND-certfacet.md`, hoejst 60 linjer plus skillens to obligatoriske sektioner.
**Foerst en foer-og-efter i UI-termer** — hvad JPK ser paa katalogsiden: gruppens navn,
hvor mange valg, hvad de hedder, hvilket tal der staar ved hvert. Derefter maalingerne.

**Skriv udtrykkeligt:** dit blokform-tal (er det 10?), dine fire tilstandsraekker, dit
doede-noegler-tal (9 eller 10?), og det faktiske testantal.

**Briefets fakta er paastande.** Afviger noget, du maaler, saa rapportér afvigelsen —
det er leverance, ikke ulydighed. Orkestratoren kontrolleres ellers af ingen.
