# FUND-saml3 — sammenligningsmatricen, seks punkter fra JPK 3. sep 2026

**Skills:** `spor` (kaldt, virkede fra worktreen) · `fejljagt` (punkt 2+7) ·
`impeccable` med `layout`-referencen læst fra
`C:/Users/thyge/.claude/skills/impeccable/reference/layout.md`.
Gik forbi: `robotdata` (ingen robotpost røres), `flet` (orkestratorens),
`grillmig` (jeg modtager et brief, griller det ikke), `supabase*` (ingen db).

**Grundmåling:** `node tools/validate.mjs` gav **77 filer · 76 fejl · 1 advarsel**,
ikke briefets 0 fejl. Alle 76 er R18 *"filen findes ikke:
assets/fotos/fabrikant/…"* — den kendte worktree-fælde, `assets/fotos/fabrikant/`
er gitignoreret og lå tom (0 filer). Kopieret ind fra hovedrepoet (610 filer,
kun læst derfra). Derefter **77 · 0 · 1**, som briefet sagde. Afvigelsen var
miljøet, ikke `c95abce`.

---

## PUNKT 2+7 — mekanismen, målt før én linje blev rettet

**Mekanismesætningen:**

> Matricen viser **nul** vandrette streger, fordi
> `.saml-raekke > th,.saml-raekke > td,…{border-top:0}` (`generator.css:589–591`,
> specificitet **(0,1,1)**) slår `.saml-raekke > *{border-top:1px solid var(--linje)}`
> (`generator.css:604`, specificitet **(0,1,0)**) — og specificitet afgøres
> **før** kilderækkefølgen, så det hjælper ikke, at 604 står sidst. Hvert eneste
> barn af en `<tr>` er enten en `th` eller en `td`, så 604 vinder på **0 af 142**
> celler.

**Det er mekanisme (b) i briefets liste, ikke (a) og ikke (c).**

- **Ikke (c):** selektoren rammer. `el.matches('.saml-raekke > *')` er `true` for
  både `td.saml-raekke__celle` og `th.saml-raekke__navn`; reglen står i
  CSSOM'ens matchliste for begge. Den taber, den misser ikke.
- **Ikke (a):** stregen er ikke svag — den **tegnes ikke**. Målt `border-top` på
  alle 142 celler: `0px none` på hver eneste. Var (a) rigtig, ville tallet have
  været `1px solid rgb(232,235,237)`.
- Bevis for hvem der vinder, uden at gætte: den beregnede `border-top-color` er
  `rgb(34,38,42)` (= `currentColor`, altså blækket), **ikke** `--linje`s
  `rgb(232,235,237)`. En vindende 604 ville have farvet den `--linje`.

De tre regler, der erklærer `border-top` på en datacelle, læst ud af CSSOM:

| Kilde | Vælger | Specificitet | Erklæring |
|---|---|---|---|
| `system.css` §14 | `th, td` | (0,0,2) | `1px solid var(--linje)` |
| `generator.css:589` | `.saml-raekke > th,.saml-raekke > td,…` | **(0,1,1)** | `border-top:0` ← **vinder** |
| `generator.css:604` | `.saml-raekke > *` | (0,1,0) | `1px solid var(--linje)` |

**Konsekvens for Å146's beslutning om at slette linje 604 som død regel:**
påstanden *"død, målt på 142 celler"* er rigtig om **virkningen** og forkert om
**årsagen**. Reglen er ikke uden aftagere — den er overskrevet. Havde den været
slettet, ville præcis den mekanisme, JPK beder om, være fjernet, og
nulstilleren på 589–591 ville stå tilbage som den eneste forklaring på, at der
aldrig kom en streg. **Linje 604 slettes ikke. Den sættes i drift.**

**Måleapparatet blev valideret først, og det var i stykker.** Første udgave af
CSSOM-sonden gav **0** regler med `border-top` i to stilark på 422 + 329 regler
— et fuldstændig plausibelt nul. Årsagen: `CSSStyleRule` har i nyere Chrome en
**tom** `.cssRules` (nested CSS), så `if (x.cssRules)` var sand for *alle*
regler og sendte dem ned i en tom rekursion. Efter at `selectorText` tjekkes
først: **846** stilregler, **36** med `border-top`. Uden kontroltallet havde
sonden "bevist" mekanisme (c).
