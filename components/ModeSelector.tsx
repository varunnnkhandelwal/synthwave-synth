'use client';

type Mode = 'SYN' | 'PAD' | 'SEQ';

interface ModeSelectorProps {
  mode: Mode;
  onModeChange: (m: Mode) => void;
}

const MODES: Mode[] = ['SYN', 'PAD', 'SEQ'];

export default function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  return (
    <div style={styles.tray}>
      {MODES.map((m) => (
        <button
          key={m}
          style={mode === m ? { ...styles.btn, ...styles.btnActive } : styles.btn}
          onClick={() => onModeChange(m)}
        >
          {m}
        </button>
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  tray: {
    display: 'flex',
    gap: 6,
    padding: 7,
    background: '#111114',
    borderRadius: 14,
    boxShadow:
      'inset 0 2px 8px rgba(0,0,0,0.75), ' +
      'inset 0 0 0 1px rgba(255,255,255,0.02), ' +
      '0 1px 0 rgba(255,255,255,0.03)',
  },
  btn: {
    flex: 1,
    height: 44,
    background: 'linear-gradient(180deg, #242428 0%, #1E1E22 50%, #1A1A1E 100%)',
    border: '1px solid rgba(255,255,255,0.04)',
    borderRadius: 10,
    color: 'var(--t3)',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '2.5px',
    // Engraved text: dark shadow on top, light highlight below
    textShadow: '0 -1px 0 rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04)',
    boxShadow:
      '0 2px 4px rgba(0,0,0,0.35), ' +
      '0 1px 0 rgba(255,255,255,0.03), ' +
      'inset 0 1px 0 rgba(255,255,255,0.04)',
    transition: 'all 0.15s ease',
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
};
