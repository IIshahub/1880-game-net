'use client';

import { useRef, useEffect } from 'react';
import type { Group } from 'three';
import { tileSize } from '../constants';
import { Wheel } from './Wheel';
import type { VehicleMeta } from '../types';

interface VehicleCarProps {
  vehicle: VehicleMeta;
  direction: boolean;
}

function Headlights() {
  return (
    <>
      <mesh position={[28, -8, 12]} castShadow={false}>
        <boxGeometry args={[4, 6, 4]} />
        <meshStandardMaterial
          color="#fff8dc"
          emissive="#ffee88"
          emissiveIntensity={0.85}
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>
      <mesh position={[28, 8, 12]} castShadow={false}>
        <boxGeometry args={[4, 6, 4]} />
        <meshStandardMaterial
          color="#fff8dc"
          emissive="#ffee88"
          emissiveIntensity={0.85}
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>
      <mesh position={[-28, -8, 12]} castShadow={false}>
        <boxGeometry args={[3, 5, 3]} />
        <meshStandardMaterial
          color="#ff4444"
          emissive="#ff2222"
          emissiveIntensity={0.6}
          roughness={0.5}
        />
      </mesh>
      <mesh position={[-28, 8, 12]} castShadow={false}>
        <boxGeometry args={[3, 5, 3]} />
        <meshStandardMaterial
          color="#ff4444"
          emissive="#ff2222"
          emissiveIntensity={0.6}
          roughness={0.5}
        />
      </mesh>
    </>
  );
}

export function VehicleCar({ vehicle, direction }: VehicleCarProps) {
  const ref = useRef<Group>(null);

  useEffect(() => {
    vehicle.ref = ref.current;
    return () => {
      vehicle.ref = null;
    };
  }, [vehicle]);

  return (
    <group
      ref={ref}
      position={[vehicle.initialTileIndex * tileSize, 0, 0]}
      rotation={[0, 0, direction ? 0 : Math.PI]}
    >
      <mesh position={[0, 0, 12]} castShadow receiveShadow>
        <boxGeometry args={[60, 30, 15]} />
        <meshStandardMaterial
          color={vehicle.color}
          flatShading
          roughness={0.55}
          metalness={0.15}
        />
      </mesh>
      <mesh position={[-6, 0, 25.5]} castShadow receiveShadow>
        <boxGeometry args={[33, 24, 12]} />
        <meshStandardMaterial color="#f5f5f5" flatShading roughness={0.4} metalness={0.1} />
      </mesh>
      <Headlights />
      <Wheel x={18} />
      <Wheel x={-18} />
    </group>
  );
}
