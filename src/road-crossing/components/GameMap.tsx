import { INITIAL_GRASS_ROWS } from '../constants';
import { GrassRow } from './GrassRow';
import { RoadRow } from './RoadRow';
import type { CoinMeta, RowMetadata } from '../types';

export function GameMap({
  rows,
  starterCoins,
  coinRevision,
}: {
  rows: RowMetadata[];
  starterCoins: Record<number, CoinMeta[]>;
  coinRevision: number;
}) {
  void coinRevision;
  const grassRows = Array.from({ length: INITIAL_GRASS_ROWS }, (_, i) => -i);

  return (
    <group>
      {grassRows.map((rowIndex) => (
        <GrassRow
          key={`grass-${rowIndex}`}
          rowIndex={rowIndex}
          extraCoins={starterCoins[rowIndex]}
        />
      ))}
      {rows.map((rowData, index) => {
        const rowIndex = index + 1;
        if (rowData.type === 'forest') {
          return <GrassRow key={`forest-${rowIndex}`} rowIndex={rowIndex} data={rowData} />;
        }
        return <RoadRow key={`road-${rowIndex}`} rowIndex={rowIndex} data={rowData} />;
      })}
    </group>
  );
}
