# `media/_kilder/` — reference, aldrig publicering

**Intet i denne mappe må nogensinde ende på siden.**

Her ligger fabrikanternes eget materiale: produktfotos, datablade, PDF'er, skærmbilleder
af specifikationssider. Vi gemmer det, fordi vi **læser fakta i det** — og fordi en
producentside, der ændrer sig, ellers efterlader os uden bevis for, hvad der stod, da vi
hentede tallet.

## Reglen

**At læse en kilde for fakta er i orden. At genudgive dens pixels er det ikke.**

To grunde, og den anden er den vigtige:

1. Rettighederne er fabrikantens.
2. **At publicere en fabrikants marketingbillede er det stærkeste mulige signal om, at vi
   er den fabrikants forhandler.** Der findes ingen forhandleraftale mellem KeyResearch og
   nogen fabrikant. Hele opslagsværkets værdi hviler på, at læseren tror på det.

Det gælder også, når billedet er "bare til pladsholder", "kun i et udkast" eller "vi
krediterer jo". En pladsholder, der ligner et rigtigt billede, overlever til lancering.
Det er sket før på nabosiden.

## Navngivning

`<producent>-<model>-<hvad>-<hentedato>.<ext>`

Eksempel: `unitree-b2-specside-2026-08-19.png`

Hentedatoen i filnavnet er ikke pedanteri. Når en producent stiltiende retter et tal på
sin side, er filnavnet det eneste, der fortæller hvornår vores tal var rigtigt.

## Hvad der må publiceres i stedet

- `assets/silhuetter/` — måltro tegninger vi selv laver
- `assets/fotos/` — fotografier vi selv har taget

`dist/` bygges kun fra `assets/`. Denne mappe indgår aldrig i bygget.

## Manifest ved siden af raamaterialet

Hver `raa-*`-mappe skal have en `MANIFEST.tsv` med otte kolonner:
`filnavn`, `kilde_url`, `http_status`, `hentet_utc`, `sha256`, `bytes`, `indhold`,
`sprogversion`. Uden den kan et datablad kun kobles til sin kilde med indicier, og en
gemt fejlside kan ligge under et navn, der lover indhold, uden at nogen kan se det.

### `hentet_utc` er filens mtime - ikke hentetidspunktet

**Kolonnen indeholder filsystemets mtime, og det er ikke det samme som det tidspunkt,
siden blev hentet.** Det er maalt, ikke skoennet:

- Alle 58 filer i `raa-vest-2026-08-19/` har mtime **og** birthtime inden for **0,475
  sekund** af hinanden (2026-08-19T07:44:19Z). 58 sider kan ikke hentes paa et halvt
  sekund. Stemplet er det oejeblik, filerne blev skrevet ind i mappen.
- Tolv af siderne baerer serverens **eget** tidsstempel i Shopifys `__st.reqid`. De
  spaender fra **07:20:43Z til 07:27:31Z** - et vindue paa knap syv minutter, der slutter
  **17 minutter foer** mtime.

Laes derfor `hentet_utc` som **oevre graense**: filen fandtes senest da. Skal det rigtige
hentetidspunkt bruges, staar det i sidens eget indhold, hvor et saadant felt findes -
for vest-saettet er de tolv reqid-stempler noteret i `indhold`-kolonnen.

**Naeste gang:** gem `curl`-hentelog med URL, statuskode og `Date`-header ved siden af
filerne. Det koster faa linjer og fjerner hele det her forbehold.

### `http_status` er `ukendt` for hele vest-saettet

Ingen HTTP-header blev gemt. En 404-side i mappen beviser, at *indholdet* er en fejlside -
ikke at *statuskoden* var 404 frem for 200. **Gaet ikke koden ud af indholdet.** Skriv
`ukendt`, og markér fejlsiden i `indhold`-kolonnen.

### Fejlsider slettes ikke - de markeres

En gemt fejlside er dokumentation for, at en URL ikke svarede. Den maa blive liggende,
men `indhold`-kolonnen skal begynde med `FEJLSIDE`, saa ingen laeser den som data.
Vest-saettet har **seks**: `ghost_s40.html`, `petoi_shop.html`, `p_838e03.html`,
`s_9c6633.html`, `p_c6f6fc.html` og `s_61c509.html`.
