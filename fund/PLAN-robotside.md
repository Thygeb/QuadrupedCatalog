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

---

## 5. Forslagene

**Formen er ens for alle syv:** hvad · hvorfor (én linje) · hvilken navngiven komponent
det bruger · **acceptkriterium** · pris.

**Læsenøgle til komponentkolonnen**, efter koordinatorens krav:
**(a)** bruger en komponent eller regel, DESIGN.md allerede navngiver — citeret ved navn.
**(b)** kræver en systemændring og har derfor en post i **afsnit 7**.

Alle før-tal er målt 2. sep 2026 med kommandoen, der står ved dem. **Ingen af dem er et
gæt, og ingen af dem er et krav til bygherren om at ramme mit tal** — efter-tallet er
det, kriteriet måler.

---

### P1 — Optegnelsens tilstand får folden **(b)**

**Hvad:** foldens højre spalte, som i dag stopper 275–497 px før fotoets underkant, får
en blok under nøgletallene, der siger, hvor fuldstændig optegnelsen er, og bærer robottens
redaktionelle noter. Noterne flyttes derop **som blok** — de udvælges ikke, sorteres ikke
og omskrives ikke.

**Hvorfor:** i Read-mode er *"hvor fuldstændig er den her viden"* sidens egentlige emne
(afsnit 1), og det står i dag på **85–92 % sidedybde** på alle elleve målte robotter,
mens **275–497 px** af folden står tom — og de to tal er omvendt korrelerede.

**Komponent:** **(b)** — blokken hviler på `.stribe-hylster` (`side.mjs:1610`) og
`.noter-blok` (`robot.mjs:946`), og **ingen af dem findes i DESIGN.md.** Se **S2**.

**Vigtigt værn:** forslaget kræver **ikke**, at noterne typemærkes. Det var min første
idé, og den holder ikke: VERSAL-optakten, der ville skulle bære udvælgelsen, findes kun
på **69 af 147 noter = 47 %** (`node -e "…data/robots/*.yaml…"`). Blokken flytter derfor
**hele** notelisten, i uændret rækkefølge.

**Acceptkriterium** (før-tal fra `node shape-passer.mjs 1440 <slug>`):

1. Færdig, når `node shape-passer.mjs 1440 ghost-robotics-spirit-40 unitree-laikago
   weilan-babyalpha` viser **`tomtHøjre ≤ 120`** for alle tre — før: **441, 497, 441**.
2. Færdig, når samme kommando viser **`noterDybde ≤ 25 %`** for de elleve robotter i
   4.3-tabellen, der har noter — før: **85–92 %** for alle elleve.
3. Færdig, når `unitree-go2` (noterH = 0) bygger **uden** en tom ramme: blokken skal
   enten mangle helt eller bære sin egen tomme tilstand. Måles ved, at siden ikke
   indeholder en tom `.noter-blok` uden børn.
4. **De to lange noter skal have en designet afkortning, ikke et overløb.**
   `microrobotech-movenew-t1` (396 px) og `yufan-lingmao-cyvet` (409 px) passer ikke i
   275 px. Færdig, når `node maal.mjs` viser **`vandretOverloeb: 0`** og blokkens højde
   ikke overstiger fotoets på nogen af de tolv målte robotter.

**Pris:** `tools/skabelon/robot.mjs` (flytning af ét kald, ~1.060 linjer i dag) ·
`assets/system.css` eller `generator.css` (blokkens sats) · **154 sider ombygges** ·
`tests/dele/53-robotsidens-flader.mjs` skal have vendt sin assertion, hvis den påstår
noget om noteblokkens plads — **assertionen vendes, den slettes ikke.**

---

### P2 — Én tællerform på hele siden **(b)**

**Hvad:** skemaets tæller *"24 af 33 felter oplyst"* får samme form som
nøgletalspanelets, som allerede står 900 px højere oppe på samme side:
*"0 af 5 oplyst · 5 huller"*.

**Hvorfor:** to tællere på én flade med to grader af ærlighed er en konsistensfejl
inden for én skærm — og konsistens på tværs af skærme begynder dér.

**Komponent:** **(b)** — `.skema-taeller` (`robot.mjs:778`) findes ikke i DESIGN.md.
**Men indholdet skal ikke opfindes:** i18n-nøglerne findes allerede i **begge** sprog og
er i paritet (394 nøgler i `da.json` og `en.json`, 0 manglende):

```
da.json:120  "noegletal_hul_en":    "1 hul"        en.json:120  "1 gap"
da.json:121  "noegletal_hul_flere": "{n} huller"   en.json:121  "{n} gaps"
da.json:193  "skema_taeller": "{a} af {b} felter oplyst"
```

**Acceptkriterium:** færdig, når

```
grep -ohE '\b1 hul\b|[0-9]+ huller' dist/da/robotter/*/index.html | wc -l
```

viser **114** — før: **37**. Tallet er **udledt, ikke ønsket**: alle 77 robotter har
skemahuller (max er 24 af 33), så tælleren tilføjer præcis 77. **Afviger bygherrens
måling fra 114, er det tallet, der gælder, og afvigelsen skal forklares** — ikke rettes
mod mit.

**Pris:** `tools/skabelon/robot.mjs` (én strengsammensætning) · ingen ny i18n-nøgle ·
154 sider · `tests/dele/63-ordbog-og-skema.mjs` udvides med en prøve på, at de to
tællere bruger samme form.

---

### P3 — Vores egen stemme sættes i Literata (udfører L80) **(a)**

**Hvad:** den løbende prosa, der er **vores** og ikke producentens — noteblokken og
feltnoterne — sættes i Literata. Tal, etiketter, tabelhoveder, enheder og producentens
citerede strenge bliver i Saira.

**Hvorfor:** L80 er ordret *"løbende prosa er Literata, og de 8 nuværende brug beholdes
**og udvides**"*. Udvidelsen er ikke sket på denne flade, og det er den flade, der har
mest af vores egen prosa.

**Komponent:** **(a)** — **"Manual-brød"**, navngivet i DESIGN.md's *Typografi ›
Hierarki*: *"(400, 18px, 1,62, `blaek`, `--manual`/Literata): Om-sidens argumenterende
afsnit. 62ch, ikke sitets almindelige 68ch."* Rollen findes; den skal bruges her.
**Rækkevidden er dog større end robotsiden — derfor har den også en post S4 i afsnit 7.**

**Acceptkriterium:** færdig, når
`node shape-regler.mjs "http://localhost:8234/da/robotter/microrobotech-movenew-p1/" 1440`
viser **`literataTegn > 0`** — før: **0 af 7.664 tegn** — **og** `sairaTegn` fortsat er
det største af de to, så maskinen stadig taler Saira. Samme kommando mod `/en/` skal
give samme svar (før: 0 af 7.723).

**Grænsen, der skal holdes, og som er let at overtræde:** forbeholdsblokken er
**blandet** — den citerer producenten *og* kommenterer citatet. Kun **vores**
kommentar må skifte skrift. Færdig, når en citeret producentstreng på
movenew-p1 (`"Total Weight: 77kg (Battery included)"`) fortsat måles som Saira.

**Pris:** `assets/system.css` (2–4 regler) · 0 skabelonændringer, hvis klasserne findes ·
154 sider · ny prøve i `tests/dele/36-typeskilt-robot.mjs`.

---

### P4 — Prosaen under systemets eget mål **(a)**

**Hvad:** de prosablokke på robotsiden, der i dag løber i fuld spaltebredde, får
systemets eksisterende målklasse.

**Hvorfor:** DESIGN.md's *Layout* siger *"Brødtekst begrænses til 68ch (`--maal`)"*.
Robotsidens bredeste prosa måler **155 tegn pr. linje** — mere end det dobbelte.

**Komponent:** **(a)** — `.maal` / `--maal`, `assets/system.css:358` og `:222`, og
navngivet i DESIGN.md's *Layout*. **Mekanismen findes allerede og er anvendt på 2 af 6
blokke** — de to, der overholder målet, bærer netop klassen `maal`. Det er ikke et nyt
værktøj; det er et værktøj, der ikke er sat på.

**Acceptkriterium:** færdig, når `node shape-regler.mjs <url> 1440` viser
**`regel2_over68ch: 0`** på både `/da/` og `/en/` — før: **4 af 6** (da) og **5 af 7**
(en). Værste blok i dag: **155ch / 1.352 px / `max-width: none` / klasse `t-lille`**.

**Værn mod en overreaktion:** ved **390** er der **0 af 6** over målet allerede.
**Mobilkaskaden må ikke røres** — kriteriet skal genkøres ved 390 og fortsat vise 0.

**Pris:** `assets/system.css` eller `tools/skabelon/robot.mjs` (klassen sættes på 4
blokke) · 154 sider · ingen ny test nødvendig, men en prøve på at målet holder ville
være billig.

---

### P5 — Skriftgulvet: en modstrid, der skal **afgøres**, ikke rettes af en fladeplan

**Dette er ikke et forslag. Det er et valg, der hører hos JPK**, og planen fremlægger
det med begge priser i stedet for at træffe det.

**Modstriden står inde i DESIGN.md selv:**

| Sted i DESIGN.md | Hvad der står |
|---|---|
| *Typografi › Navngivne regler* | *"**Skriftgulvet.** 10,5 px er den mindste skriftgrad i systemet, **også i den smalleste ombrydning**."* |
| *Komponenter › Kildemærket* | *"Et hævet bogstav efter værdien, `--mono`, `blaek2`, **`max(8px,.34em)`**."* |

**Målt på robotsiden — 49 elementer under det erklærede gulv ved 1440:**

```
node shape-regler.mjs "http://localhost:8234/da/robotter/microrobotech-movenew-p1/" 1440
  22 × 10px    .kildemaerke
  16 × 8.4px   .enhed          ← enheden ved tallet: "kg", "cm", "km/h"
   5 × 8px     .kildemaerke
   3 × 10px    <th>            ← skemaets kolonnehoveder
   2 × 10px    .kildemaerke--sek
   1 × 10px    .daek__stempel  ← topbaren, ikke robotsidens
```

Ved **390** er tallet **46** — de 8 og 8,4 px følger med ned på mobil, hvor de er værst.

**Den, der betyder mest for Read-modet, er ikke kildemærket — det er `.enhed`.**
Tallet står i 15,5 px og dets enhed i **8,4 px**. På et specifikationsark er enheden
det, der gør tallet til en oplysning: *77* er ingenting, *77 kg* er et faktum.
Systemet sætter faktummets ene halvdel til 54 % af den andens grad.

**De to veje, med prisen ved hver:**

| | Hæv gulvet i praksis | Ret den navngivne regel |
|---|---|---|
| **Hvad** | `.enhed` og `.kildemaerke` op til 10,5 px | Reglen skrives om til at anerkende 8 px for hævede mærker |
| **Pris** | Kildemærket vokser på **alle** flader (29 pr. robotside); DESIGN.md siger selv, at det bærer et usynligt 24×24 px berøringsmål, netop **for** at bogstavet ikke skal vokse. Layoutet i `.v-tal` skal efterprøves overalt | Gratis i kode. Men systemet har så **ikke** et gulv — det har en undtagelse pr. komponent, og det er tilstanden, gulvet blev skrevet for at afskaffe |
| **Rører** | system.css, alle 216 sider | DESIGN.md |

**Min anbefaling, hvis der ønskes en:** skil de to sager. `.kildemaerke` er et **mærke**,
ikke tekst, og kan legitimt undtages i en omskrevet regel. `.enhed` er **tekst med
betydning** og hører over gulvet. Det ville flytte 16 elementer og lade 29 stå.
**Men det er en systembeslutning på tværs af alle flader, ikke en fladeplansbeslutning**
— derfor S5 i afsnit 7 og ikke et P-nummer her.

---

### P6 — Gruppen får sin egen tæthed **(b)**

**Hvad:** hver af skemaets seks gruppeoverskrifter (FYSIK, ENERGI, SENSORIK OG AUTONOMI,
NYTTELAST OG GRÆNSEFLADER, KOMMERCIELT, EU) bærer sin egen tæller i P2's form.

**Hvorfor:** i dag må læseren tælle 33 rækker for at se, *hvor* hullerne sidder. En
robot kan have alt fysik og intet om energi — det er en oplysning om producenten, og den
er sidens vare. **Hullerne bliver ikke skjult; de bliver talt.**

**Værnet, der gør forslaget lovligt — og som er hele grunden til, at det er formuleret
sådan:** hård begrænsning 5 og DESIGN.md's *Gør*-liste (*"Gør hullet lige så formgivet
som tallet"*) forbyder at skjule eller slå tilstande sammen. **Ingen række fjernes,
foldes eller dæmpes.** Alle 33 bliver stående i fuld form, og gruppens tal er en
**tilføjelse**, ikke en erstatning. Et forslag om at folde tomme grupper sammen ville
være i strid med begrænsningen, og det er derfor bevidst ikke stillet.

**Komponent:** **(b)** — `.skema-gruppenavn` (`robot.mjs:762`) findes ikke i DESIGN.md.

**Acceptkriterium:** færdig, når

```
grep -oh 'skema-gruppetaeller' dist/*/robotter/*/index.html | wc -l
```

viser **924** — før: **0**. Udledt: 6 grupper × 77 robotter × 2 sprog. **Er nævneren pr.
gruppe ikke 6/6/6/…, skal bygherren skrive det målte tal, ikke ramme mit.**

Og: færdig, når `spirit-40` fortsat viser **33** `v-ikke`-celler i skemaet — altså at
ingen række forsvandt undervejs. Før: 33.

**Pris:** `tools/skabelon/robot.mjs` (grupperingsfunktionen kender allerede sine felter) ·
1 ny i18n-nøgle × 2 sprog · 154 sider · prøve i `tests/dele/63-ordbog-og-skema.mjs`, der
sikrer, at gruppetallene summerer til sidens hovedtal — **den prøve er vigtigere end
forslaget**, jf. *"Regler, der er købt dyrt"*: *"En brøk, hvis to halvdele kommer fra hver
sin liste, skrider — tavst."*

---

### P7 — Gruppeoverskrift og kolonnehoved skal kunne skelnes **(b)**

**Hvad:** skemaets gruppeoverskrift og dets kolonnehoved får forskellig rang.

**Hvorfor:** de er to forskellige ting og ser ens ud. Målt:

| Element | `font-size` | vægt | versaler | spatiering | farve |
|---|---|---|---|---|---|
| Gruppe (**FYSIK**) | **10,5 px** | 700 | ja | 1,575 px | `rgb(95,104,111)` |
| Kolonnehoved (**FELT**) | **10 px** | 700 | ja | 1,5 px | `rgb(95,104,111)` |

`node shape-hierarki.mjs <url> 1440` → `"identiskSignatur": false` — men forskellen er
**0,5 px skriftgrad og 0,075 px spatiering.** Det er falsk ved måling og sandt for øjet:
ingen læser skelner dem. Det er samme mønster som 3.2's fire trin inden for 1,5 px.

**Komponent:** **(b)** — hverken `.skema-gruppenavn` eller skemaets `th` findes i
DESIGN.md. Rangen skal hentes fra DESIGN.md's **"Etiket"** (mono, 500, 11,5 px, +0,15em,
versaler, `blaek3`), som er den navngivne rolle for netop *"at navngive en datagruppe"* —
se *Reglen om versaletiketten*.

**Acceptkriterium:** færdig, når `shape-hierarki.mjs` viser, at de to signaturer
adskiller sig på **mindst to** af {`font-size` (≥ 2 px forskel), `color`,
`background-color`, `font-weight`} — før: de adskiller sig på **én**, og med 0,5 px.

**Pris:** `assets/system.css` (1–2 regler) · 154 sider · ingen ny test nødvendig.

---

## 6. Hvad der skal blive, som det er — og hvorfor

Briefet siger: *"Planen må gerne sige, at noget skal blive, som det er. Skriv da hvorfor
— det er lige så meget en beslutning som en ændring, og den er lettere at glemme."*
**Disse seks er beslutninger, ikke udeladelser.**

### 6.1 `contain` + 4:3 bliver — også på det høje foto

Prisen er målt, og den er reel:

```
node shape-billedspild.mjs assets/fotos/fabrikant
  65 af 76 grundfotos læst (11 er avif/webp, som headerlæseren ikke kan — stikprøve)
  gns 18,6 % · median 21,7 % · max 50,7 % · min 0 %
  over 20 %: 33 af 65     over 30 %: 8 af 65     over 50 %: 1 af 65
  høje (ar<1): 7 · brede (ar>1,34): 38 · nær 4:3: 20
```

**Halvdelen af billedledet står tom på `yufan-lingmao-cyvet`.** Alligevel **bliver det**:
L78 valgte ét sideforhold og én fit for at stoppe drift, med den udtrykkelige
formulering *"ingen fladespecifik undtagelse, der kan drive fra hinanden igen"*. At give
robotsiden sit eget sideforhold ville genåbne præcis den beslutning, og den tomme flade
er den ærlige pris for aldrig at beskære.

**Uafhængig bekræftelse af den lukkede beslutning:** mit gennemsnit, **18,6 %**,
reproducerer L78's eget måletal for 4:3 med `contain` nøjagtigt — målt af en anden agent,
med en anden metode, en anden dag.

**Det, der ér åbent, og som hører til JPK, ikke til denne plan:** om den tomme flade skal
have en egen behandling (i dag hvid `--stans`) eller blive. Se **S6**.

### 6.2 De fire datatilstande bliver — urørt

`.v-tal`, `.v-nul`, `.v-nej`, `.v-ja`, `.v-ikke`, `.v-billede`. Hård begrænsning 5 er
**opfyldt i dag**, og det er efterprøvet, ikke antaget:

```
assets/system.css:691   TRE-TILSTANDS-ALFABET - .v-nej har et FYLDT kvadrat, .v-ja et
                        aabent med fyldt kerne, .v-ikke et STIPLET.
grep over alle 154 sider:  v-nej 22 · v-nul 16 · v-ikke 2946 — tre adskilte klasser
```

**Planen rører dem ikke, og ingen fremtidig fladeplan bør gøre det uden at læse
`system.css:691` først.** Det er sidens bedst gennemtænkte del.

**Én ting er målt og ikke rettet, fordi den er systemets og ikke fladens:**
`.v-nej` er fast 10,5 px, mens `.v-ja` og `.v-ikke` er em-baserede — to satsmetoder
inden for én firetilstandsfamilie. DESIGN.md noterer det selv. Det hører i S5's
oprydning, ikke her.

### 6.3 Foldens komposition bliver

To spalter, foto til venstre, nøgletal til højre, robotnavnet i 84 px over dem.
Set med egne øjne ved 1440 på `/da/` og `/en/`: **den virker.** Navn, producent, land,
status, klasse, billede og fem nøgletal er læst på under et sekund. P1 **udfylder**
denne komposition; den ændrer den ikke.

### 6.4 Robotsiden har ingen bevægelse — og skal ikke have nogen

Målt i 3.1: `transform` er `none` før og under hover på alle tre robotter. Briefets fund
1 gælder kataloget, ikke denne flade.

**Det er rigtigt for Read-modet.** Bevægelse er en invitation til at handle; katalogets
kort skal klikkes, robotsidens foto skal ses på. **Planen tilføjer ingen animation, ingen
hover-tilstand og ingen overgang** — og skriver det her, så den næste fladeplan ikke
"retter" en manglende bevægelse, der er tilsigtet.

### 6.5 Kildemærkets systematik bliver

29 mærker pr. robotside, hævet bogstav, `blaek2` efter L76, usynligt 24×24 px
berøringsmål, sekundær kilde stiplet. Systemet er rigtigt. **Kun dets skriftgrad er
omstridt, og den strid er S5's, ikke denne plans.**

### 6.6 Der er ingen købsknap, og der kommer ingen

Robotsiden har i dag nul købsknapper, nul affiliate-links og nul prisforespørgsler.
**Det skal blive sådan** — hård begrænsning 1 og *"Kom ikke igen med disse"*.
Skrevet her, fordi P1 lægger noget nyt i folden, og folden er præcis det sted, hvor en
fremtidig læser af planen ville føle trang til at sætte en handling.
Robotsidens eneste knap er og bliver `.videre` til producentens egen side.
