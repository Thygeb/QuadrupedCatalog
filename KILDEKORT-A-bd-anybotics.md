# KILDEKORT A — Boston Dynamics og ANYbotics

Kortlægning og efterprøvning af 11 råfiler i
`media/_kilder/raa-vest-2026-08-19/` mod fund/FUND-vest.md afsnit 1, 1b, 1c, 2 og 3.

Udført 19. aug 2026. **100 % læsning.** Ingen fil i repoet er ændret, flyttet eller
slettet. Ingen commit. Denne rapport ligger i scratchpad, ikke i repoet.

---

## Regel 0 — skill-vurdering

**Valgt: `robotdata` (projektets egen, `.claude/skills/robotdata/SKILL.md`).**
Den blev kaldt med Skill-værktøjet og **indlæste normalt** — ingen `Unknown skill`,
altså intet fallback til disklæsning. Den er den rigtige, fordi opgaven er efterprøvning
af talpåstande mod kilder: regel 2 (kilde + hentet), regel 4 (operator bevaret),
regel 5 (interval bevaret), regel 9 (metrisk vs. imperial) og det obligatoriske
selv-tjek med tælling er præcis det, opgaven består af.

Gik forbi, med begrundelse:

| Skill | Hvorfor ikke |
|---|---|
| `parallelt` | Bærer worktree-opsætning og prompt-tjekliste for den, der **fordeler** arbejde. Jeg er én agent i en allerede fordelt opgave, og jeg må ikke skrive i repoet — så der er ingen worktree at oprette |
| `impeccable` | Design- og IA-planlægning. Der er intet at forme her |
| `ui-ux-critique`, `critique` | Vurderer noget bygget. Der er ikke bygget noget |
| `dataviz` | Relevant når tætheden skal vises. Den skal først efterprøves |
| `code-review`, `simplify` | `pdf.js` og `x.js` er 20 linjers engangsværktøj, ikke produktionskode. Jeg beskriver deres adfærd nedenfor i stedet |
| `new-project` | Scaffolding. Intet scaffoldes |

Læst før arbejdet, i den anviste rækkefølge: `CLAUDE.md`, `DATAMODEL.md`,
`media/_kilder/LÆSMIG.md`, og fund/FUND-vest.md linje 1-60, 73-160, 156-252, 252-348.

---

## Del 1 — Hvad de 11 filer er

Kilde-URL er læst ud af filernes eget indhold (`<link rel="canonical">`,
`<meta property="og:url">`), ikke gættet ud fra filnavnet.

| Fil | Hvad det er | Kilde-URL (læst i filen) | Bevisværdi | Bærer i FUND-vest |
|---|---|---|---|---|
| `spot.html` | Boston Dynamics **Spot**, produktside. Server-renderet WordPress/Beaver Builder (`fl-module`-klasser). 196 KB | `https://bostondynamics.com/products/spot/` — canonical **og** og:url | **Høj.** Fuld specifikationstabel i statisk HTML. Bemærk: hele tabellen står **to gange** (desktop + accordion); hver værdi findes præcis 2× | **K1.** Afsnit 1, felt 1-2, 5, 7-9, 11-14, 16, 19, 23-26. Afsnit 1c |
| `bd_spec.pdf` | Boston Dynamics **Spot Specifications**, datablad. PDF 1.4, 396 KB, ingen XMP/Info-metadata (`strings \| grep Producer/CreationDate` gav 0 hits) | Ingen URL-tag i PDF'en. Indeholder `www.bostondynamics.com/products/spot` og `Updated: 05/22/2024`. **Downloadlinket står i `spot.html`:** `https://bostondynamics.com/wp-content/uploads/2020/10/spot-specifications.pdf` | **Høj**, men se forbehold F3 nedenfor om ligaturer | **K2.** Afsnit 1, alle felter der er mærket K2. Hele D2-beviskæden, punkt 3 |
| `bd_arm.html` | Boston Dynamics **Spot Arm**, produktside (tilbehør) | `https://bostondynamics.com/products/spot/arm/` — canonical og og:url | **Middel.** Prosa med tal, ingen tabel | **K3.** Afsnit 1b, alle fem rækker. Afsnit 1, felt 4 (note) |
| `bd_shop.html` | **shop.bostondynamics.com**, merchandise-forside. Ikke Boston Dynamics' eget CMS — footer siger `© 2026 Heavy Duty Promos - Company Stores` | **Ingen canonical.** og:url = `https://shop.bostondynamics.com/Page/Index` (FUND-vest' K23 skriver `https://shop.bostondynamics.com/`) | **Negativt bevis.** Ingen robotspecifikationer, ingen robotpris | **K23.** Afsnit 1, felt 27 |
| `arm.txt` | Tekstudtræk af `bd_arm.html` | — (arver K3) | Middel | Afsnit 1b |
| `anymal.txt` | Tekstudtræk af **`1101b7e2.html`** (som ikke er på min liste) | Kilde-HTML'ens canonical: `https://www.anybotics.com/robotics/anymal/` | **Høj.** Alle ANYmal-tal står i udtrækket | **K4.** Hele afsnit 2 |
| `anymalx.txt` | Tekstudtræk af **`25d42ffc.html`** (ikke på min liste) | Kilde-HTML'ens canonical: `https://www.anybotics.com/robotics/anymal-x/` | **Høj** | **K5.** Hele afsnit 3 |
| `anyspec.html` | ANYbotics **"Download ANYmal Specifications Sheet"** — gated landingsside | `https://www.anybotics.com/anymal-specifications-sheet/` — canonical og og:url | **Ingen taldækning.** Nul specifikationer. Formularen er en **JS-renderet HubSpot-embed** (`hbspt.forms.create({`, `hsforms.net/forms/embed/v2.js`) og findes derfor slet ikke i den statiske tekst | **K22.** Afsnit 2, slutbemærkningen om at databladet er gated |
| `pdf.js` | **Hjælpescript**, ikke en kilde. 813 B, Node. Finder `stream…endstream`, `zlib.inflateSync`, beholder kun streams der indeholder `Tj`/`TJ`, plukker `(…)`-strenge ud, afkoder oktale escapes, **joiner med `~`** | — | Værktøj | Metodeafsnittet: *"To PDF'er blev dekomprimeret og tekstudtrukket lokalt"* |
| `x.js` | **Hjælpescript**, ikke en kilde. 724 B, Node. Fjerner `<script>`, `<style>`, kommentarer; gør blokelementer til linjeskift; strimler resten af taggene; afkoder 10 navngivne entiteter; **fjerner gentagne ens linjer** | — | Værktøj | Metodeafsnittet: *"hentet som rå HTML med curl og konverteret til tekst lokalt"* |
| `x.txt` | **Ikke en kilde.** 4 bytes: `h e j \n` (verificeret med `od -c`). En testfil fra da `x.js` blev skrevet | — | **Ingen** | Bærer intet. Bør slettes, men jeg må ikke røre filer |

### F1 — De tre .txt-filer er tro mod kilden. Målt, ikke skønnet

Jeg kørte `x.js` forfra på hver kilde-HTML og sammenlignede med `diff`:

| .txt-fil | Kilde-HTML | Bytes i .txt | Bytes i min genkørsel | Forskellige linjer |
|---|---|---|---|---|
| `arm.txt` | `bd_arm.html` | 7458 | 7458 | **0** |
| `anymal.txt` | `1101b7e2.html` | 6644 | 6644 | **0** |
| `anymalx.txt` | `25d42ffc.html` | 5637 | 5637 | **0** |

Byte-for-byte identiske. Udtrækkene er reproducerbare og **ikke** håndredigerede.
Uafhængigt bevis for parringen: `x.js` afkoder ikke `&#038;`, og netop `&#038;`
overlever i alle tre .txt-filer (`Safety &#038; Response`, `Power &#038; Utilities`).

Der findes **ingen** .txt for `spot.html`, `bd_shop.html` eller `anyspec.html`.
Jeg lavede mine egne i scratchpad for at kunne læse dem.

### F2 — Sådan læses `bd_spec.pdf` igen (genbrugsopskrift)

```
"/c/Program Files/nodejs/node.exe" pdf.js bd_spec.pdf | tr '~' ' ' > flad.txt
```

`tr '~' ' '` er nødvendigt. Uden det står FUND-vest' citater aldrig sammenhængende i
udtrækket, og et `grep` på dem giver 0 hits selv når påstanden er rigtig.
Udtrækket er 7730 bytes.

### F3 — `pdf.js` taber fi/fl-ligaturer. Det er en fælde for en fremtidig validator

PDF'ens kerning lægger mellemrum inde i ord (`Upda t ed`, `Fle xible`, `Saf ety`) —
irriterende, men harmløst, fordi tegnene er der. **Ligaturerne er derimod væk.**
Talt i udtrækket:

| Streng i udtrækket | Hvad der står i PDF'en | Antal |
|---|---|---|
| `Certied` | Certi**fi**ed | 2 |
| `Specica tions` | Speci**fi**cations | 1 |
| `congured` | con**fi**gured | 1 |
| `electried` | electri**fi**ed | 1 |

**5 forekomster i ét dokument.** FUND-vest citerer `cTUVus Certified to UL 1564 and CSA
C22.2 No. 107.2` og `Radio equipment: Incorporates a FCC Part 68 Certified radio system`
— begge med `fi` genindsat. Rettelsen er **rigtig**, men den er en tavs redigering: en
læser, der `grep`'er FUND-vest' citat i udtrækket, får 0 hits og tror påstanden er falsk.
Bygges validatoren på dette udtræk, skal ligaturerne genskabes **før** sammenligningen,
og det skal stå i `/metode/`.

---

## Del 2 — Efterprøvning med tælling

Format: påstand i FUND-vest → fil → søgeudtryk → **ordret fundet streng**.

### Boston Dynamics Spot — D2-beviskæden (afsnittet "D2 er lukket")

| # | Påstand | Fil | Søgeudtryk | Resultat |
|---|---|---|---|---|
| 1 | Produktsiden skriver `110mm (43.3 in)` | `spot.html` | `sed -n '1155,1165p'` (rå HTML) | **BEKRÆFTET.** `<span class="fl-list-item-heading-text">Length</span>` … `<p>110mm (43.3 in)</p>`. Strengen står 2× i filen (linje 1160 og 1489 — desktop og accordion) |
| 2 | Alle andre rækker har mellemrum foran enheden | `spot.html` | `grep -o -E "[0-9]+ ?mm \([0-9.]+ in\)" \| sort \| uniq -c` | **BEKRÆFTET og stærkere end skrevet.** 10 unikke former, hver 2×. Kun `110mm` mangler mellemrummet. FUND-vest opregner seks; der er i alt **ni** korrekt satte (de tre ekstra er batteriets `324 mm`, `168 mm`, `93 mm`) |
| 3 | Databladet skriver `1100 mm (43.3 in)` | `bd_spec.pdf` | `grep -a -o "DIMENSIONS Length  = 1100"` på fladt udtræk | **BEKRÆFTET.** `DIMENSIONS Length  = 1100 mm (43.3 in) Width  = 500 mm (19.7 in) Height (Sitting)  = 191 mm (7.5 in)` — bemærk **dobbelt mellemrum** før `=`; FUND-vest' citat har ét |
| 4 | Databladet er mærket `Updated: 05/22/2024` | `bd_spec.pdf` | `grep -a -o "Upda t ed: 05 / 22/ 20 2 4"` | **BEKRÆFTET** (kerning-mellemrum, se F2) |
| 5 | Der findes intet konkurrerende længdetal på produktsiden | `spot.html` | `grep -c "1100"` → **0**; `grep -c "43.3"` → **2** | **BEKRÆFTET.** `1100` optræder aldrig i K1. De to `43.3` er de to `110mm`-celler. Der er ingen JSON-LD eller data-attribut med det rigtige tal. **D2's konklusion er vandtæt** |

### Vægtkonflikten

| # | Påstand | Fil | Søgeudtryk | Resultat |
|---|---|---|---|---|
| 6 | K1: `33.8 kg (74.5 lb)` | `spot.html` | `grep -n "33.8"` i x.js-udtræk | **BEKRÆFTET.** `Net Mass/Weight (Spot with battery)` / `33.8 kg (74.5 lb)`. Ental `lb`, som FUND-vest skriver |
| 7 | K2: `32.7 kg (72.1 lbs)` | `bd_spec.pdf` | `grep -a -o "32.7 kg"` | **BEKRÆFTET.** `Net Mass/W eight    (Spot with battery)  =    32.7 kg (72.1 lbs)`. Flertal `lbs` — de to kilder er også uenige om **enhedens** skrivemåde |

### Nyttelast-modsigelsen inde i K2

| # | Påstand | Fil | Søgeudtryk | Resultat |
|---|---|---|---|---|
| 8 | Samme dokument skriver både `30.9 lbs` og `30 lbs` | `bd_spec.pdf` | `grep -a -o "Max W eight  = 14 kg (30.9 lbs)"` og `grep -a -o "up t o 14 k g (30 lbs )"` | **BEKRÆFTET, begge.** `Max W eight  = 14 kg (30.9 lbs)` (specifikationstabel) og `Spot can carry up t o 14 k g (30 lbs ) of sensing equipment` (brødtekst). Badge-listen skriver ligeledes `14 k g (30 lbs ) P a yload Limit` — altså **3 forekomster, 2 værdier** |

### CE-afsnittet på Spot

| # | Påstand | Fil | Søgeudtryk | Resultat |
|---|---|---|---|---|
| 9 | Afsnittet hedder ordret `Safety and Compliance, United States` | `bd_spec.pdf` | `grep -a -o "Saf ety and C omplianc e , Unit ed S ta t es"` | **BEKRÆFTET.** Overskriften afgrænser selv til USA, som FUND-vest skriver |
| 10 | Fodnoten `*Robot must be powered on at a minimum temperature of 0°C` står i K2, ikke K1 | `bd_spec.pdf` + `spot.html` | `grep -a -o -E "Robot must be powered on.{0,60}"` → hit i PDF; `grep -c "powered on" spot.html` → **0** | **BEKRÆFTET.** Kildeangivelsen "K2 tilføjer" er korrekt |

### Spot Dock (felt 17)

| # | Påstand | Fil | Søgeudtryk | Resultat |
|---|---|---|---|---|
| 11 | Dock: `1140 × 414 × 403 mm`, `22.9 kg`, ind `90-277 VAC`, ud `58V at 12A`, `0°C to 35°C` | `bd_spec.pdf` | `grep -a -o -E "DIMENSIONS Length  = 1140.{0,120}"` | **BEKRÆFTET.** `1140 mm (44.9 in)` / `414 mm (16.3 in)` / `403 mm (15.9 in)` / `22.9 kg (50.5 lbs)` / `Input = 90-277 V AC` / `Output = 58V at 12A` / `Operating T emp. = 0°C to 35°C` |
| 12 | Laderens tabel: 25 °C → 50 min / 2 hrs; 35 °C → 2.5 hrs / 3.5 hrs | `bd_spec.pdf` | fladt udtræk, læst i sammenhæng | **BEKRÆFTET.** `Ambient T emp. 80% char ge 100% charge 25°C 50 min 2 hrs 35°C 2.5 hrs 3.5 hrs` |

### Spot, øvrige felter

| # | Påstand | Fil | Søgeudtryk | Resultat |
|---|---|---|---|---|
| 13 | `1.6 m/s`, `±30°`, `300 mm (11.8 in)`, `IP54`, `-20°C to 55°C` | `spot.html` | `grep -n -E "1\.6 m/s\|30°\|IP54\|-20"` | **BEKRÆFTET, alle fem**, som rækker under `LOCOMOTION` hhv. ingress/temp |
| 14 | `564 Wh`, `90 mins`, `180 mins`, `60 mins`, batteri `5.2 kg (11.5 lbs)` | `spot.html` | `sed -n '199,220p'` i udtræk | **BEKRÆFTET, alle fem.** Fodnoten `*Runtime may vary depending on payloads and environmental factors` står ordret |
| 15 | `M5 T-slot rails`, `DB25 (2 ports)`, `Unregulated DC 35-58.8V, 150W per port`, monteringsfelt `850 mm (L) x 240 mm (W) x 270 mm (H)` | `spot.html` | `grep -n -E "T-slot\|DB25\|150W\|850 mm"` | **BEKRÆFTET, alle fire.** Intervallet `35-58.8V` er bevaret som producenten skriver det (regel 5) |
| 16 | Terrain sensing `360°`, `4 m (13 ft)`, `> 2 Lux` | `spot.html` | `grep -n -E "13 ft\|Lux"` | **BEKRÆFTET, alle tre** |
| 17 | SDK-sprog `Flexible API and Python SDK` hører til K2, ikke K1 | begge | `grep -c -i "python" spot.html` → **0**; PDF → `Fle xible API and  P ython SDK` | **BEKRÆFTET.** Kildeangivelsen "K2" alene er korrekt |

### Afsnit 1c — Spot Explorer / Enterprise

| # | Påstand | Fil | Søgeudtryk | Resultat |
|---|---|---|---|---|
| 18 | Én forekomst af `Enterprise` i hele filen, og den er ikke en produktvariant. Ingen `Explorer` | `spot.html` | `grep -o -i "Enterprise" \| wc -l` → **1**; `grep -o -i "Explorer" \| wc -l` → **0** | **BEKRÆFTET ordret.** Den ene forekomst: *"…we offer the complete solution for an **enterprise** deployment."* — lille begyndelsesbogstav, løbende tekst |

### Afsnit 1b — Spot Arm

| # | Påstand | Fil | Søgeudtryk | Resultat |
|---|---|---|---|---|
| 19 | `6-degrees of freedom`, `an almost one meter reach`, `Lift up to 11kg`, `drag up to 25kg`, `time of flight (ToF)`, `inertial measurement unit (IMU)`, `4k RGB camera in the gripper` | `arm.txt` / `bd_arm.html` | `grep -n -i -E "degrees of freedom\|one meter reach\|11kg\|25kg\|time of flight\|4k RGB"` | **BEKRÆFTET, alle syv, i tre sætninger:** *"…with 6-degrees of freedom, a capable gripper, and an almost one meter reach."* · *"Lift up to 11kg and drag up to 25kg with the arm."* · *"Integrated sensors include time of flight (ToF) and inertial measurement unit (IMU) sensors … as well as a 4k RGB camera in the gripper."* |

### Afsnit 2 — ANYmal (K4)

| # | Påstand | Fil | Søgeudtryk | Resultat |
|---|---|---|---|---|
| 20 | `0.75 m/s - 2.46 ft/s` med etiket `Normal walking speed` | `anymal.txt` | `grep -n "0\.75"` (linje 128-129) | **BEKRÆFTET ordret**, og etiketten står på linjen lige under. FUND-vest' pointe om at det **ikke** er maksimum, holder |
| 21 | `-40–550°C` er termokameraets måleområde, ikke driftstemperatur | `anymal.txt` | `grep -n -- "-40"` (linje 71-72) | **BEKRÆFTET.** Linje 71 er overskriften `Thermal Camera`, linje 72: *"Precise temperature readings in a range of -40–550°C without physical interaction."* Ingen driftstemperatur nogen steder på siden |
| 22 | Spotlight `maximal 3790Im` — med stort I | `anymal.txt` | `grep -n "3790"` | **BEKRÆFTET ordret:** *"Strong light of maximal 3790Im supports visual inspections in the dark."* Producentens egen skrivemåde, gengivet korrekt |
| 23 | Ultralydsmikrofon `0—384kHz` | `anymal.txt` | `grep -n "384"` | **BEKRÆFTET ordret**, med em-tankestreg: *"…in audible and ultrasonic frequencies (0—384kHz)."* |
| 24 | Nyttelast `an additional 10 kg payload` | `anymal.txt` | `grep -n "10 kg"` | **BEKRÆFTET ordret.** Ordet "additional" er producentens, som noteret |
| 25 | To driftstidstal på samme side: `90 min` og `Walking range (90 - 120 min) per charge` | `anymal.txt` | `grep -n -E "^90$\|Walking range"` | **BEKRÆFTET, begge.** Linje 101-103: `90` / `min` / `battery run-time`. Linje 131: `Walking range (90 - 120 min) per charge` |
| 26 | Ladetid `100 min for 70% quick charge`; `3 h for full charge` | `anymal.txt` | linje 104-109 | **BEKRÆFTET, begge**, som to selvstændige felter |
| 27 | `FCC, CE and Anatel compliant` | `anymal.txt` | `grep -n "Anatel"` (linje 116) | **BEKRÆFTET ordret.** F6 i DATAMODEL.md holder |
| 28 | `2× Intel i7 Core` og `8th gen. Intel 6-core processors` | `anymal.txt` | `grep -n "Intel"` (linje 134-135) | **BEKRÆFTET, begge.** Producentens to formuleringer om samme enhed, som FUND-vest bemærker |
| 29 | `360° Lidar, 6 depth cameras, and 2 optical tele-operation cameras` | `anymal.txt` | `grep -n "depth camera"` (linje 127) | **BEKRÆFTET ordret** |
| 30 | `IP67` | `anymal.txt` | `grep -n "IP67"` (linje 60-61) | **BEKRÆFTET.** Siden skriver `Industrial-grade and IP67` og `(IP67 rated)` |
| 31 | `Automatic docking` + flere dockingstationer langs ruten | `anymal.txt` | `grep -n "docking"` (linje 96-99) | **BEKRÆFTET, begge** |

### Afsnit 3 — ANYmal X (K5)

| # | Påstand | Fil | Søgeudtryk | Resultat |
|---|---|---|---|---|
| 32 | Specifikationsafsnittet er én sætning: `2026 ANYmal X specifications coming soon.` | `anymalx.txt` | `grep -n "coming soon"` | **BEKRÆFTET ordret.** Linje 113 er overskriften `ANYmal X technical specifications`, linje 114 er sætningen. Intet andet i afsnittet |
| 33 | `ATEX & IECEx certified up to Zone 1 IIB` | `anymalx.txt` | `grep -n "IECEx"` | **BEKRÆFTET ordret** |
| 34 | `Certified for up to Zone 1 where inflammable gases are likely to occur` | `anymalx.txt` | `grep -n "inflammable"` | **BEKRÆFTET ordret** (producentens `inflammable`, ikke `flammable`) |
| 35 | `IP67 : Water and dust ingress protection` | `anymalx.txt` | `grep -n "IP67"` | **BEKRÆFTET ordret**, inkl. mellemrummet foran kolon |
| 36 | `Complies with CE directives for industrial deployment` og `FCC and CE compliant` | `anymalx.txt` | `grep -n -E "CE directives\|FCC and CE"` | **BEKRÆFTET, begge to steder på siden** |
| 37 | Termokamera `-10° to +400°C` | `anymalx.txt` | `grep -n "400"` | **BEKRÆFTET.** *"Precise temperature readings in the range of -10° to +400°C"* |
| 38 | Zoom `20x optical zoom` (X) vs. `20× optical zoom` (ANYmal) | begge .txt | `grep -n "optical zoom"` | **BEKRÆFTET — og FUND-vest har fanget forskellen korrekt.** K5 skriver lille `x`, K4 skriver `×`. Det er gengivet præcist i begge afsnit |
| 39 | `intrinsically safe` | `anymalx.txt` | `grep -n -i "intrinsically"` | **BEKRÆFTET, 2 forekomster:** *"engineered for intrinsically safe use in explosive atmospheres"* og *"Intrinsically safe ANYmal X brings robotic inspection to these areas."* |

### K22 og K23 — de to negative kilder

| # | Påstand | Fil | Søgeudtryk | Resultat |
|---|---|---|---|---|
| 40 | K22 er en formular, ikke et dokument; ingen PDF-URL; den eneste PDF er etikkodekset | `anyspec.html` | `grep -o -E "https?://[^\"']*\.pdf" \| sort -u` | **BEKRÆFTET.** Præcis **1** unik PDF-URL: `https://www.anybotics.com/anybotics-code-of-ethics-and-business-conduct.pdf`. Samme ene PDF på alle fire anybotics-sider i mappen (`1101b7e2`, `25d42ffc`, `b9c7fcb9`, `anyspec`). **Forbehold:** fire sider er ikke "hele domænet" — se selv-review |
| 41 | K23 sælger merchandise, ikke robotter | `bd_shop.html` | x.js-udtræk, hele filen (47 linjer) | **BEKRÆFTET og mere præcist end skrevet.** Kategorierne er `Apparel / Hats / T-Shirts / Socks / Hoodies / Infant-Toddler / Drinkware / Miscellaneous / Collectibles / E-Gift Cards`. Produkter: `Plushie Spot`, `Trucker Cap Industrial Atlas`, `Spot Pet Bandanna`. Dyreste vare: `Spot Pewter Replica ( $499.99 $199)`. **Ingen robot til salg.** Butikken drives af tredjepart: `© 2026 Heavy Duty Promos - Company Stores` |

---

## Del 3 — Fejl fundet

### FEJL 1 (indholdsfejl) — `Gigabit Ethernet` er Spot Dock'ens port, ikke robottens

FUND-vest afsnit 1, felt 26:

> | 26 | dataporte | `DB25 (2 ports)`; `Gigabit Ethernet`; WiFi `2.4GHz / 5GHz b/g/n` | — | **K1, K2** |

To ting er galt:

1. **`Gigabit` findes ikke i K1.** `grep -c "Gigabit" spot.html` → **0**.
   K1's `CONNECTIVITY`-blok (udtræk linje 199-202 og 275-278) lyder i sin helhed:
   `CONNECTIVITY / WIFI / 2.4GHz / 5GHz b/g/n / Ethernet`. Intet "Gigabit".
2. **I K2 hører strengen til dock'en.** Konteksten, ordret fra det flade udtræk:
   `…Mounting  = Bolt/tie down    locations provided C ONNECTIVITY Gigabit Ethernet
   passthrough    to robot CER TIFIC A TIONS cTUV us Certied to UL 1564…`
   Den står altså mellem dock'ens `ENVIRONMENT`-blok og dock'ens `CERTIFICATIONS`-blok
   — og `cTUVus`-certificeringen henfører FUND-vest **selv** til dock'en i felt 17.
   Basisrobottens egen `CONNECTIVITY` i K2 lyder: `WiFi  = 2.4GHz / 5GHz b/g/n  Ethernet`.

**Konsekvens:** posten ville tilskrive robotten en gigabit-port, som producenten kun
lover på ladestationen. Rettelse: felt 26 = `DB25 (2 ports)` · `Ethernet` (uden hastighed)
· WiFi `2.4GHz / 5GHz b/g/n`. Dock'ens gigabit-passthrough hører i felt 17.

### FEJL 2 (kildefejl) — `built-in stereo cameras` tilskrives K1, men står kun i K2

FUND-vest afsnit 1, felt 19:

> | 19 | kameraer ~ | `built-in stereo cameras`, `Horizontal Field of View 360°` | — | **K1** |

`grep -c -i "stereo" spot.html` → **0**. Strengen står i `bd_spec.pdf`:
`…using an intuitiv e tablet applica tion and  built-in s t er eo camer as.`
— i databladets marketingprosa, ikke i en specifikationstabel.

`Horizontal Field of View 360°` **er** i K1 (udtræk linje 191-192). Rækken blander altså
to kilder og krediterer kun den ene. Regel 2 i `robotdata` gør `kilde` obligatorisk pr.
tal; her er den forkert på den ene halvdel. Bemærk også, at felt 18's note
(*"Basisrobotten har stereokameraer, ikke LiDAR"*) hviler på samme K2-streng.

### FEJL 3 (kildefejl, mildere) — autonomi-citaterne findes kun i K2

FUND-vest afsnit 1, felt 23 citerer `Manual & Autonomous Operation`, `Object Avoidance`,
`Stair & Complex Terrain Navigation` med kilde **K1, K2**. Alle tre er badge-tekster i
`bd_spec.pdf`; `grep -o -i -E "Object Avoidance|Stair & Complex|Manual & Autonomous"
spot.html` → **0 hits**.

K1 understøtter **substansen** i andre ord (*"both manual operations and autonomous
missions"*, *"autonomously charging, dynamically replanning around new obstacles"*,
`Collision Avoidance`), så feltet er ikke opfundet — men de citerede strenge er K2's.
En læser, der slår citatet op i K1, finder det ikke.

### FEJL 4 (regnefejl) — "Alle øvrige 25 felter" skal være 26

FUND-vest afsnit 3: *"Alle øvrige **25** felter: ikke oplyst"*, umiddelbart efter en
tabel med 5 udfyldte felter, i et dokument der selv fastslår at nævneren er **31**
(afsnittet "Nævneren er ikke 29 — den er 31"). 31 − 5 = **26**. Med den gamle nævner
29 ville tallet være 24. Hverken 24 eller 26 er 25.

Selve tæthedstallene er derimod **rigtige** — jeg genregnede alle seks:
18/29 = 62,07 % · 18/31 = 58,06 % · 17/29 = 58,62 % · 17/31 = 54,84 % (afsnit 1);
11/29 = 37,93 % · 11/31 = 35,48 % (afsnit 2); 5/29 = 17,24 % · 5/31 = 16,13 % (afsnit 3).
Og jeg talte rækkerne i tabellerne: afsnit 1 har 18 udfyldte felter, afsnit 2 har 11,
afsnit 3 har 5. Alle tre stemmer.

---

## Del 4 — Ikke fejl, men noget nogen skal beslutte

**U1 — Fem citater i FUND-vest er *normaliserede*, ikke ordrette.**
`Certified` og `cTUVus Certified` (ligatur genindsat, se F3), `Updated: 05/22/2024`
(kerning fjernet), `DIMENSIONS Length = 1100 mm…` (dobbelt mellemrum reduceret),
`Safe on open grated stairs` (siden bryder det over to linjer), `Flexible API and Python
SDK` (kerning fjernet). Alle fem er *rigtige* gengivelser af det, PDF'en/siden viser —
men de kan ikke `grep`'es i råfilerne, og et automatisk kildetjek vil melde dem som
afvigelser. Reglen for hvad "ordret" betyder, hører i `/metode/`.

**U2 — K4 offentliggør et rækkeviddetal, FUND-vest gemmer kun dets billedtekst.**
`anymal.txt` linje 130-131: værdien er `2 km - 1.24 mi`, billedteksten er
`Walking range (90 - 120 min) per charge`. FUND-vest citerer billedteksten som var den
feltets indhold, og taber `2 km`. Skemaets 31 felter har ingen `raekkevidde` — det er
en skemabeslutning, ikke en indsamlingsfejl, men tallet er publiceret og bør ikke
forsvinde tavst. (Metrisk/imperialt krydstjek: 2 km = 1,243 mi. **OK.**)

**U3 — Pan-tilt-enheden står også på ANYmal, ikke kun på ANYmal X.**
`anymal.txt` linje 73-74: `Pan-tilt Unit` / *"High-range motion of the payload (+/- 90°
vertical, +/- 165° horizontal)…"* — ordret samme streng som på K5. FUND-vest fører den
kun i afsnit 3 (ANYmal X, felt 19), ikke i afsnit 2. Det er en manglende oplysning på
ANYmal-posten, ikke en forkert.

**U4 — En tredje K1/K2-uenighed, som ikke er noteret.** Kollisionsundgåelse:
K1 skriver `maintains set distance from stationary **objects**`, K2 skriver
`maintains set distance from    stationary **obstacles**`. Ubetydeligt for et tal, men
det er det tredje sted de to Boston Dynamics-kilder afviger (efter længden og vægten) —
og det understøtter FUND-vest' egen anbefaling om at gøre `kilde` til en liste.

**U5 — Ingen af filerne følger `media/_kilder/LÆSMIG.md`'s navngivningsregel.**
Reglen er `<producent>-<model>-<hvad>-<hentedato>.<ext>`, fx
`unitree-b2-specside-2026-08-19.png`. Faktiske navne: `spot.html`, `bd_spec.pdf`,
`1101b7e2.html`, `x.js`, `x.txt`. Hentedatoen ligger i **mappenavnet**
(`raa-vest-2026-08-19`) i stedet — forsvarligt, men det er ikke det, LÆSMIG.md siger.
Og 21 af de 58 filer har hash- eller bogstavnavne, hvis kilde kun kan findes ved at
åbne dem.

**U6 — Der findes ingen manifest, der binder filnavn til URL.**
Mappen indeholder 58 filer og **ingen** log, JSON, `.csv` eller LÆSMIG — kun HTML, TXT,
PDF og JS (verificeret: `ls -a | grep -v -E "\.(html|txt|pdf|js)$"` giver kun `.` og `..`).
For de fire HTML-filer kunne jeg læse URL'en ud af `canonical`/`og:url`. **For
`bd_spec.pdf` kunne jeg det ikke** — PDF'en har ingen metadata. Sammenkædningen til K2
hviler på tre indicier: (a) `spot.html` linker ordret til
`https://bostondynamics.com/wp-content/uploads/2020/10/spot-specifications.pdf`,
(b) PDF'ens fod indeholder `www.bostondynamics.com/products/spot`, (c) `Updated:
05/22/2024` matcher K2's beskrivelse. Det er stærkt, men det er indicier, ikke et
hentelog. Et `curl`-manifest med URL, HTTP-status, `Last-Modified` og SHA-256 pr. fil
ville koste fem linjer og gøre hele mappen citerbar.

**U7 — `bd_shop.html`s egen og:url er `/Page/Index`, ikke `/`.** K23 i kildetabellen
skriver `https://shop.bostondynamics.com/`. Filen har ingen canonical. Ubetydeligt,
men det er den slags, der gør en URL uverificerbar to år senere.

---

## Tælling

**Efterprøvet 41 påstande i 8 råfiler, fandt 4 fejl.**

- 41 nummererede påstande i Del 2, hver med fil, søgeudtryk og ordret fundet streng.
- 8 råfiler brugt som bevis: `spot.html`, `bd_spec.pdf`, `bd_arm.html`, `arm.txt`,
  `bd_shop.html`, `anyspec.html`, `anymal.txt`, `anymalx.txt`.
  (`pdf.js` og `x.js` er værktøj, ikke bevis; `x.txt` indeholder intet bevis.
  Derudover åbnede jeg 3 filer uden for min liste — `1101b7e2.html`, `25d42ffc.html`,
  `b9c7fcb9.html` — for at fastslå .txt-filernes ophav.)
- 4 fejl: FEJL 1 (indhold, `Gigabit Ethernet`), FEJL 2 (kilde, `stereo cameras`),
  FEJL 3 (kilde, autonomi-citater), FEJL 4 (regning, "25 felter").
- Derudover 7 punkter til beslutning (U1-U7), som ikke er talt som fejl.
- Alle 41 påstande gav hit. **Ingen påstand i afsnit 1, 1b, 1c, 2 eller 3 viste sig at
  være opfundet.** De fire fejl er alle tilskrivnings- eller regnefejl, ikke fabrikation.

---

## Selv-review — hvad jeg er usikker på

**Hvad jeg ikke kunne afgøre**

1. **`bd_spec.pdf`s identitet er ikke bevist, kun sandsynliggjort.** Se U6. Uden
   hentelog kan jeg ikke udelukke, at filen er en ældre eller nyere revision end den,
   der ligger på K2-URL'en i dag. `Updated: 05/22/2024` er PDF'ens *eget* stempel, ikke
   en hentedato.
2. **"Den eneste PDF på hele domænet" kan jeg ikke verificere.** Jeg har fire
   anybotics-sider. Alle fire linker kun etikkodekset. Det er konsistent med påstanden,
   men fire sider er ikke et domæne. Påstanden i FUND-vest er stærkere end det materiale,
   mappen indeholder.
3. **Jeg har ikke krydstjekket alle metrisk/imperiale par**, kun dem FUND-vest selv
   rejser plus `2 km - 1.24 mi`. Fx `1140 mm (44.9 in)` (= 44,88 in, OK) og
   `927 mm (36.5 in)` (= 36,50 in, OK) tjekkede jeg i hovedet, ikke maskinelt. Et script,
   der kører alle par igennem, ville være billigere og mere troværdigt end min
   stikprøve — og det er præcis den validator, D2 argumenterer for.
4. **Jeg har ikke åbnet `Information for Use`**, som FUND-vest' CE-forbehold henviser
   til. Den ligger ikke i mappen, og jeg må ikke hente noget.
5. **Jeg har ikke efterprøvet, om FUND-vest har *overset* felter**, ud over de tre
   tilfælde jeg faldt over (U2, U3, U4). Jeg gik fra FUND-vest til råfilen, ikke
   omvendt. En fuld gennemgang den anden vej — hver talstreng i råfilen mod skemaet —
   ville sandsynligvis finde flere. Det er den dyre retning, og den blev ikke kørt.

**Hvor jeg kan tage fejl i mine egne fund**

- **FEJL 1** hviler på, at `bd_spec.pdf`s tekststrøm følger dokumentets visuelle
  gruppering. Det er ikke garanteret i en PDF — tekst kan placeres i vilkårlig
  rækkefølge. Mit argument er stærkt (`Gigabit`-strengen ligger klemt mellem to blokke,
  FUND-vest **selv** henfører begge til dock'en) og understøttes uafhængigt af, at
  `Gigabit` slet ikke findes i K1. Men et menneske bør se PDF-siden med øjnene, før
  posten skrives. **Det er samme type opgave som D2 var — og D2 viste, at øjnene giver
  et andet svar end mekanikken.**
- **FEJL 3** er den mildeste, og man kan rimeligt mene at "K1, K2" på en kvalitativ
  række betyder "understøttet af begge kilder", ikke "citeret fra begge". Jeg fører den
  som fejl, fordi de øvrige rækker i tabellen bruger kolonnen som citatkilde, og
  inkonsistensen er selve problemet.
- **Jeg har ikke set siderne renderet.** Alt hviler på statisk HTML og et
  tekstudtræk. For `spot.html` og de to anybotics-sider er det uproblematisk (alt står
  server-renderet), men jeg kan ikke udelukke, at JavaScript overskriver en værdi ved
  indlæsning. Konkret risiko: lav for et Beaver Builder-listemodul.

**Hvad jeg ikke rørte**

Ingen fil i repoet er ændret. Bemærk dog: `git status` viser `STATUS.md` som **modified**
med 94 tilføjede linjer (nye afsnit D6 og D8, "Kortlægning af de 58 råkilder — fire
agenter"). **Det er ikke mit arbejde.** Ved sessionens start var repoet rent; ændringen
er kommet til undervejs, formodentlig fra den agent, der koordinerer denne runde.
Jeg noterer det, så det ikke senere tilskrives kildekortlægningen.
