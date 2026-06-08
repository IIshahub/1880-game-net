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
        <meshStandardMaterial color={theme.colors.truckCargo} flatShading />
      </mesh>
      <mesh position={[35, 0, 20]} castShadow receiveShadow>
        <boxGeometry args={[30, 30, 30]} />
        <meshStandardMaterial color={vehicle.color} flatShading />
      </mesh>
      <Wheel x={37} />
      <Wheel x={5} />
      <Wheel x={-35} />
    </group>
  );
}
