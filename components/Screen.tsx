'use client';

import RadialVisualizer from './RadialVisualizer';
import CRTNoise from './CRTNoise';
import { AudioEngine } from '@/audio/engine';
import { RecordingState, PlaybackState } from '@/types';

interface ScreenProps {
  activeNote: string | null;
  engineRef: React.RefObject<AudioEngine | null>;
  recordingState: RecordingState;
  playbackState: PlaybackState;
}

export default function Screen({ activeNote, engineRef, recordingState, playbackState }: ScreenProps) {
  return (
    <div style={styles.screen}>
      {/* Animated grain noise */}
      <CRTNoise />

      {/* Scanline overlay */}
      <div style={styles.scanlines} />

      {/* Header */}
      <div style={styles.header}>
        <span style={styles.meta}>M — 01</span>
        <span style={styles.meta}>Audio_out</span>
      </div>

      {/* Visualizer */}
      <div style={styles.visualizerWrap}>
        <RadialVisualizer engineRef={engineRef} activeNote={activeNote} recordingState={recordingState} playbackState={playbackState} />
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <span style={styles.noteDisplay}>{activeNote ?? ''}</span>
        <span style={styles.meta}>44.1 kHz</span>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  screen: {
    flex: 1,
    background: '#111114',
    border: '2px solid #0A0A0C',
    borderRadius: 12,
    boxShadow: 'inset 0 3px 12px rgba(0,0,0,0.8)',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  },
  scanlines: {
    position: 'absolute',
    inset: 0,
    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.09) 2px, rgba(0,0,0,0.09) 4px)',
    pointerEvents: 'none',
    zIndex: 3,
    borderRadius: 10,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 12,
    position: 'relative',
    zIndex: 2,
  },
  meta: {
    fontSize: 9,
    fontWeight: 400,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: 'var(--t3)',
  },
  visualizerWrap: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 2,
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 12,
    position: 'relative',
    zIndex: 2,
  },
  noteDisplay: {
    fontSize: 22,
    fontWeight: 700,
    color: '#E8593C',
    animation: 'noteFlicker 4s ease-in-out infinite',
    fontFamily: 'JetBrains Mono, monospace',
    minHeight: 28,
    display: 'inline-block',
  },
};
