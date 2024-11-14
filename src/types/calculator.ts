export type InsulationType = 'poor' | 'average' | 'good' | 'excellent';
export type RoomType = 'living' | 'bedroom' | 'bathroom' | 'kitchen' | 'office' | 'other';
export type HeatingType = 'full' | 'spot';
export type GlassType = 'single' | 'double' | 'hr' | 'hr+' | 'hr++' | 'triple';
export type WallType = 'brick' | 'concrete' | 'wood' | 'steel';
export type CeilingType = 'concrete' | 'wood' | 'insulated' | 'uninsulated';
export type FloorType = 'concrete' | 'wood' | 'tile' | 'carpet';
export type VentilationType = 'natural' | 'mechanical' | 'balanced' | 'none';
export type CalculationMode = 'simple' | 'advanced';
export type Orientation = 'north' | 'east' | 'south' | 'west';
export type AdjacentSpaceType = 'heated' | 'unheated' | 'outside';

export interface Window {
  width: number;
  height: number;
  glassType: GlassType;
  orientation?: Orientation;
  hasBlinds?: boolean;
  quantity: number;
}

export interface Room {
  type: RoomType;
  length: number;
  width: number;
  height: number;
  insulation: InsulationType;
  heatingType: HeatingType;
  windows: Window[];
  spotPercentage?: number;
  wallType: WallType;
  ceilingType: CeilingType;
  floorType: FloorType;
  ventilationType: VentilationType;
  adjacentSpaces?: {
    north?: AdjacentSpaceType;
    east?: AdjacentSpaceType;
    south?: AdjacentSpaceType;
    west?: AdjacentSpaceType;
    above?: AdjacentSpaceType;
    below?: AdjacentSpaceType;
  };
  occupancy?: {
    numberOfPeople: number;
    hoursPerDay: number;
  };
}

export interface CalculationResult {
  requiredWattage: number;
  recommendations: string[];
  energyEfficiency: {
    rating: 'A' | 'B' | 'C' | 'D' | 'E';
    savingsPotential: number;
  };
  panelSuggestions: {
    type: string;
    count: number;
    totalWattage: number;
    coverage: number;
  }[];
}
