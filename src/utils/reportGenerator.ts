import { Room, CalculationResult } from '../types/calculator';

export function downloadReport(room: Room, result: CalculationResult) {
  const report = generateReport(room, result);

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

export function generateReport(room: Room, results: CalculationResult): string {
  const floorArea = room.length * room.width;
  const volume = room.length * room.width * room.height;

  return `
Infrarood Verwarming Adviesrapport
================================

Ruimte Details
-------------
Afmetingen: ${room.length}m x ${room.width}m x ${room.height}m
Vloeroppervlak: ${floorArea.toFixed(1)} m²
Volume: ${volume.toFixed(1)} m³
Type ruimte: ${translateRoomType(room.type)}
Isolatie: ${translateInsulation(room.insulation)}
Verwarmingstype: ${room.heatingType === 'full' ? 'Volledige ruimteverwarming' : 'Plaatselijke verwarming'}
${room.spotPercentage ? `Percentage verwarmd oppervlak: ${room.spotPercentage}%` : ''}

Ramen Informatie
--------------
${room.windows.length > 0 ? room.windows.map((window, index) => `
Raam ${index + 1}:
- Afmetingen: ${window.width}m x ${window.height}m
- Aantal: ${window.quantity}
- Type Glas: ${translateGlassType(window.glassType)}
- Oriëntatie: ${translateOrientation(window.orientation)}
`).join('\n') : 'Geen ramen opgegeven'}

Berekende Verwarmingsbehoefte
---------------------------
Benodigd vermogen: ${results.requiredWattage} Watt
${room.heatingType === 'full' 
  ? `Vermogen per m²: ${(results.requiredWattage / floorArea).toFixed(1)} W/m²`
  : 'Let op: Voor plaatselijke verwarming geldt een effectieve afstand van maximaal 1,5 meter.'}

Energiekosten Schatting (op basis van €0,34/kWh)
---------------------------------------------
Per dag: €${results.costEstimate.daily}
Per maand: €${results.costEstimate.monthly}
Per jaar: €${results.costEstimate.yearly}

Milieu Impact
-----------
CO₂ besparing per jaar: ${results.environmentalImpact.co2Savings} kg
Energie efficiëntie klasse: ${results.environmentalImpact.energyEfficiency}

Aanbevelingen
-----------
${results.recommendations.map(rec => `• ${rec}`).join('\n')}

Let op: Dit adviesrapport is een indicatie. Het daadwerkelijk benodigde vermogen kan afwijken afhankelijk van specifieke omstandigheden zoals buitentemperatuur, gewenste binnentemperatuur en gebruikspatroon.
`;
}

function translateRoomType(type: string): string {
  const translations: { [key: string]: string } = {
    living: 'Woonkamer',
    bedroom: 'Slaapkamer',
    bathroom: 'Badkamer',
    kitchen: 'Keuken',
    office: 'Kantoor',
    other: 'Overige ruimte'
  };
  return translations[type] || type;
}

function translateInsulation(insulation: string): string {
  const translations: { [key: string]: string } = {
    poor: 'Slecht',
    average: 'Gemiddeld',
    good: 'Goed',
    excellent: 'Uitstekend'
  };
  return translations[insulation] || insulation;
}

function translateGlassType(glassType: string): string {
  const translations: { [key: string]: string } = {
    single: 'Enkelglas',
    double: 'Dubbelglas',
    hr: 'HR glas',
    'hr+': 'HR+ glas',
    'hr++': 'HR++ glas',
    triple: 'Driedubbel glas'
  };
  return translations[glassType] || glassType;
}

function translateOrientation(orientation: string): string {
  const translations: { [key: string]: string } = {
    north: 'Noord',
    east: 'Oost',
    south: 'Zuid',
    west: 'West'
  };
  return translations[orientation] || orientation;
}
