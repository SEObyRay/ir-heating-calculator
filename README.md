# Infrarood Verwarmings Calculator

Een web-gebaseerde calculator voor het bepalen van de optimale infrarood verwarmingscapaciteit voor verschillende ruimtes in huis.

## Features

- Berekent benodigde wattage op basis van:
  - Ruimte type (woonkamer, keuken, slaapkamer, etc.)
  - Ruimte afmetingen (lengte, breedte, hoogte)
  - Aantal ramen
  - Isolatie kwaliteit
- Geeft aanbevelingen voor infrarood verwarmingspanelen
- Toont gedetailleerde resultaten inclusief wattage per vierkante meter

## Technische Stack

- Next.js 13 met App Router
- TypeScript
- Tailwind CSS
- React

## Installatie

1. Clone de repository
2. Installeer dependencies:
   ```bash
   npm install
   ```
3. Start de development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in je browser

## Ontwikkeling

- `src/components/Calculator.tsx`: Hoofdcomponent met formulier en resultaten
- `src/utils/calculator.ts`: Berekeningslogica
- `src/types/calculator.ts`: TypeScript type definities

## Licentie

MIT
