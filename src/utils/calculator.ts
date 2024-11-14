import { Room, CalculationResult, Window, CalculationMode } from '../types/calculator';

// Constanten voor berekeningen
const BASE_WATTAGE_PER_M3 = 30; // Basis wattage per kubieke meter

// Isolatie factoren
const INSULATION_FACTORS = {
  poor: 1.4,      // Slechte isolatie heeft 40% meer warmteverlies
  average: 1.2,  // Gemiddelde isolatie heeft 20% meer warmteverlies
  good: 1.0,     // Goede isolatie heeft geen extra warmteverlies
  excellent: 0.8 // Uitstekende isolatie heeft 20% minder warmteverlies
};

// Glas type factoren
const GLASS_FACTORS = {
  single: 1.5,    // Enkel glas heeft 50% meer warmteverlies
  double: 1.2,    // Dubbel glas heeft 20% meer warmteverlies
  hr: 1.1,        // HR glas heeft 10% meer warmteverlies
  'hr+': 1.0,     // HR+ glas heeft geen extra warmteverlies
  'hr++': 0.9,    // HR++ glas heeft 10% minder warmteverlies
  triple: 0.8     // Triple glas heeft 20% minder warmteverlies
};

// Materiaal factoren
const WALL_FACTORS = {
  brick: 1.0,     // Baksteen heeft geen extra warmteverlies
  concrete: 1.1, // Beton heeft 10% meer warmteverlies
  wood: 0.9,      // Hout heeft 10% minder warmteverlies
  steel: 1.2      // Staal heeft 20% meer warmteverlies
};

const CEILING_FACTORS = {
  concrete: 1.1,      // Betonnen plafond heeft 10% meer warmteverlies
  wood: 0.9,         // Houten plafond heeft 10% minder warmteverlies
  insulated: 0.8,    // Geïsoleerd plafond heeft 20% minder warmteverlies
  uninsulated: 1.3   // Ongeïsoleerd plafond heeft 30% meer warmteverlies
};

const FLOOR_FACTORS = {
  concrete: 1.1,  // Betonnen vloer heeft 10% meer warmteverlies
  wood: 0.9,     // Houten vloer heeft 10% minder warmteverlies
  tile: 1.2,      // Tegelvloer heeft 20% meer warmteverlies
  carpet: 0.8    // Tapijt heeft 20% minder warmteverlies
};

const VENTILATION_FACTORS = {
  natural: 1.1,    // Natuurlijke ventilatie heeft 10% meer warmteverlies
  mechanical: 1.0, // Mechanische ventilatie heeft geen extra warmteverlies
  balanced: 0.9,   // Gebalanceerde ventilatie heeft 10% minder warmteverlies
  none: 1.2       // Geen ventilatie heeft 20% meer warmteverlies (vocht!)
};

const ORIENTATION_FACTORS = {
  north: 1.2,    // Noord heeft 20% meer warmteverlies (minste zonlicht)
  east: 1.1,     // Oost heeft 10% meer warmteverlies
  south: 0.9,    // Zuid heeft 10% minder warmteverlies (meeste zonlicht)
  west: 1.0      // West is neutraal
};

export function calculateHeating(room: Room, mode: CalculationMode): CalculationResult {
  try {
    // Basis berekening
    const volume = room.length * room.width * room.height;
    let requiredWattage = volume * BASE_WATTAGE_PER_M3;

    // Pas isolatie factor toe
    requiredWattage *= INSULATION_FACTORS[room.insulation];

    if (mode === 'advanced') {
      // Pas materiaal factoren toe
      requiredWattage *= WALL_FACTORS[room.wallType];
      requiredWattage *= CEILING_FACTORS[room.ceilingType];
      requiredWattage *= FLOOR_FACTORS[room.floorType];
      
      // Pas ventilatie factor toe
      requiredWattage *= VENTILATION_FACTORS[room.ventilationType];

      // Bereken raam verliezen
      if (room.windows.length > 0) {
        const calculateWindowHeatLoss = (windows: Window[]): number => {
          return windows.reduce((total, window) => {
            const area = window.width * window.height * (window.quantity || 1);  // Multiply by quantity
            const glassLossFactor = GLASS_FACTORS[window.glassType];
            const orientationFactor = ORIENTATION_FACTORS[window.orientation];
            const blindsFactor = window.hasBlinds ? 0.85 : 1;
            
            return total + (area * glassLossFactor * orientationFactor * blindsFactor);
          }, 0);
        };

        const totalWindowHeatLoss = calculateWindowHeatLoss(room.windows);

        // Voeg 10% toe voor elk 10% raamoppervlak t.o.v. vloeroppervlak
        const floorArea = room.length * room.width;
        const windowPercentage = (totalWindowHeatLoss / floorArea) * 100;
        requiredWattage *= (1 + (windowPercentage / 100));
      }
    }

    // Pas spot verwarming percentage toe indien van toepassing
    if (room.heatingType === 'spot') {
      requiredWattage *= (room.spotPercentage / 100);
    }

    // Rond af naar boven op 100W
    requiredWattage = Math.ceil(requiredWattage / 100) * 100;

    // Genereer panel suggesties
    const panelSuggestions = generatePanelSuggestions(requiredWattage);

    return {
      requiredWattage,
      panelSuggestions,
      energyEfficiency: calculateEnergyEfficiency(room, mode)
    };
  } catch (error) {
    console.error('Error in heating calculation:', error);
    throw new Error('Er is een fout opgetreden bij de berekening');
  }
}

function generatePanelSuggestions(totalWattage: number): string[] {
  const suggestions: string[] = [];
  const standardPanels = [350, 580, 700, 1000];
  
  // Voeg suggestie toe voor één type paneel
  const singlePanelType = standardPanels.reduce((prev, curr) => {
    return Math.abs(curr - totalWattage/2) < Math.abs(prev - totalWattage/2) ? curr : prev;
  });
  const panelCount = Math.ceil(totalWattage / singlePanelType);
  suggestions.push(`${panelCount}x ${singlePanelType}W panelen (totaal ${panelCount * singlePanelType}W)`);

  // Voeg suggestie toe voor combinatie van panelen
  if (totalWattage > 1000) {
    const largePanelCount = Math.floor(totalWattage / 1000);
    const remainingWattage = totalWattage - (largePanelCount * 1000);
    if (remainingWattage > 0) {
      const smallPanelType = standardPanels.reduce((prev, curr) => {
        return Math.abs(curr - remainingWattage) < Math.abs(prev - remainingWattage) ? curr : prev;
      });
      suggestions.push(`${largePanelCount}x 1000W + 1x ${smallPanelType}W panelen (totaal ${largePanelCount * 1000 + smallPanelType}W)`);
    }
  }

  return suggestions;
}

function calculateEnergyEfficiency(room: Room, mode: CalculationMode): { rating: string, savingsPotential: number } {
  let points = 0;
  const maxPoints = mode === 'advanced' ? 15 : 4;

  // Basis punten voor isolatie (max 4)
  switch (room.insulation) {
    case 'excellent': points += 4; break;
    case 'good': points += 3; break;
    case 'average': points += 2; break;
    case 'poor': points += 1; break;
  }

  if (mode === 'advanced') {
    // Ventilatie (max 2)
    switch (room.ventilationType) {
      case 'balanced': points += 2; break;
      case 'mechanical': points += 1.5; break;
      case 'natural': points += 1; break;
      case 'none': points += 0; break;
    }

    // Plafond type (max 2)
    switch (room.ceilingType) {
      case 'insulated': points += 2; break;
      case 'wood': points += 1.5; break;
      case 'concrete': points += 1; break;
      case 'uninsulated': points += 0; break;
    }

    // Vloer type (max 2)
    switch (room.floorType) {
      case 'carpet': points += 2; break;
      case 'wood': points += 1.5; break;
      case 'concrete': points += 1; break;
      case 'tile': points += 0.5; break;
    }

    // Muur type (max 2)
    switch (room.wallType) {
      case 'wood': points += 2; break;
      case 'brick': points += 1.5; break;
      case 'concrete': points += 1; break;
      case 'steel': points += 0.5; break;
    }

    // Ramen (max 3)
    if (room.windows.length > 0) {
      let windowPoints = 0;
      room.windows.forEach(window => {
        // Glas type (max 1.5)
        switch (window.glassType) {
          case 'triple': windowPoints += 1.5; break;
          case 'hr++': windowPoints += 1.2; break;
          case 'hr+': windowPoints += 1; break;
          case 'hr': windowPoints += 0.8; break;
          case 'double': windowPoints += 0.5; break;
          case 'single': windowPoints += 0; break;
        }

        // Zonwering (max 0.5)
        if (window.hasBlinds) windowPoints += 0.5;

        // Oriëntatie (max 1)
        switch (window.orientation) {
          case 'south': windowPoints += 1; break;
          case 'east': case 'west': windowPoints += 0.5; break;
          case 'north': windowPoints += 0; break;
        }
      });

      // Gemiddelde van alle ramen
      points += (windowPoints / room.windows.length);
    }
  }

  // Bereken rating en besparingspotentieel
  const percentage = (points / maxPoints) * 100;
  let rating: string;
  let savingsPotential: number;

  if (percentage >= 90) {
    rating = 'A+++';
    savingsPotential = 0;
  } else if (percentage >= 80) {
    rating = 'A++';
    savingsPotential = 5;
  } else if (percentage >= 70) {
    rating = 'A+';
    savingsPotential = 10;
  } else if (percentage >= 60) {
    rating = 'A';
    savingsPotential = 15;
  } else if (percentage >= 50) {
    rating = 'B';
    savingsPotential = 20;
  } else if (percentage >= 40) {
    rating = 'C';
    savingsPotential = 25;
  } else if (percentage >= 30) {
    rating = 'D';
    savingsPotential = 30;
  } else if (percentage >= 20) {
    rating = 'E';
    savingsPotential = 35;
  } else {
    rating = 'F';
    savingsPotential = 40;
  }

  return { rating, savingsPotential };
}
