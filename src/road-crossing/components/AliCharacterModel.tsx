'use client';

import { Suspense } from 'react';
import { PhotoCubeCharacter } from './PhotoCubeCharacter';

interface AliCharacterModelProps {
  texturePath: string;
  size?: [number, number, number];
}

export function AliCharacterModel({ texturePath, size }: AliCharacterModelProps) {
  return (
    <Suspense fallback={null}>
      <PhotoCubeCharacter texturePath={texturePath} size={size} />
    </Suspense>
  );
}
