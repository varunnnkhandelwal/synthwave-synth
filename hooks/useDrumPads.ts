'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import * as Tone from 'tone';
import { DrumEngine, DRUM_PAD_GRID } from '@/audio/drums';
import { AudioEngine } from '@/audio/engine';
import { NoteRecorder } from '@/audio/recorder';

const KEY_TO_PAD: Record<string, string> = {};
DRUM_PAD_GRID.forEach(({ id, key }) => {
  KEY_TO_PAD[key.toLowerCase()] = id;
});
const PAD_KEYS = new Set(Object.keys(KEY_TO_PAD));

export function useDrumPads(
  engineRef: React.RefObject<AudioEngine | null>,
  recorderRef: React.RefObject<NoteRecorder>,
  onInit: () => Promise<void>,
  disabled: boolean
) {
  const drumRef = useRef<DrumEngine | null>(null);
  const [activePad, setActivePad] = useState<string | null>(null);

  const initDrums = useCallback(async () => {
    if (drumRef.current) return;
    // Ensure main audio engine is up — it owns the analyser we want to feed
    await onInit();
    if (!engineRef.current) return;
    const drums = new DrumEngine();
    // Connect to analyser so the visualizer reacts, then analyser → destination
    drums.init(engineRef.current.analyser);
    drumRef.current = drums;
  }, [engineRef, onInit]);

  const triggerPad = useCallback(async (id: string) => {
    // Unlock AudioContext synchronously in the user-gesture frame
    void Tone.start();
    await initDrums();
    if (!drumRef.current) return;
    // Small lookahead avoids scheduling in the past right after context resume
    drumRef.current.trigger(id, Tone.now() + 0.05);
    recorderRef.current?.noteOn(id);
    setTimeout(() => recorderRef.current?.noteOff(id), 100);
    setActivePad(id);
    setTimeout(() => setActivePad(prev => (prev === id ? null : prev)), 150);
  }, [initDrums, recorderRef]);

  useEffect(() => {
    if (disabled) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.repeat) return;
      const key = e.key.toLowerCase();
      if (!PAD_KEYS.has(key)) return;
      e.preventDefault();
      triggerPad(KEY_TO_PAD[key]);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [disabled, triggerPad]);

  useEffect(() => {
    return () => {
      drumRef.current?.dispose();
      drumRef.current = null;
    };
  }, []);

  return { drumRef, activePad, triggerPad, initDrums };
}
