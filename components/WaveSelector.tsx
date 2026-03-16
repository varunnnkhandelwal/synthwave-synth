'use client';

import { WaveType } from '@/audio/engine';

interface WaveSelectorProps {
  wave: WaveType;
  onWaveChange: (w: WaveType) => void;
}

const WAVES: { type: WaveType; icon: React.ReactNode; label: string }[] = [
  {
    type: 'square',
    label: 'SQR',
    icon: (
      <svg width="22" height="16" viewBox="0 0 22 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1,12 1,4 11,4 11,12 21,12 21,4" />
      </svg>
    ),
  },
  {
    type: 'sawtooth',
    label: 'SAW',
    icon: (
      <svg width="22" height="16" viewBox="0 0 22 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1,12 11,4 11,12 21,4" />
      </svg>
    ),
  },
  {
    type: 'sine',
    label: 'SIN',
    icon: (
      <svg width="22" height="16" viewBox="0 0 22 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1,8 C4,4 7,4 11,8 C15,12 18,12 21,8" />
      </svg>
    ),
  },
  {
    type: 'triangle',
    label: 'TRI',
    icon: (
      <svg width="22" height="16" viewBox="0 0 22 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="1,12 6,4 11,12 16,4 21,12" />
      </svg>
    ),
  },
];

export default function WaveSelector({ wave, onWaveChange }: WaveSelectorProps) {
  return (
    <div>
      <div style={styles.sectionLabel}>WAVEFORM</div>
      <div style={styles.tray}>
        {WAVES.map((w) => (
          <button
            key={w.type}
            style={wave === w.type ? { ...styles.btn, ...styles.btnActive } : styles.btn}
            onClick={() => onWaveChange(w.type)}
            title={w.type}
          >
            {w.icon}
            <span style={styles.waveLabel}>{w.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  sectionLabel: {
    fontSize: 9,
    fontWeight: 500,
    letterSpacing: '2.5px',
    textTransform: 'uppercase',
    color: 'var(--t3)',
    marginBottom: 8,
    textAlign: 'center',
    textShadow: '0 -1px 0 rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.03)',
  },
  tray: {
    display: 'flex',
    gap: 6,
    padding: 6,
    background: '#111114',
    borderRadius: 12,
    boxShadow:
      'inset 0 2px 8px rgba(0,0,0,0.75), ' +
      'inset 0 0 0 1px rgba(255,255,255,0.02), ' +
      '0 1px 0 rgba(255,255,255,0.03)',
  },
  btn: {
    flex: 1,
    height: 40,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    background: 'linear-gradient(180deg, #242428 0%, #1E1E22 50%, #1A1A1E 100%)',
    border: '1px solid rgba(255,255,255,0.04)',
    borderRadius: 9,
    color: 'var(--t3)',
    textShadow: '0 -1px 0 rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04)',
    boxShadow:
      '0 2px 4px rgba(0,0,0,0.35), ' +
      '0 1px 0 rgba(255,255,255,0.03), ' +
      'inset 0 1px 0 rgba(255,255,255,0.04)',
    transition: 'all 0.15s ease',
    cursor: 'pointer',
  },
  btnActive: {
    background: 'linear-gradient(180deg, #1A1A1E 0%, #161618 50%, #131316 100%)',
    border: '1px solid rgba(232,89,60,0.4)',
    color: '#E8593C',
    textShadow: '0 0 8px rgba(232,89,60,0.3), 0 -1px 0 rgba(0,0,0,0.5)',
    boxShadow:
      '0 0 12px rgba(232,89,60,0.08), ' +
      'inset 0 2px 6px rgba(0,0,0,0.5), ' +
      'inset 0 0 0 1px rgba(232,89,60,0.05)',
  },
  waveLabel: {
    fontSize: 8,
    fontWeight: 500,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
  },
};
