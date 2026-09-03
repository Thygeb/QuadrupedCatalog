# BRIEF — `spor/f2-galileo`, GENOPTAGELSE: Yuejia Lingdong og Galileos citatkolonner

**Worktree:** `C:/Praktik/websites/udstilling-wt-f2galileo` · **Gren:** `spor/f2-galileo`
**Du arver et halvfærdigt spor.** Det blev stoppet af orkestratoren 2. sep 2026, fordi
brugsgrænsen var 4 % fra at ramme — ikke fordi noget var galt.
**Forventet pris:** ~380k tokens (10 robotter × ~38k). **Gæt**, ikke krav — mål og rapportér.

---

## 0. Første handling

Kald **`spor`-skillen**. Lykkes kaldet ikke fra din worktree, så læs
`.claude/skills/spor/SKILL.md` fra disk og **skriv i rapporten, at du gjorde det**.

Vurdér desuden `supabase` og `robotdata`. **`fejljagt` er ikke valgfri, hvis noget måler
uventet** — og i netop dette spor er der god grund til at forvente det, se afsnit 6.

---

## 1. Det, du arver — læs dette før alt andet

Sporet nåede **fire af sine seks producenter**: CVTE, Galileo (Tianjin), MicroRoboTech og
Xiaomi er skrevet, 226 rækker i `change_log`, sidste skrivning 2. sep kl. 19:46:20.

**Efterprøvet af orkestratoren 3. sep, så du kan stole på det:** `old_row` mod den levende
række, kolonne for kolonne, i alle fire tabeller — kun hvidlistede kolonner afviger,
**0 talkolonner**, **0 rækker uden for sporets egne producenter**. Det arbejde er godt.

**MEN DER LIGGER UEFTERPRØVET ARBEJDE PÅ DISKEN:**

```
 M db/f2-galileo-skriv.mjs      <- ÆNDRET, ikke committet
?? fund/BRIEF-f2-galileo.md     <- det oprindelige brief, aldrig committet
?? fund/BRIEF-FAELLES.md        <- fælles del (findes nu også på main)
```

**`db/f2-galileo-skriv.mjs` er ændret og ikke committet. Gennemgå den linje for linje mod
`git diff`, før du bruger den.** Den er skrevet af en agent, der blev afbrudt midt i
arbejdet, og ingen har efterprøvet ændringen. Er du i tvivl om en linje, så brug
`db/f2-skriv.mjs` i stedet — det er den kanoniske skrivevej.

**Sporet har INGEN `fund/FUND-f2galileo.md`.** Den skal du skrive, og den skal dække
**både** det, forgængeren nåede, og det, du laver. Skriv tydeligt hvad der er hvis.

---

## 2. Læs først

- `fund/BRIEF-FAELLES.md` — fase 2's fælles del. **Afsnit 5 nedenfor retter dens
  kolonneliste; læs rettelsen, før du følger filen.**
- `fund/OPSKRIFT-fase2.md` og `fund/OPSKRIFT-fase2-cjk.md` — **læs begge og mål selv**,
  hvilken der passer. Antag ikke kinesisk kilde, fordi producenten er kinesisk: et
  tidligere spor målte Unitrees 16 råkildefiler til **100 % engelske, 0 CJK-tegn**.
- `fund/BRIEF-f2-galileo.md` — forgængerens brief. Læs det for kontekst, men **denne fil
  vinder ved konflikt**; den er nyere og bærer to rettelser, forgængeren ikke havde.

---

## 3. Opgaven — 182 danske celler, to producenter

**A. Yuejia Lingdong — 4 robotter, 109 celler. Helt urørt.**

| Kolonne | I alt | Dansk |
|---|---|---|
| `caveat` | 41 | **41** |
| `caveat_wording` | 40 | **40** |
| `applications.note` | 4 | **4** |
| `applications.note_wording` | 4 | **4** |
| `applications.quote` | 12 | **4** |
| `applications.quote_wording` | 12 | **4** |
| `robots.notes` | 8 | **8** |
| `robots.notes_wording` | 4 | **4** |

**B. Galileo (Tianjin) — 6 robotter, 73 celler. `caveat` er allerede ren; det er
citatkolonnerne, der mangler.**

| Kolonne | I alt | Dansk |
|---|---|---|
| `applications.note_wording` | 1 | **1** |
| `applications.quote` | 36 | **36** |
| `applications.quote_wording` | 36 | **36** |

**Bemærk mønstret i B:** forgængeren rensede `caveat` og lod citatkolonnerne stå. Det var
ikke sjusk — dens brief nævnte dem ikke. Se afsnit 5.

---

## 4. Grundmåling — mine tal, som du genmåler FØRST

```
node db/fase2-tjek.mjs --dansk --producent="Yuejia Lingdong"
node db/fase2-tjek.mjs --dansk --producent="Galileo (Tianjin)"
node db/fase2-tjek.mjs --tal   --producent="Yuejia Lingdong"
node db/fase2-tjek.mjs --tal   --producent="Galileo (Tianjin)"
```

**Talaftryk, målt af mig 3. sep umiddelbart før afsendelse:**

- Yuejia Lingdong: `cf4d80922dd5b24b90f9d15696ab8a98bbe548994ba239b7e8a1643c2b21a420`
- Galileo (Tianjin): `d2713f2a4dcc808f4fc968303c24887c5110a3acc65eb7e42c382bc70cdcadb4`

Kør `--tal` igen som allersidste handling. Afviger et aftryk, har du rørt en talkolonne —
**stop og meld det, ret ikke videre.**

---

## 5. Kolonnerne — RETTELSE af `BRIEF-FAELLES.md`, og den er årsagen til dit eget arbejde

**`BRIEF-FAELLES.md`s afsnit "Kolonnerne du må røre" nævner ni kolonner. Kodens hvidliste,
`TEKSTKOLONNE_HVIDLISTE` i `db/f2-skriv.mjs`, tillader tolv.** De fire, prosaen mangler —
`note_wording`, `quote`, `quote_wording`, `alt` — er **præcis de kolonner, der står tilbage
på dansk hos Galileo (Tianjin)**. Det er STATUS.md Å143's fund.

**Den gældende liste er kodens.** Læs den selv og citér den i din rapport.

**Alt uden for kodens hvidliste er forbudt** — `value_number`, `minimum`, `maximum`,
`unit`, `state`, `form`, `operator`, `source`, `retrieved_at`, billedstier.

**`caveat_class` må kun sættes til null under L87, ALDRIG oversættes.** Dens værdier er
`elaboration`, `validity` og `ikke_oplyst`; `ikke_oplyst` har **2.194 kodereferencer** og
er en sentinel, ikke prosa.

---

## 6. DETEKTOREN LYVER IKKE, MEN DEN SER IKKE ALT — nyt siden forgængerens brief

`db/fase2-tjek.mjs`s `erDansk()` er **to-benet: æøå ELLER et markørord fra en liste på 80**.
Filens egen kommentar på linje 211 siger det ligeud: *"en dansk saetning uden æøå OG uden
et af disse ord slipper igennem"*.

**To spor fandt uafhængigt hver sin instans 3. sep:** `"Fodnote"` (DEEP, `2193/slope`) og
`"Ladestander, tilvalg."` (Youbaote, `docking_station`) — sidstnævnte i en celle, briefet
havde kaldt *"allerede engelsk"*.

**Konsekvensen for dig: `--dansk` giver 0 er IKKE bevis for, at der ikke er dansk tilbage.**
Så ud over instrumentets liste skal du **læse dine to producenters korte celler igennem
med øjnene** — dem uden æøå, som instrumentet kalder engelske. De korte er farligst, fordi
en lang dansk sætning næsten altid rammer et markørord, mens et enkelt ord som "Fodnote"
ikke gør.

**Rapportér to tal:** hvor mange celler du læste ud over instrumentets fund, og hvor mange
danske du fandt dér. **Nul fundne uden en tælling er ikke en gennemlæsning.**

---

## 7. L87 og de to spørgsmål, der IKKE er dine at afgøre

L87: ordlydsfelterne bærer kildens ord ordret; vores egen prosa må stå, men **kun når hver
påstand kan efterprøves i en råkildefil** — kan den ikke, **slettes den, den oversættes ikke**.

**ÅBENT SPØRGSMÅL, som venter på JPK — rør det ikke:** må et ordlydsfelt indeholde vores
eget narrativ? To spor rejste det uafhængigt 3. sep. Møder du et `quote_wording` eller
`note_wording`, der blander vores indledning med kildens ord, så **oversæt det som det er
og lad strukturen stå — og skriv det i rapporten.** Omstrukturér ikke.
Dit arbejde er 36 `quote`/`quote_wording`-par hos Galileo, så du vil møde det.

**RIVR (2230) og Boston Dynamics (2188) er ikke dine.** De har deres eget spor.

---

## 8. Rækkeejerskab og filejerskab

**Rækker:** kun `robot_id` hos **Yuejia Lingdong** og **Galileo (Tianjin)**. Nul udenfor.
**Rør ikke CVTE, MicroRoboTech eller Xiaomi** — deres rest hører til fejesporet, som kører
parallelt med dig. Rører I begge dem, kolliderer I i databasen.

**Filer, du ejer:** `fund/FUND-f2galileo.md` · `fund/BRIEF-f2-galileo2.md` ·
`fund/f2galileo-*` · `db/f2-galileo-skriv.mjs` (kun hvis du beholder den, se afsnit 1).

**Rør ikke:** `data/robots/`, `tools/`, `assets/`, `tests/`, `STATUS.md`, `CLAUDE.md`,
`DESIGN.md`, `db/f2-skriv.mjs`, `db/fase2-tjek.mjs`.

---

## 9. Acceptkriterier

1. **Yuejia Lingdong:** `--dansk` giver i dag **109**. Færdig ved **0** plus eventuelle
   dokumenterede L87-tvivlstilfælde, ét pr. linje i rapporten.
2. **Galileo (Tianjin):** `--dansk` giver i dag **73**. Samme færdigkriterium.
3. **Talaftryk uændrede** for begge. Giver i dag `cf4d80…c2b21a420` og `d2713f…0cdcadb4`.
4. **Nul rækker uden for dine to producenter.** Forespørg `change_log` på
   `changed_by='spor/f2-galileo'` **med et tidsfilter efter din egen start** — tabellen
   indeholder allerede forgængerens 226 rækker på fire ANDRE producenter, så en
   forespørgsel uden tidsfilter vil se dem og ligne en ejerskabsfejl. Det er den ikke.
5. **Gennemlæsning ud over instrumentet**, jf. afsnit 6: to tal.
6. **Hvert beholdt citat efterprøvet mod råkilde:** to tal — efterprøvede fragmenter, og
   hvor mange der ikke kunne findes.

---

## 10. Miljø

- **Kør IKKE `node tests/koer.mjs`** (2,8 GB) og **IKKE `tools/build.mjs`**. Du rører ikke kode.
- **Node ikke på PATH i Git Bash:** `"/c/Program Files/nodejs/node.exe"`.
  `exit 127` med `command not found` er PATH; med `Assertion failed … src\win\async.c` er
  det libuv efter et `fetch`.
- **Læs aldrig en exitkode gennem en pipe.** `| tail -3` giver pipens kode.
- **En MSYS-sti som argument til node bliver læst som en Windows-sti.** `/c/Praktik/...`
  blev til `C:\c\Praktik\...`, og værktøjet kvitterede med exit 0 og en tom målmappe.
  Brug `C:/...` i ethvert argument, der når node.
- **PostgREST kapper ved 1000 rækker uden fejl.** `field_entries` har 2541. Brug `Range`
  med sideskift og `Prefer: count=exact` som kontrol.
- `.env`, `assets/fotos/fabrikant/` og `media/_kilder/` ligger allerede i din worktree.

---

## 11. Commit-rækkefølge og rapport

Følg `BRIEF-FAELLES.md`s seks trin, ét commit pr. trin. **Tag Yuejia Lingdong først og helt
færdig**, før Galileo (Tianjin) — dør sporet, er én producent så hel frem for to halve.
Din forgænger døde midt i arbejdet; det er derfor, den regel står her.

Rapport: `fund/FUND-f2galileo.md`, højst 60 linjer plus `spor`-skillens to obligatoriske
sektioner. **Dæk både forgængerens fire producenter og dine to.**

**Briefets fakta er påstande.** Afviger noget, du måler — tallene, robot-id'erne,
kolonnelisten, tilstanden af den arvede `db/f2-galileo-skriv.mjs` — så er afvigelsen
**en del af leverancen**, ikke ulydighed.
