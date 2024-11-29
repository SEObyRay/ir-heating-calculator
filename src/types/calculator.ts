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
  insulation: InsulationType;
  mountingType: MountingType;
  panelType: PanelType;
}

export interface CalculationResult {
  volume: number;
  recommendedPower: number;
  verbruikPerUur: number;
  kostenPerUur: number;
  kostenPerDag: number;
  kostenPerMaand: number;
  stroomprijs: number;
  recommendations: string[];
}
