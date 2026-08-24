# FUND-nye1: tre foreslåede robotter — alle tre sprunget over

Spor: `spor/nye1`, worktree `C:\Praktik\websites\udstilling-wt-nye1`. Opgave fra CEO'en
24. aug 2026: tilføj Lenovo Daystar GS, LimX Dynamics W1 og Direct Drive Tech TITA.

**Resultat: 0 af 3 leveret, 3 af 3 sprunget over.** Ingen commits på grenen — der er intet
at committe, fordi ingen YAML-post blev fuldført. Det er ikke et forsøg, der gik i stå;
det er tre research-spor, der hver især endte ved en begrundet stopklods. De begrundelser
står nedenfor med citater og arkiveret bevis, så beslutningen kan efterprøves uden at
gentage researchen.

## Skill-vurdering

**Valgt: `robotdata`.** Opgaven er præcis det, skillen er bygget til: indsamle/kontrollere
robotposter. Forsøgte `Skill`-værktøjet først — det virkede (ingen "Unknown skill"), og
base-stien det viste (`c:\Praktik\websites\udstilling\.claude\skills\robotdata`) er
hovedrepoet, ikke min worktree. Jeg læste derfor **også** `SKILL.md` direkte fra disk i
`C:\Praktik\websites\udstilling-wt-nye1\.claude\skills\robotdata\SKILL.md` for at være
sikker på at følge worktreens egen kopi — de to var indholdsmæssigt identiske ved
sammenligning, så der er ingen divergens at rapportere.

**Gået forbi:** `parallelt` — opgaven er tre research-spor, der alle skriver ind i det
samme `data/robots/`-navnerum og det samme `fund/FUND-nye1.md`; at splitte dem på tre
agenter ville enten kollidere på samme fil eller kræve tre delrapporter, der skulle
samles bagefter alligevel. Desuden var jeg allerede udpeget som den ene, dedikerede
worker på denne worktree — at sende arbejdet videre til endnu et lag subagenter ville
være at delegere selve opgaven, ikke at dele den. `grillmig` — overvejet til
TITA-stopprøven, men den er en produktionsbeslutning (griller et brief/en plan), og
stopprøven her er en faktakontrol med et ja/nej-svar, ikke en åben beslutning der skal
grilles. `impeccable`, `ui-ux-critique`, `critique`, `dataviz`, `new-project`,
`code-review`/`simplify` — ingen af dem passer på dataindsamling.

## Spor 1: Lenovo Daystar GS — IKKE firbenet, sprunget over

Opgavebeskrivelsen antog Daystar GS var en industriel firbenet inspektionsrobot. Den er
det ikke. **Daystar Bot GS er en SEKSBENET robot (hexapod), tre benpar.** Fundet
uafhængigt bekræftet på mindst fem kilder, herunder Lenovos eget domæne:

> **"Lenovo Daystar Hexapod Robot"**
> — Lenovos egen SDK-dokumentation,
> https://daystar.lenovo.com/docs/en/daystarBot/V1.0.0/application-development/daystar-bot-app.html
> (hentet 2026-08-24, arkiveret råt, se nedenfor)

Understøttet af tredjepartsdækning: New Atlas ("pad along on six legs"), TechRadar
("robot with six legs"), Interesting Engineering, Notebookcheck.net ("six legs better
than four" i overskriften), og kinesisk presse (eet-china.com, sohu.com, leaderobot.com)
der konsekvent skriver **六足** (seksbenet) og "三三步态" (tre-tre-gangart, tre ben ad
gangen i trekantstøtte — kun muligt med seks ben).

Den officielle produktside `https://daystar.lenovo.com/home/product` blev også hentet,
men den er en Next.js/React-app der leverer et tomt skelet ved almindelig hentning
(1002 bytes, ingen indhold uden JavaScript-eksekvering) — den kunne ikke bruges til at
be- eller afkræfte noget selvstændigt, men modsiger heller ikke SDK-dokumentationens
"Hexapod"-betegnelse.

**Konsekvens:** en seksbenet robot hører ikke hjemme i et katalog over firbenede
robotter, uanset hvor gode dens specifikationer måtte være. Jeg undersøgte derfor ikke
specifikationerne videre — stopklodsen er arkitektonisk, ikke data-tynd.

## Spor 2: Direct Drive Tech TITA — stopprøve gennemført, IKKE firbenet

Dette var den eksplicit efterspurgte stopprøve. Resultat: **TITA er bipedal (to ben),
ikke firbenet.**

> **"8-DoF wheeled bipedal robot platform for inspection, mapping, security patrol,
> delivery experiments, filming, and robotics education."**
> — Direct Drive Techs egen shop-side,
> https://shop.directdrive.com/products/tita (hentet 2026-08-24, arkiveret råt)

Samme side giver desuden fulde specifikationer (til orientering, ikke til brug — robotten
er sprunget over): vægt 24,1 kg uden batteri, hastighed 3 m/s (5 m/s med API-unlock),
nyttelast 10 kg, hældning ±30°, driftstid ca. 2 timer (1 time pr. batteri, hot-swap),
compute NVIDIA Jetson Orin NX 16GB.

Tredjepartskilder bekræfter samme billede og forklarer selv forvirringen: **"Two TITA
units can be rapidly combined into a four-legged wheeled robot"** — dvs. fire ben
kræver TO TITA-enheder koblet sammen, én TITA er to ben. Det er præcis den tvetydighed,
opgavebeskrivelsen advarede om.

**Bonus-fund, ikke undersøgt til bunds:** Direct Drive Tech sælger et separat produkt,
**D1** (`https://shop.directdrive.com/products/d1-robot`), som markedsføres som et
"fully modular embodied intelligent robot", der kombinerer to enheder til enten
biped- eller quadruped-tilstand. Hurtig kontrol af selve produktsiden viste dog **samme
mønster som TITA**: D1 er også en to-tilstands-robot ("combines bipedal and quadruped
locomotion" som skiftbare tilstande for samme enhed/dockede par) — ikke entydigt en
firbenet maskine. Det kræver sin egen stopprøve, før den kan foreslås som erstatning.
Jeg leverer den IKKE og har ikke arkiveret bevis for den — kun en ledetråd til en
eventuel fjerde research-runde, hvis CEO'en ønsker det.

## Spor 3: LimX Dynamics W1 — bekræftet firbenet, men praktisk talt ingen data tilbage

Dette er det mest usikre af de tre fund, og det eneste hvor selve robotten IKKE er
diskvalificeret — kun dens tilgængelige data er det.

LimX Dynamics kalder selv W1 en firbenet robot, uden forbehold:

> **"Released W1, company's first wheeled-quadruped robot"** (milepæl september 2023)
> — https://www.limxdynamics.com/en/about (hentet 2026-08-24, arkiveret råt)

Men W1 er **udgået af det nuværende officielle site**. Jeg gennemsøgte systematisk:

- Hovednavigation `limxdynamics.com/en` — kun Luna, Oli, TRON 1, TRON 2 (alle humanoider).
  W1 findes ikke.
- Webshop `shop.limxdynamics.com` — kun TRON 1-varianter. W1 findes ikke.
- Downloads-siden `limxdynamics.com/en/downloads` — produktvælgeren lister Luna/Oli/
  TRON 1/TRON 2. W1 er ikke en valgmulighed.
- Nyhedsindekset `limxdynamics.com/en/news` — nyeste 9 artikler dækker CL-1, P1, Oli,
  Luna, TRON. Ingen W1-lancering.
- URL-mønstre afprøvet direkte (alle 404): `/en/w1`, `/en/products/w1`,
  `/zh/products/w1`, `/zh/products/w1/spec`, `/en/products/w1/spec`, `/en/w1-2`.
  (Mønsteret `/zh/products/oli/spec` FINDES for Oli — samme mønster findes ikke for W1.)
- Sitemap.xml gennemsøgt for enhver URL med "w1" — ingen fundet.
- PDF-brochurer afprøvet efter samme filnavnsmønster som Olis
  (`/pdf/LimX_Oli_宣传册_...pdf`) — alle 404 for W1.

Den eneste side med reelle W1-tal, jeg kunne finde, er en nyhedsartikel om at W1 har
fået en **ny** bipedal tilstand tilføjet:

> **BK000034, "W1 Evolves into a Biped Robot"**, https://www.limxdynamics.com/en/news/BK000034
> (hentet 2026-08-24, arkiveret råt): højde i tre tilstande — liggende 35 cm, firbenet/
> hjulben-tilstand 55 cm, bipedal tilstand 152 cm. Tilstandsskift ≤1 sekund.
> Rotationshastighed 60 o/min (i bipedal tilstand).

Det er **alt**. Ingen vægt, ingen frihedsgrader, ingen nyttelast, ingen hastighed, intet
batteri, ingen pris, ingen IP-klasse — af de 33 skemafelter kunne højst ét (`hoejde`)
belægges, og selv det er tvetydigt (tre forskellige højder for tre tilstande, ikke én
"stående højde" på samme måde som resten af kataloget bruger feltet). Alle otte
katalogtabel-felter (`egenvaegt, nyttelast_gaaende, hastighed, driftstid, ip_klasse,
ros2, ce_oplyst, pris`) ville stå tomme — robotten ville være usynlig i enhver
sammenligning på siden.

**Beslutning:** sprunget over efter opgavens egen regel — "Finder du, at en af
robotterne slet ikke har producentoplyste specifikationer, så aflevér den IKKE." Jeg
vurderer at ét tvetydigt måltal ud af 33 er praktisk talt det samme som ingen, men dette
er den mest diskutable af de tre beslutninger. Hvis CEO'en hellere vil have en ekstremt
tynd post (kun `hoejde: 55, advarsel: "quadruped-tilstand; robotten har også 35 cm
liggende og 152 cm bipedal — se kilde"`) end ingen post, kan den bygges på ti minutter
med det materiale, der allerede er arkiveret.

## Arkiveret rå-bevis

Alle seks afgørende sider er hentet med `curl` (fuld HTTP-respons + headers) til
`media/_kilder/raa-nye1-2026-08-24/`, med `MANIFEST.tsv` (8 kolonner som
`media/_kilder/LÆSMIG.md` foreskriver). Citaterne ovenfor er efterprøvet med `grep` mod
de arkiverede filer — ikke kun mod WebFetch-værktøjets sammendrag — for at sikre at
sammendraget ikke har mistolket noget. Alle fire citater blev fundet ordret i den
arkiverede HTML.

## Billedkandidater (til en senere billedrunde)

Ingen `billede:`-blokke er bygget denne runde (som instrueret), men til orientering:

- **TITA** (hvis stopprøven nogensinde omgøres, eller til D1-opfølgning):
  `https://shop.directdrive.com/cdn/shop/files/1_a859cd9f-c3be-460b-bf87-a8b3a594ebfc.jpg?v=1685304838&width=1200`
  (og:image på shop-siden, ser ud til at vise hele maskinen — IKKE vurderet med øjne
  efter billedbaren, kun fundet).
- **LimX W1**: flere billeder på BK000034-siden, bl.a.
  `https://oss.limxdynamics.com/uploads/image/2026/01/14/1768389465439_W1_Evolving_Into_A_Biped_Robot_cefa9aa7a2.jpg`
  — filnavnet antyder et W1-motiv, men billedet viser efter alt at dømme den NYE bipedale
  tilstand, ikke den firbenede. Ikke vurderet med øjne.
- **Lenovo Daystar GS**: intet direkte billed-URL fundet — `daystar.lenovo.com/home/product`
  er en tom SPA-skal uden JS-eksekvering, og `news.lenovo.com`-siderne (StoryHub) gav
  HTTP 403 for WebFetch. Bedste kandidat-placering: `news.lenovo.com/how-smarter-
  technology-will-shape-nearly-everything-we-do-in-the-next-decade/lenovo-daystar-robot/`
  — ikke undersøgt videre, da robotten er diskvalificeret.

Ingen af disse er relevante lige nu, da alle tre poster er sprunget over — de står her,
så en fremtidig agent ikke skal genfinde dem, hvis en af beslutningerne omgøres.

## Værktøjsfælde fundet i dag (bør måske ind i ARBEJDSGANG.md)

**mingw64-`curl`s `-o`/`-D`-flag accepterer ikke POSIX-stier (`/c/...`) fra Git Bash —
kun Windows-stier (`C:\...`).** `node.exe` har samme fælde for sin første positionelle
sti-parameter. Symptom: `curl -o "/c/sti/fil"` fejler stille med exit 23 ("client
returned ERROR on write") eller HTTP 000; `node "/c/sti/fil.mjs"` fejler med
`MODULE_NOT_FOUND: C:\c\sti\fil.mjs` (præfikser `C:\` foran den fejlfortolkede POSIX-sti).
Løsning: brug `C:\...`-stier til `-o`/`-D`, eller `cd` til mappen først og brug en
relativ sti. Almindelig `bash`-omdirigering (`>`) rammes IKKE — kun de to native
Windows-binærer. Jeg har ikke rettet ARBEJDSGANG.md selv (proces-dokument, ikke min
leverance denne runde), men nævner det her så orkestratoren kan vurdere det.

**Selvforskyldt fejl undervejs, rettet:** en tidlig `curl`-hentning landede ved en fejl
i `pwd` (bash-værktøjets standardmappe var `/c/Praktik/websites/udstilling` — hoved­
repoet, IKKE min worktree) og skrev en midlertidig `w1_probe.html` der. Filen blev
opdaget og slettet igen inden for samme arbejdsgang; `git status` i hovedrepoet viser
ingen spor. Ingen filer i `c:\Praktik\website` eller `c:\Praktik\websites\salg` blev
rørt. Fra det punkt brugte jeg udelukkende fulde, eksplicitte stier ind i
`udstilling-wt-nye1`.

## Efterprøvning og tællinger

Robotdata-skillens felt-for-felt selv-tjek forudsætter en bygget post — det er der
ingen af her, så det klassiske "efterprøvet N felter, fandt M fejl" giver ikke mening.
I stedet er den efterprøvning, der faktisk blev udført:

- **4 afgørende citater** (Daystar "Hexapod", TITA "wheeled bipedal", LimX
  "wheeled-quadruped", LimX's tre højder) — **alle 4 verificeret** ordret mod den
  arkiverede rå-HTML med `grep`, ikke kun mod WebFetch-værktøjets sammendrag. 0 afvigelser.
- **6 kandidat-URL'er for LimX W1** afprøvet systematisk for en levende specside
  (nav, shop, downloads, nyheder, sitemap, 6 URL-mønstre) — 0 fundet, alle dokumenteret
  ovenfor med metode, så "ikke fundet" er en søgning og ikke en påstand.
- `node tools/validate.mjs`: **46 fil(er) · 0 fejl · 1 advarsel** (den ene advarsel er
  præeksisterende, ghost-robotics-vision-60, urørt af mig).
- `node tools/build.mjs`: bygger uændret, **46 kort på forsiden** (uændret fra før
  denne runde, fordi 0 nye poster blev tilføjet).
- `git status --porcelain` i worktreen: **tomt** — ingen sporede filer ændret.

## Selv-review — hvad jeg er mest usikker på

- **W1-beslutningen er den, jeg er mindst sikker på.** Det ER en ægte firbenet robot
  ifølge producenten selv. At jeg vurderer "ét tvetydigt måltal = praktisk talt intet"
  er et skøn, ikke en mekanisk regel — en anden læser af opgaveteksten kunne rimeligt
  lande på at bygge en meget tynd post i stedet. Jeg har bevidst gjort det billigt at
  omgøre: alt materiale er arkiveret, og posten kunne bygges på kort tid.
- **Daystar GS og TITA-beslutningerne er jeg sikker på** — begge har en eksplicit,
  ordret, producent-egen kilde der modsiger firbenet-antagelsen, bekræftet af flere
  uafhængige tredjepartskilder uden en eneste kilde der siger det modsatte.
- **D1-ledetråden er kun overfladisk undersøgt** — én WebFetch-hentning af selve
  produktsiden. Jeg har ikke arkiveret rå-bevis for den, og vurderingen "samme
  tvetydighed som TITA" hviler på ét værktøjssammendrag, ikke på en `grep` mod rå HTML
  som de andre fire citater. Skal D1 forfølges, bør den behandles som en helt ny
  stopprøve, ikke som en automatisk erstatning for TITA.
- **Lenovo Daystar GS' produktsidefund er svagt** (tom SPA-skal) — konklusionen
  "hexapod" hviler på SDK-dokumentationssiden og fem tredjepartskilder, ikke på selve
  produktsiden. Det ændrer ikke konklusionen (SDK-dokumentationen er stadig
  `daystar.lenovo.com`, altså producentens eget domæne), men det er værd at bemærke at
  den "pæne" produktside aldrig gav noget som helst.
- Jeg har **ikke** forsøgt at kontakte nogen af de tre producenter direkte eller ledt
  efter en dedikeret PDF-datablad ud over de mønstre, jeg allerede kendte fra Oli. Der
  kan findes yderligere W1- eller Daystar-materiale et sted, jeg ikke har afprøvet.

## Færdiggørelseskriterier

- **(a)** 0 af 3 poster leveret, 3 af 3 sprunget over med begrundelse. 0 + 3 = 3.
- **(b)** N/A — ingen poster bygget, så intet felt-tal at opgøre.
- **(c)** `validate.mjs`: 0 fejl (46 filer, 1 præeksisterende advarsel). `build.mjs`:
  gennemført, 46 kort — uændret kortantal, fordi 0 poster blev tilføjet.
- **(d)** Selv-tjek udført i den form, situationen tillod: 4 afgørende citater
  verificeret mod arkiveret rå-HTML (0 afvigelser), 6 URL-mønstre for W1 afprøvet og
  dokumenteret. Se afsnittet "Efterprøvning og tællinger" ovenfor.
- **(e)** Gitignorerede nye filer (13 stk., alle under `media/_kilder/`, som er
  gitignoreret bortset fra sin `LÆSMIG.md` — se listen nedenfor).

## Gitignorerede nye filer (fuld liste)

Alle under `C:\Praktik\websites\udstilling-wt-nye1\media\_kilder\raa-nye1-2026-08-24\`:

1. `MANIFEST.tsv`
2. `directdrivetech-tita-shop-2026-08-24.html`
3. `directdrivetech-tita-shop-2026-08-24.html.headers.txt`
4. `directdrivetech-tita-en-2026-08-24.html`
5. `directdrivetech-tita-en-2026-08-24.html.headers.txt`
6. `lenovo-daystar-gs-sdkdocs-hexapod-2026-08-24.html`
7. `lenovo-daystar-gs-sdkdocs-hexapod-2026-08-24.html.headers.txt`
8. `lenovo-daystar-gs-productpage-2026-08-24.html`
9. `lenovo-daystar-gs-productpage-2026-08-24.html.headers.txt`
10. `limxdynamics-w1-bk000034-2026-08-24.html`
11. `limxdynamics-w1-bk000034-2026-08-24.html.headers.txt`
12. `limxdynamics-w1-about-history-2026-08-24.html`
13. `limxdynamics-w1-about-history-2026-08-24.html.headers.txt`

Bekræftet gitignoreret med `git check-ignore -v` (regel `.gitignore:13:media/_kilder/**`).
Ingen af dem er sporet af git, og de forsvinder derfor ved en almindelig `git worktree
remove` — hvis nogen af de tre beslutninger skal genbesøges, skal denne mappe bevares
eller kopieres ud af worktreen først.
