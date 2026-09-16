import { tilesPerRow, tileSize } from '../constants';
import { getCurrentTheme } from '../../themeManager';
import { TreeMesh } from './TreeMesh';
import { CoinMesh } from './CoinMesh';
import type { CoinMeta, ForestRow } from '../types';

export function GrassRow({
  rowIndex,
  data,
  extraCoins,
}: {
  rowIndex: number;
  data?: ForestRow;
  extraCoins?: CoinMeta[];
}) {
  const theme = getCurrentTheme();

  return (
    <group position={[0, rowIndex * tileSize, 0]}>
      <mesh position={[0, 0, 1.5]} receiveShadow>
        <boxGeometry args={[tilesPerRow * tileSize, tileSize, 3]} />
        <meshStandardMaterial
          color={theme.colors.grass}
          flatShading
          roughness={0.92}
          metalness={0.02}
        />
      </mesh>
      {/* subtle top edge strip for depth */}
      <mesh position={[0, 0, 3.1]} receiveShadow>
        <boxGeometry args={[tilesPerRow * tileSize, tileSize * 0.98, 0.4]} />
        <meshStandardMaterial
          color={theme.colors.grass}
          flatShading
          roughness={0.88}
          metalness={0}
          transparent
          opacity={0.35}
        />
      </mesh>
      {data?.trees.map((tree, i) => (
        <TreeMesh key={i} tileIndex={tree.tileIndex} height={tree.height} />
      ))}
      {(extraCoins ?? data?.coins ?? [])
        .filter((c) => !c.collected)
        .map((coin) => (
          <CoinMesh key={`coin-${rowIndex}-${coin.tileIndex}`} tileIndex={coin.tileIndex} />
        ))}
    </group>
  );
}
