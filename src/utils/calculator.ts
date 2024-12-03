import { Room, CalculationResult } from '../types/calculator';

// Constants for calculations
const WATTS_PER_CUBIC_METER = {
  poor: 45,
  average: 40, // Standard Dutch recommendation
  good: 35,
  excellent: 30
};

const WATTS_PER_SQUARE_METER = 40; // Dutch standard for full room heating

const STANDARD_PANEL_OPTIONS = [
  { wattage: 350, maxVolume: 9, description: 'Geschikt voor ca. 9 m³, ideaal als elektrische bureau verwarming of voor een klein toilet.' },
  { wattage: 450, maxVolume: 12, description: 'Geschikt voor ca. 12 m³, perfect voor een kleine slaapkamer of bijkeuken.' },
  { wattage: 580, maxVolume: 15, description: 'Geschikt voor ca. 15 m³, ideaal voor een woonkamer of keuken.' },
  { wattage: 700, maxVolume: 18, description: 'Geschikt voor ca. 18 m³, ideaal als infrarood verwarming woonkamer.' }
];

export function calculateHeatingRequirements(room: Room): CalculationResult {
  const volume = room.length * room.width * room.height;
  const floorArea = room.length * room.width;
  
  // Calculate base wattage using both cubic meter and square meter methods
  let baseWattage: number;
  
  if (room.heatingType === 'full') {
    // For full room heating, use both volume and floor area calculations
    const volumeBasedWattage = volume * WATTS_PER_CUBIC_METER[room.insulation];
    const areaBasedWattage = floorArea * WATTS_PER_SQUARE_METER;
    // Use the higher value to ensure comfort
    baseWattage = Math.max(volumeBasedWattage, areaBasedWattage);
  } else {
    // For spot heating, calculate based on the coverage area
    baseWattage = room.spotPercentage ? 
      (floorArea * WATTS_PER_SQUARE_METER * room.spotPercentage / 100) :
      (floorArea * WATTS_PER_SQUARE_METER * 0.25); // Default to 25% coverage if not specified
  }

  const requiredWattage = Math.ceil(baseWattage);

  // Calculate energy costs
  const dailyKwh = (requiredWattage / 1000) * 8; // Assuming 8 hours usage
  const costEstimate = {
    daily: Number((dailyKwh * 0.34).toFixed(2)),
    monthly: Number((dailyKwh * 0.34 * 30).toFixed(2)),
    yearly: Number((dailyKwh * 0.34 * 365).toFixed(2))
  };

  // Calculate environmental impact
  const co2Savings = Number((dailyKwh * 0.4 * 365).toFixed(2));
  const energyEfficiency = getEfficiencyRating(requiredWattage, volume);

  // Generate recommendations based on Dutch standards
  const recommendations = generateDutchRecommendations(room, requiredWattage);

  return {
    requiredWattage,
    recommendations,
    costEstimate,
    environmentalImpact: {
      co2Savings,
      energyEfficiency
    }
  };
}

function getEfficiencyRating(wattage: number, volume: number): string {
  const wattsPerCubicMeter = wattage / volume;
  if (wattsPerCubicMeter <= 30) return 'A+++';
  if (wattsPerCubicMeter <= 35) return 'A++';
  if (wattsPerCubicMeter <= 40) return 'A+';
  if (wattsPerCubicMeter <= 45) return 'A';
  if (wattsPerCubicMeter <= 50) return 'B';
  return 'C';
}

function generateDutchRecommendations(room: Room, wattage: number): string[] {
  const recommendations: string[] = [];

  // Basic heating type recommendations
  if (room.heatingType === 'full') {
    recommendations.push(
      'Voor volledige ruimteverwarming wordt uitgegaan van 40W/m². ' +
      'De panelen zullen de objecten in de ruimte verwarmen waardoor ook de lucht wordt opgewarmd.'
    );
  } else {
    recommendations.push(
      'Voor plaatselijke verwarming is het belangrijk dat u zich binnen 1,5 meter van het paneel bevindt. ' +
      'Het paneel moet zo geplaatst worden dat de straling direct op u gericht is.'
    );
  }

  // Panel recommendations based on volume
  const recommendedPanels = STANDARD_PANEL_OPTIONS
    .filter(panel => panel.wattage >= (wattage * 0.8) && panel.wattage <= (wattage * 1.2))
    .map(panel => panel.description);

  if (recommendedPanels.length > 0) {
    recommendations.push('Aanbevolen panelen:');
    recommendations.push(...recommendedPanels);
  }

  // Additional recommendations based on room characteristics
  if (room.insulation === 'poor') {
    recommendations.push('Overweeg het verbeteren van de isolatie voor een efficiënter systeem.');
  }

  if (room.windows.some(w => w.glassType === 'single')) {
    recommendations.push('Het upgraden van enkelglas naar dubbelglas of HR++ kan het energieverbruik aanzienlijk verminderen.');
  }

  return recommendations;
}
