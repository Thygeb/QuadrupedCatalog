# KRITIK-1 — planen for den billeddrevne forside

Skrevet 21. august 2026, mens en anden agent bygger i `assets/` og `prototype/`.
Kritikken er skrevet for at kunne naa at aendre kursen, ikke for at dokumentere den.

**Selv-tjek:** Efterproevede 36 paastande mod projektets egne dokumenter, fandt 12 steder
hvor planen strider mod en truffet beslutning.

*Skrivemaade: dokumentet er dansk uden aa-oe-ae-tegn. STATUS.md's aabne punkter hedder derfor
`Aa3`, `Aa6`, `Aa10` her — det er de samme punkter som i STATUS.md.*

---

## Skillvalg (Regel 0)

`ls C:/Users/thyge/.claude/skills/` giver tre: `critique`, `impeccable`, `ui-ux-critique`.
Projektets egne i `.claude/skills/`: `robotdata`, `parallelt`.

**Valgt: `ui-ux-critique`.** Begrundelse: opgaven siger, at baade den og `critique` er skrevet
til noget bygget — men det er der. `prototype/v2-forside.html`, `v2-katalog.html`,
`v2-robot.html`, `v2-producent.html` og hele `dist/` er bygget og kan maales. Jeg har derfor
brugt skillen paa det byggede og planen paa det, der endnu kun er tekst. Skillens
kopiscanner er koert paa prototypen (resultat nedenfor).

**Gik forbi:** `critique` (samme maalgruppe som `ui-ux-critique`, men uden dens dansk-prosa-
katalog og uden dens krav om acceptkriterier pr. fund — den ville have givet mindre her).
`impeccable` (bygge- og formgivningssiden; den designer, den doemmer ikke).
`robotdata` (bruges naar en robotpost tilfoejes eller efterproeves — jeg efterproever
en plan, ikke en post, men jeg har brugt dens skema som maalestok).
`parallelt` (jeg deler ikke arbejde ud).

Prosascanneren: `scan_copy.py` paa `v2-forside.html` + `v2-robot.html` giver **1 kandidat**
paa 4.315 ord (blandet tiltale du/I paa robotsiden). Ingen hypeord, ingen oversaettelsesdansk.
**Prototypens tekst er den bedste del af projektet.** Det staar under "Behold dette".

---

## Dom

Den billeddrevne retning er ikke et designvalg. Den er et bytte: vi giver kildeangivelsen pr.
tal vaek og faar et fotografi tilbage — og fotografiet er laant, forkert paa mindst ét kort,
og fraevaerende paa tre robotter, som prototypen derfor allerede har smidt ud af kataloget.
Samtidig er forsidens nye akse, anvendelse, en akse hvor to af seks grupper indeholder
**én robot hver**, og hvor **9 af 46** ikke kan placeres.

Det maalbare kerneproblem: paa `dist/da/robotter/unitree-as2/index.html` — den gamle,
tabeldrevne bygning — staar hentedatoen `2026-08-19` paa **26 linjer**. Paa
`prototype/v2-robot.html` — den nye, billeddrevne — staar den paa **0**. Der er én
kildeangivelse tilbage paa hele siden, og den paastaar noget, der ikke er sandt for
halvdelen af kataloget.

Det er ikke en nedtoning af specifikationer. Det er en afmontering af det eneste,
PRODUCT.md siger, en konkurrent ikke kan kopiere uden at lave arbejdet.

---

## Fundene, rangeret efter hvad det koster at opdage dem sent

### K1 — [Blocker] Vi har afmonteret vores egen eksistensberettigelse, og det er allerede sket i kode

**Hvor:** `prototype/v2-robot.html:405-408` mod `dist/da/robotter/unitree-as2/index.html`.

**Bevis, maalt:**

| | v2 (billeddrevet) | dist (tabeldrevet) |
|---|---|---|
| Linjer med `hentet` | 1 | 26 |
| Linjer med `kilde` | 2 | 27 |
| Forekomster af `2026-08-19` | **0** | 26 |

Den ene tilbagevaerende kildeangivelse paa v2-robotsiden lyder ordret:

> "Alle tal paa denne side er laest paa producentens egen produktside
> https://www.unitree.com/As2 den 19.08.2026."

**Hvorfor det er det dyreste fund:** PRODUCT.md:45 — *"Hvert tal har en kilde og en
hentedato"* — er positioneringens punkt 1 af 3. PRODUCT.md:105 — *"Et tal uden kilde findes
ikke."* PLAN.md:33-35 — *"Kilde og dato paa hvert tal ... det eneste, der goer et katalog
citerbart."* PRODUCT.md:37-39 definerer succes som at kunne *"sende linket videre uden at
skulle forklare hvor tallene kommer fra."*

En side-fodnote gengiver ikke det. Den paastaar det. **Prototypens sidefod siger endda
ordret** (`v2-robot.html:427`): *"Hvert tal er producentens eget, med kilde og hentedato"* —
paa en side, hvor intet tal baerer nogen af delene. Det er noejagtig den fejl, `ui-ux-critique`
kalder en paastand i stedet for et bevis: siden fortaeller, at den er citerbar, i stedet for
at vaere det.

**Og paastanden er faktuelt forkert.** Maalt over alle 46 YAML-filer: **23 af 46 robotter
henter tal fra mere end én kilde-URL.** Boston Dynamics Spot henter 17 felter fra
produktsiden og **6 fra et PDF-datablad**; MagicDog-W henter fra fire forskellige URL'er,
heriblandt de to MagicLab-sites, der ifoelge Aa9 modsiger hinanden. En saetning, der siger
"alle tal paa denne side er laest paa <én URL>", er usand for halvdelen af kataloget og for
netop de poster, hvor det betyder mest.

**Fix — og det er ikke "vis alle 33 rakker igen":**
1. Hvert tal paa kortet og detaljesiden faar et lille, klikbart kildemaerke — en enkelt
   overskrift-agtig `sup` eller et punktum-tegn, der aabner kildelinjen. Det koster under
   1 % af kortets flade og tager hele K1 af bordet.
2. Detaljesidens kildeblok bliver en **liste over de faktiske distinkte URL'er** paa den
   post, ikke én saetning. Generatoren har allerede tallet.
3. Bygget faar en assertion: *ingen side maa paastaa én kilde, hvis posten har flere.*
   Skriv den som en test i `tests/`, ikke som en regel i en CLAUDE.md.

**Acceptkriterium:** paa en tilfaeldig detaljeside skal antallet af synlige, distinkte
kilde-URL'er vaere lig antallet i YAML-filen. Maalt, ikke skoennet.

---

### K2 — [Blocker] L15 er ikke trukket tilbage. Vi bygger paa en beslutning, der modsiger den gaeldende

**Hvor:** `STATUS.md:125` mod `DATAMODEL.md:192`.

**Bevis:** STATUS.md:125 staar uaendret og siger:

> **L15 | Informationsarkitektur | Forsiden organiseres efter vaegtklasse (under 20 kg ·
> 20-60 kg · over 60 kg), ikke efter producent.**

Commit `b992f81` hedder ordret *"Billedbeslutning, IA efter vaegtklasse"*. Den nye retning
findes kun ét sted i hele repoet — `DATAMODEL.md:192`: *"CEO'en vil have forsiden inddelt
efter anvendelse i stedet for vaegt"* — i en datamodelfil, som en midtvejs-saetning, uden
L-nummer, uden dato i beslutningstabellen, og uden at L15 er markeret som afloest.

**Hvorfor:** CLAUDE.md's dokumentregler og den globale regel *"Er det allerede besluttet?"*
findes praecis for at forhindre det her. Om fjorten dage kan ingen se, om anvendelse-aksen er
en truffet beslutning eller en agent, der huskede forkert. Prototypen `v2-forside.html`
implementerer i oevrigt stadig **vaegtklasse** ("Tre og fyrre firbenede robotter, sorteret
efter hvad de vejer") — saa der findes i dag to byggede sandheder om, hvad forsiden er.

**Fix:** foer der skrives mere kode: skriv **L19** i STATUS.md med begrundelse og dato, og
foej til L15 hvad der aendrede sig. Det tager fem minutter og er den billigste post paa
listen. Lad vaere med at slette L15 — en slettet beslutning efterlader ingenting, der siger,
at reglen nogensinde var der.

---

### K3 — [Blocker] Anvendelse duer ikke som forsideakse. Maalt: to grupper med én robot, én med ni ikke-placerbare

**Hvor:** alle 46 filer i `data/robots/`, grupperet efter foerste vaerdi i `anvendelse`
som `DATAMODEL.md:209-211` foreskriver.

**Bevis, maalt:**

| Gruppe | Antal | |
|---|---|---|
| industri | 12 | |
| **ikke_oplyst** | **9** | stoerre end fire af de seks rigtige grupper |
| inspektion | 8 | |
| forbruger_uddannelse | 8 | |
| forskning_udvikling | 7 | |
| **forsvar_beredskab** | **1** | Ghost Vision 60 |
| **logistik** | **1** | RIVR ONE |

**Hvorfor:** en forside med syv sektioner, hvor to indeholder ét kort, er ikke en
informationsarkitektur — det er en tom hylde med et skilt paa. Og "ikke oplyst"-bunken er
naestestoerst. Aa10 gaelder oveni: fem producenter saelger paa *security/patrol*, som ingen af
de seks vaerdier daekker, saa Vision 60 staar alene i `forsvar_beredskab`, mens de fem
patruljerobotter, der ligner den mest for en koeber, ligger spredt andre steder. Aa11 gaelder
ogsaa: B2-W (85 kg) og Go2-W (18 kg) er `ikke_oplyst`, mens deres moderrobotter er
placerede.

Det er ikke en femtedel, der ikke kan placeres. Det er **9 af 46 uden gruppe plus 2 grupper
med ét kort = 11 af 46, som forsiden ikke kan goere noget fornuftigt med.**

**Fix — behold anvendelse, men ikke som akse:**
- **Vaegtklasse bliver paa forsiden** som den primaere inddeling (L15 er stadig rigtig af
  praecis den grund, den blev skrevet: 43 robotter ligner hinanden, og vaegt er den eneste
  forskel, en koeber baade kan se og bruge — og vaegt er maalt paa 38 af 46, mod
  anvendelse-daekning paa 37 af 46 med de skaevheder ovenfor).
- **Anvendelse bliver et filter og et maerke paa kortet**, hvor `ikke_oplyst` er en
  valgbar tilstand som PRODUCT.md:61 kraever. Et filter med en gruppe paa 1 er
  uproblematisk; en forsidesektion med en gruppe paa 1 er pinlig.
- Foerst naar Aa10 og Aa11 er lukkede, og ingen gruppe er under 4, kan aksen genovervejes.

---

### K4 — [Blocker] Den foerste vaerdi er vores slutning, ikke producentens. Reglen indfoerer praecis den redaktionelle dom, den blev skrevet for at undgaa

**Hvor:** `DATAMODEL.md:209-211`.

**Bevis, ordret:** *"Staar der flere, er den foerste producentens hovedpositionering; det er
den, en forsidegruppering skal bruge."*

Maalt: **27 af 46 robotter har flere end én anvendelse.** DEEP Lynx M20, M20-Pro og M20S
opgiver hver **fem** (`industri + inspektion + forsvar_beredskab + logistik +
forskning_udvikling`) og ville staa i én. Og det haardeste tilfaelde:

| Robotter | Anvendelse | Havner i |
|---|---|---|
| Lite3, A1, As2, Go1, Go2 | `forbruger_uddannelse + forskning_udvikling` | Forbruger |
| MagicDog EDU, MagicDog Pro, e-Dog, Y10, Y20 | `forskning_udvikling + forbruger_uddannelse` | Forskning |

**Ti robotter, samme to kategorier, delt praecis paa midten af raekkefoelgen i en
producents navigationsmenu.**

**Hvorfor:** DATAMODEL.md:192-196 skriver selv, at en redaktionel inddeling ville falde for
CLAUDE.md begraensning 6 — *"en konklusion skrevet om til en kategori"* — og at loesningen er
at lade producenterne inddele. Men R16 kraever kun citat paa **at** kategorien er naevnt.
Den kraever intet om **raekkefoelgen**, og raekkefoelgen er praecis det, der afgoer, hvor
kortet lander. Beviskravet er lagt paa det led, der ikke betyder noget, og er fravaerende paa
det led, der bestemmer forsiden. `tools/efterproev-anvendelse.mjs` maalte 53 citater og 0
fejl — men den kan ikke maale den slutning, fordi slutningen ikke staar i noget citat.

**Fix:** drop begrebet "hovedpositionering". En robot med tre anvendelser hoerer til i alle
tre, eller i ingen. Konkret: goer anvendelse til et **flervaerdi-filter** (K3's fix), hvor
Lynx M20 dukker op under alle fem, som producenten selv siger. Saa forsvinder baade
slutningen og behovet for at rangere producentens ord.

---

### K5 — [Blocker] Prototypen har allerede smidt tre robotter ud af kataloget, fordi de manglede et billede

**Hvor:** `prototype/v2-forside.html` og `v2-katalog.html`.

**Bevis, maalt:** `data/robots/` har **46** filer. Prototypen har **43 kort**.
`grep -c` giver **0 forekomster** af `raion-robotics-raibo2`, `unitree-laikago` og
`xiaomi-cyberdog-1` i begge filer. De tre er praecis de tre, der ikke har en mappe i
`media/robotbilleder/` (43 mapper). Sidens egen overskrift siger *"Tre og fyrre firbenede
robotter"* og *"43 modeller · 12 producenter"* — den ved ikke, at den mangler tre.

**Hvorfor:** PRODUCT.md:32 — *"Et komplet, kildeangivet opslagsvaerk"*. PRODUCT.md:109 —
*"Faerdigt slaar stort. 60 komplette poster er mere vaerd end 235 halve."* PLAN.md:21 —
*"Feltet kan goeres faerdigt ... Hele strategien nedenfor foelger af, at vi kan naa bunden af
feltet."* Et katalog, hvis fuldstaendighed afhaenger af, om vi kunne finde et JPEG, er ikke
faerdigt — og det er den ene ting, humanoid.guide ikke kan tage fra os.

Det er ogsaa den mest lumske fejl paa listen: den er tavs. Ingen advarsel, intet hul, ingen
taelling der ikke gaar op. **Sammenlign med R2 i STATUS.md** — en 404-side gemt under et navn,
der lovede indhold, kunne kun fanges, fordi nogen taalte manifestet.

**Fix:**
1. Bygget faar en haard assertion: *antal kort paa forsiden === antal filer i
   `data/robots/`*. Fejler den, stopper bygget. Skriv den i `tests/` i dag.
2. En robot uden billede faar et kort med en **maaltro silhuet** (Aa3's anbefaling, PLAN.md
   afsnit 9) eller en ren, tom billedplads med teksten "ingen brugbar optagelse" — som
   prototypen faktisk allerede goer paa Honey Badger 4. Moenstret findes. Det bliver bare
   ikke brugt paa de tre.

---

### K6 — [Blocker] Billedmaterialet kan ikke baere en billeddrevet side. Maalt paa tre maader

**Hvor:** `media/robotbilleder/MANIFEST.tsv`, 216 linjer.

**Bevis 1 — billederne er ikke unikke.** Af de 43 rang-1-billeder er der kun **35 distinkte
SHA-256**. **15 robotter deler 7 billeder.** De vaerste:

| Deler billede | Robotter |
|---|---|
| `78b9a309…` | Lynx M20, M20-Pro, M20S |
| `eecfc3ff…` | **Jueying Lite3 (12 kg) og X20 (53 kg)** |
| `4c8d2840…` | Honey Badger 4.0 og 5.0 |
| `ff500f38…` | AlphaDog C500 og C501 |
| `ee8e79fe…` | AlphaDog E300 og E400L |
| `fe02e8ae…` | MagicDog EDU og Pro |
| `eeb925ea…` | X30 og X30 Pro |

Lite3 og X20 er ikke varianter. De er to forskellige maskiner med en faktor 4 i vaegt, og de
faar samme fotografi. Paa en side, hvis hele argument er, at *"paa fotografiet ligner de
hinanden — det goer de ikke i praksis"*, er det selvmodsigende.

**Bevis 2 — mindst ét billede viser den forkerte robot.**
`ghost-robotics-spirit-40-1.jpg` (rang 1) har SHA `4f916b6389c9c03a…`. Det er **samme fil**
som `ghost-robotics-vision-60-3.jpg`. Alle fem Spirit 40-billeder er hentet fra
`https://www.ghostrobotics.io/` — forsiden — ikke fra en Spirit 40-produktside. Grunden staar
i STATUS.md R2: `ghost_s40.html` i vest-saettet er en 404-side gemt under et navn, der lovede
Spirit 40. Der findes altsaa **ingen dokumentation for, at noget af Spirit 40-materialet
viser en Spirit 40**. Samme post har maalt **0 udfyldte felter af 33**. Kortet ville blive:
et fotografi af en anden robot, et navn, og seks tomme pladser.

**Bevis 3 — den automatiske rangering virker ikke.** Af de 41 billeder, forsiden bruger,
er kun **20 rang 1**. 21 er rang 2-5, valgt om i haanden. Det bekraefter den manuelle
kontrols konklusion. Aarsagen staar i `media/_arbejde/vaelg.mjs`: rangeringen scorer paa
filstoerrelse, pixelmaal, sideforhold og filnavns-gaet — ingen af delene ved, hvad der er
paa billedet. `indhold_gaet` er `usikkert` paa **14 af 43** rang-1-valg.

**Bevis 4 — det billede, forsiden bruger til Go2, er en reklame.**
`unitree-go2-4.jpg`, 3840×2146, aabnet og set: overskriften *"Scientific and Technological
Sovereignty to Unitree Go 2"* og underrubrikken *"a smart and improved partner"* er brandt
ind i pixels, paa engelsk, paa sort baggrund.

Det bryder fire ting paa én gang:
- **L16** (STATUS.md:122): ORBIT-tonen skal bruges *"uden dets salgsarkitektur: ... ingen
  superlativer, ingen renderede produktfotos."* Billedet er et render og baerer en superlativ.
- **PRODUCT.md:90**: *"ingen superlativer"* — vi ville udgive producentens.
- **PLAN.md afsnit 7 / PRODUCT.md:68-70**: sprogarkitekturen kan aldrig oversaette tekst,
  der ligger i en JPEG. Paa `/en/` er den tilfaeldigvis rigtig; paa `/da/` er den engelsk;
  paa et fremtidigt `/de/` er den stadig engelsk.
- **L16's lyse grundtone**: et sort billede i et hvidt panel.

**Hvorfor det haenger sammen med spaerringen:** ved lancering skal alle billederne alligevel
vaek (S1). Vi bygger altsaa en side, hvis baerende element er defineret som midlertidigt, og
hvis erstatning — silhuetter — har helt andre proportioner, andet sideforhold og ingen
baggrund. Layoutet skal laves om to gange.

**Fix — og det er den beslutning, der har stoerst udbytte paa listen:**
Byg forsiden paa **maaltro silhuetter i faelles maalestok fra dag ét** (PLAN.md afsnit 9,
mulighed 1, som selv kalder dem *"bedre end fotos til sammenligning"* og *"sidens visuelle
signatur frem for dens kompromis"*). Fabrikantfotoet bliver et sekundaert element paa
detaljesiden, hvor det kan fjernes uden at layoutet vaelter. Saa:
- forsvinder K5 (en silhuet kan altid tegnes ud af maal, og maal har 38 af 46),
- forsvinder de syv delte billeder,
- forsvinder Spirit 40-problemet (vi tegner ikke en robot, vi ikke har maal paa — vi viser
  et tomt felt),
- forsvinder Go2-reklamen,
- og S1 holder op med at vaere en bombe under lanceringen.

**Acceptkriterium:** ingen to robotter deler billedfil; hver billedfil er koblet til den
robot, den viser, via en kilde-URL paa robottens egen produktside — ikke producentens forside.

---

### K7 — [Major] Kortets seks tal findes ikke i data. Maalt: 3 robotter af 46 har alle seks

**Hvor:** kortdefinitionen (vaegt, nyttelast, driftstid, fart, IP, CE) mod `data/robots/`.

**Bevis, maalt over 46 poster:**

| Felt | Har vaerdi | |
|---|---|---|
| egenvaegt | 38 | |
| nyttelast_gaaende | 36 | |
| hastighed | 29 | |
| driftstid | 27 | |
| ip_klasse | 26 | |
| **ce_oplyst** | **11** heraf kun **2 = ja**, 2 = nej | |

Udfyldningsgrad pr. kort:

| Udfyldte af 6 | Robotter |
|---|---|
| 6 | **3** |
| 5 | 14 |
| 4 | 11 |
| 3 | 9 |
| 2 | 4 |
| **0** | **5** |

Samlet feltudfyldning over hele kataloget: **640 af 1.518 = 42,2 %.**

**Hvorfor:** DATAMODEL.md:36-39 skrev advarslen selv, foer nogen tegnede noget:

> *"ikke oplyst" er ikke en undtagelse, det er naesten halvdelen af kataloget. En detaljeside,
> der er tegnet med udfyldte felter i tankerne og har et graat hul, hvor et tal mangler, vil
> se oedelagt ud paa hver eneste post.*

Et kort med seks faste pladser er praecis den tegning. Paa 43 af 46 kort vil mindst én plads
sige "ikke oplyst"; paa 18 kort vil halvdelen eller mere. Og CE — som er positioneringens
punkt 2 (PRODUCT.md:46-50) — kan besvares med et **ja** paa **2 af 46**.

**Fix:** kortet faar **ikke** seks faste pladser. Det faar de tal, posten faktisk har, i fast
raekkefoelge, og en enkelt, rolig linje der siger hvor mange felter producenten har
undladt — det tal er allerede sidens hovedtal (specifikationstaethed). Saa bliver tomheden
til information i stedet for et hul. PRODUCT.md:107's tre tilstande skal stadig se
forskellige ud, men de behoever ikke hver sin faste boks.

---

### K8 — [Major] EU-kolonnen er positioneringens punkt 2 og har i dag naesten ingen data

**Hvor:** `data/robots/`, felterne i gruppen "Kommercielt og EU".

**Bevis, maalt over 46:**

| Felt | Robotter med brugbar vaerdi |
|---|---|
| `ce_oplyst` = ja | **2** |
| `eu_tilgaengelig` | **0** |
| `eu_service` | **0** |
| `leveringstid` | **0** |
| `pris` | **2** |

Dertil Aa6: EU-kolonnens hovedpaastand — *at koeberen bliver importoer ved direkte koeb fra
Asien* (PLAN.md:37-38) — har **ingen primaerkilde** for import til eget brug.

**Hvorfor:** L15 lagde EU-kolonnen paa producentsiderne, altsaa et niveau bag forsiden. Det
er en rimelig placering for noget, der er udfyldt. For noget, der er 0 % udfyldt paa tre af
fem felter, er det en side, der lover en kolonne og viser en tom tabel. Og PLAN.md afsnit 6
lister filtre, der ikke kan bygges: `tilgaengelig i EU` (0 %), `CE oplyst` (4 %),
`prisinterval` (4 %), `ROS 2` (9 %), `armoption findes` (9 %), `SDK` (11 %).
**Seks af elleve navngivne filtre har under 12 % daekning.**

Bemaerk ogsaa STATUS.md's egen rettelsesliste (linje 98): sprogkravet er **dansk**, ikke "et
EU-sprog" — BEK 727 §§ 3, 4, 6. Det staar stadig forkert i PRODUCT.md:47 og PLAN.md:39.

**Fix:** enten
(a) udskyd producentsiderne til efter en dedikeret EU-dataindsamling, og lad EU-kolonnen
vaere ét felt paa detaljesiden indtil da; eller
(b) byg producentsiden nu, men lad EU-blokken vaere en **eksplicit "vi har spurgt, her er
hvad vi ved"-blok** med tilstanden "ikke oplyst" som hovedindhold. Mulighed (b) er faktisk
staerk journalistik — 0 af 46 producenter oplyser et servicepunkt i EU **er** en historie —
men kun hvis den skrives som en konklusion om producenterne, ikke som et hul hos os.
Vaelg bevidst. Lad vaere med at bygge tabellen og opdage tomheden bagefter.

---

### K9 — [Major] D7 blokerer ikke rangeringen. D4 goer. De to er byttet om i STATUS.md

**Hvor:** `STATUS.md:45` mod `STATUS.md:44` og `STATUS.md:71-74`.

**Bevis, maalt.** Jeg beregnede specifikationstaetheden for alle 46 robotter med
`tools/validate.mjs`' egen `taethed()` og sammenlignede raekkefoelgen:

```
raekkefoelge 29 vs 31 ens?  true
raekkefoelge 29 vs 33 ens?  true
raekkefoelge D4=false vs D4=true (n=29) ens?  false — 16 af 46 pladser flytter sig
```

Unitree Go2: 48 % ved 29, 45 % ved 31, 42 % ved 33 — niveauet flytter sig, praecis som
STATUS.md skriver. Men **alle 46 flytter sig med samme faktor**, saa raekkefoelgen er
byte-identisk. En konstant naevner kan matematisk ikke aendre en rangering.

STATUS.md:71-72 siger: *"valget aendrer raekkefoelgen, ikke bare niveauet — Unitree Go2
stiger fra 45 % til 48 %"*. Det foerste led foelger ikke af det andet. Omrokeringen, notatet
husker, kom fra **L6's feltopsplitning** (taelleren aendrede sig), ikke fra naevneren.

**Hvorfor det betyder noget:** D7 staar som *"Blokerer sidens eneste rangering"* og venter
paa JPK. D4 staar som et almindeligt spoergsmaal paa linjen ovenfor. Det er omvendt. **D4
flytter 16 af 46 pladser; D7 flytter 0.** Vi venter paa den forkerte beslutning, og imens
staar den, der faktisk aendrer rangeringen, uden markering.

Dertil: skemaet har **33 felter** (`tools/skema.mjs:187` siger det selv), mens D7 stiller
valget som "29 eller 31". Der er en tredje kandidat, ingen har naevnt i STATUS.md.

**Fix:** ombyt praeferencen. Luk **D4** foerst — den er en metodebeslutning med ét
acceptkriterium ("taeller `3D LiDAR ×1` som oplyst? ja/nej") og den aendrer, hvem der staar
oeverst. D7 kan derefter afgoeres i ro; vaelg 33, fordi det er antallet af felter, koden
faktisk har, og skriv i metoden, at historiske tal med 29 ikke er sammenlignelige.
`build.mjs`' nuvaerende loesning — vis begge naevnere — er en god midlertidig ting, men to
procenttal ved siden af hinanden er ikke en rangering, en laeser kan bruge.

---

### K10 — [Major] Syv af PLAN.md's ti sider findes ikke i bid 1-7, heriblandt de to, der baerer troevaerdigheden

**Hvor:** `PLAN.md:97-108` mod `ls dist/` og `tools/build.mjs:571-577`.

**Bevis:** bygget udsender i dag `/<sprog>/`, `/<sprog>/robotter/` og
`/<sprog>/robotter/<slug>/`. **Mangler:** `/sammenlign/`, `/producenter/`,
`/producenter/<navn>/`, `/metode/`, `/ordbog/`, `/om/`, `/ret/`.

**Hvorfor:**
- PLAN.md:114 — *"`/metode/` er hele troevaerdigheden. Den skal sige hvad vi ikke goer."*
  Uden den er specifikationstaetheden et tal uden metode, og saa er den praecis den
  konstruktion, CLAUDE.md begraensning 6 forbyder: en score uden offentliggjort metode med
  acceptkriterier. **Vi har erstattet konkurrentens 1-5-score med et procenttal, hvis metode
  ikke er udgivet.** Det er ikke bedre, foer `/metode/` findes.
- PRODUCT.md:87-88 — *"Bindende: KeyResearch naevnes som udgiver, og linjen om ingen
  forhandleraftale med nogen fabrikant staar paa Om-siden."* Der er ingen Om-side. Linjen
  staar i sidefoden, hvilket er godt, men den bindende forpligtelse er ikke opfyldt.
- PLAN.md:116-117 — `/ordbog/` er det, der goer siden brugbar for indkoeb frem for
  ingenioerer, og indkoeberen er PRODUCT.md's primaere bruger.

**Fix:** `/metode/` og `/om/` er ikke "bid 6" som PLAN.md:215 siger. De er bid 1. De er to
statiske sider med tekst, vi allerede har skrevet i PRODUCT.md og STATUS.md, og de er
forudsaetningen for, at taethedstallet overhovedet maa staa paa en side.

---

### K11 — [Major] Prototypen laeser billeder direkte fra `media/`, som aldrig maa indgaa i et byg

**Hvor:** `prototype/v2-forside.html` — **42 forekomster** af `src="../media/robotbilleder/…"`.
Samme i `v2-katalog.html` (42), `v2-producent.html` (13), `v2-robot.html` (2).

**Hvorfor:** CLAUDE.md, afsnittet Mappestruktur:

> **`dist/` bygges kun fra `assets/`.** `media/` indgaar aldrig i bygget — det er den
> strukturelle haandhaevelse af, at fabrikanternes materiale ikke kan slippe ud ved et uheld.

Prototypen er ikke `dist/`, og prototypens egen spaerringsbanner er forbilledligt aerlig om
forholdet. Men to ting bliver til gaeld:
1. `media/robotbilleder/` er gitignoreret (`media/robotbilleder/.gitignore` = `*`). En anden
   agent, der kloner repoet og aabner `v2-forside.html`, ser **41 brudte billeder** og en
   side, der ikke ligner noget. Prototypen kan altsaa ikke bruges som det, den er til:
   et delt beslutningsgrundlag.
2. Naar generatoren om lidt skal producere det samme layout, er den korteste vej at pege
   samme sted hen. Den strukturelle spaerring er kun spaerrende, saa laenge ingen har
   skrevet stien én gang.

**Fix:** indfoer nu en `assets/billeder/`-mappe med **silhuetter** (K6) og lad prototypen
pege der. Fabrikantfotoerne bliver i `media/` og vises kun via en lokal
udviklings-flag (`?fotos=1`), som bygget aldrig saetter. Og skriv en test, der fejler, hvis
strengen `media/` optraeder i noget under `dist/`.

**Sidebemaerkning:** `.gitignore` indeholder blokken `media/inspiration/**` **to gange**
(linje 7-8 og 26-27). Harmloest, men det er den slags dobbelthed, der senere goer, at nogen
retter den ene og tror, det virkede.

---

### K12 — [Major] Engelsk og `hreflang` findes i generatoren, men ikke i den nye retning

**Hvor:** `prototype/v2-*.html`.

**Bevis, maalt:** `hreflang` optraeder **0 gange** i alle fire v2-filer. `<html lang="da">`,
ingen sprogskifter, ingen `/en/`-pendant. Til sammenligning: `dist/` har `/da/` og `/en/`,
hreflang-alternativer og `x-default` (`build.mjs:249-259`), og `data/i18n/` har **130 noegler
i da.json og 130 i en.json, ingen manglende** — kun 16 strenge er identiske, og de er
aegte ens ("LiDAR", "Japan", "ROS 2").

**Hvorfor:** L3 og PRODUCT.md:68-70 goer sprogarkitekturen til en arkitekturregel, *"der ikke
maa brydes"* (CLAUDE.md, afsnittet Sprog). Sprogtilfoejelse er billig, saa laenge den er med
fra starten, og dyr bagefter — det er hele grunden til, at `data-en`-loesningen fra
salgsprojektet er forbudt. En billeddrevet forside, der bygges paa dansk alene og skal
tosproges bagefter, gaar samme vej.

Dertil: prototypens sidefod paastaar *"Hele indholdet virker uden JavaScript"*. Der er **0
`<noscript>`** og 1 `<script>` i `v2-forside.html`. Paastanden er sandsynligvis sand
(filtrene er beskrevet som rene CSS-regler), men den er ikke efterproevet, og PRODUCT.md:73
goer den til et krav. **Maal den** — sluk JS i browseren og tael kortene — i stedet for at
skrive den.

**Fix:** generatoren skal producere v2-layoutet, ikke omvendt. Naar `build.mjs` er kilden
til prototypen, faelger sprog, hreflang og no-JS med gratis, fordi de allerede er loest der.
Hver time, v2 lever som haandskrevet HTML, er en time, hvor de to divergerer.

---

### Yderligere fund, kort (ikke uddybet)

- **[Minor] To kodninger af samme tilstand.** `ce_oplyst` staar som den bare skalar
  `ikke_oplyst` paa 35 poster og som `vaerdi: ikke_oplyst` inde i en post paa 7. Validatoren
  slipper begge igennem. PRODUCT.md:107 kraever, at tilstande er entydige; to former for
  samme tilstand er starten paa, at de holder op med at se ens ud.
- **[Minor] `dist/`'s forside modsiger L14 ordret.** `dist/da/index.html` siger *"Et
  opslagsvaerk med kilde og dato paa hvert tal"* — L14 siger *"Billeddrevet browsing, ikke
  opslagsvaerk"*. To byggede sandheder, ingen som er markeret forael.
- **[Minor] `unitree-b2` henter et felt fra `shop.unitree.com`.** Feltet er `pris` med
  vaerdien `ikke_oplyst` og en fremragende `advarsel` om, at butikkens 100.000 USD er en
  pladsholder. Datamaessigt korrekt. Men bliver kilde-URL'er synlige (K1's fix), staar der et
  klikbart link til producentens webshop paa en side, der ikke maa kunne laeses som
  salgskanal (CLAUDE.md begraensning 1). Beslut, hvordan shop-URL'er vises, **inden** de
  bliver synlige.
- **[Note] Aa7 er stadig ikke rettet.** PLAN.md:17 siger *"omkring 42 producenter"*.
  STATUS.md:58 siger, tallet ikke kan citeres og reelt er ≥57. PLAN.md:21 kalder det
  *"planens vigtigste enkelttal"*. Et ukildet tal, der baerer hele strategien, paa en side
  hvis loefte er kildeangivelse.

---

## Behold dette

Fem ting, der skal overleve en rettelsesrunde. En omskrivning, der loeser K1-K6 og
oedelaegger disse, er et nettotab.

1. **Prototypens sprog.** Kopiscanneren fandt **1 kandidat paa 4.315 ord**, og den var en
   blandet tiltale. Ingen hypeord, ingen oversaettelsesdansk, ingen superlativer. Linjer som
   *"Paa fotografiet ligner de hinanden. Det goer de ikke i praksis"* og *"Det er ikke hele
   databladet, og det skal det ikke vaere"* er praecis den tone, PRODUCT.md:89-90 beskriver,
   og de kunne ikke staa paa nogen konkurrents side. Det er sjaeldent godt.
2. **Spaerringsbanneret.** Prototypen skriver oeverst paa hver side, at billederne er laant,
   hvorfra, hvorfor de ikke maa udgives, og hvad der skal ske foer lancering. Det er
   noejagtig modgiften mod den pladsholder, der overlevede til lancering paa nabosiden.
   Det maa ikke fjernes, foer billederne er.
3. **"Ingen brugbar optagelse"-kortet paa Honey Badger 4.** Prototypen har allerede et
   aerligt tomt billedfelt med en forklaring paa, hvad der blev hentet. Det er loesningen paa
   K5 — den skal bare bruges paa de tre robotter, der i dag bare mangler.
4. **`tools/`-laget.** `skema.mjs` haandterer D7 som en parameter og skriver selv, at den er
   uafgjort (linje 186-191). `validate.mjs` fejler paa manglende enhed eller kilde.
   `efterproev-anvendelse.mjs` slaar hvert citat op i den gemte raafil. `yaml.mjs` naegter at
   forstaa konstruktioner, den ikke understoetter, i stedet for at gaette. Det er det bedst
   byggede i projektet, og K1's fix er billig praecis fordi det ligger der.
5. **`operator` og `advarsel` i datamodellen.** `> 40 kg` frem for `40 kg`, og
   B2-advarslen om, at producenten bruger to forskellige uligheder paa samme side. Det er
   den slags detalje, der goer et opslagsvaerk citerbart frem for en afskrift — og den
   overlever kun, hvis tallene stadig staar med deres kilde (K1).

---

## Det jeg ikke kunne bedoemme

- **Den byggede sides visuelle indtryk.** Jeg har ikke renderet nogen HTML i en browser.
  Alt om rytme, traengsel, kontrast i praksis og ORBIT-tonens faktiske virkning er ikke
  vurderet. `prototype/kontrast-v2.mjs` og `tjek-v2.mjs` findes; jeg har ikke koert dem, da
  en anden agent arbejder i mappen.
- **Om no-JS-paastanden holder.** Kraever en browser med JS slaaet fra. Se K12.
- **Om de 21 haandvalgte billeder viser den rigtige robot.** Jeg aabnede to
  (`unitree-go2-4.jpg` og ORBIT-konceptet) og verificerede ét sammenfald via SHA-256. De
  oevrige 40 er ikke set med oejnene. **K6's Bevis 2 er derfor en nedre graense, ikke et
  facit.**
- **Om CEO'en har truffet anvendelse-beslutningen mundtligt.** DATAMODEL.md:192 siger, at
  han vil have det. Jeg kan ikke se, hvornaar, eller om L15 blev droeftet. Hvis beslutningen
  er truffet, aendrer K2 sig fra en indvending til en dokumentationsopgave — men K3 og K4
  gaelder uaendret, for de handler om, hvorvidt aksen kan baere, ikke om hvem der valgte den.
- **Aa1, Aa5 og Aa8-Aa9.** Navn, vedligehold og de to kildespoergsmaal er uden for kritikken.

---

## Hvordan der blev maalt

Alle tal i dokumentet er maalt, ikke skoennet. Metoden, saa den kan efterproeves:

- **Feltdaekning og anvendelse:** fire smaa Node-scripts, der laeser alle 46 filer i
  `data/robots/` med projektets egen `tools/yaml.mjs`, saa taellingen bruger samme parser som
  validatoren. Ikke regulaere udtryk — mit foerste forsoeg med `grep` gav 46 forkerte svar,
  fordi `citat` kan vaere en liste.
- **Rangeringen (K9):** `tools/validate.mjs`' egen `taethed()` koert over alle 46 poster med
  naevnerne 29, 31 og 33 og med D4 baade sand og falsk; raekkefoelgerne sammenlignet element
  for element.
- **Billederne:** `MANIFEST.tsv` via `awk` paa rang-1-raekkerne, SHA-256-kolonnen talt med
  `sort | uniq -c`. `unitree-go2-4.jpg` aabnet og laest.
- **Prototypen mod data:** `grep -c` paa slug pr. fil; kort talt med `grep -o 'class="kort'`.
- **Kilde og dato:** `grep -c` paa `kilde`, `hentet` og `2026-08-19` i v2-filerne og i
  `dist/da/robotter/unitree-as2/index.html`.
- **Prosa:** `scan_copy.py` fra `ui-ux-critique` paa `v2-forside.html` og `v2-robot.html`.

Arbejdsscripts ligger i sessionens scratchpad og er ikke skrevet ind i projektet.
