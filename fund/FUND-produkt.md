# FUND-produkt.md — PRODUCT.md vendt til den nysgerrige fagperson

Gren: `spor/produkt`, worktree `udstilling-wt-produkt`. Filer ejet og rørt: `PRODUCT.md`,
`STATUS.md`. Intet andet er rørt.

---

## Skill-vurdering

- **`grillmig` — indlæst og brugt, men ikke på selve JPK's beslutning.** Opgaven sagde
  eksplicit, at målgruppeskiftet ikke skal genåbnes. Jeg brugte i stedet Job 2's fire
  spørgsmål (B1-B4) på den ene åbne dom, jeg selv skulle fælde undervejs: **skal
  EU-kolonnen fortsat stå som positioneringspunkt 2?**
  - B1 (alternativer + pris): behold uændret (koster: en falsk positionering) / omformulér
    til hensigt og nedton (koster: en mindre skarp liste) / fjern helt fra Positioning
    (koster: en tabt sekundær-relevant differentiator, uden for min filejerskab at afgøre
    permanent).
  - B2 (måling): kørt selv — se nedenfor, 2 af 184 feltværdier udfyldt. Det afgør, at
    punktet **ikke** kan stå som opnået. Om det stadig fortjener plads som *hensigt*, er
    en smagsbeslutning, jeg ikke kan måle mig frem til — skrevet som sådan i teksten.
  - B3 (tidligere beslutning imod): **L25** havde allerede droppet importør-påstanden af
    samme punkt, men PRODUCT.md var ikke opdateret. Det trak i retning af at nedtone
    punktet yderligere, ikke bevare det uændret.
  - B4 (dyreste fejl): reversibelt for en enkelt commit — ingen grund til at vente på mere
    måling.
  Dom: omformulér til hensigt, behold i listen, men flag eksplicit i denne rapport at
  rækkefølgen/vægtningen er min afvejning, ikke en låst beslutning — CEO'en bør se den.
- **`impeccable`** — brugt til at slå `reference/init.md` op for PRODUCT.md's skema
  (sektionsliste og `impeccable:product-schema`-kommentaren), og til at køre
  `scripts/context.mjs` som slutkontrol. Ikke brugt til at bygge eller kritisere en flade.
- **`robotdata`** — gået forbi. Den bærer 33-feltsskemaet og datareglerne; jeg rører
  hverken `data/` eller robotfelter, kun produktdokumentation.
- **`parallelt`** — gået forbi. Jeg arbejder allerede i den worktree, en anden proces har
  sat mig i; jeg starter ingen nye agenter fra denne opgave.
- Fik ikke "Unknown skill" på nogen af de to indlæste skills — begge kørte normalt.

---

## (a) Afsnit i PRODUCT.md — rørt vs. urørt

PRODUCT.md har 11 overskrifter. **4 rørt, 7 urørt.**

Rørt, med begrundelse:
1. **Users** — selve målgruppeskiftet. Primær/sekundær byttet, ankomstmønster splittet i to.
2. **Product Purpose** — kun succes-sætningen. Resten af afsnittet (producenttal,
   "færdigt vs. humanoid.guide") handler ikke om målgruppen og er urørt.
3. **Positioning** — alle tre punkter gennemgået, punkt 2 omformuleret, punkt 3 fik en
   tilføjet sætning om at den også gælder den nye primære læser.
4. **Operating Context** — omskrevet til at føre an med den nysgerrige læsers situation;
   indkøberens kontekst bevaret som sekundær, "ikke oplyst"-reglen ikke svækket.

Urørt, med begrundelse:
- **Platform, Stack** — teknisk, uafhængigt af hvem der læser siden.
- **Capabilities and Constraints** — de hårde spærringer (forhandleraftale, opfind aldrig
  tal, billedregel) er produktsandhed, der ikke handler om målgruppen. Efterprøvet: ingen
  af punkterne nævner indkøberen specifikt.
- **Brand Commitments** — navn, tone, KeyResearch-linjen. Uafhængig af læser.
- **Evidence on Hand** — hvad vi har og ikke har af data/billeder. Uafhængig af læser.
- **Product Principles** — de fem principper (kilde, tre tilstande, færdigt, åbenhed,
  citerbarhed) er alle sande for begge læsere; ingen nævner indkøberen som forudsætning.
- **Accessibility & Inclusion** — WCAG-niveau, tastaturbetjening. Uafhængig af læser.

Alle 11 sektioner er læst og efterprøvet mod ordet "indkøber"/"driftschef"/"CTO/COO" for
at bekræfte, at ingen af de urørte reelt indeholdt en skjult indkøber-antagelse. Fandt
ingen ud over de fire allerede rørte afsnit.

---

## (b) De tre positioneringspunkter — efterprøvet

**Punkt 1 — "Hvert tal har en kilde og en hentedato."**
Målt selv: `node tools/build.mjs` →
`Kildemaerker: 566 tal med kilde, 0 uden.` **Dom: holder**, uændret af målgruppeskiftet —
gælder lige godt for en journalist, der citerer ét tal, som for en indkøber, der
sammenligner ti.

**Punkt 2 — EU-kolonnen.**
Målt selv med projektets egen parser (`tools/yaml.mjs`s `parseYaml` + `tools/skema.mjs`s
`tilstandAf`, script kørt over alle 46 filer i `data/robots/`, skelnede mellem en
tilstand som `ikke_oplyst`/`nej` og en rigtig udfyldt værdi):

```
ce_oplyst:        udfyldt=2  tilstand=9  mangler_helt=35
eu_tilgaengelig:   udfyldt=0  tilstand=0  mangler_helt=46
eu_service:        udfyldt=0  tilstand=0  mangler_helt=46
leveringstid:      udfyldt=0  tilstand=0  mangler_helt=46
Sum: 2 af 184 mulige EU-feltvaerdier (46 robotter x 4 felter)
```

Bekræfter JPK's tal præcist. **Dom: omformuleret.** Påstanden "det er præcis det
spørgsmål, der afgør om en dansk fabrik overhovedet må sætte maskinen i drift" holdt som
retorik, men ikke som beskrivelse af, hvad siden *gør* i dag — 2 af 184 er ikke et svar,
det er en tom kolonne med to undtagelser. Omformuleret i PRODUCT.md til at hedde en
**hensigt, vi arbejder mod, ikke en position, siden indtager i dag**, med tallet skrevet
ind. Samtidig fundet og rettet: PRODUCT.md bar stadig påstanden om at køberen selv bliver
importør ved direkte køb fra Asien — en påstand **L25** allerede havde droppet
(*"Konsekvens: en af de tre kanter i PRODUCT.md's positionering falder væk"*), men som
aldrig blev synkroniseret ind i selve filen. Det er nu rettet.

**Relevans for den nye primære læser:** vurderet til at være lavere. En nysgerrig
fagperson har sjældnere brug for at vide, om en dansk fabrik må sætte en robot i drift —
det er et driftsspørgsmål for den sekundære læser (indkøber/integrator). Skrevet ind i
PRODUCT.md som sådan. **Jeg har ikke fjernet punktet fra Positioning-listen** — kun
nedtonet og gjort ærligt — fordi at fjerne det helt er en produktbeslutning (skal
EU-feltet overhovedet udfyldes videre?), ikke en dokumentationsrettelse, og den hører
ikke under mit filejerskab. Se "Usikkerhed" nedenfor.

**Punkt 3 — Specifikationstæthed.**
Efterprøvet at PRODUCT.md ikke bar et forældet tal: **ingen tal stod skrevet** (hverken
29, 31 eller 33) — positioneringsteksten sagde kun "hvor mange af vores felter". Jeg har
alligevel tilføjet det aktuelle tal (33, jf. `tools/skema.mjs`s `FELTNAVNE.length` og
`L30`) for at gøre punktet konkret og for at forankre det til den beslutning, der låste
nævneren. **Dom: holder**, ingen rettelse af et forkert tal var nødvendig — kun en
præcisering. Tilføjet en sætning om, at punktet er lige så læsbart for den nysgerrige
læser (åbenhedsmål) som for indkøberen (beslutningsværktøj).

---

## (c) STATUS.md — ny post og rettede modsigelser

- **Ny post: L31**, indsat i `Lukket`-tabellen lige efter `~~L19~~` og før `L20` (højeste
  eksisterende var L30; talt efter i hele filen og bekræftet med
  `grep -n "L3[1-9]"` → 0 træf før denne commit). Indeholder: hvad der blev besluttet,
  hvornår, hvad der talte imod (Users' gamle succeskriterium og hele
  positioneringsindretningen), og hvad der ændrede sig (mappenavnet `udstilling`,
  DESIGN.md's "Udstillingssalen", L14's allerede-vendte produktretning).
- **Modsigelser i STATUS.md efterprøvet: 0 fundet, ud over den ene der blev rettet i
  PRODUCT.md (ikke STATUS.md selv).** Søgt på `indkøber|driftschef|CTO/COO|teknisk
  indkøber` i STATUS.md — ingen træf. Søgt på succeskriterie-sprog ("ti minutter", "kort
  liste", "indkøbsudvalg") — ingen træf. STATUS.md's egen prosa (fx L14, L15, L17) var
  allerede målgruppe-neutral eller pegede allerede i den nye retning.
- Datoen øverst i filen ("Opdateret …") rettet fra 21. til 24. august 2026.

---

## (d) `node tools/validate.mjs`

Kørt før og efter mine ændringer (jeg rører ikke `data/` eller `tools/`):
**46 fil(er) · 0 fejl · 1 advarsel** — samme advarsel begge gange
(Ghost Robotics Vision 60, hastighedsfeltets metrisk/imperial-afvigelse, en kendt og
accepteret advarsel, ikke noget jeg forårsagede). Intet brækket.

## (e) impeccable-skemaet

`node C:/Users/thyge/.claude/skills/impeccable/scripts/context.mjs` kørt efter
redigeringen: læser filen fuldt ud, `RESOLVED_CONTEXT.productPath` peger korrekt på
`PRODUCT.md`, ingen `CONTEXT_STALE`-fund om skemaversion. `<!-- impeccable:product-schema
1 -->` og alle 11 overskrifter er uændrede i navn og rækkefølge.

---

## Selv-tjek (tælling)

- **Afsnit efterprøvet: 11 af 11.** 4 rørt (Users, Product Purpose, Positioning,
  Operating Context), 7 urørt (Platform, Stack, Capabilities and Constraints, Brand
  Commitments, Evidence on Hand, Product Principles, Accessibility & Inclusion).
- **Positioneringspunkter efterprøvet: 3 af 3.** 1 holder uændret (566/0, målt), 1
  omformuleret (2/184, målt + en stale-fakta-fejl rettet), 1 holder med en præcisering
  (intet forældet tal fundet, tilføjede det aktuelle for klarhed).
- **STATUS.md-modsigelser fundet og rettet: 0** — ingen indkøber-sprog eller
  succeskriterie-sprog stod i selve STATUS.md; den ene reelle modsigelse
  (importør-påstanden) lå i PRODUCT.md og er rettet der, dokumenteret i L31.
- **`validate.mjs`: 0 fejl, 1 uændret advarsel. `context.mjs`: læser filen uden fejl.**

---

## Selv-review — hvad jeg er usikker på

**Er der noget i den nye målgruppe, der gør en del af produktet meningsløst?**
Ærligt: **EU-kolonnen er den kandidat, og jeg har ikke fjernet den, kun nedtonet den.**
Med 2 af 184 feltværdier udfyldt, og med en primær læser der sjældnere har brug for
CE-status, kan man argumentere for, at EU-feltgruppen (4 af skemaets 33 felter, altså
omkring 12 % af specifikationstæthedens egen nævner) nu primært eksisterer for en
sekundær målgruppe. Jeg har **ikke** anbefalet at fjerne felterne fra skemaet eller
bygget — det er en `data`/`tools`-beslutning, uden for mit filejerskab i denne opgave,
og en dokumentationsagent bør ikke stille forslag om at ændre nævneren en uge efter at
L30 lige har låst den fast som udledt og ufravigelig. Men det er et fund, ikke en
færdigmelding: **hvis EU-kolonnen forbliver næsten tom, er den et argument, der peger
væk fra den læser, siden nu er bygget til.** Det bør stå som et punkt, CEO'en tager
stilling til — enten "fyld kolonnen", "behold den som sekundær-service uden at nævne den
i Positioning", eller "fjern den fra Positioning helt". Jeg har valgt den midterste vej i
selve PRODUCT.md-teksten, men den er ikke låst med samme vægt som L31 selv, og jeg har
skrevet det tydeligt i teksten ("en hensigt, vi arbejder mod").

**Specifikationstæthed derimod ser jeg IKKE som svækket af skiftet** — måling af
producenters åbenhed er lige så interessant en historie for en journalist eller
studerende ("hvem svarer, hvem gemmer sig") som et beslutningsværktøj for en indkøber.
Det er min vurdering, ikke en måling; jeg kan ikke bevise interesse hos en læser, jeg
ikke har adgang til.

**Anden usikkerhed:** `PLAN.md`, `DATAMODEL.md`, `indhold/om.md` og
`prototype/system.html` indeholder alle rester af indkøber-sproget
("teknisk indkøber", "driftschefer") — fundet ved `grep`, ikke rettet, fordi jeg kun ejer
`PRODUCT.md` og `STATUS.md`. Konkret:
- `PLAN.md:116` — "gør siden brugbar for indkøb, ikke kun for ingeniører — og en indkøber"
- `DATAMODEL.md:35,44,55` — "teknisk indkøber", "en indkøber kan bruge",
  "Driftschefer, tekniske indkøbere og CTO'er ... er primær" (samme påstand som den, der
  lige er vendt i PRODUCT.md — **denne fil modsiger nu PRODUCT.md direkte**)
- `indhold/om.md:124` — "hvor 'ikke oplyst' i sig selv er en oplysning en indkøber kan
  bruge" (mindre alvorligt — generisk eksempel, ikke en målgruppepåstand)
- `prototype/system.html:1249` — "teknisk indkøber, der leder efter huller i markedet"
  (prototype-kode, lavest prioritet)

Det er ikke rettet af mig. Det væsentligste fund er `DATAMODEL.md`, fordi den nu direkte
modsiger PRODUCT.md's nye `Users`-afsnit ("Driftschefer, tekniske indkøbere og CTO'er ...
er primær" vs. PRODUCT.md's nye "den nysgerrige fagperson ... er primær"). Bør rettes af
den, der ejer `DATAMODEL.md`, eller tages op som et nyt Å-punkt i STATUS.md af den, der
har lov til at redigere den slags — jeg har bevidst ladt være, da opgaven afgrænsede mig
til `PRODUCT.md` og `STATUS.md`.

**Ingen indvending, jeg lod være med at skrive fordi den ville vælte briefet.** Den
eneste reelle spænding i opgaven var EU-kolonnens skæbne, og den er skrevet fuldt ud
ovenfor, ikke tonet ned.
