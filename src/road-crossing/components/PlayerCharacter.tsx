'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import type { Group } from 'three';
import { getCurrentCharacter } from '../../characterManager';
import { AliCharacterModel } from './AliCharacterModel';
import { PartnerVoxelModel, VoxelAnimalModel } from './VoxelAnimalModel';

export interface PlayerCharacterHandle {
  model: Group | null;
  container: Group | null;
}

interface PlayerCharacterProps {
  /** 0 = selected character, 1 = partner (chained mode) */
  slot?: 0 | 1;
}

export const PlayerCharacter = forwardRef<PlayerCharacterHandle, PlayerCharacterProps>(
  function PlayerCharacter({ slot = 0 }, ref) {
    const containerRef = useRef<Group>(null);
    const modelRef = useRef<Group>(null);
    const character = getCurrentCharacter();
    const isPartner = slot === 1;

    useImperativeHandle(ref, () => ({
      get model() {
        return modelRef.current;
      },
      get container() {
        return containerRef.current;
      },
    }));

    const useTexture = !isPartner && character.style === 'textured' && character.texture;
    const useVoxel = !isPartner && character.style === 'voxel';

    return (
      <group ref={containerRef}>
        <group ref={modelRef}>
          {isPartner ? (
            <PartnerVoxelModel />
          ) : useTexture ? (
            <AliCharacterModel
              texturePath={character.texture}
              size={character.cubeSize}
            />
          ) : useVoxel ? (
            <VoxelAnimalModel
              species={character.species || character.id}
              colors={character.colors}
            />
          ) : (
            <>
              <mesh position={[0, 0, 10]} castShadow receiveShadow>
                <boxGeometry args={[15, 15, 20]} />
                <meshStandardMaterial
                  color={character.colors.body}
                  flatShading
                  roughness={0.55}
                  metalness={0.08}
                />
              </mesh>
              <mesh position={[0, 0, 21]} castShadow receiveShadow>
                <boxGeometry args={[2, 4, 2]} />
                <meshStandardMaterial
                  color={character.colors.cap ?? character.colors.accent ?? 0xf0619a}
                  flatShading
                  roughness={0.45}
                  metalness={0.1}
                />
              </mesh>
              <mesh position={[-4, 8, 18]} castShadow>
                <boxGeometry args={[2, 2, 2]} />
                <meshStandardMaterial color={character.colors.eyes ?? 0x111111} flatShading />
              </mesh>
              <mesh position={[4, 8, 18]} castShadow>
                <boxGeometry args={[2, 2, 2]} />
                <meshStandardMaterial color={character.colors.eyes ?? 0x111111} flatShading />
              </mesh>
            </>
          )}
        </group>
      </group>
    );
  },
);
