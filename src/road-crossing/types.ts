import type * as THREE from 'three';

export type Direction = 'forward' | 'backward' | 'left' | 'right';

export interface TreeMeta {
  tileIndex: number;
  height: number;
}

export interface CoinMeta {
  tileIndex: number;
  collected: boolean;
}

export interface VehicleMeta {
  initialTileIndex: number;
  color: number;
  colorIndex?: number;
  ref?: THREE.Group | null;
}

export interface ForestRow {
  type: 'forest';
  trees: TreeMeta[];
  coins: CoinMeta[];
}

export interface CarRow {
  type: 'car';
  direction: boolean;
  speed: number;
  vehicles: VehicleMeta[];
}

export interface TruckRow {
  type: 'truck';
  direction: boolean;
  speed: number;
  vehicles: VehicleMeta[];
}

export type RowMetadata = ForestRow | CarRow | TruckRow;

export interface PlayerPosition {
  currentRow: number;
  currentTile: number;
}
