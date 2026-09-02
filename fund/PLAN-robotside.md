# PLAN — robotsiden (led 3, første fladeplan)

**Skrevet af** `spor/shaperobot`, 2. sep 2026. **Base:** `a405066`.
**Skill:** `impeccable shape` — kaldt med Skill-værktøjet fra worktreen, og **kaldet lykkedes**
(se rapporten). Skillens fase 3 styrer dokumentets form; briefets fire ekstrakrav og
koordinatorens SYSTEMÆNDRING-krav er lagt oven på den.

**Fladen:** robotsiden. **154 sider** (77 robotter × 2 sprog). **MODE: Read.**

**Dette dokument er en plan. Det ændrer intet.** Ingen fil i `assets/`, `tools/`, `data/`
eller `tests/` er rørt af dette spor — efterprøvet med `git status --short`, som viser
kun `fund/`. Designfrysen **L70** gælder: fund noteres, de rettes ikke, indtil den
overordnede plan findes. Dette er første fladeplan af den plan.

---

## 0. Grundmåling — hvad fladen er i dag

Alle tal er målt af dette spor 2. sep 2026 på egen server (port 8234), efterprøvet mod
disken før brug. Kommandoen står ved hvert tal. **Intet tal i dette dokument er skønnet,
medmindre der står "skønnet".**

### 0.1 Miljøet, og beviset for at målingerne er mine egne

| Måling | Tal | Kommando |
|---|---|---|
| Fotos i worktreen før kopi | **0** | `ls assets/fotos/fabrikant/ \| wc -l` |
| `validate.mjs` **før** kopi | **77 filer · 76 fejl · 1 advarsel** | `node tools/validate.mjs` |
| `validate.mjs` **efter** kopi | **77 filer · 0 fejl · 1 advarsel** | samme |
| `build.mjs` | **216 sider · 1111 tal med kilde · 0 uden** | `node tools/build.mjs` |
| Robotsider bygget | **154** (77 × 2 sprog) | `ls dist/da/robotter \| wc -l` → 77 |

De 76 fejl før kopien er **miljøet, ikke fladen**: alle 76 er `R18: filen findes ikke`
på et gitignoreret fabrikantfoto. Det er den fælde, briefet advarer om, og grundmålingen
er det, der gør den synlig i stedet for at blive læst som en regression.

**Serverkontrol — to trin, fordi ét ikke var nok.** Ordet `hjoerne` duer ikke som
kontrolord (10 forekomster i mains eget stilark, Å120), og `md5` på `system.css` duede
heller ikke: mit stilark er **byte-identisk** med mains (`aac3ec5d…`), fordi dette spor
ikke rører CSS. Den kontrol ville altså have set rigtig ud, uanset hvilken server der
svarede. Den afgørende kontrol blev derfor `Last-Modified` mod min egen dists mtime:

```
curl -sI http://localhost:8234/da/robotter/unitree-go2/ | grep -i last-modified
   → Wed, 02 Sep 2026 12:20:11 GMT
stat -c '%y' dist/da/robotter/unitree-go2/index.html
   → 2026-09-02 14:20:11 (+0200 = 12:20:11 UTC)   ← mit byg
stat -c '%y' ../udstilling/dist/da/robotter/unitree-go2/index.html
   → 2026-09-02 14:13:10                          ← mains byg, 7 min ældre
```

Serveren leverer mit byg. **Lærdommen, der er værd at bære videre: et kontrolord kan ikke
skelne to servere, når filen er ens i begge. Tidsstemplet kan.**

### 0.2 Fladens form, målt

| Måling | movenew-p1 (24/33) | spirit-40 (0/33) | lingmao-cyvet (21/33) |
|---|---|---|---|
| Sidehøjde @1440 | **5.536 px** | **3.763 px** | **5.846 px** |
| Sidehøjde @390 | **8.515 px** | **5.063 px** | — |
| Skemaets andel af siden | **67,8 %** | **53,4 %** | — |
| Forskellige `font-size` på siden @1440 | **18** | **12** | — |
| Elementer under systemets skriftgulv (10,5 px) | **49** | — | — |
| Tomt i højre spalte under nøgletallene | **275 px** | **441 px** | — |
| Tomt i billedledet (`contain`) | **5,4 %** | **30,1 %** | **50,7 %** |

Kommandoer: `node maal.mjs <url> <bredde>` for sidehøjde; sporets egne målescripts i
scratchpad for resten (`shape-maal.mjs`, `shape-regler.mjs`, `shape-fold.mjs`,
`shape-hover.mjs`, `shape-billedspild.mjs`). **Hvert script blev valideret mod et kendt
svar, før dets tal blev brugt** — se 0.5.

### 0.3 Katalogets spændvidde — det tal, briefet ikke nævnte

```
node -e "…match(/([0-9]+) af 33 felter oplyst/)…"   over alle 77 danske robotsider
  → 77 rækker, 0 uden match
  → højeste 24 af 33 (microrobotech-movenew-p1/-t1)
  → laveste  0 af 33 (ghost-robotics-spirit-40, unitree-laikago,
                      weilan-alphadog-e300, -e400l, weilan-babyalpha)
```

**Fem robotter oplyser NUL af 33 felter.** Ingen robot oplyser mere end 24 af 33.
Skabelonen skal altså bære et spænd fra 0 til 24 — ikke fra "tynd" til "fuld", men fra
**intet** til **to tredjedele**. Det er fladens vigtigste indholdstal, og hele
afsnit 4's retning hviler på det.

Tilstandene fordelt over alle 154 robotsider:

```
grep -oh "v-tal|v-ikke|v-ja|v-nej|v-nul|v-tekst|v-liste" dist/*/robotter/*/index.html | sort | uniq -c
  v-tal   4463      v-tekst   362      v-nej   22
  v-ikke  2946      v-liste    90      v-nul   16
  v-ja     120
```

**36,7 % af alle værdiceller siger "ikke oplyst"** (2946 af 8019). Hullet er ikke en
kant-tilfælde på denne flade — det er hver tredje celle.

### 0.4 Sprogene

| Måling | da | en |
|---|---|---|
| Sidehøjde, movenew-p1 @390 | 8.515 px | **8.542 px** (+0,3 %) |
| Prosablokke over 68ch @1440 | 4 af 6 | **5 af 7** |
| Elementer under skriftgulvet @1440 | 49 | **49** |
| Tegn sat i Literata | **0** | **0** |

**Briefets antagelse om at "engelsk tekst er længere" holder ikke målbart på denne
flade:** +27 px på 8.515 er 0,3 %. Årsagen er målt i 0.5 og er alvorligere end
antagelsen: den engelske side er ikke længere, fordi **den engelske side i vidt omfang
er den danske**.

### 0.5 Hvert måleapparat valideret mod et kendt svar

Reglen "et nyt måleapparat skal valideres, før dets tal bruges" er fulgt for alle fem
scripts. Det er ikke en formalitet — **kontrol nr. 4 nedenfor væltede en konklusion, jeg
allerede havde skrevet.**

| Apparat | Kontrol | Resultat |
|---|---|---|
| `shape-maal.mjs` | skal give samme sidehøjde som `maal.mjs` på spirit-40 | **3763 = 3763** ✔ |
| `shape-hover.mjs` | skal FINDE zoomen på katalogets kort, hvor den beviseligt er | `none` → **`matrix(1.024,…)`** ✔ |
| `shape-regler.mjs` | Om-siden skal overholde 62ch/Literata, som DESIGN.md dokumenterer | **62ch, 18px, Literata** ✔ |
| `shape-billedspild.mjs` | skal reproducere browserens 50,7 % på lingmao-cyvet | **50,7 % = 50,7 %** ✔ |
| dansk-detektor på `/en/` | `/da/` skal give markant HØJERE tal end `/en/` | **42 % = 42 %** ✘ — **se nedenfor** |

**Den femte kontrol fejlede, og det var det værdifuldeste enkeltresultat i sporet.**
Jeg havde målt, at 482 af 1148 forbeholdsblokke på `/en/` indeholder danske stopord, og
var ved at skrive "42 % af de engelske forbehold er uoversatte". Kontrolkørslen på `/da/`
gav **nøjagtig samme to tal** — 1148 og 482. To identiske tal er ikke et sammenfald; det
er et signal om, at jeg målte den samme streng to gange. Direkte sammenligning:

```
node -e "…sammenlign <p class='advarsel'>-kroppe mellem da og en for alle 77 robotter…"
  → forbehold-blokke sammenlignet: 1148
  → KROP identisk mellem da og en: 1148 = 100,0 %
  → KROP oversat: 0
  → NAVN (etiketten Forbehold/Caveat) identisk: 747 af 1148
```

**Alle 1148 forbeholds- og notetekster på robotsiderne er byte-identiske mellem dansk
og engelsk. Nul er oversat.** Etiketten er oversat, kroppen er ikke. Det er ikke 42 % —
det er 100 %. Se afsnit 6.4 for, hvad det binder i planen.

---

## 1. MODE: Read — hvad det konkret betyder her

`impeccable`s egen definition: *"Read: the visitor understands something. Structure for
comprehension, then make the reading experience worth staying in."* Succeskriteriet er
et **andet** end katalogsidens Operate, og det er værd at skrive ud, fordi de to flader
er blevet behandlet ens i alt arbejde før 1. sep (L70).

**Hvad den besøgende skal forstå på robotsiden — i den rækkefølge:**

1. **Hvad er det for en maskine?** Navn, producent, land, status, billede, klasse.
2. **Hvad er kendt om den?** Nøgletallene.
3. **Hvor fuldstændig er den her viden, og hvorfor?** ← *dette er sidens egentlige emne*
4. **Hele optegnelsen**, felt for felt, med kilde og forbehold.
5. **Hvor tallene kommer fra.**

**Punkt 3 er det, der gør siden til vores og ikke til et datablad.** PRODUCT.md's
positionering siger det: specifikationstæthed er *"eneste rangering"*, den *"måler
producenternes åbenhed"*, og produktprincip 1 er *"et tal uden kilde findes ikke"*.
DESIGN.md's **Gør**-liste åbner med *"Gør hullet lige så formgivet som tallet."*

**Fladen leverer 1, 2, 4 og 5 godt. Den leverer 3 dårligt.** Målt:

- Tætheden står ét sted, som **"24 af 33 felter oplyst"**, 1.331 px nede.
- Den redaktionelle note — vores egen stemme om, *hvorfor* optegnelsen ser sådan ud —
  ligger på spirit-40 ved **y = 3.260 af 3.763 px = 87 % sidedybde**.
- Samtidig står **441 px af højre spalte tom** på samme side, i folden.

**Read-modens konsekvens for tempo og hierarki, som denne plan træffer valg ud fra:**

- **Øjet skal lande på maskinen, og derefter på optegnelsens tilstand** — ikke på det
  første af 33 felter. En Operate-flade må gerne kaste brugeren direkte i tabellen; en
  Read-flade skal først sige, hvad man er ved at læse.
- **Sidens form skal ændre sig med dens indhold.** I dag gør den det næsten ikke:
  en side med 24 kendte felter og en side med **0** har samme sektionsrækkefølge, samme
  33 rækker og samme visuelle rytme. Forskellen er 5.536 mod 3.763 px højde — altså kun
  længde. **En Read-flade, hvis form er uafhængig af dens indhold, er en skabelon, ikke
  et dokument.**
- **Læsbarhed slår tæthed.** På Operate vinder scanbarhed; på Read vinder linjelængde,
  skriftgrad og prosaens ro. Her er alle tre målt uden for systemets egne grænser
  (afsnit 3).

---

## 2. De låste beslutninger, planen regner med og ikke genåbner

Slået op i STATUS.md's **Lukket**-tabel, linje for linje, **uden `head`** (Å55).

| Nr. | Beslutning | Hvad planen gør ved den |
|---|---|---|
| **L76** | `--accent` er baggrund og markør, **aldrig tekst på lys flade**. Målt 1,38 : 1 mod `bund`, 1,60 : 1 mod `panel`. Tekst PÅ accent er altid `--blaek` | Planen foreslår **ingen** ny accentforgrund. Hvor den vil hæve noget frem (afsnit 4, P2), sker det med flade, kant eller vægt — ikke med gul tekst |
| **L77** | Én knapprimitiv `.knap` med varianter, grundformen taler TYPESKILT. **Besluttet, ikke bygget** | Planen **regner med** den og bygger den ikke. Robotsidens eneste knap er `.videre` (producentlinket). Planen foreslår ingen ny knap — se 5.6 |
| **L78** | Produktfoto beskæres **aldrig**. `object-fit:contain` + `aspect-ratio:4/3` **overalt**, ingen fladespecifik undtagelse | Planen foreslår **ingen** ændring af sideforhold eller fit. Se 5.1, hvor prisen er målt og accepteret |
| **L79** | 2 px er systemets radius (`--hjoerne`), gælder overalt, de bløde 12/8/6 udgår | Planen foreslår ingen radius. Alt nyt arver `--hjoerne` |
| **L80** | `--sans` udgår. **Saira til maskinen, Literata til mennesket.** *"løbende prosa er Literata, og de 8 nuværende brug beholdes **og udvides**"* | Planen **udfører** udvidelsen på denne flade — se P3. Det er eksekvering af en truffet beslutning, ikke en ny |
| **TYPESKILT** | Den låste retning | Uændret. Skillen respekterer selv låse: *"The brief wins. Honor pinned aesthetics, eras, materials, fonts, and palettes."* |
| **Hård begr. 1** | Ingen forhandleraftale | Ingen købsknap, intet affiliate-link, ingen prisforespørgsel foreslås. Robotsiden har i dag nul af delene — det **skal blive sådan**, se 5.6 |
| **Hård begr. 2** | Opfind aldrig tal, cases, certificeringer, kapaciteter | Planen foreslår intet nyt indhold. Hvert element, den flytter eller fremhæver, findes allerede på siden med kilde |
| **Hård begr. 5** | *"Ikke oplyst"*, *"nej"* og *"0"* er **tre** tilstande og skal se forskellige ud | Planen rører **ikke** de fire datatilstande. Se 5.2, hvor det er skrevet som en beslutning, ikke som en udeladelse |

Slået op i **"Kom ikke igen med disse"**: ingen af planens forslag står på listen.
Nærmeste nabo er *"Redaktionel 1-5-score"* — planen foreslår intet, der rangerer eller
bedømmer en robot. Tætheden er et **optælling af producentens åbenhed**, ikke en
karakter, og planen ændrer hverken dens formel eller dens nævner.

---

## 3. Briefets tre åbne fund — efterprøvet, ikke troet

Briefet siger det selv: *"Alle tre er noteret, ingen er rettet. Mål hver enkelt selv."*
**Ét af de tre holder ikke på denne flade. Ét holder. Ét holder, men er mindre end
påstået — og dets rigtige udgave er større.**

### 3.1 Fund 1 — hover-zoomen `scale(1.024)`: **RAMMER IKKE ROBOTSIDEN**

Påstanden: *"Hover-zoomen `scale(1.024)` beskærer nu 2,4 %. Den var harmløs under `cover`
og klipper under `contain` efter L78. Sidens eneste sanktionerede bevægelse."*

**Reglen er scopet til kort:**

```
assets/system.css:1373
  .kort:hover .billedled img,.kort:focus-within .billedled img{transform:scale(1.024)}
```

**Robotsiden har nul `.kort`.** Et `grep` på `\bkort\b` giver 1 træffer, og den er en
**falsk positiv**: klassen hedder `kort-ophav`, og bindestregen er en ordgrænse.
Robotsidens foto ligger i `figure.robot-foto > .billedled.billedled--stor`, ikke i et kort.

Målt i browseren, med kontrollen kørt først:

| Flade | transform før hover | transform under hover | ændrede |
|---|---|---|---|
| **Katalogsiden** (kontrol) | `none` | **`matrix(1.024, 0, 0, 1.024, 0, 0)`** | **ja** ✔ |
| robotsiden, movenew-p1 | `none` | `none` | **nej** |
| robotsiden, lingmao-cyvet | `none` | `none` | **nej** |
| robotsiden, spirit-40 | `none` | `none` | **nej** |

```
node shape-hover.mjs "http://localhost:8234/da/"                       1440 ".kort .billedled img" ".kort"
node shape-hover.mjs "http://localhost:8234/da/robotter/<slug>/"       1440 ".robot-foto img"      ".robot-foto"
```

**Havde arbejdet været forkert**, ville kontrolkørslen på kataloget også have vist
`none` — så var apparatet, ikke fladen, det, jeg målte. Den viste `1.024`.

**Konsekvens for planen:** fundet hører i katalogsidens og producentindeksets
fladeplaner, ikke i denne. **Robotsiden har ingen bevægelse overhovedet**, og det er
ikke en mangel — se 5.5.

### 3.2 Fund 2 — de mange skriftstørrelser: **HOLDER, og robotsidens andel er nu målt**

Påstanden: *"55 forskellige skriftstørrelser i stilarkene, 18 trin alene i spændet
9–20 px (målt 1. sep). Robotsidens andel er ikke målt."*

Målt nu, på **renderede elementer med egen tekst**, ikke på stilarkets regler — det er
det tal, der beskriver, hvad et menneske faktisk ser:

| Side | Bredde | Forskellige `font-size` |
|---|---|---|
| movenew-p1 (24/33) | 1440 | **18** |
| movenew-p1 | 390 | **16** |
| spirit-40 (0/33) | 1440 | **12** |
| movenew-p1, `/en/` | 390 | **16** |

```
node shape-maal.mjs "http://localhost:8234/da/robotter/microrobotech-movenew-p1/" 1440
  → "antalForskelligeFontSize": 18
  → 84px×1 23px×6 16px×1 15.5px×33 15px×31 14px×2 13.5px×29 13px×5
    12.88px×4 12.5px×17 12px×6 11.5px×19 11px×15 10.8px×1 10.5px×31
    10px×28 8.4px×16 8px×5
```

**Tretten af de atten trin ligger mellem 8 og 15,5 px** — altså 13 grader inden for
7,5 px. Det er ikke et hierarki; det er en gradient. Et hierarki, læseren kan bruge,
har tre til fem trin, der kan skelnes uden at måle.

**Det skarpeste enkelttal:** siden bruger **10,5 px (31 elementer)**, **10 px (28)**,
**11 px (15)** og **11,5 px (19)** — fire trin inden for 1,5 px, tilsammen 93 elementer.
Ingen læser kan se forskel på 10 og 10,5 px. De fire trin bærer altså **ingen**
information, men koster fire beslutninger hvert sted, de bruges.

### 3.3 Fund 3 — tæthedstallets nævner: **HOLDER, men er mindre og større end påstået**

Påstanden: *"Tæthedstallet står nu som '24 af 33' uden nævnerforklaring… Forklaringen
findes ikke længere nogen steder på robotsiden."*

**Mindre end påstået:** tallet står ikke som et bart *"24 af 33"*. Den byggede side
skriver **"24 af 33 felter oplyst"** — enheden er der. Og nævneren er ikke usynlig:
**tabellen lige nedenunder ER de 33 felter**, med 40 `<tr>` = 33 datarækker + 6
gruppeoverskrifter + 1 kolonnehoved. Læseren kan tælle dem.

```
node -e "…tekst uden tags…"  → forekomster af "33" i SYNLIG tekst: 1
  ...Alle felter i skemaet 24 af 33 felter oplyst Imperiale enheder...
node -e "…<tr> i tabellen…"  → tr i alt: 40 | gruppe-markører: 12
```

**Større end påstået:** det virkelige problem er ikke den manglende forklaring — det er,
at **siden allerede har et bedre mønster 900 px længere oppe og ikke bruger det.**
Nøgletalspanelet skriver:

> **0 af 5 oplyst · 5 huller**
> Producenten oplyser ingen af de 5 nøgletal.

Det navngiver tæller, nævner **og hullet**, og det siger det i ord, når tallet er nul.
Skemaet skriver `24 af 33 felter oplyst` og stopper. **To tællere på samme side, med to
forskellige grader af ærlighed.** Det er en konsistensfejl inden for én flade — og
konsistens på tværs af skærme, som JPK bad om, begynder med konsistens inden for én.

**Konsekvens for planen:** forslaget bliver ikke *"forklar nævneren"* (det ville være en
fodnote mere). Det bliver *"brug det mønster, siden allerede ejer"* — se **P2**.

---

## 4. Briefet (skillens fase 3)

### 4.1 Job og publikum

**Hvem ankommer:** PRODUCT.md's **primære** læser — den nysgerrige fagperson (presse,
studerende, folk i branchen), der er landet her fra en søgning eller et link, **uden**
et modelnavn i hovedet, og som vil vide, hvad denne maskine er, og om tallene kan bruges.
**Sekundært** den tekniske indkøber, der kender modellen og skal kunne afvise eller
beholde den og begrunde det internt.

**Situation og sindstilstand:** hun læser **én** robot, ofte som den første og eneste hun
åbner. Hun har ikke set kataloget. Hun skal kunne citere ét tal isoleret — PRODUCT.md's
*Operating Context* siger det direkte: *"kildeangivelsen skal derfor holde til at blive
citeret isoleret."*

**Visitor mode: Read.** Se afsnit 1.

### 4.2 Resultat og bevis

**Den primære ting, hun skal forstå:** *hvad vi ved om denne maskine, hvor det kommer
fra, og hvor stort hullet er.* Ikke "hvilken robot skal jeg købe" — det er
katalogsidens og sammenligningssidens job.

**Succes:** hun kan efter ét gennemløb sige tre ting uden at gætte: (1) hvad maskinen er
og hvem der laver den, (2) hvor fuldstændig producentens oplysning er, (3) hvor et
bestemt tal kommer fra og hvornår det blev hentet.

**Det ægte bevismateriale, fladen bærer i dag** — intet af det er opfundet, og planen
tilfører intet:

| Bevis | Mængde, målt |
|---|---|
| Tal med kilde i hele bygget | **1.111**, og **0** uden (`node tools/build.mjs`) |
| Kildemærker på én robotside | **29** (`shape-hierarki.mjs`, movenew-p1) |
| Forbeholds-/notetekster på robotsiderne | **1.148** blokke |
| Redaktionelle noter i data | **147** over **63 af 77** robotter, 2,3 pr. robot |
| Andel af sidens synlige tekst i forbeholdsspalten | **42,8 %** (4.550 af 10.637 tegn) |

**Den produktspecifikke sandhed, en nabo ikke kan kopiere:** hullerne er talt, daterede
og begrundede. **36,7 % af alle værdiceller siger "ikke oplyst"**, og siden siger det
med et eget formsprog frem for at lade cellen stå tom. Det er positionens kerne, og det
er den, fladen i dag underspiller.

### 4.3 Den valgte retning

**Visuel autoritet:** **TYPESKILT**, uændret og låst. Ingen ny verden, ingen
world-workshop — `impeccable shape` går kun i `new-work`, når komposition eller
interaktion står materielt åben, og det gør den ikke: fem designbeslutninger (L76–L80)
er netop truffet, og led 2 har skrevet dem ind i koden.

**Strukturel tese — og det er planens ene idé:**

> **Siden har i dag én akt og har brug for to.**
> Skemaet fylder **53–68 %** af siden, og hver af dets 33 rækker vejer det samme.
> Derfor ser en side med 24 kendte felter og en side med **0** næsten ens ud — samme
> sektioner, samme 33 rækker, samme rytme. Kun længden skiller dem (5.536 mod 3.763 px).
> **En Read-flade, hvis form ikke ændrer sig med dens indhold, er en skabelon, ikke et
> dokument.**

Retningen deler siden i **Skiltet** og **Journalen**:

- **Skiltet** (folden): hvad maskinen er, hvad der er kendt, **og hvor fuldstændig
  optegnelsen er.** Det er typeskiltet på maskinen — TYPESKILTs egen metafor, taget
  bogstaveligt for første gang på denne flade.
- **Journalen** (resten): hele optegnelsen, felt for felt, med kilde, hentedato og
  forbehold. Uændret i substans; kun grupperet og sat, så den kan læses.

**Sekvens** (hvad øjet møder, i rækkefølge): navn og producent → maskinen (foto) →
nøgletallene → **optegnelsens tilstand i ord** → journalen → kilderne.
Det eneste nye trin er det fjerde, og det står i dag på **85–92 % sidedybde**.

**Det fokale øjeblik:** foldens højre spalte, under nøgletallene. I dag er den **tom**.

```
node shape-passer.mjs 1440 <12 slugs>
slug                          tæt  sidehøjde  tomtHøjre  noterH  noterDybde  passer
microrobotech-movenew-p1       24       5536        275     180         92%     JA
microrobotech-movenew-t1       24       5744        275     396         88%    NEJ
genisom-gangben-l2             23       5573        275     249         91%     JA
boston-dynamics-spot           22       5462        275     246         91%     JA
galileo-s1                     22       5118        313     213         90%     JA
yufan-lingmao-cyvet            21       5846        275     409         88%    NEJ
unitree-go2                    15       5117        275       0           -      -
anybotics-anymal               11       4660        275     166         91%     JA
ghost-robotics-spirit-40        0       3763        441     269         87%     JA
unitree-laikago                 0       3911        497     362         85%     JA
weilan-babyalpha                0       3819        441     246         87%     JA
deep-robotics-x30              13       4367        296     190         90%     JA
```

**Læs tabellen som ét argument.** Noteblokken — *vores egen stemme, det eneste på siden,
producenten ikke har skrevet* — ligger på **85–92 % sidedybde på alle elleve robotter,
der har en.** Samtidig står **275–497 px** af foldens højre spalte tom. Og de to tal er
**omvendt korrelerede**: jo tommere robotten er, jo mere tom fold (441–497 px ved 0 af
33) — og jo vigtigere er noten, fordi den så er *det eneste, siden har at sige.*

**Pladsen vokser præcis dér, hvor behovet vokser.** Det er ikke en rettelse, der skal
opfindes; det er en tom plads og et hjemløst indhold, der passer sammen på **9 af de 11**
robotter, der har noter (målt: `noterH <= tomtHøjre`).

**Implementeringskonsekvens:** ingen ny visuel verden, ingen ny farve, ingen ny skrift,
ingen ny knap. Retningen består af **flytning, gruppering og sats** — og den kan derfor
udføres inden for L76–L80 uden at genåbne nogen af dem.

### 4.4 Omfang og grænser

- **Fidelity:** fladeplan. Ingen kode, ingen comp, intet direction contract — `shape`
  skriver aldrig kode, og briefet forbyder det.
- **Bredde:** robotsiden, 154 sider. **Ikke** kataloget, sammenligningen,
  producentsiden, producentindekset, Om os, 404 eller sprogroden — men se afsnit 7,
  hvor de forslag, der uundgåeligt rører dem, er udskilt.
- **Interaktivitet:** uændret. Siden har i dag én interaktiv kontrol (enhedsskiftet) og
  én udfoldning (*"Afvigelser og varianter i nøgletallene (4)"*). Planen tilføjer ingen.
- **Urørt:** de fire datatilstande, paletten, skriftvalget, `contain`+4:3, radius,
  kildemærkets systematik, enhedsskiftet, og hele dataindholdet.
- **Udtrykkelige anti-mål:** ingen ny knap (L77 ejer knappen, og den er ikke bygget) ·
  ingen accentfarvet forgrund (L76) · ingen beskæring (L78) · ingen ny skrift (L80) ·
  ingen skjulte eller sammenlagte huller (hård begrænsning 5) · **ingen rangering,
  score eller anbefaling** (hård begrænsning 6, og *"Kom ikke igen med disse"*).

### 4.5 Tilstande og spænd

Skabelonen skal bære hele dette spænd. Alle tal målt.

| Dimension | Minimum | Typisk | Maksimum |
|---|---|---|---|
| Oplyste felter | **0 af 33** (5 robotter) | 15 af 33 | **24 af 33** |
| Sidehøjde @1440 | 3.763 px | ~5.100 px | 5.846 px |
| Noter pr. robot | **0** (14 robotter) | 2,3 | 396–409 px blok |
| Tomt i billedled | **0 %** | 21,7 % (median) | **50,7 %** |
| Nøgletal oplyst | **0 af 5** | — | 5 af 5 |
| Forbeholdsblokke pr. side | 1 | ~15 | — |

**Materielle tilstande, planen skal navngive og ikke må glemme:**

1. **Den tomme optegnelse** — 0 af 33, 0 af 5 nøgletal. Fem robotter. Her er noten hele
   indholdet, og siden er 3.763 px, hvoraf **53,4 % er 33 rækker, der siger "ikke oplyst"**.
2. **Den fulde optegnelse** — 24 af 33. Her er skemaet 67,8 % og kræver gruppering for
   at kunne læses.
3. **Ingen noter** — 14 af 77 robotter. Foldens nye blok skal have en tom tilstand, der
   ikke ser i stykker ud. `unitree-go2` er prøvetilfældet (`noterH = 0`).
4. **Den lange note** — movenew-t1 (396 px) og lingmao-cyvet (409 px) passer **ikke** i
   275 px. To af elleve. Skal have en designet afkortning, ikke et overløb.
5. **Det høje foto** — 50,7 % tomt billedled. Syv fotos er højere end brede.
6. **Den udgåede model** — status ≠ *i produktion*. Bærer statusstempel og oftest den
   vigtigste note.
7. **Engelsk** — se 4.7.

### 4.6 Interaktion og layout

**Hierarki, i den rækkefølge planen vil have det læst:**
robotnavn (84 px) → producent + land → status og klasse → foto **‖** nøgletal →
**optegnelsens tilstand** → journalen, grupperet → noter → kilder.

**Topologi:** uændret to spalter over folden (foto venstre, nøgletal højre), fuld bredde
derunder. Planen ændrer **ikke** kompositionen; den **udfylder** den højre spalte, der i
dag stopper 275–497 px før fotoets underkant.

**Responsivitet:** ved 390 falder alt til én spalte, og målet (68ch) er **allerede
overholdt** — 0 af 6 prosablokke over målet ved 390 mod 4 af 6 ved 1440.
**Linjelængdeproblemet er udelukkende et desktopproblem**, og planen skal ikke røre
mobilkaskaden for at løse det.

**Affordances og tilbagemelding:** uændret. Ingen ny hover, intet nyt fokus, ingen ny
overgang. Robotsiden har i dag **nul** bevægelse (3.1), og det er en beslutning, ikke en
mangel — se 6.4.

### 4.7 Begrænsninger og åbne beslutninger

**Bindende, og planen kan ikke løse dem:**

1. **Den engelske side er ikke oversat, hvor det tæller.** Alle **1.148**
   forbeholds- og notetekster er byte-identiske mellem `/da/` og `/en/`; **0** er
   oversat. Etiketten (*Forbehold* → *Caveat*) er oversat i 401 af 1.148 tilfælde,
   kroppen i **ingen**.
   **Konsekvensen for enhver fladeplan, inklusive denne:** et forslag, der læner sig
   hårdere på forbeholdsspalten, forbedrer den danske side og gør **intet** for den
   engelske. Planens forslag er derfor vægtet mod **struktur og sats**, som virker på
   begge sprog, frem for mod at fremhæve prosa, som kun virker på ét.
   **Dette er et data-/i18n-spørgsmål, ikke et designspørgsmål, og planen løser det
   ikke.** Det hører i et eget spor. Se rapportens opdagelsesafsnit.

2. **Noterne er ikke typede.** `noter:` i YAML er en flad liste af strenge. En de
   facto-konvention — VERSAL-optakt på den optegnelses-brede note — findes, men holder
   kun på **69 af 147 noter = 47 %**. **Et design, der automatisk skal vælge "den
   vigtige note", kan derfor ikke bygges uden en datamodelændring**, og det er ikke
   denne plans ærinde. Planens P1 er skrevet, så den ikke kræver det.

3. **L77's knapprimitiv er besluttet og ikke bygget.** Robotsidens eneste knap er
   `.videre` (producentlinket). Planen tilføjer ingen knap og venter på L77.

4. **Tre spor rører `assets/system.css` samtidig.** Hvert tal i denne plan, der stammer
   fra en delt fil, er målt **2. sep 2026** og mærket med den dato. Planens forslag er
   formuleret som **regler og acceptkriterier**, ikke som linjenumre, netop for at holde,
   uanset hvor de tre spor lander.

**Åbne beslutninger, en bygger IKKE må opfinde selv** — de hører hos JPK:

- **Skriftgulvet.** DESIGN.md's navngivne regel siger **10,5 px**; DESIGN.md's egen
  komponentspecifikation for kildemærket siger `max(8px,.34em)`. **Dokumentet modsiger
  sig selv**, og robotsiden har **49 elementer under 10,5 px**. Se **P5** — planen
  fremlægger valget og træffer det ikke.
- **Om den tomme flade i billedledet skal have en egen behandling** (0–50,7 %,
  median 21,7 %). Se 6.1.
