# Klassifikation og citatefterprøvning — WEILAN og Shandong Youbaote

Trin 2+3 (BRIEF-FAELLES's seks trin). Alle rader er efterprøvet mod
`media/_kilder/raa-kina-weilan-xiaomi-2026-08-19/`, ikke antaget.

## Kildesprog (målt, ikke antaget — brief afsnit 2)

`MANIFEST.tsv` i `raa-kina-weilan-xiaomi-2026-08-19/`: alle `weilan-*.html`
har `sprog=en` (WEILANs sprogskifter til kinesisk er selv i stykker — alle tre
`*-cn-*-FEJL-404.html` er 404, allerede noteret i DB). WEILANs primære
opskrift er derfor `OPSKRIFT-fase2.md` (engelsk kilde, kasse A/B/C).

`yobotics-*.html` samme mappe: forside/katalog-firbenede/omos er `sprog=en`,
men selve **produktspecifikationerne** for Y10/Y20/e-Dog ligger som
Excel-indsatte tabeller PÅ KINESISK inde i `yobotics-katalog-firbenede-
2026-08-19.html` (fundet ved grep på `含电池`/`重量`/`续航` — IKKE fundet af
en `grep -r` på hele `media/_kilder/`, som gav 0 tavst; direkte `grep -c` på
selve filen gav 2 træf. **Fælde noteret, se "Nye fælder".**). Youbaotes
primære opskrift er derfor `OPSKRIFT-fase2-cjk.md`.

**Youbaote har ingen mappe med eget navn** — al deres kildemateriale ligger i
WEILANs mappe (`raa-kina-weilan-xiaomi-2026-08-19/`), fordi begge blev
indsamlet i samme session 19. aug 2026. Ingen ny hentning var nødvendig.

## WEILAN — kasse A/B, alt efterprøvet mod `weilan-*-produktside-2026-08-19.html`

Alle 36 `caveat`-celler + 5 `applications.note` + 21 `robots.notes`-elementer
er kasse B (dansk analyseprosa om en engelsk kilde, intet ordret citat
udskilt til `caveat_wording` — WEILAN har 0 `caveat_wording`-rækker i
databasen, og ingen oprettes: briefets acceptkriterium kræver kun at dansk
bliver engelsk i de EKSISTERENDE kolonner). Hver påstand er efterprøvet
direkte mod kildens tekst:

- C500/C501 (18+18 felter): al specifikationsdata verificeret ordret mod
  `weilan-alphadogc-produktside-2026-08-19.html` (Speed/Gradeability/Weight/
  Temperature/Battery/ROS-tabellerne, "Innovative Applications in Discovery"
  -sektionen). Fuldbredde-tilde (U+FF5E) i "0°C ～ 35°C" bekræftet i selve
  filen.
- E300/E400L: HTML-kommentaren, der skjuler specifikationerne, er bekræftet
  ved byte-offset (`indexOf('<!--')` før citatet, `indexOf('-->')` efter —
  kommentar 19561–53138, DB'ens 19561–53141 er samme fund inden for
  afrundingsforskel). "Enterprise Version Available" og modelnavnene E300/
  E400L bekræftet på `weilan-katalog-robots-2026-08-19.html`.
- BabyAlpha: "BUY  NOW"-knap uden pris bekræftet, "AI-powered Family
  Companion" og "a source of family entertainment that doubles as a home
  security guard" bekræftet ordret.
- Prisfeltet (`price`, alle 5 robotter): "ordreside oplyser ingen priser,
  kun e-mail" bekræftet — `weilan-alle-ordreside-2026-08-19.html` har 0
  forekomster af et prisbeløb, kun "price"/"email" som ord.

**Ingen kasse C/D hos WEILAN.** Alt kan oversættes, intet slettes.

## Shandong Youbaote — kasse A, verificeret mod indlejrede kinesiske tabeller

De tre modellers specifikationer ligger i `yobotics-katalog-firbenede-
2026-08-19.html` under tre skjulte faner (`product_more_h`), MEN
**overskriften og beskrivelsen er uenige for alle tre — bekræftet, ikke kun
gengivet fra en tidligere agents note:**

| Fanens overskrift (linje) | Beskrivelsens eget modelnavn |
|---|---|
| "Y10" (l. 733) | "Y5是一款桌面级..." |
| "Y20" (l. 746) | "Y30是一款全地形..." |
| "e-Dog" (l. 759) | ""Y15"是一款行业应用的..." |

Alle robot-id'ers eksisterende `caveat`-tekster om dette (Y10/Y5, Y20/Y30,
e-Dog/Y15) er hermed **egen-verificeret**, ikke kun overtaget.

- **yobotics-y10 (2252):** vægt "5,6 kg ± 0,5 kg" ⟵ "重量：约5.6kg±0.5kg(整机，
  含电池）". Payload "kontinuerlig gående, >3 kg" ⟵ "持续行走负载：>3Kg". Speed
  "1,4 m/s uden last" ⟵ "奔跑速度：1.4m/s空载下".
- **yobotics-y20 (2253):** vægt-feltet har den ENESTE `caveat_wording`
  (Youbaotes 1 af 1 danske) — nuværende værdi `"Med batteri (含电池）"` er en
  BLANDING af dansk oversættelse og kildetegn, hvilket bryder L87 ("kildens
  ord og kun kildens ord"). Kilden ⟵ "本体重量：约60kg(含电池)" — den rene
  ordlyd er `含电池`. Højde "sammenfoldet 930×450×370mm" ⟵ "折叠尺寸：约930mm×
  450mm×370mm". Payload walking/standing 80/150 kg ⟵ "行走负载：最大80kg" /
  "站立负载：最大150kg". Speed 4 m/s ⟵ "奔跑速度：最大4m/s". Slope 40° ⟵ "攀爬斜坡
  角度：最大40°". Stair 30cm ⟵ "攀爬台阶高度：最大30cm". Temp -25°C ⟵ "工作环境温度：
  零下25℃~零上50℃". Battery 25Ah ⟵ "电池容量：25Ah". Runtime >5h/>2,5h ⟵ "续航：
  空载持续行走＞5h,有效负载作业＞2.5h". Charging ≤3h + docking optional ⟵
  "充满电时间≤3h" under "选配" (tilvalg).
- **yobotics-e-dog (2251):** speed ≥12km/h, slope ≥35°, stair ≥16cm, static/
  dynamic/working payload 8/5/3 kg ⟵ "最大速度≥12km/h，爬坡角度≥35°，爬楼梯高度≥
  16cm，最大静态负载能力8kg，最大动态负载能力5kg，工作动态负载能力3kg". Weight 15±0,5kg,
  length 680×330×380mm(±10mm), DOF 12/led-moment 48Nm, runtime ≥1,5t ⟵
  samme tekstblok, punkt 7–10.
- **Jinan-adressen** (alle tre robotter): "Software Park Building, No. 1768
  Xinluo Street, High tech Zone, Jinan City, Shandong Province" bekræftet
  ordret på `yobotics-omos-2026-08-19.html`.
- **applications.quote** ("flagship product...") allerede engelsk (0 dansk,
  rørt ikke) — men `applications.note`s DANSKE ramme om citatet er
  efterprøvet: "flagship product in the field of commercial, scientific
  research, and educational quadruped robots" findes ordret i
  `yobotics-katalog-firbenede-2026-08-19.html`.
- **"Yobotics er domænenavnet, egne engelske navn er Shandong Youbaote
  Intelligent Robot Co., Ltd."** bekræftet ordret på omos-siden.

**Ingen kasse C/D hos Youbaote heller.** Alt kan oversættes. Den ene
`caveat_wording`-celle rettes til ren kildeordlyd (`含电池`); den danske del
flytter til `caveat`-prosaen.

## Citat-efterprøvningstælling (brief punkt 5, "N efterprøvet, M ikke fundet")

**41 selvstændige faktapåstande/tal-citater efterprøvet mod råkilden**
(WEILAN: 20 - deraf HTML-kommentar-offset, "BUY NOW", "Enterprise Version
Available", ordresidens prisfravær, alle C-seriens tabelværdier grupperet pr.
sektion; Youbaote: 21 - de tre modelnavne-uoverensstemmelser, Jinan-adressen,
alle Y10/Y20/e-Dog-tabelværdier grupperet pr. felt, domænenavns-sætningen).
**0 kunne ikke findes.** Se detaljer ovenfor og i commit-historikken.
