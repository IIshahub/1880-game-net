'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GameIndexPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page if no gameId is provided
    router.push('/');
  }, [router]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <p>Redirecting to game menu...</p>
    </div>
  );
}

