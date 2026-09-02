# BRIEF — spor/f2-vest: 13 vestlige robotter, engelsk kilde, intet udskilt endnu

**Læs `fund/BRIEF-FAELLES.md` FØRST.** Den bærer L87, kolonnelisten,
efterprøvningen, miljøfælderne og rapportformen. Denne fil siger kun, hvad der
er dit.

Arbejdsmappe: `C:\Praktik\websites\udstilling-wt-f2vest` (gren `spor/f2-vest`).

## Din primære opskrift

**`fund/OPSKRIFT-fase2.md`** (engelsk kilde). **Ingen af dine 127 advarsler har
et udskilt ordlydsfelt** — citatet ligger inde i den danske prosa på dem alle.
Det er pilotens kasse A i ren form, 127 gange.

Læs også CJK-opskriften: dens afsnit om at verificere en tidligere agents citat
mod selve kildefilen gælder også dig.

## Dine robotter — og INGEN andre

```
2184=anybotics-anymal        2185=anybotics-anymal-x    2187=bhairav-robotics-shvana
2188=boston-dynamics-spot    2214=ghost-robotics-spirit-40
2215=ghost-robotics-vision-60                           2216=keybotic-keyper
2217=mab-honey-badger-4      2218=mab-honey-badger-5    2225=neura-quadruped
2228=rainbow-robotics-rbq-10 2229=raion-robotics-raibo2 2230=rivr-one
```

Ethvert skriv mod et andet `robot_id` er en fejl i dit spor og bliver målt i
`change_log`.

## Grundmåling — DINE FØRSTE KOMMANDOER

```
"/c/Program Files/nodejs/node.exe" tools/validate.mjs
git log --oneline -1
```

Orkestratorens tal umiddelbart før afsendelse: validate **77 filer / 0 fejl /
1 advarsel**, HEAD `05cf625`. **Afviger dine, så STOP og rapportér det.**

Kopiér derefter `fund/maal-f2.mjs` (ligger i din worktree) til
`fund/maal-f2-vest.mjs`.

**RET FØRST ÉN TING I KOPIEN:** originalen kalder `process.exit(1)` efter et
`fetch` (linje 11) — det er exit-127-fælden fra fællesbriefet. Skift til
`process.exitCode = 1`. Det er en kendt fejl i orkestratorens eget script; ret
den i din kopi, og skriv i rapporten at du gjorde det.

Kør den på dine 13 robotter. **Den giver i dag PRÆCIS dette** — bekræft:

```
caveat                        127 | dansk:  109
  heraf uden ordlyd           127 | dansk:    -
caveat_wording                  0 | dansk:    0
applications.note              13 | dansk:   13
images.note                     1 | dansk:    1
robots.notes (elementer)       29 | dansk:   27
robots.notes_wording (el.)      0 | dansk:    0
```

**Får du andre tal, så STOP og rapportér.**

## `value_text` på dine robotter

Målt: **11 danske værdier** fordelt på dine robotter. Tallet er en
**forudsigelse** — find dem selv og skriv det faktiske.

## Særligt for dit spor

**Hjemby-fælden, betalt 19. aug 2026, og alle tre tilfælde er dine.**
Producentens hjemby stod som *"Waltham, Massachusetts"* for Boston Dynamics —
og strengene `waltham`, `massachusetts` og `hyundai` findes **0 gange** i alle
fire Boston Dynamics-råfiler. Samme fejl fandtes for **Rainbow Robotics**
(*"Daejeon"*, mens producentens egen sidefod siger Sejong-si) og **Ghost
Robotics** (*"Philadelphia"*, 0 træffere i tre råfiler).

Det tredje tilfælde blev først fundet, da nogen efterprøvede **alle** hjembyer
under ét. Fundet skriver det selv: *"Derfor er det tredje tilfælde ikke fundet
før: ingen søgte på det."*

**Efterprøv derfor enhver stedangivelse i dine advarsler mod råkilden.** Det er
præcis L87's område, og du har tre kendte tilfælde at begynde med.

**Ghost Robotics Vision 60 bærer projektets eneste valideringsadvarsel:**
metrisk 2,4 m/s mod imperial 4,9 mph afviger 9,6 %. Den er **kendt og bevidst**,
båret som `advarsel:` jf. regel 9. **Rør den ikke** — men bliv ikke forskrækket
over den i dit validate-output.

## Filejerskab

Du ejer: `fund/maal-f2-vest.mjs` · `db/f2-vest-skriv.mjs` ·
`fund/FUND-f2vest.md` · `fund/BRIEF-f2-vest.md` · og
`media/_kilder/raa-f2-vest-<dagens-dato>/`, **hvis** du henter nyt.

Du rører **ikke** filer, der tilhører `f2-genisom`, `f2-galileo` eller
`f2-unitree`, og ikke `db/fase2-tjek.mjs`, `db/f2-skriv.mjs`, `db/tjek.mjs`,
`db/ordbog.mjs`, `tools/`, `assets/`, `data/`, `tests/` eller de to opskrifter
(foreslå ændringer i rapporten i stedet).

## Færdig når

- Dansk-tallet er **0** i hver kolonne, du har rørt — undtagen rækker på
  L87-listen, som står urørte. Skriv hvor mange.
- Talkolonne-diffen er **tom**.
- `change_log` har dine skrivninger og **0 uden for dine egne robotter**.
- Du har læst alle dine tekster igennem selv og skrevet *"N læst, M fejl"*.
