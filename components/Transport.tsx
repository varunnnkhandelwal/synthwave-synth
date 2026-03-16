'use client';

import { RecordingState, PlaybackState, ExportState } from '@/types';

interface TransportProps {
  playing: boolean;
  octave: number;
  bpm: number;
  showOctave: boolean;
  recordingState: RecordingState;
  playbackState: PlaybackState;
  exportState: ExportState;
  elapsedTime: number;
  onRec: () => void;
  onPlay: () => void;
  onStop: () => void;
  onExport: () => void;
  onOctaveUp: () => void;
  onOctaveDown: () => void;
  onBpmUp: () => void;
  onBpmDown: () => void;
}

function formatElapsed(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function Transport({
  octave, bpm, showOctave,
  recordingState, playbackState, exportState, elapsedTime,
  onRec, onPlay, onStop, onExport,
  onOctaveUp, onOctaveDown, onBpmUp, onBpmDown,
}: TransportProps) {
  const isRecording = recordingState === 'recording';
  const hasRecording = recordingState === 'hasRecording';
  const isPlaying = playbackState === 'playing';
  const isExporting = exportState === 'exporting';
  const disabled = isExporting;

  return (
    <div style={styles.bar}>
      {/* Transport buttons */}
      <div style={styles.tray}>
        {/* REC */}
        <button
          style={{
            ...styles.btn,
            ...(isRecording ? styles.btnRecActive : {}),
            opacity: disabled ? 0.4 : 1,
          }}
          onClick={onRec}
          disabled={disabled || isPlaying}
          title="Record"
        >
          <span style={{ ...styles.recDot, animation: isRecording ? 'ledPulse 0.8s ease-in-out infinite' : 'none' }} />
          {isRecording ? formatElapsed(elapsedTime) : 'REC'}
        </button>

        {/* PLAY */}
        <button
          style={{
            ...styles.btn,
            color: 'var(--terminal)',
            textShadow: '0 -1px 0 rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04)',
            ...(isPlaying ? styles.btnActive : {}),
            opacity: (disabled || isRecording) ? 0.4 : 1,
          }}
          onClick={onPlay}
          disabled={disabled || isRecording}
          title="Play"
        >
          <svg width="9" height="11" viewBox="0 0 9 11" fill="currentColor">
            <polygon points="0,0 9,5.5 0,11" />
          </svg>
          PLAY
        </button>

        {/* STOP */}
        <button
          style={{
            ...styles.btn,
            color: 'var(--t2)',
            opacity: disabled ? 0.4 : 1,
          }}
          onClick={onStop}
          disabled={disabled}
          title="Stop"
        >
          <svg width="9" height="9" viewBox="0 0 9 9" fill="currentColor">
            <rect width="9" height="9" />
          </svg>
          STOP
        </button>

        {/* EXPORT — only shown when recording exists */}
        {hasRecording && (
          <button
            style={{
              ...styles.btn,
              color: isExporting ? 'var(--warm)' : 'var(--t2)',
              animation: isExporting ? 'ledPulse 1s ease-in-out infinite' : 'none',
              opacity: (isPlaying || isRecording) ? 0.4 : 1,
            }}
            onClick={onExport}
            disabled={isPlaying || isRecording || isExporting}
            title="Export WAV"
          >
            <svg width="11" height="12" viewBox="0 0 11 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M5.5 1v7M2 6l3.5 3.5L9 6" />
              <path d="M1 11h9" />
            </svg>
            {isExporting ? 'Exporting...' : 'EXPORT'}
          </button>
        )}
      </div>

      <div style={styles.spacer} />

      {/* Octave — hidden in PAD mode */}
      {showOctave && (
        <div style={styles.group}>
          <span style={styles.groupLabel}>Oct</span>
          <button style={styles.smallBtn} onClick={onOctaveDown} disabled={octave <= 1}>−</button>
          <span style={styles.value}>{octave}</span>
          <button style={styles.smallBtn} onClick={onOctaveUp} disabled={octave >= 7}>+</button>
        </div>
      )}

      {/* BPM */}
      <div style={styles.group}>
        <span style={styles.groupLabel}>BPM</span>
        <button style={styles.smallBtn} onClick={onBpmDown} disabled={bpm <= 60}>−</button>
        <span style={styles.value}>{bpm}</span>
        <button style={styles.smallBtn} onClick={onBpmUp} disabled={bpm >= 200}>+</button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  bar: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
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
    height: 40,
    padding: '0 12px',
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    background: 'linear-gradient(180deg, #242428 0%, #1E1E22 50%, #1A1A1E 100%)',
    border: '1px solid rgba(255,255,255,0.04)',
    borderRadius: 10,
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '2.5px',
    color: 'var(--t3)',
    textShadow: '0 -1px 0 rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04)',
    boxShadow:
      '0 2px 4px rgba(0,0,0,0.35), ' +
      '0 1px 0 rgba(255,255,255,0.03), ' +
      'inset 0 1px 0 rgba(255,255,255,0.04)',
    transition: 'all 0.15s ease',
    cursor: 'pointer',
    fontFamily: 'JetBrains Mono, monospace',
  },
  btnActive: {
    background: 'linear-gradient(180deg, #1A1A1E 0%, #161618 50%, #131316 100%)',
    border: '1px solid rgba(232,89,60,0.4)',
    textShadow: '0 0 8px rgba(232,89,60,0.3), 0 -1px 0 rgba(0,0,0,0.5)',
    boxShadow:
      '0 0 12px rgba(232,89,60,0.08), ' +
      'inset 0 2px 6px rgba(0,0,0,0.5), ' +
      'inset 0 0 0 1px rgba(232,89,60,0.05)',
  },
  btnRecActive: {
    background: 'linear-gradient(180deg, #1A1A1E 0%, #161618 50%, #131316 100%)',
    border: '1px solid rgba(232,89,60,0.5)',
    color: '#E8593C',
    textShadow: '0 0 10px rgba(232,89,60,0.35), 0 -1px 0 rgba(0,0,0,0.5)',
    boxShadow:
      '0 0 16px rgba(232,89,60,0.15), ' +
      'inset 0 2px 6px rgba(0,0,0,0.5)',
  },
  recDot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: '#E8593C',
    boxShadow: '0 0 6px #E8593C',
    flexShrink: 0,
  },
  spacer: { flex: 1 },
  group: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  groupLabel: {
    fontSize: 9,
    fontWeight: 500,
    letterSpacing: '1.5px',
    color: 'var(--t3)',
    textTransform: 'uppercase',
    fontFamily: 'JetBrains Mono, monospace',
    textShadow: '0 -1px 0 rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.03)',
  },
  value: {
    fontSize: 15,
    fontWeight: 700,
    color: 'var(--t1)',
    minWidth: 28,
    textAlign: 'center',
    fontFamily: 'JetBrains Mono, monospace',
  },
  smallBtn: {
    width: 30,
    height: 30,
    background: 'linear-gradient(180deg, #242428 0%, #1E1E22 50%, #1A1A1E 100%)',
    border: '1px solid rgba(255,255,255,0.04)',
    borderRadius: 8,
    color: 'var(--t2)',
    fontSize: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    textShadow: '0 -1px 0 rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04)',
    boxShadow:
      '0 2px 4px rgba(0,0,0,0.35), ' +
      '0 1px 0 rgba(255,255,255,0.03), ' +
      'inset 0 1px 0 rgba(255,255,255,0.04)',
    fontFamily: 'JetBrains Mono, monospace',
    lineHeight: 1,
  },
};
