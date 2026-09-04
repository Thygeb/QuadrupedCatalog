# FUND — spor/fase3: bygget læser databasen, intet slettet

Skill: `spor` valgt og kaldt direkte (lykkedes fra worktreen, ingen disk-fallback
nødvendig). `references/miljoefaelder.md` læst i sin helhed før første kommando.
`supabase` og `fejljagt` overvejet (brief nævner dem) og fravalgt: al DB-adgang
genbruger `db/eksporter.mjs`'s allerede fungerende `fraDb()` uændret, så ingen ny
REST/RLS-fejlsøgning opstod, og intet tal opførte sig uventet undervejs. `design`
og `robotdata` fravalgt per brief — intet visuelt, ingen robotpost redigeret.

## Grundmåling (kommando først, tal bagefter)

```
node tools/validate.mjs   -> 77 fil(er) · 0 fejl · 1 advarsler
node tools/build.mjs      -> 216 sider · 1111 tal med kilde · 0 uden
node tests/koer.mjs       -> 1815 bestået, 6 fejlet (samme 6 som briefets liste)
```
Identisk med briefets tal — ingen af dem var forældede.

## Valgt løsning / fravalgt alternativ

- **Valgt:** `db/hent.mjs` genbruger `fraDb()+byggRobotDoc()+skrivRobotYaml()`
  (db/eksporter.mjs) og parser YAML-teksten igen med `parseYaml` — samme vej,
  db/tjek.mjs allerede beviser er dybt lig originalen. **Fravalgt:** en ny direkte
  mapping fra PostgREST-rækker til det normaliserede skema (ville duplikere
  db/eksporter.mjs's oversættelseslag og skabe en 2. kopi, der kan skride).
- **Valgt:** cache kun `fraDb()`'s rå REST-svar, byg friske doc-objekter pr. kald.
  **Fravalgt:** cache de færdige doc-objekter (billigere CPU-mæssigt, men
  `normaliserRobot()` muterer "PÅ STEDET", og build.mjs kalder `hentRobotter()`
  to gange i samme proces — delte objekter ville køre normaliseringen to gange
  på samme reference, uprøvet idempotens).

## Konfidens pr. punkt

| # | Påstand | Kommando | Konfidens |
|---|---|---|---|
| 1 | `hentRobotter()` giver 77 | `node -e "...hentRobotter().then(r=>console.log(r.length))"` → 77 | **Høj** (kontrafaktisk: modulfejl ville kaste, ikke skrive 77) |
| 2 | build.mjs uden flag = grundmåling | `node tools/build.mjs` → 216/1111/0 | **Høj** (kontrafaktisk: forkert mapping ville give andet sidetal/kildetal) |
| 3 | `dist/` byte-identisk DB vs. YAML | `diff -r dist-yaml dist-db` → 0 linjer, exit 0 | **Høj** (kontrafaktisk: en reel skema-uenighed viser sig som ≥1 linje) |
| 4 | validate.mjs uden flag = grundmåling | `node tools/validate.mjs` → 77/0/1, samme advarsel | **Høj** |
| 5a | Positionelt filnavn rammer IKKE DB | `node tools/validate.mjs data/robots/unitree-aliengo.yaml` → 0,107s | **Høj** (kontrafaktisk: et DB-kald ville tage 1–3s+) |
| 5b | `_faelles.mjs` importerbar før/efter | 9 → 10 eksporter, ingen fejl | **Høj** |
| 6 | Fuld suite = grundmåling | `node tests/koer.mjs` → 1815/6, samme 6 ved navn | **Høj** |
| 7 | Ingen delt mutation ved to `hentRobotter()`-kald | `a[0]===b[0]` → false, `a[0].slug===b[0].slug` → true | **Middel** — beviser mekanismen isoleret, men jeg satte intet logpunkt INDE i build.mjs's egen dobbeltkald-kørsel for at se det direkte |

Uafhængig bonuskontrol: `node db/tjek.mjs` (fil jeg ikke rørte) kørt EFTER alle
fem punkter gav `77/77 dybt lig · validate 0 fejl · build sider 216=216 · kilder
1111=1111` — bekræfter fra kode, jeg ikke selv skrev.

## Nye fælder og opdagelser

1. **Briefets "19 filer bruger --data=" undertæller kraftigt for build.mjs.**
   Målt præcist: 58 build.mjs-underprocesser i tests/dele/, kun **17** med
   `--data=`, **41 uden**. Efter dette spor rammer alle 41 databasen som standard
   (hver sin node-proces, hver sin REST-hentning). Suiten gik fra en umålt
   basislinje til **4m13s**, stadig grøn (1815/6), ingen ECONNREFUSED, ingen
   libuv-assertion, ingen ENOSPC i loggen. Jeg målte IKKE tiden før mine
   ændringer, så jeg kan ikke sige det præcise merforbrug — kun at det nu
   koster ca. 4 minutter og er stabilt.
2. **For validate.mjs var risikoen falsk.** Af 26 "uden --data="-forekomster
   er ALLE enten `koerValidator([enkeltFil])` (positionelt filnavn — omgår
   DB-grenen helt, fordi `laesFlag`'s `filer`-array har forrang) eller
   `--selvtest` (returnerer før datahentning). Ingen af validate.mjs's 31
   testkald rammer databasen — efterprøvet ved at læse alle 8 filers call
   sites, ikke antaget.
3. **R14-fælde fundet under design, aldrig kørt forkert:** et "pyntet"
   syntetisk filnavn som `"<slug>.yaml (fra database)"` til `tjekRobot()`
   ville have fået R14 (slug skal matche filnavnet) til at fejle på ALLE 77
   robotter — `path.basename()` af en streng uden skråstreg er hele strengen,
   og `.replace(/\.ya?ml$/,'')` matcher intet, der ender på ")". Rettet ved
   at bruge et rent `"<slug>.yaml"` begge steder, før koden nogensinde kørte.
4. **Delt-mutation-fælden (se konfidenstabellens punkt 7)** er den vigtigste
   arkitekturbeslutning i db/hent.mjs, og den findes ikke i briefet — jeg fandt
   den ved at spore build.mjs's to kald af `hentRobotter()` (ét direkte, ét
   indirekte via `validerMain()`) gennem samme proces.

## Punkter i briefet, jeg ikke nåede

- Ingen `time`-baseline for `tests/koer.mjs` FØR mine ændringer — kun grund-
  målingens tal (1815/6), ikke dens varighed. Kan ikke opgøre suitens præcise
  tidsforøgelse, kun sluttilstanden (4m13s, grøn).
- Kun ÉN fuld suite-kørsel målt efter alle fem punkter — ingen gentagelse for
  at udelukke netværks-flakiness over tid.
- PLAN.md/STATUS.md er ikke rørt (uden for filejerskabet — orkestratorens opgave).
- Fase 3's anden halvdel (sletning af data/robots/, tools/yaml.mjs mv.) er
  bevidst UDENFOR dette spor, per brief punkt "du sletter INGENTING".
