'use client';

import { useTexture } from '@react-three/drei';

interface PhotoCubeCharacterProps {
  texturePath: string;
  size?: [number, number, number];
}

const DEFAULT_SIZE: [number, number, number] = [15, 15, 20];

/** Cube with photo texture — size defaults to standard player, Ali uses a larger cube. */
export function PhotoCubeCharacter({ texturePath, size = DEFAULT_SIZE }: PhotoCubeCharacterProps) {
  const texture = useTexture(texturePath);
  const [width, depth, height] = size;

  return (
    <mesh position={[0, 0, height / 2]} castShadow receiveShadow>
      <boxGeometry args={[width, depth, height]} />
      <meshStandardMaterial map={texture} flatShading />
    </mesh>
  );
}
