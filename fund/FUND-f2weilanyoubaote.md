# FUND — spor/f2-weilanyoubaote: WEILAN og Shandong Youbaote til engelsk

Skill valgt: `spor` (kaldt og lykkedes fra worktree — ikke fallback). `robotdata`
og `supabase` vurderet og fravalgt: opgaven er rene PATCH-skrivninger via det
allerede byggede `db/f2-skriv.mjs`, ingen ny robotpost eller skemaændring.
`fejljagt` ikke nødvendig — intet målte forkert.

## 1. Løsning
Oversatte WEILAN's 62 og Shandong Youbaotes 33 danske tekstceller til engelsk,
verificeret ordret mod råkilden, via `db/f2-skriv.mjs`. Fravalgt alternativ:
ingen — dette er den eneste skrivevej, jf. briefet.

## 2. Konfidens
- **Høj**: `node db/fase2-tjek.mjs --dansk --producent=<X>` → 0/0 for begge
  producenter i alle 10 kolonner (var 62/33). Kontrafaktisk: var oversættelsen
  ikke sket, ville tallet stadig være 62 og 33.
- **Høj**: `node db/fase2-tjek.mjs --tal --producent=<X>` → uændret for begge
  (WEILAN `5fa1a9…909ca7dc`, Youbaote `244f07…52b83c4b7`). Kontrafaktisk: havde
  et tal rørt sig, ville aftrykket være et andet — det er hele mekanismen.
- **Høj**: `change_log` WHERE `changed_by='spor/f2-weilanyoubaote'` → 73
  rækker, 0 uden for de otte robot-id'er. Kontrafaktisk: en fejlagtig
  `robot_id` i en PATCH ville enten fejle (0 rækker matchede) eller ramme en
  fremmed robot, som ville vise sig her.
- **Middel**: citatefterprøvning — 41 faktapåstande efterprøvet ordret mod
  råkilden (se `fund/f2weilanyoubaote-klassifikation.md`), 0 ikke fundet.
  Middel, ikke høj, fordi tællingen er min egen manuelle optælling, ikke en
  genkørbar kommando.

## 3. Usikkerheder
- Youbaotes 4 "ikke-danske" caveat-celler (brief: "allerede engelske") er
  reelt 3 sprogneutrale taltekster og 1 GENUINT DANSK sætning
  (`docking_station`: "Ladestander, tilvalg."), som dansk-detektoren ikke
  fanger (hverken æøå eller et ordlisteord). Jeg har IKKE rettet den — briefet
  siger eksplicit "rør dem ikke", og at afvige fra en skrive-grænse for at
  "gøre det færdigt" er en større fejl end at lade en enkelt dansk sætning
  stå. JPK bør tage stilling til, om `docking_station` skal ind under et
  senere spor.
- Jeg kan ikke afgøre, om WEILANs og Youbaotes prosastil (meget analytisk,
  med "PRODUCENTEN OPLYSER TRE LASTTAL"-emfase) er den tilsigtede engelske
  tone for hele kataloget, eller om et senere redaktionelt pas skal glatte den.

## 4. Målinger
- Grundmåling (trin 1): WEILAN 62 dansk / Youbaote 33 dansk. Matchede briefet
  100 %.
- Efter skrivning: WEILAN 0/0, Youbaote 0/0 (alle 10 kolonner, begge
  producenter).
- `--tal`-aftryk: uændrede for begge, byte for byte som grundmålingen.
- Skrevet: 46 rækker (WEILAN: field_entries 36, robots 5, applications 5) +
  27 rækker (Youbaote: field_entries 21, robots 3, applications 3) = 73.
- `change_log`: 73 nye rækker, 0 udenfor mine 8 robotter.
- Selv-læsning: 95 celler læst manuelt felt for felt (`fund/f2weilanyoubaote-
  efter.txt`), 0 fejl fundet.

---

## Nye fælder og opdagelser

1. **`grep -rl` på hele `media/_kilder/` gav 0 tavst for et mønster
   (`含电池`), som direkte `grep -c` på selve filen fandt 2 gange.** Roden er
   ikke fundet med sikkerhed — mistanke om at `-r` i denne skal ikke
   håndterer UTF-8-mønstre i alle filer korrekt. **Efterprøv altid et 0-tal
   fra `grep -r` med et direkte `grep -c` på den konkrete fil, før det bruges
   som bevis for fravær.**
2. **Youbaote har ingen egen kildemappe — al deres materiale ligger i
   WEILANs `raa-kina-weilan-xiaomi-2026-08-19/`** (indsamlet samme dag, samme
   session). Ingen ny hentning var nødvendig; `yobotics-katalog-firbenede-
   2026-08-19.html` bar samtlige tre modellers specifikationer som skjulte
   faner med Excel-indsatte kinesiske tabeller.
3. **Alle tre af Youbaotes modelnavne-uoverensstemmelser (Y10/Y5, Y20/Y30,
   e-Dog/Y15), som allerede stod i databasen, er nu selv-verificeret** —
   overskrift (`product_more_h`) og beskrivelsens eget modelnavn er
   bekræftet forskellige alle tre steder, ikke kun overtaget fra en tidligere
   agents note.
4. **En eksisterende `caveat_wording`-celle (Youbaote y20/weight) brød L87:**
   den blandede dansk oversættelse og kildetegn i samme streng
   (`"Med batteri (含电池)"`). Rettet til ren kildeordlyd `含电池`.
5. **`value_text` bekræftet ude af scope, og der ER dansk indhold i den hos
   mine to producenter:** 5 danske celler (WEILAN cameras/compute x2+x3
   robotter, Youbaote y20/compute) — `db/f2-skriv.mjs`s
   `TEKSTKOLONNE_HVIDLISTE` indeholder ikke `value_text`, så kolonnen er
   strukturelt urørlig fra dette script, uanset hvad `BRIEF-FAELLES.md`
   siger om den. Bekræfter OPSKRIFT-fase2.md's fund: en femte, endnu
   ejerløs arbejdsbunke.
6. **`db/f2-skriv.mjs`s reelle hvidliste er 12 kolonner** (`caveat`,
   `caveat_wording`, `caveat_class`, `note`, `note_wording`, `notes`,
   `notes_wording`, `quote`, `quote_wording`, `alt`, `manufacturer_city`,
   `manufacturer_country`), IKKE de 9 `BRIEF-FAELLES.md` selv lister
   (som inkluderer `value_text`, der ikke er der, og udelader `note_wording`/
   `quote`/`quote_wording`/`alt`/de to manufacturer-felter, som er der).
   Jeg fulgte kodens liste, jf. mit eget briefs afsnit 7.

## Punkter i briefet, jeg ikke nåede

Ingen. Begge producenters acceptkriterier 1-4 er opfyldt fuldt ud (0 dansk,
0 talændring, 0 rækker udenfor). Kriterium 5 (citatefterprøvning) er
gennemført med 41/41 fundet, 0 ikke fundet.
