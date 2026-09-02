# FUND-tjekkun.md — spor/tjekkun

## 1. Løsning

Valgt: udvidede db/tjek.mjs på stedet med `--liste`/`--kun`/`talLig()` (D1-D4). Fravalgt: et
selvstændigt `db/diff.mjs` — det ville duplikere eksport-kæden og dybtLig (Aa12: ét sted), og et
fase 2-spor skulle køre to scripts i stedet for ét for at bevise sit eget facit.

## 2. Konfidens pr. punkt

- **A1** (uden flag): HØJ. `node db/tjek.mjs` → sammenfatningslinjen tegn for tegn som "giver i
  dag", plus ny linje "77/77 tal-lig (uden tekstnoegler).", exit 0. Forkert: linjen ville mangle.
- **A2** (--liste): HØJ. `node db/tjek.mjs --liste` → 25 linjer, "13  Unitree Robotics" først,
  0,25 s, ingen "1/4", exit 0. Forkert: eksporten ville køre, ~60 s.
- **A3** (--kun gyldig): HØJ. `node db/tjek.mjs --kun="Unitree Robotics"` → "13/13 tal-lig
  (Unitree Robotics)", "13/13 dybt lig (Unitree Robotics)", 0 tekstforskelslinjer, exit 0.
  Forkert: k/k-tallene ville ikke være 13/13.
- **A4a-d** (SET FEJLE FØRST): HØJ, alle fire scenarier kørt+revertet — se afsnit 4 for tal.
  `git diff --stat -- data/robots/` tomt ved hvert commit.
- **A5** (tests): HØJ. `node tests/koer.mjs` → 1493/0. N=`grep -c "ok(" tests/dele/68-*.mjs`=14.
  Grundmåling 1493-14=1479, = briefets forudsigelse. Forkert: 1479 uden test 68's bidrag.
- **A6** (filejerskab): HØJ. `git diff --name-only main...spor/tjekkun` = netop de 8 filer under
  FILEJERSKAB. Forkert: en niende fil ville stå der.
- **A7** (eksporter importerer): MIDDEL — briefets ordlyd er upræcis, se afsnit 3.

## 3. Usikkerheder mødt undervejs

- **A7 holder ikke helt**: `db/eksporter.mjs:73` importerer KUN `traekValidateTal`. `dybtLig`
  importeres af `tests/dele/63-ordbog-og-skema.mjs:181`, ikke af eksporter.mjs. tjek.mjs's egen
  (uændrede) toptekst påstår begge — allerede upræcis på main, ikke rettet af mig (uden for D1-D6).
- **D3's linjetekst**: D3 skriver "M/77 tal-lig (uden tekstnoegler).", A1 citerer den forkortet.
  Jeg fulgte D3's fulde ordlyd som facit.
- **--liste's tie-break** er ikke specificeret. Valgt: alfabetisk (da). Faktisk øvet i data: DEEP
  Robotics/GENISOM AI, begge 9 robotter, "DEEP" står først.
- **ADVARSEL-linjen ("tal afviger uden for <p>")** øves IKKE af A4a-d. Ekstra, ikke-krævet kontrol
  (ghost-robotics-vision-60's vægt midlertidigt ændret) gav "ADVARSEL: ... ghost-robotics-vision-60",
  exit 0 — revertet før commit.

## 4. Målingerne

- A1: "TJEK: 77/77 dybt lig · validate 0 fejl · build sider 216=216 · kilder 1111=1111" +
  "77/77 tal-lig (uden tekstnoegler)." · exit 0.
- A2: 25 linjer · "13  Unitree Robotics" først · 0,249 s · exit 0.
- A3: 13/13 tal-lig · 13/13 dybt lig · "validate-fejl: 0 egne, 0 andre" · exit 0.
- A4a (advarsel ændret, unitree-aliengo): 76/77 dybt lig · 77/77 tal-lig (globalt) · 13/13 tal-lig
  · 12/13 dybt lig (Unitree) · "unitree-aliengo: .felter.egenvaegt.advarsel" · exit 0.
- A4b (+ egenvægt 21.5→99.9, samme fil): 76/77 tal-lig (globalt) · 12/13 tal-lig (Unitree) ·
  exit 1.
- A4c (unitree genoprettet, advarsel ændret i ghost-robotics-vision-60): 76/77 dybt lig · 77/77
  tal-lig (globalt) · 13/13 tal-lig · 13/13 dybt lig (Unitree) · exit 0.
- A4-bonus (egenvægt 51→77.7 paa ghost-robotics-vision-60, ikke krævet): "ADVARSEL: tal afviger
  uden for Unitree Robotics: ghost-robotics-vision-60" · exit 0.
- A4d: `git checkout -- data/robots/` → samme tal som A3 · `git diff --stat -- data/robots/` tomt
  ved alle 7 commits.
- A5: 1493 bestået, 0 fejlet · N(68)=14 · grundmåling 1479/0 · fri disk 9,5→8,7 GB.
- A6: db/LAESMIG.md, db/tjek.mjs, fund/BRIEF-tjekkun.md, tests/dele/68-tjek-kun.mjs,
  tests/dele/fixtures/68-{original,mut-tekst,mut-tal,mut-raekkefoelge}.json.
- A7: `traekValidateTal` importeret af eksporter.mjs:73 · `dybtLig` importeret af test 63:181,
  IKKE af eksporter.mjs. Begge veje fejlfrie (A1, A5).
- validate.mjs's fejllinjeform (tools/validate.mjs:1357): `FEJL      <robot> · <felt> · <regel>:
  <besked>`, `<robot>`=`path.basename(fil)`.

## Nye fælder og opdagelser

- **A7's ordlyd i briefet er upræcis**: `dybtLig`/`traekValidateTal` importeres IKKE begge af
  db/eksporter.mjs — kun `traekValidateTal` gør (linje 73). `dybtLig` bruges af test 63 (linje
  181), ikke af produktionskoden. tjek.mjs's uændrede toptekst (linje 30-32) bar allerede denne
  unøjagtighed på main; jeg har ikke rettet den (min FILEJERSKAB dækker kun min egen nye tekst).
- **dybtLig() stopper ved FØRSTE forskel** (short-circuit), og kan derfor ikke levere D3's "slug:
  <stier>"-liste af ALLE afvigende tekstnøgler. Skrev en ny, ikke-eksporteret `tekstforskelle()`,
  som fortsætter i stedet for at stoppe — ellers ville en robot med to tekstforskelle kun vise én.
- **--liste's tie-break blev faktisk øvet** af de rigtige data (DEEP Robotics/GENISOM AI, begge 9
  robotter) — ikke en hypotetisk kant.

## Punkter i briefet, jeg ikke nåede

(ingen)
