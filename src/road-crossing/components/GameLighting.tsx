'use client';

import { getCurrentTheme } from '../../themeManager';
import { getShadowMapSize } from '../mobilePerf';

const DEFAULT_LIGHTING = {
  preset: 'day',
  fogNear: 560,
  fogFar: 1600,
  ambientIntensity: 0.58,
  hemisphereIntensity: 0.4,
  directionalIntensity: 1.15,
};

function hexToCss(hex: number) {
  return `#${hex.toString(16).padStart(6, '0')}`;
}

export function GameLighting() {
  const theme = getCurrentTheme();
  const lighting = theme.lighting || DEFAULT_LIGHTING;
  const skyHex = theme.colors.sky ?? theme.colors.ambientLight;
  const fogHex = theme.colors.fog ?? skyHex;
  const shadowSize = getShadowMapSize();
  const isNight = lighting.preset === 'night';
  const isDusk = lighting.preset === 'dusk';

  return (
    <>
      <color attach="background" args={[hexToCss(skyHex)]} />
      <fog attach="fog" args={[fogHex, lighting.fogNear, lighting.fogFar]} />
      <ambientLight
        intensity={lighting.ambientIntensity}
        color={theme.colors.ambientLight}
      />
      <hemisphereLight
        args={[
          theme.colors.directionalLight,
          theme.colors.grass,
          lighting.hemisphereIntensity,
        ]}
      />
      <directionalLight
        position={isNight ? [60, -100, 200] : isDusk ? [160, -100, 220] : [120, -180, 280]}
        intensity={lighting.directionalIntensity}
        color={theme.colors.directionalLight}
        castShadow
        shadow-mapSize-width={shadowSize}
        shadow-mapSize-height={shadowSize}
        shadow-bias={-0.0005}
      >
        <orthographicCamera attach="shadow-camera" args={[-700, 700, 700, -700, 50, 1200]} />
      </directionalLight>
      {isNight && (
        <pointLight
          position={[0, 40, 120]}
          intensity={0.55}
          distance={420}
          color={theme.colors.directionalLight}
        />
      )}
    </>
  );
}
