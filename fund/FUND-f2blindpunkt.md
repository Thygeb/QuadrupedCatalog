# FUND — `spor/f2-blindpunkt`

**Spor-skill:** kaldt og kørt normalt (ikke fallback fra disk).
**Andre vurderet:** `supabase` (ikke nødvendig — kun REST/fetch, ingen MCP-brug), `fejljagt`
(ikke udløst — intet uventet, kun forventet blindpunkt).

## 1. Hovedtallet — blindpunktets størrelse

**392 celler læst (100 % af briefets søgerum, reproduceret med egen SQL/script —
samme 392 og samme fordeling pr. producent som briefets tabel, celle for celle).**

**33 celler bedømt danske · 1 tvivlstilfælde · 358 vurderet engelske/sprogneutrale.**

Instrumentets `--dansk` gav 0 hos alle 16 producenter — det nul var forkert i **33 af 392
tilfælde (8,4 %)**. Blindpunktet er reelt, ikke en teoretisk risiko.

**Fordeling:** 31 af de 33 sidder i `value_text` (ikke min kolonne — rapporteret, ikke
rettet). **2 sad i `caveat`** (min kolonne) og er rettet:

| Robot | Felt | Før | Efter |
|---|---|---|---|
| 2198 deep-robotics-x30-pro | height/caveat | "USIKKER TILDELING - se bredde." | "UNCERTAIN ASSIGNMENT - see width." |
| 2253 yobotics-y20 | docking_station/caveat | "Ladestander, tilvalg." | "Charging stand, optional." |

Begge oversættelser følger eksisterende engelske søster-mønstre i basen (2227 pudu-d5-w
har allerede "UNCERTAIN ASSIGNMENT — see length." på samme mønster).

**Mønster i de 31 `value_text`-fund:** ikke tilfældigt spredt — 15 af 31 er `cameras`/
`compute`-feltet hos Unitree-familien ("HD-kamera", "8-kernet CPU"), 4 hos DEEP
("vidvinkelkameraer x2", "otte-kernet"), 3 hos MagicLab: et teknisk stikord, aldrig oversat,
fordi det aldrig blev skrevet som en hel sætning. Se `fund/f2blindpunkt-fundne-celler.tsv`.

## 2. Metode

Reproducerede briefets 392-tal selv: `hentRobotter()` (samme funktion som
`db/fase2-tjek.mjs` bruger), filtreret til mine 16 producenter, kolonnerne
`value_text`/`caveat`/`caveat_wording`/`applications.note`, længde < 60, ingen æøå
(`harAeoeaa` importeret direkte fra instrumentet). **392/392 match briefets tal og fordeling
pr. producent præcist.** Læste derefter alle 392 med øjnene, gruppevis pr. producent, 3 store
først (Unitree 173, MicroRoboTech 45, DEEP 41).

## 3. Konfidens

- **392-tallet: HØJ.** Script: `hentRobotter()` + filter på 16 producenter + længde<60 +
  `!harAeoeaa`, lå i `fund/.tmp-blindpunkt/find-kandidater.mjs` (scratch, ikke committet —
  `rm -rf` blev nægtet af værktøjstilladelser, så filen ligger stadig i worktreen, blot
  utracket). Kontrafaktisk: forkert kolonneliste/længdegrænse ville have givet et andet tal
  end 392 — det gjorde den ikke, første forsøg.
- **33 dansk + 1 tvivl: MIDDEL.** Manuel gennemlæsning, ikke en genkørbar kommando — næste
  øjenpar kan finde et 34. eller underkende et af mine 33.
- **De 2 skrivninger ramte kun mine 2 celler: HØJ.** `change_log WHERE
  changed_by='spor/f2-blindpunkt'` gav 2 rækker, begge `field_entries`, robot 2198/2253,
  ingen `value_text`. Kontrafaktisk: fejl i hvidlisten/nøgle ville have givet 0, >2 rækker,
  eller en tredje tabel.
- **Talaftryk uændret for alle 16 producenter: HØJ.** `node db/fase2-tjek.mjs --tal
  --producent="<hver af de 16>"` før/efter, sorteret og diff'et — identisk sæt af 16 hashes.

## Nye fælder og opdagelser

1. **`value_text` scannes slet ikke af `erDansk()`/`--dansk`** — ikke kun to-benet svag, men
   fuldstændig fraværende fra `DANSK_KOLONNER`-listen (`db/fase2-tjek.mjs:283-292`). 31 af 33
   fund sad netop dér. STATUS.md Å129 nævner samme ting ("En femte tekstbunke, ingen plan
   nævner: value_text — 230 værdier, 105 danske") — det er altså en KENDT, dokumenteret
   mangel, ikke en ny opdagelse, men mit tal (31 af 392 i mit søgerum) er en frisk, mindre
   måling af den samme kendte mangel.
2. **Mønsteret er systematisk, ikke tilfældigt:** `compute` og `cameras` hos
   Unitree/DEEP/MagicLab bærer korte tekniske stikord ("8-kernet CPU", "vidvinkelkameraer"),
   aldrig hele sætninger — og korte stikord er præcis det, der aldrig rammer et markørord.
   Et forslag til detektoren (se nedenfor) bør prioritere DEN mekanisme, ikke kun ordlisten.
3. **"Ladestander, tilvalg." var allerede kendt** (briefets afsnit 1, fundet af
   `spor/f2-weilanyoubaote`) men stod STADIG dansk i basen ved min baseline — det var
   rapporteret, ikke rettet, fordi det spor ikke ejede `caveat`-kolonnen på det tidspunkt.
   Nu rettet.
4. **Decimalkomma som selvstændigt sprogsignal:** 2251/weight/caveat "15 kg +/- 0,5 kg." har
   ingen danske ord, kun europæisk decimaltegn. Jeg vurderede det som IKKE-dansk (ordene er
   engelske), men det er en tredje kategori — hverken instrumentets to ben fanger den, og den
   er heller ikke "dansk sprog" i streng forstand. Nævnt som tvivl, ikke rettet.

## Forslag til detektoren (IKKE bygget, jf. briefets punkt 4)

1. **Tilføj `value_text` til `DANSK_KOLONNER`** (`db/fase2-tjek.mjs:283`) — det er det
   største enkeltstående hul, 31 af mine 33 fund.
2. **Ordlisten mangler mindst:** `ud`, `ind`, `kamera`/`kameraer`, `kernet`, `tilvalg`,
   `eller` (allerede der), `vidvinkel`, `dybdekamera`, `optisk`, `lager`, `ja`, `op til`,
   `type og model`. De fleste er domænespecifikke tekniske ord (kamera/kernet/lager), ikke
   almindelige funktionsord — ordlisten er bygget til prosa, ikke til stikords-værdier.
3. **En selvstændig regel for `value_text` specifikt** kunne være strengere end
   caveat/note-reglen, fordi `value_text` sjældnere er en hel sætning: et enkelt dansk
   substantiv (fx "kamera") bør tælle, mens det i en engelsk prosasætning ville være for
   løst (falske positiver). Det taler for at IKKE genbruge `DANSKE_MARKOEROR` uændret på
   `value_text`, men lave en kortere, mere teknisk ordliste specifikt til den kolonne.

## Punkter i briefet, jeg ikke nåede

Ingen. Alle 392 celler læst, alle acceptkriterier (1–7) opfyldt og efterprøvet ovenfor.
