'use client';

import { useEffect, useRef } from 'react';
import { keyToNote } from '@/audio/keymap';
import { AudioEngine } from '@/audio/engine';
import { NoteRecorder } from '@/audio/recorder';

const PREVENT_DEFAULT_KEYS = new Set(['a','s','d','f','g','h','j','k','l','w','e','t','y','u']);

export function useKeyboard(
  engineRef: React.RefObject<AudioEngine | null>,
  recorderRef: React.RefObject<NoteRecorder>,
  octave: number,
  onNoteChange: (note: string | null) => void,
  onInit: () => void,
  disabled = false
) {
  const held = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (disabled) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.repeat) return;
      const key = e.key.toLowerCase();

      if (PREVENT_DEFAULT_KEYS.has(key)) {
        e.preventDefault();
      }

      const note = keyToNote(key, octave);
      if (!note) return;
      if (held.current.has(key)) return;
      held.current.add(key);

      onInit();
      engineRef.current?.triggerNote(note);
      recorderRef.current?.noteOn(note);
      onNoteChange(note);
    }

    function onKeyUp(e: KeyboardEvent) {
      const key = e.key.toLowerCase();
      if (!held.current.has(key)) return;
      held.current.delete(key);

      const note = keyToNote(key, octave);
      if (!note) return;
      engineRef.current?.releaseNote(note);
      recorderRef.current?.noteOff(note);
      onNoteChange(null);
    }

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [engineRef, recorderRef, octave, onNoteChange, onInit, disabled]);
}
