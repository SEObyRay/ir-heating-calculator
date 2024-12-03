import { Room, CalculationResult } from '../types/calculator';

const WATTS_PER_CUBIC_METER = {
  poor: 45,
  average: 35,
  good: 30,
  excellent: 25
};

const GLASS_TYPE_FACTOR = {
  single: 1.2,
  double: 1.0,
  hr: 0.9,
  'hr+': 0.8,
  'hr++': 0.7,
  triple: 0.6
};

const WALL_TYPE_FACTOR = {
  brick: 1.0,
  concrete: 1.1,
  wood: 0.9
};

const VENTILATION_FACTOR = {
  natural: 1.0,
  mechanical: 0.9
};

const ADJACENT_SPACE_FACTOR = {
  heated: 0.8,
  unheated: 1.0,
  outside: 1.2
};

const ENERGY_PRICE = 0.34; // € per kWh
const DAILY_USAGE_HOURS = 8;
const CO2_GRID_FACTOR = 0.4; // kg CO2 per kWh

export function calculateHeatingRequirements(room: Room): CalculationResult {
  // Calculate base wattage based on volume and insulation
  const volume = room.length * room.width * room.height;
  const baseWattage = volume * WATTS_PER_CUBIC_METER[room.insulation];
  
  // Apply spot heating adjustment if applicable
  let adjustedWattage = baseWattage;
  if (room.heatingType === 'spot' && room.spotPercentage) {
    adjustedWattage = (adjustedWattage * room.spotPercentage) / 100;
  }

  // Calculate window heat loss
  const windowHeatLoss = room.windows.reduce((total, window) => {
    const windowArea = window.width * window.height * window.quantity;
    const orientationFactor = window.orientation === 'north' ? 1.1 : 1.0;
    return total + (windowArea * GLASS_TYPE_FACTOR[window.glassType] * orientationFactor);
  }, 0);

  // Calculate wall factors
  const wallFactor = WALL_TYPE_FACTOR[room.wallType];
  const ceilingFactor = WALL_TYPE_FACTOR[room.ceilingType];
  const floorFactor = WALL_TYPE_FACTOR[room.floorType];

  // Calculate ventilation impact
  const ventilationFactor = VENTILATION_FACTOR[room.ventilationType];

  // Calculate adjacent spaces impact
  const adjacentSpacesImpact = Object.values(room.adjacentSpaces)
    .reduce((sum, space) => sum + ADJACENT_SPACE_FACTOR[space], 0) / 6;

  // Calculate final wattage
  const requiredWattage = Math.round(
    adjustedWattage * 
    wallFactor * 
    ceilingFactor * 
    floorFactor * 
    ventilationFactor * 
    adjacentSpacesImpact +
    windowHeatLoss
  );

  // Calculate costs
  const dailyKwh = (requiredWattage / 1000) * DAILY_USAGE_HOURS;
  const costEstimate = {
    daily: Number((dailyKwh * ENERGY_PRICE).toFixed(2)),
    monthly: Number((dailyKwh * ENERGY_PRICE * 30).toFixed(2)),
    yearly: Number((dailyKwh * ENERGY_PRICE * 365).toFixed(2))
  };

  // Calculate environmental impact
  const co2Savings = Number((dailyKwh * CO2_GRID_FACTOR * 365).toFixed(2));
  
  // Generate efficiency rating
  const efficiencyRating = getEfficiencyRating(requiredWattage, volume);

  // Generate recommendations
  const recommendations = generateRecommendations(room, requiredWattage);

  return {
    requiredWattage,
    recommendations,
    costEstimate,
    environmentalImpact: {
      co2Savings,
      energyEfficiency: efficiencyRating
    }
  };
}

function getEfficiencyRating(wattage: number, volume: number): string {
  const wattsPerCubicMeter = wattage / volume;
  if (wattsPerCubicMeter <= 25) return 'A+++';
  if (wattsPerCubicMeter <= 30) return 'A++';
  if (wattsPerCubicMeter <= 35) return 'A+';
  if (wattsPerCubicMeter <= 40) return 'A';
  if (wattsPerCubicMeter <= 45) return 'B';
  if (wattsPerCubicMeter <= 50) return 'C';
  return 'D';
}

function generateRecommendations(room: Room, wattage: number): string[] {
  const recommendations: string[] = [];

  if (room.insulation === 'poor') {
    recommendations.push('Consider improving insulation to reduce heating requirements.');
  }

  if (room.windows.some(w => w.glassType === 'single')) {
    recommendations.push('Upgrade single-pane windows to double or triple glazing for better efficiency.');
  }

  if (room.heatingType === 'full' && wattage > 3000) {
    recommendations.push('Consider zoning the heating system for more efficient operation.');
  }

  if (room.ventilationType === 'natural' && room.insulation === 'excellent') {
    recommendations.push('Install mechanical ventilation with heat recovery for optimal efficiency.');
  }

  return recommendations;
}
