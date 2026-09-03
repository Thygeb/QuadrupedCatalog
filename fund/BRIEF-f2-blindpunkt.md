# BRIEF — `spor/f2-blindpunkt`: det dansk, instrumentet ikke kan se

**Worktree:** `C:/Praktik/websites/udstilling-wt-blindpunkt` · **Gren:** `spor/f2-blindpunkt`
**Forgrenet fra main `90c27a5`.**
**Forventet pris:** ~350k tokens. **Gæt**, ikke krav — mål og rapportér.

**Dette spor er en GENNEMLÆSNING, ikke en oversættelsesopgave.** Din leverance er først og
fremmest **et tal, ingen har i dag**: hvor meget dansk står der i databasen, som
`db/fase2-tjek.mjs` ikke kan se? Rettelserne kommer bagefter.

---

## 0. Første handling

Kald **`spor`-skillen**. Lykkes kaldet ikke fra din worktree, så læs
`.claude/skills/spor/SKILL.md` fra disk og **skriv i rapporten, at du gjorde det**.
Vurdér desuden `supabase` og `fejljagt`.

---

## 1. Hvorfor du findes — STATUS.md Å156

`db/fase2-tjek.mjs`s `erDansk()` er **to-benet: æøå ELLER et markørord fra en liste på 80.**
Filens egen kommentar på linje 211 siger det ligeud:

> *"en dansk saetning uden æøå OG uden et af disse ord slipper igennem"*

**To spor fandt uafhængigt hver sin instans 3. sep 2026:**

- `"Fodnote"` — `spor/f2-deep`, robot `2193`, felt `slope`
- `"Ladestander, tilvalg."` — `spor/f2-weilanyoubaote`, felt `docking_station`.
  **Den stod i en celle, briefet havde kaldt *"allerede engelsk"*.**

**Konsekvensen:** hvert tal, fase 2 er styret efter — 553, 244, og hvert acceptkriterium der
siger 0 — er et **GULV, ikke et facit**. Ingen ved hvor stort blindpunktet er.
**Det er dit spors opgave at gøre det til et målt tal.**

**Læg mærke til fældens form, for den er grunden til, at ingen fandt den før:** instrumentet
fejler ikke. Det svarer `0`, exit 0, og ser rigtigt ud. Der er intet at undre sig over.

---

## 2. Søgerummet — 392 celler, 16 producenter

De **korte celler uden æøå** er kandidatfeltet: en lang dansk sætning rammer næsten altid et
markørord, mens et enkelt ord som "Fodnote" ikke gør. Målt af mig 3. sep, kolonnerne
`value_text`, `caveat`, `caveat_wording` og `applications.note`, længde under 60 tegn:

| Producent | Celler | | Producent | Celler |
|---|---|---|---|---|
| Unitree Robotics | **173** | | Ghost Robotics | 12 |
| MicroRoboTech | **45** | | NEURA Robotics | 8 |
| DEEP Robotics | **41** | | Keybotic | 7 |
| Addverb | 19 | | Pudu Robotics | 6 |
| MagicLab | 18 | | Bhairav Robotics | 4 |
| ANYbotics | 16 | | WEILAN | 3 |
| Rainbow Robotics | 14 | | Raion Robotics | 2 |
| MAB Robotics | 12 | | | |
| Shandong Youbaote | 12 | | **I alt** | **392** |

**Tallet 392 er MIT, målt med min egen SQL, og det er et gæt om afgrænsningen — ikke et
krav.** Grænsen på 60 tegn og de fire kolonner er mine valg. **Mål selv, og udvid, hvis du
finder dansk lige uden for grænsen** — så har du fundet noget om selve metoden, og det er
mere værd end de celler, du retter.

---

## 3. Opgaven

1. **Læs de 392 celler igennem med øjnene.** Ikke med en regex — det er hele pointen. En
   regex kan kun finde det, nogen allerede har tænkt på, og det er præcis dét, der fejlede.
2. **For hver celle, du bedømmer som dansk:** oversæt den til engelsk efter L87's regel,
   nøjagtig som de øvrige fase 2-spor.
3. **Rapportér tallet.** Hvor mange celler du læste, hvor mange du bedømte som danske, og
   hvor mange du var i tvivl om. **Tvivlstilfælde skal listes enkeltvis** — de er data om
   sproggrænsen, ikke fejl.
4. **Foreslå, hvordan detektoren kan lukkes.** Du har læst materialet; ingen andre har.
   **Ret den IKKE** — `db/fase2-tjek.mjs` er ikke din fil, og en ændring dér ville ugyldiggøre
   alle andre spors grundmålinger midt i deres arbejde. Skriv forslaget i rapporten:
   hvilke ord manglede på listen, og hvad ville have fanget de celler, du fandt.

---

## 4. KOLONNEEJERSKAB — læs dette, det er skarpere end normalt

`spor/f2-valuetext` kører parallelt med dig og **ejer kolonnen `value_text` alene**.

**Du må LÆSE `value_text`** — den er en stor del af dit søgerum — **men du må ALDRIG skrive
i den.** Finder du dansk i `value_text`, så **skriv det i rapporten som en liste med
robot-id og feltnavn** i stedet for at rette det. Jeg giver listen videre.

Grunden er ikke høflighed: `value_text` står **ikke** i `TEKSTKOLONNE_HVIDLISTE` i
`db/f2-skriv.mjs`, så den kanoniske skrivevej kan slet ikke skrive den. Det andet spor
lukker det hul. Forsøger du selv, ender du med at skrive uden om det eneste værn, vi har.

**Dine kolonner:** `caveat`, `caveat_wording`, `note`, `note_wording`, `notes`,
`notes_wording`, `quote`, `quote_wording`, `alt` — altså hvidlisten minus `caveat_class`.

---

## 5. Producenter, du IKKE må røre — tre spor kører parallelt

| Spor | Producenter |
|---|---|
| `spor/f2-galileo` | Yuejia Lingdong · Galileo (Tianjin) |
| `spor/f2-feje` | GENISOM AI · Astrall Dynamics · CVTE · Yufan Intelligent · Xiaomi |
| `spor/f2-kildejagt` | RIVR (2230) · Boston Dynamics (2188) |

De ni er **ude af dit søgerum**. Tabellen i afsnit 2 er allerede renset for dem.

---

## 6. Grundmåling

```
node db/fase2-tjek.mjs --dansk
node db/fase2-tjek.mjs --tal
```

**Giver i dag: 244 danske celler i alt** (Yuejia 109 · Galileo 73 · GENISOM 49 · haler 13)
— **alle ni hos de tre andre spor. Hos DINE 16 producenter giver instrumentet 0.**

**Det nul er hele din opgaves præmis.** Finder du dansk hos dem, har du målt blindpunktet.
Finder du intet, har du også målt det — og det er et lige så vigtigt resultat, som skal
rapporteres med den tælling, der understøtter det.

**Talaftrykket, `--tal` uden producentfilter, skal være uændret til sidst.** Kør det først,
gem det, kør det sidst. **De tre andre spor skriver samtidig, så et samlet aftryk vil
ændre sig af DERES arbejde.** Brug derfor `--tal --producent=<hver af dine 16>` i stedet, og
sammenlign pr. producent. Skriv aftrykkene ned i dit første commit.

---

## 7. Acceptkriterier

1. **Alle 392 celler er læst.** Rapportér tallet, du faktisk læste — afviger det fra 392,
   så skriv hvorfor (din afgrænsning kan være bedre end min).
2. **Tre tal:** læste · bedømt danske · i tvivl. Tvivl listet enkeltvis.
3. **Hver dansk celle i DINE kolonner er oversat**, eller står med en begrundelse.
4. **Dansk i `value_text` er RAPPORTERET, ikke rettet** — liste med robot-id og feltnavn.
5. **Talaftryk uændret pr. producent** for alle 16.
6. **Nul rækker uden for dine 16 producenter** og nul rækker i `value_text`, målt på
   `changed_by='spor/f2-blindpunkt'`. Giver i dag **0 rækker i alt** — kontrollinjen.
7. **Et forslag til detektoren**, skrevet men ikke bygget.

---

## 8. Miljø

- **Kør IKKE `node tests/koer.mjs`** (2,8 GB) og **IKKE `tools/build.mjs`**.
- **Node ikke på PATH i Git Bash:** `"/c/Program Files/nodejs/node.exe"`.
- **Læs aldrig en exitkode gennem en pipe.**
- **En MSYS-sti som argument til node læses som Windows-sti** — brug `C:/...`.
- **PostgREST kapper ved 1000 rækker uden fejl.** `field_entries` har 2541, og **dit
  søgerum er større end de fleste spors** — det er netop dig, fælden rammer. `Range` med
  sideskift, `Prefer: count=exact` som kontrol.
- **`grep -r` kan give et falsk 0**, hvor `grep -c` på den enkelte fil finder mønstret.

---

## 9. Commit-rækkefølge og rapport

Læsningen er stor. **Commit efter hver producent**, ikke til sidst — Unitree alene er 173
celler, og et spor, der dør efter 170 læste celler uden commit, har intet leveret.
Rækkefølge: tag de tre store først (Unitree, MicroRoboTech, DEEP = 259 af 392), så de øvrige.

Rapport: `fund/FUND-f2blindpunkt.md`. **Ud over `spor`-skillens 60 linjer må du vedlægge en
separat fil `fund/f2blindpunkt-fundne-celler.tsv`** med én linje pr. dansk eller tvivlsom
celle: robot-id, feltnavn, kolonne, den danske tekst, din bedømmelse. Den fil er sporets
egentlige værdi og er ikke omfattet af linjeloftet.

**Briefets fakta er påstande** — især de 392 og afgrænsningen bag dem. Måler du noget andet,
er afvigelsen en del af leverancen.
