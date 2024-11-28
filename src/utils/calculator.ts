import { Room, CalculationResult, CalculationMode } from '../types/calculator';

const WATT_PER_CUBIC_METER = {
  living: { poor: 45, average: 35, good: 30, excellent: 25 },
  bedroom: { poor: 40, average: 30, good: 25, excellent: 20 },
  bathroom: { poor: 55, average: 45, good: 40, excellent: 35 },
  kitchen: { poor: 45, average: 35, good: 30, excellent: 25 },
  office: { poor: 40, average: 30, good: 25, excellent: 20 },
  other: { poor: 45, average: 35, good: 30, excellent: 25 }
};

const GLASS_TYPE_FACTOR = {
  single: 1.4,
  double: 1.2,
  hr: 1.1,
  'hr+': 1.05,
  'hr++': 1.0,
  triple: 0.9
};

const ORIENTATION_FACTOR = {
  north: 1.2,
  east: 1.1,
  south: 1.0,
  west: 1.1
};

const ADJACENT_SPACE_FACTOR = {
  heated: 0.9,
  unheated: 1.1,
  outside: 1.2
};

const MATERIAL_FACTOR = {
  brick: 1.0,
  concrete: 1.2,
  wood: 0.8
};

const VENTILATION_FACTOR = {
  natural: 1.0,
  mechanical: 0.9
};

export function calculateHeating(room: Room, mode: CalculationMode): CalculationResult {
  let baseWattage = calculateBaseWattage(room);
  
  if (mode === 'advanced') {
    baseWattage = applyAdvancedFactors(room, baseWattage);
  }

  // Apply spot heating adjustment if applicable
  if (room.heatingType === 'spot') {
    baseWattage = (baseWattage * room.spotPercentage) / 100;
  }

  const recommendations = generateRecommendations(room);
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
  return volume * WATT_PER_CUBIC_METER[room.type][room.insulation];
}

function applyAdvancedFactors(room: Room, baseWattage: number): number {
  let adjustedWattage = baseWattage;

  // Apply window factors
  room.windows.forEach(window => {
    const windowArea = window.width * window.height * window.quantity;
    const windowFactor = GLASS_TYPE_FACTOR[window.glassType] * ORIENTATION_FACTOR[window.orientation];
    adjustedWattage += (windowArea * windowFactor * 10); // 10W per m² of window base factor
  });

  // Apply adjacent space factors
  const adjacentSpaceFactor = Object.values(room.adjacentSpaces)
    .reduce((acc, space) => acc * ADJACENT_SPACE_FACTOR[space], 1);
  adjustedWattage *= adjacentSpaceFactor;

  // Apply material factors
  const wallFactor = MATERIAL_FACTOR[room.wallType];
  const ceilingFactor = MATERIAL_FACTOR[room.ceilingType];
  const floorFactor = MATERIAL_FACTOR[room.floorType];
  const materialFactor = (wallFactor + ceilingFactor + floorFactor) / 3;
  adjustedWattage *= materialFactor;

  // Apply ventilation factor
  adjustedWattage *= VENTILATION_FACTOR[room.ventilationType];

  // Apply occupancy factor
  const occupancyFactor = 1 + (room.occupancy.numberOfPeople * 0.1) * (room.occupancy.hoursPerDay / 24);
  adjustedWattage *= occupancyFactor;

  return adjustedWattage;
}

function generateRecommendations(room: Room): string[] {
  const recommendations: string[] = [];

  if (room.insulation === 'poor') {
    recommendations.push('Verbeter de isolatie om het energieverbruik te verminderen.');
  }

  if (room.windows.some(w => w.glassType === 'single')) {
    recommendations.push('Overweeg het vervangen van enkel glas door HR++ glas.');
  }

  if (room.windows.length > 0 && !room.windows.some(w => w.hasBlinds)) {
    recommendations.push('Installeer zonwering voor betere temperatuurregeling.');
  }

  return recommendations;
}

function calculateCostEstimate(wattage: number) {
  const kWh = wattage / 1000;
  const pricePerKWh = 0.40; // Average price in Netherlands
  const dailyHours = 8; // Average usage

  const daily = kWh * pricePerKWh * dailyHours;
  const monthly = daily * 30;
  const yearly = monthly * 12;

  return {
    daily: Number(daily.toFixed(2)),
    monthly: Number(monthly.toFixed(2)),
    yearly: Number(yearly.toFixed(2))
  };
}

function calculateEnvironmentalImpact(wattage: number) {
  const kWh = (wattage * 8 * 365) / 1000; // Yearly kWh
  const co2PerKWh = 0.4; // kg CO2 per kWh (Dutch average)
  const co2Savings = kWh * co2PerKWh;

  let energyEfficiency = 'A+';
  if (wattage > 2000) energyEfficiency = 'B';
  if (wattage > 3000) energyEfficiency = 'C';

  return {
    co2Savings: Number(co2Savings.toFixed(2)),
    energyEfficiency
  };
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
