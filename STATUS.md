# STATUS — indeks over hvad der er åbent

**Den eneste fil, du skal læse for at vide, hvad der mangler.** Fund- og kildekortfiler er
arkiv og opdateres ikke bagud. Holdes kort med vilje: bliver den en essaysamling, holder
folk op med at læse den.

Opdateret 19. august 2026.

---

## Hvor vi er

| Trin | Status |
|---|---|
| Produktsandhed, byggeplan, datamodel | **Færdig** |
| Dataindsamling Kina (26 poster) | **Færdig, med gemte råkilder og manifest** |
| Dataindsamling Vest (19 poster) | Færdig, men **17 fejl fundet** — rettelser mangler |
| Feltkortlægning + EU-kolonnen | Færdig, **to huller** — se Å6 og Å7 |
| Efterprøvning af råkilder | **Færdig** — 152 påstande, 17 fejl. Se `KILDEKORT-*.md` |
| `data/robots/*.yaml` + validator | **Ikke påbegyndt.** Kode er nu tilladt |
| Visuel retning | Påbegyndt, agent døde på sessionsgrænse |
| Generator, katalog, sider | Ikke påbegyndt |

**Materialet:** ~45 robotposter i 6 FUND-dokumenter · 249 råkildefiler med manifest ·
0 maskinlæsbare datafiler. Det sidste tal er projektets flaskehals.

---

## Åbent

### Venter på CEO'en

| # | Punkt |
|---|---|
| **Å1** | **Navn og domæne.** Hele brandet hænger på det |
| **Å3** | **Billedvejen.** Anbefaling: måltro silhuetter i fælles målestok |
| **Å5** | Hvem vedligeholder kataloget efter lancering |

### Venter på JPK

| # | Punkt |
|---|---|
| **D1** | Må sekundære kilder bruges (udviklerdok, PDF-datablade)? Uden dem har seks felter nul dækning. **Bemærk:** argumentet for dem er svagere end først antaget — se D8 |
| **D4** | Tæller et felt som udfyldt ved type uden model (`3D LiDAR ×1`)? |
| **D7** | **Nævneren: 29 eller 31?** Se nedenfor. Blokerer sidens eneste rangering |
| **Å8** | Er Xiaomis JS-bundle en primærkilde? Ja → CyberDog 2 er 48 %. Nej → 0 % |
| **Å9** | Hvilket MagicLab-site er primærkilde? De to modsiger hinanden og blokerer fem felter |
| **Å10** | **Mangler der en syvende anvendelseskategori: `sikkerhed_overvaagning`?** Fem producenter sælger på *security / patrol / surveillance*, og de seks tilladte værdier har ingen plads til det. Ordet er derfor ikke omsat på Unitree As2-W, DEEP Lynx S10, DEEP X30 + X30 Pro, Rainbow RBQ-10 og Raion RAIBO2 — det står kun i noten. **Alternativet er værre:** presses "security patrol" ind under `forsvar_beredskab`, kommer en parkpatruljerobot til at stå ved siden af Ghost Robotics' militærplatform på forsiden |
| **Å11** | **Skal `anvendelse` kunne arves fra grundmodel til variant?** Unitree B2-W og Go2-W står `ikke_oplyst`, fordi hjulvarianterne ikke er i producentens navigation og deres egne sider ikke nævner nogen anvendelse — mens B2 er `industri` og Go2 er `forbruger_uddannelse`. Arv ville være vores slutning; ikke-arv lægger to varianter af samme maskine i hver sin bunke |

### Venter på arbejde

| # | Punkt |
|---|---|
| **Å2** | Visuel retning. Påbegyndt |
| **Å4** | **Salgssiden er ikke flyttet.** `c:\Praktik\website` → `websites\salg`. Kræver Claude Code lukket; kør `c:\Praktik\flyt-salg.ps1` |
| **Å6** | **EU-kolonnens hovedpåstand er ubelagt.** PLAN.md siger, køberen bliver importør ved direkte køb fra Asien. Der findes ingen primærkilde for import *til eget brug* |
| **Å7** | **"42 producenter" kan ikke citeres.** Kilden svarer 403, tallet er fra "early 2024" uden definition. Reelt tal er ≥57. PLAN.md afsnit 1 skal rettes |
| **D3** | Hvordan vises intervaller (`20~25cm`, `4-6h`)? |
| **D9** | Syv skemamangler — se nedenfor |
| **R1** | 17 fejl i `FUND-vest.md` skal rettes i et nyt dokument (arkiv rettes ikke bagud) |
| **R2** | `raa-vest-2026-08-19/` mangler manifest — det eneste råkildesæt uden. **Værre end antaget:** `ghost_s40.html` i samme mappe er en 404-side (`<title>Not Found</title>`, teksten "Page Not Found") gemt under et navn, der lover Ghost Robotics Spirit 40. Fundet 21. aug 2026. Uden manifest var der intet, der kunne fange det. Hele mappen bør gennemgås for flere |

---

## D7 — nævneren, kort

L6 splittede nyttelast og trinhøjde i to felter hver. Feltlisten fulgte med; **totalen
gjorde ikke.** Fysik-gruppen står som "(10)" og opremser 12. 29 + 2 = **31**.

Konsekvens: hovedtallet er ~6,5 % for højt, og **valget ændrer rækkefølgen, ikke bare
niveauet** — Unitree Go2 *stiger* fra 45 % til 48 %, når nævneren falder, fordi den kun
oplyser ét nyttelasttal. Sammen med D4 gør det tætheden ubrugelig som rangering:
ANYmal målte 28 % med den gamle regel og 38 % med den nye, samme side, samme dag.

---

## D9 — syv felter og tilstande, skemaet mangler

| Mangler | Fundet på |
|---|---|
| `ex_certificering` (ATEX/IECEx zone + gasgruppe) | ANYmal X: `Zone 1 IIB` |
| `rækkevidde` som **oplyst** felt | RIVR: `over 30 km`. Skemaet har den kun som beregnet |
| `vægt_inkl_batteri: ja/nej` | MagicDog vejes uden, alle andre med |
| Tilstand på driftstid (gående/stående/standby) | Weilan C500: fire tal, ingen lastbetingelse |
| `strøm ud` delt i spænding og effekt | Spot oplyser watt, Ghost og Rainbow kun volt |
| Femte `status`: demonstrator | LimX W1 blev aldrig markedsført |
| Fjerde datatilstand: oplyst, men kun som billede | Yahboom udgiver hele arket som JPG |

*Ottende punkt (`klasse`) er bortfaldet med scope-beslutningen L11.*

---

## Rettelser, der skal ind i eksisterende dokumenter

| Hvor | Hvad |
|---|---|
| PRODUCT.md, PLAN.md | **Sprogkravet er dansk, ikke "et EU-sprog".** BEK 727 §§ 3, 4, 6 kræver dansk for brugsanvisning, advarsler og overensstemmelseserklæring |
| PLAN.md afsnit 1 | "42 producenter" er ukildet og for lavt — se Å7 |
| Alle steder | Maskinforordningen gælder fra **20. januar 2027**. EUR-Lex' Cellar serverer den uberigtigede tekst med 14. januar — brug ikke EUR-Lex direkte til datoen |

---

## Lukket

| # | Punkt | Beslutning |
|---|---|---|
| **L1** | Afsender | Eget brand, KeyResearch som udgiver i footer og på Om-siden |
| **L2** | Datapolitik | Fabrikanttal med kilde + beregnede felter med synlig formel. Ingen 1-5-score |
| **L3** | Sprog | Dansk + engelsk ved lancering, arkitektur bygget til flere |
| **L4** | Stack | YAML + selvskrevet Node-generator uden afhængigheder |
| **L5** | Projektadskillelse | Eget repo. Deler kun tone, målescripts og fontstrategi med salgssiden |
| **L6** | Nyttelast, trinhøjde, driftstid | Splittes i separate felter. Se F1-F3 i DATAMODEL.md |
| **L7** | **D2 — Spot-længden** | **1100 mm.** Produktsiden har en tastefejl; databladet er konsistent med sin egen imperiale værdi. Produktsidens `110mm` føres med som `advarsel` |
| **L8** | Hook og projektskills | Virker efter genstart |
| **L9** | **D6 — kina-sporet uden råkilder** | **Løst.** Alle 26 poster indsamlet om med gemte, kontrolsummerede råkilder |
| **L10** | **D8 — er FUND-vest til at stole på?** | **Efterprøvet: 152 påstande, 17 fejl.** Ingen producenttal læst forkert; fejlene er tilskrivning, tælling og to opfundne hjembyer. Se `KILDEKORT-*.md` |
| **L11** | **Scope** | **Legetøj, hobbyrobotter og undervisningskit hører ikke i kataloget.** Ude: Sony aibo, Tombot, Petoi, MangDang, Hiwonder, Yahboom, Elephant Robotics |
| **L12** | **Kode** | **Tilladt.** `data/robots/*.yaml` og `tools/validate.mjs` må skrives |
| **L13** | **Billeder (Å3)** | **Fabrikantbilleder tilladt, så længe siden er lokal.** Egne fotos og silhuetter også. AI-genererede robotbilleder er stadig ude |
| **L14** | **Produktretning** | **Billeddrevet browsing, ikke opslagsværk.** Specifikationer nedtones; detaljer hentes ved at gå videre til producentens egen side |
| **L15** | **Informationsarkitektur** | **Forsiden organiseres efter vægtklasse** (under 20 kg · 20-60 kg · over 60 kg), ikke efter producent. Producentsider findes som andet niveau og bærer EU-kolonnen. Hver robot beholder sin egen URL. Begrundelse: 43 robotter ligner hinanden; størrelse er den eneste forskel, en køber både kan se og bruge — og tre producenter har 26 af de 43, så producentopdeling giver en skæv forside |

> **SPÆRRING S1 — må ikke glemmes.** Siden må **ikke publiceres**, mens den viser
> fabrikantbilleder uden skriftlig tilladelse. Enten indhentes tilladelserne, eller
> billederne udskiftes med egne fotos og silhuetter før lancering. En pladsholder, der
> ligner et rigtigt billede, overlever til lancering — det er sket på nabosiden.

---

## Regler, der er købt dyrt

- **Gem råkilden, hver gang.** Kina-sporet måtte køres helt om, fordi den ikke blev gemt.
- **Skriv manifest ved siden af:** URL, HTTP-status, UTC, SHA-256. Uden det kunne et
  datablad kun kobles til sin kilde med indicier.
- **Gem aldrig en fejlside under et navn, der lover indhold.** Tre 404-sider ligger i
  vest-sættet, én hedder `petoi_shop.html`.
- **Land og hjemsted er et felt som ethvert andet.** To hjembyer blev skrevet ud af
  hukommelsen; ingen af dem stod i råmaterialet.
- **Producentnavne må aldrig komme fra maskinoversatte sammendrag.** To fejlnavne fanget:
  `云深处` gengivet som et andet firma, og Yobotics stavet 友宝特 i stedet for 优宝特.
- **Læs den kinesiske side.** `＜60 cm` viste sig at være hindringsundvigelsesafstand,
  ikke forhindringshøjde — på engelsk var tallet landet i et mobilitetsfelt.
- **Kan noget ikke belægges, så skriv det.** ATEX-gasgrupperne står som `ikke oplyst`,
  fordi de frie gengivelser modsiger hinanden.

---

## Kom ikke igen med disse

| Forslag | Hvorfor ikke |
|---|---|
| Købsknap, affiliate-links, prisforespørgselsformular | Gør os til forhandler. Der findes ingen forhandleraftale |
| Redaktionel 1-5-score | Uden offentliggjort metode er det en konklusion skrevet om til tal |
| AI-genererede robotbilleder | Fabrikerer en maskine, der ikke ser sådan ud |
| Fabrikanternes pressefotos | Stærkeste mulige signal om et forhandlerforhold, der ikke findes |
| Cookiebanner | Siden sætter ingen cookies |
| Nyhedssektion | En død nyhedsstrøm daterer siden |
| `data-en`-attributter som sprogløsning | Kontakt med to stillinger; kan ikke få en tredje |
| Én HTML-fil som salgssiden | Bryder sammen ved 60 robotter × flere sprog |
