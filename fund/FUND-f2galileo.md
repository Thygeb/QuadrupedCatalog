# FUND — spor/f2-galileo (genoptagelsen)

Skill: `spor` kaldt først (lykkedes fra worktree). `robotdata`/`supabase` overvejet,
fravalgt — ren tekstoversættelse mod kendt skema, intet nyt felt/robot. `fejljagt`
udløst midt i arbejdet (PDF-tool og egen L87-fejl, se "Nye fælder").

## Forgængerens fire (CVTE, Galileo caveat, MicroRoboTech, Xiaomi) — ikke rørt

226 change_log-rækker, allerede efterprøvet af orkestratoren 3. sep. Kun læst her,
ikke genmålt.

## Mit arbejde — Yuejia Lingdong (4 robotter, 109 celler), Galileo Tianjin (6, 73)

Klassificeret efter OPSKRIFT-fase2-cjk.md's kasse A/B, oversat til engelsk
(caveat/note/notes), kildens kinesiske ord udskilt (caveat_wording/notes_wording),
L87 fulgt. Skrevet via **`db/f2-skriv.mjs`** (kanonisk) — IKKE forgængerens
`db/f2-galileo-skriv.mjs`, som lå uncommittet med en YOBOTICS-tilføjelse udenfor
begge spors scope. Rørt af mig på intet tidspunkt.

## SELVRETTELSE (commit `bfb2511`)

Første runde splittede quote_wording/note_wording i rene EN/ZH-felter. Briefets
afsnit 7 forbyder netop det ("blander vores indledning med kildens ord ... oversæt
det som det er og lad strukturen stå — Omstrukturér ikke"). Fundet ved egen
gennemlæsning af briefet. Rettet: 10 celler skrevet om til "engelsk (kildens ord)"-
formen. `quote` selv (aldrig blandet i originalen) var aldrig fejlen.

## Konfidens

1. **`--dansk` 109→0 og 73→0.** Høj — `node db/fase2-tjek.mjs --dansk --producent=…`.
   Forkert arbejde ville give >0 (stod 109/73 før skrivning).
2. **Talaftryk uændret.** Høj — `--tal` giver `cf4d8092…c2b21a420` / `d2713f2a…0cdcadb4`,
   identisk med grundmålingen.
3. **change_log-ejerskab.** Høj — 291 rækker `changed_by='spor/f2-galileo'` i alt
   (226+65), 0 udenfor mine 10 robot_id'er. Kolonnen hedder `changed_at`, ikke
   `created_at` (se "Nye fælder").
4. **Kildeefterprøvning Yuejia: høj.** Alle citerede fragmenter grep'et bogstaveligt
   mod `media/_kilder/raa-kand4-2026-08-25/yuejialingdong-yj-{56,57,58,59}-…html` —
   alle fundet. Én pre-eksisterende afvigelse noteret, ikke rettet (se nedenfor).
5. **Kildeefterprøvning Galileo: LAV.** `pdftotext` ekstraherer 0 kinesiske tegn fra
   `galileo-wrc-product-manual-2025.pdf` (0 træf på "重量", som indgår i allerede
   skrevne caveat_wording for samme PDF). `pdftoppm`/ghostscript/imagemagick mangler
   alle, Read kan ikke rendere PDF-siden. De kinesiske fragmenter er UÆNDREDE udtræk
   af tekst en TIDLIGERE indsamling skrev — ikke citater jeg selv har genhentet.
6. **Gennemlæsning ud over instrumentet.** Høj, talt: 123 Yuejia- og 73 Galileo-
   celler læst efter skrivning — 0 dansk fundet ud over detektorens 0-tal.

## Usikkerheder

- 2257/autonomy_level.caveat_wording sat til `null` (kasse B — kun "基础参数" var
  citeret, kontekst, ikke værdi-citat). Afviger fra søskendefelterne. Vurdering.
- applications.quote[0]/quote_wording[0] hos Yuejia ikke rørt — se "Nye fælder".
- Galileo-PDF-verifikation ikke gennemført (miljøbegrænsning, se konfidens 5).

## Målinger

Yuejia: 49 rækker (field_entries 41, applications 4, robots 4) + 4 rettelser. Galileo:
6 rækker + 6 rettelser. change_log 226→291. `--dansk` 109→0, 73→0. `--tal` uændret.
Læst ud over detektor: 196 celler, 0 fejl.

---

## Nye fælder og opdagelser

1. **Briefets afsnit 7 blev overtrådt i min egen første runde** — se SELVRETTELSE.
   Rettet uden orkestrator-indgriben, men skete, ikke kun en risiko der blev undgået.
2. **PDF-tekstudtræk blokeret for CJK på denne maskine.** `pdftotext` findes
   (`/mingw64/bin/pdftotext`, MSYS-sti-fælde ved outputfil — brug relativ sti, ikke
   `/c/...`), men giver 0 kinesiske tegn uanset `-layout`. Intet `pdftoppm`/
   ghostscript/imagemagick til siderendering. Et fremtidigt PDF-spor bør vide dette
   FØR det lover kildeverifikation.
3. **`db/f2-galileo-skriv.mjs`s uncommittede diff tilføjer en YOBOTICS-kilde** —
   `data/robots/yobotics-*.yaml` findes (3 robotter), men hverken forgængerens fire
   eller mine to. Ukendt oprindelse/relevans — flag til orkestrator, ikke rettet.
4. **`applications.quote[0]` hos alle 4 Yuejia-robotter er pre-eksisterende garbled**
   ("YJ30。", "。", "AI。。"×2) — hverken dansk (uden for mandat) eller gyldig engelsk
   gengivelse. Ligner en ekstraktionsfejl (kombinerer `productAbout_title` + kinesisk
   punktum). `quote_wording[0]` er derimod korrekt og verificeret. Ikke rettet.
5. **`change_log` hedder `changed_at`, ikke `created_at`.** Et forkert gæt her ville
   have givet `null` content-range = falsk "0 rækker" (CLAUDE.md's kontrolregel).

## Punkter i briefet, jeg ikke nåede

Ingen punkter sprunget over. Acceptkriterierne 1-6 er nået for begge producenter,
inklusive den udvidede gennemlæsning. Kildeverifikation mod Galileo-PDF'en (del af
kriterium 6) blev IKKE fuldført efter hensigten — dokumenteret som miljøbegrænsning
ovenfor (konfidens 5, fælde 2), ikke sprunget over uden begrundelse.
