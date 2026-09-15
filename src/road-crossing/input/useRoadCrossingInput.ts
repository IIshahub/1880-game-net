'use client';

import { useCallback, useEffect, type RefObject } from 'react';
import type { PlayerSlot } from '../constants';
import type { Direction } from '../types';
import { useRoadCrossingControls } from '../GameContext';

const SWIPE_MIN_DIST = 36;

const P1_KEYS: Record<string, Direction> = {
  ArrowUp: 'forward',
  ArrowDown: 'backward',
  ArrowLeft: 'left',
  ArrowRight: 'right',
};

/** Physical keys — works across layouts (unlike event.key alone). */
const P2_CODES: Record<string, Direction> = {
  KeyW: 'forward',
  KeyS: 'backward',
  KeyA: 'left',
  KeyD: 'right',
  Numpad8: 'forward',
  Numpad5: 'backward',
  Numpad4: 'left',
  Numpad6: 'right',
};

interface UseRoadCrossingInputOptions {
  shellRef?: RefObject<HTMLElement | null>;
  enabled?: boolean;
  chainedMode?: boolean;
}

export function useRoadCrossingInput({
  shellRef,
  enabled = true,
  chainedMode = false,
}: UseRoadCrossingInputOptions = {}) {
  const { queueMove } = useRoadCrossingControls();

  const move = useCallback(
    (direction: Direction, player: PlayerSlot = 0) => {
      if (!enabled) return;
      queueMove(direction, player);
    },
    [enabled, queueMove],
  );

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      if ((event.target as HTMLElement)?.closest?.('input, textarea')) return;

      const p1Dir = P1_KEYS[event.key];
      if (p1Dir) {
        event.preventDefault();
        move(p1Dir, 0);
        return;
      }

      if (!chainedMode) return;

      const p2Dir = P2_CODES[event.code];
      if (p2Dir) {
        event.preventDefault();
        move(p2Dir, 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, move, chainedMode]);

  useEffect(() => {
    if (!enabled) return;
    const el = shellRef?.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;
    let tracking = false;

    const onPointerDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('button, a, input, textarea')) return;
      tracking = true;
      startX = e.clientX;
      startY = e.clientY;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!tracking) return;
      tracking = false;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      if (Math.max(absX, absY) < SWIPE_MIN_DIST) return;

      const dir: Direction =
        absY > absX ? (dy < 0 ? 'forward' : 'backward') : dx < 0 ? 'left' : 'right';
      move(dir, 0);
    };

    const onPointerCancel = () => {
      tracking = false;
    };

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointercancel', onPointerCancel);
    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('pointercancel', onPointerCancel);
    };
  }, [enabled, move, shellRef]);

  return { move };
}
