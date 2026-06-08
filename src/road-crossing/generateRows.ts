import * as THREE from 'three';
import { minTileIndex, maxTileIndex } from './constants';
import { getCurrentTheme } from '../themeManager';
import type { RowMetadata } from './types';

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function difficultyFactor(rowCount: number): number {
  return 1 + Math.min(rowCount / 40, 2.5);
}

function generateForestRow(): RowMetadata {
  const occupiedTiles = new Set<number>();
  const treeCount = THREE.MathUtils.randInt(3, 6);
  const trees = Array.from({ length: treeCount }, () => {
    let tileIndex: number;
    do {
      tileIndex = THREE.MathUtils.randInt(minTileIndex, maxTileIndex);
    } while (occupiedTiles.has(tileIndex));
    occupiedTiles.add(tileIndex);
    return { tileIndex, height: randomElement([20, 45, 60]) };
  });
  return { type: 'forest', trees };
}

function generateCarRow(rowCount: number): RowMetadata {
  const factor = difficultyFactor(rowCount);
  const direction = randomElement([true, false]);
  const baseSpeed = randomElement([125, 156, 188, 220]);
  const speed = baseSpeed * factor;
  const vehicleCount = Math.min(4, 2 + Math.floor(rowCount / 25));

  const occupiedTiles = new Set<number>();
  const theme = getCurrentTheme();

  const vehicles = Array.from({ length: vehicleCount }, () => {
    let initialTileIndex: number;
    do {
      initialTileIndex = THREE.MathUtils.randInt(minTileIndex, maxTileIndex);
    } while (occupiedTiles.has(initialTileIndex));
    occupiedTiles.add(initialTileIndex - 1);
    occupiedTiles.add(initialTileIndex);
    occupiedTiles.add(initialTileIndex + 1);

    const colorIndex = THREE.MathUtils.randInt(0, theme.colors.carColors.length - 1);
    return {
      initialTileIndex,
      color: theme.colors.carColors[colorIndex],
      colorIndex,
    };
  });

  return { type: 'car', direction, speed, vehicles };
}

function generateTruckRow(rowCount: number): RowMetadata {
  const factor = difficultyFactor(rowCount);
  const direction = randomElement([true, false]);
  const baseSpeed = randomElement([110, 140, 175]);
  const speed = baseSpeed * factor;
  const vehicleCount = Math.min(3, 1 + Math.floor(rowCount / 30));

  const occupiedTiles = new Set<number>();
  const theme = getCurrentTheme();

  const vehicles = Array.from({ length: vehicleCount }, () => {
    let initialTileIndex: number;
    do {
      initialTileIndex = THREE.MathUtils.randInt(minTileIndex, maxTileIndex);
    } while (occupiedTiles.has(initialTileIndex));
    occupiedTiles.add(initialTileIndex - 2);
    occupiedTiles.add(initialTileIndex - 1);
    occupiedTiles.add(initialTileIndex);
    occupiedTiles.add(initialTileIndex + 1);
    occupiedTiles.add(initialTileIndex + 2);

    const colorIndex = THREE.MathUtils.randInt(0, theme.colors.truckColors.length - 1);
    return {
      initialTileIndex,
      color: theme.colors.truckColors[colorIndex],
      colorIndex,
    };
  });

  return { type: 'truck', direction, speed, vehicles };
}

function generateRow(rowCount: number): RowMetadata {
  const roll = Math.random();
  if (roll < 0.38) return generateCarRow(rowCount);
  if (roll < 0.68) return generateTruckRow(rowCount);
  return generateForestRow();
}

export function generateRows(amount: number, existingRowCount = 0): RowMetadata[] {
  const rows: RowMetadata[] = [];
  for (let i = 0; i < amount; i++) {
    rows.push(generateRow(existingRowCount + i));
  }
  return rows;
}
