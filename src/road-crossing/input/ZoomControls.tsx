'use client';

import { useCallback, useEffect, type RefObject } from 'react';
import {
  CAMERA_ZOOM_MAX,
  CAMERA_ZOOM_MIN,
  CAMERA_ZOOM_STEP,
} from '../constants';

interface ZoomControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  shellRef?: RefObject<HTMLElement | null>;
  disabled?: boolean;
}

function clampZoom(value: number) {
  return Math.min(CAMERA_ZOOM_MAX, Math.max(CAMERA_ZOOM_MIN, value));
}

export function ZoomControls({
  zoom,
  onZoomChange,
  shellRef,
  disabled = false,
}: ZoomControlsProps) {
  const zoomBy = useCallback(
    (delta: number) => {
      if (disabled) return;
      onZoomChange(clampZoom(zoom + delta));
    },
    [disabled, onZoomChange, zoom],
  );

  useEffect(() => {
    const el = shellRef?.current;
    if (!el || disabled) return;

    const onWheel = (e: WheelEvent) => {
      if ((e.target as HTMLElement).closest('button, input, textarea, a')) return;
      e.preventDefault();
      const dir = e.deltaY > 0 ? -CAMERA_ZOOM_STEP : CAMERA_ZOOM_STEP;
      onZoomChange(clampZoom(zoom + dir));
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [shellRef, disabled, onZoomChange, zoom]);

  return (
    <div className="rc-zoom-controls" role="group" aria-label="Camera zoom">
      <button
        type="button"
        className="rc-zoom-btn"
        aria-label="Zoom in"
        disabled={disabled || zoom >= CAMERA_ZOOM_MAX}
        onClick={() => zoomBy(CAMERA_ZOOM_STEP)}
      >
        +
      </button>
      <span className="rc-zoom-value">{Math.round(zoom * 100)}%</span>
      <button
        type="button"
        className="rc-zoom-btn"
        aria-label="Zoom out"
        disabled={disabled || zoom <= CAMERA_ZOOM_MIN}
        onClick={() => zoomBy(-CAMERA_ZOOM_STEP)}
      >
        −
      </button>
    </div>
  );
}
