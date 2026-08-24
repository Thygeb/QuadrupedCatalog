# FUND-kand1b — to kandidater fra WRC 2026: MicroRoboTech og GENISOM AI

Spor: `spor/kand1b`, worktree `C:\Praktik\websites\udstilling-wt-kand1b`. Opgave fra
orkestratoren 24. aug 2026: efterprøv og indsaml MicroRoboTech (具微科技, MOVENEW T1/P1) og
GENISOM AI (智身科技, Gangben-serien), begge fra `fund/FUND-messe.md`'s Tier 1-liste. Undervejs
kom en regelændring fra CEO'en (via orkestratoren): producentens eget materiale ud over
produktsider — PDF-datablade, manualer, GitHub-udviklerdokumentation — tæller nu som gyldig
kilde, mod `kildetype: sekundaer`-mærkning. Den regel er brugt og er dokumenteret nedenfor,
inklusive ét sted hvor den FØRTE MIG PÅ VILDSPOR og blev rettet ved selv-tjek.

---

## Skill-vurdering (regel 0)

| Skill | Valgt? | Begrundelse |
|---|---|---|
| `robotdata` | **Valgt** | Opgaven er præcis det, skillen bærer: 33-feltsskemaet, de ti hårde regler, stopprøven, selv-tjekket. Jeg brugte **Read-værktøjet direkte på `SKILL.md` fra disk** (`.claude/skills/robotdata/SKILL.md` i denne worktree), ikke `Skill`-værktøjet — for at være sikker på at følge worktreens egen kopi frem for hovedrepoets, samme forsigtighed som `spor/nye1` brugte. Indholdet blev efterfølgende krydstjekket mod `tools/skema.mjs` (den egentlige skemasandhed) undervejs i byggeriet. |
| `parallelt` | Gået forbi | Jeg er allerede ét udpeget spor i en fordelt kørsel (`spor/kand1b`). To producenter, én rapport, ét navnerum i `data/robots/` — at dele opgaven yderligere på flere agenter ville enten kollidere på samme filer eller kræve en genforening bagefter, som jeg selv ville skulle udføre. Samme begrundelse som `FUND-nye1.md` brugte. |
| `grillmig` | Gået forbi | Intet agentbrief sendes videre herfra, og ingen åben beslutning i STATUS.md låses af mig. |
| `impeccable`, `ui-ux-critique`, `critique`, `dataviz` | Gået forbi | Ingen bygget UI eller grafik at kritisere/visualisere i dette spor. |
| `new-project`, `code-review`, `simplify` | Gået forbi | Ingen kode skrives eller ændres — kun YAML-data og rå kildearkiv. |

**Konklusion:** `robotdata` er den rigtige og eneste relevante skill her.

---

## Stopprøver, med citater

Alle fire modeller **bestod** stopprøven — bekræftet firbenet (gående eller hjul-ben-hybrid)
på producentens egne ord.

### MicroRoboTech — MOVENEW T1

> **Meta-keywords:** "Micbot, quadruped robot, DynaCore full-body motion system, ..."
> **Meta-description:** "Micbot's quadruped robot features domestic full-stack independent
> R&D, equipped with DynaCore full-body motion system and DynaForce joint module (70kg
> dynamic load, 200kg static load)..."
> — https://www.micbotics.com/list_13/96.html, hentet 2026-08-24

Hjul-ben-hybrid ("wheeled quadruped robot" / "轮式四足机器人" ifølge China Daily-dækningen af
lanceringen) — tæller efter opgavens egen regel om at hjul-ben-hybrider er firbenede.

### MicroRoboTech — MOVENEW P1

> **Meta-keywords:** "quadruped robot, wheeled legged robot, ... high-payload legged robot"
> **Meta-description:** "All-terrain quadruped robot for industrial inspection, fire
> response, and public safety missions."
> — https://www.micbotics.com/list_12/98.html, hentet 2026-08-24

### GENISOM AI — Gangben L1 (钢镚 L1)

> **Meta-description:** "钢镚L1是智身科技自主研发的首款行业级小型四足机器人..."
> (egen oversættelse: "Gangben L1 er GENISOM AI's selvudviklede første industriklasse
> lille firbenede robot...")
> — https://www.genisomai.com/product-robot/L1, hentet 2026-08-24

Ren gående ("点足"/punktfod) model, ikke hjul-ben.

### GENISOM AI — Gangben L2 (钢镚 L2)

> **Meta-description:** "钢镚L2是智身科技自主研发的新一代行业级小型四足机器人..."
> (egen oversættelse: "Gangben L2 er GENISOM AI's selvudviklede næste-generations
> industriklasse lille firbenede robot...")
> — https://www.genisomai.com/product-robot/L2, hentet 2026-08-24

**VIGTIG PRODUCENT-OPDAGELSE, ikke en del af selve stopprøven, men relevant for begge
poster:** MicroRoboTech har skiftet navn/domæne siden CEO'ens opgave og messerapporten blev
skrevet. `microrobotech.com` omdirigerer nu (301) til `micbotics.com`, og hele det
nuværende site bruger brandnavnet **Micbot**/**MICBOT** — ikke "MicroRoboTech" nogen steder
på det aktive site. `producent:`-feltet i begge YAML-poster bevarer CEO'ens navngivning
("MicroRoboTech"), men rebrandet er dokumenteret i en `noter:`-linje på begge poster, så en
fremtidig søgning efter "MicroRoboTech" ikke løber ind i en mur.

---

## Færdighedskriterium (a) — N leveret, K afvist, dækkende alle firbenede modeller fundet

**Leveret: 4 af 4 navngivne modeller.** Ingen af de to opgavesatte producenter havde en
model, der IKKE bestod stopprøven — i modsætning til forrige runde (Lenovo/TITA).

| Model | Producent | Status | Fil |
|---|---|---|---|
| MOVENEW T1 | MicroRoboTech (Micbot) | Leveret | `data/robots/microrobotech-movenew-t1.yaml` |
| MOVENEW P1 | MicroRoboTech (Micbot) | Leveret | `data/robots/microrobotech-movenew-p1.yaml` |
| Gangben L1 | GENISOM AI | Leveret | `data/robots/genisom-gangben-l1.yaml` |
| Gangben L2 | GENISOM AI | Leveret | `data/robots/genisom-gangben-l2.yaml` |

**Ud over de fire navngivne findes yderligere modeller hos GENISOM AI, IKKE bygget denne
runde — fundet, ikke forglemt:**

| Model | Type | Hvorfor ikke bygget |
|---|---|---|
| 钢镚 L1-W | Hjul-ben-variant af L1 | Uden for opgavens navngivne omfang ("Gangben-serien" var eksplicit L1/L2 i messerapporten); egen produktside findes (`genisomai.com/product-robot/L1-W` / `zsibot.com/L1W`), ikke hentet |
| 钢镚 L1 Maker | Undervisningsudgave af L1 | Samme afgrænsning |
| 钢镚 L2-W, 钢镚 L2-W Ultra | Hjul-ben-varianter af L2 | Har komplette parametersæt i L2-sidens egen JSON (allerede arkiveret i `genisomai-gangben-l2-2026-08-24.html`) — kan bygges uden ny research, hvis CEO'en ønsker det |
| 铜锤 M1 (Tongchui M1) | Selvstændig produktlinje, IKKE "钢镚"/Gangben | Bekræftet firbenet ("智身铜锤 M1 是智身科技首款高负载、轻体型、全防护四足机器人") via WebSearch, men ikke efterprøvet mod rå HTML på samme niveau som L1/L2 |
| 铅球 SP1 (Qiuqiu SP1) | Eksplosionssikker hjul-ben-robot | Samme afgrænsning som M1 |

Ingen af disse fem er "afvist" i betydningen "faldt på stopprøven" — de er alle bekræftet
firbenede efter producentens egne ord i sekundære (WebSearch-baserede) kilder. De er udenfor
denne opgaves eksplicit navngivne omfang ("Gangben-serien" = L1/L2 ifølge messerapporten) og
ikke efterprøvet med samme kildedisciplin (rå HTML, MANIFEST) som de fire leverede poster.

**K = 0 afvist** (stopprøve-fejl). 4 leveret. 5 fundet-men-udenfor-omfang, dokumenteret ovenfor.

---

## Færdighedskriterium (b) — felttal pr. post

Målt med `node tools/validate.mjs --taethed` efter selv-tjek og rettelser:

| Post | Udfyldt | Ikke oplyst | Sum | Tæthed |
|---|---|---|---|---|
| MOVENEW T1 | 21 | 12 | 33 | 64 % |
| MOVENEW P1 | 22 | 11 | 33 | 67 % |
| Gangben L1 | 19 | 14 | 33 | 58 % |
| Gangben L2 | 23 | 10 | 33 | 70 % |

**Gangben L2's 70 % ligger over det hidtidige registrerede loft på 67 % (Ghost Vision 60,
målt 21. aug 2026) — undersøgt særskilt, ikke bare accepteret.** Se selv-review nedenfor for
den fulde gennemgang. Kort sagt: L2's egen produktside er en usædvanligt komplet,
JSON-drevet specifikationskonfigurator (structured data, ikke prosa) — en anden slags
producentside end de fleste andre i kataloget. Alle 23 udfyldte felter er krydstjekket
direkte mod den udtrukne JSON-struktur (se selv-tjek nedenfor). MOVENEW P1's 67 % rammer
præcis det hidtidige loft, ikke over det.

---

## Færdighedskriterium (c) — validate/build

```
node tools/validate.mjs        → 50 fil(er) · 0 fejl · 1 advarsel (præeksisterende, ghost-robotics-vision-60, urørt af mig)
node tools/build.mjs           → Byggede 137 sider. Kort på forsiden: 50 (var 46 før dette spor).
                                  Kildemærker: 651 tal med kilde, 0 uden.
                                  Sekundære kilder: 4 felter (1 ny fra mig: Gangben L1's sdk_sprog;
                                  3 præeksisterende, urørte)
```

---

## Færdighedskriterium (d) — selv-tjek, felt for felt, med tælling

**Metode:** hver post er krydstjekket programmatisk mod den udtrukne kildetabel (fuld
HTML-tabel for T1/P1, fuld JSON-struktur for L1/L2 — udtrukket med Node, ikke aflæst med
øjnene alene), plus manuel gennemgang af hver `advarsel:`-tekst mod den rå kildefil.

| Post | Felter efterprøvet | Fejl fundet | Rettet |
|---|---|---|---|
| MOVENEW T1 | 33 | 0 | — |
| MOVENEW P1 | 33 | 0 | — |
| Gangben L1 | 33 | 2 | Ja, begge |
| Gangben L2 | 33 | 3 | Ja, alle tre |
| **I alt** | **132** | **5** | **5** |

**De fem fejl, i rækkefølge af alvor:**

1. **Gangben L2, `ros2`: en gætning der ikke kunne skelnes fra en måling — den alvorligste.**
   Første udkast satte `ros2: ja`, udledt af at L2's egen side nævner "新一代 RoamerX 智能导航
   系统" og et GitHub-repo (`genisom_roamerx_open`) i samme organisation kræver eksplicit
   "ROS2 Humble Hawksbill". Ved selv-tjek genlæste jeg repoets EGEN README og fandt et afsnit
   "Hardware Deployment" med indholdet **"TODO"** — producenten skriver selv, at koblingen
   mellem dette open source-repo og et fysisk sælgende produkt ikke er dokumenteret endnu.
   Et navnesammenfald plus et repo, der selv siger "TODO" til hardware-udrulning, er en
   gætning, ikke en måling (regel 1). Rettet til `ikke_oplyst` med fuld begrundelse i
   `advarsel:`. `sdk_sprog` byggede på samme svage kæde og blev rettet samtidig.
2. **Gangben L2, `egenvaegt`: fejlagtig operator.** Første udkast skrev `operator: "~"` og en
   advarsel om at vægten var "cirka" — men kildens egen tekst ("整机重量（含电池）: 21 kg")
   har INTET cirka-tegn, i modsætning til målene lige ovenover i samme tabel, som ER markeret
   "约". Rettet: operator fjernet, advarsel korrigeret.
3. **Gangben L1, samme fejl som L2's `egenvaegt`** — samme systematiske antagelse (at hele
   "基础信息"-sektionen delte én cirka-markering) gentaget på den anden post. Rettet på samme
   måde.
4. **Gangben L2, `dataporte`-advarsel: regnefejl.** Skrev at "det femte flystik ikke er
   yderligere specificeret" — men 2×USB3.0 + 1×M12 17PIN + 1×M12 18PIN + 1×4G-kortplads = 5,
   alle fem ER navngivet. Simpel additionsfejl, rettet.
5. **Gangben L2, `dockingstation`-advarsel: ufuldstændig, ikke forkert.** Nævnte kun den
   valgfrie "充电桩（包含自主回充功能）" (autonom genopladning, tilvalg) og glemte, at kilden
   OGSÅ har en separat, standardmonteret "充电座" (samme som L1 har). `vaerdi: ja` var
   allerede korrekt; advarslen er udvidet til at nævne begge niveauer.

**Desuden efterprøvet uden fejl:** alle fire stopprøve-citater (byte-for-byte grep mod rå
HTML, ikke kun visuel læsning), begge anvendelse-citater (samme metode), alle priscitater,
og de to GitHub-citater brugt under den nye kilderegel (verificeret i den arkiverede rå
GitHub-HTML, ikke kun i WebFetch-værktøjets sammendrag).

---

## Regelændringen midt i arbejdet — hvordan den blev brugt

CEO'ens nye regel (producentens PDF'er/manualer/udviklerdokumentation tæller nu, mod
`kildetype: sekundaer`) blev anvendt tre steder:

1. **MicroRoboTechs support-side** (`micbotics.com/support/`) blev undersøgt for
   PDF-datablade. To rigtige PDF'er fandtes (T1 og P1, 13,2 MB og 7,2 MB) og blev hentet, men
   **kunne ikke læses** med de værktøjer, sessionen havde adgang til: `Read`-værktøjets
   PDF-understøttelse kræver `pdftoppm`/poppler-utils (ikke installeret på maskinen),
   `WebFetch` gav HTTP 403 på filerne, og et forsøg på at trække tekst direkte ud af PDF'ens
   komprimerede indholdsstrømme med Python + zlib fandt ingen læsbare tekstoperatorer (filerne
   er formentlig bygget som billeder/vektorgrafik). **Ingen data fra disse to PDF'er er brugt
   i posterne** — kun arkiveret som bevis for forsøget. De øvrige dokumenter på samme side
   ("SDK Development Guide", "Operation Guide") havde tomme download-links på hentetidspunktet.
2. **GENISOM AI's GitHub-organisation** (`github.com/zsibot`, linket direkte fra
   `genisomai.com/download.html`) gav ét brugbart resultat: `genisom_L1_sdk` er eksplicit
   navngivet den officielle L1-SDK og oplyser sproget (C++20) — brugt til `sdk_sprog` på
   Gangben L1, mærket `kildetype: sekundaer`.
3. **Samme GitHub-organisations `genisom_roamerx_open`-repo** blev undersøgt for samme formål
   på Gangben L2, men **afvist efter selv-tjek** — se fejl nr. 1 ovenfor. Det er det klareste
   eksempel i dette spor på, hvorfor selv-tjekket ikke er en formalitet: uden det ville en
   plausibel, men ubekræftet, "ja" være landet i data.

---

## Billedkandidater (ingen `billede:`-blokke bygget, som instrueret)

| Model | Kandidat-URL | Vurderet med øjne? |
|---|---|---|
| MOVENEW T1 | `https://www.micbotics.com/public/upload/image/20260206/1770339654771677.jpg` (banner, hero) | Nej — kun fundet, ikke bedømt efter billedbaren |
| MOVENEW T1 | `https://www.micbotics.com/public/upload/image/20260206/1770348594418464.jpg` (banner, 2. slide) | Nej |
| MOVENEW P1 | `https://www.micbotics.com/public/upload/image/20260228/1772262637724925.jpg` (banner, hero) | Nej |
| MOVENEW P1 | `https://www.micbotics.com/public/upload/image/20260228/1772262727369959.jpg` (banner, 2. slide) | Nej |
| Gangben L1 | `https://qiniu.mfdemo.cn/zhishen/2026/05/22/YTNh7u75LhJRu.webp` (hero, alt="钢镚 L1") | Nej |
| Gangben L2 | `https://qiniu.mfdemo.cn/zhishen/2026/06/29/EJNmPTLMMjRiE.webp` (hero, alt="钢镚 L2") | Nej |
| Gangben L2 | `https://qiniu.mfdemo.cn/zhishen/2026/06/29/cWpR0EXnqNQAr.webp` (navigationskort-thumbnail) | Nej |

Ingen af disse er hentet til `media/_kilder/` som billedfiler (kun sidernes HTML er
arkiveret) — en fremtidig billedrunde skal selv hente og bedømme dem efter billedbaren i
`robotdata`-skillen (hel maskine, intet UI, overlever kvadratisk beskæring).

---

## Færdighedskriterium (e) — gitignorerede nye filer, fuld sti

Alle under `C:\Praktik\websites\udstilling-wt-kand1b\media\_kilder\raa-kand1b-2026-08-24\`,
bekræftet gitignoreret med `git check-ignore -v` (regel `.gitignore:13:media/_kilder/**`):

1. `MANIFEST.tsv`
2. `genisomai-aboutus-2026-08-24.html`
3. `genisomai-gangben-l1-2026-08-24.html`
4. `genisomai-gangben-l2-2026-08-24.html`
5. `genisomai-home-2026-08-24.html`
6. `github-zsibot-genisom_L1_sdk-2026-08-24.html`
7. `github-zsibot-genisom_roamerx_open-2026-08-24.html`
8. `github-zsibot-org-2026-08-24.html`
9. `micbotics-movenew-p1-datasheet-2026-08-24.pdf`
10. `micbotics-movenew-p1-en-2026-08-24.html`
11. `micbotics-movenew-t1-cn-2026-08-24.html`
12. `micbotics-movenew-t1-datasheet-2026-08-24.pdf`
13. `micbotics-movenew-t1-en-2026-08-24.html`
14. `micbotics-support-2026-08-24.html`
15. `microrobotech-t1-homepage-redirect-2026-08-24.headers.txt`
16. `microrobotech-t1-homepage-redirect-2026-08-24.html`

Ingen af dem er sporet af git — de forsvinder ved en almindelig `git worktree remove`. Skal
en af de to uparsede PDF'er eller GitHub-arkiverne genbesøges (fx hvis poppler installeres
senere), skal mappen bevares eller kopieres ud af worktreen først.

---

## Selv-review — hvad jeg er mest usikker på

**Hvor oversættelsen fra kinesisk er mest usikker**, i faldende rækkefølge:

1. **`anvendelse`-feltets kategori-mapping er et fortolkningsvalg, ikke en oversættelse.**
   At oversætte "科研教育" til `forskning_udvikling` (og ikke også `forbruger_uddannelse`) er
   en afgørelse om, hvorvidt konteksten er faglig forskning eller forbrugerprodukt — begge
   Gangben-poster har denne usikkerhed noteret direkte i `anvendelse.note`.
2. **`egenvaegt`-etikettens tvetydighed hos MicroRoboTech.** T1's kildeetiket er bogstaveligt
   "整机电池重量" (helmaskine-batteri-vægt) — en sammenblandet etikette, jeg har fortolket som
   "totalvægt inkl. batteri" ud fra placeringen i tabellen (ved siden af målene, ikke under
   "Electrical Parameters"). Det er den eneste tildeling i hele dette spor, jeg IKKE kunne
   bekræfte 100 % ved selv-tjek, fordi kilden selv er tvetydig — ikke fordi jeg læste forkert.
3. **`forhindring_enkelt: 800mm` på MOVENEW P1** er usædvanligt stort (dobbelt så højt som
   T1's tilsvarende felt) under en etiket ("Max Climbing Ability"), der ligger lige ved siden
   af to andre rækker med præcis samme tal (45°) under to forskellige etiketter. Jeg vurderer
   selv, at dette KAN være en skrivefejl eller skabelonfejl hos producenten — men har bevidst
   IKKE rettet det, fordi jeg ikke har grundlag for at vide, hvilket af de to tal der er
   forkert (hvis noget er). Det er den post-værdi i hele leverancen, jeg har mindst tillid til,
   selvom den er transskriberet korrekt.
4. **Gangben L2's tæthed (70 %) er højere end noget andet i kataloget.** Jeg har begrundet
   hvorfor ovenfor (usædvanligt struktureret producentside) og krydstjekket alle 23 felter
   programmatisk mod den udtrukne JSON — men jeg kan ikke udelukke, at en anden læser ville
   vurdere et eller to af de "bonus"-felter (fx `forhindring_enkelt` fra et separat
   marketing-kapacitetskort på samme side, ikke fra selve specifikationstabellen) som for
   løst koblet til at tælle med. Jeg har valgt at medtage dem, fordi de stadig er producentens
   egne ord med kilde og dato, blot fra et andet sted på samme side end hovedtabellen.
5. **De fem GENISOM-modeller, jeg IKKE byggede** (L1-W, L1 Maker, L2-W, L2-W Ultra, Tongchui
   M1, Qiuqiu SP1), hviler alle på WebSearch-sammendrag, ikke på rå HTML jeg selv har
   efterprøvet med `grep`. Deres firbenet-status er sandsynligvis korrekt, men har ikke samme
   bevisstyrke som de fire leverede poster.

**Hvad jeg ikke nåede:** at hente og vurdere billedkandidaterne efter billedbaren (bevidst
udeladt, som instrueret). At bygge de fem yderligere GENISOM-modeller (bevidst afgrænset til
opgavens navngivne "Gangben-serien" = L1/L2). At læse de to producent-PDF'er (værktøjsfælde,
dokumenteret ovenfor, ikke et forsøg der blev opgivet for tidligt — tre forskellige metoder
blev afprøvet).
