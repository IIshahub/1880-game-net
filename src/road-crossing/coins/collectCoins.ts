import { COIN_POINTS_VALUE } from '../constants';
import type { CoinMeta, RowMetadata } from '../types';

export interface CoinRunStats {
  coinsCollected: number;
  coinPoints: number;
}

export function tryCollectCoinAt(
  rowIndex: number,
  tileIndex: number,
  starterCoins: Record<number, CoinMeta[]>,
  rows: RowMetadata[],
): CoinRunStats | null {
  const starter = starterCoins[rowIndex];
  if (starter) {
    const coin = starter.find((c) => c.tileIndex === tileIndex && !c.collected);
    if (coin) {
      coin.collected = true;
      return { coinsCollected: 1, coinPoints: COIN_POINTS_VALUE };
    }
  }

  if (rowIndex < 1) return null;
  const data = rows[rowIndex - 1];
  if (!data || data.type !== 'forest' || !data.coins?.length) return null;

  const coin = data.coins.find((c) => c.tileIndex === tileIndex && !c.collected);
  if (!coin) return null;
  coin.collected = true;
  return { coinsCollected: 1, coinPoints: COIN_POINTS_VALUE };
}
