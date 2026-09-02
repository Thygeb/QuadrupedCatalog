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
