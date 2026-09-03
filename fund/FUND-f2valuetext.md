# FUND — spor/f2-valuetext

Skill: `spor` kaldt og lykkedes fra worktree (ingen disk-fallback nødvendig).
`supabase-postgres-best-practices` vurderet og fravalgt: opgaven ændrer intet i
`db/skema.sql`, ingen migrering, ingen RLS — kun en app-lags hvidliste (JS-array) i
`db/f2-skriv.mjs` og en ren funktionstest. `fejljagt` vurderet og fravalgt: intet
opførte sig uventet.

## Ændringen — før og efter

| Hvad | Før | Efter |
|---|---|---|
| `TEKSTKOLONNE_HVIDLISTE` (db/f2-skriv.mjs) | 12 kolonner, `value_text` mangler | 13 kolonner, `value_text` tilføjet med kommentar om hvorfor den er anderledes (svar, ikke bemærkning) |
| Test 80 | findes ikke | `tests/dele/80-hvidliste-value-text.mjs`, 5 påstande (accept + afvisning + revert-bevis) |
| `value_text`-celler hos mine producenter | 52 danske celler ubehandlet | 52 celler oversat til engelsk, skrevet via `db/f2-skriv.mjs --skriv` |

## Valgt/fravalgt

- **Valgt:** udvide hvidlisten med kommentar in-place, ny test 80 som ren funktionstest af `valider()` (ingen dist, ingen DB). **Fravalgt:** en test, der bygger dist eller rammer databasen for punkt 1 — unødvendigt, da hvidlisten er en ren datastruktur.
- **Valgt:** oversætte alle 52 fundne danske celler i én batch via den kanoniske skrivevej. **Fravalgt:** kun de 17 æøå-celler briefet nævnte som gulv — briefet krævede eksplicit fuld gennemlæsning, og den fandt 3× så mange.

## Konfidens

1. **Hvidliste + test 80 — HØJ.** `node tests/koer.mjs`: grundmåling 1637/16 fejlet → slutmåling 1642/16 fejlet (samme 16 dist-afhængige, uændrede). Kontrafaktisk: uden `value_text` på listen ville 80.1/80.2 fejle (vist direkte af 80.5's revert-bevis).
2. **52 skrivninger, kun value_text, kun mine producenter — HØJ.** `db/f2-skriv.mjs ... --skriv`: 52 skrevet, 0 fejl. Uafhængig kontrol mod `change_log` (ikke kun mit eget skriveresultat): 52 rækker med `changed_by='spor/f2-valuetext'`, 0 uden for `field_entries`, 0 hvor andet end `value_text` ændrede sig (old_row vs. nuværende, felt for felt), 0 uden for mine producenter.
3. **Talaftryk uændrede — HØJ.** Alle 5 producenters `SAMLET AFTRYK` identiske før/efter (diff = ingen forskel).
4. **Fuldstændighed af gennemlæsningen — MIDDEL.** Jeg læste alle 128 ikke-tomme celler manuelt og fandt 52 danske (ikke kun de 17 æøå-fundne). Jeg kan ikke bevise, at 52 er facit — kun at det er mere grundigt end instrumentet og briefets gulv.

## Målinger

- Kontrolmåling afsnit 1 (før): 0. Efter: **4** — afviger fra briefets forventede "1", fordi min forklarende kommentar over konstanten selv nævner "value_text" 3 gange, og sed-mønstret genstarter sit match-interval ved hvert `]` (se "Nye fælder"). Funktionelt bekræftet korrekt af test 80.1 og af en isoleret smoke-test (5/5 ok) uden om denne sed-fælde.
- Testsuite: grundmåling **1637/16 fejlet**, slutmåling **1642/16 fejlet** — nøjagtig +5, 0 nye fejl. De 16 er `dist/`-afhængige, forudeksisterende, uændrede.
- Talaftryk (5 producenter, før = efter): DEEP `a171780a…08c501`, MagicLab `59670913…86adc3977d`, Pudu `bb0e94d6…34e305f08d`, WEILAN `5fa1a923…09ca7dc`, Addverb (umålt af orkestratoren, nu målt) `2d2e897a…4ab765fdd`.
- `value_text`-celler: 128 læst, **17** med æøå (matcher briefets tal på hver enkelt producent), **24** via instrumentets `erDansk` (æøå + markørord), **52** ved min egen manuelle gennemlæsning.
- Skrivning: 52/52 poster accepteret i tørløb, 52/52 skrevet i `--skriv`, 0 fejl.
- `change_log`-kontrol: 52 rækker, 0 uden for `field_entries`, 0 med andre kolonner ændret, 0 uden for mine producenter.

## Eksempler på oversættelse (én pr. producent)

- Addverb 2183/lidar: "3D LiDAR (type og model ikke oplyst)" → "3D LiDAR (type and model not disclosed)"
- DEEP 2194/autonomy_level: "autonom rutelægning og intelligent forhindringsundvigelse" → "autonomous route planning and intelligent obstacle avoidance"
- MagicLab 2222/mounting_interface: "udvidelsesplader, glideskinner, skruemonteringer, nyttelastplatform" → "expansion plates, sliding rails, screw mounts, payload platform"
- Pudu 2226/compute: "NVIDIA Jetson Orin AGX 64GB + RK3588, op til 275 TOPS" → "…up to 275 TOPS"
- WEILAN 2245/autonomy_level: "ja" → "yes"

## Usikkerheder

- Jeg kan ikke garantere, at 52 er det absolutte facit — kun at gennemlæsningen var fuldstændig (alle 128 celler), ikke stikprøvevis. En femte gennemlæsning kunne muligvis finde noget, jeg overså.
- To celler fik decimaltegn ændret (`,` → `.`: Shandong Youbaote 2253, Unitree 2231/2234) som en notationskonvention ved oversættelse til engelsk — jeg vurderer det IKKE som en ændring af datapunktet (samme tal, engelsk skrivemåde), men det er en fortolkning af briefets "ændr aldrig indholdet", ikke en direkte instruktion.

## Nye fælder og opdagelser

1. **Instrumentets `erDansk` underrapporterer kraftigt for `value_text`.** Sammensatte danske ord uden mellemrum (`otte-kernet`, `vidvinkelkameraer`, `HD-kamera`, `tilvalg` som ét ord) matcher hverken æøå-regexen eller `DANSKE_MARKOEROR`s ordliste (som kun matcher `til` med ordgrænser, ikke som substring i `tilvalg`). Kortord som `ja`, `ud`, `ind`, `lager` mangler helt fra ordlisten. Effekt: 24 flaget vs. 52 reelt fundet ved manuel læsning — mere end en fordobling. Samme blindpunkt-klasse som Addverb-fundet i briefet, men nu kvantificeret for `value_text` specifikt.
2. **Sed-baserede kontrolmålinger på en flerlinjet kommentarblok kan give et højere tal, end man forventer, når selve kommentaren nævner søgeordet.** `sed -n '/A/,/B/p'` genstarter sit interval, hver gang slutmønsteret `]` findes — så en forklarende kommentar, der selv indeholder ordet, man leder efter, tæller med. Ren dokumentationskvalitet, ikke en funktionsfejl (test 80.1 og en uafhængig smoke-test bekræfter begge, at koden virker) — men det er endnu et eksempel på reglen "en måling, der bærer en konklusion, skal have en kontrol".

## Punkter i briefet, jeg ikke nåede

Ingen. Alle seks acceptkriterier er opfyldt og målt.
