'use client';

import { useEffect, useRef } from 'react';

export default function CRTNoise() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const lastRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Small canvas — CSS stretches it, giving coarser old-TV grain
    const W = 180;
    const H = 120;
    canvas.width = W;
    canvas.height = H;

    function draw(time: number) {
      // ~14fps — slow enough to feel like analog static
      if (time - lastRef.current < 70) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      lastRef.current = time;

      const img = ctx!.createImageData(W, H);
      const d = img.data;

      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i]     = v;
        d[i + 1] = v * 0.38; // tint toward warm — less green/blue
        d[i + 2] = v * 0.22;
        // Vary alpha to create uneven grain density
        d[i + 3] = (Math.random() * 18 + 3) | 0;
      }

      ctx!.putImageData(img, 0, 0);
      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
        borderRadius: 10,
        opacity: 0.28,
        mixBlendMode: 'screen',
        imageRendering: 'pixelated', // keep the coarse pixel grain, no smoothing
      }}
    />
  );
}
