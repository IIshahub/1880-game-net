import type { PlayerPosition } from '../types';
import { CHAIN_MAX_TILE_DISTANCE } from '../constants';

/** Horizontal (tile) distance. */
export function tileAxisDistance(a: PlayerPosition, b: PlayerPosition): number {
  return Math.abs(a.currentTile - b.currentTile);
}

/** Vertical / forward (row) distance on the board. */
export function rowAxisDistance(a: PlayerPosition, b: PlayerPosition): number {
  return Math.abs(a.currentRow - b.currentRow);
}

/**
 * Players stay linked if both axes are within max (Chebyshev).
 * So vertical (row) gap can be up to 4 even when side-by-side.
 */
export function isWithinChain(
  a: PlayerPosition,
  b: PlayerPosition,
  maxDistance = CHAIN_MAX_TILE_DISTANCE,
): boolean {
  return rowAxisDistance(a, b) <= maxDistance && tileAxisDistance(a, b) <= maxDistance;
}

/** Team score = trailing player's row (both must advance). */
export function teamScore(a: PlayerPosition, b: PlayerPosition): number {
  return Math.min(a.currentRow, b.currentRow);
}
