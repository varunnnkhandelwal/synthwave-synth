'use client';

import { useEffect, useRef, useState } from 'react';
import { createAudioEngine, AudioEngine } from '@/audio/engine';

export function useAudioEngine() {
  const engineRef = useRef<AudioEngine | null>(null);
  const [ready, setReady] = useState(false);
  const [latency, setLatency] = useState(0);

  async function init() {
    if (engineRef.current) return;
    const engine = await createAudioEngine();
    engineRef.current = engine;
    setReady(true);

    // Approximate latency from Tone context
    const ctx = (await import('tone')).getContext().rawContext as AudioContext;
    setLatency(Math.round(ctx.baseLatency * 1000 * 10) / 10);
  }

  useEffect(() => {
    return () => {
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, []);

  return { engineRef, ready, latency, init };
}
