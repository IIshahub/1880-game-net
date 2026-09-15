'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, type RefObject } from 'react';
import * as THREE from 'three';
import { CHAIN_HEIGHT_Z } from '../constants';
import type { PlayerCharacterHandle } from '../components/PlayerCharacter';

const LINK_COUNT = 12;

interface ChainLinkProps {
  playerA: RefObject<PlayerCharacterHandle | null>;
  playerB: RefObject<PlayerCharacterHandle | null>;
}

/**
 * Visible metal chain between the two players (spheres + rings).
 */
export function ChainLink({ playerA, playerB }: ChainLinkProps) {
  const groupRef = useRef<THREE.Group>(null);
  const tmpA = useMemo(() => new THREE.Vector3(), []);
  const tmpB = useMemo(() => new THREE.Vector3(), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  const links = useMemo(
    () =>
      Array.from({ length: LINK_COUNT }, (_, i) => ({
        key: i,
        isRing: i % 2 === 1,
      })),
    [],
  );

  useFrame(() => {
    const a = playerA.current?.container;
    const b = playerB.current?.container;
    const group = groupRef.current;
    if (!a || !b || !group) return;

    tmpA.set(a.position.x, a.position.y, a.position.z + CHAIN_HEIGHT_Z);
    tmpB.set(b.position.x, b.position.y, b.position.z + CHAIN_HEIGHT_Z);

    const children = group.children;
    for (let i = 0; i < LINK_COUNT; i += 1) {
      const t = (i + 1) / (LINK_COUNT + 1);
      tmp.lerpVectors(tmpA, tmpB, t);
      tmp.z -= Math.sin(t * Math.PI) * 8;
      const child = children[i];
      if (!child) continue;
      child.position.copy(tmp);
      child.lookAt(tmpB);
      child.rotateX(Math.PI / 2);
    }
  });

  return (
    <group ref={groupRef}>
      {links.map((link) =>
        link.isRing ? (
          <mesh key={link.key} castShadow>
            <torusGeometry args={[3.6, 1.25, 8, 16]} />
            <meshStandardMaterial
              color="#d4af37"
              metalness={0.85}
              roughness={0.35}
              emissive="#8a6914"
              emissiveIntensity={0.3}
            />
          </mesh>
        ) : (
          <mesh key={link.key} castShadow>
            <sphereGeometry args={[2.8, 12, 12]} />
            <meshStandardMaterial
              color="#f0d878"
              metalness={0.8}
              roughness={0.3}
              emissive="#a07820"
              emissiveIntensity={0.25}
            />
          </mesh>
        ),
      )}
    </group>
  );
}
