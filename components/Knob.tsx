'use client';

import { useRef, useEffect } from 'react';
import { useKnobDrag } from '@/hooks/useKnobDrag';

interface KnobProps {
  label: string;
  angle: number;
  onAngleChange: (angle: number) => void;
}

/**
 * Rotary knob with concentric groove rings (like the reference hardware dial).
 * Grooves are drawn on a canvas for crisp rendering at any scale.
 */
export default function Knob({ label, angle, onAngleChange }: KnobProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { onPointerDown, onPointerMove, onPointerUp } = useKnobDrag({
    angle,
    onAngleChange,
  });

  // Draw concentric grooves once on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 200; // 2x for retina
    canvas.width = size;
    canvas.height = size;
    const cx = size / 2;
    const cy = size / 2;
    const outerR = size / 2 - 2;

    // Base fill — light metallic radial
    const baseFill = ctx.createRadialGradient(cx, cy - 18, 0, cx, cy, outerR);
    baseFill.addColorStop(0, '#E8E6E1');
    baseFill.addColorStop(0.3, '#D8D6D1');
    baseFill.addColorStop(0.7, '#C4C2BC');
    baseFill.addColorStop(1, '#B0AEA8');
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.fillStyle = baseFill;
    ctx.fill();

    // Concentric groove rings — alternating dark groove / light highlight
    const ringStart = 12;
    const ringEnd = outerR - 2;
    const ringSpacing = 3.2;
    for (let r = ringStart; r < ringEnd; r += ringSpacing) {
      const norm = (r - ringStart) / (ringEnd - ringStart);
      const grooveAlpha = 0.08 + norm * 0.06;
      const highlightAlpha = 0.15 + norm * 0.1;

      // Dark groove
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(0,0,0,${grooveAlpha})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Light highlight (offset half spacing)
      ctx.beginPath();
      ctx.arc(cx, cy, r + ringSpacing * 0.45, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,255,255,${highlightAlpha})`;
      ctx.lineWidth = 0.6;
      ctx.stroke();
    }

    // Top light crescent reflection
    const shineGrad = ctx.createRadialGradient(cx, cy - 30, 10, cx, cy - 20, outerR * 0.75);
    shineGrad.addColorStop(0, 'rgba(255,255,255,0.18)');
    shineGrad.addColorStop(0.5, 'rgba(255,255,255,0.04)');
    shineGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, outerR - 1, 0, Math.PI * 2);
    ctx.fillStyle = shineGrad;
    ctx.fill();

    // Bottom shadow
    const shadowGrad = ctx.createRadialGradient(cx, cy + 30, 10, cx, cy + 20, outerR * 0.8);
    shadowGrad.addColorStop(0, 'rgba(0,0,0,0.12)');
    shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, outerR - 1, 0, Math.PI * 2);
    ctx.fillStyle = shadowGrad;
    ctx.fill();
  }, []);

  return (
    <div style={styles.wrapper}>
      <div
        style={{ ...styles.outer, transform: `rotate(${angle}deg)` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <canvas ref={canvasRef} style={styles.canvas} />
        <div style={styles.dot} />
      </div>
      <span style={styles.label}>{label}</span>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    userSelect: 'none',
  },
  outer: {
    width: 100,
    height: 100,
    borderRadius: '50%',
    position: 'relative',
    cursor: 'grab',
    flexShrink: 0,
    // Outer bevel ring
    background: 'linear-gradient(160deg, #D4D2CD 0%, #B0AEA8 40%, #8A8883 100%)',
    boxShadow:
      '0 8px 24px rgba(0,0,0,0.55), ' +
      '0 3px 8px rgba(0,0,0,0.35), ' +
      'inset 0 1px 0 rgba(255,255,255,0.25), ' +
      'inset 0 -1px 0 rgba(0,0,0,0.15)',
    padding: 3,
  },
  canvas: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    display: 'block',
  },
  dot: {
    position: 'absolute',
    top: 8,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 5,
    height: 5,
    borderRadius: '50%',
    background: '#E8593C',
    boxShadow: '0 0 5px #E8593C, 0 0 10px rgba(232,89,60,0.35)',
    zIndex: 2,
  },
  label: {
    fontSize: 9,
    fontWeight: 500,
    letterSpacing: '2.5px',
    textTransform: 'uppercase',
    color: 'var(--t3)',
    textShadow: '0 1px 0 rgba(255,255,255,0.04)',
  },
};
