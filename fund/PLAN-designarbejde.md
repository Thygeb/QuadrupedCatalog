# PLAN — det designarbejde, der kan sendes nu

**Skrevet af `spor/designplan` 3. sep 2026, punkt 4 af `fund/BRIEF-designplan-2.md`.**

**Denne fil er ikke systemet.** [DESIGN.md](../DESIGN.md) er systemet, og et system er
sandt indtil det ændres. Denne liste er sand i en uge. Blandes de to, rådner DESIGN.md
indefra, og næste læser kan ikke se, hvad der er regel og hvad der er ønske.

**Designfrysen L70 gælder stadig, mens du læser dette.** Listen er planen — den løfter
ikke frysen. Frysen løftes af JPK, ikke af en fil.

**Rangeringen er efter hvad det koster LÆSEREN i dag**, ikke efter hvad der er let at
bygge. **Rang er ikke rækkefølge** — se *Rækkefølgen og de to CSS-baner* til sidst, hvor
R5 med vilje ligger sent, selv om den er femte-dyrest for læseren.

**Ni punkter. Fem af dem kan sendes som brief i dag; fire er spærret,** og spærringen
står ved punktet.

| | Punkt | MODE | Kan sendes? |
|---|---|---|---|
| **R1** | Fokusringen er 1,38 : 1 på alle 216 sider | begge | **ja** |
| **R2** | Katalogets første skærm har ingen betjening | Operate | spærret (JPK: indholdsvalg) |
| **R3** | Producentsiden handler mest om de andre producenter | Read | spærret (JPK: modstrid mobil) |
| **R4** | Producentfladen har 0 kildemærker | Read | spærret (mangler en `shape`) |
| **R5** | `impeccable typeset` på hele sitet | begge | **ja** — men planlagt sidst |
| **R6** | Klæbebaren, retning B (SKINNEN) | Operate | spærret (`spor/certfacet`) |
| **R7** | Producentindekset skjuler to kolonner ved 390px | Operate | **ja** |
| **R8** | `.v-ikke` er usynlig på `--bund` | begge | spærret (systembeslutning) |
| **R9** | Skriftgulvet brydes i sammenligningens fotofelt | Operate | **ja** |

---

## R1 — Fokusringen er 1,38 : 1, og den står på hver eneste side

**Hvad læseren betaler i dag:** en tastaturbruger får en fokusring i afmærkningsgul på
lys flade — **1,38 : 1** mod WCAG 1.4.11's krav på 3,0. Den er på **7 af 8** accent-
outlines, og den globale regel (`system.css:343`) gælder **alle 216 byggede sider**.
Det er listens eneste punkt, der gør en flade *ubrugelig* frem for besværlig, og det
eneste, der rammer hver side.

**MODE:** begge. Ringen er en systemkomponent, ikke en flade.

**Beslutningen er allerede truffet og skrevet ud** — DESIGN.md *"DP1b — hvad
fokusringen SKAL være"*: ét semantisk alias `--ring`, standard `--blaek` (12,72 : 1 på
`--bund`), `--accent` kun på mørke flader. Byggesporet opfinder ingenting; det bygger
DP1b's fire linjer CSS og finder de mørke flader.

**Acceptkriterium:** færdig, når
`grep -cE "outline:[^;}]*solid var\(--accent\)" assets/system.css assets/generator.css`
viser **0** for begge filer. *I dag: 6 og 2.* Dertil DESIGN.md's AK1b–AK1d, som står
skrevet dér og ikke gentages her.

**Ejer:** `assets/system.css`, `assets/generator.css`.
**Må ikke røre:** `tools/`, `data/`, nogen skabelon. Rettelsen er ren CSS.

**Spærret af:** intet. **Dette er det punkt, der kan sendes i det øjeblik, JPK løfter
frysen** — og det er tvivlsomt, om det overhovedet er frosset: et brud på WCAG 1.4.11
er en brudt hård begrænsning, og DESIGN.md's egen frysetekst undtager dem. Jeg har
alligevel ladet det stå på listen frem for at kalde det et hastespor, fordi rettelsen
tilføjer et token (`--ring`) og dermed rører en systembeslutning.

**Én måling, sporet skal tage frem for at antage:** `system.css:2557` sætter
`.sammenligning-app .enhedsskift{display:none}`, så ring **2811** kan være uopnåelig.
Skriv svaret i rapporten; ret den under alle omstændigheder.

---

## R2 — Katalogets første skærm indeholder ingen betjening

**Hvad læseren betaler i dag:** hun ruller **en hel skærmhøjde**, før hun møder det
første betjeningselement. Søgefeltets overkant er målt til **y = 1.078 px** ved 1440
(`fund/PLAN-katalog.md` §0, browsermålt), mod en viewporthøjde på 900. Derefter koster
filtergitteret **326 px** på ni titler à 17 px tekst.

Dokumentordenen bekræfter det uden en browser: `.aabning` begynder ved byte **25.143**,
`.plade` (*"Filtrér kataloget"*) ved **37.735**, `.resultat` ved **90.942** i
`dist/da/index.html`. **Betjeningen er nummer to, resultatet nummer tre.**

**MODE: Operate** — og det er præcis derfor, det er dyrt. DESIGN.md's Operate-afsnit
siger, at *"tæthed slår luft"*, og at det **ikke** er en fejl, at betjeningen fylder
toppen af skærmen: *"det er fladens emne."* I dag fylder betjeningen **ingenting** af
den første skærm.

**Planen findes færdig:** `fund/PLAN-katalog.md` §0 + J1 + J2 + J3, med et samlet
målsætningstal: **første betjeningselement over y ≈ 700 ved 1440, filtergitteret
≤ 240 px.**

**Acceptkriterium:** færdig, når et browsermål ved 1440×900 viser søgefeltets
`getBoundingClientRect().top` **< 700** og filtergitterets højde **≤ 240**.
*I dag: 1.078 og 326.* Sporet skriver begge tal før og efter.

**Ejer:** `assets/system.css` (katalogreglerne), `tools/skabelon/katalog.mjs`.
**Må ikke røre:** `assets/generator.css`, robot- og producentskabelonerne, `data/`.

**Spærret af TO ting, og de er forskellige:**
1. **JPK skal sige ja til §0.1 for sig.** Planen kalder det selv *"planens eneste
   forslag, der ændrer indhold og ikke rytme"*: de ni `kort--seneste` fjernes, så fladen
   holder op med at tegne 86 kort for 77 robotter. **Det er et indholdsvalg, ikke et
   rytmevalg,** og en Sonnet må ikke træffe det.
2. **`spor/certfacet` ejer `tools/skabelon/katalog.mjs`.** Send ikke før det er flettet.

---

## R3 (fundet F3) — 69 % af en producentside handler om de andre producenter

**Hvad læseren betaler i dag:** på Xiaomis side handler **31 %** af fladen om Xiaomi;
på Unitrees **42 %** (`fund/ANALYSE-produkort.md` F3, browsermålt ved 1440). Blokken
*"Alle 25 producenter"* er **konstant 1715 px** uanset producent.

**Og den er værre, end de to målinger viste.** Egen optælling over alle byggede sider:
rosteren er **25 rækker på alle 25 producentsider**, mens **17 af de 25 sider har højst
2 egne modelkort** og **10 har præcis 1**. Boston Dynamics — sidens tungeste navn — får
1 kort mod 25 fremmede rækker. **Fejlen vokser omvendt med producentens størrelse, og
flertallet af siderne ligger i den tunge ende.**

**MODE: Read.** DESIGN.md har siden i dag en regel om det: *"Reglen om fladens eget
emne"* — fladens egne sektioner skal tilsammen fylde mere end halvdelen af højden ved
1440. **Reglen er brudt på mindst 17 af 25 sider.**

**Acceptkriterium:** færdig, når et browsermål ved 1440 på **både** Boston Dynamics
(1 model) og Unitree Robotics (13 modeller) viser, at sektionerne om fladens eget emne
tilsammen udgør **> 50 %** af `.producentside`s højde. *I dag: 31 % (Xiaomi, 2 modeller)
og 42 % (Unitree).* Sporet måler selv Boston Dynamics, som ingen har målt endnu.

**Ejer:** `tools/skabelon/producent.mjs`, `assets/generator.css` (`.prod-tabel*`).
**Må ikke røre:** `assets/system.css`, `tools/skabelon/katalog.mjs`, `data/`.

**Spærret af en modstrid, JPK skal skære igennem — og den må ikke sendes videre uden
ham.** `fund/PLAN-producent.md` §5.3 vil skære roster-afsnittet væk, fordi det er *"en
dårligere udgave af indekset"*. `fund/ANALYSE-produkort.md` P-E har målt, at det på
mobil er den **bedre** udgave: undersidens liste viser navn + land + antal ved 390 px
uden beskæring, mens indekset skjuler land og antal (se R7). **Sletter man afsnittet i
dag, mister en mobillæser det eneste sted, de tre oplysninger står sammen.**
En bygger, der får §5.3 i hånden uden P-E, gør mobilen værre, mens han retter desktoppen.

---

## R4 (fundet F4) — Producentfladen har 0 kildemærker og består udelukkende af tal

**Hvad læseren betaler i dag:** **0** kildemærker på tværs af alle 26 sider under
`dist/da/producenter/`, mod **1.732** under `dist/da/robotter/` og **23** på en enkelt
robotside. Hvert tal på producentfladen er noget, **vi** har regnet — antal modeller,
*"1 af 1"*, EU-optællingen — og ingen af dem kan belægges på den flade, hvor de står.

Det er blevet skarpere efter leverance A, ikke mildere: fladen trykker nu *"1 af 2 · nej
· Producenten oplyser, at der ikke er CE"*. Påstanden hviler på en `kilde`, en `hentet`
og en `advarsel` i `data/robots/xiaomi-cyberdog-2.yaml` — **og ingen af de tre kan ses.**
**Et dokumenteret nej er den mest bestridelige påstand, fladen kan fremsætte.**

**MODE: Read.** DESIGN.md's Read-afsnit: *"Et tal uden proveniens er en fejl på en
Read-flade, også når tallet er rigtigt."* PRODUCT.md's positionering nr. 1: *"en
journalist, der citerer ét tal, skal kunne belægge det lige så let som en indkøber."*

**Acceptkriterium:** færdig, når
`grep -ro "kildemaerke" dist/da/producenter/ | wc -l` viser **> 0** og hvert af fladens
regnede tal bærer et mærke. *I dag: 0.* Kontroltal, der ikke må falde:
`grep -ro "kildemaerke" dist/da/robotter/ | wc -l` skal fortsat vise **1.732**.

**Ejer:** `tools/skabelon/producent.mjs`, `assets/generator.css`.
**Må ikke røre:** `tools/skabelon/robot.mjs`, `assets/system.css`
(`.kildemaerke`-primitiven er fælles og skal genbruges, ikke ændres).

**Spærret af, at der ikke findes en løsning at bygge.** `fund/PLAN-producent.md` P6
måler problemet og siger udtrykkeligt, at den *"ikke foreslår en løsning"*. **Det næste
skridt er `impeccable shape` på producentfladen, ikke et byggespor** — et mærke pr. tal
på en flade, hvor *hvert* tal er regnet, kan ende som 30 hævede tegn i en støjmur, og
det valg hører i en shape. R4 kollapser til R3, hvis shapen alligevel omskriver fladen;
tag dem i samme shape.

---

## R5 — `impeccable typeset` på hele sitet

**Hvad læseren betaler i dag:** hierarkiet holder op med at læses som hierarki.
Målt over begge stilark: **56** unikke `font-size`-erklæringer (55 uden `inherit`),
**31** forskellige px-literaler, hvoraf **19 ligger i spændet 9–20 px** — 12,5 · 13 ·
13,5 · 14 · 14,5 · 15 · 15,5 findes alle som levende værdier. Et spring på et halvt
pixel bærer ingen betydning, og læseren kan derfor ikke bruge størrelsen til at afgøre,
hvad der er vigtigst.

**MODE:** begge — det er et systemspor, ikke et fladespor. Men det skal **navngive
hver flades MODE, mens det arbejder**, for en Operate-flade må pakke og en Read-flade
skal have rytme, og en fælles skala, der ignorerer forskellen, gør begge dårligere.

**Hjemlen findes nu:** DESIGN.md's DP3b navngav *Række* (14 px) og gjorde
frontmatter og prosa enige om **ni** trin. **Sporet skærer ned mod de ni navngivne
trin; det opfinder ikke en tiende.**

**Acceptkriterium:** færdig, når
`grep -ohE "font-size: *[0-9.]+px" assets/system.css assets/generator.css | grep -oE "[0-9.]+" | sort -un | awk '$1>=9 && $1<=20' | wc -l`
viser **højst 9**. *I dag: 19.* Kontroltal, der ikke må falde:
`node tools/build.mjs` skal fortsat bygge samme antal sider som før sporet.

**Ejer:** `assets/system.css` **og** `assets/generator.css` — begge, i deres helhed.
**Må ikke røre:** `data/`, skabeloner (en skriftgrad rettes i CSS, ikke i markup).

**Spærret af:** intet fagligt. **Men den ejer begge stilark og kan derfor ikke køre ved
siden af ét eneste andet designspor.** Se rækkefølgeafsnittet: den hører sidst, ikke
femte, netop fordi den ellers skal gøres om.

---

## R6 — Klæbebaren, retning B (SKINNEN)

**Hvad læseren betaler i dag:** katalogsidens **sidste sætning er fuldstændig
uopnåelig**, så længe der står én robot i udvalget — bjælken dækker **45,7 px** af
dokumentet ved 1440 og **69,3 px** ved 390, og intet reserverer plads til den
(`body{padding-bottom:0}`, målt). Bjælken er samtidig **74,2 %** tom med én valgt robot
og **58,0 %** tom i det værst tænkelige tilfælde: tre robotter med katalogets tre
længste navne. Alle tal browsermålt i `fund/PLAN-klaebebar.md` §1.1–1.4.

**MODE: Operate.** Bjælken *er* betjeningen; en betjening, der skjuler sidens sidste
sætning, fejler Operate-kriteriet *"resultatet af en handling skal kunne ses"*.

**Planen er færdig og besluttet.** JPK har valgt **retning B**. D1–D8 er afgjort,
§9 lister elleve ting, en bygger ikke må opfinde selv, og §11 har efterprøvet 23 af
planens egne `fil:linje`-citater enkeltvis.

**Blokeringen i §10 er væk.** Planen kunne ikke afgøre navnenes skriftgrad, fordi
*"14 px findes ikke i DESIGN.md's skala"*. **DP3b har målt, at det gør det** — trinnet
hedder *Række*, det bruges ni steder, og klæbebaren har det allerede
(`system.css:2459`). **Sporet skal bygge retning B uden at ændre en eneste
`font-size`.**

**Acceptkriterium:** færdig, når et browsermål ved 1440 med én robot valgt viser
`document.body` `padding-bottom` **≥** bjælkens målte højde, og katalogets sidste
`<p class="t-lille">` er **100 % synlig** ved maksimal rulning. *I dag: 0 px og
100 % skjult.* Kontrol, der ikke må falde:
`git diff -U0 assets/system.css assets/generator.css | grep -cE "^[-+].*font-size"`
skal vise **0**; ændres én, skal den stå i rapporten som en afvigelse fra DP3b.
*(`^[-+]` er ikke pynt — uden det tæller `grep` diffens kontekstlinjer og giver et
plausibelt, forkert tal. Se CLAUDE.md's fældetabel.)*

**Ejer:** `assets/katalog.js`, `assets/system.css` (`.klaebebar*`),
`tools/skabelon/katalog.mjs` (strengbæreren).
**Må ikke røre:** `assets/generator.css`, sammenligningssidens JS, `data/`.

**Spærret af `spor/certfacet`, som ejer `tools/skabelon/katalog.mjs`.** Strengbæreren
`<p class="saml-taeller" …>` står i dag på **katalog.mjs:1471–1478** (filen er 1.547
linjer). **Briefets tal, 1439–1474, stemmer ikke** — se rapporten. Send ikke R6, før
certfacet er flettet, og genmål linjenummeret bagefter.

**To ting i §10 er stadig uafgjorte, og de skal med i briefet som spørgsmål:** om
bjælken skal have en overgang, når et led fjernes (siden har ingen målt
bevægelsesgrammatik at låne fra), og om `Ryd udvalget` skal overleve ved siden af tre
`Fjern`-knapper. **Ingen af dem må en bygger afgøre selv.**

---

## R7 — Producentindekset skjuler to af tre datakolonner ved 390 px

**Hvad læseren betaler i dag:** ved 390 px har `.prod-tabel-wrap` `clientWidth` **343**
og `scrollWidth` **620** — **277 px er skjult**. *"LAND"* er klippet midt i ordet,
*"ANTAL"* er helt væk. Og der er **ingen rulleaffordance**:
`grep -c "prod-tabel-wrap::after"` giver **0** i begge stilark, så intet fortæller
læseren, at der er mere. Årsagen er to låste kolonnebredder,
`generator.css:1131–1132` (`width:20ch` og `width:12ch`). Gælder også `/en/`.

**MODE: Operate** — indekset er en indgang, man vælger i, ikke en tekst man læser.

**Dette er det billigste punkt på listen med en reel læserpris**, og det modsiger
`fund/PLAN-producent.md` §12, som skrev *"der er ingen akut mobilfejl at melde"*.
Den sætning er nu målt falsk.

**Acceptkriterium:** færdig, når et browsermål ved 390 px viser
`scrollWidth − clientWidth` **= 0** på `.prod-tabel-wrap`, ELLER — hvis kolonnerne
bevidst beholdes brede — når `grep -c "prod-tabel-wrap::after" assets/generator.css`
viser **≥ 1** og affordancen er synlig på et skærmbillede ved 390. *I dag: 277 og 0.*

**Ejer:** `assets/generator.css` (`.prod-tabel*` alene).
**Må ikke røre:** `assets/system.css`, nogen skabelon, `data/`. Rettelsen er to
`width`-erklæringer og eventuelt en `::after`.

**Spærret af:** intet. **Og den ligger i den anden CSS-bane end R1/R2/R6** — se
rækkefølgeafsnittet.

**Rækkefølgeafhængighed, der ikke er en spærring:** R3 kan gøre R7 større, hvis JPK
vælger at flytte rosterens oplysninger til indekset. Rettes R7 først, er arbejdet ikke
spildt — kolonnerne skal være læsbare uanset.

---

## R8 — `.v-ikke` er usynlig på `--bund`, og det rører en hård begrænsning

**Hvad læseren betaler i dag:** tilstanden *"ikke oplyst"* forsvinder på de flader, der
står på `--bund`. Chippens fyld er `--tom`, som peger på `--p-eloxgraa`; fladen bagved
er `--bund`, som peger på **den samme primitiv** (`system.css:127` og `:134`) —
**1,00 : 1**. Hele tilstanden bæres derfor af en 0,8 px stiplet `--hegn`-kant på
**2,14 : 1** mod eloxgrå (stilarkets egen kommentar, `system.css:156`), under WCAG
1.4.11's 3,0. På `--panel` virker fyldet; på producentsiden og i katalogets flader gør
det ikke.

**Det rører hård begrænsning 5** — *"'Ikke oplyst', 'nej' og '0' er tre forskellige
tilstande og skal se forskellige ud. Det er der, katalogsider lyver."* På en `--bund`-
flade er *"ikke oplyst"* i dag knap til at skelne fra en tom celle på afstand.

**MODE:** begge. Tilstandsalfabetet er systemets kerne og står på alle flader.

**Acceptkriterium:** færdig, når en beregning af WCAG-kontrasten for
`.v-ikke`s bærende kant mod `--bund` viser **≥ 3,00**, med læseretningen skrevet ud
(*hvad på hvad*). *I dag: 2,14 : 1 for kanten og 1,00 : 1 for fyldet.*

**Ejer:** `assets/system.css` (`.v-ikke` og tokendefinitionerne).
**Må ikke røre:** `assets/generator.css`, skabeloner, `data/`.

**Spærret af, at det er en systembeslutning og ikke en rettelse.** **Paletten er låst af
TYPESKILT**, så løsningen kan ikke være *"vælg en anden grå"*. De to farbare veje er (a)
give `--tom` sin egen primitiv, hvilket åbner DESIGN.md's **konflikt 3**
(fem tokennavne på samme hex), eller (b) bære tilstanden på noget andet end fyld og en
2,14-kant. **Begge er JPK's valg.** Dertil hænger punktet sammen med DESIGN.md's
**konflikt 6** (`--hegn` som betydningsbærende kant) og **konflikt 9** (halvdelen af
tilstandsfamilien satses i px, halvdelen i em) — **de tre er ét spørgsmål og bør
afgøres i ét træk, ikke tre.**

---

## R9 — Skriftgulvet brydes i sammenligningens fotofelt

**Hvad læseren betaler i dag:** `.saml-fotofelt__ord` sættes i **8 px**
(`generator.css:452`) og **7 px** i den smalleste ombrydning (`:748`) — et ord, der står
alene, under systemets eget gulv på 10,5 px. Ordet er *"ikke oplyst"*-teksten, altså en
af de fire datatilstande; læseren skal kunne skelne den **på afstand**, og 7 px er ikke
læsbart for nogen.

**MODE: Operate** (sammenligningssiden).

**Beslutningen er allerede truffet i DESIGN.md's DP3c**, som samtidig gav gulvet en
rækkevidde: 10,5 px gælder tekst, der **bæres alene**; hævede kildemærker, operatorer og
enheder med `max(8px, …em)`-form er undtaget, fordi de læses sammen med en figur.
**`.saml-fotofelt__ord` er ikke undtaget** — det er et ord, det står alene.

**Acceptkriterium:** færdig, når `grep -c "font-size:[78]px" assets/generator.css` viser
**0**. *I dag: 2.* To lovlige udfald: ordet sættes mindst 10,5 px, eller det erstattes af
tilstandsalfabetets stiplede firkant uden tekst.

**Ejer:** `assets/generator.css` (`.saml-fotofelt*` alene).
**Må ikke røre:** `assets/system.css`, `assets/sammenligning.js`, skabeloner.

**Spærret af:** intet. **Bemærk `spor/fotofod` rører `generator.css`** — genmål
ejerskabet, før R9 sendes.

**Send R7 og R9 som ÉT spor.** Begge er `generator.css` alene, begge er små, og to spor
i samme fil er en flettekonflikt, der først opdages, når begge er færdige.

---

## Rækkefølgen og de to CSS-baner

**`assets/system.css` er 3.170 linjer og 524 regler og deles af alle flader.** Kun 13
regler er sammenligningsspecifikke og 1 er om-os. **To spor, der begge retter
`system.css`, kan ikke køre samtidig.** Det er den eneste grund til, at listen har et
baneafsnit.

| Bane | Punkter | Kan køre parallelt med |
|---|---|---|
| **A — `system.css`** | R1 · R2 · R6 · R8 | kun bane B, og kun ét ad gangen internt |
| **B — `generator.css`** | R7 + R9 (ét spor) · senere R3 · R4 | kun bane A, og kun ét ad gangen internt |
| **C — begge stilark** | **R5** | **intet. Den er alene på maskinen** |

**R1 rører også `generator.css`** (`:964`, `:1058`), så den kan ikke køre ved siden af
bane B. Den er til gengæld lille og afgrænset; **kør den først og alene.**

**Den anbefalede rækkefølge — og den afviger med vilje fra rangen:**

1. **R1** alene. Lille, afgjort, rammer alle 216 sider. Åbner begge baner bagefter.
2. **R7 + R9** som ét spor i bane B, parallelt med R2 i bane A, når certfacet er flettet.
3. **R2**, når JPK har svaret på §0.1's indholdsvalg.
4. **R6**, når certfacet er flettet og linjenummeret genmålt.
5. **R3 + R4 som én `impeccable shape`**, når JPK har skåret igennem roster-modstriden.
6. **R8** som én afgørelse sammen med DESIGN.md's konflikt 3, 6 og 9.
7. **R5 til sidst.** Den er femte-dyrest for læseren og alligevel sidst, fordi den ejer
   begge stilark: at typesætte en flade, som R2, R6 eller shapen bagefter omskriver,
   er at gøre arbejdet to gange. **Rang er læserpris; rækkefølge er også spild.**

**Det, jeg ikke kunne afgøre:** om R5 bør deles i to (én skala-beslutning, ét
udførelsesspor) frem for at være ét stort seriel-spor. Argumentet for at dele er, at
skalabeslutningen kan tages uden at røre CSS og derfor ikke behøver at låse maskinen.
Argumentet imod er, at DP3b's ni trin allerede *er* den beslutning. **Jeg har ikke målt,
hvor mange af de 19 grader der falder ud af sig selv, når de ni trin håndhæves** — den
måling ville afgøre det, og den hører i sporet, ikke her.
