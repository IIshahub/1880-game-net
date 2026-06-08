import { getCurrentTheme } from '../../themeManager';
import { tileSize } from '../constants';

export function TreeMesh({ tileIndex, height }: { tileIndex: number; height: number }) {
  const theme = getCurrentTheme();

  return (
    <group position={[tileIndex * tileSize, 0, 0]}>
      <mesh position={[0, 0, 10]}>
        <boxGeometry args={[15, 15, 20]} />
        <meshStandardMaterial color={theme.colors.treeTrunk} flatShading />
      </mesh>
      <mesh position={[0, 0, height / 2 + 20]} castShadow receiveShadow>
        <boxGeometry args={[30, 30, height]} />
        <meshStandardMaterial color={theme.colors.treeCrown} flatShading />
      </mesh>
    </group>
  );
}
