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

29 felter talt. Et felt tæller som udfyldt, når producenten oplyser en værdi med enhed på
sin egen produktside.

| Robot | Udfyldte felter | Tæthed |
|---|---|---|
| Boston Dynamics Spot | 16 / 29 | **55 %** |
| Unitree B2 | 14 / 29 | **48 %** |
| ANYbotics ANYmal | 8 / 29 | **28 %** |

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

29 felter i seks grupper. Ændringer fra PLAN.md markeret **fed**.

**Identitet** (skrives af os, tæller ikke i tætheden)
slug · navn · producent · producentland · første udgivelse · status
(i produktion / annonceret / udgået) · forgænger

**Fysik** (10)
egenvægt · mål stående L×B×H · mål sammenfoldet L×B×H · frihedsgrader ·
**nyttelast gående** · **nyttelast stående** · maks. hastighed · maks. hældning ·
**forhindring enkelt** · **trappetrin kontinuerlig** · IP-klasse · driftstemperatur fra/til

**Energi** (5)
batteri Wh · **driftstid + ved_last** · hot-swap · ladetid · dockingstation

**Sensorik og autonomi** (6)
LiDAR (type **og** model — de tre oplyser type, ingen oplyser model) · kameraer ·
onboard compute · ROS 2 · SDK-sprog · autonominiveau

**Nyttelast og udvidelser** (3)
monteringsinterface · strøm ud V/W pr. port · dataporte

**Kommercielt og EU** (5)
vejledende pris · tilgængelig i EU · CE oplyst · servicepunkt i EU · leveringstid

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

## Hvad der stadig er åbent efter trin 1

| # | Punkt | Type |
|---|---|---|
| **D1** | Skal sekundære kilder (udviklerdok, PDF-datablade) med? Se F5 | Beslutning |
| **D2** | Spot-længden 110 vs. 1100 mm skal efterprøves med øjnene | Verifikation |
| **D3** | Hvordan vises et interval (*"20~25cm"*, *"0.5~1.2m"*, *"4-6h"*)? Alle tre producenter bruger dem | Skema |
| **D4** | Tæller et felt som udfyldt, når producenten oplyser type men ikke model (*"3D LiDAR ×1"*)? Det ændrer tæthedstallene | Metode |
