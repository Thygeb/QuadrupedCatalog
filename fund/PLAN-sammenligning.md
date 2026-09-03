# PLAN — sammenligningssidens flade

**Spor:** `spor/samlplan`, 3. sep 2026. **Skill:** `spor` (kaldt), derefter `impeccable shape`
(kaldt, `reference/shape.md` + `reference/operate.md` læst). Shape fase 1 er et
opdagelsesinterview; der er ingen at spørge herinde, så skillens egen undtagelse gælder —
*"When no human or structured answer mechanism exists, mark assumptions plainly, return the
brief, and stop."* Briefet bærer svarene (JPK's tre krav), og planen går derfor direkte til
shape fase 3.

**Planen bygger ikke noget.** Den foreskriver, med målte tal, hvad der skal bygges, og af
hvem — og den siger nej til to ting, briefet foreslog.

---

## MODE: Operate

Den besøgende løser en opgave: **afgøre hvilken robot der passer**, og kunne begrunde det.
Ikke Read. Konsekvensen er ikke kosmetisk — den afgør, hvad hvert forslag herunder dømmes på:

| Operate dømmer på | Betyder her |
|---|---|
| Skanbarhed | Kan man følge **én række** på tværs af 1.336,8 px uden at miste den? |
| Konsistens | Ser samme værdi ens ud på robotsiden og her? |
| Den rigtige brugsscene | 33 rækker × op til 3 plader, hvoraf 9 rækker er helt tavse |
| Præcision i detaljen | Tre tilstande — *ikke oplyst*, *nej*, *0* — skal kunne skelnes |

Operate tillader tæthed og forbyder udtryk for udtrykkets skyld. Det er derfor, K2 herunder
ender med **ét** nyt skel og **ingen** 33-dobbelt stregning.

---

## Fladen, som den faktisk er — målt, ikke antaget

Grundmåling først: `node tools/validate.mjs` → **77 filer · 0 fejl · 1 advarsel**.
(I en frisk worktree giver den **76 fejl**, alle R18, fordi `assets/fotos/fabrikant/`
er gitignoreret. Kopieret ind fra hovedrepoet, 610 filer, før noget blev målt.)
`node tools/build.mjs` → **216 sider**, 107 pr. sprog. Server på port **8141**, verificeret
mod disken (`daek__enhed`: 15 = 15, `saml-raekke__navn`: 3 = 3).

Alt herunder er målt i browseren på `http://localhost:8141/da/sammenligning/`.

### F1. Der findes ingen vandrette streger i matricen. Ikke svage — fraværende.

Dette vender K2 på hovedet, så det står først.

`generator.css:604` sætter `.saml-raekke > *{border-top:1px solid var(--linje)}`.
`generator.css:589–590` sætter `.saml-raekke > th,.saml-raekke > td{border-top:0}`.
Den anden er **(0,1,1)**, den første **(0,1,0)** — specificitet slår kilderækkefølge, så
regel 604 taber. Og hver eneste celle i en `.saml-raekke` **er** enten en `th` eller en `td`.

Målt på hver celle i tabellen med `getComputedStyle`:

| Element | Antal | `border-top` |
|---|---|---|
| `th.saml-raekke__navn` | 33 | `0px none` |
| `td.saml-raekke__celle` | 99 | `0px none` |
| `th.saml-gruppe__titel` | 6 | `0px none` |
| `th.specimen` | 3 | `0px none` |
| `td.specimen-hoved__hjoerne` | 1 | `0px none` |

**Regel 604 er død CSS.** Briefets præmis — *"Rækkestregen findes allerede … den kan bare ikke
ses (1,56:1)"* — er forkert: den kan ikke ses, fordi den ikke tegnes. Det er `fil:linje`-fælden
i ren form; reglen findes, og ingen kalder den.

Det, der **er** synligt, er lodret: `border-left:1px solid var(--linje)` på 99 celler
(brugt bredde målt til **0,8 px** ved `devicePixelRatio` 1 — årsagen er ikke isoleret) og
`box-shadow:1px 0 0 var(--linje)` på det klæbende rækkehoved.

### F2. Kolonnebredderne, i tre tilfælde

`table-layout` er **`auto`** (målt som *computed*, ikke som fravær i kilden). Ved 1440 px:

| Udvalg | Rækkehoved | Kolonner | Forhold bred:smal |
|---|---|---|---|
| P1 (24 felter) + BabyAlpha (0) | 224 | 917,7 · 195,1 | **4,70×** |
| P1 (24) + BabyAlpha (0) + Laikago (0) | 224 | 728,7 · 195,1 · 189,0 | **3,86×** |
| 3 × WEILAN (alle tynde) | 224 | 427,9 · 371,0 · 313,9 | 1,36× |

Briefets *"omtrent dobbelt så bred"* er altså det **milde** tilfælde. Værste målte er 4,70×,
og det opstår med **to** plader — ikke tre. Lige deling ville være 370,9 px ved tre.

### F3. Gruppetitlens klæbning virker ikke

`.saml-gruppe__titel{position:sticky;left:0}` (`generator.css:595`) sidder på en
`th colspan="4"`. Målt ved 390 px, `.saml-rulle.scrollLeft` 0 → 250:

- `.saml-raekke__navn` (rækkehovedet): venstre kant **16 → 16 px**. Klæber. ✓
- `.saml-gruppe__titel`: venstre kant **16 → −234,4 px**. Klæber ikke. ✗

Mekanismen: `sticky` flytter **kassen**, og denne kasse er hele rullebredden bred, så der er
intet at flytte. CSS-kommentaren ved siden af siger, at den klæber *"så den ikke forsvinder
under vandret rulning"*. Den forsvinder. Uændret af `table-layout`, målt i begge tilstande.

### F4. Enhedskontakten står allerede i topbaren

`side.mjs:2150` skriver `<label class="enhedsskift" for="enhedsskift">` i `.daek__enhed` på
**alle 107** danske sider. `system.css:2399` skjuler den, og `system.css:2411–2413` viser den
kun via `:has()`, når siden har en `.enhedsskift__boks`. Landet i commit `8bd39b3`
(*"PUNKT 2: enhedsvælgeren samlet i topbaren"*), som er forfader til dette spors gren.

Målt i den byggede `dist/da`:

| | Tal |
|---|---|
| `<header class="daek">` | 107 / 107 |
| `class="enhedsskift"` (etiketten) | **107 / 107** |
| `id="enhedsskift"` (den fysiske boks) | 72 / 107 |
| Kontakten synlig på robotside | **ja** — 300 × 36 px ved x = 1080,8 |
| Kontakten synlig på katalog | **nej** — `display:none` |

Briefets *"`side.mjs` … tegner den **0** gange"* er forkert: `side.mjs` tegner etiketten
107 gange. Briefet målte `id=`, som er boksen, og boksen ejes stadig af `robot.mjs` og
`sammenligning.mjs`. Se `## K3` for, hvad JPK så i stedet.

### F5. Ingen rækkemarkering, og en lang rejse for øjet

- Regler, der matcher `.saml-raekke…:hover`, læst ud af CSSOM: **0**.
- `focus-within` i hele `generator.css`: **1** (ikke i matricen).
- Øjets rejse fra feltnavnets venstre kant til sidste celles højre kant ved 1440: **1.336,8 px**.
- Rækkehøjde: median **43,7 px**, mindste 43,7, største 70,2.
- 33 rækker, 6 grupper, **9 helt tavse rækker**.

### F6. En klasse uden CSS

`assets/sammenligning.js:526` sætter `saml-raekke__celle--tavs` på hver tavs celle — målt
**42 af 66** ved to plader. Forekomster i `system.css` + `generator.css`: **0**.
En færdig, gratis krog, som ingen har brugt.

### F7. Loftet er tre plader, ikke fem

`tools/skabelon/sammenligning.mjs:228` sætter `maksAntal: 3`, efterprøvet i den byggede
HTML (`"maksAntal":3`). Briefet beder om en beskrivelse ved **4 og 5** valgte robotter.
De tilstande **kan ikke opstå**. De er beskrevet under `## K1` som betingelse, ikke som
tilfælde.
