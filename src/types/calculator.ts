export type RoomType = 'living' | 'bedroom' | 'bathroom' | 'kitchen' | 'office' | 'other';
export type InsulationType = 'poor' | 'good' | 'excellent';
export type PanelType = 'standard' | 'premium';
export type MountingType = 'wall' | 'ceiling' | 'mobile';
export type HeatingMode = 'full' | 'spot';
export type GlassType = 'single' | 'double' | 'hr' | 'hr+' | 'hr++' | 'triple';
export type Orientation = 'north' | 'east' | 'south' | 'west';
export type WallType = 'brick' | 'concrete' | 'wood';
export type VentilationType = 'natural' | 'mechanical';
export type AdjacentSpaceType = 'heated' | 'unheated' | 'outside';
export type CalculationMode = 'simple' | 'advanced';

export interface Window {
  width: number;
  height: number;
  glassType: GlassType;
  orientation: Orientation;
  hasBlinds: boolean;
  quantity: number;
}

export interface Room {
  length: number;
  width: number;
  height: number;
  type: RoomType;
  insulation: 'poor' | 'average' | 'good' | 'excellent';
  heatingType: 'full' | 'spot';
  spotPercentage?: number;
  windows: Array<{
    width: number;
    height: number;
    quantity: number;
    glassType: GlassType;
    orientation: Orientation;
  }>;
  wallType: WallType;
  ceilingType: WallType;
  floorType: WallType;
  ventilationType: VentilationType;
  adjacentSpaces: {
    north: AdjacentSpaceType;
    east: AdjacentSpaceType;
    south: AdjacentSpaceType;
    west: AdjacentSpaceType;
    above: AdjacentSpaceType;
    below: AdjacentSpaceType;
  };
  occupancy: {
    numberOfPeople: number;
    hoursPerDay: number;
  };
}

export interface CalculationResult {
  requiredWattage: number;
  recommendations: string[];
  costEstimate: {
    daily: number;
    monthly: number;
    yearly: number;
  };
  environmentalImpact: {
    co2Savings: number;
    energyEfficiency: string;
  };
}
