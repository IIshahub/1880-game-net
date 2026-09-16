import * as THREE from 'three';
import { INITIAL_GRASS_ROWS, minTileIndex, maxTileIndex } from '../constants';
import type { CoinMeta } from '../types';

/** Coins on the starting grass strip (row indices 0, -1, …). */
export function generateStarterRowCoins(): Record<number, CoinMeta[]> {
  const out: Record<number, CoinMeta[]> = {};
  for (let i = 0; i < INITIAL_GRASS_ROWS; i++) {
    const rowIndex = -i;
    if (Math.random() > 0.55) continue;
    const count = THREE.MathUtils.randInt(1, 2);
    const tiles = new Set<number>();
    const coins: CoinMeta[] = [];
    for (let c = 0; c < count; c++) {
      let tileIndex = THREE.MathUtils.randInt(minTileIndex, maxTileIndex);
      let attempts = 0;
      while (tiles.has(tileIndex) && attempts < 20) {
        tileIndex = THREE.MathUtils.randInt(minTileIndex, maxTileIndex);
        attempts += 1;
      }
      tiles.add(tileIndex);
      coins.push({ tileIndex, collected: false });
    }
    out[rowIndex] = coins;
  }
  return out;
}
