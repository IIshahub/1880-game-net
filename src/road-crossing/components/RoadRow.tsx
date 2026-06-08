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
  const stripeCount = 12;

  return (
    <group position={[0, rowIndex * tileSize, 0]}>
      <mesh rotation={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[tilesPerRow * tileSize, tileSize]} />
        <meshStandardMaterial color={theme.colors.road} flatShading />
      </mesh>
      {Array.from({ length: stripeCount }).map((_, i) => {
        const x = (i - stripeCount / 2 + 0.5) * (tilesPerRow * tileSize) / stripeCount;
        return (
          <mesh key={i} position={[x, 0, 0.6]}>
            <planeGeometry args={[tileSize * 0.35, tileSize * 0.08]} />
            <meshStandardMaterial color="#d4d4d8" transparent opacity={0.55} />
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
