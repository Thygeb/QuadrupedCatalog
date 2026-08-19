# STATUS — samlet fundindeks

Oprettet 19. august 2026. **Dette er den eneste fil, du skal læse for at vide, hvad der er
åbent.** Fundfiler (`FUND-*.md`) er arkiv og opdateres ikke bagud.

Projektet er i **planlægning**. Ingen kode skrevet. Rækkefølgen står i [PLAN.md](PLAN.md).

---

## Hvor vi er

| Trin | Status |
|---|---|
| Produktsandhed fastlagt ([PRODUCT.md](PRODUCT.md)) | **Færdig** 19. aug |
| Byggeplan ([PLAN.md](PLAN.md)) | **Færdig** 19. aug |
| Datamodel prøvet på tre robotter ([DATAMODEL.md](DATAMODEL.md)) | **Færdig** 19. aug |
| Dataindsamling, bredde | **I gang** — tre agenter |
| Visuel retning (`impeccable` → `new-work`) | **Ikke påbegyndt** |
| Generator, katalog, sider | Ikke påbegyndt |

## D5 — to ubekræftede udkast ligger i repoet

**Læs dette, før nogen bruger `FUND-kina.md` eller `FUND-vest.md`.**

Tre agenter kørte 19. aug 09:13–09:45 i hver sin worktree. **Alle tre blev standset
undervejs**, fordi projektmapperne skulle omstruktureres. Alle tre havde afsluttet deres
research; ingen af dem nåede efterprøvningen.

| Fil | Størrelse | Status |
|---|---|---|
| `FUND-kina.md` | 48,8 KB | **Ubekræftet udkast.** Kinesiske producenter |
| `FUND-vest.md` | 51,4 KB | **Ubekræftet udkast.** Vestlige producenter |
| `FUND-felt.md` | — | Blev aldrig skrevet. Feltkortlægning + EU-sporet skal køres forfra |

**Hvad der mangler på begge**, og derfor må de ikke bruges som data:

1. Efterprøvning felt for felt mod kilden, **med tælling** af efterprøvede felter og
   fundne fejl
2. Agentens eget review og dens usikkerheder
3. Kontrol af specifikationstætheden — den er beregnet, men ikke efterprøvet

De 58 hentede fabrikantsider fra vest-sporet ligger i
`media/_kilder/raa-vest-2026-08-19/` — **uden for repoet**, gitignoreret. De var ved at
blive committet ved et uheld; det er præcis den fejl, `media/_kilder/`-reglen findes for
at forhindre, og den blev fanget af reglen samme dag den blev skrevet.

**Næste skridt:** genstart de tre spor med `.claude/skills/robotdata` og
`.claude/skills/parallelt` i stedet for håndskrevne prompter, og lad efterprøvningen køre
færdig denne gang.

---

## Det målte

Specifikationstæthed på producenternes egne produktsider, 19. aug 2026. 29 felter talt.

| Robot | Udfyldt | Tæthed |
|---|---|---|
| Boston Dynamics Spot | 16 / 29 | 55 % |
| Unitree B2 | 14 / 29 | 48 % |
| ANYbotics ANYmal | 8 / 29 | 28 % |

**Ingen over 55 %.** Konsekvens for designet: "ikke oplyst" er normaltilstanden, ikke
undtagelsen, og tomme felter skal designes som førsteklasses tilstand.

Seks felter har nul dækning på alle tre: frihedsgrader, ROS-support, SDK, pris,
leveringstid, servicepunkt i EU.

---

## Åbent

### Venter på CEO'en

| # | Punkt |
|---|---|
| **Å1** | **Navn og domæne.** Hele brandet hænger på det |
| **Å3** | **Billedvejen.** Anbefaling: måltro silhuetter vi tegner selv, alle i samme målestok |
| **Å5** | Hvem vedligeholder kataloget efter lancering |

### Venter på JPK

| # | Punkt |
|---|---|
| **D1** | Må sekundære kilder (udviklerdok, PDF-datablade) bruges? Uden dem har seks felter nul dækning |

### Å4 — mappestrukturen, halvt udført

**Dette projekt er flyttet.** `c:\Praktik\guide` → **`c:\Praktik\websites\udstilling`**,
19. aug 2026. Verificeret: `git fsck` ren, 7 commits, 22 sporede filer alle til stede,
0 manglende, worktree-listen peger på den nye sti.

**Salgssiden er ikke flyttet endnu.** `c:\Praktik\website` skal blive til
`c:\Praktik\websites\salg`, men flytningen fejler med *"Device or resource busy"*, så
længe Claude Code kører med den som arbejdsmappe. **Den skal ske med Claude Code lukket** —
kør `c:\Praktik\flyt-salg.ps1`, og start derefter i `c:\Praktik\websites\`.

Forberedt på forhånd, så det kun mangler selve flytningen:

- Stierne i salgsprojektets `CLAUDE.md` og `STATUS.md` peger allerede på
  `websites\salg`. **Ændringerne er ikke committet** — de ligger sammen med en
  ældre, ikke-relateret ændring i `index.html`, som ikke er vores.
  Arkivdokumenterne (`ARGUMENTATION.md`, `DESIGNKRITIK-3/5`) er med vilje **ikke**
  rettet: projektets egen regel siger, at arkiver ikke opdateres bagud.
- Hukommelsen er kopieret til begge nye projektnøgler,
  `c--Praktik-websites-udstilling` og `c--Praktik-websites-salg`.

**Tre ting kostede tid og bør huskes:** MSYS-stier (`/c/Praktik/...`) virker i bash, men
git.exe og `cmd //c` forstår dem ikke. `mv` gav *Permission denied* på hele mappen, mens
PowerShells `Move-Item` flyttede **12 af 80 filer** og derefter fejlede — en delvis
flytning, der så ud som en fejlet flytning. Kopiér-verificér-slet frem for flyt, når det
gælder en hel projektmappe.

### Venter på arbejde

| # | Punkt |
|---|---|
| **Å2** | **Visuel retning.** Ikke påbegyndt. Skal køre efter dataindsamlingen, ikke før |
| **D2** | Spot-længden: 110 mm eller 1100 mm? Efterprøves af `data/vest` |
| **D3** | Hvordan vises intervaller (*"20~25cm"*, *"4-6h"*)? Alle tre producenter bruger dem |
| **D4** | Tæller et felt som udfyldt ved type uden model (*"3D LiDAR ×1"*)? Ændrer tæthedstallene |

---

## Lukket

| # | Punkt | Beslutning | Dato |
|---|---|---|---|
| **L1** | Afsender | Eget brand og domæne, KeyResearch som udgiver i footer og på Om-siden | 19. aug |
| **L2** | Datapolitik | Fabrikanttal med kilde + beregnede felter med synlig formel. **Ingen redaktionel 1-5-score** | 19. aug |
| **L3** | Sprog | Dansk + engelsk ved lancering, arkitektur bygget til flere | 19. aug |
| **L4** | Stack | YAML-datafiler + selvskrevet Node-generator uden afhængigheder | 19. aug |
| **L5** | Projektadskillelse | Eget repo i `c:\Praktik\guide`. Deler kun tone, målescripts og fontstrategi med salgssiden | 19. aug |
| **L6** | Nyttelast, trinhøjde, driftstid | Splittes i separate felter. Se F1, F2, F3 i [DATAMODEL.md](DATAMODEL.md) | 19. aug |

---

## Kom ikke igen med disse

| Forslag | Hvorfor ikke |
|---|---|
| Købsknap à la "Buy-a-Humanoid™" | Gør os til forhandler i læserens øjne. Der findes ingen forhandleraftale |
| Affiliate-links | Samme |
| Redaktionel 1-5-score | Uden offentliggjort metode med acceptkriterier er det en konklusion skrevet om til tal |
| AI-genererede robotbilleder | Fabrikerer en maskine, der ikke ser sådan ud |
| Fabrikanternes pressefotos | Stærkeste mulige signal om et forhandlerforhold, der ikke findes |
| Cookiebanner | Siden sætter ingen cookies |
| Nyhedssektion | En død nyhedsstrøm daterer siden |
| `data-en`-attributter som sprogløsning | Kontakt med to stillinger; kan ikke få en tredje |
| Én HTML-fil som salgssiden | Bryder sammen ved 60 robotter × flere sprog, og efterlader ingen delbar URL pr. robot |
