'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

interface LandDustProps {
  /** Bump this counter to burst dust at `origin`. */
  burstId: number;
  origin: THREE.Vector3;
}

const COUNT = 14;

export function LandDust({ burstId, origin }: LandDustProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const lifeRef = useRef(0);
  const lastBurst = useRef(0);

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const velocities = Array.from({ length: COUNT }, () => new THREE.Vector3());
    return { positions, velocities };
  }, []);

  useFrame((_, delta) => {
    const points = pointsRef.current;
    if (!points) return;

    if (burstId !== lastBurst.current && burstId > 0) {
      lastBurst.current = burstId;
      lifeRef.current = 0.45;
      for (let i = 0; i < COUNT; i += 1) {
        positions[i * 3] = origin.x + (Math.random() - 0.5) * 6;
        positions[i * 3 + 1] = origin.y + (Math.random() - 0.5) * 6;
        positions[i * 3 + 2] = origin.z + 2;
        velocities[i].set(
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 40,
          Math.random() * 25 + 10,
        );
      }
      points.geometry.attributes.position.needsUpdate = true;
      points.visible = true;
    }

    if (lifeRef.current <= 0) {
      points.visible = false;
      return;
    }

    lifeRef.current -= delta;
    for (let i = 0; i < COUNT; i += 1) {
      positions[i * 3] += velocities[i].x * delta;
      positions[i * 3 + 1] += velocities[i].y * delta;
      positions[i * 3 + 2] += velocities[i].z * delta;
      velocities[i].z -= 60 * delta;
    }
    points.geometry.attributes.position.needsUpdate = true;
    const mat = points.material as THREE.PointsMaterial;
    mat.opacity = Math.max(0, lifeRef.current / 0.45);
  });

  return (
    <points ref={pointsRef} visible={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#d4c4a8"
        size={4}
        transparent
        opacity={0.85}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
