# FUND — nævneren i specifikationstætheden (D7)

Målt 21. august 2026 i worktreen `udstilling-wt-naevner`, gren `data/naevner`.
Lukker D7. Foreslår **L30**.

---

## Regel 0 — skill-vurdering

Kørt `ls .claude/skills/` (projekt: `robotdata`, `parallelt`) og
`ls C:/Users/thyge/.claude/skills/` (globale: `critique`, `impeccable`, `ui-ux-critique`)
samt systemets fulde skill-oversigt.

| Skill | Valg | Begrundelse |
|---|---|---|
| **`robotdata`** | **Valgt, læst fra disk** | Den bærer feltskemaet og selv-tjekket med tælling. Den er dermed ikke bare relevant — den er **en af de fire kilder til fejlen**, se nedenfor. Jeg fulgte dens selv-tjek og selv-review, og jeg har rettet den |
| `parallelt` | Gik forbi | Opgaven er ét spor. Alle seks delopgaver skriver i den samme lille håndfuld filer (`skema.mjs`, `metode.md`, `STATUS.md`), og punkt 4 og 5 kan ikke måles, før punkt 3 er lavet. To agenter ville skrive oven i hinanden |
| `impeccable` | Gik forbi | Design- og IA-planlægning. Her ændres et tal og en metodetekst, ikke en flade |
| `ui-ux-critique`, `critique` | Gik forbi | Kritik af en bygget side. Ingen side ændrer udseende her |
| `dataviz` | Gik forbi | Ingen grafik |
| `code-review`, `simplify` | Gik forbi | Passer på ændringen, men opgaven bad om måling og beslutning, ikke om en gennemgang af generatoren |

**Note:** `Skill`-værktøjet blev ikke brugt til `robotdata` — jeg læste
`.claude/skills/robotdata/SKILL.md` fra disk og fulgte den derfra, jf. CLAUDE.md's
regel om skills, der ændres i en kørende session. Det skrives her, så et stille
fallback ikke forveksles med at skillen kørte.

---

## Svaret kort

**Nævneren er 33.** Ikke 29, ikke 31, og aldrig igen skrevet som et tal:
`NAEVNER = FELTNAVNE.length`.

**Rækkefølgen ændrer sig ikke. 0 af 46 robotter skifter plads.** Målt på bygget output.

**Den beslutning, der faktisk blokerer rangeringen, er D4 — og den er allerede truffet
(L20), men koden gør noget andet.** Det er den vigtigste ting i dette dokument.

---

## 1. Hvor de to nævnere kommer fra — målt, ikke gættet

### Kaldekæden, hele vejen

```
tools/skema.mjs:222          export const NAEVNERE_STANDARD = [29, 31];   ← kilden
        ↓
tools/validate.mjs:874-877   naevnereFra(flag)  — uden --naevner returneres konstanten
        ↓
tools/build.mjs:157          const naevnere = naevnereFra(flag);
        ↓
tools/build.mjs:94-98        naevnere.map(n => …)   ← ét procenttal PR. NÆVNER
tools/build.mjs:342          taethed: Object.fromEntries(naevnere.map(…))
tools/build.mjs:445          console.log(`Taethedsnaevnere brugt: ${naevnere.join(', ')}`)
```

*(linjenumre fra tilstanden før min ændring)*

### Det spørgsmålet forudsatte, og som ikke passer

Opgaven spurgte, **hvilke robotter der får 29 og hvilke der får 31.** Det gør ingen.
`naevnere` er en **liste**, og hver robot bliver opgjort på **hver** nævner i listen.
Alle 46 robotter får begge tal. Målt i bygget output:

```
dist/robots.json →  "naevnere": [29,31]
                    unitree-b2:               {"29":69,"31":65}
                    ghost-robotics-vision-60: {"29":76,"31":71}
```

Det er ikke to skalaer, der er blandet sammen mellem robotter. Det er **to skalaer
oven på hinanden på hver eneste robot** — hvilket er værre, fordi det ikke er en fejl,
der kan opdages ved at sammenligne to poster.

### Efterprøvet: når tallet overhovedet en læser?

`fil:linje` beviser, at koden findes. Her er søgningen for, om nogen kalder den:

- `grep -o '<div class="taethed">' dist/da/robotter/*/index.html` → **0 træf.**
- `grep -o '[0-9]+/2[0-9]\|[0-9]+/3[0-9]'` på en bygget robotside → **0 træf.**
- `grep -rn "taethed" tools/skabelon/*.mjs` → kun `side.mjs:655` (et hårdkodet
  demotal `33,8` i tegnforklaringen) og `side.mjs:766` (en forklarende tekst).

**Tæthedsblokken i `build.mjs:92-99` er død kode.** `build.mjs:281` vælger
`robotSkabelon.render(ctx)`, når `tools/skabelon/robot.mjs` findes — og den findes, og
den tegner ikke tætheden. Sidens eneste rangering står altså i dag **ikke på nogen
side**. Den eneste levende vej ud er `dist/robots.json`, som klientsiden får serveret.

`assets/katalog.js` læser den ikke endnu (`grep "taethed" assets/katalog.js` → 0 træf),
så i dag er tallet reelt kun tilgængeligt for den, der åbner JSON-filen. **Det er en
selvstændig mangel, som ikke er min at lukke** — se "Hvad jeg ikke nåede".

### Hvor 29 og 31 stammer fra historisk

| Tal | Oprindelse | Status |
|---|---|---|
| **29** | Præ-L6-listen: `nyttelast` som ét felt, `trinhøjde` som ét felt | Levn. L19 forkastede den allerede. Den overlevede kun, fordi den stod i `NAEVNERE_STANDARD` |
| **31** | L19's tal, læst af DATAMODEL.md's prosaliste | Målt forkert — se punkt 3 |
| **33** | `tools/skema.mjs`' faktiske nøgler | Det, koden hele tiden har talt tælleren op over |

**Kernefejlen, i én sætning:** `taethed()` (`tools/validate.mjs:683-688`) løber
**tælleren** op over `FELTNAVNE` — 33 nøgler — mens **nævneren** kom fra en håndskrevet
konstant. Brøkens to halvdele kom fra hver sin liste. Ingen af dem vidste, at den anden
fandtes, så de kunne skride fra hinanden ved hver skemaændring uden at noget fejlede.

Med nævneren 29 og en robot med 30 udfyldte felter ville siden have trykt **103 %**.
Det er ikke sket endnu — højeste faktiske tæller i dag er 22 — men intet forhindrede det.

---

## 2. Tællingen: 33 felter

**Tælling A — koden selv.**

```
node -e "import('./tools/skema.mjs').then(m=>console.log(m.FELTNAVNE.length))"
→ 33
```

Fordelt: fysik **14** · energi **5** · sensorik **6** · nyttelast **3** ·
kommercielt **1** · eu **4**. 14+5+6+3+1+4 = **33**.

**Tælling B — datafilerne, uden om koden.** `awk` over rå tekst, ingen brug af
projektets parser:

```
46 filer · 1518 feltnøgler i alt · 0 filer afviger fra 33 · 0 dubletnøgler
46 × 33 = 1518 ✓
```

**Tælling C — parseren.** Samme resultat: 1518 feltposter, **0** nøgler i data som
ikke er i skemaet, **0** skemafelter som ingen robot bruger.

Tre uafhængige tællinger, samme tal. Der er ingen tvivl om, hvad skemaet har.

### Hvorfor 31 lød rigtigt: to modsatrettede fejl, der næsten gik lige op

Den offentliggjorte 31-liste i `indhold/metode.md` og i `DATAMODEL.md` afveg fra
skemaet på præcis to punkter, med hver sit fortegn:

| Post i prosalisten | Nøgler i skemaet | Forskel |
|---|---|---|
| `mål stående (L×B×H)` | `laengde`, `bredde`, `hoejde` | **+2** |
| `driftstemperatur (fra/til)` | `temp_min`, `temp_maks` | **+1** |
| `mål sammenfoldet (L×B×H)` | **findes ikke** | **−1** |

31 + 2 + 1 − 1 = **33**.

**`mål sammenfoldet` er den alvorlige.** Skemaet har aldrig haft feltet. Tre datafiler
siger det selv, i deres egne `advarsel:`-felter:

- `data/robots/xiaomi-cyberdog-1.yaml:40` — *"Skemaet har ingen felter til foldemaal."*
- `data/robots/xiaomi-cyberdog-2.yaml:40` — *"Skemaet har alligevel ingen felter til foldemaal."*
- `data/robots/yobotics-y20.yaml:43` — *"Skemaet har ingen felter til foldemaal."*

En nævner med et felt, **ingen producent nogensinde kan udfylde**, trækker hver eneste
robot ned med et fast beløb. Tallet måler så ikke længere producentens åbenhed — det
måler producentens åbenhed minus en konstant, vi selv har opfundet.

### Og hvor 29 kom fra: en overskrift, ingen talte efter

`robotdata`-skillen og `DATAMODEL.md` skrev begge **"Fysik (10)"** og opremsede
derefter **12** ting. STATUS.md's egen D7-note havde allerede fanget det
(*"Feltlisten fulgte med; totalen gjorde ikke"*), men rettede kun totalen til 31 —
hvilket ramte den ene af de tre uoverensstemmelser og ikke de to andre.

`anvendelse` er **korrekt** holdt uden for tællingen. Den ligger som topnøgle i
`tools/skema.mjs:76` (`IDENTITET_VALGFRI`), ikke i `FELTER`, og kommentaren på
`skema.mjs:109-114` siger hvorfor. Efterprøvet: den indgår ikke i `FELTNAVNE` og
dermed ikke i `taethed()`. Nævneren er **ikke** flyttet af L22/L27.

---

## 3. Valget: 33. Og den skrives aldrig som et tal igen

### Ændringen

```js
// tools/skema.mjs
export const NAEVNER = FELTNAVNE.length;
export const NAEVNERE_STANDARD = [NAEVNER];
```

**Det vigtigste ved rettelsen er ikke tallet — det er at tallet er væk.** Fejlen var
ikke, at nogen valgte 29 eller 31. Fejlen var, at nævneren overhovedet kunne skrives
et andet sted end der, hvor tælleren tælles. Vælger jeg 33 som en ny konstant, har jeg
løst symptomet og efterladt mekanismen.

Ændrer nogen `FELTER`, flytter nævneren nu med — og det **er** det rigtige, fordi
tælleren allerede flyttede med. Metodesiden skal så rettes, og det fælder en prøve,
hvis den ikke bliver det.

### Hvad der har ændret sig siden L19

L19 valgte 31 med begrundelsen *"feltlisten er sandheden"*. **Princippet står ved
magt.** Det, der har ændret sig, er, at feltlisten har fået krop:

- **L19 blev truffet, før der fandtes kode.** L12 gav først lov til at skrive kode.
  Feltlisten var på det tidspunkt en prosaliste i `DATAMODEL.md`, talt i hånden.
- **`tools/skema.mjs` findes nu**, er maskinlæsbar, og er den liste, `taethed()`
  faktisk tæller over.
- **Alle 46 datafiler retter sig efter den.** 1518 feltposter, nul afvigelser. Det er
  ikke en påstand om, hvad listen burde være — det er en måling af, hvad den er.

L30 er derfor en **revision, ikke en omgørelse**: samme princip, anvendt på den
feltliste, der nu eksisterer i stedet for den, der var skrevet ned.

### Alternativer, jeg forkastede

| Alternativ | Hvorfor ikke |
|---|---|
| **Behold 31, ret skemaet til at passe** | Ville kræve at slå `laengde`/`bredde`/`hoejde` sammen til ét felt og de to temperaturer til ét. Det smider tre selvstændige kilder og hentedatoer væk, og en producent, der oplyser længden men ikke bredden, ville ikke længere kunne skelnes fra en, der ikke oplyser nogen af dem. Dertil skulle `mål sammenfoldet` **tilføjes** — et felt, vi ikke har data til, og som pr. definition ville stå tomt på 46 af 46 |
| **Behold 29** | Forkastet allerede af L19, og af samme grund: den er fra før L6 |
| **Bliv ved med at vise begge** | Det er den nuværende tilstand, og den er problemet. To procenttal ved siden af hinanden er ikke en rangering. `KRITIK-1-plan.md` K9 kalder det *"en god midlertidig ting"* — den midlertidighed er nu ovre |
| **Vent på JPK** | Se selv-review nedenfor. Jeg mener ikke, at det er et skøn, men jeg har lagt tallene frem, så det kan omgøres på et grundlag |

---

## 4. Konsekvensen, målt på bygget output

Bygget to gange — én gang med `--naevner=29,31` (tilstanden før), én gang med
standarden (efter) — og sammenlignet `robots.json` element for element:

```
FØR  nævnere: [29,31]   EFTER nævnere: [33]
robotter i rangeringen: 46

pladser der flytter, 29 -> 33:  0
pladser der flytter, 31 -> 33:  0
pladser der flytter, 29 -> 31:  0
alle tre lister byte-identiske? true
```

**0 af 46 skifter plads.** Det bekræfter `KRITIK-1-plan.md` K9's måling, nu taget fra
generatorens eget output i stedet for fra et hjælpescript.

**Hvorfor det matematisk ikke *kan* være anderledes:** procenten er en strengt
voksende funktion af tælleren, og nævneren er den samme for alle. Den eneste måde, en
konstant nævner kunne omrokere, ville være, hvis afrundingen slog to forskellige
tællere sammen ved den ene nævner og ikke ved den anden. Efterprøvet: der er **20
forskellige tællerværdier** i datasættet, og de giver **20 forskellige procenter** ved
hver af 29, 31 og 33. Ingen sammenfald, altså ingen omrokering.

**Niveauet flytter sig derimod.** Et tal målt på 29 er ca. 14 % højere end det samme
tal på 33:

| Robot | 29 | 31 | **33** |
|---|---|---|---|
| Ghost Robotics Vision 60 | 76 % | 71 % | **67 %** |
| Rainbow Robotics RBQ-10 | 72 % | 68 % | **64 %** |
| Boston Dynamics Spot | 69 % | 65 % | **61 %** |
| Unitree B2 | 69 % | 65 % | **61 %** |
| ANYbotics ANYmal | 34 % | 32 % | **30 %** |
| ANYbotics ANYmal X | 14 % | 13 % | **12 %** |
| Fem Weilan-/Ghost-poster | 0 % | 0 % | **0 %** |

Gennemsnit over alle 46: 41 % ved 29 · 39 % ved 31 · **36 % ved 33**.

**Alle tætheder oplyst før 21. aug 2026 skal regnes om, ikke skrives om.**

---

## 5-6. Hvad jeg har rettet

| Fil | Ændring |
|---|---|
| `tools/skema.mjs` | `NAEVNER = FELTNAVNE.length`; `NAEVNERE_STANDARD = [NAEVNER]`. Kommentarblokken bærer hele lineagen 29/31/33, så den ikke skal genfindes |
| `tools/validate.mjs` | `--taethed`-diagnostikken siger ikke længere, at D7 er åben. Den siger nu, at nævneren er udledt — og at **D4** stadig er uafklaret, med de 16 pladser |
| `tools/build.mjs` | Hjælpeteksten peger på L30 i stedet for L19 |
| `indhold/metode.md` | `÷ 31` → `÷ 33`; feltlisten rettet til skemaets seks grupper; `mål sammenfoldet` fjernet; rettelsesnote med hvad der stod før og hvorfor; ANYmal X `4 af 31, 13 %` → `4 af 33, 12 %`; CyberDog 2 `18 af 31` → `17 af 33`, median `12` → `13` |
| `STATUS.md` | **L30** skrevet ind. L19 gennemstreget med henvisning, ikke slettet. D7-afsnittet omskrevet med målingerne. **D4-rækken udvidet med kode/beslutning-modsigelsen.** To nye poster under "Regler, der er købt dyrt" |
| `DATAMODEL.md` | Skemaafsnittet rettet til 33 med rettelsesnote. Forsøgsmålingen fra 19. aug **står som den blev målt**, med en note om, at den ikke er sammenlignelig |
| `.claude/skills/robotdata/SKILL.md` | 29 → 33 i beskrivelse, feltliste og formel. Nye referencetal målt i dag. Peger nu på `tools/skema.mjs` som sandheden i stedet for at gentage listen som en konkurrerende kilde |
| `data/i18n/{da,en}.json` | Død nøgle `taethed_naevner_aaben` (*"Nævneren er ikke besluttet (D7)"*) — nul forbrugere, og indholdet er nu usandt — erstattet af `taethed_naevner` |
| `tests/koer.mjs` | Se nedenfor |

### Prøven er vendt om, ikke slettet

Der stod én prøve på nævneren, `tests/koer.mjs:494-495`:

```js
ok('taethed vises med baade 29 og 31 som naevner',
  spotDa.includes('5/29') && spotDa.includes('5/31'));
```

Reglen er nu den modsatte, så prøven beviser nu den modsatte regel. Den er flyttet
derhen, hvor tallet **faktisk** er (`robots.json`), fordi den gamle stod på en side, der
ikke længere trykker tallet:

```js
ok('robots.json baerer praecis én naevner', …)
ok('og hver robots taethed er opgjort paa netop den ene naevner', …)
ok('detaljesiden trykker ingen fremmed naevner (fx 5/29 eller 5/31)', …)
```

Dertil et nyt afsnit **3b**, med syv prøver — placeret **før** afsnit 4 med vilje, se
nedenfor. Den vigtigste er den, der binder koden til den offentliggjorte metode:

```
3b. Naevneren (D7 / L30)
  ok    skemaet har 33 feltnoegler
  ok    naevneren er skemaets feltantal, ikke et haandskrevet tal
  ok    bygget bruger praecis én naevner som standard
  ok    metode.md udgiver formlen med et tal
  ok    metode.md udgiver SAMME naevner som koden regner med
  ok    metode.md har ingen efterladte 29- eller 31-taellinger i broedteksten
  ok    ingen af de 46 poster kommer over 100 % (hoejeste: 67 %)
```

**Hvorfor prøve 5 er den dyre:** CLAUDE.md begrænsning 6 forbyder en rangering uden
offentliggjort metode med acceptkriterier. Siger koden 33 og metodesiden 31, **er
metoden ikke offentliggjort** — den er skrevet ned et sted, der er holdt op med at
passe. Nu kan de to ikke skride fra hinanden uden at bygget siger fra.

**Negativ kontrol — virker prøverne overhovedet?** Begge afprøvet ved at ødelægge
noget med vilje og køre igen:

- `metode.md` sat tilbage til `÷ 31` → `FEJL metode.md udgiver SAMME naevner som koden
  regner med — metode.md: 31, koden: 33` ✓
- `NAEVNERE_STANDARD` hardkodet tilbage til `[29, 31]` → `FEJL bygget bruger praecis én
  naevner som standard — [29,31]` ✓

Begge gendannet bagefter og efterprøvet med `grep`.

**Undtagelsen i prøve 6, sagt højt:** blockquote-linjer er undtaget fra "ingen
efterladte 29/31". Det er med vilje — projektets rettelsesnoter skrives som blockquote
og *skal* kunne sige *"her stod tidligere ÷ 31"*. Uden undtagelsen ville reglen
tilskynde til at slette historikken i stedet for at rette den. **Prisen er en blind
vinkel:** selve formellinjen er også en blockquote, så prøve 6 alene ville ikke fange en
stale formel. Prøve 5 gør — den læser formlen direkte. To prøver, hvor den ene dækker
den andens hul.

---

## Det, jeg fandt undervejs, som ikke var opgaven

### A. D4 — en truffet beslutning, koden ikke udfører. **Vigtigst.**

`tools/build.mjs:158`:

```js
const d4 = String(flag['type-uden-model'] ?? 'tael-ikke') === 'tael';
```

**L20 besluttede `tæl`. Koden defaulter til `tæl-ikke`.** `indhold/metode.md` udgav
L20's regel som gældende. Bygget har aldrig gjort det.

Målt på alle 46 poster: **16 af 46 pladser flytter sig** mellem de to indstillinger.
Det er den eneste af de to parametre, der overhovedet kan ændre en rangering.

STATUS.md var selv i konflikt: D4 stod **både** under "Venter på JPK" **og** som lukket
i L20. Jeg har udvidet D4-rækken med målingen og modsigelsen.

**Jeg har ikke rettet defaulten.** Det ville flytte 16 robotters placering i sidens
eneste rangering, og det hører ikke i en commit om nævneren. Det er lagt op som det,
det er: enten rettes koden til L20, eller L20 vendes om. De to må ikke blive stående
og modsige hinanden — og imens udgiver `metode.md` en regel, siden ikke følger. Jeg har
derfor sat en dateret, målt note ind i metode.md, så den offentliggjorte metode ikke
påstår noget, koden ikke gør.

### B. Testpakken har været brudt hele tiden

`node tests/koer.mjs` **styrter** i afsnit 4:

```
Error: ENOENT: … tests\.tmp-koersel\dist\stil.css   (tests/koer.mjs:480)
```

Bygget udsender `system.css` og `generator.css`; `stil.css` findes ikke længere.
**Efterprøvet med `git stash`, at nedbruddet er der uden mine ændringer.**

Konsekvensen for netop denne opgave: prøven *"taethed vises med baade 29 og 31"* stod
**efter** nedbrudspunktet og er aldrig blevet kørt mod den nuværende generator. Den ville
i øvrigt have fejlet, hvis den var nået dertil — tallet står ikke længere på siden.
Derfor er mit nye afsnit **3b** placeret før afsnit 4: det kører faktisk.

Afsnit 1-3b: **90 prøver, 0 fejl.** Afsnit 4 og frem kan ikke køres, før `stil.css`
rettes. Det er ikke mit at rette i denne commit, men det bør op på STATUS.md.

### C. Tætheden står ikke på nogen side

Se punkt 1. Sidens eneste rangering er i dag kun i `robots.json`. Den skal tegnes i
`tools/skabelon/robot.mjs`, som ejes af en anden agent.

---

## Selv-test med tælling

| Hvad | Tal |
|---|---|
| Robotfiler efterprøvet | **46** (alle) |
| Feltnøgler pr. fil | **33** i alle 46 — ingen fil afviger |
| Feltposter i alt | **1518** (46 × 33 ✓) |
| Dubletnøgler | **0** |
| Nøgler i data, som ikke er i skemaet | **0** |
| Skemafelter, ingen robot bruger | **0** |
| Poster i `dist/robots.json` med anden nævner end 33 | **0** af 46 |
| Uoverensstemmelser fundet | **1** — min egen, se nedenfor |

**Den ene uoverensstemmelse, og hvordan den blev fundet.** Min første håndtælling gav
**32** nøgler pr. fil, hvor parseren gav 33. Jeg antog ikke, at parseren havde ret. Jeg
diffede de to lister:

```
27a28
> ros2
```

Min `awk`-regel var `^  [a-z_]+:` — den matcher ikke cifferet i `ros2`. **Fejlen var i
min tælleregel, ikke i data.** Rettet til `[a-z0-9_]+` og kørt igen: 1518, 0 afvigelser,
i overensstemmelse med parseren. To uafhængige tællemetoder er nu enige.

Det er værd at skrive frem, fordi et hurtigt `wc -l` her ville have "bekræftet" 32 og
sendt hele beslutningen på afveje.

### Slutrapporternes tal

```
node tools/build.mjs
  Byggede 123 sider. Vaegtklasser: 12/12/13/9 over 46 datafiler.
  Kort paa forsiden: 46 (skal vaere lig 46). Kildemaerker: 566 tal med kilde, 0 uden.
  Kort i kataloget: 46 · sekundaere kilder: 3 felter · billeder: 0
  Taethedsnaevnere brugt: 33

node tools/validate.mjs
  46 fil(er) · 0 fejl · 1 advarsler
```

**123 sider og 46 kort, som krævet.** Identisk med målingen før ændringen på alle
punkter undtagen sidste linje: `29, 31` → `33`.

Den ene advarsel er `ghost-robotics-vision-60 · hastighed · R9` (2,4 m/s mod 4,9 mph,
9,6 % afvigelse). Den er der også før min ændring og er urørt.

---

## Selv-review — hvad jeg er usikker på

**1. Er valget mit eller JPK's?**

Mellem **29 og 31** er der intet at vælge: L19 traf beslutningen, og 29's overlevelse i
`NAEVNERE_STANDARD` er en kodefejl, ikke et åbent punkt.

Mellem **31 og 33** mener jeg, at det ikke er et skøn. 31 er ikke *en anden holdning* —
den tæller et felt med, som ikke findes, og lægger tre selvstændigt kildeangivne felter
sammen til ét. Det er efterprøvelige fejl, ikke en anden vægtning.

**Men L19 er en nummereret beslutning med JPK's navn på, og jeg vender den.** Det skal
kunne omgøres, så: hele grundlaget står ovenfor, ændringen er ét udtryk i én fil, og
`--naevner=31` gengiver den gamle skala uden at røre kode. **Mener JPK, at nævneren skal
være det, metoden udgav, snarere end det, skemaet har, er den rigtige rettelse at ændre
skemaet — ikke at sætte konstanten tilbage.**

**2. Det, jeg er mest usikker på, er ikke nævneren — det er D4.** Jeg har efterladt en
kendt modsigelse mellem L20 og koden. Det var et bevidst valg (16 pladser hører ikke i
en nævner-commit), men en anden kunne med rimelighed mene, at metode.md ikke burde
udgive L20's regel før koden følger den. Jeg har mærket den i metode.md frem for at
fjerne reglen, fordi det at fjerne den ville skjule, at der findes en beslutning.

**3. Skal nævneren virkelig være udledt?** Modargumentet: en fremtidig skemaændring
flytter nu alle offentliggjorte procenter **tavst**. Det er reelt. Min vurdering er, at
det stadig er bedre, fordi tælleren allerede flyttede tavst — udledningen fjerner ikke
tavsheden, den fjerner *uenigheden*. Prøven mod `metode.md` er det, der giver larmen
tilbage. Er det ikke nok, er næste skridt at fryse nævneren pr. udgivelsesdato og
versionere tætheden, og det er en større beslutning end denne.

**4. `taethed_naevner`-nøglen har ingen forbruger.** Jeg erstattede en død nøgle med en
anden død nøgle i stedet for at slette. Begrundelsen er, at robotsiden skal tegne
tætheden igen, og så skal strengen bruges — men det er et gæt om en fremtidig side.
Slettes den i stedet, mister ingen noget i dag.

**5. Jeg har ikke efterprøvet de enkelte tal i de 46 poster mod deres kilder.** Det er
`robotdata`-skillens felt-for-felt-tjek, og det er gjort af dataagenterne i
`KILDEKORT-*.md`. Det, jeg har efterprøvet, er **strukturen**: hvilke nøgler der findes,
hvor mange, og at tæller og nævner nu kommer fra samme liste. En tæthed kan være rigtigt
beregnet på forkerte tal, og det ville denne opgave ikke opdage.

---

## Hvad jeg ikke nåede

- **Testpakkens afsnit 4-6 kører ikke.** `stil.css`-nedbruddet er ældre end min gren, og
  jeg har ikke rettet det — det er en anden agents CSS-omdøbning. Mine egne prøver er
  derfor placeret, hvor de kan køre. **Bør på STATUS.md.**
- **Tætheden tegnes ikke på robotsiden.** Fundet og dokumenteret, ikke rettet:
  `tools/skabelon/robot.mjs` ejes af en anden.
- **D4-defaulten er ikke rettet.** Bevidst, se ovenfor.
- **`PLAN.md` og `PRODUCT.md` er ikke gennemsøgt for tæthedstal.** `grep` for
  `taethed|naevner|31 felter|29 felter` i `PRODUCT.md` gav 0 træf, så der er
  sandsynligvis intet — men jeg har ikke læst dem igennem for procenttal skrevet i prosa.
- **`FUND-*.md`- og `KILDEKORT-*.md`-arkiverne er ikke rettet.** Med vilje: CLAUDE.md
  siger, at arkiv ikke rettes bagud. De indeholder tæthedstal målt på 29 og 31, som ikke
  er sammenlignelige med dagens — det står nu i L30, i metode.md og i `robotdata`.
