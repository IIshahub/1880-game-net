import { getCurrentTheme } from '../../themeManager';
import { tileSize } from '../constants';

export function TreeMesh({ tileIndex, height }: { tileIndex: number; height: number }) {
  const theme = getCurrentTheme();

  return (
    <group position={[tileIndex * tileSize, 0, 0]}>
      <mesh position={[0, 0, 10]} castShadow>
        <boxGeometry args={[12, 12, 20]} />
        <meshStandardMaterial
          color={theme.colors.treeTrunk}
          flatShading
          roughness={0.9}
          metalness={0.02}
        />
      </mesh>
      <mesh position={[0, 0, height / 2 + 20]} castShadow receiveShadow>
        <boxGeometry args={[28, 28, height]} />
        <meshStandardMaterial
          color={theme.colors.treeCrown}
          flatShading
          roughness={0.75}
          metalness={0.04}
        />
      </mesh>
      {/* lighter crown cap for depth */}
      <mesh position={[0, 0, height + 22]} castShadow={false}>
        <boxGeometry args={[18, 18, 8]} />
        <meshStandardMaterial
          color={theme.colors.treeCrown}
          flatShading
          roughness={0.65}
          metalness={0}
          transparent
          opacity={0.85}
        />
      </mesh>
    </group>
  );
}
