import { Room, CalculationResult } from '../types/calculator';

const WATTS_PER_CUBIC_METER = {
  poor: 60,
  good: 45,
  excellent: 35
};

const MOUNTING_EFFICIENCY = {
  wall: 1.0,
  ceiling: 0.9,
  mobile: 0.8
};

const PANEL_EFFICIENCY = {
  standard: 1.0,
  premium: 1.2
};

export function calculateHeatingRequirements(room: Room): CalculationResult {
  const volume = room.length * room.width * room.height;
  const baseWattage = volume * WATTS_PER_CUBIC_METER[room.insulation];
  
  // Apply mounting and panel efficiency factors
  const mountingFactor = MOUNTING_EFFICIENCY[room.mountingType];
  const panelFactor = PANEL_EFFICIENCY[room.panelType];
  
  const recommendedPower = Math.ceil(baseWattage * mountingFactor * panelFactor);
  
  // Calculate energy consumption and costs
  const stroomprijs = 0.40; // €/kWh
  const verbruikPerUur = recommendedPower / 1000; // Convert W to kW
  const kostenPerUur = verbruikPerUur * stroomprijs;
  const kostenPerDag = kostenPerUur * 8; // Assuming 8 hours of use per day
  const kostenPerMaand = kostenPerDag * 30;

  // Generate recommendations
  const recommendations: string[] = [];
  
  recommendations.push(`Voor een ruimte van ${volume.toFixed(1)} m³ adviseren wij ${recommendedPower} Watt aan infrarood verwarming.`);
  
  if (room.insulation === 'poor') {
    recommendations.push('Overweeg het verbeteren van de isolatie voor een efficiënter systeem.');
  }
  
  if (room.mountingType === 'mobile') {
    recommendations.push('Een vast gemonteerd paneel is meestal efficiënter dan een mobiele oplossing.');
  }

  return {
    volume,
    recommendedPower,
    verbruikPerUur,
    kostenPerUur,
    kostenPerDag,
    kostenPerMaand,
    stroomprijs,
    recommendations
  };
}
