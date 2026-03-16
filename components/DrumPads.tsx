'use client';

import { memo } from 'react';
import { DRUM_PAD_GRID } from '@/audio/drums';

interface DrumPadsProps {
  activePad: string | null;
  onTrigger: (id: string) => void;
}

interface PadProps {
  id: string;
  keyHint: string;
  isActive: boolean;
  onTrigger: (id: string) => void;
}

const Pad = memo(function Pad({ id, keyHint, isActive, onTrigger }: PadProps) {
  return (
    <div
      onPointerDown={() => onTrigger(id)}
      style={{
        position: 'relative',
        borderRadius: 16,
        cursor: 'pointer',
        userSelect: 'none',
        overflow: 'hidden',
        // Outer shell — inset groove like a real pad mount
        background: '#0E0E11',
        padding: 3,
        boxShadow: isActive
          ? '0 0 22px rgba(232,89,60,0.25), 0 4px 12px rgba(0,0,0,0.6)'
          : '0 4px 12px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.03)',
      }}
    >
      {/* The actual pad surface with cushion effect */}
      <div style={{
        width: '100%',
        height: '100%',
        borderRadius: 13,
        // Convex cushion: bright centre fading to dark edges
        background: isActive
          ? `radial-gradient(ellipse at 38% 32%,
              rgba(232,89,60,0.75) 0%,
              rgba(180,55,28,0.45) 30%,
              rgba(80,20,10,0.3) 60%,
              rgba(14,14,17,0.95) 100%)`
          : `radial-gradient(ellipse at 38% 32%,
              #38383F 0%,
              #28282E 35%,
              #1C1C21 65%,
              #141417 100%)`,
        boxShadow: isActive
          ? 'inset 0 0 24px rgba(232,89,60,0.2), inset 0 2px 0 rgba(255,255,255,0.06)'
          : 'inset 0 2px 0 rgba(255,255,255,0.07), inset 0 -2px 4px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        padding: '10px 12px',
        transition: 'background 0.08s, box-shadow 0.08s',
      }}>
        {/* Subtle top-left corner glint — the "LED" backlight point */}
        <div style={{
          position: 'absolute',
          top: 8,
          left: 8,
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: isActive
            ? 'radial-gradient(circle, rgba(255,140,100,0.5) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
          transition: 'background 0.08s',
        }} />

        <span style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '2px',
          color: isActive ? 'rgba(255,200,180,0.95)' : 'rgba(160,158,155,0.7)',
          fontFamily: 'JetBrains Mono, monospace',
          textTransform: 'uppercase',
          transition: 'color 0.08s',
          lineHeight: 1,
        }}>
          {id}
        </span>
        <span style={{
          fontSize: 7,
          color: isActive ? 'rgba(255,180,150,0.5)' : 'rgba(120,118,115,0.4)',
          fontFamily: 'JetBrains Mono, monospace',
          marginTop: 3,
          transition: 'color 0.08s',
        }}>
          {keyHint}
        </span>
      </div>
    </div>
  );
});

export default function DrumPads({ activePad, onTrigger }: DrumPadsProps) {
  return (
    <div style={{
      background: '#0A0A0D',
      borderRadius: 16,
      padding: 10,
      boxShadow:
        'inset 0 2px 10px rgba(0,0,0,0.8), ' +
        'inset 0 0 0 1px rgba(255,255,255,0.03)',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        gap: 8,
        height: 300,
      }}>
        {DRUM_PAD_GRID.map(({ id, key }) => (
          <Pad
            key={id}
            id={id}
            keyHint={key}
            isActive={activePad === id}
            onTrigger={onTrigger}
          />
        ))}
      </div>
    </div>
  );
}
