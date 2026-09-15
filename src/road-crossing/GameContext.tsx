'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import type { PlayerSlot } from './constants';
import type { Direction } from './types';

type QueueMoveFn = (direction: Direction, player?: PlayerSlot) => void;

interface GameContextValue {
  queueMove: QueueMoveFn;
  registerQueueMove: (fn: QueueMoveFn) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameControlsProvider({ children }: { children: ReactNode }) {
  const queueMoveRef = useRef<QueueMoveFn>(() => {});

  const registerQueueMove = useCallback((fn: QueueMoveFn) => {
    queueMoveRef.current = fn;
  }, []);

  const queueMove = useCallback<QueueMoveFn>((direction, player = 0) => {
    queueMoveRef.current(direction, player);
  }, []);

  const value = useMemo(
    () => ({ queueMove, registerQueueMove }),
    [queueMove, registerQueueMove],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useRoadCrossingControls() {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error('useRoadCrossingControls must be used within GameControlsProvider');
  }
  return ctx;
}
