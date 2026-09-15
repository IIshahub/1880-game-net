import gsap from 'gsap';
import { prefersReducedMotion } from './playerHop';

export interface ShakeOffset {
  x: number;
  y: number;
  z: number;
}

export function createShakeOffset(): ShakeOffset {
  return { x: 0, y: 0, z: 0 };
}

export function playCameraPunch(offset: ShakeOffset, strength = 6) {
  if (prefersReducedMotion()) return;

  gsap.killTweensOf(offset);
  gsap.fromTo(
    offset,
    { x: 0, y: 0, z: 0 },
    {
      x: (Math.random() - 0.5) * strength,
      y: (Math.random() - 0.5) * strength,
      z: (Math.random() - 0.5) * strength * 0.5,
      duration: 0.05,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out',
      onComplete: () => {
        offset.x = 0;
        offset.y = 0;
        offset.z = 0;
      },
    },
  );
}

export function playHitShake(offset: ShakeOffset) {
  if (prefersReducedMotion()) {
    offset.x = 0;
    offset.y = 0;
    offset.z = 0;
    return;
  }

  gsap.killTweensOf(offset);
  gsap.fromTo(
    offset,
    { x: 0, y: 0, z: 0 },
    {
      x: 18,
      y: -14,
      z: 8,
      duration: 0.05,
      yoyo: true,
      repeat: 7,
      ease: 'power1.inOut',
      onComplete: () => {
        offset.x = 0;
        offset.y = 0;
        offset.z = 0;
      },
    },
  );
}
