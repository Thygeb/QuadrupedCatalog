# KRITIK-3-side.md — evaluering af de fire sider

26. aug 2026, bestilt af JPK med fire fuldsideskud fra `localhost:8080`
(`da/`, `da/robotter/`, `da/sammenligning/`, `da/producenter/`) og ordene
*"det er meget dårligt formateret i sin form nu, billederne er skæve, find selv
andre fejl"*.

Reviewet er orkestratorens (Opus). **Alle tal nedenfor er målt med en kommando,
der står ved fundet** — ingen af dem er skønnet fra skuddene. Det er
med vilje: JPK's skud er taget før genopbygningen 26. aug, så de viser
kortfodnoter og CE-mærker, der allerede er på vej ud. Skuddene kan altså ikke
bruges som bevis, kun som anledning. Målingerne er kørt mod `dist/` bygget af
`5b0cd37`.

**Fire spor kører, mens dette skrives**, og fem af KRITIK-2's fund er i deres
hænder. Fundene her er dem, *ingen* af de fire rører.

---

## Dom

Skuddene viser ikke ét formateringsproblem, men to forskellige, som er blevet
blandet sammen. **Det ene er billedrammen:** 16 af 54 fotografier bliver
beskåret hårdt, fordi de tvinges ind i et 16:10-vindue, og fire af dem er
portrætter, hvor over halvdelen af billedet forsvinder. Det er den, JPK ser
som "skæve billeder", og den har en færdig løsning liggende i koden, som
aldrig bliver kaldt. **Det andet er kortets højde:** nøgletalsstriben svinger
fra 0 til 4 tal pr. kort, så gitteret bliver takket uanset hvad billederne
gør.

Men den dyreste fejl står ikke i skuddene, den står i data: **9 af 30 felter
bærer blandede enheder på tværs af kataloget.** Go2 er 70 cm lang, Spot er
1.100 mm lang, og de to tal står ved siden af hinanden i samme række på
sammenligningssiden. Sidens ene løfte er at sammenligne felt for felt, og
det løfte kan ikke indfries, hvis læseren skal gange i hovedet undervejs.

---

## På tværs af alle sider

### K1. [Blocker] 16 af 54 billeder beskæres hårdt — og løsningen findes allerede, ubrugt

**Hvor:** `assets/system.css:440-443` — `.billedled{aspect-ratio:16/10}` med
`.billedled img{object-fit:cover}`.

**Bevis, målt på billedfilernes egne dimensioner:** 38 af 54 billeder ligger
inden for 25 % af 16:10. **16 gør ikke.** De værste er portrætter, hvor
`cover` skærer top og bund væk:

| Fil | Format | Forhold | Afvigelse fra 16:10 |
|---|---|---|---|
| `yufan-lingmao-cyvet.jpg` | 750×1140 | 0,66 | 59 % |
| `unitree-aliengo.jpg` | 1334×1850 | 0,72 | 55 % |
| `magiclab-magicdog-{edu,pro,w}.png` | 697×840 | 0,83 | 48 % (tre filer) |
| `unitree-laikago.jpg` | 3000×1280 | 2,34 | 46 % |
| `weilan-babyalpha.jpg` | 1428×1486 | 0,96 | 40 % |

**Det afgørende:** `system.css:448` definerer allerede
`.billedled--plade img{object-fit:contain;padding:6% 7%}` — præcis den regel,
et produktudklip på hvid bund skal have. Klassen sættes af
`side.mjs:175` ud fra `billedPlade(b)`. Målt i det byggede katalog:

```
grep -o "billedled--plade" dist/da/robotter/index.html | wc -l   →  0
```

**Nul.** Kodestien findes, CSS-reglen findes, ingen robot udløser den.
Det er projektets egen regel om at efterprøve, at noget *når* koden: at en
regel står i filen, beviser ikke, at nogen kalder den.

**Fix:** find ud af, hvad `billedPlade()` kræver, og hvorfor betingelsen aldrig
er sand. Sæt derefter `plade` automatisk, når billedets eget sideforhold
afviger mere end ~25 % fra 16:10 — så vælger rammen sig selv ud fra filen i
stedet for et felt, nogen skal huske at sætte.

**Accept:** `grep -o "billedled--plade" dist/da/robotter/index.html | wc -l`
giver mindst 16, og de fire portrætbilleder vises ubeskåret.

---

### K2. [Blocker] Fire kort viser en helt tom kasse

**Hvor:** katalogsiden, kortene for **Trakr 5, Trakr 20, Shvana** og
**NEURA Quadruped**.

**Bevis:** 77 kort. 54 har et fotografi. 19 har en måleplade. `77 − 54 − 19 = 4`
har ingen af delene og renderer et tomt felt i panelfarve. Målt direkte i
bygget ved at dele på `<article class="kort"` og tælle kort uden både `<img`
og `billedled--maal`.

**Hvorfor:** måleplade-løsningen er sidens bedste idé — et hul lavet om til
information — og KRITIK-2 satte den udtrykkeligt på *Behold dette*-listen.
Men den kræver længde **og** højde, og de fire robotter mangler mindst ét af
målene. De falder derfor igennem begge net og ender med det, der ligner en
indlæsningsfejl.

**Fix:** en tredje tilstand for "hverken foto eller mål" — fx robottens
silhuet eller en tekstplade, der siger, hvad der mangler. En tom kasse er den
eneste af de fire datatilstande, siden ikke har besluttet sig for.

**Accept:** 0 kort i bygget uden både `<img` og en pladeklasse.

---

### K3. [Major] Nøgletalsstriben svinger fra 0 til 4 tal — gitteret bliver takket

**Bevis, målt over de 77 kort:**

| Nøgletal på kortet | Antal kort |
|---|---|
| 4 | 55 |
| 3 | 11 |
| 2 | 3 |
| 1 | 2 |
| **0** | **6** |

Seks kort har altså navn, producent og **ingen tal overhovedet**.

### RETTET SAMME DAG — min første forklaring var forkert

Jeg skrev oprindeligt, at dette gav *"kort med meget forskellig højde i samme
række — det takkede gitter"*. **Det er målt forkert.** Med Playwright installeret
kunne jeg måle i browseren i stedet for at slutte mig til det fra strukturen:

```
stoersteSpringIRaekke: 0      spildtLodretPx: 0
kortHoejde: lavest 600 · hoejest 806      raekker: 21
```

Gitteret strækker alle kort i en række til samme højde. **Inden for en række er
raggedheden nul px.** Der er intet takket gitter.

Det, der faktisk er galt, er to andre ting:

1. **Rækkerne svinger 600 → 806 px** — et spring på 206 px fra den laveste til
   den højeste af de 21 rækker. Rytmen ned gennem siden er ujævn, ikke kanten.
2. **Et mindretal af kort bærer meget dødt bundrum.** Medianen er **13 px** —
   de fleste kort er stramme. Men de værste har 206-211 px tomt under indholdet
   (As2, Gangben L2, RIVR ONE), fordi de sidder i en række, et højt kort har
   strakt. Blandt kortene uden nøgletal: Spirit 40 181 px, ANYmal X 174 px,
   BabyAlpha 174 px — mens AlphaDog E300 kun har 13 px. Antallet af nøgletal
   er altså **ikke** hoveddriveren, sådan som jeg først skrev.

**Fix:** find ud af, hvad der gør de høje kort høje — det er ikke nøgletallene.
Mistanken falder på anvendelseschips og navne, der brydes over to linjer.
Mål det, før noget rettes.

**Accept:** medianen for dødt bundrum forbliver under 20 px, og den værste
falder fra 211 px til under 60 px. Måles med
`node maal.mjs http://localhost:8080/da/robotter/ 1440`.

**Lærdommen, der er dyrere end fundet:** jeg udledte "takket gitter" af
strukturelle tal — antal nøgletal og fodnotelængde — og af et skærmbillede.
Begge dele pegede på noget, der ikke var der. Det er projektets egen regel om
at måle frem for at skønne, og jeg brød den i mit eget kritikdokument.

---

### K4. [Minor] Alle 54 kortbilleder er `loading="lazy"`

**Bevis:** `loading="lazy"` står på 54 af 54 `<img>` i katalogsiden.

**Hvorfor det står her:** det er ikke en fejl på siden, men det forklarer,
hvorfor JPK's fuldsideskud viser tomme billedfelter på AlienGo og de to
AlphaDog-kort, mens de øverste kort har billeder. Det er skudkapløbet igen.
Men det rammer også **print** og PDF-eksport, hvor billeder under folden
udebliver.

**Fix:** `loading="eager"` på de første ~8 kort, og en `@media print`-regel,
der tvinger indlæsning. **Accept:** print-preview af katalogsiden viser
billeder på alle kort med foto.

---

## Forsiden

### K5. [Blocker] To af fire yderpunkter er udledt af øvre grænser

**Bevis, aflæst i skuddet og bekræftet i data:**

| Yderpunkt | Robot | Værdi |
|---|---|---|
| Hurtigste | Lynx S10 | `8 m/s` — eksakt |
| Letteste | Y10 | `± 5,6 kg` — tolerance |
| **Tungeste** | **Qiuqiu SP1** | **`≤ 100 kg`** |
| **Længste driftstid** | **MOVENEW T1** | **`≤ 12 t`** |

**Hvorfor det ikke holder:** `≤ 100 kg` betyder "højst 100 kg". Robotten kan
veje 40. En øvre grænse kan derfor **ikke** bevise, at noget er tungest — den
kan kun bevise, at det ikke er tungere end noget. Det samme gælder driftstiden.
Halvdelen af forsidens fire "målte fakta" er altså slutninger, dataene ikke
bærer, på en side, hvis hele signatur er, at den ikke påstår mere end kilden
siger.

Sætningen under gitteret gør det værre, ikke bedre: *"Fire målte fakta fra
kataloget."* De er ikke fire målte fakta. To af dem er grænser.

**Fix:** `ekstremer()` må kun udvælge blandt felter med `operator: null` —
altså eksakte tal. Kan et yderpunkt ikke findes blandt eksakte værdier, vises
yderpunktet ikke. Alternativt: behold dem, men skriv operatoren ind i
etiketten (*"tungeste oplyste øvre grænse"*), så påstanden matcher tallet.

**Accept:** hvert af de fire yderpunkter har enten `operator: null`, eller en
etiket der navngiver grænsen. Kør `ekstremer()` og skriv de fire operatorer.

**Dette er ikke et smagsspørgsmål.** Hård begrænsning 2 forbyder at opfinde
tal; at udlede "tungest" af en øvre grænse er samme fejl i en anden retning.

---

### K6. [Major] Yderpunkternes billedrække har fire forskellige visuelle sprog

**Bevis, fra skuddet:** de fire felter viser i rækkefølge et **reportagefoto**
i felten (Lynx S10, 16:10), et **hvidt produktudklip** (Y10, 1:1), en
**måleplade** med afskåret tekst (Qiuqiu SP1) og et **mørkt studiefoto**
(MOVENEW T1). Fire baggrunde, to sideforhold, én række.

Målepladens tekst — `LÆNGDE × HØJDE 1.190 mm × 925…` — er **afskåret** i
112 px-feltet. Pladen er dimensioneret til et katalogkort og regner sin egen
størrelse, jf. `generator.css:296`; i det lille yderpunktfelt løber den ud
over kanten.

**Fix:** to ting, uafhængigt af K1. (a) Yderpunkter vælges kun blandt robotter
med et rigtigt fotografi — en måleplade i 112 px er ikke information, den er
en afskåret streng. (b) Ensret baggrunden med `--plade`-reglen fra K1, så et
udklip står på panelfarve i stedet for at blive beskåret.

**Accept:** 0 forekomster af `billedled--maal` i forsidens yderpunktsektion,
og alle fire billeder har samme sideforhold.

**Bemærk:** `spor/forside` gør netop nu de fire kort lige store. Det ændrer
sideforholdet, men **ikke** at ét af de fire er en afskåret måleplade. K6
overlever det spor.

---

## Katalogsiden

### K7. [Major] 69 % af alle tal bærer en stjerne — så skelner stjernen ikke længere

**Bevis, målt over alle 77 robotters talfelter i `robots.json`:**

* **813** talfelter i alt
* **562** af dem har et `forbehold` og får derfor en stjerne — **69 %**
* dertil **151** felter med en operator: `~` 70 · `<=` 28 · `>=` 16 · `>` 19 · `±` 14 · `<` 4

**Hvorfor:** et mærke, der sidder på to tredjedele af alle tal, oplyser næsten
ingenting — det bliver visuel tekstur. Læseren lærer at overse stjernen, og så
er den ikke længere der, når den betyder noget alvorligt. Samtidig står der
seks forskellige operatortegn i samme gitter (`~ ≤ ≥ > ± <`), som hver især
kræver en opslagstur til tegnforklaringen.

Det er den sammensatte grund til, at kortene i skuddet ser "rodede" ud: hver
celle bærer tal, enhed, operator og stjerne, og linjerne brydes midt i en
værdi (`ca. 42 kg *` med `▲` alene på næste linje).

**Fix:** to niveauer i stedet for ét. Et forbehold, der ændrer *tallets
gyldighed* (modstridende kilder, faktor 10-fejl), beholder stjernen. Et
forbehold, der bare uddyber (*"inkl. batteri"*), bliver til en `title` uden
synligt mærke. Mål fordelingen først — hvis det stadig er over ~30 %, er
inddelingen forkert.

**Accept:** andelen af talfelter med synligt mærke er under 30 %, og tallet
står i rapporten sammen med de 69 % fra i dag.

---

### K8. [Minor] Værdiceller brydes midt i en værdi

**Bevis, fra skuddet:** A2-kortet viser `ca. 42 kg *` på én linje og `▲` alene
på den næste; A1's `3,3 m/s *` brydes tilsvarende. Med fire celler i et
to-kolonners gitter på et ~310 px kort er der ikke plads til den længste
kombination af operator + tal + enhed + mærke.

**Fix:** `white-space: nowrap` på selve værdien, og lad hellere skriftstørrelsen
falde et trin end at bryde et tal fra sin enhed. **Accept:** 0 værdiceller med
linjeskift mellem tal og enhed, målt i browseren ved 1440 og 390 px.

---

## Sammenligningssiden

### K9. [Blocker] 9 af 30 felter blander enheder — sammenligningen kan ikke laves i hovedet

**Bevis, målt over alle 77 robotter i `dist/robots.json`:**

| Felt | Enheder i brug |
|---|---|
| `laengde` | mm 50 · cm 8 · m 1 |
| `bredde` | mm 50 · cm 8 · m 1 |
| `hoejde` | mm 52 · cm 8 · m 1 |
| `forhindring_enkelt` | cm 25 · m 3 · mm 2 |
| `hastighed` | m/s 58 · km/h 6 |
| `driftstid` | t 59 · min 7 |
| `ladetid` | t 18 · min 5 |
| `haeldning` | ° 52 · % 1 |
| `pris` | CNY 6 · USD 4 · EUR 1 |

**Det ses direkte i skuddet:** rækken *Længde* viser Go2 `70 cm` ved siden af
Spot `1.100 mm`. Rækken *Driftstid* viser Go2 `ca. 1-2 t` ved siden af Spot
`90 min`. Efterprøvet i data: Go2's længde er `{vaerdi: 70, enhed: "cm"}`,
Spots er `{vaerdi: 1100, enhed: "mm"}`.

**Hvorfor det er sidens dyreste fejl:** overskriften lover *"Sammenlign
robotter, felt for felt"*. En sammenligning, hvor to celler i samme række har
forskellig enhed, er ikke en sammenligning — den er to oplysninger stillet op
ved siden af hinanden. Og den fejler præcis dér, hvor siden lover mest.

**Fix — og her er en fælde, der skal undgås:** enheden må **ikke** rettes i
datafilerne. At producenten skrev "70 cm" er en kildebelagt kendsgerning, og
at overskrive den ville bryde hård begrænsning 2. Normaliseringen hører i
*visningen*: hvert felt får en kanonisk visningsenhed udledt af, hvad flertallet
af robotter bruger (mm for mål, m/s for hastighed, t for tid), og kildens egen
formulering bevares i kildemærkets `title`.

**`pris` er undtagelsen** og skal ikke normaliseres: CNY, USD og EUR kan kun
omregnes med en kurs, og en kurs er et tal, siden ikke har en kilde til.
Valutaen skal stå, som den er.

**Accept:** 0 af de 30 felter viser mere end én enhed på tværs af kolonnerne i
en bygget sammenligningstabel — undtagen `pris`, som er undtaget med en
skrevet begrundelse.

---

### K10. [Major] 30 rækker uden klæbende kolonneoverskrift

**Bevis:** tabellen er målt til 30 felter i seks grupper og fylder ca.
1.200 px lodret ved tre kolonner. Robotnavnene står **kun** øverst.

**Hvorfor:** når læseren er nået til *"Autonominiveau"*, er `ANYmal X · Go2 ·
Spot` for længst rullet ud af billedet, og de tre kolonner kan ikke skelnes.
Det er den ene interaktion, siden er bygget om.

**Fix:** `position: sticky; top: 0` på hovedrækken.
**Accept:** kolonnehovedet er synligt, når sidste række er i billedet.

---

## Producentsiden

### K11. [Major] Siden bruger under halvdelen af sin bredde

**Bevis, fra skuddet ved 1848 px:** navnekolonnen slutter ved ca. 640 px,
landet og modeltallet står ved ca. 660 px, og alt fra ca. 810 px til
1.780 px — omtrent **55 % af fladen** — er tom. 25 rækker fordelt over
1.250 px lodret.

**Fix:** to eller tre kolonner, eller flyt indholdet ind i det tomme felt (se
K12). **Accept:** fladen til højre for indholdet er under 25 % af rummets
bredde ved 1440 px.

---

### K12. [Major] Land og modeltal er én tekststreng, ikke to kolonner — og siden regner ingenting ud

**Bevis:** rækkerne læses `Indien 2 modeller`, `Kina 13 modeller`,
`Schweiz 2 modeller`. Land og tal står i samme monospor-streng uden
kolonneskel, så tallene ikke flugter lodret, og man ikke kan skimme "hvem har
flest".

**Hvorfor det er mere end kosmetik:** sidens signatur er den *beregnede
iagttagelse* — forsiden tør skrive "2 af 77 oplyser CE-mærkning", og
katalogets sale har live-optalte antal. Producentsiden er den eneste flade,
hvor projektet har 25 rækker struktureret data foran sig og **ikke** siger
noget om dem. Målt i datafilerne: **14 af de 25 producenter er kinesiske, og
de står for 62 af de 77 modeller** — otte af ti robotter i kataloget. De tre
største alene (Unitree 13, DEEP 9, GENISOM 9) står for 31. Resten af verden
fordeler sig på Indien 3, Schweiz 3, USA 3, Sydkorea 2, Polen 2, Spanien 1 og
Tyskland 1. Det er en iagttagelse, siden allerede har fuld dækning for og
undlader at skrive — og den er mere interessant end nogen anden linje på
fladen.

*(Jeg talte først 16 kinesiske producenter ved at læse skuddet. Målingen
siger 14. Tallet i teksten er det målte.)*

**Fix:** tre kolonner (navn · land · modeller) med `tabular-nums` og
sorterbare hoveder, og én beregnet linje under overskriften, udledt af data —
aldrig hårdkodet.

**Accept:** de tre kolonner flugter, tallene er højrestillede, og den
beregnede linje ændrer sig, når kataloget vokser. Bevises med et byg, hvor en
robot midlertidigt tilføjes.

---

## Hvad de fire kørende spor allerede tager

Så det ikke rapporteres to gange:

| Fund fra KRITIK-2 | Spor | Status |
|---|---|---|
| 2 — "Fra kataloget" er alfabetisk | `spor/forside` | kører |
| 7 — yderpunkternes layout | `spor/forside` | kører |
| 3 — standardtrioens tomme kolonne | `spor/sammenlign` | kører |
| 6 — "Strøm ud" vises dobbelt | `spor/sammenlign` | kører |
| 8 — 77 chips uden søgning | `spor/sammenlign` | kører |
| Kortfodnoter + CE-mærke (JPK 26. aug) | `spor/kort` | kører |
| Billeder til de 23 fotoløse | `spor/billeder` | kører |

**Fund 5 fra KRITIK-2** (sidevægt 345/351 KB) står stadig åbent og er bevidst
udskudt til lanceringen nærmer sig.

---

## Behold dette

- **Måleplade-løsningen.** K2 handler om de fire, der falder udenfor —
  ikke om ideen. De 19, der virker, er stadig sidens bedste enkeltidé.
- **"Sådan læses tallene"-legenden** på sammenligningssiden, og især linjen
  om ikke at markere en vindercelle. Den er sidens mest særprægede sætning og
  bør ikke røres af nogen oprydning.
- **Kolonnehovedernes ærlighed** — `ANYmal X · 4 af 30 felter oplyst` skrevet
  åbent i hovedet. Fund 3 fjerner den tomme kolonne fra standardvisningen;
  den skal ikke fjerne *tallet*.
- **Footeren** og forsidens CE-linje.

---

## Det jeg ikke kunne måle

- **Kortenes faktiske højdeforskel i px.** Playwright er ikke installeret som
  pakke i repoet (`npm` fandt ikke `playwright`), så K3's accept mangler sin
  browsermåling. Tallene i K3 er strukturelle — antal nøgletal og fodnotelængde
  pr. kort — og de er reproducerbare, men de er *drivere* af højden, ikke
  højden selv.
- **Den engelske udgave.** Alle fire skud er `da/`. Pariteten er ikke set
  efter i denne runde, og KRITIK-2 flaggede den allerede som en runde for sig.
- **Robotsiden.** JPK sendte fire skud, og robotsiden var ikke iblandt. Den er
  sidens dybeste flade og er dermed ikke evalueret her.
- **Tastatur, hover og rigtigt netværk.** Uændret fra KRITIK-2.

## Målingernes forbehold

To ting, der kunne have set ud som fund og ikke er det:

1. **De tomme billedfelter på AlienGo og AlphaDog-kortene i skuddet.** AlienGo
   *har* et billede (`unitree-aliengo.jpg`, 1334×1850). Feltet er tomt i
   skuddet på grund af `loading="lazy"` — det er K4, ikke et manglende billede.
   De fire ægte tomme kasser står i K2 og er en anden fejl.
2. **Kortfodnoterne og CE-mærkerne i skuddene.** De er allerede bestilt væk af
   JPK og ligger hos `spor/kort`. De er ikke ført som fund her.
