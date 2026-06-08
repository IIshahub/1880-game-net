'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import type { Group } from 'three';
import { getCurrentCharacter } from '../../characterManager';
import { AliCharacterModel } from './AliCharacterModel';

export interface PlayerCharacterHandle {
  model: Group | null;
  container: Group | null;
}

export const PlayerCharacter = forwardRef<PlayerCharacterHandle>(function PlayerCharacter(
  _props,
  ref,
) {
  const containerRef = useRef<Group>(null);
  const modelRef = useRef<Group>(null);
  const character = getCurrentCharacter();

  useImperativeHandle(ref, () => ({
    get model() {
      return modelRef.current;
    },
    get container() {
      return containerRef.current;
    },
  }));

  return (
    <group ref={containerRef}>
      <group ref={modelRef}>
        {character.style === 'textured' && character.texture ? (
          <AliCharacterModel
            texturePath={character.texture}
            size={character.cubeSize}
          />
        ) : (
          <>
            <mesh position={[0, 0, 10]} castShadow receiveShadow>
              <boxGeometry args={[15, 15, 20]} />
              <meshStandardMaterial color={character.colors.body} flatShading />
            </mesh>
            <mesh position={[0, 0, 21]} castShadow receiveShadow>
              <boxGeometry args={[2, 4, 2]} />
              <meshStandardMaterial color={character.colors.cap} flatShading />
            </mesh>
            <mesh position={[-4, 8, 18]} castShadow>
              <boxGeometry args={[2, 2, 2]} />
              <meshStandardMaterial color={character.colors.eyes} flatShading />
            </mesh>
            <mesh position={[4, 8, 18]} castShadow>
              <boxGeometry args={[2, 2, 2]} />
              <meshStandardMaterial color={character.colors.eyes} flatShading />
            </mesh>
          </>
        )}
      </group>
    </group>
  );
});
