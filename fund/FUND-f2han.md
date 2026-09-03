# FUND — spor/f2han: kinesiske tegn ud af `caveat`

**Skill:** `spor` kaldt og fulgt (lykkedes fra worktreen). Fravalgt: `supabase`
(skrivevejen var givet, intet MCP-behov), `fejljagt` (intet uventet tal),
`robotdata` (ingen robotpost redigeret, kun to tekstkolonner).

## Valgt løsning / fravalgt alternativ

Valgt: flyt/strip kinesisk term-for-term efter briefets to regler (allerede i
`caveat_wording` → strip; ikke der → flyt). Fravalgt: en generisk
regex-oprydning uden at læse hver sætning — ville have flyttet **glosser**
(forklarende kinesisk, IKKE kildetekst) ind i `caveat_wording` som falsk
proveniens. Se "Nye fælder" nedenfor.

## Afvigelse fra briefet — meldt, ikke rettet imod

Briefets "43 rækker over **16 robotter**" er forkert i sidste led. Egen
optælling (`node fund/f2han-maal.mjs`) gav **20 robotter**. Producent-
fordelingen matcher briefet **eksakt** (GENISOM 19, Yuejia 13, Galileo 4,
Xiaomi 2, Yufan 2, MicroRoboTech 1, CVTE 1, Astrall 1 = 43) — kun robot-
optællingen var en regnefejl i briefet, ingen datafejl.

## Konfidens pr. punkt

- **Punkt 1 (`han_i_caveat` = 0):** høj. Kommando: `node fund/f2han-maal.mjs`.
  Målt før: 43. Målt efter: **0**. Kontrafaktisk: havde en række stået urørt,
  havde tallet vist ≥1.
- **Punkt 2 (`han_i_caveat_wording` ≥ 317):** høj. Samme kommando. Målt efter:
  **345** (+28, fra 10 rækker der fik ny/udvidet ordlyd). Kontrafaktisk: et fald
  under 317 havde bevist tabt kildetekst.
- **Punkt 3+4 (`change_log`, `spor/f2han`; kun 8 producenter):** høj.
  Kommando: `node fund/f2han-verificer.mjs`. Målt: **43** rækker, alle
  `field_entries`, **0** med ændret talkolonne (`value_number`/`minimum`/
  `maximum`/`value_bool`/`imperial_value`, `old_row` vs. nuværende), nøjagtig
  de 8 forventede producenter, **0** uventede. Kontrafaktisk: en talændring
  havde krævet en anden `saet`-kolonne, som hvidlisten i `db/f2-skriv.mjs`
  strukturelt forhindrer — 0 var forventet, ikke et held.
- **Selv-efterprøvning (felt for felt mod live DB):** høj. Kommando:
  `node fund/f2han-selvtjek.mjs`. **43 rækker efterprøvet, 0 fejl** —
  hver skrevet `caveat`/`caveat_wording` sammenlignet streng-for-streng mod
  planen i `fund/f2han-data.mjs`.

## Usikkerheder

- **Galileo C1/C1-W battery_wh (`电池额定电压: 48V`):** kilden
  `galileotime-robot-zh-2026-08-25.html` er en næsten tom JS-shell (1955 byte,
  specifikationerne findes ikke i den) — kunne IKKE efterprøves mod rå-HTML.
  Flyttet alligevel, i tillid til forrige collectors citat i `caveat`, ikke
  egen verifikation. Flag, ikke en rettelse jeg er 100 % sikker på.
- Grænsetilfælde (Yuejia `基础参数`, Astrall's use-case-fane): oversat til
  engelsk i stedet for flyttet — vurderet som kontekst-henvisning (hvilken
  tabel/fane), ikke selve den citerede værdi (som allerede stod i
  `caveat_wording`).

## Målte tal

`han_i_caveat`: 43→**0**. `han_i_caveat_wording`: 317→**345**.
`han_i_value_text`: 0→0. `change_log(spor/f2han)`: **43**, 0 talkolonner.
Robotter: **20** (ikke 16). Producenter: 8/8 forventede, 0 uventede.
43/43 rækker selv-efterprøvet mod live database, 0 fejl.

## Nye fælder og opdagelser

**Ikke alt CJK i `caveat` er kildetekst — nogle er collectorens egen gloss.**
Fire tilfælde fundet, hvor den kinesiske streng eksplicit IKKE optræder i
kilden (bekræftet med `grep`/node mod `media/_kilder/`): Astrall's `充电桩`
("does not appear verbatim"), CVTE's `充电桩` (samme mønster), GENISOM's
`自由度` (kilden bruger `关节电机数量`, ikke `自由度`) og GENISOM's
`自主回充功能`/`动态负载` (citerer en ANDEN robots/producents term til
sammenligning). At flytte disse til `caveat_wording` ville have skrevet en
falsk kildeproveniens ind i det felt, hvis hele formål er "kildens ord,
uændret". Løsningen: fjern glossen, behold den engelske betydning (den stod
altid der i parentes ved siden af), tilføj IKKE til `caveat_wording`.
Briefets to regler (strip hvis bevaret / flyt hvis ikke) dækker ikke dette
tredje tilfælde — det bør tilføjes eksplicit, hvis flere fase 2-spor støder på
samme mønster.

**`media/_kilder/` har 23 mapper, ikke 19** som `miljoefaelder.md` (linje 102)
angiver — sandsynligvis vokset siden den blev skrevet. Påvirkede ikke arbejdet.

**PostgREST's standard-limit på 1000 rækker** ramte mit eget verifikationsscript
(`field_entries` har >1000 rækker) — første kørsel af `f2han-verificer.mjs`
viste 130 falske "talændringer", fordi kun de første 1000 rækker kom med og
20 af mine robotter lå udenfor. Rettet ved at filtrere på `robot_id=in.(...)`.
Nævnes fordi et fremtidigt fase 2-spor, der henter `field_entries` uden filter
eller pagination, rammer samme tavse trunkering.

## Punkter i briefet, jeg ikke nåede

Ingen. Alle 43 rækker er behandlet — 0 blev flaget/efterladt urørt, fordi
ingen krævede at lægge to kildetekster sammen i et allerede optaget
`caveat_wording`-felt (§3, tredje regel).
