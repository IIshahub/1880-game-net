import * as THREE from 'three';
import { tileSize } from './constants';
import type { RowMetadata } from './types';

const playerBox = new THREE.Box3();
const vehicleBox = new THREE.Box3();
const chainBox = new THREE.Box3();
const sample = new THREE.Vector3();

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
  playerBox.min.x += 5;
  playerBox.max.x -= 5;
  playerBox.min.y += 5;
  playerBox.max.y -= 5;

  const visualRow = Math.round(playerRoot.position.y / tileSize);
  const rowsToCheck = new Set<number>();

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

/**
 * True if any vehicle hits the chain segment between two players.
 */
export function checkChainVehicleCollision(
  ax: number,
  ay: number,
  az: number,
  bx: number,
  by: number,
  bz: number,
  rows: RowMetadata[],
): boolean {
  const samples = 8;
  const radius = 8;

  const minRow = Math.min(Math.round(ay / tileSize), Math.round(by / tileSize));
  const maxRow = Math.max(Math.round(ay / tileSize), Math.round(by / tileSize));

  for (let rowIndex = Math.max(1, minRow - 1); rowIndex <= maxRow + 1; rowIndex += 1) {
    const row = rows[rowIndex - 1];
    if (!row || (row.type !== 'car' && row.type !== 'truck')) continue;

    for (const vehicle of row.vehicles) {
      if (!vehicle.ref) continue;
      vehicle.ref.updateMatrixWorld(true);
      vehicleBox.setFromObject(vehicle.ref);

      for (let i = 0; i <= samples; i += 1) {
        const t = i / samples;
        sample.set(
          THREE.MathUtils.lerp(ax, bx, t),
          THREE.MathUtils.lerp(ay, by, t),
          THREE.MathUtils.lerp(az, bz, t) - Math.sin(t * Math.PI) * 6,
        );
        chainBox.min.set(sample.x - radius, sample.y - radius, sample.z - radius);
        chainBox.max.set(sample.x + radius, sample.y + radius, sample.z + radius);
        if (chainBox.intersectsBox(vehicleBox)) {
          return true;
        }
      }
    }
  }

  return false;
}
