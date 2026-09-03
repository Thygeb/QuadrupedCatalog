# FUND — `spor/f2-kildejagt`: frisk kildejagt, begge påstande belagt

**Skill:** `spor` kaldt, lykkedes fra worktreen. `robotdata` slået op for G1 (kilde+MANIFEST) —
fandt navnereglen `<producent>-<model>-<hvad>-<hentedato>.<ext>`, som mine filer først ikke
fulgte (se "Nye fælder"). `supabase` fravalgt: almindelig UPDATE/SELECT, intet skema/RLS.
`fejljagt` fravalgt: intet uventet, kun en frisk kildejagt.

## Udfald

**RIVR ONE (2230), tre delpåstande — ALLE BELAGT:**
1. "Tidligere Swiss-Mile" → rivr.ai/stories/…swiss-mile-to-rivr: *"the company originally
   launched under the name Swiss-Mile."*
2. "RIVR Technologies AG, udspring fra ETH Zürich" → selskabsnavn fra rivr.ai forside:
   *"© 2026 RIVR Technologies AG."* Ophav fra samme stories-side: *"a spin-off from ETH
   Zurich's Robotic Systems Lab."*
3. "Hjul-ben-hybrid" → rivr.ai/product: *"RIVR's wheeled-legged robots…"*

**Boston Dynamics Spot (2188), én delpåstand — BELAGT:**
"Majoritetsejet af Hyundai Motor Group (Sydkorea)" → bostondynamics.com/news/ (to sider):
*"the Group holds an 80 percent stake in Boston Dynamics"* + *"Headquartered in Seoul,
South Korea, Hyundai Motor Group…"*

Begge oversat til engelsk og skrevet i `robots.notes`. Feltet har **ingen source-kolonne**
— kilden er derfor skrevet i `change_reason` og her, som briefet forudsagde. Strukturel
observation til orkestratoren, ikke noget dette spor kan rette.

## Kildejagten, tal, og konfidens

6 sider hentet i dag · **4 delpåstande efterprøvet, 4 belagt, 0 slettet, 0 i tvivl** ·
2 array-elementer ændret (ét pr. robot) · 3 elementer efterladt urørte, efterprøvet
byte-for-byte mod `SELECT` før/efter: identiske.

**Høj** konfidens, tre grunde: (1) kildecitater slået op i den gemte fil med
`node -e`-udtræk, ikke husket — kontrafaktisk: manglende tekst havde givet "NOT FOUND",
skete for 6 andre forsøgte nøgleord undervejs; (2) `SELECT … RETURNING` efter hver UPDATE,
genkørbart — forkert `jsonb_set`-index ville være synligt i samme output; (3) `--tal`
matcher briefets aftryk eksakt (RIVR `43dff8fb…`, BD `7bda7f12…`) før og efter — et rørt
talfelt ville have ændret det.

## Grundmåling → efter → filejerskab

`--dansk` RIVR 2/1, BD 3/1 før — matcher brief. Efter: begge **0** dansk, `--tal` uændret.
`change_log where changed_by='spor/f2-kildejagt'`: **2 rækker**, `{id:2230}` og `{id:2188}`,
nul andre — matcher acceptkriterium 5.

Rørt: `robots.id in (2230,2188)`, kun kolonnerne `notes`, `collected_by`, `change_reason`.
`fund/FUND-f2kildejagt.md`. **`media/_kilder/raa-f2-kildejagt-2026-09-03/` ligger i
worktreen og følger IKKE med grenen — kopiér ud før worktreen fjernes.** 6 HTML-filer +
MANIFEST.tsv.

**Usikkerheder:** ingen om selve udfaldet — alle fire delpåstande gav utvetydige træf på
producenternes egne sider. Sideliggende usikkerhed om ordlydens aktualitet: se
"Nye fælder" punkt 3.

---

## Nye fælder og opdagelser

1. **`grep -P` fejlede lokalt** ("supports only unibyte and UTF-8 locales") og gav falsk
   MISMATCH på alle 6 sha256-krydstjek — samme fælde som briefets `grep -r`-advarsel, bare
   en ny variant. Løst med `awk -F'\t'` i stedet.
2. **Filnavnene fulgte først ikke G1's navneregel** (`<producent>-<model>-<hvad>-
   <hentedato>.<ext>`) — givet korte, selvopfundne navne i stedet. Rettet ved omdøbning +
   MANIFEST opdateret før commit. Briefet nævnte kun "samme form" for kolonnerne, ikke
   filnavnet — reglen står kun i G1.
3. **Hyundais ejerandel er en bevægelig kilde.** WebSearch (ikke selv hentet/gemt) viser,
   at Hyundai i juli 2026 også overtog SoftBanks resterende ca. 20 % og nu ejer Boston
   Dynamics 100 %. "Majoritetsejet" er stadig sandt, men underdrevet. IKKE rettet — ligger
   uden for de tre tilladte udfald — men noteret i `change_reason` på 2188.
4. **RIVR selv blev opkøbt af Amazon i marts 2026** (WebSearch, ikke gemt). Rører ingen af
   de fire delpåstande, men er relevant, hvis nogen senere opdaterer RIVR-posten generelt.

## Punkter i briefet, jeg ikke nåede

Ingen. Alle punkter i afsnit 3 og alle fem acceptkriterier i afsnit 7 er udført og
efterprøvet ovenfor.
