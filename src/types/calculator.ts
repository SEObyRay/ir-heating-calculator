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

export interface Window {
  width: number;
  height: number;
  glassType: GlassType;
  orientation?: Orientation;
  hasBlinds?: boolean;
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
    north?: 'heated' | 'unheated' | 'outside';
    east?: 'heated' | 'unheated' | 'outside';
    south?: 'heated' | 'unheated' | 'outside';
    west?: 'heated' | 'unheated' | 'outside';
    above?: 'heated' | 'unheated' | 'outside';
    below?: 'heated' | 'unheated' | 'outside';
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
