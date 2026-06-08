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
        <meshStandardMaterial color={vehicle.color} flatShading />
      </mesh>
      <mesh position={[-6, 0, 25.5]} castShadow receiveShadow>
        <boxGeometry args={[33, 24, 12]} />
        <meshStandardMaterial color="#f5f5f5" flatShading />
      </mesh>
      <Wheel x={18} />
      <Wheel x={-18} />
    </group>
  );
}
