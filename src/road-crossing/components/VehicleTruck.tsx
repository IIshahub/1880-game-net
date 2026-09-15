'use client';

import { useRef, useEffect } from 'react';
import type { Group } from 'three';
import { tileSize } from '../constants';
import { getCurrentTheme } from '../../themeManager';
import { Wheel } from './Wheel';
import type { VehicleMeta } from '../types';

interface VehicleTruckProps {
  vehicle: VehicleMeta;
  direction: boolean;
}

export function VehicleTruck({ vehicle, direction }: VehicleTruckProps) {
  const ref = useRef<Group>(null);
  const theme = getCurrentTheme();

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
      <mesh position={[-15, 0, 25]} castShadow receiveShadow>
        <boxGeometry args={[70, 35, 35]} />
        <meshStandardMaterial
          color={theme.colors.truckCargo}
          flatShading
          roughness={0.65}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[35, 0, 20]} castShadow receiveShadow>
        <boxGeometry args={[30, 30, 30]} />
        <meshStandardMaterial
          color={vehicle.color}
          flatShading
          roughness={0.55}
          metalness={0.15}
        />
      </mesh>
      <mesh position={[48, -8, 18]} castShadow={false}>
        <boxGeometry args={[4, 6, 4]} />
        <meshStandardMaterial
          color="#fff8dc"
          emissive="#ffee88"
          emissiveIntensity={0.85}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[48, 8, 18]} castShadow={false}>
        <boxGeometry args={[4, 6, 4]} />
        <meshStandardMaterial
          color="#fff8dc"
          emissive="#ffee88"
          emissiveIntensity={0.85}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[-48, -10, 18]} castShadow={false}>
        <boxGeometry args={[3, 5, 3]} />
        <meshStandardMaterial
          color="#ff4444"
          emissive="#ff2222"
          emissiveIntensity={0.55}
        />
      </mesh>
      <mesh position={[-48, 10, 18]} castShadow={false}>
        <boxGeometry args={[3, 5, 3]} />
        <meshStandardMaterial
          color="#ff4444"
          emissive="#ff2222"
          emissiveIntensity={0.55}
        />
      </mesh>
      <Wheel x={37} />
      <Wheel x={5} />
      <Wheel x={-35} />
    </group>
  );
}
