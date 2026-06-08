export function Wheel({ x }: { x: number }) {
  return (
    <mesh position={[x, 0, 6]} castShadow receiveShadow>
      <boxGeometry args={[12, 33, 12]} />
      <meshStandardMaterial color={0x222222} flatShading />
    </mesh>
  );
}
