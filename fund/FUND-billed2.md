# FUND-billed2 — billedrunde for de ni nyeste robotposter

Spor: `spor/billed2`, worktree `C:\Praktik\websites\udstilling-wt-billed2`. Opgave fra
orkestratoren 24. aug 2026: gennemfør billedporten (indsamling + dom med øjne, jf.
`robotdata`-skillens billedbar) for de ni seneste poster — `pudu-d5`, `pudu-d5-w`,
`yufan-lingmao-cyvet`, `astrall-dynamics-hypertron-t01`, `cvte-maxhub-x7`,
`microrobotech-movenew-t1`, `microrobotech-movenew-p1`, `genisom-gangben-l1`,
`genisom-gangben-l2`. De otte ældre poster, hvis billeder blev slettet i den forrige
billedport-runde (`spor/billedport`), rører jeg ikke — det er en senere runde.

**Resultat i korte træk: alle ni robotter fik et bestået billede.** 25 kandidater blev
hentet og set med øjne, 9 bestod (én pr. robot), 16 blev afvist eller fravalgt til fordel
for et bedre alternativ, hver med begrundelse nedenfor.

---

## 0. Skill-vurdering

| Skill | Valgt? | Begrundelse |
|---|---|---|
| `robotdata` | **Valgt** | Læst direkte fra disk (`.claude/skills/robotdata/SKILL.md` i denne worktree), som opgaven bad om — særligt billedbar-afsnittet (L82–99), citeret og fulgt punkt for punkt nedenfor. Ikke kaldt via `Skill`-værktøjet, for at være sikker på at bruge worktreens egen kopi. |
| `parallelt` | Gået forbi | Jeg er allerede det uddelegerede spor (`spor/billed2`) i en fordeling, orkestratoren har foretaget. Ni robotter fra fire producenter er researchet sekventielt af én agent — at splitte yderligere ville kræve at starte subagenter fra inde i mit eget spor, hvilket opgaven ikke bad om, og som ville risikere at flere agenter skrev til samme `MANIFEST.tsv` samtidig (præcis den fælde `parallelt`-skillen advarer imod). |
| `grillmig` | Gået forbi | Intet brief sendes videre herfra, og jeg låser ingen åben beslutning i STATUS.md. |
| `impeccable`, `ui-ux-critique`, `critique`, `dataviz` | Gået forbi | Ingen UI eller sammenligningsgrafik bygget eller kritiseret — ren billedindsamling og -dom mod data. |
| `new-project`, `code-review`, `simplify` | Gået forbi | Ingen kode ændret. |

---

## 1. Metode — hvordan billedbaren blev efterprøvet

Billedbarens centrale advarsel er at et kort bruger `object-fit:cover` i et kvadratisk
felt, og at "et motiv klistret i billedets ene ende bliver blankt på kortet." I stedet
for at anslå det ved øjemål alene brugte jeg Python/PIL (tilgængelig på maskinen,
`/c/Users/thyge/AppData/Local/Programs/Python/Python314/python.exe`) til at **rendere det
faktiske kvadratiske center-crop** for hver reel kandidat og se resultatet med øjne, før
jeg dømte — i tråd med den globale regel "mål frem for at skøn". Det ændrede facit to
gange: Astralls strandfoto virkede ved øjemål til at miste ~20 % af robotten i højre
side, men det rigtige beskæringstjek viste alle fire hjul intakt; Yufans desktop-hero
virkede tættere på grænsen end det faktisk var — beskæringen viste bagkroppen skåret
rent af. Beskærings-forhåndsvisningerne var kun et diagnoseværktøj og er slettet igen
efter brug; de indgår ikke i leverancen.

---

## 2. Dom pr. robot

### Pudu D5

| Kandidat | Hentet fil | Dom |
|---|---|---|
| `store.pudurobotics.com/.../D5_eeeb....png` | `pudu-d5-1.png` (800×800) | **BESTÅET** — hele maskinen midt i et rent hvidt studiobillede, allerede kvadratisk (ingen beskæring sker overhovedet). Intet UI, ingen infografik. "D5" trykt på benet er producentens egen modelmærkning, ikke en marketing-overlay. |

**Billedbar, punkt for punkt:** hele maskinen tydeligt hovedmotiv ✓ · studiofoto ✓ ·
ingen indbrændt marketingtekst ✓ · intet UI ✓ · intet logo ud over fysisk modeltekst ✓ ·
overlever kvadratisk crop ✓ (allerede 1:1, intet at beskære).

### Pudu D5-W

| Kandidat | Hentet fil | Dom |
|---|---|---|
| `store.pudurobotics.com/.../D5W.jpg` | `pudu-d5-w-1.jpg` (800×800) | **BESTÅET** — samme studieopstilling som D5, hjul-ben-varianten tydeligt vist. Allerede kvadratisk. |

Samme kriterier som D5, alle bestået.

### Yufan Lingmao Cyvet

| Kandidat | Hentet fil | Dom |
|---|---|---|
| Desktop-hero, `fe-cloud.uni-ubi.com/.../1786933501774-robot.jpg` | `yufan-lingmao-cyvet-1.jpg` (3840×2000) | **AFVIST** — robotten står i højre halvdel af et bredformat-banner. Renderet center-crop skar bagkroppen/bagbenene rent af (verificeret med faktisk beskæringsforhåndsvisning, ikke kun anslået). |
| Mobil-hero, `.../1786933501763-robot-mobile.jpg` | `yufan-lingmao-cyvet-2-mobile.jpg` (750×1140) | **BESTÅET** — samme motiv (robot på bjergtop), men i portræt-format hvor robotten sidder i den lodrette midte. Renderet crop viser hele maskinen inkl. alle fire ben og antenner. Feltfoto-agtig, ingen UI, ingen indbrændt tekst (kun et lille fysisk logo på robottens "ansigt"). |

**Billedbar, punkt for punkt (den valgte fil):** hele maskinen hovedmotiv ✓ · feltfoto
(dramatisk bjergtop-scene, men fysisk plausibel opstilling) ✓ · ingen indbrændt
marketingtekst ✓ · intet UI ✓ · overlever kvadratisk crop ✓ (verificeret ved rendering).

### Astrall Dynamics Hypertron-T01

Fire kandidater fundet og hentet — herunder afklaring af en usikkerhed fra
`fund/FUND-kand2.md`: rapporten dér flaggede at billedfilerne hedder "a01-shoux..." mens
produktet hedder "Hypertron-T01", og var usikker på om det var samme fysiske maskine.
**Afklaret i denne runde:** astralldynamics.com's egen forside har en hero-sektion, hvis
`<h3>`-overskrift ordret siger **"Hypertron-T01"**, koblet direkte til baggrundsbilledet
`banner1.png` — samme "a01"-filnavnekonvention. Det er samme produkt, "a01" er blot et
internt aktiv-navn fra før lancering.

| Kandidat | Hentet fil | Dom |
|---|---|---|
| Parkfoto (`.../product/a01-shoux1.png`) | `astrall-dynamics-hypertron-t01-1.png` (2560×1250) | **AFVIST** — ægte fotografi (naturlig dybdeskarphed, ikke et render), men robotten står langt til venstre i et bredformat-billede. Renderet crop skar ca. en tredjedel af robotbredden væk i højre side, inkl. et helt bagben. |
| Kompositbillede med tal (`.../product/a01-shoux-hexin.png`) | `astrall-dynamics-hypertron-t01-2.png` (2560×1024) | **AFVIST** — eksplicit infografik: fem delbilleder med indbrændt kinesisk tekst og tal (7 m/s, 45°, 200 kg, 300 N·m, 25 cm). Rammer direkte billedbarens AFVIST-kategori "infografikker med tekst". |
| Rumscene (`.../index/banner1.png`, forsidens hero) | `astrall-dynamics-hypertron-t01-3-banner.png` (2560×1440) | **AFVIST, kvalitetsvalg snarere end hård regel** — renderet crop viser faktisk hele maskinen med rigelig margen (overlever kvadratisk beskæring fint). Men motivet er en fantasifuld rum-/månelandskabskomposit (stjernehimmel, planet i baggrunden) — hverken "studio-" eller "feltfoto" i ordets almindelige betydning, snarere konceptkunst. Fravalgt til fordel for en mere plausibel feltopstilling, når en sådan fandtes (se næste række). |
| Strandfoto (`.../index/index-a01-show.png`) | `astrall-dynamics-hypertron-t01-4-show.png` (2560×1250) | **BESTÅET** — robot på en klippe ved en strand, realistisk feltopstilling. Renderet crop (ikke kun anslået) viser hele maskinen: krop, hoved, begge antenner og alle fire hjul intakt med margen til begge sider. "ASTRALL Dynamics" + kinesisk undertekst trykt direkte på kabinettet er fysisk modelmærkning, ikke en grafisk overlay. |

**Billedbar, punkt for punkt (den valgte fil):** hele maskinen hovedmotiv ✓ · feltfoto ✓ ·
ingen indbrændt marketingtekst ✓ (fysisk kabinet-tekst er ikke det samme) · intet UI ✓ ·
overlever kvadratisk crop ✓ (verificeret ved rendering — min første øjemåls-vurdering
anslog fejlagtigt et ca. 20 % tab i højre side; det faktiske renderede crop viste
robotten fuldt intakt).

### CVTE MAXHUB X7

FUND-kand2 fandt ingen brugbar billedkandidat for X7 ("kan ikke skelnes fra hinanden uden
at åbne dem visuelt"). Jeg hentede selve produktsiden og en nyhedsartikel og fandt syv
kandidater i alt.

| Kandidat | Hentet fil | Dom |
|---|---|---|
| Trappe-scene (produktside, "严苛地形"-kort) | `cvte-maxhub-x7-terrain.jpg` (1196×976) | **BESTÅET** — robot på en trappe, næsten allerede kvadratisk. Renderet crop viser hele maskinen med god margen. "MAXHUB X7" trykt på kabinettet, ingen overlay. |
| Regn-scene ("尘雨无惧"-kort) | `cvte-maxhub-x7-weather.jpg` (1196×572) | Gyldigt alternativ, **ikke valgt** — også en ren feltopstilling, men bredformat gør beskæringsmargen mindre rummelig end trappebilledet. Fravalgt for redundans, ikke for fejl. |
| Undvigelses-scene med kloakdæksel-pil ("慧眼如炬"-kort) | `cvte-maxhub-x7-vision.jpg` (976×1580) | **AFVIST** — en stor grafisk hvid pil er lagt oven på fotoet som retningsanvisning. Ikke tekst, men en tydelig grafisk annotation, der dominerer den nederste halvdel af billedet — samme ånd som "infografik", fravalgt. |
| Eksploderet komponent-diagram ("百变形态"-kort) | `cvte-maxhub-x7-modular.jpg` (976×1580) | **AFVIST** — eksplicit infografik: robotten set ovenfra med fire tekstbokse (激光雷达/云台/机械臂/气体传感器) og streger ud til komponenter. |
| Messefoto, tæt på robotten | `cvte-maxhub-x7-news-1.jpg` (1080×786) | **AFVIST** — ægte pressefoto fra lanceringen (WRC 2025), men mindst 15 mennesker fylder mere end halvdelen af billedet omkring robotten. Ikke et rent produkt- eller feltfoto. |
| Messefoto, bredere vinkel | `cvte-maxhub-x7-news-2.jpg` (1080×810) | **AFVIST** — samme crowd-problem, og en anden robotmodel (en humanoid) er synlig i baggrunden. Rammer "flere modeller i billedet". |
| Substation-scene (nyhedsartiklens tredje billede) | `cvte-maxhub-x7-news-3.png` (900×507) | Gyldigt alternativ, **ikke valgt** — robot alene ved en transformerstation, ingen mennesker, ingen overlay. Lige så brugbar som trappebilledet; trappebilledet blev valgt fordi det er tættere på kvadratisk og derved har mere beskæringsmargen. God reserve hvis trappebilledet skal skiftes ud senere. |

**Billedbar, punkt for punkt (den valgte fil):** hele maskinen hovedmotiv ✓ · feltfoto
(renderet trappescene) ✓ · ingen indbrændt marketingtekst ✓ · intet UI ✓ · overlever
kvadratisk crop ✓ (verificeret ved rendering).

### MicroRoboTech MOVENEW T1

| Kandidat | Hentet fil | Dom |
|---|---|---|
| Banner-hero, slide 1 (`.../20260206/1770339654771677.jpg`) | `microrobotech-movenew-t1-1.jpg` (2880×1035) | **AFVIST** — robotten fylder kun den højre ~30 % af et meget bredt banner med tomt farvegradient-felt til venstre. Center-crop rammer den tomme baggrund, ikke robotten — netop det billedbaren advarer imod. |
| Banner-hero, slide 2 | `microrobotech-movenew-t1-2.jpg` (2880×885) | **AFVIST** — samme banner-problem, robotten sidder tættere på midten men bagerste hjul risikerer at blive skåret af; fravalgt af samme grund som slide 1 uden yderligere test, da et klart bedre alternativ allerede var fundet. |
| Produktkort-thumbnail (`.../20260324/1774349658297868.jpg`, fra sitets produktliste) | `microrobotech-movenew-t1-3-thumb.jpg` (4096×2906) | **BESTÅET** — rent sort studiobillede, robotten centreret, renderet crop viser hele maskinen med rigelig margen til alle sider. "MICRO ROBOTECH" og modelnavn trykt fysisk på kabinettet. |

**Billedbar, punkt for punkt (den valgte fil):** hele maskinen hovedmotiv ✓ · studiofoto ✓
· ingen indbrændt marketingtekst ✓ · intet UI ✓ · overlever kvadratisk crop ✓
(verificeret ved rendering).

### MicroRoboTech MOVENEW P1

| Kandidat | Hentet fil | Dom |
|---|---|---|
| Banner-hero, slide 1 (`.../20260228/1772262637724925.jpg`) | `microrobotech-movenew-p1-1.jpg` (1920×690) | **AFVIST** — samme brede banner-format som T1, robotten i højre del, tom baggrund til venstre. |
| Banner-hero, slide 2 | `microrobotech-movenew-p1-2.jpg` (1920×690) | **AFVIST** — samme problem. |
| Produktkort-thumbnail (`.../20260324/1774349921913635.jpg`) | `microrobotech-movenew-p1-3-thumb.jpg` (4096×2906) | **BESTÅET** — samme rene sorte studieopstilling som T1's thumbnail, robotten centreret. Renderet crop bekræfter hele maskinen intakt. |

Samme kriterier som T1, alle bestået for den valgte fil.

### GENISOM Gangben L1

| Kandidat | Hentet fil | Dom |
|---|---|---|
| Bjergtop-hero (`qiniu.mfdemo.cn/.../YTNh7u75LhJRu.webp`) | `genisom-gangben-l1-1.webp` (809×1784) | **Fravalgt, ikke pga. beskæring** — renderet crop viser faktisk hele maskinen intakt (alle fire ben synlige). Fravalgt fordi motivet er en stærkt iscenesat, dramatisk bjergtop-solopgangsscene, hvor robotten er lille i forhold til det store landskab — nærmere konceptkunst end et troværdigt studio- eller feltfoto, og et markant renere alternativ fandtes (næste række). |
| Produktkort-thumbnail (`.../dnPrvm80umDOP.webp`, fra sitets egen produktmenu) | `genisom-gangben-l1-2-thumb.webp` (640×640) | **BESTÅET** — rent hvidt studiobillede, allerede kvadratisk, hele maskinen tydeligt hovedmotiv. Intet UI, ingen tekst. |

**Billedbar, punkt for punkt (den valgte fil):** hele maskinen hovedmotiv ✓ · studiofoto ✓
· ingen indbrændt marketingtekst ✓ · intet UI ✓ · overlever kvadratisk crop ✓ (allerede
1:1).

### GENISOM Gangben L2

| Kandidat | Hentet fil | Dom |
|---|---|---|
| Stormvejr-hero (`.../EJNmPTLMMjRiE.webp`) | `genisom-gangben-l2-1.webp` (1024×1792) | **Fravalgt, samme begrundelse som L1's bjergtop-billede** — renderet crop viser faktisk hele maskinen (fire hjul, krop, front) intakt, men motivet er en dramatisk stormscene med vandsprøjt og lyn-agtig belysning, nærmere konceptkunst end studio-/feltfoto. Fravalgt til fordel for det rene studiokort. |
| Produktkort-thumbnail (`.../cWpR0EXnqNQAr.webp`, fra sitets egen produktmenu) | `genisom-gangben-l2-2.webp` (640×640) | **BESTÅET** — samme rene studieopstilling som L1's thumbnail. |

Samme kriterier som L1, alle bestået for den valgte fil.

---

## 3. Facit — tælling

- **N = 25 kandidater** vurderet med øjne (heraf visse allerede fundet i
  `fund/FUND-kand1a.md`/`kand1b.md`/`kand2.md`, resten fundet i denne runde).
- **M = 25 hentet** til `media/robotbilleder/` (alle 25 er reelt hentede filer, ingen
  vurdering skete kun på URL-niveau uden download).
- **K = 9 bestået** — én pr. robot, alle ni robotter fik en `billede:`-blok. Ingen robot
  faldt tilbage til målepladen denne runde.
- **J = 16 afvist eller fravalgt**, hver med begrundelse i tabellerne ovenfor. Af de 16:
  - 11 fejlede billedbaren direkte (bredformat-banner med tomt felt ×6, infografik med
    tekst ×2, grafisk pil-overlay ×1, menneskemængde ×1, mennesker + fremmed robotmodel
    ×1).
  - 3 var stilistisk fravalgt (dramatisk konceptkunst-agtige "hero"-composits, der rent
    faktisk overlevede beskæringstesten, men blev vurderet mindre troværdige end et
    tilgængeligt studio- eller feltfoto).
  - 2 var gyldige, ubrugte reservekandidater ved CVTE (regn-scene, substation-scene) —
    fravalgt for redundans, ikke for fejl.

---

## 4. Nye gitignorerede filer (leveres via denne liste, committes ikke)

### `media/robotbilleder/` — 25 hentede kandidatfiler (arkiv)

```
astrall-dynamics-hypertron-t01-1.png
astrall-dynamics-hypertron-t01-2.png
astrall-dynamics-hypertron-t01-3-banner.png
astrall-dynamics-hypertron-t01-4-show.png
cvte-maxhub-x7-modular.jpg
cvte-maxhub-x7-news-1.jpg
cvte-maxhub-x7-news-2.jpg
cvte-maxhub-x7-news-3.png
cvte-maxhub-x7-terrain.jpg
cvte-maxhub-x7-vision.jpg
cvte-maxhub-x7-weather.jpg
genisom-gangben-l1-1.webp
genisom-gangben-l1-2-thumb.webp
genisom-gangben-l2-1.webp
genisom-gangben-l2-2.webp
microrobotech-movenew-p1-1.jpg
microrobotech-movenew-p1-2.jpg
microrobotech-movenew-p1-3-thumb.jpg
microrobotech-movenew-t1-1.jpg
microrobotech-movenew-t1-2.jpg
microrobotech-movenew-t1-3-thumb.jpg
pudu-d5-1.png
pudu-d5-w-1.jpg
yufan-lingmao-cyvet-1.jpg
yufan-lingmao-cyvet-2-mobile.jpg
```

Alle fulde stier: `C:\Praktik\websites\udstilling-wt-billed2\media\robotbilleder\<filnavn>`.
Der ligger desuden en `_scratch/`-undermappe med rå HTML-sidekopier brugt til at finde
billed-URL'er — rent arbejdsmateriale, ikke en del af leverancen, kan slettes uden tab.

### `assets/fotos/fabrikant/` — 9 web-klare kopier (samme navnekonvention som de 37 eksisterende)

```
astrall-dynamics-hypertron-t01.png
cvte-maxhub-x7.jpg
genisom-gangben-l1.webp
genisom-gangben-l2.webp
microrobotech-movenew-p1.jpg
microrobotech-movenew-t1.jpg
pudu-d5-w.jpg
pudu-d5.png
yufan-lingmao-cyvet.jpg
```

Alle er byte-identiske kopier af den valgte kandidatfil (samme konvention som de 37
eksisterende — jf. `raion-robotics-raibo2.jpg`, der er en eksakt kopi af sit
manifest-arkiv, bekræftet ved at sammenligne byte-størrelser). Ingen beskæring eller
efterbehandling er foretaget på de leverede filer — kun *vurderet* mod en renderet
beskæringsforhåndsvisning, som blev slettet efter brug.

### `media/robotbilleder/MANIFEST.tsv` — 25 nye rækker (DELTA, linje 221–245)

Filen havde 220 linjer (219 data + header) ved start, har 245 nu. **Kun append** —
ingen eksisterende linje er rørt eller omnummereret. De 25 nye rækker (kolonnerne er
`slug, filnavn, billede_url, side_url, http_status, hentet_utc, sha256, bytes,
pixelmaal, indhold_gaet, rang`, `rang=1` for den valgte fil pr. robot, `rang=0` for
øvrige kandidater):

```
pudu-d5	pudu-d5-1.png	https://store.pudurobotics.com/cdn/shop/files/D5_eeebd6c0-5fa4-4689-808e-a4ab22b728c7.png	https://store.pudurobotics.com/products/pudu-d5	200	2026-08-24T20:46:51.000Z	4ee75b0503d907053c720969c1026fee024a9925b779f18f482c063ba6b9e5e3	204287	800x800	produktbillede	1
pudu-d5-w	pudu-d5-w-1.jpg	https://store.pudurobotics.com/cdn/shop/files/D5W.jpg	https://store.pudurobotics.com/products/pudu-d5	200	2026-08-24T20:46:51.000Z	22b33ca27259fac737b215203caf1f2a386233ecd1a1d549c36c4ed0d08b1e5e	43138	800x800	produktbillede	1
microrobotech-movenew-t1	microrobotech-movenew-t1-1.jpg	https://www.micbotics.com/public/upload/image/20260206/1770339654771677.jpg	https://www.micbotics.com/list_13/96.html	200	2026-08-24T20:46:59.000Z	8f084a1ea285a58d9e529bdd4e18937ea18162db0dcd67570b704e485ece5df3	766065	2880x1035	banner	0
microrobotech-movenew-t1	microrobotech-movenew-t1-2.jpg	https://www.micbotics.com/public/upload/image/20260206/1770348594418464.jpg	https://www.micbotics.com/list_13/96.html	200	2026-08-24T20:47:01.000Z	0d3b0b51e79eb38ddab644ed7eed528b1258a30e1ead2ef57d2b849495c31284	741068	2880x885	banner	0
microrobotech-movenew-t1	microrobotech-movenew-t1-3-thumb.jpg	https://www.micbotics.com/public/upload/image/20260324/1774349658297868.jpg	https://www.micbotics.com/list_13/96.html	200	2026-08-24T20:49:29.000Z	a48a5372f272390fa87bb386f16d8281e610e9601ffbfd8eeeabbd0ce35fe113	310580	4096x2906	produktbillede	1
microrobotech-movenew-p1	microrobotech-movenew-p1-1.jpg	https://www.micbotics.com/public/upload/image/20260228/1772262637724925.jpg	https://www.micbotics.com/list_12/98.html	200	2026-08-24T20:47:02.000Z	ee82258766ca1b7c5b1a023ad525f15e2a6f14c24fc58172ab01bfda06e66ad0	447641	1920x690	banner	0
microrobotech-movenew-p1	microrobotech-movenew-p1-2.jpg	https://www.micbotics.com/public/upload/image/20260228/1772262727369959.jpg	https://www.micbotics.com/list_12/98.html	200	2026-08-24T20:47:03.000Z	b7a103d28d0deb0e627ad66ab99d2c9cd09a5575b922c81394524bbb76409314	567706	1920x690	banner	0
microrobotech-movenew-p1	microrobotech-movenew-p1-3-thumb.jpg	https://www.micbotics.com/public/upload/image/20260324/1774349921913635.jpg	https://www.micbotics.com/list_12/98.html	200	2026-08-24T20:49:30.000Z	17cc0a4455b01e3e4819b97ceec01b9209ae49bdcf24ed3def0808ff67bb39a0	336966	4096x2906	produktbillede	1
genisom-gangben-l1	genisom-gangben-l1-1.webp	https://qiniu.mfdemo.cn/zhishen/2026/05/22/YTNh7u75LhJRu.webp	https://www.genisomai.com/product-robot/L1	200	2026-08-24T20:47:06.000Z	1b2daf16be892632ab4d27bdb34573c101c73652bf074d9653508ff053abd027	78232	809x1784	banner	0
genisom-gangben-l1	genisom-gangben-l1-2-thumb.webp	https://qiniu.mfdemo.cn/zhishen/2026/05/22/dnPrvm80umDOP.webp	https://www.genisomai.com/product-robot/L1	200	2026-08-24T20:50:54.000Z	955f6bb22c91713cce4564489a7077a608eb3c25bd1a164e64bca9e41476b9e5	16124	640x640	produktbillede	1
genisom-gangben-l2	genisom-gangben-l2-1.webp	https://qiniu.mfdemo.cn/zhishen/2026/06/29/EJNmPTLMMjRiE.webp	https://www.genisomai.com/product-robot/L2	200	2026-08-24T20:47:09.000Z	a36e4a2060e9dd570b4b830e9442009588a512f3127f26b703dfb233c42ea58f	156040	1024x1792	banner	0
genisom-gangben-l2	genisom-gangben-l2-2.webp	https://qiniu.mfdemo.cn/zhishen/2026/06/29/cWpR0EXnqNQAr.webp	https://www.genisomai.com/product-robot/L2	200	2026-08-24T20:47:10.000Z	83095cc59c3c75360037140abccc721148a07fc98ebd6c849783f17bc80ee627	17326	640x640	produktbillede	1
yufan-lingmao-cyvet	yufan-lingmao-cyvet-1.jpg	https://fe-cloud.uni-ubi.com/image/1786933501774-robot.jpg	https://www.uniubi.com/embodied-ai/robot	200	2026-08-24T20:47:16.000Z	7b213b9a175ef1f02c3b049c7fe796dccd1a80eb14c063cdae4356674a5f61df	661437	3840x2000	banner	0
yufan-lingmao-cyvet	yufan-lingmao-cyvet-2-mobile.jpg	https://fe-cloud.uni-ubi.com/image/1786933501763-robot-mobile.jpg	https://www.uniubi.com/embodied-ai/robot	200	2026-08-24T20:47:17.000Z	940ab9058e2600d7267e9cc0154e2163a0011597d3bbf885f94ca7f4bb7e1d26	91477	750x1140	feltfoto	1
astrall-dynamics-hypertron-t01	astrall-dynamics-hypertron-t01-1.png	https://astrall.oss-cn-shenzhen.aliyuncs.com/office/img/product/a01-shoux1.png	https://www.astralldynamics.com/project-Hypertron-T01.html	200	2026-08-24T20:47:21.000Z	0bfbb2cfd11e54973b8aac974e61f1eaef7cf0ab36a0af077be4b4f23991fce4	4447879	2560x1250	feltfoto	0
astrall-dynamics-hypertron-t01	astrall-dynamics-hypertron-t01-2.png	https://astrall.oss-cn-shenzhen.aliyuncs.com/office/img/product/a01-shoux-hexin.png	https://www.astralldynamics.com/project-Hypertron-T01.html	200	2026-08-24T20:47:24.000Z	9d1e188a378c9867d2fd9ac8736170916d29c1fe627bd13afacd01b5f5d82e55	4076261	2560x1024	infografik	0
astrall-dynamics-hypertron-t01	astrall-dynamics-hypertron-t01-3-banner.png	https://astrall.oss-cn-shenzhen.aliyuncs.com/office/img/index/banner1.png	https://www.astralldynamics.com/	200	2026-08-24T20:52:52.000Z	1cb0a8d1f4cdb3f1fea9da1f953a351b2aae475e2939c27849bc4f3f4774261b	5049184	2560x1440	banner	0
astrall-dynamics-hypertron-t01	astrall-dynamics-hypertron-t01-4-show.png	https://astrall.oss-cn-shenzhen.aliyuncs.com/office/img/index/index-a01-show.png	https://www.astralldynamics.com/	200	2026-08-24T20:52:54.000Z	50db5b142fddb3d8e049710580cf262d76393ed31583ec6a2316ce5f71d50ec5	4232730	2560x1250	feltfoto	1
cvte-maxhub-x7	cvte-maxhub-x7-terrain.jpg	https://cos-pro-pub.cvtestatic.com/cvte-official-website/uwiwpmximinhnhlwhuxpwmyhzyhhihhh	https://www.cvte.com/product/quadrupedrobot	200	2026-08-24T20:48:16.000Z	7960a2e99158085b5f11be06f8d5b61e249e03bcacc6636bead8b058e690b0d9	66868	1196x976	produktbillede	1
cvte-maxhub-x7	cvte-maxhub-x7-weather.jpg	https://cos-pro-pub.cvtestatic.com/cvte-official-website/uwiwouyjminhnhlwhuxumzkzvyphihhh	https://www.cvte.com/product/quadrupedrobot	200	2026-08-24T20:48:17.000Z	7d7d3a61ad1ad18260a9c8443d14505a03517eafdc9ad51133ba11bf82fd3557	826699	1196x572	feltfoto	0
cvte-maxhub-x7	cvte-maxhub-x7-vision.jpg	https://cos-pro-pub.cvtestatic.com/cvte-official-website/uwiwuhynminhnhlwhuxpwmzqyvphihhh	https://www.cvte.com/product/quadrupedrobot	200	2026-08-24T20:48:17.000Z	15a5de7753594e8318eb2653b3d5626da22be408991d9ef6a83520c7d361b6ea	76540	976x1580	infografik	0
cvte-maxhub-x7	cvte-maxhub-x7-modular.jpg	https://cos-pro-pub.cvtestatic.com/cvte-official-website/uwiwzulzminhnhlwhuxpwnhmjuhhihhh	https://www.cvte.com/product/quadrupedrobot	200	2026-08-24T20:48:18.000Z	5f737c4ee050afce2259bb8abb40112e67435c8efd7629549991637e19368daf	130926	976x1580	infografik	0
cvte-maxhub-x7	cvte-maxhub-x7-news-1.jpg	https://cos-pro-pub.cvtestatic.com/cvte-official-website/uwiwyqwuminhnhlwhupuyzqljwhhihhh	https://www.cvte.com/news/detail/161afb60-856a-11f0-bd5d-fb86232a40db	200	2026-08-24T20:48:44.000Z	4ae32a80139f96db02c1dbd9af908cd5503d4ed855583cab5e6f5f3d4b31b97e	118321	1080x786	pressefoto	0
cvte-maxhub-x7	cvte-maxhub-x7-news-2.jpg	https://cos-pro-pub.cvtestatic.com/cvte-official-website/uwiwujwuminhnhlwhupuyzqmphhhihhh	https://www.cvte.com/news/detail/161afb60-856a-11f0-bd5d-fb86232a40db	200	2026-08-24T20:48:44.000Z	7cd277f01c4e853b8b18ee3e57a67300ff56c2eef38ee00cc5b785b90d26e7f5	145866	1080x810	pressefoto	0
cvte-maxhub-x7	cvte-maxhub-x7-news-3.png	https://cos-pro-pub.cvtestatic.com/cvte-official-website/uwiwwnuuminhnhlwhupuyzqolkhhihhh	https://www.cvte.com/news/detail/161afb60-856a-11f0-bd5d-fb86232a40db	200	2026-08-24T20:48:45.000Z	2e9d0e0e0debd2dc30aad3b2276aa875ba15e565088ce20e42d9c2340057e8ad	391066	900x507	feltfoto	0
```

`hentet_utc` er hver fils faktiske mtime (målt med Python `os.path.getmtime`, ikke
skønnet). `http_status` er 200 for alle — bekræftet ved curl's `-w "%{http_code}"` under
hver download.

---

## 5. `billede:`-blokke tilføjet (9 YAML-filer, følger `unitree-aliengo.yaml`-formatet)

```yaml
# data/robots/pudu-d5.yaml
billede:
  fil: fotos/fabrikant/pudu-d5.png
  ophav: fabrikant
  kilde: https://store.pudurobotics.com/products/pudu-d5
  hentet: 2026-08-24

# data/robots/pudu-d5-w.yaml
billede:
  fil: fotos/fabrikant/pudu-d5-w.jpg
  ophav: fabrikant
  kilde: https://store.pudurobotics.com/products/pudu-d5
  hentet: 2026-08-24

# data/robots/microrobotech-movenew-t1.yaml
billede:
  fil: fotos/fabrikant/microrobotech-movenew-t1.jpg
  ophav: fabrikant
  kilde: https://www.micbotics.com/list_13/96.html
  hentet: 2026-08-24

# data/robots/microrobotech-movenew-p1.yaml
billede:
  fil: fotos/fabrikant/microrobotech-movenew-p1.jpg
  ophav: fabrikant
  kilde: https://www.micbotics.com/list_12/98.html
  hentet: 2026-08-24

# data/robots/genisom-gangben-l1.yaml
billede:
  fil: fotos/fabrikant/genisom-gangben-l1.webp
  ophav: fabrikant
  kilde: https://www.genisomai.com/product-robot/L1
  hentet: 2026-08-24

# data/robots/genisom-gangben-l2.yaml
billede:
  fil: fotos/fabrikant/genisom-gangben-l2.webp
  ophav: fabrikant
  kilde: https://www.genisomai.com/product-robot/L2
  hentet: 2026-08-24

# data/robots/yufan-lingmao-cyvet.yaml
billede:
  fil: fotos/fabrikant/yufan-lingmao-cyvet.jpg
  ophav: fabrikant
  kilde: https://www.uniubi.com/embodied-ai/robot
  hentet: 2026-08-24

# data/robots/astrall-dynamics-hypertron-t01.yaml
billede:
  fil: fotos/fabrikant/astrall-dynamics-hypertron-t01.png
  ophav: fabrikant
  kilde: https://www.astralldynamics.com/
  hentet: 2026-08-24

# data/robots/cvte-maxhub-x7.yaml
billede:
  fil: fotos/fabrikant/cvte-maxhub-x7.jpg
  ophav: fabrikant
  kilde: https://www.cvte.com/product/quadrupedrobot
  hentet: 2026-08-24
```

Placeret efter `noter:`/`anvendelse:`, umiddelbart før `felter:` i hver fil — samme
position som ankeret (`unitree-aliengo.yaml`).

---

## 6. Efterprøvning (tal, ikke skøn)

```
node tools/validate.mjs
  → 55 fil(er) · 0 fejl · 1 advarsel (ghost-robotics-vision-60, R9, praeeksisterende,
    uroert af dette spor)

node tools/build.mjs
  → Byggede 155 sider. Kort paa forsiden: 55 (skal vaere lig 55, staar). Kildemaerker:
    739 tal med kilde, 0 uden. Billedfelter: 46 fil(er) brugt af 46 robot(ter) ·
    fabrikant: 46 (37 eksisterende + 9 nye). SPAERRING S1 udloest korrekt: bygget
    advarer om at 46 billeder har ophav "fabrikant" og siden ikke maa publiceres uden
    skriftlig tilladelse, jf. CLAUDE.md-begraensning 3.

node tests/koer.mjs
  → 195 bestaaet, 2 fejlet (begge praeeksisterende, dokumenteret i fund/FUND-test.md og
    fund/FUND-detalje.md, uroert af dette spor).
```

Alle tre tal matcher den forventede baseline i opgavebrevet præcist (155 sider / 739
kildebelagte tal / 195 ok, 2 røde) — ingen regression fra billedtilføjelsen.

**HTML-kontrol (mindst to robotter, som krævet):**

```
dist/da/robotter/pudu-d5/index.html:
  <picture><img src="../../../billeder/fotos/fabrikant/pudu-d5.png" alt="PUDU D5" decoding="async"></picture>

dist/da/robotter/cvte-maxhub-x7/index.html:
  <img src="../../../billeder/fotos/fabrikant/cvte-maxhub-x7.jpg" alt="MAXHUB X7" decoding="async">
```

Begge billeder er fysisk kopieret til `dist/billeder/fotos/fabrikant/` og vises korrekt
med producentnavn som alt-tekst. De øvrige seks nye billeder er bekræftet at optræde på
begge sprogs forsider (`grep -c` på hvert filnavn i `dist/da/index.html` og
`dist/en/index.html` gav 1 træf hver, i alt 6 for de resterende robotter).

---

## 7. Selv-review — hvad jeg er usikker på

- **Astrall Hypertron-T01's valgte billede (strandfoto) er sandsynligvis en 3D-render
  komposit ind i et ægte fotografi, ikke et rent kamerafoto.** Skyggerne og
  refleksionerne på robotten virker konsistente med baggrundslyset, men jeg kan ikke
  bevise det er ét kamera-eksponering. Alle fire Astrall-kandidater (park, strand, rum)
  deler samme visuelle stil, hvilket peger på at *alle* er komposit-renders, inklusive
  parkfotoet jeg først troede var et ægte fotografi. Hvis det er tilfældet, ændrer det
  ikke min dom (billedbaren kræver ikke et ubearbejdet kamerafoto, kun at det ikke er
  AI-genereret ROBOT-indhold produceret af os selv — dette er stadig producentens eget,
  udgivne marketingmateriale), men det er en usikkerhed værd at nævne.
- **De tre fravalgte "konceptkunst"-billeder (Astralls rumscene, Gangben L1/L2's
  bjerg-/stormscener) er en kvalitetsdom, ikke en hård regelovertrædelse.** Billedbaren
  forbyder eksplicit kun: logoer, UI, infografikker med tekst, familiebannere,
  makrodetaljer og indbrændt marketingtekst — ingen af de tre rammer bogstaveligt en af
  disse kategorier, og alle tre bestod faktisk beskæringstesten. Jeg fravalgte dem fordi
  et renere, mere entydigt studio- eller feltfoto var tilgængeligt for samme robot, og
  fordi CLAUDE.md-begrænsning 4 ("ingen AI-genererede billeder af robotter") gjorde mig
  forsigtig med billeder, der visuelt kunne forveksles med AI-generering, selvom de er
  producentens eget materiale. Et andet menneske kunne rimeligt vurdere at disse tre var
  gode nok til at bruges — det er den ene beslutningstype i denne rapport, jeg mest
  opfordrer til at få efterset.
- **CVTE's valgte billede (trappescene) og L1/L2's studiokort er sandsynligvis også
  3D-renders, ikke fotos af en fysisk prototype.** Samme ræsonnement som Astrall
  ovenfor — billedbaren skelner ikke mellem foto og producent-render, kun mellem
  producentens eget materiale og noget vi selv har genereret. Nævnt for gennemsigtighed.
  Pudu D5/D5-W og MOVENEW T1/P1's studiobilleder virker med større sikkerhed at være
  ægte produktfotos (synlige belysnings-uregelmæssigheder, refleksioner i metal, der er
  svære at få et render til at gengive naturligt) — men jeg har ikke et hårdt bevis for
  nogen af dem, kun et kvalificeret øjemål.
- **Yufan-billedets lille logo på robottens "ansigt"** kunne i teorien læses som et
  UI-element (det ligner en lampe/skærm), men det sidder fysisk fastmonteret på
  kabinettet på samme måde som kameraerne omkring det — vurderet som en fysisk detalje,
  ikke en skærm eller overlay.
- **Jeg har ikke undersøgt om Astrall eller CVTE har yderligere billedkandidater på
  sider, jeg ikke fandt** (fx en presse-kit-side, en `.cn`-version af Astrall — forsøgt,
  men request'en timede ud efter 15 sekunder og blev ikke forsøgt igen). De fundne
  kandidater var tilstrækkelige til at levere et bestået billede for begge, så jeg
  forfulgte det ikke videre.
- **MANIFEST-rækkernes `indhold_gaet`-kategorier** ("banner", "feltfoto",
  "produktbillede", "infografik", "pressefoto") er mit eget bedste gæt pr. billede, ikke
  en fast kodeliste fra et skema — de følger samme frie tekstform som eksisterende
  rækker i filen (fx "produktbillede" set i tidligere runder).

**Hvad jeg ikke nåede:** at undersøge de fem yderligere GENISOM-modeller
(L1-W, L2-W, L2-W Ultra, Tongchui M1, Qiuqiu SP1) nævnt i `FUND-kand1b.md` — udenfor
denne opgaves omfang (kun de ni navngivne poster). At afklare med 100 % sikkerhed hvilke
af de ni valgte billeder er ægte fotos versus 3D-renders — se selv-review ovenfor. At
gennemgå astralldynamics.cn (kinesisk topdomæne) grundigt — ét forsøg timede ud, og et
brugbart billede var allerede fundet på .com-siden.
