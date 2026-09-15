import { tilesPerRow, tileSize } from '../constants';
import { getCurrentTheme } from '../../themeManager';
import { VehicleCar } from './VehicleCar';
import { VehicleTruck } from './VehicleTruck';
import type { CarRow, TruckRow } from '../types';

export function RoadRow({
  rowIndex,
  data,
}: {
  rowIndex: number;
  data: CarRow | TruckRow;
}) {
  const theme = getCurrentTheme();
  const stripe = theme.colors.roadStripe ?? 0xd4d4d8;
  const stripeCount = 12;

  return (
    <group position={[0, rowIndex * tileSize, 0]}>
      <mesh rotation={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[tilesPerRow * tileSize, tileSize]} />
        <meshStandardMaterial
          color={theme.colors.road}
          flatShading
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>
      {/* curb / shoulder */}
      <mesh position={[0, tileSize * 0.48, 0.4]} receiveShadow>
        <boxGeometry args={[tilesPerRow * tileSize, 2.2, 1.2]} />
        <meshStandardMaterial color={theme.colors.road} roughness={0.9} metalness={0} />
      </mesh>
      <mesh position={[0, -tileSize * 0.48, 0.4]} receiveShadow>
        <boxGeometry args={[tilesPerRow * tileSize, 2.2, 1.2]} />
        <meshStandardMaterial color={theme.colors.road} roughness={0.9} metalness={0} />
      </mesh>
      {Array.from({ length: stripeCount }).map((_, i) => {
        const x = ((i - stripeCount / 2 + 0.5) * (tilesPerRow * tileSize)) / stripeCount;
        return (
          <mesh key={i} position={[x, 0, 0.55]}>
            <planeGeometry args={[tileSize * 0.32, tileSize * 0.07]} />
            <meshStandardMaterial
              color={stripe}
              transparent
              opacity={0.7}
              roughness={0.6}
              metalness={0.1}
            />
          </mesh>
        );
      })}
      {data.type === 'car' &&
        data.vehicles.map((vehicle, i) => (
          <VehicleCar key={i} vehicle={vehicle} direction={data.direction} />
        ))}
      {data.type === 'truck' &&
        data.vehicles.map((vehicle, i) => (
          <VehicleTruck key={i} vehicle={vehicle} direction={data.direction} />
        ))}
    </group>
  );
}
