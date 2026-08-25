# BEGRUNDELSE — retning LYS ("Udstillingssalen, forfinet")

Fire statiske mockups: `forside.html`, `katalog.html`, `sammenligning.html`, `robot.html`,
delt CSS i `lys.css`. Alle tal er hentet direkte fra `data/robots/*.yaml` — se selv-tjekket
i `fund/FUND-retning-lys.md` for den fulde optælling og de fejl, der blev fundet og rettet
undervejs.

## Tesen i én sætning

En **evolution**, ikke en ny opfindelse: samme målte palet og samme fire datatilstande som
sitets nuværende ORBIT-lys (`DESIGN.md`), men med færre samtidige konkurrerende elementer
pr. skærm, større og mere styrende fotografi, og et gennemgående museums-/udstillingsmotiv
hentet fra emnets egen verden — montren, måletavlen, det håndskrevne objektskilt — i stedet
for generiske SaaS-mønstre.

## Anthropics frontend-design-skill: hentet og anvendt

Hentet fra `https://raw.githubusercontent.com/anthropics/claude-code/main/plugins/frontend-design/skills/frontend-design/SKILL.md`
efter orkestratorens tilføjelse til briefet, midt i byggeriet — dokumenteret her, retroaktivt
anvendt på alt indhold:

- **Anvendt:** "Emnets egen verden er kilden til det særegne" → museums-vitrinen
  (`.vitrine`), måletavlen (allerede en del af ORBIT-lys, videreført og genbrugt), det
  hævede objektskilt (`.skilt`), sal-numrene i romertal (`.sal__nr`) på katalogsiden.
- **Anvendt:** "Undgå AI-standardpalet nr. 1" (varm creme/terracotta) → paletten er **uændret
  fra ORBIT-lys**: kold lysegrå bund, hvide paneler, én blå accent. Ingen ny farve er
  introduceret. Se tokenlisten nedenfor.
- **Anvendt:** "Typografien skal bære personlighed" → Manrope/JetBrains Mono-parret er
  bevaret og begrundet eksplicit (se afsnittet Typografi), ikke videreført ureflekteret.
- **Anvendt:** "Ét signaturelement pr. side, ro omkring det" → navngivet pr. side nedenfor.
- **Anvendt:** "Strukturelle greb skal bære ægte information" → sal-numrene (I–IV) er
  kataloggruppens faktiske rækkefølge, `skilt__nr`-tallet ("23 AF 30 FELTER") er robottens
  reelle specifikationstæthed, ikke et pyntetal.
- **Fravalgt:** animationsafsnittet — mockups er statiske, ingen bevægelse er bygget.
- **Fravalgt:** "to-pas proces" (plan, så kritik af planen før bygning) — bygget direkte,
  fordi retningens tese allerede var fastlagt af orkestratoren; jeg fortolkede den ikke om.

Rangorden fulgt ved konflikt, som orkestratoren bad om: projektets hårde regler (CLAUDE.md)
> retningens tese > denne skill. Ingen konflikter opstod i praksis.

## Farvetokens (4-6, navngivet som krævet)

Alle seks er **genbrugt uændret** fra `DESIGN.md`s allerede kontrastmålte palet, ikke
gættet på ny — se `assets/system.css`s egne målinger (fx `blaek3`:`bund` 5,55:1).
At opfinde nye farver uden en måling ved hånden ville bryde "mål, gæt ikke":

| Token | Hex | Brug |
|---|---|---|
| `--bund` | `#F2F3F5` | Sidens grund |
| `--panel` | `#FFFFFF` | Kort, striber, vitrinens mat |
| `--blaek` | `#14161A` | Al primær tekst, tal, den mørke billednote |
| `--accent` | `#0D5C86` | Den ene stemme: links, valgt sortering, oplyst nøgletalsikon |
| `--tom` | `#EDEFF2` | Hullets flade (`v-ikke`) |
| `--hegn` | `#7C8695` | Betydningsbærende kant: stiplet hul, måletavlens ramme |

Ingen af de seks ligger i creme/terracotta-familien — de er alle grå eller den ene blå.

## Typografi — valgt og begrundet, ikke "system-ui hele vejen"

**Manrope** (display/brød) + **JetBrains Mono** (etiket/tal), samme par som ORBIT-lys.
Parret er bevidst *bevaret*, ikke genbrugt af dovenskab: mono-tallet ER allerede retningens
signaturgreb — en måletavles instrumentaflæsning, en museumsskilte-plades håndskrevne mål.
At skifte skrift for at virke "original" ville have brudt netop den kobling til emnets egen
verden, skillen selv beder om. Forfiningen ligger i **disciplin**, ikke i valg: forsidens
åbning bruger to skriftgrader i stedet for fire (hero + lede — ikke en kicker-etiket
derover, se "reglen om versaletiketten" i DESIGN.md), og sammenligningssidens 30 rækker
holder sig til én etiketstørrelse og én talstørrelse hele vejen ned, så øjet ikke skal
genkalibrere for hver gruppe.

## Signaturelement pr. side

- **forside.html:** det ene store montre-foto i "Feltets yderpunkter" (Lynx S10,
  hurtigste). De tre andre yderpunkter står fotoløse ved siden af — bevidst valg, se
  "Færre konkurrerende elementer" nedenfor.
- **katalog.html:** selve foto-gitteret — 16 rigtige montrer i træk, grupperet under
  romertals-sale. Intet enkeltelement skal konkurrere med gitterets egen rytme.
- **sammenligning.html:** de tre specimen-montrer i træk øverst (Spot / ANYmal X / Go2),
  før felttabellen begynder — læseren ser de tre "genstande" side om side, før den ser
  et eneste tal.
- **robot.html:** det store enlige montre-foto i toppen, metadata holdt i én rolig spalte
  ved siden af, så billedet ikke skal dele opmærksomhed med et talgitter i samme åbning.

## Færre konkurrerende elementer pr. skærm

Den konkrete forskel fra dagens `dist/da/index.html`: yderpunkt-sektionen viser i dag fire
ligestillede fotokort samtidig. Her leder **ét** foto (hurtigste), og de tre andre
yderpunkter står som en stille tekstliste uden billede. Det er en bevidst nedgradering af
tre elementer for at lade det fjerde bære opmærksomheden — præcis skillens "ét
signaturelement, ro omkring det".

Arkitekturændring, der følger af at have fire SELVSTÆNDIGE sider i stedet for dagens
énsides-forside: **forsiden viser ikke længere alle 62 robotter.** Den viser "Seks af 62"
som en smagsprøve med et tydeligt link til `katalog.html`, hvor hele kataloget hører hjemme.
Det er ikke et tab af indhold, men en arbejdsdeling mellem "indgang" og "montre" — dagens
system har kun ét sted at gøre begge dele.

## Fire datatilstande, side om side

`sammenligning.html`s dockingstation-række er bevidst fremhævet (lys blå baggrund): Spot
svarer **ja**, ANYmal X er **ikke oplyst**, Go2 svarer **nej** — alle tre tilstande i én
række, ingen af dem opfundet. Nul optræder ikke i selve trioen (ingen af de tre robotter har
et rent 0-felt), men konceptet er dokumenteret i tegnforklaringen på både sammenlignings- og
robotsiden, og feltskemaets egen `v-nul`-styling (sat præcis som ethvert andet tal, ingen
dæmpning) er implementeret i CSS'en og klar, den dag en robot i trioen får et 0-felt.

Intervaller og `~`/`±`/`≥`/`≤`-operatorer beholder producentens egen notation overalt —
Go2s hastighed står som `0–2,5 m/s`, ikke som et gennemsnit; Boston Dynamics' højde bærer et
hævet forbeholdstegn, der forklarer at fire højder findes. Ingen operator er væk-rundet.

## Ingen "bedste værdi"-markering — designafgørelsen, briefet bad om

`sammenligning.html`s introboks svarer eksplicit på briefets spørgsmål: **vi markerer ikke
en vindercelle pr. række.** Begrundelsen står på siden selv (og gentages her): en lavere
egenvægt er ikke "bedre" end en højere, kun anvendelsen afgør det, og siden kender ikke
anvendelsen. At markere en vinder ville være netop den redaktionelle score, CLAUDE.md's
hårde begrænsning 6 forbyder. I praksis viste det sig desuden, at ingen af de 30 rækker i
denne trio har alle tre robotter som direkte sammenlignelige rene tal (ANYmal X's 4 udfyldte
felter overlapper aldrig fuldt med de to andres) — selve fraværet af sammenlignelige tal er
et fund, ikke en mangel i mockuppen.

## Kilder skjules — kildemærket er fjernet, ikke kun usynligt

CEO'en besluttede 24. aug at kilder står i dataen, men skjules visuelt. Det hævede
kildebogstav (A, B …), som ORBIT-lys bruger til at pege på en kildeliste, peger på en liste,
der ikke findes i denne retning. Jeg fjernede derfor kildemærket helt — også fra CSS'en — i
stedet for at lade et dødt, ikke-klikbart bogstav stå tilbage. **Forbeholdstegnet (`*`) er
noget andet** og er bevaret: det peger på en indholdsnote (variant, lastbetingelse,
modsigelse i producentens materiale), ikke på en URL, og hører ikke under "kildelinje".

## Kortstribens fire felter, ikke otte — arvet, ikke genopfundet

Katalogkortets kompakte stribe viser fire felter (egenvægt, nyttelast, fart, driftstid),
samme fire ORBIT-lys landede på 24. aug efter at have målt, at IP-klasse stod tom på over
halvdelen af kortene. Jeg arvede den lektion i stedet for at gen-designe fra nul.

**Bevidst fravalg:** kortets kompakte driftstid-celle viser IKKE lastbetingelsens
forbeholdstegn (`ved_last: ikke_oplyst`), som den fulde sammenlignings- og robotside gør. Et
300px-bredt kort med to konkurrerende oplysninger i samme celle er støj; fuld disclosure hører
til de to sider, der har plads til den. Undtagelsen er B2's driftstid, hvor lastbetingelsen
BÆRER et tal (20 kg) og derfor er informativ nok til at stå på kortet.

## Hvad jeg bevidst fravalgte

- **Søgefelt på forsiden.** ORBIT-lys' søgefelt kræver JavaScript og er derfor skjult i den
  rigtige side, indtil JS tænder det. En statisk mockup kan ikke vise den tilstand
  meningsfuldt, så jeg droppede feltet og lod "Se hele kataloget"-knappen bære indgangen i
  stedet.
- **Formålsfilteret på forsiden** (`.formaal-gitter` i ORBIT-lys). Ikke en del af briefets
  fire krævede elementer (hero, yderpunkter, EU-linje, kortstribe), og at tilføje det ville
  have konkurreret med yderpunkternes montre-foto om førstepladsen på skærmen — direkte imod
  "ét signaturelement, ro omkring det".
- **Ny farve til museumsmotivet** (fx en messing-/rivet-detalje på måletavlen). Overvejet og
  fravalgt: enhver ny tone kræver en kontrastmåling, jeg ikke kan udføre uden værktøjet, der
  målte de eksisterende 34 — og risikoen for at glide mod en varm accent var reel nok til at
  droppe idéen helt, jf. spærringen mod creme/terracotta.
- **`kun_billede`-tilstanden vist på en rigtig robot.** Ingen af de 62 robotter i kataloget
  har et felt i den tilstand i dag (efterprøvet med `grep -rl "kun_billede" data/robots/`,
  0 fund) — den optræder derfor kun i tegnforklaringen som en beskrevet regel, ikke knyttet
  til en opfundet dataværdi.
