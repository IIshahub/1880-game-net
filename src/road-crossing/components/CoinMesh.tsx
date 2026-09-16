'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { tileSize } from '../constants';

export function CoinMesh({ tileIndex }: { tileIndex: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const g = groupRef.current;
    if (!g) return;
    g.rotation.y += delta * 2.4;
    g.position.z = 14 + Math.sin(performance.now() * 0.004 + tileIndex) * 2;
  });

  return (
    <group ref={groupRef} position={[tileIndex * tileSize, 0, 14]}>
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[7, 7, 2.2, 16]} />
        <meshStandardMaterial color="#ffd54a" metalness={0.85} roughness={0.25} emissive="#a87400" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[0, 0, 1.4]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[4.5, 4.5, 0.6, 12]} />
        <meshStandardMaterial color="#ffe082" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}
