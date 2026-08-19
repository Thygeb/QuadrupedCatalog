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
