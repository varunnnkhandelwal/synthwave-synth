'use client';

import { useState, useEffect } from 'react';
import SynthDevice from '@/components/SynthDevice';

const DEVICE_W = 880;

export default function Home() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function update() {
      setScale(Math.min(1, (window.innerWidth - 24) / DEVICE_W));
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <div style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
    }}>
      <div style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        willChange: 'transform',
        // Collapse the extra layout space so the page doesn't over-scroll
        marginBottom: `calc((${scale} - 1) * 100%)`,
      }}>
        <SynthDevice />
      </div>
    </div>
  );
}
