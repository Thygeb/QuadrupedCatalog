# FUND-sammenlign.md — spor/sammenlign

## Skill-vurdering
Ingen af projektets fem skills passer direkte: opgaven er en rettelse i eksisterende
tools/skabelon-kode og tests, ikke design-/IA-planlægning (`impeccable`), ikke scaffolding
(`new-project`), ikke en kritikrunde af en bygget side (`ui-ux-critique`/`critique`), og
ikke en Supabase-opgave. `robotdata`/`parallelt` hører til orkestratorens lag. Gik forbi
alle fem med denne begrundelse — "ingen skill passer her".

## Grundmåling (punkt 0, før ændringer)
validate 77 fil(er)/0 fejl/1 advarsel · tests 217 bestået/2 fejlet · build 213 sider/1110
tal med kilde/0 uden — matcher orkestratorens tal præcist, ingen afvigelse.

## 1. Løsning valgt / fravalgt
- Punkt 1: `standardvalg()` udleder trioen via samme `taethed()` (validate.mjs), bygget
  allerede bruger til sluttællingen — fravalgt: en ny selvstændig tæthedsberegning.
- Punkt 2: fjernede min/maks/enhed fra `feltVisning()`s tekst-gren, ved KILDEN i skema.mjs —
  fravalgt: rette kun i sammenligning.js' rendering (ville efterlade dubletten i robots.json).
- Punkt 3: genbrugte katalog.js' `soeg()`-mønster (lowercased substring på `data-sog`) —
  fravalgt: en ny fritekst-motor.
- Punkt 4: DOM-test via `node:vm` + en formålsbygget ~100-linjers HTML/DOM-shim (projektet
  har ingen jsdom) — fravalgt: kun strukturelle regex-tests uden reel JS-eksekvering.

## 2. Konfidens pr. punkt
- Punkt 1: HØJ. `node tools/build.mjs --ud=X`, læs `da/sammenligning/index.html`s JSON-blok
  felt `standard`. Kontrafaktisk: uden fixet ville standard = [spot, anymal-x, go2], og
  ANYmal X viser 4/30 — under acceptkriteriet.
- Punkt 2: HØJ. `node -e` mod `dist-b/robots.json`s `alle_felter.stroem_ud`. Kontrafaktisk:
  uden fixet ville objektet stadig bære `min:35, maks:58.8, enhed:"V"` ved siden af teksten.
- Punkt 3: HØJ. `node tests/koer.mjs` viser test 4d: 77→5 synlige chips efter "gang".
  Kontrafaktisk: uden feltet er `soegInput` null, og testen fejler på `!!soegInput`.
- Punkt 4: HØJ. `node tests/koer.mjs` viser 225 bestået/2 fejlet. Kontrafaktisk: uden blokken
  ville tallet stadig være 217/2.

## 3. Usikkerheder mødt undervejs
- Kun ÉT felt i hele kataloget (77 filer) har både tekstværdi og interval samtidig (Spots
  `stroem_ud`). Acceptkriterium 3's "stikprøve på mindst 3" dækker derfor dette ene RAMTE
  felt plus 2 interval-only-felter, der bekræfter INGEN utilsigtet sideeffekt — ikke 3
  forskellige ramte felter, for der findes kun ét.
- Briefets citat "se hvordan de eksisterende tests laver DOM-shim for sammenligningssiden"
  holdt ikke efter eftersyn: der findes hverken jsdom eller nogen eksisterende DOM-shim i
  projektet (ingen package.json, ingen npm-afhængigheder nogen steder). Byggede en minimal
  shim selv, i stedet for at antage præmissen og gætte mig til en anden løsning.

## 4. Målingerne
- validate: 77/0/1 (uændret af alle fire punkter).
- build: 213 sider / 1110 tal med kilde / 0 uden (uændret af alle fire punkter).
- tests: 217 bestået/2 fejlet → 225 bestået/2 fejlet (samme 2 kendte røde, +8 nye).
- Standardtrio FØR: Spot / ANYmal X (4/30) / Go2. EFTER: MOVENEW P1 (MicroRoboTech) 24/30,
  Gangben L2 (GENISOM AI) 23/30, S1 (Galileo (Tianjin)) 22/30 — tre forskellige producenter.
- Punkt 2: 1 felt i kataloget ramt (boston-dynamics-spot.yaml, `stroem_ud`); 3 steder i
  dist-b ændret (da/sammenligning, en/sammenligning, robots.json).
- Punkt 3: chips 77 synlige → 5 synlige (Gangben-familien) efter "gang" i søgefeltet.

---

## Nye fælder og opdagelser (uden for 60-linjers-loftet)
1. Rå YAML bruger `vaerdi_min`/`vaerdi_maks`, ikke `min`/`maks` — de omdøbes først af
   `normaliserRobot()` (`POST_NOEGLE_ALIAS`, skema.mjs). Mit første optællingsscript søgte
   direkte i rå-parsede filer og fandt 0 ramte felter, indtil jeg kørte `normaliserRobot()`
   først. Havde jeg stolet på det første (forkerte) tal, ville rapporten have sagt "0 felter
   ramt" — hvilket ville have skjult selve Spot-fejlen, briefet bad mig rette.
2. Projektet har INGEN `package.json` og ingen npm-afhængigheder overhovedet — bekræftet ved
   at et `import 'yaml'`-forsøg fejlede med `ERR_MODULE_NOT_FOUND`. "Dependency-frit" i
   CLAUDE.md er ikke kun en generator-egenskab; det gælder også tests. DOM-shimmen til punkt
   3/4d måtte derfor bygges fra bunden (node:vm + en ~100-linjers tag/attribut-parser) —
   ikke hentet fra et bibliotek, og ikke fra en eksisterende testfil, som briefet antog fandtes.
3. `.filtre input:checked + label`-stylingen (system.css) afhænger af, at input og label er
   UMIDDELBARE søskende — det tålte at pakke dem ind i et fælles `<span data-sog>`, fordi
   søskende-relationen er indeni span'et, ikke i forhold til `.filtre` selv. Ingen ny CSS var
   nødvendig (afsnit 8b i generator.css er urørt).
4. `git diff main --stat` viste ved selv-eftersyn ændringer i `.claude/settings.json`,
   `KRITIK-3-side.md` og `STATUS.md`, som jeg IKKE havde rørt — `main` var flyttet videre
   (andet spor, `abc7ce4`) siden `spor/sammenlign` blev grenet ud. Bekræftet uskyldigt med
   `git log --oneline main..HEAD`: kun mine fire commits står der.

## Punkter i briefet, jeg ikke nåede
(ingen — alle fire punkter samt deres acceptkriterier er gennemført og målt ovenfor)
