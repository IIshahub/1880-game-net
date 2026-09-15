export function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;
}

export function getGameDpr(): [number, number] {
  if (typeof window === 'undefined') return [1, 1.5];
  return isMobileViewport() ? [1, 1.25] : [1, 1.75];
}

export function getShadowMapSize(): number {
  return isMobileViewport() ? 1024 : 2048;
}
