'use client';

interface StatusBarProps {
  ready: boolean;
  latency: number;
  voices: number;
  statusOverride?: string;
}

export default function StatusBar({ ready, latency, voices, statusOverride }: StatusBarProps) {
  const label = statusOverride ?? (ready ? 'Audio engine ready' : 'Click to start audio');
  const dotColor = statusOverride ? 'var(--warm)' : ready ? 'var(--terminal)' : 'var(--t3)';
  return (
    <div style={styles.bar}>
      <div style={styles.left}>
        <span
          style={{
            ...styles.dot,
            background: dotColor,
            boxShadow: ready ? `0 0 6px ${dotColor}` : 'none',
            animation: ready ? 'ledPulse 2s ease-in-out infinite' : 'none',
          }}
        />
        <span style={styles.text}>{label}</span>
      </div>
      <span style={styles.text}>Latency: {latency.toFixed(1)}ms</span>
      <span style={styles.text}>{voices} voices</span>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  bar: {
    display: 'flex',
    alignItems: 'center',
    gap: 24,
    paddingTop: 8,
    borderTop: '1px solid rgba(255,255,255,0.04)',
    position: 'relative',
    zIndex: 1,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    flexShrink: 0,
  },
  text: {
    fontSize: 9,
    fontWeight: 400,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: 'var(--t3)',
    fontFamily: 'JetBrains Mono, monospace',
    textShadow: '0 -1px 0 rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.03)',
  },
};
