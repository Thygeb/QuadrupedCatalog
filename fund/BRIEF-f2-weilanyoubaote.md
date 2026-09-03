# BRIEF — `spor/f2-weilanyoubaote`: WEILAN og Shandong Youbaote fra dansk til engelsk

**Worktree:** `C:/Praktik/websites/udstilling-wt-weilanyoubaote` · **Gren:** `spor/f2-weilanyoubaote`
**Forgrenet fra main `996a7bf`** (3. sep 2026).
**Forventet pris:** ~300k tokens (8 robotter × ~38k, målt i forrige runde — det er et
**gæt**, ikke et krav; rapportér dit faktiske forbrug, hvis du kan se det).

Du er ét af tre parallelle fase 2-spor. De to andre har DEEP Robotics og
MagicLab+Pudu. **I deler database.** Rører du en robot uden for WEILAN og
Shandong Youbaote, er sporet forkert, og det bliver målt i `change_log`.

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

## 1. PRODUCENTNAVNET — læs dette, før du kører én eneste kommando

**Producenten hedder `Shandong Youbaote Intelligent Robot`.**

`Yobotics` er **slug-præfikset** (`yobotics-e-dog`, `yobotics-y10`,
`yobotics-y20`), ikke et producentnavn. Der findes **ingen** producent, der hedder
Yobotics — målt 3. sep 2026 mod alle 25 producentnavne i databasen.

**Kører du `--producent=Yobotics`, får du nul rækker og et instrument, der siger
"ingenting at gøre".** STATUS.md Å139 sender netop dette arbejde videre under
navnet "Yobotics", og det er en dokumentfejl, ikke en anden producent.

---

## 2. Læs først

- `fund/BRIEF-FAELLES.md` — fase 2's fælles del. **Ligger i din worktree, men er
  IKKE på main** (den er kun committet på de tidligere spors grene). Læs afsnit 7
  nedenfor: dens kolonneliste er ufuldstændig, og det er målt.
- `fund/OPSKRIFT-fase2.md` og `fund/OPSKRIFT-fase2-cjk.md` — **læs begge, og
  afgør selv hvilken der er din primære.** WEILAN og Youbaote er kinesiske
  producenter, men et tidligere spor antog det samme om Unitree og målte sig
  frem til, at alle 16 råkildefiler var **100 % engelske, 0 CJK-tegn**.
  **Mål sproget i dine egne kilder, før du vælger opskrift** — og skriv målingen.
- `CLAUDE.md`, især værktøjsafsnittet (Node-fælden: intet `process.exit()` efter
  et `fetch`).

---

## 3. Grundmålingen — mine tal, som du skal genmåle FØRST

Kør disse fire før du ændrer noget, og skriv dine egne tal i rapporten.
**Afviger de fra mine, er det din måling der gælder — meld afvigelsen.**

```
node db/fase2-tjek.mjs --dansk --producent="WEILAN"
node db/fase2-tjek.mjs --dansk --producent="Shandong Youbaote Intelligent Robot"
node db/fase2-tjek.mjs --tal   --producent="WEILAN"
node db/fase2-tjek.mjs --tal   --producent="Shandong Youbaote Intelligent Robot"
```

**Giver i dag (målt af mig 3. sep 2026, umiddelbart før afsendelse):**

| Kolonne | WEILAN i alt | dansk | Youbaote i alt | dansk |
|---|---|---|---|---|
| `caveat` | 36 | **36** | 25 | **21** |
| `caveat_wording` | 0 | 0 | 1 | **1** |
| `applications.note` | 5 | **5** | 3 | **3** |
| `robots.notes` | 21 | **21** | 8 | **8** |
| `applications.quote` | 3 | 0 | 3 | 0 |
| **I alt** | | **62** | | **33** |

**Samlet for sporet: 95 danske celler.**

**Bemærk Youbaotes `caveat`: 25 i alt, 21 danske.** De fire, der ikke er danske,
er allerede engelske — rør dem ikke, og lad være med at "rette" dem til noget
andet. Youbaote er den eneste af dine to, hvor kolonnen ikke er helt dansk.

**Talaftrykkene, `--tal`, giver i dag:**

- WEILAN: `5fa1a923731e85704686dafe0d2062e6fb989cbe6f2d0c60bb1a3ac6909ca7dc`
- Shandong Youbaote: `244f07ce0f603838418c54eab1715ba81c00ae48840e04203eb389852b83c4b7`

De aftryk er hele beviset for, at **intet tal rørte sig**. Kør `--tal` igen som
allersidste handling for begge producenter. Er et aftryk et andet, har du rørt en
talkolonne, og sporet skal stoppe og melde det — ikke rette videre.

---

## 4. Opgaven

**Oversæt WEILAN's og Shandong Youbaotes 95 danske celler til engelsk**, efter
L87's tekstregel i `BRIEF-FAELLES.md`: ordlydsfelterne bærer kildens ord ordret;
vores egen prosa må stå, men **kun når hver påstand kan efterprøves i en
råkildefil** — kan den ikke, **slettes den, den oversættes ikke**.

WEILAN har **5 robotter**, Shandong Youbaote **3** (robot-id 2244–2248 og
2251–2253; verificér selv listerne). WEILAN's råkilder ligger i
`media/_kilder/raa-kina-weilan-xiaomi-2026-08-19/` — **den mappe rummer også
Xiaomi, som IKKE er din.** Læs kun WEILAN's del af den.

**Youbaote har ingen mappe med sit navn — hverken under "Youbaote" eller
"Yobotics".** Jeg har kopieret **hele** `media/_kilder/` ind i din worktree
(20 mapper), så søg efter materialet dér. Findes det ikke, så hent friskt over
HTTP og skriv den nye hentedato — lad aldrig et snapshot fra én dato bære et
citat indsamlet en anden. **Skriv i rapporten, hvor Youbaotes kilder lå, eller at
de måtte hentes på ny.**

---

## 5. L87's tvivlsregel — og de to tilfælde, der IKKE er dine

Kan en påstand hverken efterprøves eller trygt slettes, så **lad den stå på
dansk og skriv den i rapporten**. Det er den rigtige adfærd, ikke en fiasko.

**RIVR (robot 2230) og Boston Dynamics (2188) er allerede sådanne tilfælde og
venter på JPK's beslutning. Ingen af dem er dine — rør dem ikke.**

---

## 6. Rækkeejerskab og filejerskab

**Rækker, du må skrive:** kun rækker hvis `robot_id` tilhører **WEILAN** eller
**Shandong Youbaote Intelligent Robot**. Nul rækker uden for de to — og især
**ingen Xiaomi**, selv om den deler kildemappe med WEILAN. Xiaomi er allerede
skrevet af `spor/f2-galileo`. Det efterprøves i `change_log` af mig ved flettet.

**Filer, du ejer:**

- `fund/FUND-f2weilanyoubaote.md` — din rapport
- `fund/BRIEF-f2-weilanyoubaote.md` — dette brief
- `fund/f2weilanyoubaote-*` — dine egne måle- og snapshotfiler

**Rør ikke:** `data/robots/`, `tools/`, `assets/`, `tests/`, `STATUS.md`,
`CLAUDE.md`, `DESIGN.md`, `db/*.mjs`. `db/f2-skriv.mjs` **bruges**, men ændres ikke.

---

## 7. Kolonnerne — RETTELSE af `BRIEF-FAELLES.md`, målt 3. sep 2026

**`BRIEF-FAELLES.md`s afsnit "Kolonnerne du må røre" er ufuldstændigt.** Det
nævner ni kolonner. Kodens hvidliste, `TEKSTKOLONNE_HVIDLISTE` i
`db/f2-skriv.mjs`, tillader **tolv**. Det er STATUS.md Å143's fund, og det er
grunden til, at tre spor meldte færdigt og efterlod dansk i citatkolonnerne.

**Den gældende liste er kodens.** Læs den selv i `db/f2-skriv.mjs` og citér den i
din rapport.

**Alt uden for kodens hvidliste er forbudt.** Rører du `value_number`, `minimum`,
`maximum`, `unit`, `state`, `form`, `operator`, `source`, `retrieved_at` eller en
billedsti, er sporet forkert.

**`caveat_class` må kun sættes til null under L87 — den må ALDRIG oversættes.**
Målt 3. sep: dens værdier er `elaboration`, `validity` og `ikke_oplyst`, og
`ikke_oplyst` har **2.194 kodereferencer**. Den er en sentinel, ikke prosa.

---

## 8. Acceptkriterier — ét pr. punkt, alle kørt mod databasen i dag

1. **Ingen dansk tilbage hos WEILAN.**
   `node db/fase2-tjek.mjs --dansk --producent="WEILAN"`
   Giver i dag **62 danske celler**. Færdig, når summen er **0** — eller når
   resten er dokumenterede L87-tvivlstilfælde, ét pr. linje i rapporten.
2. **Ingen dansk tilbage hos Shandong Youbaote.**
   `node db/fase2-tjek.mjs --dansk --producent="Shandong Youbaote Intelligent Robot"`
   Giver i dag **33 danske celler**. Samme færdigkriterium.
   **0 er et krav; antallet af tvivlstilfælde er ukendt — mål det, gæt det ikke.**
3. **Intet tal har rørt sig, i nogen af de to.**
   `node db/fase2-tjek.mjs --tal --producent=<hver af de to>`
   Giver i dag `5fa1a9…909ca7dc` og `244f07…52b83c4b7`. Færdig, når **begge** er
   uændrede.
4. **Nul rækker uden for dine robotter.**
   Din egen forespørgsel mod `change_log` på
   `changed_by = 'spor/f2-weilanyoubaote'`, joinet mod `robots.manufacturer`.
   Færdig, når **alle** rækker er WEILAN eller Shandong Youbaote. Giver i dag
   **0 rækker** i alt, fordi sporet ikke har skrevet endnu — det er
   kontrollinjen: ser du et tal her før du skriver, måler du forkert.
5. **Hvert beholdt citat er efterprøvet mod en råkilde.** Rapportér **to tal**:
   hvor mange fragmenter du efterprøvede, og hvor mange der ikke kunne findes.
   *Nul fundne fejl uden en tælling er ikke en efterprøvning.*

---

## 9. Miljø

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

## 10. Commit-rækkefølge — en skrive-grænse, ikke en commit-grænse

Følg `BRIEF-FAELLES.md`s seks trin, ét commit pr. trin: grundmåling →
klassificér → efterprøv citater → skriv teksterne + tørløb → skriv til databasen
+ mål efter → rapport.

**Skriv aldrig alt i ét kald.** Et spor, der dør i trin 5, skal kunne genoptages
fra trin 4's commit. To spor er døde midt i arbejdet i dette projekt, og det var
commits undervejs, der reddede det ene.

**Tag producenterne én ad gangen** — WEILAN helt færdig og committet, før
Youbaote begyndes. Dør sporet, er én producent så hel frem for to halve.

---

## 11. Rapporten

`fund/FUND-f2weilanyoubaote.md`. Højst 60 linjer plus `spor`-skillens to
obligatoriske sektioner (*"Nye fælder og opdagelser"* og *"Punkter i briefet, jeg
ikke nåede"*). Konfidens efter skillens skala — **høj kræver en genkørbar
kommando plus en kontrafaktisk linje**, ellers er den middel.

**Briefets fakta er påstande.** Afviger noget, du måler, fra noget, jeg her
påstår — tallene, robot-id'erne, kolonnelisten, hvor Youbaotes kilder ligger — så
er afvigelsen **en del af leverancen**, ikke ulydighed. To agenter rettede mine
fakta i sidste runde, begge på eget initiativ, begge korrekt.
