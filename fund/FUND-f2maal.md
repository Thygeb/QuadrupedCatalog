# FUND — spor/f2-maal: instrumentet, der dømmer alle fase 2-spor

Brief: [fund/BRIEF-f2-maal.md](BRIEF-f2-maal.md). Regel 0: valgte `supabase`
(virkede fra worktreen). Fravalgte `supabase-postgres-best-practices` (ingen
skema/RLS-ændring), `robotdata` (YAML-skema, ikke måleinstrument), `fejljagt`
(ingen forhånds-kald, men dens metode brugt reelt i crash-jagten, punkt 4).
Grundmåling FØR ændringer: validate **77/0/1**, `git log -1` → `f8eac85`
(begge matcher briefet).

## 1. Valgt / fravalgt

- Fase2-tjek.mjs: ÉN `hentRobotter()` (samme select+hints som
  `db/eksporter.mjs`), genbrugt af --tal/--dansk/--belaeg — fravalgte tre
  separate fetch-kald.
- Dansk-detektor: to-benet æøå+ordliste — fravalgte æøå-alene (briefet
  beviser selv den er utilstrækkelig: 116 flere fanges af ordlisten).
- `collected_by`: læser `.git/HEAD` direkte — fravalgte `execFileSync('git')`,
  som viste sig at crashe processen sammen med `fetch()`+`process.exit()`
  (Nye fælder, punkt 1).

## 2. Konfidens

- **--tal: Høj.** Samme SAMLET AFTRYK `d2bd1331...` i 3 målinger spredt over
  sessionen, inkl. efter ~24 samtidige DB-skrivninger fra spor/f2-pilot.
  Kontrafaktisk: ét `value_number` ændret i hukommelsen → `07f15bed...`
  (forskelligt). Ufølsomt instrument ville give samme tal begge gange.
- **--dansk: Høj for måletidspunktet.** Alle 6 krav-totaler
  (891/309/76/21/147/35) og 5 æøå-kontroltal (677/254/70/19/0) matchede
  briefets SQL-måling præcist. DB er levende — genkørt nu giver
  caveat_wording 325, ikke 309 (fase 2 fylder netop den kolonne op). De
  øvrige 5 totaler er uændrede. Se Usikkerheder.
- **--belaeg: Middel.** Ingen forudsigelse i briefet, intet facit at matche.
  19 "uden træf" stikprøvet, ikke alle læst ord for ord.
- **f2-skriv.mjs: Høj.** Tørløb, 2 afvisninger og 1 identitetsskrivning
  efterprøvet mod den levende DB, inkl. `change_log` +1 (23→24). Fejlet
  skrivning ville vise NULL `collected_by` og ingen ny change_log-række.
- **tests: Høj.** 1620/0 mod grundmåling 1591/0. Forkert assertion ville
  give < 1620 eller røde.

## 3. Usikkerheder

- DB er levende (spor/f2-pilot, spor/f2-cjk arbejder samtidig) — punkt 2/3's
  absolutte tal flytter sig; mekanismen er efterprøvet, ikke tallene for al
  fremtid.
- Dansk-ordlisten (65 ord) er egen konstruktion, kan have blinde vinkler.
- Testnummer 69 kunne kollidere ved flet (efterprøvet mod begge søster-grene: ingen har det endnu).

## 4. Målingerne

- validate: **77/0/1**
- --tal: 2 kørsler samme aftryk (`d2bd1331...`) · kontrafaktisk
  `d2bd1331...`→`07f15bed...` (value_number 20→1019, i hukommelsen)
- --dansk (2. sep ~18:00): caveat 891/843(677) · caveat_wording 309/294(254)
  · applications.note 76/76(70) · images.note 21/21(19) · robots.notes 147
  elementer(121) · images.alt 35/0(0) — alle 6 krav + 5 kontroltal matcher
- --belaeg: 192 undersøgt · 173 med træf · 19 uden træf
- f2-skriv.mjs: tørløb 2/2 vist, 0 skrevet · 2/2 afvisninger korrekte ·
  1 identitetsskrivning, change_log 23→24 (+1)
- tests: **1620/0** (grundmåling 1591/0, 29 nye)

---

## Nye fælder og opdagelser

1. **ALVORLIG, generel Node-fælde på denne maskine.** Et rigtigt `fetch()`
   efterfulgt af et EKSPLICIT `process.exit()` crasher `node.exe` v24.13.0
   (libuv-assertion `!(handle->flags & UV_HANDLE_CLOSING)`, exit-kode
   **127**) — reproduceret ISOLERET og UAFHÆNGIGT af `execFileSync`
   (min første hypotese var forkert: jeg troede først det var
   `execFileSync`+`fetch` sammen, men et rent `fetch()`+`process.exit()`
   crasher lige så sikkert). Skrivningen LYKKEDES fuldt ud FØR crashet
   (efterprøvet mod databasen begge gange), men exit-kode 127 ville få
   enhver kalder — herunder de 23 kommende fase 2-spor — til at tro
   skrivningen fejlede. **Rettet ved at bruge `process.exitCode = k`
   i stedet for `process.exit(k)`** i BEGGE mine filer (også
   `fase2-tjek.mjs`, som undgik faelden ved et TILFÆLDE af CPU-arbejde
   mellem fetch og exit, ikke immunitet — rettet defensivt der også).
   Efterprøvet: ingen crash, korrekt exit-kode, i alle scenarier.
2. **`change_log` havde 21 rækker FØR jeg rørte databasen** — ikke 0, som
   briefet antog (målt umiddelbart før briefet blev skrevet, men databasen
   er levende). **spor/f2-pilot kører fase 2 LIVE, samtidig med dette
   spor**, på Addverb (robot_id 2182/2183). Min identitetsskrivning blev
   derfor bevidst rettet mod en ANDEN robot (2184, anybotics-anymal), og
   `--tal`s stabilitet på tværs af BÅDE min egen og deres skrivninger blev
   selv en del af beviset for punkt 1 (se Konfidens).
3. **`db/f2-skriv.mjs`s hvidliste gør `field_entry_variants` UMULIG at
   skrive til** i praksis — dens eneste ikke-nøgle-kolonne ("value") står
   ikke på `TEKSTKOLONNE_HVIDLISTE`. Det er en GOD ting: `db/skema.sql`s
   `log_change()`-trigger læser `NEW.collected_by`/`NEW.change_reason`
   UBETINGET for enhver tabel, men `field_entry_variants` HAR ikke de
   kolonner — en direkte UPDATE på den tabel ville formentlig fejle i
   triggeren (RESONNERET FRA SKEMAET, IKKE EFTERPRØVET LIVE, for ikke at
   risikere at ødelægge noget for at bevise en fejl). Værd at vide, hvis
   nogen nogensinde overvejer at redigere `field_entry_variants` manuelt
   i Studio.
4. Punkt 3's talformer manglede oprindeligt tusind-adskiller — fundet ved
   FØRSTE kørsel mod den levende DB (`yufan-lingmao-cyvet.price`: 15999 vs.
   citeret "¥15,999"), rettet og genmålt (19 uden træf i stedet for 20).

## Punkter i briefet, jeg ikke nåede

(ingen — alle fem punkter, alle "færdig når"-kriterier og begge fixturkrav
er gennemført og efterprøvet)
