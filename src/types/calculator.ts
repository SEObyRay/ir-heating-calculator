export type RoomType = 'living' | 'bedroom' | 'bathroom' | 'kitchen' | 'office' | 'other';
export type InsulationType = 'poor' | 'medium' | 'good';
export type PanelType = 'fixed' | 'mobile';
export type MountingType = 'wall' | 'ceiling';
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
  panelType: PanelType;
  mountingType: MountingType;
}

export interface CalculationResult {
  volume: number;
  recommendedPower: number;
  recommendations: string[];
  verbruikPerUur: number;
  kostenPerUur: number;
  kostenPerDag: number;
  kostenPerMaand: number;
  stroomprijs: number;
}
