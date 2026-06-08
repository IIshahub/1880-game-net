import { calculateFinalPosition } from '../utilities/calculateFinalPosition';
import { minTileIndex, maxTileIndex } from './constants';
import type { Direction, PlayerPosition, RowMetadata } from './types';

export function positionAfterMoves(
  currentPosition: PlayerPosition,
  moves: Direction[],
): PlayerPosition {
  const result = calculateFinalPosition(
    { rowIndex: currentPosition.currentRow, tileIndex: currentPosition.currentTile },
    moves,
  );
  return { currentRow: result.rowIndex, currentTile: result.tileIndex };
}

export function endsUpInValidPosition(
  currentPosition: PlayerPosition,
  moves: Direction[],
  rows: RowMetadata[],
): boolean {
  const start = {
    rowIndex: currentPosition.currentRow,
    tileIndex: currentPosition.currentTile,
  };

  for (let i = 0; i < moves.length; i++) {
    const stepPosition = calculateFinalPosition(start, moves.slice(0, i + 1));

    if (
      stepPosition.rowIndex === -1 ||
      stepPosition.tileIndex < minTileIndex ||
      stepPosition.tileIndex > maxTileIndex
    ) {
      return false;
    }

    const stepRow = rows[stepPosition.rowIndex - 1];
    if (
      stepRow?.type === 'forest' &&
      stepRow.trees.some((tree) => tree.tileIndex === stepPosition.tileIndex)
    ) {
      return false;
    }
  }

  return true;
}
