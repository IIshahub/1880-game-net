'use client';

import dynamic from 'next/dynamic';

const LoadingOval3D = dynamic(
  () => import('./LoadingOval3D').then((m) => m.LoadingOval3D),
  {
    ssr: false,
    loading: () => (
      <div className="loading-oval-stage loading-oval-stage-fallback" aria-hidden="true">
        <div className="loading-oval loading-oval-a" />
        <div className="loading-oval loading-oval-b" />
        <div className="loading-oval-core" />
      </div>
    ),
  },
);

interface LoadingScreenProps {
  title?: string;
}

export default function LoadingScreen({ title = 'Loading' }: LoadingScreenProps) {
  return (
    <div className="loading-screen" role="status" aria-live="polite" aria-label={title}>
      <div className="loading-screen-inner">
        <LoadingOval3D />
        <p className="loading-screen-title">{title}</p>
        <p className="loading-screen-hint">Get ready…</p>
      </div>
    </div>
  );
}
