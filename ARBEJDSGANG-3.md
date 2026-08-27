# ARBEJDSGANG-3.md — hvad session 26.-27. aug målte om arbejdsgangen

27. aug 2026. Bestilt af JPK: *"evaluér workflowet med udgangspunkt i denne
session. Er der mangler? Har vi lavet fejl, som kunne være undgået? Tilpas
workflowet ud fra læringen."* Efterfølgeren til ARBEJDSGANG-2, som dækkede
dagen før.

**Grundlaget, målt:** 6 spor sendt, 6 flettet, 2 efter én rettelsesrunde ·
**0 flettekonflikter i 6 flet** (mod 6 af 9 dagen før) · tests 299 → 366 ·
35 commits · validate 77/0/1 uændret hele vejen · 1 spor fundet dødt fra
formiddagen (`spor/retning`, 0 commits, obduceret via STATUS-posten).

**Arbejdsgangen virkede bedre end dagen før, og det kan måles.** Det, der
følger, er de fem steder, den stadig kostede — rangeret efter hvad de kostede.

---

## V1. Orkestratoren er sessionens hyppigste regelbryder — 6 mod 2

**Tællingen.** Fejl og nærved-fejl i sessionen, efter hvem der lavede dem:

**Orkestratorens (6):**

1. Acceptkriterie-script i hastighed-briefet antog forkert JSON-struktur
   (`Object.values(j)[0]` ≠ `j.robotter`). **Agenten fangede den.**
2. FUND-forbehold-kommandoen tabte `tilstand==='tal'`-filteret: 155/890 i
   stedet for 114/562. Fanget, fordi den skrevne kommando blev genkørt.
3. `diff` på to tomme filer godkendte en navnesammenligning, der aldrig var
   sket (`grep -P` fejlede tavst). Fanget ved at tælle linjer bagefter.
4. Backticks i en `node -e`-streng udført af bash — **den fælde, CLAUDE.md
   allerede beskrev.** Ingen skade, men kun fordi diffen blev læst.
5. En Edit klippede en STATUS.md-tabelrække midt over og hæftede resten på
   naborækken. Fanget ved at læse linjen efter — ikke ved at antage.
6. Rettelsesbeskeden til instrument2 påstod *"striben har fire felter"* i
   `producent.mjs` — den har **tre**. **Agenten rettede mig.** CLAUDE.md's
   egen regel (*"citér det, der står der nu"*) fandtes; jeg fulgte den ikke.

**Subagenternes (2):**

7. data2 researchede Uniubi fra bunden uden først at søge i kataloget —
   robotten lå der under producentens juridiske navn. ~1 time spildt.
8. legende begrundede et (korrekt) teknisk valg med et citat, der ikke holdt:
   `fund/FUND-i18n.md` #3 handler om noget andet end det påståede.

**Mønsteret er ubehageligt og præcist: subagenterne kontrolleres af
orkestratoren — orkestratoren kontrolleres af ingen.** Tre af mine seks brød
regler, der allerede stod i CLAUDE.md. ARBEJDSGANG-2's O5 endte samme sted
(*"det var mig, der brød den"*). To sessioner, samme konklusion: papirreglen
holder ikke den, der skrev den.

**Tilpasningen (udført):** de to gange, en agent rettede orkestratoren, var
sessionens billigste kvalitetskontrol — og begge skete på agentens eget
initiativ. Det gøres nu til en **leverance**: `brief`-skillen har fået et
punkt 10 — *briefets fakta er påstande; mål dem, og rapportér afvigelser som
en del af leverancen, ikke som ulydighed* — og en linje om, at
**rettelsesbeskeder til et kørende spor også er briefs** og skal gennem samme
tjekliste. Fejl 6 var netop en rettelsesbesked, sendt uden om alle værn.

## V2. En navngiven fejl gentog sig to gange — papirregler standser ingenting

O2 (*"kør dit eget acceptkriterium, før du sender det"*) blev navngivet i
ARBEJDSGANG-2 **og gentaget to gange i denne session** (fejl 1 og 2 ovenfor).
Reglen fandtes, var frisk, og var mine egne ord.

**Læren er strukturel:** en regel, der kun findes som prosa, virker på den,
der tilfældigvis husker den. Den virker ikke under tidspres, og den virker
slet ikke på forfatteren. Kun regler med en **mekanisk håndhævelse** — et
felt, der skal udfyldes; en kommando, hvis output skal stå i briefet — holder.

**Tilpasningen (udført):** `brief`-skillens punkt 2 kræver nu, at hvert
kriterium står i briefet **med sit nuværende output** ("giver i dag X").
Et brief uden det felt er synligt ufærdigt. Det er forskellen på "husk at
køre den" og "der er et hul i formularen, hvor tallet skal stå".

## V3. Citater slår igennem uden kontrol — to gange på én session

Fejl 6 og 8 er samme fejl fra hver sin side: en påstand med en kildehenvisning
læses som efterprøvet, netop **fordi** den bærer en henvisning. Min "fire
felter (producent.mjs:239)" og legendes "godkendt forskel (FUND-i18n.md #3)"
lød begge dokumenterede. Ingen af dem holdt ved opslag.

**Tilpasningen:** et citat behandles som et tal — det arver konfidensskalaen.
*Citeret med linjenummer og slået op* er høj; *citeret efter hukommelse* er
lav og skal mærkes. Skrevet ind i `brief`-skillens punkt 10, samme sted som
V1's regel, for det er samme muskel: påstande måles, også ens egne.

## V4. Øjebliksbilleder af dynamisk tilstand rådner på timer

CLAUDE.md's plugin-tabel blev skrevet om morgenen ("10 installeret") og var
forkert inden aften ("15"). Tabellens forgænger påstod, at `simplify` ikke
fandtes — den hedder `code-simplifier` og lå på disken hele tiden; påstanden
var skrevet ud fra ét fejlet kald, ikke en optælling. Og sessionens
`UserPromptSubmit`-hook nævnte **2 af 8** projektskills, fordi den blev
skrevet, da der var to.

Alle tre er samme fejl: **et tal om noget levende, gemt som tekst.** O4 i
ARBEJDSGANG-2 fandt det for beslutninger; denne session viser, at det også
gælder infrastrukturen selv.

**Tilpasningen (udført):** hooken er opdateret til at nævne alle otte og til
at pege på CLAUDE.md's tabel som kilden. Princippet er skrevet her: **et
dynamisk tal i et procesdokument skal bære sin dato og sin genkørbare
kommando** — tallet er illustration, kommandoen er sandheden.

## V5. Miljøet er en større fejlkilde end koden — og det har fået sit eget værn

Sessionens tre største tidsrøvere var ingen af dem kodefejl: fire forældreløse
servere på delte porte (et måletal kunne komme fra en fremmed mappe), fire
worktree-mapper låst af de servere, og `python`/backtick/BOM-fælderne i
skallen. Alt sammen miljø.

**Tilpasningen (udført):** CLAUDE.md's serverafsnit (egen port + verificér
mod disken), `.gitignore` dækker `dist-*/`, og `fejljagt`-skillen har
miljøfælderne som obligatorisk tjek FØR fejlsøgning i koden.

---

## Hvad der virkede, og som ikke må optimeres væk

- **O1-rettelsen er bevist i drift:** 3 flet tilføjede nye testfiler til
  `tests/dele/` uden at røre `koer.mjs` — **0 konflikter i 6 flet**, mod 6 af
  9 dagen før. Selvopdagelsen af dele (ingen delt DELE-liste) var den sidste
  brik, og den blev krævet i en rettelsesrunde frem for accepteret.
- **Navneliste-sammenligningen** fangede "tal kan holde, mens indhold byttes"
  to gange (301 og 339 navne, identiske mængder). Den er nu standard ved
  test-flytninger.
- **Konfidensskalaen holdt:** hvert eneste Høj-punkt, der blev genkørt af
  orkestratoren, reproducerede. Ingen inflation målt i denne session.
- **STATUS-posten om kørende spor** gjorde `spor/retning`-obduktionen til en
  måling (0 commits, 0 ændringer, forfader til main) i stedet for et gæt.
- **grillmig's B2 væltede min egen anbefaling** på Å28: målingen (41/13/75
  linjer) viste "ingen sammenlægning", hvor jeg var gået ind med det modsatte.
  En grilning, der aldrig ændrer nogens mening, er en formalitet — denne gør
  ikke.
- **Agenter, der retter orkestratoren.** To gange, begge korrekte. Det er nu
  en leverance (V1) — den adfærd skal belønnes, ikke tolereres.

## Rangering, hvis der kun er tid til én ting

**V1/V3 er samme rettelse og er udført** (brief punkt 10 + rettelsesbeskeder
er briefs). Den dækker fire af sessionens otte fejl.

**Det, der IKKE er løst og ikke kan løses med en regel:** orkestratoren har
stadig ingen kontrollant. Punkt 10 giver agenterne mandat til at måle mine
påstande i briefs — men mine analyser, fletbeskeder og STATUS-poster læses af
ingen. Det strukturelle svar ville være et periodisk review-spor på den mest
kapable model, der læser orkestratorens egne dokumenter mod virkeligheden
(O4-målingen som fast rutine). **Ikke bygget — det er en beslutning om pris,
og den er JPK's.**

## Det jeg ikke kunne måle

Om de tre nye skills (fejljagt, flet, brief) faktisk ændrer adfærd, eller om
de bliver endnu et lag papir oven på reglerne, de er destilleret af. V2 siger,
at papir ikke standser noget — skillene er bygget med mekaniske felter netop
derfor, men beviset kommer først ved næste spor-afsendelse, næste flet og
næste røde tal. Første rigtige brug er målingen.
