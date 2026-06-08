'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import type { Direction } from './types';

interface GameContextValue {
  queueMove: (direction: Direction) => void;
  registerQueueMove: (fn: (direction: Direction) => void) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameControlsProvider({ children }: { children: ReactNode }) {
  const queueMoveRef = useRef<(direction: Direction) => void>(() => {});

  const registerQueueMove = useCallback((fn: (direction: Direction) => void) => {
    queueMoveRef.current = fn;
  }, []);

  const queueMove = useCallback((direction: Direction) => {
    queueMoveRef.current(direction);
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
