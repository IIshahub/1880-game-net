import * as THREE from 'three';
import { tileSize } from './constants';
import type { RowMetadata } from './types';

const playerBox = new THREE.Box3();
const vehicleBox = new THREE.Box3();

/**
 * Detect vehicle collisions using world-space bounding boxes.
 * Uses the player's visual Y position (not logical row) so hits register
 * during move animations and when straddling two lanes.
 */
export function checkVehicleCollision(
  playerRoot: THREE.Object3D,
  logicalRow: number,
  rows: RowMetadata[],
): boolean {
  playerRoot.updateMatrixWorld(true);

  playerBox.setFromObject(playerRoot);
  // Slightly shrink player hit box for fairer gameplay
  playerBox.min.x += 5;
  playerBox.max.x -= 5;
  playerBox.min.y += 5;
  playerBox.max.y -= 5;

  const visualRow = Math.round(playerRoot.position.y / tileSize);
  const rowsToCheck = new Set<number>();

  // Only check road rows the player is actually on (or moving between)
  if (logicalRow >= 1) rowsToCheck.add(logicalRow);
  if (visualRow >= 1) rowsToCheck.add(visualRow);

  for (const rowIndex of rowsToCheck) {
    const row = rows[rowIndex - 1];
    if (!row || (row.type !== 'car' && row.type !== 'truck')) continue;

    for (const vehicle of row.vehicles) {
      if (!vehicle.ref) continue;

      vehicle.ref.updateMatrixWorld(true);
      vehicleBox.setFromObject(vehicle.ref);
      vehicleBox.min.z += 3;
      vehicleBox.max.z -= 3;

      if (playerBox.intersectsBox(vehicleBox)) {
        return true;
      }
    }
  }

  return false;
}
