# FUND — spor/f2-genisom: 9 GENISOM-robotter, kinesisk kilde, L87

## 1. Valgt løsning / fravalgt

Valgt: fulgte `OPSKRIFT-fase2-cjk.md` + `OPSKRIFT-fase2.md` mekanisk — split
caveat_wording til KUN CJK-citater, oversæt dansk caveat/note/notes til engelsk.
Intet `Skill`-tool-kald denne session: G1 var allerede kondenseret ind i de to
opskrifter/BRIEF-FAELLES.md. `supabase`/`fejljagt` fravalgt: PostgREST-mønstret
var kopieret fra `db/f2-cjk-skriv.mjs`, og ingen uventet fejl krævede rodårsagsjagt.

## 2. Konfidens pr. punkt

Alle Høj, genkørbare, med kontrafaktisk (tallet, hvis arbejdet var forkert):

- Grundmåling: `node tools/validate.mjs` → 77/0/1, HEAD `05cf625` (matcher
  briefet — forkert branch giver et andet HEAD).
- `node fund/maal-f2-genisom.mjs 2205..2213` → se punkt 4 (forkert filter gav
  andre tal to gange under selv-tjek, se punkt 3).
- `node fund/f2-genisom-verificer.mjs` → 251 fragmenter, 0 fejl (en forkert
  wording printer `FEJL [.../...] "..." -> INGEN FIL` — skete 11 gange undervejs).
- `node fund/f2-genisom-talkolonne-diff.mjs` → 0 (en rørt talkolonne printer
  `DIFF UDEN FOR TILLADT`).
- `node fund/f2-genisom-changelog-tjek.mjs` → 174/174, 0 uden for egne robotter.
- `node fund/f2-genisom-utf8tjek.mjs` → 174/174 match (en forvansket streng
  giver en `MISMATCH`-linje).

Middel: egen gennemlæsning (198 tekster, `fund/f2-genisom-egen-gennemlaesning.txt`)
— menneskelig, ikke genkørbar til samme facit. MANIFEST-sha256: Høj for
stikprøven (verificeret), Middel for de øvrige 16 (ikke enkeltvis genberegnet).

## 3. Usikkerheder mødt undervejs

- **Robot 2205 (L1) manglede sin egen kilde** — kun "钢镚 L1 Maker" (en anden
  vare) var arkiveret. Løst med en frisk hentning i dag; matchede DB'ens tal
  præcist, inkl. ét tal ingen arkiveret fil bar.
- **2206's kilde bruger selv ASCII "x" i én etiket**, "×" i værdien, samme
  streng. Min første "korrektion" til "×" overalt blev fanget af mit eget
  verifikationsscript (0 hits) og rettet tilbage til kildens faktiske tegn.
- **Én ikke-verificerbar sætning droppet** (2205/compute: en "top-note"-
  henvisning uden nogen robots.notes at pege på) — under L87.
- **`applications.quote`/`quote_wording`/`note_wording` har samme problem som
  caveat_wording, men står IKKE på min tilladte kolonneliste.** Rørt ikke —
  flages til JPK som et gap.
- Ikke alle 17 filers sha256 er enkeltvis genberegnet mod disk (kun stikprøven).

## 4. Målingerne

```
validate.mjs: 77/0/1 · HEAD 05cf625
Foer:  caveat 151(dansk 137) · caveat_wording 140(126) · app.note 9(9)
       images.note 5(5) · robots.notes 13(13) · notes_wording 12(9)
Efter: alle dansk-tal 0
PATCH: 174 planlagt/skrevet/bekraeftet (field_entries 153 · applications 9
       · images 5 · robots 7)
change_log: 174, 0 uden for 2205-2213
Talkolonne-diff: 0 · Kildeverifikation: 251 fragmenter/0 fejl
UTF-8-tjek: 174/174 match · value_text rettet: 21 (14 dansk-flagede + 7 fundet
manuelt: "Bredvinkelkamera", "Stereokamera", "kernet") · Egen laesning: 198/0 fejl
```

## Nye fælder og opdagelser

1. **En robotside kan mangle helt fra `media/_kilder/`, selvom producentens
   MENU lister den som et selvstændigt produkt** — ikke bare en manglende
   MANIFEST.tsv. "钢镚 L1" og "钢镚 L1 Maker" ligner samme navn, men er to
   produkter med hver sin URL og hver sin techParamsData. Kontrollér ALTID
   producentens egen menu/model-liste, før du antager at en lignende sidenavn
   dækker din robot.
2. **En variant-familie kan dele ÉN kildefil.** L2 og M1's `techparams.json`
   bærer `datas[0..2]` med et `classname`-felt, der navngiver hver variant
   ("钢镚 L2"/"钢镚 L2-W"/"钢镚 L2-W Ultra"). Det løste L2-W/L2-W Ultra/M1
   Pro/M1 Ultra's citater uden en eneste ny hentning — men kun fordi jeg
   tjekkede for flere `datas`-blokke i stedet for at antage én.
3. **Kildens egen etiket kan være inkonsistent** (L1-W's "×" i værdien, "x" i
   etiketten, samme streng). En automatisk "korrektion" mod det "rigtige" tegn
   er en fejl, hvis den ikke er tjekket mod netop DEN streng — mit eget
   verifikationsscript fangede min egen overkorrektion.
4. **Label+værdi kan sidde i JSON UDEN nogen separator** (`"站立尺寸（长 × 宽
   × 高）"` + `"约 630 × 360 mm"`, sammensat uden mellemrum/kolon i den
   citerede streng). Split-metoden i OPSKRIFT-fase2-cjk.md (kolon, blank)
   fangede det ikke — måtte udvide med et split lige efter "）".
5. **Skjult dansk uden æøå og uden ordlisteord findes STADIG i value_text**,
   som ingen tidligere spor rørte: "Bredvinkelkamera", "Stereokamera",
   "8-kernet" er danske compound-ord, som dansk-detektoren aldrig ser. 7 af
   mine 21 value_text-rettelser lå uden for det detektoren fandt.
6. **To rækker (2205/2207 cameras) havde `value_text` uden `caveat` overhovedet**
   — de lå UDEN FOR mit klassificerede per-robot-dump (som filtrerede på
   `caveat != null`), og ville være sluppet igennem, hvis jeg ikke havde kørt en
   separat forespørgsel efter "value_text uden caveat" på tværs af alle 9 robotter.
7. **`caveat` var allerede en MASKINELT afledt streng** (caveat_wording med
   CJK-bærende citater fjernet) fra en tidligere kollektionsrunde — ikke egen
   prosa. Det forklarer de grammatisk hængende parenteser ("(antal ledmotorer),
   ikke eksplicit...") i den oprindelige tekst, og gjorde oversættelsen hurtigere,
   fordi strukturen allerede var der.

## Punkter i briefet, jeg ikke nåede

- Ingen. Alle punkter i "Færdig når" er opfyldt og målt ovenfor.
