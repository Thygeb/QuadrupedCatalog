# FUND-hentbyg.md — ét-kommando-vejen for JPK's Studio-rettelser

Gren `spor/hentbyg`, worktree `C:/Praktik/websites/udstilling-wt-hentbyg`. Skrevet
25. aug 2026.

## Skill-vurdering

Læste `.claude/skills/`-listen i worktreen (`grillmig`, `parallelt`, `robotdata`,
`supabase`, `supabase-postgres-best-practices`) og den globale liste, som CLAUDE.md
kræver, før noget andet.

- **Valgt: ingen.** Opgaven er at pakke tre EKSISTERENDE, allerede efterprøvede
  scripts (`db/eksporter.mjs`, `git`, `tools/build.mjs`) ind i én ny orkestreringsfil
  og rette én dokumentationslinje. Ingen af de fem projekt-skills passer præcist:
  - `robotdata` bærer 30-feltsskemaet og de ti hårde regler for EN robotpost — jeg
    har ikke rørt robotdata, kun dokumenteret en kommando i skillens egen fil.
  - `parallelt` gælder deling af arbejde på flere agenter — opgaven er forbudt at
    deles videre ("Arbejd direkte — deleger ikke videre") og er i forvejen ét
    afgrænset spor.
  - `grillmig` grillér et brief FØR det sendes eller en beslutning FØR den låses —
    jeg modtog allerede et grillet, færdigt brief (D12/L35 er lukket i STATUS.md).
  - `supabase`/`supabase-postgres-best-practices` gælder arbejde MOD Supabase
    (skema, RLS, fejlfinding, MCP). `db/hentbyg.mjs` selv laver ingen `fetch`-kald
    mod Supabase overhovedet — den kalder eksisterende scripts som subprocesser.
    De to test-scripts, jeg skrev til punkt (b)/(c) i scratchpad (rå PATCH/GET mod
    PostgREST), er ren afprøvning efter et allerede dokumenteret mønster
    (`fund/FUND-vagt.md`, `db/LAESMIG.md`s PostgREST-afsnit) — ikke ny Supabase-
    arkitektur, så jeg vurderede skillen som overkill for to firelinjers
    verifikationsscripts. **Usikkerhed:** en strengere læsning ville sige, at ENHVER
    berøring af Supabase-API'et bør slå skillen op — jeg gjorde det ikke, og nævner
    det derfor eksplicit i stedet for at lade det gå ubemærket forbi.
  "Ingen skill passer her" er selv et gyldigt svar, jf. CLAUDE.md.

## Punkt 1 — `db/hentbyg.mjs`

Ny fil, 138 linjer. Kører de tre eksisterende trin som subprocesser via
`process.execPath` (node) og `execFileSync('git', …)` — genimplementerer intet:

1. `node db/eksporter.mjs --fra-db --ud=data/robots` — fejler den, stopper hentbyg
   og viser dens egen udskrift (eksportens egen vagt, se `db/LAESMIG.md`).
2. `git status --porcelain data/robots` — tomt ⇒ `Ingen aendringer i Studio siden
   sidst — intet at hente.`, exit 0, intet rørt.
3. `git diff --stat data/robots` — vist til JPK.
4. `git commit -F <midlertidig fil> -- data/robots` — besked
   `Studio-rettelser hentet hjem <ISO-dato>` + fillisten fra trin 2's
   porcelain-output. Pathspec'et (`-- data/robots`) betyder, at KUN denne sti
   committes, uanset hvad der måtte stå staged i forvejen — en lidt strammere
   garanti end blot `git add` + `git commit`.
5. `node tools/build.mjs` — EPERM fanget særskilt: udskriften matches mod
   `/EPERM/`, og fejlen siger eksplicit at trin 1-4 lykkedes.

Flag: `--uden-commit` (stopper efter trin 3), `--uden-byg` (springer trin 5 over,
commit sker stadig).

## Målt — de fire kørsler

**(a) DB matcher YAML.** Første forsøg overraskede: `data/robots/` var i sin
oprindelige, håndskrevne/agent-skrevne facon (ucitérede nøgler, nøglerækkefølge fra
`robotdata`-skillen), mens `db/eksporter.mjs` per sin egen, dokumenterede kontrakt
("FIDELITETSKONTRAKTEN … IKKE et krav om byte-identisk tekst") altid skriver
dobbeltciterede strenge i en fast nøglerækkefølge. Første kørsel af
`node db/hentbyg.mjs` fandt derfor en ægte tekstforskel på **alle 77 filer** — ikke
fordi databasen indeholdt Studio-rettelser, men fordi ingen tidligere har committet
et eksportresultat oven i det rigtige `data/robots/`. Den kørsel committede
(`51f6e48 Studio-rettelser hentet hjem 2026-08-25`, 77 filer, 6562+/6154-) og byggede
(213 sider, 1110 kildebelagte tal — identisk med DATAFLOW.md's kendte tal, altså
INGEN semantisk drift, kun formatering). Se "Vigtigt fund" nedenfor.

Med `data/robots/` nu i eksportens egen kanoniske form kørte jeg **igen**, uden
nogen ny databaseændring — det er den egentlige test (a):

```
$ git log --oneline -1
51f6e48 Studio-rettelser hentet hjem 2026-08-25
$ node db/hentbyg.mjs
77 YAML-fil(er) skrevet til C:\Praktik\websites\udstilling-wt-hentbyg\data\robots
Ingen aendringer i Studio siden sidst — intet at hente.
EXIT=0
$ git log --oneline -1
51f6e48 Studio-rettelser hentet hjem 2026-08-25   ← uændret
```

**(b) Én Studio-rettelse.** PATCH `boston-dynamics-spot.producentby` →
`"HENTBYGTEST"` direkte mod PostgREST (efterligner Studio, samme mønster som
`fund/FUND-vagt.md`s test):

```
$ node db/hentbyg.mjs --uden-commit --uden-byg
77 YAML-fil(er) skrevet til ...\data\robots
 data/robots/boston-dynamics-spot.yaml | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
(--uden-commit: stopper her. Intet committet, intet bygget.)
EXIT=0
```
`git status --porcelain data/robots` viste præcis: ` M data/robots/boston-dynamics-spot.yaml`
— ét ændret felt i én fil, ingen andre. HEAD uændret (`51f6e48`).

**(c) Oprydning.** PATCH `producentby` tilbage til `"Waltham, Massachusetts"` via
samme REST-vej, derefter `git checkout -- data/robots`:

```
$ git status --porcelain data/robots
(tom)
```
REST-opslag efter oprydning:
```
Spot producentby nu: [{"slug":"boston-dynamics-spot","producentby":"Waltham, Massachusetts"}]
Raekker med producentby=HENTBYGTEST i hele tabellen: 0 []
```
`HENTBYGTEST` findes hverken i databasen (nul rækker i hele `robotter`-tabellen,
ikke kun på Spot) eller i filerne.

**(d) Testpakke.**
```
$ node tests/koer.mjs
201 bestaaet, 2 fejlet.
Fejlede: interval 18-25 kg kollapser ikke til sit midtpunkt (...) ·
  to filer med samme kategorier i modsat raekkefoelge giver samme indeks (L27) (...)
```
Præcis de tal og de to kendte røde, briefet forudsagde — bekræfter at hverken
`db/hentbyg.mjs` eller SKILL.md-rettelsen rørte noget testet.

## Vigtigt fund — hører hjemme i `db/LAESMIG.md` (jeg må ikke selv redigere den)

**Den dokumenterede Studio→YAML-vej (DATAFLOW.md diagram 2) er endnu aldrig kørt
mod det rigtige, sporede `data/robots/`.** `db/eksporter.mjs`s egen kommentar siger
eksplicit, at eksportformatet IKKE er byte-identisk med kildens — kun dybt ligt.
Konsekvensen, som ingen tidligere test har vist (tidligere kørsler skrev enten til
en midlertidig mappe eller reverterede straks med `git checkout`): **første gang
`db/eksporter.mjs --fra-db --ud=data/robots` reelt committes, reformateres ALLE 77
robotfiler** (dobbeltciterede strenge, ny nøglerækkefølge) — en ~13.000-linjers
diff, uden at en eneste Studio-rettelse er sket. Det er semantisk harmløst (bevist:
`node tests/koer.mjs` 201/2 uændret, `validate.mjs` 0 fejl, byg 213=213 sider /
1110=1110 kildebelagte tal — alle identiske med DATAFLOW.md's kendte tal FØR denne
kørsel), men det er en overraskende, éngangs, hel-katalog-commit, som JPK bør vide
kommer, første gang `db/hentbyg.mjs` (eller den manuelle eksport) køres for alvor.
Jeg har ladet denne commit stå (`51f6e48`) frem for at fortryde den — den er reel,
korrekt output fra eksisterende, godkendt kode, ikke noget jeg har rettet i.
**Anbefaling til `db/LAESMIG.md`:** en linje om, at første reelle eksport til
`data/robots/` reformaterer hele kataloget, og at det er forventet, ikke en fejl.

## Punkt 2 — SKILL.md

`.claude/skills/robotdata/SKILL.md`, afsnittet "To veje ind i data" fik en ny
underparagraf om `node db/hentbyg.mjs` som JPK's vej, med de tre gamle kommandoer
bevaret nedenunder til fejlsøgning/delkørsel. `grep -c "hentbyg"` giver **2** (krav:
≥1). Rettede selv en unøjagtighed i første udkast ("fire trin" hvor der reelt er
tre, jf. BAGGRUND's egen ordlyd) i en opfølgende commit, fundet ved at læse egen
tekst igennem én gang til før aflevering.

## Selv-tjek med tælling

- Læste `db/hentbyg.mjs` igennem linje for linje efter skrivning: 1 fejl fundet og
  rettet før første kørsel (en tidlig kladde brugte `git add` + `git commit` uden
  pathspec; skiftet til `git commit -F … -- data/robots` for at gøre commit'et
  robust mod fremmed staged indhold).
- 4 kørsler af `db/hentbyg.mjs` i alt (to for test (a), én for (b), ingen ekstra for
  (c)/(d) — de bruger git/REST direkte). Alle fire gav den udskrift, jeg forventede,
  efter at (a)'s første, overraskende resultat var forstået.
- Verificerede forbudt-fil-listen ved `git diff --stat` fra branch-punktet: kun
  `db/hentbyg.mjs`, `.claude/skills/robotdata/SKILL.md` og (som konsekvens af
  eksport-reformateringen, ikke direkte redigeret af mig) de 77 filer i
  `data/robots/` er ændret. Ingen af de eksplicit forbudte filer
  (`db/eksporter.mjs`, `db/migrer.mjs`, `db/rundtur.mjs`, `db/billeder.mjs`,
  `tools/build.mjs`, `tools/validate.mjs`, `tests/koer.mjs`, `CLAUDE.md`,
  `STATUS.md`, `db/LAESMIG.md`, `DATAFLOW.md`, `media/`, `assets/`, noget i
  `tools/` udover kald) er rørt.
- Søgte efter efterladt `HENTBYGTEST`: 0 træf i databasen (hele `robotter`-tabellen,
  ikke kun Spot) og 0 træf i filerne (`git status --porcelain data/robots` tom
  efter oprydning).
- Søgte efter efterladte midlertidige filer: `.hentbyg-commit-msg-*` findes ikke
  (scriptets `finally`-blok rydder dem op i alle udfald — bekræftet ved at kigge
  efter dem efter hver kørsel).

## Selv-review — hvad jeg er usikker på

- **(a)'s første kørsel krævede et "opvarmningsforsøg"**, jeg ikke havde forudset:
  briefets acceptkriterium ("git log uændret") holdt ikke ved allerførste kørsel,
  fordi `data/robots/` aldrig før havde været igennem en rigtig eksport. Jeg
  betragter min løsning (køre igen efter reformateringen har sat sig, og
  dokumentere hvorfor) som rigtig, men det er en fortolkning af et
  acceptkriterium, der ikke eksplicit nævnte denne mulighed — orkestratoren bør
  vurdere, om den 77-filers reformateringscommit skal stå, squashes, eller
  reverteres før flet.
- Jeg har KUN afprøvet vagten/hentbyg mod én driftform (`producentby`, en tekststreng
  på topniveau) — samme afgrænsning som `fund/FUND-vagt.md` selv nævner for
  `db/migrer.mjs`s vagt. En ændring i et `felter`-underfelt eller en tilføjet/fjernet
  robot er ikke afprøvet gennem `db/hentbyg.mjs` specifikt (om end den underliggende
  `db/eksporter.mjs`/`git diff --stat`-kæde ikke kender forskel på feltdybde).
- Jeg har ikke selv kørt en kode-review af diffen (bevidst — CLAUDE.md's
  model-tiering-regel: reviews er aldrig Sonnets, det er orkestratorens opgave).
- `--uden-byg` er nu også afprøvet isoleret (efter første udkast af denne rapport):
  PATCH `producentby` → `"HENTBYGTEST2"`, `node db/hentbyg.mjs --uden-byg` →
  commit skete (nyt HEAD, ét ændret felt), INGEN `"Byggede N sider"`-linje i
  udskriften, exit 0. Ryddet op igen: `git reset --hard` til commit'et før testen
  (bevist kun at røre den ene fil via `git diff --stat` først), PATCH tilbage til
  `"Waltham, Massachusetts"`, og et REST-opslag der viser **0** rækker med
  `producentby=HENTBYGTEST2` i hele tabellen.
- EPERM-fælden (`dist/` låst) er IKKE afprøvet i praksis — der kørte ingen server
  mod denne worktree under mine tests, så byggetrinnet lykkedes hver gang. Koden
  for EPERM-håndteringen er skrevet efter samme mønster som `tools/build.mjs`s
  egen fejlformidling, men er ikke selv trigget og bevist.

## Ikke rørt, som instrueret

STATUS.md's L35/D12-rækker er IKKE opdateret af mig — briefet bad kun om
`robotdata`-skillen; STATUS.md's dokumentregel siger, at nye fund føres ind der af
orkestratoren, ikke af agentrapporter direkte.
