import { Room, CalculationResult } from '../types/calculator';

export function downloadReport(room: Room, result: CalculationResult) {
  const roomArea = room.length * room.width;
  const roomVolume = roomArea * room.height;
  const roomDimensions = `${room.length}m x ${room.width}m x ${room.height}m`;

  const report = `Infrarood Verwarming Rapport
=========================

Gegenereerd op: ${new Date().toLocaleString('nl-NL')}

Ruimte Informatie
----------------
Afmetingen: ${roomDimensions}
Vloeroppervlak: ${roomArea}m²
Volume: ${roomVolume}m³
Isolatie: ${room.insulation}
Type Verwarming: ${room.heatingType === 'full' ? 'Hoofdverwarming' : 'Bijverwarming'}
${room.heatingType === 'spot' ? `Spot Verwarming Percentage: ${room.spotPercentage}%` : ''}

Ramen Informatie
---------------
${room.windows ? room.windows.map((window, index) => `
Raam ${index + 1}:
- Afmetingen: ${window.width}m x ${window.height}m
- Aantal: ${window.quantity}
- Type Glas: ${window.glassType}
- Oriëntatie: ${window.orientation}
- Zonwering: ${window.hasBlinds ? 'Ja' : 'Nee'}
`).join('\n') : 'Geen ramen opgegeven'}

Berekende Resultaten
-------------------
Benodigd Vermogen: ${result.requiredWattage}W
Energie Efficiëntie Rating: ${result.energyEfficiency.rating}
Besparingspotentieel: ${result.energyEfficiency.savingsPotential}%

Paneel Suggesties
----------------
${result.panelSuggestions.join('\n')}

Let op: Dit rapport is een indicatie. Het daadwerkelijk benodigde vermogen kan afwijken afhankelijk van specifieke omstandigheden.
`;

  // Create blob and download
  const blob = new Blob([report], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'infrarood-verwarming-rapport.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
