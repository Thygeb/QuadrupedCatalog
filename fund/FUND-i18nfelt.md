# FUND-i18nfelt — spor/i18nfelt (Å98 spor A)

## 1. Valgt løsning pr. punkt (fravalg i samme linje)

1. `advarsel_i18n`/`note_i18n` føjet til `POST_NOEGLER`/`ANVENDELSE_NOEGLER`/
   `BILLEDE_NOEGLER` (skema.mjs) + ny eksporteret `KILDESPROG = 'da'`. Ingen
   reelt fravalg — briefets form var entydig.
2. R22 bygget som ÉN delt `tjekI18nOverbygning()`, kaldt for BÅDE
   `advarsel_i18n` (feltpost) OG `note_i18n` (anvendelse+billede) — briefets
   punkt 2 nævner kun `advarsel_i18n` ordret. Valgt fremfor at lade
   `note_i18n` stå som en "kendt nøgle" uden nogen formvalidering, hvilket
   ville modsige punkt 1's egen begrundelse. Se usikkerhed nedenfor.
3. `sprogoploesRobotter()` i build.mjs, kaldt ÉN gang pr. sprogrunde (linje
   ~262), retter `ctx.robotter` OG robotsidernes egen `for`-løkke (den ene
   plads, der IKKE gik via ctx.robotter). Fravalgt: at ændre
   `tools/skabelon/*.mjs` — briefet forbød det eksplicit, og det var ikke
   nødvendigt.
4. `db/eksporter.mjs` udvidet begge veje (LOCAL + `--fra-db`); `db/skema.sql`
   fik 3 jsonb-kolonner + 9 CHECK; `db/migrering-i18n.sql` ny fil, IKKE kørt.
   Fravalgt: at røre `db/migrer.mjs` — uden for filejerskabet. Se fælde.
5. Ingen kode ændret for dette punkt — det ER acceptkriteriet: `data/robots/`
   urørt, efterprøvet direkte.

## 2. Konfidens pr. punkt

Punkt 1-4: **høj**. Genkørbare kommandoer under "Målinger". Havde arbejdet
været forkert: punkt 1's R11-fejl ville stadig stå; punkt 2's fem sager ville
IKKE matche `/R22:/`; punkt 3's en-side ville stadig vise "UDEN batteri" 2
gange; punkt 4's `grep -c i18n` ville stadig give 0.
Punkt 5: **høj** (`git diff --stat` er selvforklarende, ingen fortolkning).

## 3. Usikkerheder

- Om R22-dækningen af `note_i18n` (ud over briefets bogstavelige punkt 2) var
  ønsket eller overimplementering — jeg vurderede den nødvendig, men det er
  min fortolkning, ikke et eksplicit krav.
- Om db/migrer.mjs-gabet (se fælde nedenfor) skal lukkes af et opfølgende
  spor, FØR noget senere oversættelsesspor forsøger at skrive
  `advarsel_i18n`/`note_i18n` til `data/robots/`.

## 4. Målinger

Grundmåling, genkørt FØR noget blev ændret — matchede briefet på alle fire:
`validate 77/0/1 · build 216 sider/1111 tal/611 billeder · tests 1487/0,
Validator 71/71 · linktjek 0 døde/50 prod/0 unåede`

Efter arbejdet, genkørt igen:
`validate 77/0/1 (uændret) · build 216/1111/611 (uændret) · tests 1515/0
(+28), Validator 71/71 (uændret) · linktjek 0/50/0 (uændret)`

```
grep -c i18n db/eksporter.mjs                                    0  ->  11
dist/en/robotter/unitree-aliengo/  "UDEN batteri"                2  ->  0
dist/da/robotter/unitree-aliengo/  "UDEN batteri"                2  ->  2
git diff --stat data/robots/ | wc -l                                  0
db/rundtur.mjs   77/77 dybt lig · 0 fejl · 216=216 sider · 1111=1111 kilder
```

---

## Nye fælder og opdagelser

- **db/migrer.mjs kender endnu ikke de nye nøgler, og det er ikke ensartet
  farligt.** `FELTPOST_NOEGLER_KENDT` (VAGT 2) fejler HØJLYDT på en ukendt
  feltpost-nøgle — den dag en YAML får `advarsel_i18n`, stopper migreringen
  synligt (godt). Men `klassificerRobot`s anvendelse/billede-genopbygning
  (linje ~296-330) har INGEN tilsvarende vagt — den kopierer nøgler
  håndskrevet, og `note_i18n` ville forsvinde TAVST gennem `kanonisk.json` og
  `seed.sql`, præcis den fejltype prosa-sporet blev afvist på 25. aug. Filen
  er uden for mit filejerskab, så jeg har ikke rettet den — kun dokumenteret
  gabet som en OMVENDT assertion i `tests/dele/60-i18nfelt.mjs` punkt 5
  (`!FELTPOST_NOEGLER_KENDT.has('advarsel_i18n')`), som skal vendes den dag
  et senere spor lukker det.
- **En modsigelse i validate.mjs's egen kommentar.** Ved `billede.note` står
  "note er sprogneutral (redaktionel forklaring, ikke brugertekst)" — men
  `side.mjs`'s `billedLinjer()` RENDERER `b.note` synligt på siden ("Billedets
  sandhed, som linjer"). Kommentaren er efter alt at dømme forældet; jeg har
  ikke rettet den (uden for scope), men den bekræfter at `note_i18n` på
  billede rent faktisk er nødvendig — teksten ER læserfacing.
- **Første db/skema.sql-udkast manglede billedes CHECK-constraints** (kun
  kolonnen blev tilføjet i første omgang) — fanget ved en krydstælling mod
  `db/migrering-i18n.sql`'s 9 constraint-navne, før commit.

## Punkter i briefet, jeg ikke nåede

(ingen)
