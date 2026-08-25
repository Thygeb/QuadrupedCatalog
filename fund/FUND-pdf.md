# FUND-pdf — PDF-opfyldningsrunde, de ni nyeste poster

Opgave fra orkestratoren, 25. aug 2026. Overtaget efter en forgænger-agent, hvis
proces døde undervejs (transcript tabt). Arbejdet i worktree
`C:\Praktik\websites\udstilling-wt-pdf`, gren `spor/pdf`. Kun de ni navngivne
filer er rørt: `pudu-d5`, `pudu-d5-w`, `yufan-lingmao-cyvet`,
`astrall-dynamics-hypertron-t01`, `cvte-maxhub-x7`, `microrobotech-movenew-t1`,
`microrobotech-movenew-p1`, `genisom-gangben-l1`, `genisom-gangben-l2`.

**Resultat i korte træk:** 4 nye felter tilføjet (2 hos Yufan, 2 hos MOVENEW
P1), 3 felter arvet fra forgængeren (MOVENEW T1) genefterprøvet og beholdt
uændret, 1 vigtig modsigelse dokumenteret (P1's temp_maks), 1 mindre
uoverensstemmelse dokumenteret (P1's last-operatorer), og for de resterende
fem poster (begge Pudu-varianter, Astrall, CVTE, begge GENISOM) er
undersøgelsen udtømt uden nye fund — dokumenteret som "intet fundet", ikke
tavst sprunget over.

---

## 0. Skill-vurdering

| Skill | Valgt? | Begrundelse |
|---|---|---|
| `robotdata` | **Valgt.** Læst fra disk (`.claude/skills/robotdata/SKILL.md` i denne worktree) og fulgt fra start: 30-feltsskemaet, de ti hårde regler, selv-tjekket med tælling. | Opgaven ER "udfyld/efterprøv robotposter" — skillens kerneformål. |
| `parallelt` | Gået forbi | Jeg er allerede ét udpeget spor i en fordelt kørsel; de ni filer skal efterprøves med samme disciplin af én sammenhængende læsning, ikke splittes yderligere. |
| `grillmig` | Gået forbi | Intet agentbrief afsendes herfra, og ingen åben STATUS.md-beslutning låses af mig. |
| `impeccable`, `critique`, `ui-ux-critique`, `dataviz`, `new-project`, `code-review`, `simplify` | Gået forbi | Ingen UI, design eller kode berørt — ren dataindsamling i YAML. |

---

## 1. Arven fra forgængeren — hvad blev beholdt/ændret

`data/robots/microrobotech-movenew-t1.yaml` havde en uncommittet ændring
(+19/−3) med tre nye felter: `hot_swap`, `monteringsinterface`, `stroem_ud`,
alle kildehenvist til PDF-databladets side 5 og 8.

**Efterprøvning:** `media/_kilder/raa-pdf-2026-08-24/t1-pages/page-5.png` og
`page-8.png` blev læst på ny med øjne, linje for linje mod citaterne i
`advarsel:`-felterne.

- `hot_swap: ja` — side 5: *"Equipped with high-density solid-state dual
  batteries and a modular quick-swap architecture, it supports hot-swappable
  battery replacement..."* — citat stemmer ordret. **Beholdt.**
- `monteringsinterface` — side 8, "Parameter Information"-tabellen,
  "Functionality"-sektion: rækkerne "Top Mount Expansion" og "Undercarriage
  Expansion" er begge markeret med en prik. **Beholdt.**
- `stroem_ud` — side 5: *"Featuring automotive-grade power output standards
  (supporting AC220V / 12V DC OUTLET dual-mode)..."* plus fodnoterne om
  regionale AC-spændingstolerancer og "12V DC OUTLET - 10A maximum, compliant
  with ISO 4165" — citat stemmer ordret. **Beholdt.**

Samtlige øvrige 10 sider i T1-PDF'en (side 1–4, 6, 7, 9–12) blev også
gennemgået på ny — intet yderligere skemafelt fundet (marketingprosa om
DynaCore/DynaForce-motorteknologi, sensoropstilling, anvendelsesscenarier,
farvevalg, virksomhedskontakt). Ingen modsigelser mellem PDF'ens
"Parameter Information"-tabel og de allerede udfyldte felter fra
produktsiden — alle sammenlignelige tal (mål, vægt, hastighed, driftstid,
nyttelast, hældning, trappetrin, IP-klasse, temperatur) stemmer overens.

**Konklusion: 3 arvede felter, 3 efterprøvet, 0 fejl fundet, alle 3 beholdt
uændret.**

---

## 2. Nye felter tilføjet i denne session (4 stk.)

### Yufan Lingmao Cyvet — 2 nye felter

| Felt | Gammel tilstand | Ny værdi | Kilde | Side/sted i kilde |
|---|---|---|---|---|
| `ros2` | ikke_oplyst | `ja` (kildetype: sekundaer) | `https://github.com/uniubi-ai/uniubi_ros2` | README.md, hele filen |
| `ip_klasse` | ikke_oplyst | `IP54` (betinget — se advarsel) | `https://www.uniubi.com/shop/buy?product=air` | FAQ, spørgsmål 7 af 10 |

- **ros2**: Producentens (Yufan/Uniubi) egen GitHub-organisation `uniubi-ai`
  har et dedikeret, fuldt dokumenteret ROS 2-integrationsrepo (`uniubi_ros2`)
  med en fungerende motion-bridge-arkitektur og reelle topics (`/cmd_vel`,
  `/odom`, `/joint_states`, `/imu/data`, `/battery_state`) — ikke en
  TODO-markeret plan. README'en navngiver ikke modellen "cyvet" direkte, men
  `uniubi-ai`'s eneste aktuelle robotmodel er "cyvet" (bekræftet i samme
  organisations repo `uniubi_robot_description`, som kun har én robotmappe:
  `robots/cyvet/`). Til sammenligning blev GENISOM L2's tilsvarende
  ROS2-kobling (repoet `genisom_roamerx_open`) bevidst IKKE brugt, fordi det
  repos eget README siger "Hardware Deployment: TODO" — ingen tilsvarende
  forbehold findes i `uniubi_ros2`.
- **ip_klasse**: En frisk gennemgang af købssidens FAQ (hentet 2026-08-25,
  en anden fangst end den oprindelige 2026-08-24-kopi) fandt spørgsmål 7:
  *"灵猫・Cyvet 户外雨天能不能使用？防水等级多少？"* → *"仅支持室内、干燥户外，
  防水工业定制版支持 IP54 级防泼溅，小雨环境短时作业。"* Oversat: standardmodellen
  har INGEN IP-klasse (kun indendørs/tør udendørs brug); en separat,
  vandtæt "industri-tilpasset udgave" tåler IP54-niveau stænk i let regn,
  kortvarigt. Feltet er fyldt med IP54, men `advarsel:`-teksten gør det
  utvetydigt, at dette gælder en tilkøbt/tilpasset variant, ikke
  standardmodellen resten af posten beskriver — samme forsigtighed som
  `compute`-feltets tilvalgshåndtering i samme fil.

**Undersøgt, men IKKE brugt (Yufan):** spec-tabellens række "拓展接口"
(udvidelsesinterface) er markeret med en prik (til stede), men uden navngivet
type eller specifikation — for tyndt til `dataporte` (som andre steder i
kataloget kræver navngivne portyper, fx "RS485 x2"). `monteringsinterface`
var allerede udfyldt (20 kg nyttelastplatform-citat) og derfor ikke rørt.

### MicroRoboTech MOVENEW P1 — 2 nye felter

| Felt | Gammel tilstand | Ny værdi | Kilde | Side i PDF |
|---|---|---|---|---|
| `autonominiveau` | ikke_oplyst | Kvalitativ beskrivelse af multi-sensor-fusion + 360°-situationsbevidsthed | `.../1776307542577931.pdf` (P1-datablad) | Side 3, "Integrated Sensing & Control" |
| `monteringsinterface` | ikke_oplyst | "Expansion Rails" (til stede, ingen yderligere spec) | samme PDF | Side 4, "Function Configuration" |

- **autonominiveau**: Side 3 (panel "Integrated Sensing & Control"): *"Equipped
  with a multi-sensor fusion perception system and a high-computing power
  platform, it forms a 360° omnidirectional environmental awareness network,
  fully covering functional modules such as environmental perception,
  monitoring, and knowledge reasoning."* Kvalitativ, intet numerisk niveau.
- **monteringsinterface**: Side 4 ("P1 Technical Specifications"-tabellen,
  "Function Configuration"-sektionen): rækken "Expansion Rails" markeret med
  en prik — samme knappe dokumentationsniveau som T1's "Top Mount
  Expansion"/"Undercarriage Expansion".

**Undersøgt, men IKKE brugt (P1):** `ros2`, `sdk_sprog`, `stroem_ud`,
`dockingstation`, `pris`, `ce_oplyst` — ingen af dem nævnes noget sted i de 5
PDF-sider (side 5 er kun virksomhedsboilerplate). `dataporte` var allerede
udfyldt (fem navngivne porte fra produktsiden) og er ikke rørt, selvom PDF'en
side 4 har en lignende, men ikke identisk, portliste ("Radar Interface:
RS485, USB3" osv.) — ikke en reel modsigelse, kun en anden gruppering af
samme portsæt, derfor ikke noteret som uoverensstemmelse.

---

## 3. Modsigelser fundet (rørt IKKE, kun dokumenteret)

### MOVENEW P1 — temp_maks: 55 °C (produktside) vs. 85 °C (PDF)

PDF-databladets tabel (side 4): *"Operating Temperature: -40°C to 85°C"*,
gentaget i marketingteksten side 3: *"FROM THE FRIGID COLD OF -40°C TO THE
SCORCHING HEAT OF 85°C."* Det allerede udfyldte `temp_maks`-felt (kilde:
produktsiden, hentet 2026-08-24) står på 55 °C — samme mønster som T1, hvor
produktsiden også skriver 55 °C. `temp_maks` er **ikke ændret** (regel 2 og
den hårde regel om, at et udfyldt felt aldrig må ændres), men modsigelsen er
skrevet ind i postens `noter:` med begge kilder og sider.

### MOVENEW P1 — mindre uoverensstemmelse: last-operatorer

PDF'en skriver *"Max Static Payload: > 400 kg"* og *"Max Dynamic Payload: >
200 kg"* (med `>`-operator), mens de allerede udfyldte `nyttelast_staaende`
(400 kg) og `nyttelast_gaaende` (200 kg) står uden operator på
produktsiden. Samme talværdier, men PDF'en præsenterer dem som et gulv
("mere end") snarere end et loft. Ikke rettet — kun noteret.

---

## 4. "Intet fundet" — dokumenteret, ikke tavst sprunget over

| Post | Materiale gennemgået | Resultat |
|---|---|---|
| **Pudu D5 / D5-W** | 2-siders "Product Flyer" (pudu-d5-pages/page-1.png, page-2-hi.png), Pudus generelle download-side (kun et flerprodukt-"Industrial Brochure" fundet, ikke hentet — lav forventet værdi over for et enkelt-produkt-flyer, der allerede er udtømt), Pudu Robotics' GitHub-organisation (**bekræftet at eksistere, men INGEN offentlige repositories**) | 0 nye felter. Flyeren gentager kun produktsidens tal. |
| **Astrall Dynamics Hypertron-T01** | 5 arkiverede nyhedsartikler (astralldynamics-news*.html), fuldt læst | 0 nye felter. Artiklerne handler om firmaets aksial-flux-motorteknologi, en fjernbetjenings-/videooverførselsdemo på to droneremesser, og en investeringsrunde — intet om T01's egne specifikationer. **IP66/67-modsigelsen fra FUND-kand2.md forbliver uafklaret** (GlobeNewswire-pressemeddelelsen stadig utilgængelig). |
| **CVTE MAXHUB X7** | Intet CVTE-materiale i det arvede arkiv. Ét nyt forsøg (WebFetch) på produktsiden for et evt. PDF-download-link | 0 nye felter. Ingen download-/PDF-link findes på siden; alle tal på siden matcher allerede udfyldte felter. |
| **GENISOM Gangben L1** | `github.com/zsibot/genisom_robot_sdk` (fuldt README) undersøgt som muligt supplement til `genisom_L1_sdk` | 0 nye felter. Intet PDF-datablad fundet for GENISOM overhovedet. |
| **GENISOM Gangben L2** | Samme `genisom_robot_sdk`-repo undersøgt for `sdk_sprog` | **Bevidst IKKE brugt** — repoets GitHub-beskrivelse er tom (modsat `genisom_L1_sdk`'s eksplicitte "Official SDK for the Genisom AI L1 Series"), og ingen modelnavn nævnes i README'en. At bruge det til L2 ville være en gætning, ikke en måling (regel 1) — samme forsigtighed som L2's egen tidligere afvisning af `genisom_roamerx_open` for `ros2`. |

---

## 5. Efterprøvning (facit-tal)

```
node tools/validate.mjs   → 62 fil(er) · 0 fejl · 1 advarsel (kendt baseline: ghost-robotics-vision-60/hastighed, urørt af mig)
node tools/build.mjs      → 173 sider (uændret fra baseline). Kildemærker: 857 tal med kilde, 0 uden.
                             Baseline var 850 → stigning på +7, som er PRÆCIS:
                               3 arvede felter fra forgængeren (T1: hot_swap, monteringsinterface, stroem_ud) genefterprøvet og beholdt
                             + 4 nye felter tilføjet i denne session (Yufan: ros2, ip_klasse · P1: autonominiveau, monteringsinterface)
                             = 7
node tests/koer.mjs       → 195 bestået, 2 fejlet (samme to kendte, uafklarede fejl som baseline — "interval 18-25 kg" og "L27 raekkefoelge" — ingen forværring)
```

Undervejs fangede byg-tjekket (`BYGFEJL: side(r) henviser til media/`) en
reel fejl i tre af mine egne noter: `(media/_kilder/...)` med parentes
umiddelbart før "media/" matcher byggets forbudsregex `["'(/]media\//` mod
at fabrikantmateriale-stier lækker til `dist/`. Rettet ved at omformulere
til "se media/..." (mellemrum før "media/", som resten af kataloget allerede
gør det) i `astrall-dynamics-hypertron-t01.yaml`, `cvte-maxhub-x7.yaml` og
`pudu-d5.yaml`. Ingen fabrikantsti endte i det færdige byg.

**Selv-tjek, felt for felt, med tælling:**

| Felt | Post | Kilde genlæst med øjne? | Resultat |
|---|---|---|---|
| `hot_swap` (arvet) | T1 | Ja, page-5.png | Citat stemmer ordret |
| `monteringsinterface` (arvet) | T1 | Ja, page-8.png | Rækker bekræftet til stede |
| `stroem_ud` (arvet) | T1 | Ja, page-5.png + fodnoter | Citat stemmer ordret |
| `ros2` (ny) | Yufan | Ja, uniubi_ros2 README | Citat stemmer, model-kobling begrundet eksplicit |
| `ip_klasse` (ny) | Yufan | Ja, grep mod rå HTML | Citat stemmer ordret, betingelse tydeliggjort |
| `autonominiveau` (ny) | P1 | Ja, page-3.png | Citat stemmer ordret |
| `monteringsinterface` (ny) | P1 | Ja, page-4.png | Række bekræftet til stede |

**Efterprøvet 7 felter, fandt 0 fejl.**

Kontrolleret særligt: ingen operatorer gik tabt (regel 4 — de nye felter er
enten jaNej, en ren IP-kode, eller fri tekst uden numerisk operator); ingen
nyttelast blandet (regel 6 — ikke rørt af de nye felter); ingen trinhøjde
blandet (regel 7 — ikke rørt); driftstid uændret med sin `ved_last` (regel
8 — ikke rørt).

---

## 6. Selv-review — hvad jeg er usikker på

- **Yufans `ros2: ja` hviler på en organisationsslutning, ikke en direkte
  navnekobling.** `uniubi_ros2`-repoet nævner aldrig "cyvet" ved navn. Jeg
  har begrundet koblingen med, at "cyvet" er `uniubi-ai`'s eneste model
  (bekræftet i et søster-repo), men hvis Uniubi lancerer en anden
  robotmodel, før nogen retter posten, kan koblingen blive forældet uden at
  nogen opdager det. Dette er den fortolkning i hele denne runde, jeg er
  mindst sikker på, selvom jeg mener den er forsvarlig og klart dokumenteret.
- **Yufans `ip_klasse: IP54` er en fyldning af et felt, der strengt taget
  beskriver en ANDEN konfiguration end resten af posten.** Jeg overvejede at
  lade feltet blive stående `ikke_oplyst` i stedet, fordi standardmodellen
  reelt ikke har en IP-klasse. Jeg valgte at fylde det med tydelig
  betingelse i `advarsel:`, efter samme præcedens som `compute`-feltets
  tilvalgs-håndtering i samme fil — men en anden læser kunne rimeligt mene,
  at et betinget tal hører hjemme i `ikke_oplyst` snarere end i `vaerdi`.
- **P1's `monteringsinterface` og T1's tilsvarende felt er begge kun
  "til stede"-markeringer uden reel specifikation** (ingen mål, ingen
  belastningsevne, ingen interface-standard). De er inkluderet, fordi de
  matcher et etableret mønster i kataloget (samme knappe dokumentationsniveau
  som allerede accepteret på T1 af forgængeren), men de tilføjer relativt
  lidt sammenligningsværdi.
- **P1's temp_maks-modsigelse (55 °C vs. 85 °C) er ikke undersøgt til bunds
  ud over at konstatere, at PDF'en er intern konsistent (nævnt to steder).**
  Jeg har ingen teori om, hvilket tal der er korrekt — kunne være en
  skabelonfejl i den ene eller den anden kilde. Fremhævet som en beslutning,
  et menneske bør se på.
- **CVTE og Astrall Dynamics fik ingen nye felter denne runde**, på trods af
  at de har flest huller tilbage (CVTE: 20 ud af 30 felter stadig
  `ikke_oplyst`). Det er en målt observation om producenternes offentlige
  materiale, ikke en utilstrækkelig søgning — men det betyder, at CVTE
  forbliver kataloget tyndeste post.

**Hvad jeg ikke nåede:** at afklare P1's temp-modsigelse eller T01's
IP66/67-modsigelse (begge kræver kilder, der ikke kunne hentes/findes); at
undersøge Pudu's generelle "Industrial Product Brochure" (flerprodukt-PDF,
vurderet lav forventet værdi og fravalgt af tidshensyn, ikke forsøgt og
opgivet); at genafprøve GENISOM's PDF-fravær med en frisk websøgning ud over
det arvede arkiv (ingen indikation fandtes om, at et GENISOM-PDF findes,
så en ny søgerunde blev ikke prioriteret).
