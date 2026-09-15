import gsap from 'gsap';
import type { Object3D } from 'three';

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Squash-stretch on hop takeoff / land. */
export function playHopJuice(model: Object3D | null | undefined) {
  if (!model || prefersReducedMotion()) return;

  gsap.killTweensOf(model.scale);
  gsap
    .timeline()
    .to(model.scale, {
      x: 1.15,
      y: 1.15,
      z: 0.75,
      duration: 0.08,
      ease: 'power2.out',
    })
    .to(model.scale, {
      x: 0.9,
      y: 0.9,
      z: 1.2,
      duration: 0.1,
      ease: 'power1.inOut',
    })
    .to(model.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.12,
      ease: 'back.out(2)',
    });
}

export function playLandSquash(model: Object3D | null | undefined) {
  if (!model || prefersReducedMotion()) return;

  gsap.killTweensOf(model.scale);
  gsap
    .timeline()
    .to(model.scale, {
      x: 1.2,
      y: 1.2,
      z: 0.7,
      duration: 0.06,
      ease: 'power2.out',
    })
    .to(model.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.14,
      ease: 'back.out(2.5)',
    });
}
