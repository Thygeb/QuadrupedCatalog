# BRIEF — `spor/f2-feje`: citatkolonnerne hos de spor, der meldte færdigt

**Worktree:** `C:/Praktik/websites/udstilling-wt-feje` · **Gren:** `spor/f2-feje`
**Forgrenet fra main `90c27a5`.**
**Forventet pris:** ~200k tokens. **Gæt**, ikke krav — mål og rapportér dit faktiske.

**Dette spor findes, fordi et brief var forkert — ikke fordi et spor var det.**
Læs afsnit 1: det er hele begrundelsen, og uden den ligner dit arbejde en dublet.

---

## 0. Første handling

Kald **`spor`-skillen**. Lykkes kaldet ikke fra din worktree, så læs
`.claude/skills/spor/SKILL.md` fra disk og **skriv i rapporten, at du gjorde det**.
Vurdér desuden `supabase` og `robotdata`. **`fejljagt`, hvis noget måler uventet.**

---

## 1. Hvorfor du findes — STATUS.md Å143

Fase 2's fælles brief, `fund/BRIEF-FAELLES.md`, har et afsnit *"Kolonnerne du må røre, og
ikke én mere"*. Det nævner **ni** kolonner. Kodens hvidliste,
`TEKSTKOLONNE_HVIDLISTE` i `db/f2-skriv.mjs`, tillader **tolv**.

De fire, prosaen mangler, er `note_wording`, `quote`, `quote_wording` og `alt`.

**Tre spor meldte færdigt 2. sep og var det ikke.** De fulgte briefets prosa, hvilket var
korrekt af dem — defekten er briefets, ikke sporenes. Resultatet er, at deres `caveat` er
ren, mens citatkolonnerne står på dansk.

**Din opgave er den rest.** Filen `fund/BRIEF-FAELLES.md` ligger i din worktree og er
bevidst IKKE rettet — den skal forblive identisk med de gamle grenes udgave. **Dette brief
vinder over den ved konflikt.**

---

## 2. Opgaven — 60 danske celler, fem producenter

| Producent | Robotter | Celler | Hvor |
|---|---|---|---|
| **GENISOM AI** | 9 | **49** | `note_wording` 9 · `quote` 20 · `quote_wording` 20 |
| **Astrall Dynamics** | 1 | **3** | `note_wording` 1 · `quote` 1 · `quote_wording` 1 |
| **CVTE** | 1 | **3** | `note_wording` 1 · `quote` 1 · `quote_wording` 1 |
| **Yufan Intelligent** | 1 | **3** | `note_wording` 1 · `quote` 1 · `quote_wording` 1 |
| **Xiaomi** | 2 | **2** | `note_wording` 2 |

**Mønstret er ens overalt og bekræfter diagnosen: intet er tilbage i `caveat`.**

---

## 3. Grundmåling — mine tal, som du genmåler FØRST

```
node db/fase2-tjek.mjs --dansk --producent="<hver af de fem>"
node db/fase2-tjek.mjs --tal   --producent="<hver af de fem>"
```

**Talaftryk, målt af mig 3. sep umiddelbart før afsendelse:**

| Producent | Aftryk |
|---|---|
| GENISOM AI | `a5a7e5d4617a3a52a910b018fbefb18a3deaac47b2093202e730227625b91e7c` |
| Astrall Dynamics | `48b0051c4ad447de281d35e1bd9495abeb739dc2a1e6be5b3094e23375828548` |
| CVTE | `6426ca180abd267e38bbc290de691bee3e951948bb708216f55064f48e296d79` |
| Yufan Intelligent | `0de112305d08e41528693e296153f5377929459434a52e3bcbc85f04dfb6cc82` |
| Xiaomi | `057a9bc8cf39c6caa934475b8bcb84d65626acff87c1403aa368054bb64e5fa2` |

Kør `--tal` igen som allersidste handling for **alle fem**. Afviger ét aftryk, har du rørt
en talkolonne — **stop og meld det, ret ikke videre.**

---

## 4. `quote` og `quote_wording` er et PAR — læs dette før du skriver

De to kolonner har samme forhold som `caveat`/`caveat_wording`:
**`quote_wording` bærer kildens ord ordret, `quote` er vores gengivelse.**

Hos GENISOM står de på **20 par**, hvor begge er danske. Det betyder, at kildens ord
allerede er blevet oversat én gang — så du kan **ikke** bare oversætte teksten videre:

- **Find kildens faktiske engelske ord i råkilden** og sæt dem i `quote_wording`.
  Råkilderne ligger i `media/_kilder/` — GENISOMs i `raa-genisom-2026-08-24/` og
  `raa-f2-genisom-2026-09-02/` (sidstnævnte er netop reddet ind i din worktree).
- **Kan kildens ord ikke findes**, så er feltet ikke et ordlydsfelt længere. Følg L87:
  en påstand, der ikke kan føres tilbage til en kilde, **slettes — den oversættes ikke**.
- **`quote` skal stemme med `quote_wording`.** Ændrer du det ene, så efterse det andet.

**Rapportér tre tal:** hvor mange par du efterprøvede, hvor mange hvor kildens ord blev
fundet, og hvor mange der måtte slettes.

---

## 5. DETEKTOREN SER IKKE ALT — og det er derfor, dit spor ikke kan stole på et 0

`db/fase2-tjek.mjs`s `erDansk()` er **to-benet: æøå ELLER et markørord fra en liste på 80**.
Filens kommentar linje 211 siger det selv: *"en dansk saetning uden æøå OG uden et af disse
ord slipper igennem"*.

**To spor fandt uafhængigt hver sin instans 3. sep:** `"Fodnote"` (`2193/slope`) og
`"Ladestander, tilvalg."` (`docking_station`) — sidstnævnte i en celle, briefet kaldte
*"allerede engelsk"*.

**Derfor:** ud over de 60 celler skal du **læse dine fem producenters korte celler igennem
med øjnene** — dem uden æøå, som instrumentet kalder engelske. De korte er farligst: en
lang dansk sætning rammer næsten altid et markørord; et enkelt ord gør ikke.

**Rapportér to tal:** hvor mange celler du læste ud over instrumentets fund, og hvor mange
danske du fandt dér. **Nul fundne uden en tælling er ikke en gennemlæsning.**

**Afgrænsning, så du ikke løber løbsk:** kun DINE fem producenter. En fuld gennemlæsning af
alle 77 robotter er en senere opgave og er ikke din.

---

## 6. Rækkeejerskab og filejerskab

**Rækker:** kun `robot_id` hos **GENISOM AI, Astrall Dynamics, CVTE, Yufan Intelligent og
Xiaomi**. Nul udenfor.

**TO SPOR KØRER PARALLELT MED DIG, og grænsen er skarp:**

- `spor/f2-galileo` har **Yuejia Lingdong** og **Galileo (Tianjin)**. Rør dem ikke.
- `spor/f2-kildejagt` har **RIVR (2230)** og **Boston Dynamics (2188)**. Rør dem ikke.

Bemærk at CVTE og Xiaomi tidligere blev skrevet af `spor/f2-galileo` — deres **rest** er
din. `change_log` indeholder derfor allerede rækker på dem fra et andet spor. **Filtrér på
`changed_by='spor/f2-feje'`**, ellers ligner de andres rækker en ejerskabsfejl hos dig.

**Filer, du ejer:** `fund/FUND-f2feje.md` · `fund/BRIEF-f2-feje.md` · `fund/f2feje-*`
**Rør ikke:** `data/robots/`, `tools/`, `assets/`, `tests/`, `STATUS.md`, `CLAUDE.md`,
`DESIGN.md`, `db/*.mjs`. `db/f2-skriv.mjs` bruges, men ændres ikke.
**Rør ikke `fund/BRIEF-FAELLES.md`** — den skal forblive identisk med de gamle grenes blob.

---

## 7. L87 og det spørgsmål, der IKKE er dit

L87: ordlydsfelterne bærer kildens ord ordret; vores egen prosa må stå, men kun når hver
påstand kan efterprøves i en råkildefil — ellers **slettes den**.

**ÅBENT SPØRGSMÅL, som venter på JPK — rør det ikke:** må et ordlydsfelt indeholde vores
eget narrativ? To spor rejste det uafhængigt. Møder du et `quote_wording` eller
`note_wording`, der blander vores indledning med kildens ord, så **oversæt/genfind det som
det er og lad strukturen stå — og skriv det i rapporten.** Omstrukturér ikke.
Du vil møde det: 20 par hos GENISOM alene.

**`caveat_class` må ALDRIG oversættes** — `ikke_oplyst` er en sentinel med 2.194
kodereferencer.

---

## 8. Acceptkriterier

1. **`--dansk` giver 0 for alle fem producenter.** Giver i dag 49 · 3 · 3 · 3 · 2 = **60**.
   Færdig ved 0 plus dokumenterede L87-tvivlstilfælde, ét pr. linje i rapporten.
2. **Alle fem talaftryk uændrede.** Tabellen i afsnit 3 er facit.
3. **Nul rækker uden for dine fem producenter**, målt på `changed_by='spor/f2-feje'`.
   Giver i dag **0 rækker i alt**, fordi du ikke har skrevet endnu — det er kontrollinjen.
4. **Citatpar efterprøvet:** tre tal, jf. afsnit 4.
5. **Gennemlæsning ud over instrumentet:** to tal, jf. afsnit 5.

---

## 9. Miljø

- **Kør IKKE `node tests/koer.mjs`** (2,8 GB) og **IKKE `tools/build.mjs`**.
- **Node ikke på PATH i Git Bash:** `"/c/Program Files/nodejs/node.exe"`.
  `exit 127` + `command not found` er PATH; + `Assertion failed … src\win\async.c` er libuv
  efter et `fetch`.
- **Læs aldrig en exitkode gennem en pipe.**
- **En MSYS-sti som argument til node læses som Windows-sti** — `/c/Praktik/...` blev til
  `C:\c\Praktik\...` med exit 0 og en tom målmappe. Brug `C:/...`.
- **PostgREST kapper ved 1000 rækker uden fejl.** `field_entries` har 2541. `Range` med
  sideskift, `Prefer: count=exact` som kontrol.
- **`grep -r` over `media/_kilder/` gav et falsk 0 for et kinesisk mønster**, hvor `grep -c`
  direkte på filen fandt det. Meldt af `spor/f2-weilanyoubaote` 3. sep. Kontrollér et
  0-resultat mod den enkelte fil, før du konkluderer.
- `.env`, fotos og `media/_kilder/` er kopieret ind.

---

## 10. Commit-rækkefølge og rapport

`BRIEF-FAELLES.md`s seks trin, ét commit pr. trin. **Tag GENISOM AI først og helt færdig** —
den er 49 af dine 60 celler. De fire små bagefter, én ad gangen.

Rapport: `fund/FUND-f2feje.md`, højst 60 linjer plus `spor`-skillens to obligatoriske
sektioner.

**Briefets fakta er påstande.** Afviger noget, du måler — tallene, kolonnefordelingen,
hvor råkilderne ligger — så er afvigelsen **en del af leverancen**, ikke ulydighed.
