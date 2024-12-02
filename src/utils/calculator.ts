import { Room, CalculationResult, CalculationMode } from '../types/calculator';

const WATTAGE_PER_CUBIC_METER = {
  living: {
    poor: 45,
    average: 40,
    good: 35,
    excellent: 30
  },
  bedroom: {
    poor: 40,
    average: 35,
    good: 30,
    excellent: 25
  },
  bathroom: {
    poor: 50,
    average: 45,
    good: 40,
    excellent: 35
  },
  kitchen: {
    poor: 45,
    average: 40,
    good: 35,
    excellent: 30
  },
  office: {
    poor: 40,
    average: 35,
    good: 30,
    excellent: 25
  },
  other: {
    poor: 45,
    average: 40,
    good: 35,
    excellent: 30
  }
};

const GLASS_FACTORS = {
  single: 1.2,
  double: 1.1,
  hr: 1.05,
  'hr+': 1.03,
  'hr++': 1.02,
  triple: 1.01
};

const ORIENTATION_FACTORS = {
  north: 1.1,
  east: 1.05,
  south: 1.0,
  west: 1.05
};

const WALL_FACTORS = {
  brick: 1.0,
  concrete: 1.1,
  wood: 1.2
};

const ADJACENT_SPACE_FACTORS = {
  heated: 0.9,
  unheated: 1.1,
  outside: 1.2
};

const MATERIAL_FACTORS = {
  brick: 1.0,
  concrete: 1.2,
  wood: 0.8
};

const VENTILATION_FACTORS = {
  natural: 1.0,
  mechanical: 0.9
};

export function calculateHeating(room: Room, mode: CalculationMode): CalculationResult {
  let baseWattage = calculateBaseWattage(room);

  if (mode === 'advanced') {
    baseWattage = applyAdvancedFactors(room, baseWattage);
  }

  // Apply spot heating adjustment if applicable
  if (room.heatingType === 'spot' && room.spotPercentage) {
    baseWattage = (baseWattage * room.spotPercentage) / 100;
  }

  const recommendations = generateRecommendations(room, baseWattage);
  const costEstimate = calculateCostEstimate(baseWattage);
  const environmentalImpact = calculateEnvironmentalImpact(baseWattage);
  const panelRecommendations = calculatePanelRecommendations(baseWattage);

  return {
    totalWattage: Math.ceil(baseWattage),
    recommendations,
    costEstimate,
    environmentalImpact,
    panelRecommendations
  };
}

function calculateBaseWattage(room: Room): number {
  const volume = room.length * room.width * room.height;
  return volume * WATTAGE_PER_CUBIC_METER[room.type][room.insulation];
}

function applyAdvancedFactors(room: Room, baseWattage: number): number {
  let adjustedWattage = baseWattage;

  // Apply window factors
  const windowHeatLoss = calculateWindowHeatLoss(room.windows);
  adjustedWattage += windowHeatLoss;

  // Apply wall heat loss
  const wallHeatLoss = calculateWallHeatLoss(room);
  adjustedWattage += wallHeatLoss;

  // Apply adjacent space factors
  const adjacentSpaceFactor = Object.values(room.adjacentSpaces)
    .reduce((acc, space) => acc * ADJACENT_SPACE_FACTORS[space], 1);
  adjustedWattage *= adjacentSpaceFactor;

  // Apply material factors
  const wallFactor = MATERIAL_FACTORS[room.wallType];
  const ceilingFactor = MATERIAL_FACTORS[room.ceilingType];
  const floorFactor = MATERIAL_FACTORS[room.floorType];
  const materialFactor = (wallFactor + ceilingFactor + floorFactor) / 3;
  adjustedWattage *= materialFactor;

  // Apply ventilation factor
  adjustedWattage *= VENTILATION_FACTORS[room.ventilationType];

  // Apply occupancy factor
  const occupancyFactor = 1 + (room.occupancy.numberOfPeople * 0.1) * (room.occupancy.hoursPerDay / 24);
  adjustedWattage *= occupancyFactor;

  return adjustedWattage;
}

function calculateWindowHeatLoss(windows: any[]): number {
  return windows.reduce((total, window) => {
    const area = window.width * window.height * window.quantity;
    return total + (area * GLASS_FACTORS[window.glassType] * ORIENTATION_FACTORS[window.orientation]);
  }, 0);
}

function calculateWallHeatLoss(room: Room): number {
  const wallArea = 2 * (room.length + room.width) * room.height;
  return wallArea * WALL_FACTORS[room.wallType];
}

function generateRecommendations(room: Room, wattage: number): string[] {
  const recommendations: string[] = [];

  // Basic recommendations based on room type and wattage
  if (room.insulation === 'poor') {
    recommendations.push('Consider improving insulation to reduce heating requirements.');
  }

  if (room.windows.length > 0) {
    const singleGlassWindows = room.windows.filter(w => w.glassType === 'single');
    if (singleGlassWindows.length > 0) {
      recommendations.push('Upgrade single-glass windows to double-glazing or better.');
    }
  }

  // Panel recommendations based on wattage
  if (wattage <= 1000) {
    recommendations.push('Consider using 1-2 medium-sized infrared panels.');
  } else if (wattage <= 2000) {
    recommendations.push('Consider using 2-3 medium to large-sized infrared panels.');
  } else {
    recommendations.push('Consider using multiple large infrared panels or a combination of sizes.');
  }

  return recommendations;
}

function calculateCostEstimate(wattage: number) {
  const ENERGY_PRICE = 0.34; // € per kWh
  const DAILY_HOURS = 8; // Average usage hours per day

  const dailyKWh = (wattage / 1000) * DAILY_HOURS;
  const dailyCost = dailyKWh * ENERGY_PRICE;

  return {
    daily: Math.round(dailyCost * 100) / 100,
    monthly: Math.round(dailyCost * 30 * 100) / 100,
    yearly: Math.round(dailyCost * 365 * 100) / 100
  };
}

function calculateEnvironmentalImpact(wattage: number) {
  // Simplified CO2 savings calculation (kg per year)
  const GRID_CO2_FACTOR = 0.4; // kg CO2 per kWh
  const YEARLY_HOURS = 2920; // 8 hours per day * 365 days
  const yearlyKWh = (wattage / 1000) * YEARLY_HOURS;
  return {
    co2Savings: Math.round(yearlyKWh * GRID_CO2_FACTOR),
    energyEfficiency: calculateEfficiencyRating(wattage)
  };
}

function calculateEfficiencyRating(wattage: number): string {
  // Simple efficiency rating based on wattage
  if (wattage <= 1000) {
    return 'A+';
  } else if (wattage <= 2000) {
    return 'A';
  } else {
    return 'B';
  }
}

function calculatePanelRecommendations(totalWattage: number) {
  const standardPanelWattages = [350, 500, 750, 1000];
  let bestWattagePerPanel = standardPanelWattages[0];
  let bestQuantity = Math.ceil(totalWattage / bestWattagePerPanel);

  // Find the most efficient panel configuration
  standardPanelWattages.forEach(wattage => {
    const quantity = Math.ceil(totalWattage / wattage);
    if (quantity * wattage < bestQuantity * bestWattagePerPanel) {
      bestWattagePerPanel = wattage;
      bestQuantity = quantity;
    }
  });

  // Estimate required area (typical panel is about 0.6m² per 100W)
  const areaPerPanel = (bestWattagePerPanel / 100) * 0.6;
  const totalArea = Number((areaPerPanel * bestQuantity).toFixed(2));

  return {
    quantity: bestQuantity,
    wattagePerPanel: bestWattagePerPanel,
    totalArea
  };
}
