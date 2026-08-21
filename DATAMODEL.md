# Datamodel — målt, ikke skønnet

Trin 1 i [PLAN.md](PLAN.md): udfyld tre robotter i hånden, før der bygges noget.
Gennemført 19. august 2026.

**Hypotesen der blev testet:** at vi kan have komplette poster. Det holder ikke uden
forbehold, og målingen nedenfor viser præcis hvor den knækker.

## Kilder

Kun producenternes egne produktsider, hentet 19. august 2026. Ingen forhandlerkataloger,
ingen anmeldelser, ingen tredjepartsdatabaser.

| Robot | Kilde |
|---|---|
| Unitree B2 | `https://www.unitree.com/b2` |
| Boston Dynamics Spot | `https://bostondynamics.com/products/spot/` |
| ANYbotics ANYmal | `https://www.anybotics.com/robotics/anymal/` |

De tre er valgt som poler: billig/kinesisk, etableret/amerikansk, industriel/europæisk.

---

## Målingen: specifikationstæthed

Et felt tæller som udfyldt, når producenten oplyser en værdi med enhed på sin egen
produktside.

**Forsøgsmålingen, 19. aug 2026: nævneren 29, tre håndtalte poster.** Den står, som den
blev målt. Den var beviset for, at målingen overhovedet virkede, og et bevis, man skriver
om bagefter, beviser ikke længere noget:

| Robot | Udfyldte felter | Tæthed |
|---|---|---|
| Boston Dynamics Spot | 16 / 29 | **55 %** |
| Unitree B2 | 14 / 29 | **48 %** |
| ANYbotics ANYmal | 8 / 29 | **28 %** |

> **Tallene ovenfor kan ikke sammenlignes med dagens.** Nævneren er 33 siden L30
> (21. aug 2026), og tællingen er nu maskinel og kørt på alle 46 poster. Målt med
> `node tools/validate.mjs --taethed`: **Spot 20/33 = 61 % · Unitree B2 20/33 = 61 % ·
> ANYbotics ANYmal 10/33 = 30 %.** Tælleren er højere end i forsøget, fordi datafilerne
> siden er fyldt ud; procenten er lavere, fordi nævneren er større. To bevægelser i hver
> sin retning — derfor må de to sæt tal ikke stilles op mod hinanden.

**Det er sidens hovedtal, og det virker på første forsøg.** Ingen af de tre kommer over
55 %. Konsekvensen for designet er ikke lille: *"ikke oplyst" er ikke en undtagelse, det
er næsten halvdelen af kataloget.* En detaljeside, der er tegnet med udfyldte felter i
tankerne og har et gråt hul, hvor et tal mangler, vil se ødelagt ud på hver eneste post.
Tomme felter skal designes som førsteklasses tilstand, ikke som fejl.

Seks felter har **nul dækning på alle tre**: frihedsgrader, ROS-support, SDK, pris,
leveringstid og servicepunkt i EU.

---

## Seks fund, der ændrer skemaet

### F1 — "Nyttelast" er ikke ét felt, og forskellen er ni gange

Unitree oplyser **to** tal: *stående last ≥ 120 kg* og *kontinuerlig gående last > 40 kg*.
Boston Dynamics oplyser ét: *14 kg*. ANYbotics oplyser ét: *10 kg ekstra nyttelast*.

Sammenlignes 120 mod 14, er B2 ni gange stærkere. Sammenlignes 40 mod 14, er den tre
gange. **Vælger vi det forkerte felt, producerer vores egen side markedets mest
misvisende sammenligning.**

Skemaet får `nyttelast_gaaende` og `nyttelast_staaende` som adskilte felter. Kataloget
filtrerer og rangerer på den **gående** — det er den, der svarer til et driftsscenarie.
Den stående vises på detaljesiden med sin egen etiket.

### F2 — Trinhøjde og forhindringshøjde er to tal, og de vender rangeringen

Unitree oplyser *forhindring maks. 40 cm* **og** *kontinuerlig trappegang 20-25 cm*.
Boston Dynamics oplyser *maks. trinhøjde 300 mm*.

Stiller man 40 cm mod 30 cm, vinder B2. Stiller man det sammenlignelige tal, 20-25 cm,
mod 30 cm, **vinder Spot.** Det er samme robotter, samme kilder, modsat resultat.

Skemaet får `forhindring_enkelt` og `trappetrin_kontinuerlig` adskilt. Sammenligninger
bruger kun den kontinuerlige.

### F3 — Driftstid uden lastbetingelse er ikke et tal

Unitree: *> 5 t uden last (> 20 km)*, *> 4 t med 20 kg (> 15 km)* — og samme side siger
også *"Battery Life 4-6h"*. Tre tal på én side. Boston Dynamics: *90 min*, uden angivet
last. ANYbotics: *90 min*.

Hvert driftstidsfelt skal bære `ved_last: <kg> | ikke oplyst`. Vores beregnede felt
*Wh pr. driftstime* — B2: 2250 ÷ 5 = **450 Wh/t**; Spot: 564 ÷ 1,5 = **376 Wh/t** — er
kun ærligt, når lastbetingelsen står ved siden af tallet. Uden den sammenligner vi en
tom robot med en robot af ukendt tilstand.

### F4 — Kilden kan tage fejl, og krydstjekket fanger det

Boston Dynamics' specifikationer angiver længde som **"110mm (43.3 in)"**. 43,3 tommer er
1100 mm. Det metriske tal mangler et nul.

*Forbehold: det kan være en fejl på siden eller i vores udtræk af den. Skal efterprøves
med øjnene, før det skrives ind — men uanset hvilken af de to det er, er pointen den
samme.*

**Derfor gemmer vi begge tal, som producenten skriver dem, og lader validatoren krydstjekke
metrisk mod imperial.** Afviger de mere end afrundingen tillader, fejler bygget med
robottens navn og feltet. Vi retter ikke stiltiende i en producents tal — vi noterer
afvigelsen synligt på posten. Det er billigt, og det er præcis den slags detalje, der gør
et opslagsværk citerbart frem for endnu en afskrift.

### F5 — Seks felter har nul dækning, og det er en designbeslutning, ikke et hul

Frihedsgrader, ROS-support, SDK, pris, leveringstid, servicepunkt i EU: ingen af de tre
producenter oplyser dem på produktsiden.

To veje, og de skal vælges bevidst:

- **Hent dem fra sekundære kilder** (udviklerdokumentation, GitHub, datablade i PDF).
  Bedre dækning, men kilderne er sværere at datere og dør oftere.
- **Lad dem stå som "ikke oplyst".** Ærligt, og det fodrer specifikationstætheden — men
  seks tomme rækker på hver post er en tom side.

Anbefaling: **ROS/SDK og frihedsgrader hentes fra producentens udviklerdokumentation**
(den er stabil og daterbar). **Pris, leveringstid og EU-service forbliver "ikke oplyst",
indtil vi har det skriftligt** — de er præcis de felter, hvor et gæt gør mest skade, og
hvor "ikke oplyst" i sig selv er en oplysning en indkøber kan bruge.

### F6 — EU-kolonnen virker allerede på første datapunkt

ANYbotics oplyser **"FCC, CE and Anatel compliant"** på produktsiden. Unitree og Boston
Dynamics oplyser intet om CE på deres.

Det er første bevis for, at EU-kolonnen skiller feltet — og at den skiller det på den
måde, vi forventede: den europæiske producent siger det af sig selv, de to andre gør ikke.
For en dansk køber er det forskellen mellem at købe en maskine og at blive importør af en.

---

## Det reviderede skema

**33 felter** i seks grupper. Ændringer fra PLAN.md markeret **fed**.

> **Rettet 21. aug 2026 (L30).** Overskriften sagde tidligere *"29 felter"*, og
> Fysik-gruppen stod som *"(10)"* og opremste 12. Uoverensstemmelsen er hele D7:
> gruppeoverskrifterne blev aldrig talt om efter L6's opsplitninger, og listen
> indeholdt oven i købet et felt — `mål sammenfoldet` — som skemaet aldrig fik.
> **Tallene her er nu talt af `tools/skema.mjs`, ikke af hånden.** Bliver de to
> uenige igen, har koden ret; `tests/koer.mjs` afsnit 3b fælder bygget.

**Identitet** (skrives af os, tæller ikke i tætheden)
slug · navn · producent · producentland · første udgivelse · status
(i produktion / annonceret / udgået) · forgænger

**Fysik** (14)
egenvægt · **længde** · **bredde** · **højde** · frihedsgrader ·
**nyttelast gående** · **nyttelast stående** · maks. hastighed · maks. hældning ·
**forhindring enkelt** · **trappetrin kontinuerlig** · IP-klasse ·
**temp_min** · **temp_maks**

*Mål er tre felter, ikke ét: hver akse har sin egen kilde og hentedato. Det samme
gælder de to temperaturgrænser. **`mål sammenfoldet` findes ikke i skemaet** — oplyser
en producent foldemål, hører de i en `advarsel:` på målfeltet.*

**Energi** (5)
batteri Wh · **driftstid + ved_last** · hot-swap · ladetid · dockingstation

**Sensorik og autonomi** (6)
LiDAR (type **og** model — de tre oplyser type, ingen oplyser model) · kameraer ·
onboard compute · ROS 2 · SDK-sprog · autonominiveau

**Nyttelast og udvidelser** (3)
monteringsinterface · strøm ud V/W pr. port · dataporte

**Kommercielt** (1)
vejledende pris

**EU** (4)
tilgængelig i EU · CE oplyst · servicepunkt i EU · leveringstid

*Skemaet har seks grupper, ikke fem: `kommercielt` og `eu` er adskilt i
`tools/skema.mjs`, fordi EU-kolonnen tegnes for sig. 14 + 5 + 6 + 3 + 1 + 4 = **33**.*

### Feltets form

Hvert talfelt er ikke et tal, men en post. Illustration, ikke en fil:

```yaml
nyttelast_gaaende:
  vaerdi: 40
  enhed: kg
  operator: ">"          # producenten skriver "> 40kg", ikke "40kg"
  kilde: https://www.unitree.com/b2
  hentet: 2026-08-19

driftstid:
  vaerdi: 4
  enhed: t
  operator: ">"
  ved_last: { vaerdi: 20, enhed: kg }
  kilde: https://www.unitree.com/b2
  hentet: 2026-08-19

laengde:
  vaerdi: 110
  enhed: mm
  vaerdi_imperial: 43.3
  enhed_imperial: in
  kilde: https://bostondynamics.com/products/spot/
  hentet: 2026-08-19
  advarsel: metrisk og imperial afviger med faktor 10 — efterprøves
```

**`operator` er ikke pynt.** Alle tre producenter skriver deres tal som uligheder:
*"≈ 60kg"*, *"> 6m/s"*, *"≥ 120kg"*, *"> 45°"*. Gemmer vi kun tallet, forvandler vi
producentens forbehold til vores præcision. Feltet skal kunne vise `> 40 kg`, ikke `40 kg`.

---

## `anvendelse` — producentens egen inddeling, håndhævet af R16 og R17

Tilføjet 21. aug 2026. **Topnøgle, ikke et felt i `felter`.**

En redaktionel inddeling ville falde for samme regel, der forbød 1-5-scoren (CLAUDE.md
begrænsning 6): *en konklusion skrevet om til en kategori.* Løsningen er ikke at inddele
bedre. Det er at lade producenterne inddele — og gemme deres ord ved siden af kategorien,
så en læser kan se, hvem der har sagt det.

> **Rettet 21. aug 2026.** Her stod tidligere: *"CEO'en vil have forsiden inddelt efter
> anvendelse i stedet for vægt."* Den sætning var den eneste optegnelse af en
> forsidebeslutning, der modsagde **L15**, og den stod uden L-nummer og uden dato —
> præcis det, `KRITIK-1-plan.md` K2 kalder en beslutning, ingen kan efterprøve om blev
> truffet. K3 målte desuden, at anvendelse ikke duer som forsideakse: to grupper ville
> have ét kort, og *ikke oplyst*-bunken var næststørst. **Anvendelse er et filter og et
> mærke på kortet — ikke forsidens akse.** Vægtklasse bliver på forsiden.

```yaml
anvendelse:
  vaerdi: industri              # eller [industri, inspektion], eller ikke_oplyst
  citat: "Robot - Industry"     # ordret. Streng eller liste af strenge
  kilde: https://www.unitree.com/
  hentet: 2026-08-19
  arvet_fra: unitree-b2         # valgfri. Se R17 nedenfor
  note: "Producentens egen produktnavigation, gruppen B2 står i."
```

**Tilladt sæt** (syv): `industri` · `inspektion` · `sikkerhed_overvaagning` ·
`forskning_udvikling` · `forbruger_uddannelse` · `forsvar_beredskab` · `logistik` —
plus tilstanden `ikke_oplyst`.

`sikkerhed_overvaagning` kom til med **L22** (21. aug 2026). Uden den blev producentens
eget ord — *security*, *patrol*, *surveillance* — ikke omsat på seks robotter, og det
stod kun i noten. Alternativet var værre: presses *security patrol* ind under
`forsvar_beredskab`, kommer en parkpatruljerobot til at stå ved siden af Ghost Robotics'
militærplatform.

**Værdierne er en usorteret mængde (L27).** Der findes ikke en hovedkategori. Reglen om,
at den første værdi var producentens hovedpositionering, er **fjernet**, fordi
`KRITIK-1-plan.md` K4 målte, hvad den gjorde: ti robotter med de samme to kategorier
blev delt i to bunker af rækkefølgen i en producents navigationsmenu. R16 krævede citat
på *at* en kategori var nævnt og krævede intet om rækkefølgen — så beviskravet lå på det
led, der ikke betød noget, og manglede på det led, der afgjorde forsiden. Generatoren
lægger værdierne i en fast, kanonisk orden, netop for at rækkefølgen ikke kan læses som
mening.

**R16 vender beviskravet om.** På et almindeligt felt koster et tal en kilde. Her koster
en *kategori* et ordret citat: uden `citat` er `vaerdi` nødt til at være `ikke_oplyst`,
og et `ikke_oplyst` må omvendt **ikke** bære et citat. Så kan feltet ikke bruges til at
smugle en vurdering ind, hverken forfra eller bagfra.

**R17 — arv til varianter, synligt mærket (L23).** En variant må arve grundmodellens
kategori, men posten skal bære `arvet_fra: <slug>` og vise moderens citat. Arven er
*vores* slutning om, at de to er samme maskine i to udgaver, og en umærket slutning kan
ikke skelnes fra en oplysning. Kravene er strengere end R16, ikke mildere:

1. moderens slug skal findes
2. moderen skal selv have en kategori **med citat** — tavshed kan ikke arves
3. moderen må ikke selv have arvet: en kæde vasker citatet et led længere væk pr. trin
4. variantens kategorier skal være en **delmængde** af moderens
5. variantens citater skal stå **ordret** hos moderen
6. `kilde` skal være moderens — citatet blev læst dér, ikke på variantens side.
   Variantens egen side hører i `note`

Arven vises på siden, over citatet, med link til grundmodellen.

**Hvorfor uden for `felter`:** anvendelse er ikke en specifikation, producenten kunne have
oplyst og lod være. Det er den hylde, producenten selv stiller robotten på. Talte den med
i specifikationstætheden, ville nævneren skifte fra 29/31 til 30/32, og alle historiske
tæthedstal blive uforlignelige — uden at nogen havde besluttet det (D7 er stadig åben).

**Efterprøvning:** `node tools/efterproev-anvendelse.mjs` slår hvert citat op i den gemte
råfil og fejler, hvis det ikke står der ordret. Målt 21. aug 2026: **58 citater, 0 fejl**
(39 robotter med citat, 7 `ikke_oplyst`).

---

## Vægtklasse — afledt i generatoren, aldrig i data

Tilføjet med **L27** (21. aug 2026). Klassen står **ikke** i nogen YAML-fil og må ikke
komme til det. `tools/build.mjs` regner den ud af `egenvaegt`:

| Klasse | Regel |
|---|---|
| `under_20` | egenvægt < 20 kg |
| `20_40` | 20 ≤ egenvægt < 40 kg |
| `over_40` | egenvægt ≥ 40 kg |
| `ikke_oplyst` | ingen vægt oplyst |

Stod klassen i data, skulle 46 filer rettes i hånden, hvis en grænse flyttede sig — og
den 47. ville blive glemt. Afledt flytter den sig ét sted.

**`ikke_oplyst` er en klasse på lige fod med de tre andre, ikke et hul.** Robotter uden
oplyst vægt må ikke forsvinde fra en forside, der grupperer efter vægt; det ville være
den fjerde måde at lade *ikke oplyst* kollapse (CLAUDE.md begrænsning 5).

**Operatoren respekteres.** `≈ 60 kg` er 60, men forbeholdet følger med som `cirka`, så
visningen kan skrive `≈`. Ligger tallet præcis på en klassegrænse **og** bærer en
operator, er klassen ikke sikker — DEEP Lynx S10 oplyser `≤ 20 kg`, som kan være både
`under_20` og `20_40`. Det står som `graensetilfaelde` frem for at blive gemt bag et
valg, ingen kan se. Et interval får sin klasse fra det laveste endepunkt og markeres som
grænsetilfælde, hvis de to endepunkter ikke lander i samme klasse.

**Målt 21. aug 2026** over alle 46 poster: `under_20` **12** · `20_40` **12** ·
`over_40` **13** · `ikke_oplyst` **9**. Bygget skriver tallene ved hver kørsel.

---

## Hvad der stadig er åbent efter trin 1

| # | Punkt | Type |
|---|---|---|
| **D1** | Skal sekundære kilder (udviklerdok, PDF-datablade) med? Se F5 | Beslutning |
| **D2** | Spot-længden 110 vs. 1100 mm skal efterprøves med øjnene | Verifikation |
| **D3** | Hvordan vises et interval (*"20~25cm"*, *"0.5~1.2m"*, *"4-6h"*)? Alle tre producenter bruger dem | Skema |
| **D4** | Tæller et felt som udfyldt, når producenten oplyser type men ikke model (*"3D LiDAR ×1"*)? Det ændrer tæthedstallene | Metode |
