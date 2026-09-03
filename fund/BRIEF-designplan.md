# BRIEF — den overordnede designplan, som frysen venter paa

**Gren:** `spor/designplan` · **Worktree:** `C:/Praktik/websites/udstilling-wt-designplan`
**Model:** opus · **Port, hvis du maaler i browser:** 8152 (aldrig 8080)
**Forventet pris:** ~300k tokens. Bliver det markant dyrere, saa meld det og fortsaet.

**Kald `spor`-skillen som din FOERSTE handling** — den baerer grundmaalingen,
kontrollinjen, skrive-graensen, filejerskabet, selv-efterproevningen, rapportformen og
miljoefaelderne. Lykkes kaldet ikke fra din worktree, saa laes
`.claude/skills/spor/SKILL.md` fra disk og **skriv i rapporten, at du gjorde det**.

**Kald derefter `design`-skillen.** Den er kortet til `DESIGN.md` — den fil, du skal
skrive i — og den siger, hvilke af filens afsnit der svarer paa hvad. **Laes den, foer
du laeser DESIGN.md**, saa du ikke laeser 834 linjer for at finde 40.

**Oevrige skills, du skal vurdere og skrive dit valg om:**
`impeccable typeset` (typografisk hierarki — se punkt 3), `impeccable critique`
(design-vurdering), `frontend-design`. Plugin-skills svinger fra en worktree; diskstier
som reserve:
```
C:/Users/thyge/.claude/skills/impeccable/SKILL.md
C:/Users/thyge/.claude/plugins/marketplaces/claude-plugins-official/plugins/frontend-design/skills/frontend-design/SKILL.md
```

---

## Hvad du skal levere, i én saetning

**Den overordnede designplan, som designfrysen L70 udtrykkeligt venter paa** — JPK's
ord 1. sep 2026: *"vi skal have en overordnet designplan, inden vi retter noget
design."* Den plan er aldrig blevet skrevet. **Du skriver den.**

**Du skriver den ind i `DESIGN.md`** — projektets designsystem, og den fil JPK peger
paa som sandheden: *"DESIGN.md beskriver hvordan websiden skal være designet, for at
sikre konsistens og standardisering af websidens udseende og funktionalitet."*

---

## Det, der goer dette spor anderledes end alle andre

**Du retter INGEN kode. Ingen CSS. Ingen UI aendrer sig af dit arbejde.**

Du er ogsaa **undtaget frysen paa én maade og bundet af den paa en anden**: du maa
BESLUTTE, hvordan tingene skal se ud, og skrive beslutningen ned. Du maa ikke
UDFOERE den. Hver beslutning skal baere et acceptkriterium, saa den kan sendes videre
som et brief til et byggespor.

**Paletten og skriften er LAAST.** TYPESKILT staar som gaeldende retning. Foreslaa
aldrig en ny palet, en ny skrift eller en ny aera. Det, der er aabent, er **hvor og
hvordan** de eksisterende tokens maa bruges.

---

## GRUNDMAALING — din foerste kommando

Orkestratoren maalte dette paa `main` 996a7bf umiddelbart foer afsendelse:

```
DESIGN.md linjer            (maal selv — den blev aendret i dag, se nedenfor)
DESIGN.md overskrifter      29   (grep -c "^#" DESIGN.md)
"MODE" eller "Operate"       1   (og den ene linje skrev ORKESTRATOREN i dag)
afsnit om producentfladen    0
node tests/koer.mjs       1744 bestaaet / 0 fejlet
```

**Genmaal dem og skriv dine tal.** `assets/fotos/fabrikant/` er kopieret ind (610
filer, maalt), saa `validate` ikke giver 54 falske fejl.

---

## Filejerskab — din graense

**Du ejer og maa aendre:** `DESIGN.md` og `fund/BRIEF-designplan.md` +
`fund/PLAN-design.md` (din leverance, hvis den ikke kan vaere i DESIGN.md) +
`fund/FUND-designplan.md` (din rapport).

**Du maa IKKE roere:** nogen `.css`, `.js`, `.mjs`, `.json`, `.yaml`, nogen testfil,
`CLAUDE.md`, `STATUS.md`, `PRODUCT.md`, eller hovedrepoet.

**Samtidigt spor:** `spor/certfacet` (sonnet) ejer `side.mjs`, `katalog.mjs`, begge
i18n-filer og to nye testfiler. **Nul overlap med dig.**

---

## Laesestof, du SKAL igennem foerst — det meste af arbejdet er allerede maalt

Fire spor har maalt fladerne foer dig. **Din opgave er at TRAEFFE BESLUTNINGER paa
deres maalinger, ikke at maale forfra.** Genmaal kun det, du er uenig i.

| Fil | Hvad den giver dig |
|---|---|
| `fund/ANALYSE-produkort.md` | 5 fund + **13 huller i DESIGN.md**, hvert med linjenummer. Producentfladen, MODE: Read |
| `fund/PLAN-klaebebar.md` | 537 linjer om klaebebaren, MODE: Operate. **JPK har valgt retning B.** §10 lister det, den IKKE kunne afgoere — det er dit |
| `fund/PLAN-producent.md` | Producentfladen i fuld laengde |
| `fund/PLAN-katalog.md`, `PLAN-robotside.md`, `PLAN-sammenligning.md` | De tre oevrige flader |

---

## Punkt 1 — regelen for, hvor `--accent` maa bruges som forgrund

**Det skarpeste fund, og det eneste sted, hvor DESIGN.md i dag foreskriver noget, der
er i strid med en ekstern standard.**

`assets/system.css:343` siger:
```css
:focus-visible{outline:3px solid var(--accent);outline-offset:3px;
```

Orkestratoren har regnet kontrasten med WCAG-formlen paa et apparat, der foerst blev
**valideret mod DESIGN.md's egne offentliggjorte tal** (12,72 og 4,74 — begge
reproduceret praecist):

```
--accent #F2C400 PAA --bund #E8EBED     1,38 : 1     WCAG 1.4.11 kraever 3,0
--accent #F2C400 PAA --daek #1A1D20    10,21 : 1     fint
```

**Paa lyse flader er fokusringen altsaa under kravet paa hvert eneste fokuserbart
element paa sitet.**

**Det afgoerende, som du skal forstaa foer du beslutter:** tallet var KENDT.
`fund/PLAN-klaebebar.md` §11 foerer `--accent` paa `--bund` som *"1,38 (ulovlig,
L76)"*. Men **L76 forbyder accent som TEKSTfarve.** Ingen havde anvendt reglen paa
fokusringen, som er en ikke-tekstlig UI-komponent med et andet kravtal.
**Reglen fandtes; dens raekkevidde var for smal.**

**Din beslutning:** skriv reglen om, saa den daekker ALLE forgrundsbrug af `--accent`
— tekst, kanter, fokusringe, ikoner, markoerer — med et kravtal pr. type og en
laeseretning pr. tal. **Et kontrasttal uden en laeseretning er ikke et tal** (CLAUDE.md).

**Acceptkriterium 1:** reglen kan besvare disse tre spoergsmaal uden fortolkning:
maa accent vaere fokusring paa `--bund`? paa `--daek`? maa den vaere brødtekst nogen
steder? Og den baerer et forslag til, hvad fokusringen SKAL vaere paa lyse flader,
med et beregnet kontrasttal ved siden af — **inden for den laaste palet.**

---

## Punkt 2 — et komponentafsnit om producentfladen

**Maalt:** DESIGN.md's *Komponenter* har ti afsnit. **Ingen af dem er producentfladen.**
Otte klasser, fladen bygger paa, er ubeskrevne: `.eu-fund-linje`, `.eu-fund-tal`,
`.producent-fakta`, `.pnavn`, `.pland`, `.pantal`, `.prod-navne`, `.kort-legende`.

Orkestratoren har allerede rettet den vaerste foelge (DESIGN.md foerte `.eu-fund-linje`
som SLETTET, mens den staar paa 50 sider) og lagt en note om hullet ved *Slettede
komponenter*. **Noten siger, at afsnittet hoerer i din plan. Skriv det.**

**To fund, der skal afgoeres i afsnittet:**

- **F2:** `assets/generator.css:30` er `.eu-fund-linje span{font-size:17px;...}`.
  Specificiteten 0,1,1 slaar `.v-nej`s 0,1,0 i `system.css:646`, saa **samme
  datatilstand tegnes i to stoerrelser paa samme side** — 11px i headeren, 17px i
  EU-afsnittet. Reglen er aeldre end tilstandsmaerkerne. Analysen har en maalt
  kandidatrettelse, som **ikke** er anvendt. **Doem den.**
- **H4:** `.eu-fund-linje` var designet som ÉT element og er nu en LISTE. Maalt ved
  390px: **10px inde i** en tilstandsblok, **0px mellem** to blokke — naerhed
  grupperer modsat af meningen. 0px er ikke et trin paa ottetalsskalaen.

**Acceptkriterium 2:** afsnittet navngiver fladens MODE, beskriver de otte klasser, og
afgoer F2 og H4 med et acceptkriterium hver, saa de kan bygges af et senere spor.

---

## Punkt 3 — MODE skrives ind i systemet, og skriftskalaen faar det trin, den mangler

**MODE:** CLAUDE.md kraever, at fladens mode navngives hver gang. **DESIGN.md naevner
det ét sted — en linje orkestratoren selv skrev i dag.** Designsystemet og
arbejdsreglen taler ikke sammen. Skriv MODE ind som et baerende begreb: hvad Operate
kraever, hvad Read kraever, og hvilken flade der er hvad.

**Skriftskalaen:** `fund/PLAN-klaebebar.md` §10 kunne ikke afgoere navnenes skriftgrad
i klaebebaren: *"14 px findes ikke i DESIGN.md's skala, men 11,5 px (`label`) er for
lille … Der mangler et trin, og at vaelge det er en systembeslutning, ikke en
bjaelkebeslutning."* **Klaebebar-sporet er blokeret paa netop dette. Afgoer det.**

Konteksten, maalt 1. sep: **55 forskellige skriftstoerrelser i stilarkene**, 18 trin
alene i spaendet 9-20px. **Foreslaa ikke en ny skala** — afgoer, om der mangler ét
trin, og hvad det er.

**Acceptkriterium 3:** et byggespor kan laese dit afsnit og vide praecis, hvilken
skriftgrad et robotnavn i klaebebaren skal have, uden at spoerge.

---

## Punkt 4 — planens egen prioritering

Til sidst: en **rangeret liste** over det designarbejde, der nu kan sendes, med ét
acceptkriterium pr. punkt og en note om, hvilke filer hvert punkt ville eje.
Rangér efter **hvad det koster laeseren**, ikke efter hvad der er lettest.

Med i listen skal mindst: F3 (69 % af en producentside handler om de 24 andre
producenter — konstant 1715px uanset producent), F4 (fladen har **0** kildemaerker
mod robotsidernes 72, og bestaar udelukkende af tal), og producentindeksets
**277px skjult ved 390px** med **0 rulleaffordancer**.

**Acceptkriterium 4:** hvert punkt kan sendes som brief uden yderligere afklaring.

---

## Raekkefoelge og commits — en SKRIVE-graense, ikke en commit-graense

**Skriv KUN punkt 1, maal det, commit — foerst derefter punkt 2.** Raekkefoelgen er
1 → 2 → 3 → 4. Punkt 1 foerst, fordi det er det eneste med en levende defekt bagved.

**Grunden er doed-sikring:** tre spor er doet midt i arbejdet i dette projekt paa tre
dage. Et spor, der doer med commits, kan genoptages; et uden er naesten vaerdiloest.

---

## Rapporten

`fund/FUND-designplan.md`, hoejst 60 linjer plus skillens to obligatoriske sektioner.

**Foerst en oversigt i konkrete termer:** hvilke afsnit DESIGN.md fik, hvor mange
beslutninger planen traeffer, og hvilke spor der nu kan sendes. Derefter maalingerne.

**Skriv udtrykkeligt:** hvilke af analysernes fund du er UENIG i, og hvorfor. Fire
agenter rettede orkestratorens fakta paa én dag 2. sep — det er sessionens billigste
kvalitetskontrol. **Briefets fakta er paastande**, mine kontrasttal inklusive.

**Og skriv, hvad du IKKE kunne afgoere.** En designplan, der lader som om alt er
afgjort, er farligere end en, der siger hvor den stopper.
