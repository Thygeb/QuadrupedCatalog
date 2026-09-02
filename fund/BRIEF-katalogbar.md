# BRIEF — spor/katalog3: SELECTED-baren skal kun leve i bunden af skærmen

**Model:** Opus (L45 — leverancen dømmes med øjne).
**Skærm:** katalogsiden = `dist/da/index.html` og `dist/en/index.html`. MODE: **Operate**.
**Worktree:** `C:/Praktik/websites/udstilling-wt-katalog3` · **gren:** `spor/katalog3` · **base:** `a405066`.
**Egen serverport: 8231.** Aldrig 8080.

## Opgaven, ordret fra JPK

> "selected to compare baren skal kun leve i bunden af skærmen"

Katalogsiden viser i dag **to** udgaver af det samme udvalg:

1. **Den klæbende bundbjælke** — `.klaebebar`, `system.css:2235` (`position:fixed;bottom:0`),
   bygget af `assets/katalog.js:145-176`. Den viser **navne**, ikke et antal. **Den skal blive.**
2. **En chip inde i filterpladen** — `.saml-taeller`, udsendt af
   `tools/skabelon/katalog.mjs:1394-1402`, aktiveret af `assets/katalog.js:219`. Den viser
   `3 · SELECTED TO COMPARE · OPEN THE COMPARISON · Clear the selection`.
   **Den skal ikke længere kunne ses.**

## FÆLDEN — læs den, før du rører noget

**`.saml-taeller` er bundbjælkens datakilde.** `assets/katalog.js` læser fra den:

- linje 142: `var gaaLink = samlTaeller.querySelector('.saml-taeller__gaa');` → bjælkens href
- linje 149: `samlTaeller.getAttribute('data-klaebebar-etiket')` → bjælkens ARIA-navn
- linje 166: `samlRydEl.textContent` → ryd-knappens tekst

**Sletter du elementet fra `katalog.mjs`, dør bundbjælken med.** Den skal blive i DOM'en som
skjult databærer.

**Den nemme vej er allerede banet:** `system.css:2455` giver `.saml-taeller{display:none}` som
grundtilstand, og `system.css:2466` `.saml-taeller[data-aktiv]{display:flex}` er det eneste, der
viser den. **Du skal derfor ikke røre CSS overhovedet** — det er nok at holde op med at sætte
attributten i `katalog.js:219`.

**`.saml-graense` skal BLIVE synlig** (`katalog.mjs`, `role="status"`, teksten *"You can compare
at most 3 robots at a time"*). Den er afvisningsbeskeden og står kun, når et klik faktisk blev
afvist — den er ikke en del af SELECTED-baren. **Efterprøv, at den stadig kan vises**, når man
forsøger at vælge en fjerde robot.

## Filejerskab

**Du ejer:**
```
assets/katalog.js
tools/skabelon/katalog.mjs
tests/dele/65-katalogbar.mjs        (ny fil, nummeret er tildelt dig)
fund/FUND-katalogbar.md             (din rapport)
```

**Forbudt — tre andre spor og en anden session kører samtidig:**
```
assets/system.css            spor/topbar ejer den
assets/generator.css         spor/saml3 ejer den
tools/skabelon/side.mjs      spor/topbar
tools/skabelon/sammenligning.mjs · assets/sammenligning.js   spor/saml3
data/i18n/*.json             spor/saml3
db/**  ·  tests/dele/63-*  ·  tests/dele/64-*                den anden session
```

Rører opgaven en forbudt fil, så **stop og rapportér** — lav ikke rettelsen alligevel.

## Grundmåling — DIN FØRSTE KOMMANDO er at genmåle den

Målt af orkestratoren på `a405066` umiddelbart før afsendelse:

```
node tools/validate.mjs    77 filer / 0 fejl / 1 advarsel
node tools/build.mjs       216 sider · 1111 tal med kilde / 0 uden
node tests/koer.mjs        1478 bestaaet / 1 fejlet
```

**Den ene røde er IKKE din:** `tests/dele/63` punkt (c), byte-lighed mellem
`db/byg-migrering.mjs` og `db/migrering-engelsk.sql`. Årsag: `core.autocrlf=true` giver CRLF ved
checkout. Den er rød i enhver frisk checkout og rettes af `spor/crlf63` i en anden session.
**Rør den ikke.** Er der 2 røde efter dit arbejde, er den ene din.

**Gitignorerede filer skal kopieres ind, ellers giver validate 54 fejl, der ikke er dine:**
```
cp -r ../udstilling/assets/fotos/fabrikant/. assets/fotos/fabrikant/
```

## Acceptkriterier — hvert enkelt er KØRT mod main, og "giver i dag" er målt

| # | Kommando | Giver i dag | Skal give |
|---|---|---|---|
| K1 | `grep -c "setAttribute('data-aktiv'" assets/katalog.js` | **1** | **0** |
| K2 | `grep -c 'data-saml-taeller' dist/da/index.html` | **1** | **1** (databæreren bliver) |
| K3 | `grep -c "querySelector('.saml-taeller__gaa')" assets/katalog.js` | **1** | **1** (bjælken læser stadig) |
| K4 | `grep -c 'saml-graense' tools/skabelon/katalog.mjs` | **1** | **1** (afvisningsbeskeden bliver) |
| K5 | `grep -c 'saml-taeller' assets/system.css` | **9** | **9** (du rører ikke CSS) |

**K6 — den, der beviser at det virker for en bruger, og som de fem ovenfor IKKE beviser.**
Kør din server på 8231, vælg tre robotter på `/da/`, og mål i browseren:

```
node C:/Praktik/websites/maalevaerktoej/flade-skud.mjs http://localhost:8231/da/ 1440 <udfil>.png
```

Læs skuddet. **Bundbjælken skal stå, chippen skal være væk.** Skriv begge iagttagelser i
rapporten. Uden K6 er kriterierne kun en påstand om HTML — det var præcis den fejl, der gik
grøn i går (Å121 punkt 1: tre etiketter i HTML'en, to af dem på skjulte instanser, funktionen
virkede ikke).

**K7 — ny test i `tests/dele/65-katalogbar.mjs`:** mindst én assertion, der fælder, hvis
`data-aktiv` sættes igen, og mindst én, der fælder, hvis databæreren eller
`.saml-taeller__gaa` forsvinder fra den byggede side. Følg kontrakten i `tests/LAESMIG.md`.
**Ret assertions, slet dem ikke** — knækker en eksisterende test, så vend den, så den beviser
den nye regel, og skriv hvilken og hvorfor.

## Skills

**Vurdér og skriv, hvad du valgte og hvad du gik forbi, med begrundelse.** Kandidater:
`impeccable audit` (tilgængelighed: bjælken er `role="region"`, chippen bar en del af dens
tekst — bliver ARIA-navnet ved med at være rigtigt?), `fejljagt` (hvis et måletal opfører sig
uventet), `flet` (nej — orkestratoren fletter). **Designfrysen L70 gælder:** du udfører JPK's
egen instruks, du opfinder ikke ny form. Ser du andet, der burde laves om, så **notér det, ret
det ikke**.

Kald til plugin-skills fra en worktree svinger. Lykkes kaldet ikke, så læs fra disk:
```
C:/Users/thyge/.claude/skills/impeccable/SKILL.md
```
**og skriv i rapporten, at du læste den fra disk.**

## Miljø — hver af disse koster en runde, når den udelades

- `node` ligger i `/c/Program Files/nodejs/node.exe` — Git Bash har den **ikke** på PATH.
- Commit-beskeder med backticks, `$` eller anførselstegn: skriv til fil, `git commit -F <fil>`.
- **`sed -i` fejler tavst med exit 0.** Brug Edit-værktøjet, som fejler synligt.
- **Send aldrig en kommando til `/dev/null`, hvis dens exitkode eller fejltekst er en del af
  målingen.**
- `git -C` skal have `C:/Praktik/...`, ikke `/c/Praktik/...` — MSYS-stien fejler på Windows.
- Skriv filer som UTF-8 **uden** BOM.
- **Serveren:** `/c/Users/thyge/AppData/Local/Programs/Python/Python314/python.exe -m
  http.server 8231 --directory dist` fra worktree-roden, **aldrig `cd dist`**.
  **Verificér mod disken, før ét eneste tal bruges:** vælg en streng, der kun findes i din
  udgave, og sammenlign `curl -s` mod `grep` på filen. Giver de to forskellige tal, måler du en
  anden agents byg.
- **Luk din server, når du er færdig med at måle, og skriv i rapporten, at du gjorde det.**
- **Ryd `tests/.tmp-koersel` i din worktree, når du er færdig** — der er 11,5 GB fri på C:, og
  hver testkørsel koster plads. Rammer du ENOSPC, er det miljøet, ikke dit arbejde.

## Commit undervejs er et krav

Ét commit pr. sammenhængende ændring. To spor er døde på tre dage uden en linje efterladt; et
spor, der dør nu, skal kunne måles i stedet for gættes.

## Rapporten — `fund/FUND-katalogbar.md`, højst 60 linjer

1. Valgt løsning og fravalgt løsning, én linje hver.
2. **Konfidens pr. punkt.** *Høj* kræver en genkørbar kommando **plus** én linje om, hvad
   tallet ville have været, hvis arbejdet var forkert. Uden begge dele: middel.
3. Usikkerheder — det du ikke kunne afgøre.
4. Målingerne som tal, ikke prosa.

**UDEN FOR de 60 linjer, obligatorisk:**
- **"Nye fælder og opdagelser."** Er der intet, skal der stå, at der intet er.
- **"Punkter i briefet, jeg ikke nåede."** Én linje pr. punkt, tom hvis ingen.

## Briefets fakta er påstande

**Afviger noget, du måler, fra noget, briefet påstår, så rapportér afvigelsen — det er en del
af leverancen, ikke ulydighed.** Linjenumrene ovenfor er slået op på `a405066`; flytter din
egen ændring dem, er det forventet. Er et af "giver i dag"-tallene forkert, så skriv det
målte.
