import { Room, CalculationResult, Window, CalculationMode, HeatingType } from '../types/calculator';

// Constants for calculations
const BASE_WATTAGE_PER_M3_MAIN = 30; // Base wattage per cubic meter for main heating
const BASE_WATTAGE_PER_M2_SUPPLEMENTARY = 120; // Base wattage per square meter for supplementary heating
const EXTRA_AREA_MARGIN = 0.5; // Extra margin in meters for supplementary heating area

// Insulation factors
const INSULATION_FACTORS = {
  poor: 1.4,      // Poor insulation has 40% more heat loss
  average: 1.2,   // Average insulation has 20% more heat loss
  good: 1.0,      // Good insulation has no extra heat loss
  excellent: 0.8  // Excellent insulation has 20% less heat loss
};

// Glass type factors
const GLASS_FACTORS = {
  single: 1.5,    // Single glass has 50% more heat loss
  double: 1.2,    // Double glass has 20% more heat loss
  hr: 1.1,        // HR glass has 10% more heat loss
  'hr+': 1.0,     // HR+ glass has no extra heat loss
  'hr++': 0.9,    // HR++ glass has 10% less heat loss
  triple: 0.8     // Triple glass has 20% less heat loss
};

function validateInput(room: Room, mode: CalculationMode): void {
  // Basic validation
  if (!room.length || room.length <= 0) throw new Error('Lengte moet groter zijn dan 0');
  if (!room.width || room.width <= 0) throw new Error('Breedte moet groter zijn dan 0');
  if (!room.height || room.height <= 0) throw new Error('Hoogte moet groter zijn dan 0');
  if (!room.insulation) throw new Error('Selecteer een isolatie type');
  if (!room.heatingType) throw new Error('Selecteer het type verwarming (hoofd of bijverwarming)');

  // Validate spot heating percentage for supplementary heating
  if (room.heatingType === 'spot' && (!room.spotPercentage || room.spotPercentage < 1 || room.spotPercentage > 100)) {
    throw new Error('Spot verwarming percentage moet tussen 1 en 100 zijn');
  }

  // Advanced mode validation
  if (mode === 'advanced') {
    if (room.windows) {
      room.windows.forEach((window, index) => {
        if (!window.width || window.width <= 0) throw new Error(`Raam ${index + 1}: Breedte moet groter zijn dan 0`);
        if (!window.height || window.height <= 0) throw new Error(`Raam ${index + 1}: Hoogte moet groter zijn dan 0`);
        if (!window.quantity || window.quantity < 1) throw new Error(`Raam ${index + 1}: Aantal moet minimaal 1 zijn`);
        if (!window.glassType) throw new Error(`Raam ${index + 1}: Selecteer een glas type`);
        if (!window.orientation) throw new Error(`Raam ${index + 1}: Selecteer een oriëntatie`);
      });
    }
  }
}

function calculateMainHeating(room: Room, mode: CalculationMode): number {
  // Calculate basic volume and wattage
  const volume = room.length * room.width * room.height;
  let requiredWattage = volume * BASE_WATTAGE_PER_M3_MAIN;

  // Apply insulation factor
  requiredWattage *= INSULATION_FACTORS[room.insulation];

  // Calculate window heat loss if in advanced mode
  if (mode === 'advanced' && room.windows && room.windows.length > 0) {
    const totalWindowArea = room.windows.reduce((total, window) => {
      const area = window.width * window.height * window.quantity;
      const glassLossFactor = GLASS_FACTORS[window.glassType];
      return total + (area * glassLossFactor);
    }, 0);

    // Add additional wattage for window heat loss
    const floorArea = room.length * room.width;
    const windowPercentage = (totalWindowArea / floorArea) * 100;
    requiredWattage *= (1 + (windowPercentage / 100));
  }

  return requiredWattage;
}

function calculateSupplementaryHeating(room: Room): number {
  // Add margin to the heating area
  const lengthWithMargin = room.length + (2 * EXTRA_AREA_MARGIN);
  const widthWithMargin = room.width + (2 * EXTRA_AREA_MARGIN);
  const area = lengthWithMargin * widthWithMargin;

  // Calculate base wattage for supplementary heating
  let requiredWattage = area * BASE_WATTAGE_PER_M2_SUPPLEMENTARY;

  // Apply spot heating percentage if specified
  if (room.heatingType === 'spot' && room.spotPercentage) {
    requiredWattage *= (room.spotPercentage / 100);
  }

  return requiredWattage;
}

function generatePanelSuggestions(totalWattage: number, heatingType: HeatingType): string[] {
  const suggestions: string[] = [];
  const standardPanels = [350, 580, 700, 1000];

  // For supplementary heating, prefer smaller panels
  if (heatingType === 'spot') {
    const recommendedPanels = standardPanels.filter(w => w <= 700);
    const bestMatch = recommendedPanels.reduce((prev, curr) => 
      Math.abs(curr - totalWattage) < Math.abs(prev - totalWattage) ? curr : prev
    );
    suggestions.push(`${bestMatch}W paneel (ideaal voor bijverwarming)`);
    
    if (totalWattage > bestMatch) {
      suggestions.push(`2x ${bestMatch}W panelen voor betere warmteverdeling`);
    }
    
    suggestions.push('Tip: Gebruik een slimme stekker of schakelaar voor automatische bediening');
    suggestions.push('Tip: Houd rekening met 30 minuten opwarmtijd');
  } else {
    // For main heating, calculate optimal panel combination
    const optimalPanel = standardPanels.reduce((prev, curr) => 
      Math.abs(curr - totalWattage/2) < Math.abs(prev - totalWattage/2) ? curr : prev
    );
    const panelCount = Math.ceil(totalWattage / optimalPanel);
    suggestions.push(`${panelCount}x ${optimalPanel}W panelen (totaal ${panelCount * optimalPanel}W)`);
    suggestions.push('Tip: Verwarmingstijd ongeveer 3 graden per uur');
  }

  return suggestions;
}

function calculateEnergyEfficiency(room: Room, mode: CalculationMode): { rating: string; savingsPotential: number } {
  let points = 0;
  const maxPoints = mode === 'advanced' ? 10 : 5;

  // Basic points for insulation
  switch (room.insulation) {
    case 'excellent': points += 5; break;
    case 'good': points += 4; break;
    case 'average': points += 2; break;
    case 'poor': points += 1; break;
  }

  // Additional points for advanced features
  if (mode === 'advanced' && room.windows) {
    const hasEfficientGlass = room.windows.some(w => 
      ['hr++', 'triple'].includes(w.glassType)
    );
    if (hasEfficientGlass) points += 3;
    
    const hasBlinds = room.windows.some(w => w.hasBlinds);
    if (hasBlinds) points += 2;
  }

  // Calculate rating and savings potential
  const percentage = (points / maxPoints) * 100;
  let rating: string;
  let savingsPotential: number;

  if (percentage >= 90) {
    rating = 'A+';
    savingsPotential = 0;
  } else if (percentage >= 80) {
    rating = 'A';
    savingsPotential = 10;
  } else if (percentage >= 70) {
    rating = 'B';
    savingsPotential = 20;
  } else if (percentage >= 60) {
    rating = 'C';
    savingsPotential = 30;
  } else {
    rating = 'D';
    savingsPotential = 40;
  }

  return { rating, savingsPotential };
}

export function calculateHeating(room: Room, mode: CalculationMode): CalculationResult {
  try {
    // Validate input
    validateInput(room, mode);

    // Calculate required wattage based on heating type
    const requiredWattage = room.heatingType === 'full' 
      ? calculateMainHeating(room, mode)
      : calculateSupplementaryHeating(room);

    // Round up to nearest 100W
    const roundedWattage = Math.ceil(requiredWattage / 100) * 100;

    // Generate panel suggestions
    const panelSuggestions = generatePanelSuggestions(roundedWattage, room.heatingType);

    // Calculate energy efficiency
    const energyEfficiency = calculateEnergyEfficiency(room, mode);

    return {
      requiredWattage: roundedWattage,
      panelSuggestions,
      energyEfficiency,
    };
  } catch (error) {
    console.error('Error in heating calculation:', error);
    throw error instanceof Error ? error : new Error('Er is een fout opgetreden bij het berekenen');
  }
}
