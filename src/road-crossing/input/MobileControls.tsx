'use client';

import type { PointerEvent } from 'react';
import type { PlayerSlot } from '../constants';
import type { Direction } from '../types';
import { useRoadCrossingControls } from '../GameContext';

const DIRS: { id: Direction; label: string; className: string }[] = [
  { id: 'forward', label: '▲', className: 'rc-pad-forward' },
  { id: 'left', label: '◀', className: 'rc-pad-left' },
  { id: 'backward', label: '▼', className: 'rc-pad-backward' },
  { id: 'right', label: '▶', className: 'rc-pad-right' },
];

interface MobileControlsProps {
  disabled?: boolean;
  player?: PlayerSlot;
  label?: string;
  className?: string;
}

export function MobileControls({
  disabled = false,
  player = 0,
  label,
  className = '',
}: MobileControlsProps) {
  const { queueMove } = useRoadCrossingControls();

  const fire = (direction: Direction) => (e: PointerEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    queueMove(direction, player);
  };

  return (
    <div
      className={`rc-controls ${player === 1 ? 'rc-controls-p2' : 'rc-controls-p1'} ${className}`}
      aria-label={label || (player === 1 ? 'Player 2 controls' : 'Player 1 controls')}
    >
      {label ? <span className="rc-controls-label">{label}</span> : null}
      <div className="rc-controls-pad">
        {DIRS.map((d) => (
          <button
            key={d.id}
            type="button"
            className={`rc-pad-btn ${d.className}`}
            aria-label={`${label || `P${player + 1}`} ${d.id}`}
            disabled={disabled}
            onPointerDown={fire(d.id)}
          >
            {d.label}
          </button>
        ))}
      </div>
    </div>
  );
}
