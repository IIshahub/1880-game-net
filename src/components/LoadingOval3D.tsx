'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type { Group, Mesh } from 'three';

function OvalRings() {
  const group = useRef<Group>(null);
  const ringA = useRef<Mesh>(null);
  const ringB = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.35;
    if (ringA.current) ringA.current.rotation.x += delta * 1.6;
    if (ringB.current) ringB.current.rotation.z -= delta * 1.15;
  });

  return (
    <group ref={group} scale={[1, 0.55, 1]}>
      <mesh ref={ringA} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[1.15, 0.07, 16, 64]} />
        <meshStandardMaterial
          color="#7c9cff"
          emissive="#4a6cf7"
          emissiveIntensity={0.65}
          metalness={0.4}
          roughness={0.25}
        />
      </mesh>
      <mesh ref={ringB} rotation={[Math.PI / 2.6, 0.4, 0.2]} scale={0.78}>
        <torusGeometry args={[1.15, 0.055, 16, 64]} />
        <meshStandardMaterial
          color="#ff6b9d"
          emissive="#ff2d6f"
          emissiveIntensity={0.55}
          metalness={0.35}
          roughness={0.3}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.22, 24, 24]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#9eb6ff"
          emissiveIntensity={0.8}
          metalness={0.2}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

export function LoadingOval3D() {
  return (
    <div className="loading-oval-canvas" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.35, 3.2], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 4, 5]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-2, -1, 2]} intensity={0.7} color="#ff6b9d" />
        <OvalRings />
      </Canvas>
    </div>
  );
}
