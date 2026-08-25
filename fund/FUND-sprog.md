# FUND-sprog.md — målgruppesprog rettet efter L31

Gren `spor/sprog`, worktree `C:/Praktik/websites/udstilling-wt-sprog`. Opgave: tre navngivne
steder + repo-grep for lignende sprog, der stadig lod den tekniske indkøber stå som primær
læser efter L31 (24. aug 2026) vendte `Users` i PRODUCT.md — nysgerrig fagperson (presse,
studerende, folk i branchen) primær, teknisk indkøber sekundær, ikke slettet.

**Læst før arbejdet, som instrueret:**
- `STATUS.md` L31 (linje 137), hele posten, læst fra disk. Ankertekst: *"Den nysgerrige
  fagperson (presse, studerende, folk i branchen) er nu primær, teknisk indkøber sekundær."*
  Og: *"Sekundær succes (indkøberens ti-minutters-kriterium) er bevaret i `Product Purpose`,
  ikke slettet."*
- `PRODUCT.md`, hele filen — facit for tonen. `Users`, `Product Purpose` og `Positioning`
  punkt 2 er allerede omskrevet af L31 og brugt direkte som skabelon for ordlyden nedenfor.

**Skillevurdering:** `robotdata` overvejet og gået forbi — ingen robotdata røres (bekræftet:
de eneste dataflade-hits i grep nedenfor er `data/robots/*.yaml`, som er eksplicit uden for
opgaven og ikke rørt). `parallelt` gået forbi — opgaven er ét sammenhængende, sekventielt
spor (grep skal informere rettelserne, rettelserne skal ligge klar før build/test), ingen
uafhængige spor at dele. `grillmig` gået forbi — dette er et allerede afgrænset, tildelt
opgavebrev, ikke en åben beslutning eller et usendt brief. Ingen anden skill i listen
(design/kritik/dataviz) passer på en ren tekstrettelse. Konklusion: ingen skill kørt, alle
fire vurderet og begrundet.

---

## De tre navngivne steder

### 1. DATAMODEL.md — INGEN rettelse (vurderet, bevidst ladt stå)

Opgavebrevet pegede på "omtrent linje 55". Linjenummeret holdt ikke — heller ikke i den
allerførste commit (`0dc2c14`), hvor de eneste to "indkøber"-forekomster i filen lå på linje
113 og 122 (nu 130 og 139 efter L30/L32's indskudte citatblokke). Fuld gennemsøgning af hele
filen (696 linjer på tværs af DATAMODEL/PLAN/om, heraf 345 i DATAMODEL.md) for
`indkøber|køber|primær|sekundær|nysgerrig|fagperson|professionel|beslutningstager|shortlist|
kort liste|budget|anskaffe|byg.*til` gav kun de to kendte linjer — intet der ligner
"feltdybden er bygget til [indkøberen]".

**Før-citat (linje 130):** *"Pris, leveringstid og EU-service forbliver 'ikke oplyst',
indtil vi har det skriftligt — de er præcis de felter, hvor et gæt gør mest skade, og hvor
'ikke oplyst' i sig selv er en oplysning en indkøber kan bruge."*

**Hvorfor ikke rettet:** dette er IKKE en L31-krænkelse. PRODUCT.md's egen, allerede
L31-opdaterede `Positioning` punkt 2 siger eksplicit: *"Spørgsmålet tjener desuden primært
den sekundære læser (teknisk indkøber, integrator) — den primære læser har sjældnere brug
for at vide, om en dansk fabrik må sætte maskinen i drift."* Pris, leveringstid og
EU-service er netop de felter, PRODUCT.md selv har udpeget som sekundær-læser-felter. At
DATAMODEL.md's forsøgsrapport siger det samme om de samme felter, er konsistent med facit —
ikke en modstrid.

**Før-citat (linje 139):** *"For en dansk køber er det forskellen mellem at købe en maskine
og at blive importør af en."* — Denne sætning rører "importør"-påstanden, som L25 droppede
fra PLAN.md og PRODUCT.md. Det er en **teknisk/juridisk substans-sag (L25), ikke
målgruppesprog (L31)**, og opgaven forbyder eksplicit "omskrivning af tekniske afsnit". Ladt
urørt — hører til et andet spor, hvis nogen tager det op.

Talt: **0 steder rettet i DATAMODEL.md, 2 vurderet og bevidst ladt stå**, begge med grund
ovenfor.

### 2. PLAN.md — linje 116 (linjenummer holdt) + linje 119 (fundet ved samme gennemlæsning)

**Før-citat:**
> `/ordbog/` gør siden brugbar for indkøb, ikke kun for ingeniører — og en indkøber, der kan
> forstå specifikationerne, er den der booker mødet.
>
> **Forsiden må ikke være et marketinglag foran kataloget.** Læseren ankommer fra en søgning
> på en konkret model eller et konkret krav. Filtrene skal være synlige i første viewport.

**Efter-citat:**
> `/ordbog/` gør siden forståelig, uden at kræve fagsprog i forvejen — ikke kun for
> ingeniører. For den tekniske indkøber gælder det samme: en, der kan forstå
> specifikationerne, er den der booker mødet.
>
> **Forsiden må ikke være et marketinglag foran kataloget.** Den nysgerrige læser ankommer
> ofte uden et modelnavn i hovedet; den tekniske indkøber ankommer stadig ofte fra en
> søgning på en konkret model eller et konkret krav. Filtrene skal være synlige i første
> viewport.

**L31-forankring:** ordbogssætningen antog tidligere, at indkøb var formålet og indkøberen
den eneste, der "booker mødet". Rettelsen bredder formålet ud (forståelighed uden fagsprog,
gælder enhver læser), men **sletter ikke** indkøberens sætning — den står stadig, nu tydeligt
markeret som hendes ("For den tekniske indkøber gælder det samme"), jf. L31: "Sekundær succes
... er bevaret, ikke slettet." Forsidesætningen "Læseren ankommer fra en søgning på en
konkret model" modsagde direkte PRODUCT.md linje 30-33 (den nysgerrige fagperson ankommer
**uden** modelnavn; kun den tekniske indkøber ankommer med et konkret krav) — rettet til
samme to-lags mønster som PRODUCT.md, ordret genbrugt ("uden et modelnavn i hovedet").

### 3. indhold/om.md — bygges ind i sitet, tre steder rettet (ikke kun linje ~124)

Opgavebrevets linjetal (124) fandtes ikke — hele filen er kun 105 linjer og var aldrig
længere (git-historik viser kun én commit, `7e5a32a`, der skrev filen). Hele filen blev
derfor læst og gennemgået, ikke kun ét sted, fordi opgaven selv fremhævede, at denne fil
"skal ramme L31's tone præcist".

**Sted A — "Der findes ingen forhandleraftale" (linje 27-30):**
Før: *"En side, der både sammenligner og sælger, kan ikke bruges som kilde af den, der skal
begrunde et valg internt."*
Efter: *"En side, der både sammenligner og sælger, kan ikke bruges som kilde — hverken af en
journalist, der skal kunne belægge et tal, eller af den, der skal begrunde et valg internt."*
**Forankring:** mønsteret er hentet ordret fra PRODUCT.md's egen L31-rettede `Positioning`
punkt 1: *"Gælder for enhver læser: en journalist, der citerer ét tal, skal kunne belægge det
lige så let som en indkøber, der sammenligner ti."*

**Sted B — "Hvorfor siden findes" (linje 34-56), hele afsnittet:**
Før: åbnede med *"En teknisk indkøber, der overvejer en firbenet robot, står med det samme
problem..."* og sluttede *"Målet er, at man kan komme fra 'vi overvejer en firbenet robot'
til en kort liste på to-tre modeller..."* — indkøberen var den ENESTE navngivne læser i hele
afsnittet, og "Målet" var udelukkende hendes.
Efter: problemet omformuleret til at gælde feltet generelt, med journalist/studerende
navngivet sideordnet med indkøberen; punkt 2 og 3 i tre-punktslisten bredt ud fra
"en indkøber kan bruge" / "en indstilling til en ledelse" til at omfatte "læseren" og "et
citat i en artikel"; og "Målet"-afsnittet splittet i to, ligesom PRODUCT.md's `Product
Purpose` (Succes-afsnit + "For den sekundære læser gælder det tidligere kriterium fortsat").
Indkøberens oprindelige mål-sætning er bevaret **ordret**, kun flyttet til anden position og
mærket "for den tekniske indkøber".
**Forankring:** frasen "retvisende billede af feltet ... på få minutter ... citere eller dele
siden videre uden selv at skulle efterprøve tallene" er hentet direkte fra PRODUCT.md's
`Product Purpose`-afsnit, ikke opfundet.

**Sted C — "Hvem siden er til" (linje 60-76), hele afsnittet:**
Før: rækkefølgen var Driftschefer/indkøbere/CTO'er → Forskere/integratorer →
Journalister/analytikere (sidst, mindst omtalt), efterfulgt af *"De fleste kommer ind fra en
søgning på en bestemt model eller et bestemt krav"* — en direkte, unavngivet påstand om at
indkøber-adfærd er den dominerende.
Efter: ny første gruppe, ordret hentet fra PRODUCT.md's `Users`-afsnit ("presse, studerende
og folk i branchen ... ofte uden et bestemt modelnavn i hovedet"), placeret FØR
driftschef/indkøber-gruppen, som ellers står uændret (samme ord, samme indhold, kun rykket
til anden plads). Slutsætningen erstattet af PRODUCT.md's to-lags ankomstmønster
(nysgerrig læser uden modelnavn / teknisk indkøber med konkret model), ligesom i PLAN.md.

**Usikkerhed i Sted C:** den nye første gruppe er ikke en ren omplacering af den gamle
"Journalister og analytikere" — jeg har udvidet den til at matche PRODUCT.md's fulde
"presse, studerende og folk i branchen", fordi PRODUCT.md er facit og om.md's gamle
"journalister og analytikere" var en smallere delmængde. Det er den ene beslutning i denne
opgave, hvor L31's ordlyd ikke gav et fuldstændig entydigt svar (er det en ren
omrokering, eller skal gruppen matche PRODUCT.md's definition ord for ord?) — jeg valgte det
sidste, fordi opgaven selv peger på PRODUCT.md som facit for tonen, og fordi en smallere
gruppe ville efterlade om-siden og PRODUCT.md med to forskellige definitioner af den samme
primære læser.

---

## Repo-grep for yderligere steder

Kørt: `git grep -n -i -E "indkøber|indkøb(s|et)?\b|teknisk (indkøb|beslutningstager)|
driftschef|CTO/COO" -- . ':!fund/' ':!KRITIK-*' ':!prototype/' ':!STATUS.md'`
samt en bredere kørsel for `målgrupp|primær(e)? (læser|bruger)|sekundær(e)? (læser|bruger)|
nysgerrig|fagperson`.

**Fundet ud over de tre kendte steder, vurderet enkeltvis:**

- **DESIGN.md linje 703-704** — dateret changelog-note ("Opdateret 24. aug 2026
  (forsideombygningen)"): *"læseren er den nysgerrige fagperson uden et modelnavn i hovedet,
  ikke (kun) den tekniske indkøber, PRODUCT.md's 'Users' endnu beskriver (uafklaret
  modstrid, videreført til et andet spor)."* **Ikke rettet.** Denne sætning er allerede på
  linje med L31 — den ER forløberen for L31-beslutningen, skrevet samme dag, og dokumenterer
  at forsiden allerede dengang blev bygget til den nysgerrige fagperson, mens PRODUCT.md
  endnu ikke fulgte med. At omskrive en dateret logpost med bagklogskab ville stå i strid med
  samme praksis, som beskytter STATUS.md's egne poster.

- **PLAN.md "2. Hvad der gør den bedre end forbilledet" (linje 37-41)** — indeholder stadig
  den droppede "importør"-påstand ordret. **Ikke rettet.** Substans-sag under L25, ikke
  målgruppesprog under L31; opgaven forbyder omskrivning af tekniske afsnit.

- **indhold/ordbog.md, 12 forekomster af "Ved et indkøb: ..."** — praktiske
  feltforklaringer ("Ved et indkøb: tallet er ikke et mål for, hvor godt robotten går" osv.).
  **Ikke rettet.** Disse påstår ikke, at indkøberen er sidens primære læser — de forklarer,
  hvad et felt betyder, HVIS man er i en indkøbssituation. Det er præcis den slags sprog,
  opgaven beder om at bevare ("indkøberen slettes ikke — hun er sekundær læser").

- **data/robots/weilan-alphadog-e300.yaml og -e400l.yaml**, note-felt der nævner
  "driftschef". **Ikke rettet** — robotdata, eksplicit uden for opgaven.

- **tools/skabelon/forside.mjs linje 5** — kommentar, allerede korrekt ("er den nysgerrige
  fagperson — presse, studerende, branchefolk"). Bekræftelse af, at koden allerede er i sync
  med L31; ingen handling.

**Konklusion på grep:** ingen yderligere steder krævede rettelse ud over de to fundet i
PLAN.md (begge inden for den navngivne linje-116-region) og de tre i om.md.

---

## Tælling

- **Steder fundet i alt (repo-grep + de tre navngivne):** 3 filer med reelt
  L31-modstridende sprog (PLAN.md, indhold/om.md — 3 delsteder — samt DATAMODEL.md vurderet
  og fundet IKKE at være en krænkelse).
- **Rettet:** 2 filer, 5 delsteder — PLAN.md (2: ordbogssætning + forsidesætning), om.md (3:
  forhandleraftale, "hvorfor siden findes", "hvem siden er til").
- **Bevidst ladt stå:** DATAMODEL.md (2 sætninger, begrundelse ovenfor), DESIGN.md (1
  dateret logpost, allerede korrekt), PLAN.md's importør-passage (L25-sag, ikke L31),
  ordbog.md (12 forekomster, ikke audience-primacy-sprog), 2 robotdata-filer (uden for
  opgaven).

---

## Efterprøvning

Kørt fra worktree-roden med `/c/Program Files/nodejs/node.exe`:

- `tools/validate.mjs` → **62 fil(er) · 0 fejl · 1 advarsel** (samme advarsel som baseline:
  Ghost Robotics Vision 60's R9-hastighedsafvigelse, urelateret).
- `tools/build.mjs` → **173 sider · 850 kildemærkede tal, 0 uden · tæthedsnævner 30** —
  identisk med den opgivne baseline. Ingen tal flyttede sig.
- `tests/koer.mjs` → **195 bestået, 2 fejlet** — samme to kendte, urelaterede fejl som før
  (18-25 kg-intervalkollaps, kategori-rækkefølge-indeks L27), ingen nye fejl.
- **Bygget om-side i dist:** **kunne IKKE efterprøves som instrueret.** `tools/build.mjs`
  konsumerer p.t. ikke `indhold/om.md` — der findes ingen `/om/`-, `/metode/`- eller
  `/ordbog/`-rute i `dist/da` eller `dist/en` overhovedet (kun forside, `producenter/` og
  `robotter/`). Indholdssiderne er skrevet (`indhold/*.md`, commit `7e5a32a`), men
  sidegeneratoren for dem er endnu ikke bygget. Dette er ikke noget, jeg har ændret eller
  kan rette inden for opgavens mandat — det er en forudsætning, opgavebrevet antog var på
  plads, og som ikke er det endnu. Rettelsen i `indhold/om.md` er verificeret ved direkte
  gennemlæsning af kildefilen (se Sted A-C ovenfor), ikke ved at læse bygget HTML.

---

## Selv-review

**Det jeg er mest sikker på:** PLAN.md-rettelserne og om.md's "forhandleraftale"-sætning —
begge er minimale, ordret forankrede i allerede-godkendt PRODUCT.md-sprog, og ændrer intet
teknisk indhold.

**Det jeg er mindst sikker på:**
1. **om.md Sted C's udvidelse af "Journalister og analytikere" til PRODUCT.md's fulde
   "presse, studerende og folk i branchen".** Se usikkerhedsnoten under Sted C — dette er
   den ene plads, hvor jeg gik ud over en ren omrokering og tilføjede "studerende" og "folk
   i branchen" som nye ord i om.md (de fandtes ikke der før). Jeg vurderer det som
   nødvendigt for at ramme L31's tone præcist (jf. opgavebrevets egen instruks), men det er
   tættere på grænsen til "ny målgruppebeskrivelse" end resten af rettelserne, og bør læses
   igennem af CEO'en, hvis ordlyden skal stå ord for ord.
2. **DATAMODEL.md-konklusionen (ingen rettelse).** Jeg er sikker på analysen — men opgaven
   navngav eksplicit dette sted som ét af de tre kendte, og jeg leverer et "nej" i stedet for
   en rettelse. Hvis der findes en sætning et sted, min grep ikke fangede (fx en formulering
   uden ordene "indkøber", "primær" eller "sekundær"), er den ikke fundet.
3. **Bygget om-side kunne ikke læses.** Se efterprøvningsafsnittet — dette er en reel
   mangel i det, jeg kan garantere, ikke en formalitet. Ordlyden er korrekt i kildefilen;
   den er ikke bekræftet i HTML, fordi der ikke er HTML at bekræfte den i endnu.
