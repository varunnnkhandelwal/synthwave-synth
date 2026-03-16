'use client';

import { useState, useCallback } from 'react';
import { AudioEngine } from '@/audio/engine';
import { NoteRecorder } from '@/audio/recorder';
import { useKeyboard } from '@/hooks/useKeyboard';

interface KeyboardProps {
  octave: number;
  engineRef: React.RefObject<AudioEngine | null>;
  recorderRef: React.RefObject<NoteRecorder>;
  onNoteChange: (note: string | null) => void;
  onInit: () => void;
  disabled?: boolean;
}

// 2 octaves + 1 final C = 15 white keys
// White key indices 0-14: C D E F G A B | C D E F G A B | C
// Black keys sit between white keys at these left-key indices:
// 0(C#), 1(D#), 3(F#), 4(G#), 5(A#)  — octave 1
// 7(C#), 8(D#), 10(F#), 11(G#), 12(A#) — octave 2
const NUM_WHITE = 15;
const WHITE_PCT = 100 / NUM_WHITE; // ~6.667% per white key
const BLACK_W_PCT = WHITE_PCT * 0.62; // black key width

const WHITE_KEY_LABELS = ['A','S','D','F','G','H','J','K','L',';',"'",'Z','X','C','V'];
const BLACK_KEY_LABELS = ['W','E','T','Y','U','I','O','[',']','\\'];

interface NoteKey {
  note: string;
  octave: number;
  label: string;
}

interface BlackKeyDef extends NoteKey {
  whiteIndex: number; // white key immediately to the LEFT
}

function buildKeys(baseOctave: number): { whites: NoteKey[]; blacks: BlackKeyDef[] } {
  const whites: NoteKey[] = [];
  const blacks: BlackKeyDef[] = [];

  const whiteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const blackDefs = [
    { localWhiteIdx: 0, note: 'C#' },
    { localWhiteIdx: 1, note: 'D#' },
    { localWhiteIdx: 3, note: 'F#' },
    { localWhiteIdx: 4, note: 'G#' },
    { localWhiteIdx: 5, note: 'A#' },
  ];

  let whiteIdx = 0;
  let blackIdx = 0;
  for (let oct = 0; oct < 2; oct++) {
    const octNum = baseOctave + oct;
    whiteNames.forEach(n => whites.push({ note: n, octave: octNum, label: WHITE_KEY_LABELS[whiteIdx++] }));
    blackDefs.forEach(({ localWhiteIdx, note }) =>
      blacks.push({ note, octave: octNum, whiteIndex: oct * 7 + localWhiteIdx, label: BLACK_KEY_LABELS[blackIdx++] })
    );
  }
  // Final C
  whites.push({ note: 'C', octave: baseOctave + 2, label: WHITE_KEY_LABELS[whiteIdx] });

  return { whites, blacks };
}

const noteId = (k: NoteKey) => `${k.note}${k.octave}`;

export default function Keyboard({ octave, engineRef, recorderRef, onNoteChange, onInit, disabled }: KeyboardProps) {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const { whites, blacks } = buildKeys(octave);

  const handleAttack = useCallback((note: string) => {
    onInit();
    engineRef.current?.triggerNote(note);
    recorderRef.current?.noteOn(note);
    onNoteChange(note);
    setPressedKeys(prev => new Set(prev).add(note));
  }, [engineRef, recorderRef, onNoteChange, onInit]);

  const handleRelease = useCallback((note: string) => {
    engineRef.current?.releaseNote(note);
    recorderRef.current?.noteOff(note);
    onNoteChange(null);
    setPressedKeys(prev => { const s = new Set(prev); s.delete(note); return s; });
  }, [engineRef, recorderRef, onNoteChange]);

  // Keyboard shortcuts — wired to handleAttack/handleRelease so pressed state updates
  useKeyboard(engineRef, recorderRef, octave, onNoteChange, onInit, disabled, handleAttack, handleRelease);

  return (
    <div style={styles.keyboard}>
      {/* White keys */}
      <div style={styles.whiteRow}>
        {whites.map((k) => {
          const id = noteId(k);
          const pressed = pressedKeys.has(id);
          return (
            <div
              key={id}
              style={pressed ? { ...styles.white, ...styles.whitePressed } : styles.white}
              onMouseDown={() => handleAttack(id)}
              onMouseUp={() => handleRelease(id)}
              onMouseLeave={() => { if (pressedKeys.has(id)) handleRelease(id); }}
              onMouseEnter={(e) => { if (e.buttons === 1) handleAttack(id); }}
            >
              <span style={styles.whiteLabel}>{k.label}</span>
            </div>
          );
        })}
      </div>

      {/* Black keys — absolutely positioned */}
      {blacks.map((bk) => {
        const id = noteId(bk);
        const pressed = pressedKeys.has(id);
        // Center the black key on the boundary between white key [whiteIndex] and [whiteIndex+1]
        const centerPct = (bk.whiteIndex + 1) * WHITE_PCT;
        const leftPct = centerPct - BLACK_W_PCT / 2;
        return (
          <div
            key={id}
            style={{
              ...styles.black,
              ...(pressed ? styles.blackPressed : {}),
              left: `${leftPct}%`,
              width: `${BLACK_W_PCT}%`,
            }}
            onMouseDown={(e) => { e.stopPropagation(); handleAttack(id); }}
            onMouseUp={(e) => { e.stopPropagation(); handleRelease(id); }}
            onMouseLeave={() => { if (pressedKeys.has(id)) handleRelease(id); }}
            onMouseEnter={(e) => { if (e.buttons === 1) handleAttack(id); }}
          >
            <span style={styles.blackLabel}>{bk.label}</span>
          </div>
        );
      })}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  keyboard: {
    position: 'relative',
    height: 90,
    borderRadius: 8,
    overflow: 'hidden',
    userSelect: 'none',
    zIndex: 1,
  },
  whiteRow: {
    display: 'flex',
    height: '100%',
    gap: 2,
  },
  white: {
    flex: 1,
    background: 'linear-gradient(180deg, #E8E6E1 0%, #D4D2CD 100%)',
    borderRadius: '0 0 5px 5px',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(0,0,0,0.15)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: 4,
    transition: 'background 0.05s',
  },
  whitePressed: {
    background: 'linear-gradient(180deg, #f0c4b8 0%, #e8a090 50%, #D4C0BC 100%)',
    boxShadow: 'inset 0 3px 8px rgba(232,89,60,0.25), 0 0 10px rgba(232,89,60,0.15)',
    borderColor: 'rgba(232,89,60,0.3)',
  },
  whiteLabel: {
    fontSize: 7,
    fontWeight: 400,
    color: '#8A8883',
    fontFamily: 'JetBrains Mono, monospace',
  },
  black: {
    position: 'absolute',
    top: 0,
    height: '56%',
    background: 'linear-gradient(180deg, #2A2A2E 0%, #1A1A1E 100%)',
    borderRadius: '0 0 4px 4px',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(0,0,0,0.5)',
    cursor: 'pointer',
    zIndex: 2,
    transition: 'background 0.05s',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  blackPressed: {
    background: 'linear-gradient(180deg, #5A2218 0%, #3D1610 100%)',
    boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6), 0 0 12px rgba(232,89,60,0.3)',
    borderColor: 'rgba(232,89,60,0.4)',
  },
  blackLabel: {
    position: 'absolute' as const,
    bottom: 4,
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: 6,
    fontWeight: 400,
    color: 'rgba(255,255,255,0.35)',
    fontFamily: 'JetBrains Mono, monospace',
    pointerEvents: 'none',
    userSelect: 'none',
  },
};
