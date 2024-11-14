import { Room, CalculationResult } from '../types/calculator';

export const generateReport = (room: Room, result: CalculationResult): string => {
  const date = new Date().toLocaleDateString('nl-NL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const roomDimensions = `${room.length}m x ${room.width}m x ${room.height}m`;
  const roomArea = (room.length * room.width).toFixed(1);

  let report = `
Infrarood Verwarmings Berekening Rapport
=======================================
Gegenereerd op: ${date}

Ruimte Informatie
----------------
Type Ruimte: ${room.roomType}
Afmetingen: ${roomDimensions}
Vloeroppervlak: ${roomArea}m²
Isolatie Kwaliteit: ${room.insulationQuality}
`;

  if (room.windows.length > 0) {
    report += `\nRamen Informatie\n---------------\n`;
    room.windows.forEach((window, index) => {
      report += `Raam ${index + 1}:
- Afmetingen: ${window.width}m x ${window.height}m
- Aantal: ${window.quantity || 1}
- Glas Type: ${window.glassType}
- Oriëntatie: ${window.orientation}
- Zonwering: ${window.hasBlinds ? 'Ja' : 'Nee'}
`;
    });
  }

  if (room.heatingType === 'spot') {
    report += `\nSpot Verwarming\n---------------
Percentage van ruimte: ${room.spotPercentage}%\n`;
  }

  report += `\nBerekeningsresultaat\n-------------------
Benodigd Vermogen: ${result.requiredWattage} Watt

Aanbevolen Panelen:
${result.panelSuggestions.map(panel => `- ${panel}`).join('\n')}

Aanvullende Informatie
---------------------
- Deze berekening is een indicatie gebaseerd op de ingevoerde gegevens
- Werkelijk verbruik kan variëren afhankelijk van specifieke omstandigheden
- Raadpleeg een professional voor definitieve installatie
- Houd rekening met lokale bouwvoorschriften en regelgeving

© ${new Date().getFullYear()} Infrarood Verwarmings Calculator
`;

  return report;
};

export const downloadReport = (room: Room, result: CalculationResult) => {
  const report = generateReport(room, result);
  const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  link.href = url;
  link.download = `infrarood-berekening-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
