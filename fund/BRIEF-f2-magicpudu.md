# BRIEF — `spor/f2-magicpudu`: MagicLab og Pudu Robotics fra dansk til engelsk

**Worktree:** `C:/Praktik/websites/udstilling-wt-magicpudu` · **Gren:** `spor/f2-magicpudu`
**Forgrenet fra main `996a7bf`** (3. sep 2026).
**Forventet pris:** ~230k tokens (6 robotter × ~38k, målt i forrige runde — det er et
**gæt**, ikke et krav; rapportér dit faktiske forbrug, hvis du kan se det).

Du er ét af tre parallelle fase 2-spor. De to andre har DEEP Robotics og
WEILAN+Youbaote. **I deler database.** Rører du en robot uden for MagicLab og
Pudu Robotics, er sporet forkert, og det bliver målt i `change_log`.

---

## 0. Første handling

Kald **`spor`-skillen**. Den bærer grundmålingen, skrive-grænsen, kontrollinjen,
filejerskabet, selv-efterprøvningen, rapportformen, konfidensskalaen og
miljøfælderne. Lykkes kaldet ikke fra din worktree, så læs
`.claude/skills/spor/SKILL.md` fra disk og **skriv i rapporten, at du gjorde det**.

Vurdér desuden `supabase`-skillen (du skriver mod Supabase) og `robotdata`
(feltskemaet, især G1). Skriv hvilke du valgte, og hvilke du gik forbi.

**`fejljagt` er ikke valgfri, hvis noget måler forkert.** Giver et tal ikke
mening, så kald den frem for at gætte.

---

## 1. Læs først

- `fund/BRIEF-FAELLES.md` — fase 2's fælles del. **Ligger i din worktree, men er
  IKKE på main** (den er kun committet på de tidligere spors grene). Læs afsnit 6
  nedenfor: dens kolonneliste er ufuldstændig, og det er målt.
- `fund/OPSKRIFT-fase2.md` og `fund/OPSKRIFT-fase2-cjk.md` — **læs begge, og
  afgør selv hvilken der er din primære.** MagicLab og Pudu er kinesiske
  producenter, men et tidligere spor antog det samme om Unitree og målte sig
  frem til, at alle 16 råkildefiler var **100 % engelske, 0 CJK-tegn**.
  **Mål sproget i dine egne kilder, før du vælger opskrift** — og skriv målingen.
- `CLAUDE.md`, især værktøjsafsnittet (Node-fælden: intet `process.exit()` efter
  et `fetch`).

---

## 2. Grundmålingen — mine tal, som du skal genmåle FØRST

Kør disse fire før du ændrer noget, og skriv dine egne tal i rapporten.
**Afviger de fra mine, er det din måling der gælder — meld afvigelsen.**

```
node db/fase2-tjek.mjs --dansk --producent="MagicLab"
node db/fase2-tjek.mjs --dansk --producent="Pudu Robotics"
node db/fase2-tjek.mjs --tal   --producent="MagicLab"
node db/fase2-tjek.mjs --tal   --producent="Pudu Robotics"
```

**Giver i dag (målt af mig 3. sep 2026, umiddelbart før afsendelse):**

| Kolonne | MagicLab i alt | dansk | Pudu i alt | dansk |
|---|---|---|---|---|
| `caveat` | 53 | **53** | 31 | **31** |
| `applications.note` | 4 | **4** | 2 | **2** |
| `applications.note_wording` | 1 | **1** | 0 | 0 |
| `robots.notes` | 11 | **11** | 2 | **2** |
| `applications.quote` | 5 | 0 | 2 | 0 |
| `images.alt` | 1 | 0 | 0 | 0 |
| **I alt** | | **69** | | **35** |

**Samlet for sporet: 104 danske celler.**

**Talaftrykkene, `--tal`, giver i dag:**

- MagicLab: `596709137cf961440e755197f49df088a49b8dffcf003aaf4ba61286adc3977d`
- Pudu Robotics: `bb0e94d61eda255140d751c9c0c661b14a07cb23e7242e5c725fbb34e305f08d`

De aftryk er hele beviset for, at **intet tal rørte sig**. Kør `--tal` igen som
allersidste handling for begge producenter. Er et aftryk et andet, har du rørt en
talkolonne, og sporet skal stoppe og melde det — ikke rette videre.

---

## 3. Opgaven

**Oversæt MagicLab's og Pudu Robotics' 104 danske celler til engelsk**, efter
L87's tekstregel i `BRIEF-FAELLES.md`: ordlydsfelterne bærer kildens ord ordret;
vores egen prosa må stå, men **kun når hver påstand kan efterprøves i en
råkildefil** — kan den ikke, **slettes den, den oversættes ikke**.

MagicLab har **4 robotter**, Pudu Robotics **2** (robot-id 2219–2222 og
2226–2227; verificér selv listerne). MagicLab's råkilder ligger i
`media/_kilder/raa-kina-deep-magic-2026-08-19/`.

**Pudu har ingen mappe med sit navn.** Jeg har kopieret **hele**
`media/_kilder/` ind i din worktree (20 mapper), så søg efter Pudus materiale
dér — sandsynligvis i `raa-producenter-resten-2026-08-19/` eller en `raa-kand*`,
men **det er mit gæt, ikke en måling.** Find det, og skriv i rapporten hvor det
lå. Findes det ikke, så hent friskt over HTTP og skriv den nye hentedato — lad
aldrig et snapshot fra én dato bære et citat indsamlet en anden.

---

## 4. L87's tvivlsregel — og de to tilfælde, der IKKE er dine

Kan en påstand hverken efterprøves eller trygt slettes, så **lad den stå på
dansk og skriv den i rapporten**. Det er den rigtige adfærd, ikke en fiasko.

**RIVR (robot 2230) og Boston Dynamics (2188) er allerede sådanne tilfælde og
venter på JPK's beslutning. Ingen af dem er dine — rør dem ikke.**

---

## 5. Rækkeejerskab og filejerskab

**Rækker, du må skrive:** kun rækker hvis `robot_id` tilhører **MagicLab** eller
**Pudu Robotics**. Nul rækker uden for de to. Det efterprøves i `change_log` af
mig ved flettet.

**Filer, du ejer:**

- `fund/FUND-f2magicpudu.md` — din rapport
- `fund/BRIEF-f2-magicpudu.md` — dette brief
- `fund/f2magicpudu-*` — dine egne måle- og snapshotfiler

**Rør ikke:** `data/robots/`, `tools/`, `assets/`, `tests/`, `STATUS.md`,
`CLAUDE.md`, `DESIGN.md`, `db/*.mjs`. `db/f2-skriv.mjs` **bruges**, men ændres ikke.

---

## 6. Kolonnerne — RETTELSE af `BRIEF-FAELLES.md`, målt 3. sep 2026

**`BRIEF-FAELLES.md`s afsnit "Kolonnerne du må røre" er ufuldstændigt.** Det
nævner ni kolonner. Kodens hvidliste, `TEKSTKOLONNE_HVIDLISTE` i
`db/f2-skriv.mjs`, tillader **tolv**. Det er STATUS.md Å143's fund, og det er
grunden til, at tre spor meldte færdigt og efterlod dansk i citatkolonnerne.

**Den gældende liste er kodens.** Læs den selv i `db/f2-skriv.mjs` og citér den i
din rapport. Den, `BRIEF-FAELLES.md` glemte, og som **du har arbejde i**:
`note_wording` (1 dansk hos MagicLab).

**Alt uden for kodens hvidliste er forbudt.** Rører du `value_number`, `minimum`,
`maximum`, `unit`, `state`, `form`, `operator`, `source`, `retrieved_at` eller en
billedsti, er sporet forkert.

**`caveat_class` må kun sættes til null under L87 — den må ALDRIG oversættes.**
Målt 3. sep: dens værdier er `elaboration`, `validity` og `ikke_oplyst`, og
`ikke_oplyst` har **2.194 kodereferencer**. Den er en sentinel, ikke prosa.

---

## 7. Acceptkriterier — ét pr. punkt, alle kørt mod databasen i dag

1. **Ingen dansk tilbage hos MagicLab.**
   `node db/fase2-tjek.mjs --dansk --producent="MagicLab"`
   Giver i dag **69 danske celler**. Færdig, når summen er **0** — eller når
   resten er dokumenterede L87-tvivlstilfælde, ét pr. linje i rapporten.
2. **Ingen dansk tilbage hos Pudu Robotics.**
   `node db/fase2-tjek.mjs --dansk --producent="Pudu Robotics"`
   Giver i dag **35 danske celler**. Samme færdigkriterium.
   **0 er et krav; antallet af tvivlstilfælde er ukendt — mål det, gæt det ikke.**
3. **Intet tal har rørt sig, i nogen af de to.**
   `node db/fase2-tjek.mjs --tal --producent=<hver af de to>`
   Giver i dag `596709…dc3977d` og `bb0e94…305f08d`. Færdig, når **begge** er
   uændrede.
4. **Nul rækker uden for dine robotter.**
   Din egen forespørgsel mod `change_log` på `changed_by = 'spor/f2-magicpudu'`,
   joinet mod `robots.manufacturer`. Færdig, når **alle** rækker er MagicLab
   eller Pudu Robotics. Giver i dag **0 rækker** i alt, fordi sporet ikke har
   skrevet endnu — det er kontrollinjen: ser du et tal her før du skriver, måler
   du forkert.
5. **Hvert beholdt citat er efterprøvet mod en råkilde.** Rapportér **to tal**:
   hvor mange fragmenter du efterprøvede, og hvor mange der ikke kunne findes.
   *Nul fundne fejl uden en tælling er ikke en efterprøvning.*

---

## 8. Miljø

- **Kør IKKE `node tests/koer.mjs`.** Du rører ikke kode, og suiten koster
  **2,8 GB** i `tests/.tmp-koersel`. Disken er 98 % fuld — det er en hård
  begrænsning i dag, ikke en høflighed.
- **Kør ikke `tools/build.mjs`.** Intet i din opgave når `dist/`.
- Kopieret ind i din worktree, fordi det er gitignoreret: `.env`,
  `assets/fotos/fabrikant/`, `media/_kilder/`, `fund/BRIEF-FAELLES.md`.
- **Node er ikke på PATH i Git Bash.** Brug `"/c/Program Files/nodejs/node.exe"`.
  Får du `exit 127`, så læs fejlteksten: `command not found` er PATH,
  `Assertion failed … src\win\async.c` er libuv-fælden efter et `fetch`.
- **Læs aldrig en exitkode gennem en pipe.** `... | tail -3` giver pipens kode,
  ikke node's. Skriv til en fil og læs `$?` direkte.
- **PostgREST kapper svaret ved 1000 rækker uden en fejl.** `field_entries` har
  2541. Brug `Range` med sideskift og `Prefer: count=exact` som kontrol. Det tog
  en hel måling fra mig 3. sep: 302 så fuldstændig plausibel ud og var 39 % af data.

---

## 9. Commit-rækkefølge — en skrive-grænse, ikke en commit-grænse

Følg `BRIEF-FAELLES.md`s seks trin, ét commit pr. trin: grundmåling →
klassificér → efterprøv citater → skriv teksterne + tørløb → skriv til databasen
+ mål efter → rapport.

**Skriv aldrig alt i ét kald.** Et spor, der dør i trin 5, skal kunne genoptages
fra trin 4's commit. To spor er døde midt i arbejdet i dette projekt, og det var
commits undervejs, der reddede det ene.

**Tag producenterne én ad gangen** — MagicLab helt færdig og committet, før Pudu
begyndes. Dør sporet, er én producent så hel frem for to halve.

---

## 10. Rapporten

`fund/FUND-f2magicpudu.md`. Højst 60 linjer plus `spor`-skillens to obligatoriske
sektioner (*"Nye fælder og opdagelser"* og *"Punkter i briefet, jeg ikke nåede"*).
Konfidens efter skillens skala — **høj kræver en genkørbar kommando plus en
kontrafaktisk linje**, ellers er den middel.

**Briefets fakta er påstande.** Afviger noget, du måler, fra noget, jeg her
påstår — tallene, robot-id'erne, kolonnelisten, hvor Pudus kilder ligger — så er
afvigelsen **en del af leverancen**, ikke ulydighed. To agenter rettede mine
fakta i sidste runde, begge på eget initiativ, begge korrekt.
