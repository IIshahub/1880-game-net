import { getCurrentTheme } from '../../themeManager';

export function GameLighting() {
  const theme = getCurrentTheme();
  const sky = `#${theme.colors.ambientLight.toString(16).padStart(6, '0')}`;

  return (
    <>
      <color attach="background" args={[sky]} />
      <ambientLight intensity={0.55} color={theme.colors.ambientLight} />
      <hemisphereLight
        args={[theme.colors.directionalLight, theme.colors.grass, 0.35]}
      />
      <directionalLight
        position={[120, -180, 280]}
        intensity={1.1}
        color={theme.colors.directionalLight}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0005}
      >
        <orthographicCamera attach="shadow-camera" args={[-500, 500, 500, -500, 50, 900]} />
      </directionalLight>
    </>
  );
}
